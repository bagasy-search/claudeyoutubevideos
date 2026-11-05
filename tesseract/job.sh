set -x
OUT=$PWD/out
cd tesseract
P=epica.tsrct
$TS project create --project $P
$TS project checkout --project $P --output $OUT/doc0.json
python3 - "$OUT" <<'PY'
import json, sys
O = sys.argv[1]
d = json.load(open(O + '/doc0.json'))
def walk(o, path=''):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ('duration', 'dimensions', 'width', 'height', 'frameRate', 'fps'): print('DOC', path + '/' + k, json.dumps(v)[:120])
            walk(v, path + '/' + k)
    elif isinstance(o, list):
        for i, v in enumerate(o[:3]): walk(v, f'{path}[{i}]')
walk(d)
def fix(o):
    if isinstance(o, dict):
        if 'dimensions' in o and isinstance(o['dimensions'], dict): o['dimensions'].update({'width': 1920, 'height': 1080})
        if 'duration' in o and isinstance(o['duration'], (int, float)) and o['duration'] < 1000: o['duration'] = 30
        for v in o.values(): fix(v)
    elif isinstance(o, list):
        for v in o: fix(v)
fix(d); json.dump(d, open(O + '/doc1.json', 'w'))
PY
$TS project commit --project $P --file $OUT/doc1.json 2>&1 | tail -c 1500
for a in mar everest lirios nube; do
  $TS project import-asset --project $P --file $PWD/assets/$a.glb --asset-id $a --kind model3d > $OUT/import_$a.json 2>&1; echo "import $a $?"; head -c 600 $OUT/import_$a.json; echo
done
python3 build.py && $TS project apply --project $P --actions actions.json > $OUT/apply.json 2>&1; echo "apply $?"
tail -c 3000 $OUT/apply.json
$TS project check --project $P > $OUT/check.json 2>&1; head -c 2000 $OUT/check.json
for t in 0 3 6 9 10.5 11.5 12.5 14 18 22 26 29.5; do
  s=$(date +%s.%N); $TS preview --project $P --time $t --output $OUT/f_$t.png 2>&1 | tail -2; echo "preview $t $(echo "$(date +%s.%N) - $s" | bc) s"
done
ls -la $OUT
