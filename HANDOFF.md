# HANDOFF — fumoscasf (Claudio el Fumigador · "La casa de los Ramírez" ep. 8: las moscas en la cocina)
Estado: ✅ ENTREGADO 9-oct (tarjeta plan-own-1791387464226-7, slug `fumoscasf`; la corrida paralela usa `fumoscas`, NO tocarla).
**2ª pasada 9-oct (avatar a cámara + 4 componentes nuevos): ✅ ENTREGADO — este mp4 REEMPLAZA al anterior en el release `fumoscasf`.**
Título: "Cómo Mantener las Moscas Fuera de la Cocina Sin Mosquiteros ni Spray".
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fumoscasf/fumoscasf.mp4 (12:21,97 · 22.259 cuadros · 2K).
Rama `fumoscasf-render` (sale de `furatones5-render`) · worktree `D:/Proyectos/video2-wt/fumoscasf`.
Formato: VLOG CONTINUO 100 % IA (voz en off de Claudio sobre planos vivos de la cocina de los Ramírez) **+ capa de avatar** (Claudio a cámara, RunPod InfiniteTalk) en 9 ventanas = **21,4 % de la imagen a la vista** (el audio del avatar son los mismos tramos del máster, así que la voz es una sola de punta a punta).
Imágenes: SOLO agnes (gratis) — sin cara `agnes-image-2.1/2.5-flash`, con cara `agnes-image-2.5-flash` + ref. ⛔ gpt-image, 2.5-flash-video y LTX NO se usaron en este video. El avatar es RunPod (US$0,25), no imágenes.
Voz: Fish (gratis), `claudio_definitiva` speed 1.0 (sin cambios en la 2ª pasada). ⛔ ElevenLabs no se usó (US$0).

## Cadena (todo en `vlog/fumoscasf/`)
1. `guiones/fumoscasf.txt` (11.077 car, tú neutro) + `_filmado.txt` (mismo texto con `[SECCIÓN|etiqueta]` por línea) · `tags.json`.
2. Voz: `vlog/claudio/voz.py` = Fish s2.1-pro-free por bloque + compuerta ASR en **Modal** por bloque (`gate.json`: 14/14 OK, b005 al 2º intento).
   → `public/fumoscasf_raw.wav` (749,71 s). `cut.py` quita las pausas de `cortes.json` **por muestra** (numpy+wave) →
   `public/fumoscasfcut.wav` = 741,9667 s = 22.259 cuadros (1 cuadro = 1470 muestras @44,1 k). `vlog/claudio/align.py` (difflib) → `_v3/fumoscasf_wordms.json`.
3. `beats.py` (251 planos: 237 sin cara + 14 con cara; `_v3/fumoscasf_img_*.json`) → `agnes_img.mjs` → `i2v_pend.py` → `agnes_i2v.mjs` (v2.0, 121 cuadros @60 → ralentí ×2 = 4,033 s a 30 fps) → `public/broll/fumoscasf/` (251 clips).
4. `agnes_qc.mjs` (mide + hoja de contacto) + revisión a ojo → sello `_v3/fumoscasf_agnes_qc.json`. ⛔ Las pistas de la visión fueron ruido otra vez: los 2 defectos reales (ci1, cl4) salieron mirando las hojas.
5. `mkvlog.py` (plan `planos.json`: cortes cada ~1,95 s en el minuto 1, 4,033 s después) → `public/vid/fumoscasf/vlog.mp4` (22.259 cuadros).
   `mkov.py` → `src/fumoscasf/ov.json` (**12 componentes** en la 2ª pasada) + `bed_<n>.mp4` (fragmento del propio vlog). `chk_ov.py` verifica que cada componente y su bed entren.
6. `mix.py` → `out/fumoscasf_mix.wav` (48 k estéreo, **−14,0 LUFS**, TP −2,4 dB): voz + ambiente por sección (fundidos 0,8 s, ~24 dB abajo, ducking) + 7 foley. **Sin música.** `chapters.py` → `vlog/fumoscasf/chapters.json`.
   ⛔ La 2ª pasada **NO volvió a mezclar**: el máster es el mismo (el avatar va MUDO en el render).
7. `src/index_fumoscasf.tsx` (vlog mudo + capa de avatar + OV) · `src/fumoscasf/total.ts` (22.259).

## 2ª pasada: avatar + componentes nuevos (9-oct)
- **Ventanas (`vlog/fumoscasf/avwin.py`)** — 9 ventanas del máster, 171,0 s de reel = **23,0 %** del video en audio, **21,4 % de imagen a la vista**:
  GANCHO 0,00-13,46 · PROMESA 45,96-75,79 · MOSQUITERO 141,68-173,72 · ALMACEN 182,00-231,57 · PAG16 463,68-473,97 ·
  CAFE 480,98-494,18 · CTA 694,88-700,42 · PRECIO 707,88-712,25 · CIERRE 729,28-742,02.
- **Avatar (RunPod InfiniteTalk, US$0,25, UN solo /run)**: `vlog/claudio/avatar_run.mjs run` (job `d4c15c7e-680a-4148-96c6-c04b060ad19e-u1`, 14:40 IN_QUEUE → 15:03 COMPLETED; `out/fumoscasf_avatar/{run.log,reel.mp4,reel.wav}`) →
  `SLUG=fumoscasf python vlog/claudio/avatar_post.py` (compuerta de duración: 170,92 s vs 170,99 s ✓; lag por ventana por correlación de envolvente: −0,10…0,00 s) → `public/avatar_clips/fumoscasf/reel30.mp4` (1920×1080, 30 fps, mudo, 172 s) + `src/fumoscasf/avwin.json` (con `pieces` y `lag`).
- **Intercalado del minuto 1 (clave para no perder cortes)**: si el avatar tapa tramos ENTEROS del minuto 1, los cortes de adentro desaparecen y la compuerta `scene>0,3 ≥30` se cae. `avwin.py` parte esas dos ventanas en **tramos enteros de `planos.json`** (avatar en los pares): cada cambio avatar↔vlog cae justo en un corte que ya existía → **medido 31 cortes**, igual que la 1ª pasada. Después del minuto 1 las ventanas van sólidas.
- **Kit nuevo `src/claudio/ClMoscas.tsx`** (calidad = `ClCasa5.tsx`): todo dibujado DENTRO del mundo (cama = cuadro real del video, `RoomLight`, cinta de papel), movimiento continuo, sin PowerPoint:
  `ClFlyDoor` (de dónde entra y qué la llama: el olor del bote abierto sale por la puerta y la mosca lo sigue; el mosquitero no la para) ·
  `ClLemon10` (el medio limón con los DIEZ clavos, uno por uno, con la lista tachada; la otra ventana con su limón: "una por ventana") ·
  `ClTapeHigh` (las 3 reglas de la cinta + la línea roja "ALTURA DE BRUNO" con el perro pasando por abajo) ·
  `ClMoscasMap` (la cocina en corte con los 4 arreglos puestos ✓ y las dos ventanas que se CIERRAN al final).
  Cuadros de prueba en `vlog/fumoscasf/kit/` (`1_flydoor`, `2_lemon`, `3_tape`, `4_map` + `real_*`), mirados uno por uno antes de seguir.
- **OV = 12 apariciones (12,1 % del video)** y `mkov.py` tiene una **compuerta** que aborta (exit 2) si un componente pisa una ventana de avatar. Los 3 que caían adentro (ClBookPage, los 2 ClQRCard) se corrieron a la frase siguiente con lugar libre.
- Dos arreglos de texto de paso: `ClQRCard` achica el texto si pasa de 23 caracteres (a 52 px "66 arreglos · garantía 7 días" salía 700 px y la tarjeta recortaba en "7 dí"); `ClFlyCycle` ahora recibe `name` (en este video la plaga es la **mosca**, no la mosquita de la fruta).
8. farm: `ENTRY=src/index_fumoscasf.tsx FARM_REF=fumoscasf-render TAR_DIR=D:/rtmp/fu8 FARM_NOWAIT=1 node scripts/farm.mjs fumoscasf Fumoscasf 22259 60 @_fumoscasf_assets.txt`
   (2ª pasada principal: run **37951072891** · 61 jobs ok · **chunk 50 caído** por el tope de 25 min → re-render parcial `gh workflow run render.yml --ref fumoscasf-render -f slug=fumoscasf -f comp_id=Fumoscasf -f total_frames=22259 -f chunks=60 -f only_chunks=50 -f entry=src/index_fumoscasf.tsx -f stitch_raw=1` = run **37956374545**) → mix a `assets-fumoscasf` (lo necesita encfin) →
   `bash D:/Proyectos/encfin/push.sh fumoscasf 22259 60` (run **37960459271** ✓: "cuadros 22259 (esperados 22259) · video 741.966667s · audio 741.966667s") → release `fumoscasf` (el mp4 nuevo REEMPLAZÓ al de la 1ª pasada).
   (Referencia de la 1ª pasada: render **37919581924** + **37925681001** + encfin **37921496888** / **37927683478**.)

## Qué funcionó / números
- 251 planos / **251 clips distintos** (0 repetidos). Para lograrlo hubo que ampliar la lista: la 1ª armada usaba 237 planos con 192 clips (45 repetidos) → +56 planos nuevos (56 fotos + 56 clips, gratis).
- Imágenes: 267 pedidos → 251 usadas (16 rerolls). Clips: 252 pedidos → 251 usados (1 reroll).
- Gasto 2ª pasada: **RunPod US$0,25** (un solo /run); OpenAI US$0; ElevenLabs US$0; agnes/Fish gratis. (1ª pasada: todo US$0 salvo Modal ≈US$0,0x.)
- Auditor sobre el **mp4 final del release** (2K, con avatar y los 12 componentes): silencios >0,4 s @−32 dB **0** · cortes scene>0,3 en el minuto 1 **31** (≥30) · negro ≥0,25 s **0** · cuadros muertos ≥2,5 s **0**. Mirado también a ojo en las hojas del auditor y en cuadros sueltos del mp4 bajado del release (avatar a los 5/150/697/735 s, ClMoscasMap a los 620/626 s).

## ⛔ Gotchas (para el próximo)
- **El tope de 25 min por chunk mata al borde.** Tres chunks con 3 videos a la vez (vlog + cama del componente + avatar) tardan **~25 min** bajo swangle en el runner de 2 núcleos: dos llegaron justo y el tercero (chunk 50 = ClMoscasMap, cuadros 18.550-18.920) murió a los 25. En la rama quedó `timeout-minutes: 45`. Parche más barato: renderizar el chunk en la PC (mismo comando, `--frames=<a>-<b> --concurrency=4 --crf=23 --gl=swangle`) y subirlo a `chunks-<slug>`.
- **⛔⛔ `cp -n` en el stitch puede meter un chunk VIEJO de la corrida anterior.** El paso "traer chunks persistidos" baja el release `chunks-<slug>` ANTES de persistir y copia lo que falte: con chunk 50 caído, el concat salió con **el chunk 50 de la 1ª pasada** (sin avatar ni componentes nuevos) y el job quedó VERDE. Se ve en el log: `persistiendo 60 chunks` con 59 artefactos. Si un chunk cae, hay que re-renderizarlo (o pisarlo en el release) ANTES de disparar el stitch.
- `mkvlog.py` recortaba mal (bug real, arreglado 9-oct). El `select` acumulaba el índice con el largo del TROZO (`n`) en vez del cuadro del CLIP (`CLIPF`): los rangos quedaban pegados (0-55, 56-114, 115-173…) y el filtro devolvía los primeros `sum(n)` cuadros tal cual → el vlog salía con **clips enteros de 4,033 s pegados**. Se veía así: 14 cortes en el minuto 1 y 2 cuadros muertos. Hay que llevar DOS contadores (`pos` para `-frames:v`, `base += CLIPF` para el select). El `-/vf <archivo>` **sí** aplica el filtro (medido: 30 de 90 cuadros) — no era eso.
- **Un clip que no se mueve rompe el gate de congelados**: s068 (tarro de basura quieto) daba freeze ≥2,5 s. Se regeneró con movimiento real (la luz corre por el piso); ahora 0. freezedetect usa −60 dB: cualquier plano muy quieto lo dispara.
- **El pre-vuelo del farm exige `public/<slug>_fish.wav`** (lo busca el stitch). Acá se copió el **mix** con ese nombre (el render sale con el audio final ya puesto; el 2K lo re-encoda encfin con `fumoscasf_mix.wav` del release). ⛔ Si se re-dispara farm.mjs, borra y recrea `assets-fumoscasf` → **volver a subir el mix**.
- `cut.py`: en audio `aselect=n` cuenta FRAMES DEL FILTRO (~1024 muestras), no muestras → devolvía el archivo entero; `aselect=t` pega los bordes al bloque (742,095 s). El corte exacto es por muestra con numpy.
- `_v3/` está en .gitignore (sellos, ASR, cues): el farm los lee del disco local, no viajan en la rama.
- **`avatar_post.py`**: el avatar de InfiniteTalk vuelve 768×512 → hay que escalar a CUBRIR 1920×1080 y recortar el centro (`scale=1920:1080:force_original_aspect_ratio=increase,crop=…`); `scale=1920:-2` da 1070 de alto y el crop REVIENTA.
