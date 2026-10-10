# VLOG Vaquero (receta furatones5): public/vid/<slug>/vlog_raw.mp4 (ensamblado, = tiempos del máster) → public/vid/<slug>/vlog.mp4 SIN las pausas
# de cortes.json, y con los MISMOS tramos la voz (vlog/<slug>/voz_cut.wav) y el sonido real de los DET (det_cut.wav) → labios en sync.
# Cortes alineados a cuadro (pausas.py) y selección por NÚMERO de cuadro. mapear(t) = tiempo del máster → tiempo recortado (mkov / mezcla).
#   SLUG=x python vlog/cv/recorte.py
import json, subprocess, os
S = os.environ["SLUG"]; R = f"D:/Proyectos/video2-wt/{os.environ.get('WT', S)}/"; D = R + f"vlog/{S}/"
C = json.load(open(D + "cortes.json"))
def mapear(t):
    q = 0.0
    for a, b in C:
        if t >= b: q += b - a
        elif t > a: q += t - a
    return t - q
def dur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
if __name__ == "__main__":
    src = R + f"public/vid/{S}/vlog_raw.mp4"; T = dur(src)
    keep, t = [], 0.0
    for a, b in C: keep.append((t, a)); t = b
    keep.append((t, T))
    sel = "+".join(f"between(n,{round(a * 30)},{round(b * 30) - 1})" for a, b in keep)
    open(D + "_sel.txt", "w").write(f"select='{sel}',setpts=N/(30*TB)")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-an", "-/vf", D + "_sel.txt", "-fps_mode", "passthrough", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-bf", "0",
                    "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", R + f"public/vid/{S}/vlog.mp4"], check=True)
    # audio: los mismos tramos en muestras (48 kHz: 1 cuadro = 1600 muestras exactas)
    asel = "+".join(f"between(t,{round(a * 30) / 30:.5f},{round(b * 30) / 30 - 1e-5:.5f})" for a, b in keep)
    open(D + "_asel.txt", "w").write(f"aresample=48000,aselect='{asel}',asetpts=N/SR/TB")
    for i, o in ((R + f"public/{S}.wav", "voz_cut.wav"), (D + "det_bed.wav", "det_cut.wav")):
        if os.path.exists(i): subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", i, "-/af", D + "_asel.txt", "-ar", "48000", "-c:a", "pcm_s16le", D + o], check=True)
    nf = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", R + f"public/vid/{S}/vlog.mp4"], capture_output=True, text=True).stdout)
    print(f"MEDIDO recorte: vlog {nf} cuadros = {nf / 30:.2f} s · voz recortada {dur(D + 'voz_cut.wav'):.2f} s · esperado {mapear(T):.2f} s")
