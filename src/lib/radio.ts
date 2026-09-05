// ============================================================
//  RADIO ENGINE — YouTube Music powered playback
//  Global state machine + YouTube IFrame player bridge.
//  videoId resolution: cache -> /api/ytmusic (web_search) -> skip
// ============================================================
"use client";

import { OLD_SONGS, NEW_ERAS, songSearchQuery, type Song } from "./musicData";

export type RadioSource = "OLD" | "NEW";

export interface RadioState {
  on: boolean;
  playing: boolean;
  loading: boolean;
  song: Song | null;
  source: RadioSource;
  error: string | null;
  volume: number;
  resolvedFrom: "cache" | "web" | "preset" | null;
  muted: boolean;
}

type YTPlayer = {
  loadVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (v: number) => void;
  mute: () => void;
  unMute: () => void;
  getPlayerState?: () => number;
  destroy: () => void;
};

let player: YTPlayer | null = null;
let playerReady = false;
let pendingId: string | null = null;

const RADIO_EVENT = "jarvis-radio-changed";
const CACHE_KEY = "yt-resolved-v1";
const FAIL_TTL = 1000 * 60 * 5; // failed lookups retry after 5min (search is stochastic)

let state: RadioState = {
  on: false,
  playing: false,
  loading: false,
  song: null,
  source: "OLD",
  error: null,
  volume: 85,
  resolvedFrom: null,
  muted: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(RADIO_EVENT));
}

export function getRadioState(): RadioState {
  return state;
}

export function subscribeRadio(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getRadioSnapshot(): RadioState {
  return state;
}

/* ---------- resolution cache ---------- */

type CacheEntry = { id: string; at: number } | { fail: true; at: number };

function readCache(): Record<string, CacheEntry> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeCache(key: string, entry: CacheEntry) {
  if (typeof window === "undefined") return;
  const c = readCache();
  c[key] = entry;
  try {
    // keep cache under ~400 entries
    const keys = Object.keys(c);
    if (keys.length > 400) delete c[keys[0]];
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* storage full — ignore */
  }
}

function songKey(s: Song): string {
  return `${s.title}|${s.artist}`.toLowerCase();
}

async function resolveVideoId(song: Song): Promise<string[]> {
  const key = songKey(song);
  const cached = readCache()[key];
  if (cached) {
    if ("fail" in cached && Date.now() - cached.at < FAIL_TTL) return [];
    if ("id" in cached) {
      state = { ...state, resolvedFrom: "cache" };
      return [cached.id];
    }
  }
  try {
    const res = await fetch(`/api/ytmusic?q=${encodeURIComponent(songSearchQuery(song))}`);
    const data = await res.json();
    const ids: string[] = Array.isArray(data?.videoIds) && data.videoIds.length ? data.videoIds : data?.videoId ? [data.videoId] : [];
    if (ids.length) {
      writeCache(key, { id: ids[0], at: Date.now() });
      state = { ...state, resolvedFrom: "web" };
      return ids;
    }
  } catch {
    /* network hiccup */
  }
  writeCache(key, { fail: true, at: Date.now() });
  return [];
}

/* ---------- player bridge (called by YtPlayerHost) ---------- */

export function attachYtPlayer(p: YTPlayer | null) {
  player = p;
  playerReady = !!p;
  if (p && pendingId) {
    const id = pendingId;
    pendingId = null;
    p.loadVideoById(id);
    state = { ...state, playing: true };
    emit();
  }
}

export function isPlayerReady(): boolean {
  return playerReady;
}

/* ---------- controls ---------- */

function playlist(source: RadioSource): Song[] {
  return source === "OLD" ? OLD_SONGS : NEW_ERAS;
}

function setSongInternal(song: Song, list: Song[]) {
  state = { ...state, song, source: list === OLD_SONGS ? "OLD" : "NEW" };
}

/** remaining candidate ids for the current song (embed retry on error) */
let candidateQueue: string[] = [];

async function playSong(song: Song) {
  state = { ...state, on: true, loading: true, error: null, song };
  emit();

  const candidates = song.ytId ? [song.ytId] : await resolveVideoId(song);
  if (!candidates.length) {
    state = { ...state, loading: false, error: `Link nahi mila: ${song.title} — skip kar raha hu` };
    emit();
    setTimeout(() => nextSong(), 1200);
    return;
  }

  candidateQueue = candidates.slice(1);
  loadCandidate(candidates[0]);
}

function loadCandidate(videoId: string) {
  if (player && playerReady) {
    try {
      playStartedAt = Date.now();
      playedDurationOk = false;
      player.setVolume(state.volume);
      player.loadVideoById(videoId);
      // autoplay policy: explicitly kick playback after load
      setTimeout(() => {
        try {
          player?.playVideo();
        } catch {
          /* blocked */
        }
      }, 350);
      armAutoplayWatchdog();
      state = { ...state, playing: true, loading: false };
      emit();
    } catch {
      pendingId = videoId;
      state = { ...state, playing: false, loading: false };
      emit();
    }
  } else {
    // player not ready yet — queue it; YtPlayerHost will pick it up
    pendingId = videoId;
    state = { ...state, playing: true, loading: false };
    emit();
  }
}

/* autoplay watchdog: if still not playing after 2.6s, fall back to
   muted autoplay (always allowed) and surface an Unmute button */
let watchdog: ReturnType<typeof setTimeout> | null = null;
let playStartedAt = 0;
let playedDurationOk = false;
let mutedFallbackTried = false;

function armAutoplayWatchdog() {
  if (watchdog) clearTimeout(watchdog);
  watchdog = setTimeout(() => {
    watchdog = null;
    let ps = -1;
    try {
      ps = player?.getPlayerState?.() ?? -1;
    } catch {
      /* ignore */
    }
    if (ps !== 1 && state.playing && !mutedFallbackTried) {
      mutedFallbackTried = true; // only once per session — never skip-spam
      try {
        player?.mute();
        player?.playVideo();
        state = { ...state, muted: true };
        emit();
      } catch {
        /* nothing more we can do */
      }
    }
  }, 2600);
}

export function unmuteRadio() {
  try {
    player?.unMute();
    player?.setVolume(state.volume);
    player?.playVideo();
  } catch {
    /* ignore */
  }
  state = { ...state, muted: false };
  emit();
}

export async function radioPowerToggle() {
  if (state.on && state.playing) {
    player?.pauseVideo();
    state = { ...state, on: false, playing: false };
    emit();
  } else if (state.on && !state.playing && state.song) {
    player?.playVideo();
    state = { ...state, on: true, playing: true };
    emit();
  } else {
    const list = playlist(state.source);
    const start = Math.floor(Math.random() * list.length);
    await playSong(list[start]);
  }
}

export async function radioStart(source: RadioSource = state.source) {
  const list = playlist(source);
  const start = Math.floor(Math.random() * list.length);
  await playSong(list[start]);
}

export async function requestSong(song: Song) {
  // figure out which list it belongs to, so next/prev continue in it
  const isOld = OLD_SONGS.some((s) => s.id === song.id);
  state = { ...state, source: isOld ? "OLD" : "NEW" };
  await playSong(song);
}

function shiftSong(dir: 1 | -1) {
  const source = state.source;
  const list = playlist(source);
  if (!list.length) return;
  const curIdx = state.song ? list.findIndex((s) => s.id === state.song!.id) : -1;
  const nextIdx = (curIdx + dir + list.length) % list.length;
  return list[nextIdx];
}

export async function nextSong() {
  const next = shiftSong(1);
  if (next) await playSong(next);
}

export async function prevSong() {
  const prev = shiftSong(-1);
  if (prev) await playSong(prev);
}

export function togglePlayPause() {
  if (!state.on) {
    void radioPowerToggle();
    return;
  }
  if (state.playing) {
    player?.pauseVideo();
    state = { ...state, playing: false };
  } else {
    player?.playVideo();
    state = { ...state, playing: true };
  }
  emit();
}

export function setVolume(v: number) {
  const vol = Math.max(0, Math.min(100, Math.round(v)));
  state = { ...state, volume: vol };
  player?.setVolume(vol);
  emit();
}

/** called by YtPlayerHost on player error — retry next candidate, else auto skip */
export function handlePlayerError(code?: number) {
  if (typeof window !== "undefined") {
    console.warn(`[radio] player error${code !== undefined ? ` code=${code}` : ""} — song: ${state.song?.title || "?"}`);
  }
  const next = candidateQueue.shift();
  if (next) {
    loadCandidate(next);
    return;
  }
  const title = state.song?.title;
  state = { ...state, playing: false, error: title ? `${title} unavailable — next song` : "Playback error" };
  emit();
  setTimeout(() => nextSong(), 800);
}

export function handlePlayerStateChange(ytState: number) {
  // 1 = playing, 2 = paused, 0 = ended
  if (typeof window !== "undefined") {
    console.info(`[radio] ytState=${ytState} song=${state.song?.title || "?"} elapsed=${Date.now() - playStartedAt}ms`);
  }
  if (ytState === 0) {
    // guard: "ended" within 5s of load means playback never really started
    // (blocked autoplay / codec-less env) — do NOT skip-spam the playlist
    if (!playedDurationOk && Date.now() - playStartedAt < 5000) {
      state = { ...state, playing: false, error: "Browser ne playback roka — Play dabao ya unmute karo" };
      emit();
      return;
    }
    void nextSong();
  } else if (ytState === 1) {
    if (!playedDurationOk) {
      playedDurationOk = true;
      if (watchdog) {
        clearTimeout(watchdog);
        watchdog = null;
      }
    }
    state = { ...state, playing: true, loading: false };
    emit();
  } else if (ytState === 2) {
    state = { ...state, playing: false };
    emit();
  }
}
