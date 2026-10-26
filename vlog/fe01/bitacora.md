
## 26-oct 03:25 · COMPUERTA DE CARA
- Lámina D:/rtmp_fe01/lamina_cara.jpg = ernesto_av.png (ChatGPT web, sentado, cámara baja, manos apoyadas) + ernesto_face.png + ernesto_perfil.png. Canal nuevo: todavía no hay miniatura de un HIT para comparar.
- misma persona: sí
- 26-oct 04:03 · reel RunPod LISTO: 388,44 s de 388,7 (entero), US$0,25, 47 min, 1 solo /run (job b2ed42d1…-u1) · copia en D:/rtmp/avatar_reels/fe01_reel0.mp4 · revisado: misma persona, nítido · ensayo farm OK 03:46 (run 40280142369)

## 26-oct 04:00-05:00 · QC de componentes (pedido «prolijo, sin errores, nivel productora»)
Qué se revisó:
- Una foto por cada pieza (91): `D:/rtmp_fe01/qc2` y `qc3` (hojas de 6), mirada a ojo.
- Las 71 fotos de documento que se usan: `qc_docs/d0..d5`.
- Stills cada 30 s de los 22 min: `qc30/s_0..s_7`.

Qué se arregló:
- Comillas grandes de Quote y Dicho: ahora cuelgan sobre la tarjeta. Antes las tapaba el texto.
- Recibo:
  - el sello (TEMPORAL/REGISTRADO) va debajo de los renglones, con más margen abajo;
  - la ✓ va a la izquierda;
  - las anclas internas se comprimen dentro de la pieza: el recibo de 1112 s no mostraba sus renglones.
- Ficha: el dato se ajusta al ancho («JUNIO → SEPTIEMBRE», «6 AÑOS · 5 SI ES MENOR» ya no se cortan).
- Mapa: la etiqueta I-35 se movió.
- BigNum: el subtítulo es más grande y tiene sombra, y la x se acota para que no se salga del cuadro.
- Refrendo: dura 10,5 s y la etiqueta roja «vence» ya se ve.
- Capítulo 10: el numeral de dos cifras ya no pisa el título.
- Comentario: «Add a comment…» → «Añadir un comentario…».
- Prioridad: el capítulo le gana al sello que caía encima; el sello «UNA PALABRA» se cae.
- Nueva pasada **evitar caras** (yunet): las piezas grandes que tapaban una cara se corren de lugar (19 piezas).
- Fotos con texto falso o pixelado regeneradas:
  - n14, n64: texto pixelado;
  - n22, n34: letras inventadas;
  - n51: cartel en inglés «For Rent»;
  - m155: linterna japonesa en un panteón mexicano.
- Clip LTX `fe_lapida_chueca`: letras inventadas en la lápida → foto n19.

Se dejó igual (a propósito):
- el sello CTA repetido;
- el texto chico ilegible de m138, m141 y m176 (no se lee como letras).

## 26-oct 06:35-07:00 · LTX revisados a ojo (3 cuadros por clip) y final 2
- Primera tanda: 13 de 15 clips traían un TRÍPODE dentro del cuadro (el prompt decía «fixed camera on a tripod»). Se apartaron a `D:/rtmp_fe01/ltx_malos_tripode` y se re-encolaron 40 clips `_v2` con un prompt sin trípode y sin letras.
- Segunda tanda (36): se rechazaron 9 clips, que se apartaron a `ltx_malos_letras` / `ltx_malos_tripode`:
  - aviso_lista, capilla_oxidada, libro_registro, perro_velador, placa_arrancada, sillas_termo, sello_papel: letras inventadas grandes;
  - carpeta_papeles: mano deformada;
  - oficina_manana: trípode chico.
- analco_templo y cafe_olla no llegaron: se retiraron de la cola y van con foto de respaldo.
- Resultado: 25 clips LTX en pantalla (antes 2) y 11 respaldos. Se miraron las piezas que caen sobre clips nuevos (ficha floreros, stamp, quote, lugar): OK.
- Mezcla: `D:/rtmp/sfxlib/mezcla.py` se quedaba sin RAM porque `gs` era float64. Se pasó a float32 (copia en `D:/rtmp_fe01/mezcla.py.bak`). Mezcla rehecha con los clips nuevos.
- Final 2 lanzado en el farm (`granja.sh fe01 final`).

## 07:41 — FINAL 2 en el farm
- render 40304259791 (202/202) + encfin 40305222366 → 39.683 cuadros (22:03), release fe01/fe01.mp4
- 25 clips LTX _v2 en pantalla (todos mirados a ojo: sin trípode ni letras), 11 lugares con foto de respaldo, avatar 30 %
- meta: public/fe01_meta.json (título + descripción 1.372 caracteres, sin < >, CTA suscribirse + pregunta)
- sin piano ni miniatura (no hay Chrome): mezcla voz+foley aparte en D:/rtmp_fe01
