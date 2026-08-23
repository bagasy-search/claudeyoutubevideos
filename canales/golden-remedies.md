# Canal: Golden Remedies

> **Este archivo MANDA sobre cualquier regla genérica.** Si algo acá contradice la skill de nicho,
> el pipeline o tu criterio, **gana este archivo**.
>
> 📌 Esto **no es una biografía ficticia**. No inventes familia, edad ni vida personal.

Canal **EN-US**, remedios caseros para piel/salud, público **+55/60**. Bagasy `draft:scn3l7x` (role own).
Presentadora: **mujer ~55, primera persona, testimonial confesional** — NO es médica, no se presenta
como autoridad clínica: la autoridad la aporta *el médico al que consulta* dentro de la historia.

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

- **Cómo son los ganchos acá:** primera línea = el título en versión loquísima, **sobre el SUJETO**
  (el ingrediente cotidiano), nunca sobre ella. Ej. entregado: *"The coffee grounds you scrape into
  the trash every single morning hold more of the exact compound that tightens, brightens and
  de-puffs tired skin than the eighty dollar eye cream sitting on your bathroom shelf right now."*
- **Estructura preferida:** hook → 60s del SUJETO (qué es, de dónde salió, por qué se dejó de usar)
  → open loop grande ("lo hice mal el día 3") → mecanismo en N partes → "por qué nadie te lo dice"
  → **el experimento día por día** (columna vertebral de retención) → el médico → límites honestos
  → payoff del loop (info NUEVA y contraintuitiva) → CTA a la descripción → carnada + teaser + firma.
- **Cómo abre y cómo cierra:** abre con el objeto cotidiano; cierra con la frase-firma del canal.
- **Densidad / ritmo:** mucha info concreta con números; la lista larga se parte con una micro-historia.
- **Largo objetivo:** **20.000+ caracteres** (el creador lo subió el 23/08/2026; antes 14k).
- **Qué hace SIEMPRE:** primera persona · honestidad sobre los límites ANTES del payoff · seguridad
  explícita (patch test, zona del ojo) · testigo externo que valida (alguien que nota el cambio) ·
  medidas exactas → a la DESCRIPCIÓN, nunca en voz alta.
- **Qué NUNCA hace:** marcas comerciales · precio o link en voz alta · prometer que borra arrugas ·
  referirse al título · presentarse/saludar al abrir.

### Ganchos ya usados (para NO repetirlos)

| Fecha | Video | Gancho usado |
|---|---|---|
| 2026-08-23 | `grcoffee` — I Rubbed Coffee on My Face for 7 Days | Los posos de café que tirás tienen más del compuesto activo que la crema de ojos de $80 |

## 2. VOZ — cómo suena

- **Tono:** confesional, cálido, autoirónico ("me sentí ridícula"), sin vender.
- **Trato al espectador:** *you*, directo, EN-US conversacional con contracciones.
- **Muletillas y frases propias:** "I want to be honest with you" · "I want that on the record" ·
  "Not gone. I want to be careful. Not gone." · firma de cierre: *"Nothing in my kitchen is rubbish
  until I have asked it what it can do."*
- **Palabras que NUNCA usa:** nombres de marca, "milagro", "cura".
- **Tags de TTS:** `[curious]` `[serious]` `[sighs]` `[pause]` `[emphatically]` — moderados.
  ⚠️ Fish requiere `--keep-tags` o el factory los borra.
- **Datos personales:** ⬜ solo lo escrito acá. Edad usada en `grcoffee`: 57. Tiene una hermana
  **2 años mayor**. Madre jardinera (echaba los posos a las rosas). No inventar más.

## 3. LOOK — la marca visual

- **Skill de nicho:** `dr-federer` (es la skill del nicho dermocosmético entero, no de una persona).
- **Componentes:** los compartidos del nicho. **No clonar ni renombrar el kit para este canal.**
- **Paleta / tipografía:** ⬜ a definir en el primer montaje. Referencia de miniatura del canal:
  alto contraste, amarillo + flash rojo sobre foto real.
- **Formato:** híbrido — avatar a cámara + escenas de profundidad.
- **Reglas visuales:** ⬜.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Voz / TTS (receta v2, MEDIDA 2026-08-23 — reemplaza la de agosto):** **Fish `s2.1-pro-free`**,
  preset `golden_remedies` de `fish_presets.json`: voz **`golden_remedies_v2`**,
  **`temperature 0.95`, `top_p 0.9`**, `--keep-tags`, **tags DENSOS (1 cada ~100 chars)**,
  y después **SIEMPRE** `python fish_breathe.py <master> <out> 1.59` → recién ahí loudnorm **−14 LUFS**.
  ⛔ `temperature 0.7` **ahoga la prosodia**, y con tags densos la generación llega a COLAPSAR en
  monotonía (4,1 semitonos medidos). Era la config vieja: no volver a ella.
  ⛔ NO usar los defaults del factory (1.15 / 0.98): son de Federer y acá no aplican.
  ⚠️ La nota vieja de que `_intriga` era "la más plana" **es falsa**: midiéndola es la de mayor
  rango de las tres (17,1 st). El problema nunca fue el tramo de referencia, era la temperatura.
- **Imágenes / B-roll / Render:** ⬜ (defaults del pipeline).

## 5. GLOSARIO — elementos recurrentes

- **used / spent coffee grounds** — posos húmedos, usados y FRÍOS del fondo de la cafetera (marrón
  oscuro, textura de tierra mojada). ⛔ nunca café fresco seco de la bolsa: es el error del video.
- **the kitchen window** — su punto fijo de fotos, luz de mañana.
- **the little jar** — la crema de ojos cara del estante del baño (el antagonista del canal).

## 6. APRENDIZAJES — correcciones del creador (append-only)

- **2026-08-23** — Largo objetivo del canal: **20.000+ caracteres**, no 14k (pedido a mitad del
  primer guion: "me confundí, pasa los 20k").
- **2026-08-23** — El creador vuelve a mandar el wav de ElevenLabs para "clonar" aunque la voz YA
  esté registrada de esa misma fuente. Verificar duración/codec contra `fish_refs/` ANTES de
  re-registrar; si es el mismo material, avisar y usar el preset ganador.
- **2026-08-23** — Pidió la voz "extremadamente humana, idéntica al audio". **Re-clonar NO era la
  palanca** (el re-clon solo, a temp 0.7, salió PEOR: 12,7 st vs 14,6). Las dos que sí movieron la
  aguja, medidas contra la narración real: **(1) subir `temperature` a 0.95 / `top_p` 0.9** y
  **(2) el techo de pausas del modelo**, que se rompe en post con `fish_breathe.py`. Fish devuelve
  pausas de ~0,46s contra 0,73s de la voz humana **y eso no cambia con ningún parámetro, referencia
  ni tag `[pause]`**. Regla general para cualquier canal: si el creador dice "no suena humano",
  medir **respiración (silencio %, pausas/min, mediana de pausa)** antes que timbre — es por donde
  él juzga, y es lo que el modelo hace peor.
- **2026-08-23** — Largo entregado en `grvaseline`: 29,6k chars → 34,4 min, y 37,7 min ya con las
  pausas estiradas. El estirado cuesta **+3,3 min** de duración: presupuestarlo al planificar.

- **2026-08-23** — Video `grcoffee` entregado. **Avatar PARCIAL en bucle**: la creadora grabó 5:31.6
  de 27:23 (20%). Receta que funcionó: lean a 1.4 Mbps → `-stream_loop` hasta el largo del master →
  muxear el wav ahí mismo (un solo `<Video>`, sync perfecto, cero riesgo de audio doble). Y **prohibir
  el split a media pantalla pasada la costura**: media pantalla con su cara fuera de sincro se nota
  muchísimo más que b-roll a pantalla completa.
- **2026-08-23** — ⛔ **El kit premium tiene TODOS los `eyebrow` por defecto en ESPAÑOL** (NumberedSteps
  "Paso a paso", SplitPanel "En resumen", ChecklistReveal "Cómo darte cuenta", BarCompare "Frente a
  frente"). En este canal, que es EN, **hay que pasar `eyebrow` explícito en inglés SIEMPRE**. Salió
  en pantalla en la 1ª corrida. Lo mismo con `GuardaEsto` (`tag`/`prompt` en voseo).
- **2026-08-23** — `BigStatReveal` declara `value?: number`: pasarle texto ("More", "SUN") rinde
  **"000"** sin crashear. Para un valor que no es número va `callout` (`figure` sí acepta texto).
  Y `chips`/SplitPanel sin `image` dibuja una ilustración por defecto de sol y mar.
- **2026-08-23** — **agnes-VIDEO oscurece MUCHO más que agnes-IMAGEN con el mismo prompt** (medido:
  luminancia 0-23 contra 37-109). Los ambientes de cuarto oscuro salen negros en clip y bien en foto
  → conviene degradarlos a foto en vez de regenerar. Y los **macros extremos de piel** ("very close
  view of a lower eyelid") salen con textura pustulosa/uncanny: abrir el plano a la CARA.
