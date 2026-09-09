// ============================================================
//  J.A.R.V.I.S client lib — voice, speech, local commands
// ============================================================
"use client";

import { OLD_SONGS, NEW_ERAS } from "./musicData";

export type JarvisAction =
  | { type: "time" }
  | { type: "date" }
  | { type: "open-window"; window: string }
  | { type: "play-song"; song: string }
  | { type: "radio-on" }
  | { type: "radio-off" }
  | { type: "remember"; text: string }
  | { type: "forget" }
  | { type: "memory-list" }
  | { type: "shutdown" }
  | { type: "none" };

/* ---------- speech synthesis ---------- */

export function setJarvisVoice(voice: SpeechSynthesisVoice | null) {
  if (typeof window === "undefined") return;
  if (voice) localStorage.setItem("jarvis-voice", voice.name);
  else localStorage.removeItem("jarvis-voice");
}

export function pickJarvisVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const saved = localStorage.getItem("jarvis-voice");
  if (saved) {
    const v = voices.find((x) => x.name === saved);
    if (v) return v;
  }
  return (
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices.find((v) => /en-GB/i.test(v.lang)) ||
    voices.find((v) => /en-US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0]
  );
}

export function jarvisSpeak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const clean = text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/[*_`#]/g, "")
      .slice(0, 400);
    const u = new SpeechSynthesisUtterance(clean);
    const v = pickJarvisVoice();
    if (v) u.voice = v;
    u.rate = 1.02;
    u.pitch = 0.95;
    u.volume = 1;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  } catch {
    /* TTS unavailable */
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}

/* ---------- HUD beep ---------- */

let audioCtx: AudioContext | null = null;

export function playHudBeep(freq = 880, dur = 0.09, gain = 0.05) {
  if (typeof window === "undefined") return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t);
    o.stop(t + dur);
  } catch {
    /* audio blocked */
  }
}

/* ---------- speech recognition ---------- */

export function createRecognition(onResult: (text: string) => void, onEnd?: () => void): unknown | null {
  if (typeof window === "undefined") return null;
  const W = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
  if (!SR) return null;
   
  const rec = new (SR as any)();
  rec.lang = "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e: { results: { 0: { transcript: string } }[] }) => {
    const t = e.results?.[0]?.[0]?.transcript;
    if (t) onResult(t);
  };
  if (onEnd) rec.onend = onEnd;
  return rec;
}

/* ---------- formatting ---------- */

export function fmtTime(d = new Date()): string {
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function fmtDate(d = new Date()): string {
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/* ---------- local command parsing (offline, instant) ---------- */

export function isResearchQuery(raw: string): boolean {
  return /\b(news|latest|today'?s?|price of|stock|share market|weather|score|ipl|release date|kya chal raha|taza|khabar|current|update)\b/i.test(
    raw
  );
}

function extractRememberText(raw: string): string {
  return raw
    .replace(/^(jarvis[,\s]*)?remember( that)?[:\s]+/i, "")
    .replace(/^(jarvis[,\s]*)?(yaad rakh[a-z]*|note kar|save this)[:\s]+/i, "")
    .trim();
}

export function parseLocalCommand(raw: string): JarvisAction {
  const t = raw.trim();
  const lower = t.toLowerCase();

  // memory first (before time/date)
  if (/^(remember|yaad rakh|note kar|save this)\b/i.test(lower)) {
    return { type: "remember", text: extractRememberText(t) };
  }
  if (/^(forget everything|sab bhool ja|bhool ja sab|clear memory|memory clear)\b/i.test(lower)) {
    return { type: "forget" };
  }
  if (/(kya yaad (he|hai|rakha)|memory list|what do you remember|meri memories)/i.test(lower)) {
    return { type: "memory-list" };
  }

  // time / date
  if (/\b(time|samay|baje|kitne baje|time kya)\b/i.test(lower) && !/\btimer\b/i.test(lower)) {
    return { type: "time" };
  }
  if (/\b(date|tareekh|aaj kaunsi|today'?s date|din kaunsa)\b/i.test(lower)) {
    return { type: "date" };
  }

  // window launcher
  const winMap: [RegExp, string][] = [
    [/\b(open|kholo|show).*(admin|leads?|crm|enquir)\b/i, "admin"],
    [/\b(open|kholo|show).*(project|kaam)\b/i, "projects"],
    [/\b(open|kholo|show).*(resume|cv)\b/i, "resume"],
    [/\b(open|kholo|show).*(skill|expertise)\b/i, "skills"],
    [/\b(open|kholo|show).*(contact|mail)\b/i, "contact"],
    [/\b(open|kholo|show).*(about|intro)\b/i, "about"],
    [/\b(open|kholo|show).*(computer|system)\b/i, "computer"],
    [/\b(open|kholo|show).*(recycle|dustbin|kachra)\b/i, "recycle"],
  ];
  for (const [re, win] of winMap) {
    if (re.test(t)) return { type: "open-window", window: win };
  }

  // music
  if (/\b(play|chala|chala do|bajao|sunao)\b.*\b(song|gaana|gana|music|old song|naya|new song)\b/i.test(lower) || /^(play|bajao)\b/i.test(lower)) {
    if (/\b(radio|kuch bhi|anything|old songs? music)\b/i.test(lower) || /old song/i.test(lower) && !/\b(play|chala|bajao)\s+["']?([\w\s]+)["']?\b.*specific/i.test(t)) {
      // "play old song" style → radio
      return { type: "radio-on" };
    }
    const m = t.match(/\b(?:play|chala(?: do)?|bajao|sunao)\s+["']?([\w\s']+?)["']?(?:\s+song|\s+gaana)?$/i);
    if (m && m[1]) {
      const q = m[1].trim().toLowerCase();
      if (q && !/^(a |an |the )?(song|gaana|music|old song|new song)$/i.test(q)) {
        return { type: "play-song", song: q };
      }
    }
    return { type: "radio-on" };
  }
  if (/\b(stop music|music band|gaana band|pause song|radio band|radio off)\b/i.test(lower)) {
    return { type: "radio-off" };
  }
  if (/\b(old song|purane gaane|old music)\b/i.test(lower) && /\b(play|chala|bajao|lao|on)\b/i.test(lower)) {
    return { type: "radio-on" };
  }

  // shutdown / exit
  if (/\b(shutdown|shut down|exit jarvis|band karo|bye jarvis|goodbye)\b/i.test(lower)) {
    return { type: "shutdown" };
  }

  return { type: "none" };
}

/** find the closest song in library by loose title match */
export function findSong(query: string): { title: string; artist: string } | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const all = [...OLD_SONGS, ...NEW_ERAS];
  const exact = all.find((s) => s.title.toLowerCase() === q);
  if (exact) return { title: exact.title, artist: exact.artist };
  const partial = all.find((s) => s.title.toLowerCase().includes(q) || q.includes(s.title.toLowerCase()));
  if (partial) return { title: partial.title, artist: partial.artist };
  // word-overlap scoring
  const qWords = q.split(/\s+/).filter((w) => w.length > 2);
  let best: { s: (typeof all)[0]; score: number } | null = null;
  for (const s of all) {
    const hay = `${s.title} ${s.artist}`.toLowerCase();
    const score = qWords.filter((w) => hay.includes(w)).length;
    if (score > 0 && (!best || score > best.score)) best = { s, score };
  }
  return best ? { title: best.s.title, artist: best.s.artist } : null;
}
