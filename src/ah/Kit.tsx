// Kit del canal Ancient Humans (piloto ahnight): el RELOJ DE LA NOCHE (firma), YOU vs THEM, contador,
// cita de estudio con fuente, callout sobre la foto, barras de sueño, anillo de centinelas, luna/muescas y brasas.
// Todos aceptan una foto/clip como cama (`bed`) y siguen la paleta de fuego de ./theme.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../yc/Media";
import { AH, BIG, MONO, SANS, SERIF, TSH, clamp, ease, easeInOut, lerp, rnd } from "./theme";

const useLife = (inF = 10, outF = 10) => {
  const f = useCurrentFrame(); const { durationInFrames: D, fps } = useVideoConfig();
  return { f, D, fps, a: clamp(f / inF) * (1 - clamp((f - (D - outF)) / outF)) };
};
const Bed: React.FC<{ src?: string; start?: number; dim?: number; kb?: "in" | "out" | "left" | "right" }> = ({ src, start, dim = 0.55, kb = "in" }) =>
  src ? (
    <AbsoluteFill>
      <Media src={src} start={start} kb={kb} zoom={1.1} />
      <AbsoluteFill style={{ background: `rgba(10,7,4,${dim})` }} />
    </AbsoluteFill>
  ) : <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, ${AH.ink2}, ${AH.ink})` }} />;

// hora "6:48 PM" → fracción de la noche (18:00 = 0 · 06:00 = 1; DAWN = 1)
export const nightFrac = (t: string) => {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return /dawn/i.test(t) ? 0.97 : 0;
  let h = +m[1] % 12 + (m[3].toUpperCase() === "PM" ? 12 : 0);
  const mins = h * 60 + +m[2];
  const rel = (mins - 18 * 60 + 24 * 60) % (24 * 60);
  return clamp(rel / (12 * 60));
};

// ─── EL RELOJ DE LA NOCHE (firma del canal) ──────────────────────────────────
// Arco del cielo de horizonte a horizonte (puesta → amanecer); la luna/brasa viaja desde la hora anterior
// hasta la de este capítulo, la hora cae en dígitos mono y el título se tipea con subrayado de brasa.
export const NightClock: React.FC<{ time: string; title: string; prev?: string; bed?: string; bedStart?: number; n?: number }> =
  ({ time, title, prev, bed, bedStart, n }) => {
  const { f, D, fps, a } = useLife(8, 10);
  const fr1 = nightFrac(time), fr0 = prev ? nightFrac(prev) : Math.max(0, fr1 - 0.08);
  const mv = easeInOut(clamp((f - 6) / 34));
  const fr = lerp(fr0, fr1, mv);
  const cx = 960, cy = 930, R = 640;
  const pt = (t: number, r = R) => { const ang = Math.PI * (1 - t); return [cx + Math.cos(ang) * r, cy - Math.sin(ang) * r]; };
  const [mx, my] = pt(fr);
  const draw = ease(clamp(f / 22));
  const arcLen = Math.PI * R;
  const hours = ["6 PM", "7", "8", "9", "10", "11", "12 AM", "1", "2", "3", "4", "5", "6 AM"];
  // hora: dígitos que caen uno por uno
  const chars = time.split("");
  const tStart = 16;
  const shown = Math.max(0, Math.floor(((f - 30) / fps) * 22));
  const typed = title.slice(0, shown);
  const ul = clamp(shown / Math.max(1, title.length));
  const nightness = Math.sin(Math.PI * clamp(fr)) ; // más estrellas en el medio de la noche
  const exit = clamp((f - (D - 12)) / 12);
  return (
    <AbsoluteFill style={{ opacity: a, background: AH.ink }}>
      <Bed src={bed} start={bedStart} dim={0.28} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,10,18,0.45) 0%, rgba(8,6,4,0.08) 45%, rgba(8,6,4,0.7) 100%)" }} />
      {/* estrellas */}
      {Array.from({ length: 70 }, (_, i) => {
        const x = rnd(i) * 1920, y = rnd(i + 50) * 520;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (12 + rnd(i + 9) * 20) + i));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 2 + rnd(i + 3) * 2.5, height: 2 + rnd(i + 3) * 2.5, borderRadius: 4, background: "#fff", opacity: (0.15 + 0.6 * nightness) * tw * draw }} />;
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="ahArc" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={AH.ember} /><stop offset="0.5" stopColor={AH.moon} /><stop offset="1" stopColor={AH.flame} />
          </linearGradient>
          <radialGradient id="ahGlow"><stop offset="0" stopColor={AH.flame} stopOpacity="0.9" /><stop offset="1" stopColor={AH.ember} stopOpacity="0" /></radialGradient>
        </defs>
        {/* horizonte */}
        <line x1={120} x2={1800} y1={cy} y2={cy} stroke={AH.bone} strokeOpacity={0.35 * draw} strokeWidth={2} />
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="url(#ahArc)" strokeOpacity={0.35} strokeWidth={3}
          strokeDasharray={arcLen} strokeDashoffset={arcLen * (1 - draw)} />
        {/* tramo recorrido */}
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${mx} ${my}`} fill="none" stroke={AH.amber} strokeWidth={6} strokeLinecap="round" opacity={draw} />
        {hours.map((h, i) => {
          const t = i / 12; const [x0, y0] = pt(t, R - 14); const [x1, y1] = pt(t, R + 14); const [lx, ly] = pt(t, R + 44);
          const big = i % 3 === 0;
          return <g key={i} opacity={draw * clamp((f - i) / 6)}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={AH.bone} strokeWidth={big ? 3 : 1.5} strokeOpacity={big ? 0.9 : 0.5} />
            {big ? <text x={lx} y={ly + 8} fill={AH.bone} fillOpacity={0.85} fontFamily={MONO} fontSize={24} textAnchor="middle">{h}</text> : null}
          </g>;
        })}
        <circle cx={mx} cy={my} r={70} fill="url(#ahGlow)" opacity={draw} />
        <circle cx={mx} cy={my} r={16} fill={AH.flame} opacity={draw} />
      </svg>
      {n !== undefined ? <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SANS, fontSize: 26, letterSpacing: 14, color: AH.amber, opacity: ease(clamp((f - 10) / 12)), textShadow: TSH }}>
        CHAPTER {n}</div> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", transform: `scale(${1 + exit * 0.15})` }}>
        {chars.map((c, i) => {
          const s = spring({ frame: f - tStart - i * 3, fps, config: { damping: 14, stiffness: 120 } });
          return <span key={i} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 150, color: AH.bone, width: c === " " ? 40 : undefined, display: "inline-block",
            opacity: clamp(s * 1.4), transform: `translateY(${(1 - s) * -60}px)`, textShadow: `0 0 40px rgba(255,138,42,0.45), ${TSH}` }}>{c}</span>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center" }}>
        <span style={{ fontFamily: BIG, fontSize: 70, letterSpacing: 4, color: AH.flame, textShadow: TSH, position: "relative" }}>
          {typed}<span style={{ opacity: shown < title.length && f % 16 < 8 ? 1 : 0 }}>|</span>
          <div style={{ position: "absolute", left: 0, bottom: -12, height: 5, width: `${ul * 100}%`, background: AH.ember, boxShadow: `0 0 18px ${AH.ember}` }} />
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── RELOJ CHICO DE ESQUINA (entre capítulos) ────────────────────────────────
export const ClockBug: React.FC<{ time: string; label?: string }> = ({ time, label }) => {
  const { f, a } = useLife(12, 12);
  const fr = nightFrac(time);
  return (
    <AbsoluteFill style={{ opacity: a * 0.95, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 56, top: 48, display: "flex", alignItems: "center", gap: 16, padding: "10px 20px 10px 14px",
        background: "rgba(12,9,6,0.62)", border: `1px solid rgba(245,176,74,0.45)`, borderRadius: 40 }}>
        <svg width={64} height={36}><path d="M 4 32 A 28 28 0 0 1 60 32" fill="none" stroke={AH.boneDim} strokeOpacity={0.5} strokeWidth={2} />
          {(() => { const ang = Math.PI * (1 - fr); const x = 32 + Math.cos(ang) * 28, y = 32 - Math.sin(ang) * 28;
            return <><path d={`M 4 32 A 28 28 0 0 1 ${x} ${y}`} fill="none" stroke={AH.amber} strokeWidth={3} /><circle cx={x} cy={y} r={5} fill={AH.flame} /></>; })()}
        </svg>
        <div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: AH.bone, lineHeight: 1 }}>{time}</div>
          {label ? <div style={{ fontFamily: SANS, fontSize: 15, letterSpacing: 4, color: AH.amber, marginTop: 4 }}>{label}</div> : null}
        </div>
      </div>
      {void f}
    </AbsoluteFill>
  );
};

// ─── YOU · 2026 vs THEM · 38,000 BC ──────────────────────────────────────────
type Side = { src: string; start?: number; tag: string; line?: string };
export const YouThem: React.FC<{ you: Side; them: Side; source?: string }> = ({ you, them, source }) => {
  const { f, a, fps } = useLife(6, 10);
  const sl = spring({ frame: f, fps, config: { damping: 20, stiffness: 90 } });
  const sr = spring({ frame: f - 8, fps, config: { damping: 20, stiffness: 90 } });
  const panel = (s: Side, left: boolean, k: number, delay: number) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: left ? 0 : 960, width: 960, overflow: "hidden",
      transform: `translateX(${(1 - k) * (left ? -960 : 960)}px)` }}>
      <Media src={s.src} start={s.start} kb={left ? "right" : "left"} zoom={1.12} filter={left ? "saturate(0.85) hue-rotate(-8deg)" : undefined} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)" }} />
      <div style={{ position: "absolute", top: 64, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: 10, color: left ? AH.moon : AH.flame, textShadow: TSH }}>{s.tag}</span>
      </div>
      {s.line ? <div style={{ position: "absolute", bottom: 70, left: 60, right: 60, textAlign: "center", fontFamily: SANS, fontSize: 50, color: AH.bone, textShadow: TSH,
        opacity: ease(clamp((f - delay) / 12)), transform: `translateY(${(1 - ease(clamp((f - delay) / 12))) * 20}px)` }}>{s.line}</div> : null}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: a, background: AH.ink }}>
      {panel(you, true, sl, 20)}
      {panel(them, false, sr, 34)}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 957, width: 6, background: AH.ember, boxShadow: `0 0 30px ${AH.ember}`, transform: `scaleY(${ease(clamp((f - 10) / 16))})` }} />
      <div style={{ position: "absolute", left: 960 - 46, top: 540 - 46, width: 92, height: 92, borderRadius: 46, background: AH.ink, border: `4px solid ${AH.ember}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BIG, fontSize: 38, color: AH.bone, transform: `scale(${spring({ frame: f - 18, fps, config: { damping: 11 } })})` }}>VS</div>
      {source ? <div style={{ position: "absolute", right: 40, bottom: 22, fontFamily: MONO, fontSize: 20, color: AH.amber, textShadow: TSH }}>{source}</div> : null}
    </AbsoluteFill>
  );
};

// ─── CONTADOR ────────────────────────────────────────────────────────────────
export const Counter: React.FC<{ to: number; from?: number; decimals?: number; prefix?: string; suffix?: string; label: string; sub?: string; bed?: string; bedStart?: number; side?: "left" | "center" }> =
  ({ to, from = 0, decimals = 0, prefix = "", suffix = "", label, sub, bed, bedStart, side = "left" }) => {
  const { f, a, fps } = useLife(8, 10);
  const t = easeInOut(clamp((f - 8) / (fps * 1.6)));
  const v = lerp(from, to, t);
  const txt = v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const done = t >= 1 ? spring({ frame: f - 8 - fps * 1.6, fps, config: { damping: 9 } }) : 0;
  const al = side === "center" ? "center" : "left";
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <Bed src={bed} start={bedStart} dim={0.35} />
      <AbsoluteFill style={{ background: side === "center" ? "radial-gradient(ellipse at 50% 55%, rgba(8,6,4,0.8), rgba(8,6,4,0.3))" : "linear-gradient(90deg, rgba(8,6,4,0.9) 0%, rgba(8,6,4,0.6) 50%, rgba(8,6,4,0) 85%)" }} />
      <div style={{ position: "absolute", left: side === "center" ? 0 : 130, right: side === "center" ? 0 : undefined, top: 300, textAlign: al as any }}>
        <div style={{ fontFamily: BIG, fontSize: 250, lineHeight: 1, color: AH.flame, textShadow: `0 0 50px rgba(255,138,42,0.5), ${TSH}`, transform: `scale(${1 + done * 0.04})`, transformOrigin: side === "center" ? "50% 50%" : "0% 50%" }}>
          {prefix}{txt}<span style={{ fontSize: 120, color: AH.bone }}>{suffix}</span></div>
        <div style={{ fontFamily: SANS, fontSize: 50, letterSpacing: 5, color: AH.bone, marginTop: 20, textShadow: TSH, opacity: ease(clamp((f - 16) / 12)) }}>{label}</div>
        {sub ? <div style={{ fontFamily: MONO, fontSize: 26, color: AH.amber, marginTop: 18, textShadow: TSH, opacity: ease(clamp((f - 30) / 12)) }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ─── CITA DE ESTUDIO CON FUENTE ───────────────────────────────────────────────
export const StudyCard: React.FC<{ quote: string; source: string; kicker?: string; stat?: string; bed?: string; bedStart?: number; noQuote?: boolean }> =
  ({ quote, source, kicker = "THE STUDY", stat, bed, bedStart, noQuote }) => {
  const { f, a, fps } = useLife(8, 10);
  const words = quote.split(" ");
  const per = 3.2;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <Bed src={bed} start={bedStart} dim={0.4} kb="left" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.75) 60%, rgba(8,6,4,0.4) 100%)" }} />
      <div style={{ position: "absolute", left: 140, top: 190, width: 1420 }}>
        <div style={{ display: "inline-block", fontFamily: SANS, fontSize: 26, letterSpacing: 10, color: AH.ink, background: AH.amber, padding: "6px 18px", opacity: ease(clamp(f / 10)) }}>{kicker}</div>
        {noQuote ? <div style={{ height: 50 }} /> : <div style={{ fontFamily: SERIF, fontSize: 230, lineHeight: 0.6, color: AH.ember, marginTop: 60, height: 90, opacity: ease(clamp((f - 4) / 10)) }}>“</div>}
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 76, lineHeight: 1.18, color: AH.bone, textShadow: TSH }}>
          {words.map((w, i) => { const k = clamp((f - 10 - i * per) / 6); return <span key={i} style={{ opacity: k, display: "inline-block", transform: `translateY(${(1 - k) * 14}px)`, marginRight: 18 }}>{w}</span>; })}
        </div>
        {stat ? <div style={{ fontFamily: BIG, fontSize: 64, color: AH.flame, marginTop: 34, textShadow: TSH, opacity: ease(clamp((f - 16 - words.length * per) / 10)) }}>{stat}</div> : null}
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 18, opacity: ease(clamp((f - 20 - words.length * per) / 12)) }}>
          <div style={{ width: 70, height: 3, background: AH.amber }} />
          <div style={{ fontFamily: MONO, fontSize: 30, color: AH.amber, letterSpacing: 1 }}>{source}</div>
        </div>
      </div>
      {void fps}
    </AbsoluteFill>
  );
};

// ─── CALLOUT SOBRE LA FOTO ────────────────────────────────────────────────────
export const Callout: React.FC<{ x: number; y: number; label: string; sub?: string; side?: "left" | "right"; r?: number }> = ({ x, y, label, sub, side = "right", r = 70 }) => {
  const { f, a, fps } = useLife(6, 10);
  const ring = spring({ frame: f, fps, config: { damping: 12 } });
  const lx = side === "right" ? x + r + 200 : x - r - 200;
  const ly = y - 120;
  const line = ease(clamp((f - 8) / 12));
  const ex = lerp(x + (side === "right" ? r * 0.7 : -r * 0.7), lx, line), ey = lerp(y - r * 0.7, ly, line);
  const pulse = 1 + 0.08 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={x} cy={y} r={r * ring * pulse} fill="none" stroke={AH.flame} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${AH.ember})` }} />
        <line x1={x + (side === "right" ? r * 0.7 : -r * 0.7)} y1={y - r * 0.7} x2={ex} y2={ey} stroke={AH.flame} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", top: ly - 38, ...(side === "right" ? { left: lx } : { right: 1920 - lx }), opacity: ease(clamp((f - 18) / 10)),
        background: "rgba(12,9,6,0.8)", borderLeft: side === "right" ? `5px solid ${AH.ember}` : undefined, borderRight: side === "left" ? `5px solid ${AH.ember}` : undefined, padding: "10px 22px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: AH.bone }}>{label}</div>
        {sub ? <div style={{ fontFamily: MONO, fontSize: 22, color: AH.amber, marginTop: 4 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ─── BARRAS DE SUEÑO (noche de 6 PM a 8 AM) ───────────────────────────────────
const hToX = (h: number, x0: number, w: number) => x0 + ((h - 18 + 24) % 24) / 14 * w; // 18 → 0 · 8 → 1
export const SleepBars: React.FC<{ title: string; rows: { label: string; from: number; to: number; note?: string; you?: boolean }[]; marks?: { at: number; label: string }[]; bed?: string; source?: string }> =
  ({ title, rows, marks = [], bed, source }) => {
  const { f, a } = useLife(8, 10);
  const x0 = 360, w = 1360;
  const ticks = [18, 20, 22, 0, 2, 4, 6, 8];
  const lab = (h: number) => (h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`);
  return (
    <AbsoluteFill style={{ opacity: a, background: AH.ink }}>
      <Bed src={bed} dim={0.78} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: BIG, fontSize: 72, color: AH.bone, textShadow: TSH, letterSpacing: 2 }}>{title}</div>
      {ticks.map((h, i) => <div key={h} style={{ position: "absolute", left: hToX(h, x0, w) - 60, width: 120, top: 300, textAlign: "center", fontFamily: MONO, fontSize: 24, color: AH.boneDim, opacity: ease(clamp((f - i * 2) / 10)) }}>{lab(h)}
        <div style={{ margin: "10px auto 0", width: 2, height: 440, background: "rgba(239,230,212,0.14)" }} /></div>)}
      {marks.map((m, i) => { const k = ease(clamp((f - 20 - i * 6) / 10)); return <div key={i} style={{ position: "absolute", left: hToX(m.at, x0, w) - 1, top: 350, height: 400, width: 3, background: AH.moon, opacity: k }}>
        <div style={{ position: "absolute", top: 408, left: -120, width: 240, textAlign: "center", fontFamily: SANS, fontSize: 24, letterSpacing: 3, color: AH.moon }}>{m.label}</div></div>; })}
      {rows.map((r, i) => {
        const y = 400 + i * 130;
        const k = easeInOut(clamp((f - 16 - i * 14) / 26));
        const xa = hToX(r.from, x0, w), xb = hToX(r.to, x0, w);
        return <div key={i}>
          <div style={{ position: "absolute", left: 60, width: 280, top: y + 8, textAlign: "right", fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: r.you ? AH.moon : AH.flame }}>{r.label}</div>
          <div style={{ position: "absolute", left: xa, top: y, height: 58, width: (xb - xa) * k, borderRadius: 8, background: r.you ? `linear-gradient(90deg, ${AH.moonDeep}, ${AH.moon})` : `linear-gradient(90deg, ${AH.blood}, ${AH.amber})`, boxShadow: "0 6px 24px rgba(0,0,0,0.6)" }} />
          {r.note ? <div style={{ position: "absolute", left: xa, top: y + 64, fontFamily: MONO, fontSize: 22, color: AH.boneDim, opacity: clamp((f - 40 - i * 14) / 10) }}>{r.note}</div> : null}
        </div>;
      })}
      {source ? <div style={{ position: "absolute", right: 80, bottom: 50, fontFamily: MONO, fontSize: 22, color: AH.amber, opacity: 0.85 }}>{source}</div> : null}
    </AbsoluteFill>
  );
};

// ─── ANILLO DE CENTINELAS (ilustración de la hipótesis) ───────────────────────
// N durmientes alrededor del fuego; cada uno se despierta y se duerme a su hora; casi siempre hay alguien despierto.
export const SentinelRing: React.FC<{ n?: number; title: string; stat: string; statSub?: string; allAsleepAt?: number; source?: string }> =
  ({ n = 12, title, stat, statSub, allAsleepAt = 0.78, source }) => {
  const { f, D, a } = useLife(8, 10);
  const t = f / D;
  const cx = 960, cy = 590, R = 330;
  const awake = (i: number) => {
    if (Math.abs(t - allAsleepAt) < 0.04) return false;
    const ph = rnd(i + 5) * 6.28, sp = 0.9 + rnd(i + 17) * 1.6;
    const v = Math.sin(t * 14 * sp + ph) + (i === Math.floor(t * 9) % n ? 1.4 : 0);
    return v > 0.75;
  };
  const cnt = Array.from({ length: n }, (_, i) => awake(i)).filter(Boolean).length;
  const flick = 0.85 + 0.15 * Math.sin(f / 2.3) * Math.sin(f / 3.7);
  return (
    <AbsoluteFill style={{ opacity: a, background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,138,42,${0.32 * flick}) 0%, rgba(40,20,8,0.9) 26%, ${AH.ink} 60%)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: BIG, fontSize: 64, color: AH.bone, letterSpacing: 2 }}>{title}</div>
      <div style={{ position: "absolute", left: cx - 40, top: cy - 50, width: 80, height: 100, borderRadius: "50% 50% 40% 40%", background: `radial-gradient(ellipse at 50% 70%, ${AH.flame}, ${AH.ember} 45%, rgba(200,69,44,0) 72%)`, transform: `scale(${flick})`, filter: "blur(2px)" }} />
      {Array.from({ length: n }, (_, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R * 0.62;
        const aw = awake(i);
        const k = ease(clamp((f - i * 2) / 10));
        return <div key={i} style={{ position: "absolute", left: x - 70, top: y - 26, width: 140, height: 52, opacity: k, transform: `rotate(${(ang * 180) / Math.PI + 90}deg)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: aw ? "rgba(245,176,74,0.9)" : "rgba(120,108,92,0.55)", boxShadow: aw ? `0 0 26px ${AH.ember}` : "none" }} />
          <div style={{ position: "absolute", left: 10, top: 10, width: 32, height: 32, borderRadius: 16, background: aw ? AH.bone : "rgba(200,190,170,0.5)" }} />
        </div>;
      })}
      <div style={{ position: "absolute", right: 110, top: 380, width: 380, textAlign: "right" }}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: AH.boneDim, letterSpacing: 2 }}>AWAKE RIGHT NOW</div>
        <div style={{ fontFamily: BIG, fontSize: 130, color: cnt ? AH.flame : AH.blood, lineHeight: 1 }}>{cnt}<span style={{ fontSize: 50, color: AH.boneDim }}> / {n}</span></div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 380, width: 470, opacity: ease(clamp((f - 30) / 14)) }}>
        <div style={{ fontFamily: BIG, fontSize: 84, color: AH.flame, lineHeight: 1.05 }}>{stat}</div>
        {statSub ? <div style={{ fontFamily: SANS, fontSize: 32, color: AH.bone, marginTop: 12, letterSpacing: 2 }}>{statSub}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 110, bottom: 50, fontFamily: MONO, fontSize: 20, color: AH.boneDim }}>ILLUSTRATION</div>
      {source ? <div style={{ position: "absolute", right: 80, bottom: 50, fontFamily: MONO, fontSize: 22, color: AH.amber }}>{source}</div> : null}
    </AbsoluteFill>
  );
};

// ─── LUNA Y MUESCAS (el primer calendario, en debate) ─────────────────────────
export const MoonTally: React.FC<{ title: string; caption?: string; notches?: number; bed?: string; bedStart?: number; source?: string }> =
  ({ title, caption, notches = 29, bed, bedStart, source }) => {
  const { f, a } = useLife(8, 10);
  const phases = 8;
  return (
    <AbsoluteFill style={{ opacity: a, background: AH.ink }}>
      <Bed src={bed} start={bedStart} dim={0.72} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: BIG, fontSize: 70, color: AH.bone, textShadow: TSH }}>{title}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 46 }}>
        {Array.from({ length: phases }, (_, i) => {
          const k = ease(clamp((f - 8 - i * 5) / 10));
          const p = i / phases; // 0 nueva → 0.5 llena
          const lit = Math.cos(p * Math.PI * 2); // 1 nueva, -1 llena
          const off = lit * 60; const side = p < 0.5 ? 1 : -1;
          return <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: "#1d2530", position: "relative", overflow: "hidden", opacity: k, transform: `translateY(${(1 - k) * 30}px)`, boxShadow: `0 0 30px rgba(169,194,218,${0.15 + 0.35 * (1 - lit) / 2})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: AH.moon, clipPath: side > 0 ? "inset(0 0 0 50%)" : "inset(0 50% 0 0)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 60 - Math.abs(off), width: Math.abs(off) * 2, borderRadius: "50%", background: lit > 0 ? "#1d2530" : AH.moon }} />
          </div>;
        })}
      </div>
      {/* hueso con muescas */}
      <div style={{ position: "absolute", left: 360, right: 360, top: 580, height: 120, borderRadius: 60, background: "linear-gradient(180deg, #e9dcc0, #b9a57f 70%, #8d7a58)", boxShadow: "0 20px 50px rgba(0,0,0,0.7)", opacity: ease(clamp((f - 30) / 12)) }}>
        {Array.from({ length: notches }, (_, i) => { const k = clamp((f - 44 - i * 1.6) / 3); return <div key={i} style={{ position: "absolute", left: 70 + i * ((1200 - 140) / notches), top: 22, width: 7, height: 76 * k, borderRadius: 3, background: "#4a3a24" }} />; })}
      </div>
      {caption ? <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: SANS, fontSize: 44, color: AH.bone, textShadow: TSH, opacity: ease(clamp((f - 60) / 12)) }}>{caption}</div> : null}
      {source ? <div style={{ position: "absolute", right: 80, bottom: 50, fontFamily: MONO, fontSize: 22, color: AH.amber }}>{source}</div> : null}
    </AbsoluteFill>
  );
};

// ─── PALABRAS (texto cinético con palabras clave en brasa) ─────────────────────
export const Words: React.FC<{ text: string; keys?: string[]; bed?: string; bedStart?: number; align?: "left" | "center"; size?: number }> =
  ({ text, keys = [], bed, bedStart, align = "center", size = 110 }) => {
  const { f, a, fps } = useLife(6, 10);
  const words = text.split(" ");
  const cl = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
  const isKey = (w: string) => keys.some((k) => cl(w) && cl(w).startsWith(cl(k)));
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <Bed src={bed} start={bedStart} dim={0.5} />
      <AbsoluteFill style={{ background: align === "left" ? "linear-gradient(90deg, rgba(8,6,4,0.9), rgba(8,6,4,0.2))" : "radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.75), rgba(8,6,4,0.25))" }} />
      <div style={{ position: "absolute", left: align === "left" ? 130 : 140, right: align === "left" ? 500 : 140, top: 0, bottom: 0, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: align === "left" ? "flex-start" : "center", gap: `0 ${size * 0.28}px` }}>
        {words.map((w, i) => {
          const s = spring({ frame: f - 4 - i * 4, fps, config: { damping: 16, stiffness: 130 } });
          const key = isKey(w);
          return <span key={i} style={{ fontFamily: BIG, fontSize: size, lineHeight: 1.12, color: key ? AH.flame : AH.bone, opacity: clamp(s * 1.3), textShadow: key ? `0 0 34px rgba(255,138,42,0.55), ${TSH}` : TSH,
            transform: `translateY(${(1 - s) * 40}px) scale(${key ? 1 + 0.04 * s : 1})`, display: "inline-block" }}>{w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── RÓTULO DE LUGAR ──────────────────────────────────────────────────────────
export const PlaceStamp: React.FC<{ place: string; when: string }> = ({ place, when }) => {
  const { f, a, fps } = useLife(6, 12);
  const shown = Math.floor(((f - 6) / fps) * 30);
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, bottom: 110 }}>
        <div style={{ width: ease(clamp(f / 14)) * 90, height: 4, background: AH.ember, marginBottom: 16 }} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: 6, color: AH.bone, textShadow: TSH }}>{place.slice(0, Math.max(0, shown))}</div>
        <div style={{ fontFamily: MONO, fontSize: 28, color: AH.amber, marginTop: 6, textShadow: TSH, opacity: ease(clamp((f - 20) / 10)) }}>{when}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── BRASAS (transición / ambiente) ───────────────────────────────────────────
export const Embers: React.FC<{ n?: number; peak?: number }> = ({ n = 60, peak = 1 }) => {
  const { f, D } = useLife(1, 1);
  const env = Math.sin(Math.PI * clamp(f / D)) * peak;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 110%, rgba(255,138,42,${0.35 * env}), rgba(0,0,0,0) 60%)`, mixBlendMode: "screen" }} />
      {Array.from({ length: n }, (_, i) => {
        const sp = 4 + rnd(i) * 9;
        const y = 1120 - ((f * sp + rnd(i + 3) * 1200) % 1300);
        const x = rnd(i + 7) * 1920 + Math.sin(f / (10 + rnd(i) * 10) + i) * 30;
        const r = 2 + rnd(i + 11) * 5;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: rnd(i + 2) > 0.5 ? AH.flame : AH.ember,
          boxShadow: `0 0 ${r * 3}px ${AH.ember}`, opacity: env * (0.5 + 0.5 * rnd(i + 4)) }} />;
      })}
    </AbsoluteFill>
  );
};


// ─── DE QUÉ SE HABLA: DÍA vs NOCHE (barras 100 % apiladas) ────────────────────
type Seg = { label: string; pct: number; hot?: boolean };
export const TalkBars: React.FC<{ title: string; day: Seg[]; night?: Seg[]; source?: string; bed?: string }> = ({ title, day, night, source, bed }) => {
  const { f, a } = useLife(8, 10);
  const x0 = 380, W = 1340;
  const bar = (segs: Seg[], y: number, label: string, col: string, t0: number, dim: boolean) => {
    let acc = 0;
    return <div style={{ opacity: dim ? 0.45 : 1 }}>
      <div style={{ position: "absolute", left: 60, width: 290, top: y + 22, textAlign: "right", fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: col }}>{label}</div>
      {segs.map((sg, i) => {
        const k = easeInOut(clamp((f - t0 - i * 7) / 16));
        const x = x0 + (acc / 100) * W; const w = (sg.pct / 100) * W * k; acc += sg.pct;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: 96, background: sg.hot ? `linear-gradient(90deg, ${AH.blood}, ${AH.amber})` : `rgba(239,230,212,${0.12 + (i % 2) * 0.08})`, borderRight: "3px solid #0c0906", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 16, top: 12, whiteSpace: "nowrap", fontFamily: BIG, fontSize: 40, color: sg.hot ? AH.ink : AH.bone, opacity: clamp((f - t0 - i * 7 - 10) / 8) }}>{sg.pct}%</div>
          <div style={{ position: "absolute", left: 16, top: 58, whiteSpace: "nowrap", fontFamily: SANS, fontSize: 22, letterSpacing: 2, color: sg.hot ? AH.ink : AH.boneDim, opacity: clamp((f - t0 - i * 7 - 12) / 8) }}>{sg.label}</div>
        </div>;
      })}
    </div>;
  };
  return (
    <AbsoluteFill style={{ opacity: a, background: AH.ink }}>
      <Bed src={bed} dim={0.8} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: BIG, fontSize: 72, color: AH.bone, textShadow: TSH }}>{title}</div>
      {bar(day, 380, "DAY", AH.moon, 10, !!night)}
      {night ? bar(night, 560, "NIGHT", AH.flame, 16, false) : null}
      {source ? <div style={{ position: "absolute", right: 80, bottom: 60, fontFamily: MONO, fontSize: 22, color: AH.amber }}>{source}</div> : null}
    </AbsoluteFill>
  );
};

// ─── REPASO (lista que se tilda a medida que se dice; marcas t0..tN en cuadros) ─
export const Recap: React.FC<{ items: string[]; title?: string; [k: string]: any }> = (p) => {
  const { f, a } = useLife(8, 12);
  const { items, title } = p;
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(8,6,4,0.85) 0%, rgba(8,6,4,0.55) 35%, rgba(8,6,4,0) 60%)" }} />
      <div style={{ position: "absolute", right: 110, top: 200, width: 640 }}>
        {title ? <div style={{ fontFamily: SANS, fontSize: 28, letterSpacing: 8, color: AH.amber, marginBottom: 26 }}>{title}</div> : null}
        {items.map((it, i) => {
          const at = p["t" + i] ?? i * 30;
          const k = ease(clamp((f - at) / 10));
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 20, opacity: k, transform: `translateX(${(1 - k) * 40}px)` }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, border: `3px solid ${AH.ember}`, display: "flex", alignItems: "center", justifyContent: "center", color: AH.flame, fontFamily: BIG, fontSize: 26 }}>{k > 0.6 ? "✓" : ""}</div>
            <div style={{ fontFamily: BIG, fontSize: 54, color: AH.bone, textShadow: TSH }}>{it}</div>
          </div>;
        })}
      </div>
    </AbsoluteFill>
  );
};
