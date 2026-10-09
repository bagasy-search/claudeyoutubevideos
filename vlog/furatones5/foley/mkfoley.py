# Foley de los clips con ACCIÓN concreta (receta faperejil): tramo del vlog armado → caras tapadas (mask_faces.py) → MMAudio en Modal →
# vlog/furatones5/foley/<id>.wav (compuerta de transitorios: se queda sólo lo que suena por encima del piso) → mix5.py los pone en su lugar.
#   python vlog/furatones5/foley/mkfoley.py
import json, os, subprocess, numpy as np
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"; F = D + "foley/"
SND = {
 "c01": "a small metal coin scraping against rough plaster, a flashlight click", "c02": "a small metal coin dropping inside a wall cavity, a faint metallic clink",
 "c04": "boots kicking dry autumn leaves on a cement path, leaves rustling", "c15": "gust of wind, dry leaves scraping against a metal door",
 "c20": "plastic bag rustling, objects placed on a wooden counter", "c21": "coarse steel wool rustling, a spray can being shaken with the ball rattling",
 "c22": "an aluminum strip unrolling on a wooden counter", "c24": "knee on ceramic tile floor, a flashlight switch click",
 "c26": "a coin tapping a tile floor, a dog sniffing", "c27": "tape measure sliding, a small hacksaw cutting aluminum",
 "c28": "adhesive tape peeling, a cloth wiping a door edge", "c29": "a metal door opening and closing, a rubber brush sweeping a tile floor",
 "c31": "wooden cabinet doors opening, plastic bottles placed on a tile floor", "c33": "rubber work gloves being pulled on",
 "c34": "coarse steel wool being stuffed and scraped with a screwdriver", "c35": "steel wool being pushed and scraped into a hole",
 "c36": "a spray can being shaken, then polyurethane foam hissing out of a nozzle", "c37": "a refrigerator dragged across a tile floor",
 "c39": "steel wool scraped with a screwdriver, then spray foam hissing", "c42": "a coin falling between metal vent slats",
 "c43": "tin snips cutting fine metal mesh", "c44": "a screwdriver unscrewing screws from a metal grille",
 "c47": "coffee poured into a ceramic mug, a spiral notebook opening", "c50": "an aluminum ladder creaking, a flashlight click",
 "c51": "a wooden furniture piece dragged on a floor", "c52": "a box cutter slicing dried foam",
 "c54": "a flashlight laid on a concrete floor", "c55": "a screwdriver picking at dry foam", "c57": "a cardboard box placed on a concrete floor",
 "c59": "dry foam pulled out, steel wool scraped, spray foam hissing", "c60": "rubber gloves pulled off",
 "c61": "a flashlight switch click in a quiet room", "c62": "a wooden cabinet door opening at night",
 "c64": "a hand saw cutting a tree branch, the branch falling on grass", "c66": "a light switch click, then a flashlight switch click",
 "c70": "adhesive tape torn off a roll and pressed on a wooden cabinet door", "c73": "a window sliding open, big flies buzzing",
 "c74": "footsteps, an aerosol can rattling",
}
tl = {c["id"]: c for c in json.load(open(D + "timeline_all.json", encoding="utf8"))}
os.makedirs(F + "src", exist_ok=True); jobs = []
SKIP = set(json.load(open(F + "skip.json"))) if os.path.exists(F + "skip.json") else set()
for i, p in SND.items():
    if i in SKIP or i not in tl or os.path.exists(F + i + ".wav"): continue
    c = tl[i]; v = F + f"src/{i}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(c["vstart"]), "-t", str(c["vdur"]), "-i", R + "public/vid/furatones5/vlog.mp4", "-an", "-vf", "scale=1280:720", "-r", "24", v], check=True)
    jobs.append({"name": i, "video": v, "dur": round(c["vdur"], 2), "prompt": p})
json.dump(jobs, open(F + "jobs.json", "w"), indent=1)
if jobs:
    subprocess.run(["python", F + "mask_faces.py", F + "jobs.json", F + "masked"], check=True)
    subprocess.run(["modal", "run", F + "modal_mmaudio.py", "--jobs", F + "masked/jobs_masked.json" if os.path.exists(F + "masked/jobs_masked.json") else F + "jobs.json", "--outdir", F + "raw"],
                   check=True, env={**os.environ, "PYTHONUTF8": "1"})
SR = 48000
for i in SND:
    src = F + f"raw/{i}.flac"
    if not os.path.exists(src) or os.path.exists(F + i + ".wav"): continue
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32).reshape(-1, 2).copy()
    # compuerta de transitorios: abajo del piso (percentil 40 + 8 dB) se baja 18 dB; pico normalizado a -10 dBFS (bajo la voz)
    h = 480; n = len(x) // h; e = 20 * np.log10(np.sqrt((x[:n * h].reshape(n, h, 2) ** 2).mean((1, 2))) + 1e-9)
    thr = np.percentile(e, 40) + 8; g = np.where(e > thr, 1.0, 10 ** (-18 / 20)); g = np.convolve(g, np.ones(8) / 8, "same")
    x[:n * h] *= np.repeat(g, h)[:, None]; x *= 10 ** (-10 / 20) / (np.abs(x).max() + 1e-9)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", F + i + ".wav"], input=x.astype(np.float32).tobytes(), check=True)
print("foley:", len([i for i in SND if os.path.exists(F + i + ".wav")]), "/", len(SND))
