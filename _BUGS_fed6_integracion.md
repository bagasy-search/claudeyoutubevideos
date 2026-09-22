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

   ### 6-bis. LA CAUSA ES MÁS ANCHA: **TODO** cue de componente abre en negro (22-sep-2026)
   Medido, no deducido. `LowerThirdId` y `StampBadge` son sólo los casos extremos.

   **Causa raíz:** en el kit `_fed6` **`Panel` y `Cinema` NO pintan una placa opaca**: son
   TRATAMIENTOS del footage (`Cinema paper={0}` — el propio `Panel` dice "★ NADA DE
   PLACA/MARCO … el fondo se DESENFOCA y las piezas flotan directamente sobre él"). Montados
   como cue BASE no hay footage: el tratamiento se aplica al vacío y da negro. Encima
   `useBeat` devuelve `op = enter * exit` con `enter = spring(...)`, que **vale 0 en el
   frame 0**, así que los primeros cuadros son negro PURO.

   **Escala real, medida con `blackdetect d=0.2 pix_th=0.10`:**
   | | |
   |---|---|
   | `fcsunaclavada` ENTREGADO | **57 tramos negros**, y los **57 caen exactamente en el arranque de un cue de componente** (78 cues) |
   | duraciones | 35×0,267 s · 10×0,20 s · 7×0,233 s · **5×0,30 s** |
   | los 5 de 0,30 s | son los 5 `StampBadge` (357,5 · 1105,07 · 1406,6 · 1840,53 · 2077,1 s) |
   | stills de `fcspuntos` | **106 de 106 primeros-frames de cue de componente dan luma 0** |

   **Por qué `StampBadge` es el peor (0,30 s) y no otra cosa:** su slam arranca en `AT = 8`,
   así que además del fade de `op` no dibuja NADA hasta el cuadro 8. Los demás componentes
   sí dibujan desde el 0 y salen del negro un poco antes. Mismo mecanismo, distinta duración.

   ⛔ **Dos hipótesis que MEDÍ Y SON FALSAS** — no volver a gastar tiempo en ellas:
   1. *"`StampBadge` es un overlay puro que no pinta fondo"*: **sí** pinta (`<Cinema>`).
   2. *"alcanza con que `op` arranque en 1"*: lo parcheé y volví a medir → los frames pasan
      de luma 0 a luma **6-7**, y `blackdetect` los sigue marcando. El fade AGRAVA, no causa.
      Lo que falta es el footage, y sin él no hay opacidad que alcance.

   ✅ **Lo único que lo arregla, verificado:** footage real debajo del cue. El
   `LowerThirdId` con `under` mide **luma 128 y 0,00 s de negro**, contra 0 / 0,27 s del resto.

   ⛔ **Ningún heurístico ESTÁTICO caza esta clase.** Un detector de "exports que nunca pintan
   `Panel`/`Cinema`" marca `LowerThirdId` y `CornerEyebrow` pero deja pasar `StampBadge`, y
   sobre todo deja pasar a los otros ~150 cues que también abren en negro. Extender una lista
   de nombres (`OVERLAY_COMPONENTES`) NO protege del próximo. La única compuerta que sostiene
   es EMPÍRICA: `node scripts/overlay_gate.mjs <slug>` renderiza el primer frame **y** el del
   medio de cada beat y mide luma.

   ⚠ Para medir luma NO sirve `signalstats`: sus métricas van por METADATA y no salen al log
   ni con `-v info`, así que "no imprime" se lee como "0" (me comí una corrida entera así).
   Reducir a 1×1 en gris y leer el byte: `-vf "format=gray,scale=1:1" -f rawvideo -`.

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

⛔ **El `blackdetect` del auditor daba un falso PASS, y NO era por `-v error`.** Corría
`d=0.5:pix_th=0.06`, y el problema es `pix_th`:
- `pix_th=0.06` sólo cuenta como negro el píxel por debajo de luma ~15, y el fondo del canal
  (`#08110F`, luma ~14) queda JUSTO en el borde → no califica casi nada.
- `d=0.5` encima descarta todo tramo de menos de medio segundo, y los de este bug son de 0,20-0,30 s.

Sobre el MISMO mp4 entregado de `fcsunaclavada`: `d=0.5:pix_th=0.06` → **0 tramos**;
`d=0.2:pix_th=0.06` → **0 tramos**; `d=0.2:pix_th=0.10` (el default de ffmpeg) → **57 tramos**.
Usar SIEMPRE `blackdetect=d=0.2:pix_th=0.10` y que cualquier tramo sea **FALLO de entrega**.

## GITHUB / FARM
⛔ No pollees el estado cada 60 s: dispara el **límite SECUNDARIO** (antiabuso por frecuencia)
aunque la cuota principal esté intacta. **Backoff de 10 min**, o intentar bajar el artifact directo.

## SELLO DE AGNES — AGUJERO CONOCIDO (pendiente, 22-sep-2026)
`scripts/agnes_qc_gate.mjs` sella cada clip con **`size` + `mtime`**, y con eso **no distingue
una poda de una edición**. Pasó: una poda de assets reseteó el `mtime` de 345 clips de
`fcspuntos` y 269 de `fcsunaclavada`, el pre-vuelo del farm los marcó a los 614 como
"modificados después del control" y bloqueó los dos despachos. Los 614 tenían **tamaño
idéntico**, así que el contenido no había cambiado: se re-selló sólo el `mtime` conservando
`revisado`/`ok` (backups en `_v3/*_agnes_qc.json.bak`).
→ **PENDIENTE:** agregarle un **hash** (o tamaño + hash corto) al sello, para que una poda no
   se vea igual que una edición. No hacerlo con renders en vuelo.

## VARIOS AGENTES EN EL MISMO WORKING TREE — verificá los assets ANTES de cada tarball
No son sólo los agentes del lote: `public/` y `node_modules/` aparecieron BORRADOS enteros
(el agente de `fcsjuanetes` recuperó 240 clips y 363 imágenes desde staging), y a `fcspuntos`
le podaron `public/img/` de 549 imágenes a 25 y `public/broll/` de 496 clips a 345.
⛔ No asumas que los assets siguen en disco desde el chequeo anterior: **verificá contra el JSX
   que vas a rendear**, justo antes de armar el tar. Si un render falla por asset faltante, lo
   más probable es eso y no tu build.
⚠ Y ojo con `farm.mjs`: **BORRA el release de assets antes de recrearlo**. Si el
   `gh release create` falla (p.ej. `target_commitish is invalid` porque tu commit local no
   está en el remoto), te quedás **sin release** y el render no tiene de dónde bajar nada.
   Recrearlo con `--target $(git rev-parse origin/<rama>)`.

## ⛔ NO HAY `jq` EN ESTE ENTORNO
Un monitor que hace `gh run view --json ... | jq ...` **no falla: devuelve vacío**. La variable
de estado queda en `""`, nunca es igual a `"completed"`, y el watch gira para siempre sin emitir
un solo evento. Se ve idéntico a "el render sigue corriendo".
✅ Usar el `-q` que trae `gh` (evalúa la expresión jq del lado de `gh`):
   `gh run view <id> --json status,conclusion -q '"\(.status)/\(.conclusion // "-")"'`

Es la MISMA clase de bug que el `signalstats` sin salida, el `volumedetect` con `-v error`, el
`blackdetect` con `pix_th=0.06` y el barrido con 0 stills: **una medición que no mide se lee
como una medición que dio bien**. Cuando una compuerta te dé verde, preguntá siempre cuántas
cosas contó — si la respuesta es "no sé", no midió nada.
