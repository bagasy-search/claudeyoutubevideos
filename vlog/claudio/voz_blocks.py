# guiones/<slug>_filmado.txt + _voz.txt + vlog/<slug>/rooms.json → guiones/<slug>_voz_blocks.json: bloques de voz POR SALA
# (párrafos seguidos de la misma sala; >LIM se parte en oración). Así la sala (etiqueta v4 o SoX) se aplica limpia por bloque.
#   SLUG=x python vlog/claudio/voz_blocks.py
import os, re, json, sys
S = os.environ["SLUG"]; R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"
sys.path.insert(0, R); import fish_factory as FF
LIM = int(os.environ.get("LIM", "1500"))
fil = [l for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
voz = [l for l in open(R + f"guiones/{S}_voz.txt", encoding="utf8").read().split("\n") if l.strip()]
assert len(fil) == len(voz), (len(fil), len(voz))
rooms = json.load(open(R + f"vlog/{S}/rooms.json", encoding="utf8"))
out, cur = [], None
for f, v in zip(fil, voz):
    tag = re.match(r"\[([^\]]*)\]", f).group(1); room = rooms.get(tag) or rooms["_default"][tag.split("|")[0]]
    if cur and cur["room"] == room and len(cur["text"]) + 1 + len(v) <= LIM: cur["text"] += " " + v; cur["tags"].append(tag)
    else:
        if cur: out.append(cur)
        cur = {"room": room, "text": v, "tags": [tag]}
out.append(cur)
json.dump(out, open(R + f"guiones/{S}_voz_blocks.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
for i, b in enumerate(out): print(i, b["room"], len(re.sub(r"\[[^\]]+\]\s*", "", b["text"])), b["tags"][0], "→", b["tags"][-1])
