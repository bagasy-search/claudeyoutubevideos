// ── HÉROES de opalscraps (Opal's Hen House: el balde de sobras, la regla de un décimo y las 5 cosas que nunca van). Claude, 16-oct-2026.
//    Juego PROPIO: la torta 9/10 alimento · 1/10 sobras, la semana de Clementine día por día, la lista de lo que sí va, las cuentas
//    honestas ($2,20 al mes), las cinco que nunca van tachadas en pizarrón, el balde paso a paso, la tarjeta de la heladera y la tarea. PURO CSS/SVG.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useK, on, sp, ez, eo, cl, Bg, shell, Lab, Hand, Stamp, Tick, Card, Tape, Arrow, Hen, Egg, RecipeChapter, TX,
  LAB, HND, BARN, BARN2, CREAM, NAVY, INK, PENCIL, OK, RED, GOLD, STRAW, EGG, BLUE, ZINC, PP, B } from "./base";

// 1 · capítulo
export const Chapter: PP<{ n: number; title: string; sub: string; tw: number }> = ({ a, a0, n, title, sub }) => {
  const { f } = useK(a, a0);
  return <RecipeChapter f={f} n={n} kicker={n === 0 ? "the never list" : "part"} title={title} sub={sub} bg="wood" />;
};

// 2 · un décimo: torta 9/10 alimento + 1/10 sobras
export const OneTenth: PP<{ tTenth: number; tNot: number }> = ({ a, a0, tTenth, tNot }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), t = on(f, at(tTenth), 20), n = on(f, at(tNot), 12);
  const R = 300, C = 2 * Math.PI * R;
  return shell(<Bg k="gingham" f={f} dark={0.05} />, <>
    <svg width={900} height={900} viewBox="0 0 900 900" style={{ position: "absolute", left: 120, top: 90, opacity: cl(u * 2) }}>
      <circle cx={450} cy={450} r={R} fill="none" stroke={STRAW} strokeWidth={260} />
      <circle cx={450} cy={450} r={R} fill="none" stroke={OK} strokeWidth={260} strokeDasharray={`${C * 0.1 * t} ${C}`} transform="rotate(-90 450 450)" />
      <circle cx={450} cy={450} r={170} fill={CREAM} stroke={INK} strokeWidth={4} />
    </svg>
    <div style={{ position: "absolute", left: 330, top: 470, width: 480, textAlign: "center", opacity: cl(t * 2) }}>
      <div style={{ fontFamily: LAB, fontSize: 150, color: OK, lineHeight: 1 }}>1/10</div><Hand txt="scraps" u={t} size={60} color={NAVY} /></div>
    <div style={{ position: "absolute", left: 1080, top: 230 }}><Hand txt="9/10 · her layer feed" u={u} size={80} color={NAVY} /></div>
    <div style={{ position: "absolute", left: 1080, top: 400 }}><Hand txt="1/10 · the scrap bucket" u={t} size={80} color={OK} /></div>
    <div style={{ position: "absolute", left: 1100, top: 640, opacity: cl(n * 2), transform: "rotate(-4deg)" }}><Stamp txt="NOT HALF · NOT MOST" u={n} size={70} /></div>
  </>);
};

// 3 · la semana de Clementine
export const ClemWeek: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="kraft" f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 140, top: 70 }}><Hand txt="Clementine's week" u={u} size={96} color={RED} /></div>
    <div style={{ position: "absolute", left: 150, top: 260, width: 1620, height: 8, background: PENCIL, transform: `scaleX(${u})`, transformOrigin: "left" }} />
    {items.map((it, i) => { const v = on(f, at(it.t), 12), x = 150 + i * 410;
      return <div key={i} style={{ position: "absolute", left: x, top: 230, width: 380, opacity: cl(v * 2), transform: `translateY(${(1 - v) * 40}px)` }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: i === 0 ? RED : OK, border: `5px solid ${INK}` }} />
        <Lab txt={it.d} size={66} color={NAVY} u={v} style={{ marginTop: 20 }} />
        <Hand txt={it.txt} u={v} size={52} color={INK} style={{ marginTop: 12 }} />
        <div style={{ marginTop: 30 }}><Hen w={260} body={i === 0 ? "#7A3A26" : "#9C3B22"} wing="#6E2A18" comb={i === 0 ? "#B98080" : "#D8322A"} /></div>
      </div>; })}
  </>);
};

// 4 · lo que sí va
export const YesList: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="card" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 140, top: 90 }}><Hand txt="what goes in" u={u} size={110} color={OK} /></div>
    <Card x={760} y={120} w={1020} h={840} u={u} rot={1.5} bg={TX.paper}>
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: i ? 44 : 10, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 5, 12)} size={72} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={64} color={NAVY} /></div>)}
    </Card>
    <svg width={520} height={560} viewBox="0 0 200 215" style={{ position: "absolute", left: 160, top: 360, opacity: cl(u * 2) }}>
      <path d="M30 60 L45 200 L155 200 L170 60 Z" fill="#F3F1EA" stroke={INK} strokeWidth={4} />
      <ellipse cx={100} cy={60} rx={70} ry={14} fill="#E4E0D4" stroke={INK} strokeWidth={4} />
      <path d="M40 58 Q100 -10 160 58" fill="none" stroke={INK} strokeWidth={4} />
      {[["#E07A2E", 70, 45], ["#7DB24A", 100, 40], ["#C9302C", 130, 46], ["#E8C860", 90, 52]].map(([c, x, y], i) => <circle key={i} cx={x as number} cy={y as number} r={12} fill={c as string} />)}
    </svg>
  </>);
};

// 5 · cuentas honestas
export const ScrapsMoney: PP<{ rows: (B & { v: string })[]; total: B & { v: string } }> = ({ a, a0, rows, total }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), tt = sp(f, at(total.t), 12, 160);
  return shell(<Bg k="wood" f={f} dark={0.15} />, <>
    <Card x={420} y={110} w={1080} h={860} u={u} rot={-1.5} bg={TX.paper}>
      <div style={{ borderBottom: `6px double ${NAVY}`, paddingBottom: 12 }}><Lab txt="WHAT SCRAPS SAVE ME" size={74} color={NAVY} u={u} /></div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 30, opacity: cl(on(f, at(r.t), 10) * 2), borderBottom: "2px dotted rgba(0,0,0,0.25)", paddingBottom: 8 }}>
        <Hand txt={r.txt} u={on(f, at(r.t), 16)} size={60} color={INK} /><div style={{ fontFamily: LAB, fontSize: 72, color: RED }}>{r.v}</div></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, opacity: cl(tt * 2) }}><Hand txt={total.txt} u={tt} size={70} color={NAVY} />
        <div style={{ fontFamily: LAB, fontSize: 110, color: OK, transform: `scale(${0.6 + 0.4 * tt})` }}>{total.v}</div></div>
    </Card>
  </>);
};

// 6 · las cinco que nunca van (pizarrón, tachadas)
export const NeverFive: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="chalk" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 160, top: 70 }}><Hand txt="never in my bucket" u={u} size={104} color={CREAM} chalk /></div>
    {items.map((it, i) => { const v = on(f, at(it.t), 12), x = on(f, at(it.t) + 14, 10);
      return <div key={i} style={{ position: "absolute", left: 220, top: 250 + i * 160, opacity: cl(v * 2), display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ fontFamily: LAB, fontSize: 90, color: GOLD, width: 80 }}>{i + 1}</div>
        <div style={{ position: "relative", display: "inline-block" }}><Hand txt={it.txt} u={v} size={80} color={CREAM} chalk />
          <div style={{ position: "absolute", left: -10, top: "52%", height: 10, width: `${105 * x}%`, background: RED }} /></div></div>; })}
  </>);
};

// 7 · el balde paso a paso
export const BucketSteps: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 140, top: 80 }}><Hand txt="how my bucket works" u={u} size={96} color={NAVY} /></div>
    {items.map((it, i) => { const v = on(f, at(it.t), 12);
      return <div key={i} style={{ position: "absolute", left: 140 + i * 430, top: 330, width: 390, height: 520, background: TX.card, border: `6px solid ${NAVY}`, borderRadius: 14, padding: 30, opacity: cl(v * 2), transform: `translateY(${(1 - v) * 50}px) rotate(${(i % 2 ? 1 : -1) * 1.5}deg)` }}>
        <div style={{ fontFamily: LAB, fontSize: 120, color: RED, lineHeight: 1 }}>{i + 1}</div>
        <Hand txt={it.txt} u={v} size={58} color={INK} style={{ marginTop: 30 }} />
        {i < items.length - 1 ? <div style={{ position: "absolute", right: -70, top: 220, width: 90, height: 60 }}><Arrow d="M5 30 L80 30 M60 12 L80 30 L60 48" u={on(f, at(it.t) + 10, 12)} /></div> : null}
      </div>; })}
  </>);
};

// 8 · tarjeta de la heladera
export const FridgeCard: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <Card x={260} y={60} w={1400} h={960} u={u} rot={-1} bg={TX.card}>
      <div style={{ position: "absolute", left: 640, top: -40, width: 120, height: 120, borderRadius: 60, background: RED }} />
      <Lab txt="SCRAPS — FOR THE FRIDGE" size={96} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 26, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 5, 12)} size={66} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={60} color={INK} /></div>)}
    </Card>
  </>);
};

// 9 · tarea
export const Homework: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="kraft" f={f} dark={0.1} />, <>
    <Card x={360} y={170} w={1200} h={720} u={u} rot={-2} bg={TX.card}>
      <Lab txt="TOMORROW, MEASURE IT" size={96} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 50, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 6, 12)} size={80} /><Hand txt={it.txt} u={on(f, at(it.t), 18)} size={68} color={NAVY} /></div>)}
    </Card>
  </>);
};
