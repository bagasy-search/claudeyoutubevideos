# Mide los guiones filmados de la red Loretta: caracteres de VOZ (sin tags), minutos estimados (14,5 car/s) y prohibidas en voz.
# python vlog/lnet/medir.py ckmash ckgravy ...   (sin args = todos los *_filmado.txt de lnet)
import re, sys, glob, os
sys.stdout.reconfigure(encoding="utf-8")
R = "D:/Proyectos/video2-wt/lnet/guiones/"
slugs = sys.argv[1:] or sorted(os.path.basename(f)[:-len("_filmado.txt")] for f in glob.glob(R + "*_filmado.txt"))
BAD = re.compile(r"\bfree\b|gratis|\$\d|\.com|http|vercel|\bfreebie|\bUS\$", re.I)
for s in slugs:
    L = [l for l in open(R + s + "_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
    voz = [re.sub(r"\s{2,}", " ", re.sub(r"\[[^\]]*\]", "", l)).strip() for l in L]
    n = sum(len(v) for v in voz); bad = [(i, m.group(0)) for i, v in enumerate(voz) for m in BAD.finditer(v)]
    raw = sum(len(re.findall(r"free", v, re.I)) for v in voz)
    av = sum(1 for l in L if re.match(r"^\[[^|\]]*\|\s*av\b", l) or " ;; av" in l.split("]")[0])
    qr = [i for i, l in enumerate(L) if re.search(r"[|;]\s*qr\b", l.split("]")[0])]
    print(f"{s:10s} {len(L):3d} párr · {n:6d} car · ~{n/14.5/60:4.1f} min · prohibidas {len(bad)} {bad[:4]} · 'free' crudo {raw} · párr con av {av} · qr en {qr}")
