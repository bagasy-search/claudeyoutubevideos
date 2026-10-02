# Guion de VOZ: tags moderados de Fish (voz `hazel`) antepuestos a frases elegidas; NO cambia palabras.
# python vlog/hazeldealers/tag_voz.py guiones/hazeldealers.txt guiones/hazeldealers_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [  # (tag, regex) — el primero que matchea gana; mínimo 3 frases entre tags
 ("[dryly]", r"(just plate, honey|isn't gold, it's junk|It's dirty\.|Asking prices are dreams|not villains, honey|plastic ballpoint)"),
 ("[sighs]", r"(breaks my heart|I'm sorry\.|goes in the dumpster|went to the curb|curb more times|They were sterling|Please don't\.)"),
 ("[lower, as if sharing a secret]", r"(what the dealer knows|fishing line|Here's the magnet trick|Here's a test anybody|they know what you don't)"),
 ("[emphatically]", r"(Every piece\.|Never sell on day one|Sell the set as a set|Say no thank you|take it home|Not before the doors open|Look for the names first)"),
 ("[warmly]", r"(I'm Hazel|stay with me|subscribe|Subscribe|That's all I ask|Now you know)"),
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
