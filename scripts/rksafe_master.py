# scripts/rksafe_master.py <slug> — pega los bloques de Fish con aire de parrafo y normaliza a -14 LUFS.
#
# ⛔ El aire entre bloques NO es cosmetico: con un bloque por parrafo (ver scripts/rksafe_tts.py) cada
#    llamada devuelve la frase seca, y sin silencio intermedio el guion suena atropellado.
# ⛔ `loudnorm linear=true` re-mide el archivo entero: si despues regeneras un bloque suelto, el
#    master cambia por ~0,1 % de ganancia (inaudible, el lipsync no se entera) pero la DURACION tiene
#    que quedar igual o los tramos de avatar ya pagados dejan de valer.
#   python scripts/rksafe_master.py <slug> [--aire 0.35]
import argparse, pathlib, re, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("--aire", type=float, default=0.35)
a = ap.parse_args()

out = pathlib.Path("_v3/%s_tts" % a.slug)
sil = out / "_sil.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
                "-t", str(a.aire), "-c:a", "pcm_s16le", str(sil)], check=True)

files = sorted(p for p in out.glob("b*.wav") if re.match(r"^b\d{3}\.wav$", p.name))
if not files:
    sys.exit("sin bloques en %s" % out)

# ⛔ COMPUERTA: la cantidad de wavs tiene que dar EXACTO la cantidad de bloques del guion.
blocks = pathlib.Path("_v3/%s_blocks.json" % a.slug)
if blocks.exists():
    import json
    n = len(json.loads(blocks.read_text(encoding="utf8")))
    if n != len(files):
        sys.exit("⛔ %d bloques de guion contra %d wavs en disco — falta generar" % (n, len(files)))

lines = []
for i, p in enumerate(files):
    lines.append("file '%s'" % p.resolve().as_posix())
    if i < len(files) - 1:
        lines.append("file '%s'" % sil.resolve().as_posix())
(out / "concat_sil.txt").write_text("\n".join(lines), encoding="utf8")

raw = "_v3/%s_raw.wav" % a.slug
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(out / "concat_sil.txt"),
                "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", raw], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw,
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:linear=true",
                "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", "public/%s.wav" % a.slug], check=True)


def dur(p):
    o = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                       capture_output=True, text=True).stdout
    m = re.findall(r"[\d.]+", o)
    return float(m[0]) if m else 0.0


dr, dm = dur(raw), dur("public/%s.wav" % a.slug)
print("MEDIDO: %d bloques · aire %.2f s · crudo %.3f s · master %.3f s -> public/%s.wav"
      % (len(files), a.aire, dr, dm, a.slug))
if abs(dr - dm) > 0.05:
    sys.exit("⛔ loudnorm cambio la duracion (%.3f -> %.3f): el anclaje al ms no va a cerrar" % (dr, dm))
