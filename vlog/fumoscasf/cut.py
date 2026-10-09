# -*- coding: utf-8 -*-
# Voz SIN pausas (public/fumoscasfcut.wav): quita los tramos de cortes.json con el MISMO corte alineado a
# cuadro que mkvlog.py (30 fps · 44,1 kHz → 1 cuadro = 1470 muestras), así imagen y audio cortan exactamente
# lo mismo (22259 cuadros = 741,9667 s = 32.720.630 muestras).
#
# ⛔ 9-oct-2026, dos intentos fallidos que NO hay que repetir:
#   1) `aselect=n`: en audio `n` es el número de FRAME DEL FILTRO (bloques de ~1024 muestras), no la muestra.
#      La expresión quedaba verdadera para todos los bloques y el "recorte" devolvía el archivo entero
#      (medido: fumoscasfcut.wav = 749,71 s = el crudo).
#   2) `aselect=t`: aselect elige FRAMES ENTEROS del filtro, así que los bordes se pegan al bloque (~1024
#      muestras) y el total salía 742,095 s en vez de 741,967 s.
#   El corte exacto es a mano, por muestra: se concatenan los tramos conservados del PCM.
import json, subprocess, wave, numpy as np
R = "D:/Proyectos/video2-wt/fumoscasf/"; SR = 44100; FPS = 30
C = json.load(open(R + "vlog/fumoscasf/cortes.json"))
src = R + "public/fumoscasf_raw.wav"
with wave.open(src, "rb") as w:
    assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, \
        (w.getframerate(), w.getnchannels(), w.getsampwidth())
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16)
T = round(len(x) / SR * FPS)
keep, t = [], 0.0
for a, b in C: keep.append((round(t * FPS), round(a * FPS))); t = b
keep.append((round(t * FPS), T))
keep = [(a, b) for a, b in keep if b - a > 0]
ns = lambda f: round(f * SR / FPS)          # cuadro → muestra (1470 por cuadro)
y = np.concatenate([x[ns(a):ns(b)] for a, b in keep])
out = R + "public/fumoscasfcut.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
nf = sum(b - a for a, b in keep)
assert len(y) == ns(nf), (len(y), ns(nf))
print(f"cut.wav: {nf} cuadros = {nf / FPS:.4f} s = {len(y)} muestras (crudo {len(x) / SR:.2f} s, quité {len(x) / SR - len(y) / SR:.2f} s)")
