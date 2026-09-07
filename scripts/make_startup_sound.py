#!/usr/bin/env python3
"""Synthesize a Windows-7-style startup chime (warm orchestral swell).

Structure (approximating the real Win7 startup sound):
  t=0.0   low warm pad (Bb2+F3) starts swelling
  t=0.10  bell note 1: Bb3
  t=0.50  bell note 2: D4
  t=0.90  bell note 3: F4
  t=1.30  bell note 4: Bb4 + full major chord pad (Bb-D-F) blooms
  t=1.6-4.6 sustained shimmering chord, slow decay, sparkle overtone
  t=5.0   fade out end
"""
import numpy as np
from scipy.io import wavfile
import subprocess, os

SR = 44100
DUR = 5.2
N = int(SR * DUR)
t = np.arange(N) / SR
L = np.zeros(N)
R = np.zeros(N)

def note_freq(name: str) -> float:
    # e.g. Bb3, D4, F4, Bb2
    semis = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3,
             "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8,
             "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
    n, octv = name[:-1], int(name[-1])
    midi = 12 * (octv + 1) + semis[n]
    return 440.0 * 2 ** ((midi - 69) / 12)

def env_adsr(n, a, d, s_level, r, total=None):
    total = total or n
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, total - a_n - d_n - r_n)
    env = np.concatenate([
        np.linspace(0, 1, max(a_n, 1)),
        np.linspace(1, s_level, max(d_n, 1)),
        np.full(s_n, s_level),
        np.linspace(s_level, 0, max(r_n, 1)),
    ])
    if len(env) < n:
        env = np.pad(env, (0, n - len(env)))
    return env[:n]

def bell(freq, dur, vol=1.0, detune=0.0):
    """Bell-like tone: fundamental + inharmonic-ish partials, exp decay."""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = freq * (1 + detune)
    tone = (
        1.00 * np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.4) +
        0.42 * np.sin(2 * np.pi * f * 2.01 * tt) * np.exp(-tt * 3.6) +
        0.18 * np.sin(2 * np.pi * f * 3.02 * tt) * np.exp(-tt * 5.0) +
        0.09 * np.sin(2 * np.pi * f * 4.99 * tt) * np.exp(-tt * 6.5)
    )
    attack = np.linspace(0, 1, int(0.008 * SR))
    tone[:len(attack)] *= attack
    return tone * vol

def pad(freq, start, dur, vol, detune=0.0, rise=1.6):
    """Warm sustained pad: detuned sines + soft octave, slow swell."""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = freq * (1 + detune)
    tone = (
        0.55 * np.sin(2 * np.pi * f * tt) +
        0.30 * np.sin(2 * np.pi * f * 2 * tt + 0.3) +
        0.14 * np.sin(2 * np.pi * f * 0.5 * tt + 0.8) +
        0.08 * np.sin(2 * np.pi * f * 3 * tt + 1.7)
    )
    # slow swell then gentle sustain decay
    swell = 1 - np.exp(-tt / (rise / 3))
    decay = np.exp(-tt * 0.28)
    tone *= swell * decay * vol
    attack = np.linspace(0, 1, int(0.05 * SR))
    tone[:len(attack)] *= attack
    return start, tone

def add(buf, start_s, sig):
    i = int(start_s * SR)
    j = min(i + len(sig), len(buf))
    buf[i:j] += sig[: j - i]

# ---- composition -----------------------------------------------------
NOTES = [  # (time, freq, dur, vol)
    (0.10, note_freq("Bb3"), 2.6, 0.50),
    (0.50, note_freq("D4"),  2.7, 0.52),
    (0.90, note_freq("F4"),  2.8, 0.55),
    (1.30, note_freq("Bb4"), 3.2, 0.62),
]
for i, (ts, fq, du, vo) in enumerate(NOTES):
    dl = bell(fq, du, vo, detune=+0.0007)
    dr = bell(fq, du, vo, detune=-0.0007)
    # tiny strum between channels for width
    add(L, ts, dl)
    add(R, ts + 0.012, dr)

# low warm pad under everything
for fq, vo, dt in [(note_freq("Bb2"), 0.30, +0.0012), (note_freq("F3"), 0.22, -0.0012)]:
    add(L, 0.0, pad(fq, 0, DUR, vo, detune=dt)[1])
    add(R, 0.0, pad(fq, 0, DUR, vo, detune=-dt)[1])

# full chord bloom at 1.30
for fq, vo in [(note_freq("Bb3"), 0.24), (note_freq("D4"), 0.20),
               (note_freq("F4"), 0.20), (note_freq("Bb4"), 0.16)]:
    s, sig = pad(fq, 1.30, DUR - 1.30, vo, rise=0.9)
    add(L, s, sig)
    s, sig = pad(fq, 1.30, DUR - 1.30, vo * 0.96, detune=0.0016, rise=0.9)
    add(R, s, sig)

# high shimmer sparkle at the bloom
for fq, vo, ts in [(note_freq("D6"), 0.05, 1.45), (note_freq("F5"), 0.05, 1.75),
                   (note_freq("Bb5"), 0.05, 2.05)]:
    add(L, ts, bell(fq, 2.2, vo, detune=+0.001))
    add(R, ts + 0.015, bell(fq, 2.2, vo, detune=-0.001))

# ---- simple feedback-delay reverb ------------------------------------
def reverb(sig, delay=0.11, fb=0.34, mix=0.24):
    out = sig.copy()
    d = int(delay * SR)
    tail = sig.copy()
    for k in range(1, 5):
        gain = fb ** k
        shifted = np.zeros_like(sig)
        shifted[d * k:] = tail[: len(sig) - d * k] * gain
        out += shifted
    return out * (1 - mix) + out * mix  # keep level sane

Lr, Rr = reverb(L), reverb(R)

# ---- master: normalize, fades, gentle stereo =========================
mx = max(np.max(np.abs(Lr)), np.max(np.abs(Rr)), 1e-9)
Lr, Rr = Lr / mx * 0.82, Rr / mx * 0.82
fade_in = int(0.02 * SR)
fade_out = int(0.9 * SR)
for ch in (Lr, Rr):
    ch[:fade_in] *= np.linspace(0, 1, fade_in)
    ch[-fade_out:] *= np.linspace(1, 0, fade_out) ** 1.5

stereo = np.stack([Lr, Rr], axis=1)
wav_path = "/home/z/my-project/scripts/win7-startup.wav"
mp3_path = "/home/z/my-project/public/win7-startup.mp3"
wavfile.write(wav_path, SR, (stereo * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path,
                "-codec:a", "libmp3lame", "-b:a", "192k", mp3_path], check=True)
os.remove(wav_path)
print("OK", mp3_path, os.path.getsize(mp3_path), "bytes, dur", DUR, "s")
