# avatar_vivo.py <slug> [mp4|url]: ¿la boca del avatar se MUEVE en el MP4 final? (5-nov: apa30a/b/c salieron con el avatar en foto
# quieta y ningún QC lo vio). En 3 ventanas AV recorta la cara (3 s recodificado, nunca -c copy) y compara cuánto cambia la boca
# contra la frente: foto quieta con push → boca ≈ frente; avatar hablando → boca bastante más. exit 1 = QUIETO, no se entrega.
import json, subprocess, sys
s = sys.argv[1]; W = "."
src = sys.argv[2] if len(sys.argv) > 2 else subprocess.run(["gh", "release", "view", s, "-R", "bagasy-search/claudeyoutubevideos", "--json", "assets", "-q", f'.assets[]|select(.name=="{s}.mp4")|.url'], capture_output=True, text=True).stdout.strip()
av = json.load(open(f"avwin.json", encoding="utf8")); av = av if isinstance(av, list) else next(v for v in av.values() if isinstance(v, list))
av = [w for w in av if w["me"] - w["ms"] >= 3.5]
def zona(t, crop):
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", src, "-t", "2.5", "-an", "-vf", f"crop={crop},scale=48:24,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    F = [r[i * 1152:(i + 1) * 1152] for i in range(len(r) // 1152)]
    return sum(sum(abs(a - b) for a, b in zip(F[i], F[i + 1])) / 1152 for i in range(len(F) - 1)) / max(1, len(F) - 1)
res = []
def cara(t):
    # 6-nov (ck5nb): el encuadre del avatar cambia por ventana (primer plano / plano abierto con la cara a la izquierda) y el recorte
    # fijo mide fondo o componente → buscar la cara con haar y medir boca/frente DENTRO de ella. Mismo umbral, no afloja nada.
    try:
        import cv2, numpy as np
        r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", src, "-frames:v", "1", "-vf", "scale=640:360", "-pix_fmt", "bgr24", "-f", "rawvideo", "-"], capture_output=True).stdout
        g = np.frombuffer(r, np.uint8)[:640 * 360 * 3].reshape(360, 640, 3)
        d = cv2.FaceDetectorYN.create("yunet.onnx", "", (640, 360), 0.7)  # cv2 5 local no trae haar
        _, fs = d.detect(g)
        if fs is None or len(fs) == 0: return None
        x, y, w, h = max(fs[:, :4].tolist(), key=lambda q: q[2] * q[3]); X, Y, Wd, H = x / 640, y / 360, w / 640, h / 360
        return (f"iw*{Wd*0.5:.3f}:ih*{H*0.22:.3f}:iw*{X+Wd*0.25:.3f}:ih*{Y+H*0.68:.3f}", f"iw*{Wd*0.5:.3f}:ih*{H*0.15:.3f}:iw*{X+Wd*0.25:.3f}:ih*{Y+H*0.05:.3f}")
    except Exception:
        return None
for w in [av[len(av) // 4], av[len(av) // 2], av[3 * len(av) // 4]]:
    t = w["ms"] + 0.5
    b, f = zona(t, "iw*0.16:ih*0.12:iw*0.42:ih*0.24"), zona(t, "iw*0.16:ih*0.08:iw*0.42:ih*0.08")
    if b / max(f, 0.05) < 1.6 and (c := cara(t + 0.2)):
        b2, f2 = zona(t, c[0]), zona(t, c[1])
        if b2 / max(f2, 0.05) > b / max(f, 0.05): b, f = b2, f2; print(f"{s} t={t:.1f} (cara detectada)")
    # 6-nov (ck5nd): primer plano con la cabeza moviéndose → la frente también cambia y una sola toma de 2,5 s puede quedar en 1,4-1,6
    # aunque la boca hable. Re-medir en 2 instantes más de la MISMA ventana y quedarse con el mejor: una foto quieta da ≈1 en todos.
    for dt in (1.5, 3.0):
        if b / max(f, 0.05) >= 1.6 or t + dt + 2.5 > w["me"]: continue
        c = cara(t + dt + 0.2)
        if not c: continue
        b2, f2 = zona(t + dt, c[0]), zona(t + dt, c[1])
        if b2 / max(f2, 0.05) > b / max(f, 0.05): b, f = b2, f2; print(f"{s} t={t + dt:.1f} (re-medido)")
    res.append(round(b / max(f, 0.05), 2)); print(f"{s} t={t:.1f} boca {b:.2f} frente {f:.2f} razón {res[-1]}")
ok = sorted(res)[1] >= 1.6
print(s, "AVATAR VIVO ✓" if ok else "⛔ AVATAR QUIETO (o no se pudo medir)", res); sys.exit(0 if ok else 1)
