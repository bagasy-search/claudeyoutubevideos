# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hazelmom/tag_voz.py guiones/hazelmom.txt guiones/hazelmom_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(Nobody wants them|Brown furniture, we call it|those ladies know their stuff|This is going to hurt a little)"),
 ("[sighs]", r"(more good things go in a dumpster|I've seen grown men cry|and don't feel bad)"),
 ("[lower, as if sharing a secret]", r"(Here's the test|Here's how to tell|But I'll tell you the truth|Here's where I have to be honest)"),
 ("[emphatically]", r"(Stop\.|Rent it last, not first|Every one\.|never break up a named group|Don't throw those away)"),
 ("[warmly]", r"(I'm Hazel|hanging on his wall|I read every one)"),
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
