# Revisión por MUESTRA del mp4 entregado (remoto, sin bajarlo entero): hoja 0-3 min (cada 6 s) + hoja de un tramo del medio
# (cada 6 s, 3 min alrededor del QR), cuadros vs TOTAL_FRAMES, silencios del minuto 1, nivel del audio. python vlog/hh/review.py <slug> [...]
import json, os, re, subprocess, sys
R = "D:/Proyectos/video2-wt/lhh/"; REPO = "bagasy-search/claudeyoutubevideos"
FONT = "C\\:/Windows/Fonts/arialbd.ttf"
NET = ["-reconnect", "1", "-reconnect_on_network_error", "1", "-reconnect_delay_max", "30", "-rw_timeout", "60000000"]  # sin esto una conexión trabada cuelga ffmpeg para siempre
def run(a, **k): return subprocess.run(a, capture_output=True, text=True, creationflags=0x08000000, **k)
for S in sys.argv[1:]:
    url = run(["gh", "api", f"repos/{REPO}/releases/tags/{S}", "-q", f'.assets[] | select(.name=="{S}.mp4") | .browser_download_url']).stdout.strip()
    tot = int(re.search(r"TOTAL_FRAMES = (\d+)", open(R + f"src/{S}/timeline.gen.ts").read()).group(1))
    info = json.loads(run(["ffprobe", "-v", "error", "-rw_timeout", "60000000", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames,pix_fmt,color_range", "-of", "json", url]).stdout)
    v = [s for s in info["streams"] if s["codec_type"] == "video"][0]; dur = float(info["format"]["duration"])
    qr = json.load(open(R + f"_v3/{S}_tl.json", encoding="utf8"))["qr"][0]; m, sec = qr.split(" ")[0].split(":"); q0 = int(m) * 60 + int(sec)
    os.makedirs(R + f"_v3/rev_{S}", exist_ok=True)
    DT = "drawtext=fontfile='" + FONT + "':text='%{pts\:hms\:OFF}':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.6"
    # red lenta: UNA lectura del inicio (2 min: hoja + silencios del min 1 + LUFS) y 90 s alrededor del QR
    r1 = run(["ffmpeg", "-hide_banner", "-y", "-t", "120", *NET, "-i", url, "-filter_complex",
              "[0:v]fps=1/4,scale=320:-1," + DT.replace('OFF', '0') + ",tile=6x5[v];[0:a]atrim=0:60,silencedetect=noise=-32dB:d=0.3,anullsink;[0:a]ebur128[a]",
              "-map", "[v]", "-frames:v", "1", R + f"_v3/rev_{S}_ini.jpg", "-map", "[a]", "-f", "null", "-"])
    sil = r1.stderr; I = re.findall(r"I:\s+(-?[\d.]+) LUFS", sil)
    t0 = max(0, q0 - 30)
    # tramo del QR: 6 lecturas cortas de 15 s en paralelo (una de 90 s se queda trabada con la red ocupada)
    from concurrent.futures import ThreadPoolExecutor
    from PIL import Image
    def row(k):
        a = t0 + 15 * k; f = R + f"_v3/rev_{S}/medio_r{k}.jpg"
        for _ in range(4):
            try: r = run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.2f}", "-t", "15", *NET, "-i", url, "-vf",
                     "fps=1/3,scale=320:-1," + DT.replace('OFF', f'{a:.2f}') + ",tile=5x1", "-frames:v", "1", f], timeout=240)
            except subprocess.TimeoutExpired: continue
            if r.returncode == 0 and os.path.exists(f): return f
        return None
    rows = list(ThreadPoolExecutor(6).map(row, range(6)))
    ims = [Image.open(f) for f in rows if f]
    if ims:
        sh = Image.new("RGB", (ims[0].width, sum(x.height for x in ims))); y = 0
        for x in ims: sh.paste(x, (0, y)); y += x.height
        sh.save(R + f"_v3/rev_{S}_medio.jpg", quality=88)
    if len(ims) < 6: print(f"⚠ {S}: tramo medio con {len(ims)}/6 filas")
    print(f"{S}: {dur/60:.2f} min · {v['width']}x{v['height']} {v['r_frame_rate']} {v.get('pix_fmt')} {v.get('color_range')} · cuadros {v.get('nb_frames')} / TOTAL {tot} · silencios min1 {len(re.findall('silence_start', sil))} · LUFS(0-2 min) {I[-1] if I else '?'}")
