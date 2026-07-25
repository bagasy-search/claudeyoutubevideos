# Canal: Federer Consejos Salud (nicho médico)

> **Este archivo MANDA sobre cualquier regla genérica.** Leelo COMPLETO antes de escribir guion o editar.
> Mantenelo actualizado (§6).
>
> 📌 Esto es la **identidad de ESCRITURA** del canal, no una biografía. No inventes vida personal.
>
> ⛔ **MISMO PRESENTADOR que `federer-consejos.md`.** "Federer Consejos Salud" es el mismo canal /
> el mismo **Dr. Federer** (el worker lo referencia con el slug `-salud`). NO es Dr. Valler.
> Si editás algo de identidad, mantené sincronizado con `federer-consejos.md`.

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

- **Presentador:** **Dr. Federer** (médico de confianza, cálido, cercano).
- **Público:** **México / América Latina.** Español neutro-mexicano: "pesos", "tianguis", "mercado",
  "de qué parte de México o de América Latina nos ven". NUNCA argentino (eso es Valler).
- **Ganchos acá:** cold-open de herida/escena concreta O pregunta retórica que abre un secreto +
  longevidad + anécdota/ancla histórica o real VERIFICABLE. Loops teaseados que se pagan.
- **Estructura fija:** cold-open/gancho → ancla real verificable → mito que se derriba → ENEMIGO
  (industria de suplementos/farmacias caras) → el mecanismo con ciencia (compuestos/procesos nombrados)
  → **N BENEFICIOS NUMERADOS** (teasear el nº3) → **receta/qué hacer paso a paso** (ingredientes
  económicos de tianguis) → **límites honestos** → **EL ERROR común** que arruina todo → recap en 3
  pasos → 3 injertos de guía → carnada de comentarios + "comparte con alguien que amas" → teaser
  ultra-específico → cierre cálido.
- **Densidad / ritmo:** storytelling largo, cálido y envolvente, NO frases cortas cortantes. Párrafos
  que fluyen, "te lo explico de manera sencilla", promesas teaseadas.
- **Largo objetivo:** ~16-18k caracteres (mínimo 14.000).
- **Qué hace SIEMPRE:** ciencia con nombres/números verificables; ancla histórica o caso real;
  enemigo "la industria"; remedio/receta casera económica; teaser del beneficio nº3; carnada de
  comentarios + "comparte con alguien que amas".
- **Qué NUNCA hace:** inventar estudios; sonar a vendedor; "los médicos lo callan"/curas milagrosas;
  hacerse pasar por Dr. Valler, hablar de "usted", ni modismos argentinos.

### Ganchos ya usados (para NO repetirlos)

| Fecha | Video | Gancho usado |
|---|---|---|
| 2026-07-21 | vyuc10j44snw — come esto antes de dormir, piernas fuertes a los 80 | Cold-open herida: "A los 80 años uno de mis pacientes ya no podía levantarse solo de su sillón… tres intentos para quedar de pie." → ancla real: Charles Eugster (sprinter campeón pasados los 90) + estudio Fiatarone/Tufts 1990 (ancianos de hasta 96 triplicaron fuerza de piernas en 8 semanas). Tema: caseína (requesón) + magnesio (pepitas) + potasio (plátano) antes de dormir contra la sarcopenia. ~16.5k car. Guía = SECUNDARIA (Salud +60). |
| 2026-07-21 | vhy9s3dd4wqx — la fruta Nº1 que mejora la circulación en las piernas +60 | Cold-open herida: paciente de 74 que "ya no siente las piernas", pies fríos con calcetines de lana, calambres nocturnos, casi se cae por la escalera. → ancla real: Nobel de Medicina 1998 (óxido nítrico dilata las arterias) + paradoja francesa + estudio revista *Circulation* (polifenoles de uva mejoran dilatación arterial). Tema: UVA morada/negra con PIEL y SEMILLA (resveratrol/polifenoles) para circulación. Enemigo: pastillas de farmacia caras. El ERROR: jugo de uva de cartón. 25.2k car. Guía = SECUNDARIA (Salud +60). |

## 2. VOZ — cómo suena

- **Tono:** médico cálido, cercano, de confianza. Cuenta historias, promete beneficios, comparte un
  secreto. Cierra con cariño ("Queridos amigos", "Un fuerte abrazo, hasta la próxima").
- **Trato al espectador:** **TÚ (tuteo).** ⛔ NUNCA "usted" (eso es Valler).
- **Muletillas propias:** "Queridos amigos", "quédate conmigo hasta el final", "te lo explico de
  manera sencilla", "y te adelanto que…", "y aquí quiero que te detengas un momento", "eso no es un
  cuento, es historia registrada", "lo que no quieren que sepas".
- **Tags de TTS:** pocos y reales — `[clears throat]`, `[chuckles]`, `[sighs]`, `[whispers]`. NUNCA `[pause]`.
- **Datos personales:** solo los escritos acá. Si falta uno, pedilo o escribí sin esa anécdota.

## 3. LOOK — la marca visual

- **Skill de nicho / kit ELEGIDO por el creador para este slug:** **`federer-video`** — kit
  **"Dr. Federer — Archivos (4 capas, escritorio)"** (id `federer-video`), que vive en **`src/_fed6/`**.
  Esqueleto: clonar `src/_fed6/VideoEdit/Main_federer6.tsx`. Componentes de
  `src/_fed6/VideoEdit/FedererComponents2.tsx` (AvatarLayer, AvatarKeyword, RawShot, FedererComponents2).
  ⛔ NO importar de `src/VideoEdit/` ni mezclar con el kit `federer-fluid`.
- **PIZARRA EXPLICATIVA (`src/FedWhiteboard.tsx`, self-contained):** para el beat del "por qué
  funciona / el mecanismo" (ej. caseína = gotero de aminoácidos toda la noche; magnesio relaja el
  músculo). Estilo Vox, se dibuja a mano. Ver [[reference_fed_whiteboard_component]].
- **Formato:** avatar real a cámara + capas de profundidad.
- **Reglas visuales duras:** ABRE con avatar full ≥2s; AVATAR solo FULL / HIDDEN / SPLIT — **CERO
  recuadro / PiP / cornerTR**; capa densa de b-roll siempre; look CLÍNICO teal/blanco; corte limpio.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Imágenes:** ⭐ **gpt-image-2 (NO Modal)** para este video. Frame del avatar como `ref` en las
  imágenes del presentador (mantienen su cara). Foto casera real con imperfecciones, nada 3D/render.
  Los fondos genéricos sin presentador pueden ir a Modal para no topar rate-limit. Seguí `para-chatgpt/IMAGENES.md`.
- **Voz / TTS:** el avatar viene de HeyGen (engine avatar_iii, nunca Avatar IV).
- **Render:** siempre en el FARM (nube), rama propia por slug.

## 5. GLOSARIO — elementos recurrentes

- **PRODUCTO / GUÍA — HAY DOS, promocionar la que corresponde al tema:**
  - **PRIMARIA (piel): "El Método Piel Joven del Dr. Federer"** — piel madura, USD 17,
    `metodo-piel-joven.vercel.app` → checkout `pay.hotmart.com/V106784119A`.
  - **SECUNDARIA (temas NO de piel — sueño, digestión, músculo, salud general): "La Guía Completa de
    la Salud Después de los 60"** — +150 remedios, **$27**, `archivos-federer.vercel.app`.
    → **Este video (piernas/fuerza) usa la SECUNDARIA.**
  - **Link SIEMPRE sin `https://`.** CTA en voz del canal = **TÚ**. 3 injertos suaves (30% / 60% / final).
  - **En la descripción:** CTA de la guía ARRIBA DE TODO, primera línea.
- **PRESENTACIÓN:** se presenta como **Dr. Federer** de forma natural/casera (nada de bata/currículum).
- **TONO DE VENTA (regla dura):** nada de "los médicos lo callan" ni curas milagrosas. La guía
  **complementa, NO reemplaza al médico.**

## 6. APRENDIZAJES — correcciones del creador (append-only)

- **2026-07-21 (creación):** canal creado bajo el slug `federer-consejos-salud` porque el worker lo
  referencia así. Es el **mismo Dr. Federer** que `federer-consejos.md` (mismo presentador, tú,
  mexicano, storytelling cálido). Kit de edición para este slug = **`federer-video`** (`src/_fed6/`),
  imágenes por **gpt-image-2**. Primer video: vyuc10j44snw (piernas a los 80, guía SECUNDARIA).
- **2026-07-21:** el creador pidió que **TODOS los guiones de este canal tengan +20.000 caracteres**
  (reemplaza al piso genérico de 14.000). Medir siempre con un comando antes de entregar; si da menos
  de 20k, seguir desarrollando (porqué + número + mini-ejemplo + objeción resuelta), no relleno.
