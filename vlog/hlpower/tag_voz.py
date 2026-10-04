# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hlpower/tag_voz.py guiones/hlpower.txt guiones/hlpower_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(He didn't believe me|You're not getting power tonight)"),
 ("[lower, as if sharing a secret]", r"(Let me tell you about the wire from the pole to your house|Here's what different damage usually means)"),
 ("[emphatically]", r"(Treat every wire like it's live|never plug it into a wall outlet or your dryer outlet|Don't trust the first estimate after a big storm)"),
 ("[warmly]", r"(My name's Harlan|I've never forgotten that pudding|I read every one)"),
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
