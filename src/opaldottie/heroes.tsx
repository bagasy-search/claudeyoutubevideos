// ── HÉROES de opaldottie (Opal's Hen House: "Dottie Was Down in the Nest Box at Dawn. What I Did in the First Hour"). Claude, 16-oct-2026.
//    Juego PROPIO: reloj de cocina de la primera hora (capítulos = minuto 0/5/10/15/20/40/45), señales de Dottie sobre la silueta rayada,
//    el cajón-hospital armado por capas, la revisión buche/cloaca (checklist con dedos), la tina tibia (termómetro 100°F + taza de sal + timer 20),
//    gota al costado del pico vs NO verter, las 3 cosas que NO hizo (tachadas), cuándo llamar al vete (tarjeta roja), la balanza del huevo doble,
//    el estante de primeros auxilios con precios, y la tarjeta de la heladera (recap). PURO CSS/SVG.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useK, on, sp, ez, eo, cl, Bg, shell, Lab, Hand, Stamp, Tick, Card, Tape, Arrow, Hen, Egg, RecipeChapter, TX,
  LAB, HND, BARN, BARN2, CREAM, NAVY, INK, PENCIL, OK, RED, GOLD, STRAW, EGG, BLUE, ZINC, PP, B } from "./base";

// gallina barrada (Barred Rock): silueta gris + rayas blancas
const Dot: React.FC<{ w: number; flip?: boolean; style?: React.CSSProperties }> = ({ w, flip, style }) => (
  <div style={{ position: "relative", ...style }}>
    <Hen w={w} body="#4A4A4E" wing="#2A2A2E" comb={RED} flip={flip} />
    <svg width={w} height={w * 0.9} viewBox="0 0 200 180" style={{ position: "absolute", left: 0, top: 0, transform: flip ? "scaleX(-1)" : undefined }}>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${40 + i * 13} ${68 + (i % 2) * 6} C ${54 + i * 13} 100 ${44 + i * 13} 130 ${54 + i * 13} 150`} stroke="#EDEDED" strokeWidth={5} fill="none" opacity={0.8} />)}
    </svg>
  </div>
);

// reloj de cocina con aguja que corre hasta el minuto m (0-60)
const Clock: React.FC<{ m: number; u: number; size: number }> = ({ m, u, size }) => {
  const ang = (m * u) * 6;
  return <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx={100} cy={100} r={94} fill={CREAM} stroke={NAVY} strokeWidth={8} />
    <path d={`M 100 100 L 100 10 A 90 90 0 ${ang > 180 ? 1 : 0} 1 ${100 + 90 * Math.sin(ang * Math.PI / 180)} ${100 - 90 * Math.cos(ang * Math.PI / 180)} Z`} fill={RED} opacity={0.28} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={100} y1={14} x2={100} y2={i % 3 ? 24 : 32} stroke={INK} strokeWidth={i % 3 ? 3 : 6} transform={`rotate(${i * 30} 100 100)`} />)}
    <line x1={100} y1={100} x2={100} y2={22} stroke={RED} strokeWidth={6} strokeLinecap="round" transform={`rotate(${ang} 100 100)`} />
    <circle cx={100} cy={100} r={8} fill={INK} />
  </svg>;
};

// 1 · capítulo: minuto X del reloj
export const Chapter: PP<{ n: number; title: string; sub: string; tw: number }> = ({ a, a0, n, title, sub }) => {
  const { f } = useK(a, a0);
  const u = sp(f, 0, 16, 120);
  return <AbsoluteFill>
    <RecipeChapter f={f} n={n} kicker="the first hour" title={title} sub={sub} bg="wood" />
    <div style={{ position: "absolute", right: 90, top: 70, opacity: cl(u * 2), transform: `rotate(${(1 - u) * 30}deg) scale(${0.7 + 0.3 * u})` }}><Clock m={n} u={eo(cl(f / 30))} size={300} /></div>
  </AbsoluteFill>;
};

// 2 · las señales de Dottie en la caja nido
export const DottieSigns: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  const tip = [[700, 260], [1160, 300], [1080, 640], [520, 700]];
  const pos = [[120, 120], [1280, 160], [1300, 760], [120, 820]];
  return shell(<Bg k="dusk" f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 600, top: 220, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}><Dot w={680} /></div>
    <div style={{ position: "absolute", left: 540, top: 820, width: 840, height: 120, background: TX.straw, borderRadius: 12, opacity: cl(u * 2) }} />
    {items.map((it, i) => {
      const v = on(f, at(it.t), 12);
      return <React.Fragment key={i}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><line x1={pos[i][0] + 240} y1={pos[i][1] + 60} x2={tip[i][0] + 120 * 0} y2={tip[i][1]} stroke={GOLD} strokeWidth={6} strokeDasharray="1200" strokeDashoffset={1200 * (1 - v)} /></svg>
        <Card x={pos[i][0]} y={pos[i][1]} w={500} u={v} rot={i % 2 ? 2 : -2} bg={TX.card}><Hand txt={it.txt} u={on(f, at(it.t) + 4, 16)} size={60} color={NAVY} /></Card>
      </React.Fragment>;
    })}
  </>);
};

// 3 · el cajón-hospital por capas (lo que va adentro)
export const CrateSetup: PP<{ items: B[]; tPrice: number }> = ({ a, a0, items, tPrice }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), p = sp(f, at(tPrice), 12, 160);
  return shell(<Bg k="barn" f={f} dark={0.25} />, <>
    <div style={{ position: "absolute", left: 140, top: 240, width: 860, height: 620, border: `10px solid ${ZINC}`, borderRadius: 18, opacity: cl(u * 2),
      background: `repeating-linear-gradient(90deg, transparent 0 58px, ${ZINC} 58px 64px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120 * cl(on(f, at(items[0]?.t ?? 0), 12)), background: TX.straw }} />
      <div style={{ position: "absolute", left: -20, right: -20, top: -30, height: 480 * cl(on(f, at(items[items.length - 1]?.t ?? 0), 20)), background: "rgba(246,238,220,0.85)", borderRadius: 10 }} />
    </div>
    <div style={{ position: "absolute", left: 120, top: 120, opacity: cl(p * 2), transform: `rotate(-6deg) scale(${0.6 + 0.4 * p})` }}><Stamp txt="YARD SALE · $12" u={p} size={78} /></div>
    <Card x={1080} y={170} w={700} h={760} u={u} rot={1.5} bg={TX.card}>
      <Lab txt="HOSPITAL CRATE" size={84} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 34, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 5, 12)} size={66} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={62} color={NAVY} /></div>)}
    </Card>
  </>);
};

// 4 · la revisión: buche y cloaca (dos círculos sobre la silueta + resultado)
export const TheLook: PP<{ tCrop: number; tCropOk: number; tVent: number; tEgg: number }> = ({ a, a0, tCrop, tCropOk, tVent, tEgg }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  const c = on(f, at(tCrop), 14), co = on(f, at(tCropOk), 12), v = on(f, at(tVent), 14), e = sp(f, at(tEgg), 12, 160);
  return shell(<Bg k="card" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 300, top: 200, opacity: cl(u * 2) }}><Dot w={760} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={880} cy={470} r={80} fill="none" stroke={OK} strokeWidth={9} strokeDasharray="520" strokeDashoffset={520 * (1 - c)} />
      <circle cx={430} cy={660} r={80} fill="none" stroke={RED} strokeWidth={9} strokeDasharray="520" strokeDashoffset={520 * (1 - v)} />
    </svg>
    <Card x={1150} y={160} w={660} u={c} rot={-1.5} bg={TX.paper}><Lab txt="CROP" size={80} color={NAVY} u={c} />
      <Hand txt="at dawn: flat & empty" u={on(f, at(tCrop) + 6, 16)} size={58} color={PENCIL} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, opacity: cl(co * 2) }}><Tick u={co} size={66} /><Hand txt="Dottie: flat. good." u={co} size={58} color={OK} /></div></Card>
    <Card x={1150} y={560} w={660} u={v} rot={1.5} bg={TX.paper}><Lab txt="VENT" size={80} color={NAVY} u={v} />
      <Hand txt="swollen, pushing" u={on(f, at(tVent) + 6, 16)} size={58} color={PENCIL} />
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10, opacity: cl(e * 2) }}><Egg w={70} /><Hand txt="an egg. a big one." u={e} size={58} color={RED} /></div></Card>
  </>);
};

// 5 · gota al costado del pico vs NO verter
export const DropNotPour: PP<{ tNo: number; tYes: number }> = ({ a, a0, tNo, tYes }) => {
  const { f, at } = useK(a, a0);
  const n = on(f, at(tNo), 12), y = on(f, at(tYes), 12);
  const Box = ({ x, u, ok, title, sub }: any) => <div style={{ position: "absolute", left: x, top: 180, width: 760, height: 720, background: TX.card, borderRadius: 14, border: `10px solid ${ok ? OK : RED}`, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px)`, padding: 40 }}>
    <Lab txt={title} size={86} color={ok ? OK : RED} u={u} />
    <svg width={560} height={360} viewBox="0 0 280 180" style={{ marginTop: 20 }}>
      <path d="M 60 120 L 150 90 L 60 70 Z" fill={GOLD} stroke={INK} strokeWidth={3} />
      <circle cx={40} cy={86} r={34} fill="#4A4A4E" />
      {ok ? <><circle cx={150} cy={60 + (f % 40) * 0.8} r={6} fill={BLUE} /><line x1={150} y1={20} x2={150} y2={50} stroke={INK} strokeWidth={10} strokeLinecap="round" /></>
          : <><rect x={160} y={10} width={70} height={46} rx={6} fill={ZINC} transform="rotate(30 195 33)" /><path d="M 150 60 C 140 80 120 90 100 92" stroke={BLUE} strokeWidth={14} fill="none" /></>}
    </svg>
    <Hand txt={sub} u={u} size={60} color={NAVY} />
    <div style={{ position: "absolute", right: 30, top: 30 }}><Tick u={u} no={!ok} size={110} /></div>
  </div>;
  return shell(<Bg k="gingham" f={f} dark={0.05} />, <>
    <Box x={140} u={n} ok={false} title="NEVER POUR" sub="the windpipe is right there" />
    <Box x={1020} u={y} ok title="A DROP AT A TIME" sub="side of the beak — let her swallow" />
  </>);
};

// 6 · la tina: 100°F, una taza de sal, 20 minutos
export const BathCard: PP<{ tTemp: number; tSalt: number; tMin: number; tPrice: number }> = ({ a, a0, tTemp, tSalt, tMin, tPrice }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), t = on(f, at(tTemp), 20), s = on(f, at(tSalt), 14), m = on(f, at(tMin), 14), p = sp(f, at(tPrice), 12, 160);
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 180, top: 600, width: 1560, height: 360, background: "linear-gradient(180deg, #CFE3EA, #9EC3CF)", borderRadius: "0 0 200px 200px", border: `14px solid #E8E6E0`, opacity: cl(u * 2) }} />
    <div style={{ position: "absolute", left: 220, top: 120, opacity: cl(t * 2) }}>
      <div style={{ width: 70, height: 400, background: CREAM, borderRadius: 35, border: `6px solid ${INK}`, position: "relative" }}>
        <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: 340 * t * 0.78, background: RED, borderRadius: 20 }} /></div>
      <div style={{ fontFamily: LAB, fontSize: 130, color: RED, marginTop: -260, marginLeft: 100 }}>100°F</div>
      <Hand txt="warmer than your wrist, not hot" u={t} size={56} color={NAVY} style={{ marginLeft: 100 }} />
    </div>
    <Card x={900} y={110} w={420} u={s} rot={-3} bg={TX.kraft}><Lab txt="1 CUP" size={96} color={NAVY} u={s} /><Hand txt="Epsom salt" u={s} size={64} color={INK} /></Card>
    <div style={{ position: "absolute", left: 1420, top: 90, opacity: cl(m * 2), transform: `scale(${0.7 + 0.3 * m})` }}><Clock m={20} u={eo(m)} size={300} />
      <div style={{ fontFamily: LAB, fontSize: 90, color: RED, textAlign: "center" }}>20 MIN</div></div>
    <div style={{ position: "absolute", left: 900, top: 470, opacity: cl(p * 2), transform: `rotate(-5deg) scale(${0.6 + 0.4 * p})` }}><Stamp txt="4 LB BAG ≈ $4" u={p} size={70} color={OK} /></div>
    <div style={{ position: "absolute", left: 760, top: 560, opacity: cl(u * 2) }}><Dot w={420} /></div>
  </>);
};

// 7 · las 3 cosas que NO hizo
export const ThreeNots: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="chalk" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 160, top: 90 }}><Hand txt="what I did NOT do" u={u} size={110} color={CREAM} chalk /></div>
    {items.map((it, i) => {
      const v = on(f, at(it.t), 12), x = on(f, at(it.t) + 14, 10);
      return <div key={i} style={{ position: "absolute", left: 220, top: 300 + i * 220, display: "flex", alignItems: "center", gap: 40, opacity: cl(v * 2) }}>
        <div style={{ fontFamily: LAB, fontSize: 150, color: GOLD }}>{i + 1}</div>
        <div style={{ position: "relative" }}><Hand txt={it.txt} u={v} size={96} color={CREAM} chalk />
          <div style={{ position: "absolute", left: -10, top: "52%", height: 10, width: `${105 * x}%`, background: RED, transform: "rotate(-2deg)" }} /></div>
      </div>;
    })}
  </>);
};

// 8 · cuándo llamar al vete (tarjeta roja con 5 señales)
export const VetWhen: PP<{ items: B[]; tPrice: number }> = ({ a, a0, items, tPrice }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), p = sp(f, at(tPrice), 12, 160);
  return shell(<Bg k="zinc" f={f} dark={0.2} />, <>
    <Card x={300} y={90} w={1320} h={900} u={u} rot={-1} bg={TX.card}>
      <div style={{ background: RED, margin: "-20px -20px 20px", padding: "16px 30px" }}><Lab txt="CALL THE VET IF…" size={92} color={CREAM} u={u} /></div>
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 26, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: RED, flexShrink: 0 }} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={64} color={NAVY} /></div>)}
      <div style={{ position: "absolute", right: 50, bottom: 40, opacity: cl(p * 2), transform: `rotate(-6deg) scale(${0.6 + 0.4 * p})` }}><Stamp txt="$80 – $150" u={p} size={84} /></div>
    </Card>
  </>);
};

// 9 · la balanza: huevo doble 3,5 oz vs normal 2 oz
export const EggScale: PP<{ tBig: number; tReg: number; tTwo: number }> = ({ a, a0, tBig, tReg, tTwo }) => {
  const { f, at } = useK(a, a0);
  const b = sp(f, at(tBig), 14, 120), r = sp(f, at(tReg), 14, 120), t = on(f, at(tTwo), 14);
  const Scale = ({ x, egg, oz, u, ang }: any) => <div style={{ position: "absolute", left: x, top: 220, opacity: cl(u * 2) }}>
    <div style={{ display: "flex", justifyContent: "center", height: 260, alignItems: "flex-end" }}><Egg w={egg} style={{ transform: `translateY(${(1 - u) * -200}px)` }} /></div>
    <div style={{ width: 520, height: 40, background: ZINC, borderRadius: 20 }} />
    <div style={{ width: 420, height: 300, margin: "0 auto", background: "#D8D4CA", borderRadius: "20px 20px 40px 40px", position: "relative" }}>
      <svg width={420} height={220} viewBox="0 0 420 220"><path d="M 60 200 A 150 150 0 0 1 360 200" fill={CREAM} stroke={INK} strokeWidth={4} />
        <line x1={210} y1={200} x2={210} y2={70} stroke={RED} strokeWidth={8} transform={`rotate(${-70 + ang * u} 210 200)`} /></svg>
      <div style={{ fontFamily: LAB, fontSize: 96, color: NAVY, textAlign: "center", marginTop: -20 }}>{oz}</div>
    </div>
  </div>;
  return shell(<Bg k="wood" f={f} dark={0.15} />, <>
    <Scale x={260} egg={180} oz="3.5 OZ" u={b} ang={120} />
    <Scale x={1140} egg={120} oz="2 OZ" u={r} ang={68} />
    <div style={{ position: "absolute", left: 300, top: 70, opacity: cl(t * 2), transform: "rotate(-4deg)" }}><Stamp txt="DOUBLE YOLKER" u={t} size={96} color={GOLD} /></div>
  </>);
};

// 10 · el estante de primeros auxilios con precios + total
export const FirstAidShelf: PP<{ rows: (B & { v: string })[]; total: B & { v: string }; vet: B }> = ({ a, a0, rows, total, vet }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), tt = sp(f, at(total.t), 12, 160), vv = on(f, at(vet.t), 12);
  return shell(<Bg k="barn" f={f} dark={0.3} />, <>
    <div style={{ position: "absolute", left: 140, top: 140, width: 1640, height: 26, background: "#7A5232", boxShadow: "0 18px 30px rgba(0,0,0,0.5)", opacity: cl(u * 2) }} />
    {rows.map((r, i) => {
      const v = sp(f, at(r.t), 12, 140);
      return <div key={i} style={{ position: "absolute", left: 180 + i * 330, top: 180, width: 300, opacity: cl(v * 2), transform: `translateY(${(1 - v) * -60}px)` }}>
        <div style={{ height: 220, background: [TX.kraft, TX.paper, CREAM, "#E9F2F4", TX.gingham][i % 5], borderRadius: 14, border: `5px solid ${INK}` }} />
        <Hand txt={r.txt} u={v} size={52} color={CREAM} style={{ marginTop: 14 }} />
        <div style={{ fontFamily: LAB, fontSize: 100, color: GOLD }}>{r.v}</div>
      </div>;
    })}
    <Card x={260} y={700} w={640} u={tt} rot={-2} bg={TX.card}><Hand txt={total.txt} u={tt} size={60} color={NAVY} /><div style={{ fontFamily: LAB, fontSize: 140, color: OK, lineHeight: 1 }}>{total.v}</div></Card>
    <Card x={1060} y={700} w={640} u={vv} rot={2} bg={TX.paper}><Hand txt={vet.txt} u={vv} size={60} color={NAVY} /><div style={{ fontFamily: LAB, fontSize: 120, color: RED, lineHeight: 1 }}>$80 – $150</div></Card>
  </>);
};

// 11 · la tarjeta de la heladera: la primera hora entera (recap)
export const FridgeCard: PP<{ items: (B & { m: string })[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(90deg, #E9E7E0, #F7F6F2)" }} />
    <Card x={260} y={60} w={1400} h={960} u={u} rot={-1} bg={TX.card}>
      <div style={{ position: "absolute", left: 640, top: -40, width: 120, height: 120, borderRadius: 60, background: RED, boxShadow: "0 8px 14px rgba(0,0,0,0.4)" }} />
      <Lab txt="THE FIRST HOUR" size={100} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 18, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <div style={{ width: 170, fontFamily: LAB, fontSize: 72, color: NAVY }}>{it.m}</div><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={62} color={INK} /></div>)}
    </Card>
  </>);
};

// 12 · tarea
export const Homework: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="night" f={f} dark={0} />, <>
    <Card x={360} y={170} w={1200} h={720} u={u} rot={-2} bg={TX.card}>
      <Lab txt="CHECK YOUR SHELF TONIGHT" size={96} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 40, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 6, 12)} size={80} /><Hand txt={it.txt} u={on(f, at(it.t), 18)} size={68} color={NAVY} />
      </div>)}
    </Card>
  </>);
};
