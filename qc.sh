#!/bin/bash
# qc.sh <slug>: blackdetect + freezedetect + medir_mp4 + hojas de cuadros (1 cada 20 s, 4x4 por hoja)
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames -of json $f > probe_$S.json
ffmpeg -nostats -i $f -vf "blackdetect=d=0.3:pix_th=0.10,freezedetect=n=0.003:d=2.5" -an -f null - 2> det_$S.txt
grep -E "black_start|freeze_start|freeze_duration" det_$S.txt > dets_$S.txt || true
python3 medir_mp4.py $S $f > r_$S.json
ffmpeg -v error -i $f -vf "select=not(mod(n\,600)),scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -fps_mode vfr -q:v 4 sheet_${S}_%02d.jpg
mean=$(ffmpeg -nostats -i $f -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume" | tr '\n' ' ')
echo "{\"slug\":\"$S\",\"vol\":\"$mean\",\"black\":$(grep -c black_start dets_$S.txt),\"freeze\":$(grep -c freeze_start dets_$S.txt)}" > q_$S.json
# ---- AUDITOR ampliado (11-nov, modo 100 % nube): hojas a mitad de CADA plano, cuadro del segundo 1, LUFS, avatar vivo, copia a est-<slug>
if [ -f cues_$S.json ]; then
  pip install -q pillow >/dev/null 2>&1 || true
  python3 mid.py $S $f
  ffmpeg -v error -y -ss 1 -i $f -frames:v 1 -vf scale=960:-2 -q:v 4 sheet_${S}_1s.jpg
  ffmpeg -nostats -hide_banner -i $f -af ebur128=peak=true -vn -f null - 2> lufs_$S.txt || true
  ffmpeg -nostats -hide_banner -i $f -af silencedetect=noise=-45dB:d=2 -vn -f null - 2> sil_$S.txt || true
  python3 vivo.py $S $f > vivo_$S.txt 2>&1 || true
  python3 - <<PY
import re,json
t=open('lufs_$S.txt').read(); i=re.findall(r'I:\s+(-?[\d.]+) LUFS',t); p=re.findall(r'Peak:\s+(-?[\d.]+) dBFS',t)
sil=len(re.findall('silence_start',open('sil_$S.txt').read()))
v=open('vivo_$S.txt').read().strip().splitlines()
json.dump({'slug':'$S','lufs':float(i[-1]) if i else None,'peak':float(p[-1]) if p else None,'silencios_2s':sil,'vivo':v[-1] if v else 'sin medir','vivo_det':v},open('q_${S}_aud.json','w'))
print(open('q_${S}_aud.json').read())
PY
  echo >> q_${S}_aud.json
  if [ -f est.txt ]; then
    E=est-$S; gh release view $E -R "$GITHUB_REPOSITORY" >/dev/null 2>&1 || gh release create $E -R "$GITHUB_REPOSITORY" --title $E --notes "MP4 aprobado para programar"
    gh release upload $E $f -R "$GITHUB_REPOSITORY" --clobber && echo "copiado a $E"
  fi
fi
