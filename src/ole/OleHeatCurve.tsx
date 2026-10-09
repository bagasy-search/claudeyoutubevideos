// OleHeatCurve — curva calor/tiempo que Ole traza a lápiz EN VIVO sobre una hoja de libreta:
// hervor fuerte 10 min (naranja, burbujas) → caída → "a whisper" 1½–2 h (azul/verde) → marca "acid & sweet go in".
// mode "wrong": la curva se queda arriba las 2 h con la anotación roja "skins split · mush".
// Tiempos por props en SEGUNDOS relativos al inicio de la Sequence (beats/drawAt = [hervor, caída+meseta, marca final]).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, HAND, notebookBg, woodBg, hexA, rnd } from "./OleTheme";

const Bed: React.FC<{ src?: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!src) return <AbsoluteFill style={woodBg()} />;
  const s = 1.04 + 0.05 * (f / Math.max(1, durationInFrames));
  const url = /^(https?:|\/|data:)/.test(src) ? src : staticFile(src);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: "blur(6px) saturate(0.9)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.kraftL }}>
      {/\.(mp4|webm|mov)$/i.test(src) ? <OffthreadVideo src={url} muted style={st} /> : <Img src={url} style={st} />}
      <AbsoluteFill style={{ backgroundColor: hexA(OLE.cream, 0.22) }} />
    </AbsoluteFill>
  );
};

export type HeatLabels = { title?: string; boil?: string; whisper?: string; finish?: string; wrong?: string; xAxis?: string; yAxis?: string; ticks?: string[] };

const W = 1680, H = 940;              // hoja
const X0 = 250, X1 = 1580, YB = 800, YT = 240; // área del gráfico

export const OleHeatCurve: React.FC<{
  mode?: "right" | "wrong";
  labels?: HeatLabels;
  /** Alias de beats. [s] = [empieza el hervor, caída + meseta, marca final/anotación] */
  drawAt?: number[];
  beats?: number[];
  boilMin?: number;      // minutos de hervor fuerte
  finishMin?: number;    // minuto de la marca "acid & sweet"
  totalMin?: number;     // largo del eje X
  bed?: string;
  seed?: number;
}> = ({ mode = "right", labels = {}, drawAt, beats, boilMin = 10, finishMin = 104, totalMin = 120, bed, seed = 11 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dur = durationInFrames / fps;
  const t = f / fps;
  const wrong = mode === "wrong";
  const L = {
    title: labels.title ?? (wrong ? "What most folks do" : "How Ole runs the pot"),
    boil: labels.boil ?? (wrong ? "HARD BOIL · 2 HRS" : "HARD BOIL · 10 MIN"),
    whisper: labels.whisper ?? "A WHISPER · 1½–2 HRS",
    finish: labels.finish ?? "ACID & SWEET GO IN",
    wrong: labels.wrong ?? "skins split · mush",
    xAxis: labels.xAxis ?? "TIME",
    yAxis: labels.yAxis ?? "HEAT",
    ticks: labels.ticks ?? ["0", "30 min", "1 hr", "1½ hr", "2 hr"],
  };
  const bIn = drawAt ?? beats ?? [];
  const b0 = bIn[0] ?? 0.7;
  const b1 = Math.max(b0 + 1.9, bIn[1] ?? dur * 0.36);
  const b2 = Math.max(b1 + 2.2, bIn[2] ?? dur * 0.7);

  // entrada de la hoja
  const inP = interpolate(f, [0, 0.7 * fps], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const outP = interpolate(f, [durationInFrames - 0.4 * fps, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const xm = (m: number) => X0 + (m / totalMin) * (X1 - X0);
  const yh = (h: number) => YB - h * (YB - YT);
  const ss = (a: number, b: number, x: number) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const HI = 0.86, LO = 0.33, ST = 0.1;
  const endMin = wrong ? totalMin : Math.min(totalMin, finishMin + 9);
  const heat = (m: number) => {
    const rise = ST + (HI - ST) * ss(0, 2.6, m);
    if (wrong || m <= boilMin) return rise;
    return HI - (HI - LO) * ss(boilMin, boilMin + 4.5, m);
  };
  // puntos con temblor de lápiz (determinista)
  const pts: { m: number; x: number; y: number }[] = [];
  for (let m = 0; m <= endMin + 1e-6; m += 0.5) {
    const i = Math.round(m * 2);
    const jx = (rnd(seed * 97 + i) - 0.5) * 1.6;
    const jy = (rnd(seed * 131 + i) - 0.5) * 2.4 + Math.sin(i * 0.83 + seed) * 1.3;
    pts.push({ m, x: xm(m) + jx, y: yh(heat(m)) + jy });
  }
  // minuto dibujado hasta ahora
  const drawn = interpolate(t, [b0, b0 + 1.5, b1, b1 + 2.6], [0, boilMin + (wrong ? 0 : 1.5), boilMin + (wrong ? 0 : 1.5), endMin], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const upto = pts.filter((p) => p.m <= drawn);
  if (upto.length && drawn > upto[upto.length - 1].m && upto.length < pts.length) {
    const a = upto[upto.length - 1], b = pts[upto.length];
    const k = (drawn - a.m) / (b.m - a.m);
    upto.push({ m: drawn, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
  }
  const splitAt = boilMin + 1.5;
  const toD = (ps: { x: number; y: number }[]) => ps.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const hot = wrong ? upto : upto.filter((p) => p.m <= splitAt + 0.01);
  const calm = wrong ? [] : upto.filter((p) => p.m >= splitAt - 0.51);
  const tip = upto[upto.length - 1];
  const drawing = drawn > 0.05 && drawn < endMin - 0.05;

  // ejes a lápiz (se dibujan al entrar)
  const axP = interpolate(f, [0.15 * fps, 0.9 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const lab = (at: number, len = 0.45) => interpolate(t, [at, at + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.3, 0.4, 1) });
  const boilL = lab(b0 + 1.1);
  const whisperL = lab(b1 + 1.9);
  const finL = lab(b2, 0.55);

  // burbujas del hervor
  const boilX0 = xm(2.4), boilX1 = wrong ? xm(Math.min(drawn, totalMin)) : xm(Math.min(drawn, boilMin + 0.8));
  const nB = wrong ? 34 : 10;
  const bubbles = drawn > 2.4 ? Array.from({ length: nB }).map((_, i) => {
    const per = 0.9 + rnd(seed + i * 7) * 0.9;
    const ph = ((t + rnd(seed + i * 13) * per) % per) / per;
    const bx = boilX0 + rnd(seed + i * 17) * Math.max(0, boilX1 - boilX0) + Math.sin(ph * 6 + i) * 4;
    const by = yh(HI) - 10 - ph * (wrong ? 70 : 95);
    const r = 3 + rnd(seed + i * 23) * 7;
    return <circle key={i} cx={bx} cy={by} r={r * (0.6 + 0.4 * (1 - ph))} fill="none" stroke={OLE.fire} strokeWidth={2.6} opacity={(1 - ph) * 0.9 * boilL} />;
  }) : null;

  // "whisper": un par de burbujitas lentas sobre la meseta
  const wX0 = xm(boilMin + 5), wX1 = xm(Math.min(drawn, finishMin));
  const whispers = !wrong && drawn > boilMin + 6 ? Array.from({ length: 7 }).map((_, i) => {
    const per = 2.4 + rnd(seed + i * 5) * 1.6;
    const ph = ((t + rnd(seed + i * 29) * per) % per) / per;
    const bx = wX0 + rnd(seed + i * 31) * Math.max(0, wX1 - wX0);
    const by = yh(LO) - 10 - ph * 34;
    return <circle key={i} cx={bx} cy={by} r={3 + rnd(seed + i) * 2} fill="none" stroke={OLE.enamel} strokeWidth={2} opacity={(1 - ph) * 0.55 * whisperL} />;
  }) : null;

  const fX = xm(finishMin), fY = yh(heat(finishMin));
  const sheetRot = -0.7;
  const tickM = [0, 30, 60, 90, 120].map((m) => (m / 120) * totalMin);

  return (
    <AbsoluteFill style={{ opacity: outP }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: W, height: H, ...notebookBg(OLE.paper, 52), borderRadius: 6, boxShadow: `0 28px 60px ${OLE.shadow}, 0 3px 8px rgba(0,0,0,0.18)`, rotate: `${sheetRot}deg`, translate: `0px ${(1 - inP) * 90}px`, scale: String(0.95 + 0.05 * inP), opacity: inP, overflow: "hidden" }}>
          {/* agujeros de anillado */}
          {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 30, top: 80 + i * 128, width: 26, height: 26, borderRadius: "50%", background: hexA(OLE.iron, 0.18), boxShadow: "inset 0 2px 3px rgba(0,0,0,0.3)" }} />)}
          <div style={{ position: "absolute", left: 130, top: 44, fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: OLE.forest, letterSpacing: -0.5 }}>{L.title}</div>
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id={`hc-hot-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={OLE.fire} stopOpacity={0.30} />
                <stop offset="1" stopColor={OLE.ember} stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id={`hc-calm-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={OLE.enamel} stopOpacity={0.20} />
                <stop offset="1" stopColor={OLE.forest} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            {/* ejes */}
            <path d={`M${X0},${YB + 8} L${X0},${YB + 8 - (YB + 8 - 190) * axP}`} stroke={OLE.pencil} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={`M${X0 - 8},${YB} L${X0 - 8 + (X1 + 40 - X0) * axP},${YB + 2}`} stroke={OLE.pencil} strokeWidth={4} fill="none" strokeLinecap="round" />
            {axP > 0.95 ? <>
              <path d={`M${X0 - 12},206 L${X0},188 L${X0 + 12},206`} stroke={OLE.pencil} strokeWidth={4} fill="none" strokeLinecap="round" />
              <path d={`M${X1 + 18},${YB - 12} L${X1 + 34},${YB + 2} L${X1 + 18},${YB + 14}`} stroke={OLE.pencil} strokeWidth={4} fill="none" strokeLinecap="round" />
            </> : null}
            {tickM.map((m, i) => <path key={i} d={`M${xm(m)},${YB - 8} L${xm(m) + 1},${YB + 12}`} stroke={OLE.pencil} strokeWidth={3} opacity={axP} />)}
            {/* zonas coloreadas bajo la curva */}
            {hot.length > 1 ? <path d={`${toD(hot)} L${hot[hot.length - 1].x},${YB} L${hot[0].x},${YB} Z`} fill={wrong ? hexA(OLE.plaid, 0.13) : `url(#hc-hot-${seed})`} /> : null}
            {calm.length > 1 ? <path d={`${toD(calm)} L${calm[calm.length - 1].x},${YB} L${calm[0].x},${YB} Z`} fill={`url(#hc-calm-${seed})`} /> : null}
            {/* curva: lápiz de color + grafito encima */}
            {hot.length > 1 ? <>
              <path d={toD(hot)} stroke={wrong ? OLE.plaid : OLE.fire} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
              <path d={toD(hot)} stroke={OLE.pencil} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75} transform="translate(1.5,-2)" />
            </> : null}
            {calm.length > 1 ? <>
              <path d={toD(calm)} stroke={OLE.enamel} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
              <path d={toD(calm)} stroke={OLE.pencil} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} transform="translate(1.5,-2)" />
            </> : null}
            {bubbles}
            {whispers}
            {/* marca final */}
            {!wrong && finL > 0 ? <g opacity={Math.min(1, finL)}>
              <path d={`M${fX},${YB} L${fX},${YB - (YB - 282) * Math.min(1, finL)}`} stroke={OLE.forest} strokeWidth={4} strokeDasharray="12 10" />
              <circle cx={fX} cy={fY} r={16 * Math.min(1.2, finL)} fill={OLE.forest} stroke={OLE.paper} strokeWidth={4} />
              <path d={`M${fX - 7},${fY} l5,6 l10,-12`} stroke={OLE.paper} strokeWidth={4} fill="none" strokeLinecap="round" opacity={finL > 0.8 ? 1 : 0} />
            </g> : null}
            {/* anotación roja del modo wrong */}
            {wrong && finL > 0 ? (() => {
              const cx = X1 - 70, cy = yh(HI);
              const n = 60, k = Math.min(1, finL * 1.3);
              const d = Array.from({ length: Math.round(n * k) + 1 }).map((_, i) => {
                const a = -Math.PI * 0.9 + (i / n) * Math.PI * 2.15;
                const r = 1 + (rnd(seed + i) - 0.5) * 0.06;
                return `${i ? "L" : "M"}${(cx + Math.cos(a) * 150 * r).toFixed(1)},${(cy + Math.sin(a) * 62 * r).toFixed(1)}`;
              }).join(" ");
              return <path d={d} stroke={OLE.plaid} strokeWidth={6} fill="none" strokeLinecap="round" />;
            })() : null}
            {/* lápiz */}
            {drawing && tip ? (
              <g transform={`translate(${tip.x},${tip.y}) rotate(-38)`}>
                <polygon points="0,0 14,-7 14,7" fill="#E8C9A0" />
                <polygon points="0,0 5,-2.5 5,2.5" fill={OLE.pencil} />
                <rect x={14} y={-7} width={150} height={14} fill="#E3B23C" />
                <rect x={14} y={-7} width={150} height={4} fill="#F2CB63" />
                <rect x={164} y={-7} width={16} height={14} fill="#A9A9A9" />
                <rect x={180} y={-7} width={20} height={14} rx={3} fill="#D98C8C" />
              </g>
            ) : null}
          </svg>
          {/* rótulos de ejes */}
          <div style={{ position: "absolute", left: X0 - 170, top: YT + 20, fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 5, color: OLE.pencil, opacity: axP, rotate: "-90deg", transformOrigin: "center" }}>{L.yAxis}</div>
          <div style={{ position: "absolute", left: X1 - 80, top: YB + 60, fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 5, color: OLE.pencil, opacity: axP }}>{L.xAxis}</div>
          {tickM.map((m, i) => (
            <div key={i} style={{ position: "absolute", left: xm(m), top: YB + 18, translate: "-50% 0", fontFamily: HAND, fontWeight: 700, fontSize: 38, color: OLE.pencil, opacity: axP, whiteSpace: "nowrap" }}>{L.ticks[i] ?? ""}</div>
          ))}
          {/* rótulo del hervor */}
          <div style={{ position: "absolute", left: wrong ? (X0 + X1) / 2 - 20 : xm(boilMin) + 70, top: wrong ? yh(HI) - 150 : yh(HI) - 30, translate: wrong ? "-50% 0" : "0 0", opacity: boilL, scale: String(0.8 + 0.2 * boilL), transformOrigin: "left center", display: "flex", alignItems: "center", gap: 18 }}>
            {!wrong ? <svg width={70} height={40} style={{ overflow: "visible" }}><path d="M66,22 C40,26 22,24 6,16 M6,16 l14,-8 M6,16 l10,12" stroke={OLE.fire} strokeWidth={4.5} fill="none" strokeLinecap="round" /></svg> : null}
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 3, color: wrong ? OLE.plaid : OLE.fire, background: hexA(wrong ? OLE.plaid : OLE.ember, 0.18), padding: "4px 20px", borderRadius: 8, whiteSpace: "nowrap" }}>{L.boil}</div>
          </div>
          {/* rótulo de la meseta */}
          {!wrong ? (
            <div style={{ position: "absolute", left: (xm(boilMin + 6) + xm(finishMin)) / 2, top: yh(LO) - 130, translate: "-50% 0", opacity: whisperL, scale: String(0.85 + 0.15 * whisperL), fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 3, color: OLE.enamel, background: hexA(OLE.enamel, 0.1), padding: "4px 20px", borderRadius: 8, whiteSpace: "nowrap" }}>{L.whisper}</div>
          ) : null}
          {/* rótulo final */}
          {!wrong ? (
            <div style={{ position: "absolute", right: Math.max(60, W - fX - 60), top: 196, opacity: finL, translate: `${(1 - Math.min(1, finL)) * 30}px 0`, fontFamily: LABEL, fontWeight: 700, fontSize: 50, letterSpacing: 3, color: OLE.paper, background: OLE.forest, padding: "8px 22px", borderRadius: 8, whiteSpace: "nowrap", boxShadow: `0 6px 14px ${OLE.shadow}` }}>{L.finish}</div>
          ) : (
            <div style={{ position: "absolute", right: 90, top: yh(HI) + 90, opacity: finL, rotate: "-3deg", scale: String(0.8 + 0.2 * Math.min(1, finL)), fontFamily: HAND, fontWeight: 700, fontSize: 66, color: OLE.plaid, whiteSpace: "nowrap" }}>{L.wrong}</div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
