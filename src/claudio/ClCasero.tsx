// Kit de las BOLITAS CASERAS (Claudio el Fumigador ep. 6 "Las bolitas de los restaurantes"), dentro del mundo (cama real + sombra + luz):
//   ClRoachHide    corte detrás de la estufa: la que ves corre afuera; adentro, apretadas en el cartón de huevos, muchas más y las cápsulas
//                  · "spray": la niebla del aerosol pega en la de afuera y no entra a la grieta · "bait": la bolita se come y se la llevan adentro
//   ClBoricBalls   1 parte de ácido bórico + 1 de harina + 1 de azúcar → chorrito de leche → masa → bolitas del tamaño de un garbanzo
//   ClRoachStation "station": la tapita cerrada con 2 agujeros de lápiz pegada detrás del mueble: la cucaracha entra, el hocico de Bruno no
//                  · "map": la cocina desde arriba con las 5 estaciones donde viven (estufa x2, fregadero, refrigerador, mueble de las ollas)
// Movimiento continuo siempre.
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
      {small ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color }}>{small}</div> : null}
    </Card>
  </div>
);
// la cucaracha grande vista desde arriba (r en grados, f = patas)
export const Roach: React.FC<{ x: number; y: number; r?: number; s?: number; o?: number; f?: number; dead?: boolean }> = ({ x, y, r = 0, s = 1, o = 1, f = 0, dead = false }) => {
  const w = dead ? 0 : Math.sin(f * 0.8) * 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      {[-12, 0, 12].map((lx, i) => <g key={i}><path d={`M${lx} 6 l ${-6 + (i % 2 ? w : -w)} 20`} stroke="#4A2412" strokeWidth={2.4} fill="none" /><path d={`M${lx} -6 l ${-6 + (i % 2 ? -w : w)} -20`} stroke="#4A2412" strokeWidth={2.4} fill="none" /></g>)}
      <ellipse cx={-6} cy={0} rx={30} ry={14} fill="#7A3A18" stroke="#3A1A0A" strokeWidth={2} />
      <path d="M-34 0 L 18 0" stroke="#5A2810" strokeWidth={1.5} />
      <ellipse cx={24} cy={0} rx={9} ry={11} fill="#A0602E" stroke="#3A1A0A" strokeWidth={2} />
      <path d={`M30 -4 q 30 ${-20 + w} 54 ${-10 + w} M30 4 q 30 ${20 - w} 54 ${10 - w}`} stroke="#4A2412" strokeWidth={1.6} fill="none" />
    </g>
  );
};
const Ooth: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}><rect x={-14} y={-7} width={28} height={14} rx={7} fill="#5A2E14" stroke="#2A140A" strokeWidth={1.5} />{[-8, -2, 4, 10].map((d, i) => <line key={i} x1={d} y1={-7} x2={d} y2={7} stroke="#3A1A0A" strokeWidth={1} />)}</g>
);
const Ball: React.FC<{ x: number; y: number; s?: number; o?: number; bit?: number }> = ({ x, y, s = 1, o = 1, bit = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle r={18} fill="#F1E6C8" stroke="#BFAE84" strokeWidth={2} />
    {bit > 0 && <circle cx={14} cy={-8} r={9 * bit} fill="#3A3226" />}
    <circle cx={-6} cy={-6} r={4} fill="#FFFDF4" />
  </g>
);

// ───────────────── ClRoachHide
export const ClRoachHide: React.FC<{ mode?: "hide" | "spray" | "bait"; bed?: string }> = ({ mode = "hide", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const SX = 380, SW = 620, FL = 900, GX = SX + SW, GW = 330; // estufa (frente) + hueco de atrás (grieta)
  const hidden = Array.from({ length: 14 }, (_, i) => ({ x: GX + 40 + rnd(i * 3) * (GW - 80), y: 320 + rnd(i * 5) * 520, r: rnd(i * 7) * 360 }));
  const run = (f % 120) / 120;
  const spray = mode === "spray", bait = mode === "bait";
  const mist = spray ? lin(f, T * 0.15, T * 0.3) * (1 - lin(f, T * 0.7, T * 0.85)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={701} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <rect x={160} y={FL} width={1600} height={40} fill="#B9AE9C" stroke={CL.ink} strokeWidth={5} />
        {/* la estufa */}
        <rect x={SX} y={300} width={SW} height={FL - 300} rx={10} fill="#F2F2EE" stroke={CL.ink} strokeWidth={7} />
        <rect x={SX + 40} y={420} width={SW - 80} height={300} rx={12} fill="#2E3236" stroke={CL.ink} strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={SX + 90 + i * 145} cy={350} r={22} fill="#C9CCCF" stroke={CL.ink} strokeWidth={4} />)}
        {/* el hueco de atrás en corte: grasa, cartón de huevos, cucarachas apretadas, cápsulas */}
        <rect x={GX} y={240} width={GW} height={FL - 240} fill="#2B2420" stroke={CL.ink} strokeWidth={6} />
        <path d={`M${GX + 20} ${FL - 20} q 80 -30 160 0 q 60 20 130 -6`} stroke="#8A6A2A" strokeWidth={14} fill="none" opacity={0.7} />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${GX + 30} ${FL - 230 - i * 70})`}><path d="M0 0 h 260 v 60 h -260 Z" fill="#C9B79A" stroke="#7E6A4E" strokeWidth={3} />{[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M${10 + j * 50} 60 q 20 -40 40 0`} fill="#B39F80" stroke="#7E6A4E" strokeWidth={2} />)}</g>)}
        {hidden.map((h, i) => <Roach key={i} x={h.x + Math.sin(f * 0.04 + i) * 6} y={h.y + Math.cos(f * 0.05 + i) * 5} r={h.r + Math.sin(f * 0.03 + i) * 8} s={0.9} f={f * 0.3 + i} o={bait ? 1 - lin(f, T * 0.55 + i * 3, T * 0.75 + i * 3) * 0.9 : 1} dead={bait && f > T * 0.75 + i * 3} />)}
        {[[GX + 80, 700], [GX + 200, 620], [GX + 140, 520], [GX + 250, 760]].map(([x, y], i) => <Ooth key={i} x={x} y={y} r={i * 40} />)}
        {/* la que ves, afuera */}
        {!bait && <Roach x={SX + SW + 30 - run * 700} y={FL - 30} r={180} s={1.6} f={f} />}
        {/* aerosol: niebla que no entra */}
        {spray && <g opacity={mist}>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={240 + rnd(i) * 720 + (f % 50)} cy={600 + rnd(i * 3) * 280} r={5 + rnd(i * 7) * 10} fill="#E6ECF0" opacity={0.75} />)}<rect x={GX - 6} y={240} width={12} height={FL - 240} fill={CL.red} opacity={0.6} /></g>}
        {/* bolitas: la de afuera es mordida y llevada adentro */}
        {bait && <>
          <Ball x={GX + 60} y={FL - 30} s={1.4} bit={lin(f, T * 0.15, T * 0.35)} />
          {Array.from({ length: 3 }, (_, i) => { const t = ((f * 0.01 + i / 3) % 1); return <g key={i}><Roach x={GX + 60 + t * 200} y={FL - 60 - t * 300} r={-60} s={0.9} f={f + i * 9} /><circle cx={GX + 90 + t * 200} cy={FL - 70 - t * 300} r={5} fill="#F1E6C8" /></g>; })}
        </>}
      </svg>
      <Tag x={GX - 10} y={180} text="Atrás de la estufa" color={CL.navy} o={lin(f, 8, 16)} size={32} />
      {mode === "hide" && <Note x={1400} y={420} o={lin(f, T * 0.35, T * 0.45)} big="1 que ves" small="muchas que no" />}
      {mode === "hide" && <Tag x={GX + 40} y={FL + 60} text="Cápsulas de huevos" color={CL.brown} o={lin(f, T * 0.55, T * 0.62)} size={30} />}
      {spray && <Note x={1400} y={420} o={lin(f, T * 0.5, T * 0.6)} big="No entra" small="a la grieta" />}
      {bait && <Note x={1400} y={420} o={lin(f, T * 0.45, T * 0.55)} big="Se la llevan" small="al escondite" color={CL.nitrile} />}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClBoricBalls
export const ClBoricBalls: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const k = clamp01(f / (T * 0.88));
  const parts = [{ t: "Ácido bórico", c: "#FFFFFF" }, { t: "Harina", c: "#F4EEDC" }, { t: "Azúcar", c: "#FBFBF6" }];
  const mixK = ease(lin(k, 0.3, 0.5)), milk = lin(k, 0.45, 0.6), balls = Math.floor(lin(k, 0.62, 0.95) * 9.99);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={711} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* 3 cucharas iguales que caen al bol */}
        {parts.map((pt, i) => { const t = lin(k, 0.05 + i * 0.08, 0.15 + i * 0.08); const x = 360 + i * 300, y = 260 + t * 260; return <g key={i} opacity={1 - mixK}><ellipse cx={x} cy={y} rx={70} ry={34} fill={pt.c} stroke={CL.ink} strokeWidth={4} /><rect x={x + 60} y={y - 10} width={150} height={18} rx={8} fill="#B8BEC4" stroke={CL.ink} strokeWidth={3} /></g>; })}
        {/* el bol */}
        <path d="M300 620 Q 650 900 1000 620 Z" fill="#E7E1D3" stroke={CL.ink} strokeWidth={7} />
        <ellipse cx={650} cy={620} rx={350} ry={60} fill={milk > 0 ? "#EDE3C6" : "#F7F3EA"} stroke={CL.ink} strokeWidth={6} />
        {Array.from({ length: 30 }, (_, i) => { const a = f * 0.08 * (mixK > 0 && mixK < 1 ? 1 : 0.2) + i; return <circle key={i} cx={650 + Math.cos(a) * (60 + rnd(i) * 240)} cy={620 + Math.sin(a) * 34} r={6} fill={["#FFFFFF", "#E8DDBB", "#FDFDF8"][i % 3]} />; })}
        {/* chorrito de leche */}
        <path d={`M760 120 Q 740 ${300 + Math.sin(f * 0.4) * 10} 700 600`} stroke="#FFFFFF" strokeWidth={14 * milk * (1 - lin(k, 0.58, 0.62))} fill="none" />
        {/* bolitas tamaño garbanzo en papel aluminio */}
        <rect x={1130} y={560} width={560} height={260} rx={8} fill="#D9DDE1" stroke={CL.ink} strokeWidth={5} />
        {Array.from({ length: balls }, (_, i) => <Ball key={i} x={1200 + (i % 5) * 105} y={630 + Math.floor(i / 5) * 110 + Math.sin(f * 0.1 + i) * 2} s={1.3} />)}
        <g transform={`translate(${1610} ${470})`} opacity={lin(k, 0.7, 0.8)}><ellipse rx={24} ry={20} fill="#E5C77A" stroke={CL.ink} strokeWidth={3} /><text y={-36} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={CL.ink}>garbanzo</text></g>
      </svg>
      {parts.map((pt, i) => <Tag key={i} x={250 + i * 300} y={150} text={`1 · ${pt.t}`} color={i === 0 ? CL.red : CL.navy} o={lin(f, 6 + i * 8, 14 + i * 8) * (1 - mixK * 0.6)} size={30} />)}
      <Tag x={760} y={60} text="Chorrito de leche" color={CL.brass} o={milk * (1 - lin(k, 0.62, 0.7))} size={32} />
      <Note x={1180} y={860} o={lin(k, 0.65, 0.75)} big="Partes iguales" small="no más ácido" color={CL.nitrile} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClRoachStation
export const ClRoachStation: React.FC<{ mode?: "station" | "map"; bed?: string }> = ({ mode = "station", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  if (mode === "map") {
    // la cocina desde arriba: 5 estaciones donde viven (no donde pasean)
    const spots = [{ x: 520, y: 260, t: "Estufa" }, { x: 640, y: 260, t: "" }, { x: 1180, y: 250, t: "Fregadero" }, { x: 1560, y: 520, t: "Refrigerador" }, { x: 420, y: 760, t: "Mueble de las ollas" }];
    const cross = lin(f, T * 0.1, T * 0.2);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={721} dim={0.55} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          <rect x={300} y={140} width={1360} height={800} fill="#EFE9DF" stroke={CL.ink} strokeWidth={7} />
          <rect x={300} y={140} width={1360} height={170} fill="#B48A5E" stroke={CL.ink} strokeWidth={5} />
          <rect x={440} y={150} width={300} height={150} fill="#F2F2EE" stroke={CL.ink} strokeWidth={5} />
          <rect x={1060} y={160} width={260} height={130} rx={10} fill="#C9CCCF" stroke={CL.ink} strokeWidth={5} />
          <rect x={1480} y={420} width={170} height={240} fill="#FAFAF8" stroke={CL.ink} strokeWidth={5} />
          <rect x={310} y={700} width={240} height={230} fill="#B48A5E" stroke={CL.ink} strokeWidth={5} />
          {/* en el medio, donde pasean: NO */}
          <g opacity={cross}><circle cx={980} cy={620} r={70} fill="none" stroke={CL.red} strokeWidth={8} /><path d="M930 570 L 1030 670" stroke={CL.red} strokeWidth={8} /><Roach x={980 + Math.sin(f * 0.06) * 30} y={620} r={f} s={1.1} f={f} /></g>
          {spots.map((s, i) => { const o = lin(f, T * (0.25 + i * 0.1), T * (0.32 + i * 0.1)); const pulse = 1 + Math.sin(f * 0.15 + i) * 0.08; return <g key={i} opacity={o} transform={`translate(${s.x} ${s.y}) scale(${pulse})`}><circle r={38} fill={CL.nitrile} stroke="#fff" strokeWidth={5} /><text y={13} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={38} fill="#fff">{i + 1}</text></g>; })}
        </svg>
        {spots.filter((s) => s.t).map((s, i) => <Tag key={i} x={s.x + 40} y={s.y + 40} text={s.t} color={CL.navy} o={lin(f, T * (0.3 + i * 0.1), T * (0.36 + i * 0.1))} size={26} />)}
        <Note x={1080} y={760} o={lin(f, T * 0.7, T * 0.8)} big="Donde viven" small="no donde pasean" color={CL.nitrile} />
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  const JX = 960, JY = 720;
  const t = (f % 100) / 100;
  const nose = lin(f, T * 0.5, T * 0.62) * (1 - lin(f, T * 0.78, T * 0.88));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={723} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <rect x={160} y={JY + 100} width={1600} height={40} fill="#B9AE9C" stroke={CL.ink} strokeWidth={5} />
        {/* la tapita cerrada con agujeros de lápiz */}
        <rect x={JX - 200} y={JY - 120} width={400} height={220} rx={26} fill="#F7F7F2" stroke={CL.ink} strokeWidth={7} />
        <rect x={JX - 215} y={JY - 150} width={430} height={46} rx={14} fill="#E3E6EA" stroke={CL.ink} strokeWidth={6} />
        <circle cx={JX - 200} cy={JY + 50} r={18} fill="#2B2B2B" /><circle cx={JX + 200} cy={JY + 50} r={18} fill="#2B2B2B" />
        <rect x={JX - 300} y={JY + 80} width={170} height={34} fill="rgba(240,226,160,0.8)" transform={`rotate(-6 ${JX - 215} ${JY + 97})`} />
        <rect x={JX + 130} y={JY + 80} width={170} height={34} fill="rgba(240,226,160,0.8)" transform={`rotate(6 ${JX + 215} ${JY + 97})`} />
        {[-60, 0, 60].map((d, i) => <Ball key={i} x={JX + d} y={JY + 40} s={1.4} bit={lin(f, T * (0.3 + i * 0.1), T * (0.45 + i * 0.1)) * 0.7} />)}
        <Roach x={JX - 560 + t * 360} y={JY + 50} r={0} s={1.3} f={f} o={t < 0.98 ? 1 : 0} />
        <g transform={`translate(${JX + 560 - nose * 330} ${JY + 10})`} opacity={nose > 0 ? 1 : 0}><ellipse cx={130} cy={0} rx={160} ry={95} fill="#C8894A" stroke={CL.ink} strokeWidth={5} /><ellipse cx={-14} cy={-6} rx={32} ry={26} fill="#2A1E14" /></g>
        {/* lápiz de escala */}
        <g transform={`translate(${JX - 200} ${JY - 260})`} opacity={lin(f, 10, 20)}><rect x={-10} y={0} width={20} height={150} fill="#F2C230" stroke={CL.ink} strokeWidth={3} /><path d="M-10 150 L 0 182 L 10 150 Z" fill="#E8C9A0" stroke={CL.ink} strokeWidth={3} /></g>
      </svg>
      <Tag x={JX - 560} y={JY - 330} text="Agujero = un lápiz" color={CL.navy} o={lin(f, 10, 18)} size={32} />
      <Tag x={JX + 60} y={JY - 330} text="Cerrada · pegada · escondida" color={CL.nitrile} o={lin(f, 18, 26)} size={32} />
      <Note x={1240} y={200} o={nose} big="El hocico, no" small="la cucaracha, sí" color={CL.nitrile} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
