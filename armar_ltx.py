# Armado de un video LTX (clips de 10 s en orden) EN EL FARM. Entrada: clips/*.mp4 + orden.json [ids] + fix.json {id: [[t0,t1],...]}
# 1) fundidos → corte seco: congela el último cuadro limpio hasta la mitad del fundido y el primero limpio después (audio intacto)
# 2) une todo re-codificando parejo + voz a -14 LUFS / -1,5 dBTP (regla del canal) → <slug>.mp4
import json, os, subprocess, sys
S = sys.argv[1]
orden = json.load(open("orden.json")); fix = json.load(open("fix.json")) if os.path.exists("fix.json") else {}
os.makedirs("n", exist_ok=True)
def run(a): subprocess.run(a, check=True)
for i, cid in enumerate(orden):
    src, dst = f"clips/{cid}.mp4", f"n/{i:03d}.mp4"
    vs = []
    segs = sorted(fix.get(cid, []))
    if segs:
        parts, prev, k = [], 0.0, 0
        fc = f"[0:v]split={2 * len(segs) + 1}" + "".join(f"[s{j}]" for j in range(2 * len(segs) + 1)) + ";"
        for (t0, t1) in segs:
            tm = (t0 + t1) / 2
            fc += f"[s{k}]trim={prev}:{t0},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={tm - t0:.3f}[v{k}];"; parts.append(f"[v{k}]"); k += 1
            fc += f"[s{k}]trim=start={t1},setpts=PTS-STARTPTS,trim=end_frame=1,tpad=stop_mode=clone:stop_duration={t1 - tm:.3f}[v{k}];"; parts.append(f"[v{k}]"); k += 1
            prev = t1
        fc += f"[s{k}]trim=start={prev},setpts=PTS-STARTPTS[v{k}];"; parts.append(f"[v{k}]")
        fc += "".join(parts) + f"concat=n={len(parts)}:v=1:a=0,fps=24,format=yuv420p[v]"
        vmap = ["-filter_complex", fc, "-map", "[v]"]
    else:
        vmap = ["-map", "0:v", "-vf", "fps=24,format=yuv420p"]
    run(["ffmpeg", "-v", "error", "-y", "-i", src, *vmap, "-map", "0:a", "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "2", f"n/{i:03d}.mov"])
with open("lista.txt", "w") as f:
    for i in range(len(orden)): f.write(f"file 'n/{i:03d}.mov'\n")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "lista.txt", "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000",
     "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", f"{S}.mp4"])
run(["ffmpeg", "-v", "error", "-y", "-i", f"{S}.mp4", "-vf", "scale=-2:480", "-c:v", "libx264", "-preset", "faster", "-crf", "30", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", "PREVIA_liviana.mp4"])
print("ok", S)
