# Tapa la cara (boca incluida) en los clips hablados para que MMAudio no "lea labios" e invente voz.
#   python mask_faces.py <jobs.json> <outdir>   → escribe <outdir>/<name>.mp4 y jobs_masked.json
import cv2, json, sys, os, numpy as np
J = json.load(open(sys.argv[1], encoding="utf-8")); OD = sys.argv[2]; os.makedirs(OD, exist_ok=True)
DET = cv2.FaceDetectorYN.create(os.path.join(os.path.dirname(os.path.abspath(__file__)), "yunet.onnx"), "", (640, 360), 0.6)
out = []
for j in J:
    if j.get("kf"): out.append(j); continue          # planos de detalle: sin cara, van tal cual
    cap = cv2.VideoCapture(j["video"]); fps = cap.get(cv2.CAP_PROP_FPS) or 24
    W, H = int(cap.get(3)), int(cap.get(4))
    dst = os.path.join(OD, j["name"] + ".mp4")
    vw = cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"mp4v"), fps, (W, H))
    box = None; hits = 0; n = 0
    while True:
        ok, f = cap.read()
        if not ok: break
        n += 1
        g = cv2.resize(f, (W // 2, H // 2)); DET.setInputSize((W // 2, H // 2))
        _, fc = DET.detect(g)
        d = [tuple(r[:4]) for r in fc] if fc is not None else []
        extra = [np.array(b, float) * 2 for b in d]
        if d:
            x, y, w, h = max(d, key=lambda b: b[2] * b[3]); nb = np.array([x, y, w, h], float) * 2; hits += 1
            box = nb if box is None else 0.6 * box + 0.4 * nb
        if box is None: box = np.array([W * 0.38, H * 0.05, W * 0.24, H * 0.42])   # respaldo: plano medio típico
        m = np.zeros((H, W), np.uint8)
        for (x, y, w, h) in [box] + extra:          # todas las caras (en S4 también la de Carmen)
            cv2.ellipse(m, (int(x + w / 2), int(y + h * 0.55)), (int(w * 0.85), int(h * 1.0)), 0, 0, 360, 255, -1)
        flat = np.full_like(f, f.reshape(-1, 3).mean(0).astype(np.uint8))
        f = np.where(m[..., None] > 0, flat, f)
        vw.write(f)
    vw.release(); cap.release()
    print(j["name"], f"cara detectada en {hits}/{n} cuadros")
    out.append({**j, "video": dst})
json.dump(out, open(os.path.join(OD, "jobs_masked.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
