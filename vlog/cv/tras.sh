#!/bin/bash
# Encadena videos: espera que <prev> llegue al farm ("farm lanzado" en su cadena.log), libera lo ya subido de <prev> (vid, avatar, stock) y corre cadena.sh <sig>.
# uso: bash vlog/cv/tras.sh <prev> <sig>
P=$1; S=$2; V=D:/Proyectos/video2-wt
until grep -qE "farm lanzado|⛔" $V/$P/vlog/$P/cadena.log 2>/dev/null; do sleep 30; done
grep -q "⛔" $V/$P/vlog/$P/cadena.log && { echo "⛔ $P falló, no sigo con $S"; exit 1; }
rm -rf $V/$P/public/vid/$P $V/$P/public/avatar_clips/$P $V/$P/public/broll/${P}_st $V/$P/vlog/$P/voz_cut.wav $V/$P/vlog/$P/det_cut.wav
cd $V/$S && bash vlog/cv/cadena.sh $S > vlog/$S/cadena.log 2>&1
