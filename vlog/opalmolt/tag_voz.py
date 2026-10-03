# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/opalmolt/tag_voz.py guiones/opalmolt.txt guiones/opalmolt_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(the lice didn't seem to mind|bossing the young pullets|Not me, not your neighbor|eating like a horse)"),
 ("[sighs]", r"(it can kill a hen|My mother did it|Thank goodness|right back where you started)"),
 ("[lower, as if sharing a secret]", r"(And this is the most important one|And here's the good part|And that's when I turned her around|this is the part everybody skips)"),
 ("[emphatically]", r"(don't guess|The label\.|I don't anymore|Every single hen|I check\.)"),
 ("[warmly]", r"(I'm Opal|This is Clover|I read every one|I'll see you next week)"),
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
