# Canal: Abuela Rosa: Sabores de Antes (@HumanoPrime)

> **Este archivo MANDA sobre cualquier regla genérica.** Si algo acá contradice la skill de nicho,
> el pipeline o tu criterio, **gana este archivo**.
> Leelo COMPLETO antes de escribir guion o editar. Mantenelo actualizado (§6).
>
> 📌 Esto **no es una biografía ficticia**. Es la **IDENTIDAD DE ESCRITURA del canal**: cómo escribe,
> cómo engancha, cómo suena. Referencia para que todos los videos se sientan del mismo canal.

> Origen de esta ficha (2026-07-24): reconstruida de la auto-memoria (`project_video_dulces`,
> `project_abuela_rosa_dieta50`). El canal ya tiene videos entregados y aprobados; su VARA DE CALIDAD
> es `dulcesv3.mp4` (26:45, aprobado textual: *"quedó increíble… los clips son buenísimos"*).

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

> La fórmula general está en `para-chatgpt/GUION.md` (esa se aplica SIEMPRE).
> Acá va lo que es **propio de este canal** y la pisa.

- **Formato ganador (probado):** LISTICLE NOSTÁLGICO — "20/25 [platos/dulces/comidas] de antes que ya no se hacen".
  El viral del canal fue "20 Postres de la Abuela" (4K vistas con 68 subs, puro algoritmo). Dulce/comida casera > salado seco.
- **Cómo son los ganchos acá:** sensorial y de PÉRDIDA. Se abre con un olor/una escena de cocina de antes y la herida de que "se perdió".
  Ej. que funcionó: abrir con el olor a caramelo/al domingo, NUNCA mandando a otro video.
- **Estructura preferida:** cold-open de pérdida → promesa (los N platos) → loop grande ("hay uno que tu mamá dejó de hacer, al final te digo por qué") → los N platos, cada uno con su recuerdo + porqué desapareció → tramo honesto → pago del loop (info NUEVA) → recap → carnada de comentarios → teaser del próximo listicle → firma.
- **Densidad / ritmo:** cada plato = un mini-beat con recuerdo sensorial + un dato concreto + por qué se dejó de hacer. Frases cortas, cálidas.
- **Largo objetivo:** 16.000–20.000 caracteres (mínimo global: 14.000). Estos videos rinden LARGOS.
- **Qué hace SIEMPRE:** apela a la memoria sensorial (olor, calor de la olla, la mesa llena). Cierra con identidad ("los que cocinaban con las manos sabían cosas"). Manda las MEDIDAS/recetas a la DESCRIPCIÓN, nunca dictadas en voz.
- **Qué NUNCA hace:** abrir mandando a otro video · leer una lista coma-coma · inventar credenciales médicas · dar el link/precio en voz alta.

### Ganchos ya usados (para NO repetirlos)

| Fecha | Video | Gancho usado |
|---|---|---|
| jul 2026 | 20 Dulces de la Abuela | olor a caramelo / dulces que "ya no se hacen" |
| jul 2026 | Dieta años 50 (clon) | Doña Amelia 73 años + médico que la humilla |
| 2026-07-24 | 25 Platos Olvidados (este) | la olla que hervía toda la mañana y hoy no hierve en ninguna casa |

## 2. VOZ — cómo suena

- **Tono:** abuela cálida, nostálgica, sabia y cercana. Habla como quien te sienta en la mesa de su cocina. Nada de vendedora.
- **Trato al espectador:** **tú** (neutro cálido, para alcance amplio en español). El título usa "te devolverán". Conjugar tú (acuérdate, mira, escúchame). NO mezclar con vos.
- **Muletillas y frases propias:** "escúchame bien", "acuérdate de esto", "en mis tiempos", "esto no te lo cuenta nadie", "y te voy a ser honesta".
- **Palabras que USA:** casero, de olla, la mesa, el domingo, la despensa, a fuego lento, con las manos, humilde.
- **Palabras que NUNCA usa:** jerga moderna, anglicismos (foodie, tips, hack), lenguaje clínico.
- **Tags de TTS:** SÍ, POCOS y reales: `[warmly]`, `[sighs]`, `[chuckles]`. NUNCA `[pause]`/`[pausa]` (enlentece la voz).
- **Datos personales:** el nombre del canal es "Abuela Rosa" / "Doña Rosa". NO inventar edad, familia ni biografía específica que no esté acá. Si falta un dato para una anécdota, escribir sin esa anécdota.

## 3. LOOK — la marca visual

- **Skill de nicho:** `doc-broll-video` (documental casero/recetas denso, b-roll real + imágenes + componentes).
- **Componentes (compartidos del nicho):** tarjetas flotantes de recetas/platos (`teasecards`), imágenes borrosas→nítidas, fotos vintage B&N intercaladas, cartelería sobria. NO inventar un "AbuelaRosaKit".
- **Paleta / tipografía:** cálida y vintage — madera, sepia, crema, tonos cocina de antes. Serif suave. Nada de cian/alarma.
- **Formato:** HÍBRIDO con AVATAR (la abuela a cámara, cocina de madera + delantal floreado) alternando avatar full ↔ b-roll full. Nunca PiP en esquina.
- **Reglas visuales del canal:** on-topic POR CONSTRUCCIÓN — cada plato lleva footage/imagen de ESE plato, jamás stock genérico. Cero textos quemados feos. Fotos vintage reales para la nostalgia.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Imágenes:** Modal (SDXL) por defecto. **NO ComfyUI** (pedido explícito del usuario para este canal).
- **Voz / TTS:** para faceless usa voz `ref_anciana.wav` (ElevenLabs recuperada). Para AVATAR, la voz sale de HeyGen con la voz de la abuela.
- **B-roll:** match_v3 / CORE v4 con footage REAL on-topic de cada plato + fotos vintage B&N. BLOCKLIST activo (canales de recetas con logo). Verificar 3 stills por clip (watermark) y también las fotos `public/real/*.jpg`.
- **Render:** farm (nube). Aislar por slug.
- **Otros:** CTA = "La Guía de la Abuela Rosa" (recetas con medidas) en la DESCRIPCIÓN. 3 menciones BREVES, tono regalo, jamás link/precio en voz.

## 5. GLOSARIO — elementos recurrentes

- **Abuela Rosa / Doña Rosa:** la presentadora. Anciana cálida en cocina de madera, delantal floreado, luz de tarde.
- **"platos/dulces de antes":** comida casera criolla/de olla que se dejó de hacer.
- **La Guía de la Abuela Rosa:** lead magnet PDF con las recetas y medidas exactas (va en la descripción).

## 6. APRENDIZAJES — correcciones del creador (append-only)

- 2026-07-24 — Ficha de canal creada de cero (no existía `canales/abuela-rosa-sabores-de-antes.md`) reconstruyendo la identidad desde la auto-memoria. Si el creador corrige nombre/voz/edad de la presentadora, actualizar §2 y anotar acá.
- 2026-07-25 — B-ROLL: en este canal el stock de Pexels devuelve MUCHO off-topic (video "25 platos", slug vki4lqtcboy0: **44 de 232 clips = 19% rechazados** — ciudades de noche, oficinas, cabezas parlantes, planos negros). Regla: después de `fetchstock` correr SIEMPRE `node scripts/clip_audit_sheets.mjs <slug>` + jueces visión en paralelo, borrar los rechazados y dejar que el build caiga a la imagen Modal de ese beat. Sin esa pasada el video sale con 1 de cada 5 planos fuera de tema.
- 2026-07-25 — COMPONENTES: con `MIN_GAP=7s` quedaban 59 tarjetas premium = 32% del video tapado por carteles crema (el b-roll es la identidad del canal). Piso nuevo: **MIN_GAP 13s, dur ≤5.5s, zona `top` → `topLeft`**. Y `BeforeAfter` SIN `beforeImage`/`afterImage` dibuja un manchón abstracto ilegible: si se usa, pasarle fotos reales.
- 2026-07-24 — GUION: el creador rechazó una primera versión de ~14k "contada de afuera" por FLOJA. Regla para este canal: guiones **20.000+ caracteres** (reemplaza el "16-20k" de §1) y **ULTRA-INMERSIVOS en PRIMERA PERSONA** — la abuela cuenta sus propios recuerdos vívidos y sensoriales en cada plato ("yo me sentaba en el banquito al lado de la cocina…", el olor, el calor, quién se peleaba por qué). Cada ítem del listicle = una mini-anécdota emotiva, no una descripción neutra. Nada de guion "informativo" narrado desde afuera.
- 2026-07-25 — PRODUCCIÓN/HeyGen: con guiones largos de este canal (20.000-25.000 caracteres) el avatar de HeyGen **NO entra entero en un solo render**. Medido en "25 Platos Olvidados": el mp4 de 18:30 habló 13.148 de los 24.554 caracteres del guion (54%) y cortó justo después del plato 15, sin recap, sin pago del loop grande y sin cierre. Regla para este canal: generar el avatar en **2 partes** (partir el guion por la mitad en un corte limpio entre ítems) y pegarlas, o verificar el % hablado ANTES de montar. Chequeo rápido: comparar los caracteres de `captions_<slug>.json` contra los del .txt del guion.
- 2026-07-25 — PRODUCCIÓN "25 platos olvidados" (vki4lqtcboy0): el avatar de HeyGen llegó CORTADO en el plato 15 (18:30 de audio para un guion de 24k caracteres). Regla para este canal: los guiones de 20k+ NO entran en una sola generación de HeyGen — hay que partirlos en 2-3 tandas y unir los mp4, o avisar al creador antes de montar. El video se armó y tituló con los platos que SÍ están (15), no con los 25 del título original.
- 2026-07-25 — B-ROLL: YouTube quedó bloqueado (yt-dlp sin metadata, `sin -J`) → el video se hizo 100% con Pexels + imágenes Modal + componentes del kit premium. GOTCHA propio del nicho recetas: las queries de Pexels con PERSONAS devuelven gente moderna de oficina/cocina de diseño y rompen la época — en este canal, todo momento con personas va a IMAGEN IA (cocina criolla), y a Pexels solo se le piden objetos, comida y manos.
- 2026-07-25 — FARM: nunca correr `scripts/farm.mjs` sin la lista explícita `@_<slug>_assets.txt` y con `TAR_DIR=/d`: sin eso empaqueta `public/broll` ENTERA (10 GB) y llena el disco C:.
