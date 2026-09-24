# modal_clipasr.py — transcribe los CLIPS del vlog (compuerta `check` de agnes_vlog.mjs) en Modal, cuando whisper-1 no está disponible.
#   PYTHONUTF8=1 modal run modal_clipasr.py --scenes S1,S2 --vdir D:/Proyectos/video2-wt/faoliva/vlog/faoliva
# Escribe <escena>/clips/asr_modal.json = {archivo.mp4: texto}. Sólo transcribe los archivos que todavía no tienen entrada.
import os, json, subprocess
import modal

app = modal.App("faoliva-clipasr")
cache = modal.Volume.from_name("reppo-whisper-cache", create_if_missing=True)
image = (modal.Image.from_registry("nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04", add_python="3.11")
         .apt_install("ffmpeg").pip_install("faster-whisper", "requests", "huggingface_hub"))

@app.function(image=image, gpu="L4", volumes={"/cache": cache}, timeout=3600, scaledown_window=60)
def run(items: list, lang: str = "es"):
    from faster_whisper import WhisperModel
    m = WhisperModel("medium", device="cuda", compute_type="float16", download_root="/cache/fw")
    out = {}
    for k, b in items:
        open("/root/a.wav", "wb").write(b)
        segs, _ = m.transcribe("/root/a.wav", language=lang, vad_filter=False, condition_on_previous_text=False)
        out[k] = " ".join(s.text.strip() for s in segs).strip()
    return out

@app.local_entrypoint()
def main(scenes: str, vdir: str):
    todo, where = [], {}
    for S in scenes.split(","):
        cl = f"{vdir}/{S}/clips/"; st = json.load(open(cl + "state.json"))
        P = json.load(open(f"{vdir}/plan_{S}.json", encoding="utf-8")); kf = {c["id"] for c in P["clips"] if c.get("kf")}
        af = cl + "asr_modal.json"; have = json.load(open(af, encoding="utf-8")) if os.path.exists(af) else {}
        for cid, s in st.items():
            if cid in kf or s["file"] in have: continue
            w = cl + "_asr_tmp.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", cl + s["file"], "-vn", "-ac", "1", "-ar", "16000", "-t", str(s["T"]), w], check=True)
            todo.append((f"{S}|{s['file']}", open(w, "rb").read())); where[S] = af
    print("a transcribir:", len(todo))
    if not todo: return
    groups = [todo[i::4] for i in range(4)]
    res = {}
    for r in run.map(groups): res.update(r)
    for S, af in where.items():
        have = json.load(open(af, encoding="utf-8")) if os.path.exists(af) else {}
        for k, t in res.items():
            s2, f = k.split("|")
            if s2 == S: have[f] = t
        json.dump(have, open(af, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("MEDIDO:", len(res), "/", len(todo))
