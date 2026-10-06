#!/usr/bin/env bash
# Mide la luma media de CADA still del barrido. El barrido por sí solo sólo detecta EXCEPCIONES:
# el bug #6 (overlay puro sin fondo) no tira excepción, renderiza NEGRO en silencio. Esto lo caza.
# Umbral: luma media < 16/255 = prácticamente negro.
set -uo pipefail
DIR="${1:-D:/rtmp/fcsjuanetes_sweep}"
n=0; oscuros=0
for f in "$DIR"/*.png; do
  # ⛔ `metadata=print` escribe a nivel INFO: con `-v error` la línea se suprime y el grep no
  #    encontraba NADA. Como el chequeo era `[ -n "$y" ] && ...`, el script saltaba en silencio
  #    TODOS los stills y siempre imprimía "casi negros 0". Esta compuerta nunca midió un cuadro.
  #    `file=-` manda la metadata a stdout y ya no depende del nivel de log.
  y=$(ffmpeg -v error -i "$f" -vf "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -f null - 2>/dev/null | grep -oE 'YAVG=[0-9.]+' | head -1 | cut -d= -f2)
  if [ -z "$y" ]; then echo "⛔ no se pudo medir la luma de $(basename "$f")"; exit 1; fi
  n=$((n+1))
  if [ -n "$y" ] && awk "BEGIN{exit !($y < 16)}"; then echo "⛔ CASI NEGRO ($y): $(basename "$f")"; oscuros=$((oscuros+1)); fi
done
echo "stills medidos $n · casi negros $oscuros"
# ⛔ COMPUERTA ANTI-FALSO-VERDE: con el directorio VACÍO esto medía 0 stills, reportaba
#    "casi negros 0" y salía 0 — verde perfecto sin haber mirado un solo cuadro. Fue exactamente
#    lo que pasó cuando D: se llenó y el barrido crasheó en bundle() sin renderizar nada.
#    El barrido emite 2 PNG por beat (in + mid); acá se exige que haya llegado algo.
if [ "$n" -lt 2 ]; then
  echo "⛔ el barrido no dejó stills en $DIR ($n): no se midió NADA. Esto NO es un verde."
  exit 1
fi
[ "$oscuros" = 0 ] || exit 1
