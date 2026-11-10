// Piezas propias de yoko01: la cuenta de la radio en kanji (一二三四) y el casillero del almanaque (día 1 → día 14).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { C, FONTS } from "./Piezas";

const { SERIF, SANS, HAND, JP } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const KANJI = ["一", "二", "三", "四", "五", "六", "七", "八"];
const ROMA = ["ichi", "ni", "san", "shi", "go", "roku", "shichi", "hachi"];

// La voz de la radio cuenta: cada número cae como un sello sobre su palabra.
export const CountJP: React.FC<{ marks: number[]; dur: number; en?: boolean }> = ({ marks, dur, en }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, background: "linear-gradient(0deg, rgba(6,10,24,0.6), rgba(6,10,24,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, display: "flex", justifyContent: "center", gap: 44 }}>
        {marks.map((m, i) => {
          const p = spring({ frame: f - m, fps: 30, config: { damping: 10, mass: 0.7 } });
          if (f < m) return <div key={i} style={{ width: 170 }} />;
          return (
            <div key={i} style={{ width: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 150, height: 150, borderRadius: "50%", border: `8px solid ${C.stamp}`, background: "rgba(246,241,228,0.95)", color: C.stamp, fontFamily: JP, fontWeight: 700, fontSize: 92,
                display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(p, [0, 1], [2.1, 1])}) rotate(${(i % 2 ? 5 : -6)}deg)`, opacity: Math.min(1, p * 2), boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>{KANJI[i]}</div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.white, textShadow: shadow, textTransform: "uppercase", opacity: p }}>{en ? ["one", "two", "three", "four"][i] : ROMA[i]}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Dos casilleros del almanaque: el número del día 1 y, después, el del día 14 con su círculo rojo.
export const Compare: React.FC<{ a: number; b: number; la: string; lb: string; atB: number; note?: string; noteAt?: number; dur: number }> = ({ a, b, la, lb, atB, note, noteAt = 9999, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const pa = spring({ frame: f, fps: 30, config: { damping: 16 } });
  const pb = spring({ frame: f - atB, fps: 30, config: { damping: 11, mass: 0.7 } });
  const ring = interpolate(f, [atB + 6, atB + 24], [0, 1], CL);
  const caja = (n: number, l: string, p: number, circ: boolean) => (
    <div style={{ width: 250, background: C.paper, borderRadius: 10, borderTop: `14px solid ${C.ink}`, boxShadow: "0 16px 40px rgba(0,0,0,0.45)", padding: "10px 0 16px", textAlign: "center", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 50}px) rotate(${circ ? 2 : -2}deg)`, position: "relative" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: C.indigo }}>{l}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 150, lineHeight: "170px", color: C.stamp }}>{n}</div>
      {circ && <div style={{ position: "absolute", left: 30, top: 44, width: 190, height: 170, borderRadius: "50%", border: `9px solid ${C.stamp}`, transform: "rotate(-8deg)",
        clipPath: `polygon(50% 50%, 50% -20%, ${ring > 0.125 ? "120% -20%" : `${50 + ring * 8 * 70}% -20%`}, ${ring > 0.375 ? "120% 120%" : ring > 0.125 ? `120% ${-20 + (ring - 0.125) * 4 * 140}%` : "50% -20%"}, ${ring > 0.625 ? "-20% 120%" : ring > 0.375 ? `${120 - (ring - 0.375) * 4 * 140}% 120%` : "50% -20%"}, ${ring > 0.875 ? "-20% -20%" : ring > 0.625 ? `-20% ${120 - (ring - 0.625) * 4 * 140}%` : "50% -20%"}, ${ring > 0.875 ? `${-20 + (ring - 0.875) * 8 * 70}% -20%` : "50% -20%"})`, opacity: ring > 0 ? 1 : 0 }} />}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 900, background: "linear-gradient(90deg, rgba(6,10,24,0.55), rgba(6,10,24,0))" }} />
      <div style={{ position: "absolute", left: 110, top: 330, display: "flex", alignItems: "center", gap: 34 }}>
        {caja(a, la, pa, false)}
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 90, color: C.white, textShadow: shadow, opacity: pb }}>→</div>
        {f >= atB ? caja(b, lb, pb, true) : <div style={{ width: 250 }} />}
      </div>
      {note && <div style={{ position: "absolute", left: 116, top: 640, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 44, color: C.white, textShadow: shadow, opacity: interpolate(f, [noteAt, noteAt + 12], [0, 1], CL) }}>{note}</div>}
    </AbsoluteFill>
  );
};
