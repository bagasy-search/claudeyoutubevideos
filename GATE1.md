# ⛳ COMPUERTA 1 — olstove (autopsia + guion)
Entregables en disco (todo en D:/Proyectos/video2-wt/olstove):
- `vlog/olstove/AUTOPSIA.md` (moldes Earl 378K y Zen 12,7M; comentarios leídos: 88 + 161)
- `guiones/olstove.txt` (guion de VOZ limpio, LF, sin URL ni precio, sin tags aún) y `vlog/olstove/guion_filmado.txt` (`[BLOQUE | qué se ve] frase`)
- `vlog/olstove/research_verdad.md` (22 datos con fuente y estado)
- Copiadas de lorpies/main: fish_factory.py, fish_asr.py, yt_comments.mjs (el orquestador avisó del resto).

## Medición de la voz `ole`
Bloque de prueba 612 car -> 38,1 s = **16,06 car/s** (más rápido que los ~14 del brief; con tags moderados suele bajar ~3-5 %). Guion: **13.179 car ≈ 13,7 min** (≈14,2 con tags/pausas). Está bajo el rango 14-17 min del brief: cubre el tema completo sin relleno; no lo alargué con datos sin verificar. Si querés 15+ min, agrego (a) bloque "leña: cómo elegir y cuánta comprar" y (b) "el error del tiro de la chimenea / gorro". Decidí vos.

## Minutos (car/s 16,06, sin tags)
| min | pasa |
|---|---|
| 0:00 | HOOK: puerta de la estufa abierta, pila al revés, promesa de 3 costumbres, "no es gratis" implícito |
| 0:37 | SEGURIDAD 1 (4 reglas: alarma CO, nada de líquidos, distancia/etiqueta, ceniza en balde) |
| **1:37** | **CTA único ~17 s** (libro, QR en pantalla, "back to the stove") |
| 1:58 | Respuestas a los comentarios: "unlimited heat" es un exagero (no es gratis); "cómo se apaga" |
| 2:54 | PAGO 1: la leña (medidor de humedad, <20 %, verde = creosota, almacenar, qué NO quemar, blanda vs dura) |
| 5:11 | **PAGO 2 = EL TRUCO DEL TÍTULO: encendido top-down** (paso a paso, 6 planos) |
| 7:11 | PAGO 3: regulador/damper (cierre por cuartos; el error de la brasa apagada) |
| 8:14 | Recargar sin riesgo |
| **8:50** | **"This is a page from the book" #1: p.36 Camp Bone Broth** (hervor perezoso = damper) |
| 9:23 | PAGO 4: creosota (1/8 in, inspección anual, linterna, fuego de chimenea) |
| 10:27 | PAGO 5: retener el calor (masa térmica, puertas, burletes, no sellar la estufa) |
| **11:36** | **"page from the book" #2: p.30 Chicken & Dumplings** (tapa cerrada 15 min) |
| 12:01 | Apagón: alarma CO con batería, extintor, 3 pies |
| 12:35 | CIERRE: repaso de las 4 reglas de seguridad + calendario oct-dic + pregunta ("what do you burn and how do you know it's dry?") |

## Open loops (retienen CAPAS, nunca el dato básico)
1. HOOK 0:20 "la primera costumbre, cómo se enciende... la mayoría la enciende al revés" -> paga 5:11 (top-down).
2. 4:46 "hay una razón por la que muchos deshollinadores lo enseñan así" -> 5:11.
3. 6:53 "la manija de la chimenea, donde la mayoría arruina un buen fuego" -> 7:11.
4. 8:50 "lo que te dije al principio, lo que atrapa a la mayoría" (creosota) -> 9:23. (La palabra creosota se planta a 3:30 y se promete volver.)
Hueco: entre 0:37 y 2:54 hay 3 cambios de tema seguidos, sin loop. Lo cubre el CTA y las respuestas. No tocarlo si aprobás.

## Seguridad en voz
En 0:37-1:37 (4 reglas), otra vez en 2:54-5:00 (leña verde/qué no quemar/creosota semilla), 9:23 (creosota + fuego de chimenea), 12:01 y en el cierre 12:35 (repaso con las mismas 4). Prohibido cumplido: NO se dice "gratis", "ilimitado" ni "sin electricidad" (el guion dice "no es gratis" y usa el término entre comillas como cita de lo que escribió la gente).

## Cruce con el libro (de `ole-guide/build/book.pdf`, número impreso = índice de la página del PDF)
- p.10 KITCHEN SAFETY: "Cast Iron & Fire Safety" trae la alarma de CO y de humo, carbón sólo afuera, y el extintor de grasa (soda, nunca agua). En voz la alarma de CO cae en 0:37 y 12:01. **No se muestra como página del libro con "leña"**, porque el libro no habla de estufas de leña: sólo CO/carbón.
- p.36 Recipe 23 Camp Bone Broth: truco "Start in cold water and never let it boil hard… barest simmer" (verificado literal). Usado 8:50.
- p.30 Recipe 17 Chicken & Dumplings: truco "Keep the lid on for the full 15 minutes… every peek lets [the steam] out" (literal). Usado 11:36.
- Add-on: `upsell.json` -> "Fire, Fuel, and Carbon Monoxide Safety" (es de carbón/leña AL AIRE LIBRE, no de estufa de casa). Se nombra el add-on UNA vez, sin precio y "gets offered once, after you've got the book". OK.
- ⚠ El libro casi no habla de estufa: el CTA está presentado como "todo lo que cocino en esta estufa" (libro = qué se cocina encima). No hay página que diga cómo operar una estufa; no la invento.
- Imágenes de página: sólo existen pagina_metodo/frijoles/guiso. Para p.36 y p.30 rendereo con pdftoppm (Gate 2).

## Riesgos que quiero que decidas
1. **El truco del título (top-down) llega a 5:11**, contra 0:28 del molde. El HOOK lo muestra al revés y nombra las 3 costumbres, pero si querés paga temprana movemos "top-down" antes de la leña (a ~2:40).
2. Datos PARCIALES a cerrar antes del render (research_verdad #7 CSIA top-down, #15 36 in, #18 fuego de chimenea, #19 no echar agua): no cambian el guion salvo #19 (si no aparece fuente lo suavizo).
3. Autopsia sin medir cortes/min del molde: yt-dlp 403 al descargar.
4. Voz en 16,06 car/s -> ~13,7 min; sobre el mínimo 14 hay que agregar contenido o aceptar.
