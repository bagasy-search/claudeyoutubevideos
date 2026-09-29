// Overlays del canal Ole's Camp Kitchen — fondo TRANSPARENTE (van encima del metraje vivo):
//   OleNameTag (rótulo estilo libro) · OleNote (papelito a lápiz con cinta) · OleArrow (flecha a mano hacia x,y)
//   OleComments (comentarios estilo YouTube) · OleSubscribe (botón + campanita con cursor) · OleAsk (pregunta para comentar)
//   OleStamp (sello de goma que golpea) · OleCounter (número grande que cuenta: timer de cocina o cantidad)
// Todo texto entra por props; tiempos en segundos relativos al inicio de la Sequence.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, SANS, LABEL, HAND, hexA, rnd } from "./OleTheme";
import { OleBed } from "./OleBookPage";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, fps: number, at = 0, damping = 14) => spring({ frame: f - at, fps, config: { damping, stiffness: 150, mass: 0.7 } });
const useOut = (n = 9) => { const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); return interpolate(f, [durationInFrames - n, durationInFrames], [1, 0], cl); };
const Bed: React.FC<{ bed?: string }> = ({ bed }) => (bed ? <OleBed src={bed} veil={0} /> : null);

// borde de papel rasgado (clip-path poligonal determinista)
const torn = (seed: number, amp = 1.2) => {
  const pts: string[] = [];
  const N = 18;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${rnd(seed + i) * amp}%`);
  for (let i = 0; i <= 8; i++) pts.push(`${100 - rnd(seed + 50 + i) * amp * 0.6}% ${(i / 8) * 100}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(i / N) * 100}% ${100 - rnd(seed + 100 + i) * amp * 2.4}%`);
  for (let i = 8; i >= 0; i--) pts.push(`${rnd(seed + 150 + i) * amp * 0.6}% ${(i / 8) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

// ── OleNameTag ─────────────────────────────────────────────────────────────
export const OleNameTag: React.FC<{ name?: string; sub?: string; kicker?: string; side?: "left" | "right"; bed?: string }> = ({ name = "Ole Lindqvist", sub = "Logging camp cook, 40 winters", kicker = "OLE'S CAMP KITCHEN", side = "left", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut();
  const p = pop(f, fps, 4, 16);
  const bar = interpolate(f, [12, 30], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const w = interpolate(f, [16, 34], [0, 100], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Bed bed={bed} />
      <div style={{ position: "absolute", [side]: 90, bottom: 96, opacity: out * Math.min(1, p * 1.5), translate: `${(side === "left" ? -1 : 1) * (1 - p) * 80}px 0`,
        background: OLE.paper, padding: "20px 40px 24px 36px", boxShadow: `0 16px 36px ${OLE.shadow}, 0 2px 4px rgba(0,0,0,0.15)`, borderRadius: 3, maxWidth: 900 }}>
        {kicker ? <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 26, letterSpacing: 7, color: OLE.fire, lineHeight: 1, marginBottom: 10 }}>{kicker}</div> : null}
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: OLE.forest, lineHeight: 0.98, letterSpacing: -1 }}>{name}</div>
        <div style={{ height: 6, width: 150 * bar, background: OLE.fire, margin: "14px 0 10px" }} />
        {sub ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 40, color: OLE.pencil, clipPath: `inset(-10px ${100 - w}% -10px 0)` }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ── OleNote ───────────────────────────────────────────────────────────────
export const OleNote: React.FC<{ text?: string; lines?: string[]; x?: number; y?: number; rot?: number; width?: number; at?: number; bed?: string }> = ({ text = "Salt goes in at the START.", lines, x = 0.7, y = 0.3, rot = -4, width = 620, at = 0.2, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut();
  const ls = lines && lines.length ? lines : [text];
  const p = pop(f, fps, at * fps, 13);
  const per = 0.75;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Bed bed={bed} />
      <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, translate: `-50% ${(1 - p) * -40 - 50}%`, rotate: `${rot + (1 - p) * -8}deg`, opacity: out * Math.min(1, p * 1.6), width,
        filter: `drop-shadow(0 14px 18px ${hexA(OLE.forest2, 0.30)}) drop-shadow(0 2px 2px rgba(0,0,0,0.18))` }}>
        <div style={{ clipPath: torn(7), padding: "46px 44px 44px 50px", backgroundColor: "#FBF5E4",
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 58px, ${hexA("#7A93A8", 0.30)} 58px 60px), radial-gradient(ellipse at 80% 20%, rgba(201,166,107,0.25), transparent 40%)`, backgroundPosition: "0 22px" }}>
          {ls.map((l, i) => {
            const w = interpolate(f / fps, [at + 0.25 + i * per, at + 0.25 + (i + 1) * per], [0, 100], cl);
            return <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, lineHeight: "60px", color: OLE.pencil, clipPath: `inset(-12px ${100 - w}% -12px -6px)` }}>{l}</div>;
          })}
        </div>
        {/* cinta */}
        <div style={{ position: "absolute", top: -18, left: "50%", marginLeft: -85, width: 170, height: 44, rotate: "-5deg", background: "rgba(233,217,184,0.78)", boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
          clipPath: "polygon(0 8%, 4% 0, 9% 10%, 14% 0, 100% 4%, 96% 50%, 100% 96%, 90% 100%, 84% 92%, 0 100%, 3% 50%)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ── OleArrow ──────────────────────────────────────────────────────────────
// Apunta a (x,y) (fracción de pantalla). El texto va en (tx,ty); por defecto arriba-afuera del punto.
export const OleArrow: React.FC<{ text?: string; x?: number; y?: number; tx?: number; ty?: number; ring?: boolean; r?: number; at?: number; color?: string; bed?: string }> = ({ text = "the lid, cracked", x = 0.5, y = 0.55, tx, ty, ring = true, r = 96, at = 0.15, color = OLE.fire, bed }) => {
  const f = useCurrentFrame(); const { fps, width, height } = useVideoConfig(); const out = useOut();
  const t = f / fps;
  const px = x * width, py = y * height;
  const lx = (tx ?? (x > 0.5 ? x - 0.26 : x + 0.26)) * width, ly = (ty ?? Math.max(0.16, y - 0.3)) * height;
  const d = interpolate(t, [at, at + 0.55], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const rp = interpolate(t, [at + 0.45, at + 1.0], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const tp = pop(f, fps, at * fps, 15);
  // curva de la etiqueta al punto (parando antes del anillo)
  const ang = Math.atan2(py - ly, px - lx); const stop = ring ? r * 0.95 + 14 : 20;
  const ex = px - Math.cos(ang) * stop, ey = py - Math.sin(ang) * stop;
  const sx = lx + Math.cos(ang) * 70, sy = ly + Math.sin(ang) * 55;
  const mx = (sx + ex) / 2 + Math.sin(ang) * 90, my = (sy + ey) / 2 - Math.cos(ang) * 90;
  const hA = Math.atan2(ey - my, ex - mx);
  const head = `M ${ex - Math.cos(hA - 0.5) * 34} ${ey - Math.sin(hA - 0.5) * 34} L ${ex} ${ey} L ${ex - Math.cos(hA + 0.5) * 34} ${ey - Math.sin(hA + 0.5) * 34}`;
  const stroke = (w: number, c: string, o = 1) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, opacity: o });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <Bed bed={bed} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {[[16, hexA(OLE.cream, 0.85)], [8, color]].map(([w, c], k) => (
          <g key={k} style={{ filter: k ? undefined : "blur(0.5px)" }}>
            <path d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`} {...stroke(w as number, c as string)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, d / 0.8)} />
            <path d={head} {...stroke(w as number, c as string)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, (d - 0.8) / 0.2)} />
            {ring ? <ellipse cx={px} cy={py} rx={r} ry={r * 0.8} transform={`rotate(-10 ${px} ${py})`} {...stroke(w as number, c as string)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rp} /> : null}
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, translate: "-50% -50%", scale: String(0.7 + 0.3 * tp), opacity: Math.min(1, tp * 1.5), rotate: "-3deg",
        background: OLE.cream, padding: "8px 26px 10px", borderRadius: 4, boxShadow: `0 10px 22px ${OLE.shadow}`, whiteSpace: "nowrap",
        fontFamily: HAND, fontWeight: 700, fontSize: 58, color: OLE.forest, lineHeight: 1.1 }}>{text}</div>
    </AbsoluteFill>
  );
};

// ── OleComments ───────────────────────────────────────────────────────────
const AV_COLORS = [OLE.forest, OLE.plaid, OLE.enamel, OLE.fire, "#6B5B95", "#3F7F6B", "#9A6B3A"];
export const OleComments: React.FC<{ items?: { at: number; text: string; name?: string; likes?: number }[]; title?: string; side?: "left" | "right"; bed?: string }> = ({ items = [
  { at: 0.3, text: "My grandpa cooked in a camp like this. Same beans!", name: "@northwoods_dave", likes: 214 },
  { at: 1.6, text: "Salt at the start? I've been doing it wrong for 30 years.", name: "@marge.cooks", likes: 88 },
  { at: 2.9, text: "Tried the whisper simmer. Skins stayed whole!", name: "@lindaK", likes: 57 },
], title = "YOU WROTE IN", side = "right", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut();
  const t = f / fps;
  const shown = items.filter((it) => t >= it.at);
  const maxVis = 4;
  const titleIn = pop(f, fps, 0, 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <Bed bed={bed} />
      <div style={{ position: "absolute", [side]: 70, top: 70, width: 800, display: "flex", flexDirection: "column", gap: 20 }}>
        {title ? <div style={{ alignSelf: side === "right" ? "flex-end" : "flex-start", opacity: titleIn, fontFamily: LABEL, fontWeight: 600, fontSize: 28, letterSpacing: 7, color: OLE.forest,
          background: OLE.cream, padding: "8px 20px", borderRadius: 4, boxShadow: `0 8px 18px ${OLE.shadow}` }}>{title}</div> : null}
        {shown.slice(-maxVis).map((it) => {
          const i = items.indexOf(it);
          const p = pop(f, fps, it.at * fps, 15);
          const nm = it.name ?? "@viewer";
          const ini = nm.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase() || "V";
          const likes = it.likes ?? Math.round(20 + rnd(i + 3) * 300);
          const likeP = interpolate(t, [it.at + 0.6, it.at + 0.9], [0, 1], cl);
          return (
            <div key={i} style={{ opacity: Math.min(1, p * 1.5), translate: `${(side === "right" ? 1 : -1) * (1 - p) * 120}px 0`, background: "#FFFFFF", borderRadius: 16,
              padding: "20px 26px 18px", boxShadow: `0 14px 32px ${OLE.shadow}, 0 1px 3px rgba(0,0,0,0.12)`, display: "flex", gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, flexShrink: 0, background: AV_COLORS[i % AV_COLORS.length], color: "#FFFFFF",
                fontFamily: SANS, fontWeight: 700, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{ini}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 26, color: "#0F0F0F", fontWeight: 700 }}>{nm} <span style={{ fontWeight: 400, color: "#606060", marginLeft: 8 }}>{`${1 + Math.floor(rnd(i + 9) * 6)} days ago`}</span></div>
                <div style={{ fontFamily: SANS, fontSize: 40, color: "#0F0F0F", lineHeight: 1.22, marginTop: 4 }}>{it.text}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, fontFamily: SANS, fontSize: 24, color: "#606060" }}>
                  <svg width={30} height={30} viewBox="0 0 24 24" style={{ scale: String(1 + 0.25 * Math.sin(Math.PI * likeP)) }}><path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6C6.2 7.9 6 8.4 6 9v10c0 1.1.9 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z" fill={likeP > 0.5 ? OLE.enamel : "#606060"} /></svg>
                  <span>{likes + (likeP > 0.5 ? 1 : 0)}</span>
                  <span style={{ marginLeft: 18, fontWeight: 600 }}>Reply</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── OleSubscribe ──────────────────────────────────────────────────────────
const Bell: React.FC<{ on: boolean; ring: number }> = ({ on, ring }) => (
  <svg width={58} height={58} viewBox="0 0 24 24" style={{ rotate: `${Math.sin(ring * Math.PI * 6) * 22 * (1 - ring)}deg`, transformOrigin: "50% 10%" }}>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill={on ? OLE.forest : "none"} stroke={OLE.forest} strokeWidth={1.6} />
    {on ? <g stroke={OLE.fire} strokeWidth={1.4} strokeLinecap="round" opacity={1 - ring * 0.3}><path d="M3 7.5 Q2 10 3 12.5" fill="none" /><path d="M21 7.5 Q22 10 21 12.5" fill="none" /></g> : null}
  </svg>
);
export const OleSubscribe: React.FC<{ channel?: string; initials?: string; text?: string; done?: string; sub?: string; clickAt?: number; bellAt?: number; bed?: string }> = ({ channel = "Ole's Camp Kitchen", initials = "OC", text = "Subscribe", done = "Subscribed", sub = "New camp recipe every week", clickAt, bellAt, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const out = useOut();
  const t = f / fps; const dur = durationInFrames / fps;
  const c1 = clickAt ?? Math.min(1.5, dur * 0.3), c2 = bellAt ?? Math.min(c1 + 1.1, dur * 0.6);
  const p = pop(f, fps, 3, 16);
  const subbed = t >= c1; const bellOn = t >= c2;
  const press = (at: number) => interpolate(t, [at - 0.08, at, at + 0.12], [1, 0.9, 1], cl);
  const ring = interpolate(t, [c2, c2 + 1.0], [0, 1], cl);
  // cursor: entra desde abajo a la derecha, va al botón, después a la campana
  const BTN = { x: 1160, y: 930 }, BELL = { x: 1358, y: 930 };
  const m1 = interpolate(t, [c1 - 0.7, c1 - 0.05], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const m2 = interpolate(t, [c1 + 0.35, c2 - 0.05], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const cx = interpolate(m1, [0, 1], [1620, BTN.x]) + (BELL.x - BTN.x) * m2;
  const cy = interpolate(m1, [0, 1], [1150, BTN.y]) + (BELL.y - BTN.y) * m2;
  const curOut = interpolate(t, [c2 + 0.5, c2 + 0.9], [1, 0], cl);
  const clickRing = (at: number) => { const k = interpolate(t, [at, at + 0.35], [0, 1], cl); return k > 0 && k < 1 ? k : 0; };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <Bed bed={bed} />
      <div style={{ position: "absolute", left: "50%", bottom: 90, translate: `-50% ${(1 - p) * 160}px`, opacity: Math.min(1, p * 1.5), display: "flex", alignItems: "center", gap: 26,
        background: "#FFFFFF", borderRadius: 60, padding: "18px 26px 18px 18px", boxShadow: `0 20px 44px ${OLE.shadow}, 0 2px 4px rgba(0,0,0,0.15)` }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: OLE.forest, border: `4px solid ${OLE.kraft}`, color: OLE.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 40 }}>{initials}</div>
        <div style={{ minWidth: 330 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: "#0F0F0F", lineHeight: 1.05 }}>{channel}</div>
          {sub ? <div style={{ fontFamily: SANS, fontSize: 26, color: "#606060", marginTop: 4 }}>{sub}</div> : null}
        </div>
        <div style={{ scale: String(press(c1)), background: subbed ? "#F2F2F2" : "#CC0000", color: subbed ? "#0F0F0F" : "#FFFFFF", fontFamily: SANS, fontWeight: 700, fontSize: 38,
          padding: "16px 38px", borderRadius: 40, whiteSpace: "nowrap" }}>{subbed ? `✓ ${done}` : text}</div>
        <div style={{ scale: String(press(c2)), width: 84, height: 84, borderRadius: 42, background: bellOn ? hexA(OLE.ember, 0.35) : "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bell on={bellOn} ring={ring} />
        </div>
      </div>
      {/* ondas de clic */}
      {[c1, c2].map((at, i) => { const k = clickRing(at); return k ? <div key={i} style={{ position: "absolute", left: cx - 40 * (1 + k), top: cy - 40 * (1 + k), width: 80 * (1 + k), height: 80 * (1 + k), borderRadius: "50%", border: `4px solid ${hexA(OLE.fire, 1 - k)}` }} /> : null; })}
      {/* mano/cursor */}
      <svg width={64} height={76} viewBox="0 0 32 38" style={{ position: "absolute", left: cx - 14, top: cy - 4, opacity: curOut, scale: String(Math.min(press(c1), press(c2))), filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}>
        <path d="M11 2.5c1.4 0 2.5 1.1 2.5 2.5v10.2l1-.1V12c0-1.4 1.1-2.4 2.4-2.4s2.4 1 2.4 2.4v3.4l.9-.1v-1.9c0-1.3 1.1-2.4 2.4-2.4s2.4 1.1 2.4 2.4v2.6l.6-.1c1.4 0 2.4 1.2 2.4 2.5v7.4c0 5.3-3.8 9.2-9.4 9.2h-2.6c-3 0-5-1.3-6.6-3.6L3.8 22.6c-.8-1.2-.5-2.8.7-3.5 1.1-.7 2.5-.4 3.3.6l.7 1V5c0-1.4 1.1-2.5 2.5-2.5z" fill="#FFFFFF" stroke="#111111" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

// ── OleAsk ────────────────────────────────────────────────────────────────
export const OleAsk: React.FC<{ text?: string; sub?: string; kicker?: string; side?: "left" | "right"; bed?: string }> = ({ text = "Did your family soak beans overnight?", sub = "Tell me in the comments", kicker = "OLE WANTS TO KNOW", side = "right", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut();
  const p = pop(f, fps, 4, 14);
  const w = interpolate(f, [18, 40], [0, 100], cl);
  const pen = interpolate(f, [18, 40], [0, 1], cl);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <Bed bed={bed} />
      <div style={{ position: "absolute", [side]: 80, top: 80, width: 780, scale: String(0.85 + 0.15 * p), opacity: Math.min(1, p * 1.5), rotate: `${side === "right" ? 1.5 : -1.5}deg`, transformOrigin: side === "right" ? "100% 0" : "0 0" }}>
        <div style={{ background: OLE.cream, borderRadius: 22, padding: "26px 38px 30px", boxShadow: `0 20px 44px ${OLE.shadow}`, border: `3px solid ${OLE.forest}`, position: "relative" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 26, letterSpacing: 7, color: OLE.fire }}>{kicker}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 60, lineHeight: 1.06, color: OLE.forest, marginTop: 8 }}>{text}</div>
          {sub ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: OLE.pencil, clipPath: `inset(-10px ${100 - w}% -10px 0)` }}>{sub}</div>
              <svg width={44} height={60} viewBox="0 0 22 30" style={{ opacity: pen, translate: `0 ${Math.sin(f / 5) * 4}px` }}><path d="M11 2 L11 26 M3 18 L11 27 L19 18" fill="none" stroke={OLE.fire} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          ) : null}
          {/* colita del globo */}
          <svg width={70} height={50} viewBox="0 0 70 50" style={{ position: "absolute", bottom: -44, [side === "right" ? "right" : "left"]: 90 }}>
            <path d="M 4 0 L 62 0 L 18 46 Z" fill={OLE.cream} stroke={OLE.forest} strokeWidth={3} strokeLinejoin="round" />
            <rect x={0} y={-4} width={70} height={6} fill={OLE.cream} />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── OleStamp ──────────────────────────────────────────────────────────────
const STAMP_COLORS: Record<string, string> = { MYTH: OLE.plaid, TRUE: "#2E6B3F", "CAMP RULE": OLE.fire };
export const OleStamp: React.FC<{ text?: string; sub?: string; color?: string; x?: number; y?: number; rot?: number; at?: number; size?: number; bed?: string }> = ({ text = "MYTH", sub, color, x = 0.22, y = 0.3, rot = -9, at = 0.25, size = 130, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut();
  const t = f / fps;
  const c = color ?? STAMP_COLORS[text.toUpperCase()] ?? OLE.plaid;
  const fall = interpolate(t, [at - 0.28, at], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  const hit = t >= at;
  const sc = hit ? 1 + 0.06 * Math.exp(-(t - at) * 14) * Math.cos((t - at) * 40) : interpolate(fall, [0, 1], [2.6, 1]);
  const op = hit ? 1 : fall * 0.9;
  const shake = hit ? Math.exp(-(t - at) * 12) * Math.sin((t - at) * 70) * 6 : 0;
  const id = `stp${Math.round(x * 1000)}${Math.round(y * 1000)}${text.length}`;
  if (t < at - 0.3) return <AbsoluteFill style={{ pointerEvents: "none" }}><Bed bed={bed} /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <Bed bed={bed} />
      <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, translate: `calc(-50% + ${shake}px) -50%`, rotate: `${rot}deg`, scale: String(sc), opacity: op }}>
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={id}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.75" result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
        </svg>
        <div style={{ position: "absolute", inset: -size * 0.16, background: OLE.paper, clipPath: torn(31, 1.1), boxShadow: `0 14px 30px ${OLE.shadow}`, opacity: hit ? 1 : 0 }} />
        <div style={{ position: "relative", filter: `url(#${id})`, border: `${size * 0.075}px solid ${c}`, borderRadius: size * 0.12, padding: `${size * 0.04}px`, mixBlendMode: "multiply" }}>
          <div style={{ border: `${size * 0.03}px solid ${c}`, borderRadius: size * 0.07, padding: `${size * 0.06}px ${size * 0.28}px ${size * 0.05}px`, textAlign: "center" }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: size * 0.08, color: c, whiteSpace: "nowrap" }}>{text}</div>
            {sub ? <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: size * 0.24, letterSpacing: size * 0.05, color: c, marginTop: size * 0.05, whiteSpace: "nowrap" }}>{sub}</div> : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── OleCounter ────────────────────────────────────────────────────────────
// mode "timer": reloj de cocina que corre de `from` a `to` SEGUNDOS de reloj (comprimidos en [start,end] s del clip), formato m:ss
// mode "number": número que cuenta de `from` a `to`.
export const OleCounter: React.FC<{ mode?: "timer" | "number"; from?: number; to?: number; label?: string; start?: number; end?: number; x?: number; y?: number; suffix?: string; bed?: string }> = ({ mode = "number", from, to, label, start = 0.3, end, x = 0.76, y = 0.27, suffix = "", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const out = useOut();
  const t = f / fps; const dur = durationInFrames / fps;
  const isT = mode === "timer";
  const a = from ?? (isT ? 600 : 0), b = to ?? (isT ? 0 : 40);
  const e = end ?? Math.max(start + 0.8, dur * 0.8);
  const k = interpolate(t, [start, e], [0, 1], { ...cl, easing: isT ? Easing.linear : Easing.out(Easing.cubic) });
  const v = a + (b - a) * k;
  const txt = isT ? `${Math.floor(Math.round(v) / 60)}:${String(Math.round(v) % 60).padStart(2, "0")}` : `${Math.round(v)}${suffix}`;
  const lbl = label ?? (isT ? "HARD BOIL" : "MEN TO FEED");
  const p = pop(f, fps, 2, 14);
  const done = k >= 1; const ding = interpolate(t, [e, e + 0.6], [0, 1], cl);
  const tick = isT ? Math.floor(t * 2) % 2 : 0;
  const frac = isT ? (a === b ? 0 : (v - Math.min(a, b)) / Math.abs(a - b)) : k;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <Bed bed={bed} />
      <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, translate: "-50% -50%", scale: String((0.7 + 0.3 * p) * (done ? 1 + 0.05 * Math.sin(Math.PI * ding) : 1)), opacity: Math.min(1, p * 1.5),
        display: "flex", alignItems: "center", gap: 40, background: OLE.cream, borderRadius: 28, padding: "30px 54px 30px 34px", boxShadow: `0 22px 48px ${OLE.shadow}, 0 2px 4px rgba(0,0,0,0.15)` }}>
        {isT ? (
          <svg width={230} height={230} viewBox="-115 -115 230 230" style={{ rotate: done ? `${Math.sin(ding * Math.PI * 8) * 8 * (1 - ding)}deg` : "0deg" }}>
            <circle r={104} fill={OLE.enamel} />
            <circle r={88} fill="#FFFFFF" />
            {Array.from({ length: 60 }).map((_, i) => { const an = (i / 60) * Math.PI * 2 - Math.PI / 2; const L = i % 5 ? 6 : 14; return <line key={i} x1={Math.cos(an) * 82} y1={Math.sin(an) * 82} x2={Math.cos(an) * (82 - L)} y2={Math.sin(an) * (82 - L)} stroke={OLE.iron} strokeWidth={i % 5 ? 1.5 : 3} />; })}
            {/* sector restante */}
            <path d={(() => { const an = frac * Math.PI * 2; const x2 = Math.sin(an) * 62, y2 = -Math.cos(an) * 62; return frac <= 0.001 ? "" : frac >= 0.999 ? "M 0 -62 A 62 62 0 1 1 -0.01 -62 Z" : `M 0 0 L 0 -62 A 62 62 0 ${an > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`; })()} fill={hexA(OLE.fire, 0.85)} />
            <circle r={10} fill={OLE.iron} />
            <rect x={-18} y={-128} width={36} height={20} rx={6} fill={OLE.ironL} />
          </svg>
        ) : null}
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, lineHeight: 0.9, color: done && isT ? OLE.fire : OLE.forest, fontVariantNumeric: "tabular-nums", letterSpacing: -4,
            minWidth: isT ? 380 : 0, textAlign: isT ? "left" : "center", opacity: isT && done ? 0.75 + 0.25 * tick : 1 }}>{txt}</div>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 36, letterSpacing: 8, color: OLE.fire, marginTop: 10 }}>{lbl}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
