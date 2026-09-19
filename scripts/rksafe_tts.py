# scripts/rksafe_tts.py <slug> - locucion Fish s2.1-pro-free con BLOQUES POR PARRAFO (canal Ray Kessler).
#
# ⛔⛔ POR QUE NO SE USA EL PARTIDOR POR CHARS DEL FACTORY (medido en ESTE video, 3 corridas):
#    Fish s2.1 SALTEA texto cuando un bloque contiene REPETICION RETORICA cercana. Medido:
#      1100 chars -> 3 bloques con saltos de 10-16 palabras
#       480 chars -> 3 bloques con saltos de 8-20 palabras
#    Los tres bloques marcados de la ultima corrida tenian la misma firma: una frase repetida
#    dos o tres veces adentro del MISMO bloque ("the lock is not the lock / the frame is the
#    lock / a broken lock / the lock is a machine"), y el modelo salta de la 1a a la 3a.
#    El guion de este canal esta ESCRITO con esa repeticion a proposito (es la voz de Ray), asi
#    que la solucion no es reescribirlo: es que cada parrafo sea SU PROPIA llamada, para que el
#    salto no tenga a donde saltar. Ademas da pausas de parrafo reales.
#
#   python scripts/rksafe_tts.py <slug> [--max-chars 420] [--concurrency 3] [--only 3,7]
import argparse, json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try: _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass

from fish_audio_sdk import Session, TTSRequest, ReferenceAudio

BACKEND = "s2.1-pro-free"
CHARS_PER_SEC = 15.7


def bloques_por_parrafo(txt: str, maxc: int) -> list[str]:
    paras = [re.sub(r"\s+", " ", p).strip() for p in txt.strip().split("\n\n")]
    paras = [p for p in paras if p]
    out = []
    for p in paras:
        if len(p) <= maxc:
            out.append(p); continue
        # parrafo largo: cortar SOLO en frontera de oracion
        sents = re.findall(r'[^.!?]*[.!?]+["\'”’)\]]*\s*|[^.!?]+$', p)
        assert re.sub(r"\s+", " ", "".join(sents)).strip() == p, "el partidor perdio texto"
        cur = ""
        for s in sents:
            s = s.strip()
            if not s: continue
            if cur and len(cur) + 1 + len(s) > maxc:
                out.append(cur.strip()); cur = s
            else:
                cur = (cur + " " + s).strip()
        if cur: out.append(cur.strip())
    # COMPUERTA: los bloques reconstruyen el guion entero, palabra por palabra
    a = re.sub(r"[^a-z0-9]", "", " ".join(out).lower())
    b = re.sub(r"[^a-z0-9]", "", txt.lower())
    if a != b:
        sys.exit("⛔ los bloques NO reconstruyen el guion (%d vs %d chars utiles)" % (len(a), len(b)))
    return out


def wav_dur(p: Path) -> float:
    if not p.exists() or p.stat().st_size < 1024: return 0.0
    o = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                       capture_output=True, text=True)
    m = re.findall(r"[\d.]+", o.stdout)
    return float(m[0]) if m else 0.0


def fix_header(p: Path) -> None:
    tmp = p.with_suffix(".fix.wav")
    try:
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-c:a", "pcm_s16le", "-ar", "44100",
                        "-ac", "1", "-y", str(tmp)], check=True, timeout=180)
        tmp.replace(p)
    except Exception:
        if tmp.exists(): tmp.unlink()


def load_key() -> str:
    k = os.environ.get("FISH_KEY")
    if k: return k
    for line in Path(".env").read_text(encoding="utf-8", errors="ignore").splitlines():
        m = re.match(r"^FISH_KEY\s*=\s*(.*)$", line.strip())
        if m: return m.group(1).strip().strip('"').strip("'")
    sys.exit("falta FISH_KEY")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--max-chars", type=int, default=420)
    ap.add_argument("--concurrency", type=int, default=3)
    ap.add_argument("--only", default="")
    ap.add_argument("--temperature", type=float, default=0.72)
    ap.add_argument("--top-p", type=float, default=0.78)
    a = ap.parse_args()

    GUION = "canales/%s_GUION.txt" % a.slug
    REFS = "_v3/%s_refs/refs.json" % a.slug
    OUT = Path("_v3/%s_tts" % a.slug)

    OUT.mkdir(parents=True, exist_ok=True)
    txt = Path(GUION).read_text(encoding="utf-8")
    blocks = bloques_por_parrafo(txt, a.max_chars)
    json.dump(blocks, open("_v3/%s_blocks.json" % a.slug, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    largos = sorted(len(b) for b in blocks)
    print("MEDIDO: %d chars de guion -> %d bloques (min %d · mediana %d · max %d chars) · esperado %.1f min"
          % (len(txt), len(blocks), largos[0], largos[len(largos) // 2], largos[-1], len(txt) / CHARS_PER_SEC / 60))

    refs = [ReferenceAudio(audio=Path(r["wav"]).read_bytes(), text=r["text"])
            for r in json.loads(Path(REFS).read_text(encoding="utf8"))]
    print("referencias: %d" % len(refs))
    session = Session(load_key())

    def gen(i, t):
        p = OUT / ("b%03d.wav" % i)
        try:
            req = TTSRequest(text=t, references=refs, format="wav", sample_rate=44100,
                             temperature=a.temperature, top_p=a.top_p)
            with open(p, "wb") as f:
                for ch in session.tts(req, backend=BACKEND): f.write(ch)
            fix_header(p)
            return i, True, ""
        except Exception as e:
            return i, False, str(e)[:160]

    if a.only:
        pend = [(i, blocks[i]) for i in [int(x) for x in a.only.split(",") if x.strip() != ""]]
    else:
        pend = [(i, t) for i, t in enumerate(blocks) if wav_dur(OUT / ("b%03d.wav" % i)) <= 0.2]
    print("a generar %d · ya estaban %d" % (len(pend), len(blocks) - len(pend)))

    ok = fail = 0
    with ThreadPoolExecutor(max_workers=a.concurrency) as ex:
        for fu in as_completed([ex.submit(gen, i, t) for i, t in pend]):
            i, good, err = fu.result()
            if good:
                ok += 1
                if ok % 10 == 0: print("  ✓ %d/%d" % (ok, len(pend)))
            else:
                fail += 1; print("  ✗ b%03d: %s" % (i, err))

    # compuerta de DURACION (el loop de s2.1)
    marcados = []
    for i, t in enumerate(blocks):
        d = wav_dur(OUT / ("b%03d.wav" % i)); e = len(t) / CHARS_PER_SEC
        if d <= 0.2: marcados.append((i, "vacio", d, e))
        elif d > e * 1.6 + 1.5: marcados.append((i, "long", d, e))
        elif d < e * 0.55: marcados.append((i, "short", d, e))
    total = sum(wav_dur(OUT / ("b%03d.wav" % i)) for i in range(len(blocks)))
    print("\nMEDIDO: %d bloques · %d marcados por duracion · ok %d · fail %d · %.1f s = %.2f min"
          % (len(blocks), len(marcados), ok, fail, total, total / 60))
    for i, w, d, e in marcados: print("   ⚠️ b%03d %s: %.1fs vs %.1fs" % (i, w, d, e))
    if fail: sys.exit(2)


if __name__ == "__main__":
    main()
