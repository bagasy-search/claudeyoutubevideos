# HANDOFF — mec456-integracion (Claudio el Mecánico, eps. 4-6 de "El auto de Doña Elena", hechos EN PARALELO)
Rama de integración: `origin/mecvinagre-render` + merge `mecbebe-render` + merge `mecaceite-render` (en ese orden). Las listas de registro
(ClMain import + COMP, BEDABLE en gen_timeline, bloques de sound.mjs) se unieron a mano: cada video agrega SU línea, nada se pisa.
**El ep. 7 (`mecnafta`) sale de ESTA rama** (tiene los 3 kits: ClMec_mecvinagre, ClMec_mecbebe, ClMec_mecaceite + ClMecParts + ClLogbook ampliado).

| # | slug | job | mp4 | dur | min1 | avatar | real | agnes |
|---|---|---|---|---|---|---|---|---|
| 4 | mecvinagre | 804 | releases/download/mecvinagre/mecvinagre.mp4?v=1 | 15:28 | 35 | 24,5 % | 26,4 % | 0/9 |
| 5 | mecbebe | 805 | releases/download/mecbebe/mecbebe.mp4?v=1 | 15:23 | 34 | 24,4 % | 25,7 % | 1/9 |
| 6 | mecaceite | 806 | releases/download/mecaceite/mecaceite.mp4?v=1 | 15:26 | 34 | 24,3 % | 28,2 % | 3/9 |

Detalle de cada uno: `git show <slug>-render:HANDOFF.md`. Gotchas del trabajo en paralelo (FARM_REF, cola global de agnes, stock
duplicado entre videos, regla de imágenes sin cara → agnes-image, OpenAI sin crédito): `git show mecvinagre-render:HANDOFF.md`.

## Para hacer otro lote en paralelo (lo que funcionó)
- Worktrees desde la MISMA base, componentes nuevos en `src/claudio/ClMec_<slug>.tsx` (no en ClMecanico.tsx) → el merge sólo choca en las
  listas de registro, y se resuelve uniendo ambos lados.
- Voces separadas un par de minutos con bg.mjs; cada video sigue solo apenas termina su voz.
- Avatares: los 3 /run en la cola de RunPod a la vez, salieron al 1º (US$0,75 total).
- Agnes 2.5-flash NO escala a 3 videos (cola global llena): pedir sólo 3-4 kf por video o aceptar foto.
- Cruzar los `_used.json` de stock de los 3 desde el principio y deduplicar por md5 antes de cada farm.
