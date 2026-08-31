# fish_asr.py — transcripcion PALABRA POR PALABRA con el ASR de Fish (gratis, en la nube).
# Reemplaza a modal_whisper.py cuando Modal/OpenAI estan sin credito.
# Mismo contrato de salida: public/captions_<slug>.json + transcript_<slug>.txt + _timed.txt
# Uso: PYTHONUTF8=1 python fish_asr.py <slug> [lang] [chunk_seg]
import os, sys, json, io, subprocess, tempfile
from dotenv import load_dotenv; load_dotenv()
from fish_audio_sdk import Session, ASRRequest

slug = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else "es"
CH = float(sys.argv[3]) if len(sys.argv) > 3 else 240.0

wav = f"public/{slug}.wav"
if not os.path.exists(wav):
    wav = f"public/{slug}_16k.wav"
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", wav], capture_output=True, text=True).stdout.strip())
s = Session(os.environ["FISH_KEY"])
tmp = tempfile.mkdtemp()
caps = []
t = 0.0
n = 0
while t < dur:
    seg = min(CH, dur - t)
    p = os.path.join(tmp, f"c{n}.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t}", "-t", f"{seg}",
                    "-i", wav, "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", p], check=True)
    data = open(p, "rb").read()
    r = None
    for intento in range(4):
        try:
            r = s.asr(ASRRequest(audio=data, language=lang, ignore_timestamps=False))
            break
        except Exception as e:
            print(f"   chunk {n} intento {intento+1}: {e}", flush=True)
    if r is None:
        raise SystemExit(f"chunk {n} fallo tras 4 intentos")
    for w in (r.segments or []):
        st = int(round((t + w.start) * 1000))
        en = int(round((t + w.end) * 1000))
        caps.append({"text": " " + w.text.strip(), "startMs": st, "endMs": en,
                     "timestampMs": en, "confidence": 1})
    print(f"chunk {n}: {t:.0f}-{t+seg:.0f}s -> {len(r.segments or [])} palabras (total {len(caps)})", flush=True)
    t += seg
    n += 1
    try: os.remove(p)
    except OSError: pass

# monotonia (los bordes de chunk pueden solaparse un poco)
for i in range(1, len(caps)):
    if caps[i]["startMs"] < caps[i - 1]["startMs"]:
        caps[i]["startMs"] = caps[i - 1]["startMs"]

json.dump(caps, io.open(f"public/captions_{slug}.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
plain = "".join(c["text"] for c in caps).strip()
io.open(f"transcript_{slug}.txt", "w", encoding="utf-8").write(plain)

def fmt(ms):
    sec = ms / 1000; mm = int(sec // 60)
    return f"{mm:02d}:{(sec - mm * 60):05.2f}"

io.open(f"transcript_{slug}_timed.txt", "w", encoding="utf-8").write(
    "\n".join(f"[{fmt(c['startMs'])}] {c['text'].strip()}" for c in caps))
print(f"OK {len(caps)} palabras · public/captions_{slug}.json", flush=True)
