// Kit de las GRIETAS (Claudio el Albañil, ep. 5 "La casa de Doña Marta"), dentro del mundo (cama real + sombra + luz):
//   ClCoinTest     la moneda contra la grieta, en corte: result "no" (no entra: fisura de pintura) · "yes" (entra: más de 1,5 mm, vigilar)
//   ClPlasterTell  el testigo de yeso cruzando la grieta, con la fecha a lápiz, semana por semana (1→4): result "whole" (sigue entero:
//                  quieta, se arregla) · "broken" (se parte: se mueve, no se tapa, profesional). names = apodos de los testigos
//   ClCrackTypes   las 3 formas: pelo (en todas direcciones) · diagonal desde la esquina de la puerta · escalonada por las juntas;
//                  pick = la que se resalta (-1 = las tres en orden)
//   ClVFill        corte de la grieta: abrir en V → masilla elástica apretada en 2 pasadas → (afuera) malla + enduido finito
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const WALL = "#CFE3D6";
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);
const crackPath = (x: number, y: number, len: number, ang: number, seed: number, segs = 14) => {
  let d = `M ${x} ${y}`; let cx = x, cy = y;
  for (let i = 1; i <= segs; i++) { const t = len / segs; const a = ang + (rnd(seed + i) - 0.5) * 0.7; cx += Math.cos(a) * t; cy += Math.sin(a) * t; d += ` L ${cx.toFixed(1)} ${cy.toFixed(1)}`; }
  return d;
};

// ───────────────── ClCoinTest
export const ClCoinTest: React.FC<{ result?: "no" | "yes"; bed?: string }> = ({ result = "yes", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const push = ease(clamp01((f - 14) / 22));
  const yes = result === "yes";
  const depth = yes ? 120 * push : 14 * push;
  const gap = yes ? 26 : 6;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={221} dim={0.38} />
      <Contact x={760} y={900} w={900} o={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* la pared en corte (vista de arriba): dos bloques con la grieta en el medio */}
        <rect x={300} y={420} width={420 - gap / 2} height={340} fill={WALL} stroke={CL.ink} strokeWidth={6} />
        <rect x={720 + gap / 2} y={420} width={420} height={340} fill={WALL} stroke={CL.ink} strokeWidth={6} />
        <rect x={300} y={420} width={840 + gap} height={26} fill="#E9E1D2" opacity={0.8} />
        {/* la moneda de canto, entrando */}
        <g transform={`translate(${720 - 7}, ${300 + depth})`}>
          <rect x={0} y={0} width={14} height={140} rx={6} fill="url(#coin)" stroke="#8A6A1E" strokeWidth={2} />
        </g>
        <defs><linearGradient id="coin" x1="0" x2="1"><stop offset="0" stopColor="#8A6A1E" /><stop offset="0.5" stopColor="#F2D27A" /><stop offset="1" stopColor="#8A6A1E" /></linearGradient></defs>
        {/* medida */}
        <line x1={720 - gap / 2} x2={720 + gap / 2} y1={800} y2={800} stroke={CL.red} strokeWidth={5} opacity={lin(f, T * 0.5, T * 0.6)} />
      </svg>
      {/* moneda de frente (para que se lea que es una moneda) */}
      <div style={{ position: "absolute", left: 1270, top: 300, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FBE6A0, #C9A23E 70%, #8A6A1E)", boxShadow: `0 20px 40px ${CL.shadow}`, opacity: lin(f, 4, 12), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "#7A5A12" }}>$</div>
      <div style={{ position: "absolute", left: 1220, top: 560, opacity: lin(f, T * 0.5, T * 0.6) }}>
        <Tag x={0} y={0} text={yes ? "Entra: más de 1,5 mm" : "No entra: es la pintura"} color={yes ? CL.red : "#3E8A3A"} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.ink, marginTop: 14 }}>{yes ? "hay que vigilarla" : "se tapa y listo"}</div>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClPlasterTell
export const ClPlasterTell: React.FC<{ result?: "whole" | "broken"; names?: [string, string]; date?: string; bed?: string }> = ({ result = "whole", names, date = "12/9", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const week = Math.min(4, 1 + Math.floor(clamp01((f - 10) / (T * 0.7)) * 4));
  const broke = result === "broken" && week >= 3;
  const X = 260, Y = 120, W = 900, H = 820;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={231} dim={0.36} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 16, overflow: "hidden", boxShadow: `0 26px 56px ${CL.shadow}`, border: `8px solid ${CL.white}`, background: WALL, opacity: clamp01(p * 1.4) }}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <path d={crackPath(120, H - 40, 900, -0.95, 7)} stroke="#4A4A44" strokeWidth={5} fill="none" />
        </svg>
        {[{ x: 300, y: 470, n: names?.[1] }, { x: 560, y: 150, n: names?.[0] }].map((t, i) => (
          <div key={i} style={{ position: "absolute", left: t.x, top: t.y }}>
            <div style={{ position: "relative", width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E6E2D8 70%)", boxShadow: "0 6px 12px rgba(0,0,0,0.2)" }}>
              {broke && i === 0 ? <svg width={150} height={150} style={{ position: "absolute" }}><path d="M30 120 L70 80 L64 60 L110 20" stroke="#3A3A3A" strokeWidth={4} fill="none" /></svg> : null}
            </div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#3A3A3A", marginTop: 4, whiteSpace: "nowrap" }}>{date}{t.n ? ` · ${t.n}` : ""}</div>
          </div>
        ))}
      </div>
      {/* calendario de 4 semanas */}
      <div style={{ position: "absolute", left: 1250, top: 200, opacity: lin(f, 6, 14) }}>
        <Card style={{ padding: "26px 34px", width: 560 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: CL.inkSoft, marginBottom: 10 }}>EL TESTIGO</div>
          {[1, 2, 3, 4].map((w) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 10, opacity: w <= week ? 1 : 0.3 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CL.ink, width: 280, whiteSpace: "nowrap" }}>Semana {w}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: w <= week ? (result === "broken" && w >= 3 ? CL.red : "#3E8A3A") : CL.inkSoft }}>{w <= week ? (result === "broken" && w >= 3 ? "se partió" : "entero") : "·"}</div>
            </div>
          ))}
        </Card>
        <div style={{ marginTop: 22, opacity: week >= 4 ? 1 : 0 }}>
          <Tag x={0} y={0} text={result === "broken" ? "Se mueve: profesional" : "Quieta: se arregla"} color={result === "broken" ? CL.red : "#3E8A3A"} />
        </div>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClCrackTypes
const TYPES = [
  { k: "Pelo", sub: "finitas, para todos lados", draw: (s: number) => [0, 1, 2, 3, 4].map((i) => crackPath(30 + rnd(s + i) * 180, 40 + rnd(s + i + 9) * 200, 90, rnd(s + i + 3) * 6.28, s + i * 7, 6)) },
  { k: "Diagonal", sub: "sale de la esquina de una puerta", draw: (s: number) => [crackPath(70, 210, 230, -0.85, s, 12)] },
  { k: "Escalonada", sub: "baja por las juntas del ladrillo", draw: () => ["M 40 40 h 50 v 40 h 50 v 40 h 50 v 40 h 50 v 40"] },
];
export const ClCrackTypes: React.FC<{ pick?: number; bed?: string }> = ({ pick = -1, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const on = (i: number) => (pick === -1 ? lin(f, 8 + i * T * 0.25, 18 + i * T * 0.25) : i === pick ? lin(f, 6, 14) : 0.25);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={241} dim={0.38} />
      {TYPES.map((t, i) => (
        <div key={i} style={{ position: "absolute", left: 170 + i * 560, top: 230, opacity: 0.25 + 0.75 * on(i), scale: String(0.94 + 0.06 * on(i)) }}>
          <Card style={{ width: 480, padding: 22 }}>
            <div style={{ position: "relative", width: 436, height: 280, background: i === 2 ? "#C9754E" : WALL, borderRadius: 8, overflow: "hidden" }}>
              {i === 2 ? Array.from({ length: 7 }, (_, r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: r * 40, height: 4, background: "#E3D3BE" }} />) : null}
              {i === 1 ? <div style={{ position: "absolute", left: 20, top: 200, width: 70, height: 80, border: "8px solid #8A5A34", borderBottom: "none" }} /> : null}
              <svg width={436} height={280} style={{ position: "absolute" }}>{t.draw(i * 31 + 5).map((d, k) => <path key={k} d={d} stroke="#3A3A34" strokeWidth={i === 0 ? 2.5 : 5} fill="none" />)}</svg>
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink, marginTop: 14 }}>{t.k}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.inkSoft }}>{t.sub}</div>
          </Card>
        </div>
      ))}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClVFill
export const ClVFill: React.FC<{ outside?: boolean; bed?: string }> = ({ outside = false, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const steps = outside ? 4 : 3, per = (T * 0.75) / steps;
  const k = (i: number) => lin(f, 10 + i * per, 10 + i * per + 12);
  const X = 360, Y = 360, W = 1200;
  const cx = X + W / 2;
  const v = k(0);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={251} dim={0.4} />
      <Contact x={cx} y={Y + 420} w={1300} o={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* pared en corte con la grieta: primero fina, después abierta en V */}
        <path d={`M${X} ${Y} L${cx - 8 - 40 * v} ${Y} L${cx} ${Y + 220} L${cx + 8 + 40 * v} ${Y} L${X + W} ${Y} L${X + W} ${Y + 360} L${X} ${Y + 360} Z`} fill={WALL} stroke={CL.ink} strokeWidth={6} />
        {/* masilla: 2 pasadas */}
        <path d={`M${cx - 8 - 40 * v + 4} ${Y + 2} L${cx} ${Y + 210} L${cx + 8 + 40 * v - 4} ${Y + 2} Z`} fill="#F4F1EA" opacity={k(1)} />
        <rect x={cx - 70} y={Y - 6} width={140} height={8} rx={4} fill="#F4F1EA" opacity={k(2)} />
        {/* malla + enduido (afuera) */}
        {outside ? <g opacity={k(3)}><rect x={cx - 200} y={Y - 16} width={400} height={10} fill="none" stroke="#D9C46A" strokeWidth={3} strokeDasharray="6 6" /><rect x={cx - 210} y={Y - 26} width={420} height={10} rx={4} fill="#ECE8DD" /></g> : null}
      </svg>
      {["Abrir en V", "Masilla elástica, apretada", "2ª pasada, al ras", ...(outside ? ["Malla + enduido finito"] : [])].map((t, i) => (
        <div key={i} style={{ position: "absolute", left: 140, top: 90 + i * 66, opacity: 0.2 + 0.8 * k(i) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: CL.ink, whiteSpace: "nowrap" }}>{i + 1}. {t}</div>
        </div>
      ))}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
