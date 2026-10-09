# -*- coding: utf-8 -*-
# Verifica que los 8 componentes de src/fumoscasf/ov.json entren en el video y que cada bed_<n>.mp4
# tenga los cuadros que dice el propio props.bed ("#nf" = cuadros del clip del fondo).
import json, os, subprocess
R = "D:/Proyectos/video2-wt/fumoscasf/"
TOT = 22259
ov = json.load(open(R + "src/fumoscasf/ov.json", encoding="utf8"))
for o in ov:
    bed = o["props"]["bed"]; f = int(bed.split("#")[1]); p = R + "public/" + bed.split("#")[0]
    nb = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0",
                             "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", p],
                            capture_output=True, text=True).stdout)
    fin = o["from"] + o["dur"]
    print(f"{o['c']:14s} from {o['from']:6d} dur {o['dur']:4d} fin {fin:6d} "
          f"{'OK' if fin <= TOT else 'SE PASA'} · {os.path.basename(p)} {nb}f vs #{f} "
          f"{'OK' if nb >= f else 'CORTO'}")
