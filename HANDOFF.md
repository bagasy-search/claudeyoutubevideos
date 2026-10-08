# HANDOFF — fuagua (Claudio el Fumigador #1 · serie "La casa de los Ramírez" ep. 1: el frasco de agua oxigenada)
Estado: en entrega (job 784, tarjeta fuagua del row 305).

## Cadena = la del Albañil (almoho-render → … → alolor-render) adaptada al FUMIGADOR en ESTA rama (fuagua-render). fu30 y furatas salen de acá.
- lib.mjs: WHO = camisa caqui de dos bolsillos + anteojos de seguridad en la frente · HOUSE = cocina de los Ramírez (azulejo blanco con guarda
  azul, granito gris moteado, muebles de madera, refrigerador blanco viejo con dibujos, plato de Bruno) · LUCIA, JORGE, KIDS (Sofía 9, Mateo 6), DOG (Bruno, caramelo).
- avatar: ref `vlog/fuagua/mk_ref.mjs` (claudio_hd + caqui + anteojos, en la cocina) → `public/ref_fuagua.png` (copia en
  Downloads/plan_red_claudio/ref_ramirez_cocina.png); cara `public/ref_<slug>_face.png` = plan_red_claudio/face.png. Video N: copiar ambas como ref_<slug>*.png.
- Marca: ClTheme verde fumigador (#2E8B3E del Manual) + caqui; ClChapter = parche bordado (escudo verde con cucaracha tachada); ClCheck "ORDEN DE SERVICIO".
- Kit nuevo src/claudio/ClFumigador.tsx: ClHidden50 (1 que ves / 50 que no) · ClFridgeBack (find/fixed: agua, croquetas, motor, huevos / cebo en tapita
  lejos de niños y perro) · ClPeroxide (contact/gone) · ClTrailMap (trail/erase/bait) + `Roach` exportado. Banco de stills: src/index_fukit.tsx.
- job.mjs/meta.mjs: row 305; meta = 1ª línea regalo /gratis/?src=<slug>-desc · 2ª landing ?src=<slug>. stock.mjs: juez de "pest-control".
- sound.mjs: linterna, refrigerador que se corre, croquetas, aerosol; cucarachas = papel muy bajo (regla al final); amb nocturno = amb_fridge_hum.
- Disco: farm con `TAR_DIR` en C y `FARM_NOWAIT=1` (no bajar el crudo: el final lo arma encfin desde chunks-<slug>); `public/med` hay que copiarlo
  de video2/public/med (el pre-vuelo lo pide).

## Números
- Guion 13.320 car (tú neutro) · voz claudio_definitiva 918 s crudo, 16/16 bloques al 1er intento (14,58 car/s) → 915 s tras comprimir el gancho.
- Minuto 1: 33 cortes · loop "lo que encontré detrás del refrigerador" pagado a las 4:21 · Manual: mención 1 a las 3:20 (pág. 9, frase del
  mostrador) · 2 a las 7:50 (ClBookPage pág. 9) · 3 a las 14:13 (QR /r + Manual US$27).
- Avatar 1 /run 54 ventanas 226 s US$0,25 (37 min en cola+proceso), lag -0,10..0 · avatar 23,4 % · real 26,3 % · agnes 8/12 (2 vertían líquido MARRÓN
  —el agua oxigenada es transparente—, 1 deformó la ooteca, 1 sin linterna → foto) · mezcla -14,0 LUFS / TP -1,7.

## Gotchas
- ⛔ Stock: el juez aprobó OTRAS familias y OTROS perros (hasta un gato) para los Ramírez/Bruno → con personajes fijos, nada de q: (sólo gpt).
  3ª ronda de stock de objetos: 2/12 servían. Las camas de cocinas genéricas sí: así se llegó a 25 %.
- ⛔ ClTimer30 es reloj de MINUTOS: para "21 días" usar ClNotebook. ClNotebook con claves largas parte la fila y pisa el título: claves ≤ 11 car.
- ⛔ Falsos huecos de Modal (2): confirmados con whisper-1 sobre el tramo antes de regenerar.
- ⛔ Otra sesión borró los worktrees al* durante este video (disco lleno): commitear + pushear la rama seguido.
