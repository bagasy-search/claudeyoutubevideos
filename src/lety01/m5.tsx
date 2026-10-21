// lety01 · TRAMO 5 (346-421 s): SECRETO 3 · LA CANELA — en raja y desde el agua → 2 errores: el polvo en la olla (arenita, color
// lodo; el polvo es sólo arriba, al servir) y la raja al final (tarda en soltar) → desde el principio: un té de canela que el grano
// se va tomando → la casa de tu abuela → la delgada de muchas capas, no la corteza gruesa → 10 cm + pizca de sal → $5.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, VASOS, WorldProps, screenOf, setKeys } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Clip, Escrito, Sello, Vaho, Whip } from "./Min1";
import { M4_END } from "./m4";
import { SecretoTitulo } from "./m3";
import { FONT, HAND, LT, SERIF, Tag, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1], M = PT.mesa;
const RAJAS: [number, number, number] = [M[0] + 0.28, 0.82, M[2] - 0.05];
const T = {
  num: at("secreto numero 3", 345), canela: at("canela va en raja", 347), agua: at("desde el agua", 349), dos: at("dos errores", 350), primero: at("el primero", 351), polvo: at("en polvo a la olla", 353),
  disuelve: at("no se disuelve", 355), arenita: at("arenita", 358), cafe: at("cafe", 360), lodo: at("lodo", 361), arriba: at("solo para arriba", 363), servir: at("servir", 364), olor: at("olor", 366),
  segundo: at("el segundo error", 367), final: at("al final", 369), tarda: at("tarda", 371), echaba: at("la echaba", 373), principio: at("desde el principio", 375), te: at("te de canela", 378),
  tomando: at("tomando", 382), entra: at("cuando entra la leche", 383), adentro: at("adentro del grano", 385), abuela: at("abuela", 389), delgada: at("raja delgada", 392), capas: at("muchas capas", 394),
  papel: at("papel enrollado", 396), desmorona: at("desmorona", 397), mexico: at("mexico", 401), gruesa: at("gruesa", 403), corteza: at("corteza", 405), picosa: at("picosa", 407),
  cm10: at("10 centimetros", 409), sal: at("pizca de sal", 412), dulce: at("lo dulce se sienta", 415), p5: at("5 pesos", 419),
};
export const M5_END = at("secreto numero 4", 420) - 0.05;
const A = [AV(345.6), AV(361.9), AV(377.2), AV(393.8), AV(408.7)];

setKeys([
  { t: A[0][1], p: [O[0] + 0.85, SY + 0.8, O[2] + 1.35], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.disuelve - 0.05, p: [O[0] + 0.4, SY + 0.55, O[2] + 0.8], l: [O[0], SY, O[2]], fov: 38, arc: 0.05 },
  { t: A[1][1] + 2.2, p: [O[0] + 0.8, SY + 0.7, O[2] + 1.3], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.tarda, p: [O[0] + 0.55, SY + 0.6, O[2] + 1.05], l: [O[0], SY, O[2]], fov: 40 },
  { t: A[2][0], p: [O[0] + 0.45, SY + 0.5, O[2] + 0.9], l: [O[0], SY - 0.03, O[2]], fov: 38, arc: -0.05 },
  { t: T.abuela - 1.0, p: [2.6, 1.75, 1.9], l: [0.3, 1.1, -2.3], fov: 56 },
  { t: T.delgada - 0.4, p: [0.3, 1.55, 0.9], l: [-0.6, 0.9, -0.6], fov: 50, arc: 0.06 },
  { t: A[3][0], p: [RAJAS[0] + 0.3, 1.15, RAJAS[2] + 0.5], l: [RAJAS[0], 0.84, RAJAS[2]], fov: 36 },
]);

const st = (t: number): WorldProps => {
  const err1 = t > A[0][1] && t < A[1][1] + 2.3, err2 = t > A[1][1] + 2.2 && t < A[2][1] + 0.1;
  return {
    t, steam: 1, vasos: VASOS.map((_, i) => (i <= 2 ? (i === 2 ? 1 : 0.45) : 0.2)),
    canelaPolvo: err1 ? e(t, T.polvo, T.disuelve + 0.5) : 0,
    drop: err1 ? { canela: Math.max(0, (t - T.polvo + 0.2) / 1.4) } : {},
    cream: err1 ? 1 - 0.5 * e(t, T.disuelve, T.lodo) : err2 ? (t < T.echaba ? 1 : 0) : 1,
    burnt: err1 ? 0.35 * e(t, T.disuelve, T.lodo) : 0,
    raja: err2 ? (t < T.echaba ? e(t, T.final - 0.2, T.final + 0.4) : 1) : t > A[2][1] ? 0 : undefined,
    agua: err2 && t > T.echaba ? 1 - e(t, T.te, T.te + 1.2) : 0,
    te: err2 && t > T.echaba ? e(t, T.te - 0.6, T.te + 1.0) : 0,
    grains: err2 && t > T.echaba ? 0.8 : 0,
  };
};
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS =================
// "2 ERRORES": dos tarjetitas que se voltean de golpe, cada una con su X
const DosErrores: React.FC<{ t: number; at: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, at: a, a1, a2, out, x, y }) => {
  const o = e(t, a - 0.15, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 30, perspective: 1200 }}>
    {[["EN POLVO", a1], ["AL FINAL", a2]].map(([w, aa], i) => { const fl = ei(t, a + i * 0.2, a + i * 0.2 + 0.5), hi = t > (aa as number); return <div key={i} style={{ width: 320, height: 220, borderRadius: 20, background: hi ? "#e23a2a" : "#fffaf0", transform: `rotateY(${(1 - fl) * 180}deg) scale(${hi ? 1.08 : 1})`, boxShadow: "0 26px 40px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backfaceVisibility: "hidden" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: hi ? "#fff" : "#e23a2a", lineHeight: 1 }}>✗ {i + 1}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: hi ? "#fff" : LT.tinta, opacity: e(t, aa as number, (aa as number) + 0.2) }}>{w as string}</div>
    </div>; })}
  </div>;
};

// muestra de pintura: crema → café lodo (con los granitos de arenita)
const Swatch: React.FC<{ t: number; at: number; cafe: number; lodo: number; out: number; x: number; y: number }> = ({ t, at: a, cafe, lodo, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const c = e(t, cafe - 0.3, lodo + 0.2);
  const col = `rgb(${Math.round(250 - 120 * c)},${Math.round(240 - 150 * c)},${Math.round(220 - 170 * c)})`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(5deg) scale(${Math.min(1.08, spr(t, a - 0.2, 1))})` }}>
    <div style={{ width: 360, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 30px 40px rgba(0,0,0,.55)" }}>
      <div style={{ height: 250, background: col, position: "relative", overflow: "hidden" }}>
        {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 61) % 340, top: (i * 37) % 240, width: 7, height: 6, borderRadius: 3, background: "#6a3a1a", opacity: e(t, a + 0.2 + (i % 10) * 0.05, a + 0.5 + (i % 10) * 0.05) }} />)}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: LT.tinta, marginTop: 10 }}>{c > 0.6 ? "COLOR LODO" : "COLOR CREMA"}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: "#8a4a22" }}>con arenita</div>
    </div>
  </div>;
};

// cuenco vector con la lluvia de canela en polvo SÓLO ARRIBA
const Espolvoreo: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const top = e(t, a + 0.1, a + 1.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={420} height={380} viewBox="-210 -230 420 380" style={{ overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      {Array.from({ length: 40 }, (_, i) => { const ph = ((t - a) * 1.4 + i / 40) % 1; return <circle key={i} cx={-60 + ((i * 29) % 120) + Math.sin(i + t * 3) * 6} cy={-220 + ph * 200} r={4} fill="#8a4a22" opacity={t > a ? 1 - ph * 0.3 : 0} />; })}
      <path d="M -180 0 Q 0 210 180 0 Z" fill="#c2552d" /><ellipse rx={180} ry={40} fill="#fff1d6" />
      {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={-150 + ((i * 53) % 300)} cy={-25 + ((i * 17) % 50)} r={5} fill="#9a5a2a" opacity={top * (((i * 53) % 300) > 30 && ((i * 53) % 300) < 270 ? 1 : 0.5)} />)}
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: LT.crema, textShadow: extrude(6, "#7a3412") }}>SÓLO ARRIBA</div>
  </div>;
};

// reloj de arena con una raja de canela adentro: TARDA
const Arena: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), f = e(t, a, a + 2.2), k = Math.min(1.1, spr(t, a - 0.2, 1));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${(1 - Math.min(1, k)) * 180}deg)`, textAlign: "center" }}>
    <svg width={220} height={340} viewBox="-110 -170 220 340" style={{ filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <rect x={-100} y={-170} width={200} height={22} rx={8} fill="#8a5a2a" /><rect x={-100} y={148} width={200} height={22} rx={8} fill="#8a5a2a" />
      <path d="M -80 -148 L 80 -148 Q 80 -60 8 0 Q 80 60 80 148 L -80 148 Q -80 60 -8 0 Q -80 -60 -80 -148 Z" fill="rgba(220,240,255,.25)" stroke="#fff" strokeWidth={5} />
      <path d={`M ${-70 * (1 - f)} ${-140 + 130 * f} L ${70 * (1 - f)} ${-140 + 130 * f} L 6 -6 L -6 -6 Z`} fill="#c7883a" />
      <path d={`M -75 145 L 75 145 L ${75 - 60 * f} ${145 - 110 * f} L ${-75 + 60 * f} ${145 - 110 * f} Z`} fill="#c7883a" />
      <rect x={-3} y={-4} width={6} height={150} fill="#c7883a" opacity={f < 1 ? 1 : 0} />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LT.crema, textShadow: extrude(6, "#7a3412"), marginTop: -6 }}>TARDA</div>
  </div>;
};

// tacita de té de canela (ámbar) con vapor que dibuja una raja
const TazaTe: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = Math.min(1.12, spr(t, a - 0.2, 1)), o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={360} height={320} viewBox="-180 -200 360 320" style={{ overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      {[-40, 0, 40].map((xx, i) => <path key={i} d={`M ${xx} -40 C ${xx - 30} -80 ${xx + 30} -110 ${xx} -150 C ${xx - 30} -170 ${xx + 20} -190 ${xx} -200`} stroke="rgba(255,255,255,.7)" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 - 200 * e(t, a + i * 0.15, a + 0.8 + i * 0.15)} />)}
      <path d="M -130 -30 L 130 -30 Q 120 100 0 105 Q -120 100 -130 -30 Z" fill="#c2552d" /><ellipse cy={-30} rx={130} ry={26} fill="#c7883a" />
      <path d="M 128 0 Q 180 0 170 40 Q 160 70 115 60" stroke="#c2552d" strokeWidth={18} fill="none" />
      <rect x={-40} y={-44} width={110} height={14} rx={7} fill="#8a4a22" transform="rotate(-12)" />
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#ffd27a", textShadow: "0 4px 10px #000", marginTop: -10 }}>té de canela</div>
  </div>;
};

// grano vector que se va llenando de ámbar: el sabor ya está ADENTRO
const GranoTe: React.FC<{ t: number; at: number; ad: number; out: number; x: number; y: number }> = ({ t, at: a, ad, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), f = e(t, a, ad + 0.5);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={520} height={300} viewBox="-260 -150 520 300" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <defs><clipPath id="gtc"><ellipse rx={220} ry={105} /></clipPath><linearGradient id="gtg" x1="0" x2="0" y1="1" y2="0"><stop offset={f} stopColor="#c7883a" /><stop offset={f} stopColor="#f5efe0" /></linearGradient></defs>
      <ellipse rx={220} ry={105} fill="url(#gtg)" stroke="#fff" strokeWidth={8} />
      <g clipPath="url(#gtc)">{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-180 + i * 33} cy={105 - 210 * f + Math.sin(t * 4 + i) * 6} r={8} fill="#e0a85a" opacity={f < 1 ? 0.8 : 0} />)}</g>
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: LT.crema, textShadow: extrude(6, "#7a3412"), opacity: e(t, ad, ad + 0.3) }}>EL SABOR, ADENTRO</div>
  </div>;
};

// marco oval antiguo con "la casa de tu abuela" (corazón que late)
const MarcoAbuela: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.4, a) * (1 - e(t, out, out + 0.3)), b = 1 + 0.06 * Math.max(0, Math.sin((t - a) * 7));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-3deg) scale(${Math.min(1, spr(t, a - 0.4, 0.9))})` }}>
    <div style={{ width: 560, height: 380, borderRadius: "50%", border: "26px solid #b8862e", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 0 8px #e8c46a, inset 0 0 60px rgba(90,50,20,.6)", background: "radial-gradient(ellipse,#f6e7c8,#d9b98a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 80, color: LT.rosa, transform: `scale(${b})` }}>♥</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#5a3014", lineHeight: 1.05, textAlign: "center" }}>la casa de<br />tu abuela</div>
    </div>
  </div>;
};

// espiral de capas finas como papel: el corte de la raja delgada
const Espiral: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), d = e(t, a, a + 1.4);
  if (o <= 0.01) return null;
  let p = "M 0 0"; for (let i = 1; i <= 240; i++) { const an = i * 0.13, r = 2 + i * 0.55; p += ` L ${Math.cos(an) * r} ${Math.sin(an) * r}`; }
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={340} height={340} viewBox="-170 -170 340 340" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <circle r={150} fill="#e8b27a" /><path d={p} stroke="#8a4a22" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: LT.crema, textShadow: "0 4px 10px #000" }}>MUCHAS CAPAS</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#ffd27a", textShadow: "0 4px 10px #000", opacity: e(t, a + 1.2, a + 1.5) }}>finas como papel</div>
  </div>;
};

// regla de madera con la raja vector encima: 10 cm · y el salero que suelta su pizca
const Regla10: React.FC<{ t: number; at: number; sal: number; out: number; x: number; y: number }> = ({ t, at: a, sal, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), m = e(t, a, a + 0.8), s = e(t, sal, sal + 0.3);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={640} height={360} viewBox="-20 -200 640 360" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <rect x={0} y={60} width={600} height={70} rx={8} fill="#e8c46a" />{Array.from({ length: 61 }, (_, i) => <rect key={i} x={i * 10} y={60} width={3} height={i % 5 ? 16 : 30} fill="#5a3014" />)}
      {[0, 5, 10].map((n) => <text key={n} x={n * 50 + 4} y={120} fontFamily={FONT} fontWeight={900} fontSize={22} fill="#5a3014">{n}</text>)}
      <rect x={0} y={10} width={500 * m} height={40} rx={20} fill="#9a5a2a" /><rect x={0} y={18} width={500 * m} height={8} fill="#c78a4a" />
      <text x={510} y={44} fontFamily={SERIF} fontWeight={900} fontSize={60} fill={LT.crema} opacity={e(t, a + 0.6, a + 0.9)}>10 cm</text>
      <g opacity={s} transform={`translate(420 -150) rotate(${-30 * s})`}><rect x={-40} y={-60} width={80} height={110} rx={16} fill="#f6f6f2" /><rect x={-40} y={-80} width={80} height={30} rx={10} fill="#b0b5b9" />{[-15, 0, 15].map((xx) => <circle key={xx} cx={xx} cy={-70} r={3} fill="#555" />)}</g>
      {Array.from({ length: 14 }, (_, i) => { const ph = ((t - sal) * 1.2 + i / 14) % 1; return <rect key={i} x={380 + (i * 7) % 30} y={-110 + ph * 160} width={6} height={6} fill="#fff" opacity={t > sal + 0.2 ? 1 - ph : 0} />; })}
      <text x={180} y={-120} fontFamily={HAND} fontWeight={700} fontSize={58} fill="#fff" opacity={s}>+ una pizca de sal</text>
    </svg>
  </div>;
};

// monedas que caen y se apilan: $5
const Monedas: React.FC<{ t: number; at: number; n: number; out: number; x: number; y: number; label: string }> = ({ t, at: a, n, out, x, y, label }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {Array.from({ length: n }, (_, i) => { const ai = a - 0.4 + i * 0.12, k = e(t, ai, ai + 0.25); return <div key={i} style={{ position: "absolute", left: -90, top: -i * 22 - 400 * (1 - k), width: 180, height: 46, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#ffe9a8,#c9921a)", boxShadow: "0 6px 0 #8a6010, 0 12px 20px rgba(0,0,0,.5)", opacity: k > 0 ? 1 : 0 }} />; })}
    <div style={{ position: "absolute", left: 120, top: -n * 22 - 60, fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: "#ffd27a", textShadow: extrude(8, "#6a4206"), opacity: e(t, a + 0.2, a + 0.4), whiteSpace: "nowrap" }}>{label}</div>
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M5: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  if (A.some((_, i) => inA(i))) L.push(<Avatar key="av" t={t} />);

  // 345,6-350,5 (avatar) · SECRETO 3 · LA CANELA, en raja y desde el agua
  L.push(<SecretoTitulo key="st" t={t} at={Math.max(M4_END, T.num)} word={T.canela} n={3} text="LA CANELA" out={A[0][1] - 0.3} y={700} col={LT.rosa} />);
  // 350,5-355,1 · la olla: 2 errores → el polvo cae a la olla
  if (t >= A[0][1] && t < T.disuelve + 0.05) {
    L.push(W("w1", t));
    L.push(<DosErrores key="de" t={t} at={T.dos} a1={T.primero} a2={1e9} out={T.polvo + 0.6} x={1000} y={250} />);
    const p = screenOf(t, [O[0], SY + 0.02, O[2]]);
    L.push(<Tag key="ep" t={t} at={T.polvo + 0.6} x={p.x} y={p.y} dx={-320} dy={-170} text="ERROR 1: EN POLVO" col="#ff9a7a" out={T.disuelve - 0.1} size={58} />);
  }
  // 355,1-361,9 · la olla color lodo, con arenita
  if (t >= T.disuelve + 0.05 && t < A[1][0] + 0.02) {
    L.push(<Whip key="wp" t={t} at={T.disuelve + 0.05} d={0.4} a={W("w1b", Math.min(t, T.disuelve + 0.04))} b={<Clip k="r_canela_polvo_olla" t={t} a={T.disuelve} z={[1.03, 1.12]} />} />);
    L.push(<Swatch key="sw" t={t} at={T.arenita - 0.4} cafe={T.cafe} lodo={T.lodo} out={A[1][0] - 0.15} x={1500} y={480} />);
    L.push(<Escrito key="ar" t={t} at={T.arenita - 0.1} out={A[1][0] - 0.15} x={200} y={860} text="como arenita" size={96} dur={0.6} />);
  }
  // 361,9-365,8 (avatar) · el polvo sólo arriba, al servir
  if (inA(1)) L.push(<Espolvoreo key="ep2" t={t} at={T.arriba} out={A[1][1] - 0.15} x={1470} y={470} />);
  // 365,8-368 · Lety espolvorea el plato: para el olor
  if (t >= A[1][1] && t < A[1][1] + 2.2) { L.push(<Clip key="ce" k="r_lety_espolvorea" t={t} a={A[1][1]} z={[1.04, 1.1]} />); L.push(<Escrito key="ol" t={t} at={T.olor - 0.2} out={A[1][1] + 2.0} x={1200} y={200} text="…y para el olor" size={96} dur={0.6} />); }
  L.push(<Vaho key="v1" t={t} mid={A[1][1] + 2.2} w={0.3} />);
  // 368-377,2 · la olla: la raja al final (error 2) → tarda → mi mamá la echaba al agua desde el principio
  if (t >= A[1][1] + 2.2 && t < A[2][0] + 0.02) {
    L.push(W("w2", t));
    const p = screenOf(t, [O[0] + 0.05, SY + 0.08, O[2]]);
    L.push(<Tag key="e2" t={t} at={T.segundo + 0.3} x={p.x} y={p.y} dx={-330} dy={-180} text="ERROR 2: LA RAJA AL FINAL" col="#ff9a7a" out={T.tarda - 0.1} size={54} />);
    L.push(<Arena key="ae" t={t} at={T.tarda} out={T.echaba - 0.1} x={1500} y={460} />);
    L.push(<Sello key="dp" t={t} at={T.principio} text="DESDE EL PRINCIPIO" x={1000} y={200} out={A[2][0] - 0.1} rot={-4} col={LT.turq} size={84} />);
  }
  // 377,2-382,6 (avatar) · el agua se hace un té de canela
  if (inA(2)) L.push(<TazaTe key="tt" t={t} at={T.te} out={A[2][1] - 0.2} x={1480} y={470} />);
  // 382,6-387,5 · el té de canela en la olla → el sabor ya está adentro del grano
  if (t >= A[2][1] && t < T.abuela - 1.0) { L.push(<Clip key="ct" k="r_te_canela" t={t} a={A[2][1]} z={[1.1, 1.03]} />); L.push(<GranoTe key="gt" t={t} at={T.entra} ad={T.adentro} out={T.abuela - 1.2} x={1300} y={520} />); }
  L.push(<Vaho key="v2" t={t} mid={T.abuela - 1.0} w={0.35} />);
  // 387,5-393,8 · la cocina entera, cálida: la casa de tu abuela → a la mesa: las rajas delgadas
  if (t >= T.abuela - 1.0 && t < A[3][0] + 0.02) {
    L.push(W("w3", t));
    L.push(<MarcoAbuela key="ma" t={t} at={T.abuela} out={T.delgada - 0.5} x={1340} y={420} />);
    const p = screenOf(t, [RAJAS[0], RAJAS[1] + 0.03, RAJAS[2]]);
    L.push(<Tag key="rd" t={t} at={T.delgada} x={p.x} y={p.y} dx={220} dy={-200} text="RAJA DELGADA" col="#ffd27a" out={A[3][0] - 0.1} size={62} />);
  }
  // 393,8-397,7 (avatar) · muchas capas finas, como papel enrollado
  if (inA(3)) L.push(<Espiral key="es" t={t} at={T.capas} out={A[3][1] - 0.2} x={1480} y={470} />);
  // 397,7-408,7 · la delgada que se desmorona vs la gruesa como corteza
  if (t >= A[3][1] && t < A[4][0] + 0.02) {
    L.push(<Clip key="cc" k="r_canela_capas" t={t} a={A[3][1]} z={[1.03, 1.12]} />);
    L.push(<Escrito key="dm" t={t} at={T.desmorona} out={T.gruesa - 0.2} x={200} y={170} text="se desmorona con los dedos" size={80} dur={0.8} />);
    L.push(<Sello key="mx" t={t} at={T.mexico} text="LA DE MÉXICO ✓" x={480} y={360} out={T.gruesa - 0.1} rot={-5} col={LT.turq} size={70} />);
    L.push(<Tag key="gr" t={t} at={T.gruesa} x={1450} y={640} dx={-80} dy={-330} text="LA GRUESA" sub="corteza · más picosa" col="#ff9a7a" out={A[4][0] - 0.1} size={64} />);
  }
  // 408,7-413,5 (avatar) · 10 cm alcanza + una pizca de sal
  if (inA(4)) L.push(<Regla10 key="rg" t={t} at={T.cm10} sal={T.sal} out={A[4][1] - 0.2} x={1400} y={500} />);
  // 413,5-418,4 · la pizca de sal al agua: lo dulce se siente más dulce
  if (t >= A[4][1] && t < T.p5 - 1.3) { L.push(<Clip key="cs" k="r_lety_sal" t={t} a={A[4][1]} z={[1.04, 1.1]} />); L.push(<Escrito key="ds" t={t} at={T.dulce - 0.3} out={T.p5 - 1.5} x={1050} y={200} text="lo dulce, más dulce" size={100} col="#ffd27a" dur={0.7} />); }
  // 418,4-421,1 · el mercado de canela: $5 la raja
  if (t >= T.p5 - 1.3) { L.push(<Whip key="wm" t={t} at={T.p5 - 1.3} d={0.35} a={<Clip k="r_lety_sal" t={t} a={A[4][1]} z={[1.04, 1.1]} />} b={<Clip k="r_mercado_canela" t={t} a={T.p5 - 1.3} z={[1.1, 1.04]} />} />); L.push(<Monedas key="mo" t={t} at={T.p5} n={5} out={M5_END - 0.1} x={700} y={900} label="$5" />); }
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
