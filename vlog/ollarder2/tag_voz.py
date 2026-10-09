# Guion de VOZ con tags moderados de Fish (voz `ole`): NO cambia palabras, sólo antepone tags.
# python vlog/ollarder2/tag_voz.py guiones/ollarder2.txt guiones/ollarder2_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [  # (tag, vocal?, regex) — el primero que matchea gana
 ("[chuckles]", 1, r"(arrest|fought over|heard about it|scrapings|Hard as buckshot|hole in the ground\. \[|Bean-hole beans)"),
 ("[sighs]", 1, r"(My mother soaked|learned that one the hard way|walked out|till he was seventy|haven't seen a soul|pour that gray)"),
 ("[clears throat]", 1, r"(starts fights|listen close|Well, now)"),
 ("[emphatically]", 0, r"(\bnever\b|ten minutes|ten full minutes|tablespoon|teaspoon|\bdon't\b|\bexactly\b|go in last|goes in last|every time)"),
 ("[warmly]", 0, r"(\bfriend\b|Sunday morning|best part|pot liquor|Now go put)"),
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
