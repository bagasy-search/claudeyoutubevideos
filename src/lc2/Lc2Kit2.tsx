// Lc2Kit2 — pantallas completas para tapar los tramos LARGOS de avatar (la voz de Loretta sigue debajo).
// Todo con datos del libro: p.3 (comprar para una), p.4 (la semana), las fuentes, la tarea del cierre.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd, hexA } from "../loretta/LorTheme";
import { PLUM, PLUM2 } from "./Lc2Kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, fps: number, at = 0, damping = 13) => spring({ frame: f - at, fps, config: { damping, stiffness: 150, mass: 0.7 } });
const outK = (f: number, d: number, n = 8) => interpolate(f, [d - n, d], [1, 0], cl);
const TABLE = `radial-gradient(ellipse at 50% 45%, #8a6a4a, #4a3424)`;

// ---------- "Así compro para una" (p.3): bolsitas del freezer que caen, rotuladas a mano ----------
export const Lc2Shop: React.FC<{ items?: { t: string; sub: string }[] }> = ({ items = [
  { t: "2 chicken thighs", sub: "two to a bag" }, { t: "1/4 lb ground beef", sub: "in flat squares" }, { t: "the bread", sub: "in the freezer too" }] }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const o = outK(f, durationInFrames);
  const head = pop(f, fps, 0, 15);
  return (
    <AbsoluteFill style={{ opacity: o, background: `radial-gradient(ellipse at 50% 30%, #EEF5F8, #C9DCE6 70%, #A9C3D2)` }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,.7) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,.55) 0 2px, transparent 3px)", backgroundSize: "90px 90px, 130px 130px" }} />
      <div style={{ position: "absolute", top: 64, width: "100%", textAlign: "center", translate: `0 ${(1 - head) * -80}px`, opacity: head }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: PLUM2 }}>how I shop for one</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: LOR.ink, lineHeight: 1 }}>Buy the big package. Freeze it small.</div>
      </div>
      {items.map((it, i) => { const at = 18 + i * 16; const p = pop(f, fps, at, 11); if (f < at) return null; const x = 250 + i * 490, r = (rnd(i + 3) - 0.5) * 10;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 370, width: 420, height: 480, rotate: `${r}deg`, translate: `0 ${(1 - p) * -900}px`,
            background: "linear-gradient(160deg, rgba(255,255,255,.8), rgba(235,244,250,.55))", border: "3px solid rgba(255,255,255,.95)", borderRadius: 22,
            boxShadow: "0 30px 60px rgba(40,70,90,.30), inset 0 0 40px rgba(255,255,255,.6)" }}>
            <div style={{ height: 40, background: `repeating-linear-gradient(90deg, ${LOR.gingham} 0 14px, #fff 14px 18px)`, borderRadius: "18px 18px 0 0", opacity: 0.85 }} />
            <div style={{ margin: "44px 30px 0", background: "#fff", padding: "18px 22px", rotate: "-2deg", boxShadow: `0 6px 14px ${LOR.shadow}` }}>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: LOR.ink, lineHeight: 1 }}>{it.t}</div>
              <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 40, color: LOR.greenDeep }}>{it.sub}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: LOR.inkSoft, marginTop: 10, letterSpacing: 3 }}>ONE SUPPER</div>
            </div>
          </div>); })}
    </AbsoluteFill>
  );
};

// ---------- la semana (p.4): 7 cenas del libro vs. la misma semana de congelados ----------
export const Lc2Week: React.FC<{ book?: [number, number]; frozen?: [number, number] }> = ({ book = [15, 18], frozen = [25, 35] }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const o = outK(f, durationInFrames);
  const max = 38, H = 540;
  const grow = (at: number) => interpolate(f, [at, at + 26], [0, 1], { ...cl, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) });
  const save = pop(f, fps, 66, 10);
  const col = (lo: number, hi: number, at: number, label: string, sub: string, c: string) => { const k = grow(at); return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 440 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: c, opacity: interpolate(f, [at + 14, at + 24], [0, 1], cl) }}>${lo}–{Math.max(lo, Math.round(hi * k))}</div>
      <div style={{ height: H, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: 240, height: (H * hi / max) * k, borderRadius: "16px 16px 0 0", boxShadow: `0 20px 40px ${LOR.shadow}`,
          background: `repeating-linear-gradient(0deg, rgba(255,255,255,.14) 0 3px, transparent 3px 60px), linear-gradient(${c}, ${hexA(c, 0.82)})` }} />
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: LOR.ink, marginTop: 18 }}>{label}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: LOR.inkSoft }}>{sub}</div>
    </div>); };
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: LOR.paper, backgroundImage: `radial-gradient(ellipse at 50% 20%, rgba(255,255,255,.6), transparent 60%)` }}>
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: PLUM2 }}>prices from my store, this fall</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, color: LOR.ink, lineHeight: 1 }}>One week of suppers</div>
      </div>
      <div style={{ position: "absolute", bottom: 56, width: "100%", display: "flex", justifyContent: "center", gap: 170, alignItems: "flex-end" }}>
        {col(book[0], book[1], 16, "From my book", "7 suppers", PLUM)}
        {col(frozen[0], frozen[1], 34, "Frozen dinners", "the same week", "#8A8F96")}
      </div>
      <div style={{ position: "absolute", right: 170, top: 290, rotate: "8deg", scale: String(save), opacity: Math.min(1, save * 1.4), background: LOR.butter, borderRadius: "50%", width: 250, height: 250,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 20px 40px ${LOR.shadow}`, border: `5px dashed ${LOR.ink}` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: LOR.ink }}>about half</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: LOR.ink, lineHeight: 1 }}>the cost</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- la tarea del cierre: las 7 cenas del video y se tildan `pick` ----------
export const Lc2Homework: React.FC<{ names: string[]; pick?: number; line?: string }> = ({ names, pick = 2, line = "Pick two this week. Just two." }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const o = outK(f, durationInFrames);
  const p = pop(f, fps, 0, 15);
  const sel = [1, 4, 6, 2, 0].slice(0, pick);
  return (
    <AbsoluteFill style={{ opacity: o, background: TABLE, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1220, background: LOR.paper, borderRadius: 12, padding: "36px 64px 30px", rotate: `${-1.5 * p}deg`, translate: `0 ${(1 - p) * 700}px`, boxShadow: "0 40px 90px rgba(0,0,0,.45)",
        backgroundImage: `repeating-linear-gradient(transparent 0 62px, ${hexA("#7FA7C9", 0.28)} 62px 64px)`, backgroundPosition: "0 122px", borderTop: `16px solid ${PLUM}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: LOR.ink }}>Homework</span>
          <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: PLUM2 }}>{line}</span>
        </div>
        {names.map((n, i) => { const at = 14 + i * 5, k = sel.indexOf(i); const chk = k < 0 ? 0 : interpolate(f, [52 + k * 18, 62 + k * 18], [0, 1], cl);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, height: 64, opacity: interpolate(f, [at, at + 8], [0, 1], cl) }}>
              <svg width={46} height={46} viewBox="0 0 46 46"><rect x={4} y={4} width={38} height={38} rx={6} fill="#fff" stroke={LOR.inkSoft} strokeWidth={3} />
                <path d="M10 25 L20 35 L39 9" fill="none" stroke={LOR.gingham} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={55} strokeDashoffset={55 * (1 - chk)} /></svg>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: LOR.ink, background: chk > 0.5 ? hexA(LOR.butter, 0.6) : "transparent", padding: "0 10px", borderRadius: 6 }}>{i + 1}. {n}</span>
            </div>); })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- las fuentes que hacen falta ----------
type Shape = "sheet" | "loaf" | "dish" | "foil";
const PanIcon: React.FC<{ s: Shape }> = ({ s }) => s === "sheet" ? <><rect x={10} y={40} width={220} height={124} rx={12} fill="#B9BEC4" /><rect x={22} y={52} width={196} height={100} rx={6} fill="#D3D7DB" /></>
  : s === "loaf" ? <><path d="M26 48 L214 48 L194 162 L46 162 Z" fill="#DCEBF1" stroke="#8DB3C2" strokeWidth={6} strokeLinejoin="round" /><path d="M40 62 L200 62" stroke="#fff" strokeWidth={5} /></>
  : s === "dish" ? <><ellipse cx={120} cy={112} rx={102} ry={54} fill="#FFFDF7" stroke="#C7BBA4" strokeWidth={6} /><ellipse cx={120} cy={102} rx={78} ry={34} fill="#F1EADB" /></>
  : <><rect x={28} y={74} width={184} height={74} rx={8} fill="#8F969D" /><rect x={28} y={58} width={184} height={26} rx={6} fill="#E3E6E9" /><path d="M40 84 L200 84" stroke={LOR.gingham} strokeWidth={6} /></>;
export const Lc2Pans: React.FC<{ items: { t: string; sub: string; shape: Shape }[]; title?: string }> = ({ items, title = "All you need" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const o = outK(f, durationInFrames);
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: LOR.paper, backgroundImage: `radial-gradient(ellipse at 50% 35%, rgba(255,255,255,.7), transparent 60%)` }}>
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: LOR.ink }}>{title}</div>
      <div style={{ position: "absolute", top: 250, width: "100%", display: "flex", justifyContent: "center", gap: 90 }}>
        {items.map((it, i) => { const p = pop(f, fps, 10 + i * 12, 12); return (
          <div key={i} style={{ width: 520, textAlign: "center", scale: String(0.6 + 0.4 * p), opacity: Math.min(1, p * 1.4), translate: `0 ${(1 - p) * 80}px` }}>
            <div style={{ background: "#fff", borderRadius: 26, padding: "40px 0", boxShadow: `0 24px 50px ${LOR.shadow}` }}><svg width={380} height={316} viewBox="0 0 240 200"><PanIcon s={it.shape} /></svg></div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: LOR.ink, marginTop: 28, lineHeight: 1.05 }}>{it.t}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: PLUM2 }}>{it.sub}</div>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};
