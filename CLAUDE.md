# video2

> ☁️ **SESIÓN EN LA NUBE (claude.ai/code, entorno "Videos")** — si NO hay `.env` en el repo, antes de nada:
> `bash ~/.video2-secrets/bootstrap_repo.sh` · si ese archivo no existe (el setup del entorno no corrió):
> `bash scripts/nube_setup.sh && bash ~/.video2-secrets/bootstrap_repo.sh` (necesita `bautielcrack4-web/claude-brain` conectado a la sesión como 2º repo; si no está, pedíselo al creador — NO hace falta ningún token).
> Eso trae claves, skills y memoria del repo privado del creador. Este repo es PÚBLICO: jamás commitear `.env*` ni imprimir claves.


> 🆓⛔ **REGLA OBLIGATORIA (8-oct-2026): TODA imagen SIN CARA → agnes-image (GRATIS).** gpt-image-2 (low + Batch +
> crop de cara 128x192) es SÓLO para los planos con la cara del presentador. `factory/lib/openai_batch.mjs`
> (`submitBatch`) ya desvía solo cualquier ítem sin `ref` a `scripts/agnes_img.mjs`; `scripts/gptimg.mjs` y la
> fábrica lo usan. No llames a `/v1/images/generations` de OpenAI por ningún otro lado (los `gen_*.mjs` viejos tiran error).
> ⭐ **(9-oct-2026) Las SIN cara van por `scripts/agnes_img_pro.mjs`** (submitBatch ya lo usa): prompt corto →
> JSON hiperdetallado (`agnes_json_prompt.mjs`, agnes-3.0 gratis) → agnes-image-2.5 → juez de visión en 2 modos
> (`agnes_img_gate.mjs`: cuerpos dentro de objetos, gente de más/de menos, anatomía, lógica física, duplicados) →
> regenera las rechazadas → posproceso de cámara común. Una foto rechazada NUNCA se usa: si no pasa en 4 rondas
> queda faltante y la fase la vuelve a pedir. CON cara: gpt-image-2 low + Batch + crop 128x192, sin cambios
> (decisión del creador 9-oct: con referencia agnes sale menos real). Para una lista suelta:
> `node scripts/agnes_img_pro.mjs <lista.json> <outDir>`.

> 🏭 **ORDEN VIGENTE (15-sep-2026): FÁBRICA x10.** Antes de producir o tocar el pipeline de
> video, leé `factory/PLAN_FABRICA.md` (§0–§2 + §7 LOG), avanzá el próximo ítem del checklist
> y actualizá el LOG al cerrar. Prohibido crear scripts nuevos por slug (`build_<slug>.mjs`, etc.).

## Índice de código (MCP `codebase-memory`)

Este repo está indexado en un grafo de símbolos. Para preguntas **estructurales**
—qué componente del kit ya existe para X, dónde vive una función, qué archivos usan
un componente, qué se rompe si lo toco— **consultá el MCP antes de leer archivos**:

El servidor está registrado a nivel usuario (anda en cualquier carpeta), así que hay que
pasar el proyecto explícito: **`project = "C-Users-bauti-Downloads-video2"`**
(bagasy es `D-Proyectos-yt-scout-web`).

- `search_graph` con `--file-pattern "*kit*"` para buscar componentes existentes.
- `trace_path` / `query_graph` para dependencias y quién llama a qué.
- `get_code_snippet` para traer solo el fragmento, no el archivo entero.

Para leer/editar un archivo que ya sabés cuál es, usá Read/Edit directamente —
el MCP no aporta nada ahí.

⚠️ **El índice NO se actualiza solo** (`auto_index = false`). Es una foto del código
al momento de indexar. Si venís de editar archivos, o si una búsqueda devuelve algo
que no cuadra con lo que ves en disco, **refrescá primero** (~16 s):

```
codebase-memory-mcp cli index_repository --repo-path C:\Users\bauti\Downloads\video2 --mode full
```

**Regla dura relacionada:** el kit tiene ~190 componentes reusables
(`src/VideoEdit/kit/`, `src/_fed6/`, `FedererKit`, `Fluid`, `Whiteboard`).
Antes de crear un componente nuevo, buscalo en el grafo. La biblioteca sobra;
el problema histórico es apoyarse en RawShot+fondo+marco por no buscar.

> Nota: `premium/core.tsx` y `premium/media.tsx` están **duplicados** en
> `src/VideoEdit/kit/` y `src/_fed6/VideoEdit/kit/`. Al 2026-07-24 quedaron
> sincronizados (contenido idéntico ignorando formato), pero siguen siendo dos
> copias: **un fix en una no llega a la otra**. Si tocás una, replicá en la otra.
>
> Historial: `_fed6` se quedó 8 días atrás y le faltaba el wrapper `staticFile()`
> en `ImgOr`; se compensaba con el helper `sf()` en `FedererComponents.tsx:30`.
> Ya está portado, y `sf()` sigue funcionando (el helper `asset()` deja pasar
> lo que ya viene resuelto).
