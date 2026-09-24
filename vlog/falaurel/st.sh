cd /d/Proyectos/video2-wt/falaurel/vlog/falaurel
for s in S1 S2 S3 S4 S5 S6 S7 S8 S9 S10 S11 S12 S13 T; do n=$(ls $s/anc/ 2>/dev/null | grep -cE '^K[0-9]+\.png$'); na=$(python -c "import json;print(len(json.load(open('plan_$s.json'))['anchors']))"); c=$(python -c "import json,os;print(len(json.load(open('$s/clips/state.json'))) if os.path.exists('$s/clips/state.json') else 0)"); nc=$(python -c "import json;print(len(json.load(open('plan_$s.json'))['clips']))"); echo -n "$s $n/$na c$c/$nc · "; done; echo
tail -1 anclas_all.log; tail -1 anclas_T.log
