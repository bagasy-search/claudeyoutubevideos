# mezcla.py — MÁSTER DE MEZCLA: voz + efectos + camas + sonido nativo de los clips, cada evento en su
# cuadro exacto, en un solo WAV. El render y la entrega usan ESTE máster (la entrega le pone al mp4 el
# audio del máster: si los efectos vivieran sólo en el render de Remotion, se perderían en la entrega).
#   python factory/py/mezcla.py <voz.wav> <eventos.json> <salida.wav>
# eventos = [{src, at, dur, vol, fi?, fo?, loop?}] (segundos; src = ruta absoluta)
# Compuerta: imprime cuántos eventos mezcló; exit 2 si 0 o si falta un archivo; limitador a -1 dBFS.
import json, subprocess, sys, wave
import numpy as np

SR = 48000


def leer(src, dur=None, loop=False):
    args = ["ffmpeg", "-v", "error"]
    if loop: args += ["-stream_loop", "-1"]
    args += ["-i", src]
    if dur: args += ["-t", f"{dur:.4f}"]
    args += ["-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    b = subprocess.run(args, capture_output=True, check=True).stdout
    return np.frombuffer(b, dtype=np.float32).reshape(-1, 2).astype(np.float64)


def main(voz, eventos_json, out):
    ev = json.load(open(eventos_json, encoding="utf-8"))
    base = leer(voz)
    mix = base.copy()
    n_ok = 0
    for e in ev:
        try:
            x = leer(e["src"], e.get("dur"), e.get("loop", False))
        except Exception as err:
            print(f"⛔ no pude leer {e['src']}: {err}"); sys.exit(2)
        if not len(x): continue
        # `norm` (dBFS RMS objetivo): el ambiente de cada clip sale a niveles MUY distintos (-33 a -72 dB
        # medido en cmenino). Se lleva al objetivo con techo de ganancia; el que es sólo piso de ruido se
        # descarta (subirlo sería meter siseo).
        if e.get("norm") is not None:
            rms = 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
            if rms < e.get("piso", -62): continue
            x = x * 10 ** (min(e.get("maxGain", 20), e["norm"] - rms) / 20)
        n = len(x); env = np.ones(n)
        fi, fo = int(SR * e.get("fi", 0)), int(SR * e.get("fo", 0))
        if fi: env[:fi] = np.linspace(0, 1, min(fi, n))[:min(fi, n)]
        if fo: env[-min(fo, n):] *= np.linspace(1, 0, min(fo, n))
        x = x * env[:, None] * float(e.get("vol", 0.5))
        a = int(round(e["at"] * SR))
        if a >= len(mix): continue
        b = min(len(mix), a + n)
        mix[a:b] += x[: b - a]
        n_ok += 1
    pico = np.max(np.abs(mix))
    lim = 10 ** (-1 / 20)
    if pico > lim:   # limitador suave: sólo toca lo que pasa el techo
        over = np.abs(mix) > lim * 0.85
        mix[over] = np.sign(mix[over]) * (lim * 0.85 + (np.abs(mix[over]) - lim * 0.85) * (lim * 0.15) / (pico - lim * 0.85))
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"mezcla: {n_ok}/{len(ev)} eventos · {len(mix) / SR:.2f} s (voz {len(base) / SR:.2f} s) · pico previo {20 * np.log10(pico + 1e-9):.1f} dBFS")
    if n_ok == 0 and ev: sys.exit(2)


if __name__ == "__main__":
    main(*sys.argv[1:4])
