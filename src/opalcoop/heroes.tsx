// ── HÉROES de opalcoop (Opal's Hen House: el gallinero de 1994 por $280 — qué copiaría y qué no). Claude, 16-oct-2026.
//    Juego PROPIO: la factura de 1994 contra hoy, el plano de medidas (4 ft²/gallina adentro, 10 en el corral), el corte lateral con
//    alturas (perchas arriba de los nidos, bloques abajo, ventilación arriba), la cerca en L enterrada, la lista para copiar y la lista
//    para saltear, el pestillo de dos pasos contra el mapache, las reparaciones de 30 años, la tarjeta de la heladera y la tarea. PURO CSS/SVG.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useK, on, sp, ez, eo, cl, Bg, shell, Lab, Hand, Stamp, Tick, Card, Tape, Arrow, Hen, Egg, RecipeChapter, TX,
  LAB, HND, BARN, BARN2, CREAM, NAVY, INK, PENCIL, OK, RED, GOLD, STRAW, EGG, BLUE, ZINC, PP, B } from "./base";

// 1 · capítulo
export const Chapter: PP<{ n: number; title: string; sub: string; tw: number }> = ({ a, a0, n, title, sub }) => {
  const { f } = useK(a, a0);
  return <RecipeChapter f={f} n={n} kicker={n === 0 ? "what I'd skip" : "what I'd copy"} title={title} sub={sub} bg="wood" />;
};

// 2 · factura 1994 vs hoy
export const Bill94: PP<{ rows: (B & { v: string })[]; total: B & { v: string }; today: B & { v: string } }> = ({ a, a0, rows, total, today }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), tt = sp(f, at(total.t), 12, 160), td = sp(f, at(today.t), 12, 160);
  return shell(<Bg k="wood" f={f} dark={0.15} />, <>
    <Card x={140} y={80} w={1000} h={920} u={u} rot={-1.5} bg={TX.paper}>
      <div style={{ borderBottom: `6px double ${NAVY}`, paddingBottom: 12 }}><Lab txt="MY COOP · SPRING 1994" size={70} color={NAVY} u={u} /></div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 22, opacity: cl(on(f, at(r.t), 10) * 2), borderBottom: "2px dotted rgba(0,0,0,0.25)", paddingBottom: 6 }}>
        <Hand txt={r.txt} u={on(f, at(r.t), 16)} size={56} color={INK} /><div style={{ fontFamily: LAB, fontSize: 66, color: RED }}>{r.v}</div></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, opacity: cl(tt * 2) }}><Hand txt={total.txt} u={tt} size={66} color={NAVY} />
        <div style={{ fontFamily: LAB, fontSize: 104, color: OK, transform: `scale(${0.6 + 0.4 * tt})` }}>{total.v}</div></div>
    </Card>
    <div style={{ position: "absolute", left: 1230, top: 330, width: 560, textAlign: "center", opacity: cl(td * 2), transform: `rotate(4deg) scale(${0.6 + 0.4 * td})` }}>
      <Hand txt={today.txt} u={td} size={66} color={CREAM} />
      <div style={{ fontFamily: LAB, fontSize: 120, color: GOLD, lineHeight: 1.1, marginTop: 20 }}>{today.v}</div>
    </div>
  </>);
};

// 3 · plano de medidas: coop 8×6, corral 8×20, 4 ft² y 10 ft² por gallina
export const SizePlan: PP<{ tCoop: number; tRun: number; tRule: number }> = ({ a, a0, tCoop, tRun, tRule }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), c = on(f, at(tCoop), 14), r = on(f, at(tRun), 14), ru = sp(f, at(tRule), 12, 160);
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 140, top: 70 }}><Hand txt="measure before you build" u={u} size={90} color={NAVY} /></div>
    <div style={{ position: "absolute", left: 160, top: 260, width: 360, height: 270, border: `8px solid ${RED}`, background: "rgba(163,36,30,0.08)", opacity: cl(c * 2) }}>
      <Lab txt="COOP" size={60} color={RED} u={c} style={{ margin: 20 }} /><Hand txt="8 × 6 ft" u={c} size={60} color={INK} style={{ marginLeft: 20 }} /></div>
    <div style={{ position: "absolute", left: 520, top: 260, width: 1200 * r, height: 270, border: `8px dashed ${NAVY}`, borderLeft: "none", overflow: "hidden" }}>
      <div style={{ opacity: cl(r * 2), margin: 20 }}><Lab txt="RUN" size={60} color={NAVY} u={r} /><Hand txt="8 × 20 ft" u={r} size={60} color={INK} /></div></div>
    <div style={{ position: "absolute", left: 160, top: 620, display: "flex", gap: 60, opacity: cl(ru * 2) }}>
      <Card x={0} y={0} w={760} h={340} u={ru} rot={-2} bg={TX.card} style={{ position: "relative" }}>
        <div style={{ fontFamily: LAB, fontSize: 130, color: RED, lineHeight: 1 }}>4 ft²</div><Hand txt="per hen, inside" u={ru} size={60} color={NAVY} /></Card>
      <Card x={0} y={0} w={760} h={340} u={ru} rot={2} bg={TX.card} style={{ position: "relative" }}>
        <div style={{ fontFamily: LAB, fontSize: 130, color: NAVY, lineHeight: 1 }}>10 ft²</div><Hand txt="per hen, in the run" u={ru} size={60} color={NAVY} /></Card>
    </div>
  </>);
};

// 4 · corte lateral: bloques, perchas sobre nidos, ventilación arriba
export const CoopSection: PP<{ tBlocks: number; tRoost: number; tVent: number }> = ({ a, a0, tBlocks, tRoost, tVent }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), b = on(f, at(tBlocks), 14), r = on(f, at(tRoost), 14), v = on(f, at(tVent), 14);
  return shell(<Bg k="kraft" f={f} dark={0.1} />, <>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
      <g opacity={cl(u * 2)}>
        <path d="M400 820 L400 360 L960 220 L1520 360 L1520 820 Z" fill="#B8402F" stroke={INK} strokeWidth={8} />
        <path d="M330 380 L960 200 L1590 380" fill="none" stroke="#8D949A" strokeWidth={26} strokeLinecap="round" />
        <rect x={470} y={420} width={980} height={380} fill="#F2E8D4" stroke={INK} strokeWidth={5} />
      </g>
      <g opacity={cl(b * 2)}>{[430, 900, 1400].map((x, i) => <rect key={i} x={x} y={820} width={90} height={150} fill="#9AA0A4" stroke={INK} strokeWidth={5} />)}
        <line x1={300} y1={970} x2={1620} y2={970} stroke={INK} strokeWidth={6} /></g>
      <g opacity={cl(r * 2)}><rect x={520} y={560} width={560} height={22} fill="#7A5B3E" /><rect x={1140} y={680} width={280} height={110} fill="#C9A36A" stroke={INK} strokeWidth={4} /></g>
      <g opacity={cl(v * 2)}>{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${560 + i * 140} 440 q 30 -60 60 0`} fill="none" stroke={BLUE} strokeWidth={8} strokeDasharray="120" strokeDashoffset={120 * (1 - v)} />)}</g>
    </svg>
    <div style={{ position: "absolute", left: 560, top: 480, opacity: cl(r * 2) }}><Hen w={170} body="#D9A84E" wing="#C48F3A" /></div>
    <div style={{ position: "absolute", left: 1600, top: 860 }}><Hand txt="up on blocks · 1½ ft" u={b} size={52} color={NAVY} /></div>
    <div style={{ position: "absolute", left: 80, top: 520 }}><Hand txt="roosts ≈ 3 ft" u={r} size={56} color={RED} /></div>
    <div style={{ position: "absolute", left: 1460, top: 640 }}><Hand txt="nests ≈ 18 in" u={r} size={52} color={INK} /></div>
    <div style={{ position: "absolute", left: 1180, top: 120, opacity: cl(v * 2), transform: "rotate(4deg)" }}><Stamp txt="VENTS UP HIGH · OPEN ALL YEAR" u={v} size={56} color={NAVY} /></div>
  </>);
};

// 5 · cerca en L enterrada + tela de alambre (no alambre de gallinero)
export const BuriedL: PP<{ tWire: number; tL: number }> = ({ a, a0, tWire, tL }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), w = on(f, at(tWire), 14), l = on(f, at(tL), 20);
  return shell(<Bg k="barn" f={f} dark={0.2} />, <>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 440, background: "linear-gradient(180deg,#7A5C40,#4E3826)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M700 200 L700 860 L1180 860" fill="none" stroke={GOLD} strokeWidth={14} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(l)} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={700} y1={220 + i * 52} x2={712} y2={220 + i * 52} stroke={GOLD} strokeWidth={6} opacity={cl(w * 2)} />)}
      <line x1={500} y1={640} x2={1400} y2={640} stroke={CREAM} strokeWidth={4} strokeDasharray="12 10" />
    </svg>
    <div style={{ position: "absolute", left: 160, top: 160 }}><Hand txt="½ inch hardware cloth" u={w} size={76} color={CREAM} /></div>
    <div style={{ position: "absolute", left: 160, top: 280 }}><Hand txt="screwed down with washers" u={w} size={60} color={GOLD} /></div>
    <div style={{ position: "absolute", left: 740, top: 700 }}><Hand txt="1 ft deep" u={l} size={56} color={CREAM} /></div>
    <div style={{ position: "absolute", left: 960, top: 890 }}><Hand txt="1 ft out" u={l} size={56} color={CREAM} /></div>
    <div style={{ position: "absolute", left: 1260, top: 220, opacity: cl(l * 2), transform: "rotate(5deg)" }}><Stamp txt="NOTHING DIGS UNDER" u={l} size={70} color={OK} /></div>
  </>);
};

// 6 · lista (copiar / saltear)
export const CopyList: PP<{ items: B[]; title: string; skip?: boolean }> = ({ a, a0, items, title, skip }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k={skip ? "chalk" : "card"} f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 160, top: 70 }}><Hand txt={title} u={u} size={104} color={skip ? CREAM : OK} chalk={skip} /></div>
    {items.map((it, i) => { const v = on(f, at(it.t), 12), x = on(f, at(it.t) + 14, 10);
      return <div key={i} style={{ position: "absolute", left: 200, top: 250 + i * 130, opacity: cl(v * 2), display: "flex", alignItems: "center", gap: 30 }}>
        {skip ? <div style={{ fontFamily: LAB, fontSize: 80, color: GOLD, width: 70 }}>{i + 1}</div> : <Tick u={on(f, at(it.t) + 5, 12)} size={72} />}
        <div style={{ position: "relative", display: "inline-block" }}><Hand txt={it.txt} u={v} size={70} color={skip ? CREAM : NAVY} chalk={skip} />
          {skip ? <div style={{ position: "absolute", left: -10, top: "52%", height: 9, width: `${105 * x}%`, background: RED }} /> : null}</div></div>; })}
  </>);
};

// 7 · el pestillo de dos pasos contra el mapache
export const TwoStepLatch: PP<{ tPeg: number; tTwo: number; tAuto: number }> = ({ a, a0, tPeg, tTwo, tAuto }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), p = on(f, at(tPeg), 14), t = on(f, at(tTwo), 14), au = sp(f, at(tAuto), 12, 160);
  return shell(<Bg k="night" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 160, top: 240, width: 700, height: 600, background: TX.card, borderRadius: 14, border: `8px solid ${RED}`, padding: 34, opacity: cl(p * 2) }}>
      <Lab txt="1997 · A WOODEN PEG" size={62} color={RED} u={p} />
      <div style={{ margin: "60px auto", width: 160, height: 60, background: "#9C7A52", borderRadius: 30, transform: `translateX(${p * 160}px) rotate(${p * 30}deg)` }} />
      <Hand txt="a raccoon pulled it · 4 hens" u={p} size={56} color={INK} /></div>
    <div style={{ position: "absolute", left: 1060, top: 240, width: 700, height: 600, background: TX.card, borderRadius: 14, border: `8px solid ${OK}`, padding: 34, opacity: cl(t * 2) }}>
      <Lab txt="NOW · TWO STEPS" size={62} color={OK} u={t} />
      <Hand txt="1 · spring hook" u={on(f, at(tTwo) + 6, 14)} size={64} color={NAVY} style={{ marginTop: 50 }} />
      <Hand txt="2 · through the hasp" u={on(f, at(tTwo) + 14, 14)} size={64} color={NAVY} style={{ marginTop: 30 }} />
      <Hand txt="locked every night at dusk" u={t} size={52} color={INK} style={{ marginTop: 50 }} /></div>
    <div style={{ position: "absolute", left: 1100, top: 900, opacity: cl(au * 2), transform: "rotate(-3deg)" }}><Stamp txt="AUTO DOOR ≈ $130" u={au} size={62} color={GOLD} /></div>
  </>);
};

// 8 · 30 años de reparaciones
export const RepairBill: PP<{ rows: (B & { v: string })[]; total: B & { v: string } }> = ({ a, a0, rows, total }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), tt = sp(f, at(total.t), 12, 160);
  return shell(<Bg k="kraft" f={f} dark={0.1} />, <>
    <Card x={420} y={80} w={1080} h={920} u={u} rot={1.2} bg={TX.paper}>
      <div style={{ borderBottom: `6px double ${NAVY}`, paddingBottom: 12 }}><Lab txt="30 YEARS OF REPAIRS" size={74} color={NAVY} u={u} /></div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 22, opacity: cl(on(f, at(r.t), 10) * 2), borderBottom: "2px dotted rgba(0,0,0,0.25)", paddingBottom: 6 }}>
        <Hand txt={r.txt} u={on(f, at(r.t), 16)} size={56} color={INK} /><div style={{ fontFamily: LAB, fontSize: 64, color: r.v === "never" ? OK : RED }}>{r.v}</div></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 34, opacity: cl(tt * 2) }}><Hand txt={total.txt} u={tt} size={64} color={NAVY} />
        <div style={{ fontFamily: LAB, fontSize: 100, color: OK, transform: `scale(${0.6 + 0.4 * tt})` }}>{total.v}</div></div>
    </Card>
  </>);
};

// 9 · tarjeta de la heladera
export const FridgeCard: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <Card x={260} y={60} w={1400} h={960} u={u} rot={-1} bg={TX.card}>
      <div style={{ position: "absolute", left: 640, top: -40, width: 120, height: 120, borderRadius: 60, background: RED }} />
      <Lab txt="THE COOP — FOR THE FRIDGE" size={90} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 22, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 5, 12)} size={62} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={56} color={INK} /></div>)}
    </Card>
  </>);
};

// 10 · tarea
export const Homework: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="night" f={f} dark={0} />, <>
    <Card x={360} y={170} w={1200} h={720} u={u} rot={-2} bg={TX.card}>
      <Lab txt="TONIGHT, MEASURE YOUR SPACE" size={88} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 50, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 6, 12)} size={80} /><Hand txt={it.txt} u={on(f, at(it.t), 18)} size={66} color={NAVY} /></div>)}
    </Card>
  </>);
};
