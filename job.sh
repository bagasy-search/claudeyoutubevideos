# avcut ck11d: reel de RunPod EN MANO (url.txt) → ventanas win-NNN.mp4 1920x1080 30 fps con el desfase (deriva) medido por ventana contra ck11d_reel.wav
# + av25.mp3 (ASR: que el reel diga MI guion) + boca viva + cuadro del segundo 1 + av_still.png
set -e
curl -sfL --retry 4 -o reel.mp4 "$(cat url.txt)"
get "${S}_reel.wav"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of json reel.mp4 > out/reel_probe.json; tr -d '\n ' < out/reel_probe.json; echo
python3 cut.py reel.mp4 "${S}_reel.wav" a
ffmpeg -v error -y -i reel.mp4 -t 25 -vn -ac 1 -ar 16000 -b:a 48k out/av25.mp3
python3 - <<'PY'
import json,subprocess
J=json.load(open('avatar_jobs.json')); pick=[J[1],J[len(J)//3],J[2*len(J)//3],J[-1]]
for k,j in enumerate(pick):
    subprocess.run(['ffmpeg','-v','error','-y','-i',f"a/{j['out']}",'-vf',"select='not(mod(n,4))*lt(n,24)',crop=760:560:580:120,scale=380:280,tile=6x1",'-frames:v','1','-q:v','4',f'm{k}.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i','m0.jpg','-i','m1.jpg','-i','m2.jpg','-i','m3.jpg','-filter_complex','vstack=inputs=4','-q:v','4','out/mouth.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-ss','0.9','-i',f"a/{J[0]['out']}",'-frames:v','1','-vf','scale=960:-2','-q:v','4','out/av_1s.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-ss','2','-i',f"a/{J[1]['out']}",'-frames:v','1','out/av_still.png'],check=True)
PY
tar -cf "out/${S}_av.tar" a
put "out/${S}_av.tar" out/av25.mp3 out/mouth.jpg out/av_1s.jpg out/av_lag.json out/reel_probe.json out/av_still.png
