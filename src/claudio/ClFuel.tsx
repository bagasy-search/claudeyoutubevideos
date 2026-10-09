// Kit de la NAFTA (Claudio Old Mechanic ep. 7 "omfuel"), dentro del mundo (cama real + tarjeta):
//   ClMpgMath   la cuenta de la libreta: millas del parcial ÷ galones del surtidor = millas por galón reales (los números se
//               escriben a mano y el resultado cae con su sello) · miles, gallons, title
//   ClBillSplit las dos barras del mes de Doris: `before` (US$) vs `after`, y la diferencia partida en tercios de colores con su
//               rótulo (parts [{ label, share }]) · title
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

export const ClMpgMath: React.FC<{ miles?: number; gallons?: number; title?: string; bed?: string }> = ({ miles = 800, gallons = 36, title = "Your REAL miles per gallon", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const a = lin(f, 8, 22), b = lin(f, 20, 34), r = clamp01((f - 36) / 10);
  const mpg = miles / gallons;
  const shown = (mpg * ease(r)).toFixed(1);
  const row = (k: number, txt: string, sub: string, y: number) => (
    <div style={{ position: "absolute", left: 120, top: y, display: "flex", alignItems: "baseline", gap: 30, opacity: k }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 130, color: CL.ink, clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>{txt}</div>
      <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 44, letterSpacing: 3, color: CL.inkSoft }}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={991} dim={0.6} />
      <div style={{ position: "absolute", left: 360, top: 110, width: 1200, height: 860, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px) rotate(-1deg)` }}>
        <Card style={{ position: "absolute", inset: 0, background: "#FBF7EC", backgroundImage: `repeating-linear-gradient(180deg, transparent 0 79px, ${hexA("#5B8FD6", 0.3)} 79px 81px)` }}>
          <div style={{ position: "absolute", left: 120, top: 40, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.ink }}>{title}</div>
          {row(a, `${miles}`, "MILES on the trip odometer", 170)}
          <div style={{ position: "absolute", left: 90, top: 330, fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CL.nitrile, opacity: b }}>÷</div>
          {row(b, `${gallons}`, "GALLONS on the pump", 340)}
          <div style={{ position: "absolute", left: 120, top: 540, width: 900, height: 8, background: CL.ink, opacity: r, transform: `scaleX(${r})`, transformOrigin: "left" }} />
          <div style={{ position: "absolute", left: 120, top: 580, display: "flex", alignItems: "baseline", gap: 26, opacity: r }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CL.red }}>{shown}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 800, fontSize: 60, letterSpacing: 4, color: CL.red }}>MPG</div>
          </div>
        </Card>
      </div>
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};

export const ClBillSplit: React.FC<{ before?: number; after?: number; parts?: { label: string; share: number }[]; title?: string; bed?: string }> = ({ before = 160, after = 82, parts = [{ label: "Regular + cheaper station", share: 1 / 3 }, { label: "Car + driving", share: 1 / 3 }, { label: "Fewer miles", share: 1 / 3 }], title = "Doris's gas, one month", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const H = 560, base = 880, X1 = 520, X2 = 980, W = 300;
  const g1 = ease(clamp01((f - 8) / 16)), g2 = ease(clamp01((f - 22) / 16));
  const h1 = H * g1, h2 = H * (after / before) * g2;
  const split = clamp01((f - 40) / 14);
  const cols = [CL.red, CL.nitrile, CL.navy];
  const saved = before - after;
  let acc = 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={997} dim={0.6} />
      <div style={{ position: "absolute", left: 180, top: 90, width: 1560, height: 900, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 60, top: 36, fontFamily: SERIF, fontWeight: 900, fontSize: 62, color: CL.ink }}>{title}</div>
        </Card>
      </div>
      {/* barra ANTES */}
      <div style={{ position: "absolute", left: X1, top: base - h1, width: W, height: h1, borderRadius: "16px 16px 0 0", background: `linear-gradient(180deg, ${hexA(CL.inkSoft, 0.7)}, ${CL.inkSoft})` }} />
      <div style={{ position: "absolute", left: X1, width: W, top: base - h1 - 90, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: CL.ink, opacity: g1 }}>{`$${Math.round(before * g1)}`}</div>
      <div style={{ position: "absolute", left: X1, width: W, top: base + 20, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: CL.inkSoft }}>BEFORE</div>
      {/* barra DESPUÉS + lo ahorrado partido en tercios */}
      <div style={{ position: "absolute", left: X2, top: base - h2, width: W, height: h2, borderRadius: "16px 16px 0 0", background: `linear-gradient(180deg, ${hexA("#2E7D32", 0.7)}, #2E7D32)` }} />
      <div style={{ position: "absolute", left: X2, width: W, top: base - h2 - 90, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: "#2E7D32", opacity: g2 }}>{`$${Math.round(after * g2)}`}</div>
      <div style={{ position: "absolute", left: X2, width: W, top: base + 20, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: "#2E7D32" }}>AFTER</div>
      {parts.map((pt, i) => {
        const hh = H * (saved / before) * pt.share * split;
        const top = base - H * (after / before) - acc - hh; acc += hh;
        return (
          <React.Fragment key={pt.label}>
            <div style={{ position: "absolute", left: X2, top, width: W, height: hh, background: hexA(cols[i % 3], 0.85), border: `3px dashed rgba(255,255,255,0.8)`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: X2 + W + 30, top: top + hh / 2 - 30, fontFamily: HAND, fontWeight: 700, fontSize: 50, color: cols[i % 3], whiteSpace: "nowrap", opacity: split }}>{pt.label}</div>
          </React.Fragment>
        );
      })}
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};
