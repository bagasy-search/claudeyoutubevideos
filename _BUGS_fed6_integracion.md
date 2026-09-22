# BUGS DE INTEGRACIÓN DEL KIT _fed6 — ya resueltos en el lote anterior (21-sep-2026)
Aparecen al subir de ~5 a ~25 componentes. Con pocos componentes NO se ven, por eso no salieron antes.

---

## LA REGLA GENERAL DETRAS DE LOS SEIS BUGS DEL DIA (22-sep-2026)

> **Un resultado que acusa TODO suele ser el instrumento, no el arbol.**

Cuando un chequeo devuelve un veredicto *universal* — "faltan los 20 archivos", "no existe el m4a",
"todo el directorio esta roto" — la primera hipotesis NO es que el arbol este podrido: es que la
herramienta esta mal invocada, mal apuntada o mal parseada. Un arbol real falla PARCHEADO: fallan
tres archivos, no los veinte.

Dos veces salvo un despacho hoy:

- `check_graph.mjs` dijo **"NO ESTAN: 20/20"**, incluido el propio entry que yo acababa de
  commitear. Un entry commiteado no puede faltar → el `ref` no resolvia. No era el arbol.
- El pre-vuelo dijo que **faltaba el m4a** del avatar. El archivo estaba ahi: `tar` estaba leyendo
  `D:/rtmp/...` como `host:path` (sintaxis rsh) y se quejaba de un "hostname". No era el archivo.

Corolario operativo, en este orden:

1. Si el veredicto es 100% o 0%, **sospecha del instrumento primero**.
2. Validalo contra un caso que sepas VERDADERO (un archivo que acabas de commitear, un mp4 que
   acabas de abrir). Si el chequeo tambien lo acusa, el chequeo esta roto.
3. Recien cuando el chequeo distingue bien ese caso, creele el veredicto.

Corolario para escribir compuertas — el reverso de la misma moneda, y el que causo los cuatro
despachos caidos: **una compuerta que no puede evaluar debe ABORTAR, nunca pasar en silencio.**
`|| true`, un `rev-parse` que tira y deja la variable en `""`, un `if (remoto && ...)` que se
saltea entero: los cuatro bugs del farm de hoy son la misma forma. Sin dato no hay "ok" — hay
error.

---

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

### Corolario: un conteo de HALLAZGOS no es un conteo de TRABAJO HECHO
La regla de arriba ("¿cuántas cosas contó?") se cumple mal si lo que la compuerta sabe decir es
cuántos PROBLEMAS encontró en vez de cuánto MIDIÓ. `tramos negros: 0` y `casi negros: 0` son
conteos de hallazgos: si ffmpeg falla, si el directorio está vacío o si la línea que se grepea
está suprimida por el nivel de log, el resultado es **idéntico** a un verde legítimo.

Una compuerta tiene que emitir el denominador y compararlo contra lo esperado:
- `blackdetect` → cuántos cuadros DECODIFICÓ (`frame=` final) vs. los del mp4 (`ffprobe
  -count_frames`). 0 tramos sobre 0 cuadros no es un verde.
- luma de stills → cuántos stills MIDIÓ vs. los que el barrido tenía que dejar (2 por beat).
- barrido → que `bundle.js` exista; `bundle()` puede volver "OK" y no emitir JS (disco lleno).

Casos reales del 22-sep, los cuatro con la misma forma:
1. `_v3/*_stills_luma.sh` con `-v error` + `metadata=print` (que escribe a INFO): el grep volvía
   vacío, el check era `[ -n "$y" ] && ...` → saltaba TODOS los stills en silencio. Nunca midió
   un cuadro, en ningún video. Fix: `file=-` (stdout) + falla dura si un still no se puede medir.
2. `public/` de 72 GB copiado entero a cada bundle (en Windows `symlinkPublicDir` no tiene
   efecto) → D: al 100 %, `bundle()` "OK" sin `bundle.js`, barrido muerto sin renderizar nada.
3. El mismo luma daba verde con el directorio VACÍO (0 stills = 0 negros = exit 0).
4. `blackdetect` con `pix_th=0.06` sobre un canal de fondo `#08110F` (luma ~14): 0 tramos donde
   con `0.10` hay 57.

⚠ Las compuertas JS (`overlay_gate.mjs`, `gen_beds.mjs`) esquivan (1) a propósito: NO usan
`signalstats`, decodifican un píxel 1×1 a rawvideo (`format=gray,scale=1:1`), que es
independiente del nivel de log. Por eso sus conteos sí valen. No las "simplifiques" a signalstats.

## `_v3/` ESTÁ GITIGNOREADO — un arreglo que vive ahí NO se commitea (22-sep-2026)

`.gitignore:45` ignora `_v3*`. Las compuertas por-video viven ahí
(`_v3/<slug>_auditor.sh`, `_v3/<slug>_stills_luma.sh`, los planes, los cues), así que
`git add _v3/<slug>_auditor.sh` no falla: **no hace nada** y el archivo queda fuera del commit.

Cómo muerde: arreglás la compuerta, la commiteás junto con el resto, el mensaje describe el
arreglo — y el arreglo no está en el commit. El árbol de trabajo anda y el repo miente. En un
worktree nuevo (o en el runner del farm) vuelve la versión rota, sin ningún aviso.

Regla: si el arreglo es la COMPUERTA misma (no un intermedio regenerable), va con
`git add -f _v3/<archivo>` y se dice en el mensaje por qué lleva `-f`. Antes de commitear:

    git check-ignore -v <archivos>      # vacío = no hay nada ignorado
    git diff --cached --name-only       # y que estén TODOS los que nombra el mensaje

Los intermedios regenerables (planes, cues, JSON de momentos) se quedan ignorados: está bien.

### Corolario del árbol compartido: `git add` SIEMPRE con rutas explícitas
`git add -A` en este árbol stageó 5418 archivos de otros videos (borrados de `_v3/` y `public/`
de compañeros incluidos). Nunca `-A`, nunca `.`: rutas explícitas y leer
`git diff --cached --name-only` antes de confirmar. Lo mismo vale para archivos compartidos
(`scripts/farm.mjs`, `CLAUDE.md`): suelen tener cambios sin commitear de OTRO agente, así que
un arreglo tuyo ahí no se commitea de prepo — se avisa.

## EL 5º ARGUMENTO DEL FARM NO ES OPCIONAL: sin él se empaqueta `img/` y `vid/` ENTEROS

`node scripts/farm.mjs <slug> <comp> <frames> [chunks] [prefijoAssets]`. Si no pasás el 5º
argumento, `farm.mjs:200` hace `items.push("img", "vid")`: las carpetas COMPARTIDAS completas,
con los assets de TODOS los videos del repo. Medido el 22-sep-2026: el tar iba por **37 GB** y
seguía creciendo cuando lo corté. No falla ni avisa — tar es feliz empaquetando.

Siempre con la lista explícita del video:

    TAR_DIR=D:/rtmp node scripts/farm.mjs fcsjuanetes Fcsjuanetes 80795 20 @_fcsjuanetes_assets.txt

El `@` es lo que activa la lista explícita (rutas relativas a `public/`, una por línea).
Sin `@` se interpreta como PREFIJO y filtra `img/<pref>*` — otra cosa distinta.

Y antes de despachar, que la lista no mienta:

    while read r; do [ -e "public/$r" ] || echo "FALTA $r"; done < _<slug>_assets.txt

Dos señales de que te olvidaste el 5º arg: el log dice `empaquetando 25 entradas` (son
DIRECTORIOS, no archivos) y el tar pasa de unos pocos GB. Un video normal son ~600 entradas.

### `TAR_DIR` para no escribir el tarball en C:
`TAR_DIR=D:/rtmp` manda el tarball a otro disco. En C: no entra y el farm muere a mitad del
`tar` con el archivo a medio escribir, que además queda ocupando lo poco que quedaba.

## UNA API KEY DE RUNPOD SE FUE EN UN COMMIT (22-sep-2026) — la frenó GitHub, no nosotros

`_STATE_fcsjuanetes.md:9` tenía la key literal en un snippet (`K=rpa_...; ID=...`) y entró en un
commit. El push lo rechazó **GitHub Push Protection** (GH013, "RunPod API Key"). Nunca llegó al
remoto: la única copia estuvo en objetos git LOCALES.

**El link de "unblock-secret" que ofrece el mensaje NO se toca.** Ese botón publica el secreto.
Lo correcto es sacarlo de la historia y, si hace falta, rotar la credencial.

Cómo se arregló sin romper el árbol compartido: `filter-branch` exige working tree limpio y acá
hay miles de archivos sin commitear de otros agentes, así que se reconstruyeron los commits con
plumbing e índice temporal (`GIT_INDEX_FILE`), sin tocar el working tree —
`read-tree` → blob redactado con `hash-object -w` → `update-index --cacheinfo` → `write-tree` →
`commit-tree`, preservando autor, fecha y mensaje, y después `update-ref` para mover la rama.
Se verificó que el único cambio contra la cadena vieja fuera ese archivo.

Reglas que salen de acá:
- Los `_STATE_*.md` son NOTAS, no un llavero. La credencial va por variable de entorno
  (`K=$RUNPOD_API_KEY`), nunca el valor literal, ni siquiera en un snippet de ejemplo.
- Antes de commitear un `_STATE_*` o cualquier `.md` de notas:
  `git diff --cached | grep -nE 'rpa_|sk-|ghp_|AKIA|BEGIN .*PRIVATE KEY'`
- Un secreto que estuvo en un commit local sigue en `.git/objects` y en el reflog aunque
  reescribas la rama. Si era una credencial viva, **rotarla** es lo único que cierra el tema.

## UN ARCHIVO UNTRACKED PASA TODAS LAS COMPUERTAS (22-sep-2026)

`src/fcsclv/` (12 componentes) estaba **untracked** — no gitignoreado: nunca commiteado. Lo
importan 9 videos (`src/<slug>/Piezas.tsx` → `../fcsclv/RayStage`, y varios `cues_*.gen.tsx` →
`../fcsclv/BigStat`). En el disco de cada agente andaba perfecto, así que nadie lo notó. En el
checkout limpio del runner no existe y el bundle de Remotion muere:

    src/fcsclv/BigStat.js doesn't exist ... Field 'browser' doesn't contain a valid alias configuration

Costo: una corrida de 20 runners entera, DESPUÉS de dar `pre-vuelo ✓`.

Por qué ninguna compuerta lo vio:
- El pre-vuelo compara `git rev-parse <ref>` contra HEAD. Si el ref no existe como rama LOCAL
  (y no existe: se pushea con `HEAD:refs/heads/<ref>`), ese rev-parse tira, `remoto` queda `""`
  y el `if (remoto && remoto !== local)` **saltea el chequeo entero sin imprimir nada**.
- Y aunque resolviera: con los SHAs iguales daba por sentado que estaba todo commiteado. Un
  archivo untracked **es invisible para una comparación de SHAs**. Existe en tu disco, no en el
  commit, y los dos chequeos dicen que sí.

Arreglado en `farm.mjs` (454978c): el ref se resuelve por local / `origin/<ref>` / `ls-remote`,
si no resuelve ABORTA, y el blob a blob corre SIEMPRE aunque el SHA coincida.

Chequeo a mano antes de despachar (camina el grafo de imports desde el entry):

    node D:/rtmp/check_graph.mjs src/index_<slug>.tsx HEAD

⚠ Pasale un ref que RESUELVA. Con `molino-<slug>` (que no existe local) dio "NO ESTAN: 20/20",
incluido mi propio entry — falso negativo por el ref, no por los archivos. Un resultado que
acusa TODO suele ser la herramienta rota, no el árbol.

### La regla
Antes de despachar: `git status --porcelain src/ | grep '^??'`. Si algo que importás está ahí,
o lo commiteás o el runner no lo va a tener. "Anda en mi máquina" es literalmente el bug.

### Cierre del untracked (22-sep-2026)
`src/fcsclv/` quedo commiteado en dos tandas: **c37ddc2** (9 componentes) y **1f0fbb3** (los 3 que
faltaban: `RayChecklist`, `RaySecurityCam`, `RouteFlow`). `RayTimeline` YA estaba trackeado — el
dato importa porque `RouteFlow`, que si estaba untracked, lo importan **8 archivos**, los mismos
que `RayChecklist`: esos renders venian fallando por la misma causa y nadie los habia atribuido
todavia. `RaySecurityCam` no lo importa nadie; entro por completitud del directorio.

Moraleja: al cerrar un untracked, **no cierres el archivo que rompio TU render — cerra el
directorio**. Los otros importadores fallan igual y sus fallas ya estaban en la cola, sin dueno.

### Corolario: un monitor que sale 0 NO es un entregable (22-sep-2026)
El watcher del mp4 terminó con `FIN` y `exit 0`. No había mp4: la corrida 35693400890 había caído
con los 20 shards en `Can't resolve '../fcsclv/BigStat'` — se despachó desde `a8d247c`, ANTERIOR a
`c37ddc2` que commiteó `src/fcsclv/`. El branch estaba bien; el SHA despachado, viejo.

**Antes de arrancar la cadena de entrega, la prueba es el ARCHIVO EN DISCO**, no el código de
salida del vigía. `exit 0` sólo dice que el script terminó, no que produjo algo.
Y el vigía tiene que emitir en TODOS los estados terminales — si sólo hace grep del éxito, un
crash se ve idéntico a "todavía corriendo".

## UN RUN EN `success` ENTREGÓ EL MP4 CRUDO (22-sep-2026)

`fcsunaclavada`, corrida **35690163948**: terminó en `success`, el `chequeo tecnico` dio todo OK
(bytes, duración, dos streams, audio aac, cero negros) y el MP4 igual estaba **defectuoso**.

Medido sobre el artefacto bajado, no sobre el veredicto del run:

| | medido | esperado |
|---|---|---|
| saltos de PTS | **29**, de 86,7 ms, uno cada 80,8 s | 0 |
| cadencia real | 29,981 fps | 30,000 |
| color | `yuvj420p` / rango `pc` / matriz `bt470bg` | `yuv420p` / `tv` / `bt709` |
| audio vs máster | 2424,9 s contra 2422,8 → **+2,1 s** | ±0,05 s |

Los 29 saltos son las 29 costuras de los 30 chunks: es el tirón del `concat -c copy` que el propio
workflow documenta y que el re-encode a CFR existe para borrar.

**Por qué pasó.** El re-encode corrió ~83 min y murió al final:
`[aost#0:1/aac] Error submitting a packet to the muxer: Cannot allocate memory` + `Error writing
trailer`. Es **ENOMEM**, no la pared de disco de siempre (habría dicho `No space left on device`;
no hay ni un rastro de ENOSPC en el log). Runner `ubuntu-24.04`. Sospechoso principal:
`-movflags +faststart`, que reubica el `moov` al cerrar un archivo de ~900 MB.

**Lo grave no fue el ENOMEM, fue lo que vino después.** El `else` del fallback hacía tres cosas en
silencio: `::warning` (no `::error`), publicaba el crudo **bajo el nombre del bueno**, y encima el
paso de release lo subía titulado *"MP4 final"*. El job seguía a verde. Una etapa falló, se degradó
sola a un resultado peor y lo entregó — y el `success` es justamente lo que hace que nadie vuelva a
mirar el archivo.

### La regla
**El `success` de un run no prueba que el artefacto sea el bueno.** Prueba que ningún paso devolvió
≠0, y un fallback silencioso garantiza que ninguno lo haga. Lo que hay que verificar es el ARCHIVO.
Y un workflow que se degrada solo **tiene que gritar**: si el resultado es peor que el prometido, el
run va en ROJO, aunque haya producido algo.

Arreglado en `render.yml`: el fallback pasa a `::error`, el crudo se sube como
**`final-<slug>-RAW`** (otro nombre, para que no se confunda con un entregable) y **no** se publica
como release (`if: env.RAW != '1'`); un último paso `fallar si el MP4 quedó crudo` deja el job en
rojo. El paso de fallar va **al final, después del upload**, a propósito: así el artefacto -RAW
alcanza a subirse y se rescata en local con `scripts/entrega_mp4.sh` en vez de tirar 80 min de CPU.

### Confirmado por un segundo caso independiente
`fcsjuanetes` pasó por lo mismo el mismo día: su mp4 también llegó crudo, y el re-encode local le
bajó los saltos de PTS de **59 a 1** y la deriva de audio de **1,57 s a 7 ms**. No es un accidente
de un slug: es el camino por defecto cada vez que el remux se cae.

### Corolario operativo
Antes de entregar un mp4 del farm, medí **tres cosas** sobre el archivo bajado — saltos de PTS,
`pix_fmt`/rango/matriz, y duración del audio contra el WAV máster. `fcspuntos` pasó las tres y se
entregó sin re-encode; `fcsunaclavada` y `fcsjuanetes` fallaron y hubo que rescatarlos. El chequeo
del farm mira cuadros y negros: **ninguno de los tres defectos se ve ahí**, porque cada cuadro está
perfecto y lo que está mal es cuándo se muestra.
