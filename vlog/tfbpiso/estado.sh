#!/bin/bash
# estado de anclas y clips por escena
cd D:/Proyectos/video2-wt/tfbpiso
for p in vlog/tfbpiso/plan_*.json; do s=$(basename $p .json | sed 's/plan_//'); [ "$s" = BASE ] && continue
 na=$(node -e "console.log(require('./$p').anchors.length)"); nc=$(node -e "console.log(require('./$p').clips.length)")
 ha=$(ls vlog/tfbpiso/$s/anc/K*.png 2>/dev/null | grep -v raw | wc -l)
 hc=$(node -e "const fs=require('fs');let n=0;for(const f of ['state.json','state_det.json']){const p='vlog/tfbpiso/$s/clips/'+f;if(fs.existsSync(p))n+=Object.keys(JSON.parse(fs.readFileSync(p))).length}console.log(n)")
 echo "$s anclas $ha/$na clips $hc/$nc"
done
