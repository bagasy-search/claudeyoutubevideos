// componentes únicos de hdc28c · segunda mitad (hierro, riego, flores, poda, calendario).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, CLAY, Drop, Flower, LEAF, LEAF2, Leaf, Lemon, Mark, Pot, SOIL, SOIL2, Tree, rnd } from "./heroesL";

// ---- LA HOJA DEL HIERRO: la hoja verde se pone amarilla y las venas quedan verdes, dibujadas ----
export const HIronLeaf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const y = eio(tt, 0.8, 3.0), v = eio(tt, 2.2, 3.6);
  const col = `rgb(${Math.round(63 + 170 * y)},${Math.round(138 + 72 * y)},${Math.round(58 + 10 * y)})`;
  return <>
    <Head tt={tt} kick="REGLA 4 · EL HIERRO" title="AMARILLA CON LAS VENAS VERDES" col={AMB} />
    <Leaf x={960} y={610} s={10} rot={-8} col={col} vein={LEAF2} veins={v} />
    <Tag tt={tt} at={3.2} x={1500} y={300} txt="LAS HOJAS NUEVAS DE ARRIBA" col={TX} size={32} />
    <Tag tt={tt} at={3.8} x={420} y={960} txt="NO ES FALTA DE AGUA" col={RED} size={36} />
    <div style={{ position: "absolute", left: 1420, top: 900, fontFamily: HAND, fontSize: 52, color: GRN, opacity: cl((tt - 4.2) / 0.5), transform: "rotate(-5deg)" }}>como un dibujito</div>
  </>;
}}</Stage>;

// ---- TRES LLAVES QUE TRABAN EL HIERRO: agua de la canilla, ceniza de más, tierra encharcada ----
export const HIronLocks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const R = [["AGUA DURA", "LA DE LA CANILLA"], ["CENIZA DE MÁS", "SUBE LA CAL"], ["TIERRA FRÍA Y MOJADA", "LA RAÍZ NO TOMA"]];
  return <>
    <Head tt={tt} kick="REGLA 4 · POR QUÉ SE TRABA" title="TRES RAZONES" col={RED} />
    {R.map(([a, b], i) => { const s = phys(tt, 0.6 + i * 0.9, 7, 0.45), lk = phys(tt, 1.0 + i * 0.9, 6, 0.5); const x = 360 + i * 600; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 230, top: 330, width: 460, height: 520, borderRadius: 30, background: "linear-gradient(160deg,#352c22,#1a1510)", border: "2px solid rgba(255,255,255,.12)", opacity: cl(s * 2), transform: `translateY(${(1 - s) * 120}px)`, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontSize: 110, fontWeight: 900, color: AMB, marginLeft: 34, marginTop: 10 }}>{i + 1}</div>
        <svg viewBox="0 0 100 110" style={{ position: "absolute", left: 160, top: 150 - (1 - lk) * 60, width: 140, height: 154, opacity: cl(lk * 2) }}><path d="M25 50 V32 a25 25 0 0 1 50 0 V50" stroke="#e8e8ea" strokeWidth={12} fill="none" /><rect x={12} y={48} width={76} height={56} rx={10} fill="#d0d4d8" /><text x={50} y={86} fontSize={28} fontWeight={900} textAnchor="middle" fill="#b8541a">Fe</text></svg>
        <div style={{ position: "absolute", left: 30, right: 30, top: 340, fontSize: 38, fontWeight: 900, color: TX, lineHeight: 1.1 }}>{a}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 440, fontSize: 28, fontWeight: 800, color: DIM }}>{b}</div>
      </div>
    </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- SULFATO vs QUELATO: el polvo de sulfato se queda trabado en la tierra; el quelato pasa a la raíz ----
export const HChelate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 1.0, 4.0);
  return <>
    <Head tt={tt} kick="REGLA 4 · QUÉ COMPRAR" title="SULFATO O QUELATO" col={AMB} />
    {[0, 1].map((j) => { const x = j ? 1380 : 540; return <React.Fragment key={j}>
      <div style={{ position: "absolute", left: x - 280, top: 520, width: 560, height: 360, borderRadius: 20, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
        <svg style={{ position: "absolute", inset: 0, width: 560, height: 360 }}>{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M280 0 Q${200 + i * 26} 160 ${120 + i * 54} 340`} stroke="#e8d8b0" strokeWidth={4} fill="none" />)}</svg>
        {Array.from({ length: 18 }, (_, i) => { const go = cl(k * 1.4 - rnd(i, j) * 0.4); const tx = j ? 120 + (i % 7) * 54 * (0.5 + go * 0.5) + 280 * (1 - go) * 0.0 : 60 + rnd(i, 3) * 440; const ty = j ? 40 + go * (100 + rnd(i) * 180) : 30 + go * 60 + rnd(i, 4) * 30; return <div key={i} style={{ position: "absolute", left: tx, top: ty, width: 14, height: 14, borderRadius: 7, background: j ? "#ff9a5a" : "#b06a3a", boxShadow: j ? "0 0 14px rgba(255,140,60,.8)" : "none" }} />; })}
      </div>
      <div style={{ position: "absolute", left: x - 120, top: 300, width: 240, height: 180, borderRadius: 18, background: j ? "linear-gradient(160deg,#3a6a3a,#1e3a22)" : "linear-gradient(160deg,#6a5a4a,#3a3028)", border: `3px solid ${j ? GRN : "rgba(255,255,255,.2)"}`, textAlign: "center", paddingTop: 34, fontSize: 40, fontWeight: 900, color: TX }}>{j ? "QUELATO" : "SULFATO"}<div style={{ fontSize: 24, color: DIM, marginTop: 8 }}>{j ? "DE HIERRO" : "DE HIERRO"}</div></div>
      <Mark x={x + 210} y={330} p={cl((tt - 3.8) / 0.5)} ok={!!j} s={110} />
    </React.Fragment>; })}
    <Tag tt={tt} at={4.4} x={540} y={950} txt="SE TRABA EN TIERRA CON CAL" col={RED} size={30} />
    <Tag tt={tt} at={4.6} x={1380} y={950} txt="LLEGA A LA RAÍZ · 2-3 SEMANAS" col={GRN} size={30} />
  </>;
}}</Stage>;

// ---- RIEGO: poquito y seguido moja arriba; hondo y espaciado baja hasta el fondo (dos maceta en corte) ----
export const HDeepWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.8, 4.0);
  return <>
    <Head tt={tt} kick="REGLA 5 · EL RIEGO" title="MENOS SEGUIDO, PERO HONDO" col={ICE} />
    {[0, 1].map((j) => { const x = j ? 1360 : 560, depth = j ? k : Math.min(k, 0.22); return <React.Fragment key={j}>
      <div style={{ position: "absolute", left: x - 230, top: 330, width: 460, height: 560, borderRadius: "10px 10px 60px 60px", background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, overflow: "hidden", border: `6px solid ${CLAY}` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 560 * depth, background: "linear-gradient(180deg, rgba(90,140,190,.6), rgba(70,110,160,.35))" }} />
        <svg style={{ position: "absolute", inset: 0, width: 460, height: 560 }}>{Array.from({ length: 8 }, (_, i) => { const L = j ? 420 + rnd(i) * 100 : 120 + rnd(i) * 40; return <path key={i} d={`M230 0 Q${150 + i * 24} ${L * 0.5} ${80 + i * 44} ${L}`} stroke="#e8d8b0" strokeWidth={4} fill="none" />; })}</svg>
      </div>
      {Array.from({ length: j ? 10 : 3 }, (_, i) => <Drop key={i} x={x - 80 + rnd(i, j) * 160} y={250 + ((tt * 260 + i * 37) % 80)} s={1.4} />)}
      <div style={{ position: "absolute", left: x, top: 920, transform: "translateX(-50%)", fontSize: 38, fontWeight: 900, color: j ? GRN : RED, whiteSpace: "nowrap" }}>{j ? "HONDO · RAÍZ ABAJO" : "POQUITO · RAÍZ ARRIBA"}</div>
    </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- LA PRUEBA DEL DEDO: el dedo entra dos falanges; seco abajo = regar, húmedo = esperar ----
export const HFinger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const dn = eio(tt, 0.8, 2.2) - eio(tt, 4.4, 5.2), dry = tt > 2.8;
  return <>
    <Head tt={tt} kick="REGLA 5 · CUÁNDO REGAR" title="LA PRUEBA DEL DEDO" col={AMB} />
    <div style={{ position: "absolute", left: 400, top: 560, width: 1120, height: 420, borderRadius: 20, background: `linear-gradient(180deg, #8a6a4a 0%, #6a4a32 22%, ${SOIL} 23%, ${SOIL2})`, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 1540, top: 600, fontSize: 28, fontWeight: 900, color: DIM }}>SECO</div>
    <div style={{ position: "absolute", left: 1540, top: 700, fontSize: 28, fontWeight: 900, color: DIM }}>2 DEDOS</div>
    <div style={{ position: "absolute", left: 900, top: 260 + dn * 360, width: 110, height: 420, borderRadius: "55px 55px 40px 40px", background: "linear-gradient(90deg,#c08a6a,#e8b898,#c08a6a)", boxShadow: "0 20px 50px rgba(0,0,0,.4)" }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 120 + i * 120, height: 4, borderRadius: 2, background: "rgba(120,70,50,.5)" }} />)}
      <div style={{ position: "absolute", left: 22, top: 12, width: 66, height: 70, borderRadius: "33px 33px 20px 20px", background: "rgba(255,240,230,.6)" }} />
    </div>
    <Big x={420} y={400} txt={dry ? "REGAR" : "ESPERAR"} s={phys(tt, 2.8, 6, 0.5)} col={dry ? ICE : GRN} size={96} sub={dry ? "SECO ABAJO" : "HÚMEDO ABAJO"} />
    <Tag tt={tt} at={3.6} x={1500} y={400} txt="HASTA QUE SALGA POR ABAJO" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- EL ANILLO DE PAJA: el sol pega en la tierra desnuda y la evapora; con paja se queda fresca ----
export const HMulch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const m = eio(tt, 1.6, 3.4);
  return <>
    <Head tt={tt} kick="REGLA 5 · VERANO" title="TÁPALE LA TIERRA" col={GRN} />
    <div style={{ position: "absolute", left: 1520, top: 220, width: 200, height: 200, borderRadius: 100, background: "radial-gradient(circle, #fff6c8, #ffc83a 55%, rgba(255,160,40,0))", boxShadow: "0 0 140px rgba(255,200,80,.7)" }} />
    <svg style={{ position: "absolute", left: 960 - 330, top: 270, width: 660, height: 660, overflow: "visible" }}>
      <circle cx={330} cy={330} r={318} fill={CLAY} /><circle cx={330} cy={330} r={290} fill={SOIL} />
      {Array.from({ length: 120 }, (_, i) => { const a = rnd(i, 3) * Math.PI * 2, r = 70 + rnd(i, 4) * 210, on = cl(m * 1.6 - rnd(i, 5) * 0.6); return on <= 0 ? null : <line key={i} x1={330 + Math.cos(a) * r} y1={330 + Math.sin(a) * r} x2={330 + Math.cos(a) * r + 34 * Math.cos(a * 3)} y2={330 + Math.sin(a) * r + 34 * Math.sin(a * 3)} stroke={i % 3 ? "#e2c27a" : "#c8a45a"} strokeWidth={5} strokeLinecap="round" opacity={on} />; })}
      <circle cx={330} cy={330} r={40} fill="#7a6450" />
      <circle cx={330} cy={330} r={62} fill="none" stroke={AMB} strokeWidth={4} strokeDasharray="8 8" opacity={m} />
    </svg>
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 760 + i * 55, top: 300 - ((tt * 80 + i * 40) % 160), width: 6, height: 60, borderRadius: 3, background: "rgba(255,255,255,.35)", opacity: (1 - m) * 0.9, filter: "blur(2px)" }} />)}
    <Tag tt={tt} at={2.0} x={430} y={540} txt="PAJA · HOJAS SECAS" col={AMB} size={34} />
    <Tag tt={tt} at={3.0} x={430} y={620} txt="SIN TOCAR EL TRONCO" col={TX} size={30} />
    <Tag tt={tt} at={3.8} x={1500} y={900} txt="LA HUMEDAD DURA EL DOBLE" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- LA BOTELLA ENTERRADA: botella con agujeritos, el agua baja gota a gota al pie de las raíces ----
export const HBottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const lvl = 1 - eio(tt, 1.2, 5.0), wet = eio(tt, 1.4, 5.0);
  return <>
    <Head tt={tt} kick="REGLA 5 · CUANDO TE VAS" title="LA BOTELLA ENTERRADA" col={ICE} />
    <div style={{ position: "absolute", left: 460, top: 520, width: 1000, height: 440, borderRadius: 24, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 360 - 240 * wet, top: 60, width: 280 + 480 * wet, height: 300 * wet + 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(80,130,180,.55), rgba(80,130,180,0) 70%)" }} />
      <svg style={{ position: "absolute", inset: 0, width: 1000, height: 440 }}>{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M780 0 Q${640 - i * 30} ${180} ${300 + i * 50} ${380 + rnd(i) * 40}`} stroke="#e8d8b0" strokeWidth={4} fill="none" />)}</svg>
    </div>
    <div style={{ position: "absolute", left: 900, top: 330, width: 140, height: 470, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,.08),rgba(255,255,255,.3))", border: "3px solid rgba(255,255,255,.45)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 460 * lvl, background: "linear-gradient(180deg,rgba(140,200,255,.7),rgba(70,140,210,.8))" }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 30, top: 400 - i * 30, width: 10, height: 10, borderRadius: 5, background: "#111" }} />)}
    </div>
    <div style={{ position: "absolute", left: 935, top: 300, width: 70, height: 40, borderRadius: 8, background: "#3a6aa8" }} />
    {[0, 1, 2, 3].map((i) => <Drop key={i} x={940 + (i % 2) * 60} y={760 + ((tt * 90 + i * 30) % 120)} s={1.2} op={lvl > 0.05 ? 1 : 0} />)}
    <Tag tt={tt} at={2.0} x={480} y={420} txt="3-4 AGUJERITOS ABAJO" col={TX} size={32} />
    <Tag tt={tt} at={3.4} x={1480} y={420} txt="UNA SEMANA SIN TI" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- EL PINCEL: polen de flor a flor, flores en el balcón sin abejas ----
export const HBrush: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #2a2a20, #0a0a06 75%)">{(tt) => {
  const F = [[520, 560], [960, 460], [1400, 600]], seg = cl((tt - 0.8) / 3.6) * 2, i0 = Math.min(1, Math.floor(seg)), f = eio(seg - i0, 0, 1);
  const bx = F[i0][0] + (F[i0 + 1][0] - F[i0][0]) * f, by = F[i0][1] + (F[i0 + 1][1] - F[i0][1]) * f - 140 * Math.sin(f * Math.PI);
  return <>
    <Head tt={tt} kick="REGLA 6 · SIN ABEJAS" title="EL PINCEL DE FLOR EN FLOR" col={AMB} />
    {F.map(([x, y], i) => <React.Fragment key={i}><Flower x={x} y={y} s={4.2} rot={i * 20} />{seg > i - 0.1 && <div style={{ position: "absolute", left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, boxShadow: "0 0 50px rgba(255,220,80,.9)", opacity: cl(seg - i + 0.5) }} />}</React.Fragment>)}
    <div style={{ position: "absolute", left: bx - 12, top: by - 230, width: 24, height: 250, transform: `rotate(${18 + 10 * Math.sin(tt * 8)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 4, top: 0, width: 16, height: 190, borderRadius: 8, background: "linear-gradient(90deg,#8a5a2a,#c48a4a,#8a5a2a)" }} />
      <div style={{ position: "absolute", left: 3, top: 186, width: 18, height: 16, background: "#c0c4c8" }} />
      <div style={{ position: "absolute", left: 0, top: 200, width: 24, height: 50, borderRadius: "6px 6px 12px 12px", background: "linear-gradient(180deg,#f2d64a,#c99a12)" }} />
    </div>
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: bx - 30 + rnd(i) * 60, top: by + 10 + ((tt * 60 + i * 9) % 50), width: 5, height: 5, borderRadius: 3, background: "#ffe060", opacity: 0.8 }} />)}
    <Tag tt={tt} at={4.0} x={960} y={930} txt="AL MEDIODÍA · CADA 2-3 DÍAS" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- EL RALEO: de un racimo de 6 limoncitos quedan 2; los que quedan se inflan ----
export const HThin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const cut = (i: number) => eio(tt, 1.2 + i * 0.4, 1.8 + i * 0.4), grow = eio(tt, 3.4, 5.0);
  const P = [[790, 560], [960, 500], [1130, 560], [840, 720], [1080, 720], [960, 800]], keep = [1];
  let ci = 0;
  return <>
    <Head tt={tt} kick="REGLA 6 · EL RALEO" title="EN CADA RACIMO, UNO" col={GRN} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M960 260 Q960 360 960 440" stroke="#5d7a33" strokeWidth={14} fill="none" />{P.map(([x, y], i) => <path key={i} d={`M960 420 Q${(960 + x) / 2} 420 ${x} ${y - 30}`} stroke="#5d7a33" strokeWidth={6} fill="none" opacity={keep.includes(i) ? 1 : 1 - cut(Math.max(0, P.slice(0, i).filter((_, k) => !keep.includes(k)).length))} />)}</svg>
    {P.map(([x, y], i) => { const k = keep.includes(i); const c = k ? 0 : cut(ci++); return <Lemon key={i} x={x} y={y + c * 320} s={k ? 1.3 + 1.2 * grow : 1.3} g={k ? grow : 0} rot={c * 90} op={1 - c * 0.7} />; })}
    <Leaf x={1110} y={330} s={2.2} rot={20} /><Leaf x={810} y={350} s={2.0} rot={160} col={LEAF2} />
    <Tag tt={tt} at={1.4} x={460} y={520} txt="TAMAÑO DE ARVEJA" col={TX} size={34} />
    <Tag tt={tt} at={4.0} x={1500} y={760} txt="LA FUERZA VA A LOS QUE QUEDAN" col={GRN} size={32} />
  </>;
}}</Stage>;

// ---- EL PARAGUAS CERRADO: copa tupida que no deja pasar el sol; al abrir el centro entra la luz ----
export const HUmbrella: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 1.8, 3.6);
  return <>
    <Head tt={tt} kick="REGLA 7 · LA PODA" title="QUE ENTRE LA LUZ AL CENTRO" col={AMB} />
    <div style={{ position: "absolute", left: 1500, top: 230, width: 160, height: 160, borderRadius: 80, background: "radial-gradient(circle, #fff6c8, #ffc83a 55%, rgba(255,160,40,0))" }} />
    {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1000 + i * 30, top: 300 + i * 12, width: 8, height: 520, background: "linear-gradient(180deg, rgba(255,220,120,.5), rgba(255,220,120,0))", transform: "rotate(28deg)", transformOrigin: "50% 0", opacity: 0.25 + 0.75 * op * (i > 1 && i < 6 ? 1 : 0.3) }} />)}
    {Array.from({ length: 130 }, (_, i) => { const a = rnd(i, 3) * Math.PI * 2, r = Math.sqrt(rnd(i, 4)) * 260; const inner = r < 130; const gone = inner ? eio(tt, 1.8 + rnd(i) * 1.4, 2.4 + rnd(i) * 1.4) : 0; return gone >= 1 ? null : <Leaf key={i} x={960 + Math.cos(a) * r + gone * Math.cos(a) * 300} y={560 + Math.sin(a) * r * 0.8 + gone * 400} s={0.75} rot={rnd(i, 5) * 360 + gone * 200} col={i % 3 ? LEAF : LEAF2} op={1 - gone} />; })}
    <div style={{ position: "absolute", left: 950, top: 560, width: 20, height: 420, background: "#7a6450", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 940, top: 540, width: 40, height: 40, borderRadius: 20, background: `rgba(255,220,120,${0.8 * op})`, boxShadow: `0 0 ${120 * op}px rgba(255,220,120,${op})` }} />
    <Tag tt={tt} at={0.8} x={420} y={440} txt="COPA CERRADA = SOMBRA ADENTRO" col={RED} size={32} />
    <Tag tt={tt} at={3.8} x={420} y={760} txt="MÁS FLORES EN TODA LA COPA" col={GRN} size={32} />
  </>;
}}</Stage>;

// ---- LAS TRES QUE SE SACAN: la rama cruzada, el chupón derecho y el brote del pie (debajo del injerto) ----
export const HThreeCuts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const C = [{ x: 470, at: 0.7, n: "LA CRUZADA", s: "SE ROZA Y SE LASTIMA" }, { x: 960, at: 1.6, n: "EL CHUPÓN", s: "DERECHO PARA ARRIBA, SIN FRUTA" }, { x: 1450, at: 2.5, n: "EL DEL PIE", s: "ABAJO DEL INJERTO: ES LIMÓN AGRIO" }];
  return <>
    <Head tt={tt} kick="REGLA 7 · LA PODA" title="ESTAS TRES SE SACAN" col={RED} />
    {C.map((c, i) => { const s = phys(tt, c.at, 7, 0.45), cut = eio(tt, c.at + 1.3, c.at + 1.9); return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: c.x - 210, top: 300, width: 420, height: 560, borderRadius: 28, background: "linear-gradient(160deg,#2c2a20,#14130e)", border: "2px solid rgba(255,255,255,.12)", opacity: cl(s * 2), transform: `scale(${0.85 + 0.15 * s})` }}>
        <svg viewBox="0 0 420 380" style={{ position: "absolute", left: 0, top: 10, width: 420, height: 380 }}>
          <path d="M210 380 L210 150" stroke="#7a6450" strokeWidth={22} />
          {i === 0 && <><path d="M210 230 Q300 160 360 80" stroke="#7a6450" strokeWidth={12} fill="none" /><path d="M210 200 Q120 150 340 120" stroke="#9a7a5a" strokeWidth={10} fill="none" opacity={1 - cut} transform={`translate(${cut * 40} ${cut * 160})`} /></>}
          {i === 1 && <><path d="M210 220 Q130 180 80 120" stroke="#7a6450" strokeWidth={12} fill="none" /><path d="M210 210 L250 20" stroke="#8aa04a" strokeWidth={10} opacity={1 - cut} transform={`translate(${cut * 30} ${cut * 200})`} /></>}
          {i === 2 && <><path d="M190 300 L230 290" stroke="#c4a87a" strokeWidth={30} strokeLinecap="round" /><path d="M210 350 Q150 320 110 250" stroke="#8aa04a" strokeWidth={9} fill="none" opacity={1 - cut} transform={`translate(${-cut * 30} ${cut * 120})`} /><text x={300} y={300} fontSize={22} fontWeight={900} fill={AMB}>INJERTO</text></>}
          {Array.from({ length: 10 }, (_, k) => <ellipse key={k} cx={210 + Math.cos(k) * 110} cy={110 + Math.sin(k * 1.7) * 60} rx={28} ry={11} fill={k % 2 ? LEAF : LEAF2} transform={`rotate(${k * 37} ${210 + Math.cos(k) * 110} ${110 + Math.sin(k * 1.7) * 60})`} />)}
        </svg>
        <div style={{ position: "absolute", left: 24, right: 24, top: 410, fontSize: 40, fontWeight: 900, color: AMB }}>{c.n}</div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 462, fontSize: 24, fontWeight: 800, color: DIM, lineHeight: 1.15 }}>{c.s}</div>
      </div>
    </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- LA REGLA DEL TERCIO: una torta de copa dividida en 3; nunca más de un pedazo por año ----
export const HThird: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = eio(tt, 0.6, 2.0), pull = eio(tt, 2.4, 3.6), bad = eio(tt, 4.0, 4.8);
  const arc = (a0: number, a1: number) => { const r = 300, p0 = [Math.cos(a0) * r, Math.sin(a0) * r], p1 = [Math.cos(a1) * r, Math.sin(a1) * r]; return `M0 0 L${p0[0]} ${p0[1]} A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]} Z`; };
  return <>
    <Head tt={tt} kick="REGLA 7 · CUÁNTO SE CORTA" title="NUNCA MÁS DE UN TERCIO" col={AMB} />
    <svg style={{ position: "absolute", left: 760, top: 580, width: 1, height: 1, overflow: "visible" }}>
      {[0, 1, 2].map((i) => { const a0 = -Math.PI / 2 + i * (Math.PI * 2 / 3) * s, a1 = -Math.PI / 2 + (i + 1) * (Math.PI * 2 / 3) * s; const mid = (a0 + a1) / 2, d = i === 0 ? 120 * pull : i === 1 ? 120 * bad : 0; return <path key={i} d={arc(a0, a1)} transform={`translate(${Math.cos(mid) * d} ${Math.sin(mid) * d})`} fill={i === 0 ? AMB : i === 1 && bad > 0 ? "#a03a30" : LEAF} stroke="#0a0806" strokeWidth={8} />; })}
    </svg>
    <Big x={1500} y={460} txt="1/3" s={phys(tt, 2.6, 6, 0.5)} col={AMB} size={170} sub="POR AÑO · COMO MÁXIMO" />
    <div style={{ position: "absolute", left: 1500, top: 720, transform: "translateX(-50%)", textAlign: "center", opacity: cl(bad * 2) }}>
      <Mark x={0} y={0} p={bad} s={100} />
      <div style={{ fontSize: 34, fontWeight: 900, color: RED, marginTop: 70, whiteSpace: "nowrap" }}>SI CORTAS MÁS: SÓLO HOJAS</div>
    </div>
  </>;
}}</Stage>;

// ---- LA RAMA DOBLADA: la rama recta sólo hace hojas; atada horizontal se llena de flores ----
export const HBend: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const b = eio(tt, 1.0, 3.0), fl = eio(tt, 3.2, 4.8);
  const tx = 960 + 520 * Math.sin(b * 1.25), ty = 900 - 620 * Math.cos(b * 1.25), cx = 960 + 40 * b, cy = 900 - 380 + 140 * b;
  return <>
    <Head tt={tt} kick="REGLA 7 · EL TRUCO" title="DOBLA LA RAMA" col={GRN} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      <path d={`M960 980 L960 900 Q${cx} ${cy} ${tx} ${ty}`} stroke="#7a6450" strokeWidth={22} fill="none" strokeLinecap="round" />
      <line x1={tx} y1={ty} x2={tx + 40} y2={1000} stroke="#e8e0c8" strokeWidth={4} strokeDasharray="10 6" opacity={b} />
      <rect x={tx + 10} y={990} width={60} height={20} fill="#8a6a4a" opacity={b} />
    </svg>
    {Array.from({ length: 12 }, (_, i) => { const k = (i + 1) / 13, q = 1 - k; const x = q * q * 960 + 2 * q * k * cx + k * k * tx, y = q * q * 900 + 2 * q * k * cy + k * k * ty; return <React.Fragment key={i}>
      <Leaf x={x + (i % 2 ? 40 : -40)} y={y - 20} s={0.8} rot={i % 2 ? -30 : 210} col={i % 3 ? LEAF : LEAF2} />
      {i > 2 && <Flower x={x} y={y - 26} s={0.9 * cl(fl * 3 - (i - 3) * 0.25)} />}
    </React.Fragment>; })}
    <Tag tt={tt} at={0.4} x={480} y={360} txt="PARADA: SÓLO HOJAS" col={RED} size={34} />
    <Tag tt={tt} at={3.4} x={1500} y={330} txt="ACOSTADA: FLORES A LO LARGO" col={GRN} size={34} />
    <div style={{ position: "absolute", left: tx + 90, top: 930, fontFamily: HAND, fontSize: 46, color: TX, opacity: b }}>atada con un hilo</div>
  </>;
}}</Stage>;

// ---- EL CALENDARIO DEL LIMONERO: 12 meses en rueda, cada tarea se enciende en su mes ----
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const M = ["INVIERNO", "PRIMAVERA", "VERANO", "OTOÑO"];
  const T = [[0, "AL FINAL: PODA Y MACETA", AMB], [1, "EN FLOR: QUIETO Y PINCEL", "#f2d64a"], [1, "AL FINAL: RALEO", GRN], [2, "RIEGO HONDO Y BOTELLAS", ICE], [3, "ÚLTIMA MEZCLA", "#d88a4a"]] as const;
  const spin = eio(tt, 0.4, 1.6);
  return <>
    <Head tt={tt} kick="POR ESTACIONES · SIRVE VIVAS DONDE VIVAS" title="EL AÑO DEL LIMONERO" col={AMB} />
    <svg style={{ position: "absolute", left: 620, top: 600, width: 1, height: 1, overflow: "visible" }}>
      <g transform={`rotate(${(1 - spin) * -90})`} opacity={spin}>
        {M.map((m, i) => { const a = -Math.PI / 2 + (i / 4) * Math.PI * 2, on = T.find((x) => x[0] === i); const lit = on ? cl((tt - 1.8 - T.indexOf(on) * 0.6) / 0.4) : 0; return <g key={i}>
          <path d={`M${Math.cos(a - 0.74) * 170} ${Math.sin(a - 0.74) * 170} L${Math.cos(a - 0.74) * 320} ${Math.sin(a - 0.74) * 320} A320 320 0 0 1 ${Math.cos(a + 0.74) * 320} ${Math.sin(a + 0.74) * 320} L${Math.cos(a + 0.74) * 170} ${Math.sin(a + 0.74) * 170} A170 170 0 0 0 ${Math.cos(a - 0.74) * 170} ${Math.sin(a - 0.74) * 170}`} fill={lit > 0 && on ? on[2] : "rgba(255,255,255,.07)"} fillOpacity={0.2 + 0.7 * lit} stroke="rgba(255,255,255,.2)" strokeWidth={2} />
          <text x={Math.cos(a) * 245} y={Math.sin(a) * 245 + 10} fontSize={21} fontWeight={900} fill={TX} textAnchor="middle">{m}</text>
        </g>; })}
      </g>
      <circle r={150} fill="#16140f" />
    </svg>
    <Lemon x={620} y={600} s={2.2} />
    {T.map(([mo, n, c], i) => { const s = phys(tt, 1.8 + i * 0.6, 7, 0.5); return <div key={i} style={{ position: "absolute", left: 1080 + (1 - s) * 80, top: 300 + i * 120, opacity: cl(s * 2), display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 230, height: 70, borderRadius: 14, background: c as string, color: "#14120e", fontWeight: 900, fontSize: 28, textAlign: "center", lineHeight: "70px" }}>{M[mo as number]}</div>
      <div style={{ fontSize: 34, fontWeight: 900, color: TX, whiteSpace: "nowrap" }}>{n}</div>
    </div>; })}
  </>;
}}</Stage>;

// ---- DOCENAS DE LIMONES: cajón que se llena por año, de 4 sueltos a 2-5 docenas ----
export const HDozens: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.8, 4.4), n = Math.round(4 + 56 * k);
  return <>
    <Head tt={tt} kick="LO QUE DA UNA MACETA BIEN LLEVADA" title="2 A 5 DOCENAS POR AÑO" col={GRN} />
    <div style={{ position: "absolute", left: 520, top: 480, width: 880, height: 420, borderRadius: 18, background: "linear-gradient(180deg,#b88a56,#8a6238)", boxShadow: "0 50px 100px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 130, height: 14, background: "rgba(60,40,20,.35)" }} />)}
    </div>
    {Array.from({ length: n }, (_, i) => { const col = i % 12, row = Math.floor(i / 12); const q = phys(tt, 0.8 + i * 0.06, 8, 0.45); return <Lemon key={i} x={580 + col * 70 + (row % 2) * 30} y={860 - row * 70 - (1 - q) * 300} s={0.9 * cl(q * 1.5)} rot={rnd(i) * 40 - 20} />; })}
    <div style={{ position: "absolute", left: 1480, top: 470, textAlign: "center" }}>
      <div style={{ fontSize: 180, fontWeight: 900, color: AMB, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: DIM }}>{n >= 24 ? `${Math.floor(n / 12)} DOCENAS` : "LIMONES"}</div>
    </div>
    <Tag tt={tt} at={4.6} x={960} y={980} txt="SIN COMPRAR NI UNO EN TODO EL AÑO" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- LA BORRA DE CAFÉ: fina y suelta mezclada; en capa gruesa hace costra y el agua resbala ----
export const HCoffee: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = eio(tt, 1.0, 3.2);
  return <>
    <Head tt={tt} kick="REGLA 3 · LA BORRA" title="MEZCLADA, NUNCA EN CAPA" col={AMB} />
    {[0, 1].map((j) => { const x = j ? 1380 : 540; return <React.Fragment key={j}>
      <div style={{ position: "absolute", left: x - 280, top: 520, width: 560, height: 360, borderRadius: 20, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, overflow: "hidden" }}>
        {j === 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "linear-gradient(180deg,#1e140c,#2a1c12)", borderBottom: "4px solid #120c06" }} />
          : Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 7) * 540, top: rnd(i, 8) * 200 * k, width: 8, height: 8, borderRadius: 4, background: "#1a100a" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: j ? 0 : 60, height: (j ? 300 : 20) * k, background: "linear-gradient(180deg, rgba(90,140,190,.5), rgba(90,140,190,0))" }} />
      </div>
      {Array.from({ length: 6 }, (_, i) => <Drop key={i} x={j ? x - 100 + i * 40 : x - 100 + i * 40 + (k * 240 * (i % 2 ? 1 : -1))} y={j ? 470 + ((tt * 140 + i * 20) % 60) : 500 + k * 10} s={1.3} op={j ? 1 : 1 - k * 0.5} />)}
      <Mark x={x + 220} y={460} p={cl((tt - 3.2) / 0.5)} ok={!!j} s={100} />
      <div style={{ position: "absolute", left: x, top: 920, transform: "translateX(-50%)", fontSize: 36, fontWeight: 900, color: j ? GRN : RED, whiteSpace: "nowrap" }}>{j ? "MEZCLADA · EL AGUA ENTRA" : "EN CAPA · HACE COSTRA"}</div>
    </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- LA BOLSA DEL PASTO: mucho nitrógeno, el árbol se llena de hojas y tira las flores ----
export const HGrassBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 1.4, 4.2);
  return <>
    <Head tt={tt} kick="REGLA 3 · EL ERROR DEL VIVERO" title="EL ABONO DEL PASTO NO" col={RED} />
    <div style={{ position: "absolute", left: 300, top: 360, width: 330, height: 460, borderRadius: "30px 30px 16px 16px", background: "linear-gradient(160deg,#4aa04a,#2a6a2a)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotate(${-6 + 4 * Math.sin(tt)}deg)` }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 60, fontSize: 44, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.05 }}>PASTO<br />SIEMPRE<br />VERDE</div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 50, padding: 10, borderRadius: 10, background: "#fff", color: "#2a6a2a", fontSize: 40, fontWeight: 900, textAlign: "center" }}>N 30</div>
    </div>
    <Arrow x1={680} y1={580} x2={880} y2={580} p={cl((tt - 1.0) / 0.5)} col={RED} />
    <Tree x={1250} y={900} s={0.95 + 0.35 * k} tt={tt} seed={9} flowers={Math.round(14 * (1 - k))} />
    <Pot x={1250} y={980} w={240} h={120} />
    {Array.from({ length: 10 }, (_, i) => { const f = cl(k * 1.4 - i * 0.06); return f <= 0 ? null : <Flower key={i} x={1100 + rnd(i) * 300} y={560 + f * 380} s={0.6} rot={f * 300} op={1 - f * 0.6} />; })}
    <Tag tt={tt} at={3.4} x={1640} y={360} txt="PURA HOJA · CERO LIMÓN" col={RED} size={34} />
  </>;
}}</Stage>;
