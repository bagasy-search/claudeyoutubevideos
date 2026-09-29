#!/usr/bin/env python
"""
Registra una voz para fish_factory (CUALQUIER nicho / idioma / acento).
La calidad del clon depende de esto: (a) recorte limpio de ~30s de una narracion
REAL de la voz, (b) transcript EXACTO de ese recorte. El transcript lo saca Whisper,
que AUTODETECTA idioma/acento -> el clon hereda el acento correcto y no deriva.

Uso:
  python fish_register_voice.py --name retire  --source public/retire5countries.wav --start 40
  python fish_register_voice.py --name bastida --source vibevoice_voices/bastida.wav
  python fish_register_voice.py --name <voz>   --source <wav> [--start S] [--dur 30] [--lang en] [--model small]
"""
import os, re, sys, json, argparse, subprocess
from faster_whisper import WhisperModel

ROOT = os.path.dirname(os.path.abspath(__file__))

def ffdur(p):
    r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p],
                       capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except Exception: return 0.0

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--source", required=True, help="wav de narracion real de la voz")
    ap.add_argument("--start", type=float, default=None, help="seg donde arranca el recorte (auto si se omite)")
    ap.add_argument("--dur", type=float, default=30.0)
    ap.add_argument("--lang", default=None, help="forzar idioma ISO (por defecto autodetecta)")
    ap.add_argument("--model", default="small", help="modelo whisper: small/medium/large-v3")
    args = ap.parse_args()

    src = args.source if os.path.isabs(args.source) else os.path.join(ROOT, args.source)
    total = ffdur(src)
    # ventana por defecto: arranca al 15% (saltea intro/musica), largo --dur
    start = args.start if args.start is not None else min(max(total*0.15, 10), max(total-args.dur, 0))
    dur = min(args.dur, max(total - start, 5))
    os.makedirs(os.path.join(ROOT, "fish_refs"), exist_ok=True)
    ref = os.path.join(ROOT, "fish_refs", f"{args.name}.wav")
    subprocess.run(["ffmpeg","-y","-ss",str(start),"-t",str(dur),"-i",src,
                    "-ar","44100","-ac","1", ref], capture_output=True)
    print(f"recorte: {start:.0f}s..{start+dur:.0f}s de {os.path.basename(src)} ({total:.0f}s) -> fish_refs/{args.name}.wav")

    # transcribir EXACTAMENTE ese recorte (el texto debe matchear el audio de referencia)
    print(f"transcribiendo con whisper {args.model} ...")
    segs = info = used = None
    for dev, ct in [("cuda", "float16"), ("cpu", "int8")]:
        try:
            model = WhisperModel(args.model, device=dev, compute_type=ct)
            segments, info = model.transcribe(ref, language=args.lang, vad_filter=True)
            segs = list(segments)  # forzar evaluacion para atrapar errores de CUDA aca
            used = dev
            break
        except Exception as e:
            print(f"  ({dev} no anduvo: {str(e)[:90]})")
    if segs is None:
        sys.exit("whisper fallo en cuda y cpu")
    text = re.sub(r'\s+', ' ', " ".join(s.text.strip() for s in segs)).strip()
    lang = args.lang or info.language
    print(f"(whisper corrio en {used})")
    print(f"idioma detectado: {lang} (prob {getattr(info,'language_probability',0):.2f})")
    print(f"transcript ({len(text)} chars): {text[:170]}...")

    vp = os.path.join(ROOT, "fish_voices.json")
    voices = json.load(open(vp, encoding="utf-8")) if os.path.exists(vp) else {}
    voices[args.name] = {"wav": f"fish_refs/{args.name}.wav", "text": text, "language": lang}
    json.dump(voices, open(vp, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"OK -> voz '{args.name}' registrada (lang={lang}). Ya la podes usar: fish_factory.py --voice {args.name}")

if __name__ == "__main__":
    main()
