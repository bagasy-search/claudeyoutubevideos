# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/earlshrimpbag/tag_voz.py guiones/earlshrimpbag.txt guiones/earlshrimpbag_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [  # (tag, regex) — el primero que matchea gana; mínimo 3 frases entre tags
 ("[dryly]", r"(They're just pretty words|Packed is not caught|Nobody has to tell you a thing|If he gets funny about it|Eat your shrimp)"),
 ("[sighs]", r"(With the boats tied up|barely enough to pay|There aren't many of us left|came home with enough shrimp for supper)"),
 ("[lower, as if sharing a secret]", r"(Now here's where they get you|Here's another one most people|Now here's the rule nobody|And this is the one I promised)"),
 ("[emphatically]", r"(put it back|I won't sell them|Turn the fire off|Read it\.|Don't boil them)"),
 ("[warmly]", r"(My name's Earl|call your family in|I'll see you on the dock|I read every one)"),
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
