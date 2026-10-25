# ---------------- ejecutar la cola en el orden de la voz ----------------
for _p, _d, _n, f, ph, a, k in sorted(_Q, key=lambda x: (x[0], x[1], x[2])):
    f(ph, *a, **k)
# fotos/clips que cayeron dentro de una ventana del avatar → justo al salir; dos fotos pegadas → la 2ª corre 2,2 s
AVR = [(w["ms"], w["me"]) for w in AVW]
for b in BEATS:
    if not b["base"].startswith("img:"): continue
    for ms, me in AVR:
        if ms - 0.3 <= b["a"] < me: b["a"] = round(me + 0.15, 2); break
BEATS.sort(key=lambda b: b["a"])
for i in range(1, len(BEATS)):
    if BEATS[i]["base"].startswith("img:") and BEATS[i]["a"] - BEATS[i - 1]["a"] < 1.6:
        BEATS[i]["a"] = round(BEATS[i - 1]["a"] + 2.2, 2)
