// fbm28 · componentes únicos del tema piedra hecha en casa (losa que parece cuarzo, yeso que parece mármol, estuco de pared).
// Mismo kit que g1-g4 (Stage + resorte con peso + cámara curva); cada uno dibuja su objeto con materiales hechos en código.
import React from "react";
import { Stage, Tag, Head, Shadow, Sheen, phys, cl, eio, TX, DIM, AMB, RED, GRN, HAND, type H } from "./hkit";

type HP = { t: number; h: H };
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

// la losa blanca: base cálida con puntitos de piedra cortada; `gloss` = cuánto refleja (0 mate · 1 cuarzo)
export const SlabFace: React.FC<{ w: number; h: number; gloss: number; veins?: number; seed?: number; grey?: number }> = ({ w, h, gloss, veins = 0, seed = 3, grey = 0 }) => {
  const base = grey > 0 ? `linear-gradient(135deg, rgb(${200 - 60 * grey},${198 - 60 * grey},${192 - 58 * grey}), rgb(${226 - 70 * grey},${223 - 70 * grey},${215 - 66 * grey}))` : "linear-gradient(135deg,#ecebe6,#f8f7f3 45%,#e4e2dc)";
  return <div style={{ position: "relative", width: w, height: h, borderRadius: 10, overflow: "hidden", background: base, boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 -8px 0 rgba(0,0,0,.08)" }}>
    {Array.from({ length: 160 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, seed) * w, top: rnd(i, seed + 1) * h, width: 2 + rnd(i, seed + 2) * 4, height: 2 + rnd(i, seed + 2) * 4, borderRadius: "50%", background: i % 3 ? "rgba(255,255,255,.9)" : "rgba(150,150,145,.55)", boxShadow: gloss > 0.4 && i % 3 ? `0 0 ${4 * gloss}px rgba(255,255,255,${gloss})` : undefined }} />)}
    {veins > 0 && <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      {[0, 1, 2].map((v) => {
        const y0 = h * (0.2 + 0.3 * v), d = `M ${-20} ${y0} C ${w * 0.3} ${y0 - 70 + 40 * v}, ${w * 0.55} ${y0 + 90}, ${w + 20} ${y0 + 30 - 20 * v}`;
        return <path key={v} d={d} fill="none" stroke={`rgba(110,112,116,${0.55 - v * 0.12})`} strokeWidth={6 - v * 1.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(veins * 1.6 - v * 0.3)} style={{ filter: "blur(1.4px)" }} />;
      })}
    </svg>}
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,${0.65 * gloss}) 46%, transparent 58%)`, mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,${0.35 * gloss}), transparent 70%)` }} />
  </div>;
};

// ---------- V1 · LAS VETAS: la cuchara deja hilos grises sobre la mezcla blanca; al darla vuelta aparecen en la cara ----------
export const HVeins: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const draw = eio(tt, 0.8, 3.0), flip = eio(tt, 3.4, 4.4), W = 820, Hh = 470;
  const sx = 560 + draw * 800, sy = 330 + 120 * Math.sin(draw * 3.2);
  return <>
    <Head tt={tt} kick={h.kick ?? "EL TRUCO DE LAS VETAS"} title={h.title ?? "HILOS GRISES, Y NO TOCAR"} />
    <Shadow x={960} y={830} w={900} />
    <div style={{ position: "absolute", left: 960 - W / 2, top: 330, perspective: 1600 }}>
      <div style={{ transform: `rotateX(${46 - 46 * flip}deg) rotateY(${flip * 180}deg)`, transformStyle: "preserve-3d", width: W, height: Hh }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}><SlabFace w={W} h={Hh} gloss={0.1} veins={draw} seed={5} /></div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}><SlabFace w={W} h={Hh} gloss={0.7} veins={1} seed={8} /></div>
      </div>
    </div>
    {draw > 0 && draw < 1 && <div style={{ position: "absolute", left: sx - 40, top: sy - 170, width: 80, height: 220, transform: "rotate(-28deg)" }}>
      <div style={{ width: 70, height: 46, borderRadius: "50%", background: "linear-gradient(180deg,#c9ccd0,#7b7f86)", boxShadow: "0 8px 18px rgba(0,0,0,.5)" }} />
      <div style={{ width: 14, height: 180, margin: "-6px auto 0", background: "linear-gradient(90deg,#9aa0a8,#e6e8ec,#8a9098)", borderRadius: 6 }} />
    </div>}
    <Tag tt={tt} at={4.6} x={960} y={900} txt={h.lab ?? "LA VETA QUE IMPORTA ES LA DE ABAJO"} col={AMB} size={46} />
  </>;
}}</Stage>;

// ---------- V2 · UNA DE UNA: dos latas iguales vuelcan en el mismo balde, y se marca la proporción ----------
export const HRatio: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = (x: number, d: number, lab: string, col: string) => {
    const tip = eio(tt, d, d + 0.8), flow = cl((tt - d - 0.6) * 1.4) * (1 - cl((tt - d - 2.2) * 2));
    return <div key={lab} style={{ position: "absolute", left: x, top: 300 }}>
      <div style={{ transform: `rotate(${(x < 960 ? 1 : -1) * 105 * tip}deg)`, transformOrigin: x < 960 ? "100% 10%" : "0% 10%", width: 200, height: 250 }}>
        <div style={{ width: 200, height: 250, borderRadius: 14, background: "linear-gradient(90deg,#7c828a,#dfe3e8 40%,#8b9098)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
          {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ height: 3, marginTop: i ? 44 : 20, background: "rgba(0,0,0,.18)" }} />)}
        </div>
      </div>
      {flow > 0 && <div style={{ position: "absolute", left: x < 960 ? 230 : -60, top: 40, width: 30, height: 320 * flow, background: `linear-gradient(180deg, ${col}, ${col}aa)`, borderRadius: 14, filter: "blur(1px)" }} />}
      <Tag tt={tt} at={d + 0.2} x={x < 960 ? 100 : 100} y={-110} txt={lab} col={TX} size={40} />
    </div>;
  };
  const fill = eio(tt, 1.6, 4.2), big = cl(phys(tt, 4.4, 6, 0.45));
  return <>
    {L(420, 0.6, h.a ?? "1 CEMENTO BLANCO", "#f2f1ec")}
    {L(1300, 1.0, h.b ?? "1 MARMOLINA", "#ffffff")}
    <div style={{ position: "absolute", left: 960 - 230, top: 640, width: 460, height: 300, clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", background: "linear-gradient(90deg,#1e3d73,#3c6ab8 45%,#1b3566)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 260 * fill, background: "linear-gradient(180deg,#fbfaf6,#e7e5df)" }} />
      <Sheen p={0.25} o={0.2} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${big})`, fontWeight: 900, fontSize: 190, color: TX, textShadow: "0 14px 40px rgba(0,0,0,.7)" }}>{h.r ?? "1 : 1"}</div>
    <Tag tt={tt} at={5.0} x={960} y={985} txt={h.lab ?? "MISMA LATA, MISMA MEDIDA"} col={AMB} size={40} />
  </>;
}}</Stage>;

// ---------- V3 · LA SECUENCIA DE LIJAS: cada grano que pasa, la losa refleja más (120 → 400 → 800 → 1500) ----------
export const HGrit: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const G: string[] = h.g ?? ["120", "400", "800", "1500"], step = 0.9, d0 = 0.7;
  const k = cl((tt - d0) / (step * G.length)), cur = Math.min(G.length - 1, Math.floor(k * G.length));
  const bx = 960 + 260 * Math.sin((tt - d0) * 5.2);
  return <>
    <Head tt={tt} kick={h.kick ?? "LIJADO AL AGUA"} title={h.title ?? "SIN SALTEAR NINGÚN GRANO"} />
    <Shadow x={960} y={860} w={1000} />
    <div style={{ position: "absolute", left: 960 - 480, top: 420, transform: "perspective(1600px) rotateX(52deg)", transformOrigin: "50% 100%" }}><SlabFace w={960} h={420} gloss={0.05 + 0.9 * k} seed={11} /></div>
    {tt > d0 && k < 1 && <div style={{ position: "absolute", left: bx - 120, top: 560 + 10 * Math.sin(tt * 11), width: 240, height: 90, borderRadius: 12, background: "linear-gradient(180deg,#f4a640,#c8741a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", fontWeight: 900, fontSize: 40, color: "#3a1f05", textAlign: "center", lineHeight: "90px" }}>{G[cur]}</div>}
    {Array.from({ length: 16 }, (_, i) => <div key={"w" + i} style={{ position: "absolute", left: 520 + (i * 61) % 880, top: 820 + ((tt * 90 + i * 37) % 140), width: 10, height: 18, borderRadius: "50%", background: "rgba(240,240,235,.55)", opacity: k < 1 ? 0.7 : 0 }} />)}
    <div style={{ position: "absolute", left: 170, top: 300, display: "flex", flexDirection: "column", gap: 18 }}>
      {G.map((g, i) => { const on = cl(phys(tt, d0 + i * step, 7, 0.5)); return <div key={g} style={{ opacity: 0.25 + 0.75 * on, transform: `translateX(${(1 - on) * -60}px)`, fontWeight: 900, fontSize: 54, color: i <= cur ? TX : DIM }}>{i <= cur && tt > d0 + i * step + 0.6 ? "✓ " : "· "}{g}</div>; })}
    </div>
    <Tag tt={tt} at={d0 + step * G.length + 0.2} x={1520} y={330} txt={h.lab ?? "BRILLO SATINADO"} col={AMB} size={48} />
  </>;
}}</Stage>;

// ---------- V4 · LA PRUEBA DEL FRASCO: se agita, decanta, y el agua dice si la arena sirve ----------
export const HJartest: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const shake = tt < 1.6 ? Math.sin(tt * 34) * 22 * cl(tt * 3) * (1 - cl((tt - 1.2) * 3)) : 0, settle = eio(tt, 1.6, 4.4);
  const J = (x: number, turbid: boolean, lab: string, ok: boolean) => {
    const cloud = turbid ? 0.85 - 0.3 * settle : 0.85 - 0.8 * settle;
    return <div key={lab} style={{ position: "absolute", left: x - 150, top: 280, transform: `rotate(${shake * 0.08}deg) translateX(${shake}px)` }}>
      <div style={{ width: 300, height: 40, margin: "0 auto", borderRadius: 8, background: "linear-gradient(180deg,#c9b98f,#8f7d52)" }} />
      <div style={{ position: "relative", width: 300, height: 460, borderRadius: "30px 30px 40px 40px", border: "6px solid rgba(220,235,240,.6)", background: "rgba(200,225,235,.12)", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 0, top: 40, width: "100%", height: 420, background: turbid ? `rgba(160,120,70,${cloud})` : `rgba(225,220,205,${cloud * 0.8})` }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 40 + 110 * settle, background: turbid ? "linear-gradient(180deg,#8a6a3e,#6e5230)" : "linear-gradient(180deg,#f3f1ea,#d9d5ca)" }} />
        {turbid && <div style={{ position: "absolute", left: 0, bottom: 40 + 110 * settle, width: "100%", height: 34 * settle, background: "#5b4128" }} />}
        <div style={{ position: "absolute", left: 34, top: 50, width: 24, height: 360, borderRadius: 12, background: "rgba(255,255,255,.22)" }} />
      </div>
      <Tag tt={tt} at={4.6} x={150} y={560} txt={lab} col={ok ? GRN : RED} size={44} />
    </div>;
  };
  return <>
    <Head tt={tt} kick={h.kick ?? "ANTES DE COMPRAR LA BOLSA"} title={h.title ?? "LA PRUEBA DEL FRASCO"} />
    {J(620, true, h.a ?? "TURBIA · NO SIRVE", false)}
    {J(1300, false, h.b ?? "CLARA · SIRVE", true)}
    <Shadow x={960} y={790} w={1200} />
  </>;
}}</Stage>;

// ---------- V5 · LA PRUEBA DEL PUÑO: se aprieta la mezcla, abre la mano y la bola decide ----------
export const HFist: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const R = [{ t: h.a ?? "SE DESARMA · FALTA AGUA", c: RED, crumble: 1, wet: 0 }, { t: h.b ?? "QUEDA ARMADA · PERFECTA", c: GRN, crumble: 0, wet: 0 }, { t: h.c ?? "CHORREA · TE PASASTE", c: RED, crumble: 0, wet: 1 }];
  return <>
    <Head tt={tt} kick={h.kick ?? "CUÁNTA AGUA"} title={h.title ?? "LA PRUEBA DEL PUÑO"} />
    {R.map((r, i) => {
      const d = 0.8 + i * 1.1, s = cl(phys(tt, d, 6, 0.5)), open = eio(tt, d + 0.4, d + 1.0), x = 420 + i * 540;
      return <div key={i} style={{ position: "absolute", left: x - 160, top: 330, width: 320, transform: `translateY(${(1 - s) * -200}px)`, opacity: s }}>
        <Shadow x={160} y={360} w={300} />
        <div style={{ position: "absolute", left: 60, top: 140, width: 200, height: 170, borderRadius: "48% 52% 46% 54%", background: r.wet ? "radial-gradient(circle at 40% 35%,#f4f3ef,#bdbbb4)" : "radial-gradient(circle at 40% 35%,#ecebe5,#c6c3bb)", boxShadow: r.wet ? "0 0 0 6px rgba(180,210,230,.4)" : undefined, transform: `scale(${1 - 0.35 * r.crumble * open})` }} />
        {r.crumble > 0 && Array.from({ length: 12 }, (_, j) => <div key={j} style={{ position: "absolute", left: 80 + rnd(j, 4) * 160 + (rnd(j, 5) - 0.5) * 220 * open, top: 200 + open * 120 * rnd(j, 6), width: 30, height: 24, borderRadius: "40%", background: "#d2cfc7", opacity: open }} />)}
        {r.wet > 0 && Array.from({ length: 4 }, (_, j) => <div key={j} style={{ position: "absolute", left: 100 + j * 40, top: 300 + ((tt * 140 + j * 50) % 120) * open, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(170,205,230,.8)", opacity: open }} />)}
        <div style={{ position: "absolute", left: 20, top: 40 - 60 * open, width: 280, height: 170, borderRadius: "50% 50% 40% 40%", background: "linear-gradient(180deg,#c08a62,#9a6a48)", opacity: 0, boxShadow: "0 20px 30px rgba(0,0,0,.4)" }}>{[0, 1, 2, 3].map((n) => <div key={n} style={{ position: "absolute", left: 22 + n * 62, top: -18, width: 58, height: 58, borderRadius: "50%", background: "radial-gradient(circle at 45% 35%,#d39d74,#9a6a48)" }} />)}<div style={{ position: "absolute", left: -30, top: 60, width: 70, height: 50, borderRadius: 25, background: "#b07c56", transform: "rotate(-20deg)" }} /></div>
        <Tag tt={tt} at={d + 1.1} x={160} y={440} txt={r.t} col={r.c} size={34} />
      </div>;
    })}
  </>;
}}</Stage>;

// ---------- V6 · LA CUENTA: el ticket del cuarzo instalado se arruga y queda el de la losa casera ----------
export const HReceipt: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const crush = eio(tt, 2.6, 3.4), s2 = cl(phys(tt, 3.2, 6, 0.45));
  const rows: { t: string; v: string }[] = h.rows ?? [{ t: "CEMENTO BLANCO 8 KG", v: "4" }, { t: "MARMOLINA 8 KG", v: "3" }, { t: "SELLADOR + CERA", v: "3" }, { t: "PIGMENTO", v: "1" }];
  const tot = rows.reduce((a, r) => a + +r.v, 0);
  return <>
    <div style={{ position: "absolute", left: 300, top: 220, width: 460, padding: "40px 36px", background: "#f6f3ea", color: "#2a2620", transformOrigin: "50% 50%", transform: `scale(${1 - 0.75 * crush}) rotate(${crush * -40}deg) translateY(${crush * 300}px)`, borderRadius: 6 * (1 + crush * 20), boxShadow: "0 40px 80px rgba(0,0,0,.6)", opacity: 1 - cl((crush - 0.8) * 5) }}>
      <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 3 }}>{h.qa ?? "MESADA DE CUARZO"}</div>
      <div style={{ fontWeight: 700, fontSize: 26, color: "#6b665c", marginTop: 6 }}>{h.qb ?? "INSTALADA"}</div>
      <div style={{ fontWeight: 900, fontSize: 120, marginTop: 30, color: "#b3261e" }}>${h.q ?? "800"}</div>
    </div>
    <div style={{ position: "absolute", left: 1060, top: 170, width: 560, padding: "40px 40px 30px", background: "#fffdf6", color: "#2a2620", transform: `translateY(${(1 - s2) * -400}px) rotate(${1.5 - s2 * 1.5}deg)`, boxShadow: "0 50px 90px rgba(0,0,0,.65)", fontFamily: HAND }}>
      <div style={{ fontSize: 50, fontWeight: 700 }}>{h.ta ?? "la losa del taller"}</div>
      {rows.map((r, i) => { const o = cl((tt - 3.6 - i * 0.35) * 4); return <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 40, marginTop: 10, opacity: o }}><span>{r.t.toLowerCase()}</span><span>${r.v}</span></div>; })}
      <div style={{ borderTop: "3px solid #2a2620", marginTop: 16, paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 64, fontWeight: 700, opacity: cl((tt - 3.8 - rows.length * 0.35) * 4) }}><span>total</span><span style={{ color: "#1f7a3a" }}>${tot}</span></div>
    </div>
    <Tag tt={tt} at={5.4} x={1340} y={960} txt={h.lab ?? "CON UNA QUE NO COMPRÁS, LA RECUPERÁS"} col={AMB} size={40} />
  </>;
}}</Stage>;

// ---------- V7 · LA SEMANA HÚMEDA: siete gotas caen sobre la losa tapada, una por día; sin agua, se raja ----------
export const HCure: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter">{(tt) => {
  const n = +(h.v ?? 7), day = Math.min(n, Math.floor(cl((tt - 0.8) / 3.6) * n + 0.0001 + (tt > 4.4 ? n : 0)));
  const crack = eio(tt, 0.6, 2.2);
  return <>
    <Head tt={tt} kick={h.kick ?? "EL CURADO"} title={h.title ?? `${n} DÍAS HÚMEDA, A LA SOMBRA`} />
    <div style={{ position: "absolute", left: 220, top: 380 }}>
      <SlabFace w={560} h={320} gloss={0} grey={0.15} seed={21} />
      <svg width={560} height={320} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${280 + 60 * Math.cos(i)} ${160 + 40 * Math.sin(i)} l ${120 * Math.cos(i * 0.9)} ${80 * Math.sin(i * 1.3)} l ${50 * Math.sin(i)} ${40 * Math.cos(i)}`} stroke="#4a4844" strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />)}</svg>
      <Tag tt={tt} at={2.2} x={280} y={380} txt={h.a ?? "AL SOL · SE RAJA"} col={RED} size={38} />
    </div>
    <div style={{ position: "absolute", left: 1120, top: 380 }}>
      <SlabFace w={560} h={320} gloss={0.15} seed={22} />
      <div style={{ position: "absolute", inset: -14, borderRadius: 16, background: "linear-gradient(135deg,rgba(220,235,245,.35),rgba(255,255,255,.12) 50%,rgba(200,220,235,.3))", border: "2px solid rgba(255,255,255,.35)" }} />
      {Array.from({ length: n }, (_, i) => { const dt = 0.8 + i * (3.6 / n), y = eio(tt, dt, dt + 0.35); return <div key={i} style={{ position: "absolute", left: 60 + i * 70, top: -160 + 300 * y, width: 22, height: 32, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(150,200,235,.9)", opacity: tt > dt && y < 1 ? 1 : 0 }} />; })}
      <div style={{ position: "absolute", left: 600, top: 90, fontWeight: 900, fontSize: 120, color: TX }}>{Math.max(1, day)}<span style={{ fontSize: 40, color: DIM }}> /{n}</span></div>
      <Tag tt={tt} at={4.6} x={280} y={380} txt={h.b ?? "TAPADA · EL DOBLE DE DURA"} col={GRN} size={38} />
    </div>
  </>;
}}</Stage>;
