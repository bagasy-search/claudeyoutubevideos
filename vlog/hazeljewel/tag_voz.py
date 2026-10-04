# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hazeljewel/tag_voz.py guiones/hazeljewel.txt guiones/hazeljewel_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[softly]", r"(In memory of our dear Samuel|Tell little Mary I will bring her a ribbon when I come home|He never came home)"),
 ("[warmly]", r"(I'm Hazel|She said her own little girl's name was Mary|I read every one)"),
 ("[lower, as if sharing a secret]", r"(Now, here's where my heart started beating a little faster|Old ladies hid their best things)"),
 ("[emphatically]", r"(Twenty dollars at an estate sale|But not all gold is gold)"),
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
