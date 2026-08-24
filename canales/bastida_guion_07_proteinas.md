# Guion — Dr. Bastida · Salud Renal · Video #7

## "¿Creatinina Alta? 3 Proteínas Seguras para sus Riñones (y 3 Peores)"

Voz: Dr. Emilio Bastida, nefrólogo · "usted" · tags v3. Título #7 del plan del canal.
Slug `bastidarenal7` · card `k6fp3ss` · canal `youtube.com/channel/UCeI5tuivfdfydvYX_L_t36w`.
Entrega: `node scripts/deliver_card.mjs "youtube.com/channel/UCeI5tuivfdfydvYX_L_t36w" "k6fp3ss" bastidarenal7 --no-youtube`.

Guion PURO TTS: `bastida_07_proteinas_HEYGEN.txt` (con tags v3, 23,3k) · `bastida_07_proteinas_SINTAGS.txt` (sin corchetes, 23,0k / 4.407 palabras → ~20-22 min). v2 (24-ago): CTA reescrito con el contenido REAL de doctorbastida.com + lámina nueva del Botiquín.
**La voz (.wav) y el avatar los genera EL CREADOR con este guion.** El .wav que entregue es el AUDIO MASTER — no regenerar voz en el PASO 2.

### Proteínas

- **SÍ (dan de comer al músculo sin ensuciar la sangre):** **CLARA DE HUEVO** (toda la proteína buena en la clara, casi todo el fósforo en la yema → "muchas claras, poca yema") · **PESCADO BLANCO** (merluza/lenguado/tilapia; al horno o hervido, nunca rebozado/congelado en bastones; 2-3 veces por semana) · **LENTEJAS REMOJADAS** (la humilde/barata; remojo 8h → **tirar el agua** → hervir en agua limpia; fósforo vegetal se absorbe ~la mitad).
- **NO (cargan el filtro):** **FIAMBRE/EMBUTIDOS** (sal + fosfatos AÑADIDOS, absorción casi 100%) · **CARNE ROJA a diario + el jugo/caldo concentrado** (la más ácida; cuanto más cocida, más creatina convertida → el caldo es creatinina casi pura) · **BATIDO DE PROTEÍNA EN POLVO** ← **giro final**: la que le recomendaron JUSTAMENTE por su edad para no perder músculo. Cierra el loop del cold-open.

### Villano central (NUEVO — no repite potasio de #4, fosfatos de #5, ni el puñado de #6)

**LA CENIZA.** La creatinina ES el residuo del músculo y de lo que come. Analogía madre: **la proteína es la leña del fuego, y no toda la leña deja la misma ceniza** — una arde limpia, la otra le deja la chimenea negra de hollín y le tapa el tiraje. La ceniza son tres cosas: **fósforo (sarro en las arterias + roba calcio del hueso) · sal (presión) · acidez (el riñón compensando todo el día)**.
Sub-temas propios de este video: (a) **el mito peligroso de CORTAR la proteína** → el cuerpo se come su propio músculo y manda MÁS ceniza (protege contra sarcopenia, es lo más honesto del guion); (b) **el bife de anoche aparece en el análisis de hoy** (carne muy cocida y caldo suben la creatinina medida → cena liviana la noche previa al análisis) = dato regalado, alto valor percibido en el minuto 6.

### Regla de oro accionable (el "dé vuelta el envase" / "¿cuchara o mano?" de este video)

**Dos preguntas frente al plato:**
1. **"¿Entra en la PALMA de mi mano?"** — la palma sin dedos, grosor del meñique, en cada comida principal. **LA PALMA, NO EL PLATO.**
2. **"¿Esto se echaría a perder en tres días en la heladera?"** — el pescado se pudre, el huevo se pudre, las lentejas se ponen feas. El fiambre dura 3 meses y el polvo 2 años. **Si no se pudre, es un paquete de fósforo con sabor a jamón.**

### Arquitectura de retención

Loop grande abierto en el cold-open (¿cuál proteína "sana recomendada para su edad" es la peor? = el batido) que NO se cierra hasta el final · miedo↔alivio (diálisis → "respire, no estamos ahí") · latigazo/alerta cada pocas frases · frame aliado/traidor · dato regalado del análisis a mitad de camino · las 2 preguntas repetidas como estribillo (callback en el fiambre y en el cierre) · semáforo visual · callback final.

### Beats para el PASO 2 (mapeo componente ↔ guion — anclar contra el Whisper del avatar)

1. Cold-open loquísimo → **RenalCarousel** 6 tarjetas con `verdicts` SÍ/NO + `splitAt` + candados + `teaseIndex` en el BATIDO.
2. "diálisis… respire" → **FearToCalm**.
3. "Soy el doctor Bastida…" → **PresenterIntro**.
4. "la creatinina es CENIZA" / el filtro → **CreatininaScene** (sube) + b-roll riñón/análisis.
5. **La leña y la chimenea** → microescena 2.5D NUEVA (dos leños: uno arde limpio, el otro deja hollín) — candidata a componente firma del video.
6. Fósforo/sal/acidez → reusar `bas5_broll_sarro`, `bas5_broll_huesos` + b-roll arteria/picazón.
7. "dejar la proteína = comerse el propio músculo" → microescena/StatTag (músculo que se consume → flecha de creatinina que SUBE).
8. "el bife de anoche en el análisis de hoy" → **StatTag** + b-roll tubo de sangre/plato de carne.
9. **Regla de oro** → **HandUnderline** sobre "la palma, no el plato" + microescena PALMA (mano con la porción) + placa "¿se pudre?".
10. SÍ 1/2/3 → **ChapterScene** configs NUEVAS `clara`, `pescadoblanco`, `lentejas` (agregar config al motor, NO reescribirlo) + ills recortadas.
11. **LÁMINA A** — "Las 3 seguras" (foto + preparación + porción exacta) → hold ≥6s, "sáquele una foto".
12. NO 1/2/3 → tratamiento rojo + `TraidoraTag`; fiambre → microescena etiqueta/fosfatos; batido → **el reveal grande** (pote con etiqueta linda → se abre y cae la carga).
12.bis **LÁMINA B — EL BOTIQUÍN TRAICIONERO** (inmediatamente después del batido): grilla catálogo con fotos de pastillas/frascos/potes/hierbas + veredicto corto de cada uno → *"repaso veintisiete productos de farmacia y dietético"*, hold largo. Es el PUENTE al bono del método.
13. **LÁMINA C — EL SEMÁFORO** de las 6 proteínas (verde: clara/pescado/lenteja · amarillo: carne roja medida · rojo: fiambre/batido) → formato literal del producto, hold largo.
14. Don Aníbal (71, batido + sánguche de jamón) → b-roll paciente + **CreatininaScene que BAJA** (pago miedo→alivio).
15. 4 señales → **AlertSignalsScene** (cierra con "si reconoce 2 o más, consulte a su médico").
16. CTA → **QrCtaScene** con `renal/bas_qr_bastida.png` (**doctorbastida.com**, ⛔ NO el QR de Federer) + **TestimonialScene** **Norma de Puebla** ("el reto de la palma") + fotos gpt-image-2 LOW.
17. Recap + cierre del loop (el batido) → **FoodVerdictScene** recap SÍ/NO.

### Reglas respetadas

- Primera línea = el título en versión loquísima (regla #1 del canal). ✅
- Medidas/porciones exactas → van también a la DESCRIPCIÓN. Sin precio ni URL en voz. ✅ Nunca "gratis" (el método es de PAGO).
- Claims con cuidado: "puede ayudar a aligerar la carga", "consulte a su médico/nefrólogo"; nada de curar ni revertir diálisis. Caveat explícito: ERC avanzada / proteína ya indicada por su médico / diabetes / potasio alto → autorización profesional. ✅
- Nombres NUEVOS (no repetir): paciente **don Aníbal** (≠ Ramón #6, ≠ Alfredo #5), testimonial **Norma de Puebla** (≠ Rosa Guadalajara, Marta México, Elena Medellín). ✅
- El batido de proteína se trata con respeto: no se manda a tirarlo, se manda a consultarlo con la etiqueta en la mano. ✅

### Láminas (páginas de la guía) — gpt-image-2 low en BATCH, SIN texto dentro de la imagen

(detalle completo y actualizado en la sección CTA de abajo — son 4: A las 3 seguras · B el Botiquín de 27 productos · C el Semáforo · D opcional palma vs. plato)

---

## ★ CTA + EMBUDO (actualizado 24-ago-2026 — leído de la landing REAL)

**QR = `https://doctorbastida.com`** (decodificado del PNG del creador `Downloads/qr_drbastida_cuadrado.png`). Asset ✅ en `public/renal/bas_qr_bastida.png` + `public_bastida/renal/`. ⛔ NO usar `bas_qr_federer.png`.

**Producto (leído en la landing):** *El Método Renal Completo* — USD 47 (valor regular 311), pago único, PDF, garantía 7 días, actualizaciones de por vida.
- **El Semáforo Renal** — 300 alimentos de la A a la Z en verde/amarillo/rojo, **porción exacta** + **columna aparte para diabéticos e hipertensos**.
- **90 Días para Bajar la Creatinina** — plan día por día, 13 semanas, hidratación e ingesta proteica según edad, señales de alerta.
- **El Botiquín Traicionero** — **27 pastillas, hierbas y suplementos** comunes revisados uno por uno (exclusivo del combo). ⭐ Es el bono que MEJOR pega con este video: el villano #3 es el batido de proteína, o sea un suplemento.
- Bonos: **Su Análisis Traducido** · 21 Recetas Renales de Una Sola Olla · La Lista del Supermercado · Guía del Cuidador · El Cuaderno del Riñón.

⛔ En voz: NUNCA precio, NUNCA URL, NUNCA "gratis". Los argumentos que SÍ van hablados: semáforo de ~300 alimentos con porción + columna para diabéticos/hipertensos · plan de 90 días hasta el próximo análisis · **el botiquín de los 27 productos** · su análisis traducido.

### ⭐ LÁMINAS = PÁGINAS DE LA GUÍA (técnica de oro — gpt-image-2 **low**, siempre en **BATCH**, SIN texto dentro de la imagen; los rótulos por HTML del kit, tag de esquina `PÁGINA · LA GUÍA COMPLETA`)

Las 4 están YA cableadas al guion (el narrador las nombra):
1. **LÁMINA A — "Las 3 seguras"** (tras las reglas de uso): grilla 3 columnas con foto de claras revueltas / merluza al horno / guiso de lentejas + cómo se prepara + porción exacta. Beat: *"esta lámina no la armé para el video… es una de las páginas de la guía"*.
2. **LÁMINA B — "El Botiquín Traicionero"** (justo después del batido de proteína): grilla densa tipo catálogo con fotos de pastillas/frascos/potes/hierbas + textos cortos de veredicto. Beat: *"repaso veintisiete productos de farmacia y dietético"* → hold largo, es el puente directo al bono. **NUEVA, no existía en videos anteriores.**
3. **LÁMINA C — "El Semáforo"** (recap SÍ/NO): las 6 proteínas en verde/amarillo/rojo. Beat: *"así, exactamente así, tengo ordenados casi trescientos alimentos, de la A a la Z"* → hold ≥6s, "sáquele una foto".
4. **LÁMINA D (opcional) — "La palma vs. el plato"** en la regla de oro.

### QR explicado para +60 (ya escrito en el guion, paso por paso)
Uno: agarre el teléfono. Dos: abra la cámara (no hace falta instalar nada). Tres: apunte al cuadradito y quédese quieto dos segundos → aparece un cartelito arriba, tóquelo. + "si me mira desde ese mismo teléfono, el enlace es el primero de la descripción" + "si le da lío, llame a un hijo o a un nieto, son diez segundos". Componente: **QrCtaScene** con `renal/bas_qr_bastida.png` (⚠️ pisar el default "Su guía completa, gratis" → wording neutro, el método es de PAGO).
