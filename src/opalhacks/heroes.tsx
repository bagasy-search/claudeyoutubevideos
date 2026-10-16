// ── HÉROES de opalhacks (Opal's Hen House: "Grandma's Best Chicken Keeping Hacks Nobody Told Me…"). Claude, 16-oct-2026.
//    Juego PROPIO: tarjeta de receta clavada en el granero (capítulos), curva de postura vs años de vida, anillas de colores por año,
//    caja de 8 pollitos que se vuelven gallos, señales del gallo por semana, nota del municipio sellada, sobre con la cuenta en lápiz,
//    malla hexagonal vs malla de 1/2", candado al atardecer, tarjeta pegada en la puerta, gallinas por familia, metros por gallina,
//    lámpara tachada + 3 chequeos, docena para el vecino, recap en cuaderno y tarea.  PURO CSS/SVG.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useK, on, sp, ez, eo, cl, Bg, shell, Lab, Hand, Stamp, Tick, Card, Tape, Arrow, Hen, Egg, RecipeChapter, TX,
  LAB, HND, BARN, BARN2, CREAM, NAVY, INK, PENCIL, OK, RED, GOLD, STRAW, EGG, BLUE, ZINC, PP, B } from "./base";

// 1 · capítulo
export const Chapter: PP<{ n: number; title: string; sub: string; tw: number }> = ({ a, a0, n, title, sub }) => {
  const { f } = useK(a, a0);
  return <RecipeChapter f={f} n={n} kicker={n === 8 ? "and one more…" : "Grandma's hack no."} title={title} sub={sub} />;
};

// 2 · curva: huevos por semana año a año vs años de vida (lays 3, lives 10)
export const LayLife: PP<{ tLay: number; tLive: number; tMabel: number }> = ({ a, a0, tLay, tLive, tMabel }) => {
  const { f, at } = useK(a, a0);
  const E = [5, 5, 3.5, 2, 1, 0.5, 0.2, 0, 0, 0, 0];
  const u = sp(f, 0, 14, 120), l = on(f, at(tLive), 30), m = on(f, at(tMabel), 14);
  return shell(<Bg k="wood" f={f} dark={0.12} />, <>
    <Card x={150} y={110} w={1620} h={860} u={u} rot={-0.8} bg={TX.paper}>
      <Lab txt="EGGS A WEEK, YEAR BY YEAR" size={74} color={NAVY} u={u} />
      <div style={{ position: "absolute", left: 90, top: 200, width: 1440, height: 520, borderLeft: `5px solid ${INK}`, borderBottom: `5px solid ${INK}` }}>
        {E.map((e, i) => {
          const g = on(f, at(tLay) + i * 4, 14);
          return <div key={i} style={{ position: "absolute", left: 40 + i * 128, bottom: 0, width: 82, height: 90 * e * ez(g) + 6, borderRadius: "10px 10px 0 0",
            background: i < 3 ? `linear-gradient(180deg, ${GOLD}, #B07A22)` : "linear-gradient(180deg, #B9AFA0, #8D8476)", boxShadow: "0 8px 14px rgba(0,0,0,0.25)" }}>
            <div style={{ position: "absolute", bottom: -62, width: "100%", textAlign: "center", fontFamily: LAB, fontSize: 44, color: INK }}>{i + 1}</div>
          </div>;
        })}
        <div style={{ position: "absolute", left: 30, top: -10, width: 400, height: 520, borderRadius: 18, border: `6px dashed ${OK}`, opacity: cl(on(f, at(tLay) + 20, 12) * 2) }} />
        <div style={{ position: "absolute", left: 60, top: 10 }}><Hand txt="good layer: 3 years" u={on(f, at(tLay) + 22, 18)} size={60} color={OK} /></div>
        <div style={{ position: "absolute", left: 0, top: 470, height: 16, width: `${100 * ez(l)}%`, background: `linear-gradient(90deg, ${RED}, ${BARN2})`, borderRadius: 8, boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", right: 10, top: 400 }}><Hand txt="she lives 8 – 10 years" u={on(f, at(tLive) + 10, 18)} size={64} color={RED} /></div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 40, opacity: cl(m * 2), transform: `rotate(6deg) scale(${0.7 + 0.3 * m})` }}>
        <div style={{ background: TX.card, padding: "14px 30px", borderRadius: 6, boxShadow: "0 14px 26px rgba(0,0,0,0.35)" }}>
          <Hand txt="Mabel · 11 · retired" u={m} size={56} color={NAVY} />
        </div>
      </div>
    </Card>
  </>);
};

// 3 · anillas por año: tres espirales de colores que se enroscan en la pata
export const LegBands: PP<{ tBand: number; tColors: number; tPrice: number }> = ({ a, a0, tBand, tColors, tPrice }) => {
  const { f, at } = useK(a, a0);
  const C = [["#D3352E", "2024"], ["#2F6FB3", "2025"], ["#3F9A4A", "2026"]];
  const p = sp(f, at(tPrice), 12, 160);
  return shell(<Bg k="straw" f={f} dark={0.2} />, <>
    {C.map(([c, y], i) => {
      const g = sp(f, at(tColors) + i * 9, 13, 140);
      return <div key={i} style={{ position: "absolute", left: 250 + i * 480, top: 200, width: 360, height: 620, opacity: cl(g * 2), transform: `translateY(${(1 - g) * 120}px)` }}>
        <div style={{ position: "absolute", left: 150, top: 0, width: 60, height: 520, borderRadius: 30, background: "linear-gradient(90deg, #C98C2E, #F2C35C 45%, #B97A22)", boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }} />
        {[0, 1, 2, 3, 4].map(k => <div key={k} style={{ position: "absolute", left: 120, top: 180 + k * 34, width: 120, height: 34, borderRadius: "50%", border: `12px solid ${c}`,
          borderTopColor: "transparent", transform: `rotate(${-8 + k * 3}deg) scaleX(${0.6 + 0.4 * on(f, at(tColors) + i * 9 + k * 3, 6)})`, boxShadow: "0 6px 8px rgba(0,0,0,0.3)" }} />)}
        <div style={{ position: "absolute", left: 0, width: 360, top: 540, textAlign: "center" }}><Lab txt={y} size={110} color={CREAM} u={g} /></div>
      </div>;
    })}
    <div style={{ position: "absolute", left: 120, top: 70 }}><Hand txt="one color for every spring" u={on(f, at(tBand), 20)} size={84} color={CREAM} chalk /></div>
    <div style={{ position: "absolute", right: 110, top: 70, opacity: cl(p * 2) }}><Stamp txt="25 BANDS · $3" u={p} color={CREAM} size={70} rot={5} /></div>
  </>);
};

// 4 · caja de 8 pollitos: straight run → la mitad gallos
export const StraightRun: PP<{ tSr: number; tBoys: number; tFive: number }> = ({ a, a0, tSr, tBoys, tFive }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), b = on(f, at(tBoys), 26), v = sp(f, at(tFive), 12, 150);
  const roo = [1, 3, 4, 6];
  return shell(<Bg k="kraft" f={f} dark={0.15} />, <>
    <div style={{ position: "absolute", left: 200, top: 250, width: 1520, height: 640, background: "linear-gradient(180deg, #B98C55, #9C7140)", borderRadius: 10, opacity: cl(u * 2),
      transform: `perspective(1600px) rotateX(${14 + (1 - u) * 20}deg)`, boxShadow: "inset 0 30px 60px rgba(0,0,0,0.45), 0 40px 70px rgba(0,0,0,0.5)" }}>
      {Array.from({ length: 8 }, (_, i) => {
        const r = roo.includes(i), g = r ? on(f, at(tBoys) + roo.indexOf(i) * 6, 14) : 0;
        return <div key={i} style={{ position: "absolute", left: 60 + (i % 4) * 370, top: 40 + Math.floor(i / 4) * 300, transform: `scale(${1 + 0.1 * g})` }}>
          <Hen w={250} body={r ? `rgb(${Math.round(242 - 70 * g)},${Math.round(214 - 120 * g)},${Math.round(110 - 60 * g)})` : "#F2D66E"} wing={r && g > 0.5 ? "#2E4A2E" : "#E5C455"} comb={r ? RED : "#E9A04A"} rooster={r && g > 0.5} flip={i % 2 === 1} />
        </div>;
      })}
    </div>
    <div style={{ position: "absolute", left: 200, top: 70 }}><Lab txt="STRAIGHT RUN" size={130} color={CREAM} u={on(f, at(tSr) - 4, 14)} /></div>
    <div style={{ position: "absolute", left: 870, top: 100 }}><Hand txt="= not sorted. boys and girls." u={on(f, at(tSr) + 6, 20)} size={74} color={STRAW} /></div>
    <div style={{ position: "absolute", right: 120, top: 880, opacity: cl(b * 2) }}><Stamp txt="3 – 4 ROOSTERS IN 8" u={b} size={72} rot={-4} color={CREAM} /></div>
    {v > 0 ? <div style={{ position: "absolute", left: 150, top: 880, opacity: cl(v * 2) }}><Hand txt="once: 5 roosters, 1 hen" u={v} size={70} color={STRAW} /></div> : null}
  </>);
};

// 5 · señales del gallo por semana (línea de tiempo en papel de cuaderno)
export const RoosterWeeks: PP<{ items: (B & { wk: string })[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="barn" f={f} dark={0.15} />, <>
    <Card x={160} y={130} w={1600} h={820} u={u} rot={-1} bg={TX.card}>
      <Hand txt="how to tell a rooster" u={on(f, 4, 20)} size={84} color={RED} />
      <div style={{ position: "absolute", left: 120, top: 260, width: 1360, height: 8, background: PENCIL, borderRadius: 4, transformOrigin: "left", transform: `scaleX(${ez(on(f, 6, 30))})` }} />
      {items.map((it, i) => {
        const g = sp(f, at(it.t), 12, 150);
        return <div key={i} style={{ position: "absolute", left: 90 + i * 470, top: 210, width: 420, opacity: cl(g * 2), transform: `translateY(${(1 - g) * 50}px)` }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: RED, color: CREAM, fontFamily: LAB, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.35)", marginLeft: 0 }}>{it.wk}</div>
          <div style={{ marginTop: 30, fontFamily: HND, fontWeight: 700, fontSize: 58, color: NAVY, lineHeight: 1.1, whiteSpace: "normal" }}>{it.txt}</div>
          <div style={{ marginTop: 20 }}><Hen w={200} rooster={i > 0} body={i === 0 ? "#C77B3A" : "#B4502A"} wing={i > 0 ? "#22402A" : undefined} /></div>
        </div>;
      })}
    </Card>
  </>);
};

// 6 · nota del municipio: sellada
export const TownRules: PP<{ tCall: number; rows: B[]; stamp: B }> = ({ a, a0, tCall, rows, stamp }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), s = sp(f, at(stamp.t), 10, 200);
  return shell(<Bg k="gingham" f={f} dark={0.05} />, <>
    <Card x={460} y={100} w={1000} h={860} u={u} rot={1.5} bg={TX.paper}>
      <Lab txt="TOWN HALL — CALLED" size={78} color={NAVY} u={on(f, at(tCall) - 4, 14)} />
      <div style={{ height: 6, background: NAVY, margin: "16px 0 40px", width: `${100 * ez(on(f, at(tCall), 20))}%` }} />
      {rows.map((r, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 34, opacity: cl(on(f, at(r.t), 10) * 2) }}>
        <Tick u={on(f, at(r.t) + 4, 12)} size={70} color={r.txt.includes("NO") ? RED : OK} no={r.txt.includes("NO ROOSTER")} />
        <Hand txt={r.txt} u={on(f, at(r.t), 18)} size={72} color={PENCIL} />
      </div>)}
      <div style={{ position: "absolute", right: 40, bottom: 60 }}><Stamp txt={stamp.txt} u={s} size={86} rot={-10} /></div>
    </Card>
  </>);
};

// 7 · el sobre: la cuenta en lápiz, renglón por renglón, con total
export const Envelope: PP<{ head: string; rows: (B & { v: string })[]; total?: B & { v: string } }> = ({ a, a0, head, rows, total }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), tt = total ? sp(f, at(total.t), 12, 160) : 0;
  return shell(<Bg k="grey" f={f} dark={0.15} />, <>
    <div style={{ position: "absolute", left: 260, top: 90, width: 1400, height: 900, opacity: cl(u * 2), transform: `perspective(1600px) rotateX(${(1 - u) * 22}deg) rotate(-2deg) translateY(${(1 - u) * 80}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: TX.paper, borderRadius: 8, boxShadow: "0 50px 90px rgba(0,0,0,0.55), 0 10px 20px rgba(0,0,0,0.3)" }} />
      <svg width={1400} height={900} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 0 0 L 700 420 L 1400 0" stroke="rgba(120,90,50,0.35)" strokeWidth={4} fill="none" /><path d="M 0 900 L 560 470 M 1400 900 L 840 470" stroke="rgba(120,90,50,0.25)" strokeWidth={3} fill="none" /></svg>
      <div style={{ position: "absolute", left: 80, top: 50 }}><Hand txt={head} u={on(f, 4, 20)} size={78} color={PENCIL} /></div>
      {rows.map((r, i) => {
        const g = on(f, at(r.t), 16);
        return <div key={i} style={{ position: "absolute", left: 90, right: 90, top: 170 + i * 105, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Hand txt={r.txt} u={g} size={66} color={PENCIL} />
          <Hand txt={r.v} u={on(f, at(r.t) + 8, 12)} size={74} color={NAVY} />
        </div>;
      })}
      {total ? <div style={{ position: "absolute", left: 90, right: 90, top: 190 + rows.length * 105, borderTop: `6px solid ${PENCIL}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: cl(tt * 2) }}>
        <Hand txt={total.txt} u={tt} size={78} color={RED} />
        <div style={{ fontFamily: HND, fontWeight: 700, fontSize: 120, color: RED, transform: `scale(${0.6 + 0.4 * tt})`, border: `6px solid ${RED}`, borderRadius: "50%", padding: "0 34px" }}>{total.v}</div>
      </div> : null}
    </div>
  </>);
};

// 8 · malla de gallinero (hexágonos) vs malla de 1/2" (cuadrícula) con la mano del mapache
const hexes = (w: number, h: number, s: number) => { const out: string[] = []; for (let y = 0; y < h / (s * 0.87) + 1; y++) for (let x = 0; x < w / (s * 1.5) + 1; x++) { const cx = x * s * 1.5, cy = y * s * 1.73 + (x % 2) * s * 0.87; out.push(`M ${cx - s} ${cy} L ${cx - s / 2} ${cy - s * 0.87} L ${cx + s / 2} ${cy - s * 0.87} L ${cx + s} ${cy} L ${cx + s / 2} ${cy + s * 0.87} L ${cx - s / 2} ${cy + s * 0.87} Z`); } return out.join(" "); };
export const WireVs: PP<{ tL: number; tR: number; tPrice: number }> = ({ a, a0, tL, tR, tPrice }) => {
  const { f, at } = useK(a, a0);
  const l = sp(f, at(tL) - 4, 13, 130), r = sp(f, at(tR), 13, 130), p = sp(f, at(tPrice), 12, 170), paw = on(f, at(tL) + 14, 20);
  const Panel = ({ x, u, kind, title, sub, good }: any) => <div style={{ position: "absolute", left: x, top: 190, width: 760, height: 640, opacity: cl(u * 2), transform: `perspective(1400px) rotateY(${(1 - u) * (good ? -30 : 30)}deg)` }}>
    <div style={{ position: "absolute", inset: 0, background: TX.night, borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 70px rgba(0,0,0,0.55)" }}>
      <svg width={760} height={640}>{kind === "hex" ? <path d={hexes(760, 640, 38)} stroke="#C8CED2" strokeWidth={4} fill="none" /> :
        <g stroke="#D7DCDF" strokeWidth={5}>{Array.from({ length: 40 }, (_, i) => <line key={"v" + i} x1={i * 20} y1={0} x2={i * 20} y2={640} />)}{Array.from({ length: 33 }, (_, i) => <line key={"h" + i} x1={0} y1={i * 20} x2={760} y2={i * 20} />)}</g>}</svg>
      {!good ? <div style={{ position: "absolute", left: 380 - 200 + 200 * (1 - eo(paw)), top: 260, width: 210, height: 120, borderRadius: "60% 40% 40% 60%", background: "radial-gradient(ellipse at 30% 40%, #5A5552, #2D2A28)", boxShadow: "0 0 0 4px rgba(0,0,0,0.3)", opacity: cl(paw * 2) }}>
        {[0, 1, 2, 3, 4].map(k => <div key={k} style={{ position: "absolute", right: -26, top: 6 + k * 22, width: 46, height: 16, borderRadius: 8, background: "#3A3533" }} />)}
      </div> : null}
    </div>
    <div style={{ position: "absolute", left: 0, top: -120 }}><Lab txt={title} size={90} color={CREAM} u={u} /></div>
    <div style={{ position: "absolute", left: 0, top: 660 }}><Hand txt={sub} u={on(f, good ? at(tR) + 6 : at(tL) + 6, 18)} size={66} color={good ? "#9FD39A" : "#F29B8F"} /></div>
    <div style={{ position: "absolute", right: 30, top: 30 }}><Tick u={on(f, good ? at(tR) + 12 : at(tL) + 20, 12)} no={!good} size={110} /></div>
  </div>;
  return shell(<Bg k="barn" f={f} dark={0.3} />, <>
    <Panel x={150} u={l} kind="hex" title="CHICKEN WIRE" sub="keeps chickens in. that's all." />
    <Panel x={1010} u={r} kind="sq" title={'1/2" HARDWARE CLOTH'} sub="keeps the raccoon out" good />
    <div style={{ position: "absolute", left: 1290, top: 930, opacity: cl(p * 2) }}><Stamp txt="3 FT × 10 FT · $25" u={p} size={64} rot={-3} color={GOLD} /></div>
  </>);
};

// 9 · atardecer: el sol baja, la puerta se cierra, llave en el clavo con el repasador
export const DuskLock: PP<{ tLock: number; tKey: number; tAuto: number }> = ({ a, a0, tLock, tKey, tAuto }) => {
  const { f, at } = useK(a, a0);
  const s = on(f, 0, 90), door = on(f, at(tLock) + 6, 16), k = sp(f, at(tKey), 13, 130), au = sp(f, at(tAuto), 12, 160);
  return shell(<Bg k="dusk" f={f} dark={0.05} />, <>
    <div style={{ position: "absolute", left: 1380, top: 260 + 360 * ez(s), width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, #FFE3A0, #F2994A 70%, rgba(242,153,74,0) 72%)", filter: "none" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "linear-gradient(180deg, #2B2A33, #15141B)" }} />
    <div style={{ position: "absolute", left: 300, top: 300, width: 760, height: 560, background: TX.barn, borderRadius: 6, boxShadow: "0 40px 70px rgba(0,0,0,0.6)" }}>
      <div style={{ position: "absolute", left: -30, top: -120, width: 820, height: 140, background: "linear-gradient(180deg, #4A4040, #2E2828)", clipPath: "polygon(5% 100%, 50% 0, 95% 100%)" }} />
      <div style={{ position: "absolute", left: 290, top: 300, width: 180, height: 260, background: "#140C0A" }} />
      <div style={{ position: "absolute", left: 290, top: 300, width: 180, height: 260, background: TX.wood, transformOrigin: "left center", transform: `perspective(800px) rotateY(${-75 * (1 - ez(door))}deg)`, boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.4)" }}>
        <div style={{ position: "absolute", right: 14, top: 120, width: 60, height: 16, background: ZINC, borderRadius: 4, transform: `translateX(${-30 * (1 - on(f, at(tLock) + 20, 8))}px)` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 120 }}><Lab txt="EVERY SINGLE NIGHT" size={120} color={CREAM} u={on(f, at(tLock), 14)} /></div>
    <div style={{ position: "absolute", left: 1200, top: 560, width: 460, opacity: cl(k * 2), transform: `rotate(${4 * Math.sin(f / 9) * (1 - on(f, at(tKey) + 30, 30))}deg)`, transformOrigin: "60px 0" }}>
      <div style={{ position: "absolute", left: 50, top: -10, width: 22, height: 22, borderRadius: "50%", background: "#555" }} />
      <div style={{ position: "absolute", left: 90, top: 0, width: 200, height: 320, background: "repeating-linear-gradient(90deg, #F1EBDD 0 30px, #3E64A0 30px 46px)", borderRadius: 4, boxShadow: "0 20px 30px rgba(0,0,0,0.45)" }} />
      <svg width={140} height={240} style={{ position: "absolute", left: 10, top: 6 }}><circle cx={52} cy={40} r={30} fill="none" stroke="#C7A04A" strokeWidth={12} /><path d="M 52 70 L 52 200 M 52 160 L 82 160 M 52 190 L 76 190" stroke="#C7A04A" strokeWidth={12} strokeLinecap="round" /></svg>
    </div>
    <div style={{ position: "absolute", left: 1150, top: 930, opacity: cl(au * 2) }}><Hand txt="automatic door: $90 – $150" u={au} size={64} color={CREAM} /></div>
  </>);
};

// 10 · tarjeta pegada en la puerta del gallinero (lista para el vecino)
export const DoorCard: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="wood" f={f} dark={0.25} />, <>
    <div style={{ position: "absolute", left: 520, top: 120, width: 880, height: 820, background: TX.card, borderRadius: 6, opacity: cl(u * 2),
      transform: `perspective(1400px) rotateX(${(1 - u) * 26}deg) rotate(2deg)`, boxShadow: "0 40px 70px rgba(0,0,0,0.55)", padding: "30px 60px" }}>
      <Tape x={-30} y={-14} rot={-24} /><Tape x={760} y={-10} rot={18} />
      <Hand txt="Chicken chores — thank you!" u={on(f, 4, 20)} size={70} color={RED} />
      <div style={{ marginTop: 50 }}>{items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, height: 120, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <div style={{ width: 70, height: 70, border: `5px solid ${PENCIL}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick u={on(f, at(it.t) + 6, 12)} size={60} /></div>
        <Hand txt={it.txt} u={on(f, at(it.t), 16)} size={80} color={NAVY} />
      </div>)}</div>
    </div>
  </>);
};

// 11 · cuántas gallinas: personas → gallinas (fila de gallinas que entra) + costo por gallina
export const HowMany: PP<{ rows: (B & { hens: number })[]; tFeed: number }> = ({ a, a0, rows, tFeed }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), fe = sp(f, at(tFeed), 12, 160);
  return shell(<Bg k="gingham" f={f} dark={0.05} />, <>
    <Card x={140} y={110} w={1640} h={860} u={u} rot={-0.5} bg={TX.paper}>
      <Lab txt="HOW MANY HENS?" size={96} color={NAVY} u={u} />
      {rows.map((r, i) => {
        const g = on(f, at(r.t), 14);
        return <div key={i} style={{ position: "absolute", left: 40, top: 190 + i * 250, display: "flex", alignItems: "center", gap: 30, opacity: cl(g * 2) }}>
          <div style={{ width: 400 }}><Hand txt={r.txt} u={g} size={72} color={PENCIL} /></div>
          {Array.from({ length: r.hens }, (_, k) => <div key={k} style={{ transform: `translateY(${(1 - on(f, at(r.t) + 8 + k * 4, 8)) * -60}px)`, opacity: cl(on(f, at(r.t) + 8 + k * 4, 8) * 2) }}>
            <Hen w={150} body={["#9C4B23", "#1C1C22", "#D9A84E", "#7A7A7A", "#9C4B23", "#D9A84E"][k % 6]} wing={k % 3 === 1 ? "#2E3A2E" : undefined} /></div>)}
          <div style={{ fontFamily: LAB, fontSize: 120, color: RED, marginLeft: 20, opacity: cl(on(f, at(r.t) + 30, 10) * 2) }}>{r.hens}</div>
        </div>;
      })}
      <div style={{ position: "absolute", right: 60, bottom: 50, opacity: cl(fe * 2) }}><Stamp txt="≈ $50 / HEN / YEAR" u={fe} size={70} rot={-5} color={BARN2} /></div>
    </Card>
  </>);
};

// 12 · espacio: 4 sq ft adentro / 10 sq ft en el corral (cuadrícula de baldosas con una gallina adentro)
export const SpaceFeet: PP<{ tIn: number; tRun: number }> = ({ a, a0, tIn, tRun }) => {
  const { f, at } = useK(a, a0);
  const i = sp(f, at(tIn), 13, 130), r = sp(f, at(tRun), 13, 130);
  const Box = ({ x, n, u, label, col }: any) => <div style={{ position: "absolute", left: x, top: 260, opacity: cl(u * 2), transform: `perspective(1400px) rotateX(${38 + (1 - u) * 20}deg)` }}>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${n === 4 ? 2 : 5}, 150px)`, gap: 6, background: col, padding: 6, borderRadius: 8, boxShadow: "0 40px 60px rgba(0,0,0,0.5)" }}>
      {Array.from({ length: n }, (_, k) => <div key={k} style={{ width: 150, height: 150, background: TX.straw, opacity: on(f, at(n === 4 ? tIn : tRun) + k * 2, 6) }} />)}
    </div>
    <div style={{ position: "absolute", left: n === 4 ? 70 : 280, top: 40 }}><Hen w={200} /></div>
    <div style={{ marginTop: 60 }}><Lab txt={label} size={96} color={CREAM} u={u} /></div>
  </div>;
  return shell(<Bg k="barn" f={f} dark={0.25} />, <>
    <Box x={260} n={4} u={i} label="4 SQ FT INSIDE" col="#5B3A22" />
    <Box x={900} n={10} u={r} label="10 SQ FT IN THE RUN" col="#3F5A35" />
    <div style={{ position: "absolute", left: 260, top: 80 }}><Hand txt="for every hen" u={on(f, at(tIn) + 4, 18)} size={86} color={STRAW} /></div>
  </>);
};

// 13 · seco, no caliente: lámpara tachada + 3 chequeos
export const DryNotWarm: PP<{ tLamp: number; items: B[] }> = ({ a, a0, tLamp, items }) => {
  const { f, at } = useK(a, a0);
  const l = sp(f, at(tLamp) - 4, 13, 130), x = on(f, at(tLamp) + 16, 14);
  return shell(<Bg k="chalk" f={f} dark={0.05} />, <>
    <div style={{ position: "absolute", left: 160, top: 180, width: 560, height: 700, opacity: cl(l * 2), transform: `translateY(${(1 - l) * 80}px)` }}>
      <div style={{ position: "absolute", left: 270, top: 0, width: 6, height: 200, background: "#222" }} />
      <div style={{ position: "absolute", left: 120, top: 190, width: 310, height: 200, borderRadius: "0 0 160px 160px", background: "linear-gradient(180deg, #C9CED2, #8E959A)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 175, top: 300, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #FF5A3C, #B3201A 60%, rgba(179,32,26,0) 70%)" }} />
      <svg width={560} height={600} style={{ position: "absolute", left: 0, top: 120 }}><path d="M 40 40 L 520 520 M 520 40 L 40 520" stroke={RED} strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(x)} /></svg>
      <div style={{ position: "absolute", left: 40, top: 620 }}><Hand txt="never in my coop" u={on(f, at(tLamp) + 24, 18)} size={70} color="#F29B8F" chalk /></div>
    </div>
    <div style={{ position: "absolute", left: 820, top: 150 }}><Hand txt="dry, not warm" u={on(f, 4, 20)} size={120} color="#F6F1E4" chalk /></div>
    {items.map((it, i) => <div key={i} style={{ position: "absolute", left: 830, top: 380 + i * 170, display: "flex", alignItems: "center", gap: 30, opacity: cl(on(f, at(it.t), 10) * 2) }}>
      <Tick u={on(f, at(it.t) + 4, 12)} size={90} color="#9FD39A" />
      <Hand txt={it.txt} u={on(f, at(it.t), 18)} size={76} color="#F6F1E4" chalk />
    </div>)}
  </>);
};

// 14 · capa profunda: corte del piso del gallinero que crece hasta 6"
export const DeepLitter: PP<{ tStir: number; tSix: number }> = ({ a, a0, tStir, tSix }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), g = on(f, at(tStir), 60), six = sp(f, at(tSix), 12, 150);
  const layers = ["#C9A25A", "#B98F48", "#A57A3A", "#8C6630", "#6E5028", "#59401F"];
  return shell(<Bg k="grey" f={f} dark={0.2} />, <>
    <div style={{ position: "absolute", left: 300, top: 160, width: 1320, height: 760, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "linear-gradient(180deg, #6E6A63, #4A4742)", borderRadius: 4 }} />
      {layers.map((c, i) => { const h = 70 * ez(cl(g * 6 - i)); return <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 80 + layers.slice(0, i).reduce((s, _, k) => s + 70 * ez(cl(g * 6 - k)), 0), height: h,
        background: `repeating-linear-gradient(${17 + i * 9}deg, rgba(255,240,180,0.25) 0 2px, transparent 2px 9px), ${layers[layers.length - 1 - i]}`, boxShadow: "inset 0 4px 0 rgba(255,255,255,0.12)" }} />; })}
      <div style={{ position: "absolute", right: -90, bottom: 80, width: 14, height: 420 * ez(six), background: RED, borderRadius: 7 }} />
      <div style={{ position: "absolute", right: -330, bottom: 80 + 380 * ez(six) }}><Lab txt={'6" BY JANUARY'} size={70} color={CREAM} u={six} /></div>
      <div style={{ position: "absolute", left: 0, top: 0 }}><Lab txt="THE DEEP LITTER" size={120} color={CREAM} u={u} /></div>
      <div style={{ position: "absolute", left: 10, top: 130 }}><Hand txt="stir it · add a layer · never scrape to the floor" u={on(f, at(tStir), 24)} size={62} color={STRAW} /></div>
    </div>
  </>);
};

// 15 · la docena para el vecino: cartón que se cierra con nota atada
export const NeighborDozen: PP<{ tDozen: number; tNever: number }> = ({ a, a0, tDozen, tNever }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, at(tDozen) - 4, 13, 130), n = sp(f, at(tNever), 12, 170);
  const cols = ["#C98F5C", "#E9D3B4", "#B8D3D6", "#C98F5C", "#A87449", "#E3C9A3"];
  return shell(<Bg k="gingham" f={f} dark={0.08} />, <>
    <div style={{ position: "absolute", left: 360, top: 330, width: 1200, height: 400, background: "linear-gradient(180deg, #CFC6B6, #B1A795)", borderRadius: 20, opacity: cl(u * 2),
      transform: `perspective(1400px) rotateX(${40 + (1 - u) * 20}deg)`, boxShadow: "0 50px 70px rgba(0,0,0,0.45)", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", padding: 26, gap: 14 }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "radial-gradient(circle, #A99E8B, #C9C0AF)" }}>
        <Egg w={110 * ez(on(f, at(tDozen) + i * 2, 8))} c={cols[i % 6]} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 360, top: 110 }}><Lab txt="THE FIRST DOZEN GOES NEXT DOOR" size={100} color={NAVY} u={u} /></div>
    <div style={{ position: "absolute", left: 1220, top: 680, opacity: cl(on(f, at(tDozen) + 26, 12) * 2), transform: "rotate(-6deg)" }}>
      <div style={{ background: TX.card, padding: "20px 34px", borderRadius: 6, boxShadow: "0 16px 26px rgba(0,0,0,0.35)" }}><Hand txt="from the girls next door ♥" u={on(f, at(tDozen) + 28, 18)} size={54} color={RED} /></div>
    </div>
    <div style={{ position: "absolute", left: 380, top: 820, opacity: cl(n * 2) }}><Stamp txt="50 YEARS · 0 COMPLAINTS" u={n} size={74} rot={-3} color={OK} /></div>
  </>);
};

// 16 · repaso: cuaderno de tapa negra con las 7
export const RecapBook: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="wood" f={f} dark={0.2} />, <>
    <div style={{ position: "absolute", left: 230, top: 60, width: 1460, height: 960, background: TX.card, borderRadius: 10, opacity: cl(u * 2),
      transform: `perspective(1600px) rotateX(${(1 - u) * 20}deg) rotate(-1deg)`, boxShadow: "0 50px 90px rgba(0,0,0,0.6)", padding: "34px 70px" }}>
      <div style={{ position: "absolute", left: -40, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg, #1C1C1C, #3A3A3A)", borderRadius: "10px 0 0 10px" }} />
      <Hand txt="Grandma's 7 — write these down" u={on(f, 4, 20)} size={74} color={RED} />
      <div style={{ marginTop: 30 }}>{items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, height: 112, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <div style={{ width: 70, fontFamily: LAB, fontSize: 80, color: BARN2 }}>{i + 1}</div>
        <Hand txt={it.txt} u={on(f, at(it.t), 16)} size={62} color={NAVY} />
      </div>)}</div>
    </div>
  </>);
};

// 17 · tarea: un solo renglón en la tarjeta + teléfono
export const Homework: PP<{ items: B[] }> = ({ a, a0, items }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="barn" f={f} dark={0.15} />, <>
    <Card x={360} y={170} w={1200} h={720} u={u} rot={-2} bg={TX.card}>
      <Lab txt="YOUR HOMEWORK" size={110} color={RED} u={u} />
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 70, opacity: cl(on(f, at(it.t), 10) * 2) }}>
        <Tick u={on(f, at(it.t) + 6, 12)} size={90} />
        <Hand txt={it.txt} u={on(f, at(it.t), 18)} size={76} color={NAVY} />
      </div>)}
    </Card>
  </>);
};
