# repkit · kit de "Claudio el Repositor"

Componentes de Remotion (1920×1080, 30 fps) para los videos del canal. Código: `src/repkit/Kit.tsx`.
Helpers y paleta: `src/repkit/Rk.tsx`. Ejemplo que lo muestra todo: `src/repkit/Demo.tsx` (composición `Demo`, 120 s).

## Reglas de uso (para quien arma el edl)

- **Tiempos**: todo en **segundos absolutos del video** (los del `words.json` de la voz). Cada componente recibe
  `from` (segundo donde arranca) y `dur` (segundos que vive). Dentro, el tiempo local lo calcula el componente
  (`at(t) = fr(t) - fr(from)`). No hace falta envolverlo en un `<Sequence>`: el componente ya lo hace.
- **Propiedad `t` / `tN` / `tX`**: cada uno es un segundo absoluto que el agente llena con la palabra que lo nombra
  (±0.1 s). Si un `t` cae fuera de `[from, from+dur]`, el beat no se ve: revisar.
- **Imágenes**: rutas relativas a `public/` (ej. `img/repkit/door.png`). Nunca se hardcodea un slug: cada video pasa
  sus propias fotos. El kit no trae fotos: los demos viven en `public/img/repkit/` (release `assets-repkit`).
- **Cara para CommentQ**: `img/rep/face.png` (recorte de la cara de Claudio, 1 para todos los videos).
- **Texto**: todo es prop, en español con tildes y `ñ`. Precios en pantalla = **números de ejemplo** (ver CANAL.md §2).
- **Sin marcas**: ningún componente dibuja marcas ni cadenas. Las etiquetas genéricas (`Arroz blanco`, `OFERTA`) son texto.
- **Duración mínima recomendada**: 5 s. **Máxima**: la del bloque que lo contiene (≤ 12 s en general).
- **Transición**: `SealDoor` termina en blanco (fundido a `tPush + 1.3 s`); el resto corta limpio o usa `CompWrap`-like
  salida por el fundido de su bloque.

---

## 1. SealDoor
Puerta del depósito con la cámara que empuja a través de la ventanita; el sello de goma cae.
- `bg` (string) — foto de la puerta del depósito (`img/repkit/door.png`).
- `from`, `dur` — ventana. Recomendado `dur` 6–8.
- `tStamp` (t0 de la spec: el sello cae aquí). Debe ser ≥ `from + 1`.
- `tPush` — la cámara entra a la ventana; blanco de `tPush + 0.5` a `tPush + 1.3`.
- `label?` — por defecto `"DETRÁS DE LA GÓNDOLA"`.
- `win?` — punto de la ventana en % `[x, y]`, por defecto `[50, 42]`. Ajustar a la foto real.
- Foto necesaria: puerta gris de depósito, ventanita redonda, luz de tubo. Sin personas.
```tsx
<SealDoor from={0} dur={7} bg="img/repkit/door.png" tStamp={1.6} tPush={4.2} />
```

## 2. ShelfTag
Etiqueta de góndola que sale de la etiquetadora, lupa sobre el precio por kilo, círculo rojo.
- `bg` — foto de góndola de frente (`img/repkit/gondola_full.png`).
- `from`, `dur` — recomendado 8–10.
- `at: [x, y]` — centro de la etiqueta en px del lienzo 1920×1080.
- `product` — nombre del producto genérico (ej. `"Arroz blanco"`).
- `price` — precio en pesos (número). Se muestra `$ 1.240`.
- `unitLine` — texto del precio por kilo (ej. `"$ 1.240 el kg"`).
- `tPrint` — la etiqueta sale de la etiquetadora (con flash de click).
- `tLupa` — la lupa llega al `unitLine` y lo agranda ×2.2.
- `tCircle` — el círculo rojo se dibuja alrededor de la etiqueta. Debe ser > `tLupa`.
- `ejemplo?` — chip "EJEMPLO" arriba a la izquierda (por defecto `true`; `false` lo quita).
- Foto: góndola de frente con espacio libre donde cae la etiqueta.
```tsx
<ShelfTag from={7} dur={10} bg="img/repkit/gondola_full.png" at={[960, 470]} product="Arroz blanco" price={1240}
  unitLine="$ 1.240 el kg" tPrint={8} tLupa={9.4} tCircle={11.2} ejemplo />
```

## 3. PerKilo
Dos fotos de producto lado a lado; cada una recibe su etiqueta de precio; el kilo se calcula en pantalla.
- `left`, `right` — `{ img, name, price, grams }`: foto, nombre genérico, precio en pesos, gramos del paquete.
- `tA`, `tB` — caen las etiquetas de precio de la izquierda y la derecha.
- `tCalc` — empieza la cuenta `precio ÷ gramos × 1000` y el número sube hasta el resultado (el de la derecha, +0,35 s).
- `tWin` — el más barato recibe el check verde y el sello `CONVIENE`; el otro se apaga.
- Calcula el kilo con los props: nunca muestra un resultado que no sea `precio / gramos × 1000`. Si empatan, ninguno gana.
- Recomendado `dur` 10–12. Foto: dos paquetes del mismo producto (distinto tamaño), sin marca.
```tsx
<PerKilo from={17} dur={12} left={{ img: "img/repkit/rice_small.png", name: "Arroz 500 g", price: 1240, grams: 500 }}
  right={{ img: "img/repkit/rice_big.png", name: "Arroz 1 kg", price: 2190, grams: 1000 }}
  tA={17.8} tB={18.6} tCalc={19.8} tWin={23.5} />
```

## 4. Ticket
Ticket térmico que se imprime línea por línea sobre una foto de caja; la cámara sigue la línea nueva.
- `bg` — foto de caja (`img/repkit/checkout.png`).
- `from`, `dur` — recomendado 8–10.
- `lines: { txt, amt, t }[]` — cada línea y el segundo en que se imprime. `amt` es texto ya formateado (`"$ 2.190"`).
- `hl?: { idx, t, note }` — resaltador amarillo sobre la línea `idx` (índice en `lines`) en `t`, y una nota a mano roja
  `note` a la derecha (2–3 palabras).
- `head?` — título del ticket (por defecto `"TICKET"`).
- Nota: la spec pedía impresión "hacia arriba"; el papel crece hacia abajo (como sale un ticket real) y la cámara sube
  con la línea nueva. Se puede invertir si el director lo pide.
```tsx
<Ticket from={29} dur={10} bg="img/repkit/checkout.png" lines={[{ txt: "Arroz 1 kg", amt: "$ 2.190", t: 30 }, { txt: "Total", amt: "$ 2.190", t: 36 }]}
  hl={{ idx: 0, t: 37.2, note: "¿lo viste?" }} />
```

## 5. Scanner
Láser rojo barre el producto; al pitido, flash y el display LCD muestra el precio.
- `img` — foto del producto (`img/repkit/scanner_pack.png`).
- `from`, `dur` — recomendado 7–8.
- `tBeep` — pitido (flash blanco y aparece el LCD).
- `price` — precio que muestra el LCD en el pitido.
- `display?: { price, t }` — precio corregido que aparece en `t` (parpadeo antes). Opcional.
```tsx
<Scanner from={39} dur={8} img="img/repkit/scanner_pack.png" price={3400} tBeep={42.5} display={{ price: 3290, t: 44.5 }} />
```

## 6. Lupa
Lupa real (aro, cristal, mango) que viaja sobre una foto y muestra la misma foto a `zoom` veces.
- `bg` — foto de etiqueta/paquete.
- `from`, `dur` — recomendado 8–9.
- `path: { x, y, t }[]` — puntos en px del lienzo y el segundo en que la lupa pasa por cada uno (interpolado con ease).
- `zoom?` — por defecto `2.4`.
- `underline?` — segundo en que se dibuja una raya roja bajo la lupa (la posición es la del último punto de `path`).
```tsx
<Lupa from={47} dur={9} bg="img/repkit/package_label.png" zoom={2.4}
  path={[{ x: 520, y: 300, t: 47.5 }, { x: 1250, y: 520, t: 50 }, { x: 1250, y: 760, t: 52.5 }]} underline={53} />
```

## 7. ShelfHeights
Foto de góndola de frente con bandas de altura (ojos, pies...) con chips; la cámara baja y sube a cada banda.
- `bg` — góndola completa de frente (`img/repkit/gondola_full.png`).
- `from`, `dur` — recomendado 8–10.
- `bands: { label, y0, y1, chip, t }[]` — banda de `y0` a `y1` (px del lienzo), `label` a la izquierda (`"OJOS"`), `chip` a la derecha (`"LO CARO"`), aparece en `t`.
- `camPath?: { t, x, y, s }[]` — cámara: en cada `t` el punto `(x, y)` pasa al centro con escala `s` (ease). Por defecto, cámara fija.
- `scale?` — silueta de persona a la izquierda con la línea de altura de los ojos (por defecto `true`).
```tsx
<ShelfHeights from={56} dur={9} bg="img/repkit/gondola_full.png"
  bands={[{ label: "OJOS", y0: 260, y1: 420, chip: "LO CARO", t: 57 }, { label: "PIES", y0: 760, y1: 920, chip: "LO BARATO", t: 60 }]}
  camPath={[{ t: 56, x: 960, y: 340, s: 1.1 }, { t: 58.5, x: 960, y: 340, s: 1.1 }, { t: 61.5, x: 960, y: 840, s: 1.1 }]} />
```

## 8. OfferPoster
Cartel de oferta amarillo que se pega sobre la góndola; al despegarse revela una hoja blanca donde se escribe la cuenta.
- `bg` — foto de góndola con hueco (`img/repkit/offer_shelf.png`).
- `from`, `dur` — recomendado 9–10.
- `big` — texto grande (`"2x1"`), `small` — banda superior (`"OFERTA"`).
- `tIn` — el cartel llega y se pega (con rebote).
- `tPeel` — el cartel se despega y deja ver la hoja blanca.
- `under: { txt, t }[]` — líneas de la cuenta que se escriben en su `t` (todas ≥ `tPeel`).
```tsx
<OfferPoster from={65} dur={10} bg="img/repkit/offer_shelf.png" big="2x1" small="OFERTA" tIn={65.6} tPeel={69}
  under={[{ txt: "Llevas 2: $ 2.480", t: 69.8 }, { txt: "Pagas 1: $ 1.240", t: 71.2 }]} />
```

## 9. ClockDeal
Reloj de pared que gira de una hora a otra mientras la luz pasa de fluorescente a tarde; chip con el horario.
- `bg` — foto de mostrador (`img/repkit/counter_clock.png`).
- `from`, `dur` — recomendado 6–7.
- `hourFrom`, `hourTo` — horas en decimal (`17.5` = 17:30, `19.5` = 19:30).
- `tSpin` — empieza el giro (dura ~2,5 s).
- `label` — chip final (`"19:30 · REBAJAS"`).
```tsx
<ClockDeal from={75} dur={7} bg="img/repkit/counter_clock.png" hourFrom={17.5} hourTo={19.5} tSpin={76} label="19:30 · REBAJAS" />
```

## 10. Clipboard
Planilla del encargado: lo que escribe aparece como si lo escribiera (de izquierda a derecha), ticks rojos.
- `title` — encabezado en letra a mano.
- `lines: { txt, t, tick? }[]` — cada línea se escribe en `t`; `tick` (opcional) dibuja un tilde rojo al final.
- `bg?` — fondo (por defecto `img/repkit/corkboard.png`).
- `from`, `dur` — recomendado 9–10. Máximo 6 líneas.
```tsx
<Clipboard from={82} dur={10} title="Planilla del encargado" lines={[{ txt: "Yogur: bajar a $ 890", t: 83, tick: 84 }, { txt: "Carne: marcar roja", t: 86 }]} />
```

## 11. CountCard
Tarjeta de ítem: número grande `n` con `/of` chico, la palabra en chip arriba, título abajo; cae con peso en `t`.
- `n`, `of` — número y total (`7`, `17`).
- `word?` — `"ENGAÑO"` (por defecto), `"TRAMPA"`, `"SECRETO"`, `"TRUCO"`, `"OFERTA"`.
- `title` — título del ítem (una o dos líneas).
- `bg` — la mejor foto real del ítem (`img/repkit/aisle.png` en el demo).
- `t` — segundo en que cae (con destello blanco).
- `from`, `dur` — recomendado 5–6.
```tsx
<CountCard from={92} dur={6} n={7} of={17} word="TRAMPA" title="Los precios a la altura de los ojos" bg="img/repkit/aisle.png" t={92.6} />
```

## 12. BeforeAfter
Dos fotos de la misma góndola (antes/después): barrido vertical con borde suave.
- `a` — antes; `b` — después (se revela de izquierda a derecha).
- `tWipe` — empieza el barrido (dura ~1,2 s). `labels?` — `["ANTES", "DESPUÉS"]` por defecto.
- `from`, `dur` — recomendado 6–7. Las dos fotos deben ser de la misma góndola y encuadre.
```tsx
<BeforeAfter from={98} dur={7} a="img/repkit/gondola_empty.png" b="img/repkit/gondola_full.png" tWipe={99} />
```

## 13. Cta
Portada de la guía "Las 40 trampas del súper" en un ángulo, sobre un pasillo desenfocado; flecha con "LINK EN LA DESCRIPCIÓN".
- `from`, `dur` — recomendado 8–9.
- `t` — segundo en que aparece el chip y la flecha.
- `title?` — por defecto `"Las 40 trampas del súper"`.
- `cover?` — imagen de portada ya hecha (si se pasa, reemplaza la portada CSS).
- `bg?` — fondo (por defecto `img/repkit/aisle.png`).
- **Sin QR, sin URL.** Nunca decir "gratis".
```tsx
<Cta from={111} dur={9} t={113} bg="img/repkit/storeroom.png" />
```

## 14. CommentQ
Comentario estilo red social sobre una foto real: avatar de Claudio, nombre, la pregunta.
- `q` — la pregunta (una o dos líneas).
- `t` — segundo en que entra desde la derecha (con resorte).
- `bg?` — foto de fondo (por defecto `img/repkit/aisle.png`).
- `from`, `dur` — recomendado 5–6.
- El avatar usa `img/rep/face.png` (recorte de la cara de Claudio, en `public/img/rep/`).
```tsx
<CommentQ from={105} dur={6} q="¿Y en la carnicería también pasa?" t={105.5} bg="img/repkit/aisle.png" />
```

---

## Imágenes que necesita cada componente (demo)

| Componente | Foto |
|---|---|
| SealDoor | puerta de depósito con ventanita redonda |
| ShelfTag / ShelfHeights | góndola de frente llena (`gondola_full`) |
| PerKilo | dos paquetes del mismo producto, distinto tamaño, sin marca (`rice_small`, `rice_big`) |
| Ticket | mostrador de caja con paquetes (`checkout`) |
| Scanner | producto sobre el mostrador con scanner (`scanner_pack`) |
| Lupa | etiqueta/paquete de cerca, sin marca (`package_label`) |
| OfferPoster | góndola con hueco para oferta (`offer_shelf`) |
| ClockDeal | mostrador con pared blanca (`counter_clock`) |
| Clipboard | pared de depósito con corcho (`corkboard`) |
| CountCard / CommentQ / Cta | pasillo (`aisle`) o depósito (`storeroom`) |
| BeforeAfter | misma góndola vacía (`gondola_empty`) y llena (`gondola_full`) |
