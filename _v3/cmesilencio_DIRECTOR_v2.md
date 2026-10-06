# §0 DIRECTOR — cmesilencio / Claudio Mendoza Constructor

## Encargo

**Título:** Haz una Caja de $20 que Silencia el Generador (y de verdad funciona)

**Fuente temporal:** `public/captions_cmesilencio_fish.json`, transcripción Whisper del WAV real de Fish Audio. Los anclajes de abajo no son duraciones estimadas: salen de frases detectadas en esa pista.

**Duración:** 1.627,22 s de voz + cola técnica de 0,60 s; 48.835 cuadros a 30 fps.

## Dirección editorial y visual

La cámara humana de Claudio queda como piso visual full-frame, muteada y en bucle determinista; la voz maestra es exclusivamente `public/cmesilencio_fish.wav`. El montaje respira como una demostración de taller: cada afirmación recibe una medición, un objeto o una prueba visible. Los overlays son rótulos breves, números, fichas o tarjetas editoriales; no hay subtítulos corridos.

El arco visual va de **ruido sin diagnóstico** a **fuente identificada**, pasa por **masa, sellado, vibración y seguridad**, y termina en **comparación medida y decisión de compra**. El kit no promete que una caja cerrada haga magia: la imagen siempre distingue pantalla acústica abierta, ventilación y distancia segura.

## Mapa de actos anclado a la voz

| Acto | Ancla real | Intención | Componente del kit |
|---|---:|---|---|
| S1 · Hook | 00:00,00 | Promesa, advertencia de monóxido y método de prueba | AvatarPiso + `cms_s1_*` + rótulos de seguridad |
| S2 · Por qué suena | 01:45,44 | Escape, carcasa, vibración: tres fuentes distintas | `MovTercios` + clips de fuente |
| S3 · Honestidad | 03:59,58 | Qué sí se puede medir y qué no se promete | AvatarPiso + `cms_s3_*` + CTA 01 |
| S4 · Tres números | 07:02,74 | Decibeles, aire y calor antes de comprar material | `MovNumeros` + `IconoNum` |
| S5 · Tres ideas | 08:26,20 | Masa, sellado y una pantalla abierta | `MovAgujero` + ficha de prueba |
| S6 · Dos dólares | 10:00,44 | Sellador, juntas y vibración sin tapar respiración | AvatarPiso + `cms_s6_*` |
| S7 · Fracasos | 11:23,44 | Rebotes, fuga, calor y exceso de confianza | AvatarPiso + clips de errores |
| S8 · Lista | 12:24,70 | Materiales modestos, función de cada uno y límites | AvatarPiso + tarjetas de material |
| S9 · Ubicación | 13:16,78 | Línea de vista, pared, ventana y distancia | AvatarPiso + `cms_s9_*` |
| S10 · Túnel no | 14:13,72 | Rechazo explícito de gabinete/túnel cerrado | AvatarPiso + garaje medio abierto |
| S11 · Configuración | 14:32,10 | Rejilla, hueco, escuadra y termómetro | AvatarPiso + `cms_s11_*` |
| S12 · Primera versión | 15:37,50 | La foto bonita no reemplaza una comprobación térmica | AvatarPiso + clips térmicos |
| S13 · Medición | 16:53,34 | 78 → 72 → 69 → 66 dB y juntas corregidas | AvatarPiso + clips/laminas de medidor |
| S14 · Prueba extra | 18:43,12 | Girar, separar, comparar y calcular la diferencia | `MovDieciocho` + CTA 02 |
| S15 · Qué queda | 21:47,00 | Mantenimiento, fuego, cuándo no construir y respaldo | AvatarPiso + clips de revisión |
| S16 · Cierre | 25:25,95 | 78 → 60 como arco, conclusión y continuidad | AvatarPiso + CTA 03 |

## Componentes y reglas de continuidad

- **Base garantizada:** `AvatarPiso` full-frame en toda la composición; todos los componentes entran encima, nunca como PiP chico.
- **Movimientos reales usados:** `MovTercios`, `MovNumeros`, `MovAgujero` y `MovDieciocho`. No se infieren componentes por orden; cada uno queda declarado en el plan reanclado.
- **B-roll:** 75 clips CFR 30/1, con fotos de cama para cerrar los huecos largos y evitar que el avatar desfasado quede expuesto cuando sólo habla el narrador.
- **Información:** `IconoNum`, `Rotulo`, `Ficha` y las cuatro láminas que corresponden a páginas reales de la guía. Los datos específicos del experimento se presentan como ficha del video, no como página del producto.
- **CTAs orgánicas:** tres tarjetas QR, una por momento narrativo: apagón y respaldo; prueba de 100 W; mapa Todo Medido. El QR apunta exactamente a `https://claudiomendoza.vercel.app/` y el copy hablado no dice precio ni URL.
- **Audio y tiempo:** un único `<Audio>` con `cmesilencio_fish.wav`; los cues están anclados a captions Whisper. No se agregan beats estimados.

## Higiene de plan

El plan v2 conserva los assets previamente generados que siguen siendo compatibles y deja fuera del montaje los beats viejos que contradecían la voz final: túnel/gabinete cerrado, ventilación universal, porcentajes no respaldados, testimonio inventado y CTA antigua. No se regeneran imágenes o clips por cambio de fondo; si el guion vuelve a cambiar, esos elementos deberán revisarse contra sus anclas antes de reutilizarse.

## Resultado del preflight del build

- 206 eventos de fuente → 371 cues renderizables.
- 261 cues de base y 110 overlays.
- 283 assets directos, 457 entradas con companions `_blur`.
- 75 clips + avatar a 30/1 CFR.
- Cobertura global y posterior al bucle: 100,0%; huecos de base de 4 s o más: 0.
- Pacing: mediana 5,43 s; p75 5,80 s; 83,5% de arranques separados por al menos 5 s.

Este documento es la dirección vigente para el render; el §4 AUDITOR se ejecuta después del render del FARM sobre el MP4 resultante.
