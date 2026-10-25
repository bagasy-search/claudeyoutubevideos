// Enzo · piezas 2.5D propias del canal (encima del mundo, de las tomas y del avatar): la tira de meses de la factura, la hoja
// (factura / reporte / presupuesto) con los renglones que se tachan, el mapa de Chicago con el barrio y el año de la historia,
// el contador de dólares, la ficha de la persona, el medidor de vatios (1.500 W contra el tope del circuito), la comparación de
// facturas (gas vs luz) y la nota escrita a mano (el reverso del reporte, la cinta del termostato).
import React from "react";
import { Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

const fadeIO = (t: number, at: number, out: number, fi = 0.25, fo = 0.3) => e(t, at - fi, at) * (1 - e(t, out, out + fo));
const HANDF = "'Segoe Print','Bradley Hand','Marker Felt','Comic Sans MS',cursive";
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

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

// mapa de Chicago (grilla de calles en perspectiva, el lago al este, los barrios) con el pin de la historia
const HOODS: Record<string, [number, number]> = { AVONDALE: [560, 380], MONTCLARE: [300, 420], "NORWOOD PARK": [260, 230], "JEFFERSON PARK": [340, 260], AUSTIN: [330, 540], "OAK PARK": [230, 560], CICERO: [300, 680], SKOKIE: [470, 70], SCHAUMBURG: [40, 200], "O'HARE": [130, 250], "HARLEM AVE": [250, 380], "GRAND AVE": [520, 470], "THE LOOP": [780, 560], "ELMWOOD PARK": [200, 400], "WEST SIDE": [480, 580], NORRIDGE: [170, 300], "HARWOOD HEIGHTS": [205, 262], BERWYN: [250, 640] };
export const ChicagoMap: React.FC<{ t: number; at: number; out: number; pins: { at: number; k: string; sub?: string }[] }> = ({ t, at, out, pins }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 0.8), last = pins.filter((p) => t >= p.at).pop();
  const fx = last ? HOODS[last.k]?.[0] ?? 480 : 480, fy = last ? HOODS[last.k]?.[1] ?? 420 : 420;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1500, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 520, top: 540 - 470, width: 1040, height: 940, transformOrigin: `${fx}px ${fy}px`, transform: `rotateX(${48 - 10 * k}deg) rotateZ(${-6 + 4 * k}deg) scale(${0.9 + 0.25 * k}) translateZ(${-200 + 200 * k}px)`, borderRadius: 30,
        background: "linear-gradient(160deg,#eef0f2,#d8dde2)", boxShadow: "0 80px 160px rgba(0,0,0,.75)", overflow: "hidden" }}>
        <svg width={1040} height={940} style={{ position: "absolute", inset: 0 }}>
          <path d="M860 0 C 850 180, 880 320, 850 470 C 830 600, 880 760, 900 940 L 1040 940 L 1040 0 Z" fill="#8fb8d4" />
          {Array.from({ length: 14 }, (_, i) => <line key={"h" + i} x1={0} y1={40 + i * 66} x2={860} y2={40 + i * 66} stroke="#b9c0c8" strokeWidth={i % 4 === 0 ? 7 : 3} />)}
          {Array.from({ length: 13 }, (_, i) => <line key={"v" + i} x1={30 + i * 64} y1={0} x2={30 + i * 64} y2={940} stroke="#b9c0c8" strokeWidth={i % 4 === 1 ? 7 : 3} />)}
          <path d="M780 560 L 0 300" stroke="#d6a74a" strokeWidth={9} opacity={0.7} />
          <path d="M780 560 L 0 560" stroke="#d6a74a" strokeWidth={9} opacity={0.7} />
          <path d="M780 560 L 120 0" stroke="#d6a74a" strokeWidth={9} opacity={0.7} />
          {Object.entries(HOODS).map(([n, [x, y]]) => <text key={n} x={x} y={y + 44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} letterSpacing={2} fill="#5d6670">{n}</text>)}
          <text x={950} y={460} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} letterSpacing={4} fill="#4d7590" transform="rotate(90 950 460)">LAKE MICHIGAN</text>
          {pins.filter((p) => t >= p.at).map((p, i) => { const [x, y] = HOODS[p.k] ?? [480, 420], q = Math.min(1.15, spr(t, p.at)); return <g key={i} transform={`translate(${x} ${y}) scale(${q})`}>
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

// medidor de vatios: aguja que sube hasta "watts" contra el tope del circuito (max); pasada la raya roja = peligro
export const WattMeter: React.FC<{ t: number; at: number; out: number; watts: number; max?: number; label?: string; x?: number; y?: number }> = ({ t, at, out, watts, max = 1800, label, x = 1400, y = 560 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.8)), v = watts * ei(t, at + 0.2, at + 1.6), top = max * 1.4;
  const ang = -120 + 240 * Math.min(1, v / top), lim = -120 + 240 * (max / top), over = v > max;
  const pt = (a: number, r: number) => `${Math.sin((a * Math.PI) / 180) * r} ${-Math.cos((a * Math.PI) / 180) * r}`;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)})`, opacity: o }}>
      <svg width={560} height={460} viewBox="-280 -260 560 460">
        <circle r={240} fill="#14181f" stroke="#c9ced4" strokeWidth={14} />
        {Array.from({ length: 25 }, (_, i) => { const a = -120 + i * 10; return <path key={i} d={`M ${pt(a, 200)} L ${pt(a, i % 5 ? 182 : 168)}`} stroke={a > lim ? COL.red : "#dfe3e8"} strokeWidth={i % 5 ? 3 : 6} />; })}
        <path d={`M ${pt(lim, 212)} A 212 212 0 0 1 ${pt(120, 212)}`} fill="none" stroke={COL.red} strokeWidth={16} opacity={0.8} />
        <g transform={`rotate(${ang})`}><line x1={0} y1={20} x2={0} y2={-190} stroke={over ? COL.red : COL.amber} strokeWidth={9} strokeLinecap="round" /></g>
        <circle r={22} fill="#2a2f37" stroke="#dfe3e8" strokeWidth={4} />
        <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill={over ? COL.red : COL.ink}>{Math.round(v).toLocaleString("en-US")} W</text>
        {label && <text y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} letterSpacing={4} fill={COL.dim}>{label}</text>}
      </svg>
    </div>
  );
};

// comparación de facturas: barras que crecen con su monto; la mala queda en rojo
export const BillBars: React.FC<{ t: number; at: number; out: number; bars: { at: number; l: string; v: number; bad?: boolean }[]; title?: string; x?: number; y?: number }> = ({ t, at, out, bars, title, x = 960, y = 560 }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const mx = Math.max(...bars.map((b) => b.v));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, perspective: 1400, textAlign: "center" }}>
      {title && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, letterSpacing: 5, color: COL.ink, textShadow: extrude(6, "#000"), marginBottom: 30 }}>{title}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 70, height: 560, transform: "rotateX(10deg) rotateY(-10deg)" }}>
        {bars.map((b, i) => { const q = ei(t, b.at, b.at + 1.0), h = 420 * (b.v / mx) * q; return <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: e(t, b.at - 0.2, b.at) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: b.bad ? COL.red : "#8ff0b5", textShadow: extrude(6, "#000"), marginBottom: 10 }}>${Math.round(b.v * q)}</div>
          <div style={{ width: 210, height: h, borderRadius: "14px 14px 0 0", background: b.bad ? "linear-gradient(180deg,#ff6b5e,#9e1c14)" : "linear-gradient(180deg,#59e08f,#1f7a45)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.3)" }} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: COL.ink, marginTop: 16, textShadow: extrude(3, "#000") }}>{b.l}</div>
        </div>; })}
      </div>
    </div>
  );
};

// nota a mano: un papel que entra girado y se escribe letra por letra
export const HandNote: React.FC<{ t: number; at: number; out: number; lines: string[]; x?: number; y?: number; paper?: string; rot?: number; size?: number; ink?: string }> = ({ t, at, out, lines, x = 960, y = 540, paper = "#f6f1e3", rot = -3, size = 58, ink = "#1a2a6a" }) => {
  const o = fadeIO(t, at, out); if (o <= 0.01) return null;
  const tot = lines.reduce((s, l) => s + l.length + 1, 0);
  const k = Math.min(1.05, spr(t, at, 0.8)), n = Math.round(tot * e(t, at + 0.3, at + 0.3 + tot * 0.045));
  let left = n;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, perspective: 1300 }}>
      <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 60}deg) rotateZ(${rot}deg) scale(${0.75 + 0.25 * Math.min(1, k)})`, background: paper, padding: "40px 56px", borderRadius: 4, boxShadow: "0 50px 100px rgba(0,0,0,.65), inset 0 0 40px rgba(120,90,30,.15)", minWidth: 640 }}>
        {lines.map((l, i) => { const s = l.slice(0, Math.max(0, left)); left -= l.length + 1; return <div key={i} style={{ fontFamily: HANDF, fontWeight: 700, fontSize: size, color: ink, lineHeight: 1.3, minHeight: size * 1.3, whiteSpace: "nowrap" }}>{s}</div>; })}
      </div>
    </div>
  );
};

// EL CTA de la guía: los 3 libros parados en abanico (con lomo), el elegido se adelanta y de él sale la PÁGINA REAL grande;
// después el QR grande a la derecha (se lee con la cámara; nunca la URL escrita en pantalla)
const BOOKS: [string, string][] = [["g_sign", "#b8402a"], ["g_fix", "#1f5f8b"], ["g_bill", "#2f7a4a"]];
export const GuideBooks: React.FC<{ t: number; at: number; out: number; hl?: number; page?: string; pageAt?: number; qrAt?: number }> = ({ t, at, out, hl = 1, page, pageAt = 1e9, qrAt = 1e9 }) => {
  const o = fadeIO(t, at, out, 0.3, 0.4); if (o <= 0.01) return null;
  const pg = page ? ei(t, pageAt, pageAt + 0.9) : 0, qr = Math.min(1.05, spr(t, qrAt, 0.8)), qo = e(t, qrAt, qrAt + 0.25);
  const shift = -260 * e(t, qrAt, qrAt + 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1800 }}>
      <div style={{ position: "absolute", left: 640 + shift, top: 560, transformStyle: "preserve-3d", transform: `translate(-50%,-50%) rotateX(8deg) rotateY(${-18 + 10 * pg}deg)` }}>
        {BOOKS.map(([img, sp], i) => {
          const k = Math.min(1.06, spr(t, at + 0.12 * i, 0.8)), sel = i === hl, fw = sel ? e(t, at + 0.8, at + 1.3) : 0;
          const x = (i - 1) * 250, rz = (i - 1) * -4;
          return <div key={i} style={{ position: "absolute", left: x - 150, top: -225, width: 300, height: 450, transformStyle: "preserve-3d",
            transform: `translateY(${(1 - Math.min(1, k)) * 500 - 40 * fw}px) translateZ(${120 * fw - 60 * pg * (sel ? 0 : 1)}px) rotateZ(${rz}deg) rotateY(${(1 - Math.min(1, k)) * -90}deg)`, opacity: (sel ? 1 : 1 - 0.55 * pg) * e(t, at + 0.12 * i - 0.1, at + 0.12 * i + 0.15) }}>
            <Img src={staticFile(P + img + ".jpg")} style={{ position: "absolute", inset: 0, width: 300, height: 450, borderRadius: "2px 8px 8px 2px", boxShadow: `0 40px 80px rgba(0,0,0,.65), 0 0 ${sel ? 60 * fw : 0}px rgba(255,190,90,.55)` }} />
            <div style={{ position: "absolute", left: -28, top: 0, width: 28, height: 450, background: `linear-gradient(90deg, ${sp}, #111)`, transform: "rotateY(-90deg)", transformOrigin: "100% 50%" }} />
          </div>;
        })}
      </div>
      {page && pg > 0.01 && <div style={{ position: "absolute", left: 960 + shift * 1.1, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - pg) * 260}px) rotateX(${(1 - pg) * 50}deg) rotateZ(${-2 * pg}deg) scale(${0.35 + 0.65 * pg})`, opacity: pg }}>
        <Img src={staticFile(P + page + ".jpg")} style={{ height: 980, borderRadius: 6, boxShadow: "0 70px 140px rgba(0,0,0,.75)" }} />
      </div>}
      {qo > 0.01 && <div style={{ position: "absolute", left: 1530, top: 540, opacity: qo, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - Math.min(1, qr)) * -70 - 6}deg) scale(${0.7 + 0.3 * Math.min(1, qr)})`,
        background: "linear-gradient(180deg, rgba(22,30,44,.97), rgba(10,15,24,.97))", borderRadius: 26, padding: "30px 34px", textAlign: "center", fontFamily: FONT, boxShadow: "0 50px 100px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.15)" }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: COL.amber, letterSpacing: 2 }}>DON'T BUY THAT FURNACE</div>
        <div style={{ fontWeight: 800, fontSize: 26, color: COL.dim, marginBottom: 16, letterSpacing: 2 }}>3 BOOKS BY ENZO</div>
        <div style={{ background: "#fff", borderRadius: 18, padding: 16, display: "inline-block" }}><Img src={staticFile(P + "qr.png")} style={{ width: 420, height: 420, display: "block" }} /></div>
        <div style={{ fontWeight: 900, fontSize: 34, color: "#fff", marginTop: 16 }}>📱 SCAN WITH YOUR PHONE CAMERA</div>
        <div style={{ fontWeight: 700, fontSize: 26, color: COL.dim, marginTop: 6 }}>or the link in the 1st line of the description</div>
      </div>}
    </div>
  );
};
