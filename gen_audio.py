# gen_audio.py — genera MÚSICA o EFECTOS DE SONIDO con Stable Audio Open (local, GPU).
# Licencia Stability Community (uso comercial OK para creadores < $1M/año).
#   audioenv\Scripts\python gen_audio.py --prompt "waterfall flowing in a forest" --out public/sfx/cascada.wav --secs 8
import argparse, os, torch, soundfile as sf
from diffusers import StableAudioPipeline

ap = argparse.ArgumentParser()
ap.add_argument("--prompt", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--secs", type=float, default=8.0)
ap.add_argument("--steps", type=int, default=100)
ap.add_argument("--neg", default="low quality, distorted, muffled")
ap.add_argument("--seed", type=int, default=0)
a = ap.parse_args()

dev = "cuda" if torch.cuda.is_available() else "cpu"
pipe = StableAudioPipeline.from_pretrained("stabilityai/stable-audio-open-1.0",
        torch_dtype=torch.float16 if dev == "cuda" else torch.float32)
pipe = pipe.to(dev)
g = torch.Generator(dev).manual_seed(a.seed)
audio = pipe(prompt=a.prompt, negative_prompt=a.neg, num_inference_steps=a.steps,
             audio_end_in_s=a.secs, num_waveforms_per_prompt=1, generator=g).audios
wav = audio[0].T.float().cpu().numpy()
os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
sf.write(a.out, wav, pipe.vae.config.sampling_rate)
print(f"OK -> {a.out} | {wav.shape[0]/pipe.vae.config.sampling_rate:.1f}s @ {pipe.vae.config.sampling_rate}Hz")
