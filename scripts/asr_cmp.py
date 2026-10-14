# Compara dos transcripciones por palabra contra las PAUSAS REALES del audio (verdad de piso).
# Para cada palabra que arranca después de un silencio >=200 ms, el arranque real = fin del silencio.
# Uso: python scripts/asr_cmp.py public/<slug>_16k.wav public/captions_<slug>.json public/captions_<slug>_groq.json
import json, re, statistics, subprocess, sys, difflib
import numpy as np

wav, a_path, b_path = sys.argv[1:4]
# arranques reales = fin de cada silencio >=200 ms (ffmpeg silencedetect, -40 dB)
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "silencedetect=n=-40dB:d=0.2", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
onsets = [float(m) * 1000 for m in re.findall(r"silence_end: ([\d.]+)", log)]

norm = lambda t: re.sub(r"[^\wáéíóúñü]", "", t.lower())
A, B = json.load(open(a_path, encoding="utf-8")), json.load(open(b_path, encoding="utf-8"))
ta, tb = [norm(c["text"]) for c in A], [norm(c["text"]) for c in B]
sm = difflib.SequenceMatcher(None, ta, tb, autojunk=False)
pairs = [(A[i + k], B[j + k]) for i, j, n in sm.get_matching_blocks() for k in range(n)]
print(f"palabras: A={len(A)} B={len(B)} · coinciden {len(pairs)} ({100*len(pairs)/max(len(A),1):.1f}% de A)")

def err(caps, on):  # por cada arranque real, la palabra de esa transcripción que arranca más cerca
    st = np.array([c["startMs"] for c in caps]); d = np.abs(st - on).min()
    return d if d < 600 else None

ea, eb, win_a, win_b = [], [], 0, 0
for on in onsets:
    a, b = err(A, on), err(B, on)
    if a is None or b is None: continue
    ea.append(a); eb.append(b)
    if a < b: win_a += 1
    elif b < a: win_b += 1
p90 = lambda v: float(np.percentile(v, 90))
print(f"arranques tras pausa evaluados: {len(ea)}")
print(f"A (Modal): mediana {statistics.median(ea):.0f} ms · p90 {p90(ea):.0f} ms")
print(f"B (Groq) : mediana {statistics.median(eb):.0f} ms · p90 {p90(eb):.0f} ms")
print(f"gana A {win_a} · gana B {win_b}")
d = [abs(ca["startMs"] - cb["startMs"]) for ca, cb in pairs]
print(f"|A-B| en todas las palabras: mediana {statistics.median(d):.0f} ms · p90 {p90(d):.0f} ms · >500 ms: {sum(v>500 for v in d)}")
