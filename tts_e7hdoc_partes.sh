#!/usr/bin/env bash
# tts_e7hdoc_partes.sh — PLAN B: genera la narración bloque por bloque, con progreso VISIBLE
# y reanudable (saltea los que ya existen). Al final concatena todo en public/e7hdoc.wav.
# Misma voz e instrucción que el hook, así que el timbre no cambia.
cd "$(dirname "$0")"
PY="D:/AI/qwenenv/Scripts/python.exe"
BIN="C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin"
OUT=_e7hdoc_partes

for f in $OUT/*.txt; do
  n=$(basename "$f" .txt)
  w="$OUT/$n.wav"
  if [ -f "$w" ]; then echo "✓ $n (ya estaba)"; continue; fi
  echo "▶ $n  ($(wc -w < "$f") palabras)  $(date +%H:%M:%S)"
  PYTHONUTF8=1 "$PY" gen_qwen3.py --mode design --instruct e7h_instruct.txt \
    --text "$f" --out "$w" --lang es --gap-sentence 0.32 --gap-para 0.6 --breath 0.03 \
    > "$OUT/$n.log" 2>&1
  if [ -f "$w" ]; then
    echo "  ✓ $n -> $("$BIN/ffprobe.exe" -v error -show_entries format=duration -of csv=p=0 "$w")s"
  else
    echo "  ⛔ $n FALLÓ — ver $OUT/$n.log"; tail -5 "$OUT/$n.log"; exit 1
  fi
done

# concatenar en orden, con medio segundo de aire entre bloques
echo ""
echo "concatenando..."
ls $OUT/*.wav | sort > $OUT/_lista.txt
"$BIN/ffmpeg.exe" -y -v error -f lavfi -t 0.5 -i anullsrc=r=24000:cl=mono $OUT/_sil.wav
: > $OUT/_concat.txt
while read -r w; do
  echo "file '$(basename "$w")'" >> $OUT/_concat.txt
  echo "file '_sil.wav'"         >> $OUT/_concat.txt
done < $OUT/_lista.txt
"$BIN/ffmpeg.exe" -y -v error -f concat -safe 0 -i $OUT/_concat.txt -c copy public/e7hdoc.wav
echo "LISTO -> public/e7hdoc.wav  $("$BIN/ffprobe.exe" -v error -show_entries format=duration -of csv=p=0 public/e7hdoc.wav)s"
