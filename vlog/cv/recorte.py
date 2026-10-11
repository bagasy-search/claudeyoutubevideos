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
    # SIN expresiones select gigantes (184 cortes → ffmpeg "Cannot allocate memory"): cuadros por tubería y audio con numpy
    import numpy as np
    K = set()
    for a, b in keep: K.update(range(round(a * 30), round(b * 30)))
    W, H = 1920, 1080; FS = W * H * 3 // 2
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-an", "-f", "rawvideo", "-pix_fmt", "yuv420p", "-s", f"{W}x{H}", "-"], stdout=subprocess.PIPE, bufsize=FS * 4)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "yuv420p", "-s", f"{W}x{H}", "-r", "30", "-i", "-", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-bf", "0",
                            "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", R + f"public/vid/{S}/vlog.mp4"], stdin=subprocess.PIPE, bufsize=FS * 4)
    n = 0
    while True:
        f = dec.stdout.read(FS)
        if len(f) < FS: break
        if n in K: enc.stdin.write(f)
        n += 1
    enc.stdin.close(); assert enc.wait() == 0 and dec.wait() == 0
    for i, o in ((R + f"public/{S}.wav", "voz_cut.wav"), (D + "det_bed.wav", "det_cut.wav")):
        if not os.path.exists(i): continue
        x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", i, "-ar", "48000", "-ac", "2", "-f", "s16le", "-"], capture_output=True, check=True).stdout, np.int16).reshape(-1, 2)
        y = np.concatenate([x[round(a * 30) * 1600:round(b * 30) * 1600] for a, b in keep])
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", "48000", "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", D + o], input=y.tobytes(), check=True)
    nf = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", R + f"public/vid/{S}/vlog.mp4"], capture_output=True, text=True).stdout)
    print(f"MEDIDO recorte: vlog {nf} cuadros = {nf / 30:.2f} s · voz recortada {dur(D + 'voz_cut.wav'):.2f} s · esperado {mapear(T):.2f} s")
