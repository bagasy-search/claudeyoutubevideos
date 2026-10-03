# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hazelsold/tag_voz.py guiones/hazelsold.txt guiones/hazelsold_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(Somebody listed it for ten thousand dollars|use them to prop up a wobbly table|The certificate doesn't make it worth more)"),
 ("[sighs]", r"(Most of it was worth less than she paid|This one hurts|This is the one that breaks hearts)"),
 ("[lower, as if sharing a secret]", r"(But there was one thing in that house|Now let me tell you about the tenth thing|Here's a tip)"),
 ("[emphatically]", r"(The asking prices are just wishes|Look at the sold listings\. The market|Look before you let it go)"),
 ("[warmly]", r"(I'm Hazel|That's what she'd want|I read every one)"),
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
