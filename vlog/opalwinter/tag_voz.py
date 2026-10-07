# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/opalwinter/tag_voz.py guiones/opalwinter.txt guiones/opalwinter_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(Butterbean supervised|Save your money|They've earned it|I can't promise you that's science)"),
 ("[sighs]", r"(It was a cup of spilled water|that was my fault, not the cold's|I lost a coop and nine hens to it in 1987)"),
 ("[lower, as if sharing a secret]", r"(Because here's what fifty winters have taught me|And here's what happened to Rosie|That's the beauty of not using heat)"),
 ("[emphatically]", r"(Fifteen below\.|Dry and still\.|No heat lamp\.|Open it up more, not less)"),
 ("[warmly]", r"(I'm Opal|I read every one|I'll see you next week)"),
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
