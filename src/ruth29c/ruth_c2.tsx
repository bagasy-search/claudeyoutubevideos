// ruth29c · 2ª vuelta (29-oct): 1ª mitad del video rehecha como OBJETOS 3D sobre la mesa (sombra de contacto, volumen, textura),
// una idea por pieza, texto grande y DENTRO de la escena. Helpers y 2ª mitad en ruth_c3.
import React from "react";
import { H, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK, STAMP } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, WOOD, WOODTOP, WOODSIDE } from "./obj";
import { HCC3, S, D, fall, rnd, Puff, Tag, Weevil3, Boll3, COT } from "./ruth_c3";

// fardo de algodón 3D (arpillera con flejes) por CSS 3D
const Bale3: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) =>
  <Box x={x} y={y} w={180 * s} h={230 * s} d={130 * s} rx={-14} ry={-20} front="repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 3px,transparent 3px 9px), linear-gradient(#efe6d0,#cfc2a2)" top="linear-gradient(#f6efdc,#ddd0b0)" side="linear-gradient(#c8b894,#a8987a)">
    {[0.22, 0.5, 0.78].map((f) => <div key={f} style={{ position: "absolute", left: 0, right: 0, top: `${f * 100}%`, height: 7 * s, background: "linear-gradient(#5a5e62,#2a2e32)" }} />)}
  </Box>;

// m0 · la uña abre la mota verde: adentro, donde tenía que haber fibra blanca, una larva gorda mastica una pulpa marrón
export const HBollSplit: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const op = eio(tt, 1.6, 3.4), grub = pop(tt, 3, 7, 0.5), tag = pop(tt, 5.5, 7, 0.5);
  return <>
    <CShadow x={900} y={900} w={620} />
    <svg width={760} height={760} viewBox="-380 -380 760 760" style={{ position: "absolute", left: 520, top: 180, overflow: "visible", filter: "drop-shadow(20px 34px 24px rgba(0,0,0,.55))" }}>
      <defs><radialGradient id="bsg" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#c8e08a" /><stop offset=".5" stopColor="#7a9a3a" /><stop offset="1" stopColor="#2a4a12" /></radialGradient>
        <radialGradient id="bsi" cx="50%" cy="50%"><stop offset="0" stopColor="#8a5a2a" /><stop offset=".7" stopColor="#5a3a1a" /><stop offset="1" stopColor="#2a1a0a" /></radialGradient>
        <radialGradient id="bsl" cx="35%" cy="30%"><stop offset="0" stopColor="#fffbea" /><stop offset=".6" stopColor="#f0e2b8" /><stop offset="1" stopColor="#b89a5a" /></radialGradient></defs>
      {[0, 1, 2, 3].map((k) => <path key={k} d="M0 -10 Q-80 -120 0 -250 Q80 -120 0 -10" fill="#3a5a1a" transform={`rotate(${k * 90 + 45}) translate(0 ${-140})`} opacity={0.9} />)}
      <ellipse cx={0} cy={0} rx={230} ry={260} fill="url(#bsi)" />
      <ellipse cx={0} cy={20} rx={110} ry={46} fill="url(#bsl)" transform={`scale(${grub}) rotate(${-14 + 6 * Math.sin(tt * 3)})`} />
      {grub > 0.3 && [-60, -30, 0, 30, 60].map((x) => <path key={x} d={`M${x * grub} ${-14 * grub} Q${x * grub + 4} ${20 * grub} ${x * grub} ${56 * grub}`} stroke="rgba(160,120,60,.6)" strokeWidth={4} fill="none" />)}
      {grub > 0.3 && <ellipse cx={-110 * grub} cy={10} rx={18} ry={14} fill="#6a3a1a" />}
      <path d={`M0 -260 Q${-250 - 120 * op} -60 ${-40 - 200 * op} 260 Q-120 0 0 -260 Z`} fill="url(#bsg)" stroke="#2a4a12" strokeWidth={4} />
      <path d={`M0 -260 Q${250 + 120 * op} -60 ${40 + 200 * op} 260 Q120 0 0 -260 Z`} fill="url(#bsg)" stroke="#2a4a12" strokeWidth={4} />
      <ellipse cx={-80 - 60 * op} cy={-80} rx={30} ry={60} fill="rgba(255,255,255,.18)" /></svg>
    <svg width={400} height={300} viewBox="0 0 400 300" style={{ position: "absolute", left: 1040 + 60 * op, top: 120 - 40 * op, transform: `rotate(${-20 + 10 * op}deg)`, filter: "drop-shadow(14px 22px 16px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id="bsf" x1="0" x2="1"><stop offset="0" stopColor="#e8b896" /><stop offset="1" stopColor="#a8704a" /></linearGradient></defs>
      <path d="M0 260 Q60 120 140 80 L300 60 Q380 70 360 130 L200 170 Q120 230 80 300 Z" fill="url(#bsf)" /><path d="M300 62 Q350 66 356 110 L300 112 Z" fill="#f6dcc8" stroke="#c8a088" strokeWidth={3} /></svg>
    <Tag x={1500} y={560} txt="no cotton inside" s={tag} size={64} tt={tt} />
  </>;
}} />;

// m0-1 · el camino de mesa bordado con el Cinturón del Algodón; los gorgojos lo cruzan de oeste a este y detrás la tela queda manchada de marrón
export const HBeltSweep: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const w = eio(tt, 0.8, D(h) - 1.5), front = 1600 - 1300 * w;
  const ST = ["TX", "LA", "MS", "AL", "GA", "SC", "NC"];
  return <>
    <CShadow x={960} y={830} w={1700} o={0.5} />
    <div style={{ position: "absolute", left: 960, top: 660, width: 1700, height: 520, transform: "translate(-50%,-50%) perspective(1400px) rotateX(52deg)", background: "repeating-linear-gradient(0deg,rgba(0,0,0,.05) 0 2px,transparent 2px 6px), repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 2px,transparent 2px 6px), linear-gradient(#f0e6cc,#dccfae)", boxShadow: "0 40px 50px rgba(0,0,0,.55)", border: "14px solid #b3322a", borderStyle: "double" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: front - 130, right: 0, background: "linear-gradient(90deg, transparent, rgba(110,70,30,.65) 160px)" }} />
      {ST.map((s, i) => <div key={s} style={{ position: "absolute", left: 1540 - i * 220, top: 180 + (i % 2) * 70, fontFamily: HAND, fontSize: 70, color: "#3a5a8a", textShadow: "1px 1px 0 #fff" }}>{s}</div>)}
      {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: 40 + (k * 53) % 1600, top: 40 + (k * 97) % 420, width: 24, height: 24, borderRadius: "50%", background: COT, boxShadow: "0 0 0 3px #7a5a3a" }} />)}
    </div>
    {Array.from({ length: 16 }, (_, i) => <Weevil3 key={i} x={1880 - 1500 * w + (i % 4) * 60 - 100 - 0} y={480 + i * 24 + 10 * Math.sin(tt * 2 + i)} s={0.4 + (i % 3) * 0.06} r={180} tt={tt} flip />)}
  </>;
}} />;

// m1 · adelanto: en la maqueta de la calle principal, una estatua tapada con lona sobre su fuente; el viento levanta apenas el borde
export const HStatueTease: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#5a6e84 0%,#a8a090 58%,#6a5a42 60%,#3a2e20 100%)" f={(tt) => {
  const gust = Math.max(0, Math.sin(tt * 1.6)) * eio(tt, 1.5, 3), pig = pop(tt, 4.6, 7, 0.5);
  return <>
    {[[120, 0.9], [420, 0.7], [1380, 0.75], [1640, 0.95]].map(([x, s], k) => <div key={k} style={{ position: "absolute", left: x, top: 640, width: 280 * s, height: 460 * s, transform: "translate(0,-100%)", background: ["linear-gradient(#c8a88a,#8a6a4a)", "linear-gradient(#a8846a,#6a4a3a)", "linear-gradient(#b8a080,#7a6248)", "linear-gradient(#c8b090,#8a7258)"][k], boxShadow: "inset 0 0 30px rgba(0,0,0,.45)" }}>
      {[0, 1].map((j) => <div key={j} style={{ position: "absolute", left: 30 + j * 130 * s, top: 60, width: 70 * s, height: 100 * s, background: "#2a3a4a" }} />)}<div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "#3a2a1a" }} /></div>)}
    <CShadow x={960} y={900} w={800} />
    <div style={{ position: "absolute", left: 960, top: 900, width: 700, height: 130, transform: "translate(-50%,-100%)", borderRadius: "50% / 30%", background: "linear-gradient(#cfc8b8,#7a7262)" }} />
    <div style={{ position: "absolute", left: 960, top: 800, width: 180, height: 200, transform: "translate(-50%,-100%)", background: "linear-gradient(90deg,#8a8272,#d8d0c0,#8a8272)" }} />
    <svg width={520} height={560} viewBox="0 0 520 560" style={{ position: "absolute", left: 700, top: 50, overflow: "visible", filter: "drop-shadow(16px 26px 20px rgba(0,0,0,.55))" }}>
      <defs><linearGradient id="sttg" x1="0" x2="1"><stop offset="0" stopColor="#4a4a32" /><stop offset=".5" stopColor="#8a8a62" /><stop offset="1" stopColor="#3a3a22" /></linearGradient></defs>
      {gust > 0.2 && <path d="M230 520 L240 420 L270 420 L280 520 Z" fill="#a07a3a" />}
      <path d={`M120 ${540 - 40 * gust} Q100 300 200 120 Q260 20 320 120 Q420 300 ${400 + 30 * gust} ${540 - 80 * gust} Z`} fill="url(#sttg)" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${180 + k * 50} 160 Q${170 + k * 50} 360 ${160 + k * 56} 530`} stroke="rgba(0,0,0,.25)" strokeWidth={6} fill="none" />)}
      <path d="M150 300 Q260 330 380 300" stroke="#c8b08a" strokeWidth={10} fill="none" /></svg>
    {pig > 0.01 && <svg width={140} height={110} viewBox="0 0 140 110" style={{ position: "absolute", left: 930, top: 40 - (1 - cl(pig)) * 200, filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.4))" }}><ellipse cx={70} cy={60} rx={46} ry={30} fill="#8a8e96" /><circle cx={110} cy={36} r={20} fill="#7a7e86" /><path d="M126 36 L140 40 L126 44" fill="#d8a040" /><circle cx={114} cy={32} r={4} fill="#ff8a3a" /><path d="M60 90 L56 108 M80 90 L84 108" stroke="#d8783a" strokeWidth={5} /></svg>}
    <Tag x={1300} y={720} txt="Enterprise, Alabama" s={pop(tt, 2.2, 7, 0.5)} size={58} tt={tt} />
  </>;
}} />;

// m1-2 · la taza deja aros: van cayendo boletines, registros y actas, uno arriba del otro; la taza de café humea y deja su aro en cada hoja
export const HCoffeeRings: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [["BULLETIN Nº 51", "#f3ead6"], ["FARM RECORDS 1915", "#e8cf94"], ["HEARINGS · CONGRESS", "#efe2c8"], ["LETTERS", "#f6eedb"]] as [string, string][];
  const mug = eio(tt, 5.6, 6.4);
  return <>
    {P.map(([n, c], i) => { const f = fall(tt, 0.4 + i * 1.1); if (f.s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", inset: 0, transform: `translateY(${f.y}px)` }}><Sheet x={900 + i * 30} y={640 - i * 14} w={820} h={540} rx={44} r={-8 + i * 5} id={"cr" + i} bg={`linear-gradient(160deg,${c},#d8caa8)`}>
        <div style={{ position: "absolute", left: 50, top: 40, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 52, color: INK }}>{n}</div>
        {Array.from({ length: 7 }, (_, k) => <div key={k} style={{ position: "absolute", left: 50, right: 80 + (k % 3) * 60, top: 140 + k * 46, height: 10, background: "rgba(42,33,24,.25)" }} />)}
        <div style={{ position: "absolute", left: 480 - i * 60, top: 200 + i * 40, width: 230, height: 230, borderRadius: "50%", border: "12px solid rgba(110,60,20,.4)", boxShadow: "inset 0 0 8px rgba(110,60,20,.4)" }} /></Sheet></div>; })}
    <CShadow x={1500 - 220 * mug} y={770} w={300} />
    <div style={{ position: "absolute", left: 1500 - 220 * mug, top: 770, transform: "translate(-50%,-100%)" }}>
      {[0, 1, 2].map((k) => { const ph = (tt * 0.5 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 60 + 20 * Math.sin(ph * 6 + k), top: -60 - ph * 200, width: 40 + ph * 40, height: 40 + ph * 40, borderRadius: "50%", background: "rgba(240,240,232,.25)", filter: "blur(8px)", opacity: 1 - ph }} />; })}
      <svg width={260} height={230} viewBox="0 0 260 230" style={{ filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><defs><linearGradient id="crm" x1="0" x2="1"><stop offset="0" stopColor="#8a8e92" /><stop offset=".4" stopColor="#f3f0e6" /><stop offset="1" stopColor="#9aa0a6" /></linearGradient></defs>
        <path d="M200 70 Q260 70 250 130 Q240 170 190 170" stroke="url(#crm)" strokeWidth={22} fill="none" /><path d="M20 30 L210 30 L190 220 L40 220 Z" fill="url(#crm)" /><ellipse cx={115} cy={30} rx={95} ry={20} fill="#3a1e0a" /><path d="M20 30 Q115 52 210 30" stroke="#2a8aa0" strokeWidth={8} fill="none" /></svg></div>
  </>;
}} />;

// m2 · la telaraña: del fardo de algodón salen cuerdas tensas al banco (llave), al almacén (balanza de pesas) y a la escritura de la tierra; se tira una y tiemblan todas
export const HCottonWeb: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const st = eio(tt, 0.6, 2), pl = Math.sin(tt * 14) * 14 * eio(tt, 3, 3.4) * (1 - eio(tt, 4.4, 5.6));
  const N = [[380, 420, "BANK"], [1540, 420, "STORE"], [960, 260, "LAND"]] as [number, number, string][];
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{N.map(([x, y], i) => <path key={i} d={`M960 640 Q${(960 + x) / 2 + pl} ${(640 + y) / 2 + 30 * (1 - st) + pl} ${960 + (x - 960) * st} ${640 + (y - 640) * st}`} stroke="#c8a878" strokeWidth={8} fill="none" />)}</svg>
    <CShadow x={960} y={860} w={360} />
    <Bale3 x={960} y={860} s={1.2} />
    {N.map(([x, y, n], i) => { const s = pop(tt, 0.6 + i * 0.4, 7, 0.5); return <div key={i} style={{ position: "absolute", left: x + pl * 0.6, top: y + pl * 0.4, transform: `translate(-50%,-50%) scale(${s}) rotate(${pl * 0.3}deg)`, filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.5))" }}>
      {i === 0 ? <svg width={240} height={120} viewBox="0 0 240 120"><circle cx={50} cy={60} r={44} fill="none" stroke="#c8a040" strokeWidth={20} /><rect x={90} y={50} width={140} height={22} fill="#c8a040" /><rect x={190} y={70} width={14} height={34} fill="#c8a040" /><rect x={214} y={70} width={14} height={24} fill="#c8a040" /></svg>
        : i === 1 ? <svg width={220} height={200} viewBox="0 0 220 200"><rect x={20} y={160} width={180} height={30} rx={8} fill="#3a3a3a" /><path d="M60 160 L70 80 L150 80 L160 160 Z" fill="#5a5e62" /><ellipse cx={110} cy={74} rx={90} ry={16} fill="#c8a040" /></svg>
          : <svg width={240} height={180} viewBox="0 0 240 180"><rect x={20} y={10} width={200} height={160} fill="#efe6cf" /><path d="M40 50 L200 50 M40 80 L200 80 M40 110 L160 110" stroke="#8a7a5a" strokeWidth={6} /><circle cx={180} cy={140} r={26} fill="#b3322a" /></svg>}
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#f3e6c6", textShadow: "0 4px 10px #000" }}>{n}</div></div>; })}
  </>;
}} />;

// m2-3 · la balanza de resorte del almacén: se cuelgan de los clavos las cosas fiadas (harina, café, zapatos); después se cuelga la bolsa de algodón y la aguja apenas se mueve
export const HStoreLedger: React.FC<{ t: number; h: H }> = ({t, h }) => <S t={t} h={h} f={(tt) => {
  const I = [["flour", 0.6], ["coffee", 1.4], ["shoes", 2.2], ["seed", 3]] as [string, number][], bag = pop(tt, 4.4, 8, 0.4), needle = eio(tt, 5, 6) * 0.18, zero = pop(tt, 7, 7, 0.5);
  return <>
    <div style={{ position: "absolute", left: 140, right: 140, top: 140, height: 620, background: "repeating-linear-gradient(90deg, #6a4a2a 0 8px, #8a6238 8px 180px)", boxShadow: "inset 0 0 60px rgba(0,0,0,.6)" }}><Grain id="slw" o={0.3} f={0.6} /></div>
    {I.map(([n, a], i) => { const s = pop(tt, a, 8, 0.4), x = 320 + i * 220; return <React.Fragment key={i}><div style={{ position: "absolute", left: x - 6, top: 230, width: 12, height: 12, borderRadius: "50%", background: "#c8ccd0" }} />
      {s > 0.01 && <div style={{ position: "absolute", left: x, top: 236 + (1 - cl(s)) * -200, transform: `translate(-50%,0) rotate(${3 * Math.sin(tt * 2 + i)}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ width: 3, height: 40, margin: "0 auto", background: "#8a7a5a" }} /><div style={{ width: 170, height: 200, borderRadius: 14, background: ["linear-gradient(#f3ede0,#cfc6b0)", "linear-gradient(#b8862a,#6a4a10)", "linear-gradient(#5a3a22,#2a1a0c)", "linear-gradient(#c8b080,#8a7448)"][i], boxShadow: "0 14px 20px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 48, color: i === 2 ? "#f3e6c6" : INK }}>{n}</div></div>}</React.Fragment>; })}
    {/* la balanza de resorte colgada */}
    <div style={{ position: "absolute", left: 1420, top: 150, width: 6, height: 70, background: "#6a6e72" }} />
    <div style={{ position: "absolute", left: 1423, top: 220, transform: "translate(-50%,0)", width: 200, height: 300, borderRadius: 30, background: "linear-gradient(90deg,#8a8e92,#e8ecef,#8a8e92)", boxShadow: "0 20px 26px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 30, bottom: 40, background: "#fbf7ec", borderRadius: 10 }}>{Array.from({ length: 11 }, (_, k) => <div key={k} style={{ position: "absolute", left: 0, width: k % 5 ? 30 : 60, top: 10 + k * 19, height: 3, background: INK }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 10 + needle * 190, height: 6, background: "#b3221a" }} /></div></div>
    <div style={{ position: "absolute", left: 1423, top: 520, transform: "translate(-50%,0)", width: 6, height: 40 + needle * 60, background: "#6a6e72" }} />
    {bag > 0.01 && <div style={{ position: "absolute", left: 1423, top: 560 + needle * 60 - (1 - cl(bag)) * 200, transform: "translate(-50%,0)", width: 180, height: 170, borderRadius: "30px 30px 50px 50px", background: "linear-gradient(#efe6d0,#c8bca0)", boxShadow: "0 16px 22px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#5a4a2a" }}>COTTON</div>}
    {zero > 0.01 && <div style={{ position: "absolute", left: 780, top: 880, transform: `translate(-50%,-50%) rotate(-6deg) scale(${zero})`, fontFamily: MARK, fontSize: 130, color: STAMP, textShadow: "0 6px 14px rgba(0,0,0,.6)" }}>you owe more</div>}
  </>;
}} />;

// m3 · sin piso: la familia de papel parada sobre tablones; la planta se marchita y los tablones caen uno a uno al pozo oscuro
export const HNoFloor: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 7, wilt = eio(tt, 0.6, 3);
  return <>
    <div style={{ position: "absolute", left: 360, top: 720, width: 1200, height: 360, background: "radial-gradient(ellipse at 50% 0%, #000 30%, #140c06 80%)" }} />
    {Array.from({ length: N }, (_, i) => { const a = 2.4 + [3, 2, 4, 1, 5, 0, 6].indexOf(i) * 0.6, d = Math.max(0, tt - a), y = 720 + d * d * 900, r = d * 40 * (i % 2 ? 1 : -1);
      return <div key={i} style={{ position: "absolute", left: 380 + i * 166, top: y, width: 160, height: 46, transform: `rotate(${r}deg)`, background: WOODTOP, boxShadow: "0 16px 0 #5a3a1e, 0 26px 20px rgba(0,0,0,.6)", opacity: 1 - cl(d / 1.2) }} />; })}
    {[[620, 1], [860, 1.15], [1080, 0.75], [1250, 0.6]].map(([x, s], i) => { const under = Math.floor((x - 380) / 166), a = 2.4 + [3, 2, 4, 1, 5, 0, 6].indexOf(under) * 0.6, d = Math.max(0, tt - a - 0.25), y = 720 + d * d * 700;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s}) rotate(${d * 20}deg)`, transformOrigin: "50% 100%", opacity: 1 - cl(d / 1.4), filter: "drop-shadow(8px 14px 8px rgba(0,0,0,.5))" }}>
        <svg width={120} height={300} viewBox="0 0 120 300"><circle cx={60} cy={40} r={30} fill="#e8dcc0" /><path d="M24 80 Q60 66 96 80 L104 200 L80 200 L78 300 L66 300 L64 200 L56 200 L54 300 L42 300 L40 200 L16 200 Z" fill={["#d8c8a8", "#c8b898", "#e0d0b0", "#d0c0a0"][i]} stroke="#8a7a5a" strokeWidth={3} /></svg></div>; })}
    <svg width={260} height={340} viewBox="0 0 260 340" style={{ position: "absolute", left: 1600, top: 380, overflow: "visible" }}><rect x={60} y={260} width={140} height={80} fill="#8a5a32" /><path d={`M130 260 Q${130 - 40 * wilt} ${140 + 60 * wilt} ${130 - 90 * wilt} ${60 + 160 * wilt}`} stroke={`rgb(${90 + 80 * wilt},${130 - 30 * wilt},60)`} strokeWidth={10} fill="none" />
      <ellipse cx={130 - 90 * wilt} cy={50 + 170 * wilt} rx={30} ry={22} fill={`rgb(${110 + 60 * wilt},${140 - 40 * wilt},70)`} /></svg>
  </>;
}} />;

// m4 · el ciclo sobre un solo pimpollo: el gorgojo perfora, pone el huevo, el pimpollo se pone amarillo y cae; desde adentro sale el adulto nuevo
export const HLifeCycle: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const bore = eio(tt, 0.6, 1.8), egg = pop(tt, 2, 7, 0.5), yel = eio(tt, 3, 4.6), dr = eio(tt, 4.6, 5.6), em = eio(tt, 6.2, 8);
  const by = 380 + 420 * dr * dr;
  return <>
    <svg width={500} height={500} viewBox="0 0 500 500" style={{ position: "absolute", left: 640, top: 0, overflow: "visible" }}><path d="M250 0 Q240 200 300 400" stroke="#5a7a2a" strokeWidth={22} fill="none" /><path d="M280 300 q140 -60 200 20 q-100 40 -200 -20" fill="#4f7a2a" /></svg>
    <CShadow x={960} y={900} w={300} k={0.3 + 0.7 * dr} />
    <div style={{ position: "absolute", left: 960, top: by, transform: `translate(-50%,-50%) rotate(${dr * 50}deg)` }}>
      <svg width={300} height={340} viewBox="-150 -170 300 340" style={{ overflow: "visible", filter: "drop-shadow(12px 20px 14px rgba(0,0,0,.5))" }}>
        <defs><radialGradient id="lcg" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor={`rgb(${200 + 40 * yel},${230 - 20 * yel},${140 - 80 * yel})`} /><stop offset="1" stopColor={`rgb(${70 + 120 * yel},${110 + 40 * yel},${30})`} /></radialGradient></defs>
        {[-1, 0, 1].map((k) => <path key={k} d={`M0 -60 Q${k * 160} -160 ${k * 120} -40 Q${k * 60} -20 0 -60`} fill={`rgb(${80 + 120 * yel},${120 + 60 * yel},50)`} stroke="#2a4a12" strokeWidth={3} />)}
        <ellipse cx={0} cy={30} rx={110} ry={130} fill="url(#lcg)" />
        {bore > 0.6 && <circle cx={50} cy={-20} r={12} fill="#2a1a0a" />}
        {egg > 0.01 && <ellipse cx={50} cy={-20} rx={10 * egg} ry={14 * egg} fill="#fff8e0" stroke="#c8b88a" strokeWidth={2} />}
        {em > 0 && <rect x={-40} y={20} width={80} height={30} fill="#2a1a0a" opacity={cl(em * 3)} />}</svg></div>
    {tt < 2.2 && <Weevil3 x={1120 - 60 * bore} y={330} s={0.9} r={-160 + 10 * Math.sin(tt * 30) * bore} tt={tt} flip />}
    {em > 0 && <Weevil3 x={960 + 360 * em} y={by + 30 - 40 * em} s={0.4 + 0.5 * cl(em * 2)} tt={tt} />}
    <Tag x={1520} y={560} txt="3 weeks" s={pop(tt, 6.4, 7, 0.5)} size={70} tt={tt} />
  </>;
}} />;

// m4-5 · la campana de vidrio: adentro dos gorgojos; se duplican y se duplican hasta que el vidrio queda negro de bichos
export const HWeevilMultiply: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const gen = Math.min(7, Math.floor(eio(tt, 0.8, D(h) - 2) * 7.99)), n = Math.min(96, 2 * 2 ** gen);
  return <>
    <CShadow x={960} y={900} w={1000} />
    <div style={{ position: "absolute", left: 960, top: 900, width: 900, height: 90, transform: "translate(-50%,-100%)", borderRadius: "50%", background: "linear-gradient(#8a6238,#4a2e16)" }} />
    <div style={{ position: "absolute", left: 960, top: 860, width: 720, height: 680, transform: "translate(-50%,-100%)", borderRadius: "360px 360px 30px 30px", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => { const x = 360 + (rnd(i) - 0.5) * 640 * Math.min(1, 0.4 + i / 30), y = 640 - rnd(i + 3) * Math.min(600, 80 + i * 7); return <Weevil3 key={i} x={x} y={y} s={0.42} r={rnd(i + 7) * 360} tt={tt + i} />; })}</div>
    <div style={{ position: "absolute", left: 960, top: 860, width: 720, height: 680, transform: "translate(-50%,-100%)", borderRadius: "360px 360px 30px 30px", background: "linear-gradient(100deg, rgba(255,255,255,.35), rgba(255,255,255,.05) 30%, rgba(255,255,255,.03) 70%, rgba(255,255,255,.28))", border: "5px solid rgba(230,240,245,.7)" }}>
      <div style={{ position: "absolute", left: "50%", top: -60, width: 100, height: 80, transform: "translateX(-50%)", borderRadius: "50% 50% 20% 20%", background: "linear-gradient(90deg, rgba(230,240,245,.5), rgba(255,255,255,.2))", border: "5px solid rgba(230,240,245,.7)" }} /></div>
    <div style={{ position: "absolute", left: 1500, top: 600, fontFamily: MARK, fontSize: 120, color: "#f3e6c6", textShadow: "0 8px 16px #000" }}>×{2 ** gen}</div>
  </>;
}} />;

// m5 · el cruce: un río de vidrio azul atraviesa la mesa con banderitas de frontera; el gorgojo abre las alas, cruza volando y aterriza en la planta de algodón del lado de Texas
export const HRiverCross: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 1.6, 4.6), wx = 400 + 1000 * u, wy = 640 - Math.sin(u * Math.PI) * 300, wing = u > 0 && u < 1 ? 1 : 0;
  return <>
    <div style={{ position: "absolute", left: 960, top: 760, width: 2000, height: 220, transform: "translate(-50%,-50%) perspective(1200px) rotateX(58deg) rotate(-8deg)", background: "linear-gradient(90deg,#2a5a8a,#5a9ac8,#2a5a8a)", boxShadow: "0 0 40px rgba(90,160,220,.5), inset 0 10px 20px rgba(255,255,255,.3)", opacity: 0.92 }}>
      {Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: ((k * 220 + tt * 60) % 2000), top: 40 + (k % 3) * 50, width: 120, height: 6, borderRadius: 3, background: "rgba(255,255,255,.45)" }} />)}</div>
    {[300, 700, 1100, 1500].map((x, k) => <div key={k} style={{ position: "absolute", left: x, top: 640 + k * -6, transform: "translate(-50%,-100%)" }}><div style={{ width: 8, height: 160, background: "#8a6a42" }} /><div style={{ position: "absolute", left: 8, top: 0, width: 80, height: 50, background: k % 2 ? "linear-gradient(90deg,#1e6a3a 33%,#f3f0e6 33% 66%,#b3221a 66%)" : "linear-gradient(#b3221a 50%,#f3f0e6 50%)" }} /></div>)}
    <svg width={300} height={420} viewBox="0 0 300 420" style={{ position: "absolute", left: 1300, top: 300, overflow: "visible" }}><path d="M150 420 Q140 260 150 100" stroke="#5a7a2a" strokeWidth={12} fill="none" /><path d="M150 260 q90 -40 120 20 q-70 20 -120 -20 M150 200 q-90 -40 -120 20 q70 20 120 -20" fill="#4f7a2a" /></svg>
    <Boll3 x={1450} y={390} s={0.6} id="rcb" />
    <Weevil3 x={wx} y={wy} s={0.9} r={u >= 1 ? 0 : -10} tt={tt} wing={wing} />
    <Tag x={500} y={300} txt="Mexico" s={pop(tt, 0.4, 7, 0.5)} size={58} tt={tt} /><Tag x={1700} y={170} txt="Texas, 1892" s={pop(tt, 4.4, 7, 0.5)} size={64} tt={tt} />
  </>;
}} />;

// m5-6 · las fichas de dominó: fichas de madera paradas, cada una con su estado y año pintados, caen una tras otra con su sombra
export const HStateDominoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Dm = [["TX", 1892], ["LA", 1903], ["MS", 1907], ["AL", 1909], ["GA", 1915], ["SC", 1917], ["NC", 1922]] as [string, number][];
  return <>
    {Dm.map(([s, y], i) => { const a = 1 + i * 0.7, fr = eio(tt, a, a + 0.4), ang = fr * 62, x = 300 + i * 200;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x + 40 + 200 * fr, top: 870, width: 120 + 200 * fr, height: 26, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(0,0,0,.5)", filter: "blur(8px)" }} />
        <div style={{ position: "absolute", left: x, top: 870, width: 140, height: 290, transform: `translate(-50%,-100%) perspective(1200px) rotateY(-24deg) rotateZ(${ang}deg)`, transformOrigin: "100% 100%", transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "linear-gradient(160deg,#f6efdc,#d8c8a0)", boxShadow: "inset 0 0 0 6px #3a2410", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", fontFamily: FONT, fontWeight: 900, color: INK, transform: "translateZ(20px)" }}>
            <div style={{ fontSize: 66 }}>{s}</div><div style={{ width: "80%", height: 6, background: "#3a2410" }} /><div style={{ fontSize: 40, color: STAMP }}>{y}</div></div>
          <div style={{ position: "absolute", right: -40, top: 0, width: 40, height: 290, background: "linear-gradient(90deg,#a8946a,#6a5a3a)", transformOrigin: "0 50%", transform: "translateZ(20px) rotateY(90deg)" }} /></div>
      </React.Fragment>; })}
    <Weevil3 x={160} y={830} s={0.6} tt={tt} />
  </>;
}} />;

// m6 · Georgia: el carro cargado de fardos; el cartel pintado pasa de 1914 a 1923 y el gancho se lleva fardo por fardo hasta dejar un cuarto
export const HBaleShrink: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const G = Array.from({ length: 12 }, (_, i) => ({ c: i % 4, r: Math.floor(i / 4) })), gone = Math.floor(eio(tt, 2.4, D(h) - 2) * 9.01), yr = eio(tt, 2, D(h) - 2) > 0.98 ? 1923 : Math.round(1914 + 9 * eio(tt, 2, D(h) - 2));
  const order = [11, 10, 9, 8, 7, 6, 5, 4, 3];
  return <>
    <CShadow x={900} y={940} w={1100} />
    <div style={{ position: "absolute", left: 900, top: 840, width: 1000, height: 60, transform: "translate(-50%,0)", background: WOOD, boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} />
    {[520, 1280].map((wx) => <div key={wx} style={{ position: "absolute", left: wx - 80, top: 820, width: 160, height: 160, borderRadius: "50%", border: "16px solid #4a2e16", background: "repeating-conic-gradient(#6a4626 0 10deg, transparent 10deg 36deg)" }} />)}
    {G.map(({ c, r }, i) => { const oi = order.indexOf(i), out = oi >= 0 && oi < gone; const a = 2.4 + oi * ((D(h) - 4.4) / 9), lift = oi >= 0 ? eio(tt, a, a + 0.6) : 0; if (out && lift >= 1) return null;
      return <div key={i} style={{ position: "absolute", left: 0, top: -lift * 700 }}><Bale3 x={560 + c * 225 + r * 20} y={840 - r * 230} s={1} /></div>; })}
    <div style={{ position: "absolute", left: 1560, top: 420, transform: "translate(-50%,-50%) rotate(4deg)", padding: "16px 40px", background: WOODTOP, boxShadow: "0 20px 26px rgba(0,0,0,.5)", fontFamily: "Georgia, serif", fontWeight: 900, color: "#2a170a", textAlign: "center" }}>
      <div style={{ fontSize: 48 }}>GEORGIA</div><div style={{ fontSize: 110, lineHeight: 1 }}>{yr}</div></div>
  </>;
}} />;

// m7 · la cerca: tras el cerco de estacas blancas el campo de demostración está verde y cargado; las cabezas de los vecinos se asoman de a una
export const HFenceWatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9ab8d0 0%,#e0dcc8 44%,#6a9a3a 46%,#3a6a1e 100%)" f={(tt) => {
  return <>
    {Array.from({ length: 60 }, (_, k) => <Boll3 key={k} x={(k * 97) % 1920} y={540 + (k * 37) % 200} s={0.25 + ((k * 37) % 200) / 900} id={"fwb" + k} />)}
    {[[340, 0.4, "#8a5a32"], [700, 1.1, "#3a4a6a"], [1080, 1.8, "#6a3a2a"], [1460, 2.5, "#4a4a2a"]].map(([x, a, hat], i) => { const s = pop(tt, a as number, 7, 0.45);
      return <svg key={i} width={200} height={240} viewBox="0 0 200 240" style={{ position: "absolute", left: (x as number) - 100, top: 640 - 160 * cl(s), filter: "drop-shadow(8px 12px 8px rgba(0,0,0,.4))" }}><circle cx={100} cy={120} r={56} fill="#c89a72" /><ellipse cx={100} cy={70} rx={96} ry={18} fill={hat as string} /><path d="M50 70 Q100 0 150 70 Z" fill={hat as string} /><circle cx={80} cy={124} r={6} fill="#2a1a0a" /><circle cx={120} cy={124} r={6} fill="#2a1a0a" /></svg>; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, height: 40, background: "linear-gradient(#f3f0e6,#c8c4b8)", boxShadow: "0 10px 14px rgba(0,0,0,.35)" }} />
    {Array.from({ length: 20 }, (_, k) => <div key={k} style={{ position: "absolute", left: k * 100 + 20, top: 600, width: 60, height: 420, background: "linear-gradient(90deg,#d8d4c8,#fbfaf4,#c8c4b8)", clipPath: "polygon(50% 0,100% 14%,100% 100%,0 100%,0 14%)", boxShadow: "0 10px 14px rgba(0,0,0,.35)" }} />)}
  </>;
}} />;

// m7-8 · los dos juguetes de cuerda: la mota de lata arranca antes por la pista de madera y cruza la cinta; el gorgojo de lata llega tarde
export const HRaceClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const ub = eio(tt, 0.8, 5.2), uw = eio(tt, 2.6, 6.6) * 0.8, rib = ub >= 1 ? 1 : 0;
  const lane = (y: number) => <Box x={960} y={y} w={1600} h={30} d={150} rx={-30} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />;
  const key = (x: number, y: number, sp: number) => <div style={{ position: "absolute", left: x, top: y, width: 70, height: 30, transform: `translate(-50%,-50%) rotateY(${sp}deg)`, background: "linear-gradient(90deg,#c8a040,#f0d070,#c8a040)", borderRadius: 15 }} />;
  return <>
    {lane(600)}{lane(860)}
    <div style={{ position: "absolute", left: 1640, top: 400, width: 10, height: 520, background: "#e8dcc0" }} />
    <div style={{ position: "absolute", left: 1645, top: 520, width: 10 + 120 * rib, height: 16, background: "#b3221a", transform: `rotate(${rib * 30}deg)`, transformOrigin: "0 50%" }} />
    <CShadow x={260 + 1360 * ub} y={590} w={180} />
    <Boll3 x={260 + 1360 * ub} y={500 + 6 * Math.abs(Math.sin(tt * 12)) * (ub < 1 ? 1 : 0)} s={0.8} id="rcl" />{key(170 + 1360 * ub, 470, tt * 400 * (ub < 1 ? 1 : 0))}
    <CShadow x={260 + 1360 * uw} y={850} w={200} />
    <Weevil3 x={260 + 1360 * uw} y={790} s={0.9} tt={tt * (uw < 0.8 ? 1 : 0)} />{key(150 + 1360 * uw, 750, tt * 400)}
    <Tag x={360} y={150} txt="plant early" s={pop(tt, 0.4, 7, 0.5)} size={66} tt={tt} />
  </>;
}} />;

// m8-9 · la insignia: el saco de lana del agente del condado; la chapa «COUNTY AGENT» se clava en la solapa y brilla
export const HAgentBadge: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const b = pop(tt, 1, 9, 0.38), gl = eio(tt, 2, 2.8);
  return <>
    <CShadow x={960} y={900} w={1000} />
    <svg width={900} height={760} viewBox="0 0 900 760" style={{ position: "absolute", left: 510, top: 200, filter: "drop-shadow(20px 30px 24px rgba(0,0,0,.55))" }}>
      <defs><pattern id="abt" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#5a4a3a" /><path d="M0 12 L12 0" stroke="#6a5a48" strokeWidth={3} /></pattern></defs>
      <path d="M120 760 L80 200 Q200 80 340 60 L450 360 L560 60 Q700 80 820 200 L780 760 Z" fill="url(#abt)" />
      <path d="M340 60 L450 360 L380 400 L270 140 Z M560 60 L450 360 L520 400 L630 140 Z" fill="#4a3a2a" stroke="#2a1e14" strokeWidth={4} />
      <path d="M400 60 L450 300 L500 60 Z" fill="#efe6d0" />{[460, 560, 660].map((y) => <circle key={y} cx={450} cy={y} r={14} fill="#2a1e14" />)}</svg>
    <div style={{ position: "absolute", left: 760, top: 420 - (1 - cl(b)) * 260, transform: `translate(-50%,-50%) perspective(900px) rotateY(${(1 - cl(b)) * 80}deg) scale(${0.6 + 0.4 * cl(b)})`, opacity: cl(b * 3) }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ filter: "drop-shadow(8px 14px 8px rgba(0,0,0,.6))" }}><defs><linearGradient id="abb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2b0" /><stop offset=".4" stopColor="#d8a83a" /><stop offset="1" stopColor="#7a5a10" /></linearGradient></defs>
        <path d={Array.from({ length: 10 }, (_, k) => `${k ? "L" : "M"}${Math.cos(k * 0.628 - 1.57) * (k % 2 ? 70 : 140)} ${Math.sin(k * 0.628 - 1.57) * (k % 2 ? 70 : 140)}`).join(" ") + "Z"} fill="url(#abb)" stroke="#6a4a10" strokeWidth={4} />
        <circle r={62} fill="#c89a2a" stroke="#7a5a10" strokeWidth={4} /><text y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#3a2a0a">COUNTY</text><text y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#3a2a0a">AGENT</text><text y={52} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={18} fill="#3a2a0a">1914</text></svg></div>
    {gl > 0 && gl < 1 && <div style={{ position: "absolute", left: 700 + 120 * gl, top: 360, width: 160, height: 160, background: "radial-gradient(rgba(255,255,230,.95),transparent 60%)", transform: `translate(-50%,-50%) scale(${Math.sin(gl * Math.PI) * 1.4})` }} />}
  </>;
}} />;

// m9-10 · las manos que señalan: la del terrateniente (anillo), la del banquero (puño con gemelo) y la del almacenero (delantal) apuntan al cajón de algodón; la del aparcero, chica, abajo
export const HHandsPoint: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Hs = [[-150, 300, 0.6, "#2a2a3a", "ring"], [30, 1640, 1.3, "#e8e4d8", "cuff"], [200, 260, 2, "#c8bca0", "apron"]] as [number, number, number, string, string][];
  return <>
    <CShadow x={960} y={880} w={600} />
    <Box x={960} y={880} w={460} h={300} d={300} rx={-18} ry={-14} front={WOOD} top="radial-gradient(circle at 30% 40%, #fff 0 14%, transparent 15%), radial-gradient(circle at 60% 60%, #f6f0e0 0 16%, transparent 17%), radial-gradient(circle at 75% 30%, #fff 0 12%, transparent 13%), #e8e0cc" side={WOODSIDE}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 70, color: "#2a170a" }}>COTTON</div></Box>
    {Hs.map(([ang, x, a, sl, k], i) => { const s = eio(tt, a, a + 0.8), y = [300, 420, 760][i], tx = 960 + (x - 960) * (1 - 0.35 * s);
      return <div key={i} style={{ position: "absolute", left: tx, top: y, transform: `translate(-50%,-50%) rotate(${x < 960 ? 20 + (i === 2 ? 10 : 0) : 160}deg) ${x < 960 ? "" : "scaleY(-1)"}`, opacity: cl(s * 3), filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))" }}>
        <svg width={520} height={200} viewBox="0 0 520 200"><rect x={0} y={50} width={220} height={110} fill={sl} />{k === "cuff" && <circle cx={200} cy={105} r={14} fill="#c8a040" />}
          <path d="M220 60 Q300 40 360 70 L500 76 Q520 90 500 104 L380 108 Q390 150 340 160 L240 160 Z" fill="#d8a888" />{k === "ring" && <rect x={330} y={58} width={16} height={60} rx={6} fill="#e8c060" />}</svg></div>; })}
    <svg width={260} height={120} viewBox="0 0 260 120" style={{ position: "absolute", left: 300, top: 900, transform: "rotate(-14deg)", opacity: cl(tt - 3), filter: "drop-shadow(8px 12px 8px rgba(0,0,0,.5))" }}><rect x={0} y={30} width={110} height={60} fill="#6a5a3a" /><path d="M110 34 Q150 24 180 40 L250 44 Q260 52 250 60 L190 62 Q194 86 170 90 L120 90 Z" fill="#8a5a3a" /></svg>
  </>;
}} />;

// m10 · el matraz de Tallulah: sobre el mechero, el polvo blanco gira adentro del vidrio; se pega la etiqueta con la calavera
export const HLabFlask: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lbl = pop(tt, 2.6, 9, 0.38), sw = tt * 2;
  return <>
    <CShadow x={960} y={940} w={700} />
    <svg width={200} height={260} viewBox="0 0 200 260" style={{ position: "absolute", left: 860, top: 690 }}><rect x={60} y={120} width={80} height={140} fill="#5a5e62" /><path d={`M100 120 Q${70 + 10 * Math.sin(tt * 9)} 70 100 ${20 + 6 * Math.sin(tt * 7)} Q${130 - 10 * Math.sin(tt * 9)} 70 100 120`} fill="rgba(90,150,255,.8)" /></svg>
    <div style={{ position: "absolute", left: 960, top: 710, width: 560, height: 560, transform: "translate(-50%,-100%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, clipPath: "polygon(36% 0,64% 0,100% 100%,0 100%)", background: "linear-gradient(rgba(255,255,255,.08),rgba(220,230,235,.25))", overflow: "hidden" }}>
        {Array.from({ length: 70 }, (_, k) => { const a = k * 0.9 + sw * (0.6 + rnd(k) * 0.6), r = 60 + rnd(k + 1) * 200; return <div key={k} style={{ position: "absolute", left: 280 + Math.cos(a) * r, top: 260 + Math.sin(a) * r * 0.35 + rnd(k + 2) * 80, width: 18, height: 18, borderRadius: "50%", background: "rgba(250,250,245,.85)", filter: "blur(2px)" }} />; })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(#f6f6f0,#d8d8d0)" }} /></div>
      <div style={{ position: "absolute", left: 200, top: 0, width: 160, height: 190, border: "6px solid rgba(230,240,245,.75)", borderBottom: "none", background: "linear-gradient(90deg,rgba(255,255,255,.3),rgba(255,255,255,.05))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, clipPath: "polygon(36% 0,64% 0,100% 100%,0 100%)", background: "linear-gradient(100deg, rgba(255,255,255,.4), rgba(255,255,255,.04) 30%, rgba(255,255,255,.03) 70%, rgba(255,255,255,.3))" }} /></div>
    {lbl > 0.01 && <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(-3deg) scale(${lbl})`, padding: "14px 30px", background: "linear-gradient(160deg,#fbf3dc,#e6d6ae)", border: "4px solid #2a1e14", boxShadow: "0 12px 18px rgba(0,0,0,.45)", textAlign: "center" }}>
      <svg width={90} height={90} viewBox="0 0 90 90"><circle cx={45} cy={36} r={26} fill="#2a1e14" /><rect x={30} y={52} width={30} height={18} fill="#2a1e14" /><circle cx={35} cy={34} r={7} fill="#fbf3dc" /><circle cx={55} cy={34} r={7} fill="#fbf3dc" /><path d="M10 74 L80 88 M80 74 L10 88" stroke="#2a1e14" strokeWidth={8} /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#2a1e14" }}>CALCIUM ARSENATE</div></div>}
    <Tag x={1540} y={260} txt="Tallulah, Louisiana" s={pop(tt, 0.6, 7, 0.5)} size={58} tt={tt} />
  </>;
}} />;

// m11 · el fuelle a manivela: cada vuelta suelta una nube blanca que se posa sobre las plantas… y sobre el hombre que camina el surco
export const HHandDuster: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const walk = eio(tt, 0.4, D(h) - 1), x = 300 + 1100 * walk, crank = tt * 500;
  return <>
    {Array.from({ length: 14 }, (_, k) => <svg key={k} width={160} height={260} viewBox="0 0 160 260" style={{ position: "absolute", left: 120 + k * 130, top: 640, overflow: "visible" }}><path d="M80 260 Q76 160 80 60" stroke="#5a7a2a" strokeWidth={8} fill="none" /><path d="M80 160 q60 -30 80 10 q-50 14 -80 -10 M80 110 q-60 -30 -80 10 q50 14 80 -10" fill={(120 + k * 130) < x ? "#c8d0b8" : "#4f7a2a"} /></svg>)}
    {Array.from({ length: 12 }, (_, k) => { const ph = (tt * 0.6 + k / 12) % 1, px = x + 120 + ph * 300 - 200 * ph * ph; return <Puff key={k} x={px} y={520 + ph * 260} r={60 + ph * 140} col="rgba(245,245,238,.85)" o={(1 - ph) * cl(tt - 0.6)} />; })}
    <div style={{ position: "absolute", left: x, top: 920, width: 220, height: 24, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(0,0,0,.4)", filter: "blur(6px)" }} />
    <svg width={340} height={460} viewBox="0 0 340 460" style={{ position: "absolute", left: x - 120, top: 470, overflow: "visible", filter: "drop-shadow(8px 14px 8px rgba(0,0,0,.5))" }}>
      <circle cx={100} cy={50} r={34} fill="#8a5a3a" /><path d="M60 30 L140 30 L128 10 L72 10 Z" fill="#c8b07a" /><rect x={74} y={86} width={52} height={150} rx={20} fill="#6a7a8a" />
      <path d={`M100 236 L${100 + 34 * Math.sin(tt * 6)} 400 M100 236 L${100 - 34 * Math.sin(tt * 6)} 400`} stroke="#3a4a5a" strokeWidth={22} strokeLinecap="round" />
      <rect x={130} y={110} width={150} height={90} rx={30} fill="#9aa0a6" stroke="#5a5e62" strokeWidth={5} /><path d="M280 150 L340 130" stroke="#5a5e62" strokeWidth={16} />
      <g transform={`rotate(${crank} 200 150)`}><line x1={200} y1={150} x2={200} y2={100} stroke="#3a3a3a" strokeWidth={10} /><circle cx={200} cy={100} r={10} fill="#8a6238" /></g></svg>
  </>;
}} />;

// m11-12 · el biplano: en segundos tapa el campo de blanco de punta a punta; abajo, la cuadrilla con fuelles sigue en la primera hilera
export const HDaysMinutes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#8ab0cc 0%,#e0dcc8 46%,#7a9a4a 48%,#4a6a2a 100%)" f={(tt) => {
  const u = eio(tt, 0.4, 3.6), px = -300 + 2500 * u;
  return <>
    {Array.from({ length: 6 }, (_, r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: 560 + r * 80, height: 40 + r * 6, background: "repeating-linear-gradient(90deg,#4f7a2a 0 30px,#5f8a3a 30px 50px)" }} />)}
    <div style={{ position: "absolute", left: 0, top: 520, width: Math.max(0, px + 100), height: 560, background: "linear-gradient(rgba(245,245,238,.0),rgba(245,245,238,.75) 30%,rgba(245,245,238,.55))", filter: "blur(10px)" }} />
    {Array.from({ length: 10 }, (_, k) => px - k * 160 > 0 && <Puff key={k} x={px - 120 - k * 160} y={440 + (k % 2) * 40} r={110 + k * 6} o={0.8 - k * 0.05} />)}
    <svg width={420} height={220} viewBox="0 0 420 220" style={{ position: "absolute", left: px - 210, top: 300, filter: "drop-shadow(10px 30px 16px rgba(0,0,0,.35))" }}><defs><linearGradient id="dmf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0d070" /><stop offset="1" stopColor="#a8801a" /></linearGradient></defs>
      <rect x={60} y={40} width={300} height={22} rx={8} fill="url(#dmf)" /><rect x={60} y={130} width={300} height={22} rx={8} fill="url(#dmf)" />{[110, 310].map((x) => <line key={x} x1={x} y1={62} x2={x} y2={130} stroke="#5a4a2a" strokeWidth={6} />)}
      <path d="M40 100 Q200 70 380 100 Q200 130 40 100 Z" fill="url(#dmf)" /><rect x={20} y={70} width={30} height={60} fill="#3a3a3a" /><ellipse cx={14} cy={100} rx={6} ry={60 * Math.abs(Math.sin(tt * 40))} fill="rgba(60,60,60,.6)" /></svg>
    {[0, 1, 2, 3, 4, 5].map((k) => <svg key={k} width={70} height={140} viewBox="0 0 70 140" style={{ position: "absolute", left: 120 + k * 50, top: 880, filter: "drop-shadow(4px 8px 4px rgba(0,0,0,.4))" }}><circle cx={35} cy={20} r={16} fill="#6a4a3a" /><rect x={22} y={38} width={26} height={70} rx={10} fill="#5a6a7a" /><path d={`M35 108 L${35 + 14 * Math.sin(tt * 5 + k)} 140 M35 108 L${35 - 14 * Math.sin(tt * 5 + k)} 140`} stroke="#3a4a5a" strokeWidth={10} /></svg>)}
    <Tag x={460} y={720} txt="a week on foot" s={pop(tt, 3.8, 7, 0.5)} size={56} tt={tt} /><Tag x={1500} y={120} txt="an hour by air" s={pop(tt, 2.4, 7, 0.5)} size={56} tt={tt} />
  </>;
}} />;

// m12 · del fumigador al pasajero: la boca de la tolva del biplano se tapa con una puerta y aparece una ventanilla; el pasaje de cartón se perfora
export const HBoardingPass: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sw = eio(tt, 1.4, 2.6), tk = pop(tt, 3.6, 8, 0.45), punch = eio(tt, 5.4, 5.8);
  return <>
    <CShadow x={760} y={860} w={1200} />
    <svg width={1200} height={460} viewBox="0 0 1200 460" style={{ position: "absolute", left: 160, top: 380, filter: "drop-shadow(20px 30px 24px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id="bpf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8eef2" /><stop offset=".5" stopColor="#b8c4cc" /><stop offset="1" stopColor="#6a7a84" /></linearGradient></defs>
      <path d="M60 240 Q300 150 1000 180 L1160 120 L1180 200 Q1100 280 1000 300 Q400 340 80 300 Z" fill="url(#bpf)" /><rect x={0} y={200} width={70} height={110} fill="#3a3a3a" />
      <rect x={300} y={60} width={600} height={30} rx={10} fill="#8a9aa4" /><line x1={420} y1={90} x2={420} y2={190} stroke="#5a5e62" strokeWidth={8} /><line x1={780} y1={90} x2={780} y2={190} stroke="#5a5e62" strokeWidth={8} />
      <rect x={400} y={300} width={180} height={80} fill={`rgba(${200 - 100 * sw},${200 - 100 * sw},${200 - 100 * sw},1)`} opacity={1 - sw} />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={340 + k * 140} y={200} width={90} height={60} rx={14} fill="#2a3a4a" opacity={sw} />)}
      {sw < 1 && [0, 1, 2].map((k) => <circle key={k} cx={490} cy={400 + k * 20} r={20 + k * 14} fill="rgba(245,245,238,.6)" opacity={1 - sw} />)}</svg>
    {tk > 0.01 && <div style={{ position: "absolute", left: 1480, top: 360, transform: `translate(-50%,-50%) rotate(6deg) scale(${tk})`, width: 520, height: 260, background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", padding: "24px 30px", boxSizing: "border-box", fontFamily: "Georgia, serif", color: INK }}>
      <div style={{ fontSize: 34, letterSpacing: 4, fontWeight: 900 }}>PASSENGER TICKET</div><div style={{ fontFamily: HAND, fontSize: 64, marginTop: 14 }}>Monroe, La. → Dallas</div><div style={{ fontSize: 30 }}>1929</div>
      <div style={{ position: "absolute", right: 40, top: 40, width: 40, height: 40, borderRadius: "50%", background: "#2a1e14", transform: `scale(${punch})` }} /></div>}
  </>;
}} />;

// m13 · la mesa se raja: de un lado la granja con plata y su tanque de fumigar crece; del otro la casilla del aparcero se inclina y se hunde en la grieta
export const HGapWiden: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 0.6, D(h) - 1), sink = g * 200;
  return <>
    <div style={{ position: "absolute", left: 960 - 20 * g, top: 640, width: 40 + 160 * g, height: 440, background: "linear-gradient(#0a0604,#000)", clipPath: "polygon(30% 0,70% 0,100% 30%,60% 60%,90% 100%,10% 100%,40% 60%,0 30%)" }} />
    <Box x={500 - 60 * g} y={900} w={760} h={140} d={300} rx={-24} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <Box x={1420 + 60 * g} y={900 + sink * 0.3} w={760} h={140} d={300} rx={-24} ry={-g * 6} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <svg width={440} height={360} viewBox="0 0 440 360" style={{ position: "absolute", left: 230 - 60 * g, top: 400 - 40 * g, transform: `scale(${1 + 0.15 * g})`, transformOrigin: "50% 100%", filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))" }}><path d="M20 160 L220 30 L420 160 Z" fill="#8a2a1a" /><rect x={50} y={160} width={340} height={200} fill="#efe6d0" />{[90, 200, 310].map((x) => <rect key={x} x={x} y={200} width={50} height={60} fill="#7a9ab0" />)}<rect x={190} y={280} width={60} height={80} fill="#5a3a22" /></svg>
    <svg width={120} height={200} viewBox="0 0 120 200" style={{ position: "absolute", left: 640 - 60 * g, top: 560 - 30 * g, filter: "drop-shadow(8px 12px 8px rgba(0,0,0,.5))" }}><rect x={20} y={40} width={80} height={150} rx={30} fill="#9aa8a0" /><rect x={50} y={10} width={20} height={34} fill="#3a3a3a" /></svg>
    <svg width={340} height={300} viewBox="0 0 340 300" style={{ position: "absolute", left: 1270 + 60 * g, top: 520 + sink, transform: `rotate(${-14 * g}deg)`, transformOrigin: "0 100%", filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><path d="M10 120 L170 40 L330 120 Z" fill="#6a5a42" /><rect x={30} y={120} width={280} height={180} fill="repeating-linear-gradient(90deg,#8a6a42 0 30px,#6a4a2a 30px 34px)" /><rect x={30} y={120} width={280} height={180} fill="#8a6a42" /><rect x={140} y={200} width={60} height={100} fill="#3a2410" /></svg>
  </>;
}} />;

export const HCC2: Record<string, React.FC<{ t: number; h: H }>> = {
  bollSplit: HBollSplit, beltSweep: HBeltSweep, statueTease: HStatueTease, coffeeRings: HCoffeeRings, cottonWeb: HCottonWeb, storeLedger: HStoreLedger, noFloor: HNoFloor,
  lifeCycle: HLifeCycle, weevilMultiply: HWeevilMultiply, riverCross: HRiverCross, stateDominoes: HStateDominoes, baleShrink: HBaleShrink, fenceWatch: HFenceWatch,
  raceClock: HRaceClock, agentBadge: HAgentBadge, handsPoint: HHandsPoint, labFlask: HLabFlask, handDuster: HHandDuster, daysMinutes: HDaysMinutes,
  boardingPass: HBoardingPass, gapWiden: HGapWiden,
  ...HCC3,
};
