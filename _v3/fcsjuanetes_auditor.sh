#!/usr/bin/env bash
# fcsjuanetes_auditor.sh — AUDITOR completo sobre el mp4 YA re-encodeado de entrega.
#   bash _v3/fcsjuanetes_auditor.sh <entrega.mp4>
# Produce _audit_fcsjuanetes/: contact sheet (UNA grilla, baja resolución), blackdetect, audio medido
# en varios puntos, duración vs. wav máster, y frames reales del avatar para chequear el encuadre.
set -uo pipefail
cd /c/Users/bauti/Downloads/video2
MP4="${1:?falta el mp4}"
OUT="_audit_fcsjuanetes"
mkdir -p "$OUT"
WAV_S=$(ffprobe -v error -show_entries format=duration -of csv=p=0 public/fcsjuanetes.wav)
VID_S=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
echo "== DURACIÓN =="
echo "wav máster ${WAV_S}s · mp4 ${VID_S}s · delta $(python -c "print(round(float('$VID_S')-float('$WAV_S'),2))")s"
ffprobe -v error -select_streams v -show_entries stream=width,height,r_frame_rate,pix_fmt,color_range,color_primaries -of default=nw=1 "$MP4"
ffprobe -v error -select_streams a -show_entries stream=channels,sample_rate,codec_name -of default=nw=1 "$MP4"

echo "== NEGROS =="
# ⚠ blackdetect imprime a nivel INFO (igual que volumedetect): con `-v error` NO sale nada y el
#   auditor reporta "0 tramos negros" en un video lleno de negro. Ver _BUGS_fed6_integracion.md.
# ⛔ d=0.2, no 0.5: los negros del bug de overlay-puro duran ~0,3 s (5 en fcsunaclavada YA
#   ENTREGADO, 12 en fcspuntos) y con d=0.5 NO los ve. Cualquier tramo = NO SE ENTREGA.
# ⚠ pix_th=0.06 NO SIRVE en este canal: el fondo #08110F tiene luma ~14, así que un tramo
# negro de verdad no baja del umbral y blackdetect devuelve 0 tramos. Medido sobre el MISMO mp4:
# 0.06 → 0 tramos · 0.10 → 57 tramos. Va 0.10.
# ⛔ REGLA (_BUGS_fed6_integracion.md): una compuerta que da verde tiene que poder decir CUÁNTAS
#    cosas midió. "0 tramos negros" es un conteo de HALLAZGOS, no de trabajo hecho: si ffmpeg
#    falla, NEG=0 se lee igual que un verde legítimo. Se guarda la salida CRUDA y se exige que
#    blackdetect haya decodificado el mp4 entero (frame= final ≈ los frames del video).
ffmpeg -v info -hide_banner -nostats -i "$MP4" -vf "blackdetect=d=0.2:pix_th=0.10" -an -f null - > "$OUT/_black_raw.txt" 2>&1
grep black_start "$OUT/_black_raw.txt" > "$OUT/_black.txt" || true
NEG=$(grep -c black_start "$OUT/_black.txt")
FRAMES_VISTOS=$(grep -oE 'frame= *[0-9]+' "$OUT/_black_raw.txt" | tail -1 | grep -oE '[0-9]+')
FRAMES_MP4=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$MP4" 2>/dev/null | tr -d '\r')
echo "blackdetect decodificó ${FRAMES_VISTOS:-0} cuadros · el mp4 tiene ${FRAMES_MP4:-?}"
if [ -z "$FRAMES_VISTOS" ] || [ "${FRAMES_VISTOS:-0}" -lt 1000 ]; then
  echo "⛔⛔ blackdetect NO midió el video (${FRAMES_VISTOS:-0} cuadros). Esto NO es un verde."; exit 1
fi
echo "tramos negros >=0,2s: $NEG"
head -10 "$OUT/_black.txt"
if [ "$NEG" != "0" ]; then echo "⛔⛔ COMPUERTA DE NEGROS: FALLA — $NEG tramo(s). NO SE ENTREGA."; FALLA_NEGROS=1; else echo "✓ compuerta de negros OK"; FALLA_NEGROS=0; fi

echo "== AUDIO en 7 puntos =="
# ⚠ volumedetect también imprime a nivel INFO → `-v error` daba "SIN AUDIO" siempre (falso positivo).
for p in 5 300 800 1300 1800 2300 2680; do
  v=$(ffmpeg -v info -hide_banner -nostats -ss $p -t 8 -i "$MP4" -map 0:a:0 -af volumedetect -f null - 2>&1 | grep mean_volume | awk '{print $5,$6}')
  echo "  t=${p}s  mean=${v:-SIN AUDIO}"
done

echo "== CONTACT SHEET (una grilla, baja resolución) =="
ffmpeg -v error -y -i "$MP4" -vf "fps=1/48,scale=200:113,tile=8x6" -frames:v 1 "$OUT/sheet_final.jpg"
ls -la "$OUT/sheet_final.jpg"

echo "== ENCUADRE DEL AVATAR (frames reales de 3 ventanas) =="
node -e "
const p=require('./_v3/fcsjuanetes_plan.json');
const av=p.beats.filter(b=>b.tipo==='avatar');
const pick=[av[0],av[Math.floor(av.length/2)],av[av.length-1]].filter(Boolean);
console.log(pick.map(b=>((b.ms_in+800)/1000).toFixed(2)).join(' '));" > "$OUT/_avts.txt"
i=0; for t in $(cat "$OUT/_avts.txt"); do i=$((i+1)); ffmpeg -v error -y -ss "$t" -i "$MP4" -frames:v 1 -vf scale=640:-1 "$OUT/avatar_$i.jpg"; done
ls "$OUT"/avatar_*.jpg
echo "== FIN AUDITOR =="
# el AUDITOR sale != 0 si la compuerta de negros falló: no se entrega un mp4 con negros.
if [ "${FALLA_NEGROS:-0}" != "0" ]; then echo "⛔ AUDITOR EN ROJO (negros). NO copiar a D:/videosdeclaude/."; exit 1; fi
echo "✓ AUDITOR EN VERDE"
