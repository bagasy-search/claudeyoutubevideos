# ASR por palabra en Modal para MUCHOS wavs a la vez: modal run _v3/modal_asr_batch.py --lista <txt con rutas> --out <json>
import os, json, modal
app = modal.App("tdchinca-asr-batch")
cache = modal.Volume.from_name("reppo-whisper-cache", create_if_missing=True)
image = (modal.Image.from_registry("nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04", add_python="3.11")
         .apt_install("ffmpeg").pip_install("faster-whisper", "requests", "huggingface_hub"))

@app.function(image=image, gpu="L4", volumes={"/cache": cache}, timeout=1800, scaledown_window=60)
def transcribe(args):
    name, wav_bytes, lang = args
    from faster_whisper import WhisperModel
    p = "/root/" + name.replace("/", "_") + ".wav"; open(p, "wb").write(wav_bytes)
    m = WhisperModel("medium", device="cuda", compute_type="float16", download_root="/cache/fw")
    segs, _ = m.transcribe(p, language=lang, word_timestamps=True, vad_filter=False)
    caps = []
    for s in segs:
        for w in (s.words or []):
            caps.append({"text": w.word, "startMs": int(round(w.start * 1000)), "endMs": int(round(w.end * 1000))})
    return name, caps

@app.local_entrypoint()
def main(lista: str, out: str, lang: str = "es"):
    files = [l.strip() for l in open(lista, encoding="utf8") if l.strip()]
    res = {}
    for name, caps in transcribe.map([(f, open(f, "rb").read(), lang) for f in files]):
        res[name] = caps
        print("ok", os.path.basename(name), len(caps))
    json.dump(res, open(out, "w", encoding="utf8"), ensure_ascii=False)
    print("MEDIDO", len(res), "/", len(files))
