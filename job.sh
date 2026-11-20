#!/bin/bash
# arma assets-cl19e.tar EN LA NUBE (disco local lleno): a_/y_ de insumos + g/sfx/portada/qr (chico) + mezcla → assets-cl19e
set -e
get a_cl19e.tar y_cl19e.tar cl19e_mix.m4a
gh release download assets-cl19e -R $R -p g_cl19e.tar --clobber
mkdir -p P/cl19e && tar xf a_cl19e.tar -C P/cl19e && tar xf y_cl19e.tar -C P/cl19e && tar xf g_cl19e.tar -C P/cl19e && rm a_cl19e.tar y_cl19e.tar g_cl19e.tar
cp cl19e_mix.m4a P/
ls P/cl19e/a | wc -l; ls P/cl19e/y | wc -l; ls P/cl19e/g | wc -l
(cd P && tar cf ../assets-cl19e.tar .)
cp cl19e_mix.m4a cl19e_fish.wav
for f in assets-cl19e.tar cl19e_fish.wav; do for n in 1 2 3 4 5; do gh release upload assets-cl19e $f -R $R --clobber && break; sleep $((n*10)); done; done
ls -la assets-cl19e.tar
