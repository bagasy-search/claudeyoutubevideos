# ASR DEFAULT (13-oct-2026): Groq whisper-large-v3, SÓLO cuentas GRATIS. Reemplaza a modal_whisper.py con la
# MISMA salida: public/captions_<slug>.json (una caption por PALABRA {text,startMs,endMs,timestampMs,confidence})
# + transcript_<slug>.txt + transcript_<slug>_timed.txt.
# Medido contra las pausas reales (tgbiro 28,7 min): arranque mediana 49 ms / p90 151 ms (Modal 79 / 211), 14 s, US$0.
# La cuenta gratis aguantó 12,4 h de audio en 16 min sin un 429.
# Uso:  PYTHONUTF8=1 python scripts/asr_groq.py <slug> [es|en] [--wav <ruta>] [--out <captions.json>]
#       sin --wav busca public/<slug>_16k.wav o public/<slug>.wav. Comparar: scripts/asr_cmp.py
# ⛔ Claves: SÓLO GROQ_FREE_KEY_1, _2, … (.env o entorno); si una da 429 pasa a la siguiente.
#    La cuenta paga (GROQ_API_KEY_PAGA_NO_USAR) no se usa NUNCA: el dueño pidió cero gasto.
import json, os, subprocess, sys, tempfile, time, urllib.error, urllib.request, uuid

args = sys.argv[1:]
def opt(name):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
wav_arg, out_arg = opt("--wav"), opt("--out")
slug = args[0]
lang = args[1] if len(args) > 1 else "es"
model = "whisper-large-v3"  # el turbo empata con Modal (73 ms): no conviene

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
keys = [v for k, v in sorted(os.environ.items()) if k.startswith("GROQ_FREE_KEY_")]
env_file = os.path.join(root, ".env")
if os.path.exists(env_file):
    for line in open(env_file, encoding="utf-8"):
        if line.startswith("GROQ_FREE_KEY_"):
            keys.append(line.split("=", 1)[1].strip().strip('"'))
keys = list(dict.fromkeys(keys))
if not keys:
    sys.exit("falta GROQ_FREE_KEY_1 en .env")

wav = wav_arg or next((p for p in (os.path.join(root, "public", f"{slug}_16k.wav"), os.path.join(root, "public", f"{slug}.wav"))
                       if os.path.exists(p)), None)
if not wav or not os.path.exists(wav):
    sys.exit(f"No existe el wav: public/{slug}.wav")
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav],
                           capture_output=True, text=True, check=True).stdout.strip())
# tope del plan gratis = 25 MB por archivo → bitrate que entra (64k hasta ~50 min; más largo baja, ASR no lo nota)
kbps = max(16, min(64, int(23.5 * 8 * 1024 / dur)))
mp3 = os.path.join(tempfile.gettempdir(), f"groq_{slug}_{uuid.uuid4().hex[:6]}.mp3")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-ar", "16000", "-b:a", f"{kbps}k", mp3], check=True)

b = uuid.uuid4().hex
fields = {"model": model, "language": lang, "response_format": "verbose_json", "temperature": "0"}
body = b""
for k, v in fields.items():
    body += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
for g in ("word", "segment"):
    body += f'--{b}\r\nContent-Disposition: form-data; name="timestamp_granularities[]"\r\n\r\n{g}\r\n'.encode()
body += f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode()
body += open(mp3, "rb").read() + f"\r\n--{b}--\r\n".encode()
os.remove(mp3)

print(f"→ transcribiendo '{slug}' en Groq ({model}, {lang}, {dur / 60:.1f} min, mp3 {kbps}k)...")
t0 = time.time()
r = None
for n, key in enumerate(keys, 1):
    for intento in range(3):
        req = urllib.request.Request("https://api.groq.com/openai/v1/audio/transcriptions", body,
                                     {"Authorization": f"Bearer {key}", "Content-Type": f"multipart/form-data; boundary={b}",
                                      "User-Agent": "asr-groq/1"})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=900))
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:400]
            if e.code == 429:
                print(f"clave gratis {n} topeada: {msg}")
                break                                   # → siguiente clave gratis
            if e.code >= 500 and intento < 2:
                time.sleep(10); continue
            sys.exit(f"HTTP {e.code} (clave gratis {n}/{len(keys)}): {msg}")
        except (urllib.error.URLError, TimeoutError) as e:
            if intento < 2:
                time.sleep(10); continue
            sys.exit(f"red: {e}")
    if r is not None:
        break
if r is None:
    sys.exit("todas las claves gratis de Groq están topeadas → usar el respaldo (modal_whisper.py)")

caps = []
for w in r.get("words") or []:
    s, e = int(round(w["start"] * 1000)), int(round(w["end"] * 1000))
    caps.append({"text": " " + w["word"].strip(), "startMs": s, "endMs": e, "timestampMs": e, "confidence": 1.0})

out = out_arg or os.path.join(root, "public", f"captions_{slug}.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump(caps, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
if not out_arg:  # mismos archivos de texto que modal_whisper.py
    open(os.path.join(root, f"transcript_{slug}.txt"), "w", encoding="utf-8").write("".join(c["text"] for c in caps).strip())
    fmt = lambda ms: f"{int(ms / 1000 // 60):02d}:{(ms / 1000 - int(ms / 1000 // 60) * 60):05.2f}"
    open(os.path.join(root, f"transcript_{slug}_timed.txt"), "w", encoding="utf-8").write(
        "\n".join(f"[{fmt(c['startMs'])}] {c['text']}" for c in caps))
try: shown = os.path.relpath(out, root)
except ValueError: shown = out  # --out en otro disco (Windows): relpath no cruza unidades
print(f"✓ {len(caps)} palabras · {shown} · {time.time() - t0:.1f}s · clave gratis {n}")
