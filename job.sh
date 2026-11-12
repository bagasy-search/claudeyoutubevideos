# voz Fish cruda (boone01_fish_raw.wav en assets-boone01) → atempo + loudnorm 2 pasadas → boone01_voz.wav (48k mono) + mp3 64k para el ASR de Groq
set -e
get "${S}_fish_raw.wav"
T=$(cat TEMPO)
D0=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${S}_fish_raw.wav")
M=$(ffmpeg -hide_banner -i "${S}_fish_raw.wav" -af "atempo=$T,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | tail -30)
I=$(echo "$M" | python3 -c "import sys,json,re;j=json.loads(re.search(r'\{.*\}',sys.stdin.read(),re.S).group(0));print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i "${S}_fish_raw.wav" -af "atempo=$T,loudnorm=I=-16:TP=-1.5:LRA=11:$I:linear=true" -ar 48000 -ac 1 -c:a pcm_s16le "out/${S}_voz.wav"
ffmpeg -v error -y -i "out/${S}_voz.wav" -ar 16000 -ac 1 -c:a libmp3lame -b:a 64k "out/${S}_voz_asr.mp3"
D1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "out/${S}_voz.wav")
ffmpeg -hide_banner -i "out/${S}_voz.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 > out/voz_medido.txt
echo "cruda ${D0}s · tempo $T · final ${D1}s" | tee -a out/voz_medido.txt; cat out/voz_medido.txt
put "out/${S}_voz.wav" "out/${S}_voz_asr.mp3" out/voz_medido.txt
