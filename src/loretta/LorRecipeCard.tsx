// LorRecipeCard — tarjeta de receta que se escribe a mano en vivo (la tinta corre renglón por renglón), con manchas
// de uso, cinta gingham y una foto de cama detrás. Reusable: title/lines/note/bed/accent.
// LorRecipeSheet — la lámina "Loretta's Recipe Card" con los 7 pies (en código: cero typos), con zoom punto por punto.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd, hexA } from "./LorTheme";

const Stains: React.FC<{ seed: number }> = ({ seed }) => (
  <>
    {Array.from({ length: 4 }).map((_, i) => {
      const x = 8 + rnd(seed + i) * 80, y = 8 + rnd(seed + i + 9) * 80, r = 40 + rnd(seed + i + 19) * 90;
      return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: r, height: r * (0.8 + rnd(seed + i + 3) * 0.4), borderRadius: "50%", border: `3px solid rgba(170,120,60,${0.10 + rnd(seed + i + 5) * 0.12})`, background: `radial-gradient(circle, rgba(190,140,70,0.05), rgba(190,140,70,${0.08 + rnd(seed + i) * 0.08}))`, translate: "-50% -50%" }} />;
    })}
  </>
);

export const Bed: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0.25 }) => {
  const f = useCurrentFrame();
  if (!src) return <AbsoluteFill style={{ backgroundColor: "#E9DCC0" }} />;
  const s = 1.08 + f * 0.0006;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#E9DCC0" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: "blur(10px)" }} />
      <AbsoluteFill style={{ backgroundColor: `rgba(246,238,220,${dim})` }} />
    </AbsoluteFill>
  );
};

export const LorRecipeCard: React.FC<{ title: string; lines: string[]; note?: string; bed?: string; kicker?: string; seed?: number; perLine?: number; start?: number }> = ({ title, lines, note, bed, kicker, seed = 7, perLine = 14, start = 14 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = interpolate(f, [0, 0.6 * fps], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const rot = -2.2 + rnd(seed) * 4;
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1240, minHeight: 700, padding: "70px 90px 60px 120px", background: `linear-gradient(180deg, ${LOR.white}, ${LOR.paper})`, boxShadow: `0 30px 60px ${LOR.shadow}, 0 4px 10px rgba(0,0,0,0.15)`, borderRadius: 10, rotate: `${rot * inP}deg`, translate: `0px ${(1 - inP) * 120}px`, scale: String(0.94 + 0.06 * inP), opacity: inP, overflow: "hidden" }}>
          <Stains seed={seed * 13} />
          {/* renglones */}
          {Array.from({ length: 11 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 190 + i * 58, height: 2, background: "rgba(90,130,190,0.28)" }} />)}
          <div style={{ position: "absolute", left: 95, top: 0, bottom: 0, width: 2, background: "rgba(200,60,60,0.4)" }} />
          {/* cinta gingham */}
          <div style={{ position: "absolute", left: -30, top: 26, width: 190, height: 52, rotate: "-32deg", background: `repeating-linear-gradient(90deg, ${hexA(LOR.gingham, 0.7)} 0 12px, transparent 12px 24px), repeating-linear-gradient(0deg, ${hexA(LOR.gingham, 0.55)} 0 12px, rgba(255,255,255,0.8) 12px 24px)` }} />
          {kicker ? <div style={{ fontFamily: HAND, fontSize: 44, color: LOR.gingham, fontWeight: 700 }}>{kicker}</div> : null}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, color: LOR.ink, lineHeight: 1.05, marginBottom: 22 }}>{title}</div>
          {lines.map((l, i) => {
            const t0 = start + i * perLine;
            const p = interpolate(f, [t0, t0 + perLine * 0.9], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
            return (
              <div key={i} style={{ position: "relative", fontFamily: HAND, fontWeight: 600, fontSize: 52, lineHeight: "58px", color: "#243766", clipPath: `inset(0 ${100 - p}% 0 0)` }}>{l}</div>
            );
          })}
          {note ? (() => {
            const t0 = start + lines.length * perLine + 6;
            const p = interpolate(f, [t0, t0 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.4, 0.4, 1) });
            return <div style={{ position: "absolute", right: 70, bottom: 50, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: LOR.gingham, rotate: "-5deg", scale: String(0.6 + 0.4 * p), opacity: p, border: `4px solid ${LOR.gingham}`, borderRadius: 16, padding: "4px 22px", background: "rgba(255,253,247,0.8)" }}>{note}</div>;
          })() : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export type SheetPie = { name: string; lines: string[]; oven: string; trick: string };

// Lámina: [segundo, cx, cy, escala] teclas (fracciones del cuadro 1920x1080)
export const LorRecipeSheet: React.FC<{ pies: SheetPie[]; title?: string; sub?: string; keys?: [number, number, number, number][] }> = ({ pies, title = "Loretta's Recipe Card", sub = "7 church potluck pies · every one from scratch", keys }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ks = keys && keys.length ? keys : [[0, 0.5, 0.5, 1] as [number, number, number, number]];
  let i = 0; while (i < ks.length - 1 && t >= ks[i + 1][0]) i++;
  const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)];
  const p = b === a ? 0 : interpolate(t, [b[0] - 0.8, b[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cx = a[1] + (b[1] - a[1]) * p, cy = a[2] + (b[2] - a[2]) * p, s = a[3] + (b[3] - a[3]) * p;
  const Wd = 1920, Hd = 1080;
  let tx = Wd / 2 - cx * Wd * s, ty = Hd / 2 - cy * Hd * s;
  tx = Math.min(0, Math.max(Wd - Wd * s, tx)); ty = Math.min(0, Math.max(Hd - Hd * s, ty));
  const inP = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#E9DCC0", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: Wd, height: Hd, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})`, opacity: inP }}>
        <div style={{ position: "absolute", inset: 22, background: `linear-gradient(180deg, ${LOR.white}, ${LOR.paper})`, borderRadius: 12, boxShadow: `0 10px 30px ${LOR.shadow}`, overflow: "hidden" }}>
          <Stains seed={501} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: `repeating-linear-gradient(90deg, ${hexA(LOR.gingham, 0.75)} 0 13px, transparent 13px 26px), repeating-linear-gradient(0deg, ${hexA(LOR.gingham, 0.6)} 0 13px, #fff 13px 26px)` }} />
          <div style={{ position: "absolute", left: 50, top: 44, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LOR.ink }}>{title}</div>
          <div style={{ position: "absolute", right: 60, top: 58, fontFamily: HAND, fontWeight: 700, fontSize: 42, color: LOR.gingham }}>{sub}</div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 140, bottom: 30, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 18 }}>
            {pies.map((pie, k) => (
              <div key={k} style={{ border: `2px solid ${hexA(LOR.inkSoft, 0.35)}`, borderRadius: 10, padding: "12px 16px", background: k % 2 ? "rgba(242,201,76,0.10)" : "rgba(110,154,91,0.08)", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 31, color: LOR.ink, lineHeight: 1.05 }}>{k + 1}. {pie.name}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 21, color: LOR.greenDeep, margin: "4px 0 4px" }}>{pie.oven}</div>
                {pie.lines.map((l, j) => <div key={j} style={{ fontFamily: HAND, fontWeight: 600, fontSize: 24, lineHeight: "25px", color: "#243766" }}>{l}</div>)}
                <div style={{ marginTop: "auto", fontFamily: HAND, fontWeight: 700, fontSize: 25, lineHeight: "26px", color: LOR.gingham }}>Trick: {pie.trick}</div>
              </div>
            ))}
            <div style={{ borderRadius: 10, padding: "16px 18px", background: "rgba(200,50,58,0.07)", border: `2px dashed ${hexA(LOR.gingham, 0.5)}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: LOR.gingham, lineHeight: "40px" }}>Every pie: one 9-inch crust, cuts 8 pieces.</div>
              <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 30, color: "#243766", lineHeight: "34px", marginTop: 10 }}>Custard pies go in the icebox once cool. Good 3 to 4 days.</div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 26, color: LOR.ink, marginTop: 14 }}>— Loretta</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
