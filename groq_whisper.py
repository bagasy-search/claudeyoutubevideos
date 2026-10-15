# groq_whisper.py — reemplazo de modal_whisper para la compuerta de voz por bloque (14-oct-2026).
# El dueño: "nada de Modal; las transcripciones van por Groq (gratis y más preciso)".
# Misma interfaz que usa backfire_tts_gate.py:
#     with mw.app.run():
#         res = mw.transcribe.map([bytes_wav, ...], kwargs={"lang": "en"}, return_exceptions=True)
# Une todos los bloques en UN audio (con 1,5 s de silencio entre bloques) → UN solo pedido a Groq
# (scripts/asr_groq.py, sólo claves GROQ_FREE_KEY_*) → reparte las palabras por bloque según su tiempo.
# Un bloque vacío (b"") devuelve una excepción en su lugar, igual que antes.
import contextlib, json, os, subprocess, sys, tempfile, uuid

GAP = 1.5
ROOT = os.path.dirname(os.path.abspath(__file__))


class _App:
    def run(self):
        return contextlib.nullcontext()


app = _App()


def _dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                capture_output=True, text=True, check=True).stdout.strip())


class _Transcribe:
    def map(self, datas, kwargs=None, return_exceptions=False):
        lang = (kwargs or {}).get("lang", "en")
        tmp = tempfile.mkdtemp(prefix="groqgate_")
        tramos, partes = [], []          # tramos[i] = (inicio, fin) en el audio unido, o None
        t = 0.0
        sil = os.path.join(tmp, "sil.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=16000:cl=mono",
                        "-t", str(GAP), "-c:a", "pcm_s16le", sil], check=True)
        for i, d in enumerate(datas):
            if not d:
                tramos.append(None); continue
            src, w = os.path.join(tmp, f"in{i}.wav"), os.path.join(tmp, f"b{i}.wav")
            open(src, "wb").write(d)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", "16000",
                            "-c:a", "pcm_s16le", w], check=True)
            dur = _dur(w)
            tramos.append((t, t + dur)); partes += [w, sil]; t += dur + GAP
        res = [RuntimeError("wav vacío") for _ in datas]
        if partes:
            lista = os.path.join(tmp, "lista.txt")
            open(lista, "w", encoding="utf-8").write("".join(f"file '{p.replace(chr(92), '/')}'\n" for p in partes))
            todo, caps_out = os.path.join(tmp, "todo.wav"), os.path.join(tmp, "caps.json")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista,
                            "-c:a", "pcm_s16le", todo], check=True)
            r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "asr_groq.py"), f"gate{uuid.uuid4().hex[:4]}",
                                lang, "--wav", todo, "--out", caps_out], cwd=ROOT, capture_output=True, text=True,
                               env={**os.environ, "PYTHONUTF8": "1"})
            if r.returncode != 0 or not os.path.exists(caps_out):
                err = RuntimeError("Groq falló: " + (r.stderr or r.stdout)[-300:])
                if not return_exceptions: raise err
                return [err for _ in datas]
            caps = json.load(open(caps_out, encoding="utf-8"))
            for i, tr in enumerate(tramos):
                if tr is None: continue
                a, b = tr
                res[i] = [c for c in caps if a - 0.3 <= (c["startMs"] + c["endMs"]) / 2000 < b + GAP / 2]
        if not return_exceptions:
            for x in res:
                if isinstance(x, Exception): raise x
        return res


transcribe = _Transcribe()
