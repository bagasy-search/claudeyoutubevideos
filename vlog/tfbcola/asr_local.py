# asr_local.py — servidor local compatible con POST /v1/audio/transcriptions (response_format=text) con faster-whisper
# en la GPU. Respaldo GRATIS cuando OpenAI/Modal no tienen crédito: WHISPER_URL=http://127.0.0.1:8765/v1/audio/transcriptions
import io, tempfile, os, json
from email.parser import BytesParser
from email.policy import default as POL
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from faster_whisper import WhisperModel
import threading
M = WhisperModel(os.environ.get("ASR_MODEL", "medium"), device="cuda", compute_type="float16")
LOCK = threading.Lock()
class H(BaseHTTPRequestHandler):
    def do_POST(self):
        raw = self.rfile.read(int(self.headers["Content-Length"]))
        msg = BytesParser(policy=POL).parsebytes(b"Content-Type: " + self.headers["Content-Type"].encode() + b"

" + raw)
        parts = {pt.get_param("name", header="content-disposition"): pt for pt in msg.iter_parts()}
        data = parts["file"].get_payload(decode=True); fname = parts["file"].get_filename() or "a.wav"
        lang = parts["language"].get_content().strip() if "language" in parts else "es"
        fmt = parts["response_format"].get_content().strip() if "response_format" in parts else "text"
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(fname)[1] or ".wav") as t: t.write(data); p = t.name
        with LOCK: segs, info = M.transcribe(p, language=lang, word_timestamps=(fmt == "verbose_json"), vad_filter=False)
        segs = list(segs); os.unlink(p)
        if fmt == "verbose_json":
            words = [{"word": w.word, "start": w.start, "end": w.end} for s in segs for w in (s.words or [])]
            body = json.dumps({"text": "".join(s.text for s in segs), "words": words, "duration": info.duration}).encode(); ct = "application/json"
        else: body = "".join(s.text for s in segs).strip().encode(); ct = "text/plain; charset=utf-8"
        self.send_response(200); self.send_header("Content-Type", ct); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
    def log_message(self, *a): pass
print("asr local listo en :8765", flush=True)
ThreadingHTTPServer(("127.0.0.1", 8765), H).serve_forever()
