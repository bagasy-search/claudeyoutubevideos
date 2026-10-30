// ruth29e · 5ª vuelta (29-oct): los 16 que seguían <6 rehechos con el cambio concreto del evaluador.
// Objetos FOTORREALES (public/img/<slug>/cut), todo entero en cuadro, acción a los 0,3 s, sombra de contacto, sin rótulos de esquina.
import React from "react";
import { cl, eio } from "./hkit";
import { HCE } from "./ruth_e";
import { S, D, bt, C, Prop, Dust, Cam, Mesa, Luz, land, swing, SER } from "./pk";

const SKY = "linear-gradient(#e8b070 0%,#f2d8a8 42%,#8a9a6a 50%,#4a5a2a 100%)";
const TIERRA = "radial-gradient(circle at 30% 30%,rgba(0,0,0,.14) 2px,transparent 3px) 0 0/20px 18px, radial-gradient(circle at 70% 60%,rgba(255,230,190,.1) 2px,transparent 3px) 0 0/31px 27px";
const Sombra: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.5 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.06, width: w, height: w * 0.12, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(0,0,0,${o}),transparent 70%)` }} />;
const Chapa: React.FC<{ x: number; y: number; txt: string; size?: number; r?: number; o?: number; bg?: string; col?: string }> = ({ x, y, txt, size = 60, r = 0, o = 1, bg = "linear-gradient(#ead6a8,#b8945a)", col = "#3a2410" }) => <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg)`, opacity: o, padding: `${size * 0.16}px ${size * 0.38}px`, borderRadius: size * 0.14, background: bg, boxShadow: "0 12px 16px rgba(0,0,0,.5), inset 0 3px 0 rgba(255,245,220,.5)", fontFamily: SER, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap" }}>{txt}</div>;
const Campo: React.FC<{ y0?: number }> = ({ y0 = 540 }) => <div style={{ position: "absolute", left: -200, top: y0, width: 2320, height: 1300 - y0, background: `repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 3px,transparent 3px 17px), linear-gradient(#8a9a5a,#3a5022)` }} />;

// m10 · desde helicópteros: maqueta cenital con esquina de madera; el helicóptero de juguete entra con el rotor borroso; su sombra larga barre el pasto y los chanchitos de arcilla huyen de a uno a su paso
const HHeliView: C = ({ t, h }) => <S t={t} h={h} bg="#3a2a1a" f={(tt) => {
  const d = D(h), hx = -300 + 2300 * eio(tt, 0, d * 0.85), hy = 330 + 60 * Math.sin(tt * 0.8), HG = [[520, 640], [760, 820], [1000, 600], [1240, 860], [1480, 700]];
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 40, top: 40, width: 1840, height: 1000, borderRadius: 8, background: `${TIERRA}, repeating-linear-gradient(70deg,rgba(255,255,255,.05) 0 5px,transparent 5px 24px), linear-gradient(135deg,#7a9a4a,#4a6a2a)`, boxShadow: "inset 0 0 0 26px #8a5a2a, inset 0 0 0 30px #4a2a10, 0 20px 30px rgba(0,0,0,.6)" }} />
    {HG.map(([x, y], k) => { const run = cl((hx - x + 250) / 700), rx = x + 520 * run, ry = y - 60 * run * (k % 2 ? 1 : -1); return <div key={k}><Sombra x={rx} y={ry + 10} w={200} o={0.5} /><Prop id="clay_hog" x={rx} y={ry + 10} w={190} r={run > 0 && run < 1 ? 3 * Math.sin(tt * 18) : 0} sh={0} />{run > 0.05 && run < 0.9 && <Dust tt={tt} at={tt - 0.2} x={rx - 90} y={ry + 10} w={90} />}</div>; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: "brightness(0) blur(10px)", opacity: 0.45, transform: "translate(150px,420px) scaleY(1.5) skewX(-20deg)", transformOrigin: `${hx}px ${hy}px` }}><Prop id="toy_heli" x={hx} y={hy + 120} w={760} sh={0} /></div>
    <Prop id="toy_heli" x={hx} y={hy + 120} w={760} sh={0} />
    <div style={{ position: "absolute", left: hx - 420, top: hy - 140, width: 840, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(60,60,60,.35),rgba(60,60,60,.08) 60%,transparent 72%)", transform: `rotate(${tt * 900 % 360}deg) scaleY(.3)` }} />
  </Cam>;
}} />;

// m09 · la recompensa: galería de tiro con riel de metal; chanchos de chapa con bisagra; los fáciles caen hacia atrás con sacudida y chispa; con «backfire» vuelven a pararse y aparecen más
const HBountyBoard: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#3a2a1a,#1a120a)" f={(tt) => {
  const d = D(h), b1 = Math.max(0.6, bt(h, 0, d * 0.25)), b2 = Math.max(b1 + 2.4, bt(h, 1, d * 0.6)), N = 6, fall = (k: number) => k % 2 === 0 ? b1 + (k / 2) * 0.55 : 1e9, up = (k: number) => eio(tt, b2 + k * 0.15, b2 + k * 0.15 + 0.5);
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <div style={{ position: "absolute", left: 360, top: 90, width: 1200, height: 160, borderRadius: 12, background: "linear-gradient(#c8a060,#7a5428)", boxShadow: "0 18px 24px rgba(0,0,0,.55)", textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 104, color: "#3a1a08", lineHeight: "160px" }}>BOUNTY $</div>
    {Array.from({ length: N }, (_, k) => { const x = 330 + k * 252, f = eio(tt, fall(k), fall(k) + 0.35), u = k % 2 === 0 ? up(k) : 0, lay = f * (1 - u), sh = tt > fall(k) && tt < fall(k) + 0.6 ? Math.sin((tt - fall(k)) * 50) * 4 * (1 - (tt - fall(k)) / 0.6) : 0; return <div key={k}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${x}px 660px`, transform: `perspective(900px) rotateX(${-82 * lay}deg) translateX(${sh}px)`, filter: `brightness(${1 - 0.4 * lay})` }}><Prop id="tin_hog" x={x} y={660} w={240} flip={k % 2 === 1} sh={0} /></div>
      {tt > fall(k) && tt < fall(k) + 0.35 && <div style={{ position: "absolute", left: x - 70, top: 540, width: 140, height: 140, background: "radial-gradient(circle,rgba(255,240,170,1) 0 10%,rgba(255,180,60,.7) 30%,transparent 65%)", clipPath: "polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)" }} />}</div>; })}
    {tt > b2 + 0.8 && [0, 1, 2].map((k) => { const L = land(tt, b2 + 0.8 + k * 0.3, 400); return <Prop key={"n" + k} id="tin_hog" x={460 + k * 500} y={660 + L.dy} w={240} sq={L.sq} sh={0} />; })}
    <div style={{ position: "absolute", left: 160, top: 652, width: 1600, height: 30, borderRadius: 8, background: "linear-gradient(#e8ecf0,#7a7e82 50%,#3a3e42)", boxShadow: "0 14px 14px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 140, top: 682, width: 1640, height: 400, background: "repeating-linear-gradient(90deg,#5a3418 0 8px,#6a4020 8px 120px)" }} />
    <Sombra x={330} y={1050} w={600} o={0.6} />
    <Prop id="hay_bale" x={330} y={1060} w={560} sh={0} />
  </Cam>;
}} />;

// m07 · los cercos no aguantaron: campo completo desde el cuadro 0; la malla cede como paño en cono bajo el hocico; los postes se doblan hacia afuera de a uno con nube de tierra; sale el jabalí entero
const HBrokenFence: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), push = 0.3 * eio(tt, 0, 0.8) + 0.7 * eio(tt, 0.8, d * 0.45), brk = d * 0.45, P = [360, 760, 1160, 1560], pf = (k: number) => eio(tt, brk + k * 0.25, brk + k * 0.25 + 0.5) * (k === 1 || k === 2 ? 1 : 0.4), run = eio(tt, brk + 0.4, d * 0.92), cx = 960, cy = 720;
  const disp = (x: number, y: number) => { const g = Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * 240 ** 2)) * (tt < brk ? push : 1 - eio(tt, brk, brk + 0.6) * 0.3); return [cx + (x - cx) * (1 + 0.35 * g), cy + (y - cy) * (1 + 0.35 * g) + 50 * g]; };
  const grid: string[] = []; for (let i = 0; i <= 24; i++) { const x = 360 + i * 50; grid.push(Array.from({ length: 9 }, (_, j) => disp(x, 560 + j * 45)).map((p, j) => `${j ? "L" : "M"}${p[0]} ${p[1]}`).join(" ")); } for (let j = 0; j <= 8; j++) { const y = 560 + j * 45; grid.push(Array.from({ length: 25 }, (_, i) => disp(360 + i * 50, y)).map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ")); }
  return <Cam tt={tt} d={d} z={0.04} fy={700}>
    <Campo y0={500} />
    <Prop id="boar_face" x={cx} y={cy + 230 + 30 * push} w={300 + 160 * push} o={tt < brk + 0.3 ? 1 : 0} sh={0} />
    {P.map((x, k) => { const f = pf(k), side = x < cx ? -1 : 1; return <div key={k}><div style={{ position: "absolute", left: x - 22, top: 520, width: 44, height: 420, borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${side * 80 * f}deg)`, background: "linear-gradient(90deg,#4a2e14,#9a6a3a,#3a2410)", boxShadow: "8px 10px 14px rgba(0,0,0,.4)" }} /><Dust tt={tt} at={brk + k * 0.25 + 0.5} x={x + side * 140} y={940} w={160} /></div>; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: tt < brk + 0.6 ? 1 : 0.5 }}>{grid.map((g, i) => <path key={i} d={g} stroke="#c8ccd0" strokeWidth={4} fill="none" opacity={0.9} />)}</svg>
    {tt > brk + 0.3 && <><Sombra x={960 - 560 * run} y={1010} w={560} /><Prop id="boar_run" x={960 - 560 * run} y={1010 + 30 * (1 - eio(tt, brk + 0.3, brk + 0.7))} w={620} flip sh={0} /><Dust tt={tt} at={brk + 0.5} x={1000 - 560 * run} y={1010} w={260} /></>}
  </Cam>;
}} />;

// m08 · comen maní, arroz, sorgo: batea de chapa acanalada; los cultivos caen de a uno; el hocico entra de costado y barre hacia cámara dejando migas
const HCropPlate: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), IT = [["peanuts", 560, 300], ["rice_heap", 860, 300], ["sorghum", 1120, 120], ["watermelon", 1360, 260]] as [string, number, number][], at = (k: number) => 0.2 + k * 0.5, sw = eio(tt, d * 0.5, d * 0.85), sx = 1900 - 1300 * sw;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={640} />
    <Sombra x={960} y={940} w={1400} o={0.55} />
    <div style={{ position: "absolute", left: 300, top: 760, width: 1320, height: 190, transform: "perspective(900px) rotateX(38deg)", transformOrigin: "50% 100%", borderRadius: 30, background: "repeating-linear-gradient(90deg,#9ca0a4 0 18px,#d8dce0 18px 30px,#8a8e92 30px 46px), linear-gradient(#c8ccd0,#7a7e82)", boxShadow: "inset 0 18px 24px rgba(0,0,0,.35)" }} />
    {IT.map(([id, x, w], k) => { const L = land(tt, at(k), 560), eaten = cl((x + 200 - sx) / 260); if (!L.on) return null; return <Prop key={id} id={id} x={x - 120 * eaten} y={880 + L.dy + 60 * eaten} w={w * (1 - 0.8 * eaten)} sq={L.sq} o={1 - eaten} sh={0.6} />; })}
    {sw > 0 && Array.from({ length: 18 }, (_, k) => { const x = 1500 - k * 60; if (x < sx + 120) return null; return <div key={k} style={{ position: "absolute", left: x, top: 880 + (k % 4) * 18, width: 14, height: 10, borderRadius: "40%", background: ["#c89a5a", "#efe6d0", "#9a4a2a", "#d84a4a"][k % 4] }} />; })}
    {sw > 0 && <Prop id="boar_root" x={sx} y={980 + 40 * Math.sin(sw * Math.PI)} w={720} flip sh={0.6} r={3 * Math.sin(tt * 10)} />}
  </Cam>;
}} />;

// m40 · año por año: sendero en perspectiva; huellas grandes hundidas con agua que se achican al punto de fuga; cada año se enciende dentro de su huella; al fondo el jabalí entero
const YRS = ["1700s", "1912", "1980s", "2006", "2011", "2014", "2017", "TODAY"];
const HHogTrack: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), B = YRS.map((_, i) => Math.max(0.2 + i * 0.1, bt(h, i, 0.5 + i * 2.4))), cur = B.filter((b) => tt >= b).length - 1, VX = 960, VY = 470;
  const pos = (i: number) => { const f = 1 - i / 8.6, s = f * f; return { x: VX + (i % 2 ? 1 : -1) * 170 * s, y: VY + (1080 - VY - 40) * s, s }; };
  return <Cam tt={tt} d={d} z={0.04} fy={600}>
    <Campo y0={470} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `polygon(${VX - 30}px ${VY}px,${VX + 30}px ${VY}px,1500px 1080px,420px 1080px)`, background: `${TIERRA}, linear-gradient(#7a5a32,#4a3018)` }} />
    <Prop id="boar_stand" x={VX + 40} y={VY + 30} w={220} sh={0.7} />
    {YRS.map((y, i) => { const p = pos(i), on = i <= cur, lit = i === cur ? 1 : 0, L = eio(tt, B[i], B[i] + 0.4); return <div key={y}>
      <div style={{ position: "absolute", left: p.x - 150 * p.s - 10, top: p.y - 190 * p.s - 10, width: 300 * p.s + 20, height: 360 * p.s + 20, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(ellipse at 50% 45%,rgba(30,20,10,.85),rgba(60,40,20,.6) 60%,rgba(140,110,70,.5) 75%,transparent 78%)", opacity: on ? L : 0.25 }} />
      <Prop id="mud_track" x={p.x} y={p.y + 170 * p.s} w={280 * p.s + 20} sh={0} o={on ? 0.9 * L : 0.25} style={{ filter: `brightness(${0.6 + 0.6 * lit})` }} />
      {on && <div style={{ position: "absolute", left: p.x - 200, top: p.y - 50 * p.s - 30, width: 400, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: Math.max(30, 120 * p.s), color: lit ? "#ffe6a0" : "#d8c8a0", textShadow: lit ? "0 0 24px rgba(255,200,90,.9), 0 4px 8px rgba(0,0,0,.6)" : "0 4px 8px rgba(0,0,0,.6)", opacity: L }}>{y}</div>}</div>; })}
  </Cam>;
}} />;

// m38 · el alambre eléctrico: dos aisladores en postes y el alambre brillante a la altura del hocico; el jabalí llega, lo toca, arco azul de chispas con destello y retrocede con rebote; maíz detrás
const HHotWire: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), hit = Math.max(1.0, d * 0.4), app = eio(tt, 0, hit), back = tt > hit ? eio(tt, hit, hit + 0.6) : 0, bx = 1700 - 640 * app + 340 * back + 30 * swing(tt, hit + 0.6, 1, 6, 2), arc = tt > hit && tt < hit + 0.45, wy = 650;
  return <Cam tt={tt} d={d} z={0.04} fy={660}>
    <Campo y0={520} />
    {Array.from({ length: 12 }, (_, k) => <Prop key={k} id="corn_plant" x={60 + k * 170} y={600 + (k % 2) * 16} w={150} sh={0} o={0.95} />)}
    {[460, 1460].map((x) => <div key={x}><Sombra x={x} y={1000} w={140} /><div style={{ position: "absolute", left: x - 20, top: 560, width: 40, height: 440, background: "linear-gradient(90deg,#4a2e14,#9a6a3a,#3a2410)" }} /><Prop id="spark_insulator" x={x} y={wy + 50} w={110} sh={0} /></div>)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M460 ${wy} L1460 ${wy}`} stroke="rgba(0,0,0,.3)" strokeWidth={6} transform="translate(0,40)" />
      <path d={`M460 ${wy} L1460 ${wy}`} stroke="#e8ecf0" strokeWidth={5} />
      <path d={`M460 ${wy - 2} L1460 ${wy - 2}`} stroke="#fff" strokeWidth={2} opacity={0.5 + 0.5 * Math.sin(tt * 20)} />
      {arc && Array.from({ length: 5 }, (_, k) => <path key={k} d={Array.from({ length: 7 }, (_, j) => `${j ? "L" : "M"}${1180 + j * 18 - 50} ${wy + (j % 2 ? -1 : 1) * (20 + 30 * Math.abs(Math.sin(tt * 90 + k * 3 + j)))}`).join(" ")} stroke="#9ad8ff" strokeWidth={4} fill="none" style={{ filter: "drop-shadow(0 0 10px #4ab8ff)" }} />)}</svg>
    {arc && <div style={{ position: "absolute", left: 1180 - 260, top: wy - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(220,240,255,.95),rgba(80,170,255,.4) 35%,transparent 70%)", opacity: 1 - (tt - hit) / 0.45 }} />}
    <Sombra x={bx + 40} y={1010} w={600} o={0.5} />
    <Prop id="boar_stand" x={bx + 40} y={1010 - (tt > hit ? 40 * Math.sin(cl((tt - hit) / 0.5) * Math.PI) : 0)} w={620} flip sh={0} />
  </Cam>;
}} />;

// m01 · como si hubieran pasado un rotocultivador: la rueda de púas cruza desde el primer segundo, voltea el surco detrás y las plantas caen de a una a su paso; al final se funde en polvo dentro del cuadro
const HRootedRows: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), rx = 300 + 1300 * eio(tt, 0, d * 0.8), dust = eio(tt, d * 0.8, d);
  return <Cam tt={tt} d={d} z={0.04} fy={760}>
    <Campo y0={520} />
    <div style={{ position: "absolute", left: 0, top: 830, width: Math.max(0, rx - 120), height: 150, background: `${TIERRA}, linear-gradient(#5a3a1a,#3a2410)`, borderRadius: "0 40px 40px 0", boxShadow: "inset 0 10px 18px rgba(0,0,0,.5)" }} />
    {Array.from({ length: Math.max(0, Math.floor((rx - 120) / 70)) }, (_, k) => <div key={"c" + k} style={{ position: "absolute", left: 20 + k * 70, top: 820 + (k % 3) * 40, width: 40, height: 30, borderRadius: "40%", background: "radial-gradient(circle at 35% 30%,#8a6a3a,#3a2410)" }} />)}
    {Array.from({ length: 11 }, (_, k) => { const x = 220 + k * 150, f = eio(tt, (x - 300 + 40) / 1300 * d * 0.8, (x - 300 + 40) / 1300 * d * 0.8 + 0.5); return <Prop key={k} id="corn_plant" x={x} y={900} w={170} r={-82 * f} sh={0.5 * (1 - f)} o={1 - 0.3 * f} />; })}
    <Sombra x={rx} y={990} w={520} o={0.55} />
    <Prop id="rotovator" x={rx} y={1000} w={520} r={2 * Math.sin(tt * 16)} sh={0} o={1 - dust} />
    {[0, 1, 2, 3].map((k) => <Dust key={k} tt={tt} at={k * 0.6} x={rx - 200} y={990} w={260} />)}
    {dust > 0 && <div style={{ position: "absolute", left: rx - 360, top: 700, width: 720, height: 420, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(200,170,120,.85),transparent 70%)", opacity: Math.sin(dust * Math.PI) }} />}
  </Cam>;
}} />;

// m06 · hozan: terrario de vidrio con capas de tierra; el hocico entra en el corte y arrastra dejando zanja; la bellota, la raíz y el brote saltan al vidrio; la tierra removida se apila al costado
const HSnoutDig: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dig = 0.25 * eio(tt, 0, 0.9) + 0.75 * eio(tt, 0.9, d * 0.7), tx = 420 + 1000 * dig, L = [["#6a4a2a", 70], ["#4a3018", 120], ["#8a6a3a", 110], ["#3a2410", 160]] as [string, number][];
  let yy = 520;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={960} />
    <Sombra x={960} y={980} w={1500} o={0.6} />
    <div style={{ position: "absolute", left: 260, top: 380, width: 1400, height: 600, borderRadius: 10, overflow: "hidden", boxShadow: "inset 0 0 0 10px rgba(200,230,240,.5)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1400, height: 140, background: "linear-gradient(#e8dcc0,#d0c4a8)" }} />
      {L.map(([c, hh], k) => { const y = yy - 380; yy += hh; return <div key={k} style={{ position: "absolute", left: 0, top: y, width: 1400, height: hh, background: `${TIERRA}, ${c}` }} />; })}
      <svg width={1400} height={600} style={{ position: "absolute", inset: 0 }}><path d={`M140 140 C300 ${180 + 40 * dig} ${tx - 300} 220 ${tx - 260} 200 L${tx - 260} 140 Z`} fill="#e8dcc0" /></svg>
      <div style={{ position: "absolute", left: 1150, top: 140 - 120 * dig, width: 260, height: 120 * dig + 10, borderRadius: "50% 50% 0 0", background: `${TIERRA}, linear-gradient(#7a5a32,#4a3018)` }} /></div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "inset(0 0 calc(100% - 640px) 0)" }}><Prop id="boar_root" x={tx} y={640} w={520} flip sh={0} r={4 * Math.sin(tt * 9)} /></div>
    {[["acorn", 0.3, 120, 700], ["acorn_sprout", 0.5, 90, 1000], ["acorn", 0.7, 100, 1300]].map(([id, f, w, x], k) => { const a = (f as number) * d, p = eio(tt, a, a + 0.5); if (tt < a) return null; return <Prop key={k} id={id as string} x={(x as number) + 40 * p} y={760 - 120 * Math.sin(p * Math.PI) + 60 * p} w={(w as number) * (1 + 0.8 * p)} r={p * 200} sh={0} />; })}
    <div style={{ position: "absolute", left: 260, top: 380, width: 1400, height: 600, borderRadius: 10, background: "linear-gradient(115deg,rgba(255,255,255,.18) 0 8%,transparent 12% 70%,rgba(255,255,255,.1) 74% 78%,transparent 80%)", boxShadow: "inset 0 0 0 6px rgba(220,240,250,.55)", pointerEvents: "none" }} />
  </Cam>;
}} />;

// m11 · la piara entera: marco ovalado tallado en la pared; el flash del fogonazo revela en sepia a la cerda y los lechones; chapitas numeradas 1-5 caen bajo el marco con sello; el marco queda
const HSounderFamily: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#6a4a2e 0 4px,#7a5434 4px 160px)" f={(tt) => {
  const d = D(h), fl = Math.max(0.5, d * 0.15), rev = eio(tt, fl, fl + 0.3), flash = tt > fl && tt < fl + 0.5 ? 1 - (tt - fl) / 0.5 : 0;
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <div style={{ position: "absolute", left: 960 - 520, top: 120, width: 1040, height: 640, borderRadius: "50%", background: "linear-gradient(135deg,#c8945a,#6a3e18 50%,#b07a40)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 0 0 14px rgba(255,220,160,.25)" }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 920, height: 520, borderRadius: "50%", overflow: "hidden", background: "#e8dcc0", boxShadow: "inset 0 10px 30px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: -500, top: -280, width: 1920, height: 1080, opacity: rev, filter: "sepia(1) contrast(1.1) brightness(.95)" }}><Prop id="sounder" x={960} y={800} w={900} sh={0} /></div></div></div>
    {[0, 1, 2, 3, 4].map((k) => { const a = fl + 0.8 + k * (d - fl - 1.8) / 5, L = land(tt, a, 300); if (!L.on) return null; return <Chapa key={k} x={640 + k * 160} y={880 + L.dy} txt={String(k + 1)} size={64} r={(k - 2) * 4 + swing(tt, a, 6, 6, 2)} />; })}
    <Sombra x={330} y={1040} w={420} o={0.5} />
    <Prop id="flash_pan" x={330} y={1040} w={420} r={-12} sh={0} />
    {flash > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "radial-gradient(circle at 330px 900px,rgba(255,255,240,1),rgba(255,250,220,.6) 40%,rgba(255,250,220,.2))", opacity: flash }} />}
  </Cam>;
}} />;

// m42 · el volante: tablero con instrumentos; el espejo cromado muestra la piara en el reflejo y se balancea; el volante real con dos manos que lo agarran y giran con él, todo en cuadro
const HSteeringWheel: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8b890 0%,#e8d8b0 38%,#7a6a4a 56%,#3a2e1e)" f={(tt) => {
  const d = D(h), b0 = Math.max(1.2, bt(h, 0, d * 0.5)), rot = -10 * Math.sin(tt * 1.6) * (1 - eio(tt, b0, b0 + 0.3)) + 60 * eio(tt, b0, b0 + 0.9) + swing(tt, b0 + 0.9, 8, 4, 1.4), cx = 960, cy = 760, W = 640;
  return <Cam tt={tt} d={d} z={0.03} fy={560}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 40px", transform: `rotate(${-rot * 0.06}deg)` }}>
      <div style={{ position: "absolute", left: 958, top: 0, width: 6, height: 60, background: "#3a3a3a" }} />
      <div style={{ position: "absolute", left: 960 - 330, top: 50, width: 660, height: 200, borderRadius: 100, overflow: "hidden", background: "linear-gradient(#e8ecf0,#8a8e92 50%,#d8dce0)", boxShadow: "0 0 0 10px #2a2a2a, 0 18px 26px rgba(0,0,0,.55)" }}>
        <div style={{ position: "absolute", left: -630 - 200 * eio(tt, 0, d), top: -580, width: 1920, height: 1080, transform: "scaleX(-1)", opacity: 0.85 }}><Prop id="sounder" x={1300} y={800} w={700} sh={0} /></div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,rgba(255,255,255,.35),transparent 40%)" }} /></div></div>
    <div style={{ position: "absolute", left: -100, top: 640, width: 2120, height: 500, borderRadius: "50% 50% 0 0 / 30% 30% 0 0", background: "linear-gradient(#3a3430,#1a1614)" }} />
    {[680, 1240].map((x, k) => <div key={x} style={{ position: "absolute", left: x - 90, top: 640, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#f4ecd8 0 60%,#2a2a2a 62%,#8a8e92 70%,#2a2a2a 76%)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 87, top: 30, width: 6, height: 62, background: "#c41e1e", transformOrigin: "3px 60px", transform: `rotate(${-60 + 40 * k + 20 * Math.sin(tt * 2 + k)}deg)` }} /></div>)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rot}deg)` }}>
      <Prop id="steering_wheel" x={cx} y={cy + W * 653 / 684 / 2} w={W} sh={0} />
      <Prop id="hand_glove" x={cx - 290} y={cy - 40} w={300} r={-60} sh={0} style={{ filter: "drop-shadow(10px 14px 10px rgba(0,0,0,.45))" }} />
      <Prop id="hand_glove" x={cx + 290} y={cy - 40} w={300} r={60} flip sh={0} style={{ filter: "drop-shadow(10px 14px 10px rgba(0,0,0,.45))" }} /></div>
  </Cam>;
}} />;

// m13 · la cámara trampa: un teléfono llega vibrando a la mesa con la foto infrarroja (chanchos con ojos brillantes); un dedo toca cada chancho y cae una chapita numerada; ALL IN debajo, sin tapar la foto
const HTrailCam: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0, 500), vib = tt > 0.4 && tt < 1.2 ? 6 * Math.sin(tt * 80) : 0, PX = [-220, -80, 50, 170, 260], tap = (k: number) => 1.4 + k * (d - 3) / 5, px = 960, py = 120;
  const cur = PX.findIndex((_, k) => tt < tap(k) + 0.4), fk = cur < 0 ? 4 : cur;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={700} />
    <Sombra x={px + vib} y={py + 880 + L.dy} w={760} o={0.6} />
    <div style={{ position: "absolute", left: px - 360 + vib, top: py + L.dy, width: 720, height: 860, borderRadius: 60, background: "linear-gradient(135deg,#3a3e42,#0a0a0a)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 0 0 4px #5a5e62" }}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 660, height: 600, borderRadius: 18, overflow: "hidden", background: "#0a140a" }}>
        <div style={{ position: "absolute", left: -630, top: -320, width: 1920, height: 1080, filter: "grayscale(1) sepia(.4) hue-rotate(60deg) brightness(.85) contrast(1.4)" }}><Prop id="sounder" x={960} y={760} w={900} sh={0} /></div>
        {PX.map((x, k) => <div key={k} style={{ position: "absolute", left: 330 + x, top: 280 + (k % 2) * 30, width: 30, height: 12, display: "flex", gap: 8, opacity: 0.6 + 0.4 * Math.sin(tt * 4 + k) }}>{[0, 1].map((e) => <div key={e} style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", boxShadow: "0 0 12px 4px rgba(220,255,220,.9)" }} />)}</div>)}
        {PX.map((x, k) => { const LL = land(tt, tap(k) + 0.25, 300); return LL.on && <Chapa key={"c" + k} x={345 + x} y={380 + (k % 2) * 30 + LL.dy} txt={String(k + 1)} size={46} />; })}
        <div style={{ position: "absolute", left: 20, top: 16, fontFamily: "monospace", fontSize: 26, color: "#cfe8cf" }}>IR 02:14 AM</div></div>
      <div style={{ position: "absolute", left: 0, top: 690, width: 720, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 96, color: "#f3e6c6", opacity: eio(tt, d * 0.8, d * 0.9) }}>ALL IN</div></div>
    <Prop id="hand_flannel" x={px + 345 + PX[fk] - 330 + 120} y={py + L.dy + 60 + 380 + 260 - 40 * Math.max(0, Math.sin(cl((tt - tap(fk)) / 0.4) * Math.PI))} w={420} r={-30} sh={0} o={tt > 1.1 ? 1 : 0} />
  </Cam>;
}} />;

// m12 · trampa-tímidos: jaula de panel en perspectiva con la puerta guillotina abierta y maíz adentro; el jabalí llega de perfil, frena con polvo y salta un cartel de chapa roja con resorte
const HTrapShy: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), stop = Math.max(1.2, d * 0.4), bx = 1900 - 620 * eio(tt, 0, stop) + 30 * swing(tt, stop, 1, 5, 2), sg = tt > stop + 0.2 ? 1 - Math.exp(-(tt - stop - 0.2) * 5) * Math.cos((tt - stop - 0.2) * 14) : 0;
  return <Cam tt={tt} d={d} z={0.04} fy={700}>
    <Campo y0={500} />
    <Sombra x={640} y={980} w={1000} o={0.5} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: "blur(.5px)" }}><Prop id="hog_panel" x={640} y={960} w={980} sh={0} o={0.95} /></div>
    <Prop id="corn_pile" x={600} y={970} w={360} sh={0.5} />
    <Prop id="guillotine_gate" x={1150} y={720} w={240} sh={0} />
    <Sombra x={bx} y={1010} w={560} />
    <Prop id="boar_stand" x={bx} y={1010} w={560} flip sh={0} r={tt > stop - 0.2 && tt < stop + 0.4 ? -4 : 0} />
    <Dust tt={tt} at={stop - 0.1} x={bx + 120} y={1010} w={300} />
    {sg > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M1520 900 ${Array.from({ length: 10 }, (_, k) => `L${1520 + (k % 2 ? 22 : -22)} ${900 - (k + 1) * 26 * sg}`).join(" ")}`} stroke="#9a9ea2" strokeWidth={6} fill="none" /></svg>
      <div style={{ position: "absolute", left: 1520 - 150, top: 900 - 260 * sg - 170, width: 300, height: 170, borderRadius: 14, transform: `rotate(${8 * Math.sin(tt * 9) * (1 - sg) + 4}deg)`, background: "linear-gradient(#d83a2a,#8a1a10)", boxShadow: "0 14px 18px rgba(0,0,0,.5), inset 0 4px 0 rgba(255,200,180,.4)", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#fff2e0", textAlign: "center", lineHeight: "170px" }}>NOPE</div></div>}
  </Cam>;
}} />;

// m04 · la muesca: la oreja grande sobre la mesa; la pinza muerde el borde y cierra; queda la muesca triangular con borde rojo y el trocito cae a la mesa con sombra
const HEarNotch: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), inn = eio(tt, 0, 0.8), bite = eio(tt, 0.9, 1.2), out = eio(tt, 1.6, 2.3), fall = cl((tt - 1.3) / 0.7), nx = 1300, ny = 520;
  return <Cam tt={tt} d={d} z={0.05} fx={nx - 200} fy={ny + 100}>
    <Luz />
    <Mesa y0={700} />
    <Sombra x={900} y={980} w={1000} o={0.5} />
    <Prop id="pig_ear" x={900} y={1000} w={1000} sh={0} />
    {bite > 0.9 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><polygon points={`${nx - 60},${ny - 30} ${nx + 50},${ny - 70} ${nx + 30},${ny + 60}`} fill="#8a6a42" /><polyline points={`${nx - 60},${ny - 30} ${nx + 30},${ny + 60} ${nx + 50},${ny - 70}`} stroke="#b8261e" strokeWidth={8} fill="none" /></svg>}
    {fall > 0 && <><Sombra x={nx + 120} y={1020} w={140 * fall} o={0.5 * fall} /><div style={{ position: "absolute", left: nx + 60, top: ny - 40 + 480 * fall * fall, width: 110, height: 110, clipPath: "polygon(0 20%,100% 0,80% 100%)", background: "linear-gradient(135deg,#f0b0a0,#c87a6a)", transform: `rotate(${fall * 220}deg)`, borderBottom: "6px solid #b8261e" }} /></>}
    <Prop id="ear_tag_pliers" x={nx + 300 + 600 * (1 - inn) + 600 * out} y={ny + 140} w={760} r={-28 + 8 * bite} sh={0} style={{ transform: `scaleY(${1 - 0.15 * bite})` }} />
  </Cam>;
}} />;

// m02 · el rastro: bandeja de tierra húmeda con luz rasante; el arroyo a la izquierda; las huellas se hunden de a una con borde levantado hacia la derecha; el jabalí entero sigue el rastro
const HHoofTrail: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 8, at = (k: number) => 0.2 + k * (d * 0.75) / N, bx = 160 + 1500 * eio(tt, 0, d * 0.9);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={640} />
    <Sombra x={960} y={1010} w={1700} o={0.6} />
    <div style={{ position: "absolute", left: 100, top: 300, width: 1720, height: 700, borderRadius: 16, overflow: "hidden", background: `${TIERRA}, linear-gradient(100deg,rgba(255,220,170,.25),transparent 40%), linear-gradient(#6a4a2a,#3a2410)`, boxShadow: "inset 0 0 0 18px #5a3a1a, inset 0 0 0 22px #2a1a0a, 0 20px 30px rgba(0,0,0,.5)" }}>
      <svg width={1720} height={700} style={{ position: "absolute", inset: 0 }}><path d={`M0 120 C120 200 160 380 80 700 L0 700 Z`} fill="#4a7a9a" opacity={0.9} /><path d={`M30 260 q20 -8 40 0 M20 420 q20 -8 40 0`} stroke="rgba(255,255,255,.5)" strokeWidth={3} fill="none" transform={`translate(0,${10 * Math.sin(tt * 2)})`} /></svg>
      {Array.from({ length: N }, (_, k) => { const p = eio(tt, at(k), at(k) + 0.3), x = 260 + k * 180, y = 330 + (k % 2 ? 90 : -40); if (p <= 0) return null; return <div key={k}>
        <div style={{ position: "absolute", left: x - 70, top: y - 80, width: 140, height: 170, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 40%,rgba(0,0,0,.55),rgba(0,0,0,.25) 55%,rgba(200,170,130,.35) 68%,transparent 72%)", transform: `scale(${0.6 + 0.4 * p})` }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1720, height: 700, transform: "translateY(-380px)" }}><Prop id="mud_track" x={x} y={y + 80 + 380} w={140} r={80} sh={0} o={0.7 * p} /></div></div>; })}</div>
    <Sombra x={bx} y={760} w={380} />
    <Prop id="boar_run" x={bx} y={760} w={400} sh={0} />
  </Cam>;
}} />;

// m05 · la caza se volvió popular: la lona se desenrolla con peso desde su rodillo y muestra HOG HUNTS con la silueta del jabalí estarcida; la chapa ALL YEAR entra y NO LIMIT cae con un golpe
const HHuntPoster: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#5a4028 0 6px,#6a4a30 6px 180px)" f={(tt) => {
  const d = D(h), un = eio(tt, 0, 1.4) + 0.03 * swing(tt, 1.4, 1, 6, 2), Hh = 820 * Math.min(1.03, un), ay = Math.max(1.8, d * 0.45), nl = land(tt, Math.max(2.6, d * 0.65), 600);
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 50, borderRadius: 25, background: "linear-gradient(#8a5a2e,#3a2410)", boxShadow: "0 12px 16px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 400, top: 100, width: 1120, height: Hh, overflow: "hidden", background: "repeating-linear-gradient(0deg,rgba(0,0,0,.04) 0 2px,transparent 2px 7px), repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0 2px,transparent 2px 7px), linear-gradient(#d8c8a0,#b8a478)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 1120, textAlign: "center", fontFamily: "Impact, 'Arial Black', sans-serif", fontSize: 190, letterSpacing: 6, color: "#7a1a10", opacity: 0.92 }}>HOG HUNTS</div>
      <div style={{ position: "absolute", left: -400, top: -60, width: 1920, height: 1080, filter: "brightness(0)", opacity: 0.82 }}><Prop id="boar_stand" x={960} y={800} w={640} sh={0} /></div></div>
    <div style={{ position: "absolute", left: 380, top: 100 + Hh - 30, width: 1160, height: 70, borderRadius: 35, background: "linear-gradient(#e0cca0,#8a7450)", boxShadow: "0 16px 18px rgba(0,0,0,.5)" }} />
    <Chapa x={1530 - 500 * (1 - eio(tt, ay, ay + 0.5)) + 600 * 0} y={300} txt="ALL YEAR" size={70} r={8} o={eio(tt, ay, ay + 0.2)} bg="linear-gradient(#e8ecf0,#8a8e92)" />
    {nl.on && <><Chapa x={960} y={800 + nl.dy} txt="NO LIMIT" size={110} r={-4} bg="linear-gradient(#d83a2a,#8a1a10)" col="#fff2e0" /><Dust tt={tt} at={Math.max(2.6, d * 0.65) + 0.55} x={960} y={880} w={500} /></>}
  </Cam>;
}} />;

// m03 · marcharon durante años: a la derecha un ábaco de madera cuyas cuentas corren una por año; a la izquierda la arena guarda pisadas hundidas con relieve y sombra que avanzan hacia el fondo
const HMarchTrail: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#e8c890 0%,#f0dcb0 40%,#c8a870 42%,#8a6a3a 100%)" f={(tt) => {
  const d = D(h), N = 10, at = (k: number) => 0.2 + k * (d - 1.2) / N, cnt = Array.from({ length: N }, (_, k) => tt > at(k) ? 1 : 0).reduce((a: number, b) => a + b, 0);
  return <Cam tt={tt} d={d} z={0.04}>
    {Array.from({ length: N }, (_, k) => { const p = eio(tt, at(k), at(k) + 0.3), f = 1 - k / 12, s = f * f, x = 520 + (k % 2 ? 70 : -70) * s + (1 - s) * 200, y = 1000 - 560 * (1 - s); if (p <= 0) return null; return <div key={k} style={{ position: "absolute", left: x - 90 * s, top: y - 120 * s, width: 180 * s, height: 240 * s, borderRadius: "48% 48% 44% 44%", background: "radial-gradient(ellipse at 45% 45%,rgba(60,40,10,.55),rgba(90,60,20,.3) 55%,rgba(255,240,200,.45) 66%,transparent 72%)", transform: `scale(${0.7 + 0.3 * p})`, opacity: p }} />; })}
    <Sombra x={1440} y={980} w={700} o={0.55} />
    <div style={{ position: "absolute", left: 1110, top: 300, width: 660, height: 680, borderRadius: 14, boxShadow: "inset 0 0 0 36px #8a5a2a, inset 0 0 0 40px #3a2410, 0 24px 30px rgba(0,0,0,.55)", background: "rgba(40,30,20,.15)" }}>
      {[0, 1, 2, 3].map((r) => <div key={r} style={{ position: "absolute", left: 36, top: 110 + r * 140, width: 588, height: 10, background: "linear-gradient(#e8ecf0,#6a6e72)" }} />)}
      {[0, 1, 2, 3].map((r) => Array.from({ length: 5 }, (_, b) => { const idx = r * 5 + b, moved = idx < cnt * 2 ? 1 : 0, k = Math.floor(idx / 2), p = moved ? eio(tt, at(k), at(k) + 0.35) : 0, x = 470 - b * 62 - (1 - p) * 0 - p * (330 - b * 0); return <div key={r + "_" + b} style={{ position: "absolute", left: 60 + (4 - b) * 62 + (1 - p) * 300 - 0, top: 80 + r * 140, width: 60, height: 70, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%,${["#e8b860", "#c84a2a", "#5a8a4a", "#3a6a9a"][r]},#2a1a0a 90%)`, boxShadow: "0 6px 8px rgba(0,0,0,.45)", transform: `translateX(${x * 0}px)` }} />; }))}</div>
  </Cam>;
}} />;

export const HCE6: Record<string, C> = {
  heliView: HHeliView, brokenFence: HBrokenFence, cropPlate: HCropPlate, hogTrack: HHogTrack, snoutDig: HSnoutDig,
  steeringWheel: HSteeringWheel, trailCam: HTrailCam, earNotch: HEarNotch, hoofTrail: HHoofTrail, huntPoster: HHuntPoster,
  // ronda e5: estos bajaron frente a su 1ª versión (e1) → vuelve la de ruth_e
  rootedRows: HCE.rootedRows, marchTrail: HCE.marchTrail, bountyBoard: HCE.bountyBoard, trapShy: HCE.trapShy, hotWire: HCE.hotWire, sounderFamily: HCE.sounderFamily,
};
export const HCE6_RESERVA: Record<string, C> = { rootedRows: HRootedRows, marchTrail: HMarchTrail, bountyBoard: HBountyBoard, trapShy: HTrapShy, hotWire: HHotWire, sounderFamily: HSounderFamily };
