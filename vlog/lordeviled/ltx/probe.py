import modal, subprocess
app = modal.App("ltx25-probe")
vol = modal.Volume.from_name("ltx25-weights")
image = (modal.Image.debian_slim(python_version="3.12").apt_install("git", "ffmpeg", "curl").pip_install("uv", "huggingface_hub[hf_transfer]")
         .run_commands("git clone https://github.com/Lightricks/LTX-2 /opt/ltx && cd /opt/ltx && uv sync --frozen || (cd /opt/ltx && uv sync)"))
@app.function(image=image, volumes={"/w": vol}, timeout=900)
def h():
    r = subprocess.run(["bash", "-lc", "find /w -type f | head -40; du -sh /w; cd /opt/ltx && ls packages/ltx-pipelines/src/ltx_pipelines/ && uv run python -m ltx_pipelines.a2vid_two_stage --help 2>&1 | tail -80"], capture_output=True, text=True)
    return r.stdout + r.stderr
@app.local_entrypoint()
def main(): print(h.remote())
