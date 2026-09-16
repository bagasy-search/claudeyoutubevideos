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

pathlib.Path(out_p).write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
durs = sorted(m["dur"] for m in out)
print(json.dumps({
    "momentos": len(out), "palabrasGuion": len(GW), "palabrasAsr": len(ASR),
    "similitud": round(sm.ratio(), 4), "anclajeExactoPct": round(100 * exactos / max(1, len(GW)), 2),
    "duracionSec": round(out[-1]["end"], 2), "planoMedianaSec": durs[len(durs) // 2], "planoMaxSec": durs[-1],
    "desorden": sum(1 for k in range(len(out) - 1) if out[k + 1]["start"] < out[k]["start"]),
}))
