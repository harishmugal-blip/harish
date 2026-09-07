#!/usr/bin/env python3
"""Replace the boot-screen CSS block in globals.css with the
reference-accurate version (matched frame-by-frame to the real
Windows 7 'Starting Windows' GIF from Tenor)."""

P = "/home/z/my-project/src/app/globals.css"
s = open(P).read()

START = "/* ================================================================\n   Boot screen"
END = ".win7-boot-fadeout {\n  animation: win7-boot-fadeout 0.55s ease 4.65s forwards;\n}"

i = s.index(START)
j = s.index(END) + len(END)
old = s[i:j]

NEW = r'''/* ================================================================
   Boot screen — authentic "Starting Windows" (matched to real GIF)
   small glowing dots fade in -> tight circular orbit around center
   -> merge into warm bloom -> flag condenses with a blur focus-pull
   -> holds with soft per-quadrant color glow. No rays, no trails.
   ================================================================ */

/* ---- glowing dots ---- */
.win7-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border-radius: 50%;
  opacity: 0;
}
.win7-dot-red {
  background: radial-gradient(circle at 42% 38%, #ffffff 0%, #ffd2b8 26%, #ff7a3c 58%, #f65314 82%, rgba(246, 83, 20, 0) 100%);
  box-shadow: 0 0 10px 3px rgba(255, 140, 80, 0.9), 0 0 30px 12px rgba(246, 83, 20, 0.45);
  animation: win7-orbit-red 1.7s cubic-bezier(0.37, 0, 0.63, 1) 0.05s both;
}
.win7-dot-green {
  background: radial-gradient(circle at 42% 38%, #ffffff 0%, #e2ffb0 26%, #9bd400 58%, #7cbb00 82%, rgba(124, 187, 0, 0) 100%);
  box-shadow: 0 0 10px 3px rgba(160, 220, 40, 0.9), 0 0 30px 12px rgba(124, 187, 0, 0.45);
  animation: win7-orbit-green 1.7s cubic-bezier(0.37, 0, 0.63, 1) 0.25s both;
}
.win7-dot-blue {
  background: radial-gradient(circle at 42% 38%, #ffffff 0%, #c8ecff 26%, #3cb8ff 58%, #00a1f1 82%, rgba(0, 161, 241, 0) 100%);
  box-shadow: 0 0 10px 3px rgba(70, 180, 255, 0.9), 0 0 30px 12px rgba(0, 161, 241, 0.45);
  animation: win7-orbit-blue 1.7s cubic-bezier(0.37, 0, 0.63, 1) 0.45s both;
}
.win7-dot-yellow {
  background: radial-gradient(circle at 42% 38%, #ffffff 0%, #ffefb8 26%, #ffd23c 58%, #ffbb00 82%, rgba(255, 187, 0, 0) 100%);
  box-shadow: 0 0 10px 3px rgba(255, 205, 70, 0.9), 0 0 30px 12px rgba(255, 187, 0, 0.45);
  animation: win7-orbit-yellow 1.7s cubic-bezier(0.37, 0, 0.63, 1) 0.65s both;
}

/* ---- tight circular orbit: radius 55->14px, ~1.15 revolutions ---- */
@keyframes win7-orbit-red {
  0%    { transform: translate(0, 0) scale(0.55); opacity: 0; }
  7%    { opacity: 1; }
  11%   { transform: translate(0px, -55px) scale(0.6); }
  22%   { transform: translate(39.2px, -30.9px) scale(0.69); }
  33%   { transform: translate(43.5px, 10.4px) scale(0.77); }
  44%   { transform: translate(16.6px, 36px) scale(0.86); }
  55%   { transform: translate(-15.7px, 30.7px) scale(0.95); }
  66%   { transform: translate(-28.8px, 5.7px) scale(1.04); }
  77%   { transform: translate(-18.4px, -15.7px) scale(1.12); }
  88%   { transform: translate(0.8px, -19.1px) scale(1.21); }
  94%   { transform: translate(2px, 1px) scale(1.55); opacity: 0.9; }
  100%  { transform: translate(0, 0) scale(2.1); opacity: 0; }
}
@keyframes win7-orbit-green {
  0%    { transform: translate(0, 0) scale(0.55); opacity: 0; }
  7%    { opacity: 1; }
  11%   { transform: translate(55px, 0px) scale(0.6); }
  22%   { transform: translate(30.9px, 39.2px) scale(0.69); }
  33%   { transform: translate(-10.4px, 43.5px) scale(0.77); }
  44%   { transform: translate(-36px, 16.6px) scale(0.86); }
  55%   { transform: translate(-30.7px, -15.7px) scale(0.95); }
  66%   { transform: translate(-5.7px, -28.8px) scale(1.04); }
  77%   { transform: translate(15.7px, -18.4px) scale(1.12); }
  88%   { transform: translate(19.1px, 0.8px) scale(1.21); }
  94%   { transform: translate(2px, 1px) scale(1.55); opacity: 0.9; }
  100%  { transform: translate(0, 0) scale(2.1); opacity: 0; }
}
@keyframes win7-orbit-blue {
  0%    { transform: translate(0, 0) scale(0.55); opacity: 0; }
  7%    { opacity: 1; }
  11%   { transform: translate(0px, 55px) scale(0.6); }
  22%   { transform: translate(-39.2px, 30.9px) scale(0.69); }
  33%   { transform: translate(-43.5px, -10.4px) scale(0.77); }
  44%   { transform: translate(-16.6px, -36px) scale(0.86); }
  55%   { transform: translate(15.7px, -30.7px) scale(0.95); }
  66%   { transform: translate(28.8px, -5.7px) scale(1.04); }
  77%   { transform: translate(18.4px, 15.7px) scale(1.12); }
  88%   { transform: translate(-0.8px, 19.1px) scale(1.21); }
  94%   { transform: translate(2px, 1px) scale(1.55); opacity: 0.9; }
  100%  { transform: translate(0, 0) scale(2.1); opacity: 0; }
}
@keyframes win7-orbit-yellow {
  0%    { transform: translate(0, 0) scale(0.55); opacity: 0; }
  7%    { opacity: 1; }
  11%   { transform: translate(-55px, 0px) scale(0.6); }
  22%   { transform: translate(-30.9px, -39.2px) scale(0.69); }
  33%   { transform: translate(10.4px, -43.5px) scale(0.77); }
  44%   { transform: translate(36px, -16.6px) scale(0.86); }
  55%   { transform: translate(30.7px, 15.7px) scale(0.95); }
  66%   { transform: translate(5.7px, 28.8px) scale(1.04); }
  77%   { transform: translate(-15.7px, 18.4px) scale(1.12); }
  88%   { transform: translate(-19.1px, -0.8px) scale(1.21); }
  94%   { transform: translate(2px, 1px) scale(1.55); opacity: 0.9; }
  100%  { transform: translate(0, 0) scale(2.1); opacity: 0; }
}

/* ---- warm merge bloom (no harsh white flash in the original) ---- */
@keyframes win7-merge-bloom {
  0%   { transform: scale(0.25); opacity: 0; }
  40%  { opacity: 0.9; }
  100% { transform: scale(2); opacity: 0; }
}
.win7-merge-bloom {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 92px;
  height: 92px;
  margin: -46px 0 0 -46px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 224, 170, 0.7) 28%, rgba(255, 150, 90, 0.32) 52%, rgba(110, 175, 255, 0.18) 68%, transparent 80%);
  filter: blur(2px);
  animation: win7-merge-bloom 0.8s ease-out 2.05s both;
}

/* ---- flag condenses out of the light (blur focus-pull) ---- */
@keyframes win7-flag-focus {
  0%   { opacity: 0; transform: scale(0.96); filter: blur(18px) brightness(1.9); }
  35%  { opacity: 1; }
  100% { opacity: 1; transform: scale(1); filter: blur(0) brightness(1); }
}
@keyframes win7-flag-pulse {
  0%, 100% { filter: brightness(1); }
  50%      { filter: brightness(1.07); }
}
.win7-boot-flag {
  animation: win7-flag-focus 0.75s ease-out 2.5s both, win7-flag-pulse 2.4s ease-in-out 3.4s infinite;
}

/* ---- text ---- */
@keyframes win7-fade-in { from { opacity: 0; } to { opacity: 1; } }
.win7-boot-text {
  animation: win7-fade-in 0.9s ease 3.4s both;
}

@keyframes win7-boot-fadeout {
  to { opacity: 0; visibility: hidden; }
}
.win7-boot-fadeout {
  animation: win7-boot-fadeout 0.55s ease 5.6s forwards;
}'''

s = s[:i] + NEW + s[j:]
open(P, "w").write(s)
print("boot CSS block replaced:", len(old), "->", len(NEW), "chars")
