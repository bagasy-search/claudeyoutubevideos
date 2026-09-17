# desfase por ventana entre el audio del mp4 de RunPod y el reel.wav (InfiniteTalk deriva ~100 ms cada ~2 min)
import subprocess, numpy as np, json
def load(f, ss, d):
    r=subprocess.run(["ffmpeg","-v","error","-ss",f"{ss:.3f}","-t",f"{d:.3f}","-i",f,"-vn","-ac","1","-ar","8000","-f","s16le","-"],capture_output=True)
    return np.frombuffer(r.stdout,np.int16).astype(float)
W=json.load(open("_v3/famarioneta_avwin.json"))
def lag(ss,d):
    a=load("_v3/famarioneta_av/parte1_raw.mp4",ss,d); b=load("_v3/famarioneta_av/reel.wav",ss,d)
    n=min(len(a),len(b)); a=a[:n]-a[:n].mean(); b=b[:n]-b[:n].mean()
    c=np.correlate(a,b,'full'); m=n-1; win=c[m-3200:m+3200]; return (win.argmax()-3200)/8000
out={}
for w in W:
    d=w["end"]-w["start"]; seg=min(6,d)
    l0=lag(w["reel_off"],seg); l1=lag(w["reel_off"]+d-seg,seg); lm=lag(w["reel_off"]+max(0,d/2-seg/2),seg)
    out[w["k"]]={"l0":l0,"lm":lm,"l1":l1}
    if abs(l0-l1)>0.03: print("salto dentro de ventana",w["k"],l0,l1)
json.dump(out,open("_v3/famarioneta_avlag.json","w"),indent=1)
print("ventanas medidas",len(out),"lags distintos",sorted(set(round(v["lm"],3) for v in out.values())))
