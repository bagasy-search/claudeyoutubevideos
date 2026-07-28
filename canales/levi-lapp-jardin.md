# Canal: Levi Lapp Jardín  (UCNrLxNPPGgZsud3iCNzPerQ)

> **Este archivo MANDA sobre cualquier regla genérica.** Si algo acá contradice la skill de nicho,
> el pipeline o tu criterio, **gana este archivo**.
> Leelo COMPLETO antes de escribir guion o editar. Mantenelo actualizado (§6).
>
> 📌 Esto **no es una biografía ficticia**. Es la **IDENTIDAD DE ESCRITURA del canal**.
>
> ⚠️ ORIGEN (2026-07-28): este archivo NO existía. Se reconstruyó desde la memoria persistente del
> agente sobre este canal (videos ya entregados: `replantar`, `abono`, `secretos`) y desde guiones
> que el creador aprobó explícitamente. Lo que NO estaba confirmado quedó en ⬜.

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

> La fórmula general está en `para-chatgpt/GUION.md` (esa se aplica SIEMPRE).
> Acá va lo que es **propio de este canal** y la pisa.

- **Cómo son los ganchos acá**: el objeto/planta del título haciendo algo que suena imposible, dicho
  desde una escena física concreta del terreno de Levi. Ejemplos reales que funcionaron:
  - *"Mi Abuelo Enterró Troncos Podridos… y su Huerta No se Regó en 20 Años"* (hugelkultur).
  - *"Hay una hierba que crece sola en el borde de tu terreno, que te quema la mano si la agarras
    sin guante, y que espanta más plagas que el frasco de dieciocho dólares"* (plaguicidas, jul 2026).
- **Estructura preferida** — dos formatos vivos, no mezclar en un mismo video:
  - **MECANISMO IMPOSIBLE** (el que rinde): UN solo mecanismo por video, con diagrama a medida,
    historia del abuelo, y "el vivero/la industria no quiere que lo sepas".
  - **LISTICLE denso** (recuperado jul 2026): tip tras tip, micro-estructura por tip
    (nombre imperativo → "los Amish desde siempre" → el porqué → dato preciso → remate folk).
- **Cómo abre y cómo cierra**: abre con el sujeto del título en versión loquísima + el objeto físico
  del galpón/huerta. Cierra con recap numerado accionable → carnada de comentarios ("¿cuál es la
  plaga que te gana todos los años? de qué zona eres") → teaser ultra-específico del próximo →
  cierre de identidad ("no estamos inventando nada, estamos acordándonos") → "Nos vemos en la huerta".
- **Densidad / ritmo**: frases cortas con punto. Nada de listas coma-coma-coma. Números concretos en
  cada método (gramos, días, diluciones, metros de distancia).
- **Largo objetivo:** 17.000–22.000 caracteres (el panel del creador fija el número por video).
- **Qué hace SIEMPRE**: marco anti-químico / anti-corporativo ("no es que no funcione, es que no se
  puede facturar"). Un tramo de límites honestos. Advertencias de seguridad explícitas y enfáticas.
- **Qué NUNCA hace**: autos, neumáticos, motores (el Amish no maneja — rompe el personaje).
  Nunca abre referenciando otro video. Nunca inventa estudios.

### Ganchos ya usados (para NO repetirlos)

| Fecha | Video | Gancho usado |
|---|---|---|
| jun 2026 | replantar — "15 verduras del súper que puedes replantar gratis" | listicle "todo gratis" |
| jun 2026 | abono | ⬜ |
| jun 2026 | hugel (guion) | "enterró troncos podridos y no regó en 20 años" |
| jul 2026 | secretos — "30 Secretos de Jardín Amish" | autoridad + volumen + curiosity gap |
| 2026-07-28 | vah3z2zzciut — "Dile Adiós a los Plaguicidas Caros" | la hierba que quema la mano vs el frasco de $18 |

## 2. VOZ — cómo suena

- **Tono:** tranquilo, cómplice, "te cuento un secreto". No grita. Memoria imperfecta, humano.
- **Trato al espectador:** **TÚ** (español neutro, España + Latam).
- **Muletillas y frases propias:** "Nos vemos en la huerta." · "Y aquí viene la parte que te va a
  molestar." · "Escúchame bien, porque este es el punto donde la gente se equivoca."
- **Palabras que USA:** cantero, huerta, galpón, brote, plaga, el frasco (por el insecticida caro).
- **Palabras que NUNCA usa:** jerga de marketing, "amigos", "bienvenidos", "hoy les voy a mostrar".
- **Tags de TTS:** ElevenLabs v3, POCOS y reales — `[sighs]` `[chuckles]` `[whispers]`
  `[clears throat]`. **NUNCA `[pausa]`/`[pause]`** (enlentece la voz).
- **Datos personales confirmados** (NO agregar otros sin que el creador los dé):
  abuelo **Amós** · madre **Rebeca** · vecino viejo **Jonás** · mula **Nell** · hijo **Daniel** ·
  **Lancaster** como lugar. Nombre del presentador: **Levi Lapp**.
  Edad de Levi: ⬜ (se lo describe como joven, ~28-32). Esposa: ⬜ (no usar sin confirmar).

## 3. LOOK — la marca visual

- **Skill de nicho:** `amish-doc` (kit `amish`), modo AVATAR.
- **Componentes (compartidos del nicho):** `src/VideoEdit/scenes/` — esqueleto canónico
  `src/VideoEdit/Main_termitas.tsx`. Nunca clonar ni renombrar el kit por canal.
- **Paleta / tipografía:** serif terroso, vintage, calmo, rústico.
- **Formato:** híbrido con avatar a cámara. Ventanas full de avatar alternadas con visual full.
  **Nada de PiP en esquina.**
- **Reglas visuales del canal:** abre con avatar full ≥2s. B-roll real (macro, manos trabajando,
  timelapses). Cero filtros, cero temblor, corte limpio.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Imágenes:** según lo que elija el creador por video en el panel (Modal por defecto;
  gpt-image-2 low cuando pide alta calidad). Con avatar: usar frame del avatar como `ref`.
- **Voz / TTS:** HeyGen `create_video_from_studio`, engine **avatar_iii** SIEMPRE (nunca IV ni V),
  `eleven_v3`, **speed 1.0 siempre**.
- **B-roll:** aislado por slug → `public/broll/<slug>/`. La carpeta compartida contamina entre videos.
- **Render:** SIEMPRE en el farm (GitHub Actions), rama `molino-<slug>`, entry propio
  `src/index_<slug>.tsx`. Nunca render local.
- **Otros:** el comp NECESITA `public/<slug>.wav` (AvatarLayer reproduce el video mudo + un `<Audio>`
  separado). Dropear el wav = 404 en cada frame = todos los chunks fallan.

## 5. GLOSARIO — elementos recurrentes

- **Levi Lapp** — presentador. Hombre joven Amish (~28-32), barba corta oscura SIN bigote, sombrero
  de paja o fieltro negro, tiradores, camisa lisa de un color, pantalón broadfall.
- **El abuelo Amós** — la fuente de todo el saber viejo. Aparece siempre "con las manos en la tierra".
- **Jonás** — el vecino viejo (78 años, casi no oye) que corrige a Levi sin hablar.
- **Lancaster** — el lugar. Granja, galpón de madera, huerta de canteros rectos.
- **"El frasco"** — el insecticida/producto caro del vivero. El enemigo material del canal.

## 6. APRENDIZAJES — correcciones del creador (append-only)

- 2026-06 — El canal NO lleva el formato "choclo / decisión de compra": ese va en otro canal ES distinto.
- 2026-06 — PIVOT: abandonar los listicles genéricos "todo gratis / 7 basuras" y adoptar
  "abuelo + UN mecanismo imposible + sin sistema + gratis" (el ariete rindió ~15× en el mismo canal).
- 2026-07 — El creador RETOMÓ el formato listicle denso tras analizar a Elias Yoder / "Amish
  Gardening Secrets". Los dos formatos conviven; se elige por video.
- 2026-07 — Contra-arma vs la crítica "esto es IA": Levi texturalmente humano (tags v3, un guiño
  personal de una línea, memoria imperfecta).
- 2026-07-28 — Este archivo `canales/levi-lapp-jardin.md` no existía y ningún worktree lo tenía.
  Creado desde la memoria del agente. Todo lo que no estaba confirmado quedó en ⬜.
- 2026-07-28 — ⚠️ EL LOOK DEL AVATAR (`626aa96d83c744e99fb0d34e1b992631`) TIENE UNA PIZARRA DE OTRO
  VIDEO detrás: dice "ABONO NATURAL DE $3 · GUÍA EN LA DESCRIPCIÓN". Sale en pantalla cada vez que
  el avatar va a full, así que en este video (plaguicidas) contradice el tema y promete una guía que
  no existe. Para los próximos: pedir un look sin texto en la pizarra, o uno por tema.
- 2026-07-28 — Con `eleven_v3`, HeyGen leyó EN VOZ ALTA dos de los cuatro tags: `[chuckles]` salió
  como "Chuckles" y `[clears throat]` como "Clear throat" (`[sighs]` y `[whispers]` sí los interpretó).
  Fix sin gastar otro crédito: ubicar el ms en las captions y silenciar ese span con
  `ffmpeg -af volume=enable='between(t,A,B)':volume=0 -c:v copy` — no re-encodea el video, la duración
  no se mueve y las anclas de Whisper siguen valiendo. Para el próximo: usar sólo `[sighs]`/`[whispers]`.
- 2026-07-28 — Whisper transcribe los números como DÍGITOS ("20 listas" donde el guion dice "veinte
  listas"), así que anclar por frase literal falla en la mitad de los casos. El build usa matcheo
  DIFUSO por solapamiento de tokens (umbral 0,62) y reporta las anclas dudosas.
- 2026-07-28 — La compuerta de densidad pide 7 usos de componente por minuto, pero llenarla con
  carteles a pantalla completa mata el b-roll y el look sparse del nicho. La forma correcta es
  tipografía sincronizada al ms ENCIMA del clip vivo (kineticline/phrasetag como overlay): cuenta
  para la compuerta y no tapa el material real. Aire mínimo de 5s entre carteles full.
- 2026-07-28 — ⛔ HAY COMPONENTES DEL KIT QUE PINTAN SU FONDO CON `<Img>`, NO CON `<Video>`:
  FocusCard, TermCard, Loupe, Annotated, Half, SplitExplain, LowerThird y **MistakeCard**. Si el
  build les pasa un `.mp4` como `image`/`clipBg` pasa una de dos cosas, las dos silenciosas:
  el chunk muere con `EncodingError: The source image cannot be decoded`, o —peor— el componente
  renderiza NEGRO y el render sale "success" con un agujero adentro (acá fueron 6,5s en el minuto
  9:05, lo cazó el `blackdetect` del chequeo técnico del farm, no la cuadrícula). Solución: para
  esos kinds sacar UN fotograma del clip con ffmpeg y pasar el jpg. Los demás (callout, chips,
  numcard, aged, impact, growthtimeline, tool, lielist, keyphrase, quote) sí aceptan video de fondo.
- 2026-07-28 — ⛔ **`MistakeCard` RENDERIZA NEGRO. NO USARLO hasta que se arregle.** (Corrige mi
  diagnóstico anterior: no era que recibiera un mp4.) `src/VideoEdit/scenes/MistakeCard.tsx:27`
  pinta el fondo con un `<img src={image}>` CRUDO, sin envolver la ruta en `staticFile()`, así que
  la imagen nunca carga; queda el `COLORS.bg0` casi negro con un texto chico y el frame da >98%
  negro. Le pasa con jpg y con mp4 por igual. En este video se reemplazó por `impact`
  (ImpactReveal), que sí funciona con fondo de clip. Es el mismo gotcha del wrapper `staticFile()`
  que CLAUDE.md documenta para `ImgOr`/`sf()`. Arreglarlo es tocar un archivo COMPARTIDO del kit.
- 2026-07-28 — LECCIÓN DE MÉTODO: cuando el chequeo técnico marca negro, NO adivinar la causa. Medir
  la luminancia real (`ffmpeg -vf scale=1:1 -pix_fmt gray`) frame por frame, ver QUÉ cue está en ese
  segundo en el `.gen.tsx` (no en el beatsheet) y recién ahí abrir el componente. Adiviné dos veces
  y gasté dos renders.
- 2026-07-28 — Truco para re-render PARCIAL: `ONLY_CHUNKS` reusa el release ya subido, así que el
  arreglo tiene que apoyarse en un asset que YA esté empaquetado. Si generás un archivo nuevo hay
  que re-subir 1,2 GB y rendear todo de nuevo.
- 2026-07-28 — Video "Dile Adiós a los Plaguicidas Caros": el creador pidió MODO STOCK
  (b-roll 100% real de Pexels, IA solo para momentos personales con la cara de Levi como ref),
  fotos reales de la web habilitadas, y gpt-image-2 como motor de imagen para este video.
