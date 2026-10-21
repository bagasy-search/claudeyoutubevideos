// lety01 · TRAMO 7 (523,5-603,7 s): SECRETO 5 · EL AZÚCAR — al final (el que le da coraje a tu tía) → casi todos la echan al
// principio → le roba el agua al grano y lo deja duro → se carameliza en el fondo: quemado y color café → "es que mi arroz siempre
// se pega": no es el arroz, es el azúcar a destiempo → la prueba: aplastar los granos → 100 g (½ taza) + 2 min moviendo → piloncillo:
// doradito, a caramelo → $3 el azúcar, el piloncillo un poco más.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, VASOS, WorldProps, screenOf, setKeys } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Burbuja, Clip, Escrito, Sello, Vaho, Whip } from "./Min1";
import { M6_END } from "./m6";
import { SecretoTitulo } from "./m3";
import { FONT, HAND, LT, SERIF, Tag, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1], C = PT.corte, M = PT.mesa;
const PIL: [number, number, number] = [M[0] + 0.11, 0.86, M[2] + 0.25];
const T = {
  num: at("secreto numero 5", 522), azucar: at("el azucar va al final", 524), coraje: at("coraje", 528), tia: at("tia", 529), mundo: at("casi todo el mundo", 530), principio: at("al principio", 531),
  error: at("ese es el error", 535), mira: at("mira por que", 538), roba: at("roba el agua", 540), suave: at("no esta suave", 542), abrirse: at("abrirse", 546), duro: at("se queda duro", 547),
  cuezas: at("cuezas", 549), carameliza: at("carameliza", 553), quemado: at("sabor a quemado", 555), cafe: at("cafe color", 557), dicen: at("tantas personas dicen", 559), pega: at("siempre se pega", 562),
  noes: at("no es el arroz", 563), destiempo: at("destiempo", 566), esperaba: at("esperaba", 567), granos: at("tomas unos granos", 571), aplastas: at("aplastas", 573), deshacen: at("deshacen", 575),
  ahi: at("ahi y solo ahi entra el azucar", 578), g100: at("100 gramos", 580), media: at("media taza", 583), dos: at("dos minutos", 585), disuelva: at("disuelva", 587), rancho: at("sabor de rancho", 589),
  pilon: at("usa piloncillo", 591), raspa: at("se raspa", 593), doradito: at("doradito", 595), caramelo: at("caramelo", 597), tres: at("tres pesos", 599), poco: at("un poco mas", 602),
};
export const M7_END = at("secreto numero seis", 603) - 0.05;
const A = [AV(525), AV(541.8), AV(559.5), AV(577.9), AV(593.2)];

setKeys([
  { t: M6_END + 0.1, p: [VASOS[4][0] + 0.45, 1.75, -1.95], l: [VASOS[4][0] + 0.12, 1.55, -2.84], fov: 40 },
  { t: A[0][0], p: [VASOS[4][0] + 0.25, 1.68, -2.25], l: [VASOS[4][0], 1.56, -2.84], fov: 36 },
  { t: A[0][1], p: [O[0] + 0.95, SY + 0.85, O[2] + 1.45], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.mira - 0.05, p: [O[0] + 0.55, SY + 0.55, O[2] + 0.95], l: [O[0], SY, O[2]], fov: 38, arc: 0.04 },
  { t: A[1][0], p: [O[0] + 0.35, SY + 0.4, O[2] + 0.7], l: [O[0], SY - 0.02, O[2]], fov: 36 },
  { t: A[1][1], p: [C[0] + 0.85, 1.5, C[2] + 1.25], l: [C[0], 0.95, C[2]], fov: 44 },
  { t: T.carameliza - 2.4, p: [C[0] + 0.2, 1.2, C[2] + 0.75], l: [C[0], 0.93, C[2]], fov: 36, arc: 0.05 },
  { t: T.quemado - 0.3, p: [O[0] + 0.7, SY + 0.6, O[2] + 1.15], l: [O[0], SY - 0.05, O[2]], fov: 40 },
  { t: A[2][0], p: [O[0] + 0.5, SY + 0.45, O[2] + 0.9], l: [O[0], SY - 0.05, O[2]], fov: 38 },
  { t: A[2][1], p: [O[0] + 0.85, SY + 0.75, O[2] + 1.3], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.granos + 0.9, p: [O[0] + 0.45, SY + 0.5, O[2] + 0.85], l: [O[0], SY, O[2]], fov: 38, arc: -0.04 },
  { t: A[4][1], p: [PIL[0] + 0.85, 1.4, PIL[2] + 1.0], l: [PIL[0], 0.86, PIL[2]], fov: 42 },
  { t: M7_END, p: [PIL[0] + 0.5, 1.2, PIL[2] + 0.7], l: [PIL[0], 0.86, PIL[2]], fov: 38 },
]);

const st = (t: number): WorldProps => {
  const err = t > A[0][1] && t < A[1][0] + 0.1, quem = t > T.quemado - 0.4 && t < A[2][0] + 0.1;
  return {
    t, steam: 1, vasos: VASOS.map((_, i) => (i <= 4 ? (i === 4 ? 1 : 0.45) : 0.2)),
    drop: err ? { azucar: Math.max(0, (t - T.principio + 0.2) / 1.5) } : t > A[2][1] && t < T.granos + 1 ? {} : {},
    grains: err ? 0.9 : 0, cream: err ? 0.45 : quem ? 0.6 : 1,
    burnt: quem ? 0.85 : 0, smoke: quem ? 0.5 : 0,
    corte: t > A[1][1] - 0.1 && t < T.quemado - 0.3 ? ei(t, A[1][1], A[1][1] + 1.2) : 0,
    corteGlow: [0, t > T.duro ? e(t, T.duro, T.duro + 0.4) : 0, 0],
  };
};
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS =================
// la tía enojada: carita vector que se pone roja y echa vapor por las orejas
const Tia: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), r = e(t, a, a + 0.8), sh = Math.sin(t * 30) * 4 * r;
  if (o <= 0.01) return null;
  const col = `rgb(${Math.round(240 - 10 * r)},${Math.round(200 - 120 * r)},${Math.round(160 - 110 * r)})`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateX(${sh}px) scale(${Math.min(1.08, spr(t, a - 0.3, 1))})`, textAlign: "center" }}>
    <svg width={320} height={300} viewBox="-160 -160 320 300" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      {[-1, 1].map((s) => [0, 1, 2].map((i) => { const ph = ((t - a) * 1.5 + i / 3) % 1; return <circle key={s + "" + i} cx={s * (130 + ph * 50)} cy={-10 - ph * 70} r={14 + ph * 16} fill="#fff" opacity={r * (1 - ph)} />; }))}
      <path d="M -110 -40 Q -120 -150 0 -150 Q 120 -150 110 -40 Z" fill="#3b2414" /><circle cy={-10} r={110} fill={col} />
      <circle cx={0} cy={-150} r={34} fill="#3b2414" />
      <path d="M -60 -45 L -20 -30 M 60 -45 L 20 -30" stroke="#3b2414" strokeWidth={10} strokeLinecap="round" />
      <circle cx={-40} cy={-10} r={10} fill="#3b2414" /><circle cx={40} cy={-10} r={10} fill="#3b2414" />
      <path d="M -40 50 Q 0 25 40 50" stroke="#3b2414" strokeWidth={10} fill="none" strokeLinecap="round" />
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#ffd27a", textShadow: "0 4px 10px #000" }}>la tía…</div>
  </div>;
};

// listón de "EL ERROR Nº 1" que se desenrolla
const Liston: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at: a, out, x, y, text }) => {
  const o = 1 - e(t, out, out + 0.3), d = ei(t, a, a + 0.6);
  if (t < a || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%) rotate(-3deg)" }}>
    <div style={{ position: "relative", padding: "22px 70px", background: "#c8202a", clipPath: `inset(0 ${(1 - d) * 50}% 0 ${(1 - d) * 50}%)`, boxShadow: "0 24px 36px rgba(0,0,0,.6)", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: "#fff4e0", whiteSpace: "nowrap", textShadow: "0 4px 0 #7a0c12" }}>{text}</div>
  </div>;
};

// el ladrón: un cubito de azúcar con popote que le chupa el agua al grano
const Ladron: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), s = e(t, a, a + 2.0);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={760} height={420} viewBox="-380 -210 760 420" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <rect x={-370} y={-200} width={740} height={400} rx={30} fill="rgba(30,18,10,.72)" />
      <ellipse cx={-150} rx={150 - 50 * s} ry={70 - 25 * s} fill="#f5efe0" stroke="#d8cdb2" strokeWidth={5} />
      <ellipse cx={-150} rx={90 * (1 - s)} ry={30 * (1 - s)} fill="#a9d8ff" opacity={0.8} />
      <path d="M -60 -10 Q 40 -90 120 -40" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" />
      {Array.from({ length: 6 }, (_, i) => { const ph = ((t - a) * 1.4 + i / 6) % 1; return <circle key={i} cx={-60 + 180 * ph} cy={-10 - 80 * Math.sin(ph * Math.PI) + 30 * ph} r={9} fill="#6fc3ff" opacity={t > a ? 1 : 0} />; })}
      <g transform={`translate(190 0) rotate(${Math.sin(t * 6) * 4})`}><rect x={-75} y={-75} width={150} height={150} rx={14} fill="#fff" stroke="#ddd" strokeWidth={6} /><circle cx={-25} cy={-15} r={9} fill="#3b2414" /><circle cx={25} cy={-15} r={9} fill="#3b2414" /><path d="M -30 30 Q 0 50 30 30" stroke="#3b2414" strokeWidth={7} fill="none" /><path d="M -45 -45 L -5 -30 M 45 -45 L 5 -30" stroke="#3b2414" strokeWidth={7} strokeLinecap="round" /></g>
      <text x={-150} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.crema}>EL GRANO</text>
      <text x={190} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.crema}>EL AZÚCAR</text>
      <text x={0} y={-150} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={64} fill="#ffd27a">le roba el agua</text>
    </svg>
  </div>;
};

// candado que se cierra sobre el grano: ya no se abre
const Candado: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), c = ei(t, a, a + 0.4), k = Math.min(1.1, spr(t, a - 0.3, 1.2));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={260} height={300} viewBox="-130 -170 260 300" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <path d={`M -60 0 L -60 ${-70 - 40 * (1 - c)} A 60 60 0 0 1 60 ${-70 - 40 * (1 - c)} L 60 ${-40 * (1 - c)}`} stroke="#b0b5b9" strokeWidth={22} fill="none" />
      <rect x={-100} y={-10} width={200} height={140} rx={20} fill="#d9a22a" /><ellipse cy={60} rx={70} ry={28} fill="#f5efe0" /><circle cy={30} r={12} fill="#6a4206" />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: LT.crema, textShadow: "0 4px 10px #000" }}>YA NO SE ABRE</div>
  </div>;
};

// tarjeta que se voltea: NO ES EL ARROZ → ES EL AZÚCAR A DESTIEMPO
const Voltea: React.FC<{ t: number; at: number; flip: number; out: number; x: number; y: number }> = ({ t, at: a, flip, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), f = ei(t, flip - 0.2, flip + 0.4);
  if (o <= 0.01) return null;
  const face = (back: boolean): React.CSSProperties => ({ position: "absolute", inset: 0, borderRadius: 22, backfaceVisibility: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: back ? "rotateY(180deg)" : undefined, boxShadow: "0 28px 40px rgba(0,0,0,.6)" });
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", perspective: 1400 }}>
    <div style={{ width: 600, height: 300, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${180 * f}deg) scale(${Math.min(1.06, spr(t, a - 0.2, 1))})` }}>
      <div style={{ ...face(false), background: "#fffaf0" }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: LT.tinta }}>NO ES EL ARROZ</div><div style={{ fontSize: 90, color: "#e23a2a", lineHeight: 1 }}>✗</div></div>
      <div style={{ ...face(true), background: "#22b3a6" }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff" }}>ES EL AZÚCAR</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#fff7c8" }}>a destiempo</div></div>
    </div>
  </div>;
};

// dos dedos que aplastan un grano: se deshace, sin nada duro
const Aplasta: React.FC<{ t: number; at: number; des: number; out: number; x: number; y: number }> = ({ t, at: a, des, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), p = ei(t, a, des + 0.3);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={420} height={340} viewBox="-210 -170 420 340" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <circle r={160} fill="rgba(255,250,240,.92)" />
      <rect x={-50} y={-160 + 100 * p - 60} width={100} height={120} rx={50} fill="#d9a07a" /><ellipse cy={-160 + 100 * p + 40} rx={36} ry={18} fill="#f0c8a8" />
      <rect x={-50} y={160 - 100 * p - 60} width={100} height={120} rx={50} fill="#d9a07a" /><ellipse cy={160 - 100 * p - 40} rx={36} ry={18} fill="#f0c8a8" />
      <ellipse rx={60 + 70 * p} ry={Math.max(6, 40 - 34 * p)} fill="#f5efe0" stroke="#d8cdb2" strokeWidth={4} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: LT.turq, textShadow: "0 4px 10px #000", opacity: e(t, des, des + 0.3) }}>✓ SE DESHACE</div>
  </div>;
};

// taza medidora que se llena hasta ½ (100 g)
const Medidora: React.FC<{ t: number; at: number; media: number; out: number; x: number; y: number }> = ({ t, at: a, media, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), f = 0.5 * ei(t, a, a + 1.0);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={320} height={340} viewBox="-160 -170 320 340" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <path d="M -100 -140 L 100 -140 L 85 150 L -85 150 Z" fill="rgba(255,255,255,.22)" stroke="#fff" strokeWidth={7} />
      <path d={`M ${-100 + 15 * (1 - f) * 0} ${150 - 290 * f} L ${100} ${150 - 290 * f} L 85 150 L -85 150 Z`} fill="#fff" />
      {Array.from({ length: 290 }, (_, i) => i).filter((i) => i % 4 === 0 && i < 290 * f).slice(0, 60).map((i) => <circle key={i} cx={-80 + (i * 37) % 160} cy={150 - (i % 290)} r={3} fill="#e8e0d0" />)}
      <path d="M 100 -90 Q 160 -80 150 0 Q 140 60 92 60" stroke="#fff" strokeWidth={14} fill="none" />
      {[["1", -130], ["½", 5]].map(([l, yy]) => <g key={l}><line x1={-100} y1={yy as number} x2={-60} y2={yy as number} stroke={LT.rosa} strokeWidth={6} /><text x={-55} y={(yy as number) + 14} fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.rosa}>{l}</text></g>)}
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LT.crema, textShadow: extrude(6, "#7a3412") }}>100 g</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#ffd27a", textShadow: "0 4px 10px #000", opacity: e(t, media, media + 0.3) }}>media taza</div>
  </div>;
};

// flechas que giran: +2 MIN moviendo
const Giro: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.1, spr(t, a - 0.2, 1.1))})` }}>
    <svg width={280} height={280} viewBox="-140 -140 280 280" style={{ position: "absolute", left: -140, top: -140, transform: `rotate(${(t - a) * 160}deg)`, filter: "drop-shadow(0 20px 26px rgba(0,0,0,.6))" }}>
      {[0, 180].map((r) => <g key={r} transform={`rotate(${r})`}><path d="M 110 0 A 110 110 0 0 1 -30 106" stroke={LT.turq} strokeWidth={20} fill="none" strokeLinecap="round" /><path d="M -60 95 L -26 106 L -40 74" stroke={LT.turq} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>)}
    </svg>
    <div style={{ position: "relative", transform: "translate(-50%,-50%)", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: LT.crema, textShadow: extrude(6, "#0e5a54"), whiteSpace: "nowrap", textAlign: "center", lineHeight: 0.95 }}>+2<br /><span style={{ fontSize: 44 }}>MIN</span></div>
  </div>;
};

// cono de piloncillo vector con etiqueta de cartón
const Cono: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), k = Math.min(1.12, spr(t, a - 0.2, 1));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${(1 - Math.min(1, k)) * -30}deg)` }}>
    <svg width={300} height={340} viewBox="-150 -170 300 340" style={{ overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <path d="M -110 140 L 0 -150 L 110 140 Z" fill="#6a3510" /><path d="M -110 140 L 0 -150 L -30 140 Z" fill="#8a4a1a" /><ellipse cy={140} rx={110} ry={22} fill="#7a3f14" />
      <g transform="translate(90 -40) rotate(12)"><rect x={0} y={0} width={190} height={74} rx={8} fill="#d9b27a" stroke="#8a5a2a" strokeWidth={4} /><text x={95} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#3b2414">PILONCILLO</text></g>
    </svg>
  </div>;
};

// gota de caramelo dorado que escurre
const Caramelo: React.FC<{ t: number; at: number; car: number; out: number; x: number; y: number }> = ({ t, at: a, car, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), d = ei(t, a, a + 1.6);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={340} height={360} viewBox="-170 -180 340 360" style={{ overflow: "visible", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
      <defs><linearGradient id="crm" x1="0" x2="1"><stop offset="0" stopColor="#f7c25a" /><stop offset="1" stopColor="#c27a1a" /></linearGradient></defs>
      <rect x={-160} y={-180} width={320} height={60} rx={30} fill="url(#crm)" />
      <path d={`M -20 -130 L 20 -130 L 14 ${-120 + 200 * d} Q 0 ${-90 + 210 * d} -14 ${-120 + 200 * d} Z`} fill="url(#crm)" />
      <circle cx={0} cy={-100 + 220 * d} r={26 * d} fill="#e8a23a" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: "#f7c25a", textShadow: extrude(6, "#6a3a06"), marginTop: -40 }}>DORADITO</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: LT.crema, textShadow: "0 4px 10px #000", opacity: e(t, car, car + 0.3) }}>como a caramelo</div>
  </div>;
};

// dos boletos de mercado: AZÚCAR $3 · PILONCILLO "un poquito más"
const Boletos: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a1 - 0.2 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 30 }}>
    {[["AZÚCAR", "$3", a1, "#fffaf0"], ["PILONCILLO", "un poco más", a2, "#f2c98a"]].map(([n, v, a, bg], i) => { const k = Math.min(1.1, spr(t, (a as number) - 0.2, 1.2)); return <div key={i} style={{ opacity: e(t, (a as number) - 0.2, a as number), transform: `scale(${k}) rotate(${i ? 4 : -4}deg)`, width: 360, padding: "20px 22px", background: bg as string, borderRadius: 12, border: "4px dashed #8a5a2a", textAlign: "center", boxShadow: "0 24px 36px rgba(0,0,0,.55)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#5a3014", letterSpacing: 3 }}>{n as string}</div>
      <div style={{ fontFamily: i ? HAND : SERIF, fontWeight: 900, fontSize: i ? 62 : 110, color: "#3b2414", lineHeight: 1.1 }}>{v as string}</div>
    </div>; })}
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M7: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  if (A.some((_, i) => inA(i))) L.push(<Avatar key="av" t={t} />);

  // 523,5-525 · repisa: vasito 5 → SECRETO 5 · EL AZÚCAR (sigue abajo con Leti)
  if (t < A[0][0] + 0.02) L.push(W("w1", t));
  L.push(<SecretoTitulo key="st" t={t} at={T.num} word={T.azucar} n={5} text="EL AZÚCAR" out={T.coraje - 0.5} y={700} col="#7b4bd1" />);
  // 525-530,3 (avatar) · el que le da coraje a tu tía
  L.push(<Tia key="ti" t={t} at={T.coraje} out={A[0][1] - 0.15} x={1500} y={430} />);
  // 530,3-538,6 · la olla: el azúcar al principio, con el arroz crudo → EL ERROR Nº 1
  if (t >= A[0][1] && t < T.mira - 0.05) {
    L.push(W("w2", t));
    const p = screenOf(t, [O[0], SY + 0.05, O[2]]);
    L.push(<Tag key="ap" t={t} at={T.principio} x={p.x} y={p.y} dx={-330} dy={-180} text="AL PRINCIPIO ✗" col="#ff9a7a" out={T.error - 0.2} size={62} />);
    L.push(<Liston key="ls" t={t} at={T.error + 0.3} out={T.mira - 0.2} x={960} y={200} text="EL ERROR Nº 1" />);
  }
  // 538,6-541,8 · mira por qué: el azúcar le roba el agua al grano
  if (t >= T.mira - 0.05 && t < A[1][0] + 0.02) L.push(W("w3", t));
  L.push(<Ladron key="ld" t={t} at={T.roba - 0.3} out={A[1][0] + 0.2} x={960} y={560} />);
  // 541,8-545,6 (avatar) · deja el grano de abrirse
  L.push(<Candado key="cd" t={t} at={T.abrirse - 0.2} out={A[1][1] + 0.2} x={1500} y={460} />);
  // 545,6-550,8 · la olla en corte: se queda duro por más que lo cuezas
  if (t >= A[1][1] && t < T.carameliza - 2.4) { L.push(W("w4", t)); const p = screenOf(t, [C[0], 0.92, C[2]]); L.push(<Tag key="du" t={t} at={T.duro + 0.2} x={p.x} y={p.y} dx={260} dy={-180} text="DURO" sub="por más que lo cuezas" col="#ffd27a" out={T.carameliza - 2.6} size={72} />); }
  // 550,8-555,4 · el fondo caramelizado
  if (t >= T.carameliza - 2.4 && t < T.quemado - 0.3) { L.push(<Whip key="wc" t={t} at={T.carameliza - 2.4} d={0.4} a={W("w4b", Math.min(t, T.carameliza - 2.41))} b={<Clip k="r_caramelo_fondo" t={t} a={T.carameliza - 2.4} z={[1.03, 1.12]} />} />); L.push(<Sello key="ca" t={t} at={T.carameliza} text="SE CARAMELIZA" x={1250} y={220} out={T.quemado - 0.5} rot={-5} col="#c27a1a" size={92} />); }
  L.push(<Vaho key="v1" t={t} mid={T.quemado - 0.3} w={0.3} />);
  // 555,4-559,5 · la olla 3D: sabor a quemado, color café
  if (t >= T.quemado - 0.3 && t < A[2][0] + 0.02) { L.push(W("w5", t)); L.push(<Escrito key="cn" t={t} at={T.cafe} out={A[2][0] - 0.1} x={200} y={200} text="ese café que nadie quiere" size={84} col="#ffb07a" dur={0.8} />); }
  // 559,5-565,5 (avatar) · "es que mi arroz siempre se pega" → no es el arroz: es el azúcar a destiempo
  if (inA(2)) { L.push(<Burbuja key="bb" t={t} at={T.dicen + 0.8} out={T.noes - 0.1} x={1220} y={250} text="¡es que mi arroz siempre se pega!" tail="l" />); L.push(<Voltea key="vt" t={t} at={T.noes} flip={T.destiempo - 0.4} out={A[2][1] - 0.1} x={1470} y={450} />); }
  // 565,5-572 · la olla: mi mamá esperaba que estuviera suave
  if (t >= A[2][1] && t < T.granos + 0.9) { L.push(W("w6", t)); L.push(<Escrito key="es" t={t} at={T.esperaba} out={T.granos + 0.6} x={1000} y={200} text="esperaba que estuviera suave" size={84} dur={0.9} />); }
  // 572-577,9 · la prueba: aplastar los granos con los dedos
  if (t >= T.granos + 0.9 && t < A[3][0] + 0.02) { L.push(<Whip key="wa" t={t} at={T.granos + 0.9} d={0.35} a={W("w6b", Math.min(t, T.granos + 0.89))} b={<Clip k="r_lety_aplasta" t={t} a={T.granos + 0.9} z={[1.03, 1.1]} />} />); L.push(<Aplasta key="ap2" t={t} at={T.aplastas} des={T.deshacen} out={A[3][0] - 0.1} x={1560} y={460} />); }
  // 577,9-583,6 (avatar) · ahí y sólo ahí: 100 g, media taza
  if (inA(3)) L.push(<Medidora key="mt" t={t} at={T.g100} media={T.media} out={A[3][1] + 0.3} x={1480} y={470} />);
  // 583,6-589 · Lety echa el azúcar: 2 minutos más moviendo
  if (t >= A[3][1] && t < T.rancho - 0.05) { L.push(<Clip key="cz" k="r_lety_azucar" t={t} a={A[3][1]} z={[1.03, 1.1]} />); L.push(<Giro key="gi" t={t} at={T.dos} out={T.rancho - 0.3} x={1560} y={360} />); }
  // 589-593,2 · el piloncillo rallado: sabor de rancho
  if (t >= T.rancho - 0.05 && t < A[4][0] + 0.02) { L.push(<Whip key="wp" t={t} at={T.rancho - 0.05} d={0.35} a={<Clip k="r_lety_azucar" t={t} a={A[3][1]} z={[1.03, 1.1]} />} b={<Clip k="r_piloncillo" t={t} a={T.rancho} z={[1.1, 1.03]} />} />); L.push(<Cono key="co" t={t} at={T.pilon} out={A[4][0] - 0.1} x={1450} y={430} />); }
  // 593,2-598,7 (avatar) · doradito, a caramelo
  if (inA(4)) L.push(<Caramelo key="cr" t={t} at={T.doradito - 0.3} car={T.caramelo} out={A[4][1] - 0.15} x={1480} y={470} />);
  // 598,7-603,7 · la mesa con los conos de piloncillo: $3 vs un poco más
  if (t >= A[4][1]) { L.push(W("w7", t)); L.push(<Boletos key="bo" t={t} a1={T.tres} a2={T.poco} out={M7_END - 0.1} x={1040} y={170} />); }
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
