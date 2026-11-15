#!/bin/bash
set -e; R=$GITHUB_REPOSITORY
for S in scr15a scr15b; do
  gh release download aud-$S -R $R -p "${S}_av.tar" --clobber; mkdir -p $S && tar -xf ${S}_av.tar -C $S
  L=$(ls $S/a | sort); N=$(echo "$L" | wc -l)
  i=0; for f in $(echo "$L" | awk -v n=$N 'NR==1||NR==int(n*0.5)||NR==int(n*0.7)||NR==int(n*0.85)||NR==n'); do i=$((i+1)); ffmpeg -v error -y -ss 0.5 -i $S/a/$f -frames:v 1 -vf scale=960:-2 -q:v 3 out/${S}_$i.jpg; done
  ffmpeg -v error -y -i out/${S}_1.jpg -i out/${S}_2.jpg -i out/${S}_3.jpg -i out/${S}_4.jpg -i out/${S}_5.jpg -filter_complex "[0][1][2][3][4]vstack=inputs=5" out/${S}_late.jpg
  gh release upload aud-$S out/${S}_late.jpg -R $R --clobber
done
