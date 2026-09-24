# modal_batch.py — Genera imágenes en Modal con FAN-OUT: reparte los prompts en hasta 10 GPUs
# en paralelo. 300 imágenes en ~2-6 min. Al terminar, los contenedores se apagan solos (nada vivo).
# Mismos grafos/calidad que gen_comfy.mjs (SDXL RealVisXL Lightning + Z-Image Turbo).
#
#   modal run modal_batch.py --list public/img/prompts.json
import subprocess, os, json, time, zlib, urllib.request, urllib.parse
import modal

app = modal.App("reppo-batch")
vol = modal.Volume.from_name("reppo-image-models")
MODELS = "/models"

NEG = "cinematic, dramatic lighting, film still, professional photography, cgi, 3d render, illustration, painting, oversaturated, hdr, text, watermark, logo, caption, deformed hands, extra fingers, mutated, blurry, lowres, jpeg artifacts"
EXTRA_PATHS = "reppo:\n  base_path: /models\n  checkpoints: checkpoints\n  unet: unet\n  clip: text_encoders\n  text_encoders: text_encoders\n  vae: vae\n"

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


def gSDXL(p, seed, w=1024, h=576):
    return {"1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "RealVisXL_V5.0_Lightning_fp16.safetensors"}},
            "4": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["1", 1], "text": p}},
            "5": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["1", 1], "text": NEG}},
            "6": {"class_type": "EmptyLatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
            "7": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0], "latent_image": ["6", 0], "seed": seed, "steps": 6, "cfg": 1.5, "sampler_name": "dpmpp_sde", "scheduler": "karras", "denoise": 1.0}},
            "8": {"class_type": "VAEDecode", "inputs": {"samples": ["7", 0], "vae": ["1", 2]}},
            "9": {"class_type": "SaveImage", "inputs": {"images": ["8", 0], "filename_prefix": "cg"}}}


def gZ(p, seed, w=1024, h=576):
    return {"1": {"class_type": "UnetLoaderGGUF", "inputs": {"unet_name": "z-image-turbo-q4_k_m.gguf"}},
            "2": {"class_type": "CLIPLoaderGGUF", "inputs": {"clip_name": "Qwen3-4B-Q4_K_M.gguf", "type": "lumina2"}},
            "3": {"class_type": "VAELoader", "inputs": {"vae_name": "ae.safetensors"}},
            "4": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": p}},
            "5": {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": NEG}},
            "6": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
            "7": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0], "latent_image": ["6", 0], "seed": seed, "steps": 8, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
            "8": {"class_type": "VAEDecode", "inputs": {"samples": ["7", 0], "vae": ["3", 0]}},
            "9": {"class_type": "SaveImage", "inputs": {"images": ["8", 0], "filename_prefix": "cg"}}}


@app.cls(image=image, volumes={MODELS: vol}, gpu="L4", max_containers=10, scaledown_window=30, timeout=1800)
@modal.concurrent(max_inputs=1)
class ComfyGen:
    @modal.enter()
    def start(self):
        open("/root/ComfyUI/extra_model_paths.yaml", "w").write(EXTRA_PATHS)
        subprocess.Popen("cd /root/ComfyUI && python main.py --listen 127.0.0.1 --port 8188 --highvram", shell=True)
        for _ in range(180):
            try:
                urllib.request.urlopen("http://127.0.0.1:8188/system_stats", timeout=2); break
            except Exception:
                time.sleep(2)

    @modal.method()
    def generate(self, spec):
        HOST = "http://127.0.0.1:8188"
        seed = 1000 + zlib.crc32(spec["name"].encode()) % 1_000_000
        w, h = int(spec.get("w", 1024)), int(spec.get("h", 576))
        g = gZ(spec["prompt"], seed, w, h) if spec.get("engine") == "z" else gSDXL(spec["prompt"], seed, w, h)
        d = json.dumps({"prompt": g}).encode()
        pid = json.load(urllib.request.urlopen(urllib.request.Request(HOST + "/prompt", d, {"Content-Type": "application/json"}), timeout=30))["prompt_id"]
        for _ in range(400):
            time.sleep(0.5)
            e = json.load(urllib.request.urlopen(HOST + "/history/" + pid, timeout=10)).get(pid)
            if not e:
                continue
            for n in (e.get("outputs") or {}).values():
                if n.get("images"):
                    img = n["images"][0]
                    q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img.get("subfolder", ""), "type": img.get("type", "output")})
                    return (spec["name"], urllib.request.urlopen(HOST + "/view?" + q, timeout=60).read())
            if e.get("status", {}).get("status_str") == "error":
                return (spec["name"], None)
        return (spec["name"], None)


@app.local_entrypoint()
def main(list: str, out: str = "public/img"):
    items = [p for p in json.load(open(list, encoding="utf-8"))
             if p.get("name") and p.get("prompt") and not os.path.exists(os.path.join(out, p["name"] + ".png"))]
    items.sort(key=lambda p: p.get("engine", "sdxl"))  # agrupa por motor → menos recargas de modelo
    print(f"{len(items)} por generar · fan-out hasta 10 GPUs...")
    if not items:
        return
    os.makedirs(out, exist_ok=True)
    t0 = time.time()
    ok = fail = 0
    for name, data in ComfyGen().generate.map(items, order_outputs=False):
        if data:
            open(os.path.join(out, name + ".png"), "wb").write(data); ok += 1
        else:
            fail += 1
        print(f"  {'ok' if data else 'FALLO'} {name}  [{ok + fail}/{len(items)}]")
    print(f"=== {ok} ok / {fail} fallos en {(time.time() - t0) / 60:.1f} min ===")
