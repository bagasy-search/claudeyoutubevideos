// Kit de las HORMIGAS (Claudio el Fumigador ep. 5 "El cebo que se lleva el nido"), dentro del mundo (cama real + sombra + luz):
//   ClAntRelay    "share": corte casa/patio: la fila baja del marco de la ventana, toma una gota del cebo y la lleva por la pared hasta el
//                 nido debajo de la maceta, donde se la pasa a las larvas y a la reina · "spray": el aerosol mata la fila de ese momento, la
//                 reina sigue poniendo huevos y el nido se parte en dos (dos filas)
//   ClBaitStation "mix": 1 cucharadita de bórax + 1/2 taza de azúcar + 1 taza de agua tibia, se disuelve hasta quedar transparente
//                 · "station": el frasquito cerrado con agujeritos de grano de arroz pegado con cinta: las hormigas entran, el dedo de Mateo y
//                 el hocico de Bruno no
//   ClAntDays     día 1 → día 5: la fila se ensancha (avisan a las otras), se afina y desaparece
// Movimiento continuo siempre (las hormigas nunca se quedan quietas).
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
// una hormiga negra vista desde arriba/costado (drop = lleva una gota del cebo)
export const Ant: React.FC<{ x: number; y: number; r?: number; s?: number; o?: number; f?: number; drop?: boolean; dead?: boolean; color?: string }> = ({ x, y, r = 0, s = 1, o = 1, f = 0, drop = false, dead = false, color = "#1B1612" }) => {
  const w = dead ? 0 : Math.sin(f * 0.9) * 4;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      {[-6, 0, 6].map((lx, i) => <g key={i}><line x1={lx} y1={0} x2={lx + (i % 2 ? w : -w) - 3} y2={dead ? 6 : 10} stroke={color} strokeWidth={1.6} /><line x1={lx} y1={0} x2={lx + (i % 2 ? -w : w) - 3} y2={dead ? -6 : -10} stroke={color} strokeWidth={1.6} /></g>)}
      <ellipse cx={-10} cy={0} rx={7} ry={5} fill={color} />
      <ellipse cx={0} cy={0} rx={4} ry={3.4} fill={color} />
      <circle cx={8} cy={0} r={4.6} fill={color} />
      <path d={`M11 -2 q 6 -6 9 -4 M11 2 q 6 6 9 4`} stroke={color} strokeWidth={1.3} fill="none" />
      {drop && <circle cx={15} cy={0} r={4} fill="#F2E7B8" stroke="#B8A35C" strokeWidth={1} />}
    </g>
  );
};
// hormigas que recorren una polilínea (ida y vuelta), espaciadas
const Trail: React.FC<{ pts: [number, number][]; n: number; f: number; speed?: number; s?: number; o?: number; carry?: boolean; width?: number; seed?: number }> = ({ pts, n, f, speed = 0.004, s = 1.6, o = 1, carry = false, width = 0, seed = 1 }) => {
  const L: number[] = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1];
  const at = (d: number) => { let i = 1; while (i < L.length - 1 && L[i] < d) i++; const k = (d - L[i - 1]) / (L[i] - L[i - 1] || 1); const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, a: Math.atan2(y1 - y0, x1 - x0) * 57.3 }; };
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const back = i % 2 === 1, t = ((f * speed + i / n) % 1), d = (back ? 1 - t : t) * tot, p = at(d);
        const off = width ? (rnd(seed + i) - 0.5) * width : 0;
        return <Ant key={i} x={p.x + off * Math.cos((p.a + 90) / 57.3)} y={p.y + off * Math.sin((p.a + 90) / 57.3)} r={p.a + (back ? 180 : 0)} s={s} f={f + i * 2} drop={carry && back} />;
      })}
    </g>
  );
};

// ───────────────── ClAntRelay
export const ClAntRelay: React.FC<{ mode?: "share" | "spray"; bed?: string }> = ({ mode = "share", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const WALL = 980, GND = 840; // pared de la casa (corte) y nivel del piso del patio
  const NX = 1460, NY = 930; // el nido bajo la maceta
  const path: [number, number][] = [[420, 600], [880, 600], [930, 420], [WALL + 40, 420], [WALL + 70, GND - 10], [NX - 120, GND - 10], [NX - 40, NY - 30]];
  const spray = mode === "spray";
  const kill = spray ? lin(f, T * 0.25, T * 0.4) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={601} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* la cocina: barra, azucarero/estación; la pared con la ventana; el patio con la maceta */}
        <rect x={160} y={600} width={WALL - 160} height={36} fill="#9AA0A4" stroke={CL.ink} strokeWidth={5} />
        <rect x={WALL} y={140} width={60} height={GND - 140} fill="#E9E2D3" stroke={CL.ink} strokeWidth={5} />
        <rect x={WALL - 6} y={300} width={72} height={140} fill="#BFD6E2" stroke={CL.ink} strokeWidth={4} />
        <rect x={WALL + 60} y={GND} width={760} height={240} fill="#8B6A48" stroke={CL.ink} strokeWidth={5} />
        <path d={`M${NX - 150} ${GND} L ${NX - 120} ${GND - 190} L ${NX + 120} ${GND - 190} L ${NX + 150} ${GND} Z`} fill="#C46A3A" stroke={CL.ink} strokeWidth={5} />
        <path d={`M${NX} ${GND - 190} q -30 -120 -10 -200 M${NX} ${GND - 190} q 50 -90 90 -140`} stroke="#3F7A3A" strokeWidth={10} fill="none" />
        {/* el nido en corte: cámaras con larvas y la reina */}
        <ellipse cx={NX} cy={NY + 50} rx={210} ry={90} fill="#5E4630" stroke={CL.ink} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={NX - 150 + i * 46} cy={NY + 70 + Math.sin(f * 0.1 + i) * 3} rx={9} ry={5} fill="#F3EEDD" />)}
        <g transform={`translate(${NX + 20} ${NY + 40})`}><ellipse cx={-18} cy={0} rx={22} ry={11} fill="#2A1E14" /><circle cx={10} cy={0} r={8} fill="#2A1E14" /><circle cx={24} cy={0} r={7} fill="#2A1E14" /></g>
        {spray ? (
          <>
            <Trail pts={path} n={18} f={f} o={1 - kill} />
            {kill > 0 && Array.from({ length: 10 }, (_, i) => <Ant key={i} x={300 + i * 60} y={600} r={i * 30} s={1.6} dead o={kill} />)}
            {/* mist */}
            <g opacity={lin(f, T * 0.15, T * 0.22) * (1 - lin(f, T * 0.45, T * 0.55))}>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={260 + rnd(i) * 600 + (f % 40)} cy={480 + rnd(i * 3) * 120} r={4 + rnd(i * 7) * 8} fill="#E8EEF2" opacity={0.7} />)}</g>
            {/* el nido sigue: dos filas nuevas */}
            <Trail pts={[[NX - 40, NY - 30], [NX - 260, GND - 10], [WALL + 80, GND - 10]]} n={10} f={f} o={lin(f, T * 0.6, T * 0.7)} />
            <Trail pts={[[NX + 60, NY - 30], [NX + 260, GND - 10], [1800, GND - 10]]} n={10} f={f + 30} o={lin(f, T * 0.66, T * 0.76)} />
          </>
        ) : (
          <>
            {/* la estación de cebo en la barra */}
            <rect x={380} y={548} width={70} height={52} rx={8} fill="rgba(220,235,240,0.7)" stroke={CL.ink} strokeWidth={3} />
            <ellipse cx={415} cy={590} rx={26} ry={8} fill="#F2E7B8" />
            <Trail pts={path} n={22} f={f} carry />
            {/* boca a boca adentro del nido */}
            {Array.from({ length: 4 }, (_, i) => { const t = ((f * 0.02 + i / 4) % 1); return <circle key={i} cx={NX - 120 + t * 160} cy={NY + 46 + Math.sin(t * 9) * 8} r={4} fill="#F2E7B8" opacity={lin(f, T * 0.3, T * 0.4)} />; })}
          </>
        )}
      </svg>
      {spray ? <>
        <Tag x={220} y={420} text="Aerosol" color={CL.red} o={lin(f, T * 0.12, T * 0.2)} />
        <Note x={1180} y={180} o={lin(f, T * 0.62, T * 0.72)} big="La reina sigue" small="y el nido se parte en dos" />
      </> : <>
        <Tag x={240} y={680} text="El cebo" color={CL.nitrile} o={lin(f, 6, 14)} size={34} />
        <Tag x={NX - 260} y={NY + 150} text="La reina" color={CL.brown} o={lin(f, T * 0.3, T * 0.38)} size={34} />
        <Note x={1120} y={160} o={lin(f, T * 0.5, T * 0.6)} big="Lo llevan ellas" small="y lo reparten" color={CL.nitrile} />
      </>}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClBaitStation
export const ClBaitStation: React.FC<{ mode?: "mix" | "station"; bed?: string }> = ({ mode = "station", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  if (mode === "mix") {
    const dis = ease(lin(f, T * 0.35, T * 0.8)); const sw = f * 0.12;
    const items = [{ t: "1 cucharadita", s: "de bórax", c: CL.inkSoft, at: 0.05 }, { t: "1/2 taza", s: "de azúcar", c: CL.brass, at: 0.15 }, { t: "1 taza", s: "de agua tibia", c: CL.nitrile, at: 0.25 }];
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={611} dim={0.55} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          <path d="M1180 360 L 1210 900 L 1530 900 L 1560 360" fill="rgba(215,232,240,0.35)" stroke={CL.ink} strokeWidth={7} />
          <path d={`M1186 470 Q 1370 ${462 + Math.sin(sw) * 8} 1554 470 L 1530 896 L 1210 896 Z`} fill={`rgba(${Math.round(230 - 20 * dis)},${Math.round(226 - 6 * dis)},${Math.round(210 + 20 * dis)},0.75)`} />
          {/* granitos que giran y se disuelven */}
          {Array.from({ length: 40 }, (_, i) => { const a = sw * (1 + rnd(i)) + i, r = 40 + rnd(i * 3) * 120; return <circle key={i} cx={1370 + Math.cos(a) * r} cy={760 + Math.sin(a) * 30 + rnd(i * 5) * 100} r={4 + rnd(i * 7) * 4} fill="#FFFFFF" stroke="#C9C2B0" strokeWidth={1} opacity={1 - dis} />; })}
          {/* la cuchara que revuelve */}
          <g transform={`translate(${1370 + Math.cos(sw * 2) * 90} 600) rotate(${12 + Math.sin(sw * 2) * 8})`}><rect x={-8} y={-360} width={16} height={330} rx={6} fill="#B8BEC4" stroke={CL.ink} strokeWidth={3} /><ellipse cx={0} cy={-20} rx={26} ry={36} fill="#B8BEC4" stroke={CL.ink} strokeWidth={3} /></g>
        </svg>
        {items.map((it, i) => <div key={i} style={{ position: "absolute", left: 230, top: 250 + i * 190, opacity: lin(f, T * it.at, T * it.at + 10), transform: `translateX(${(1 - lin(f, T * it.at, T * it.at + 10)) * -40}px)` }}><Card style={{ padding: "12px 30px", borderLeft: `10px solid ${it.c}` }}><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>{it.t}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: it.c }}>{it.s}</div></Card></div>)}
        <Tag x={1170} y={940} text={dis < 0.95 ? "Revolver" : "Transparente"} color={dis < 0.95 ? CL.navy : CL.nitrile} o={lin(f, T * 0.3, T * 0.38)} />
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  // la estación cerrada
  const JX = 960, JY = 700;
  const finger = lin(f, T * 0.4, T * 0.52) * (1 - lin(f, T * 0.6, T * 0.68));
  const nose = lin(f, T * 0.66, T * 0.76) * (1 - lin(f, T * 0.86, T * 0.94));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={613} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <rect x={160} y={JY + 120} width={1600} height={40} fill="#9AA0A4" stroke={CL.ink} strokeWidth={5} />
        {/* frasquito con tapa de rosca, agujeritos abajo, algodón adentro, cinta */}
        <rect x={JX - 160} y={JY - 160} width={320} height={280} rx={30} fill="rgba(215,232,240,0.45)" stroke={CL.ink} strokeWidth={7} />
        <rect x={JX - 175} y={JY - 210} width={350} height={60} rx={14} fill="#E0E3E6" stroke={CL.ink} strokeWidth={6} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={JX - 150 + i * 42} y1={JY - 206} x2={JX - 150 + i * 42} y2={JY - 154} stroke="#AEB4B9" strokeWidth={4} />)}
        {[-90, -30, 30, 90].map((dx, i) => <circle key={i} cx={JX + dx} cy={JY + 90} r={7} fill="#2B2B2B" />)}
        {[[-70, 40], [-20, 20], [30, 44], [70, 24], [0, 60]].map(([a, b], i) => <circle key={i} cx={JX + a} cy={JY + b} r={30} fill="#FBF6E2" stroke="#D8CFAE" strokeWidth={2} />)}
        <rect x={JX - 240} y={JY + 100} width={140} height={34} fill="rgba(240,226,160,0.8)" transform={`rotate(-8 ${JX - 170} ${JY + 117})`} />
        <rect x={JX + 100} y={JY + 100} width={140} height={34} fill="rgba(240,226,160,0.8)" transform={`rotate(7 ${JX + 170} ${JY + 117})`} />
        <Trail pts={[[200, JY + 112], [JX - 90, JY + 112], [JX - 90, JY + 90]]} n={9} f={f} s={1.5} />
        <Trail pts={[[1720, JY + 112], [JX + 90, JY + 112], [JX + 90, JY + 90]]} n={9} f={f + 20} s={1.5} />
        {/* el dedo de Mateo */}
        <g transform={`translate(${JX - 30} ${JY + 90 - 260 * (1 - finger) - 40})`} opacity={finger > 0 ? 1 : 0}><rect x={-26} y={-300} width={52} height={300} rx={26} fill="#D9A27C" stroke={CL.ink} strokeWidth={4} /><ellipse cx={0} cy={-14} rx={18} ry={14} fill="#F0C7B0" /></g>
        {/* el hocico de Bruno */}
        <g transform={`translate(${JX + 420 - nose * 210} ${JY + 40})`} opacity={nose > 0 ? 1 : 0}><ellipse cx={120} cy={0} rx={150} ry={90} fill="#C8894A" stroke={CL.ink} strokeWidth={5} /><ellipse cx={-14} cy={-6} rx={30} ry={24} fill="#2A1E14" /><path d="M10 40 q 30 20 60 0" stroke={CL.ink} strokeWidth={4} fill="none" /></g>
      </svg>
      <Tag x={JX + 220} y={JY - 260} text="Agujeritos = grano de arroz" color={CL.navy} o={lin(f, 8, 16)} size={32} />
      <Tag x={JX - 560} y={JY - 260} text="Tapa cerrada · pegada" color={CL.nitrile} o={lin(f, 16, 24)} size={32} />
      <Note x={220} y={180} o={finger} big="El dedo, no" small="las hormigas, sí" color={CL.nitrile} />
      <Note x={1240} y={180} o={nose} big="El hocico, no" small="está cerrado" color={CL.nitrile} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClAntDays
export const ClAntDays: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const k = clamp01(f / (T * 0.85));
  const DAYS = [{ d: 1, n: 20, w: 40, t: "Más hormigas" }, { d: 2, n: 34, w: 70, t: "Negra de hormigas" }, { d: 3, n: 12, w: 20, t: "Más lentas" }, { d: 5, n: 0, w: 0, t: "Ninguna" }];
  const i = Math.min(3, Math.floor(k * 4)), D = DAYS[i];
  const path: [number, number][] = [[180, 560], [1700, 560]];
  const zoom = 1 + f * 0.0007;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={621} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4), transform: `scale(${zoom})`, transformOrigin: "50% 55%" }}>
        <rect x={140} y={500} width={1640} height={120} rx={10} fill="rgba(160,166,170,0.55)" stroke={CL.ink} strokeWidth={4} />
        <Trail pts={path} n={D.n} f={f} width={D.w} seed={i * 50} s={1.7} speed={i === 2 ? 0.002 : 0.004} />
        {i === 2 && Array.from({ length: 4 }, (_, j) => <Ant key={j} x={400 + j * 300 + Math.sin(f * 0.05 + j) * 20} y={575 + Math.cos(f * 0.07 + j) * 12} r={f * 2 + j * 80} s={1.7} f={f * 0.3} />)}
        {DAYS.map((x, j) => <g key={j} transform={`translate(${380 + j * 380} 300)`} opacity={j <= i ? 1 : 0.35}>
          <circle r={70} fill={j === i ? CL.nitrile : "#FBF9F4"} stroke={CL.ink} strokeWidth={6} />
          <text y={-6} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={26} fill={j === i ? "#fff" : CL.inkSoft}>DÍA</text>
          <text y={40} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill={j === i ? "#fff" : CL.ink}>{x.d}</text>
        </g>)}
      </svg>
      <Note x={760} y={720} o={1} big={D.t} small="" color={i === 3 ? CL.nitrile : CL.navy} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
