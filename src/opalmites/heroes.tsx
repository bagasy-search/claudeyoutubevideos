// ── HÉROES de opalmites (Opal's Hen House: "You Are Treating Coop Mites WRONG! … (There's No Magic Teaspoon)"). Claude, 16-oct-2026.
//    Juego PROPIO: la cucharita tachada sobre el bebedero, las señales de Pearl (cresta pálida), los dos ácaros (en el ave / en las paredes),
//    la prueba del papel blanco con linterna, el ciclo de 7 días (huevo → adulto) en rueda, el calendario rojo día 1/8/15, el roost desarmado
//    con las grietas marcadas, la caja de herramientas con precios, la tarjeta de la heladera y la tarea. PURO CSS/SVG.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useK, on, sp, ez, eo, cl, Bg, shell, Lab, Hand, Stamp, Tick, Card, Tape, Arrow, Hen, Egg, RecipeChapter, TX,
  LAB, HND, BARN, BARN2, CREAM, NAVY, INK, PENCIL, OK, RED, GOLD, STRAW, EGG, BLUE, ZINC, PP, B } from "./base";

const Mite: React.FC<{ s: number; c?: string; style?: React.CSSProperties }> = ({ s, c = "#A3241E", style }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" style={style}>
    {[-1, 1].map((k) => [10, 17, 24, 30].map((y, i) => <line key={k + "" + i} x1={20} y1={y} x2={20 + k * 17} y2={y + (i - 1.5) * 4} stroke={c} strokeWidth={2.2} />))}
    <ellipse cx={20} cy={21} rx={9} ry={11} fill={c} /><circle cx={20} cy={9} r={4} fill={c} />
  </svg>
);

// 1 · capítulo
export const Chapter: PP<{ n: number; title: string; sub: string; tw: number }> = ({ a, a0, n, title, sub }) => {
  const { f } = useK(a, a0);
  return <RecipeChapter f={f} n={n} kicker={n === 0 ? "the mistake" : "step"} title={title} sub={sub} bg="wood" />;
};

// 2 · no hay cucharita: bebedero + cuchara tachada
export const NoTeaspoon: PP<{ tSpoon: number; tNo: number }> = ({ a, a0, tSpoon, tNo }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), s = sp(f, at(tSpoon), 14, 140), n = on(f, at(tNo), 12);
  return shell(<Bg k="gingham" f={f} dark={0.05} />, <>
    <svg width={700} height={700} viewBox="0 0 200 200" style={{ position: "absolute", left: 200, top: 220, opacity: cl(u * 2) }}>
      <rect x={60} y={30} width={80} height={110} rx={10} fill="#B9C0C4" stroke={INK} strokeWidth={3} />
      <ellipse cx={100} cy={150} rx={80} ry={18} fill="#A0A8AD" stroke={INK} strokeWidth={3} /><ellipse cx={100} cy={147} rx={66} ry={10} fill={BLUE} />
    </svg>
    <div style={{ position: "absolute", left: 980, top: 300, opacity: cl(s * 2), transform: `rotate(${-30 + (1 - s) * -40}deg) scale(${0.6 + 0.4 * s})` }}>
      <svg width={600} height={240} viewBox="0 0 300 120"><ellipse cx={60} cy={60} rx={50} ry={32} fill="#CFD3D6" stroke={INK} strokeWidth={4} /><rect x={105} y={52} width={180} height={16} rx={8} fill="#CFD3D6" stroke={INK} strokeWidth={4} /></svg>
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={950} y1={200} x2={1650} y2={720} stroke={RED} strokeWidth={26} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - n)} />
    </svg>
    <div style={{ position: "absolute", left: 960, top: 760, opacity: cl(n * 2), transform: "rotate(-4deg)" }}><Stamp txt="NOTHING IN THE WATER KILLS MITES" u={n} size={64} /></div>
  </>);
};

// 3 · señales de Pearl
export const PearlSigns: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="card" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 140, top: 240, opacity: cl(u * 2) }}><Hen w={700} body="#D9A84E" wing="#C48F3A" comb="#E8A3A3" /></div>
    <div style={{ position: "absolute", left: 120, top: 80 }}><Hand txt="Pearl — what I saw" u={on(f, 4, 20)} size={84} color={RED} /></div>
    <Card x={1000} y={170} w={780} h={780} u={u} rot={1.5} bg={TX.paper}>
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: i ? 34 : 6, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 5, 12)} size={66} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={60} color={NAVY} /></div>)}
    </Card>
  </>);
};

// 4 · los dos ácaros: en el ave / en las paredes
export const TwoMites: PP<{ tBird: number; tWall: number; tNight: number }> = ({ a, a0, tBird, tWall, tNight }) => {
  const { f, at } = useK(a, a0);
  const b = on(f, at(tBird), 14), w = on(f, at(tWall), 14), n = on(f, at(tNight), 14);
  const Col = ({ x, u, title, sub, wall }: any) => <div style={{ position: "absolute", left: x, top: 140, width: 760, height: 800, background: TX.card, borderRadius: 14, border: `8px solid ${NAVY}`, padding: 36, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px)` }}>
    <Lab txt={title} size={78} color={NAVY} u={u} />
    <div style={{ height: 380, position: "relative", marginTop: 20 }}>
      {wall ? <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, #8A7A66 0 60px, #3A3028 60px 66px)`, borderRadius: 8 }}>
        {Array.from({ length: 14 }, (_, i) => <Mite key={i} s={30} style={{ position: "absolute", left: 30 + (i * 53) % 640, top: 52 + Math.floor(i / 7) * 66 + Math.sin(f / 8 + i) * 3 }} />)}</div>
        : <div style={{ position: "absolute", left: 150, top: 10 }}><Hen w={420} body="#D9A84E" wing="#C48F3A" />
          {Array.from({ length: 6 }, (_, i) => <Mite key={i} s={26} c="#3A2A26" style={{ position: "absolute", left: 60 + i * 22, top: 230 + (i % 2) * 18 }} />)}</div>}
    </div>
    <Hand txt={sub} u={u} size={58} color={PENCIL} style={{ marginTop: 20 }} />
  </div>;
  return shell(<Bg k="wood" f={f} dark={0.2} />, <>
    <Col x={140} u={b} title="ON THE BIRD" sub="day & night, around the vent" />
    <Col x={1020} u={w} title="IN THE WALLS" sub="hides all day in the cracks" wall />
    <div style={{ position: "absolute", left: 1180, top: 900, opacity: cl(n * 2), transform: "rotate(-4deg)" }}><Stamp txt="COMES OUT AT NIGHT" u={n} size={66} /></div>
  </>);
};

// 5 · prueba del papel blanco con linterna
export const PaperTest: PP<{ tWipe: number; tRed: number }> = ({ a, a0, tWipe, tRed }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), w = on(f, at(tWipe), 30), r = on(f, at(tRed), 20);
  return shell(<Bg k="night" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `radial-gradient(circle at ${700 + w * 400}px 440px, rgba(255,240,200,0.35), transparent 380px)` }} />
    <div style={{ position: "absolute", left: 200, top: 300, width: 1500, height: 70, background: "#6B5440", borderRadius: 10, opacity: cl(u * 2) }} />
    <div style={{ position: "absolute", left: 360 + w * 700, top: 360, width: 420, height: 300, background: "#FBFBF8", transform: "rotate(-3deg)", boxShadow: "0 20px 30px rgba(0,0,0,0.5)", opacity: cl(u * 2) }}>
      {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + (i * 47) % 380, top: 30 + Math.floor(i / 8) * 90 + (i % 3) * 20, width: 50 + (i % 4) * 20, height: 7, background: RED, borderRadius: 4, opacity: cl(r * 3 - i / 8), transform: `rotate(${(i % 5) * 7 - 14}deg)` }} />)}
    </div>
    <div style={{ position: "absolute", left: 220, top: 760 }}><Hand txt="white paper · after dark · under the roost" u={u} size={76} color={CREAM} chalk /></div>
    <div style={{ position: "absolute", left: 1260, top: 120, opacity: cl(r * 2), transform: "rotate(5deg)" }}><Stamp txt="RED = BLOOD = MITES" u={r} size={70} /></div>
  </>);
};

// 6 · el ciclo de 7 días: huevo → ninfa → adulto → huevo
export const SevenCycle: PP<{ tEgg: number; tAdult: number; tWeek: number }> = ({ a, a0, tEgg, tAdult, tWeek }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), e = on(f, at(tEgg), 14), ad = on(f, at(tAdult), 14), wk = sp(f, at(tWeek), 12, 160);
  const st = [["EGG", e], ["BABY", (e + ad) / 2], ["ADULT", ad], ["EGGS AGAIN", ad]] as const;
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cl(u * 2) }}>
      <circle cx={960} cy={540} r={330} fill="none" stroke={PENCIL} strokeWidth={6} strokeDasharray="2080" strokeDashoffset={2080 * (1 - ad)} />
    </svg>
    {st.map(([t, v], i) => { const ang = i * Math.PI / 2 - Math.PI / 2; return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * 330 - 150, top: 540 + Math.sin(ang) * 330 - 90, width: 300, textAlign: "center", opacity: cl(v * 2) }}>
      {i === 0 ? <Egg w={70} c="#EDE6D6" /> : <Mite s={60 + i * 12} />}<Lab txt={t} size={56} color={NAVY} u={v} /></div>; })}
    <div style={{ position: "absolute", left: 760, top: 470, width: 400, textAlign: "center", opacity: cl(wk * 2), transform: `scale(${0.6 + 0.4 * wk})` }}>
      <div style={{ fontFamily: LAB, fontSize: 150, color: RED, lineHeight: 1 }}>≈ 7 DAYS</div></div>
  </>);
};

// 7 · calendario rojo: día 1, 8, 15
export const RedCalendar: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120); const days = [1, 8, 15];
  return shell(<Bg k="kraft" f={f} dark={0.1} />, <>
    <Card x={300} y={90} w={1320} h={900} u={u} rot={-1} bg={TX.card}>
      <Lab txt="TREAT 3 TIMES · 7 DAYS APART" size={78} color={NAVY} u={u} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginTop: 24 }}>
        {Array.from({ length: 21 }, (_, i) => { const d = i + 1, k = days.indexOf(d), v = k >= 0 ? on(f, at(items[k]?.t ?? 0), 12) : 0;
          return <div key={i} style={{ height: 180, border: `3px solid ${PENCIL}`, position: "relative", fontFamily: LAB, fontSize: 52, color: INK, padding: 8 }}>{d}
            {k >= 0 ? <svg width={160} height={160} style={{ position: "absolute", left: 6, top: 10 }}><ellipse cx={80} cy={80} rx={70} ry={64} fill="none" stroke={RED} strokeWidth={8} strokeDasharray="440" strokeDashoffset={440 * (1 - v)} /></svg> : null}
            {k >= 0 ? <div style={{ position: "absolute", left: 10, bottom: 6, opacity: cl(v * 2) }}><Hand txt={items[k].txt} u={v} size={34} color={RED} /></div> : null}</div>; })}
      </div>
    </Card>
  </>);
};

// 8 · el roost: grietas y uniones marcadas
export const RoostCracks: PP<{ tCrack: number; tJoint: number; tNew: number }> = ({ a, a0, tCrack, tJoint, tNew }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), c = on(f, at(tCrack), 14), j = on(f, at(tJoint), 14), nw = sp(f, at(tNew), 12, 160);
  return shell(<Bg k="barn" f={f} dark={0.25} />, <>
    <div style={{ position: "absolute", left: 160, top: 420, width: 1400, height: 120, background: "linear-gradient(180deg,#9C8064,#6E5641)", borderRadius: 12, opacity: cl(u * 2) }}>
      {[260, 520, 900, 1150].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 20 + (i % 2) * 30, width: 160, height: 6, background: "#2A1E16", transform: `rotate(${i * 6 - 8}deg)` }} />)}
    </div>
    <div style={{ position: "absolute", left: 1500, top: 380, width: 140, height: 200, background: "#5A4636", border: `4px solid #2A1E16`, opacity: cl(u * 2) }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {[340, 600, 980, 1230].map((x, i) => <circle key={i} cx={x} cy={470} r={70} fill="none" stroke={GOLD} strokeWidth={8} strokeDasharray="440" strokeDashoffset={440 * (1 - c)} />)}
      <circle cx={1550} cy={480} r={120} fill="none" stroke={RED} strokeWidth={10} strokeDasharray="760" strokeDashoffset={760 * (1 - j)} />
    </svg>
    <div style={{ position: "absolute", left: 180, top: 640 }}><Hand txt="scrape every crack" u={c} size={80} color={CREAM} /></div>
    <div style={{ position: "absolute", left: 1260, top: 640 }}><Hand txt="where wood meets wood" u={j} size={70} color={GOLD} /></div>
    <div style={{ position: "absolute", left: 220, top: 140, opacity: cl(nw * 2), transform: `rotate(-5deg) scale(${0.6 + 0.4 * nw})` }}><Stamp txt="NEW 2×4 ≈ $5" u={nw} size={76} color={OK} /></div>
  </>);
};

// 9 · lo que NO uso
export const DontUse: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="chalk" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 160, top: 90 }}><Hand txt="what I don't use" u={u} size={110} color={CREAM} chalk /></div>
    {items.map((it, i) => { const v = on(f, at(it.t), 12), x = on(f, at(it.t) + 14, 10);
      return <div key={i} style={{ position: "absolute", left: 220, top: 300 + i * 220, opacity: cl(v * 2) }}><div style={{ position: "relative", display: "inline-block" }}>
        <Hand txt={it.txt} u={v} size={92} color={CREAM} chalk /><div style={{ position: "absolute", left: -10, top: "52%", height: 10, width: `${105 * x}%`, background: RED }} /></div></div>; })}
  </>);
};

// 10 · cuentas: lo que costó
export const MitesMoney: PP<{ rows: (B & { v: string })[]; total: B & { v: string } }> = ({ a, a0, rows, total }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), tt = sp(f, at(total.t), 12, 160);
  return shell(<Bg k="wood" f={f} dark={0.15} />, <>
    <Card x={420} y={90} w={1080} h={900} u={u} rot={-1.5} bg={TX.paper}>
      <div style={{ borderBottom: `6px double ${NAVY}`, paddingBottom: 12 }}><Lab txt="MITES — WHAT IT COST ME" size={70} color={NAVY} u={u} /></div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 26, opacity: cl(on(f, at(r.t), 10) * 2), borderBottom: "2px dotted rgba(0,0,0,0.25)", paddingBottom: 8 }}>
        <Hand txt={r.txt} u={on(f, at(r.t), 16)} size={60} color={INK} /><div style={{ fontFamily: LAB, fontSize: 72, color: RED }}>{r.v}</div></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, opacity: cl(tt * 2) }}><Hand txt={total.txt} u={tt} size={70} color={NAVY} />
        <div style={{ fontFamily: LAB, fontSize: 110, color: OK, transform: `scale(${0.6 + 0.4 * tt})` }}>{total.v}</div></div>
    </Card>
  </>);
};

// 11 · tarjeta de la heladera (recap)
export const FridgeCard: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="paper" f={f} dark={0} />, <>
    <Card x={260} y={60} w={1400} h={960} u={u} rot={-1} bg={TX.card}>
      <div style={{ position: "absolute", left: 640, top: -40, width: 120, height: 120, borderRadius: 60, background: RED }} />
      <Lab txt="MITES — FOR THE FRIDGE" size={96} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 26, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 5, 12)} size={66} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={60} color={INK} /></div>)}
    </Card>
  </>);
};

// 12 · tarea
export const Homework: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="night" f={f} dark={0} />, <>
    <Card x={360} y={170} w={1200} h={720} u={u} rot={-2} bg={TX.card}>
      <Lab txt="TONIGHT, WITH A FLASHLIGHT" size={96} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 50, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 6, 12)} size={80} /><Hand txt={it.txt} u={on(f, at(it.t), 18)} size={68} color={NAVY} /></div>)}
    </Card>
  </>);
};
