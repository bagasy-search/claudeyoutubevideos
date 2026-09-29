# ⛳ COMPUERTA 2 — olstove: minuto 1, anclas y kit
Archivos (D:/Proyectos/video2-wt/olstove): `GATE2_m1_contact.jpg` (20 anclas: 14 de Ole K0-K13 + 6 de detalle), `GATE2_kit/*.png` (stills del kit renderizado con `npx remotion still`), `vlog/olstove/M1/plan.json` (7 hablados + 3 detalles v2.0), `vlog/olstove/mkplan_m1.mjs`.
Voz final: master 937,7 s (15,6 min), ASR whisper-1 (Modal sin saldo: "spend limit"), align difflib global ratio 0,9866, 0 frases comidas. CTA en 1:37; top-down arranca a 2:47.

## Director del minuto 1 (segundos reales del ASR; 24 tomas = 23 cortes; ninguna >3,9 s; 7 hablados de Ole)
| t | dur | toma | lo dicho |
|---|---|---|---|
| 0.0 | 3.9 | vl m1 Ole junto a la estufa hace pasar al espectador (K0→K1) | "Well, now, friend, come on in and shut that door behind you." |
| 3.9 | 2.5 | st: estufa de hierro real ardiendo (Pexels, a elegir con juez) | "The stove's the only thing in this camp kitchen" |
| 6.4 | 2.5 | vl m2 Ole palmea la estufa (K2→K3) | "that never asks for a raise." |
| 8.9 | 2.7 | ar: foto real de archivo MNHS, cocina de campamento maderero 1900 (neg. 1799, licencia por verificar al bajar) | "Every winter, this one old stove kept a whole log cabin warm" |
| 11.6 | 1.7 | st: cabaña de troncos nevada con ventana encendida | "…a whole log cabin warm, and I'm going" |
| 13.3 | 3.4 | vl m3 Ole con el dedo y el encogimiento honesto (K4→K5) | "to show you the trick. It's not magic," |
| 16.7 | 2.3 | kf d_stack manos cargan leños (v2.0, foley) | "and it's not free heat." |
| 19.0 | 3.0 | **c StvFireStack3D** (la pila se arma capa por capa) | "It's three habits, and the first one is how you light the fire." |
| 22.0 | 2.8 | **c StvStove3D bottomUp** (humo espeso sube derecho) | "Most folks light it backwards." |
| 24.8 | 1.5 | **c StvMoistureMeter** (aguja al verde) | "Wood that's dry enough." |
| 26.3 | 1.8 | **c StvFireStack3D topDown** (WOW #1 en 26.6: la llama prende arriba) | "A fire built upside down." |
| 28.1 | 2.3 | **c StvDamperDial** (la manija gira) | "And one little handle on the pipe" |
| 30.4 | 2.6 | vl m4 Ole señala el caño (K6→K7) | "that people either never touch or turn the wrong way." |
| 33.0 | 1.0 | kf d_damper mano gira la manija (silencio del habla 32,8-34,0 con foley) | (pausa) |
| 34.0 | 3.4 | **c StvCabinHeat3D** (WOW #2 en 35.4: el mapa pasa de azul a cálido) | "Do those three right, and you get more heat" |
| 37.4 | 2.4 | **c StvStove3D split** (WOW #3 en 39.0: humo negro vs casi nada) | "out of the same pile of wood, with a lot less smoke." |
| 39.8 | 2.6 | vl m5 Ole con el fósforo (K8→K9) | "But before I strike a single match," |
| 42.4 | 1.2 | c OleRuleCard "4" | "four things," |
| 43.6 | 3.3 | vl m6 palmea la estufa con cariño (K10→K11) | "because a stove is a good friend only when you treat it right." |
| 46.9 | 3.0 | c OleRuleCard n=1 alarma de CO | "One. A carbon monoxide alarm." |
| 49.9 | 3.1 | vl m7 (K12→K13) | "You can't see that gas or smell it," |
| 53.0 | 3.4 | kf d_alarm el dedo aprieta el botón, pitido | "and it gives you a headache and dizziness and you never figure out why." |
| 56.4 | 3.6 | bi b_bunks las literas de la cabaña + OleNote | "Put an alarm on every floor and outside where folks sleep" |
Capas de sonido del minuto 1: foley real de v2.0 bajo la voz; whoosh en cada corte de componente; impacto en los 3 WOW; riser 36-37,4; cama folk sintetizada desde ~6 s (−37 LUFS). Silencios: 0 (voz continua; la pausa 32,8-34,0 la cubre foley).
Metraje filmado en el minuto 1 (hablados + stock + archivo) ≈ 28 s de 60 = 47 %; el resto = componentes 22 s + detalles v2.0 8 s.

## Hablados (agnes 2.5-flash reference): m1-m7 = 7 de un tope de 14. NO encolados (esperan tu OK de anclas). Tramos ya cortados en vlog/olstove/tramos/.
Observación de la hoja: identidad de Ole idéntica en las 14 anclas (barba, flannel, delantal, misma cabaña y estufa); las 6 de detalle sin cara. Ojo: el D3b (alarma) trae un rótulo con letras ilegibles chicas en la carcasa y manga a cuadros ROJOS en vez de verdes (el clip v2.0 lo mueve poco; puedo regenerar ese ancla con "sin etiqueta", es 1 imagen = US$0,006). Luz algo oscura (cabaña con nieve afuera); mismo look que olbeans.

## Componentes del video (kit propio `src/olstove/`, prefijo Stv; copiados de olbeans: OleTheme, OleBookPage, OleCTA, OleOverlays, OleRuleCard, OleDutchOven3D)
| componente | ¿3D real? | pago del guion | estado |
|---|---|---|---|
| StvStove3D (estufa en corte + humo/aire/llama; modos bottomUp/topDown/smolder/split) | **SÍ three.js** | top-down vs bottom-up (2:47), regulador cerrado de más (7:11) | hecho, still OK |
| StvFireStack3D (la pila cae capa por capa, se enciende arriba y el frente baja) | **SÍ three.js** | «light it from the top» (2:47-4:00) | hecho, still OK |
| StvCabinHeat3D (cabaña en corte, mapa de calor azul→cálido, aire frío por ventana/puerta) | **SÍ three.js** | «more heat from the same wood» (0:34) y «plug the leaks» (11:50) | hecho, still OK (la estufa queda algo lavada; afino con cámara) |
| StvMoistureMeter (medidor de 2 clavijas en el tronco + dial verde/rojo) | no (SVG) | «under twenty, you're good» (5:20-5:50) y 30 % del comprador (6:30) | hecho |
| StvDamperDial (manija del caño gira, dial ahogado/bueno/rugiendo, vidrio que se ennegrece) | no (SVG) | el regulador (8:00-9:15) | hecho |
| OleBookPage (páginas reales p.36, p.30, p.10 ya renderizadas en public/img/olstove/) | no | «this is a page from the book» (10:50, 13:50) | copiado; falta apuntar los puntos de zoom |
| OleCTA (portada + QR real qr_ole_olstove.png) | no | CTA 1:37 | copiado; verificar QR con cv2 en el cuadro renderizado |
| OleRuleCard (4 reglas de seguridad) | no | minuto 1 y cierre | copiado |
| POR HACER: StvCreosoteWarning (el caño por dentro, capas hasta 1/8 in), StvCordStack (cord 4x4x8 medido con cinta), StvChimneyDraft (regla 3-2-10 + sombrero), StvSeasonCalendar (oct→dic) | los 2 primeros se hacen como corte 2D/3D ligero | creosota 10:50, compra de leña 6:30, tiraje 9:30, calendario 14:20 | después de tu OK |
Todos los textos van por props (con defaults en inglés). Los stills están en GATE2_kit/.
Total: 5 componentes propios ya hechos (3 en 3D real) + 3 copiados adaptados; a esto se suman los 4 por hacer = 12 (≥6 pagos, ≥2 3D cumplido).

## Costos hasta ahora
Fish (gratis) · whisper-1 ~US$0,10 (2 pasadas de 15 min) · gpt-image-2 anclas sync US$0,126 · RunPod 0 · agnes 0. Total ≈ US$0,23.
