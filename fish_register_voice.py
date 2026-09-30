#!/usr/bin/env python3
# fish_register_voice.py — registra una voz de referencia para Fish en fish_voices.json.
#
#   python fish_register_voice.py --name <voz> --source <audio|video> [--start S --dur D]
#
# Recorta el tramo (por defecto busca uno de ~22 s que empiece y termine en frontera de oración),
# lo limpia con una cadena ESTÁTICA (highpass + afftdn, nunca dynaudnorm: el clon aprende el bombeo
# y sale el "pa pa pa"), lo transcribe con faster-whisper (texto EXACTO de lo que se oye) y lo guarda
# en fish_refs/<voz>.wav + la entrada {wav,text,language} en fish_voices.json.
import argparse, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.abspath(__file__))


def transcribir(wav, lang, words=False):
    from faster_whisper import WhisperModel
    m = WhisperModel(os.environ.get("FW_MODEL", "medium"), device="cpu", compute_type="int8")
    segs, _ = m.transcribe(wav, language=lang, word_timestamps=words, vad_filter=False)
    return list(segs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--source", required=True)
    ap.add_argument("--start", type=float)
    ap.add_argument("--dur", type=float)
    ap.add_argument("--lang", default="es")
    ap.add_argument("--target", type=float, default=22.0, help="largo buscado si no se pasa --start")
    ap.add_argument("--search-from", type=float, default=60.0)
    ap.add_argument("--search-len", type=float, default=90.0)
    a = ap.parse_args()

    tmp = tempfile.mkdtemp()
    if a.start is None:
        # tramo de búsqueda → oraciones con puntuación → el tramo de punto a punto más cercano a --target
        buscar = os.path.join(tmp, "buscar.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a.search_from), "-t", str(a.search_len), "-i", a.source,
                        "-ac", "1", "-ar", "16000", buscar], check=True)
        segs = transcribir(buscar, a.lang, words=True)
        ws = [w for s in segs for w in (s.words or [])]
        cortes = [0] + [i + 1 for i, w in enumerate(ws) if w.word.strip().endswith((".", "?", "!"))]
        mejor = None
        for i in cortes:
            for j in cortes:
                if j <= i or j > len(ws):
                    continue
                d = ws[j - 1].end - ws[i].start
                if 14 <= d <= 28 and (mejor is None or abs(d - a.target) < abs(mejor[2] - a.target)):
                    mejor = (i, j, d)
        if not mejor:
            sys.exit("no encontré un tramo de 14-28 s de punto a punto: pasá --start/--dur")
        i, j, _ = mejor
        a.start = a.search_from + max(0, ws[i].start - 0.12)
        a.dur = (ws[j - 1].end - ws[i].start) + 0.3
    os.makedirs(os.path.join(ROOT, "fish_refs"), exist_ok=True)
    out = os.path.join(ROOT, "fish_refs", f"{a.name}.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a.start:.3f}", "-t", f"{a.dur:.3f}", "-i", a.source,
                    "-af", "highpass=f=75,afftdn=nf=-30", "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", out], check=True)
    texto = " ".join(s.text.strip() for s in transcribir(out, a.lang)).strip()
    if len(texto) < 60:
        sys.exit(f"transcripción demasiado corta ({len(texto)} car): elegí otro tramo")
    vj = os.path.join(ROOT, "fish_voices.json")
    voces = json.load(open(vj, encoding="utf-8"))
    voces[a.name] = {"wav": f"fish_refs/{a.name}.wav", "text": texto, "language": a.lang}
    json.dump(voces, open(vj, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"✓ voz '{a.name}' registrada · {a.start:.2f}s +{a.dur:.2f}s · {len(texto)} car")
    print(texto)


if __name__ == "__main__":
    main()
