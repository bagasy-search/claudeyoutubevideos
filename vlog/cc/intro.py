# INTRO de calidad (pedido del creador 11-oct): en el primer minuto, en vez de avatar quieto, 2 componentes:
#   menu  = ClMenuBoard, la promesa en el pizarrón de la fonda, de "Hoy te enseño" hasta "Soy Claudio"
#   joven = ClOldPhoto, la foto vieja de Claudio con su amá + contadores, desde "Soy Claudio" (~7-9 s)
# Mismo ritmo de cortes que el resto. Corre DESPUÉS de mkov (agrega/reemplaza esas 2 entradas en src/<slug>/ov.json; idempotente).
#   SLUG=x python vlog/cc/intro.py        (foto: D:/rtmp/cc/intro/img/joven_<slug>.png → public/img/<slug>/joven.jpg)
import json, re, unicodedata, sys, subprocess, os
from PIL import Image
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/ccfrijoles/"; sys.path.insert(0, R + f"vlog/{S}"); from recorte import mapear
D = {  # plato (tiza), [(renglón, frase donde se escribe)], leyenda de la foto, stats
 "ccfrijoles":  ("Frijoles de olla", [("Sin remojar nada", "sin remojar nada"), ("En la mitad del tiempo", "en la mitad del tiempo")], "con mi amá, en la fonda · 1984"),
 "cccostillas": ("Costillas en la olla", [("2 horas en la olla", "dos horas en la olla"), ("Tapadas en su salsa", "tapadas en su salsa"), ("La salsa se vuelve glaseado", "esa misma salsa se vuelve")], "jueves de costillas · 1990"),
 "ccejotes":    ("Ejotes de la fonda", [("Un solo sartén", "Un solo sartén"), ("15 minutos", "quince minutos"), ("Nunca más la olla de agua", "y nunca más una olla")], "con mi amá, en la fonda · 1987"),
 "cccafe":      ("Café de olla", [("Piloncillo y canela", "Piloncillo canela"), ("Un clavito, una tira de naranja", "un clavito"), ("5 minutos de reposo", "y cinco minutos de reposo")], "mi primer café de olla · 1986"),
 "ccrepollo":   ("Repollo de la fonda", [("1 kilo de repollo", "Un kilo de repollo"), ("15 minutos", "quince minutos"), ("Y te piden otro plato", "te pide otro plato")], "el pizarrón del lunes · 1993"),
 "ccmuslos":    ("Muslos en su grasa", [("Sartén frío", "Un sartén frío"), ("20 minutos sin tocarlos", "veinte minutos sin tocarlos"), ("Salsa alrededor, nunca encima", "y una salsa que se pone")], "con mi amá, en la fonda · 1996"),
 "cccarne":     ("La carne de la fonda", [("Un corte duro", "Un corte duro"), ("Olla tapada", "una olla tapada"), ("3 horas sin tocarla", "tres horas sin tocarla")], "en el mercado con mi amá · 1991"),
 "cchuevos":    ("Huevos de la fonda", [("Sin aceite", "Sin aceite sin voltear"), ("Sin voltear", "sin voltear sin clara"), ("Con su salsa roja", "Y la salsa roja")], "mi primer huevo · 1985"),
 "ccarroz":     ("Arroz rojo y refritos", [("Arroz rojo", "el arroz rojo"), ("Frijoles refritos", "y los frijoles refritos"), ("Una comida completa", "es una comida completa")], "la comida corrida · 1992"),
 "ccchuletas":  ("Chuletas en rajas", [("Un truco de media hora", "Con un truco de media hora"), ("Un número que lo cambia todo", "y un número que te")], "con mi amá, en la fonda · 1998"),
}
dish, lines, caption = D[S]
WM = json.load(open(R + f"_v3/{S}_wordms.json", encoding="utf8"))
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in WM]
def at(frase, end=False, desde=0.0, need=True, raw=False):
    q = [nw(x) for x in frase.split() if nw(x)]
    for i in range(len(W) - len(q) + 1):
        if WM[i]["s"] >= desde and W[i:i + len(q)] == q: t = WM[i + len(q) - 1]["e"] if end else WM[i]["s"]; return t if raw else mapear(t)
    if need: raise SystemExit(f"{S}: no encuentro «{frase}»")
raw_hoy = at("Hoy te enseño", raw=True); t_hoy = mapear(raw_hoy)
t_soy = at("Soy Claudio", desde=raw_hoy)
c40, c80 = at("Cuarenta años", desde=raw_hoy), at("ochenta comidas", desde=raw_hoy, need=False)
fin = (at("comidas por día", end=True, desde=raw_hoy) if c80 else at("en esta cocina", end=True, desde=raw_hoy)) + 2.6
d_menu = t_soy - 0.2 - (t_hoy - 0.15)
d_foto = min(9.0, max(6.5, fin - (t_soy - 0.15)))
la = []
for txt, fr in lines:
    t = at(fr, desde=raw_hoy, need=False)
    la.append(round(t - (t_hoy - 0.15), 2) if t is not None and t < t_soy else None)
if any(x is None for x in la):   # renglón fuera del tramo: se reparten parejos
    la = [round(0.6 + i * (d_menu - 1.6) / max(1, len(lines)), 2) for i in range(len(lines))]
stats = [{"n": 40, "label": "años en esta cocina"}] + ([{"n": 80, "label": "comidas por día"}] if c80 else [])
sat = [round(c40 - (t_soy - 0.15), 2)] + ([round(c80 - (t_soy - 0.15), 2)] if c80 else [])
# foto → public/img/<slug>/joven.jpg
os.makedirs(R + f"public/img/{S}", exist_ok=True)
Image.open(f"D:/rtmp/cc/intro/img/joven_{S}.png").convert("RGB").save(R + f"public/img/{S}/joven.jpg", quality=90)
VL = R + f"public/vid/{S}/vlog.mp4"
def bed(n, s, d):
    bf = f"vid/{S}/bed_{n}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", VL, "-t", f"{d + 0.3:.3f}", "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", R + "public/" + bf], check=True)
    return f"{bf}#{round(d * 30) + 4}"
s1, s2 = max(0, t_hoy - 0.15), t_soy - 0.15
NEW = [
 {"c": "ClMenuBoard", "k": "menu", "from": round(s1 * 30), "dur": round(d_menu * 30), "t": round(s1, 2),
  "props": {"dish": dish, "lines": [l for l, _ in lines], "at": la, "bed": bed("menu", s1, d_menu)}},
 {"c": "ClOldPhoto", "k": "joven", "from": round(s2 * 30), "dur": round(d_foto * 30), "t": round(s2, 2),
  "props": {"photo": f"img/{S}/joven.jpg", "caption": caption, "stats": stats, "at": sat, "bed": bed("joven", s2, d_foto)}},
]
P = R + f"src/{S}/ov.json"; OV = [o for o in json.load(open(P, encoding="utf8")) if o["k"] not in ("menu", "joven")] + NEW
OV.sort(key=lambda o: o["from"])
for a, b in zip(OV, OV[1:]):
    if a["from"] + a["dur"] > b["from"] - 6: print("recorto", a["k"], a["dur"], "→", b["from"] - 6 - a["from"]); a["dur"] = b["from"] - 6 - a["from"]
json.dump(OV, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(f"{S}: menu {s1:.2f}+{d_menu:.1f}s renglones {la} · joven {s2:.2f}+{d_foto:.1f}s stats {sat}")
# entry: registrar los 2 componentes
E = R + f"src/index_{S}.tsx"; e = open(E, encoding="utf8").read()
if "ClIntro" not in e:
    e = e.replace('import OV from', 'import { ClMenuBoard, ClOldPhoto } from "./claudio/ClIntro";\nimport OV from', 1)
    e = re.sub(r"(const C: Record<string, React\.FC<any>> = \{)", r"\1 ClMenuBoard, ClOldPhoto,", e, 1)
    open(E, "w", encoding="utf8").write(e)
