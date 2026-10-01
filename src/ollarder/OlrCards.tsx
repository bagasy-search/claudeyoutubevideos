// OlrCards — componentes 2D de ollarder (despensa del campamento). Todo "dentro del mundo": tablas de pino, papel kraft,
// tarjetas colgadas de un clavo, calendarios de madera. Tiempos en segundos desde el inicio de la toma (`at` viene del
// anclaje al ms: "@frase" → segundos). Nada de Math.random ni useFrame.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { OLE, LABEL, SERIF, HAND, SANS, hexA, rnd } from "./OleTheme";
import { Wood, Paper, Kicker, Pencil, Seal, ramp, useT, useIO, eo, eio, cl } from "./OlrKit";
import { IcoPotato, IcoOnion, IcoCarrot, IcoApple, IcoCabbage, IcoJar, IcoBarrel, IcoSack, IcoBeef, IcoFlour, IcoBean, IcoThermo, IcoSnow, IcoFlame, IcoDrop, IcoCheck, IcoCross, IcoPine, IcoCabin, IcoSled, IcoLantern } from "./OlrIcons";

export const ev = (at: any, k: string, d: number) => (at && typeof at[k] === "number" ? at[k] : d);
const pop = (t: number, t0: number, d = 0.45) => ramp(t, t0, t0 + d, Easing.out(Easing.back(1.7)));
const inkC = "#2A2118";

/** tarjeta de papel con título (cabecera de la mayoría de los componentes) */
const Head: React.FC<{ kicker: string; title: string; p?: number; x?: number; y?: number; w?: number; align?: "left" | "center"; kc?: string; tc?: string }> = ({ kicker, title, p = 1, x = 96, y = 74, w = 1500, align = "left", kc = "#FFF3D6", tc = "#FBF6EA" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, textAlign: align }}>
    <Kicker color={kc}>{kicker}</Kicker>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: tc, lineHeight: 1.02, marginTop: 10, textShadow: "0 3px 10px rgba(40,22,8,0.55)" }}>{title}</div>
  </div>
);

// ───────────────────────── P1 · LA PREGUNTA ─────────────────────────
export const OlrQuestion: React.FC<{ at?: any }> = () => {
  const { t, dur } = useT(); const io = useIO(0.3, 0.3);
  const words = ["HOW COLD", "DOES", "THIS FOOD", "WANT TO BE?"];
  const swing = Math.sin(t * 2.1) * 0.08;
  const lvl = 0.5 + 0.35 * Math.sin(t * 1.3) ;
  const sway = Math.sin(t * 1.6) * 1.4;
  return (
    <Wood tone="#9C6B3C" dim={0.06}>
      <AbsoluteFill style={{ opacity: io }}>
        {/* clavo + cuerda + tarjeta kraft */}
        <div style={{ position: "absolute", left: 960, top: 40, width: 16, height: 16, borderRadius: 8, background: "#3A3733", boxShadow: "0 3px 6px rgba(0,0,0,.5)", transform: "translateX(-8px)" }} />
        <div style={{ position: "absolute", left: 960, top: 0, transformOrigin: "50% 48px", transform: `rotate(${sway + swing}deg)` }}>
          <svg width="1000" height="140" viewBox="0 0 1000 140" style={{ position: "absolute", left: -500, top: 0 }}><path d="M 500 48 L 190 220 M 500 48 L 810 220" stroke="#6B5A3A" strokeWidth="5" fill="none" /></svg>
          <Paper w={1100} h={640} x={0} y={0} rot={0} pad={50} bg={OLE.kraftL} style={{ top: 410, left: -550, transform: "none", position: "absolute", border: `3px solid ${hexA("#7A5A33", 0.5)}` }}>
            <Kicker size={30}>ONE QUESTION RAN THE WHOLE PANTRY</Kicker>
            <div style={{ marginTop: 26, fontFamily: HAND, fontWeight: 700, color: OLE.pencil, lineHeight: 1.08 }}>
              {words.map((w, i) => { const p = pop(t, 0.5 + i * 0.7); return <div key={i} style={{ fontSize: i === 3 ? 112 : 124, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, color: i === 2 ? OLE.plaid : OLE.pencil }}>{w}</div>; })}
            </div>
          </Paper>
        </div>
        {/* termómetro oscilando + 3 alimentos */}
        <div style={{ position: "absolute", left: 1450, top: 330, opacity: ramp(t, 0.3, 0.9) }}>
          <IcoThermo size={400} level={0.15 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.4))} color={lvl > 0.5 ? "#D24A3A" : "#4B93C9"} />
        </div>
        {[<IcoPotato key="p" size={150} />, <IcoJar key="j" size={150} />, <IcoBeef key="b" size={150} />].map((el, i) => (
          <div key={i} style={{ position: "absolute", left: 1330 + i * 160, top: 790 + Math.sin(t * 2 + i) * 6, opacity: pop(t, 1.2 + i * 0.35), transform: `rotate(${(i - 1) * 6}deg)` }}>{el}</div>
        ))}
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P2 · LA RUTA DE LOS TRINEOS ─────────────────────────
export const OlrCampRoute: React.FC<{ at?: any }> = () => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  // ruta: depósito (izq) → campamento (der) por un camino de acarreo sobre suelo helado
  const pts: [number, number][] = [[210, 800], [420, 720], [610, 790], [840, 660], [1060, 700], [1260, 560], [1480, 600], [1660, 470]];
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  const at = (u: number) => { let d = Math.max(0, Math.min(1, u)) * total; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const k = d / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } d -= seg[i]; } return pts[pts.length - 1]; };
  const path = "M " + pts.map((p) => p.join(" ")).join(" L ");
  const trees = Array.from({ length: 46 }, (_, i) => ({ x: 80 + rnd(i * 3 + 1) * 1760, y: 160 + rnd(i * 3 + 2) * 800, s: 52 + rnd(i * 3 + 3) * 58 }));
  const prog = ramp(t, 0.8, Math.max(4.5, dur * 0.62), Easing.inOut(Easing.cubic));
  const sleds = [0, 0.16, 0.32].map((o) => Math.max(0, prog - o) / (1 - 0.32));
  const barrels = Math.round(interpolate(prog, [0.55, 1], [0, 6], cl));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#EEF3F6,#DCE6EC)", opacity: io }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,.9), transparent 60%), repeating-linear-gradient(120deg, rgba(150,175,195,.10) 0 2px, transparent 2px 22px)" }} />
      {trees.map((tr, i) => (<div key={i} style={{ position: "absolute", left: tr.x, top: tr.y, opacity: 0.9 }}><IcoPine size={tr.s} /></div>))}
      <Head kicker="BEFORE THE FIRST TREE FELL" title="Frozen ground = a road for sleds" p={ramp(t, 0.1, 0.7)} kc={OLE.fire} tc={OLE.forest} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d={path} stroke="#B9C7D1" strokeWidth="40" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d={path} stroke="#7A5A33" strokeWidth="6" fill="none" strokeDasharray="4 20" strokeLinecap="round" pathLength={1} />
      </svg>
      {/* depósito */}
      <div style={{ position: "absolute", left: 130, top: 690, opacity: ramp(t, 0.2, 0.8) }}><IcoCabin size={150} /><div style={{ fontFamily: LABEL, fontWeight: 600, letterSpacing: 5, fontSize: 24, color: OLE.forest, marginTop: 4 }}>THE DEPOT</div></div>
      {/* campamento */}
      <div style={{ position: "absolute", left: 1620, top: 330, opacity: ramp(t, 0.2, 0.8) }}><IcoCabin size={200} /><div style={{ fontFamily: LABEL, fontWeight: 600, letterSpacing: 5, fontSize: 28, color: OLE.plaid, marginTop: 2 }}>THE CAMP</div></div>
      {sleds.map((u, i) => { if (u <= 0 || u >= 1.02) return u >= 1.02 ? null : null; const [x, y] = at(u); return (<div key={i} style={{ position: "absolute", left: x - 55, top: y - 70, transform: `translateY(${Math.sin(t * 6 + i) * 2}px)` }}><IcoSled size={110} /></div>); })}
      {/* tarjetas de carga */}
      <div style={{ position: "absolute", left: 96, top: 360, display: "flex", gap: 26, opacity: ramp(t, 1.2, 1.8) }}>
        {[["FOOD", <IcoSack key="a" size={90} />], ["FODDER", <IcoBean key="b" size={90} />], ["TOOLS", <IcoBarrel key="c" size={90} />]].map(([l, ic], i) => (
          <div key={i} style={{ background: OLE.paper, padding: "16px 24px 12px", borderRadius: 4, boxShadow: `0 14px 28px ${OLE.shadow}`, textAlign: "center", transform: `rotate(${(i - 1) * 3}deg) translateY(${(1 - pop(t, 1.3 + i * 0.3)) * 30}px)`, opacity: pop(t, 1.3 + i * 0.3) }}>{ic as any}<div style={{ fontFamily: LABEL, fontWeight: 700, letterSpacing: 4, fontSize: 24, color: OLE.forest }}>{l as string}</div></div>
        ))}
      </div>
      {/* barriles que se acumulan en el campamento */}
      <div style={{ position: "absolute", left: 1500, top: 560, display: "flex", flexWrap: "wrap", width: 330, gap: 4 }}>{Array.from({ length: barrels }).map((_, i) => <div key={i} style={{ transform: `scale(${pop(t, 0, 0.001) || 1})` }}><IcoBarrel size={76} /></div>)}</div>
      <div style={{ position: "absolute", right: 90, bottom: 80, transform: `rotate(-6deg) scale(${1.6 - 0.6 * pop(t, dur - 3.4, 0.35)})`, opacity: pop(t, dur - 3.4, 0.35) }}>
        <div style={{ border: `8px solid ${OLE.plaid}`, color: OLE.plaid, padding: "6px 26px", fontFamily: LABEL, fontWeight: 700, fontSize: 70, letterSpacing: 8, background: hexA(OLE.cream, 0.7) }}>KEEP-OVERS</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OLE.pencil, textAlign: "center", marginTop: 6 }}>stored right there, before the work began</div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── P10 / P21 · EL ORDEN EN EL INVIERNO ─────────────────────────
type Row = { label: string; sub: string; from: number; to: number; color: string; icons: React.ReactNode; at: number; mark?: string };
export const OlrWinterOrder: React.FC<{ mode?: "meat" | "veg"; at?: any }> = ({ mode = "veg", at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const months = ["NOV", "DEC", "JAN", "FEB", "MAR", "APR"];
  const rows: Row[] = mode === "meat" ? [
    { label: "FRESH BEEF", sub: "needs the cold · cut it while it's frozen", from: 0.4, to: 3.2, color: "#4B93C9", icons: <IcoBeef size={86} frost={1} />, at: ev(at, "a", 0.8) },
    { label: "SALT PORK", sub: "needs no cold at all · the long game", from: 2.6, to: 6, color: "#B5453A", icons: <IcoBarrel size={86} />, at: ev(at, "b", 5) },
  ] : [
    { label: "APPLES · CABBAGE", sub: "most delicate: eat first", from: 0.3, to: 2.1, color: "#C73B30", icons: <span style={{ display: "flex" }}><IcoApple size={74} /><IcoCabbage size={74} /></span>, at: ev(at, "a", 0.6) },
    { label: "CARROTS · POTATOES", sub: "the middle of the winter", from: 1.3, to: 4.6, color: "#B98C5A", icons: <span style={{ display: "flex" }}><IcoCarrot size={74} /><IcoPotato size={74} /></span>, at: ev(at, "b", 3.2) },
    { label: "ONIONS", sub: "cured, cold and dry: they just wait", from: 2.7, to: 5.6, color: "#E1B552", icons: <IcoOnion size={80} />, at: ev(at, "c", 6) },
  ];
  const span = (m: number) => 330 + (m / 6) * 1340; // x en px para el mes m (0..6)
  return (
    <Wood tone="#A87A47" dim={0.02}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker={mode === "meat" ? "THE MEAT PLAN" : "EAT IN THIS ORDER"} title={mode === "meat" ? "Use the cold while you have it" : "The soft stuff goes first"} p={ramp(t, 0.1, 0.6)} />
        <div style={{ position: "absolute", left: 120, top: 300, width: 1700, height: 620, background: OLE.paper, borderRadius: 4, boxShadow: `0 26px 50px ${OLE.shadow}`, padding: 0, overflow: "hidden" }}>
          <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 58px, ${hexA("#7A93A8", 0.25)} 58px 60px)` }} />
          {months.map((m, i) => (<div key={m} style={{ position: "absolute", left: span(i) - 120, top: 14, width: 220, textAlign: "center", fontFamily: LABEL, fontWeight: 700, letterSpacing: 6, fontSize: 28, color: OLE.mute, opacity: ramp(t, 0.2 + i * 0.1, 0.6 + i * 0.1) }}>{m}</div>))}
          {months.map((m, i) => (<div key={m + "l"} style={{ position: "absolute", left: span(i) - 120, top: 56, width: 2, height: 540, background: hexA(OLE.mute, 0.25) }} />))}
          {rows.map((r, i) => {
            const y = 110 + i * (mode === "meat" ? 220 : 170);
            const p = ramp(t, r.at, r.at + 0.9, eo);
            const x0 = span(r.from) - 120, x1 = span(r.to) - 120;
            return (
              <div key={i} style={{ position: "absolute", left: 40, top: y }}>
                <div style={{ position: "absolute", left: x0, top: 34, height: 74, width: (x1 - x0) * p, background: r.color, borderRadius: 40, boxShadow: "0 8px 14px rgba(0,0,0,.25)", opacity: 0.95 }} />
                <div style={{ position: "absolute", left: x0 - 20, top: 18, opacity: p }}>{r.icons}</div>
                <div style={{ position: "absolute", left: x0 + (r.label.includes("·") ? 190 : 110), top: 22, whiteSpace: "nowrap", opacity: p }}>
                  <div style={{ fontFamily: LABEL, fontWeight: 700, letterSpacing: 4, fontSize: 32, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,.45)" }}>{r.label}</div>
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 30, color: OLE.pencil, marginTop: 34 }}>{r.sub}</div>
                </div>
              </div>
            );
          })}
          {mode === "veg" ? (<div style={{ position: "absolute", left: span(4.3) - 120, top: 380, opacity: pop(t, ev(at, "d", 8)), transform: `rotate(-4deg)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: hexA("#F0B267", 0.55), padding: "12px 22px", borderRadius: 6, border: `3px solid ${OLE.fire}` }}><IcoPotato size={78} sprout={1} green={1} /><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: OLE.plaid }}>spring: potatoes wake up<br />green or sprouting → discard</div></div>
          </div>) : (<div style={{ position: "absolute", left: 330, top: 420, opacity: pop(t, ev(at, "c", 8)) }}><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: OLE.forest, transform: "rotate(-3deg)" }}>eat what needs the cold<br />while you have the cold →<br />save what doesn't for later</div></div>)}
        </div>
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P13 · LOS NÚMEROS DEL LIBRO ─────────────────────────
export const OlrRangeBoard: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const lo = 28, hi = 48; const X = (f: number) => 420 + ((f - lo) / (hi - lo)) * 1010;
  const items = [
    { k: "p", name: "POTATOES", a: 38, b: 45, hum: "85–90% · damp", c: "#B98C5A", ico: <IcoPotato size={100} />, at: ev(at, "p", 2.0) },
    { k: "o", name: "ONIONS", a: 32, b: 40, hum: "65–70% · DRY", c: "#E1B552", ico: <IcoOnion size={100} />, at: ev(at, "o", 6.6) },
    { k: "c", name: "CARROTS", a: 32, b: 40, hum: "very humid · sand", c: "#E4772B", ico: <IcoCarrot size={100} />, at: ev(at, "c", 9.8) },
    { k: "a", name: "APPLES", a: 30, b: 40, hum: "85–90% · in paper", c: "#C73B30", ico: <IcoApple size={100} />, at: ev(at, "a", 12.6) },
    { k: "k", name: "CABBAGE", a: 32, b: 40, hum: "90% · whole heads", c: "#7FB05A", ico: <IcoCabbage size={100} />, at: ev(at, "k", 14.4) },
  ];
  const ice = ramp(t, 0.5, 1.4);
  return (
    <Wood tone="#9C6B3C" dim={0.04}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="FROM THE BOOK · THE ROOT-CELLAR SHELF" title="Every food has its own number" p={ramp(t, 0.1, 0.7)} w={1500} />
        <div style={{ position: "absolute", left: 90, top: 260, width: 1740, height: 760, background: OLE.paper, borderRadius: 4, boxShadow: `0 26px 50px ${OLE.shadow}` }}>
          {/* banda de congelación (<32°F) */}
          <div style={{ position: "absolute", left: X(lo) - 90, top: 0, width: X(32) - X(lo), height: 760, background: "linear-gradient(90deg, rgba(120,175,215,.35), rgba(120,175,215,.12))", opacity: ice }} />
          <div style={{ position: "absolute", left: X(lo) - 80, top: 14, display: "flex", alignItems: "center", gap: 8, opacity: ice }}><IcoSnow size={46} /><span style={{ fontFamily: LABEL, fontWeight: 700, letterSpacing: 4, fontSize: 24, color: "#2F6E9A" }}>FREEZING</span></div>
          {[28, 32, 36, 40, 44, 48].map((f) => (<div key={f} style={{ position: "absolute", left: X(f) - 90, top: 70, width: 2, height: 670, background: hexA(OLE.mute, f === 32 ? 0.7 : 0.2) }}><div style={{ position: "absolute", top: -44, left: -30, width: 60, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 28, color: f === 32 ? "#2F6E9A" : OLE.mute }}>{f}°</div></div>))}
          {items.map((it, i) => {
            const p = ramp(t, it.at, it.at + 0.9, eo); const y = 110 + i * 126;
            return (
              <div key={it.k} style={{ position: "absolute", left: 0, top: y, width: 1740, height: 110 }}>
                <div style={{ position: "absolute", left: 18, top: -4, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>{it.ico}</div>
                <div style={{ position: "absolute", left: 130, top: 6, fontFamily: LABEL, fontWeight: 700, letterSpacing: 4, fontSize: 30, color: OLE.forest, opacity: p, width: 190 }}>{it.name}</div>
                <div style={{ position: "absolute", left: X(it.a) - 90, top: 22, height: 62, width: (X(it.b) - X(it.a)) * p, background: it.c, borderRadius: 34, boxShadow: "0 6px 12px rgba(0,0,0,.28)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 32, color: "#fff", letterSpacing: 3, textShadow: "0 2px 3px rgba(0,0,0,.5)", whiteSpace: "nowrap", opacity: p > 0.9 ? 1 : 0 }}>{it.a}–{it.b}°F</span>
                </div>
                <div style={{ position: "absolute", left: X(it.b) - 70, top: 28, fontFamily: HAND, fontWeight: 700, fontSize: 32, color: OLE.pencil, opacity: ramp(t, it.at + 0.7, it.at + 1.2), display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}><IcoDrop size={34} /> {it.hum}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P19 · EL TERMÓMETRO ─────────────────────────
export const OlrThermo: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const a1 = ev(at, "spring", 1.2), a2 = ev(at, "dec", 5.6);
  // aguja: sube/baja entre zona sana (38-45) y zona mala
  const needle = t < a2 ? interpolate(t, [0.4, a1], [30, 41], cl) : interpolate(t, [a2, a2 + 1.4], [41, 52], { ...cl, easing: eo });
  const ang = -120 + ((needle - 28) / 28) * 240;
  const good = needle >= 38 && needle <= 45;
  return (
    <Wood tone="#A87A47" dim={0.04}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="THE CHEAPEST TOOL ON THE SHELF" title="A few degrees decide the winter" p={ramp(t, 0.1, 0.7)} w={1400} />
        {/* dial */}
        <div style={{ position: "absolute", left: 140, top: 270, width: 620, height: 620, borderRadius: "50%", background: "#F4EFE3", border: `14px solid #3A3733`, boxShadow: `0 28px 50px ${OLE.shadow}, inset 0 0 40px rgba(0,0,0,.18)` }}>
          <svg width="592" height="592" viewBox="0 0 592 592" style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M 296 296 L 296 296" />
            {Array.from({ length: 29 }, (_, i) => { const f = 28 + i; const a = ((-120 + (i / 28) * 240 - 90) * Math.PI) / 180; const r1 = 250, r2 = i % 4 === 0 ? 215 : 232; return (<g key={i}><path d={`M ${296 + r1 * Math.cos(a)} ${296 + r1 * Math.sin(a)} L ${296 + r2 * Math.cos(a)} ${296 + r2 * Math.sin(a)}`} stroke={inkC} strokeWidth={i % 4 === 0 ? 4 : 2} />{i % 4 === 0 ? <text x={296 + 182 * Math.cos(a)} y={296 + 182 * Math.sin(a) + 9} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize="28" fill={inkC}>{f}</text> : null}</g>); })}
            {/* zona sana 38-45 */}
            <path d={(() => { const A = (f: number) => ((-120 + ((f - 28) / 28) * 240 - 90) * Math.PI) / 180; const r = 262; return `M ${296 + r * Math.cos(A(38))} ${296 + r * Math.sin(A(38))} A ${r} ${r} 0 0 1 ${296 + r * Math.cos(A(45))} ${296 + r * Math.sin(A(45))}`; })()} stroke="#2F7A3E" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.9" />
            <g transform={`rotate(${ang} 296 296)`}><path d="M 296 296 L 296 70" stroke="#B3261E" strokeWidth="8" strokeLinecap="round" /><circle cx="296" cy="296" r="18" fill="#3A3733" /></g>
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: good ? "#2F7A3E" : "#B3261E" }}>{needle.toFixed(0)}°F</div>
        </div>
        {/* dos destinos */}
        {[{ y: 290, ok: true, title: "38–45°F", line: "potatoes last until spring", ico: <IcoPotato size={150} />, a: a1 }, { y: 600, ok: false, title: "A FEW DEGREES OFF", line: "potatoes sprout in December", ico: <IcoPotato size={150} sprout={1} green={1} />, a: a2 }].map((c, i) => {
          const p = pop(t, c.a, 0.5);
          return (
            <div key={i} style={{ position: "absolute", left: 880, top: c.y, width: 920, background: OLE.paper, borderRadius: 4, padding: "22px 30px", boxShadow: `0 20px 40px ${OLE.shadow}`, display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `translateX(${(1 - p) * 70}px) rotate(${c.ok ? -1 : 1}deg)`, borderLeft: `14px solid ${c.ok ? "#2F7A3E" : "#B3261E"}` }}>
              {c.ico}
              <div><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, letterSpacing: 4, color: c.ok ? "#2F7A3E" : "#B3261E" }}>{c.title}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: OLE.pencil, marginTop: 4 }}>{c.line}</div></div>
              <div style={{ marginLeft: "auto" }}>{c.ok ? <IcoCheck size={84} /> : <IcoCross size={84} />}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P18 · LOS 4 PASOS ─────────────────────────
export const OlrSteps: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.3, 0.3);
  const steps = [
    { n: 1, h: "SORT", d: "bruised, cut or soft → eat it now", ico: <IcoApple size={110} />, at: ev(at, "s1", 0.4) },
    { n: 2, h: "CURE", d: "onions & potatoes · 1–2 weeks · dry, shaded, airy", ico: <IcoOnion size={110} />, at: ev(at, "s2", 1.4) },
    { n: 3, h: "DON'T WASH", d: "brush off the loose dirt only", ico: <IcoPotato size={110} />, at: ev(at, "s3", 2.4) },
    { n: 4, h: "CHECK", d: "every 1–2 weeks · pull soft ones at once", ico: <IcoThermo size={110} level={0.5} />, at: ev(at, "s4", 3.4) },
  ];
  return (
    <Wood tone="#A87A47" dim={0.03}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="HOW THE COOK SET UP A CELLAR" title="Four steps, in this order" p={ramp(t, 0.1, 0.6)} />
        <div style={{ position: "absolute", left: 110, top: 290, width: 1700, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
          {steps.map((s, i) => { const p = pop(t, s.at, 0.5); return (
            <div key={i} style={{ background: OLE.paper, borderRadius: 4, padding: "26px 30px", boxShadow: `0 18px 36px ${OLE.shadow}`, display: "flex", alignItems: "center", gap: 26, opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${(i % 2 ? 1 : -1) * 0.8}deg)` }}>
              <div style={{ width: 84, height: 84, borderRadius: 42, background: OLE.forest, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{s.n}</div>
              {s.ico}
              <div><div style={{ fontFamily: LABEL, fontWeight: 700, letterSpacing: 5, fontSize: 44, color: OLE.forest }}>{s.h}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: OLE.pencil, lineHeight: 1.1, marginTop: 6 }}>{s.d}</div></div>
              <div style={{ marginLeft: "auto", opacity: ramp(t, s.at + 0.7, s.at + 1.1) }}><IcoCheck size={64} /></div>
            </div>); })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: OLE.plaid, opacity: ramp(t, 4.6, 5.2), transform: "rotate(-1deg)" }}>one rotten apple does spoil the bunch</div>
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P20 · LOS 3 ERRORES ─────────────────────────
export const OlrMistakes: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.3, 0.3);
  const m = [
    { h: "APPLES BESIDE POTATOES", d: "the potatoes sprout", fix: "keep them apart", ico: <span style={{ display: "flex" }}><IcoApple size={90} /><IcoPotato size={90} sprout={1} /></span>, at: ev(at, "m1", 0.6) },
    { h: "WASHED BEFORE STORING", d: "they mold on you", fix: "store dirty, wash before cooking", ico: <span style={{ display: "flex" }}><IcoDrop size={84} /><IcoPotato size={90} /></span>, at: ev(at, "m2", 5.2) },
    { h: "IGNORING ONE SOFT ONE", d: "rot spreads to the shelf", fix: "look every week or two", ico: <span style={{ display: "flex" }}><IcoApple size={90} /><IcoApple size={90} /></span>, at: ev(at, "m3", 9.6) },
  ];
  return (
    <Wood tone="#9C6B3C" dim={0.04}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="THE THREE MISTAKES I MADE SO YOU DON'T HAVE TO" title="Habits, not disasters" p={ramp(t, 0.1, 0.6)} w={1500} />
        <div style={{ position: "absolute", left: 100, top: 300, width: 1720, display: "flex", gap: 34 }}>
          {m.map((c, i) => { const p = pop(t, c.at, 0.55); const x = ramp(t, c.at + 0.8, c.at + 1.4); return (
            <div key={i} style={{ flex: 1, background: OLE.paper, borderRadius: 4, padding: "30px 28px", boxShadow: `0 22px 44px ${OLE.shadow}`, opacity: p, transform: `translateY(${(1 - p) * 60}px) rotate(${(i - 1) * 1.6}deg)`, borderTop: `14px solid ${OLE.plaid}`, minHeight: 560 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: OLE.plaid, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ margin: "10px 0 16px" }}>{c.ico}</div>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 3, color: OLE.forest, lineHeight: 1.1 }}>{c.h}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: OLE.plaid, marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}><IcoCross size={46} /> {c.d}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: "#2F7A3E", marginTop: 12, opacity: x, display: "flex", alignItems: "center", gap: 10 }}><IcoCheck size={46} /> {c.fix}</div>
            </div>); })}
        </div>
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P24 · LA REGLA DE LOS CINCO SEGUNDOS ─────────────────────────
export const OlrSortRule: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.3, 0.3);
  const cols = [
    { h: "WET INSIDE", ex: "potato · carrot · any jar", rule: "above freezing", c: "#2F6E9A", ico: <span style={{ display: "flex" }}><IcoPotato size={88} /><IcoJar size={88} /></span>, at: ev(at, "wet", 0.4), zone: "ZONE 2" },
    { h: "MEAT", ex: "beef · pork", rule: "frozen  —  or salted", c: "#B5453A", ico: <span style={{ display: "flex" }}><IcoBeef size={88} frost={1} /><IcoBarrel size={88} /></span>, at: ev(at, "meat", 4.2), zone: "ZONE 1" },
    { h: "DRY", ex: "flour · beans · sugar", rule: "stay dry · off the floor", c: "#C77A1E", ico: <span style={{ display: "flex" }}><IcoFlour size={88} /><IcoBean size={88} /></span>, at: ev(at, "dry", 7.6), zone: "ZONE 3" },
  ];
  return (
    <Wood tone="#A87A47" dim={0.03}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="THE FIVE-SECOND RULE" title="Ask what's inside it" p={ramp(t, 0.1, 0.6)} />
        <div style={{ position: "absolute", left: 110, top: 300, width: 1700, display: "flex", gap: 36 }}>
          {cols.map((c, i) => { const p = pop(t, c.at, 0.55); return (
            <div key={i} style={{ flex: 1, opacity: p, transform: `translateY(${(1 - p) * 70}px) rotate(${(i - 1) * 2}deg)` }}>
              <div style={{ background: "#B5864F", borderRadius: 6, padding: 14, boxShadow: `0 26px 46px ${OLE.shadow}`, border: "4px solid #6B4A26", backgroundImage: "repeating-linear-gradient(90deg, rgba(60,35,15,.18) 0 3px, transparent 3px 24px)" }}>
                <div style={{ background: OLE.paper, borderRadius: 3, padding: "26px 24px", textAlign: "center", minHeight: 520, border: `3px dashed ${hexA(c.c, 0.6)}` }}>
                  <div style={{ fontFamily: LABEL, fontWeight: 700, letterSpacing: 6, fontSize: 28, color: c.c }}>{c.zone}</div>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: c.c, lineHeight: 1.05, margin: "8px 0 6px" }}>{c.h}</div>
                  <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>{c.ico}</div>
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: OLE.mute }}>{c.ex}</div>
                  <div style={{ height: 4, background: hexA(c.c, 0.4), margin: "18px 40px" }} />
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: OLE.pencil, lineHeight: 1.1 }}>{c.rule}</div>
                </div>
              </div>
            </div>); })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: LABEL, fontWeight: 700, letterSpacing: 10, fontSize: 56, color: OLE.forest, opacity: ramp(t, ev(at, "end", 11), ev(at, "end", 11) + 0.5) }}>WET · MEAT · DRY</div>
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P28 / P27 · LA MANTECA ─────────────────────────
export const OlrLard: React.FC<{ phase?: "render" | "keep"; at?: any }> = ({ phase = "render", at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  if (phase === "render") {
    const heat = ramp(t, ev(at, "heat", 2), ev(at, "heat", 2) + 2);
    const melt = ramp(t, ev(at, "heat", 2) + 1, ev(at, "clear", 12));
    const clear = ramp(t, ev(at, "clear", 12), ev(at, "clear", 12) + 1.6);
    const tm = interpolate(t, [ev(at, "time", 6), ev(at, "clear", 12)], [0, 120], cl);
    const strain = ramp(t, ev(at, "strain", 15), ev(at, "jar", 17));
    const bits = Array.from({ length: 16 }, (_, i) => ({ x: 120 + rnd(i + 1) * 360, y: 200 + rnd(i + 20) * 70, r: 14 + rnd(i + 40) * 14 }));
    return (
      <Wood tone="#9C6B3C" dim={0.05}>
        <AbsoluteFill style={{ opacity: io }}>
          <Head kicker="RENDERING LARD · FROM THE BOOK" title="Low and slow" p={ramp(t, 0.1, 0.6)} />
          {/* olla + estufa */}
          <svg width="1000" height="640" viewBox="0 0 1000 640" style={{ position: "absolute", left: 120, top: 330 }}>
            <rect x="40" y="470" width="880" height="110" rx="10" fill="#1B1A18" stroke="#3A3733" strokeWidth="6" />
            <g opacity={heat}>{[160, 280, 400, 520, 640].map((x, i) => <g key={i} transform={`translate(${x} ${430 + Math.sin(t * 7 + i) * 4}) scale(0.8)`}><IcoFlame size={70} /></g>)}</g>
            <path d="M 80 130 C 80 100 140 90 480 90 C 820 90 880 100 880 130 L 840 420 C 835 460 800 470 760 470 H 200 C 160 470 125 460 120 420 Z" fill="#2B2926" stroke="#0E0D0C" strokeWidth="6" />
            <ellipse cx="480" cy="130" rx="372" ry="38" fill={clear > 0.5 ? "#F2E39A" : "#EBDDB6"} stroke="#0E0D0C" strokeWidth="5" />
            <ellipse cx="480" cy="132" rx="350" ry="28" fill={clear > 0 ? `rgba(243,224,150,${0.5 + 0.5 * clear})` : "#F4EBD6"} />
            {bits.map((b, i) => <circle key={i} cx={b.x + 180} cy={b.y - 90 + Math.sin(t * 2 + i) * 3} r={b.r * (1 - 0.35 * melt)} fill={clear > 0.5 ? "#C98A2E" : "#F7F1E2"} stroke="#B8A670" strokeWidth="2" opacity={0.95} />)}
            <path d="M 880 160 L 960 150 L 960 190 L 870 200 Z" fill="#2B2926" stroke="#0E0D0C" strokeWidth="5" />
          </svg>
          {/* termómetro de horno + reloj */}
          <div style={{ position: "absolute", left: 1220, top: 330, opacity: ramp(t, ev(at, "pot", 1), ev(at, "pot", 1) + 0.6) }}>
            <div style={{ background: OLE.paper, padding: "20px 34px", borderRadius: 4, boxShadow: `0 20px 40px ${OLE.shadow}`, display: "flex", alignItems: "center", gap: 20 }}><IcoThermo size={130} level={0.3 + 0.2 * heat} /><div><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 70, color: "#B3261E" }}>250°F</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: OLE.pencil }}>lowest heat · or the oven</div></div></div>
            <div style={{ marginTop: 26, background: OLE.paper, padding: "18px 34px", borderRadius: 4, boxShadow: `0 20px 40px ${OLE.shadow}`, fontFamily: LABEL, fontWeight: 700, color: OLE.forest, fontSize: 56, letterSpacing: 3 }}>{Math.floor(tm / 60)} h {String(Math.floor(tm % 60)).padStart(2, "0")} min<div style={{ fontFamily: HAND, fontSize: 36, color: OLE.pencil, letterSpacing: 0 }}>1½ to 2 hours</div></div>
            <div style={{ marginTop: 26, display: "flex", gap: 18, opacity: strain }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ transform: `translateY(${(1 - ramp(t, ev(at, "jar", 17) + i * 0.25, ev(at, "jar", 17) + 0.8 + i * 0.25)) * 40}px)`, opacity: ramp(t, ev(at, "jar", 17) + i * 0.25, ev(at, "jar", 17) + 0.8 + i * 0.25) }}><IcoJar size={120} fill="#F7F1E2" /></div>)}
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: OLE.paper, textShadow: "0 2px 6px rgba(0,0,0,.6)", alignSelf: "center" }}>cheesecloth → clean jars</div>
            </div>
          </div>
        </AbsoluteFill>
      </Wood>
    );
  }
  const jars = [
    { l: "REFRIGERATOR", v: "3 months", at: ev(at, "fridge", 0.6), c: "#4B93C9", f: "#F7F1E2", ico: "lard" },
    { l: "FREEZER", v: "6 months", at: ev(at, "freezer", 4.2), c: "#2F6E9A", f: "#F7F1E2", ico: "lard" },
    { l: "BACON FAT", v: "1 month · fridge", at: ev(at, "bacon", 7.2), c: "#B5453A", f: "#9A5A2A", ico: "bacon" },
  ];
  return (
    <Wood tone="#9C6B3C" dim={0.05}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="HOW LONG LARD KEEPS · FROM THE BOOK" title="Keep it cold" p={ramp(t, 0.1, 0.6)} />
        <div style={{ position: "absolute", left: 130, top: 300, width: 1660, height: 580, display: "flex", gap: 40, alignItems: "flex-end" }}>
          {jars.map((j, i) => { const p = pop(t, j.at, 0.55); return (
            <div key={i} style={{ flex: 1, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 80}px)` }}>
              <div style={{ background: "#B5864F", height: 18, borderRadius: 2, margin: "0 -10px", boxShadow: "0 8px 16px rgba(0,0,0,.35)" }} />
              <div style={{ background: OLE.paper, borderRadius: 4, padding: "26px 10px 24px", marginTop: -2, boxShadow: `0 20px 36px ${OLE.shadow}` }}>
                <IcoJar size={230} fill={j.f} />
                <div style={{ fontFamily: LABEL, fontWeight: 700, letterSpacing: 5, fontSize: 36, color: j.c, marginTop: 6 }}>{j.l}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: OLE.forest }}>{j.v}</div>
              </div>
            </div>); })}
        </div>
        <div style={{ position: "absolute", left: 130, bottom: 60, display: "flex", alignItems: "center", gap: 18, fontFamily: HAND, fontWeight: 700, fontSize: 48, color: OLE.plaid, opacity: ramp(t, ev(at, "smell", 11), ev(at, "smell", 11) + 0.6) }}><IcoCross size={60} /> smells sour or like old paint → throw it out</div>
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P37 · LAS TRES ZONAS EN TU CASA ─────────────────────────
export const OlrHomeZones: React.FC<{ at?: any; pre?: number }> = ({ at, pre = 0 }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const z = [
    { n: "ZONE 1", h: "FREEZER", d: "0°F · the clock stops", c: "#2F6E9A", x: 1180, y: 450, w: 560, h2: 240, at: ev(at, "z1", 0.6), ico: <IcoSnow size={84} /> },
    { n: "ZONE 2", h: "COOL, DARK PLACE", d: "above freezing · basement corner · crisper drawer", c: "#2F7A3E", x: 560, y: 725, w: 900, h2: 240, at: ev(at, "z2", 5.2), ico: <span style={{ display: "flex" }}><IcoPotato size={64} /><IcoOnion size={64} /></span> },
    { n: "ZONE 3", h: "DRY PANTRY SHELF", d: "off the floor · lids on everything", c: "#C77A1E", x: 140, y: 450, w: 760, h2: 240, at: ev(at, "z3", 11.4), ico: <span style={{ display: "flex" }}><IcoFlour size={64} /><IcoBean size={64} /></span> },
  ];
  const all = ramp(t, ev(at, "all", 15), ev(at, "all", 15) + 0.8);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#EADFC8,#D9C9A6)", opacity: io }}>
      <Head kicker="THE WHOLE CAMP, INSIDE YOUR HOUSE" title="Your house has three zones" p={ramp(t, 0.1, 0.6)} kc={OLE.fire} tc={OLE.forest} />
      {/* casa en corte */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <path d="M 100 430 L 960 270 L 1820 430" fill="none" stroke="#6B4A26" strokeWidth="14" strokeLinejoin="round" />
        <rect x="120" y="430" width="1680" height="270" fill="#F4EBD6" stroke="#6B4A26" strokeWidth="10" />
        <rect x="120" y="700" width="1680" height="290" fill="#C8B38E" stroke="#6B4A26" strokeWidth="10" />
        <path d="M 120 990 H 1800" stroke="#6B4A26" strokeWidth="14" />
      </svg>
      {z.map((c, i) => { const p = i < pre ? 1 : pop(t, c.at, 0.6); return (
        <div key={i} style={{ position: "absolute", left: c.x, top: c.y + (i === 2 ? 0 : 0), width: c.w, height: c.h2, opacity: p, transform: `scale(${0.92 + 0.08 * p})`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", inset: 0, background: hexA(c.c, 0.14), border: `6px solid ${c.c}`, borderRadius: 8, boxShadow: `0 0 0 ${all * 10}px ${hexA(c.c, 0.18)}` }} />
          <div style={{ position: "absolute", left: 28, top: 22 }}><div style={{ fontFamily: LABEL, fontWeight: 700, letterSpacing: 6, fontSize: 28, color: c.c }}>{c.n}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: OLE.forest, lineHeight: 1.05, marginTop: 4 }}>{c.h}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, color: OLE.pencil, marginTop: 8, maxWidth: c.w - 150 }}>{c.d}</div></div>
          <div style={{ position: "absolute", right: 26, bottom: 20 }}>{c.ico}</div>
        </div>); })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: LABEL, fontWeight: 700, letterSpacing: 8, fontSize: 40, color: OLE.plaid, opacity: all }}>THAT'S THE WHOLE CAMP</div>
    </AbsoluteFill>
  );
};

// ───────────────────────── P40 · LA TAREA DE ESTA NOCHE ─────────────────────────
export const OlrHomework: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const hs = [
    { h: "Thermometer where the potatoes & onions live", s: "read it tomorrow morning", ico: <IcoThermo size={96} level={0.45} />, at: ev(at, "h1", 0.5) },
    { h: "Apples next to potatoes? Move them apart", s: "right now", ico: <span style={{ display: "flex" }}><IcoApple size={80} /><IcoPotato size={80} /></span>, at: ev(at, "h2", 5.5) },
    { h: "Go through the bin", s: "pull anything soft, bruised or green · use it first", ico: <IcoCarrot size={96} />, at: ev(at, "h3", 9.5) },
  ];
  return (
    <Wood tone="#9C6B3C" dim={0.05}>
      <AbsoluteFill style={{ opacity: io }}>
        <Paper w={1560} h={900} x={0} y={30} rot={-1} pad={0} bg={OLE.paper} style={{ overflow: "hidden" }}>
          <AbsoluteFill style={{ backgroundImage: `linear-gradient(90deg, transparent 120px, ${hexA(OLE.plaid, 0.4)} 120px 124px, transparent 124px), repeating-linear-gradient(0deg, transparent 0 66px, ${hexA("#7A93A8", 0.32)} 66px 68px)` }} />
          <div style={{ position: "absolute", left: 160, top: 40 }}><Kicker size={30}>TONIGHT · TEN MINUTES</Kicker><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: OLE.forest, lineHeight: 1 }}>Your homework</div></div>
          {hs.map((h, i) => { const p = pop(t, h.at, 0.5); const ck = ramp(t, h.at + 1.2, h.at + 1.7); return (
            <div key={i} style={{ position: "absolute", left: 160, top: 250 + i * 200, right: 60, display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: OLE.fire, width: 70 }}>{i + 1}</div>
              {h.ico}
              <div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: OLE.pencil, lineHeight: 1.05 }}>{h.h}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: OLE.mute }}>{h.s}</div></div>
              <div style={{ marginLeft: "auto", marginRight: 30, opacity: ck, transform: `scale(${0.6 + 0.4 * ck}) rotate(${(1 - ck) * -20}deg)` }}><IcoCheck size={96} /></div>
            </div>); })}
        </Paper>
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P41 · RESUMEN ─────────────────────────
export const OlrRecap: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.4);
  const r = [
    { h: "COLD", d: "where it wanted to stay cold", c: "#2F6E9A", ico: <IcoSnow size={150} />, at: ev(at, "cold", 0.4) },
    { h: "COOL", d: "where it wanted to stay cool", c: "#2F7A3E", ico: <span style={{ display: "flex" }}><IcoPotato size={80} /><IcoOnion size={80} /></span>, at: ev(at, "cool", 3.2) },
    { h: "DRY", d: "where it needed to stay dry", c: "#C77A1E", ico: <span style={{ display: "flex" }}><IcoFlour size={80} /><IcoBean size={80} /></span>, at: ev(at, "dry", 5.6) },
  ];
  const eyes = ramp(t, ev(at, "eyes", 8), ev(at, "eyes", 8) + 0.7);
  return (
    <Wood tone="#A87A47" dim={0.02}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="THE WHOLE IDEA" title="The right place for every barrel" p={ramp(t, 0.1, 0.6)} w={1600} />
        <div style={{ position: "absolute", left: 120, top: 330, width: 1680, display: "flex", gap: 36 }}>
          {r.map((c, i) => { const p = pop(t, c.at, 0.55); return (
            <div key={i} style={{ flex: 1, background: OLE.paper, borderRadius: 4, boxShadow: `0 24px 46px ${OLE.shadow}`, padding: "30px 28px", textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 70}px) rotate(${(i - 1) * 1.8}deg)`, borderBottom: `16px solid ${c.c}` }}>
              <div style={{ display: "flex", justifyContent: "center", height: 150, alignItems: "center" }}>{c.ico}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: c.c, lineHeight: 1 }}>{c.h}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: OLE.pencil, marginTop: 10 }}>{c.d}</div>
            </div>); })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", opacity: eyes }}>
          <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: OLE.plaid, background: hexA(OLE.cream, 0.8), padding: "10px 40px", borderRadius: 6 }}>…and a cook with his eyes open</span>
        </div>
      </AbsoluteFill>
    </Wood>
  );
};
