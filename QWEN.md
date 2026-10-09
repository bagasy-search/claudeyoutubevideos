# video2

> ☁️ **SESIÓN EN LA NUBE (claude.ai/code, entorno "Videos")** — si NO hay `.env` en el repo, antes de nada:
> `bash ~/.video2-secrets/bootstrap_repo.sh` · si ese archivo no existe (el setup del entorno no corrió):
> `bash scripts/nube_setup.sh && bash ~/.video2-secrets/bootstrap_repo.sh` (necesita `bautielcrack4-web/claude-brain` conectado a la sesión como 2º repo; si no está, pedíselo al creador — NO hace falta ningún token).
> Eso trae claves, skills y memoria del repo privado del creador. Este repo es PÚBLICO: jamás commitear `.env*` ni imprimir claves.


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
