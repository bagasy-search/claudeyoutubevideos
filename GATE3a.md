# ⛳ 3a — olcabin: pido TURNO DE RENDER

- **TOTAL_FRAMES = 34.843** (1.161,43 s = 19:21), 1920x1080, 30 fps. Chunks propuestos: **96** (~363 cuadros c/u; hay 3D y 3 fotos de 1088 que se agrandan, ninguno pesa más que el cutaway). Entry `ENTRY=src/index_olcabin.tsx`, comp `Olcabin`, `FARM_REF=olcabin-render`, lista de assets `_olcabin_assets.txt` (331 archivos).
- **Timeline generado** (`vlog/olcabin/gen_timeline.mjs`): 277 planos, 0 huecos/solapes, 0 assets faltantes, 24 placas de cuenta regresiva (overlay), 137 sfx, foley del minuto 1.
- **Mezcla determinista** `out/olcabin_mix.wav` (48 kHz, **-16,0 LUFS**, pico -3,7 dBFS, dura 1161,43 s == video): voz máster + cama folk propia (Karplus-Strong, sin Content ID) + foley + sfx. Minuto 1: **0 silencios** (silencedetect -32 dB/0,3 s).
- **Borrador local del minuto 1** (960x540, `D:/rtmp/olcabin/min1_draft.mp4`, hoja `GATE3a_min1_sheet.jpg`): **25 cortes** (scene>0,3), toma máxima 4,5 s; 24 planos en el timeline.
- **Metraje** (medido del timeline): real (stock + archivo PD) **25,4 %**, avatar **17,9 %**; hablados agnes 2.5 (m1-m6) 1,8 %.
- **Avatar RunPod**: UN /run, reel 243,2 s == audio (dif +0,02 s), 51 ventanas, lag máx 0,10 s ya compensado, costo US$0,25.
- **Componentes propios (`src/olcabin/`)**: 3D real (three.js): CabinCutaway3D, TinRecipeBox3D, CabinRecipeBook3D, PorridgeBowl3D, BooyahKettle3D. 2D: RecipeCountdown (placa de lata, 24 veces), GrandmaCard, OriginMap, WhyTheyStopped, OleBookPage (páginas REALES p.60, 59, 23, 43, 34 de `book.pdf`), OleCTA (portada + QR real), OleRuleCard. Ver `GATE3a_stills.jpg`.
- **Imágenes**: 108 fotos gpt-image-2 (Batch, US$0,20 aprox.), 103 animadas con agnes v2.0 y pasadas por `agnes_qc` (21 rechazados a ojo y sustituidos por la foto con Ken-Burns; 87 aprobados; farm gate ✓).
- **Real**: 58 clips Pexels (`vlog/olcabin/CREDITOS_stock.txt`) + 24 fotos PD de Wikimedia (`CREDITOS_archivo.txt`). Dudas de licencia listadas por el agente: 9 fotos vienen de MNHS/NAHA/Hennepin/DPLA vía Commons ("Public domain" en Commons; no se leyó el aviso en la institución) y `ar_belgian_doorcounty` (postal 1914) y `ar_charles_xii` (subasta). Sin rótulos de personas.
- **Hablados agnes 2.5 (m1-m6)**: en la cola del orquestador (5 pending + 1 running). Mientras no lleguen, el timeline usa el avatar como repuesto (cubierto por el reel). Cuando lleguen: `prep_clips` + `gen_timeline` + `mix` + un commit nuevo y volver a disparar el farm (no hace falta otro avatar).
- ⚠️ **DISCO**: D: queda ~2,7 GB libres. El render del farm no usa D:, pero `entrega.sh` y las hojas del AUDITOR sí.
