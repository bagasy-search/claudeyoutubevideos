# Kit neon — estilo "Explicador neón" (`explicador-neon`) en 16:9

Ficha del estilo: `D:/claude-brain/estilos/explicador-neon/ESTILO.md`. Escena de prueba: `Demo.tsx` (composición
`NEONDEMO` en `src/index_neon.tsx`).

## Cómo está armado
- **Un solo plano, sin cortes.** Todo vive en un MUNDO (px) y una cámara de escenario (`makeCam`) lo recorre. La cámara
  respira sola siempre; los vuelos llevan blur de movimiento. Cada área nueva nace de la anterior con un **hilo de luz**
  (`Hilo` / prop `colgadoDe`).
- **Tiempo anclado a la palabra.** Todos los componentes reciben segundos absolutos; se sacan con `tiempo.at("frase")`
  (`makeTiempo(words.json)`). Sin voz todavía: `palabrasDeGuion(guion)` da palabras sintéticas.
- **Formato partido** (`FormatoPartido`): escenario negro en los 2/3 izquierdos (1312 px) + columna del avatar 9:16 a
  alto completo (608 px) con sala oscura y tubos cian. Con `avatar.ventanas` la columna sale y entra deslizándose (el
  escenario se ensancha, sin corte) para gastar menos avatar. Ref ideal del avatar: 9:16, fondo oscuro, luces cian.
- Subtítulo de UNA palabra (`SubtituloPalabra`) abajo del escenario, automático con `tiempo`.

## Los 12 recursos
| efecto | componente | archivo |
|---|---|---|
| nx-collage-titulo | `CollageTitulo` (+ `TituloNeon` en pantalla) | Titulo.tsx |
| nx-objeto-neon | `ObjetoNeon` (cerebro, tragamonedas, bombilla, reloj, corazón, ojo, candado o `img`) | Objetos.tsx |
| nx-capitulo-bucle | `vueloBucle` (tomas de cámara) + `NumeroCapitulo` sobre el `BucleNeon` ancla | Bucle.tsx |
| nx-celular-ui | `CelularUI` (feed propio o `pantalla` real, aviso, disco rojo que late) | Celular.tsx |
| nx-fichas-casino | `FichasCasino` | Fichas.tsx |
| nx-hoja-guion | `HojaGuion` (escribe en vivo + resaltador verde) | Hoja.tsx |
| nx-clip-tarjeta | `ClipTarjeta` (clip real + marco de neón que se dibuja + cifra que cuenta) | ClipTarjeta.tsx |
| nx-carta-gira | `CartaGira` | Carta.tsx |
| nx-camino-ab | `CaminoAB` | Camino.tsx |
| nx-grafico-linea | `GraficoLinea` (arco / rulos / valores) | Grafico.tsx |
| nx-resumen-bucle | `ResumenBucle` encima del `BucleNeon` | Bucle.tsx |
| nx-formato-partido | `FormatoPartido` (+ `ColumnaAvatar`, `Escenario`, `SubtituloPalabra`) | Layout.tsx |

Reglas que el kit ya cumple: nunca más de 2 objetos nuevos a la vez (cada uno tiene su palabra), sans negra + UNA
palabra en `*itálica serif*` (marcala con asteriscos), resaltador verde fosforescente, todo vectorial (se puede
acercar 6-8x sin pixelar).

## Sonido (un sonido por micro-elemento, bajo la voz)
`sonidos.ts`: `SONIDOS` = micro-elemento → variantes de `public/sfx/lib` + 2 sintéticos (`sfx/neon/neon_on_*.wav`,
`sfx/neon/slot_spin.wav`, se regeneran con `python scripts/synth_neon.py`). `pista()` tiene un método por componente con
los mismos tiempos que el componente (`s.fichas({items})`, `s.camino({...})`…) → `s.eventos`.
- Preview en Studio: `<SfxTrack eventos={…} hablando={tiempo.speaking} />` (en el farm va apagado: `farm`).
- Final: fuera de Remotion, como cgordie1 (0 desfase):
  `node src/kits/neon/eventos.mjs src/kits/neon/Demo.tsx EVENTOS_DEMO ev.json` →
  `python src/kits/neon/mezcla_neon.py ev.json public mezcla.wav voz.wav words.json` (efectos a la mitad mientras se
  habla, -14 LUFS / -1,5 dBTP, la voz nunca se estira).

## Revisar
Sólo stills (NUNCA video en local): `node src/kits/neon/stills.mjs <outDir> <publicDir> 1.2 5.6 …` con un publicDir
chico (assets de prueba en `E:/videos/neon_pub/neon/…` + `sfx/`). Render de prueba completo = farm (`granja.sh`).
