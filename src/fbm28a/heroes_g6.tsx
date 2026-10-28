// fbm28 · componentes propios del tema piedra casera que reemplazan los del cerrajero (desmolde, balanza, golpe con nudillo).
import React from "react";
import { Stage, Tag, Head, Shadow, Sheen, phys, cl, eio, eIn, TX, DIM, AMB, GRN, MARK, type H } from "./hkit";
import { SlabFace } from "./heroes_g5";

type HP = { t: number; h: H };

// ---------- D1 · EL DESMOLDE: las cuatro paredes de melamina se sueltan de a una con peso y aparece la losa ----------
export const HDemold: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const W = 760, Hh = 430, X = 960 - W / 2, Y = 330, at = h.popAt ?? 1.4;
  const wall = (i: number) => eIn(tt, at + i * 0.32, at + i * 0.32 + 0.7);
  const pop = tt > at + 0.05 ? cl(phys(tt, at, 7, 0.35)) : 0;
  const walls = [
    { l: X - 40, t: Y - 40, w: W + 80, hh: 40, dx: 0, dy: -1, r: -14 },
    { l: X + W, t: Y - 40, w: 40, hh: Hh + 80, dx: 1, dy: 0, r: 10 },
    { l: X - 40, t: Y + Hh, w: W + 80, hh: 40, dx: 0, dy: 1, r: 8 },
    { l: X - 40, t: Y - 40, w: 40, hh: Hh + 80, dx: -1, dy: 0, r: -12 },
  ];
  return <>
    <Shadow x={960} y={Y + Hh + 90} w={W + 120} />
    <div style={{ position: "absolute", left: X, top: Y }}><SlabFace w={W} h={Hh} gloss={0.05 + 0.25 * cl(tt - at - 1.4)} seed={31} /></div>
    {walls.map((w, i) => { const q = wall(i); return <div key={i} style={{ position: "absolute", left: w.l, top: w.t, width: w.w, height: w.hh, borderRadius: 4,
      background: "linear-gradient(135deg,#f3f1ec,#d6d2c8 60%,#bdb8ad)", boxShadow: "0 18px 30px rgba(0,0,0,.5)",
      transform: `translate(${w.dx * 520 * q}px, ${w.dy * 420 * q + 260 * q * q}px) rotate(${w.r * 3 * q}deg)`, opacity: 1 - cl(q * 1.4 - 0.4) }}>
      {[0.12, 0.88].map((p) => <div key={p} style={{ position: "absolute", left: w.w > 60 ? `${p * 100}%` : 12, top: w.w > 60 ? 12 : `${p * 100}%`, width: 14, height: 14, borderRadius: "50%", background: "radial-gradient(circle,#9a9a9a,#444)" }} />)}
    </div>; })}
    <div style={{ position: "absolute", left: 1500, top: 260, transform: `translate(-50%,-50%) scale(${pop}) rotate(-8deg)`, fontFamily: MARK, fontSize: 130, color: AMB, textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{h.txt ?? "¡TUC!"}</div>
    {h.lab && <Tag tt={tt} at={at + 1.6} x={960} y={900} txt={h.lab} col={TX} size={44} />}
  </>;
}}</Stage>;

// ---------- D2 · LA BALANZA: el balde baja con peso sobre la balanza y el display corre hasta los kilos ----------
export const HScale: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const v = +h.v, drop = cl(phys(tt, 0.5, 6, 0.45)), run = eio(tt, 1.0, 2.8), squash = 1 - 0.04 * Math.sin(Math.min(1, cl((tt - 0.9) * 3)) * Math.PI);
  const val = (v * run).toFixed(h.dec ?? 1).replace(".", ",");
  return <>
    <Shadow x={960} y={940} w={900} />
    <div style={{ position: "absolute", left: 960 - 420, top: 760, width: 840, height: 150, borderRadius: 28, background: "linear-gradient(180deg,#e9e7e2,#bdbab3)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 -10px 0 rgba(0,0,0,.15)", transform: `scaleY(${squash})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 250, top: 34, width: 340, height: 84, borderRadius: 12, background: "#0f1a12", boxShadow: "inset 0 0 20px rgba(0,0,0,.8)", textAlign: "center", lineHeight: "84px", fontFamily: "monospace", fontWeight: 900, fontSize: 70, color: "#8dff9e", textShadow: "0 0 14px rgba(120,255,140,.7)" }}>{val}<span style={{ fontSize: 34 }}> {h.u ?? "KG"}</span></div>
      <Sheen p={(tt * 0.3) % 1} r={28} o={0.25} />
    </div>
    <div style={{ position: "absolute", left: 960 - 190, top: 340 + (1 - drop) * -520, width: 380, height: 420, transform: `rotate(${(1 - drop) * 8}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 380, height: 390, clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", background: "linear-gradient(90deg,#c9c7c1,#f4f3ef 40%,#b3b0a8)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "radial-gradient(ellipse at 50% 40%,#fbfaf7,#d9d6cf)" }} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 150, textAlign: "center", fontWeight: 900, fontSize: 46, color: "#4b4a46", letterSpacing: 2 }}>{h.bag ?? "CEMENTO BLANCO"}</div>
      </div>
      <div style={{ position: "absolute", left: 30, top: -40, width: 320, height: 90, borderRadius: "50% 50% 0 0", border: "8px solid #8c8c8c", borderBottom: "none" }} />
    </div>
    {h.lab && <Tag tt={tt} at={3.0} x={960} y={1000} txt={h.lab} col={DIM} size={40} />}
    {h.title && <Head tt={tt} kick={h.kick ?? "LA MEDIDA"} title={h.title} />}
  </>;
}}</Stage>;

// ---------- D3 · EL GOLPE CON EL NUDILLO: dos losas, el nudillo golpea cada una y las dos ondas salen iguales ----------
export const HKnock: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const slabs = [{ x: 520, lab: h.a ?? "CUARZO · $800", g: 0.8, d: 0.9 }, { x: 1400, lab: h.b ?? "CASERA", g: 0.7, d: 2.1 }];
  return <>
    {slabs.map((s, i) => {
      const k = cl(phys(tt, 0.2 + i * 0.25, 6, 0.5)), hitT = tt - s.d, tap = hitT > 0 && hitT < 0.5 ? Math.sin(hitT / 0.5 * Math.PI) : 0;
      return <div key={i} style={{ position: "absolute", left: s.x - 300, top: 470, scale: "1.25", transform: `translateY(${(1 - k) * 300}px)`, opacity: k }}>
        <Shadow x={300} y={300} w={640} />
        <div style={{ transform: "perspective(1400px) rotateX(48deg)", transformOrigin: "50% 100%" }}><SlabFace w={600} h={300} gloss={s.g} veins={i ? 0.5 : 0} seed={40 + i} /></div>
        {hitT > 0 && [0, 1, 2].map((j) => { const q = ((hitT - j * 0.22) * 0.8) % 1.4; return q > 0 ? <div key={j} style={{ position: "absolute", left: 300 - q * 260, top: 170 - q * 110, width: q * 520, height: q * 220, borderRadius: "50%", border: `${5 - q * 2.5}px solid rgba(255,205,130,${0.7 * (1 - q / 1.4)})` }} /> : null; })}
        <div style={{ position: "absolute", left: 250, top: 40 - 90 * (1 - tap) - (hitT < 0 ? 60 : 0), width: 110, height: 90, borderRadius: "40% 40% 30% 30%", background: "linear-gradient(180deg,#c99470,#9c6c4c)", boxShadow: "0 14px 24px rgba(0,0,0,.5)", opacity: hitT > -0.6 && hitT < 1.4 ? 1 : 0 }}>
          {[0, 1, 2, 3].map((n) => <div key={n} style={{ position: "absolute", left: 8 + n * 25, bottom: -6, width: 22, height: 22, borderRadius: "50%", background: "#b07d5a" }} />)}
        </div>
        <Tag tt={tt} at={0.6 + i * 0.3} x={300} y={360} txt={s.lab} col={i ? GRN : DIM} size={40} />
      </div>;
    })}
    <div style={{ position: "absolute", left: 960, top: 230, transform: `translate(-50%,-50%) scale(${cl(phys(tt, 1.0, 7, 0.35))}) rotate(-5deg)`, fontFamily: MARK, fontSize: 120, color: AMB, textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{h.txt ?? "TOC · TOC"}</div>
    {h.lab && <Tag tt={tt} at={3.2} x={960} y={1010} txt={h.lab} col={TX} size={48} />}
  </>;
}}</Stage>;

// ---------- D4 · EL SOL LE SACA EL AGUA: el sol baja con peso, las gotas suben y la cara se llena de rajaduras de tela de araña ----------
export const HSuncrack: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 40%, #3a2a16, #0b0805 75%)">{(tt) => {
  const sun = cl(phys(tt, 0.3, 5, 0.5)), dry = eio(tt, 1.2, 3.2), cr = eio(tt, 2.6, 4.8), W = 820, Hh = 380, X = 960 - W / 2, Y = 470;
  const net = Array.from({ length: 26 }, (_, i) => { const x0 = (i * 137) % W, y0 = (i * 89) % Hh; return `M ${x0} ${y0} l ${60 + (i * 31) % 90} ${-30 + (i * 47) % 70} l ${-20 + (i * 13) % 60} ${30 + (i * 29) % 60} l ${50 - (i * 17) % 90} ${10}`; });
  return <>
    <div style={{ position: "absolute", left: 1500, top: 190 - (1 - sun) * 300, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,#fff6c8,#ffc23a 55%,#ff8a1a)", boxShadow: `0 0 ${120 + 40 * Math.sin(tt * 2)}px rgba(255,180,60,.8)` }} />
    {Array.from({ length: 12 }, (_, i) => <div key={"r" + i} style={{ position: "absolute", left: 1610, top: 300, width: 6, height: 260, background: "linear-gradient(180deg,rgba(255,210,120,.5),transparent)", transformOrigin: "3px 0", transform: `rotate(${i * 30 + tt * 8}deg) translateY(130px)`, opacity: sun }} />)}
    <Shadow x={960} y={Y + Hh + 70} w={W + 100} />
    <div style={{ position: "absolute", left: X, top: Y, transform: "perspective(1600px) rotateX(38deg)", transformOrigin: "50% 100%" }}>
      <SlabFace w={W} h={Hh} gloss={0.05} grey={0.12 * (1 - dry)} seed={52} />
      <svg width={W} height={Hh} style={{ position: "absolute", left: 0, top: 0 }}>{net.map((d, i) => <path key={i} d={d} stroke="rgba(70,66,60,.85)" strokeWidth={2.2} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(cr * 1.5 - (i % 6) * 0.08)} />)}</svg>
    </div>
    {Array.from({ length: 10 }, (_, i) => { const q = cl(dry * 1.3 - (i % 5) * 0.07); return <div key={"g" + i} style={{ position: "absolute", left: X + 60 + i * 76, top: Y + 80 - q * 360, width: 20, height: 28, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(150,200,235,.9)", opacity: q > 0 && q < 1 ? 1 - q : 0, transform: `scale(${1 - 0.5 * q})` }} />; })}
    <Tag tt={tt} at={1.4} x={520} y={260} txt={h.a ?? "AL SOL, PARA SECAR RÁPIDO"} col={DIM} size={40} />
    <Tag tt={tt} at={4.6} x={960} y={990} txt={h.lab ?? "EL SOL LE SACÓ EL AGUA ANTES DE TIEMPO"} col={AMB} size={46} />
  </>;
}}</Stage>;

const Hand: React.FC<{ x: number; y: number; flip?: boolean; o?: number }> = ({ x, y, flip, o = 1 }) => <div style={{ position: "absolute", left: x - 90, top: y - 60, width: 180, height: 120, opacity: o, transform: flip ? "scaleX(-1)" : undefined }}>
  <div style={{ position: "absolute", left: 0, top: 30, width: 150, height: 80, borderRadius: "40% 50% 45% 40%", background: "linear-gradient(180deg,#d6a07a,#a8714f)", boxShadow: "0 16px 26px rgba(0,0,0,.45)" }} />
  {[0, 1, 2, 3].map((n) => <div key={n} style={{ position: "absolute", left: 100 + n * 6, top: 10 + n * 22, width: 80, height: 22, borderRadius: 11, background: "#c38d66" }} />)}
</div>;

// ---------- D5 · CON LAS DOS MANOS: de una punta sola la losa se flexiona y se parte; con dos manos abiertas sube entera ----------
export const HTwohands: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = eio(tt, 0.8, 2.0), br = eio(tt, 2.0, 2.4), R = eio(tt, 2.8, 4.0), W = 600, Hh = 70;
  return <>
    <div style={{ position: "absolute", left: 160, top: 560 }}>
      <Shadow x={W / 2} y={150} w={W} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W / 2, height: Hh, transformOrigin: "0% 50%", transform: `rotate(${-6 * L}deg)` }}><div style={{ width: W / 2, height: Hh, background: "linear-gradient(180deg,#f2f0ea,#cfccc4)", borderRadius: "6px 0 0 6px" }} /></div>
      <div style={{ position: "absolute", left: W / 2, top: -Math.sin(L * 0.5) * 60, width: W / 2, height: Hh, transformOrigin: "100% 50%", transform: `rotate(${-14 * L + 40 * br}deg) translate(${br * 30}px, ${br * 120}px)` }}><div style={{ width: W / 2, height: Hh, background: "linear-gradient(180deg,#f2f0ea,#cfccc4)", borderRadius: "0 6px 6px 0" }} /></div>
      {br > 0 && <svg width={60} height={120} style={{ position: "absolute", left: W / 2 - 30, top: -30 }}><path d="M30 0 L18 40 L38 60 L22 120" stroke="#3b3934" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${br} 1`} /></svg>}
      <Hand x={W - 20} y={-30 - 140 * L + 200 * br} o={1 - br} />
      <Tag tt={tt} at={2.3} x={W / 2} y={260} txt={h.a ?? "DE UNA PUNTA: SE PARTE"} col="#ff5a4a" size={40} />
    </div>
    <div style={{ position: "absolute", left: 1160, top: 560 - 160 * R }}>
      <Shadow x={W / 2} y={150 + 160 * R} w={W * (1 - 0.3 * R)} />
      <div style={{ width: W, height: Hh, background: "linear-gradient(180deg,#f2f0ea,#cfccc4)", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
      <Hand x={110} y={110} o={cl(R * 3)} /><Hand x={W - 110} y={110} flip o={cl(R * 3)} />
      <Tag tt={tt} at={4.0} x={W / 2} y={260 + 160 * R} txt={h.b ?? "DOS MANOS ABIERTAS: ENTERA"} col={GRN} size={40} />
    </div>
    {h.lab && <Tag tt={tt} at={0.5} x={960} y={200} txt={h.lab} col={AMB} size={50} />}
  </>;
}}</Stage>;

// ---------- D6 · LUZ RASANTE: la linterna se acuesta contra la losa y los poros aparecen como sombras ----------
export const HRaking: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 60%, #121212, #030303 75%)">{(tt) => {
  const tilt = eio(tt, 0.8, 2.4), W = 1100, Hh = 460, X = 960 - W / 2, Y = 430, pores = cl((tilt - 0.4) * 1.8);
  const ang = 60 - 52 * tilt;
  return <>
    <div style={{ position: "absolute", left: X, top: Y, transform: "perspective(1600px) rotateX(50deg)", transformOrigin: "50% 100%" }}>
      <SlabFace w={W} h={Hh} gloss={0} seed={61} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(255,240,210,${0.15 + 0.5 * tilt}), rgba(0,0,0,${0.2 + 0.45 * tilt}) 85%)` }} />
      {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 157) % W, top: (i * 71) % Hh, width: 10 + (i % 4) * 4, height: 8 + (i % 3) * 3, borderRadius: "50%", background: "rgba(40,36,30,.85)", boxShadow: `${8 * tilt}px 0 ${4}px rgba(0,0,0,.6), -3px 0 2px rgba(255,250,235,.6)`, opacity: pores * (0.5 + 0.5 * ((i * 7) % 3) / 2) }} />)}
    </div>
    <div style={{ position: "absolute", left: 150, top: 520, transformOrigin: "100% 50%", transform: `rotate(${ang}deg)` }}>
      <div style={{ width: 260, height: 70, borderRadius: 14, background: "linear-gradient(180deg,#3a3a3e,#141416)", boxShadow: "0 18px 30px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 250, top: -10, width: 50, height: 90, borderRadius: 8, background: "radial-gradient(circle at 30% 50%,#fffbe8,#d8c48a)", boxShadow: "0 0 60px 20px rgba(255,240,200,.55)" }} />
    </div>
    <Tag tt={tt} at={0.6} x={960} y={190} txt={h.a ?? "LA LINTERNA, ACOSTADA"} col={DIM} size={42} />
    <Tag tt={tt} at={3.2} x={960} y={1000} txt={h.lab ?? "APARECE CADA PORO"} col={AMB} size={48} />
  </>;
}}</Stage>;

// ---------- D7 · MANO, ESPERA, MANO: la brocha pasa la 1ª mano, el reloj da la vuelta entera de 24 h y pasa la 2ª ----------
export const HCoats: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const c1 = eio(tt, 0.7, 1.9), spin = eio(tt, 2.0, 3.6), c2 = eio(tt, 3.7, 4.9), W = 900, Hh = 300, X = 300, Y = 520;
  const bx = tt < 2 ? X + W * c1 : X + W * c2, by = Y - 40, brushOn = (tt > 0.6 && tt < 2.0) || (tt > 3.6 && tt < 5.0);
  const n = Math.round(spin * +(h.hrs ?? 24));
  return <>
    <Shadow x={X + W / 2} y={Y + Hh + 50} w={W} />
    <div style={{ position: "absolute", left: X, top: Y, transform: "perspective(1600px) rotateX(40deg)", transformOrigin: "50% 100%" }}>
      <SlabFace w={W} h={Hh} gloss={0.15 * c1 + 0.45 * c2} seed={71} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W * c1, height: Hh, background: "linear-gradient(180deg,rgba(255,250,235,.22),rgba(255,255,255,.05))" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W * c2, height: Hh, background: "linear-gradient(115deg,transparent 30%,rgba(255,255,255,.35) 48%,transparent 60%)" }} />
    </div>
    {brushOn && <div style={{ position: "absolute", left: bx - 50, top: by - 200, transform: `rotate(${12 + 6 * Math.sin(tt * 9)}deg)` }}>
      <div style={{ width: 40, height: 160, margin: "0 auto", borderRadius: 14, background: "linear-gradient(90deg,#8a5a30,#c08850,#7a4c26)" }} />
      <div style={{ width: 120, height: 40, background: "linear-gradient(90deg,#999,#eee,#888)" }} />
      <div style={{ width: 120, height: 70, background: "linear-gradient(180deg,#3a2e22,#1b140e)", borderRadius: "0 0 10px 10px" }} />
    </div>}
    <div style={{ position: "absolute", left: 1500, top: 330, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,#fafaf7,#d8d6cf)", boxShadow: "0 0 0 14px #2b2b2e, 0 40px 80px rgba(0,0,0,.6)", transform: `scale(${cl(phys(tt, 1.8, 6, 0.5))})` }}>
      <svg width={280} height={280} style={{ position: "absolute", left: 0, top: 0 }}><circle cx={140} cy={140} r={110} stroke={AMB} strokeWidth={18} fill="none" pathLength={1} strokeDasharray={`${spin} 1`} transform="rotate(-90 140 140)" /></svg>
      <div style={{ position: "absolute", left: 136, top: 40, width: 8, height: 100, background: "#222", borderRadius: 4, transformOrigin: "4px 100px", transform: `rotate(${spin * 720}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontWeight: 900, fontSize: 48, color: "#222" }}>{n} H</div>
    </div>
    <Tag tt={tt} at={1.2} x={X + 200} y={Y - 260} txt={h.a ?? "1ª MANO"} col={DIM} size={40} />
    <Tag tt={tt} at={4.2} x={X + W - 200} y={Y - 260} txt={h.b ?? "2ª MANO"} col={GRN} size={40} />
    {h.lab && <Tag tt={tt} at={2.4} x={1640} y={720} txt={h.lab} col={AMB} size={40} />}
  </>;
}}</Stage>;

// ---------- D8 · NUNCA EN SECO: el taco de lija va y viene con un hilo de agua; en seco, polvo y rayas ----------
export const HWetsand: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const W = 1200, Hh = 380, X = 960 - W / 2, Y = 500, go = eio(tt, 0.6, 1.2), sx = Math.sin(tt * 4.2) * 300 * go, wet = eio(tt, 0.9, 3.0);
  return <>
    <Shadow x={960} y={Y + Hh + 50} w={W} />
    <div style={{ position: "absolute", left: X, top: Y, transform: "perspective(1600px) rotateX(46deg)", transformOrigin: "50% 100%" }}>
      <SlabFace w={W} h={Hh} gloss={0.1 + 0.5 * wet} seed={81} />
      <div style={{ position: "absolute", left: W / 2 - 360, top: 40, width: 720, height: Hh - 80, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(190,215,235,${0.45 * wet}), transparent 70%)` }} />
    </div>
    <div style={{ position: "absolute", left: 960 - 6 + 40, top: 0, width: 12, height: Y + 120, background: "linear-gradient(180deg,rgba(150,200,240,.0),rgba(150,200,240,.85) 30%,rgba(190,225,250,.9))", opacity: wet > 0 ? 1 : 0, clipPath: `inset(0 0 ${(1 - cl(wet * 2)) * 100}% 0)` }} />
    {Array.from({ length: 6 }, (_, i) => { const q = ((tt * 1.6 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: 960 + 40 - 4, top: q * (Y + 100), width: 8, height: 16, borderRadius: 4, background: "rgba(200,230,255,.9)", opacity: wet }} />; })}
    <div style={{ position: "absolute", left: 960 - 130 + sx, top: Y + 70, width: 260, height: 110, borderRadius: 14, background: "linear-gradient(180deg,#e85a2a,#a63a16)", boxShadow: "0 20px 30px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -16, height: 20, background: "#2f2f2f", borderRadius: "0 0 10px 10px" }} />
      <div style={{ position: "absolute", left: 30, top: 40, fontWeight: 900, fontSize: 28, color: "#fff2e8" }}>{h.grit ?? "LIJA AL AGUA"}</div>
    </div>
    {Array.from({ length: 10 }, (_, i) => { const q = ((tt * 1.3 + i * 0.1) % 1); return <div key={"s" + i} style={{ position: "absolute", left: 960 + sx + (i - 5) * 26, top: Y + 200 + q * 40, width: 14, height: 8, borderRadius: "50%", background: "rgba(225,220,210,.8)", opacity: (1 - q) * wet }} />; })}
    <Tag tt={tt} at={1.2} x={560} y={260} txt={h.a ?? "UN HILO DE AGUA, SIEMPRE"} col={DIM} size={42} />
    {h.stamp && <div style={{ position: "absolute", left: 1400, top: 300, transform: `translate(-50%,-50%) scale(${cl(phys(tt, h.stampAt ?? 3.0, 7, 0.35))}) rotate(-4deg)`, fontFamily: MARK, fontSize: 72, color: "#ff5a4a", border: "6px solid #ff5a4a", padding: "4px 24px", borderRadius: 10, whiteSpace: "nowrap" }}>{h.stamp}</div>}
  </>;
}}</Stage>;

// ---------- D9 · CIEN AÑOS DE CEMENTO: la baldosa calcárea se dibuja, envejece y su mismo cemento pasa a tu mesa ----------
export const HTiles: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const draw = eio(tt, 0.5, 2.2), age = eio(tt, 1.6, 2.6), mv = eio(tt, 3.0, 4.2), S = 380;
  const Tile: React.FC<{ x: number; y: number }> = ({ x, y }) => <div style={{ position: "absolute", left: x, top: y, width: S, height: S, background: "#e9e2d2", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
    <svg width={S} height={S}>
      <rect x={30} y={30} width={S - 60} height={S - 60} fill="none" stroke="#2a2724" strokeWidth={16} pathLength={1} strokeDasharray={`${draw} 1`} />
      <path d={`M ${S / 2} 50 L ${S - 50} ${S / 2} L ${S / 2} ${S - 50} L 50 ${S / 2} Z`} fill={`rgba(139,58,44,${draw})`} stroke="#2a2724" strokeWidth={10} />
      <circle cx={S / 2} cy={S / 2} r={50 * draw} fill="#e9e2d2" stroke="#2a2724" strokeWidth={8} />
      <path d={`M 40 ${S - 70} l 70 -30 l 40 50 l 90 -20`} stroke="rgba(40,36,30,.7)" strokeWidth={3} fill="none" pathLength={1} strokeDasharray={`${age} 1`} />
    </svg>
    <div style={{ position: "absolute", inset: 0, background: `rgba(120,100,70,${0.18 * age})`, mixBlendMode: "multiply" }} />
  </div>;
  return <>
    <Tile x={260} y={330} />
    <div style={{ position: "absolute", left: 450, top: 260, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 64, color: TX, opacity: cl(draw * 2) }}>{h.y0 ?? "1925"}</div>
    <svg width={600} height={120} style={{ position: "absolute", left: 700, top: 460 }}><path d="M 10 60 C 200 0, 400 120, 580 60" stroke={AMB} strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${mv} 1`} /></svg>
    <div style={{ position: "absolute", left: 1300, top: 380, transform: `scale(${cl(phys(tt, 3.8, 6, 0.5))})`, transformOrigin: "50% 50%" }}><SlabFace w={420} h={280} gloss={0.6} seed={91} /></div>
    <div style={{ position: "absolute", left: 1510, top: 260, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 64, color: GRN, opacity: cl(mv * 2 - 1) }}>{h.y1 ?? "HOY"}</div>
    <Tag tt={tt} at={2.4} x={450} y={790} txt={h.a ?? "LA CALCÁREA DEL ABUELO"} col={DIM} size={40} />
    <Tag tt={tt} at={4.2} x={1510} y={790} txt={h.b ?? "TU MESA"} col={GRN} size={40} />
    {h.lab && <Tag tt={tt} at={4.6} x={960} y={960} txt={h.lab} col={AMB} size={48} />}
  </>;
}}</Stage>;

// ---------- D10 · LA MALLA ADENTRO: corte de la losa; media colada, la malla baja con peso, la otra mitad la tapa ----------
export const HMeshslab: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const W = 1300, Hh = 260, X = 960 - W / 2, Y = 470, p1 = eio(tt, 0.5, 1.6), m = cl(phys(tt, 1.8, 6, 0.45)), p2 = eio(tt, 3.0, 4.2), bend = eio(tt, 4.6, 5.4);
  return <>
    <Head tt={tt} kick={h.kick ?? "EL ARMADO"} title={h.title ?? "LA MALLA VA AL MEDIO"} />
    <div style={{ position: "absolute", left: X - 30, top: Y - 20, width: W + 60, height: Hh + 50, border: "20px solid #d9d5cc", borderTop: "none", borderRadius: "0 0 8px 8px", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: X, top: Y + Hh - Hh / 2 * p1, width: W, height: Hh / 2 * p1, background: "linear-gradient(180deg,#e9e7e1,#c9c6be)" }} />
    <svg width={W} height={60} style={{ position: "absolute", left: X, top: Y + Hh / 2 - 30 - (1 - m) * 380, opacity: cl(m * 3) }}>
      {Array.from({ length: 27 }, (_, i) => <line key={i} x1={i * 50} y1={0} x2={i * 50 + 30} y2={60} stroke="#e7d36a" strokeWidth={5} />)}
      {Array.from({ length: 27 }, (_, i) => <line key={"b" + i} x1={i * 50 + 30} y1={0} x2={i * 50} y2={60} stroke="#e7d36a" strokeWidth={5} />)}
    </svg>
    <div style={{ position: "absolute", left: X, top: Y + Hh / 2 - Hh / 2 * p2, width: W, height: Hh / 2 * p2, background: "linear-gradient(180deg,#f2f0ea,#dcd9d1)", opacity: 0.92 }} />
    <Tag tt={tt} at={2.2} x={1300} y={Y - 70} txt={h.a ?? "MALLA DE FIBRA DE VIDRIO"} col={AMB} size={38} />
    <Tag tt={tt} at={4.4} x={960} y={Y + Hh + 140} txt={h.lab ?? "SI SE RAJA, NO SE PARTE"} col={GRN} size={46} />
  </>;
}}</Stage>;

// ---------- D11 · GOLPECITOS: la palma golpea la mesa, la bandeja salta y las burbujas suben y revientan ----------
export const HBubbles: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const taps = [0.9, 1.5, 2.1, 2.7, 3.3], last = taps.filter((x) => tt > x).pop() ?? -9, jolt = Math.exp(-(tt - last) * 10) * (tt > last ? 1 : 0), W = 900, Hh = 300, X = 960 - W / 2, Y = 520;
  return <>
    <div style={{ position: "absolute", left: 0, top: Y + Hh + 40, width: 1920, height: 300, background: "linear-gradient(180deg,#5a4430,#2a1f15)" }} />
    <div style={{ position: "absolute", left: X, top: Y - 14 * jolt, width: W, height: Hh, borderRadius: 18, background: "linear-gradient(180deg,#2c2c30,#111)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 18, top: 30, right: 18, bottom: 18, borderRadius: 12, background: "radial-gradient(ellipse at 50% 30%,#fbfaf6,#dedbd3)" }} />
      {Array.from({ length: 28 }, (_, i) => { const st = 0.9 + (i % 9) * 0.3, q = cl((tt - st) / 1.2); return <div key={i} style={{ position: "absolute", left: 40 + (i * 131) % (W - 80), top: 260 - q * 200, width: 10 + (i % 4) * 5, height: 10 + (i % 4) * 5, borderRadius: "50%", border: "2px solid rgba(150,150,150,.8)", background: "rgba(255,255,255,.6)", opacity: q > 0 && q < 1 ? 1 : 0, transform: `scale(${q > 0.9 ? 1.6 : 1})` }} />; })}
    </div>
    <div style={{ position: "absolute", left: X + W + 40, top: Y + Hh - 40 - 120 * (1 - jolt) , width: 220, height: 130, borderRadius: "45% 50% 40% 45%", background: "linear-gradient(180deg,#d6a07a,#a8714f)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    {tt > 0.9 && <div style={{ position: "absolute", left: X + W + 150, top: Y + Hh + 10, transform: `translate(-50%,-50%) scale(${0.6 + jolt})`, fontFamily: MARK, fontSize: 70, color: AMB, opacity: jolt }}>TAC</div>}
    <Tag tt={tt} at={1.2} x={960} y={220} txt={h.a ?? "LA PALMA CONTRA LA MESA"} col={DIM} size={42} />
    <Tag tt={tt} at={3.4} x={960} y={1000} txt={h.lab ?? "MEDIO MINUTO · SUBEN LAS BURBUJAS"} col={AMB} size={46} />
  </>;
}}</Stage>;

// ---------- D12 · LOS TRAPOS CON ACEITE: el trapo hecho bollo humea y se prende; el estirado o en agua, no ----------
export const HRags: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const heat = eio(tt, 0.8, 3.0), fire = cl((tt - 2.6) * 1.5), cool = eio(tt, 1.2, 2.4);
  return <>
    <div style={{ position: "absolute", left: 300, top: 470 }}>
      <Shadow x={180} y={260} w={420} />
      <div style={{ width: 360, height: 240, borderRadius: "46% 54% 50% 48%", background: `radial-gradient(circle at 45% 40%, rgb(${200 + 40 * heat},${180 - 60 * heat},${140 - 80 * heat}), #6b5a44)`, boxShadow: `0 0 ${80 * heat}px rgba(255,120,40,${0.6 * heat})` }} />
      {Array.from({ length: 5 }, (_, i) => { const q = ((tt * 0.7 + i * 0.2) % 1); return <div key={i} style={{ position: "absolute", left: 120 + i * 30, top: -q * 220, width: 40, height: 40, borderRadius: "50%", background: `rgba(200,200,200,${0.35 * heat * (1 - q)})`, filter: "blur(6px)" }} />; })}
      {fire > 0 && Array.from({ length: 6 }, (_, i) => <div key={"f" + i} style={{ position: "absolute", left: 60 + i * 45, top: -80 - 40 * Math.sin(tt * 6 + i) * fire, width: 70, height: 140 * fire, borderRadius: "50% 50% 40% 40%", background: "linear-gradient(0deg,#ff5a1a,#ffc23a 60%,rgba(255,240,180,.0))", opacity: 0.85 }} />)}
      <Tag tt={tt} at={2.8} x={180} y={330} txt={h.a ?? "HECHO UN BOLLO: SE PRENDE SOLO"} col="#ff5a4a" size={38} />
    </div>
    <div style={{ position: "absolute", left: 1100, top: 520 }}>
      <Shadow x={260} y={200} w={560} />
      <div style={{ width: 520, height: 160, borderRadius: 10, background: "linear-gradient(135deg,#d9cdb8,#b9a88c)", transform: `perspective(900px) rotateX(${50 * (1 - cool)}deg) scaleX(${0.5 + 0.5 * cool})` }} />
      <div style={{ position: "absolute", left: 0, top: 110, width: 520, height: 70, borderRadius: 10, background: "rgba(120,180,230,.45)", opacity: cool }} />
      <Tag tt={tt} at={2.6} x={260} y={290} txt={h.b ?? "ESTIRADO O EN AGUA: NADA"} col={GRN} size={38} />
    </div>
    {h.lab && <Tag tt={tt} at={0.5} x={960} y={220} txt={h.lab} col={AMB} size={50} />}
  </>;
}}</Stage>;

// ---------- D13 · TRES CHICAS, NO UNA GRANDE: el balde grande se pone gris y se raja a la mitad; las tres chicas salen enteras ----------
export const HThreebowls: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const set = eio(tt, 1.2, 3.0), ok = (i: number) => cl(phys(tt, 2.4 + i * 0.35, 6, 0.5));
  const Bowl: React.FC<{ x: number; y: number; w: number; g: number; c?: number }> = ({ x, y, w, g, c = 0 }) => <div style={{ position: "absolute", left: x - w / 2, top: y }}>
    <Shadow x={w / 2} y={w * 0.62} w={w * 1.1} />
    <div style={{ width: w, height: w * 0.55, clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)", background: "linear-gradient(90deg,#3b6fb0,#6d9be0 45%,#2b5590)" }} />
    <div style={{ position: "absolute", left: w * 0.04, top: -w * 0.06, width: w * 0.92, height: w * 0.16, borderRadius: "50%", background: `rgb(${246 - 70 * g},${245 - 70 * g},${240 - 66 * g})` }} />
    {c > 0 && <svg width={w} height={w * 0.2} style={{ position: "absolute", left: 0, top: -w * 0.06 }}><path d={`M ${w * 0.2} ${w * 0.08} l ${w * 0.15} ${w * 0.04} l ${w * 0.1} ${-w * 0.05} l ${w * 0.2} ${w * 0.06}`} stroke="#3a3833" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${c} 1`} /></svg>}
  </div>;
  return <>
    <Bowl x={480} y={460} w={460} g={set} c={eio(tt, 2.6, 3.4)} />
    <Tag tt={tt} at={3.2} x={480} y={830} txt={h.a ?? "UNA GRANDE: SE ENDURECE A LA MITAD"} col="#ff5a4a" size={36} />
    {[0, 1, 2].map((i) => <div key={i} style={{ opacity: ok(i), transform: `translateY(${(1 - ok(i)) * -200}px)` }}><Bowl x={1180 + i * 260} y={540} w={220} g={0} /></div>)}
    <Tag tt={tt} at={3.6} x={1440} y={830} txt={h.b ?? "TRES CHICAS: TODAS A TIEMPO"} col={GRN} size={36} />
    {h.lab && <Tag tt={tt} at={0.5} x={960} y={220} txt={h.lab} col={AMB} size={50} />}
  </>;
}}</Stage>;

// ---------- D14 · EL VAPOR DE LA DUCHA: el vapor sube contra el azulejo de yeso, se oscurece y se ablanda ----------
export const HSteam: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #1b2128, #07090b 75%)">{(tt) => {
  const st = eio(tt, 0.6, 3.0), soft = eio(tt, 2.2, 4.2);
  return <>
    {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 30, top: 180, width: 8, height: 560, background: "linear-gradient(180deg,rgba(170,210,240,.6),rgba(170,210,240,0))", transform: `rotate(${8 + i * 2}deg)`, opacity: 0.6 }} />)}
    <div style={{ position: "absolute", left: 230, top: 120, width: 300, height: 90, borderRadius: "50%", background: "radial-gradient(circle,#c9ced3,#6c7277)" }} />
    {Array.from({ length: 14 }, (_, i) => { const q = ((tt * 0.5 + i / 14) % 1); return <div key={"v" + i} style={{ position: "absolute", left: 500 + q * 600 + (i % 3) * 40, top: 760 - q * 420, width: 160 + q * 160, height: 120 + q * 120, borderRadius: "50%", background: `rgba(230,236,240,${0.22 * st * (1 - q)})`, filter: "blur(18px)" }} />; })}
    <div style={{ position: "absolute", left: 1150, top: 300, transformOrigin: "50% 0%", transform: `skewY(${6 * soft}deg) scaleY(${1 + 0.06 * soft})` }}>
      <SlabFace w={480} h={480} gloss={0.3 * (1 - soft)} veins={0.6} grey={0.35 * soft} seed={101} />
      {Array.from({ length: 6 }, (_, i) => <div key={"d" + i} style={{ position: "absolute", left: 40 + i * 75, top: 480 - 10 + soft * (20 + (i % 3) * 30), width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(170,205,230,.85)", opacity: soft }} />)}
    </div>
    <Tag tt={tt} at={1.0} x={1390} y={230} txt={h.a ?? "YESO EN LA PARED DEL BAÑO"} col={DIM} size={40} />
    <Tag tt={tt} at={3.6} x={1390} y={900} txt={h.lab ?? "EL VAPOR LO ABLANDA"} col="#ff5a4a" size={48} />
  </>;
}}</Stage>;

// ---------- D15 · LAS DOS VETAS CLÁSICAS: la Carrara (blanca, veta gris con ramitas) y la Marquina (negra, veta blanca) se dibujan solas ----------
export const HTwovein: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const W = 620, Hh = 420, v1 = eio(tt, 0.7, 2.2), v2 = eio(tt, 2.4, 3.9);
  const Vein: React.FC<{ p: number; col: string; seed: number }> = ({ p, col, seed }) => <svg width={W} height={Hh} style={{ position: "absolute", left: 0, top: 0 }}>
    <path d={`M -10 ${Hh * 0.85} C ${W * 0.3} ${Hh * 0.6}, ${W * 0.45} ${Hh * 0.45}, ${W + 10} ${Hh * 0.12}`} stroke={col} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{ filter: "blur(1.2px)" }} />
    {[0.3, 0.5, 0.7].map((q, i) => <path key={i} d={`M ${W * q} ${Hh * (0.75 - q * 0.6)} l ${40 + seed * 10} ${30 + i * 12} l ${30} ${-6}`} stroke={col} strokeWidth={3} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(p * 1.6 - 0.6)} opacity={0.8} />)}
  </svg>;
  return <>
    <div style={{ position: "absolute", left: 160, top: 300, transform: `rotate(-2deg) scale(${cl(phys(tt, 0.2, 6, 0.5))})` }}>
      <SlabFace w={W} h={Hh} gloss={0.45} seed={111} /><Vein p={v1} col="rgba(110,112,118,.85)" seed={1} />
      <Tag tt={tt} at={1.8} x={W / 2} y={Hh + 70} txt={h.a ?? "CARRARA · BLANCA Y GRIS"} col={TX} size={40} />
    </div>
    <div style={{ position: "absolute", left: 1140, top: 300, transform: `rotate(2deg) scale(${cl(phys(tt, 2.0, 6, 0.5))})` }}>
      <div style={{ width: W, height: Hh, borderRadius: 10, overflow: "hidden", background: "linear-gradient(135deg,#121214,#26262a 50%,#0c0c0d)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", position: "relative" }}>
        <Vein p={v2} col="rgba(245,244,240,.92)" seed={2} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.28) 46%, transparent 58%)" }} />
      </div>
      <Tag tt={tt} at={3.6} x={W / 2} y={Hh + 70} txt={h.b ?? "MARQUINA · NEGRA Y BLANCA"} col={AMB} size={40} />
    </div>
  </>;
}}</Stage>;

// ---------- D16 · EL ÁNGULO DE LA LLANA: la llana se acuesta contra la pared a 15-20° para poner y se para a 45° para planchar ----------
export const HAngle: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a1 = +(h.a1 ?? 18), a2 = +(h.a2 ?? 45), k1 = eio(tt, 0.6, 1.8), k2 = eio(tt, 3.0, 4.0), ang = k1 * a1 + k2 * (a2 - a1), WX = 1150;
  return <>
    <div style={{ position: "absolute", left: WX, top: 120, width: 160, height: 860, background: "linear-gradient(90deg,#d8d4ca,#efece6)", boxShadow: "-30px 0 60px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: -10, top: 200, width: 14, height: 300 + 200 * k1, background: "rgba(255,255,255,.7)", opacity: k1 }} />
    </div>
    <div style={{ position: "absolute", left: WX - 560, top: 520, width: 560, height: 30, transformOrigin: "100% 50%", transform: `rotate(${-ang}deg)` }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: 460, height: 22, borderRadius: 6, background: "linear-gradient(180deg,#f2f4f6,#9aa1a7)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}><Sheen p={(tt * 0.4) % 1} r={6} o={0.6} /></div>
      <div style={{ position: "absolute", left: 120, top: -70, width: 40, height: 80, background: "#6b4a2c", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 40, top: -110, width: 180, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#8a5a30,#5e3c1e)" }} />
    </div>
    <svg width={600} height={600} style={{ position: "absolute", left: WX - 300, top: 220 }}>
      <path d={`M 300 300 L ${300 - 260} 300`} stroke="rgba(255,255,255,.25)" strokeWidth={3} strokeDasharray="10 10" />
      <path d={`M ${300 - 220} 300 A 220 220 0 0 0 ${300 - 220 * Math.cos(ang * Math.PI / 180)} ${300 + 220 * Math.sin(ang * Math.PI / 180)}`} stroke={AMB} strokeWidth={8} fill="none" />
    </svg>
    <div style={{ position: "absolute", left: WX - 470, top: 330, fontWeight: 900, fontSize: 130, color: TX, textShadow: "0 12px 40px rgba(0,0,0,.7)" }}>{Math.round(ang)}°</div>
    <Tag tt={tt} at={1.6} x={520} y={200} txt={h.a ?? "15-20° · PARA PONER"} col={DIM} size={42} />
    <Tag tt={tt} at={4.0} x={520} y={270} txt={h.b ?? "45° · PARA PLANCHAR"} col={GRN} size={42} />
  </>;
}}</Stage>;

// ---------- D17 · EL PLANCHADO: la llana barre la pared en arco y detrás queda una franja que brilla ----------
export const HPolish: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.8, 3.4), W = 1300, Hh = 640, X = 960 - W / 2, Y = 230, bx = X + 80 + (W - 260) * p, by = Y + Hh * (0.75 - 0.45 * Math.sin(p * Math.PI));
  return <>
    <div style={{ position: "absolute", left: X, top: Y, width: W, height: Hh, borderRadius: 6, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <SlabFace w={W} h={Hh} gloss={0} veins={0.8} grey={0.25} seed={121} />
      <div style={{ position: "absolute", left: 0, top: 0, width: (bx - X) + 60, height: Hh, background: "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,.55) 45%, rgba(255,255,255,.1) 60%, rgba(255,255,255,.35) 80%)", mixBlendMode: "screen" }} />
    </div>
    <div style={{ position: "absolute", left: bx - 160, top: by - 40, width: 320, height: 60, borderRadius: 10, background: "linear-gradient(180deg,#f2f4f6,#8f969c)", boxShadow: "0 16px 30px rgba(0,0,0,.55)", transform: `rotate(${-20 + 40 * p}deg)` }}>
      <div style={{ position: "absolute", left: 110, top: -70, width: 100, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#8a5a30,#5e3c1e)" }} />
    </div>
    {tt > 3.4 && <div style={{ position: "absolute", left: 1500, top: 180, transform: `translate(-50%,-50%) scale(${cl(phys(tt, 3.4, 7, 0.35))}) rotate(-8deg)`, fontFamily: MARK, fontSize: 120, color: AMB, textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{h.txt ?? "¡BRILLA!"}</div>}
    {h.lab && <Tag tt={tt} at={2.0} x={960} y={970} txt={h.lab} col={TX} size={46} />}
  </>;
}}</Stage>;

// ---------- D18 · EL AÑO: doce meses en fila; la gota de cera cae sólo en los meses que toca ----------
export const HYear: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const M = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"], ev = +(h.every ?? 12), W = 120, G = 14, X0 = 960 - (12 * W + 11 * G) / 2;
  return <>
    {M.map((m, i) => { const s = cl(phys(tt, 0.2 + i * 0.08, 6, 0.5)), on = i % ev === 0, dk = on ? cl(phys(tt, 1.6 + (i / ev) * 0.6, 6, 0.45)) : 0;
      return <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 470 + (1 - s) * -500, width: W, height: 150, borderRadius: 14, background: on && dk > 0.5 ? "linear-gradient(180deg,#f6e7c4,#d9b77a)" : "linear-gradient(180deg,#2c2a27,#1c1b19)", boxShadow: "0 20px 40px rgba(0,0,0,.55)", opacity: cl(s * 2), textAlign: "center" }}>
        <div style={{ height: 34, borderRadius: "14px 14px 0 0", background: on ? AMB : "#3a3733" }} />
        <div style={{ fontWeight: 900, fontSize: 34, color: on && dk > 0.5 ? "#2b241b" : DIM, marginTop: 30 }}>{m}</div>
        {on && <div style={{ position: "absolute", left: W / 2 - 22, top: -170 + 200 * eIn(cl(dk)), width: 44, height: 56, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #fff6dc, #d9a54a)", opacity: dk > 0.98 ? 0 : 1, boxShadow: "0 8px 16px rgba(0,0,0,.4)" }} />}
      </div>; })}
    <Shadow x={960} y={640} w={1500} k={1} o={0.45} />
    <div style={{ position: "absolute", left: 960, top: 330, transform: `translate(-50%,-50%) scale(${cl(phys(tt, 2.8, 6, 0.4))})`, fontWeight: 900, fontSize: 110, color: TX, textShadow: "0 12px 40px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{h.v}</div>
    <Tag tt={tt} at={3.4} x={960} y={790} txt={h.lab ?? ""} col={AMB} size={44} />
  </>;
}}</Stage>;
