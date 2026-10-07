// Kit del OLOR A HUMEDAD (Claudio el Albañil, ep. 6 "La casa de Doña Marta"), dentro del mundo (cama real + sombra + luz):
//   ClDesiccant  el tarro casero en corte: recipiente con agujeros arriba con las escamas de cloruro de calcio, el de abajo junta el agua;
//                los días pasan, las escamas se achican y el agua sube hasta "medio vaso"
//   ClClosetAir  el ropero en corte: aire quieto + vapor (puntitos) que se pega a la pared fría de atrás y a la ropa (mode "closed");
//                con 5 cm atrás, puertas abiertas una hora y el tarro, el aire circula y los puntitos se van (mode "dry")
//   ClSaltTest   la prueba de $0: un platito con sal fina una noche en el ropero → a la mañana "suelta" (bien) o "terrones" (húmedo)
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const WATER = "#7FB2DA";
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);

// ───────────────── ClDesiccant
export const ClDesiccant: React.FC<{ days?: number; bed?: string }> = ({ days = 7, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const k = ease(clamp01((f - 12) / (T * 0.65)));
  const day = Math.max(1, Math.round(1 + (days - 1) * k));
  const X = 620, W = 520;
  const flakes = 1 - 0.55 * k, water = 0.05 + 0.45 * k;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={261} dim={0.36} />
      <Contact x={X + W / 2} y={930} w={700} o={0.35} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* recipiente de abajo */}
        <path d={`M${X} 560 L${X + 30} 920 L${X + W - 30} 920 L${X + W} 560 Z`} fill="rgba(255,255,255,0.55)" stroke={CL.ink} strokeWidth={6} />
        <path d={`M${X + 30 - 30 * (1 - water) * 0} ${920 - 360 * water} L${X + 30} 920 L${X + W - 30} 920 L${X + W - 30 * 0} ${920 - 360 * water} Z`} fill={hexA(WATER, 0.75)} />
        {/* recipiente de arriba con agujeros */}
        <path d={`M${X + 20} 300 L${X + 50} 560 L${X + W - 50} 560 L${X + W - 20} 300 Z`} fill="rgba(255,255,255,0.65)" stroke={CL.ink} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={X + 80 + i * 30} cy={556} r={5} fill={CL.ink} />)}
        {/* escamas */}
        {Array.from({ length: 70 }, (_, i) => { const yy = 550 - rnd(i) * 220 * flakes; return yy > 330 ? <rect key={i} x={X + 70 + rnd(i + 3) * (W - 140)} y={yy} width={16 + rnd(i + 5) * 14} height={8} rx={3} fill="#FBFBF6" stroke="#C9C6BA" strokeWidth={1.5} transform={`rotate(${rnd(i + 9) * 60 - 30} ${X + 70 + rnd(i + 3) * (W - 140)} ${yy})`} /> : null; })}
        {/* gotas que caen por los agujeros */}
        {[0, 1, 2, 3].map((i) => { const t = ((f * 0.04 + i / 4) % 1); return <ellipse key={i} cx={X + 140 + i * 80} cy={570 + t * (330 - 360 * water)} rx={6} ry={9} fill={WATER} opacity={k > 0.02 ? 1 - t : 0} />; })}
      </svg>
      <Tag x={X + W + 60} y={330} text="Cloruro de calcio · ½ kg" color={CL.navy} o={lin(f, 6, 14)} size={34} />
      <Tag x={X + W + 60} y={760} text="El agua del aire" color="#4F86B8" o={lin(f, 18, 26)} size={34} />
      <div style={{ position: "absolute", left: 200, top: 300, opacity: lin(f, 8, 16) }}>
        <Card style={{ padding: "24px 36px" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: CL.inkSoft }}>DÍA</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CL.ink, lineHeight: 1 }}>{day}</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 180, top: 640, opacity: lin(f, T * 0.7, T * 0.8), fontFamily: HAND, fontWeight: 700, fontSize: 70, color: CL.ink }}>medio vaso</div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClClosetAir
export const ClClosetAir: React.FC<{ mode?: "closed" | "dry"; bed?: string }> = ({ mode = "closed", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const dry = mode === "dry";
  const k = dry ? ease(clamp01((f - 14) / (T * 0.5))) : 0;
  const X = 560, Y = 190, W = 800, H = 700, gap = 46 * k;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={271} dim={0.4} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* pared de afuera (fría) detrás */}
        <rect x={X - 120} y={Y - 30} width={W + 240} height={30} fill="#9DBAD3" />
        <rect x={X - 120} y={Y - 30} width={W + 240} height={H + 60} fill="none" />
        {/* el ropero (corte de frente) */}
        <rect x={X} y={Y + gap} width={W} height={H} rx={10} fill="#5E3D24" stroke={CL.ink} strokeWidth={6} />
        <rect x={X + 30} y={Y + 30 + gap} width={W - 60} height={H - 60} fill="#2E1E12" />
        {/* ropa colgada */}
        <line x1={X + 50} x2={X + W - 50} y1={Y + 90 + gap} y2={Y + 90 + gap} stroke="#B8B8B0" strokeWidth={8} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${X + 110 + i * 110} ${Y + 92 + gap} l -45 60 v 300 h 90 v -300 z`} fill={i % 2 ? "#3F4652" : "#E9E6DC"} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />)}
        {/* sombrero en el estante */}
        <ellipse cx={X + W - 160} cy={Y + 60 + gap} rx={70} ry={14} fill="#77787A" /><rect x={X + W - 200} y={Y + 30 + gap} width={80} height={30} rx={12} fill="#77787A" />
        {/* puntitos de vapor/moho */}
        {Array.from({ length: 60 }, (_, i) => { const a = dry ? 1 - k : 0.85; const t = ((f * 0.01 + rnd(i)) % 1); return <circle key={i} cx={X + 50 + rnd(i + 2) * (W - 100)} cy={Y + 80 + gap + rnd(i + 5) * (H - 140) - t * 20} r={3 + rnd(i + 7) * 4} fill={hexA("#C9D7C0", 0.9)} opacity={a} />; })}
        {/* flechas de aire (dry) */}
        {dry ? [0, 1, 2].map((i) => { const t = ((f * 0.02 + i / 3) % 1); return <path key={i} d={`M${X - 60} ${Y + 200 + i * 160} q ${W / 2} ${-30} ${W + 120} 0`} fill="none" stroke={hexA(CL.nitrile, 0.9)} strokeWidth={8} strokeDasharray="30 22" strokeDashoffset={-f * 3} opacity={k} />; }) : null}
        {/* tarro en el piso */}
        {dry ? <g opacity={k}><rect x={X + 80} y={Y + H - 120 + gap} width={110} height={80} rx={8} fill="rgba(255,255,255,0.8)" stroke={CL.ink} strokeWidth={4} /><rect x={X + 84} y={Y + H - 80 + gap} width={102} height={36} fill={hexA(WATER, 0.8)} /></g> : null}
      </svg>
      <Tag x={X - 100} y={Y - 110} text="Pared de afuera · fría" color="#4C7FB0" o={lin(f, 6, 14)} size={34} />
      {dry ? <Tag x={X + W - 120} y={Y - 110} text="5 cm · puertas abiertas 1 h" color="#3E8A3A" o={k} size={34} /> : <Tag x={X + W - 200} y={Y + H + 40} text="Aire quieto + pared fría = olor" color={CL.red} o={lin(f, T * 0.4, T * 0.5)} size={34} />}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClSaltTest
export const ClSaltTest: React.FC<{ result?: "loose" | "clumped"; bed?: string }> = ({ result = "clumped", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const night = lin(f, 14, 30) * (1 - lin(f, T * 0.45, T * 0.55));
  const morning = lin(f, T * 0.5, T * 0.6);
  const clump = result === "clumped" ? morning : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={281} dim={0.36} />
      <AbsoluteFill style={{ background: `rgba(10,14,30,${0.55 * night})` }} />
      <Contact x={960} y={760} w={760} o={0.35} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <ellipse cx={960} cy={640} rx={330} ry={90} fill="#F6F3EC" stroke="#BDB6A8" strokeWidth={5} />
        <ellipse cx={960} cy={630} rx={250} ry={60} fill="#ECE7DD" />
        {/* sal: granitos sueltos o terrones */}
        {Array.from({ length: 220 }, (_, i) => { const a = rnd(i) * 6.28, r = Math.sqrt(rnd(i + 3)) * 220; const x = 960 + Math.cos(a) * r, y = 628 + Math.sin(a) * r * 0.24; return <rect key={i} x={x} y={y} width={3 + 2 * rnd(i + 5)} height={3} fill="#FFFFFF" stroke="#D8D3C8" strokeWidth={0.6} opacity={1 - clump} />; })}
        {Array.from({ length: 9 }, (_, i) => { const a = rnd(i + 40) * 6.28, r = Math.sqrt(rnd(i + 43)) * 180; return <ellipse key={i} cx={960 + Math.cos(a) * r} cy={624 + Math.sin(a) * r * 0.24} rx={26 + 18 * rnd(i + 45)} ry={14 + 6 * rnd(i + 47)} fill="#F1EEE6" stroke="#BFB9AC" strokeWidth={2} opacity={clump} />; })}
      </svg>
      <div style={{ position: "absolute", left: 130, top: 90, opacity: lin(f, 4, 12) }}><Tag x={0} y={0} text="La prueba de $0 · un plato de sal, una noche" size={34} /></div>
      <div style={{ position: "absolute", left: 1320, top: 300, opacity: night, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#F4F1E3" }}>toda la noche…</div>
      <div style={{ position: "absolute", left: 760, top: 800, opacity: morning }}>
        <Tag x={0} y={0} text={result === "clumped" ? "Terrones: demasiada agua" : "Suelta: el ropero está bien"} color={result === "clumped" ? CL.red : "#3E8A3A"} />
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
