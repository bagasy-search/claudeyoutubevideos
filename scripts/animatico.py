"""ANIMÁTICO — el corte entero armado con ffmpeg, ANTES de gastar un render del farm.

Por qué existe: el pipeline salta de "beatsheet" directo a "render en el farm", así que todo defecto
EDITORIAL (ritmo de metrónomo, un plano que no pega con la frase, algo absurdo en cuadro, minutos
enteros en el mismo lugar) se descubre 20 minutos y un render después. El animático usa los assets
reales a su duración real al ms y el audio máster: cuesta dos minutos de CPU.

⛔⛔ Y SE AUTO-VERIFICA. La primera versión salió CORRIDA — se comía el primer plano y arrancaba
mostrando el segundo — y el creador juzgó el montaje sobre eso ("el video empieza mostrando un
sillón???"). Una herramienta de revisión sin revisar es peor que no tener nada: no sólo no encuentra
defectos, INVENTA defectos que no existen y hace corregir lo que estaba bien.
La causa era el demuxer `concat`, que con duraciones de fracción de cuadro se saltea entradas. Ahora
las duraciones se cuantizan A CUADROS y nada baja de 1 cuadro; y al final se extraen cuadros en
puntos al azar y se comparan contra la imagen que el timeline dice que va ahí. Si no coinciden,
el script FALLA en vez de entregar un animático mentiroso.

⚠️ Lo que el animático NO representa: el Ken-Burns (acá las imágenes van quietas — el movimiento va
por el `transform` de Remotion y NUNCA se hornea con ffmpeg, que cuantiza a píxel entero) y el avatar
de fondo (se ve negro donde el avatar quedaría a la vista).

  python scripts/animatico.py <slug> [desde_s] [hasta_s]
"""
import json, pathlib, subprocess, sys, tempfile
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
SLUG = sys.argv[1] if len(sys.argv) > 1 else "pinvacas"
T0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
T1 = float(sys.argv[3]) if len(sys.argv) > 3 else 180.0
FPS, W, H = 30, 1280, 720

cues = json.loads((ROOT / "_v3" / f"{SLUG}_cues.json").read_text(encoding="utf-8"))
tramo = [c for c in cues if c["start"] + c["dur"] > T0 and c["start"] < T1]
if not tramo:
    raise SystemExit(f"no hay cues entre {T0} y {T1}")

NEGRO = ROOT / "_v3" / SLUG / "_negro.jpg"
NEGRO.parent.mkdir(parents=True, exist_ok=True)
if not NEGRO.exists():
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=#0A0B08:s={W}x{H}",
                    "-frames:v", "1", str(NEGRO)], check=True)

def clip_frame(path_or_none, dst):
    """un cue puede ser CLIP (mp4) o FOTO. Del clip se saca el primer cuadro: el animático juzga
    ritmo y contenido, no movimiento."""
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path_or_none), "-frames:v", "1", str(dst)], check=True)

# ---- lista con duraciones CUANTIZADAS A CUADROS (el bug vivía acá) ----
tmpd = pathlib.Path(tempfile.mkdtemp(prefix="anim_"))
lineas, falta, esperado = [], [], []       # esperado: (segundo_medio, imagen que TIENE que verse
f_cursor = round(T0 * FPS)
for c in tramo:
    fi = max(round(c["start"] * FPS), round(T0 * FPS))
    ff = min(round((c["start"] + c["dur"]) * FPS), round(T1 * FPS))
    if ff - fi < 1:
        continue
    if fi - f_cursor >= 1:
        # ⛔ el hueco es el AVATAR a la vista, no negro. Poner negro ahí fue lo que hizo que el
        #    creador viera "el video empieza mostrando un sillón": el arranque REAL son ~7 s de él
        #    hablando a cámara, y el animático los tapaba. Se corta del mp4 del avatar, al segundo
        #    exacto, así el animático representa lo que se va a ver.
        lineas.append((("AVATAR", f_cursor / FPS), (fi - f_cursor) / FPS)); f_cursor = fi
    p = ROOT / "public" / c["src"]
    if not p.exists():
        falta.append(c["src"]); p = NEGRO
    elif p.suffix.lower() == ".mp4":
        # ⛔ el cue de CLIP va con su VIDEO, no con su primer cuadro. La versión anterior sacaba un
        #    still "porque el animático juzga ritmo y contenido, no movimiento" — y justo el defecto
        #    que el creador reportó ("full estático y aburrido") ES de movimiento. Un animático que
        #    aplana los clips no puede contestar la pregunta para la que se lo mira.
        p = ("CLIP", p)
    lineas.append((p, (ff - fi) / FPS))
    if isinstance(p, tuple) and p[0] == "CLIP":
        # el clip se mueve, así que comparar su MITAD contra un still da falso positivo: se verifica
        # contra su PRIMER cuadro, cerca del arranque del plano.
        d = tmpd / (c["key"] + "_v.jpg"); clip_frame(p[1], d)
        esperado.append((fi / FPS - T0 + 0.10, d))
    else:
        esperado.append(((fi + ff) / 2 / FPS - T0, p))
    f_cursor = ff

# ⛔ NO se usa el demuxer `concat` con `duration`: acumula deriva en coma flotante y se saltea
#    entradas cortas — es lo que hizo que el animático saliera CORRIDO. Cada plano se encodea con su
#    cantidad EXACTA de cuadros (-frames:v N) y después se pegan por copia de stream: no hay forma
#    de que se corra.
segs = []
AVATAR_MP4 = ROOT / "public" / f"{SLUG}_opt.mp4"
for k, (p, d) in enumerate(lineas):
    n = max(1, round(d * FPS))
    seg = tmpd / ("s%04d.mp4" % k)
    if isinstance(p, tuple) and p[0] == "CLIP":
        # el clip dura ~5 s y el plano puede durar 9: se LOOPEA hasta cubrirlo (igual que <Loop> en
        # Remotion), si no el último cuadro se congela y se ve como plano muerto.
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-i", str(p[1]), "-frames:v", str(n),
            "-vf", f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},format=yuv420p",
            "-an", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "24", "-r", str(FPS),
            "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", str(seg)], check=True)
        segs.append(seg); continue
    if isinstance(p, tuple) and p[0] == "AVATAR":
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-ss", f"{p[1]:.3f}", "-i", str(AVATAR_MP4), "-frames:v", str(n),
            "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=#0A0B08,format=yuv420p",
            "-an", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "24", "-r", str(FPS),
            "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", str(seg)], check=True)
        segs.append(seg); continue
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", str(p), "-frames:v", str(n),
        "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=#0A0B08,format=yuv420p",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "24", "-r", str(FPS),
        "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", str(seg)], check=True)
    segs.append(seg)

lista = tmpd / "lista.txt"
with open(lista, "w", encoding="utf-8") as fh:
    for seg in segs:
        fh.write("file '" + str(seg).replace("\\", "/") + "'\n")

mudo = tmpd / "mudo.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lista),
                "-c", "copy", str(mudo)], check=True)

out = ROOT / "_v3" / SLUG / f"animatico_{int(T0)}_{int(T1)}.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mudo),
                "-ss", f"{T0}", "-t", f"{T1 - T0}", "-i", str(ROOT / "public" / f"{SLUG}.wav"),
                "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
                "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", str(out)], check=True)

# ---- AUTO-VERIFICACIÓN: el cuadro que se ve tiene que ser el que dice el timeline ----
def firma(im):
    return list(im.convert("L").resize((16, 9), Image.Resampling.BILINEAR).getdata())

def dif(a, b):
    return sum(abs(x - y) for x, y in zip(a, b)) / len(a)

paso = max(1, len(esperado) // 12)
malos, revisados = [], 0
for t_med, img in esperado[::paso]:
    if t_med <= 0.2 or t_med >= (T1 - T0) - 0.2:
        continue
    d = tmpd / ("v%.2f.jpg" % t_med)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t_med:.3f}", "-i", str(out),
                    "-frames:v", "1", str(d)], check=True)
    revisados += 1
    if dif(firma(Image.open(d)), firma(Image.open(img))) > 12:
        malos.append((round(t_med, 2), pathlib.Path(img).name))

durs = sorted(c["dur"] for c in tramo)
qq = lambda f: durs[int(len(durs) * f)]
print(json.dumps({
    "archivo": str(out),
    "tramo_s": [T0, T1],
    "planos": len(tramo),
    "cortes_por_minuto": round(len(tramo) / ((T1 - T0) / 60), 1),
    "plano_p25_med_p75_max": [qq(.25), qq(.5), qq(.75), durs[-1]],
    "planos_>=5s": f"{sum(1 for d in durs if d >= 5)} ({100*sum(1 for d in durs if d>=5)//len(durs)}%)",
    "assets_faltantes": falta[:10], "n_faltantes": len(falta),
    "verificacion": f"{revisados} cuadros comparados contra el timeline · {len(malos)} no coinciden",
    "desalineados": malos,
}, ensure_ascii=False, indent=1))
if malos:
    raise SystemExit("⛔ ANIMÁTICO DESALINEADO: no se entrega (juzgar el montaje sobre esto da conclusiones falsas)")
