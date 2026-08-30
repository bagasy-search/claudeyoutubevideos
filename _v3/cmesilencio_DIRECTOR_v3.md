# §0 DIRECTOR v3 — cmesilencio / Claudio Mendoza Constructor

## Decisión de corrección

Este es un re-montaje visual del mismo guion, la misma voz master y el mismo avatar. No se regenera audio ni avatar. La capa narrativa fija se rehace con 24 fotografías generadas con ImageGen usando el fotograma de Claudio como referencia de identidad. Las animaciones de b-roll se mantienen y se amplía su presencia usando exclusivamente clips del pool producido con Agnes.

La estética es **fotografía real de taller**: luz disponible, textura de madera, polvo, tela, piel y concreto; color neutro; composición útil para leer los rótulos. No se usa look de película, gradación dramática, brillo publicitario ni imágenes con texto inventado. La imagen no reemplaza una prueba: cada afirmación técnica se acompaña con un objeto, una acción o una medición.

## Arco visual

1. **Problema:** el ruido aparece como una molestia concreta y medible; generador, chapa, ventilador y ducto se ven antes de ser explicados.
2. **Diagnóstico:** la caja no es una cueva; la historia visual separa sonido, aire, calor y monóxido.
3. **Construcción:** manos, herramientas, juntas, lana, agujero y tacos muestran el proceso en acciones cortas.
4. **Prueba:** medidor, termómetro, distancia, pared y línea de visión vuelven la promesa verificable.
5. **Decisión:** mantenimiento, errores, lluvia y cierre muestran una solución abierta y prudente, no un truco mágico.

## Fórmula visual V3

- **Primeros 2 s:** avatar full-frame limpio, sin rótulo que tape la entrada.
- **Después:** ningún plano fijo de foto supera 6,5 s; las fotos tienen Ken Burns visible y cambian de encuadre por semántica.
- **Meta de mezcla:** 50–60% de la duración cubierta por clips de Agnes, 25–35% por fotografías nuevas, y el resto por movimientos reales del kit, fichas, láminas y avatar sólo como piso de seguridad.
- **Clips:** sangre completa, cortes de 3–6 s, con acciones legibles: medir, cortar, taladrar, aplicar, comprobar, separar, mirar y corregir. Agnes sólo se usa para clips animados; nunca para generar las fotografías fijas.
- **Fotografías:** 24 assets naturales en `public/img/cmesilencio_v3/`, cada uno con companion `_blur`. Se reutilizan por sección y no consecutivamente como la misma foto.
- **Overlay:** `IconoNum`, `Rotulo`, `Ficha`, `Lamina` y las tres tarjetas CTA permanecen sobre una base viva. No se agregan subtítulos corridos.

## Mapa de actos y componente dominante

| Acto | Ancla de voz | Acción visual | Componente/pool |
|---|---:|---|---|
| S1 · Hook | 00:00–01:29 | medir, mostrar generador, ducto y chapa | Avatar + clips S1 + fotos 01–06 |
| S2 · Por qué suena | 01:29–03:33 | separar escape, motor y ventilador | `MovTercios` + clips S2 |
| S3 · Honestidad | 03:33–04:51 | medidor, límites, calor y monóxido | clips S3 + fotos 03/06/07/12/21 + CTA 01 |
| S4 · Tres números | 04:51–05:59 | aire, decibeles y temperatura | `MovNumeros` + clips S4 |
| S5 · Tres ideas | 05:59–07:20 | cortar, perforar, forrar, dejar salida | `MovAgujero` + clips S5 |
| S6 · Dos dólares | 07:20–08:23 | sellar sin clausurar, aislar vibración | clips S6 + fotos 08/09/16 |
| S7 · Fracasos | 08:23–09:25 | lona, plástico, rebote y calor | clips S7 + fotos 14/03/04/22 |
| S8 · Lista $20 | 09:25–10:31 | materiales reales y función de cada uno | clips S8 + `Ficha` |
| S9 · Ubicación | 10:31–12:18 | ventana, pared, distancia y línea de vista | clips S9 + fotos 19/20/15 |
| S10 · Túnel no | 12:18–13:08 | mostrar claramente qué no se debe cerrar | clips S10 + fotos 12/13/20 |
| S11 · Configuración | 13:08–14:08 | escuadra, hueco, rejilla y termómetro | clips S11 + fotos 11/15/16/18 |
| S12 · Primera versión | 14:08–15:42 | revisar materiales y comprobar calor | `MovHorno` si está declarado + clips S12 |
| S13 · Medición | 15:42–17:04 | 78 → 72 → 69 → 66 dB y juntas | clips S13 + fotos 01/06/18/21 |
| S14 · Prueba extra | 17:04–19:25 | girar, separar, comparar y corregir | `MovDieciocho` + clips S14 + CTA 02 |
| S15 · Qué queda | 19:25–23:01 | mantenimiento, lluvia, fuego y respaldo | clips S15 + `Ficha` |
| S16 · Cierre | 23:01–27:15 | volver a medir y decidir con criterio | clips S16 + fotos 23/24/19 + CTA 03 |

## §4 AUDITOR — obligatorio antes de entregar

El auditor debe comprobar en el MP4 del FARM, no en una previsualización local:

- CFR efectivo 30 fps, PTS monotónico y duración dentro de ±1 s de la composición; el stitch ya no se acepta sólo por `r_frame_rate`.
- Audio único, continuo y sincronizado con el mismo `cmesilencio_fish.wav`; avatar muteado.
- Hook legible, sin cuadros negros ni congelamientos de más de 1,5 s.
- Ninguna foto repetida en dos cues consecutivos; ningún tramo de foto sin cambio visible mayor a 6,5 s.
- Mix de clips objetivo ≥50% de la duración cuando se cuentan cues efectivos, y al menos 140 clips únicos del pool disponible si los slots lo permiten.
- Cada CTA aparece exactamente una vez, con QR decodificable y sin precio/URL en voz alta.
- No hay subtítulos corridos, logos inventados, texto roto, cortes con frames vacíos ni imágenes que muestren un generador encerrado.

Si alguna comprobación falla, el video no se publica como listo: se corrige y se vuelve a auditar.
