# -*- coding: utf-8 -*-
"""anchor_cmeciclo.py — ancla los 178 momentos al MILISEGUNDO por ALINEACION GLOBAL.

⛔ NO se busca frase por frase. Medido en otros videos: buscar `frase -> primer match en las
captions` ancla ~27% de los momentos, por tres causas estructurales:
  1. las frases cortas no entran en un match de 4-7 palabras;
  2. el ASR NO escribe lo que dice el guion (pone "74" donde el guion dice "setenta y cuatro");
  3. el cursor se arrastra: un match tardio se come todos los momentos que siguen.

Lo que si funciona: alinear UNA vez las dos secuencias de palabras (guion vs ASR) con
difflib, leer el ms de los tramos `equal` e INTERPOLAR dentro de los `replace` (ahi caen los
numeros). Despues cada momento se ubica en el GUION, que es texto propio y sin sorpresas.

Uso: PYTHONUTF8=1 python scripts/anchor_cmeciclo.py
Salida: _v3/cmeciclo_wordms.json  y  _v3/cmeciclo_moments_ms.json
"""
from __future__ import annotations

import difflib
import io
import json
import re
import subprocess
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "cmeciclo"
GUION = ROOT / "guiones" / f"{SLUG}.txt"
CAPS = ROOT / "public" / f"captions_{SLUG}.json"
MOMENTS = ROOT / "_v3" / f"{SLUG}_moments.json"
WAV = ROOT / "public" / f"{SLUG}.wav"


def norm(w: str) -> str:
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", w)


def palabras(texto: str) -> list[str]:
    return [p for p in (norm(x) for x in re.findall(r"\S+", texto)) if p]


def main() -> None:
    guion = io.open(GUION, encoding="utf-8").read()
    caps = json.load(io.open(CAPS, encoding="utf-8"))
    if isinstance(caps, dict):
        caps = caps.get("words") or caps.get("segments") or []

    asr = []
    for c in caps:
        t = c.get("text") or c.get("word") or ""
        ms = c.get("startMs")
        if ms is None:
            ms = int(float(c.get("start", 0)) * 1000)
        n = norm(t)
        if n:
            asr.append((n, int(ms)))

    G = palabras(guion)
    A = [w for w, _ in asr]
    sm = difflib.SequenceMatcher(None, G, A, autojunk=False)
    ms: list[float | None] = [None] * len(G)
    iguales = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                ms[i1 + k] = float(asr[j1 + k][1])
            iguales += i2 - i1
        elif j2 > j1 and i2 > i1:
            a, b = float(asr[j1][1]), float(asr[j2 - 1][1])
            span = max(1, i2 - i1)
            for k in range(span):
                ms[i1 + k] = a + (b - a) * k / span

    # rellenar bordes y forzar monotonia (un ms que retrocede desordena el montaje entero)
    ultimo = 0.0
    for i, v in enumerate(ms):
        if v is None:
            ms[i] = ultimo
        else:
            ms[i] = max(v, ultimo)
        ultimo = ms[i]

    similitud = sm.ratio()
    print(f"palabras guion {len(G)} · palabras ASR {len(A)} · alineadas exactas {iguales} "
          f"({iguales / max(1, len(G)) * 100:.1f}%) · similitud {similitud:.3f}")
    if iguales / max(1, len(G)) < 0.75:
        raise SystemExit(f"⛔ alineacion pobre ({iguales / len(G) * 100:.1f}%): revisar el ASR o el guion")

    dur_wav = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                    "-of", "csv=p=0", str(WAV)], capture_output=True,
                                   text=True).stdout.strip())

    # cada momento se ubica EN EL GUION: se recorre en orden consumiendo palabras
    mom = json.load(io.open(MOMENTS, encoding="utf-8"))
    cursor = 0
    salida = []
    for m in mom["moments"]:
        pal = palabras(m["text"])
        if not pal:
            continue
        # buscar la secuencia desde el cursor (el guion es texto propio: siempre esta)
        pos = None
        for i in range(cursor, min(len(G) - len(pal) + 1, cursor + 400)):
            if G[i:i + len(pal)] == pal:
                pos = i
                break
        if pos is None:  # tolerancia: prefijo de 6 palabras
            pref = pal[:6]
            for i in range(cursor, min(len(G) - len(pref) + 1, cursor + 400)):
                if G[i:i + len(pref)] == pref:
                    pos = i
                    break
        if pos is None:
            raise SystemExit(f"⛔ no ubique {m['id']} en el guion: {m['text'][:60]}")
        fin = pos + len(pal) - 1
        salida.append({**m, "start_ms": int(ms[pos]), "end_ms": int(ms[min(fin, len(G) - 1)]),
                       "w0": pos, "w1": fin})
        cursor = fin + 1

    # el ultimo momento llega hasta el final del wav; y ningun momento puede durar 0
    for i, s in enumerate(salida):
        s["end_ms"] = int(salida[i + 1]["start_ms"]) if i + 1 < len(salida) else int(dur_wav * 1000)
        if s["end_ms"] <= s["start_ms"]:
            s["end_ms"] = s["start_ms"] + 400

    durs = sorted((s["end_ms"] - s["start_ms"]) / 1000 for s in salida)
    n = len(durs)
    print(f"momentos anclados {n}/{len(mom['moments'])} · dur mediana {durs[n // 2]:.2f}s · "
          f"p75 {durs[int(n * 0.75)]:.2f}s · >=5s {sum(1 for d in durs if d >= 5)} ({sum(1 for d in durs if d >= 5) / n * 100:.0f}%) · max {durs[-1]:.1f}s")
    print(f"wav {dur_wav:.2f}s · ultimo momento termina en {salida[-1]['end_ms'] / 1000:.2f}s")

    json.dump({"slug": SLUG, "palabras": [{"w": G[i], "ms": int(ms[i])} for i in range(len(G))]},
              io.open(ROOT / "_v3" / f"{SLUG}_wordms.json", "w", encoding="utf-8"), ensure_ascii=False)
    json.dump({"slug": SLUG, "timing_source": f"alineacion global guion<->captions_{SLUG}.json",
               "wav_seconds": dur_wav, "moments": salida},
              io.open(ROOT / "_v3" / f"{SLUG}_moments_ms.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"→ _v3/{SLUG}_moments_ms.json")


if __name__ == "__main__":
    main()
