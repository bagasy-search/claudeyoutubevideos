# mix.py — premezcla VOZ + MÚSICA + SFX en un solo wav (para muxear al video).
# Evita el bug de mezcla de audio del ffmpeg pelado de Remotion: mezclamos acá con
# torchaudio y muxeamos UNA pista. Voz = base (manda), música/ambiente bajos, SFX
# anclados a su segundo (duck bajo la voz).
import argparse, json, os, torch, torchaudio

ap = argparse.ArgumentParser()
ap.add_argument("--voice", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--music", default=None)
ap.add_argument("--ambience", default=None)
ap.add_argument("--sfx", default=None)          # json: [{file, at, gain_db}]
ap.add_argument("--music_db", type=float, default=-21.0)
ap.add_argument("--amb_db", type=float, default=-27.0)
a = ap.parse_args()

def load(p):
    w, sr = torchaudio.load(p)
    if w.size(0) > 1: w = w.mean(0, keepdim=True)
    return w, sr
voice, SR = load(a.voice)
N = voice.size(1)
mix = voice.clone()
lin = lambda db: 10 ** (db / 20)
def res(w, sr): return torchaudio.functional.resample(w, sr, SR) if sr != SR else w
def loop_to(w, n):
    if w.size(1) >= n: return w[:, :n]
    return w.repeat(1, n // w.size(1) + 1)[:, :n]

if a.music and os.path.exists(a.music):
    m, sr = load(a.music); mix = mix + loop_to(res(m, sr), N) * lin(a.music_db)
if a.ambience and os.path.exists(a.ambience):
    am, sr = load(a.ambience); mix = mix + loop_to(res(am, sr), N) * lin(a.amb_db)
if a.sfx and os.path.exists(a.sfx):
    for s in json.load(open(a.sfx, encoding="utf-8")):
        if not os.path.exists(s["file"]): continue
        w, sr = load(s["file"]); w = res(w, sr) * lin(s.get("gain_db", -13))
        i = max(0, int(s["at"] * SR)); j = min(N, i + w.size(1))
        if j > i: mix[:, i:j] = mix[:, i:j] + w[:, : j - i]

peak = mix.abs().max().clamp_min(1e-9)
if peak > 0.97: mix = mix * (0.97 / peak)
os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
torchaudio.save(a.out, mix, SR)
print(f"OK mix -> {a.out} | {N/SR:.1f}s | voz+musica+sfx")
