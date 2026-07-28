# gui_tts.py — Interfaz web (Gradio) para clonar voz con Chatterbox, reusando gen_tts.py.
# Elegís una voz de referencia (o subís la tuya), escribís el texto, y genera el wav.
# Lanzar:  ttsenv\Scripts\python gui_tts.py   → abre http://127.0.0.1:7863
import os, sys, subprocess, tempfile, glob, time
import gradio as gr

ROOT = os.path.dirname(os.path.abspath(__file__))
PY = os.path.join(ROOT, "ttsenv", "Scripts", "python.exe")
GEN = os.path.join(ROOT, "gen_tts.py")
OUTDIR = os.path.join(ROOT, "public")

# voces de referencia disponibles (public/ref_*.wav)
def ref_voices():
    vs = {}
    for f in sorted(glob.glob(os.path.join(OUTDIR, "ref_*.wav"))):
        name = os.path.basename(f).replace("ref_", "").replace(".wav", "")
        vs[name] = f
    return vs

VOICES = ref_voices()
LABELS = {"anciana": "👵 Abuela (anciana)", "tomas": "👨 Tomás", "tomas_r": "👨 Tomás (r)", "claudio": "🧔 Claudio", "trevor": "🇬🇧 Trevor (EN)"}
CHOICES = [(LABELS.get(k, k), k) for k in VOICES] + [("⬆️ Subir mi propia voz…", "__upload__")]

def generar(texto, voz_sel, voz_subida, lang, exageracion, cfg, seed):
    if not texto or not texto.strip():
        raise gr.Error("Escribí algún texto para generar.")
    ref = voz_subida if voz_sel == "__upload__" else VOICES.get(voz_sel)
    if not ref or not os.path.exists(ref):
        raise gr.Error("Elegí una voz de referencia (o subí un audio de ~10-30s).")
    ts = str(int(time.time()))
    txt_tmp = os.path.join(tempfile.gettempdir(), f"gui_tts_{ts}.txt")
    out_wav = os.path.join(OUTDIR, f"gui_voz_{ts}.wav")
    with open(txt_tmp, "w", encoding="utf-8") as fh:
        fh.write(texto)
    cmd = [PY, GEN, "--text", txt_tmp, "--out", out_wav, "--ref", ref,
           "--lang", lang, "--exaggeration", str(exageracion), "--cfg", str(cfg), "--seed", str(int(seed))]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(out_wav):
        raise gr.Error("Falló la generación:\n" + (r.stderr or r.stdout or "")[-800:])
    return out_wav, f"✅ Listo → {out_wav}"

with gr.Blocks(title="Clonar voz — Abuela Rosa / Chatterbox", theme=gr.themes.Soft()) as app:
    gr.Markdown("## 🎙️ Clonar voz (Chatterbox · local · gratis)\nElegí una voz, escribí el texto y generá. La voz sale con pausas, respiros y volumen ya horneados.")
    with gr.Row():
        with gr.Column(scale=3):
            texto = gr.Textbox(label="Texto a decir", lines=10, placeholder="Pegá acá el guion… (separá párrafos con una línea en blanco para pausas largas)")
        with gr.Column(scale=2):
            voz = gr.Dropdown(choices=CHOICES, value=(CHOICES[0][1] if CHOICES else None), label="Voz de referencia")
            voz_up = gr.Audio(label="…o subí tu voz (10-30s claros)", type="filepath", sources=["upload", "microphone"], visible=False)
            lang = gr.Dropdown(choices=[("Español", "es"), ("English", "en")], value="es", label="Idioma")
            with gr.Accordion("Ajustes finos", open=False):
                exel = gr.Slider(0.2, 1.0, value=0.6, step=0.05, label="Expresividad (exaggeration)")
                cfg = gr.Slider(0.2, 1.0, value=0.55, step=0.05, label="Fidelidad al texto (cfg)")
                seed = gr.Number(value=1234, label="Seed (mismo seed = misma voz)")
            btn = gr.Button("🎬 Generar voz", variant="primary", size="lg")
    estado = gr.Markdown("")
    audio = gr.Audio(label="Resultado", type="filepath")
    def _toggle(v):
        return gr.update(visible=(v == "__upload__"))
    voz.change(_toggle, voz, voz_up)
    btn.click(generar, [texto, voz, voz_up, lang, exel, cfg, seed], [audio, estado])

if __name__ == "__main__":
    app.launch(server_name="127.0.0.1", server_port=7863, inbrowser=True, show_error=True)
