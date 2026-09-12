# video2

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
