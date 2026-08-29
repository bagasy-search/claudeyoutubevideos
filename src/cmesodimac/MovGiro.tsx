// MovGiro.tsx — S9 · EL REENCUADRE: este equipo no compite contra tu factura, compite contra el apagón.
// Video `cmesodimac` (Claudio Mendoza Constructor). 4 actos · 1680 frames @30 (56 s). ms0 760.860.
//
// LA ESPINA: lo que gastas cada vez que se corta la luz (pilas, nafta, incomodidad) y la batería que
// se muere de estar quieta. Contra ESO se mide el equipo — no contra la boleta.
//
// ⛔⛔ EL ACTO 1 TAPA EL SALTO DEL BUCLE DEL AVATAR (el mp4 real termina en 761,133 s y vuelve a
// empezar en 761,483 s ≈ g10 de este movimiento). Por eso el acto 1 es, POR GUION, la casa a oscuras:
// cobertura OPACA del 100 % del cuadro desde g=0 — cuatro capas independientes, ninguna con entrada
// suave (ver la nota "COBERTURA TOTAL" abajo del wrapper).
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | ENTRA (cám / luz / materia)                  | SALE (cám / luz / materia)
//  1   |    0 →  340 | z +40, panX 0 · amber frío · PAPEL (la boleta| z −6, panX −6 · torch · EL HAZ
//      |             | de MovFactura, ya apagada) · CUADRO NEGRO    | de la linterna abierto en la pared
//  2   |  340 →  760 | z −6 · torch pleno, keyFrom .20 · el haz     | z −60 · torch+amber · LA CHAPA
//      |             | convertido en la tarjeta del gasto           | del bidón entrando por izquierda
//  3   |  760 → 1140 | z −60 · torch · chapa del bidón              | z −118 · torch+volt · las tres
//      |             |                                              | canastas contra la línea ámbar
//  4   | 1140 → 1680 | z −118 · torch+volt (beat)                   | z −180, panX −30 · torch · EL PANEL
//      |             |                                              | apoyado en la rueda → MovEscalones
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=340   MATCH-SHAPE  · el rectángulo del HAZ (w/h/x/y/rot/radius por `haz(g)`) es LA MISMA
//              instancia que la tarjeta del gasto: el vidrio aparece dentro del haz mientras el haz
//              se apaga. Nunca se remonta, nunca hay opacidad de cuadro de por medio.
//  2→3 f=760   OCLUSIÓN V.steel · la chapa del bidón de nafta cruza (+ su asa oscura) y detrás ya
//              están las tres canastas apiladas.
//  3→4 f=1140  CORTE EN EL BEAT · SeamFlash V.volt dur 5 sobre "un segundo trabajo".
//  4→out       MATCH-MOVE · rail de 2150 px al mundo de la derecha (el patio de noche: el panel
//              apoyado en la rueda de la camioneta). La cama viaja al 18 % (parallax) → MovEscalones.
//
// ⛔ cero Math.random · cero Date.now · cero backdrop-filter · cero rgba() a mano · cero Easing.quint
// ⛔ V.danger NO se usa en este tramo. Dinero en V.amber, medición en V.volt.
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamFlash, Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ ─────────────────────────────────────────────────────────────────────────────────
const END = 1680;
const A2 = 340, A3 = 760, A4 = 1140;

const MS0 = A2 - 78, MS1 = A2 + 54;      // ventana del MATCH-SHAPE (el haz → la tarjeta)
const F_OCL = A3 - 7;                    // OCLUSIÓN: cobertura total exacta en g=760
const F_BEAT = A4;                       // CORTE EN EL BEAT
const RAIL0 = END - 108, RAIL1 = END;    // MATCH-MOVE de salida
const WX = 2150;                         // el mundo 2 vive montado a +2150 px

const EI = Easing.bezier(0.4, 0, 0.24, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// ── EL MATERIAL REAL (⛔ rutas LITERALES, jamás por template literal) ─────────────────────────
const M = {
  camaF: "img/cmesodimac/cmes_mv_giro2.jpg",     // el piso del garaje: pilas, bidón y linterna
  patioF: "img/cmesodimac/cmes_mv_giro5.jpg",    // el panel apoyado en la rueda de la camioneta
  casaV: "broll/cmesodimac/cmes_mv_giro1.mp4",   // interior a oscuras + la linterna que se enciende
  genV: "broll/cmesodimac/cmes_mv_giro3.mp4",    // el generador chico andando de noche
  camV: "broll/cmesodimac/cmes_mv_giro4.mp4",    // la camioneta bajo la lona, cable al capó
  icFoco: "img/cmesodimac/cmes_ic_foco.png",
  icNafta: "img/cmesodimac/cmes_ic_nafta.png",
  icBidon: "img/cmesodimac/cmes_ic_bidon.png",
  icCamioneta: "img/cmesodimac/cmes_ic_camioneta.png",
  icBateria: "img/cmesodimac/cmes_ic_bateria.png",
  icCalendario: "img/cmesodimac/cmes_ic_calendario.png",
  icPanel: "img/cmesodimac/cmes_ic_panelsolar.png",
};

// ── LA CÁMARA · una sola función de g, monótona, que nunca vuelve a cero ──────────────────────
const travelXAt = (g: number) => interpolate(
  g, [0, A2, A2 + 160, A3, A3 + 220, A4, A4 + 260, END],
  [0, -34, -12, 44, 18, -30, -66, -96], { ...cl, easing: EI },
);
const travelYAt = (g: number) => interpolate(
  g, [0, A2, A3, A3 + 240, A4, A4 + 300, END],
  [26, -4, -30, -12, 22, 4, -18], { ...cl, easing: EI },
);
const pushAt = (g: number) => interpolate(
  g, [0, 90, A2 - 40, A2, A2 + 130, A3, A3 + 180, A4 - 60, A4, A4 + 140, RAIL0, END],
  [1.14, 1.06, 1.13, 1.13, 1.0, 1.03, 1.0, 1.09, 1.09, 1.0, 1.02, 1.06], { ...cl, easing: EI },
);
const railAt = (g: number) => -WX * ES(g, RAIL0, RAIL1);
const camAt = (g: number) => {
  const base = gcam(g, { z0: 40, z1: -180, panX: -30, panY: -34, ry: 0, rx: -1.6, dur: END });
  return base.transform + " translate(" + travelXAt(g).toFixed(1) + "px, " + travelYAt(g).toFixed(1) + "px) scale(" + pushAt(g).toFixed(3) + ")";
};

// ── LA LUZ · arranca en el ámbar frío de la boleta y cae a la NOCHE (tramo D del escenario) ───
const tintAt = (g: number) => (g < A2 ? light(LN(g, 0, A2), "amber", "torch") : V.torch);
const tint2At = (g: number) => light(LN(g, A2, END), "amber", "volt");

// ── EL HAZ · la geometría que cruza la frontera 1→2 (MATCH-SHAPE, una sola instancia) ─────────
const haz = (g: number) => {
  const t = eio(0, 1, LN(g, MS0, MS1));
  const barrido = Math.sin(g / 61) * 3.4 + Math.sin(g / 23) * 0.8;   // la mano no está quieta
  return {
    t,
    w: lerp(1060, 726, t),
    h: lerp(680, 436, t),
    x: lerp(43 + barrido * (1 - t), 31.5, t),
    y: lerp(45.5, 45, t),
    rot: lerp(-13, -2.4, t),
    radius: Math.round(lerp(300, 16, t)),
  };
};

// ── LAS CANASTAS · el gasto de cada apagón apilándose contra el precio del equipo ─────────────
const canasta = (g: number, i: number) => {
  const at = A3 + 70 + i * 96;
  const p = eio(0, 1, LN(g, at, at + 46));
  return { p, y: lerp(78, 63 - i * 13.5, p), op: clamp01(p * 1.6) };
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = camAt(g);
  const rail = railAt(g);
  const H = haz(g);

  // la atmósfera: UNA sola vez, parámetros continuos (tramo D — noche, la linterna es la key)
  const keyFrom = interpolate(g, [0, A2, A3, A4, END], [0.36, 0.20, 0.18, 0.18, 0.22], { ...cl, easing: EI });
  const inten = interpolate(g, [0, 60, A2, A3, A4, END], [0.62, 0.80, 0.96, 0.94, 1.0, 0.98], { ...cl, easing: EI });
  const piso = interpolate(g, [0, A2, A3, END], [0.62, 0.72, 0.72, 0.66], { ...cl, easing: EI });

  // ⛔ COBERTURA TOTAL DEL ACTO 1: el apagón. Opaco de verdad en g=0 y sube a la luz de la linterna.
  const apagon = interpolate(g, [0, 14, 46, 110, 210], [1, 0.97, 0.72, 0.42, 0.3], { ...cl, easing: EI });
  const camaDim = interpolate(g, [0, 120, A2, A3, END], [0.9, 0.62, 0.54, 0.5, 0.56], { ...cl, easing: EI });

  // la capa de lectura respira un 8 % del recorrido de la cámara y se retira durante el rail
  const leerShift = "translate(" + (travelXAt(g) * 0.08).toFixed(1) + "px, " + (travelYAt(g) * 0.08).toFixed(1) + "px)";
  const leerOp = 1 - ES(g, RAIL0 - 10, RAIL0 + 46);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ═══ LA ATMÓSFERA — montada UNA vez, jamás se remonta entre actos ═══════════════════ */}
      <VoltAtmos tint={tintAt(g)} tint2={tint2At(g)} keyFrom={keyFrom} intensity={inten} floor={piso} />

      {/* ═══ EL MUNDO 3D ═══════════════════════════════════════════════════════════════════ */}
      <Layers cam={cam}>
        {/* LA CAMA (siempre, en todos los actos) · viaja al 18 % del rail: parallax de fondo */}
        <Plane z={-520} style={{ transform: "translateZ(-520px) translate3d(" + (rail * 0.18).toFixed(1) + "px,0,0)" }}>
          <PhotoPlane src={M.camaF} kind="photo" z={0} scale={1.24} dim={camaDim} tint={V.torch} />
        </Plane>

        {/* EL MUNDO DE LOS OBJETOS · lleva el rail entero (MATCH-MOVE de salida) */}
        <Plane z={0} style={{ transform: "translateZ(0px) translate3d(" + rail.toFixed(1) + "px,0,0)" }}>

          {/* ── ACTO 1 · la casa a oscuras y la linterna que se enciende ───────────────────── */}
          {g < A2 + 90 && (() => {
            const entra = clamp01((g - 8) / 40);
            const sale = ES(g, A2 - 40, A2 + 80);
            return (
              <MediaCard
                src={M.casaV} kind="video"
                w={lerp(1720, 1180, sale)} h={lerp(968, 664, sale)}
                x={lerp(50, 66, sale)} y={lerp(50, 52, sale)} z={lerp(-140, -60, sale)}
                ry={lerp(0, -7, sale)} rx={0} radius={lerp(6, 14, sale)}
                lit={0.55 + 0.4 * entra} litColor={V.torch}
                sheenAt={96} grade opacity={1 - sale * 0.55}
                label={g > 120 && g < A2 - 20 ? "SE CORTO LA LUZ" : undefined}
              />
            );
          })()}

          {/* ── EL HAZ → LA TARJETA DEL GASTO · LA MISMA instancia cruza la frontera 1→2 ───── */}
          {g > 44 && g < A3 + 40 && (
            <>
              {/* el haz: luz, no materia (por eso es vector) */}
              <div style={{
                position: "absolute", left: H.x + "%", top: H.y + "%",
                width: H.w, height: H.h, marginLeft: -H.w / 2, marginTop: -H.h / 2,
                transform: "rotate(" + H.rot.toFixed(2) + "deg)",
                borderRadius: H.radius,
                opacity: clamp01((1 - H.t * 1.55) * clamp01((g - 44) / 34)),
                background: "radial-gradient(58% 62% at 50% 50%, " + rgba(V.torch, 0.5) + " 0%, " + rgba(V.torch, 0.19) + " 44%, rgba(0,0,0,0) 78%)",
                mixBlendMode: "screen",
              }} />
              {/* la tarjeta que NACE adentro del haz: el gasto de cada apagón, material real */}
              <MediaCard
                src={M.genV} kind="video"
                w={H.w} h={H.h} x={H.x} y={H.y} z={40}
                rot={H.rot * 0.35} ry={lerp(0, 5, H.t)} radius={H.radius}
                lit={0.5 + 0.5 * H.t} litColor={V.torch}
                sheenAt={A2 + 34} startFrom={12}
                opacity={clamp01((H.t - 0.22) / 0.5)}
                label={H.t > 0.9 ? "DOS HORAS DE GENERADOR" : undefined}
              />
            </>
          )}

          {/* ── ACTO 2 · la segunda tarjeta del gasto + los objetos que se compran de apuro ── */}
          {g > A2 + 40 && g < A3 + 20 && (() => {
            const p = ES(g, A2 + 46, A2 + 130);
            const salida = ES(g, A3 - 70, A3);
            return (
              <>
                <MediaCard
                  src={M.casaV} kind="video"
                  w={lerp(430, 470, p)} h={lerp(270, 296, p)}
                  x={lerp(78, 74.5, p)} y={lerp(34, 32.5, p)} z={130}
                  ry={-11} rx={2} rot={1.6} radius={12} startFrom={54}
                  lit={0.5 + 0.45 * p} litColor={V.torch} sheenAt={A2 + 120}
                  opacity={p * (1 - salida * 0.5)} label="PILAS PARA LA LINTERNA" />
                <IconPng src={M.icNafta} x={70} y={66} size={lerp(60, 96, p)} z={180} opacity={0.92 * p} glow={V.ink0} />
                <IconPng src={M.icFoco} x={87} y={57} size={72} z={180} opacity={0.8 * p} glow={V.ink0} />
              </>
            );
          })()}

          {/* ── ACTO 3 · tres canastas apiladas contra el precio del equipo ─────────────────── */}
          {g > A3 - 24 && g < A4 + 70 && (() => {
            const salida = ES(g, A4 - 40, A4 + 60);
            const fuentes = [
              { src: M.genV, from: 4, label: "APAGON 1" },
              { src: M.casaV, from: 70, label: "APAGON 2" },
              { src: M.genV, from: 96, label: "APAGON 3" },
            ];
            return (
              <>
                {fuentes.map((f, i) => {
                  const c = canasta(g, i);
                  if (c.p <= 0) return null;
                  return (
                    <MediaCard
                      key={i}
                      src={f.src} kind="video"
                      w={620} h={172} x={39} y={c.y} z={20 + i * 46}
                      ry={7} rx={2} rot={-1.4 + i * 0.9} radius={10} startFrom={f.from}
                      lit={0.55 + 0.14 * i} litColor={V.torch} sheenAt={A3 + 96 + i * 96}
                      opacity={c.op * (1 - salida)} label={f.label} />
                  );
                })}
                {/* la LÍNEA del precio: esto SÍ es un gráfico (mide), por eso va en vector */}
                <div style={{
                  position: "absolute", left: "8%", right: "8%", top: "47.5%", height: 4,
                  opacity: clamp01(ES(g, A3 + 40, A3 + 96) * (1 - salida)),
                  background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, " + rgba(V.amber, 0.95) + " 12%, " + rgba(V.amber, 0.95) + " 88%, rgba(0,0,0,0) 100%)",
                  boxShadow: "0 0 22px " + rgba(V.amber, 0.55),
                }} />
                <IconPng src={M.icBidon} x={76} y={72} size={128} z={150} opacity={0.9 * clamp01(ES(g, A3 + 60, A3 + 130) * (1 - salida))} glow={V.ink0} />
              </>
            );
          })()}

          {/* ── ACTO 4 · la batería que se muere de estar quieta ───────────────────────────── */}
          {g > A4 - 26 && (() => {
            const p = ES(g, A4, A4 + 90);
            const chico = ES(g, A4 + 250, A4 + 340);
            return (
              <>
                <MediaCard
                  src={M.camV} kind="video"
                  w={lerp(1700, 1120, chico)} h={lerp(956, 630, chico)}
                  x={lerp(50, 38, chico)} y={lerp(50, 51, chico)} z={lerp(-120, -20, chico)}
                  ry={lerp(0, 6, chico)} radius={lerp(8, 14, chico)}
                  lit={0.6 + 0.35 * p} litColor={V.torch} sheenAt={A4 + 40}
                  opacity={p} label={chico > 0.85 ? "LA QUE SE MUERE DE ESTAR QUIETA" : undefined} />
                <IconPng src={M.icCamioneta} x={82} y={30} size={104} z={170} opacity={0.9 * chico} glow={V.ink0} />
                <IconPng src={M.icCalendario} x={91} y={44} size={72} z={170} opacity={0.7 * chico} glow={V.ink0} />
                <IconPng src={M.icBateria} x={86} y={64} size={88} z={170} opacity={0.8 * chico} glow={V.ink0} />
              </>
            );
          })()}

          {/* ── EL MUNDO 2 (a +2150 px) · el patio de noche: el panel apoyado en la rueda ──── */}
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: "translate3d(" + WX + "px,0,0)", transformStyle: "preserve-3d" }}>
            <MediaCard
              src={M.patioF} kind="photo"
              w={1560} h={880} x={50} y={50} z={-40}
              ry={-3} radius={10} lit={0.86} litColor={V.torch} sheenAt={RAIL0 + 40}
              label="EL PANEL, DE NOCHE, EN EL PATIO" />
            <IconPng src={M.icPanel} x={22} y={24} size={96} z={150} opacity={0.85 * ES(g, RAIL0 + 30, END)} glow={V.ink0} />
          </div>
        </Plane>
      </Layers>

      {/* ⛔⛔ COBERTURA TOTAL DEL ARRANQUE — el salto del bucle del avatar cae acá (≈ g10).
          Esta capa es OPACA (alpha 1) en g=0 y no tiene entrada: el apagón empieza a oscuras. */}
      {g < 230 && (
        <AbsoluteFill style={{ backgroundColor: V.ink0, opacity: apagon, pointerEvents: "none" }} />
      )}

      {/* ═══ LA CAPA DE LECTURA · fuera del mundo 3D (la perspectiva la agrandaría) ═════════ */}
      <AbsoluteFill style={{ transform: leerShift, opacity: leerOp }}>

        {/* ACTO 1 · la idea del giro. Una sola idea de texto. */}
        {g < A2 + 40 && (() => {
          const p = ES(g, 96, 168);
          const out = ES(g, A2 - 46, A2 + 30);
          if (p <= 0) return null;
          return (
            <div style={{
              position: "absolute", left: "6.5%", bottom: "13%", opacity: p * (1 - out),
              transform: "translateY(" + ((1 - p) * 26).toFixed(1) + "px)",
            }}>
              <Bed pad={30} w={880}>
                <Kick color={V.torch}>EL GIRO</Kick>
                <div style={{ marginTop: 10 }}>
                  <Head size={66}>No compite contra tu factura.</Head>
                  <Head size={66} color={V.torch}>Compite contra <Em color={V.volt}>el apagón</Em>.</Head>
                </div>
              </Bed>
            </div>
          );
        })()}

        {/* ACTO 2 · lo que se te va cada vez. EL DINERO EN ÁMBAR. */}
        {g > A2 + 60 && g < A3 + 10 && (() => {
          const out = ES(g, A3 - 60, A3);
          return (
            <div style={{ opacity: 1 - out }}>
              <div style={{ position: "absolute", left: "6.5%", top: "12%" }}>
                <Bed pad={26} w={560}>
                  <Kick color={V.torch}>CADA VEZ QUE SE CORTA</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Body size={31}>Pilas, nafta del generador, y cosas que compras nada más que por incomodidad.</Body>
                  </div>
                </Bed>
              </div>
              <Readout value="20-30" unit="US$" label="lo que se te va en cada apagon"
                at={A2 + 190} x={26} y={76} size={126} color={V.amber} />
            </div>
          );
        })()}

        {/* ACTO 3 · en el tercer apagón ya te lo pagaste. */}
        {g > A3 + 20 && g < A4 + 30 && (() => {
          const out = ES(g, A4 - 40, A4 + 20);
          return (
            <div style={{ opacity: 1 - out }}>
              <Readout value="110" unit="US$" label="lo que sale el equipo"
                at={A3 + 44} x={78} y={41} size={132} color={V.amber} />
              <div style={{ position: "absolute", left: "6.5%", bottom: "12%" }}>
                <Bed pad={28} w={760}>
                  <Head size={58}>En el <Em color={V.volt}>tercer apagón</Em> ya te lo pagaste.</Head>
                </Bed>
              </div>
            </div>
          );
        })()}

        {/* ACTO 4 · el segundo trabajo: la batería quieta. */}
        {g > A4 + 30 && (() => {
          const p = ES(g, A4 + 60, A4 + 140);
          const cierre = ES(g, A4 + 360, A4 + 430);
          return (
            <>
              <div style={{ position: "absolute", left: "6.5%", top: "11%", opacity: p }}>
                <Bed pad={28} w={640}>
                  <Kick color={V.volt}>EL SEGUNDO TRABAJO</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={54}>Mantener viva la batería que se muere de estar quieta.</Head>
                  </div>
                </Bed>
              </div>
              <Readout value="120-180" unit="US$" label="lo que sale una bateria de auto"
                at={A4 + 175} x={76} y={72} size={106} color={V.amber} />
              {cierre > 0 && (
                <div style={{
                  position: "absolute", right: "6.5%", top: "16%", opacity: cierre, textAlign: "right",
                  transform: "translateY(" + ((1 - cierre) * 20).toFixed(1) + "px)",
                }}>
                  <Bed pad={24} w={520}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 12 }}>
                      <Num size={88} color={V.volt}>2-3</Num>
                      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2.4, color: V.white }}>AÑOS</div>
                    </div>
                    <Body size={29}>Se te muere por quedarse quieta, no por uso.</Body>
                  </Bed>
                </div>
              )}
            </>
          );
        })()}
      </AbsoluteFill>

      {/* ═══ LAS COSTURAS · viven fuera del switch de actos para cruzar la frontera enteras ══ */}

      {/* 2→3 · OCLUSIÓN con LA CHAPA DEL BIDÓN (V.steel) — ⛔ nunca el color del fondo */}
      <SeamOcclude at={F_OCL} dur={14} color={V.steel} angle={-9} />
      {(() => {
        const p = clamp01((g - F_OCL) / 14);
        if (p <= 0 || p >= 1) return null;
        // el asa del bidón viajando dentro de la chapa: sin esto la oclusión se lee como un cartel
        return (
          <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", top: lerp(28, 34, p).toFixed(1) + "%", left: lerp(-180, 180, p).toFixed(1) + "%",
              width: "300%", height: 26, transform: "rotate(-9deg)",
              background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, " + rgba(V.ink1, 0.92) + " 24%, " + rgba(V.ink1, 0.92) + " 76%, rgba(0,0,0,0) 100%)",
            }} />
          </AbsoluteFill>
        );
      })()}

      {/* 3→4 · CORTE EN EL BEAT (3-6 cuadros en screen · NO es un fade) */}
      <SeamFlash at={F_BEAT} color={V.volt} dur={5} />

      {/* el grano de la noche sobre todo: la misma piel de imagen en los cuatro actos */}
      <AbsoluteFill style={{
        opacity: 0.05, pointerEvents: "none", mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(102deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 5px)",
      }} />

      {/* SFX (3) · el golpe del apagón, el clic de la linterna, el whoosh de la chapa */}
      <Sequence from={2} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_thump.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={46} durationInFrames={30} layout="none">
        <Audio src={staticFile("sfx/node_pop.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={F_OCL - 4} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovGiro: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;                                   // acto={0} = "dibujá el movimiento entero"
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);     // adentro, useCurrentFrame() === gFrame
  const g = Math.max(0, Math.min(END, gFrame));
  // ⛔⛔ CAPA CERO: opaca, fuera de la <Sequence>. Si el Main montara el movimiento con un `off`
  // positivo, la Sequence no dibujaría sus primeros cuadros y el salto del bucle del avatar
  // quedaría a la vista. Esto garantiza negro pleno desde el frame 0 pase lo que pase.
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <Sequence from={off} layout="none">
        <Escena g={g} />
      </Sequence>
    </AbsoluteFill>
  );
};
