import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  spring,
} from "remotion";
import { COLORS, SERIF } from "../theme";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Shared bright bokeh stage (continuity with CropReel3D / CropChapter3D)
const Stage: React.FC<{ children: React.ReactNode; tint?: string }> = ({ children, tint = "rgba(124,138,90,0.18)" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#f3efe6", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -80, background: "radial-gradient(120% 90% at 50% 34%, #fdfbf6 0%, #f1ece0 55%, #e6dcc7 100%)" }} />
      {[{ x: 0.14, y: 0.2, r: 300, c: tint }, { x: 0.86, y: 0.7, r: 320, c: "rgba(169,121,74,0.16)" }, { x: 0.5, y: 0.9, r: 260, c: "rgba(255,255,255,0.45)" }].map((b, k) => (
        <div key={k} style={{ position: "absolute", left: b.x * width, top: b.y * height, width: b.r, height: b.r, marginLeft: -b.r / 2, marginTop: -b.r / 2, borderRadius: "50%", background: b.c, filter: "blur(60px)", transform: `translate(${Math.sin(frame * 0.01 + k) * 14}px, ${Math.cos(frame * 0.013 + k) * 10}px)` }} />
      ))}
      {children}
    </AbsoluteFill>
  );
};

const Title: React.FC<{ eyebrow: string; title: string; op?: number }> = ({ eyebrow, title, op = 1 }) => {
  const { width } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: op }}>
      <div style={{ fontFamily: SERIF, fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: COLORS.amber }}>{eyebrow}</div>
      <div style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 700, color: COLORS.text, marginTop: 6, maxWidth: width * 0.8, marginInline: "auto", lineHeight: 1.05 }}>{title}</div>
    </div>
  );
};

// ── 1. SeasonDial — "La puerta de Perséfone" (daylight curve + 10h line) ──────
export const SeasonDial: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const gx0 = width * 0.14, gx1 = width * 0.86, gy0 = height * 0.32, gy1 = height * 0.8;
  const hours = [8.6, 9.6, 11.3, 13.1, 14.6, 15.2, 14.9, 13.6, 11.9, 10.1, 8.9, 8.2]; // avg day length by month (N hemisphere)
  const hMin = 7.5, hMax = 15.8;
  const px = (i: number) => gx0 + (i / 11) * (gx1 - gx0);
  const py = (h: number) => gy1 - ((h - hMin) / (hMax - hMin)) * (gy1 - gy0);
  const y10 = py(10);

  const draw = interpolate(t, [0.08, 0.62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
  const drawIdx = draw * 11;
  // path for the daylight curve up to drawIdx
  let d = `M ${px(0)} ${py(hours[0])}`;
  for (let i = 1; i <= 11; i++) {
    if (i <= drawIdx) d += ` L ${px(i)} ${py(hours[i])}`;
    else {
      const f = drawIdx - (i - 1);
      if (f > 0) { const x = px(i - 1) + (px(i) - px(i - 1)) * f, y = py(hours[i - 1]) + (py(hours[i]) - py(hours[i - 1])) * f; d += ` L ${x} ${y}`; }
      break;
    }
  }
  const sunI = Math.min(11, drawIdx);
  const si = Math.floor(sunI), sf = sunI - si;
  const sunX = px(si) + (px(Math.min(11, si + 1)) - px(si)) * sf;
  const sunY = py(hours[si]) + (py(hours[Math.min(11, si + 1)]) - py(hours[si])) * sf;

  const lineDraw = interpolate(t, [0.55, 0.72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoneOp = interpolate(t, [0.72, 0.86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // sub-10h zone spans ~ month 9.3 (Oct) .. 11 (Dic) and wraps; here draw Oct..Dic + Ene..early
  const zoneX0 = px(9.3), zoneX1 = px(11);
  const sepPulse = 0.5 + 0.5 * Math.sin(frame * 0.2);

  return (
    <Stage tint="rgba(111,132,120,0.2)">
      <Title eyebrow="El error no es el frío — es la luz" title="La puerta de Perséfone" />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* axes */}
        <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="rgba(42,38,32,0.25)" strokeWidth={2} />
        {MONTHS.map((m, i) => (
          <text key={i} x={px(i)} y={gy1 + 34} textAnchor="middle" fontFamily={SERIF} fontSize={22} fill={COLORS.textSoft}>{m}</text>
        ))}
        {/* sub-10h shaded zone (the sleep) */}
        <rect x={zoneX0} y={gy0} width={zoneX1 - zoneX0} height={gy1 - gy0} fill="rgba(111,132,120,0.16)" opacity={zoneOp} />
        {zoneOp > 0.3 && (
          <text x={(zoneX0 + zoneX1) / 2} y={gy0 + 34} textAnchor="middle" fontFamily={SERIF} fontSize={22} fill={COLORS.cold} opacity={zoneOp}>la huerta se duerme</text>
        )}
        {/* 10h reference line */}
        <line x1={gx0} y1={y10} x2={gx0 + (gx1 - gx0) * lineDraw} y2={y10} stroke={COLORS.danger} strokeWidth={3} strokeDasharray="10 8" />
        {lineDraw > 0.6 && <text x={gx1} y={y10 - 12} textAnchor="end" fontFamily={SERIF} fontSize={24} fontWeight={700} fill={COLORS.danger}>10 horas de luz</text>}
        {/* daylight curve */}
        <path d={d} fill="none" stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        {/* sun dot */}
        <circle cx={sunX} cy={sunY} r={14} fill={COLORS.amber} />
        <circle cx={sunX} cy={sunY} r={22} fill="none" stroke={COLORS.amber} strokeWidth={2} opacity={0.5} />
        {/* September window marker */}
        <g opacity={interpolate(t, [0.3, 0.42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <line x1={px(8)} y1={gy0} x2={px(8)} y2={gy1} stroke={COLORS.good} strokeWidth={2} strokeDasharray="4 6" opacity={0.7} />
          <circle cx={px(8)} cy={py(hours[8])} r={10 + sepPulse * 4} fill="none" stroke={COLORS.good} strokeWidth={3} />
          <text x={px(8)} y={gy0 - 8} textAnchor="middle" fontFamily={SERIF} fontSize={22} fontWeight={700} fill={COLORS.good}>sembrá ahora</text>
        </g>
      </svg>
    </Stage>
  );
};

// ── 2. StarchToSugar — frost turns starch into sugar (antifreeze) ────────────
export const StarchToSugar: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / durationInFrames;
  const cx = width * 0.56, cy = height * 0.56;

  const temp = interpolate(t, [0.1, 0.5], [12, -6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
  const trigger = clamp01((0 - temp) / 3); // 0..1 once temp goes below ~0..-3
  const sweet = interpolate(t, [0.5, 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // thermometer
  const thX = width * 0.18, thTop = height * 0.32, thBot = height * 0.78;
  const merc = interpolate(temp, [-8, 16], [0, 1]);
  const mercY = thBot - merc * (thBot - thTop);

  // starch chain nodes → sugar hexes
  const chain = Array.from({ length: 10 }, (_, i) => ({ i, x: cx - 200 + (i % 5) * 100, y: cy - 60 + Math.floor(i / 5) * 120 }));

  return (
    <Stage tint="rgba(169,121,74,0.16)">
      <Title eyebrow="Por qué la helada la endulza" title="Almidón que se vuelve azúcar" />
      {/* thermometer */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <rect x={thX - 16} y={thTop} width={32} height={thBot - thTop} rx={16} fill="rgba(42,38,32,0.08)" stroke="rgba(42,38,32,0.2)" strokeWidth={2} />
        <rect x={thX - 10} y={mercY} width={20} height={thBot - mercY} rx={10} fill={temp < 0 ? COLORS.cold : COLORS.danger} />
        <circle cx={thX} cy={thBot + 8} r={26} fill={temp < 0 ? COLORS.cold : COLORS.danger} />
        <text x={thX + 40} y={mercY + 8} fontFamily={SERIF} fontSize={40} fontWeight={700} fill={COLORS.text}>{Math.round(temp)}°</text>
        {/* line linking to leaf */}
      </svg>
      {/* leaf with starch→sugar */}
      <div style={{ position: "absolute", left: cx - 260, top: cy - 170, width: 520, height: 360, borderRadius: "48% 48% 46% 46%", background: `linear-gradient(160deg, ${COLORS.good}, ${COLORS.accent})`, boxShadow: "0 30px 70px rgba(42,38,32,0.25)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `rgba(200,225,235,${trigger * 0.35})` }} />
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {chain.map((n) => {
          const broke = trigger;
          const spread = broke * 40 * (n.i % 2 ? 1 : -1);
          const glow = interpolate(sweet, [0, 1], [0, 1]);
          return (
            <g key={n.i} transform={`translate(${n.x + spread}, ${n.y - broke * 20})`}>
              {/* connector before break */}
              {n.i % 5 !== 4 && <line x1={12} y1={0} x2={88} y2={0} stroke="rgba(255,255,255,0.6)" strokeWidth={4} opacity={1 - broke} />}
              <circle r={16 + glow * 4} fill={broke > 0.5 ? "#F2D98A" : "#EFE7D3"} opacity={0.95} style={{ filter: broke > 0.5 ? `drop-shadow(0 0 ${glow * 10}px #F2D98A)` : "none" }} />
            </g>
          );
        })}
      </svg>
      {/* sweetness meter */}
      <div style={{ position: "absolute", right: width * 0.1, top: height * 0.4, width: 300 }}>
        <div style={{ fontFamily: SERIF, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: COLORS.textSoft, marginBottom: 10 }}>Dulzor</div>
        <div style={{ height: 26, borderRadius: 13, background: "rgba(42,38,32,0.08)", overflow: "hidden", border: "2px solid rgba(42,38,32,0.15)" }}>
          <div style={{ height: "100%", width: `${sweet * 100}%`, background: `linear-gradient(90deg, ${COLORS.amber}, #E0A82E)`, borderRadius: 13 }} />
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 26, color: COLORS.text, marginTop: 14, opacity: sweet }}>El azúcar es su anticongelante.</div>
      </div>
    </Stage>
  );
};

// ── 3. VernalizationClock — one clove → a whole head (garlic) ────────────────
export const VernalizationClock: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / durationInFrames;
  const cx = width * 0.42, cy = height * 0.56;

  const coldDays = Math.round(interpolate(t, [0.12, 0.62], [0, 42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ringProg = interpolate(t, [0.12, 0.62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const split = spring({ frame: frame - durationInFrames * 0.66, fps, config: { damping: 12, mass: 0.7 } });
  const R = 190;

  return (
    <Stage tint="rgba(124,138,90,0.16)">
      <Title eyebrow="El único que no perdona: plantalo ya" title="Un diente se vuelve una cabeza" />
      {/* soil cross-section */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: height * 0.42, background: "linear-gradient(180deg, #7a5a3a, #5b4028)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* frost ring gauge */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={14} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={COLORS.cold} strokeWidth={14} strokeLinecap="round"
          strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - ringProg)} transform={`rotate(-90 ${cx} ${cy})`} />
        {/* clove → head */}
        {split < 0.05 ? (
          <g transform={`translate(${cx},${cy})`}>
            <path d="M -34 60 C -60 -10, -20 -90, 0 -90 C 20 -90, 60 -10, 34 60 C 20 78, -20 78, -34 60 Z" fill="#efe6d4" stroke="#cdbfa0" strokeWidth={3} />
          </g>
        ) : (
          <g transform={`translate(${cx},${cy})`}>
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
              const rr = 44 * split;
              return <path key={i} transform={`translate(${Math.cos(a) * rr},${Math.sin(a) * rr}) rotate(${(a * 180) / Math.PI + 90})`} d="M -14 26 C -24 -6, -8 -40, 0 -40 C 8 -40, 24 -6, 14 26 C 8 34, -8 34, -14 26 Z" fill="#efe6d4" stroke="#cdbfa0" strokeWidth={2} />;
            })}
          </g>
        )}
        <text x={cx} y={cy - R - 24} textAnchor="middle" fontFamily={SERIF} fontSize={26} fontWeight={700} fill={COLORS.cold}>{coldDays} días de frío</text>
      </svg>
      {/* big 1 -> 12 */}
      <div style={{ position: "absolute", right: width * 0.1, top: height * 0.42, display: "flex", alignItems: "center", gap: 22, fontFamily: SERIF, color: COLORS.text }}>
        <span style={{ fontSize: 120, fontWeight: 700 }}>1</span>
        <span style={{ fontSize: 70, color: COLORS.textSoft }}>→</span>
        <span style={{ fontSize: 120, fontWeight: 700, color: COLORS.accent, opacity: split, transform: `scale(${0.6 + split * 0.4})`, display: "inline-block" }}>12</span>
      </div>
    </Stage>
  );
};

// ── 4. SoilFridge — vertical cutaway descent (carrots) ───────────────────────
export const SoilFridge: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / durationInFrames;
  const worldH = height * 2.2;
  const camY = interpolate(t, [0.05, 0.9], [0, -(worldH - height)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1) });

  const layers = [
    { top: 0, h: height * 0.5, bg: "linear-gradient(180deg,#fbfcff,#e9eef2)", label: "Nieve · −8°", col: COLORS.cold, y: height * 0.28 },
    { top: height * 0.5, h: height * 0.5, bg: "repeating-linear-gradient(178deg,#d9b26a,#d9b26a 10px,#cfa457 10px,#cfa457 20px)", label: "Manta de paja", col: COLORS.amber, y: height * 0.72 },
    { top: height * 1.0, h: worldH - height * 1.0, bg: "linear-gradient(180deg,#6b4d30,#4a3420)", label: "Tierra · +2°", col: "#EFE7D3", y: height * 1.3 },
  ];

  return (
    <Stage tint="rgba(111,132,120,0.16)">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: worldH, transform: `translateY(${camY}px)` }}>
          {layers.map((L, i) => (
            <div key={i} style={{ position: "absolute", top: L.top, left: 0, right: 0, height: L.h, background: L.bg }} />
          ))}
          {/* carrot at bottom */}
          <svg width={width} height={worldH} style={{ position: "absolute", top: 0, left: 0 }}>
            <g transform={`translate(${width * 0.44}, ${worldH - height * 0.5})`}>
              <path d="M 0 0 L 40 0 L 18 220 Z" fill="#E0822E" stroke="#b5661f" strokeWidth={3} />
              <path d="M 20 -6 C 0 -70, -30 -80, -40 -110 M 20 -6 C 20 -80, 20 -100, 20 -130 M 20 -6 C 40 -70, 70 -80, 80 -110" fill="none" stroke={COLORS.good} strokeWidth={6} strokeLinecap="round" />
              <circle cx={20} cy={280} r={interpolate(t, [0.7, 0.9], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} fill="rgba(224,168,46,0.25)" style={{ filter: "blur(30px)" }} />
            </g>
          </svg>
          {/* layer labels — reveal as the camera passes each stratum */}
          {layers.map((L, i) => {
            const r = 0.16 + i * 0.24;
            const op = interpolate(t, [r, r + 0.07], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ position: "absolute", top: L.y, right: width * 0.12, fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: L.col, textShadow: "0 2px 8px rgba(0,0,0,0.35)", opacity: op }}>{L.label}</div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontSize: 44, fontWeight: 700, color: COLORS.text, opacity: interpolate(t, [0.82, 0.95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>La tierra es tu heladera.</div>
    </Stage>
  );
};
