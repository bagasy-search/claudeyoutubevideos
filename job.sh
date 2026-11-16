#!/bin/bash
# AUDITOR técnico en la nube: baja el MP4 final (release <slug>), corre qc.sh y sube hojas + jsons a aud-<slug>; copia el MP4 a est-<slug>
set -e; S=scr15a; R=$GITHUB_REPOSITORY
pip uninstall -y -q opencv-python opencv-contrib-python opencv-python-headless >/dev/null 2>&1 || true; pip install -q --no-cache-dir --force-reinstall opencv-python-headless pillow; python3 -c "import cv2;print(cv2.__version__,cv2.CascadeClassifier)"
gh release download $S -R $R -p "$S.mp4" --clobber
bash qc.sh $S || true
# mean_volume por tramos de 60 s
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $S.mp4); n=0; low=0; : > vol60_$S.txt
for t in $(seq 0 60 ${D%.*}); do v=$(ffmpeg -nostats -ss $t -t 60 -i $S.mp4 -vn -af volumedetect -f null - 2>&1 | grep -o "mean_volume: [-0-9.]*" | grep -o "[-0-9.]*$"); echo "$t $v" >> vol60_$S.txt; awk -v x="$v" 'BEGIN{exit !(x < -45)}' && low=$((low+1)); done
echo "{\"tramos_bajo_-45\":$low}" > vol60_$S.json; cat vol60_$S.json
ls
gh release upload aud-$S sheet_${S}_*.jpg q_${S}*.json dets_$S.txt probe_$S.json vol60_$S.txt vivo_$S.txt r_$S.json -R $R --clobber
