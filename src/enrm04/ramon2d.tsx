// Ramón the Mechanic · piezas propias de la serie (en-ramon-c, 25-oct): el MAPA de San Antonio con el lugar de la historia,
// el TANQUE en corte (click, sobrellenado → el carbón se moja, el calor lo agranda) y el CONTADOR de dólares/millas.
// Todo con at/out del plan (frases de la voz). Sin filtros ni grano. Copiar a src/<slug>/ y ajustar el import de lib.
import React from "react";
import { COL, FONT, e, extrude, spr } from "./lib";

const K = (k: number) => Math.min(1, k);
const pop = (t: number, at: number, out: number) => ({ k: K(spr(t, at, 0.9)), o: e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)) });

// lugares en un plano de 1000x1000 (centro = downtown); el 410 es el anillo de adentro, el 1604 el de afuera
export const LUGAR: Record<string, [number, number]> = {
  downtown: [500, 500], zarzamora: [462, 575], military: [470, 700], bandera: [365, 345], castroville: [380, 520],
  converse: [705, 330], leonvalley: [330, 385], fortsam: [548, 438], airport: [520, 300], pearl: [510, 462],
  hwy90: [300, 575], callaghan: [372, 560], i35sur: [470, 760], loop410: [640, 330], southside: [520, 680], westside: [430, 520],
};

export const MapaSA: React.FC<{ t: number; at: number; out: number; pins: { at: number; l: string; tx: string; col?: string }[]; route?: { at: number; from: string; to: string }; x?: number; y?: number; sc?: number; title?: string }> = ({ t, at, out, pins, route, x = 960, y = 540, sc = 1, title = "SAN ANTONIO, TX" }) => {
  const { k, o } = pop(t, at, out);
  if (o <= 0.01) return null;
  const draw = (a: number, d = 1.2) => K(e(t, a, a + d));
  const L = (n: string) => LUGAR[n] ?? LUGAR.downtown;
  const ring = (rx: number, ry: number, a: number) => <ellipse cx={500} cy={500} rx={rx} ry={ry} fill="none" stroke="#e8c37a" strokeWidth={10} strokeDasharray={2 * Math.PI * Math.max(rx, ry)} strokeDashoffset={(1 - draw(a)) * 2 * Math.PI * Math.max(rx, ry)} strokeLinecap="round" />;
  const hw = (x1: number, y1: number, x2: number, y2: number, a: number, w = 8) => { const len = Math.hypot(x2 - x1, y2 - y1); return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cfd6df" strokeWidth={w} strokeDasharray={len} strokeDashoffset={(1 - draw(a)) * len} strokeLinecap="round" />; };
  let rt: React.ReactNode = null;
  if (route && t >= route.at) {
    const [x1, y1] = L(route.from), [x2, y2] = L(route.to), q = K(e(t, route.at, route.at + 1.4)), mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 120;
    const len = 1.3 * Math.hypot(x2 - x1, y2 - y1) + 200;
    rt = <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke="#ff9f43" strokeWidth={9} strokeDasharray="22 14" strokeDashoffset={0} style={{ strokeDasharray: `${len * q} ${len}` }} strokeLinecap="round" />;
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${18 - 10 * k}deg) scale(${sc * (0.8 + 0.2 * k)})` }}>
      <div style={{ width: 900, height: 900, borderRadius: 30, background: "radial-gradient(circle at 50% 45%, #22303f, #121a24)", boxShadow: "0 50px 100px rgba(0,0,0,.6), inset 0 0 0 3px rgba(255,255,255,.08)", overflow: "hidden", position: "relative" }}>
        <svg viewBox="0 0 1000 1000" width={900} height={900} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 20 }).map((_, i) => <line key={"g" + i} x1={i * 50} y1={0} x2={i * 50} y2={1000} stroke="rgba(255,255,255,.04)" />)}
          {Array.from({ length: 20 }).map((_, i) => <line key={"h" + i} x1={0} y1={i * 50} x2={1000} y2={i * 50} stroke="rgba(255,255,255,.04)" />)}
          <path d="M420,0 C450,300 520,420 500,520 C480,640 560,800 600,1000" stroke="#3d6a8a" strokeWidth={6} fill="none" opacity={0.7} />
          {ring(390, 360, at + 0.1)}
          {ring(190, 175, at + 0.3)}
          {hw(800, 150, 230, 900, at + 0.5)}
          {hw(170, 200, 860, 830, at + 0.6)}
          {hw(500, 500, 60, 600, at + 0.7, 6)}
          <text x={835} y={185} fill="#cfd6df" fontSize={30} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>I-35</text>
          <text x={120} y={190} fill="#cfd6df" fontSize={30} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>I-10</text>
          <text x={60} y={585} fill="#cfd6df" fontSize={28} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>HWY 90</text>
          <text x={660} y={345} fill="#e8c37a" fontSize={28} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>410</text>
          <text x={870} y={500} fill="#e8c37a" fontSize={28} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>1604</text>
          {rt}
        </svg>
        {pins.filter((p) => t >= p.at).map((p, i) => {
          const [px, py] = L(p.l), q = K(spr(t, p.at, 1.1)), c = p.col ?? "#ff4a3d";
          return <div key={i} style={{ position: "absolute", left: px * 0.9, top: py * 0.9, transform: `translate(-50%,-100%) scale(${q})`, transformOrigin: "50% 100%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: COL.ink, background: "rgba(10,14,20,.85)", border: `3px solid ${c}`, borderRadius: 12, padding: "6px 14px", whiteSpace: "nowrap", marginBottom: 8 }}>{p.tx}</div>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: c, margin: "0 auto", boxShadow: `0 0 0 ${8 + 6 * Math.sin(t * 5)}px ${c}44` }} />
          </div>;
        })}
        <div style={{ position: "absolute", left: 30, top: 24, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#e8c37a", letterSpacing: 3 }}>{title}</div>
      </div>
    </div>
  );
};

// tanque en corte: se llena, CLICK, el sobrellenado sube por el venteo y moja el carbón; el calor lo agranda
export const Tanque: React.FC<{ t: number; at: number; out: number; clickAt?: number; topAt?: number; heatAt?: number; lowAt?: number; x?: number; y?: number; sc?: number; note?: string }> = ({ t, at, out, clickAt = 1e9, topAt = 1e9, heatAt = 1e9, lowAt = 1e9, x = 960, y = 560, sc = 1, note }) => {
  const { k, o } = pop(t, at, out);
  if (o <= 0.01) return null;
  const fill = t < lowAt ? Math.min(0.82, 0.25 + 0.57 * K(e(t, at + 0.2, Math.min(clickAt, at + 3.5)))) : 0.08;
  const top = K(e(t, topAt, topAt + 2.2)), heat = K(e(t, heatAt, heatAt + 2.5));
  const lvl = fill + 0.13 * top + 0.05 * heat;
  const wet = K(e(t, topAt + 1.4, topAt + 3.2));
  const click = t >= clickAt && t < clickAt + 0.7;
  const W = 640, H = 300;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * (0.85 + 0.15 * k)})` }}>
      <svg width={1000} height={520} viewBox="0 0 1000 520">
        <rect x={60} y={170} width={W} height={H} rx={60} fill="#1b2430" stroke="#9aa7b4" strokeWidth={8} />
        <clipPath id="tq"><rect x={64} y={174} width={W - 8} height={H - 8} rx={56} /></clipPath>
        <g clipPath="url(#tq)">
          <rect x={60} y={170 + H * (1 - lvl)} width={W} height={H * lvl + 10} fill={heat > 0.05 ? "#e6a23c" : "#d9b44a"} opacity={0.9} />
          <path d={`M60,${170 + H * (1 - lvl)} q80,${-10 * Math.sin(t * 3)} 160,0 t160,0 t160,0 t160,0`} stroke="#fff3c4" strokeWidth={4} fill="none" opacity={0.7} />
          {heat > 0.05 && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${120 + i * 100},${170 + H * (1 - lvl) - 10} q10,-20 0,-40 t0,-40`} stroke="#ff7a45" strokeWidth={5} fill="none" opacity={heat * (0.4 + 0.3 * Math.sin(t * 4 + i))} />)}
        </g>
        <path d="M640,190 L760,60 L800,60" stroke="#9aa7b4" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M640,190 L760,60" stroke={top > 0.3 ? "#d9b44a" : "#2a3644"} strokeWidth={12} fill="none" strokeDasharray={200} strokeDashoffset={200 * (1 - top)} />
        <path d="M380,170 L380,110 L860,110 L860,250" stroke="#7d8a97" strokeWidth={10} fill="none" />
        <rect x={800} y={250} width={140} height={190} rx={14} fill="#11161d" stroke="#9aa7b4" strokeWidth={6} />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={820 + (i % 8) * 14} cy={275 + Math.floor(i / 8) * 32} r={6} fill={wet > 0 && i > 40 - wet * 40 ? "#c9a23a" : "#2c2c2c"} />)}
        <text x={870} y={475} textAnchor="middle" fill={COL.ink} fontSize={26} fontFamily={FONT} fontWeight={800}>CHARCOAL</text>
        <text x={370} y={505} textAnchor="middle" fill={COL.ink} fontSize={30} fontFamily={FONT} fontWeight={800}>{lvl > 0.9 ? "NO ROOM LEFT" : t >= lowAt ? "PUMP IN THE VAPOR" : "ROOM FOR HEAT + VAPOR"}</text>
        {t >= lowAt && <g><rect x={300} y={400} width={60} height={60} rx={8} fill="#5a6775" /><text x={330} y={392} textAnchor="middle" fill="#ff9f43" fontSize={24} fontFamily={FONT} fontWeight={900}>PUMP</text></g>}
      </svg>
      {click && <div style={{ position: "absolute", left: 700, top: 0, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), transform: `scale(${1 + 0.3 * (1 - (t - clickAt) / 0.7)}) rotate(-8deg)` }}>CLICK!</div>}
      {note && <div style={{ position: "absolute", left: 60, top: 0, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.ink, textShadow: extrude(4, "#1c2a3a") }}>{note}</div>}
    </div>
  );
};

// contador que corre (dólares, millas, grados): de "from" a "to" en dur s
export const Contador: React.FC<{ t: number; at: number; out: number; from: number; to: number; dur?: number; pre?: string; suf?: string; sub?: string; x?: number; y?: number; size?: number; col?: string; edge?: string }> = ({ t, at, out, from, to, dur = 1.6, pre = "", suf = "", sub, x = 960, y = 470, size = 180, col = "#ffd60a", edge = "#5a4500" }) => {
  const { k, o } = pop(t, at, out);
  if (o <= 0.01) return null;
  const v = from + (to - from) * K(e(t, at + 0.1, at + 0.1 + dur));
  const txt = pre + Math.round(v).toLocaleString("en-US") + suf;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, textShadow: extrude(Math.round(size / 14), edge), whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{txt}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.28, color: COL.ink, textShadow: extrude(3, "#1c2a3a"), marginTop: 10 }}>{sub}</div>}
    </div>
  );
};
