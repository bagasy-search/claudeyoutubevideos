// MovBateria.tsx — S10 · LA BATERÍA BARATA ES LA CARA: cien en la caja, la mitad en la mano.
// Video `cmesodimac` (Claudio Mendoza Constructor). 5 actos · 1860 frames @30 (62 s). ms0 1.020.460.
//
// LA ESPINA: la de plomo dice cien amperes hora, pero sólo se le puede sacar la mitad y aguanta
// cuatrocientos ciclos. Doscientos cuarenta kilovatios hora de vida, ochenta y cinco dólares:
// treinta y cinco centavos cada kilovatio guardado. La compañía te lo vende a diecisiete. La de
// litio, seis coma seis. La que cuesta el doble sale cinco veces más barata.
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | ENTRA (cám / luz / materia)                 | SALE (cám / luz / materia)
//  1   |    0 →  340 | z +60, panX 0 · volt keyFrom .46 · MADERA   | z +40 · volt · LA ETIQUETA
//      |             | (la tapa que llega de MovEscalones)         | plateada llenando el cuadro
//  2   |  340 →  720 | z +40 · volt · salimos del zoom en el vidrio| z +14 · volt · LA GOMA del cable
//  3   |  720 → 1120 | z +14 · volt keyFrom .40 · goma negra       | z −10 · volt · EL DISCO de ciclos
//  4   | 1120 → 1500 | z −10 · volt+ámbar (el dinero entra)        | z −28 · volt bajo · LAS MONEDAS
//  5   | 1500 → 1860 | z −28 · volt bajo (beat)                    | z −40, panX +65 · volt keyFrom .34
//      |             |                                             | LA GOMA DEL CABLE (ink2) → sigue
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=340   ZOOM-THROUGH · la cámara entra POR LA ETIQUETA de la batería (fx 44, fy 57) y sale
//              adentro del vaso que se llena. El acto 1 se va con `z.out`, nunca con opacidad.
//  2→3 f=720   OCLUSIÓN V.ink2 · la goma negra del cable cruza (+ su alma de cobre). Materia OSCURA:
//              el Stage le SUBE la luminancia al cubrir, por eso no hace fundido a negro.
//  3→4 f=1120  MATCH-SHAPE · el DISCO del contador de ciclos (misma instancia: diámetro, x, y por
//              `disco(g)`) se encoge hasta ser LA MONEDA de arriba de la pila. Nunca se remonta.
//  4→5 f=1500  CORTE EN EL BEAT · SeamFlash V.volt dur 5 sobre "ahora la otra".
//  5→out       OCLUSIÓN V.ink2 · la goma del cable vuelve a cruzar y tapa el 100 % exactamente en
//              g=1860: ahí arranca el movimiento siguiente. (Es la costura pedida en el handoff.)
//
// ⛔ cero Math.random · cero Date.now · cero backdrop-filter · cero rgba() a mano · cero Easing.quint
// ⛔ V.danger NO se usa en este tramo. Dinero en V.amber, medición en V.volt.
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamFlash, zoomThrough, Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ ─────────────────────────────────────────────────────────────────────────────────
const END = 1860;
const A2 = 340, A3 = 720, A4 = 1120, A5 = 1500;

const F_ZT = A2 - 20;                    // ZOOM-THROUGH: termina justo en la frontera
const F_OCL = A3 - 7;                    // OCLUSIÓN de la goma: cobertura total en g=720
const MS0 = A4 - 62, MS1 = A4 + 44;      // ventana del MATCH-SHAPE disco → moneda
const F_BEAT = A5;                       // CORTE EN EL BEAT
const F_OUT = END - 8;                   // OCLUSIÓN de salida: cubre el 100 % en g=1860

const EI = Easing.bezier(0.4, 0, 0.24, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// ── EL MATERIAL REAL (⛔ rutas LITERALES, jamás por template literal) ─────────────────────────
const M = {
  plomoF: "img/cmesodimac/cmes_mv_bate1.jpg",     // la de plomo sobre el tablón, etiqueta plateada
  monedasF: "img/cmesodimac/cmes_mv_bate4.jpg",   // las columnas de monedas sobre la mesa de taller
  duoF: "img/cmesodimac/cmes_mv_bate5.jpg",       // el bloque de litio al lado de la de plomo
  vasoV: "broll/cmesodimac/cmes_mv_bate2.mp4",    // el líquido llenando hasta la mitad y parando
  bornesV: "broll/cmesodimac/cmes_mv_bate3.mp4",  // la pinza cocodrilo conectando y desconectando
  icBateria: "img/cmesodimac/cmes_ic_bateria.png",
  icMoneda: "img/cmesodimac/cmes_ic_moneda.png",
  icMedidor: "img/cmesodimac/cmes_ic_medidor.png",
  icCalculadora: "img/cmesodimac/cmes_ic_calculadora.png",
  icReloj: "img/cmesodimac/cmes_ic_reloj.png",
};

// ── LA CÁMARA · una sola función de g, monótona, que nunca vuelve a cero ──────────────────────
const travelXAt = (g: number) => interpolate(
  g, [0, A2, A2 + 220, A3, A3 + 240, A4, A4 + 260, A5, END],
  [30, -26, -6, 44, 20, -36, -12, 40, 78], { ...cl, easing: EI },
);
const travelYAt = (g: number) => interpolate(
  g, [0, A2, A3, A3 + 220, A4, A5, END],
  [-18, 16, -22, -6, 20, -8, -28], { ...cl, easing: EI },
);
const pushAt = (g: number) => interpolate(
  g, [0, 110, F_ZT, A2, A2 + 150, A3, A3 + 200, A4, A4 + 170, A5, A5 + 170, END],
  [1.08, 1.0, 1.14, 1.14, 1.0, 1.05, 1.0, 1.07, 1.0, 1.09, 1.0, 1.05], { ...cl, easing: EI },
);
const camAt = (g: number) => {
  const base = gcam(g, { z0: 60, z1: -40, panX: 65, panY: -26, ry: -4, rx: -2.8, dur: END });
  return base.transform + " translate(" + travelXAt(g).toFixed(1) + "px, " + travelYAt(g).toFixed(1) + "px) scale(" + pushAt(g).toFixed(3) + ")";
};

// ── LA LUZ · el voltio manda y baja de a poco (volt .46 → volt bajo .34), el ámbar es el dinero ─
const tintAt = (g: number) => light(LN(g, 0, END), "volt", "voltSoft");
const tint2At = (g: number) => (g < A4 ? light(LN(g, 0, A4), "torch", "amber") : V.amber);

// ── EL DISCO DE CICLOS → LA MONEDA · la geometría que cruza la frontera 3→4 (MATCH-SHAPE) ─────
const disco = (g: number) => {
  const t = eio(0, 1, LN(g, MS0, MS1));
  return {
    t,
    d: lerp(430, 132, t),          // diámetro
    x: lerp(74, 24.5, t),
    y: lerp(44, 58, t),
  };
};

// ── LA GEOMETRÍA CON LA QUE ABRE EL MOVIMIENTO ────────────────────────────────────────────────
// ⭐ Es EXACTAMENTE la que deja MovEscalones al final de su MATCH-SHAPE (w 980 · h 560 · x 50 · y 52
// · rot 0): la tarjeta no aparece, YA ESTABA — sólo cambia lo que tiene adentro y se acomoda.
const abre = (g: number) => {
  const t = ES(g, 24, 150);
  return { w: lerp(980, 1120, t), h: lerp(560, 630, t), x: lerp(50, 45, t), y: lerp(52, 50, t), ry: lerp(0, -5, t) };
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = camAt(g);
  const zt = zoomThrough(g, F_ZT, 20, 44, 57);
  const D = disco(g);
  const AB = abre(g);

  const keyFrom = interpolate(g, [0, A2, A3, A4, A5, END], [0.46, 0.44, 0.40, 0.38, 0.36, 0.34], { ...cl, easing: EI });
  const inten = interpolate(g, [0, A2, A3, A4, A5, END], [1.0, 1.02, 0.98, 1.0, 0.94, 0.9], { ...cl, easing: EI });
  const piso = interpolate(g, [0, A2, A3, A4, END], [0.58, 0.58, 0.60, 0.62, 0.62], { ...cl, easing: EI });

  // el contador de ciclos: baja de 400 a 0 mientras la batería se descolora (acto 3)
  const gasto = ES(g, A3 + 70, A3 + 300);
  const ciclos = Math.round(lerp(400, 0, gasto));

  const leerShift = "translate(" + (travelXAt(g) * 0.08).toFixed(1) + "px, " + (travelYAt(g) * 0.08).toFixed(1) + "px)";

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ═══ LA ATMÓSFERA — montada UNA vez, jamás se remonta entre actos ═══════════════════ */}
      <VoltAtmos tint={tintAt(g)} tint2={tint2At(g)} keyFrom={keyFrom} intensity={inten} floor={piso} />

      {/* ═══ EL MUNDO 3D ═══════════════════════════════════════════════════════════════════ */}
      <Layers cam={cam}>
        {/* LA CAMA · el tablón. Cambia UNA vez, tapada por la OCLUSIÓN de la goma (g 720) */}
        <Plane z={-520}>
          {g < A3 - 6
            ? <PhotoPlane src={M.duoF} kind="photo" z={0} scale={1.34} dim={0.62} tint={V.volt} />
            : <PhotoPlane src={M.monedasF} kind="photo" z={0} scale={1.26} dim={0.58} tint={V.amber} />}
        </Plane>

        <Plane z={0}>
          {/* ── ACTO 1 · cien amperes hora, dice la caja (sale POR la etiqueta) ───────────── */}
          {g < A2 + 10 && (
            <div style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
              transform: zt.out === "none" ? undefined : zt.out, opacity: zt.opacity, transformStyle: "preserve-3d",
            }}>
              <MediaCard
                src={M.plomoF} kind="photo"
                w={AB.w} h={AB.h} x={AB.x} y={AB.y} z={0}
                ry={AB.ry} radius={12} lit={0.92} litColor={V.volt} sheenAt={40}
                label="DE PLOMO, DE CICLO PROFUNDO" />
              <IconPng src={M.icBateria} x={82} y={26} size={104} z={170} opacity={0.85 * ES(g, 60, 130)} glow={V.ink0} />
            </div>
          )}

          {/* ── ACTO 2 · sólo la mitad se puede usar ──────────────────────────────────────── */}
          {g > A2 - 24 && g < A3 + 20 && (() => {
            const p = ES(g, A2, A2 + 80);
            const corte = ES(g, A2 + 140, A2 + 210);
            const sale = ES(g, A3 - 60, A3);
            return (
              <>
                <MediaCard
                  src={M.vasoV} kind="video"
                  w={lerp(1120, 900, corte)} h={lerp(630, 506, corte)}
                  x={lerp(50, 40, corte)} y={lerp(50, 49, corte)} z={-20}
                  ry={lerp(0, 6, corte)} radius={12}
                  lit={0.7 + 0.25 * p} litColor={V.volt} sheenAt={A2 + 60}
                  opacity={p * (1 - sale * 0.4)} label="SE LLENA Y SE PARA" />
                {/* LA LÍNEA DE LA MITAD: esto SÍ es un gráfico (mide), por eso va en vector */}
                <div style={{
                  position: "absolute", left: "10%", right: "10%", top: "50%", height: 4,
                  opacity: corte * (1 - sale),
                  background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, " + rgba(V.volt, 0.95) + " 14%, " + rgba(V.volt, 0.95) + " 86%, rgba(0,0,0,0) 100%)",
                  boxShadow: "0 0 26px " + rgba(V.volt, 0.5),
                }} />
                <div style={{
                  position: "absolute", left: "10%", right: "10%", top: "50%", bottom: "14%",
                  opacity: 0.55 * corte * (1 - sale),
                  backgroundImage: "repeating-linear-gradient(-42deg, " + rgba(V.ink2, 0.85) + " 0 12px, rgba(0,0,0,0) 12px 26px)",
                }} />
                <IconPng src={M.icBateria} x={80} y={70} size={96} z={170} opacity={0.8 * p * (1 - sale)} glow={V.ink0} />
              </>
            );
          })()}

          {/* ── ACTO 3 · cuatrocientos ciclos (el disco es la MISMA instancia que la moneda) ─ */}
          {g > A3 - 26 && g < A4 + 80 && (() => {
            const p = ES(g, A3, A3 + 70);
            const salida = ES(g, A4 - 20, A4 + 70);
            return (
              <>
                <MediaCard
                  src={M.bornesV} kind="video"
                  w={980} h={552} x={lerp(40, 34, D.t)} y={50} z={-10}
                  ry={5} radius={12} startFrom={16}
                  lit={lerp(0.95, 0.5, gasto)} litColor={V.volt} sheenAt={A3 + 50}
                  opacity={p * (1 - salida)} label="CONECTA, DESCONECTA, CONECTA" />
                {/* EL DISCO: el contador de ciclos. Gráfico puro (mide), y la materia que cruza. */}
                <div style={{
                  position: "absolute", left: D.x + "%", top: D.y + "%",
                  width: D.d, height: D.d, marginLeft: -D.d / 2, marginTop: -D.d / 2,
                  borderRadius: "50%", opacity: clamp01(p * 1.2),
                  border: "3px solid " + rgba(V.volt, lerp(0.9, 0.35, D.t)),
                  background: "radial-gradient(circle at 42% 34%, " + rgba(V.volt, 0.12) + " 0%, rgba(0,0,0,0) 62%)",
                  boxShadow: "0 0 40px " + rgba(V.volt, 0.22 * (1 - D.t)) + ", inset 0 0 40px " + rgba(V.ink0, 0.6),
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ opacity: 1 - clamp01(D.t * 1.8), textAlign: "center" }}>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 122, lineHeight: 0.9, color: V.volt, textShadow: "0 6px 26px rgba(0,0,0,0.9)" }}>{String(ciclos)}</div>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 3.4, color: rgba(V.white, 0.7) }}>CICLOS QUE QUEDAN</div>
                  </div>
                </div>
                {/* la MONEDA nace exactamente en el disco: mismo centro, mismo diámetro */}
                {D.t > 0.1 && (
                  <IconPng src={M.icMoneda} x={D.x} y={D.y - D.d / 21.6} size={D.d} z={30} opacity={clamp01((D.t - 0.15) / 0.6)} glow={V.ink0} />
                )}
                <IconPng src={M.icReloj} x={16} y={24} size={84} z={170} opacity={0.7 * p * (1 - salida)} glow={V.ink0} />
              </>
            );
          })()}

          {/* ── ACTO 4 · treinta y cinco centavos por kilovatio guardado ──────────────────── */}
          {g > A4 - 10 && g < A5 + 40 && (() => {
            const p = ES(g, A4 + 20, A4 + 110);
            const sale = ES(g, A5 - 40, A5);
            return (
              <>
                <MediaCard
                  src={M.monedasF} kind="photo"
                  w={860} h={500} x={lerp(66, 62, p)} y={48} z={-10}
                  ry={-6} rot={1.2} radius={12}
                  lit={0.86} litColor={V.amber} sheenAt={A4 + 90}
                  opacity={p * (1 - sale)} label="LO QUE TE COSTO CADA KILOVATIO" />
                <MediaCard
                  src={M.plomoF} kind="photo"
                  w={360} h={224} x={19} y={30} z={150}
                  ry={12} rot={-2} radius={10}
                  lit={0.6} litColor={V.volt} sheenAt={A4 + 160}
                  opacity={p * (1 - sale)} label="85 DOLARES" />
                <IconPng src={M.icMedidor} x={19} y={72} size={112} z={170} opacity={0.85 * clamp01(ES(g, A4 + 210, A4 + 280)) * (1 - sale)} glow={V.ink0} />
                <IconPng src={M.icCalculadora} x={33} y={20} size={72} z={170} opacity={0.6 * p * (1 - sale)} glow={V.ink0} />
              </>
            );
          })()}

          {/* ── ACTO 5 · seis coma seis: la que cuesta el doble sale cinco veces más barata ── */}
          {g > A5 - 30 && (() => {
            const p = ES(g, A5, A5 + 90);
            return (
              <>
                <MediaCard
                  src={M.duoF} kind="photo"
                  w={1180} h={664} x={lerp(52, 48, p)} y={50} z={-20}
                  ry={lerp(0, 4, p)} radius={12}
                  lit={0.9} litColor={V.volt} sheenAt={A5 + 50}
                  opacity={p} label="MISMO TAMAÑO, UN TERCIO DEL PESO" />
                <IconPng src={M.icMoneda} x={17} y={30} size={92} z={170} opacity={0.8 * p} glow={V.ink0} />
              </>
            );
          })()}
        </Plane>
      </Layers>

      {/* ═══ LA CAPA DE LECTURA · fuera del mundo 3D ════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: leerShift }}>

        {/* ACTO 1 · lo que dice la caja. EL 100 SIEMPRE EN ÁMBAR (es la promesa, no la medición). */}
        {g < A2 + 10 && (() => {
          const p = ES(g, 60, 130);
          const out = ES(g, F_ZT, A2);
          if (p <= 0) return null;
          return (
            <div style={{ opacity: p * (1 - out) }}>
              <div style={{ position: "absolute", left: "6.5%", bottom: "13%" }}>
                <Bed pad={30} w={720}>
                  <Kick color={V.amber}>LO QUE DICE LA CAJA</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={54}>Ochenta y cinco dólares. Y <Em color={V.amber}>suena a muchísimo</Em>.</Head>
                  </div>
                </Bed>
              </div>
              <Readout value="100" unit="Ah" label="en la etiqueta" at={110} x={77} y={62} size={150} color={V.amber} />
            </div>
          );
        })()}

        {/* ACTO 2 · sólo la mitad. LA MEDICIÓN EN VOLTIO. */}
        {g > A2 + 40 && g < A3 + 10 && (() => {
          const out = ES(g, A3 - 50, A3);
          return (
            <div style={{ opacity: 1 - out }}>
              <div style={{ position: "absolute", left: "6.5%", top: "12%" }}>
                <Bed pad={26} w={560}>
                  <Kick color={V.volt}>A UNA DE PLOMO</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={52}>No le puedes sacar más de la mitad, o se te muere en meses.</Head>
                  </div>
                </Bed>
              </div>
              <Readout value="50" unit="Ah" label="lo que de verdad podes usar" at={A2 + 175} x={76} y={70} size={144} color={V.volt} />
            </div>
          );
        })()}

        {/* ACTO 3 · cuatrocientos ciclos → doscientos cuarenta kilovatios hora de vida */}
        {g > A3 + 30 && g < A4 + 30 && (() => {
          const out = ES(g, A4 - 30, A4 + 20);
          return (
            <div style={{ opacity: 1 - out }}>
              <div style={{ position: "absolute", left: "6.5%", bottom: "14%" }}>
                <Bed pad={28} w={700}>
                  <Kick color={V.volt}>CUATROCIENTOS CICLOS</Kick>
                  <div style={{ marginTop: 6 }}>
                    <Body size={32}>Cada carga y descarga se le descuenta de la vida. Y no vuelven.</Body>
                  </div>
                </Bed>
              </div>
              <Readout value="240" unit="kWh" label="toda su vida, de punta a punta" at={A3 + 320} x={30} y={22} size={128} color={V.volt} />
            </div>
          );
        })()}

        {/* ACTO 4 · 35 centavos contra los 17 de la compañía. LOS DOS SON DINERO → ÁMBAR. */}
        {g > A4 + 30 && g < A5 + 20 && (() => {
          const out = ES(g, A5 - 30, A5);
          const comp = clamp01(ES(g, A4 + 250, A4 + 310));
          return (
            <div style={{ opacity: 1 - out }}>
              <Readout value="35" unit="¢" label="cada kWh que paso por ella" at={A4 + 120} x={62} y={26} size={162} color={V.amber} />
              <div style={{ position: "absolute", left: "6.5%", bottom: "15%", opacity: comp, transform: "translateY(" + ((1 - comp) * 20).toFixed(1) + "px)" }}>
                <Bed pad={26} w={620}>
                  <Kick color={V.white}>TU COMPAÑÍA DE LUZ TE LO VENDE A</Kick>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                    <Num size={112} color={V.amber}>17</Num>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, color: rgba(V.amber, 0.8) }}>¢</div>
                  </div>
                  <Body size={30}>Guardarla en esa batería sale el doble que comprarla.</Body>
                </Bed>
              </div>
            </div>
          );
        })()}

        {/* ACTO 5 · seis coma seis */}
        {g > A5 + 10 && (() => {
          const p = ES(g, A5 + 20, A5 + 90);
          const salida = ES(g, END - 70, END - 10);
          return (
            <div style={{ opacity: p * (1 - salida) }}>
              <div style={{ position: "absolute", left: "6.5%", top: "12%" }}>
                <Bed pad={28} w={680}>
                  <Kick color={V.volt}>LA DE LITIO — CIENTO OCHENTA DÓLARES</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={54}>La que cuesta el doble sale <Em color={V.amber}>cinco veces más barata</Em> por cada kilovatio guardado.</Head>
                  </div>
                </Bed>
              </div>
              <Readout value="6,6" unit="¢" label="cada kWh guardado" at={A5 + 150} x={74} y={72} size={170} color={V.amber} />
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* ═══ LAS COSTURAS ══════════════════════════════════════════════════════════════════ */}

      {/* 2→3 y salida · OCLUSIÓN con LA GOMA DEL CABLE (V.ink2) + su alma de cobre */}
      <SeamOcclude at={F_OCL} dur={14} color={V.ink2} angle={-8} />
      <SeamOcclude at={F_OUT} dur={16} color={V.ink2} angle={7} />
      {[F_OCL, F_OUT].map((at, i) => {
        const p = clamp01((g - at) / (i === 0 ? 14 : 16));
        if (p <= 0 || p >= 1) return null;
        return (
          <AbsoluteFill key={i} style={{ overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", top: lerp(48, 54, p).toFixed(1) + "%", left: lerp(-180, 180, p).toFixed(1) + "%",
              width: "300%", height: 9, transform: i === 0 ? "rotate(-8deg)" : "rotate(7deg)",
              background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, " + rgba(V.copper, 0.85) + " 24%, " + rgba(V.copper, 0.85) + " 76%, rgba(0,0,0,0) 100%)",
              boxShadow: "0 0 24px " + rgba(V.copper, 0.5),
            }} />
          </AbsoluteFill>
        );
      })}

      {/* 4→5 · CORTE EN EL BEAT (3-6 cuadros en screen · NO es un fade) */}
      <SeamFlash at={F_BEAT} color={V.volt} dur={5} />

      {/* el grano: la misma piel de imagen en los cinco actos */}
      <AbsoluteFill style={{
        opacity: 0.05, pointerEvents: "none", mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(102deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 5px)",
      }} />

      {/* SFX (3) · el tic del contador, la goma que cruza, el remate de la cifra */}
      <Sequence from={A3 + 70} durationInFrames={110} layout="none">
        <Audio src={staticFile("sfx/digit_tick.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={F_OCL - 4} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={A5 + 145} durationInFrames={44} layout="none">
        <Audio src={staticFile("sfx/sfx_chime.mp3")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovBateria: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;                                   // acto={0} = "dibujá el movimiento entero"
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);     // adentro, useCurrentFrame() === gFrame
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
