# ASR por BLOQUE en Modal (faster-whisper medium, GPU) para la compuerta de voz: transcribe muchos wav cortos en UN contenedor.
#   PYTHONUTF8=1 modal run vlog/rhonda/modal_asr_blocks.py --files "a.wav,b.wav" --out res.json [--lang en]
import json, modal
app = modal.App("rhonda-asr-blocks")
cache = modal.Volume.from_name("reppo-whisper-cache", create_if_missing=True)
image = (modal.Image.from_registry("nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04", add_python="3.11")
         .apt_install("ffmpeg").pip_install("faster-whisper", "requests", "huggingface_hub"))

@app.function(image=image, gpu="L4", volumes={"/cache": cache}, timeout=1800, scaledown_window=60)
def many(items: list, lang: str = "en"):
    from faster_whisper import WhisperModel
    m = WhisperModel("medium", device="cuda", compute_type="float16", download_root="/cache/fw")
    out = {}
    for name, b in items:
        open("/root/x.wav", "wb").write(b)
        segs, _ = m.transcribe("/root/x.wav", language=lang, word_timestamps=True, vad_filter=False)
        ws = [{"w": w.word, "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in (s.words or [])]
        out[name] = {"text": " ".join(x["w"].strip() for x in ws), "words": ws}
    return out

@app.local_entrypoint()
def main(files: str, out: str, lang: str = "en"):
    fs = [f for f in files.split(",") if f]
    items = [(f, open(f, "rb").read()) for f in fs]
    r = many.remote(items, lang)
    json.dump(r, open(out, "w", encoding="utf-8"), ensure_ascii=False)
    print(f"ASR Modal: {len(r)} bloques -> {out}")
