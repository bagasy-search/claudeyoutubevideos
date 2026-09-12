// MovS7Oeste.tsx — MOVIMIENTO S7 · "LA SOMBRA: UNA ESQUINA SE LLEVA EL 70% DE LOS DOS PANELES"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 1910 frames @30 = 63,70 s.
// Tramo global 22376 → 24286 (frame local = global − 22376). Se monta ENCIMA del avatar real.
// ⛔ CERO capas de color con opacidad sobre su cara: las ventanas son GEOMETRÍA (`clip-path`).
//
// ⭐ ESTE MOVIMIENTO CONTIENE EL SEGUNDO ERROR DEL VIDEO:
//    "Una sombra del tamaño de una hoja de cuaderno se llevó puesto el 70% de la producción de los
//     DOS paneles juntos — porque las celdas van en fila y la fila entera trabaja al ritmo de la
//     celda más tapada, como una manguera con un pisotón en el medio."
//
// ── CÓMO ESTÁ CONSTRUIDO ──────────────────────────────────────────────────────────────────────
// 1. EL MUNDO (atmósfera + soles + fondos a sangre + la gráfica REGISTRADA sobre el material real:
//    la curva de la tarde, el área de producción de los dos paneles, la fila de celdas) vive DENTRO
//    de un único contenedor recortado por LA APERTURA (`coverAt` → `clipOf`).
//    ⭐ EL GESTO DE APERTURA DE ESTE MOVIMIENTO — inédito en el video: **LA CUÑA DE SOMBRA**.
//    El hueco no tiene lados verticales: tiene DOS BORDES INCLINADOS que giran alrededor de un
//    VÉRTICE VIRTUAL colocado fuera de cuadro, arriba. Se abre por barrido ANGULAR (los dos bordes
//    se separan girando, como el filo de una sombra que se retira), y puede PIVOTEAR entero (el sol
//    que baja) o COLAPSAR sobre su vértice. Es un reloj de sol, no una puerta.
//    Ninguna ventana repite el gesto de los hermanos (bandas que se juntan, guillotina, telón,
//    persiana, apertura escalonada, trapecio de borde inclinado):
//      W1 (118-240)   EL FILO QUE SE RETIRA — nace como UNA sola línea inclinada y los dos bordes
//                     se separan girando (el derecho primero). CIERRA pivoteando la cuña ENTERA
//                     hacia la derecha mientras se angosta: el filo se va caminando, no se cierra.
//      W2 (560-650)   EL VÉRTICE QUE BAJA — el vértice virtual desciende de −92 % a −24 % mientras
//                     los bordes se abren: la cuña crece desde arriba. CIERRA con el borde IZQUIERDO
//                     barriendo hasta chocar contra el derecho, que queda CLAVADO.
//      W3 (1212-1294) EL SNAP — se abre de un golpe angular de 6 frames sobre "recuperé todo", y
//                     NO cierra: muere adentro del polvo de hormigón de la frontera D.
//      W4 (1408-1538) EL SOL QUE BAJA — abre LENTO (48 f) con la cuña inclinada −13° que se endereza
//                     mientras se ensancha. CIERRA con el VÉRTICE SUBIENDO hasta entrar en cuadro:
//                     la sombra converge a un punto y se lo come. Contención pura: 130 frames sin
//                     una sola tarjeta flotante.
// 2. EL PRIMER PLANO (tarjetas con material real, cifras, íconos, titulares) NO está recortado. Con
//    la apertura ABIERTA todo vive en x<24 % o x>76 % y por encima de y=42 %: la caja de la cara
//    (30-70 % · 10-90 %) queda DENTRO del hueco a cualquier altura y jamás la toca nada.
// 3. UNA sola cámara `camAt(g)`, función pura de g, con deriva viva. Ningún acto la reinicia.
//    UNA sola atmósfera, montada una vez para los 63,7 s.
// 4. LA MATERIA QUE CRUZA CADA FRONTERA es siempre un objeto: el vidrio que devuelve el blanco del
//    cielo, la esquina tapada del panel, el ladrillo de la chimenea, una sola celda, el polvo del
//    hormigón que levanta el panel arrastrado, el rectángulo naranja del sol de las 6.
//
// ⭐⭐ CÓMO SE VE QUE UNA CELDA TAPADA APAGA LA FILA ENTERA (acto 4, el acto de MECANISMO):
//    No hay ningún texto explicando el circuito. Sobre el clip REAL de la fila de celdas
//    (`cmep30_s7_clip_celda_se_apaga.mp4`, donde la sombra traga UNA celda y la fila se apaga
//    DESPUÉS) va, en registro, LA FILA: siete celdas con su NIVEL propio y un TREN DE CORRIENTE de
//    guiones que las atraviesa de izquierda a derecha. Tres cosas, en este orden exacto:
//      (a) la sombra real tapa la celda 3 → el tren de guiones FRENA contra su borde izquierdo y se
//          AMONTONA ahí, vibrando: la corriente no tiene por dónde pasar;
//      (b) las otras seis celdas NO se apagan solas: sus niveles DRENAN, una tras otra (cada 5
//          frames, del centro hacia afuera), hasta quedar TODAS a la misma altura que la tapada.
//          Es una igualación hacia abajo, y se ve que la altura final la fija la celda tapada;
//      (c) el mismo hecho, en material real, con la MANGUERA: el chorro sale flojo con la bota
//          encima y engorda cuando la bota se levanta. La frontera entre los dos mundos es un
//          MATCH-MOVE: los guiones amontonados y las gotas del pico están sobre la misma línea, a
//          la misma velocidad y en la misma dirección.
//    La fila NO se recupera con la manguera: se recupera en el frame 1206, cuando él mueve los
//    paneles metro y medio, la sombra sale de la celda y los siete niveles suben JUNTOS de golpe.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⇐ ENTRA DESDE el tramo de los días nublados:
//   cam {encuadre MEDIO del patio, cámara derivando lenta hacia la IZQUIERDA, grúa −120, push 1.14}
//   luz {HORA.alerta 14°, ámbar, amb 0.38 → gira a PLANA: 46°, cielo blanco, amb 0.62 (rampa 12 f)}
//   materia {EL VIDRIO DEL PANEL DEVOLVIENDO EL BLANCO DEL CIELO — `cmep30_s7_gotas_vidrio_panel.png`}
//
// ACTO 1 · 0-446 · "SE CAÍA A PIQUE"        protagonista: LA CURVA DE LA TARDE   texto: A LAS 4 SE CAÍA A PIQUE
//   entra  cam {grúa −120, push 1.14, foco 56/40}     luz {14° → 46°, blanco de cielo cubierto, amb 0.62}
//          materia {el vidrio mojado devolviendo el blanco del cielo}
//   sale   cam {grúa −18, push 1.03, foco 40/52}      luz {rasante 7°, ámbar, amb 0.70 — el sol bajo entró}
//          materia {LA ESQUINA TAPADA DEL PANEL — un rectángulo oscuro con una banda clara}
//   (costura INTERNA @202 ···· MATCH-MOVE: el MUNDO NUBLADO entero se va por el riel hacia la
//    izquierda a −0,82 % de pantalla por frame — con su curva encima, que está registrada en su
//    hormigón — y LA SOMBRA DE LA CHIMENEA entra por la derecha PEGADA A SU CANTO, sobre el mismo
//    riel (+100 %). Los dos embaldosan el cuadro: a los dos lados del canto hay una sombra viajando
//    a la misma velocidad y en la misma dirección, y no existe un solo frame de hueco.)
//   ── FRONTERA A @446 ···· MATCH-SHAPE: la ESQUINA del panel (rectángulo oscuro, grilla de celdas,
//      banda clara en diagonal) se achica, pierde la grilla (`PanelForm cells` 1 → 0,12), le sube el
//      radio y se convierte en EL DISPLAY DE LA PINZA. La superficie se repinta con un borde DURO
//      que viaja con el especular montado encima: en cada frame hay una línea neta entre las dos
//      materias. El objeto no suelta el cuadro. ⭐ Y el MUNDO se repinta con EL MISMO `sweep`: un
//      solo filo cruza el cuadro entero, objeto y fondo a la vez. No hay ningún corte de fondo. ··
// ACTO 2 · 446-657 · "610 A LAS 4:10, 180 A LAS 4:20"  protagonista: LA PINZA   texto: LA MISMA TARDE, 10 MINUTOS
//   entra  cam {grúa −18 → 4, push 1.03 → 1.00, foco 40/52}   luz {rasante 7°, ámbar, amb 0.70}
//          materia {el display de la pinza, con el 610 adentro}
//   sale   cam {grúa 22, push 1.08, foco 58/44}       luz {rasante 6°, ámbar, amb 0.72}
//          materia {LA CHIMENEA DEL VECINO, ladrillo ardiendo por el canto izquierdo}
//   (la CAUSA y el EFECTO en el mismo cuadro y los dos con material REAL: a la izquierda el clip de
//    la sombra avanzando sobre la esquina, a la derecha el clip de la pinza cayendo. La cifra la
//    escribe el kit y la MANDA la sombra: `caida` gobierna al mismo tiempo cuánto avanzó la sombra
//    y en cuánto está el número. Cae mientras la sombra avanza y se clava cuando la sombra frena.)
//   ── FRONTERA B @657 ···· OCLUSIÓN: LA CHIMENEA DEL VECINO cruza de derecha a izquierda —
//      ladrillo, juntas de mortero, el canto izquierdo ardiendo por el sol rasante y su sombra de
//      contacto — y tapa el 100 % entre los frames 653 y 661. El acto cambia ADENTRO de esos 8
//      frames. El color es el del LADRILLO (#9C5B41), jamás el del fondo. ······················
// ACTO 3 · 657-945 · ⭐ "EL 70% DE LOS DOS"  protagonista: LOS DOS PANELES   texto: EL 70% DE LOS DOS
//   entra  cam {grúa 22 → 34, push 1.08 → 1.02, foco 58/44}   luz {rasante 6°, ámbar, amb 0.72}
//          materia {los dos paneles, con la producción encendida sobre el vidrio}
//   sale   cam {grúa −4, push 1.26, foco 50/50 — la cámara YA está entrando en una celda}
//          luz {rasante 5°, ámbar, amb 0.66}
//          materia {UNA SOLA CELDA, tragada por la sombra}
//   (⭐ LA INJUSTICIA DE LA ESCALA, sin ninguna cuenta escrita: los DOS paneles son dos `PanelForm`
//    con su FOTO REAL adentro, y sobre el vidrio de cada uno hay un ÁREA ENCENDIDA que es lo que
//    producen. Cae encima una mancha del tamaño de una hoja de cuaderno — 168×122 px contra 1216 px
//    de vidrio, y al lado la foto real de la hoja apoyada en el panel para que se vea que es ESE
//    tamaño — y las DOS áreas se desangran de golpe hasta el 30 % de su altura. El 70 % que
//    desaparece se va en astillas FRÍAS hacia arriba y afuera: `flujo("cobran")`, no vuelve.)
//   ── FRONTERA C @945 ···· ZOOM-THROUGH: la cámara entra en UNA celda del panel de la izquierda
//      (fx 41 / fy 46) y sale del otro lado ya adentro de la fila, en macro. El clip de la fila se
//      monta 19 frames ANTES, debajo: un zoom-through contra nada es un fundido a negro. ·········
// ACTO 4 · 945-1292 · ⭐ LA FILA Y EL PISOTÓN  protagonista: LA FILA DE CELDAS   texto: AL RITMO DE LA MÁS TAPADA
//   entra  cam {saliendo del túnel, push 1.26 → 1.03, grúa −4 → 6, foco 50/50 → 62/58}
//          luz {rasante 5°, ámbar, amb 0.66 — el filo duro del sol bajo entrando por la izquierda}
//          materia {la fila de celdas en macro, los dedos de metal cruzando cada celda}
//   sale   cam {grúa 22, push 1.02, foco 44/46}       luz {rasante 6°, ámbar, amb 0.72}
//          materia {EL POLVO DE HORMIGÓN que levanta el panel arrastrado}
//   (costura INTERNA @1118 ···· MATCH-MOVE: los guiones amontonados contra la celda tapada y las
//    gotas que salen flojas del pico de la manguera viajan sobre LA MISMA LÍNEA (de 22/71 a 74/57),
//    a la misma velocidad (0,0135) y en la misma dirección. La materia que cruza es EL CAUDAL. Y
//    cuando la bota se levanta, el chorro engorda en el material real.)
//   ── FRONTERA D @1292 ···· WIPE POR MATERIA: el POLVO DE HORMIGÓN que levanta el panel al ser
//      arrastrado cruza el cuadro bajo y rápido, con granos gruesos adelante, y detrás ya está el
//      patio del acto 5. Materia hormigón (#A39C8C) — es lo que él acaba de raspar, no un efecto
//      inventado. Cobertura ~88 % entre 1290 y 1300. ···········································
// ACTO 5 · 1292-1910 · "LA TARDE QUE VALE MÁS"  protagonista: EL PATIO Y EL RELOJ   texto: ESA TARDE VALE MÁS
//   entra  cam {grúa 34, push 1.10, foco 44/46}       luz {rasante 6°, ámbar, amb 0.72}
//          materia {el patio con la sombra larga de la chimenea cruzando el hormigón}
//   sale   cam {grúa 38, push 1.16, foco 52/60 — la deriva SIGUE andando, no frena}
//          luz {HORA.rasante 6°, ámbar, amb 0.70}
//          materia {LA LUZ NARANJA DE LAS 6 APOYADA EN LA MESADA DE LA COCINA}
//   (costura INTERNA @1745 ···· CORTE EN EL BEAT sobre "los dos paneles apuntaban al sur". La
//    BISAGRA es el rótulo AL SUR: misma x, misma y, mismo cuerpo a los dos lados del corte durante
//    18 frames. costura INTERNA @1836 ···· MATCH-SHAPE: el rectángulo naranja que el sol rasante
//    apoya sobre el vidrio del panel se estira, se acuesta y ES el rectángulo naranja que el sol
//    apoya sobre la mesada de la cocina. La misma luz, dos superficies — y el FOGONAZO de esa
//    misma luz, que pica justo en el frame 1842, tapa el cambio de superficie: no es un fundido,
//    es un reflejo.)
//
// ⇒ SALE HACIA el tramo de mover las cargas de hora (la lavadora a la una, el calentador de 11 a 1):
//   cam {INTERIOR de la casa al atardecer, cámara siguiendo su deriva hacia la izquierda}
//   luz {HORA.rasante 6°, ámbar, amb 0.70}
//   materia {la luz naranja de las 6 entrando por la ventana y apoyándose en la mesada}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande full-screen · cero fade en
// ninguna frontera · dos fronteras seguidas nunca repiten costura · cero capa de color con opacidad
// sobre el avatar · TODA tarjeta flotante lleva FOTO o CLIP REAL adentro (`MediaCard`); la fila de
// celdas, el área de producción y la curva son GRÁFICA DE APOYO en registro sobre material real,
// nunca hacen de objeto: el panel, la chimenea y la manguera van SIEMPRE con su foto o su clip.
// ⛔ Rutas LITERALES en el punto de uso: el build escanea este .tsx por TEXTO y una ruta armada por
// template literal no viaja en el tar → 404 → chunk muerto con un error que miente.
// ⚠️ Ningún `kind="video"` se monta más de 140 frames (los clips duran ~151 a 30 fps).
// ⛔ Ningún acto baja de amb 0.60 después del frame 12 (luma <25 = pantalla negra en el render).
// ⛔ ORDEN DE PINTADO: adentro de `Layers` manda el `translateZ` del `Plane`, NO el orden del DOM.
// Un fondo de destino montado "antes" pero MÁS CERCA de la cámara tapa al que se está yendo — por
// eso la fila del acto 4 va a z −940 (detrás del −900 del acto 3), y los cuatro cambios de fondo
// caen adentro de su cobertura: 654 (ladrillo), 1296 (polvo), 1745 (corte en el beat), 1842
// (fogonazo). El del frame 446 no existe: ahí el fondo se REPINTA con el `sweep` del objeto.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, PanelForm, zoomThrough, SunKey, HORA, flujo, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps, anclados al ms de Whisper) ────────────────
const A2 = 446;    // 22822 · "La pinza marcaba 610 vatios a las 4 y 10 y 180 a las 4 y 20."
const A3 = 657;    // 23033 · "Una sombra del tamaño de una hoja de cuaderno se llevó el 70%..."
const A4 = 945;    // 23321 · "Las celdas van en fila y la fila entera trabaja al ritmo..."
const A5 = 1292;   // 23668 · "Si vas a poner esto en tu casa, siéntate una tarde a mirar..."
const G_END = 1910;

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });
const esSnap = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.08, 0.86, 0.2, 1) });

// LAS MATERIAS de las costuras. ⛔ Ninguna es el color del fondo.
const LADRILLO = "#9C5B41";   // el ladrillo de la chimenea del vecino (frontera B)
const MORTERO = "#C9BCA8";    // la junta entre ladrillos
const POLVO = "#A39C8C";      // el polvo del hormigón que levanta el panel arrastrado (frontera D)
const NARANJA = "#F0A24A";    // la luz de las 6 de la tarde (materia saliente)

// ── EL RIEL DEL MATCH-MOVE INTERNO @202 (dos sombras sobre la misma vía) ──────────────────────
const RAIL_V = -0.82;                                   // % de pantalla por frame
const railPct = (g: number) => Math.min(0, (g - 196) * RAIL_V);   // 0 hasta el frame 196

// ══ LA APERTURA — ⭐ LA CUÑA DE SOMBRA ════════════════════════════════════════════════════════
// El hueco está limitado por DOS BORDES INCLINADOS que giran alrededor de un vértice virtual
// (ax, ay) puesto arriba y fuera de cuadro. `half` = medio ángulo en grados (el ancho de la cuña),
// `tilt` = hacia dónde apunta la cuña entera (el sol que se corre). `yT` = el canto plano de arriba.
// Con half = 0 la cuña es una línea: el cuadro está cerrado.
// La conversión %x/%y respeta el aspecto: dx_px = dy_px · tan(ang) → dx% = dy% · (1080/1920) · tan.
type Cover = { ax: number; ay: number; half: number; tilt: number; yT: number };
const CERRADO: Cover = { ax: 50, ay: -92, half: 0, tilt: 0, yT: 6 };
const AR = 1080 / 1920;
const tanDeg = (d: number) => Math.tan((d * Math.PI) / 180);
const edgeX = (c: Cover, y: number, side: -1 | 1) => {
  const dy = Math.max(0, y - c.ay);
  return c.ax + dy * AR * tanDeg(c.tilt + side * c.half);
};
const yTopOf = (c: Cover) => Math.max(c.yT, c.ay);
const isOpen = (c: Cover) => {
  const yt = yTopOf(c);
  return yt < 96 && edgeX(c, 100, 1) - edgeX(c, 100, -1) > 1.4;
};

const coverAt = (g: number): Cover => {
  // W1 · EL FILO QUE SE RETIRA — nace como UNA línea inclinada; el borde derecho gira primero y el
  // izquierdo lo sigue 12 frames después. Cierra pivoteando la cuña ENTERA hacia la derecha
  // mientras se angosta: el filo de la sombra se va CAMINANDO, no se cierra sobre él.
  if (g >= 118 && g < 244) {
    const abreR = esOut(clamp01((g - 118) / 30));
    const abreL = esOut(clamp01((g - 130) / 32));
    const camina = es(clamp01((g - 196) / 44));
    const halfR = lerp(0, 20.6, abreR) * (1 - camina);
    const halfL = lerp(0, 20.6, abreL) * (1 - camina);
    const half = (halfR + halfL) / 2;
    const tilt = (halfR - halfL) / 2 + camina * 27;
    return { ax: 50, ay: -92, half, tilt, yT: lerp(9, 5, abreL) };
  }
  // W2 · EL VÉRTICE QUE BAJA — el vértice virtual desciende de −92 % a −24 % mientras los bordes se
  // separan: la cuña CRECE DESDE ARRIBA. Cierra con el borde izquierdo barriendo hasta chocar
  // contra el derecho, que queda CLAVADO (tilt + half = constante).
  if (g >= 560 && g < 656) {
    const baja = esSnap(clamp01((g - 560) / 26));
    const barre = esOut(clamp01((g - 606) / 40));
    const h0 = 24.4;
    const half = lerp(0, h0, baja) * (1 - barre);
    return { ax: 50, ay: lerp(-92, -24, baja), half, tilt: h0 - half, yT: lerp(11, 4, baja) };
  }
  // W3 · EL SNAP — golpe angular de 6 frames sobre "recuperé todo". NO cierra: se lo come el polvo
  // de hormigón de la frontera D (muere adentro de la cobertura, entre 1290 y 1300).
  if (g >= 1212 && g < 1300) {
    const snap = esSnap(clamp01((g - 1212) / 6));
    const muere = es(clamp01((g - 1290) / 10));
    return {
      ax: 50, ay: -92,
      half: lerp(0, 21.4, snap) * (1 - muere),
      tilt: lerp(-4, 0, snap), yT: lerp(8, 5, snap),
    };
  }
  // W4 · EL SOL QUE BAJA — abre LENTO con la cuña inclinada −13° que se endereza mientras se
  // ensancha, sostiene 68 frames, y CIERRA con el vértice SUBIENDO hasta entrar en cuadro: la
  // sombra converge a un punto y se lo come. Contención: acá no hay una sola tarjeta flotante.
  if (g >= 1408 && g < 1552) {
    const abre = es(clamp01((g - 1408) / 48));
    const sube = es(clamp01((g - 1502) / 44));
    return {
      ax: lerp(46, 50, abre), ay: lerp(-92, 34, sube),
      half: lerp(0, 21.8, abre), tilt: lerp(-13, 0, abre), yT: lerp(10, 5, abre),
    };
  }
  return CERRADO;
};

const clipOf = (c: Cover) => {
  if (!isOpen(c)) return "inset(0px)";
  const yt = yTopOf(c);
  const tl = edgeX(c, yt, -1), tr = edgeX(c, yt, 1);
  const bl = edgeX(c, 100, -1), br = edgeX(c, 100, 1);
  return (
    `polygon(0% 0%, 100% 0%, 100% 100%, ${br.toFixed(2)}% 100%, ` +
    `${tr.toFixed(2)}% ${yt.toFixed(2)}%, ${tl.toFixed(2)}% ${yt.toFixed(2)}%, ` +
    `${bl.toFixed(2)}% 100%, 0% 100%)`
  );
};

// ── LOS CANTOS DE LA CUÑA. Todo el brillo sale HACIA AFUERA (hacia el mundo): ni un píxel de
//    gradiente se apoya sobre su cara. Los bordes van INCLINADOS, así que se dibujan con SVG.
const CantosCuna: React.FC<{ c: Cover; hot: number }> = ({ c, hot }) => {
  const yt = yTopOf(c);
  const tl = edgeX(c, yt, -1) * 19.2, tr = edgeX(c, yt, 1) * 19.2;
  const bl = edgeX(c, 100, -1) * 19.2, br = edgeX(c, 100, 1) * 19.2;
  const ytp = yt * 10.8;
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="s7cunaL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba(V.ink0, 0.0)} />
          <stop offset="62%" stopColor={rgba(V.ink0, 0.5)} />
          <stop offset="100%" stopColor={rgba(V.amber, 0.16 * hot)} />
        </linearGradient>
        <linearGradient id="s7cunaR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={rgba(V.ink0, 0.0)} />
          <stop offset="62%" stopColor={rgba(V.ink0, 0.5)} />
          <stop offset="100%" stopColor={rgba(V.amber, 0.16 * hot)} />
        </linearGradient>
        <linearGradient id="s7cunaTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(V.ink0, 0.52)} />
          <stop offset="100%" stopColor={rgba(V.bone, 0.0)} />
        </linearGradient>
      </defs>
      {/* la lamida de luz sobre el canto izquierdo, hacia AFUERA del hueco */}
      <polygon points={`${tl - 128},${ytp} ${tl},${ytp} ${bl},1080 ${bl - 128},1080`} fill="url(#s7cunaL)" />
      <polygon points={`${tr},${ytp} ${tr + 128},${ytp} ${br + 128},1080 ${br},1080`} fill="url(#s7cunaR)" />
      <polygon points={`${tl},${ytp - 92} ${tr},${ytp - 92} ${tr},${ytp} ${tl},${ytp}`} fill="url(#s7cunaTop)" />
      {/* los dos filos: la línea neta del borde de una sombra dura */}
      <line x1={tl} y1={ytp} x2={bl} y2={1080} stroke={rgba(V.bone, 0.6 * hot)} strokeWidth={3} />
      <line x1={tr} y1={ytp} x2={br} y2={1080} stroke={rgba(V.bone, 0.6 * hot)} strokeWidth={3} />
      <line x1={tl} y1={ytp} x2={tr} y2={ytp} stroke={rgba(V.amber, 0.5 * hot)} strokeWidth={2} />
    </svg>
  );
};

// ── FRONTERA B · OCLUSIÓN — LA CHIMENEA DEL VECINO ────────────────────────────────────────────
// Ladrillo con sus juntas, el canto izquierdo ardiendo por el sol rasante y su sombra de contacto.
// Cruza de DERECHA a IZQUIERDA y tapa el 100 % entre 653 y 661. Color LADRILLO, jamás el del fondo.
const OcluyeChimenea: React.FC<{ at: number; dur?: number }> = ({ at, dur = 34 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(112, -186, esOut(p));
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-22%", left: `${L.toFixed(2)}%`, width: "168%", height: "148%",
        transform: `rotate(${(2.4 - p * 4.6).toFixed(2)}deg)`,
        background:
          `linear-gradient(96deg, ${LADRILLO} 0%, #B06B4E 26%, #8A4E38 62%, #6E3D2C 100%)`,
        boxShadow: `0 0 150px ${rgba(V.ink0, 0.9)}`,
        overflow: "hidden",
      }}>
        {/* las JUNTAS DE MORTERO: lo que separa "ladrillo" de "rectángulo marrón" */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5,
          backgroundImage:
            `linear-gradient(${rgba(MORTERO, 0.62)} 5px, transparent 5px),` +
            `linear-gradient(90deg, ${rgba(MORTERO, 0.5)} 5px, transparent 5px)`,
          backgroundSize: "268px 92px",
        }} />
        {/* el grano del ladrillo */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.24,
          backgroundImage:
            `repeating-linear-gradient(74deg, ${rgba(V.ink0, 0.24)} 0px, ${rgba(V.ink0, 0.24)} 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 11px)`,
        }} />
        {/* el CANTO IZQUIERDO ARDIENDO: la fuente concreta de la luz en este cuadro */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 74,
          background: `linear-gradient(90deg, ${rgba(NARANJA, 0.95)} 0%, ${rgba(NARANJA, 0.26)} 34%, rgba(0,0,0,0) 100%)`,
        }} />
        {/* la sombra de contacto del canto que viene entrando */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 210,
          background: `linear-gradient(270deg, ${rgba(V.ink0, 0.46)}, rgba(0,0,0,0))`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ── FRONTERA D · WIPE POR MATERIA — EL POLVO DEL HORMIGÓN ─────────────────────────────────────
// Es lo que él acaba de raspar arrastrando el panel: polvo bajo y rápido con granos gruesos
// adelante. Cobertura ~88 % entre 1290 y 1300. Materia hormigón, jamás el color del fondo.
const PolvoHormigon: React.FC<{ at: number; dur?: number }> = ({ at, dur = 42 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const tapa = clamp01(Math.sin(p * Math.PI) * 2.1 - 1.02);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 13 }, (_, i) => {
        const o = rnd(i * 4.7);
        const q = clamp01(p * 1.42 - o * 0.3);
        const x = lerp(126, -34, esOut(q));
        const w = 460 + o * 720;
        const h = 300 + rnd(i * 9.3) * 520;
        const y = 22 + rnd(i * 2.9) * 68;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(1)}%`,
            width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(POLVO, 0.42 * Math.sin(clamp01(q) * Math.PI))} 0%, rgba(0,0,0,0) 66%)`,
          }} />
        );
      })}
      {/* los GRANOS gruesos: el polvo tiene materia, no es una nube lisa */}
      {Array.from({ length: 26 }, (_, i) => {
        const o = rnd(i * 8.1);
        const q = clamp01(p * 1.6 - o * 0.34);
        const x = lerp(122, -18, q);
        const y = 52 + rnd(i * 3.7) * 44 - q * q * 16;
        const s = 3 + o * 9;
        return (
          <div key={`gr${i}`} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(1)}%`,
            width: s, height: s * 0.72, borderRadius: 2,
            transform: `rotate(${(o * 200).toFixed(1)}deg)`,
            background: rgba(o > 0.5 ? "#C4BCA9" : POLVO, 0.9 * Math.sin(clamp01(q) * Math.PI)),
          }} />
        );
      })}
      {/* el instante de cobertura: el polvo llena el cuadro y ahí adentro cambia el acto */}
      <AbsoluteFill style={{ background: rgba(POLVO, 0.88 * tapa) }} />
    </AbsoluteFill>
  );
};

// ── TIPOGRAFÍA propia del movimiento ──────────────────────────────────────────────────────────
const Rotulo: React.FC<{
  children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number;
  align?: "left" | "center" | "right";
}> = ({ children, x, y, color = V.bone, size = 32, op = 1, align = "center" }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    transform: `translate(${align === "left" ? "0%" : align === "right" ? "-100%" : "-50%"},-50%)`,
    opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
  }}>{children}</div>
);

// cartel que ATERRIZA (nada arranca de cero: entra con desplazamiento y escala, y respira)
const Cartel: React.FC<{
  g: number; at: number; out: number; x: number; y: number; size?: number; color?: string;
  children: React.ReactNode;
}> = ({ g, at, out, x, y, size = 52, color = V.white, children }) => {
  const inP = es(clamp01((g - at) / 14));
  const outP = clamp01((g - out) / 16);
  if (g < at || outP >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateY(${((1 - inP) * 28 + outP * 22 + Math.sin(g / 57) * 2.2).toFixed(1)}px) ` +
        `scale(${(0.93 + 0.07 * inP - outP * 0.05).toFixed(3)})`,
      opacity: Math.min(1, inP * 1.7) * (1 - outP),
    }}>
      <Bed pad={20}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 1.6, color,
          textTransform: "uppercase", lineHeight: 1.05, whiteSpace: "nowrap",
          textShadow: "0 5px 22px rgba(0,0,0,0.95)",
        }}>{children}</div>
      </Bed>
    </div>
  );
};

// ── ACTO 1 · LA CURVA DE LA TARDE — gráfica de APOYO en registro sobre la foto del patio ──────
// Va DENTRO del mundo recortado: cuando la cuña abre, la curva queda sola en las bandas, que es
// exactamente lo que tiene que pasar (el dato se queda afuera, él se ve limpio en el medio).
const PTS: { x: number; y: number }[] = [
  { x: 12, y: 82 }, { x: 21, y: 68 }, { x: 30, y: 54 }, { x: 39, y: 43 },
  { x: 48, y: 37 }, { x: 57, y: 39 }, { x: 64, y: 45 }, { x: 69, y: 50 },
];
const CurvaTarde: React.FC<{ g: number; at: number }> = ({ g, at }) => {
  const draw = es(clamp01((g - at) / 54));
  const cae = es(clamp01((g - at - 62) / 22));
  const n = PTS.length;
  const upto = draw * (n - 1);
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    if (i <= Math.floor(upto)) pts.push(`${PTS[i].x * 19.2},${PTS[i].y * 10.8}`);
  }
  const k = Math.floor(upto);
  if (k < n - 1) {
    const t = upto - k;
    pts.push(`${lerp(PTS[k].x, PTS[k + 1].x, t) * 19.2},${lerp(PTS[k].y, PTS[k + 1].y, t) * 10.8}`);
  }
  const last = PTS[n - 1];
  const cliffY = lerp(last.y, 96, cae);
  if (cae > 0.001) pts.push(`${(last.x + 1.6) * 19.2},${cliffY * 10.8}`);
  const headX = cae > 0.001 ? last.x + 1.6 : lerp(PTS[0].x, last.x, draw);
  const headY = cae > 0.001 ? cliffY : (k < n - 1 ? lerp(PTS[k].y, PTS[k + 1].y, upto - k) : last.y);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}>
        {/* el suelo del gráfico, apoyado en el hormigón real de la foto */}
        <line x1={190} y1={1016} x2={1500} y2={1016} stroke={rgba(V.bone, 0.26)} strokeWidth={2} />
        <polyline points={pts.join(" ")} fill="none"
          stroke={cae > 0.4 ? V.danger : V.volt} strokeWidth={9} strokeLinecap="round"
          strokeLinejoin="round" opacity={0.95} />
        {/* la caída, remarcada: lo que se cayó a pique */}
        {cae > 0.001 && (
          <polyline
            points={`${last.x * 19.2},${last.y * 10.8} ${(last.x + 1.6) * 19.2},${cliffY * 10.8}`}
            fill="none" stroke={V.danger} strokeWidth={13} strokeLinecap="round" />
        )}
      </svg>
      {/* la cabeza viva de la curva: nada quieto */}
      <div style={{
        position: "absolute", left: `${headX}%`, top: `${headY}%`,
        width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: "50%",
        background: cae > 0.4 ? V.danger : V.volt,
        boxShadow: `0 0 ${(26 + Math.sin(g / 7) * 8).toFixed(0)}px ${rgba(cae > 0.4 ? V.danger : V.volt, 0.8)}`,
      }} />
    </AbsoluteFill>
  );
};

// ── ACTO 3 · ⭐ EL ÁREA DE PRODUCCIÓN sobre el vidrio de los DOS paneles ───────────────────────
// El área encendida ES lo que produce ese panel. Va en registro adentro de cada `PanelForm` (que
// lleva su FOTO REAL adentro): la gráfica se apoya sobre el material, nunca hace de panel.
const AreaProd: React.FC<{ nivel: number; w: number; h: number; sangra: number }> = ({
  nivel, w, h, sangra,
}) => {
  const hh = h * clamp01(nivel);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, width: w, bottom: 0, height: hh,
        background: `linear-gradient(180deg, ${rgba(V.volt, 0.72)} 0%, ${rgba(V.voltSoft, 0.3)} 100%)`,
        boxShadow: `0 -3px 22px ${rgba(V.volt, 0.44)}`,
      }} />
      {/* la línea de nivel: el canto neto de lo que queda */}
      <div style={{
        position: "absolute", left: 0, width: w, bottom: hh - 2, height: 4,
        background: rgba(V.white, 0.86),
      }} />
      {/* LAS ASTILLAS FRÍAS: el 70 % que se va. Suben y se van — `flujo("cobran")`, no vuelven. */}
      {sangra > 0.002 && Array.from({ length: 16 }, (_, i) => {
        const o = rnd(i * 5.9);
        const q = clamp01(sangra * 1.5 - o * 0.42);
        return (
          <div key={i} style={{
            position: "absolute",
            left: (0.04 + o * 0.9) * w, bottom: hh + q * h * 1.5,
            width: 26 + o * 54, height: 5,
            transform: `rotate(${(-16 - o * 20).toFixed(1)}deg)`,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.sky, 0.9)}, rgba(0,0,0,0))`,
            opacity: Math.sin(clamp01(q) * Math.PI),
          }} />
        );
      })}
    </div>
  );
};

// ── ACTO 4 · ⭐⭐ LA FILA — la gráfica que hace visible el mecanismo, en registro sobre el clip
//    real de la fila de celdas. Siete celdas con su NIVEL propio y un TREN DE CORRIENTE que las
//    atraviesa. La celda 3 es la que la sombra traga. Ver la cabecera del archivo (a) (b) (c).
const N_CEL = 7;
const CEL_TAP = 3;
const F_SOMBRA = 1002;   // la sombra real empieza a tragar la celda 3
const F_FRENO = 1016;    // el tren de corriente FRENA contra su borde y se amontona
const F_DRENA = 1026;    // los vecinos empiezan a igualar hacia abajo (5 f de escalonado)
const F_VUELVE = 1206;   // él movió los paneles: la sombra sale y los siete suben JUNTOS

const nivelDe = (g: number, i: number) => {
  const vuelve = es(clamp01((g - F_VUELVE) / 16));
  if (i === CEL_TAP) {
    const cubre = es(clamp01((g - F_SOMBRA) / 16));
    return lerp(lerp(1, 0.11, cubre), 1, vuelve);
  }
  // del centro hacia afuera: la 2 y la 4 primero, la 0 y la 6 al final
  const orden = Math.abs(i - CEL_TAP) - 1;
  const cae = es(clamp01((g - F_DRENA - orden * 5) / 14));
  return lerp(lerp(1, 0.13, cae), 1, vuelve);
};

const FilaCeldas: React.FC<{ g: number; op: number; y: number; w: number; h: number }> = ({
  g, op, y, w, h,
}) => {
  if (op <= 0.01) return null;
  const gap = 10;
  const cw = (w - gap * (N_CEL - 1)) / N_CEL;
  const left = 50 - (w / 1920) * 50;
  const frenado = g >= F_FRENO && g < F_VUELVE;
  // el tren de corriente: 18 guiones. Con la fila libre recorren toda la fila; con la celda tapada
  // se AMONTONAN contra su borde izquierdo (comprimidos, vibrando): la corriente no tiene paso.
  const stop = (CEL_TAP * (cw + gap)) / w;
  return (
    <div style={{
      position: "absolute", left: `${left}%`, top: `${y}%`, width: w, height: h + 76,
      marginTop: -h / 2, opacity: op, pointerEvents: "none",
    }}>
      {Array.from({ length: N_CEL }, (_, i) => {
        const nv = nivelDe(g, i);
        const tapada = i === CEL_TAP;
        const cubre = tapada ? es(clamp01((g - F_SOMBRA) / 16)) * clamp01(1 - (g - F_VUELVE) / 14) : 0;
        return (
          <div key={i} style={{
            position: "absolute", left: i * (cw + gap), top: 0, width: cw, height: h,
            border: `2px solid ${rgba(V.bone, 0.44)}`,
            boxShadow: `inset 0 0 26px ${rgba(V.ink0, 0.5)}`,
            overflow: "hidden",
          }}>
            {/* el NIVEL de esa celda: sube desde abajo, cálido mientras trabaja */}
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: `${(nv * 100).toFixed(1)}%`,
              background: `linear-gradient(180deg, ${rgba(V.volt, 0.8)} 0%, ${rgba(V.voltSoft, 0.34)} 100%)`,
            }} />
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: `calc(${(nv * 100).toFixed(1)}% - 2px)`,
              height: 4, background: rgba(V.white, 0.9),
            }} />
            {/* los DEDOS DE METAL de la celda, en registro con los del clip real */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.4,
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.bone, 0.4)} 0px, ${rgba(V.bone, 0.4)} 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 18px)`,
            }} />
            {/* la sombra dura sobre la celda tapada: entra desde la IZQUIERDA, como el sol rasante */}
            {cubre > 0.002 && (
              <div style={{
                position: "absolute", top: -4, bottom: -4, left: 0,
                width: `${(cubre * 112).toFixed(1)}%`,
                background: `linear-gradient(90deg, ${rgba(V.ink0, 0.94)} 0%, ${rgba(V.ink0, 0.9)} 76%, ${rgba(V.ink0, 0.0)} 100%)`,
              }} />
            )}
          </div>
        );
      })}
      {/* ⭐ EL TREN DE CORRIENTE. Frenado = todos los guiones comprimidos contra el borde de la
          celda tapada, vibrando. Es la imagen del mecanismo: la fila entera espera a UNA celda. */}
      {Array.from({ length: 18 }, (_, i) => {
        const libre = ((g * 0.0135) + i / 18) % 1;
        const amontonado = clamp01(stop - 0.012 - (17 - i) * 0.0125);
        const mezcla = frenado ? clamp01((g - F_FRENO) / 12) : 0;
        const t = frenado
          ? lerp(Math.min(libre, stop - 0.01), amontonado, mezcla)
          : libre;
        const vib = frenado ? Math.sin(g / 2.2 + i * 1.7) * 2.4 * mezcla : 0;
        return (
          <div key={`tr${i}`} style={{
            position: "absolute", left: t * w - 22, top: h + 26 + vib,
            width: 46, height: 7, borderRadius: 7,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.volt, 0.95)} 46%, rgba(0,0,0,0))`,
            boxShadow: `0 0 14px ${rgba(V.volt, 0.5)}`,
          }} />
        );
      })}
      {/* el riel por donde va la corriente: la línea que después continúa en la manguera */}
      <div style={{
        position: "absolute", left: 0, width: w, top: h + 29, height: 1.5,
        background: rgba(V.bone, 0.22),
      }} />
    </div>
  );
};

// ── LA CORRIENTE / EL CAUDAL — la materia del MATCH-MOVE interno @1118 ────────────────────────
// Los mismos guiones, la misma línea, la misma velocidad: primero son la corriente amontonada de la
// fila, después son las gotas que salen flojas del pico de la manguera. Nada frena en la frontera.
const Caudal: React.FC<{
  g: number; x0: number; y0: number; x1: number; y1: number; n?: number; speed?: number;
  color?: string; op?: number; gordo?: number;
}> = ({ g, x0, y0, x1, y1, n = 14, speed = 0.0135, color = V.volt, op = 1, gordo = 0 }) => {
  if (op <= 0.01) return null;
  const ang = (Math.atan2((y1 - y0) * 10.8, (x1 - x0) * 19.2) * 180) / Math.PI;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const t = ((g * speed) + i / n) % 1;
        const x = lerp(x0, x1, t);
        const y = lerp(y0, y1, t);
        const a = Math.sin(t * Math.PI) * op;
        const w = 40 + gordo * 66 + (i % 3) * 12;
        const h = 6 + gordo * 12;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
            width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
            transform: `rotate(${ang.toFixed(2)}deg)`, borderRadius: h,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(color, 0.94 * a)} 44%, rgba(0,0,0,0))`,
            boxShadow: `0 0 ${(16 * a).toFixed(0)}px ${rgba(color, 0.55 * a)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── ACTO 5 · EL RELOJ DE LA TARDE — la gráfica que mide la tarde que él pide que te sientes a
//    mirar. Va sobre el clip REAL de la sombra de la chimenea cruzando el patio.
const RelojTarde: React.FC<{ g: number; at: number; x: number; y: number; r?: number; op: number }> = ({
  g, at, x, y, r = 96, op,
}) => {
  if (op <= 0.01) return null;
  const t = es(clamp01((g - at) / 118));
  const hora = lerp(3, 7, t);                              // de las 3 a las 7 de la tarde
  const ang = -90 + (hora / 12) * 360;
  const rad = (ang * Math.PI) / 180;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2,
      marginLeft: -r, marginTop: -r, opacity: op, pointerEvents: "none",
      transform: `translateY(${(Math.sin(g / 63) * 2.4).toFixed(2)}px)`,
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `3px solid ${rgba(V.bone, 0.42)}`,
        boxShadow: `0 14px 40px ${rgba(V.ink0, 0.8)}, inset 0 0 40px ${rgba(V.ink0, 0.6)}`,
      }} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i / 12) * 360 - 90) * (Math.PI / 180);
        return (
          <div key={i} style={{
            position: "absolute", left: r + Math.cos(a) * (r - 16) - 2, top: r + Math.sin(a) * (r - 16) - 6,
            width: 4, height: 12, background: rgba(V.bone, 0.5),
            transform: `rotate(${(i / 12) * 360}deg)`,
          }} />
        );
      })}
      {/* la aguja = el filo de la sombra: la misma inclinación que la cuña de la apertura */}
      <div style={{
        position: "absolute", left: r, top: r, width: r - 22, height: 6, marginTop: -3,
        transformOrigin: "0% 50%", transform: `rotate(${ang.toFixed(2)}deg)`,
        background: `linear-gradient(90deg, ${rgba(V.amber, 0.98)}, ${rgba(V.amber, 0.32)})`,
        boxShadow: `0 0 18px ${rgba(V.amber, 0.6)}`,
      }} />
      <div style={{
        position: "absolute", left: r - 7, top: r - 7, width: 14, height: 14, borderRadius: "50%",
        background: V.amber,
      }} />
      <div style={{
        position: "absolute", left: r + Math.cos(rad) * (r + 26) - 46, top: r + Math.sin(rad) * (r + 26) - 20,
        width: 92, textAlign: "center",
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 1.4, color: V.white,
        textShadow: "0 4px 18px rgba(0,0,0,0.95)",
      }}>{Math.round(hora)}:00</div>
    </div>
  );
};

// ── LA CÁMARA · una sola función de g, con deriva viva, que NUNCA vuelve a cero ────────────────
const KF = [0, 120, 240, 360, 446, 540, 657, 760, 880, 945, 1010, 1090, 1150, 1206, 1292,
  1360, 1440, 1560, 1650, 1745, 1840, G_END];
const camAt = (g: number) => {
  // panX POSITIVO = el mundo viaja a la derecha = la cámara deriva hacia la IZQUIERDA (handoff)
  const base = gcam(g, { z0: -120, z1: 150, panX: 132, panY: -30, ry: -3.6, rx: -1.2, dur: G_END });
  const crane = interpolate(
    g, KF,
    [-120, -84, -56, -34, -18, 4, 22, 34, 20, -4, -28, -14, 6, 22, 34,
      22, 6, -12, -30, -12, 14, 38],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g, KF,
    [1.14, 1.05, 1.02, 1.07, 1.03, 1.00, 1.08, 1.02, 1.06, 1.26, 1.12, 1.03, 1.06, 1.02, 1.10,
      1.04, 1.01, 1.03, 1.09, 1.02, 1.06, 1.16],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const FK = [0, 240, 446, 657, 880, 945, 1090, 1292, 1440, 1650, 1745, 1840, G_END];
  const fx = interpolate(g, FK, [56, 46, 40, 58, 44, 50, 62, 44, 50, 40, 56, 46, 52], CL);
  const fy = interpolate(g, FK, [40, 46, 52, 44, 34, 50, 58, 46, 52, 44, 40, 56, 60], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// MediaCard tiene deriva propia (hold VIVO). Lo que se apoya ENCIMA tiene que derivar igual o la
// gráfica patina sobre el material.
const mcSync = (cf: number, x: number, y: number): React.CSSProperties => ({
  transform: `rotateY(${(Math.sin(cf / 67 + y) * 0.5).toFixed(3)}deg) translateY(${(Math.sin(cf / 41 + x) * 2.4).toFixed(2)}px)`,
});

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS7Oeste: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;   // pasa un frame mío al reloj de las primitivas del Stage

  // ── LA LUZ: función continua de g. Entra en HORA.alerta (14°, ámbar, 0.38), GIRA A PLANA (46°,
  //    cielo blanco cubierto) en los primeros 170 frames, y a partir del 300 se abre el cielo y
  //    entra el sol rasante de las 4 (HORA.rasante 6°, ámbar, 0.70), que ya no se va: es la hora
  //    del acto entero y la que le entrego a S8. Evoluciona, nunca salta. ─────────────────────
  const LK = [0, 12, 90, 170, 300, 446, 657, 880, 945, 1090, 1292, 1440, 1650, 1745, 1840, G_END];
  const sunAng = interpolate(g, LK,
    [HORA.alerta.ang, 20, 38, 46, 14, 7, 6, 6, 5, 4, 6, 5, 5, 4, 4, HORA.rasante.ang], CL);
  const amb = interpolate(g, LK,
    [HORA.alerta.amb, 0.60, 0.62, 0.64, 0.68, HORA.rasante.amb, 0.72, 0.74, 0.66, 0.68, 0.72, 0.74,
      0.72, 0.74, 0.72, HORA.rasante.amb], CL);
  // los tres soles: cálido (la tarde que te queda) · frío (el cielo cubierto, lo que se pierde) ·
  // blanco (el día plano de las nubes)
  const warmW = interpolate(g, LK,
    [0.10, 0.14, 0.16, 0.20, 0.56, 0.70, 0.72, 0.70, 0.58, 0.62, 0.70, 0.74, 0.72, 0.76, 0.86, 0.90], CL);
  const coldW = interpolate(g, LK,
    [0.34, 0.46, 0.60, 0.62, 0.40, 0.34, 0.44, 0.52, 0.36, 0.34, 0.30, 0.28, 0.30, 0.26, 0.18, 0.14], CL);
  const dayW = interpolate(g, LK,
    [0.44, 0.56, 0.72, 0.78, 0.60, 0.46, 0.44, 0.42, 0.40, 0.42, 0.44, 0.40, 0.38, 0.36, 0.30, 0.26], CL);
  const coolMix = interpolate(g, LK,
    [0.62, 0.72, 0.86, 0.90, 0.46, 0.24, 0.26, 0.32, 0.22, 0.20, 0.16, 0.14, 0.16, 0.12, 0.08, 0.06], CL);
  const keyFrom = interpolate(g, LK,
    [0.30, 0.34, 0.44, 0.50, 0.34, 0.22, 0.26, 0.34, 0.20, 0.24, 0.18, 0.22, 0.28, 0.20, 0.16, 0.12], CL);
  const inten = interpolate(g, LK,
    [0.72, 1.02, 1.00, 0.98, 0.96, 1.00, 0.96, 0.92, 0.86, 0.90, 0.96, 0.98, 0.94, 0.96, 0.90, 0.84], CL);
  const floorDim = interpolate(g, LK,
    [0.40, 0.44, 0.46, 0.48, 0.52, 0.56, 0.58, 0.60, 0.66, 0.62, 0.56, 0.54, 0.58, 0.56, 0.60, 0.64], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const abierta = isOpen(cov);
  const clip = clipOf(cov);
  const cantoHot = abierta ? clamp01(cov.half / 16) : 0;

  // ── FRONTERA A · MATCH-SHAPE. La esquina del panel se vuelve el display de la pinza. ────────
  const morfP = clamp01((g - 430) / 64);
  const morf = es(morfP);
  const mw = lerp(1180, 470, morf);
  const mh = lerp(664, 282, morf);
  const mxIn = es(clamp01((g - 396) / 30));
  const mx = lerp(lerp(112, 54, mxIn), 40, morf);
  const my = lerp(lerp(42, 46, mxIn), 52, morf);
  const cells = lerp(1, 0.12, clamp01((g - 442) / 46));
  const sweep = clamp01((g - 438) / 54);      // el borde DURO que repinta la superficie
  const verMorfo = g >= 394 && g < 520;

  // ── ACTO 2 · la CAUSA manda al EFECTO: `caida` gobierna a la vez cuánto avanzó la sombra sobre
  //    la esquina y en cuánto está el número de la pinza. Cae mientras la sombra avanza. ──────
  const caida = es(clamp01((g - 486) / 62));
  const vatios = Math.round(lerp(610, 180, caida) / 10) * 10;

  // ── ACTO 3 · el desangrado de las DOS áreas de producción ───────────────────────────────────
  const mancha = es(clamp01((g - 742) / 20));           // la mancha del tamaño de la hoja aterriza
  const sangra = es(clamp01((g - 764) / 34));           // las dos áreas se desangran hasta el 30 %
  const nivelArea = lerp(1, 0.3, sangra);

  // ── FRONTERA C · ZOOM-THROUGH: la cámara entra en UNA celda del panel de la izquierda ───────
  const zw = g >= 936 && g < 968 ? zoomThrough(g, 936, 28, 41, 46) : null;
  const zs: React.CSSProperties = zw
    ? { transform: zw.out, opacity: zw.opacity, transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d" };

  // ── ACTO 4 · el caudal (match-move @1118) y la vuelta de la fila ────────────────────────────
  const bota = es(clamp01((g - 1118) / 18));            // la bota se levanta: el chorro engorda

  // ── ACTO 5 · MATCH-SHAPE interno @1836: el rectángulo naranja del vidrio se acuesta y es el
  //    rectángulo naranja de la mesada. ────────────────────────────────────────────────────────
  const cocina = es(clamp01((g - 1836) / 40));
  // el fogonazo del sol sobre la superficie: pica en 1842, el frame del cambio de fondo
  const flare = clamp01(1 - Math.abs(g - 1842) / 22);

  // mounts (todo fondo se monta ANTES de su costura: un zoom-through o un corte contra nada es un
  // fundido a negro)
  const bgNublado = g < 322;   // se va POR EL RIEL, no se apaga
  const bgTarde = g >= 190 && g < 494;   // vive DEBAJO desde antes: nunca hay un frame sin suelo
  const bgPinza = g >= 438 && g < 668;    // se revela con el MISMO `sweep` que repinta el objeto
  const bgDosPaneles = g >= 654 && g < 970;   // ADENTRO de la oclusion de ladrillo (653-660)   // hasta que la opacidad del zoom-through llega a 0
  const bgFila = g >= 926 && g < 1064;
  const bgManguera = g >= 1058 && g < 1200;
  const bgArrastre = g >= 1192 && g < 1296;   // se va ADENTRO del pico del polvo (1288-1298)
  const bgPatioTarde = g >= 1296 && g < 1470;
  const bgSilla = g >= 1440 && g < 1745;   // se va EXACTAMENTE en el frame del corte
  const bgSur = g >= 1745 && g < 1846;
  const bgCocina = g >= 1842;   // ADENTRO del fogonazo naranja del match-shape

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          la cuña recorta. Ni un solo píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* la atmósfera se monta UNA vez para los 63,7 s: nunca se remonta entre actos */}
        <VoltAtmos
          tint={light(coolMix, "amber", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* el SOL es un personaje: su ángulo marca la hora. Acá entra RASANTE por la IZQUIERDA. */}
        <SunKey ang={sunAng} temp="amber" amb={warmW * amb} soft={70} />
        <SunKey ang={64} temp="sky" amb={coldW * amb * 0.72} soft={86} />
        <SunKey ang={sunAng} temp="white" amb={dayW * amb * 0.7} soft={90} />

        <Layers cam={cam}>
          {/* ── ACTO 1a · EL PATIO BAJO EL CIELO CUBIERTO. La materia entrante del handoff. ─── */}
          {/* EL MUNDO NUBLADO. No se apaga nunca: a partir del frame 196 SE VA POR EL RIEL hacia
              la izquierda, y la sombra de la chimenea entra por la derecha pegada a su canto, a la
              misma velocidad. Los dos embaldosan el cuadro sin un solo frame de hueco. */}
          {bgNublado && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${railPct(g).toFixed(2)}%)` }}>
              <Plane z={-620}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_paneles_cielo_gris.png" kind="photo" z={0}
                  scale={interpolate(g, [0, 120, 250, 322], [1.32, 1.2, 1.24, 1.28], CL)}
                  dim={interpolate(g, [0, 40, 140, 250, 322], [0.44, 0.32, 0.46, 0.5, 0.56], CL)} tint={V.sky} />
              </Plane>
              {g < 140 && (
                <Plane z={-560}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_nubes_cruzan_paneles.mp4" kind="video"
                    z={0} startFrom={0}
                    scale={interpolate(g, [0, 140], [1.32, 1.24], CL)}
                    dim={interpolate(g, [0, 60, 140], [0.44, 0.36, 0.46], CL)} tint={V.sky} />
                </Plane>
              )}
            </div>
          )}

          {/* ⭐ LA CURVA DE LA TARDE, en registro sobre el hormigón del patio. Se dibuja con el
              cuadro CERRADO y cuando la cuña abre queda sola en las bandas. */}
          {g >= 34 && g < 236 && (
            <Plane z={-240}>
              {/* la curva esta REGISTRADA en el hormigon del patio nublado: se va con el, por el
                  mismo riel. El dato se retira con las nubes; no se queda flotando. */}
              <div style={{
                opacity: clamp01((g - 34) / 12) * clamp01(1 - (g - 214) / 20),
                transform: `translateX(${railPct(g).toFixed(2)}%)`,
              }}>
                <CurvaTarde g={g} at={38} />
              </div>
            </Plane>
          )}

          {/* ── ACTO 1b · LA TARDE. El cielo se abre y entra el sol rasante: la sombra de la
              chimenea cruza el patio sobre el MISMO riel que traía la sombra de la nube. ───── */}
          {bgTarde && (
            <>
              {/* el patio de la tarde, quieto y DEBAJO de todo desde el frame 190 */}
              <Plane z={-900}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_patio_sombra_larga_chimenea.png" kind="photo"
                  z={0}
                  scale={interpolate(g, [190, 300, 494], [1.3, 1.2, 1.24], CL)}
                  dim={interpolate(g, [190, 240, 340, 494], [0.56, 0.4, 0.44, 0.6], CL)} tint={V.amber} />
              </Plane>
              {/* MATCH-MOVE @202 · la sombra de la chimenea entra pegada al canto derecho del mundo
                  nublado (+100 % sobre el MISMO riel): misma velocidad, misma direccion, misma
                  altura. A los dos lados del canto hay una sombra viajando. Nada frena. */}
              {g >= 196 && g < 332 && (
                <div style={{
                  position: "absolute", inset: 0,
                  transform: `translateX(${(100 + railPct(g)).toFixed(2)}%)`,
                }}>
                  <Plane z={-600}>
                    <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_sombra_chimenea_cruza_patio.mp4"
                      kind="video" z={0} startFrom={0}
                      scale={interpolate(g, [196, 332], [1.3, 1.18], CL)}
                      dim={interpolate(g, [196, 270, 332], [0.5, 0.38, 0.5], CL)} tint={V.amber} />
                  </Plane>
                </div>
              )}
            </>
          )}

          {/* ── ACTO 2 · LA PINZA EN LA PARED DEL PATIO ────────────────────────────────────── */}
          {bgPinza && (
            <Plane z={-880}>
              {/* ⭐ FRONTERA A · no hay ningun corte de fondo: el MUNDO ENTERO se repinta con el
                  mismo borde duro que repinta la superficie del objeto (`sweep`). Un solo filo
                  viaja por el cuadro y detras de el ya es la pared de la pinza. */}
              <div style={{
                position: "absolute", inset: 0,
                clipPath: `inset(0% 0% 0% ${((1 - sweep) * 100).toFixed(2)}%)`,
                WebkitClipPath: `inset(0% 0% 0% ${((1 - sweep) * 100).toFixed(2)}%)`,
              }}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_pinza_610_tarde.png" kind="photo" z={0}
                  scale={interpolate(g, [438, 560, 668], [1.3, 1.2, 1.26], CL)}
                  dim={interpolate(g, [438, 520, 600, 668], [0.56, 0.46, 0.52, 0.62], CL)} tint={V.amber} />
              </div>
            </Plane>
          )}

          {/* ── ACTO 3 · EL PATIO CON LOS DOS PANELES. Un solo fondo para los 288 frames. ──── */}
          {bgDosPaneles && (
            <AbsoluteFill style={zs}>
              <Plane z={-900}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_patio_sombra_larga_chimenea.png" kind="photo"
                  z={0}
                  scale={interpolate(g, [654, 760, 880, 960], [1.32, 1.2, 1.16, 1.22], CL)}
                  dim={interpolate(g, [654, 720, 800, 960], [0.6, 0.5, 0.6, 0.66], CL)} tint={V.amber} />
              </Plane>

              {/* ⭐⭐ LOS DOS PANELES. Cada uno es la FORMA MADRE (`PanelForm`) con su FOTO REAL
                  adentro, y encima el ÁREA ENCENDIDA que es lo que produce. La mancha del tamaño
                  de una hoja cae sobre la esquina de UNO y las DOS áreas se desangran. */}
              {g >= 690 && g < 950 && (
                <Plane z={-320}>
                  <div style={{
                    position: "absolute", left: "50%", top: "50%",
                    transform: `translate(-50%,-50%) translateY(${(Math.sin(g / 53) * 3).toFixed(2)}px) ` +
                      `scale(${(0.94 + 0.06 * es(clamp01((g - 690) / 40))).toFixed(3)})`,
                    display: "flex", opacity: clamp01((g - 690) / 16),
                  }}>
                    {/* PANEL IZQUIERDO — el que tiene la sombra en la esquina */}
                    <div style={{ position: "relative", marginRight: 44 }}>
                      <PanelForm w={584} h={352} cells={0.92} tint="#0E1A2B">
                        <MediaCard src="img/cmepanel30/cmep30_s7_macro_esquina_panel_sombra.png"
                          kind="photo" w={584} h={352} x={50} y={50} z={0}
                          lit={0.96} litColor={V.amber} radius={4} sheenAt={toCF(716)} />
                        <AreaProd nivel={nivelArea} w={584} h={352} sangra={sangra} />
                        {/* LA MANCHA del tamaño de una hoja de cuaderno: 168×122 contra 584 de
                            vidrio. Cae en la esquina de arriba a la izquierda y se queda. */}
                        {mancha > 0.002 && (
                          <div style={{
                            position: "absolute", left: 26,
                            top: lerp(-150, 12, mancha),
                            width: 168, height: 122,
                            transform: `rotate(${lerp(-9, -3, mancha).toFixed(1)}deg)`,
                            background: `linear-gradient(150deg, ${rgba(V.ink0, 0.94)}, ${rgba(V.ink0, 0.86)})`,
                            boxShadow: `0 10px 26px ${rgba(V.ink0, 0.8)}`,
                          }} />
                        )}
                      </PanelForm>
                    </div>
                    {/* PANEL DERECHO — limpio, y se desangra IGUAL */}
                    <div style={{ position: "relative" }}>
                      <PanelForm w={584} h={352} cells={0.92} tint="#0E1A2B">
                        <MediaCard src="img/cmepanel30/cmep30_s7_gotas_vidrio_panel.png"
                          kind="photo" w={584} h={352} x={50} y={50} z={0}
                          lit={0.96} litColor={V.amber} radius={4} sheenAt={toCF(742)} />
                        <AreaProd nivel={nivelArea} w={584} h={352} sangra={sangra} />
                      </PanelForm>
                    </div>
                  </div>
                </Plane>
              )}
            </AbsoluteFill>
          )}

          {/* ── ACTO 4a · LA FILA DE CELDAS EN MACRO. Se monta 19 f ANTES del zoom-through. ── */}
          {bgFila && (
            <>
              {/* z=-940: MAS LEJOS que el fondo del acto 3 (-900). Montarlo "antes" no alcanza:
                  en un contexto preserve-3d pinta el translateZ, no el orden del DOM. Con z=-820 la
                  fila tapaba al acto 3 diez frames ANTES de que arrancara el zoom-through. */}
              <Plane z={-940}>
                <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_celda_se_apaga.mp4" kind="video"
                  z={0} startFrom={0}
                  scale={interpolate(g, [926, 968, 1010, 1064], [2.2, 1.28, 1.18, 1.24], CL)}
                  dim={interpolate(g, [926, 968, 1010, 1064], [0.28, 0.46, 0.56, 0.62], CL)} tint={V.amber} />
              </Plane>
              {/* ⭐⭐ LA FILA: siete celdas con su nivel y el tren de corriente que se amontona */}
              <Plane z={-300}>
                <FilaCeldas g={g} y={44} w={1240} h={188}
                  op={clamp01((g - 968) / 14) * clamp01(1 - (g - 1052) / 12)} />
              </Plane>
            </>
          )}

          {/* ── ACTO 4b · LA MANGUERA CON LA BOTA ENCIMA. El caudal cruza la frontera. ─────── */}
          {bgManguera && (
            <Plane z={-840}>
              <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_manguera_pisoton.mp4" kind="video"
                z={0} startFrom={0}
                scale={interpolate(g, [1058, 1118, 1200], [1.3, 1.18, 1.22], CL)}
                dim={interpolate(g, [1058, 1100, 1150, 1200], [0.56, 0.42, 0.38, 0.5], CL)} tint={V.amber} />
            </Plane>
          )}

          {/* ── ACTO 4c · ÉL ARRASTRA LOS PANELES. La sombra sale de la celda: la fila vuelve. ─ */}
          {bgArrastre && (
            <Plane z={-860}>
              <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_claudio_arrastra_paneles.mp4"
                kind="video" z={0} startFrom={0}
                scale={interpolate(g, [1192, 1250, 1296], [1.3, 1.18, 1.24], CL)}
                dim={interpolate(g, [1192, 1240, 1296], [0.5, 0.4, 0.54], CL)} tint={V.amber} />
            </Plane>
          )}

          {/* ── ACTO 5a · EL PATIO Y LA TARDE QUE HAY QUE SENTARSE A MIRAR ─────────────────── */}
          {bgPatioTarde && (
            <>
              <Plane z={-900}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_patio_sombra_larga_chimenea.png" kind="photo"
                  z={0}
                  scale={interpolate(g, [1296, 1400, 1470], [1.32, 1.2, 1.16], CL)}
                  dim={interpolate(g, [1296, 1360, 1470], [0.5, 0.42, 0.52], CL)} tint={V.amber} />
              </Plane>
              {g >= 1306 && g < 1436 && (
                <Plane z={-640}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_sombra_chimenea_cruza_patio.mp4"
                    kind="video" z={0} startFrom={4}
                    scale={interpolate(g, [1306, 1436], [1.24, 1.14], CL)}
                    dim={interpolate(g, [1306, 1370, 1436], [0.46, 0.36, 0.5], CL)} tint={V.amber} />
                </Plane>
              )}
            </>
          )}

          {/* ── ACTO 5b · ÉL SENTADO EN LA SILLA, MIRANDO CAER LAS SOMBRAS ─────────────────── */}
          {bgSilla && (
            <Plane z={-880}>
              <PhotoPlane src="img/cmepanel30/cmep30_s7_claudio_silla_mira_sombras.png" kind="photo"
                z={0}
                scale={interpolate(g, [1440, 1560, 1660, 1745], [1.3, 1.2, 1.16, 1.22], CL)}
                dim={interpolate(g, [1440, 1520, 1620, 1745], [0.54, 0.44, 0.5, 0.6], CL)} tint={V.amber} />
            </Plane>
          )}

          {/* ── ACTO 5c · LOS DOS PANELES AL SUR — CORTE EN EL BEAT @1745 ──────────────────── */}
          {bgSur && (
            <>
              <Plane z={-900}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_dos_paneles_angulos_distintos.png"
                  kind="photo" z={0}
                  scale={interpolate(g, [1745, 1800, 1846], [1.3, 1.2, 1.16], CL)}
                  dim={interpolate(g, [1745, 1800, 1846], [0.5, 0.42, 0.38], CL)} tint={V.amber} />
              </Plane>
              {g >= 1758 && g < 1846 && (
                <Plane z={-660}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_sol_rasante_reflejo_vidrio.mp4"
                    kind="video" z={0} startFrom={0}
                    scale={interpolate(g, [1758, 1846], [1.24, 1.16], CL)}
                    dim={interpolate(g, [1758, 1820, 1846], [0.44, 0.36, 0.32], CL)} tint={V.amber} />
                </Plane>
              )}
            </>
          )}

          {/* ── SALIDA · LA COCINA AL ATARDECER. La materia saliente del handoff. ──────────── */}
          {bgCocina && (
            <>
              <Plane z={-900}>
                <PhotoPlane src="img/cmepanel30/cmep30_s7_cocina_luz_naranja_mesada.png" kind="photo"
                  z={0}
                  scale={interpolate(g, [1842, 1910], [1.28, 1.18], CL)}
                  dim={interpolate(g, [1842, 1876, 1910], [0.5, 0.4, 0.34], CL)} tint={V.amber} />
              </Plane>
              {g >= 1840 && (
                <Plane z={-660}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s7_clip_cocina_luz_naranja_mesada.mp4"
                    kind="video" z={0} startFrom={0}
                    scale={interpolate(g, [1840, 1910], [1.22, 1.12], CL)}
                    dim={interpolate(g, [1840, 1880, 1910], [0.5, 0.38, 0.32], CL)} tint={V.amber} />
                </Plane>
              )}
            </>
          )}
        </Layers>
      </AbsoluteFill>

      {/* los cantos de la cuña: el brillo sale SIEMPRE hacia el mundo, jamás hacia la cara */}
      {abierta && <CantosCuna c={cov} hot={cantoHot} />}

      {/* ════ EL PRIMER PLANO — no está recortado. Con la cuña ABIERTA todo vive en x<24 % o
          x>76 % y por encima de y=42 %: nunca en la caja de la cara, nunca sobre boca ni mentón. */}
      <Layers cam={cam}>

        {/* ═══ ACTO 1 · "SE CAÍA A PIQUE" ═════════════════════════════════════════════════════ */}
        {/* la materia ENTRANTE: el vidrio del panel devolviendo el blanco del cielo. Entra grande,
            se achica y se va de cuadro VIAJANDO hacia la izquierda antes de que abra la cuña. */}
        {g < 126 && (
          <Plane z={140}>
            <MediaCard src="img/cmepanel30/cmep30_s7_gotas_vidrio_panel.png" kind="photo"
              w={lerp(1140, 470, es(clamp01((g - 22) / 84)))}
              h={lerp(642, 264, es(clamp01((g - 22) / 84)))}
              x={lerp(50, -20, es(clamp01((g - 22) / 96)))}
              y={lerp(50, 34, es(clamp01((g - 22) / 96)))}
              z={0} ry={lerp(3, 17, es(clamp01((g - 22) / 96)))} rx={2}
              lit={1} litColor={V.sky}
              label={g >= 14 ? "EL CIELO EN EL VIDRIO" : undefined}
              sheenAt={toCF(30)} radius={14} />
          </Plane>
        )}

        {/* el aviso, con el cuadro CERRADO: bajar el ruido antes de que él aparezca */}
        <Plane z={210}>
          <Cartel g={g} at={44} out={100} x={50} y={74} size={62} color={V.white}>
            A LAS 4 DE LA TARDE<br />SE CAÍA <span style={{ color: V.danger }}>A PIQUE</span>
          </Cartel>
        </Plane>

        {/* con la cuña abierta: el reloj y la palabra en las bandas, arriba, lejos de su cara */}
        {g >= 130 && g < 236 && (
          <Plane z={220}>
            <div style={{ opacity: clamp01((g - 130) / 12) * clamp01(1 - (g - 216) / 16) }}>
              <IconPng src="img/cmepanel30/cmep30_ic_reloj.png" x={12} y={22} size={104} z={0}
                opacity={0.94} rot={-5} glow={V.ink0} />
              <Rotulo x={12} y={37} size={38} color={V.white}>4 DE LA TARDE</Rotulo>
            </div>
          </Plane>
        )}
        {g >= 152 && g < 240 && (() => {
          const fl = flujo("cobran", clamp01((g - 152) / 24));
          return (
            <Plane z={240}>
              <div style={{
                transform: `translateY(${(fl.dy * 0.5).toFixed(1)}px)`,
                opacity: fl.opacity * clamp01(1 - (g - 224) / 14),
              }}>
                <Rotulo x={85} y={24} size={58} color={V.white}>EL SEGUNDO</Rotulo>
                <Rotulo x={85} y={33} size={76} color={V.amber}>ERROR</Rotulo>
                <Rotulo x={85} y={41} size={38} color={rgba(V.bone, 0.92)}>LA SOMBRA</Rotulo>
              </div>
            </Plane>
          );
        })()}

        {/* 202 · MATCH-MOVE INTERNO: la sombra de la chimenea llega por el MISMO riel que traía la
            sombra de la nube. El material real de la chimenea entra viajando con él. */}
        {g >= 246 && g < 382 && (
          <Plane z={170}>
            <MediaCard src="img/cmepanel30/cmep30_s7_chimenea_vecino_tarde.png" kind="photo"
              w={430} h={258}
              x={lerp(118, 78, es(clamp01((g - 246) / 40)))}
              y={lerp(38, 34, es(clamp01((g - 246) / 70)))}
              z={0} ry={-13} rx={2} lit={1} litColor={V.amber}
              label="LA CHIMENEA DEL VECINO" sheenAt={toCF(304)} radius={12} />
          </Plane>
        )}
        {g >= 288 && g < 420 && (
          <Plane z={180}>
            <MediaCard src="img/cmepanel30/cmep30_s7_sombra_borde_superior_panel.png" kind="photo"
              w={440} h={264}
              x={lerp(-18, 20, es(clamp01((g - 288) / 38)))}
              y={lerp(70, 64, es(clamp01((g - 288) / 66)))}
              z={0} ry={13} rx={-2} lit={1} litColor={V.amber}
              label="UNA ESQUINA, NADA MÁS" sheenAt={toCF(346)} radius={12} />
          </Plane>
        )}
        <Plane z={230}>
          <Cartel g={g} at={300} out={392} x={50} y={20} size={54} color={V.white}>
            LE TAPABA <span style={{ color: V.amber }}>UNA ESQUINA</span>
          </Cartel>
        </Plane>

        {/* ═══ FRONTERA A · MATCH-SHAPE — LA ESQUINA DEL PANEL SE VUELVE EL DISPLAY DE LA PINZA
            El objeto NO suelta el cuadro: se achica, pierde la grilla de celdas, le sube el radio
            y la superficie se repinta con un borde DURO que viaja. Nunca un fundido. ═════════ */}
        {verMorfo && (
          <Plane z={120}>
            <div style={{
              position: "absolute", left: `${mx.toFixed(3)}%`, top: `${my.toFixed(3)}%`,
              width: mw, height: mh, marginLeft: -mw / 2, marginTop: -mh / 2,
              transform: `rotateY(${lerp(-12, 0, morf).toFixed(2)}deg) rotateX(${lerp(3, 0, morf).toFixed(2)}deg) ` +
                `translateY(${(Math.sin(g / 47) * 2.4).toFixed(2)}px)`,
              transformStyle: "preserve-3d",
            }}>
              <PanelForm w={mw} h={mh} cells={cells} tint="#0E1A2B" style={{ position: "absolute", inset: 0 }}>
                {/* SUPERFICIE 1 · la esquina tapada (la materia que viene del acto 1) */}
                <MediaCard src="img/cmepanel30/cmep30_s7_macro_esquina_panel_sombra.png" kind="photo"
                  w={mw} h={mh} x={50} y={50} z={0} lit={1} litColor={V.amber}
                  sheenAt={toCF(410)} radius={lerp(4, 12, morf)} />
                {/* SUPERFICIE 2 · el display de la pinza. Se revela con un BORDE NETO. */}
                {sweep > 0.001 && (
                  <div style={{
                    position: "absolute", inset: 0,
                    clipPath: `inset(0% 0% 0% ${((1 - sweep) * 100).toFixed(2)}%)`,
                    WebkitClipPath: `inset(0% 0% 0% ${((1 - sweep) * 100).toFixed(2)}%)`,
                  }}>
                    <MediaCard src="img/cmepanel30/cmep30_s7_pinza_610_tarde.png" kind="photo"
                      w={mw} h={mh} x={50} y={50} z={0} lit={1} litColor={V.volt}
                      radius={lerp(4, 12, morf)} />
                  </div>
                )}
                {/* el especular montado sobre el borde: la superficie se REPINTA, no se cruza */}
                {sweep > 0.001 && sweep < 0.999 && (
                  <div style={{
                    position: "absolute", top: 0, bottom: 0, left: `${((1 - sweep) * 100).toFixed(2)}%`,
                    width: 130, marginLeft: -65,
                    background: `linear-gradient(90deg, rgba(255,255,255,0), ${rgba(V.white, 0.5)} 48%, rgba(255,255,255,0))`,
                    mixBlendMode: "screen",
                  }} />
                )}
              </PanelForm>
            </div>
          </Plane>
        )}

        {/* ═══ ACTO 2 · "610 A LAS 4:10 · 180 A LAS 4:20" ══════════════════════════════════════
            LA CAUSA Y EL EFECTO EN EL MISMO CUADRO, los dos con material REAL: a la izquierda la
            sombra avanzando sobre la esquina, a la derecha la pinza cayendo. ═════════════════ */}
        {g >= A2 + 6 && g < 668 && (
          <>
            {g >= 458 && g < 590 && (
              <Plane z={170}>
                <MediaCard src="broll/cmepanel30/cmep30_s7_clip_sombra_avanza_esquina.mp4"
                  kind="video" w={430} h={258}
                  x={lerp(-18, 15, es(clamp01((g - 458) / 36)))}
                  y={lerp(38, 33, es(clamp01((g - 458) / 60)))}
                  z={0} ry={13} rx={-2} startFrom={2} lit={1} litColor={V.amber}
                  label="LA CAUSA" sheenAt={toCF(514)} radius={12} />
              </Plane>
            )}
            {g >= 466 && g < 602 && (
              <Plane z={175}>
                <MediaCard src="broll/cmepanel30/cmep30_s7_clip_pinza_cae_610_180.mp4"
                  kind="video" w={470} h={282}
                  x={lerp(120, 84, es(clamp01((g - 466) / 36)))}
                  y={lerp(40, 35, es(clamp01((g - 466) / 60)))}
                  z={0} ry={-13} rx={2} startFrom={2} lit={1} litColor={V.volt}
                  label="EL EFECTO" sheenAt={toCF(522)} radius={12} />
                {/* la cifra la escribe el kit y la MANDA la sombra: `caida` gobierna a las dos */}
                <div style={{ position: "absolute", inset: 0, ...mcSync(cf, 84, 35) }}>
                  <Readout value={String(vatios)} unit="W" label="LA PINZA" at={toCF(486)}
                    x={84} y={35} size={92} color={caida > 0.6 ? V.danger : V.volt} />
                </div>
              </Plane>
            )}
            {/* los dos relojes: 4:10 y 4:20. Diez minutos, la misma tarde. */}
            <Plane z={230}>
              {g >= 470 && g < 560 && (
                <Rotulo x={50} y={18} size={54} color={V.white}
                  op={clamp01((g - 470) / 12) * clamp01(1 - (g - 542) / 16)}>
                  4:10 · <span style={{ color: V.volt }}>610 VATIOS</span>
                </Rotulo>
              )}
              {/* con la cuna ABIERTA (560-650) el 4:20 se va a la banda DERECHA, apilado: nada
                  centrado puede quedar a la altura de su frente. */}
              {g >= 556 && g < 654 && (() => {
                const op = clamp01((g - 556) / 12) * clamp01(1 - (g - 638) / 14);
                return (
                  <>
                    <Rotulo x={94} y={17} size={50} color={V.white} align="right" op={op}>4:20</Rotulo>
                    <Rotulo x={94} y={25} size={62} color={V.danger} align="right" op={op}>180 VATIOS</Rotulo>
                  </>
                );
              })()}
            </Plane>
            {/* con la cuña abierta (560-650) sólo queda esto, arriba y en las bandas */}
            {g >= 574 && g < 650 && (
              <Plane z={240}>
                <div style={{ opacity: clamp01((g - 574) / 12) * clamp01(1 - (g - 636) / 12) }}>
                  <IconPng src="img/cmepanel30/cmep30_ic_pinza.png" x={13} y={26} size={106} z={0}
                    opacity={0.92} rot={-6} glow={V.ink0} />
                  <Rotulo x={13} y={40} size={36} color={rgba(V.bone, 0.94)}>DIEZ MINUTOS</Rotulo>
                </div>
              </Plane>
            )}
          </>
        )}

        {/* ═══ ACTO 3 · ⭐ EL 70 % DE LOS DOS PANELES ══════════════════════════════════════════ */}
        {g >= A3 + 7 && g < 950 && (
          <>
            {/* la PRUEBA del tamaño, con material real: la hoja apoyada en el vidrio al lado de una
                sombra igual. Es lo que hace que la mancha del panel se lea como "una hoja". */}
            {g >= 700 && g < 836 && (
              <Plane z={190}>
                <MediaCard src="img/cmepanel30/cmep30_s7_hoja_papel_sobre_panel.png" kind="photo"
                  w={392} h={236}
                  x={lerp(-16, 15, es(clamp01((g - 700) / 36)))}
                  y={lerp(28, 24, es(clamp01((g - 700) / 60)))}
                  z={0} ry={13} rx={-2} lit={1} litColor={V.bone}
                  label="DEL TAMAÑO DE ESTO" sheenAt={toCF(760)} radius={12} />
                <IconPng src="img/cmepanel30/cmep30_ic_regla.png" x={15} y={41} size={92} z={0}
                  opacity={0.88 * clamp01((g - 726) / 14) * clamp01(1 - (g - 824) / 12)}
                  rot={-8} glow={V.ink0} />
              </Plane>
            )}

            {/* EL 70 % — entra FRÍO y desde ARRIBA: es lo que se va y no vuelve. `flujo("cobran")`
                literal. Viaja con las astillas, no es un rótulo quieto. */}
            {g >= 768 && g < 906 && (() => {
              const fl = flujo("cobran", clamp01((g - 768) / 26));
              return (
                <Plane z={250}>
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.5).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 888) / 16),
                  }}>
                    <Readout value="70" unit="%" label="SE LO LLEVÓ PUESTO" at={toCF(771)}
                      x={interpolate(g, [771, 830, 890], [85, 85, 78], CL)}
                      y={interpolate(g, [771, 890], [24, 20], CL)}
                      size={interpolate(g, [771, 812, 890], [178, 138, 132], CL)} color={V.sky} />
                  </div>
                </Plane>
              );
            })()}

            <Plane z={240}>
              <Cartel g={g} at={846} out={932} x={50} y={80} size={58} color={V.white}>
                DE <span style={{ color: V.amber }}>LOS DOS</span> PANELES JUNTOS
              </Cartel>
              {g >= 676 && g < 760 && (
                <Rotulo x={50} y={15} size={50} color={V.white}
                  op={clamp01((g - 676) / 12) * clamp01(1 - (g - 744) / 14)}>
                  UNA SOMBRA DE <span style={{ color: V.amber }}>NADA</span>
                </Rotulo>
              )}
              {g >= 792 && g < 848 && (
                <Rotulo x={18} y={78} size={38} color={rgba(V.bone, 0.94)}
                  op={clamp01((g - 792) / 12) * clamp01(1 - (g - 834) / 12)}>
                  EL PANEL LIMPIO TAMBIÉN
                </Rotulo>
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 4 · ⭐⭐ LA FILA Y EL PISOTÓN ═══════════════════════════════════════════════ */}
        {g >= A4 + 5 && g < 1306 && (
          <>
            <Plane z={230}>
              <Cartel g={g} at={958} out={1010} x={50} y={17} size={58} color={V.white}>
                ASÍ FUNCIONA <span style={{ color: V.volt }}>UN PANEL</span>
              </Cartel>
              {g >= 976 && g < 1030 && (
                <Rotulo x={50} y={84} size={44} color={rgba(V.bone, 0.96)}
                  op={clamp01((g - 976) / 12) * clamp01(1 - (g - 1016) / 12)}>
                  LAS CELDAS VAN EN FILA
                </Rotulo>
              )}
              {/* el titular del mecanismo, cuando los siete niveles ya se igualaron abajo */}
              <Cartel g={g} at={1040} out={1104} x={50} y={84} size={54} color={V.white}>
                TODA LA FILA AL RITMO<br />DE <span style={{ color: V.danger }}>LA MÁS TAPADA</span>
              </Cartel>
            </Plane>

            {/* la lupa sobre la celda tragada: material real, la micro de UNA celda tapada */}
            {g >= 1000 && g < 1054 && (
              <Plane z={200}>
                <MediaCard src="img/cmepanel30/cmep30_s7_fila_celdas_una_tapada.png" kind="photo"
                  w={352} h={212}
                  x={lerp(-16, 14, es(clamp01((g - 1000) / 30)))} y={22}
                  z={0} ry={12} rx={-2} lit={1} litColor={V.amber}
                  label="UNA SOLA CELDA" sheenAt={toCF(1032)} radius={10} />
              </Plane>
            )}

            {/* ── COSTURA INTERNA @1118 · MATCH-MOVE — EL CAUDAL ──────────────────────────────
                Los guiones amontonados de la fila y las gotas del pico de la manguera van sobre la
                MISMA línea, a la MISMA velocidad y en la MISMA dirección. Cuando la bota se
                levanta, el caudal engorda: la metáfora aterriza en material real. */}
            <Plane z={90}>
              <Caudal g={g} x0={22} y0={71} x1={74} y1={57} n={12} speed={0.0135} color={V.volt}
                op={clamp01((g - 1056) / 16) * clamp01(1 - (g - 1178) / 20)}
                gordo={bota} />
            </Plane>

            {/* la foto de la bota sobre la manguera: el objeto va SIEMPRE con su material real */}
            {g >= 1064 && g < 1114 && (
              <Plane z={190}>
                <MediaCard src="img/cmepanel30/cmep30_s7_manguera_pisada_bota.png" kind="photo"
                  w={370} h={222} x={86} y={26} z={0} ry={-12} rx={2}
                  lit={1} litColor={V.amber} label="UN PISOTÓN EN EL MEDIO"
                  sheenAt={toCF(1092)} radius={10} />
              </Plane>
            )}
            <Plane z={230}>
              <Cartel g={g} at={1108} out={1176} x={50} y={18} size={56} color={V.white}>
                COMO UNA MANGUERA<br />CON UN <span style={{ color: V.amber }}>PISOTÓN</span>
              </Cartel>
            </Plane>

            {/* "recuperé todo": la fila vuelve, chiquita y en la banda, con la cuña ya abierta */}
            {g >= 1206 && g < 1292 && (
              <Plane z={210}>
                <div style={{
                  position: "absolute", left: "13%", top: "27%", width: 300, height: 78,
                  marginLeft: -150, marginTop: -39,
                  opacity: clamp01((g - 1206) / 10) * clamp01(1 - (g - 1278) / 12),
                  transform: `translateY(${(Math.sin(g / 49) * 2.2).toFixed(2)}px)`,
                }}>
                  {Array.from({ length: N_CEL }, (_, i) => {
                    const nv = nivelDe(g, i);
                    return (
                      <div key={i} style={{
                        position: "absolute", left: i * 43, top: 0, width: 36, height: 78,
                        border: `2px solid ${rgba(V.bone, 0.44)}`, overflow: "hidden",
                        boxShadow: `0 6px 18px ${rgba(V.ink0, 0.7)}`,
                      }}>
                        <div style={{
                          position: "absolute", left: 0, right: 0, bottom: 0,
                          height: `${(nv * 100).toFixed(1)}%`,
                          background: `linear-gradient(180deg, ${rgba(V.volt, 0.86)}, ${rgba(V.voltSoft, 0.36)})`,
                        }} />
                      </div>
                    );
                  })}
                </div>
                <Rotulo x={13} y={38} size={38} color={V.white}
                  op={clamp01((g - 1218) / 12) * clamp01(1 - (g - 1278) / 12)}>
                  METRO Y MEDIO
                </Rotulo>
                <Rotulo x={87} y={20} size={54} color={V.volt}
                  op={clamp01((g - 1232) / 12) * clamp01(1 - (g - 1278) / 12)}>
                  RECUPERÉ
                </Rotulo>
                <Rotulo x={87} y={29} size={54} color={V.volt}
                  op={clamp01((g - 1240) / 12) * clamp01(1 - (g - 1278) / 12)}>
                  TODO
                </Rotulo>
              </Plane>
            )}
          </>
        )}

        {/* ═══ ACTO 5 · "LA TARDE QUE VALE MÁS" ═══════════════════════════════════════════════ */}
        {g >= A5 + 6 && (
          <>
            {/* el reloj de la tarde sobre el patio real: de las 3 a las 7, la sombra caminando */}
            <Plane z={200}>
              <RelojTarde g={g} at={1312} x={82} y={30} r={96}
                op={clamp01((g - 1312) / 16) * clamp01(1 - (g - 1408) / 14)} />
            </Plane>
            <Plane z={230}>
              <Cartel g={g} at={1304} out={1392} x={40} y={80} size={54} color={V.white}>
                SIÉNTATE UNA TARDE<br />A MIRAR <span style={{ color: V.amber }}>LAS SOMBRAS</span>
              </Cartel>
            </Plane>
            {g >= 1330 && g < 1404 && (
              <Plane z={180}>
                <MediaCard src="broll/cmepanel30/cmep30_s7_clip_claudio_sentado_mira_sombras.mp4"
                  kind="video" w={392} h={236}
                  x={lerp(-16, 16, es(clamp01((g - 1330) / 34)))} y={30}
                  z={0} ry={12} rx={-2} startFrom={2} lit={1} litColor={V.amber}
                  label="UNA TARDE ENTERA" sheenAt={toCF(1378)} radius={12} />
              </Plane>
            )}

            {/* 1408-1538 · VENTANA W4 · CONTENCIÓN TOTAL: acá no hay una sola tarjeta flotante.
                Sólo él, el patio en las bandas de la cuña, y una frase que sube CÁLIDA desde abajo
                porque es lo que a vos te queda — `flujo("queda")` literal. */}
            {g >= 1444 && g < 1548 && (() => {
              const fl = flujo("queda", clamp01((g - 1444) / 26));
              return (
                <Plane z={250}>
                  <div style={{
                    transform: `translateY(${(fl.dy * 0.32).toFixed(1)}px)`,
                    opacity: fl.opacity * clamp01(1 - (g - 1530) / 16),
                  }}>
                    <Rotulo x={8} y={22} size={54} color={V.white} align="left">ESA TARDE</Rotulo>
                    <Rotulo x={8} y={30} size={54} color={V.amber} align="left">VALE MÁS</Rotulo>
                    <Rotulo x={94} y={20} size={42} color={V.white} align="right">QUE</Rotulo>
                    <Rotulo x={94} y={27} size={42} color={V.white} align="right">CUALQUIER</Rotulo>
                    <Rotulo x={94} y={34} size={42} color={rgba(V.bone, 0.94)} align="right">CONSEJO MÍO</Rotulo>
                  </div>
                </Plane>
              );
            })()}

            {/* "la prueba que más cambió el resultado del mes" — el gancho hacia el OESTE */}
            <Plane z={235}>
              <Cartel g={g} at={1576} out={1660} x={50} y={22} size={58} color={V.white}>
                LA PRUEBA QUE MÁS<br /><span style={{ color: V.volt }}>CAMBIÓ EL MES</span>
              </Cartel>
            </Plane>
            {g >= 1604 && g < 1740 && (
              <Plane z={185}>
                <MediaCard src="img/cmepanel30/cmep30_s7_claudio_cuclillas_sombra.png" kind="photo"
                  w={430} h={258}
                  x={lerp(-18, 20, es(clamp01((g - 1604) / 36)))}
                  y={lerp(72, 66, es(clamp01((g - 1604) / 64)))}
                  z={0} ry={13} rx={-3} lit={1} litColor={V.amber}
                  label="AHÍ SE ME OCURRIÓ" sheenAt={toCF(1668)} radius={12} />
              </Plane>
            )}

            {/* ── COSTURA INTERNA @1745 · CORTE EN EL BEAT. La BISAGRA es este rótulo: misma x,
                misma y, mismo cuerpo a los dos lados del corte durante 18 frames. ──────────── */}
            <Plane z={252}>
              {g >= 1728 && g < 1846 && (
                <Rotulo x={50} y={17} size={64} color={V.white}
                  op={clamp01((g - 1728) / 10) * clamp01(1 - (g - 1828) / 16)}>
                  LOS DOS <span style={{ color: V.amber }}>AL SUR</span>
                </Rotulo>
              )}
            </Plane>
            {g >= 1762 && g < 1846 && (
              <Plane z={210}>
                <div style={{ opacity: clamp01((g - 1762) / 12) * clamp01(1 - (g - 1830) / 14) }}>
                  <IconPng src="img/cmepanel30/cmep30_ic_mapa.png" x={14} y={30} size={116} z={0}
                    opacity={0.92} rot={-4} glow={V.ink0} />
                  <IconPng src="img/cmepanel30/cmep30_ic_flecha.png" x={14} y={45} size={86} z={0}
                    opacity={0.9} rot={90} glow={V.ink0} />
                  <Rotulo x={17} y={56} size={34} color={rgba(V.bone, 0.94)}>LO QUE DICE TODO EL MUNDO</Rotulo>
                </div>
              </Plane>
            )}
            {/* la palabra que el movimiento siguiente va a romper: ENERGÍA TOTAL */}
            {g >= 1790 && g < 1880 && (
              <Plane z={246}>
                <div style={{ opacity: clamp01((g - 1790) / 12) * clamp01(1 - (g - 1862) / 16) }}>
                  <Rotulo x={50} y={76} size={44} color={V.white}>LA MAYOR CANTIDAD</Rotulo>
                  <Rotulo x={50} y={85} size={72} color={V.volt}>DE ENERGÍA TOTAL</Rotulo>
                </div>
              </Plane>
            )}

            {/* ── COSTURA INTERNA @1836 · MATCH-SHAPE: el rectángulo naranja que el sol rasante
                apoya sobre el VIDRIO se acuesta y es el rectángulo naranja que el mismo sol apoya
                sobre la MESADA de la cocina. La misma luz, dos superficies. ────────────────── */}
            {g >= 1806 && (
              <Plane z={130}>
                <div style={{
                  position: "absolute",
                  left: `${lerp(60, 42, cocina).toFixed(2)}%`,
                  top: `${lerp(46, 68, cocina).toFixed(2)}%`,
                  width: lerp(520, 940, cocina), height: lerp(190, 92, cocina),
                  marginLeft: lerp(-260, -470, cocina), marginTop: lerp(-95, -46, cocina),
                  transform: `rotate(${lerp(-13, -3.4, cocina).toFixed(2)}deg) ` +
                    `skewX(${lerp(-16, -26, cocina).toFixed(2)}deg) ` +
                    `translateY(${(Math.sin(g / 57) * 2).toFixed(2)}px)`,
                  background:
                    `linear-gradient(94deg, rgba(0,0,0,0) 0%, ${rgba(NARANJA, 0.5)} 12%, ` +
                    `${rgba(NARANJA, 0.72)} 50%, ${rgba(NARANJA, 0.42)} 86%, rgba(0,0,0,0) 100%)`,
                  boxShadow: `0 0 ${(90 + 220 * flare).toFixed(0)}px ${rgba(NARANJA, 0.34 + 0.5 * flare)}`,
                  mixBlendMode: "screen",
                  opacity: clamp01((g - 1806) / 16),
                }} />
                {/* EL FOGONAZO: la misma luz, no un velo. Pica en 1842, que es exactamente el frame
                    en que la superficie de abajo pasa del vidrio a la mesada. La luz tapa su propio
                    cambio de superficie: no hay un fundido, hay un reflejo. */}
                {flare > 0.002 && (
                  <AbsoluteFill style={{
                    background:
                      `radial-gradient(96% 74% at 34% 52%, ${rgba(NARANJA, 0.72 * flare)} 0%, ` +
                      `${rgba(NARANJA, 0.26 * flare)} 42%, rgba(0,0,0,0) 78%)`,
                    mixBlendMode: "screen", pointerEvents: "none",
                  }} />
                )}
              </Plane>
            )}
            {g >= 1854 && (
              <Plane z={220}>
                <Rotulo x={50} y={20} size={52} color={V.white}
                  op={clamp01((g - 1854) / 14)}>
                  LAS <span style={{ color: NARANJA }}>SEIS DE LA TARDE</span>
                </Rotulo>
                <IconPng src="img/cmepanel30/cmep30_ic_casa.png" x={86} y={72} size={104} z={0}
                  opacity={0.84 * clamp01((g - 1868) / 14)} rot={-4} glow={V.ink0} />
              </Plane>
            )}
          </>
        )}
      </Layers>

      {/* ════ LAS COSTURAS, siempre por encima de todo ════════════════════════════════════════
          A @446  · MATCH-SHAPE  — vive adentro del objeto (la esquina que se repinta): nada acá.
          B @657  · OCLUSIÓN     — la chimenea de ladrillo tapa el 100 % entre 653 y 661.
          C @945  · ZOOM-THROUGH — vive en `zs` sobre el fondo del acto 3: nada acá.
          D @1292 · WIPE POR MATERIA — el polvo del hormigón que levanta el panel arrastrado. */}
      <OcluyeChimenea at={640} dur={34} />
      <PolvoHormigon at={1272} dur={42} />

      {/* el aire de la tarde: polen y polvo bajos, cruzados por el sol rasante desde la izquierda.
          El patio nunca está quieto, y esta capa NUNCA se apoya sobre su cara (opacidad ínfima y
          partículas de 2 px: no es un scrim, es aire). */}
      {g >= 250 && g < 1470 && (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.42 }}>
          {Array.from({ length: 12 }, (_, i) => {
            const o = rnd(i * 7.3);
            const xx = ((rnd(i * 4.1) * 108 + (g * (0.1 + o * 0.24)) / 9) % 112) - 6;
            const yy = 24 + rnd(i * 2.3) * 66 + Math.sin(g / (52 + o * 40) + i) * 3.4;
            return (
              <div key={i} style={{
                position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 2.4, height: 2.4, borderRadius: "50%",
                background: rgba(V.amber, 0.22 + o * 0.24),
              }} />
            );
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
