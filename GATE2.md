# ⛳ COMPUERTA 2 — olpots: minuto 1 + componentes 3D

Voz completa lista: master **978,9 s = 16:19** (14 bloques ≤1100 car, `--keep-tags`, temp 0,7 / top-p 0,7). ASR: **Modal está bloqueado (spend limit del workspace)** → whisper-1 con `curl`-chunk 600 s; una frase que Whisper se comió (PTFE, 800-830 s) la recuperé re-transcribiendo ese tramo; alineación difflib global ratio 0,979 (0 huecos ≥12 palabras). Momentos REALES: lista de las 5 ollas 0:23 · criterio 1:00 · CTA 1:20-1:46 · olla 1 1:46 · olla 2 5:38 · olla 3 8:13 · olla 4 10:27 · olla 5 12:06 · los 3 "nunca" 13:09-15:40 · cierre 15:40.

## 1. DIRECTOR del minuto 1 (segundo a segundo) — `vlog/olpots/dir.mjs`
**24 tomas = 23 cortes en 62,7 s, toma máxima 3,78 s**, abre con Ole HABLANDO (0,00). Anclado al ms real (difflib): cada corte cae 40 ms antes de la palabra.

| # | seg | dur | tipo | qué se ve | dice |
|---|---|---|---|---|---|
| 1 |  0.00- 3.48 | 3.48 | AGNES 2.5 hablado (Ole) | Ole en su cabaña, pulgar hacia la repisa de ollas detrás | Well, now. Look at that shelf, friend. |
| 2 |  3.48- 5.74 | 2.26 | ARCHIVO real (PD) | foto de archivo: cocina de campamento maderero | I cooked for loggers for forty years, |
| 3 |  5.74- 7.74 | 2.00 | AGNES 2.5 detalle + foley | mano de Ole recorre las ollas de la repisa (foley hierro) | and every pot I ever trusted would |
| 4 |  7.74-10.74 | 3.00 | COMPONENTE | repisa 3D: las 5 ollas caen y giran, números 1-5 | fit right there. Five pots. That's it. |
| 5 | 10.74-13.56 | 2.82 | AGNES 2.5 hablado (Ole) | Ole asiente con la taza, sonrisa | And I'd buy every one of them again tomorrow. |
| 6 | 13.56-15.32 | 1.76 | foto gpt-image-2 + leve movimiento | 3 ollas baratas en la mesada (antiadherente, aluminio fino, cerámica vidriada), push-in | I'll also tell you the three I |
| 7 | 15.32-18.64 | 3.32 | AGNES 2.5 hablado (Ole) | Ole serio, dedo levantado | would never buy, not if you handed them to me. |
| 8 | 18.64-20.36 | 1.72 | foto gpt-image-2 + leve movimiento | alacena con la sartén antiadherente colgada | One of those is sitting in your |
| 9 | 20.36-21.38 | 1.02 | STOCK real Pexels | mano toma una sartén de la cocina | kitchen right now. |
| 10 | 21.38-23.12 | 1.74 | AGNES 2.5 detalle + foley | la mano empuja la taza esmaltada hacia cámara | I'd bet the coffee on it. |
| 11 | 23.12-26.52 | 3.40 | AGNES 2.5 hablado (Ole) | Ole cuenta hasta 5 con los dedos | So here's the deal. I'll name all five, quick, |
| 12 | 26.52-27.94 | 1.42 | foto gpt-image-2 + leve movimiento | libreta de cocinero, el lápiz va a escribir "1." | so you know where we're |
| 13 | 27.94-30.18 | 2.24 | STOCK real Pexels | Dutch oven de hierro al fuego | headed. A cast iron Dutch oven. |
| 14 | 30.18-32.42 | 2.24 | STOCK real Pexels | sartén de hierro friendo | A twelve inch cast iron skillet. |
| 15 | 32.42-35.88 | 3.46 | foto gpt-image-2 + leve movimiento | olla enlozada moteada con borde azul | A big enamel stockpot, the speckled kind. |
| 16 | 35.88-38.88 | 3.00 | STOCK real Pexels | olla de acero inoxidable hirviendo | A stainless steel stockpot with a thick bottom. |
| 17 | 38.88-42.56 | 3.68 | STOCK real Pexels | cacerolita con tapa | And one little heavy saucepan with a lid that fits. |
| 18 | 42.56-44.20 | 1.64 | COMPONENTE | repisa 3D: las 5 ollas caen y giran, números 1-5 | That's the whole shelf. |
| 19 | 44.20-46.84 | 2.64 | AGNES 2.5 hablado (Ole) | Ole se inclina sobre la mesa, palma plana | What matters is the why, so stay with me, |
| 20 | 46.84-50.36 | 3.52 | STOCK real Pexels | persona mirando ollas en una tienda | because the why will keep you from wasting money at the store. |
| 21 | 50.36-52.86 | 2.50 | AGNES 2.5 hablado (Ole) | Ole niega con la mano: sin marcas | I won't name a brand, either. |
| 22 | 52.86-55.44 | 2.58 | foto gpt-image-2 + leve movimiento | pasillo de ollas de un supermercado (push) | Brands change every few years. |
| 23 | 55.44-58.92 | 3.48 | COMPONENTE | 3D: mapa de calor de la base (aluminio fino vs inox base gruesa vs hierro) | What a pot is made of, and how thick it is on the bottom, |
| 24 | 58.92-62.70 | 3.78 | AGNES 2.5 hablado (Ole) | Ole cruza los brazos: "eso no cambia" | that doesn't change. Here's how I judge a pot. |

- Filmado/real en el minuto 1: 7 hablados de Ole (agnes 2.5-flash) + 2 detalles kf + 6 stock + 1 archivo ≈ 70 % del minuto. Agnes 2.5 en el minuto 1: **9 clips (7 hablados + 2 detalles) ≤ 14**. Sólo las anclas están generadas; **no encolé nada en la cola de agnes**.
- **WOW planificados:** 9,06 s "Five pots" (la repisa 3D: las 5 ollas caen y ruedan los números 1-5, con impactos de hierro sincronizados) · 42,6 s "That's the whole shelf" (la repisa vuelve completa) · 55,4 s "how thick it is on the bottom" (mapa 3D de calor de la base).
- **Sonido, capa por capa:** ambiente de cabaña/estufa continuo (0 silencios) · whoosh 0,2 en cada corte · thud de hierro/esmalte/acero en cada olla que cae (7,84/8,14/8,44/8,74/9,04) · riser corto antes de 13,56 (la promesa de "los tres") · lápiz sobre libreta a 26,5 · foley real bajo la voz en d_shelf y d_mug (pico ≈ −10 dB) · cama folk sintetizada (`music.py`) desde el s 6 a ~−37 LUFS · voz −16 LUFS.

## 2. Anclas de los hablados (agnes 2.5-flash) — `GATE2_m1_contact.jpg`
18 anclas gpt-image-2 (low, 1088x608, Batch, cara 128x192, prompt "fotograma accidental de video común"; LIGHT/LOOK/WHO/KIT literales de olbeans para continuidad; la repisa con las 5 ollas está en el fondo de todas las K, misma cabaña de la ref). K0-K7b = 7 hablados (m1-m7, 2 anclas cada uno, ancla→ancla); D1a/b = detalle d_shelf (manos, sin cara); D2a/b = d_mug. Cadena máxima 3 (límite 15). Costo real: 18 anclas = US$0,058 (≈$0,0032/imagen).

## 3. LISTA de componentes propios (`src/olpots/`, tema madera/lata esmaltada/hierro/libreta; texto sólo por props, en inglés)
| componente | 3D real | pago del guion que resuelve |
|---|---|---|
| **OlePotShelf3D** | ✅ three.js (5 ollas de torno con geometría propia, entorno, fichas y sellos) | la lista de las 5 (9,06 s; 42,6 s), la ficha de cada olla (material · peso · uso) al nombrarla y el cierre con 5 BUY / 3 SKIP (15:40) |
| **OleHeatSpreadMap** | ✅ three.js (color por vértice = temperatura calculada por cuadro + corte de las capas de la base) | «how thick it is on the bottom» (55 s), Dutch oven «heat from every side», inox base sándwich, aluminio fino «scorches» |
| **OleCoalOven3D** | ✅ three.js (Dutch oven de campamento con patas, 8 briquetas abajo, tapa, 16 arriba, ¼ de giro) | el loop de las brasas (2:50 → paga 3:32): regla del diámetro ×2 |
| OleFourQuestions | – (tarjetas de lata esmaltada) | los 4 criterios (1:00) |
| OleBuyChecklist | – (libreta con tildes/cruces a lápiz) | girar en la mesa, golpe de nudillo, óxido vs grieta (3:00, 7:17) |
| OleSeasoningSteps | – (libreta + dial de horno 450 °F) | curado en capas finas (6:50) |
| OleChipMap | – (corte de olla enlozada) | astilla afuera = ok / adentro = retirar (8:56, paga el loop de 7:56) |
| OleTempLadder | – (termómetro, 350/500/660 °F) | antiadherente y el límite del fabricante (13:20) |
| OleLeadCard | – (tarjeta kraft con fuente FDA) | alfarería vidriada de origen dudoso (14:45) |
| OleCostTier | – ($/$$/$$$ relativo, no precio) | «PriceRange» sin dólares (fin de cada olla) |
| OleLesson | – («what forty years taught me», escrita a lápiz) | la línea de aprendizaje de cada olla |
| OleVerdict (sello BUY/SKIP, dentro de OlePotShelf3D y suelto) | – | veredicto de cada olla |
| OleBookPage / OleCTA (copiadas de olbeans, láminas nuevas del libro real) | – | «this is a page from the book»: **p.25** (Dutch oven bread) y **p.12** (pot beans ×4 en stockpot 16 qt); CTA con portada + QR real a 1:20 |
Total: **12 propios (3 en 3D real)** + OleBookPage/OleCTA/RuleCard/Overlays copiados. Páginas del libro ya renderizadas en `public/img/olpots/pagina_p{10,12,25,36,49,50}.png`.

## 4. Capturas del kit renderizado (`npx remotion still`) en `gate2/` (copias en D:/rtmp/olpots/g2/)
`3D_shelf_overview.png` · `3D_shelf_focus_buy.png` (ficha + sello BUY sobre la enlozada) · `3D_heatspread.png` · `3D_coal_oven.png` · más 8 tarjetas 2D en `gate2/cards_sheet.jpg`.

## 5. Estado de assets reales
Pool Pexels 412 clips de 40 queries juzgados con agnes-3.0-flash (147 pasan: on-topic, sin marcas, sin cara inventada). Archivo real: los del canal ya verificados como dominio público (LoC/DPLA/Wikimedia: campamentos madereros de Minnesota) — el par aprobado va a `CREDITOS_archivo.txt`. Todavía NO descargué stock ni generé fotos b-roll (espero tu OK).

## 6. Pregunta / cambios que te pido
- OK de las anclas para que encole los 7 hablados + 2 detalles (9 clips) en la cola de agnes.
- Nota: el molde no permite medir cortes/min; uso 23 cortes en el minuto 1 y ~12/min después.
