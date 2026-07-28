# modal_image.py — ComfyUI serverless en Modal (Z-Image Turbo + SDXL RealVisXL Lightning).
# Modelos cacheados en un Volume (se bajan UNA vez, nunca más). Expone la API HTTP de ComfyUI
# como endpoint → tu gen_comfy.mjs funciona SIN cambios apuntando COMFY_HOST a la URL de Modal.
#
# Uso (una vez):   modal run modal_image.py::download_models      # baja modelos al Volume
#                  modal deploy modal_image.py                    # deploya el endpoint
# Luego en la laptop:  $env:COMFY_HOST="https://<...>.modal.run"; node gen_comfy.mjs public/img/lista.json 8
import subprocess, os
import modal

app = modal.App("reppo-image")
vol = modal.Volume.from_name("reppo-image-models", create_if_missing=True)
MODELS = "/models"

# --- extra_model_paths: ComfyUI busca los modelos en el Volume /models ---
EXTRA_PATHS = """reppo:
  base_path: /models
  checkpoints: checkpoints
  unet: unet
  clip: text_encoders
  text_encoders: text_encoders
  vae: vae
"""

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git", "wget", "libgl1", "libglib2.0-0")
    .run_commands(
        "git clone --depth 1 https://github.com/comfyanonymous/ComfyUI /root/ComfyUI",
        "git clone --depth 1 https://github.com/city96/ComfyUI-GGUF /root/ComfyUI/custom_nodes/ComfyUI-GGUF",
        "pip install -r /root/ComfyUI/requirements.txt",
        "pip install -r /root/ComfyUI/custom_nodes/ComfyUI-GGUF/requirements.txt",
        "pip install gguf",
    )
)

HF = "https://huggingface.co"


@app.function(image=image, volumes={MODELS: vol}, timeout=3600)
def download_models():
    """Baja los 4 modelos de HF al Volume (una sola vez, en la fibra de Modal)."""
    def dl(url, dest):
        if os.path.exists(dest) and os.path.getsize(dest) > 100_000_000:
            print("ok (cache):", os.path.basename(dest), flush=True); return True
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        print("bajando:", url, flush=True)
        subprocess.run(f'wget -q --timeout=30 --tries=3 -O "{dest}" "{url}"', shell=True)
        ok = os.path.exists(dest) and os.path.getsize(dest) > 100_000_000
        print("  ->", os.path.basename(dest), os.path.getsize(dest) if os.path.exists(dest) else "FALLO", flush=True)
        if not ok and os.path.exists(dest):
            os.remove(dest)
        return ok

    def dl_any(urls, dest):
        for u in urls:
            if dl(u, dest):
                return True
        print("!! no se pudo bajar", os.path.basename(dest), flush=True)
        return False

    dl(f"{HF}/SG161222/RealVisXL_V5.0_Lightning/resolve/main/RealVisXL_V5.0_Lightning_fp16.safetensors",
       f"{MODELS}/checkpoints/RealVisXL_V5.0_Lightning_fp16.safetensors")
    dl_any([f"{HF}/jayn7/Z-Image-Turbo-GGUF/resolve/main/z_image_turbo-Q4_K_M.gguf",
            f"{HF}/unsloth/Z-Image-Turbo-GGUF/resolve/main/z-image-turbo-Q4_K_M.gguf"],
           f"{MODELS}/unet/z-image-turbo-q4_k_m.gguf")
    dl_any([f"{HF}/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf"],
           f"{MODELS}/text_encoders/Qwen3-4B-Q4_K_M.gguf")
    dl_any([f"{HF}/gguf-org/z-image-gguf/resolve/main/ae.safetensors",
            f"{HF}/Comfy-Org/Lumina_Image_2.0_Repackaged/resolve/main/split_files/vae/ae.safetensors"],
           f"{MODELS}/vae/ae.safetensors")
    vol.commit()
    print("=== modelos cacheados en el Volume ===")
    for r, _, fs in os.walk(MODELS):
        for f in fs:
            print(os.path.join(r, f), os.path.getsize(os.path.join(r, f)))


@app.function(image=image, volumes={MODELS: vol}, gpu="L4", timeout=1800, scaledown_window=60, max_containers=1)
@modal.concurrent(max_inputs=8)
@modal.web_server(8188, startup_timeout=300)
def comfyui():
    """ComfyUI corriendo; Modal expone el puerto 8188 como HTTPS. Drop-in para gen_comfy.mjs."""
    open("/root/ComfyUI/extra_model_paths.yaml", "w").write(EXTRA_PATHS)  # apunta ComfyUI al Volume
    subprocess.Popen(
        "cd /root/ComfyUI && python main.py --listen 0.0.0.0 --port 8188 --highvram",
        shell=True,
    )
