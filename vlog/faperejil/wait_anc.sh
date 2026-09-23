# espera a que alguna escena de la lista termine sus anclas; imprime cuál
cd /d/Proyectos/video2-wt/faperejil
while true; do for s in "$@"; do n=$(ls vlog/faperejil/$s/anc/ | grep -c '^K[0-9]*\.png'); na=$(python -c "import json;print(len(json.load(open('vlog/faperejil/plan_$s.json'))['anchors']))"); if [ $n -ge $na ]; then echo $s; exit 0; fi; if grep -qE "Error|falló" vlog/faperejil/anclas_$s.log; then echo "ERR $s"; exit 1; fi; done; sleep 20; done
