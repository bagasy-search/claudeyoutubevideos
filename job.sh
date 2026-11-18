#!/bin/bash
# mezcla gary11: voz (aud-<slug>/<slug>_voz.wav) + camas de invierno/taller (duck bajo la voz) + SFX en su cuadro → -14 LUFS, anti-mudo, QR verificado con cv2
set -e; S=$(cat slug.txt); R=$GITHUB_REPOSITORY
gh release download aud-$S -R $R -p "${S}_voz.wav" --clobber
for f in bed_*.mp3 sfx/*.mp3; do ffmpeg -v error -y -i "$f" -ar 48000 -ac 2 "${f%.mp3}.wav"; done
ffmpeg -v error -y -i ${S}_voz.wav -ar 48000 -ac 2 voz48.wav
python3 mix.py $S
ffmpeg -v error -y -i ${S}_mix.wav -c:a aac -b:a 192k ${S}_mix.m4a
gh release upload aud-$S ${S}_mix.wav ${S}_mix.m4a -R $R --clobber
python3 -c "
import cv2,json;im=cv2.imread('qr.png');d,_,_=cv2.QRCodeDetector().detectAndDecode(im);print('QR:',d);json.dump({'qr':d},open('out/qr.json','w'))"
cp out/*.json . 2>/dev/null || true
