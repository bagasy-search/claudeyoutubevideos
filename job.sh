set -e
export SH=s22
python3 clips.py lista.json
cd out && tar cf ../clips_${S}_${SH}.tar c && cd ..
mv clips_${S}_${SH}.tar out/ && tar cf out/hojas_${S}_${SH}.tar -C out $(cd out && ls hoja_* meta_*)
put out/clips_${S}_${SH}.tar out/hojas_${S}_${SH}.tar
