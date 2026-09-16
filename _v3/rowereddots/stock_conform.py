import os, subprocess, re, json, sys
os.chdir("D:/Proyectos/video2-wt/rowereddots")
RAW="_v3/rowereddots/stock_raw"; OUT="public/broll/rowereddots/stock"; os.makedirs(OUT, exist_ok=True)
rep={}
for f in sorted(os.listdir(RAW)):
    if not f.endswith(".mp4") or f.startswith("_"): continue
    src=f"{RAW}/{f}"; dst=f"{OUT}/{f}"
    dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src],text=True).strip().rstrip(","))
    o=subprocess.run(["ffmpeg","-v","info","-t","2","-i",src,"-an","-vf","scale=480:270,signalstats,metadata=print:key=lavfi.signalstats.YAVG","-f","null","-"],capture_output=True,text=True).stderr
    ys=[float(x) for x in re.findall(r"YAVG=([0-9.]+)",o)]
    ss=0.0
    for i,y in enumerate(ys):
        if y>=40: ss=i/ max(1,len(ys)/2.0); break
    else: ss=0.5
    ss=round(min(ss+0.1,1.5),2)
    t=min(12.0, dur-ss-0.1)
    if not os.path.exists(dst):
        subprocess.run(["ffmpeg","-v","error","-y","-ss",str(ss),"-i",src,"-t",str(t),"-an","-vf","scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1","-c:v","libx264","-crf","20","-preset","veryfast","-pix_fmt","yuv420p",dst],check=True)
    o2=subprocess.run(["ffmpeg","-v","info","-t","0.7","-i",dst,"-an","-vf","signalstats,metadata=print:key=lavfi.signalstats.YAVG","-f","null","-"],capture_output=True,text=True).stderr
    y2=[float(x) for x in re.findall(r"YAVG=([0-9.]+)",o2)]
    rep[f]={"ss":ss,"t":round(t,2),"ymin":round(min(y2),1) if y2 else None}
    print(f, rep[f], flush=True)
print("midió", len(rep), "clips · arranque oscuro (<40):", [k for k,v in rep.items() if (v["ymin"] or 0)<40])
