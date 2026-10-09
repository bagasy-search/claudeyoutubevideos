#!/bin/bash
# Red Loretta 4-6 — fase B/C de UN video: guion filmado → voz Fish (loretta, speed 1.0) → minuto 1 sin pausas → ASR Modal →
# alineación → director automático → tomas → páginas/QR → reel del avatar → /run de RunPod (UN job, desacoplado).
# uso: bash vlog/loretta/net_voice.sh <slug>   (log en out/voice_<slug>.log; corta en el primer error)
S=$1; cd D:/Proyectos/video2-wt/lnet46 || exit 1; export SLUG=$S PYTHONUTF8=1 AV_AUTO=0.01
log() { echo "$(date -u +%T) [$S] $*"; }
set -e
python vlog/loretta/chk_guion.py $S
python vlog/loretta/mk_guion.py
if [ ! -f public/${S}_fish.wav ]; then
  python fish_factory.py --script guiones/${S}_voz.txt --voice loretta --out out/$S --concurrency 4
  cp out/$S/master.wav public/${S}_fish.wav
fi
python vlog/loretta/compress_hook.py public/${S}_fish.wav public/$S.wav 60
ffmpeg -v error -y -i public/$S.wav -ac 1 -ar 16000 public/${S}_16k.wav
ffmpeg -v error -y -i public/$S.wav -c:a aac -b:a 160k public/$S.m4a
log "voz $(ffprobe -v error -show_entries format=duration -of csv=p=0 public/$S.wav) s"
for t in 1 2 3; do
  timeout 1500 modal run modal_whisper.py --slug $S --lang en > out/modal_$S.log 2>&1 && [ -s public/captions_$S.json ] && break
  log "modal intento $t falló"; sleep 30
done
[ -s public/captions_$S.json ]
python vlog/loretta/align.py
python vlog/loretta/paras.py > /dev/null
node vlog/loretta/autodir.mjs
node vlog/loretta/timeline.mjs
python vlog/loretta/pages.py
node vlog/loretta/avatar_run.mjs build
python -c "import json,sys;r=json.load(open('_v3/${S}_avwin.json'))['reel'];print('reel',r);sys.exit(0 if r<=590 else 1)"
log "avatar: /run desacoplado"
node vlog/loretta/avatar_run.mjs run > out/avatar_$S.log 2>&1 &
log "VOZ+DIRECTOR LISTOS"
