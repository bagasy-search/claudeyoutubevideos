// Héctor · piezas 2.5D propias del canal (encima del mundo, de las tomas y del avatar): el four-square de Abe en el bloc
// amarillo, la tira de los 12 meses (malos / buenos), la hoja del trato con los cargos que se tachan, el mapa de Miami con
// el lugar y el año de la historia, el contador de dólares, la escalera del bono y la ficha de la persona (lugar · año).
import React from "react";
import { Img as RImg, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

const fadeIO = (t: number, at: number, out: number, fi = 0.25, fo = 0.3) => e(t, at - fi, at) * (1 - e(t, out, out + fo));
const HANDF = "'Segoe Print','Bradley Hand','Marker Felt','Comic Sans MS',cursive";
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// four-square: el bloc amarillo inclinado, la cruz que se dibuja, cada casillero con su número a mano;
// hl = casillero que se marca (círculo rojo), x = casillero tachado
export const FourSquare: React.FC<{ t: number; at: number; out: number; vals: { at: number; v: string }[]; hl?: number; hlAt?: number; x?: number; xAt?: number; labels?: string[]; px?: number; py?: number }> =
  ({ t, at, out, vals, hl = -1, hlAt = 1e9, x = -1, xAt = 1e9, labels = ["PRICE", "TRADE", "DOWN", "MONTHLY"], px = 960, py = 560 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.8)), cr = e(t, at + 0.2, at + 0.7);
  const W = 760, H = 900;
  return (
    <div style={{ position: "absolute", left: px, top: py, opacity: o, perspective: 1600, transform: "translate(-50%,-50%)" }}>
      <div style={{ transform: `translateY(${(1 - Math.min(1, k)) * 300}px) rotateX(${18 + (1 - Math.min(1, k)) * 40}deg) rotateZ(-4deg) scale(${0.62 + 0.38 * Math.min(1, k)})`, width: W, height: H, borderRadius: 8, position: "relative",
        background: "repeating-linear-gradient(180deg, #fbe98a 0 41px, rgba(70,120,190,.45) 41px 43px)", boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 0 60px rgba(150,110,20,.25)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "linear-gradient(180deg,#9b2323,#7a1717)" }} />
        <div style={{ position: "absolute", left: 82, top: 0, bottom: 0, width: 3, background: "rgba(200,60,60,.55)" }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={W / 2} y1={110} x2={W / 2} y2={110 + (H - 150) * cr} stroke="#1b1f2a" strokeWidth={10} strokeLinecap="round" />
          <line x1={50} y1={H / 2 + 30} x2={50 + (W - 100) * e(t, at + 0.45, at + 0.95)} y2={H / 2 + 30} stroke="#1b1f2a" strokeWidth={10} strokeLinecap="round" />
        </svg>
        {labels.map((lab, i) => {
          const cx = i % 2 ? W * 0.75 : W * 0.25, cy = i < 2 ? 300 : 700, v = vals[i];
          const vo = v ? e(t, v.at, v.at + 0.35) : 0, n = v ? Math.round(v.v.length * e(t, v.at, v.at + 0.6)) : 0;
          return <div key={i} style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", textAlign: "center", width: W / 2 - 40 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 5, color: "#34405a", marginBottom: 18, opacity: e(t, at + 0.6 + i * 0.12, at + 0.9 + i * 0.12) }}>{lab}</div>
            <div style={{ fontFamily: HANDF, fontWeight: 700, fontSize: 92, color: "#14223f", opacity: vo, transform: `rotate(${-3 + i * 2}deg)`, whiteSpace: "nowrap" }}>{v ? v.v.slice(0, n) : ""}</div>
          </div>;
        })}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {hl >= 0 && (() => { const cx = hl % 2 ? W * 0.75 : W * 0.25, cy = (hl < 2 ? 300 : 700) + 30, L = 1100, q = e(t, hlAt, hlAt + 0.5);
            return <ellipse cx={cx} cy={cy} rx={170} ry={95} fill="none" stroke="#d81b1b" strokeWidth={11} strokeDasharray={L} strokeDashoffset={L * (1 - q)} transform={`rotate(-6 ${cx} ${cy})`} style={{ filter: "drop-shadow(0 0 8px rgba(216,27,27,.5))" }} />; })()}
          {x >= 0 && (() => { const cx = x % 2 ? W * 0.75 : W * 0.25, cy = (x < 2 ? 300 : 700) + 30, q = e(t, xAt, xAt + 0.3);
            return <line x1={cx - 150} y1={cy + 40} x2={cx - 150 + 300 * q} y2={cy + 40 - 80 * q} stroke="#d81b1b" strokeWidth={13} strokeLinecap="round" />; })()}
        </svg>
      </div>
    </div>
  );
};

// los 12 meses en fila: cada uno se tiñe (rojo = caro, verde = el bueno); pick = el que sube y brilla
export const MonthStrip: React.FC<{ t: number; at: number; out: number; marks: { at: number; m: number; c: "bad" | "good" | "best" }[]; title?: string; y?: number }> = ({ t, at, out, marks, title, y = 540 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const M = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", opacity: o, perspective: 1400 }}>
      {title && <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, letterSpacing: 6, color: COL.ink, textShadow: extrude(6, "#000"), marginBottom: 36, opacity: e(t, at, at + 0.3) }}>{title}</div>}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, transform: "rotateX(14deg)" }}>
        {M.map((m, i) => {
          const a = at + i * 0.05, k = Math.min(1.1, spr(t, a)); const mk = marks.filter((x) => x.m === i && t >= x.at).pop();
          const q = mk ? e(t, mk.at, mk.at + 0.3) : 0, best = mk?.c === "best";
          const bg = mk ? (mk.c === "bad" ? "#7a1a16" : "#145c34") : "#1a2433";
          return <div key={i} style={{ width: 128, height: 170, borderRadius: 16, background: bg, opacity: Math.min(1, k), transform: `translateY(${(1 - Math.min(1, k)) * 90 - (best ? 40 * q : 0)}px) scale(${best ? 1 + 0.18 * q : 1})`,
            boxShadow: `0 24px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2), 0 0 ${best ? 50 * q : 0}px ${best ? "#3fd17a" : "transparent"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, border: `3px solid ${mk ? (mk.c === "bad" ? COL.red : "#3fd17a") : "rgba(143,214,255,.3)"}` }}>
            <div style={{ fontWeight: 900, fontSize: 38, color: COL.ink, letterSpacing: 2 }}>{m}</div>
            <div style={{ fontWeight: 900, fontSize: 54, marginTop: 8, color: mk ? (mk.c === "bad" ? "#ff8a80" : "#8ff0b5") : "transparent", transform: `scale(${q})` }}>{mk ? (mk.c === "bad" ? "✗" : "✓") : "·"}</div>
          </div>;
        })}
      </div>
    </div>
  );
};

// hoja del trato (buyer's order): renglones que entran; los marcados "x" se tachan en rojo a su tiempo; total que cambia
export const DealSheet: React.FC<{ t: number; at: number; out: number; title?: string; rows: { at: number; item: string; v: number; xAt?: number }[]; totalAt?: number; px?: number; py?: number }> = ({ t, at, out, title = "BUYER'S ORDER", rows, totalAt = 1e9, px = 1300, py = 120 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const shown = rows.filter((r) => t >= r.at - 0.1);
  const tot = shown.reduce((s, r) => s + (r.xAt !== undefined && t >= r.xAt + 0.3 ? 0 : r.v), 0);
  return (
    <div style={{ position: "absolute", left: px, top: py, opacity: o, perspective: 1400, transform: `translateY(${(1 - e(t, at, at + 0.4)) * 60}px)` }}>
      <div style={{ transform: "rotateY(-14deg) rotateX(5deg) rotateZ(1.5deg)", width: 540, background: "linear-gradient(180deg,#fdfcf8,#f1eee5)", borderRadius: 6, boxShadow: "0 50px 100px rgba(0,0,0,.65)", padding: "30px 34px 26px", fontFamily: "'Courier New', monospace", color: "#1c1c1c" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, borderBottom: "3px solid #1c1c1c", paddingBottom: 10, marginBottom: 10 }}>{title}</div>
        {shown.map((r, i) => {
          const xq = r.xAt !== undefined ? e(t, r.xAt, r.xAt + 0.3) : 0;
          return <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, lineHeight: "56px", opacity: e(t, r.at, r.at + 0.2), color: xq > 0.5 ? "#8a8a8a" : "#1c1c1c" }}>
            <span>{r.item}</span><span>{money(r.v)}</span>
            {xq > 0 && <div style={{ position: "absolute", left: -6, top: 28, height: 6, width: `${xq * 104}%`, background: COL.red, borderRadius: 3, transform: "rotate(-1.5deg)", boxShadow: "0 0 10px rgba(255,74,61,.6)" }} />}
          </div>;
        })}
        {t >= totalAt && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 44, fontWeight: 900, borderTop: "3px solid #1c1c1c", marginTop: 12, paddingTop: 12, color: "#b3261e", transform: `scale(${Math.min(1.06, spr(t, totalAt))})`, transformOrigin: "100% 50%" }}>
          <span>TOTAL</span><span>{money(tot)}</span></div>}
      </div>
    </div>
  );
};

// mapa de Miami (calles en perspectiva, la costa, los barrios) con el pin de la historia
const HOODS: Record<string, [number, number]> = { "CORAL WAY": [560, 470], "BIRD ROAD": [520, 560], KENDALL: [400, 720], HIALEAH: [470, 210], WESTCHESTER: [380, 520], "CORAL GABLES": [600, 560], "MIAMI LAKES": [400, 120], DADELAND: [470, 690], "PALMETTO BAY": [520, 830], "KENDALL LAKES": [300, 760], DOWNTOWN: [760, 400], "MIAMI BEACH": [930, 360] };
export const MiamiMap: React.FC<{ t: number; at: number; out: number; pins: { at: number; k: string; sub?: string }[] }> = ({ t, at, out, pins }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 0.8), last = pins.filter((p) => t >= p.at).pop();
  const fx = last ? HOODS[last.k]?.[0] ?? 560 : 560, fy = last ? HOODS[last.k]?.[1] ?? 470 : 470;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1500, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 520, top: 540 - 470, width: 1040, height: 940, transformOrigin: `${fx}px ${fy}px`, transform: `rotateX(${48 - 10 * k}deg) rotateZ(${-8 + 4 * k}deg) scale(${0.9 + 0.25 * k}) translateZ(${-200 + 200 * k}px)`, borderRadius: 30,
        background: "linear-gradient(160deg,#e9e2d0,#d9d0bb)", boxShadow: "0 80px 160px rgba(0,0,0,.75)", overflow: "hidden" }}>
        <svg width={1040} height={940} style={{ position: "absolute", inset: 0 }}>
          <path d="M820 0 C 800 200, 860 330, 820 470 C 790 600, 700 780, 640 940 L 1040 940 L 1040 0 Z" fill="#7cc3e3" />
          <path d="M900 120 C 910 260, 950 380, 930 520 L 960 520 C 980 380, 945 250, 935 120 Z" fill="#efe6c8" />
          {Array.from({ length: 13 }, (_, i) => <line key={"h" + i} x1={0} y1={60 + i * 68} x2={800} y2={60 + i * 68} stroke="#c2b79c" strokeWidth={i % 4 === 0 ? 7 : 3} />)}
          {Array.from({ length: 12 }, (_, i) => <line key={"v" + i} x1={40 + i * 66} y1={0} x2={40 + i * 66} y2={940} stroke="#c2b79c" strokeWidth={i % 4 === 1 ? 7 : 3} />)}
          <path d="M120 0 L 860 940" stroke="#d6a74a" strokeWidth={9} opacity={0.7} />
          {Object.entries(HOODS).map(([n, [x, y]]) => <text key={n} x={x} y={y + 44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} letterSpacing={2} fill="#6c624d">{n}</text>)}
          {pins.filter((p) => t >= p.at).map((p, i) => { const [x, y] = HOODS[p.k] ?? [560, 470], q = Math.min(1.15, spr(t, p.at)); return <g key={i} transform={`translate(${x} ${y}) scale(${q})`}>
            <circle r={36 + 30 * e(t, p.at, p.at + 0.8)} fill="none" stroke={COL.red} strokeWidth={4} opacity={1 - e(t, p.at, p.at + 0.8)} />
            <path d="M0 0 C -26 -30, -26 -62, 0 -62 C 26 -62, 26 -30, 0 0 Z" fill={COL.red} stroke="#fff" strokeWidth={4} /><circle cy={-42} r={9} fill="#fff" /></g>; })}
        </svg>
      </div>
      {last && <div style={{ position: "absolute", left: 960, top: 150, transform: `translateX(-50%) scale(${Math.min(1.05, spr(t, last.at))})`, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 84, color: COL.ink, letterSpacing: 4, textShadow: extrude(8, "#000") }}>{last.k}</div>
        {last.sub && <div style={{ fontWeight: 800, fontSize: 38, color: COL.amber, letterSpacing: 6, textShadow: "0 3px 12px #000" }}>{last.sub}</div>}
      </div>}
    </div>
  );
};

// contador de dólares que corre (de → a), con rótulo y color de alarma si baja/sube mal
export const MoneyRoll: React.FC<{ t: number; at: number; out: number; from: number; to: number; label?: string; col?: string; x?: number; y?: number; size?: number; dur?: number; pre?: string; suf?: string }> = ({ t, at, out, from, to, label, col = COL.ink, x = 960, y = 520, size = 200, dur = 1.4, pre = "$", suf = "" }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.08, spr(t, at, 0.9)), v = from + (to - from) * ei(t, at + 0.15, at + 0.15 + dur);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o, textAlign: "center" }}>
      <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 70}deg) scale(${0.7 + 0.3 * Math.min(1, k)})`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: extrude(14, "#3a2a1a"), whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
        {v < -0.5 ? "−" : ""}{pre}{Math.abs(Math.round(v)).toLocaleString("en-US")}{suf}
      </div>
      {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.2, letterSpacing: 7, color: COL.dim, marginTop: 10, textShadow: extrude(4, "#000") }}>{label}</div>}
    </div>
  );
};

// escalera del bono (stair-step): escalones que se encienden con cada auto; el último paga el bono
export const StairStep: React.FC<{ t: number; at: number; out: number; steps: { at: number; n: string; bonus?: string }[]; x?: number; y?: number }> = ({ t, at, out, steps, x = 960, y = 600 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, perspective: 1400 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 18, transform: "rotateX(18deg) rotateY(-14deg)" }}>
        {steps.map((s, i) => {
          const q = e(t, s.at, s.at + 0.3), k = Math.min(1.08, spr(t, s.at)), last = i === steps.length - 1;
          return <div key={i} style={{ width: 170, height: 120 + i * 90, borderRadius: 14, background: q > 0.5 ? (last ? "linear-gradient(180deg,#ffd45a,#d99a12)" : "linear-gradient(180deg,#3fd17a,#1f8f4e)") : "linear-gradient(180deg,#2a3446,#1a2230)",
            boxShadow: `0 30px 60px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.25), 0 0 ${last ? 60 * q : 0}px rgba(255,200,60,.8)`, transform: `translateY(${(1 - Math.min(1, k)) * 60}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 16, fontFamily: FONT, opacity: e(t, at + i * 0.08, at + i * 0.08 + 0.2) }}>
            <div style={{ fontWeight: 900, fontSize: 52, color: COL.ink, textShadow: extrude(4, "#000") }}>{s.n}</div>
            {s.bonus && <div style={{ fontWeight: 900, fontSize: 30, color: q > 0.5 ? "#3a2400" : COL.dim, marginTop: 8, letterSpacing: 2 }}>{s.bonus}</div>}
          </div>;
        })}
      </div>
    </div>
  );
};

// ficha de la persona de la historia: nombre grande + lugar · año, con la placa que se desliza
export const PersonCard: React.FC<{ t: number; at: number; out: number; name: string; l2: string; x?: number; y?: number }> = ({ t, at, out, name, l2, x = 1420, y = 820 }) => {
  const o = fadeIO(t, at, out, 0.15, 0.3); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.85)), n2 = Math.round(l2.length * e(t, at + 0.35, at + 1.1));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", perspective: 1200, opacity: o }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70 - 8}deg)`, transformOrigin: "100% 50%", padding: "18px 34px 18px 30px", background: "linear-gradient(180deg, rgba(40,14,14,.94), rgba(20,8,8,.94))", borderRight: "10px solid #d9a441", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink, letterSpacing: 2, textShadow: extrude(5, "#000"), whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: "#e9c27a", letterSpacing: 5, minHeight: 36, whiteSpace: "nowrap" }}>{l2.slice(0, n2)}</div>
      </div>
    </div>
  );
};

// LA GUÍA (CTA): 1) las 5 tapas suben con el nombre · 2) el libro se abre en 3D sobre una página REAL del PDF ·
// 3) tarjeta con la página + QR grande a la URL corta (nunca la URL escrita en pantalla). tb/tc = segundos desde at.
export const GuideBook: React.FC<{ t: number; at: number; out: number; cover: string; page: string; pg: string; tb?: number; tc?: number }> =
  ({ t, at, out, cover, page, pg, tb = 6.5, tc = 17 }) => {
  const o = fadeIO(t, at, out, 0.3, 0.4); if (o <= 0.01) return null;
  const B = at + tb, C = at + tc;
  const a1 = e(t, at, at + 0.9) * (1 - e(t, B - 0.4, B + 0.2));
  const k1 = Math.min(1, spr(t, at, 0.7));
  const a2 = e(t, B - 0.2, B + 0.4) * (1 - e(t, C - 0.3, C + 0.3));
  const open = ei(t, B + 0.6, B + 2.6);                       // la tapa gira sobre el lomo y deja ver la página
  const zoom = 1 + 0.18 * ei(t, B + 2.6, C - 0.3);
  const a3 = e(t, C - 0.1, C + 0.5), k3 = Math.min(1, spr(t, C, 0.8));
  const img = (f: string) => staticFile(P + f);
  const Img = RImg;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(8,12,20,.55), rgba(4,6,10,.88))" }} />
      {a1 > 0.01 && <div style={{ position: "absolute", left: 960, top: 560, opacity: a1, transform: `translate(-50%,-50%) translateY(${(1 - k1) * 260}px) scale(${0.85 + 0.15 * k1})`, textAlign: "center" }}>
        <Img src={img("g_set.png")} style={{ width: 1180, display: "block", margin: "0 auto", filter: "drop-shadow(0 40px 50px rgba(0,0,0,.7))" }} />
        <div style={{ fontWeight: 900, fontSize: 64, color: "#fff", letterSpacing: 2, textShadow: extrude(6, "#7a5a12"), marginTop: -10, whiteSpace: "nowrap" }}>THE OTHER SIDE OF THE DESK</div>
        <div style={{ fontWeight: 800, fontSize: 38, color: COL.amber, letterSpacing: 4, marginTop: 8 }}>5 BOOKS · 427 PAGES · HECTOR'S SCRIPTS</div>
      </div>}
      {a2 > 0.01 && <div style={{ position: "absolute", left: 960, top: 540, opacity: a2, perspective: 2200, transform: `translate(-50%,-50%) scale(${zoom})` }}>
        <div style={{ position: "relative", width: 1240, height: 860, transformStyle: "preserve-3d", transform: "rotateX(14deg)" }}>
          <div style={{ position: "absolute", left: 640, top: 0, width: 600, height: 860, background: "#fbf8f1", boxShadow: "0 40px 70px rgba(0,0,0,.6)", borderRadius: "0 8px 8px 0", overflow: "hidden" }}>
            <Img src={img(page)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", left: 40, top: 0, width: 600, height: 860, background: "linear-gradient(90deg,#efe9dc,#fbf8f1 70%,#e6dfcf)", borderRadius: "8px 0 0 8px", opacity: open, boxShadow: "0 40px 70px rgba(0,0,0,.5)" }} />
          <div style={{ position: "absolute", left: 640, top: 0, width: 600, height: 860, transformOrigin: "0 50%", transform: `rotateY(${-178 * open}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "0 8px 8px 0", overflow: "hidden", boxShadow: "inset 10px 0 18px rgba(0,0,0,.35)" }}><Img src={img(cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(270deg,#efe9dc,#fbf8f1 70%,#e6dfcf)", borderRadius: "8px 0 0 8px" }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 940, top: 900, opacity: e(t, B + 2.4, B + 3), padding: "10px 26px", borderRadius: 14, background: COL.amber, color: "#1b1405", fontWeight: 900, fontSize: 36, whiteSpace: "nowrap", transform: "translateX(-50%)" }}>{pg}</div>
      </div>}
      {a3 > 0.01 && <div style={{ position: "absolute", left: 960, top: 540, opacity: a3, transform: `translate(-50%,-50%) perspective(1500px) rotateY(${(1 - k3) * -60}deg) scale(${0.8 + 0.2 * k3})`, display: "flex", gap: 46, alignItems: "center", padding: 36, borderRadius: 26, background: "linear-gradient(180deg, rgba(22,30,44,.97), rgba(10,15,24,.97))", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <Img src={img(page)} style={{ width: 420, height: 560, objectFit: "cover", borderRadius: 10, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
        <div style={{ width: 620, textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 46, color: COL.amber, letterSpacing: 1 }}>THE OTHER SIDE OF THE DESK</div>
          <div style={{ fontWeight: 800, fontSize: 30, color: "#b9c3d3", marginBottom: 18 }}>{pg}</div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 16, display: "inline-block" }}><Img src={img("qr.png")} style={{ width: 400, height: 400, display: "block" }} /></div>
          <div style={{ fontWeight: 900, fontSize: 38, color: "#fff", marginTop: 16 }}>📱 SCAN IT WITH YOUR PHONE CAMERA</div>
          <div style={{ fontWeight: 700, fontSize: 28, color: "#b9c3d3", marginTop: 8 }}>or the link in the first line of the description</div>
        </div>
      </div>}
    </div>
  );
};
