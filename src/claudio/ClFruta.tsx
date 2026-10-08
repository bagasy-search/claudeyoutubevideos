// Kit de las MOSQUITAS (Claudio el Fumigador ep. 4 "Las mosquitas del frutero"), dentro del mundo (cama real + sombra + luz):
//   ClGlassTrap   "cone": corte del vaso con 2 dedos de vinagre de manzana + el cono de papel: entran por la punta siguiendo el olor y
//                 dan vueltas arriba sin encontrar el agujerito · "soap": sin detergente la mosquita se para y se va; con UNA gota se hunde
//   ClDrainFactory "cups": el vaso boca abajo sobre el desagüe, a la mañana 7 adentro · "larvae": corte del caño con la capa babosa y los
//                 gusanitos que se mueven (la fábrica) · "clean": agua caliente → cepillo → agua oxigenada que burbujea, la capa se va
//   ClFlyCycle    el plátano pasado: huevo → larva → mosquita en 8-10 días, el contador sube de 10 a cientos
// Todo con movimiento continuo (las mosquitas nunca paran: el auditor marca congelado >2,5 s).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 38 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);
const Note: React.FC<{ x: number; y: number; o: number; big: string; small: string; color?: string }> = ({ x, y, o, big, small, color = CL.red }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
    <Card style={{ padding: "14px 30px", borderBottom: `6px solid ${color}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, lineHeight: 1.05 }}>{big}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color }}>{small}</div>
    </Card>
  </div>
);
// la mosquita de la fruta (ojos rojos, alas que baten)
export const Fly: React.FC<{ x: number; y: number; s?: number; o?: number; f?: number; r?: number }> = ({ x, y, s = 1, o = 1, f = 0, r = 0 }) => {
  const w = Math.sin(f * 2.6) * 0.5 + 0.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      <ellipse cx={-2} cy={-8} rx={11} ry={5 + w * 3} fill="rgba(220,230,240,0.75)" stroke="#8A97A3" strokeWidth={1} transform="rotate(-25)" />
      <ellipse cx={4} cy={-8} rx={11} ry={5 + w * 3} fill="rgba(220,230,240,0.75)" stroke="#8A97A3" strokeWidth={1} transform="rotate(25)" />
      <ellipse cx={0} cy={2} rx={7} ry={11} fill="#B8863B" stroke="#3B2A12" strokeWidth={1.6} />
      <path d="M-6 4 h12 M-6 9 h12" stroke="#3B2A12" strokeWidth={1.6} />
      <circle cx={0} cy={-9} r={6} fill="#9A6A2A" stroke="#3B2A12" strokeWidth={1.4} />
      <circle cx={-4} cy={-10} r={3} fill="#C8261E" /><circle cx={4} cy={-10} r={3} fill="#C8261E" />
    </g>
  );
};
// enjambre que da vueltas alrededor de (cx, cy) dentro de un radio
const Swarm: React.FC<{ cx: number; cy: number; n: number; rx: number; ry: number; f: number; seed: number; s?: number; o?: number }> = ({ cx, cy, n, rx, ry, f, seed, s = 1.6, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i) * 6.28, sp = 0.02 + rnd(seed + i * 7) * 0.03, ph = a + f * sp * (i % 2 ? 1 : -1);
      const x = cx + Math.cos(ph) * rx * (0.4 + rnd(seed + i * 3) * 0.6) + Math.sin(f * 0.11 + i) * 10;
      const y = cy + Math.sin(ph * 1.3) * ry * (0.4 + rnd(seed + i * 5) * 0.6) + Math.cos(f * 0.13 + i) * 8;
      return <Fly key={i} x={x} y={y} s={s} f={f + i * 3} r={Math.sin(ph) * 30} />;
    })}
  </g>
);
const Banana: React.FC<{ x: number; y: number; s?: number; ripe?: number }> = ({ x, y, s = 1, ripe = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 -10 Q -40 90 150 -40 Q 160 -60 140 -58 Q -20 40 -140 -30 Z" fill="#E7C445" stroke={CL.ink} strokeWidth={4} />
    {Array.from({ length: Math.round(9 * ripe) }, (_, i) => <circle key={i} cx={-110 + i * 28} cy={6 + Math.sin(i) * 14} r={7 + (i % 3) * 3} fill="#4A3418" opacity={0.85} />)}
    <path d="M140 -58 l 22 -16" stroke="#5B4A20" strokeWidth={10} strokeLinecap="round" />
  </g>
);

// ───────────────── ClGlassTrap
export const ClGlassTrap: React.FC<{ mode?: "cone" | "soap"; bed?: string }> = ({ mode = "cone", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const GX = 960, TOP = 300, BOT = 900, W0 = 300, W1 = 230; // vaso en corte
  const LIQ = 790; // nivel del vinagre (2 dedos)
  const wob = Math.sin(f * 0.18) * 4;
  if (mode === "soap") {
    // izquierda: sin detergente, la mosquita se para y se va · derecha: con una gota, se hunde
    const k = (f % 90) / 90;
    const L = (cx: number, soap: boolean) => {
      const land = clamp01(k / 0.35), leave = clamp01((k - 0.5) / 0.35);
      const fy = soap ? LIQ - 60 + ease(land) * 60 + clamp01((k - 0.4) / 0.4) * 70 : LIQ - 60 + ease(land) * 54 - ease(leave) * 340;
      const fx = cx - 80 + land * 80 + (soap ? 0 : leave * 120);
      return (
        <g>
          <path d={`M${cx - 190} ${TOP + 120} L ${cx - 150} ${BOT} L ${cx + 150} ${BOT} L ${cx + 190} ${TOP + 120}`} fill="rgba(210,228,236,0.35)" stroke={CL.ink} strokeWidth={6} />
          <path d={`M${cx - 168} ${LIQ + wob} Q ${cx} ${LIQ - wob} ${cx + 168} ${LIQ + wob} L ${cx + 150} ${BOT - 4} L ${cx - 150} ${BOT - 4} Z`} fill="#C98A3A" opacity={0.85} />
          {soap && <g opacity={lin(f, 10, 20)}>{[0, 1, 2, 3].map((i) => <circle key={i} cx={cx - 60 + i * 40} cy={LIQ - 8 + Math.sin(f * 0.2 + i) * 3} r={6} fill="#F6F2E8" stroke="#BFB7A4" strokeWidth={1.5} />)}</g>}
          {!soap && <path d={`M${cx - 120} ${LIQ - 2} Q ${cx} ${LIQ - 16} ${cx + 120} ${LIQ - 2}`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.6} />}
          <Fly x={fx} y={fy} s={2.4} f={f} o={soap ? 1 - clamp01((k - 0.75) / 0.2) * 0.6 : 1} r={soap && k > 0.45 ? 60 : 0} />
        </g>
      );
    };
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={511} dim={0.55} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          {L(560, false)}{L(1360, true)}
        </svg>
        <Tag x={330} y={160} text="Sin detergente" color={CL.inkSoft} o={lin(f, 6, 14)} />
        <Tag x={1150} y={160} text="Con 1 gota" color={CL.nitrile} o={lin(f, 12, 20)} />
        <Note x={300} y={930} o={lin(f, T * 0.45, T * 0.55)} big="Se para y se va" small="" color={CL.inkSoft} />
        <Note x={1140} y={930} o={lin(f, T * 0.5, T * 0.6)} big="Se hunde" small="" color={CL.nitrile} />
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  // cono: las mosquitas entran por la punta y dan vueltas adentro sin salir
  const CONE_T = TOP + 20, TIP = 640;
  const inside = Math.min(9, Math.floor(f / 14));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={513} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <path d={`M${GX - W0} ${TOP} L ${GX - W1} ${BOT} L ${GX + W1} ${BOT} L ${GX + W0} ${TOP}`} fill="rgba(210,228,236,0.3)" stroke={CL.ink} strokeWidth={7} />
        <path d={`M${GX - 262} ${LIQ + wob} Q ${GX} ${LIQ - wob} ${GX + 262} ${LIQ + wob} L ${GX + W1 - 4} ${BOT - 4} L ${GX - W1 + 4} ${BOT - 4} Z`} fill="#C98A3A" opacity={0.85} />
        {/* el cono de papel, punta abajo, sin tocar el vinagre */}
        <path d={`M${GX - W0 - 30} ${CONE_T} L ${GX - 10} ${TIP} L ${GX + 10} ${TIP} L ${GX + W0 + 30} ${CONE_T} Z`} fill="#F4EFE2" stroke={CL.ink} strokeWidth={5} opacity={0.93} />
        <path d={`M${GX - 140} ${CONE_T + 40} L ${GX - 4} ${TIP - 10}`} stroke="#D9D1BE" strokeWidth={3} />
        {/* olor que sube */}
        {[0, 1, 2].map((i) => { const t = (f * 0.015 + i / 3) % 1; return <path key={i} d={`M${GX - 20 + i * 20} ${TIP - t * 330} q 12 -18 0 -36 q -12 -18 0 -36`} stroke="#C98A3A" strokeWidth={5} fill="none" opacity={(1 - t) * 0.7} />; })}
        {/* afuera: dan vueltas y bajan hacia la punta */}
        <Swarm cx={GX} cy={200} n={7} rx={420} ry={90} f={f} seed={21} s={1.8} />
        {Array.from({ length: 3 }, (_, i) => { const t = ((f + i * 30) % 90) / 90; return <Fly key={i} x={GX + Math.sin(t * 9 + i) * 40 * (1 - t)} y={CONE_T - 60 + t * (TIP - CONE_T + 90)} s={1.8} f={f + i} o={t < 0.95 ? 1 : 0} />; })}
        {/* adentro: chocan contra el vidrio buscando la luz */}
        <Swarm cx={GX} cy={TIP + 70} n={inside} rx={200} ry={40} f={f} seed={77} s={1.6} />
      </svg>
      <Tag x={GX + 330} y={TIP - 30} text="Punta = un lápiz" color={CL.navy} o={lin(f, 10, 18)} size={34} />
      <Tag x={GX + 330} y={LIQ - 10} text="2 dedos de vinagre" color={CL.nitrile} o={lin(f, 18, 26)} size={34} />
      <Note x={180} y={560} o={lin(f, T * 0.5, T * 0.6)} big="No encuentran" small="el agujerito" />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClDrainFactory
export const ClDrainFactory: React.FC<{ mode?: "cups" | "larvae" | "clean"; bed?: string }> = ({ mode = "larvae", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const PX = 960, PW = 260, PT = 380, PB = 1040; // el caño en corte
  if (mode === "cups") {
    // el vaso boca abajo sobre la rejilla: noche → mañana, van apareciendo mosquitas adentro
    const night = lin(f, 0, T * 0.35), n = Math.min(7, Math.floor(lin(f, T * 0.3, T * 0.75) * 7.99));
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={521} dim={0.5} />
        <AbsoluteFill style={{ background: `rgba(10,16,30,${0.45 * (1 - lin(f, T * 0.3, T * 0.45))})` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          <ellipse cx={PX} cy={820} rx={520} ry={120} fill="#C9CDD1" stroke={CL.ink} strokeWidth={6} />
          <ellipse cx={PX} cy={830} rx={110} ry={34} fill="#2B2B2B" stroke={CL.ink} strokeWidth={4} />
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={PX - 90 + i * 30} y1={808} x2={PX - 90 + i * 30} y2={852} stroke="#9EA4AA" strokeWidth={5} />)}
          {/* el vaso boca abajo */}
          <path d={`M${PX - 170} 840 L ${PX - 130} 440 L ${PX + 130} 440 L ${PX + 170} 840`} fill="rgba(215,232,240,0.28)" stroke={CL.ink} strokeWidth={6} />
          <ellipse cx={PX} cy={440} rx={130} ry={20} fill="rgba(215,232,240,0.4)" stroke={CL.ink} strokeWidth={4} />
          {Array.from({ length: n }, (_, i) => <Fly key={i} x={PX - 110 + ((i * 47) % 220) + Math.sin(f * 0.09 + i) * 12} y={520 + ((i * 83) % 260) + Math.cos(f * 0.07 + i) * 10} s={1.9} f={f + i * 5} r={i * 40 + f} />)}
        </svg>
        <Tag x={1240} y={300} text={night < 1 ? "La noche" : "A la mañana"} color={night < 1 ? CL.navy : CL.nitrile} o={lin(f, 4, 12)} />
        <Note x={1220} y={520} o={lin(f, T * 0.72, T * 0.8)} big={`${n} adentro`} small="salieron del desagüe" />
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  const clean = mode === "clean";
  const k = clamp01(f / (T * 0.85));
  const slimeK = clean ? 1 - ease(clamp01((k - 0.35) / 0.55)) : 1;
  const stage = !clean ? -1 : k < 0.3 ? 0 : k < 0.62 ? 1 : 2; // agua caliente · cepillo · agua oxigenada
  const brushY = PT + 120 + Math.abs(Math.sin(f * 0.25)) * 300;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={523} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* la pileta arriba y la rejilla */}
        <path d={`M${PX - 520} 200 L ${PX - 380} ${PT} L ${PX + 380} ${PT} L ${PX + 520} 200`} fill="#D3D7DA" stroke={CL.ink} strokeWidth={6} />
        <rect x={PX - PW / 2 - 30} y={PT - 14} width={PW + 60} height={22} rx={6} fill="#9EA4AA" stroke={CL.ink} strokeWidth={4} />
        {/* el caño en corte */}
        <rect x={PX - PW / 2} y={PT} width={PW} height={PB - PT} fill="#2E2A26" stroke={CL.ink} strokeWidth={8} />
        <rect x={PX - PW / 2 + 10} y={PT + 10} width={PW - 20} height={PB - PT - 20} fill="#4A443C" />
        {/* la capa babosa pegada a las paredes */}
        <g opacity={slimeK}>
          {[PX - PW / 2 + 10, PX + PW / 2 - 46].map((x, j) => (
            <path key={j} d={`M${x} ${PT + 20} ${Array.from({ length: 12 }, (_, i) => `q ${j ? -18 : 18} ${25} 0 ${50}`).join(" ")} h 36 V ${PT + 20} Z`} fill="#6B5226" opacity={0.95} />
          ))}
          {/* larvas que se retuercen */}
          {Array.from({ length: 14 }, (_, i) => {
            const side = i % 2, x = side ? PX + PW / 2 - 34 : PX - PW / 2 + 22, y = PT + 60 + ((i * 97) % (PB - PT - 120));
            const wv = Math.sin(f * 0.3 + i) * 6;
            return <path key={i} d={`M${x} ${y} q ${6 + wv} 8 0 16 q ${-6 - wv} 8 0 16`} stroke="#F3EEDD" strokeWidth={6} fill="none" strokeLinecap="round" />;
          })}
        </g>
        {/* las que salen */}
        {!clean && <Swarm cx={PX} cy={PT - 120} n={6} rx={200} ry={70} f={f} seed={41} s={1.7} />}
        {stage === 0 && Array.from({ length: 10 }, (_, i) => { const t = ((f * 0.03 + i / 10) % 1); return <path key={i} d={`M${PX - 60 + (i % 5) * 30} ${PT + t * 600} q 10 -20 0 -40`} stroke="#E8F2F8" strokeWidth={5} fill="none" opacity={0.7 * (1 - t)} />; })}
        {stage === 1 && <g transform={`translate(${PX} ${brushY})`}><rect x={-14} y={-360} width={28} height={360} rx={10} fill="#C46A3A" stroke={CL.ink} strokeWidth={4} />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={-90 + i * 20} y1={-10} x2={-90 + i * 20} y2={30} stroke="#F2E8D0" strokeWidth={6} />)}</g>}
        {stage === 2 && Array.from({ length: 26 }, (_, i) => { const t = ((f * 0.02 + rnd(i) ) % 1); return <circle key={i} cx={PX - PW / 2 + 30 + rnd(i * 3) * (PW - 60)} cy={PB - 60 - t * (PB - PT - 80)} r={6 + rnd(i * 5) * 10} fill="#FFFFFF" stroke="#CFE3EA" strokeWidth={2} opacity={0.85 * (1 - t)} />; })}
      </svg>
      {!clean && <Tag x={PX + 220} y={PT + 80} text="Capa babosa" color={CL.brown} o={lin(f, 8, 16)} size={34} />}
      {!clean && <Tag x={PX + 220} y={PT + 200} text="Larvas" color={CL.red} o={lin(f, 16, 24)} size={34} />}
      {!clean && <Note x={1240} y={720} o={lin(f, T * 0.5, T * 0.6)} big="La fábrica" small="dentro del desagüe" />}
      {clean && <Tag x={PX + 220} y={PT + 60} text={["1 · Agua bien caliente", "2 · Cepillo por dentro", "3 · Agua oxigenada"][Math.max(0, stage)]} color={stage === 2 ? CL.nitrile : CL.navy} o={1} size={34} />}
      {clean && <Note x={1240} y={720} o={lin(f, T * 0.75, T * 0.85)} big="3 noches" small="seguidas" color={CL.nitrile} />}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClFlyCycle
export const ClFlyCycle: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const k = clamp01(f / (T * 0.8));
  const day = Math.round(k * 10), count = Math.round(10 * Math.pow(30, ease(k)));
  const n = Math.min(60, 4 + Math.round(ease(k) * 56));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={531} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <Banana x={760} y={760} s={1.6} ripe={0.4 + k * 0.6} />
        {/* huevitos → larvas sobre la cáscara */}
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={600 + i * 38} cy={735 + Math.sin(i) * 10} rx={6} ry={3} fill="#FFF8E6" stroke="#B9A77A" strokeWidth={1} opacity={1 - lin(f, T * 0.25, T * 0.4)} />)}
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${600 + i * 38} ${730} q ${4 + Math.sin(f * 0.3 + i) * 4} 6 0 12`} stroke="#F3EEDD" strokeWidth={5} fill="none" strokeLinecap="round" opacity={lin(f, T * 0.25, T * 0.35) * (1 - lin(f, T * 0.5, T * 0.6))} />)}
        <Swarm cx={780} cy={420} n={n} rx={520} ry={220} f={f} seed={91} s={1.5} />
        {/* el reloj de días */}
        <g transform="translate(1560 330)">
          <circle r={150} fill="#FBF9F4" stroke={CL.ink} strokeWidth={8} />
          <path d={`M0 0 L 0 -150 A 150 150 0 ${k > 0.5 ? 1 : 0} 1 ${Math.sin(k * 6.283) * 150} ${-Math.cos(k * 6.283) * 150} Z`} fill={CL.nitrile} opacity={0.35} />
          <text x={0} y={22} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={84} fill={CL.ink}>{day}</text>
          <text x={0} y={80} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={32} fill={CL.inkSoft}>DÍAS</text>
        </g>
      </svg>
      <Tag x={420} y={900} text={k < 0.3 ? "Huevos" : k < 0.55 ? "Larvas" : "Mosquitas"} color={k < 0.55 ? CL.brown : CL.red} o={lin(f, 6, 14)} />
      <Note x={1330} y={560} o={lin(f, 10, 20)} big={`${count}`} small="mosquitas" />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
