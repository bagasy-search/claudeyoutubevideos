# HANDOFF — om99 (Claudio Old Mechanic #1 · EN · serie "Miss Doris's Car" ep. 1: las 15 funciones escondidas)
Estado: ENTREGADO (job 793, release om99, 961 s). Negro 649,5 s = clip k_glow (baúl a oscuras con la manija verde) — intencional.
Rama `om99-render`, sale de `fu30-render` (Fumigador ep. 2). Es la PRIMERA vez que la cadena vlog/claudio corre en INGLÉS: los videos
2-3 (omkey, om500k) salen de ESTA rama.

## Qué cambió para inglés (todo commiteado en esta rama)
- `voz.py`: voz por defecto `claudio_en_definitiva` (ElevenLabs v4 con tags → Fish crudo, fish_refs/claudio_en_definitiva.mp3),
  `--lang en`, `--cps 18.5` (medido 17,4 car/s en el video entero). ⛔ La compuerta contaba "thirty-five" vs "35" y "a hundred and
  twenty" vs "$120" como frases comidas (gap 4-5) → `norm()` ahora colapsa cualquier número (palabras o cifras) a un token "#".
- `timeline.mjs`: `norm()` une apóstrofos y guiones ("Doris's", "I'll", "rear-end") en vez de separarlos (si no, 25 tomas "no encuentro").
- `chk.py` EN: cuenta caracteres y minuto de cada mención (Manual/page/free/twenty-seven). 15:00-15:30 ≈ 16.700 car.
- `mkplan.mjs` lang en; `stock.mjs` juez de "car-care channel"; `meta.mjs` row 312, slice desde "I'm Claudio", "Capítulos:"→"Chapters:",
  landing old-mechanic-claudio.vercel.app; `job.mjs` row 312 + voice_ref; `avatar_run.mjs` prompt de mecánico (azul marino).
- Componentes genéricos traducidos en esta rama (ClCards: CHAPTER, WORK ORDER, FREE ON PAGE, PAGE N, BEFORE/AFTER, point your camera
  here · ClOverlays · ClSarro ClVideoRef NEXT VIDEO/ON THE CHANNEL · ClParts KeyTag = parche con LLAVE INGLESA).
- ClTheme: azul marino #1F2A44 + mostaza #B7791F (Glovebox Manual) + rojo alertas.
- lib.mjs: WHO mecánico (camisa azul marino, trapo rojo, grasa), SHOP, DRIVE (entrada de Doris), DORIS, CAR (sedán plateado 2012
  sin marcas, 280.000 millas), Frank (difunto, sólo en fotos), DOG Daisy.
- Kit NUEVO `src/claudio/ClMecanico.tsx`: ClFeatureTag (etiqueta de taller manila con el número de la cuenta regresiva) · ClGasArrow
  (indicador de nafta + flecha → auto desde arriba con la tapa) · ClCarMap (el auto de Doris con un punto por función: done/now) ·
  ClOBDScan (scan: puerto 16 pines + lector + código; price: $120 / $20 / FREE). Registrados en ClMain, BEDABLE, CMAX, sound.mjs.
  Banco de stills `src/index_mekit.tsx` (props reales del video).
- SONIDO: sfx_pro NO tiene autos → `vlog/claudio/sfx_car_gen.mjs` (ElevenLabs SFX) → `public/sfx_car/*.mp3` (19: amb_shop, amb_driveway,
  amb_car_interior, car_door_*, trunk_pop, hood_close, engine_start, fob_chirp, ratchet, tire_air, seat_click, glovebox, gas_cap,
  turn_signal, obd_beep, wiper_rain, plastic_clip). `sound.mjs` resuelve el prefijo `car/` → `sfx_car/` (PATH()). ⛔ public/sfx_car
  NO está en git: copiarla al worktree del video 2 (o re-correr sfx_car_gen con crédito de ElevenLabs; la cuota quedó en ~0).
- `scripts/stills_at.mjs`: bundle en `D:/tmp/remotion-stills-bundle-om99` (el fijo compartido chocaba con otra sesión: EEXIST).

## Números
- Guion 16.843 car, 99 párrafos · voz 967 s crudo → 960,5 s tras comprimir el gancho · 20/20 bloques (sim 0,97-1,0).
- Modal marcó 2 huecos (3:44 y 12:28): FALSOS (whisper-1 los oye). Avatar 1 /run, 59 ventanas, 252 s, US$0,25.
- Minuto 1: 34 cortes, toma máx 3,22 s · avatar 24,9 % · metraje REAL 25,9 % (stock en toma 11,8 + camas 14,2) · agnes 13/15 aprobados
  (k_lockbag y k_childlock mutaban la llave → foto) · 266 tomas · 40 componentes · mezcla -14,1 LUFS / TP -1,6, sin música.
- Imágenes gpt-image-2 low Batch: 168 (OpenAI se quedó sin crédito a mitad: el creador cargó; los batches viejos con error hay que
  marcarlos `bajado:true` en `_gptimg_batches.json` o el reintento vuelve a bajar los mismos errores).
- Stock: 62+31 elegidos por el juez, 20 rechazados a ojo (patentes, marcas VW/CUPRA/Chevrolet, carteles, volante a la derecha, grafiti,
  tomas que no muestran la frase).

## Gotchas
- agnes_qc con clips en public/vid: `QC_CLIPDIR=public/vid/<slug>`. Los kf necesitan `<clip>_last.jpg` (ffmpeg -sseof -0.1).
- El farm pide `public/sfx` (copiar de video2/public/sfx) y `public/med`.
- La serie: ep. 2 `omkey` (la llave: pila CR2032 + funciones; arranca con Doris en el porche apuntando la llave que no anda) ·
  ep. 3 `om500k` (hábitos de 500.000 millas). Polaroid th_om99 en el ep. 2.
