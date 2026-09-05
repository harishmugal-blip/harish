"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JarvisConsole, type JarvisMsg } from "./console";
import { SysPanel, WeatherPanel, MemoryPanel, CommPanel } from "./panels";
import { jarvisSpeak, stopSpeaking, parseLocalCommand, findSong, fmtTime, fmtDate, playHudBeep } from "@/lib/jarvis";
import { addMemory, clearMemories, getMemories } from "@/lib/jarvisMemory";
import { radioStart, radioPowerToggle, requestSong } from "@/lib/radio";

interface Props {
  onExit: () => void;
  onOpenWindow: (id: string) => void;
  onBsod: () => void;
}

const BOOT_LINES = [
  "> INITIALISING J.A.R.V.I.S KERNEL v5.1 …",
  "> NEURAL LINK … ESTABLISHED",
  "> MEMORY CORE … MOUNTED",
  "> SATELLITE UPLINK … ONLINE",
  "> YOUTUBE MUSIC BRIDGE … TUNED",
  "> ALL SYSTEMS NOMINAL — WELCOME BACK, SIR",
];

let msgId = 0;

export function JarvisMode({ onExit, onOpenWindow, onBsod }: Props) {
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [msgs, setMsgs] = useState<JarvisMsg[]>([
    { id: ++msgId, from: "jarvis", text: "Good to see you, sir. J.A.R.V.I.S online he — pucho jo puchna he. ☕" },
  ]);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("PROCESSING");
  const [ttsOn, setTtsOn] = useState(true);
  const [activeSince] = useState(() => Date.now());
  const historyRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const spokenRef = useRef(false);

  /* boot sequence lines */
  useEffect(() => {
    if (booted) return;
    playHudBeep(660, 0.1);
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setBootLine(i + 1);
          playHudBeep(520 + i * 60, 0.05, 0.03);
        }, 420 * (i + 1))
      );
    });
    timers.push(
      setTimeout(() => {
        setBooted(true);
        playHudBeep(1040, 0.14);
        if (!spokenRef.current) {
          spokenRef.current = true;
          jarvisSpeak("Welcome back sir. All systems online.");
        }
      }, 420 * (BOOT_LINES.length + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [booted]);

  const pushMsg = (from: "user" | "jarvis", text: string, mode?: "research" | "chat") => {
    setMsgs((m) => [...m, { id: ++msgId, from, text, mode }]);
  };

  const handleLocal = useCallback(
    (raw: string): boolean => {
      const action = parseLocalCommand(raw);
      switch (action.type) {
        case "time":
          pushMsg("jarvis", `Abhi ka time: ${fmtTime()}, sir.`);
          if (ttsOn) jarvisSpeak(`It is ${fmtTime()} sir`);
          return true;
        case "date":
          pushMsg("jarvis", `Aaj he ${fmtDate()}, sir.`);
          if (ttsOn) jarvisSpeak(`Today is ${fmtDate()} sir`);
          return true;
        case "open-window":
          onOpenWindow(action.window);
          pushMsg("jarvis", `Opening ${action.window} window, sir.`);
          if (ttsOn) jarvisSpeak(`Opening ${action.window}, sir`);
          return true;
        case "radio-on":
          void radioStart();
          pushMsg("jarvis", "YouTube Music se old songs laga raha hu, sir. 🎵");
          if (ttsOn) jarvisSpeak("Playing old songs from YouTube Music, sir");
          return true;
        case "radio-off":
          radioPowerToggle();
          pushMsg("jarvis", "Music band. Silence is golden, sir.");
          return true;
        case "play-song": {
          const song = findSong(action.song);
          if (song) {
            void requestSong({ id: `q-${Date.now()}`, title: song.title, artist: song.artist, year: "" });
            pushMsg("jarvis", `"${song.title}" — ${song.artist} laga raha hu, sir. 🎧`);
          } else {
            void radioStart();
            pushMsg("jarvis", `Library me "${action.song}" nahi mila — mix laga deta hu, sir.`);
          }
          return true;
        }
        case "remember": {
          const ok = addMemory(action.text);
          if (ok) {
            pushMsg("jarvis", `Yaad rakh liya, sir — memory core: ${getMemories().length}/12 slots. 🔒`);
            if (ttsOn) jarvisSpeak("Noted, sir");
          } else {
            pushMsg("jarvis", "Ye note pehle se memory me he, sir. photographic memory ka side effect. 😏");
          }
          return true;
        }
        case "forget": {
          const n = clearMemories();
          pushMsg("jarvis", n ? `${n} notes memory core se erase kar diye, sir. Fresh start.` : "Memory already khaali he, sir.");
          return true;
        }
        case "memory-list": {
          const mem = getMemories();
          pushMsg("jarvis", mem.length ? `Memory core, sir:\n${mem.slice(0, 5).map((m, i) => `${i + 1}. ${m}`).join("\n")}` : "Memory core empty he, sir — kuch bhi yaad nahi rakha abhi tak.");
          return true;
        }
        case "shutdown":
          pushMsg("jarvis", "Powering down the HUD, sir. Main yahin hu — Activate Windows se fir bulana. 🤖");
          if (ttsOn) jarvisSpeak("Shutting down. Goodbye sir");
          setTimeout(() => {
            stopSpeaking();
            onExit();
          }, 1400);
          return true;
        default:
          return false;
      }
    },
    [onExit, onOpenWindow, ttsOn]
  );

  const send = useCallback(
    async (text: string) => {
      pushMsg("user", text);
      playHudBeep(760, 0.05, 0.04);

      // instant local commands first
      if (handleLocal(text)) return;

      setBusy(true);
      setBusyLabel(isResearchy(text) ? "SEARCHING SATELLITES" : "PROCESSING");
      try {
        const res = await fetch("/api/jarvis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: historyRef.current.slice(-8),
            memories: getMemories(),
          }),
        });
        const data = await res.json();
        if (data?.ok && data.reply) {
          pushMsg("jarvis", data.reply, data.mode);
          historyRef.current.push({ role: "user", content: text });
          historyRef.current.push({ role: "assistant", content: data.reply });
          if (historyRef.current.length > 12) historyRef.current = historyRef.current.slice(-12);
          if (ttsOn) jarvisSpeak(data.reply);
        } else {
          const fallback = "Neural link me thodi kharabi he, sir. Ek baar fir try karo?";
          pushMsg("jarvis", fallback);
          if (ttsOn) jarvisSpeak(fallback);
        }
      } catch {
        const fallback = "Network uplink weak he, sir. Signal aaya toh main hoon.";
        pushMsg("jarvis", fallback);
        if (ttsOn) jarvisSpeak(fallback);
      } finally {
        setBusy(false);
      }
    },
    [handleLocal, ttsOn]
  );

  return (
    <div className="fixed inset-0 z-[9500] bg-[#02090f] text-cyan-100 overflow-hidden select-none">
      {/* background grid + glow */}
      <div className="absolute inset-0 jarvis-grid opacity-60" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,180,255,0.12), transparent 55%)" }} />

      {/* top bar */}
      <div className="relative flex items-center justify-between px-4 h-11 border-b border-cyan-400/15 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_10px_rgba(80,220,255,0.9)]" />
          <span className="text-[12px] tracking-[0.35em] text-cyan-200 font-semibold">J.A.R.V.I.S v5.1</span>
          <span className="hidden sm:inline text-[9px] tracking-[0.2em] text-cyan-300/40 mt-[2px]">JUST A RATHER VERY INTELLIGENT SYSTEM</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              stopSpeaking();
              onExit();
            }}
            className="text-[10.5px] px-2.5 py-1 rounded border border-cyan-400/30 text-cyan-200/80 hover:bg-cyan-400/10 tracking-wider"
          >
            EXIT TO DESKTOP
          </button>
          <button
            onClick={() => {
              jarvisSpeak("As you wish sir. Deploying chaos.");
              setTimeout(onBsod, 900);
            }}
            className="text-[10.5px] px-2.5 py-1 rounded border border-red-400/40 text-red-300/90 hover:bg-red-400/15 tracking-wider"
          >
            DO NOT PRESS
          </button>
        </div>
      </div>

      {/* main area */}
      <div className="relative h-[calc(100%-44px)] grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-3 p-3 min-h-0">
        {/* left: helmet + console */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* helmet zone */}
          <div className={`relative shrink-0 h-[26vh] lg:h-[30vh] flex items-center justify-center transition-opacity duration-700 ${booted ? "opacity-100" : "opacity-95"}`}>
            <div className="absolute w-[200px] h-[200px] lg:w-[230px] lg:h-[230px] rounded-full border border-cyan-400/20 animate-[spin_14s_linear_infinite]">
              <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(80,220,255,1)]" />
            </div>
            <div className="absolute w-[150px] h-[150px] lg:w-[175px] lg:h-[175px] rounded-full border border-amber-300/25 animate-[spin_9s_linear_infinite_reverse]">
              <span className="absolute top-1/2 -right-1 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(255,200,80,1)]" />
            </div>
            <div className={`relative w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] ${booted ? "" : "jarvis-holo-scan"}`}>
              <img src="/jarvis-helmet.png" alt="JARVIS" className="w-full h-full object-contain jarvis-holo [mask-image:radial-gradient(circle,black_52%,transparent_70%)]" draggable={false} />
            </div>
            {!booted && (
              <div className="absolute bottom-1 left-0 right-0 text-center">
                <div className="text-[10.5px] text-cyan-300/80 tracking-[0.18em] h-4">
                  {BOOT_LINES.slice(0, bootLine).map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* console */}
          <div className="flex-1 min-h-0 rounded-[8px] border border-cyan-400/20 bg-black/45 backdrop-blur-[8px] overflow-hidden">
            <JarvisConsole
              msgs={msgs}
              busy={busy}
              busyLabel={busyLabel}
              onSend={send}
              ttsOn={ttsOn}
              onToggleTts={() => {
                setTtsOn((v) => {
                  if (v) stopSpeaking();
                  return !v;
                });
              }}
            />
          </div>
        </div>

        {/* right: panels */}
        <div className="hidden lg:flex flex-col gap-3 min-h-0 overflow-y-auto jarvis-scroll pr-0.5">
          <SysPanel activeSince={activeSince} />
          <WeatherPanel />
          <MemoryPanel />
          <CommPanel />
          <div className="text-center text-[8.5px] tracking-[0.25em] text-cyan-300/25 pt-1">
            DESIGNED FOR HARISH • POS & WEB STUDIO
          </div>
        </div>
      </div>

      {/* mobile panels strip */}
      <div className="lg:hidden absolute bottom-0 inset-x-0 border-t border-cyan-400/15 bg-black/60 backdrop-blur-md p-2 grid grid-cols-2 gap-2 max-h-[132px] overflow-y-auto">
        <MemoryPanel />
        <CommPanel />
      </div>
    </div>
  );
}

function isResearchy(text: string): boolean {
  return /\b(news|latest|today|price|stock|score|ipl|weather|current|update)\b/i.test(text);
}
