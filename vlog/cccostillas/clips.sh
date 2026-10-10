#!/bin/bash
# un proceso `clips` por escena (retoma lo que falta si se relanza con ids); todas las claves (AGNES_KEYS_OTRA_PC=",")
cd D:/Proyectos/video2-wt/ccfrijoles; V=vlog/cccostillas
for s in ${@:-chiles chuy comal comal_b costo costo_b glasear licuar mesa_cta1 mesa_err mesa_ing mesa_res olla_a olla_b olla_c preguntas rallar reducir retoma salar salon servir servir_b tacos_a tacos_b}; do
  ( until [ $(ls $V/$s/anc/K*.png 2>/dev/null | grep -v _raw | wc -l) -ge $(python -c "import json;print(len(json.load(open('$V/$s/plan.json'))['anchors']))") ]; do sleep 20; done
    echo "$(date +%T) $s anclas listas → clips" >> $V/chain.log
    AGNES_KEYS_OTRA_PC="," node scripts/agnes_vlog.mjs $V/$s/plan.json clips >> $V/clips_$s.log 2>&1
    echo "$(date +%T) $s clips terminó" >> $V/chain.log ) &
done
wait
