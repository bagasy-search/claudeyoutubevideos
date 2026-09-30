# fish_factory_rkfob.py — cola de voz clonada con Fish s2.1-pro-free para `rkfob` (Ray Kessler, EN).
#
# El factory compartido (`fish_factory.py`) se perdió del checkout, y de todos modos SÓLO ACEPTA
# UNA referencia: en rkbill y rkbottle hubo que parchear una copia para mandar TRES. Ésta ya nace
# multi-referencia.
#
#   python fish_factory_rkfob.py --script cola.txt --refs refs.json --out dir [--block-chars 500]
#                                [--concurrency 3] [--fix-flagged 2] [--temperature 0.75] [--top-p 0.8]
#
# refs.json = [{"wav": "...", "text": "transcripción EXACTA"}, ...]
#
# ⛔ EL TEXTO DE LA REFERENCIA SALE DEL GUION, NO DEL ASR. Medido en rkbill: el ASR escribe "90"
#    donde el guion dice "ninety", y esa discrepancia ensucia el clon.
# ⛔ GOTCHA DE LOOP: s2.1 loopea ~1 de cada 9 bloques y sale al doble de largo. Se caza por
#    DURACIÓN (long >1.5x lo esperado, short <0.6x) y se regenera: es estocástico, a la 2ª sale.
# ⛔ NO usar el ASR de Fish para verificar: es PAGO y hoy devuelve 402. La verificación va con Whisper.
import argparse, json, os, re, subprocess, sys, wave, contextlib
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# ⛔ Windows abre stdout en cp1252 y CUALQUIER carácter no-latin1 (una flecha, un ≤) tira
#    UnicodeEncodeError y mata la corrida ENTERA — no al imprimir, sino a mitad del trabajo.
#    Está anotado para el worker de H3 y aplica a todo script de Python de este repo.
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from fish_audio_sdk import Session, TTSRequest, ReferenceAudio

BACKEND = "s2.1-pro-free"
CHARS_PER_SEC = 15.7          # medido: ~15,7 chars/s de audio


def load_key() -> str:
    k = os.environ.get("FISH_KEY")
    if k:
        return k
    env = Path(".env")
    if env.exists():
        for line in env.read_text(encoding="utf-8", errors="ignore").splitlines():
            m = re.match(r"^FISH_KEY\s*=\s*(.*)$", line.strip())
            if m:
                return m.group(1).strip().strip('"').strip("'")
    sys.exit("falta FISH_KEY (env o .env)")


def split_blocks(text: str, max_chars: int) -> list[str]:
    """Corta SOLO en frontera de oración. Nunca a mitad de frase.

    ⛔⛔ EL REGEX ANTERIOR PERDÍA TEXTO EN SILENCIO — y se comió LA frase del video.
    Era `[^.!?]*[.!?]+(?:\\s|$)`: exige ESPACIO justo después del signo de puntuación. Cuando
    una oración cierra con comilla — `...was I supposed to know?"` — después del `?` viene `"`,
    el match falla ahí y `findall` SALTA hacia adelante DESCARTANDO ese tramo. Medido en esta
    cola: 59 caracteres perdidos, entre ellos la línea del clímax del guion.
    El síntoma llegó tarde y disfrazado: el ASR de la cola daba 97,13% de cobertura (parece sano)
    y el hueco sólo apareció al buscar rachas de 5+ palabras seguidas sin oír.
    ✅ Ahora el signo puede venir seguido de comillas/paréntesis de cierre, y hay una COMPUERTA
    abajo que compara carácter a carácter lo que entra contra lo que sale.
    """
    text = re.sub(r"\s+", " ", text).strip()
    sentences = re.findall(r'[^.!?]*[.!?]+["\'”’)\]]*\s*|[^.!?]+$', text)

    # ⛔ COMPUERTA DURA: si el partidor pierde UN carácter, aborta. Nunca más en silencio.
    rejunta = re.sub(r"\s+", " ", "".join(sentences)).strip()
    if rejunta != text:
        faltan = len(text) - len(rejunta)
        print(f"⛔ el partidor perdió {faltan} caracteres — NO genero audio incompleto")
        for k in range(min(len(text), len(rejunta))):
            if text[k] != rejunta[k]:
                print("   primer desvío en el char", k, "→", repr(text[k - 60:k + 60]))
                break
        sys.exit(3)

    blocks, cur = [], ""
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if cur and len(cur) + 1 + len(s) > max_chars:
            blocks.append(cur.strip())
            cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        blocks.append(cur.strip())

    # segunda compuerta: lo que se manda a Fish, palabra a palabra, tiene que ser el texto entero
    import re as _re
    a = _re.sub(r"\s+", " ", " ".join(blocks)).strip()
    if a != text:
        print(f"⛔ los BLOQUES no reconstruyen el texto ({len(a)} vs {len(text)} chars)")
        sys.exit(3)
    return blocks


def wav_dur(p: Path) -> float:
    """⛔ NO se puede leer la duración del HEADER del wav: Fish devuelve el audio en STREAMING y
    escribe un tamaño PLACEHOLDER en la cabecera. Medido acá: un bloque de 25,48 s reales daba
    48.695,8 s por header. Con eso, la compuerta de duración marca TODOS los bloques como 'long'
    y los regenera para siempre. Se mide con ffprobe, que decodifica de verdad."""
    if not p.exists() or p.stat().st_size < 1024:
        return 0.0
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                              "-of", "csv=p=0", str(p)], capture_output=True, text=True, timeout=60)
        return float(out.stdout.strip() or 0.0)
    except Exception:
        return 0.0


def fix_header(p: Path) -> None:
    """Reescribe el wav para que la cabecera diga la verdad (el resto del pipeline la lee)."""
    tmp = p.with_suffix(".fix.wav")
    try:
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-c:a", "pcm_s16le",
                        "-ar", "44100", "-ac", "1", "-y", str(tmp)], check=True, timeout=120)
        tmp.replace(p)
    except Exception:
        if tmp.exists():
            tmp.unlink()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", required=True)
    ap.add_argument("--refs", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--block-chars", type=int, default=500)
    ap.add_argument("--concurrency", type=int, default=3)
    ap.add_argument("--fix-flagged", type=int, default=2)
    ap.add_argument("--temperature", type=float, default=0.75)
    ap.add_argument("--top-p", type=float, default=0.80)
    a = ap.parse_args()

    key = load_key()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)

    refs_spec = json.loads(Path(a.refs).read_text(encoding="utf-8"))
    refs = []
    for r in refs_spec:
        wp = Path(r["wav"])
        if not wp.exists():
            sys.exit(f"falta la referencia {wp}")
        refs.append(ReferenceAudio(audio=wp.read_bytes(), text=r["text"]))
    print(f"referencias: {len(refs)}  ({', '.join(Path(r['wav']).name for r in refs_spec)})")

    text = Path(a.script).read_text(encoding="utf-8")
    blocks = split_blocks(text, a.block_chars)
    print(f"guion: {len(text)} chars → {len(blocks)} bloques de ≤{a.block_chars} "
          f"(esperado ~{len(text)/CHARS_PER_SEC/60:.1f} min de audio)")

    session = Session(key)

    def gen(i: int, txt: str) -> tuple[int, bool, str]:
        p = out / f"b{i:03d}.wav"
        try:
            req = TTSRequest(text=txt, references=refs, format="wav", sample_rate=44100,
                             temperature=a.temperature, top_p=a.top_p)
            with open(p, "wb") as f:
                for chunk in session.tts(req, backend=BACKEND):
                    f.write(chunk)
            fix_header(p)      # la cabecera del streaming miente; sin esto el gate de duración explota
            return i, True, ""
        except Exception as e:
            return i, False, str(e)[:160]

    manifest_p = out / "manifest.json"
    manifest = json.loads(manifest_p.read_text()) if manifest_p.exists() else {}

    pend = [(i, t) for i, t in enumerate(blocks)
            if not (out / f"b{i:03d}.wav").exists() or wav_dur(out / f"b{i:03d}.wav") <= 0.2]
    print(f"a generar {len(pend)} · ya estaban {len(blocks)-len(pend)}\n")

    ok = fail = 0
    with ThreadPoolExecutor(max_workers=a.concurrency) as ex:
        futs = {ex.submit(gen, i, t): i for i, t in pend}
        for fu in as_completed(futs):
            i, good, err = fu.result()
            if good:
                ok += 1
                if ok % 5 == 0:
                    print(f"  ✓ {ok}/{len(pend)}")
            else:
                fail += 1
                print(f"  ✗ b{i:03d}: {err}")

    # ── compuerta de DURACIÓN (el loop de s2.1) ──────────────────────────
    for ronda in range(a.fix_flagged + 1):
        flagged = []
        for i, t in enumerate(blocks):
            p = out / f"b{i:03d}.wav"
            d = wav_dur(p)
            esperado = len(t) / CHARS_PER_SEC
            if d <= 0.2:
                flagged.append((i, t, "vacío", d, esperado))
            elif d > esperado * 1.5:
                flagged.append((i, t, "long", d, esperado))
            elif d < esperado * 0.6:
                flagged.append((i, t, "short", d, esperado))
        manifest = {f"b{i:03d}": {"chars": len(t), "dur": wav_dur(out / f'b{i:03d}.wav'),
                                  "esperado": round(len(t)/CHARS_PER_SEC, 2)} for i, t in enumerate(blocks)}
        manifest_p.write_text(json.dumps(manifest, indent=1))
        print(f"\nRONDA {ronda}: bloques {len(blocks)} · marcados {len(flagged)}")
        for i, t, why, d, e in flagged:
            print(f"   ⚠️ b{i:03d} {why}: {d:.1f}s vs {e:.1f}s esperados")
        if not flagged or ronda == a.fix_flagged:
            break
        with ThreadPoolExecutor(max_workers=a.concurrency) as ex:
            list(as_completed([ex.submit(gen, i, t) for i, t, *_ in flagged]))

    total = sum(wav_dur(out / f"b{i:03d}.wav") for i in range(len(blocks)))
    print(f"\n=== LISTO · ok {ok} · fail {fail} · {len(blocks)} bloques · "
          f"{total:.1f}s = {total/60:.2f} min de audio ===")
    lst = out / "concat.txt"
    lst.write_text("\n".join(f"file '{(out / f'b{i:03d}.wav').resolve().as_posix()}'"
                             for i in range(len(blocks))), encoding="utf-8")
    print(f"lista de concat → {lst}")


if __name__ == "__main__":
    main()
