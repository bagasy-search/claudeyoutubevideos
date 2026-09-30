# sfx_synth.py — banco de efectos de sonido SINTETIZADOS (sin licencias, sin API): los que usa la
# edición del primer minuto (spec.hook.sfx / camas). Determinista (semilla fija), 48 kHz estéreo.
#   python factory/py/sfx_synth.py <outDir>
# Cada efecto se normaliza a un pico de -3 dBFS; el volumen final lo decide el spec.
import os, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def env_ad(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    return e * np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4))


def lp(x, fc):
    # pasa-bajos de un polo, ida y vuelta (sin fase)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    z = np.empty_like(y); s = 0.0
    for i in range(len(y) - 1, -1, -1): s = (1 - a) * y[i] + a * s; z[i] = s
    return z


def hp(x, fc): return x - lp(x, fc)


def bp(x, lo, hi): return hp(lp(x, hi), lo)


def pink(n):
    w = rng.standard_normal(n)
    b = [0.0] * 7; out = np.empty(n)
    for i in range(n):
        x = w[i]
        b[0] = 0.99886 * b[0] + x * 0.0555179; b[1] = 0.99332 * b[1] + x * 0.0750759
        b[2] = 0.96900 * b[2] + x * 0.1538520; b[3] = 0.86650 * b[3] + x * 0.3104856
        b[4] = 0.55000 * b[4] + x * 0.5329522; b[5] = -0.7616 * b[5] - x * 0.0168980
        out[i] = b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + x * 0.5362; b[6] = x * 0.115926
    return out


def brown(n):
    return np.cumsum(rng.standard_normal(n)) * 0.02 - np.linspace(0, 1, n) * 0  # deriva quitada abajo


def stereo(x, ancho=0.25, retraso_ms=9):
    d = int(SR * retraso_ms / 1000)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([x * (1 - ancho / 2) + r * ancho / 2, r * (1 - ancho / 2) + x * ancho / 2], 1)


def fade(x, fi=0.005, fo=0.02):
    n = len(x); a, b = int(SR * fi), int(SR * fo)
    e = np.ones(n)
    if a: e[:a] = np.linspace(0, 1, a)
    if b: e[-b:] = np.linspace(1, 0, b)
    return x * (e[:, None] if x.ndim == 2 else e)


def save(d, name, x):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1: x = stereo(x)
    x = fade(x)
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (-3 / 20)
    pcm = (x * 32767).astype(np.int16)
    with wave.open(os.path.join(d, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"  {name}.wav  {len(x) / SR:.2f} s")


def main(d):
    os.makedirs(d, exist_ok=True)
    t = lambda s: np.arange(int(SR * s)) / SR

    # CLIC de interruptor: dos transitorios (bajar y asentar) con cuerpo plástico
    n = int(SR * 0.18); x = np.zeros(n)
    for off, g in ((0, 1.0), (0.012, 0.55)):
        k = int(SR * off); m = int(SR * 0.03)
        x[k:k + m] += bp(rng.standard_normal(m), 1800, 7000) * env_ad(m, 0.0003, 0.006, 6) * g
        x[k:k + m] += np.sin(2 * np.pi * 420 * t(0.03)) * env_ad(m, 0.0005, 0.02, 5) * 0.3 * g
    save(d, "click", x)

    # APAGÓN: el zumbido de red que cae de tono y se corta + chasquido
    tt = t(1.1); f = 100 * np.exp(-tt * 1.6)
    ph = 2 * np.pi * np.cumsum(f) / SR
    hum = (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)) * np.exp(-tt * 2.2)
    snap = np.zeros_like(tt); m = int(SR * 0.02); snap[:m] = bp(rng.standard_normal(m), 900, 6000) * env_ad(m, 0.0002, 0.01, 6)
    save(d, "apagon", hum * 0.7 + snap)

    # ZUMBIDO de LED moribundo (cama corta)
    tt = t(2.5); buzz = np.sign(np.sin(2 * np.pi * 120 * tt)) * 0.15 + np.sin(2 * np.pi * 240 * tt) * 0.2
    save(d, "led_buzz", bp(buzz, 150, 5000) * (0.6 + 0.4 * (rng.random(len(tt)) > 0.03)))

    # GOLPE METÁLICO (pieza que cae en el banco): parciales inarmónicos que decaen
    tt = t(1.4); x = np.zeros_like(tt)
    for fr, g, dcy in ((523, 1.0, 3.2), (1187, 0.6, 4.5), (1861, 0.45, 6.0), (2764, 0.3, 8.0), (3990, 0.2, 11.0)):
        x += np.sin(2 * np.pi * fr * tt) * np.exp(-tt * dcy) * g
    m = int(SR * 0.01); x[:m] += bp(rng.standard_normal(m), 2000, 9000) * 0.8
    thump = np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 18) * 0.9
    save(d, "hit", x * 0.6 + thump)

    # WHOOSH (corte): ruido rosa con barrido de banda y envolvente simétrica
    dur = 0.55; n = int(SR * dur); p = pink(n)
    seg = 8; out = np.zeros(n)
    for i in range(seg):
        a, b = i * n // seg, (i + 1) * n // seg
        fc = 400 + 5000 * np.sin(np.pi * (i + 0.5) / seg) ** 2
        out[a:b] = bp(p, fc * 0.5, fc * 1.4)[a:b]
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2.2
    save(d, "whoosh", stereo(out * e, ancho=0.6, retraso_ms=4))

    # BOOM grave (acento "El Niño"): sub que cae + cola
    tt = t(2.6); f = 55 * np.exp(-tt * 0.9) + 28
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.6)
    save(d, "boom", boom + lp(rng.standard_normal(len(tt)), 180) * np.exp(-tt * 2.5) * 0.6)

    # TRUENO: estallido + retumbo largo de ruido marrón filtrado con rebotes
    tt = t(5.5); n = len(tt)
    b = np.cumsum(rng.standard_normal(n)); b = hp(b - lp(b, 0.5), 20)
    rumble = lp(b, 260) * (np.exp(-tt * 0.7) * (1 + 0.5 * np.sin(2 * np.pi * 1.3 * tt) * np.exp(-tt * 0.5)))
    crack = bp(rng.standard_normal(n), 800, 9000) * env_ad(n, 0.002, 0.25, 5)
    save(d, "trueno", stereo(rumble / np.max(np.abs(rumble)) + crack * 0.7, ancho=0.8, retraso_ms=14))

    # LLUVIA (cama, 12 s en bucle): siseo rosa + gotas sueltas
    tt = t(12); n = len(tt)
    hiss = bp(pink(n), 700, 9000)
    drops = np.zeros(n)
    for k in rng.integers(0, n - 2000, 2600):
        m = 900; drops[k:k + m] += bp(rng.standard_normal(m), 2500, 12000) * env_ad(m, 0.0002, 0.004, 6) * rng.uniform(0.2, 1)
    x = hiss / np.max(np.abs(hiss)) * 0.7 + drops / np.max(np.abs(drops)) * 0.6
    save(d, "lluvia", stereo(x, ancho=0.9, retraso_ms=17))

    # TIC de reloj (una sola vez; el spec lo repite acelerando)
    n = int(SR * 0.06); x = bp(rng.standard_normal(n), 2500, 9000) * env_ad(n, 0.0002, 0.004, 6)
    x += np.sin(2 * np.pi * 3100 * t(0.06)) * env_ad(n, 0.0002, 0.01, 5) * 0.4
    save(d, "tic", x)

    # RISER (tensión hacia un remate): ruido con banda que sube + tono que sube
    tt = t(1.8); n = len(tt); p = pink(n); seg = 12; out = np.zeros(n)
    for i in range(seg):
        a, bb = i * n // seg, (i + 1) * n // seg
        fc = 300 * (20 ** (i / seg)); out[a:bb] = bp(p, fc * 0.6, fc * 1.6)[a:bb]
    tone = np.sin(2 * np.pi * np.cumsum(200 * 4 ** (tt / 1.8)) / SR) * 0.25
    save(d, "riser", (out / np.max(np.abs(out)) + tone) * (tt / 1.8) ** 1.6)

    # GRILLOS (cama nocturna, 10 s): chirridos a 4,5 kHz en ráfagas
    tt = t(10); n = len(tt); x = np.zeros(n)
    for c in range(3):
        f0 = 4300 + 350 * c; per = 0.9 + 0.23 * c; off = rng.uniform(0, per)
        gate = ((tt + off) % per) < 0.18
        am = (np.sin(2 * np.pi * 42 * tt) > 0).astype(float)
        x += np.sin(2 * np.pi * f0 * tt) * gate * am * (0.5 + 0.2 * c)
    save(d, "grillos", stereo(lp(x, 9000), ancho=0.9, retraso_ms=21))

    # BEEP de carga (controlador): dos tonos cortos
    x = np.concatenate([np.sin(2 * np.pi * 2200 * t(0.07)) * env_ad(int(SR * 0.07), 0.002, 0.05, 3), np.zeros(int(SR * 0.06)),
                        np.sin(2 * np.pi * 2900 * t(0.09)) * env_ad(int(SR * 0.09), 0.002, 0.07, 3)])
    save(d, "beep", x)

    # SILENCIO de 3 KB (para cualquier sfx del kit que se pida y no exista: nunca un 404)
    with wave.open(os.path.join(d, "silencio.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b"\0" * 4 * 480)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/sfx_fab")
