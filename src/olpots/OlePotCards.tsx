// OlePotCards — los componentes de PAGO del video «5 pots»: cada uno cuenta UNA cosa del guion, con objetos del mundo de Ole
// (lata esmaltada azul, papel de libreta, madera de repisa, lápiz), sin texto quemado (todo por props, en inglés).
//   OleFourQuestions · OleBuyChecklist · OleSeasoningSteps · OleChipMap · OleTempLadder · OleLeadCard · OleCostTier · OleLesson
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, HAND, hexA, rnd, woodBg, notebookBg, kraftBg } from "./OleTheme";

const useT = () => { const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); return { t: f / fps, f, fps, dur: durationInFrames / fps }; };
const ramp = (t: number, a: number, d = 0.5) => Math.max(0, Math.min(1, (t - a) / d));
const eo = Easing.bezier(0.16, 1, 0.3, 1);
const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** fondo: el plano anterior desenfocado (bed) o madera de repisa */
const Bed: React.FC<{ src?: string; tone?: "wood" | "kraft" | "dark" }> = ({ src, tone = "wood" }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  if (!src) return <AbsoluteFill style={tone === "kraft" ? kraftBg() : tone === "dark" ? { background: "radial-gradient(ellipse at 50% 40%, #4a3320, #21150b 80%)" } : woodBg()} />;
  const s = 1.04 + 0.05 * (f / Math.max(1, durationInFrames));
  const url = /^(https?:|\/|data:)/.test(src) ? src : staticFile(src);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: "blur(6px) saturate(0.9)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.kraftL }}>
      {/\.(mp4|webm|mov)$/i.test(src) ? <OffthreadVideo src={url} muted style={st} /> : <Img src={url} style={st} />}
      <AbsoluteFill style={{ backgroundColor: hexA(tone === "dark" ? "#1a1008" : OLE.cream, tone === "dark" ? 0.45 : 0.2) }} />
    </AbsoluteFill>
  );
};

const Tin: React.FC<{ w: number; h: number; style?: React.CSSProperties; children: React.ReactNode; rim?: string }> = ({ w, h, style, children, rim = "#F1F4F7" }) => (
  <div style={{ width: w, height: h, borderRadius: 16, position: "relative", overflow: "hidden", background: `radial-gradient(circle at 25% 20%, #3f75a6, ${OLE.enamel} 55%, #234a70)`,
    border: `9px solid ${rim}`, boxShadow: "0 18px 36px rgba(15,20,30,0.5), inset 0 0 0 3px rgba(20,40,70,0.55)", ...style }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${hexA("#FFFFFF", 0.55)} 1.2px, transparent 1.6px), radial-gradient(${hexA("#0d2136", 0.4)} 1px, transparent 1.5px)`, backgroundSize: "23px 19px, 31px 27px", backgroundPosition: "0 0, 11px 9px", opacity: 0.55 }} />
    <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
  </div>
);
const Paper: React.FC<{ w: number; style?: React.CSSProperties; children: React.ReactNode; notebook?: boolean }> = ({ w, style, children, notebook }) => (
  <div style={{ width: w, borderRadius: 6, boxShadow: `0 22px 44px ${OLE.shadow}, 0 3px 8px rgba(0,0,0,0.2), inset 0 0 40px rgba(170,120,60,0.16)`, ...(notebook ? notebookBg(OLE.paper, 54) : { background: `radial-gradient(ellipse at 30% 20%, #FFFBF1, ${OLE.paper} 60%, #EFE4CB)` }), ...style }}>{children}</div>
);
const Pencil: React.FC<{ d: string; p: number; color?: string; sw?: number; w: number; h: number; style?: React.CSSProperties }> = ({ d, p, color = OLE.plaid, sw = 7, w, h, style }) => (
  <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}><path d={d} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} /></svg>
);
const Tick: React.FC<{ p: number; size?: number; seed?: number }> = ({ p, size = 64, seed = 1 }) => <Pencil w={size} h={size} p={p} color="#2E6B3E" sw={size * 0.12} d={`M${size * 0.1},${size * 0.55} L${size * 0.38},${size * 0.85} L${size * 0.92},${size * (0.12 + rnd(seed) * 0.05)}`} />;
const Cross: React.FC<{ p: number; size?: number }> = ({ p, size = 64 }) => (<><Pencil w={size} h={size} p={Math.min(1, p * 2)} color="#A32626" sw={size * 0.12} d={`M${size * 0.14},${size * 0.14} L${size * 0.86},${size * 0.86}`} /><Pencil w={size} h={size} p={Math.max(0, p * 2 - 1)} color="#A32626" sw={size * 0.12} d={`M${size * 0.86},${size * 0.14} L${size * 0.14},${size * 0.86}`} /></>);

// ───────── glifos simples (calor · reparto · arreglo · tapa) ─────────
const Glyph: React.FC<{ kind: string; s?: number }> = ({ kind, s = 120 }) => {
  const c = "#F1F4F7", sw = 6;
  const P: Record<string, React.ReactNode> = {
    heat: <path d="M60 14 C74 36 90 46 84 72 C80 92 40 96 36 72 C34 56 48 52 50 36 C54 44 60 40 60 14 Z" fill="none" stroke={c} strokeWidth={sw} strokeLinejoin="round" />,
    spread: <g stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none"><circle cx="60" cy="60" r="10" fill={c} />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1={60 + Math.cos((a * Math.PI) / 180) * 24} y1={60 + Math.sin((a * Math.PI) / 180) * 24} x2={60 + Math.cos((a * Math.PI) / 180) * 48} y2={60 + Math.sin((a * Math.PI) / 180) * 48} />)}</g>,
    fix: <g stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none"><path d="M30 92 L70 52" /><path d="M64 26 C78 20 96 34 88 50 L80 48 L72 56 L64 48 L66 40 Z" /></g>,
    lid: <g stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none"><path d="M18 70 Q60 22 102 70 Z" /><path d="M56 34 Q60 22 64 34" /><path d="M12 80 H108" /></g>,
  };
  return <svg width={s} height={s} viewBox="0 0 120 120">{P[kind]}</svg>;
};

export type QCard = { glyph: "heat" | "spread" | "fix" | "lid"; label: string; sub?: string };
/** CRITERIO: 4 tarjetas de lata esmaltada caen sobre la mesa, una por pregunta (beats en s desde el inicio de la toma) */
export const OleFourQuestions: React.FC<{ items: QCard[]; beats?: number[]; bed?: string; kicker?: string }> = ({ items, beats = [0.2, 1.4, 2.7, 4.0], bed, kicker }) => {
  const { t } = useT(); const n = items.length; const W = 380, gap = 34; const x0 = (1920 - (n * W + (n - 1) * gap)) / 2;
  return (
    <AbsoluteFill><Bed src={bed} />
      {kicker ? <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: LABEL, fontSize: 34, letterSpacing: 9, color: OLE.fire, fontWeight: 700, opacity: ramp(t, 0, 0.5) }}>{kicker}</div> : null}
      {items.map((it, i) => { const p = eo(ramp(t, beats[i] ?? 0.2 + i * 1.3, 0.7)); const y = (1 - p) * -700; const rot = (rnd(i + 3) - 0.5) * 6 + (1 - p) * -14;
        return <div key={i} style={{ position: "absolute", left: x0 + i * (W + gap), top: 250 + y, rotate: `${rot}deg`, opacity: Math.min(1, p * 3) }}>
          <Tin w={W} h={470}>
            <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: "#F1F4F7" }}>{i + 1}</div>
            <div style={{ position: "absolute", top: 150, width: "100%", display: "flex", justifyContent: "center" }}><Glyph kind={it.glyph} /></div>
            <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: "#F1F4F7", lineHeight: 1.05, padding: "0 20px", boxSizing: "border-box" }}>{it.label}</div>
            {it.sub ? <div style={{ position: "absolute", top: 385, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 32, color: hexA("#F1F4F7", 0.85) }}>{it.sub}</div> : null}
          </Tin></div>; })}
    </AbsoluteFill>
  );
};

export type CheckRow = { label: string; verdict: "ok" | "no"; sub?: string };
/** cómo elegir/comprar: libreta de cocinero con tildes y cruces a lápiz (giro, nudillo, grietas, óxido) */
export const OleBuyChecklist: React.FC<{ title: string; rows: CheckRow[]; beats?: number[]; bed?: string }> = ({ title, rows, beats, bed }) => {
  const { t } = useT(); const inP = eo(ramp(t, 0.1, 0.7));
  return (
    <AbsoluteFill><Bed src={bed} />
      <div style={{ position: "absolute", left: 470, top: 90, translate: `0 ${(1 - inP) * 90}px`, opacity: inP, rotate: "-1.2deg" }}>
        <Paper w={980} notebook style={{ padding: "44px 60px 48px 130px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: OLE.forest, lineHeight: 1.02, marginBottom: 14 }}>{title}</div>
          {rows.map((r, i) => { const a = ramp(t, (beats?.[i] ?? 0.9 + i * 1.1), 0.5); const m = ramp(t, (beats?.[i] ?? 0.9 + i * 1.1) + 0.35, 0.5);
            return <div key={i} style={{ position: "relative", height: 116, display: "flex", alignItems: "center", opacity: a, translate: `${(1 - eo(a)) * 40}px 0` }}>
              <div style={{ position: "relative", width: 76, height: 76, marginRight: 24 }}>{r.verdict === "ok" ? <Tick p={m} size={76} seed={i} /> : <Cross p={m} size={76} />}</div>
              <div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: OLE.pencil, lineHeight: 1 }}>{r.label}</div>{r.sub ? <div style={{ fontFamily: HAND, fontSize: 34, color: r.verdict === "ok" ? "#2E6B3E" : "#A32626" }}>{r.sub}</div> : null}</div></div>; })}
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

export type SeasonStep = { label: string; sub?: string };
/** curado del hierro: 5 estaciones a lápiz sobre libreta + un dial de horno que llega a la temperatura de props */
export const OleSeasoningSteps: React.FC<{ steps: SeasonStep[]; dial?: { to: number; label?: string }; beats?: number[]; bed?: string }> = ({ steps, dial, beats, bed }) => {
  const { t } = useT(); const n = steps.length;
  return (
    <AbsoluteFill><Bed src={bed} />
      <div style={{ position: "absolute", left: 90, top: 130 }}>
        <Paper w={1740} notebook style={{ padding: "40px 40px 40px 120px", boxSizing: "border-box", height: 540, display: "flex", gap: 24, alignItems: "flex-start" }}>
          {steps.map((s, i) => { const a = eo(ramp(t, beats?.[i] ?? 0.3 + i * 1.0, 0.6));
            return <div key={i} style={{ flex: 1, opacity: a, translate: `0 ${(1 - a) * 50}px` }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: OLE.fire, lineHeight: 0.9 }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: OLE.forest, lineHeight: 1.05, marginTop: 10 }}>{s.label}</div>
              {s.sub ? <div style={{ fontFamily: HAND, fontSize: 34, color: OLE.pencil, marginTop: 10, lineHeight: 1.15 }}>{s.sub}</div> : null}
            </div>; })}
          {n ? null : null}
        </Paper>
      </div>
      {dial ? (() => { const p = ease(ramp(t, (beats?.[2] ?? 2.5), 2)); const deg = -120 + p * 240 * (dial.to / 550);
        return <div style={{ position: "absolute", left: 1500, top: 700, width: 300, height: 300, opacity: ramp(t, (beats?.[2] ?? 2.5) - 0.3, 0.5) }}>
          <svg viewBox="0 0 300 300" width={300} height={300}><circle cx="150" cy="150" r="140" fill="#F1F4F7" stroke="#1B1A18" strokeWidth="10" /><circle cx="150" cy="150" r="120" fill="#fff" stroke="#c9ccd0" strokeWidth="3" />
            {Array.from({ length: 12 }).map((_, k) => { const a = ((-120 + k * 21.8) * Math.PI) / 180 - Math.PI / 2; return <line key={k} x1={150 + Math.cos(a) * 100} y1={150 + Math.sin(a) * 100} x2={150 + Math.cos(a) * 118} y2={150 + Math.sin(a) * 118} stroke="#333" strokeWidth="4" />; })}
            <g transform={`rotate(${deg} 150 150)`}><polygon points="144,150 156,150 150,44" fill={OLE.plaid} /><circle cx="150" cy="150" r="14" fill="#1B1A18" /></g></svg>
          <div style={{ position: "absolute", top: 235, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: OLE.forest }}>{Math.round(p * dial.to)}°F</div>
          {dial.label ? <div style={{ position: "absolute", top: 296, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 32, color: OLE.kraftL, textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}>{dial.label}</div> : null}
        </div>; })() : null}
    </AbsoluteFill>
  );
};

export type Chip = { x: number; y: number; where: "outside" | "inside" };
/** olla enlozada en corte: una astilla afuera (sigue sirviendo) vs adentro (se retira) */
export const OleChipMap: React.FC<{ chips: Chip[]; okLabel: string; noLabel: string; title?: string; bed?: string; beats?: number[] }> = ({ chips, okLabel, noLabel, title, bed, beats }) => {
  const { t } = useT(); const inP = eo(ramp(t, 0.1, 0.8));
  return (
    <AbsoluteFill><Bed src={bed} tone="kraft" />
      <div style={{ position: "absolute", left: 300, top: 130, width: 1320, opacity: inP, translate: `0 ${(1 - inP) * 60}px` }}>
        <svg viewBox="0 0 1320 760" width={1320} height={760}>
          <defs><pattern id="sp" width="26" height="22" patternUnits="userSpaceOnUse"><circle cx="5" cy="6" r="1.7" fill="#2a2f36" opacity="0.55" /><circle cx="18" cy="16" r="1.3" fill="#7d8791" opacity="0.6" /></pattern></defs>
          <path d="M260 120 L1060 120 L1090 640 Q1090 690 1040 690 L280 690 Q230 690 230 640 Z" fill="#EDEFEA" stroke={OLE.enamel} strokeWidth="14" strokeLinejoin="round" /><path d="M260 120 L1060 120 L1090 640 Q1090 690 1040 690 L280 690 Q230 690 230 640 Z" fill="url(#sp)" />
          <path d="M300 150 L1020 150 L1044 630 Q1044 660 1014 660 L306 660 Q276 660 276 630 Z" fill="none" stroke="#b8bcc2" strokeWidth="4" strokeDasharray="3 10" />
          <ellipse cx="660" cy="120" rx="400" ry="34" fill="#F7F9F7" stroke={OLE.enamel} strokeWidth="12" />
          <path d="M230 260 Q140 260 140 320 Q140 380 230 380" fill="none" stroke={OLE.enamel} strokeWidth="22" strokeLinecap="round" />
          <text x="660" y="420" textAnchor="middle" fontFamily={HAND} fontSize="52" fill={hexA(OLE.mute, 0.7)}>{title ?? ""}</text>
        </svg>
        {chips.map((c, i) => { const a = eo(ramp(t, beats?.[i] ?? 1.2 + i * 1.5, 0.5)); const inside = c.where === "inside"; const col = inside ? "#A32626" : "#2E6B3E";
          return <div key={i} style={{ position: "absolute", left: c.x, top: c.y, translate: "-50% -50%", opacity: a }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#3a3d42", border: `6px solid ${col}`, scale: String(0.6 + 0.4 * a), boxShadow: "0 0 0 8px rgba(255,255,255,0.4)" }} />
            <div style={{ position: "absolute", ...(inside ? { left: 70 } : { right: 70, textAlign: "right" }), top: -6, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: col, textShadow: "0 2px 3px rgba(255,255,255,0.7)" }}>{inside ? noLabel : okLabel}</div>
          </div>; })}
      </div>
    </AbsoluteFill>
  );
};

export type Rung = { at: number; label: string; tone?: "cool" | "warn" | "hot" };
/** escalera de temperatura (termómetro de cocina): marca el límite del fabricante con su fuente al pie */
export const OleTempLadder: React.FC<{ rungs: Rung[]; max?: number; unit?: string; source?: string; kicker?: string; bed?: string; beats?: number[]; focusAt?: number }> = ({ rungs, max = 700, unit = "°F", source, kicker, bed, beats, focusAt }) => {
  const { t } = useT(); const H = 760; const y = (v: number) => 130 + H - (v / max) * H;
  const fill = ease(ramp(t, 0.4, 3.2)); const cur = fill * (focusAt ?? max * 0.85);
  return (
    <AbsoluteFill><Bed src={bed} tone="dark" />
      {kicker ? <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center", fontFamily: LABEL, fontSize: 32, letterSpacing: 8, color: OLE.ember, fontWeight: 600 }}>{kicker}</div> : null}
      <div style={{ position: "absolute", left: 500, top: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 118, width: 70, height: H + 24, borderRadius: 35, background: "#F1F4F7", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 14, top: y(cur), width: 42, height: 130 + H - (y(cur) - 130) - 6 + 6, borderRadius: 21, background: `linear-gradient(0deg, #C0392B, ${OLE.fire})` }} />
        <div style={{ position: "absolute", left: -18, top: 850, width: 106, height: 106, borderRadius: "50%", background: "#C0392B", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
        {rungs.map((r, i) => { const a = eo(ramp(t, beats?.[i] ?? 1.0 + i * 1.3, 0.5)); const col = r.tone === "hot" ? "#E5533D" : r.tone === "warn" ? OLE.ember : OLE.kraftL;
          return <div key={i} style={{ position: "absolute", left: 90, top: y(r.at) - 34, display: "flex", alignItems: "center", gap: 20, opacity: a, translate: `${(1 - a) * -40}px 0` }}>
            <div style={{ width: 70, height: 6, background: col }} />
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 60, color: col, minWidth: 190 }}>{r.at}{unit}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: OLE.paper, textShadow: "0 2px 5px rgba(0,0,0,0.7)", whiteSpace: "nowrap", lineHeight: 1.05 }}>{r.label}</div>
          </div>; })}
      </div>
      {source ? <div style={{ position: "absolute", bottom: 28, width: "100%", textAlign: "center", fontFamily: LABEL, fontSize: 22, letterSpacing: 3, color: hexA(OLE.kraftL, 0.9) }}>{source}</div> : null}
    </AbsoluteFill>
  );
};

/** consejo de la FDA: tarjeta kraft de precaución, sin dramatismo (fuente al pie) */
export const OleLeadCard: React.FC<{ title: string; bullets: string[]; source?: string; bed?: string; beats?: number[]; tag?: string }> = ({ title, bullets, source, bed, beats, tag }) => {
  const { t } = useT(); const inP = eo(ramp(t, 0.1, 0.7));
  return (
    <AbsoluteFill><Bed src={bed} />
      <div style={{ position: "absolute", left: 360, top: 120, width: 1200, opacity: inP, translate: `0 ${(1 - inP) * 70}px`, rotate: "0.8deg" }}>
        <div style={{ ...kraftBg(), padding: "48px 70px 52px", borderRadius: 8, boxShadow: `0 24px 50px ${OLE.shadow}, inset 0 0 0 4px ${hexA(OLE.forest, 0.5)}`, position: "relative" }}>
          <div style={{ position: "absolute", top: 26, right: 34, width: 34, height: 34, borderRadius: "50%", background: OLE.forest2, boxShadow: "inset 0 0 0 5px #C9A66B" }} />
          {tag ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 7, color: OLE.plaid }}>{tag}</div> : null}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, color: OLE.forest, lineHeight: 1.03, margin: "8px 0 20px" }}>{title}</div>
          {bullets.map((b, i) => { const a = eo(ramp(t, beats?.[i] ?? 0.9 + i * 1.2, 0.5)); return <div key={i} style={{ display: "flex", gap: 22, alignItems: "baseline", opacity: a, translate: `${(1 - a) * 30}px 0`, marginBottom: 10 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: OLE.fire }}>›</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: OLE.pencil, lineHeight: 1.1 }}>{b}</div></div>; })}
          {source ? <div style={{ marginTop: 26, fontFamily: LABEL, fontSize: 24, letterSpacing: 3, color: hexA(OLE.mute, 0.95) }}>{source}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** costo RELATIVO ($ / $$ / $$$) como en el libro: fichas de lata; no son precios */
export const OleCostTier: React.FC<{ tier: 1 | 2 | 3; label?: string; caption?: string; x?: number; y?: number }> = ({ tier, label = "COST", caption, x = 0.82, y = 0.2 }) => {
  const { t } = useT(); const a = eo(ramp(t, 0.15, 0.6));
  return (
    <AbsoluteFill><div style={{ position: "absolute", left: 1920 * x, top: 1080 * y, translate: "-50% -50%", opacity: a, scale: String(0.85 + 0.15 * a), rotate: "3deg" }}>
      <Tin w={360} h={230}>
        <div style={{ textAlign: "center", paddingTop: 16, fontFamily: LABEL, fontWeight: 600, fontSize: 26, letterSpacing: 8, color: hexA("#F1F4F7", 0.9) }}>{label}</div>
        <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 100, letterSpacing: 6, marginTop: 2 }}>
          {[1, 2, 3].map((k) => <span key={k} style={{ color: k <= tier ? "#F6D77A" : hexA("#F1F4F7", 0.25), opacity: ramp(t, 0.3 + k * 0.18, 0.3) }}>$</span>)}
        </div>
        {caption ? <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 30, color: "#F1F4F7" }}>{caption}</div> : null}
      </Tin></div></AbsoluteFill>
  );
};

/** «lo que me enseñaron 40 años»: una línea escrita a lápiz en la libreta, letra por letra */
export const OleLesson: React.FC<{ kicker: string; text: string; bed?: string; x?: number; y?: number }> = ({ kicker, text, bed, x = 0.5, y = 0.5 }) => {
  const { t } = useT(); const inP = eo(ramp(t, 0.1, 0.6)); const chars = Math.floor(ramp(t, 0.9, Math.max(1.2, text.length * 0.055)) * text.length);
  return (
    <AbsoluteFill>{bed ? <Bed src={bed} /> : null}
      <div style={{ position: "absolute", left: 1920 * x, top: 1080 * y, translate: "-50% -50%", opacity: inP, rotate: "-1.5deg", scale: String(0.94 + 0.06 * inP) }}>
        <Paper w={1180} notebook style={{ padding: "40px 60px 44px 130px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: OLE.fire }}>{kicker}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 68, color: OLE.pencil, lineHeight: 1.18, marginTop: 8, minHeight: 170 }}>{text.slice(0, chars)}<span style={{ opacity: chars < text.length ? 1 : 0 }}>|</span></div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};
