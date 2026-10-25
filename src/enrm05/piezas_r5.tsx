// Ramón the Mechanic · piezas propias de rm05 «6 Rules That Took This Truck Past 300,000 Miles» (en-ramon-b, 25-oct).
// La firma es la LIBRETA de Kowalski: cada dato del video se escribe a lápiz en una hoja rayada (fecha · millas · qué · cuánto).
// Además: las dos tablas del manual (normal vs severe), la tapa del radiador que sube el punto de ebullición, la vida del fluido
// de la caja que se parte a la mitad cada 20 °F, la comparación de plata de 21 años y la presión de la cubierta con el calor.
// Todo con at/out de la voz (plan_enrm05.py). Sin filtros ni grano.
import React from "react";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const K = (k: number) => Math.min(1.04, k);
const vis = (t: number, at: number, out: number, fi = 0.25, fo = 0.35) => e(t, at, at + fi) * (1 - e(t, out, out + fo));
const card: React.CSSProperties = { background: "linear-gradient(180deg, rgba(20,26,34,.94), rgba(10,13,18,.94))", border: "1.5px solid rgba(255,255,255,.09)", borderRadius: 26, boxShadow: "0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)" };
const AMB = "#ffb257", RED = "#ff4a3d", GRN = "#3fd17a", ICE = "#8fd6ff";
const PEN = "#1f3d8a", PAPER = "#f3ecd9";
const HAND = "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- 1. la libreta verde de Kowalski: renglones que se escriben a lápiz ----------
type Row = { at: number; date: string; mi: string; what: string; cost?: string; col?: string };
export const Notebook: React.FC<{ t: number; at: number; out: number; rows: Row[]; title?: string; x?: number; y?: number; rot?: number }> = ({ t, at, out, rows, title = "F-150 · 2004", x = 1330, y = 540, rot = -3 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.7));
  return (
    <div style={{ position: "absolute", left: x - 400, top: y - 330, width: 800, opacity: o, transform: `rotate(${rot}deg) translateY(${(1 - k) * 120}px) scale(${0.92 + 0.08 * k})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "relative", height: 660, borderRadius: "10px 22px 22px 10px", background: PAPER, boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 60px rgba(120,90,40,.18)", overflow: "hidden",
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0 63px, rgba(70,110,170,.35) 63px 65px)`, backgroundPosition: "0 108px" }}>
        <div style={{ position: "absolute", left: 92, top: 0, bottom: 0, width: 3, background: "rgba(210,70,70,.55)" }} />
        {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", left: 22, top: 40 + i * 58, width: 30, height: 30, borderRadius: 15, background: "radial-gradient(circle at 40% 40%, #3a3a3a, #0d0d0d)", boxShadow: "inset 0 2px 3px rgba(0,0,0,.7)" }} />)}
        <div style={{ position: "absolute", left: 120, top: 34, fontFamily: HAND, fontSize: 44, color: PEN, fontWeight: 700 }}>{title}</div>
        {rows.map((r, i) => {
          const w = e(t, r.at, r.at + 0.9), on = t >= r.at - 0.05;
          const line = `${r.date} · ${r.mi}  ${r.what}${r.cost ? " · " + r.cost : ""}`;
          return (
            <div key={i} style={{ position: "absolute", left: 120, top: 118 + i * 65, width: 650, height: 60, overflow: "hidden", opacity: on ? 1 : 0 }}>
              <div style={{ width: `${w * 100}%`, overflow: "hidden", whiteSpace: "nowrap", fontFamily: HAND, fontSize: 36, lineHeight: "60px", color: r.col ?? PEN }}>{line}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(255,255,255,.10), transparent 40%, rgba(0,0,0,.08))" }} />
      </div>
    </div>
  );
};

// ---------- 2. las dos tablas del manual: NORMAL (la que todos siguen) vs SEVERE (la que vivimos) ----------
export const Schedules: React.FC<{ t: number; at: number; out: number; items: { at: number; tx: string }[]; pickAt: number; x?: number; y?: number }> = ({ t, at, out, items, pickAt, x = 960, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.7)), pk = ei(t, pickAt, pickAt + 0.6);
  const col = (left: boolean) => {
    const lit = left ? 1 - 0.55 * pk : 0.6 + 0.4 * pk;
    return (
      <div style={{ ...card, width: 700, padding: "34px 38px", opacity: lit, transform: `scale(${left ? 1 - 0.06 * pk : 1 + 0.05 * pk})`, border: !left && pk > 0.5 ? `3px solid ${RED}` : card.border }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6, color: COL.dim }}>MAINTENANCE SCHEDULE</div>
        <div style={{ fontSize: 86, fontWeight: 900, color: left ? COL.ink : RED, marginTop: 6, textShadow: extrude(5, left ? "#333" : "#5c140e") }}>{left ? "NORMAL" : "SEVERE"}</div>
        {left ? <div style={{ fontSize: 34, fontWeight: 700, color: COL.dim, marginTop: 20, lineHeight: 1.5 }}>Oil: the bigger number<br />Mild weather<br />Highway miles</div> :
          items.map((it, i) => { const q = e(t, it.at, it.at + 0.35); return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, opacity: 0.25 + 0.75 * q, transform: `translateX(${(1 - q) * 30}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, border: `3px solid ${q > 0.5 ? RED : "rgba(255,255,255,.3)"}`, color: RED, fontSize: 32, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{q > 0.5 ? "✓" : ""}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: COL.ink }}>{it.tx}</div>
            </div>); })}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: x - 760, top: y - 330, width: 1520, display: "flex", gap: 120, opacity: o, fontFamily: FONT, transform: `translateY(${(1 - k) * 80}px)` }}>
      {col(true)}{col(false)}
    </div>
  );
};

// ---------- 3. la tapa del radiador: cada libra sube el punto de ebullición ~3 °F (212 → ~260) ----------
export const BoilPoint: React.FC<{ t: number; at: number; out: number; capAt: number; weakAt: number; x?: number; y?: number }> = ({ t, at, out, capAt, weakAt, x = 1340, y = 540 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const up = ei(t, capAt, capAt + 2.2), weak = ei(t, weakAt, weakAt + 1.6);
  const psi = 16 * up * (1 - 0.6 * weak), bp = 212 + psi * 3;
  const H = 520, frac = (bp - 200) / 80;
  return (
    <div style={{ position: "absolute", left: x - 320, top: y - 330, width: 640, opacity: o, fontFamily: FONT, transform: `scale(${0.9 + 0.1 * K(spr(t, at))})` }}>
      <div style={{ ...card, padding: "30px 34px", display: "flex", gap: 40, alignItems: "flex-end" }}>
        <div style={{ position: "relative", width: 80, height: H, borderRadius: 40, background: "rgba(255,255,255,.07)", border: "2px solid rgba(255,255,255,.15)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: H * frac, background: `linear-gradient(0deg, ${RED}, ${weak > 0.3 ? "#ff8a3d" : AMB})`, boxShadow: `0 0 30px ${RED}` }} />
          {[212, 260].map((v) => <div key={v} style={{ position: "absolute", left: 0, right: 0, bottom: H * (v - 200) / 80, height: 3, background: "#fff", opacity: 0.6 }} />)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 5, color: COL.dim }}>COOLANT BOILS AT</div>
          <div style={{ fontSize: 140, fontWeight: 900, color: COL.ink, lineHeight: 1, textShadow: extrude(8, "#5c140e") }}>{Math.round(bp)}°F</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: weak > 0.3 ? RED : AMB, marginTop: 18 }}>{weak > 0.3 ? "WEAK CAP → BOILS EARLY" : `${Math.round(psi)} PSI CAP`}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: COL.dim, marginTop: 10 }}>+1 psi ≈ +3°F</div>
        </div>
      </div>
    </div>
  );
};

// ---------- 4. la vida del fluido de la caja: se parte a la mitad cada 20 °F arriba de ~175 ----------
export const HalfLife: React.FC<{ t: number; at: number; out: number; hotAt: number; x?: number; y?: number }> = ({ t, at, out, hotAt, x = 1300, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const steps = [175, 195, 215, 235];
  const cols = ["#d8263a", "#b33b2a", "#6e3a1e", "#241812"];
  return (
    <div style={{ position: "absolute", left: x - 520, top: y - 300, width: 1040, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, padding: "30px 40px" }}>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 5, color: AMB }}>TRANSMISSION FLUID LIFE</div>
        <div style={{ display: "flex", gap: 28, marginTop: 26, alignItems: "flex-end", height: 380 }}>
          {steps.map((v, i) => {
            const a = at + 0.4 + i * 0.7, q = ei(t, a, a + 0.5), life = 100 / Math.pow(2, i), hot = i >= 2 && t >= hotAt;
            return (
              <div key={v} style={{ flex: 1, textAlign: "center", opacity: 0.2 + 0.8 * q }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: hot ? RED : COL.ink }}>{life}%</div>
                <div style={{ height: 260 * (life / 100) * q, background: `linear-gradient(0deg, ${cols[i]}, ${cols[i]}cc)`, borderRadius: 14, marginTop: 10, boxShadow: hot ? `0 0 30px ${RED}` : "none" }} />
                <div style={{ fontSize: 38, fontWeight: 900, color: hot ? RED : COL.dim, marginTop: 12 }}>{v}°F</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: COL.dim, marginTop: 16 }}>every +20°F → half the life</div>
      </div>
    </div>
  );
};

// ---------- 5. la plata de 21 años: mantener el viejo vs las cuotas del nuevo ----------
export const MoneyBars: React.FC<{ t: number; at: number; out: number; newAt: number; x?: number; y?: number }> = ({ t, at, out, newAt, x = 960, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const a = ei(t, at + 0.3, at + 2.0), b = ei(t, newAt, newAt + 2.4);
  const bar = (v: number, max: number, k: number, col: string, label: string, sub: string) => (
    <div style={{ marginTop: 34 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: COL.ink }}>{label}</div>
        <div style={{ fontSize: 76, fontWeight: 900, color: col, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>${Math.round(v * k).toLocaleString("en-US")}</div>
      </div>
      <div style={{ height: 70, background: "rgba(255,255,255,.07)", borderRadius: 16, marginTop: 10, overflow: "hidden" }}>
        <div style={{ width: `${(v / max) * 100 * k}%`, height: "100%", background: `linear-gradient(90deg, ${col}aa, ${col})`, borderRadius: 16 }} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: COL.dim, marginTop: 8 }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x - 760, top: y - 300, width: 1520, opacity: o, fontFamily: FONT }}>
      <div style={{ ...card, padding: "34px 50px 40px" }}>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 6, color: AMB }}>21 YEARS · MARTA'S CALCULATOR</div>
        {bar(20000, 50400, a, GRN, "Keeping the 2004 alive", "every oil change, tire, brake job, radiator, water pump…")}
        {t >= newAt - 0.1 && bar(50400, 50400, b, RED, "A new truck", "$700 × 72 months · payments only")}
      </div>
    </div>
  );
};

// ---------- 6. la presión de la cubierta sube ~1 psi cada 10 °F ----------
export const TireTemp: React.FC<{ t: number; at: number; out: number; hotAt: number; x?: number; y?: number }> = ({ t, at, out, hotAt, x = 1380, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const h = ei(t, hotAt, hotAt + 2.0), temp = lerp(60, 100, h), psi = lerp(35, 39, h);
  const ang = -120 + (psi - 25) / 20 * 240;
  return (
    <div style={{ position: "absolute", left: x - 330, top: y - 300, width: 660, opacity: o, fontFamily: FONT, transform: `scale(${0.9 + 0.1 * K(spr(t, at))})` }}>
      <div style={{ ...card, padding: "30px 30px 36px", textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 5, color: COL.dim }}>SAME TIRE · {Math.round(temp)}°F OUTSIDE</div>
        <div style={{ position: "relative", width: 380, height: 380, margin: "20px auto 0", borderRadius: 190, background: "radial-gradient(circle, #1d242e 55%, #0c1016)", border: "10px solid #2a313b" }}>
          {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", left: 186, top: 14, width: 8, height: 34, background: i > 7 ? RED : COL.dim, transformOrigin: "4px 176px", transform: `rotate(${-120 + i * 24}deg)` }} />)}
          <div style={{ position: "absolute", left: 184, top: 40, width: 12, height: 150, borderRadius: 6, background: h > 0.5 ? RED : AMB, transformOrigin: "6px 150px", transform: `rotate(${ang}deg)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, fontSize: 86, fontWeight: 900, color: COL.ink }}>{psi.toFixed(0)}<span style={{ fontSize: 40 }}> psi</span></div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: h > 0.5 ? RED : ICE, marginTop: 20 }}>{h > 0.5 ? "+1 psi every +10°F" : "set it cold · morning"}</div>
      </div>
    </div>
  );
};
