// Kit del FUMIGADOR (Claudio el Fumigador, serie "La casa de los Ramírez"), dentro del mundo (cama real + sombra + luz):
//   ClHidden50   la cocina en corte: la linterna muestra UNA cucaracha en la encimera; la pared y el motor del refrigerador se abren
//                y aparecen las escondidas (contador hasta `hidden`)
//   ClFridgeBack el refrigerador visto de costado: lo que había atrás = agua (bandeja del deshielo) + comida (croquetas) + escondite
//                caliente (motor) + cápsulas de huevos (mode "find"); mode "fixed" = bandeja vacía, piso limpio y la tapita de cebo
//                cerrada detrás, "lejos de los niños y del perro"
//   ClPeroxide   el frasco: mata por contacto (segundos) ✓ · se seca y se va (agua + oxígeno, no queda nada) ✗ (mode "contact" | "gone")
//   ClTrailMap   plano de la cocina desde arriba: el rastro de olor (mapa) del refrigerador al fregadero; "trail" = aparece y caminan,
//                "erase" = la botella borra el camino, "bait" = cebo en tapita detrás del refrigerador + zona de rociar LEJOS
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const ROACH = "#7A4A22", ROACH_D = "#4A2A12";
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);
// cucaracha vista desde arriba (cabeza hacia +x), patas que se mueven si walk
export const Roach: React.FC<{ x: number; y: number; r?: number; s?: number; walk?: number; o?: number; dead?: boolean }> = ({ x, y, r = 0, s = 1, walk = 0, o = 1, dead }) => {
  const w = Math.sin(walk) * 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      {[-12, 0, 12].map((lx, i) => (
        <g key={i} stroke={ROACH_D} strokeWidth={2.4} strokeLinecap="round" fill="none">
          <path d={`M${lx} -6 q ${-4 + (i % 2 ? w : -w)} -10 ${-10 + (i % 2 ? w : -w)} -18`} />
          <path d={`M${lx} 6 q ${-4 + (i % 2 ? -w : w)} 10 ${-10 + (i % 2 ? -w : w)} 18`} />
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={22} ry={11} fill={dead ? "#5A3A22" : ROACH} stroke={ROACH_D} strokeWidth={1.5} />
      <line x1={-20} y1={0} x2={14} y2={0} stroke={ROACH_D} strokeWidth={1.2} opacity={0.6} />
      <ellipse cx={22} cy={0} rx={7} ry={8} fill={ROACH_D} />
      <path d={`M27 -3 q 18 -10 30 -6 M27 3 q 18 10 30 6`} stroke={ROACH_D} strokeWidth={1.4} fill="none" />
    </g>
  );
};
// cápsula de huevos (ooteca)
const Egg: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`} opacity={o}>
    <rect x={-10} y={-5} width={20} height={10} rx={4} fill="#8B5A2B" stroke="#5A3517" strokeWidth={1.4} />
    {[-6, -2, 2, 6].map((k) => <line key={k} x1={k} y1={-5} x2={k} y2={5} stroke="#5A3517" strokeWidth={0.9} />)}
  </g>
);

// ───────────────── ClHidden50
export const ClHidden50: React.FC<{ hidden?: number; bed?: string }> = ({ hidden = 50, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const open = ease(clamp01((f - T * 0.3) / (T * 0.35)));
  const n = Math.round(hidden * open);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={301} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* pared en corte detrás de la encimera */}
        <rect x={260} y={170} width={1400} height={430} fill="#EDE8DD" stroke={CL.ink} strokeWidth={5} />
        <rect x={260} y={170} width={1400} height={430} fill="#2A1D12" opacity={open * 0.92} />
        {/* encimera de granito */}
        <rect x={220} y={600} width={1480} height={60} fill="#8C8F92" stroke={CL.ink} strokeWidth={5} />
        {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={230 + rnd(i) * 1460} cy={606 + rnd(i + 1) * 48} r={2} fill={rnd(i + 2) > 0.5 ? "#5E6164" : "#C9CBCD"} />)}
        <rect x={220} y={660} width={1480} height={300} fill="#8A5A34" stroke={CL.ink} strokeWidth={5} />
        {/* refrigerador a la derecha (motor abierto) */}
        <rect x={1380} y={150} width={300} height={800} rx={14} fill="#F4F2EC" stroke={CL.ink} strokeWidth={5} />
        <rect x={1380} y={800} width={300} height={150} fill="#2A1D12" opacity={open * 0.95} />
        {/* las escondidas */}
        {Array.from({ length: hidden }, (_, i) => {
          const inFridge = i % 4 === 0;
          const x = inFridge ? 1400 + rnd(i) * 260 : 290 + rnd(i) * 1060, y = inFridge ? 815 + rnd(i + 1) * 120 : 190 + rnd(i + 1) * 390;
          return <Roach key={i} x={x} y={y} r={rnd(i + 2) * 360} s={0.7 + rnd(i + 3) * 0.4} walk={f * 0.5 + i} o={i < n ? 1 : 0} />;
        })}
        {/* la que se ve, con el cono de la linterna */}
        <path d={`M120 1000 L 760 560 L 940 640 Z`} fill={hexA("#FFF3B0", 0.35)} />
        <Roach x={850 + Math.sin(f * 0.05) * 30} y={625} r={-10} s={1.4} walk={f * 0.6} />
      </svg>
      <div style={{ position: "absolute", left: 640, top: 690, opacity: lin(f, 8, 16) }}>
        <Card style={{ padding: "14px 28px", display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CL.ink, lineHeight: 1 }}>1</span>
          <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 36, color: CL.inkSoft, letterSpacing: 2 }}>LA QUE VES</span>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 700, top: 230, opacity: open }}>
        <Card style={{ padding: "14px 28px", display: "flex", alignItems: "baseline", gap: 18, borderBottom: `6px solid ${CL.red}` }}>
          <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CL.red, lineHeight: 1 }}>{n}</span>
          <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 36, color: CL.inkSoft, letterSpacing: 2 }}>LAS QUE NO</span>
        </Card>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClFridgeBack
export const ClFridgeBack: React.FC<{ mode?: "find" | "fixed"; bed?: string }> = ({ mode = "find", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const fixed = mode === "fixed";
  const a = lin(f, T * 0.12, T * 0.2), b = lin(f, T * 0.32, T * 0.4), c = lin(f, T * 0.52, T * 0.6), d = lin(f, T * 0.7, T * 0.78);
  const X = 560, Y = 120, W = 520, H = 860, WALL = 1400;
  const heat = 0.5 + 0.5 * Math.sin(f * 0.15);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={311} dim={0.45} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* pared de atrás y piso */}
        <rect x={WALL} y={60} width={40} height={940} fill="#E9E3D6" stroke={CL.ink} strokeWidth={4} />
        <rect x={300} y={Y + H} width={1180} height={22} fill="#C9B9A0" stroke={CL.ink} strokeWidth={4} />
        {/* puntitos negros en la pared = el mapa */}
        {!fixed && Array.from({ length: 60 }, (_, i) => <circle key={i} cx={WALL + 6 + rnd(i) * 28} cy={300 + rnd(i + 1) * 650} r={2.4} fill="#1A120A" opacity={d} />)}
        {/* refrigerador de costado */}
        <rect x={X} y={Y} width={W} height={H} rx={18} fill="#F4F2EC" stroke={CL.ink} strokeWidth={6} />
        <line x1={X} y1={Y + H * 0.36} x2={X + W} y2={Y + H * 0.36} stroke={CL.ink} strokeWidth={4} />
        {/* parrilla del condensador + motor */}
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={X + W + 10} y1={Y + 120 + i * 70} x2={X + W + 60} y2={Y + 120 + i * 70} stroke="#55585C" strokeWidth={6} />)}
        <rect x={X + W - 150} y={Y + H - 190} width={170} height={130} rx={20} fill="#3C3F43" stroke={CL.ink} strokeWidth={4} />
        <ellipse cx={X + W - 65} cy={Y + H - 125} rx={110} ry={90} fill={hexA("#FF7A2E", 0.22 * heat * c)} />
        {/* bandeja del deshielo */}
        <rect x={X + 40} y={Y + H - 34} width={W + 60} height={30} rx={6} fill="#D9D6CE" stroke={CL.ink} strokeWidth={4} />
        {!fixed && <rect x={X + 46} y={Y + H - 28} width={W + 48} height={20} fill={hexA("#7FB2DA", 0.85)} opacity={a} />}
        {/* croquetas */}
        {!fixed && Array.from({ length: 26 }, (_, i) => <circle key={i} cx={X + 80 + rnd(i + 40) * (W + 280)} cy={Y + H + 4 - rnd(i + 41) * 10} r={8} fill="#A0602A" stroke="#5E3714" strokeWidth={1.5} opacity={b} />)}
        {/* cucarachas en el motor y cápsulas */}
        {!fixed && Array.from({ length: 9 }, (_, i) => <Roach key={i} x={X + W - 130 + rnd(i + 60) * 140} y={Y + H - 175 + rnd(i + 61) * 100} r={rnd(i + 62) * 360} s={0.8} walk={f * 0.5 + i} o={c} />)}
        {!fixed && Array.from({ length: 14 }, (_, i) => <Egg key={i} x={WALL - 30 - rnd(i + 80) * 70} y={Y + H - 8 - rnd(i + 81) * 14} r={rnd(i + 82) * 180} o={d} />)}
        {/* fixed: la tapita de cebo cerrada con agujerito, detrás, contra la pared */}
        {fixed && (
          <g opacity={c}>
            <ellipse cx={WALL - 70} cy={Y + H - 14} rx={46} ry={14} fill="#E8E2D2" stroke={CL.ink} strokeWidth={3} />
            <rect x={WALL - 116} y={Y + H - 50} width={92} height={36} rx={8} fill="#F6F1E4" stroke={CL.ink} strokeWidth={3} />
            <circle cx={WALL - 70} cy={Y + H - 22} r={6} fill="#2A1D12" />
            <Roach x={WALL - 160} y={Y + H - 10} r={20} s={0.7} dead o={d} /><Roach x={WALL - 210} y={Y + H - 6} r={-160} s={0.7} dead o={d} />
          </g>
        )}
      </svg>
      {!fixed ? (
        <>
          <Tag x={250} y={Y + H - 150} text="Agua · la bandeja" color="#4F86B8" o={a} size={36} />
          <Tag x={250} y={Y + H - 260} text="Comida · las croquetas" color="#A0602A" o={b} size={36} />
          <Tag x={1180} y={Y + 300} text="Escondite · el motor" color={CL.red} o={c} size={36} />
          <Tag x={1180} y={Y + 180} text="Huevos y el mapa" color={CL.navy} o={d} size={36} />
        </>
      ) : (
        <>
          <Tag x={250} y={Y + H - 150} text="Bandeja vacía · domingos" color="#4F86B8" o={a} size={36} />
          <Tag x={250} y={Y + H - 260} text="Piso limpio" color={CL.nitrile} o={b} size={36} />
          <Tag x={1060} y={Y + 300} text="Cebo en tapita cerrada" color={CL.navy} o={c} size={36} />
          <Tag x={1060} y={Y + 410} text="Lejos de los niños y del perro" color={CL.red} o={d} size={34} />
        </>
      )}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClPeroxide
export const ClPeroxide: React.FC<{ mode?: "contact" | "gone"; bed?: string }> = ({ mode = "contact", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const gone = mode === "gone";
  const k = ease(clamp01((f - 14) / (T * 0.55)));
  const secs = Math.min(5, Math.round(k * 5));
  const drop = gone ? 1 - k : 1;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={321} dim={0.5} />
      <Contact x={960} y={820} w={900} o={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* azulejo / encimera */}
        <rect x={460} y={560} width={1000} height={260} rx={14} fill="#EFEAE0" stroke={CL.ink} strokeWidth={5} />
        {/* la mancha mojada */}
        <ellipse cx={960} cy={690} rx={300 * (gone ? 0.4 + 0.6 * drop : 1)} ry={80 * (gone ? 0.4 + 0.6 * drop : 1)} fill={hexA("#9CC7E6", 0.55 * drop)} />
        {/* burbujas de oxígeno que suben */}
        {Array.from({ length: 30 }, (_, i) => { const t = ((f * 0.02 + rnd(i)) % 1); return <circle key={i} cx={720 + rnd(i + 1) * 480} cy={680 - t * (gone ? 420 : 140)} r={4 + rnd(i + 2) * 7} fill="none" stroke={hexA("#6FA8D6", 0.9)} strokeWidth={2} opacity={(1 - t) * (gone ? 0.4 + 0.6 * k : 0.5)} />; })}
        {!gone && <Roach x={960} y={690} r={-8} s={2.2} walk={f * (1 - k) * 0.7} dead={k > 0.9} />}
        {gone && <Roach x={760 + k * 400} y={690} r={0} s={2} walk={f * 0.6} o={lin(f, T * 0.55, T * 0.62)} />}
      </svg>
      {!gone ? (
        <>
          <div style={{ position: "absolute", left: 470, top: 250, opacity: lin(f, 6, 14) }}>
            <Card style={{ padding: "18px 36px" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: CL.inkSoft, letterSpacing: 3 }}>MOJADA, SE MUERE EN</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CL.ink, lineHeight: 1 }}>{secs} s</div>
            </Card>
          </div>
          <Tag x={1100} y={300} text="✓ Mata por contacto" color={CL.nitrile} o={lin(f, T * 0.5, T * 0.6)} size={40} />
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 470, top: 250, opacity: lin(f, 6, 14) }}>
            <Card style={{ padding: "18px 36px" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>agua <span style={{ color: CL.inkSoft }}>+</span> oxígeno</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.inkSoft }}>se seca y se va</div>
            </Card>
          </div>
          <Tag x={1080} y={300} text="✗ No queda actuando" color={CL.red} o={lin(f, T * 0.6, T * 0.7)} size={40} />
        </>
      )}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClTrailMap
export const ClTrailMap: React.FC<{ mode?: "trail" | "erase" | "bait"; bed?: string }> = ({ mode = "trail", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const k = ease(clamp01((f - 12) / (T * 0.6)));
  // plano: x 380..1540, y 160..940
  const pts: [number, number][] = [[1360, 300], [1250, 330], [1120, 300], [980, 260], [840, 250], [700, 270], [600, 330]];
  const path = "M" + pts.map((q) => q.join(" ")).join(" L ");
  const erase = mode === "erase" ? k : mode === "bait" ? 1 : 0;
  const draw = mode === "trail" ? k : 1;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={331} dim={0.55} />
      <div style={{ position: "absolute", left: 360, top: 140, width: 1200, height: 820, background: "#F8F4EA", borderRadius: 12, boxShadow: `0 26px 56px ${CL.shadow}`, opacity: clamp01(p * 1.4) }} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <defs><pattern id="tmg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 L0 0 0 40" fill="none" stroke="#E2DCCB" strokeWidth={1} /></pattern></defs>
        <rect x={380} y={160} width={1160} height={780} fill="url(#tmg)" />
        {/* paredes */}
        <rect x={400} y={180} width={1120} height={740} fill="none" stroke={CL.ink} strokeWidth={10} />
        {/* encimera en L + fregadero */}
        <rect x={400} y={180} width={1120} height={120} fill="#B9BCBF" stroke={CL.ink} strokeWidth={4} />
        <rect x={560} y={200} width={170} height={80} rx={10} fill="#DDE3E8" stroke={CL.ink} strokeWidth={3} />
        {/* refrigerador */}
        <rect x={1340} y={180} width={180} height={190} fill="#F4F2EC" stroke={CL.ink} strokeWidth={5} />
        {/* puerta del patio */}
        <rect x={400} y={700} width={14} height={150} fill={CL.brass} /><path d="M414 700 a 150 150 0 0 1 150 150" fill="none" stroke={CL.ink} strokeWidth={3} strokeDasharray="8 8" />
        {/* plato del perro */}
        <circle cx={1180} cy={560} r={34} fill="#C8CCD0" stroke={CL.ink} strokeWidth={3} /><circle cx={1180} cy={560} r={20} fill="#A0602A" />
        {/* el rastro */}
        <path d={path} fill="none" stroke={hexA("#6B3A1E", 0.75)} strokeWidth={14} strokeDasharray="4 16" strokeLinecap="round" pathLength={1} strokeDashoffset={0} opacity={draw} style={{ clipPath: `inset(0 0 0 ${erase * 100}%)` }} />
        {mode === "trail" && [0, 1, 2].map((i) => { const t = ((k * 1.6 + i / 3) % 1); const s = t * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(s)), u = s - j; const x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u; return <Roach key={i} x={x} y={y} r={180} s={0.9} walk={f * 0.6 + i} o={k > 0.05 ? 1 : 0} />; })}
        {/* la zona rociada (verde) avanza de izquierda a derecha */}
        {erase > 0 && <rect x={560} y={220} width={Math.max(0, (1300 - 560) * erase)} height={160} rx={30} fill={hexA(CL.nitrile, 0.22)} stroke={hexA(CL.nitrile, 0.7)} strokeWidth={3} strokeDasharray="10 8" />}
        {/* cebo detrás del refrigerador + círculo de "no llegan" */}
        {mode === "bait" && (
          <g opacity={lin(f, 14, 26)}>
            <circle cx={1500} cy={200} r={16} fill={CL.navy} stroke="#fff" strokeWidth={3} />
            <line x1={1300} y1={260} x2={1480} y2={210} stroke={CL.red} strokeWidth={4} strokeDasharray="10 8" />
          </g>
        )}
      </svg>
      {mode === "trail" && <Tag x={820} y={380} text="El rastro de olor = su mapa" color="#6B3A1E" o={lin(f, T * 0.3, T * 0.4)} size={36} />}
      {mode === "erase" && <Tag x={700} y={400} text="Una pasada · borra el mapa" color={CL.nitrile} o={lin(f, T * 0.3, T * 0.4)} size={36} />}
      {mode === "bait" && <>
        <Tag x={1180} y={60} text="Cebo · tapita cerrada" color={CL.navy} o={lin(f, 18, 28)} size={32} />
        <Tag x={640} y={400} text="Rocía aquí · lejos del cebo" color={CL.nitrile} o={lin(f, T * 0.3, T * 0.4)} size={34} />
        <Tag x={760} y={620} text="Ni los niños ni el perro llegan" color={CL.red} o={lin(f, T * 0.5, T * 0.6)} size={34} />
      </>}
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};
