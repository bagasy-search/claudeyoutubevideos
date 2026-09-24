# Pipeline de video — portable (para Codex / ChatGPT / cualquier agente)

Esta carpeta te permite producir un video COMPLETO del canal (ej. Dr. Federer) con **cualquier agente de
código**, no solo Claude. Todo el pipeline es: **instrucciones markdown + scripts CLI**. Nada es exclusivo
de una herramienta.

## Archivos

| Archivo | Qué es |
|---|---|
| **`PIPELINE.md`** | El PROCESO: las 9 fases + las compuertas obligatorias (DIRECTOR §0, AUDITOR §8). Vale para cualquier canal. |
| **`DR_FEDERER.md`** | La MARCA del canal Dr. Federer: el look, el kit de componentes (`FedererFluid.tsx`, `FedererKit.tsx`), el array `BEATS`, las reglas del canal. |
| **`LEEME.md`** | Este archivo: cómo usarlo + requisitos + **las reglas actualizadas que MANDAN sobre los otros dos**. |

---

## ⚠️ LEER PRIMERO — reglas que SUPERAN a lo que digan los otros docs

`PIPELINE.md` y `DR_FEDERER.md` son las skills tal cual, y en algunos puntos mencionan **render local** o
**Whisper local**. **Eso quedó PROHIBIDO.** Estas reglas mandan:

### 1. ⛔ TODO el cómputo pesado va a la NUBE — nunca local
Correr esto en la PC del creador la cuelga (ya causó un reinicio en seco de la máquina).

| Tarea | ✅ Hacer | ❌ NUNCA |
|---|---|---|
| Voz (TTS) | `PYTHONUTF8=1 python -m modal run modal_tts.py --text public/guiones/<slug>.txt --slug <slug> --lang es` | TTS local |
| Transcripción | `PYTHONUTF8=1 python -m modal run modal_whisper.py --slug <slug> --lang es` | `transcribe_cuda.mjs`, whisper.cpp local |
| Imágenes IA | Modal (`modal_batch.py` / `modal_image.py`) | ComfyUI local |
| **RENDER** | **El FARM** (GitHub Actions, ver abajo) | `npx remotion render`, `remotion preview`, previews "livianos", levantar chrome-headless-shell |

Lo ÚNICO pesado permitido en la PC: **git** (push al farm) y **ffmpeg** puntual (extraer frames o audio).

### 2. El AUDITOR revisa frames del MP4 que YA rindió el farm
Sacá los frames con `ffmpeg` del mp4 final (liviano, va local). **No rindas local "para adelantar".**

### 3. Render en el FARM (así se hace)
```bash
node scripts/farm.mjs <slug> <comp_id> <total_frames> [chunks=60] [prefijoAssets]
```
Empaqueta assets → los sube como release → dispara `render.yml` → espera → baja el mp4 a `D:\videosdeclaude\<slug>.mp4`.

**Re-render PARCIAL** (para arreglos que NO cambian la duración: retexto, recolor, arreglar un cartel,
cambiar una imagen del mismo largo) — re-rendea solo los pedazos afectados, en ~1-2 min:
```bash
ONLY_CHUNKS=7        node scripts/farm.mjs <slug> <comp_id> <total_frames> <chunks>
ONLY_CHUNKS=7,8      node scripts/farm.mjs ...
ONLY_CHUNKS=7-9      node scripts/farm.mjs ...
```
Para saber qué chunk toca un rango de frames: `node scripts/chunkmath.mjs <total_frames> <chunks> <idx>`.
Si el fix **cambia la duración** (agregás/sacás tiempo o escenas) → render COMPLETO (sin `ONLY_CHUNKS`).

### 4. ffmpeg con secuencias de imágenes — VALIDAR ANTES
Antes de armar un clip desde una secuencia (`ffmpeg -framerate N -i carpeta/%02d.jpg`), **verificá que ninguna
imagen esté vacía ni corrupta**: descartá las de 0 bytes y las que no tengan cabecera JPEG/PNG válida, y
renumerá la secuencia sin huecos.

Un solo archivo vacío hace que ffmpeg se caiga con *access violation* y, en Windows, **abre un cartel de error
que BLOQUEA el pipeline** hasta que alguien lo cierra a mano. Es la causa #1 de que una corrida quede colgada.

### 5. Compuertas que NO se saltean
- **DIRECTOR (§0)** al inicio — el plan editorial antes de tocar nada.
- **AUDITOR (§8)** antes de entregar — revisar frames del render. **Nunca shipear sin AUDITOR limpio.**
- Pacing ≤3s por toma/imagen · cero filtros de color · corte limpio · **nunca borrar assets pagos**.

---

## Requisitos en la máquina donde corra el agente

- **Node 20+** y el proyecto instalado (`npm ci` en la raíz de `video2`).
- **`gh` (GitHub CLI) logueado** → `gh auth status` (necesario para el farm y los releases).
- **Modal autenticado** → `python -m modal token new` (TTS, Whisper, imágenes).
- **ffmpeg + ffprobe** en el PATH.
- Las claves en `.env` / variables de entorno (los NOMBRES; los valores nunca van en estos docs):
  `GEMINI_API_KEY`, y las que use el matcheo de stock/b-roll.

---

## Cómo usarlo en Codex / ChatGPT

Abrí el agente **sobre la carpeta `video2`** y pegale esto:

```
Vas a producir un video COMPLETO del canal Dr. Federer con este proyecto.

1. Leé, en este orden y COMPLETOS:
   - para-chatgpt/LEEME.md   (reglas que mandan — sobre todo: TODO el cómputo pesado en la nube)
   - para-chatgpt/PIPELINE.md    (el proceso: 9 fases, DIRECTOR §0 y AUDITOR §8 son obligatorios)
   - para-chatgpt/DR_FEDERER.md  (la marca: look, kit de componentes, array BEATS)

2. Respetá SIEMPRE: nada de render/preview de Remotion local; TTS/Whisper/imágenes por Modal;
   el render final va al FARM (scripts/farm.mjs). El AUDITOR revisa frames del mp4 del farm.

3. Usá los componentes REALES del canal: src/FedererFluid.tsx y src/FedererKit.tsx (no inventes
   componentes genéricos). Todo data-driven con el array BEATS.

TAREA: <acá describís el video: título, guion o de qué va, y dónde está el avatar>
```

**Para otro canal:** cambiá `DR_FEDERER.md` por la skill de ese canal (mismo formato) y ajustá el punto 3.

---

## Notas honestas / gotchas

- **Contexto que el agente NO tiene:** este pipeline se afinó con muchos aprendizajes. Los importantes ya
  están en estos 3 archivos, pero si el agente hace algo raro, lo más probable es que le falte una regla:
  agregala acá para que quede.
- **El repo del farm es público** → nunca pongas claves ni datos privados en estos docs ni en el repo.
- **El primer render con caché** es más lento (arma el caché); del segundo en adelante vuela.
- **Kimi K3** (diseño de componentes, ver `DR_FEDERER.md`) es opcional: si el agente puede codear los
  componentes él mismo, mejor. K3 sirve cuando querés un look nuevo a partir de una referencia visual.
- **`durationInFrames` = round(segundos_del_avatar × 30)** — el audio sale del `OffthreadVideo` del avatar.

---

## Aprendizajes confirmados — Dr. Valler (julio 2026)

Estas reglas evitan repetir el retrabajo de guion y diseño observado en el video anterior:

1. **Identidad:** `Dr. Federer` es el nombre interno del nicho/proyecto. El médico visible y la firma que se muestra al público son **Dr. Valler**. Nunca atribuirle una frase en pantalla a “Dr. Federer”.
2. **Guion antes de producción:** si el usuario anuncia que dará un ejemplo de estilo, esperar ese ejemplo antes de redactar el guion completo. Extraer primero persona gramatical, longitud de oración, estructura de retención, intensidad y CTA.
3. **Formato TTS:** entregar el guion puro, continuo, sin títulos ni divisiones. Para ElevenLabs v3 usar pocas etiquetas expresivas reales como `[clears throat]`, `[chuckles]`, `[sighs]`, `[whispers]` o `[warmly]`; no usar `[pause]` ni indicaciones genéricas que vuelvan lenta la voz.
4. **Fuentes fuera del guion:** mantener afirmaciones médicas responsables y verificadas, pero colocar enlaces y notas fuera del bloque copiable para que nunca entren en ElevenLabs.
5. **Aprobación de componentes:** construir primero una composición aislada y obtener aprobación visual del usuario antes de integrarla al video completo o sincronizarla al audio. Una corrección en demo cuesta minutos; una corrección después del montaje obliga a rehacer escenas.
6. **Complejidad con intención:** “profesional” no significa añadir muchas capas. Seguir primero la referencia concreta del usuario. Si pide una tarjeta simple, no convertirla en HUD, lower third ni escena institucional.
7. **Citas del Dr. Valler:** usar avatar pequeño asomando detrás de una tarjeta blanca/marfil, texto negro con tipeo real y fondo oscuro o clip contrastado. Esta versión reemplaza al retrato grande con placa oscura.
