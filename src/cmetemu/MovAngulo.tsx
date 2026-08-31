// MovAngulo.tsx — S5 · UN MOVIMIENTO CONTINUO de 62 s (1860 frames @30fps)
// «Sesenta y nueve por apurado, ochenta y nueve por levantarlo. El ladrón era el ángulo.»
//
// ES EL GIRO EMOCIONAL DEL VIDEO: el panel resulta HONESTO y el ladrón de los veinte vatios era el
// ángulo. Por eso entre la primera cifra y la segunda NO cambia el material (mismo panel, mismo sol,
// misma pinza): cambia LA LUZ (el sol pasa de lateral-alto a estar DE FRENTE, y la sombra del propio
// marco se apaga) y cambia LA ESCALA (el campo firma ocupa el cuadro y al final las dos cifras caben
// en un renglón del cuaderno).
//
// UNA sola atmósfera montada arriba de todo (nunca se remonta), UNA sola cámara `gcam(g, …)` que
// jamás vuelve a cero, la luz evoluciona volt → white → volt sin saltar, y hay MATERIA que cruza
// cada una de las cinco fronteras.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER cám z≈+40, rx −6,5° RASANTE (hereda el vector de `MovEtiqueta` y lo sigue) ·
//                      luz volt con el calor todavía en el aire (la lectura del termómetro se apaga
//                      en 4 s) · materia: LA SUPERFICIE CALIENTE DEL PANEL, rasante.
//                EXIT  cám z≈+95 empujando al 68 %/62 % del cuadro · luz volt→white (mediodía duro) ·
//                      materia: LA MORDAZA DE LA PINZA sobre el cable positivo (entramos DENTRO).
//
// acto 2 · f335  ENTER cám z≈+130 saliendo del interior de la mordaza (escala 2,9 → 1) · luz white
//                      plena desde arriba-izquierda · materia: EL CABLE ROJO dentro de la mordaza.
//                EXIT  cám z≈+10, pan +62 · luz white con el volt del display encendido · materia:
//                      EL RECTÁNGULO VERDE DEL DISPLAY (se estira y sobrevive la frontera).
//
// acto 3 · f670  ENTER cám z≈+10, pan +62 · luz white/volt · materia: EL DISPLAY VERDE, que se
//                      desdobla en el campo `PromiseGap` y queda como su línea de piso.
//                EXIT  cám z≈+84, pan +62, py +52 · luz white apagándose por abajo · materia: EL
//                      BORDE DEL PANEL levantándose (hormigón) que barre el 100 % del cuadro.
//
// acto 4 · f967  ENTER cám z≈+84 (misma inercia, el pan sigue de largo) · luz white con el sol
//                      subiendo a la derecha · materia: EL PANEL, ahora en las manos, girando.
//                EXIT  cám z≈+230, ry −14° girando CON el panel · luz sol de frente, volt entrando ·
//                      materia: EL PANEL girado, que queda de canto y se va al fondo.
//
// acto 5 · f1302 ENTER cám z≈+230, ry −14° todavía girando (la INERCIA no frena en la frontera) ·
//                      luz sol de frente, volt · materia: EL PANEL de canto + LA PINZA que vuelve
//                      al primer plano.
//                EXIT  cám z≈−10, rx subiendo · luz volt · materia: LAS DOS CIFRAS, que se juntan
//                      y se achican hasta caber en el renglón del cuaderno.
//
// acto 6 · f1637 ENTER cám z≈−10, rx +9,5° YA MIRANDO DESDE ARRIBA · luz volt cenital · materia: LA
//                      HOJA DEL CUADERNO, que venía siendo una miniatura sobre el banco.
//                EXIT  cám cenital asentada sobre el banco, rx +9,5°, luz volt · materia: LA HOJA
//                      DEL CUADERNO con las dos cifras a mano y las primeras columnas dibujadas
//                      → así arranca `MovTreintaDias`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f316  frontera 1→2 : PORTAL / ZOOM-THROUGH sobre la mordaza de la pinza (fx 68 / fy 62, dur 24).
//                      La ficha lo pide: la cámara ENTRA en la mordaza y sale en el macro del cable.
// f648  frontera 2→3 : MORFO — el rectángulo verde del display se desdobla en el campo `PromiseGap`
//                      (y el mismo rectángulo queda de línea de piso del campo). Sin un solo fade.
// f958  frontera 3→4 : OCLUSIÓN con `V.concrete` (dur 18) — el borde del panel al levantarse barre
//                      el 100 % del cuadro; detrás ya están las manos inclinándolo.
// f1286 frontera 4→5 : INERCIA — la cámara sigue el giro del panel (ry 0 → −14° entre 1260 y 1352)
//                      y el decorado cambia detrás en pleno barrido; el panel sobrevive de canto.
// f1626 frontera 5→6 : ESCALA — las dos cifras se juntan y se achican, y la tarjeta del cuaderno
//                      (que era una miniatura sobre el banco) crece hasta ser el decorado entero.
// (ninguna se repite, ninguna es un fade, ninguna es un blur de entrada)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros de los seis actos
const F_A2 = 335;
const F_A3 = 670;
const F_A4 = 967;
const F_A5 = 1302;
const F_A6 = 1637;
const ACT_START = [0, 0, F_A2, F_A3, F_A4, F_A5, F_A6];

// las cinco costuras
const SEAM_PORTAL = 316;
const SEAM_MORFO = 648;
const SEAM_OCC = 958;
const SEAM_INERCIA = 1286;
const SEAM_ESCALA = 1626;

// geometría del campo firma del acto 3 y del display del que sale (para el MORFO)
const G3_X = 40, G3_Y = 47, G3_W = 680, G3_H = 330;
const D_X = 43, D_Y = 45, D_W = 292, D_H = 30;
// geometría del campo firma del acto 5
const G5_X = 36, G5_Y = 44, G5_W = 640, G5_H = 340;

// ── EL SOL — el antagonista real del movimiento (nunca es material, siempre es luz) ──────────
const Sol: React.FC<{ x: number; y: number; power: number; color: string; g: number }> = ({
  x, y, power, color, g,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 1180, height: 1180, marginLeft: -590, marginTop: -590, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.46 * power)} 0%, ${rgba(color, 0.15 * power)} 24%, rgba(0,0,0,0) 60%)`,
      mixBlendMode: "screen",
    }} />
    {Array.from({ length: 10 }, (_, i) => {
      const ang = i * 36 + g / 26 + Math.sin(g / 71 + i) * 2.4;
      const len = 620 + rnd(i * 3.9) * 420;
      return (
        <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
          width: len, height: 10 + rnd(i * 7.1) * 16, marginTop: -8,
          transformOrigin: "0% 50%", transform: `rotate(${ang.toFixed(2)}deg)`,
          background: `linear-gradient(90deg, ${rgba(color, 0.26 * power)} 0%, rgba(0,0,0,0) 78%)`,
          mixBlendMode: "screen",
        }} />
      );
    })}
  </AbsoluteFill>
);

// ── EL CALOR — lo que heredamos de `MovEtiqueta` (el termómetro sobre la superficie caliente) ──
const Calor: React.FC<{ power: number; g: number }> = ({ power, g }) => {
  if (power <= 0.012) return null;
  return (
    <AbsoluteFill style={{ opacity: 0.62 * power, mixBlendMode: "screen", pointerEvents: "none" }}>
      {Array.from({ length: 8 }, (_, i) => {
        const yy = 28 + i * 8.4;
        const dx = Math.sin(g / 13 + i * 1.7) * 30;
        return (
          <div key={i} style={{
            position: "absolute", left: "-9%", top: `${yy.toFixed(2)}%`, width: "118%", height: 24,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.amber, 0.13)} 38%, ${rgba(V.orange, 0.07)} 62%, rgba(0,0,0,0) 100%)`,
            transform: `translateX(${dx.toFixed(2)}px) skewX(${(Math.sin(g / 17 + i) * 3.4).toFixed(2)}deg)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── TITULAR (una sola idea de texto por acto, sobre cama oscura, safe area 62 px) ────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 66, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 24)) * 28;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 150, maxWidth: 1040,
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

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovAngulo: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si `gFrame` llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : ACT_START[Math.min(Math.max(acto, 1), 6)];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: 40, z1: 300, panX: -74, panY: -58, ry: -7, rx: 2.2, dur: 1720 });
  const zAcc =
    eio(0, 92, seg(g, 292, 348)) +            // el empuje del PORTAL
    eio(0, -118, seg(g, SEAM_MORFO, 766)) +   // el retroceso al abrirse el campo firma
    eio(0, 74, seg(g, 950, 1016)) +           // el empuje bajo la OCLUSIÓN
    eio(0, 154, seg(g, 1258, 1362)) +         // la INERCIA del giro
    eio(0, -196, seg(g, 1386, 1566)) +        // asentarse de frente al sol
    eio(0, -248, seg(g, 1616, 1792));         // la ESCALA: el cuaderno se vuelve el decorado
  const pxAcc =
    eio(0, 62, seg(g, SEAM_MORFO, 790)) +
    eio(0, -96, seg(g, 1284, 1430)) +
    eio(0, 44, seg(g, 1640, 1808));
  const pyAcc =
    eio(0, -42, seg(g, 296, 402)) +
    eio(0, 52, seg(g, 952, 1084)) +
    eio(0, -64, seg(g, 1618, 1826));
  // rx: entra RASANTE (heredado de MovEtiqueta) y termina CENITAL (lo que espera MovTreintaDias)
  const rxAcc = lerp(-6.5, 0, ez(g, 0, 196)) + eio(0, 9.5, seg(g, 1596, 1836));
  // ry: el barrido de la INERCIA — la cámara gira CON el panel y sigue de largo hasta asentarse
  const ryAcc = eio(0, -14, seg(g, 1260, 1352)) + eio(0, 9, seg(g, 1356, 1534));
  const cam =
    `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px) ` +
    `rotateX(${rxAcc.toFixed(3)}deg) rotateY(${ryAcc.toFixed(3)}deg)`;

  // ── LA LUZ: evoluciona, no salta. volt (heredada, el panel caliente) → white (mediodía duro) →
  //    volt otra vez (el cierre sobre el cuaderno, que es lo que MovTreintaDias espera) ────────
  const cKey = g < 900
    ? light(seg(g, 30, 640), "volt", "white")
    : light(seg(g, 900, 1540), "white", "volt");
  const cWarm = g < 1010
    ? light(seg(g, 180, 700), "amber", "orange")
    : light(seg(g, 1010, 1520), "orange", "amber");
  const keyFrom = 0.24 + eio(0, 0.34, seg(g, 0, 540)) + eio(0, -0.26, seg(g, 1240, 1620))
    + eio(0, 0.16, seg(g, 1656, 1860));
  const intensity = 0.76 + eio(0, 0.22, seg(g, 0, 110)) + eio(0, -0.12, seg(g, 900, 1120))
    + eio(0, 0.18, seg(g, 1300, 1560)) + eio(0, -0.10, seg(g, 1700, 1860));

  // el sol: arranca lateral-alto (por eso la sombra del marco EXISTE) y termina DE FRENTE
  const solX = 13 + eio(0, 24, seg(g, 900, 1200)) + eio(0, 13, seg(g, 1272, 1466));
  const solY = 12 + Math.sin(g / 143) * 1.2 + eio(0, -3, seg(g, 1272, 1500));
  const solP = 0.46 + eio(0, 0.22, seg(g, 50, 300)) + eio(0, 0.46, seg(g, 1272, 1476))
    + eio(0, -0.78, seg(g, 1594, 1764));

  // el calor heredado de MovEtiqueta: está en el cuadro y se disipa en los primeros 4 s
  const calorP = 1 - ez(g, 26, 132);

  // ── ACTO 1 · el panel plano sobre el pasto, la sombra corta ────────────────────────────────
  const zt = zoomThrough(g, SEAM_PORTAL, 24, 68, 62);
  const a1On = g < SEAM_PORTAL + 26;
  const p1W = Math.round(lerp(1580, 1210, ez(g, 0, 262)));
  const p1H = Math.round(p1W * 0.5625);
  const p1Rx = lerp(-14, -1.5, ez(g, 0, 232));
  const p1Op = clamp01(ez(g, 0, 10));
  // la pinza aparece al final del acto 1: ES el detalle en el que la cámara va a ENTRAR
  const pnz1On = g >= 236 && g < SEAM_PORTAL + 26;
  const pnz1W = Math.round(lerp(240, 336, ez(g, 236, 312)));

  // ── ACTO 2 · salimos DENTRO de la mordaza: el cable rojo y la cifra de la pinza ────────────
  const a2Scale = lerp(2.9, 1, ez(g, F_A2, 404));
  // la misma pinza se retira a TESTIGO cuando nace el campo firma (sobrevive al acto 3)
  // arranca en 334, no en 316: para cuando el macro revienta hacia afuera, la capa del acto 1 ya
  // está en opacidad 0,33 y cayendo (si no, el PORTAL se lee como un corte tapado)
  const pnz2On = g >= 334 && g < 966;
  const pnzM = ez(g, 664, 776);
  const pnz2W = Math.round(lerp(1180, 336, pnzM));
  const pnz2X = lerp(50, 84, pnzM);
  const pnz2Y = lerp(47, 24, pnzM);
  // el DISPLAY: el rectángulo verde que en f648 se desdobla en el campo firma
  // 966 = el instante de cobertura TOTAL de la oclusión (958 + dur/2): todo lo del acto 3 muere ahí
  const dispOn = g >= 424 && g < 966;
  const dispM = ez(g, SEAM_MORFO, 742);
  const dispW = Math.round(lerp(D_W, G3_W, dispM));
  const dispH = Math.round(lerp(D_H, 3, dispM));
  const dispX = lerp(D_X, G3_X, dispM);
  const dispY = lerp(D_Y, G3_Y + ((G3_H / 2) / 1080) * 100, dispM);

  // ── ACTO 3 · el campo firma 100 / 68,9 sobre el panel tirado en el pasto ───────────────────
  const gapOn = g >= SEAM_MORFO && g < 966;
  const gapSX = lerp(D_W / G3_W, 1, dispM);
  const gapSY = lerp(D_H / G3_H, 1, dispM);
  const gapDX = lerp(((D_X - G3_X) / 100) * 1920, 0, dispM);
  const gapDY = lerp(((D_Y - G3_Y) / 100) * 1080, 0, dispM);
  // el panel vuelve como CAMA del campo (la ficha: el campo va sobre el panel tirado en el pasto)
  const camaOn = g >= 660 && g < 966;
  const camaW = Math.round(lerp(1180, 1330, ez(g, 660, 950)));

  // ── ACTO 4 · las manos inclinando el panel hasta que la sombra del marco desaparece ────────
  const a4On = g >= 966 && g < 1702;
  const a4M = ez(g, 1272, 1420);                       // el panel gira y se va al fondo (INERCIA)
  const p4W = Math.round(lerp(lerp(1460, 1330, ez(g, 962, 1240)), 940, a4M));
  const p4H = Math.round(p4W * 0.5625);
  const p4X = lerp(50, 37, a4M);
  const p4Y = lerp(46, 42, a4M);
  const p4Ry = lerp(lerp(-4, 2, ez(g, 962, 1240)), 21, a4M);
  // la sombra del propio marco: existe, se acorta y desaparece cuando el panel llega a 30°
  const sombraOn = g >= 1004 && g < 1330;
  const sombraW = Math.round(lerp(560, 6, ez(g, 1152, 1292)));
  const angOn = g >= 1120 && g < 1352;
  const angDeg = 30 * ez(g, 1146, 1290);
  const angRad = (angDeg * Math.PI) / 180;

  // ── ACTO 5 · el campo firma 100 / 88,9 con la pinza en primer plano ────────────────────────
  const rise = ez(g, 1398, 1512);
  const meas5 = lerp(68.9, 88.9, rise);
  const g5On = g >= 1316 && g < 1670;
  // el campo se despliega desde el piso... y se PLIEGA de vuelta al piso cuando llega el cuaderno.
  // ⛔ desaparecer de golpe no es opción: el plano grafico va DELANTE del cuaderno, se veria el pop.
  const g5SY = lerp(0.06, 1, ez(g, 1316, 1394)) * (1 - 0.94 * ez(g, 1598, 1662));
  const g5SX = lerp(0.84, 1, ez(g, 1316, 1394));
  // la pinza no se apaga: se va de cuadro por abajo a la derecha, que es donde la deja la camara
  const pnz5Out = ez(g, 1614, 1692);
  const pnz5On = g >= 1322 && g < 1694;
  const pnz5W = Math.round(lerp(430, 580, ez(g, 1322, 1470)));
  const pnz5H = Math.round(pnz5W * 0.5625);
  const pnz5X = lerp(72, 124, pnz5Out);
  const pnz5Y = lerp(70, 86, pnz5Out);

  // ── LAS DOS CIFRAS — un solo elemento que nace en el display, cruza cuatro fronteras, se parte
  //    en dos cuando empieza a subir y se junta otra vez en la hoja del cuaderno ──────────────
  const mA = ez(g, SEAM_ESCALA, 1748);                 // el aterrizaje sobre el papel
  // (las x/y están calculadas sobre el plano gráfico YA escalado por la perspectiva: safe area 62 px)
  const aX = lerp(lerp(lerp(lerp(74, 76, ez(g, 660, 762)), 84, ez(g, 962, 1030)), 70, ez(g, 1312, 1404)), 63, mA);
  const aY = lerp(lerp(lerp(lerp(20, 52, ez(g, 660, 762)), 16, ez(g, 962, 1030)), 40, ez(g, 1312, 1404)), 41, mA);
  const aS = Math.round(lerp(lerp(lerp(lerp(132, 150, ez(g, 660, 762)), 78, ez(g, 962, 1030)), 152, ez(g, 1312, 1404)), 66, mA));
  const aColor = light(mA, "volt", "ink2");
  const aVal = (Math.round(meas5 * 10) / 10).toFixed(1).replace(".", ",");
  // la cifra de AYER, que se desprende de la de hoy justo cuando la de hoy empieza a subir
  const bOn = g >= 1392;
  const bX = lerp(lerp(70, 30, ez(g, 1402, 1492)), 37, mA);
  const bY = lerp(lerp(40, 63, ez(g, 1402, 1492)), 41, mA);
  const bS = Math.round(lerp(lerp(152, 96, ez(g, 1402, 1492)), 60, mA));
  const bColor = light(mA, "volt", "ink2");
  const bOp = lerp(0.58, 1, mA);
  // la cifra que PROMETE la caja: naranja, siempre más arriba — y se VA DE CUADRO por arriba antes
  // de que llegue el cuaderno: lo que promete la caja no se anota. En la hoja quedan sólo las dos
  // cifras que midió la pinza.
  const pOut = ez(g, 1596, 1668);
  const promOn = g >= 700 && g < 1676;
  const pX = lerp(lerp(lerp(74, 61, ez(g, 962, 1034)), 70, ez(g, 1312, 1404)), 74, pOut);
  const pY = lerp(lerp(lerp(27, 14, ez(g, 962, 1034)), 22, ez(g, 1312, 1404)), -16, pOut);
  const pS = Math.round(lerp(lerp(lerp(112, 68, ez(g, 962, 1034)), 112, ez(g, 1312, 1404)), 92, pOut));

  // ── ACTO 6 · ESCALA: la miniatura del cuaderno crece hasta ser el decorado ─────────────────
  // la miniatura aparece recién a 1600, abajo a la izquierda (sobre el banco): antes le pisaba el
  // primer plano a la pinza del acto 5, que es la protagonista de ese acto
  const nbOn = g >= 1600;
  const nbGrow = ez(g, SEAM_ESCALA, 1706);
  const nbSettle = ez(g, 1712, 1812);
  const nbW = Math.round(lerp(lerp(360, 2120, nbGrow), 1760, nbSettle));
  const nbH = Math.round(nbW * 0.5625);
  const nbX = lerp(30, 50, ez(g, SEAM_ESCALA, 1692));
  const nbY = lerp(64, 50, ez(g, SEAM_ESCALA, 1692));
  const nbRy = lerp(-9, 0, ez(g, SEAM_ESCALA, 1700));

  // el FONDO cambia SÓLO donde una costura lo tapa: la oclusión (f958), el barrido de la inercia
  // (f1310) y el cuaderno a sangre (f1694). Nunca hay un cambio de fondo a la vista.
  const bgSrc = g < 966
    ? "img/cmetemu/cmet_mv_ang1.jpg"
    : g < 1310
      ? "img/cmetemu/cmet_mv_ang3.jpg"
      : g < 1694
        ? "img/cmetemu/cmet_mv_ang2.jpg"
        : "img/cmetemu/cmet_mv_ang4.jpg";
  const bgDim = 0.52 + 0.16 * ez(g, 300, 700) - 0.12 * ez(g, 1300, 1520) - 0.18 * ez(g, 1694, 1804);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={0.52} />

      <Layers cam={cam}>
        {/* P1 · el patio, plano profundo: siempre hay imagen real detrás de todo */}
        <PhotoPlane src={bgSrc} kind="photo" z={-620} scale={1.3} dim={clamp01(bgDim)} tint={cKey} />

        {/* P2 · EL SOL: el antagonista. Lateral con el panel plano, de frente cuando lo levanta. */}
        <Plane z={-420}>
          <Sol x={solX} y={solY} power={clamp01(solP)} color={cKey} g={g} />
          <Calor power={calorP} g={g} />
        </Plane>

        {/* P3 · el suelo: la losa del patio corriendo al pasto, con su sombra de contacto */}
        <Plane z={-250}>
          <PadPlane y={77} w={1500} h={330} rx={62} lit={0.86 - 0.3 * ez(g, 1600, 1820)} z={-40} />
          <div style={{
            position: "absolute", left: 0, right: 0, top: "70%", height: 200,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.grass, 0.22)} 46%, ${rgba(V.ink0, 0.5)} 100%)`,
            opacity: 1 - ez(g, 1590, 1780),
          }} />
          {/* LA SOMBRA CORTA del panel apoyado: la prueba de que el sol le pega de costado */}
          {g < 332 && (
            <div style={{
              position: "absolute", left: "50%", top: "66%", width: 420, height: 62, marginLeft: -180,
              borderRadius: "50%", opacity: 0.8 * (1 - ez(g, 282, 328)),
              background: `radial-gradient(ellipse, ${rgba(V.ink0, 0.78)} 0%, rgba(0,0,0,0) 72%)`,
              transform: "skewX(-22deg)",
            }} />
          )}
        </Plane>

        {/* P4 · GRÁFICO: el display que se desdobla, los dos campos firma, el ángulo, las cifras.
            ⛔ va DELANTE del material (z 90 > 40): el display tiene que verse SOBRE la tarjeta de la
            pinza y las cifras SOBRE la hoja del cuaderno, no detrás. Sólo la pinza del acto 5
            (z 180) se le pone adelante, que es exactamente lo que pide la ficha. */}
        <Plane z={90}>
          {/* ⭐ MORFO — este rectángulo ES el display verde de la pinza y ES la línea de piso del campo */}
          {dispOn && (
            <div style={{
              position: "absolute", left: `${dispX.toFixed(2)}%`, top: `${dispY.toFixed(2)}%`,
              width: dispW, height: dispH, marginLeft: -dispW / 2, marginTop: -dispH / 2,
              borderRadius: Math.round(lerp(7, 2, dispM)),
              background: `linear-gradient(90deg, ${rgba(V.volt, 0.12)} 0%, ${rgba(V.volt, 0.94)} 20%, ${rgba(V.volt, 0.94)} 80%, ${rgba(V.volt, 0.12)} 100%)`,
              boxShadow: `0 0 ${Math.round(lerp(34, 16, dispM))}px ${rgba(V.volt, 0.6)}`,
            }} />
          )}

          {/* EL CAMPO FIRMA · acto 3 — cien prometidos contra sesenta y ocho coma nueve medidos */}
          {gapOn && (
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              transformOrigin: `${G3_X}% ${G3_Y}%`,
              transform: `translate(${gapDX.toFixed(2)}px, ${gapDY.toFixed(2)}px) scale(${gapSX.toFixed(4)}, ${gapSY.toFixed(4)})`,
            }}>
              <PromiseGap promise={100} measured={68.9} unit="W" slats={24}
                x={G3_X} y={G3_Y} w={G3_W} h={G3_H} nums={false} />
            </div>
          )}

          {/* EL CAMPO FIRMA · acto 5 — el mismo panel, veinte vatios más arriba */}
          {g5On && (
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              transformOrigin: `${G5_X}% ${(G5_Y + ((G5_H / 2) / 1080) * 100).toFixed(2)}%`,
              transform: `scale(${g5SX.toFixed(4)}, ${g5SY.toFixed(4)})`,
            }}>
              <PromiseGap promise={100} measured={meas5} unit="W" slats={24}
                x={G5_X} y={G5_Y} w={G5_W} h={G5_H} nums={false} />
            </div>
          )}

          {/* LA RESEÑA DE UNA ESTRELLA: lo que hace el 90 % de la gente en el fondo del bajón */}
          {g >= 792 && g < 962 && (
            <div style={{
              position: "absolute", left: "72%", top: "71%", transform: "translate(-50%,-50%)",
              display: "flex", gap: 12, opacity: ez(g, 792, 826) * (1 - ez(g, 930, 958)),
            }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  fontFamily: F_DISPLAY, fontSize: 54, lineHeight: 1,
                  color: i === 0 ? V.orange : rgba(V.white, 0.15),
                  textShadow: "0 4px 20px rgba(0,0,0,0.92)",
                  transform: `translateY(${(Math.sin(g / 21 + i) * 3).toFixed(2)}px)`,
                }}>★</div>
              ))}
            </div>
          )}

          {/* EL ÁNGULO: la estructura gráfica del acto 4 — el suelo, el panel girando, los 30° */}
          {angOn && (
            <svg viewBox="0 0 1920 1080" style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
              opacity: ez(g, 1120, 1156) * (1 - ez(g, 1320, 1350)),
            }}>
              {/* el vértice va a la DERECHA del cuadro: el titular vive abajo-izquierda */}
              <path d="M 1180 880 L 1740 880" fill="none" stroke={rgba(V.white, 0.24)} strokeWidth={3} />
              <path
                d={`M 1180 880 L ${(1180 + 440 * Math.cos(angRad)).toFixed(1)} ${(880 - 440 * Math.sin(angRad)).toFixed(1)}`}
                fill="none" stroke={V.volt} strokeWidth={6} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 14px ${rgba(V.volt, 0.75)})` }}
              />
              <path
                d={`M 1320 880 A 140 140 0 0 0 ${(1180 + 140 * Math.cos(angRad)).toFixed(1)} ${(880 - 140 * Math.sin(angRad)).toFixed(1)}`}
                fill="none" stroke={rgba(V.volt, 0.6)} strokeWidth={3} strokeDasharray="9 8"
              />
            </svg>
          )}
          {g >= 1264 && g < 1342 && (
            <Readout value="30" unit="°" at={at(1266)} x={72} y={70} size={92} color={V.volt} />
          )}

          {/* ── LAS CIFRAS · ninguna sobre fondo plano: todas viven sobre el material real ── */}
          {/* 4,1 A — lo primero que marca la pinza */}
          {g >= 372 && g < 664 && (
            <Readout value="4,1" unit="A" label="PINZA · CORRIENTE CONTINUA" at={at(374)}
              x={lerp(50, 26, ez(g, 470, 548))} y={lerp(25, 20, ez(g, 470, 548))}
              size={Math.round(lerp(178, 108, ez(g, 470, 548)))} color={V.volt} />
          )}
          {/* 16,8 V — la tensión con la batería cargando */}
          {g >= 492 && g < 664 && (
            <Readout value="16,8" unit="V" label="EN BORNES" at={at(494)}
              x={49} y={20} size={108} color={V.volt} />
          )}
          {/* LO QUE DICE LA CAJA — naranja, siempre más arriba, siempre de más */}
          {promOn && (
            <Readout value="100" unit="W" label="LO QUE DICE LA CAJA" at={at(702)}
              x={pX} y={pY} size={pS} color={V.orange} />
          )}
          {/* LA CIFRA MEDIDA — nace en el display, cruza cuatro fronteras y aterriza en el papel */}
          {g >= 556 && (
            <Readout value={aVal} unit="W" label={mA > 0.45 ? undefined : "LO QUE MARCA LA PINZA"}
              at={at(558)} x={aX} y={aY} size={aS} color={aColor} />
          )}
          {/* LA CIFRA DE AYER — se desprende de la de hoy en el instante en que la de hoy sube */}
          {bOn && (
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: bOp }}>
              <Readout value="68,9" unit="W" label={mA > 0.45 ? undefined : "AYER"} at={at(1394)}
                x={bX} y={bY} size={bS} color={bColor} />
            </div>
          )}
          {/* el tachón a mano sobre la cifra de ayer, ya escrito en la hoja del cuaderno */}
          {g >= 1782 && (
            <div style={{
              position: "absolute", left: `${bX.toFixed(2)}%`, top: `${bY.toFixed(2)}%`,
              width: 250 * ez(g, 1782, 1828), height: 5, marginTop: -2,
              transform: "translateX(-50%) rotate(-7deg)", transformOrigin: "50% 50%",
              background: rgba(V.ink2, 0.86), borderRadius: 3,
            }} />
          )}
          {/* LAS PRIMERAS COLUMNAS DEL CUADERNO: el handoff literal a `MovTreintaDias` */}
          {g >= 1798 && (
            <div style={{
              position: "absolute", left: "50%", top: "68%", width: 1180, marginLeft: -590,
              display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 120,
            }}>
              {Array.from({ length: 30 }, (_, i) => {
                const a = clamp01((ez(g, 1798, 1858) * 34 - i) / 3);
                return (
                  <div key={i} style={{
                    width: 5, height: Math.round((26 + rnd(i * 4.3) * 74) * a),
                    background: rgba(V.ink2, 0.52 + 0.28 * rnd(i * 8.1)), borderRadius: 2,
                  }} />
                );
              })}
            </div>
          )}
        </Plane>

        {/* P5 · EL MATERIAL REAL: la tarjeta protagonista de cada acto ── */}
        <Plane z={40}>
          {/* ACTO 1 — el panel plano sobre el pasto. Sale por PORTAL entrando en la mordaza. */}
          {a1On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity) * p1Op, transformOrigin: "68% 62%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_ang1.mp4" kind="video"
                w={p1W} h={p1H} x={50} y={44} z={0}
                ry={lerp(7, 0.5, ez(g, 0, 240))} rx={p1Rx}
                radius={16} startFrom={5} lit={0.62 + 0.38 * ez(g, 10, 150)}
                litColor={cKey} label="DÍA UNO · PLANO SOBRE EL PASTO" sheenAt={at(88)}
              />
              {/* el detalle en el que la cámara ENTRA: la mordaza sobre el cable positivo */}
              {pnz1On && (
                <MediaCard
                  src="broll/cmetemu/cmet_mv_ang2.mp4" kind="video"
                  w={pnz1W} h={Math.round(pnz1W * 0.5625)} x={68} y={62} z={110}
                  ry={-9} rx={2} radius={12} startFrom={7}
                  lit={0.98} litColor={V.volt} sheenAt={at(258)}
                />
              )}
            </AbsoluteFill>
          )}

          {/* ACTO 2 — salimos DENTRO de la mordaza (escala 2,9 → 1) y la pinza se queda de TESTIGO
              en la esquina durante todo el acto 3: el instrumento que produjo la cifra sigue ahí. */}
          {pnz2On && (
            <AbsoluteFill style={{
              transform: `scale(${a2Scale.toFixed(3)})`, transformOrigin: "68% 62%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_ang2.mp4" kind="video"
                w={pnz2W} h={Math.round(pnz2W * 0.5625)} x={pnz2X} y={pnz2Y} z={lerp(0, 70, pnzM)}
                ry={lerp(-6, 5, ez(g, F_A2, 620))} rx={lerp(2, 0, ez(g, F_A2, 480))}
                radius={14} startFrom={22} lit={0.96} litColor={V.volt}
                label={pnzM > 0.3 ? undefined : "MORDAZA SOBRE EL CABLE POSITIVO"}
                sheenAt={at(392)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 3 — la CAMA del campo firma: el panel tirado en el pasto, otra vez, otra escala */}
          {camaOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_ang1.mp4" kind="video"
              w={camaW} h={Math.round(camaW * 0.5625)} x={50} y={49} z={-140}
              ry={lerp(2, -3, ez(g, 660, 950))} radius={16} startFrom={44}
              lit={0.5 + 0.18 * ez(g, 660, 760)} litColor={cWarm}
              sheenAt={at(692)} opacity={0.94}
            />
          )}

          {/* ACTO 4 — las manos inclinando el panel. Sobrevive la INERCIA girando hacia el fondo. */}
          {a4On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_ang3.mp4" kind="video"
              w={p4W} h={p4H} x={p4X} y={p4Y} z={lerp(20, -120, a4M)}
              ry={p4Ry} rx={lerp(-3, 1, ez(g, 962, 1240))} radius={16} startFrom={9}
              lit={0.94 - 0.3 * a4M} litColor={cKey}
              label={a4M > 0.3 ? undefined : "TREINTA GRADOS · SIN SOMBRA DE MARCO"}
              sheenAt={at(1002)}
            />
          )}

          {/* la SOMBRA DEL PROPIO MARCO sobre la cara del panel: se acorta hasta desaparecer */}
          {sombraOn && (
            <div style={{
              position: "absolute", left: "50%", top: "58%", width: sombraW, height: 96,
              marginLeft: -sombraW / 2,
              transform: "translateZ(90px) skewX(-26deg)", opacity: 0.9 * (1 - ez(g, 1290, 1326)),
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.74)} 22%, ${rgba(V.ink0, 0.74)} 78%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 40px ${rgba(V.ink0, 0.7)}`,
            }} />
          )}

          {/* ACTO 5 — LA PINZA vuelve al primer plano: mismo instrumento, veinte vatios más */}
          {pnz5On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_ang2.mp4" kind="video"
              w={pnz5W} h={pnz5H} x={pnz5X} y={pnz5Y} z={180}
              ry={lerp(-13, -5, ez(g, 1322, 1500))} rx={2} radius={14} startFrom={96}
              lit={1} litColor={V.volt} label="MISMA PINZA" sheenAt={at(1354)}
            />
          )}

          {/* ACTO 6 — ESCALA: la miniatura del cuaderno sobre el banco se vuelve el decorado */}
          {nbOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_ang4.mp4" kind="video"
              w={nbW} h={nbH} x={nbX} y={nbY} z={lerp(0, 40, nbGrow)}
              ry={nbRy} rx={lerp(3, 0, ez(g, SEAM_ESCALA, 1700))}
              radius={Math.round(lerp(14, 6, nbGrow))} startFrom={12}
              lit={0.9 + 0.1 * nbGrow} litColor={cKey}
              label={nbSettle > 0.4 ? "EL CUADERNO · TREINTA DÍAS" : undefined}
              sheenAt={at(1732)}
            />
          )}

        </Plane>

        {/* P6 · primer plano: el bloom del sol, su disco, y el polen en el aire (hold VIVO) ──
            ⛔ el `Sol` volumétrico vive en el fondo (z −420) y las tarjetas grandes lo TAPABAN: sin
            este bloom de adelante la luz del sol no llegaba nunca a la imagen. Es lo que hace física
            la escena: la fuente brillante florece POR DELANTE de todo lo que ilumina. */}
        <Plane z={220}>
          <div style={{
            position: "absolute", left: `${solX.toFixed(2)}%`, top: `${solY.toFixed(2)}%`,
            width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(cKey, 0.3 * clamp01(solP))} 0%, ${rgba(cKey, 0.1 * clamp01(solP))} 22%, rgba(0,0,0,0) 58%)`,
            mixBlendMode: "screen", pointerEvents: "none",
          }} />
          {/* el sol como OBJETO de la escena: PNG sin fondo, no un vector dibujado */}
          {g >= 60 && g < 1700 && (
            <IconPng src="img/cmetemu/cmet_ic_sol.png"
              x={solX} y={solY + 1} size={Math.round(lerp(84, 124, clamp01(solP)))}
              z={0} opacity={0.3 + 0.46 * clamp01(solP)}
              rot={g / 34} glow={V.amber} />
          )}
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.35 + rnd(i * 4.7) * 1.15;
            const yy = (((rnd(i * 8.3) * 132 - (g * sp) / 24) % 132) + 132) % 132 - 13;
            const s = 2 + rnd(i * 2.9) * 3.6;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(6 + rnd(i * 6.1) * 88).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, (0.1 + rnd(i * 3.7) * 0.26) * clamp01(solP + 0.2)),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2 * clamp01(solP + 0.2))}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f958 · OCLUSIÓN: el borde del panel al levantarse barre el cuadro (materia = hormigón) */}
      <SeamOcclude at={at(SEAM_OCC)} dur={18} color={V.concrete} angle={11} />
      {/* luces de EVENTO (no son costuras): el instante en que cada cifra queda fijada */}
      <SeamFlash at={at(560)} color={V.volt} dur={5} />
      <SeamFlash at={at(1476)} color={V.volt} dur={6} />
      {/* el destello del sol cuando el panel queda de frente: refuerza la INERCIA, no la reemplaza */}
      <SeamFlash at={at(SEAM_INERCIA + 22)} color={cKey} dur={7} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 62 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={40} outF={286} kick="DÍA UNO · TENÍA APURO" head="APOYADO EN EL PASTO"
          sub="Plano sobre el pasto, mirando al cielo. Sombra corta." kickColor={cWarm} />
        <Titular g={g} inF={372} outF={628} kick="PINZA EN CORRIENTE CONTINUA"
          head="CUATRO COMA UNO AMPERIOS" sub="Mediodía, cielo limpio, cable positivo." />
        <Titular g={g} inF={702} outF={928} kick="CIEN PROMETIDOS" head="SESENTA Y OCHO COMA NUEVE"
          sub="Sesenta y nueve vatios de un panel de cien." kickColor={V.orange} />
        <Titular g={g} inF={1086} outF={1268} kick="DÍA DOS · UNA SOLA COSA DISTINTA"
          head="LA SOMBRA DE SU PROPIO MARCO" size={62}
          sub="Lo incliné treinta grados hasta que desapareció." />
        <Titular g={g} inF={1352} outF={1598} kick="MISMO PANEL. MISMO SOL."
          head="OCHENTA Y OCHO COMA NUEVE" sub="Veinte vatios más. Nadie tocó el panel." />
        <Titular g={g} inF={1716} outF={1812} kick="EL LADRÓN DE LOS VEINTE VATIOS" head="FUI YO"
          size={104} sub="No fue el vendedor. Fue el ángulo." />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
