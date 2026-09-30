# Cama musical instrumental con MusicGen en Modal (sin voz). modal run vlog/tdchinca/modal_musicgen.py --out out/tdchinca/music
import modal, os
app = modal.App("tdchinca-musicgen")
cache = modal.Volume.from_name("reppo-whisper-cache", create_if_missing=True)
image = modal.Image.debian_slim(python_version="3.11").apt_install("ffmpeg").pip_install("torch", "transformers==4.44.2", "scipy", "numpy<2", "accelerate")

PROMPTS = [
 "warm upbeat acoustic folk instrumental, fingerpicked acoustic guitar, light hand percussion shaker, soft upright bass, cheerful DIY workshop vibe, steady groove, no vocals",
 "relaxed positive acoustic guitar strumming, light claps and shaker, mellow ukulele, homey handmade feeling, medium tempo, instrumental, no vocals",
 "gentle curious acoustic instrumental, plucked guitar and marimba, soft brushes on drums, warm and optimistic, steady, no vocals",
]

@app.function(image=image, gpu="A10G", volumes={"/cache": cache}, timeout=1800)
def gen(i_prompt):
    i, prompt = i_prompt
    import torch, numpy as np, scipy.io.wavfile as wf
    from transformers import AutoProcessor, MusicgenForConditionalGeneration
    proc = AutoProcessor.from_pretrained("facebook/musicgen-medium", cache_dir="/cache/hf")
    m = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-medium", cache_dir="/cache/hf").to("cuda").half()
    inp = proc(text=[prompt], padding=True, return_tensors="pt").to("cuda")
    out = m.generate(**inp, do_sample=True, guidance_scale=3.0, max_new_tokens=1500)  # ~30 s
    a = out[0, 0].float().cpu().numpy(); sr = m.config.audio_encoder.sampling_rate
    import io; b = io.BytesIO(); wf.write(b, sr, (np.clip(a, -1, 1) * 32767).astype(np.int16)); return i, b.getvalue()

@app.local_entrypoint()
def main(out: str):
    os.makedirs(out, exist_ok=True)
    jobs = [(i * 10 + k, p) for i, p in enumerate(PROMPTS) for k in range(2)]
    for i, wav in gen.map(jobs):
        open(os.path.join(out, f"m{i:02d}.wav"), "wb").write(wav); print("ok", i)
