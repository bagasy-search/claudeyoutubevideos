# Recorte del presentador (RobustVideoMatting, CPU) de un tramo del reel → webm VP9 con alfa.
import sys, subprocess, numpy as np, torch
src, ss, to, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
W, H, FPS = 832, 464, 25
model = torch.hub.load("PeterL1n/RobustVideoMatting", "mobilenetv3", trust_repo=True).eval()
torch.set_num_threads(4)
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", str(ss), "-i", src, "-t", str(to - ss), "-f", "rawvideo", "-pix_fmt", "rgb24", "-r", str(FPS), "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-crf", "24", "-b:v", "0", "-auto-alt-ref", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", out], stdin=subprocess.PIPE)
rec = [None] * 4; n = 0
with torch.no_grad():
    while True:
        buf = dec.stdout.read(W * H * 3)
        if len(buf) < W * H * 3: break
        f = torch.from_numpy(np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()).permute(2, 0, 1).float().div(255).unsqueeze(0)
        fgr, pha, *rec = model(f, *rec, downsample_ratio=0.5)
        rgba = torch.cat([fgr, pha], 1)[0].permute(1, 2, 0).clamp(0, 1).mul(255).byte().numpy()
        enc.stdin.write(rgba.tobytes()); n += 1
enc.stdin.close(); enc.wait(); print("cuadros", n)
