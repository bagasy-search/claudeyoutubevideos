# PROMPT — The Old House Fix: los 6 primeros videos de invierno (pegar en un chat nuevo)

Hacé, UNO POR UNO (no avances al siguiente hasta entregar el anterior), los 6 videos de @oldhousefix de esta tabla.
Canal en inglés (EE.UU.). Leé SOLO esto, en este orden y sin releer: `canales/oldhousefix.md` (presentador = Claudio:
afeitado, pelo plateado hacia atrás, camisa cruda + tiradores; cara = persona "hombre 70´" de la librería de avatares) →
`factory/PLAN_FABRICA.md` §0–2 → la memoria del último video del canal (`project_video_ohfstinkbug`) para el flujo.
Producción por la fábrica (`factory/run.mjs` + spec.json, nada de scripts por slug). Imágenes: gpt-image-2 **low + Batch**
obligatorio. Tarjetas ya creadas en Bagasy (tracked_channels id 147): usá su card id para entregar.

| # | Card id | Título (no tocar) | Capítulo del manual | Día de la historia |
|---|---|---|---|---|
| 1 | ohf1791387991754-4 | Furnace Keeps Cycling On and Off? Flame Sensor Cleaning - Furnace Troubleshooting | Ch. 2 | Noche 1: se corta la calefacción |
| 2 | ohf1791387991754-2 | Is It Cheaper To Leave The Heating On Constantly? | Ch. 4 | Mañana 1: "¿la dejo prendida?" |
| 3 | ohf1791387991754-0 | How To Bleed An Old Radiator - Don't try it until you watch this | Ch. 3 | Día 2: el cuarto de arriba sigue frío |
| 4 | ohf1791387991754-3 | How to Prevent Frozen Pipes Every Winter | Ch. 7 | Día 3: llega la ola polar |
| 5 | ohf1791387991754-1 | No Hot Water: Gas Water Heater Troubleshooting | Ch. 8 | Día 4: se apaga el piloto en plena helada |
| 6 | ohf1791387991754-7 | DIY: Stopping ice dams on your roof | Ch. 9 | Día 5: cae la nieve y aparece el dique |

## La historia que encadena los 6 (storytelling)
"The first cold week" — UNA casa vieja (1920s, compuesta: sin nombres reales, sin cifras ni testimonios inventados;
Claudio la cuenta como "a house like the ones I've worked on for forty years") atraviesa su primera semana de frío.
Cada video resuelve UN problema y termina abriendo el siguiente ("…and two days later, the upstairs bedroom was still
cold. That's the next video."). El video 1 presenta la casa; el 6 cierra la semana y manda a ver el 1 al que llegó tarde.

## Primer minuto (cada video, alta retención)
- 0–8 s: cold open sensorial del momento del fallo (sonido, frío, hora exacta: "2:14 a.m. The furnace clicks, lights, and dies.").
- 8–20 s: la promesa concreta del título + lo que cuesta no saberlo (una visita nocturna, un caño partido) — sin cifras inventadas.
- 20–35 s: pattern interrupt visual (el objeto en macro: el sensor con hollín, el radiador, el caño con escarcha).
- 35–60 s: abrir el loop que se cierra al final ("there's one thing everybody does right after this that undoes it — I'll show you") + 1 línea de la historia de la semana.
- Nada de saludo ni "welcome back" antes del segundo 60.

## Menciones (obligatorias, casuales, nunca leídas como aviso)
- **3 menciones al Old House Winter Manual por video**, cada una atada al momento: "this is in chapter 2 of the Winter Manual, with the blink-code chart", "I put the whole checklist in the manual", "the manual has the questions to ask before you sign". Una en el primer tercio, una a la mitad, una al cierre.
- **1 mención a la tarjeta gratis** (No-Heat Night Card) al cierre, con el QR en pantalla: "it's free, the link is at the top of the description".
- **2 menciones a otros videos de la serie**: el anterior ("if you missed the night the furnace died, that's the video before this one") y el siguiente (cliffhanger). El video 1 menciona solo el siguiente.
- Reglas del embudo: precio NUNCA en voz ni en pantalla ni en la descripción; URL NUNCA leída ("the link is at the top of the description"); el manual nunca se llama "free" (la tarjeta sí); nada inventado.

## Entregables por video (y recién ahí el siguiente)
1. Guion (≥14.000 caracteres, inglés hablado, frases cortas) con las marcas `[MANUAL]`, `[CARD]`, `[SERIES←]`, `[SERIES→]`.
2. Descripción: 1ª línea `👉 FREE No-Heat Night Card: https://ohf-landing.vercel.app/winter?v=<slug>` · 2ª línea `📘 The Old House Winter Manual: https://ohf-landing.vercel.app/winter?v=<slug>#manual` · resumen value-first con los pasos del video · links a los otros videos de la serie publicados · hashtags.
3. Comentario fijado con la pregunta de cierre del video.
4. Video renderizado y entregado a su card de Bagasy (`scripts/deliver_card.mjs`), con las compuertas de entrega.
5. Una línea en el §6 de `canales/oldhousefix.md` con el gancho usado.

Ahorro de tokens: no releas archivos ya leídos, no muestres guiones completos en el chat (escribilos a archivo), reportá
cada video en ≤5 líneas.
