# Cierre de assets de un video: _last.jpg de cada clip, tl.py sin avisos, QC de agnes en 0 pendientes/rechazados → out/assets_<slug>.done
#   python vlog/hh/assets_done.py <slug> [...]
import glob, os, subprocess, sys
R = "D:/Proyectos/video2-wt/lhh/"; os.chdir(R)
for S in sys.argv[1:]:
    for c in glob.glob(f"public/broll/{S}/*.mp4"):
        last = c[:-4] + "_last.jpg"
        if not os.path.exists(last) or os.path.getmtime(last) < os.path.getmtime(c):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", c, "-frames:v", "1", "-q:v", "3", last], creationflags=0x08000000)
    tl = subprocess.run([sys.executable, "vlog/hh/tl.py", S], capture_output=True, text=True).stdout
    qc = subprocess.run(["node", "scripts/agnes_qc.mjs", S], capture_output=True, text=True, creationflags=0x08000000)
    ok = "⚠️" not in tl and qc.returncode == 0
    print(S, "OK" if ok else "PENDIENTE", "|", tl.strip().splitlines()[0][:150], "|", [l for l in (qc.stdout or "").splitlines() if "===" in l][-1:] , [l for l in tl.splitlines() if "⚠️" in l][:2])
    if ok: open(f"out/assets_{S}.done", "w").write("ok")
