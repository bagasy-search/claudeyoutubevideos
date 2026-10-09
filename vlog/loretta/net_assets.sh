#!/bin/bash
# Red Loretta 4-6 — fase D de UN video (mientras corre el avatar): stock real (Pexels + juez) → imágenes SIN cara por agnes PRO
# (fotos, snapshots de época, anclas de clips y repuesto del stock que no apareció) → clips agnes i2v (2 s a 0,5×) → hojas QC.
# uso: bash vlog/loretta/net_assets.sh <slug>     (lo que ya está en disco se saltea: reanudable)
S=$1; cd D:/Proyectos/video2-wt/lnet46 || exit 1; export SLUG=$S PYTHONUTF8=1
log() { echo "$(date -u +%T) [$S] $*"; }
mkdir -p public/img/$S
node vlog/loretta/stock.mjs > out/stock_$S.log 2>&1; log "stock: $(tail -1 out/stock_$S.log)"
python - <<EOF
import json, os
S = "$S"; n = json.load(open(f"_v3/{S}_need.json", encoding="utf8"))
have = lambda nm: any(os.path.exists(f"public/img/{S}/{nm}.{e}") for e in ("png", "jpg"))
lst = [{"name": i["name"], "prompt": i["prompt"]} for i in n["imgs"]]
lst += [{"name": "K" + c["name"], "prompt": c["prompt"]} for c in n["clips"]]
lst += [{"name": s["name"], "prompt": s["prompt"]} for s in n["stock"] if not os.path.exists(f"public/broll/{S}_st/{s['name']}.mp4")]
lst = [x for x in lst if not have(x["name"])]
json.dump(lst, open(f"_v3/{S}_agimg.json", "w", encoding="utf8"), indent=0, ensure_ascii=False)
json.dump([{"nombre": "K" + c["name"], "motion": c["motion"], "gente": bool(c.get("hands"))} for c in n["clips"]], open(f"_v3/{S}_agnes_clips.json", "w", encoding="utf8"), indent=0, ensure_ascii=False)
print("imágenes a pedir:", len(lst), "· clips:", len(n["clips"]))
EOF
[ "$(python -c "import json;print(len(json.load(open('_v3/${S}_agimg.json',encoding='utf8'))))")" = "0" ] || \
  node scripts/agnes_img_pro.mjs _v3/${S}_agimg.json public/img/$S --conc ${AGNES_IMG_CONC:-9} --work D:/rtmp/lnet46/agpro_$S > out/agimg_$S.log 2>&1
log "imágenes: $(grep -a MEDIDO out/agimg_$S.log | tail -1)"
cp _v3/${S}_agnes_clips.json _v3/${S}_i2v_list.json  # agnes_qc lee las listas i2v por este nombre
AG_MODEL=${AG_MODEL:-agnes-video-2.5-flash} node scripts/agnes_i2v.mjs _v3/${S}_agnes_clips.json $S > out/agclip_$S.log 2>&1
log "clips: $(tail -2 out/agclip_$S.log | tr '\n' ' ')"
log "ASSETS LISTOS (falta QC a ojo: node scripts/agnes_qc.mjs $S)"
