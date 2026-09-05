import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";

// server-side cache: query -> videoId | "FAIL"
const memCache = new Map<string, { id: string | null; at: number }>();
const FAIL_TTL = 1000 * 60 * 10;
const OK_TTL = 1000 * 60 * 60 * 24 * 30;

const ID_RE =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*?v=|shorts\/|embed\/|live\/|podcast\/)|youtu\.be\/)([\w-]{11})/;

function extractVideoIds(results: unknown[]): string[] {
  const ids: string[] = [];
  for (const r of results) {
    const url: string = (r as { url?: string }).url || "";
    const m = url.match(ID_RE);
    if (m && !ids.includes(m[1])) ids.push(m[1]);
    if (ids.length >= 3) break;
  }
  return ids;
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 120);
  if (!q) return NextResponse.json({ ok: false, error: "missing q" }, { status: 400 });

  const key = q.toLowerCase();
  const hit = memCache.get(key);
  if (hit) {
    const ttl = hit.id ? OK_TTL : FAIL_TTL;
    if (Date.now() - hit.at < ttl) {
      return NextResponse.json({ ok: !!hit.id, videoId: hit.id, cached: true });
    }
  }

  try {
    const zai = await ZAI.create();
    const queries = [
      `${q} full song youtube`,
      `${q} song youtube watch`,
      `${q} hd song youtube`,
    ];
    let videoIds: string[] = [];
    let rateLimited = false;
    for (let attempt = 0; attempt < 2 && !videoIds.length; attempt++) {
      for (const query of queries) {
        if (videoIds.length) break;
        try {
          const res = (await zai.functions.invoke("web_search", { query, num: 8 })) as unknown[];
          videoIds = extractVideoIds(res);
        } catch (e) {
          const msg = (e as Error).message || "";
          if (/429|too many requests/i.test(msg)) rateLimited = true;
          console.error("[ytmusic] search failed:", query.slice(0, 50), msg.slice(0, 120));
        }
      }
      if (!videoIds.length && rateLimited && attempt === 0) {
        // rate limit is transient — back off once before hammering again
        await new Promise((r) => setTimeout(r, 2500));
      }
    }
    // never cache FAIL on rate-limit — otherwise songs stay dead for 10min
    if (!rateLimited || videoIds.length) {
      memCache.set(key, { id: videoIds[0] || null, at: Date.now() });
    }
    return NextResponse.json({ ok: videoIds.length > 0, videoId: videoIds[0] || null, videoIds, ...(rateLimited && !videoIds.length ? { error: "rate limited" } : {}) });
  } catch (e) {
    const msg = (e as Error).message || "";
    if (!/429|too many requests/i.test(msg)) {
      memCache.set(key, { id: null, at: Date.now() });
    }
    return NextResponse.json({ ok: false, error: msg.slice(0, 120) || "resolve failed" });
  }
}
