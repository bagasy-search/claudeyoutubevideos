---
name: dr-federer
description: Edita los videos del nicho interno Dr. Federer, cuyo médico visible es el Dr. Valler (dermocosmética natural / piel madura, médico de confianza, español, público adulto mayor, infoproducto "El Método Piel Joven") en Remotion, con el look DARK-CINEMATIC de CAPAS DE PROFUNDIDAD + AVATAR REAL. Usar esta skill cuando el usuario quiera editar un video de este nicho, mencione "Dr. Valler/romero/piel/colágeno/dermocosmética", pase un avatar del doctor en su consultorio, o pida el kit de componentes de este canal. NO es el look de finanzas-jubilados ni el Amish terroso: es médico premium, oscuro y cinematográfico, con componentes que alternan sobre el avatar real y como escenas de b-roll.
metadata:
  tags: federer, dermocosmetica, piel, medico, avatar, capas, cinematografico
---

## Qué es este canal

`Dr. Federer` es el nombre interno del nicho y de algunos archivos históricos. El médico que aparece, habla y firma públicamente es **Dr. Valler**. Habla de **tú** a un público adulto mayor preocupado por la piel madura. Autoridad cálida, storytelling de alta retención y CTA suave al infoproducto **"El Método Piel Joven"** (USD 17). El avatar es un **video real del doctor en su consultorio** (fondo real: bata, escritorio, biblioteca — NO green screen). Cred/landing en `metodo-piel-joven`.

## El look (validado, el usuario lo aprobó)

- **Dark cinematic**: fondo azul/verde oscuro, gradiente + viñeta. NO tema claro tipo infografía.
- **Alternancia**: (A) avatar real full-frame con overlays SUTILES encima (un lower-third limpio, no 6 cosas) ↔ (B) **escenas de PROFUNDIDAD** (avatar oculto) donde una foto real flota con blur/glow/parallax/rack-focus, cinematográfica. Ese contraste es la clave.
- **Fluidez permanente**: transiciones WHIP con motion-blur + barrido de luz dorada, overlaps ~0.4s → SIN cortes duros. Parallax por capa, push-in lento. Nada quieto +1.5s.
- **Menos es más**: pocos elementos elegantes por pantalla. Restricción cinematográfica.
- **Acentos**: dorado/cobre cálido, números/palabras clave resaltados. Tipografía seria, legible (público mayor).

## El kit de componentes (reutilizable)

Componente de referencia y kit en `C:\Users\bauti\Downloads\video2\src\`:
- **`FedererFluid.tsx`** — referencia canónica del look. Arquitectura: UN `<OffthreadVideo>` persistente (sync de audio perfecto) + escenas de profundidad montadas encima con `TransitionShell` (whip). Componentes: DepthScene, AvatarLayer, TransitionShell, HeroCard, FocusDuo, Words, Kicker, SubLine, Sprig, ForegroundSprigs, DepthText, MotesLayer, ParallaxLayer, GrainOverlay, Chip.
- **`FedererKit.tsx`** (si existe) — kit de ~10 componentes intercambiables con contrato de transición compartido, cada uno como su propia `<Composition>` con prefijo `Fed_` para revisar aislado, + `Fed_KitReel` que los encadena.
- **`VideoEdit/FloatingAdvice3D.tsx`** — listas de consejos numerados: tarjetas con profundidad y rack focus sobre el número que dice la voz.
- **`VideoEdit/DrVallerQuote.tsx`** — cita aprobada: avatar pequeño detrás de tarjeta blanca/marfil, frase negra con tipeo y fondo de clip/imagen contrastado. Composición aislada `FedVallerQuote`.

Todo es **data-driven**: un array `BEATS` `{id, startSec, endSec, kind, avatarPos:'full'|'hidden', payload}`. Se mapea a frames proporcional a `durationInFrames`.

## Flujo de trabajo (división de tareas que funciona)

1. El usuario genera el **avatar en HeyGen** con el guion (público adulto mayor, "usted", tono médico). Fondo de consultorio real, 16:9. Lo deja en Downloads.
2. Copiar el avatar a `public/med/avatar.mp4`.
3. **Transcribir con Whisper** (`whisper.cpp/main.exe -m ggml-medium.bin -f audio.wav -l es -oj`) → tiempos exactos de cada frase.
4. **Rellenar el array `BEATS`** con esos tiempos: alternar avatar-full (frases del doctor a cámara) ↔ depth (b-roll on-beat: crema en "frascos caros", romero en "se llama ROMERO", colágeno en "la ciencia").
5. Assets de b-roll en `public/med/` (romero, piel, aceite, vapor, cubito, colágeno, crema, antes_despues) — generarlos con Modal (`modal_batch.py`).
6. `durationInFrames = round(segundos_avatar * 30)`. Render: `npx remotion render src/<entry>.tsx <CompId> out.mp4 --concurrency=8`. El audio sale del OffthreadVideo del avatar.

## Cómo se generan/mejoran los componentes (Kimi K3)

Los componentes de este kit los diseñó **Kimi K3 por API** (barato, buen código de motion graphics). Claves aprendidas:
- **K3 no tiene memoria entre llamadas** → para que "recuerde" el look, **pegarle el componente bueno (FedererFluid) como referencia en el prompt**. Sin eso reinventa algo recargado/plano.
- Pedirle **menos es más** explícito y **fluidez** (whips, parallax) — el error típico es que queda estático y sobrecargado.
- Para que codee a spec, incluir en el prompt las reglas de `remotion-best-practices` (video2/.agents/skills/).
- **Sobre-razona**: dar `max_tokens` alto (≥96k) o se trunca. El código lo borronea en el razonamiento, así que necesita 2-3x el tamaño final de margen.
- Yo (Claude) hago la sincronización al ms (Whisper), los assets (Modal) y el render; K3 hace el diseño de componentes.

## ★ K3 TIENE VISIÓN — flujo "screenshot → componente" (validado)

K3 (`kimi-k3`) acepta imágenes (`supports_image_in: true`). Se le pueden mandar **referencias visuales** (screenshots de videos/explainers que gustan) vía la API OpenAI-compatible: `content: [{type:'text',...},{type:'image_url',image_url:{url:'data:image/png;base64,...'}}]`. K3 las VE y las recrea en código animado, adaptadas a la paleta Federer.

Validado (jul 2026): se le pasaron 2 refs (nota de papel rasgada + personaje 3D con ojos luminosos + nodos numerados de un canal YT). K3 las tradujo a `FedPromo.tsx` (ver `reference/FedPromo.tsx`): ficha de papel con textura feTurbulence + bullets, **mascota-frasco botánica dibujada 100% en SVG (ojos que parpadean, flota, ramita de romero)**, nodos del protocolo con líneas que se dibujan — todo en bronce/ámbar. Compositions `FedPromo-Note`, `FedPromo-Character`, `FedPromo-Full`.

**Uso:** "el usuario ve un video/componente que le gusta → screenshot → mandárselo a K3 con visión + 'usá esto de base, idéntico pero ×10 mejor y en paleta Federer' → recrea en código, reutilizable". La mascota-frasco es reutilizable y animable (reacciona, señala, aparece en cualquier video del canal).

## Reglas duras (no saltear)

- Avatar full-bg (NO recortar/green screen): componentes ENCIMA sin taparle la cara (está centrado).
- Audio continuo: un solo OffthreadVideo persistente que nunca se remonta.
- Claims médicos con responsabilidad ("estudios sugieren", prueba de alergia). No promesas falsas.
- Combinar con `video-pipeline` (DIRECTOR §0 + AUDITOR §4) para el proceso.

## Escritura canónica del guion

- Esperar y leer completo cualquier ejemplo de estilo anunciado por el usuario antes de redactar el guion final.
- Escribir en segunda persona con **tú**, usando preguntas directas, oraciones largas y fluidas, explicaciones sencillas, anticipos del beneficio siguiente y CTA conversacional para comentarios.
- Mantener el guion como narración continua: sin títulos, subtítulos, capítulos ni divisiones visibles.
- Para ElevenLabs v3 insertar sólo etiquetas expresivas compatibles y justificadas: `[clears throat]`, `[chuckles]`, `[laughs softly]`, `[sighs]`, `[whispers]`, `[serious]`, `[warmly]`. No escribir `[pause]`.
- Conservar la energía del ejemplo sin copiar sus afirmaciones falsas o exageradas. Traducir “milagro” en beneficios defendibles: hidratación, barrera, textura y apariencia; no prometer borrar arrugas, curar enfermedades ni reemplazar consulta.
- Entregar las fuentes médicas fuera del bloque copiable del guion.

## Compuerta de diseño antes de integrar

1. Formular la dirección visual en pocas líneas.
2. Crear una `<Composition>` aislada del componente.
3. Mostrarla en Remotion Studio únicamente para revisión interactiva si el usuario lo solicita; esto no autoriza render/stills/headless locales.
4. Incorporar el feedback hasta recibir aprobación explícita.
5. Recién entonces copiarlo a la skill reutilizable e integrarlo al montaje completo.

No asumir que más capas equivalen a más calidad. En citas del Dr. Valler manda la tarjeta blanca simple con avatar pequeño y tipeo; el retrato grande con HUD oscuro queda descartado.
