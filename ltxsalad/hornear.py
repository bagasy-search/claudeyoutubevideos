# baja los pesos que entran en la imagen y apaga keyframes en el NVFP4 (sin eso: meta tensor + OOM)
import json, struct, os
from huggingface_hub import hf_hub_download as h
M = "/w/ltx-2.5"
for f in ["vae/ltx-2.5-video-vae-conv-bf16.safetensors", "vae/ltx-2.5-audio-vae-bf16.safetensors",
          "latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors", "model_patches/ltx-2.5-duration-head-bf16.safetensors"]:
    h("comfyicu/LTX-2.5", f, local_dir=M)
h("vonkaiser/LTX-2.5-FP8-NVFP4", "diffusion_models/ltx-2.5-22b-distilled-transformer-nvfp4.safetensors", local_dir=M)
SRC = f"{M}/diffusion_models/ltx-2.5-22b-distilled-transformer-nvfp4.safetensors"
OUT = SRC.replace(".safetensors", "-nokf.safetensors")
f = open(SRC, "r+b"); n = struct.unpack("<Q", f.read(8))[0]; hd = json.loads(f.read(n))
m = hd["__metadata__"]; c = json.loads(m["config"]); t = c.get("transformer", c)
for k in list(t):
    if "keyframes_abs_pos" in k: t[k] = False
m["config"] = json.dumps(c, separators=(",", ":"))
b = json.dumps(hd, separators=(",", ":")).encode()
assert len(b) <= n, "header no entra"
f.seek(8); f.write(b + b" " * (n - len(b))); f.close(); os.rename(SRC, OUT)
os.system(f"rm -rf {M}/.cache")
print("HORNEADO_OK")
