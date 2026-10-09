# HANDOFF — fuhormiga (Claudio el Fumigador #5 · serie "La casa de los Ramírez" ep. 5: el cebo que se lleva el nido)
Estado: ✅ ENTREGADO 8-oct (job 802, tarjeta → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fuhormiga/fuhormiga.mp4?v=1 (15:18, 27.530 cuadros). Auditor: min1 31 cortes / 0 silencios, negro 0, congelados 0. Real 29,4 % · 14/36 vl agnes. Rama `fuhormiga-render`, sale de `furatas-render`. Lote 4-6 hecho EN PARALELO el 8-oct.

## Qué cambia respecto de furatas (pedido único del creador para el lote 4-6)
- VOZ = ElevenLabs **v4 Turbo** (no Fish): `vlog/claudio/voz_el.py` (ELEVENLABS_API_KEY_2, voz clonada "claudio" HerPIKiYd1lu2EdlfZyx,
  bloques de 1500 car, misma compuerta Modal). Etiquetas v4 en inglés en `vlog/fuhormiga/tags.json` (~50, tono/emoción/susurro/risa).
  15 car/s. Turbo = la mitad de créditos que v4 (medido). ⛔ Modal se come los títulos "Paso N: …" → hueco falso (confirmar con whisper-1).
- MUCHOS clips HABLADOS agnes 2.5-flash (`vl`): `mkplan.mjs` adaptado a la cocina de los Ramírez (k0 = public/ref_fuhormiga.png, cara
  public/ref_fuhormiga_face256.png recortada de la ref). Anclas por Batch (agnes_vlog anclas) → `clips` → `vl_check.py` (labios por envolvente
  + ASR Modal, sin OpenAI) → `vl_post.py` (→ public/vid/fuhormiga, 1080p 30 mudo). Los que no llegaron: avatar RunPod (`_v3/fuhormiga_aceptados.json`).
  Entraron 14/36 clips hablados (agnes saturado: ~5-40 clips/h).
- Kit nuevo `src/claudio/ClHormiga.tsx: ClAntRelay (share/spray) · ClBaitStation (mix/station) · ClAntDays` (registrado con D:/rtmp/fumi/register.py: ClMain, BEDABLE, CMAX, sound.mjs, banco index_fukit).
- Arreglo 5 de fixes.json = pág. 13 del Manual. Polaroid del ep. anterior (th_fufruta) · gancho al siguiente (th_fucasero).
- CTA final: la hoja "Antes de Fumigar" con la 3ª prueba (cinta doble faz) que no salió en ningún video + Manual 66 arreglos, US$27, 7 días.

## Números
- Voz 15:17 (11 bloques, 0 reintentos) · minuto 1 ≥32 cortes · metraje real ≥25 % (stock + camas; varias rondas, mucho rechazado a ojo).
- Avatar 1 /run US$0,25, lag -0,20..0.

## Gotchas
- ⛔ farm.mjs SIN `FARM_REF=<slug>-render` corre el código de main → "Could not find composition". Y el farm partió en 60 chunks aunque se pidan 150: encfin con el número REAL (`gh release view chunks-<slug>`).
- ⛔ agnes "You have used up today's video generation quota… 1 request every 3 minutes" se trataba como REJECT y se ABANDONABA el clip →
  parche "quota" en factory/lib/agnes_pool.mjs (185 s de descanso a esa clave) + `AGNES_IP_REST_MS` configurable. Falta subirlo a main.
- ⛔ OpenAI llegó al límite duro de facturación a mitad del lote: imágenes extra sin hacer → se sacaron esos planos de dir_e.
- ⛔ stock.mjs sólo busca los planos que existen AL LANZARLO: correrlo de nuevo después de agregar dir_e/beds.
- sfx_gate --prev furatas marca efectos repetidos (sound.mjs es el mismo en toda la serie); minuto 1 y ambiente OK.
- AGNES_KEYS_OTRA_PC="," para usar las 46 claves.
