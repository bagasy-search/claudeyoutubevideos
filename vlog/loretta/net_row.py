# Fila del informe final de un slug entregado → D:/rtmp/lnet46/entregas.tsv. SLUG=x JOB=n python vlog/loretta/net_row.py
import os, re, json, subprocess
S = os.environ["SLUG"]; J = os.environ["JOB"]; R = "D:/Proyectos/video2-wt/lnet46/"
CH = {"ck": "Church Kitchen (242)", "fo": "Cooks for One (313)", "cl": "Clean Home (315)", "fh": "Farmhouse (316)", "su": "Sunday Morning (317)"}[S[:2]]
ts = open(R + f"src/{S}/timeline.gen.ts", encoding="utf8").read(); TL = json.loads(re.search(r"export const TL: any\[\] = (.*);", ts).group(1))
F = int(re.search(r"TOTAL_FRAMES = (\d+)", ts).group(1))
voz = "".join(l for l in open(R + f"guiones/{S}.txt", encoding="utf8").read().splitlines(True) if not l.startswith("#"))
real = sum(min(c["dur"], c.get("clipF") or c["dur"]) for c in TL if c.get("real")) + sum(c["dur"] for c in TL if c.get("k") == "snap")
paras = json.load(open(R + f"_v3/{S}_paras.json", encoding="utf8"))
cta = [round(p["s"] / 60, 1) for p in paras if p["sec"].startswith("CTA")]
qr = [round(c["from"] / 30 / 60, 1) for c in TL if c.get("name") == "LorQR"]
m = lambda x: f"{int(x)}:{int(round((x % 1) * 60)):02d}"
row = [CH, S, J, m(F / 30 / 60), str(len(voz)), f"{100 * real / F:.0f}%", " / ".join(str(x) for x in cta), " ".join(str(x) for x in qr)]
open("D:/rtmp/lnet46/entregas.tsv", "a", encoding="utf8").write("\t".join(row) + "\n"); print("\t".join(row))
