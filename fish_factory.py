#!/usr/bin/env python3
# fish_factory.py — guion largo → bloques → N workers de Fish (s2.1-pro-free) → master.wav
#
#   PYTHONUTF8=1 python fish_factory.py --script guion.txt --voice <voz> --out <dir> \
#       [--concurrency 2] [--block-chars 900] [--keep-tags] [--fix-flagged 2]
#
# Contrato con factory/phases/10_voice.mjs: <out>/master.wav + <out>/manifest.json {<id>: {status:"ok",...}}.
# - Segmenta por ORACIÓN, bloques ≤ block-chars (los largos se comen frases: medido cmeenchufe).
# - Reanuda: un bloque con status ok y wav en disco no se regenera.
# - Stream vacío del free tier = reintento (medido apayellow): se chequea el TAMAÑO del wav.
# - Loop/truncado: duración fuera de [0.6, 1.5] × esperado (cps del canal) → se regenera hasta --fix-flagged veces.
# - Todo except IMPRIME la excepción (un except mudo es un cuelgue invisible).
import argparse, json, os, re, subprocess, sys, threading, time, wave
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.abspath(__file__))
MODEL = os.environ.get("FISH_MODEL", "s2.1-pro-free")
LOCK = threading.Lock()


def clean_script(t, keep_tags):
    t = t.replace("\r", "")
    if not keep_tags:
        t = re.sub(r"\[[^\]]*\]", " ", t)
    t = re.sub(r"[ \t]+", " ", t)
    return t.strip()


def bloques(texto, maxc):
    parrafos = [p.strip() for p in re.split(r"\n\s*\n", texto) if p.strip()]
    out, cur = [], ""
    for p in parrafos:
        oraciones = re.findall(r"[^.!?…]+[.!?…]+[\"”»)]*|[^.!?…]+$", p)
        for o in (x.strip() for x in oraciones if x.strip()):
            if cur and len(cur) + 1 + len(o) > maxc:
                out.append(cur); cur = o
            else:
                cur = (cur + " " + o).strip() if cur else o
        # el párrafo es una pausa natural: cortamos ahí si el bloque ya pesa
        if len(cur) > maxc * 0.55:
            out.append(cur); cur = ""
    if cur:
        out.append(cur)
    return out


def dur_wav(p):
    # el WAV que llega por stream trae el largo del header en 0xFFFFFFFF: se mide por tamaño del PCM
    with wave.open(p) as w:
        fr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth()
    return max(0, os.path.getsize(p) - 44) / float(fr * ch * sw)


def arreglar_header(p):
    # reescribe el wav con un header correcto (ffmpeg concat y ffprobe confían en él)
    tmp = p + ".fix.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "1", tmp], check=True)
    os.replace(tmp, p)


def tts(session, req_cls, ref_cls, voz, texto, dst, temperature, top_p):
    from fish_audio_sdk import TTSRequest, ReferenceAudio  # noqa
    req = TTSRequest(text=texto, references=[ReferenceAudio(audio=voz["audio"], text=voz["text"])],
                     format="wav", temperature=temperature, top_p=top_p, chunk_length=300, latency="normal")
    tmp = dst + ".part"
    with open(tmp, "wb") as f:
        for c in session.tts(req, backend=MODEL):
            f.write(c)
    os.replace(tmp, dst)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", required=True)
    ap.add_argument("--voice", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--concurrency", type=int, default=2)
    ap.add_argument("--block-chars", type=int, default=900)
    ap.add_argument("--keep-tags", action="store_true")
    ap.add_argument("--fix-flagged", type=int, default=2)
    ap.add_argument("--cps", type=float, default=15.0)
    ap.add_argument("--temperature", type=float, default=0.7)
    ap.add_argument("--top-p", type=float, default=0.7)
    a = ap.parse_args()

    from fish_audio_sdk import Session
    key = os.environ.get("FISH_KEY")
    if not key:
        sys.exit("falta FISH_KEY")
    voces = json.load(open(os.path.join(ROOT, "fish_voices.json"), encoding="utf-8"))
    if a.voice not in voces:
        sys.exit(f"voz '{a.voice}' no registrada en fish_voices.json (usá fish_register_voice.py)")
    v = voces[a.voice]
    voz = {"audio": open(os.path.join(ROOT, v["wav"]), "rb").read(), "text": v["text"]}

    os.makedirs(os.path.join(a.out, "blocks"), exist_ok=True)
    texto = clean_script(open(a.script, encoding="utf-8").read(), a.keep_tags)
    bl = bloques(texto, a.block_chars)
    manp = os.path.join(a.out, "manifest.json")
    man = json.load(open(manp, encoding="utf-8")) if os.path.exists(manp) else {}
    # si el guion cambió, el bloque viejo no sirve
    for i, t in enumerate(bl):
        k = f"{i:04d}"
        if k in man and man[k].get("text") != t:
            man.pop(k)
    for k in [k for k in man if int(k) >= len(bl)]:
        man.pop(k)
    print(f"{len(bl)} bloques · {len(texto)} car · voz {a.voice} · modelo {MODEL} · workers {a.concurrency}", flush=True)

    session = Session(key)

    def guardar():
        with LOCK:
            json.dump(man, open(manp + ".tmp", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            os.replace(manp + ".tmp", manp)

    def hacer(i):
        k = f"{i:04d}"
        t = bl[i]
        dst = os.path.join(a.out, "blocks", f"{k}.wav")
        if man.get(k, {}).get("status") == "ok" and os.path.exists(dst):
            return
        esperado = len(t) / a.cps
        ult = None
        for intento in range(1, 7 + a.fix_flagged):
            try:
                tts(session, None, None, voz, t, dst, a.temperature, a.top_p)
                sz = os.path.getsize(dst)
                if sz < max(30000, esperado * 44100 * 2 * 0.45):
                    ult = f"stream vacío/corto ({sz} B)"
                    print(f"bloque {k} intento {intento}: {ult}", flush=True)
                    time.sleep(3 * intento)
                    continue
                d = dur_wav(dst)
                arreglar_header(dst)
                r = d / esperado
                flag = "short" if r < 0.6 else "long" if r > 1.5 else None
                if flag and intento <= a.fix_flagged + 1:
                    ult = f"{flag} ({d:.1f}s vs {esperado:.1f}s)"
                    print(f"bloque {k} intento {intento}: {ult} → regenero", flush=True)
                    continue
                with LOCK:
                    man[k] = {"status": "ok", "text": t, "dur": round(d, 2), "esperado": round(esperado, 2),
                              "flag": flag, "intentos": intento}
                guardar()
                print(f"bloque {k} ok {d:.1f}s (x{r:.2f}) intento {intento}", flush=True)
                return
            except Exception as e:  # noqa: BLE001 — se imprime SIEMPRE
                ult = repr(e)[:200]
                print(f"bloque {k} intento {intento} ERROR {ult}", flush=True)
                time.sleep(5 * intento)
        with LOCK:
            man[k] = {"status": "fail", "text": t, "error": ult}
        guardar()
        print(f"bloque {k} FAIL: {ult}", flush=True)

    with ThreadPoolExecutor(max_workers=max(1, a.concurrency)) as ex:
        list(ex.map(hacer, range(len(bl))))

    malos = [k for k, b in man.items() if b.get("status") != "ok"]
    if malos:
        print(f"ERROR {len(malos)} bloques sin generar: {malos[:10]}", flush=True)
        sys.exit(1)
    # master: concat con una pausa corta entre bloques (fin de oración), 44.1 kHz mono
    lista = os.path.join(a.out, "concat.txt")
    sil = os.path.join(a.out, "blocks", "_sil.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "0.25",
                    "-c:a", "pcm_s16le", sil], check=True)
    with open(lista, "w") as f:
        for i in range(len(bl)):
            f.write(f"file '{os.path.abspath(os.path.join(a.out, 'blocks', f'{i:04d}.wav'))}'\n")
            if i < len(bl) - 1:
                f.write(f"file '{os.path.abspath(sil)}'\n")
    master = os.path.join(a.out, "master.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista,
                    "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", master], check=True)
    print(f"master ✓ {master} {dur_wav(master):.1f}s", flush=True)


if __name__ == "__main__":
    main()
