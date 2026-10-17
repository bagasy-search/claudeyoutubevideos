// ── HÉROES de hanksnail (Hank Out Back: Florida juntó 168.000 caracoles gigantes en 10 años y volvieron). Claude, 16-oct-2026.
//    Juego PROPIO, PURO CSS/SVG: rótulo UPDATE de la miniatura, caracol vs mano (8 in · 500+ plantas), 3 caracoles → huevos, línea de
//    los 3 rounds, perro detector (olfatea → se sienta → cavan), contador 168.000 con la balde, cuenta de la libreta ($23M ÷ 168.000),
//    mapa de Florida con los brotes, aviso de cuarentena, la caja de Miramar, 3 razones, Florida → Hawái 1955, qué hacer si ves uno.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useK, on, sp, ez, eo, cl, Bg, shell, Lab, Hand, Stamp, Tick, Card, Tape, Arrow, Snail, Eggs, Update, FieldChapter, TX,
  LAB, HND, CREAM, NAVY, INK, PENCIL, OK, RED, GOLD, BLUE, SAGE, ORANGE, PP, B } from "./base";

// 1 · capítulo (hoja de libreta de campo)
export const Chapter: PP<{ n: number; title: string; sub: string; tw: number; kicker?: string; bg?: string }> = ({ a, a0, n, title, sub, kicker, bg }) => {
  const { f } = useK(a, a0);
  return <FieldChapter f={f} n={n} kicker={kicker || `ROUND ${n}`} title={title} sub={sub} bg={bg || "map"} />;
};

// 2 · rótulo de noticia (la miniatura): estuco + caracoles + FLORIDA UPDATE: THEY CAME BACK
export const UpdateOpen: PP<{ tTab: number }> = ({ a, a0, tTab }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), b = on(f, at(tTab), 22);
  const P = [[160, 140, 0.9], [420, 300, 1.1], [760, 120, 0.8], [1080, 260, 1.2], [1400, 110, 0.9], [1620, 330, 1.0], [260, 480, 1.0], [620, 560, 0.85], [1240, 520, 0.95], [1560, 600, 0.8]];
  return shell(<Bg k="stucco" f={f} dark={0.05} />, <>
    {P.map(([x, y, s], i) => { const v = on(f, i * 4, 16); return <div key={i} style={{ position: "absolute", left: x, top: y + (1 - v) * 40, opacity: cl(v * 2), transform: `rotate(${(i % 3 - 1) * 18 - 30}deg) scale(${s})` }}><Snail w={260} f={f + i * 7} flip={i % 2 === 1} /></div>; })}
    <Update tab="FLORIDA UPDATE:" txt="THEY CAME BACK" u={b} y={790} size={150} />
    <div style={{ position: "absolute", left: 1460, top: 640, opacity: cl(u * 2) }}><Stamp txt="3RD TIME" u={on(f, at(tTab) + 18, 12)} size={74} color={RED} rot={-10} /></div>
  </>);
};

// 3 · caracol vs mano: 8 pulgadas y 500+ plantas
export const SnailSize: PP<{ tIn: number; tPl: number }> = ({ a, a0, tIn, tPl }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), r = on(f, at(tIn), 30), p = sp(f, at(tPl), 12, 160);
  const n = Math.round(500 * eo(on(f, at(tPl), 40)));
  return shell(<Bg k="notebook" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 150, top: 70 }}><Hand txt="giant African land snail" u={u} size={92} color={NAVY} /></div>
    <div style={{ position: "absolute", left: 180, top: 300, opacity: cl(u * 2), transform: `translateX(${(1 - ez(u)) * -200}px)` }}><Snail w={980} f={f} /></div>
    <div style={{ position: "absolute", left: 200, top: 940, width: 980 * r, height: 34, background: "linear-gradient(180deg,#F5D04A,#D9A923)", borderRadius: 4, boxShadow: "0 6px 12px rgba(0,0,0,0.3)", overflow: "hidden" }}>
      {Array.from({ length: 33 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 30, top: 0, width: 3, height: i % 4 === 0 ? 30 : 16, background: INK }} />)}</div>
    <div style={{ position: "absolute", left: 1210, top: 900, opacity: cl(r * 2) }}><Lab txt="≈ 8 IN" size={110} color={RED} u={r} /></div>
    <Card x={1290} y={180} w={520} h={420} u={p} rot={3} bg={TX.paper}>
      <Hand txt="it eats" u={p} size={60} color={PENCIL} />
      <div style={{ fontFamily: LAB, fontSize: 200, color: OK, lineHeight: 1 }}>{n}+</div>
      <Hand txt="kinds of plants" u={on(f, at(tPl) + 10, 16)} size={64} color={NAVY} />
    </Card>
  </>);
};

// 4 · 3 caracoles → 1.200 huevos por año cada uno
export const EggBoom: PP<{ tThree: number; tEggs: number; tMore: number }> = ({ a, a0, tThree, tEggs, tMore }) => {
  const { f, at } = useK(a, a0);
  const t3 = on(f, at(tThree), 14), te = on(f, at(tEggs), 50), tm = on(f, at(tMore), 40);
  return shell(<Bg k="soil" f={f} dark={0.05} />, <>
    <div style={{ position: "absolute", left: 120, top: 80, display: "flex", gap: 30, opacity: cl(t3 * 2) }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ transform: `translateY(${(1 - on(f, at(tThree) + i * 6, 14)) * 60}px)` }}><Snail w={230} f={f + i * 5} /></div>)}</div>
    <div style={{ position: "absolute", left: 140, top: 300 }}><Lab txt="3 SNAILS" size={90} color={CREAM} u={t3} /></div>
    <div style={{ position: "absolute", left: 1150, top: 380 }}><Eggs n={160} u={te} r={13} /></div>
    <div style={{ position: "absolute", left: 1290, top: 80, textAlign: "right", width: 520 }}>
      <div style={{ fontFamily: LAB, fontSize: 170, color: GOLD, lineHeight: 1, opacity: cl(te * 3) }}>{Math.round(1200 * eo(te)).toLocaleString("en-US")}</div>
      <Hand txt="eggs a year · each snail" u={te} size={58} color={CREAM} /></div>
    <div style={{ position: "absolute", left: 140, top: 760, opacity: cl(tm * 2), transform: `rotate(-3deg) scale(${0.8 + 0.2 * ez(tm)})` }}><Stamp txt="THEN HUNDREDS · THEN THOUSANDS" u={tm} size={66} color={GOLD} rot={-3} /></div>
  </>);
};

// 5 · los 3 rounds (línea de tiempo)
export const Rounds: PP<{ r: (B & { y: string; v: string; res: string; ok: boolean })[] }> = ({ a, a0, r }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="map" f={f} dark={0.05} />, <>
    <div style={{ position: "absolute", left: 140, top: 70 }}><Lab txt="FLORIDA VS. THE SNAIL" size={96} color={NAVY} u={u} /></div>
    <div style={{ position: "absolute", left: 160, top: 560, width: 1600 * eo(u), height: 10, background: NAVY, borderRadius: 5 }} />
    {r.map((x, i) => { const v = sp(f, at(x.t), 12, 150);
      return <div key={i} style={{ position: "absolute", left: 160 + i * 560, top: 240, width: 500, opacity: cl(v * 2), transform: `translateY(${(1 - v) * 60}px)` }}>
        <div style={{ fontFamily: LAB, fontSize: 64, color: RED }}>ROUND {i + 1}</div>
        <div style={{ fontFamily: LAB, fontSize: 120, color: NAVY, lineHeight: 1 }}>{x.y}</div>
        <div style={{ position: "absolute", top: 300, left: 20, width: 46, height: 46, borderRadius: "50%", background: x.ok ? OK : RED, border: "6px solid #fff", boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
        <div style={{ marginTop: 130 }}><Hand txt={x.v} u={v} size={60} color={INK} /></div>
        <div style={{ marginTop: 14, display: "inline-block", background: x.ok ? OK : RED, color: "#fff", fontFamily: LAB, fontSize: 54, padding: "4px 18px 0", borderRadius: 4 }}>{x.res}</div>
      </div>; })}
  </>);
};

// 6 · perro detector: olfatea → se sienta → cavan
export const DogSits: PP<{ s: B[] }> = ({ a, a0, s }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  const icon = (i: number, v: number) => i === 0
    ? <svg width={220} height={160} viewBox="0 0 220 160"><path d="M20 120 C 40 60 120 50 170 80 L 200 100 L 190 116 L 150 108 C 130 130 60 140 20 120 Z" fill="#E2B866" /><circle cx={185} cy={98} r={6} fill={INK} />{[0, 1, 2].map((k) => <path key={k} d={`M ${200 + k * 8} ${120 + k * 6} q 8 -6 16 0`} stroke={INK} strokeWidth={4} fill="none" opacity={cl(v * 3 - k)} />)}</svg>
    : i === 1 ? <svg width={220} height={160} viewBox="0 0 220 160"><path d="M60 150 L 60 70 C 60 30 120 20 140 50 L 170 60 L 160 76 L 140 76 L 140 150 Z" fill="#E2B866" /><circle cx={150} cy={58} r={6} fill={INK} /><ellipse cx={110} cy={152} rx={80} ry={8} fill="rgba(0,0,0,0.25)" /></svg>
    : <div style={{ position: "relative", width: 220, height: 160 }}><div style={{ position: "absolute", left: 10, top: 90, width: 200, height: 60, background: TX.soil, borderRadius: "50% 50% 10px 10px" }} /><div style={{ position: "absolute", left: 50, top: 40 + (1 - v) * 50 }}><Snail w={140} f={f} /></div></div>;
  return shell(<Bg k="stucco" f={f} dark={0.05} />, <>
    <div style={{ position: "absolute", left: 140, top: 70 }}><Hand txt="how the snail dogs work" u={u} size={96} color={NAVY} /></div>
    {s.map((x, i) => { const v = sp(f, at(x.t), 12, 150);
      return <Card key={i} x={140 + i * 580} y={300} w={500} h={560} u={v} rot={i - 1} bg={TX.paper}>
        <div style={{ fontFamily: LAB, fontSize: 90, color: RED }}>{i + 1}</div>
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon(i, on(f, at(x.t), 20))}</div>
        <Hand txt={x.txt} u={on(f, at(x.t) + 4, 16)} size={64} color={NAVY} />
      </Card>; })}
  </>);
};

// 7 · el contador grande: 168.000 caracoles en 31 zonas
export const BigCount: PP<{ tN: number; tAreas: number }> = ({ a, a0, tN, tAreas }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), c = on(f, at(tN), 55), ar = sp(f, at(tAreas), 12, 150);
  const n = Math.round(168000 * eo(c));
  return shell(<Bg k="night" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 0, top: 160, width: 1920, textAlign: "center" }}>
      <div style={{ fontFamily: LAB, fontSize: 70, color: GOLD, letterSpacing: 6, opacity: cl(u * 2) }}>COLLECTED IN ABOUT 10 YEARS</div>
      <div style={{ fontFamily: LAB, fontSize: 330, color: CREAM, lineHeight: 1, textShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>{n.toLocaleString("en-US")}</div>
      <div style={{ fontFamily: LAB, fontSize: 90, color: CREAM, opacity: cl(c * 3), letterSpacing: 4 }}>GIANT AFRICAN LAND SNAILS</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 790, width: 1920, display: "flex", justifyContent: "center", gap: 18, opacity: cl(c * 2) }}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ opacity: cl(c * 14 - i) }}><Snail w={110} f={f + i * 3} flip={i % 2 === 0} /></div>)}</div>
    <div style={{ position: "absolute", left: 1350, top: 60, opacity: cl(ar * 2), transform: `rotate(5deg) scale(${0.7 + 0.3 * ar})` }}><Stamp txt="31 CORE AREAS · MIAMI-DADE" u={ar} size={50} color={GOLD} rot={5} /></div>
  </>);
};

// 8 · la cuenta de la libreta: $23 M ÷ 168.000 = $137 por caracol · 13 millas de caracol
export const TruckMath: PP<{ tCost: number; tDiv: number; tRes: number; tMiles: number }> = ({ a, a0, tCost, tDiv, tRes, tMiles }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), c = on(f, at(tCost), 16), d = on(f, at(tDiv), 18), r = sp(f, at(tRes), 12, 160), m = on(f, at(tMiles), 30);
  return shell(<Bg k="kraft" f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 200, top: 90, width: 1100, height: 900, background: TX.notebook, borderRadius: 6, opacity: cl(u * 2), transform: `rotate(-2deg) translateY(${(1 - u) * 80}px)`,
      boxShadow: "0 40px 80px rgba(0,0,0,0.55)" }}>
      <div style={{ position: "absolute", left: 150, top: 50 }}><Hand txt="truck math" u={u} size={90} color={RED} /></div>
      <div style={{ position: "absolute", left: 150, top: 200 }}><Hand txt="$23,000,000" u={c} size={110} color={NAVY} /></div>
      <div style={{ position: "absolute", left: 150, top: 340 }}><Hand txt="÷ 168,000 snails" u={d} size={96} color={NAVY} /></div>
      <div style={{ position: "absolute", left: 150, top: 470, width: 800 * eo(d), height: 8, background: NAVY }} />
      <div style={{ position: "absolute", left: 150, top: 520, opacity: cl(r * 2), transform: `scale(${0.7 + 0.3 * r})`, transformOrigin: "left center" }}>
        <div style={{ fontFamily: HND, fontWeight: 700, fontSize: 190, color: RED, lineHeight: 1 }}>≈ $137</div>
        <Hand txt="for every single snail" u={on(f, at(tRes) + 8, 16)} size={70} color={PENCIL} /></div>
      <svg width={1100} height={300} style={{ position: "absolute", left: 120, top: 520 }}><ellipse cx={330} cy={110} rx={300} ry={115} stroke={RED} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(on(f, at(tRes) + 12, 18))} /></svg>
    </div>
    <div style={{ position: "absolute", left: 1360, top: 240, width: 460, opacity: cl(m * 2) }}>
      <div style={{ fontFamily: LAB, fontSize: 70, color: CREAM }}>NOSE TO TAIL</div>
      <div style={{ fontFamily: LAB, fontSize: 200, color: GOLD, lineHeight: 1 }}>{Math.round(13 * eo(m))} MI</div>
      <div style={{ marginTop: 20, width: 440 * eo(m), height: 20, borderRadius: 10, background: "repeating-linear-gradient(90deg, #8A5426 0 34px, #3A2210 34px 40px)" }} />
      <Hand txt="of snail, at 5 in each" u={m} size={52} color={CREAM} />
    </div>
  </>);
};

// 9 · mapa de Florida con los brotes (contorno aproximado dibujado a mano)
const FL = "M 70 92 L 330 104 L 420 120 L 470 98 L 540 96 L 560 120 L 600 130 L 640 150 L 690 200 L 740 300 L 780 380 L 820 470 L 850 560 L 860 640 L 830 700 L 790 720 L 750 690 L 720 630 L 690 590 L 650 530 L 620 470 L 590 420 L 575 370 L 560 320 L 540 270 L 520 240 L 490 215 L 450 200 L 420 205 L 380 190 L 330 180 L 280 172 L 230 166 L 160 162 L 90 150 Z";
export const FloridaMap: PP<{ p: (B & { x: number; y: number; y2: string; c: string })[]; tFirst?: number }> = ({ a, a0, p, tFirst }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  const ff = tFirst != null ? on(f, at(tFirst), 18) : 0;
  return shell(<Bg k="sea" f={f} dark={0} />, <>
    <svg width={1920} height={1080} viewBox="0 0 960 760" style={{ position: "absolute", left: 300, top: 20, width: 1300, height: 1030 }}>
      <path d={FL} fill="#D9E4C8" stroke="#F6F1E1" strokeWidth={5} opacity={cl(u * 2)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
      <path d={FL} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={14} transform="translate(6,10)" opacity={0.4 * cl(u * 2)} />
      <path d="M 620 470 L 850 560 L 860 640 L 830 700 L 790 720 L 750 690 L 720 630 L 690 590 L 650 530 Z" fill="rgba(214,40,40,0.18)" opacity={ff} />
      {p.map((x, i) => { const v = sp(f, at(x.t), 12, 160);
        return <g key={i} opacity={cl(v * 2)} transform={`translate(${x.x} ${x.y}) scale(${0.4 + 0.6 * v})`}>
          <circle r={30 + 14 * Math.sin(f / 8 + i)} fill={x.c} opacity={0.25} /><circle r={16} fill={x.c} stroke="#fff" strokeWidth={5} /></g>; })}
    </svg>
    {p.map((x, i) => { const v = sp(f, at(x.t), 12, 160);
      return <div key={i} style={{ position: "absolute", left: 300 + x.x * 1300 / 960 + (x.x > 600 ? -560 : 40), top: 20 + x.y * 1030 / 760 - 60, width: 520, textAlign: x.x > 600 ? "right" : "left", opacity: cl(v * 2) }}>
        <div style={{ fontFamily: LAB, fontSize: 72, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>{x.y2}</div>
        <Hand txt={x.txt} u={v} size={50} color={CREAM} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.8)" }} /></div>; })}
    {tFirst != null ? <div style={{ position: "absolute", left: 120, top: 860, opacity: cl(ff * 2) }}><Update tab="FIRST TIME EVER:" txt="OUTSIDE SOUTH FLORIDA" u={ff} y={0} size={100} /></div> : null}
  </>);
};

// 10 · aviso de cuarentena (lo que no se puede sacar)
export const Quarantine: PP<{ items: B[]; tRule: number }> = ({ a, a0, items, tRule }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), r = on(f, at(tRule), 16);
  return shell(<Bg k="stucco" f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 520, top: 60, width: 880, height: 960, background: TX.orange, borderRadius: 14, opacity: cl(u * 2), transform: `perspective(1400px) rotateY(${(1 - u) * -25}deg)`,
      boxShadow: "0 50px 90px rgba(0,0,0,0.55), inset 0 0 0 14px rgba(255,255,255,0.85)" }}>
      <div style={{ position: "absolute", left: 0, top: 50, width: 880, textAlign: "center", fontFamily: LAB, fontSize: 150, color: "#fff", letterSpacing: 8, textShadow: "0 6px 14px rgba(0,0,0,0.3)" }}>QUARANTINE</div>
      <div style={{ position: "absolute", left: 0, top: 210, width: 880, textAlign: "center", fontFamily: LAB, fontSize: 52, color: NAVY }}>NOTHING LEAVES THIS AREA</div>
      {items.map((x, i) => { const v = on(f, at(x.t), 12);
        return <div key={i} style={{ position: "absolute", left: 110, top: 320 + i * 120, display: "flex", alignItems: "center", gap: 30, opacity: cl(v * 2), transform: `translateX(${(1 - ez(v)) * 60}px)` }}>
          <Tick u={on(f, at(x.t) + 4, 10)} no size={74} color="#fff" /><div style={{ fontFamily: LAB, fontSize: 92, color: "#fff" }}>{x.txt}</div></div>; })}
      <div style={{ position: "absolute", left: 0, top: 820, width: 880, textAlign: "center", opacity: cl(r * 2) }}><Hand txt="without the state's OK" u={r} size={66} color={NAVY} /></div>
    </div>
  </>);
};

// 11 · la caja de Miramar (calles reales del límite)
export const MiramarBox: PP<{ tBox: number; tIn: number }> = ({ a, a0, tBox, tIn }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), b = on(f, at(tBox), 40), n = sp(f, at(tIn), 12, 150);
  const grid = "repeating-linear-gradient(90deg, rgba(255,255,255,0.75) 0 6px, transparent 6px 120px), repeating-linear-gradient(0deg, rgba(255,255,255,0.75) 0 6px, transparent 6px 110px), linear-gradient(180deg, #CFDCC3, #BFD0B1)";
  return shell(<AbsoluteFill style={{ background: grid, transform: `scale(${1.08 - 0.03 * ez(u)})` }} />, <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={480} y={180} width={960} height={680} fill="rgba(214,40,40,0.12)" stroke={RED} strokeWidth={12} strokeDasharray="40 18" pathLength={1} strokeDashoffset={0} opacity={cl(b * 3)} style={{ clipPath: `inset(0 ${100 - 100 * eo(b)}% 0 0)` }} />
    </svg>
    {[["PEMBROKE RD", 760, 120, 0], ["UNIVERSITY DR", 300, 470, 0], ["SW 62ND AVE", 1460, 470, 0], ["NW 215TH ST", 760, 880, 0]].map(([t, x, y], i) =>
      <div key={i} style={{ position: "absolute", left: x as number, top: y as number, fontFamily: LAB, fontSize: 56, color: NAVY, background: "rgba(255,255,255,0.9)", padding: "4px 16px 0", borderRadius: 4, opacity: cl(on(f, at(tBox) + i * 8, 10) * 2) }}>{t as string}</div>)}
    <div style={{ position: "absolute", left: 640, top: 380, opacity: cl(n * 2), transform: `scale(${0.7 + 0.3 * n})` }}>
      <Stamp txt="INSIDE THIS BOX" u={n} size={84} color={RED} rot={-4} />
      <div style={{ marginTop: 30, marginLeft: 30 }}><Hand txt="nothing green leaves" u={on(f, at(tIn) + 8, 16)} size={78} color={NAVY} /></div></div>
    <div style={{ position: "absolute", left: 90, top: 60 }}><Update tab="BROWARD · JUNE 2023" txt="" u={u} y={0} size={10} /></div>
  </>);
};

// 12 · 3 razones por las que vuelve
export const ThreeWhy: PP<{ r: (B & { sub: string })[] }> = ({ a, a0, r }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="chalk" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 160, top: 70 }}><Hand txt="why it keeps coming back" u={u} size={100} color={CREAM} chalk /></div>
    {r.map((x, i) => { const v = on(f, at(x.t), 14);
      return <div key={i} style={{ position: "absolute", left: 200, top: 270 + i * 230, display: "flex", alignItems: "center", gap: 50, opacity: cl(v * 2) }}>
        <div style={{ fontFamily: LAB, fontSize: 180, color: GOLD, width: 120, lineHeight: 1 }}>{i + 1}</div>
        <div><Hand txt={x.txt} u={v} size={100} color={CREAM} chalk /><Hand txt={x.sub} u={on(f, at(x.t) + 10, 18)} size={56} color={BLUE} chalk /></div>
      </div>; })}
  </>);
};

// 13 · Florida → Hawái 1955: el caracol lobo y las especies perdidas
export const WolfTrip: PP<{ tShip: number; tGone: number; tGeorge: number }> = ({ a, a0, tShip, tGone, tGeorge }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), s = on(f, at(tShip), 40), g = sp(f, at(tGone), 12, 150), ge = sp(f, at(tGeorge), 12, 150);
  return shell(<Bg k="sea" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 1500, top: 330, width: 260, height: 300, background: "#D9E4C8", borderRadius: "40% 60% 50% 70% / 60% 40% 70% 50%", opacity: cl(u * 2), boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }} />
    <div style={{ position: "absolute", left: 1500, top: 650, fontFamily: LAB, fontSize: 64, color: CREAM, opacity: cl(u * 2) }}>FLORIDA</div>
    {[[260, 520, 60], [330, 560, 44], [400, 600, 36], [190, 470, 30]].map(([x, y, w], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.7, background: "#9CC08A", borderRadius: "50%", opacity: cl(u * 2) }} />)}
    <div style={{ position: "absolute", left: 180, top: 650, fontFamily: LAB, fontSize: 64, color: CREAM, opacity: cl(u * 2) }}>HAWAII</div>
    <Arrow d="M 1500 420 C 1200 150 700 150 470 470" u={s} color={GOLD} w={10} />
    <div style={{ position: "absolute", left: 780, top: 140, opacity: cl(s * 2) }}><Lab txt="1955" size={110} color={GOLD} u={s} /><Hand txt="the rosy wolf snail" u={s} size={58} color={CREAM} /></div>
    <Card x={160} y={760} w={760} h={240} u={g} rot={-2} bg={TX.paper}>
      <div style={{ fontFamily: LAB, fontSize: 104, color: RED, lineHeight: 1 }}>≈ 8 SPECIES</div><Hand txt="of Hawaiian snails, gone" u={g} size={58} color={NAVY} /></Card>
    <Card x={1000} y={760} w={780} h={240} u={ge} rot={2} bg={TX.card}>
      <div style={{ fontFamily: LAB, fontSize: 80, color: NAVY, lineHeight: 1 }}>GEORGE · JAN 1, 2019</div><Hand txt="the last of his kind" u={ge} size={58} color={PENCIL} /></Card>
  </>);
};

// 14 · si ves uno (lo que pide el estado)
export const IfYouSee: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="notebook" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 170, top: 60 }}><Hand txt="if you ever see one" u={u} size={104} color={RED} /></div>
    <div style={{ position: "absolute", right: 120, top: 300, opacity: cl(u * 2), transform: `rotate(-12deg)` }}><Snail w={420} f={f} /></div>
    {items.map((x, i) => { const v = on(f, at(x.t), 12);
      return <div key={i} style={{ position: "absolute", left: 200, top: 250 + i * 150, display: "flex", alignItems: "center", gap: 30, opacity: cl(v * 2) }}>
        <Tick u={on(f, at(x.t) + 5, 12)} no={i < 2} size={78} /><Hand txt={x.txt} u={v} size={78} color={NAVY} /></div>; })}
  </>);
};
