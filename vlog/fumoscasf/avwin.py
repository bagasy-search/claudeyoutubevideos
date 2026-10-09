# -*- coding: utf-8 -*-
# Ventanas de avatar de fumoscasf (RunPod InfiniteTalk, UN solo /run): los tramos del MÁSTER donde Claudio
# habla a cámara. El máster NO se toca: el reel es un recorte del propio audio y el avatar sólo tapa la imagen.
#   python vlog/fumoscasf/avwin.py ver     → imprime las ventanas con su tiempo en frases (comprobación)
#   python vlog/fumoscasf/avwin.py build   → _v3/fumoscasf_avwin.json + out/fumoscasf_avatar/reel.wav
# Los bordes salen de _v3/fumoscasf_wordms.json (vía avt.py) y están anotados con la frase que los cierra.
import json, os, sys, subprocess
R = "D:/Proyectos/video2-wt/fumoscasf/"
FPS, TOT = 30, 741.9667
# (nombre, inicio, fin, frase de inicio, frase de fin)  — segundos del VIDEO ARMADO (pausas ya quitadas)
WIN = [
    ("GANCHO",    0.00,  13.34, "En las cocinas de restaurante",             "Ésta es la casa de los Ramírez"),
    ("PROMESA",  46.08,  75.67, "Hoy te muestro las tres",                   "si tu cocina ya tiene un problema."),
    ("MOSQUITERO", 141.80, 173.60, "Y antes de seguir, una palabra sobre el mosquitero", "te sigue naciendo en la cocina"),
    ("ALMACEN", 182.12, 231.45, "Antes de empezar, vamos al almacén",        "no sirve para esto."),
    ("PAG16",   463.80, 473.85, "nos sentamos un momento",                   "del Manual del Fumigador"),
    ("CAFE",    481.10, 494.06, "Mateo me pregunta por qué no ponemos veneno", "con otro nombre"),
    ("CTA",     695.00, 700.30, "Y si tu casa tiene de todo",                "está el Manual del Fumigador"),
    ("PRECIO",  708.00, 712.13, "Veintisiete dólares",                       "te devuelven el dinero."),
    ("CIERRE",  729.40, 741.90, "¿Dónde aparecen las moscas en tu casa?",    "Nos vemos la semana que viene."),
]
M = 0.12                                            # margen a cada lado (no arrancar en la 1ª sílaba)
if sys.argv[1] == "ver":
    t = 0.0
    for n, s, e, a, b in WIN:
        print(f"{n:10s} {s:7.2f}→{e:7.2f} ({e-s:5.1f} s)   «{a}» … «{b}»"); t += (e - s) + 2 * M
    print(f"total avatar {t:.1f} s = {100*t/TOT:.1f} % del video")
    sys.exit(0)

OUT = R + "out/fumoscasf_avatar/"; os.makedirs(OUT, exist_ok=True)
SRC = R + "public/fumoscasfcut.wav"                 # voz limpia del máster cortado (mono 44,1 k), = lo que suena
parts, off = [], 0.0
for n, s, e, _a, _b in WIN:
    p = {"n": n, "ms": round(max(0.0, s - M), 3), "me": round(e + M, 3), "off": round(off, 3)}
    parts.append(p); off += p["me"] - p["ms"]
for i in range(1, len(parts)):
    if parts[i]["ms"] < parts[i - 1]["me"]:
        sys.exit(f"⛔ solape {parts[i-1]['n']} / {parts[i]['n']}")
txt = ""
for i, p in enumerate(parts):
    f = OUT + f"p{i:03d}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f'{p["ms"]:.3f}', "-to", f'{p["me"]:.3f}',
                    "-i", SRC, "-ac", "1", "-ar", "44100", f], check=True)
    txt += f"file '{f}'\n"
open(OUT + "concat.txt", "w").write(txt)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", OUT + "concat.txt",
                "-c:a", "pcm_s16le", OUT + "reel.wav"], check=True)
d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                          OUT + "reel.wav"], capture_output=True, text=True).stdout)
json.dump({"reel": d, "win": parts}, open(R + "_v3/fumoscasf_avwin.json", "w"), indent=1)
# copia a src/ para que viaje en la rama: el render (src/index_fumoscasf.tsx) la lee para poner la capa de avatar
os.makedirs(R + "src/fumoscasf", exist_ok=True)
json.dump({"reel": d, "win": parts}, open(R + "src/fumoscasf/avwin.json", "w"), indent=1)
for p in parts:
    print(f'{p["n"]:10s} máster {p["ms"]:7.2f}→{p["me"]:7.2f} ({p["me"]-p["ms"]:5.1f} s)  reel {p["off"]:7.2f}')
print(f"ventanas {len(parts)} · reel {d:.1f} s · suma teórica {off:.1f} · {100*d/TOT:.1f} % del video (cap medido ~600 s)")
