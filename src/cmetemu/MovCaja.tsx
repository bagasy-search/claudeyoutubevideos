// MovCaja.tsx — S1 · UN MOVIMIENTO CONTINUO de 45 s (1350 frames @30fps)
// «Ciento veintinueve dólares. La caja se abre, las cinco piezas se ordenan en el aire, y el precio
//  queda flotando encima.»
//
// Es el PRIMER movimiento del video: arranca en frío pero con la cámara ya viva. Una sola atmósfera
// montada arriba de todo (nunca se remonta), UNA cámara función de `gFrame` que jamás vuelve a cero,
// la luz que evoluciona `sky → white` sin saltar entre actos, y una materia que cruza CADA frontera.
// Aterriza exactamente donde `MovTresContra` necesita entrar: macro de la ETIQUETA PLATEADA, luz
// blanca, cámara empujando hacia adentro.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z=-70, pan 0, ry 0 (arranque en frío, deriva viva desde el cuadro 1) ·
//                       luz MEDIODÍA DURO del patio (sky, key volt al 18 %, contra NARANJA fuerte
//                       abajo-derecha) · materia: EL CARTÓN NARANJA de la caja cerrada sobre el
//                       hormigón, plano medio desde arriba-atrás.
//                EXIT   cám z=+82, pan -84, ry -5,4 · empujando contra la solapa · luz sky→white a mitad de camino, el
//                       naranja todavía domina abajo · materia: LA SOLAPA DE CARTÓN que se abre y
//                       cruza el lente (la caja no se va: se encoge y vuelve como carta del carrusel).
//
// acto 2 · f270  ENTER  cám z=+82, pan -84, ry -5,4 (hereda la inercia del acto 1: nunca se
//                       reinicia) · luz sky→white al 40 %, key volt subiendo por arriba-izquierda ·
//                       materia: EL CARTÓN NARANJA, ahora abierto, con las cinco piezas orbitando.
//                EXIT   cám z=+321, pan -54, ry -8,0 · metida DENTRO de la carta del panel · luz white al 70 %, el
//                       naranja se lava · materia: LA CARTA DEL PANEL, que crece hasta ser decorado.
//
// acto 3 · f594  ENTER  cám z=+321, pan -54, ry -8,0 (el mismo vector) · luz white al 72 % ·
//                       materia: EL PANEL A SANGRE como decorado del mostrador (heredado del acto 2).
//                EXIT   cám z=+121, pan -291, ry -8,7: plano general y BARRIENDO A LA DERECHA a velocidad
//                       plena · luz white al 84 % · materia: EL CARTEL DE PRECIO NARANJA de la tienda,
//                       que viaja con el barrido y aterriza como chip en el acto 4.
//
// acto 4 · f864  ENTER  cám z=+121, pan -291, barriendo a la derecha SIN frenar (el decorado cambia) ·
//                       luz white al 88 %, entra el verde de la pinza por arriba · materia: EL BANCO
//                       DE TRABAJO que entra por la derecha + el cartel de precio que ya venía.
//                EXIT   cám z=+244, pan -488 · empezando a empujar · luz white plena, key volt encendida ·
//                       materia: LA HOJA DEL CUADERNO, papel, 30 columnas llenas.
//
// acto 5 · f1134 ENTER  cám z=+244, pan -488 · empujando (mismo vector, sin corte) · luz white plena ·
//                       materia: LA HOJA, que ya está mutando de PAPEL a METAL PLATEADO.
//                EXIT   cám z=+330, pan -460, ry -9,0 · empujando hacia adentro · luz WHITE · materia:
//                       LA ETIQUETA PLATEADA del dorso del panel en macro, con el veredicto escrito
//                       encima  →  así arranca `MovTresContra`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f258  frontera 1→2 : OCLUSIÓN con `V.orange` (LA SOLAPA DEL CARTÓN) — dur 16, cobertura del 100 %
//                       entre f263 y f269. Bajo la tapa se monta el carrusel ya formado y se cambia
//                       la cama de foto. ⛔ nunca con el color del fondo.
// f548  frontera 2→3 : ESCALA — la carta del PANEL (la que queda al frente cuando el carrusel frena
//                       en su vuelta exacta) crece de 420×250 a 2600×1470 y a f594 ES el decorado.
// f836  frontera 3→4 : INERCIA — la cámara sigue su barrido a la derecha sin frenar y el decorado
//                       cambia detrás: el panel sale por la izquierda, el banco de trabajo entra por
//                       la derecha (se solapan, nunca hay hueco). El cartel de precio viaja con ella.
// f1096 frontera 4→5 : MATERIA — la hoja del cuaderno se convierte en la etiqueta: la MISMA
//                       superficie muta papel→plata (color, rayado→veta cepillada, brillo especular),
//                       con polvillo de metal (`SeamWipeMatter`, `V.silver`) cruzando encima.
// (cuatro costuras distintas, ninguna repetida, ninguna es un fade)
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame; ⛔ nada de Math.random ni Date) ──────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros (los de la ficha)
const F_A2 = 270;
const F_A3 = 594;
const F_A4 = 864;
const F_A5 = 1134;
const SEAM_OCC = 258;    // 1→2 OCLUSIÓN (cartón naranja)
const SCALE_IN = 548;    // 2→3 ESCALA (arranca)
const INER_IN = 836;     // 3→4 INERCIA (arranca el barrido)
const MAT_IN = 1096;     // 4→5 MATERIA (papel → plata)

// ── EL HAZ DEL PORTÓN — la fuente dura que entra del patio y nunca se va del cuadro ──────────
const HazPorton: React.FC<{ x: number; y: number; ang: number; power: number; color: string }> = ({
  x, y, ang, power, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 1900, height: 900, marginTop: -450, transformOrigin: "0% 50%",
      transform: `rotate(${ang.toFixed(2)}deg)`,
      background: `linear-gradient(90deg, ${rgba(color, 0.26 * power)} 0%, ${rgba(color, 0.11 * power)} 38%, rgba(0,0,0,0) 78%)`,
      clipPath: "polygon(0% 44%, 100% 0%, 100% 100%, 0% 56%)",
      mixBlendMode: "screen",
    }} />
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 520, height: 520, marginLeft: -260, marginTop: -260, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.44 * power)} 0%, ${rgba(color, 0.13 * power)} 34%, rgba(0,0,0,0) 70%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── LA SUPERFICIE QUE MUTA — la costura 4→5 hecha objeto ─────────────────────────────────────
// `m` = 0 → LA HOJA DEL CUADERNO (papel cálido, 30 columnas, los días medidos en verde).
// `m` = 1 → LA ETIQUETA PLATEADA del dorso del panel (metal cepillado, specs impresas, canto brillante).
// Es LA MISMA superficie: nunca se desmonta, nunca hay un fundido; cambian sus propiedades de material.
const Superficie: React.FC<{
  g: number; m: number; x: number; y: number; w: number; h: number; z: number; rot: number; fill: number;
}> = ({ g, m, x, y, w, h, z, rot, fill }) => {
  const papel = light(m, "paper", "silver");
  const veta = light(m, "concrete", "steel");
  const cols = 30;
  const pad = Math.round(w * 0.055);
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const step = innerW / cols;
  const barMax = innerH * 0.46;
  const sheen = clamp01((g - MAT_IN - 24) / 74);
  const drift = Math.sin(g / 43 + x) * 2.2;
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
      transform: `translateZ(${z}px) rotate(${rot.toFixed(2)}deg) translateY(${drift.toFixed(2)}px)`,
      transformStyle: "preserve-3d", overflow: "hidden",
      borderRadius: lerp(6, 16, m),
      background: `linear-gradient(${lerp(168, 104, m).toFixed(1)}deg, ${papel} 0%, ${rgba(papel, 0.88)} ${lerp(52, 34, m).toFixed(0)}%, ${rgba(veta, 0.72)} 100%)`,
      boxShadow: `0 ${Math.round(h * 0.13)}px ${Math.round(h * 0.2)}px ${rgba(V.ink0, 0.72)}, inset 0 1px 0 ${rgba(V.white, 0.5)}, inset 0 -2px 0 ${rgba(V.ink0, 0.22)}`,
    }}>
      {/* la VETA CEPILLADA del metal: nace mientras el papel muere */}
      <AbsoluteFill style={{
        opacity: 0.5 * m,
        backgroundImage: `repeating-linear-gradient(92deg, ${rgba(V.white, 0.5)} 0 1px, rgba(0,0,0,0) 1px 4px)`,
        mixBlendMode: "overlay",
      }} />
      {/* el GRANO del papel: muere mientras nace el metal */}
      <AbsoluteFill style={{
        opacity: 0.16 * (1 - m),
        backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)",
        backgroundSize: "3px 3px", mixBlendMode: "multiply",
      }} />

      {/* LAS 30 COLUMNAS: el cuaderno de los 30 días, dato real, se llena día por día */}
      {Array.from({ length: cols }, (_, i) => {
        const on = clamp01((fill * cols - i) / 0.9);
        const alto = (0.42 + rnd(i * 3.7) * 0.58) * barMax * on;
        const left = Math.round(pad + i * step + step * 0.22);
        const wd = Math.max(2, Math.round(step * 0.5));
        return (
          <React.Fragment key={i}>
            <div style={{
              position: "absolute", left, top: pad + innerH * 0.16, width: 1,
              height: innerH * 0.72, background: rgba(veta, lerp(0.32, 0.1, m)),
            }} />
            {alto > 0.5 && (
              <div style={{
                position: "absolute", left, bottom: pad + innerH * 0.12, width: wd, height: alto,
                background: rgba(V.volt, lerp(0.86, 0, clamp01(m * 1.7))),
                boxShadow: `0 0 ${Math.round(8 + 10 * on)}px ${rgba(V.volt, lerp(0.42, 0, clamp01(m * 1.7)))}`,
                borderRadius: 1,
              }} />
            )}
          </React.Fragment>
        );
      })}
      {/* la línea de base del cuaderno / el canto grabado de la etiqueta */}
      <div style={{
        position: "absolute", left: pad, right: pad, bottom: pad + innerH * 0.12, height: 2,
        background: rgba(veta, lerp(0.55, 0.3, m)),
      }} />

      {/* ENCABEZADO DEL CUADERNO (se apaga con el papel) */}
      {m < 0.62 && (
        <div style={{
          position: "absolute", left: pad, top: Math.round(pad * 0.7), opacity: 1 - clamp01(m / 0.6),
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.max(26, Math.round(w * 0.05)),
          letterSpacing: 2.4, color: rgba(V.ink1, 0.86), textTransform: "uppercase",
        }}>30 DÍAS · PIEZA POR PIEZA</div>
      )}

      {/* LO IMPRESO EN LA ETIQUETA (nace con el metal) — el único lugar donde no te pueden mentir */}
      {m > 0.42 && (
        <div style={{
          position: "absolute", left: pad * 1.2, top: pad * 1.1, opacity: clamp01((m - 0.42) / 0.4),
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.max(26, Math.round(w * 0.032)),
            letterSpacing: 3.2, color: rgba(V.ink1, 0.82), textTransform: "uppercase",
            textShadow: `0 1px 0 ${rgba(V.white, 0.7)}`,
          }}>MÓDULO FOTOVOLTAICO · 100 W</div>
          <div style={{
            marginTop: 10, fontFamily: F_BODY, fontWeight: 600,
            fontSize: Math.max(30, Math.round(w * 0.026)), lineHeight: 1.5, color: rgba(V.ink1, 0.68),
            textShadow: `0 1px 0 ${rgba(V.white, 0.6)}`,
          }}>
            Pmax 100 W · Vmp 17,8 V · Imp 5,62 A<br />
            STC: 1000 W/m2 · 25 &#176;C · AM 1,5
          </div>
        </div>
      )}

      {/* remaches del canto (la etiqueta es una chapa, no un cartel) */}
      {m > 0.5 && [0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "absolute", opacity: clamp01((m - 0.5) / 0.35),
          left: i % 2 === 0 ? pad * 0.42 : undefined, right: i % 2 === 1 ? pad * 0.42 : undefined,
          top: i < 2 ? pad * 0.42 : undefined, bottom: i >= 2 ? pad * 0.42 : undefined,
          width: 13, height: 13, borderRadius: "50%",
          background: `radial-gradient(circle at 34% 30%, ${rgba(V.white, 0.9)} 0%, ${rgba(V.steel, 0.9)} 46%, ${rgba(V.ink1, 0.75)} 100%)`,
        }} />
      ))}

      {/* BARRIDO ESPECULAR: cuando ya es metal, la luz corre por la chapa */}
      {m > 0.3 && sheen > 0 && sheen < 1 && (
        <AbsoluteFill style={{
          background: `linear-gradient(102deg, rgba(255,255,255,0) 34%, ${rgba(V.white, 0.5 * m)} 50%, rgba(255,255,255,0) 66%)`,
          transform: `translateX(${lerp(-120, 120, sheen).toFixed(1)}%)`, mixBlendMode: "screen",
        }} />
      )}
      {/* bisel de contacto */}
      <AbsoluteFill style={{
        boxShadow: `inset 0 0 ${Math.round(h * 0.16)}px ${rgba(V.ink0, 0.3)}`, borderRadius: lerp(6, 16, m),
      }} />
    </div>
  );
};

// ── TITULAR (una idea de texto por acto, sobre cama oscura, safe area 60 px) ──────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 24)) * 28;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 66, maxWidth: 1050,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={28}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size}>{head}</Head>
        {sub ? <div style={{ marginTop: 12 }}><Body size={31}>{sub}</Body></div> : null}
      </Bed>
    </div>
  );
};

// ── LAS CINCO PIEZAS: el carrusel lleva MATERIAL REAL en cada carta ──────────────────────────
const PIEZAS = [
  { src: "broll/cmetemu/cmet_mv_caja2.mp4", kind: "video" as const, label: "PANEL 100 W" },
  { src: "img/cmetemu/cmet_mv_caja2.jpg", kind: "photo" as const, label: "ESTACIÓN 600 Wh" },
  { src: "img/cmetemu/cmet_h05.jpg", kind: "photo" as const, label: "INVERSOR 3000 W" },
  { src: "img/cmetemu/cmet_mv_caja1.jpg", kind: "photo" as const, label: "CONTROLADOR PWM" },
  { src: "img/cmetemu/cmet_h09.jpg", kind: "photo" as const, label: "5 M DE CABLE" },
];

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovCaja: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si `gFrame` llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : [0, 0, F_A2, F_A3, F_A4, F_A5][Math.min(Math.max(acto, 0), 5)];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `sheenAt`, `PromiseGap`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -70, z1: 90, panX: -140, panY: -80, ry: -9, rx: 2.4, dur: 1290 });
  const zAcc =
    eio(0, 60, seg(g, 232, 300)) +                    // empuja contra la solapa antes de la oclusión
    eio(0, 200, seg(g, SCALE_IN, 624)) +              // se mete DENTRO de la carta que crece
    eio(0, -260, seg(g, 624, 812)) +                  // retrocede: el mostrador en plano general
    eio(0, 70, seg(g, INER_IN, 1002)) +               // el banco de trabajo, plano medio
    eio(0, 170, seg(g, MAT_IN, 1330));                // el macro final de la etiqueta
  const pxAcc =
    eio(0, 70, seg(g, 300, 470)) +
    eio(0, -360, seg(g, INER_IN, 962)) +              // EL BARRIDO A LA DERECHA (frontera 3→4)
    eio(0, -90, seg(g, 962, 1090)) +                  // el vector no frena de golpe
    eio(0, 60, seg(g, MAT_IN, 1320));
  const pyAcc =
    eio(0, 46, seg(g, 60, 250)) +                     // baja al piso del garaje
    eio(0, -34, seg(g, 620, 812)) +
    eio(0, 40, seg(g, 900, 1080)) +                   // se acuesta sobre el banco
    eio(0, -30, seg(g, MAT_IN, 1300));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // compensación de encuadre: los protagonistas quedan encuadrados mientras el decorado hace
  // todo el parallax (los planos profundos NO se compensan: ahí vive la profundidad).
  const pxTot = -140 * base.e + pxAcc;
  const pyTot = -80 * base.e + pyAcc;
  const cx = (v: number) => v - (pxTot / 1920) * 100;
  const cy = (v: number) => v - (pyTot / 1080) * 100;

  // ── LA LUZ: evoluciona, no salta. sky (mediodía duro) → white (el blanco se impone) ────────
  const cKey = light(seg(g, 40, 1210), "sky", "white");            // la key: lo que se mide
  const cContra = light(seg(g, 120, 1240), "orange", "bone");      // el contra: lo que prometen
  const keyFrom = 0.18 + eio(0, 0.30, seg(g, 30, 520)) + eio(0, 0.16, seg(g, 860, 1290));
  const intensity = 0.58 + eio(0, 0.30, seg(g, 0, 14)) + eio(0, 0.16, seg(g, 300, 900))
    + eio(0, -0.06, seg(g, 1180, 1340));

  // el haz del portón: barre del patio al banco y se acuesta sobre la chapa al final
  const hazX = 4 + eio(0, 16, seg(g, 20, 300)) + eio(0, 12, seg(g, INER_IN, 1010)) + eio(0, 8, seg(g, 1120, 1320));
  const hazY = 16 + eio(0, 22, seg(g, 20, 300)) + eio(0, -14, seg(g, 620, 900)) + eio(0, 18, seg(g, 1080, 1320));
  const hazA = 22 + eio(0, -14, seg(g, 20, 340)) + eio(0, 10, seg(g, 900, 1250));
  const hazP = 0.44 + eio(0, 0.30, seg(g, 0, 14)) + eio(0, 0.18, seg(g, 520, 900)) + eio(0, -0.10, seg(g, 1220, 1340));

  // la cama de foto: SIEMPRE hay imagen debajo de todo componente. Los dos cambios de cama caen
  // en instantes de cobertura del 100 % (f266 bajo la oclusión, f594 bajo la carta a sangre).
  const bed = g < 266
    ? "img/cmetemu/cmet_mv_caja1.jpg"
    : g < F_A3
      ? "img/cmetemu/cmet_mv_caja2.jpg"
      : "img/cmetemu/cmet_mv_caja3.jpg";

  // ── ACTO 1 · la caja naranja cerrada sobre el hormigón ────────────────────────────────────
  const a1On = g < 272;
  const cajaW = Math.round(lerp(980, 1280, ez(g, 16, 252)));
  const cajaH = Math.round(cajaW * 0.5625);
  const cajaOp = ez(g, 0, 12);                                    // rampa de entrada: 12 frames
  const p129X = lerp(70, 72, ez(g, 60, 200));
  const p129Y = lerp(42, 26, ez(g, 46, 132));                     // el naranja ENTRA DESDE ABAJO

  // ── ACTO 2 · las cinco piezas se ordenan en el aire ───────────────────────────────────────
  // el carrusel se monta a f264, BAJO la oclusión (ya formado y girando: nunca aparece de la nada)
  const ringOn = g >= 264 && g < 592;
  // vuelta EXACTA: a f548 la carta 0 (el panel) queda justo al frente; después sigue derivando
  const spin = ez(g, 292, SCALE_IN) + eio(0, 0.022, seg(g, SCALE_IN, 592));

  // ── LA CARTA DEL PANEL: la materia que cruza la frontera 2→3 creciendo hasta ser decorado ──
  const grow = ez(g, SCALE_IN, F_A3);
  const panelOn = g >= SCALE_IN && g < 972;
  const panelW = Math.round(lerp(420, 2600, grow));
  const panelH = Math.round(lerp(250, 1470, grow));
  const panelZ = lerp(540, -320, grow);
  const panelRad = Math.round(lerp(14, 0, ez(g, SCALE_IN, 588)));
  // en la frontera 3→4 el decorado SALE por la izquierda mientras la cámara sigue su vector
  const panelX = cx(50) - lerp(0, 150, ez(g, 848, 926));

  // ── ACTO 3 · el mostrador de la casa de electricidad ──────────────────────────────────────
  const tiendaOn = g >= F_A3 - 4 && g < 962;
  const tiendaX = cx(36) - lerp(0, 140, ez(g, 844, 918));         // se va entero con el barrido
  const tiendaW = Math.round(lerp(660, 720, ez(g, 600, 760)));
  const tiendaH = Math.round(tiendaW * 0.5625);
  const pgOn = ez(g, 626, 668) * (1 - ez(g, 820, 862));

  // el CARTEL DE PRECIO: la materia naranja que VIAJA con el barrido hasta el acto 4
  const cartelOn = g >= 690 && g < 1128;
  const cartelOp = 1 - ez(g, 1092, 1124);
  const viaje = ez(g, 850, 968);
  const cartelX = lerp(cx(43), cx(64), viaje);
  const cartelY = lerp(cy(66), cy(31), viaje);
  const cartelW = Math.round(lerp(270, 320, viaje));

  // ── ACTO 4 · el banco de trabajo entra por la derecha (INERCIA) ───────────────────────────
  const bancoOn = g >= 840;
  const bancoX = cx(50) + lerp(118, 0, ez(g, 848, 930));
  const pinzaOn = g >= 872;
  const pinzaW = Math.round(lerp(680, 780, ez(g, 880, 1010)));
  const pinzaH = Math.round(pinzaW * 0.5625);

  // ── LA SUPERFICIE: hoja del cuaderno → etiqueta plateada (frontera 4→5) ───────────────────
  const supOn = g >= 906;
  const m = ez(g, MAT_IN, 1152);                                  // 0 papel · 1 metal
  const supFill = ez(g, 930, 1086);                               // los 30 días se llenan
  const supW = Math.round(lerp(520, 1780, ez(g, MAT_IN, 1148)) - lerp(0, 550, ez(g, 1158, 1268)));
  const supH = Math.round(lerp(680, 1000, ez(g, MAT_IN, 1148)) - lerp(0, 305, ez(g, 1158, 1268)));
  const supX = lerp(cx(70), cx(50), ez(g, 1080, 1146));
  const supY = lerp(cy(50), cy(49), ez(g, 1080, 1146));
  const supRot = lerp(-3.2, 0, ez(g, 1088, 1160));

  // el scrim del decorado: nace con la carta que se vuelve decorado, nunca antes
  const scrim = ez(g, 556, 600) * lerp(0.46, 0.30, ez(g, MAT_IN, 1300));

  // ── ACTO 5 · el macro del dorso del panel detrás de la etiqueta ───────────────────────────
  const macroOn = g >= 1126;                                      // se monta con la superficie a sangre
  const macroW = Math.round(lerp(2900, 3400, ez(g, 1126, 1348)));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: UNA vez, arriba de todo, NUNCA remontada entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cContra} keyFrom={keyFrom} intensity={intensity} floor={0.52} />

      <Layers cam={cam}>
        {/* P1 · CAMA DE FOTO — debajo de TODO componente, siempre hay imagen */}
        <PhotoPlane
          src={bed} kind="photo" z={-680} scale={1.36}
          dim={lerp(0.52, 0.72, ez(g, 120, 900))} tint={cKey}
        />

        {/* P2 · el haz duro del portón abierto al patio */}
        <Plane z={-500}>
          <HazPorton x={hazX} y={hazY} ang={hazA} power={clamp01(hazP)} color={cKey} />
        </Plane>

        {/* P3 · EL DECORADO — el panel a sangre (acto 3) y el banco de trabajo (acto 4).
            En la frontera 3→4 se solapan: la cámara barre y el decorado cambia, sin hueco. */}
        <Plane z={-300}>
          {panelOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_caja2.mp4" kind="video"
              w={panelW} h={panelH} x={panelX} y={cy(50)} z={panelZ}
              ry={lerp(7, 0, grow)} rx={lerp(-3, 0, grow)} radius={panelRad}
              startFrom={12} lit={0.72} litColor={cKey} grade
              sheenAt={at(566)}
            />
          )}
          {bancoOn && (
            <MediaCard
              src="img/cmetemu/cmet_mv_caja4.jpg" kind="photo"
              w={2600} h={1470} x={bancoX} y={cy(50)} z={-40}
              ry={lerp(-6, 0, ez(g, 848, 960))} radius={0}
              lit={0.74} litColor={cKey} grade
            />
          )}
          {macroOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_caja2.mp4" kind="video"
              w={macroW} h={Math.round(macroW * 0.5625)} x={cx(50)} y={cy(50)} z={-20}
              ry={0} radius={0} startFrom={64} lit={0.9} litColor={V.white} grade
            />
          )}
          {/* scrim del decorado: lo lleva a valor de fondo sin apagarlo (⛔ nada de blur).
              Entra CON la carta que crece (f556-600): antes de eso el panel todavía es un objeto
              de la escena, no el decorado, y oscurecer ahí sería un fundido encubierto. */}
          {scrim > 0.001 && (
            <>
              <AbsoluteFill style={{ background: rgba(V.ink0, scrim) }} />
              <AbsoluteFill style={{ background: rgba(cKey, 0.05 * clamp01(scrim * 8)), mixBlendMode: "soft-light" }} />
            </>
          )}
        </Plane>

        {/* P4 · EL PISO — el hormigón del garaje que corre hasta el patio */}
        <Plane z={-190}>
          <PadPlane
            y={lerp(74, 82, ez(g, 60, 560))} w={1520} h={330} rx={63}
            lit={(0.92 - 0.5 * ez(g, 300, 700)) * (1 - 0.7 * ez(g, 900, 1120))} z={-60}
          />
        </Plane>

        {/* P5 · GRÁFICOS — estructura sobre material real (nunca sobre fondo plano) */}
        <Plane z={-60}>
          {/* el precio pagado: NARANJA (lo que prometen) y ENTRA DESDE ABAJO */}
          {g >= 44 && g < 268 && (
            <Readout value="129" unit="USD" label="LO QUE PAGUÉ" at={at(44)}
              x={cx(p129X)} y={cy(p129Y)} size={168} color={V.orange} />
          )}
          {/* el campo firma del video, a la escala del dinero: la tienda contra el envío */}
          {g >= 620 && g < 866 && (
            <Sequence from={Math.max(0, at(620))} layout="none">
              <PromiseGap
                promise={480} measured={129} unit="USD" slats={14}
                x={cx(65)} y={cy(38)} w={420} h={210} on={pgOn} nums
                label="LA TIENDA CONTRA LA CAJA"
              />
            </Sequence>
          )}
          {/* la cifra medida SIEMPRE entra en verde y desde la pinza */}
          {g >= 986 && g < 1132 && (
            <Readout value="30" unit="DÍAS" label="UNA PIEZA POR VEZ" at={at(986)}
              x={cx(31)} y={cy(21)} size={132} color={V.volt} />
          )}
        </Plane>

        {/* P6 · EL MATERIAL REAL — los protagonistas de cada acto ── */}
        <Plane z={20}>
          {/* ACTO 1 — la caja naranja cerrada sobre el hormigón. Sale por OCLUSIÓN de cartón. */}
          {a1On && (
            <div style={{ opacity: cajaOp }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_caja1.mp4" kind="video"
                w={cajaW} h={cajaH} x={cx(50)} y={cy(lerp(48, 52, ez(g, 20, 240)))} z={0}
                ry={lerp(8, -1.5, ez(g, 16, 250))} rx={lerp(-4, 1, ez(g, 16, 250))}
                radius={16} startFrom={3} lit={0.62 + 0.38 * ez(g, 10, 120)}
                litColor={cContra} label="LO QUE LLEGÓ AL GARAJE" sheenAt={at(88)}
              />
            </div>
          )}

          {/* ACTO 2 — LAS CINCO PIEZAS orbitando en un cilindro real, cada carta con material real */}
          {ringOn && (
            <Carousel3D
              items={PIEZAS}
              spin={spin} radius={540} cardW={420} cardH={250}
              y={cy(50)} focus={0} litColor={cKey}
            />
          )}

          {/* ACTO 3 — el mostrador de la casa de electricidad (sale con el barrido a la derecha) */}
          {tiendaOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_caja3.mp4" kind="video"
              w={tiendaW} h={tiendaH} x={tiendaX} y={cy(56)} z={0}
              ry={lerp(9, 2, ez(g, F_A3, 720))} rx={-1.5} radius={16} startFrom={7}
              lit={0.95} litColor={cKey} label="CASA DE ELECTRICIDAD · MI CIUDAD" sheenAt={at(626)}
            />
          )}

          {/* EL CARTEL DE PRECIO: cartón naranja que VIAJA con la cámara y cruza la frontera 3→4 */}
          {cartelOn && (
            <div style={{ opacity: cartelOp }}>
              <MediaCard
                src="img/cmetemu/cmet_mv_caja3.jpg" kind="photo"
                w={cartelW} h={Math.round(cartelW * 0.62)} x={cartelX} y={cartelY} z={90}
                ry={lerp(-9, -3, viaje)} rot={lerp(-3, 1.5, viaje)} radius={10}
                lit={0.9} litColor={V.orange} label="480" sheenAt={at(872)}
              />
            </div>
          )}

          {/* ACTO 4 — la pinza mordiendo el cable, display verde */}
          {pinzaOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_caja4.mp4" kind="video"
              w={pinzaW} h={pinzaH}
              x={cx(lerp(46, 35, ez(g, 900, 1030))) + lerp(62, 0, ez(g, 872, 948))}
              y={cy(lerp(52, 55, ez(g, 900, 1060)))}
              z={0} ry={lerp(-8, 4, ez(g, 880, 1080))} rx={1.5} radius={16} startFrom={9}
              lit={0.98} litColor={V.volt} label="PINZA AMPERIMÉTRICA · CADA PIEZA" sheenAt={at(898)}
            />
          )}

          {/* LA SUPERFICIE QUE MUTA — hoja del cuaderno (acto 4) → etiqueta plateada (acto 5) */}
          {supOn && (
            <div style={{ opacity: ez(g, 906, 936) }}>
              <Superficie g={g} m={m} x={supX} y={supY} w={supW} h={supH} z={80} rot={supRot} fill={supFill} />
            </div>
          )}

          {/* ACTO 5 — Claudio midiendo: material real que ancla el veredicto */}
          {g >= 1206 && (
            <div style={{ opacity: ez(g, 1206, 1240) }}>
              <MediaCard
                src="img/cmetemu/cmet_h02.jpg" kind="photo"
                w={300} h={176} x={cx(76)} y={cy(78)} z={140}
                ry={-9} rot={1.6} radius={12} lit={0.95} litColor={V.white} sheenAt={at(1224)}
              />
            </div>
          )}

          {/* íconos PNG sin fondo como objetos de la escena (suman capa, no reemplazan material) */}
          {g >= 96 && g < 250 && (
            <div style={{ opacity: ez(g, 96, 126) * (1 - ez(g, 226, 250)) }}>
              <IconPng src="img/cmetemu/cmet_ic_moneda.png" x={cx(63)} y={cy(30)} size={82} z={150} glow={V.ink0} />
            </div>
          )}
          {g >= 940 && g < 1104 && (
            <div style={{ opacity: ez(g, 940, 972) * (1 - ez(g, 1080, 1104)) }}>
              <IconPng src="img/cmetemu/cmet_ic_pinza.png" x={cx(22)} y={cy(31)} size={96} z={170} glow={V.ink0} />
            </div>
          )}
          {g >= 1246 && (
            <div style={{ opacity: ez(g, 1246, 1284) }}>
              <IconPng src="img/cmetemu/cmet_ic_etiqueta.png" x={cx(13)} y={cy(76)} size={84} z={200} glow={V.ink0} />
            </div>
          )}
        </Plane>

        {/* P7 · PRIMER PLANO — motas de cartón y polvo del garaje (hold VIVO permanente) */}
        <Plane z={230}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.35 + rnd(i * 4.9) * 1.2;
            const yy = ((rnd(i * 8.7) * 132 - (g * sp) / 24) % 132 + 132) % 132 - 14;
            const s = 2 + rnd(i * 2.3) * 3.6;
            const naranja = rnd(i * 11.3) > 0.62;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(6 + rnd(i * 6.7) * 88).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(naranja ? V.orange : cKey, (0.1 + rnd(i * 3.1) * 0.22) * clamp01(hazP + 0.2)),
                boxShadow: `0 0 ${Math.round(5 + s * 3)}px ${rgba(naranja ? V.orange : cKey, 0.2)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, ⛔ nunca un fade) ── */}
      {/* f258 · frontera 1→2 · OCLUSIÓN con el CARTÓN NARANJA: la solapa cruza y tapa el 100 % */}
      <SeamOcclude at={at(SEAM_OCC)} dur={16} color={V.orange} angle={6} lit={0.32} />
      {/* f1096 · frontera 4→5 · MATERIA: polvillo de metal cruzando mientras la hoja se vuelve chapa */}
      <SeamWipeMatter at={at(MAT_IN + 6)} dur={54} tint={V.silver} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={26} outF={228} kick="LO QUE PAGUÉ" head="CIENTO VEINTINUEVE DÓLARES"
          size={70} kickColor={V.orange}
          sub="Eso salió la caja naranja que ves atrás." />
        <Titular g={g} inF={306} outF={520} kick="LO QUE VINO ADENTRO" head="CINCO PIEZAS Y UNA BOLSITA"
          size={70} kickColor={V.orange}
          sub="Panel, estación, inversor, controlador y cable." />
        <Titular g={g} inF={612} outF={822} kick="EN UNA CASA DE ELECTRICIDAD"
          head="CUATROCIENTOS OCHENTA EN LA TIENDA" size={62} kickColor={V.orange}
          sub="Lo mismo, cotizado en mi ciudad." />
        <Titular g={g} inF={884} outF={1074} kick="LO ÚNICO QUE SÉ HACER" head="TREINTA DÍAS CON LA PINZA"
          size={70} sub="Una pieza por vez, todos los días." />

        {/* el envío incluido: chip corto, anclado a «todo junto con el envío» (f517) */}
        {g >= 506 && g < 588 && (
          <div style={{
            position: "absolute", right: 66, top: 92, textAlign: "right",
            opacity: ez(g, 506, 532) * (1 - ez(g, 566, 588)),
          }}>
            <Bed pad={20}>
              <Kick color={V.orange}>ENVÍO INCLUIDO</Kick>
            </Bed>
          </div>
        )}

        {/* ni manual ni reseñas: anclado a f1033 */}
        {g >= 1030 && g < 1108 && (
          <div style={{
            position: "absolute", left: 66, top: 92, textAlign: "left",
            opacity: ez(g, 1030, 1056) * (1 - ez(g, 1086, 1108)),
          }}>
            <Bed pad={20}>
              <Kick color={rgba(V.white, 0.7)}>NI MANUAL NI RESEÑAS</Kick>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · EL REMATE ESCRITO SOBRE LA ETIQUETA PLATEADA (⛔ nunca sobre fondo plano) */}
        {g >= 1146 && (
          <div style={{
            position: "absolute", left: "50%", top: "47%",
            transform: `translate(-50%,-50%) scale(${(1 + (1 - ez(g, 1146, 1176)) * 0.1).toFixed(3)})`,
            textAlign: "center", opacity: ez(g, 1146, 1168),
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 6,
              color: rgba(V.ink1, 0.72), textTransform: "uppercase", marginBottom: 6,
              textShadow: `0 1px 0 ${rgba(V.white, 0.55)}`,
            }}>LO ÚNICO QUE HICE</div>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 216, lineHeight: 0.9,
              letterSpacing: 4, color: rgba(V.ink0, 0.86),
              textShadow: `0 2px 0 ${rgba(V.white, 0.55)}, 0 -1px 0 ${rgba(V.ink0, 0.4)}`,
            }}>MEDÍ.</div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
