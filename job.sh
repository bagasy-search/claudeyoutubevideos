#!/bin/bash
# avcut: reel de RunPod (url.txt) → ventanas del avatar + chequeos (audio propio, boca viva, cuadro del segundo 1)
set -e; S=scr14a; R=$GITHUB_REPOSITORY
curl -sfL --retry 4 -o reel.mp4 "$(cat url.txt)"
gh release download aud-$S -R $R -p "${S}_reel.wav"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of json reel.mp4 > out/reel_probe.json; cat out/reel_probe.json | tr -d '\n '; echo
python3 cut.py reel.mp4 ${S}_reel.wav a
# audio de los primeros 25 s del reel para comprobar por ASR que es el guion propio (carrera de audios de rp-it-test)
ffmpeg -v error -y -i reel.mp4 -t 25 -vn -ac 1 -ar 16000 -b:a 48k out/av25.mp3
# boca viva: 6 cuadros seguidos (uno cada 4) de 4 ventanas, recorte de la cara
python3 - <<'PY'
import json,subprocess
J=json.load(open('avatar_jobs.json')); pick=[J[0],J[len(J)//3],J[2*len(J)//3],J[-1]]
for k,j in enumerate(pick):
    subprocess.run(['ffmpeg','-v','error','-y','-i',f"a/{j['out']}",'-vf',"select='not(mod(n,4))*lt(n,24)',crop=760:560:580:120,scale=380:280,tile=6x1",'-frames:v','1','-q:v','4',f'm{k}.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i','m0.jpg','-i','m1.jpg','-i','m2.jpg','-i','m3.jpg','-filter_complex','vstack=inputs=4','-q:v','4','out/mouth.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-ss','1','-i',f"a/{J[0]['out']}",'-frames:v','1','-vf','scale=960:-2','-q:v','4','out/av_1s.jpg'],check=True)
PY
tar -cf ${S}_av.tar a && ls -la ${S}_av.tar
gh release upload aud-$S ${S}_av.tar out/av25.mp3 out/mouth.jpg out/av_1s.jpg out/av_lag.json out/reel_probe.json -R $R --clobber
