// TallerKit.tsx — set-pieces propios de "El Constructor Libre" (marca TALLER: crema/nogal, óxido, oro, serif).
// Todo por props (sin textos ni assets por default). Tiempos en CUADROS relativos al segmento.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, rnd, PhotoBed, Keyring } from "./RayStage";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const eo = Easing.out(Easing.cubic);
const r01 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: eo });
const sf = (p?: string) => (p ? (p.startsWith("http") ? p : staticFile(p)) : undefined);
const outK = (f: number, dur: number, n = 8) => 1 - r01(f, dur - n, dur);

// ── cinta métrica (primitiva de marca) ────────────────────────────────────────────────────────
export const Cinta: React.FC<{ width: number; u: number; y?: number; x?: number; rot?: number }> = ({ width, u, y = 0, x = 0, rot = 0 }) => {
  const w = width * u;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 46, overflow: "hidden", transform: `rotate(${rot}deg)`, transformOrigin: "0 50%", filter: "drop-shadow(0 8px 14px rgba(0,0,0,.55))" }}>
      <div style={{ width, height: 46, background: `linear-gradient(180deg, #E9C35A 0%, #D8AE3F 55%, #B98E2C 100%)`, borderTop: "2px solid #F6DC8A", borderBottom: "2px solid #8D6A1E", position: "relative" }}>
        {Array.from({ length: Math.floor(width / 12) }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: i * 12, top: 0, width: 2, height: i % 10 === 0 ? 26 : i % 5 === 0 ? 18 : 10, background: "#2A1D10" }} />
        ))}
        {Array.from({ length: Math.floor(width / 120) }).map((_, i) => (
          <div key={`n${i}`} style={{ position: "absolute", left: i * 120 + 5, top: 22, fontFamily: F_BODY, fontWeight: 700, fontSize: 17, color: i % 5 === 4 ? V.danger : "#2A1D10" }}>{i + 1}</div>
        ))}
      </div>
    </div>
  );
};

// ── texto con palabras que entran de a una (hot = palabras en oro) ─────────────────────────────
export const Palabras: React.FC<{ text: string; hot?: string[]; start: number; step?: number; size: number; color?: string; hotColor?: string; weight?: number; italic?: boolean }> = ({ text, hot = [], start, step = 4, size, color = V.white, hotColor = V.brass, weight = 700, italic }) => {
  const f = useCurrentFrame();
  const H = hot.map((h) => h.toLowerCase());
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, rowGap: size * 0.06, fontFamily: F_DISPLAY, fontWeight: weight, fontSize: size, lineHeight: 1.08, fontStyle: italic ? "italic" : undefined }}>
      {text.split(/\s+/).filter(Boolean).map((w, i) => {
        const k = r01(f, start + i * step, start + i * step + 9);
        const isHot = H.includes(w.toLowerCase().replace(/[^a-záéíóúñü0-9]/gi, ""));
        return (
          <span key={i} style={{ opacity: k, transform: `translateY(${(1 - k) * 26}px)`, color: isHot ? hotColor : color, textShadow: "0 6px 26px rgba(0,0,0,.85)", display: "inline-block" }}>
            {w}
            {isHot ? <svg style={{ position: "absolute", left: 0, bottom: -size * 0.1, width: "100%", height: size * 0.2, overflow: "visible" }} viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M2 6 Q 30 2 55 6 T 98 4" stroke={V.danger} strokeWidth="3" fill="none" strokeDasharray="120" strokeDashoffset={120 * (1 - r01(f, start + i * step + 8, start + i * step + 20))} /></svg> : null}
          </span>
        );
      })}
    </div>
  );
};

// ═════════ 1) FRASE DE TALLER — overlay sobre avatar/clip: kicker + frase cinética + subrayado a mano ═════════
export const FraseTaller: React.FC<{ kicker: string; title: string; hot?: string[]; side?: "left" | "right"; durationInFrames?: number }> = ({ kicker, title, hot = [], side = "left", durationInFrames = 120 }) => {
  const f = useCurrentFrame();
  const o = outK(f, durationInFrames, 9);
  const a = r01(f, 0, 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: side === "left" ? `linear-gradient(90deg, ${rgba(V.ink0, 0.82)} 0%, ${rgba(V.ink0, 0.45)} 38%, transparent 60%)` : `linear-gradient(270deg, ${rgba(V.ink0, 0.82)} 0%, ${rgba(V.ink0, 0.45)} 38%, transparent 60%)`, opacity: a }} />
      <div style={{ position: "absolute", [side]: "6%", bottom: "14%", width: "40%" } as React.CSSProperties}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: a, transform: `translateX(${(1 - a) * -30}px)` }}>
          <Keyring size={34} />
          <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 25, letterSpacing: 4, textTransform: "uppercase", color: V.brass }}>{kicker}</div>
        </div>
        <div style={{ marginTop: 14, width: `${r01(f, 3, 16) * 100}%`, height: 3, background: `linear-gradient(90deg, ${V.danger}, ${rgba(V.danger, 0)})` }} />
        <div style={{ marginTop: 18 }}><Palabras text={title} hot={hot} start={7} size={70} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ═════════ 2) ETIQUETA DE FICHA — lower-third con cinta métrica ═════════
export const EtiquetaFicha: React.FC<{ label: string; value: string; durationInFrames?: number }> = ({ label, value, durationInFrames = 100 }) => {
  const f = useCurrentFrame();
  const a = r01(f, 0, 12), o = outK(f, durationInFrames, 8);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", left: "5%", bottom: "9%", transform: `translateY(${(1 - a) * 40}px) rotate(-1.2deg)`, opacity: a }}>
        <div style={{ position: "relative", padding: "20px 34px 24px 30px", background: `linear-gradient(180deg, ${V.white} 0%, #E6D5B2 100%)`, borderRadius: 4, boxShadow: "0 18px 40px rgba(0,0,0,.55)", borderLeft: `10px solid ${V.danger}` }}>
          <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 21, letterSpacing: 3.5, color: V.danger, textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, color: "#2A1D10", marginTop: 4, whiteSpace: "nowrap" }}>{value}</div>
          <div style={{ position: "absolute", right: -18, top: -18, width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #F0D79A, #9C7424)", boxShadow: "0 3px 6px rgba(0,0,0,.5)" }} />
        </div>
        <div style={{ position: "relative", height: 46, marginTop: 10 }}><Cinta width={620} u={r01(f, 6, 26)} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ═════════ 3) SELLO GANCHO — set-piece del hook: zoom-punch, sello óxido, ≤5 palabras ═════════
export const SelloGancho: React.FC<{ line1: string; line2: string; bed?: string; durationInFrames?: number }> = ({ line1, line2, bed, durationInFrames = 90 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame: f - 2, fps, config: { damping: 11, stiffness: 180, mass: 0.7 } });
  const s2 = spring({ frame: f - 12, fps, config: { damping: 9, stiffness: 200, mass: 0.6 } });
  const shake = f >= 12 && f < 20 ? Math.sin(f * 3.1) * (20 - f) * 1.2 : 0;
  const o = outK(f, durationInFrames, 6);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      <PhotoBed src={bed} dim={0.5} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 150, color: V.white, lineHeight: 1, transform: `scale(${interpolate(s1, [0, 1], [2.4, 1])})`, opacity: Math.min(1, s1 * 1.5), textShadow: "0 12px 40px rgba(0,0,0,.9)", letterSpacing: "-0.01em" }}>{line1}</div>
        <div style={{ marginTop: 26, padding: "10px 46px 16px", border: `8px solid ${V.danger}`, borderRadius: 10, color: V.danger, fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 110, transform: `rotate(-6deg) scale(${interpolate(s2, [0, 1], [3, 1])})`, opacity: Math.min(1, s2 * 2), background: rgba(V.ink0, 0.35), textShadow: "0 0 30px rgba(0,0,0,.6)", boxShadow: `0 0 0 3px ${rgba(V.danger, 0.3)} inset` }}>{line2}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ 4) CAPÍTULO DE TALLER — número estampado + título + lápiz que subraya ═════════
export const CapituloTaller: React.FC<{ n: string; kicker: string; title: string; bed?: string; durationInFrames?: number }> = ({ n, kicker, title, bed, durationInFrames = 120 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = spring({ frame: f - 4, fps, config: { damping: 12, stiffness: 160 } });
  const u = r01(f, 18, 40);
  const o = outK(f, durationInFrames, 8);
  const cam = 1 + f * 0.0006;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <PhotoBed src={bed} dim={0.66} />
      <AbsoluteFill style={{ transform: `scale(${cam})`, alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ width: 250, height: 250, borderRadius: "50%", border: `7px double ${V.brass}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(st, [0, 1], [2.2, 1])}) rotate(${interpolate(st, [0, 1], [-30, -8])}deg)`, opacity: Math.min(1, st * 1.4), background: rgba(V.ink0, 0.5) }}>
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 130, color: V.brass }}>{n}</div>
          </div>
          <div style={{ maxWidth: 1000 }}>
            <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: V.danger, textTransform: "uppercase", opacity: r01(f, 8, 18) }}>{kicker}</div>
            <div style={{ marginTop: 14 }}><Palabras text={title} start={12} size={92} /></div>
            <div style={{ position: "relative", marginTop: 22, height: 40 }}>
              <div style={{ position: "absolute", left: 0, top: 16, width: 900 * u, height: 6, background: V.brass, borderRadius: 3 }} />
              <div style={{ position: "absolute", left: 900 * u - 20, top: -8, width: 170, height: 30, transform: "rotate(-18deg)", opacity: u > 0 && u < 1 ? 1 : 0 }}>
                <div style={{ width: 150, height: 26, background: "linear-gradient(180deg,#E24B2F,#9E2E1B)", borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ 5) MACETA EN CORTE — set-piece animado (SVG): "bien" (cubitos + drena) vs "mal" (entera + agua estancada) ═════════
export const MacetaCorte: React.FC<{ kicker: string; title: string; mode: "bien" | "mal" | "ambas"; labels: string[]; bed?: string; hitAt?: number; durationInFrames?: number }> = ({ kicker, title, mode, labels, bed, hitAt = 30, durationInFrames = 240 }) => {
  const f = useCurrentFrame();
  const o = outK(f, durationInFrames, 8);
  const cam = 1.0 + r01(f, 0, durationInFrames) * 0.05;
  const Pot: React.FC<{ kind: "bien" | "mal"; x: number; delay: number }> = ({ kind, x, delay }) => {
    const fd = f - delay;
    const drawn = r01(fd, 0, 22);
    const cubes = Array.from({ length: 11 }).map((_, i) => ({ cx: 110 + rnd(i * 3 + 1) * 280, cy: 355 + rnd(i * 7 + 2) * 95, s: 26 + rnd(i * 5) * 10, t: hitAt + i * 3 }));
    const water = kind === "mal" ? r01(fd, hitAt + 20, hitAt + 70) : 0;
    const drip = kind === "bien" ? ((fd - hitAt - 30) % 30) / 30 : 0;
    const stamp = spring({ frame: fd - hitAt - 55, fps: 30, config: { damping: 10, stiffness: 180 } });
    return (
      <svg x={x} y={0} width={520} height={620} viewBox="0 0 520 620" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`soil${kind}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A3E26" /><stop offset="1" stopColor="#3B2717" /></linearGradient>
          <clipPath id={`in${kind}`}><path d="M78 120 L442 120 L400 500 L120 500 Z" /></clipPath>
        </defs>
        {/* tierra */}
        <g clipPath={`url(#in${kind})`} opacity={drawn}>
          <rect x={60} y={140} width={400} height={380} fill={`url(#soil${kind})`} />
          {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={80 + rnd(i * 11) * 360} cy={150 + rnd(i * 13) * 350} r={1.5 + rnd(i) * 2.5} fill={rgba("#9A7652", 0.5)} />)}
          {kind === "mal" ? <>
            <rect x={60} y={500 - 110 * water} width={400} height={110 * water + 10} fill={rgba(V.danger, 0.55)} />
            <rect x={96} y={440} width={330} height={52} rx={6} fill="#D8B84A" opacity={r01(fd, hitAt, hitAt + 10)} transform={`translate(0 ${(1 - r01(fd, hitAt, hitAt + 12)) * -300})`} />
            {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={110 + rnd(i * 17) * 300} cy={448 + rnd(i * 19) * 38} r={3} fill="#A88A2C" opacity={r01(fd, hitAt + 8, hitAt + 14)} />)}
          </> : cubes.map((c, i) => { const k = r01(fd, c.t, c.t + 10); return <rect key={i} x={c.cx} y={c.cy - (1 - k) * 320} width={c.s} height={c.s} rx={4} fill="#E2C24E" stroke="#A88A2C" strokeWidth={2} opacity={k} transform={`rotate(${(rnd(i) - 0.5) * 30} ${c.cx + c.s / 2} ${c.cy})`} />; })}
          {/* raíces */}
          {Array.from({ length: 9 }).map((_, i) => { const ang = -0.9 + (i / 8) * 1.8; const len = 170 + rnd(i * 23) * 150; const k = r01(fd, 10, 50); const x2 = 260 + Math.sin(ang) * len * 0.8, y2 = 150 + Math.cos(ang) * len * k; return <path key={i} d={`M260 150 Q ${260 + Math.sin(ang) * 40} ${200} ${x2} ${y2}`} stroke={kind === "mal" && water > 0.6 ? "#3A2618" : "#EFE2C4"} strokeWidth={3 - i * 0.15} fill="none" opacity={0.85} />; })}
        </g>
        {/* maceta de barro */}
        <path d="M60 110 L460 110 L415 510 L105 510 Z M78 120 L442 120 L400 500 L120 500 Z" fillRule="evenodd" fill="#C4683E" stroke="#7A3A1E" strokeWidth={4} strokeDasharray={2400} strokeDashoffset={2400 * (1 - drawn)} />
        <rect x={44} y={92} width={432} height={36} rx={6} fill="#D0764A" stroke="#7A3A1E" strokeWidth={4} opacity={drawn} />
        {/* agujero */}
        <rect x={236} y={498} width={48} height={16} fill={kind === "mal" ? "#D8B84A" : "#1A120C"} opacity={drawn} />
        {/* planta */}
        <g opacity={r01(fd, 6, 20)} transform={`translate(260 110) scale(${kind === "mal" && water > 0.7 ? 0.95 : 1})`}>
          <path d="M0 0 C -4 -60 6 -110 0 -150" stroke="#5E8C3A" strokeWidth={8} fill="none" />
          {[[-1, -70], [1, -95], [-1, -125], [1, -145]].map(([s, y], i) => <ellipse key={i} cx={s * 42} cy={y} rx={46} ry={20} fill={kind === "mal" && water > 0.7 ? "#B7A33E" : "#7DB14A"} transform={`rotate(${s * -25} ${s * 42} ${y})`} />)}
        </g>
        {kind === "bien" && fd > hitAt + 30 ? <g transform={`translate(260 ${520 + drip * 80})`} opacity={1 - drip}><path d="M0 0 C -12 18 -12 30 0 34 C 12 30 12 18 0 0 Z" fill="#6FB6E0" /></g> : null}
        {/* sello */}
        <g transform={`translate(430 70) scale(${interpolate(stamp, [0, 1], [2.5, 1])}) rotate(-10)`} opacity={Math.min(1, stamp * 1.5)}>
          <circle r={62} fill={rgba(V.ink0, 0.6)} stroke={kind === "bien" ? V.ok : V.danger} strokeWidth={9} />
          {kind === "bien" ? <path d="M-30 2 L-8 26 L34 -24" stroke={V.ok} strokeWidth={14} fill="none" strokeLinecap="round" /> : <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke={V.danger} strokeWidth={14} strokeLinecap="round" />}
        </g>
      </svg>
    );
  };
  const both = mode === "ambas";
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <PhotoBed src={bed} dim={0.72} />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <div style={{ position: "absolute", left: 110, top: 70 }}>
          <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: V.brass, textTransform: "uppercase", opacity: r01(f, 0, 10) }}>{kicker}</div>
          <div style={{ marginTop: 8, maxWidth: 1500 }}><Palabras text={title} start={4} size={66} /></div>
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <g transform={both ? "translate(170 300) scale(1.08)" : "translate(260 280) scale(1.25)"}>
            {both ? <><Pot kind="bien" x={0} delay={0} /><Pot kind="mal" x={880} delay={hitAt + 40} /></> : <Pot kind={mode as "bien" | "mal"} x={0} delay={0} />}
          </g>
        </svg>
        {!both ? (
          <div style={{ position: "absolute", left: 1060, top: 380, width: 760 }}>
            {labels.map((l, i) => {
              const k = r01(f, hitAt + 10 + i * 22, hitAt + 22 + i * 22);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 34, opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
                  <div style={{ width: 90 * k, height: 4, background: mode === "bien" ? V.brass : V.danger }} />
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, color: V.white, textShadow: "0 5px 20px rgba(0,0,0,.8)" }}>{l}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {labels.slice(0, 2).map((l, i) => {
              const k = r01(f, i === 0 ? hitAt + 30 : hitAt * 2 + 100, i === 0 ? hitAt + 42 : hitAt * 2 + 112);
              return <div key={i} style={{ position: "absolute", top: 985, left: i === 0 ? 170 : 1050, width: 640, textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, color: i === 0 ? V.ok : V.dangerSoft, opacity: k, textShadow: "0 5px 20px rgba(0,0,0,.8)" }}>{l}</div>;
            })}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ 6) REGLA DE MEDIDAS — cinta métrica que se estira + 3 macetas que crecen con su medida ═════════
export const ReglaMedidas: React.FC<{ kicker: string; title: string; rows: { size: string; value: string; at: number }[]; bed?: string; durationInFrames?: number }> = ({ kicker, title, rows, bed, durationInFrames = 300 }) => {
  const f = useCurrentFrame();
  const o = outK(f, durationInFrames, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <PhotoBed src={bed} dim={0.72} />
      <div style={{ position: "absolute", left: 120, top: 80 }}>
        <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: V.brass, textTransform: "uppercase", opacity: r01(f, 0, 10) }}>{kicker}</div>
        <div style={{ marginTop: 8 }}><Palabras text={title} start={4} size={70} /></div>
      </div>
      <Cinta width={1680} u={r01(f, 6, 40)} x={120} y={290} />
      {rows.map((r, i) => {
        const k = r01(f, r.at, r.at + 12);
        const sc = 0.62 + i * 0.22;
        const x = 150 + i * 570;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 380, width: 520, opacity: k, transform: `translateY(${(1 - k) * 60}px)` }}>
            <div style={{ height: 330, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <svg width={240 * sc} height={250 * sc} viewBox="0 0 240 250"><path d="M10 20 L230 20 L200 245 L40 245 Z" fill="#C4683E" stroke="#7A3A1E" strokeWidth={5} /><rect x={0} y={4} width={240} height={30} rx={5} fill="#D0764A" stroke="#7A3A1E" strokeWidth={5} />{Array.from({ length: 1 + i * 2 }).map((_, j) => <rect key={j} x={70 + (j % 3) * 36} y={150 + Math.floor(j / 3) * 34} width={26} height={26} rx={4} fill="#E2C24E" stroke="#A88A2C" strokeWidth={2} />)}</svg>
            </div>
            <div style={{ textAlign: "center", fontFamily: F_BODY, fontWeight: 800, fontSize: 34, color: V.brass, marginTop: 20, letterSpacing: 1 }}>{r.size}</div>
            <div style={{ textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, color: V.white, marginTop: 8, textShadow: "0 5px 20px rgba(0,0,0,.8)" }}>{r.value}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ═════════ 7) ERROR / CORRECTO — split de dos fotos con sello ❌ y ✅ ═════════
export const ErrorCorrecto: React.FC<{ kicker: string; malLabel: string; bienLabel: string; malImg: string; bienImg: string; flipAt?: number; durationInFrames?: number }> = ({ kicker, malLabel, bienLabel, malImg, bienImg, flipAt = 45, durationInFrames = 180 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = outK(f, durationInFrames, 8);
  const a = r01(f, 0, 12), b = r01(f, flipAt, flipAt + 14);
  const s1 = spring({ frame: f - 14, fps, config: { damping: 10, stiffness: 190 } });
  const s2 = spring({ frame: f - flipAt - 12, fps, config: { damping: 10, stiffness: 190 } });
  const Panel: React.FC<{ img: string; label: string; k: number; s: number; ok: boolean; left: boolean }> = ({ img, label, k, s, ok, left }) => (
    <div style={{ position: "absolute", top: 150, [left ? "left" : "right"]: 70, width: 860, height: 800, opacity: k, transform: `translateY(${(1 - k) * 80}px) rotate(${left ? -1.5 : 1.5}deg)` } as React.CSSProperties}>
      <div style={{ position: "absolute", inset: 0, padding: 16, background: V.white, borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
        <div style={{ position: "relative", width: "100%", height: 640, overflow: "hidden", borderRadius: 3 }}>
          <Img src={sf(img)!} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + f * 0.0008})`, filter: ok ? undefined : "saturate(.75)" }} />
        </div>
        <div style={{ marginTop: 22, textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, color: ok ? "#3E5C22" : V.danger }}>{label}</div>
      </div>
      <div style={{ position: "absolute", top: -40, [left ? "right" : "left"]: -30, width: 150, height: 150, borderRadius: "50%", background: ok ? V.ok : V.danger, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(s, [0, 1], [2.6, 1])}) rotate(-8deg)`, opacity: Math.min(1, s * 1.6), boxShadow: "0 12px 30px rgba(0,0,0,.6)", border: `6px solid ${V.white}` } as React.CSSProperties}>
        <svg width={80} height={80} viewBox="-40 -40 80 80">{ok ? <path d="M-24 2 L-6 22 L26 -20" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" /> : <path d="M-20 -20 L20 20 M20 -20 L-20 20" stroke="#fff" strokeWidth={12} strokeLinecap="round" />}</svg>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <PhotoBed src={bienImg} dim={0.8} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: F_BODY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: V.brass, textTransform: "uppercase", opacity: a }}>{kicker}</div>
      <Panel img={malImg} label={malLabel} k={a} s={s1} ok={false} left />
      <Panel img={bienImg} label={bienLabel} k={b} s={s2} ok left={false} />
    </AbsoluteFill>
  );
};

// ═════════ 8) ZOOM CON CÍRCULO — foto que se congela, empuja al detalle, círculo a mano + rótulo ═════════
export const ZoomCirculo: React.FC<{ image: string; x: number; y: number; label: string; hitAt?: number; durationInFrames?: number }> = ({ image, x, y, label, hitAt = 20, durationInFrames = 150 }) => {
  const f = useCurrentFrame();
  const o = outK(f, durationInFrames, 6);
  const z = interpolate(f, [0, hitAt, hitAt + 18, durationInFrames], [1.04, 1.08, 1.7, 1.78], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const c = r01(f, hitAt + 16, hitAt + 34);
  const lab = r01(f, hitAt + 26, hitAt + 38);
  const flash = interpolate(f, [hitAt, hitAt + 3, hitAt + 9], [0, 0.35, 0], CL);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden", background: V.ink0 }}>
      <Img src={sf(image)!} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${x * 100}% ${y * 100}%`, transform: `scale(${z})` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: `radial-gradient(40% 45% at 50% 50%, transparent 55%, ${rgba(V.ink0, 0.55)} 100%)`, opacity: c }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={x * 1920 + (0.5 - x) * 1920 * (1 - 1 / z)} cy={y * 1080 + (0.5 - y) * 0} rx={230} ry={170} fill="none" stroke={V.danger} strokeWidth={9} strokeDasharray={1300} strokeDashoffset={1300 * (1 - c)} strokeLinecap="round" transform={`rotate(-8 ${x * 1920} ${y * 1080})`} />
      </svg>
      <div style={{ position: "absolute", left: "50%", bottom: "8%", transform: `translateX(-50%) translateY(${(1 - lab) * 30}px)`, opacity: lab, padding: "14px 34px 18px", background: V.white, borderLeft: `10px solid ${V.danger}`, borderRadius: 4, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, color: "#2A1D10", whiteSpace: "nowrap", boxShadow: "0 18px 40px rgba(0,0,0,.6)" }}>{label}</div>
    </AbsoluteFill>
  );
};

// ═════════ 9) LÁMINA — pantalla completa, recorrido de zoom punto por punto ═════════
export const LaminaTour: React.FC<{ src: string; points: { x: number; y: number; z: number; at: number }[]; durationInFrames?: number }> = ({ src, points, durationInFrames = 900 }) => {
  const f = useCurrentFrame();
  const P = [{ x: 0.5, y: 0.5, z: 1, at: 0 }, ...points];
  let i = 0;
  while (i + 1 < P.length && f >= P[i + 1].at) i++;
  const cur = P[i], nx = P[Math.min(i + 1, P.length - 1)];
  const k = i + 1 < P.length ? 0 : 1;
  const prev = P[Math.max(0, i - 1)];
  const t = r01(f, cur.at, cur.at + 22);
  const from = i === 0 ? cur : prev;
  const zz = from.z + (cur.z - from.z) * t, xx = from.x + (cur.x - from.x) * t, yy = from.y + (cur.y - from.y) * t;
  void nx; void k;
  const intro = spring({ frame: f, fps: 30, config: { damping: 18, stiffness: 90 } });
  const o = outK(f, durationInFrames, 8);
  // traslación para que el punto (xx,yy) quede en el centro, sin mostrar borde
  const tx = Math.max(Math.min((0.5 - xx) * 1920 * zz, (zz - 1) * 960), -(zz - 1) * 960);
  const ty = Math.max(Math.min((0.5 - yy) * 1080 * zz, (zz - 1) * 540), -(zz - 1) * 540);
  return (
    <AbsoluteFill style={{ background: "#1A120C", opacity: o, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${zz * interpolate(intro, [0, 1], [0.86, 1])})`, transformOrigin: "50% 50%", opacity: Math.min(1, intro * 1.4) }}>
        <Img src={sf(src)!} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ 10) CTA DE LA GUÍA — portada 2.5D flotando + páginas en abanico + QR grande + dominio ═════════
export const GuiaCta: React.FC<{ kicker: string; title: string; items: string[]; portada: string; peeks: string[]; qr: string; domain: string; bed?: string; durationInFrames?: number }> = ({ kicker, title, items, portada, peeks, qr, domain, bed, durationInFrames = 300 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = outK(f, durationInFrames, 8);
  const pin = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 90 } });
  const qin = spring({ frame: f - 12, fps, config: { damping: 15, stiffness: 110 } });
  const fl = Math.sin(f / 26) * 10, tilt = Math.sin(f / 48) * 4;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <PhotoBed src={bed} dim={0.7} />
      {/* páginas en abanico detrás */}
      <div style={{ position: "absolute", left: 150, top: 170, width: 560, height: 760, perspective: 1600 }}>
        {peeks.slice(0, 5).map((p, i) => {
          const k = r01(f, 16 + i * 5, 34 + i * 5);
          const ang = (-22 + i * 8) * k;
          return <Img key={i} src={sf(p)!} style={{ position: "absolute", left: 40, top: 40, width: 440, height: 600, objectFit: "cover", borderRadius: 6, transformOrigin: "50% 120%", transform: `rotate(${ang}deg) translateY(${-20 * k}px)`, boxShadow: "0 20px 40px rgba(0,0,0,.55)", opacity: 0.95 * k, border: `3px solid ${V.white}` }} />;
        })}
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${fl}px) rotateY(${-16 + tilt}deg) rotateX(4deg) scale(${interpolate(pin, [0, 1], [0.6, 1])})`, opacity: Math.min(1, pin * 1.5), transformStyle: "preserve-3d" }}>
          <Img src={sf(portada)!} style={{ width: 560, height: 760, objectFit: "cover", borderRadius: 8, boxShadow: `0 50px 90px rgba(0,0,0,.7), -18px 0 0 ${rgba("#0A0604", 0.6)}` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: `linear-gradient(115deg, transparent ${(f * 1.4) % 220 - 60}%, rgba(255,255,255,.22) ${(f * 1.4) % 220 - 45}%, transparent ${(f * 1.4) % 220 - 30}%)` }} />
        </div>
      </div>
      {/* columna derecha */}
      <div style={{ position: "absolute", left: 960, top: 100, width: 880 }}>
        <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: V.brass, textTransform: "uppercase", opacity: r01(f, 4, 14) }}>{kicker}</div>
        <div style={{ marginTop: 8 }}><Palabras text={title} start={8} size={58} /></div>
        <div style={{ marginTop: 18 }}>
          {items.map((it, i) => {
            const k = r01(f, 30 + i * 9, 42 + i * 9);
            return <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8, opacity: k, transform: `translateX(${(1 - k) * 40}px)`, fontFamily: F_BODY, fontWeight: 600, fontSize: 30, color: V.bone }}><div style={{ width: 12, height: 12, background: V.danger, transform: "rotate(45deg)" }} />{it}</div>;
          })}
        </div>
      </div>
      {/* QR grande: fondo blanco, nunca tapado */}
      <div style={{ position: "absolute", left: 960, right: 90, bottom: 60, justifyContent: "flex-end", display: "flex", alignItems: "center", gap: 30, opacity: Math.min(1, qin * 1.5), transform: `scale(${interpolate(qin, [0, 1], [0.7, 1])})`, transformOrigin: "100% 100%" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 28, color: V.bone }}>Apunta la cámara de tu teléfono</div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 44, color: V.white, marginTop: 6, whiteSpace: "nowrap" }}>{domain}</div>
          <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 26, color: V.brass, marginTop: 6 }}>o el enlace en la descripción</div>
        </div>
        <div style={{ background: "#FFFFFF", padding: 22, borderRadius: 18, boxShadow: "0 30px 60px rgba(0,0,0,.65)" }}>
          <Img src={sf(qr)!} style={{ width: 380, height: 380, display: "block", imageRendering: "pixelated" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
