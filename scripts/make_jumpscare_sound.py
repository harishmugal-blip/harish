#!/usr/bin/env python3
"""Jumpscare scream sound — horror screech + noise burst + sub thump.
Regenerable: python3 scripts/make_jumpscare_sound.py
Output: public/jumpscare.mp3 (~2.2s, LOUD, 192kbps)
"""
import numpy as np
from scipy.io import wavfile
import subprocess, os

SR = 44100
DUR = 2.2
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(666)

out = np.zeros(N)

# ---- 1) Dissonant rising shriek: detuned sawtooth cluster glissing up ----
def saw(freq, tt):
    return 2.0 * ((tt * freq) % 1.0) - 1.0

f_start, f_end = 620.0, 1350.0          # rising screech
f_curve = f_start + (f_end - f_start) * (t / DUR) ** 1.6
phase = np.cumsum(f_curve) / SR         # instantaneous phase -> gliss
shriek = np.zeros(N)
for det in (0.0, 1.023, 0.981, 1.507):  # dissonant detune cluster
    shriek += saw(det, phase)
shriek /= 4.0
# ring-mod for metallic horror character
shriek *= (0.6 + 0.4 * np.sin(2 * np.pi * 37.0 * t))
env_shriek = np.minimum(t / 0.012, 1.0) * np.exp(-np.maximum(t - 1.15, 0) * 3.2)
out += shriek * env_shriek * 0.55

# ---- 2) High-frequency noise burst (the "hiss attack") ----
noise = rng.standard_normal(N)
# simple lowpass -> bandpass feel via diff
noise_hp = np.diff(noise, prepend=noise[0])
env_noise = np.exp(-t * 5.5)
out += noise_hp * env_noise * 0.38

# ---- 3) Sub-bass thump (chest hit) ----
f_sub = 95.0 * np.exp(-t * 6.5) + 38.0
ph_sub = np.cumsum(f_sub) / SR
sub = np.sin(2 * np.pi * ph_sub)
env_sub = np.exp(-t * 4.0)
out += sub * env_sub * 0.95

# ---- 4) Second shorter echo-scream for tail ----
echo_shift = int(0.55 * SR)
echo = np.zeros(N)
echo[echo_shift:] = shriek[: N - echo_shift] * 0.28
out += echo

# ---- soft clip for loudness without digital blowup ----
out = np.tanh(out * 2.2)
out *= 0.92 / max(1e-9, np.max(np.abs(out)))

# ---- stereo: slight haas widening ----
delay = int(0.011 * SR)
left = out
right = np.concatenate([np.zeros(delay), out[:-delay]])
stereo = np.stack([left, right], axis=1)

wavfile.write("/tmp/jumpscare.wav", SR, (stereo * 32767).astype(np.int16))
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-i", "/tmp/jumpscare.wav",
    "-codec:a", "libmp3lame", "-b:a", "192k", "public/jumpscare.mp3"
], check=True)
os.remove("/tmp/jumpscare.wav")
print("OK public/jumpscare.mp3", os.path.getsize("public/jumpscare.mp3"), "bytes")
