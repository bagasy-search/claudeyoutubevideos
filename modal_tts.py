# modal_tts.py — Chatterbox TTS (voz clonada) serverless en Modal. Reusa gen_tts.py EXACTO
# → output idéntico al local (wav humanizado + _timing.json). El modelo de Chatterbox se cachea
# en un Volume (se baja una sola vez). Voz de referencia horneada en la imagen.
#
# Uso (una vez):   modal deploy modal_tts.py       (opcional; modal run ya funciona)
# Generar:         modal run modal_tts.py --text _tts_test.txt --slug _tts_test
#                  modal run modal_tts.py --text public/guiones/castores.txt --slug castores --lang es
import os
import modal

app = modal.App("reppo-tts")
hf_cache = modal.Volume.from_name("reppo-hf-cache", create_if_missing=True)  # cachea el modelo Chatterbox

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git", "ffmpeg", "libsndfile1")
    .pip_install("chatterbox-tts", "torchaudio")
    .add_local_file("gen_tts.py", "/root/gen_tts.py")
    .add_local_file("public/ref_trevor.wav", "/root/ref_trevor.wav")
)


@app.function(image=image, gpu="L4", volumes={"/cache": hf_cache},
              timeout=1800, scaledown_window=120)
def synthesize(text: str, lang: str = "es", ref: str = "ref_trevor.wav",
               exaggeration: float = 0.5, cfg: float = 0.5, seed: int = 1234):
    """Corre gen_tts.py con el texto dado; devuelve (wav_bytes, timing_json_str)."""
    import subprocess
    os.environ["HF_HOME"] = "/cache"  # modelo Chatterbox cacheado en el Volume
    open("/root/guion.txt", "w", encoding="utf-8").write(text)
    out = "/root/out.wav"
    r = subprocess.run(
        f'cd /root && python gen_tts.py --text guion.txt --out {out} '
        f'--ref /root/{ref} --lang {lang} --exaggeration {exaggeration} --cfg {cfg} --seed {seed}',
        shell=True,
    )
    hf_cache.commit()
    if r.returncode != 0 or not os.path.exists(out):
        raise RuntimeError(f"gen_tts falló (rc={r.returncode})")
    wav = open(out, "rb").read()
    timing = open("/root/out_timing.json", encoding="utf-8").read()
    return wav, timing


@app.local_entrypoint()
def main(text: str, slug: str = None, lang: str = "es", ref: str = "ref_trevor.wav"):
    """Lee el guion local, genera en Modal, y guarda wav + timing en public/."""
    import os.path as p
    slug = slug or p.splitext(p.basename(text))[0]
    guion = open(text, encoding="utf-8").read()
    print(f"→ generando '{slug}' en Modal (lang {lang}, voz {ref})...")
    wav, timing = synthesize.remote(guion, lang=lang, ref=ref)
    os.makedirs("public", exist_ok=True)
    open(f"public/{slug}.wav", "wb").write(wav)
    open(f"public/{slug}_timing.json", "w", encoding="utf-8").write(timing)
    print(f"✓ public/{slug}.wav  +  public/{slug}_timing.json")
