// direct SDK diagnostic: chat + web_search
import ZAI from "z-ai-web-dev-sdk";

async function main() {
  const zai = await ZAI.create();

  // 1. chat test
  try {
    const c = await zai.chat.completions.create({
      messages: [{ role: "user", content: "say OK" }],
      thinking: { type: "disabled" },
    });
    console.log("CHAT OK:", c?.choices?.[0]?.message?.content?.slice(0, 80));
  } catch (e) {
    console.log("CHAT FAIL:", (e as Error).message?.slice(0, 200));
  }

  // 2. web_search test
  try {
    const res = (await zai.functions.invoke("web_search", { query: "Lag Ja Gale song youtube", num: 6 })) as unknown[];
    console.log("SEARCH OK, results:", Array.isArray(res) ? res.length : typeof res);
    if (Array.isArray(res)) {
      for (const r of res.slice(0, 4)) {
        const rr = r as { url?: string; name?: string };
        console.log("  -", (rr.name || "").slice(0, 60), "|", (rr.url || "").slice(0, 90));
      }
    }
  } catch (e) {
    console.log("SEARCH FAIL:", (e as Error).message?.slice(0, 200));
  }
}

main().catch((e) => {
  console.error("FATAL:", e?.message || e);
  process.exit(1);
});
