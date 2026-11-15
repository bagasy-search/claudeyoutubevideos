#!/bin/bash
set -e; S=scr15a; R=$GITHUB_REPOSITORY; RUN=43766991634
gh run download $RUN -R $R -n final-$S -D dl; V=$(ls dl/*.mp4 | head -1)
gh release download aud-$S -R $R -p "${S}_mix.m4a" --clobber
ffmpeg -v error -y -i "$V" -i ${S}_mix.m4a -map 0:v:0 -map 1:a:0 -t 120 -c:v copy -c:a aac e.mp4
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json e.mp4 > out/probe.json
ffmpeg -v error -y -i e.mp4 -vf "fps=1/5,scale=480:-1,tile=6x4" -frames:v 1 out/sheet.jpg
ffmpeg -hide_banner -i e.mp4 -vf "blackdetect=d=0.5:pix_th=0.08,freezedetect=n=0.003:d=2.5" -af ebur128 -f null - 2> log.txt || true
grep -E "black_start|freeze_start|I:|Peak" log.txt | tail -10 > out/qc.txt; cat out/qc.txt
gh release upload aud-$S out/sheet.jpg out/qc.txt -R $R --clobber
