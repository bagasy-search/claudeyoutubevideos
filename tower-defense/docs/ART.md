# Plan de arte

Cómo llevar el greybox actual a un juego que se vea profesional, sin romper la
arquitectura ni el rendimiento. Está escrito para que un artista externo pueda
tomarlo y trabajar, y para que la integración sea mecánica.

---

## 0. Las restricciones mandan sobre el gusto

Antes de elegir un estilo, estos son los límites reales, medidos sobre el código
que ya existe. Todo lo demás se deriva de acá.

| Restricción | Valor | De dónde sale | Qué implica |
|---|---|---|---|
| Enemigos simultáneos | hasta **180** | `MAX_SPAWNS` en `systems/waves.ts` | Nada de artboards vivos por unidad |
| Tamaño de un enemigo | radio **6–20 px** | `balance/enemies.ts` | Un peón mide 18 px de alto: no entra un ojo, entra una silueta |
| Campo | 960 × 600 lógicos | `FIELD_W/H` en `sim/game.ts` | El canvas escala; el arte se autoría a 2× y se baja |
| Render | interpolado, fps variable | `core/loop.ts` | La animación va contra reloj de render, **nunca** contra tics de sim |
| Tipos | 5 enemigos + élite + boss, 3 torres | `balance/` | 8 rigs, no 30 |
| Estados por enemigo | caminar, golpe, muerte, ralentizado, quemándose, élite | `world.ts` | El rig tiene que soportar overlays combinables |

La consecuencia más importante, y la que define todo el plan: **con 180 unidades
en pantalla no se puede correr animación esqueletal viva por unidad.** Ni Rive ni
Spine sostienen eso a 60 fps en web. La solución no es bajar la calidad, es
separar en dos caminos (sección 4).

### Tres problemas de color que ya existen

Auditando las constantes actuales aparecen colisiones reales que hay que
resolver en el rediseño, no heredar:

- **Mortero `#ffae5c` vs. Corredor `#f0ad4e`.** Casi el mismo naranja. Torre y
  enemigo compartiendo hue es el peor caso posible: en pleno combate no se lee
  quién es quién.
- **Ballesta `#7ddf7d` vs. barra de vida llena `#6ee7a0`.** Dos verdes, y la
  barra de vida se dibuja *encima* de las unidades.
- **Enjambre `#c77dff` vs. rareza épica `#b06bff`.** Menos grave porque nunca
  comparten pantalla, pero ensucia la identidad del color.

De acá sale la regla de reparto de la paleta (sección 1.2).

---

## 1. Dirección: "Bestiario"

### 1.1 El concepto en una frase

El campo de batalla es una **lámina de bestiario iluminado**: terreno de
pergamino apagado, criaturas entintadas con trazo grueso y relleno de dos
valores, y color saturado reservado **solo** para lo que el jugador necesita leer
para decidir.

Por qué esta dirección y no otra:

- **Resuelve el problema real.** El problema de un TD no es que las criaturas
  sean lindas, es que a los 15 segundos hay 90 bichos encimados y tenés que saber
  cuál te va a filtrar. El trazo de tinta + dos valores da silueta legible a 18
  px. Un estilo pintado o con degradés se vuelve papilla a ese tamaño.
- **Justifica la paleta restringida** en vez de que parezca pobreza. El terreno
  desaturado no es una limitación, es la lámina.
- **Le da identidad a la UI.** Las cartas del draft son cartas de bestiario;
  las rarezas son pigmentos (tinta, azurita, púrpura, pan de oro). El HUD y el
  campo pertenecen al mismo mundo sin esfuerzo.
- **Es producible.** El trazo grueso y el relleno plano perdonan mucho más que el
  render pintado, y se ven igual de caros si el diseño de forma es bueno.

### 1.2 Paleta

Tres bandas que **no se pisan nunca**. Esta es la regla dura del proyecto.

**Terreno — desaturado, valores bajos.** Nunca compite con las unidades.

```
--ground-deep    #14110d   fondo fuera del mapa
--ground         #1e1a14   pergamino en sombra
--ground-lit     #2b2419   pergamino iluminado
--path           #3a2f20   el camino
--path-edge      #4a3b27   borde del camino
--grid           #241e16   retícula de construcción
```

**Invasores — mitad cálida del círculo cromático.** Todo lo que te quiere matar
vive entre el rojo y el amarillo.

```
--grunt          #c8442f   peón      (rojo ladrillo)
--runner         #e07a1f   corredor  (naranja quemado)
--swarm          #b8232f   enjambre  (carmín oscuro)
--brute          #8a4a22   bruto     (cuero)
--juggernaut     #6b1f1f   coloso    (granate)
```

**Defensa — mitad fría.** Todo lo que controlás vive entre el verde y el violeta.

```
--arrow          #6fbf73   ballesta  (verde salvia)
--cannon         #4f7fa8   mortero   (azul pizarra)
--frost          #7fd4e8   prisma    (cian pálido)
```

Esto arregla la colisión mortero/corredor: el mortero se va al azul. Pierde la
asociación "cañón = fuego" pero gana legibilidad, que vale más.

**Semántica — reservada, no se usa para nada decorativo.**

```
--hp-full        #d4c07a   vida alta      (dorado apagado, no verde)
--hp-mid         #d99a3f   vida media
--hp-low         #e34b3f   vida crítica
--crit           #fff0c2   crítico        (casi blanco cálido)
--slow           #a8e6ff   ralentizado
--burn           #ff8c3a   quemándose
--leak           #ff2f2f   fuga           (el único rojo puro del juego)
```

La barra de vida pasa de verde a dorado. Así deja de pelear con la ballesta y
además refuerza la lámina: el oro es el pigmento de la vida.

**Rarezas — pigmentos.**

```
common     #a8a093   tinta
rare       #4a86c8   azurita
epic       #8b5fd6   púrpura
legendary  #d4a017   pan de oro
```

El púrpura épico deja de colisionar con el enjambre, que en esta paleta se va al
carmín.

**Chequeo obligatorio:** toda la paleta tiene que pasar simulación de
protanopía y deuteranopía. Como el reparto es por *hue* pero también por
*valor* (invasores oscuros, defensa clara, semántica brillante), sobrevive:
un daltónico distingue por valor aunque pierda el hue.

### 1.3 Lenguaje de forma

La silueta tiene que decir el rol antes que el color.

| Familia | Forma | Regla |
|---|---|---|
| **Torres** | Angular, simétrica, vertical, base ancha | Construido por humanos. Nada orgánico. |
| **Invasores** | Orgánico, asimétrico, inclinado hacia adelante | Todo se inclina en la dirección de marcha: comunica "esto avanza hacia vos". |
| **Peón** | Compacto, cabeza grande, patas cortas | La forma base contra la que se leen las demás |
| **Corredor** | Estirado horizontal, extremidades finas | Silueta que grita velocidad |
| **Enjambre** | Chiquito, redondo, en grupo | Se lee como masa, no como individuo |
| **Bruto** | Trapecio pesado, hombros anchos, placas | La armadura tiene que verse antes de que te la explique un número |
| **Coloso** | Vertical dominante, rompe la escala | Único que sale del rango de tamaño: se ve que es un boss sin leer nada |

**Test de silueta:** cada unidad rellena de negro puro, a 18 px, en fila con las
otras cuatro. Si no podés nombrarlas, el diseño no está terminado. Este test se
corre antes de que se pinte un solo píxel de detalle.

### 1.4 Luz

Una sola luz clave, arriba a la izquierda, fija para todo el juego. Dos valores
de relleno por unidad (luz / sombra), sin degradés. Trazo de tinta más grueso en
el contorno exterior (3 px @2×) y más fino en las divisiones internas (1.5 px) —
el peso de línea variable es lo que separa un dibujo profesional de un vectorial
plano.

**Rim light de facción:** un borde de 1 px del color de la familia en el lado
opuesto a la luz. Es lo que mantiene la unidad legible cuando pasa sobre el
camino oscuro, y es el truco que hace que el conjunto se vea caro.

---

## 2. Herramientas

| Área | Herramienta | Por qué |
|---|---|---|
| Personajes y animación | **Rive** | Runtime gratis, state machine incorporada, web-first, archivos chicos. Spine solo si el animador ya tiene licencia y flujo armado — es mejor herramienta pero cuesta y no cambia el resultado a este tamaño. |
| Horneado a atlas | **Rive CLI → PNG secuencia → TexturePacker** | El paso clave de la sección 4 |
| Terreno y props | **Aseprite** o **Illustrator** | Según si el trazo final es raster o vector |
| UI e iconos | **Figma** | Exporta SVG limpio; los iconos van a atlas o inline |
| Tipografía | Ver 6.1 | Se embebe como data URI, no CDN |

---

## 3. Inventario de assets

Todo lo que hay que producir. Las medidas son de autoría (2× del tamaño en
juego).

### 3.1 Enemigos — 5 rigs

Por cada uno: rig en Rive + set de ciclos. Élite y boss reusan rig.

| Asset | Tamaño autoría | Ciclos | Frames horneados |
|---|---|---|---|
| Peón | 72 × 72 | caminar, golpe, muerte, aparecer | 16 + 4 + 8 + 6 |
| Corredor | 88 × 64 | caminar, golpe, muerte, aparecer | 12 + 4 + 8 + 6 |
| Enjambre | 48 × 48 | caminar, golpe, muerte, aparecer | 10 + 3 + 6 + 4 |
| Bruto | 112 × 112 | caminar, golpe, muerte, aparecer | 20 + 5 + 12 + 8 |
| Coloso | 160 × 160 | **skeletal vivo**, no horneado | — |

Cada ciclo se hornea en **8 direcciones**. El camino gira, y rotar el sprite
entero (lo que hace hoy el greybox) va a delatar el truco apenas haya arte real.

Overlays combinables, sobre el sprite ya horneado, no dentro del rig:

- **Ralentizado:** tinte `--slow` + cristales de escarcha (4 frames, loop)
- **Quemándose:** partículas `--burn` en los bordes + tinte cálido pulsante
- **Élite:** aura + banderín + escala 1.35× (ya en `EnemyPool.spawn`)
- **Golpe:** flash blanco 120 ms (ya implementado en `e.flash`)

### 3.2 Torres — 3 rigs, esqueletal vivo

Son ≤ 30 en pantalla: pueden ser Rive vivo sin problema.

Por torre: base (estática) + cabeza/cañón (rota hacia el objetivo, ya lo hace el
código) + estados `idle` / `apuntar` / `disparar` / `recarga`.

**Propuesta de diseño, no solo de arte:** que la torre **acumule silueta** a
medida que se le apilan mejoras. Hoy `t.stats` diverge de `def.base` y eso no se
ve. Tres escalones visuales según cuántos modificadores la afectan (0–2, 3–5,
6+): más chatarra, más caños, más runas. Es la recompensa visual que hoy falta:
mirás el campo y ves tu build.

### 3.3 Proyectiles y VFX

| Asset | Notas |
|---|---|
| Virote, obús, esquirla | 3 sprites + estela; variante crítica en `--crit` |
| Fogonazo | 4 frames, por tipo de torre |
| Impacto | 5 frames; variante crítica más grande |
| Explosión (splash) | 8 frames, escalable al radio real (`s.splashRadius` varía con upgrades) |
| Muerte | 6 frames de polvo + silueta que se desarma |
| Muerte de élite | 12 frames, más brillo, con screen shake (ya hay hook) |
| Fuga | Impacto rojo + grieta en el borde de la pantalla. Tiene que **doler**. |
| Aura de élite | Loop 16 frames |
| Telegrafía de boss | Marca en el suelo antes de que entre |

### 3.4 Escenario

- Camino: tileable a lo largo de la polilínea, con bordes y transición al terreno
- Terreno: 3–4 variantes de tile + props sueltos (piedras, raíces, ruinas)
- Retícula de construcción: solo visible al tener torre seleccionada
- **Portal de entrada** y **el núcleo que defendés**: hoy los enemigos aparecen y
  desaparecen en la nada. Estos dos assets son los que convierten un test en un
  juego. Prioridad alta pese a ser solo dos piezas.
- Viñeta y niebla en los bordes

### 3.5 UI

- Marco del HUD, botones de torre (3 estados: normal / hover / sin oro)
- **4 marcos de carta**, uno por rareza, con tratamiento creciente: la legendaria
  con pan de oro y brillo animado
- **~30 iconos**: uno por mejora (hoy hay 24) + iconos de stat (daño, cadencia,
  alcance, crítico, ralentización)
- Fondo del draft, pantalla de fin de run
- Cursor personalizado por modo (construir / vender / normal)

**Total aproximado: 8 rigs, ~180 frames horneados, ~45 assets de VFX/escenario,
~40 piezas de UI.**

---

## 4. La decisión técnica que sostiene todo

**Dos caminos según cuántas instancias hay en pantalla:**

| Camino | Qué | Cuántos | Cómo |
|---|---|---|---|
| **Esqueletal vivo** | Torres, colosos, élites | ≤ 40 | Rive corriendo en runtime. Blending real entre estados. |
| **Atlas horneado** | Peón, corredor, enjambre, bruto | hasta 180 | Se anima en Rive, se hornea a spritesheet en build, se reproduce cambiando `Texture` sobre los sprites que ya están pooleados |

Esto es lo que hace que el plan sea ejecutable: **el camino horneado no cambia la
arquitectura de render.** Hoy `renderer.ts` tiene un pool de `Sprite` indexado
por slot de enemigo. Animarlos es reemplazar una línea:

```ts
// hoy
body.tint = def.color

// con arte
body.texture = atlas[def.id][state][dir][frameIndex]
```

El `frameIndex` se calcula contra el reloj de render (`this.time`), que ya
existe, y la dirección sale de `path.angleAt(e.dist[i])`, que ya se calcula. Toda
la información que necesita la animación **ya está expuesta**.

Lo procedural que hoy hace de placeholder **no se tira, se queda encima**: el
bob, el squash y el flash de golpe siguen siendo código, aplicados sobre el
sprite animado. Animación horneada para el ciclo, procedural para la reacción —
que es exactamente como se hace en producción.

### Presupuesto de rendimiento

- **1 atlas de 4096²** para todas las unidades horneadas. Con ~180 frames a
  ≤112 px entra cómodo.
- **≤ 3 draw calls** para todo el campo: unidades (1 atlas), VFX (1 atlas),
  escenario (1 atlas). Pixi batchea solo si comparten textura — por eso un atlas
  y no un PNG por bicho.
- **Rive:** máximo 40 artboards vivos, con pool. Si un boss entra y hay 40, se
  degrada el más lejano a horneado.
- **Objetivo:** 60 fps con 180 unidades + 400 proyectiles en una laptop
  integrada. Medir con el `worstFrameMs` que ya usa el script de smoke.

---

## 5. Especificación de animación

### 5.1 Máquina de estados por enemigo

Las entradas del state machine mapean 1:1 contra campos que ya existen:

| Entrada Rive | Fuente en el código | Tipo |
|---|---|---|
| `speed` | `e.speed[i] * (1 - e.slowP[i])` | número |
| `hurt` | `e.flash[i] > 0` | trigger |
| `dying` | al llamar `e.kill(i)` | trigger |
| `slowed` | `e.slowT[i] > 0` | booleano |
| `burning` | `e.burnT[i] > 0` | booleano |
| `elite` | `e.elite[i]` | booleano |
| `hpRatio` | `e.hp[i] / e.maxHp[i]` | número |

`hpRatio` es la única entrada nueva que vale la pena: por debajo de 0.3 el bicho
cojea. Es información de juego contada por animación en vez de por barra.

### 5.2 Tiempos

| Animación | Duración | Nota |
|---|---|---|
| Ciclo de caminata | 0.6–1.1 s | **Escalado por velocidad real**, no fijo. Un corredor a 92 px/s no puede usar el mismo ciclo que un bruto a 32. |
| Reacción a golpe | 120 ms | No debe interrumpir la caminata: es un overlay |
| Muerte | 400 ms | 40 % de aplastado, 60 % de disolución |
| Disparo de torre | 180 ms | El retroceso ya existe en `t.recoil` |
| Aparecer | 300 ms | Escala 0→1 con overshoot |

**Regla dura:** ninguna animación bloquea la simulación. El enemigo muere en la
sim en el frame en que llega a 0 de vida; la animación de muerte es cosmética y
corre sobre un sprite ya liberado de la lógica.

### 5.3 Movimiento secundario (queda procedural)

- **Inclinación en curvas:** interpolar `angleAt(dist)` contra el ángulo anterior
  e inclinar el sprite. Cuesta 3 líneas y es lo que más "vida" agrega.
- **Squash por aceleración:** cuando entra o sale de ralentización.
- **Desfase por índice:** ya está (`i * 0.7` en el bob). Sin esto los 90 bichos
  caminan sincronizados y parecen un ejército de clones.
- **Overshoot al frenar.**

---

## 6. UI y tipografía

### 6.1 Tipos

Dos familias, ninguna de las que aparece por defecto en todo:

- **Display** (títulos, nombres de carta, "Oleada 12 superada"): una serif con
  carácter de lámina antigua pero legible en pantalla. Candidatas libres:
  **Cormorant Garamond**, **EB Garamond**, **Spectral**.
- **UI y datos** (HUD, números, descripciones): una sans humanista estrecha con
  buenos numerales tabulares. Candidatas: **Public Sans**, **Archivo**,
  **IBM Plex Sans Condensed**.

Los números del HUD y los deltas de DPS con `font-variant-numeric: tabular-nums`
— ya está puesto en el CSS actual, mantenerlo.

**La fuente se embebe como `@font-face` con data URI.** El entorno de publicación
bloquea CDNs de fuentes y un link a Google Fonts falla en silencio y cae al
fallback. Subsetear a latín + puntuación para no inflar el bundle.

### 6.2 Cartas del draft

Es la pantalla más importante del juego: es donde el jugador toma la única
decisión que importa. Merece el mejor arte del proyecto.

- Marco por rareza, con tratamiento creciente. La legendaria con pan de oro,
  brillo que recorre el borde y una partícula ocasional.
- Ilustración por mejora, o al menos un icono grande entintado.
- La entrada escalonada de 80 ms ya está — mantenerla, y sumar un sonido por
  carta.
- El preview de delta (`DPS 104 → 140 +35%`) es el elemento funcional más
  importante de la carta: que no lo tape la decoración.

---

## 7. Orden de producción

El error clásico es pedir los 8 rigs juntos y descubrir al final que el estilo no
funciona en movimiento.

**Fase 0 — Bloqueo de estilo (1 semana).** Una sola pieza terminada de punta a
punta: **peón + ballesta + camino + un impacto**, en el juego, moviéndose. No se
produce nada más hasta que esto se vea bien en movimiento. Acá se aprueba o se
descarta la dirección.

**Fase 1 — Hoja de estilo (3–4 días).** Con la dirección aprobada: turnaround de
las 5 siluetas, paleta final, pesos de línea, tabla de tiempos. Es el documento
que se le pasa al artista para todo lo demás.

**Fase 2 — Legibilidad (1 semana).** Los 4 rigs horneados. Test de silueta con
180 unidades en pantalla. Si a esta altura no se lee, se corrige acá, que es
barato.

**Fase 3 — Escenario y feedback (1 semana).** Camino, terreno, portal, núcleo,
VFX de impacto/muerte/explosión/fuga. Es lo que convierte "funciona" en "se
siente bien".

**Fase 4 — UI (1 semana).** Cartas por rareza, iconos, HUD, tipografía.

**Fase 5 — Bosses y pulido (1 semana).** Coloso esqueletal, auras de élite,
telegrafías, escalones visuales de torre.

Cada fase entra al juego antes de empezar la siguiente. Nada se aprueba en una
lámina estática: se aprueba corriendo.

---

## 8. Costos

Estimaciones para contratar freelance. Rango amplio a propósito: depende mucho
de la región y del portfolio.

| Fase | Días de artista | Rango USD |
|---|---|---|
| 0 — Bloqueo de estilo | 5 | 750 – 2.000 |
| 1 — Hoja de estilo | 3 | 450 – 1.200 |
| 2 — 4 rigs horneados | 10 | 1.500 – 4.000 |
| 3 — Escenario y VFX | 6 | 900 – 2.400 |
| 4 — UI e iconos | 5 | 750 – 2.000 |
| 5 — Bosses y pulido | 5 | 750 – 2.000 |
| **Total** | **34 días** | **5.100 – 13.600** |

Perfil a buscar: un animador 2D que ya haya trabajado con Rive o Spine **para
juegos** (no motion graphics — es otro oficio). Un solo artista para todo es
mejor que tres especialistas: la coherencia vale más que la velocidad.

Alternativa de bajo presupuesto: hacer las fases 0–2 con un artista y las 3–5
con assets comprados adaptados a la paleta. Se nota, pero se nota mucho menos que
mezclar tres estilos.

---

## 9. Qué mandarle al artista

1. Este documento.
2. Un **video del greybox corriendo** (30 s de la oleada 12, que es donde se ve
   la densidad real). Vale más que cualquier descripción.
3. El link jugable, para que sienta el ritmo.
4. Las medidas exactas de la sección 3 y los tiempos de la 5.2.
5. Referencias visuales: 6–8 imágenes, ninguna de otro tower defense — para no
   copiar, sino para fijar el trazo y la paleta.

**Definición de terminado, por asset:**

- [ ] Pasa el test de silueta a 18 px
- [ ] Legible sobre camino oscuro **y** sobre terreno claro
- [ ] Sobrevive simulación de protanopía y deuteranopía
- [ ] Se ve bien en movimiento a 60 fps, no solo en lámina
- [ ] Entra en el atlas sin pasarse del presupuesto de draw calls
- [ ] Los estados combinables (ralentizado + quemándose + élite) no se pisan

---

## 10. Lo que hay que cambiar en el código

Poco, y es todo mecánico. La capa de render se diseñó para esto.

| Archivo | Cambio |
|---|---|
| `render/renderer.ts` | Cargar atlas; `body.texture = ...` por frame en vez de `body.tint`; 8 direcciones en vez de rotación |
| `render/atlas.ts` *(nuevo)* | Cargar el atlas, indexar por `[tipo][estado][dirección][frame]` |
| `render/riveLayer.ts` *(nuevo)* | Pool de artboards vivos para torres y bosses, con tope de 40 |
| `render/fx.ts` | Cambiar los círculos por sprites de VFX; la estructura de pooling se mantiene |
| `sim/balance/*.ts` | Solo los valores de `color` a la paleta nueva |
| `ui/style.css` | Paleta, fuentes embebidas, marcos de carta |
| `sim/world.ts` | Nada. La sim no se entera de que hay arte. |

Que la última fila diga "nada" es el punto de todo esto: la separación
sim/render que ya está hecha es lo que permite cambiar el arte entero sin tocar
una línea de lógica de juego.
