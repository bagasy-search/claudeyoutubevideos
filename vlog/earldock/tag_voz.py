# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/earldock/tag_voz.py guiones/earldock.txt guiones/earldock_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(Are y'all getting rich off me\?|nobody on my dock is getting rich|Don't get me started)"),
 ("[sighs]", r"(I've seen good men sell their boats|The price on the bag didn't change one penny)"),
 ("[lower, as if sharing a secret]", r"(But here's where I'm going to be honest with you|And this is where you can get taken|Everybody in the middle just gets left out)"),
 ("[emphatically]", r"(So that five dollars isn't profit|One ingredient\. Shrimp\.|read the bag)"),
 ("[warmly]", r"(My name's Earl|her grandson started coming down with the same cooler|I read every one)"),
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
