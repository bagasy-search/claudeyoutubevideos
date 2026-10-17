// Capas encima del plano: rótulo de fuente, sello de fecha, cifra grande, capítulo, índice, título, línea de tiempo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate } from "./lib";
import { C, COND, MONO, clamp, easeOut } from "./lib";
import type { Shot } from "./media";

const typed = (txt: string, f: number, cps = 38) => txt.slice(0, Math.max(0, Math.floor((f / 30) * cps)));

export const Tag: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [6, 16, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 64, bottom: 54, display: "flex", alignItems: "center", gap: 14, opacity: o }}>
      <div style={{ width: 10, height: 10, background: C.cyan, boxShadow: `0 0 12px ${C.cyan}` }} />
      <div style={{ fontFamily: MONO, fontSize: 21, letterSpacing: "0.1em", color: "rgba(234,241,248,0.86)", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{text}</div>
    </div>
  );
};

export const Stamp: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const t = typed(text, f - 4, 34);
  return (
    <div style={{ position: "absolute", left: 64, top: 60, opacity: o, fontFamily: MONO, fontSize: 30, fontWeight: 600, color: C.amber,
      letterSpacing: "0.12em", textShadow: "0 2px 12px rgba(0,0,0,0.95)", background: "rgba(4,7,12,0.55)", padding: "10px 18px", borderLeft: `4px solid ${C.amber}` }}>
      {t}<span style={{ opacity: Math.floor(f / 12) % 2 ? 0 : 1 }}>▌</span>
    </div>
  );
};

// número grande que cuenta hacia arriba si empieza con dígitos
const countUp = (s: string, p: number) => {
  const m = s.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
  if (!m) return s;
  const raw = m[2].replace(/,/g, "");
  const val = parseFloat(raw);
  if (!isFinite(val) || val < 10) return s;
  const dec = raw.includes(".") ? raw.split(".")[1].length : 0;
  const cur = val * p;
  const txt = dec ? cur.toFixed(dec) : Math.round(cur).toLocaleString("en-US");
  return m[1] + txt + m[3];
};

export const Stat: React.FC<{ a: string; b: string; dur: number; delay?: number }> = ({ a, b, dur, delay = 0 }) => {
  const f = useCurrentFrame() - delay - 4;
  const d = dur - delay;
  const p = interpolate(f, [0, 26], [0, 1], { ...clamp, easing: easeOut });
  const wipe = interpolate(f, [0, 14], [0, 100], clamp);
  const o = interpolate(f, [d - 10, d - 2], [1, 0], clamp);
  if (f < 0) return null;
  const size = a.length > 11 ? 112 : a.length > 7 ? 150 : 190;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(4,7,12,0.82) 0%, rgba(4,7,12,0.45) 38%, rgba(4,7,12,0) 62%)", opacity: p }} />
      <div style={{ position: "absolute", left: 96, top: 540, transform: "translateY(-55%)", clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: size, lineHeight: 0.95, color: C.ink, letterSpacing: "-0.01em", textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
          {countUp(a, p)}
        </div>
        <div style={{ height: 5, width: 120 + 380 * p, background: C.cyan, margin: "18px 0 18px", boxShadow: `0 0 18px ${C.cyan}` }} />
        <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600, letterSpacing: "0.12em", color: C.cyan, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{b}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Chapter: React.FC<{ n: string; title: string }> = ({ n, title }) => {
  const f = useCurrentFrame();
  const len = 78;
  const o = interpolate(f, [0, 8, len - 12, len], [0, 1, 1, 0], clamp);
  const w = interpolate(f, [4, 30], [0, 1], { ...clamp, easing: easeOut });
  if (f > len) return null;
  return (
    <AbsoluteFill style={{ opacity: o, background: "rgba(4,7,12,0.62)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: "0.4em", color: C.amber, marginBottom: 18 }}>{typed(`ARCHIVO ${n}`, f, 30)}</div>
        <div style={{ height: 3, width: 900 * w, background: C.cyan, margin: "0 auto 26px", boxShadow: `0 0 16px ${C.cyan}` }} />
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 132, letterSpacing: "0.04em", color: C.ink, lineHeight: 1,
          clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>{title}</div>
        <div style={{ height: 3, width: 900 * w, background: C.cyan, margin: "26px auto 0", boxShadow: `0 0 16px ${C.cyan}` }} />
      </div>
    </AbsoluteFill>
  );
};

export const Item: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 14], [-60, 0], { ...clamp, easing: easeOut });
  const o = interpolate(f, [0, 10, dur - 6, dur], [0, 1, 1, 0], clamp);
  const [num, ...rest] = text.split(" · ");
  return (
    <div style={{ position: "absolute", left: 96, bottom: 150, opacity: o, transform: `translateX(${x}px)`, display: "flex", alignItems: "stretch",
      background: "rgba(4,7,12,0.78)", borderLeft: `6px solid ${C.cyan}` }}>
      <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 84, color: C.cyan, padding: "6px 26px", lineHeight: 1 }}>{num}</div>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 64, color: C.ink, padding: "14px 32px 10px 6px", lineHeight: 1, letterSpacing: "0.02em" }}>{rest.join(" · ")}</div>
    </div>
  );
};

export const Title: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const sp = interpolate(f, [0, dur], [0.5, 0.62], clamp);
  const o = interpolate(f, [0, 12, dur - 8, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 250, color: C.ink, letterSpacing: `${sp}em`, marginRight: `-${sp}em`,
        textShadow: "0 10px 60px rgba(0,0,0,0.8)" }}>{text}</div>
    </AbsoluteFill>
  );
};

const TL = [["LANZAMIENTO", "OCT 2024"], ["MARTE", "MAR 2025"], ["TIERRA", "DIC 2026"], ["JÚPITER", "ABR 2030"]];
export const Timeline: React.FC<{ step: number; dur: number }> = ({ step, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 6, dur], [step === 1 ? 0 : 1, 1, 1, step === 3 ? 0 : 1], clamp);
  const prog = interpolate(f, [0, 24], [step - 1, step], { ...clamp, easing: easeOut });
  const X0 = 260, W = 1400;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 230, opacity: o,
      background: "linear-gradient(0deg, rgba(4,7,12,0.92) 0%, rgba(4,7,12,0.6) 60%, rgba(4,7,12,0) 100%)" }}>
      <div style={{ position: "absolute", left: X0, top: 110, width: W, height: 3, background: "rgba(234,241,248,0.25)" }} />
      <div style={{ position: "absolute", left: X0, top: 109, width: (W * prog) / 3, height: 5, background: C.cyan, boxShadow: `0 0 14px ${C.cyan}` }} />
      {TL.map(([a, b], i) => {
        const on = i <= prog + 0.01, cur = i === step;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + (W * i) / 3 - 120, top: 52, width: 240, textAlign: "center" }}>
            <div style={{ fontFamily: COND, fontWeight: 800, fontSize: cur ? 44 : 34, color: cur ? C.ink : on ? C.dim : "rgba(234,241,248,0.35)", height: 48 }}>{a}</div>
            <div style={{ width: cur ? 26 : 18, height: cur ? 26 : 18, borderRadius: 99, margin: "0 auto", marginTop: cur ? 0 : 4,
              background: on ? C.cyan : C.bg, border: `3px solid ${on ? C.cyan : "rgba(234,241,248,0.4)"}`, boxShadow: cur ? `0 0 20px ${C.cyan}` : "none" }} />
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em", color: cur ? C.amber : C.dim, marginTop: 10 }}>{b}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [10, 22, dur - 8, dur], [0, 1, 1, 0], clamp);
  const y = interpolate(f, [10, 26], [30, 0], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", right: 90, top: 90, opacity: o, transform: `translateY(${y}px)`, fontFamily: COND, fontWeight: 800, fontSize: 70,
      color: C.ink, background: "rgba(4,7,12,0.78)", padding: "12px 30px", borderRight: `6px solid ${C.amber}`, letterSpacing: "0.03em" }}>{text}</div>
  );
};

export const Hud: React.FC = () => (
  <div style={{ position: "absolute", right: 60, top: 46, fontFamily: MONO, fontSize: 18, letterSpacing: "0.22em", color: "rgba(234,241,248,0.5)",
    textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>DOSSIER ORBITAL · ARCHIVO: EUROPA</div>
);

export const Overlays: React.FC<{ s: Shot }> = ({ s }) => {
  const dur = s.f1 - s.f0;
  return (
    <>
      {s.tag && !s.ch && <Tag text={s.tag} dur={dur} />}
      {s.stamp && <Stamp text={s.stamp} dur={dur} />}
      {s.title && <Title text={s.title} dur={dur} />}
      {s.item && <Item text={s.item} dur={dur} />}
      {s.stat && <Stat a={s.stat[0]} b={s.stat[1]} dur={dur} delay={s.statF || 0} />}
      {s.tl && <Timeline step={s.tl} dur={dur} />}
      {s.chem && <Chip text="H₂S + CO₂ → ALIMENTO" dur={dur} />}
      {s.react && <Chip text="ROCA + AGUA → H₂" dur={dur} />}
      {s.ch && <Chapter n={s.ch[0]} title={s.ch[1]} />}
    </>
  );
};
