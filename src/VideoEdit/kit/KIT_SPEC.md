# KIT PREMIUM — Contrato de los 30 componentes

Marca ÚNICA terrosa-vintage compartida por 3 nichos: **HUERTAS/jardín**, **AMISH/homestead**, **REPARACIONES/restauración**. Look: pergamino/papel de almanaque, serif old-style (EB Garamond), paleta ámbar/óxido + verde profundo + marrón tierra + crema, luz cálida de establo/taller. **NO cian, NO neón, NO alarma.**

## Reglas del contrato
1. **GENÉRICOS y PROP-DRIVEN**: el TEMA entra por props (`title`, `subtitle`, `items[]`, `labels[]`, `image`, `figure`, `numbers`, `steps[]`, `annotations[]`, `accent`…). NUNCA hardcodeado a un tema. Un mismo diagrama de partes sirve para "anatomía de una planta" (huerta), "las partes de una junta" (reparación) o "un mecanismo antiguo" (amish).
2. **DEFAULTS sensatos**: cada prop tiene default → el componente renderiza solo (sin props) en preview.
3. **RENDER-SAFE**: sin `Date.now()`/`Math.random()`/`new Date()`. Todo deriva de `useCurrentFrame()`. Azar = `rand(i)` de `kit/depth.tsx`.
4. **Firma siempre**: `durationInFrames: number` + `title?`/`subtitle?`/`accent?` + las específicas con default.
5. **Profundidad**: usar los helpers de `kit/depth.tsx` (`ParallaxLayer`, `ParticleField`, `PaperGrain`, `GodRays`, `RimLight`, `DepthShadow`, `Odometer`, `InkDraw`, `WaxSeal`, `Frame3D`, `SvgFilters`) + `TechBackground`, `glass`, `COLORS`, `FONT_STACK`, `SfxCue`.

## Toolkit de profundidad — `src/VideoEdit/kit/depth.tsx`
`rand(i,salt)` · `wobble(i,frame,speed)` · `ParallaxLayer` · `ParticleField(count/kind/rise/drift; kinds: bubbles|dust|embers|spores|flakes)` · `PaperGrain(feTurbulence)` · `GodRays` · `RimLight` · `DepthShadow` (sombra 3D multicapa) · `Odometer` (dígitos que ruedan) · `InkDraw` (strokeDashoffset) · `WaxSeal` (lacre con emboss) · `Frame3D` (perspective+rotateY+translateZ) · `SvgFilters` (feTurbulence/feDisplacementMap/feGaussianBlur/emboss).

---

## LOS 30 COMPONENTES

| # | name (.tsx en `kit/`) | kind | shows | technique |
|---|---|---|---|---|
| 1 | `TitleCardKit` | titlecard | Placa de apertura: eyebrow + título serif grande + subtítulo, sobre pergamino. | Frame3D del card, DepthShadow, GodRays, PaperGrain, InkDraw del subrayado. |
| 2 | `LowerThirdKit` | lowerthird | Rótulo inferior (nombre/rol/lugar) que entra deslizando. | DepthShadow, RimLight, InkDraw regla lateral, spring slide. |
| 3 | `ChapterMarkerKit` | chaptermarker | Marca de capítulo: número romano/árabe + título de sección. | Odometer/InkDraw, WaxSeal opcional, ParallaxLayer fondo. |
| 4 | `BigStatKit` | bigstat | Cifra protagonista enorme con etiqueta y contexto (odómetro). | Odometer, DepthShadow, ParticleField dust, GodRays. |
| 5 | `StatGridKit` | statgrid | Rejilla de 2–4 métricas (valor + label) en cards de papel. | Odometer por celda, DepthShadow, stagger spring, PaperGrain. |
| 6 | `BulletListKit` | bulletlist | Lista de puntos con viñetas de tinta que se escriben una a una. | InkDraw viñetas, DepthShadow card, stagger, SfxCue tick. |
| 7 | `ChecklistKit` | checklist | Checklist con tildes de tinta que se dibujan al confirmar cada ítem. | InkDraw del check, spring pop, DepthShadow, ParticleField. |
| 8 | `NumberedStepsKit` | numberedsteps | Pasos numerados en columna con conector vertical de tinta. | InkDraw conector, Odometer nº, stagger, Frame3D leve. |
| 9 | `TimelineKit` | timeline | Línea de tiempo horizontal con hitos (año + label) y playhead. | InkDraw línea, Odometer años, DepthShadow nodos, ParallaxLayer. |
| 10 | `CompareTwoKit` | comparetwo | Comparación lado-a-lado (antes/después, malo/bueno) con veredicto. | DepthShadow paneles, Frame3D, InkDraw divisor, RimLight ganador. |
| 11 | `BarChartKit` | barchart | Barras verticales que crecen desde la base con valores. | spring altura, Odometer, DepthShadow, ParticleField dust. |
| 12 | `RankingBarsKit` | rankingbars | Ranking de barras horizontales que se reordenan hacia el nº1. | spring width+reorder, Odometer, WaxSeal al líder, DepthShadow. |
| 13 | `DonutStatKit` | donutstat | Anillo/porcentaje que se rellena (dona) con cifra central. | strokeDashoffset (InkDraw-style), Odometer centro, GodRays. |
| 14 | `PartsDiagramKit` | partsdiagram | Diagrama de partes: figura central + etiquetas con líneas guía. | InkDraw líneas guía, DepthShadow figura, stagger labels, SvgFilters rough. |
| 15 | `CrossSectionKit` | crosssection | Corte transversal por capas (suelo, muro, mecanismo) etiquetado. | ParallaxLayer capas, InkDraw límites, ParticleField, DepthShadow. |
| 16 | `FlowArrowsKit` | flowarrows | Flujo por etapas conectadas con flechas de tinta animadas. | InkDraw flechas, spring nodos, ParticleField dust, DepthShadow. |
| 17 | `CycleDiagramKit` | cyclediagram | Ciclo circular de fases (compost, estaciones, riego) con flechas. | InkDraw arco, rotación determinística, DepthShadow, ParticleField spores. |
| 18 | `MapPinKit` | mappin | Mapa/plano de pergamino con pin(es) latiendo en ubicaciones. | ripple SvgFilters, pulse spring, GodRays, InkDraw ruta, ParallaxLayer. |
| 19 | `AnnotatedPhotoKit` | annotatedphoto | Foto/figura con anotaciones (círculos, flechas, notas) marcadas. | InkDraw círculos/flechas, Frame3D foto, DepthShadow, SvgFilters rough. |
| 20 | `PolaroidStackKit` | polaroidstack | Pila de fotos polaroid/archivo que se abanican con leyendas. | Frame3D por foto, DepthShadow, rand rotación, PaperGrain, ParallaxLayer. |
| 21 | `QuoteCardKit` | quotecard | Cita/testimonio en tarjeta con comillas grandes y firma. | DepthShadow, InkDraw comilla, WaxSeal firma, GodRays, PaperGrain. |
| 22 | `EquationKit` | equation | Ecuación visual A + B = resultado con íconos/imágenes. | spring pop términos, DepthShadow, InkDraw signos, ParticleField. |
| 23 | `IngredientsCardKit` | ingredientscard | Tarjeta de "receta": lista de insumos con cantidades y viñetas. | DepthShadow card, Odometer cantidades, InkDraw regla, PaperGrain. |
| 24 | `CostTallyKit` | costtally | Suma de costos línea a línea que acumula a un total (odómetro). | Odometer total, InkDraw línea suma, stagger, DepthShadow. |
| 25 | `GaugeMeterKit` | gaugemeter | Medidor de aguja semicircular (nivel, riesgo, humedad) con zonas. | spring aguja, InkDraw arco, DepthShadow, GodRays, Odometer. |
| 26 | `StampRevealKit` | stampreveal | Sello/veredicto que se estampa sobre una afirmación (aprobado/mito). | WaxSeal, spring impacto, ParticleField dust, DepthShadow, SfxCue thump. |
| 27 | `LabelCalloutKit` | labelcallout | Etiqueta/callout suelta que apunta a un punto con línea de tinta. | InkDraw línea, DepthShadow, spring pop, RimLight. |
| 28 | `SplitPanelKit` | splitpanel | Panel dividido: imagen/figura a un lado, bullets/título al otro. | Frame3D imagen, DepthShadow bullets, ParallaxLayer, PaperGrain. |
| 29 | `ProcessGridKit` | processgrid | Rejilla de tarjetas de proceso (ícono + título + nota) escalonadas. | DepthShadow cards, Frame3D stagger, InkDraw íconos, GodRays. |
| 30 | `ClosingCardKit` | closingcard | Placa de cierre/llamado: título + suscribirse/próximo, con sello. | WaxSeal, GodRays, DepthShadow, InkDraw firma, ParticleField embers. |

---

## Firmas TS (contrato para los constructores)

Todas: `React.FC<{ durationInFrames: number; title?: string; subtitle?: string; accent?: string; ... }>`. Ejemplos de las props específicas (todas con default):

1. **TitleCardKit** — `eyebrow?: string = "ALMANAQUE"; underline?: boolean = true`
2. **LowerThirdKit** — `name?: string = "El maestro"; role?: string = "Oficio de siempre"; side?: "left"|"right" = "left"`
3. **ChapterMarkerKit** — `index?: number = 1; label?: string = "El comienzo"; roman?: boolean = false`
4. **BigStatKit** — `value?: number = 70; unit?: string = "%"; caption?: string = "menos agua"; prefix?: string = ""`
5. **StatGridKit** — `stats?: {value:number; unit?:string; label:string}[] = [...4]`
6. **BulletListKit** — `items?: string[] = [...4]; heading?: string = ""`
7. **ChecklistKit** — `items?: {text:string; done?:boolean}[] = [...4]`
8. **NumberedStepsKit** — `steps?: {title:string; note?:string}[] = [...3]`
9. **TimelineKit** — `milestones?: {year:string|number; label:string}[] = [...4]`
10. **CompareTwoKit** — `left?: {title:string; points?:string[]}; right?: {...}; verdict?: "left"|"right"|null`
11. **BarChartKit** — `bars?: {label:string; value:number}[] = [...4]; unit?: string = ""`
12. **RankingBarsKit** — `items?: {label:string; value:number}[] = [...4]; unit?: string = ""`
13. **DonutStatKit** — `percent?: number = 68; label?: string = "eficiencia"; centerText?: string = ""`
14. **PartsDiagramKit** — `figure?: "plant"|"joint"|"gear"|"generic" = "generic"; labels?: {text:string; x:number; y:number}[]`
15. **CrossSectionKit** — `layers?: {label:string; color?:string; thickness?:number}[] = [...4]; figure?: React.ReactNode`
16. **FlowArrowsKit** — `steps?: {label:string; icon?:string}[] = [...3]; direction?: "row"|"col" = "row"`
17. **CycleDiagramKit** — `phases?: {label:string}[] = [...4]; centerLabel?: string = ""`
18. **MapPinKit** — `pins?: {x:number; y:number; label?:string}[] = [...1]; route?: boolean = false`
19. **AnnotatedPhotoKit** — `image?: string; annotations?: {x:number; y:number; text:string; kind?:"circle"|"arrow"}[]`
20. **PolaroidStackKit** — `photos?: {image?:string; caption?:string}[] = [...3]`
21. **QuoteCardKit** — `quote?: string = "..."; author?: string = ""; seal?: boolean = true`
22. **EquationKit** — `terms?: {label:string; image?:string}[] = [...2]; result?: {label:string; image?:string}`
23. **IngredientsCardKit** — `ingredients?: {name:string; amount?:string}[] = [...4]; heading?: string = "Necesitás"`
24. **CostTallyKit** — `lines?: {label:string; amount:number}[] = [...3]; currency?: string = "$"; totalLabel?: string = "Total"`
25. **GaugeMeterKit** — `value?: number = 65; min?: number = 0; max?: number = 100; zones?: {to:number; color:string}[]; unit?: string = ""`
26. **StampRevealKit** — `claim?: string = "..."; verdict?: string = "COMPROBADO"; positive?: boolean = true`
27. **LabelCalloutKit** — `text?: string = "Acá"; x?: number = 50; y?: number = 50; from?: "top"|"bottom"|"left"|"right" = "bottom"`
28. **SplitPanelKit** — `image?: string; heading?: string = ""; points?: string[] = [...3]; imageSide?: "left"|"right" = "left"`
29. **ProcessGridKit** — `cards?: {icon?:string; title:string; note?:string}[] = [...4]`
30. **ClosingCardKit** — `heading?: string = "Gracias por ver"; cta?: string = "Suscribite"; seal?: boolean = true`

> Ejemplos de uso por nicho (las MISMAS props, distinto contenido):
> - `PartsDiagramKit figure="plant"` → anatomía de una planta (huerta) · `figure="joint"` → partes de una junta (reparación) · `figure="gear"` → mecanismo antiguo (amish).
> - `CrossSectionKit` → capas de un bancal (huerta) / capas de un muro (reparación) / capas de un techo de granero (amish).
> - `CycleDiagramKit` → ciclo del compost / ciclo de mantenimiento / ciclo de estaciones de la granja.
