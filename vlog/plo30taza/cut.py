# plo30taza · recorta pausas de la voz entera: minuto 1 >0,22 s → 0,20 s (cero silencios en el gancho); resto >0,45 s → 0,35 s.
import subprocess, re, sys, json
src, dst = sys.argv[1], sys.argv[2]
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-af", "silencedetect=noise=-32dB:d=0.22", "-f", "null", "-"], capture_output=True, text=True).stderr
ss = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", o)]; se = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", o)]
keep, t, cut = [], 0.0, 0.0
for a, b in zip(ss, se):
    lim, to = (0.22, 0.20) if a < 60 else (0.45, 0.35)
    if b - a <= lim: continue
    keep.append((t, a + to / 2)); t = b - to / 2; cut += (b - a) - to
keep.append((t, None))
parts = [f"[0:a]atrim=start={a}" + (f":end={b}" if b else "") + f",asetpts=PTS-STARTPTS[p{i}]" for i, (a, b) in enumerate(keep)]
flt = ";".join(parts) + ";" + "".join(f"[p{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1[o]"
open(dst + ".flt", "w").write(flt)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex_script", dst + ".flt", "-map", "[o]", "-c:a", "pcm_s16le", dst], check=True)
print(json.dumps({"pausas": len(keep) - 1, "quitados_s": round(cut, 2)}))
