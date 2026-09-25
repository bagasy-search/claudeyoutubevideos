# Animático del PRIMER MINUTO con ffmpeg (sin Remotion): s1_01 + tráiler (cortes T) + S1 desde s1_02. Voz + foley de T.
# python preview_min1.py  → D:/rtmp/fl_min1.mp4 + hoja de cuadros cada 1 s (D:/rtmp/fl_min1_hoja.jpg)
import json, subprocess, os
V = "D:/Proyectos/video2-wt/falaurel/vlog/falaurel/"; R = "D:/Proyectos/video2-wt/falaurel/"; FPS = 30; O = "D:/rtmp/fl_min1/"
os.makedirs(O, exist_ok=True)
def ff(*a): subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)
TXT = {}
voz = [l for l in open(V + "guion_voz.txt", encoding="utf-8").read().strip().split("\n")]
tr = json.load(open(V + "tramos.json", encoding="utf-8"))
ids = ["s1_01", "s1_v1", "s1_v2", "s1_v3"]
TR = dict(zip(ids, tr[:4]))
p = json.load(open(V + "plan_S1.json", encoding="utf-8")); st = json.load(open(V + "S1/clips/state.json"))
T1 = st["s1_01"]["T"]
TS = json.load(open(V + "T/clips/state.json"))
TRAILER = [["s1_v1", ["t07", "t03", "t06"]], ["s1_v2", ["t01", "t02", "t10", "t04"]], ["s1_v3", ["t05", "t09", "t08"]]]
parts, auds = [], []
ff("-i", p["out"], "-t", str(T1), "-an", "-c:v", "libx264", "-crf", "20", "-r", "30", O + "p0.mp4"); parts.append(O + "p0.mp4")
ff("-i", V + "S1/clips/_audio_total.wav", "-t", str(T1), "-ac", "1", "-ar", "48000", O + "a0.wav"); auds.append(O + "a0.wav")
k = 1
for vid, cuts in TRAILER:
    t = TR[vid]; d = t["e"] - t["s"]; nf = round(d * FPS)
    ff("-ss", f"{t['s']:.3f}", "-t", f"{nf / FPS:.4f}", "-i", R + "out/falaurel/master.wav", "-ac", "1", "-ar", "48000", O + f"v{k}.wav")
    f0 = 0; cl = []
    for i, c in enumerate(cuts):
        f1 = round(nf * (i + 1) / len(cuts)); o = O + f"p{k}_{i}.mp4"
        ff("-ss", "0.5", "-i", V + "T/clips/" + TS[c]["file"], "-frames:v", str(f1 - f0), "-vf", "fps=30,scale=1920:1080", "-c:v", "libx264", "-crf", "20", "-an", o)
        ff("-ss", "0.5", "-i", V + "T/clips/" + TS[c]["file"], "-t", f"{(f1 - f0) / FPS:.4f}", "-vn", "-af", f"apad=whole_dur={(f1 - f0) / FPS:.4f},volume=0.35", "-ac", "1", "-ar", "48000", O + f"f{k}_{i}.wav")
        parts.append(o); cl.append(O + f"f{k}_{i}.wav"); f0 = f1
    open(O + "fl.txt", "w").write("".join(f"file '{x}'\n" for x in cl)); ff("-f", "concat", "-safe", "0", "-i", O + "fl.txt", O + f"fx{k}.wav")
    ff("-i", O + f"v{k}.wav", "-i", O + f"fx{k}.wav", "-filter_complex", "amix=inputs=2:duration=first:normalize=0", O + f"a{k}.wav"); auds.append(O + f"a{k}.wav"); k += 1
rest = 75
ff("-ss", str(T1), "-i", p["out"], "-t", str(rest), "-an", "-c:v", "libx264", "-crf", "20", "-r", "30", O + "pz.mp4"); parts.append(O + "pz.mp4")
ff("-ss", str(T1), "-t", str(rest), "-i", V + "S1/clips/_audio_total.wav", "-ac", "1", "-ar", "48000", O + "az.wav"); auds.append(O + "az.wav")
open(O + "v.txt", "w").write("".join(f"file '{x}'\n" for x in parts)); open(O + "a.txt", "w").write("".join(f"file '{x}'\n" for x in auds))
ff("-f", "concat", "-safe", "0", "-i", O + "v.txt", "-c", "copy", O + "v.mp4")
ff("-f", "concat", "-safe", "0", "-i", O + "a.txt", O + "a.wav")
ff("-i", O + "v.mp4", "-i", O + "a.wav", "-t", "70", "-c:v", "copy", "-c:a", "aac", "-shortest", "D:/rtmp/fl_min1.mp4")
ff("-i", "D:/rtmp/fl_min1.mp4", "-vf", "fps=1,scale=320:180,tile=10x7", "-frames:v", "1", "D:/rtmp/fl_min1_hoja.jpg")
print("ok D:/rtmp/fl_min1.mp4")
