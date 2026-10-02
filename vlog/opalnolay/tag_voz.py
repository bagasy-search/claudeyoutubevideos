# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/opalnolay/tag_voz.py guiones/opalnolay.txt guiones/opalnolay_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [  # (tag, regex) — el primero que matchea gana; mínimo 3 frases entre tags
 ("[dryly]", r"(It's candy, honey|it wasn't the cold|they're clever with those hands|went through the wringer|She's not going in a pot)"),
 ("[sighs]", r"(and I came back with two|That's the one that hurt|That's a real problem|I've seen what's left|Didn't help one bit)"),
 ("[lower, as if sharing a secret]", r"(Here's a test anybody|Here's how you know|And here's the one|A raccoon can open|she had her own little nest)"),
 ("[emphatically]", r"(Never\.|Not in my coop|Please don't|Read the label|Cheapest first|A good feed is the booster)"),
 ("[warmly]", r"(I'm Opal|She's earned her rest|I read every one|I'll see you next week|Thank the Lord)"),
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
