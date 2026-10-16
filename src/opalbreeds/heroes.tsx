// ── HÉROES de opalbreeds (Opal's Hen House: "I've Raised Over 30 Breeds in 50 Years. I'd Only Buy These 4 Again"). Claude, 16-oct-2026.
//    Juego PROPIO: ficha de criadero de cada raza (tarjeta de feria con roseta), etiqueta del tubo de la tienda que se tacha, panza de Clover
//    (diagrama de señales), presupuesto del veterinario, cinta de concurso 1922 (364/365), hoja de cuidados de las ponedoras, raza tachada (Wyandotte/
//    Silkie), termómetro frío/calor con crestas, bandada de 6 recomendada, comparativa Clover vs Pansy en libreta (costo por docena), podio de las 4.
//    PURO CSS/SVG.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useK, on, sp, ez, eo, cl, Bg, shell, Lab, Hand, Stamp, Tick, Card, Tape, Arrow, Hen, Egg, RecipeChapter, TX,
  LAB, HND, BARN, BARN2, CREAM, NAVY, INK, PENCIL, OK, RED, GOLD, STRAW, EGG, BLUE, ZINC, PP, B } from "./base";

const HENC: Record<string, [string, string?, string?]> = {   // cuerpo, ala, cresta
  red: ["#A44A22", "#7E3416"], aus: ["#16161C", "#2F4A3A"], buff: ["#D9A84E", "#C48F3A"], rock: ["#5E5E62", "#2A2A2E"], ee: ["#8C6A4A", "#5C4632"],
  wy: ["#E8E8E8", "#3A3A3A"], silk: ["#F4F1EA", "#E2DDD2", "#5A3A44"], leg: ["#F6F4EE", "#E0DCD2"],
};
const BHen: React.FC<{ k: string; w: number; flip?: boolean; style?: React.CSSProperties }> = ({ k, w, flip, style }) => {
  const [b, wi, c] = HENC[k] || HENC.red;
  return <div style={{ position: "relative", ...style }}>
    <Hen w={w} body={b} wing={wi} comb={c || RED} flip={flip} />
    {k === "rock" ? <svg width={w} height={w * 0.9} viewBox="0 0 200 180" style={{ position: "absolute", left: 0, top: 0, transform: flip ? "scaleX(-1)" : undefined }}>
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${46 + i * 13} ${70 + (i % 2) * 6} C ${60 + i * 13} 100 ${50 + i * 13} 130 ${60 + i * 13} 150`} stroke="#E8E8E8" strokeWidth={5} fill="none" opacity={0.75} />)}</svg> : null}
    {k === "wy" ? <svg width={w} height={w * 0.9} viewBox="0 0 200 180" style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={60 + (i % 5) * 18} cy={80 + Math.floor(i / 5) * 22} rx={9} ry={7} fill="none" stroke="#2A2A2A" strokeWidth={3} />)}</svg> : null}
  </div>;
};

// 1 · capítulo
export const Chapter: PP<{ n: number; title: string; sub: string; tw: number }> = ({ a, a0, n, title, sub }) => {
  const { f } = useK(a, a0);
  return <RecipeChapter f={f} n={n} kicker={n === 0 ? "the one I'd never buy twice" : "I'd buy again, no."} title={title} sub={sub} bg="wood" />;
};

// 2 · etiqueta del tubo de la tienda: lo que promete → se tacha lo que no dice
export const TubTag: PP<{ tPrice: number; tTag: number; tStrike: number }> = ({ a, a0, tPrice, tTag, tStrike }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), p = sp(f, at(tPrice), 12, 160), s = on(f, at(tStrike), 14);
  const L = ["300+ EGGS A YEAR", "FRIENDLY", "EASY KEEPER"];
  return shell(<Bg k="zinc" f={f} dark={0.25} />, <>
    <div style={{ position: "absolute", left: 120, top: 240, opacity: cl(u * 2), transform: `translateX(${(1 - u) * -80}px)` }}><BHen k="red" w={620} /></div>
    <div style={{ position: "absolute", left: 860, top: 140, width: 900, height: 780, background: "linear-gradient(170deg, #FFFDF4, #EFE6CF)", borderRadius: 14, border: `10px solid ${RED}`,
      boxShadow: "0 40px 70px rgba(0,0,0,0.5)", padding: "40px 60px", opacity: cl(u * 2), transform: `perspective(1400px) rotateY(${(1 - u) * -24}deg) rotate(1.5deg)` }}>
      <Lab txt="RED PRODUCTION PULLETS" size={78} color={NAVY} u={u} />
      <div style={{ fontFamily: LAB, fontSize: 210, color: RED, lineHeight: 1, marginTop: 10, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "left", opacity: cl(p * 2) }}>$6.50</div>
      {L.map((l, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 18, opacity: cl(on(f, at(tTag) + i * 7, 10) * 2) }}>
        <Tick u={on(f, at(tTag) + i * 7 + 4, 10)} size={64} /><Lab txt={l} size={70} color={INK} />
      </div>)}
      <div style={{ marginTop: 30, opacity: cl(s * 2) }}><Hand txt="…for about two years" u={s} size={78} color={RED} /></div>
    </div>
  </>);
};

// 3 · el diagrama de las señales de Clover (silueta + 4 señales que se marcan)
export const PenguinSigns: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  const pos = [[640, 170], [560, 760], [380, 560], [900, 300]];
  const tip = [[930, 260], [960, 820], [520, 640], [1080, 360]];
  return shell(<Bg k="card" f={f} dark={0} />, <>
    <div style={{ position: "absolute", left: 360, top: 140, opacity: cl(u * 2), transform: "rotate(-62deg)", transformOrigin: "300px 300px" }}><BHen k="red" w={560} /></div>
    <div style={{ position: "absolute", left: 80, top: 60 }}><Hand txt="Clover — what I saw" u={on(f, 4, 20)} size={84} color={RED} /></div>
    {items.map((it, i) => {
      const g = on(f, at(it.t), 14);
      return <React.Fragment key={i}>
        <Arrow d={`M ${pos[i][0] + 340} ${pos[i][1] + 40} L ${tip[i][0]} ${tip[i][1]}`} u={g} color={RED} w={7} />
        <div style={{ position: "absolute", left: tip[i][0] + 20, top: tip[i][1] - 40, opacity: cl(g * 2), background: "rgba(255,253,245,0.9)", padding: "8px 24px", borderRadius: 8, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>
          <Hand txt={it.txt} u={g} size={62} color={NAVY} /></div>
      </React.Fragment>;
    })}
  </>);
};

// 4 · presupuesto del veterinario (papel con membrete, renglones y nota)
export const VetQuote: PP<{ rows: (B & { v: string })[]; tNote: number }> = ({ a, a0, rows, tNote }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), n = sp(f, at(tNote), 12, 160);
  return shell(<Bg k="gingham" f={f} dark={0.05} />, <>
    <Card x={420} y={100} w={1080} h={860} u={u} rot={-1.5} bg={TX.paper}>
      <div style={{ borderBottom: `6px double ${NAVY}`, paddingBottom: 14 }}><Lab txt="COUNTY ANIMAL CLINIC — ESTIMATE" size={64} color={NAVY} u={u} /></div>
      <Hand txt="patient: Clover (hen, 2 yrs)" u={on(f, 8, 20)} size={58} color={PENCIL} style={{ marginTop: 16 }} />
      {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 40, opacity: cl(on(f, at(r.t), 10) * 2), borderBottom: "2px dotted rgba(0,0,0,0.25)", paddingBottom: 10 }}>
        <Hand txt={r.txt} u={on(f, at(r.t), 16)} size={64} color={INK} /><div style={{ fontFamily: LAB, fontSize: 76, color: RED }}>{r.v}</div>
      </div>)}
      <div style={{ position: "absolute", left: 40, bottom: 50, opacity: cl(n * 2), transform: "rotate(-3deg)" }}><Stamp txt="OFTEN COMES BACK" u={n} size={70} /></div>
    </Card>
  </>);
};

// 5 · cinta del concurso de 1922: 364 de 365 (calendario de casilleros que se llenan)
export const Record364: PP<{ tAus: number; tN: number }> = ({ a, a0, tAus, tN }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), g = on(f, at(tN), 40), r = sp(f, at(tAus), 13, 140);
  return shell(<Bg k="wood" f={f} dark={0.25} />, <>
    <div style={{ position: "absolute", left: 140, top: 170, width: 1000, height: 760, background: TX.paper, padding: 30, borderRadius: 6, boxShadow: "0 40px 70px rgba(0,0,0,0.5)", opacity: cl(u * 2),
      display: "grid", gridTemplateColumns: "repeat(26, 1fr)", gap: 5 }}>
      {Array.from({ length: 365 }, (_, i) => <div key={i} style={{ borderRadius: "50%", aspectRatio: "0.78", background: i === 200 ? "rgba(0,0,0,0.08)" : (i / 365 < g ? "radial-gradient(circle at 35% 30%, #E9C9A6, #B37E50)" : "rgba(0,0,0,0.06)") }} />)}
    </div>
    <div style={{ position: "absolute", left: 160, top: 70 }}><Lab txt="AUSTRALIA, 1922 — ONE HEN" size={92} color={CREAM} u={u} /></div>
    <div style={{ position: "absolute", left: 1230, top: 230, width: 500, opacity: cl(r * 2), transform: `rotate(${(1 - r) * 30 + 4}deg) scale(${0.6 + 0.4 * r})` }}>
      <div style={{ width: 380, height: 380, borderRadius: "50%", margin: "0 auto", background: "repeating-conic-gradient(#1F4F9C 0 8deg, #2B66C2 8deg 16deg)", boxShadow: "0 30px 50px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #F7E7B0, #D9B54E)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: LAB, fontSize: 110, color: NAVY, lineHeight: 0.9 }}>364</div><div style={{ fontFamily: LAB, fontSize: 40, color: NAVY }}>OF 365 DAYS</div></div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: -20 }}>{[0, 1].map(k => <div key={k} style={{ width: 90, height: 230, background: "linear-gradient(180deg,#2B66C2,#1F4F9C)", clipPath: "polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)", transform: `rotate(${k ? 8 : -8}deg)` }} />)}</div>
      <div style={{ textAlign: "center", marginTop: 10 }}><Lab txt="AN AUSTRALORP" size={80} color={GOLD} u={r} /></div>
    </div>
  </>);
};

// 6 · ficha de raza (tarjeta de feria): gallina, huevo, años de postura, frío, carácter, precio
export const BreedCard: PP<{ name: string; hk: string; egg: string; eggs: string; years: string; cold: string; temper: string; price: string; tE: number; tY: number; tP: number; note?: B }> = (p) => {
  const { a, a0 } = p; const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), e = on(f, at(p.tE), 14), y = on(f, at(p.tY), 14), pr = sp(f, at(p.tP), 12, 160);
  const Row = ({ k, v, g }: any) => <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 22, opacity: cl(g * 2), transform: `translateX(${(1 - g) * 40}px)` }}>
    <div style={{ width: 260, fontFamily: LAB, fontSize: 52, color: BARN2, letterSpacing: 2 }}>{k}</div><Hand txt={v} u={g} size={66} color={NAVY} /></div>;
  return shell(<Bg k="barn" f={f} dark={0.2} />, <>
    <div style={{ position: "absolute", left: 120, top: 200, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 520, width: 560, height: 60, borderRadius: "50%", background: "rgba(0,0,0,0.35)" }} />
      <BHen k={p.hk} w={640} />
    </div>
    <Card x={830} y={90} w={960} h={880} u={u} rot={1.2} bg={TX.card}>
      <Lab txt={p.name} size={p.name.length > 18 ? 84 : 108} color={NAVY} u={u} />
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 30, opacity: cl(e * 2) }}>
        <Egg w={80} c={p.egg} style={{ transform: `scale(${0.6 + 0.4 * ez(e)})` }} /><Hand txt={p.eggs} u={e} size={70} color={INK} /></div>
      <Row k="LAYS FOR" v={p.years} g={y} />
      <Row k="COLD" v={p.cold} g={on(f, at(p.tY) + 10, 14)} />
      <Row k="NATURE" v={p.temper} g={on(f, at(p.tY) + 20, 14)} />
      <div style={{ position: "absolute", right: 50, bottom: 60, opacity: cl(pr * 2) }}><Stamp txt={p.price} u={pr} size={78} rot={-6} color={OK} /></div>
      {p.note ? <div style={{ position: "absolute", left: 50, bottom: 70 }}><Hand txt={p.note.txt} u={on(f, at(p.note.t), 18)} size={58} color={RED} /></div> : null}
    </Card>
  </>);
};

// 7 · hoja de cuidados para ponedoras de producción (checklist en tabla con clip)
export const CareSheet: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="grey" f={f} dark={0.15} />, <>
    <div style={{ position: "absolute", left: 420, top: 70, width: 1080, height: 960, background: "linear-gradient(170deg, #9B7652, #7C5A3A)", borderRadius: 18, boxShadow: "0 50px 80px rgba(0,0,0,0.55)", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px) rotate(-1deg)` }}>
      <div style={{ position: "absolute", left: 390, top: -30, width: 300, height: 90, borderRadius: 16, background: TX.zinc, boxShadow: "0 10px 16px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 50, top: 80, right: 50, bottom: 40, background: TX.paper, padding: "30px 50px", borderRadius: 4 }}>
        <Hand txt="if you already have production hens" u={on(f, 4, 20)} size={62} color={RED} />
        {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 34, opacity: cl(on(f, at(it.t), 10) * 2) }}>
          <Tick u={on(f, at(it.t) + 4, 12)} size={66} no={it.txt.startsWith("no ")} /><Hand txt={it.txt} u={on(f, at(it.t), 16)} size={64} color={NAVY} />
        </div>)}
      </div>
    </div>
  </>);
};

// 8 · casi: raza con contra (bully / pet) — tarjeta chica sellada
export const Almost: PP<{ name: string; hk: string; pro: B; con: B; verdict: B }> = ({ a, a0, name, hk, pro, con, verdict }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), v = sp(f, at(verdict.t), 12, 180);
  return shell(<Bg k="straw" f={f} dark={0.3} />, <>
    <div style={{ position: "absolute", left: 160, top: 260, opacity: cl(u * 2) }}><BHen k={hk} w={580} /></div>
    <div style={{ position: "absolute", left: 860, top: 160 }}><Lab txt={name} size={130} color={CREAM} u={u} /></div>
    <div style={{ position: "absolute", left: 870, top: 360, display: "flex", gap: 24, alignItems: "center" }}><Tick u={on(f, at(pro.t) + 4, 12)} size={80} color="#9FD39A" /><Hand txt={pro.txt} u={on(f, at(pro.t), 18)} size={72} color={CREAM} /></div>
    <div style={{ position: "absolute", left: 870, top: 500, display: "flex", gap: 24, alignItems: "center" }}><Tick u={on(f, at(con.t) + 4, 12)} size={80} no /><Hand txt={con.txt} u={on(f, at(con.t), 18)} size={72} color="#FFC9C0" /></div>
    <div style={{ position: "absolute", left: 880, top: 680, opacity: cl(v * 2) }}><Stamp txt={verdict.txt} u={v} size={84} rot={-5} color={CREAM} /></div>
  </>);
};

// 9 · frío vs calor: termómetro con dos columnas (cresta chica / cresta grande)
export const ColdHot: PP<{ tCold: number; tHot: number }> = ({ a, a0, tCold, tHot }) => {
  const { f, at } = useK(a, a0);
  const c = sp(f, at(tCold), 13, 130), h = sp(f, at(tHot), 13, 130);
  const Col = ({ x, u, bg, title, hens, sub }: any) => <div style={{ position: "absolute", left: x, top: 170, width: 760, height: 780, borderRadius: 18, background: bg, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px)`, boxShadow: "0 40px 70px rgba(0,0,0,0.45)", padding: 40 }}>
    <Lab txt={title} size={100} color={CREAM} u={u} />
    <div style={{ display: "flex", gap: 10, marginTop: 50 }}>{hens.map((k: string, i: number) => <BHen key={i} k={k} w={220} />)}</div>
    <div style={{ marginTop: 40 }}><Hand txt={sub} u={on(f, (x < 900 ? at(tCold) : at(tHot)) + 10, 18)} size={60} color={CREAM} /></div>
  </div>;
  return shell(<Bg k="grey" f={f} dark={0.2} />, <>
    <Col x={150} u={c} bg="linear-gradient(180deg, #3F6E96, #22405E)" title="COLD WINTERS" hens={["aus", "buff", "rock"]} sub="heavy body · small comb" />
    <Col x={1010} u={h} bg="linear-gradient(180deg, #C86A2E, #8E3A16)" title="HOT SUMMERS" hens={["leg", "ee"]} sub="light body · big comb lets heat out" />
  </>);
};

// 10 · la bandada de 6: las gallinas entran a la fila con su huevo + total
export const FlockOfSix: PP<{ tStart: number; tCost: number }> = ({ a, a0, tStart, tCost }) => {
  const { f, at } = useK(a, a0);
  const K = ["aus", "aus", "rock", "rock", "buff", "ee"], EC = ["#B37E50", "#B37E50", "#A9774B", "#A9774B", "#D4B48C", "#9FC4C9"];
  const c = sp(f, at(tCost), 12, 160);
  return shell(<Bg k="barn" f={f} dark={0.2} />, <>
    <div style={{ position: "absolute", left: 120, top: 80 }}><Lab txt="IF I STARTED OVER TOMORROW" size={110} color={CREAM} u={on(f, 2, 14)} /></div>
    {K.map((k, i) => { const g = sp(f, at(tStart) + i * 7, 13, 140); return <div key={i} style={{ position: "absolute", left: 90 + i * 300, top: 320, opacity: cl(g * 2), transform: `translateY(${(1 - g) * -120}px)` }}>
      <BHen k={k} w={280} flip={i % 2 === 1} /><div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}><Egg w={70} c={EC[i]} /></div></div>; })}
    <div style={{ position: "absolute", left: 120, top: 860, opacity: cl(c * 2) }}><Stamp txt="6 PULLETS ≈ $30" u={c} size={88} rot={-3} color={GOLD} /></div>
    <div style={{ position: "absolute", left: 900, top: 880 }}><Hand txt="≈ 1½ dozen a week in summer" u={on(f, at(tCost) + 14, 18)} size={66} color={STRAW} /></div>
  </>);
};

// 11 · libreta de cuentas: Clover vs Pansy, costo por docena
export const Ledger: PP<{ tC: number; tCv: number; tP: number; tPv: number }> = ({ a, a0, tC, tCv, tP, tPv }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  const Col = ({ x, name, k, rows, big, tb, col }: any) => <div style={{ position: "absolute", left: x, top: 60, width: 640 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}><BHen k={k} w={150} /><Hand txt={name} u={on(f, tb - 6, 16)} size={78} color={NAVY} /></div>
    {rows.map((r: any, i: number) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 20, opacity: cl(on(f, tb + i * 8, 10) * 2) }}>
      <Hand txt={r[0]} u={on(f, tb + i * 8, 14)} size={56} color={PENCIL} /><Hand txt={r[1]} u={on(f, tb + i * 8 + 4, 12)} size={60} color={INK} /></div>)}
    <div style={{ marginTop: 40, fontFamily: HND, fontWeight: 700, fontSize: 120, color: col, opacity: cl(on(f, tb + 40, 10) * 2), transform: `scale(${0.6 + 0.4 * sp(f, tb + 40, 12, 160)})`, transformOrigin: "left" }}>{big}</div>
  </div>;
  return shell(<Bg k="wood" f={f} dark={0.15} />, <>
    <div style={{ position: "absolute", left: 160, top: 110, width: 1600, height: 860, background: TX.card, borderRadius: 8, boxShadow: "0 50px 90px rgba(0,0,0,0.55)", opacity: cl(u * 2), transform: `perspective(1600px) rotateX(${(1 - u) * 20}deg)` }}>
      <div style={{ position: "absolute", left: 800, top: 40, bottom: 40, width: 4, background: "rgba(200,60,60,0.5)" }} />
      <Col x={60} name="Clover" k="red" col={RED} tb={at(tC)} big="$3.00 / doz" rows={[["pullet", "$6.50"], ["eggs, 2 years", "≈ 42 doz"], ["vet visit", "$120"]]} />
      <Col x={880} name="Pansy" k="aus" col={OK} tb={at(tP)} big="3¢ / doz" rows={[["pullet, 2017", "$4.00"], ["eggs, 9 years", "≈ 120 doz"], ["sick days", "0"]]} />
    </div>
  </>);
};

// 12 · podio de las 4 (recap) + la que no
export const FourPodium: PP<{ items: (B & { hk: string })[]; no: B }> = ({ a, a0, items, no }) => {
  const { f, at } = useK(a, a0);
  const n = sp(f, at(no.t), 12, 170);
  return shell(<Bg k="straw" f={f} dark={0.3} />, <>
    {items.map((it, i) => { const g = sp(f, at(it.t), 13, 140); return <div key={i} style={{ position: "absolute", left: 80 + i * 450, top: 180, width: 420, opacity: cl(g * 2), transform: `translateY(${(1 - g) * 100}px)` }}>
      <BHen k={it.hk} w={400} />
      <div style={{ height: 230, marginTop: -10, borderRadius: 10, background: TX.wood, boxShadow: "0 30px 50px rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 20 }}>
        <div style={{ textAlign: "center" }}><div style={{ fontFamily: LAB, fontSize: 90, color: CREAM }}>{i + 1}</div><Lab txt={it.txt} size={it.txt.length > 12 ? 46 : 58} color={CREAM} /></div></div>
    </div>; })}
    <div style={{ position: "absolute", left: 600, top: 60, opacity: cl(n * 2) }}><Stamp txt={no.txt} u={n} size={74} rot={-4} color={RED} /></div>
  </>);
};

// 13 · tarea: cuaderno con la pregunta
export const Homework: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="night" f={f} dark={0} />, <>
    <Card x={360} y={170} w={1200} h={720} u={u} rot={-2} bg={TX.card}>
      <Lab txt="TONIGHT, WITH A FLASHLIGHT" size={96} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 60, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 6, 12)} size={86} /><Hand txt={it.txt} u={on(f, at(it.t), 18)} size={72} color={NAVY} />
      </div>)}
    </Card>
  </>);
};
