# tfbpiedra: palabras ASR (del máster original) → máster con pausas comprimidas → tramos por línea del guion (cortes en mínimo de energía)
import json, re, difflib, unicodedata, sys, bisect
import numpy as np, wave
R = "D:/Proyectos/video2-wt/tfbpiedra/"
def norm(w):
    w = unicodedata.normalize("NFD", w.lower()); w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-zñ0-9]", "", w)
lines = open(R + "guiones/tfbpiedra.txt", encoding="utf-8").read().strip().split("\n")
cuts = json.load(open(R + "out/tfbpiedra/master_c.wav.cuts.json"))
starts = [c[0] for c in cuts]; cum = np.cumsum([0] + [c[1] for c in cuts])
def remap(ms):
    t = ms / 1000; k = bisect.bisect_right(starts, t)
    if k and t < starts[k-1] + cuts[k-1][1]: t = starts[k-1] + cuts[k-1][1]  # dentro de un hueco quitado
    return (t - cum[k]) * 1000
G, L = [], []
for i, ln in enumerate(lines):
    for w in ln.split():
        n = norm(w)
        if n: G.append(n); L.append(i)
caps = json.load(open(R + "public/captions_tfbpiedra.json", encoding="utf-8"))
A = [(norm(c["text"]), remap(c["startMs"]), remap(c["endMs"])) for c in caps]; A = [a for a in A if a[0]]
json.dump([{"text": c["text"], "startMs": round(remap(c["startMs"])), "endMs": round(remap(c["endMs"]))} for c in caps], open(R + "vlog/tfbpiedra/captions_c.json", "w", encoding="utf-8"), ensure_ascii=False)
sm = difflib.SequenceMatcher(None, G, [a[0] for a in A], autojunk=False)
st = [None]*len(G); en = [None]*len(G); eq = 0; gaps = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2-i1): st[i1+k] = A[j1+k][1]; en[i1+k] = A[j1+k][2]; eq += 1
    elif tag == "replace" and j2 > j1:
        a, b = A[j1][1], A[j2-1][2]
        for k in range(i2-i1): st[i1+k] = a + (b-a)*k/(i2-i1); en[i1+k] = a + (b-a)*(k+1)/(i2-i1)
    if tag in ("delete", "replace") and (i2-i1) >= 3:
        gaps.append((tag, i2-i1, j2-j1, " ".join(G[i1:i2])[:120], " ".join(a[0] for a in A[j1:j2])[:80]))
print("sim %.3f  equal %d/%d" % (sm.ratio(), eq, len(G)))
for g in gaps: print("GAP", g)
for arr in (st, en):
    for i in range(len(arr)):
        if arr[i] is None: arr[i] = arr[i-1] if i else 0
_w = wave.open(R + "out/tfbpiedra/master_c.wav"); sr = _w.getframerate(); _ch = _w.getnchannels()
x = np.frombuffer(_w.readframes(_w.getnframes()), dtype=np.int16).astype(np.float32)/32768; x = x.reshape(-1, _ch).mean(1)
TOT = len(x)/sr*1000
first = {}; last = {}
for k, li in enumerate(L): first.setdefault(li, k); last[li] = k
hop = int(sr*0.01); win = int(sr*0.03)
def energy_min(a_ms, b_ms):
    a = int(a_ms/1000*sr); b = int(b_ms/1000*sr)
    if b - a < win*2: return (a_ms+b_ms)/2
    seg = x[a:b]; e = np.array([np.sqrt(np.mean(seg[i:i+win]**2)) for i in range(0, len(seg)-win, hop)])
    return a_ms + (int(np.argmin(e))*hop + win/2)/sr*1000
cuts2 = [0.0]
for li in range(len(lines)-1):
    a = en[last[li]]; b = st[first[li+1]]
    if b < a: a, b = b - 150, b + 50
    cuts2.append(energy_min(a - 80, b + 80))
cuts2.append(TOT)
tr = [{"i": i, "s": cuts2[i]/1000, "e": cuts2[i+1]/1000, "d": (cuts2[i+1]-cuts2[i])/1000, "t": lines[i]} for i in range(len(lines))]
json.dump(tr, open(R + "vlog/tfbpiedra/tramos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
d = [t["d"] for t in tr]
print("tramos", len(tr), "min %.2f max %.2f med %.2f  >11.8: %s" % (min(d), max(d), float(np.median(d)), [(t["i"], round(t["d"],2)) for t in tr if t["d"] > 11.8]))
print("<3.9:", [(t["i"], round(t["d"],2)) for t in tr if t["d"] < 3.9])
