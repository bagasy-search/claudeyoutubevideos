# RECETA DE LA FÁBRICA — cómo se hace un video entero (leé SÓLO esto, `KIT.md` y el BRIEF)

Vos sos el **director**: escribís 5 archivos en `vlog/<slug>/` y corrés las etapas de `python vlog/fab/fab.py`.
⛔ No programes nada, no edites scripts ni componentes, no leas la memoria ni otros worktrees, no abras imágenes ni videos:
todo lo mecánico (voz, fotos, clips, armado, avatar, revisión visual, mezcla, render) ya está hecho y probado. Si una etapa
dice ⛔, la causa está en TUS archivos: corregilos y corré la etapa otra vez. Cada comando imprime poco: no hagas `cat` de logs enteros.
El slug ya está fijado en `vlog/fab/actual.txt`. Estado y siguiente paso: `python vlog/fab/fab.py estado`.

## Orden
1. Escribí `guion.txt` + `meta.json` → `fab.py guion` (hasta ✓)
2. `fab.py voz` (fondo, ~15-25 min) → `fab.py esperar voz` hasta que diga TERMINÓ
3. Escribí `planos.json` → `fab.py planos` (te dice cuántos planos necesita cada sección; completá hasta ✓)
4. `fab.py imgs` (fondo) → `esperar imgs` · después `fab.py clips` (fondo, 30-90 min) → `esperar clips`
   (mientras esperás, escribí `avatar.json` y `ov.json`: necesitan sólo el guion)
5. `fab.py armar` · `fab.py avatar` (fondo, ~25 min) → `esperar avatar`
6. `fab.py ov` (hasta ✓) · `fab.py editor` (fondo, ~15 min) → `esperar editor`: si marca defectos, arreglá ov.json y repetí `ov` + `editor`
7. `fab.py mix` · `fab.py render` (fondo, ~60-90 min) → `esperar render` hasta FIN. Terminado: respondé con el link del mp4 y nada más.
`esperar` vuelve cada ~9 min: llamalo de nuevo (cada llamada es barata). No uses sleep ni mires procesos.

## 1. guion.txt — UNA línea = UN párrafo, con su sección adelante
```
[GANCHO] En las cocinas de restaurante no se usa aerosol cerca de la comida. Y no tienen moscas.
[GANCHO] ...
[PROBLEMA] ...
```
- Secciones en MAYÚSCULAS (GANCHO, CASA, PROMESA, POR_QUE, ARREGLO1, ARREGLO2…, CIERRE): cada una es un bloque seguido; 8-14 secciones.
- Párrafos de 1-4 oraciones (≤900 caracteres). Largo: ~14 caracteres por segundo → 12 min ≈ 10.000 caracteres.
- Español NEUTRO con TÚ (tienes, mira, aquí, refrigerador, fregadero). Nada de voseo ni "acá". Números escritos como se dicen.
- Voz de Claudio: frases cortas, concretas, de oficio; cuenta lo que hace con las manos mientras lo hace; honesto sobre lo que NO sirve.
- Primer minuto: 0-5 s la frase que contradice lo que todos creen · 5-20 s la casa/familia + un misterio abierto · 20-45 s la promesa
  concreta de qué va a ver · 45-60 s por qué saberle (30 años de oficio). Nada de saludo ni "suscríbete" antes del segundo 60.
- Cada arreglo: qué es, por qué funciona (una imagen mental simple), cómo se hace paso a paso con cantidades, el error común, el resultado.
- Lo que pida el BRIEF (menciones al Manual, video anterior/próximo) va tal cual.

## 2. meta.json
```json
{"titulo": "...", "minutos": 12, "voz": "claudio_definitiva",
 "amb": {"GANCHO": ["sfx_pro/amb/amb_indoor_generic.flac"], "PATIO": ["sfx_pro/amb/amb_suburb_backyard.flac"]},
 "foley": {"ARREGLO1": [["cutter_cut.flac", 2.0]]}}
```
`amb` = ambiente de fondo por sección (si falta, va uno de interior). `foley` = [archivo, segundos desde que empieza la sección].
Lista de sonidos: `python vlog/fab/fab.py sonidos`. Sin música, nunca.

## 3. planos.json — las fotos que se animan (todo en INGLÉS)
```json
[{"id": "li1", "sec": "ARREGLO2", "foto": "Close on the large rough tanned hand of an older man pushing a whole dried clove into the white pith of a cut lemon, seven other cloves already in a ring, juice shining on the pulp, a speckled granite kitchen counter under it.", "mov": "the thumb presses the clove in and the fingers turn the lemon a little"}]
```
- Un plano = una foto (agnes-image) que se anima 4 s (agnes v2.0). Cada clip se usa UNA vez: `fab.py planos` dice cuántos hacen falta
  por sección (minuto 1 cortes cada ~2 s ⇒ muchos planos en GANCHO/CASA/PROMESA).
- `foto`: SÓLO lo que se ve, con ultradetalle (material, desgaste, dónde está cada cosa, de dónde entra la luz). Repetí la misma
  descripción del lugar en todos los planos de ese lugar (copiá un párrafo fijo: así la casa es siempre la misma). Nada de palabras
  de cámara (cinematic, close-up shot, bokeh…). Gente: manos, espaldas, de costado ("her face is not visible"); el avatar ya pone la cara.
  Si un plano necesita la cara de Claudio: `"cara": true` (usa su foto de referencia).
- `mov`: UNA acción simplísima y visible que dura 2 s (una mano empuja, una gota cae, la cinta gira). Nada quieto: algo se mueve siempre.
- Cada foto tiene que mostrar EXACTAMENTE lo que Claudio dice en ese momento (la sección manda).

## 4. avatar.json — cuando Claudio habla a cámara (RunPod, UN solo /run, US$0,25)
```json
[{"n": "GANCHO", "desde": "En las cocinas de restaurante", "hasta": "Ésta es la casa de los Ramírez"}]
```
Frases EXACTAS del guion (inicio y fin de la ventana). Entre 18 % y 30 % del video: el gancho, la promesa, las menciones del Manual,
los momentos de opinión/advertencia y el cierre. Ventanas de 5-50 s, sin pisarse.

## 5. ov.json — los componentes (ver KIT.md)
Donde el guion EXPLICA algo (un número, un procedimiento, un lugar, una comparación), fuera de las ventanas de avatar.
