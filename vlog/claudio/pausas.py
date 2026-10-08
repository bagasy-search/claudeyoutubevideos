# Respiro entre reglas (canal Japón): mete SIL s de silencio ANTES de cada párrafo que abre una regla (sec R<n>, el primero de su
# sección) en public/<slug>.wav, y corre wordms/paras. Debajo va el ClRule + ambiente y foley (sound.mjs). Correr UNA vez, después
# de paras.py y antes de los directores. SLUG=x python vlog/claudio/pausas.py [--sil 2.4]
import json, os, re, subprocess, sys, argparse, shutil
ap = argparse.ArgumentParser(); ap.add_argument("--sil", type=float, default=2.4); a = ap.parse_args()
S = os.environ["SLUG"]; R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/")
P = json.load(open(R + f"_v3/{S}_paras.json", encoding="utf8")); W = json.load(open(R + f"_v3/{S}_wordms.json", encoding="utf8"))
if os.path.exists(R + f"_v3/{S}_pausas.json"): sys.exit("⛔ ya se metieron las pausas (borrar _v3/<slug>_pausas.json y restaurar el wav _sinpausas)")
seen = set(); cuts = []
for p in P:
    if re.match(r"^R\d+$", p["sec"]) and p["sec"] not in seen:
        seen.add(p["sec"]); cuts.append(max(0.0, p["s"] - 0.12))
wav = R + f"public/{S}.wav"; shutil.copy(wav, R + f"public/{S}_sinpausas.wav")
parts = []; t0 = 0.0
for i, c in enumerate(cuts):
    parts.append(f"[0:a]atrim=start={t0}:end={c},asetpts=PTS-STARTPTS[a{i}]"); t0 = c
parts.append(f"[0:a]atrim=start={t0},asetpts=PTS-STARTPTS[a{len(cuts)}]")
sil = "".join(f"aevalsrc=0:d={a.sil}:s=44100[s{i}];" for i in range(len(cuts)))
chain = "".join(f"[a{i}][s{i}]" for i in range(len(cuts))) + f"[a{len(cuts)}]"
flt = sil + ";".join(parts) + ";" + chain + f"concat=n={2 * len(cuts) + 1}:v=0:a=1[o]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", R + f"public/{S}_sinpausas.wav", "-filter_complex", flt, "-map", "[o]", "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", wav], check=True)
sh = lambda t: t + a.sil * sum(1 for c in cuts if t >= c)
for w in W: w["s"] = round(sh(w["s"]), 3); w["e"] = round(sh(w["e"]), 3)
for p in P: p["s"] = round(sh(p["s"]), 3); p["e"] = round(sh(p["e"]), 3)
json.dump(W, open(R + f"_v3/{S}_wordms.json", "w", encoding="utf8")); json.dump(P, open(R + f"_v3/{S}_paras.json", "w", encoding="utf8"), indent=0, ensure_ascii=False)
json.dump({"sil": a.sil, "cuts": cuts}, open(R + f"_v3/{S}_pausas.json", "w", encoding="utf8"))
print(len(cuts), "pausas de", a.sil, "s +", round(len(cuts) * a.sil, 1), "s")
