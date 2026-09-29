# ⛳ GATE 2 — olcabin (minuto 1 + kit)

Ajustes de ⛳1 aplicados: #5 chowder dicho honesto en voz ("Not Scandinavian, friend, pure logging-camp northwoods, and it's in the book"); #15 bannock también ("Not Scandinavian either, it's straight north-country trail bread"); cena de lutefisk de 1929 SACADA (ahora "Lutheran churches across Minnesota still put on a lutefisk dinner every winter"); "36 layers" y "since 1921" SACADOS (fuente única débil); lefse re-armado con la receta que sí LEÍ (daringgourmet.com: 1¾ lb russets, 5 Tbsp butter, ¼ cup heavy cream, 2 tsp sugar, 1½ tsp salt, 1½ cups flour, chill overnight, plancha caliente ~1 min por lado) y sin atribuir a Sons of Norway.

## Voz real y ASR
- Fish `ole` (temp 0,7 / top-p 0,7, `--keep-tags`, bloques ≤1100, tags con `tag_voz.py`: 46 tags): **máster 1160,6 s = 19,34 min** (17.408 c, 15,0 car/s). Dentro de 18-22: no recorté. 17/17 bloques ok, wall 187 s.
- ASR whisper-1 (Modal bloqueado): 3226 palabras en `_v3/olcabin_asr.json`. Título pagado real a los 26,8 s ("Number 25"); minuto 1 termina justo en "…not one bit. Number 24" (59,8 s).

## Minuto 1 — DIRECTOR segundo a segundo
`vlog/olcabin/DIRECTOR_M1.md`: **26 cortes** (meta ≥20), toma más larga 3,8 s, voz continua (0 silencios), abre con Ole hablando, 6 hablados agnes 2.5 (m1-m6; presupuesto ≤14), 5 detalles de manos con agnes v2.0 (lye, masa, café, huevo, agua fría), WOW en 6,3 s (la cabaña se llena con 25 platos justo cuando dice "twenty-five dishes") y en 16,4-19,8 s (la masa que se rompe = el loop del #1).

## Anclas de los hablados
`GATE2_m1_contact.jpg` (12 anclas K0-K11, gpt-image-2 LOW /edits, Batch, 1088x608, cara 128x192, `plan.light`/`plan.look` de olbeans, cadenas ≤2, Ole con la caja de lata verde, la cafetera y la taza esmaltada azul). Costo real de las 12: **US$0,040**. Identidad estable (barba, franela verde, delantal beige). K6/K7 (de pie junto a la estufa) lo veo levemente más flaco: aceptable, pero si lo querés más parecido las rehago (US$0,003 c/u).
**NO encolé ningún hablado** (esperando tu OK de anclas). Los tramos de audio de m1-m6 ya están cortados de los tiempos del ASR en `vlog/olcabin/tramos/`.

## Componentes propios (`src/olcabin/`) — todos con texto por props
| Componente | 3D real | Pago del guion |
|---|---|---|
| **CabinCutaway3D** (three.js) cabaña de troncos en corte con estufa, vigas, mesa y estante; 25 platos aparecen (fill por keyframes) | **SÍ** | hook 6,3 s "twenty-five dishes"; mapa de origen "same table" (7:49); cierre #1 con los 25 platos |
| **TinRecipeBox3D** (three.js) caja de lata: tapa con bisagra, fichas asoman, una sube | **SÍ** | hook 2,5 s y 24,9 s "the bottom of the box"; cierre (se cierra) |
| **CabinRecipeBook3D** (three.js, LorCookbook3D re-temático madera) recetario que pasa páginas hasta la receta | **SÍ** | #11 "first printed hotdish, 1930" |
| **RecipeCountdown** placa de lata esmaltada 25→1 | no | cada número; #1 grande |
| **GrandmaCard** ficha manuscrita con cinta, tinta que se escribe | no | fattigmann, mojakka, leipäjuusto |
| **OriginMap** mapa de pergamino con 6 rutas → MN/WI | no | egg coffee, mapa 7:49, mojakka, booyah |
| **WhyTheyStopped** tres objetos que se apagan (hierro, caldero, mesa) | no | "por qué dejaron de hacerse" 11:47 |
| **OleBookPage / OleCTA / OleRuleCard / Overlays** (copiados de olbeans, para páginas REALES p.60/59/23/43/34 y el CTA con QR) | (OleCTA tiene libro 3D CSS) | 5 páginas del libro + CTA a 1:29 |
Pendientes a construir después del OK: la grilla de páginas reales renderizadas de book.pdf, el QR en cuadro real y un caldero gigante para booyah (extra 3D en `CabinCutaway3D`-style).

## Capturas
`GATE2_kit_stills.jpg` y `GATE2_kit_stills2.jpg` (npx remotion still): cutaway en 3 momentos (vacío → medio → lleno), caja de lata abierta con ficha subiendo, recetario 3D, placa "18", ficha manuscrita, mapa de origen con las rutas. Bancos completos en `out/kit/*.png`. tsc del kit limpio (`tsconfig.olcabin.json`).

## Costos hasta ahora
Voz Fish $0 · anclas $0,040 · ASR whisper-1 ≈ $0,12 · stills $0. Total ≈ US$0,16.

## Aviso del ajuste (3)
Con la voz real NO pasa de 22 min (19,34), no recorté.

## Lo que sigue tras tu OK
1) Encolar los 6 hablados m1-m6 en la cola única de agnes. 2) Detalles v2.0 (5). 3) Avatar RunPod (ventanas visibles ≈25 %). 4) Stock Pexels + archivo real con licencias + hoja de contactos. 5) Anclas/imagenes BI en Batch. 6) Timeline y montaje completo.
