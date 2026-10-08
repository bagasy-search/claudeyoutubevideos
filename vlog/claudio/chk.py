# Chequeo del guion ANTES de la voz: caracteres (tope), duración estimada, minuto de cada mención del Método, regionalismos y "usted".
# SLUG=x python vlog/claudio/chk.py [--cps 14.85] [--max 13500]
import os, re, sys, argparse
for _s in (sys.stdout,):
    try: _s.reconfigure(encoding="utf-8")
    except Exception: pass
ap = argparse.ArgumentParser(); ap.add_argument("--cps", type=float, default=14.85); ap.add_argument("--max", type=int, default=13500); a = ap.parse_args()
R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"); S = os.environ["SLUG"]
L = [l for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
acc = 0; tot = sum(len(re.sub(r"^\[[^\]]*\]\s*", "", l)) for l in L)
MARK = re.compile(r"(Método|página|código|veintisiete|regla número|la número siete|test)", re.I)
REG = re.compile(r"\b(vos|tenés|podés|querés|mirá|fijate|campera|placard|remera|pileta|heladera|medias|plata|che|acá nomás|usted|ustedes|le muestro|le dejo|le digo|mire|pida|ponga|haga)\b", re.I)
for i, l in enumerate(L):
    t = re.sub(r"^\[[^\]]*\]\s*", "", l); tag = re.match(r"^\[([^\]]*)\]", l)
    s = acc / a.cps; acc += len(t)
    m = MARK.findall(t); r = REG.findall(t)
    if m or r: print(f"{i:3d} {int(s//60)}:{int(s%60):02d} [{tag.group(1) if tag else ''}] {', '.join(sorted(set(x.lower() for x in m)))}{'  ⛔ REG: ' + ','.join(r) if r else ''}")
print(f"\n{len(L)} párrafos · {tot} car · ~{tot/a.cps/60:.2f} min a {a.cps} car/s · tope {a.max}: {'OK' if tot < a.max else '⛔ PASADO'}")
