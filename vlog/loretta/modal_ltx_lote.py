"""Lote LTX-2.5 en Modal (H100): el modelo se carga UNA vez por llamada y genera N clips.
  a2v  = a2vid_two_stage (checkpoint DEV + distilled-lora): la VOZ Y LOS LABIOS salen del audio exacto del tramo (--audio-path).
  i2v  = distilled imagen->video (mudos, con su audio/foley propio).
Uso (desde la raíz del worktree):
  PYTHONUTF8=1 modal run vlog/lorham/ltx/modal_ltx_lote.py --step dl
  PYTHONUTF8=1 modal run vlog/lorham/ltx/modal_ltx_lote.py --step a2v --lista _v3/ltx_a2v.json --out vlog/lorham/ltx/out
  PYTHONUTF8=1 modal run vlog/lorham/ltx/modal_ltx_lote.py --step i2v --lista _v3/ltx_i2v.json --out vlog/lorham/ltx/out
lista = [{id, image, audio?, prompt, seed?, frames?}] (rutas locales)."""
import json, os, subprocess, sys, time
import modal

app = modal.App("ltx25-lote-loretta")
vol = modal.Volume.from_name("ltx25-weights")
image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("git", "ffmpeg", "curl", "build-essential")
    .pip_install("uv", "huggingface_hub[hf_transfer]")
    .run_commands("git clone https://github.com/Lightricks/LTX-2 /opt/ltx && cd /opt/ltx && (uv sync --frozen || uv sync)")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)
REPO = "comfyicu/LTX-2.5"
M = "/w/ltx-2.5"
DEV = f"{M}/diffusion_models/ltx-2.5-22b-dev-transformer-bf16.safetensors"
DIST = f"{M}/diffusion_models/ltx-2.5-22b-distilled-transformer-bf16.safetensors"
LORA = f"{M}/loras/ltx-2.5-22b-distilled-lora-450-bf16.safetensors"
COMMON = ["--text-encoder-path", f"{M}/text_encoders/gemma4-12b-with-proj-ltx-2.5-bf16.safetensors",
          "--video-vae-path", f"{M}/vae/ltx-2.5-video-vae-bf16.safetensors",
          "--audio-vae-path", f"{M}/vae/ltx-2.5-audio-vae-bf16.safetensors",
          "--spatial-upsampler-path", f"{M}/latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors",
          "--duration-head-path", f"{M}/model_patches/ltx-2.5-duration-head-bf16.safetensors",
          "--width", "1024", "--height", "576", "--output-path", "/tmp/x.mp4"]


@app.function(image=image, volumes={"/w": vol}, timeout=3600)
def download():
    from huggingface_hub import hf_hub_download
    t = time.time()
    for f in ["diffusion_models/ltx-2.5-22b-dev-transformer-bf16.safetensors", "loras/ltx-2.5-22b-distilled-lora-450-bf16.safetensors"]:
        hf_hub_download(REPO, f, local_dir=M)
    vol.commit()
    return time.time() - t


def _write(shots):
    os.makedirs("/w/in", exist_ok=True)
    for s in shots:
        open(f"/tmp/{s['id']}.png", "wb").write(s["img"])
        if s.get("audio"): open(f"/tmp/{s['id']}.wav", "wb").write(s["audio"])


@app.function(image=image, volumes={"/w": vol}, timeout=7200, gpu="H100")
def a2v(shots: list, offload: str = ""):
    sys.path.insert(0, "/opt/ltx/packages/ltx-pipelines/src"); sys.path.insert(0, "/opt/ltx/packages/ltx-core/src")
    os.chdir("/opt/ltx")
    code = r'''
import json, logging, os, sys, time, torch
from ltx_core.components.guiders import MultiModalGuiderParams
from ltx_core.model.video_vae import AUTO_TILING, get_video_chunks_number
from ltx_pipelines.a2vid_two_stage import A2VidPipelineTwoStage, build_a2vid_arg_parser
from ltx_pipelines.chunks import pipeline_output_from_chunks
from ltx_pipelines.utils.args import add_chunk_layout_args, add_generated_keyframes_arg, add_keyframe_decode_arg, resolve_cli_params
from ltx_pipelines.utils.media_io import encode_video
logging.basicConfig(level=logging.WARNING)
cfg = json.load(open("/tmp/cfg.json")); BASE = cfg["base"]
sys.argv = ["x"] + BASE + ["--prompt", "x", "--audio-path", "/tmp/a.wav"]
params = resolve_cli_params()
parser = add_chunk_layout_args(add_keyframe_decode_arg(add_generated_keyframes_arg(build_a2vid_arg_parser(params))))
a0 = parser.parse_args(BASE + ["--prompt", "x", "--audio-path", "/tmp/a.wav"])
t = time.time()
pipe = A2VidPipelineTwoStage(model_paths=a0.model_paths, distilled_lora=a0.distilled_lora, spatial_upsampler_path=a0.spatial_upsampler_path, loras=(), quantization=a0.quantization,
    compilation_config=a0.compile, offload_mode=a0.offload_mode, diffvae_optimization=a0.diffvae_optimization)
print("LOAD", round(time.time() - t, 1), flush=True)
res = []
with torch.inference_mode():
    for s in cfg["shots"]:
        out = f"/tmp/out_{s['id']}.mp4"
        a = parser.parse_args(BASE + ["--prompt", s["prompt"], "--image", f"/tmp/{s['id']}.png", "0", "1.0", "--audio-path", f"/tmp/{s['id']}.wav", "--audio-max-duration", str(s["dur"]), "--seed", str(s.get("seed", 42))])
        t = time.time()
        vgp = MultiModalGuiderParams(cfg_scale=a.video_cfg_guidance_scale, stg_scale=a.video_stg_guidance_scale, rescale_scale=a.video_rescale_scale, modality_scale=a.a2v_guidance_scale, skip_step=a.video_skip_step, stg_blocks=a.video_stg_blocks)
        chunks, nf, tc = pipe.stream_chunks(prompt=a.prompt, negative_prompt=a.negative_prompt, seed=a.seed, height=a.height, width=a.width, num_frames=None, frame_rate=a.frame_rate,
            num_inference_steps=a.num_inference_steps, video_guider_params=vgp, images=a.images, audio_path=a.audio_path, audio_max_duration=s["dur"], tiling_config=AUTO_TILING, max_batch_size=a.max_batch_size)
        r = pipeline_output_from_chunks(chunks, num_frames=nf, tiling_config=tc)
        encode_video(video=r.video, fps=a.frame_rate, audio=r.audio, output_path=out, video_chunks_number=get_video_chunks_number(r.num_frames, r.tiling_config))
        res.append({"id": s["id"], "frames": nf, "secs": round(time.time() - t, 1)}); print("CLIP", res[-1], flush=True)
print("BATCH_DONE", flush=True)
'''
    base = ["--transformer-path", DEV, "--distilled-lora", LORA, "1.0"] + COMMON + (["--offload-mode", offload] if offload else [])
    _write(shots)
    open("/tmp/a.wav", "wb").write(shots[0]["audio"])
    json.dump({"base": base, "shots": [{k: v for k, v in s.items() if k not in ("img", "audio")} for s in shots]}, open("/tmp/cfg.json", "w"))
    open("/tmp/run.py", "w").write(code)
    t = time.time()
    p = subprocess.run(["bash", "-lc", "cd /opt/ltx && uv run python /tmp/run.py"], capture_output=True, text=True)
    outs = {s["id"]: open(f"/tmp/out_{s['id']}.mp4", "rb").read() for s in shots if os.path.exists(f"/tmp/out_{s['id']}.mp4")}
    return {"rc": p.returncode, "secs": time.time() - t, "stdout": p.stdout[-3000:], "stderr": p.stderr[-5000:], "mp4": outs}


@app.function(image=image, volumes={"/w": vol}, timeout=7200, gpu="H100")
def i2v(shots: list):
    os.chdir("/opt/ltx")
    code = r'''
import json, logging, os, sys, time, torch
from ltx_core.model.video_vae import AUTO_TILING, get_video_chunks_number
from ltx_pipelines.chunks import pipeline_output_from_chunks
from ltx_pipelines.distilled import DistilledPipeline
from ltx_pipelines.utils.args import (add_chunk_layout_args, add_generated_keyframes_arg, add_keyframe_decode_arg, default_2_stage_distilled_arg_parser, resolve_cli_params)
from ltx_pipelines.utils.media_io import encode_video
logging.basicConfig(level=logging.WARNING)
cfg = json.load(open("/tmp/cfg.json")); BASE = cfg["base"]
sys.argv = ["x"] + BASE + ["--prompt", "x"]
params = resolve_cli_params(distilled=True)
parser = add_chunk_layout_args(add_keyframe_decode_arg(add_generated_keyframes_arg(default_2_stage_distilled_arg_parser(params=params, supports_auto_duration=True))))
a0 = parser.parse_args(BASE + ["--prompt", "x"])
t = time.time()
pipe = DistilledPipeline(model_paths=a0.model_paths, spatial_upsampler_path=a0.spatial_upsampler_path, loras=(), quantization=a0.quantization, compilation_config=a0.compile,
    offload_mode=a0.offload_mode, diffvae_optimization=a0.diffvae_optimization)
print("LOAD", round(time.time() - t, 1), flush=True)
res = []
with torch.inference_mode():
    for s in cfg["shots"]:
        out = f"/tmp/out_{s['id']}.mp4"
        a = parser.parse_args(BASE + ["--prompt", s["prompt"], "--image", f"/tmp/{s['id']}.png", "0", "1.0", "--num-frames", str(s["frames"]), "--seed", str(s.get("seed", 42))])
        t = time.time()
        chunks, nf, tc = pipe.stream_chunks(prompt=a.prompt, seed=a.seed, height=a.height, width=a.width, num_frames=a.num_frames, frame_rate=a.frame_rate, images=a.images, tiling_config=AUTO_TILING)
        r = pipeline_output_from_chunks(chunks, num_frames=nf, tiling_config=tc)
        encode_video(video=r.video, fps=a.frame_rate, audio=r.audio, output_path=out, video_chunks_number=get_video_chunks_number(r.num_frames, r.tiling_config))
        res.append({"id": s["id"], "frames": nf, "secs": round(time.time() - t, 1)}); print("CLIP", res[-1], flush=True)
print("BATCH_DONE", flush=True)
'''
    base = ["--transformer-path", DIST] + COMMON
    _write(shots)
    json.dump({"base": base, "shots": [{k: v for k, v in s.items() if k not in ("img", "audio")} for s in shots]}, open("/tmp/cfg.json", "w"))
    open("/tmp/run.py", "w").write(code)
    t = time.time()
    p = subprocess.run(["bash", "-lc", "cd /opt/ltx && uv run python /tmp/run.py"], capture_output=True, text=True)
    outs = {s["id"]: open(f"/tmp/out_{s['id']}.mp4", "rb").read() for s in shots if os.path.exists(f"/tmp/out_{s['id']}.mp4")}
    return {"rc": p.returncode, "secs": time.time() - t, "stdout": p.stdout[-3000:], "stderr": p.stderr[-5000:], "mp4": outs}


@app.local_entrypoint()
def main(step: str = "dl", lista: str = "", out: str = "vlog/lorham/ltx/out", ids: str = "", offload: str = ""):
    os.makedirs(out, exist_ok=True)
    if step == "dl":
        print("download s:", download.remote()); return
    shots = json.load(open(lista))
    if ids: shots = [s for s in shots if s["id"] in ids.split(",")]
    shots = [s for s in shots if not os.path.exists(f"{out}/{s['id']}.mp4")]
    for s in shots:
        s["img"] = open(s.pop("image"), "rb").read()
        if s.get("audio"): s["audio"] = open(s["audio"], "rb").read()
    print(step, len(shots), "clips")
    r = (a2v.remote(shots, offload) if step == "a2v" else i2v.remote(shots))
    print("rc", r["rc"], "s", round(r["secs"], 1)); print(r["stdout"]); print(r["stderr"][-2500:])
    for k, v in r["mp4"].items():
        open(f"{out}/{k}.mp4", "wb").write(v); print("saved", k, len(v))
