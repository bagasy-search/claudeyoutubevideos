#!/bin/bash
# Posproceso de cámara común de las aprobadas en _raw que no llegaron a public/img (agnes_img_pro cortado, p. ej. por disco lleno).
S=$1; W=D:/rtmp/lnet46/agpro_$S/_raw; O=public/img/$S; n=0
PP="scale=1280:720:flags=bicubic,eq=saturation=0.88:contrast=0.95:gamma=1.02,gblur=sigma=0.6,unsharp=3:3:0.4,noise=alls=8:allf=t"
for f in $W/*.png; do b=$(basename $f .png); [ -f $O/$b.png ] || [ -f $O/$b.jpg ] && continue; ffmpeg -v error -y -i $f -vf "$PP" $O/$b.png && n=$((n+1)); done
echo "$S pp_raw: $n"
