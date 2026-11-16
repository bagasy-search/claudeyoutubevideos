# placa limpia v2: silueta real por cuadro (mediapipe selfie seg) + placa del 1er cuadro limpio fuera de la persona
import sys, cv2, numpy as np, mediapipe as mp, subprocess
src, plate_p, dst = sys.argv[1:4]
plate = cv2.imread(plate_p).astype(np.float32)
seg = mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=1)
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS) or 25
w = int(cap.get(3)); h = int(cap.get(4))
if plate.shape[:2] != (h, w): plate = cv2.resize(plate, (w, h))
p = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{w}x{h}','-r',str(fps),'-i','-','-c:v','libx264','-crf','17','-preset','veryfast','-pix_fmt','yuv420p',dst], stdin=subprocess.PIPE)
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(w*0.03)|1, int(w*0.03)|1))
while True:
    ok, f = cap.read()
    if not ok: break
    r = seg.process(cv2.cvtColor(cv2.resize(f, (512, int(512*h/w))), cv2.COLOR_BGR2RGB)).segmentation_mask
    m = (r > 0.25).astype(np.uint8) * 255
    m = cv2.dilate(cv2.resize(m, (w, h)), k)
    m = cv2.GaussianBlur(m, (0, 0), w*0.006).astype(np.float32)[..., None] / 255.0
    o = f.astype(np.float32) * m + plate * (1 - m)
    p.stdin.write(o.astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
