# ⛳ GATE 1 — olcabin (autopsia + guion)

**Entregables en disco (worktree `D:/Proyectos/video2-wt/olcabin`):**
`vlog/olcabin/AUTOPSIA.md` · `guiones/olcabin.txt` (LIMPIO, LF, 17381 caracteres) · `guion_filmado.txt` (qué se ve por frase) · `research_verdad.md` (fuente de cada dato duro) · este `GATE1.md`.

## Medición de la voz
Bloque de prueba (2 primeros párrafos, 1038 c) con Fish `ole` (temp 0,7 / top-p 0,7, `--keep-tags`): **67,6 s = 15,35 car/s** (esperado 66,1). Guion: 17381 c -> **19.0 min** (dentro de 18-22). Se recalcula con el máster real (Fish puede cortar con exit 0: se verifica la duración).

## Mapa de minutos (a 15,35 car/s + 0,4 s entre párrafos)
| # | Inicio | Dur | Chars | Bloque |
|---|---|---|---|---|
| P00 | 0:00 | 27 s | 408 | HOOK |
| P01 | 0:26 | 33 s | 500 | #25 Egg coffee |
| P02 | 0:59 | 29 s | 445 | #24 Fattigmann |
| P03 | 1:29 | 25 s | 390 | CTA (libro) |
| P04 | 1:55 | 29 s | 442 | #23 Pickled herring |
| P05 | 2:24 | 30 s | 455 | #22 Fruit soup |
| P06 | 2:54 | 20 s | 302 | Respuesta comentarios + loop lejía |
| P07 | 3:14 | 27 s | 420 | #21 Krumkake |
| P08 | 3:42 | 32 s | 487 | #20 Leipäjuusto |
| P09 | 4:14 | 26 s | 396 | #19 Nisu |
| P10 | 4:40 | 43 s | 657 | #18 Rice porridge (LIBRO p.60) |
| P11 | 5:23 | 42 s | 638 | #17 Dried-apple pie (LIBRO p.59) |
| P12 | 6:05 | 35 s | 541 | #16 Potato sausage |
| P13 | 6:41 | 36 s | 548 | #15 Bannock (LIBRO p.23) |
| P14 | 7:17 | 31 s | 480 | #14 Kringle |
| P15 | 7:49 | 37 s | 565 | Mapa de origen + loop error #1 |
| P16 | 8:26 | 41 s | 637 | #13 Sausage & sauerkraut (LIBRO p.43) |
| P17 | 9:08 | 29 s | 444 | #12 Mojakka |
| P18 | 9:37 | 35 s | 538 | #11 Wild rice hotdish |
| P19 | 10:13 | 37 s | 563 | #10 Swedish meatballs |
| P20 | 10:50 | 27 s | 422 | #9 Lanttulaatikko |
| P21 | 11:17 | 29 s | 441 | #8 Pannukakku |
| P22 | 11:47 | 23 s | 349 | Por qué se dejaron de hacer (opinión) |
| P23 | 12:10 | 41 s | 625 | #7 Lutefisk (semi-héroe) |
| P24 | 12:51 | 28 s | 424 | #6 Limpa |
| P25 | 13:19 | 34 s | 523 | #5 Fish chowder (LIBRO p.34) |
| P26 | 13:53 | 56 s | 865 | #4 Rømmegrøt HÉROE |
| P27 | 14:50 | 66 s | 1018 | #3 Pasty HÉROE |
| P28 | 15:57 | 64 s | 980 | #2 Booyah HÉROE |
| P29 | 17:01 | 86 s | 1315 | #1 Lefse HÉROE (pago del hook) |
| P30 | 18:27 | 33 s | 503 | Cierre + pregunta |

- **Título pagado:** 0:26 (empieza "Number twenty-five"; el molde lo paga a los 0:55).
- **CTA:** P03 a 1:29, UNA vez, ~25 s (tono de VIDEO_CTA_Y_DESCRIPCION.md; sin precio, sin URL dicha, sin "free"). Pantalla: OleCTA con portada + QR real ~8 s.
- **Pagos visuales seguidos** tras el CTA: #23 → #22 → comentarios → #21 (cada ~30 s un plato con su plano).
- **Open loops (cada 2-3 min):** hook -> (a) lejía de #7 [cierra 12:10], (b) el único error de #1 [cierra 17:01]; 2:54 re-planta la lejía; 5:23 planta "porridge que pone su propia manteca" [cierra 13:53]; 7:49 re-planta el error de #1; 10:13 planta "#3 mineros" [cierra 14:50]; 11:47 "por qué dejaron de hacerse" (opinión de Ole).
- **La #1 (lefse, 86 s)** cierra el loop del hook con receta completa (proporciones Sons of Norway) y el error real: enrollar la masa tibia la pega y rompe.

## Cruce con la guía (build/book.pdf, 69 págs; el folio impreso == número de página del PDF)
Se nombran "that one's in the book" SÓLO estas 5 (Ole las cocina así en el libro, medidas coinciden con el libro):
| En el video | Receta del libro | Página real |
|---|---|---|
| #18 Rice porridge | Rice Pudding | **60** (y es una de las 2 veces "this is a page from the book") |
| #17 Dried-apple pie | Dried-Apple Skillet Pie | **59** |
| #15 Bannock | Bannock (Pan Bread) | **23** |
| #13 Sausage & sauerkraut | Sausage & Sauerkraut Skillet | **43** (2ª vez "this is a page from the book") |
| #5 Fish chowder | Salt-Pork Fish Chowder | **34** |
La masa del pasty (#3) usa las cantidades de la masa de pie del libro (p.59) pero NO se dice que el pasty esté en el libro. Las otras 20 no se insinúan. El add-on (Dutch oven) NO se nombra. Cierre: menciona esas 5 y "the link's in the description".

## Los 25 (cuenta regresiva)
25 egg coffee · 24 fattigmann · 23 pickled herring · 22 fruit soup · 21 krumkake · 20 leipäjuusto · 19 nisu · 18 rice porridge · 17 dried-apple pie · 16 potato sausage · 15 bannock · 14 kringle · 13 sausage & sauerkraut · 12 mojakka · 11 wild rice hotdish · 10 Swedish meatballs · 9 lanttulaatikko · 8 pannukakku · 7 lutefisk · 6 limpa · 5 fish chowder · 4 rømmegrøt · 3 pasty · 2 booyah · 1 lefse.
Héroes (receta completa + pago visual): #4, #3, #2, #1 y #7 (humor, 41 s). Origen: Noruega 5, Suecia 4, Finlandia 6, Dinamarca 1, Bélgica 1, Cornualles 1, Ojibwe/voyageur 1, MN/WI 6 (hotdish, egg coffee, mojakka, etc.).

## Capas de honestidad
Ole = personaje, ninguna familia/fecha propia inventada; folklore marcado ("the story goes", "I can't prove it"); "por qué se dejaron de hacer" = opinión de Ole. Sin promesas de salud. Sin marcas (la tienda de East Lake St no se nombra). Datos duros en `research_verdad.md`; hay 2 páginas primarias que dieron 429/timeout (Star Tribune, MPR-lutefisk) y se apoyan en resúmenes de búsqueda + otras fuentes.

## Cosas que necesito de vos / decisiones
1. OK del guion (o qué cambiar). Cambio posible: #5 chowder no es escandinava; la dejé porque es la 5ª página real del libro. Si preferís no forzarla, la cambio por otra escandinava y quedan 4 páginas.
2. Cortes/min del molde no pudieron medirse (yt-dlp 403); no bloquea nada.
3. Aviso de infraestructura: C: y D: con ~19-20 GB libres; hago todo pesado en D:/rtmp/olcabin.
