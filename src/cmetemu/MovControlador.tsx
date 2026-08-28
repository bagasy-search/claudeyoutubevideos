// MovControlador.tsx — S11 · UN MOVIMIENTO CONTINUO de 63 s (1890 frames @30fps)
// ⭐ EL PAYOFF DEL VIDEO: el lazo que se abrio en el segundo 40 («la pieza que decide todo vino de
// regalo») se paga aca. «La cajita de nueve dolares se queda con un cuarto de tu panel, en silencio,
// todos los dias.»
//
// LO QUE HAY QUE HACER VER (y es lo dificil): los veinte vatios de diferencia NO se pierden en el
// cable — DIRECTAMENTE NO SE GENERAN. Por eso el mecanismo se cuenta con la CURVA DE POTENCIA del
// panel: la rama izquierda es una RECTA (la corriente no cambia: 5,2 A), asi que la potencia es
// 5,2 x tension. El PWM ata el panel a los 13,2 V de la bateria y el punto de trabajo se DESLIZA
// hacia abajo por su propia curva: el area que queda entre el punto y el pico nunca existio.
// El MPPT es una TRANSACCION: entrega voltios y recibe amperios (17,1x5,2 = 89 -> 13,2x6,45 = 85,2).
//
// UNA sola atmosfera montada arriba de todo, UNA camara funcion de `gFrame` que nunca vuelve a 0,
// la luz evoluciona (torch -> white -> volt) y hay MATERIA que cruza CADA frontera. Ninguna union
// es un fade. El protagonista de cada acto es MATERIAL REAL dentro de vidrio; la curva, los ejes y
// el punto son ESTRUCTURA GRAFICA, nunca el objeto.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cam z≈-30 abierta y todavia abriendo (hereda de `MovApagon`) · luz TORCH
//                       cayendo a WHITE (el patio al amanecer, el panel al sol) · materia: EL PATIO
//                       AL AMANECER sobre el hormigon del banco.
//                EXIT   cam z≈+120 empujando al 34%/43% del cuadro · luz white plena · materia: EL
//                       METAL PLATEADO DEL BORNE DE ENTRADA del controlador (la camara entra en el).
//
// acto 2 · f340  ENTER  cam z≈+120 saliendo del interior del borne (escala 2,7 -> 1) · luz white,
//                       key corrida a la izquierda · materia: EL PLATEADO DEL BORNE = EL PLATEADO DE
//                       LA ETIQUETA del dorso del panel (la misma materia, otra escala).
//                EXIT   cam z≈-40 retrocediendo (del macro a la escala del grafico) · luz white ·
//                       materia: EL RENGLON Vmp de la etiqueta, encendido y estirandose.
//
// acto 3 · f643  ENTER  cam z≈-40 retrocediendo, pan a la izquierda · luz white con el volt entrando
//                       por la curva · materia: EL RENGLON Vmp, que YA ES el eje de tension.
//                EXIT   cam z≈+110 arrancando su empuje hacia el punto · luz white/volt · materia:
//                       EL PUNTO DE MAXIMA POTENCIA, encendido sobre la curva.
//
// acto 4 · f983  ENTER  cam z≈+110 CON EL MISMO VECTOR (la camara no frena en la frontera) · luz
//                       white con el naranja del contra subiendo · materia: EL PUNTO, que se desliza
//                       del pico a los 13,2 V por su propia recta.
//                EXIT   cam z≈+150 asentandose · luz naranja plena en el contra (el area perdida) ·
//                       materia: LA ETIQUETA PLATEADA, que vuelve y cruza el cuadro entero.
//
// acto 5 · f1323 ENTER  cam z≈+30 abriendo (heredada, sigue soltando el empuje del acto 4) · luz
//                       white->volt, el contra naranja bajando · materia: EL PLATEADO que acaba de
//                       cruzar = la carcasa abierta del MPPT y su BOBINA.
//                EXIT   cam z≈-30 alejandose · luz volt subiendo · materia: EL MPPT MACRO, que se
//                       encoge y aterriza dentro de la foto de los dos controladores.
//
// acto 6 · f1663 ENTER  cam z≈-30 siguiendo el retroceso · luz volt dominante · materia: LOS DOS
//                       CONTROLADORES sobre el banco, ya como decorado.
//                EXIT   cam z≈-190 asentada, deriva viva · luz WHITE CAYENDO A VOLT · materia: LAS
//                       DOS CIFRAS ENFRENTADAS 68,6 y 85,2  → asi arranca `MovCierre`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f322  frontera 1→2 : PORTAL / ZOOM-THROUGH sobre el borne de entrada (fx 34 / fy 43, dur 22).
//                      La camara ENTRA en el tornillo plateado y SALE en el macro de la etiqueta.
// f630  frontera 2→3 : MORFO — el renglon Vmp de la etiqueta (barra plateada 560x34 en x50/y51) se
//                      estira y SE CONVIERTE en el eje de tension del grafico (1360x5 en x51/y74).
//                      Morph 630 → 726; la barra nunca desaparece, cambia de forma.
// f983  frontera 3→4 : INERCIA — ningun corte: la camara sigue su vector (rampa 972→1150) mientras
//                      el decorado cambia detras (se van las cifras del pico, entra la bateria).
//                      El PUNTO sobrevive encendido y se desliza.
// f1316 frontera 4→5 : OCLUSION con `V.silver` (LA ETIQUETA PLATEADA, dur 16, cobertura total en
//                      f1324). Detras ya esta el MPPT abierto. Tambien tapa el cambio de cama de foto.
// f1663 frontera 5→6 : ESCALA — el MPPT que ocupaba el cuadro se encoge a 240 px y aterriza sobre la
//                      foto de los dos controladores, que crece de chip a decorado de banco.
// (cinco fronteras, cinco costuras distintas, ninguna repetida, ninguna es un fade)
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo funcion pura de gFrame; ⛔ nunca Math.random) ───────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));
const fmt = (n: number, d: number) => n.toFixed(d).replace(".", ",");

// frames maestros (los de la ficha)
const F_A2 = 340;
const F_A3 = 643;
const F_A4 = 983;
const F_A5 = 1323;
const F_A6 = 1663;
const SEAM_PORTAL = 322;
const SEAM_MORFO = 630;
const SEAM_INERCIA = 983;
const SEAM_OCC = 1316;
const SEAM_ESCALA = 1663;

// ── GEOMETRIA DEL GRAFICO (viewBox 1920x1080) ───────────────────────────────────────────────
// Eje X = TENSION 0..22 V · Eje Y = POTENCIA 0..100 W. Proporciones REALES, no decorativas.
const AX_L = 300;
const AX_R = 1660;
const AX_Y = 800;
const P_TOP = 180;
const PXV = (AX_R - AX_L) / 22;      // 61,818 px por voltio
const PYW = (AX_Y - P_TOP) / 100;    // 6,20 px por vatio
const xv = (v: number) => AX_L + v * PXV;
const yw = (w: number) => AX_Y - w * PYW;
const VMP = 17.1;
const VBAT = 13.2;
const IMP = 5.2;
// La rama izquierda de la curva es una RECTA: la corriente es constante, asi que P = 5,2 x V.
// Por eso 13,2 V cae EXACTO en 68,6 W sobre la propia curva del panel: no hay trampa en el dibujo.
const D_CURVA = "M 300 800 L 1116 374.7 L 1357.1 248.2 L 1412 300 L 1480 432 L 1546 592 L 1635.3 800";

// ── LA LUZ DEL PORTON — el haz de la manana que entra al garaje y nunca se va del cuadro ─────
const Porton: React.FC<{ x: number; y: number; ang: number; power: number; color: string }> = ({
  x, y, ang, power, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 1900, height: 900, marginTop: -450, transformOrigin: "0% 50%",
      transform: `rotate(${ang.toFixed(2)}deg)`,
      background: `linear-gradient(90deg, ${rgba(color, 0.26 * power)} 0%, ${rgba(color, 0.11 * power)} 38%, rgba(0,0,0,0) 78%)`,
      clipPath: "polygon(0% 46%, 100% 0%, 100% 100%, 0% 54%)",
      mixBlendMode: "screen",
    }} />
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 520, height: 520, marginLeft: -260, marginTop: -260, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.46 * power)} 0%, ${rgba(color, 0.13 * power)} 36%, rgba(0,0,0,0) 70%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── ROTULO DE ESTRUCTURA (detalle >= 32 px, siempre con sombra fuerte) ───────────────────────
const Tag: React.FC<{
  x: number; y: number; children: React.ReactNode; color?: string; size?: number;
  align?: "left" | "center" | "right"; op?: number;
}> = ({ x, y, children, color = V.bone, size = 33, align = "center", op = 1 }) => (
  <div style={{
    position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
    transform: `translate(${align === "center" ? "-50%" : align === "right" ? "-100%" : "0"}, -50%)`,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 2.6,
    textTransform: "uppercase", color, whiteSpace: "nowrap", opacity: op,
    textShadow: "0 4px 20px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)",
  }}>{children}</div>
);

// ── TITULAR (UNA idea de texto por acto, sobre cama oscura, safe area 60 px) ──────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 70, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 24)) * 28;
  return (
    <div style={{
      position: "absolute", left: 64, bottom: 68, maxWidth: 1010,
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

// ── UN LADO DE LA TRANSACCION DEL MPPT (va SOBRE la carcasa real, nunca sobre fondo plano) ───
const Gate: React.FC<{
  x: number; y: number; titulo: string; volt: string; amp: string; watt: string;
  color: string; op: number; scale?: number;
}> = ({ x, y, titulo, volt, amp, watt, color, op, scale = 1 }) => {
  if (op <= 0.001) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: 340, marginLeft: -170,
      textAlign: "center", opacity: op,
      transform: `translateY(-50%) scale(${scale.toFixed(3)})`,
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.4,
        textTransform: "uppercase", color: rgba(V.white, 0.82), marginBottom: 10,
        textShadow: "0 4px 20px rgba(0,0,0,0.95)",
      }}>{titulo}</div>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 92, lineHeight: 0.92, color,
        textShadow: `0 0 34px ${rgba(color, 0.42)}, 0 6px 26px rgba(0,0,0,0.95)`,
      }}>{volt}<span style={{ fontSize: 38, marginLeft: 8, opacity: 0.82 }}>V</span></div>
      <div style={{
        marginTop: 6, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 74, lineHeight: 0.94,
        color: V.volt, textShadow: `0 0 30px ${rgba(V.volt, 0.40)}, 0 6px 24px rgba(0,0,0,0.95)`,
      }}>{amp}<span style={{ fontSize: 34, marginLeft: 8, opacity: 0.82 }}>A</span></div>
      <div style={{
        marginTop: 12, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 1.6,
        color: V.white, textShadow: "0 4px 20px rgba(0,0,0,0.95)",
      }}>= {watt} W</div>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovControlador: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const ACTO_IN = [0, 0, F_A2, F_A3, F_A4, F_A5, F_A6];
  const g = gRaw > 0 ? gRaw : ACTO_IN[Math.min(Math.max(acto, 1), 6)];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`, `PromiseGap`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CAMARA: UNA sola, funcion de g, acumulativa. ⛔ ningun acto la reinicia ─────────────
  const base = gcam(g, { z0: -30, z1: 250, panX: -74, panY: -44, ry: -7, rx: 2.2, dur: 1760 });
  const zAcc =
    eio(0, 130, seg(g, 300, 358)) +        // PORTAL: entramos en el borne
    eio(0, -170, seg(g, 640, 790)) +       // salimos del macro a la escala del grafico
    eio(0, 150, seg(g, SEAM_INERCIA - 11, 1150)) + // INERCIA: la camara acompana al punto que cae
    eio(0, -120, seg(g, 1330, 1490)) +     // abrimos sobre el MPPT
    eio(0, -180, seg(g, SEAM_ESCALA, 1840)); // ESCALA: todo se aleja, quedan las dos cifras
  const pxAcc =
    eio(0, 62, seg(g, 300, 386)) +
    eio(0, -136, seg(g, 640, 810)) +
    eio(0, 92, seg(g, SEAM_INERCIA - 11, 1170)) +
    eio(0, -66, seg(g, 1330, 1510)) +
    eio(0, 26, seg(g, SEAM_ESCALA, 1850));
  const pyAcc =
    eio(0, -38, seg(g, 300, 386)) +
    eio(0, 26, seg(g, 640, 800)) +
    eio(0, -58, seg(g, 1060, 1230)) +      // sigue al punto que baja
    eio(0, 34, seg(g, 1330, 1520)) +
    eio(0, -44, seg(g, SEAM_ESCALA, 1860));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: EVOLUCIONA, no salta. torch (heredada del apagon) -> white -> volt (el cierre) ──
  // continua por construccion: la primera rampa llega a `white` en f150 y la segunda arranca en
  // `white` en f1290, asi que el relevo en f1290 no cambia ni un valor.
  const tWarm = seg(g, 0, 150);
  const tCold = seg(g, 1290, 1830);
  const cKey = tCold > 0 ? light(tCold, "white", "volt") : light(tWarm, "torch", "white");
  // el contra: ambar (la bateria, la casa) que sube a NARANJA cuando aparece lo que no se genera,
  // y vuelve a bajar cuando el MPPT lo resuelve.
  const cWarm = light(seg(g, 900, 1290) * (1 - 0.55 * seg(g, 1420, 1780)), "amber", "orange");
  const keyFrom = 0.24 + eio(0, 0.40, seg(g, 20, 620)) + eio(0, -0.26, seg(g, 980, 1560));
  const intensity = 0.70 + eio(0, 0.24, seg(g, 0, 90)) + eio(0, -0.12, seg(g, 1740, 1888));

  // el haz del porton: barre de izquierda a derecha con la manana, baja sobre el grafico y vuelve
  const flick = 0.965 + 0.035 * rnd(Math.floor(g / 9) * 2.3) + Math.sin(g / 71) * 0.02;
  const hzX = 4 + eio(0, 20, seg(g, 0, 330)) + eio(0, -12, seg(g, 660, 900)) + eio(0, 16, seg(g, 1330, 1700));
  const hzY = 16 + eio(0, 12, seg(g, 0, 330)) + eio(0, 26, seg(g, 660, 1000)) + eio(0, -20, seg(g, 1330, 1720));
  const hzA = 24 + eio(0, -14, seg(g, 0, 400)) + eio(0, 18, seg(g, 900, 1400));
  const hzP = (0.62 + eio(0, 0.22, seg(g, 0, 120)) + eio(0, -0.18, seg(g, 1000, 1340))
    + eio(0, 0.20, seg(g, 1420, 1760))) * flick;

  // ══════════════ ACTO 1 · LA CAJITA DEL REGALO ══════════════════════════════════════════════
  const zt = zoomThrough(g, SEAM_PORTAL, 22, 34, 43);
  const a1On = g < SEAM_PORTAL + 23;
  const conW = Math.round(lerp(1010, 1180, ez(g, 20, 316)));
  const conH = Math.round(conW * 0.5625);
  // el cable de la escena: panel -> cajita -> bateria (la idea entera del acto en una linea)
  const lineaOn = ez(g, 96, 190);
  const iconOp = ez(g, 84, 150) * (1 - ez(g, 292, 322));

  // ══════════════ ACTO 2 · DIECISIETE COMA UNO ═══════════════════════════════════════════════
  const a2On = g >= F_A2 - 4 && g < SEAM_MORFO + 120;
  const a2Scale = lerp(2.72, 1, ez(g, F_A2, 424));
  const etiqW = Math.round(lerp(1180, 980, ez(g, 470, 640)));
  const etiqH = Math.round(etiqW * 0.5625);
  const etiqY = lerp(46, 43, ez(g, 470, 640));
  // la etiqueta se va encogiendo a chip y se apaga cuando el grafico ya se sostiene solo
  const chipOp = ez(g, 646, 700) * (1 - ez(g, 900, 950));

  // ── MORFO 2→3: el RENGLON Vmp se convierte en el EJE DE TENSION ───────────────────────────
  const mMorph = ez(g, SEAM_MORFO, 726);
  const rowW = Math.round(lerp(560, AX_R - AX_L, mMorph));
  const rowH = Math.round(lerp(34, 5, mMorph));
  const rowX = lerp(50, ((AX_L + AX_R) / 2 / 1920) * 100, mMorph);
  const rowY = lerp(51, (AX_Y / 1080) * 100, mMorph);
  const rowOn = g >= 452;
  const rowLit = ez(g, 452, 500);

  // ══════════════ ACTO 3 · SU PUNTO PERFECTO ═════════════════════════════════════════════════
  const ejeVOn = ez(g, 700, 748);                       // el eje de potencia (vertical)
  const revW = lerp(0, AX_R - AX_L + 46, ez(g, 712, 900));  // la curva se revela por el tiempo
  const dotOn = g >= 828;
  const dotPop = ez(g, 828, 858);

  // ── INERCIA 3→4: EL PUNTO se desliza del pico a la tension de la bateria, por su propia recta
  const slide = ez(g, 1096, 1208);
  const dotV = lerp(VMP, VBAT, slide);
  const dotX = xv(dotV);
  const dotY = yw(dotV * IMP);                          // exacto sobre la recta: P = 5,2 x V

  // ══════════════ ACTO 4 · EL PWM LO ARRASTRA A TRECE COMA DOS ═══════════════════════════════
  const wedge = ez(g, 1216, 1300);                      // el area que NO se genera
  const wedgeW = (xv(VMP) - xv(VBAT)) * wedge;
  const pwmCardOn = g >= 900;                           // el culpable entra ANTES de la frontera
  const pwmCardOp = ez(g, 900, 950) * (1 - ez(g, 1298, 1316));

  // ══════════════ ACTO 5 · CAMBIA VOLTIOS POR AMPERIOS ═══════════════════════════════════════
  const a5On = g >= SEAM_OCC + 4;
  const trade = ez(g, 1478, 1596);
  const vOut = lerp(VMP, VBAT, trade);
  const aOut = lerp(IMP, 6.45, trade);
  const wOut = lerp(89, 85.2, trade);
  // ESCALA 5→6: el macro del MPPT se encoge y aterriza sobre la foto de los dos controladores
  const shrink = ez(g, SEAM_ESCALA, 1790);
  const mpW = Math.round(lerp(1180, 240, shrink));
  const mpH = Math.round(mpW * 0.5625);
  // aterriza en el hueco libre del banco: fuera de las dos barras y fuera del titular
  const mpX = lerp(50, 84, shrink);
  const mpY = lerp(44, 78, shrink);
  // la bobina: el corazon del MPPT, late con cada transaccion
  const coil = 0.5 + 0.5 * Math.sin((g - 1400) / 13);
  const coilOp = ez(g, 1372, 1430) * (1 - ez(g, SEAM_ESCALA, 1730));

  // ══════════════ ACTO 6 · SESENTA Y OCHO CONTRA OCHENTA Y CINCO ═════════════════════════════
  const benchOn = g >= 1596;
  const benchW = Math.round(lerp(300, 1500, ez(g, SEAM_ESCALA, 1800)));
  const benchH = Math.round(lerp(170, 520, ez(g, SEAM_ESCALA, 1800)));
  const benchX = lerp(76, 50, ez(g, SEAM_ESCALA, 1800));
  const benchY = lerp(22, 64, ez(g, SEAM_ESCALA, 1800));

  // los TOKENS de la transaccion: dos arcos que se cruzan sobre la bobina (voltios que bajan,
  // amperios que suben). Curva de Bezier cuadratica evaluada a mano: pura funcion de g.
  const bez = (p0: number, p1: number, p2: number, t: number) =>
    (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  const tokOp = ez(g, 1444, 1500) * (1 - ez(g, 1690, 1740));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMOSFERA: se monta UNA vez arriba de todo y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={0.56} />

      <Layers cam={cam}>
        {/* P1 · CAMA DE FOTO bajo TODO componente. Cambia de foto DEBAJO de la oclusion de f1316,
            que tapa el 100 % del cuadro: el espectador nunca ve el relevo. */}
        {g < SEAM_OCC + 8 ? (
          <PhotoPlane
            src="img/cmetemu/cmet_h03.jpg" kind="photo" z={-680} scale={1.30}
            dim={lerp(0.44, 0.70, ez(g, 60, 900))} tint={V.torch}
          />
        ) : (
          <PhotoPlane
            src="img/cmetemu/cmet_h11.jpg" kind="photo" z={-680} scale={1.26}
            dim={lerp(0.66, 0.52, ez(g, 1500, 1860))} tint={V.volt}
          />
        )}

        {/* P2 · el haz del porton (volumetrico, siempre vivo) */}
        <Plane z={-460}>
          <Porton x={hzX} y={hzY} ang={hzA} power={clamp01(hzP)} color={cKey} />
        </Plane>

        {/* P3 · el hormigon del banco: el suelo sobre el que aterriza todo lo que flota */}
        <Plane z={-260}>
          <PadPlane y={78} w={1500} h={330} rx={62} lit={0.55 + 0.45 * ez(g, 40, 260)} z={-40} />
        </Plane>

        {/* P4 · ESTRUCTURA GRAFICA: el renglon que se vuelve eje, la curva, el punto, el area ── */}
        <Plane z={-60}>
          {/* MORFO: este rectangulo ES el renglon Vmp de la etiqueta y ES el eje de tension */}
          {rowOn && (
            <div style={{
              position: "absolute", left: `${rowX.toFixed(2)}%`, top: `${rowY.toFixed(2)}%`,
              width: rowW, height: rowH, marginLeft: -rowW / 2, marginTop: -rowH / 2,
              borderRadius: Math.round(lerp(8, 2, mMorph)),
              // la materia no cambia de golpe: el plateado de la etiqueta VIRA a blanco de eje
              background: `linear-gradient(90deg, ${rgba(V.silver, 0.10)} 0%, ${rgba(light(mMorph, "silver", "white"), 0.92)} 20%, ${rgba(light(mMorph, "silver", "white"), 0.92)} 80%, ${rgba(V.silver, 0.10)} 100%)`,
              boxShadow: `0 0 ${Math.round(lerp(40, 16, mMorph))}px ${rgba(V.silver, 0.55 * rowLit)}`,
              opacity: 0.35 + 0.65 * rowLit,
            }} />
          )}

          {/* el eje de POTENCIA (vertical) crece cuando el eje de tension ya es eje */}
          {g >= 700 && (
            <div style={{
              position: "absolute", left: `${((AX_L / 1920) * 100).toFixed(2)}%`,
              top: `${((P_TOP - 30) / 1080 * 100).toFixed(2)}%`,
              width: 4, height: (AX_Y - P_TOP + 30) * ejeVOn, marginLeft: -2,
              background: `linear-gradient(180deg, ${rgba(V.white, 0.05)} 0%, ${rgba(V.white, 0.55)} 100%)`,
            }} />
          )}

          {/* LA CURVA DE POTENCIA DEL PANEL + EL AREA QUE NO SE GENERA */}
          {g >= 706 && (
            <svg viewBox="0 0 1920 1080" style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
            }}>
              <defs>
                <clipPath id="cmetConRevela">
                  <rect x={AX_L - 14} y={0} width={revW} height={1080} />
                </clipPath>
                <clipPath id="cmetConWedge">
                  <rect x={xv(VBAT) - 1} y={0} width={wedgeW + 2} height={1080} />
                </clipPath>
                <pattern id="cmetConHatch" width="16" height="16" patternTransform="rotate(-58)"
                  patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="7" height="16" fill={rgba(V.orange, 0.42)} />
                </pattern>
              </defs>

              {/* EL AREA QUE NO SE PRODUCE: entre donde el PWM te obliga a trabajar y el pico.
                  No es una perdida en el cable — es potencia que NUNCA EXISTIO. */}
              {wedge > 0.01 && (
                <g clipPath="url(#cmetConWedge)">
                  <polygon
                    points={`${xv(VBAT)},${yw(VBAT * IMP)} ${xv(VMP)},${yw(VMP * IMP)} ${xv(VBAT)},${yw(VMP * IMP)}`}
                    fill="url(#cmetConHatch)"
                  />
                  <polygon
                    points={`${xv(VBAT)},${yw(VBAT * IMP)} ${xv(VMP)},${yw(VMP * IMP)} ${xv(VBAT)},${yw(VMP * IMP)}`}
                    fill={rgba(V.orange, 0.13)} stroke={rgba(V.orange, 0.75)} strokeWidth={3}
                  />
                </g>
              )}

              {/* la linea fantasma de los 89 W: el techo del que te bajaron */}
              {g >= 1206 && (
                <line
                  x1={xv(VBAT) - 40} y1={yw(VMP * IMP)}
                  x2={xv(VBAT) - 40 + (xv(VMP) - xv(VBAT) + 60) * ez(g, 1206, 1266)}
                  y2={yw(VMP * IMP)}
                  stroke={rgba(V.orange, 0.62)} strokeWidth={3} strokeDasharray="12 10"
                />
              )}

              {/* la caida vertical desde el pico hasta el punto de trabajo */}
              {slide > 0.02 && (
                <line
                  x1={xv(VBAT)} y1={yw(VMP * IMP)} x2={xv(VBAT)}
                  y2={yw(VMP * IMP) + (yw(VBAT * IMP) - yw(VMP * IMP)) * clamp01(slide * 1.15)}
                  stroke={rgba(V.orange, 0.9)} strokeWidth={5} strokeLinecap="round"
                />
              )}

              {/* LA CURVA (se revela por el eje de tension) */}
              <g clipPath="url(#cmetConRevela)">
                <path d={D_CURVA} fill="none" stroke={rgba(V.volt, 0.18)} strokeWidth={20}
                  strokeLinejoin="round" strokeLinecap="round" />
                <path d={D_CURVA} fill="none" stroke={V.volt} strokeWidth={7}
                  strokeLinejoin="round" strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 15px ${rgba(V.volt, 0.8)})` }} />
              </g>

              {/* la guia punteada del Vmp: donde vive el punto perfecto */}
              {g >= 862 && (
                <line
                  x1={xv(VMP)} y1={yw(VMP * IMP)} x2={xv(VMP)}
                  y2={yw(VMP * IMP) + (AX_Y - yw(VMP * IMP)) * ez(g, 862, 916)}
                  stroke={rgba(V.volt, 0.42)} strokeWidth={3} strokeDasharray="10 9"
                />
              )}
              {/* la guia punteada de la bateria */}
              {g >= 1130 && (
                <line
                  x1={xv(VBAT)} y1={yw(VBAT * IMP)} x2={xv(VBAT)}
                  y2={yw(VBAT * IMP) + (AX_Y - yw(VBAT * IMP)) * ez(g, 1130, 1190)}
                  stroke={rgba(V.amber, 0.55)} strokeWidth={3} strokeDasharray="10 9"
                />
              )}

              {/* EL PUNTO — la materia que cruza la frontera 3→4: nace en el pico y se DESLIZA */}
              {dotOn && (
                <g>
                  <circle cx={dotX} cy={dotY} r={30 + 12 * Math.sin(g / 9)}
                    fill={rgba(slide > 0.5 ? V.orange : V.volt, 0.16)} />
                  <circle cx={dotX} cy={dotY} r={16 * dotPop}
                    fill={slide > 0.5 ? V.orange : V.volt}
                    stroke={rgba(V.white, 0.85)} strokeWidth={3}
                    style={{ filter: `drop-shadow(0 0 20px ${rgba(slide > 0.5 ? V.orange : V.volt, 0.9)})` }} />
                </g>
              )}
            </svg>
          )}

          {/* rotulos de estructura: la FORMA se lee sin leer nada, esto solo la ancla */}
          {g >= 742 && (
            <>
              <Tag x={(AX_R / 1920) * 100} y={(AX_Y + 46) / 1080 * 100} align="right"
                color={rgba(V.white, 0.60)} op={ez(g, 742, 780)}>TENSION DEL PANEL</Tag>
              <Tag x={(AX_L / 1920) * 100 - 1.4} y={(P_TOP - 6) / 1080 * 100} align="right"
                color={rgba(V.white, 0.60)} op={ez(g, 758, 796)}>POTENCIA</Tag>
            </>
          )}
          {g >= 906 && (
            <Tag x={(xv(VMP) / 1920) * 100} y={(AX_Y + 46) / 1080 * 100}
              color={V.volt} op={ez(g, 906, 944) * (1 - ez(g, 1760, 1810))}>17,1 V · VMP</Tag>
          )}
          {g >= 1176 && (
            <Tag x={(xv(VBAT) / 1920) * 100} y={(AX_Y + 46) / 1080 * 100}
              color={V.amber} op={ez(g, 1176, 1214) * (1 - ez(g, 1760, 1810))}>13,2 V · LA BATERIA</Tag>
          )}

          {/* ── LAS CIFRAS ── */}
          {/* 17,1: lo que dice la ETIQUETA (plata: el unico lugar donde no te pueden mentir) */}
          {g >= 470 && g < 690 && (
            <Readout value="17,1" unit="V" label="VMP · LO QUE DICE LA ETIQUETA" at={at(470)}
              x={71} y={25} size={152} color={V.silver} />
          )}
          {/* 89 W en el pico: lo MEDIDO, en verde, desde arriba */}
          {g >= 862 && g < 1120 && (
            <Readout value="89" unit="W" label="EN SU PUNTO PERFECTO" at={at(862)}
              x={79} y={16} size={140} color={V.volt} />
          )}
          {/* la tension que impone la bateria: entra desde abajo, en ambar */}
          {g >= 1128 && g < 1340 && (
            <Readout value="13,2" unit="V" label="A LO QUE LO OBLIGA EL PWM" at={at(1128)}
              x={46} y={57} size={126} color={V.amber} />
          )}
        </Plane>

        {/* P5 · EL MATERIAL REAL: las tarjetas protagonistas ─────────────────────────────────── */}
        <Plane z={40}>
          {/* ACTO 1 — la cajita de nueve dolares sobre el banco. Sale por PORTAL: la camara ENTRA
              por el borne de entrada (34 % / 43 % del cuadro). */}
          {a1On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity) * ez(g, 0, 12), transformOrigin: "34% 43%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_con1.mp4" kind="video"
                w={conW} h={conH} x={50} y={48} z={0}
                ry={lerp(8, 0.6, ez(g, 10, 260))} rx={lerp(-3, 0, ez(g, 10, 260))}
                radius={16} startFrom={5} lit={0.62 + 0.38 * ez(g, 0, 120)}
                litColor={cKey} label="EL CONTROLADOR QUE VINO DE REGALO" sheenAt={at(74)}
              />
              {/* el borne de entrada: el detalle por el que se entra (halo, no un vector-objeto) */}
              <div style={{
                position: "absolute", left: "34%", top: "43%", width: 190, height: 190,
                marginLeft: -95, marginTop: -95, borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(V.silver, 0.30 * ez(g, 244, 306))} 0%, rgba(0,0,0,0) 62%)`,
                boxShadow: `inset 0 0 60px ${rgba(V.silver, 0.22 * ez(g, 244, 306))}`,
              }} />
            </AbsoluteFill>
          )}

          {/* ACTO 2 — salimos DENTRO del borne y el plateado del tornillo ES el de la etiqueta */}
          {a2On && (
            <AbsoluteFill style={{
              transform: `scale(${a2Scale.toFixed(3)})`, transformOrigin: "38% 45%",
              opacity: 1 - ez(g, 690, 746),
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_con2.mp4" kind="video"
                w={etiqW} h={etiqH} x={50} y={etiqY} z={0}
                ry={lerp(-6, 0, ez(g, F_A2, 470))} radius={16} startFrom={7}
                lit={0.94} litColor={V.silver} label="ETIQUETA DEL DORSO DEL PANEL"
                sheenAt={at(392)}
              />
            </AbsoluteFill>
          )}

          {/* la etiqueta sigue en cuadro como CHIP mientras se lee su curva (continuidad de materia) */}
          {chipOp > 0.01 && (
            <div style={{ opacity: chipOp }}>
              <MediaCard
                src="img/cmetemu/cmet_mv_con2.jpg" kind="photo"
                w={330} h={186} x={13} y={14} z={0}
                ry={7} radius={12} lit={0.86} litColor={V.silver} sheenAt={at(660)}
              />
            </div>
          )}

          {/* ACTO 3 — el panel al sol: el dueno de la curva, material real, plano general */}
          {g >= 700 && g < 1010 && (
            <div style={{ opacity: ez(g, 700, 748) * (1 - ez(g, 968, 1006)) }}>
              <MediaCard
                src="img/cmetemu/cmet_h07.jpg" kind="photo"
                w={420} h={236} x={22} y={23} z={0}
                ry={-6} radius={14} lit={0.92} litColor={cKey}
                label="EL PANEL, AL SOL" sheenAt={at(736)}
              />
            </div>
          )}

          {/* ACTO 4 — el culpable en cuadro: la cajita PWM que ata el panel a la bateria */}
          {pwmCardOn && pwmCardOp > 0.01 && (
            <div style={{ opacity: pwmCardOp }}>
              <MediaCard
                src="img/cmetemu/cmet_mv_con1.jpg" kind="photo"
                w={396} h={223} x={80} y={77} z={0}
                ry={lerp(-9, -3, ez(g, 900, 1200))} radius={14} lit={0.9} litColor={V.orange}
                label="PWM · SIN TRANSFORMAR NADA" sheenAt={at(1104)}
              />
            </div>
          )}

          {/* ACTO 5 — EL MPPT ABIERTO: su bobina es el que hace el cambio.
              Sale por ESCALA: se encoge a 240 px y aterriza dentro de la foto del banco. */}
          {a5On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_con3.mp4" kind="video"
              w={mpW} h={mpH} x={mpX} y={mpY} z={0}
              ry={lerp(5, -4, ez(g, 1330, 1620))} radius={16} startFrom={9}
              lit={0.95} litColor={light(seg(g, 1340, 1720), "silver", "volt")}
              label={shrink > 0.45 ? undefined : "MPPT · LA BOBINA HACE EL CAMBIO"}
              sheenAt={at(1348)}
            />
          )}

          {/* ACTO 6 — LOS DOS CONTROLADORES: lo que era un chip se vuelve el DECORADO del banco */}
          {benchOn && (
            <div style={{ opacity: ez(g, 1596, 1650) }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_con4.mp4" kind="video"
                w={benchW} h={benchH} x={benchX} y={benchY} z={0}
                ry={lerp(8, 0.8, ez(g, SEAM_ESCALA, 1800))} radius={16} startFrom={4}
                lit={0.92} litColor={V.volt}
                label={shrink > 0.7 ? "NUEVE DOLARES CONTRA CINCUENTA" : undefined}
                sheenAt={at(1706)}
              />
            </div>
          )}
        </Plane>

        {/* P6 · LA TRANSACCION DEL MPPT: va DELANTE de la carcasa real (estructura sobre materia) */}
        <Plane z={110}>
          {coilOp > 0.01 && (
            <>
              {/* la bobina late: el corazon del cambio */}
              <div style={{
                position: "absolute", left: "50%", top: "52%", width: 320, height: 320,
                marginLeft: -160, marginTop: -160, borderRadius: "50%", opacity: coilOp,
                background: `radial-gradient(circle, ${rgba(V.volt, 0.20 + 0.16 * coil)} 0%, ${rgba(V.volt, 0.06)} 44%, rgba(0,0,0,0) 70%)`,
              }} />
              <svg viewBox="0 0 1920 1080" style={{
                position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                overflow: "visible", opacity: coilOp,
              }}>
                {/* los dos arcos se CRUZAN: los voltios bajan, los amperios suben. Eso es el trato. */}
                <path d="M 620 330 Q 960 300 1300 470" fill="none"
                  stroke={rgba(V.silver, 0.42)} strokeWidth={4} strokeDasharray="14 12" />
                <path d="M 620 640 Q 960 668 1300 424" fill="none"
                  stroke={rgba(V.volt, 0.42)} strokeWidth={4} strokeDasharray="14 12" />
                {tokOp > 0.01 && Array.from({ length: 6 }, (_, i) => {
                  const lane = i % 2;
                  const t = (((g - 1450 + i * 31) % 96) + 96) % 96 / 96;
                  const x = bez(620, 960, 1300, t);
                  const y = lane === 0 ? bez(330, 300, 470, t) : bez(640, 668, 424, t);
                  const c = lane === 0 ? V.silver : V.volt;
                  const s = 9 + 5 * Math.sin(t * Math.PI);
                  return (
                    <circle key={i} cx={x} cy={y} r={s} fill={c} opacity={tokOp * (0.35 + 0.65 * Math.sin(t * Math.PI))}
                      style={{ filter: `drop-shadow(0 0 14px ${rgba(c, 0.9)})` }} />
                  );
                })}
              </svg>
              <Gate x={27} y={34} titulo="ENTRA DEL PANEL" volt="17,1" amp="5,2" watt="89"
                color={V.silver} op={coilOp * ez(g, 1400, 1452)} />
              <Gate x={73} y={34} titulo="SALE A LA BATERIA" volt={fmt(vOut, 1)} amp={fmt(aOut, 2)}
                watt={fmt(wOut, 1)} color={V.amber} op={coilOp * ez(g, 1452, 1504)} />
              <Tag x={50} y={72} color={V.volt} size={38}
                op={coilOp * ez(g, 1560, 1614)}>ENTREGA VOLTIOS · RECIBE AMPERIOS</Tag>
            </>
          )}

          {/* ── ACTO 6 · LAS DOS CIFRAS ENFRENTADAS (el campo firma del video) ──
              Cada `PromiseGap` va en su propia <Sequence> SOLO para que su reloj interno arranque
              donde entra la barra (asi crece en vez de aparecer llena). No es una Sequence por acto:
              la atmosfera, la camara y las tarjetas siguen corriendo con el reloj del movimiento. */}
          <Sequence from={at(1672)} layout="none">
            <PromiseGap promise={89} measured={68.6} unit="W" x={28} y={48} w={420} h={250}
              slats={18} label="PWM · EL DE LA CAJA" />
          </Sequence>
          <Sequence from={at(1742)} layout="none">
            <PromiseGap promise={89} measured={85.2} unit="W" x={69} y={48} w={420} h={250}
              slats={18} label="MPPT · EL DE VERDAD" />
          </Sequence>
        </Plane>

        {/* P7 · ICONOS PNG como objetos de la escena (suman capa, nunca reemplazan material real) */}
        <Plane z={150}>
          {iconOp > 0.01 && (
            <>
              <IconPng src="img/cmetemu/cmet_ic_panel.png" x={13} y={20} size={116} opacity={iconOp} glow={V.ink0} />
              <IconPng src="img/cmetemu/cmet_ic_bateria.png" x={87} y={20} size={104} opacity={iconOp} glow={V.ink0} />
              {/* la linea que los une PASA por la cajita: esa es la idea entera del acto */}
              <div style={{
                position: "absolute", left: "14%", top: "24%", width: `${(72 * lineaOn).toFixed(2)}%`,
                height: 4, borderRadius: 2, opacity: iconOp,
                background: `linear-gradient(90deg, ${rgba(V.volt, 0.15)} 0%, ${rgba(V.volt, 0.85)} 22%, ${rgba(V.amber, 0.85)} 78%, ${rgba(V.amber, 0.15)} 100%)`,
                boxShadow: `0 0 20px ${rgba(V.volt, 0.45)}`,
              }} />
            </>
          )}
          {g >= 1770 && (
            <IconPng src="img/cmetemu/cmet_ic_pinza.png" x={50} y={20} size={96}
              opacity={ez(g, 1770, 1824)} glow={V.ink0} />
          )}
        </Plane>

        {/* P8 · primer plano: polvo del garaje en el haz (HOLD VIVO, nada quieto mas de 1,5 s) */}
        <Plane z={240}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.42 + rnd(i * 4.7) * 1.15;
            const yy = ((rnd(i * 8.3) * 130 - (g * sp) / 21) % 130 + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.6;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(6 + rnd(i * 6.1) * 88).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, (0.10 + rnd(i * 3.7) * 0.22) * clamp01(hzP)),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.20 * clamp01(hzP))}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo · ⛔ ninguna es un fade) ── */}
      {/* f1316 · OCLUSION: LA ETIQUETA PLATEADA cruza el cuadro y detras ya esta el MPPT abierto */}
      <SeamOcclude at={at(SEAM_OCC)} dur={16} color={V.silver} angle={10} />
      {/* eventos de luz (no son costuras): el punto aterriza en 13,2 · el MPPT cierra el trato */}
      <SeamFlash at={at(1206)} color={V.orange} dur={6} />
      <SeamFlash at={at(1600)} color={V.volt} dur={6} />

      {/* ── TIPOGRAFIA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={46} outF={288} kick="EL REGALO DE LA CAJA" head="LA CAJITA DEL REGALO"
          sub="Va entre tu panel y tu bateria, y decide todo." kickColor={V.orange} />
        <Titular g={g} inF={386} outF={606} kick="LA ETIQUETA · VMP" head="DIECISIETE COMA UNO"
          sub="A esa tension el panel entrega su maximo." kickColor={V.silver} />
        <Titular g={g} inF={700} outF={944} kick="17,1 V x 5,2 A" head="SU PUNTO PERFECTO"
          sub="Ahi, y solo ahi, da sus 89 vatios." />
        <Titular g={g} inF={1090} outF={1298} kick="PWM · SIN TRANSFORMAR NADA"
          head="LO ARRASTRA A TRECE COMA DOS" size={62}
          sub="Esos vatios no se pierden en el cable: no se generan." kickColor={V.orange} />
        <Titular g={g} inF={1404} outF={1636} kick="MPPT" head="CAMBIA VOLTIOS POR AMPERIOS" size={64}
          sub="Baja la tension, sube la corriente, y casi todo llega." />
        <Titular g={g} inF={1700} outF={1874} kick="EL MISMO PANEL, LA MISMA MANANA"
          head="68,6 CONTRA 85,2" sub="La cajita de nueve dolares se queda con un cuarto." />

        {/* el area que no se genera: el remate del acto 4, pegado a su propia figura */}
        {g >= 1236 && (
          <div style={{
            position: "absolute", left: "64%", top: "8%", width: 430,
            opacity: ez(g, 1236, 1284) * (1 - ez(g, 1300, 1318)),
          }}>
            <Bed pad={22}>
              <Kick color={V.orange}>NO SE PIERDEN</Kick>
              <div style={{
                marginTop: 6, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 0.92,
                color: V.orange, textShadow: `0 0 38px ${rgba(V.orange, 0.36)}, 0 6px 26px rgba(0,0,0,0.92)`,
              }}>20,4 <span style={{ fontSize: 40 }}>W</span></div>
              <div style={{ marginTop: 8 }}><Body size={31}>Nunca se generan.</Body></div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
