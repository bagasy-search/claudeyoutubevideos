# KIT de componentes (no se programa nada: se eligen y se llenan en `vlog/<slug>/ov.json`)

Cada entrada de `ov.json`: `{"c": "<Componente>", "frase": "<3-8 palabras EXACTAS del guion>", "dur": <segundos 4-12>, "props": {...}}`.
El componente entra cuando el protagonista dice esa frase. `img` = **id de un plano** de `planos.json` (su foto se muestra como polaroid):
elegí planos cuya foto muestre EXACTAMENTE lo que dice el pie. Los límites de caracteres los controla `fab.py ov`.
Reglas: uno cada ~50 s (15 min: 18-26 · 30 min: 36-44) · ≥5 tipos Fab distintos · cada Fab máximo 3 por cada 15 min de video · nunca en el minuto 1 (salvo ClVideoRef ≤2 s) ·
nunca dentro de una ventana de avatar · ≥3 s entre uno y otro. Textos en el IDIOMA DEL VIDEO (español neutro con TÚ, o inglés si el canal es en inglés), cortos, sin punto final. Canal en inglés: nunca 'free' ni precios del libro.
Muestras de cómo se ven: `vlog/fab/kit/*.jpg` (no hace falta mirarlas).

| Componente | Para qué (usalo cuando el guion…) | props (límite de caracteres) |
|---|---|---|
| FabSiNo | contrasta lo que NO hay que hacer con lo que SÍ | `no:{img,txt≤28}`, `si:{img,txt≤28}`, `title?≤24` |
| FabPasos | explica un procedimiento de 2-4 pasos | `pasos:[{img,txt≤22}]` (2-4), `title?≤26` |
| FabDato | da UN número para recordar (cantidad, días, minutos, metros) | `num≤6` ("10", "3-4"), `unidad?≤14`, `txt?≤30`, `img?`, `alerta?` (rojo) |
| FabAltura | dice a qué altura va algo / hasta dónde llega alguien | `marcas:[{cm,txt≤26,alerta?}]` (1-4), `max?` (cm, 250), `title?≤24` |
| FabCalendario | algo se repite cada N días | `cada` (1-14), `txt?≤18`, `title?≤14`, `dias?` (28) |
| FabPrecio | compara lo que cuesta comprado vs hecho en casa | `tienda:{txt≤34,p≤9}`, `casa:{txt≤18,p≤9,items?:[{t≤16,p≤7}]}`, `nota?≤34` |
| FabCiclo | describe un ciclo que se repite (por qué vuelve la plaga) | `etapas:[{img?,txt≤18}]` (3-5), `centro?≤14`, `title?≤24` |
| FabRuta | cuenta por dónde llega la plaga (y dónde se la corta) | `bicho`: mosca·cucaracha·raton·hormiga·mosquito, `desde:{img,txt≤24}`, `hasta:{img,txt≤24}`, `corte?≤24` |
| FabMapa | ubica lugares de la casa (dónde revisar, dónde entra) | `pins:[{lugar,txt≤14}]` (2-6), `hechos?` (cuántos reciben ✓ en orden), `foco?` (índice que late rojo), `title?≤22`, `note?≤28` |
| FabAntesDespues | muestra el resultado (mismo lugar antes/después) | `antes` (img), `despues` (img), `nota?≤30` |
| ClVideoRef | nombra el video anterior o el próximo | `thumb` (archivo en public), `title≤44`, `tag?` ("VIDEO ANTERIOR"/"PRÓXIMO VIDEO"), `next?` |
| ClQRCard | el regalo o el Manual con su QR | `qr`, `cover?` (archivos), `text?≤30`, `kicker?≤28` |
| ClBookPage | "está en la página N del Manual" | `page` (archivo), `pageNo?`, `stamp?≤28` |
| ClCheck | lista de 2-4 cosas para revisar (la hoja del CTA) | `title≤40`, `items:[txt≤40]` (2-4) |

`lugar` de FabMapa: puerta, puerta_patio, ventana_cocina, pileta, heladera, mesada, cocina, comedor, sala, ventana_sala, bano, inodoro, rejilla, dormitorio, ventana_dormitorio, lavadero, garaje, patio, desague, techo.

## Ejemplos (copiá la forma)
```json
[
 {"c":"FabRuta","frase":"y la mosca sigue ese olor","dur":8,"props":{"bicho":"mosca","desde":{"img":"gr10","txt":"el desagüe del patio"},"hasta":{"img":"s001","txt":"tu comida"},"corte":"limón en la ventana"}},
 {"c":"FabPasos","frase":"Cortas un limón por la mitad","dur":9,"props":{"title":"El limón, paso a paso","pasos":[{"img":"li4","txt":"medio limón"},{"img":"li1","txt":"10 clavos de olor"},{"img":"li2","txt":"en cada ventana"}]}},
 {"c":"FabDato","frase":"cada tres o cuatro días","dur":6,"props":{"num":"3-4","unidad":"días","txt":"y se cambia el limón","alerta":true}},
 {"c":"FabAltura","frase":"la cinta va colgada alta","dur":8,"props":{"title":"Dónde va la cinta","max":250,"marcas":[{"cm":60,"txt":"Bruno llega hasta aquí","alerta":true},{"cm":210,"txt":"la cinta, arriba de todo"}]}},
 {"c":"FabMapa","frase":"revisa estos cuatro lugares","dur":10,"props":{"title":"Dónde entran","note":"revisa estos 4","pins":[{"lugar":"ventana_cocina","txt":"ventana"},{"lugar":"puerta_patio","txt":"puerta"},{"lugar":"pileta","txt":"fregadero"},{"lugar":"desague","txt":"desagüe"}],"hechos":3,"foco":3}},
 {"c":"FabSiNo","frase":"en la cocina no se usa aerosol","dur":7,"props":{"title":"En la cocina","no":{"img":"s002","txt":"aerosol junto a la comida"},"si":{"img":"s010","txt":"limón con clavos"}}}
]
```
