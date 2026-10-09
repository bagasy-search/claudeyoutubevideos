# asr_local.py — 3er respaldo de ASR: faster-whisper en CPU, timestamps POR PALABRA.
# Para la nube sin Modal (gRPC no pasa el proxy) y sin OpenAI. Escribe el formato de modal_whisper:
# [{text:" w", startMs, endMs, timestampMs, confidence}].
#   python factory/py/asr_local.py <wav16k> <captions.json> <lang> [modelo=small]
import json, sys
from faster_whisper import WhisperModel

wav, out, lang = sys.argv[1], sys.argv[2], sys.argv[3]
modelo = sys.argv[4] if len(sys.argv) > 4 else "small"
m = WhisperModel(modelo, device="cpu", compute_type="int8")
segs, _ = m.transcribe(wav, language=lang, word_timestamps=True, vad_filter=False, beam_size=5)
caps = []
for s in segs:
    for w in s.words or []:
        caps.append({"text": " " + w.word.strip(), "startMs": round(w.start * 1000), "endMs": round(w.end * 1000),
                     "timestampMs": round(w.end * 1000), "confidence": round(w.probability, 3)})
json.dump(caps, open(out, "w"))
print(f"✓ {len(caps)} palabras (faster-whisper {modelo}, cpu)")
