#!/bin/bash
# Estado de la temporada: bash vlog/hh/st.sh
cd /d/Proyectos/video2-wt/lhh
for s in hhdollar hhwinter hhexpire hhfreeze hhgrocery hhscraps hhvinegar hhperox hhtoilet hhnever; do
  v=$([ -f out/voz_$s.done ] && echo voz✓ || echo voz…)
  a=$(tail -n1 out/${s}_avatar/run.log 2>/dev/null | cut -c1-60)
  i=$(ls public/img/$s/*.jpg 2>/dev/null | wc -l); c=$(ls public/broll/$s/*.mp4 2>/dev/null | wc -l)
  echo "$s $v img:$i clips:$c av:[$a]"
done
echo "gpt: $(ls public/img/_hh_lor/*.png 2>/dev/null | wc -l)/127 · agnes: $(ls public/img/_hh_agnes/*.png 2>/dev/null | wc -l)/816 · $(tail -c 150 out/agnes_img.log | tr '\n' ' ')"
