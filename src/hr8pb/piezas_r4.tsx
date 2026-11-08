// Ramón the Mechanic · piezas propias de rm04 «Never Buy These 5 Used Cars» (en-ramon-b, 25-oct). Cada una diseñada para su
// frase: el precio pintado en el parabrisas, el cartón con los números, la CVT (conos + correa que patina), el doble embrague
// seco, los aros del pistón que se tapan, los cuartos de aceite que se van, los charcos por color, el código DOT, el escáner con
// los monitores, la web del VIN, la línea del agua, la ruta Houston→San Antonio, las citas y la lista de los 10 minutos.
// Todo con at/out de la voz (plan_enrm04.py). Sin filtros ni grano.
import React from "react";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const K = (k: number) => Math.min(1.04, k);
const vis = (t: number, at: number, out: number, fi = 0.25, fo = 0.35) => e(t, at, at + fi) * (1 - e(t, out, out + fo));
const card: React.CSSProperties = { background: "linear-gradient(180deg, rgba(20,26,34,.94), rgba(10,13,18,.94))", border: "1.5px solid rgba(255,255,255,.09)", borderRadius: 26, boxShadow: "0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)" };
const AMB = "#ffb257", RED = "#ff4a3d", GRN = "#3fd17a", ICE = "#8fd6ff", YEL = "#ffd60a";
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// ---------- 1. capítulo: el número grande extruido + título ----------
export const Chapter: React.FC<{ t: number; at: number; out: number; n: string; title: string; sub?: string; kicker?: string }> = ({ t, at, out, n, title, sub, kicker = "NEVER BUY · NUMBER" }) => {
  const o = vis(t, at, out), k = K(spr(t, at, 0.8)), k2 = ei(t, at + 0.25, at + 0.9);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(5,8,14,.25), rgba(5,8,14,.82) 70%)" }} />
      <div style={{ position: "absolute", left: 170, top: 250, fontSize: 520, fontWeight: 900, lineHeight: 1, color: AMB, textShadow: extrude(14, "#6b3d0e"), transform: `translateX(${(1 - k) * -160}px) scale(${0.8 + 0.2 * k})`, transformOrigin: "left center" }}>{n}</div>
      <div style={{ position: "absolute", left: 600, top: 380, width: 1180 }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 10, color: COL.dim, opacity: k2 }}>{kicker} {n}</div>
        <div style={{ height: 6, width: 900 * k2, background: AMB, margin: "18px 0 22px", borderRadius: 3 }} />
        <div style={{ fontSize: 96, fontWeight: 900, color: COL.ink, lineHeight: 1.02, transform: `translateY(${(1 - k2) * 40}px)`, opacity: k2, textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>{title}</div>
        {sub && <div style={{ fontSize: 42, fontWeight: 700, color: AMB, marginTop: 20, opacity: e(t, at + 0.8, at + 1.2) }}>{sub}</div>}
      </div>
    </div>
  );
};

// ---------- 2. el precio pintado con marcador en el parabrisas ----------
export const LotPrice: React.FC<{ t: number; at: number; out: number; price: string; items: { at: number; tx: string }[]; x?: number; y?: number }> = ({ t, at, out, price, items, x = 1350, y = 420 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const w = ei(t, at + 0.1, at + 1.0);
  return (
    <div style={{ position: "absolute", left: x - 380, top: y - 220, width: 760, opacity: o, fontFamily: FONT, transform: `rotate(-4deg) scale(${0.9 + 0.1 * K(spr(t, at))})` }}>
      <div style={{ position: "relative", height: 300, borderRadius: 40, background: "linear-gradient(160deg, rgba(150,190,220,.30), rgba(40,60,80,.55))", border: "3px solid rgba(220,235,245,.35)", boxShadow: "0 30px 70px rgba(0,0,0,.5)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -100, top: 0, width: 220, height: 400, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent)", transform: `translateX(${e(t, at, at + 2.5) * 900}px) rotate(18deg)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
          <span style={{ fontSize: 190, fontWeight: 900, color: YEL, fontStyle: "italic", letterSpacing: -4, textShadow: "0 0 2px #8a6a00, 4px 6px 0 rgba(0,0,0,.25)" }}>{price}</span>
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 22, fontSize: 40, fontWeight: 900, color: "#fff", fontStyle: "italic", opacity: e(t, at + 0.9, at + 1.2) }}>CHEAP!</div>
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
        {items.map((it, i) => { const q = K(spr(t, it.at)); return <div key={i} style={{ ...card, padding: "12px 24px", fontSize: 36, fontWeight: 800, color: COL.ink, opacity: e(t, it.at, it.at + 0.2), transform: `translateY(${(1 - q) * 30}px)` }}>{it.tx}</div>; })}
      </div>
    </div>
  );
};

// ---------- 3. el cartón con los números (marcador) ----------
export const Cardboard: React.FC<{ t: number; at: number; out: number; rows: { at: number; item: string; v: number }[]; totalAt: number; total: string; carAt: number; car: number; x?: number; y?: number }> = ({ t, at, out, rows, totalAt, total, carAt, car, x = 1330, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const tot = rows.reduce((s, r) => s + r.v, 0);
  const cw = e(t, carAt, carAt + 1.0);
  return (
    <div style={{ position: "absolute", left: x - 400, top: y - 330, width: 800, opacity: o, fontFamily: FONT, transform: `rotate(2.5deg) translateY(${(1 - K(spr(t, at, 0.8))) * 80}px)` }}>
      <div style={{ padding: "40px 50px 36px", borderRadius: 10, background: "linear-gradient(170deg, #b88d5e, #9c7447)", boxShadow: "0 30px 70px rgba(0,0,0,.55), inset 0 0 60px rgba(70,40,10,.35)", color: "#151515" }}>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 4, opacity: 0.7, fontStyle: "italic" }}>PARTS COUNTER · 3 MONTHS IN</div>
        {rows.map((r, i) => { const q = e(t, r.at, r.at + 0.5); return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 54, fontWeight: 900, fontStyle: "italic", marginTop: 14, clipPath: `inset(0 ${(1 - q) * 100}% 0 0)` }}><span>{r.item}</span><span>{money(r.v)}</span></div>); })}
        <div style={{ height: 6, background: "#151515", margin: "18px 0 10px", width: `${e(t, totalAt - 0.3, totalAt) * 100}%`, borderRadius: 3 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 80, fontWeight: 900, fontStyle: "italic", color: "#8f1010", opacity: e(t, totalAt, totalAt + 0.25), transform: `scale(${0.85 + 0.15 * K(spr(t, totalAt))})`, transformOrigin: "right" }}><span>TOTAL</span><span>{total}</span></div>
        <div style={{ marginTop: 26, opacity: e(t, carAt, carAt + 0.3) }}>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>THE CAR: {money(car)}</div>
          <div style={{ position: "relative", height: 46, background: "rgba(0,0,0,.18)", borderRadius: 8, marginTop: 10, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, width: `${cw * Math.min(1, (tot || 3800) / car) * 100}%`, background: "#8f1010" }} />
            <div style={{ position: "absolute", right: 16, top: 4, fontSize: 32, fontWeight: 900, color: "#fff", opacity: e(t, carAt + 1, carAt + 1.3) }}>≈ HALF THE CAR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- 4. los 3 repuestos contra un mes de alquiler ----------
export const ThreeParts: React.FC<{ t: number; at: number; out: number; items: { at: number; tx: string; v: number }[]; rentAt: number }> = ({ t, at, out, items, rentAt }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const sum = items.reduce((s, it) => s + (t >= it.at ? it.v : 0), 0), rent = 1350;
  const tilt = Math.max(-12, Math.min(12, (sum - rent * e(t, rentAt, rentAt + 0.6)) / 120)) * e(t, rentAt, rentAt + 0.8);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, position: "absolute", left: 980, top: 150, width: 820, height: 780, padding: 40 }}>
        <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 6, color: AMB }}>CALL THE PARTS COUNTER</div>
        <svg width={740} height={620} style={{ marginTop: 10 }}>
          <polygon points="370,600 330,560 410,560" fill="#666" />
          <rect x={366} y={170} width={8} height={395} fill="#888" />
          <g transform={`rotate(${tilt} 370 170)`}>
            <rect x={60} y={164} width={620} height={12} rx={6} fill="#c9ccd0" />
            <line x1={130} y1={176} x2={130} y2={300} stroke="#999" strokeWidth={3} /><line x1={610} y1={176} x2={610} y2={300} stroke="#999" strokeWidth={3} />
            <rect x={30} y={300} width={200} height={14} rx={4} fill="#c9ccd0" /><rect x={510} y={300} width={200} height={14} rx={4} fill="#c9ccd0" />
            {items.map((it, i) => { const q = K(spr(t, it.at)); return t >= it.at - 0.05 && <g key={i} transform={`translate(${130} ${300 - 62 * (i + 1) * q}) scale(${q})`}><rect x={-96} y={0} width={192} height={58} rx={8} fill={["#3a6ea5", "#a5733a", "#3aa572"][i]} /><text x={0} y={38} fill="#fff" fontSize={26} fontWeight={900} textAnchor="middle" fontFamily={FONT}>{it.tx}</text></g>; })}
            {t >= rentAt && <g transform={`translate(610 ${300 - 120 * K(spr(t, rentAt))})`}><rect x={-100} y={0} width={200} height={118} rx={10} fill="#2b313a" stroke={AMB} strokeWidth={3} /><text x={0} y={52} fill={AMB} fontSize={30} fontWeight={900} textAnchor="middle" fontFamily={FONT}>1 MONTH</text><text x={0} y={92} fill={AMB} fontSize={30} fontWeight={900} textAnchor="middle" fontFamily={FONT}>OF RENT</text></g>}
          </g>
          <text x={130} y={420} fill={COL.ink} fontSize={58} fontWeight={900} textAnchor="middle" fontFamily={FONT}>{money(sum)}</text>
        </svg>
      </div>
    </div>
  );
};

// ---------- 5. la CVT: dos conos y la correa de acero (aprieta, sube/baja, se calienta y patina) ----------
export const CVT: React.FC<{ t: number; at: number; out: number; heatAt?: number; slipAt?: number; x?: number; y?: number; sc?: number }> = ({ t, at, out, heatAt = 1e9, slipAt = 1e9, x = 960, y = 540, sc = 1 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const sq = 0.5 + 0.45 * Math.sin((t - at) * 0.9);                  // los conos aprietan / sueltan
  const heat = e(t, heatAt, heatAt + 2), slip = e(t, slipAt, slipAt + 0.6);
  const jit = slip * Math.sin(t * 47) * 6;
  const r1 = 70 + 80 * sq, r2 = 150 - 80 * sq;                        // radio donde corre la correa en cada polea
  const hot = (c: string) => { const n = parseInt(c.slice(1), 16), k = 0.7 * heat, m = (a: number, b: number) => Math.round(a + (b - a) * k); return `rgb(${m(n >> 16, 255)},${m((n >> 8) & 255, 58)},${m(n & 255, 16)})`; };
  const Pulley: React.FC<{ cx: number; r: number }> = ({ cx, r }) => (
    <g>
      <ellipse cx={cx} cy={300} rx={44} ry={180} fill={hot("#8d949c")} opacity={0.95} />
      <ellipse cx={cx} cy={300} rx={26} ry={180 - (180 - r) * 0.2} fill={hot("#b9c0c7")} />
      <ellipse cx={cx} cy={300} rx={10} ry={30} fill="#2b2f33" />
    </g>
  );
  const c1 = 330, c2 = 830;
  return (
    <div style={{ position: "absolute", left: x - 580 * sc, top: y - 330 * sc, width: 1160, height: 660, transform: `scale(${sc})`, transformOrigin: "top left", opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, position: "absolute", inset: 0 }} />
      <svg width={1160} height={660} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="cvtheat"><stop offset="0" stopColor="#ff5a1f" stopOpacity={0.55 * heat} /><stop offset="1" stopColor="#ff5a1f" stopOpacity={0} /></radialGradient></defs>
        <rect x={0} y={0} width={1160} height={660} fill="url(#cvtheat)" rx={26} />
        <Pulley cx={c1} r={r1} /><Pulley cx={c2} r={r2} />
        {/* la correa */}
        <g transform={`translate(${jit} 0)`}>
          <path d={`M ${c1} ${300 - r1} L ${c2} ${300 - r2} A 26 ${r2} 0 0 1 ${c2} ${300 + r2} L ${c1} ${300 + r1} A 26 ${r1} 0 0 1 ${c1} ${300 - r1}`} fill="none" stroke={hot("#d9dde1")} strokeWidth={18} strokeLinejoin="round" />
          {Array.from({ length: 16 }, (_, i) => { const u = ((i / 16 + (t - at) * (0.35 - 0.25 * slip)) % 1); const px = c1 + (c2 - c1) * u, py = 300 - (r1 + (r2 - r1) * u); return <rect key={i} x={px - 4} y={py - 12} width={8} height={24} fill="#5c6166" />; })}
        </g>
        <text x={c1} y={560} fill={COL.ink} fontSize={30} fontWeight={800} textAnchor="middle" fontFamily={FONT}>CONE</text>
        <text x={c2} y={560} fill={COL.ink} fontSize={30} fontWeight={800} textAnchor="middle" fontFamily={FONT}>CONE</text>
        <text x={580} y={84} fill={AMB} fontSize={34} fontWeight={900} textAnchor="middle" letterSpacing={6} fontFamily={FONT}>STEEL BELT · NO GEARS</text>
        {heat > 0.05 && <text x={580} y={620} fill="#ff6a3d" fontSize={44} fontWeight={900} textAnchor="middle" opacity={heat} fontFamily={FONT}>{slip > 0.3 ? "THE BELT SLIPS" : "FLUID COOKS · 102°F"}</text>}
      </svg>
    </div>
  );
};

// ---------- 6. el doble embrague seco: impares / pares, sin aceite ----------
export const DCT: React.FC<{ t: number; at: number; out: number; dryAt?: number; x?: number; y?: number }> = ({ t, at, out, dryAt = 1e9, x = 960, y = 540 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const ph = Math.floor((t - at) / 0.9) % 2, dry = e(t, dryAt, dryAt + 1.2);
  const gear = 1 + (Math.floor((t - at) / 0.9) % 6);
  const Disc: React.FC<{ cx: number; on: boolean; lab: string; gears: string }> = ({ cx, on, lab, gears }) => (
    <g>
      <circle cx={cx} cy={290} r={150} fill="#2a2f35" stroke={on ? AMB : "#4a5058"} strokeWidth={on ? 10 : 4} />
      <circle cx={cx} cy={290} r={118} fill={dry > 0.1 && on ? `rgba(255,${120 - 60 * dry},40,${0.35 + 0.4 * dry})` : "#8a6d4f"} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={cx + Math.cos(i * 0.52 + t * (on ? 3 : 0.4)) * 60} y1={290 + Math.sin(i * 0.52 + t * (on ? 3 : 0.4)) * 60} x2={cx + Math.cos(i * 0.52 + t * (on ? 3 : 0.4)) * 114} y2={290 + Math.sin(i * 0.52 + t * (on ? 3 : 0.4)) * 114} stroke="#5a4632" strokeWidth={6} />)}
      <circle cx={cx} cy={290} r={46} fill="#9aa0a6" />
      <text x={cx} y={490} fill={on ? AMB : COL.dim} fontSize={36} fontWeight={900} textAnchor="middle" fontFamily={FONT}>{lab}</text>
      <text x={cx} y={534} fill={COL.ink} fontSize={30} fontWeight={800} textAnchor="middle" fontFamily={FONT}>{gears}</text>
    </g>
  );
  return (
    <div style={{ position: "absolute", left: x - 560, top: y - 320, width: 1120, height: 640, opacity: o, fontFamily: FONT, transform: `translateY(${(1 - K(spr(t, at, 0.8))) * 60}px)` }}>
      <div style={{ ...card, position: "absolute", inset: 0 }} />
      <svg width={1120} height={640} style={{ position: "absolute", inset: 0 }}>
        <text x={560} y={70} fill={AMB} fontSize={34} fontWeight={900} textAnchor="middle" letterSpacing={6} fontFamily={FONT}>TWO CLUTCHES · ONE COMPUTER</text>
        <Disc cx={330} on={ph === 0} lab="CLUTCH A" gears="1 · 3 · 5" />
        <Disc cx={790} on={ph === 1} lab="CLUTCH B" gears="2 · 4 · 6" />
        <rect x={500} y={250} width={120} height={80} rx={12} fill="#11161c" stroke={ICE} strokeWidth={3} />
        <text x={560} y={304} fill={ICE} fontSize={44} fontWeight={900} textAnchor="middle" fontFamily={FONT}>{gear}</text>
        {dry > 0.05 && <text x={560} y={606} fill="#ff6a3d" fontSize={42} fontWeight={900} textAnchor="middle" opacity={dry} fontFamily={FONT}>DRY · NO OIL TO COOL THEM</text>}
      </svg>
    </div>
  );
};

// ---------- 7. los aros del pistón: finos, se tapan de carbón, el aceite sube y se quema ----------
export const Rings: React.FC<{ t: number; at: number; out: number; clogAt: number; oilAt: number; x?: number; y?: number }> = ({ t, at, out, clogAt, oilAt, x = 1340, y = 540 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const py = Math.sin((t - at) * 3.2) * 60, clog = e(t, clogAt, clogAt + 1.5), oil = e(t, oilAt, oilAt + 1);
  return (
    <div style={{ position: "absolute", left: x - 360, top: y - 400, width: 720, height: 800, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, position: "absolute", inset: 0 }} />
      <svg width={720} height={800} style={{ position: "absolute", inset: 0 }}>
        <text x={360} y={64} fill={AMB} fontSize={32} fontWeight={900} textAnchor="middle" letterSpacing={5} fontFamily={FONT}>INSIDE THE CYLINDER</text>
        <rect x={150} y={110} width={30} height={600} fill="#6b7178" /><rect x={540} y={110} width={30} height={600} fill="#6b7178" />
        <rect x={180} y={110} width={360} height={150} fill={`rgba(255,${150 - 100 * oil},60,${0.12 + 0.3 * oil})`} />
        {oil > 0.05 && Array.from({ length: 10 }, (_, i) => { const u = ((t * 0.6 + i / 10) % 1); return <circle key={i} cx={200 + (i * 37) % 320} cy={260 - u * 140 + py * 0.3} r={6 + u * 10} fill="#7d9bc4" opacity={(1 - u) * 0.7 * oil} />; })}
        <g transform={`translate(0 ${py})`}>
          <rect x={184} y={300} width={352} height={230} rx={10} fill="#a9afb5" />
          {[0, 1, 2].map((i) => <g key={i}><rect x={184} y={320 + i * 30} width={352} height={10} fill="#3a3f45" />
            {Array.from({ length: 8 }, (_, j) => <circle key={j} cx={210 + j * 44} cy={325 + i * 30} r={3} fill={clog > (j / 8) ? "#111" : "#d9dde1"} />)}</g>)}
          <rect x={330} y={530} width={60} height={180} rx={10} fill="#7d838a" />
          {oil > 0.05 && [0, 1].map((s) => <circle key={s} cx={s ? 530 : 190} cy={400 - ((t * 1.4) % 1) * 120} r={7} fill="#3a2806" opacity={oil} />)}
        </g>
        <text x={360} y={760} fill={clog > 0.5 ? "#ff6a3d" : COL.ink} fontSize={36} fontWeight={900} textAnchor="middle" fontFamily={FONT}>{oil > 0.3 ? "OIL SNEAKS UP · BURNS" : clog > 0.3 ? "THIN RINGS CLOG WITH CARBON" : "PISTON RINGS"}</text>
      </svg>
    </div>
  );
};

// ---------- 8. los cuartos de aceite que se van cada 1.000 millas ----------
export const Quarts: React.FC<{ t: number; at: number; out: number; dur?: number; x?: number; y?: number }> = ({ t, at, out, dur = 5, x = 960, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = e(t, at + 0.6, at + 0.6 + dur), miles = Math.round(k * 5000 / 100) * 100;
  return (
    <div style={{ position: "absolute", left: x - 620, top: y - 280, width: 1240, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, padding: "36px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 6, color: AMB }}>A QUART EVERY 1,000 MILES</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: COL.ink }}>{miles.toLocaleString("en-US")} mi</div>
        </div>
        <div style={{ display: "flex", gap: 30, marginTop: 30, justifyContent: "center" }}>
          {[0, 1, 2, 3, 4].map((i) => { const lv = 1 - Math.max(0, Math.min(1, k * 5 - i)) * (i < 4 ? 1 : 0); return (
            <div key={i} style={{ width: 170, height: 260, borderRadius: "30px 30px 16px 16px", border: "4px solid rgba(255,255,255,.35)", position: "relative", overflow: "hidden", background: "rgba(255,255,255,.04)" }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: "linear-gradient(180deg, #e2b04a, #9a6b13)" }} />
              <div style={{ position: "absolute", top: 100, width: "100%", textAlign: "center", fontSize: 30, fontWeight: 900, color: "#fff", textShadow: "0 2px 8px #000" }}>QT {i + 1}</div>
            </div>); })}
        </div>
        <div style={{ textAlign: "center", fontSize: 60, fontWeight: 900, color: RED, marginTop: 24, opacity: e(t, at + dur + 0.6, at + dur + 0.9) }}>4 QUARTS LOW</div>
      </div>
    </div>
  );
};

// ---------- 9. los charcos por color ----------
export const Puddles: React.FC<{ t: number; out: number; items: { at: number; col: string; tx: string; sub: string; ok?: boolean }[] }> = ({ t, out, items }) => {
  const o = items.length ? vis(t, items[0].at, out) : 0; if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 28, opacity: o, fontFamily: FONT }}>
      {items.map((it, i) => { const q = K(spr(t, it.at)); return (
        <div key={i} style={{ ...card, width: 380, padding: "26px 24px", opacity: e(t, it.at, it.at + 0.2), transform: `translateY(${(1 - q) * 60}px)`, borderColor: it.ok ? "rgba(63,209,122,.5)" : "rgba(255,255,255,.09)" }}>
          <svg width={330} height={110}><ellipse cx={165} cy={60} rx={150 * q} ry={42 * q} fill={it.col} opacity={0.92} /><ellipse cx={130} cy={48} rx={44 * q} ry={10 * q} fill="#fff" opacity={0.25} /></svg>
          <div style={{ fontSize: 46, fontWeight: 900, color: it.ok ? GRN : COL.ink, marginTop: 8 }}>{it.tx}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: COL.dim }}>{it.sub}</div>
        </div>); })}
    </div>
  );
};

// ---------- 10. el código DOT en el costado de la llanta ----------
export const DotCode: React.FC<{ t: number; at: number; out: number; code: string; splitAt: number; ruleAt: number }> = ({ t, at, out, code, splitAt, ruleAt }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const sp = ei(t, splitAt, splitAt + 0.7);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="tire" cx="0.5" cy="0.5"><stop offset="0.62" stopColor="#1a1a1a" /><stop offset="0.9" stopColor="#262626" /><stop offset="1" stopColor="#111" /></radialGradient></defs>
        <circle cx={1500} cy={1080 + 160} r={900} fill="url(#tire)" />
        <circle cx={1500} cy={1080 + 160} r={560} fill="#2e3237" />
        <path id="arc" d="M 760 1240 A 740 740 0 0 1 2240 1240" fill="none" />
        <text fill="#3a3a3a" fontSize={64} fontWeight={900} letterSpacing={10} fontFamily={FONT}><textPath href="#arc" startOffset="18%">DOT  X7KL  9TR4  </textPath></text>
        <g transform={`translate(1080 ${520 - 40 * K(spr(t, at))})`}>
          <rect x={-200} y={-90} width={400} height={170} rx={85} fill="#202020" stroke="#4a4a4a" strokeWidth={6} />
          <text x={-sp * 120} y={34} fill="#d8d8d8" fontSize={110} fontWeight={900} textAnchor="end" fontFamily={FONT}>{code.slice(0, 2)}</text>
          <text x={sp * 120} y={34} fill="#d8d8d8" fontSize={110} fontWeight={900} textAnchor="start" fontFamily={FONT}>{code.slice(2)}</text>
          <text x={-130 - sp * 40} y={150} fill={AMB} fontSize={40} fontWeight={900} textAnchor="middle" opacity={sp} fontFamily={FONT}>WEEK {code.slice(0, 2)}</text>
          <text x={140 + sp * 40} y={150} fill={AMB} fontSize={40} fontWeight={900} textAnchor="middle" opacity={sp} fontFamily={FONT}>YEAR 20{code.slice(2)}</text>
        </g>
      </svg>
      <div style={{ ...card, position: "absolute", left: 120, top: 160, padding: "26px 36px", opacity: e(t, ruleAt, ruleAt + 0.3), transform: `translateX(${(1 - K(spr(t, ruleAt))) * -80}px)` }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: COL.dim, letterSpacing: 4 }}>IN TEXAS HEAT</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: RED }}>&gt; 6 YEARS = NO</div>
      </div>
    </div>
  );
};

// ---------- 11. el escáner de 20 dólares: códigos y monitores ----------
export const Scanner: React.FC<{ t: number; at: number; out: number; monAt: number; notAt: number; x?: number; y?: number }> = ({ t, at, out, monAt, notAt, x = 1360, y = 540 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const mons = ["MISFIRE", "FUEL SYSTEM", "CATALYST", "EVAP", "O2 SENSOR", "EGR"];
  return (
    <div style={{ position: "absolute", left: x - 330, top: y - 420, width: 660, height: 840, opacity: o, fontFamily: FONT, transform: `rotate(-3deg) translateY(${(1 - K(spr(t, at, 0.8))) * 120}px)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "linear-gradient(170deg, #f2c230, #d39a12)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 50, top: 60, right: 50, height: 560, borderRadius: 22, background: "#0d1a12", border: "6px solid #222", padding: "26px 30px", fontFamily: "monospace" }}>
        <div style={{ color: "#7cff9a", fontSize: 36, fontWeight: 700 }}>CODES: 0</div>
        <div style={{ color: "#7cff9a", fontSize: 28, opacity: 0.7, marginTop: 6 }}>CHECK ENGINE: OFF</div>
        <div style={{ height: 2, background: "#2d5a3a", margin: "18px 0" }} />
        <div style={{ color: "#7cff9a", fontSize: 30, opacity: e(t, monAt, monAt + 0.3) }}>READINESS MONITORS</div>
        {mons.map((m, i) => { const a = monAt + 0.3 + i * 0.18, bad = t >= notAt + i * 0.12 && i !== 4; return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, marginTop: 10, color: bad ? "#ff5a4a" : "#7cff9a", opacity: e(t, a, a + 0.15) }}><span>{m}</span><span>{bad ? "NOT READY" : "READY"}</span></div>); })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 40 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 90, height: 90, borderRadius: 45, background: "#2a2a2a", boxShadow: "inset 0 -6px 0 #111" }} />)}
      </div>
    </div>
  );
};

// ---------- 12. la página web del VIN (barra con la dirección que se escribe) ----------
export const WebCard: React.FC<{ t: number; at: number; out: number; url: string; title: string; lines: { at: number; tx: string; col?: string }[]; x?: number; y?: number }> = ({ t, at, out, url, title, lines, x = 1330, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const n = Math.round(e(t, at + 0.2, at + 0.2 + url.length * 0.045) * url.length);
  return (
    <div style={{ position: "absolute", left: x - 420, top: y - 300, width: 840, opacity: o, fontFamily: FONT, transform: `translateY(${(1 - K(spr(t, at, 0.8))) * 70}px)` }}>
      <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.55)", background: "#f4f5f7" }}>
        <div style={{ background: "#dfe2e6", padding: "18px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
          <div style={{ flex: 1, marginLeft: 16, background: "#fff", borderRadius: 12, padding: "10px 20px", fontSize: 34, fontWeight: 700, color: "#222" }}>{url.slice(0, n)}<span style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0 }}>|</span></div>
        </div>
        <div style={{ padding: "30px 36px 36px" }}>
          <div style={{ fontSize: 46, fontWeight: 900, color: "#0f2a4a" }}>{title}</div>
          <div style={{ marginTop: 16, height: 70, borderRadius: 12, border: "3px solid #b9c2cc", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 34, fontWeight: 800, color: "#555", letterSpacing: 4, fontFamily: "monospace" }}>{"1HGCM82633A0".slice(0, Math.round(e(t, at + 1.2, at + 2.2) * 12))}<span style={{ color: "#bbb" }}>{"•".repeat(Math.max(0, 5))}</span></div>
          {lines.map((l, i) => <div key={i} style={{ fontSize: 38, fontWeight: 900, color: l.col ?? "#1d7a46", marginTop: 16, opacity: e(t, l.at, l.at + 0.25) }}>{l.tx}</div>)}
        </div>
      </div>
    </div>
  );
};

// ---------- 13. la línea del agua: el auto de costado, el agua sube hasta los asientos, se va y deja la marca ----------
export const FloodLine: React.FC<{ t: number; at: number; out: number; riseAt: number; dryAt: number; x?: number; y?: number }> = ({ t, at, out, riseAt, dryAt, x = 960, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const up = e(t, riseAt, riseAt + 1.8) * (1 - e(t, dryAt, dryAt + 1.4)), mark = e(t, riseAt + 1.2, riseAt + 1.8);
  const wl = 520 - 230 * up, ml = 290;
  return (
    <div style={{ position: "absolute", left: x - 700, top: y - 330, width: 1400, height: 660, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, position: "absolute", inset: 0 }} />
      <svg width={1400} height={660} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="carclip"><path d="M 250 470 L 270 360 Q 300 330 360 325 L 520 320 L 610 220 Q 640 200 700 200 L 930 200 Q 980 200 1010 230 L 1090 320 L 1170 335 Q 1210 345 1215 380 L 1220 470 Z" /></clipPath></defs>
        <path d="M 250 470 L 270 360 Q 300 330 360 325 L 520 320 L 610 220 Q 640 200 700 200 L 930 200 Q 980 200 1010 230 L 1090 320 L 1170 335 Q 1210 345 1215 380 L 1220 470 Z" fill="#3a4a5c" stroke="#9fb0c2" strokeWidth={4} />
        <path d="M 630 232 L 700 228 L 790 228 L 790 318 L 560 318 Z" fill="#1b2633" /><path d="M 810 228 L 920 228 Q 960 230 985 255 L 1045 318 L 810 318 Z" fill="#1b2633" />
        <rect x={640} y={300} width={300} height={22} rx={8} fill="#8a6d4f" opacity={0.9} />
        <text x={790} y={292} fill={COL.ink} fontSize={26} fontWeight={800} textAnchor="middle" fontFamily={FONT}>SEATS</text>
        <g clipPath="url(#carclip)"><rect x={200} y={ml} width={1100} height={4 + 0 * mark} fill="#5b4122" opacity={mark} /><rect x={200} y={ml + 4} width={1100} height={200} fill="#5b4a35" opacity={0.35 * mark} /></g>
        {[380, 1090].map((cx) => <g key={cx}><circle cx={cx} cy={480} r={70} fill="#151515" /><circle cx={cx} cy={480} r={36} fill="#9aa0a6" /></g>)}
        <rect x={0} y={wl} width={1400} height={660 - wl} fill="rgba(110,85,50,.72)" />
        <path d={`M 0 ${wl} ${Array.from({ length: 29 }, (_, i) => `L ${i * 50} ${wl + Math.sin(i * 0.9 + t * 3) * 6}`).join(" ")} L 1400 ${wl}`} stroke="rgba(230,210,170,.6)" strokeWidth={4} fill="none" />
        {mark > 0.5 && up < 0.3 && <g opacity={e(t, dryAt + 1, dryAt + 1.4)}><line x1={1240} y1={ml} x2={1310} y2={ml} stroke={AMB} strokeWidth={4} /><text x={1240} y={ml - 18} fill={AMB} fontSize={34} fontWeight={900} textAnchor="end" fontFamily={FONT}>THE WATER LINE STAYS</text></g>}
      </svg>
    </div>
  );
};

// ---------- 14. Houston → San Antonio por la I-10: los autos inundados viajan ----------
export const FloodRoute: React.FC<{ t: number; at: number; out: number; countAt: number; goAt: number }> = ({ t, at, out, countAt, goAt }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const n = Math.round(e(t, countAt, countAt + 1.8) * 1000000);
  const TX = "M 380 180 L 640 180 L 640 330 L 900 380 L 1150 430 L 1330 470 L 1420 560 L 1400 700 L 1270 820 L 1130 930 L 1040 990 L 980 900 L 880 760 L 760 690 L 640 720 L 560 640 L 470 560 L 300 470 L 380 470 Z";
  const H = [1250, 640], S = [930, 690];
  const draw = e(t, goAt, goAt + 1.4);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,9,14,.6)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={TX} fill="#1a2430" stroke="#5d7187" strokeWidth={4} transform="translate(100 0)" />
        <g transform="translate(100 0)">
          <circle cx={H[0]} cy={H[1]} r={90 * K(spr(t, at))} fill="rgba(60,140,220,.35)" />
          <circle cx={H[0]} cy={H[1]} r={14} fill={ICE} /><text x={H[0] + 26} y={H[1] - 20} fill={COL.ink} fontSize={40} fontWeight={900} fontFamily={FONT}>HOUSTON</text>
          <circle cx={S[0]} cy={S[1]} r={14} fill={AMB} /><text x={S[0] - 26} y={S[1] + 60} fill={COL.ink} fontSize={40} fontWeight={900} textAnchor="end" fontFamily={FONT}>SAN ANTONIO</text>
          <line x1={H[0]} y1={H[1]} x2={H[0] + (S[0] - H[0]) * draw} y2={H[1] + (S[1] - H[1]) * draw} stroke={AMB} strokeWidth={8} strokeDasharray="22 14" />
          {draw > 0.9 && Array.from({ length: 6 }, (_, i) => { const u = ((t - goAt) * 0.25 + i / 6) % 1; return <rect key={i} x={H[0] + (S[0] - H[0]) * u - 14} y={H[1] + (S[1] - H[1]) * u - 9} width={28} height={18} rx={4} fill="#c9a36a" />; })}
          <text x={(H[0] + S[0]) / 2} y={(H[1] + S[1]) / 2 - 30} fill={AMB} fontSize={38} fontWeight={900} textAnchor="middle" opacity={draw} fontFamily={FONT}>I-10 · 3 HOURS</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 120, top: 120, opacity: e(t, countAt, countAt + 0.3) }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: COL.dim, letterSpacing: 5 }}>HARVEY · AUGUST 2017</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: COL.ink, textShadow: extrude(8, "#1d3a5a") }}>{n.toLocaleString("en-US")}</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: ICE }}>cars and trucks underwater</div>
      </div>
    </div>
  );
};

// ---------- 15. la cita (Don Chuy / Marta / Kowalski) ----------
export const Quote: React.FC<{ t: number; at: number; out: number; text: string; who: string; x?: number; y?: number; w?: number }> = ({ t, at, out, text, who, x = 960, y = 540, w = 1300 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const words = text.split(" "), dur = Math.min(2.6, words.length * 0.16);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 200, width: w, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, padding: "50px 64px", transform: `scale(${0.94 + 0.06 * K(spr(t, at))})` }}>
        <div style={{ position: "absolute", left: 30, top: -30, fontSize: 200, color: AMB, fontWeight: 900, lineHeight: 1 }}>“</div>
        <div style={{ fontSize: 62, fontWeight: 800, color: COL.ink, lineHeight: 1.18 }}>
          {words.map((wd, i) => <span key={i} style={{ opacity: e(t, at + 0.2 + (i / words.length) * dur, at + 0.35 + (i / words.length) * dur) }}>{wd} </span>)}
        </div>
        <div style={{ fontSize: 38, fontWeight: 900, color: AMB, marginTop: 24, opacity: e(t, at + dur, at + dur + 0.3) }}>— {who}</div>
      </div>
    </div>
  );
};

// ---------- 16. la lista de los 10 minutos (a la izquierda; se enciende la que se está diciendo) ----------
export const TenMin: React.FC<{ t: number; at: number; out: number; rows: { at: number; tx: string }[]; title?: string }> = ({ t, at, out, rows, title = "THE 10-MINUTE TEST" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  let cur = -1; rows.forEach((r, i) => { if (t >= r.at) cur = i; });
  return (
    <div style={{ position: "absolute", left: 60, top: 120, width: 560, opacity: o, fontFamily: FONT, transform: `translateX(${(1 - K(spr(t, at, 0.8))) * -200}px)` }}>
      <div style={{ ...card, padding: "28px 30px" }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: AMB, letterSpacing: 4 }}>{title}</div>
        {rows.map((r, i) => { const on = i === cur, done = i < cur; return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16, opacity: t >= r.at - 0.1 ? 1 : 0.32, transform: `scale(${on ? 1.04 : 1})`, transformOrigin: "left" }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: on ? AMB : done ? "rgba(63,209,122,.9)" : "rgba(255,255,255,.08)", color: on ? "#1a1004" : "#fff", fontSize: 30, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{done ? "✓" : i + 1}</div>
            <div style={{ fontSize: 38, fontWeight: on ? 900 : 700, color: on ? COL.ink : COL.dim }}>{r.tx}</div>
          </div>); })}
      </div>
    </div>
  );
};

// ---------- 17. la etiqueta de precio que cae (presupuesto / pérdida) ----------
export const PriceDrop: React.FC<{ t: number; at: number; out: number; v: string; label: string; col?: string; x?: number; y?: number }> = ({ t, at, out, v, label, col = RED, x = 1400, y = 470 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.9)), sw = Math.sin((t - at) * 3) * 4 * (1 - e(t, at, at + 2));
  return (
    <div style={{ position: "absolute", left: x - 300, top: y - 200 - (1 - k) * 300, width: 600, opacity: o, fontFamily: FONT, transform: `rotate(${-6 + sw}deg)`, transformOrigin: "top center" }}>
      <div style={{ width: 4, height: 90, background: "#ccc", margin: "0 auto" }} />
      <div style={{ background: "#f4efe2", borderRadius: "18px 18px 18px 18px", padding: "34px 40px", boxShadow: "0 30px 70px rgba(0,0,0,.55)", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: 16, width: 26, height: 26, borderRadius: 13, background: "#555", marginLeft: -13 }} />
        <div style={{ fontSize: 34, fontWeight: 900, color: "#333", letterSpacing: 4, marginTop: 20 }}>{label}</div>
        <div style={{ fontSize: 130, fontWeight: 900, color: col, lineHeight: 1.05 }}>{v}</div>
      </div>
    </div>
  );
};

// ---------- 18. el monitor de alquiler / tiempo: "20 MIN" grande con la aguja ----------
export const DriveTimer: React.FC<{ t: number; at: number; out: number; from: string; to: string; flipAt: number; x?: number; y?: number }> = ({ t, at, out, from, to, flipAt, x = 1480, y = 360 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const f = ei(t, flipAt, flipAt + 0.5);
  return (
    <div style={{ position: "absolute", left: x - 260, top: y - 160, width: 520, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, padding: "28px 34px", textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: COL.dim, letterSpacing: 4 }}>THE TEST DRIVE</div>
        <div style={{ position: "relative", height: 150 }}>
          <div style={{ position: "absolute", inset: 0, fontSize: 130, fontWeight: 900, color: COL.dim, textDecoration: "line-through", textDecorationColor: RED, opacity: 1 - f, transform: `translateY(${-f * 40}px)` }}>{from}</div>
          <div style={{ position: "absolute", inset: 0, fontSize: 130, fontWeight: 900, color: GRN, opacity: f, transform: `translateY(${(1 - f) * 40}px)` }}>{to}</div>
        </div>
      </div>
    </div>
  );
};
