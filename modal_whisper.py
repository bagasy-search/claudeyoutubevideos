# modal_whisper.py — transcripción Whisper en GPU serverless de Modal (NUBE, no toca la GPU local).
# Reemplaza a transcribe_cuda.mjs → MISMA salida: public/captions_<slug>.json (un caption por PALABRA,
# {text,startMs,endMs,timestampMs,confidence}) + transcript_<slug>.txt + transcript_<slug>_timed.txt.
# Usa faster-whisper (medium, multilingüe) con word_timestamps. Modelo cacheado en un Volume (baja 1 vez).
#
# Uso:  PYTHONUTF8=1 modal run modal_whisper.py --slug <slug>            (espera public/<slug>.wav o _16k.wav)
#       PYTHONUTF8=1 modal run modal_whisper.py --slug <slug> --lang es --model medium
import os
import json
import modal

app = modal.App("reppo-whisper")
cache = modal.Volume.from_name("reppo-whisper-cache", create_if_missing=True)  # cachea el modelo faster-whisper

image = (
    modal.Image.from_registry("nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04", add_python="3.11")
    .apt_install("ffmpeg")
    .pip_install("faster-whisper", "requests", "huggingface_hub")
)


@app.function(image=image, gpu="L4", volumes={"/cache": cache},
              timeout=1800, scaledown_window=120)
def transcribe(wav_bytes: bytes, lang: str = "es", model: str = "medium"):
    """Transcribe el wav en GPU y devuelve la lista de captions (una por palabra) + segs."""
    from faster_whisper import WhisperModel
    os.makedirs("/cache/fw", exist_ok=True)
    open("/root/in.wav", "wb").write(wav_bytes)
    m = WhisperModel(model, device="cuda", compute_type="float16", download_root="/cache/fw")
    segments, _ = m.transcribe("/root/in.wav", language=lang, word_timestamps=True, vad_filter=False)
    caps = []
    for seg in segments:
        for w in (seg.words or []):
            startMs = int(round(w.start * 1000))
            endMs = int(round(w.end * 1000))
            caps.append({"text": w.word, "startMs": startMs, "endMs": endMs,
                         "timestampMs": endMs, "confidence": round(float(w.probability or 1), 4)})
    cache.commit()
    return caps


@app.local_entrypoint()
def main(slug: str, lang: str = "es", model: str = "medium"):
    """Sube el wav local, transcribe en Modal, y escribe los mismos archivos que transcribe_cuda.mjs."""
    wav = f"public/{slug}_16k.wav"
    if not os.path.exists(wav):
        wav = f"public/{slug}.wav"
    if not os.path.exists(wav):
        raise SystemExit(f"No existe el wav: public/{slug}.wav")
    print(f"→ transcribiendo '{slug}' en Modal (GPU, lang {lang}, {model})...")
    caps = transcribe.remote(open(wav, "rb").read(), lang=lang, model=model)
    os.makedirs("public", exist_ok=True)
    json.dump(caps, open(f"public/captions_{slug}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    plain = "".join(c["text"] for c in caps).strip()
    open(f"transcript_{slug}.txt", "w", encoding="utf-8").write(plain)

    def fmt(ms):
        s = ms / 1000
        mm = int(s // 60)
        return f"{mm:02d}:{(s - mm * 60):05.2f}"

    open(f"transcript_{slug}_timed.txt", "w", encoding="utf-8").write(
        "\n".join(f"[{fmt(c['startMs'])}] {c['text']}" for c in caps))
    print(f"✓ {len(caps)} palabras · public/captions_{slug}.json")
