# Foley sincronizado con la imagen (MMAudio, video->audio) en Modal.
#   PYTHONUTF8=1 modal run modal_mmaudio.py --jobs jobs.json --outdir out
# jobs.json = [{"name":"s2_01","video":"<mp4 local>","dur":9,"prompt":"..."}]
import json, os, subprocess, pathlib
import modal

app = modal.App("mmaudio-foley")
vol = modal.Volume.from_name("mmaudio-weights", create_if_missing=True)
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git", "ffmpeg")
    .pip_install("torch==2.5.1", "torchvision==0.20.1", "torchaudio==2.5.1", index_url="https://download.pytorch.org/whl/cu121")
    .run_commands("git clone https://github.com/hkchengrex/MMAudio /MMAudio && cd /MMAudio && pip install -e .")
)
NEG = "speech, talking, voice, human voice, singing, music, narration, whisper, murmur, laughter"

@app.function(image=image, gpu="A10G", volumes={"/cache": vol}, timeout=3600)
def run(jobs: list):
    os.makedirs("/cache/work", exist_ok=True)
    # los pesos se bajan a ./weights y ./ext_weights relativos al cwd → quedan en el volumen
    for d in ("weights", "ext_weights"):
        os.makedirs(f"/cache/{d}", exist_ok=True)
        if not os.path.exists(f"/MMAudio/{d}"): os.symlink(f"/cache/{d}", f"/MMAudio/{d}")
    out = {}
    for j in jobs:
        od = f"/cache/work/o_{j['name']}"
        vid = []
        if j.get("bytes"):
            vp = f"/cache/work/{j['name']}.mp4"; open(vp, "wb").write(j["bytes"]); vid = ["--video", vp]
        r = subprocess.run(["python", "demo.py", "--variant", "large_44k_v2", *vid, "--seed", str(j.get("seed", 42)), "--prompt", j["prompt"],
                            "--negative_prompt", NEG, "--duration", str(j["dur"]), "--cfg_strength", "4.5",
                            "--num_steps", "25", "--output", od, "--skip_video_composite"],
                           cwd="/MMAudio", capture_output=True, text=True)
        fl = list(pathlib.Path(od).glob("*.flac"))
        if not fl:
            print("FALLO", j["name"], r.stderr[-800:]); continue
        out[j["name"]] = fl[0].read_bytes(); print("ok", j["name"])
    vol.commit()
    return out

@app.local_entrypoint()
def main(jobs: str, outdir: str):
    J = json.load(open(jobs, encoding="utf-8"))
    for i, j in enumerate(J):
        if j.get("video"): j["bytes"] = open(j["video"], "rb").read()
        j.setdefault("seed", 42 + i)
    os.makedirs(outdir, exist_ok=True)
    # repartido en 4 contenedores en paralelo
    groups = [J[i::4] for i in range(4)]
    n = 0
    for res in run.map(groups):
        for k, b in res.items():
            open(os.path.join(outdir, k + ".flac"), "wb").write(b); n += 1
    print(f"MEDIDO: {n}/{len(J)} foleys")
