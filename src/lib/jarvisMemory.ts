// ============================================================
//  J.A.R.V.I.S MEMORY CORE — persistent localStorage memory
//  remember / forget / list — used by AI prompt injection + panel
// ============================================================
"use client";

const MEMORY_KEY = "jarvis-memory-v1";
export const MEMORY_MAX = 12;
const NOTE_MAX = 160;
const MEMORY_EVENT = "jarvis-memory-changed";

function safeParse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, MEMORY_MAX) : [];
  } catch {
    return [];
  }
}

export function getMemories(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(MEMORY_KEY));
}

function saveAll(list: string[]) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(list.slice(0, MEMORY_MAX)));
  window.dispatchEvent(new CustomEvent(MEMORY_EVENT));
}

export function addMemory(text: string): boolean {
  const t = text.trim().slice(0, NOTE_MAX);
  if (!t) return false;
  const list = getMemories();
  if (list.some((m) => m.toLowerCase() === t.toLowerCase())) return false; // dedupe
  list.unshift(t);
  saveAll(list);
  return true;
}

export function removeMemory(index: number): boolean {
  const list = getMemories();
  if (index < 0 || index >= list.length) return false;
  list.splice(index, 1);
  saveAll(list);
  return true;
}

export function clearMemories(): number {
  const n = getMemories().length;
  saveAll([]);
  return n;
}

const MEMORY_EMPTY: string[] = [];

export function subscribeMemory(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener(MEMORY_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(MEMORY_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// useSyncExternalStore REQUIRES a stable snapshot reference between renders —
// return the cached array unless content actually changed (else infinite loop!)
let snapshotCache: string[] = MEMORY_EMPTY;

export function getMemorySnapshot(): string[] {
  if (typeof window === "undefined") return MEMORY_EMPTY;
  const cur = getMemories();
  if (cur.length === snapshotCache.length && cur.every((m, i) => m === snapshotCache[i])) {
    return snapshotCache;
  }
  snapshotCache = cur;
  return snapshotCache;
}
