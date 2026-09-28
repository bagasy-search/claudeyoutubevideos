# asr_local.py — transcripción LOCAL (faster-whisper en la GPU) para compuertas cuando OpenAI/Modal no están.
# Uso: python scripts/asr_local.py <wav> [lang] [modelo]   → imprime el texto en stdout (UTF-8)
import sys, io, os, glob, site
# los DLL de CUDA vienen en los paquetes pip nvidia-* (cublas/cudnn): hay que registrarlos a mano en Windows
for sp in site.getsitepackages():
    for d in glob.glob(os.path.join(sp, "nvidia", "*", "bin")):
        try: os.add_dll_directory(d); os.environ["PATH"] = d + os.pathsep + os.environ["PATH"]
        except Exception: pass
from faster_whisper import WhisperModel
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
wav, lang, mod = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "es"), (sys.argv[3] if len(sys.argv) > 3 else "medium")
try: m = WhisperModel(mod, device="cuda", compute_type="int8_float16")
except Exception: m = WhisperModel(mod, device="cpu", compute_type="int8")
def run(m): segs, _ = m.transcribe(wav, language=lang, vad_filter=False, beam_size=5); return " ".join(x.text.strip() for x in segs)
try: out = run(m)
except Exception: out = run(WhisperModel(mod, device="cpu", compute_type="int8"))
print(out)
