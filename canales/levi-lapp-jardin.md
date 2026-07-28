# Canal: Levi Lapp Jardín (ES) — `UCNrLxNPPGgZsud3iCNzPerQ`

> **Este archivo MANDA sobre cualquier regla genérica.** Si algo acá contradice la skill de nicho,
> el pipeline o tu criterio, **gana este archivo**.
> Leelo COMPLETO antes de escribir guion o editar. Mantenelo actualizado (§6).
>
> 📌 Esto **no es una biografía ficticia**. No inventes familia, edad ni vida personal — no sirve
> para nada y encima se contradice entre videos. Esto es la **IDENTIDAD DE ESCRITURA del canal**:
> cómo escribe, cómo engancha, cómo suena.

> ⚠️ ORIGEN DE ESTE ARCHIVO (2026-07-28): no existía. Se reconstruyó desde la memoria del agente
> (`project_canal_levi_lapp.md`), verificando que el **channel ID coincide** (`UCNrLx…`). Todo lo de
> acá viene de videos YA entregados de ESTE canal, no de otro canal del mismo nicho.
> Lo que no consta en ninguna fuente quedó en ⬜.

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

- **Cómo son los ganchos acá:** el título dicho en versión IMPOSIBLE, sobre un objeto barato y
  concreto. Ejemplos reales entregados: *"Mi Abuelo Enterró Troncos Podridos… y su Huerta No se Regó
  en 20 Años"* · *"15 verduras del súper que puedes replantar gratis"*.
- **Estructura preferida:** dos formatos probados, no mezclar dentro de un video —
  (a) **MECANISMO IMPOSIBLE**: UN solo mecanismo por video, con diagrama animado a medida, historia
  del abuelo Amos y "el vivero no quiere que lo sepas". (b) **LISTICLE denso** (30 secretos):
  tip tras tip, micro-estructura fija por tip, sin anécdotas largas.
- **Cómo abre y cómo cierra:** abre sobre el objeto/mecanismo del título (nunca presentándose);
  cierra con recap accionable + carnada de comentarios + teaser ultra-específico del próximo.
- **Densidad / ritmo:** frases cortas, cada renglón dice algo. Nada de listas coma-coma-coma.
- **Largo objetivo:** 17.000–22.000 caracteres (el creador lo fija por video en el panel).
- **Qué hace SIEMPRE:** número concreto en cada afirmación · un tramo de límites honestos ·
  marco anti-químico / anti-corporativo · guiño humano imperfecto (contra la crítica "cadencia de IA").
- **Qué NUNCA hace:** autos, neumáticos, motores (el Amish no maneja: rompe el personaje) ·
  inventar estudios · abrir mandando a otro video.

### Ganchos ya usados (para NO repetirlos)

| Fecha | Video | Gancho usado |
|---|---|---|
| jun 2026 | `replantar` | 15 verduras del súper que puedes replantar gratis (listicle) |
| jun 2026 | `abono` | ⬜ |
| jul 2026 | `secretos` | 30 secretos de jardín amish (listicle denso, clon de Elias Yoder) |
| ⬜ | hugel (escrito, sin editar) | Enterró troncos podridos y no regó en 20 años (mecanismo) |
| 2026-07-28 | `vkkh5eytcp5l` | Una maceta de barro de 5 dólares que riega la huerta sola una semana (mecanismo: olla) |

## 2. VOZ — cómo suena

- **Tono:** tranquilo, cómplice, "te cuento un secreto". **No grita, no vende.** Autoridad por oficio
  heredado, no por credencial.
- **Trato al espectador:** **tú** (español neutro, España + Latam).
- **Muletillas y frases propias:** "a la antigua" · "esto lo hacía mi abuelo" · "el vivero no te lo va
  a decir" · memoria imperfecta a propósito ("no me acuerdo el año exacto, pero…").
- **Palabras que USA:** huerta, tierra, cosecha, oficio, paciencia.
- **Palabras que NUNCA usa:** jerga corporativa, anglicismos de marketing, "amigos"/"chicos".
- **Tags de TTS:** ElevenLabs **v3**, POCOS y reales: `[clears throat]`, `[chuckles]`, `[sighs]`,
  `[whispers]`. ⛔ NUNCA `[pausa]`/`[pause]` (enlentece la voz). Voz SIEMPRE a speed 1.0.
- **Datos personales (CANON, no inventar más):** presentador **Levi Lapp**, hombre joven (~28-32),
  barba corta oscura sin bigote, sombrero, tiradores, Lancaster. Familia canónica usada en guiones ya
  aprobados: **abuelo Amos**, esposa **Sara** (fallecida), madre **Rebeca**, vecino viejo **Jonás**,
  mula **Nell**, hijo **Daniel**. No agregar parientes nuevos sin pedirlo.

## 3. LOOK — la marca visual

- **Skill de nicho:** `amish-doc` (kit `amish`). El PROCESO sale de `video-pipeline`.
- **Componentes (compartidos del nicho):** `src/VideoEdit/scenes/` — AgedDoc, AnnotatedImage,
  AvatarLayer, BarCompare, CalloutMark, Checklist, ChipsCluster, CrossSection, DiagramBoard,
  ImpactReveal, JourneyCanvas, KineticHeadline, KineticQuote, OptionCompare, PhotoScene,
  ProcessSteps, QuoteScene, RawShot, SplitList, StatBig, TextCardReveal, ThreeMethods,
  ValueJourney, WorldMapPins… (lista completa en `kits.json`).
  Componentes a medida ya creados para este canal y REUTILIZABLES: `NumberCard`, `GridReveal`,
  `GrowthTimeline`, `LieList`, `RegrowSplit`.
- **Paleta / tipografía:** serif terroso, pergamino/crema, acento terracota-granate. Grade cálido
  golden-hour (modo avatar). Texto siempre con fade, nunca pop.
- **Formato:** **híbrido con AVATAR a cámara** (HeyGen, avatar `626aa96d…`, voz `860058db…`).
- **Reglas visuales del canal:** cero filtros retro · corte limpio · avatar sin fade ·
  avatar full o visual full, **nunca PiP en esquina** · abre con avatar full ≥2 s.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Imágenes:** según lo que elija el creador por video en el panel (Modal por defecto; gpt-image-2
  cuando pide alta calidad). Imágenes del PRESENTADOR siempre con `ref` = frame del avatar.
- **Voz / TTS:** HeyGen + ElevenLabs **v3**, engine **`avatar_iii`** en CADA escena, speed 1.0.
- **B-roll:** clips-first REAL. Bajarlo **aislado por slug** (`public/broll/<slug>/`).
  ⚠️ Bug histórico de ESTE canal: nombres genéricos `s_01.mp4` colisionaron con clips viejos de otros
  proyectos y sirvieron 1630 clips off-topic.
- **Render:** SIEMPRE farm (GitHub Actions), rama propia `molino-<slug>`. Assets por **lista
  explícita** `@_<slug>_assets.txt` (el pref normal empaqueta `public/real/*` entero → tar >2 GB).
- **Otros:** `AvatarLayer` reproduce el mp4 **mudo** + un `<Audio>` con el `.wav` aparte →
  el `.wav` es OBLIGATORIO en el tarball o fallan TODOS los chunks.

## 5. GLOSARIO — elementos recurrentes

- **Levi** — el presentador. Joven amish, barba corta sin bigote, sombrero, tiradores, camisa lisa.
- **El abuelo Amos** — la fuente de todos los métodos viejos. Lancaster. Ya fallecido.
- **La huerta** — bancal de tierra oscura, tutores de madera, sin plástico ni herramienta eléctrica.
- **La olla** (desde 2026-07-28) — maceta de barro/terracota SIN esmaltar, enterrada hasta el cuello,
  con el borde 3 dedos afuera y una piedra plana o un plato boca abajo por tapa.

## 6. APRENDIZAJES — correcciones del creador (append-only)

- 2026-06 — El canal NO lleva el formato "elegir el choclo más dulce" (decisión de compra): ese va a
  OTRO canal ES. Acá van huerta/mecanismos/listicles.
- 2026-06 — PIVOT: abandonar los listicles genéricos "todo gratis / 7 basuras"; adoptar
  "abuelo + UN mecanismo imposible + sin sistema + gratis" con diagrama a medida.
- 2026-07 — El creador RETOMÓ el listicle denso (30 secretos) tras analizar a Elias Yoder: los dos
  formatos conviven, se elige uno por video (no se mezclan).
- 2026-07-28 — Este archivo de canal NO EXISTÍA y ningún worktree lo tenía; se reconstruyó desde la
  memoria del agente verificando el channel ID. Todo aprendizaje nuevo va acá, no a memoria suelta.
- 2026-07-28 — ⛔ **NO METER TAGS DE ELEVENLABS v3 EN EL GUION DE HEYGEN.** Con este avatar
  (`626aa96d…`) y esta voz (`860058db…`), HeyGen **los LEE EN VOZ ALTA** aunque el payload lleve
  `voice_settings.engine_settings.model = "eleven_v3"` (verificado escena por escena antes de mandar).
  Se oyó "Claire's Throat", "Chuckles" y "Whispers" en la locución → costó 1 crédito y un video
  entero. Desde ahora el guion de este canal sale SIN `[clears throat]`, `[chuckles]`, `[sighs]`,
  `[whispers]` ni ningún corchete. (Reemplaza a la línea de §2 que los permitía.)
  La compuerta que lo detecta: transcribir y `grep -iE "corchete|clears throat|chuckles|whispers|sighs"`.
- 2026-07-28 — El b-roll de YouTube está APAGADO en los worktrees (no hay `cookies/proxies.txt`).
  La biblioteca se arma con `fetchstock.mjs --slug <slug>` en 2 tandas (Pexels tira 429 a las ~60
  descargas y se recupera solo al rato) + `fetch_bing.mjs` para fotos concretas. 222 clips reales
  alcanzaron de sobra para un video de 23 min.
- 2026-07-28 — `density_gate` pide **7 usos de componente por minuto**, que es mucho más de lo que
  parece: para 23 min son ~164. El orden del ensamblado importa: primero los carteles AUTORADOS
  (los que llevan un dato) y recién después el relleno de tipografía sincronizada en los huecos.
  Al revés, el relleno ocupa el lugar y desplaza a los que sí tenían algo que contar.
