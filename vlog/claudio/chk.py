# Script check BEFORE the voice (EN): characters (cap), estimated duration, minute of every Manual mention.
# SLUG=x python vlog/claudio/chk.py [--cps 18.5] [--max 17600]
import os, re, sys, argparse
for _s in (sys.stdout,):
    try: _s.reconfigure(encoding="utf-8")
    except Exception: pass
ap = argparse.ArgumentParser(); ap.add_argument("--cps", type=float, default=18.5); ap.add_argument("--max", type=int, default=17600); a = ap.parse_args()
R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"); S = os.environ["SLUG"]
L = [l for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
acc = 0; tot = sum(len(re.sub(r"^\[[^\]]*\]\s*", "", l)) for l in L)
MARK = re.compile(r"(Glovebox Manual|Manual|page \w+|twenty-seven|free|QR|three tests)", re.I)
for i, l in enumerate(L):
    t = re.sub(r"^\[[^\]]*\]\s*", "", l); tag = re.match(r"^\[([^\]]*)\]", l)
    s = acc / a.cps; acc += len(t)
    m = MARK.findall(t)
    if m: print(f"{i:3d} {int(s//60)}:{int(s%60):02d} [{tag.group(1) if tag else ''}] {', '.join(sorted(set(x.lower() for x in m)))}")
print(f"\n{len(L)} paragraphs · {tot} chars · ~{tot/a.cps/60:.2f} min at {a.cps} chars/s · cap {a.max}: {'OK' if tot < a.max else '⛔ OVER'}")
