# RECETA DE LA FÁBRICA — cómo se hace un video entero (leé SÓLO esto y `KIT.md`)

Sos el **director**. Tenés un EQUIPO que hace el trabajo pesado (guionista, director de arte, director de fotografía, revisores con visión,
editor de montaje): vos corrés las etapas de `python vlog/fab/fab.py`, revisás lo que sale y escribís sólo dos archivos: `avatar.json` y `ov.json`.
⛔ No programes, no edites scripts ni componentes, no leas la memoria ni otros worktrees. Si una etapa dice ⛔, leé el motivo y arreglá
lo que te toca (tus archivos, o volver a correr la etapa). Cada comando imprime poco: no hagas `cat` de logs enteros.
El brief del episodio está en `vlog/<slug>/brief.md` (el slug ya está fijado). Estado y siguiente paso: `python vlog/fab/fab.py estado`.

## Orden
1. `fab.py guionista` (fondo, ~5 min) → `esperar guionista`. Leé `vlog/<slug>/guion.txt` entero UNA vez: si algo contradice el brief
   (datos, personajes, menciones del Manual) corregí esa línea a mano. Después `fab.py guion` (valida). `meta.json` ya viene hecho (canal, voz, minutos, idioma): agregale sólo `"titulo"` y no toques lo demás.
2. `fab.py voz` y `fab.py arte` (los dos en fondo, a la vez) → `esperar voz`, `esperar arte`.
3. `fab.py plan` (fondo, ~10 min: el EDITOR JEFE planifica toda la edición: qué muestra cada sección, `avatar.json` y `ov.json` con todos
   los componentes y las fotos que cada uno necesita) → `esperar plan`. Leé `plan.json` y mirá `avatar.json`/`ov.json`: ya vienen escritos y validados;
   vos sólo arreglás lo que el FIN marque con ⚠ (no los reescribas). → `fab.py avatar` (fondo, ~25 min en RunPod; NO lo esperes ahora).
4. `fab.py planos` (fondo: el director de fotografía escribe los planos) → `esperar planos`.
5. `fab.py imgs` (fondo: fotos con la casa siempre igual; el protagonista con su cara) → `esperar imgs` · `fab.py clips` (fondo) → `esperar clips`.
6. `fab.py armar` · `fab.py montaje` (fondo: el editor mira cada minuto y rehace lo flojo) → `esperar montaje` · `esperar avatar`.
7. `fab.py ov` (hasta ✓; si marca algo, corregí sólo esa entrada de ov.json) · `fab.py editor` (fondo) → `esperar editor`: si marca defectos, arreglá ov.json y repetí `ov` + `editor`.
8. `fab.py mix` (sólo voz: sin ambientes ni efectos) · `fab.py render` (fondo, ~60-90 min) → `esperar render` hasta FIN.
   Terminado: respondé con el link del mp4 y una línea. Nada sigue corriendo después de tu respuesta: no respondas antes del FIN.
`esperar` vuelve cada ~9 min: llamalo de nuevo (cada llamada es barata). No uses sleep ni mires procesos.

## avatar.json — cuando el protagonista habla a cámara (lo escribe el plan; esto es para corregirlo) (RunPod, UN solo /run, US$0,25)
```json
[{"n": "QUIEN", "desde": "Soy Claudio", "hasta": "qué arreglo te toca."}]
```
Frases EXACTAS del guion (inicio y fin). Los momentos de opinión, advertencia, la presentación, las menciones del Manual y el cierre.
NO el gancho (los primeros segundos son imagen). La fábrica corta solo el avatar cada ~6 s con planos y alterna plano abierto/cerrado.
Sumá o achicá ventanas hasta que `fab.py avatar` no marque ⛔ (el % y el máximo de segundos dependen del canal).

## ov.json — los componentes (lo escribe el plan; esto es para corregirlo; ver KIT.md)
Uno cada ~50 s (15 min: 18-26 · 30 min: 36-44), en el idioma del video, donde el guion EXPLICA algo (un número, un procedimiento, un lugar, una comparación, un ciclo).
