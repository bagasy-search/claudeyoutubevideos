#!/usr/bin/env bash
# run_e7hdoc.sh — cadena completa del documental, desde el .wav del TTS hasta disparar el farm.
# Cada paso es una COMPUERTA: si falla, corta y dice por qué. Uso: bash run_e7hdoc.sh
set -e
cd "$(dirname "$0")"
BIN="C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin"

say () { echo ""; echo "════ $* ════"; }

# ── 0 · el VO tiene que existir y durar lo que esperamos ──
say "0 · VO"
[ -f public/e7hdoc.wav ] || { echo "⛔ falta public/e7hdoc.wav"; exit 1; }
VODUR=$("$BIN/ffprobe.exe" -v error -show_entries format=duration -of csv=p=0 public/e7hdoc.wav)
echo "VO: ${VODUR}s"
awk -v d="$VODUR" 'BEGIN{if(d<1000){print "⛔ el VO dura menos de 1000s: el TTS quedó corto"; exit 1}}'

# ── 1 · Whisper: captions palabra por palabra ──
say "1 · Whisper"
WHISPER_LANG=es node transcribe_cuda.mjs e7hdoc
[ -f public/captions_e7hdoc.json ] || { echo "⛔ Whisper no dejó captions"; exit 1; }

# ── 2 · resolver las 136 anclas contra las captions reales ──
say "2 · anclas -> timeline"
node build_e7hdoc.mjs | tee _e7hdoc_build.log
grep -q "ANCLAS NO ENCONTRADAS" _e7hdoc_build.log && echo "⚠ hay anclas sin resolver (ver arriba) — sigo igual, esos beats se saltean"

# ── 3 · mezcla (SFX derivados del timeline) ──
say "3 · mezcla"
node mix_e7hdoc.mjs
[ -f public/e7hdoc_mix.wav ] || { echo "⛔ no salió la mezcla"; exit 1; }

# ── 4 · toda imagen necesita su _blur.jpg (el kit lo pide en runtime) ──
say "4 · preblur"
for f in public/img/e7hd_*.jpg; do
  case "$f" in *_blur.jpg) continue;; esac
  b="${f%.jpg}_blur.jpg"
  [ -f "$b" ] || "$BIN/ffmpeg.exe" -y -v error -i "$f" -vf "scale=480:-1,gblur=sigma=18,scale=1920:1080" -q:v 6 "$b"
done
echo "blurs: $(ls public/img/e7hd_*_blur.jpg | wc -l)"

# ── 5 · lista de assets del farm (solo lo que el timeline usa de verdad) ──
say "5 · assets"
node -e "
const fs=require('fs');
const tl=JSON.parse(fs.readFileSync('_v3/e7hdoc_timeline.json','utf8'));
const set=new Set(['e7hdoc_mix.wav']);
for(const b of tl.beats){
  set.add(b.bg.src);
  if(b.bg.src.endsWith('.jpg')) set.add(b.bg.src.replace('.jpg','_blur.jpg'));
}
const l=[...set].sort();
const falta=l.filter(a=>!fs.existsSync('public/'+a));
if(falta.length){console.error('⛔ FALTAN:',falta.join(' ')); process.exit(1);}
fs.writeFileSync('_e7hdoc_assets.txt', l.join('\n')+'\n');
console.log(l.length+' assets, todos presentes');
"

# ── 6 · la comp tiene que listar ──
say "6 · composición"
TEMP=D:/rtmp/tmp TMP=D:/rtmp/tmp npx remotion compositions src/index_e7hdoc.tsx 2>&1 | grep -E "^E7hdoc" || { echo "⛔ E7hdoc no aparece"; exit 1; }

# ── 7 · git + farm ──
say "7 · farm"
FRAMES=$(node -e "console.log(require('./_v3/e7hdoc_timeline.json').totalFrames)")
echo "frames: $FRAMES"
git add src/VideoEdit/Main_e7hdoc.tsx src/VideoEdit/e7hdoc_kit.tsx src/VideoEdit/e7hdoc_timeline.gen.ts \
        src/index_e7hdoc.tsx e7hdoc_beats.mjs build_e7hdoc.mjs mix_e7hdoc.mjs run_e7hdoc.sh \
        e7h_doc_guion.txt e7h_DOC_MAPA.md encode_e7hdoc.mjs fetch_e7hdoc_*.mjs _e7hdoc_assets.txt
git commit -q -m "e7hdoc: documental 25 min — timeline anclado a Whisper, kit ampliado" || echo "(sin cambios que commitear)"
git branch -f molino-v1 HEAD && git push -f -q origin molino-v1
echo "HEAD      $(git rev-parse HEAD)"
echo "molino-v1 $(git rev-parse origin/molino-v1)"

ENTRY=src/index_e7hdoc.tsx FARM_REF=molino-v1 TAR_DIR=/d \
  node scripts/farm.mjs e7hdoc E7hdoc "$FRAMES" 60 @_e7hdoc_assets.txt

say "LISTO — farm disparado"
