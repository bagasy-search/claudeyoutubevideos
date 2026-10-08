# HANDOFF — furatas (Claudio el Fumigador #3 · serie "La casa de los Ramírez" ep. 3: los ratones del garaje)
Estado: ✅ ENTREGADO 8-oct (job 790, tarjeta plan-own-1791387464226-2 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/furatas/furatas.mp4?v=1 (16:49, 30.278 cuadros). Auditor: min1 31 cortes / 0 silencios, negro 0, congelados 0.
Rama `furatas-render`, sale de `fu30-render`.

## Qué cambia respecto de fu30
- Guion `guiones/furatas_filmado.txt` 14.697 car · Arreglo 3 = pág. 11 (`public/img/furatas/page11.jpg`). Polaroid del ep. 2 (th_fu30) · gancho al ep. 4: mosquitas del frutero (th_fufruta).
- Seguridad: menta ARRIBA (le hace mal al perro/gato), trampas dentro de caja con agujeritos de moneda (Mateo/Bruno), ácido bórico del ep. 1 en su tapita, limpiar sin barrer en seco (guantes + mascarilla + agua oxigenada).
- Kit nuevo `src/claudio/ClRaton.tsx`: ClPoisonWall (wall/dog) · ClFlourMap (tracks/clean/mint) · ClCoinHole (coin/plug) · ClTrapSet (wall/box). Registrados igual que ClPuerta.
- `vlog/furatas/dir_e.mjs` + timeline.mjs lee dir_e: planos de stock extra para llegar a ≥25 % de metraje real.

## Números
- Voz 18 bloques (1 reintento) 1011 s → 1008 s. Modal marcó 3 huecos FALSOS; los tiempos de esas palabras se corrigieron con whisper-1 (palabras) en _v3/furatas_wordms.json.
- Menciones: ~3:27 (frase del mostrador, pág. 11) · ~8:11 (ClBookPage pág. 11) · ~15:40 (QR /r + US$27).
- Avatar 69 ventanas 324 s, US$0,25 · real 29,4 % · agnes 5/9 (k_bait, k_pour, k_sniff, k_woolpush → fotos).

## Gotchas
- ⛔ RunPod quedó en saldo NEGATIVO (402 Insufficient Balance) → el creador cargó. Chequear `clientBalance` por GraphQL antes del /run.
- ⛔ Real 17,8 % al principio: el stock de objetos falla mucho (mouse→pika/hámster/rata blanca, steel wool→lana). Subió con 4 rondas: queries simples + renombrar el plano (stock.mjs salta lo que está en `_rech`).
- ⛔ Planos extra que caen JUSTO antes de una ventana de avatar la corren (mínimo de duración) → comparar con _v3/<slug>_avwin.json antes del farm.
- ⛔ Componente casi estático 6 s = congelado del auditor: ClTrapSet "wall" lleva acercamiento continuo.
- ⛔ Imágenes nuevas tras el farm → render COMPLETO (ONLY_CHUNKS no re-sube assets).
