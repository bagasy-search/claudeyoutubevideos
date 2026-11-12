# Máscara de la bolsa cuadro por cuadro (blanco = bolsa) para cada clip donde aparece.
# Primero intenta SAM 2 (caja + punto en un cuadro, propagado hacia adelante y hacia atrás).
# Si SAM 2 no se puede instalar o falla, cae a un método clásico: blanco/rojo conectado al punto semilla, seguido cuadro a cuadro.
import os, sys, subprocess, numpy as np, cv2
CLIPS = {  # clip: (cuadro del aviso, caja x0,y0,x1,y1 en 736x1280)
    "s5": (0, [484, 592, 733, 951]),
    "s6_ig": (48, [335, 478, 673, 897]),
    "s6_yt": (48, [335, 478, 673, 897]),
    "r7_ig": (24, [335, 628, 643, 1002]),
    "r7_yt": (24, [335, 628, 643, 1002]),
}
def cuadros(clip):
    cap = cv2.VideoCapture(f"{clip}.mp4"); out = []
    while True:
        ok, f = cap.read()
        if not ok: break
        out.append(f)
    return out
def escribir(clip, masks, frames):
    h, w = frames[0].shape[:2]
    fr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", f"{clip}.mp4"], capture_output=True, text=True).stdout.strip()
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{w}x{h}", "-r", fr, "-i", "-", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-g", "12", f"out/b_{clip}.mp4"], stdin=subprocess.PIPE)
    for m in masks:
        m = cv2.GaussianBlur((m > 0).astype(np.uint8) * 255, (0, 0), 2.2)   # borde blando
        ff.stdin.write(m.tobytes())
    ff.stdin.close(); ff.wait()
    k = min(len(frames) - 1, 70)
    mm = cv2.cvtColor(cv2.resize((masks[k] > 0).astype(np.uint8) * 255, (368, 640)), cv2.COLOR_GRAY2BGR)
    cv2.imwrite(f"out/chkb_{clip}.jpg", np.hstack([cv2.resize(frames[k], (368, 640)), mm]))
    area = [int((m > 0).sum()) for m in masks]
    print(clip, len(masks), "cuadros; área mín/med/máx", min(area), int(np.median(area)), max(area), flush=True)

def con_sam2(clip, frames, f0, box):
    import torch
    from sam2.build_sam import build_sam2_video_predictor
    d = f"fr_{clip}"; os.makedirs(d, exist_ok=True)
    for i, f in enumerate(frames): cv2.imwrite(f"{d}/{i:05d}.jpg", f, [cv2.IMWRITE_JPEG_QUALITY, 92])
    pred = build_sam2_video_predictor("configs/sam2.1/sam2.1_hiera_s.yaml", "sam2.1_hiera_small.pt", device="cpu")
    masks = [None] * len(frames)
    with torch.inference_mode():
        st = pred.init_state(video_path=d)
        cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
        pred.add_new_points_or_box(st, frame_idx=f0, obj_id=1, box=np.array(box, dtype=np.float32), points=np.array([[cx, cy]], dtype=np.float32), labels=np.array([1], dtype=np.int32))
        for rev in (False, True):
            for fi, ids, logits in pred.propagate_in_video(st, start_frame_idx=f0, reverse=rev):
                masks[fi] = (logits[0, 0] > 0).cpu().numpy().astype(np.uint8)
    h, w = frames[0].shape[:2]
    return [m if m is not None else np.zeros((h, w), np.uint8) for m in masks]

def clasico(clip, frames, f0, box):
    h, w = frames[0].shape[:2]; masks = [None] * len(frames)
    def una(f, c, prev):
        hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
        blanco = (hsv[..., 1] < 55) & (hsv[..., 2] > 170)
        rojo = ((hsv[..., 0] < 8) | (hsv[..., 0] > 172)) & (hsv[..., 1] > 120) & (hsv[..., 2] > 110)
        m = ((blanco | rojo).astype(np.uint8)) * 255
        if prev is not None: m &= cv2.dilate(prev * 255, np.ones((41, 41), np.uint8))
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
        n, lab, st, cen = cv2.connectedComponentsWithStats(m)
        if n < 2: return (prev if prev is not None else np.zeros((h, w), np.uint8)), c
        best = max(range(1, n), key=lambda i: st[i, cv2.CC_STAT_AREA] - 3 * np.hypot(cen[i][0] - c[0], cen[i][1] - c[1]) ** 1.5)
        comp = (lab == best).astype(np.uint8)
        cnt, _ = cv2.findContours(comp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        out = np.zeros((h, w), np.uint8); cv2.fillPoly(out, [cv2.convexHull(max(cnt, key=cv2.contourArea))], 1)
        return out, cen[best]
    seed = np.zeros((h, w), np.uint8); seed[box[1]:box[3], box[0]:box[2]] = 1
    c0 = ((box[0] + box[2]) / 2, (box[1] + box[3]) / 2)
    prev, c = seed, c0
    for i in range(f0, len(frames)): prev, c = una(frames[i], c, prev); masks[i] = prev
    prev, c = masks[f0], c0
    for i in range(f0 - 1, -1, -1): prev, c = una(frames[i], c, prev); masks[i] = prev
    return masks

modo = sys.argv[1]
for clip, (f0, box) in CLIPS.items():
    fr = cuadros(clip)
    try:
        if modo != "sam2": raise RuntimeError("sin sam2")
        m = con_sam2(clip, fr, f0, box); print(clip, "SAM2", flush=True)
    except Exception as e:
        print(clip, "método clásico porque:", repr(e)[:300], flush=True)
        m = clasico(clip, fr, f0, box)
    escribir(clip, m, fr)
