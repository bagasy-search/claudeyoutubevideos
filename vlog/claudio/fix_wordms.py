# Arregla los tramos COLAPSADOS de _v3/<slug>_wordms.json: cuando Whisper (Modal, sobre el máster entero) se saltea palabras que Fish SÍ
# dijo, align.py las deja aplastadas (≥4 palabras de <70 ms seguidas) y el tiempo queda en un hueco antes (una palabra estirada varios
# segundos, o un silencio falso). Las reparte en ese hueco, proporcional al largo de cada palabra, para que los cortes del DIRECTOR caigan
# en la frase real. SLUG=x python vlog/claudio/fix_wordms.py
# (verificar antes que el hueco tenga voz: silencedetect sin silencios largos; si Fish de verdad la salteó, se regenera el bloque)
import json, os
S = os.environ["SLUG"]; R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/")
P = R + f"_v3/{S}_wordms.json"; W = json.load(open(P, encoding="utf-8"))
short = lambda w: w["e"] - w["s"] < 0.07
i, fixed = 0, []
while i < len(W):
    j = i
    while j < len(W) and short(W[j]): j += 1
    if j - i >= 4:
        a = i  # incluir hacia atrás (hasta 3 palabras) la palabra estirada (>1,2 s), o la que quedó sola después de un hueco (>1,5 s)
        for k in range(i - 1, max(-1, i - 4), -1):
            if W[k]["e"] - W[k]["s"] > 1.2: a = k; break
        if a == i and i >= 2 and W[i - 1]["s"] - W[i - 2]["e"] > 1.5: a = i - 1
        t0 = W[a]["s"] if a < i and W[a]["e"] - W[a]["s"] > 1.2 else (W[a - 1]["e"] + 0.3 if a else 0.0)
        t1 = W[j]["s"] if j < len(W) else W[j - 1]["e"]
        if t1 - t0 > 0.25 * (j - a):
            L = [len(w["w"]) + 1 for w in W[a:j]]; tot = sum(L); t = t0
            for w, l in zip(W[a:j], L): d = (t1 - t0) * l / tot; w["s"], w["e"] = round(t, 3), round(t + d, 3); t += d
            fixed.append((round(t0, 2), round(t1, 2), j - a, " ".join(w["w"] for w in W[a:a + 4])))
        i = j
    else:
        i = max(j, i + 1)
json.dump(W, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print(json.dumps({"tramos": len(fixed), "detalle": fixed}, ensure_ascii=False))
