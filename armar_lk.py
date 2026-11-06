# lkhosp (Lobby Karma, clips agnes) — sin música. Base bjprof (Barrio Justice): + voz fija por personaje, planos mudos, tono de sala por escena, golpe sutil + swell en revelaciones.
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
vf = lambda s: ("crop=iw:ih*0.74:(iw-iw)/2:0," if s.get("tapa") else "") + VF   # tapa = subtítulo quemado que Veo dejó: se recorta abajo
VF = "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,fps=24,format=yuv420p"
X264 = ["-g", "48", "-keyint_min", "48", "-sc_threshold", "0", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709"]   # compuerta check_entrega: GOP 2 s + rango tv/bt709
for i, s in enumerate(segs):
    out = f"n/{i:03d}.mov"
    if "card" in s:
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=black:s=1920x1080:r=24:d={s['dur']}", "-f", "lavfi", "-i", f"anullsrc=r=48000:cl=stereo:d={s['dur']}",
             "-vf", f"drawtext=fontfile={FONT}:text='{s['card'].replace(':', chr(92) + ':')}':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2:alpha='if(lt(t,0.4),t/0.4,if(gt(t,{s['dur']}-0.4),({s['dur']}-t)/0.4,1))',format=yuv420p",
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
        fc += "".join(parts) + f"concat=n={len(parts)}:v=1:a=0,{vf(s)}[v];[0:a]atrim={t0}:{t1},asetpts=PTS-STARTPTS,aresample=48000{AD}[a]"
        run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-frames:v", str(NF), "-c:v", "libx264", "-preset", "medium", "-crf", "17", *X264, "-c:a", "pcm_s16le", "-ac", "2", out])
    else:
        if s.get("voz"):    # mejora 1: voz fija del personaje (misma línea de tiempo que el clip)
            run(["ffmpeg", "-v", "error", "-y", "-ss", str(t0), "-to", str(t1), "-i", src, "-ss", str(t0), "-to", str(t1), "-i", f"voz/{s['voz']}", "-map", "0:v",
                 "-vf", vf(s) + ",tpad=stop_mode=clone:stop_duration=0.2", "-filter_complex", f"[0:a]aresample=48000,volume={s.get('amb', 0.2)}[c];[1:a]aresample=48000,aformat=channel_layouts=stereo[v];[v][c]amix=inputs=2:normalize=0{AD}[a]", "-map", "[a]", "-frames:v", str(NF), "-c:v", "libx264", "-preset", "medium", "-crf", "17", *X264, "-c:a", "pcm_s16le", "-ac", "2", out])
        else:
            run(["ffmpeg", "-v", "error", "-y", "-ss", str(t0), "-to", str(t1), "-i", src, "-vf", vf(s) + ",tpad=stop_mode=clone:stop_duration=0.2", "-af", "aresample=48000" + (",volume=0" if (s["clip"] in MUTE or s.get("mudo")) else "") + AD, "-frames:v", str(NF),
                 "-c:v", "libx264", "-preset", "medium", "-crf", "17", *X264, "-c:a", "pcm_s16le", "-ac", "2", out])
def vdur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", f], capture_output=True, text=True).stdout) / 24
D = [vdur(f"n/{i:03d}.mov") for i in range(len(segs))]
T = [sum(D[:i]) for i in range(len(segs))]; TOT = sum(D)
# ⛔ sincronía a prueba de balas (19-oct): el video manda. Cada plano → video solo (n/NNN_v.mp4, -c copy) y su audio
# recortado/rellenado al largo EXACTO de sus cuadros (a/NNN.wav). Concat por separado → ningún desfase acumulado.
os.makedirs("a", exist_ok=True)
for i in range(len(segs)):
    run(["ffmpeg", "-v", "error", "-y", "-i", f"n/{i:03d}.mov", "-map", "0:v", "-c:v", "copy", f"n/{i:03d}_v.mp4"])
    run(["ffmpeg", "-v", "error", "-y", "-i", f"n/{i:03d}.mov", "-map", "0:a", "-af", f"apad,atrim=end={D[i]:.6f}", "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", f"a/{i:03d}.wav"])
with open("lista.txt", "w") as f:
    for i in range(len(segs)): f.write(f"file 'n/{i:03d}_v.mp4'\n")
with open("lista_a.txt", "w") as f:
    for i in range(len(segs)): f.write(f"file 'a/{i:03d}.wav'\n")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "lista.txt", "-map", "0:v", "-c:v", "copy", "video.mp4"])
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "lista_a.txt", "-c:a", "pcm_s16le", "voz.wav"])
dv, da = dur("video.mp4"), dur("voz.wav"); print(f"video {dv:.3f} s · voz {da:.3f} s · suma cuadros {TOT:.3f} s")
if abs(dv - da) > 0.1 or abs(dv - TOT) > 0.1: sys.exit("⛔ video y voz de distinto largo")
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
# lkhosp: SIN MÚSICA ni efectos agregados. Sólo el audio real de los clips (ambiente agnes, viene en voz.wav vía el plano)
# + la voz fija (también en voz.wav). El "amb" de cada plano hablado = audio nativo del clip bajo (-14 dB) sumado en el plano.
# entradas: voz.wav = 0, ins = 1..n
fc = "[0:a]loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000[out]"
run(["ffmpeg", "-v", "error", "-y", "-i", "voz.wav", "-filter_complex", fc, "-map", "[out]", "-t", f"{TOT:.3f}", "-c:a", "pcm_s16le", "mezcla.wav"])
run(["ffmpeg", "-v", "error", "-y", "-i", "video.mp4", "-i", "mezcla.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", f"{S}.mp4"])
run(["ffmpeg", "-v", "error", "-y", "-i", f"{S}.mp4", "-vf", "scale=-2:480", "-c:v", "libx264", "-preset", "faster", "-crf", "30", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", "PREVIA_liviana.mp4"])
with open("duraciones.txt", "w") as f: f.write("\n".join(f"{esc} {a:.2f} {b:.2f}" for esc, a, b in tramos))
print("ok", S, f"{TOT:.1f} s")
