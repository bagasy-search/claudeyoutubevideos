# Inventario de compuertas (D1) — 15-sep-2026

Pregunta que se le hizo a cada compuerta: **¿puede dar verde sin haber medido nada?**
Una compuerta así es un fallo (reference_compuertas_que_avisan_que_no_miran). Las del motor de la fábrica
pasan todas por `factory/lib/gate.mjs` (fail-closed, imprimen cuánto midieron). Esto es el legado de `scripts/`.

Convención nueva para las arregladas: **exit 2 = NO MIDIÓ** (nunca verde), exit 1 = defecto real, exit 0 = midió y pasa.
Control positivo en `factory/tests/legacy_gates.test.mjs` (corre en CI).

## Arregladas (D2) — 15-sep-2026

| Compuerta | Verde sin mirar (antes) | Ahora |
|---|---|---|
| `audit_frames.mjs` (la "obligatoria antes de entregar") | leía STDOUT cuando ffmpeg salía bien; blackdetect escribe en STDERR → **siempre** "✅ sin frames muertos" | lee stderr; exige segundos decodificados > 0; imprime cuánto midió; ffmpeg por env/PATH (antes ruta WinGet quemada) |
| `check_timestamps.mjs` | 0 cuadros → "✓ timestamps perfectos" | < fps cuadros → exit 2; ffprobe por env/PATH |
| `dark_gate.mjs` | carpeta de clips (0 jpg) o errores de ffmpeg tragados → "✅" | 0 stills o alguno sin medir → exit 2 |
| `gap_gate.mjs` | regex que no calza → `VIDEO_END=0`, 0 beats → "no puede haber pantalla negra" | END=0 o sin beats/cover → exit 2 |
| `check_arbol_git.mjs` | sin argumento miraba `fedguante`; entry inexistente → 0 archivos, exit 0 | exige entry existente, si no exit 2 |
| `gate_intrusos.mjs` | error de API tras 4 intentos contaba como "no rechazado"; `fetch` sin timeout | errores → exit 2; timeout 180 s; reporta clips sin foto |
| `vision_haygente.mjs` | nunca salía ≠0; `fetch` sin timeout | sigue siendo reporte (falsos positivos conocidos), pero no medidos → exit 2; timeout 120 s |
| `nudecheck_agnes.mjs` | nunca salía ≠0; respuesta sin `publicable` contaba como publicable | sin veredicto/errores → exit 2; defectos → exit 1; timeout 120 s |

## Pendientes (verde sin mirar todavía)

| Compuerta | Mecanismo | Arreglo propuesto |
|---|---|---|
| `plan_gate.mjs` | sale 0 salvo `PLAN_GATE_STRICT=1`, incluso sin plan | default estricto cuando falta el plan |
| `agnes_qc.mjs` | `--revision "ninguno"` aprueba todo sin evidencia de que se abrieron las hojas; repetición `null` no falla | exigir hash de la hoja vista; `repeticion` null → no aprueba |
| `agnes_qc_gate.mjs` | 0 clips registrados → ok | si hay `broll/<slug>/*.mp4` que no son `av_w*` y 0 registrados → falla |
| `broll_isolation_gate.mjs` | 0 archivos con el slug en el nombre → "✓ 0/0" | 0 inspeccionados → exit 2 |
| `density_gate.mjs` | cuenta clips en DISCO aunque el build no los use; `catch {}` silenciosos; umbrales por env | la fábrica mide sobre el build real (`timeline.mjs`); retirar al migrar los estilos |
| `check_contexto.mjs` | frases sin sustantivo del diccionario se saltean | reportar % no evaluado y exigir mínimo |
| `check_defaults.mjs` | 0 componentes → exit 0; archivo no encontrado → continue | 0 → exit 2 |
| `check_props.mjs` | tipos desconocidos → ok; sin Main salta el chequeo | desconocido = advertencia contada; sin Main → exit 2 |
| `check_motion.mjs` | lista vacía pasa; mide sólo texto | vacía → exit 2 (la fábrica ya valida `mo` en compose) |
| `check_luma_assets.mjs` | fotos que fallan se saltean (`catch {}`) | contar y fallar |
| `avatar_sync_gate.mjs` | mide sólo los primeros 120 s | la fábrica agrega desfase por ventana (C5); medir también el final |
| `check_entrega.mjs` | GOP sólo primeros 120 s, B-frames 3 s, duración saltea si falta | la fábrica mide saltos de PTS del archivo entero en 90_deliver |
| `audit_video.mjs` | 0 de N cuadros extraídos → exit 0 | exigir N>0 |
| `check_redibujo.mjs`, `audit_planos.js`, `audit_prompts.js`, `audit_sync.mjs` | reportes (siempre 0) | OK como reporte: nunca usarlos como compuerta |

## Falsos positivos conocidos (D4, pendiente de recalibrar con muestra ≥5 etiquetada)

- `check_redibujo`: 44 marcados → 16 reales (tcfiltro); fuego/vapor pedido cuenta como redibujo.
- `vision_haygente`: marca manos legítimas con "no hay persona" (tcfiltro).
- Juez de visión de agnes: la mejor versión cazó 2/6 defectos fuertes con 20 falsos (agnes_qc.mjs L8-12) → la decisión es a ojo.
