#!/usr/bin/env bash
# AUDITOR e7h v2 — contact sheets del MP4 que rindió el farm (ffmpeg local, liviano).
FF="C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe"
MP4="${1:-D:/videosdeclaude/e7h.mp4}"
OUT=_e7h_a2
mkdir -p $OUT

shot () { n=$(python -c "print(round($2*30))"); "$FF" -y -v error -i "$MP4" -vf "select=eq(n\,$n)" -vsync 0 -frames:v 1 -q:v 3 "$OUT/t_$1.jpg"; }

# un frame por cada beat de diseño (los que tienen overlay)
shot 01_hero        1.20   # label arriba-izq (Baalbek)
shot 02_num         2.60   # BigNumber 1000 TON subiendo
shot 03_planes      5.60   # 3 aviones + numero (chequeo de pisado)
shot 04_chips       12.30  # chips proceso
shot 04b_megalito   13.20  # megalito Baalbek (reemplaza la cantera)
shot 05_gap         15.40  # tarjeta < 1 mm
shot 06_time        17.60  # linea de tiempo
shot 07_crane       20.60  # label grua
shot 08_bars        24.60  # barras + estampa roja
shot 09_reticle_pe  27.20  # reticle Peru
shot 10_blade       30.60  # prueba del cuchillo
shot 11_cemento     32.90  # estampa sin cemento
shot 12_argamasa    34.80  # estampa sin argamasa
shot 13_reticle_eg  37.60  # reticle Egipto
shot 14_level       43.20  # nivelacion + 2 CM
shot 15_k1          48.90  # kinetic quien? tachado
shot 16_stars       51.60  # el giro (brillo del cielo)
shot 17_k2          56.20  # kinetic repetirlas
shot 18_flash1      57.85  # flash 1
shot 19_flash4      58.60  # flash 4
shot 20_flash7      59.35  # flash 7
shot 21_title       61.00  # tarjeta titulo
shot 22_band        63.40  # banda dorada "imposibles"

"$FF" -y -v error \
 -i $OUT/t_01_hero.jpg -i $OUT/t_02_num.jpg -i $OUT/t_03_planes.jpg -i $OUT/t_04_chips.jpg \
 -i $OUT/t_05_gap.jpg  -i $OUT/t_06_time.jpg -i $OUT/t_07_crane.jpg -i $OUT/t_08_bars.jpg \
 -i $OUT/t_09_reticle_pe.jpg -i $OUT/t_10_blade.jpg -i $OUT/t_11_cemento.jpg -i $OUT/t_12_argamasa.jpg \
 -filter_complex "[0]scale=640:360[a];[1]scale=640:360[b];[2]scale=640:360[c];[3]scale=640:360[d];[4]scale=640:360[e];[5]scale=640:360[f];[6]scale=640:360[g];[7]scale=640:360[h];[8]scale=640:360[i];[9]scale=640:360[j];[10]scale=640:360[k];[11]scale=640:360[l];[a][b][c]hstack=3[r1];[d][e][f]hstack=3[r2];[g][h][i]hstack=3[r3];[j][k][l]hstack=3[r4];[r1][r2][r3][r4]vstack=4" \
 -frames:v 1 -q:v 4 $OUT/sheetA.jpg

"$FF" -y -v error \
 -i $OUT/t_13_reticle_eg.jpg -i $OUT/t_14_level.jpg -i $OUT/t_15_k1.jpg -i $OUT/t_16_stars.jpg \
 -i $OUT/t_17_k2.jpg -i $OUT/t_18_flash1.jpg -i $OUT/t_19_flash4.jpg -i $OUT/t_20_flash7.jpg \
 -i $OUT/t_21_title.jpg -i $OUT/t_22_band.jpg \
 -filter_complex "[0]scale=640:360[a];[1]scale=640:360[b];[2]scale=640:360[c];[3]scale=640:360[d];[4]scale=640:360[e];[5]scale=640:360[f];[6]scale=640:360[g];[7]scale=640:360[h];[8]scale=640:360[i];[9]scale=640:360[j];[a][b][c]hstack=3[r1];[d][e][f]hstack=3[r2];[g][h][i]hstack=3[r3];[r1][r2][r3]vstack=3[top];[j]pad=1920:360:0:0[r4];[top][r4]vstack=2" \
 -frames:v 1 -q:v 4 $OUT/sheetB.jpg

echo "sheets: $OUT/sheetA.jpg  $OUT/sheetB.jpg"
