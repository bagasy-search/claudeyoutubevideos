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
- 2026-07-25 — ⚠ DIAGNÓSTICO EQUIVOCADO QUE ME COSTÓ UN RENDER ENTERO (queda como aviso). Vi que el video armado duraba 18:30 y el guion tenía 24k caracteres, y concluí "el avatar vino cortado en el plato 15"; hasta reescribí el título a 15 platos. **Era falso**: el avatar completo (parte 1 + parte 2 = 34:27) ya estaba unido en `public/<slug>_opt.mp4` y el transcript llegaba hasta 34:26. Lo que faltaba eran los BEATS de la segunda mitad — el beatsheet cubría sólo hasta 18:30 y el farm se disparó con 33350 frames en vez de 62044. Regla: antes de declarar que falta locución, comparar `ffprobe` del mp4 del avatar y el último timestamp del transcript contra la duración del beatsheet. Casi siempre falta el MONTAJE, no el audio.
- 2026-07-25 — B-ROLL: YouTube quedó bloqueado (yt-dlp sin metadata, `sin -J`) → el video se hizo 100% con Pexels + imágenes Modal + componentes del kit premium. GOTCHA propio del nicho recetas: las queries de Pexels con PERSONAS devuelven gente moderna de oficina/cocina de diseño y rompen la época — en este canal, todo momento con personas va a IMAGEN IA (cocina criolla), y a Pexels solo se le piden objetos, comida y manos.
- 2026-07-25 — FARM: nunca correr `scripts/farm.mjs` sin la lista explícita `@_<slug>_assets.txt` y con `TAR_DIR=/d`: sin eso empaqueta `public/broll` ENTERA (10 GB) y llena el disco C:.
- 2026-07-25 — ⚠ COLISIÓN DE DOS AGENTES en el mismo slug (vki4lqtcboy0). Mientras yo (sesión interactiva) armaba la parte 2, el worker lanzó su propio agente headless (`claude -p`) sobre la MISMA carpeta y el MISMO slug: me reescribió `_v3/<slug>_beats_p2.json` (mis 321 beats → sus 280, con otras descripciones) y disparó un farm del corte viejo de 33350 frames que iba a entregarse como final (lo cancelé: run 30147631940). Los assets quedan mal apareados porque los dos usamos los mismos nombres `<slug>_s_NNN` con contenidos distintos. Regla: **un solo motor por video**. Si el creador pide algo por chat sobre un video que ya está en la cola del worker, primero hay que sacar el job de la cola (o pausar el worker) — si no, los dos agentes se pisan y el render sale mezclado.
- 2026-07-25 — CERRADO: video final de 34:29 con los 25 platos (parte 1 + parte 2 del avatar unidas). La parte 2 de HeyGen vino en 1920x**1082** — hay que recortar a 1080 antes de concatenar o el pegado falla. Whisper transcribe algunos números como dígito ("el 16") y otros como palabra ("el veinticuatro", "menor de cuarenta"): verificar cada ancla, no asumir. Y como la locución son dos tandas unidas, hay frases IDÉNTICAS en las dos mitades ("el pan de ayer", "tu abuela dejó de hacer...") → el anclaje por texto agarra la primera aparición y manda el visual 20 min antes; se resolvió con un piso `afterMs` por beat/componente en el build.
- 2026-07-25 — VIDEO COMPLETO 34:27 (vki4lqtcboy0). La parte 2 de HeyGen llegó en 1920x**1082** (2 px de más): no se puede concatenar por copia, hay que recodificar con `crop=1920:1080:0:0`. Confirmado que el avatar mantiene continuidad visual entre tandas: se puede partir un guion largo en 2 generaciones sin que se note el corte.
- 2026-07-25 — ANCLAJE EN VIDEOS DE 2 TANDAS: el recap del cierre repite frases textuales de la primera mitad, así que `at()` las ancla 20 minutos antes y te tira el visual del plato 24 en el minuto 2. Todo beat/componente de la parte 2 tiene que llevar `afterMs` (acá 1105000). Sin eso el build no avisa: sólo aparece como "solapan" en beatsheet.mjs.
- 2026-07-25 — NAMESPACE POR TANDA: dos corridas del agente autoraron su propia parte 2 usando los mismos nombres de asset (`_s_317+`), y quedó cruzado — el clip de un beat sobre la frase de otro, sin error visible. Regla: la parte 2 va con prefijo propio (`<slug>_q_NNN`) y nunca continuando la numeración de la parte 1.
- 2026-07-25 — **EL RENDER LEE LOS CUES, NO EL BEATSHEET.** Edité 22 visuales a mano en `beatsheet/vki4lqtcboy0.json`, commiteé, rendeé... y salieron los visuales VIEJOS. La composición importa `src/VideoEdit/cues_<slug>.gen.tsx`. Después de CUALQUIER edición manual del beatsheet hay que correr `node beatsheet.mjs beatsheet/<slug>.json` para regenerar los cues, si no el arreglo no viaja y el fallo es SILENCIOSO (el render sale bien, con el contenido viejo). Verificación barata: `grep -c fx_ src/VideoEdit/cues_<slug>.gen.tsx`.
- 2026-07-25 — Video de DOS TANDAS de HeyGen: la duración de la composición vive en `src/VideoEdit/avatar_<slug>.gen.ts` (`TOTAL_*`) y hay que COMMITEARLA. Si el farm rendea con el valor viejo, los chunks altos mueren con "frame range X-Y is not inbetween 0-Z". El `.gen.ts` no está en el commit por defecto — revisá `git status src/` antes de disparar.
- 2026-07-25 — Pexels devuelve 429 (throttle) en lotes grandes: de 187 clips pedidos bajaron 48. Lo que no baja NO se fuerza con una query más genérica (sale gente moderna) — se convierte a imagen IA de Modal con el mismo `desc`. En este video terminaron 476 imágenes IA / 162 clips y quedó mejor que forzando stock.
- 2026-07-25 — **DOS AGENTES EN LA MISMA CARPETA SE PISAN.** Con el worker corriendo en paralelo sobre este mismo slug, `_v3/*_beats_p2.json`, `beatsheet/` y `_<slug>_assets.txt` se reescribieron solos a mitad de trabajo (hasta cambió la nomenclatura de ids de `_s_` a `_q_`), y un render disparado se canceló solo. Defensa que funcionó: commitear enseguida y recuperar con `git checkout <commit> -- <archivos>` en vez de reconstruir. La solución de fondo sigue siendo un git worktree por video.
- 2026-07-25 — ★★★ EL RENDER NO LEE EL BEATSHEET, LEE LOS CUES. La composición monta `src/VideoEdit/cues_<slug>.gen.tsx`. Edité `beatsheet/<slug>.json` para reemplazar 22 visuales de la auditoría, commiteé, rendeé — y el video salió con los 22 defectos intactos: nunca regeneré los cues. Después de CUALQUIER edición del beatsheet hay que correr `node beatsheet.mjs beatsheet/<slug>.json` y verificar con `grep -c fx_ src/VideoEdit/cues_<slug>.gen.tsx` ANTES de commitear. El build no avisa: el beatsheet queda perfecto y el render ignora los cambios.
- 2026-07-25 — FARM: los `*.gen.ts/tsx` cuentan como código, no como asset. Rendeó 33350 frames en vez de 62044 porque `avatar_<slug>.gen.ts` local decía 2068.12 pero el commiteado seguía en 1111.66. El pre-vuelo del farm valida la rama y la composición, pero NO que los gen files estén al día → commitear `src/VideoEdit/*_<slug>.gen.*` junto con el beatsheet, siempre.
- 2026-07-25 — PEXELS a escala: pidiendo 187 clips de una, tira 429 (Throttle) y bajan ~45%; reintentar con esperas de 45-120s recupera poco. Para este canal conviene: lo que no baja se convierte a IMAGEN IA con el mismo `desc` (queda más on-topic y de época que el stock genérico). Automatizado en `scripts/resolve_p2_assets_vki4.mjs`.
- 2026-07-25 — AUDITORÍA MEDIDA: la parte 1 (armada a las apuradas) dio 22 defectos en 93 frames (24%); la parte 2, armada con pools por sección y personas siempre a imagen IA, dio 5 en 95 (5%). El método de las secciones con pool de visuales rinde 5 veces mejor — usarlo desde el principio, no sólo en la segunda mitad.
- 2026-07-25 — ★★★ VERIFICAR EL ASSET ENTREGADO, NO SOLO EL RENDER. Terminé el video de 34:29 (761.774.224 bytes) y lo di por entregado; el release `bagasy-videos/vki4lqtcboy0` tenía subido el mp4 de **460.372.601 bytes = el corte viejo de 18:32** (media película), y los mp4 locales de `D:\videosdeclaude` ya habían sido borrados por el worker. Antes de cerrar: `gh release view <tag> --repo bautielcrack4-web/bagasy-videos --json assets` y comparar el `size` contra el del render final. Si no coinciden, bajar el artifact de la corrida (`gh run download <run> -n final-<slug>`) y `gh release upload --clobber`. Los artifacts de Actions duran 90 días, así que el render siempre se puede recuperar aunque el mp4 local desaparezca.
- 2026-07-25 — KIT: este canal NO tiene entrada propia en `kits.json`, así que el build se apoyó por inercia en `src/VideoEdit/kit/premium/` (57 componentes). El kit del nicho casero es `src/VideoEdit/scenes/` (**130 componentes**, el que usan constructor/amish/nature) y es el que la §3 de esta ficha describe (tarjetas de receta, blur→nítido, fotos vintage). Pendiente de decisión del creador: registrar Abuela Rosa en `kits.json` apuntando a `scenes/`.
