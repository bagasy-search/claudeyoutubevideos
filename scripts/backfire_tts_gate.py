# scripts/backfire_tts_gate.py <slug> [--rounds 5] [--concurrency 2] — COMPUERTA DE VOZ POR BLOQUE (canal Walt).
#   Correr DESPUÉS de `python scripts/rksafe_tts.py <slug> --concurrency 2`.
#   Transcribe CADA bloque con Groq whisper-large-v3 (groq_whisper.py, un solo pedido por ronda) y mide el HUECO MÁS LARGO de palabras del
#   guion que no se oyen (difflib, delete/replace). Hueco >= 4 → regenera SOLO ese bloque con rksafe_tts --only,
#   hasta --rounds veces, y se queda con la MEJOR toma (la de hueco menor). Nunca en silencio: imprime todo.
# ⛔ El % de similitud NO es el criterio (el ASR escribe "1935" donde el guion dice "nineteen thirty-five"):
#    los números se sacan de los dos lados antes de comparar.
# ⛔ También mira el TAMAÑO: un wav casi vacío (stream cortado del free tier) es un fallo aunque no tire excepción.
# Sale: _v3/<slug>_tts_gate.json · exit 0 si todos < 4, exit 1 si quedó alguno (y lo lista).
import argparse, difflib, json, os, re, shutil, subprocess, sys
for _s in (sys.stdout, sys.stderr):
    try: _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
sys.path.insert(0, os.getcwd())
import groq_whisper as mw  # 14-oct: Groq gratis, NUNCA Modal (pedido del dueño)

NUM = set(("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen "
           "seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million "
           "billion and point percent first second third").split())

def norm(s):
    s = re.sub(r"\[[^\]]*\]|\([^)]*\)", " ", s.lower())
    toks = re.findall(r"[a-z0-9']+", s.replace("-", " "))
    return [t for t in toks if t not in NUM and not re.match(r"^[\d,.']+(st|nd|rd|th|s)?$", t)]

def gap(script, heard):
    a, b = norm(script), norm(heard)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    g, where = 0, ""
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("delete", "replace") and i2 - i1 > g:
            g, where = i2 - i1, " ".join(a[i1:i2])[:80]
    return g, where

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug"); ap.add_argument("--rounds", type=int, default=5); ap.add_argument("--concurrency", type=int, default=2)
    a = ap.parse_args()
    blocks = json.load(open(f"_v3/{a.slug}_blocks.json", encoding="utf8"))
    out = f"_v3/{a.slug}_tts"
    best = {}   # i -> (gap, where)
    pend = list(range(len(blocks)))
    for rnd in range(1, a.rounds + 1):
        wavs = []
        for i in pend:
            p = f"{out}/b{i:03d}.wav"
            sz = os.path.getsize(p) if os.path.exists(p) else 0
            esperado = len(blocks[i]) / 15.7 * 44100 * 2 * 0.45
            wavs.append((i, p, sz >= max(30000, esperado)))
        with mw.app.run():
            res = list(mw.transcribe.map([open(p, "rb").read() if ok else b"" for i, p, ok in wavs],
                                         kwargs={"lang": "en", "model": "large-v3"}, return_exceptions=True))
        nuevos = []
        for (i, p, ok), caps in zip(wavs, res):
            heard = "" if (not ok or isinstance(caps, Exception)) else "".join(c["text"] for c in caps)
            g, where = gap(blocks[i], heard) if heard else (999, "(wav vacío o ASR falló)")
            prev = best.get(i)
            if prev is None or g < prev[0]:
                best[i] = (g, where)
                if os.path.exists(p): shutil.copyfile(p, f"{out}/b{i:03d}_best.wav")
            if g >= 4: nuevos.append(i)
        malos = [i for i in pend if best[i][0] >= 4]
        print(f"ronda {rnd}: medidos {len(pend)} · con hueco>=4: {len(malos)}" + (" → " + ", ".join(f"b{i:03d}({best[i][0]})" for i in malos[:20]) if malos else " ✓"))
        if not malos or rnd == a.rounds: break
        pend = malos
        subprocess.run([sys.executable, "scripts/rksafe_tts.py", a.slug, "--concurrency", str(a.concurrency),
                        "--only", ",".join(str(i) for i in pend)], check=False)
    # restaurar la mejor toma de cada bloque
    for i in best:
        b = f"{out}/b{i:03d}_best.wav"
        if os.path.exists(b): shutil.move(b, f"{out}/b{i:03d}.wav")
    malos = sorted(i for i, (g, _) in best.items() if g >= 4)
    json.dump({str(i): {"gap": g, "where": w} for i, (g, w) in sorted(best.items())}, open(f"_v3/{a.slug}_tts_gate.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print(f"MEDIDO: {len(blocks)} bloques · hueco máx global {max(g for g, _ in best.values())} · quedan con hueco>=4: {len(malos)}")
    for i in malos: print(f"   ⛔ b{i:03d} hueco {best[i][0]}: «{best[i][1]}» → reescribir esa frase en el guion y regenerar")
    sys.exit(1 if malos else 0)

if __name__ == "__main__":
    main()
