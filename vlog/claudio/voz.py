# Voz del canal Claudio el Conserje con Fish s2.1-pro-free + COMPUERTA POR BLOQUE (skill fish-tts §5.ter/§5.quater):
# cada bloque (≤900 car, corte en oración) se transcribe con Modal y se compara contra SU texto; pasa si el hueco más
# largo de palabras faltantes es <4 y la duración es razonable. Hasta 5 intentos por bloque, se queda el MEJOR y lo avisa.
#   SLUG=x python vlog/claudio/voz.py [--only 0,1]      (--only = bloque de prueba para medir car/s)
# Salida: vlog/<slug>/voz/b###.wav (+ intentos _tN) · voz/gate.json · public/<slug>.wav (máster 44,1 k mono, sólo sin --only)
import os, sys, re, json, difflib, subprocess, argparse, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"); S = os.environ["SLUG"]
sys.path.insert(0, R)
import fish_factory as FF
from fish_audio_sdk import Session, TTSRequest, ReferenceAudio, Prosody
import unicodedata
for _s in (sys.stdout, sys.stderr):
    try: _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
ap = argparse.ArgumentParser(); ap.add_argument("--only", default=""); ap.add_argument("--voice", default="claudio_en_definitiva"); ap.add_argument("--speed", type=float, default=1.0); ap.add_argument("--lang", default="en"); ap.add_argument("--cps", type=float, default=18.5)
ap.add_argument("--block-chars", type=int, default=900); ap.add_argument("--temperature", type=float, default=0.72); ap.add_argument("--top-p", type=float, default=0.70)
ap.add_argument("--max-try", type=int, default=5); a = ap.parse_args()
CPS = a.cps
OUT = Path(R + f"vlog/{S}/voz"); OUT.mkdir(parents=True, exist_ok=True)
V = json.load(open(R + "fish_voices.json", encoding="utf-8"))[a.voice]
refs = [ReferenceAudio(audio=open(R + x["wav"], "rb").read(), text=x["text"]) for x in (V.get("refs") or [V])]  # refs CRUDAS, sin filtros
blocks = FF.split_blocks(open(R + f"guiones/{S}_voz.txt", encoding="utf-8").read(), a.block_chars)
only = [int(x) for x in a.only.split(",") if x != ""]
todo = only or list(range(len(blocks)))
clean = lambda t: re.sub(r"\[[^\]]+\]\s*", "", t)
deacc = lambda w: "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn")
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", deacc(w).replace("ñ", "ñ"))
# números: "thirty-five" / "a hundred and twenty" / "280,000" / "$20" cuentan igual (Whisper escribe cifras) → un solo token "#"
NUMW = set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince veinte treinta cuarenta cincuenta sesenta setenta ochenta noventa cien ciento mil".split())
def _isnum(w):
    w = re.sub(r"[^a-z0-9\-]", "", deacc(w))
    return bool(w) and (bool(re.search(r"\d", w)) or all(x in NUMW for x in w.split("-") if x))
def norm(t):
    out = []
    for w in clean(t).split():
        if _isnum(w): out.append("#")
        elif nw(w): out.append(nw(w))
    res = []
    for i, w in enumerate(out):
        nxt = out[i + 1] if i + 1 < len(out) else ""
        if w in ("a", "and", "y") and nxt == "#" and (w == "a" or (res and res[-1] == "#")): continue
        if w == "#" and res and res[-1] == "#": continue
        res.append(w)
    return res
print(f"bloques {len(blocks)} · a procesar {len(todo)} · ≤{a.block_chars} car · temp {a.temperature} top_p {a.top_p}")
session = Session(FF.load_key())

def tts(i, k):
    p = OUT / f"b{i:03d}_t{k}.wav"
    for intento in range(4):
        try:
            req = TTSRequest(text=blocks[i], references=refs, format="wav", sample_rate=44100, temperature=a.temperature, top_p=a.top_p, **({"prosody": Prosody(speed=a.speed)} if a.speed != 1.0 else {}))
            with open(p, "wb") as f:
                for ch in session.tts(req, backend=FF.BACKEND): f.write(ch)
            FF.fix_header(p)
            esperado = len(clean(blocks[i])) / CPS
            if p.stat().st_size < max(30000, esperado * 44100 * 2 * 0.45): print(f"  b{i:03d}_t{k} stream vacío/corto ({p.stat().st_size} B), reintento"); time.sleep(4); continue
            return p
        except Exception as e:
            print(f"  b{i:03d}_t{k} error: {str(e)[:160]}"); time.sleep(6)
    return None

def gap(txt, asr):
    A, B = norm(txt), norm(asr); sm = difflib.SequenceMatcher(None, A, B, autojunk=False); g = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "delete": g = max(g, i2 - i1)
        elif tag == "replace":  # sustitución (three→3, okay→OK) no es frase comida; reemplazo por mucho menos texto sí
            n, m = i2 - i1, j2 - j1
            g = max(g, n if m * 2 < n else max(0, n - m))
    return g, round(sm.ratio(), 3)

def asr(paths):
    res = str(OUT / f"_asr_{int(time.time())}.json")
    for t in range(3):
        r = subprocess.run(["modal", "run", R + "vlog/claudio/modal_asr_blocks.py", "--files", ",".join(str(p) for p in paths), "--out", res, "--lang", a.lang],
                           capture_output=True, text=True, env={**os.environ, "PYTHONUTF8": "1"}, encoding="utf-8", errors="replace")
        if os.path.exists(res): return json.load(open(res, encoding="utf-8"))
        print("  ASR Modal falló, reintento:", (r.stderr or r.stdout)[-300:]); time.sleep(10)
    sys.exit("⛔ ASR Modal no respondió 3 veces")

gate = json.load(open(OUT / "gate.json", encoding="utf-8")) if (OUT / "gate.json").exists() else {}
pend = [i for i in todo if not (gate.get(f"b{i:03d}", {}).get("ok"))]
for ronda in range(1, a.max_try + 1):
    if not pend: break
    k0 = {i: len([x for x in OUT.glob(f"b{i:03d}_t*.wav")]) + 1 for i in pend}
    with ThreadPoolExecutor(max_workers=2) as ex: made = dict(zip(pend, ex.map(lambda i: tts(i, k0[i]), pend)))
    paths = [p for p in made.values() if p]
    tr = asr(paths) if paths else {}
    nxt = []
    for i in pend:
        p = made[i]; key = f"b{i:03d}"
        if not p: nxt.append(i); continue
        txt = tr.get(str(p), {}).get("text", "")
        g, ratio = gap(blocks[i], txt); d = FF.wav_dur(p); esp = len(clean(blocks[i])) / CPS
        okdur = 0.6 * esp <= d <= 1.5 * esp
        cand = {"file": p.name, "gap": g, "ratio": ratio, "dur": round(d, 2), "esperado": round(esp, 2), "cps": round(len(clean(blocks[i])) / d, 2)}
        best = gate.get(key)
        better = not best or (g, -ratio) < (best["gap"], -best["ratio"])
        if better: gate[key] = {**cand, "ok": g < 4 and okdur, "intentos": k0[i]}
        else: gate[key]["intentos"] = k0[i]
        print(f"  {key} t{k0[i]}: hueco {g} · sim {ratio} · {d:.1f}s (esp {esp:.1f}) {'OK' if g < 4 and okdur else 'REINTENTO'}")
        if not (g < 4 and okdur): nxt.append(i)
    json.dump(gate, open(OUT / "gate.json", "w", encoding="utf-8"), indent=1)
    pend = [i for i in nxt if gate[f"b{i:03d}"]["intentos"] < a.max_try] if ronda < a.max_try else []
    print(f"RONDA {ronda}: pendientes {len(pend)}")
malos = [k for k in (f"b{i:03d}" for i in todo) if not gate.get(k, {}).get("ok")]
if malos: print("⚠️ bloques que NO pasaron tras", a.max_try, "intentos (se usa el mejor):", {k: gate[k] for k in malos})
tot_c = sum(len(clean(blocks[i])) for i in todo); tot_d = sum(gate[f"b{i:03d}"]["dur"] for i in todo if f"b{i:03d}" in gate)
print(f"MEDIDO: {len(todo)} bloques · {tot_c} car · {tot_d:.1f} s · {tot_c / max(tot_d, 1e-6):.2f} car/s")
if not only and not malos:
    lst = OUT / "concat.txt"
    lst.write_text("\n".join(f"file '{(OUT / gate[f'b{i:03d}']['file']).as_posix()}'" for i in range(len(blocks))), encoding="utf-8")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "1", R + f"public/{S}_raw.wav"], check=True)
    print("máster crudo → public/" + S + "_raw.wav", round(FF.wav_dur(Path(R + f"public/{S}_raw.wav")), 1), "s")
