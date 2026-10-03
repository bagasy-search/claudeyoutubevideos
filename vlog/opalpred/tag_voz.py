# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/opalpred/tag_voz.py guiones/opalpred.txt guiones/opalpred_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(The raccoons didn't read the label|you'll usually smell it, honey|A mink doesn't care|playing dead)"),
 ("[sighs]", r"(three of my hens were dead|And Pearl's head was gone|It's a terrible thing to find|I buried them under the apple tree)"),
 ("[lower, as if sharing a secret]", r"(I found what I was looking for|Now, here's the part I promised you|And there it was|And here's the thing about a mink)"),
 ("[emphatically]", r"(stop and look|Chicken wire\.|hardware cloth|every single night)"),
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
