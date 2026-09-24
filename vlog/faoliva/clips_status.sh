cd /d/Proyectos/video2-wt/faoliva/vlog/faoliva; tot=0
for s in S1 S2 S3 S4 S5 S6 S7 S8 S9 S10 S11; do n=$(python -c "import json,os;p='$s/clips/state.json';print(len(json.load(open(p))) if os.path.exists(p) else 0)"); tot=$((tot+n)); echo -n "$s:$n $(tail -n1 loop_$s.log 2>/dev/null | grep -o 'FIN\|check [0-9]: malos = .*' | head -c 60) | "; done; echo; echo "TOTAL $tot/184"
