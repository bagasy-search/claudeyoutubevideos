# humanize.py — pos-procesa una narración TTS para que suene a NARRADOR REAL miked.
# Chatterbox sale flojo y plano; esta cadena le da volumen + cuerpo + presencia +
# control de sibilancia + "glue", como una voz grabada y mezclada profesionalmente.
# Usa torchaudio (el ffmpeg de Remotion no trae filtros de audio).
#
#   ttsenv\Scripts\python humanize.py --in public/x.wav --out public/x_final.wav
#       [--rms -18] [--drive 1.5] [--room 0]   (--room 0.05 = toque de sala)
import argparse, torch, torchaudio
import torchaudio.functional as F

ap = argparse.ArgumentParser()
ap.add_argument("--in", dest="inp", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--rms", type=float, default=-18.0)   # loudness objetivo (dBFS RMS)
ap.add_argument("--drive", type=float, default=1.5)   # glue/compresión suave (tanh)
ap.add_argument("--room", type=float, default=0.0)    # 0 = seco; 0.04-0.07 = toque de sala
a = ap.parse_args()

wav, sr = torchaudio.load(a.inp)
if wav.size(0) > 1:
    wav = wav.mean(0, keepdim=True)
x = wav

# 1) EQ — cuerpo cálido, sin barro, con presencia + de-ess estático
x = F.highpass_biquad(x, sr, 85)                          # saca retumbe/boom del respiro
x = F.equalizer_biquad(x, sr, 115, gain=2.5, Q=0.9)      # cuerpo/calidez
x = F.equalizer_biquad(x, sr, 350, gain=-2.0, Q=1.0)     # quita "barro"
x = F.equalizer_biquad(x, sr, 4500, gain=2.5, Q=1.2)     # presencia/claridad
x = F.equalizer_biquad(x, sr, 7200, gain=-3.5, Q=1.6)    # de-ess (doma las "s")

# 2) toque de sala opcional (reverb cortita por convolución de un decay sintético)
if a.room > 0:
    ir_n = int(sr * 0.12)
    t = torch.linspace(0, 1, ir_n)
    ir = (torch.randn(ir_n) * torch.exp(-t * 28)) * a.room
    ir[0] = 1.0
    wet = F.fftconvolve(x, ir.unsqueeze(0))[:, : x.size(1)]
    x = x + wet * 0.5

# 3) loudness: normalizar RMS al objetivo (esto sube el volumen flojo)
rms = x.pow(2).mean().sqrt().clamp_min(1e-9)
x = x * (10 ** (a.rms / 20) / rms)

# 4) glue/limit: soft-clip tanh → empareja dinámica + calienta, sin clippear
x = torch.tanh(x * a.drive)

# 5) techo de pico a -1 dBFS (loud pero sin saturar)
peak = x.abs().max().clamp_min(1e-9)
x = x * (10 ** (-1.0 / 20) / peak)

torchaudio.save(a.out, x, sr)
dur = x.size(1) / sr
print(f"OK -> {a.out} | {dur:.1f}s @ {sr}Hz | RMS objetivo {a.rms}dB, drive {a.drive}, room {a.room}")
