set -x
TS="$TS"
$TS --help > out/help.txt 2>&1
for c in project preview filmstrip export evaluate media; do $TS $c --help > out/help_$c.txt 2>&1; done
$TS project --help 2>&1 | head -50
$TS project schema > out/schema.json 2> out/schema.err
ls -la out
grep -o createFxScene3DLayer out/schema.json | head -1
