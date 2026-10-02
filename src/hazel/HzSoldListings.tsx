// HzSoldListings — la hoja de libreta de Hazel apoyada sobre la foto del objeto: renglones "vendido" tipeados de a uno
// (objeto · precio · cuándo) y al final el rango redondeado en rojo. Props: bed, title, rows[{item, price, when}], range.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE } from "./HzTheme";
import { HzBed, ease, useIn } from "./HzParts";

export type SoldRow = { item: string; price: string; when?: string };

export const HzSoldListings: React.FC<{ bed?: string; title?: string; rows: SoldRow[]; range?: string; seed?: number; every?: number }> = ({ bed, title = "Sold listings", rows, range, seed = 11, every = 16 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = useIn(0, 15, 110);
  const x = interpolate(inn, [0, 1], [900, 0]);
  const t0 = 14, rangeAt = t0 + rows.length * every + 6;
  const circle = interpolate(f, [rangeAt + 8, rangeAt + 30], [0, 1], ease);
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.15} />
      <div style={{ position: "absolute", right: 110, top: 70, width: 900, height: 940, transform: `translateX(${x}px) rotate(1.6deg)`, background: HZ.paper, boxShadow: `0 30px 60px ${HZ.shadow}`, backgroundImage: "repeating-linear-gradient(transparent 0 70px, rgba(80,120,180,0.28) 70px 72px)", backgroundPosition: "0 128px" }}>
        <div style={{ position: "absolute", left: 96, top: 0, bottom: 0, width: 3, background: "rgba(196,38,46,0.45)" }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30, top: 160 + i * 280, width: 30, height: 30, borderRadius: 15, background: "#d9cfbd", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.35)" }} />)}
        <div style={{ position: "absolute", left: 130, top: 40, fontFamily: SERIF, fontSize: 70, color: HZ.ink }}>{title}</div>
        {rows.map((r, i) => {
          const a = t0 + i * every; const op = interpolate(f, [a, a + 6], [0, 1], ease);
          const n = Math.max(0, Math.floor(((f - a) / fps) * 40)); const line = `${r.item}`;
          return (
            <div key={i} style={{ position: "absolute", left: 130, right: 40, top: 150 + i * 72, height: 70, display: "flex", alignItems: "flex-end", opacity: op, fontFamily: TYPE, fontSize: 38, color: HZ.ink }}>
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{line.slice(0, n)}</span>
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: HZ.green, marginLeft: 16 }}>{n > line.length ? r.price : ""}</span>
              {r.when ? <span style={{ fontSize: 26, color: HZ.inkSoft, marginLeft: 14, width: 130, textAlign: "right" }}>{n > line.length ? r.when : ""}</span> : null}
            </div>
          );
        })}
        {range ? (
          <div style={{ position: "absolute", left: 130, top: 150 + rows.length * 72 + 40, opacity: interpolate(f, [rangeAt, rangeAt + 6], [0, 1], ease) }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: HZ.inkSoft, textTransform: "uppercase" }}>usually</div>
            <div style={{ position: "relative", fontFamily: SERIF, fontSize: 92, color: HZ.red, display: "inline-block" }}>
              {range}
              <svg style={{ position: "absolute", left: -30, top: -14, overflow: "visible" }} width="110%" height="120%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <ellipse cx="50" cy="52" rx="52" ry="48" fill="none" stroke={HZ.red} strokeWidth="2.2" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - circle} />
              </svg>
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
