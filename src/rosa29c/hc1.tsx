// rosa29c · componentes únicos 1-10 (cada uno = la frase de ese segundo, hecho objeto). Todo en código, ninguna familia de rosa29a ni rosa29b.
import React from "react";
import { Stage, H, phys, cl, eio, AMB } from "./hkit";
import { Steam, Tape, Big, Jar, Table, Shadow } from "./rkit";

export type P = { t: number; h: H };
export const sp = (tt: number, a: number, w = 6, z = 0.5) => phys(tt, a, w, z);
export const pos = (x: number, y: number, tr = "", ex: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) ${tr}`, ...ex });
export const NIGHT = "radial-gradient(ellipse 90% 70% at 50% 40%, #1c2a44, #070a12 75%)";

// 1 · «La helada quemó el maíz en una sola noche»: las plantas de maíz verdes se cubren de escarcha de abajo hacia arriba y se doblan
export const FrostCorn: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg={NIGHT}>{(tt) => {
  const fr = eio(tt, 0.8, 4.2);
  return <>
    <div style={pos(960, 930, "", { width: 2000, height: 300, background: `linear-gradient(180deg, rgb(${Math.round(90 + 140 * fr)},${Math.round(70 + 160 * fr)},${Math.round(40 + 200 * fr)}), #1a1410)` })} />
    {Array.from({ length: 9 }, (_, i) => { const x = 180 + i * 200, s = sp(tt, 0.05 + i * 0.06, 4.5, 0.6), bend = 18 * eio(tt, 2.0 + i * 0.1, 4.4) * (i % 2 ? 1 : -1);
      const g = `rgb(${Math.round(60 + 170 * fr)},${Math.round(140 + 90 * fr)},${Math.round(60 + 180 * fr)})`;
      return <div key={i} style={{ position: "absolute", left: x - 60, top: 300, width: 120, height: 520, transformOrigin: "50% 100%", transform: `scaleY(${s}) rotate(${bend}deg)` }}>
        <div style={{ position: "absolute", left: 54, top: 40, width: 12, height: 480, borderRadius: 6, background: g }} />
        {[0, 1, 2, 3].map((j) => <div key={j} style={{ position: "absolute", left: j % 2 ? 60 : -40, top: 100 + j * 90, width: 100, height: 22, borderRadius: "50% 50% 50% 50% / 100% 100% 0 0", background: g, transform: `rotate(${(j % 2 ? -30 : 30) + bend}deg)` }} />)}
        <div style={{ position: "absolute", left: 40, top: 160, width: 40, height: 110, borderRadius: 20, background: `rgb(${Math.round(230 - 40 * fr)},${Math.round(200 - 20 * fr)},${Math.round(90 + 150 * fr)})` }} />
      </div>; })}
    {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 173) % 1920, top: 820 - 520 * fr * ((i * 37) % 100) / 100, width: 8, height: 8, background: "#e8f4ff", transform: "rotate(45deg)", opacity: fr * 0.85 }} />)}
    <Big tt={tt} at={2.4} x={960} y={150} txt="EN UNA SOLA NOCHE" size={84} col={AMB} />
  </>;
}}</Stage>;

// 2 · «La tienda más cercana, a veinte kilómetros a caballo»: un caballito recorre el camino de tierra de la casa a la tienda; el camino se dibuja
export const HorseTrail: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#e9d7b4,#c9a978)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), p = eio(tt, 0.5, 4.8);
  const d = "M 260 760 C 520 520, 760 900, 1000 640 S 1460 380, 1660 520";
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={d} stroke="#8a6a40" strokeWidth={60} fill="none" strokeLinecap="round" opacity={0.35} />
      <path d={d} stroke="#6b4a2a" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="22 22" pathLength={1000} strokeDashoffset={0} style={{ clipPath: `inset(0 ${100 - 100 * p}% 0 0)` }} />
    </svg>
    <div style={pos(260, 700, `scale(${s})`, { width: 200, height: 160 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 200, height: 100, background: "linear-gradient(180deg,#d9b48a,#b08a5a)", boxShadow: "0 16px 24px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: -10, top: 0, width: 0, height: 0, borderLeft: "110px solid transparent", borderRight: "110px solid transparent", borderBottom: "64px solid #7a4a2a" }} />
    </div>
    <div style={pos(1660, 470, `scale(${sp(tt, 0.3, 4.5, 0.6)})`, { width: 220, height: 170 })}>
      <div style={{ position: "absolute", left: 0, top: 50, width: 220, height: 120, background: "linear-gradient(180deg,#f2ece0,#c9bea4)", boxShadow: "0 16px 24px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 30, top: 0, width: 160, height: 50, background: "#b33a2c", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 80, top: 100, width: 60, height: 70, background: "#5b3a22" }} />
    </div>
    {(() => { const x = 260 + 1400 * p, y = 760 - 120 * Math.sin(p * Math.PI * 2) - 120 * p, b = Math.abs(Math.sin(tt * 9)) * 10;
      return <div style={pos(x, y - 60 - b, "", { width: 150, height: 110 })}>
        <div style={{ position: "absolute", left: 20, top: 30, width: 100, height: 44, borderRadius: 22, background: "#5b3a22" }} />
        <div style={{ position: "absolute", left: 100, top: 0, width: 26, height: 56, borderRadius: 10, background: "#5b3a22", transform: "rotate(25deg)" }} />
        <div style={{ position: "absolute", left: 112, top: -6, width: 40, height: 22, borderRadius: 11, background: "#5b3a22" }} />
        {[26, 46, 92, 112].map((lx, i) => <div key={lx} style={{ position: "absolute", left: lx, top: 66, width: 8, height: 40, background: "#3a2414", transform: `rotate(${18 * Math.sin(tt * 9 + i)}deg)`, transformOrigin: "50% 0" }} />)}
        <div style={{ position: "absolute", left: 6, top: 30, width: 20, height: 40, borderRadius: 10, background: "#2b1a0c", transform: `rotate(${30 + 10 * Math.sin(tt * 6)}deg)` }} />
      </div>; })()}
    <Big tt={tt} at={2.0} x={960} y={160} txt="20 KM A CABALLO" size={96} col="#7a2a1a" />
  </>;
}}</Stage>;

// 3 · «Presta atención a la número diecisiete… la número nueve… y la número uno»: tres cajones de madera con número a tiza caen al piso; el del uno queda con la tapa temblando
export const Crates: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const C: [number, number, string][] = [[17, 0.5, "LA GALLINA"], [9, 1.5, "SIN OLLA"], [1, 2.5, "LA QUE NOS SALVÓ"]];
  return <>
    <Table y={860} />
    {C.map(([n, a, lab], i) => { const q = sp(tt, a, 5.5, 0.4), x = 480 + i * 480, y = 640 - 600 * (1 - cl(q)), lid = i === 2 ? 10 * Math.max(0, Math.sin((tt - 4.0) * 12)) * Math.exp(-1.2 * Math.max(0, tt - 4.0)) * (tt > 4 ? 1 : 0) : 0;
      return <React.Fragment key={n}>
        <Shadow x={x} y={860} w={360} s={cl(q)} />
        <div style={pos(x, y, `scale(${0.6 + 0.4 * cl(q)})`, { width: 340, height: 300, opacity: cl(q * 3) })}>
          <div style={{ position: "absolute", left: 0, top: 30, width: 340, height: 270, background: "repeating-linear-gradient(180deg,#b88a56 0 60px,#8a6038 60px 66px)", boxShadow: "0 24px 40px rgba(0,0,0,.5), inset 0 0 0 10px #7a5030" }} />
          <div style={{ position: "absolute", left: -10, top: 10 - lid, width: 360, height: 34, background: "linear-gradient(180deg,#c99a64,#8a6038)", transform: `rotate(${-lid * 0.4}deg)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: "'Caveat',cursive", fontSize: 150, fontWeight: 700, color: "rgba(255,255,255,.9)" }}>{n}</div>
        </div>
        <Tape txt={lab} x={x} y={300} s={sp(tt, a + 0.6)} size={34} rot={(i - 1) * 3} />
      </React.Fragment>; })}
  </>;
}}</Stage>;

// 4 · «Nací en una casa de adobe en el campo»: los ladrillos de adobe se apilan de a uno, sube el techo de paja y se prende la ventana
export const Adobe: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#f2d9a8,#d8a868 70%,#a8763e)">{(tt) => {
  const rows = 6, per = 6, nb = rows * per, done = cl((tt - 0.3) / 2.6) * nb, roof = sp(tt, 3.0, 5, 0.5), win = cl((tt - 3.8) * 2);
  return <>
    <div style={pos(960, 930, "", { width: 2000, height: 260, background: "linear-gradient(180deg,#b88850,#7a5430)" })} />
    <div style={{ position: "absolute", left: 600, top: 380, width: 720, height: 420 }}>
      {Array.from({ length: nb }, (_, i) => { const r = Math.floor(i / per), c = i % per, f = cl(done - i); if (f <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: c * 120 + (r % 2 ? 60 : 0) - (r % 2 && c === per - 1 ? 60 : 0), top: 420 - (r + 1) * 70 - 120 * (1 - f), width: r % 2 && c === per - 1 ? 60 : 116, height: 66, borderRadius: 4,
          background: "linear-gradient(180deg,#c98a50,#a86a38)", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.18), 0 4px 8px rgba(0,0,0,.25)", opacity: f }} />; })}
      <div style={{ position: "absolute", left: 250, top: 130, width: 140, height: 120, background: `rgba(255,${190 + 40 * win},${90 + 60 * win},${win})`, boxShadow: `0 0 ${60 * win}px rgba(255,200,110,.7)`, opacity: done >= nb ? 1 : 0, border: "8px solid #6b4224" }} />
    </div>
    <div style={pos(960, 330 - 400 * (1 - cl(roof)), "", { width: 0, height: 0, borderLeft: "430px solid transparent", borderRight: "430px solid transparent", borderBottom: "170px solid #c9a24a", opacity: cl(roof * 3), filter: "drop-shadow(0 10px 10px rgba(0,0,0,.35))" })} />
    <Big tt={tt} at={1.2} x={960} y={130} txt="CASA DE ADOBE" size={96} col="#6b2a14" />
  </>;
}}</Stage>;

// 5 · «Mi madre lo hacía en un paño colgado de un clavo en la cocina, y goteaba toda la noche»: el paño con la leche cuajada cuelga del clavo y gotea en el bol; la luna pasa por la ventana
export const NailCloth: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#d9c6a4,#a88a60)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sw = 4 * Math.sin(tt * 1.3), shrink = 1 - 0.18 * eio(tt, 0.5, 6), lvl = eio(tt, 1.0, 6);
  return <>
    <div style={pos(1560, 300, "", { width: 300, height: 260, background: "linear-gradient(180deg,#1c2a44,#2c3e5a)", border: "16px solid #6b4224", overflow: "hidden" })}>
      <div style={{ position: "absolute", left: 40 + 160 * eio(tt, 0, 6.5), top: 40 + 30 * Math.sin(eio(tt, 0, 6.5) * Math.PI), width: 60, height: 60, borderRadius: "50%", background: "#f6f0d0", boxShadow: "0 0 30px #f6f0d0" }} />
    </div>
    <div style={pos(900, 150, "", { width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#d8dde2,#5b636a)", boxShadow: "0 4px 6px rgba(0,0,0,.5)" })} />
    <div style={{ position: "absolute", left: 900 - 170, top: 150, width: 340, height: 420, transformOrigin: "50% 0", transform: `rotate(${sw}deg) scale(${s})` }}>
      <svg width={340} height={420}><path d="M 170 0 L 40 60 C 0 200, 40 330, 170 380 C 300 330, 340 200, 300 60 Z" fill="#f4efe3" stroke="#d6cdb8" strokeWidth={4} />
        <path d={`M 60 ${380 - 280 * shrink} C 80 ${360 - 60 * shrink}, 260 ${360 - 60 * shrink}, 280 ${380 - 280 * shrink}`} fill="none" stroke="#e6dcc4" strokeWidth={6} />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${110 + i * 60} 70 L ${130 + i * 40} 340`} stroke="#e2d8c0" strokeWidth={3} />)}
      </svg>
    </div>
    {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.8 + i * 0.25) % 1; return tt > 0.8 ? <div key={i} style={{ position: "absolute", left: 892 + sw * 6, top: 540 + 220 * ph * ph, width: 16, height: 24, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(240,245,230,.9)", opacity: 1 - ph * 0.7 }} /> : null; })}
    <div style={pos(900, 820, `scale(${s})`, { width: 420, height: 130, borderRadius: "0 0 210px 210px / 0 0 130px 130px", background: "linear-gradient(90deg,#7a3b1f,#b4623a 40%,#5e2c16)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })}>
      <div style={{ position: "absolute", left: 30, top: -10, width: 360, height: 40, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(240,240,220,${0.3 + 0.6 * lvl}), #5a2a10 75%)` }} />
    </div>
    <Big tt={tt} at={2.0} x={560} y={230} txt="TODA LA NOCHE" size={74} col="#6b2a14" />
  </>;
}}</Stage>;

// 6 · «Y en la casa del vecino había colmenas, así que la miel se cambiaba por huevos»: la balanza de almacén con un frasco de miel de un lado y huevos del otro, se nivela
export const Barter: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), m = sp(tt, 0.4, 5.5, 0.45), e = Math.min(1, cl((tt - 1.0) / 1.2));
  const ang = 14 * cl(m) - 14 * e + 3 * Math.exp(-2 * Math.max(0, tt - 2.3)) * Math.sin(Math.max(0, tt - 2.3) * 9) * (tt > 2.3 ? 1 : 0);
  return <>
    <Table y={860} />
    <div style={pos(960, 640, `scale(${s})`, { width: 60, height: 440, background: "linear-gradient(90deg,#8a6a2a,#d8b860,#8a6a2a)", borderRadius: 10 })} />
    <div style={pos(960, 860, `scale(${s})`, { width: 300, height: 40, borderRadius: 20, background: "linear-gradient(180deg,#d8b860,#8a6a2a)" })} />
    <div style={{ position: "absolute", left: 960 - 460, top: 420, width: 920, height: 0, transform: `rotate(${-ang}deg) scale(${s})` }}>
      <div style={{ position: "absolute", left: 0, top: -8, width: 920, height: 16, borderRadius: 8, background: "linear-gradient(180deg,#e6c870,#8a6a2a)" }} />
      {[0, 920].map((x, i) => <div key={x} style={{ position: "absolute", left: x - 160, top: 0, width: 320, height: 300, transform: `rotate(${ang}deg)`, transformOrigin: "50% 0" }}>
        <svg width={320} height={230} style={{ position: "absolute", top: 0 }}><path d="M 160 0 L 30 200 M 160 0 L 290 200" stroke="#8a6a2a" strokeWidth={4} /></svg>
        <div style={{ position: "absolute", left: 0, top: 200, width: 320, height: 50, borderRadius: "0 0 160px 160px / 0 0 50px 50px", background: "linear-gradient(180deg,#e6c870,#8a6a2a)" }} />
        {i === 0 ? <div style={{ position: "absolute", left: 90, top: 200 - 170 + 400 * (1 - cl(m)), opacity: cl(m * 3) }}><Jar w={140} fill={0.85} col="#e8a020" lid="#6b4224" /></div>
          : Array.from({ length: 6 }, (_, j) => { const q = sp(tt, 1.0 + j * 0.2, 6, 0.45); return q > 0.01 ? <div key={j} style={{ position: "absolute", left: 40 + (j % 3) * 80, top: (j < 3 ? 140 : 90) - 300 * (1 - cl(q)), width: 76, height: 70, borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%", background: "radial-gradient(circle at 35% 30%,#fbf3e4,#e0c9a0 70%)", boxShadow: "0 6px 10px rgba(0,0,0,.3)" }} /> : null; })}
      </div>)}
    </div>
    <Big tt={tt} at={2.6} x={960} y={170} txt="MIEL POR HUEVOS" size={96} col={AMB} />
  </>;
}}</Stage>;

// 7 · «Las tiraba enteras, con la hoja, sobre las brasas… adentro el maíz se cocinaba en su propio vapor»: la hoja verde se quema y se abre; adentro el maíz amarillo humea
export const Husk: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 60%, #3a1a0a, #0d0705 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), burn = eio(tt, 0.4, 2.6), op = eio(tt, 2.6, 3.6);
  const leaf = (dir: number) => <div style={{ position: "absolute", left: dir < 0 ? 0 : 150, top: 0, width: 170, height: 520, borderRadius: dir < 0 ? "160px 10px 10px 160px / 520px 40px 40px 520px" : "10px 160px 160px 10px / 40px 520px 520px 40px",
    background: `linear-gradient(90deg, rgb(${Math.round(110 - 80 * burn)},${Math.round(150 - 125 * burn)},${Math.round(60 - 45 * burn)}), rgb(${Math.round(150 - 100 * burn)},${Math.round(180 - 140 * burn)},${Math.round(80 - 60 * burn)}))`,
    transformOrigin: dir < 0 ? "100% 100%" : "0 100%", transform: `rotate(${dir * 40 * op}deg)`, boxShadow: "inset 0 0 30px rgba(0,0,0,.4)" }} />;
  return <>
    {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + (i * 67) % 1320, top: 880 + (i % 4) * 30, width: 90, height: 50, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,${120 + (i % 3) * 30},40,${0.6 + 0.3 * Math.sin(tt * 1.6 + i)}), #2a0e04 70%)` }} />)}
    <div style={{ position: "absolute", left: 960 - 160, top: 300, width: 320, height: 520, transform: `rotate(-70deg) scale(${s})` }}>
      <div style={{ position: "absolute", left: 60, top: 30, width: 200, height: 480, borderRadius: 100, background: "radial-gradient(circle at 30% 30%, #ffe27a 0 6px, transparent 7px) 0 0/26px 26px, linear-gradient(90deg,#e8b830,#ffd860 50%,#d8a020)", opacity: op }} />
      {leaf(-1)}{leaf(1)}
    </div>
    <Steam tt={tt} x={960} y={420} w={420} h={300} o={op} />
    <Big tt={tt} at={3.2} x={960} y={150} txt="EN SU PROPIO VAPOR" size={84} col={AMB} />
  </>;
}}</Stage>;

// 8 · «El rescoldo es la ceniza caliente que queda debajo del fuego»: corte de tierra: arriba la ceniza gris, abajo las brasas, y las papas enterradas se ponen doradas
export const AshLayer: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#0b0e12,#1a1410)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), ash = eio(tt, 0.4, 1.8), glow = eio(tt, 1.8, 4.5);
  return <>
    <div style={pos(960, 640, `scale(${s})`, { width: 1500, height: 620, borderRadius: 30, overflow: "hidden", boxShadow: "0 40px 70px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1500, height: 200, background: "linear-gradient(180deg,#2a3a4a,#1a2430)" }} />
      <div style={{ position: "absolute", left: 0, top: 380, width: 1500, height: 240, background: `linear-gradient(180deg, rgb(${Math.round(120 + 135 * glow)},${Math.round(40 + 60 * glow)},10), #3a0e04)` }} />
      <div style={{ position: "absolute", left: 0, top: 200 + 180 * (1 - ash), width: 1500, height: 180 * ash + 4, background: "linear-gradient(180deg,#b8b4ae,#8a8580)" }} />
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 41) % 1500, top: 230 + (i * 17) % 140, width: 10, height: 10, borderRadius: "50%", background: "#6a6560", opacity: ash }} />)}
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 360 + i * 300, top: 300, width: 200, height: 140, borderRadius: "50%",
        background: `radial-gradient(ellipse at 40% 35%, rgb(${Math.round(150 + 80 * glow)},${Math.round(110 + 60 * glow)},${Math.round(70 - 30 * glow)}), rgb(${Math.round(90 - 60 * glow)},${Math.round(60 - 45 * glow)},30))`, boxShadow: `0 0 ${50 * glow}px rgba(255,150,50,.6)` }} />)}
      {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.6 + i * 0.13) % 1; return <div key={i} style={{ position: "absolute", left: 80 + i * 120, top: 600 - 220 * ph, width: 6, height: 6, borderRadius: "50%", background: "#ffb04a", opacity: (1 - ph) * glow }} />; })}
    </div>
    <Tape txt="CENIZA" x={1600} y={470} s={sp(tt, 1.0)} size={40} />
    <Tape txt="BRASAS" x={1600} y={850} s={sp(tt, 1.8)} size={40} col="#b33a2c" />
    <Big tt={tt} at={2.8} x={960} y={150} txt="EL RESCOLDO" size={110} col={AMB} />
  </>;
}}</Stage>;

// 9 · «El error es no pincharlas: el vapor no tiene por dónde salir»: la papa se infla de vapor, entra el tenedor y salen cuatro chorritos de vapor
export const Prick: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), inf = eio(tt, 0.3, 1.7) * (1 - 0.6 * eio(tt, 2.2, 3.0)), fk = eio(tt, 1.6, 1.95) * (1 - eio(tt, 2.4, 2.8)), jet = cl((tt - 2.0) * 2);
  return <>
    <Table y={820} />
    <Shadow x={960} y={820} w={560} s={s} />
    <div style={pos(960, 620, `scale(${s * (1 + 0.14 * inf)}) scaleY(${1 + 0.1 * inf})`, { width: 520, height: 330, borderRadius: "50% 48% 52% 46% / 52% 50% 50% 48%", background: "radial-gradient(ellipse at 38% 32%, #e2b67a, #a8763e 60%, #6b4422)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + (i * 61) % 360, top: 60 + (i * 47) % 200, width: 14, height: 10, borderRadius: "50%", background: "#5a3a1a", opacity: 0.6 }} />)}
    </div>
    <div style={pos(960, 330 + 200 * fk, "", { width: 120, height: 340 })}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 10 + i * 30, top: 220, width: 10, height: 120, borderRadius: "0 0 5px 5px", background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />)}
      <div style={{ position: "absolute", left: 0, top: 180, width: 120, height: 50, borderRadius: "0 0 30px 30px", background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />
      <div style={{ position: "absolute", left: 44, top: 0, width: 32, height: 190, borderRadius: 16, background: "linear-gradient(90deg,#5b3a22,#8a5a34,#4a2a14)" }} />
    </div>
    {jet > 0 && [0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 920 + i * 30, top: 380 - 220 * jet, width: 20, height: 220 * jet, borderRadius: 10, background: "linear-gradient(0deg, rgba(255,255,255,.7), transparent)", filter: "blur(6px)", opacity: 1 - eio(tt, 3.6, 5) }} />)}
    <Big tt={tt} at={2.4} x={960} y={950} txt="PÍNCHALAS" size={110} col={AMB} />
  </>;
}}</Stage>;

// 10 · «La tostaba revolviendo hasta que se ponía color café con leche»: la harina blanca se tuesta en la sartén y al lado aparecen tres muestras de color; la buena queda marcada
export const ToastChips: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), c = eio(tt, 0.3, 3.4);
  const col = `rgb(${Math.round(246 - 66 * c)},${Math.round(240 - 105 * c)},${Math.round(228 - 150 * c)})`;
  const CH: [string, string][] = [["#f4ede0", "CRUDA"], ["#e8c89a", "CASI"], ["#b4875a", "ASÍ"]];
  return <>
    <div style={pos(700, 600, `scale(${s})`, { width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2a 0 64%,#3a3a3a 66%,#111 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" })}>
      <div style={{ position: "absolute", left: 120, top: 120, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${col}, ${col} 60%, rgba(0,0,0,.2))` }} />
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: 360 + 200 * Math.cos(i * 2.4 + tt * 1.2) * ((i % 7) / 7), top: 360 + 200 * Math.sin(i * 2.4 + tt * 1.2) * ((i % 7) / 7), width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,.35)" }} />)}
      <div style={{ position: "absolute", left: 340 + 140 * Math.cos(tt * 2.2), top: 200 + 140 * Math.sin(tt * 2.2), width: 40, height: 300, borderRadius: 20, background: "linear-gradient(90deg,#8a5a34,#c79a68,#7a4a28)", transform: `rotate(${tt * 126}deg)`, transformOrigin: "50% 0" }} />
      <div style={{ position: "absolute", left: 700, top: 330, width: 340, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#2a2a2a,#0d0d0d)" }} />
    </div>
    {CH.map(([cc, n], i) => { const q = sp(tt, 0.8 + i * 0.9, 6, 0.45), on = i === 2 && tt > 3.4;
      return <div key={n} style={pos(1500, 330 + i * 230, `scale(${cl(q) * (on ? 1.12 : 1)})`, { width: 300, height: 180, borderRadius: 14, background: "#fbfaf6", boxShadow: on ? `0 0 0 8px ${AMB}, 0 20px 30px rgba(0,0,0,.5)` : "0 20px 30px rgba(0,0,0,.5)", overflow: "hidden" })}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 120, background: cc }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center", fontSize: 36, fontWeight: 900, color: "#2b2620" }}>{n}</div>
      </div>; })}
    <Big tt={tt} at={3.6} x={700} y={130} txt="CAFÉ CON LECHE" size={84} col={AMB} />
  </>;
}}</Stage>;
