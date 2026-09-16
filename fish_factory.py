#!/usr/bin/env python
"""
Fish Audio TTS factory — s2.1-pro-free zero-shot voice clone.
Segmenta un guion -> bloques -> N workers concurrentes -> WAV por bloque
-> concat a master WAV. manifest.json para reanudar y regenerar SOLO fallidos.

Uso:
  FISH_KEY=... python fish_factory.py --script guion_federer8.txt --voice federer \
      --out fish_out/federer8 --concurrency 3 --block-chars 2500
"""
import os, re, sys, json, time, random, argparse, subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from fish_audio_sdk import Session, TTSRequest, ReferenceAudio

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND = "s2.1-pro-free"
CHARS_PER_SEC = 15.7  # medido empíricamente en el spike

# ---------- limpieza ----------
def clean_script(raw: str, keep_tags=False) -> str:
    out = []
    for ln in raw.splitlines():
        s = ln.strip()
        if not s:
            out.append("")
            continue
        if re.match(r'^(T[ÍI]TULO|CANAL)\s*:', s, re.I):      # cabecera
            continue
        if re.match(r'^=+.*=*$', s):                           # ===== / === ESCENA ===
            continue
        out.append(ln)
    text = "\n".join(out)
    if not keep_tags:
        text = re.sub(r'\[[^\]]*\]', '', text)                # tags [sighs] [emphatically]
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text

# ---------- segmentacion por oraciones ----------
def segment(text: str, block_chars: int):
    # separa en oraciones conservando la puntuacion
    parts = re.split(r'(?<=[\.\!\?\…])\s+', text.replace("\n", " "))
    parts = [p.strip() for p in parts if p.strip()]
    blocks, cur = [], ""
    for p in parts:
        if cur and len(cur) + 1 + len(p) > block_chars:
            blocks.append(cur.strip())
            cur = p
        else:
            cur = (cur + " " + p).strip()
    if cur.strip():
        blocks.append(cur.strip())
    return blocks

# ---------- un bloque con retries ----------
def synth_block(session, ref, idx, text, out_path, temperature=1.15, top_p=0.98):
    delays_429 = [5, 10, 20, 40]
    delays_5xx = [2, 5, 10, 20]
    attempt = 0
    while True:
        t0 = time.time()
        try:
            with open(out_path, "wb") as f:
                for chunk in session.tts(TTSRequest(
                        text=text, format="wav", chunk_length=300,
                        normalize=True, temperature=temperature, top_p=top_p,
                        references=[ref]), backend=BACKEND):
                    f.write(chunk)
            return ("ok", time.time() - t0, os.path.getsize(out_path))
        except Exception as e:
            code = getattr(getattr(e, "response", None), "status_code", None)
            body = ""
            try: body = e.response.text[:160]
            except Exception: pass
            if code in (401, 403):
                return ("auth_fail", 0, f"{code} {body}")
            if code == 429 and attempt < len(delays_429):
                w = delays_429[attempt] + random.uniform(0, 2)
                print(f"    [b{idx:02d}] 429 -> espero {w:.1f}s", flush=True); time.sleep(w)
            elif (code is None or 500 <= (code or 0) < 600) and attempt < len(delays_5xx):
                w = delays_5xx[attempt] + random.uniform(0, 1.5)
                print(f"    [b{idx:02d}] {code or type(e).__name__} -> espero {w:.1f}s", flush=True); time.sleep(w)
            else:
                return ("fail", 0, f"{code} {type(e).__name__} {body or e}")
            attempt += 1

def ffdur(path):
    try:
        r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                            "-of","csv=p=0", path], capture_output=True, text=True)
        return float(r.stdout.strip())
    except Exception:
        return 0.0

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", required=True)
    ap.add_argument("--voice", required=True)
    ap.add_argument("--out", required=True, help="dir de salida (relativo a video2 si no es absoluto)")
    ap.add_argument("--concurrency", type=int, default=3)
    ap.add_argument("--block-chars", type=int, default=2500)
    ap.add_argument("--keep-tags", action="store_true")
    ap.add_argument("--fix-flagged", type=int, default=2, help="rondas de auto-regen de bloques corto/largo")
    ap.add_argument("--temperature", type=float, default=1.15)
    ap.add_argument("--top-p", type=float, default=0.98)
    args = ap.parse_args()

    key = os.environ.get("FISH_KEY")
    if not key:  # fallback: leer de video2/.env (gitignored)
        envf = os.path.join(ROOT, ".env")
        if os.path.exists(envf):
            for line in open(envf, encoding="utf-8"):
                line = line.strip()
                if line.startswith("FISH_KEY="):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
    if not key: sys.exit("falta FISH_KEY (ni en el entorno ni en video2/.env)")

    voices = json.load(open(os.path.join(ROOT, "fish_voices.json"), encoding="utf-8"))
    v = voices[args.voice]
    ref_wav = v["wav"] if os.path.isabs(v["wav"]) else os.path.join(ROOT, v["wav"])
    ref = ReferenceAudio(audio=open(ref_wav, "rb").read(), text=v.get("text", ""))

    script_path = args.script if os.path.isabs(args.script) else os.path.join(ROOT, args.script)
    raw = open(script_path, encoding="utf-8").read()
    text = clean_script(raw, keep_tags=args.keep_tags)
    blocks = segment(text, args.block_chars)

    outdir = args.out if os.path.isabs(args.out) else os.path.join(ROOT, args.out)
    os.makedirs(outdir, exist_ok=True)
    total_chars = sum(len(b) for b in blocks)
    est = total_chars / CHARS_PER_SEC
    print(f"clean_chars={len(text)}  bloques={len(blocks)}  "
          f"est_audio={est/60:.1f}min  concurrency={args.concurrency}")

    manifest_path = os.path.join(outdir, "manifest.json")
    manifest = {}
    if os.path.exists(manifest_path):
        manifest = json.load(open(manifest_path, encoding="utf-8"))

    session = Session(key)
    todo = []
    for i, b in enumerate(blocks):
        bp = os.path.join(outdir, f"block_{i:03d}.wav")
        rec = manifest.get(str(i))
        if rec and rec.get("status") == "ok" and os.path.exists(bp) and ffdur(bp) > 0.5:
            continue  # ya hecho y valido -> reanuda
        todo.append((i, b, bp))

    def record(i, b, bp, status, dt, info):
        dur = ffdur(bp) if status == "ok" else 0
        exp = len(b) / CHARS_PER_SEC
        short = status == "ok" and dur < exp * 0.6   # posible truncado
        long_ = status == "ok" and dur > exp * 1.5   # posible loop/repeticion
        manifest[str(i)] = {"status": status, "chars": len(b), "gen_s": round(dt,1),
                            "dur_s": round(dur,1), "exp_s": round(exp,1),
                            "short": short, "long": long_, "info": str(info)[:120],
                            "text": b[:90]}
        json.dump(manifest, open(manifest_path,"w",encoding="utf-8"), ensure_ascii=False, indent=1)
        flag = "  <-- CORTO?" if short else ("  <-- LARGO/loop?" if long_ else ("" if status=="ok" else "  <-- FALLO"))
        print(f"  [b{i:02d}] {status}  gen={dt:4.1f}s dur={dur:5.1f}s (esp {exp:4.1f}s){flag}", flush=True)

    def run_pool(items):
        with ThreadPoolExecutor(max_workers=args.concurrency) as ex:
            futs = {ex.submit(synth_block, session, ref, i, b, bp,
                              args.temperature, args.top_p): (i, b, bp) for (i, b, bp) in items}
            for fut in as_completed(futs):
                i, b, bp = futs[fut]
                status, dt, info = fut.result()
                record(i, b, bp, status, dt, info)

    print(f"a generar: {len(todo)}/{len(blocks)} bloques", flush=True)
    t_start = time.time()
    run_pool(todo)

    # auto-reparacion de bloques flageados (loop/truncado) -> clave para 24/7 desatendido
    for rnd in range(args.fix_flagged):
        flagged = [i for i in range(len(blocks))
                   if manifest.get(str(i),{}).get("status")=="ok"
                   and (manifest[str(i)].get("short") or manifest[str(i)].get("long"))]
        if not flagged: break
        print(f"fix ronda {rnd+1}/{args.fix_flagged}: regenero {len(flagged)} flageados {flagged}", flush=True)
        run_pool([(i, blocks[i], os.path.join(outdir, f"block_{i:03d}.wav")) for i in flagged])

    ok = [i for i in range(len(blocks)) if manifest.get(str(i),{}).get("status")=="ok"]
    bad = [i for i in range(len(blocks)) if i not in ok]
    wall = time.time() - t_start
    print(f"\nlisto: {len(ok)}/{len(blocks)} ok  wall={wall:.1f}s")
    if bad:
        print(f"FALTAN {len(bad)} bloques {bad} -> volvé a correr el mismo comando (reanuda)")
        return

    # concat -> master
    listf = os.path.join(outdir, "concat.txt")
    with open(listf, "w", encoding="utf-8") as f:
        for i in range(len(blocks)):
            f.write(f"file '{os.path.join(outdir, f'block_{i:03d}.wav')}'\n")
    master = os.path.join(outdir, "master.wav")
    r = subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",listf,
                        "-c","copy", master], capture_output=True, text=True)
    if r.returncode != 0:  # fallback: re-encode uniforme
        subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",listf,
                        "-ar","44100", master], capture_output=True, text=True)
    mdur = ffdur(master)
    gen_total = sum(manifest[str(i)]["gen_s"] for i in ok)
    print(f"MASTER {master}  dur={mdur/60:.1f}min  "
          f"gen_sum={gen_total:.0f}s  wall={wall:.0f}s  RTF={wall/max(mdur,1):.2f}")

if __name__ == "__main__":
    main()
