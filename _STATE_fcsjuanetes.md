# HANDOFF fcsjuanetes — Bagasy card fc202609204 — "¡Cómo Corregir tus Juanetes Sin Cirugía!"
PAUSADO 21-sep 16:11. Canal Federer Consejos Salud (tracked_channels id=96). Guía SECUNDARIA
(Salud +60, $27, archivos-federer.vercel.app). Tema hallux valgus sin cirugía · paciente doña Remedios.
Ancla NUEVA no quemada: von Meyer 1858 + Dr. Phil Hoffmann 1905 (186 pares) + Sim-Fook/Hodgson 1958.
⛔ Anti-canibalización: NO verrugas/puntos negros en la planta, NO uña encarnada.

## FASE EXACTA Y PRÓXIMO COMANDO
Fase 5 (montaje). Falta SOLO bajar el plate de grp-04 y re-cortar ventanas. Próximo comando:
  K=$RUNPOD_API_KEY; ID=677744b9-8a6a-4748-b89a-bd9d7853c42e-u1
  curl -s "https://api.runpod.ai/v2/infinitetalk/status/$ID" -H "Authorization: Bearer $K"   # COMPLETED, trae output.result
  curl -sL -o "D:/rtmp/fcsjuanetes_rp/out/grp-04_720p_$ID.mp4" "<output.result>"
  ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 <ese mp4>   # COMPUERTA: 832x464
  PYTHONUTF8=1 python _v3/fcsjuanetes_rp_split.py      # deja 122 ventanas en public/broll/fcsjuanetes_av/

## RUTAS (no re-derivar)
guion_fcsjuanetes.txt 42.852 car · guion_fcsjuanetes_tts.txt (sin headers, es el que se locutó)
public/fcsjuanetes.wav = 2692.66 s = 44.88 min · public/fcsjuanetes.m4a mismo largo
_v3/fcsjuanetes_wordms.json (98.37%) · _v3/fcsjuanetes_moments.json 412 momentos, ANCLAJE 100%
_v3/fcsjuanetes_spec_all.json: avatar 122 / stock 214 / comp 62 / pres 14 · _v3/fcsjuanetes_comps.mjs (62)
Variedad de componentes por tramo (gate pide 5): 8/8/7/6/8 · 10 tipos · máx BigStat 11 (17,7%)

## AVATAR — 122 ventanas, 4 jobs RunPod, US$1.00 total. Ref = public/img/federer_avref_16x9.png (⛔ NUNCA ref_*_face.png)
grp-01 42353638-f477-4e28-8516-ae28a15aab8f-u1 · 79 win · BAJADO · 832x464 ✅ · 531.64s vs wav 531.94s
grp-02 4fe76124-58d6-4d16-834f-2eeeb03b608f-u2 · 32 win · BAJADO · 832x464 ✅ · 209.60s == wav
grp-03 3d7980c9-eb0e-413b-8a6b-8931dbfb3f88-u1 · 6 win (112-117) · BAJADO · 832x464 ✅ · 31.32s == wav
grp-04 677744b9-8a6a-4748-b89a-bd9d7853c42e-u1 · 5 win (118-122) · COMPLETED, FALTA BAJAR (ver arriba)
Encuadre verificado con frame real: _audit_fcsjuanetes/plate_frame.jpg (cabeza y hombros, nada cortado).
grp-03 y grp-04 se agregaron con _v3/fcsjuanetes_rp_build3.mjs (appendea grupo SIN tocar las ya generadas).

## AGNES — 247 pedidos / 247 entregados / 0 fallos. QC: 240 aprobados.
3 rondas de agnes_qc --fix: 76 rechazados -> 28 -> 13 -> 7 persistentes.
Los 7 (061 074 120 177 218 328 368) se RETIRARON: el montaje usa su foto fija, sin defecto. NO regenerarlos.
Si hiciera falta otra ronda: node scripts/agnes_qc.mjs fcsjuanetes  →  --revision "nnn:motivo;..."  →  --fix
Política: se rechaza SOLO frame roto/texto quemado, NUNCA "off-topic".

## ⛔ DOS DEFECTOS YA CORREGIDOS — NO REINTRODUCIR
1. gen_fcsjuanetes_plan.mjs: el techo de 11 s cortaba FedWhiteboard a la mitad. Tiene excepción propia
   (techo 20 s, piso 18 s). Verificado por render: _audit_fcsjuanetes/wb_f570.png.
2. _v3/fcsjuanetes_i2v_items.mjs leía prompts de imgitems.json (queda VACÍO cuando ya existen las
   imágenes) → mandaba "UNOCCUPIED, nobody in frame" sobre fotos con pies y agnes los BORRABA.
   Ahora lee _v3/fcsjuanetes_prompts_all.json (mapa completo, 301). 199/239 con gente.
Otros ya resueltos: regex de acentos rota en gen_moments; URL vercel.app partida por el splitter;
header pegado al párrafo anterior (los 3 llevaron el anclaje de 31% a 100%). cortes_runpod.json clonado
de fcshongos: BORRADO. make_ref usa GIT_INDEX_FILE propio (3 agentes en el mismo working tree).

## YA LISTO PARA DISPARAR
_v3/fcsjuanetes_thumb_final.jpg (1280x720 JUANETES/SIN CIRUGÍA) · public/fcsjuanetes_meta.json
(título + descripción con CTA en la 1a línea + 15 capítulos) · public/img/fcsjuanetes_qrcard.png
_v3/fcsjuanetes_card_patch.json (done/script/transcript/hook/scriptMin=45) → node _fcs_card_done.mjs fc202609204 <patch>
_v3/fcsjuanetes_canal_append.md (mi fila para el §1 de canales/federer-consejos-salud.md)
_v3/fcsjuanetes_auditor.sh (AUDITOR completo en un comando) · _v3/fcsjuanetes_make_ref.sh · _v3/fcsjuanetes_farm_dispatch.sh
_v3/fcsjuanetes_predice.mjs (simula la densidad sin renderizar)

## FALTA (en orden)
1. bajar grp-04 + ffprobe + rp_split (122 ventanas)
2. node gen_fcsjuanetes_plan.mjs && node build_fcsjuanetes.mjs
   ⚠️ el build aborta si hay hueco sin avatar >115 s. Con 117 ventanas daba 134.7 s en 2532-2667 s;
   las 5 de grp-04 están puestas justo ahí. Si volviera a fallar, agregar ventanas con rp_build3, no subir el techo.
3. node _fcs_densidad.mjs fcsjuanetes  (con 117 ventanas ya daba ✅ PASA: 504 beats/413, avatar 117/94,
   clip 333/244, comp 54/44, media 4.6s, >10s 0, máx 20.4%, FedWhiteboard 1)
4. node scripts/density_gate.mjs fcsjuanetes  ← OFICIAL, exit 0 obligatorio ANTES del farm. NO corrida aún.
5. bash _v3/fcsjuanetes_make_ref.sh && bash _v3/fcsjuanetes_farm_dispatch.sh (lee TOTAL_FRAMES del Main, no fórmula)
6. AUDITOR (bash _v3/fcsjuanetes_auditor.sh <mp4>) → scripts/entrega_mp4.sh → scripts/check_entrega.mjs
7. D:\videosdeclaude\ + _fcs_card_done.mjs + append de la fila al archivo del canal

## RETOMA 22-sep (agente de entrega) — AVANCE
- ⛔ El job grp-04 del handoff (677744b9…) fue PURGADO por RunPod: /status da 404 y nunca se bajó.
  Re-despachado (US$0,25 extra) con `_v3/fcsjuanetes_rp_g4.sh` → jobid en D:/rtmp/fcsjuanetes_rp/jobid4.txt,
  log en D:/rtmp/fcsjuanetes_rp/g4.log. El script ya hace la COMPUERTA 832x464.
  grp-04.wav ya estaba pusheado al repo de inputs (raw 200), no hizo falta re-push.
- FALTABAN 2 assets que el handoff daba por hechos:
  · public/img/fcsjuanetes_qrcard.png → REGENERADO con scripts/fcsjuanetes_qr.py
    (URL https://archivos-federer.vercel.app/, decodifica a 360/420/560 px). Lo pide RayCta (showQr).
  · public/fcsjuanetes_meta.json → sigue faltando, hay que rehacerlo (contenido está en
    _v3/fcsjuanetes_card_patch.json).
- BUG #6: fcsjuanetes NO usa LowerThirdId. Sus overlay-puros (VetSenal, RayCta) ya van en
  plan.overlays[], que el Main compone ENCIMA del track base (cobertura 100% compuertada) → sin negro.
  VetSenal usa colores explícitos + scrim propio, no useInk → sin el problema de tinta.
  Igual se agregó COMPUERTA en build_fcsjuanetes.mjs: OVERLAY_COMPONENTES como cue BASE = abort.
- AUDITOR ARREGLADO: `blackdetect` TAMBIÉN imprime a nivel info. Con `-v error` reportaba
  "0 tramos negros" SIEMPRE (falso PASS, peor que el de volumedetect). Los dos pasados a
  `-v info -hide_banner -nostats` (+ `-map 0:a:0` en volumedetect).
- Barrido local escrito: `_fcsjuanetes_sweep.mjs` — cubre CUES de componente Y overlays, y aborta
  si su conteo no coincide con el del plan (anti-barrido-mentiroso).
- ⛔ DEFECTO REAL ENCONTRADO: _v3/fcsjuanetes_thumb_final.jpg tiene OTRA CARA (señor canoso con
  bigote, ~60) y NO la del canal. El plate real del avatar (_audit_fcsjuanetes/plate_frame.jpg) y
  public/img/federer_avref_16x9.png son el médico joven de barba. Es exactamente el error que
  advierte el brief ("nunca un crop heredado de otro slug"). HAY QUE REHACER LA MINIATURA con
  gpt-image-2 /edits usando public/img/federer_avref_16x9.png como referencia.
- ✅ grp-04 re-despachado y BAJADO: job 903b8695-32a8-42f5-829d-9a0c7a77ea8b-u2 · US$0,25 ·
  video 23.62s == audio 23.62s · COMPUERTA PLATE 832x464 OK.
- ✅ MINIATURA REHECHA: public/ref_fcsjuanetes_face.png recortado (crop 340x510+830+20 → 128x192)
  DESDE public/img/federer_avref_16x9.png, prompt corregido ("late thirties, dark curly hair,
  short dark beard" en vez de "in his sixties"). _v3/fcsjuanetes_thumb_final.jpg regenerado y
  verificado por visión: la cara coincide con el plate real del avatar. La vieja quedó en
  _v3/fcsjuanetes_thumb/_OLD_caraerronea.png.
- ✅ public/fcsjuanetes_meta.json REHECHO (título 40 car · descripción 2665 car con CTA en la
  1a línea · 19 capítulos derivados de los `sec` de _v3/fcsjuanetes_moments.json). Copia en _v3/.
- NUEVO: _v3/fcsjuanetes_imports_check.mjs — compara el grafo de imports del bundle con la lista
  de make_ref.sh (modo de falla del video hermano: RayCta/RayStage faltaban en la rama).
- ⛔⛔ INCIDENTE GRAVE Y RESUELTO: public/ del proyecto fue BORRADO (otro agente lo está
  restaurando desde releases con _recover_public.sh, pero fcsjuanetes NO está en
  _recover_assets_list.txt porque nunca se releaseó). Se perdieron wav, 240 clips de agnes y 363
  imágenes. RECUPERADOS desde la copia de staging del bundle de Remotion:
  D:/tmp/remotion-stills-bundle/public/ → public/fcsjuanetes.wav (2692.66s, idéntico al handoff),
  public/fcsjuanetes.m4a, public/broll/fcsjuanetes/ (240 mp4), public/img/fcsjuanetes/ (363).
  ⚠️ NO se copió broll/fcsjuanetes_av de ahí (tenía las 117 viejas): valen las 122 nuevas.
- ✅ rp_split: 122 ventanas, 0 cortas, K=1.00000 en los 4 grupos.
- ✅ PLAN: 502 beats · avatar 122 · clip 326 · componente 54 · overlays 11 · 44.89 min.
- ✅ BUILD: cobertura 100% de 80795 frames · avatar 29,3% · hueco máx sin avatar 44,2 s (techo 115)
  · pacing mediana 4,97 s máx 18,3 s · fps ✓ 325 videos · aspecto ✓ 53 imágenes · 380 assets.
- ✅ imports_check: el árbol de la rama cubre el grafo (theme.ts y typewriter.tsx vienen IGUALES
  de molino-v1 por read-tree; FedWhiteboard.tsx y RayStage.tsx sí están en la lista de make_ref).
- ⛔ node_modules TAMBIÉN fue borrado junto con public/ → `npm install` (log D:/rtmp/fcsj_npm.log).
- ✅ _fcs_densidad.mjs: PASA (502/413 beats · 122/94 avatar · 326/244 clip · 54/44 comp · media 4,5s
  · >10s 0 · ningún componente >25% · FedWhiteboard 1).
- ✅✅ COMPUERTA OFICIAL `node scripts/density_gate.mjs fcsjuanetes` → EXIT 0:
  usos de componentes 513 (11,4/min vs mín 1,5) · crudos 42% (máx 78%) · distintos 13 (mín 8) ·
  propios 13 · variedad por tramo 10·11·9·9·11 (mín 5) · visuales 892 (mín 336) · stock 325 (mín 67)
  · audio 2692,7s vs video 2693s.
- ✅ check_props (contratos): verde tras DOS arreglos reales:
  · scripts/check_props.mjs no resolvía `React.FC<TipoNombrado>` (sólo el inline `React.FC<{`) →
    daba "no encuentro la firma" en FedWhiteboard. Ahora resuelve el tipo nombrado y parte las
    props por `;` además de por salto de línea (un tipo puede venir en UNA línea).
  · gen_fcsjuanetes_plan.mjs le metía `bed` al beat de FedWhiteboard (firma {scene?,theme?}) →
    prop no reenviada = chunk en verde con el default. Ahora FedWhiteboard va SIN cama.
- ✅ check_items: verde con `node scripts/check_items.mjs fcsjuanetes fcsclv` (⚠ el kit por DEFECTO
  del script es "fedvet": hay que pasar fcsclv). Arreglo real en scripts/check_items.mjs: agregado
  `src/<Comp>.tsx` a los candidatos, porque FedWhiteboard vive en la raíz de src/ y el gate lo daba
  por inexistente. 27 arrays / 74 elementos medidos.
- ✅ assets: 381 líneas en _fcsjuanetes_assets.txt, 0 faltan en disco. win-001..win-122 (1-indexed).
- NUEVO: _v3/fcsjuanetes_stills_luma.sh — mide la luma media de cada still del barrido. El barrido
  sólo caza EXCEPCIONES; el bug #6 renderiza NEGRO sin tirar excepción. Umbral YAVG < 16/255.
- ✅ BARRIDO LOCAL: ok 65 · fail 0 · conteo 54/54 componente + 11/11 overlay (la compuerta
  anti-barrido-mentiroso pasa). LUMA: 65 stills medidos, 0 casi negros → bug #6 AUSENTE, verificado
  también por visión en ov_VetSenal_* (texto blanco legible sobre footage real, sin negro).

## RONDA 2 — lo que pidió el coordinador (StampBadge) + un hueco propio que destapó
- Mi plan NO usa StampBadge como cue base (0) y sus overlay-puros van en overlays[]. Sin cambios
  de montaje. Pero el hallazgo destapó un HUECO EN MI PROPIO BARRIDO:
  ⛔ yo muestreaba SÓLO el frame del MEDIO de cada beat, y esos negros duran ~0,3 s y caen en el
  PRIMER frame. Mi luma en verde NO probaba nada para esa clase. Barrido ahora rinde DOS frames
  por beat (mid + in) → 130 stills.
- build_fcsjuanetes.mjs: OVERLAY_COMPONENTES ya NO es lista a mano (falló dos veces). Ahora suma
  automáticamente todo export de kit/premium/frame.tsx cuyo cuerpo no pinte Panel/Cinema/Backdrop/Stage.
- _v3/fcsjuanetes_auditor.sh: blackdetect a d=0.2 (con 0.5 NO ve tramos de 0,3 s) y CUALQUIER tramo
  = AUDITOR EN ROJO, exit 1, no se copia a D:/videosdeclaude/.
- scripts/farm.mjs: el pre-vuelo comparaba SHA de la rama contra HEAD y abortaba el despacho. Con 3
  agentes en el mismo working tree la rama se arma por plumbing desde molino-v1, así que HEAD es la
  rama de OTRO agente y el SHA NUNCA coincide. Ahora compara BLOB A BLOB el grafo de imports del
  entry (más fuerte que el SHA: detecta rama vieja Y archivo faltante, y funciona en los dos flujos).
- CAUSA RAÍZ de StampBadge (para el que lo arregle en fcspuntos/fcsunaclavada): NO es que no pinte
  fondo — sí pinta `<Cinema>`, pero va DENTRO de `<Stage style={{opacity: op}}>` con `op` de
  `useBeat`, que vale 0 en el frame 0. O sea que la superficie entera entra con fade desde
  transparente: el primer frame es transparente → negro si no hay nada debajo.
  ⇒ NINGUNA heurística estática lo caza (mi detector por Panel/Cinema/Backdrop lo da como "pinta
  fondo"). La única compuerta que sirve es EMPÍRICA: renderizar el PRIMER frame y medir luma.
  Por eso el barrido ahora rinde mid+in. El detector automático queda igual (caza LowerThirdId y
  CornerEyebrow) pero NO se confía en él solo: la lista a mano conserva StampBadge.
- Ninguno de los 8 componentes de src/fcsclv/ usa `opacity: op` (chequeado), pero manda la medición.
- ✅✅ BARRIDO mid+in: ok 130 · fail 0. LUMA: 130 stills, 0 casi negros → incluidos los PRIMEROS
  frames de los 54 componentes y los 11 overlays. La clase de bug de StampBadge NO está en este video.
- rama fcsjuanetes-render -> 8421ad7 (make_ref re-corrido tras el build final).
- ⛔→✅ El pre-vuelo NUEVO (blob a blob) atrapó algo que el viejo por SHA jamás habría visto:
  `src/index.css` de la rama (heredado de molino-v1) era la versión ROTA
  (`@import "tailwindcss"` a secas escanea public/ ~28 GB y revienta con RangeError en el bundler);
  el working tree tiene la arreglada con `source(none)` + `@source`. Se agregó src/index.css a la
  lista de make_ref y al imports_check (que antes EXCLUÍA los .css). Rama rehecha y farm despachado.

## RONDA 3 — la compuerta de agnes QC del farm (bloqueaba el despacho)
- El farm corre `scripts/agnes_qc_gate.mjs`: 0 loops y 0 clips repetidos, sin tolerancia.
- 1er bloqueo: "203 clips modificados después del control" — lo causó MI restore (cp cambia mtime).
  Verifiqué INTEGRIDAD por tamaño contra el control (240/240 iguales, y los 7 que faltan son
  exactamente los 7 RETIRADOS del handoff) y recién ahí restauré los mtimes del propio qc.json.
- 2o bloqueo: faltaba `_v3/fcsjuanetes_cues.json`. Ahora lo emite build_fcsjuanetes.mjs (capa base).
- 3er bloqueo, EL DEFECTO DE VERDAD: 200 de 326 planos de clip eran MÁS LARGOS que su mp4 de agnes
  (4,03 s) y `Clip` los envuelve en <Loop> → el clip REINICIA a la vista. Más 103 clips repetidos.
  CAUSA RAÍZ: `assetDe` buscaba la foto en `img/<slug>/<name>.jpg` y las de este slug son **.png**
  → el plan salía con `imagen 0` y TODO se resolvía como clip, estirado a la fuerza.
  ARREGLO en gen_fcsjuanetes_plan.mjs: pasada final que (a) recorta cada plano al largo real de su
  clip y cierra con la FOTO de ese mismo momento (cola mínima 0,5 s), y (b) manda a foto los usos
  repetidos. Resultado: clip 203 (todos ÚNICOS) · imagen 262 · 641 beats.
- density_gate.mjs OFICIAL sigue en EXIT 0 (visuales 1207, clips 325, variedad 11·12·10·10·12).
- ✅ agnes_qc FINAL: 325 planos de clip · 0 más largos que su clip · 0 repetidos · 240 aprobados.
  (agnes_qc.mjs igual sale exit 1 por su propio criterio; el que manda para el farm es
  scripts/agnes_qc_gate.mjs, que pide loops=0 y dobles=0 → ahora los cumple.)
- ⚠️ A REPORTAR: con clip 203 (203 únicos de 240 disponibles) el predictor INTERNO _fcs_densidad.mjs
  pide un piso de 244 planos de clip, que ya es INALCANZABLE por construcción (no hay 244 clips
  únicos). La compuerta OFICIAL (scripts/density_gate.mjs) pide 67 y pasa con 325. El piso del
  predictor interno quedó desactualizado frente a la regla de "ningún clip repetido".
- MEJORA DE CALIDAD (no la pedía ninguna compuerta, pero el arreglo anterior quedaba a medias):
  la COLA de un plano recortado NO puede ser la foto original, porque el clip de agnes es la
  animación i2v DE ESA MISMA foto → cortar del final del clip a la foto vuelve al cuadro inicial,
  que es EXACTAMENTE el salto del <Loop> que acabábamos de sacar. Ahora la cola es el ÚLTIMO cuadro
  del clip (`img/<slug>/<name>_fin.jpg`, extraído con `ffmpeg -sseof`): el movimiento se congela
  donde quedó y Ken Burns lo sigue. Los usos REPETIDOS sí siguen usando la foto original (caen en
  otro punto del video, no hay continuidad que romper).
- ✅ VERIFICADO POR IMAGEN (D:/rtmp/_cmp/comparacion.jpg): último cuadro del clip == la cola
  `_fin.jpg` (corte invisible), y AMBOS distintos del PNG original (la cámara ya derivó, la toalla
  cambió de lugar) → confirma que cortar a la foto original habría reproducido el salto del Loop.
- plan FINAL: 644 beats · avatar 122 · clip 203 (únicos) · imagen 265 · componente 54 · overlays 11
  · 142 colas _fin.jpg extraídas · build: cobertura 100%, aspecto ✓ 298 imágenes, assets 625.

## ⛔ TRES FALSOS VERDES ENCONTRADOS (22-sep) — ninguno era un problema del video
1. **`_v3/*_stills_luma.sh` NUNCA midió un cuadro, en NINGÚN video.** `metadata=print` escribe a
   nivel INFO y el script corría `ffmpeg -v error`, así que la línea se suprimía y el grep volvía
   vacío. Como el chequeo era `[ -n "$y" ] && ...`, saltaba todos los stills en silencio e imprimía
   siempre "casi negros 0". CORREGIDO con `file=-` (stdout, independiente del log level) + falla
   dura si un still no se puede medir.
2. **`public/` pesa 72 GB y Windows SIEMPRE lo copia entero a cada bundle** (`symlinkPublicDir` no
   tiene efecto en Windows). Llenó D: al 100 %: `bundle()` volvía "OK" con un directorio SIN
   `bundle.js` y el barrido moría sin renderizar NADA — dejando el dir de stills vacío, que el
   punto 1 leía como verde. CORREGIDO: el barrido usa un publicDir PODADO (626 assets, 763 MB) y
   falla duro si `bundle.js` no existe.
3. **El luma pasaba con el directorio VACÍO** (0 stills = 0 negros = exit 0). CORREGIDO con piso `n >= 2`.

## Medición REAL (130 stills = 65 beats × 2 cuadros, in + mid)
- 0 casi-negros. El más oscuro es `WorstSpots_34374_in` con YAVG 32.8 — muy por encima del umbral 16
  y del fondo del canal `#08110F` (~14).
- `FedWhiteboard` YAVG 204 / 211.7: **no lleva cama y NO es el bug del parpadeo**. Pinta su propia
  placa opaca full-frame (`src/FedWhiteboard.tsx:929`, theme white bg `#d9dbe0`). Exento y
  documentado en el build. Los otros 53/53 sí llevan cama.
- `build_fcsjuanetes.mjs`: la cama pasó de `⚠️` a COMPUERTA DURA (`process.exit(1)`).

## Estado PRE-DESPACHO (22-sep) — todo verde CON CONTEOS REALES
- barrido: 130 stills = 65 beats × 2 cuadros (in+mid) · ok 130 · fail 0
- luma: 130 medidos · 0 casi-negros · el más oscuro YAVG 32.8 (umbral 16, fondo canal ~14)
- agnes_qc: 240/240 aprobados · 0 repetidos · 0 más largos que su clip
- density_gate (OFICIAL): 325 clips (mín 67) · audio 2692.7 s vs video 2693 s → OK
- build: cobertura 100 % · 53/53 camas (FedWhiteboard exento, auto-opaco, YAVG 204/211.7)
- auditor: pix_th 0.06 → 0.10, y ahora EXIGE que blackdetect haya decodificado el mp4 entero
  (antes "0 tramos" podía ser ffmpeg fallando).
- NO hay `jq` en este entorno: mi cadena no lo usa (farm.mjs parsea --json en node y usa el --jq
  propio de gh + `gh run watch --exit-status`, sin loop de polling que pueda girar en silencio).
- FALTA: despachar el farm (requiere push a la rama molino-fcsjuanetes).
