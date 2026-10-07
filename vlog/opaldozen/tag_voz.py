# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/opaldozen/tag_voz.py guiones/opaldozen.txt guiones/opaldozen_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[dryly]", r"(so why don't you just buy eggs|That's my walk|the best thirty dollar egg I ever ate|A spring number and a winter number are two different animals)"),
 ("[sighs]", r"(Forty-one\.|That's a thirty dollar dozen|Mabel was the first hen I raised after my husband passed)"),
 ("[lower, as if sharing a secret]", r"(Now here's the part that surprised me|And here's something I didn't expect|And here's how I knew)"),
 ("[emphatically]", r"(I kept every single receipt|They're staying\.|Not a missing powder|I didn't know\.)"),
 ("[warmly]", r"(I'm Opal|I read every one|I'll see you next week|can I have the speckled ones)"),
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
