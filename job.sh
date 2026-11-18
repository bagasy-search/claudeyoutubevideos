set -e
pip install -q pillow 2>&1 | tail -1
for s in alb14b alb14c; do
  mkdir -p y/$s/g
  python3 -u wm.py $s 2>&1 | tail -400 | tee out/log_$s.txt
  ( cd y && tar -cf ../out/wmf_$s.tar $s )
done
ls -la out
put out/wmf_alb14b.tar out/wmf_alb14c.tar out/fotos_alb14b.json out/fotos_alb14c.json
