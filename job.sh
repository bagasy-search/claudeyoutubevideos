set -e
get "${S}_voz.wav"
mkdir -p pub/${S} pub/sfx
get "y_${S}.tar"; tar -xf "y_${S}.tar" -C pub/${S}
cp sfx/*.mp3 pub/sfx/
python3 mix.py
ffmpeg -hide_banner -i "out/${S}_mix.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 | tee out/mix_medido.txt
python3 medir.py | tee -a out/mix_medido.txt
ffmpeg -v error -y -i "out/${S}_mix.wav" -c:a aac -b:a 192k "out/${S}_mix.m4a"
cp "out/${S}_mix.wav" "out/${S}_mixkeep.wav"
put "out/${S}_mix.wav" "out/${S}_mix.m4a"
put "out/${S}_mixkeep.wav" out/mix_medido.txt out/clip_audio.json
