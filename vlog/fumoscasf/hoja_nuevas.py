# -*- coding: utf-8 -*-
# Hoja de contacto con las fotos base NUEVAS (las que todavía no tienen clip), para mirarlas antes de animar.
import json, os, subprocess
R = "D:/Proyectos/video2-wt/fumoscasf/"
l = json.load(open(R + "_v3/fumoscasf_i2v_pend.json", encoding="utf8"))
TMP = R + "_v3/_nuevas/"; os.makedirs(TMP, exist_ok=True)
ls = []
for x in l:
    dst = TMP + x["nombre"] + ".jpg"
    vf = ("scale=320:180,pad=330:208:0:28:black,"
          "drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='" + x["nombre"] + "':x=4:y=4:fontsize=18:fontcolor=yellow")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", R + "public/img/fumoscasf/" + x["nombre"] + ".png",
                    "-vf", vf, "-frames:v", "1", "-q:v", "4", dst], check=True)
    ls.append(dst)
with open(TMP + "l.txt", "w") as f:
    for p in ls: f.write("file '" + p.replace("\\", "/") + "'\n")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", TMP + "l.txt",
                "-vf", "tile=8x7:padding=4:color=white", "-frames:v", "1", "-q:v", "4",
                "D:/rtmp/fumoscasf_nuevas.jpg"], check=True)
print("hoja: D:/rtmp/fumoscasf_nuevas.jpg ·", len(ls), "fotos")
