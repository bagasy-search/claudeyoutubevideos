# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hazelcrystal/tag_voz.py guiones/hazelcrystal.txt guiones/hazelcrystal_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(rubber bands and keys|worth less than the box|Don't be that man|his face won't move|It just means)"),
 ("[sighs]", r"(Her husband had passed|Five hundred dollars, gone|loses most of its value|isn't what it was)"),
 ("[lower, as if sharing a secret]", r"(And this is the one most people skip|There it was|Now, here's what a dealer will do|faint as a ghost)"),
 ("[emphatically]", r"(Not yet\.|Never sell on day one|You can never buy it back|Take it off the table|Never put cut glass)"),
 ("[warmly]", r"(I'm Hazel|she was right|I read every one|let's call her June)"),
]
out, since, n = [], 9, {}
for line in open(src, encoding="utf8").read().split("\n"):
    sents = re.split(r"(?<=[.!?])\s+", line) if line.strip() else [line]
    new = []
    for s in sents:
        tag = None
        if s.strip() and since >= 3:
            for t, rx in R:
                if re.search(rx, s): tag = t; break
        if tag: new.append(tag + " " + s); since = 0; n[tag] = n.get(tag, 0) + 1
        else: new.append(s); since += 1
    out.append(" ".join(new))
txt = "\n".join(out)
assert re.sub(r"\[[^\]]+\] ", "", txt) == open(src, encoding="utf8").read(), "cambió el texto"
open(dst, "w", encoding="utf8", newline="\n").write(txt)
print(n, "total", sum(n.values()))
