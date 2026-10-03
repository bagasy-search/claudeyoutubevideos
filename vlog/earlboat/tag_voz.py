# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/earlboat/tag_voz.py guiones/earlboat.txt guiones/earlboat_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(Coffee, mostly|Sounds pretty good, doesn't it|the other woman in my life|for the privilege of not sleeping)"),
 ("[sighs]", r"(never fished again|I still miss it|Now you can count them|I've been one of them)"),
 ("[lower, as if sharing a secret]", r"(And here's the thing nobody tells you|And this is the part I promised you|Now, every net on a shrimp boat)"),
 ("[emphatically]", r"(nobody sleeps|buy from the boats|the Gulf can kill you)"),
 ("[warmly]", r"(My name's Earl|I learned it from my daddy|I read every one|I'll see you on the dock)"),
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
