#!/bin/bash
# mix: audio final (voz+piano, camas de los clips Veo, SFX por cuadro) → <slug>_mix.wav en assets-<slug> (lo usa encfin) y en aud-<slug>
set -e; S=mabel01; R=$GITHUB_REPOSITORY
gh release download aud-$S -R $R -p "$S.wav" -p "${S}_veo.tar" -p "${S}_sfx.tar"
mkdir -p public/$S && tar -xf ${S}_veo.tar -C public/$S && tar -xf ${S}_sfx.tar -C public/$S
gh release download aud-$S -R $R -p "${S}_veofix.tar" 2>/dev/null && { tar -xf ${S}_veofix.tar && cp fix/*.mp4 public/$S/v/; } || true
python3 mix.py
if [ -f ${S}_mix.wav ]; then
  ffmpeg -v error -y -i ${S}_mix.wav -c:a aac -b:a 192k ${S}_mix.m4a
  gh release upload aud-$S ${S}_mix.wav -R $R --clobber
  gh release view assets-$S -R $R >/dev/null 2>&1 && gh release upload assets-$S ${S}_mix.wav -R $R --clobber || echo "assets-$S todavía no existe: subir el mix después del farm"
else
  gh release upload aud-$S out/${S}_beds_all.mp3 out/${S}_beds.json -R $R --clobber
fi
