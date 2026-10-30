// OBJETOS 3D de la mesa de Ruth (devolución del evaluador, 29-oct: «vector plano sobre fondo desenfocado» → todo apoya en la mesa
// con SOMBRA DE CONTACTO, volumen por luz de ventana desde arriba-izquierda y textura). Piezas compartidas por los ruth_<x>2.tsx.
import React from "react";
import { Img, staticFile } from "remotion";
import { P } from "./lib";
import { cl, eio } from "./hkit";

// sombra de contacto: elipse oscura con borde suave justo debajo de lo que apoya (k = 0 flotando lejos … 1 apoyado)
export const CShadow: React.FC<{ x: number; y: number; w: number; k?: number; o?: number }> = ({ x, y, w, k = 1, o = 0.62 }) => {
  const ww = w * (1.25 - 0.25 * k), hh = ww * 0.16;
  return <div style={{ position: "absolute", left: x - ww / 2, top: y - hh / 2, width: ww, height: hh, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${o * (0.35 + 0.65 * k)}), rgba(0,0,0,${0.25 * o * k}) 55%, transparent 72%)`, filter: `blur(${4 + 10 * (1 - k)}px)` }} />;
};

// textura de grano (papel, tierra, cuero) por feTurbulence; id único por uso
export const Grain: React.FC<{ id: string; o?: number; f?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ id, o = 0.22, f = 0.9, blend = "multiply" }) =>
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: o, mixBlendMode: blend, pointerEvents: "none" }}>
    <filter id={id}><feTurbulence type="fractalNoise" baseFrequency={f} numOctaves={3} seed={7} /><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .27  0 0 0 0 .18  0 0 0 1.4 -.35" /></filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>;

// hoja de papel APOYADA en la mesa: perspectiva, esquina levantada, luz de ventana y sombra
export const Sheet: React.FC<{ x: number; y: number; w: number; h: number; rx?: number; r?: number; s?: number; bg?: string; id: string; children?: React.ReactNode }> = ({ x, y, w, h, rx = 48, r = 0, s = 1, bg = "linear-gradient(160deg,#f6eedb,#e3d4b2)", id, children }) =>
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${rx}deg) rotate(${r}deg) scale(${s})`, transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", inset: 0, transform: "translate(18px,26px)", background: "rgba(0,0,0,.55)", filter: "blur(16px)", borderRadius: 6 }} />
    <div style={{ position: "absolute", inset: 0, background: bg, borderRadius: 4, overflow: "hidden", clipPath: "polygon(0 0,100% 0,100% 91%,95% 100%,0 100%)" }}>
      {children}
      <Grain id={id} o={0.18} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,250,235,.32), transparent 45%, rgba(0,0,0,.18))" }} />
    </div>
    {/* la esquina que se levanta */}
    <div style={{ position: "absolute", right: 0, bottom: 0, width: w * 0.05, height: h * 0.09, background: "linear-gradient(135deg,#cdbd98,#f3e9d2)", clipPath: "polygon(0 0,100% 0,0 100%)", boxShadow: "-4px -4px 10px rgba(0,0,0,.25)" }} />
  </div>;

// caja de madera / escalón 3D (CSS 3D real: frente, tapa y costado)
export const Box: React.FC<{ x: number; y: number; w: number; h: number; d: number; ry?: number; rx?: number; front: string; top: string; side: string; children?: React.ReactNode; topKids?: React.ReactNode }> = ({ x, y, w, h, d, ry = -18, rx = -14, front, top, side, children, topKids }) =>
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transformStyle: "preserve-3d", transform: `translate(-50%,-100%) perspective(2400px) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
    <div style={{ position: "absolute", inset: 0, background: front, transform: `translateZ(${d / 2}px)`, overflow: "hidden" }}>{children}</div>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: d, background: top, transformOrigin: "50% 0", transform: `translateZ(${d / 2}px) rotateX(90deg)`, overflow: "visible" }}>{topKids}</div>
    <div style={{ position: "absolute", right: 0, top: 0, width: d, height: h, background: side, transformOrigin: "100% 50%", transform: `translateZ(${d / 2}px) rotateY(90deg)` }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: d, height: h, background: side, transformOrigin: "0 50%", transform: `translateZ(${d / 2}px) rotateY(-90deg)` }} />
  </div>;

export const WOOD = "repeating-linear-gradient(180deg, rgba(0,0,0,.08) 0 2px, transparent 2px 23px), linear-gradient(180deg,#b88a56,#8a6238)";
export const WOODTOP = "repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 2px, transparent 2px 31px), linear-gradient(180deg,#d8ab72,#b98a52)";
export const WOODSIDE = "linear-gradient(90deg,#6a4626,#4a2f18)";

// moneda con canto (disco 3D por capas)
export const Coin: React.FC<{ x: number; y: number; s?: number; r?: number; tilt?: number; o?: number }> = ({ x, y, s = 1, r = 0, tilt = 62, o = 1 }) =>
  <div style={{ position: "absolute", left: x, top: y, width: 110 * s, height: 110 * s, transform: `translate(-50%,-50%) rotate(${r}deg) rotateX(${tilt}deg)`, opacity: cl(o) }}>
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#8a6a22", transform: `translateY(${i * 2.2 * s}px)` }} />)}
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff1b8, #e0b84a 45%, #a07a20)", boxShadow: `inset 0 0 0 ${6 * s}px rgba(120,90,20,.45)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 54 * s, color: "rgba(110,80,10,.7)" }}>$</div>
  </div>;

// hormiga 3D vista en 3/4 (volumen por gradientes y brillo especular)
export const Ant3: React.FC<{ x: number; y: number; s?: number; r?: number; tt?: number; o?: number; col?: string }> = ({ x, y, s = 1, r = 0, tt = 0, o = 1, col = "#a3301a" }) => {
  const w = Math.sin(tt * 18) * 8, id = "a3" + Math.round(x) + "_" + Math.round(y);
  return <svg width={240} height={180} viewBox="-120 -90 240 180" style={{ position: "absolute", left: x - 120, top: y - 90, transform: `rotate(${r}deg) scale(${s})`, opacity: o, overflow: "visible" }}>
    <defs><radialGradient id={id} cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#ff9a7a" /><stop offset=".35" stopColor={col} /><stop offset="1" stopColor="#3a0c04" /></radialGradient></defs>
    <ellipse cx={0} cy={58} rx={100} ry={12} fill="rgba(0,0,0,.35)" />
    {[-1, 1].map((sd) => [-26, 0, 26].map((xx, i) => <path key={sd + "" + i} d={`M${xx} 8 L${xx + sd * 4 + (i % 2 ? w : -w)} ${30} L${xx + sd * 10 + (i % 2 ? w : -w) * 1.4} ${56}`} stroke="#2a0a04" strokeWidth={4} fill="none" strokeLinecap="round" />))}
    <ellipse cx={58} cy={0} rx={38} ry={30} fill={`url(#${id})`} /><ellipse cx={4} cy={6} rx={24} ry={16} fill={`url(#${id})`} /><ellipse cx={-50} cy={0} rx={30} ry={26} fill={`url(#${id})`} />
    <path d="M-72 -14 Q-96 -48 -110 -40 M-70 -6 Q-104 -24 -116 -12" stroke="#2a0a04" strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <ellipse cx={68} cy={-12} rx={10} ry={5} fill="rgba(255,255,255,.45)" /><ellipse cx={-44} cy={-10} rx={8} ry={4} fill="rgba(255,255,255,.4)" />
  </svg>;
};

// montículo de tierra con volumen, terrones y agujero de salida
export const Mound: React.FC<{ x: number; y: number; w: number; sx?: number; sy?: number; o?: number; id: string }> = ({ x, y, w, sx = 1, sy = 1, o = 1, id }) =>
  <svg width={w} height={w * 0.6} viewBox="0 0 400 240" style={{ position: "absolute", left: x - w / 2, top: y - w * 0.6, transform: `scale(${sx},${sy})`, transformOrigin: "50% 100%", opacity: o, overflow: "visible" }}>
    <defs><radialGradient id={id} cx="40%" cy="25%" r="80%"><stop offset="0" stopColor="#b98a58" /><stop offset=".5" stopColor="#7a5230" /><stop offset="1" stopColor="#3a2412" /></radialGradient>
      <filter id={id + "f"}><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves={3} seed={3} /><feDisplacementMap in="SourceGraphic" scale={14} /></filter></defs>
    <ellipse cx={200} cy={232} rx={200} ry={16} fill="rgba(0,0,0,.45)" />
    <path d="M10 230 Q60 120 150 70 Q200 40 250 70 Q340 120 390 230 Z" fill={`url(#${id})`} filter={`url(#${id}f)`} />
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={60 + (i * 53) % 290} cy={120 + (i * 37) % 100} r={5 + (i % 4) * 3} fill={i % 2 ? "#5a3a1e" : "#a07448"} />)}
    <ellipse cx={210} cy={74} rx={16} ry={8} fill="#1a0e06" />
  </svg>;

// bota de trabajo de cuero, de perfil
export const Boot: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) =>
  <svg width={420} height={420} viewBox="0 0 420 420" style={{ position: "absolute", left: x - 210, top: y - 380, transform: `rotate(${r}deg) scale(${s})`, transformOrigin: "50% 90%", overflow: "visible" }}>
    <defs><linearGradient id="bootg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8a5a30" /><stop offset=".6" stopColor="#5a361a" /><stop offset="1" stopColor="#2a160a" /></linearGradient></defs>
    <path d="M120 20 L250 20 L262 250 Q360 262 400 320 L400 360 L60 360 L60 300 Q100 260 118 230 Z" fill="url(#bootg)" stroke="#1a0c04" strokeWidth={5} />
    <rect x={56} y={352} width={348} height={34} rx={8} fill="#1e140c" />
    {[70, 110, 150, 190].map((yy) => <path key={yy} d={`M150 ${yy} L232 ${yy + 14}`} stroke="#e0c898" strokeWidth={5} />)}
    <path d="M130 30 L240 30" stroke="rgba(255,220,170,.35)" strokeWidth={8} />
  </svg>;
// mano, odómetro y salpicadura (venían de ruth_d3; compartidos por toda la tanda)
export const Mano: React.FC<{ x: number; y: number; s?: number; r?: number; skin?: string; sleeve?: string; glove?: boolean; wrist?: React.ReactNode; children?: React.ReactNode }> = ({ x, y, s = 1, r = 0, skin = "#d8a27a", sleeve = "#4a5a6a", glove, wrist, children }) => {
  const sk = glove ? "#c88a3a" : skin, dk = glove ? "#7a4a1a" : "#a8704a";
  return <svg width={560} height={560} viewBox="0 0 560 560" style={{ position: "absolute", left: x - 60, top: y - 60, transform: `rotate(${r}deg) scale(${s})`, transformOrigin: "60px 60px", overflow: "visible", filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.45))" }}>
    <defs><linearGradient id={"mn" + (glove ? "g" : "s")} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={sk} /><stop offset="1" stopColor={dk} /></linearGradient></defs>
    <path d="M300 300 L620 620" stroke={sleeve} strokeWidth={170} strokeLinecap="round" /><path d="M290 290 L340 340" stroke="rgba(255,255,255,.12)" strokeWidth={170} />
    <ellipse cx={250} cy={235} rx={92} ry={104} transform="rotate(-45 250 235)" fill={`url(#mn${glove ? "g" : "s"})`} />
    {[[188, 150, 64, 62], [204, 172, 84, 104], [222, 196, 112, 140], [240, 222, 146, 170]].map(([a, b, c, d], k) => <path key={k} d={`M${a} ${b} L${c} ${d}`} stroke={`url(#mn${glove ? "g" : "s"})`} strokeWidth={36 - k * 3} strokeLinecap="round" />)}
    {[[188, 150, 64, 62], [204, 172, 84, 104], [222, 196, 112, 140], [240, 222, 146, 170]].map(([a, b, c, d], k) => <path key={"l" + k} d={`M${(a + c) / 2 - 4} ${(b + d) / 2 - 10} l10 -8`} stroke={dk} strokeWidth={3} />)}
    <path d="M262 150 Q200 70 132 46" stroke={`url(#mn${glove ? "g" : "s"})`} strokeWidth={40} strokeLinecap="round" fill="none" />
    {glove && <path d="M290 300 L340 250" stroke="#5a3410" strokeWidth={30} />}{wrist && <g transform="translate(300 300) rotate(45)">{wrist}</g>}
    <g transform="translate(60 60)">{children}</g>
  </svg>;
};
// odómetro de latón: rodillos que giran hasta v (float)
export const Odo: React.FC<{ x: number; y: number; v: number; n?: number; size?: number; lead?: boolean; sep?: boolean }> = ({ x, y, v, n = 3, size = 120, lead = true, sep = false }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", gap: 8, padding: 16, background: "linear-gradient(120deg,#6a4a1a,#e8c870 45%,#8a6a2a)", borderRadius: 14, boxShadow: "0 22px 30px rgba(0,0,0,.55), inset 0 2px 0 rgba(255,255,255,.4)" }}>
    {Array.from({ length: n }, (_, k) => { const p = Math.pow(10, n - 1 - k), d = (v / p) % 10, fl = Math.floor(d), low = v % p, fr = k === n - 1 ? d - fl : low >= p - 1 ? low - (p - 1) : 0;
      const blank = !lead && k < n - 1 && v < p, cm = sep && k < n - 1 && (n - 1 - k) % 3 === 0 && !blank;
      return <React.Fragment key={k}><div style={{ width: size * 0.66, height: size, overflow: "hidden", position: "relative", background: "linear-gradient(#1a1410,#3a2e24 50%,#1a1410)", borderRadius: 6, opacity: blank ? 0.35 : 1 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -(fl + fr) * size, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: size * 0.8, color: "#f3ead6", textAlign: "center", lineHeight: `${size}px` }}>{blank ? null : Array.from({ length: 11 }, (_, j) => <div key={j}>{j % 10}</div>)}</div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,.6),transparent 30%,transparent 70%,rgba(0,0,0,.6))" }} /></div>{cm && <div style={{ alignSelf: "flex-end", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: size * 0.6, color: "#2a1a08", lineHeight: 1 }}>,</div>}</React.Fragment>; })}
  </div>;
// gotas de salpicadura: corona que sube y cae
export const Splash: React.FC<{ x: number; y: number; p: number; col?: string; s?: number }> = ({ x, y, p, col = "rgba(210,235,240,.9)", s = 1 }) => p <= 0 || p >= 1 ? null : <>
  <div style={{ position: "absolute", left: x - 90 * s * (0.4 + p), top: y - 20 * s * (0.4 + p), width: 180 * s * (0.4 + p), height: 40 * s * (0.4 + p), borderRadius: "50%", border: `${5 * s}px solid ${col}`, opacity: 1 - p }} />
  {Array.from({ length: 9 }, (_, k) => { const a = -Math.PI * (0.15 + 0.7 * k / 8), v = 260 * s * (0.7 + ((Math.sin(k * 12.9898) * 43758.5453) % 1 + 1) % 1 * 0.5); return <div key={k} style={{ position: "absolute", left: x + Math.cos(a) * v * p, top: y + Math.sin(a) * v * p + 600 * s * p * p, width: 16 * s, height: 16 * s, borderRadius: "50%", background: col, opacity: 1 - p }} />; })}
</>;
// nube de polvo/humo y sello de goma real (mango que baja, aplasta y deja tinta irregular)
export const Puff: React.FC<{ x: number; y: number; r: number; col?: string; o?: number }> = ({ x, y, r, col = "rgba(240,236,220,.85)", o = 1 }) =>
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${col}, transparent 70%)`, opacity: o }} />;
// sello de goma de verdad: el mango baja, aplasta, deja tinta de borde irregular y sube
export const Sello: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; r?: number; col?: string }> = ({ tt, at, x, y, txt, size = 110, r = -10, col = "#b3322a" }) => {
  const dn = eio(tt, at - 0.35, at), up = eio(tt, at + 0.25, at + 0.7), sq = tt > at && tt < at + 0.25 ? Math.sin((tt - at) / 0.25 * Math.PI) : 0, ink = tt > at;
  return <>
    {ink && <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${1 + 0.06 * (1 - cl((tt - at) * 4))})`, padding: `${size * 0.1}px ${size * 0.35}px`, border: `${size * 0.09}px solid ${col}`, borderRadius: size * 0.12, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: size, lineHeight: 1, color: col, mixBlendMode: "multiply", opacity: 0.92, filter: "url(#selloRuido)", whiteSpace: "nowrap" }}>{txt}</div>}
    <svg width={0} height={0} style={{ position: "absolute" }}><filter id="selloRuido"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves={2} seed={4} /><feDisplacementMap in="SourceGraphic" scale={7} /></filter></svg>
    {up < 1 && tt > at - 0.4 && <div style={{ position: "absolute", left: x, top: y - 700 * (1 - dn) - 700 * up, transform: `translate(-50%,-100%) rotate(${r}deg) scale(${1 + 0.08 * sq},${1 - 0.12 * sq})`, transformOrigin: "50% 100%", filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.5))" }}>
      <div style={{ width: 120, height: 170, margin: "0 auto", borderRadius: "60px 60px 20px 20px", background: "radial-gradient(circle at 35% 30%,#a8743e,#5a3418 70%)" }} />
      <div style={{ width: 70, height: 60, margin: "0 auto", background: "linear-gradient(90deg,#3a3e42,#a8acb0,#3a3e42)" }} />
      <div style={{ width: size * 3.4, height: 70, borderRadius: 10, background: "linear-gradient(#7a4a26,#3a2410)", boxShadow: "inset 0 -14px 0 #1a0c04" }} /></div>}
  </>;
};
// objeto foto-realista recortado (agnes + rembg → public/img/<slug>/cut/<id>.webp): w = ancho en px, (x,y) = base-centro del objeto
// sombra de contacto debajo + sombra proyectada; sq = aplaste (-1..1) para golpes; ry = giro en Y (perspectiva)
export const Prop: React.FC<{ id: string; x: number; y: number; w: number; r?: number; o?: number; flip?: boolean; sq?: number; ry?: number; sh?: number; blur?: number; style?: React.CSSProperties }> = ({ id, x, y, w, r = 0, o = 1, flip, sq = 0, ry = 0, sh = 1, blur = 0, style }) => <>
  {sh > 0 && <div style={{ position: "absolute", left: x - w * 0.42, top: y - w * 0.04, width: w * 0.84, height: w * 0.08, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,0,0,${0.55 * sh * o}), transparent 70%)`, filter: "blur(4px)" }} />}
  <Img src={staticFile("img/" + P + "cut/" + id + ".webp")} style={{ position: "absolute", left: x - w / 2, bottom: 1080 - y, width: w, opacity: o, transformOrigin: "50% 100%", transform: `${ry ? `perspective(1400px) rotateY(${ry}deg) ` : ""}rotate(${r}deg) scale(${(flip ? -1 : 1) * (1 + 0.12 * sq)},${1 - 0.12 * sq})`, filter: `drop-shadow(${14 * sh}px ${22 * sh}px ${16 * sh}px rgba(0,0,0,${0.45 * sh}))${blur ? ` blur(${blur}px)` : ""}`, ...style }} />
</>;
