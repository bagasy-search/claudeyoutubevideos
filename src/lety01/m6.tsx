// lety01 · TRAMO 6 (421-523,5 s): SECRETO 4 · EL FUEGO — fuego bajo, sin tapa, cuchara al fondo → bajito, que nomás tiemble →
// si hierve fuerte se tira, se pega y se quema → amargo, a humo, no se quita con nada → sin tapa: se consume despacito; tapada se
// derrama → cada 5 min la cuchara de palo, raspando TODA la base → "tú no te me vas, Leti" → huele cuando lo dejas solo → 30 min →
// posada / cumpleaños / fiesta del santo: la olla grande para 25 → $8 el plato vs $1,000 en la pastelería.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, VASOS, WorldProps, screenOf, setKeys } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Clip, Escrito, Sello, Vaho, Whip } from "./Min1";
import { M5_END } from "./m5";
import { SecretoTitulo } from "./m3";
import { FONT, HAND, LT, SERIF, Tag, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1];
const T = {
  num: at("secreto numero 4", 420), fuego: at("fuego bajo", 422), tapa: at("sin tapa", 423), cuchara: at("la cuchara siempre", 424), baja: at("el fuego se baja", 428), bajito: at("bajito", 429),
  tiemble: at("tiemble", 431), fuerte: at("hierve fuerte", 432), tira: at("se tira", 435), pega: at("se pega y se quema", 437), amargo: at("amargo", 441), humo: at("humo", 442),
  azucar: at("mas azucar", 444), canela: at("mas canela", 446), sintapa: at("la olla sin tapa", 447), despacito: at("despacito", 451), espese: at("espese sola", 452), tapas: at("si la tapas", 453),
  derrama: at("derrama", 455), cinco: at("cada cinco minutos", 456), palo: at("cuchara de palo", 457), arriba: at("por arriba", 460), raspas: at("raspas el fondo", 461), lado: at("de un lado al otro", 463),
  base: at("toda la base", 466), ahi: at("ahi es donde se pega", 468), crema: at("se vuelve crema", 471), mama: at("mi mama me tenia", 474), banquito: at("banquito", 475), novas: at("tu no te me vas", 478),
  huele: at("huele", 481), cierto: at("es cierto", 483), min30: at("30 minutos", 484), dificil: at("no es dificil", 488), nomas: at("nomas no dejarlo solo", 489),
  posada: at("posada", 492), cumple: at("cumpleanos", 493), santo: at("fiesta del santo", 494), grande: at("olla grande", 499), p25: at("25 personas", 502), kilo: at("un kilo de arroz", 504),
  litros: at("4 litros", 505), pilon: at("medio kilo", 507), p8: at("8 pesos", 510), pastel: at("pasteleria", 512), v25: at("25 vasitos", 513), mil: at("mil pesos", 515), p200: at("200", 517), rancho: at("fiesta de rancho", 519),
};
export const M6_END = at("secreto numero 5", 522) - 0.05;
const A = [AV(426.4), AV(444.3), AV(459), AV(476.6), AV(491.4), AV(508.9)];

setKeys([
  { t: M5_END + 0.1, p: [VASOS[3][0] + 0.5, 1.78, -1.9], l: [VASOS[3][0] + 0.15, 1.55, -2.84], fov: 40 },
  { t: T.fuego + 0.5, p: [VASOS[3][0] + 0.25, 1.68, -2.25], l: [VASOS[3][0], 1.56, -2.84], fov: 36 },
  { t: A[0][0], p: [O[0] + 0.9, SY + 0.6, O[2] + 1.4], l: [O[0], SY - 0.1, O[2]], fov: 44, arc: 0.05 },
  { t: A[0][1], p: [O[0] + 0.85, SY + 0.6, O[2] + 1.35], l: [O[0], SY - 0.08, O[2]], fov: 42 },
  { t: T.amargo - 2.4, p: [O[0] + 0.55, SY + 0.45, O[2] + 1.0], l: [O[0], SY - 0.05, O[2]], fov: 40 },
  { t: A[1][1], p: [O[0] + 1.2, SY + 0.9, O[2] + 1.7], l: [O[0] - 0.15, SY, O[2]], fov: 46 },
  { t: T.derrama, p: [O[0] + 0.75, SY + 0.6, O[2] + 1.2], l: [O[0], SY, O[2]], fov: 42, arc: -0.04 },
  { t: A[2][1], p: [O[0] + 0.7, SY + 0.95, O[2] + 0.75], l: [O[0], SY - 0.05, O[2]], fov: 40 },
  { t: T.mama - 0.05, p: [O[0] + 0.45, SY + 0.85, O[2] + 0.5], l: [O[0], SY - 0.05, O[2]], fov: 38, arc: 0.04 },
  { t: T.mama + 0.05, p: [O[0] - 0.9, 0.65, O[2] + 1.3], l: [O[0], SY + 0.05, O[2]], fov: 52 },
  { t: A[3][0], p: [O[0] - 0.75, 0.62, O[2] + 1.15], l: [O[0], SY + 0.05, O[2]], fov: 50 },
  { t: A[3][1], p: [O[0] + 0.55, SY + 0.6, O[2] + 0.95], l: [O[0], SY + 0.05, O[2]], fov: 40 },
  { t: T.cierto, p: [O[0] + 0.4, SY + 0.5, O[2] + 0.8], l: [O[0], SY + 0.05, O[2]], fov: 38 },
  { t: T.dificil - 0.05, p: [O[0] + 0.6, SY + 0.6, O[2] + 1.05], l: [O[0], SY, O[2]], fov: 40 },
  { t: A[4][0], p: [O[0] + 0.45, SY + 0.5, O[2] + 0.85], l: [O[0], SY, O[2]], fov: 38, arc: 0.04 },
  { t: A[4][1], p: [-2.4, 1.6, 0.4], l: [-6.5, 1.2, -0.8], fov: 54 },
  { t: T.grande - 0.05, p: [-3.6, 1.9, 1.4], l: [-7.2, 1.0, -1.2], fov: 56 },
  { t: T.rancho - 0.9, p: [O[0] + 1.0, SY + 0.85, O[2] + 1.5], l: [O[0], SY + 0.1, O[2]], fov: 44 },
  { t: M6_END, p: [O[0] + 0.6, SY + 0.6, O[2] + 1.05], l: [O[0], SY + 0.05, O[2]], fov: 40, arc: 0.06 },
]);

const st = (t: number): WorldProps => {
  const fuerte = t > A[0][1] && t < T.amargo - 2.4;
  const tapada = t > A[1][1] && t < T.cinco;
  return {
    t, steam: 1.2, vasos: VASOS.map((_, i) => (i <= 3 ? (i === 3 ? 1 : 0.45) : 0.2)),
    fire: t < A[0][0] ? 1 : fuerte ? 1.8 : t < A[0][1] ? 1 - 0.55 * e(t, T.bajito - 0.3, T.tiemble) : 0.6,
    hervor: fuerte ? e(t, T.fuerte, T.tira) * (1 - e(t, T.pega - 0.3, T.pega + 0.2)) : tapada ? e(t, T.derrama - 1.3, T.derrama) : 0,
    burnt: fuerte ? e(t, T.pega - 0.2, T.pega + 0.6) * 0.8 : 0, smoke: fuerte ? e(t, T.pega, T.pega + 0.6) : 0,
    tapa: tapada ? e(t, T.tapas, T.tapas + 0.8) : 0,
    stir: t > A[2][1] - 0.1 && t < T.mama ? 2.2 * (t - A[2][1]) : undefined,
    cream: tapada ? 0.75 + 0.25 * e(t, T.despacito, T.espese + 0.6) : 1,
  };
};
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS =================
// tres reglas con ícono que se encienden en orden: FUEGO BAJO · SIN TAPA · AL FONDO
const TresReglas: React.FC<{ t: number; at: number[]; out: number; y: number }> = ({ t, at: as, out, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < as[0] - 0.1 || o <= 0.01) return null;
  const ico = [
    <g key="f"><path d="M 0 40 C -40 30 -40 -10 -10 -40 C -10 -15 10 -10 5 -35 C 35 -10 40 30 0 40 Z" fill="#ff7a1a" /><path d="M 0 40 C -18 32 -15 10 0 -5 C 15 12 18 32 0 40 Z" fill="#ffd34a" /></g>,
    <g key="t"><ellipse cy={10} rx={46} ry={14} fill="#2a6fc0" /><circle cy={-4} r={8} fill="#174d92" /><path d="M -50 -40 L 50 40" stroke="#e23a2a" strokeWidth={10} strokeLinecap="round" /></g>,
    <g key="c"><rect x={-5} y={-48} width={10} height={70} rx={5} fill="#9a5a2a" /><ellipse cy={30} rx={16} ry={22} fill="#9a5a2a" /><path d="M -45 46 L 45 46" stroke="#fff" strokeWidth={6} /></g>,
  ];
  const labs = ["FUEGO BAJO", "SIN TAPA", "AL FONDO"];
  return <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: "translateX(-50%)", display: "flex", gap: 36 }}>
    {labs.map((l, i) => { const k = Math.min(1.12, spr(t, as[i], 1.2)), on = t > as[i]; return <div key={i} style={{ width: 300, padding: "18px 0 14px", borderRadius: 24, background: on ? "rgba(255,250,240,.95)" : "rgba(255,250,240,.25)", textAlign: "center", transform: `scale(${on ? k : 0.9})`, boxShadow: "0 24px 36px rgba(0,0,0,.5)" }}>
      <svg width={110} height={110} viewBox="-55 -55 110 110">{ico[i]}</svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: LT.tinta }}>{l}</div>
    </div>; })}
  </div>;
};

// la llama que se achica: BAJITO… que nomás tiemble
const Llama: React.FC<{ t: number; at: number; tiem: number; out: number; x: number; y: number }> = ({ t, at: a, tiem, out, x, y }) => {
  const o = e(t, a - 0.6, a - 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const s = 1 - 0.6 * ei(t, a - 0.3, a + 0.6), fl = 1 + 0.06 * Math.sin(t * 17) + 0.04 * Math.sin(t * 29);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={300} height={340} viewBox="-150 -300 300 340" style={{ overflow: "visible", filter: "drop-shadow(0 0 30px rgba(255,120,30,.6))" }}>
      <g transform={`scale(${s * fl} ${s})`}><path d="M 0 0 C -110 -20 -100 -150 -30 -260 C -30 -170 30 -160 20 -240 C 110 -150 110 -20 0 0 Z" fill="#ff6a1a" /><path d="M 0 0 C -50 -10 -45 -80 0 -140 C 45 -80 50 -10 0 0 Z" fill="#ffd34a" /></g>
      <rect x={-120} y={10} width={240} height={22} rx={8} fill="#3a3a3a" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#ffd34a", textShadow: extrude(7, "#7a3412") }}>BAJITO</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: LT.crema, textShadow: "0 4px 10px #000", opacity: e(t, tiem, tiem + 0.3), transform: `translateX(${Math.sin(t * 40) * 3 * e(t, tiem, tiem + 0.3)}px)` }}>que nomás tiemble</div>
  </div>;
};

// etiquetas de sabor pegadas como cinta: AMARGO · A HUMO
const Sabores: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a1 - 0.1 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {[["AMARGO", a1, -6], ["A HUMO", a2, 5]].map(([w, a, r], i) => { const aa = a as number, d = e(t, aa, aa + 0.35); return <div key={i} style={{ display: "block", marginBottom: 26, transform: `rotate(${r}deg)`, clipPath: `inset(0 ${100 - 100 * d}% 0 0)` }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#fff", background: i ? "#4a4a4a" : "#6a3a1a", padding: "6px 34px", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>{w as string}</span>
    </div>; })}
  </div>;
};

// azucarera y raja vector con su X: ni con más azúcar, ni con más canela
const NiCon: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = e(t, a1 - 0.3, a1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const X = (a: number) => <path d="M -70 -70 L 70 70 M 70 -70 L -70 70" stroke="#e23a2a" strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e(t, a + 0.2, a + 0.5)} />;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40 }}>
    {[a1, a2].map((a, i) => <div key={i} style={{ textAlign: "center", opacity: e(t, a - 0.3, a), transform: `scale(${Math.min(1.1, spr(t, a - 0.3, 1.2))})` }}>
      <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ filter: "drop-shadow(0 20px 26px rgba(0,0,0,.6))" }}>
        <circle r={95} fill="rgba(255,250,240,.95)" />
        {i === 0 ? <g><path d="M -45 -10 L -40 55 L 40 55 L 45 -10 Z" fill="#c2552d" /><ellipse cy={-12} rx={46} ry={14} fill="#fff" /><rect x={-6} y={-60} width={12} height={46} fill="#b0b5b9" /></g>
          : <g transform="rotate(-30)"><rect x={-65} y={-14} width={130} height={28} rx={14} fill="#9a5a2a" /><rect x={-65} y={-6} width={130} height={6} fill="#c78a4a" /></g>}
        {X(a)}
      </svg>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: LT.crema, textShadow: "0 4px 10px #000" }}>{i ? "ni más canela" : "ni más azúcar"}</div>
    </div>)}
  </div>;
};

// flechitas de vapor que suben de la olla destapada: SE CONSUME DESPACITO
const Vapor: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {[-120, -40, 40, 120].map((dx, i) => { const ph = ((t - a) * 0.5 + i * 0.25) % 1; return <svg key={i} width={60} height={110} viewBox="-30 -55 60 110" style={{ position: "absolute", left: dx - 30, top: -ph * 220 - 55, opacity: Math.sin(ph * Math.PI) }}><path d="M 0 50 C -20 20 20 0 0 -30" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M -16 -20 L 0 -46 L 16 -20" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" /></svg>; })}
    <div style={{ position: "absolute", left: 200, top: -170, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: LT.crema, textShadow: "0 4px 10px #000" }}>se consume despacito</div>
  </div>;
};

// reloj de pared con la rebanada de 5 minutos que se repite
const Reloj5: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), k = Math.min(1.1, spr(t, a - 0.2, 1));
  if (o <= 0.01) return null;
  const sw = e(t, a, a + 0.8) * 30, R = 110, wedge = `M 0 0 L 0 ${-R} A ${R} ${R} 0 0 1 ${Math.sin((sw * Math.PI) / 180) * R} ${-Math.cos((sw * Math.PI) / 180) * R} Z`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={280} height={280} viewBox="-140 -140 280 280" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <circle r={130} fill="#8a5a2a" /><circle r={115} fill="#fff7ea" /><path d={wedge} fill={LT.turq} opacity={0.85} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-3} y={-112} width={6} height={18} fill="#3b2414" transform={`rotate(${i * 30})`} />)}
      <rect x={-4} y={-90} width={8} height={90} rx={4} fill="#3b2414" transform={`rotate(${sw})`} /><circle r={10} fill="#3b2414" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: LT.crema, textShadow: extrude(6, "#0e5a54"), marginTop: -4 }}>CADA 5 MIN</div>
  </div>;
};

// vista desde arriba de la olla: la cuchara que sólo da vueltas arriba ✗ vs la que raspa el fondo ✓
const Remolino: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ang = (t - a) * 4;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40 }}>
    {[0, 1].map((i) => <div key={i} style={{ textAlign: "center" }}>
      <svg width={240} height={240} viewBox="-120 -120 240 240" style={{ filter: "drop-shadow(0 20px 26px rgba(0,0,0,.6))" }}>
        <circle r={110} fill="#2a6fc0" /><circle r={96} fill="#fff1d6" />
        {i === 0 ? <><circle r={40} fill="none" stroke="#c9a070" strokeWidth={6} strokeDasharray="10 10" /><circle cx={Math.cos(ang) * 40} cy={Math.sin(ang) * 40} r={14} fill="#9a5a2a" /></>
          : <><path d="M -80 -30 L 80 -30 L -80 10 L 80 10 L -80 50" stroke="#c9a070" strokeWidth={6} fill="none" strokeDasharray="10 10" /><circle cx={80 * Math.sin(ang * 0.7)} cy={10 + 40 * Math.sin(ang * 0.35)} r={14} fill="#9a5a2a" /></>}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: i ? LT.turq : "#ff6a5a", textShadow: "0 3px 8px #000" }}>{i ? "✓ RASPA EL FONDO" : "✗ SÓLO ARRIBA"}</div>
    </div>)}
  </div>;
};

// la base de la olla vista desde abajo: el camino de la cuchara la cubre entera
const BaseOlla: React.FC<{ t: number; at: number; base: number; out: number; x: number; y: number }> = ({ t, at: a, base, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const d = e(t, a, base + 0.6), full = e(t, base, base + 0.5);
  let p = ""; for (let i = 0; i <= 8; i++) { const yy = -110 + i * 27.5, w = Math.sqrt(Math.max(0, 125 * 125 - yy * yy)); p += `${i ? " L" : "M"} ${i % 2 ? w : -w} ${yy}`; }
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={340} height={340} viewBox="-170 -170 340 340" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <circle r={160} fill="#174d92" /><circle r={135} fill="#f0dcb0" /><circle r={135} fill={LT.turq} opacity={0.35 * full} />
      <path d={p} stroke="#7a4a22" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: LT.crema, textShadow: "0 4px 10px #000" }}>{full > 0.5 ? "TODA LA BASE" : "DE UN LADO AL OTRO"}</div>
  </div>;
};

// cita de mamá con comillas grandes de barro
const Cita: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sign: string }> = ({ t, at: a, out, x, y, text, sign }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), w = e(t, a, a + 1.0);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", maxWidth: 680 }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 220, color: "#c2552d", lineHeight: 0.6, height: 90, textShadow: "0 10px 20px rgba(0,0,0,.5)", transform: `scale(${Math.min(1.1, spr(t, a - 0.2, 1))})`, transformOrigin: "0 100%" }}>“</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 78, color: LT.crema, textShadow: "0 5px 12px #000", lineHeight: 1.05, clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)` }}>{text}</div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#ffd27a", textShadow: "0 3px 8px #000", marginTop: 10, opacity: e(t, a + 0.9, a + 1.2) }}>{sign}</div>
  </div>;
};

// ondas de olor que salen de la olla y se rizan (huele cuando lo dejas solo)
const Olor: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <svg width={500} height={420} viewBox="-250 -400 500 420" style={{ position: "absolute", left: -250, top: -400, overflow: "visible" }}>
      {[-90, 0, 90].map((dx, i) => { const ph = (t - a) * 2 + i; let p = `M ${dx} 0`; for (let k = 1; k <= 20; k++) p += ` L ${dx + Math.sin(ph + k * 0.6) * 26} ${-k * 18}`; return <path key={i} d={p} stroke="#f6d38a" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e(t, a + i * 0.15, a + 0.9 + i * 0.15)} opacity={0.9} />; })}
    </svg>
    <div style={{ position: "absolute", left: 200, top: -330, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 76, color: "#ffd27a", textShadow: "0 4px 10px #000", opacity: e(t, a + 0.3, a + 0.6) }}>huele…</div>
  </div>;
};

// medio reloj que se llena: 30 MINUTOS
const Media: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), f = ei(t, a, a + 1.4), R = 120;
  if (o <= 0.01) return null;
  const an = f * Math.PI, path = `M 0 0 L 0 ${-R} A ${R} ${R} 0 ${an > Math.PI ? 1 : 0} 1 ${Math.sin(an) * R} ${-Math.cos(an) * R} Z`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <circle r={140} fill="#fff7ea" stroke="#3b2414" strokeWidth={10} /><path d={path} fill="#f2a31b" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-3} y={-135} width={6} height={20} fill="#3b2414" transform={`rotate(${i * 30})`} />)}
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: "#f2a31b", textShadow: extrude(7, "#6a3a06"), marginTop: -8 }}>30 MIN</div>
  </div>;
};

// tira de papel picado con las tres fiestas
const Picado: React.FC<{ t: number; at: number[]; out: number }> = ({ t, at: as, out }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < as[0] - 0.4 || o <= 0.01) return null;
  const cols = ["#e2457a", "#f2a31b", LT.turq], labs = ["POSADA", "CUMPLEAÑOS", "FIESTA DEL SANTO"];
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, opacity: o }}>
    <svg width={1920} height={70} style={{ position: "absolute", top: 40 }}><path d="M 0 20 Q 960 60 1920 20" stroke="#5a3014" strokeWidth={4} fill="none" /></svg>
    {labs.map((l, i) => { const a = as[i], k = e(t, a - 0.3, a + 0.1), sw = Math.sin(t * 2.4 + i) * 4; return <div key={i} style={{ position: "absolute", left: 1080 + i * 270 - (i === 2 ? 30 : 0), top: 55, width: 250, height: 270, background: cols[i], transformOrigin: "50% 0", transform: `rotate(${sw}deg) scaleY(${k})`, clipPath: "polygon(0 0,100% 0,100% 88%,88% 100%,75% 88%,62% 100%,50% 88%,38% 100%,25% 88%,12% 100%,0 88%)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.25)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: i === 2 ? 38 : 40, color: "#fff", padding: 10, textShadow: "0 2px 6px rgba(0,0,0,.4)" }}>{l}</div>
    </div>; })}
  </div>;
};

// 25 personitas que se van encendiendo
const Gente: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.6, a - 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const cols = ["#e2457a", "#f2a31b", LT.turq, "#7b4bd1", "#3c8be6"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, padding: 24, background: "rgba(30,18,10,.7)", borderRadius: 24 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 70px)", gap: 8 }}>{Array.from({ length: 25 }, (_, i) => { const on = e(t, a - 0.6 + i * 0.04, a - 0.45 + i * 0.04); return <svg key={i} width={70} height={80} viewBox="0 0 70 80" style={{ opacity: 0.25 + 0.75 * on, transform: `scale(${0.8 + 0.2 * on})` }}><circle cx={35} cy={20} r={14} fill={cols[i % 5]} /><path d="M 10 78 Q 10 40 35 40 Q 60 40 60 78 Z" fill={cols[i % 5]} /></svg>; })}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: LT.crema, textAlign: "center", textShadow: extrude(6, "#7a3412") }}>25 PERSONAS</div>
  </div>;
};

// tres costalitos de mandado con su cantidad
const Mandado: React.FC<{ t: number; rows: [string, string, number][]; out: number; x: number; y: number }> = ({ t, rows, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < rows[0][2] - 0.2 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", flexDirection: "column", gap: 18 }}>
    {rows.map(([q, w, a], i) => { const k = Math.min(1.1, spr(t, a - 0.1, 1.2)); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: e(t, a - 0.15, a), transform: `translateX(${(1 - Math.min(1, k)) * 300}px)` }}>
      <svg width={110} height={120} viewBox="0 0 110 120" style={{ filter: "drop-shadow(0 14px 18px rgba(0,0,0,.5))" }}><path d="M 15 30 Q 10 110 20 115 L 90 115 Q 100 110 95 30 Z" fill="#d9c08a" /><path d="M 15 30 Q 55 10 95 30 L 85 22 Q 55 0 25 22 Z" fill="#b89a5a" /><rect x={30} y={60} width={50} height={30} rx={4} fill="#fffaf0" /></svg>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, color: "#ffd27a", textShadow: extrude(6, "#6a4206") }}>{q}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: LT.crema, textShadow: "0 4px 10px #000" }}>{w}</div>
    </div>; })}
  </div>;
};

// dos barras: pastelería $1,000 vs hecho en casa $200
const Barras: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = e(t, a1 - 0.3, a1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const h1 = 520 * ei(t, a1 - 0.2, a1 + 0.6), h2 = 104 * ei(t, a2 - 0.1, a2 + 0.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", alignItems: "flex-end", gap: 60, height: 700, padding: "0 40px 20px", background: "rgba(30,18,10,.55)", borderRadius: 26 }}>
    {[[h1, "$1,000", "PASTELERÍA", "#9aa7b0"], [h2, "$200", "EN CASA", "#f2a31b"]].map(([h, v, l, c], i) => <div key={i} style={{ textAlign: "center", width: 240 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: c as string, textShadow: "0 4px 10px #000", opacity: (h as number) > 20 ? 1 : 0 }}>{v as string}</div>
      <div style={{ height: h as number, background: c as string, borderRadius: "14px 14px 0 0", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: LT.crema, marginTop: 10 }}>{l as string}</div>
    </div>)}
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M6: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  if (A.some((_, i) => inA(i))) L.push(<Avatar key="av" t={t} />);

  // 421-426,4 · repisa → la olla: SECRETO 4 · EL FUEGO + las tres reglas
  if (t < A[0][0] + 0.02) { L.push(W("w1", t)); L.push(<SecretoTitulo key="st" t={t} at={T.num} word={T.fuego} n={4} text="EL FUEGO" out={T.tapa - 0.1} col="#ff7a1a" />); }
  L.push(<TresReglas key="tr" t={t} at={[T.fuego, T.tapa, T.cuchara]} out={A[0][0] + 0.4} y={720} />);
  // 426,4-432,7 (avatar) · bajito, que nomás tiemble
  L.push(<Llama key="ll" t={t} at={T.bajito} tiem={T.tiemble} out={A[0][1] - 0.15} x={1500} y={470} />);
  // 432,7-436,3 · si hierve fuerte: la leche sube y se tira
  if (t >= A[0][1] && t < T.tira + 0.9) {
    L.push(<Whip key="wd" t={t} at={A[0][1]} d={0.35} a={<Avatar t={t} />} b={<Clip k="r_derrame" t={t} a={A[0][1]} z={[1.04, 1.12]} />} />);
    L.push(<Sello key="tr2" t={t} at={T.tira} text="¡SE TIRA!" x={1400} y={250} out={T.tira + 0.7} rot={-8} col="#e23a2a" size={120} />);
  }
  // 436,3-439 · la olla 3D: lo del fondo se pega y se quema
  if (t >= T.tira + 0.9 && t < T.amargo - 2.4) { L.push(W("w2", t)); const p = screenOf(t, [O[0], SY - 0.12, O[2] + 0.2]); L.push(<Tag key="pq" t={t} at={T.pega} x={p.x} y={p.y} dx={-320} dy={-200} text="SE PEGA Y SE QUEMA" col="#ff9a7a" out={T.amargo - 2.6} size={60} />); }
  L.push(<Vaho key="v1" t={t} mid={T.amargo - 2.4} w={0.3} />);
  // 439-444,3 · el fondo quemado: amargo, a humo
  if (t >= T.amargo - 2.4 && t < A[1][0] + 0.02) { L.push(<Clip key="cq" k="r_quemado_fondo" t={t} a={T.amargo - 2.4} z={[1.03, 1.12]} />); L.push(<Sabores key="sb" t={t} a1={T.amargo} a2={T.humo} out={A[1][0] - 0.15} x={1150} y={200} />); }
  // 444,3-448,8 (avatar) · no se quita con nada
  L.push(<NiCon key="nc" t={t} a1={T.azucar} a2={T.canela} out={A[1][1] - 0.2} x={1460} y={460} />);
  // 448,8-456,5 · la olla sin tapa se consume despacito… si la tapas, se derrama
  if (t >= A[1][1] && t < T.cinco + 0.05) {
    L.push(W("w3", t));
    const lid = screenOf(t, [PT.olla[0] + 0.45, PT.olla[1] + 0.4, PT.olla[2] - 0.3]);
    L.push(<Tag key="st2" t={t} at={A[1][1] + 0.1} x={lid.x} y={lid.y} dx={140} dy={-150} text="SIN TAPA" col="#ffd27a" out={T.tapas - 0.2} size={62} />);
    const top = screenOf(t, [O[0], SY + 0.15, O[2]]);
    L.push(<Vapor key="vp" t={t} at={T.despacito - 0.3} out={T.tapas - 0.2} x={top.x} y={top.y} />);
    L.push(<Sello key="dr" t={t} at={T.derrama} text="SE DERRAMA" x={560} y={240} out={T.cinco - 0.1} rot={-6} col="#e23a2a" size={100} />);
  }
  // 456,5-459 · Lety con la cuchara de palo · cada 5 minutos
  if (t >= T.cinco + 0.05 && t < A[2][0] + 0.02) { L.push(<Whip key="wr" t={t} at={T.cinco + 0.05} d={0.35} a={W("w3b", Math.min(t, T.cinco + 0.04))} b={<Clip k="r_lety_raspa" t={t} a={T.cinco} z={[1.03, 1.1]} />} />); L.push(<Reloj5 key="r5" t={t} at={T.cinco + 0.3} out={A[2][0] - 0.1} x={1520} y={420} />); }
  // 459-463,1 (avatar) · no nomás por arriba, ¿eh?
  if (inA(2)) L.push(<Remolino key="rm" t={t} at={T.arriba - 0.3} out={A[2][1] - 0.15} x={1440} y={470} />);
  // 463,1-474,1 · la cuchara 3D raspa el fondo: toda la base → se vuelve crema
  if (t >= A[2][1] && t < T.mama - 0.05) {
    L.push(W("w4", t));
    L.push(<BaseOlla key="bo" t={t} at={T.lado - 0.2} base={T.base} out={T.ahi - 0.1} x={1550} y={460} />);
    const p = screenOf(t, [O[0] + 0.1, SY - 0.05, O[2] + 0.2]);
    L.push(<Tag key="ad" t={t} at={T.ahi} x={p.x} y={p.y} dx={-330} dy={-160} text="AHÍ ES DONDE SE PEGA" col="#ff9a7a" out={T.crema - 0.2} size={56} />);
    L.push(<Escrito key="vc" t={t} at={T.crema} out={T.mama - 0.2} x={1000} y={200} text="…se vuelve crema" size={110} dur={0.6} />);
  }
  // 474,1-476,6 · a la altura del banquito, mirando la olla desde abajo
  if (t >= T.mama - 0.05 && t < A[3][0] + 0.02) { L.push(W("w5", t)); L.push(<Escrito key="bq" t={t} at={T.banquito - 0.2} out={A[3][0] - 0.1} x={260} y={180} text="desde el banquito…" size={96} dur={0.6} />); }
  // 476,6-480,3 (avatar) · "tú no te me vas, Leti"
  if (inA(3)) L.push(<Cita key="ci" t={t} at={T.novas} out={A[3][1] - 0.1} x={1480} y={420} text="Tú no te me vas, Leti." sign="— mi mamá" />);
  // 480,3-483,3 · la olla 3D: huele cuando lo dejas solo
  if (t >= A[3][1] && t < T.cierto) { L.push(W("w6", t)); const p = screenOf(t, [O[0], SY + 0.05, O[2]]); L.push(<Olor key="or" t={t} at={T.huele - 0.1} out={T.cierto - 0.2} x={p.x} y={p.y} />); }
  // 483,3-488,4 · Lety mira el reloj: 30 minutos
  if (t >= T.cierto && t < T.dificil - 0.05) { L.push(<Whip key="wt" t={t} at={T.cierto} d={0.35} a={W("w6b", Math.min(t, T.cierto - 0.01))} b={<Clip k="r_lety_reloj" t={t} a={T.cierto} z={[1.03, 1.1]} />} />); L.push(<Media key="md" t={t} at={T.min30} out={T.dificil - 0.3} x={1520} y={440} />); }
  L.push(<Vaho key="v2" t={t} mid={T.dificil - 0.05} w={0.3} />);
  // 488,4-491,4 · la olla cremosa: nomás no dejarlo solo
  if (t >= T.dificil - 0.05 && t < A[4][0] + 0.02) { L.push(W("w7", t)); L.push(<Sello key="nd" t={t} at={T.dificil} text="NO ES DIFÍCIL" x={540} y={220} out={A[4][0] - 0.1} rot={-5} col={LT.turq} size={84} />); L.push(<Escrito key="ns" t={t} at={T.nomas} out={A[4][0] - 0.1} x={260} y={860} text="nomás no dejarlo solo" size={92} dur={0.7} />); }
  // 491,4-496,1 (avatar) · posada, cumpleaños, fiesta del santo
  L.push(<Picado key="pp" t={t} at={[T.posada, T.cumple, T.santo]} out={A[4][1] + 1.5} />);
  // 496,1-498,5 · la cámara sale al patio
  if (t >= A[4][1] && t < T.grande - 0.05) L.push(W("w8", t));
  // 498,5-504,4 · la olla grande para 25 personas
  if (t >= T.grande - 0.05 && t < T.kilo - 0.1) { L.push(<Whip key="wf" t={t} at={T.grande - 0.05} d={0.4} a={W("w8b", Math.min(t, T.grande - 0.06))} b={<Clip k="r_fiesta_olla" t={t} a={T.grande} z={[1.1, 1.03]} />} />); L.push(<Gente key="gt" t={t} at={T.p25} out={T.kilo - 0.3} x={1240} y={170} />); }
  // 504,4-508,9 · Lety sirve en la fiesta · el mandado
  if (t >= T.kilo - 0.1 && t < A[5][0] + 0.02) L.push(<Whip key="wk" t={t} at={T.kilo - 0.1} d={0.35} dir={-1} a={<Clip k="r_fiesta_olla" t={t} a={T.grande} z={[1.1, 1.03]} />} b={<Clip k="r_lety_fiesta" t={t} a={T.kilo} z={[1.03, 1.1]} />} />);
  L.push(<Mandado key="mn" t={t} rows={[["1 kg", "de arroz", T.kilo], ["4 L", "de leche", T.litros], ["½ kg", "de piloncillo", T.pilon]]} out={A[5][0] + 0.4} x={1180} y={300} />);
  // 508,9-513,2 (avatar) · $8 el plato
  if (inA(5)) L.push(<Sello key="p8" t={t} at={T.p8} text="$8 EL PLATO" x={1470} y={300} out={A[5][1] - 0.2} rot={-6} col="#f2a31b" size={96} />);
  // 513,2-518,1 · la vitrina de la pastelería: $1,000 vs $200
  if (t >= A[5][1] && t < T.rancho - 0.9) { L.push(<Clip key="cp" k="r_pasteleria_vitrina" t={t} a={A[5][1]} z={[1.03, 1.1]} />); L.push(<Barras key="br" t={t} a1={T.mil} a2={T.p200} out={T.rancho - 1.1} x={1180} y={160} />); }
  L.push(<Vaho key="v3" t={t} mid={T.rancho - 0.9} w={0.35} />);
  // 518,1-523,5 · el patio del rancho: sabe a fiesta de rancho
  if (t >= T.rancho - 0.9) { L.push(W("w9", t)); L.push(<Escrito key="fr" t={t} at={T.rancho - 0.3} out={M6_END - 0.3} x={1000} y={200} text="sabe a fiesta de rancho" size={100} col="#ffd27a" dur={0.8} />); }
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
