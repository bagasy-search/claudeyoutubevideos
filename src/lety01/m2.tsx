// lety01 · TRAMO 2 (81,9-204,2 s): el índice de los 7 secretos en la repisa → la tía con coraje → quién es Leti (Michoacán, mamá del
// mole, papá de la barbacoa, ella lo dulce) → el banquito → la cocina de adobe → "mírala, mija" → paso por paso → 4 platos a $9
// → vamos a la cocina: LA OLLA (peltre, fondo grueso vs olla delgadita que se quema) → la cuchara larga hasta el fondo.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, VASOS, WorldProps, screenOf, setKeys, win } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Burbuja, Clip, Escrito, Recado, Sello, Vaho, Whip } from "./Min1";
import { FONT, HAND, LT, LowerThird, SERIF, Tag, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1];
const T = {
  s1: at("la leche que hace", 83), s2: at("por que el arroz", 86), s3: at("la canela que si", 89), s4: at("el fuego y la cuchara", 92), s5: at("el secreto del azucar", 93),
  s6: at("la leche que se guarda", 96), s7: at("y el ultimo", 99), paciencia: at("paciencia", 100), coraje: at("coraje", 105), tia: at("tia", 107), mundo: at("todo el mundo", 109),
  prueba: at("haz la prueba", 110), leticia: at("leticia", 114), leti: at("leti", 116), anos: at("45", 118), chayo: at("chayo", 120), lupe: at("lupe", 121), rancho: at("ranchito", 122), mich: at("michoacan", 122),
  mama: at("mi mama es", 123), mole: at("mole", 126), papa: at("mi papa", 128), barbacoa: at("barbacoa", 129), dulce: at("lo dulce", 132),
  banquito: at("banquito", 136), moviendo: at("moviendo y moviendo", 140), cocina: at("esta es la cocina", 142), adobe: at("adobe", 143), patio: at("patio", 144),
  escribio: at("nunca escribio", 149), ensenio: at("me la enseno", 152), mirala: at("mirala", 157), sola: at("no la dejes sola", 158), paso: at("paso por paso", 162),
  rinde: at("rinde", 168), nueve: at("nueve pesos", 170), vamos: at("vamos a la cocina", 175), laolla: at("la olla", 178), peltre: at("peltre", 181), puntitos: at("puntitos", 182),
  grueso: at("fondo grueso", 184), delgadita: at("delgadita", 190), directo: at("directo al fondo", 192), quema: at("se te quema", 193), gruesa: at("olla gruesa", 195), esaes: at("esa es", 198),
  cuchara: at("una cuchara", 199), hasta: at("hasta el fondo", 201), basta: at("con eso basta", 202),
};
export const M2_END = at("secreto numero 1", 203) - 0.05;
const A = [AV(82), AV(97), AV(113.5), AV(130.4), AV(145), AV(179.4), AV(195.1)];
const VS = [T.s1, T.s2, T.s3, T.s4, T.s5, T.s6, T.s7];

// ---------------- cámara ----------------
setKeys([
  { t: A[0][1], p: [-0.95, 1.95, -0.8], l: [-1.0, 1.5, -2.84], fov: 48 },
  { t: A[1][0], p: [-0.85, 1.85, -1.05], l: [-1.0, 1.5, -2.84], fov: 46, arc: 0.04 },
  { t: A[1][1], p: [O[0] + 0.95, SY + 0.75, O[2] + 1.45], l: [O[0], SY, O[2]], fov: 40 },
  { t: T.coraje - 0.25, p: [O[0] + 0.6, SY + 0.5, O[2] + 0.95], l: [O[0], SY, O[2]], fov: 38 },
  { t: T.prueba - 0.02, p: [VASOS[0][0] + 0.25, 1.75, -2.2], l: [VASOS[0][0], 1.58, -2.84], fov: 34 },
  { t: A[2][0], p: [VASOS[0][0] + 0.18, 1.72, -2.35], l: [VASOS[0][0], 1.58, -2.84], fov: 32 },
  { t: A[2][1], p: [-2.2, 1.6, -0.55], l: [-6, 1.2, -0.8], fov: 50 },
  { t: T.chayo, p: [-4.4, 3.4, 1.4], l: [-6.5, 0.9, -1.5], fov: 52, arc: 0.1 },
  { t: T.mama, p: [-5.2, 7.2, 4.2], l: [-6.2, 0.2, -2.0], fov: 56 },
  { t: T.cocina, p: [2.6, 1.7, 1.8], l: [0.5, 1.1, -2.5], fov: 55 },
  { t: A[4][0], p: [-1.4, 1.7, 2.2], l: [-3.5, 1.1, -0.6], fov: 55, arc: 0.05 },
  { t: A[4][1], p: [-0.2, 1.62, 0.6], l: [-0.6, 0.8, -0.45], fov: 40 },
  { t: T.ensenio, p: [-0.35, 1.42, 0.3], l: [-0.6, 0.8, -0.45], fov: 38 },
  { t: T.paso - 2.2, p: [-2.8, 1.5, 1.2], l: [-1, 0.6, -1.5], fov: 55 },
  { t: T.paso + 1.6, p: [-0.5, 1.5, 0.6], l: [1.2, 0.8, -2.2], fov: 52, arc: 0.05 },
  { t: T.rinde, p: [0.9, 1.5, -0.9], l: [O[0], SY, O[2]], fov: 46 },
  { t: T.vamos - 0.05, p: [-3.0, 1.6, -0.55], l: [0, 1.1, -1.5], fov: 55 },
  { t: T.laolla, p: [0.4, 1.6, -0.8], l: [O[0], SY, O[2]], fov: 46, arc: 0.06 },
  { t: A[5][0], p: [O[0] + 0.42, SY + 0.48, O[2] + 0.92], l: [O[0], SY, O[2]], fov: 38 },
  { t: A[6][1], p: [O[0] + 1.1, SY + 0.85, O[2] + 1.6], l: [O[0], SY - 0.05, O[2]], fov: 40 },
  { t: M2_END, p: [O[0] + 0.85, SY + 0.7, O[2] + 1.3], l: [O[0], SY - 0.05, O[2]], fov: 38 },
]);

const st = (t: number): WorldProps => ({
  t,
  vasos: VASOS.map((_, i) => (t < 100.5 ? win(t, VS[i], VS[i] + 0.35) : 0)),
  stir: t > A[6][1] - 0.1 ? 0.6 * (t - A[6][1]) : undefined,
  steam: 1, fire: t > T.directo ? 1.3 : 1, cream: 1,
});
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS de este tramo =================
// ficha de recetario con pestañas: cada secreto se anota a mano conforme lo dice
const Indice: React.FC<{ t: number; out: number; x: number; y: number }> = ({ t, out, x, y }) => {
  const items = ["La leche", "El arroz aparte", "La canela", "Fuego y cuchara", "El azúcar", "La leche guardada", "La paciencia"];
  const k = spr(t, VS[0] - 0.3, 0.9), o = e(t, VS[0] - 0.3, VS[0] - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
    <div style={{ width: 560, padding: "28px 34px 30px 70px", borderRadius: 14, background: "repeating-linear-gradient(180deg,#fffaf0 0 57px,#c9dbe8 57px 59px)", boxShadow: "0 40px 70px rgba(0,0,0,.55)", transform: `rotateX(${(1 - Math.min(1, k)) * 60}deg) rotate(-2deg)`, transformOrigin: "50% 100%", position: "relative" }}>
      <div style={{ position: "absolute", left: 48, top: 0, bottom: 0, width: 3, background: "#e2457a" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: LT.canela, marginBottom: 6, letterSpacing: 2 }}>LOS 7 DE MI MAMÁ</div>
      {items.map((it, i) => {
        const w = e(t, VS[i] + 0.05, VS[i] + 0.75);
        return <div key={i} style={{ height: 59, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: w > 0.05 ? LT.turq : "#d8d2c4", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${w > 0.05 ? Math.min(1.15, spr(t, VS[i], 1.2)) : 1})` }}>{i + 1}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LT.tinta, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)` }}>{it}</div>
        </div>;
      })}
      {/* pestañas de colores a la derecha */}
      {items.map((_, i) => <div key={"p" + i} style={{ position: "absolute", right: -26, top: 90 + i * 59, width: 28, height: 46, borderRadius: "0 8px 8px 0", background: [LT.rosa, "#f2a31b", LT.canela, "#ff6a1a", "#7b4bd1", "#3c8be6", LT.turq][i], opacity: t > VS[i] ? 1 : 0.25 }} />)}
    </div>
  </div>;
};

// etiqueta que cuelga de cada vasito de la repisa (proyectada desde el 3D)
const VasoEtiqueta: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const labs = ["LECHE", "ARROZ", "CANELA", "FUEGO", "AZÚCAR", "CHORRITO", "PACIENCIA"];
  return <>{VASOS.map((q, i) => {
    const a = VS[i], o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.25));
    if (o <= 0.01) return null;
    const p = screenOf(t, [q[0], q[1] - 0.06, q[2] + 0.06]), sw = Math.sin((t - a) * 3) * 6 * Math.exp(-(t - a) * 1.2);
    return <div key={i} style={{ position: "absolute", left: p.x, top: p.y + 30, opacity: o, transformOrigin: "50% 0", transform: `translateX(-50%) rotate(${sw}deg) scale(${Math.min(1, spr(t, a, 1.2))})` }}>
      <div style={{ width: 2, height: 46, margin: "0 auto", background: "#5a3a22" }} />
      <div style={{ padding: "8px 14px", background: "#fffaf0", border: `3px solid ${LT.canela}`, borderRadius: 8, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: LT.tinta, letterSpacing: 1, whiteSpace: "nowrap", boxShadow: "0 10px 18px rgba(0,0,0,.45)" }}>{labs[i]}</div>
    </div>;
  })}</>;
};

// medidor del CORAJE de la tía: la aguja sube hasta "¡HIRVIENDO!"
const Coraje: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = ei(t, a, a + 1.6) + 0.04 * Math.sin(t * 20) * e(t, a + 1.4, a + 1.6), ang = -90 + 180 * Math.min(1.02, v);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * Math.min(1, spr(t, a - 0.3))})` }}>
    <svg width={520} height={340} viewBox="-260 -270 520 340" style={{ overflow: "visible", filter: "drop-shadow(0 24px 40px rgba(0,0,0,.6))" }}>
      <path d="M -220 0 A 220 220 0 0 1 220 0 L 170 0 A 170 170 0 0 0 -170 0 Z" fill="#fffaf0" />
      {[0, 1, 2, 3, 4].map((i) => { const a0 = Math.PI + (i / 5) * Math.PI, a1 = Math.PI + ((i + 1) / 5) * Math.PI; return <path key={i} d={`M ${Math.cos(a0) * 215} ${Math.sin(a0) * 215} A 215 215 0 0 1 ${Math.cos(a1) * 215} ${Math.sin(a1) * 215} L ${Math.cos(a1) * 178} ${Math.sin(a1) * 178} A 178 178 0 0 0 ${Math.cos(a0) * 178} ${Math.sin(a0) * 178} Z`} fill={["#7ac46b", "#c9d24a", "#f2a31b", "#f2652b", "#d6262b"][i]} />; })}
      <g transform={`rotate(${ang})`}><path d="M -10 0 L 0 -190 L 10 0 Z" fill={LT.tinta} /><circle r={22} fill={LT.tinta} /></g>
      <text x={0} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.crema} style={{ filter: "drop-shadow(0 3px 6px #000)" }}>CORAJE DE LA TÍA</text>
      {v > 0.95 && <text x={150} y={-200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#ff4a2a" transform={`rotate(12 150 -200)`} style={{ filter: "drop-shadow(0 3px 6px #000)" }}>¡HIRVIENDO!</text>}
    </svg>
  </div>;
};

// alfiler gigante clavado en el patio (proyectado del 3D): un ranchito · MICHOACÁN
const Alfiler: React.FC<{ t: number; at: number; mich: number; out: number; x: number; y: number }> = ({ t, at: a, mich, out, x, y }) => {
  const k = Math.min(1.15, spr(t, a, 1.1)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <div style={{ position: "absolute", left: -70, top: -10, width: 140, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.35)", transform: `scale(${Math.min(1, k)})` }} />
    <svg width={140} height={200} viewBox="-70 -200 140 200" style={{ position: "absolute", left: -70, top: -200 - (1 - Math.min(1, k)) * 400, overflow: "visible", filter: "drop-shadow(0 18px 20px rgba(0,0,0,.5))" }}>
      <path d="M 0 0 C -60 -70 -60 -150 0 -150 C 60 -150 60 -70 0 0 Z" fill={LT.rosa} stroke="#fff" strokeWidth={8} /><circle cy={-100} r={22} fill="#fff" />
    </svg>
    <div style={{ position: "absolute", left: 80, top: -230, whiteSpace: "nowrap", opacity: e(t, a + 0.2, a + 0.5) }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: LT.crema, textShadow: "0 4px 10px #000" }}>un ranchito</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: 8, color: "#ffd27a", textShadow: extrude(5, "#5a2a10"), opacity: e(t, mich, mich + 0.3) }}>MICHOACÁN</div>
    </div>
  </div>;
};

// foto instantánea clavada con chinche: quién es quién en la familia
const Instant: React.FC<{ t: number; at: number; out: number; x: number; y: number; top: string; sub: string; rot?: number }> = ({ t, at: a, out, x, y, top, sub, rot = -5 }) => {
  const k = spr(t, a, 1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -260}px) rotate(${rot + (1 - Math.min(1, k)) * 20}deg)` }}>
    <div style={{ padding: "18px 26px 16px", background: "#fffaf0", borderRadius: 6, boxShadow: "0 30px 50px rgba(0,0,0,.55)", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: -14, width: 28, height: 28, marginLeft: -14, borderRadius: 14, background: LT.rosa, boxShadow: "0 4px 6px rgba(0,0,0,.4)" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: LT.tinta, letterSpacing: 3 }}>{top}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: LT.canela }}>{sub}</div>
    </div>
  </div>;
};

// "LO DULCE": letras de piloncillo con chispitas de colores que caen
const Dulce: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a - 0.05 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1000, top: 260, opacity: o, display: "flex", gap: 4 }}>
    {"LO DULCE".split("").map((c, i) => { const k = Math.min(1.12, spr(t, a + i * 0.05, 1.2)); return <div key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 118, color: "#c8772f", textShadow: extrude(10, "#6b3410"), transform: `translateY(${(1 - Math.min(1, k)) * -300}px) rotate(${(i % 2 ? 4 : -4) * k}deg)`, width: c === " " ? 40 : undefined }}>{c}</div>; })}
    {Array.from({ length: 34 }, (_, i) => { const ph = (t - a) * (0.6 + (i % 5) * 0.12); return <div key={"c" + i} style={{ position: "absolute", left: (i * 53) % 640, top: -60 + ph * 420 + ((i * 37) % 80), width: 10, height: 26, borderRadius: 5, background: ["#e2457a", "#22b3a6", "#f2a31b", "#7b4bd1", "#fff1d6"][i % 5], transform: `rotate(${i * 47 + t * 90}deg)`, opacity: ph < 1.2 ? 1 : 0 }} />; })}
  </div>;
};

// cuaderno de recetas que se abre… y está en BLANCO
const CuadernoVacio: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const op = ei(t, a, a + 0.9), o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1600, transform: "translate(-50%,-50%)" }}>
    <div style={{ width: 760, height: 470, position: "relative", transformStyle: "preserve-3d", transform: "rotateX(38deg) rotateZ(-6deg)" }}>
      <div style={{ position: "absolute", left: 380, top: 0, width: 380, height: 470, background: "repeating-linear-gradient(180deg,#fffaf0 0 38px,#cfdde8 38px 40px)", boxShadow: "0 40px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 380, top: 0, width: 380, height: 470, transformOrigin: "0 50%", transform: `rotateY(${-178 * op}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#2a6fc0,#174d92)", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#fffaf0" }}>Recetas</div>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg,#fffaf0 0 38px,#cfdde8 38px 40px)", transform: "rotateY(180deg)", backfaceVisibility: "hidden" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 470, top: 180, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#9aa7b0", opacity: e(t, a + 1.0, a + 1.4), transform: "rotate(-8deg)" }}>(en blanco)</div>
  </div>;
};

// huellitas numeradas que avanzan por abajo: PASO POR PASO
const Pasos: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a - 0.6 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o }}>
    {Array.from({ length: 7 }, (_, i) => {
      const ai = a - 0.6 + i * 0.32, k = Math.min(1.15, spr(t, ai, 1.3)); if (t < ai) return null;
      const x = 230 + i * 240, y = 900 - (i % 2) * 70;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k}) rotate(${i % 2 ? 12 : -12}deg)` }}>
        <svg width={110} height={150} viewBox="0 0 110 150"><ellipse cx={55} cy={95} rx={40} ry={52} fill={LT.crema} /><circle cx={30} cy={30} r={11} fill={LT.crema} /><circle cx={52} cy={20} r={12} fill={LT.crema} /><circle cx={74} cy={26} r={11} fill={LT.crema} /></svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: LT.canela }}>{i + 1}</div>
      </div>;
    })}
    <div style={{ position: "absolute", left: 960, top: 170, transform: `translateX(-50%) scale(${Math.min(1, spr(t, a, 1))})`, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: LT.crema, textShadow: extrude(9, "#7a3412"), opacity: e(t, a, a + 0.1) }}>PASO POR PASO</div>
  </div>;
};

// 4 platitos que se ponen en fila + el precio que cae como moneda
const Platos: React.FC<{ t: number; at: number; price: number; out: number; x: number; y: number }> = ({ t, at: a, price, out, x, y }) => {
  const o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const c = Math.min(1.2, spr(t, price, 1.1));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <div style={{ display: "flex", gap: 22 }}>{[0, 1, 2, 3].map((i) => { const k = Math.min(1.12, spr(t, a + i * 0.18, 1.2)); return <svg key={i} width={150} height={110} viewBox="0 0 150 110" style={{ transform: `translateY(${(1 - Math.min(1, k)) * 80}px) scale(${k})`, filter: "drop-shadow(0 14px 18px rgba(0,0,0,.5))" }}><path d="M 8 40 Q 75 120 142 40 Z" fill="#c2552d" /><ellipse cx={75} cy={40} rx={67} ry={18} fill="#fff1d6" /><ellipse cx={75} cy={38} rx={40} ry={9} fill="#c98a4a" opacity={0.6} /></svg>; })}</div>
    {t > price && <div style={{ position: "absolute", left: "50%", top: -150, transform: `translateX(-50%) translateY(${(1 - Math.min(1, c)) * -200}px) rotateY(${(1 - Math.min(1, c)) * 720}deg)`, width: 190, height: 190, borderRadius: 95, background: "radial-gradient(circle at 35% 30%,#ffe9a8,#d9a22a 60%,#9a6a10)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 0 0 8px rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: "#6a4206", lineHeight: 1 }}>$9</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#6a4206", letterSpacing: 2 }}>EL PLATO</div>
    </div>}
  </div>;
};

// corte de dos fondos: olla delgadita (el calor pasa directo y quema) vs fondo grueso (reparte)
const Fondos: React.FC<{ t: number; at: number; quema: number; grueso: number; out: number; x: number; y: number; sc?: number }> = ({ t, at: a, quema, grueso, out, x, y, sc = 1.45 }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = e(t, quema - 0.3, quema + 0.2), g = e(t, grueso, grueso + 0.4), fl = 0.85 + 0.15 * Math.sin(t * 14);
  const Olla = ({ thick, hot, ok, ox }: { thick: number; hot: number; ok: number; ox: number }) => <g transform={`translate(${ox} 0)`}>
    <path d={`M -150 -140 L -150 0 L 150 0 L 150 -140`} fill="none" stroke="#2a6fc0" strokeWidth={10} />
    <rect x={-150} y={0} width={300} height={thick} fill="#174d92" />
    <rect x={-140} y={-110} width={280} height={110} fill="#fff1d6" opacity={0.9} />
    <rect x={-140} y={-16} width={280} height={16} fill={hot > 0.5 ? "#3a1a08" : "#f0dcb0"} opacity={0.4 + 0.6 * hot} />
    {[-90, -30, 30, 90].map((xx) => <path key={xx} d={`M ${xx} ${thick + 120} C ${xx - 18} ${thick + 80} ${xx + 18} ${thick + 60} ${xx} ${thick + 30 * (1 - ok) + 10}`} stroke={hot > 0.5 ? "#ff3a0a" : "#ffb03a"} strokeWidth={8} fill="none" markerEnd="url(#fl)" opacity={0.9} />)}
    {[-110, -55, 0, 55, 110].map((xx, i) => <path key={i} d={`M ${xx} ${thick + 165} C ${xx - 20} ${thick + 130} ${xx + 10} ${thick + 110} ${xx} ${thick + 95}`} fill="none" stroke="#ff7a1a" strokeWidth={22 * fl} strokeLinecap="round" opacity={0.75} />)}
  </g>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc})`, padding: "26px 10px 10px", background: "rgba(40,22,12,.72)", borderRadius: 26 }}>
    <svg width={900} height={520} viewBox="-450 -220 900 520" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <defs><marker id="fl" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ff5a1a" /></marker></defs>
      <Olla thick={8} hot={q} ok={0} ox={-215} />
      <g opacity={g}><Olla thick={44} hot={0} ok={1} ox={215} /></g>
      <text x={-215} y={-170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.crema}>DELGADITA</text>
      <text x={215} y={-170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.crema} opacity={g}>FONDO GRUESO</text>
      {q > 0.3 && <text x={-215} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#e23a2a" transform={`rotate(-8 -215 -50)`} opacity={q}>SE QUEMA</text>}
      {g > 0.5 && <text x={215} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={LT.turq} opacity={g}>✓</text>}
    </svg>
  </div>;
};

// regla de costurera junto a la cuchara: tiene que llegar HASTA EL FONDO
const Regla: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const top = screenOf(t, [O[0] + 0.25, SY + 0.35, O[2]]), bot = screenOf(t, [O[0] + 0.2, PT.olla[1] + 0.01, O[2]]);
  const h = Math.max(60, bot.y - top.y), d = e(t, a, a + 0.8);
  return <div style={{ position: "absolute", left: top.x + 90, top: top.y, opacity: o }}>
    <div style={{ width: 46, height: h * d, background: "repeating-linear-gradient(180deg,#f7d04a 0 18px,#e8bd2a 18px 20px)", borderRadius: 6, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 60, top: h * d - 40, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: LT.crema, textShadow: extrude(5, "#3a2414"), opacity: e(t, a + 0.6, a + 0.9) }}>HASTA EL FONDO ▾</div>
  </div>;
};

// muestra de peltre: botón redondo con el azul de puntitos y su etiqueta
const Peltre: React.FC<{ t: number; at: number; grueso: number; out: number; x: number; y: number }> = ({ t, at: a, grueso, out, x, y }) => {
  const k = Math.min(1.12, spr(t, a, 1)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const dots = Array.from({ length: 70 }, (_, i) => `radial-gradient(circle 5px at ${(i * 67) % 260}px ${(i * 41) % 260}px, #fff 90%, transparent)`).join(",");
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${-10 + 10 * Math.min(1, k)}deg)`, display: "flex", alignItems: "center", gap: 26 }}>
    <div style={{ width: 260, height: 260, borderRadius: 130, background: `${dots}, linear-gradient(160deg,#2a6fc0,#174d92)`, boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 0 10px #0e2f63" }} />
    <div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: LT.crema, textShadow: extrude(8, "#174d92") }}>PELTRE</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#bfe3ff", letterSpacing: 3, opacity: e(t, grueso, grueso + 0.3) }}>+ FONDO GRUESO</div>
    </div>
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M2: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  const av = A.some((_, i) => inA(i));
  if (av) L.push(<Avatar key="av" t={t} />);

  // 85,8-96,7 · la repisa: cada vasito se enciende con su secreto y le cuelga su etiqueta
  if (t >= A[0][1] && t < A[1][0] + 0.02) { L.push(W("w1", t)); L.push(<VasoEtiqueta key="ve" t={t} out={A[1][0] - 0.2} />); }
  L.push(<Indice key="ix" t={t} out={T.paciencia + 0.6} x={1250} y={150} />);
  // 100,3-103,4 · la olla tranquila: la paciencia
  if (t >= A[1][1] && t < T.coraje - 0.25) { L.push(W("w2", t)); L.push(<Sello key="pc" t={t} at={T.paciencia} text="PACIENCIA" x={1380} y={300} out={T.coraje - 0.5} rot={-6} col={LT.turq} size={96} />); }
  // 103,4-111,3 · el azúcar al principio… y el coraje de la tía
  if (t >= T.coraje - 0.25 && t < T.prueba - 0.02) {
    L.push(<Whip key="wc" t={t} at={T.coraje - 0.25} d={0.4} a={W("w2b", Math.min(t, T.coraje - 0.26))} b={<Clip k="r_azucar_principio" t={t} a={T.coraje - 0.25} z={[1.04, 1.1]} />} />);
    L.push(<Coraje key="cj" t={t} at={T.tia} out={T.prueba - 0.3} x={1420} y={420} />);
    L.push(<Escrito key="cm" t={t} at={T.mundo - 0.3} out={T.prueba - 0.3} x={560} y={860} text="…como todo el mundo" size={86} col={LT.crema} dur={0.8} />);
  }
  // 111,3-113,5 · el vasito de la repisa: tú haz la prueba
  if (t >= T.prueba - 0.02 && t < A[2][0] + 0.02) { L.push(W("w3", t)); L.push(<Burbuja key="hp" t={t} at={T.prueba + 0.1} out={A[2][0] - 0.1} x={1250} y={300} text="¿y qué tal te quedó?" tail="l" />); }
  L.push(<Vaho key="v1" t={t} mid={T.prueba} w={0.3} />);
  // 113,5-118,2 · avatar: Leticia… Leti
  if (inA(2)) L.push(<LowerThird key="lt" t={t} at={T.leticia - 0.2} out={A[2][1] - 0.3} name="LETI" l2="LETICIA · 45 AÑOS · LA HIJA DE CHAYO" l2at={T.leti} />);
  // 118,2-124,4 · por la puerta, el patio desde arriba: un ranchito de Michoacán
  if (t >= A[2][1] && t < T.mama) { L.push(W("w4", t)); const pin = screenOf(t, [PT.patio[0], 0.05, PT.patio[2]]); L.push(<Alfiler key="mp" t={t} at={T.rancho} mich={T.mich} out={T.mama - 0.3} x={pin.x} y={pin.y} />); }
  // 124,4-128,6 · mi mamá: leña, caldos y mole
  if (t >= T.mama && t < T.papa - 0.02) {
    L.push(<Whip key="wm" t={t} at={T.mama} d={0.4} a={W("w4b", Math.min(t, T.mama - 0.01))} b={<Clip k="r_mole" t={t} a={T.mama} z={[1.04, 1.1]} />} />);
    L.push(<Instant key="im" t={t} at={T.mama + 0.3} out={T.papa - 0.2} x={1450} y={300} top="MI MAMÁ" sub="caldos y mole" rot={-6} />);
  }
  // 128,6-130,4 · mi papá: la barbacoa
  if (t >= T.papa - 0.02 && t < A[3][0] + 0.02) {
    L.push(<Whip key="wp" t={t} at={T.papa - 0.02} d={0.4} dir={-1} a={<Clip k="r_mole" t={t} a={T.mama} z={[1.04, 1.1]} />} b={<Clip k="r_barbacoa" t={t} a={T.papa} z={[1.03, 1.09]} />} />);
    L.push(<Instant key="ip" t={t} at={T.barbacoa - 0.2} out={A[3][0] - 0.1} x={470} y={320} top="MI PAPÁ" sub="la barbacoa" rot={5} />);
  }
  // 130,4-134,2 · avatar: a mí me tocó LO DULCE
  if (inA(3)) L.push(<Dulce key="dl" t={t} at={T.dulce} out={A[3][1] - 0.2} />);
  // 134,2-142,4 · la niña en el banquito, moviendo y moviendo
  if (t >= A[3][1] && t < T.cocina) {
    L.push(<Clip key="cb" k="r_banquito" t={t} a={A[3][1]} z={[1.1, 1.02]} />);
    L.push(<Recado key="rb" t={t} at={T.banquito} out={T.moviendo - 0.2} x={1480} y={290} lines={["Yo, en el", "banquito"]} sign="— Leti, de chiquita" w={460} rot={4} />);
    L.push(<Escrito key="em" t={t} at={T.moviendo} out={T.cocina - 0.3} x={1300} y={860} text="moviendo y moviendo…" size={96} />);
  }
  L.push(<Vaho key="v2" t={t} mid={T.cocina} w={0.35} />);
  // 142,4-145 · la cocina de adobe que da al patio (la cámara la recorre)
  if (t >= T.cocina && t < A[4][0] + 0.02) {
    L.push(W("w5", t));
    const pa = screenOf(t, [-3.5, 1.9, -0.55]), fo = screenOf(t, [O[0], 1.7, O[2]]);
    L.push(<Tag key="ta" t={t} at={T.adobe} x={fo.x} y={fo.y} dx={-200} dy={-120} text="LA COCINA DE ADOBE" col={LT.crema} out={A[4][0] - 0.1} size={50} />);
    L.push(<Tag key="tp" t={t} at={T.patio} x={pa.x} y={pa.y} dx={160} dy={-110} text="EL PATIO" col="#ffd27a" out={A[4][0] - 0.1} size={50} />);
  }
  // 149,5-152,7 · el cuaderno de recetas… en blanco: nunca la escribió
  if (t >= A[4][1] && t < T.ensenio) { L.push(W("w6", t)); L.push(<CuadernoVacio key="cv" t={t} at={T.escribio - 0.1} out={T.ensenio - 0.25} x={1000} y={560} />); }
  // 152,7-160,3 · me la enseñó junto al fogón: ¡mírala, mija! ¡no la dejes sola!
  if (t >= T.ensenio && t < T.paso - 2.2) {
    L.push(<Whip key="we" t={t} at={T.ensenio} d={0.4} a={W("w6b", Math.min(t, T.ensenio - 0.01))} b={<Clip k="r_lety_ensena" t={t} a={T.ensenio} z={[1.03, 1.1]} />} />);
    L.push(<Escrito key="mi" t={t} at={T.mirala} out={T.paso - 2.5} x={1000} y={200} text="¡Mírala, mija!" size={110} dur={0.6} />);
    L.push(<Escrito key="ns" t={t} at={T.sola} out={T.paso - 2.5} x={980} y={350} text="¡No la dejes sola!" size={96} col="#ffd27a" dur={0.7} />);
  }
  L.push(<Vaho key="v3" t={t} mid={T.paso - 2.2} w={0.35} />);
  // 160,3-168,4 · de la puerta al fogón: paso por paso
  if (t >= T.paso - 2.2 && t < T.rinde) { L.push(W("w7", t)); L.push(<Pasos key="ps" t={t} at={T.paso} out={T.rinde - 0.3} />); }
  // 168,4-175 · 4 platos a nueve pesos
  if (t >= T.rinde && t < T.vamos - 0.05) {
    L.push(<Whip key="wr" t={t} at={T.rinde} d={0.4} a={W("w7b", Math.min(t, T.rinde - 0.01))} b={<Clip k="r_lety_platos" t={t} a={T.rinde} z={[1.04, 1.1]} />} />);
    L.push(<Platos key="pl" t={t} at={T.rinde + 0.3} price={T.nueve} out={T.vamos - 0.4} x={1320} y={780} />);
  }
  L.push(<Vaho key="v4" t={t} mid={T.vamos - 0.05} w={0.35} />);
  // 175-179,4 · ahora sí, a la cocina: la cámara entra por la puerta hasta la olla
  if (t >= T.vamos - 0.05 && t < A[5][0] + 0.02) { L.push(W("w8", t)); const ol = screenOf(t, [O[0], SY + 0.1, O[2]]); L.push(<Tag key="to" t={t} at={T.laolla} x={ol.x} y={ol.y} dx={-260} dy={-150} text="LA OLLA" col={LT.crema} out={A[5][0] - 0.1} size={64} />); }
  // 179,4-184,3 · avatar: olla de peltre, azul con puntitos, fondo grueso
  L.push(<Peltre key="pe" t={t} at={T.peltre} grueso={T.grueso} out={A[5][1] + 0.4} x={1380} y={330} />);
  // 184,3-195,1 · la olla delgadita: el fuego pega directo al fondo y se quema
  if (t >= A[5][1] && t < A[6][0] + 0.02) L.push(<Clip key="cd" k="r_olla_delgada" t={t} a={A[5][1]} z={[1.04, 1.12]} />);
  L.push(<Fondos key="fd" t={t} at={T.delgadita - 0.6} quema={T.quema} grueso={T.gruesa} out={A[6][1] - 0.3} x={1300 + 190 * e(t, A[6][0] - 0.3, A[6][0] + 0.2)} y={560 - 120 * e(t, A[6][0] - 0.3, A[6][0] + 0.2)} sc={1.45 - 0.5 * e(t, A[6][0] - 0.3, A[6][0] + 0.2)} />);
  // 195,1-199,2 · avatar: la gruesa, esa es
  if (inA(6)) L.push(<Sello key="ee" t={t} at={T.esaes} text="¡ESA ES!" x={560} y={250} out={A[6][1] - 0.2} rot={-8} col={LT.turq} size={100} />);
  // 199,2-204,2 · la cuchara de palo larga hasta el fondo · con eso basta
  if (t >= A[6][1]) {
    L.push(W("w9", t));
    L.push(<Regla key="rg" t={t} at={T.hasta} out={M2_END - 0.2} />);
    L.push(<Sello key="cb" t={t} at={T.basta} text="CON ESO BASTA" x={560} y={300} out={M2_END - 0.1} rot={-6} col={LT.rosa} size={84} />);
  }
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
