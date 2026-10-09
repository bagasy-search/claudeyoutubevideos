#!/bin/bash
# Voz + ASR de un video de la red Loretta (worktree lnet): mk_guion → Fish `loretta` (speed 1.0) → compress_hook (pausas del min 1)
# → 16k → Modal whisper (en) → align (difflib global) → paras → m4a. uso: bash vlog/lnet/voz.sh <slug>   (log en out/voz_<slug>.log)
S=$1; cd D:/Proyectos/video2-wt/lnet; export SLUG=$S PYTHONUTF8=1
log() { echo "$(date -u +%T) [$S] $*"; }
log "inicio"
python vlog/loretta/mk_guion.py || { log "mk_guion falló"; exit 1; }
[ -f out/$S/master.wav ] || python fish_factory.py --script guiones/${S}_voz.txt --voice loretta --out out/$S --concurrency 3 || { log "fish falló"; exit 1; }
[ -f out/$S/master.wav ] || { log "sin master.wav"; exit 1; }
cp out/$S/master.wav public/${S}_fish.wav
python vlog/loretta/compress_hook.py public/${S}_fish.wav public/${S}.wav 60 || exit 1
ffmpeg -v error -y -i public/$S.wav -ac 1 -ar 16000 public/${S}_16k.wav
ok=0; for t in 1 2 3; do modal run modal_whisper.py --slug $S --lang en && { ok=1; break; }; log "modal intento $t falló"; sleep 60; done
[ $ok = 1 ] || { log "ASR falló"; exit 1; }
python vlog/loretta/align.py > out/align_$S.log 2>&1 || { log "align falló"; exit 1; }
python vlog/loretta/paras.py > out/paras_$S.log 2>&1 || { log "paras falló"; exit 1; }
ffmpeg -v error -y -i public/$S.wav -c:a aac -b:a 192k public/$S.m4a
log "VOZ+ASR OK · $(ffprobe -v error -show_entries format=duration -of csv=p=0 public/$S.wav) s · $(head -1 out/align_$S.log)"
