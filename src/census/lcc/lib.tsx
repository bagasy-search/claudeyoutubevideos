// Herramientas de montaje del Ep.5-6 (lc-c), mismo molde que Owen B: cada plano va de un segundo de la voz al siguiente,
// k(seg) = cuadro local de ese segundo, y los sfx se anotan en segundos ABSOLUTOS (cues_de.mjs → mezcla_c.py).
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { PlanoM, Trans } from "../../anikit/montaje";
import { F_HUD, F_MANO, F_GLOBO, MarcaCorto, valorEn } from "../../anikit/pantalla";
import { AMBAR, CAPSULA } from "../elenco";
import { F_MONO } from "../hud";

export const FPS = 30;
export type Sfx = [number, string, number?, Record<string, unknown>?];
export type K = (s: number) => number;
export type PlanB = { a: number; b: number; el: (k: K) => React.ReactNode; trans?: Trans; sfx?: Sfx[] };
export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const armar = (planos: PlanB[]) => {
  const out: PlanoM[] = [];
  const cues: Sfx[] = [];
  planos.forEach((p, i) => {
    const A = Math.round(p.a * FPS), B = Math.round(p.b * FPS);
    if (i > 0 && Math.abs(planos[i - 1].b - p.a) > 0.001) throw new Error(`plano ${i} no es contiguo (${planos[i - 1].b} → ${p.a})`);
    const k: K = (s) => Math.round((s - p.a) * FPS);
    const El: React.FC = () => <>{p.el(k)}</>;
    out.push({ dur: B - A, el: <El />, trans: p.trans });
    (p.sfx ?? []).forEach((c) => cues.push(c));
  });
  return { planos: out, cues, total: Math.round(planos[planos.length - 1].b * FPS) };
};

// ---------- HUD de la serie (mismo look que census/hud: cápsula oscura, mono ámbar) ----------
export type Cl = { f: number; v: number; d?: number }[];
export type LineaC = { id: string; et: string; v: Cl | number; fmt?: (n: number) => string; color?: string; icono?: "dia" | "temp" | "luna" | "radio" | "gota" | "hielo" };
const Icono: React.FC<{ t: NonNullable<LineaC["icono"]>; tam: number; color: string }> = ({ t, tam, color }) => (
  <svg width={tam * 0.9} height={tam * 0.9} viewBox="0 0 24 24">
    {t === "temp" && <><rect x="9.5" y="2" width="5" height="14" rx="2.5" fill="none" stroke={color} strokeWidth="2" /><circle cx="12" cy="18" r="4" fill={color} /><rect x="11" y="8" width="2" height="9" fill={color} /></>}
    {t === "dia" && <><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={color} strokeWidth="2" /><path d="M3 10 H21 M8 2 V7 M16 2 V7" stroke={color} strokeWidth="2" /></>}
    {t === "luna" && <path d="M15 3 A9 9 0 1 0 21 15 A7 7 0 1 1 15 3 Z" fill={color} />}
    {t === "radio" && <><rect x="4" y="8" width="16" height="13" rx="2" fill="none" stroke={color} strokeWidth="2" /><path d="M8 8 L16 2" stroke={color} strokeWidth="2" /><circle cx="9" cy="14.5" r="2.5" fill={color} /></>}
    {t === "gota" && <><path d="M12 2 Q20 12 18 16 A6 6 0 0 1 6 16 Q4 12 12 2 Z" fill="none" stroke={color} strokeWidth="2" /><rect x="10.5" y="10" width="3" height="8" fill={color} /><rect x="8" y="12.5" width="8" height="3" fill={color} /></>}
    {t === "hielo" && <path d="M12 2 V22 M3 7 L21 17 M21 7 L3 17" stroke={color} strokeWidth="2.4" strokeLinecap="round" />}
  </svg>
);
const entero = (n: number) => (n < 0 ? "−" : "") + Math.abs(Math.round(n)).toLocaleString("en-US");
export const CapC: React.FC<{ y: number; tam: number; o: number; s: number; pop: number; color?: string; children: React.ReactNode; x?: number }> = ({ x = 56, y, tam, o, s, pop, color = AMBAR, children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - s) * -14}px) scale(${1 + 0.06 * pop})`, transformOrigin: "0% 50%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: tam * 0.35, background: CAPSULA, border: `3px solid ${color}`, borderRadius: tam * 0.55, padding: `${tam * 0.18}px ${tam * 0.55}px`, fontFamily: F_MONO, fontWeight: 800, fontSize: tam, color, letterSpacing: 1, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", boxShadow: `0 0 ${18 + 30 * pop}px ${color}${pop > 0.05 ? "99" : "44"}, 0 6px 16px rgba(0,0,0,0.45)`, textShadow: `0 0 12px ${color}88` }}>
      {children}
    </div>
  </div>
);
// líneas: la 1ª es POPULATION (tam 40), las demás tam 34. Cada línea entra con resorte cuando aparece en la lista.
// ent = cuadro (del plano) en que entró cada línea; las que vienen de antes pasan ent negativo.
export const HudC: React.FC<{ lineas: (LineaC & { ent?: number; sale?: number })[]; marca?: boolean }> = ({ lineas, marca = true }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  let y = 48;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {lineas.map((l, i) => {
        const tam = i === 0 ? 40 : 34;
        const ent = l.ent ?? -100;
        const s = spring({ frame: f - ent, fps, config: { damping: 15, stiffness: 140 } });
        const o = Math.min(s, l.sale !== undefined ? interpolate(f, [l.sale, l.sale + 10], [1, 0], cl) : 1);
        const val = typeof l.v === "number" ? { v: l.v, pop: 0 } : valorEn(l.v, f);
        const el = (
          <CapC key={l.id} y={y} tam={tam} o={o} s={s} pop={val.pop} color={l.color}>
            {l.icono && <Icono t={l.icono} tam={tam} color={l.color ?? AMBAR} />}
            {l.et && <span style={{ color: "#f6ecd2", opacity: 0.92 }}>{l.et}</span>}
            <span>{(l.fmt ?? entero)(val.v)}</span>
          </CapC>
        );
        y += tam * 1.85;
        return el;
      })}
      {marca && <MarcaCorto />}
    </AbsoluteFill>
  );
};
export const POP = (v: Cl | number, extra: Partial<LineaC> = {}): LineaC => ({ id: "pop", et: "POPULATION:", v, ...extra });
export const decimal = (n: number) => n.toFixed(1);

// ---------- texto en pantalla ----------
export const Txt: React.FC<{ t: string; a: number; b: number; top?: number; left?: number; tam?: number; color?: string; mano?: boolean; rot?: number; chip?: boolean }> = ({ t, a, b, top = 150, left, tam = 64, color = "#f6ecd2", mano, rot = 0, chip }) => {
  const f = useF();
  return (
    <div style={{ position: "absolute", top, left: left ?? 0, right: left === undefined ? 0 : undefined, textAlign: left === undefined ? "center" : "left", fontFamily: mano ? F_MANO : F_HUD, fontWeight: mano ? 700 : 600, fontSize: tam, color, transform: `rotate(${rot}deg)`, opacity: interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], cl), textShadow: "0 3px 12px rgba(0,0,0,0.7)", whiteSpace: "pre-line", lineHeight: 1.1 }}>
      {chip ? <span style={{ background: "rgba(18,15,24,0.78)", padding: "6px 22px", borderRadius: 16 }}>{t}</span> : t}
    </div>
  );
};

// palabra a mano que se escribe de izquierda a derecha (máscara), recta y limpia
export const Mano: React.FC<{ t: string; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string; vel?: number; centro?: boolean }> = ({ t, x, y, desde, hasta = 1e9, tam = 110, color = AMBAR, vel = 1.6, centro = true }) => {
  const f = useF();
  const u = interpolate(f, [desde, desde + Math.max(8, t.length * vel)], [0, 1], { ...cl, easing: Easing.out(Easing.quad) });
  const o = interpolate(f, [hasta - 8, hasta], [1, 0], cl);
  if (f < desde) return null;
  return (
    <div style={{ position: "absolute", left: centro ? x - 1200 : x, width: centro ? 2400 : undefined, top: y - tam * 0.75, textAlign: centro ? "center" : "left", opacity: o }}>
      <span style={{ display: "inline-block", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, color, whiteSpace: "pre", textShadow: `0 0 18px ${color}66, 0 4px 14px rgba(0,0,0,0.6)`, clipPath: `inset(-20% ${100 - u * 100}% -20% -5%)` }}>{t}</span>
    </div>
  );
};

// globo de radio (sale del parlante): borde ámbar punteado, letra de globo
export const GloboRadio: React.FC<{ t: string; x: number; y: number; desde: number; hasta: number; tam?: number; lado?: 1 | -1; color?: string }> = ({ t, x, y, desde, hasta, tam = 46, lado = 1, color = AMBAR }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 160 } });
  const o = interpolate(f, [hasta - 8, hasta], [1, 0], cl);
  const n = Math.floor(interpolate(f, [desde, desde + t.length * 1.1], [0, t.length], cl));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${lado > 0 ? 0 : -100}%, -100%) scale(${0.6 + 0.4 * s})`, transformOrigin: lado > 0 ? "0% 100%" : "100% 100%", opacity: o }}>
      <div style={{ background: "rgba(18,15,24,0.9)", border: `4px dashed ${color}`, borderRadius: 26, padding: "16px 30px", fontFamily: F_GLOBO, fontSize: tam, color: "#f6ecd2", maxWidth: 900, lineHeight: 1.15, boxShadow: `0 0 30px ${color}44` }}>
        <span>{t.slice(0, n)}</span><span style={{ opacity: 0 }}>{t.slice(n)}</span>
      </div>
    </div>
  );
};

export const BotonSub: React.FC<{ desde: number; top?: number }> = ({ desde, top = 820 }) => {
  const f = useF();
  if (f < desde) return null;
  const p = interpolate(f - desde, [0, 5, 9], [0.3, 1.18, 1], cl);
  const clic = interpolate(f - desde, [24, 28, 32], [1, 0.9, 1], cl);
  const hecho = f - desde > 28;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${p * clic})`, background: hecho ? "#3a3f46" : "#e0262b", color: "#fff", fontFamily: F_HUD, fontWeight: 600, fontSize: 60, letterSpacing: 3, padding: "16px 60px", borderRadius: 60, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>{hecho ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
    </div>
  );
};

// rótulo «NEXT · EP. 6» del cierre
export const Proximo: React.FC<{ ep: number; titulo: string; desde: number }> = ({ ep, titulo, desde }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: 40, color: AMBAR, letterSpacing: 6, textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>NEXT · EP. {ep}</div>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 62, color: "#f6ecd2", marginTop: 10, textShadow: "0 4px 16px rgba(0,0,0,0.75)" }}>{titulo}</div>
    </div>
  );
};

// número grande del paso («1», «2»…) en una zona limpia
export const Paso: React.FC<{ n: string; rot?: string; desde: number; hasta: number; x?: number; y?: number }> = ({ n, rot, desde, hasta, x = 1560, y = 300 }) => (
  <>
    <Mano t={n} x={x} y={y} desde={desde} hasta={hasta} tam={230} vel={3} />
    {rot && <Mano t={rot} x={x} y={y + 150} desde={desde + 8} hasta={hasta} tam={64} color="#f6ecd2" />}
  </>
);
