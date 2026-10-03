# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/earlwont/tag_voz.py guiones/earlwont.txt guiones/earlwont_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(He thought I was crazy|and not in a good way|you may not make it|that's not red snapper|I'm not the fish police)"),
 ("[sighs]", r"(That's what the man offered me|older than my grandmother)"),
 ("[lower, as if sharing a secret]", r"(And here's the part that bothers me most|And this is the one you'll remember|Now, here's the honest part)"),
 ("[emphatically]", r"(no thank you|I won't sell it to yours|ask what fish it really is|take it home)"),
 ("[warmly]", r"(My name's Earl|that's why the folks keep coming back|I read every one|I'll see you on the dock)"),
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
