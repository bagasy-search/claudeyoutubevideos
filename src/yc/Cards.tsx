// Componentes de relato del canal Yesterday's Classroom: ENTONCES/AHORA, texto cinético, sello de prohibición,
// recorte de diario en 3D, mapa de ruta en perspectiva, tira de película 16 mm, entrada de cine, barras de pizarrón,
// rótulo de lugar/fecha y contador. Todos aceptan metraje real (foto o clip) como cama.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "./Media";
import { SERIF, TYPE, SANS, BODY, YC, clamp, ease, easeInOut, rnd } from "./theme";

type Src = { src: string; start?: number };

const useLife = (inF = 10, outF = 10) => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  return { f, D, a: clamp(f / inF) * (1 - clamp((f - (D - outF)) / outF)) };
};

// ─── ENTONCES / AHORA ────────────────────────────────────────────────────────
export const ThenNow: React.FC<{ then: Src & { year: string }; now: Src & { label?: string }; caption?: string }> = ({ then, now, caption }) => {
  const { f, D, a } = useLife(6, 8);
  const wipe = easeInOut(clamp((f - 18) / 34));        // 0 = todo ENTONCES · 1 = mitad y mitad
  const div = 100 - wipe * 50;                           // % del divisor
  const tag = (txt: string, col: string, x: number, show: number, align: "left" | "right") => (
    <div style={{ position: "absolute", top: 70, [align]: x, fontFamily: SANS, fontSize: 40, letterSpacing: 8, color: YC.ink, background: col,
      padding: "8px 22px", transform: `translateY(${(1 - ease(show)) * -30}px) rotate(${align === "left" ? -2 : 2}deg)`, opacity: ease(show),
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)" } as React.CSSProperties}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - div}% 0 0)` }}>
        <AbsoluteFill style={{ transform: `translateX(${-wipe * 22}%)` }}>
          <Media src={then.src} start={then.start} kb="in" zoom={1.1} filter="sepia(0.35) contrast(1.08) saturate(0.8)" />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${div}%)` }}>
        <AbsoluteFill style={{ transform: `translateX(${(1 - wipe) * 30 + 22}%)` }}>
          <Media src={now.src} start={now.start} kb="in" zoom={1.1} />
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${div}%`, width: 6, marginLeft: -3, background: YC.bus, boxShadow: `0 0 30px ${YC.bus}, 0 0 80px rgba(242,183,5,0.6)` }} />
      {tag(then.year, YC.bus, 60, clamp((f - 4) / 12), "left")}
      {tag(now.label ?? "TODAY", YC.apple, 60, clamp((f - 40) / 12), "right")}
      {caption ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: TYPE, fontSize: 46, color: YC.paper,
          textShadow: "0 4px 20px rgba(0,0,0,0.95)", opacity: ease(clamp((f - 50) / 14)) }}>{caption}</div>
      ) : null}
      {void D}
    </AbsoluteFill>
  );
};

// ─── TEXTO CINÉTICO ─────────────────────────────────────────────────────────
export const Kinetic: React.FC<{ text: string; keys?: string[]; bed?: string; bedStart?: number; align?: "left" | "center"; size?: number }> =
  ({ text, keys = [], bed, bedStart, align = "left", size = 108 }) => {
  const { f, a } = useLife(6, 10);
  const words = text.split(" ");
  const clean = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
  const isKey = (w: string) => { const c = clean(w); return !!c && keys.some((k) => c.startsWith(clean(k))); };
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {bed ? <AbsoluteFill style={{ filter: "brightness(0.5) saturate(0.8) sepia(0.2)" }}><Media src={bed} start={bedStart} kb="in" zoom={1.08} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ background: align === "left" ? "linear-gradient(90deg, rgba(8,6,4,0.88) 0%, rgba(8,6,4,0.55) 55%, rgba(8,6,4,0.1) 100%)" : "radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.72), rgba(8,6,4,0.35))" }} />
      <div style={{ position: "absolute", left: align === "left" ? 130 : 160, right: align === "left" ? 480 : 160, top: 0, bottom: 0, display: "flex", alignItems: "center",
        justifyContent: align === "left" ? "flex-start" : "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.16, color: YC.paper, textAlign: align, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>
          {words.map((w, i) => {
            const t = clamp((f - 6 - i * 3.2) / 10);
            const key = isKey(w);
            const ul = clamp((f - 6 - i * 3.2 - 8) / 14);
            return (
              <span key={i} style={{ display: "inline-block", marginRight: size * 0.26, position: "relative", opacity: ease(t),
                transform: `translateY(${(1 - ease(t)) * 26}px)`, filter: `blur(${(1 - ease(t)) * 8}px)`, color: key ? YC.bus : YC.paper, fontStyle: key ? "italic" : "normal" }}>
                {w}
                {key ? (
                  <svg style={{ position: "absolute", left: -4, bottom: -10, width: "106%", height: 22, overflow: "visible" }} viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M2 12 C 25 6, 55 16, 98 8" stroke={YC.bus} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(ul)} />
                  </svg>
                ) : null}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SELLO DE PROHIBICIÓN (overlay) ─────────────────────────────────────────
export const BanStamp: React.FC<{ top?: string; big: string; date?: string; x?: number; y?: number; scale0?: number }> = ({ top = "FEDERAL", big, date, x = 1240, y = 520, scale0 = 1.7 }) => {
  const { f, a } = useLife(1, 12);
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 11, stiffness: 180, mass: 0.7 } });
  const scale = interpolate(s, [0, 1], [2.6, 1]) * scale0;
  const hit = f >= 10 && f < 16 ? (rnd(f) - 0.5) * 16 : 0;
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none", transform: `translate(${hit}px, ${hit * 0.6}px)` }}>
      <AbsoluteFill style={{ background: "#000", opacity: f < 14 && f > 8 ? 0.18 : 0 }} />
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(-9deg) scale(${scale})`, opacity: clamp(s * 1.4) }}>
        <div style={{ border: `12px solid ${YC.apple}`, borderRadius: 22, padding: "18px 46px 22px", color: YC.apple, textAlign: "center", mixBlendMode: "normal",
          background: "rgba(243,233,210,0.08)", boxShadow: "0 0 0 4px rgba(200,16,46,0.25)", filter: "url(#yc-ink)" }}>
          <div style={{ fontFamily: SANS, fontSize: 40, letterSpacing: 14, fontWeight: 700 }}>{top}</div>
          <div style={{ fontFamily: SANS, fontSize: 150, lineHeight: 0.95, letterSpacing: 6, fontWeight: 700 }}>{big}</div>
          {date ? <div style={{ fontFamily: TYPE, fontSize: 42, marginTop: 6 }}>{date}</div> : null}
        </div>
      </div>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="yc-ink"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /><feDisplacementMap in="SourceGraphic" scale="2.5" /></filter>
      </svg>
    </AbsoluteFill>
  );
};

// ─── RECORTE DE DIARIO / DOCUMENTO EN 3D ────────────────────────────────────
export const Clipping: React.FC<{ masthead?: string; date: string; headline: string; sub?: string; photo?: string; photoStart?: number; highlight?: boolean; kind?: "news" | "law" }> =
  ({ masthead = "THE EVENING NEWS", date, headline, sub, photo, photoStart, highlight = true, kind = "news" }) => {
  const { f, D, a } = useLife(8, 10);
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 20, stiffness: 60 } });
  const t = f / D;
  const rx = interpolate(s, [0, 1], [55, 22]) - t * 6, rz = interpolate(s, [0, 1], [-18, -4]) + t * 2;
  const z = interpolate(s, [0, 1], [-800, 0]) + t * 180;
  const hl = ease(clamp((f - 30) / 22));
  return (
    <AbsoluteFill style={{ opacity: a, background: "radial-gradient(ellipse at 50% 40%, #3A2A1C 0%, #120C08 75%)" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(95deg, rgba(0,0,0,0.12) 0 3px, rgba(255,255,255,0.02) 3px 9px)", opacity: 0.6 }} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: 960, top: 560, width: 1100, transformStyle: "preserve-3d",
          transform: `translate(-50%, -50%) translateZ(${z}px) rotateX(${rx}deg) rotateZ(${rz}deg)` }}>
          <div style={{ background: kind === "law" ? "#F6F1E4" : "#EDE3CC", padding: "42px 56px 56px", boxShadow: "0 60px 120px rgba(0,0,0,0.75)",
            clipPath: kind === "news" ? "polygon(0 2%, 3% 0, 20% 1.5%, 40% 0.3%, 62% 1.8%, 80% 0.2%, 100% 1.4%, 99% 30%, 100% 62%, 98.6% 100%, 70% 98.5%, 45% 100%, 20% 98.8%, 0 100%, 1.2% 60%)" : undefined }}>
            <div style={{ fontFamily: kind === "law" ? BODY : SERIF, fontSize: kind === "law" ? 34 : 64, textAlign: "center", color: "#1B140E", letterSpacing: kind === "law" ? 6 : 1,
              borderBottom: "3px double #3B2E22", paddingBottom: 10 }}>{masthead}</div>
            <div style={{ fontFamily: TYPE, fontSize: 24, color: "#4A3B2C", textAlign: "center", marginTop: 8 }}>{date}</div>
            <div style={{ position: "relative", marginTop: 26, fontFamily: kind === "law" ? BODY : SERIF, fontSize: kind === "law" ? 50 : 76, lineHeight: 1.05, color: "#120D09", fontWeight: kind === "law" ? 700 : 400 }}>
              {highlight ? <div style={{ position: "absolute", left: -10, top: 6, bottom: -4, width: `${hl * 104}%`, background: "rgba(242,183,5,0.55)", mixBlendMode: "multiply" }} /> : null}
              <span style={{ position: "relative" }}>{headline}</span>
            </div>
            <div style={{ display: "flex", gap: 30, marginTop: 26 }}>
              {photo ? <div style={{ width: 420, height: 290, flexShrink: 0, overflow: "hidden", filter: "grayscale(1) contrast(1.2)" }}><Media src={photo} start={photoStart} kb="in" zoom={1.06} /></div> : null}
              <div style={{ fontFamily: BODY, fontSize: 25, lineHeight: 1.55, color: "#2B2118", width: "100%" }}>
                {sub ? <div style={{ marginBottom: 12 }}>{sub}</div> : null}
                {Array.from({ length: photo ? 7 : 5 }, (_, k) => (
                  <div key={k} style={{ height: 13, margin: "0 0 15px", width: `${[96, 88, 93, 72, 90, 84, 60][k]}%`, background: "rgba(43,33,24,0.28)", borderRadius: 2 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

// ─── MAPA DE RUTA EN PERSPECTIVA ────────────────────────────────────────────
export const MapRoute: React.FC<{ from: string; to: string; distance: string; title?: string; seed?: number }> = ({ from, to, distance, title, seed = 3 }) => {
  const { f, D, a } = useLife(8, 10);
  const p = easeInOut(clamp((f - 16) / (D * 0.55)));
  const W = 2400, H = 1600;
  const A = { x: 560, y: 1150 }, B = { x: 1840, y: 520 };
  const pts = [A, { x: 820, y: 1150 }, { x: 820, y: 860 }, { x: 1300, y: 860 }, { x: 1300, y: 520 }, B];
  const d = pts.map((q, i) => `${i ? "L" : "M"}${q.x} ${q.y}`).join(" ");
  // posición del cabezal sobre la polilínea
  const lens = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.y - pts[i].y)); const tot = lens.reduce((x, y) => x + y, 0);
  let rem = p * tot, hx = A.x, hy = A.y;
  for (let i = 0; i < lens.length; i++) { if (rem <= lens[i]) { const r = rem / lens[i]; hx = pts[i].x + (pts[i + 1].x - pts[i].x) * r; hy = pts[i].y + (pts[i + 1].y - pts[i].y) * r; break; } rem -= lens[i]; }
  const camX = -(hx - W / 2) * 0.55, camY = -(hy - H / 2) * 0.45;
  const streets: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) { const x = i * 100 + rnd(seed + i) * 30; streets.push(<line key={"v" + i} x1={x} y1={0} x2={x + rnd(i) * 40} y2={H} stroke="#B9A77F" strokeWidth={i % 5 === 0 ? 9 : 3} />); }
  for (let i = 0; i < 18; i++) { const y = i * 96 + rnd(seed + i + 40) * 30; streets.push(<line key={"h" + i} x1={0} y1={y} x2={W} y2={y + rnd(i + 3) * 30} stroke="#B9A77F" strokeWidth={i % 4 === 0 ? 9 : 3} />); }
  const pin = (q: { x: number; y: number }, label: string, show: number, col: string) => (
    <g transform={`translate(${q.x} ${q.y})`} opacity={ease(show)}>
      <circle r={30 + (1 - ease(show)) * 40} fill={col} opacity={0.25} />
      <circle r={18} fill={col} stroke="#FFF6DC" strokeWidth={5} />
      <text x={34} y={-26} fontFamily={SANS} fontSize={54} fill="#1B140E" letterSpacing={4}>{label}</text>
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: a, background: "#0D0A07" }}>
      <AbsoluteFill style={{ perspective: 1300, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left: 960 - W / 2, top: 560 - H / 2, width: W, height: H, transformStyle: "preserve-3d",
          transform: `translate(${camX}px, ${camY}px) rotateX(${50 - p * 8}deg) rotateZ(${-6 + p * 4}deg) scale(${0.95 + p * 0.15})` }}>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, boxShadow: "0 80px 160px rgba(0,0,0,0.8)" }}>
            <defs><radialGradient id="ycp" cx="50%" cy="45%" r="70%"><stop offset="0" stopColor="#F1E4C3" /><stop offset="1" stopColor="#CDB88C" /></radialGradient></defs>
            <rect width={W} height={H} fill="url(#ycp)" />
            <path d={`M0 ${H * 0.18} C ${W * 0.3} ${H * 0.05}, ${W * 0.55} ${H * 0.35}, ${W} ${H * 0.2}`} stroke="#7FA3B5" strokeWidth={70} fill="none" opacity={0.7} />
            {streets}
            <rect x={1000} y={980} width={380} height={260} fill="#9DB07A" opacity={0.6} />
            <rect x={1480} y={640} width={220} height={180} fill="#9DB07A" opacity={0.5} />
            <path d={d} stroke="#1B140E" strokeWidth={10} fill="none" strokeDasharray="4 22" strokeLinecap="round" opacity={0.25} />
            <path d={d} stroke={YC.apple} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
            {pin(A, from, clamp(f / 12), YC.board)}
            {pin(B, to, clamp((p - 0.92) / 0.08), YC.apple)}
            <circle cx={hx} cy={hy} r={22} fill={YC.bus} stroke="#1B140E" strokeWidth={5} />
          </svg>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)" }} />
      <div style={{ position: "absolute", right: 90, bottom: 80, textAlign: "right" }}>
        <div style={{ fontFamily: SERIF, fontSize: 130, color: YC.bus, lineHeight: 1, textShadow: "0 8px 30px rgba(0,0,0,0.9)" }}>{distance}</div>
        {title ? <div style={{ fontFamily: TYPE, fontSize: 40, color: YC.paper, marginTop: 8 }}>{title}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ─── TIRA DE PELÍCULA 16 MM (proyector) ─────────────────────────────────────
export const FilmStrip: React.FC<{ srcs: (Src | string)[]; label?: string }> = ({ srcs: raw, label }) => {
  const srcs: Src[] = raw.map((x) => (typeof x === "string" ? { src: x } : x));
  const { f, a } = useLife(8, 10);
  const FH = 420, GAP = 60;
  const off = (f * 9) % (FH + GAP);
  const cells = Array.from({ length: 7 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ opacity: a, background: "radial-gradient(ellipse at 50% 50%, #251B12 0%, #070504 75%)" }}>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5, background: "conic-gradient(from 160deg at 110% 50%, rgba(0,0,0,0) 0deg, rgba(255,220,150,0.35) 8deg, rgba(0,0,0,0) 22deg)" }} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%, -50%) rotateY(-28deg) rotateZ(6deg)", width: 700, height: 2200, background: "#15100B",
          boxShadow: "0 0 120px rgba(0,0,0,0.9)", overflow: "hidden" }}>
          {cells.map((i) => {
            const y = i * (FH + GAP) - off - 200;
            const s = srcs[i % srcs.length];
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: 90, top: y, width: 520, height: FH, overflow: "hidden", background: "#000" }}>
                  <Media src={s.src} start={s.start} kb="none" filter="sepia(0.3) contrast(1.1)" />
                </div>
                {Array.from({ length: 4 }, (_, j) => (
                  <React.Fragment key={j}>
                    <div style={{ position: "absolute", left: 24, top: y + j * 120 + 20, width: 40, height: 56, borderRadius: 8, background: "#E9DDBF", opacity: 0.85 }} />
                    <div style={{ position: "absolute", right: 24, top: y + j * 120 + 20, width: 40, height: 56, borderRadius: 8, background: "#E9DDBF", opacity: 0.85 }} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      {label ? <div style={{ position: "absolute", left: 110, bottom: 110, fontFamily: TYPE, fontSize: 52, color: YC.paper, textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}>{label}</div> : null}
    </AbsoluteFill>
  );
};

// ─── ENTRADA DE CINE ────────────────────────────────────────────────────────
export const Ticket: React.FC<{ price: string; line1: string; line2?: string; bed?: string; bedStart?: number }> = ({ price, line1, line2, bed, bedStart }) => {
  const { f, D, a } = useLife(6, 10);
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 70 } });
  const rotY = interpolate(s, [0, 1], [-100, -14]) + (f / D) * 10;
  const tear = ease(clamp((f - (D * 0.62)) / 16));
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {bed ? <AbsoluteFill style={{ filter: "blur(10px) brightness(0.45) sepia(0.3)" }}><Media src={bed} start={bedStart} kb="in" /></AbsoluteFill> : <AbsoluteFill style={{ background: "#1A0F0B" }} />}
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: 960, top: 540, transformStyle: "preserve-3d", transform: `translate(-50%, -50%) rotateX(12deg) rotateY(${rotY}deg) rotateZ(-6deg) scale(${0.9 + s * 0.1})` }}>
          <div style={{ display: "flex", filter: "drop-shadow(0 50px 60px rgba(0,0,0,0.7))" }}>
            <div style={{ width: 900, height: 400, background: "linear-gradient(135deg, #E8B23A, #D8901E)", borderRadius: 18, position: "relative", padding: 40, boxSizing: "border-box",
              border: "4px dashed rgba(90,40,10,0.35)" }}>
              <div style={{ fontFamily: SANS, fontSize: 44, letterSpacing: 18, color: "#5A280A" }}>ADMIT ONE</div>
              <div style={{ fontFamily: SERIF, fontSize: 96, color: "#3A1704", lineHeight: 1, marginTop: 14 }}>{line1}</div>
              {line2 ? <div style={{ fontFamily: TYPE, fontSize: 34, color: "#5A280A", marginTop: 16 }}>{line2}</div> : null}
            </div>
            <div style={{ width: 260, height: 400, background: "linear-gradient(135deg, #E8B23A, #C98014)", borderRadius: 18, marginLeft: -2, borderLeft: "6px dotted #6B3510",
              display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${tear * 120}px, ${tear * 60}px) rotate(${tear * 18}deg)` }}>
              <div style={{ fontFamily: SERIF, fontSize: 120, color: "#3A1704", transform: "rotate(-90deg)" }}>{price}</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── BARRAS DE PIZARRÓN ─────────────────────────────────────────────────────
export const ChalkBars: React.FC<{ title: string; bars: { label: string; value: number; display: string; hot?: boolean }[] }> = ({ title, bars }) => {
  const { f, a } = useLife(8, 10);
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <AbsoluteFill style={{ opacity: a, background: `radial-gradient(ellipse at 50% 40%, ${YC.board} 0%, ${YC.boardDeep} 80%)` }}>
      <AbsoluteFill style={{ background: "repeating-radial-gradient(circle at 30% 20%, rgba(255,255,255,0.02) 0 2px, rgba(0,0,0,0) 2px 7px)" }} />
      <div style={{ position: "absolute", left: 140, top: 110, fontFamily: TYPE, fontSize: 64, color: YC.chalk, opacity: ease(f / 14) }}>{title}</div>
      {bars.map((b, i) => {
        const t = ease(clamp((f - 14 - i * 12) / 26));
        const w = (b.value / max) * 1250 * t;
        return (
          <div key={i} style={{ position: "absolute", left: 140, top: 330 + i * 240 }}>
            <div style={{ fontFamily: SANS, fontSize: 40, letterSpacing: 6, color: YC.chalk, opacity: 0.85 }}>{b.label}</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
              <div style={{ width: w, height: 90, background: b.hot ? YC.bus : "rgba(245,241,230,0.85)", borderRadius: 6, boxShadow: b.hot ? `0 0 30px ${YC.bus}` : undefined,
                filter: "url(#yc-chalk)" }} />
              <div style={{ fontFamily: SERIF, fontSize: 88, color: b.hot ? YC.bus : YC.chalk, marginLeft: 30, opacity: t }}>{b.display}</div>
            </div>
          </div>
        );
      })}
      <svg width="0" height="0"><filter id="yc-chalk"><feTurbulence baseFrequency="0.6" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="8" /></filter></svg>
    </AbsoluteFill>
  );
};

// ─── RÓTULO DE LUGAR / FECHA (overlay) ──────────────────────────────────────
export const PlaceTag: React.FC<{ place: string; date?: string }> = ({ place, date }) => {
  const { f, a } = useLife(1, 12);
  const n = Math.floor(Math.max(0, f - 4) * 1.1);
  const full = place + (date ? "  ·  " + date : "");
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, bottom: 96 }}>
        <div style={{ width: `${ease(clamp(f / 14)) * 100}%`, minWidth: 0, height: 4, background: YC.bus, marginBottom: 14, maxWidth: 520 }} />
        <div style={{ fontFamily: TYPE, fontSize: 56, color: YC.paper, textShadow: "0 3px 16px rgba(0,0,0,0.95)", whiteSpace: "nowrap" }}>
          {full.slice(0, n)}<span style={{ opacity: f % 14 < 7 ? 1 : 0, color: YC.bus }}>▌</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CONTADOR GRANDE (overlay) ──────────────────────────────────────────────
export const BigCount: React.FC<{ to: number; prefix?: string; suffix?: string; label?: string; decimals?: number; x?: number; y?: number }> =
  ({ to, prefix = "", suffix = "", label, decimals = 0, x = 1480, y = 540 }) => {
  const { f, a } = useLife(6, 12);
  const v = to * easeInOut(clamp((f - 4) / 34));
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(8,6,4,0.8) 0%, rgba(8,6,4,0.35) 45%, rgba(8,6,4,0) 70%)" }} />
      <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 240, lineHeight: 1, color: YC.bus, textShadow: "0 10px 40px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>{prefix}{v.toFixed(decimals)}<span style={{ fontSize: 110 }}>{suffix}</span></div>
        {label ? <div style={{ fontFamily: TYPE, fontSize: 44, color: YC.paper, marginTop: 10, textShadow: "0 3px 16px rgba(0,0,0,0.95)", maxWidth: 700 }}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
