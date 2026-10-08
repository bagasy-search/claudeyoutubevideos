# Clips HABLADOS de agnes (vlog/<slug>/M1/clips, la mejor versión según state.json) → public/vid/<slug>/<id>.mp4 (1920x1080, 30/1 CFR,
# mudo: la voz sale del máster). gen_timeline los usa desde el arranque del tramo (CLIP0). Los que el `check` rechazó (vlog/<slug>/M1/
# rechazados.json = ["id", …], a mano tras mirar el check) NO se copian → el avatar RunPod cubre esa ventana.
#   SLUG=x python vlog/claudio/vl_post.py
import json, os, subprocess
S = os.environ["SLUG"]; R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/")
D = R + f"vlog/{S}/M1/"; OUT = R + f"public/vid/{S}/"; os.makedirs(OUT, exist_ok=True)
plan = json.load(open(D + "plan.json", encoding="utf-8"))
st = json.load(open(D + "clips/state.json", encoding="utf-8")) if os.path.exists(D + "clips/state.json") else {}
rech = set(json.load(open(D + "rechazados.json", encoding="utf-8"))) if os.path.exists(D + "rechazados.json") else set()
ok = falta = 0
for c in plan["clips"]:
    i = c["id"]; s = st.get(i)
    if not s or i in rech or not os.path.exists(D + "clips/" + s["file"]): falta += 1; continue
    dst = OUT + i + ".mp4"
    if os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(D + "clips/" + s["file"]): ok += 1; continue
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", D + "clips/" + s["file"], "-an", "-vf", "scale=1920:1080:flags=lanczos,fps=30,format=yuv420p",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-bf", "0", "-r", "30", dst], check=True)
    ok += 1
print(f"vl copiados {ok}/{len(plan['clips'])} - faltan/rechazados {falta} -> {OUT}")
