// MovPico.tsx — S7 · UN MOVIMIENTO CONTINUO de 65 s (1950 frames @30fps · 706,7 s → 771,7 s)
// «Tres mil un segundo, trescientos el resto. El renglón chiquito no es el que te hizo comprarlo.»
//
// ⛔⛔ ESTE MOVIMIENTO TAPA EL SALTO DEL BUCLE DEL AVATAR (frame local 1375 = 752,52 s).
//    Por eso el archivo entero es un PLANO LLENO Y OPACO: la raíz es un `AbsoluteFill` con
//    `backgroundColor: V.ink0` y encima `VoltAtmos` (que también pinta ink0 a sangre), montados desde
//    el frame 0 al 1950 SIN una sola rampa de opacidad. Nada del movimiento vive con `opacity` baja.
//    Además, alrededor del 1375 el acto 4 es material a sangre: la cama `cmet_mv_pico4` (foto,
//    `dim` fijo) llena el cuadro con margen de sobra (escala 1,42 contra un factor de perspectiva
//    de 0,81 en ese tramo) y encima corre el clip de la chapa. En la ventana 1176 → 1524 NO hay
//    ninguna costura, ningún `zoomThrough` (que sí baja opacidad al final del portal), ningún
//    occluder y ningún montaje/desmontaje de capas: la única animación es la lupa cerrándose y la
//    letra chica encendiéndose (1300 → 1420), justo para que el salto del bucle caiga sobre
//    movimiento propio. El fondo NO se ve nunca.
//
// LA TARDE ENTRA AL GARAJE (`amber`). El verde voltio sólo sube cuando la pinza mide el pico
// (acto 3) y vuelve a acostarse en ámbar para entregarle la mesada a `MovCobre`. UNA atmósfera
// montada arriba de todo, UNA cámara función de `gFrame` que nunca vuelve a 0, luz que evoluciona
// y materia que cruza CADA frontera.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈+200, pan 0, ry 0 (hereda el macro de `MovEstacion`, con su inercia) ·
//                       luz ÁMBAR macro, key baja a la izquierda (keyFrom .26, intensity .74) ·
//                       materia: EL VIDRIO DEL DISPLAY DE LA ESTACIÓN — sobrevive como reflejo y se
//                       encoge hasta ser el brillo especular sobre el cartón de la tapa.
//                EXIT   cám z≈+146 empujando al 60%/34% del cuadro · luz ámbar, key subiendo ·
//                       materia: EL ÚLTIMO CERO DE «3000» IMPRESO EN LA TAPA (entramos DENTRO).
//
// acto 2 · f390  ENTER  cám z≈+150 saliendo del interior del cero (grupo de 3,0 → 1) · misma luz
//                       ámbar, misma dirección · materia: EL GRIS DEL INTERIOR DEL CERO = el gris
//                       sobre gris del renglón al pie de la caja.
//                EXIT   cám z≈+120, pan empezando a irse a la izquierda · entra el volt por la
//                       pinza · materia: LA LÍNEA DEL RENGLÓN, ya estirada y engordada.
//
// acto 3 · f741  ENTER  cám z≈+110 → −25, pan −96 (sigue el vector, no se reinicia) · luz ámbar con
//                       el volt subiendo (la pinza en modo pico) · materia: LA MISMA LÍNEA, ahora
//                       CABLE DE GOMA que entra al compresor (cruzó la frontera transformándose).
//                EXIT   cám z≈+30, pan −32 · volt en su máximo · materia: EL CARTÓN NARANJA DE LA
//                       CAJA cruzando el cuadro (el occluder ES la materia).
//
// acto 4 · f1170 ENTER  cám z≈+32 (heredada bajo el cartón), pan subiendo · luz volt→ámbar bajando ·
//                       materia: LA CHAPA DE BRONCE DEL ASCENSOR, a sangre y 100 % opaca.
//                       ⚠️ f1375 = SALTO DEL BUCLE DEL AVATAR: acá el cuadro está lleno de chapa.
//                EXIT   cám z≈−120 retrocediendo · luz ámbar de tarde · materia: LA MISMA CHAPA,
//                       encogiéndose hasta ser una tarjeta chica.
//
// acto 5 · f1599 ENTER  cám z≈−160 retrocediendo (la misma llamada, sin corte) · ámbar pleno ·
//                       materia: LA TARJETA DE LA CHAPA ya posada sobre la mesada (sobrevivió).
//                EXIT   cám z≈−340, pan −70, asentada y retrocediendo · luz ámbar de tarde ·
//                       materia: LA MESADA CON LA LICUADORA QUIETA  → así arranca `MovCobre`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f364  frontera 1→2 : PORTAL / ZOOM-THROUGH (`zoomThrough`, dur 26) sobre el ÚLTIMO CERO de la
//                       cifra impresa (fx 60 / fy 34, la posición exacta del dígito). Detrás ya
//                       está el acto 2 a escala 3,0, así que el cuadro nunca queda vacío.
// f741  frontera 2→3 : MORFO. El renglón gris (una línea de 7 px a y=648) se estira, se curva y
//                       engorda hasta ser el cable de goma del motor (mismo objeto, `Cable`, vivo
//                       de f470 a f990). En f741 el cable hace su latigazo (+128 px) y la tarjeta
//                       de la letra chica SALE FÍSICAMENTE del cuadro por abajo-izquierda mientras
//                       la del motor, ya montada detrás desde f690, crece. Ningún fundido.
// f1157 frontera 3→4 : OCLUSIÓN con `V.orange` — EL CARTÓN DE LA CAJA cruza el cuadro (dur 18,
//                       cobertura total en f1166, que es donde se hace el cambio de capas).
// f1530 frontera 4→5 : ESCALA — la chapa (cama + clip + marco, todo el decorado en un solo grupo)
//                       se aleja de 1,42 a 0,115 y aterriza como tarjeta chica en el 74 %/28 %,
//                       destapando la mesada que ya estaba montada detrás desde f1522.
// (ninguna se repite, ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, PromiseGap, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros
const F_A2 = 390;
const F_A3 = 741;
const F_A4 = 1170;
const F_A5 = 1599;
const ACT_IN = [0, F_A2, F_A3, F_A4, F_A5];   // red de seguridad si el build mandara sólo `acto`
const SEAM_PORTAL = 364;   // 1→2 · portal sobre el último cero
const SEAM_MORFO = 741;    // 2→3 · el renglón se vuelve cable
const SEAM_OCC = 1157;     // 3→4 · el cartón naranja cruza (cobertura total en 1166)
const SWAP4 = 1166;        // cambio de capas EXACTAMENTE bajo la cobertura total
const SEAM_ESC = 1530;     // 4→5 · la chapa se aleja y queda tarjeta
const LOOP_FRAME = 1375;   // ⚠️ salto del bucle del avatar: el cuadro tiene que estar LLENO

// geometría del renglón / cable (viewBox 1920×1080)
const LINE_X0 = 430;
const LINE_X1 = 1490;
const LINE_Y = 648;

// ── EL RENGLÓN QUE SE VUELVE CABLE — la materia que cruza la frontera 2→3 ───────────────────
// Es UN solo objeto: nace como la subrayada de la letra chica (línea recta de 7 px, plateada),
// se estira, se curva y engorda hasta ser la goma negra del cable que entra al compresor.
const Cable: React.FC<{ g: number }> = ({ g }) => {
  const on = ez(g, 470, 512) * (1 - ez(g, 930, 992));
  if (on <= 0.01) return null;
  const t = ez(g, 700, 836);
  const x0 = lerp(LINE_X0, -110, t), y0 = lerp(LINE_Y, 962, t);
  const c1x = lerp(700, 360, t), c1y = lerp(LINE_Y, 812, t);
  const c2x = lerp(1200, 742, t), c2y = lerp(LINE_Y, 470, t);
  const x1 = lerp(LINE_X1, 1214, t), y1 = lerp(LINE_Y, 448, t);
  const d = `M ${x0.toFixed(1)} ${y0.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  // el LATIGAZO: pico exacto en f741, la frontera. El cable engorda y barre el centro del cuadro.
  const swell = Math.sin(Math.PI * seg(g, SEAM_MORFO - 35, SEAM_MORFO + 35));
  const wMain = lerp(7, 34, t) + 128 * swell * swell;
  const col = light(t, "silver", "ink2");
  // revelado por el eje del tiempo: primero subraya la letra chica, después ya es cable entero
  const revW = lerp(0, 1180, ez(g, 470, 552)) + eio(0, 1000, seg(g, 688, 744));
  return (
    <svg viewBox="0 0 1920 1080" style={{
      position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
      opacity: clamp01(on),
    }}>
      <defs>
        <clipPath id="cmetPicoCable">
          <rect x={LINE_X0 - 14} y={0} width={Math.max(0, revW)} height={1080} />
        </clipPath>
      </defs>
      <g clipPath="url(#cmetPicoCable)">
        <path d={d} fill="none" stroke={rgba(V.ink0, 0.5 + 0.3 * t)} strokeWidth={wMain + 12}
          strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={col} strokeWidth={wMain}
          strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 ${(6 + 10 * t).toFixed(0)}px ${(14 + 16 * t).toFixed(0)}px ${rgba(V.ink0, 0.8)})` }} />
        {/* el brillo de la goma: lo que lo hace un objeto y no una línea de vector */}
        <path d={d} fill="none" stroke={rgba(V.white, 0.10 + 0.16 * t)} strokeWidth={Math.max(1, wMain * 0.22)}
          strokeLinecap="round" strokeLinejoin="round"
          transform={`translate(0 ${(-wMain * 0.24).toFixed(1)})`} />
      </g>
    </svg>
  );
};

// ── LA CURVA DEL PICO (estructura gráfica sobre el material real del motor) ──────────────────
// Proporciones REALES: 450 W = 206 px, 90 W = 41,2 px. La forma se lee sin leer nada.
const SpikePlot: React.FC<{ g: number }> = ({ g }) => {
  const on = ez(g, 884, 928) * (1 - ez(g, 1104, 1148));
  if (on <= 0.01) return null;
  const revW = lerp(0, 800, ez(g, 890, 1016));
  return (
    <svg viewBox="0 0 1920 1080" style={{
      position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
      opacity: clamp01(on),
    }}>
      <defs>
        <clipPath id="cmetPicoCurva">
          <rect x={1060} y={40} width={Math.max(0, revW)} height={420} />
        </clipPath>
      </defs>
      <line x1={1080} y1={314} x2={1840} y2={314} stroke={rgba(V.white, 0.2)} strokeWidth={2} />
      <g clipPath="url(#cmetPicoCurva)">
        <path d="M 1080 310 L 1200 310 L 1216 104 L 1244 269 L 1840 269" fill="none"
          stroke={rgba(V.volt, 0.22)} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 1080 310 L 1200 310 L 1216 104 L 1244 269 L 1840 269" fill="none"
          stroke={V.volt} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 14px ${rgba(V.volt, 0.75)})` }} />
      </g>
    </svg>
  );
};

// ── TITULAR (una idea de texto por acto, sobre cama oscura, fuera de la perspectiva) ─────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 66, maxWidth: 1060,
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

// las tres pruebas que se mueren sobre la mesada (material real en cada tarjeta)
const PRUEBAS: { src: string; w: string; n: string; at: number }[] = [
  { src: "img/cmetemu/cmet_h05.jpg", w: "600 W", n: "LICUADORA", at: 1614 },
  { src: "img/cmetemu/cmet_h09.jpg", w: "800 W", n: "MICROONDAS", at: 1702 },
  { src: "img/cmetemu/cmet_h14.jpg", w: "1200 W", n: "HORNILLA", at: 1812 },
];

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovPico: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : ACT_IN[Math.min(Math.max(Math.round(acto), 1), 5) - 1];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: 200, z1: -140, panX: 70, panY: -46, ry: 8, rx: -2.4, dur: 1880 });
  const zAcc =
    eio(0, 150, seg(g, 360, 430)) +          // el portal nos deja MÁS adentro (macro de la letra chica)
    eio(0, -120, seg(g, 735, 862)) +         // el morfo abre del renglón al motor
    eio(0, 90, seg(g, 1160, 1304)) +         // entramos a la chapa del ascensor
    eio(0, -320, seg(g, SEAM_ESC, 1824));    // el retroceso final hasta la mesada
  const pxAcc =
    eio(0, -96, seg(g, 735, 884)) +
    eio(0, 64, seg(g, 1176, 1362)) +
    eio(0, -70, seg(g, 1604, 1812));
  const pyAcc =
    eio(0, -40, seg(g, 366, 474)) +
    eio(0, 52, seg(g, 1160, 1330)) +
    eio(0, 44, seg(g, 1604, 1846));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. ámbar → volt (la pinza mide el pico) → ámbar (la tarde) ──
  const cKey = g < 1240
    ? light(seg(g, 600, 1060), "amber", "volt")
    : light(seg(g, 1240, 1900), "volt", "amber");
  const cContra = light(seg(g, 1440, 1900), "orange", "amber");
  const keyFrom = 0.26 + eio(0, 0.34, seg(g, 280, 940)) + eio(0, -0.26, seg(g, 1240, 1880));
  const intensity = 0.74 + eio(0, 0.26, seg(g, 0, 110)) + eio(0, -0.18, seg(g, 1660, 1930));

  // ── ACTO 1 · la tapa de la caja y los tres mil impresos ───────────────────────────────────
  const zt = zoomThrough(g, SEAM_PORTAL, 26, 60, 34);
  const a1On = g < SEAM_PORTAL + 28;
  const a1BedScale = lerp(1.95, 1.42, ez(g, 0, 300));
  const a1CardW = Math.round(lerp(2880, 1560, ez(g, 12, 268)));
  const a1CardH = Math.round(a1CardW * 0.5625);
  const cifOp = ez(g, 62, 122);
  const cifS = lerp(1.42, 1, ez(g, 62, 236));
  // el VIDRIO DEL DISPLAY de la estación: la materia que llega de `MovEstacion` y se encoge hasta
  // ser el brillo especular sobre el cartón (nunca se apaga del todo: se transforma).
  const dispW = Math.round(lerp(1120, 640, ez(g, 8, 168)));
  const dispH = Math.round(lerp(300, 15, ez(g, 8, 168)));
  const dispY = lerp(46.5, 40.6, ez(g, 8, 168));
  const dispA = lerp(0.92, 0.34, ez(g, 8, 168));
  const nueveOp = 1 - ez(g, 26, 78);

  // ── ACTO 2 · el renglón gris sobre gris al pie de la caja ─────────────────────────────────
  const a2On = g >= 348 && g < 782;
  const a2Grp = lerp(3.0, 1, ez(g, SEAM_PORTAL, 506));
  const a2W = Math.round(lerp(1680, 620, ez(g, 700, 772)));
  const a2H = Math.round(a2W * 0.48);
  const a2X = lerp(50, -26, ez(g, 700, 772));
  const a2Y = lerp(46, 92, ez(g, 700, 772));
  const a2Ry = lerp(0, 30, ez(g, 700, 772));

  // ── ACTO 3 · el compresor arrancando con la pinza en modo pico ────────────────────────────
  const a3On = g >= 690 && g < SWAP4;
  const a3W = Math.round(lerp(880, 1560, ez(g, 700, 818)));
  const a3H = Math.round(a3W * 0.5625);
  const burst = Math.sin(Math.PI * seg(g, 858, 906));
  const jx = (rnd(g * 2.7) - 0.5) * 15 * burst;
  const jy = (rnd(g * 5.1) - 0.5) * 10 * burst;

  // ── ACTO 4 · la chapa del ascensor · ⚠️ ACÁ CAE EL SALTO DEL BUCLE (f1375) ─────────────────
  // Todo el decorado del acto vive en UN grupo, para que la costura de ESCALA pueda alejarlo
  // entero y dejarlo posado como tarjeta. `escS` va de 1,42 (llena el cuadro con margen) a 0,115.
  const a4On = g >= SWAP4;
  const escP = ez(g, SEAM_ESC, 1672);
  const escS = lerp(1.42, 0.115, escP);
  const escDX = 24 * escP;    // % del cuadro: aterriza centrada en el 74 %
  const escDY = -22 * escP;   // …y en el 28 %
  const chapaTxt = ez(g, 1204, 1246) * (1 - ez(g, 1470, 1524));
  const lupaP = ez(g, 1300, 1372);
  const chicaOn = ez(g, 1256, 1300) * (1 - ez(g, 1470, 1524));
  // la letra chica se enciende JUSTO SOBRE el frame del bucle (1362 → 1416): así el salto del
  // avatar cae encima de movimiento propio, con el cuadro lleno de chapa y 100 % opaco.
  const ignit = ez(g, LOOP_FRAME - 13, LOOP_FRAME + 41);

  // ── ACTO 5 · la mesada, la licuadora quieta y el hueco 3000 / 340 ─────────────────────────
  const a5On = g >= 1522;
  const gapP = ez(g, 1600, 1682) * (1 - ez(g, 1858, 1922));

  return (
    // ⛔ RAÍZ SIEMPRE OPACA: nunca lleva opacity animada. Es lo que garantiza que el salto del
    //    bucle del avatar (f1375) quede tapado aunque cualquier capa de arriba respire.
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cContra} keyFrom={keyFrom} intensity={intensity} floor={0.58} />

      <Layers cam={cam}>
        {/* P1 · CAMAS PROFUNDAS — sólo cambian debajo de una costura ── */}
        <Plane z={-340}>
          {/* el garaje de Claudio detrás de los actos 2 y 3 (nace tapado por el acto 1) */}
          {g >= 300 && g < SWAP4 && (
            <PhotoPlane
              src="img/cmetemu/cmet_h07.jpg" kind="photo" z={0}
              scale={lerp(2.6, 1.62, ez(g, SEAM_PORTAL, 520))}
              dim={lerp(0.66, 0.58, ez(g, 520, 900))} tint={V.amber}
            />
          )}
          {/* la mesada del acto 5: se monta DETRÁS mientras la chapa todavía llena el cuadro */}
          {a5On && (
            <PhotoPlane
              src="img/cmetemu/cmet_h11.jpg" kind="photo" z={0}
              scale={lerp(1.74, 1.62, ez(g, 1522, 1900))}
              dim={lerp(0.56, 0.38, ez(g, 1560, 1900))} tint={V.amber}
            />
          )}
        </Plane>

        {/* P2 · EL ACTO 4 ENTERO EN UN GRUPO — la chapa a sangre, 100 % opaca.
                ⚠️ Ésta es la capa que cubre el frame 1375. Se monta bajo la cobertura total del
                occluder (f1166) y NO tiene rampa de opacidad en ningún momento. */}
        <Plane z={-300}>
          {a4On && (
            <AbsoluteFill style={{
              transform: `translate(${escDX.toFixed(3)}%, ${escDY.toFixed(3)}%) scale(${escS.toFixed(4)})`,
              transformOrigin: "50% 50%", transformStyle: "preserve-3d",
              // marco inverso-escalado: a tamaño de decorado es invisible, a tamaño de tarjeta
              // es un marco de 1,6 px con su sombra de contacto. Nunca aparece de la nada.
              borderRadius: Math.round(18 / escS),
              border: `${(1.6 / escS).toFixed(1)}px solid ${rgba(V.silver, 0.12 + 0.42 * escP)}`,
              boxShadow: `0 ${Math.round(26 / escS)}px ${Math.round(52 / escS)}px ${rgba(V.ink0, 0.82)}`,
              overflow: "hidden", boxSizing: "border-box",
            }}>
              <PhotoPlane
                src="img/cmetemu/cmet_mv_pico4.jpg" kind="photo" z={0} scale={1.16}
                dim={0.46} tint={V.amber}
              />
              <MediaCard
                src="broll/cmetemu/cmet_mv_pico4.mp4" kind="video"
                w={1520} h={856} x={50} y={47} z={0}
                ry={lerp(6, 0, ez(g, SWAP4, 1330))} rx={lerp(-2.5, 0, ez(g, SWAP4, 1330))}
                radius={16} startFrom={6} lit={0.95} litColor={V.amber}
                label="CHAPA DE CARGA · ASCENSOR DE 1962" sheenAt={at(1214)}
              />
            </AbsoluteFill>
          )}
        </Plane>

        {/* P3 · GRÁFICOS: el renglón-cable, la curva del pico, las cifras y el hueco ── */}
        <Plane z={-60}>
          {/* la materia que cruza la frontera 2→3 */}
          <Cable g={g} />
          {/* la curva del arranque, sobre el material real del motor */}
          <SpikePlot g={g} />

          {/* ACTO 2 · la cifra prometida sigue arriba (naranja = lo que dice la tapa) */}
          {g >= 424 && g < 786 && (
            <div style={{ opacity: ez(g, 424, 458) * (1 - ez(g, 736, 782)) }}>
              <Readout value="3.000" unit="W" label="LO QUE DICE LA TAPA" at={at(424)}
                x={25} y={19} size={104} color={V.orange} />
            </div>
          )}
          {/* ACTO 2 · la cifra REAL, en verde y desde la pinza */}
          {g >= 470 && g < 790 && (
            <div style={{ opacity: ez(g, 470, 500) * (1 - ez(g, 742, 786)) }}>
              <Readout value="300" unit="W" label="POTENCIA NOMINAL · CONTINUA" at={at(470)}
                x={72} y={27} size={176} color={V.volt} />
            </div>
          )}

          {/* ACTO 3 · lo que consume andando y lo que pide para arrancar */}
          {g >= 806 && g < 1150 && (
            <div style={{ opacity: ez(g, 806, 836) * (1 - ez(g, 1104, 1146)) }}>
              <Readout value="90" unit="W" label="REFRIGERADOR ANDANDO" at={at(806)}
                x={24} y={35} size={92} color={V.voltSoft} />
            </div>
          )}
          {g >= 860 && g < 1152 && (
            <div style={{ opacity: ez(g, 860, 878) * (1 - ez(g, 1106, 1148)) }}>
              <Readout value="450" unit="W" label="MEDIO SEGUNDO DE ARRANQUE" at={at(862)}
                x={26} y={19} size={172} color={V.volt} />
            </div>
          )}
          {/* rótulos de estructura de la curva (la forma ya se lee; esto sólo la ancla) */}
          {g >= 1000 && g < 1148 && (
            <div style={{ opacity: ez(g, 1000, 1030) * (1 - ez(g, 1104, 1144)) }}>
              <div style={{
                position: "absolute", left: "63.3%", top: "31%", transform: "translateX(-50%)",
              }}><Kick color={V.torch}>MEDIO SEGUNDO</Kick></div>
              <div style={{
                position: "absolute", left: "83%", top: "26.5%", transform: "translateX(-50%)",
              }}><Kick color={rgba(V.white, 0.6)}>EL RESTO DEL TIEMPO</Kick></div>
            </div>
          )}
          {/* el cronómetro como objeto de la escena */}
          {g >= 946 && g < 1150 && (
            <IconPng src="img/cmetemu/cmet_ic_cronometro.png" x={88} y={44} size={104} z={0}
              opacity={ez(g, 946, 986) * (1 - ez(g, 1100, 1142))} glow={V.ink0} />
          )}

          {/* ACTO 4 · lo que dice la chapa, y la letra chica que lo desarma.
              ⚠️ Esta es la ÚNICA animación en la ventana del salto del bucle: la lupa cerrándose
              y el renglón encendiéndose. Nada de esto toca la opacidad del cuadro. */}
          {chapaTxt > 0.01 && (
            <div style={{ opacity: chapaTxt }}>
              <Readout value="2.000" unit="kg" label="LO QUE DICE LA CHAPA" at={at(1204)}
                x={27} y={23} size={148} color={V.silver} />
            </div>
          )}
          {chicaOn > 0.01 && (
            <div style={{ opacity: chicaOn }}>
              {/* el aro de la lupa cerrándose sobre el renglón */}
              <div style={{
                position: "absolute", left: "66%", top: "66%",
                width: lerp(620, 320, lupaP), height: lerp(620, 320, lupaP),
                marginLeft: -lerp(620, 320, lupaP) / 2, marginTop: -lerp(620, 320, lupaP) / 2,
                borderRadius: "50%",
                border: `3px solid ${rgba(V.bone, 0.18 + 0.34 * lupaP)}`,
                boxShadow: `inset 0 0 60px ${rgba(V.ink0, 0.55)}, 0 0 ${Math.round(20 + 40 * ignit)}px ${rgba(V.volt, 0.34 * ignit)}`,
              }} />
              <div style={{
                position: "absolute", left: "66%", top: "66%", transform: "translate(-50%,-50%)",
                whiteSpace: "nowrap", textAlign: "center",
              }}>
                <div style={{
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: lerp(34, 46, ignit),
                  letterSpacing: 2.4, textTransform: "uppercase",
                  color: ignit > 0.02 ? light(ignit, "bone", "volt") : rgba(V.bone, 0.42),
                  textShadow: `0 3px 18px rgba(0,0,0,0.92), 0 0 ${Math.round(34 * ignit)}px ${rgba(V.volt, 0.5 * ignit)}`,
                }}>La soporta 1 segundo</div>
                <div style={{
                  height: 4, marginTop: 12, marginLeft: "auto", marginRight: "auto",
                  width: lerp(0, 420, ez(g, 1380, 1438)),
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0.15)} 0%, ${V.volt} 30%, ${V.volt} 70%, ${rgba(V.volt, 0.15)} 100%)`,
                  boxShadow: `0 0 22px ${rgba(V.volt, 0.7)}`,
                }} />
              </div>
            </div>
          )}
          {g >= 1288 && g < 1520 && (
            <IconPng src="img/cmetemu/cmet_ic_lupa.png" x={55} y={57} size={126} z={0}
              rot={-16} opacity={ez(g, 1288, 1330) * (1 - ez(g, 1470, 1516))} glow={V.ink0} />
          )}

          {/* ACTO 5 · EL CAMPO FIRMA: 3.000 prometidos contra 340 medidos.
              El revelado es por CLIP-PATH (las barras suben desde el piso), no por opacidad. */}
          {gapP > 0.01 && (
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              clipPath: `inset(${((1 - gapP) * 100).toFixed(2)}% 0% 0% 0%)`,
              opacity: clamp01(gapP * 1.6),
            }}>
              <PromiseGap
                promise={3000} measured={340} unit="W" slats={28}
                x={30} y={50} w={720} h={340} on={1} nums
                label="PICO DECLARADO · PICO MEDIDO"
              />
            </div>
          )}
        </Plane>

        {/* P4 · EL MATERIAL REAL: las tarjetas protagonistas de los actos 1, 2, 3 y 5 ── */}
        <Plane z={40}>
          {/* ACTO 2 — se monta DETRÁS del acto 1 (que la tapa entera) y sale por el portal.
              Va antes en el DOM justamente para que el acto 1 la cubra hasta f389. */}
          {a2On && (
            <AbsoluteFill style={{
              transform: `scale(${a2Grp.toFixed(3)})`, transformOrigin: "50% 46%",
              transformStyle: "preserve-3d",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_pico2.mp4" kind="video"
                w={a2W} h={a2H} x={a2X} y={a2Y} z={0}
                ry={a2Ry} rx={lerp(-3, 0, ez(g, 400, 520))} rot={lerp(0, 7, ez(g, 700, 772))}
                radius={16} startFrom={5} lit={0.9} litColor={V.amber}
                label="AL PIE DE LA CAJA · GRIS SOBRE GRIS" sheenAt={at(452)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 3 — ya está montada detrás desde f690; crece a medida que la letra chica se va.
              No hay fundido: la tarjeta de arriba SE VA DEL CUADRO y ésta queda descubierta. */}
          {a3On && (
            <AbsoluteFill style={{
              transform: `translate(${jx.toFixed(2)}px, ${jy.toFixed(2)}px)`,
              transformStyle: "preserve-3d",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_pico3.mp4" kind="video"
                w={a3W} h={a3H} x={50} y={47} z={0}
                ry={lerp(-7, 1.5, ez(g, 700, 900))} rx={lerp(2, 0, ez(g, 700, 900))}
                radius={16} startFrom={8} lit={0.9 + 0.1 * burst}
                litColor={light(seg(g, 760, 980), "amber", "volt")}
                label="COMPRESOR · PINZA EN MODO PICO" sheenAt={at(772)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 1 — LA TAPA. Grupo completo (cama + cifra impresa + clip) que sale por PORTAL
              entrando en el último cero. Va último en el DOM: tapa todo lo que se monta detrás. */}
          {a1On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity),
              transformOrigin: "60% 34%", transformStyle: "preserve-3d",
            }}>
              <PhotoPlane
                src="img/cmetemu/cmet_mv_pico1.jpg" kind="photo" z={0}
                scale={a1BedScale} dim={lerp(0.30, 0.46, ez(g, 20, 300))} tint={V.amber}
              />
              <MediaCard
                src="broll/cmetemu/cmet_mv_pico1.mp4" kind="video"
                w={a1CardW} h={a1CardH} x={50} y={45} z={0}
                ry={lerp(-6, 0.5, ez(g, 20, 260))} rx={lerp(3, 0, ez(g, 20, 260))}
                radius={18} startFrom={3} lit={0.92} litColor={V.amber}
                label={g > 250 ? "LA TAPA DE LA CAJA" : undefined} sheenAt={at(196)}
              />

              {/* EL VIDRIO DEL DISPLAY que viene de `MovEstacion`: se encoge hasta ser el brillo
                  especular sobre el cartón. No se apaga: se transforma. */}
              <div style={{
                position: "absolute", left: "50%", top: `${dispY.toFixed(2)}%`,
                width: dispW, height: dispH, marginLeft: -dispW / 2, marginTop: -dispH / 2,
                borderRadius: Math.max(3, dispH * 0.18), opacity: dispA,
                background: `linear-gradient(178deg, ${rgba(V.amber, 0.30)} 0%, ${rgba(V.amber, 0.11)} 48%, ${rgba(V.ink0, 0.4)} 100%)`,
                boxShadow: `0 0 ${Math.round(30 + dispH * 0.4)}px ${rgba(V.amber, 0.34)}, inset 0 1px 0 ${rgba(V.white, 0.28)}`,
              }}>
                {nueveOp > 0.01 && (
                  <div style={{
                    position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 148, lineHeight: 1,
                    color: rgba(V.amber, 0.88 * nueveOp), letterSpacing: 4,
                    textShadow: `0 0 40px ${rgba(V.amber, 0.6 * nueveOp)}`,
                  }}>9 W</div>
                )}
              </div>

              {/* LOS TRES MIL IMPRESOS EN LA TAPA — apoyados sobre el cartón (rotateX), en el
                  naranja de lo que PROMETEN. El último cero está en el 60 %/34 %: ahí entra la
                  cámara en f364. */}
              {cifOp > 0.01 && ["3", "0", "0", "0"].map((d, i) => (
                <div key={i} style={{
                  position: "absolute", left: `${36 + i * 8}%`, top: "34%",
                  transform: `translate(-50%,-50%) rotateX(11deg) rotate(-1.6deg) scale(${cifS.toFixed(3)})`,
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 282, lineHeight: 0.86,
                  color: rgba(V.orange, 0.94), opacity: cifOp,
                  textShadow: `0 3px 0 ${rgba(V.orangeSoft, 0.9)}, 0 14px 40px ${rgba(V.ink0, 0.9)}`,
                }}>{d}</div>
              ))}
              {cifOp > 0.01 && (
                <div style={{
                  position: "absolute", left: "68.5%", top: "38%",
                  transform: `translate(-50%,-50%) rotateX(11deg) rotate(-1.6deg) scale(${cifS.toFixed(3)})`,
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 110, lineHeight: 1,
                  color: rgba(V.orange, 0.9), opacity: cifOp,
                  textShadow: `0 3px 0 ${rgba(V.orangeSoft, 0.9)}, 0 12px 34px ${rgba(V.ink0, 0.9)}`,
                }}>W</div>
              )}
              {/* el aro que apunta al cero por el que vamos a entrar (la cámara ya lo está mirando) */}
              {g >= 286 && (
                <div style={{
                  position: "absolute", left: "60%", top: "34%",
                  width: lerp(420, 236, ez(g, 286, SEAM_PORTAL)),
                  height: lerp(420, 236, ez(g, 286, SEAM_PORTAL)),
                  marginLeft: -lerp(420, 236, ez(g, 286, SEAM_PORTAL)) / 2,
                  marginTop: -lerp(420, 236, ez(g, 286, SEAM_PORTAL)) / 2,
                  borderRadius: "50%",
                  border: `3px solid ${rgba(V.bone, 0.14 + 0.3 * ez(g, 286, 350))}`,
                  boxShadow: `inset 0 0 70px ${rgba(V.ink0, 0.5)}`,
                }} />
              )}
            </AbsoluteFill>
          )}

          {/* ACTO 5 — la mesada: la losa que recibe las tarjetas y las tres pruebas muertas */}
          {a5On && (
            <>
              <PadPlane y={80} w={1540} h={320} rx={64} lit={0.55 + 0.35 * ez(g, 1560, 1720)} z={-90} />
              {PRUEBAS.map((p, i) => {
                const ap = ez(g, p.at, p.at + 22);
                if (ap <= 0.01) return null;
                const muerta = ez(g, p.at + 46, p.at + 78);
                return (
                  <React.Fragment key={i}>
                    <MediaCard
                      src={p.src} kind="photo"
                      w={220} h={132} x={66 + i * 11.5} y={79} z={0}
                      ry={lerp(14, 4 - i * 3, ap)} rx={-2} radius={12}
                      lit={0.9 - 0.35 * muerta} litColor={muerta > 0.5 ? V.orange : V.amber}
                      label={p.n} opacity={ap} sheenAt={at(p.at + 8)}
                    />
                    <div style={{
                      position: "absolute", left: `${66 + i * 11.5}%`, top: "69.5%",
                      transform: "translate(-50%,-50%)", opacity: ap, whiteSpace: "nowrap",
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, lineHeight: 1,
                      color: muerta > 0.4 ? rgba(V.orange, 0.5 + 0.4 * muerta) : V.bone,
                      textShadow: "0 4px 18px rgba(0,0,0,0.92)",
                    }}>{p.w}</div>
                    {/* la línea que la tacha: la prueba se murió */}
                    <div style={{
                      position: "absolute", left: `${66 + i * 11.5 - 3.4}%`, top: "69.4%",
                      width: `${6.8 * muerta}%`, height: 4, background: rgba(V.orange, 0.8 * muerta),
                      boxShadow: `0 0 16px ${rgba(V.orange, 0.6 * muerta)}`,
                    }} />
                  </React.Fragment>
                );
              })}
            </>
          )}
        </Plane>

        {/* P5 · primer plano: el polvo del taller en el haz del portón (hold VIVO permanente) */}
        <Plane z={220}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = ((rnd(i * 8.3) * 132 - (g * sp) / 24) % 132 + 132) % 132 - 13;
            const s = 2 + rnd(i * 2.9) * 3.6;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(6 + rnd(i * 6.1) * 88).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, 0.10 + rnd(i * 3.7) * 0.2),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f1157 · frontera 3→4: EL CARTÓN NARANJA DE LA CAJA cruza el cuadro y tapa el 100 %.
          El cambio de capas se hace en f1166, que es donde la cobertura es total. */}
      <SeamOcclude at={at(SEAM_OCC)} dur={18} color={V.orange} angle={7} lit={0.30} />
      {/* el fogonazo del arranque del motor: NO es una costura, es la luz del evento */}
      <SeamFlash at={at(864)} color={V.volt} dur={7} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={96} outF={318} kick="LA TAPA DE LA CAJA"
          head="TRES MIL EN LA TAPA"
          sub="En letras enormes y naranjas, arriba de todo." kickColor={V.orange} />
        <Titular g={g} inF={430} outF={700} kick="AL PIE, EN GRIS SOBRE GRIS"
          head="TRESCIENTOS EN LA LETRA CHICA" size={64}
          sub="Potencia nominal: lo que entrega de verdad, todo el tiempo." />
        <Titular g={g} inF={800} outF={1104} kick="PINZA · MODO PICO"
          head="EL ARRANQUE DEL MOTOR"
          sub="Al arrancar piden entre 3 y 7 veces lo que consumen después." />
        <Titular g={g} inF={1214} outF={1472} kick="LA LETRA CHICA DEL ASCENSOR"
          head="UN ASCENSOR DE DOS TONELADAS" size={66}
          sub="Ese pico existe y hace falta. Pero dura lo que dura." kickColor={V.silver} />
        <Titular g={g} inF={1656} outF={1898} kick="LA PRUEBA"
          head="TRESCIENTOS CUARENTA DE TRES MIL" size={62}
          sub="Tres mil un segundo. Trescientos el resto." />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
