# PLAN v2 — ahnight ("Life 40,000 Years Ago") · segunda pasada

Mismo máster de audio (692,3 s, 20.768 cuadros). Todo anclado por frase en `vlog/ahnight/cues.json`.
Kit nuevo en `src/ah/` (reutilizable para "Before Us"). 3D pre-renderizado local con GPU.

## Set-pieces (segundo exacto → qué reemplaza → cómo se ve)

| # | t | reemplaza | set-piece |
|---|---|---|---|
| 1 | 0:00–0:26 | paisaje + puerta + globo | **HOOK mini-película**: timelapse real de puesta de sol acelerado a negro (rampa) → ojos que brillan en el valle (IA+agnes) → golpe de pedernal en macro (IA+agnes, sparks) → el fuego prende y el título `WHAT DID THEY DO ALL NIGHT?` se arma con BRASAS que suben (EmberType). Sonido: viento → silencio → golpe de pedernal → whoosh del fuego |
| 2 | 0:17 | Globe3D | **IceAgeEurope3D**: Europa con capa de hielo escandinava y costa baja (mar −80 m), las luces de hoy se apagan, bucea hasta el valle y termina en la brasa del campamento (transición agnes al plano del fuego) |
| 3 | 10 capítulos | NightClock (arco chico) | **SkyClock**: cielo a pantalla completa que ROTA (star-trails procedurales sobre cielo real), la luna avanza por su arco, la hora GIGANTE proyectada/tallada con luz de fuego sobre la pared de caliza; swell + golpe grave. Sin reloj chico en la esquina |
| 4 | 0:40 · 1:37 · 2:17 · 4:57 | Counter sobre negro | **EmberNumber**: el número se arma con chispas que suben de fuego REAL (18 MIN · 20–30 MIN · 1,000,000 YEARS · −11 to −14 °C con escarcha que avanza sobre la imagen) |
| 5 | 1:59 · 3:02 · 7:19 | Counter/StudyCard/Words | **OchreWall**: se pinta en OCRE sobre la pared de la cueva con la luz del fuego parpadeando: 9 palotes (Neandertales), "174 conversations", "NO WORD FOR INSOMNIA" |
| 6 | 3:14–3:36 | TalkBars ×2 | **ShadowPlay**: sombras chinas en la roca. DÍA: siluetas que discuten/cuchichean (31 % · 34 % · 6 %); NOCHE: la silueta de la anciana y un león/caballo de sombra que corre → "81 % STORIES" en ocre |
| 7 | 7:04 · 7:40 | SleepBars + SentinelRing | **Camp3D** (maqueta cenital three.js, 12 cuerpos bajo pieles alrededor del fuego): en 7:04 se van acostando 3,3 h después del atardecer con el cielo girando; en 7:40 cada despierto se enciende en ámbar y corre el contador → cae a 18 MIN |
| 8 | 9:37 | MoonTally | **BoneMoon**: la placa real de Abri Blanchard / hueso tallado en macro, cada muesca se ilumina y la fase de la luna correspondiente aparece encima; la luna real pasa detrás |
| 9 | 1:00 · 4:13 · 6:29 · 8:12 · 11:25 | YouThem collage | **MatchCut** con UN personaje moderno generado (mismo hombre ~30, mismo departamento, luz azul de pantalla): cara iluminada por el celular ↔ cara del cazador al fuego; interruptor ↔ chispa de pedernal; celular en la cama ↔ pieles; despertador ↔ alba. Wipe por el borde de una llama |
| 10 | 10:57 | Recap con ticks | **EmberRecap**: cada verbo (ATE · FED THE FIRE · …) se quema sobre el plano y se vuelve brasa |
| 11 | todo | PlaceStamp chico, ClockBug, créditos al pie | **Title cards grandes** sólo para Chauvet / Lascaux / Border Cave (1 línea, tipografía de cine); fuentes → descripción |

## Elenco (arranca YA)
Juez de identidad (visión) de las ~87 imágenes con elenco contra `cast/face_*.png`; se regeneran los que no coinciden
y los planos con extras en primer plano; clips agnes de esos planos se rehacen (v2.0 + QC).

## Sonido
Capas nuevas: pedernal, whoosh de fuego, aullidos lejanos, latido en la HORA DE LA HIENA, crujido de hueso, stings en
cada revelación, 0,6 s de silencio antes de 18 MIN / 81 % / NO WORD FOR INSOMNIA; música por capítulo (calidez→tensión→alba).

## Transiciones agnes keyframe
Las 7 de la v1 tocan componentes que cambian (reloj, YouThem, anillo, luna) → se rehacen con los cuadros nuevos: 8–10 en total (cupo ≤10).

## Costos estimados
gpt-image ~US$0,6 (≈120 imágenes nuevas: elenco regenerado + hook + personaje moderno + fondos de set-pieces) · agnes gratis · farm gratis.
