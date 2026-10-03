# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/earlsoap/tag_voz.py guiones/earlsoap.txt guiones/earlsoap_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(these taste like soap|he stopped laughing|Sometimes the answer is water|wash my mouth out)"),
 ("[sighs]", r"(They think shrimp is supposed to taste like that|They boil in their own juice)"),
 ("[lower, as if sharing a secret]", r"(Here's the part that'll make you mad|Now here's the five second check|this is where the taste really comes from)"),
 ("[emphatically]", r"(put it back\. If you see sodium|Cold is the only thing|you'll never unsee it)"),
 ("[warmly]", r"(My name's Earl|Earl, you're right|I read every one|I'll see you on the dock)"),
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
