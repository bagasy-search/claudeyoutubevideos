# HANDOFF — mec99 (Claudio el Mecánico #1 · serie "El auto de Doña Elena" ep. 1: las 17 cosas que tu auto ya trae)
Estado: ✅ ENTREGADO 8-oct (job 789, tarjeta plan-own-1791434693203-0 del row 311 `draft:claudiomecanico` → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/mec99/mec99.mp4?v=1 (15:08, 27.242 cuadros, sha256 41efb066…) · local D:/videosdeclaude/mec99_entrega.mp4.
Auditor sobre el final: min1 40 cambios de escena (34 cortes de timeline) / 0 silencios · negro 0 · congelados 0 · -14,0 LUFS / TP -1,2.
Final: farm 100 tramos (STITCH_RAW) → `bash D:/Proyectos/encfin/push.sh mec99 27242 100` (mix subido antes a assets-mec99).
Rama `mec99-render`, sale de `furatas-render`. Worktree en ESTA PC (DESKTOP-CRNK37J): `D:/rtmp/wt-mec99`.

## Cadena = la del Fumigador (furatas-render) adaptada al MECÁNICO en ESTA rama. mecllave sale de acá.
- lib.mjs: WHO = camisa azul marino de mecánico arremangada + trapo rojo · SHOP = taller de Claudio (cemento con manchas, cajoneras
  rojas, elevador de 2 columnas, panel de llaves, portón abierto) · DRIVE = cochera de Doña Elena · ELENA (72, viuda, rodete canoso,
  anteojos con cadenita, cárdigan beige) · CAR = sedán plateado 2012 sin logos · CABIN · H (manos de mecánico) · EH (manos de Elena).
- avatar: ref `vlog/mec99/mk_ref.mjs` (claudio_hd + camisa marino, en el taller con el sedán plateado en el elevador) → `public/ref_mec99.png`
  (= out/ref/ref_a.png); cara `public/ref_mec99_face.png` = kit claudio/face.png. Video N: copiar ambas como ref_<slug>*.png.
- Marca: ClTheme rojo #C62828 (nitrile) + azul marino #1F2A44 (navy) · ClChapter = parche bordado ROJO con llave inglesa · ClCheck "ORDEN DE TRABAJO".
- Kit nuevo `src/claudio/ClMecanico.tsx` (7): ClFuelGauge (tablero + lupa + flecha; `car` = sedán desde arriba con la tapa encendida) ·
  ClCarMap (hoja "LA REVISIÓN · 17 PUNTOS": n/all/zone/done) · ClKeyFob3D (three.js: tease/key/dead/windows/range/battery — `range` y
  `battery` listos para mecllave) · ClChildLock (find/locked/open) · ClAirFlow (recirc/defog) · ClTireLabel (door/versus) · ClTread3D (bar/worn/coin).
  Registrados en ClMain, BEDABLE, CMAX (todos en 9 = el default con que se pagó el avatar), sound.mjs; banco `src/index_mekit.tsx` (39 stills).
- job.mjs/meta.mjs: row 311; meta = 1ª línea regalo /gratis/?src=<slug>-desc · 2ª landing ?src=<slug>. stock.mjs: juez de autos.
- sound.mjs: ambientes de auto arriba (lluvia, noche, estacionamiento, calle/gasolinera, adentro del auto, casa, taller = tono de sala)
  + foley de autos (control, llave de metal, encendido, puertas, baúl, vidrios, aire, llaves, fusibles, papeles). Regla con [] = sin foley.
- sfx_pro: +20 efectos de autos (LICENCIAS.md, IDs de Mixkit ELEGIDOS A MANO: el buscador de build.py trajo motocross/olas/vidrio roto).
- chk.py traído de la rama Japón (MARK = Manual/página/código/veintisiete).

## Números
- Guion 13.641 car (tú neutro) · voz claudio_definitiva 16/16 bloques al 1er intento, 15,06 car/s (más rápida que 14,7) → 910 s crudo
  → 907 s tras comprimir el gancho. Alineación 0,98.
- Timeline 299 tomas · 27.242 cuadros (15:08) · minuto 1: 34 cortes, toma máx 3,84 s · cara de Claudio en el seg 0,95.
- Avatar 1 /run efectivo, 70 ventanas, reel 235,5 s, US$0,25, lag -0,10..0 · avatar 24,2 % · real 25,7 % (stock 8,1 + camas 17,6) · agnes 3,1 %.
- Imágenes gpt 189+2 low Batch 1088x608 (+ cara en 6) · stock 73+28 buscados → 61 tras 18 rechazos a ojo · agnes 10/21 aprobados a ojo.
- Sonido 331 efectos, 131 ambientes, 0 cuadros sin ambiente, 34/34 cortes del min 1 con efecto, -14,0 LUFS / TP -1,3, sin música.
- Manual: mención 1 a las ~3:00 (la frase para pedir el manual, ClBookPage pág. 9) · 2 a las ~6:48 (ClBookPage pág. 9, la lista) ·
  3 a las ~13:50 (QR /r regalo "Antes del Taller" + Manual US$27).

## Gotchas nuevos (esta PC)
- ⛔ `D:/Proyectos/video2` está VACIADO por StorageSense (3.847 archivos borrados, sin .env, sin public/sfx) y su `node_modules` está
  INCOMPLETO (falta @remotion/renderer/dist/esm) → el worktree hace su propio `npm ci` (44 s). La junction de node_modules NO sirve.
- ⛔ `.env`: copia de `D:/rtmp/recon/.env` (OpenAI viva) + `keys_unpack.sh` con KEYS_PASS = sha256 de la OpenAI VIEJA (la de
  `D:/rtmp/wt-mdsmell/.env`, hoy 401): el .enc del cerebro se cifró con esa.
- ⛔ RunPod infinitetalk: 2 FAILED seguidos "Error polling result: 502" (a los 17 y 10 min, mismo worker) → el 3er /run salió (29 min). FAILED no cobra.
- ⛔ El bundler de Remotion (stills) no copia la junction public/sfx_pro (EPERM symlink): sacarla con `rmdir` SIN /S y volver a crearla.
- ⛔ Pre-vuelo del farm exige `public/sfx/` aunque el kit no la use → copia de `D:/rtmp/recon/public/sfx`.
- agnes_qc mira `public/broll/<slug>` por defecto: los kf de esta cadena están en `public/vid/<slug>` → `QC_CLIPDIR=public/vid/<slug>`.
  Rechazados a ojo: el control se vuelve navaja, la puerta se abre sola, el espejo cambia de forma, el tablero termina en otro, manijas que saltan.
  Los rechazados se mueven a `vid/<slug>/_rech` + `_v3/<slug>_aceptados.json` (la toma queda en su foto). Hacer `_last.jpg` de vid/.
- gptimg: safety rebota "cerrajero metiendo una herramienta en la puerta" y "palanca en la manija" (parece robo) → redactar sin forzar.
- Stock: el juez aprobó humo de incendio por "camión", un probador por "tapa del tanque", un baúl de noche por "llanta de repuesto",
  pantalla verde, logos y patentes → hoja a ojo SIEMPRE.
- ClNeverMix dibuja botellas de limpieza: no sirve fuera de químicos (usar ClCheck).
- Descarga del release: con 8 curl en paralelo un tramo se puede trabar; si se mata, rellenar SÓLO el hueco por rango y comparar sha256 con `.assets[].digest`.
