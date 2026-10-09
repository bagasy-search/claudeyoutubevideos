# Guion de VOZ con tags moderados de Fish (voz nueva `loretta`): NO cambia palabras, sólo antepone tags.
# python vlog/olsup/tag_voz.py guiones/olsup.txt guiones/olsup_voz.txt
import re, sys
src, dst = sys.argv[1], sys.argv[2]
R = [
 ("[chuckles]", 1, r"(ya know|doughnut|shingle|little thing|hear about it|guarded it like|good cook|forty years|wobbles)"),
 ("[sighs]", 1, r"(coldest|tired|never told|empty plates|think about that|frozen|wasted|used to say|before the first world war|the first big one)"),
 ("[clears throat]", 1, r"(Number one|the thing you've waited|rule|Nobody talked)"),
 ("[whispering]", 0, r"(secret|little trick|whisper|nobody wants)"),
 ("[emphatically]", 0, r"(never|degrees|minutes|don't crowd|hard boil|exactly|No talking|patience)"),
 ("[warmly]", 0, r"(friend|sweet|warm|good night)"),
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
        if not tag and s.strip() and since_tag >= 3 and len(s) > 35:
            tag = (['[warmly]', '[emphatically]', '[warmly]', '[whispering]'][n.get('fb', 0) % 4], 0); n['fb'] = n.get('fb', 0) + 1
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
