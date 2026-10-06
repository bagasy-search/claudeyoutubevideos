// Componentes del video de la LAVADORA (reusables por el canal), DENTRO del mundo (cama real del lavadero, sombra, luz):
//   ClFilterFind  lo que sale del filtro de abajo cae a la bandeja de a uno (pelusa, monedas, horquilla, media… y el anillo que brilla)
//   ClDoseCap     la tapa dosificadora del jabón: se llena a la rayita (verde) y después hasta arriba (lo que sobra → "comida", rojo)
//   ClSmellTest   la prueba de la nariz: 3 lugares de la máquina con su medidor de olor; gana el que más huele
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

// ───────────────── ClFilterFind
type Item = { k: "lint" | "coin" | "pin" | "sock" | "ring" | "key"; label?: string };
const ItemSvg: React.FC<{ k: Item["k"]; f: number }> = ({ k, f }) => {
  if (k === "coin") return <svg width={110} height={110} viewBox="0 0 110 110"><circle cx={55} cy={55} r={46} fill="#C9A25A" stroke="#8A6B2E" strokeWidth={6} /><circle cx={55} cy={55} r={30} fill="none" stroke="#E7CC8C" strokeWidth={4} /></svg>;
  if (k === "pin") return <svg width={160} height={60} viewBox="0 0 160 60"><path d="M8 30 L150 18 M8 30 L150 42 Q156 30 150 18" stroke="#3B3B3B" strokeWidth={7} fill="none" strokeLinecap="round" /></svg>;
  if (k === "sock") return <svg width={200} height={160} viewBox="0 0 200 160"><path d="M30 10 L90 10 L95 90 Q100 120 140 125 L175 128 Q195 140 180 152 L110 155 Q50 150 40 110 Z" fill="#8C95A3" stroke="#5E6672" strokeWidth={5} /><path d="M30 10 L90 10 L90 30 L30 30 Z" fill="#6E7784" /></svg>;
  if (k === "key") return <svg width={170} height={80} viewBox="0 0 170 80"><circle cx={35} cy={40} r={26} fill="none" stroke="#B58B45" strokeWidth={12} /><path d="M60 40 L160 40 M130 40 L130 60 M148 40 L148 56" stroke="#B58B45" strokeWidth={12} strokeLinecap="round" /></svg>;
  if (k === "ring") { const g = 0.6 + 0.4 * Math.sin(f * 0.4); return <svg width={140} height={140} viewBox="0 0 140 140"><ellipse cx={70} cy={74} rx={48} ry={40} fill="none" stroke="#E2B94F" strokeWidth={14} /><ellipse cx={70} cy={74} rx={48} ry={40} fill="none" stroke="#FFF2C2" strokeWidth={4} opacity={0.8} />
    <g opacity={g}><path d="M108 30 L114 44 L128 50 L114 56 L108 70 L102 56 L88 50 L102 44 Z" fill="#FFFFFF" /></g></svg>; }
  return <svg width={210} height={120} viewBox="0 0 210 120">{Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${20 + rnd(i) * 170} ${20 + rnd(i + 3) * 80} q ${(rnd(i + 5) - 0.5) * 60} ${(rnd(i + 7) - 0.5) * 40} ${(rnd(i + 9) - 0.5) * 80} ${(rnd(i + 11) - 0.5) * 30}`} stroke={i % 3 ? "#9AA0A8" : "#C2C6CC"} strokeWidth={5} fill="none" strokeLinecap="round" />)}</svg>;
};
export const ClFilterFind: React.FC<{ items?: Item[]; bed?: string }> = ({ items = [{ k: "lint", label: "pelusa" }, { k: "coin", label: "monedas" }, { k: "pin", label: "horquillas" }, { k: "sock", label: "una media" }, { k: "ring", label: "un anillo" }], bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(10, Math.round(T * 0.7 / items.length));
  const pos = [[540, 680], [800, 700], [1040, 670], [1290, 700], [1560, 680], [1700, 700]];
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={71} dim={0.3} />
      <Contact x={1050} y={820} w={1500} o={0.35} />
      {/* bandeja baja de metal con agua gris */}
      <div style={{ position: "absolute", left: 300, top: 520, width: 1540, height: 360, borderRadius: 28, background: "linear-gradient(180deg, #D7DBE0, #AEB4BB)", boxShadow: `0 30px 60px ${CL.shadow}, inset 0 6px 0 rgba(255,255,255,0.6)` }}>
        <div style={{ position: "absolute", inset: 22, borderRadius: 18, background: "linear-gradient(180deg, rgba(120,128,120,0.75), rgba(90,96,88,0.85))" }} />
      </div>
      {items.map((it, i) => {
        const t0 = 8 + i * per, k = clamp01((f - t0) / 10); if (k <= 0) return null;
        const [x, y] = pos[i % pos.length]; const drop = interpolate(k, [0, 1], [-420, 0]); const bounce = k >= 1 ? 6 * Math.exp(-(f - t0 - 10) * 0.3) * Math.sin((f - t0) * 0.9) : 0;
        const isRing = it.k === "ring", p = isRing ? pop(f, fps, t0 + 10, 10) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + drop + bounce, translate: "-50% -50%", rotate: `${(rnd(i) - 0.5) * 40}deg`, scale: String(1.7 + 0.35 * p) }}>
            {isRing ? <div style={{ position: "absolute", left: "50%", top: "50%", width: 360, height: 360, translate: "-50% -50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,140,0.55), rgba(255,226,140,0) 65%)", opacity: p }} /> : null}
            <ItemSvg k={it.k} f={f} />
            {it.label ? <div style={{ position: "absolute", left: "50%", top: -50, translate: "-50% 0", rotate: `${(0.5 - rnd(i)) * 40}deg`, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: isRing ? 66 : 50, color: isRing ? CL.red : CL.navy, opacity: lin(f, t0 + 10, t0 + 16) }}>{it.label}</div> : null}
          </div>
        );
      })}
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClDoseCap
export const ClDoseCap: React.FC<{ good?: string; bad?: string; bed?: string }> = ({ good = "la rayita", bad = "lo que sobra se queda adentro", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const fill1 = ease(clamp01((f - 8) / (T * 0.25)));
  const fill2 = ease(clamp01((f - T * 0.45) / (T * 0.25)));
  const level = 0.45 * fill1 + 0.5 * fill2; // 0..0.95
  const H = 420, W = 380, x0 = 760, y0 = 300;
  const over = fill2 > 0.05;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={81} dim={0.3} />
      <Contact x={x0 + W / 2} y={y0 + H + 20} w={520} o={0.4} />
      <svg width={W + 40} height={H + 40} viewBox={`-20 -20 ${W + 40} ${H + 40}`} style={{ position: "absolute", left: x0 - 20, top: y0 - 20 }}>
        <defs><clipPath id="capC"><path d={`M30 0 L${W - 30} 0 L${W - 60} ${H} L60 ${H} Z`} /></clipPath>
          <linearGradient id="detG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5FB3E8" /><stop offset="1" stopColor="#2F7FC0" /></linearGradient></defs>
        <path d={`M30 0 L${W - 30} 0 L${W - 60} ${H} L60 ${H} Z`} fill="rgba(230,240,248,0.55)" stroke="#7E9AB0" strokeWidth={6} />
        <g clipPath="url(#capC)"><rect x={0} y={H * (1 - level)} width={W} height={H * level} fill="url(#detG)" opacity={0.92} />
          {over ? <rect x={0} y={H * (1 - level)} width={W} height={H * (level - 0.45)} fill={CL.red} opacity={0.45 * fill2} /> : null}</g>
        <line x1={20} x2={W - 20} y1={H * 0.55} y2={H * 0.55} stroke={CL.navy} strokeWidth={6} strokeDasharray="18 10" />
        <path d={`M38 6 L${W - 38} 6`} stroke="rgba(255,255,255,0.8)" strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: x0 + W + 40, top: y0 + H * 0.55 - 40, opacity: lin(f, 10, 20), display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 70, height: 6, background: CL.navy }} />
        <div style={{ background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 46, letterSpacing: 2, padding: "8px 24px", borderRadius: 12, textTransform: "uppercase", boxShadow: `0 14px 30px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{good}</div>
        {fill1 > 0.95 && !over ? <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#2E8B57" }}>✓</div> : null}
      </div>
      {over ? <div style={{ position: "absolute", left: x0 + W + 40, top: y0 - 10, opacity: lin(f, T * 0.6, T * 0.7), background: CL.red, color: "#fff", fontFamily: HAND, fontWeight: 700, fontSize: 56, padding: "4px 26px", borderRadius: 14, boxShadow: `0 14px 30px ${CL.shadow}` }}>{bad}</div> : null}
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClSmellTest
export const ClSmellTest: React.FC<{ spots?: { label: string; v: number }[]; img?: string; bed?: string }> = ({ spots = [{ label: "El tambor", v: 0.45 }, { label: "El cajón", v: 0.7 }, { label: "El filtro", v: 0.95 }], bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(10, Math.round(T * 0.55 / spots.length));
  const win = spots.reduce((b, s, i) => (s.v > spots[b].v ? i : b), 0);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={91} dim={0.32} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", gap: 70 }}>
        {spots.map((s, i) => {
          const t0 = 8 + i * per, k = lin(f, t0, t0 + 8), v = s.v * ease(clamp01((f - t0 - 4) / (per * 0.8)));
          const isWin = i === win && f > 8 + spots.length * per + 4; const p = isWin ? pop(f, fps, 8 + spots.length * per + 4, 10) : 0;
          return (
            <div key={i} style={{ opacity: k, translate: `0 ${(1 - k) * 40}px`, scale: String(1 + 0.08 * p) }}>
              <Card style={{ width: 400, padding: "30px 34px", borderTop: `12px solid ${isWin ? CL.red : CL.navy}` }}>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: CL.ink }}>{s.label}</div>
                <svg width={330} height={210} viewBox="0 0 330 210" style={{ marginTop: 10 }}>
                  <path d="M25 180 A 140 140 0 0 1 305 180" fill="none" stroke="#E6E1D8" strokeWidth={30} strokeLinecap="round" />
                  <path d="M25 180 A 140 140 0 0 1 305 180" fill="none" stroke={v > 0.8 ? CL.red : v > 0.55 ? CL.yellow : "#7FB77E"} strokeWidth={30} strokeLinecap="round" strokeDasharray={440} strokeDashoffset={440 * (1 - v)} />
                  <line x1={165} y1={180} x2={165 + 120 * Math.cos(Math.PI * (1 - v))} y2={180 - 120 * Math.sin(Math.PI * (1 - v))} stroke={CL.ink} strokeWidth={8} strokeLinecap="round" />
                  <circle cx={165} cy={180} r={14} fill={CL.ink} />
                </svg>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: isWin ? CL.red : CL.inkSoft, textAlign: "center" }}>{isWin ? "¡éste manda!" : v > 0.55 ? "huele" : "poquito"}</div>
              </Card>
            </div>
          );
        })}
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};
