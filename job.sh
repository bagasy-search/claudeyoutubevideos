#!/bin/bash
# PLACA LIMPIA v2: silueta por cuadro (mediapipe) en vez de polígono fijo; parte del tar ORIGINAL
set -e; R=$GITHUB_REPOSITORY
pip install -q --no-cache-dir "numpy<2" "opencv-python-headless==4.10.0.84" "mediapipe==0.10.14"
python3 -c "import mediapipe as mp; mp.solutions.selfie_segmentation; print('mp ok')"
mkdir -p out
for S in $(cat slugs.txt); do
  gh release download aud-$S -R $R -p "${S}_av_orig.tar" --clobber; rm -rf w o && mkdir -p w o/a && tar -xf ${S}_av_orig.tar -C w
  F=$(ls w/a | sort | head -1); ffmpeg -v error -y -ss 0.5 -i w/a/$F -frames:v 1 plate_$S.png
  ls w/a | xargs -P 4 -I{} python3 seg.py w/a/{} plate_$S.png o/a/{}
  L=$(ls o/a | sort); N=$(echo "$L" | wc -l); i=0
  for f in $(echo "$L" | awk -v n=$N 'NR==int(n*0.5)||NR==int(n*0.85)||NR==n'); do i=$((i+1)); ffmpeg -v error -y -ss 0.5 -i o/a/$f -frames:v 1 -vf scale=960:-2 -q:v 3 out/${S}_p$i.jpg; done
  ffmpeg -v error -y -i out/${S}_p1.jpg -i out/${S}_p2.jpg -i out/${S}_p3.jpg -filter_complex "[0][1][2]vstack=inputs=3" out/${S}_placa.jpg
  echo "$S: $(ls w/a | wc -l) orig · $(ls o/a | wc -l) limpias"
  [ "$(ls w/a | wc -l)" = "$(ls o/a | wc -l)" ]
  (cd o && tar -cf ../${S}_av.tar a); gh release upload aud-$S ${S}_av.tar out/${S}_placa.jpg -R $R --clobber; rm -rf o w
done
