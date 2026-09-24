# COMPONENTS_KIT — los 30 componentes genéricos del kit

Marca ÚNICA terrosa-vintage (pergamino, serif EB Garamond, ámbar/óxido + verde + tierra + crema). **Todos** son `React.FC` prop-driven y render-safe (sin `Date.now`/`Math.random`/`new Date`; azar = `rand(i)` de `depth.tsx`). Firma común: `durationInFrames: number` + `title?` + `subtitle?` + `accent?` + props específicas (todas con default → renderiza sin props).

Los MISMOS componentes sirven a 3 nichos: **HUERTA**, **REPARACIÓN**, **AMISH/homestead**. Solo cambia el contenido de las props.

| # | name | kind | props específicas (además de durationInFrames/title/subtitle/accent) | qué muestra | huerta | reparación | amish |
|---|---|---|---|---|---|---|---|
| 1 | `TitleCardKit` | titlecard | `eyebrow?`, `underline?` | Placa de apertura con eyebrow + título serif grande + subtítulo. | `eyebrow="ALMANAQUE DE LA HUERTA" title="El bancal que nunca se seca"` | `eyebrow="REPARACIONES" title="La gotera que NUNCA vuelve"` | `eyebrow="OFICIOS DE ANTES" title="El granero sin un solo clavo"` |
| 2 | `LowerThirdKit` | lowerthird | `name?`, `role?`, `side?` | Rótulo inferior (nombre + rol) que entra deslizando. | `name="Levi" role="Hortelano de toda la vida"` | `name="Don Ernesto" role="Maestro plomero · 40 años"` | `name="Amos Yoder" role="Herrero amish"` |
| 3 | `ChapterMarkerKit` | chaptermarker | `index?`, `label?`, `roman?` | Marca de capítulo: número (romano/árabe) + título de sección. | `index=1 label="Preparar la tierra"` | `index=3 label="Cerrar el agua"` | `index=2 label="El granero de piedra" roman` |
| 4 | `BigStatKit` | bigstat | `value?`, `unit?`, `caption?`, `prefix?` | Cifra protagonista enorme (odómetro) con etiqueta y contexto. | `value=70 unit="%" caption="menos riego"` | `value=90 prefix="$" caption="ahorrás en el plomero"` | `value=80 unit=" años" caption="bombeando sin electricidad"` |
| 5 | `StatGridKit` | statgrid | `stats?: {value; unit?; label}[]` | Rejilla de 2–4 métricas (valor + label) en cards de papel. | 4 métricas del riego enterrado | la gotera en números (L/h, $, min) | costos del molino a lo largo de los años |
| 6 | `BulletListKit` | bulletlist | `items?: string[]`, `heading?` | Lista de puntos con viñetas de tinta que se escriben una a una. | claves para tomate sano | pasos para detectar la fuga | por qué la madera de antes duraba |
| 7 | `ChecklistKit` | checklist | `items?: {text; done?}[]` | Checklist con tildes de tinta al confirmar cada ítem. | "antes de sembrar el tomate" | "antes de abrir la pared" | "antes de encender la estufa de leña" |
| 8 | `NumberedStepsKit` | numberedsteps | `steps?: {title; note?}[]` | Pasos numerados en columna con conector vertical de tinta. | cómo armar un almácigo | cambiar un cuerito | levantar un muro de piedra seca |
| 9 | `TimelineKit` | timeline | `milestones?: {year; label}[]` | Línea de tiempo horizontal con hitos (año + label) y playhead. | evolución de un bancal en 4 temporadas | historia de una cañería que falló | el molino de la familia 1904→hoy |
| 10 | `CompareTwoKit` | comparetwo | `left?: {title; points?}`, `right?: {...}`, `verdict?` | Comparación lado-a-lado con veredicto. | manguera vs. goteo | soldar vs. reemplazar | fideos de fábrica vs. hechos en casa |
| 11 | `BarChartKit` | barchart | `bars?: {label; value}[]`, `unit?` | Barras verticales que crecen desde la base con valores. | rendimiento por hortaliza | costo de arreglarlo uno mismo | horas de trabajo por tarea de granja |
| 12 | `RankingBarsKit` | rankingbars | `items?: {label; value}[]`, `unit?` | Ranking de barras horizontales hacia el nº1. | lo que más alimenta el compost | herramientas más usadas del taller | cultivos más rentables de la granja |
| 13 | `DonutStatKit` | donutstat | `percent?`, `label?`, `centerText?` | Anillo/porcentaje que se rellena con cifra central. | % de germinación logrado | % de humedad eliminada del muro | % del muro que sigue tibio a la mañana |
| 14 | `PartsDiagramKit` | partsdiagram | `figure?: "plant"\|"joint"\|"gear"\|"generic"`, `labels?: {text; x; y}[]` | Figura central + etiquetas con líneas guía. | `figure="plant"` → anatomía del tomate | `figure="joint"` → partes de una junta | `figure="gear"` → mecanismo del molino |
| 15 | `CrossSectionKit` | crosssection | `layers?: {label; color?; thickness?}[]`, `figure?` | Corte transversal por capas etiquetado. | capas de un bancal | la humedad que sube por el muro | capas de un techo de granero |
| 16 | `FlowArrowsKit` | flowarrows | `steps?: {label; icon?}[]`, `direction?: "row"\|"col"` | Flujo por etapas conectadas con flechas de tinta. | del resto de cocina al abono | del diagnóstico a la reparación | del grano a la harina en el molino |
| 17 | `CycleDiagramKit` | cyclediagram | `phases?: {label}[]`, `centerLabel?` | Ciclo circular de fases con flechas. | el ciclo del compost | ciclo de mantenimiento anual | ciclo de estaciones de la granja |
| 18 | `MapPinKit` | mappin | `pins?: {x; y; label?}[]`, `route?` | Mapa/plano de pergamino con pin(es) latiendo. | zonas de la huerta a regar | recorrido de la cañería en la casa | las granjas del valle + ruta |
| 19 | `AnnotatedPhotoKit` | annotatedphoto | `image?`, `annotations?: {x; y; text; kind?: "circle"\|"arrow"}[]` | Foto/figura con anotaciones (círculos/flechas/notas). | señalar plaga en una hoja | dónde empieza el óxido | detalles de un ensamble de madera |
| 20 | `PolaroidStackKit` | polaroidstack | `photos?: {image?; caption?}[]` | Pila de fotos polaroid/archivo abanicadas con leyendas. | la huerta a lo largo del año | antes/después de la reparación | el oficio, de padre a hijo |
| 21 | `QuoteCardKit` | quotecard | `quote?`, `author?`, `seal?` | Cita/testimonio con comillas grandes y firma. | dicho de la huerta | testimonio de un cliente | proverbio amish del trabajo |
| 22 | `EquationKit` | equation | `terms?: {label; image?}[]`, `result?: {label; image?}` | Ecuación visual A + B = resultado con íconos. | cáscara + hojas = abono | cemento + agua = tapa el poro | leche + tiempo = queso |
| 23 | `IngredientsCardKit` | ingredientscard | `ingredients?: {name; amount?}[]`, `heading?` | Tarjeta de "receta": insumos con cantidades. | tierra para almácigo | mezcla para sellar una junta | ingredientes del jabón de ceniza |
| 24 | `CostTallyKit` | costtally | `lines?: {label; amount}[]`, `currency?`, `totalLabel?` | Suma de costos línea a línea que acumula al total. | costo de armar un cantero | arreglar la canilla | materiales del gallinero |
| 25 | `GaugeMeterKit` | gaugemeter | `value?`, `min?`, `max?`, `zones?: {to; color}[]`, `unit?` | Medidor de aguja semicircular con zonas. | humedad del suelo | presión de agua en la cañería | nivel del tanque del molino |
| 26 | `StampRevealKit` | stampreveal | `claim?`, `verdict?`, `positive?` | Sello/veredicto estampado sobre una afirmación. | "el bicarbonato mata el hongo" → MITO | "una arandela de $2 frena la gotera" → CIERTO | "un molino bombea 80 años sin luz" → COMPROBADO |
| 27 | `LabelCalloutKit` | labelcallout | `text?`, `x?`, `y?`, `from?: "top"\|"bottom"\|"left"\|"right"` | Etiqueta/callout que apunta a un punto con línea de tinta. | "acá nace la raíz" | "acá se filtra el agua" | "acá gira el eje" |
| 28 | `SplitPanelKit` | splitpanel | `image?`, `heading?`, `points?: string[]`, `imageSide?: "left"\|"right"` | Panel dividido: imagen a un lado, bullets/título al otro. | cómo funciona la olla de barro | cómo funciona la trampa de la gotera | el zeer: heladera sin electricidad |
| 29 | `ProcessGridKit` | processgrid | `cards?: {icon?; title; note?}[]` | Rejilla de tarjetas de proceso (ícono + título + nota). | las 4 estaciones de la huerta | los 4 pasos de una reparación | las tareas del día en la granja |
| 30 | `ClosingCardKit` | closingcard | `heading?`, `cta?`, `seal?` | Placa de cierre/llamado: título + CTA, con sello. | "probá el goteo esta temporada" | "guardá este truco para la próxima gotera" | "así vivían sin depender de nadie" |

## Notas de uso
- Todos aceptan `accent?` para reteñir el color primario del componente sin tocar la marca.
- Los que llevan `image?` (14 con `figure` React.ReactNode, 19, 20, 22, 28) muestran un placeholder de pergamino si no se pasa imagen → sirven en preview sin assets.
- `PartsDiagramKit` es el ejemplo canónico de genericidad: la misma firma dibuja planta / junta / engranaje según `figure`.
- Ver `KitPreview.tsx` (composición `KitPreview` en Studio) para los 30 renderizados en secuencia, 90 frames cada uno, con props de nicho variado.
