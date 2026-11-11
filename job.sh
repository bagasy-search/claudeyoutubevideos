#!/bin/bash
# voz gary11: master de Fish (aud-<slug>/<slug>_fb00.wav) -> voz final SIN atempo (highpass + loudnorm) + mp3 16 kHz (ASR Groq) + 5 tramos en dB
set -e; S=$(cat slug.txt); R=$GITHUB_REPOSITORY
gh release download aud-$S -R $R -p "${S}_fb00.wav"
ffmpeg -v error -y -i ${S}_fb00.wav -af "highpass=f=60,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 1 -c:a pcm_s16le ${S}_voz.wav
ffmpeg -v error -y -i ${S}_voz.wav -ac 1 -ar 16000 -b:a 48k ${S}_16k.mp3
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ${S}_voz.wav); echo "voz: $D s"
T=""; for p in 0.1 0.3 0.5 0.7 0.9; do ss=$(python3 -c "print($D*$p)"); m=$(ffmpeg -hide_banner -nostats -ss $ss -t 20 -i ${S}_voz.wav -af volumedetect -f null - 2>&1 | grep mean_volume | awk '{print $5}'); T="$T $m"; echo "tramo $p ($ss s): $m dB"; done
gh release upload aud-$S ${S}_voz.wav ${S}_16k.mp3 -R $R --clobber
echo "{\"dur\":$D,\"tramos\":\"$T\"}" > out/voz.json
