# Mezcla FINAL del Vaquero EN (regla 9-oct: SOLO voz + audio REAL de los clips, sin música/ambientes/efectos):
# voz recortada (vlog/<slug>/voz_cut.wav, manda) + sonido real de los DET (det_cut.wav) a −22 dB bajo la voz, ducking a ≈ −26 cuando habla.
# −14 LUFS integrados, true peak ≤ −1 dBTP.   SLUG=x python vlog/cv/mezcla.py → out/<slug>_mix.wav (48 k estéreo)
import os, re, subprocess, numpy as np
S = os.environ["SLUG"]; R = f"D:/Proyectos/video2-wt/{os.environ.get('WT', S)}/"; D = R + f"vlog/{S}/"; SR = 48000
def load(f, ch=2):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
def lufs(x):
    o = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], input=x.astype(np.float32).tobytes(), capture_output=True).stderr.decode("utf8", "replace")
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1]), float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)[-1])
voice = load(D + "voz_cut.wav", 1)[:, 0]; N = len(voice); mix = np.repeat(voice[:, None], 2, 1)
vdb = rms_db(voice[np.abs(voice) > 0.02])
hop = 480; n = N // hop; env = np.sqrt((voice[:n * hop].reshape(n, hop) ** 2).mean(1)); act = np.clip((20 * np.log10(env + 1e-9) - (vdb - 30)) / 20, 0, 1)
sm = np.zeros_like(act); a = 0
for i, v in enumerate(act): a = v if v > a else a * 0.985; sm[i] = a
duck = np.repeat(1 - 0.37 * sm, hop)[:N]; duck = np.pad(duck, (0, N - len(duck)), constant_values=1)
det_db = None
if os.path.exists(D + "det_cut.wav"):
    det = load(D + "det_cut.wav")[:N]; det = np.pad(det, ((0, N - len(det)), (0, 0)))
    on = np.abs(det).max(1) > 1e-4
    if on.any():
        det *= 10 ** ((vdb - 22 - rms_db(det[on])) / 20); det *= duck[:, None]; mix += det; det_db = rms_db(det[on]) - vdb
I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
for _ in range(4):
    I, tp = lufs(mix)
    if tp <= -1.0: break
    pk = 10 ** (-1.3 / 20); mix = np.tanh(mix / pk) * pk; I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
os.makedirs(R + "out", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", R + f"out/{S}_mix.wav"], input=mix.astype(np.float32).tobytes(), check=True)
I, tp = lufs(mix); print(f"MEDIDO mezcla {N / SR:.2f}s · {I:.1f} LUFS · TP {tp:.1f} · DET {'%.1f dB bajo la voz' % -det_db if det_db is not None else 'sin DET'} · sin música/ambiente")
