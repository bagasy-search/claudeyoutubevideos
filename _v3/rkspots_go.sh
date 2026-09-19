#!/usr/bin/env bash
# _v3/rkspots_go.sh — TODO lo que falta de `rkspots`, en orden, el dia que haya cuenta de imagenes.
#
# Estado al cerrar (2026-09-19): guion, voz, alineacion al ms, DIRECTOR (215 planos), metraje REAL,
# cfg, QR y rama de render ESTAN HECHOS. Lo unico que falta son las IMAGENES: la cuenta de OpenAI
# devuelve 401 `account_deactivated`, asi que el paso 1 es el unico bloqueado.
#
#   bash _v3/rkspots_go.sh            # corre todo
#   bash _v3/rkspots_go.sh imagenes   # un paso suelto
set -euo pipefail
cd "$(dirname "$0")/.."
SLUG=rkspots
PASO="${1:-todo}"
corre() { [ "$PASO" = todo ] || [ "$PASO" = "$1" ]; }

# ── 1 · IMAGENES · US$0,406 con las 4 palancas (low + 1088x608 + ref 128x192 + Batch) ───────────
#    112 con ref de cara (/edits, $0,00207) + 103 sin ref (/generations, $0,00169).
#    outDir PRIVADO: `public/img/_gptimg_batches.json` es COMPARTIDO entre sesiones y ya remando
#    211 imagenes de otro slug una vez.
if corre imagenes; then
  node scripts/gptimg_gate.mjs _v3/${SLUG}_imglista.json 1088x608 || true
  node scripts/gptimg.mjs _v3/${SLUG}_imglista.json _v3/${SLUG}/img
fi

# ── 2 · INGESTA: PNG privados -> public/img en JPG + hermano _blur.jpg + aspecto + luma ──────────
corre ingesta && node scripts/rksafe_ingest.mjs ${SLUG} _v3/${SLUG}/img

# ── 3 · CLIPS de agnes (GRATIS): 2 s a 0,5x = 4,033 s @30 CFR. El cupo es por CUENTA: si da 429,
#       esperar y reintentar (puede haber otra sesion generando).
if corre clips; then
  node scripts/agnes_i2v.mjs _v3/${SLUG}_agneslista.json ${SLUG} public/img public/broll/${SLUG}
  rm -f _v3/${SLUG}_agnes_qc.json          # el estado queda cacheado y no re-mide
  QC_IMGDIR=public/img node scripts/agnes_qc.mjs ${SLUG}
fi

# ── 4 · PLAN -> BUILD -> COMPUERTAS. El orden NO se toca: el build ALINEA las fronteras al cuadro
#       y PERSISTE el plan, y las compuertas tienen que leer el MISMO artefacto que se renderiza.
if corre montaje; then
  node scripts/rksafe_plan.mjs ${SLUG}
  node scripts/rksafe_build.mjs ${SLUG}
  node scripts/rksafe_gate_props.mjs ${SLUG}
  node scripts/rksafe_gate_contexto.mjs ${SLUG}
  node scripts/rksafe_gate_timeline.mjs ${SLUG}
fi

# ── 5 · AVATAR: el PLAN va ANTES de disparar. UN solo /run con TODAS las ventanas visibles.
#       US$0,25 flat. ⛔ NUNCA Vast. El reel se conforma a 960x540 (= 1:1 con el panel de
#       RayAvatarWin -> upscale REAL 1,154x) con lanczos + unsharp, tpad 0,25 s y fps=30 DUPLICADO.
#       ⛔ El header MIENTE: se mide el ULTIMO FRAME REAL contra el wav del tramo.
corre avatar && echo "  → ventanas en _v3/${SLUG}_avwins.json (se generan en el paso montaje)"

# ── 6 · FARM. STITCH_RAW=1 (el stitch re-encodea 85-101 min al pedo). Repo bagasy-search.
#       El farm rinde el COMMIT y el tar sale del DISCO: commitear y pushear TODO antes.
if corre farm; then
  echo "  cd /d/rtmp/wt-${SLUG} && ENTRY=src/index_${SLUG}.tsx FARM_REF=${SLUG}-render \\"
  echo "    AUDIO_FILE=${SLUG}.m4a ASSETS_COMPARTIDOS=sfx TAR_DIR=D:/ STITCH_RAW=1 \\"
  echo "    node C:/Users/bauti/Downloads/video2/scripts/farm.mjs ${SLUG} Rkspots <FRAMES> 60 @_${SLUG}_assets.txt"
  echo "  y despues: gh release upload assets-${SLUG} public/${SLUG}.wav --clobber"
fi
