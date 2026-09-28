# ASR local GRATIS (faster-whisper en la RTX 3060) para la compuerta `check` cuando OpenAI/Modal no tienen saldo.
# POST /  (cuerpo = wav) → texto plano. python vlog/tfbpiedra/asr_server.py [modelo=medium] [puerto=8765]
import sys, io, tempfile, os, glob
# los DLL de CUDA vienen en los paquetes pip nvidia-* (cublas/cudnn): agregarlos antes de cargar ctranslate2
for d in glob.glob(os.path.join(sys.prefix, "Lib", "site-packages", "nvidia", "*", "bin")):
    os.add_dll_directory(d); os.environ["PATH"] = d + os.pathsep + os.environ["PATH"]
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from faster_whisper import WhisperModel
M = sys.argv[1] if len(sys.argv) > 1 else "medium"; PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
try: model = WhisperModel(M, device="cuda", compute_type="int8_float16")
except Exception as e: print("cuda falló, CPU:", e, flush=True); model = WhisperModel(M, device="cpu", compute_type="int8")
import threading; lock = threading.Lock()
class H(BaseHTTPRequestHandler):
    def do_POST(self):
        b = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        f = tempfile.NamedTemporaryFile(suffix=".wav", delete=False); f.write(b); f.close()
        try:
            with lock: segs, _ = model.transcribe(f.name, language="es", beam_size=5, vad_filter=False)
            txt = " ".join(s.text.strip() for s in segs)
            self.send_response(200); self.send_header("Content-Type", "text/plain; charset=utf-8"); self.end_headers(); self.wfile.write(txt.encode("utf-8"))
        except Exception as e:
            self.send_response(500); self.end_headers(); self.wfile.write(str(e).encode())
        finally: os.unlink(f.name)
    def log_message(self, *a): pass
print("ASR local listo", M, PORT, flush=True)
ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
