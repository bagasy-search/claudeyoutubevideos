#!/bin/bash
# un proceso `clips` por escena (retoma lo que falta si se relanza con ids); todas las claves (AGNES_KEYS_OTRA_PC=",")
cd D:/Proyectos/video2-wt/ccfrijoles; V=vlog/ccfrijoles
for s in ${@:-salon mesa_err mesa_hist mesa_limpia estufa_a estufa_b estufa_c pica estufa_d estufa_e servir estufa_res mesa_cta1 chuy preguntas sarten_a sarten_b costo costo_b}; do
  ( until [ $(ls $V/$s/anc/K*.png 2>/dev/null | grep -v _raw | wc -l) -ge $(python -c "import json;print(len(json.load(open('$V/$s/plan.json'))['anchors']))") ]; do sleep 20; done
    echo "$(date +%T) $s anclas listas → clips" >> $V/chain.log
    AGNES_KEYS_OTRA_PC="," node scripts/agnes_vlog.mjs $V/$s/plan.json clips >> $V/clips_$s.log 2>&1
    echo "$(date +%T) $s clips terminó" >> $V/chain.log ) &
done
wait
