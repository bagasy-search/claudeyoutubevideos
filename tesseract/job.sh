set -x
OUT=$PWD/out
cd tesseract
P=epica.tsrct
$TS project create --project $P
$TS project checkout --project $P --output $OUT/doc0.json
python3 - "$OUT" <<'PY'
import json, sys
O = sys.argv[1]; d = json.load(open(O + '/doc0.json'))
d['dimensions'] = {'width': 1920, 'height': 1080}; d['duration'] = 30
json.dump(d, open(O + '/doc1.json', 'w'))
PY
$TS project commit --project $P --file $OUT/doc1.json > /dev/null
for a in mar everest lirios nube; do $TS project import-asset --project $P --file $PWD/assets/$a.glb --asset-id $a --kind model3d > $OUT/import_$a.json 2>&1; done
python3 build.py && $TS project apply --project $P --actions actions.json > $OUT/apply.json 2>&1; echo "apply $?"
# velocidad real: export de 2 s seguidos en un solo proceso (lo que importa para los 900 cuadros)
s=$(date +%s); timeout 1500 $TS export --project $P --output $OUT/prueba_2s.mp4 --resolution 720p --start-ms 5000 --duration-ms 2000 --encoder-backend external-ffmpeg-command --ffmpeg-path $(which ffmpeg) > $OUT/export.json 2>&1; echo "export2s rc=$? $(( $(date +%s) - s )) s"
tail -c 800 $OUT/export.json
for t in 4 12 14 20 27; do s=$(date +%s); timeout 900 $TS preview --project $P --time $t --output $OUT/f_$t.png > /dev/null 2>&1; echo "preview $t rc=$? $(( $(date +%s) - s )) s"; done
