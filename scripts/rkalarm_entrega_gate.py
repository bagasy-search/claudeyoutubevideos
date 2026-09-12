# -*- coding: utf-8 -*-
# COMPUERTAS DE ENTREGA sobre el MP4 que se va a subir. Cada una existe porque ya fallo una vez.
#   node/python scripts/rkalarm_entrega_gate.py <final.mp4> <master.wav> [ms_del_cta]
import os, re, sys, json, subprocess, math

MP4 = sys.argv[1] if len(sys.argv) > 1 else "D:/videosdeclaude/rkalarm_entrega.mp4"
WAV = sys.argv[2] if len(sys.argv) > 2 else "public/rkalarm.wav"
CTA = float(sys.argv[3]) if len(sys.argv) > 3 else 1620.5
fail = []

def sh(a):
    return subprocess.run(a, capture_output=True, text=True).stdout.strip()

print("=" * 66)
print("COMPUERTAS DE ENTREGA · %s" % MP4)
print("=" * 66)

# ── 1. PISTA DE AUDIO (se entrego un video MUDO por no chequear esto) ───────────────────
streams = sh(["ffprobe", "-v", "error", "-show_entries", "stream=index,codec_type,codec_name,channels",
              "-of", "csv=p=0", MP4]).splitlines()
# el orden real de ffprobe es index,codec_name,codec_type,channels -> el TIPO es el campo 3,
# no el 2. Mi version anterior no reconocia la pista de audio que ella misma imprimia.
campos = [s.split(",") for s in streams]
tiene_v = any("video" in c for c in campos)
tiene_a = any("audio" in c for c in campos)
print("\n[1] STREAMS · %d encontrados" % len(streams))
for s in streams: print("    " + s)
if not tiene_a: fail.append("NO hay pista de audio")
if not tiene_v: fail.append("NO hay pista de video")

# nivel de audio en 4 puntos, INCLUIDO el ultimo minuto
durv = float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", MP4]) or 0)
print("\n[1.bis] NIVEL DE AUDIO en 4 puntos (nunca -91 dB = silencio)")
for t in [10, durv * 0.35, durv * 0.7, max(0, durv - 45)]:
    out = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-ss", str(int(t)), "-t", "4", "-i", MP4,
                          "-vn", "-af", "volumedetect", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = re.search(r"mean_volume:\s*(-?[\d.]+)", out)
    v = float(m.group(1)) if m else None
    print("    t=%6.0fs  mean %s dB" % (t, v if v is not None else "?"))
    if v is None or v < -60: fail.append("audio en silencio a los %.0fs" % t)

# ── 2. DURACION contra el master (deliver_card frena si difieren) ──────────────────────
durw = float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]) or 0)
print("\n[2] DURACION · video %.3fs · wav %.3fs · dif %.3fs" % (durv, durw, abs(durv - durw)))
if abs(durv - durw) > 0.7: fail.append("video y audio difieren %.2fs" % abs(durv - durw))

# ── 3. TIMESTAMPS: el concat deja un cuadro LARGO en cada costura de chunk ─────────────
rf = sh(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
         "stream=r_frame_rate,avg_frame_rate", "-of", "csv=p=0", MP4])
print("\n[3] CADENCIA · r_frame_rate,avg_frame_rate = %s" % rf)
a, b = (rf.split(",") + ["", ""])[:2]
def ev(x):
    try:
        n, d = x.split("/"); return float(n) / float(d)
    except Exception: return 0.0
if abs(ev(a) - ev(b)) > 0.01:
    fail.append("avg_frame_rate %s != r_frame_rate %s (saltos de PTS)" % (b, a))

dur_t = sh(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
            "packet=duration_time", "-of", "csv=p=0", MP4]).split()
vals = {}
for x in dur_t:
    x = x.strip(",")
    if x and x != "N/A": vals[x] = vals.get(x, 0) + 1
top = sorted(vals.items(), key=lambda k: -k[1])[:3]
print("    duraciones de cuadro mas frecuentes: %s" % top)
raros = sum(n for d, n in vals.items() if abs(float(d) - 1 / 30) > 0.004)
print("    cuadros fuera de 1/30 (+/-4ms): %d de %d" % (raros, sum(vals.values())))
if raros > 3: fail.append("%d cuadros con duracion fuera de 1/30" % raros)

# ── 4. COLOR: el farm saca yuvj420p/pc/bt470bg y eso LAVA la imagen ───────────────────
col = sh(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
          "stream=pix_fmt,color_range,color_space", "-of", "csv=p=0", MP4])
print("\n[4] COLOR · %s   (tiene que ser yuv420p,tv,bt709)" % col)
if col.replace(" ", "") != "yuv420p,tv,bt709": fail.append("color %s (esperado yuv420p,tv,bt709)" % col)

# ── 5. KEYFRAMES: cada 8,3s el navegador vuelve atras = "se ve lageado" ───────────────
kf = sh(["ffprobe", "-v", "error", "-select_streams", "v", "-skip_frame", "nokey",
         "-show_entries", "frame=pts_time", "-of", "csv=p=0", "-read_intervals", "%+120", MP4]).split()
ts = [float(x.strip(",")) for x in kf if x.strip(",").replace(".", "").isdigit()]
gaps = [round(ts[i + 1] - ts[i], 2) for i in range(len(ts) - 1)]
print("\n[5] KEYFRAMES en los primeros 120s: %d · separacion %s" % (len(ts), sorted(set(gaps))[:4]))
if gaps and max(gaps) > 3.0: fail.append("keyframes cada %.1fs (>3s)" % max(gaps))

print("\n" + "=" * 66)
if fail:
    print("FALLAS DE ENTREGA: %d" % len(fail))
    for f in fail: print("   -", f)
    sys.exit(1)
print("OK · 5 compuertas de entrega pasadas")
