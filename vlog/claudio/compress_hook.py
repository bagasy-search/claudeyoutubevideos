# Comprime las pausas >0,22 s del minuto 1 del máster a 0,20 s (compuerta "cero silencios" del minuto 1).
import subprocess, re, sys, json
src, dst, until = sys.argv[1], sys.argv[2], float(sys.argv[3])
o = subprocess.run(["ffmpeg","-hide_banner","-t",str(until),"-i",src,"-af","silencedetect=noise=-32dB:d=0.22","-f","null","-"],capture_output=True,text=True).stderr
ss = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", o)]; se = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", o)]
keep=[]; t=0.0; cut=0.0
for a,b in zip(ss,se):
    if b-a<=0.22: continue
    keep.append((t, a+0.1)); t = b-0.1; cut += (b-a)-0.2
keep.append((t, None))
parts=[]; 
for i,(a,b) in enumerate(keep):
    parts.append(f"[0:a]atrim=start={a}" + (f":end={b}" if b else "") + f",asetpts=PTS-STARTPTS[p{i}]")
flt=";".join(parts)+";"+"".join(f"[p{i}]" for i in range(len(keep)))+f"concat=n={len(keep)}:v=0:a=1[o]"
subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-filter_complex",flt,"-map","[o]","-c:a","pcm_s16le",dst],check=True)
print(json.dumps({"pausas_comprimidas":len(keep)-1,"segundos_quitados":round(cut,3)}))
