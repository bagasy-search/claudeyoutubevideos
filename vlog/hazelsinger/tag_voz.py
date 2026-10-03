# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hazelsinger/tag_voz.py guiones/hazelsinger.txt guiones/hazelsinger_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(Maybe less|That's not me being gloomy|Anybody can ask a thousand dollars|they're gone)"),
 ("[sighs]", r"(I was going to sell it to the first person who asked|He was disappointed)"),
 ("[lower, as if sharing a secret]", r"(But here's the one that makes my heart beat|Here's what that number tells you|Now, the mistake I promised to tell you about)"),
 ("[emphatically]", r"(I told her to take the tape off|don't plug it in|don't paint it|Keep everything together)"),
 ("[warmly]", r"(I'm Hazel|That's the part I love|I read every one)"),
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
