import sys, os, shutil
from huggingface_hub import hf_hub_download as h
R = "Comfy-Org/MiniMax-H3"; M = "/opt/h3"
G = {"chicos": ["vae/minimax_h3_audio_vae_fp32.safetensors", "vae/minimax_h3_video_vae_int8_convrot.safetensors",
                "loras/pika_h3_flex_ref2va_v1_bf16.safetensors", "loras/pika_h3_flex_fl2va_v1_bf16.safetensors",
                "loras/minimax_h3_ref2v_turbo_4step_v0.1_comfyui_bf16.safetensors"],
     "te": ["text_encoders/qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors"],
     "ref": ["diffusion_models/minimax_h3_ref2va_pruned_int8_convrot.safetensors"],
     "fl": ["diffusion_models/minimax_h3_fl2va_pruned_int8_convrot.safetensors"]}
for f in G[sys.argv[1]]: h(R, f, local_dir=M); print("ok", f, flush=True)
shutil.rmtree(f"{M}/.cache", ignore_errors=True); shutil.rmtree("/root/.cache/huggingface", ignore_errors=True)
