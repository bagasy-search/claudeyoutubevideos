// ruth29c · ronda 3 del evaluador (29-oct): todo dentro del cuadro, más grande, la acción del gancho a los 0,3 s, nada apoyado donde debería colgar.
import React from "react";
import { cl, eio } from "./hkit";
import { S, D, bt, C, Prop, Dust, Cam, Mesa, Luz, land, swing, SER } from "./pk";

const Tag: React.FC<{ x: number; y: number; txt: string; size?: number; r?: number; o?: number; edge?: string }> = ({ x, y, txt, size = 56, r = 0, o = 1, edge = "#6a4a22" }) => <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) rotate(${r}deg)`, transformOrigin: "50% 0", opacity: o, padding: `${size * 0.16}px ${size * 0.36}px`, borderRadius: size * 0.14, borderTop: `${size * 0.16}px solid ${edge}`, background: "linear-gradient(#f0e0b8,#c8a468)", boxShadow: "0 14px 18px rgba(0,0,0,.5), inset 0 3px 0 rgba(255,250,230,.6)", fontFamily: SER, fontWeight: 900, fontSize: size, color: "#3a2410", whiteSpace: "nowrap" }}>{txt}</div>;
const Sombra: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.5 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.06, width: w, height: w * 0.12, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(0,0,0,${o}),transparent 70%)` }} />;
const Tierra = "radial-gradient(circle at 20% 30%,rgba(60,40,20,.25) 2px,transparent 3px) 0 0/26px 22px, radial-gradient(circle at 70% 60%,rgba(255,240,200,.15) 2px,transparent 3px) 0 0/34px 30px";

// la red del algodón: el fardo crece desde la mesa; tres sogas gruesas trenzadas a BANK/STORE/LAND (tarjetas colgadas de la soga); cada beat una soga se tira con resorte, la onda corre por las otras, el fardo se ladea y saltan motas
const HCottonWeb: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), A = [[230, 250, "BANK", 0.25], [1690, 250, "STORE", bt(h, 0, d * 0.38)], [960, 1010, "LAND", bt(h, 1, d * 0.68)]] as [number, number, string, number][], cx = 960, cy = 560;
  const pull = (k: number) => eio(tt, A[k][3], A[k][3] + 0.35) * (1 - eio(tt, A[k][3] + 1.2, A[k][3] + 1.8)), wave = (k: number) => A.reduce((s, a, j) => s + (j === k ? 0 : swing(tt, a[3] + 0.3, 1, 8, 2.5)), 0);
  const rise = land(tt, 0, 260), lean = 7 * (pull(0) * -1 + pull(1) * 1) + 3 * pull(2);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={760} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{A.map(([x0, y0], k) => { const p = pull(k), x = x0 + (x0 - cx) * 0.08 * p, y = y0 + (y0 - cy) * 0.08 * p, sag = 60 * (1 - p) + 40 * wave(k), mx = (x + cx) / 2 + (k === 2 ? sag : 0), my = (y + cy) / 2 + (k === 2 ? 0 : sag); const dd = `M${x} ${y} Q${mx} ${my} ${cx} ${cy}`; return <g key={k}>
      <path d={dd} stroke="rgba(0,0,0,.3)" strokeWidth={34} fill="none" transform="translate(10,18)" />
      <path d={dd} stroke="#a8844a" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={dd} stroke="#6a4a22" strokeWidth={30} fill="none" strokeDasharray="10 12" strokeLinecap="butt" opacity={0.7} />
      <path d={dd} stroke="rgba(255,240,200,.35)" strokeWidth={6} fill="none" transform="translate(0,-8)" /></g>; })}</svg>
    {A.map(([x0, y0, nm], k) => { const p = pull(k), x = x0 + (x0 - cx) * 0.08 * p, y = y0 + (y0 - cy) * 0.08 * p, tx = (x + cx) / 2 * 0.6 + x * 0.4, ty = (y + cy) / 2 * 0.6 + y * 0.4 + (k === 2 ? -60 : 30); return <div key={k}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${tx} ${ty} L${tx} ${ty + 34}`} stroke="#3a2a1a" strokeWidth={3} /></svg>
      <Tag x={tx} y={ty + 30} txt={nm} size={60} r={swing(tt, A[k][3], 10, 6, 2) + 6 * wave(k)} /></div>; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 820px", transform: `rotate(${lean}deg) translateY(${rise.dy}px)` }}>
      <Sombra x={960} y={820} w={640} o={0.55} />
      <Prop id="cotton_bale" x={960} y={820} w={620} sq={rise.sq} sh={0} /></div>
    {A.map((a, k) => [0, 1, 2].map((j) => { const p = cl((tt - a[3] - 0.3) / 0.9); if (p <= 0 || p >= 1) return null; const vx = (j - 1) * 160 + (k === 0 ? -80 : k === 1 ? 80 : 0); return <Prop key={k + "_" + j} id="cotton_boll" x={960 + vx * p} y={540 - 380 * p + 520 * p * p} w={90} r={p * 300} sh={0} />; }))}
  </Cam>;
}} />;

// la tienda de raya: balanza colgante de almacén con plato; saco, café y zapato caen al plato de a uno, el plato baja y la aguja gira con rebote; al final la bolsa de algodón llega y casi no la mueve
const HStoreLedger: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#3a2818 0 5px,#4c3420 5px 200px)" f={(tt) => {
  const d = D(h), its = [["flour_sack", 230, 0.33, -150], ["coffee_bag", 180, 0.27, 20], ["shoe", 230, 0.2, 170]] as [string, number, number, number][], at = (k: number) => 0.25 + k * (d * 0.55) / 3, cot = d * 0.75;
  const tgt = its.reduce((s, it, k) => s + (tt > at(k) + 0.45 ? it[2] : 0), 0) + (tt > cot + 0.45 ? 0.04 : 0), last = [...its.map((_, k) => at(k)), cot].filter((a) => tt > a + 0.45).pop() ?? -9, bump = swing(tt, last + 0.45, 1, 7, 2.6);
  const dial = tgt + 0.06 * bump, W = 340, Hh = W * 698 / 351, yb = 560, cx = 960, dy = 160 * dial, pan = yb + 150 + dy;
  return <Cam tt={tt} d={d} z={0.04} fy={520}>
    <Luz />
    <Mesa y0={960} />
    <div style={{ position: "absolute", left: cx - 6, top: -20, width: 12, height: yb - Hh + 40, background: "linear-gradient(90deg,#3a3a3a,#8a8a8a,#3a3a3a)" }} />
    <Prop id="spring_scale" x={cx} y={yb} w={W} sh={0} />
    <div style={{ position: "absolute", left: cx - 4, top: yb - Hh * 0.586 - 4, width: 8, height: 8, transformOrigin: "4px 4px", transform: `rotate(${330 * dial}deg)` }}>
      <div style={{ position: "absolute", left: 1, top: -Hh * 0.13, width: 6, height: Hh * 0.13 + 6, background: "#c41e1e", borderRadius: 3, boxShadow: "0 2px 3px rgba(0,0,0,.5)" }} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${cx} ${yb - 10} L${cx} ${yb + 20 + dy * 0.5}`} stroke="#5a5a5a" strokeWidth={8} />
      {[-1, 0, 1].map((s) => <path key={s} d={`M${cx} ${yb + 20 + dy * 0.5} L${cx + s * 270} ${pan}`} stroke="#7a7a7a" strokeWidth={5} strokeDasharray="10 4" />)}</svg>
    {its.map(([id, w, , ox], k) => { const L = land(tt, at(k), 520); if (!L.on) return null; return <Prop key={id} id={id} x={cx + ox} y={pan + L.dy} w={w} sq={L.sq} sh={0} />; })}
    {(() => { const L = land(tt, cot, 520); return L.on && <Prop id="cotton_boll" x={cx + 60} y={pan - 150 + L.dy} w={130} sh={0} />; })()}
    <div style={{ position: "absolute", left: cx - 300, top: pan, width: 600, height: 40, borderRadius: "0 0 50% 50% / 0 0 100% 100%", background: "linear-gradient(#e8c070,#9a6a24)", boxShadow: "0 14px 16px rgba(0,0,0,.45), inset 0 4px 0 rgba(255,245,210,.6)" }} />
    <Sombra x={cx} y={1000} w={500 - 60 * dial} o={0.35} />
  </Cam>;
}} />;

// la demostración: cerca baja de tablas en primer plano; detrás el campo de algodón en surcos; cabezas grandes con sombrero asoman de a una por encima de la cerca y se quedan mirando
const HFenceWatch: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9ab8d0 0%,#e8e0c0 40%,#8a7a42 41%,#5a4a26 100%)" f={(tt) => {
  const d = D(h), N = 4, X = [520, 820, 1110, 1400];
  return <Cam tt={tt} d={d} z={0.05} fy={600}>
    {Array.from({ length: 6 }, (_, r) => { const z = 0.35 + r * 0.16, y = 470 + r * r * 14 + r * 26; return Array.from({ length: Math.ceil(2200 / (240 * z)) }, (_, c) => <Prop key={r + "_" + c} id="cotton_plant" x={-100 + c * 240 * z + (r % 2) * 120 * z} y={y} w={190 * z} sh={0} />); })}
    {X.map((x, k) => { const L = cl((tt - 0.25 - k * (d - 1.4) / N) / 0.7), up = L <= 0 ? 0 : 1 - Math.exp(-6 * L) * Math.cos(9 * L), yh = 700 - 380 * up, look = 6 * Math.sin(tt * 1.4 + k); return <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${x}px ${yh + 60}px`, transform: `rotate(${look}deg)` }}>
      <div style={{ position: "absolute", left: x - 95, top: yh, width: 190, height: 230, borderRadius: "46% 46% 40% 40%", background: "radial-gradient(circle at 40% 35%,#a07a5a,#5a3a24 75%)", boxShadow: "inset -12px -10px 20px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: x - 150, top: yh + 200, width: 300, height: 200, borderRadius: "40% 40% 0 0", background: ["#4a5a7a", "#7a4a3a", "#5a6a3a", "#6a5a4a"][k] }} />
      <Prop id="farmer_hat" x={x} y={yh + 50} w={320} r={(k - 1.5) * 5} sh={0} /></div>; })}
    <Sombra x={960} y={1060} w={1500} o={0.5} />
    <Prop id="fence_section" x={960} y={1110} w={1100} sh={0} />
  </Cam>;
}} />;

// en minutos y no en días: surcos en perspectiva hasta el horizonte; el biplano cruza bajo con su sombra en el campo; la nube blanca borra hilera tras hilera; en primer plano una sola hilera a mano todavía sin terminar
const HDaysMinutes: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#8ab0d0 0%,#e8e4d0 44%,#7a7a3a 45%,#4a4a22 100%)" f={(tt) => {
  const d = D(h), px = 120 + 1500 * eio(tt, 0, d * 0.8), VX = 960, VY = 486, R = 9;
  return <Cam tt={tt} d={d} z={0.04}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: R * 2 + 1 }, (_, k) => { const bx = 960 + (k - R) * 260; return <polygon key={k} points={`${VX + (k - R) * 6},${VY} ${VX + (k - R) * 6 + 3},${VY} ${bx + 70},1080 ${bx - 70},1080`} fill={k % 2 ? "#3a5a1e" : "#5a4a26"} opacity={0.85} />; })}</svg>
    {Array.from({ length: R * 2 + 1 }, (_, k) => k % 2 ? Array.from({ length: 6 }, (_, j) => { const f = (j + 1) / 6, x = VX + ((k - R) * 260) * f * f, y = VY + (1080 - VY) * f * f; const cov = cl((px - x) / 220); return <div key={k + "_" + j}><Prop id="cotton_plant" x={x} y={y} w={160 * f * f + 20} sh={0} />
      {cov > 0 && <div style={{ position: "absolute", left: x - 140 * f * f - 20, top: y - 180 * f * f - 30, width: 280 * f * f + 40, height: 200 * f * f + 40, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(248,248,240,.95),rgba(248,248,240,0) 70%)", opacity: cov }} />}</div>; }) : null)}
    <div style={{ position: "absolute", left: -200, top: 360, width: Math.max(0, px + 100), height: 260, background: "linear-gradient(90deg,rgba(250,250,245,.0),rgba(250,250,245,.55) 70%,rgba(250,250,245,.0))", filter: "blur(18px)" }} />
    <Sombra x={px + 80} y={880} w={520} o={0.4} />
    <Prop id="biplane" x={px} y={470 + 14 * Math.sin(tt * 2.2)} w={640} r={-2 + 2 * Math.sin(tt * 1.3)} sh={0} />
  </Cam>;
}} />;

// no fue sólo el gorgojo: una soga gruesa de cinco hebras de color trenzadas cruza el cuadro entre dos postes; una hebra clara corre al lado con el gorgojo encima; la clara se corta, el gorgojo cae, la soga ni se mueve; cada hebra con su tarjeta colgada
const HReasonBar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = Math.max(0.6, d * 0.45), sn = cl((tt - cut) / 0.6), RS = ["JIM CROW", "WAGES", "LYNCHING", "WAR JOBS", "FLOODS"], COL = ["#9a3a2a", "#3a5a8a", "#2a2a2a", "#6a7a2a", "#3a7a8a"], y0 = 470, x0 = 180, x1 = 1740, tw = eio(tt, 0, 0.6);
  const strand = (k: number) => Array.from({ length: 41 }, (_, i) => { const x = x0 + (x1 - x0) * i / 40; return `${i ? "L" : "M"}${x} ${y0 + 26 * Math.sin(i * 0.9 + k * 1.26) + 14 * tw * Math.sin(i * 0.16)}`; }).join(" ");
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={820} />
    {[x0 - 40, x1 + 40].map((x) => <div key={x} style={{ position: "absolute", left: x - 34, top: 340, width: 68, height: 560, borderRadius: 8, background: "linear-gradient(90deg,#5a3a1a,#9a6a3a,#4a2a10)", boxShadow: "0 20px 20px rgba(0,0,0,.5)" }} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={strand(0)} stroke="rgba(0,0,0,.3)" strokeWidth={70} fill="none" transform="translate(10,40)" />
      {RS.map((_, k) => <path key={k} d={strand(k)} stroke={COL[k]} strokeWidth={24} fill="none" strokeLinecap="round" />)}
      {RS.map((_, k) => <path key={"h" + k} d={strand(k)} stroke="rgba(255,255,255,.22)" strokeWidth={5} fill="none" transform="translate(0,-6)" />)}
      {sn <= 0 ? <path d={`M${x0} 600 Q960 ${620 + 20 * Math.sin(tt * 3)} ${x1} 600`} stroke="#efe4c8" strokeWidth={12} fill="none" /> : <>
        <path d={`M${x0} 600 Q${560} ${600 + 260 * sn} ${940 - 260 * sn} ${640 + 300 * sn}`} stroke="#efe4c8" strokeWidth={12} fill="none" />
        <path d={`M${x1} 600 Q${1360} ${600 + 260 * sn} ${980 + 260 * sn} ${640 + 300 * sn}`} stroke="#efe4c8" strokeWidth={12} fill="none" /></>}</svg>
    {sn > 0 && sn < 0.5 && <div style={{ position: "absolute", left: 960 - 110, top: 600 - 110, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", opacity: 1 - sn / 0.5 }} />}
    <Prop id="weevil" x={960} y={sn > 0 ? Math.min(860, 596 + 600 * sn * sn) : 596 + 4 * Math.sin(tt * 9)} w={230} r={sn * 160} sh={sn >= 0.98 ? 1 : 0} />
    {sn >= 0.98 && <Dust tt={tt} at={cut + 0.6} x={960} y={860} w={220} />}
    {RS.map((txt, k) => { const x = 340 + k * 310, a = 0.15 + k * 0.15; return <div key={k} style={{ opacity: eio(tt, a, a + 0.3) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${x} ${y0 - 20} L${x} ${y0 - 130}`} stroke={COL[k]} strokeWidth={4} /></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-240}px)` }}><Tag x={x} y={y0 - 30 - (k % 2) * 0} txt={txt} size={40} edge={COL[k]} r={swing(tt, a, 8, 5, 2)} /></div></div>; })}
  </Cam>;
}} />;

// se cobraron el impuesto: urna de madera con tapa de bisagra; las boletas caen por la ranura con peso; al final la tapa se abre hacia atrás y asoman las boletas YES apiladas
const HSelfTax: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 40%,#3a2a1a,#120a04 80%)" f={(tt) => {
  const d = D(h), N = 5, at = (k: number) => 0.1 + k * (d * 0.55) / N, oa = d * 0.7, open = eio(tt, oa, oa + 0.7), bx = 960, top = 520;
  return <Cam tt={tt} d={d} z={0.05} fy={560}>
    <Luz />
    <Mesa y0={880} />
    <Sombra x={bx} y={990} w={700} o={0.6} />
    {open > 0.05 && Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-90 * open - k * 14}px)` }}>
      <Prop id="ballot" x={bx + (k % 2 ? 26 : -26)} y={top + 120} w={200} r={(k % 3 - 1) * 5} sh={0} />
      <div style={{ position: "absolute", left: bx - 40 + (k % 2 ? 26 : -26), top: top - 40, fontFamily: SER, fontWeight: 900, fontSize: 44, color: "#1a5a2a", transform: `rotate(${(k % 3 - 1) * 5 - 8}deg)` }}>YES</div></div>)}
    <div style={{ position: "absolute", left: bx - 290, top: top, width: 580, height: 470, borderRadius: 10, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.14) 0 3px,transparent 3px 96px), linear-gradient(#b07a40,#6a4420)", boxShadow: "inset 0 -24px 34px rgba(0,0,0,.4), inset 0 6px 0 rgba(255,230,180,.35)" }}>
      <div style={{ position: "absolute", left: 130, top: 170, width: 320, height: 120, borderRadius: 8, background: "linear-gradient(#ead2a2,#b89460)", fontFamily: SER, fontWeight: 900, fontSize: 78, color: "#3a2410", textAlign: "center", lineHeight: "120px", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }}>VOTE</div></div>
    <div style={{ position: "absolute", left: bx - 305, top: top - 44, width: 610, height: 50, transformOrigin: "50% 0%", transform: `perspective(900px) rotateX(${-115 * open + swing(tt, oa + 0.7, 10, 6, 2) * open}deg)`, borderRadius: 6, background: "linear-gradient(#d0a060,#7a5028)", boxShadow: "0 12px 14px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 225, top: 16, width: 160, height: 18, borderRadius: 6, background: "#140a04", boxShadow: "inset 0 4px 6px #000" }} /></div>
    {[-200, 200].map((x) => <div key={x} style={{ position: "absolute", left: bx + x - 24, top: top - 14, width: 48, height: 20, borderRadius: 4, background: "linear-gradient(#e8e0c8,#8a8070)" }} />)}
    {Array.from({ length: N }, (_, k) => { const p = cl((tt - at(k)) / 0.6); if (p <= 0 || p >= 1 || tt > oa) return null; return <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(0 0 ${1080 - top + 30}px 0)` }}><Prop id="ballot" x={bx} y={top - 500 + 560 * p * p} w={190} r={(1 - p) * (k % 2 ? 16 : -16)} sh={0} /></div>; })}
  </Cam>;
}} />;

// cuánto tardó: el carrete suelta la cinta métrica de 1892 a los 1990s, toda en cuadro; un gorgojo grande camina sobre la cinta; al llegar a los 1990s la cinta se traba con un golpe y el gorgojo cae a la mesa
const HCenturyBar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ext = 0.15 + 0.85 * eio(tt, 0, d * 0.7), Lm = 1340, L = Lm * ext, x0 = 230, jump = cl((tt - d * 0.74) / 0.8), YR = ["1892", "1910", "1930", "1950", "1970", "1990s"], stop = swing(tt, d * 0.7, 1, 9, 3);
  return <Cam tt={tt} d={d} z={0.03} fy={640}>
    <Mesa y0={720} />
    <Sombra x={x0} y={860} w={340} o={0.55} />
    <div style={{ position: "absolute", left: x0 - 160, top: 520, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f0c870,#a87a2c 55%,#5a3a10)", boxShadow: "0 20px 26px rgba(0,0,0,.55)", transform: `rotate(${-ext * 900}deg)` }}>
      <div style={{ position: "absolute", left: 130, top: 130, width: 60, height: 60, borderRadius: "50%", background: "#3a2a10" }} />
      <div style={{ position: "absolute", left: 150, top: 10, width: 20, height: 100, background: "rgba(0,0,0,.2)" }} /></div>
    <div style={{ position: "absolute", left: x0 + 130, top: 700 + 4 * stop, width: L, height: 86, background: "repeating-linear-gradient(90deg,#2a2a2a 0 3px,transparent 3px 26px), linear-gradient(#f6e27a,#d8b840)", boxShadow: "0 16px 14px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {YR.map((y, k) => <div key={y} style={{ position: "absolute", left: 30 + k * 250, top: 14, fontFamily: SER, fontWeight: 900, fontSize: 52, color: k === 5 ? "#c41e1e" : "#2a2a2a" }}>{y}</div>)}</div>
    <div style={{ position: "absolute", left: x0 + 120 + L, top: 684 + 4 * stop, width: 34, height: 118, borderRadius: 4, background: "linear-gradient(90deg,#7a7e82,#e0e4e8,#5a5e62)" }} />
    <Prop id="weevil" x={x0 + 200 + L - 170 + 260 * jump} y={706 + 200 * jump - 260 * Math.sin(jump * Math.PI) * 0.7} w={240} r={jump * 40 + 3 * Math.sin(tt * 12) * (1 - jump)} sh={jump > 0.95 ? 1 : 0} />
    {jump >= 1 && <Dust tt={tt} at={d * 0.74 + 0.8} x={x0 + 290 + L} y={906} w={200} />}
  </Cam>;
}} />;

// la estatua: el monumento grande en su pedestal; la lona plegada se desliza desde el primer segundo; arriba el gorgojo en alto; el barrido de luz cálida pasa por el bronce y por la placa
const HStatueReveal: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#5a7a98 0%,#c8c0a8 60%,#8a7a5a 62%,#4a3a28 100%)" f={(tt) => {
  const d = D(h), dn = 0.25 + 0.75 * eio(tt, 0, d * 0.4), sweep = eio(tt, d * 0.4, d * 0.8), W = 450, Hh = W * 718 / 352, yb = 860;
  return <Cam tt={tt} d={d} z={0.05} fy={520}>
    <Sombra x={960} y={1050} w={760} o={0.55} />
    <div style={{ position: "absolute", left: 960 - 300, top: yb - 10, width: 600, height: 210, background: "linear-gradient(#c0b8a8,#7a7468)", boxShadow: "inset 0 6px 0 rgba(255,255,255,.3), 0 20px 30px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 110, top: 50, width: 380, height: 110, borderRadius: 8, background: "linear-gradient(135deg,#e0b860,#8a6020)", fontFamily: SER, fontWeight: 900, fontSize: 46, color: "#3a2208", textAlign: "center", lineHeight: "110px" }}>ENTERPRISE · 1919</div>
      <div style={{ position: "absolute", left: -300 + 1200 * sweep, top: 0, width: 160, height: 210, background: "linear-gradient(90deg,transparent,rgba(255,240,190,.75),transparent)", mixBlendMode: "screen" }} /></div>
    <Prop id="statue" x={960} y={yb} w={W} sh={0} />
    <Prop id="weevil" x={960} y={yb - Hh + 70 + 4 * Math.sin(tt * 3)} w={130} sh={0} />
    <div style={{ position: "absolute", left: 960 - 400 + 800 * sweep - 120, top: 60, width: 240, height: 820, background: "linear-gradient(90deg,transparent,rgba(255,220,150,.4),transparent)", mixBlendMode: "screen", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
    {dn < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(Hh + 40) * dn}px)`, clipPath: `inset(0 0 ${(1080 - yb) + (Hh + 40) * dn}px 0)` }}><Prop id="canvas_tarp" x={960} y={yb + 30} w={W * 1.35} sh={0} /></div>}
    {dn > 0.5 && <div style={{ position: "absolute", left: 960 - 310, top: yb + 150, width: 620, height: 80, borderRadius: "40% 40% 10% 10%", background: "linear-gradient(#c8b890,#8a7a58)", boxShadow: "0 10px 14px rgba(0,0,0,.45)", opacity: eio(dn, 0.5, 1) }} />}
  </Cam>;
}} />;

// la escuela con ruedas: camino de tierra con huellas y pasto a los lados; el carro con su mula entra desde el fondo levantando polvo, el toldo se mece y frena en el centro con sombra
const HSchoolWagon: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9ab8d0 0%,#e8e0c0 48%,#7a8a42 49%,#4a5a22 100%)" f={(tt) => {
  const d = D(h), p = 0.25 + 0.75 * eio(tt, 0, d * 0.5), s = 0.3 + 0.7 * p, mv = 1 - eio(tt, d * 0.45, d * 0.55), rock = 1.6 * Math.sin(tt * 8) * mv + swing(tt, d * 0.5, 2, 5, 2), y = 520 + 470 * p, x = 960 - 110 * s;
  return <Cam tt={tt} d={d} z={0.04} fy={640}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "polygon(880px 520px,1040px 520px,1620px 1080px,300px 1080px)", background: `${Tierra}, linear-gradient(#c0a070,#8a6a3a)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[-1, 1].map((k) => <path key={k} d={`M${960 + k * 30} 520 L${960 + k * 260} 1080`} stroke="rgba(70,45,20,.4)" strokeWidth={22} />)}</svg>
    {[0, 1, 2, 3, 4].map((k) => <Dust key={k} tt={tt} at={k * 0.45} x={x + 120 * s} y={y - 10} w={420 * s} col="rgba(210,185,140,.75)" />)}
    <Sombra x={x + 60 * s} y={y} w={900 * s} o={0.5} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${x}px ${y}px`, transform: `rotate(${rock}deg)` }}><Prop id="wagon" x={x} y={y} w={1000 * s} sh={0} /></div>
  </Cam>;
}} />;

// lo que oye, lo que ve, lo que hace: la trompetilla entra entera y se va; los anteojos entran y se van; el guante de cuero baja grande sobre la mota y la aprieta con un golpe de algodón
const HHearSeeDo: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b1 = Math.max(1.4, bt(h, 0, d * 0.33)), b2 = Math.max(b1 + 1.2, bt(h, 1, d * 0.66)), io = (a: number, b: number) => { const i = eio(tt, a, a + 0.5), o = eio(tt, b - 0.4, b); return { x: 1100 * (1 - i) - 1100 * o, on: tt > a - 0.1 && tt < b + 0.1 }; };
  const A = io(-0.3, b1), B = io(b1 - 0.2, b2), g = eio(tt, b2, b2 + 0.6), close = eio(tt, b2 + 0.6, b2 + 0.85);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={800} />
    {A.on && <><Sombra x={960 - A.x} y={900} w={700} /><Prop id="ear_trumpet" x={960 - A.x} y={900} w={900} r={swing(tt, 0.2, 4, 5, 2)} sh={0} /></>}
    {B.on && <><Sombra x={960 + B.x} y={880} w={700} /><Prop id="spectacles" x={960 + B.x} y={880} w={860} r={swing(tt, b1 + 0.3, 4, 5, 2)} sh={0} /></>}
    {tt > b2 - 0.3 && <><Sombra x={960} y={940} w={360} /><Prop id="cotton_boll" x={960} y={940} w={340} sq={close * 0.35} sh={0} /></>}
    {tt > b2 - 0.1 && <><Sombra x={960} y={940} w={420 * g} o={0.4 * g} /><Prop id="leather_glove" x={960} y={940 - 640 * (1 - g) + 30 * close} w={360} sh={0} style={{ transform: `scaleY(${1 - 0.12 * close})` }} /></>}
    <Dust tt={tt} at={b2 + 0.85} x={960} y={940} w={360} col="rgba(250,248,240,.9)" />
  </Cam>;
}} />;

// todo en un minuto: retazos que llegan plegados y se asientan con sombra; cada uno con su objeto grande; la aguja arrastra el hilo rojo en zigzag sin salir del cuadro
const HQuiltRecap: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(0deg,rgba(0,0,0,.04) 0 2px,transparent 2px 9px), linear-gradient(#ecdfc0,#c8b890)" f={(tt) => {
  const d = D(h), N = 6, at = (k: number) => 0.1 + k * (d - 2) / N, P = Array.from({ length: N }, (_, k) => ({ x: 560 + (k % 3) * 400, y: 340 + Math.floor(k / 3) * 380 })), ID = ["cotton_boll", "weevil", "pesticide_tank", "biplane", "suitcase", "statue"], WS = [230, 300, 200, 300, 260, 130];
  const seam = cl((tt - 0.4) / (d - 0.8)) * N, cur = Math.min(N - 1, Math.floor(seam)), fr = seam - cur, nx = P[cur].x - 190 + 380 * fr, ny = P[cur].y - 170 + 340 * fr + 30 * Math.sin(fr * Math.PI * 6);
  return <Cam tt={tt} d={d} z={0.05}>
    {P.map((p, k) => { const L = land(tt, at(k), 260), fold = 1 - eio(tt, at(k) + 0.15, at(k) + 0.55); if (!L.on) return null; return <div key={k}>
      <div style={{ position: "absolute", left: p.x - 200, top: p.y - 170 + L.dy + 22, width: 400, height: 350, background: "rgba(0,0,0,.28)", filter: "blur(10px)", opacity: 1 - fold }} />
      <div style={{ position: "absolute", left: p.x - 195, top: p.y - 175 + L.dy, width: 390, height: 350, background: `repeating-linear-gradient(45deg,rgba(255,255,255,.12) 0 4px,transparent 4px 12px), ${["#b8443a", "#e8d8b0", "#4a6a8a", "#c89a4a", "#6a8a4a", "#8a5a7a"][k]}`, transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${75 * fold}deg)`, border: "4px dashed rgba(255,255,255,.45)" }} />
      <Prop id={ID[k]} x={p.x} y={p.y + 140 + L.dy} w={WS[k]} sh={0.5} style={{ opacity: 1 - fold }} /></div>; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={P.slice(0, cur).map((p, k) => `${k ? "L" : "M"}${p.x - 190} ${p.y - 170} L${p.x + 190} ${p.y + 170}`).join(" ") + `${cur ? " L" : "M"}${P[cur].x - 190} ${P[cur].y - 170} L${nx} ${ny}`} stroke="#c41e1e" strokeWidth={6} fill="none" strokeDasharray="18 10" /></svg>
    <Prop id="needle_thread" x={nx + 100} y={ny + 40} w={240} r={-30} sh={0} />
  </Cam>;
}} />;

export const HCC5: Record<string, C> = {
  cottonWeb: HCottonWeb, storeLedger: HStoreLedger, fenceWatch: HFenceWatch, daysMinutes: HDaysMinutes, reasonBar: HReasonBar, selfTax: HSelfTax,
  centuryBar: HCenturyBar, statueReveal: HStatueReveal, schoolWagon: HSchoolWagon, hearSeeDo: HHearSeeDo, quiltRecap: HQuiltRecap,
};
