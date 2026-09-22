# BUGS DE INTEGRACIÓN DEL KIT _fed6 — ya resueltos en el lote anterior (21-sep-2026)
Aparecen al subir de ~5 a ~25 componentes. Con pocos componentes NO se ven, por eso no salieron antes.

1. **`__THEME_MEDICO__ is not defined`** — sustitución de placeholder en DOS PASOS rota en el
   generador. Tira ~29/30 chunks del render. (Es el que estaba fallando en `fcsunaclavada`.)
2. **Escena de `FedWhiteboard` apuntando a `win-000.mp4`** — las ventanas del avatar son
   **1-indexed**: la primera es `win-001.mp4`.
3. **`BigStatReveal.value` recibiendo string** (`"3 DE 4"`) donde espera **number** → React error #31.
4. **Items de `PizarraExplica` como strings sueltos** en vez de objetos `{title}`.
5. **`CutawayCallouts` no normalizaba las labels** para una de las dos formas de props del plan.
6. **`LowerThirdId` montado como cue SUELTA = 5 s de pantalla negra, y el nombre invisible.**
   (Encontrado en `fcspuntos`, 22-sep-2026, **en el mp4 ya renderizado**: 3 placas × ~5 s = 15,6 s
   de negro, una de ellas en el segundo 67, en plena apertura.) Son DOS fallas encadenadas:
   - `LowerThirdId` (`kit/premium/frame.tsx`) es un **overlay puro**: su `Stage` es transparente y
     no pinta fondo, al revés que el resto del kit _fed6, donde cada componente se pinta el suyo
     con `Panel`/`Cinema`. Como cue suelta no hay NADA detrás → negro.
   - `SurfaceCtx` (`kit/premium/stagecraft.tsx`) arranca en `"paper"`, así que `useInk` devuelve
     tinta **oscura** (`t.color.text`, pensada para crema) y el `<Display>` del nombre sale azul
     oscuro sobre negro. El chip del rol (`Card`) sí se lee, y eso **disimula** el bug: parece que
     la placa "funciona".
   **Arreglo (el de fondo, no el de una línea):** va dentro de `<PremiumOverlay>` y **sobre un clip
   real**. El overlay pone el `Backdrop` y marca la rama como `OnFootage`, así que arregla el fondo
   Y la tinta. _fed6 no tenía `PremiumOverlay` (todo su kit es full-bleed): se portó a
   `src/_fed6/VideoEdit/scenes/PremiumOverlay.tsx`. En el generador queda como `OVERLAY_COMPONENTES`
   + un campo `under` obligatorio en el beat del plan, con compuerta si falta.
   ⚠ **Le pega igual a `fcsjuanetes`** y a cualquier video del canal que use `LowerThirdId`.
   ⚠ El clip de `under` acota la duración del beat: los clips de agnes duran 4,03 s, así que una
   placa de 5 s se recorta a 4 s y el beat siguiente arranca antes (misma lógica que ya existía
   para los clips).
   ⚠ **`SurfaceCtx="footage"` a secas NO alcanza**: arregla la tinta y te deja los 5 s de negro.

## MÉTODO QUE LOS ENCONTRÓ BARATO (hacelo ANTES de despachar el farm)
Barrido LOCAL con `bundle` + `renderStill` sobre **UN frame de CADA beat de componente**.
Cada bug encontrado así ahorra un render fallido de ~30 min. ⛔ No los descubras de a uno por
corrida caída.

⚠ El barrido **sólo ve lo que su regex matchea**. Matcheaba `=> <(\w+)` y los componentes-overlay
se emiten como **fragmento** (`<><ReframedVideo …/><PremiumOverlay>…`), así que los salteaba **en
silencio** — justo las cues del bug #6, que por eso llegó al render. Ya está arreglado en
`_fcspuntos_sweep.mjs`, pero si clonás el barrido para otro video, revisá que el conteo de beats
del barrido sea **igual** al de componentes que reporta el build.

## AUDITOR
⚠ `volumedetect` imprime a nivel **info**: con `ffmpeg -v error` no sale nada y el auditor reporta
**"SIN AUDIO"** en un video que tiene audio perfecto. Usar `-v info -hide_banner -nostats` y
`-map 0:a:0`. (Falso positivo que costó una vuelta entera en `fcspuntos`.)

## GITHUB / FARM
⛔ No pollees el estado cada 60 s: dispara el **límite SECUNDARIO** (antiabuso por frecuencia)
aunque la cuota principal esté intacta. **Backoff de 10 min**, o intentar bajar el artifact directo.
