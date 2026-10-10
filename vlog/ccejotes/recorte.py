# arm/vlog_full.mp4 + arm/mix_full.wav (armado, = tiempos del máster) → public/vid/ccejotes/vlog.mp4 + out/ccejotes_mix.wav SIN las pausas
# de cortes.json (imagen y sonido cortan los mismos cuadros → labios en sync; 30 fps CFR). Mezcla a −14 LUFS, true peak ≤ −1. mapear(t) lo usa mkov.
import json, subprocess, os, re
R = "D:/Proyectos/video2-wt/ccfrijoles/"; D = R + "vlog/ccejotes/"; A = os.environ.get("ARM", "C:/rtmp_cc/ccejotes/arm/"); SR = 48000
C = json.load(open(D + "cortes.json"))
def mapear(t):
    q = 0.0
    for a, b in C:
        if t >= b: q += b - a
        elif t > a: q += t - a
    return t - q
if __name__ == "__main__":
    import numpy as np
    src = A + "vlog_full.mp4"; nf0 = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
    T = nf0 / 30; keep, t = [], 0.0
    for a, b in C: keep.append((t, a)); t = b
    keep.append((t, T))
    # corte por NÚMERO de cuadro, cuadro a cuadro por tubería (el select de ffmpeg con 300 tramos devolvía cuadros de más)
    fs = sorted({i for a, b in keep for i in range(round(a * 30), round(b * 30))}); want = set(fs)
    os.makedirs(R + "public/vid/ccejotes", exist_ok=True)
    FB = 1920 * 1080 * 3 // 2
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-an", "-f", "rawvideo", "-pix_fmt", "yuv420p", "-"], stdout=subprocess.PIPE, bufsize=FB * 4)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "yuv420p", "-s", "1920x1080", "-r", "30", "-i", "-", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-bf", "0",
                            "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", R + "public/vid/ccejotes/vlog.mp4"], stdin=subprocess.PIPE, bufsize=FB * 4)
    i = 0
    while True:
        b = dec.stdout.read(FB)
        if len(b) < FB: break
        if i in want: enc.stdin.write(b)
        i += 1
    enc.stdin.close(); enc.wait(); dec.wait()
    assert i == nf0, (i, nf0)
    nf = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", R + "public/vid/ccejotes/vlog.mp4"], capture_output=True, text=True).stdout)
    assert nf == len(fs), (nf, len(fs))
    # sonido: mismos tramos en muestras (cuadro → 1600 muestras), micro-fundido de 4 ms en cada costura
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", A + "mix_full.wav", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    X = np.frombuffer(raw, np.float32).reshape(-1, 2); parts = []; fk = int(0.004 * SR); r = np.linspace(0, 1, fk, dtype=np.float32)[:, None]
    for a, b in keep:
        p = X[round(a * 30) * 1600: round(b * 30) * 1600].copy()
        if len(p) > 2 * fk: p[:fk] *= r; p[-fk:] *= r[::-1]
        parts.append(p)
    mix = np.concatenate(parts); mix = np.pad(mix, ((0, max(0, nf * 1600 - len(mix))), (0, 0)))[: nf * 1600]
    def lufs(x):
        p = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], input=x.astype(np.float32).tobytes(), capture_output=True)
        o = p.stderr.decode("utf8", "replace"); return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1]), float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)[-1])
    I, tp = lufs(mix); mix = mix * 10 ** ((-14 - I) / 20)
    for _ in range(4):
        I, tp = lufs(mix)
        if tp <= -1.0: break
        pk = 10 ** (-1.3 / 20); mix = np.tanh(mix / pk) * pk; I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
    os.makedirs(R + "out", exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", "C:/rtmp_cc/out/ccejotes_mix.wav"], input=mix.astype(np.float32).tobytes(), check=True)
    I, tp = lufs(mix)
    open(R + "src/ccejotes/total.ts", "w").write(f"export const TOTAL_FRAMES = {nf};\n")
    print(f"vlog recortado: {nf} cuadros = {nf / 30:.2f} s ({nf / 1800:.2f} min) · mix {len(mix) / SR:.2f} s · {I:.1f} LUFS · TP {tp:.1f}")
