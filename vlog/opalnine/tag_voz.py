# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/opalnine/tag_voz.py guiones/opalnine.txt guiones/opalnine_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(And they do\.|it feels like love|Perfume doesn't dry anything|That's just them sorting out who's boss)"),
 ("[sighs]", r"(one of those four little girls sneezed|I lost her that night|I couldn't save her|watched it burn|I lost eleven hens that winter)"),
 ("[lower, as if sharing a secret]", r"(And here's the part people get wrong|Here's what I didn't understand|And here's what hurts the most|And here's the hard part about it)"),
 ("[emphatically]", r"(I did not put them in with my flock|Not ever\.|Thirty days\.|never going in with my flock)"),
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
