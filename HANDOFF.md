# cldescarga — HANDOFF (14-oct 11:50 UTC)
Estado: TODO listo salvo clips agnes (cupo Starter agotado hasta 2026-10-15 00:00 UTC; pool gratis con cola global llena).
- Guion/voz/align/paras ✅ · directores dir_a/b/c ✅ plan_lint ✅ · fotos gpt-image low Batch ✅ (hojas _v3/cldescarga_img*.jpg) · stock ✅
- Avatar RunPod ✅ public/avatar_clips/cldescarga/reel30.mp4 · gen_timeline (sin clips) compila sin faltantes
Falta:
1. Clips: AGNES_KEYS=$(grep -E '^AGNES_STARTER_KEY_[0-9]+=' C:/Users/bauti/Downloads/video2/.env | cut -d= -f2 | tr -d '\r' | paste -sd,) AGNES_KEYS_OTRA_PC= AG_CU=0 AG_SECS=6 AG_SHOTS=5 AG_PAR=3 node scripts/agnes_multishot.mjs _v3/cldescarga_i2v.json cldescarga public/img/cldescarga public/broll/cldescarga ; luego agnes_qc.mjs cldescarga --fix ; find public/broll/cldescarga -size -2k
2. SLUG=cldescarga node vlog/claudio/gen_timeline.mjs --final · mk_entry · mix.py (apad 1.5 s, −14 LUFS) · farm STITCH_RAW=1 · encfin · esperar_run
3. audit.py · meta.mjs · job.mjs · deliver_card --no-youtube
