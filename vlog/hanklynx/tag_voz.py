# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hanklynx/tag_voz.py guiones/hanklynx.txt guiones/hanklynx_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(this time I needed a passport to ask them|Then we'll talk)"),
 ("[sighs]", r"(Not all of them survived it|One of them didn't make it)"),
 ("[lower, as if sharing a secret]", r"(And then, in the middle of that argument, somebody decided not to wait|Here's what happened, as best as anyone can tell)"),
 ("[emphatically]", r"(What happened in January was wrong|That's not a return of the wild)"),
 ("[warmly]", r"(I'm Hank\. I'm not a biologist|Thanks for riding along|I'll read every one)"),
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
