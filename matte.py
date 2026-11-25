import torch, cv2, subprocess, sys
torch.set_num_threads(4)
model = torch.hub.load("PeterL1n/RobustVideoMatting", "mobilenetv3", trust_repo=True).eval()
for s in sys.argv[1:]:
    src = f"public/{s}.mp4"; cap = cv2.VideoCapture(src); w = int(cap.get(3)); h = int(cap.get(4))
    fr = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=r_frame_rate","-of","csv=p=0",src],capture_output=True,text=True).stdout.strip()
    ff = subprocess.Popen(["ffmpeg","-y","-v","error","-f","rawvideo","-pix_fmt","gray","-s",f"{w}x{h}","-r",fr,"-i","-","-c:v","libx264","-crf","16","-pix_fmt","yuv420p","-g","12",f"public/m_{s}.mp4"], stdin=subprocess.PIPE)
    rec = [None]*4; n = 0
    with torch.no_grad():
        while True:
            ok, bgr = cap.read()
            if not ok: break
            x = torch.from_numpy(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).permute(2,0,1).float().div(255).unsqueeze(0)
            if n == 0:
                for _ in range(4): _, _, *rec = model(x, *rec, 0.4)
            _, pha, *rec = model(x, *rec, 0.4)
            ff.stdin.write((pha[0,0].clamp(0,1)*255).byte().numpy().tobytes()); n += 1
    ff.stdin.close(); ff.wait(); print(s, n, "cuadros", flush=True)
    subprocess.run(["cp", f"public/m_{s}.mp4", f"out/m_{s}.mp4"])
