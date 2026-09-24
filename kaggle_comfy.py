# kaggle_comfy.py — Levanta ComfyUI en Kaggle (GPU T4 gratis) con los 2 motores del
# pipeline video2 (RealVisXL Lightning + Z-Image Turbo GGUF) y lo expone por un tunel
# cloudflared. Copia TODO esto en UNA celda de un notebook de Kaggle (GPU T4 x2) y "Run".
# Al final imprime una URL https://xxxx.trycloudflare.com  -> esa es tu COMFY_HOST.
#
# En tu laptop, luego:   set COMFY_HOST=https://xxxx.trycloudflare.com
#                        node gen_comfy.mjs public/img/prompts.json 6
# ----------------------------------------------------------------------------------
import os, subprocess, threading, time, urllib.request, sys

ROOT = "/kaggle/working/ComfyUI"
def sh(cmd, **kw):
    print(">>", cmd); return subprocess.run(cmd, shell=True, check=False, **kw)

# 1) ComfyUI + nodo GGUF (para Z-Image) -------------------------------------------
if not os.path.isdir(ROOT):
    sh("git clone --depth 1 https://github.com/comfyanonymous/ComfyUI " + ROOT)
sh(f"git -C {ROOT}/custom_nodes clone --depth 1 https://github.com/city96/ComfyUI-GGUF || true")
sh(f"pip -q install -r {ROOT}/requirements.txt")
sh(f"pip -q install -r {ROOT}/custom_nodes/ComfyUI-GGUF/requirements.txt || true")
sh("pip -q install gguf")

# 2) Modelos (descarga de HuggingFace; rapido en la fibra de Kaggle) --------------
def dl(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 1_000_000:
        print("ok (cache):", dest); return True
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    r = sh(f'wget -q --show-progress -O "{dest}" "{url}"')
    if os.path.exists(dest) and os.path.getsize(dest) > 1_000_000:
        return True
    if os.path.exists(dest): os.remove(dest)
    return False

HF = "https://huggingface.co"
def dl_any(urls, dest):
    for u in urls:
        if dl(u, dest): return True
    print("!! NO se pudo bajar:", dest); return False

dl(f"{HF}/SG161222/RealVisXL_V5.0_Lightning/resolve/main/RealVisXL_V5.0_Lightning_fp16.safetensors",
   f"{ROOT}/models/checkpoints/RealVisXL_V5.0_Lightning_fp16.safetensors")
dl_any([f"{HF}/gguf-org/z-image-gguf/resolve/main/z-image-turbo-q4_k_m.gguf",
        f"{HF}/jayn7/Z-Image-Turbo-GGUF/resolve/main/z-image-turbo-q4_k_m.gguf",
        f"{HF}/felipedpm/z-image-turbo-GGUF-confyui/resolve/main/z-image-turbo-q4_k_m.gguf"],
       f"{ROOT}/models/unet/z-image-turbo-q4_k_m.gguf")
dl_any([f"{HF}/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf",
        f"{HF}/Qwen/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf"],
       f"{ROOT}/models/text_encoders/Qwen3-4B-Q4_K_M.gguf")

# VAE flux/lumina (ae.safetensors, 320MB) — probamos varios mirrors no-gated
for u in [f"{HF}/gguf-org/z-image-gguf/resolve/main/ae.safetensors",
          f"{HF}/Comfy-Org/Lumina_Image_2.0_Repackaged/resolve/main/split_files/vae/ae.safetensors",
          f"{HF}/black-forest-labs/FLUX.1-schnell/resolve/main/ae.safetensors"]:
    if dl(u, f"{ROOT}/models/vae/ae.safetensors"): break

# 3) cloudflared (tunel publico, sin login) ---------------------------------------
sh("wget -q -O /usr/bin/cloudflared "
   "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 "
   "&& chmod +x /usr/bin/cloudflared")

# 4) Lanzar ComfyUI en background --------------------------------------------------
def run_comfy():
    sh(f"cd {ROOT} && python main.py --listen 0.0.0.0 --port 8188 --highvram")
threading.Thread(target=run_comfy, daemon=True).start()

# esperar a que ComfyUI responda
for _ in range(120):
    try:
        urllib.request.urlopen("http://127.0.0.1:8188/system_stats", timeout=2); break
    except Exception: time.sleep(2)
print("ComfyUI arriba.")

# 5) Abrir tunel e imprimir la URL -------------------------------------------------
proc = subprocess.Popen(["cloudflared", "tunnel", "--url", "http://127.0.0.1:8188",
                         "--no-autoupdate"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                        text=True, bufsize=1)
url = None
for line in proc.stdout:
    print(line, end="")
    if "trycloudflare.com" in line and "https://" in line and not url:
        import re; m = re.search(r"https://[a-z0-9-]+\.trycloudflare\.com", line)
        if m:
            url = m.group(0)
            print("\n" + "=" * 70 + f"\n  COMFY_HOST = {url}\n" + "=" * 70 + "\n")
# mantener vivo
proc.wait()
