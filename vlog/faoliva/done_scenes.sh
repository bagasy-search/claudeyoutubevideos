cd /d/Proyectos/video2-wt/faoliva/vlog/faoliva
for s in S1 S2 S3 S4 S5 S6 S7 S8 S9 S10 S11; do n=$(ls $s/anc 2>/dev/null | grep -cE '^K[0-9]+\.png$'); na=$(python -c "import json;print(len(json.load(open('plan_$s.json',encoding='utf-8'))['anchors']))"); echo -n "$s:$n/$na "; done; echo
