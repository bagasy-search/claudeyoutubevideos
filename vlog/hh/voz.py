# Fase B de un video de House Hacks: guion → tags Fish → Fish `loretta` (speed 1.0) → pausas del min 1 → ASR Modal → alineación.
#   python vlog/hh/voz.py <slug> [--solo-asr]
# Deja: out/fish_<slug>/master.wav · public/<slug>.wav · public/captions_<slug>.json · _v3/<slug>_wordms.json · out/voz_<slug>.done
import subprocess, sys, os, json, time
R = "D:/Proyectos/video2-wt/lhh/"; os.chdir(R)
S = sys.argv[1]; SOLO_ASR = "--solo-asr" in sys.argv
env = {**os.environ, "SLUG": S, "PYTHONUTF8": "1"}
def run(cmd, tries=1):
    for t in range(tries):
        print(time.strftime("%H:%M:%S"), "▶", " ".join(cmd), flush=True)
        r = subprocess.run(cmd, env=env, creationflags=0x08000000)
        if r.returncode == 0: return
        print("   ✗ exit", r.returncode, flush=True); time.sleep(30)
    raise SystemExit(f"falló: {cmd}")
py = sys.executable
if not SOLO_ASR:
    run([py, "vlog/loretta/tag_voz.py", f"guiones/{S}.txt", f"guiones/{S}_voz.txt"])
    run([py, "fish_factory.py", "--script", f"guiones/{S}_voz.txt", "--voice", "loretta", "--out", f"out/fish_{S}", "--concurrency", "2", "--fix-flagged", "3"], tries=3)
    run([py, "vlog/loretta/compress_hook.py", f"out/fish_{S}/master.wav", f"public/{S}.wav", "60"])
run(["modal", "run", "modal_whisper.py", "--slug", S, "--lang", "en", "--model", "medium"], tries=3)
run([py, "vlog/loretta/align.py"])
open(f"out/voz_{S}.done", "w").write(time.strftime("%Y-%m-%d %H:%M:%S"))
print("LISTO", S, flush=True)
