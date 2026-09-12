// MovS1A.tsx — MOVIMIENTO S1A · "EL DERRUMBE DE LA FACTURA"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 4 actos · 12.060 → 45.760 ms · 1011 frames @30.
//
// LA IDEA: 111 dólares se desploman hasta 44. El hueco que dejan NO queda vacío: se llena de voltio
// y adentro del hueco se escribe solo el 60 %. Después vemos de dónde salió ese hueco (la caja se
// cargó sola de noche) y a dónde van a parar los 67 dólares que ya no se van.
//
// LA MATERIA QUE CRUZA LAS TRES FRONTERAS: **LA BARRA**.
//   acto 1 → es la barra ámbar del 111 que se desploma y deja un HUECO negro;
//   acto 2 → la cámara ENTRÓ en ese hueco: los 0,25 s de negro SON el interior del hueco;
//   acto 3 → el hueco se acuesta y sus dos cantos son el PORTÓN ENTREABIERTO del garaje;
//            adentro, la barra vuelve de canto: es la barra de carga de la caja gris;
//   acto 4 → esa misma barra de carga se para y vuelve a ser la barra voltio del acto 1, encendida.
//
// UNA cámara: `camAt(gFrame)` — un `gcam` monótono (z −260 → +520) que deriva SIEMPRE a la izquierda,
// + una grúa continua, + un zoom-through que entra en el hueco del acto 1 y sale ya adentro del
// garaje. Como es función pura de `gFrame`, sigue viajando durante los CLIP reales que van entre
// acto y acto (12,4 s entre el 1 y el 3): el acto 3 empieza donde el acto 2 la dejó. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: VOLT de medición → se ENFRÍA (la compañía, desde arriba) mientras el garaje se apaga →
// en el acto 4 el ÁMBAR de abajo (lo que te queda) sube y se queda. Evoluciona, no salta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-75 · "111 → 44 · 60 %"                       material: CLIP factura_abre
//   entra  cam {z −260, plano del gráfico, deriva a la izq} luz {VOLT, key 0.34, int 0.92}
//   sale   cam {METIDA DENTRO del hueco, push ×4.2}         luz {VOLT, key 0.31}
//   ── FRONTERA A ···· ZOOM-THROUGH: la cámara entra en el hueco de la barra. ················
// ACTO 2 · g373-385 · respiración: 0,25 s de negro absoluto = EL INTERIOR DEL HUECO. Sin fundido.
//   ── FRONTERA B ···· MATCH-SHAPE: el hueco se acuesta y es el portón entreabierto. ·········
// ACTO 3 · g646-826 · "1:00 → 6:30"                        material: CLIP reloj_pared + CLIP caja_carga
//   entra  cam {saliendo del hueco, push 3.4 → 1, grúa −58}  luz {frío, key 0.10, int 0.50}
//   sale   cam {grúa −18, empezando a subir}                 luz {frío pleno, int 0.62}
//   ── FRONTERA C ···· MATCH-CUT DE ESCALA: la barra de carga se para y es la barra voltio. ··
// ACTO 4 · g756-1011 · "60 % MENOS · $67"                  material: FOTO factura + FOTO bolsillo + CLIP poste
//   entra  cam {grúa +40, subiendo}                          luz {key 0.26, ámbar de abajo subiendo}
//   sale   cam {grúa +168, arriba y a la izquierda}          luz {key 0.32, ámbar pleno}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Kick, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 373, A3 = 646, A4 = 756;
const G_END = 1011;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4 };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla
const xp = (px: number) => (px / 1920) * 100;   // px horizontales → % de pantalla

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  facturaV: "broll/cmeenchufe/cmee_s1_factura_abre.mp4",
  facturaF: "img/cmeenchufe/cmee_s1_factura_plana_mesa.png",
  garajeF: "img/cmeenchufe/cmee_s1_umbral_garaje.png",
  relojV: "broll/cmeenchufe/cmee_s4_reloj_pared_3am.mp4",
  cajaCargaV: "broll/cmeenchufe/cmee_s7_caja_carga_madrugada.mp4",
  bolsilloF: "img/cmeenchufe/cmee_s8_bolsillo_vacio.png",
  posteV: "broll/cmeenchufe/cmee_s6_poste_operario_wide.mp4",
  icFoco: "img/cmeenchufe/cmee_ic_foco.png",
  icMoneda: "img/cmeenchufe/cmee_ic_moneda.png",
};

// ── EL GRÁFICO (esto SÍ es un gráfico: va en vector) ─────────────────────────────────────────
const FLOOR = 820;                 // la base de la barra, en px de la comp 1920×1080
const BAR_X = 34;                  // % — el centro de la barra del acto 1
const BAR_W = 356;
const H111 = 596, H44 = 236;       // altura = dinero, a escala exacta (596/236 ≈ 111/44)
const HOLE_TOP = FLOOR - H111;     // 224
const HOLE_BOT = FLOOR - H44;      // 584
const HOLE_Y = (HOLE_TOP + HOLE_BOT) / 2;   // 404 → el punto por el que entra la cámara

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -260, z1: 520, panX: -190, panY: 24, ry: -6.4, rx: 2.2, dur: G_END });
  // LA GRÚA (positivo = la cámara sube): baja al piso del garaje y vuelve a trepar con el ámbar.
  const crane = interpolate(
    g,
    [0, A2, A3, A3 + 96, A4, A4 + 160, G_END],
    [0, 34, -58, -18, 40, 132, 168],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ZOOM-THROUGH: entramos DENTRO del hueco de la barra y salimos ya adentro del garaje.
  const push = interpolate(g, [A1 + 38, A1 + 74, A2 + 12, A3 + 40], [1, 4.2, 3.4, 1], {
    ...CL, easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - BAR_X) * (push - 1);
  const ty = (50 - pc(HOLE_Y)) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── la cifra que CUENTA (el Readout del Stage salta; acá el dinero tiene que CAER) ───────────
const Ticker: React.FC<{
  text: string; x: number; y: number; size: number; color: string; opacity?: number; scale?: number;
}> = ({ text, x, y, size, color, opacity = 1, scale = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    transform: `translate(-50%,-50%) scale(${scale.toFixed(3)})`,
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.9, color, opacity,
    whiteSpace: "nowrap",
    textShadow: `0 0 ${Math.round(size * 0.42)}px ${rgba(color, 0.4)}, 0 6px 26px rgba(0,0,0,0.92)`,
  }}>{text}</div>
);

// rótulo de eje: chico, tipografía de cuerpo (es parte del gráfico, no un titular)
const AxisTag: React.FC<{ text: string; x: number; y: number; color: string; p: number }> = ({ text, x, y, color, p }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: p,
    fontFamily: F_BODY, fontWeight: 600, fontSize: 25, letterSpacing: 3.2, color,
    textTransform: "uppercase", textShadow: "0 3px 16px rgba(0,0,0,0.9)", whiteSpace: "nowrap",
  }}>{text}</div>
);

// bezier cuadrática: el camino que hace el dinero (px de la comp 1920×1080)
const qbez = (p: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
  const u = 1 - p;
  return { x: u * u * x0 + 2 * u * p * cx + p * p * x1, y: u * u * y0 + 2 * u * p * cy + p * p * y1 };
};

export const MovS1A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);     // frame LOCAL del acto
  const toCF = (t: number) => cf - f + t;    // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, A2, A3, A4, G_END], [0.34, 0.30, 0.10, 0.26, 0.32], CL);
  const cool = interpolate(gFrame, [A2, A3 + 46], [0, 0.62], CL);
  const inten = interpolate(gFrame, [0, A1 + 60, A2, A3, A3 + 90, A4 + 60, G_END], [0.92, 1.06, 0.9, 0.5, 0.62, 1.14, 1.1], CL);
  const floorDim = interpolate(gFrame, [0, A3, A4, G_END], [0.55, 0.8, 0.62, 0.58], CL);
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={light(cool, "volt", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la barra del 111 se desploma y deja un hueco ══════════════════════ */}
        {acto === 1 && (() => {
          const dropP = clamp01((f - 5) / 30);
          const h = eio(H111, H44, dropP);
          const dropE = interpolate(dropP, [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
          const money = Math.round(lerp(111, 44, dropE));
          const fill = clamp01((f - 25) / 24);
          const write = clamp01((f - 37) / 22);
          const barTop = FLOOR - h;
          const barCol = light(dropP, "amber", "volt");
          return (
            <>
              <Plane z={-560}><PhotoPlane src={M.facturaF} kind="photo" z={0} scale={1.34} dim={0.72} tint={V.volt} /></Plane>

              {/* EL HUECO: se llena de voltio DESDE ABAJO (lo que te queda entra desde abajo) */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: `${BAR_X}%`, top: HOLE_TOP, width: BAR_W, height: H111 - H44,
                  marginLeft: -BAR_W / 2,
                  background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.9)} 100%)`,
                  borderLeft: `1px solid ${rgba(V.volt, 0.16)}`, borderRight: `1px solid ${rgba(V.volt, 0.16)}`,
                }} />
                <div style={{
                  position: "absolute", left: `${BAR_X}%`, top: HOLE_BOT - (H111 - H44) * fill,
                  width: BAR_W, height: (H111 - H44) * fill, marginLeft: -BAR_W / 2,
                  background: `linear-gradient(0deg, ${rgba(V.volt, 0.42)} 0%, ${rgba(V.volt, 0.1)} 62%, rgba(0,0,0,0) 100%)`,
                  boxShadow: `inset 0 -2px 0 ${rgba(V.volt, 0.9)}, 0 0 60px ${rgba(V.volt, 0.34 * fill)}`,
                }} />
              </Plane>

              {/* LA BARRA: hormigón con la luz de su valor lamiéndole el canto de arriba */}
              <Plane z={0}>
                <div style={{
                  position: "absolute", left: `${BAR_X}%`, top: barTop, width: BAR_W, height: h, marginLeft: -BAR_W / 2,
                  background: `linear-gradient(180deg, ${rgba(barCol, 0.3)} 0%, ${rgba(V.ink2, 0.97)} 18%, ${rgba(V.ink1, 1)} 100%)`,
                  borderTop: `4px solid ${rgba(barCol, 0.95)}`,
                  boxShadow: `0 30px 70px ${rgba(V.ink0, 0.85)}, inset 0 0 70px ${rgba(V.ink0, 0.64)}, inset -18px 0 34px ${rgba(V.ink0, 0.7)}`,
                }}>
                  {/* el canto lateral: la barra tiene ESPESOR, no es un rectángulo */}
                  <div style={{
                    position: "absolute", right: -16, top: 6, width: 16, height: Math.max(0, h - 6),
                    background: `linear-gradient(180deg, ${rgba(barCol, 0.16)}, ${rgba(V.ink0, 0.98)})`,
                    transform: "skewY(-9deg)", transformOrigin: "left top",
                  }} />
                </div>
                {/* la marca de dónde estaba: la línea del año pasado se queda (es el eje) */}
                <div style={{
                  position: "absolute", left: `${BAR_X - 13}%`, top: HOLE_TOP, width: 700, height: 2,
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0)}, ${rgba(V.sky, 0.72)} 18%, ${rgba(V.sky, 0.72)} 82%, ${rgba(V.sky, 0)})`,
                }} />
                <AxisTag text="Hace un año" x={BAR_X - 13} y={pc(HOLE_TOP - 30)} color={rgba(V.sky, 0.9)} p={1} />
                <AxisTag text="Este mes" x={BAR_X + 15} y={pc(HOLE_BOT + 34)} color={rgba(V.volt, 0.9)} p={clamp01((f - 30) / 12)} />
              </Plane>

              {/* el dinero cae pegado al canto de la barra */}
              <Plane z={180}>
                <Ticker text={`$${money}`} x={BAR_X} y={pc(barTop - 62)} size={126} color={barCol} />
                {/* EL 60 % SE ESCRIBE SOLO, adentro del hueco */}
                <div style={{
                  position: "absolute", left: `${BAR_X}%`, top: `${pc(HOLE_Y).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", clipPath: `inset(0 ${((1 - write) * 100).toFixed(1)}% 0 0)`,
                }}>
                  <Num size={148} color={V.volt}>60 %</Num>
                </div>
                {write > 0 && write < 1 && (
                  <div style={{
                    position: "absolute", left: `${(BAR_X - 8.6 + 17.2 * write).toFixed(2)}%`, top: `${pc(HOLE_Y).toFixed(2)}%`,
                    width: 5, height: 128, marginTop: -64, background: rgba(V.volt, 0.95),
                    boxShadow: `0 0 24px ${rgba(V.volt, 0.9)}`,
                  }} />
                )}
              </Plane>

              {/* MATERIAL REAL: la factura de la que salió el número */}
              <Plane z={260}>
                <MediaCard src={M.facturaV} kind="video" w={470} h={290} x={70} y={eio(58, 47, clamp01(f / 26))} z={0}
                  ry={-13} rx={2} startFrom={14} lit={1} litColor={V.amber} label="LA FACTURA" sheenAt={toCF(12)} radius={10} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · el hueco es el portón: la caja se cargó sola de noche ═════════════ */}
        {acto === 3 && (() => {
          // EL BARRIDO ÚNICO: el reloj y la barra de carga se mueven con la MISMA p
          const sweep = clamp01((f - 16) / 132);
          const sweepE = interpolate(sweep, [0, 1], [0, 1], { easing: Easing.bezier(0.32, 0.02, 0.2, 1) });
          const mins = lerp(60, 390, sweepE);
          const hh = Math.floor(mins / 60), mm = Math.floor(mins % 60);
          const hora = `${hh}:${mm < 10 ? "0" : ""}${mm}`;
          const open = clamp01(f / 22);
          const lampOff = clamp01((f - 4) / 26);
          // la barra de carga, en px de la comp: pegada al canto izquierdo de la tarjeta de la caja
          const gX = 0.68 * 1920 - 290 - 48, gTop = 0.56 * 1080 - 174, gH = 348;
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.garajeF} kind="photo" z={0} scale={1.3} dim={0.8} tint={V.sky} /></Plane>

              {/* el HUECO del acto 1, acostado: la franja fría de calle bajo el portón entreabierto */}
              <Plane z={-320}>
                <div style={{
                  position: "absolute", left: "50%", top: 690, height: 26,
                  width: eio(BAR_W, 1620, open), marginLeft: eio(-BAR_W / 2, -810, open),
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0)}, ${rgba(V.sky, 0.85)} 10%, ${rgba(V.sky, 0.85)} 90%, ${rgba(V.sky, 0)})`,
                  boxShadow: `0 0 90px ${rgba(V.sky, 0.6)}`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: 716, height: 210,
                  width: eio(BAR_W, 1620, open), marginLeft: eio(-BAR_W / 2, -810, open),
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.22)} 0%, rgba(0,0,0,0) 100%)`,
                }} />
                {/* la caja gris, como sombra en la pared del fondo: es una SOMBRA, va en vector */}
                <div style={{
                  position: "absolute", left: 1120, top: 452, width: 460, height: 268, borderRadius: 12,
                  background: rgba(V.ink0, 0.86), filter: "blur(16px)", opacity: 0.8,
                }} />
              </Plane>

              {/* la lámpara desnuda se apaga: queda sólo la franja de calle */}
              <Plane z={-80}>
                <IconPng src={M.icFoco} x={50} y={9} size={124} z={0} opacity={0.24 + 0.5 * (1 - lampOff)} glow={V.ink0} />
                <div style={{
                  position: "absolute", left: "50%", top: 118, width: 620, height: 420, marginLeft: -310,
                  background: `radial-gradient(60% 100% at 50% 0%, ${rgba(V.amber, 0.2 * (1 - lampOff))} 0%, rgba(0,0,0,0) 72%)`,
                }} />
              </Plane>

              {/* MATERIAL REAL 1: el reloj de pared corriendo */}
              <Plane z={80}>
                <MediaCard src={M.relojV} kind="video" w={404} h={252} x={25} y={40} z={0}
                  ry={11} rx={1.5} startFrom={10} lit={0.9} litColor={V.sky} sheenAt={toCF(18)} radius={10} />
                {/* el barrido de la hora sobre el reloj: es un indicador, va en vector */}
                <svg width={220} height={220} viewBox="0 0 220 220"
                  style={{ position: "absolute", left: "25%", top: "40%", marginLeft: -110, marginTop: -110 }}>
                  <circle cx={110} cy={110} r={92} fill="none" stroke={rgba(V.ink0, 0.7)} strokeWidth={7} />
                  <circle cx={110} cy={110} r={92} fill="none" stroke={V.volt} strokeWidth={7} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sweepE}
                    transform="rotate(-90 110 110)" style={{ filter: `drop-shadow(0 0 16px ${rgba(V.volt, 0.8)})` }} />
                </svg>
                <Ticker text={hora} x={25} y={pc(0.4 * 1080 + 178)} size={92} color={V.sky} />
              </Plane>

              {/* MATERIAL REAL 2: la caja gris cargándose sola en la madrugada */}
              <Plane z={140}>
                <MediaCard src={M.cajaCargaV} kind="video" w={580} h={348} x={68} y={56} z={0}
                  ry={-9} rx={1.2} startFrom={8} lit={1} litColor={V.volt} sheenAt={toCF(34)} radius={10} />
                {/* LA BARRA, ahora de canto: la de carga. Se llena con el MISMO barrido del reloj. */}
                <div style={{
                  position: "absolute", left: gX, top: gTop, width: 26, height: gH,
                  background: `linear-gradient(180deg, ${rgba(V.ink2, 0.95)}, ${rgba(V.ink0, 1)})`,
                  border: `1px solid ${rgba(V.volt, 0.3)}`, borderRadius: 4,
                }} />
                <div style={{
                  position: "absolute", left: gX + 3, top: gTop + gH - (gH - 6) * sweepE,
                  width: 20, height: (gH - 6) * sweepE,
                  background: `linear-gradient(0deg, ${rgba(V.volt, 0.95)} 0%, ${rgba(V.volt, 0.5)} 100%)`,
                  boxShadow: `0 0 30px ${rgba(V.volt, 0.7)}`, borderRadius: 3,
                }} />
                <Ticker text={`${Math.round(sweepE * 100)} %`} x={xp(gX + 13)} y={pc(gTop - 44)} size={62} color={V.volt} />
              </Plane>

              <Plane z={260}>
                <div style={{
                  position: "absolute", left: "50%", top: "88%", transform: "translate(-50%,-50%)",
                  opacity: clamp01((f - 58) / 14),
                }}>
                  <Kick color={V.bone}>MIENTRAS YO DORMÍA</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · los 67 dólares se parten en dos caminos ═══════════════════════════ */}
        {acto === 4 && (() => {
          const stand = clamp01(f / 20);
          const peel = eio(0, 1, clamp01((f - 10) / 34));
          const billIn = clamp01((f - 6) / 28);
          const poleIn = clamp01((f - 20) / 24);
          const pockIn = clamp01((f - 26) / 24);
          const warm = clamp01((f - 54) / 64);
          const cold = clamp01((f - 66) / 64);
          const bx = 15, bW = 232, bH = H44 * eio(0.06, 1, stand);
          // los dos caminos, en px de la comp
          const wa = qbez(eio(0, 1, warm), 1046, 556, 1268, 764, 1466, 828);
          const co = qbez(eio(0, 1, cold), 1046, 432, 1252, 296, 1466, 244);
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.garajeF} kind="photo" z={0} scale={1.4} dim={0.84} tint={V.sky} /></Plane>
              {/* la caja gris sigue estando: la MISMA sombra en la pared que en el acto 3 */}
              <Plane z={-300}>
                <div style={{
                  position: "absolute", left: 1120, top: 452, width: 460, height: 268, borderRadius: 12,
                  background: rgba(V.ink0, 0.86), filter: "blur(18px)", opacity: 0.7,
                }} />
              </Plane>

              {/* LA BARRA vuelve a encenderse, de pie, en su valor de 44 */}
              <Plane z={0}>
                <div style={{
                  position: "absolute", left: `${bx}%`, top: FLOOR - bH, width: bW, height: bH, marginLeft: -bW / 2,
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.34)} 0%, ${rgba(V.ink2, 0.97)} 20%, ${rgba(V.ink1, 1)} 100%)`,
                  borderTop: `4px solid ${rgba(V.volt, 0.95)}`,
                  boxShadow: `0 26px 62px ${rgba(V.ink0, 0.85)}, 0 0 70px ${rgba(V.volt, 0.2 * stand)}, inset -16px 0 30px ${rgba(V.ink0, 0.7)}`,
                }} />
                <AxisTag text="Este mes" x={bx} y={pc(FLOOR + 36)} color={rgba(V.volt, 0.9)} p={stand} />
              </Plane>

              {/* el 60 % SE DESPEGA de la barra y sube a su sitio */}
              <Plane z={220}>
                <Ticker text="60 %" x={lerp(bx, 14.5, peel)} y={lerp(pc(FLOOR - H44 - 54), 20, peel)}
                  size={200} color={V.volt} scale={lerp(0.42, 1, peel)} />
                {peel > 0.86 && (
                  <div style={{
                    position: "absolute", left: "14.5%", top: "29%", transform: "translate(-50%,-50%)",
                    opacity: clamp01((peel - 0.86) / 0.14),
                  }}>
                    <Kick color={V.bone}>MENOS EN LA FACTURA</Kick>
                  </div>
                )}
              </Plane>

              {/* LOS DOS CAMINOS: esto es un gráfico (dos flechas), va en vector */}
              <Plane z={60}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d="M 1046 556 Q 1268 764 1466 828" fill="none" stroke={V.amber} strokeWidth={6} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((f - 46) / 40)}
                      style={{ filter: `drop-shadow(0 0 20px ${rgba(V.amber, 0.7)})` }} />
                    <path d="M 1046 432 Q 1252 296 1466 244" fill="none" stroke={V.sky} strokeWidth={5} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((f - 58) / 40)}
                      style={{ filter: `drop-shadow(0 0 16px ${rgba(V.sky, 0.55)})` }} />
                  </svg>
                </AbsoluteFill>
              </Plane>

              {/* MATERIAL REAL: la factura (de donde sale), el bolsillo (abajo, cálido), el poste (arriba, frío) */}
              <Plane z={140}>
                <MediaCard src={M.facturaF} kind="photo" w={470} h={290} x={47} y={eio(62, 46, billIn)} z={0}
                  ry={6} rx={1.6} lit={1} litColor={V.amber} label="LA FACTURA" sheenAt={toCF(20)} radius={10} />
                <MediaCard src={M.posteV} kind="video" w={356} h={222} x={eio(96, 80, poleIn)} y={20} z={0}
                  ry={-14} startFrom={20} lit={0.85} litColor={V.sky} label="LA COMPAÑÍA" sheenAt={toCF(40)} radius={8} />
                <MediaCard src={M.bolsilloF} kind="photo" w={356} h={222} x={eio(96, 80, pockIn)} y={78} z={0}
                  ry={-12} lit={1} litColor={V.amber} label="MI BOLSILLO" sheenAt={toCF(52)} radius={8} />
              </Plane>

              {/* el dinero viajando: la moneda + la cifra, una por camino */}
              <Plane z={300}>
                {warm > 0 && (
                  <>
                    <IconPng src={M.icMoneda} x={xp(wa.x - 74)} y={pc(wa.y - 31)} size={62} z={0} opacity={0.95} glow={V.amber} />
                    <Ticker text="$67" x={xp(wa.x + 30)} y={pc(wa.y)} size={78} color={V.amber} />
                  </>
                )}
                {cold > 0 && (
                  <>
                    <IconPng src={M.icMoneda} x={xp(co.x - 70)} y={pc(co.y - 27)} size={54} z={0} opacity={0.5} glow={V.ink0} />
                    <Ticker text="$67" x={xp(co.x + 28)} y={pc(co.y)} size={66} color={V.sky} opacity={0.62} />
                  </>
                )}
              </Plane>
            </>
          );
        })()}
      </Layers>

      {/* ═══ ACTO 2 · el interior del hueco: 0,25 s de negro absoluto, sin objeto y sin fundido ══ */}
      {acto === 2 && <AbsoluteFill style={{ background: "#000000" }} />}
    </AbsoluteFill>
  );
};
