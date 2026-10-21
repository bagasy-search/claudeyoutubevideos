// lety01 · TRAMO 3 (203,1-277 s): SECRETO 1 · LA LECHE — bronca recién ordeñada → la grasa de verdad → la NATA en la olla →
// cremoso, no aguado → OJO: nunca cruda → la hierve y sube TRES veces → segura para tu familia → en la ciudad: ENTERA, nunca light
// ni deslactosada → $28-30 el litro → un litro alcanza para 4 platos.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, VASOS, WorldProps, screenOf, setKeys } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Clip, Escrito, Sello, Vaho, Whip } from "./Min1";
import { M2_END } from "./m2";
import { FONT, HAND, LT, SERIF, Tag, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1];
const LECH: [number, number, number] = [PT.mesa[0] + 0.62, 0.8, PT.mesa[2] - 0.28];
const T = {
  num: at("secreto numero 1", 203), leche: at("la leche", 205), bronca: at("bronca", 207), ordenada: at("recien ordenada", 208), vaca: at("vaca", 210),
  caja: at("leche de caja", 213), grasa: at("grasa de verdad", 216), hierves: at("hierves", 217), nata: at("nata", 220), cremoso: at("cremoso", 223), aguado: at("aguado", 226),
  ojo: at("ojo", 228), cruda: at("cruda", 232), hierve: at("siempre se hierve", 233), corral: at("corral", 237), hervor: at("soltara el hervor", 239), subiera: at("subiera", 240),
  bajaba: at("la bajaba", 241), otra: at("otra vez", 242), tres: at("tres veces", 243), segura: at("segura", 248), familia: at("familia", 249),
  ciudad: at("ciudad", 253), apures: at("no te apures", 254), entera: at("leche entera", 255), eh: at("eh", 257), light: at("light", 258), deslac: at("deslactosada", 259),
  justo: at("la grasa es justo", 263), p28: at("28", 266), p30: at("30 pesos", 267), barata: at("mas barata", 272), cuatro: at("cuatro platos", 274),
};
export const M3_END = at("secreto numero dos", 276) - 0.05;
const A = [AV(212.3), AV(228), AV(244.9), AV(263)];
// los tres hervores: la leche sube y la bajan del fuego
const HV = [T.hervor + 0.3, T.bajaba + 0.6, T.tres + 0.2];
const hervorAt = (t: number) => Math.max(0, ...HV.map((h) => Math.exp(-Math.pow((t - h) / 0.42, 2))));

// ---------------- cámara ----------------
setKeys([
  { t: M2_END + 0.1, p: [VASOS[0][0] + 0.55, 1.75, -1.85], l: [VASOS[0][0] + 0.2, 1.55, -2.84], fov: 40 },
  { t: T.bronca - 0.05, p: [VASOS[0][0] + 0.2, 1.65, -2.3], l: [VASOS[0][0], 1.56, -2.84], fov: 34 },
  { t: A[0][1], p: [O[0] + 0.9, SY + 0.95, O[2] + 1.4], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.cremoso - 0.6, p: [O[0] + 0.4, SY + 0.65, O[2] + 0.8], l: [O[0], SY, O[2]], fov: 38, arc: 0.05 },
  { t: A[1][1], p: [O[0] + 0.75, SY + 0.6, O[2] + 1.1], l: [O[0], SY, O[2]], fov: 40 },
  { t: T.corral - 0.25, p: [O[0] + 0.55, SY + 0.45, O[2] + 0.9], l: [O[0], SY + 0.03, O[2]], fov: 38 },
  { t: T.subiera - 0.4, p: [O[0] + 0.85, SY + 0.5, O[2] + 1.35], l: [O[0], SY + 0.05, O[2]], fov: 36 },
  { t: A[2][0], p: [O[0] + 0.7, SY + 0.4, O[2] + 1.15], l: [O[0], SY + 0.04, O[2]], fov: 34, arc: -0.05 },
  { t: A[2][1], p: [LECH[0] + 1.5, 1.65, LECH[2] + 1.9], l: [LECH[0] - 0.2, 0.95, LECH[2]], fov: 44 },
  { t: T.entera - 0.05, p: [LECH[0] + 1.1, 1.45, LECH[2] + 1.4], l: [LECH[0], 0.98, LECH[2]], fov: 36 },
  { t: A[3][1], p: [LECH[0] + 1.3, 1.55, LECH[2] + 1.6], l: [LECH[0], 0.98, LECH[2]], fov: 40 },
  { t: T.cuatro - 0.05, p: [LECH[0] + 1.2, 1.5, LECH[2] + 1.5], l: [LECH[0] - 0.1, 0.95, LECH[2]], fov: 42 },
  { t: M3_END, p: [LECH[0] + 0.95, 1.4, LECH[2] + 1.2], l: [LECH[0] - 0.1, 0.95, LECH[2]], fov: 38 },
]);

const st = (t: number): WorldProps => ({
  t, steam: 1, cream: t < A[0][1] ? 1 : 0.25 + 0.75 * e(t, T.cremoso - 0.5, T.cremoso + 0.6),
  vasos: VASOS.map((_, i) => (i === 0 ? 1 : 0.2)),
  nata: t < A[1][1] ? e(t, T.hierves, T.nata + 0.3) : 0,
  hervor: t > A[1][1] && t < A[2][1] ? hervorAt(t) : 0,
  fire: t > A[1][1] && t < A[2][1] ? 1.3 : 1,
});
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS =================
// título de secreto: medallón de barro que cae rodando con el número + la palabra en piloncillo (vale para los 7)
export const SecretoTitulo: React.FC<{ t: number; at: number; word: number; n: number; text: string; out: number; col?: string; y?: number }> = ({ t, at: a, word, n, text, out, col = LT.turq, y = 330 }) => {
  const k = Math.min(1.1, spr(t, a, 1)), o = e(t, a - 0.05, a + 0.1) * (1 - e(t, out, out + 0.3)), r = (1 - Math.min(1, k)) * -540;
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o }}>
    <div style={{ position: "absolute", left: 230 + (1 - Math.min(1, k)) * -500, top: y, width: 300, height: 300, borderRadius: 150, transform: `rotate(${r}deg)`, background: "radial-gradient(circle at 35% 30%,#e88a5a,#c2552d 55%,#7a2f14)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 0 0 14px rgba(255,241,214,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, color: LT.crema, textShadow: extrude(8, "#5a1f0a"), lineHeight: 1 }}>{n}</div>
    </div>
    <div style={{ position: "absolute", left: 580, top: y + 30, fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 14, color: col, opacity: e(t, a + 0.2, a + 0.4), textShadow: "0 4px 10px rgba(0,0,0,.7)" }}>SECRETO</div>
    <div style={{ position: "absolute", left: 572, top: y + 90, display: "flex" }}>
      {text.split("").map((c, i) => { const q = Math.min(1.12, spr(t, word + i * 0.04, 1.3)); return <div key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: LT.crema, textShadow: extrude(11, "#7a3412"), transform: `translateY(${(1 - Math.min(1, q)) * 120}px) scale(${q})`, opacity: Math.min(1, q * 2), width: c === " " ? 50 : undefined }}>{c}</div>; })}
    </div>
  </div>;
};

// etiqueta de lechería colgada del asa de la cubeta: BRONCA · recién ordeñada
const Lecheria: React.FC<{ t: number; at: number; sub: number; out: number; x: number; y: number }> = ({ t, at: a, sub, out, x, y }) => {
  const sw = Math.sin((t - a) * 3.2) * 9 * Math.exp(-(t - a) * 1.1), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg) scale(${Math.min(1, spr(t, a, 1.2))})` }}>
    <div style={{ width: 4, height: 70, margin: "0 auto", background: "#d8c08a" }} />
    <div style={{ padding: "22px 38px", background: "#f8f0dc", borderRadius: "14px 14px 40px 40px", border: "5px dashed #8a4a22", textAlign: "center", boxShadow: "0 30px 40px rgba(0,0,0,.55)" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#5a3014", lineHeight: 1 }}>BRONCA</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: LT.canela, opacity: e(t, sub, sub + 0.3) }}>recién ordeñada</div>
    </div>
  </div>;
};

// dos vasos de leche lado a lado: la gotita de GRASA sube en la bronca y en la de caja casi no hay
const Grasa: React.FC<{ t: number; at: number; verdad: number; out: number; x: number; y: number }> = ({ t, at: a, verdad, out, x, y }) => {
  const o = e(t, a, a + 0.25) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const g = e(t, a + 0.4, verdad + 0.3);
  const Vaso = ({ fat, lab, dx }: { fat: number; lab: string; dx: number }) => <g transform={`translate(${dx} 0)`}>
    <path d="M -90 -230 L -75 40 Q 0 60 75 40 L 90 -230 Z" fill="rgba(255,255,255,.18)" stroke="#fff" strokeWidth={5} />
    <path d="M -86 -170 L -75 40 Q 0 60 75 40 L 86 -170 Z" fill="#fbfbf7" />
    <path d={`M -86 -170 L -84 ${-170 + 70 * fat} L 84 ${-170 + 70 * fat} L 86 -170 Z`} fill="#f4dc8e" opacity={0.95} />
    {Array.from({ length: Math.round(9 * fat) }, (_, i) => <circle key={i} cx={-60 + (i * 31) % 120} cy={30 - ((t * 60 + i * 47) % 200)} r={7} fill="#f2cf6a" />)}
    <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.crema}>{lab}</text>
  </g>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={560} height={420} viewBox="-280 -260 560 420" style={{ overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <Vaso fat={g} lab="BRONCA" dx={-130} /><Vaso fat={0.12 * g} lab="DE CAJA" dx={130} />
      <text x={-130} y={-260} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={56} fill="#ffd27a" opacity={e(t, verdad, verdad + 0.3)}>grasa de verdad</text>
    </svg>
  </div>;
};

// balanza de dos platillos: CREMOSO pesa, AGUADO sale volando
const Balanza: React.FC<{ t: number; at: number; agu: number; out: number; x: number; y: number }> = ({ t, at: a, agu, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const tilt = 14 * ei(t, a, a + 0.8) + Math.sin((t - a) * 5) * 3 * Math.exp(-(t - a) * 1.5), r = (tilt * Math.PI) / 180;
  const pl = (sx: number) => ({ x: sx * 230 * Math.cos(r), y: sx * 230 * Math.sin(r) });
  const L = pl(-1), R = pl(1);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={700} height={520} viewBox="-350 -220 700 520" style={{ overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <rect x={-12} y={-150} width={24} height={400} fill="#c9a24a" /><rect x={-120} y={240} width={240} height={26} rx={8} fill="#a7802c" />
      <g transform={`translate(0 -150) rotate(${-tilt})`}><rect x={-240} y={-8} width={480} height={16} rx={8} fill="#e0b85a" /></g>
      {[[L, "CREMOSO", "#fff1d6", LT.turq], [R, "AGUADO", "#bcd6e0", "#e23a2a"]].map(([p, lab, c, lc], i) => { const q = p as { x: number; y: number }; return <g key={i} transform={`translate(${q.x} ${-150 - q.y})`}>
        <line x1={-70} y1={0} x2={-80} y2={110} stroke="#c9a24a" strokeWidth={4} /><line x1={70} y1={0} x2={80} y2={110} stroke="#c9a24a" strokeWidth={4} />
        <path d="M -110 110 Q 0 170 110 110 Z" fill="#e0b85a" /><ellipse cx={0} cy={104} rx={70} ry={26} fill={c as string} />
        <text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={lc as string}>{lab as string}</text>
        {i === 1 && t > agu && <g transform="translate(0 110)" opacity={e(t, agu, agu + 0.2)}><path d="M -60 -50 L 60 50 M 60 -50 L -60 50" stroke="#e23a2a" strokeWidth={16} strokeLinecap="round" /></g>}
      </g>; })}
    </svg>
  </div>;
};

// triángulo de ¡OJO! que parpadea + chip "nunca cruda"
const Ojo: React.FC<{ t: number; at: number; cruda: number; out: number; x: number; y: number }> = ({ t, at: a, cruda, out, x, y }) => {
  const k = Math.min(1.15, spr(t, a, 1.3)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3)), bl = 0.85 + 0.15 * Math.sin(t * 9);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={300} height={270} viewBox="-150 -140 300 270" style={{ filter: `drop-shadow(0 0 ${30 * bl}px rgba(255,190,40,.7)) drop-shadow(0 20px 30px rgba(0,0,0,.6))` }}>
      <path d="M 0 -125 L 140 115 L -140 115 Z" fill="#ffc21a" stroke="#2a1608" strokeWidth={12} strokeLinejoin="round" /><text y={90} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={190} fill="#2a1608">!</text>
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: "#ffc21a", textShadow: extrude(8, "#5a2a00"), marginTop: -10 }}>¡OJO!</div>
    <div style={{ display: "inline-block", marginTop: 6, padding: "10px 26px", borderRadius: 40, background: "#e23a2a", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", opacity: e(t, cruda, cruda + 0.2), transform: `scale(${Math.min(1, spr(t, cruda, 1.3))})` }}>NUNCA CRUDA</div>
  </div>;
};

// contador de hervores: tres ollitas que se llenan conforme la leche SUBE
const Hervores: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = HV.filter((h) => t > h).length;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "flex-end", gap: 34 }}>
    {HV.map((h, i) => { const k = Math.min(1.2, spr(t, h, 1.3)), on = t > h; return <div key={i} style={{ textAlign: "center", transform: `scale(${on ? k : 0.85})` }}>
      <svg width={140} height={130} viewBox="-70 -70 140 130">
        <path d="M -55 -20 L -50 50 L 50 50 L 55 -20 Z" fill={on ? "#2a6fc0" : "#5d6670"} /><rect x={-62} y={-30} width={124} height={14} rx={6} fill={on ? "#174d92" : "#4a525a"} />
        {on && [-30, 0, 30].map((xx, j) => <circle key={j} cx={xx} cy={-40 - ((t - h) * 40 + j * 12) % 30} r={13} fill="#fff" opacity={0.95} />)}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: on ? LT.crema : "#9a9a9a" }}>{i + 1}</div>
    </div>; })}
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: LT.crema, textShadow: extrude(7, "#174d92"), marginLeft: 16, opacity: n === 3 ? e(t, HV[2], HV[2] + 0.3) : 0 }}>×3</div>
  </div>;
};

// escudo con palomita: SEGURA PARA TU FAMILIA (casita adentro)
const Escudo: React.FC<{ t: number; at: number; fam: number; out: number; x: number; y: number }> = ({ t, at: a, fam, out, x, y }) => {
  const k = Math.min(1.12, spr(t, a, 1.1)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3)), d = e(t, a + 0.2, a + 0.7);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={260} height={300} viewBox="-130 -150 260 300" style={{ filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <path d="M 0 -140 L 120 -95 L 110 30 Q 90 110 0 145 Q -90 110 -110 30 L -120 -95 Z" fill={LT.turq} stroke="#fff" strokeWidth={10} />
      <path d="M -60 0 L -15 45 L 65 -45" fill="none" stroke="#fff" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={220} strokeDashoffset={220 * (1 - d)} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: LT.crema, textShadow: "0 4px 10px #000", letterSpacing: 3 }}>SEGURA</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#ffd27a", textShadow: "0 4px 10px #000", opacity: e(t, fam, fam + 0.3) }}>para tu familia</div>
  </div>;
};

// cartón de leche vector que se planta: ENTERA (con "¿eh?" que le guiña)
const Carton: React.FC<{ t: number; at: number; eh: number; out: number; x: number; y: number }> = ({ t, at: a, eh, out, x, y }) => {
  const k = Math.min(1.12, spr(t, a, 1)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const bounce = t > eh ? Math.sin((t - eh) * 14) * 6 * Math.exp(-(t - eh) * 3) : 0;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -400}px) rotate(${bounce}deg)` }}>
    <svg width={300} height={440} viewBox="0 0 300 440" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
      <path d="M 40 110 L 150 30 L 260 110 Z" fill="#e8e2d4" /><rect x={130} y={10} width={40} height={30} fill="#d0c8b6" />
      <rect x={40} y={110} width={220} height={320} fill="#fbfaf5" /><rect x={40} y={110} width={220} height={60} fill="#2a6fc0" />
      <path d="M 60 300 Q 150 230 240 300 L 240 400 L 60 400 Z" fill="#7ac46b" /><circle cx={190} cy={250} r={26} fill="#ffd34a" />
      <text x={150} y={152} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff" letterSpacing={4}>LECHE</text>
      <text x={150} y={225} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={68} fill="#174d92">ENTERA</text>
    </svg>
    {t > eh && <div style={{ position: "absolute", left: 270, top: 20, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: "#ffd27a", textShadow: "0 4px 10px #000", transform: `scale(${Math.min(1, spr(t, eh, 1.3))}) rotate(10deg)` }}>¿eh?</div>}
  </div>;
};

// dos tarjetas que se tachan con plumón rojo: LIGHT · DESLACTOSADA
const Tachadas: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a1 - 0.2 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", flexDirection: "column", gap: 30 }}>
    {[["LIGHT", a1], ["DESLACTOSADA", a2]].map(([w, a], i) => { const aa = a as number, k = Math.min(1.1, spr(t, aa - 0.2, 1.2)), d = e(t, aa + 0.2, aa + 0.55); return <div key={i} style={{ position: "relative", opacity: e(t, aa - 0.2, aa), transform: `scale(${k}) rotate(${i ? 3 : -3}deg)`, padding: "18px 36px", background: "#fffaf0", borderRadius: 12, boxShadow: "0 24px 36px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#4a5560", letterSpacing: 3 }}>
      {w as string}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M -4 70 Q 50 20 104 35" stroke="#e23a2a" strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} vectorEffect="non-scaling-stroke" style={{ strokeWidth: 16 }} /></svg>
    </div>; })}
  </div>;
};

// etiqueta de precio de cartón con hilo: $28 → $30 el litro (el número rueda)
const Precio: React.FC<{ t: number; at: number; a2: number; out: number; x: number; y: number; from: number; to: number; sub: string }> = ({ t, at: a, a2, out, x, y, from, to, sub }) => {
  const sw = Math.sin((t - a) * 3) * 8 * Math.exp(-(t - a) * 1.2), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = Math.round(from + (to - from) * e(t, a2, a2 + 0.4));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "20% 0", transform: `rotate(${-6 + sw}deg) scale(${Math.min(1, spr(t, a, 1.2))})` }}>
    <svg width={420} height={250} viewBox="0 0 420 250" style={{ filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <path d="M 70 20 L 400 20 L 400 230 L 70 230 L 10 125 Z" fill="#d9b27a" stroke="#8a5a2a" strokeWidth={6} /><circle cx={60} cy={125} r={14} fill="#5a3a1a" />
      <text x={235} y={140} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={120} fill="#3b2414">${v}</text>
      <text x={235} y={200} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill="#5a3014">{sub}</text>
    </svg>
  </div>;
};

// jarra de 1 litro que se llena hasta la raya + 4 platitos que salen de ella
const Litro: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const f = ei(t, a - 0.2, a + 0.7);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "flex-end", gap: 40 }}>
    <svg width={200} height={300} viewBox="0 0 200 300" style={{ filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <path d="M 30 20 L 170 20 L 160 290 L 40 290 Z" fill="rgba(255,255,255,.2)" stroke="#fff" strokeWidth={6} />
      <path d={`M ${30 + 10 * (1 - f) * 0} ${290 - 250 * f} L ${170 - 10 * f * 0} ${290 - 250 * f} L 160 290 L 40 290 Z`} fill="#fbfbf7" />
      <line x1={140} y1={40} x2={175} y2={40} stroke={LT.rosa} strokeWidth={6} /><text x={180} y={52} fontFamily={FONT} fontWeight={900} fontSize={36} fill={LT.crema}>1 L</text>
    </svg>
    <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>{[0, 1, 2, 3].map((i) => { const k = Math.min(1.15, spr(t, a + 0.5 + i * 0.15, 1.3)); return <svg key={i} width={110} height={80} viewBox="0 0 150 110" style={{ transform: `scale(${k})`, filter: "drop-shadow(0 12px 14px rgba(0,0,0,.5))" }}><path d="M 8 40 Q 75 120 142 40 Z" fill="#c2552d" /><ellipse cx={75} cy={40} rx={67} ry={18} fill="#fff1d6" /></svg>; })}</div>
    <div style={{ position: "absolute", left: 230, top: -90, fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: LT.crema, textShadow: extrude(7, "#7a3412"), whiteSpace: "nowrap", opacity: e(t, a + 0.9, a + 1.2) }}>= 4 PLATOS</div>
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M3: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  if (A.some((_, i) => inA(i))) L.push(<Avatar key="av" t={t} />);

  // 203,1-206,6 · la repisa: se enciende el vasito 1 → SECRETO 1 · LA LECHE
  if (t < T.bronca - 0.05) { L.push(W("w1", t)); L.push(<SecretoTitulo key="st" t={t} at={T.num} word={T.leche} n={1} text="LA LECHE" out={T.bronca - 0.35} />); }
  // 206,6-212,3 · la cubeta recién ordeñada junto a la vaca
  if (t >= T.bronca - 0.05 && t < A[0][0] + 0.02) {
    L.push(<Whip key="wo" t={t} at={T.bronca - 0.05} d={0.4} a={W("w1b", Math.min(t, T.bronca - 0.06))} b={<Clip k="r_ordena" t={t} a={T.bronca} z={[1.03, 1.1]} />} />);
    L.push(<Lecheria key="lc" t={t} at={T.bronca + 0.15} sub={T.ordenada} out={A[0][0] - 0.15} x={1300} y={120} />);
    L.push(<Escrito key="vp" t={t} at={T.vaca} out={A[0][0] - 0.15} x={260} y={860} text="la vaca de mi papá" size={86} dur={0.7} />);
  }
  // 212,3-216,3 (avatar) → 216,3-221,6 (olla): la grasa de verdad
  L.push(<Grasa key="gr" t={t} at={T.caja - 0.3} verdad={T.grasa} out={T.nata - 0.3} x={1480} y={520} />);
  if (t >= A[0][1] && t < T.cremoso - 0.6) {
    L.push(W("w2", t));
    const p = screenOf(t, [O[0] - 0.05, SY + 0.02, O[2] + 0.05]);
    L.push(<Tag key="nt" t={t} at={T.nata} x={p.x} y={p.y} dx={-330} dy={-160} text="LA NATA" sub="capa gruesa" col={LT.crema} out={T.cremoso - 0.8} size={72} />);
  }
  L.push(<Vaho key="v1" t={t} mid={T.cremoso - 0.6} w={0.35} />);
  // 221,6-228 · la nata en la cuchara: cremoso, no aguado
  if (t >= T.cremoso - 0.6 && t < A[1][0] + 0.02) {
    L.push(<Clip key="cn" k="r_nata" t={t} a={T.cremoso - 0.6} z={[1.1, 1.03]} />);
    L.push(<Balanza key="bl" t={t} at={T.cremoso} agu={T.aguado} out={A[1][0] - 0.15} x={1420} y={500} />);
  }
  // 228-233,2 (avatar) · ¡OJO! nunca cruda
  L.push(<Ojo key="oj" t={t} at={T.ojo} cruda={T.cruda} out={A[1][1] + 0.6} x={1460} y={470} />);
  // 233,2-235,7 · la olla: siempre se hierve primero
  if (t >= A[1][1] && t < T.corral - 0.25) { L.push(W("w3", t)); L.push(<Sello key="sh" t={t} at={T.hierve} text="SIEMPRE SE HIERVE" x={960} y={220} out={T.corral - 0.4} rot={-5} col={LT.rosa} size={92} />); }
  // 235,7-239,3 · Lety con la olla que sube
  if (t >= T.corral - 0.25 && t < T.hervor - 0.2) {
    L.push(<Whip key="wh" t={t} at={T.corral - 0.25} d={0.4} a={W("w3b", Math.min(t, T.corral - 0.26))} b={<Clip k="r_lety_hierve" t={t} a={T.corral - 0.25} z={[1.03, 1.1]} />} />);
    L.push(<Escrito key="co" t={t} at={T.corral} out={T.hervor - 0.4} x={1150} y={180} text="en cuanto llegaba del corral" size={78} dur={0.8} />);
  }
  L.push(<Vaho key="v2" t={t} mid={T.hervor - 0.2} w={0.3} />);
  // 239,3-244,9 · la olla 3D: sube, la bajan, otra vez… tres veces
  if (t >= T.hervor - 0.2 && t < A[2][0] + 0.02) L.push(W("w4", t));
  L.push(<Hervores key="hv" t={t} at={T.hervor} out={A[2][0] + 1.5} x={1350} y={190} />);
  // 244,9-251 (avatar) · segura para tu familia
  L.push(<Escudo key="es" t={t} at={T.segura} fam={T.familia} out={A[2][1] - 0.2} x={1480} y={480} />);
  // 251-256 · la lechera en la mesa: en la ciudad, no te apures
  if (t >= A[2][1] && t < T.entera - 0.05) {
    L.push(W("w5", t));
    L.push(<Escrito key="na" t={t} at={T.apures} out={T.entera - 0.2} x={1060} y={230} text="no te apures" size={110} dur={0.6} />);
    L.push(<Tag key="cd" t={t} at={T.ciudad - 0.1} x={960} y={900} dx={0} dy={0} text="¿EN LA CIUDAD?" col="#ffd27a" out={T.entera - 0.3} size={56} />);
  }
  // 256-258 · Lety sirve leche ENTERA
  if (t >= T.entera - 0.05 && t < T.light - 0.15) {
    L.push(<Whip key="we" t={t} at={T.entera - 0.05} d={0.35} a={W("w5b", Math.min(t, T.entera - 0.06))} b={<Clip k="r_lety_leche_entera" t={t} a={T.entera} z={[1.04, 1.1]} />} />);
    L.push(<Carton key="ct" t={t} at={T.entera + 0.15} eh={T.eh} out={T.light - 0.3} x={1660} y={500} />);
  }
  // 258-263 · el refrigerador del súper: nunca light, nunca deslactosada
  if (t >= T.light - 0.15 && t < A[3][0] + 0.02) {
    L.push(<Whip key="wl" t={t} at={T.light - 0.15} d={0.35} dir={-1} a={<Clip k="r_lety_leche_entera" t={t} a={T.entera} z={[1.04, 1.1]} />} b={<Clip k="r_leche_caja" t={t} a={T.light} z={[1.03, 1.09]} />} />);
    L.push(<Tachadas key="tc" t={t} a1={T.light} a2={T.deslac} out={A[3][0] - 0.15} x={960} y={330} />);
  }
  // 263-268 (avatar) · la grasa es lo que buscamos · $28-30 el litro
  if (inA(3)) L.push(<Precio key="pr" t={t} at={T.p28 - 0.1} a2={T.p30} out={A[3][1] + 0.3} x={1400} y={170} from={28} to={30} sub="el litro" />);
  // 268-274,1 · el mercado: la bronca, a veces más barata
  if (t >= A[3][1] && t < T.cuatro - 0.05) {
    L.push(<Clip key="cm" k="r_mercado_leche" t={t} a={A[3][1]} z={[1.1, 1.03]} />);
    L.push(<Sello key="mb" t={t} at={T.barata} text="A VECES MÁS BARATA" x={1180} y={230} out={T.cuatro - 0.2} rot={-4} col={LT.turq} size={74} />);
  }
  L.push(<Vaho key="v3" t={t} mid={T.cuatro - 0.05} w={0.3} />);
  // 274,1-277 · la lechera: un litro alcanza para 4 platos
  if (t >= T.cuatro - 0.05) { L.push(W("w6", t)); L.push(<Litro key="li" t={t} at={T.cuatro} out={M3_END - 0.15} x={1350} y={560} />); }
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
