#!/usr/bin/env python
"""
Laboratorio A/B para Fish s2.1-pro-free: genera N variantes del MISMO texto
(o textos distintos) barriendo temperature / top_p / prosody.speed / volume,
guarda wav+mp3 por variante y (opcional) transcribe para detectar si los
tags emocionales se leyeron LITERAL o se interpretaron.

Uso:
  PYTHONUTF8=1 python fish_lab.py --voice claudio_mendoza --exp exp.json --out fish_lab/tanda1 [--asr]

exp.json = [{"label":"...", "text":"...", "temperature":0.7, "top_p":0.7, "speed":1.0, "volume":0.0}, ...]
"""
import os, re, sys, json, time, argparse, subprocess
from fish_audio_sdk import Session, TTSRequest, ReferenceAudio, Prosody

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND = "s2.1-pro-free"

def load_key():
    key = os.environ.get("FISH_KEY")
    if not key:
        envf = os.path.join(ROOT, ".env")
        if os.path.exists(envf):
            for line in open(envf, encoding="utf-8"):
                line = line.strip()
                if line.startswith("FISH_KEY="):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'"); break
    if not key: sys.exit("falta FISH_KEY")
    return key

def ffdur(p):
    r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p],
                       capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except: return 0.0

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", required=True)
    ap.add_argument("--exp", required=True, help="json con lista de experimentos")
    ap.add_argument("--out", required=True)
    ap.add_argument("--asr", action="store_true", help="transcribir cada salida (detecta tags leídos literal)")
    args = ap.parse_args()

    voices = json.load(open(os.path.join(ROOT,"fish_voices.json"), encoding="utf-8"))
    _refcache = {}
    def get_ref(name):
        if name not in _refcache:
            vv = voices[name]
            rw = vv["wav"] if os.path.isabs(vv["wav"]) else os.path.join(ROOT, vv["wav"])
            _refcache[name] = ReferenceAudio(audio=open(rw,"rb").read(), text=vv.get("text",""))
        return _refcache[name]

    exps = json.load(open(args.exp if os.path.isabs(args.exp) else os.path.join(ROOT,args.exp), encoding="utf-8"))
    outdir = args.out if os.path.isabs(args.out) else os.path.join(ROOT, args.out)
    os.makedirs(outdir, exist_ok=True)

    asr = None
    if args.asr:
        from faster_whisper import WhisperModel
        asr = WhisperModel("small", device="cpu", compute_type="int8")

    session = Session(load_key())
    results = []
    for e in exps:
        lbl = e["label"]
        temp = float(e.get("temperature", 1.15)); tp = float(e.get("top_p", 0.98))
        speed = float(e.get("speed", 1.0)); vol = float(e.get("volume", 0.0))
        wav = os.path.join(outdir, f"{lbl}.wav")
        t0 = time.time()
        vc = e.get("voice", args.voice)
        with open(wav, "wb") as f:
            for chunk in session.tts(TTSRequest(
                    text=e["text"], format="wav", chunk_length=300, normalize=True,
                    temperature=temp, top_p=tp,
                    prosody=Prosody(speed=speed, volume=vol),
                    references=[get_ref(vc)]), backend=BACKEND):
                f.write(chunk)
        gen = time.time()-t0
        mp3 = os.path.join(outdir, f"{lbl}.mp3")
        subprocess.run(["ffmpeg","-y","-i",wav,"-codec:a","libmp3lame","-b:a","192k",mp3],
                       capture_output=True)
        dur = ffdur(wav)
        heard = ""
        if asr:
            segs,_ = asr.transcribe(wav, language="es", vad_filter=True)
            heard = re.sub(r'\s+',' '," ".join(s.text.strip() for s in segs)).strip()
        print(f"[{lbl}] temp={temp} top_p={tp} speed={speed} vol={vol}  gen={gen:.1f}s dur={dur:.1f}s")
        if heard: print(f"    ASR: {heard[:180]}")
        results.append({**e, "dur_s": round(dur,1), "gen_s": round(gen,1), "asr": heard})

    json.dump(results, open(os.path.join(outdir,"results.json"),"w",encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(f"\nOK -> {outdir}  ({len(results)} variantes)  results.json")

if __name__ == "__main__":
    main()
