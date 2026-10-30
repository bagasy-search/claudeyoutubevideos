// ruth29c · 2ª vuelta (29-oct, misma vara que ruth_b2/b3): 2ª mitad del video rehecha como OBJETOS 3D sobre la mesa de Ruth
// (sombra de contacto, volumen, textura), una idea por pieza, texto grande y DENTRO de la escena. Helpers compartidos con ruth_c2.
import React from "react";
import { H, Mode, Stage, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK, STAMP } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, WOOD, WOODTOP, WOODSIDE } from "./obj";

export const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode; bg?: string }> = ({ t, h, f, bg }) => <Stage t={t} h={h} bg={bg} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
export const D = (h: H) => Math.max(4, h.out - h.at);
export const fall = (tt: number, at: number) => { const s = pop(tt, at, 9, 0.38); return { s, y: (1 - s) * -520, k: cl(s) }; };
export const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
export const COT = "#f7f3ea";
export const Puff: React.FC<{ x: number; y: number; r: number; col?: string; o?: number }> = ({ x, y, r, col = "rgba(240,240,232,.9)", o = 1 }) =>
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 42% 36%, ${col}, transparent 68%)`, opacity: cl(o), filter: `blur(${r * 0.12}px)` }} />;
// etiqueta de papel madera colgada de un hilo, con texto escrito a mano
export const Tag: React.FC<{ x: number; y: number; txt: string; s?: number; size?: number; r?: number; tt?: number }> = ({ x, y, txt, s = 1, size = 66, r = 0, tt = 0 }) => s <= 0.01 ? null :
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) rotate(${r + 3 * Math.sin(tt * 2 + x)}deg) scale(${s})`, transformOrigin: "50% 0" }}>
    <div style={{ width: 3, height: 44, margin: "0 auto", background: "#8a7a5a" }} />
    <div style={{ position: "relative", padding: "12px 34px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: size, color: INK, boxShadow: "0 16px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap", clipPath: "polygon(8% 0,92% 0,100% 20%,100% 100%,0 100%,0 20%)" }}>{txt}</div>
  </div>;
// gorgojo 3D (3/4, élitros con brillo, hocico largo); wing = 0..1 abre las alas
export const Weevil3: React.FC<{ x: number; y: number; s?: number; r?: number; tt?: number; o?: number; wing?: number; flip?: boolean }> = ({ x, y, s = 1, r = 0, tt = 0, o = 1, wing = 0, flip }) => {
  const w = Math.sin(tt * 16) * 7, id = "wv" + Math.round(x) + "_" + Math.round(y);
  return <svg width={240} height={180} viewBox="-120 -90 240 180" style={{ position: "absolute", left: x - 120, top: y - 90, transform: `rotate(${r}deg) scale(${flip ? -s : s},${s})`, opacity: o, overflow: "visible" }}>
    <defs><radialGradient id={id} cx="38%" cy="28%" r="75%"><stop offset="0" stopColor="#c8a878" /><stop offset=".4" stopColor="#7a5a36" /><stop offset="1" stopColor="#2a1a0c" /></radialGradient></defs>
    <ellipse cx={0} cy={54} rx={90} ry={11} fill="rgba(0,0,0,.35)" />
    {[-1, 1].map((sd) => [-24, 0, 24].map((xx, i) => <path key={sd + "" + i} d={`M${xx} 10 L${xx + sd * 6 + (i % 2 ? w : -w)} 32 L${xx + sd * 12 + (i % 2 ? w : -w) * 1.3} 52`} stroke="#2a1a0c" strokeWidth={4.5} fill="none" strokeLinecap="round" />))}
    {wing > 0 && [-1, 1].map((sd) => <ellipse key={sd} cx={-10} cy={-18} rx={70 * wing} ry={22} fill="rgba(230,235,240,.45)" stroke="rgba(255,255,255,.6)" transform={`rotate(${sd * (30 + 14 * Math.sin(tt * 60))} 0 -10)`} />)}
    <ellipse cx={-14} cy={0} rx={52} ry={34} fill={`url(#${id})`} /><path d="M-62 -2 L36 -2" stroke="rgba(0,0,0,.35)" strokeWidth={2} />
    <ellipse cx={46} cy={-4} rx={20} ry={18} fill={`url(#${id})`} /><path d="M58 -2 Q90 6 104 30" stroke="#5a3e22" strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M76 6 l6 -18 M84 12 l10 -14" stroke="#2a1a0c" strokeWidth={3} /><circle cx={52} cy={-10} r={3.5} fill="#0a0604" />
    <ellipse cx={-26} cy={-16} rx={20} ry={7} fill="rgba(255,240,210,.35)" />{Array.from({ length: 10 }, (_, k) => <circle key={k} cx={-50 + k * 9} cy={-4 + (k % 3) * 8} r={2} fill="rgba(0,0,0,.25)" />)}
  </svg>;
};
// mota de algodón 3D (5 lóbulos de algodón con volumen sobre el cáliz)
export const Boll3: React.FC<{ x: number; y: number; s?: number; open?: number; o?: number; id: string }> = ({ x, y, s = 1, open = 1, o = 1, id }) =>
  <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ position: "absolute", left: x - 100, top: y - 100, transform: `scale(${s})`, opacity: o, overflow: "visible" }}>
    <defs><radialGradient id={id} cx="38%" cy="30%" r="70%"><stop offset="0" stopColor="#ffffff" /><stop offset=".6" stopColor="#f1ebdc" /><stop offset="1" stopColor="#c8bca4" /></radialGradient></defs>
    {[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0 0 L-26 -76 Q0 -90 26 -76 Z" fill="#5a3a1e" stroke="#3a240e" strokeWidth={3} transform={`rotate(${a + 36})`} />)}
    {[0, 72, 144, 216, 288].map((a) => <circle key={"c" + a} cx={40 * open * Math.cos((a - 90) / 57.3)} cy={40 * open * Math.sin((a - 90) / 57.3)} r={20 + 22 * open} fill={`url(#${id})`} />)}
  </svg>;

// m19-20 · la ficha del elemento: una baldosa de cerámica «As 33» cae en la tierra; la tapan capas de hojas, nieve y barro; la pala la destapa y sigue intacta
export const HElementTile: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const f = fall(tt, 0.4), L = [["#8a6a3a", 2.2], ["#e8eef4", 3.6], ["#4a3220", 5]] as [string, number][], dig = eio(tt, 7, 8.6), yr = Math.round(1920 + 100 * eio(tt, 1.6, 6.8));
  return <>
    <CShadow x={960} y={940} w={1500} />
    <Box x={960} y={950} w={1400} h={220} d={360} rx={-24} ry={0} front="linear-gradient(#5a3e24,#2a1c10)" top="linear-gradient(#6a4a2c,#4a3220)" side="#2a1c10" />
    <div style={{ position: "absolute", left: 960, top: 690 + f.y, transform: "translate(-50%,-50%) perspective(1200px) rotateX(48deg)", width: 340, height: 340, borderRadius: 18, background: "linear-gradient(150deg,#fbf7ee,#e4dccb)", boxShadow: "0 20px 0 #b8ae98, 0 40px 40px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: INK }}>
      <div style={{ position: "absolute", left: 24, top: 14, fontFamily: FONT, fontWeight: 900, fontSize: 44 }}>33</div>
      <div style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 170, lineHeight: 1 }}>As</div><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40 }}>arsenic</div></div>
    {L.map(([c, a], i) => { const cov = eio(tt, a, a + 1) * (1 - dig); if (cov <= 0) return null;
      return <div key={i} style={{ position: "absolute", left: 960, top: 700 - i * 12, transform: "translate(-50%,-50%) perspective(1200px) rotateX(48deg)", width: 480 + i * 40, height: 420 + i * 30, borderRadius: "48% 52% 46% 54%", opacity: cov, background: i === 0 ? `radial-gradient(circle at 30% 30%, #b8863a 0 18%, transparent 19%), radial-gradient(circle at 70% 60%, #a8562a 0 16%, transparent 17%), radial-gradient(circle at 50% 40%, #c89a4a 0 20%, transparent 21%), ${c}` : c, boxShadow: "inset 0 -10px 20px rgba(0,0,0,.35)" }}>{i === 2 && <Grain id="etg" o={0.5} f={1} />}</div>; })}
    {dig > 0 && <svg width={300} height={600} viewBox="0 0 300 600" style={{ position: "absolute", left: 1100 - 200 * dig, top: 200 + 120 * Math.sin(dig * Math.PI), transform: `rotate(${-30 + 40 * dig}deg)`, filter: "drop-shadow(14px 22px 16px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id="ets" x1="0" x2="1"><stop offset="0" stopColor="#6a7278" /><stop offset=".5" stopColor="#d8e0e6" /><stop offset="1" stopColor="#5a6268" /></linearGradient></defs>
      <rect x={136} y={0} width={28} height={380} fill="#8a6238" /><rect x={110} y={0} width={80} height={30} rx={14} fill="#6a4626" /><path d="M70 380 L230 380 L220 520 Q150 600 80 520 Z" fill="url(#ets)" /></svg>}
    <div style={{ position: "absolute", left: 1560, top: 520, transform: "translate(-50%,-50%) rotate(5deg)", padding: "10px 30px", background: "#1e2a24", border: "10px solid #6a4a2c", fontFamily: MARK, fontSize: 92, color: "#f3f0e6", boxShadow: "0 18px 26px rgba(0,0,0,.5)", opacity: cl((tt - 1.4) * 2) }}>{yr}</div>
  </>;
}} />;

// m20 · el kit de suelo: entre casitas de un barrio nuevo, el tubo de ensayo con tierra del jardín; cae la gota y el líquido se pone rojo
export const HSoilTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const drop = eio(tt, 1.6, 2.4), col = eio(tt, 2.4, 3.6), tag = pop(tt, 3.8, 7, 0.5);
  const house = (x: number, y: number, s: number, c: string, k: number) => <div key={k} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%", filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.45))" }}>
    <svg width={220} height={200} viewBox="0 0 220 200"><path d="M10 90 L110 10 L210 90 Z" fill="#6a3a2a" /><rect x={30} y={88} width={160} height={110} fill={c} /><rect x={90} y={130} width={40} height={68} fill="#4a3220" /><rect x={44} y={110} width={34} height={30} fill="#cfe0e8" /><rect x={142} y={110} width={34} height={30} fill="#cfe0e8" /></svg></div>;
  return <>
    {[[300, 760, 1, "#e8dcc0"], [560, 720, 0.8, "#c8d8e0"], [1420, 720, 0.8, "#e0c8b0"], [1680, 770, 1, "#d8e0c8"]].map(([x, y, s, c], k) => house(x as number, y as number, s as number, c as string, k))}
    <CShadow x={960} y={900} w={300} />
    <div style={{ position: "absolute", left: 960, top: 900, transform: "translate(-50%,-100%)", width: 130, height: 600 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 560, borderRadius: "0 0 65px 65px", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: "linear-gradient(#5a3e24,#3a2614)" }}><Grain id="stg" o={0.6} f={1.2} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 200, height: 220, background: `linear-gradient(rgba(${200 + 30 * col},${210 - 150 * col},${190 - 160 * col},.85), rgba(${180 + 40 * col},${190 - 150 * col},${170 - 150 * col},.9))` }} /></div>
      <div style={{ position: "absolute", inset: 0, top: 40, borderRadius: "0 0 65px 65px", border: "6px solid rgba(230,240,245,.75)", borderTop: "none", background: "linear-gradient(90deg, rgba(255,255,255,.35), rgba(255,255,255,.05) 35%, rgba(255,255,255,.04) 70%, rgba(255,255,255,.3))" }} />
      <div style={{ position: "absolute", left: -12, right: -12, top: 30, height: 24, borderRadius: 12, border: "6px solid rgba(230,240,245,.8)" }} /></div>
    <svg width={160} height={340} viewBox="0 0 160 340" style={{ position: "absolute", left: 900, top: 20, filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.4))" }}><rect x={50} y={0} width={60} height={90} rx={20} fill="#2a2a2a" /><path d="M60 90 L100 90 L90 300 L70 300 Z" fill="rgba(230,240,245,.7)" stroke="rgba(255,255,255,.8)" strokeWidth={3} /></svg>
    {drop > 0 && drop < 1 && <div style={{ position: "absolute", left: 960 - 12, top: 320 + drop * 240, width: 24, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#c8202a" }} />}
    <Tag x={1240} y={420} txt="backyard soil" s={tag} tt={tt} />
  </>;
}} />;

// m21 · la cadena de pagarés: el algodón falló, pero cada vale nuevo se engrapa al anterior y la tira cuelga por el borde de la mesa hasta el piso
export const HLedgerDebt: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 9, n = Array.from({ length: N }, (_, i) => pop(tt, 0.6 + i * 0.75, 8, 0.5)), tag = pop(tt, 1.2, 7, 0.5);
  const lbl = ["seed", "mule", "flour", "rent", "shoes", "doctor", "seed", "rent", "interest"];
  return <>
    <CShadow x={760} y={700} w={1300} o={0.5} />
    <Box x={760} y={700} w={1300} h={60} d={280} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <Boll3 x={420} y={600} s={0.7} open={0.35} o={0.85} id="ldb" />
    <div style={{ position: "absolute", left: 300, top: 640, fontFamily: HAND, fontSize: 56, color: "#e8d8b8", textShadow: "0 4px 10px #000" }}>crop failed</div>
    {n.map((s, i) => { if (s <= 0.01) return null; const onTable = i < 3, x = onTable ? 720 + i * 190 : 1380, y = onTable ? 620 : 620 + (i - 2) * 66, r = onTable ? -4 + i * 3 : (i % 2 ? 3 : -3) + 2 * Math.sin(tt * 1.5 + i);
      return <div key={i} style={{ position: "absolute", left: x, top: y - (1 - cl(s)) * 300, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s})`, width: 230, height: 120, padding: "10px 14px", boxSizing: "border-box", background: "linear-gradient(160deg,#fbf3dc,#e6d6ae)", boxShadow: "0 12px 18px rgba(0,0,0,.45)", fontFamily: HAND, color: INK }}>
        <div style={{ fontSize: 34, color: STAMP, fontWeight: 900, fontFamily: FONT }}>I OWE</div><div style={{ fontSize: 46, lineHeight: 1 }}>{lbl[i]}</div>
        <div style={{ position: "absolute", left: 100, top: -8, width: 30, height: 14, border: "4px solid #9aa0a6", borderBottom: "none" }} /></div>; })}
    <Tag x={1700} y={300} txt="still owe" s={pop(tt, 6.4, 7, 0.5)} size={80} tt={tt} />
    {tag > 0 && null}
  </>;
}} />;

// m22 · las etiquetas de valija: se abre la valija de cartón y salen volando etiquetas de equipaje, una por ciudad, que caen en fila sobre la mesa
export const HMigrationArrows: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const op = eio(tt, 0.6, 1.6), C = ["CHICAGO", "DETROIT", "NEW YORK", "PHILADELPHIA", "LOS ANGELES"];
  return <>
    <CShadow x={500} y={940} w={720} />
    <Box x={500} y={940} w={640} h={260} d={260} rx={-20} ry={18} front="linear-gradient(#8a5a32,#5a3a1e)" top="linear-gradient(#a06a3a,#7a4a26)" side="#4a2e16">
      {[120, 520].map((x) => <div key={x} style={{ position: "absolute", left: x - 20, top: 0, width: 40, height: 260, background: "#3a2612" }} />)}
      <div style={{ position: "absolute", left: 270, top: 30, width: 100, height: 40, background: "linear-gradient(#e0c070,#9a7a2a)", borderRadius: 6 }} /></Box>
    <div style={{ position: "absolute", left: 500 - 320, top: 680, width: 640, height: 240, transformOrigin: "50% 100%", transform: `perspective(1400px) rotateX(${op * 100}deg)`, background: "linear-gradient(#a06a3a,#6a4222)", border: "6px solid #3a2612", borderRadius: 8 }} />
    {C.map((c, i) => { const a = 1.4 + i * 1.1, u = eio(tt, a, a + 1); if (tt < a) return null; const x = 500 + (1000 + (i % 3) * 120 - 500) * u, y = 700 - Math.sin(u * Math.PI) * 420 + (u >= 1 ? 0 : 0) + (-260 + i * 140) * u;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-20px,-50%) rotate(${(1 - u) * 160 - 6 + i * 3}deg) scale(${0.4 + 0.6 * u})`, transformOrigin: "20px 50%", filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.45))" }}>
        <div style={{ position: "relative", padding: "14px 40px 14px 70px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", clipPath: "polygon(0 50%,12% 0,100% 0,100% 100%,12% 100%)", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: INK, whiteSpace: "nowrap" }}>
          <div style={{ position: "absolute", left: 30, top: "50%", width: 22, height: 22, marginTop: -11, borderRadius: "50%", background: "#3a2612" }} />{c}</div></div>; })}
  </>;
}} />;

// m22-23 · la soga de las razones: cinco hebras gruesas trenzadas (violencia, salarios, inundaciones, máquinas…) y una hebrita finita, la del gorgojo
export const HReasonBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [["violence", "#8a2a1a", 46], ["low pay", "#6a5a3a", 42], ["floods", "#3a5a7a", 40], ["machines", "#5a5e62", 40], ["the weevil", "#c8a87a", 10]] as [string, string, number][];
  const tw = eio(tt, 0.4, 3), sep = eio(tt, 4, 5.4);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>{R.map(([, c], i) => <linearGradient key={i} id={"rb" + i} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.35} /><stop offset=".4" stopColor={c} /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></linearGradient>)}</defs>
      <ellipse cx={960} cy={740} rx={760} ry={30} fill="rgba(0,0,0,.4)" />
      {R.map(([, c], i) => { const off = (i - 2) * 22, spread = sep * (i - 2) * 70;
        const pts = Array.from({ length: 60 }, (_, k) => { const x = 160 + k * 27 * tw, ph = k * 0.5 + i * 1.256; return `${x},${600 + off * 0 + Math.sin(ph) * 30 + (k > 40 ? spread * (k - 40) / 20 : 0)}`; }).join(" ");
        return <polyline key={i} points={pts} fill="none" stroke={`url(#rb${i})`} strokeWidth={R[i][2]} strokeLinecap="round" strokeLinejoin="round" />; })}
    </svg>
    {R.map(([n], i) => { const s = pop(tt, 4.6 + i * 0.35, 7, 0.5); return <Tag key={i} x={1580 + (i % 2) * 40} y={600 + (i - 2) * 70 + 30} txt={n} s={s} size={i === 4 ? 70 : 54} tt={tt} r={i === 4 ? -4 : 2} />; })}
  </>;
}} />;

// m23 · el gramófono: el brazo baja, el disco de pasta negra gira con su etiqueta y la bocina dorada respira con la música
export const HRecord78: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const arm = eio(tt, 0.8, 1.8), spin = tt * 280, hb = 1 + 0.03 * Math.sin(tt * 8) * arm;
  return <>
    <CShadow x={800} y={930} w={1100} />
    <Box x={800} y={930} w={900} h={190} d={600} rx={-30} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <div style={{ position: "absolute", left: 760, top: 650, width: 640, height: 640, transform: "translate(-50%,-50%) perspective(1400px) rotateX(62deg)", borderRadius: "50%", background: `repeating-radial-gradient(circle, #141414 0 3px, #222 3px 5px)`, boxShadow: "0 22px 0 #0a0a0a, 0 40px 40px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${spin}deg, rgba(255,255,255,.0), rgba(255,255,255,.18) 20deg, rgba(255,255,255,0) 50deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,.14) 200deg, rgba(255,255,255,0) 230deg)` }} />
      <div style={{ position: "absolute", left: 200, top: 200, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(#e8c060,#b8862a)", transform: `rotate(${spin}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", color: "#3a1a0a", textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>BOLL WEEVIL</div><div style={{ fontSize: 26, fontWeight: 900 }}>BLUES</div><div style={{ fontSize: 20 }}>78 rpm</div></div></div>
    <svg width={500} height={300} viewBox="0 0 500 300" style={{ position: "absolute", left: 980, top: 460, filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><circle cx={400} cy={60} r={36} fill="#9aa0a6" /><path d={`M400 60 L${400 - 260 * Math.cos(0.5 - 0.35 * arm)} ${60 + 260 * Math.sin(0.5 - 0.35 * arm) + 40 * arm}`} stroke="#c8ccd0" strokeWidth={14} strokeLinecap="round" /></svg>
    <svg width={760} height={760} viewBox="0 0 760 760" style={{ position: "absolute", left: 1080, top: 60, transform: `scale(${hb})`, transformOrigin: "20% 90%", filter: "drop-shadow(20px 30px 24px rgba(0,0,0,.55))" }}>
      <defs><radialGradient id="r78h" cx="70%" cy="30%" r="80%"><stop offset="0" stopColor="#ffe8a0" /><stop offset=".5" stopColor="#c8902a" /><stop offset="1" stopColor="#5a3a0a" /></radialGradient></defs>
      <path d="M120 700 Q180 560 260 470 Q380 220 700 60 Q760 260 640 420 Q460 560 300 560 Q200 600 140 720 Z" fill="url(#r78h)" /><path d="M120 700 L60 760 L100 760 L160 700" fill="#5a3a0a" />
      {arm > 0.5 && [0, 1, 2].map((k) => { const ph = (tt * 0.5 + k / 3) % 1; return <text key={k} x={560 + ph * 140} y={180 - ph * 160} fontSize={70} fill="#f3e6c6" opacity={1 - ph}>♪</text>; })}</svg>
  </>;
}} />;

// m24 · los tanques de mochila: cada temporada se apoyan más fumigadoras de chapa en el estante, fila tras fila
export const HSprayCount: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [[1950, 1], [1955, 3], [1960, 6], [1965, 10]] as [number, number][];
  return <>
    {Y.map(([yr, n], r) => { const y = 340 + r * 200, a = 0.4 + r * 1.5;
      return <React.Fragment key={r}>
        <Box x={1000} y={y + 20} w={1500} h={26} d={180} rx={-24} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
        <div style={{ position: "absolute", left: 180, top: y - 70, fontFamily: MARK, fontSize: 72, color: "#f3e6c6", opacity: cl((tt - a) * 3), textShadow: "0 6px 14px #000" }}>{yr}</div>
        {Array.from({ length: n }, (_, k) => { const s = pop(tt, a + k * 0.09, 10, 0.4); if (s <= 0.01) return null;
          return <svg key={k} width={110} height={170} viewBox="0 0 110 170" style={{ position: "absolute", left: 420 + k * 115, top: y - 160 - (1 - cl(s)) * 200, filter: "drop-shadow(8px 12px 8px rgba(0,0,0,.45))" }}>
            <defs><linearGradient id={`sc${r}_${k}`} x1="0" x2="1"><stop offset="0" stopColor="#6a7a5a" /><stop offset=".45" stopColor="#c8d4b4" /><stop offset="1" stopColor="#4a5a3a" /></linearGradient></defs>
            <rect x={14} y={30} width={82} height={136} rx={30} fill={`url(#sc${r}_${k})`} /><rect x={44} y={4} width={22} height={30} fill="#3a3a3a" /><path d="M66 18 Q110 20 104 70 L96 150" stroke="#2a2a2a" strokeWidth={6} fill="none" />
            <path d="M40 80 L70 80 M55 66 L55 96" stroke={STAMP} strokeWidth={6} /></svg>; })}
      </React.Fragment>; })}
  </>;
}} />;

// m24-25 · el colador: se rocía la nube sobre los gorgojos en la malla; casi todos quedan patas arriba, tres siguen caminando… y de ellos sale la camada siguiente
export const HResistSieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const spray = eio(tt, 1.4, 2.6), dead = eio(tt, 2.4, 3.6), next = eio(tt, 6, 8);
  const W = Array.from({ length: 22 }, (_, i) => ({ x: 960 + Math.cos(i * 2.4) * (80 + (i * 37) % 320), y: 640 + Math.sin(i * 2.4) * (30 + (i * 23) % 110), live: i === 3 || i === 11 || i === 17 }));
  return <>
    <CShadow x={960} y={900} w={1200} />
    <div style={{ position: "absolute", left: 960, top: 660, width: 1000, height: 1000, transform: "translate(-50%,-50%) perspective(1400px) rotateX(66deg)", borderRadius: "50%", background: "repeating-linear-gradient(0deg, rgba(180,190,198,.85) 0 3px, transparent 3px 14px), repeating-linear-gradient(90deg, rgba(180,190,198,.85) 0 3px, transparent 3px 14px), radial-gradient(#3a3e42,#1a1c1e)", border: "26px solid #a8b0b6", boxShadow: "0 30px 0 #6a7278, 0 60px 50px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 1450, top: 560, width: 300, height: 34, background: "linear-gradient(#c8ccd0,#6a7278)", borderRadius: 16, transform: "rotate(-12deg)" }} />
    {W.map((w, i) => { const isDead = !w.live && dead > (i % 5) / 6; return <Weevil3 key={i} x={w.x + (w.live ? 30 * Math.sin(tt * 1.3 + i) : 0)} y={w.y} s={0.45} r={isDead ? 180 : (i * 47) % 360} tt={isDead ? 0 : tt} o={isDead ? 0.55 : 1} />; })}
    {W.filter((w) => w.live).map((w, j) => Array.from({ length: 5 }, (_, k) => { const s = pop(tt, 6 + j * 0.4 + k * 0.15, 8, 0.5); if (s <= 0.01) return null; const a = k * 1.25 + j;
      return <Weevil3 key={j + "_" + k} x={w.x + Math.cos(a) * 90 * s} y={w.y + Math.sin(a) * 50 * s} s={0.36 * s} r={a * 57} tt={tt} />; }))}
    {spray > 0 && spray < 1 && Array.from({ length: 10 }, (_, k) => <Puff key={k} x={420 + spray * 1100 + (k % 3) * 60} y={380 + (k * 47) % 300} r={110 + k * 8} col="rgba(240,240,232,.7)" o={1 - spray * 0.5} />)}
    {dead > 0.5 && <Tag x={1560} y={720} txt="the survivors breed" s={pop(tt, 5, 7, 0.5) * (1 - 0 * next)} size={58} tt={tt} />}
  </>;
}} />;

// m25 · la rueda: un granjero de madera corre dentro de una rueda de molino; cada vuelta la rueda gira más rápido y en el aro aparece otra plaga
export const HTreadmill: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const ang = 40 * tt * tt, run = Math.sin(tt * (8 + tt * 3));
  const P = ["weevil", "aphid", "bollworm", "mites"];
  return <>
    <CShadow x={960} y={960} w={900} />
    <svg width={800} height={800} viewBox="-400 -400 800 800" style={{ position: "absolute", left: 560, top: 160, filter: "drop-shadow(18px 30px 24px rgba(0,0,0,.55))", overflow: "visible" }}>
      <defs><linearGradient id="trw" x1="0" x2="1"><stop offset="0" stopColor="#c89a62" /><stop offset="1" stopColor="#6a4626" /></linearGradient></defs>
      <path d="M-260 400 L0 0 L260 400" stroke="#4a2e16" strokeWidth={30} fill="none" />
      <g transform={`rotate(${ang})`}><circle r={350} fill="none" stroke="url(#trw)" strokeWidth={46} /><circle r={300} fill="none" stroke="#5a3a1e" strokeWidth={10} />
        {Array.from({ length: 16 }, (_, k) => <rect key={k} x={-14} y={-350} width={28} height={50} fill="#8a6238" transform={`rotate(${k * 22.5})`} />)}
        {Array.from({ length: 8 }, (_, k) => <line key={"s" + k} x1={0} y1={0} x2={0} y2={-300} stroke="#6a4626" strokeWidth={14} transform={`rotate(${k * 45})`} />)}
        {P.map((p, k) => <text key={p} x={0} y={-370} textAnchor="middle" fontFamily={HAND} fontSize={58} fill="#f3e6c6" opacity={cl(tt - 0.5 - k * 1.1)} transform={`rotate(${k * 90 + 180})`}>{p}</text>)}</g>
      <circle r={40} fill="#3a2612" /></svg>
    <svg width={200} height={300} viewBox="0 0 200 300" style={{ position: "absolute", left: 860, top: 610, overflow: "visible", filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.45))" }}>
      <circle cx={100} cy={40} r={30} fill="#c89a62" /><path d="M66 22 L134 22 L120 6 L80 6 Z" fill="#a07a3a" /><rect x={80} y={70} width={44} height={110} rx={16} fill="#3a5a8a" />
      <path d={`M100 180 L${100 + 50 * run} 290 M100 180 L${100 - 50 * run} 290`} stroke="#2a3a5a" strokeWidth={20} strokeLinecap="round" />
      <path d={`M100 90 L${100 - 50 * run} 160 M100 90 L${100 + 50 * run} 160`} stroke="#c89a62" strokeWidth={14} strokeLinecap="round" /></svg>
  </>;
}} />;

// m25-26 · las trampas de feromona: conos verdes sobre estacas en el campo de maqueta; en cada uno cae un gorgojo y se prende su farolito
export const HTrapGrid: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const G = Array.from({ length: 12 }, (_, i) => ({ c: i % 4, r: Math.floor(i / 4) }));
  return <>
    <CShadow x={960} y={960} w={1700} />
    <div style={{ position: "absolute", left: 960, top: 760, width: 1600, height: 700, transform: "translate(-50%,-50%) perspective(1300px) rotateX(58deg)", background: "repeating-linear-gradient(90deg, #3a2a18 0 30px, #4a8a2a 30px 70px)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}><Grain id="tgg" o={0.4} f={0.9} /></div>
    {G.map(({ c, r }, i) => { const x = 480 + c * 320 + r * 40 - 40, y = 600 + r * 140, s = 0.75 + r * 0.15, a = 0.4 + ((i * 7) % 12) * 0.38, on = cl((tt - a) * 4);
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
        <svg width={140} height={300} viewBox="0 0 140 300" style={{ overflow: "visible", filter: "drop-shadow(8px 14px 8px rgba(0,0,0,.45))" }}>
          <rect x={64} y={150} width={12} height={150} fill="#8a6238" /><path d="M20 150 L70 10 L120 150 Z" fill="#3aa04a" stroke="#1e6a2a" strokeWidth={4} /><path d="M70 10 L120 150 L70 150 Z" fill="#2a7a3a" />
          <circle cx={70} cy={0} r={18} fill={`rgba(255,${200 + 50 * on},${80 + 100 * on},${0.3 + 0.7 * on})`} />
          {on > 0 && <circle cx={70} cy={0} r={50} fill={`rgba(255,230,120,${0.35 * on})`} />}</svg>
        {tt > a - 0.6 && tt < a + 0.2 && <Weevil3 x={70} y={-140 + (tt - a + 0.6) * 160} s={0.3} tt={tt} wing={1} />}</div>; })}
  </>;
}} />;

// m26 · región por región: un tablero de bloques de madera que se dan vuelta de rojo a verde, de las Carolinas hacia el oeste
export const HRegionClear: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [["TX", 0], ["OK", 1], ["LA", 1], ["AR", 2], ["MS", 2], ["TN", 3], ["AL", 3], ["GA", 4], ["SC", 5], ["NC", 5]] as [string, number][], dur = D(h);
  return <>
    <CShadow x={960} y={900} w={1700} />
    {R.map(([s, col], i) => { const x = 260 + i * 160, y = 760 - (i % 2) * 50, at = 0.8 + (9 - i) * (dur - 3) / 10, fl = eio(tt, at, at + 0.6), ang = fl * 180;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 140, height: 180, transform: `translate(-50%,-100%) perspective(900px) rotateX(-12deg) rotateY(${ang}deg)`, transformStyle: "preserve-3d" }}>
        {[0, 180].map((rot) => <div key={rot} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: `rotateY(${rot}deg) translateZ(30px)`, borderRadius: 10, background: rot ? "linear-gradient(160deg,#6ac04a,#2a7a2a)" : "linear-gradient(160deg,#e05a3a,#8a1a12)", boxShadow: "inset 0 0 20px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff4e0" }}>{s}</div>)}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -30, height: 60, transform: "rotateX(90deg)", background: "#5a3a1e" }} /></div>; })}
    <Tag x={1700} y={300} txt="weevil-free" s={pop(tt, dur - 2, 7, 0.5)} size={70} tt={tt} />
  </>;
}} />;

// m27 · la urna de madera: los productores dejan caer su boleta por la ranura, uno tras otro; la tapa se abre y todas dicen YES
export const HSelfTax: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 7, lid = eio(tt, 6.2, 7), cnt = Array.from({ length: N }, (_, i) => cl((tt - 0.6 - i * 0.7) * 2)).filter((x) => x >= 1).length;
  return <>
    <CShadow x={960} y={940} w={760} />
    <Box x={960} y={940} w={600} h={380} d={420} rx={-22} ry={-14} front={WOOD} top={WOODTOP} side={WOODSIDE}
      topKids={<div style={{ position: "absolute", left: 160, top: 200, width: 280, height: 20, background: "#1a0e06", borderRadius: 6 }} />}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 70, color: "#f3e6c6", textShadow: "0 3px 0 #3a2410" }}>BALLOT</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: HAND, fontSize: 56, color: "#2a170a" }}>$ per acre?</div></Box>
    {Array.from({ length: N }, (_, i) => { const a = 0.6 + i * 0.7, u = cl((tt - a) * 2); if (u <= 0 || u >= 1) return null; const x = 960 + (i % 2 ? 1 : -1) * 600 * (1 - u), y = 400 - 200 * Math.sin(u * Math.PI) + 120 * u;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${(1 - u) * (i % 2 ? 40 : -40)}deg)`, width: 220, height: 140, padding: 14, boxSizing: "border-box", background: "linear-gradient(160deg,#fbf7ec,#e8dcc0)", boxShadow: "0 12px 18px rgba(0,0,0,.4)", fontFamily: HAND, fontSize: 60, color: "#23324f" }}>YES ✗</div>; })}
    {lid > 0 && Array.from({ length: N }, (_, i) => <div key={"o" + i} style={{ position: "absolute", left: 600 + i * 120, top: 300 - 40 * Math.sin(i), transform: `translate(-50%,-50%) rotate(${-10 + i * 4}deg) scale(${pop(tt, 6.4 + i * 0.1)})`, width: 200, height: 130, padding: 12, boxSizing: "border-box", background: "linear-gradient(160deg,#fbf7ec,#e8dcc0)", boxShadow: "0 12px 18px rgba(0,0,0,.4)", fontFamily: HAND, fontSize: 64, color: "#1a6a2a" }}>YES</div>)}
    <div style={{ position: "absolute", left: 1500, top: 820, fontFamily: MARK, fontSize: 110, color: "#f3e6c6", textShadow: "0 8px 16px #000", opacity: cl(tt - 0.8) }}>{cnt}</div>
  </>;
}} />;

// m27-28 · la cinta métrica de un siglo: se tira de la cinta amarilla de 1892 en adelante; el gorgojo camina por encima hasta que se baja en 1990s
export const HCenturyBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const ext = eio(tt, 0.4, D(h) - 2), len = 1500 * ext, wx = 260 + len - 60, off = eio(tt, D(h) - 1.6, D(h) - 0.8);
  return <>
    <CShadow x={960} y={720} w={1700} o={0.45} />
    <div style={{ position: "absolute", left: 240, top: 600, width: len, height: 110, background: "linear-gradient(#ffe070,#e8b820 60%,#a87a10)", boxShadow: "0 16px 20px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {Array.from({ length: 101 }, (_, k) => <div key={k} style={{ position: "absolute", left: k * 15, top: 0, width: 3, height: k % 10 ? 26 : 50, background: "#2a1a0a" }} />)}
      {Array.from({ length: 11 }, (_, k) => <div key={"y" + k} style={{ position: "absolute", left: k * 150 + 6, top: 50, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#2a1a0a" }}>{1892 + k * 10}</div>)}</div>
    <div style={{ position: "absolute", left: 60, top: 520, width: 260, height: 260, borderRadius: 40, background: "radial-gradient(circle at 35% 30%,#ffe070,#c89a10 60%,#7a5a0a)", boxShadow: "0 30px 30px rgba(0,0,0,.55), inset 0 0 0 16px rgba(0,0,0,.15)" }}><div style={{ position: "absolute", left: 90, top: 90, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(#e8e0c8,#8a7a5a)" }} /></div>
    <Weevil3 x={Math.min(wx, 260 + 1500 - 60) + off * 60} y={560 + off * 300} s={0.6} tt={tt} o={1 - off} />
  </>;
}} />;

// m28 · la estatua de Enterprise: cae la lona y aparece la mujer de bronce con el gorgojo en alto sobre la fuente; brilla la placa
export const HStatueReveal: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#6a8aa8 0%,#c8c0a8 60%,#8a7a5a 62%,#5a4a32 100%)" f={(tt) => {
  const drop = eio(tt, 0.6, 2), glint = eio(tt, 2.6, 3.4);
  return <>
    {[200, 1500].map((x, k) => <div key={k} style={{ position: "absolute", left: x, top: 260, width: 300, height: 420, background: k ? "linear-gradient(#a8846a,#6a4a3a)" : "linear-gradient(#c8a88a,#8a6a4a)", boxShadow: "inset 0 0 30px rgba(0,0,0,.4)" }}>{[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 40 + j * 80, top: 60, width: 50, height: 80, background: "#3a4a5a" }} />)}</div>)}
    <CShadow x={960} y={900} w={900} />
    <div style={{ position: "absolute", left: 960, top: 900, width: 760, height: 150, transform: "translate(-50%,-100%)", borderRadius: "50% / 30%", background: "linear-gradient(#d8d0c0,#8a8270)", boxShadow: "inset 0 20px 30px rgba(0,0,0,.25)" }} />
    <div style={{ position: "absolute", left: 960, top: 790, width: 200, height: 220, transform: "translate(-50%,-100%)", background: "linear-gradient(90deg,#9a9282,#e8e0d0,#9a9282)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 70, padding: 8, background: `linear-gradient(120deg,#8a6a2a,#e8c870 ${40 + 40 * glint}%,#8a6a2a)`, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 22, color: "#2a1a0a", textAlign: "center", lineHeight: 1.1 }}>HERALD OF PROSPERITY</div></div>
    <svg width={460} height={680} viewBox="0 0 460 680" style={{ position: "absolute", left: 730, top: -110, filter: "drop-shadow(16px 26px 20px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id="srb" x1="0" x2="1"><stop offset="0" stopColor="#3a2a1a" /><stop offset=".4" stopColor="#c8a060" /><stop offset=".6" stopColor="#8a6a3a" /><stop offset="1" stopColor="#2a1a0a" /></linearGradient></defs>
      <path d="M150 680 Q160 470 200 380 L190 300 Q230 260 270 300 L260 380 Q300 470 310 680 Z" fill="url(#srb)" /><circle cx={230} cy={260} r={40} fill="url(#srb)" />
      <path d="M200 310 Q140 220 150 110 M260 310 Q320 220 310 110" stroke="url(#srb)" strokeWidth={30} fill="none" strokeLinecap="round" />
      <ellipse cx={230} cy={90} rx={110} ry={46} fill="url(#srb)" /><path d="M120 100 L340 100" stroke="#2a1a0a" strokeWidth={4} /><path d="M330 90 Q370 110 380 140" stroke="url(#srb)" strokeWidth={14} fill="none" /></svg>
    {drop < 1 && <div style={{ position: "absolute", left: 960, top: -120 + drop * 760, width: 560, height: 820 * (1 - drop * 0.8), transform: "translate(-50%,0)", borderRadius: "40% 40% 10% 10%", background: "repeating-linear-gradient(90deg,#8a7a5a 0 40px,#6a5a3a 40px 80px)", boxShadow: "0 30px 40px rgba(0,0,0,.6)", opacity: 1 - eio(drop, 0.85, 1) }} />}
    {glint > 0 && glint < 1 && <div style={{ position: "absolute", left: 1030, top: 0, width: 120, height: 120, background: "radial-gradient(rgba(255,255,230,.95),transparent 60%)", transform: `scale(${Math.sin(glint * Math.PI) * 1.4})` }} />}
  </>;
}} />;

// m28-29 · la balanza del almacén: en un platillo la mota de algodón, en el otro cae una bolsa de maní; el maní pesa más y el fiel se inclina
export const HPeanutSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const f = fall(tt, 1.6), tip = eio(tt, 2.2, 3.2) * 16;
  const pan = (x: number, y: number, k: React.ReactNode) => <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,0)" }}>
    <svg width={340} height={300} viewBox="0 0 340 300" style={{ overflow: "visible" }}><path d="M170 0 L40 220 M170 0 L300 220" stroke="#8a6a2a" strokeWidth={4} /><ellipse cx={170} cy={226} rx={150} ry={30} fill="#c8a040" /><ellipse cx={170} cy={220} rx={150} ry={30} fill="#e8c060" /></svg>
    <div style={{ position: "absolute", left: 170, top: 220, transform: "translate(-50%,-100%)" }}>{k}</div></div>;
  const a = tip / 57.3, Lx = 960 - 420 * Math.cos(a), Ly = 330 + 420 * Math.sin(a), Rx = 960 + 420 * Math.cos(a), Ry = 330 - 420 * Math.sin(a);
  return <>
    <CShadow x={960} y={940} w={900} />
    <div style={{ position: "absolute", left: 960, top: 940, transform: "translate(-50%,-100%)", width: 70, height: 620, background: "linear-gradient(90deg,#7a5a1a,#e8c060,#7a5a1a)" }} />
    <div style={{ position: "absolute", left: 960, top: 940, transform: "translate(-50%,-100%)", width: 360, height: 60, borderRadius: 14, background: "linear-gradient(#c8a040,#6a4a10)" }} />
    <div style={{ position: "absolute", left: 960, top: 330, width: 900, height: 26, background: "linear-gradient(#f0d070,#8a6a1a)", borderRadius: 13, transform: `translate(-50%,-50%) rotate(${-tip}deg)` }} />
    {pan(Lx, Ly, <div style={{ position: "relative", width: 200, height: 160 }}><Boll3 x={100} y={80} s={0.9} id="psb" /></div>)}
    {pan(Rx, Ry, f.s > 0.01 && <svg width={220} height={220} viewBox="0 0 220 220" style={{ transform: `translateY(${f.y}px)` }}><path d="M30 60 Q20 150 30 216 L190 216 Q200 150 190 60 Q110 40 30 60 Z" fill="#c8a878" /><path d="M40 52 Q110 10 180 52" stroke="#8a6a3a" strokeWidth={12} fill="none" />
      {Array.from({ length: 6 }, (_, k) => <ellipse key={k} cx={70 + (k % 3) * 40} cy={120 + Math.floor(k / 3) * 50} rx={22} ry={12} fill="#a87a3a" transform={`rotate(${k * 30} ${70 + (k % 3) * 40} ${120 + Math.floor(k / 3) * 50})`} />)}
      <text x={110} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#3a2410">PEANUTS</text></svg>)}
  </>;
}} />;

// m29 · la escuela sobre ruedas: el carro de madera con su toldo y la mula entra por el camino de tierra; sobre el toldo el cartel pintado
export const HSchoolWagon: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c4d8 0%,#e8e0c0 50%,#b8a06a 52%,#8a6a3a 100%)" f={(tt) => {
  const u = eio(tt, 0, 4.6), x = 2200 - 1350 * u, wr = -u * 1400;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 200, background: "linear-gradient(#a8865a,#7a5a32)", transform: "perspective(900px) rotateX(50deg)", transformOrigin: "50% 0" }} />
    {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 67) % 1920, top: 560 - (k % 3) * 20, width: 18, height: 70 + (k % 4) * 16, borderRadius: "50% 50% 0 0", background: "#5a8a3a" }} />)}
    {u < 1 && [0, 1, 2].map((k) => <Puff key={k} x={x + 520 + k * 70} y={820 - k * 30} r={80 + k * 30} col="rgba(200,170,120,.6)" o={1 - u} />)}
    <div style={{ position: "absolute", left: x, top: 880, width: 900, height: 30, transform: "translate(0,-50%)", borderRadius: "50%", background: "rgba(0,0,0,.4)", filter: "blur(10px)" }} />
    <svg width={900} height={560} viewBox="0 0 900 560" style={{ position: "absolute", left: x, top: 340, overflow: "visible" }}>
      <defs><linearGradient id="swc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8f2e0" /><stop offset="1" stopColor="#c8bca0" /></linearGradient></defs>
      <path d="M120 180 L120 100 L180 100 L200 160 M110 200 Q120 120 160 100" stroke="#5a3a2a" strokeWidth={0} />
      <ellipse cx={150} cy={320} rx={120} ry={60} fill="#6a4a3a" /><path d="M50 300 L20 220 L60 210 L90 290" fill="#6a4a3a" /><path d="M30 214 L14 180 M46 210 L44 176" stroke="#4a2e20" strokeWidth={8} />
      {[90, 140, 190, 220].map((lx, k) => <rect key={k} x={lx} y={360} width={18} height={130 + 10 * Math.sin(tt * 8 + k * 1.6)} fill="#4a2e20" />)}
      <line x1={260} y1={340} x2={360} y2={360} stroke="#3a2410" strokeWidth={10} />
      <rect x={340} y={300} width={500} height={130} fill="#8a5a2a" stroke="#4a2e16" strokeWidth={6} />
      <path d="M340 300 Q340 120 590 110 Q840 120 840 300 Z" fill="url(#swc)" stroke="#8a7a5a" strokeWidth={6} />
      <text x={590} y={230} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={46} fill="#2a3a5a">MOVABLE SCHOOL</text>
      {[440, 760].map((wx) => <g key={wx} transform={`rotate(${wr} ${wx} 450)`}><circle cx={wx} cy={450} r={90} fill="none" stroke="#4a2e16" strokeWidth={14} />{Array.from({ length: 10 }, (_, k) => <line key={k} x1={wx} y1={450} x2={wx} y2={362} stroke="#6a4626" strokeWidth={8} transform={`rotate(${k * 36} ${wx} 450)`} />)}<circle cx={wx} cy={450} r={16} fill="#2a1a0a" /></g>)}</svg>
  </>;
}} />;

// m29-30 · oír, ver, hacer: la trompetilla y los anteojos se corren de la mesa; queda el guante de trabajo, que se cierra sobre la mota de algodón
export const HHearSeeDo: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const a1 = pop(tt, 0.4, 8, 0.45), a2 = pop(tt, 1.6, 8, 0.45), a3 = pop(tt, 2.8, 8, 0.45), out = eio(tt, 5, 6.2), grip = eio(tt, 6.6, 7.6);
  return <>
    <CShadow x={500 - 700 * out} y={820} w={340} k={cl(a1)} /><CShadow x={960} y={820} w={300} k={cl(a2) * (1 - out)} /><CShadow x={1400 - 400 * grip} y={820} w={340} k={cl(a3)} />
    <svg width={360} height={260} viewBox="0 0 360 260" style={{ position: "absolute", left: 320 - 700 * out, top: 560 - (1 - cl(a1)) * 300, filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><defs><linearGradient id="hst" x1="0" x2="1"><stop offset="0" stopColor="#7a5a1a" /><stop offset=".5" stopColor="#f0d070" /><stop offset="1" stopColor="#6a4a10" /></linearGradient></defs><path d="M20 120 L220 60 Q360 20 340 130 Q360 240 220 200 Z" fill="url(#hst)" /><ellipse cx={300} cy={130} rx={50} ry={100} fill="#3a2a0a" /><rect x={0} y={110} width={40} height={24} rx={10} fill="#5a3a0a" /></svg>
    <svg width={360} height={140} viewBox="0 0 360 140" style={{ position: "absolute", left: 780 + 900 * out * 0 , top: 660 - (1 - cl(a2)) * 300 + out * 600, opacity: 1 - out, filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.5))" }}><circle cx={90} cy={70} r={60} fill="rgba(200,230,240,.35)" stroke="#2a2a2a" strokeWidth={10} /><circle cx={270} cy={70} r={60} fill="rgba(200,230,240,.35)" stroke="#2a2a2a" strokeWidth={10} /><path d="M150 60 Q180 40 210 60" stroke="#2a2a2a" strokeWidth={10} fill="none" /><path d="M60 40 L70 30 M240 40 L250 30" stroke="#fff" strokeWidth={6} opacity={0.7} /></svg>
    <Boll3 x={1000} y={760} s={0.9} o={cl(grip * 4)} id="hsb" />
    <svg width={380} height={360} viewBox="0 0 380 360" style={{ position: "absolute", left: 1220 - 400 * grip, top: 480 - (1 - cl(a3)) * 300, filter: "drop-shadow(12px 20px 14px rgba(0,0,0,.5))" }}><defs><linearGradient id="hsg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e0b878" /><stop offset="1" stopColor="#8a5a2a" /></linearGradient></defs>
      <rect x={220} y={180} width={150} height={140} rx={20} fill="#6a8aa8" />
      <path d={`M240 180 Q130 ${170 + 40 * grip} 60 ${150 + 60 * grip} Q30 ${140 + 60 * grip} 50 ${120 + 50 * grip} L200 110 Q240 100 250 180 Z`} fill="url(#hsg)" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${210 - k * 4} ${120 + k * 20} Q${110 - 30 * grip} ${100 + k * 22 + 60 * grip} ${70 + 40 * grip} ${110 + k * 24 + 80 * grip}`} stroke="url(#hsg)" strokeWidth={30} fill="none" strokeLinecap="round" />)}</svg>
  </>;
}} />;

// m30 · el surco: en una hilera de plantas cada mota se abre de a una y adentro tiene su año bordado en hilo
export const HCottonRow: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = ["1892", "1915", "1922", "1950", "1978", "1993"];
  return <>
    <CShadow x={960} y={920} w={1700} />
    <Box x={960} y={930} w={1600} h={110} d={300} rx={-24} ry={0} front="linear-gradient(#5a3e24,#2a1c10)" top="linear-gradient(#6a4a2c,#4a3220)" side="#2a1c10" />
    {Y.map((y, i) => { const x = 330 + i * 255, op = eio(tt, 0.6 + i * 0.75, 1.3 + i * 0.75), sc = 0.82 + (i % 2) * 0.08;
      return <React.Fragment key={i}>
        <svg width={200} height={420} viewBox="0 0 200 420" style={{ position: "absolute", left: x - 100, top: 420, overflow: "visible" }}><path d="M100 420 Q96 260 100 120" stroke="#5a7a2a" strokeWidth={10} fill="none" />
          {[0, 1].map((k) => <path key={k} d={`M100 ${300 - k * 90} q${k ? 70 : -70} -30 ${k ? 90 : -90} 10 q${k ? -40 : 40} 20 ${k ? -90 : 90} -10`} fill="#5f8a3a" />)}</svg>
        <Boll3 x={x} y={500} s={sc} open={op} id={"crb" + i} />
        <div style={{ position: "absolute", left: x, top: 500, transform: `translate(-50%,-50%) scale(${op})`, fontFamily: HAND, fontSize: 50, color: "#23324f", fontWeight: 700 }}>{y}</div>
      </React.Fragment>; })}
  </>;
}} />;

// m31 · la radio de válvulas: la perilla gira, el dial se ilumina y las tarjetas de preguntas de los oyentes entran por la ranura; sale una tarjeta con la respuesta
export const HRadioCall: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const on = eio(tt, 0.4, 1.4), knob = on * 220, ans = pop(tt, 6.5, 7, 0.5), Q = ["Plant earlier?", "Which seed?", "Burn the stalks?"];
  return <>
    <CShadow x={760} y={930} w={900} />
    <div style={{ position: "absolute", left: 760, top: 930, transform: "translate(-50%,-100%)", width: 760, height: 560, borderRadius: "300px 300px 30px 30px", background: "linear-gradient(160deg,#a8743a,#6a4220 60%,#3a2410)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,220,170,.25)" }}>
      <div style={{ position: "absolute", left: 90, top: 70, width: 580, height: 260, borderRadius: "260px 260px 10px 10px", background: "repeating-linear-gradient(90deg,#3a2a1a 0 8px,#c8a878 8px 14px)", opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 160, top: 360, width: 440, height: 80, borderRadius: 14, background: `linear-gradient(rgba(255,${200 + 30 * on},${100 + 40 * on},${0.2 + 0.8 * on}),rgba(200,120,40,${0.2 + 0.6 * on}))`, boxShadow: `0 0 ${40 * on}px rgba(255,190,90,.7)`, fontFamily: FONT, fontSize: 30, color: "#3a1a0a", display: "flex", justifyContent: "space-around", alignItems: "center" }}>{[550, 700, 900, 1200, 1500].map((v) => <span key={v}>{v}</span>)}
        <div style={{ position: "absolute", left: 60 + 300 * on, top: 6, width: 6, height: 68, background: "#b3221a" }} /></div>
      {[180, 580].map((x, k) => <div key={x} style={{ position: "absolute", left: x - 50, top: 450, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#5a3a1a,#1a0e06)", transform: `rotate(${k ? knob : -knob}deg)` }}><div style={{ position: "absolute", left: 46, top: 6, width: 8, height: 30, background: "#e8d8b8" }} /></div>)}</div>
    {Q.map((q, i) => { const a = 2 + i * 1.3, u = eio(tt, a, a + 1); if (tt < a || u >= 1) return null;
      return <div key={i} style={{ position: "absolute", left: 1500 - 600 * u, top: 300 + i * 30 + 120 * u, transform: `translate(-50%,-50%) rotate(${8 - i * 6}deg) scale(${1 - 0.6 * u})`, opacity: 1 - eio(u, 0.8, 1), width: 420, padding: "18px 26px", background: "linear-gradient(160deg,#fbf7ec,#e8dcc0)", boxShadow: "0 14px 20px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 60, color: "#23324f" }}>{q}</div>; })}
    {ans > 0.01 && <div style={{ position: "absolute", left: 1460, top: 640, transform: `translate(-50%,-50%) rotate(-4deg) scale(${ans})`, width: 520, padding: "22px 30px", background: "linear-gradient(160deg,#fdf8d8,#efe6b0)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", fontFamily: HAND, fontSize: 64, color: "#1a5a2a" }}>Plant early,<br />burn the stalks.</div>}
  </>;
}} />;

// m32 · la colcha del repaso: la aguja cose retazos de a uno (mota, gorgojo, avión, maní, trampa verde) y la colcha crece sobre la mesa
export const HQuiltRecap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = ["#e8dcc0", "#b3221a", "#3a5a8a", "#c8a050", "#3a8a3a", "#6a4a3a"], icon = ["boll", "weevil", "plane", "peanut", "trap", "monument"];
  const draw = (k: string) => k === "boll" ? <Boll3 x={110} y={110} s={0.6} id="qrb" /> : k === "weevil" ? <Weevil3 x={110} y={110} s={0.6} />
    : k === "plane" ? <svg width={220} height={220} viewBox="0 0 220 220"><rect x={30} y={100} width={160} height={24} rx={10} fill="#f3e6c6" /><rect x={90} y={60} width={30} height={110} fill="#f3e6c6" /><rect x={20} y={90} width={20} height={40} fill="#f3e6c6" /></svg>
      : k === "peanut" ? <svg width={220} height={220} viewBox="0 0 220 220"><path d="M60 110 Q60 60 100 70 Q120 90 130 80 Q170 60 170 110 Q170 160 130 140 Q110 130 100 150 Q60 160 60 110 Z" fill="#e8c890" /></svg>
        : k === "trap" ? <svg width={220} height={220} viewBox="0 0 220 220"><path d="M60 180 L110 40 L160 180 Z" fill="#9ae07a" /></svg>
          : <svg width={220} height={220} viewBox="0 0 220 220"><path d="M90 200 L100 80 L120 80 L130 200 Z" fill="#e8c870" /><ellipse cx={110} cy={60} rx={40} ry={16} fill="#e8c870" /></svg>;
  return <>
    <CShadow x={960} y={880} w={1400} />
    {P.map((c, i) => { const s = pop(tt, 0.5 + i * 1.1, 9, 0.4), x = 620 + (i % 3) * 340, y = 380 + Math.floor(i / 3) * 340; if (s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 320, height: 320, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${30 + (1 - cl(s)) * 40}deg) scale(${s})`, background: `repeating-linear-gradient(45deg, rgba(255,255,255,.08) 0 6px, transparent 6px 12px), ${c}`, outline: "4px dashed rgba(255,240,210,.8)", outlineOffset: -14, boxShadow: "0 20px 26px rgba(0,0,0,.5), inset 0 0 30px rgba(0,0,0,.25)" }}>
        <div style={{ position: "absolute", left: 50, top: 50 }}>{draw(icon[i])}</div><Grain id={"qr" + i} o={0.3} f={1.4} /></div>; })}
    {(() => { const i = Math.min(5, Math.floor((tt - 0.5) / 1.1)), ph = ((tt - 0.5) / 1.1) % 1, x = 620 + (i % 3) * 340 + 160 - 320 * ph, y = 380 + Math.floor(i / 3) * 340 + 160;
      return tt < 7.3 && tt > 0.5 && <svg width={300} height={60} viewBox="0 0 300 60" style={{ position: "absolute", left: x, top: y - 40 - 30 * Math.abs(Math.sin(ph * 12)), transform: "rotate(-24deg)", filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.5))" }}><defs><linearGradient id="qrn" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#8a9aa4" /></linearGradient></defs><path d="M0 30 L240 22 Q290 30 240 38 Z" fill="url(#qrn)" /><ellipse cx={220} cy={30} rx={12} ry={4} fill="#3a3a3a" /><path d="M230 30 Q280 -20 300 40" stroke="#b3221a" strokeWidth={4} fill="none" /></svg>; })()}
  </>;
}} />;

// m33 · todos los huevos en una canasta: la canasta de mimbre llena de motas de algodón se vuelca; las motas ruedan por la mesa y el gorgojo entra caminando
export const HEggBasket: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tip = eio(tt, 2.4, 3.2), roll = eio(tt, 2.8, 4.8), wv = eio(tt, 4.6, 7);
  return <>
    <CShadow x={760} y={900} w={640} />
    <div style={{ position: "absolute", left: 760, top: 900, transform: `translate(-50%,-100%) rotate(${tip * 70}deg)`, transformOrigin: "80% 100%" }}>
      {Array.from({ length: 7 }, (_, k) => tip < 0.3 && <Boll3 key={k} x={80 + k * 60} y={-10 - (k % 2) * 40} s={0.55} id={"ebt" + k} />)}
      <svg width={520} height={340} viewBox="0 0 520 340" style={{ filter: "drop-shadow(16px 24px 16px rgba(0,0,0,.5))" }}><defs><pattern id="ebw" width="40" height="30" patternUnits="userSpaceOnUse"><rect width="40" height="30" fill="#a87a3a" /><path d="M0 15 Q10 0 20 15 T40 15" stroke="#6a4a1a" strokeWidth={6} fill="none" /><path d="M0 30 L0 0 M20 30 L20 0" stroke="#5a3a10" strokeWidth={3} /></pattern></defs>
        <path d="M20 60 L500 60 L440 330 L80 330 Z" fill="url(#ebw)" /><rect x={10} y={46} width={500} height={30} rx={15} fill="#8a5a22" /><path d="M80 60 Q260 -150 440 60" stroke="#8a5a22" strokeWidth={22} fill="none" />
        <text x={260} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={62} fill="#f3e6c6" stroke="#3a2410" strokeWidth={2}>COTTON</text></svg></div>
    {tip > 0.3 && Array.from({ length: 7 }, (_, k) => { const x = 1000 + roll * (160 + k * 110), y = 820 - Math.abs(Math.sin(roll * 6 + k)) * 40 * (1 - roll); return <React.Fragment key={k}><CShadow x={x} y={880} w={120} /><div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${roll * 400}deg)`, transformOrigin: `${x}px ${y}px` }}><Boll3 x={x} y={y} s={0.55} id={"ebr" + k} /></div></React.Fragment>; })}
    {wv > 0 && <Weevil3 x={1960 - wv * 760} y={850} s={0.9} tt={tt} flip />}
  </>;
}} />;

export const HCC3: Record<string, React.FC<{ t: number; h: H }>> = {
  elementTile: HElementTile, soilTest: HSoilTest, ledgerDebt: HLedgerDebt, migrationArrows: HMigrationArrows, reasonBar: HReasonBar, record78: HRecord78,
  sprayCount: HSprayCount, resistSieve: HResistSieve, treadmill: HTreadmill, trapGrid: HTrapGrid, regionClear: HRegionClear, selfTax: HSelfTax,
  centuryBar: HCenturyBar, statueReveal: HStatueReveal, peanutSwap: HPeanutSwap, schoolWagon: HSchoolWagon, hearSeeDo: HHearSeeDo, cottonRow: HCottonRow,
  radioCall: HRadioCall, quiltRecap: HQuiltRecap, eggBasket: HEggBasket,
};
