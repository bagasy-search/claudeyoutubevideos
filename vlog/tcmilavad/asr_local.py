# asr_local.py <audio> <out.json> — ASR por palabra con faster-whisper LOCAL (GPU/CPU), sin OpenAI ni Modal.
# Salida compatible con voz.py: {"voz": [{"text","startMs","endMs"}]}
import sys, json
from faster_whisper import WhisperModel
inp, out = sys.argv[1], sys.argv[2]
def run(dev, ct, size):
    m = WhisperModel(size, device=dev, compute_type=ct)
    segs, info = m.transcribe(inp, language="es", word_timestamps=True, vad_filter=False, beam_size=5)
    return list(segs), info
try:
    segs, info = run("cuda", "int8_float16", "medium")
except Exception as e:
    print("GPU no disponible, CPU small:", str(e)[:60]); segs, info = run("cpu", "int8", "small")
W = []
for s in segs:
    for w in (s.words or []):
        W.append({"text": w.word.strip(), "startMs": int(round(w.start * 1000)), "endMs": int(round(w.end * 1000))})
json.dump({"voz": W}, open(out, "w", encoding="utf8"), ensure_ascii=False)
print("palabras", len(W), "dur", round(info.duration, 1))
