// MovFactura.tsx — S8 · La cuenta que nadie hace: 1,58 al mes, 123 meses, y la batería se muere a los 48.
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                  | sale (cám / luz / materia)
//  1   |    0 →  320 | z=-80 panX-140 · volt · TORCH (la linterna)  | z≈-54 · volt · el disco del medidor
//  2   |  320 →  700 | z≈-54 · volt·ámbar · papel de la boleta      | z≈-16 · ámbar · PAPEL
//  3   |  700 → 1140 | z≈-16 · ámbar · hojas del calendario         | z≈+16 · ámbar frío · las hojas apiladas
//  4   | 1140 → 1620 | z≈+16 · ámbar frío · plomo de la batería     | z=+40 panX-90 · ámbar frío · PAPEL (la boleta)
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=320  ZOOM-THROUGH (la cámara entra por el disco del medidor)
//  2→3 f=700  OCLUSIÓN V.paper (la boleta cruzando el lente)
//  3→4 f=1140 MATCH-SHAPE (las 123 hojas del calendario se ordenan en la línea de los 123 meses)
//  4→   f=1602 OCLUSIÓN V.paper (la boleta vuelve a cruzar) → MovGiro
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 1620;                                  // 54 s × 30
const A2 = 320, A3 = 700, A4 = 1140;
const MESES = 123, MUERE = 48;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const VIS = (g: number, a: number, b: number, ei = 10, eo = 10) =>
  clamp01((g - a) / Math.max(1, ei)) * clamp01((b - g) / Math.max(1, eo));

/** EL DISCO del medidor: un eje que gira. Es un gráfico, así que va en vector. */
const Disco: React.FC<{ g: number; op: number }> = ({ g, op }) => {
  const a = (g * 1.25) % 360;
  return (
    <div style={{ position: "absolute", left: 1230, top: 300, width: 400, height: 400, opacity: op }}>
      <svg viewBox="0 0 400 400" width={400} height={400}>
        <circle cx={200} cy={200} r={150} stroke={rgba(V.white, 0.14)} strokeWidth={16} fill="none" />
        <circle cx={200} cy={200} r={150} stroke={rgba(V.volt, 0.5)} strokeWidth={4} fill="none" />
        <g transform={`rotate(${a.toFixed(2)} 200 200)`}>
          <rect x={194} y={44} width={12} height={44} rx={3} fill={V.volt} />
        </g>
        <circle cx={200} cy={200} r={118} fill={rgba(V.ink0, 0.72)} />
      </svg>
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: -80, z1: 40, panX: -90, panY: -18, ry: 3, rx: -2.8, dur: END });
  const key = light(ES(g, 0, END), "volt", "amber");       // voltio → ámbar FRÍO
  const kf = lerp(0.44, 0.3, LN(g, 0, END));

  const o1 = VIS(g, -40, A2, 1, 1);
  const o2 = VIS(g, A2 - 6, A3, 16, 12);
  const o3 = VIS(g, A3 - 6, A4 + 60, 12, 1);               // sigue vivo: sus hojas se vuelven la línea
  const o4 = VIS(g, A4 - 60, END + 40, 44, 1);

  const zt = zoomThrough(g, A2 - 20, 20, 76, 46);          // acto 1 SALE por el disco
  const m = ES(g, A4 - 44, A4 + 40);                       // MATCH-SHAPE hojas → línea de meses
  const linea = ES(g, A4 + 70, A4 + 320);                  // la línea se dibuja y se CORTA a la mitad
  const cortadas = linea * MESES;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos tint={V.volt} tint2={V.amber} keyFrom={kf} intensity={1} floor={0.6} />
      <Layers cam={cam.transform}>

        {/* la CAMA: la mesa de la cocina primero, el rincón del galpón después */}
        <Plane z={-520}>
          <AbsoluteFill style={{ opacity: 1 - o4 * 0.9 }}>
            <PhotoPlane src="img/cmesodimac/cmes_mv_fact2.jpg" dim={0.6} tint={V.amber} scale={1.2} />
          </AbsoluteFill>
          <AbsoluteFill style={{ opacity: o4 }}>
            <PhotoPlane src="img/cmesodimac/cmes_mv_fact4.jpg" dim={0.62} tint={V.amber} scale={1.18} />
          </AbsoluteFill>
        </Plane>

        {/* ── acto 1 · NUEVE COMA TRES KILOVATIOS HORA (sale por ZOOM-THROUGH al disco) ── */}
        <Plane z={-40}>
          <AbsoluteFill style={{ transform: zt.out === "none" ? undefined : zt.out, opacity: o1 * zt.opacity }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_fact1.mp4" kind="video"
              w={900} h={520} x={38} y={44} ry={6} lit={0.95} litColor={key}
              sheenAt={44} label="EL MEDIDOR DE LA CASA" />
            <Disco g={g} op={1} />
            <div style={{ position: "absolute", left: 112, top: 694, width: 900 }}>
              <Bed pad={26} w={900}>
                <Kick>LA CUENTA QUE NADIE HACE</Kick>
                <div style={{ height: 10 }} />
                <Head size={60}>Trescientos diez por día, por treinta días.</Head>
              </Bed>
            </div>
            <Readout value="9,3" unit="kWh" label="AL MES" at={120} x={76} y={78} size={132} color={V.volt} />
          </AbsoluteFill>
        </Plane>

        {/* ── acto 2 · UN DÓLAR CON CINCUENTA Y OCHO ── */}
        <Plane z={-60}>
          <MediaCard src="img/cmesodimac/cmes_mv_fact2.jpg" kind="photo"
            w={1080} h={620} x={52} y={46} ry={-4} lit={1} litColor={key}
            sheenAt={A2 + 46} opacity={o2} label="LA BOLETA, CON LO QUE AHORRA ENCIMA" />
        </Plane>
        <Plane z={160}>
          <IconPng src="img/cmesodimac/cmes_ic_moneda.png" x={17} y={28} size={104} opacity={o2 * 0.95} z={30} rot={-9} glow={V.amber} />
          <IconPng src="img/cmesodimac/cmes_ic_billete.png" x={84} y={62} size={128} opacity={o2 * 0.95} z={30} rot={7} glow={V.amber} />
          <div style={{ position: "absolute", left: 112, top: 120, width: 640, opacity: o2 }}>
            <Bed pad={24} w={640}>
              <Kick color={V.amber}>DIECISIETE CENTAVOS EL KILOVATIO HORA</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}>Lo que te ahorra por mes.</Head>
            </Bed>
          </div>
          <div style={{ opacity: o2 }}>
            <Readout value="1,58" unit="US$" label="AL MES · TODO EL AHORRO" at={A2 + 120} x={50} y={80} size={158} color={V.amber} />
          </div>
        </Plane>

        {/* ── acto 3 · CIENTO VEINTITRÉS MESES  ·  acto 4 · LA LÍNEA CORTADA (misma instancia) ── */}
        <Plane z={-30}>
          <MediaCard src="broll/cmesodimac/cmes_mv_fact3.mp4" kind="video"
            w={760} h={460} x={26} y={36} ry={8} lit={0.9} litColor={key}
            sheenAt={A3 + 40} opacity={o3 * (1 - m)} label="EL CALENDARIO NO PARA" />
          <MediaCard src="img/cmesodimac/cmes_mv_fact4.jpg" kind="photo"
            w={680} h={420} x={30} y={32} ry={7} lit={0.85} litColor={key}
            sheenAt={A4 + 60} opacity={o4 * m} label="LA BATERÍA BARATA" />
        </Plane>
        <Plane z={110}>
          {/* LAS 123 HOJAS: en el acto 3 son el calendario, en el 4 son la línea de los meses. */}
          {Array.from({ length: MESES }, (_, i) => {
            const col = i % 41, row = Math.floor(i / 41);
            const ax = 1020 + col * 20, ay = 430 + row * 46;
            const bx = 216 + i * 11.4, by = 646;
            const x = lerp(ax, bx, m), y = lerp(ay, by, m);
            const w = lerp(14, 8, m);
            const viva = i < cortadas;
            const muerta = i >= MUERE;
            const h = lerp(34, muerta ? 26 : 74, m);
            const col2 = muerta ? rgba(V.white, 0.16) : rgba(V.volt, 0.86);
            const op3 = o3 * (1 - m) * clamp01((g - (A3 + 40) - i * 2.4) / 10);
            const op4 = o4 * m * (viva ? 1 : 0.14);
            return (
              <div key={i} style={{
                position: "absolute", left: x, top: y - h, width: w, height: h,
                opacity: Math.max(op3, op4), borderRadius: 2,
                background: m > 0.5 ? col2 : rgba(V.amber, 0.7),
                boxShadow: m > 0.5 && !muerta ? `0 0 12px ${rgba(V.volt, 0.44)}` : "none",
              }} />
            );
          })}
          {/* el corte: donde la batería se muere, la línea se termina */}
          <div style={{
            position: "absolute", left: 216 + MUERE * 11.4, top: 470, width: 3, height: 200,
            opacity: o4 * m * clamp01((linea * MESES - MUERE) / 8),
            background: rgba(V.volt, 0.95), boxShadow: `0 0 22px ${rgba(V.volt, 0.6)}`,
          }} />
          <div style={{
            position: "absolute", left: 216, top: 660, width: (MESES - 1) * 11.4, height: 2,
            opacity: o4 * m * 0.5, background: rgba(V.white, 0.3),
          }} />
        </Plane>
        <Plane z={190}>
          <div style={{ position: "absolute", left: 112, top: 128, width: 620, opacity: o3 * (1 - m) }}>
            <Bed pad={24} w={620}>
              <Kick color={V.amber}>CIENTO NOVENTA Y CINCO, DIVIDIDOS POR UNO CINCUENTA Y OCHO</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}>Diez años y tres meses.</Head>
            </Bed>
          </div>
          <div style={{ opacity: o3 * (1 - m) }}>
            <Readout value="123" label="MESES PARA RECUPERARLO" at={A3 + 260} x={72} y={20} size={168} color={V.amber} />
          </div>
          <div style={{ opacity: o4 * m }}>
            <Readout value="48" unit="meses" label="Y LA BATERÍA BARATA SE MUERE A LOS" at={A4 + 150} x={62} y={22} size={150} color={V.volt} />
          </div>
          <div style={{ position: "absolute", left: 216, top: 700, width: 560, opacity: o4 * m }}>
            <Num size={64} color={V.volt}>48</Num>
            <Body size={26}>meses de vida de la batería.</Body>
          </div>
          <div style={{ position: "absolute", left: 1100, top: 700, width: 520, textAlign: "right", opacity: o4 * m * 0.7 }}>
            <Num size={64} color={V.amber}>123</Num>
            <Body size={26}>meses para recuperar la plata.</Body>
          </div>
          <div style={{ position: "absolute", left: 112, top: 820, width: 1300, opacity: o4 * ES(g, A4 + 230, A4 + 300) }}>
            <Bed pad={28} w={1300}>
              <Kick>COMO MÁQUINA DE BAJAR LA FACTURA</Kick>
              <div style={{ height: 10 }} />
              <Head size={66}>Este equipo no se paga nunca.</Head>
            </Bed>
          </div>
          <IconPng src="img/cmesodimac/cmes_ic_calendario.png" x={88} y={70} size={118} opacity={o3 * (1 - m) * 0.9} z={20} glow={V.amber} />
        </Plane>

      </Layers>

      {/* ── LAS COSTURAS ── */}
      <SeamOcclude at={A3 - 8} dur={16} color={V.paper} angle={9} />
      <SeamOcclude at={END - 18} dur={18} color={V.paper} angle={9} />

      <Sequence from={A2 - 24} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={A2 + 116} durationInFrames={50} layout="none">
        <Audio src={staticFile("sfx/sfx_chime.mp3")} volume={0.24} />
      </Sequence>
      <Sequence from={A3 + 40} durationInFrames={260} layout="none">
        <Audio src={staticFile("sfx/counter_up.mp3")} volume={0.22} />
      </Sequence>
      <Sequence from={A4 + 146} durationInFrames={30} layout="none">
        <Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.34} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovFactura: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
