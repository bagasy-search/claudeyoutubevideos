import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CENTURION, CIVIL, LUCIUS, Ropa as RopaT } from "./persona";
import { C, fontFamily, ent, prog, Escena, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, Particulas, Emote, cabeza, Palo, Garrote, Zzz, Moneda, Mesa, Bota } from "./kit";
import { Casco } from "./kit2";
import { Denario, Tablilla, Ropa, Soldadito, Urna, Lluvia, Fuerte } from "./kit2";
import { Cuenta } from "./P1";
import { Campamento, Interior, Valle, Tablero, Torre, pose, CarpaInterior, PlazaArmas, PuertaPretoria, Multitud, EnMano } from "./kit3";
import { Bolsa } from "./kit2";

// Parte 4 (361,98-547,17 s): trampa 4, el centurión, sobornos, fustuarium, diezmado, el aburrimiento, los inmunes y Vindolanda.
// v3 (ojo del director, vuelta 3): el protagonista (casco dorado, seed 1, LUCIUS) HACE lo que se narra en cada escena,
// nada entra vacío, textos en ranuras propias (nunca sobre una cabeza ni sobre otro texto), pies lejos del HUD de abajo a la derecha.
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const TRIBUNO: RopaT = { tunica: "#f2ead8", tunica2: "#c9bfa8", cinto: "#7a1fa3", piel: "#e8b48a", piel2: "#c98d66", pelo: "#3a2414" };
const BRITON = (i: number): RopaT => ({ tunica: ["#5c8f3e", "#7a5a2a", "#3f7a6a", "#8a6a3a"][i % 4], tunica2: "#2f4a20", cinto: "#3a2414", piel: "#86a6e8", piel2: "#5f7fc8", pelo: ["#c9662a", "#e0a63a", "#7a3a1a", "#d9b25a"][i % 4] });
const ARQUEO: RopaT = { tunica: "#c9b07a", tunica2: "#9a8050", cinto: "#5a4020", piel: "#f2c7a0", piel2: "#d9a07a", pelo: "#6b4a2a" };
const P = { seed: 1, casco: "legion" as const, ropa: LUCIUS };

// ── utilería en la mano (se cuelga de manoD/manoI de Persona)
const PalaMano: React.FC<{ rot?: number }> = ({ rot = -20 }) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-8} y={-60} width={16} height={300} rx={7} fill="#8a5a2a" />
    <path d="M -40 230 L 40 230 L 34 300 Q 0 320 -34 300 Z" fill="#8a93a3" stroke="#5d6577" strokeWidth={6} />
  </g>
);
const Martillo: React.FC = () => (
  <g transform="rotate(-90)"><rect x={-7} y={-20} width={14} height={120} rx={6} fill="#8a5a2a" /><rect x={-34} y={90} width={68} height={34} rx={6} fill="#5d6577" /></g>
);
const Jarro: React.FC<{ rot?: number }> = ({ rot = 0 }) => (
  <g transform={`rotate(${rot})`}><path d="M -26 -10 L 26 -10 L 30 70 Q 0 84 -30 70 Z" fill="#c9773a" /><path d="M 28 10 Q 60 20 46 50 L 30 50" stroke="#a8622c" strokeWidth={10} fill="none" /></g>
);
const MonedaMano: React.FC = () => <g><circle r={22} fill={C.oro} stroke="#b87a14" strokeWidth={5} /></g>;
const TablillaMano: React.FC = () => <g transform="rotate(-70)"><rect x={-50} y={-10} width={100} height={70} rx={6} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={4} /><path d="M -36 10 h 70 M -36 26 h 56 M -36 42 h 64" stroke="#2a1a10" strokeWidth={3} /></g>;

// ── piezas de escenario (todas SVG livianas)
const Fogata: React.FC<{ t: number; x: number; y: number; s?: number }> = ({ t, x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 160 * s, top: y - 300 * s, overflow: "visible" }} width={320 * s} height={320 * s} viewBox="-160 -300 320 320">
    <ellipse cx={0} cy={0} rx={150} ry={22} fill="rgba(255,150,60,.25)" />
    <rect x={-90} y={-24} width={180} height={26} rx={12} fill="#6b3a1f" transform="rotate(12)" /><rect x={-90} y={-24} width={180} height={26} rx={12} fill="#7a4a22" transform="rotate(-12)" />
    <path d={`M -60 -10 Q ${-70 + Math.sin(t * 9) * 10} -120 ${Math.sin(t * 7) * 14} ${-200 - Math.sin(t * 11) * 20} Q ${70 + Math.sin(t * 8) * 10} -120 60 -10 Z`} fill="#ff7a3d" />
    <path d={`M -34 -10 Q ${-36 + Math.sin(t * 12) * 8} -80 ${Math.sin(t * 10) * 10} ${-130 - Math.sin(t * 13) * 14} Q ${36 + Math.sin(t * 9) * 8} -80 34 -10 Z`} fill="#ffd27a" />
  </svg>
);
const Toldo: React.FC<{ x0: number; x1: number; y: number; piso?: number }> = ({ x0, x1, y, piso = 1040 }) => {
  const n = 8, w = (x1 - x0) / n;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <ellipse cx={(x0 + x1) / 2} cy={piso} rx={(x1 - x0) / 2 + 30} ry={34} fill="rgba(40,20,40,.22)" />
      {[x0 + 14, x1 - 14].map((xx) => <rect key={xx} x={xx - 9} y={y} width={18} height={piso - y} fill="#6b3a1f" />)}
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M ${x0 + i * w} ${y} L ${x0 + (i + 1) * w} ${y} L ${x0 + (i + 1) * w} ${y + 50} Q ${x0 + (i + 0.5) * w} ${y + 74} ${x0 + i * w} ${y + 50} Z`} fill={i % 2 ? "#fff3d6" : "#c81d2e"} />)}
      <path d={`M ${x0 - 20} ${y} L ${x0 + 40} ${y - 50} L ${x1 - 40} ${y - 50} L ${x1 + 20} ${y} Z`} fill="#a3202f" />
    </svg>
  );
};
const Carretilla: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <svg style={{ position: "absolute", left: x - 160, top: y - 260, overflow: "visible" }} width={320} height={280} viewBox="-160 -260 320 280">
    <path d="M -130 -110 L 110 -110 L 80 -20 L -100 -20 Z" fill="#8a5a2a" />
    <path d="M -120 -110 Q -60 -190 0 -150 Q 60 -200 110 -110 Z" fill="#5a3a1a" />
    <circle cx={60} cy={-6} r={26} fill="#3a2414" /><circle cx={60} cy={-6} r={9} fill="#8a6a3a" />
    <line x1={-100} y1={-30} x2={-160} y2={-10} stroke="#6b3a1f" strokeWidth={12} strokeLinecap="round" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={Math.sin(t * (5 + i) + i) * 70} cy={-200 + Math.cos(t * (6 + i) + i * 2) * 30} r={6} fill="#1a1010" />)}
    {[0, 1, 2].map((i) => <path key={i} d={`M ${-60 + i * 50} -170 q -14 -26 0 -50 t 0 -40`} stroke="#9ab060" strokeWidth={6} fill="none" opacity={0.5 + 0.3 * Math.sin(t * 3 + i)} />)}
  </svg>
);
const Porton: React.FC<{ x: number; y: number; abre: number }> = ({ x, y, abre }) => (
  <svg style={{ position: "absolute", left: x - 170, top: y - 360, overflow: "visible" }} width={340} height={360} viewBox="-170 -360 340 360">
    <rect x={-170} y={-360} width={50} height={360} fill="#7a4a22" /><rect x={120} y={-360} width={50} height={360} fill="#7a4a22" /><rect x={-170} y={-380} width={340} height={40} fill="#6b3a1f" />
    <g transform={`translate(-120 0) scale(${1 - abre * 0.6} 1)`}><rect x={0} y={-330} width={120} height={330} fill="#a8783a" />{[0, 1, 2].map((k) => <rect key={k} x={0} y={-300 + k * 110} width={120} height={14} fill="#6b3a1f" />)}</g>
    <g transform={`translate(120 0) scale(${-(1 - abre * 0.6)} 1)`}><rect x={0} y={-330} width={120} height={330} fill="#9a6a32" />{[0, 1, 2].map((k) => <rect key={k} x={0} y={-300 + k * 110} width={120} height={14} fill="#6b3a1f" />)}</g>
  </svg>
);
const Tina: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <svg style={{ position: "absolute", left: x - 150, top: y - 300, overflow: "visible" }} width={300} height={300} viewBox="-150 -300 300 300">
    <path d="M -130 -120 L 130 -120 L 110 0 L -110 0 Z" fill="#c9b8a0" /><ellipse cx={0} cy={-120} rx={130} ry={24} fill="#7cc4f0" />
    {[-50, 0, 50].map((xx, i) => <path key={i} d={`M ${xx} -140 q -16 -30 0 -60 t 0 -60`} stroke="#fff" strokeOpacity={0.4 + 0.3 * Math.sin(t * 3 + i)} strokeWidth={10} fill="none" strokeLinecap="round" />)}
  </svg>
);
const Tierra: React.FC<{ t: number; x0: number; y0: number; dx: number; h?: number; vel?: number }> = ({ t, x0, y0, dx, h = 160, vel = 1.3 }) => (
  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
    {Array.from({ length: 6 }, (_, i) => { const k = (t * vel + i / 6) % 1; return <circle key={i} cx={x0 + k * dx} cy={y0 - Math.sin(k * Math.PI) * h} r={9 + (i % 3) * 4} fill="#6b4a2a" />; })}
  </svg>
);
const Monticulo: React.FC<{ x: number; y: number; w: number; h: number; color?: string }> = ({ x, y, w, h, color = "#7a4a22" }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h, width: w, height: h, borderRadius: "50% 50% 0 0", background: color }} />
);
const Barril: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <svg style={{ position: "absolute", left: x - 110, top: y - 280, overflow: "visible" }} width={220} height={280} viewBox="-110 -280 220 280">
    <path d="M -90 -270 Q -120 -140 -90 0 L 90 0 Q 120 -140 90 -270 Z" fill="#a8622c" />
    {[-240, -140, -40].map((yy) => <rect key={yy} x={-104} y={yy} width={208} height={18} rx={6} fill="#5d6577" />)}
    <ellipse cx={0} cy={-270} rx={90} ry={20} fill="#7a4520" />
    <text x={0} y={-170} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#fff3d6">EMPTY</text>
    <rect x={-10} y={-90} width={60} height={18} rx={6} fill="#5d6577" />
    <circle cx={44} cy={-60 + ((t * 1.4) % 1) * 50} r={7} fill="#e9a92a" opacity={1 - ((t * 1.4) % 1)} />
  </svg>
);
// panel tipo viñeta: monta una mini escena de 1920x1080 escalada adentro de un recuadro
const Vineta: React.FC<{ t: number; t0: number; x: number; y: number; esc: number; children: React.ReactNode }> = ({ t, t0, x, y, esc, children }) => {
  const e = ent(t, t0, 0, { damping: 13, stiffness: 170 });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 1920 * esc, height: 1080 * esc, overflow: "hidden", borderRadius: 26, border: "10px solid #fff", boxShadow: "16px 18px 0 rgba(20,8,40,.35)", transform: `scale(${0.6 + 0.4 * e})`, opacity: Math.min(1, e * 1.5) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${esc})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
};
// tablón de precios (sobornos)
const Precios: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const filas: [string, number][] = [["LATRINES", 2], ["THE DITCH", 2], ["NIGHT WATCH", 3]];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 420, height: 300, borderRadius: 18, background: "linear-gradient(180deg,#b5793a,#8a5a2a)", border: "8px solid #5a3418", boxShadow: "12px 14px 0 rgba(20,8,40,.3)", transform: `scale(${ent(t, t0)})`, transformOrigin: "50% 0" }}>
      <div style={{ textAlign: "center", marginTop: 12, fontFamily, fontWeight: 700, fontSize: 40, color: "#fff3d6" }}>SKIP A JOB</div>
      {filas.map(([n, p], i) => (
        <div key={n} style={{ position: "absolute", left: 24, right: 24, top: 80 + i * 64, display: "flex", justifyContent: "space-between", fontFamily, fontWeight: 700, fontSize: 36, color: "#fff3d6", opacity: prog(t, t0 + 0.3 + i * 0.35, t0 + 0.5 + i * 0.35) }}>
          <span>{n}</span><span style={{ color: C.oro }}>{p} ●</span>
        </div>
      ))}
    </div>
  );
};
// tarjeta de trato: paga / no paga
const Trato: React.FC<{ t: number; t0: number; x: number; paga: boolean; txt: string; bien: boolean; s?: number; top?: number }> = ({ t, t0, x, paga, txt, bien, s = 1, top = 230 }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x - 270, top, width: 540, height: 620, borderRadius: 34, background: bien ? "#effbe8" : "#ffe6ea", border: `10px solid ${bien ? "#3fa34d" : C.rojo}`, transform: `translateY(${(1 - e) * 500}px) rotate(${(1 - e) * 12}deg) scale(${s})`, transformOrigin: "50% 0", boxShadow: "16px 18px 0 rgba(20,8,40,.35)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 64, color: paga ? "#3a2a00" : C.rojo }}>{paga ? "PAY UP" : "DON'T PAY"}</div>
      <div style={{ position: "absolute", left: 270 - 90, top: 140 }}>
        {paga ? <div style={{ position: "relative", width: 180, height: 180 }}>{[0, 1, 2].map((i) => <Denario key={i} x={90 + (i - 1) * 40} y={90 - i * 14} r={60} gira={t * 2 + i} />)}</div>
          : <svg width={180} height={180} viewBox="-90 -90 180 180"><circle r={80} fill="none" stroke={C.rojo} strokeWidth={16} /><path d="M -56 56 L 56 -56" stroke={C.rojo} strokeWidth={16} /></svg>}
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: "#2a1530" }}>{txt}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontSize: 90, transform: `scale(${ent(t, t0 + 0.5)})`, fontFamily, fontWeight: 700, color: bien ? "#3fa34d" : C.rojo }}>{bien ? "✓" : "✗"}</div>
    </div>
  );
};
// palo de vid que se parte en dos
const PaloRoto: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const k = Math.max(0, t - t0);
  const a = Math.min(1, k * 3);
  return (
    <svg style={{ position: "absolute", left: x - 300, top: y - 300, overflow: "visible" }} width={600} height={600}>
      <g transform={`translate(${300 - a * 160} ${300 - a * 120 + k * k * 300}) rotate(${-30 - a * 200})`}><rect x={-160} y={-12} width={160} height={24} rx={10} fill="#7a5a2a" /></g>
      <g transform={`translate(${300 + a * 160} ${300 - a * 80 + k * k * 300}) rotate(${-30 + a * 160})`}><rect x={0} y={-12} width={160} height={24} rx={10} fill="#7a5a2a" /></g>
      {k < 0.4 && Array.from({ length: 10 }, (_, i) => { const an = (i / 10) * Math.PI * 2; return <line key={i} x1={300 + Math.cos(an) * 30 * (1 + k * 8)} y1={300 + Math.sin(an) * 30 * (1 + k * 8)} x2={300 + Math.cos(an) * 60 * (1 + k * 8)} y2={300 + Math.sin(an) * 60 * (1 + k * 8)} stroke="#ffe08a" strokeWidth={10} strokeLinecap="round" opacity={1 - k * 2.5} />; })}
    </svg>
  );
};
// planilla de guardias (Egipto): renglones fantasma que se llenan con ícono y tilde
const Planilla: React.FC<{ t: number; t0: number; x: number; y: number; activo?: number; items: { txt: string; t0: number; ic: string }[] }> = ({ t, t0, x, y, items, activo = -1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 640, height: 560, transform: `scale(${ent(t, t0)}) rotate(-1.5deg)`, transformOrigin: "50% 0" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#f2dfae,#e2c588)", borderRadius: 16, border: "6px solid #b98a4a", boxShadow: "14px 16px 0 rgba(20,8,40,.35)" }} />
    <div style={{ position: "absolute", top: 20, width: "100%", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: "#7a3d14", letterSpacing: 2 }}>DUTY ROSTER · EGYPT</div>
    <div style={{ position: "absolute", top: 76, width: "100%", textAlign: "center", fontFamily, fontWeight: 600, fontSize: 28, color: "#9a6a3a" }}>NAME: LUCIUS · LEGIO III</div>
    {items.map((it, i) => {
      const on = t >= it.t0, a = on ? ent(t, it.t0) : 0;
      return (
        <div key={i} style={{ position: "absolute", left: 28, right: 28, top: 130 + i * 82, height: 70, paddingLeft: 12, borderRadius: 14, display: "flex", alignItems: "center", gap: 18, fontFamily, fontWeight: 700, fontSize: 40, color: i === activo ? "#fff" : "#4a2a10", background: i === activo ? "#2a1530" : "transparent", transform: `scale(${i === activo ? 1.05 : 1})`, transformOrigin: "0 50%" }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: on ? C.rojo : "rgba(160,110,50,.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, transform: `scale(${on ? a : 1})` }}>{on ? it.ic : ""}</div>
          {on ? <span style={{ opacity: a, transform: `translateX(${(1 - a) * -40}px)` }}>{it.txt}</span>
            : <svg width={420} height={20}><path d={`M 0 10 q 20 -${6 + i} 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`} stroke="#c79a5a" strokeWidth={5} fill="none" opacity={0.6} /></svg>}
        </div>
      );
    })}
  </div>
);
// tarjeta de un inmune trabajando (persona + herramienta dentro del recuadro)
type Of = "agrimensor" | "escriba" | "herrero" | "arquero" | "medico" | "animales";
const InmuneCard: React.FC<{ t: number; t0: number; x: number; y: number; of: Of; label: string; seed: number; fondo: string }> = ({ t, t0, x, y, of, label, seed, fondo }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 12, stiffness: 180 });
  const W = 500, H = 380;
  const acc = of === "agrimensor" ? pose("contar", t) : of === "escriba" ? pose("escribir", t) : of === "herrero" ? pose("martillar", t, 1.4) : of === "arquero" ? pose("empujar", t, 0.8) : of === "medico" ? pose("contar", t, 0.7) : pose("barrer", t, 0.9);
  const golpe = Math.max(0, Math.sin(t * 1.4 * Math.PI * 2));
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y - H / 2, width: W, height: H, borderRadius: 24, overflow: "hidden", background: `linear-gradient(180deg, ${fondo}, #fff3d6)`, border: "8px solid #2a1530", boxShadow: "12px 14px 0 rgba(20,8,40,.35)", transform: `scale(${e}) rotate(${(1 - e) * -6}deg)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, bottom: 0, background: "#d9a35a" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={W} height={H}>
        {of === "agrimensor" && <g><line x1={340} y1={270} x2={340} y2={60} stroke="#6b3a1f" strokeWidth={10} /><line x1={270} y1={74} x2={410} y2={74} stroke="#6b3a1f" strokeWidth={8} />{[270, 410].map((xx, i) => <g key={xx}><line x1={xx} y1={74} x2={xx + Math.sin(t * 2 + i) * 6} y2={150} stroke="#5d6577" strokeWidth={3} /><circle cx={xx + Math.sin(t * 2 + i) * 6} cy={156} r={8} fill="#5d6577" /></g>)}<path d="M 380 250 L 470 250" stroke="#fff" strokeWidth={4} strokeDasharray="10 8" /></g>}
        {of === "escriba" && <g><rect x={240} y={196} width={190} height={16} rx={5} fill="#8a5a2a" /><rect x={256} y={212} width={12} height={58} fill="#6b3a1f" /><rect x={404} y={212} width={12} height={58} fill="#6b3a1f" /><rect x={290} y={164} width={110} height={34} rx={4} fill="#c9a46a" />{[0, 1, 2].map((k) => <line key={k} x1={300} y1={174 + k * 9} x2={300 + Math.min(90, ((t * 60 + k * 30) % 100))} y2={174 + k * 9} stroke="#2a1a10" strokeWidth={2} />)}</g>}
        {of === "herrero" && <g><path d="M 250 230 L 400 230 L 380 250 L 345 250 L 355 280 L 295 280 L 305 250 L 270 250 Z" fill="#5d6577" /><path d="M 250 230 L 400 230 L 392 214 L 258 214 Z" fill="#8a93a3" /><rect x={280} y={206} width={90} height={10} rx={4} fill={golpe > 0.8 ? "#ffb347" : "#d8dde6"} />{golpe > 0.7 && [0, 1, 2, 3, 4].map((k) => <line key={k} x1={325} y1={205} x2={325 + Math.cos(k * 1.2 + 3.6) * 50} y2={205 + Math.sin(k * 1.2 + 3.6) * 40} stroke="#ffd27a" strokeWidth={5} strokeLinecap="round" />)}</g>}
        {of === "arquero" && <g><rect x={250} y={230} width={200} height={14} rx={5} fill="#8a5a2a" /><path d={`M 290 ${226} Q 350 ${150 - Math.sin(t * 2.5) * 20} 420 226`} stroke="#8a5a2a" strokeWidth={12} fill="none" strokeLinecap="round" /><line x1={290} y1={226} x2={420} y2={226} stroke="#e8e0d0" strokeWidth={3} /></g>}
        {of === "medico" && <g><rect x={260} y={210} width={220} height={20} rx={6} fill="#8a5a2a" /><rect x={268} y={230} width={10} height={40} fill="#6b3a1f" /><rect x={462} y={230} width={10} height={40} fill="#6b3a1f" /><ellipse cx={370} cy={196} rx={90} ry={20} fill="#d8443a" /><circle cx={455} cy={186} r={26} fill="#f2b48a" /><rect x={430} y={160} width={50} height={14} rx={6} fill="#fff" /><path d="M 350 186 l 30 0" stroke="#fff" strokeWidth={14} /></g>}
        {of === "animales" && <g>{[0, 1].map((k) => { const b = Math.abs(Math.sin(t * 6 + k * 2)) * 14; return <g key={k} transform={`translate(${320 + k * 100} ${236 + b})`}><ellipse cx={0} cy={0} rx={30} ry={22} fill="#fff" /><circle cx={24} cy={-20} r={13} fill="#fff" /><path d="M 34 -20 L 46 -16 L 34 -13 Z" fill="#e9a92a" /><path d="M 20 -34 q 4 -8 10 0" fill={C.rojo} /><rect x={-6} y={18} width={4} height={14} fill="#e9a92a" /><rect x={6} y={18} width={4} height={14} fill="#e9a92a" /></g>; })}{Array.from({ length: 6 }, (_, k) => { const u = (t * 1.2 + k / 6) % 1; return <circle key={k} cx={250 + k * 14} cy={150 + u * 110} r={4} fill="#e9a92a" />; })}</g>}
      </svg>
      <Persona x={150} y={268} h={230} t={t} seed={seed} casco="legion" expr="feliz" {...acc} manoD={of === "herrero" ? <Martillo /> : undefined} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 74, background: "#2a1530", color: "#fff", fontFamily, fontWeight: 700, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 1 }}>{label}</div>
    </div>
  );
};
// balanza: soldado común vs. con oficio
const Balanza: React.FC<{ t: number; x: number; y: number; incl: number; monedas: number }> = ({ t, x, y, incl, monedas }) => {
  const a = (incl * Math.PI) / 180, Lb = 250;
  const ex = Math.cos(a) * Lb, ey = Math.sin(a) * Lb;
  const Plato = ({ px, py, children }: { px: number; py: number; children: React.ReactNode }) => (
    <g transform={`translate(${px} ${py})`}><line x1={0} y1={0} x2={-70} y2={150} stroke="#5d6577" strokeWidth={4} /><line x1={0} y1={0} x2={70} y2={150} stroke="#5d6577" strokeWidth={4} /><path d="M -96 150 L 96 150 Q 70 190 0 192 Q -70 190 -96 150 Z" fill="#e9a92a" stroke="#a8650f" strokeWidth={5} />{children}</g>
  );
  return (
    <svg style={{ position: "absolute", left: x - 340, top: y - 700, overflow: "visible" }} width={680} height={700} viewBox="-340 -700 680 700">
      <path d="M -120 0 L 120 0 L 70 -40 L -70 -40 Z" fill="#7a4520" /><rect x={-12} y={-540} width={24} height={500} fill="#8a5a2a" /><circle cx={0} cy={-540} r={22} fill="#e9a92a" />
      <line x1={-ex} y1={-540 - ey} x2={ex} y2={-540 + ey} stroke="#7a4520" strokeWidth={18} strokeLinecap="round" />
      <Plato px={-ex} py={-540 - ey}><g transform="translate(0 150)"><circle cx={0} cy={-46} r={16} fill="#f2b48a" /><path d="M -16 -50 Q 0 -72 16 -50 Z" fill="#e2a531" /><rect x={-14} y={-30} width={28} height={30} rx={8} fill="#d8443a" /></g><text x={0} y={232} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#2a1530">SHOVEL</text></Plato>
      <Plato px={ex} py={-540 + ey}><g transform="translate(0 150)"><path d="M -40 -6 L 40 -6 L 30 -22 L -30 -22 Z" fill="#5d6577" /><rect x={-8} y={-60} width={16} height={40} fill="#8a5a2a" />{Array.from({ length: monedas }, (_, k) => <circle key={k} cx={-50 + (k % 5) * 25} cy={-12 - Math.floor(k / 5) * 14} r={14} fill={C.oro} stroke="#a8650f" strokeWidth={3} />)}</g><text x={0} y={232} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#2a1530">SKILLED</text></Plato>
      {void t}
    </svg>
  );
};
// paquete que se abre
const Paquete: React.FC<{ t: number; x: number; y: number; tAbre: number }> = ({ t, x, y, tAbre }) => {
  const u = prog(t, tAbre - 0.25, tAbre + 0.1);
  const tiembla = t < tAbre ? Math.sin(t * 30) * 3 : 0;
  return (
    <svg style={{ position: "absolute", left: x - 140, top: y - 220, overflow: "visible" }} width={280} height={220} viewBox="-140 -220 280 220">
      <g transform={`rotate(${tiembla} 0 0)`}>
        <rect x={-120} y={-130} width={240} height={130} rx={8} fill="#c9a46a" /><rect x={-120} y={-130} width={240} height={20} fill="#a8833e" />
        <rect x={-10} y={-130} width={20} height={130} fill={C.rojo} opacity={1 - u} />
        <g transform={`translate(-124 -130) rotate(${-u * 120})`}><rect x={0} y={-30} width={248} height={34} rx={6} fill="#d9b478" /></g>
      </g>
    </svg>
  );
};
// mini mapa de Britania con el muro y el pin
const MiniBritania: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  if (t < t0) return null;
  const k = ((t - t0) % 1.3) / 1.3;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 330, height: 280, borderRadius: 20, background: "#4f8fc8", border: "8px solid #fff", boxShadow: "10px 12px 0 rgba(20,8,40,.3)", transform: `scale(${ent(t, t0)})`, transformOrigin: "0 0", overflow: "hidden" }}>
      <svg width={330} height={280} viewBox="0 0 330 280">
        <path d="M 150 20 Q 200 30 190 70 Q 220 100 200 130 Q 250 170 240 220 Q 200 250 130 250 Q 90 240 110 210 Q 70 190 100 150 Q 80 110 120 90 Q 100 50 150 20 Z" fill="#8fd16a" stroke="#5a9a40" strokeWidth={4} />
        <line x1={112} y1={120} x2={205} y2={112} stroke="#8a5a2a" strokeWidth={7} strokeDasharray="10 4" />
        <circle cx={160} cy={116} r={10 + k * 26} fill="none" stroke={C.rojo} strokeWidth={4} opacity={1 - k} /><circle cx={160} cy={116} r={10} fill={C.rojo} stroke="#fff" strokeWidth={3} />
        <text x={165} y={268} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={26} fill="#fff">VINDOLANDA</text>
      </svg>
    </div>
  );
};
const Sombrero: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => {
  const c = L(x, y, h);
  return <svg style={{ position: "absolute", left: c.x - 160 * c.s, top: c.y - 160 * c.s, overflow: "visible" }} width={320 * c.s} height={200 * c.s} viewBox="-160 -160 320 200"><ellipse cx={0} cy={-60} rx={150} ry={26} fill="#a8833e" /><path d="M -80 -62 Q -76 -150 0 -150 Q 76 -150 80 -62 Z" fill="#c9a46a" /><rect x={-80} y={-84} width={160} height={16} fill="#6b4a2a" /></svg>;
};
const Capa: React.FC<{ t: number; x: number; y: number; h: number }> = ({ t, x, y, h }) => {
  const S = h / 560, sx = x, sy = y - 330 * S;
  const f = Math.sin(t * 7) * 30 * S, f2 = Math.sin(t * 9 + 1) * 24 * S;
  return <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}><path d={`M ${sx - 60 * S} ${sy} L ${sx + 60 * S} ${sy} Q ${sx + 40 * S} ${sy + 160 * S} ${sx - 200 * S + f2} ${sy + 230 * S + f} Q ${sx - 260 * S + f} ${sy + 120 * S} ${sx - 300 * S + f2} ${sy + 40 * S + f} Q ${sx - 160 * S} ${sy + 20 * S} ${sx - 60 * S} ${sy} Z`} fill="#8e1626" /></svg>;
};
// tumbas de los que no sobrevivieron
const Tumbas: React.FC<{ t: number; t0: number; xs: number[]; y: number }> = ({ t, t0, xs, y }) => (
  <>{xs.map((x, i) => t >= t0 + i * 0.12 && (
    <div key={i}>
      <Monticulo x={x} y={y} w={190} h={60} color="#4a3a5a" />
      <svg style={{ position: "absolute", left: x - 60, top: y - 200, overflow: "visible", transform: `scale(${ent(t, t0 + i * 0.12)})`, transformOrigin: "50% 100%" }} width={120} height={150}><rect x={52} y={10} width={16} height={140} fill="#8a6a3a" /><rect x={20} y={40} width={80} height={16} fill="#8a6a3a" /></svg>
      <Casco x={x + 50} y={y - 40} s={0.35} rot={-14} />
    </div>
  ))}</>
);

// ── v4: utilería para AGARRAR (mango en 0,0 hacia +x) y muebles
const Vara: React.FC<{ largo?: number }> = ({ largo = 280 }) => (
  <g>
    <path d={`M -30 0 Q ${largo * 0.45} -6 ${largo} 3`} stroke="#6b3a1f" strokeWidth={16} fill="none" strokeLinecap="round" />
    {[0.3, 0.6, 0.85].map((k) => <circle key={k} cx={largo * k} cy={-1} r={9} fill="#7d4a24" />)}
  </g>
);
const MonedaAg: React.FC = () => <g><circle cx={16} r={20} fill={C.oro} stroke="#b87a14" strokeWidth={5} /><circle cx={16} r={8} fill="none" stroke="#b87a14" strokeWidth={3} /></g>;
const JarroAg: React.FC<{ boca?: boolean }> = ({ boca }) => <g transform={`rotate(${boca ? 180 : 0}) translate(10 0)`}><path d="M -10 -30 L 70 -30 L 64 34 Q 30 44 -4 34 Z" fill="#c9773a" /><ellipse cx={30} cy={-30} rx={40} ry={8} fill="#7a4520" /></g>;
const Cepillo: React.FC = () => <g><rect x={-20} y={-6} width={120} height={12} rx={5} fill="#8a5a2a" /><rect x={96} y={-18} width={44} height={36} rx={6} fill="#e9d29a" /></g>;
const MediasAg: React.FC = () => <g transform="rotate(90) translate(0 -60) scale(.7)"><path d="M -30 -90 L 30 -90 L 30 30 Q 90 40 80 80 Q 70 100 -10 96 Q -40 90 -30 40 Z" fill="#c9a0e8" stroke="#7a4a9a" strokeWidth={6} /></g>;
const Banco: React.FC<{ x: number; y: number; w?: number; alto?: number }> = ({ x, y, w = 240, alto = 120 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - alto, overflow: "visible" }} width={w} height={alto}>
    <ellipse cx={w / 2 - 20} cy={alto} rx={w / 2 + 20} ry={12} fill="#1d0f33" opacity={0.22} />
    <rect x={8} y={0} width={w - 16} height={24} rx={8} fill="#a8622c" /><rect x={26} y={20} width={20} height={alto - 20} fill="#6b3a1f" /><rect x={w - 46} y={20} width={20} height={alto - 20} fill="#6b3a1f" />
  </svg>
);
const Podio: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 340, h = 150 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - h, overflow: "visible" }} width={w} height={h}>
    <ellipse cx={w / 2 - 30} cy={h} rx={w / 2 + 30} ry={16} fill="#1d0f33" opacity={0.25} />
    <rect x={0} y={0} width={w} height={h} rx={6} fill="#d8c8a8" /><rect x={0} y={0} width={w} height={22} fill="#efe2c4" />
    {[0.2, 0.5, 0.8].map((k) => <rect key={k} x={w * k - 14} y={30} width={28} height={h - 40} rx={6} fill="#c4b08e" />)}
  </svg>
);
// tablilla de informe en grande (inserto): título + texto que se escribe letra por letra
const Informe: React.FC<{ t: number; t0: number; x: number; y: number; titulo: string; texto: string; tEsc: [number, number] }> = ({ t, t0, x, y, titulo, texto, tEsc }) => {
  if (t < t0) return null;
  const n = Math.round(texto.length * prog(t, tEsc[0], tEsc[1]));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 680, height: 330, borderRadius: 22, background: "#c9a46a", border: "10px solid #8a6a3a", boxShadow: "14px 16px 0 rgba(20,8,40,.35)", transform: `scale(${ent(t, t0)}) rotate(-1.5deg)`, transformOrigin: "20% 100%" }}>
      <div style={{ position: "absolute", inset: 16, borderRadius: 12, background: "#3a2a20" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 48, color: C.oro, letterSpacing: 3 }}>{titulo}</div>
      <div style={{ position: "absolute", left: 50, right: 40, top: 112, fontFamily, fontWeight: 700, fontSize: 52, lineHeight: 1.25, color: "#f2e6c8" }}>{texto.slice(0, n)}<span style={{ opacity: Math.sin(t * 12) > 0 ? 1 : 0 }}>|</span></div>
    </div>
  );
};
// globo de diálogo con colita (para que el texto salga de una boca, no flote)
const Globo: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; txt: string; size?: number; cola?: "izq" | "der" }> = ({ t, t0, t1 = 1e9, x, y, txt, size = 52, cola = "izq" }) => {
  if (t < t0 || t > t1) return null;
  const lado: React.CSSProperties = cola === "izq" ? { left: 60 } : { right: 60 };
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${ent(t, t0)})`, transformOrigin: cola === "izq" ? "10% 120%" : "90% 120%" }}>
      <div style={{ position: "relative", padding: "20px 34px", borderRadius: 40, background: "#fff", border: "8px solid #2a1530", fontFamily, fontWeight: 700, fontSize: size, color: "#2a1530", whiteSpace: "nowrap" }}>
        {txt}
        <svg style={{ position: "absolute", top: "100%", marginTop: -8, overflow: "visible", ...lado }} width={60} height={60}><path d={cola === "izq" ? "M 0 0 L 50 0 L 6 54 Z" : "M 10 0 L 60 0 L 54 54 Z"} fill="#fff" stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" /><rect x={cola === "izq" ? 4 : 14} y={-12} width={42} height={16} fill="#fff" /></svg>
      </div>
    </div>
  );
};
const VaraAng = (bD: number) => 30 - ((bD - 10) / 150) * 140; // la vara acompaña el golpe (abajo-adelante → arriba-atrás)
const LILA = { ...CENTURION, tunica: "#7a1fa3", tunica2: "#4a0f6a" };
const PAGA = [399.2, 400.3, 401.4, 403.7];
const puesto = (t: number) => (t < 461.92 ? 0 : t < 463.0 ? 1 : t < 463.92 ? 2 : t < 465.26 ? 3 : t < 469.12 ? 4 : 5);

export const P4: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 098 · trampa cuatro: el centurión (tablero al 85 % centrado, sobre la mesa) */}
    <Escena t={t} t0={361.98} t1={364.1} entra="corte" golpes={[362.2, 363.28]}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #7a4a22, #4a2a14)" }} />
      <div style={{ position: "absolute", inset: 0, transform: "scale(.85)", transformOrigin: "52% 56%", borderRadius: 40, overflow: "hidden", boxShadow: "0 0 0 14px #8a5a2a, 20px 24px 0 14px rgba(0,0,0,.35)" }}>
        <Tablero t={t} t0={361.6} en={3} de={2} tAvanza={362.1} marca={363.0} hecho={3} />
      </div>
      <Chip t={t} t0={362.2} text="TRAP 4 OF 7" color={C.rojo} x={760} y={200} centro size={64} />
      <Grande t={t} t0={363.28} text="THE CENTURION" x={900} y={420} size={120} />
    </Escena>

    {/* 099 · tu vida la maneja un solo hombre: contrapicado, el centurión gigante con la vara; él chiquito y asustado */}
    <Escena t={t} t0={364.1} t1={367.1} zoom={0.06} entra="zoom" golpes={[365.2, 366.22]}>
      <Campamento t={t} hora="tarde" angulo="bajo" />
      {(() => { const sw = 50 + Math.max(0, Math.sin(t * 7)) * 45; return (
        <Persona x={1140} y={1070} h={860} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip expr="enojado" mira={-0.4} bD={sw} cD={70} bI={45} cI={95} agarra={<Vara />} agarraAng={VaraAng(sw) - 20} />
      ); })()}
      <Persona x={430} y={1060} h={430} t={t} {...P} giro="34" expr="miedo" mira={0.6} {...pose("temblar", t)} reaccion="susto" reaccionT0={365.4} />
      <Chip t={t} t0={365.2} text="ONE MAN" color={C.rojo} x={140} y={170} size={72} />
      <Chip t={t} t0={366.22} text="RUNS YOUR LIFE" color="#2a1530" x={140} y={290} size={62} />
    </Escena>

    {/* 100 · manda a 80 soldados: la centuria formada en la plaza de armas (multitud con profundidad) */}
    <Escena t={t} t0={367.1} t1={368.4} entra="corte" golpes={[367.66]}>
      <PlazaArmas t={t} />
      <Multitud t={t} n={21} filas={3} x0={240} x1={1680} y={1050} h={330} seed={21} poses={["quieto", "saludar", "quieto", "cadera"]} rompe={2} />
      <Cuenta t={t} t0={367.4} t1={368.0} de={0} a={80} x={960} y={220} size={180} color={C.oro} suf=" MEN" />
    </Escena>

    {/* 101 · el veterano entra de perfil con la vara, se planta y se golpea la palma; la fila tiembla */}
    <Escena t={t} t0={368.4} t1={373.8} zoom={0.05} entra="corte" golpes={[369.7, 370.28, 372.36]}>
      <PlazaArmas t={t} />
      <Multitud t={t} n={7} filas={2} x0={1140} x1={1700} y={1050} h={400} seed={31} expr="miedo" mira={-0.6} giro="34" flip poses={["temblar", "quieto", "temblar", "saludar"]} rompe={1} />
      <Persona x={1000} y={1050} h={440} t={t} {...P} giro="34" flip expr="miedo" mira={-0.4} {...pose("saludar", t, 0.5)} />
      {(() => {
        const u = prog(t, 368.4, 369.5), x = 300 + u * 320;
        const anda = t < 369.5;
        const golpe = Math.max(0, Math.sin((t - 369.5) * 7));
        const bD = anda ? 40 : 60 + golpe * 50;
        const c = L(x, 1050, 640);
        return <>
          <Persona x={x} y={1050} h={640} t={t} seed={60} ropa={CENTURION} casco="centurion" giro={anda ? "perfil" : "34"} expr="enojado" camina={anda ? 1.5 : 0}
            bD={bD} cD={anda ? 20 : 40} bI={anda ? 20 : 70} cI={anda ? 20 : 95} agarra={<Vara />} agarraAng={anda ? 50 : 10 - golpe * 70} />
          {t > 370.6 && [[-40, -30, 30], [30, 10, -20], [-10, 40, 15]].map(([dx, dy, r], i) => (
            <div key={i} style={{ position: "absolute", left: c.x + 20 + dx * 2.1 - 34, top: c.y + dy * 2.1 - 5, width: 68 * prog(t, 370.6 + i * 0.25, 370.9 + i * 0.25), height: 10, borderRadius: 5, background: "#8c1d34", transform: `rotate(${r}deg)` }} />
          ))}
        </>;
      })()}
      <Chip t={t} t0={369.7} text="VETERAN" color={C.ambar} tinta={C.noche} x={140} y={200} size={68} />
      <Cuenta t={t} t0={370.28} t1={370.8} de={0} a={20} x={1360} y={200} size={120} color="#fff" suf=" YEARS" />
      <Chip t={t} t0={371.0} text="OF SCARS" color={C.rojo} x={1360} y={330} centro size={62} />
      <Chip t={t} t0={372.36} text="A VINE STICK" color={C.lima} tinta={C.noche} x={140} y={320} size={62} />
    </Escena>

    {/* 102 · ese palo no es decoración: es como te habla (plano bajo, él se agacha cubriéndose) */}
    <Escena t={t} t0={373.8} t1={377.4} entra="corte" golpes={[374.64, 376.46]}>
      <PlazaArmas t={t} hora="tarde" angulo="bajo" />
      {(() => {
        const sw = t > 375.9 ? interpolate(((t - 375.9) * 2.2) % 1, [0, 0.4, 1], [150, 20, 150]) : 60 + Math.sin(t * 4) * 10;
        return <>
          <Persona x={700} y={1070} h={700} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" expr="enojado" habla={t > 376.2} bD={sw} cD={30} bI={30} cI={60} agarra={<Vara />} agarraAng={VaraAng(sw)} />
          <Persona x={1320} y={1060} h={540} t={t} {...P} giro="34" flip postura="agachado" expr="miedo" bD={150} bI={150} cD={100} cI={100} reaccion="susto" reaccionT0={376.25} />
        </>;
      })()}
      <Chip t={t} t0={374.64} text="NOT DECORATION" color={C.rojo} x={140} y={160} size={64} />
      <Globo t={t} t0={376.2} x={240} y={250} txt="IT'S HOW HE TALKS TO YOU" size={54} cola="der" />
    </Escena>

    {/* 103 · Tácito sentado escribe con la pluma; en la viñeta, el centurión Lucilius levanta la vara */}
    <Escena t={t} t0={377.4} t1={381.2} zoom={0.04} entra="corte" golpes={[378.12, 380.34]}>
      <Interior t={t} ventana={false} />
      <Mesa x={640} y={800} w={380} />
      <Tablilla x={680} y={770} s={0.3} t={t} texto={["~~ ~~~", "~~~ ~"]} />
      <Banco x={330} y={1040} w={220} alto={128} />
      <Persona x={330} y={1040} h={560} t={t} seed={33} ropa={CIVIL(2)} viejo giro="34" postura="sentado" expr="neutro" mira={0.5} {...pose("escribir", t)} agarra={<EnMano.pluma />} agarraAng={-30} />
      <Vineta t={t} t0={377.45} x={900} y={300} esc={0.44}>
        <PlazaArmas t={t} hora="tarde" />
        {(() => { const sw = interpolate(((t - 377) * 2.2) % 1, [0, 0.4, 1], [160, 20, 160]); return (
          <Persona x={820} y={1050} h={720} t={t} seed={61} ropa={CENTURION} casco="centurion" giro="34" expr="enojado" bD={sw} cD={20} agarra={<Vara />} agarraAng={VaraAng(sw)} />
        ); })()}
        <Persona x={1320} y={1050} h={560} t={t} {...P} giro="34" flip postura="agachado" expr="miedo" bD={150} bI={150} cD={90} cI={90} />
      </Vineta>
      <Chip t={t} t0={378.12} text="TACITUS, HISTORIAN" color={C.violeta} x={140} y={170} size={64} t1={380.0} />
      <Grande t={t} t0={380.34} text="LUCILIUS" x={1330} y={180} size={116} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 104 · pegaba tanto que el palo se le partía en la espalda (el centurión se queda mirando el muñón) */}
    <Escena t={t} t0={381.2} t1={388.4} zoom={0.05} entra="corte" golpes={[381.36, 383.12, 385.12, 387.84]}>
      <PlazaArmas t={t} hora="tarde" />
      <Multitud t={t} n={5} filas={1} x0={1380} x1={1720} y={1000} h={340} seed={41} expr="miedo" giro="34" flip poses={["temblar", "quieto", "temblar"]} rompe={0} />
      {(() => {
        const ciclo = t < 385.1 ? interpolate(((t - 381.3) * 2.6) % 1, [0, 0.35, 1], [160, 10, 160]) : 70;
        return <>
          <Persona x={1080} y={1050} h={500} t={t} {...P} giro="34" flip postura="agachado" expr="triste" inclina={14} bD={150} bI={150} cD={100} cI={100} />
          <Persona x={700} y={1050} h={640} t={t} seed={61} ropa={CENTURION} casco="centurion" giro="34" expr="enojado" bD={ciclo} cD={20} bI={30} cI={50} agarra={<Vara largo={t < 385.12 ? 280 : 110} />} agarraAng={VaraAng(ciclo)} reaccion="ojos" reaccionT0={385.3} />
          <Emote t={t} t0={381.6} tipo="susto" {...L(1080, 1100, 500)} />
        </>;
      })()}
      {t > 385.12 && <PaloRoto t={t} t0={385.12} x={1000} y={560} />}
      <div style={{ position: "absolute", left: 1180, top: 140, padding: "10px 26px", borderRadius: 18, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 50, color: "#fff" }}>STICKS BROKEN: {t > 385.12 ? 1 : 0}</div>
      <Chip t={t} t0={381.96} text="SO OFTEN" color={C.ambar} tinta={C.noche} x={140} y={160} size={62} t1={384.9} />
      <Chip t={t} t0={383.12} text="SO HARD" color={C.rojo} x={140} y={280} size={62} t1={384.9} />
      <Grande t={t} t0={385.12} text="SNAP!" x={1180} y={330} size={170} color={C.oro} borde="#2a1530" />
      <Globo t={t} t0={387.22} x={180} y={330} txt="A NEW ONE!" size={56} cola="der" />
    </Escena>

    {/* 105 · «Cedo alteram»: traeme otro. Él le alcanza vara tras vara; la pila crece */}
    <Escena t={t} t0={388.4} t1={393.0} entra="sube" banda={C.rojo} golpes={[388.56, 389.74, 392.18]}>
      <PlazaArmas t={t} hora="tarde" />
      {Array.from({ length: 8 }, (_, i) => {
        const t0 = 388.4 + i * 0.32;
        if (t < t0) return null;
        const k = Math.min(1, (t - t0) * 2.5);
        return <div key={i} style={{ position: "absolute", left: 260 + (i % 4) * 70, top: interpolate(k, [0, 1], [560, 960 - Math.floor(i / 4) * 26]), width: 240, height: 22, borderRadius: 10, background: "#7a5a2a", transform: `rotate(${-8 + i * 5}deg)`, boxShadow: "4px 4px 0 rgba(0,0,0,.2)" }} />;
      })}
      {(() => { const sw = interpolate(((t - 388.4) * 3.1) % 1, [0, 0.35, 1], [160, 20, 160]); return (
        <Persona x={980} y={1050} h={560} t={t} seed={61} ropa={CENTURION} casco="centurion" giro="34" expr="enojado" habla={t > 389.6 && t < 391} bD={sw} cD={20} bI={70} cI={20} agarra={<Vara largo={260} />} agarraAng={VaraAng(sw)} />
      ); })()}
      <Persona x={1310} y={1050} h={490} t={t} {...P} giro="34" flip expr="miedo" bD={80 + Math.sin(t * 19) * 10} cD={15} inclina={-6} agarra={<Vara largo={240} />} agarraAng={-20} />
      <div style={{ position: "absolute", left: 140, top: 560, padding: "10px 26px", borderRadius: 18, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 50, color: "#fff" }}>STICKS BROKEN: {1 + Math.max(0, Math.min(8, Math.floor((t - 388.4) / 0.32) + 1))}</div>
      <Grande t={t} t0={388.56} text="CEDO ALTERAM" y={170} size={118} color={C.rojo} borde="#fff" />
      <Chip t={t} t0={389.74} text="&quot;BRING ME ANOTHER&quot;" color="#2a1530" x={960} y={330} centro size={60} t1={391.9} />
      <Chip t={t} t0={392.18} text="HIS NICKNAME" color={C.violeta} x={960} y={330} centro size={60} />
    </Escena>

    {/* 106 · en el Danubio se amotinaron: la tropa avanza con palos y palas, Lucilius cae de los primeros */}
    <Escena t={t} t0={393.0} t1={398.4} zoom={0.05} entra="corte" golpes={[394.12, 394.94, 397.72]}>
      {t < 395.0
        ? <MapaPuntos t={t} pulsa={["DANUBE"]} t0Pulsa={394.12} vuela={{ n: "DANUBE", z: 2.2, t: [393.1, 394.6] }} />
        : <>
          <Campamento t={t} hora="tarde" angulo="bajo" />
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${prog(t, 395.0, 397.6) * 120}px)` }}>
            <Multitud t={t} n={9} filas={2} x0={80} x1={980} y={1050} h={470} seed={61} expr="enojado" giro="34" poses={["golpear", "festejar", "golpear", "señala"]} vel={1.3} rompe={0} />
            <Persona x={620} y={1060} h={500} t={t} {...P} giro="34" expr="enojado" {...pose("golpear", t, 1.2)} agarra={<EnMano.pala />} agarraAng={-60} />
          </div>
          <Persona x={1320 + prog(t, 395.2, 397.0) * 90} y={1050} h={580} t={t} seed={61} ropa={CENTURION} casco="centurion" giro="34" flip expr="miedo" inclina={-8 - prog(t, 397.3, 397.9) * 60} opacity={1 - prog(t, 397.6, 398.3) * 0.7} bD={120} bI={120} cD={40} reaccion="susto" reaccionT0={395.3} />
        </>}
      <Chip t={t} t0={394.12} text="THE DANUBE" color={C.violeta} x={140} y={170} size={62} t1={394.8} />
      <Grande t={t} t0={394.94} text="MUTINY!" y={220} size={160} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={396.86} text="LUCILIUS: ONE OF THE FIRST KILLED" color={C.rojo} x={760} y={390} centro size={54} />
    </Escena>

    {/* 107 · sobornos: la fila de perfil avanza, cada uno deja su moneda y el centurión, sentado, la embolsa */}
    <Escena t={t} t0={398.4} t1={407.2} zoom={0.04} entra="corte" golpes={[400.14, 404.2, 406.24]}>
      <Interior t={t} tono="#e0c79a" ventana={false} />
      <Precios t={t} t0={398.45} x={90} y={250} />
      <Mesa x={1150} y={830} w={300} />
      <Bolsa x={1130} y={770} s={0.42 + Math.max(0, Math.min(4, PAGA.filter((p) => t > p + 0.5).length)) * 0.05} t={t} txt="$" />
      <Banco x={1420} y={1040} w={200} alto={124} />
      <Persona x={1420} y={1040} h={540} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip postura="sentado" expr={t > 404.2 ? "feliz" : "orgullo"} bD={70 + Math.sin(t * 3) * 6} cD={60} bI={40} cI={90} />
      {(() => {
        const k = PAGA.filter((p) => t > p + 0.5).length;
        const fila = [{ seed: 1, prot: true }, { seed: 158, prot: false }, { seed: 159, prot: false }, { seed: 160, prot: false }];
        return fila.map((f, i) => {
          const pos = i - k; // 0 = frente a la mesa
          if (pos < 0) return null;
          const dando = pos === 0 && t > PAGA[i] - 0.4 && t < PAGA[i] + 0.1;
          return <Persona key={i} x={880 - pos * 210} y={1050} h={f.prot ? 520 : 480 - i * 10} t={t} seed={f.seed} casco="legion" ropa={f.prot ? LUCIUS : undefined} giro="perfil" expr={f.prot ? "triste" : i % 2 ? "neutro" : "triste"}
            bD={dando ? 90 : 55} cD={dando ? 10 : 70} agarra={t < PAGA[i] ? <MonedaAg /> : undefined} agarraAng={0} />;
        });
      })()}
      {PAGA.map((t0, i) => {
        const k = prog(t, t0, t0 + 0.5);
        return t > t0 && k < 1 && <Denario key={i} x={interpolate(k, [0, 1], [980, 1130])} y={interpolate(k, [0, 1], [700, 740]) - Math.sin(k * Math.PI) * 160} r={34} t={t} gira={3} />;
      })}
      <Chip t={t} t0={400.14} text="HOW THE SYSTEM REALLY WORKED" color={C.violeta} x={600} y={160} size={56} t1={403.85} />
      <Grande t={t} t0={404.2} text="BRIBES" x={1100} y={180} size={150} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={405.3} text="TO SKIP THE WORST JOBS" color={C.rojo} x={1100} y={350} centro size={58} />
    </Escena>

    {/* 108 · pagás: no limpiás letrinas; pagás: día libre; no pagás: siempre a la zanja */}
    <Escena t={t} t0={407.2} t1={415.3} zoom={0.03} entra="corte" golpes={[407.3, 409.34, 411.28, 415.08]}>
      <Campamento t={t} tropa={false} />
      <Trato t={t} t0={407.3} x={420} paga txt="SKIP LATRINE DUTY" bien s={0.55} top={140} />
      <Trato t={t} t0={409.34} x={940} paga txt="A DAY OF LEAVE" bien s={0.55} top={140} />
      <Trato t={t} t0={411.28} x={1420} paga={false} txt="ALWAYS CLEANING THE DITCH" bien={false} s={0.55} top={140} />
      <Persona x={360} y={1040} h={400} t={t} {...P} giro="34" expr="feliz" bD={80 + Math.sin(t * 6) * 10} cD={20} />
      <Persona x={600} y={1040} h={430} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip expr="orgullo" bD={60} cD={30} agarra={<EnMano.bolsa />} />
      {(() => { const k = ((t - 407.3) * 1.1) % 1; return t > 407.3 && <Denario x={440 + k * 130} y={720 - Math.sin(k * Math.PI) * 110} r={22} t={t} gira={4} />; })()}
      <Persona x={900 + prog(t, 409.4, 415) * 120} y={1040} h={400} t={t} seed={152} casco="legion" giro={t > 409.4 ? "34" : "frente"} expr="feliz" camina={t > 409.4 ? 1.2 : 0} {...pose("festejar", t)} />
      <Monticulo x={1430} y={1040} w={220} h={70} />
      <Persona x={1290} y={1040} h={400} t={t} seed={153} casco="legion" giro="34" expr="triste" {...pose("cavar", t, 1.2)} agarra={<EnMano.pala />} agarraAng={70 + Math.sin(t * 1.2 * Math.PI * 2) * 20} />
      <Tierra t={t} x0={1330} y0={980} dx={110} h={120} />
      <Emote t={t} t0={411.6} tipo="sudor" {...L(1290, 1040, 400)} />
    </Escena>

    {/* 109 · dormido en la guardia de la puerta: llega el tribuno con antorcha y garrote → FUSTUARIUM */}
    <Escena t={t} t0={415.3} t1={420.1} zoom={0.05} entra="corte" golpes={[416.7, 417.26, 419.6]}>
      <PuertaPretoria t={t} hora="noche" guardia={false} />
      <Banco x={560} y={1050} w={220} alto={120} />
      <Persona x={560} y={1050} h={540} t={t} {...P} giro="34" postura="sentado" expr={t > 419.3 ? "miedo" : "dormido"} ladea={t > 419.3 ? 0 : 20} bD={40} cD={70} agarra={<EnMano.lanza />} agarraAng={-75} reaccion={t > 419.3 ? "ojos" : undefined} reaccionT0={419.3} />
      {t < 419.3 && <Zzz x={700} y={500} t={t} />}
      {(() => {
        const u = prog(t, 417.4, 419.0), x = interpolate(u, [0, 1], [1700, 1020]), anda = t > 417.4 && t < 419.0;
        return <>
          {t > 419.0 && [0, 1, 2].map((i) => <Persona key={i} x={1380 + i * 170} y={1000 - i * 12} h={430 - i * 20} t={t} seed={240 + i} sombra="#2a2050" giro="34" flip aparece={419.1 + i * 0.2} bD={30} />)}
          <Persona x={x} y={1050} h={580} t={t} seed={62} ropa={TRIBUNO} casco="centurion" giro={anda ? "perfil" : "34"} flip expr="enojado" camina={anda ? 1.4 : 0}
            bD={t > 419.0 ? 120 : 60} cD={20} agarra={<EnMano.garrote />} agarraAng={t > 419.0 ? -50 : 40} bI={70} cI={60} agarraI={<EnMano.antorcha t={t} />} agarraAngI={-60} />
        </>;
      })()}
      {(() => { const c = L(560, 1050, 540); return <Emote t={t} t0={419.4} tipo="excl" x={c.x - 160} y={c.y - 40} s={c.s} />; })()}
      <Chip t={t} t0={416.7} text="ASLEEP" color={C.violeta} x={140} y={170} size={64} t1={419.25} />
      <Chip t={t} t0={417.26} text="ON NIGHT WATCH" color={C.violeta} x={140} y={290} size={64} t1={419.25} />
      <Grande t={t} t0={419.6} text="FUSTUARIUM" y={170} size={130} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 110-111 · el tribuno te toca con el garrote... y te pegan tus compañeros de carpa (plaza de armas de noche) */}
    <Escena t={t} t0={420.1} t1={427.8} zoom={0.05} entra="corte" golpes={[422.22, 424.78, 425.46, 426.14]}>
      <PlazaArmas t={t} hora="noche" />
      <Persona x={960} y={1050} h={520} t={t} {...P} giro="frente" expr="miedo" bD={150} bI={150} cD={100} cI={100} inclina={t > 426.1 ? 10 : 0} reaccion={t > 425.5 ? "mandibula" : undefined} reaccionT0={425.5} />
      <Persona x={420} y={1050} h={590} t={t} seed={62} ropa={TRIBUNO} casco="centurion" giro="34" expr="enojado" bD={t > 421.6 && t < 422.6 ? 80 : 110} cD={20} agarra={<EnMano.garrote />} agarraAng={t > 421.6 && t < 422.6 ? 0 : -45} bI={40} cI={70} agarraI={<EnMano.antorcha t={t} />} agarraAngI={-70} />
      {[[-640, 0], [-420, 1], [400, 2], [620, 3]].map(([dx, i]) => (
        <Persona key={i} x={960 + dx} y={1050 - (i % 2) * 14} h={480 + (i % 2) * 30} t={t} seed={140 + i} ropa={CIVIL(i + 2)} casco="no" giro="34" flip={dx > 0} expr="triste" aparece={423.5 + i * 0.15}
          bD={t > 426.1 ? 130 + Math.sin(t * 8 + i) * 30 : 30} cD={30} agarra={t > 425.9 ? <Vara largo={200} /> : undefined} agarraAng={t > 426.1 ? -60 + Math.sin(t * 8 + i) * 30 : 60} />
      ))}
      {(() => { const c = L(960, 1050, 520); return t > 422.2 && t < 422.9 && <Emote t={t} t0={422.25} tipo="excl" x={c.x - 150} y={c.y - 40} s={c.s} />; })()}
      <Chip t={t} t0={420.94} text="THE TRIBUNE" color={C.violeta} x={140} y={170} size={64} t1={423.2} />
      <Chip t={t} t0={423.42} text="YOUR OWN UNIT" color={C.ambar} tinta={C.noche} x={140} y={170} size={64} t1={424.3} />
      <Chip t={t} t0={424.48} text="TENT MATES" color={C.ambar} tinta={C.noche} x={140} y={170} size={64} t1={425.2} />
      <Grande t={t} t0={425.46} text="YOUR FRIENDS" y={220} size={124} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 112 · casi ninguno sobrevivía (tumbas fuera del campamento), y el que sí, nunca podía volver a casa */}
    <Escena t={t} t0={427.8} t1={432.5} entra="corte" golpes={[429.22, 431.32]}>
      {t < 429.3 ? <>
        <PlazaArmas t={t} hora="noche" />
        {Array.from({ length: 6 }, (_, i) => { const lado = i % 2 ? 1 : -1; return <Persona key={i} x={900 + lado * interpolate(prog(t, 427.8, 429.0), [0, 1], [460 + (i >> 1) * 110, 220 + (i >> 1) * 120])} y={1050 - (i >> 1) * 10} h={500 - (i >> 1) * 20} t={t} seed={140 + i} ropa={CIVIL(i + 2)} giro="34" flip={lado > 0} bD={140 + Math.sin(t * 9 + i) * 20} cD={30} agarra={<Vara largo={200} />} agarraAng={-70 + Math.sin(t * 9 + i) * 30} />; })}
        <Persona x={900} y={1050} h={480} t={t} {...P} postura="agachado" expr="miedo" bD={150} bI={150} cD={100} cI={100} />
      </> : <>
        <Valle t={t} hora="noche" />
        <Tumbas t={t} t0={429.3} xs={[200, 400, 600]} y={960} />
        <Persona x={interpolate(prog(t, 429.4, 431.2), [0, 1], [760, 900])} y={1040} h={480} t={t} {...P} giro="perfil" expr="triste" ladea={-8} inclina={6} camina={t < 431.2 ? 0.7 : 0} bI={30} />
        <div style={{ position: "absolute", left: 1120, top: 290, width: 520, height: 450, transform: `scale(${ent(t, 429.4)})` }}>
          <svg width={520} height={450} viewBox="0 0 560 480">
            <path d="M 80 220 L 280 60 L 480 220 Z" fill="#b5452c" /><rect x={120} y={210} width={320} height={230} fill="#e8b98a" /><rect x={240} y={310} width={80} height={130} fill="#6b3a1f" /><rect x={150} y={250} width={60} height={50} rx={6} fill="#ffd27a" />
            <path d="M 40 40 L 520 440 M 520 40 L 40 440" stroke={C.rojo} strokeWidth={40} strokeLinecap="round" strokeDasharray={630} strokeDashoffset={630 * (1 - prog(t, 431.32, 431.6))} />
          </svg>
        </div>
      </>}
      <Chip t={t} t0={428.5} text="MOST DID NOT SURVIVE" color={C.rojo} x={140} y={210} size={62} />
      <Chip t={t} t0={431.32} text="NEVER GO HOME" color={C.violeta} x={1380} y={830} centro size={60} />
    </Escena>

    {/* 113-114 · diezmado: uno de cada diez, por sorteo, muerto a manos de los otros nueve */}
    <Escena t={t} t0={432.5} t1={441.3} zoom={0.04} entra="corte" golpes={[435.6, 437.12, 438.56, 439.9]}>
      <PlazaArmas t={t} hora="tarde" />
      {Array.from({ length: 10 }, (_, i) => {
        const marcado = i === 6 && t > 438.6;
        const x = 330 + i * 140, h = 340 + ((i * 37) % 5) * 9;
        const giran = t > 439.9 && !marcado;
        const giro = giran ? ("34" as const) : i % 3 === 1 ? ("34" as const) : ("frente" as const);
        return <Persona key={i} x={x} y={1045 - (i % 2) * 8} h={h} t={t} seed={i === 3 ? 1 : 170 + i} casco="legion" ropa={i === 3 ? LUCIUS : undefined} giro={giro} flip={giran ? i > 6 : i % 2 === 0}
          expr={marcado ? "miedo" : t < 438.6 ? (t < 435.6 ? "enojado" : "miedo") : "triste"} sombra={marcado ? C.rojo : undefined} reaccion={marcado ? "susto" : undefined} reaccionT0={438.7}
          {...(t < 435.4 ? { bD: 140 + Math.sin(t * 8 + i) * 25, cD: 30 } : giran ? { bD: 140 + Math.sin(t * 9 + i) * 25, cD: 20 } : pose("temblar", t))}
          agarra={giran ? <Vara largo={170} /> : undefined} agarraAng={-60 + Math.sin(t * 9 + i) * 30} />;
      })}
      <Grande t={t} t0={435.6} text="DECIMATION" y={210} size={116} color="#fff" borde={C.rojo} />
      {t > 437.12 && <div style={{ position: "absolute", left: 1540, top: 160, padding: "8px 26px", borderRadius: 18, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 60, color: "#fff", transform: `scale(${ent(t, 437.12)})` }}>1 / 10</div>}
      {t > 437.6 && t < 439.3 && <Urna x={1640} y={520} s={0.55} t={t} t0={437.7} tSaca={438.3} />}
      {t > 438.56 && <svg style={{ position: "absolute", left: 1170 - 50, top: 560 }} width={100} height={90}><path d="M 50 80 L 14 10 L 86 10 Z" fill={C.rojo} transform={`translate(0 ${Math.sin(t * 8) * 8})`} /></svg>}
      <Chip t={t} t0={432.9} text="REALLY BAD BEHAVIOR" color={C.rojo} x={140} y={170} size={62} t1={435.3} />
      <Chip t={t} t0={434.6} text="BY A WHOLE UNIT" color={C.ambar} tinta={C.noche} x={140} y={290} size={62} t1={435.3} />
      <Chip t={t} t0={437.12} text="EVERY TENTH MAN" color={C.ambar} tinta={C.noche} x={960} y={360} centro size={60} t1={438.3} />
      <Chip t={t} t0={438.56} text="CHOSEN BY LOT" color={C.violeta} x={960} y={360} centro size={60} t1={439.45} />
      <Chip t={t} t0={439.55} text="KILLED BY THE OTHER NINE" color={C.rojo} x={960} y={360} centro size={60} />
    </Escena>

    {/* 115-116 · raro, pero en el 71 a. C. Craso lo revivió desde el estrado contra sus legiones (que huían de Espartaco) */}
    <Escena t={t} t0={441.3} t1={448.5} zoom={0.04} entra="sube" banda={C.oro} golpes={[442.02, 444.02, 447.36]}>
      <Valle t={t} hora="tarde" />
      <Podio x={420} y={1050} w={360} h={150} />
      <Persona x={400} y={900} h={560} t={t} seed={63} ropa={LILA} casco="centurion" viejo giro="34" expr="enojado" habla={t > 444} bD={100 + Math.sin(t * 5) * 15} cD={10} bI={40} cI={80} agarra={<EnMano.pergamino />} agarraAng={-10} />
      {t > 444.0 && <Urna x={545} y={840} s={0.4} t={t} t0={444.0} tSaca={446.0} />}
      <Multitud t={t} n={10} filas={2} x0={820} x1={1440} y={1050} h={380} seed={71} expr="miedo" giro="34" flip mira={-0.5} poses={["temblar", "quieto", "temblar"]} rompe={1} />
      {t > 447.2 && <>
        <Multitud t={t} n={4} filas={1} x0={1600} x1={1820} y={760} h={190} seed={72} ropa="civil" casco="no" accion="festejar" giro="34" flip aparece={447.3} />
        <Persona x={1700} y={830} h={300} t={t} seed={64} ropa={CIVIL(3)} giro="34" flip expr="enojado" aparece={447.2} bD={150} cD={10} agarra={<EnMano.gladius />} agarraAng={-80} />
      </>}
      <Chip t={t} t0={440.56} text="RARE..." color={C.violeta} x={140} y={170} size={64} t1={441.9} />
      <Cuenta t={t} t0={442.02} t1={442.6} de={1} a={71} x={1300} y={200} size={160} color={C.oro} suf=" BC" />
      <Chip t={t} t0={444.02} text="CRASSUS" color={C.rojo} x={140} y={170} size={66} />
      <Chip t={t} t0={445.36} text="VS HIS OWN LEGIONS" color={C.ambar} tinta={C.noche} x={1130} y={380} centro size={58} />
      <Chip t={t} t0={447.36} text="SPARTACUS" color={C.teal} tinta={C.noche} x={1690} y={500} centro size={56} />
    </Escena>

    {/* 117 · todos conocían la historia: sentados alrededor del fuego, uno la cuenta (en la viñeta: Craso, la urna, 71 BC) */}
    <Escena t={t} t0={448.5} t1={451.9} entra="corte" golpes={[449.3, 450.46]}>
      <Campamento t={t} hora="noche" angulo="bajo" />
      <div style={{ position: "absolute", left: 960 - 520, top: 560, width: 1040, height: 560, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,150,60,.32), transparent 70%)" }} />
      <Banco x={430} y={1050} w={360} alto={110} />
      <Banco x={1480} y={1050} w={360} alto={110} />
      <Persona x={340} y={1050} h={440} t={t} seed={191} casco="legion" giro="34" postura="sentado" expr="miedo" {...pose("temblar", t)} />
      <Persona x={540} y={1050} h={450} t={t} {...P} giro="34" postura="sentado" expr="miedo" bI={120} cI={125} bD={120} cD={125} reaccion={t > 450.5 ? "ojos" : undefined} reaccionT0={450.5} />
      <Fogata t={t} x={960} y={1040} s={0.95} />
      <Persona x={1400} y={1050} h={450} t={t} seed={194} casco="legion" giro="34" flip postura="sentado" expr="miedo" {...pose("temblar", t)} />
      <Persona x={1640} y={1050} h={470} t={t} seed={193} casco="legion" giro="34" flip expr="triste" habla bD={100 + Math.sin(t * 5) * 30} cD={40} bI={60} cI={60} />
      <Vineta t={t} t0={448.7} x={660} y={400} esc={0.3}>
        <Valle t={t} hora="tarde" />
        <Podio x={520} y={1050} w={420} h={170} />
        <Persona x={500} y={880} h={600} t={t} seed={63} ropa={LILA} casco="centurion" viejo giro="34" expr="enojado" bD={110} cD={10} />
        <Urna x={680} y={800} s={0.55} t={t} tSaca={449.2} />
        <Multitud t={t} n={5} filas={1} x0={1000} x1={1700} y={1050} h={420} seed={73} expr="miedo" giro="34" flip poses={["temblar"]} rompe={0} />
        <div style={{ position: "absolute", left: 1180, top: 120, padding: "16px 44px", borderRadius: 30, background: "#2a1530", fontFamily, fontWeight: 700, fontSize: 130, color: C.oro }}>71 BC</div>
      </Vineta>
      <Grande t={t} t0={448.56} text="IT HAPPENED" y={170} size={136} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={450.14} text="AND EVERYONE KNEW THE STORY" color="#2a1530" x={960} y={320} centro size={56} />
    </Escena>

    {/* 118 · la mayoría de los días, aburridos: de guardia en la puerta pretoria, el sol cruza, bosteza y se duerme */}
    <Escena t={t} t0={451.9} t1={456.2} entra="corte" golpes={[455.42]}>
      <PuertaPretoria t={t} guardia={false} />
      <Astro x={interpolate(t, [451.9, 456.2], [220, 1700])} y={interpolate(t, [451.9, 454, 456.2], [330, 110, 330])} r={50} />
      <Persona x={560} y={1060} h={560} t={t} {...P} giro="34" expr={t > 455.2 ? "dormido" : "neutro"} ladea={t > 455.2 ? 16 : 0} bD={50} cD={60} agarra={<EnMano.lanza />} agarraAng={-82} agarraI={<EnMano.escudo />} agarraAngI={0} bI={20} cI={40} habla={t > 453.4 && t < 454.2} />
      <div style={{ position: "absolute", left: 1260, top: 460, padding: "10px 26px", borderRadius: 18, background: "#2a1530", color: "#fff", fontFamily, fontWeight: 700, fontSize: 56 }}>HOUR {1 + Math.floor(prog(t, 452.2, 455.6) * 9)}</div>
      <Chip t={t} t0={452.0} text="TO BE FAIR..." color={C.violeta} x={140} y={190} size={64} t1={455.1} />
      <Grande t={t} t0={455.42} text="BORING" y={250} size={180} color="#b7b0c8" borde="#5a5470" />
      {t > 455.4 && <Zzz x={700} y={480} t={t} />}
    </Escena>

    {/* 119-120 · la planilla de guardias de Egipto (llena desde el arranque); se marca el puesto que toca y él lo hace */}
    <Escena t={t} t0={456.2} t1={472.0} zoom={0.04} entra="corte" golpes={[458.22, 461.92, 463.0, 463.92, 465.26, 469.12]}>
      <PlazaArmas t={t} />
      <Planilla t={t} t0={456.2} x={90} y={250} activo={puesto(t) - 1} items={[
        { txt: "GUARD DUTY", t0: 456.25, ic: "⚔" }, { txt: "GATE DUTY", t0: 456.33, ic: "⌂" }, { txt: "BATH DUTY", t0: 456.41, ic: "≈" }, { txt: "CENTURION'S BOOTS", t0: 456.49, ic: "✦" }, { txt: "TO THE DUNG", t0: 456.57, ic: "!" },
      ]} />
      {(() => {
        const k = puesto(t);
        const x = k === 0 ? 980 + prog(t, 456.2, 461.9) * 160 : 1060;
        const acc = k === 2 ? pose("empujar", t) : k === 3 ? pose("barrer", t) : k === 4 ? pose("moler", t, 1.4) : k === 5 ? pose("cavar", t, 1.3) : { bD: 40, cD: 50 };
        const ag = k <= 1 ? { agarra: <EnMano.lanza />, agarraAng: -84 } : k === 5 ? { agarra: <EnMano.pala />, agarraAng: 70 + Math.sin(t * 1.3 * Math.PI * 2) * 22 } : k === 3 ? { agarra: <EnMano.esponja />, agarraAng: 40 } : {};
        const mano = k === 4 ? <g transform="translate(-30 -10) scale(.5)"><path d="M -40 -60 L 10 -60 L 12 30 L 70 50 Q 80 80 60 88 L -50 88 Q -60 40 -40 -60 Z" fill="#7a4520" /></g> : undefined;
        return <>
          {k <= 1 && <Torre x={1340} y={1040} s={0.75} />}
          {k === 2 && <Porton x={1340} y={1040} abre={prog(t, 463.1, 463.8)} />}
          {k === 3 && <Tina t={t} x={1340} y={1040} />}
          {k === 4 && <><Bota x={1240} y={1010} s={1.05} /><Bota x={1380} y={1015} s={1.05} /></>}
          {k === 5 && <Carretilla t={t} x={1360} y={1040} />}
          <Persona x={x} y={1050} h={560} t={t} {...P} giro={k === 0 ? "perfil" : "34"} expr={k === 5 ? "miedo" : k === 0 ? "neutro" : "triste"} camina={k === 0 ? 0.9 : 0} manoD={mano} {...acc} {...ag} reaccion={k === 5 ? "ojos" : undefined} reaccionT0={469.2} />
          {k === 3 && <Emote t={t} t0={464.0} tipo="sudor" {...L(x, 1050, 560)} />}
        </>;
      })()}
      <Chip t={t} t0={458.5} text="IT SURVIVES" color={C.violeta} x={1360} y={200} centro size={62} t1={461.6} />
      <Chip t={t} t0={470.16} text="HALF THE WORLD" color={C.violeta} x={1360} y={180} centro size={60} />
      <Chip t={t} t0={470.86} text="...NOT FOR GLORY" color={C.rojo} x={1360} y={300} centro size={60} />
    </Escena>

    {/* 121 · la cruzaste para palear (plano bajo, pala en la mano de verdad) */}
    <Escena t={t} t0={472.0} t1={473.7} entra="corte" golpes={[472.95]}>
      <PlazaArmas t={t} angulo="bajo" />
      <Monticulo x={1260} y={1060} w={360} h={120} />
      <Persona x={860} y={1070} h={680} t={t} {...P} giro="34" expr="triste" {...pose("cavar", t, 1.3)} agarra={<EnMano.pala />} agarraAng={70 + Math.sin(t * 1.3 * Math.PI * 2) * 22} />
      <Tierra t={t} x0={1000} y0={990} dx={260} h={220} vel={1.4} />
      <Emote t={t} t0={472.2} tipo="sudor" {...L(860, 1070, 680)} />
      <Grande t={t} t0={472.95} text="TO SHOVEL" y={200} size={160} color="#fff" borde="#2a1530" />
    </Escena>

    {/* 122 · salvo que tuvieras un oficio: suelta la pala y festeja */}
    <Escena t={t} t0={473.7} t1={476.3} entra="zoom" golpes={[475.54]}>
      <Campamento t={t} angulo="bajo" />
      <Particulas t={t} tipo="destellos" n={40} seed={107} />
      <Persona x={960} y={1060} h={620} t={t} {...P} expr={t > 475.4 ? "feliz" : "neutro"} giro={t > 475.4 ? "frente" : "34"} salta={475.5} {...(t > 475.4 ? pose("festejar", t, 0.8) : { bD: 40, cD: 50, bI: 20 })} agarra={t < 475.4 ? <EnMano.pala /> : undefined} agarraAng={80} />
      <Emote t={t} t0={475.5} tipo="brillos" {...L(960, 1060, 620)} s={1.3} />
      <Chip t={t} t0={473.75} text="UNLESS..." color={C.violeta} x={140} y={170} size={66} t1={475.3} />
      <Grande t={t} t0={475.54} text="YOU HAD A SKILL" y={200} size={116} color="#fff" borde={C.teal} />
    </Escena>

    {/* 123-124 · los inmunes: él palea al sol, el especialista escribe sentado bajo el toldo. Después, la lista: cada uno trabajando */}
    <Escena t={t} t0={476.3} t1={490.6} zoom={0.03} entra="sube" banda={C.teal} golpes={[479.18, 482.13, 483.25, 484.07, 485.07, 486.06, 488.86]}>
      <Campamento t={t} tropa={false} />
      {t < 481.9 && <>
        <Monticulo x={720} y={1040} w={240} h={80} />
        <Persona x={480} y={1040} h={520} t={t} {...P} giro="34" expr="triste" {...pose("cavar", t, 1.3)} agarra={<EnMano.pala />} agarraAng={70 + Math.sin(t * 1.3 * Math.PI * 2) * 22} />
        <Tierra t={t} x0={600} y0={990} dx={160} h={140} />
        <Emote t={t} t0={476.6} tipo="sudor" {...L(480, 1040, 520)} />
        <Toldo x0={1130} x1={1720} y={470} />
        <Mesa x={1520} y={830} w={260} />
        <Tablilla x={1520} y={800} s={0.28} t={t} texto={["~~ ~~~"]} />
        <Banco x={1330} y={1040} w={200} alto={124} />
        <Persona x={1330} y={1040} h={500} t={t} seed={34} casco="legion" giro="34" postura="sentado" expr="feliz" {...pose("escribir", t)} agarra={<EnMano.pluma />} agarraAng={-30} />
        <Chip t={t} t0={477.56} text="SPECIALISTS" color={C.teal} tinta={C.noche} x={960} y={170} centro size={62} t1={479.0} />
        <Grande t={t} t0={479.18} text="IMMUNES" y={240} size={150} color="#fff" borde={C.teal} />
        <Chip t={t} t0={480.31} text="EXCUSED FROM THE WORST CHORES" color={C.lima} tinta={C.noche} x={960} y={385} centro size={54} />
      </>}
      {t >= 481.9 && <>
        <AbsoluteFill style={{ background: "rgba(27,18,64,.35)" }} />
        {[[400, 320], [960, 320], [1520, 320], [400, 745], [960, 745], [1520, 745]].map(([gx, gy], i) => <div key={i} style={{ position: "absolute", left: gx - 250, top: gy - 190, width: 500, height: 380, borderRadius: 24, border: "6px dashed rgba(255,255,255,.55)", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 90, color: "rgba(255,255,255,.4)" }}>?</div>)}
        <InmuneCard t={t} t0={481.9} x={400} y={320} of="agrimensor" label="SURVEYORS" seed={201} fondo="#a8dcf2" />
        <InmuneCard t={t} t0={483.25} x={960} y={320} of="escriba" label="CLERKS" seed={202} fondo="#f2d8a8" />
        <InmuneCard t={t} t0={484.07} x={1520} y={320} of="herrero" label="BLACKSMITHS" seed={203} fondo="#f2b48a" />
        <InmuneCard t={t} t0={485.07} x={400} y={745} of="arquero" label="BOW MAKERS" seed={204} fondo="#c8e8a8" />
        <InmuneCard t={t} t0={486.06} x={960} y={745} of="medico" label="ORDERLIES" seed={205} fondo="#f2c8d0" />
        <InmuneCard t={t} t0={488.86} x={1520} y={745} of="animales" label="SACRED ANIMALS" seed={206} fondo="#e8e0a8" />
      </>}
    </Escena>

    {/* 125 · ¿te acordás de la mesa de reclutamiento en la puerta? (recuerdo en sepia) por esto */}
    <Escena t={t} t0={490.6} t1={495.6} zoom={0.05} entra="corte" golpes={[491.94, 495.06]}>
      <PuertaPretoria t={t} />
      <Mesa x={980} y={830} w={420} />
      <Tablilla x={980} y={800} s={0.32} t={t} texto={["SIGN ~~"]} />
      <Banco x={1300} y={1050} w={200} alto={124} />
      <Persona x={1300} y={1050} h={540} t={t} seed={60} ropa={CENTURION} casco="centurion" giro="34" flip postura="sentado" expr="neutro" habla={t < 494} bD={70} cD={40} agarra={<EnMano.pluma />} agarraAng={-40} />
      <Persona x={620} y={1050} h={520} t={t} {...P} giro="34" expr="sorpresa" {...pose("contar", t, 0.6)} />
      <AbsoluteFill style={{ background: "rgba(150,100,40,.28)", boxShadow: "inset 0 0 160px 40px rgba(60,30,10,.55)" }} />
      <Emote t={t} t0={491.2} tipo="preg" {...L(620, 1050, 520)} />
      <Globo t={t} t0={492.4} t1={494.9} x={700} y={320} txt="WHAT DO YOU DO FOR A LIVING?" size={50} cola="der" />
      <Chip t={t} t0={491.6} text="REMEMBER?" color={C.violeta} x={140} y={170} size={64} t1={494.7} />
      <Grande t={t} t0={495.06} text="THIS IS WHY" y={200} size={130} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 126 · leer, escribir o arreglar una espada valía más vivo: la balanza se inclina y las monedas caen EN el plato */}
    <Escena t={t} t0={495.6} t1={502.4} zoom={0.04} entra="corte" golpes={[496.38, 497.19, 497.98, 499.24, 501.65]}>
      <PlazaArmas t={t} />
      {(() => {
        const fase = t < 497.19 ? 0 : t < 497.98 ? 1 : 2;
        const acc = fase === 0 ? pose("contar", t, 0.5) : fase === 1 ? pose("escribir", t) : pose("martillar", t, 1.5);
        const ag = fase === 2 ? { agarra: <EnMano.martillo />, agarraAng: -70 + Math.sin(t * 1.5 * Math.PI * 2) * 50 } : fase === 1 ? { agarra: <EnMano.pluma />, agarraAng: -30, agarraI: <EnMano.tablilla />, agarraAngI: -20 } : { agarra: <EnMano.tablilla texto="READ" />, agarraAng: -20 };
        return <>
          {fase === 2 && <svg style={{ position: "absolute", left: 600, top: 870 }} width={200} height={180} viewBox="0 0 200 180"><path d="M 10 30 L 190 30 L 165 55 L 130 55 L 145 180 L 55 180 L 70 55 L 35 55 Z" fill="#5d6577" /><path d="M 10 30 L 190 30 L 178 10 L 22 10 Z" fill="#8a93a3" /><rect x={30} y={0} width={140} height={10} rx={4} fill={Math.sin(t * 1.5 * Math.PI * 2) > 0.7 ? "#ffb347" : "#d8dde6"} /></svg>}
          <Persona x={440} y={1050} h={560} t={t} {...P} giro="34" expr="orgullo" {...acc} {...ag} />
        </>;
      })()}
      {(() => {
        const incl = 14 * prog(t, 499.24, 500.6), a = (incl * Math.PI) / 180;
        const px = 1340 + Math.cos(a) * 250, py = 1020 - 540 + Math.sin(a) * 250 + 150;
        return <>
          <Balanza t={t} x={1340} y={1020} incl={incl} monedas={Math.max(0, Math.min(10, Math.floor((t - 499.3) / 0.22)))} />
          {t > 499.24 && Array.from({ length: 4 }, (_, i) => { const k = ((t - 499.24) * 1.4 + i / 4) % 1; return <Moneda key={i} x={px - 20 + (i % 2) * 40} y={200 + k * (py - 230)} r={22} t={t} gira={2} />; })}
        </>;
      })()}
      {([[496.38, "READ", C.teal, 280], [497.19, "WRITE", C.violeta, 560], [497.98, "FIX A SWORD", C.ambar, 920]] as const).map(([t0, txt, col, x]) => <Chip key={txt} t={t} t0={t0} text={txt} color={col} tinta={col === C.ambar ? C.noche : undefined} x={x} y={300} centro size={62} />)}
      <Grande t={t} t0={499.24} text="WORTH MORE ALIVE" y={160} size={100} color="#fff" borde="#3fa34d" />
      <Chip t={t} t0={501.3} text="AWAY FROM THE DUNG" color="#3fa34d" x={1040} y={400} centro size={56} />
    </Escena>

    {/* 127 · y después, la soledad: sentado solo en la carpa a oscuras */}
    <Escena t={t} t0={502.4} t1={504.3} entra="corte" golpes={[503.15]}>
      <CarpaInterior t={t} lampara={false} />
      <AbsoluteFill style={{ background: "rgba(10,8,30,.45)" }} />
      <div style={{ position: "absolute", left: 960 - 420, top: 380, width: 840, height: 760, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,160,255,.3), transparent 70%)" }} />
      <Banco x={960} y={1040} w={300} alto={124} />
      <Persona x={960} y={1040} h={540} t={t} {...P} postura="sentado" expr="triste" ladea={-8} inclina={10} bI={40} cI={110} bD={40} cD={110} />
      <Emote t={t} t0={503.4} tipo="lagrimas" {...L(960, 1040 + 66, 540)} />
      <Grande t={t} t0={503.15} text="LONELINESS" y={220} size={140} color="#8a9ad8" borde="#1b1240" />
    </Escena>

    {/* 128-129 · Vindolanda: el arqueólogo cepilla el barro y las tablillas salen del pozo en arco y caen alrededor */}
    <Escena t={t} t0={504.3} t1={515.3} zoom={0.04} entra="corte" golpes={[504.44, 507.3, 509.06, 510.75, 513.86]}>
      {t < 508.0
        ? <MapaPuntos t={t} pulsa={["VINDOLANDA"]} t0Pulsa={504.44} vuela={{ n: "VINDOLANDA", z: 2.6, t: [504.4, 506.4] }} />
        : <>
          <Valle t={t} />
          <Fuerte x={1640} y={720} s={0.4} w={700} piedra />
          <div style={{ position: "absolute", left: 700, top: 910, width: 600, height: 120, borderRadius: "50% 50% 0 0", background: "#6b4a2a" }} />
          <div style={{ position: "absolute", left: 760, top: 940, width: 480, height: 64, borderRadius: "50%", background: "#3a2414" }} />
          <Persona x={560} y={1050} h={500} t={t} seed={35} ropa={ARQUEO} giro="34" postura="agachado" expr="sorpresa" {...pose("barrer", t, 1.4)} agarra={<Cepillo />} agarraAng={60 + Math.sin(t * 1.4 * Math.PI * 2) * 15} reaccion={t > 509.1 ? "ojos" : undefined} reaccionT0={509.1} />
          {Array.from({ length: 12 }, (_, i) => {
            const t0 = 509.06 + i * 0.2, k = prog(t, t0, t0 + 0.6);
            const xf = 620 + ((i * 5) % 12) * 72 + (i % 2) * 30, yf = 950 + (i % 3) * 22;
            return t > t0 && <Tablilla key={i} x={interpolate(k, [0, 1], [1000, xf])} y={interpolate(k, [0, 1], [960, yf]) - Math.sin(k * Math.PI) * (300 + (i % 4) * 60)} s={0.24} rot={(1 - k) * 360 + (((i * 37) % 40) - 20)} t={t} t0={t0} texto={["~~~ ~~", "~ ~~~~"]} />;
          })}
          <MiniBritania t={t} t0={508.0} x={120} y={130} />
        </>}
      <Chip t={t} t0={504.44} text="VINDOLANDA" color={C.violeta} x={140} y={170} size={64} t1={507.7} />
      <Chip t={t} t0={505.88} text="NEAR HADRIAN'S WALL" color={C.teal} tinta={C.noche} x={140} y={290} size={58} t1={507.7} />
      <Chip t={t} t0={510.39} text="WOODEN WRITING TABLETS" color={C.ambar} tinta={C.noche} x={1150} y={190} centro size={58} />
      <Cuenta t={t} t0={513.86} t1={514.4} de={0} a={2000} x={1150} y={330} size={90} color="#fff" suf=" YEARS AGO" />
    </Escena>

    {/* 130 · tampoco hablan de gloria: él tacha la palabra con la pluma */}
    <Escena t={t} t0={515.3} t1={517.4} entra="corte" golpes={[516.2]}>
      <Interior t={t} />
      <Persona x={440} y={1050} h={600} t={t} {...P} giro="34" expr="neutro" mira={0.6} bD={t > 516.0 ? 120 - prog(t, 516.1, 516.5) * 60 : 70} cD={40} agarra={<EnMano.pluma />} agarraAng={-40} />
      <Tablilla x={1060} y={640} s={1.2} t={t} t0={515.3} texto={["GLORY"]} />
      <svg style={{ position: "absolute", left: 760, top: 460 }} width={600} height={320}><path d="M 20 160 L 580 160" stroke={C.rojo} strokeWidth={40} strokeLinecap="round" strokeDasharray={560} strokeDashoffset={560 * (1 - prog(t, 516.2, 516.5))} /></svg>
      <Chip t={t} t0={515.6} text="NOT ABOUT GLORY EITHER" color={C.rojo} x={960} y={190} centro size={62} />
    </Escena>

    {/* 131 · llega un paquete de casa: en la carpa, agachado, lo abre y saltan medias, sandalias y calzones */}
    <Escena t={t} t0={517.4} t1={524.2} zoom={0.04} entra="corte" golpes={[520.29, 521.74, 523.29]}>
      <CarpaInterior t={t} />
      <Paquete t={t} x={1000} y={1040} tAbre={519.6} />
      {t > 519.5 && <svg style={{ position: "absolute", left: 1000 - 200, top: 640, overflow: "visible", pointerEvents: "none" }} width={400} height={300}>
        {[-60, -30, 0, 30, 60].map((a, i) => <line key={i} x1={200} y1={280} x2={200 + Math.sin((a * Math.PI) / 180) * 260} y2={280 - Math.cos((a * Math.PI) / 180) * 260 * prog(t, 519.6, 519.9)} stroke="#fff3a0" strokeWidth={12} strokeLinecap="round" opacity={0.75 - 0.25 * Math.sin(t * 6 + i)} />)}
      </svg>}
      {t < 520.29
        ? <Persona x={700} y={1050} h={560} t={t} {...P} giro="34" postura="agachado" expr="sorpresa" {...pose("moler", t, 1.6)} />
        : <Persona x={680} y={1050} h={580} t={t} {...P} giro="34" expr="feliz" {...pose("festejar", t, 0.6)} salta={520.35} />}
      <Emote t={t} t0={520.4} tipo="brillos" {...L(680, 1050, 580)} />
      {(() => {
        const sale = (t0: number, x1: number, y1: number) => { const k = prog(t, t0, t0 + 0.45); return { x: interpolate(k, [0, 1], [1000, x1]), y: interpolate(k, [0, 1], [930, y1]) - Math.sin(k * Math.PI) * 160 }; };
        const m = sale(519.75, 900, 560), s1 = sale(521.74, 1180, 470), s2 = sale(521.86, 1330, 500), c1 = sale(523.29, 1300, 690), c2 = sale(523.41, 1520, 700);
        return <>
          <Ropa k="medias" {...m} s={0.9} t={t} t0={519.75} rot={-8} />
          <Ropa k="sandalia" {...s1} s={0.7} t={t} t0={521.74} rot={-6} />
          <Ropa k="sandalia" {...s2} s={0.7} t={t} t0={521.86} rot={14} />
          <Ropa k="calzon" {...c1} s={0.75} t={t} t0={523.29} rot={-8} />
          <Ropa k="calzon" {...c2} s={0.75} t={t} t0={523.41} rot={10} />
        </>;
      })()}
      <Chip t={t} t0={517.6} text="A PACKAGE FROM HOME" color={C.ambar} tinta={C.noche} x={960} y={170} centro size={66} t1={520.1} />
      <Chip t={t} t0={520.29} text="SOCKS" color={C.violeta} x={900} y={340} centro size={60} />
      <Chip t={t} t0={521.74} text="2 PAIRS OF SANDALS" color={C.teal} tinta={C.noche} x={1260} y={210} centro size={56} />
      <Chip t={t} t0={523.29} text="2 PAIRS OF UNDERPANTS" color={C.rojo} x={1380} y={860} centro size={54} />
    </Escena>

    {/* 132 · otro pide más cerveza: el barril está vacío y los jarros boca abajo */}
    <Escena t={t} t0={524.2} t1={528.3} zoom={0.05} entra="corte" golpes={[525.86, 527.51]}>
      <Interior t={t} tono="#e0c79a" />
      <Barril t={t} x={900} y={1050} />
      <Persona x={560} y={1050} h={580} t={t} seed={65} ropa={CENTURION} casco="centurion" giro="34" expr={t > 525.8 ? "enojado" : "triste"} habla bD={95 + Math.sin(t * 6) * 10} cD={20} agarra={<JarroAg boca={t > 525.8} />} agarraAng={0} />
      <Persona x={1190} y={1050} h={480} t={t} {...P} giro="34" flip expr="triste" bD={100} cD={30} agarra={<JarroAg boca />} agarraAng={0} />
      <Banco x={1420} y={1050} w={200} alto={110} />
      <Persona x={1420} y={1050} h={450} t={t} seed={166} casco="legion" giro="34" flip expr="triste" postura="sentado" bD={90} cD={60} reaccion={t > 527.6 ? "derrite" : undefined} reaccionT0={527.6} />
      <Grande t={t} t0={525.86} text="MORE BEER!" y={190} size={140} color="#fff" borde="#7a3d14" />
      <Chip t={t} t0={527.34} text="HIS MEN RAN OUT" color={C.rojo} x={960} y={360} centro size={60} />
    </Escena>

    {/* 133 · un informe llama a los locales «Brittunculi»: el oficial lo escribe sentado (inserto grande), los britanos pasan por el arco */}
    <Escena t={t} t0={528.3} t1={537.3} zoom={0.04} entra="corte" golpes={[532.46, 535.58, 536.27]}>
      <Interior t={t} ventana={false} />
      <div style={{ position: "absolute", left: 1040, top: 300, width: 740, height: 740, borderRadius: "370px 370px 0 0", overflow: "hidden", background: "linear-gradient(180deg,#7cc4f0,#c8ecf8)", border: "16px solid #b5a07a" }}>
        <svg style={{ position: "absolute", inset: 0 }} width={740} height={740}><path d="M -20 520 Q 200 440 400 500 T 800 480 L 800 740 L -20 740 Z" fill="#8fd16a" /><path d="M -20 600 Q 300 560 800 620 L 800 740 L -20 740 Z" fill="#6aae4a" /></svg>
      </div>
      {[0, 1, 2, 3].map((i) => <Persona key={i} x={1150 + i * 150 + Math.sin(t * 0.8 + i) * 12} y={1000} h={270} t={t} seed={210 + i} ropa={BRITON(i)} giro={i % 2 ? "34" : "perfil"} flip={i % 2 === 1} expr={t > 535.6 ? "enojado" : "neutro"} camina={0.8} bD={t > 535.6 ? 150 : 20} cD={20} />)}
      <Mesa x={640} y={830} w={360} />
      <Tablilla x={640} y={800} s={0.35} t={t} texto={["REPORT ~~"]} />
      <Banco x={360} y={1050} w={200} alto={124} />
      <Persona x={360} y={1050} h={560} t={t} seed={65} ropa={CENTURION} casco="centurion" giro="34" postura="sentado" expr="enojado" {...pose("escribir", t)} agarra={<EnMano.pluma />} agarraAng={-30} />
      <Persona x={940} y={1050} h={480} t={t} {...P} giro="34" expr={t > 535.6 ? "sorpresa" : "neutro"} mira={0.8} bI={20} reaccion={t > 535.7 ? "mandibula" : undefined} reaccionT0={535.7} />
      <Informe t={t} t0={528.4} x={70} y={130} titulo="REPORT · VINDOLANDA" texto="THE BRITTUNCULI..." tEsc={[528.8, 531.0]} />
      <Grande t={t} t0={532.46} text="BRITTUNCULI" x={1410} y={180} size={96} color="#fff" borde={C.violeta} />
      <Chip t={t} t0={534.32} text="ROUGHLY TRANSLATES AS..." color={C.violeta} x={1410} y={370} centro size={50} t1={535.4} />
      <Chip t={t} t0={535.58} text="&quot;WRETCHED LITTLE BRITONS&quot;" color={C.rojo} x={1410} y={370} centro size={50} />
    </Escena>

    {/* 134-135 · imaginalo: tenés 26, llueve de costado, a 2000 km de casa... la única buena noticia: medias nuevas */}
    <Escena t={t} t0={537.3} t1={547.17} zoom={0.05} entra="corte" golpes={[538.22, 539.79, 541.08, 544.6, 546.39]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #3a4a5a, #1b2a3a)" }} />
      <Colinas capas={["#2a3a3a", "#1a2a2a"]} base={760} seed={110} alto={50} />
      <Fuerte x={1250} y={830} s={0.6} w={900} piedra />
      <Capa t={t} x={560} y={1050} h={560} />
      <Persona x={560} y={1050} h={560} t={t} {...P} giro="34" expr={t > 545.4 ? "feliz" : "triste"} inclina={-10} bD={t > 545.6 ? 150 : 110} cD={t > 545.6 ? 20 : 120} bI={t < 545.4 ? 120 : 20} cI={t < 545.4 ? 120 : 10} agarra={t > 545.6 ? <MediasAg /> : undefined} agarraAng={-80} />
      <Lluvia t={t} n={140} angulo={45} op={0.6} />
      <Emote t={t} t0={539.9} t1={545.3} tipo="lagrimas" {...L(560, 1050, 560)} />
      <Emote t={t} t0={545.8} tipo="brillos" {...L(560, 1050, 560)} s={1.3} />
      <Chip t={t} t0={537.41} text="PICTURE IT" color={C.violeta} x={140} y={170} size={64} t1={538.0} />
      <Cuenta t={t} t0={538.22} t1={538.6} de={18} a={26} x={1250} y={190} size={110} color="#fff" pre="AGE " />
      <Chip t={t} t0={539.79} text="RAINING SIDEWAYS" color={C.teal} tinta={C.noche} x={1250} y={330} centro size={58} t1={544.1} />
      <Cuenta t={t} t0={541.08} t1={541.7} de={0} a={2000} x={1250} y={470} size={76} color={C.oro} suf=" KM FROM HOME" />
      <Chip t={t} t0={544.36} text="THE ONLY GOOD NEWS:" color={C.ambar} tinta={C.noche} x={1250} y={330} centro size={58} />
      <Chip t={t} t0={546.0} text="FRESH SOCKS" color={C.lima} tinta={C.noche} x={1250} y={590} centro size={66} />
    </Escena>
  </>
);
