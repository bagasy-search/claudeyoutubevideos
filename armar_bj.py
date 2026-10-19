# Montaje de una novela LTX (clips largos con tomas) EN EL FARM. Entrada: clips/*.mp4 + plan.json + music/*.m4a + sfx/*
# plan.json = {"segs": [{"clip": id, "t0": s, "t1": s, "esc": n} | {"card": "TEXTO", "dur": s, "esc": n}],
#              "beds": {"<esc>": "tens"}, "reveal": [[seg_idx, t_en_seg]], "fix": {id: [[t0,t1],...]}, "mute": [id]}  (mute = plano mudo que murmura: audio nativo en 0)
# 1) cada segmento → n/NNN.mov 1920x1080 24 fps (clip escalado, cartel negro con texto) con su audio nativo
# 2) concat → voz; cama propia por escena con sidechain bajo la voz; whoosh entre escenas; riser+impacto en revelaciones;
#    boom al cierre de cada escena; braam al teaser → voz a -14 LUFS / -1,5 dBTP → <slug>.mp4 + PREVIA_liviana.mp4
import json, os, subprocess, sys
S = sys.argv[1]
P = json.load(open("plan.json")); segs = P["segs"]; fix = P.get("fix", {}); MUTE = set(P.get("mute", []))
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
os.makedirs("n", exist_ok=True)
def run(a): subprocess.run(a, check=True)
def dur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
VF = "scale=1964:1080:flags=lanczos,crop=1920:1080,fps=24,format=yuv420p"
X264 = ["-g", "48", "-keyint_min", "48", "-sc_threshold", "0", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709"]   # compuerta check_entrega: GOP 2 s + rango tv/bt709
for i, s in enumerate(segs):
    out = f"n/{i:03d}.mov"
    if "card" in s:
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=black:s=1920x1080:r=24:d={s['dur']}", "-f", "lavfi", "-i", f"anullsrc=r=48000:cl=stereo:d={s['dur']}",
             "-vf", f"drawtext=fontfile={FONT}:text='{s['card']}':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2:alpha='if(lt(t,0.4),t/0.4,if(gt(t,{s['dur']}-0.4),({s['dur']}-t)/0.4,1))',format=yuv420p",
             "-c:v", "libx264", "-preset", "medium", "-crf", "17", *X264, "-c:a", "pcm_s16le", "-shortest", out])
        continue
    src = f"clips/{s['clip']}.mp4"; t0, t1 = s["t0"], s["t1"]
    NF = max(1, round((t1 - t0) * 24)); AD = f",apad,atrim=end={NF / 24:.6f}"   # ⛔ cuadros y audio del MISMO largo (19-oct: 1 cuadro de más por plano = 6 s de desfase al final)
    fx = [x for x in fix.get(s["clip"], []) if x[0] >= t0 and x[1] <= t1]
    if fx:   # fundido dentro del clip → corte seco en la mitad (congela el último cuadro limpio / el primero limpio después)
        parts, prev, fc, k = [], t0, "", 0
        n = 2 * len(fx) + 1; fc = f"[0:v]split={n}" + "".join(f"[s{j}]" for j in range(n)) + ";"
        for (a, b) in fx:
            m = (a + b) / 2
            fc += f"[s{k}]trim={prev}:{a},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={m - a:.3f}[v{k}];"; parts.append(f"[v{k}]"); k += 1
            fc += f"[s{k}]trim=start={b},setpts=PTS-STARTPTS,trim=end_frame=1,tpad=stop_mode=clone:stop_duration={b - m:.3f}[v{k}];"; parts.append(f"[v{k}]"); k += 1
            prev = b
        fc += f"[s{k}]trim={prev}:{t1},setpts=PTS-STARTPTS[v{k}];"; parts.append(f"[v{k}]")
        fc += "".join(parts) + f"concat=n={len(parts)}:v=1:a=0,{VF}[v];[0:a]atrim={t0}:{t1},asetpts=PTS-STARTPTS,aresample=48000{AD}[a]"
        run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-frames:v", str(NF), "-c:v", "libx264", "-preset", "medium", "-crf", "17", *X264, "-c:a", "pcm_s16le", "-ac", "2", out])
    else:
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(t0), "-to", str(t1), "-i", src, "-vf", VF + ",tpad=stop_mode=clone:stop_duration=0.2", "-af", "aresample=48000" + (",volume=0" if s["clip"] in MUTE else "") + AD, "-frames:v", str(NF),
             "-c:v", "libx264", "-preset", "medium", "-crf", "17", *X264, "-c:a", "pcm_s16le", "-ac", "2", out])
def vdur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", f], capture_output=True, text=True).stdout) / 24
D = [vdur(f"n/{i:03d}.mov") for i in range(len(segs))]
mal = [(i, round(D[i] - dur(f"n/{i:03d}.mov"), 3)) for i in range(len(segs)) if abs(D[i] - dur(f"n/{i:03d}.mov")) > 0.03]
print("segmentos con audio y video de distinto largo:", mal[:20] or "ninguno")
if mal: sys.exit("⛔ desfase audio/video por segmento")
T = [sum(D[:i]) for i in range(len(segs))]; TOT = sum(D)
with open("lista.txt", "w") as f:
    for i in range(len(segs)): f.write(f"file 'n/{i:03d}.mov'\n")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "lista.txt", "-map", "0:v", "-c:v", "copy", "video.mp4"])
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "lista.txt", "-map", "0:a", "-c:a", "pcm_s16le", "voz.wav"])
# ── tramos por escena (esc 0 = teaser)
tramos = []
for i, s in enumerate(segs):
    if tramos and tramos[-1][0] == s["esc"]: tramos[-1][2] = T[i] + D[i]
    else: tramos.append([s["esc"], T[i], T[i] + D[i]])
ins, fl, k = [], [], 0
def add(path, t, vol, dur_=None):
    global k
    ins.extend(["-i", path]); j = sum(1 for x in ins if x == "-i")
    tr = f"atrim=0:{dur_}," if dur_ else ""
    fl.append(f"[{j}:a]{tr}aresample=48000,aformat=channel_layouts=stereo,volume={vol},adelay={int(t*1000)}|{int(t*1000)}[x{k}]"); k += 1
beds = P.get("beds", {})
for esc, a, b in tramos:
    bed = beds.get(str(esc))
    if bed:   # cama propia en loop, fundido de entrada/salida
        ins.extend(["-stream_loop", "-1", "-i", f"music/{bed}.m4a"])
        j = sum(1 for x in ins if x == "-i")
        fl.append(f"[{j}:a]atrim=0:{b - a:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=1.5,afade=t=out:st={max(0, b - a - 2):.3f}:d=2,volume=0.20,adelay={int(a*1000)}|{int(a*1000)}[x{k}]"); k += 1
    if a > 0.1: add("sfx/cp_whoosh.wav", max(0, a - 0.3), 0.5)
    add("sfx/boom.wav", max(0, b - 0.9), 0.45 if esc else 0.7)
if tramos and tramos[0][0] == 0: add("sfx/cp_boom.wav", 0.0, 0.7)
for si, t in P.get("reveal", []):
    at = T[si] + t
    add("sfx/cp_riser.wav", max(0, at - 2.0), 0.35, 2.0)
    add("sfx/impacto_hit.mp3", at, 0.6)
# entradas: voz.wav = 0, ins = 1..n
mix = "".join(f"[x{q}]" for q in range(k))
fc = ";".join(fl) + f";{mix}amix=inputs={k}:normalize=0[fx];[0:a]asplit=2[v1][v2];[fx][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck];[v1][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000[out]"
run(["ffmpeg", "-v", "error", "-y", "-i", "voz.wav", *ins, "-filter_complex", fc, "-map", "[out]", "-t", f"{TOT:.3f}", "-c:a", "pcm_s16le", "mezcla.wav"])
run(["ffmpeg", "-v", "error", "-y", "-i", "video.mp4", "-i", "mezcla.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", f"{S}.mp4"])
run(["ffmpeg", "-v", "error", "-y", "-i", f"{S}.mp4", "-vf", "scale=-2:480", "-c:v", "libx264", "-preset", "faster", "-crf", "30", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", "PREVIA_liviana.mp4"])
with open("duraciones.txt", "w") as f: f.write("\n".join(f"{esc} {a:.2f} {b:.2f}" for esc, a, b in tramos))
print("ok", S, f"{TOT:.1f} s")
