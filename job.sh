set -e
get "${S}_voz.wav"
mkdir -p pub/${S}/y pub/sfx
for t in $(gh release view "insumos-$S" -R "$R" --json assets --jq '.assets[].name' | grep -E "^clips_${S}_s[0-9]+\.tar$"); do get "$t"; tar -xf "$t"; done
[ -d c ] && cp c/*.mp4 pub/${S}/y/ 2>/dev/null || true
cp sfx/*.mp3 pub/sfx/
if gh release view "insumos-$S" -R "$R" --json assets --jq '.assets[].name' | grep -qx "v_${S}.tar"; then get "v_${S}.tar"; tar -xf "v_${S}.tar" -C pub/${S}; fi
python3 mix.py
ffmpeg -hide_banner -i "out/${S}_mix.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 | tee out/mix_medido.txt
python3 medir.py | tee -a out/mix_medido.txt
ffmpeg -v error -y -i "out/${S}_mix.wav" -c:a aac -b:a 192k "out/${S}_mix.m4a"
put "out/${S}_mix.wav" "out/${S}_mix.m4a" out/mix_medido.txt out/clip_audio.json
