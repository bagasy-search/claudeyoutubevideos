# PREMIUM KIT — catálogo de componentes de motion-graphics de estudio

Biblioteca reusable y **themeable** para ensamblar los overlays de cualquier video
documental sin inventar componentes bespoke. 34 componentes en 8 familias +
sistema de themes + primitivas core para componer piezas nuevas.

```tsx
import { VsDuel, ThemeProvider, THEME_NATURE } from "./kit/premium";

// por prop (un beat suelto):
<VsDuel durationInFrames={120} theme={THEME_NATURE} left={{...}} right={{...}} />

// o por context (todo el video en un theme):
<ThemeProvider theme={THEME_ALARM}>...cues...</ThemeProvider>
```

**Contrato:** todo componente recibe `durationInFrames` (entra con spring, sale
con fade en los últimos ~8 frames) + `theme?` opcional + props de contenido.
Render-safe: determinista, clampeado, sin assets obligatorios (toda prop `image`
es opcional — sin imagen dibuja un placeholder digno; en producción pasá
`staticFile(...)`).

---

## ★★★ MODELO DE CAPAS (`stagecraft.tsx`) — leer ANTES de tocar un componente

Julio 2026: los componentes se veían **flojos** en los videos y la causa NO estaba
en los componentes, estaba en cómo se montaban. Diagnóstico medido sobre stills
reales (`scripts/proofshots.mjs`), no de memoria:

1. **`PremiumOverlay` escalaba todo a 0.61–0.69×.** Encajaba un diseño de 1920x1080
   dentro de una "zona" para dejar libre la esquina del **avatar PiP… que ya no
   existe** (la regla del canal es avatar FULL o HIDDEN — `avatar_*.gen.ts` tiene
   0 ventanas PiP). Un título de 58px aterrizaba en 36px y un `sub` de 26px en
   16px: ilegible en celular.
2. **Doble tarjeta crema.** El overlay pintaba su propio fondo `surface` y adentro
   el `Panel` del componente pintaba otro casi idéntico → dos rectángulos crema,
   uno dentro del otro, con el b-roll TAPADO. Cero compositing.
3. **Letterbox**: fitear 16:9 en zonas que no lo son dejaba hasta ~650px de crema
   vacío (por eso las composiciones se veían chicas y perdidas).
4. **Sin separación de valor**: `Card` (`rgba(245,238,220,.92)`) sobre `Panel`
   (`#EFE7D3`) = ~2% de diferencia de luminancia. Las tarjetas no se leían.
5. **Capas nominales**: `Rays`/`Texture`/`Vignette` a 0.09–0.16 de opacidad sobre
   crema son invisibles. En la práctica eran 2 capas, no 6-9.
6. **Motion muerto**: los springs asentaban en ~1s y el plano quedaba clavado los
   4-6s restantes.
7. **Colisiones**: el sello de `ChecklistReveal` (`right:-60/top:-46`) caía sobre
   el título; el `Burst` de `StampBadge` salía del ángulo y no del centro.
8. **Doble fade de salida**: el `useBeat` del componente y el `out` del overlay se
   multiplicaban → el final del plano quedaba fantasma.

**La arquitectura ahora** — el MONTAJE trata el fondo, el componente pone L5/L7/L8:

| | capa | quién |
|---|---|---|
| L1 | PLATE — el b-roll vivo | el Main, DEBAJO. Nunca se tapa entero |
| L2 | GRADE — hunde y tiñe el plate | `Backdrop` (en `PremiumOverlay`) |
| L3 | DEPTH — desenfoque real de lo de atrás (`backdrop-filter`), **animado** | `Backdrop` |
| L4 | SHAFTS — haces de luz que respiran | `Backdrop` |
| L5 | PAPEL — región con canto vivo, **translúcida** | el componente: `Band` / `Column` |
| L6 | GRAIN + halación + aberración de lente | `Backdrop` (`Grain`, `Halation`, `ChromaEdge`) |
| L7 | MID — fotos, medallones, tarjetas de vidrio | el componente (`Card`, `Slab`, `Plinth`) |
| L8 | FORE — tipografía | el componente (`Headline`, `Kicker`, `Underline`) |
| L9 | ATMOS — polvo, barrido, viñeta | `Backdrop` (`Dust`, `Sweep`, `LensVignette`) |

### Por qué el tratamiento vive en el OVERLAY y no en el componente
`backdrop-filter` (el desenfoque real) **se anula si algún ancestro tiene
`opacity < 1`** — crea un *backdrop root*. Y todos los componentes se funden con
`useBeat`. Con el tratamiento adentro, el desenfoque se apagaba justo durante la
entrada y la salida. Montado en `PremiumOverlay` (opacidad siempre 1) el blur
puede **animarse**: el fondo se va de foco en ~14 frames, las piezas llegan
encima, y al final el fondo vuelve al foco. `StageCtx.managed` le avisa al
`Panel`/`Cinema` que no lo pinten de nuevo.

### ★ NADA DE MARCO / PLACA
La primera versión del arreglo ponía una placa crema redondeada dentro del box,
con el b-roll asomando alrededor: se lee como **un marco blanco pegado encima del
video** y es exactamente lo que el usuario rechazó. La regla es: el fondo se
DESENFOCA y las piezas FLOTAN sobre él. Papel sólo como región a sangre
(`Band`/`Column`, translúcidas con `backdrop-filter`), nunca como recuadro.

### Sistema de TINTA (`useInk` + `SurfaceCtx`)
Sin papel detrás, el texto cae sobre b-roll oscurecido y la tinta casi negra del
theme desaparece. `useInk()` devuelve color y stack de sombras según la
superficie: `PremiumOverlay` declara `footage`; `Card`/`Slab` vuelven a `paper`
para su interior; los componentes con `Band`/`Column` envuelven su texto en
`<OnPaper>`. **`OnPaper`/`OnFootage` son Providers puros: no crean nodo DOM, así
que son seguros dentro de contenedores flex.**
Todo color de texto tiene que salir de ahí — `Display`, `Support`, `Eyebrow`,
`Headline`, `Kicker` y `Odo` ya lo hacen. Si escribís un `color:` a mano en un
style, lo estás rompiendo.

### ★ PROFUNDIDAD — los 3 sistemas que hacen que sea un espacio y no una pila

**1 · UNA luz para toda la escena — `useKeyLight(zone)`**
Los haces, el brillo especular de cada tarjeta y la dirección de CADA sombra
salen de la misma fuente, y respira despacio. Es lo que hace que el conjunto se
lea como un espacio iluminado en vez de piezas con `box-shadow` genérica.
- `slabShadow(light, {lift, edge})` — sombra de objeto SÓLIDO: canto duro (offset
  con blur 0 = el espesor de la placa) + contacto + dos difusas lejanas, todas
  cayendo del lado contrario a la luz.
- `specular(light, strength)` — brillo que sigue a la luz. Va como **primera capa
  de `background`** (CSS admite varias), nunca como div extra: un wrapper rompería
  los `display:flex` de las tarjetas.
- `tilt3d({amount, seed, frame})` — perspectiva real por elemento. **Usa
  `perspective()` dentro del propio transform y NO `transform-style: preserve-3d`**:
  preserve-3d crea un *backdrop root* y mataría el vidrio de las tarjetas.
  ⚠️ Calibración: en una tarjeta ANCHA (1400 px) 1,3° de `rotateY` ya la deja
  trapezoidal. El volumen viene del canto y la sombra; la inclinación es sólo el
  toque que rompe la planitud (`amount` ~0.3 en tarjetas, ~1.2 en medallones).

**2 · RACK FOCUS — el foco sigue lo que se está contando — `useRack(n, dur)`**
Mientras se revela el ítem *i*, ese ítem está nítido y adelante; los demás se van
de foco y retroceden. Cuando terminó de revelarse todo, **TODO vuelve a foco** —
el espectador tiene que poder leer la lista completa. Es el equivalente a que el
camarógrafo mueva el foco al sujeto del que se habla, y es lo que convierte
"capas apiladas" en profundidad.
```tsx
const rack = useRack(items.length, durationInFrames, { blur: 1.8, dim: 0.22 });
const f = rack(i);   // → {focus, blur, opacity, scale, style}
```
⚠️ **Calibración: el foco SUGIERE, no esconde.** Con `blur: 4.2 / dim: 0.5` el
ítem fuera de foco quedaba ilegible. Valores sanos: listas `blur 1.8-2.0`,
diagramas `blur 2.3`, `dim` ≤ 0.26.

**3 · Capas de fondo con distancia real**
`Bokeh` (discos desenfocados muy al fondo, con parallax propio) + `Reflection`
(reflejo bajo objetos flotantes: los apoya en algo en vez de pegarlos al frame)
+ `Plinth` (sombra de contacto). El `Backdrop` ya monta el bokeh.

### Movimiento
- `mblur(s, px)` — desenfoque de movimiento que decae con el spring. **Nada
  aparece nítido de una**: llega movido y se resuelve en ~4 frames. Es el tell
  nº1 de un plano hecho en AE. Devuelve `undefined` al asentar (no deja un
  filter activo todo el plano).
- `useEntrance(at)` — la versión completa (opacidad + rise + overshoot + mblur).
- `useDrift(depth)` / `usePush()` — parallax por capa y push de cámara: ningún
  plano queda clavado después de la entrada.

### Reglas duras al escribir/tocar un componente
- **Escala 1:1 SIEMPRE.** Nada de encoger para "dejar lugar". No hay PiP.
- **Cero marcos.** Fondo desenfocado + piezas flotando. Papel sólo a sangre.
- **Ningún color de texto a mano**: todo por `useInk()`. Y declarar la superficie
  con `<OnPaper>` cuando el texto se apoya en un `Band`/`Column`.
- **Pisos de tipografía @1080p:** display ≥ 48 (título de plano 74-96), ítem ≥ 32,
  `Support` ≥ 26 (ya está clampeado en `core.tsx`). Pasá los strings largos por
  `autoSize()` en vez de dejar que rompan el layout.
- **El b-roll respira.** Nunca un rectángulo opaco de borde a borde: región de
  papel con canto + footage graduado alrededor.
- **Nada de scrim global lechoso.** Si el contenido se reparte por todo el box, va
  `Plate` (placa con canto), no un degradé translúcido.
- **Los sellos y badges tienen lugar RESERVADO**, jamás `top/right` negativos
  sobre un bloque de texto.
- **`Card` no envuelve a sus children.** Varios componentes le pasan
  `display:flex` por `style`; cualquier wrapper convierte la fila en un solo item.
- **Un solo fade de salida** (el de `useBeat`). El overlay no toca opacidad.

### Compuerta de verificación (obligatoria si tocaste el kit)
```
node scripts/proofshots.mjs _proof/after
```
Rinde los componentes **en uso real** (plate de b-roll + `PremiumOverlay`) a
1920x1080, 2 muestras por beat (frame 70 y 150 de 180): la segunda es la que caza
lo que aparece tarde (sellos, ticks finales). La `PremiumGallery` NO sirve para
esto: los muestra a 0.49 sobre fondo liso y **miente**. Los casos viven en
`StageProof.tsx` — agregá ahí el componente que toques.

## Themes (`theme.ts`)

| Theme | Canal / identidad | Look |
|---|---|---|
| `THEME_EARTH` | Constructor Libre / huerta / remedios | terroso vintage, EB Garamond, papel |
| `THEME_NATURE` | documental fauna | BBC nocturno, Playfair + Inter, oro sobre verde-negro |
| `THEME_AMISH` | homesteading calmo | crema rústica serif, sepia, papel fuerte |
| `THEME_ALARM` | finanzas jubilados | negro/rojo/oro, Oswald MAYÚSCULAS, urgencia |

Crear un theme nuevo = copiar uno y cambiar `color`/fuentes; TODOS los
componentes lo toman sin tocar código.

## Mapa intención-de-beat → componente

### Comparación (`compare.tsx`)
- **VsDuel** — "X contra Y" con veredicto: dos contendientes, medallón VS que estampa, cifra por lado. Props: `eyebrow, title, left/right: {label, sub, image?, value?, unit?, good?}`.
- **BeforeAfter** — "mirá el cambio": barrido antes→después con divisor dorado y tags. Props: `eyebrow, beforeLabel, afterLabel, beforeImage?, afterImage?, caption`.
- **DuelColumns** — "punto por punto": tabla de atributos con tick/cruz por columna. Props: `title, leftName, rightName, rows: {attr, leftWins}[]`.
- **TierRanking** — "del mejor al peor": filas S/A/B con chips de items. Props: `title, rows: {tier, color?, items[]}[]`.

### Números / stats (`stats.tsx`)
- **BigStatReveal** — UN dato que tiene que pegar: cifra gigante con odómetro + subrayado + fuente. Props: `eyebrow, value, prefix, suffix, support, source`.
- **StatGrid** — 3-4 datos juntos (resumen del año): grilla 2x2 con odómetros. Props: `title, stats: {value, prefix?, suffix?, label, accent?}[]` (máx 4).
- **RankBars** — comparar magnitudes: barras horizontales con líder destacado. Props: `title, unit, rows: {label, value, accent?}[]`.
- **GaugeDial** — nivel/riesgo 0-100: medidor semicircular con aguja y zonas. Props: `eyebrow, label, value (0-100), suffix, zones`.
- **DonutPercent** — "X de cada 100": anillo que se dibuja + % centrado + claim. Props: `value (0-100), title, support`.

### Diagramas (`diagrams.tsx`)
- **CutawayCallouts** — anatomía/por dentro: lámina central + rótulos con flechas codo. Props: `eyebrow, title, image?, callouts: {text, sub?, tx, ty (0-1), side?}[]`.
- **FlowSteps** — proceso lineal A→B→C (2-5 pasos): nodos circulares + flechas dibujadas. Props: `title, nodes: {label, sub?, image?}[]`.
- **CycleLoop** — ciclo que se repite: nodos en órbita + cometa girando + centro. Props: `title, center, nodes: {label, sub?}[]` (máx 6).
- **LayerStack** — "capa sobre capa" (hügelkultur, aislación, lasaña): planos isométricos que caen y apilan. Props: `title, layers: {label, color?}[]` (de arriba hacia abajo).

### Listas (`lists.tsx`)
- **NumberedSteps** — receta/instrucciones con orden: espina de tinta + medallas numeradas. Props: `eyebrow, title, steps: {title, sub?, image?}[]`.
- **ChecklistReveal** — "necesitás esto antes de empezar": tildes que se dibujan + sello TODO LISTO. Props: `title, items[], stamp`.
- **BulletCascade** — 3 ideas fuertes ("no es X, es Y"): bullets grandes con keyword resaltada. Props: `eyebrow, bullets: {pre?, key, post?}[]`.

### Texto / énfasis (`text.tsx`)
- **HookCaption** — gancho de apertura: palabras que golpean, claves en caja de acento. Props: `words: {text, boxed?}[], sub`.
- **PullQuote** — cita con autoridad: retrato circular + comillas gigantes + atribución. Props: `quote, author, role, image?`.
- **KaraokePhrase** — frase para grabarse palabra por palabra (la activa brilla). Props: `phrase, wordDur?, eyebrow`.
- **HighlightSweep** — una oración donde el marcador BARRE la parte que importa. Props: `pre, highlight, post, note`.

### Lugar / tiempo (`place.tsx`)
- **TimelinePlayhead** — cronología: riel con playhead que viaja y enciende eventos. Props: `title, events: {year, label}[]`.
- **MapPinPoint** — "acá pasó": pin que cae con radar sobre mapa estilizado. Props: `place, region, x, y (0-1)`.
- **RouteTrace** — trayecto A→B sobre mapa con distancia. Props: `from/to: {label, x, y}, distance`.
- **DateStampCorner** — sello esquina fecha+lugar con typewriter (overlay sobre footage). Props: `date, place, corner (tl/tr/bl/br)`.

### Marco / identidad (`frame.tsx`)
- **CornerEyebrow** — kicker de canal/sección en esquina (overlay liviano). Props: `eyebrow, text, corner (tl/tr)`.
- **ChapterTitle** — portada de capítulo: numeral romano gigante de fondo + título. Props: `number, title, sub`.
- **LowerThirdId** — presentar a alguien: retrato chico + nombre + rol (overlay). Props: `name, role, image?`.
- **CtaCard** — vender el manual/producto: portada 3D + precio odómetro + botón que respira. Props: `eyebrow, title, bullet, price, cta, image?`.
- **StampBadge** — veredicto que SLAMEA ("PROBADO", "ESTAFA"): sello de goma con polvo (overlay). Props: `text, sub, color?, x, y (0-1)`.
- **MythTruth** — derribar un mito: MITO tachado que se apaga → VERDAD que enciende. Props: `myth, truth`.

### Media (`media.tsx`)
- **FramedPhoto** — UNA foto protagonista (archivo/prueba): marco museo + ken-burns + placa. Props: `image?, caption, sub, kenburns`.
- **FloatingCutout** — presentar UN objeto/ingrediente: recorte flotando con rim light + label grande. Props: `image?, label, sub`.
- **PhotoCarousel** — 3-5 candidatos/variantes: polaroids, la activa se adelanta con badge. Props: `title, items: {image?, label}[]`.
- **SplitPanel** — media + conclusiones: imagen con corte diagonal + bullets con ticks. Props: `eyebrow, title, image?, bullets[]`.

## Primitivas core (`core.tsx`) — para bespoke que combine con el kit
`Panel` (escenario texturado con rayos/viñeta) · `Card` (superficie glass del theme)
· `Stage` · `Eyebrow/Display/Support` (jerarquía tipográfica) · `ImgOr` (Img o
placeholder) · `PhotoBlock` (foto con marco marcador) · `Odo` (odómetro themeado)
· `Arrow/Stroke/Tick/Cross` (tinta que se dibuja) · `Burst/Motas` (partículas)
· `ContactShadow` · `Texture/Rays/Vignette` · `useBeat` (enter+exit estándar)
· `kick(frame,fps,at)` (spring diferido para .map()) · `rand/wob/fmt/clamp01`.

## Gallery / verificación
`src/index-premium.ts` registra `PremiumGallery` (páginas 2x2, un theme por página,
90 frames c/u). Verificar con:

```powershell
$env:TEMP='D:\rtmp\tmp'; $env:TMP='D:\rtmp\tmp'
npx remotion still src/index-premium.ts PremiumGallery out/gallery_N.png --frame=(N*90+70)
```
