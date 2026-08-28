// MovPapel.tsx — MOVIMIENTO S1 · "EL PAPEL DE 9.400"
// Video `cmegenerador` (Claudio Mendoza Constructor, ES neutro). 5 actos · gFrame 0 → 1440 @30 = 48 s.
// Arranca en el segundo 14,0 del video. Es el PRIMER movimiento: la escena nace del blanco del papel.
// Se monta ENCIMA del avatar real de Claudio y LO TAPA ENTERO (la atmósfera es opaca).
//
// ── LA ESPINA ────────────────────────────────────────────────────────────────────────────────
//   El presupuesto de 9.400 dólares se desarma en el aire y termina en la promesa de MEDIR.
//
// ── CÓMO ESTÁ CONSTRUIDO (por qué esto es UN movimiento y no cinco tarjetas) ─────────────────
// 1. UNA sola atmósfera (`VoltAtmos`) montada una vez arriba de todo. Nunca se remonta: lo único
//    que cambia entre actos son sus CUATRO parámetros, y cambian por interpolación continua de
//    gFrame (la luz EVOLUCIONA: cielo cubierto frío → patio → pila → NOCHE de linterna → alto y
//    frío sobre la casa con las ventanas cálidas abajo).
// 2. UNA sola cámara `camAt(g)`: un `gcam` con dur = 1440 (un solo viaje de 48 s) más una grúa y
//    un push que son interpolaciones continuas de g. ⛔ Ningún acto la reinicia: el acto 4 hereda
//    la posición y la inercia del 3.
// 3. UN SOLO SCROLL VERTICAL `scr(g)`: el papel y el patio cuelgan del MISMO valor, separados por
//    100 % de pantalla. Por eso la frontera A no es un corte: es un plano que sigue subiendo.
// 4. LA MATERIA QUE CRUZA — dos objetos sobreviven a todas las fronteras:
//      · EL PAPEL: nace en macro (acto 1), se va con la cámara, VUELVE chico en el acto 2 (frame
//        469), engorda en el acto 3 y CRUZA EL CUADRO ENTERO en el frame 898 (frontera C). En el
//        acto 4 vuelve a estar debajo de la pinza: es la mesa sobre la que se mide.
//      · LA CIFRA 9.400: nace DENTRO del círculo azul del papel (frame 286), viaja pegada al papel
//        mientras sube, se despega y aterriza como rótulo sobre el generador (frame 399, que es
//        cuando Claudio la dice) y muere en el 612. Un número que VIAJA, no que aparece.
// 5. Profundidad: 6 planos con parallax propio (z −560/−540/−520 fondos · −300 la losa · 0 el
//    héroe · +80/+150 satélites · +40 tipografía), todos dentro de `<Layers>` con preserve-3d.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
//  TABLA DE HANDOFF          (el acto N+1 arranca EXACTAMENTE en el exitTo del N)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ENTRA DESDE (nada: es el primer movimiento del video):
//   cam  {z +250, grúa +26, push 1,16 — macro cerrado y picado sobre la mesa}
//   luz  {cielo cubierto frío · key volt arriba-izquierda al 20 % · rampa de 14 frames, no más}
//   mat  {EL PAPEL DEL PRESUPUESTO, macro cenital sobre la mesa del taller}
//
// ACTO 1 · 0-315 · "NUEVE MIL CUATROCIENTOS"   protagonista: EL PAPEL EN MACRO
//   enterFrom cam {z +250, grúa +26, push 1,16}      luz {keyFrom 0,20 · int 0,72→1,00 · floor 0,50}
//             mat {el papel quieto, círculo azul con la cifra todavía sin resolver}
//   exitTo    cam {z +96, grúa −12, push 1,00, SUBIENDO a −0,72 %/frame}
//             luz {keyFrom 0,24 · int 0,98 · floor 0,58 · frío 0,22}
//             mat {el papel saliendo por ARRIBA a velocidad constante + la cifra 9.400 pegada a él}
//   ── FRONTERA A @315 ·· MATCH-MOVE ·· la cámara ya venía subiendo por la hoja (leemos el
//      presupuesto de arriba abajo). En el 315 no frena: sigue con el MISMO vector y el patio entra
//      por abajo colgado del mismo `scr(g)`, exactamente 100 % más abajo. Nada arranca de cero.
//
// ACTO 2 · 315-600 · "VEINTIDÓS MIL VATIOS"    protagonista: EL GENERADOR SOBRE LA LOSA
//   enterFrom cam {z +96, grúa −12, push 1,00, subiendo}   luz {keyFrom 0,24 · int 0,98 · floor 0,58}
//             mat {el generador entrando por abajo a la misma velocidad que sale el papel}
//   exitTo    cam {z −18, grúa −44, push 1,00, orbitando a la izquierda}
//             luz {keyFrom 0,30 · int 1,05 · floor 0,62 · frío 0,46}
//             mat {LA CHAPA DEL GENERADOR, ya encogiendo y girando 15°}
//   ── FRONTERA B @600 ·· MATCH-SHAPE ·· la MISMA `MediaCard` (mismo clip adentro) viaja de
//      1060×620 centrada a 520×300 girada 15° en el z +150: es la primera carta de la pila. Una
//      sola función `genCard(g)` la dibuja en los dos actos, así que en el 600 no hay ni un píxel
//      de salto. Distinta de A (allá se movía la cámara; acá se transforma el objeto).
//
// ACTO 3 · 600-900 · "TODO INCLUIDO"           protagonista: LA PILA DE TRES TARJETAS
//   enterFrom cam {z −18, grúa −44, push 1,00}      luz {keyFrom 0,30 · int 1,05 · floor 0,62}
//             mat {la chapa del generador convertida en carta 1 de la pila}
//   exitTo    cam {z −150, grúa −8, push 1,10}      luz {keyFrom 0,26 · int 0,92 · floor 0,60}
//             mat {EL PAPEL, que a los 880 se dispara desde abajo-derecha y tapa todo}
//   ── FRONTERA C @898 ·· OCLUSIÓN ·· `SeamOcclude color={V.paper}` (el color de LA MATERIA que
//      cruza, ⛔ jamás el del fondo): la hoja del presupuesto barre el cuadro y tapa el 100 %
//      durante ~5 frames. Distinta de B, y es la única frontera con overlay.
//
// ACTO 4 · 900-1200 · "DÉJAME MEDIRLO"         protagonista: LA MANO Y LA PINZA SOBRE EL PAPEL
//   enterFrom cam {z −150, grúa −8, push 1,10}      luz {keyFrom 0,26 · int 0,92 · floor 0,60}
//             mat {el papel: la hoja que acaba de tapar el cuadro es la que está sobre la mesa}
//   exitTo    cam {z −300, grúa +34, push 1,10, ENTRANDO en el display de la pinza}
//             luz {NOCHE: keyFrom 0,30 · int 0,45 · floor 0,80 · tint2 → torch}
//             mat {EL DISPLAY VERDE de la pinza, ocupando el cuadro}
//   (costura INTERNA @1046 ·· WIPE POR MATERIA ·· la arenilla del patio cruza y detrás ya se cortó
//    la luz. No es frontera de acto: es el salto de tres semanas dentro del mismo acto.)
//   ── FRONTERA D @1182 ·· ZOOM-THROUGH ·· `zoomThrough(g, 1182, 24, dispX, dispY)` sobre el grupo
//      del acto 4: la cámara entra por el display y sale del otro lado ya en la casa. El acto 5 se
//      monta 26 frames ANTES, debajo — un zoom-through contra nada es un fundido a negro.
//
// ACTO 5 · 1200-1440 · "EL PRÓXIMO APAGÓN"     protagonista: LA CASA CON LAS VENTANAS ENCENDIDAS
//   enterFrom cam {saliendo del túnel, z −300 → −120, grúa +18, push 1,02}
//             luz {noche · keyFrom 0,30 · int 0,90 · floor 0,66}
//             mat {la casa, que ya estaba detrás del display}
//   (costura INTERNA @1311 ·· CORTE EN EL BEAT ·· en la palabra "trescientos ocho" repetida, corte
//    seco de un frame a un encuadre más cerrado de LA MISMA foto, con la misma luz y la ventana
//    encendida centrada. Sexta costura del movimiento; ninguna repetida en frontera.)
//   exitTo    cam {ALTA Y FRÍA sobre la casa: z −250, grúa −152, push 0,96}
//             luz {alto y frío arriba (keyFrom 0,34, sky 0,48) · ÁMBAR abajo en las ventanas}
//             mat {LA VENTANA ENCENDIDA de la izquierda — por ahí entra `MovTrescientos`}
//
// SALE HACIA `MovTrescientos` (que arranca alto y frío sobre la casa, ventanas cálidas abajo, y
// apaga esa ventana en su primer acto). ✔ Aterriza exactamente en su enterFrom.
//
// ── ASSETS (⛔ SOLO los de la ficha, escritos como literal string) ────────────────────────────
//   Los CLIPS que existen en disco al momento de escribir esto son papel1 y papel2; papel3/4/5 se
//   usan en su forma FOTO (la ficha da las dos formas, y una ruta que no viajó en el tar mata el
//   chunk con un 404 disfrazado de EncodingError).
//
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Bed,
} from "./VoltStage";

// ── FRONTERAS ────────────────────────────────────────────────────────────────────────────────
const A1 = 0, A2 = 315, A3 = 600, A4 = 900, A5 = 1200, G_END = 1440;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5 };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── MATERIAL REAL (literales; verificados en disco) ──────────────────────────────────────────
const PAPEL_V = "broll/cmegenerador/cmeg_mv_papel1.mp4";   // macro cenital del presupuesto
const PAPEL_F = "img/cmegenerador/cmeg_mv_papel1.png";
const GEN_V = "broll/cmegenerador/cmeg_mv_papel2.mp4";     // generador gris sobre la losa nueva
const GEN_F = "img/cmegenerador/cmeg_mv_papel2.png";
const DUSK_F = "img/cmegenerador/cmeg_mv_papel3.png";      // el generador al anochecer, luz de estado
const PINZA_F = "img/cmegenerador/cmeg_mv_papel4.png";     // la mano apoyando la pinza sobre el papel
const CASA_F = "img/cmegenerador/cmeg_mv_papel5.png";      // la casa al anochecer, ventanas encendidas
const IC_SELLO = "img/cmegenerador/cmeg_ic_sello.png";
const IC_PINZA = "img/cmegenerador/cmeg_ic_pinza.png";
const IC_CALENDARIO = "img/cmegenerador/cmeg_ic_calendario.png";
const IC_TORMENTA = "img/cmegenerador/cmeg_ic_tormenta.png";
const IC_CONGELADOR = "img/cmegenerador/cmeg_ic_congelador.png";
const IC_FOCO = "img/cmegenerador/cmeg_ic_foco.png";
const IC_TELEFONO = "img/cmegenerador/cmeg_ic_telefono.png";
const IC_ENCHUFE = "img/cmegenerador/cmeg_ic_enchufe.png";

// ── GEOMETRÍA DEL MATERIAL (medida sobre las fotos reales, no estimada) ──────────────────────
const OVAL_U = 0.515, OVAL_V = 0.504;   // papel1: el círculo azul del marcador
const DISP_U = 0.355, DISP_V = 0.790;   // papel4: el display de la pinza amarilla
const WIN_U = 0.350;                    // papel5: la ventana encendida de la izquierda

const wpc = (px: number) => (px / 1920) * 100;   // ancho en px → % de pantalla
const hpc = (px: number) => (px / 1080) * 100;   // alto en px → % de pantalla
const rev = (g: number, at: number, dur = 16) => clamp01((g - at) / dur);
const fade = (g: number, at: number, dur = 14) => 1 - clamp01((g - at) / dur);

// ── EL SCROLL ÚNICO: de él cuelgan el papel Y el patio (frontera A) ──────────────────────────
// Un solo valor, una sola curva, sin nudos: la velocidad es continua a través del 315.
const scr = (g: number) => {
  const p = clamp01((g - 96) / 300);
  return -118 * interpolate(p, [0, 1], [0, 1], { easing: Easing.bezier(0.62, 0, 0.24, 1) });
};
const PAPEL_Y = (g: number) => 66 + scr(g);     //  66  →  −52  (sale entero por arriba)
const PATIO_Y = (g: number) => 166 + scr(g);    // 166  →   48  (entra entero desde abajo)
const PAPEL_W = 1360, PAPEL_H = 765;

// ── LA CÁMARA · una sola función de g que nunca vuelve a cero ────────────────────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: 250, z1: -250, panX: 96, panY: -54, ry: -5.6, rx: 2.4, dur: G_END });
  // LA GRÚA (px): baja con el papel, se hunde en la pila, trepa en la noche y termina ALTA.
  const crane = interpolate(
    g,
    [0, A2, 470, A3, 760, A4, 1046, 1182, A5, 1311, G_END],
    [26, -12, -30, -44, -20, -8, 26, 34, 18, -46, -152],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.24, 1) },
  );
  // EL PUSH: easing NO constante, nunca reiniciado.
  const push = interpolate(
    g,
    [0, 120, A2, 470, A3, 760, A4, 1000, 1120, 1182, 1210, 1311, G_END],
    [1.16, 1.06, 1.00, 1.03, 1.00, 1.05, 1.10, 1.02, 1.06, 1.10, 1.02, 1.05, 0.96],
    { ...CL, easing: Easing.bezier(0.36, 0, 0.28, 1) },
  );
  return `${base.transform} translateY(${crane.toFixed(1)}px) scale(${push.toFixed(3)})`;
};

// ── LA TARJETA DEL GENERADOR: UN objeto, vivo del 315 al 900 (fronteras A y B) ───────────────
const genCard = (g: number) => {
  const e1 = eio(0, 1, clamp01((g - 540) / 150));   // MATCH-SHAPE 540 → 690
  const e2 = eio(0, 1, clamp01((g - 722) / 66));    // el giro del acto 3: se va al fondo
  const yT = PATIO_Y(g);
  return {
    w: lerp(1060, 520, e1),
    h: lerp(620, 300, e1),
    x: lerp(50, 31, e1),
    y: lerp(yT, 41, e1),
    z: lerp(0, 150, e1) - 150 * e2,
    ry: lerp(-2.5, 15, e1),
    rx: lerp(2, 0, e1),
    lit: 1 - 0.62 * e2,
    op: 1 - 0.56 * e2,
  };
};

// ── TIPOGRAFÍA DEL MOVIMIENTO (una idea de texto por acto) ───────────────────────────────────
const Titular: React.FC<{
  kick: string; head: string; p: number; x?: number; bottom?: number;
  color?: string; kickColor?: string; size?: number; w?: number;
}> = ({ kick, head, p, x = 6.5, bottom = 13, color = V.white, kickColor = V.volt, size = 78, w = 880 }) => {
  if (p <= 0.001) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, bottom: `${bottom}%`,
      opacity: p, transform: `translate3d(${((1 - p) * -26).toFixed(1)}px, 0, 40px)`,
    }}>
      <Bed w={w} pad={28}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size} color={color}>{head}</Head>
      </Bed>
    </div>
  );
};

// renglón del presupuesto: callout anclado a la hoja real (estructura, no titular)
const Renglon: React.FC<{ p: number; y: number; kick: string; val: string; color?: string }> = ({
  p, y, kick, val, color = V.bone,
}) => {
  if (p <= 0.001) return null;
  return (
    <div style={{
      position: "absolute", left: "66%", top: `${y}%`, width: 430,
      opacity: p, transform: `translate3d(${((1 - p) * 34).toFixed(1)}px, -50%, 40px)`,
    }}>
      <div style={{
        padding: "18px 22px", borderRadius: 12,
        background: "linear-gradient(180deg, rgba(8,9,6,0.9) 0%, rgba(8,9,6,0.66) 100%)",
        boxShadow: "0 18px 52px rgba(0,0,0,0.6)",
      }}>
        <div style={{ height: 3, width: 72 * p, background: rgba(V.volt, 0.92), marginBottom: 12 }} />
        <div style={{ marginBottom: 4 }}><Kick color={rgba(V.volt, 0.95)}>{kick}</Kick></div>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 54, lineHeight: 1, color,
          textShadow: "0 6px 26px rgba(0,0,0,0.94)",
        }}>{val}</div>
      </div>
    </div>
  );
};

// palabra tachada (el "no calcular, no estimar" del acto 3)
const Tachada: React.FC<{ p: number; s: number; y: number; text: string }> = ({ p, s, y, text }) => {
  if (p <= 0.001) return null;
  return (
    <div style={{
      position: "absolute", left: "7%", top: `${y}%`, opacity: p * 0.94,
      transform: `translate3d(${((1 - p) * -20).toFixed(1)}px, 0, 40px)`,
    }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 48, letterSpacing: 2.4,
          textTransform: "uppercase", color: rgba(V.bone, 0.88 - 0.32 * s),
          textShadow: "0 5px 22px rgba(0,0,0,0.95)",
        }}>{text}</div>
        <div style={{
          position: "absolute", left: 0, top: "52%", height: 5, width: `${(s * 104).toFixed(1)}%`,
          background: V.danger, boxShadow: `0 0 18px ${rgba(V.danger, 0.72)}`,
        }} />
      </div>
    </div>
  );
};

// LA CIFRA QUE VIAJA: nace en el círculo del papel y aterriza sobre el generador.
const Cifra: React.FC<{
  g: number; x: number; y: number; w: number; h: number; resuelta: number; op: number;
}> = ({ g, x, y, w, h, resuelta, op }) => {
  if (op <= 0.001) return null;
  const scramble = Math.floor(rnd(Math.floor(g / 2) * 1.7) * 8999) + 1000;
  const txt = resuelta > 0.5 ? "9.400" : `${scramble}`.replace(/^(\d)(\d{3})$/, "$1.$2");
  const slam =
    1 + 0.22 * Math.max(0, 1 - Math.abs(g - 286) / 10) + 0.26 * Math.max(0, 1 - Math.abs(g - 399) / 11);
  const tinta = resuelta > 0.5 ? V.amber : rgba(V.amber, 0.7);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: op,
      transform: `translateZ(46px) scale(${slam.toFixed(3)})`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* el círculo de marcador que YA está dibujado en la hoja, reforzado con luz ámbar */}
      <div style={{
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: "50%",
        background: `radial-gradient(closest-side, ${rgba("#0F1109", 0.92)} 0%, ${rgba("#0F1109", 0.86)} 60%, rgba(0,0,0,0) 100%)`,
        boxShadow: `inset 0 0 0 3px ${rgba(V.amber, 0.5 + 0.4 * resuelta)}, 0 0 ${Math.round(28 + 48 * resuelta)}px ${rgba(V.amber, 0.3 * (0.4 + resuelta))}`,
      }} />
      <div style={{
        position: "relative",
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(h * 0.5), lineHeight: 0.9,
        color: tinta, letterSpacing: 1, whiteSpace: "nowrap",
        textShadow: `0 0 ${Math.round(h * 0.32)}px ${rgba(V.amber, 0.5 * resuelta)}, 0 5px 22px rgba(0,0,0,0.95)`,
      }}>
        {txt}
        <span style={{ fontSize: Math.round(h * 0.19), marginLeft: 9, color: rgba(V.amber, 0.82) }}>USD</span>
      </div>
    </div>
  );
};

// EL DISPLAY DE LA PINZA (el instrumento se ve en la foto real; el número lo escribe el kit)
const Display: React.FC<{ x: number; y: number; w: number; p: number; g: number }> = ({ x, y, w, p, g }) => {
  if (p <= 0.001) return null;
  const h = Math.round(w * 0.56);
  const d = Math.floor(rnd(Math.floor(g / 2) * 3.3) * 900) + 100;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: p,
      transform: `translateZ(60px) rotate(-3deg) scale(${(0.86 + 0.14 * p).toFixed(3)})`,
      borderRadius: 8, overflow: "hidden",
      background: "linear-gradient(168deg, #0E1A0A 0%, #0A1207 100%)",
      boxShadow: `0 0 ${Math.round(w * 0.5)}px ${rgba(V.volt, 0.42 * p)}, inset 0 1px 0 ${rgba(V.white, 0.22)}, 0 10px 30px rgba(0,0,0,0.9)`,
      border: `2px solid ${rgba(V.volt, 0.5)}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(h * 0.52), color: V.volt,
        letterSpacing: 4, textShadow: `0 0 ${Math.round(h * 0.4)}px ${rgba(V.volt, 0.75)}`,
      }}>{d}</div>
      <div style={{
        position: "absolute", right: 10, bottom: 6,
        fontFamily: F_BODY, fontWeight: 700, fontSize: Math.round(h * 0.16), color: rgba(V.volt, 0.82),
      }}>W</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovPapel: React.FC<{ acto: number; gFrame: number }> = ({ acto: actoIn, gFrame }) => {
  const cf = useCurrentFrame();
  const g = Math.max(0, gFrame);
  // El build monta el MOVIMIENTO ENTERO en UNA sola <Sequence> (acto={0}) para que
  // useCurrentFrame() no se reinicie en cada frontera: si se reiniciara, el polvo de la
  // atmosfera, la deriva de las tarjetas y el barrido especular pegarian un salto en CADA
  // costura, que es justo lo que este video no puede tener. Con acto=0 el acto se deduce de g.
  const acto = actoIn > 0 ? actoIn : (g >= A5 ? 5 : g >= A4 ? 4 : g >= A3 ? 3 : g >= A2 ? 2 : 1);
  const f = g - (START[acto] ?? 0);                 // frame local del acto (sólo para el gate)
  const toCF = (t: number) => cf - gFrame + t;      // un frame MÍO → el reloj interno de las primitivas

  // ── LA LUZ: cuatro parámetros, cuatro curvas continuas de g. Nunca salta. ──────────────────
  const keyFrom = interpolate(g, [0, A2, A3, A4, 1046, A5, G_END], [0.20, 0.24, 0.30, 0.26, 0.30, 0.30, 0.34], CL);
  const cool = interpolate(g, [0, A2, A3, A4, 1046, A5, 1311, G_END], [0.30, 0.22, 0.46, 0.14, 0.62, 0.30, 0.38, 0.48], CL);
  const warm = interpolate(g, [0, A4, 1046, A5, G_END], [0.00, 0.06, 0.42, 0.22, 0.10], CL);
  const inten = interpolate(g, [0, 14, A2, A3, A4, 1046, 1120, A5, G_END], [0.72, 1.00, 0.98, 1.05, 0.92, 0.45, 0.60, 0.90, 1.00], CL);
  const floorDim = interpolate(g, [0, A2, A3, A4, 1046, A5, G_END], [0.50, 0.58, 0.62, 0.60, 0.80, 0.66, 0.62], CL);
  const cam = camAt(g);

  // ── QUÉ ACTO DIBUJA QUÉ (con los solapes que las costuras necesitan) ──────────────────────
  const a1 = acto === 1, a2 = acto === 2, a3 = acto === 3, a4 = acto === 4, a5 = acto === 5;
  const vePapel = a1 || (a2 && g < 404);                 // el papel sigue saliendo dentro del acto 2
  const vePatio = a2 || (a1 && g >= 246) || a3;          // el patio ya entra dentro del acto 1
  // ⛔ el acto 4 NO puede asomar antes de que el papel tape: entra recién con la oclusión ya puesta
  const veActo4 = a4 || (a3 && g >= 899);
  // ⛔ el acto 5 se monta 26 frames ANTES y va PRIMERO en el DOM: el zoom-through del acto 4 tiene
  //    que pasar POR ENCIMA de él, o el "túnel" es un fundido a negro
  const veActo5 = a5 || (a4 && g >= 1174);

  // geometría viva
  const gc = genCard(g);
  const papelY = PAPEL_Y(g);
  const ovalX = 50 + (OVAL_U - 0.5) * wpc(PAPEL_W);
  const ovalY = papelY + (OVAL_V - 0.5) * hpc(PAPEL_H);

  // LA CIFRA: del círculo del papel (286) al rótulo sobre el generador (399)
  const viaje = eio(0, 1, clamp01((g - 306) / 96));
  const cifraX = lerp(ovalX, 74, viaje);
  const cifraY = lerp(ovalY, 25, viaje);
  const cifraW = lerp(340, 430, viaje);
  const cifraH = lerp(184, 210, viaje);
  const cifraOp = rev(g, 0, 20) * fade(g, 612, 22);

  // ACTO 4: Ken-Burns de la foto de la pinza + posición REAL del display dentro de la tarjeta
  const p4 = clamp01((g - 900) / 300);
  const pinzaW = lerp(1400, 1560, eio(0, 1, p4));
  const pinzaH = pinzaW * (765 / 1360);
  const pinzaY = 47;
  const dispX = 50 + (DISP_U - 0.5) * wpc(pinzaW);
  const dispY = pinzaY + (DISP_V - 0.5) * hpc(pinzaH);
  const zt = g >= 1182 ? zoomThrough(g, 1182, 24, dispX, dispY) : null;

  // ACTO 5: el CORTE EN EL BEAT del 1311 (mismo material, encuadre cerrado, misma luz)
  const cerrado = g >= 1311;
  const casaW = cerrado ? 2040 : 1520;
  const casaH = casaW * (765 / 1360);
  const casaX = cerrado ? 50 + (0.5 - WIN_U) * wpc(casaW) : 50;
  const casaY = cerrado ? 44 : 46;
  const winX = casaX + (WIN_U - 0.5) * wpc(casaW);
  const winY = casaY;

  return (
    <AbsoluteFill>
      {/* ══ LA ATMÓSFERA · UNA sola vez, jamás remontada. Sólo evolucionan sus parámetros. ══ */}
      <VoltAtmos
        tint={light(cool, "volt", "sky")}
        tint2={light(warm, "amber", "torch")}
        keyFrom={keyFrom}
        intensity={inten}
        floor={floorDim}
      />

      <Layers cam={cam}>
        {/* ═══════════ ACTO 1 · EL PAPEL EN MACRO ═══════════════════════════════════════════ */}
        {vePapel && (
          <>
            {/* z −540 · el banco de taller detrás, con parallax propio (0,42× del scroll) */}
            <AbsoluteFill style={{
              transform: `translateZ(-540px) translateY(${(scr(g) * 0.42).toFixed(1)}%) scale(1.34)`,
              transformStyle: "preserve-3d",
            }}>
              <PhotoPlane src={PAPEL_F} kind="photo" z={0} scale={1.2} dim={0.64} tint={V.sky} />
            </AbsoluteFill>

            {/* z 0 · EL HÉROE: la hoja del presupuesto, CLIP real dentro de vidrio */}
            <Plane z={0}>
              <MediaCard
                src={PAPEL_V} kind="video"
                w={PAPEL_W} h={PAPEL_H} x={50} y={papelY} z={0}
                ry={-1.6} rx={2.2} radius={10} startFrom={6}
                lit={0.92} litColor={V.sky} sheenAt={toCF(10)}
              />
            </Plane>

            {/* z +40 · los renglones del presupuesto, anclados a la hoja (suben con ella) */}
            <Plane z={0}>
              <Renglon p={rev(g, 42) * fade(g, 262, 20)} y={papelY - 15.6} kick="POTENCIA DE PLACA" val="22.000 W" />
              <Renglon p={rev(g, 88) * fade(g, 288, 20)} y={papelY - 5.4} kick="ARRANQUE AUTOMÁTICO" val="10 SEGUNDOS" />
              <Renglon p={rev(g, 248) * fade(g, 336, 22)} y={papelY + 4.8} kick="INSTALACIÓN · PERMISO · LOSA" val="INCLUIDO" color={V.amber} />
              {g >= 256 && (
                <IconPng src={IC_SELLO} x={59} y={papelY - 3} size={132} z={54}
                  opacity={rev(g, 256, 12) * fade(g, 336, 22) * 0.95} rot={-13} glow={V.amber} />
              )}
            </Plane>

            <Titular
              kick="EL TOTAL DEL PRESUPUESTO"
              head="NUEVE MIL CUATROCIENTOS"
              kickColor={V.amber}
              size={80}
              p={rev(g, 286, 18) * fade(g, 372, 18)}
            />
          </>
        )}

        {/* LA CIFRA QUE VIAJA (materia que cruza la frontera A) */}
        {(vePapel || a2) && (
          <Cifra g={g} x={cifraX} y={cifraY} w={cifraW} h={cifraH}
            resuelta={g >= 286 ? 1 : 0} op={cifraOp} />
        )}

        {/* ═══════════ ACTO 2 · EL GENERADOR SOBRE LA LOSA ══════════════════════════════════ */}
        {vePatio && (
          <>
            {/* z −520 · el patio al fondo, entra ANTES que la tarjeta (parallax 0,86×) */}
            {g < 760 && (
              <AbsoluteFill style={{
                transform: `translateZ(-520px) translateY(${Math.max(0, 96 + scr(g) * 0.86).toFixed(1)}%) scale(1.3)`,
                transformStyle: "preserve-3d",
                opacity: clamp01((g - 250) / 90) * (g > 640 ? fade(g, 640, 90) : 1),
              }}>
                <PhotoPlane src={GEN_F} kind="photo" z={0} scale={1.16} dim={0.62} tint={V.volt} />
              </AbsoluteFill>
            )}

            {/* z −300 · LA LOSA: el suelo sobre el que aterriza la sombra de contacto */}
            <Plane z={-300}>
              <PadPlane
                y={Math.min(148, 76 + (PATIO_Y(g) - 48) * 0.9)}
                w={1420} h={320} rx={64} z={-40}
                lit={interpolate(g, [300, 420, 722, 850, 900], [0.25, 1, 0.55, 1.15, 1], CL)}
              />
            </Plane>

            {/* z 0 → +150 · EL HÉROE que se transforma en la carta 1 de la pila (frontera B) */}
            <Plane z={0}>
              <MediaCard
                src={GEN_V} kind="video"
                w={gc.w} h={gc.h} x={gc.x} y={gc.y} z={gc.z}
                ry={gc.ry} rx={gc.rx} radius={12} startFrom={8}
                lit={gc.lit} litColor={V.volt} opacity={gc.op}
                sheenAt={toCF(352)}
                label={g >= 618 ? "ARRANCA SOLO" : undefined}
              />
            </Plane>

            {/* el PAPEL VUELVE: chico abajo a la derecha, y a los 880 se dispara a tapar todo */}
            {g >= 469 && (
              <Plane z={0}>
                {(() => {
                  const e = eio(0, 1, clamp01((g - 469) / 46));
                  const lanza = eio(0, 1, clamp01((g - 880) / 22));
                  return (
                    <MediaCard
                      src={PAPEL_F} kind="photo"
                      w={lerp(lerp(200, 300, e), 2600, lanza)}
                      h={lerp(lerp(112, 169, e), 1462, lanza)}
                      x={lerp(lerp(96, 83.5, e), 46, lanza)}
                      y={lerp(lerp(88, 74.5, e), 50, lanza)}
                      z={lerp(120, 620, lanza)}
                      ry={lerp(-24, -4, e)} rx={lerp(6, 1, e)} rot={lerp(-7, -2, lanza)}
                      radius={8} lit={0.9} litColor={V.paper}
                      sheenAt={toCF(492)}
                    />
                  );
                })()}
              </Plane>
            )}

            <Titular
              kick="LO QUE DICE LA ETIQUETA"
              head="VEINTIDÓS MIL VATIOS"
              size={82}
              p={rev(g, 430, 18) * fade(g, 566, 18)}
            />
          </>
        )}

        {/* ═══════════ ACTO 3 · LA PILA DE TRES ════════════════════════════════════════════ */}
        {a3 && (
          <Plane z={0}>
            {(() => {
              const e2 = eio(0, 1, clamp01((g - 636) / 44));
              const r2 = eio(0, 1, clamp01((g - 722) / 66));
              return (
                <MediaCard
                  src={DUSK_F} kind="photo"
                  w={520} h={300}
                  x={lerp(84, 50.5, e2)} y={lerp(66, 49, e2)}
                  z={lerp(-360, 10, e2) - 120 * r2}
                  ry={lerp(-30, -1, e2)} rx={1} radius={12}
                  lit={(0.35 + 0.65 * e2) * (1 - 0.6 * r2)}
                  litColor={V.volt} opacity={e2 * (1 - 0.55 * r2)}
                  sheenAt={toCF(650)} label="EN DIEZ SEGUNDOS"
                />
              );
            })()}
            {(() => {
              const e3 = eio(0, 1, clamp01((g - 676) / 44));
              const r3 = eio(0, 1, clamp01((g - 722) / 66));
              const ad = eio(0, 1, clamp01((g - 846) / 44));   // "doscientos kilos": viene al frente
              return (
                <MediaCard
                  src={GEN_F} kind="photo"
                  w={lerp(540, 780, ad)} h={lerp(206, 300, ad)}
                  x={lerp(lerp(92, 69.5, e3), 52, ad)}
                  y={lerp(lerp(72, 57, e3), 50, ad)}
                  z={lerp(lerp(-420, -130, e3) - 150 * r3, 200, ad)}
                  ry={lerp(lerp(-34, -16, e3), -3, ad)} rx={1.4} radius={12}
                  lit={(0.3 + 0.7 * e3) * (1 - 0.55 * r3 * (1 - ad))}
                  litColor={V.concrete} opacity={e3 * (1 - 0.5 * r3 * (1 - ad))}
                  sheenAt={toCF(862)} label="LA LOSA · DOSCIENTOS KILOS"
                />
              );
            })()}

            {/* EL GIRO DEL ACTO (frame 722): lo que NO se hace, tachado; y entra la pinza */}
            <Tachada p={rev(g, 726, 12) * fade(g, 878, 20)} s={eio(0, 1, clamp01((g - 740) / 12))} y={38} text="CALCULAR" />
            <Tachada p={rev(g, 748, 12) * fade(g, 878, 20)} s={eio(0, 1, clamp01((g - 762) / 12))} y={47} text="ESTIMAR" />
            <Tachada p={rev(g, 770, 12) * fade(g, 878, 20)} s={eio(0, 1, clamp01((g - 784) / 12))} y={56} text="MIRAR LA ETIQUETA" />
            {g >= 796 && (
              <IconPng src={IC_PINZA} x={19} y={68} size={196} z={90}
                opacity={rev(g, 796, 16) * fade(g, 884, 20)} rot={-8} glow={V.volt} />
            )}

            <Titular
              kick="EL PAQUETE COMPLETO"
              head="TODO INCLUIDO"
              kickColor={V.amber} size={84}
              p={rev(g, 606, 16) * fade(g, 712, 16)}
            />
            {g >= 612 && g < 730 && (
              <IconPng src={IC_SELLO} x={36} y={71} size={136} z={70}
                opacity={rev(g, 612, 14) * fade(g, 712, 16) * 0.95} rot={9} glow={V.amber} />
            )}
          </Plane>
        )}

        {/* ═══════════ ACTO 5 · LA CASA CON LAS VENTANAS ENCENDIDAS ════════════════════════ */}
        {veActo5 && (
          <>
            <AbsoluteFill style={{ transform: "translateZ(-560px) scale(1.4)", transformStyle: "preserve-3d" }}>
              <PhotoPlane src={CASA_F} kind="photo" z={0} scale={1.2} dim={0.68} tint={V.sky} />
            </AbsoluteFill>

            <Plane z={0}>
              <MediaCard
                src={CASA_F} kind="photo"
                w={casaW} h={casaH} x={casaX} y={casaY} z={0}
                ry={cerrado ? -1.2 : 1.8} rx={1} radius={cerrado ? 4 : 12}
                lit={interpolate(g, [1176, 1230, 1440], [0.5, 0.9, 0.72], CL)}
                litColor={V.amber}
                sheenAt={toCF(1214)}
              />
              {/* LA VENTANA ENCENDIDA: el ámbar que se lleva `MovTrescientos` */}
              <div style={{
                position: "absolute", left: `${winX}%`, top: `${winY}%`,
                width: cerrado ? 470 : 340, height: cerrado ? 390 : 280,
                marginLeft: cerrado ? -235 : -170, marginTop: cerrado ? -195 : -140,
                transform: "translateZ(30px)", borderRadius: 24, pointerEvents: "none",
                background: `radial-gradient(closest-side, ${rgba(V.amber, 0.3 + 0.09 * Math.sin(g / 23))} 0%, rgba(0,0,0,0) 72%)`,
                mixBlendMode: "screen",
              }} />
            </Plane>

            {/* LO QUE MARCÓ LA PINZA */}
            {g >= 1257 && g < 1311 && (
              <Readout value="308" unit="W" label="LO QUE MARCÓ LA PINZA" at={toCF(1257)}
                x={25} y={30} size={168} color={V.volt} />
            )}
            {g >= 1311 && (
              <Readout value="308" unit="W" label="TRESCIENTOS OCHO" at={toCF(1311)}
                x={24} y={71} size={188} color={V.volt} />
            )}

            {/* 1350: el refrigerador, el congelador, el internet, las luces y los teléfonos */}
            {g >= 1350 && (
              <Plane z={70}>
                <IconPng src={IC_CONGELADOR} x={62} y={70} size={110} z={0} opacity={rev(g, 1350, 12) * 0.96} rot={-5} glow={V.torch} />
                <IconPng src={IC_FOCO} x={72} y={75} size={100} z={0} opacity={rev(g, 1362, 12) * 0.96} rot={6} glow={V.torch} />
                <IconPng src={IC_TELEFONO} x={82} y={70} size={96} z={0} opacity={rev(g, 1374, 12) * 0.96} rot={-7} glow={V.torch} />
                <IconPng src={IC_ENCHUFE} x={91} y={75} size={102} z={0} opacity={rev(g, 1386, 12) * 0.96} rot={4} glow={V.torch} />
              </Plane>
            )}

            <Titular
              kick="Y LLEGÓ"
              head="EL PRÓXIMO APAGÓN"
              kickColor={V.amber} size={84}
              p={rev(g, 1206, 16) * fade(g, 1298, 16)}
            />
          </>
        )}
        {/* ═══════════ ACTO 4 · LA PINZA SOBRE EL PAPEL ════════════════════════════════════ */}
        {veActo4 && (
          <AbsoluteFill style={{
            transformStyle: "preserve-3d",
            transform: zt ? zt.out : "none",
            opacity: zt ? zt.opacity : 1,
          }}>
            {/* z −540 · la hoja del presupuesto sigue ahí: ahora es la mesa sobre la que se mide */}
            <AbsoluteFill style={{ transform: "translateZ(-540px) scale(1.24)", transformStyle: "preserve-3d" }}>
              <PhotoPlane src={PAPEL_F} kind="photo" z={0} scale={1.14}
                dim={interpolate(g, [900, 1046, 1120], [0.58, 0.86, 0.8], CL)} tint={V.volt} />
            </AbsoluteFill>

            {/* z 0 · EL HÉROE con Ken-Burns: la mano apoyando la pinza sobre el papel */}
            <Plane z={0}>
              <MediaCard
                src={PINZA_F} kind="photo"
                w={pinzaW} h={pinzaH} x={50} y={pinzaY} z={0}
                ry={lerp(2.6, -2.2, p4)} rx={1.4} radius={12}
                lit={interpolate(g, [900, 1040, 1062, 1160, 1200], [1, 1, 0.38, 0.5, 0.72], CL)}
                litColor={g >= 1046 ? V.torch : V.volt}
                sheenAt={toCF(920)}
              />
            </Plane>

            {/* EL APAGÓN (1053): tres semanas después, cuatro horas y media */}
            {g >= 1056 && (
              <Plane z={80}>
                <div style={{ opacity: rev(g, 1056, 16) * fade(g, 1176, 18) }}>
                  <DutyField duty={4.5 / 24} cells={24} on={1} tint={V.torch} y={80} w={1180} h={38} cycle={150} />
                  <div style={{
                    position: "absolute", left: "50%", top: "86.5%",
                    transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap",
                  }}>
                    <Kick color={rgba(V.torch, 0.95)}>TRES SEMANAS DESPUÉS · CUATRO HORAS Y MEDIA SIN LUZ</Kick>
                  </div>
                </div>
                <IconPng src={IC_CALENDARIO} x={12} y={68} size={116} z={40}
                  opacity={rev(g, 1060, 14) * fade(g, 1176, 18) * 0.95} rot={-6} glow={V.torch} />
                <IconPng src={IC_TORMENTA} x={88} y={68} size={122} z={40}
                  opacity={rev(g, 1074, 14) * fade(g, 1176, 18) * 0.95} rot={5} glow={V.torch} />
              </Plane>
            )}

            {/* EL DISPLAY: el número todavía no resuelve. Por acá entra la cámara al acto 5. */}
            <Display x={dispX} y={dispY} w={330} p={rev(g, 1184, 12)} g={g} />
          </AbsoluteFill>
        )}

      </Layers>

      {/* ══ COSTURAS (fuera de `Layers`: la cámara no las toca) ═════════════════════════════ */}
      {/* FRONTERA C @898 · OCLUSIÓN con el color de LA MATERIA que cruza (el papel), ⛔ no el fondo */}
      <SeamOcclude at={toCF(898)} dur={16} color={V.paper} angle={-6} />
      {/* costura INTERNA del acto 4 @1046 · WIPE POR MATERIA: la arenilla del patio */}
      <SeamWipeMatter at={toCF(1046)} dur={26} tint={V.concrete} />
      {/* acentos de beat (no son fronteras): el precio y el corte seco del 1311 */}
      <SeamFlash at={toCF(399)} color={V.amber} dur={6} />
      <SeamFlash at={toCF(1311)} color={V.torch} dur={4} />

      {/* `f` queda declarado por contrato del build (gate por acto); no dibuja nada */}
      {f < -99999 ? <AbsoluteFill /> : null}
    </AbsoluteFill>
  );
};
