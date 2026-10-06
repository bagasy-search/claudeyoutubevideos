# align.py — ancla cada momento del guion al ms REAL por ALINEACIÓN GLOBAL (difflib).
# Genérico: procedencia _v3/tcfiltro_align.py (entregado, anclaje medido), sin SLUG quemado.
#
#   python factory/py/align.py <captions.json> <frases.json> <mom_out.json>
#
# Por qué global: frases cortas no entran en ventanas de búsqueda; "16.041" vs "dieciseis mil..." rompe
# el match literal; un match tardío arrastra el cursor. Los números caen en bloques `replace` y se interpolan.
# Imprime (stdout, JSON) la medición: anclaje exacto, similitud, desorden. La compuerta la aplica la fase.
import json, re, difflib, sys, pathlib

caps_p, frases_p, out_p = sys.argv[1], sys.argv[2], sys.argv[3]
caps = json.loads(pathlib.Path(caps_p).read_text(encoding="utf-8"))
words = caps if isinstance(caps, list) else caps.get("words", [])
ASR = [(re.sub(r"[^\wáéíóúñüàèìòùâêîôûãõç]", "", (w.get("text") or "").lower()), w["startMs"]) for w in words]
ASR = [(t, ms) for t, ms in ASR if t]
if not ASR:
    sys.exit("align: 0 palabras en las captions")

mom = json.loads(pathlib.Path(frases_p).read_text(encoding="utf-8"))
GW, dueno = [], []
for m in mom:
    for tok in re.findall(r"[\wáéíóúñüÁÉÍÓÚÑÜàèìòùâêîôûãõç]+", m["texto"].lower()):
        GW.append(tok); dueno.append(m["i"])

sm = difflib.SequenceMatcher(None, GW, [t for t, _ in ASR], autojunk=False)
ms = [None] * len(GW)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            ms[i1 + k] = ASR[j1 + k][1]
    elif j2 > j1 and i2 > i1:
        a, b = ASR[j1][1], ASR[j2 - 1][1]
        n = i2 - i1
        for k in range(n):
            ms[i1 + k] = a + (b - a) * k / max(1, n - 1)

exactos = sum(1 for x in ms if x is not None)
ult = 0
for k in range(len(ms)):
    if ms[k] is None:
        nxt = next((ms[j] for j in range(k + 1, len(ms)) if ms[j] is not None), None)
        ms[k] = ult if nxt is None else (ult + nxt) / 2
    ms[k] = max(ms[k], ult)
    ult = ms[k]

por_mom = {}
for k, d in enumerate(dueno):
    por_mom.setdefault(d, []).append(k)
out = []
for m in mom:
    idx = por_mom.get(m["i"])
    if not idx:
        sys.exit("align: momento sin palabras: " + m["name"])
    out.append({**m, "start": round(ms[idx[0]] / 1000.0, 3), "end": round(ms[idx[-1]] / 1000.0, 3)})
for k in range(len(out) - 1):
    out[k]["end"] = out[k + 1]["start"]
out[-1]["end"] = ASR[-1][1] / 1000.0 + 0.6
for m in out:
    m["dur"] = round(max(0.4, m["end"] - m["start"]), 3)

# ---- reparto de tramos mal alineados -------------------------------------------------
# A veces la alineacion le regala a UN momento el tiempo de sus vecinos: el tramo entero mide bien,
# pero adentro queda uno larguisimo y los de al lado en 0,3 s. Los cortos no se llegan a ver (quedan
# bajo minPlanoS) y el largo no se puede cubrir: el motor solo admite DOS planos por momento, asi que
# el sobrante sale como cuadro congelado y `60_build` frena.
# Medido 16-sep en los 5 de Claudio Mendoza: 7 momentos sobre ~1.600 (cmeodian 5, cmecaja 1,
# cmeamazon 1; cmealter y cme150 ninguno). Ejemplo: p189 con 10,67 s mientras p190 y p191 —53 y 49
# caracteres— quedaban en 0,34 y 0,25 s, o sea 133 caracteres por segundo cuando el canal habla a 14.
# Se detecta por velocidad imposible y se reparte el tramo POR CARACTERES, que es la unica
# informacion confiable que queda: el span total del grupo no se toca, solo su reparto interno.
cps_all = sorted((len(m.get("texto") or "") / max(0.001, m["dur"])) for m in out)
cps_med = cps_all[len(cps_all) // 2] if cps_all else 0.0
repartidos = []
if cps_med > 0:
    veloz = [len(m.get("texto") or "") / max(0.001, m["dur"]) > 3 * cps_med for m in out]
    k = 0
    while k < len(out):
        if not veloz[k]:
            k += 1
            continue
        a = k
        while k < len(out) and veloz[k]:
            k += 1
        b = k - 1
        a = max(0, a - 1)                      # el vecino que se comio el tiempo
        b = min(len(out) - 1, b + 1)
        span = out[b]["end"] - out[a]["start"]
        chars = [len(out[j].get("texto") or "") or 1 for j in range(a, b + 1)]
        total = float(sum(chars))
        if span > 0 and total > 0:
            t = out[a]["start"]
            for j in range(a, b + 1):
                d = span * chars[j - a] / total
                out[j]["start"] = round(t, 3)
                out[j]["end"] = round(t + d, 3)
                out[j]["dur"] = round(max(0.4, d), 3)
                t += d
            out[b]["end"] = round(out[a]["start"] + span, 3)
            out[b]["dur"] = round(max(0.4, out[b]["end"] - out[b]["start"]), 3)
            repartidos.append(f"{out[a]['name']}..{out[b]['name']}")

pathlib.Path(out_p).write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
durs = sorted(m["dur"] for m in out)
print(json.dumps({
    "momentos": len(out), "palabrasGuion": len(GW), "palabrasAsr": len(ASR),
    "similitud": round(sm.ratio(), 4), "anclajeExactoPct": round(100 * exactos / max(1, len(GW)), 2),
    "duracionSec": round(out[-1]["end"], 2), "planoMedianaSec": durs[len(durs) // 2], "planoMaxSec": durs[-1],
    "desorden": sum(1 for k in range(len(out) - 1) if out[k + 1]["start"] < out[k]["start"]),
    "tramosRepartidos": len(repartidos), "tramos": repartidos[:8],
}))
