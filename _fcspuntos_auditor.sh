#!/usr/bin/env bash
# AUDITOR fcspuntos — compuerta §4 del video-pipeline. Uso: bash _fcspuntos_auditor.sh <mp4>
set -uo pipefail
export PATH="/c/Users/bauti/AppData/Local/Microsoft/WinGet/Links:$PATH"
MP4="${1:?falta el mp4}"
OUT=_audit_fcspuntos
mkdir -p "$OUT"

echo "== 1. duración vs wav máster =="
DV=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
DA=$(ffprobe -v error -show_entries format=duration -of csv=p=0 public/fcspuntos.wav)
echo "  video ${DV}s · wav ${DA}s · delta $(python -c "print(round(abs($DV-$DA),2))")s"

echo "== 2. stream =="
ffprobe -v error -select_streams v -show_entries stream=width,height,r_frame_rate,nb_frames,pix_fmt -of default=nw=1 "$MP4"
ffprobe -v error -select_streams a -show_entries stream=codec_name,sample_rate,channels -of default=nw=1 "$MP4"

echo "== 3. blackdetect (negros > 0.5s) =="
ffmpeg -v info -i "$MP4" -vf blackdetect=d=0.5:pix_th=0.06 -an -f null - 2>&1 | grep -c black_start || echo "  0 tramos negros"
ffmpeg -v info -i "$MP4" -vf blackdetect=d=0.5:pix_th=0.06 -an -f null - 2>&1 | grep black_start | head -5

echo "== 4. audio medido en 6 puntos (volumedetect por tramo) =="
for T in 30 360 720 1080 1440 1900; do
  M=$(ffmpeg -v info -hide_banner -nostats -ss $T -t 12 -i "$MP4" -map 0:a:0 -af volumedetect -f null - 2>&1 | grep mean_volume | sed 's/.*mean_volume: //')
  echo "  t=${T}s  mean=${M:-SIN AUDIO}"
done

echo "== 5. contact sheet (UNA grilla 6x5, baja resolución) =="
ffmpeg -v error -y -i "$MP4" -vf "fps=30/${DV%.*}*0,select='not(mod(n\,$(python -c "print(int(float('$DV')*30/30))"))',scale=320:-1,tile=6x5" -frames:v 1 "$OUT/contact.jpg" 2>/dev/null || \
ffmpeg -v error -y -i "$MP4" -vf "select='isnan(prev_selected_t)+gte(t-prev_selected_t\,$(python -c "print(round(float('$DV')/30,2))"))',scale=320:-1,tile=6x5" -vsync 0 -frames:v 1 "$OUT/contact.jpg"
ls -la "$OUT/contact.jpg"

echo "== 6. framing del avatar (frames reales de 3 ventanas) =="
node -e '
const w=require("./_v3/fcspuntos_avwindows.json");
console.log([0, Math.floor(w.length/2), w.length-1].map(i=>((w[i].start+ (w[i].end-w[i].start)/2)/1000).toFixed(2)).join(" "));
' > "$OUT/_avt.txt"
i=0
for T in $(cat "$OUT/_avt.txt"); do
  ffmpeg -v error -y -ss "$T" -i "$MP4" -frames:v 1 -vf scale=640:-1 "$OUT/avatar_$i.jpg"; i=$((i+1))
done
ls -la "$OUT"/avatar_*.jpg

echo "== 7. frame del hook y del CTA =="
ffmpeg -v error -y -ss 2 -i "$MP4" -frames:v 1 -vf scale=640:-1 "$OUT/hook.jpg"
CTA=$(node -e 'const p=require("./_v3/fcspuntos_plan.json");const o=p.overlays[0];console.log(((o.ms_in+3000)/1000).toFixed(1));')
ffmpeg -v error -y -ss "$CTA" -i "$MP4" -frames:v 1 -vf scale=640:-1 "$OUT/cta.jpg"
ls -la "$OUT/hook.jpg" "$OUT/cta.jpg"
echo "== AUDITOR: listo, revisá $OUT =="
