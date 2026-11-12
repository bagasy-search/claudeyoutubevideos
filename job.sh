# voz Fish cruda (<slug>_fish_raw.wav en insumos-<slug>) → recorte de silencios de punta + compresión suave + loudnorm 2 pasadas −14 LUFS/−1,5 dBTP (nivel fijo de los carniceros)
# → <slug>_voz.wav (48k mono) + mp3 para el ASR de Groq + medición por 5 tramos (anti-mudo)
set -e
get "${S}_fish_raw.wav"
D0=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${S}_fish_raw.wav")
ffmpeg -v error -y -i "${S}_fish_raw.wav" -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.6,areverse" -ar 48000 -ac 1 trim.wav
C="acompressor=threshold=-20dB:ratio=2.5:attack=15:release=250:makeup=2"
M=$(ffmpeg -hide_banner -i trim.wav -af "$C,loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json" -f null - 2>&1 | tail -30)
I=$(echo "$M" | python3 -c "import sys,json,re;j=json.loads(re.search(r'\{.*\}',sys.stdin.read(),re.S).group(0));print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i trim.wav -af "$C,loudnorm=I=-14:TP=-1.5:LRA=7:$I:linear=true" -ar 48000 -ac 1 -c:a pcm_s16le "out/${S}_voz.wav"
ffmpeg -v error -y -i "out/${S}_voz.wav" -ar 16000 -ac 1 -c:a libmp3lame -b:a 48k "out/${S}_voz_asr.mp3"
D1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "out/${S}_voz.wav")
ffmpeg -hide_banner -i "out/${S}_voz.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 > out/voz_medido.txt
echo "cruda ${D0}s · final ${D1}s" | tee -a out/voz_medido.txt
for f in 0.1 0.3 0.5 0.7 0.9; do ss=$(python3 -c "print($D1*$f)"); echo "tramo $f $(ffmpeg -hide_banner -ss $ss -t 20 -i out/${S}_voz.wav -af volumedetect -f null - 2>&1 | grep mean_volume | sed 's/.*mean_volume/mean/')" >> out/voz_medido.txt; done
ls -l out/${S}_voz_asr.mp3 >> out/voz_medido.txt; cat out/voz_medido.txt
put "out/${S}_voz.wav" "out/${S}_voz_asr.mp3" out/voz_medido.txt
