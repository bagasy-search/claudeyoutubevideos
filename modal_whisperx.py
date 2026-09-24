# modal_whisperx.py — transcripción con WhisperX (Whisper + ALINEACIÓN FORZADA wav2vec2) en GPU de Modal.
#
# ¿Por qué existe si ya está modal_whisper.py?
#   Whisper NO mide el audio: infiere los timestamps de palabra de sus pesos de atención (DTW) y derrapa
#   ±100-300ms, con CUALQUIER tamaño de modelo. WhisperX le agrega alineación forzada con wav2vec2 →
#   palabras a ~±20-50ms. Eso es lo que hace falta para karaoke y para las tarjetas enumeradas que se
#   enfocan EXACTO cuando el avatar dice "uno", "dos"...
#
# DROP-IN: escribe EXACTAMENTE los mismos archivos que modal_whisper.py, mismo formato:
#   public/captions_<slug>.json  (una entrada por PALABRA: {text,startMs,endMs,timestampMs,confidence})
#   transcript_<slug>.txt · transcript_<slug>_timed.txt
#
# Uso:  PYTHONUTF8=1 python -m modal run modal_whisperx.py --slug <slug>
#       PYTHONUTF8=1 python -m modal run modal_whisperx.py --slug <slug> --lang es --model medium
import os
import json
import modal

app = modal.App("reppo-whisperx")
cache = modal.Volume.from_name("reppo-whisperx-cache", create_if_missing=True)  # cachea modelos (baja 1 vez)

image = (
    modal.Image.from_registry("nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04", add_python="3.11")
    .apt_install("ffmpeg", "git")
    .pip_install("whisperx", "requests", "huggingface_hub")
)


@app.function(image=image, gpu="L4", volumes={"/cache": cache},
              timeout=1800, scaledown_window=120)
def transcribe(wav_bytes: bytes, lang: str = "es", model: str = "medium"):
    """Transcribe + ALINEA en GPU. Devuelve la lista de captions (una por palabra)."""
    import whisperx
    os.makedirs("/cache/wx", exist_ok=True)
    os.environ["HF_HOME"] = "/cache/wx"
    os.environ["TORCH_HOME"] = "/cache/wx"
    open("/root/in.wav", "wb").write(wav_bytes)
    device = "cuda"

    # 1) transcripción (rápida, igual que faster-whisper)
    m = whisperx.load_model(model, device, compute_type="float16", language=lang, download_root="/cache/wx")
    audio = whisperx.load_audio("/root/in.wav")
    result = m.transcribe(audio, batch_size=16, language=lang)

    # 2) ★ ALINEACIÓN FORZADA — acá está la ganancia de precisión
    align_model, meta = whisperx.load_align_model(language_code=lang, device=device, model_dir="/cache/wx")
    aligned = whisperx.align(result["segments"], align_model, meta, audio, device,
                             return_char_alignments=False)

    caps = []
    for seg in aligned.get("segments", []):
        for w in seg.get("words", []):
            if w.get("start") is None or w.get("end") is None:
                continue  # wav2vec2 a veces no ancla una palabra suelta; se saltea
            startMs = int(round(float(w["start"]) * 1000))
            endMs = int(round(float(w["end"]) * 1000))
            # OJO: whisperx devuelve la palabra SIN espacio inicial (faster-whisper sí lo trae).
            # Le anteponemos el espacio para que "".join(texts) siga dando un transcript legible
            # y el formato quede idéntico al de modal_whisper.py (drop-in de verdad).
            txt = " " + str(w.get("word", "")).strip()
            caps.append({"text": txt, "startMs": startMs, "endMs": endMs,
                         "timestampMs": endMs, "confidence": round(float(w.get("score") or 1), 4)})
    cache.commit()
    return caps


@app.local_entrypoint()
def main(slug: str, lang: str = "es", model: str = "medium"):
    """Sube el wav local, transcribe+alinea en Modal, y escribe los mismos archivos de siempre."""
    wav = f"public/{slug}_16k.wav"
    if not os.path.exists(wav):
        wav = f"public/{slug}.wav"
    if not os.path.exists(wav):
        raise SystemExit(f"No existe el wav: public/{slug}.wav")
    print(f"→ transcribiendo '{slug}' con WhisperX en Modal (GPU, lang {lang}, {model}, alineación forzada)...")
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
        "\n".join(f"[{fmt(c['startMs'])}] {c['text'].strip()}" for c in caps))
    print(f"✓ {len(caps)} palabras (alineadas) · public/captions_{slug}.json")
