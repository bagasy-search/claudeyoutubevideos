# align.py — FORCED ALIGNMENT (sync milimétrico). Alinea el GUION YA CONOCIDO contra el
# audio palabra por palabra (precisión ~±20-50ms vs ±150-300ms de whisper crudo). Usa
# stable-ts (en ttsenv, torch cu124). Escribe captions en el MISMO formato del proyecto.
#
# Uso:  ttsenv\Scripts\python.exe align.py <slug> [modelo=medium]
#   espera public/<slug>_16k.wav (o <slug>.wav) + transcript_<slug>.txt (el guion exacto)
#   escribe public/captions_<slug>_aligned.json  ({text,startMs,endMs,timestampMs,confidence})
import sys, os, json, wave
import numpy as np
import torch
import stable_whisper

slug = sys.argv[1]
model_name = sys.argv[2] if len(sys.argv) > 2 else "medium"
lang = os.environ.get("ALIGN_LANG", "es")

# usar SIEMPRE el wav 16k mono (whisper espera 16kHz). Si no existe, error claro.
wav = f"public/{slug}_16k.wav"
text = open(f"transcript_{slug}.txt", encoding="utf-8").read().strip()
if not os.path.exists(wav):
    print(f"falta {wav} (16kHz mono). Generalo: npx remotion ffmpeg -y -i <src> -ar 16000 -ac 1 {wav}"); sys.exit(1)

# cargar el wav directo con numpy → evita que whisper llame a ffmpeg (que no está en PATH)
def load_wav16(path):
    wf = wave.open(path, "rb")
    assert wf.getframerate() == 16000 and wf.getnchannels() == 1, "el wav debe ser 16kHz mono"
    raw = wf.readframes(wf.getnframes()); wf.close()
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"cargando whisper {model_name} ({device})…")
model = stable_whisper.load_model(model_name, device=device)
print(f"alineando {wav} con el guion ({len(text)} chars)…")
audio = load_wav16(wav)
result = model.align(audio, text, language=lang)

caps = []
for seg in result.segments:
    for w in seg.words:
        caps.append({
            "text": w.word,
            "startMs": int(round(w.start * 1000)),
            "endMs": int(round(w.end * 1000)),
            "timestampMs": int(round(w.end * 1000)),
            "confidence": round(float(getattr(w, "probability", 1.0) or 1.0), 3),
        })

out = f"public/captions_{slug}_aligned.json"
json.dump(caps, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"=== LISTO === {len(caps)} palabras alineadas -> {out}")
