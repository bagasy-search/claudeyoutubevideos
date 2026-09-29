# Guion de VOZ con tags moderados de Fish (voz nueva `loretta`): NO cambia palabras, sólo antepone tags.
# python vlog/lorpies/tag_voz.py guiones/lorpies.txt guiones/lorpies_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [  # (tag, vocal?, regex) — el primero que matchea gana
 ("[chuckles]", 1, r"\b(Danny|honey|Lord|don't you tell|fib|silly|laugh|teas|my goodness|Oh,)"),
 ("[sighs]", 1, r"(disappear|gone|passed|miss |missed|funeral|anymore|nineteen seventy|box of mix|freezer case|Mama|nobody makes|used to)"),
 ("[whispering]", 0, r"(secret|little trick|nobody ever wrote|don't tell)"),
 ("[emphatically]", 0, r"(\bnever\b|\bNot one\b|degrees|\bcup\b|tablespoon|teaspoon|\bstick\b|minutes|\bdon't\b|\bexactly\b|\bmust\b)"),
 ("[warmly]", 0, r"(\byou\b|\byour\b|love|sweet)"),
]
out, since_tag, since_vocal, n = [], 9, 9999, {}
for line in open(src, encoding="utf8").read().split("\n"):
    sents = re.split(r"(?<=[.!?…])\s+", line) if line.strip() else [line]
    new = []
    for s in sents:
        tag = None
        if s.strip() and since_tag >= 2:
            for t, vocal, rx in R:
                if vocal and since_vocal < 900: continue
                if re.search(rx, s, re.I if t != "[chuckles]" else 0):
                    tag = (t, vocal); break
        if tag:
            new.append(tag[0] + " " + s); since_tag = 0; n[tag[0]] = n.get(tag[0], 0) + 1
            if tag[1]: since_vocal = 0
        else:
            new.append(s); since_tag += 1
        since_vocal += len(s)
    out.append(" ".join(new))
txt = "\n".join(out)
assert re.sub(r"\[[a-z]+\] ", "", txt) == open(src, encoding="utf8").read(), "cambió el texto"
open(dst, "w", encoding="utf8", newline="\n").write(txt)
print(n, "total", sum(n.values()))
