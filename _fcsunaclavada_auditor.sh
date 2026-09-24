#!/usr/bin/env bash
# AUDITOR fcsunaclavada — compuerta §4 del video-pipeline. Uso: bash _fcsunaclavada_auditor.sh <mp4>
set -uo pipefail
export PATH="/c/Users/bauti/AppData/Local/Microsoft/WinGet/Links:$PATH"
MP4="${1:?falta el mp4}"
OUT=_audit_fcsunaclavada
mkdir -p "$OUT"
FALLO=0

echo "== 1. duración vs wav máster =="
DV=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
DA=$(ffprobe -v error -show_entries format=duration -of csv=p=0 public/fcsunaclavada.wav)
echo "  video ${DV}s · wav ${DA}s · delta $(python -c "print(round(abs($DV-$DA),2))")s"

echo "== 2. stream =="
ffprobe -v error -select_streams v -show_entries stream=width,height,r_frame_rate,nb_frames,pix_fmt -of default=nw=1 "$MP4"
ffprobe -v error -select_streams a -show_entries stream=codec_name,sample_rate,channels -of default=nw=1 "$MP4"

echo "== 3. blackdetect — CRITERIO DE FALLO (d=0.2, pix_th=0.10) =="
# ⛔ La versión vieja corría d=0.5:pix_th=0.06 y daba SIEMPRE 0 tramos: un falso PASS.
#    - `pix_th=0.06` sólo cuenta como negro el píxel por debajo de luma 15, y el fondo del
#      canal (#08110F, luma ~14) queda justo en el borde → nada califica.
#    - `d=0.5` además ignora todo tramo menor a medio segundo, y los de este bug son de
#      0,20 a 0,30 s.
#    Con el criterio real (pix_th=0.10 = el default de ffmpeg) el mismo mp4 de fcsunaclavada
#    que "pasaba" con 0 tramos da 57. Ver _BUGS_fed6_integracion.md #6.
#    ⚠ volumedetect/blackdetect imprimen a nivel INFO: con `-v error` no sale NADA.
BD=$(ffmpeg -v info -hide_banner -nostats -i "$MP4" -vf blackdetect=d=0.2:pix_th=0.10 -an -f null - 2>&1 | grep -c black_start)
echo "  tramos negros: $BD"
ffmpeg -v info -hide_banner -nostats -i "$MP4" -vf blackdetect=d=0.2:pix_th=0.10 -an -f null - 2>&1 | grep black_start | head -10
if [ "$BD" -gt 0 ]; then
  echo "  ⛔ FALLA: hay $BD tramos negros. NO SE ENTREGA."
  echo "     Cada uno cae en el arranque de un cue de componente que no tiene footage debajo."
  FALLO=1
fi

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
# fcsunaclavada no tiene _avwindows.json: saco los instantes de las ventanas de avatar del plan.
node -e '
const p=require("./_v3/fcsunaclavada_plan.json");
const av=p.beats.filter(b=>b.tipo==="avatar");
if(!av.length){console.log("");process.exit(0);}
console.log([0,Math.floor(av.length/2),av.length-1].map(i=>((av[i].ms_in+(av[i].ms_out-av[i].ms_in)/2)/1000).toFixed(2)).join(" "));
' > "$OUT/_avt.txt"
i=0
for T in $(cat "$OUT/_avt.txt"); do
  ffmpeg -v error -y -ss "$T" -i "$MP4" -frames:v 1 -vf scale=640:-1 "$OUT/avatar_$i.jpg"; i=$((i+1))
done
ls -la "$OUT"/avatar_*.jpg

echo "== 7. frame del hook y del CTA =="
ffmpeg -v error -y -ss 2 -i "$MP4" -frames:v 1 -vf scale=640:-1 "$OUT/hook.jpg"
# este video no tiene overlays en el plan: si no hay, tomo un frame del ultimo tercio.
CTA=$(node -e 'const p=require("./_v3/fcsunaclavada_plan.json");const o=(p.overlays||[])[0];console.log(o?((o.ms_in+3000)/1000).toFixed(1):(p.totalMs*0.72/1000).toFixed(1));')
ffmpeg -v error -y -ss "$CTA" -i "$MP4" -frames:v 1 -vf scale=640:-1 "$OUT/cta.jpg"
ls -la "$OUT/hook.jpg" "$OUT/cta.jpg"
if [ "$FALLO" -ne 0 ]; then
  echo "== AUDITOR: ⛔ FALLA — no se entrega. Revisá $OUT =="
  exit 1
fi
echo "== AUDITOR: ✅ listo, revisá $OUT =="
