// lety01 · TRAMO 9 (721,9-810 s): EL REPASO (tablero de lotería: las 7 cartas se voltean con cada número y se prende su vasito)
// → LA CUENTA (comanda del mercado → báscula $9 el plato, ni a $12 → 4 platos < $50 → 1 vasito de pastelería = toda tu olla)
// → CTA: suscríbete + ¿lleva pasitas o no? (la familia jalando la cuerda) → próximo video: la cajeta → campanita → de noche, la posada.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { PT, VASOS, WorldProps, setKeys } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Clip, Escrito, Sello, Vaho, Whip } from "./Min1";
import { M8_END } from "./m8";
import { FONT, HAND, LT, P, SERIF, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1];
const T = {
  rep: at("vamos a repasar", 721), n: [at("1", 724), at("2", 727.8), at("3", 730.9), at("4", 735.3), at("5", 739.8), at("6", 744), at("7", 747.5)],
  espesa: at("espesa al enfriar", 750), cuenta: at("y la cuenta", 752), litro: at("un litro de leche", 753), arroz: at("el arroz", 754.3), raja: at("la raja de canela", 755),
  azucar: at("el azucar", 756), mercado: at("mercado de mi mama", 757.5), nueve: at("9 pesos", 759.5), cara: at("mas cara", 762.5), doce: at("ni a 12", 763.9), cuatro: at("4 platos", 765),
  cincuenta: at("50 pesos", 766.4), past: at("pasteleria", 768), vasito: at("un solo vasito", 769), olla: at("toda tu olla", 771.5), susc: at("suscribete", 774), cuent: at("cuentame", 775),
  coment: at("comentarios", 776.5), casa: at("en tu casa", 777.7), pas1: at("lleva pasitas", 779.7), no: at("o no lleva", 780.6), pelea: at("nos peleamos", 783.5), prox: at("en el proximo video", 793.5),
  cajeta: at("la cajeta", 795.5), cobre: at("caso de cobre", 797.8), reves: at("al reves", 799.7), camp: at("activa la campanita", 801.5), soy: at("yo soy leti", 803.5), hija: at("la hija de chayo", 804.5),
  dulce: at("algo dulce", 807.8), pronto: at("nos vemos pronto", 808.8),
};
export const M9_END = 810.04;
const A = [AV(725), AV(743.7), AV(759), AV(794.2)];
const NOCHE = T.soy + 2.7; // del adiós de Lety a la noche de la posada

setKeys([
  { t: M8_END + 0.1, p: [0.25, 2.15, -0.6], l: [-1.0, 1.5, -2.84], fov: 44 },
  { t: A[0][0], p: [0.0, 2.05, -0.8], l: [-1.0, 1.5, -2.84], fov: 42 },
  { t: A[0][1], p: [VASOS[2][0] + 0.35, 1.85, -1.75], l: [VASOS[2][0], 1.55, -2.84], fov: 40 },
  { t: T.n[3] + 0.3, p: [VASOS[3][0] + 0.3, 1.82, -1.8], l: [VASOS[3][0], 1.55, -2.84], fov: 40, arc: 0.04 },
  { t: A[1][0], p: [VASOS[4][0] + 0.3, 1.82, -1.8], l: [VASOS[4][0], 1.55, -2.84], fov: 40 },
  { t: A[1][1], p: [VASOS[6][0] + 0.4, 1.85, -1.7], l: [VASOS[6][0], 1.55, -2.84], fov: 40 },
  { t: T.cuenta - 0.1, p: [0.3, 2.2, -0.5], l: [-1.0, 1.5, -2.84], fov: 46 },
  // la despedida: el patio de noche, como en la posada del minuto 1 (la cámara se aleja de la puerta)
  { t: NOCHE, p: [-5.2, 1.55, 0.9], l: [-8.2, 1.9, -0.2], fov: 38 },
  { t: M9_END, p: [-5.7, 1.75, 1.4], l: [-8.2, 1.95, -0.3], fov: 46 },
]);

const st = (t: number): WorldProps => {
  const lit = T.n.filter((x) => t > x + 0.2).length;
  return t > NOCHE - 0.5
    ? { t, night: 1, posada: e(t, NOCHE, NOCHE + 1.2), fire: 0.35, steam: 0.6, raja: 0, vasos: VASOS.map(() => 1) }
    : { t, fire: 0.35, steam: 0.6, raja: 0, vasos: VASOS.map((_, i) => (i < lit ? 1 : 0.35)) };
};
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS =================
// tablero de lotería: 7 cartas con su número, dibujo y nombre; se voltean con la voz
const CARTAS: [string, string, string][] = [
  ["LA LECHE", "#2a6fc0", "M -30 -60 L 30 -60 L 30 -40 L 42 -20 L 42 70 L -42 70 L -42 -20 L -30 -40 Z"],
  ["EL GRANO", "#c2552d", "M 0 -70 C 40 -40 40 40 0 70 C -40 40 -40 -40 0 -70 Z"],
  ["LA RAJA", "#8a4a1e", "M -60 -18 L 60 -18 Q 72 0 60 18 L -60 18 Q -72 0 -60 -18 Z M -60 -40 L 60 -40 L 60 -26 L -60 -26 Z"],
  ["LA LUMBRE", "#e2457a", "M 0 -75 C 40 -30 50 10 30 50 C 20 70 -20 70 -30 50 C -50 10 -30 -20 -10 -30 C -10 -10 0 0 10 -10 C 15 -30 5 -55 0 -75 Z"],
  ["EL AZÚCAR", "#f2a31b", "M -45 -45 L 45 -45 L 45 45 L -45 45 Z"],
  ["EL CHORRITO", "#3c8be6", "M -10 -75 Q 10 -20 -5 20 Q -30 60 0 70 Q 30 60 5 20 Q -10 -20 10 -75 Z"],
  ["LA PACIENCIA", "#22b3a6", "M -40 -70 L 40 -70 L 6 0 L 40 70 L -40 70 L -6 0 Z"],
];
const Loteria: React.FC<{ t: number; n: number[]; full: number; out: number; x: number; y: number; sc: number }> = ({ t, n, full, out, x, y, sc }) => {
  const o = e(t, n[0] - 0.8, n[0] - 0.4) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc})`, padding: 22, background: "#f3e2c0", borderRadius: 18, border: "8px solid #8a4a1e", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
    <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: "#8a4a1e", marginBottom: 12, letterSpacing: 2 }}>LOS 7 SECRETOS</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 170px)", gap: 14, justifyContent: "center" }}>
      {CARTAS.map(([name, col, d], i) => { const f = ei(t, n[i] - 0.1, n[i] + 0.35), pop = t > n[i] + 0.35 && t < n[i] + 1.4; return <div key={i} style={{ width: 170, height: 230, perspective: 700, gridColumn: i === 4 ? "1 / span 1" : undefined, marginLeft: i >= 4 ? 92 : 0 }}>
        <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${(1 - f) * 180}deg) scale(${pop ? 1.06 : 1})` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "#fffaf0", border: `5px solid ${col}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
            <div style={{ alignSelf: "flex-start", marginLeft: 12, fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: col }}>{i + 1}</div>
            <svg width={120} height={120} viewBox="-80 -80 160 160"><path d={d} fill={col} /></svg>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: name.length > 10 ? 20 : 24, color: LT.tinta }}>{name}</div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 12, background: "repeating-linear-gradient(45deg,#c2552d 0 14px,#d9774a 14px 28px)", border: "5px solid #8a4a1e" }} />
        </div>
      </div>; })}
    </div>
    {t > full && <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%,-50%) rotate(-8deg) scale(${Math.min(1.1, spr(t, full, 1.3))})`, padding: "10px 40px", border: "10px solid #e23a2a", borderRadius: 16, fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: "#e23a2a", background: "rgba(255,250,240,.85)" }}>¡LOTERÍA!</div>}
  </div>;
};

// comanda del mercado: cada renglón se escribe cuando Lety lo nombra
const Comanda: React.FC<{ t: number; rows: [number, string][]; merc: number; out: number; x: number; y: number }> = ({ t, rows, merc, out, x, y }) => {
  const o = e(t, rows[0][0] - 0.6, rows[0][0] - 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, width: 520, transform: "rotate(2deg)", padding: "26px 34px 34px", background: "#fffdf6", boxShadow: "0 28px 44px rgba(0,0,0,.55)", backgroundImage: "repeating-linear-gradient(#fffdf6 0 58px,#cfe0ef 58px 60px)", clipPath: "polygon(0 0,100% 0,100% 96%,92% 100%,84% 96%,76% 100%,68% 96%,60% 100%,52% 96%,44% 100%,36% 96%,28% 100%,20% 96%,12% 100%,4% 96%,0 100%)" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#e23a2a", marginBottom: 10 }}>LA CUENTA</div>
    {rows.map(([a, txt], i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: LT.tinta, height: 60, clipPath: `inset(0 ${(1 - e(t, a - 0.1, a + 0.5)) * 100}% 0 0)` }}>✓ {txt}</div>)}
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: LT.canela, marginTop: 8, opacity: e(t, merc - 0.1, merc + 0.3) }}>precios del mercado de mi mamá</div>
  </div>;
};

// báscula de mercado (carátula redonda): la aguja se para en $9 y el tope rojo en $12
const Bascula: React.FC<{ t: number; at: number; doce: number; out: number; x: number; y: number }> = ({ t, at: a, doce, out, x, y }) => {
  const o = e(t, a - 0.4, a - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = 9 * ei(t, a - 0.1, a + 0.6) + 2.6 * Math.sin((t - doce) * 10) * Math.exp(-(t - doce) * 3) * (t > doce ? 1 : 0), ang = (v / 15) * 270 - 135;
  const r12 = (12 / 15) * 270 - 135;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.06, spr(t, a - 0.4, 1))})`, textAlign: "center" }}>
    <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ filter: "drop-shadow(0 26px 34px rgba(0,0,0,.6))" }}>
      <circle r={220} fill="#c2552d" /><circle r={190} fill="#fffaf0" />
      {Array.from({ length: 16 }, (_, i) => { const an = ((i / 15) * 270 - 135 - 90) * Math.PI / 180; return <g key={i}><line x1={Math.cos(an) * 160} y1={Math.sin(an) * 160} x2={Math.cos(an) * 182} y2={Math.sin(an) * 182} stroke={LT.tinta} strokeWidth={i % 3 === 0 ? 6 : 3} />{i % 3 === 0 && <text x={Math.cos(an) * 128} y={Math.sin(an) * 128 + 12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={LT.tinta}>${i}</text>}</g>; })}
      <g transform={`rotate(${r12})`} opacity={e(t, doce - 0.3, doce)}><rect x={-7} y={-192} width={14} height={50} fill="#e23a2a" /></g>
      <g transform={`rotate(${ang})`}><path d="M -8 20 L 0 -170 L 8 20 Z" fill="#e23a2a" /></g><circle r={18} fill={LT.tinta} />
      <text y={100} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={70} fill="#2a6fc0">${Math.round(Math.min(9, v))}</text>
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LT.crema, textShadow: extrude(5, "#7a3412") }}>el plato</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#ff9a7a", textShadow: "0 4px 10px #000", opacity: e(t, doce, doce + 0.3) }}>ni a $12 aunque suba la leche</div>
  </div>;
};

// cuatro platos que llegan a la mesa → total < $50
const Platos4: React.FC<{ t: number; at: number; tot: number; out: number; x: number; y: number }> = ({ t, at: a, tot, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ display: "flex", gap: 18 }}>{[0, 1, 2, 3].map((i) => <svg key={i} width={160} height={110} viewBox="-80 -55 160 110" style={{ transform: `translateY(${(1 - Math.min(1, spr(t, a + i * 0.18, 1.3))) * -200}px)`, filter: "drop-shadow(0 14px 16px rgba(0,0,0,.55))" }}><ellipse rx={78} ry={30} cy={10} fill="#f6f1e4" stroke="#22b3a6" strokeWidth={6} /><ellipse rx={48} ry={17} cy={4} fill="#fff1d6" /><circle cx={-12} cy={0} r={5} fill="#8a4a1e" /><circle cx={14} cy={6} r={4} fill="#8a4a1e" /></svg>)}</div>
    <div style={{ marginTop: 10, display: "inline-block", padding: "10px 34px", background: "#22b3a6", borderRadius: 20, fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: "#fff", boxShadow: "0 20px 30px rgba(0,0,0,.5)", opacity: e(t, tot - 0.2, tot + 0.1), transform: `scale(${Math.min(1.1, spr(t, tot - 0.2, 1.2))})` }}>menos de $50</div>
  </div>;
};

// la pastelería vs tu olla: un vasito = una olla entera (dos etiquetas colgando con un "=")
const Iguales: React.FC<{ t: number; at: number; olla: number; out: number; x: number; y: number }> = ({ t, at: a, olla, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const Et = ({ k0, label, pic, col }: { k0: number; label: string; pic: React.ReactNode; col: string }) => <div style={{ opacity: e(t, k0 - 0.2, k0 + 0.1), transform: `rotate(${Math.sin((t - k0) * 4) * 6 * Math.exp(-(t - k0) * 1.5)}deg)`, transformOrigin: "50% -60px", textAlign: "center" }}>
    <div style={{ width: 4, height: 60, background: "#8a8a8a", margin: "0 auto" }} />
    <div style={{ width: 300, padding: "20px 10px", background: "#fffaf0", borderRadius: 18, border: `6px solid ${col}`, boxShadow: "0 24px 34px rgba(0,0,0,.55)" }}>{pic}<div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: col, marginTop: 6 }}>{label}</div></div>
  </div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 30 }}>
    <Et k0={a} col="#e2457a" label="1 VASITO DE PASTELERÍA" pic={<svg width={110} height={130} viewBox="-55 -65 110 130"><path d="M -38 -40 L -28 60 L 28 60 L 38 -40 Z" fill="#f2d8e2" stroke="#e2457a" strokeWidth={5} /><ellipse cy={-40} rx={38} ry={10} fill="#fff1d6" /><path d="M -20 -55 Q 0 -75 20 -55" stroke="#e2457a" strokeWidth={5} fill="none" /></svg>} />
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: LT.crema, textShadow: extrude(7, "#7a3412"), opacity: e(t, olla - 0.4, olla) }}>≈</div>
    <Et k0={olla - 0.3} col={LT.turq} label="TODA TU OLLA" pic={<svg width={160} height={130} viewBox="-80 -65 160 130"><path d="M -65 -30 L -58 50 Q 0 64 58 50 L 65 -30 Z" fill="#5d6670" /><ellipse cy={-30} rx={65} ry={16} fill="#fff1d6" /><rect x={-80} y={-26} width={20} height={10} rx={5} fill="#3a4048" /><rect x={60} y={-26} width={20} height={10} rx={5} fill="#3a4048" /></svg>} />
  </div>;
};

// botón de suscribirse que el cursor aprieta (rojo → gris "Suscrito")
const Suscribete: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.6, a - 0.3) * (1 - e(t, out, out + 0.3)), click = a + 0.2, done = t > click;
  if (o <= 0.01) return null;
  const cx = 300 * (1 - ei(t, a - 0.6, click)), press = t > click && t < click + 0.15 ? 0.93 : 1;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <div style={{ padding: "26px 56px", borderRadius: 60, background: done ? "#5d6670" : "#e62117", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", boxShadow: "0 24px 40px rgba(0,0,0,.6)", transform: `scale(${press * Math.min(1.08, spr(t, a - 0.6, 1))})`, whiteSpace: "nowrap" }}>{done ? "✓ SUSCRITO" : "SUSCRÍBETE"}</div>
    <svg width={70} height={90} viewBox="0 0 70 90" style={{ position: "absolute", left: 230 + cx, top: 60 + cx * 0.4, filter: "drop-shadow(0 6px 8px rgba(0,0,0,.6))" }}><path d="M 8 4 L 8 70 L 24 56 L 36 84 L 48 78 L 36 52 L 58 52 Z" fill="#fff" stroke="#000" strokeWidth={4} strokeLinejoin="round" /></svg>
  </div>;
};

// el comentario con la pregunta + la cuerda: CON pasitas vs SIN pasitas (la familia se pelea)
const Pasitas: React.FC<{ t: number; at: number; no: number; pelea: number; out: number; x: number; y: number }> = ({ t, at: a, no, pelea, out, x, y }) => {
  const o = e(t, a - 0.4, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const tug = t > pelea ? Math.sin((t - pelea) * 2.2) * 70 + Math.sin((t - pelea) * 5.3) * 18 : 0;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", width: 1100 }}>
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "24px 30px", background: "#fffaf0", borderRadius: 24, boxShadow: "0 26px 40px rgba(0,0,0,.55)", transform: `scale(${Math.min(1.05, spr(t, a - 0.4, 1))})` }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, background: "#e2457a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: "#fff" }}>?</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: LT.tinta, lineHeight: 1.15 }}>¿En tu casa el arroz con leche <span style={{ color: "#8a4a1e" }}>lleva pasitas</span><span style={{ opacity: e(t, no - 0.1, no + 0.2) }}> o <span style={{ color: "#2a6fc0" }}>NO lleva pasitas</span>?</span></div>
    </div>
    <div style={{ marginTop: 40, opacity: e(t, pelea - 0.3, pelea + 0.2), position: "relative", height: 150 }}>
      <svg width={1100} height={150} viewBox="0 0 1100 150" style={{ overflow: "visible" }}>
        <path d={`M 120 80 Q 550 ${100 + Math.abs(tug) * 0.2} 980 80`} stroke="#c9a46a" strokeWidth={14} fill="none" />
        <rect x={540 + tug} y={50} width={20} height={60} fill="#e23a2a" />
        <line x1={550} y1={20} x2={550} y2={140} stroke="#fff" strokeWidth={4} strokeDasharray="10 10" />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 30, padding: "12px 22px", borderRadius: 16, background: "#8a4a1e", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", boxShadow: "0 14px 20px rgba(0,0,0,.5)" }}>CON pasitas</div>
      <div style={{ position: "absolute", right: 0, top: 30, padding: "12px 22px", borderRadius: 16, background: "#2a6fc0", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", boxShadow: "0 14px 20px rgba(0,0,0,.5)" }}>SIN pasitas</div>
    </div>
    <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#ffd27a", textShadow: "0 4px 10px #000", opacity: e(t, pelea + 2, pelea + 2.5) }}>👇 te leo en los comentarios</div>
  </div>;
};

// tarjeta del próximo video con la foto de la cajeta dentro
const Proximo: React.FC<{ t: number; at: number; cobre: number; out: number; x: number; y: number }> = ({ t, at: a, cobre, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), k = Math.min(1.06, spr(t, a - 0.3, 1));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(-2deg)`, padding: 18, background: "#fffaf0", borderRadius: 20, boxShadow: "0 30px 50px rgba(0,0,0,.6)", width: 640 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#e62117", marginBottom: 10 }}>▶ PRÓXIMO VIDEO</div>
    <div style={{ width: 604, height: 340, overflow: "hidden", borderRadius: 12 }}><Img src={staticFile(P + "img_r_cajeta.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.08 * e(t, a, a + 5)})` }} /></div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: LT.tinta, marginTop: 10 }}>La cajeta de mi abuelita</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LT.canela, opacity: e(t, cobre, cobre + 0.4) }}>en cazo de cobre… y al revés</div>
  </div>;
};

// la campanita que se sacude y suelta ondas
const Campanita: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), sw = Math.sin((t - a) * 18) * 22 * Math.exp(-Math.max(0, t - a) * 1.6);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.1, spr(t, a - 0.3, 1.2))})`, textAlign: "center" }}>
    <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ overflow: "visible", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
      {[0, 1, 2].map((i) => { const q = ((t - a) * 1.4 + i / 3) % 1; return t > a ? <circle key={i} r={90 + q * 70} fill="none" stroke="#ffd34a" strokeWidth={8 * (1 - q)} opacity={1 - q} /> : null; })}
      <g transform={`rotate(${sw} 0 -95)`}><path d="M -70 50 Q -70 -70 0 -80 Q 70 -70 70 50 L 85 70 L -85 70 Z" fill="#ffc21a" /><circle cy={88} r={18} fill="#ffc21a" /><circle cy={-90} r={12} fill="#ffc21a" /></g>
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 4px 12px #000" }}>ACTIVA LA CAMPANITA</div>
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M9: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  if (A.some((_, i) => inA(i))) L.push(<Avatar key="av" t={t} />);

  // 721,9-752 · EL REPASO: la repisa con los 7 vasitos se va prendiendo; el tablero de lotería encima (chico a la derecha en el avatar)
  if (t < T.cuenta - 0.05 && !inA(0) && !inA(1)) L.push(W("w1", t));
  if (t < A[0][0]) L.push(<Escrito key="rp" t={t} at={T.rep + 0.6} out={A[0][0] - 0.1} x={220} y={200} text="vamos a repasar…" size={100} dur={0.8} />);
  const av = inA(0) || inA(1);
  L.push(<Loteria key="lo" t={t} n={T.n} full={T.espesa + 0.3} out={T.cuenta - 0.3} x={av ? 1450 : 960} y={av ? 560 : 600} sc={av ? 0.85 : 1.2} />);
  L.push(<Vaho key="v1" t={t} mid={T.cuenta - 0.05} w={0.3} />);
  // 752-759 · LA CUENTA: el mercado de mi mamá → Lety saca la cuenta
  if (t >= T.cuenta - 0.05 && t < A[2][0] + 0.02) {
    L.push(t < T.raja - 0.1 ? <Clip key="cm" k="r_mercado_mama" t={t} a={T.cuenta} z={[1.04, 1.1]} /> : <Whip key="wm" t={t} at={T.raja - 0.1} d={0.35} a={<Clip k="r_mercado_mama" t={t} a={T.cuenta} z={[1.04, 1.1]} />} b={<Clip k="r_lety_cuenta" t={t} a={T.raja} z={[1.1, 1.03]} />} />);
    L.push(<Comanda key="co" t={t} rows={[[T.litro, "1 litro de leche"], [T.arroz, "el arroz"], [T.raja, "la raja de canela"], [T.azucar, "el azúcar"]]} merc={T.mercado} out={A[2][0] - 0.1} x={1250} y={250} />);
  }
  // 759-765,1 (avatar) · $9 el plato… ni a $12
  if (inA(2)) L.push(<Bascula key="bs" t={t} at={T.nueve} doce={T.doce} out={A[2][1] - 0.1} x={1470} y={500} />);
  // 765,1-773,2 · la familia a la mesa: 4 platos < $50 → en la pastelería un vasito ≈ toda tu olla
  if (t >= A[2][1] && t < T.susc - 1.1) { L.push(<Clip key="cf" k="r_familia_mesa" t={t} a={A[2][1]} z={[1.03, 1.1]} />); L.push(<Platos4 key="p4" t={t} at={T.cuatro} tot={T.cincuenta} out={T.past - 0.3} x={1300} y={300} />); L.push(<Iguales key="ig" t={t} at={T.vasito - 0.2} olla={T.olla} out={T.susc - 1.3} x={960} y={420} />); }
  L.push(<Vaho key="v2" t={t} mid={T.susc - 1.1} w={0.3} />);
  // 773,2-785 · CTA: Lety con las pasitas · suscríbete → la pregunta y la cuerda
  if (t >= T.susc - 1.1 && t < 785.3) { L.push(<Clip key="cp" k="r_lety_pasitas" t={t} a={T.susc - 1.1} z={[1.03, 1.12]} />); L.push(<Suscribete key="sb" t={t} at={T.susc} out={T.casa - 0.5} x={1400} y={300} />); }
  // 785-793,7 (silencio) · Lety en el patio mientras la cuerda sigue
  if (t >= 785.3 && t < A[3][0] + 0.02) L.push(<Whip key="wp" t={t} at={785.3} d={0.4} a={<Clip k="r_lety_pasitas" t={t} a={T.susc - 1.1} z={[1.03, 1.12]} />} b={<Clip k="r_lety_patio" t={t} a={785.3} z={[1.1, 1.03]} />} />);
  if (t >= T.susc - 1.1 && t < A[3][0]) L.push(<Pasitas key="pa" t={t} at={T.casa} no={T.no} pelea={T.pelea} out={T.prox - 0.3} x={960} y={720} />);
  // 793,7-799 (avatar) · el próximo video: la cajeta de mi abuelita
  L.push(<Proximo key="px" t={t} at={T.prox + 0.3} cobre={T.cobre} out={A[3][1] - 0.1} x={1450} y={480} />);
  // 799-803,8 · la cajeta al revés · activa la campanita
  if (t >= A[3][1] && t < T.soy - 0.05) { L.push(<Clip key="cj" k="r_cajeta" t={t} a={A[3][1]} z={[1.04, 1.12]} />); L.push(<Escrito key="rv" t={t} at={T.reves - 0.2} out={T.camp - 0.3} x={200} y={880} text="…al revés de cómo te enseñaron" size={76} dur={0.8} />); L.push(<Campanita key="cb" t={t} at={T.camp} out={T.soy - 0.2} x={1480} y={420} />); }
  // 803,8-806,5 · Lety se despide
  if (t >= T.soy - 0.05 && t < NOCHE) { L.push(<Clip key="cd" k="r_lety_despedida" t={t} a={T.soy} z={[1.03, 1.08]} />); L.push(<Escrito key="hc" t={t} at={T.hija} out={NOCHE - 0.3} x={200} y={880} text="Leti, la hija de Chayo" size={92} dur={0.8} />); }
  L.push(<Vaho key="v3" t={t} mid={NOCHE} w={0.35} />);
  // 806,5-810 · la noche en el patio: los farolitos se prenden · siempre hay algo dulce
  if (t >= NOCHE) { L.push(W("w9", t)); L.push(<Escrito key="ad" t={t} at={T.dulce - 0.5} out={1e9} x={560} y={830} text="siempre hay algo dulce ♥" size={104} col="#ffd27a" dur={0.9} />); }
  // fundido a negro
  L.push(<AbsoluteFill key="fn" style={{ background: "#000", opacity: e(t, 809.5, 810.0), pointerEvents: "none" }} />);
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
