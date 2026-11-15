#!/bin/bash
# voz scr14: bloques crudos de Fish (aud-<slug>/<slug>_fbNNN.wav) → unión en orden → highpass + de-esser suave (7 kHz −4 dB) + loudnorm −16 → mp3 16 kHz (ASR Groq) + 5 tramos en dB
set -e; S=$(cat slug.txt); R=$GITHUB_REPOSITORY
gh release download aud-$S -R $R -p "${S}_fb*.wav"
ls ${S}_fb*.wav | sort > l.txt; N=$(wc -l < l.txt); IN=""; FC=""; i=0
while read f; do IN="$IN -i $f"; FC="$FC[$i:a]aformat=sample_rates=44100:channel_layouts=mono[p$i];"; i=$((i+1)); done < l.txt
LB=""; for k in $(seq 0 $((N-1))); do LB="$LB[p$k]"; done
ffmpeg -v error -y $IN -filter_complex "${FC}${LB}concat=n=$N:v=0:a=1[o]" -map "[o]" ${S}_fish_raw.wav
echo "bloques: $N · crudo: $(ffprobe -v error -show_entries format=duration -of csv=p=0 ${S}_fish_raw.wav) s"
ffmpeg -v error -y -i ${S}_fish_raw.wav -af "highpass=f=60,equalizer=f=7000:t=q:w=1.2:g=-4,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 1 -c:a pcm_s16le ${S}_voz.wav
ffmpeg -v error -y -i ${S}_voz.wav -ac 1 -ar 16000 -b:a 48k ${S}_16k.mp3
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ${S}_voz.wav); echo "voz: $D s"
T=""; for p in 0.1 0.3 0.5 0.7 0.9; do ss=$(python3 -c "print($D*$p)"); m=$(ffmpeg -hide_banner -nostats -ss $ss -t 20 -i ${S}_voz.wav -af volumedetect -f null - 2>&1 | grep mean_volume | awk '{print $5}'); T="$T $m"; echo "tramo $p ($ss s): $m dB"; done
ffmpeg -hide_banner -nostats -i ${S}_voz.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tail -2
gh release upload aud-$S ${S}_voz.wav ${S}_16k.mp3 -R $R --clobber
echo "{\"dur\":$D,\"bloques\":$N,\"tramos\":\"$T\"}" > out/voz.json
