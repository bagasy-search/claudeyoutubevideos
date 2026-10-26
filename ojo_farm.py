# ojo_farm.py <slug> <mp4> <cortes.txt> <chunk_len>  — planillas por escena + cada 10 s + lageos (en el farm)
import sys, json, cv2, numpy as np
S, F, C, CL = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
cap = cv2.VideoCapture(F); N = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); fps = cap.get(cv2.CAP_PROP_FPS) or 30
cortes = [(float(l.split()[0]), l.split()[1]) for l in open(C) if l.strip()]
want = {}
for i, (t, nm) in enumerate(cortes):
    a = int(round(t * 30)); b = int(round(cortes[i + 1][0] * 30)) if i + 1 < len(cortes) else N
    for tag, fr in (("ini", min(a + 12, b - 1)), ("mid", (a + b) // 2), ("fin", max(b - 12, a))):
        want.setdefault(fr, []).append(("esc", i, nm, tag, t))
for fr in range(0, N, 300): want.setdefault(fr, []).append(("t10", fr, "", "", fr / 30))
grab, diffs, prev = {}, [], None
for n in range(N):
    ok, im = cap.read()
    if not ok: break
    g = cv2.resize(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), (160, 90)).astype(np.float32)
    diffs.append(0.0 if prev is None else float(np.mean(np.abs(g - prev)))); prev = g
    if n in want: grab[n] = cv2.resize(im, (480, 270))
def lab(im, txt):
    im = im.copy(); cv2.rectangle(im, (0, 0), (480, 26), (0, 0, 0), -1); cv2.putText(im, txt, (6, 19), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 1); return im
def hojas(items, pref, cols, rows):
    per = cols * rows
    for h in range(0, len(items), per):
        cel = items[h:h + per] + [np.zeros((270, 480, 3), np.uint8)] * (per - len(items[h:h + per]))
        img = np.vstack([np.hstack(cel[r * cols:(r + 1) * cols]) for r in range(rows)])
        cv2.imwrite(f"{pref}_{h // per + 1:02d}.jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 80])
esc = []
for i, (t, nm) in enumerate(cortes):
    for tag in ("ini", "mid", "fin"):
        fr = [k for k, v in want.items() if any(x[0] == "esc" and x[1] == i and x[3] == tag for x in v)][0]
        if fr in grab: esc.append(lab(grab[fr], f"{i+1:02d} {nm} {tag} {fr/30:.1f}s"))
hojas(esc, f"esc_{S}", 3, 4)  # 4 escenas por hoja (3 cuadros c/u)
hojas([lab(grab[fr], f"{fr/30:.0f}s") for fr in range(0, N, 300) if fr in grab], f"t10_{S}", 4, 4)
d = np.array(diffs); mov = d > 0.6
# lageo = cuadro repetido (diff<0.05) con movimiento antes y después dentro de ±3 cuadros
lag = [n for n in range(3, len(d) - 3) if d[n] < 0.05 and mov[n - 3:n].any() and mov[n + 1:n + 4].any()]
cost = [{"f": k, "t": round(k / 30, 2), "d": round(d[k], 2), "vec": round(float(np.median(d[max(1, k - 6):k])), 2)} for k in range(CL, len(d), CL)]
saltos = [c for c in cost if c["d"] > 3 * max(c["vec"], 0.5)]
cuts = {int(round(t * 30)) for t, _ in cortes}
saltos = [c for c in saltos if not any(abs(c["f"] - x) <= 1 for x in cuts)]
json.dump({"slug": S, "frames": len(d), "fps": fps, "av_pct": None, "lageos": len(lag), "lageo_t": [round(n / 30, 2) for n in lag][:300],
           "costuras": cost, "saltos_costura": saltos}, open(f"r_{S}.json", "w"))
print("frames", len(d), "lageos", len(lag), "saltos", len(saltos))
