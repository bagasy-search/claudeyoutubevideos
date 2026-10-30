// ole29a · componentes únicos 13-23 (de la bolsa al pozo sellado)
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// 13 · 6:44 · LA BOLSA QUE SE MULTIPLICA: una bolsa de 2 lb sobre la balanza de almacén; al lado se sirven los platos que rinde
export const APlates: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const kg = 2 * eio(tt, 0.4, 1.4), n = Math.min(12, Math.floor(eio(tt, 1.6, 3.6) * 12.99));
  return <>
    {/* balanza de almacén con plato de bronce y dial */}
    <div style={{ position: "absolute", left: 470, top: 560, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)})` }}>
      <div style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf6ea, #d6ccb4)", boxShadow: "inset 0 0 0 16px #b8892e, 0 30px 70px rgba(0,0,0,.6)", position: "relative" }}>
        <div style={{ position: "absolute", left: 146, top: 40, width: 8, height: 120, background: RED, transformOrigin: "50% 100%", transform: `rotate(${-100 + kg * 50}deg)` }} />
        <div style={{ position: "absolute", width: "100%", top: 190, textAlign: "center", fontWeight: 900, fontSize: 54, color: "#2a2018" }}>{kg.toFixed(1)} lb</div>
      </div>
      <div style={{ position: "absolute", left: 30, top: -120, width: 240, height: 140, borderRadius: "40% 40% 14% 14%", background: "repeating-linear-gradient(90deg,#c2a576 0 6px,#b39566 6px 12px)", transform: `translateY(${(1 - phys(tt, 0.2, 7, 0.45)) * -200}px)` }} />
    </div>
    {Array.from({ length: 12 }, (_, i) => { const on = i < n, s = phys(tt, 1.6 + i * 0.17, 8, 0.45);
      return <div key={i} style={{ position: "absolute", left: 880 + (i % 4) * 230, top: 300 + Math.floor(i / 4) * 210, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #eef1f4, #8b9299)", boxShadow: "inset 0 0 0 14px #b8bec5, 0 16px 34px rgba(0,0,0,.5)", transform: `scale(${on ? 0.5 + 0.5 * s : 0})` }}>
        <div style={{ position: "absolute", left: 34, top: 34, width: 112, height: 112, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #b5622a, #6a2e10)" }} />
      </div>; })}
    <div style={{ position: "absolute", left: 1320, top: 150, transform: "translateX(-50%)", fontWeight: 900, fontSize: 90, color: AMB }}>{n} <span style={{ fontSize: 44, color: DIM }}>SUPPERS</span></div>
  </>;
}}</Stage>;

// 14 · 6:53 · LA LUPA: una lupa de bronce pasa sobre la mesa; bajo el vidrio el poroto blanco y el «yellow eye» se ven gigantes
export const ALoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.6, 2.4) - 0, q = eio(tt, 5.4, 7.2), lx = 620 + 680 * q, ly = 540 + Math.sin(q * Math.PI) * -60;
  const Bean = ({ eye, s }: { eye: boolean; s: number }) => <div style={{ width: 120 * s, height: 78 * s, borderRadius: "50% 50% 46% 54% / 60% 60% 40% 40%", background: "radial-gradient(ellipse at 35% 30%, #fffdf6, #e6dcc6 70%, #c9bca0)", position: "relative", boxShadow: `0 ${6 * s}px ${14 * s}px rgba(0,0,0,.35)` }}>
    {eye && <div style={{ position: "absolute", left: "34%", top: "22%", width: "36%", height: "52%", borderRadius: "50%", background: "radial-gradient(ellipse, #b56a1a, #e8a54a 70%, transparent 72%)" }} />}
  </div>;
  return <>
    {/* la mesa con porotos chicos */}
    {Array.from({ length: 34 }, (_, i) => <div key={i} style={{ position: "absolute", left: 240 + rnd(i, 1) * 1440, top: 300 + rnd(i, 2) * 560, transform: `rotate(${rnd(i, 3) * 360}deg)`, opacity: cl(phys(tt, 0.1 + i * 0.02, 7, 0.5)) }}><Bean eye={i % 2 === 1} s={0.5} /></div>)}
    {/* la lupa */}
    <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(-50%,-50%) scale(${p})` }}>
      <div style={{ width: 460, height: 460, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 22px #b8892e, 0 0 0 30px #6a4a1a, 0 50px 120px rgba(0,0,0,.7)", background: "radial-gradient(circle, #3a2a1c, #1a120c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `rotate(${-12 + 8 * Math.sin(tt * 0.5)}deg)` }}><Bean eye={q > 0.5} s={2.6} /></div>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.35), transparent 40%)" }} />
      </div>
      <div style={{ position: "absolute", left: 360, top: 380, width: 60, height: 300, borderRadius: 30, background: "linear-gradient(90deg,#3a2414,#7a5432)", transform: "rotate(-40deg)", transformOrigin: "50% 0" }} />
    </div>
    <Tag tt={tt} at={2.4} x={620} y={180} txt="NAVY BEAN" col={TX} size={48} />
    <Tag tt={tt} at={7.0} x={1300} y={180} txt="YELLOW EYE · MAINE" col={AMB} size={48} />
  </>;
}}</Stage>;

// 15 · 7:57 · DOS OLLAS, DOS RELOJES: el hervor fuerte con su cronómetro de 10 min contra el hervor lento que no alcanza
export const ABoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const m = 10 * eio(tt, 0.8, 6.5);
  const Pot = ({ x, hard }: { x: number; hard: boolean }) => <div style={{ position: "absolute", left: x, top: 640, transform: "translate(-50%,-50%)" }}>
    <div style={{ width: 420, height: 260, borderRadius: "14px 14px 70px 70px", background: "linear-gradient(180deg,#333338,#111)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 14, right: 14, top: 14, height: 50, borderRadius: "50%", background: "#6a3a1a" }} />
      {Array.from({ length: hard ? 22 : 5 }, (_, i) => { const ph = (tt * (hard ? 1.3 : 0.35) + rnd(i, 1)) % 1; return <div key={i} style={{ position: "absolute", left: 30 + rnd(i, 2) * 340, top: 30 - ph * 20, width: (hard ? 26 : 14) * (1 - ph * 0.5), height: (hard ? 26 : 14) * (1 - ph * 0.5), borderRadius: "50%", border: "3px solid rgba(255,240,220,.8)", opacity: 1 - ph }} />; })}
    </div>
    {Array.from({ length: hard ? 8 : 2 }, (_, i) => { const ph = (tt * 0.3 + rnd(i, 4)) % 1; return <div key={i} style={{ position: "absolute", left: 80 + i * 40, top: -ph * 300, width: 90, height: 90, borderRadius: "50%", background: "rgba(240,244,250,.45)", filter: "blur(20px)", opacity: Math.sin(ph * Math.PI) }} />; })}
    {/* la llama de abajo */}
    <div style={{ position: "absolute", left: 60, right: 60, top: 270, height: hard ? 70 : 26, borderRadius: "50% 50% 10px 10px", background: "radial-gradient(ellipse at 50% 100%, #ffd27a, #ff6a1a 60%, transparent 70%)", opacity: 0.9 }} />
  </div>;
  return <>
    <Pot x={560} hard />
    <Pot x={1360} hard={false} />
    <div style={{ position: "absolute", left: 560, top: 220, transform: "translateX(-50%)", fontWeight: 900, fontSize: 120, color: AMB }}>{String(Math.floor(m)).padStart(2, "0")}:{String(Math.floor((m % 1) * 60)).padStart(2, "0")}</div>
    <Tag tt={tt} at={1.2} x={560} y={380} txt="HARD BOIL · 10 MIN" col={AMB} size={40} />
    <Tag tt={tt} at={2.6} x={1360} y={380} txt="SLOW SIMMER · NOT ENOUGH" col={RED} size={40} />
  </>;
}}</Stage>;

// 16 · 8:18 · LA PRUEBA DEL SOPLIDO: cuchara de lata en macro, el aliento la empuja y la piel del poroto se abre y se enrosca
export const ABlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 55%, #2a2016, #060504 72%)">{(tt) => {
  const blow = eio(tt, 1.0, 2.2), split = eio(tt, 2.4, 3.8);
  return <>
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)}) rotate(-6deg)` }}>
      <div style={{ width: 760, height: 420, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #f2f4f6, #9aa0a8 60%, #5a6068)", boxShadow: "0 50px 120px rgba(0,0,0,.7)" }} />
      <div style={{ position: "absolute", left: 700, top: 180, width: 700, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#d8dce0,#7a8088)" }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 170 + i * 150, top: 130 + (i % 2) * 40, width: 210, height: 140, borderRadius: "50% 50% 46% 54% / 60% 60% 40% 40%", background: "radial-gradient(ellipse at 40% 35%, #e8d4b0, #b88a50)", transform: `rotate(${i * 30 - 20}deg)` }}>
        {/* la piel que se parte y se enrosca */}
        <div style={{ position: "absolute", left: 20, top: 10, width: 170, height: 70, borderRadius: "50% 50% 0 0", background: "linear-gradient(180deg,#c8a070,#a07040)", transformOrigin: "50% 100%", transform: `rotateX(${-140 * split}deg) translateY(${-10 * split}px)`, opacity: 0.95 }} />
        <div style={{ position: "absolute", left: 30, top: 68, width: 150 * split, height: 6, background: "#7a4a1a" }} />
      </div>)}
    </div>
    {/* el soplido: corrientes de aire que barren la cuchara */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: blow * (1 - split * 0.7) }}>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${120} ${380 + i * 50} C 400 ${360 + i * 50}, 600 ${420 + i * 40}, 900 ${400 + i * 46}`} stroke="rgba(230,240,255,.5)" strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="0.25 0.75" strokeDashoffset={-((tt * 0.9 + i * 0.2) % 1)} />)}</svg>
    <Tag tt={tt} at={3.2} x={960} y={170} txt="SKINS SPLIT · READY" col={AMB} size={54} />
  </>;
}}</Stage>;

// 17 · 8:54 · LA OLLA EN DESPIECE: el horno holandés se separa en el aire (tapa, asa, cuerpo, patas) y vuelve a armarse
export const ADutch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ex = eio(tt, 0.6, 1.8) * (1 - eio(tt, 3.6, 4.6)), sp = 1 + 0.03 * Math.sin(tt * 1.2);
  const lab = (at: number, x: number, y: number, s: string) => <Tag tt={tt} at={at} x={x} y={y} txt={s} col={AMB} size={34} anchor="l" />;
  return <>
    <div style={{ position: "absolute", left: 820, top: 560, transform: `translate(-50%,-50%) scale(${sp * phys(tt, 0, 5, 0.6)})` }}>
      {/* asa */}
      <div style={{ position: "absolute", left: -230, top: -300 - 230 * ex, width: 460, height: 230, borderRadius: "230px 230px 0 0", border: "12px solid #3a3a3e", borderBottom: "none" }} />
      {/* tapa con reborde */}
      <div style={{ position: "absolute", left: -250, top: -150 - 150 * ex, width: 500, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%, #4a4a50, #141416)", boxShadow: "inset 0 -8px 0 #0a0a0b" }}>
        <div style={{ position: "absolute", left: 220, top: -26, width: 60, height: 36, borderRadius: 10, background: "#2a2a2d" }} /></div>
      {/* cuerpo */}
      <div style={{ position: "absolute", left: -240, top: -110, width: 480, height: 300, borderRadius: "16px 16px 90px 90px", background: "linear-gradient(90deg,#111 0%,#3a3a40 40%,#16161a 100%)", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }} />
      {/* patas */}
      {[-150, 0, 150].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 22, top: 180 + 120 * ex, width: 44, height: 70, borderRadius: "8px 8px 20px 20px", background: "#1d1d20" }} />)}
    </div>
    {lab(1.2, 1180, 270, "WIRE BAIL")}
    {lab(1.5, 1180, 410, "TIGHT LID · LIP")}
    {lab(1.8, 1180, 560, "HEAVY CAST IRON")}
    {lab(2.1, 1180, 770, "THREE LEGS")}
  </>;
}}</Stage>;

// 18 · 9:57 · LAS CAPAS: corte de la olla; caen de a una con su golpe: tocino, cebolla, porotos, y arriba el pedazo grande marcado
export const ALayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = [["SALT PORK", "#e9c9b0", 0.6], ["ONION", "#f2ead2", 2.0], ["BEANS", "#d9c9a8", 3.6], ["SCORED PORK", "#d8a58a", 6.0]] as [string, string, number][];
  const top = 820;
  let y = top;
  return <>
    <div style={{ position: "absolute", left: 960 - 330, top: 300, width: 660, height: 560, borderRadius: "16px 16px 110px 110px", background: "linear-gradient(90deg,#141416,#2c2c30,#141416)", boxShadow: "0 40px 100px rgba(0,0,0,.7)" }} />
    <div style={{ position: "absolute", left: 960 - 300, top: 320, width: 600, height: 520, borderRadius: "10px 10px 96px 96px", background: "#0a0a0b", overflow: "hidden" }}>
      {L.map(([n, c, at], i) => { const hgt = [70, 60, 200, 60][i]; y -= hgt; const s = phys(tt, at, 8, 0.45), yy = y - 320;
        return <div key={i} style={{ position: "absolute", left: i === 3 ? 160 : 0, right: i === 3 ? 160 : 0, top: yy - (1 - cl(s)) * 600, height: hgt, background: i === 2 ? `radial-gradient(circle at 20% 30%, ${c} 18%, transparent 19%) 0 0/36px 30px, ${c}` : `repeating-linear-gradient(90deg, ${c} 0 40px, rgba(0,0,0,.08) 40px 44px)`, borderRadius: i === 3 ? 16 : 0, boxShadow: "inset 0 -4px 0 rgba(0,0,0,.2)" }} />; })}
    </div>
    {L.map(([n, , at], i) => <Tag key={i} tt={tt} at={at + 0.3} x={1330} y={[760, 700, 580, 430][i]} txt={n} col={i === 3 ? AMB : TX} size={36} anchor="l" />)}
  </>;
}}</Stage>;

// 19 · 10:12 · LA JARRA DE MIEL DE ARCE: el balde del campamento de azúcar se inclina y el chorro dorado llena la medida
export const AJug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tilt = 70 * eio(tt, 0.6, 1.8) * (1 - eio(tt, 5.2, 6.2)), pour = cl((tilt - 40) / 30), fill = eio(tt, 1.6, 5.2);
  return <>
    {/* el arce con la canilla y el balde (campamento de azúcar) */}
    <div style={{ position: "absolute", left: 200, top: 0, width: 220, height: 1080, background: "linear-gradient(90deg,#3a2a1e,#6a5040,#3a2a1e)", opacity: cl(tt * 2) }} />
    <div style={{ position: "absolute", left: 700, top: 360, transformOrigin: "20% 80%", transform: `rotate(${tilt}deg)` }}>
      <div style={{ width: 230, height: 260, borderRadius: "20px 20px 40px 40px", background: "linear-gradient(90deg,#8a9098,#d8dce0,#8a9098)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 10, right: 10, top: 10, height: 30, borderRadius: "50%", background: "#c07a20" }} />
    </div>
    {pour > 0 && <div style={{ position: "absolute", left: 930, top: 440, width: 22 * pour, height: 380, borderRadius: 11, background: "linear-gradient(90deg,#a85a10,#ffb54a,#a85a10)" }} />}
    <div style={{ position: "absolute", left: 820, top: 800, width: 260, height: 220, borderRadius: "10px 10px 30px 30px", border: "8px solid rgba(220,240,255,.6)", overflow: "hidden", background: "rgba(200,230,255,.06)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200 * fill, background: "linear-gradient(180deg,#e89a2a,#8a4a0a)" }} />
    </div>
    <Tag tt={tt} at={2.0} x={1300} y={420} txt="MAPLE SYRUP" col={AMB} size={60} anchor="l" />
    <Tag tt={tt} at={3.0} x={1300} y={520} txt="FROM THE SUGAR CAMP" col={DIM} size={36} anchor="l" />
  </>;
}}</Stage>;

// 20 · 11:23 · DOS TERMÓMETROS DE ESFERA: la hornalla de casa contra la cama de brasas del pozo; la segunda aguja pasa de largo
export const AShock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 60%, #2a1208, #060302 75%)">{(tt) => {
  const Dial = ({ x, v, lab, col }: { x: number; v: number; lab: string; col: string }) => <div style={{ position: "absolute", left: x, top: 500, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)})` }}>
    <div style={{ width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf6ea, #cfc6b0)", boxShadow: `inset 0 0 0 20px #555a60, 0 0 ${120 * cl(v - 0.8)}px rgba(255,90,30,.7)`, position: "relative" }}>
      <svg width={440} height={440} viewBox="-220 -220 440 440" style={{ position: "absolute", inset: 0 }}>
        <path d="M -150 120 A 190 190 0 1 1 150 120" stroke="#ddd" strokeWidth={18} fill="none" />
        <path d="M 110 -150 A 190 190 0 0 1 150 120" stroke={RED} strokeWidth={18} fill="none" />
        <g transform={`rotate(${-140 + 280 * Math.min(1.04, v)})`}><path d="M -8 16 L 0 -170 L 8 16 Z" fill="#1b1b1b" /></g><circle r={18} fill="#1b1b1b" />
      </svg>
    </div>
    <div style={{ marginTop: 26, textAlign: "center", fontWeight: 900, fontSize: 40, letterSpacing: 3, color: col }}>{lab}</div>
  </div>;
  return <>
    <Dial x={560} v={0.55 * eio(tt, 0.6, 2.2)} lab="YOUR STOVE" col={TX} />
    <Dial x={1360} v={1.0 * eio(tt, 1.6, 4.2) + 0.02 * Math.sin(tt * 3)} lab="BED OF COALS" col={AMB} />
    <Tag tt={tt} at={4.6} x={960} y={150} txt="HOTTER THAN ANY STOVE" col={RED} size={50} />
  </>;
}}</Stage>;

// 21 · 12:47 · EL NIVEL DEL AGUA: con la tapa floja el vapor se escapa y el agua baja hasta dejar los porotos secos y pegados
export const ASeal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const p = eio(tt, 0.4, 4.4);
  return <>
    <div style={{ position: "absolute", left: 960 - 300, top: 330, width: 600, height: 520, borderRadius: "16px 16px 100px 100px", background: "linear-gradient(90deg,#141416,#2c2c30,#141416)", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 300, borderRadius: "0 0 90px 90px", background: `radial-gradient(circle at 30% 40%, #d9c9a8 16%, transparent 17%) 0 0/34px 28px, ${p > 0.85 ? "#6a3a1a" : "#8a5a2a"}` }} />
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 420 * (1 - p) + 40 * p, background: "rgba(150,90,40,.55)", borderTop: "4px solid rgba(255,220,160,.6)" }} />
    </div>
    {/* la tapa floja, ladeada, y el vapor que se va */}
    <div style={{ position: "absolute", left: 960 - 310, top: 300, width: 620, height: 50, borderRadius: "50%", background: "#1d1d20", transform: `rotate(${-5}deg) translateY(-14px)`, transformOrigin: "0 50%" }} />
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.35 + rnd(i, 1)) % 1; return <div key={i} style={{ position: "absolute", left: 1180 + ph * 160 + Math.sin(ph * 6 + i) * 30, top: 290 - ph * 260, width: 80, height: 80, borderRadius: "50%", background: "rgba(240,244,250,.5)", filter: "blur(18px)", opacity: Math.sin(ph * Math.PI) * (1 - p * 0.6) }} />; })}
    <Tag tt={tt} at={2.0} x={1400} y={500} txt="STEAM TAKES WATER" col={ICE} size={40} anchor="l" />
    <Tag tt={tt} at={4.4} x={1400} y={720} txt="DRY BY MORNING" col={RED} size={44} anchor="l" />
  </>;
}}</Stage>;

// 22 · 13:20 · EL ALAMBRE: el alambre se enrosca en el asa, se estira hasta arriba del pozo y deja un ojal para la pala
export const AWire: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#0e1620 0%,#141c26 40%,#3a281b 41%,#120c08 100%)">{(tt) => {
  const coil = eio(tt, 0.4, 2.2), up = eio(tt, 2.0, 3.8), loop = eio(tt, 3.6, 4.8);
  return <>
    <div style={{ position: "absolute", left: 960 - 200, top: 720, width: 400, height: 220, borderRadius: "14px 14px 70px 70px", background: "linear-gradient(90deg,#111,#36363a,#111)" }} />
    <div style={{ position: "absolute", left: 960 - 170, top: 590, width: 340, height: 170, borderRadius: "170px 170px 0 0", border: "10px solid #4a4a50", borderBottom: "none" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {/* vueltas en el asa */}
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={960} cy={594 + i * 7} rx={22} ry={9} fill="none" stroke="#c9ccd0" strokeWidth={4} opacity={cl(coil * 8 - i)} />)}
      <path d="M 960 594 C 960 520, 980 470, 960 380" stroke="#c9ccd0" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${up} 1`} />
      <circle cx={960} cy={350} r={30} fill="none" stroke="#c9ccd0" strokeWidth={5} pathLength={1} strokeDasharray={`${loop} 1`} />
    </svg>
    <Tag tt={tt} at={2.6} x={1080} y={360} txt="UP OUT OF THE HOLE" col={AMB} size={40} anchor="l" />
    <Tag tt={tt} at={4.6} x={1080} y={440} txt="NO DIGGING BLIND" col={TX} size={34} anchor="l" />
  </>;
}}</Stage>;

// 23 · 14:12 · EL MONTÍCULO QUE RESPIRA: hilitos de vapor salen de la tierra; la pala apisona cada uno hasta que no sale más
export const ABreath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#0b1220,#1a2436 55%,#d6dee9 56%,#9aa6b8)">{(tt) => {
  const spots = [[700, 0.5], [960, 1.9], [1220, 3.4]] as [number, number][];
  return <>
    <div style={{ position: "absolute", left: 960, top: 640, width: 900, height: 260, transform: "translate(-50%,-50%)", borderRadius: "50% 50% 10px 10px", background: "radial-gradient(ellipse at 50% 30%, #6a5040, #3a281b 70%)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    {spots.map(([x, at], i) => { const tamp = phys(tt, at + 1.0, 8, 0.4), closed = tt > at + 1.2;
      return <div key={i}>
        {Array.from({ length: 6 }, (_, k) => { const ph = (tt * 0.45 + rnd(i * 6 + k, 1)) % 1; return <div key={k} style={{ position: "absolute", left: x - 20 + Math.sin(ph * 5 + k) * 20, top: 540 - ph * 260, width: 50, height: 50, borderRadius: "50%", background: "rgba(240,244,250,.55)", filter: "blur(12px)", opacity: Math.sin(ph * Math.PI) * (closed ? cl(1 - (tt - at - 1.2) * 2) : cl(tt * 2)) }} />; })}
        {/* la pala que apisona */}
        {tt > at && tt < at + 2.2 && <div style={{ position: "absolute", left: x - 70, top: 280 + 200 * cl(tamp) - 200, width: 140, height: 120, borderRadius: "10px 10px 60px 60px", background: "linear-gradient(180deg,#9aa0a8,#5a6068)" }}><div style={{ position: "absolute", left: 60, top: -280, width: 20, height: 280, background: "#8a6236" }} /></div>}
      </div>; })}
    <Tag tt={tt} at={0.8} x={960} y={200} txt="STEAM = A LEAK" col={ICE} size={50} />
    <Tag tt={tt} at={5.2} x={960} y={900} txt="MORE DIRT · PACK IT" col={AMB} size={44} />
  </>;
}}</Stage>;
