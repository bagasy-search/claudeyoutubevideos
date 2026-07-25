# Tower Defense — esqueleto jugable

Roguelite tower defense: cada vez que superás una oleada aparecen **3 opciones de
mejora aleatorias**. TypeScript + PixiJS v8 + Vite, sin arte (todo cajas grises)
porque el objetivo es que la mecánica se sostenga sola antes de gastar un peso en
animación.

```bash
npm install
npm run dev        # http://localhost:5180
npm test           # 45 tests
npm run typecheck
npm run build
```

**Controles:** `1` `2` `3` elegir torre · click construir · click derecho vender ·
`Espacio` iniciar oleada · `R` reroll en el draft · `Esc` cancelar.
La seed va en la URL (`?seed=loquesea`) — la misma seed da exactamente la misma run.

## Arquitectura

Separación dura entre **simulación** y **render**. La sim corre a paso fijo
(60 tics/s), el render interpola entre el tic anterior y el actual. Un frame a
30fps no cambia la velocidad del juego, solo se dibujan menos cuadros.

```
src/
  core/        rng semillado, loop de paso fijo, event bus
  sim/         lógica pura, sin Pixi ni DOM — testeable headless
    balance/   towers.ts, enemies.ts, upgrades.ts  ← data, no código
    systems/   movement, towers (targeting/fuego), projectiles, waves
    stats.ts   modificadores y stats derivados
    path.ts    camino como polilínea Catmull-Rom
    world.ts   ECS (arrays paralelos) + grid espacial
    game.ts    orquestador: fases, economía, draft
  draft/       el sorteo de las 3 opciones
  render/      capa Pixi — solo LEE la sim
  ui/          HUD y cartas en DOM
```

### Decisiones que importan

**Stats derivados, nunca mutados.** Los stats base de una torre son inmutables.
Un upgrade solo agrega modificadores a una lista global; el stat final se
recalcula desde cero. Orden de aplicación:

```
final = (base + Σflat) * (1 + Σinc) * Π(1 + more)
```

Los `more` son los legendarios y son los que rompen el juego de forma divertida.
Los `inc` son el relleno común. Sin esta separación la inflación se descontrola.

**Sin A\*.** El camino es una polilínea y los enemigos avanzan un escalar `dist`.
Barato, suave, y ordenar por `dist` te da gratis el targeting "first/last". Solo
haría falta pathfinding real (flow field, no A\*) si el jugador pudiera bloquear
el paso.

**Oleadas por presupuesto.** `budget = 10 × 1.18^(oleada-1)`, se gasta comprando
enemigos de un catálogo con costos. Hay un tope de 180 spawns: el presupuesto que
no entra se convierte en HP, así que la oleada se vuelve más dura en vez de más
larga (y no se muere el framerate).

**Todo pooleado.** Enemigos y proyectiles viven en arrays tipados con free-list;
partículas, números de daño y sprites se reciclan. Los handles son `(índice,
generación)` para que un proyectil no le pegue al enemigo que reusó el slot de su
objetivo muerto.

## El draft de 3 opciones

Es la parte que define si el juego engancha. Cuatro reglas separan un roguelite
bueno de uno frustrante (`src/draft/draft.ts`):

1. **La rareza se sortea antes que la carta**, con una tabla que escala por oleada
   (oleada 1: 78% común, 0% legendaria; oleada 25: 24% común, 12% legendaria). Si
   sorteás todo junto por peso, las legendarias aparecen apiladas al principio o
   nunca.
2. **Pity timer**: 4 oleadas sin épica+ fuerzan una.
3. **Anti-repetición**: lo que se ofreció y no se eligió pesa 0.3× en las
   siguientes 2 ofertas. Es un multiplicador de peso, no un veto.
4. **Garantía de sinergia**: al menos 1 de las 3 toca algo que ya tenés (tag de
   torre o de mejora previa). Sin esto las builds nunca cuajan y todo se siente
   aleatorio en el mal sentido.

Más un reroll por oleada, que baja muchísimo la frustración, y el preview del
delta real en la carta (`DPS 104 → 140  +35%`) para que la decisión se sienta
informada en vez de a ciegas.

Todo el RNG es semillado (mulberry32) y la sim y el draft usan streams separados:
construir más o menos torres no desplaza las cartas que te tocan.

## Balance

Los números viven todos en `src/sim/balance/` y `tests/balance.test.ts` juega runs
enteras headless para verificar que la curva no se rompa. Medido hoy: con 8 torres
y eligiendo siempre la primera carta, la run muere entre la oleada 30 y 40 (unos
20-30 minutos). Con más de 20 torres se vuelve trivial — falta un techo de
construcción o una economía más ajustada, que es la primera pasada de balance
pendiente.

## Agregar contenido

Una mejora nueva es una entrada en `src/sim/balance/upgrades.ts`:

```ts
{
  id: 'mi_mejora',
  name: 'Mi mejora',
  desc: 'Lo que hace, en criollo.',
  rarity: 'rare',
  maxStacks: 3,
  weight: 10,                        // peso DENTRO de su rareza
  synergyTags: ['physical'],         // para la garantía de sinergia
  requires: (c) => c.wave >= 5,      // prerequisito opcional
  excludes: ['otra_mejora'],         // no ofrecer juntas
  modifiers: [{ stat: 'damage', op: 'inc', value: 0.3, scope: { tag: 'physical' } }],
}
```

No hay que tocar nada más: el draft, el preview de DPS y el recálculo de stats la
levantan solos.

## Arte

El plan completo de dirección de arte, inventario de assets, pipeline de
animación y presupuesto está en [`docs/ART.md`](docs/ART.md). La decisión que lo
sostiene: con hasta 180 unidades en pantalla no se puede correr animación
esqueletal viva por unidad, así que las tropas comunes se animan en Rive y se
hornean a atlas (se reproducen cambiando `Texture` sobre los sprites ya
pooleados), y solo torres y bosses corren esqueletal vivo.

## Qué falta para que sea un juego completo

Por orden de impacto:

1. **Arte y animación.** Reemplazar los círculos por esqueletal (Rive o Spine): el
   render ya está aislado en `src/render/`, y las entidades ya exponen velocidad,
   estado y ángulo — que es todo lo que una state machine de animación necesita.
   La animación procedural actual (bob + squash) es el placeholder.
2. **Más torres y enemigos.** El sistema de tags y scopes ya soporta sinergias
   cruzadas; hoy hay 3 y 5.
3. **Meta-progresión y guardado.** La seed y el estado del RNG ya son
   serializables, así que el save es directo.
4. **Audio.** Los hooks de la sim (`onHit`, `onKill`, `onFire`) ya son los puntos
   de enganche.
5. **Balance.** Los números viven todos en `src/sim/balance/`. Se van a tocar
   cientos de veces; por eso son data y no código.
