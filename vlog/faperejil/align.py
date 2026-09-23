import json, re, difflib, unicodedata, sys
import numpy as np, wave
def norm(w):
    w = unicodedata.normalize("NFD", w.lower()); w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-zñ0-9]", "", w)
lines = open("vlog/faperejil/guion_voz.txt", encoding="utf-8").read().strip().split("\n")
G, L = [], []
for i, ln in enumerate(lines):
    for w in ln.split():
        n = norm(w)
        if n: G.append(n); L.append(i)
caps = json.load(open("public/captions_faperejil.json", encoding="utf-8"))
A = [(norm(c["text"]), c["startMs"], c["endMs"]) for c in caps]; A = [a for a in A if a[0]]
sm = difflib.SequenceMatcher(None, G, [a[0] for a in A], autojunk=False)
st = [None]*len(G); en = [None]*len(G); eq = 0; gaps = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2-i1): st[i1+k] = A[j1+k][1]; en[i1+k] = A[j1+k][2]; eq += 1
    elif tag in ("replace",) and j2 > j1:
        a, b = A[j1][1], A[j2-1][2]
        for k in range(i2-i1): st[i1+k] = a + (b-a)*k/(i2-i1); en[i1+k] = a + (b-a)*(k+1)/(i2-i1)
    if tag in ("delete", "replace") and (i2-i1) >= 4:
        gaps.append((tag, i2-i1, j2-j1, " ".join(G[i1:i2])[:120], " ".join(a[0] for a in A[j1:j2])[:80]))
print("sim %.3f  equal %d/%d" % (sm.ratio(), eq, len(G)))
for g in gaps: print("GAP", g)
# fill None by interpolation
for arr in (st, en):
    for i in range(len(arr)):
        if arr[i] is None: arr[i] = arr[i-1] if i else 0
_w = wave.open("out/faperejil/master.wav"); sr = _w.getframerate(); _ch=_w.getnchannels(); x = np.frombuffer(_w.readframes(_w.getnframes()), dtype=np.int16).astype(np.float32)/32768; x = x.reshape(-1,_ch).mean(1)
TOT = len(x)/sr*1000
# boundaries per line
first = {}; last = {}
for k, li in enumerate(L):
    first.setdefault(li, k); last[li] = k
cuts = [0.0]
hop = int(sr*0.01); win = int(sr*0.03)
def energy_min(a_ms, b_ms):
    a = int(a_ms/1000*sr); b = int(b_ms/1000*sr)
    if b - a < win*2: return (a_ms+b_ms)/2
    seg = x[a:b]; e = np.array([np.sqrt(np.mean(seg[i:i+win]**2)) for i in range(0, len(seg)-win, hop)])
    return a_ms + (int(np.argmin(e))*hop + win/2)/sr*1000
for li in range(len(lines)-1):
    a = en[last[li]]; b = st[first[li+1]]
    if b < a: a, b = b - 150, b + 50
    cuts.append(energy_min(a - 80, b + 80))
cuts.append(TOT)
tr = [{"i": i, "s": cuts[i]/1000, "e": cuts[i+1]/1000, "d": (cuts[i+1]-cuts[i])/1000, "t": lines[i]} for i in range(len(lines))]
json.dump(tr, open("vlog/faperejil/tramos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
d = [t["d"] for t in tr]
print("tramos", len(tr), "min %.2f max %.2f med %.2f  >11.5: %s" % (min(d), max(d), float(np.median(d)), [(t["i"], round(t["d"],2)) for t in tr if t["d"] > 11.5]))
print("<4:", [(t["i"], round(t["d"],2)) for t in tr if t["d"] < 4])
if "--gaps" in sys.argv:
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("delete","replace") and i2-i1 >= 4:
            print(tag, "t=%.2f..%.2f" % (A[max(j1-1,0)][2]/1000, A[min(j2, len(A)-1)][1]/1000), "|", " ".join(G[max(0,i1-4):i2+4]))
