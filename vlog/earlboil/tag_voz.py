# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/earlboil/tag_voz.py guiones/earlboil.txt guiones/earlboil_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(Those shrimp tasted like nothing|That's backwards|Forty two dollars\.|but my wife sure did)"),
 ("[sighs]", r"(I didn't have the heart to tell him|Rubbery and plain)"),
 ("[lower, as if sharing a secret]", r"(Here's the step the restaurant skipped|Now here's the order|here's how you know you've got enough salt)"),
 ("[emphatically]", r"(Not one minute more|Don't skip the ice|Hardest stuff first, shrimp last)"),
 ("[warmly]", r"(My name's Earl|Granddaddy, I get it now|I read every one|I'll see you on the dock)"),
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
