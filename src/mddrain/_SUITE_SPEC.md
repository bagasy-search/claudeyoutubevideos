# `mddrain` — ESCENARIO COMPARTIDO y SPEC DE VECINOS (lectura obligatoria)

Video: **"It cleans the drain better than a plumber's machine. The stench disappears"**
Canal **Mike Dalton** (EN), look `THEME_PEROXIDE`: NEGRO cinematográfico · acento **ROJO `#E4322A`** ·
BLANCO (vidrio, estela, lo limpio). Display serif **Playfair** en itálica para la palabra emocional,
**Inter** para todo lo demás. Avatar real de Mike de fondo, 1920×1080 @30fps.

## EL MUNDO
Estamos dentro de la casa de noche: una cocina y un baño viejos, con una fuente **fría** que entra
de arriba a la izquierda (la ventanita) y un rebote **cálido** bajo, de la lámpara del pasillo. El
negro no es un fondo: es el cuarto sin luz. Todo lo que aparece —el caño, la botella marrón, el
trapo, el sifón— vive en ESE espacio.

## LO QUE YA ESTÁ ESCRITO Y NO SE TOCA
- **`src/mdmold/Stage.tsx`** — el escenario compartido del canal. Traés de ahí: `MD` (paleta),
  `rgba`, `lerp`, `clamp01`, `eio`, `rnd` (hash determinístico), **`cam(frameGlobal, opts)`**
  (UNA cámara para todo el movimiento, nunca vuelve a cero), **`light(t, from, to)`**,
  **`<Atmos/>`** (la atmósfera, se monta UNA vez), `glassStyle()`, `<Sheen/>`, `<Occluder/>`
  (OCLUSIÓN real, ya corregida), `<VaporWipe/>`, `Kicker`, `Title`, `Em`, `TextBed`.
- **`src/mddrain/Pipe.tsx`** — la materia propia del video: `PipeWall`, `TrapSeal`, `Foam`,
  `Cable`, `ContactClock`, `CompareBar`, `DR` (paleta del desagüe).
- **`src/mddrain/MdClip.tsx`** — cómo se monta un clip real (`OffthreadVideo` + grade del canal).

## ⛔⛔ LA REGLA QUE MÁS PESA (pedido explícito del creador)
**TODA TARJETA FLOTANTE LLEVA MATERIAL REAL ADENTRO: un CLIP corriendo o una FOTO.**
Una tarjeta que es sólo una forma con texto **es código en pantalla y se nota**. Adentro va
material real, con su **marco, su sombra de contacto y su profundidad**. Nada de dibujitos
vectoriales haciendo de objeto real (⛔ un SVG de una botella NO reemplaza la foto de la botella).
Los helpers dibujados de `Pipe.tsx` son **estructura y diagrama** (corte del caño, sifón, burbujas):
sirven de esqueleto y de capa gráfica, **pero el protagonista de cada acto tiene que ser material
real dentro de vidrio**. Y donde sume, íconos/vectores PNG con fondo transparente como objetos de
la escena (opcional).

## MATERIAL REAL DISPONIBLE
- **78 clips** `public/broll/mddrain_h<NN>_<nombre>.mp4` — **1280×704, 121 frames @24 fps = 5,04 s**.
  Son Mike (su cara real) haciendo cada microacción del guion. Se montan con `<OffthreadVideo>`
  (`muted`, `startFrom` en frames de 24 fps, ⛔ nunca pedir más de 121 frames).
- **78 fotos** `public/img/mddrain_h<NN>_<nombre>.jpg` (+ hermano `_blur.jpg` ya generado).
- **9 láminas** `public/img/mddrain_lam_<x>.jpg` (páginas de la guía, verticales).
- **QR** `public/img/mddrain_qrcard.png`.
Rutas SIEMPRE vía `staticFile("broll/....mp4")` / `staticFile("img/....jpg")`.

## LA CADENA (spec de vecinos — con qué encuadre y luz termina el anterior y arranca el siguiente)

| # | movimiento | frames | entra desde | sale hacia |
|---|---|---|---|---|
| 1 | **MovFourInches** | 1884 | ARRANQUE DEL VIDEO: negro casi total, sólo el óvalo frío del colador arriba | b-roll: primerísimo plano de un dedo con papel bajo el colador, **luz fría**, cocina de noche |
| 2 | **MovTowelman** | 945 | b-roll: Mike en la puerta de un duplex / en la camioneta, **luz de día cálida y plana** | ⚠️ **directo al Mov 3** (no hay b-roll en el medio): tiene que terminar en NEGRO con una sola marca roja viva |
| 3 | **MovGravity** | 1833 | ⚠️ **directo del Mov 2**: negro con la marca roja | b-roll: la hidrolavadora en una entrada de coches, **día abierto, luz plana** |
| 4 | **MovBiofilm** | 1257 | b-roll: macro de la película raspada del caño sobre papel, **luz fría de cocina** | b-roll: bicarbonato cayendo en la pileta, **cocina, luz normal** |
| 5 | **MovLift** | 1137 | b-roll: la jarra de lavandina apoyada en el piso del baño, **luz fría** | overlay: **página de la guía** a pantalla completa (papel hueso sobre negro) |
| 6 | **MovDryTrap** | 1383 | b-roll: manguera del lavavajillas bajo la bacha, **linterna, luz dura y baja** | overlay: `CtaCard` con la foto de la cucharada de aceite, **negro con acento rojo** |
| 7 | **MovClose** | 1020 | b-roll: la canilla caliente de noche, vapor, **cocina de noche** | overlay: `MdQrCta`, **negro con el código en blanco al centro** |

Tu **acto 1 empieza ahí** y tu **último acto aterriza ahí**. Eso elimina el 90% de los saltos.

## CONTRATO DE ESCENA (lo que hace que 4-6 actos se lean como UNA escena)
- UNA sola atmósfera montada una vez, que **NUNCA se remonta** entre actos.
- UNA sola cámara, función del **frame GLOBAL**: el acto 3 hereda posición, zoom e inercia del 2.
  ⛔ PROHIBIDO que un acto reinicie la cámara en 0.
- La **luz EVOLUCIONA** (temperatura/dirección) a lo largo del movimiento, no salta.
- **MATERIA QUE CRUZA**: al menos un objeto o plano sobrevive a cada frontera y se transforma en
  el siguiente (la tarjeta se vuelve panel, el panel se vuelve página…).
- **TABLA DE HANDOFF** en un comentario arriba del archivo: por cada acto, enterFrom/exitTo
  (cámara, luz, materia). Si no la podés escribir, todavía no diseñaste una escena continua.

## COSTURAS (una distinta por frontera, ⛔ NUNCA un fade)
MATCH-SHAPE · MATCH-MOVE · WIPE POR MATERIA · OCLUSIÓN · ZOOM-THROUGH · CORTE EN EL BEAT.
Dos fronteras seguidas no pueden usar la misma.

## PRESUPUESTO DE ATENCIÓN
1 objeto protagonista por acto · 1 idea de texto por acto (titular ≤7 palabras) · la variedad sale
de **material y escala** (macro → producto → general → detalle), no de más elementos.

## CALIDAD VISUAL (piso, no techo)
Profundidad real (`perspective` + `translateZ` por capa + `preserve-3d`, **mínimo 5-6 planos con
parallax propio**) · **fotos y clips REALES dentro de vidrio/marco** · iluminación de producto
(key + rim + **sombra de contacto que aterriza**) · cámara con easing NO constante · **hold VIVO**
(nada quieto más de 1,5 s: partículas, latido, parallax, barrido especular).
Carruseles 3D: si mostrás varias piezas, que sea un abanico/carrusel con desfase POR CARTA (la
delantera se mueve más que la trasera), no un grid que aparece junto.

## CONTRATO TÉCNICO (cada punto costó un render)
- ⛔ `Math.random()`, `Date.now()`, `new Date()`: el farm rinde en chunks paralelos. Todo tiene que
  ser función pura de `useCurrentFrame()` (usá `rnd(i)` del Stage).
- ⛔ `backdrop-filter` (×5 el render). El vidrio se hace con gradientes + borde + bisel + sombra.
- ⛔ `filter: blur()` GRANDE sobre imágenes a pantalla completa. Para fondos borrosos usá el
  hermano ya horneado **`<name>_blur.jpg`** (existe para TODAS las fotos) con blur 0.
- **Easings válidos**: linear, ease, quad, cubic, poly(n), sin, circle, exp, elastic, back, bounce,
  bezier, in, out, inOut, step0, step1. ⛔ **`Easing.quint` NO EXISTE** → `Easing.poly(5)`.
  ⛔ `Easing.out(undefined)` compila y explota en render.
- ⛔ Un `interpolate` cuyo inputRange no sea estrictamente creciente **mata el chunk**. Si un rango
  sale de una cuenta, envolvelo en `Math.max(a+1, b)`.
- **Clips**: `<OffthreadVideo muted startFrom={f24} src={staticFile("broll/x.mp4")} />`. El clip
  dura 121 frames a 24 fps: `startFrom + ceil(segundosVisibles*24) + 2 ≤ 121`.
- **Safe area**: 60 px de margen mínimo; si el bloque vive con `translateZ` alto, la perspectiva lo
  agranda: anclalo por `bottom`/`right` y calculá el margen sobre el tamaño YA escalado.
- **Primer frame**: la rampa de entrada del ambiente ≤15 frames. Nada de 2 s subiendo desde negro.
- **Legibilidad**: titular ≥48 px, detalle ≥30 px, SIEMPRE con cama oscura (`TextBed`) sobre imagen.
- Imports SÓLO de `remotion`, `react`, `../mdmold/Stage` y `./Pipe`. Sin librerías externas.

## VERIFICACIÓN ANTES DE ENTREGAR
1. `npx tsc --noEmit -p tsconfig.json 2>&1 | grep <TuArchivo>` → 0 errores propios.
2. Contá en tu respuesta: la TABLA DE HANDOFF, qué costura usaste en cada frontera y por qué, el
   frame exacto de cada acto, y **qué material real (clip/foto) va adentro de cada tarjeta**.
