# Guion de VOZ con tags moderados de Fish (voz `ole`): NO cambia palabras, sólo antepone tags.
# python vlog/olpots/tag_voz.py guiones/olpots.txt guiones/olpots_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [  # (tag, vocal?, regex)
 ("[chuckles]", 1, r"(Ha\. |drugstore|sulk|paper bag|museum|happens to everybody|coffee\.|light as a hat)"),
 ("[sighs]", 1, r"(older than you|outlives|Brands change|lye soap|everybody forgets|died down)"),
 ("[clears throat]", 1, r"(Well, now|Quick word|listen)"),
 ("[emphatically]", 0, r"(never|Never|five hundred|thirty minutes|don't|exactly|Four questions|forty five)"),
 ("[warmly]", 0, r"(friend|Now go put|I want to hear)"),
]
out, since_tag, since_vocal, n = [], 9, 9999, {}
for line in open(src, encoding="utf8").read().split("\n"):
    sents = re.split(r"(?<=[.!?])\s+", line) if line.strip() else [line]
    new = []
    for s in sents:
        tag = None
        if s.strip() and since_tag >= 2:
            for t, vocal, rx in R:
                if vocal and since_vocal < 700: continue
                if re.search(rx, s):
                    tag = (t, vocal); break
        if tag:
            new.append(tag[0] + " " + s); since_tag = 0; n[tag[0]] = n.get(tag[0], 0) + 1
            if tag[1]: since_vocal = 0
        else:
            new.append(s); since_tag += 1
        since_vocal += len(s)
    out.append(" ".join(new))
txt = "\n".join(out)
assert re.sub(r"\[[a-z ]+\] ", "", txt) == open(src, encoding="utf8").read(), "cambió el texto"
open(dst, "w", encoding="utf8", newline="\n").write(txt)
print(n, "total", sum(n.values()))
