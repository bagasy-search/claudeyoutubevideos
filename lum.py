# destellos negros: cuadros cuya luminancia cae a <35 % de la de sus vecinos (±6 cuadros) y bajo 30, en tramos de <=4 cuadros
import sys, re, json, statistics
y = [float(m) for m in re.findall(r'YAVG=([\d.]+)', open(sys.argv[1]).read())]
out, i = [], 0
while i < len(y):
    if y[i] < 30:
        j = i
        while j < len(y) and y[j] < 30: j += 1
        if j - i <= 4:
            nb = y[max(0, i - 6):i] + y[j:j + 6]
            ref = statistics.median(nb) if nb else 0
            if ref > 45 and min(y[i:j]) < 0.35 * ref:
                out.append({"t": round(i / 30, 2), "frames": j - i, "ymin": round(min(y[i:j]), 1), "vecinos": round(ref, 1)})
        i = j
    else: i += 1
print(json.dumps({"cuadros": len(y), "ymedia": round(sum(y) / max(1, len(y)), 1), "destellos": len(out), "lista": out[:200]}))
