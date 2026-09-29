// CabinCards — piezas 2D propias del video olcabin (todas con texto POR PROPS, nada quemado):
//  RecipeCountdown (placa de lata esmaltada 25→1) · GrandmaCard (ficha manuscrita con cinta) ·
//  OriginMap (mapa de pergamino con rutas Noruega/Suecia/Finlandia/Dinamarca/Bélgica/Cornualles → Minnesota-Wisconsin) ·
//  WhyTheyStopped (tres objetos que se apagan: el hierro, el caldero, la mesa larga).
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, SERIF_ITALIC, HAND, LABEL, hexA, kraftBg, rnd } from "./OleTheme";

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ── RecipeCountdown ─────────────────────────────────────────────────────────────────────────────────────────────
export const RecipeCountdown: React.FC<{
  n: number; name?: string; word?: string; placement?: "corner" | "center"; hero?: boolean; outAt?: number;
}> = ({ n, name, word = "NUMBER", placement = "corner", hero = false, outAt }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const sp = spring({ frame: f, fps, config: { damping: 15, stiffness: 140 } });
  const out = interpolate(f, [(outAt ?? durationInFrames / fps) * fps - 8, (outAt ?? durationInFrames / fps) * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slide = interpolate(f, [0, 10], [-70, 0], { extrapolateRight: "clamp", easing: ease });
  const corner = placement === "corner";
  const S = corner ? (hero ? 1.0 : 0.8) : 1.5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", ...(corner ? { left: 70, top: 64 } : { left: "50%", top: "50%", marginLeft: -190 * S, marginTop: -120 * S }),
        width: 380 * S, transform: `translateY(${slide}px) scale(${0.85 + 0.15 * sp}) rotate(${corner ? -2.2 : 0}deg)`, opacity: out * Math.min(1, f / 5) }}>
        <div style={{ borderRadius: 22 * S, background: `linear-gradient(160deg, #3A73A8, ${OLE.enamel} 55%, #244A70)`, border: `${6 * S}px solid ${OLE.enamelFleck}`, boxShadow: `0 ${18 * S}px ${40 * S}px ${OLE.shadow}, inset 0 0 ${26 * S}px rgba(0,0,0,0.28)`, padding: `${14 * S}px ${20 * S}px`, position: "relative", overflow: "hidden" }}>
          {[[16, 16], [352, 16], [16, 138], [352, 138]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x * S, top: y * S, width: 12 * S, height: 12 * S, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #F4F6F8, #93A3B3)" }} />)}
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i + 1) * 100 + "%", top: rnd(i + 30) * 100 + "%", width: (3 + rnd(i + 5) * 6) * S, height: (3 + rnd(i + 8) * 6) * S, borderRadius: "50%", background: OLE.iron, opacity: 0.55 }} />)}
          <div style={{ fontFamily: LABEL, letterSpacing: 8 * S, fontSize: 26 * S, color: OLE.enamelFleck, textAlign: "center", opacity: 0.9 }}>{word}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 132 * S, lineHeight: 0.95, color: "#fff", textAlign: "center", textShadow: `0 ${4 * S}px 0 rgba(0,0,0,0.3)` }}>{n}</div>
          {name ? <div style={{ fontFamily: SERIF_ITALIC, fontSize: 34 * S, color: OLE.enamelFleck, textAlign: "center", marginTop: 4 * S }}>{name}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── GrandmaCard ─────────────────────────────────────────────────────────────────────────────────────────────────
export const GrandmaCard: React.FC<{
  title: string; lines?: string[]; rot?: number; x?: number; y?: number; w?: number; stain?: boolean; from?: "bottom" | "right"; tape?: boolean;
}> = ({ title, lines = [], rot = -3, x = 50, y = 50, w = 700, stain = true, from = "bottom", tape = true }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 16, stiffness: 120 } });
  const off = (1 - inn) * (from === "bottom" ? 260 : 380);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: w, transform: `translate(-50%, -50%) translate${from === "bottom" ? "Y" : "X"}(${off}px) rotate(${rot}deg)`, opacity: Math.min(1, f / 6) }}>
        <div style={{ background: `linear-gradient(170deg, #FBF5E3, #F1E6C9)`, padding: "34px 44px 40px 96px", borderRadius: 4, boxShadow: `0 26px 50px ${OLE.shadow}, 0 3px 8px rgba(0,0,0,0.25)`, position: "relative",
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 51px, ${hexA("#5E86B0", 0.35)} 51px 53px), linear-gradient(90deg, transparent 78px, ${hexA(OLE.plaid, 0.5)} 78px 81px, transparent 81px)` }}>
          {stain ? <div style={{ position: "absolute", right: 46, bottom: 30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,110,40,0.28), rgba(170,110,40,0) 70%)" }} /> : null}
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#2B3A6B", lineHeight: "52px", marginBottom: 6 }}>{title}</div>
          {lines.map((l, i) => {
            const rev = interpolate(f, [12 + i * 9, 12 + i * 9 + 14], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <div key={i} style={{ fontFamily: HAND, fontSize: 44, color: "#2B3A6B", lineHeight: "52px", clipPath: `inset(0 ${100 - rev}% 0 0)`, whiteSpace: "nowrap" }}>{l}</div>;
          })}
        </div>
        {tape ? <div style={{ position: "absolute", left: "50%", top: -18, width: 150, height: 40, marginLeft: -75, background: "rgba(232,214,160,0.85)", transform: "rotate(-3deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// ── OriginMap ───────────────────────────────────────────────────────────────────────────────────────────────────
type Origin = "norway" | "sweden" | "finland" | "denmark" | "belgium" | "cornwall";
const PIN: Record<Origin, { x: number; y: number; c: string }> = {
  norway: { x: 380, y: 250, c: "#2F5D8A" }, sweden: { x: 470, y: 330, c: "#D9A441" }, finland: { x: 620, y: 240, c: "#5C7FB0" },
  denmark: { x: 438, y: 540, c: "#8E2B2B" }, belgium: { x: 350, y: 640, c: "#1B1A18" }, cornwall: { x: 190, y: 650, c: "#3E6B45" },
};
const DEST = { x: 1180, y: 420 };
export const OriginMap: React.FC<{
  origins?: { id: Origin; label?: string; dishes?: string[]; at?: number }[]; dest?: string; kicker?: string; focus?: Origin;
}> = ({ origins = [{ id: "norway", at: 0.4 }, { id: "sweden", at: 1.0 }, { id: "finland", at: 1.6 }], dest = "Minnesota & Wisconsin", kicker, focus }) => {
  const f = useCurrentFrame(); const { fps, width, height } = useVideoConfig();
  const t = f / fps;
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill style={{ ...kraftBg("#E4D2A8"), opacity: inn }}>
      <svg width={width} height={height} viewBox="0 0 1600 900" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="rough"><feTurbulence baseFrequency="0.02" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="6" /></filter>
        </defs>
        <rect width="1600" height="900" fill="#DCC898" opacity="0.5" />
        {/* mar */}
        <path d="M0 0H1600V900H0Z" fill="#9DB7BE" opacity="0.28" />
        {/* Escandinavia y Finlandia */}
        <g filter="url(#rough)" fill="#E9DDB8" stroke="#8A6B3C" strokeWidth="3">
          <path d="M330 130 L420 95 L520 150 L560 260 L525 380 L470 480 L420 505 L405 420 L340 365 L300 260Z" />
          <path d="M560 140 L640 118 L700 230 L655 345 L590 385 L545 310Z" />
          <path d="M415 520 L455 508 L465 562 L418 570Z" />
          <path d="M330 620 L385 608 L392 668 L336 676Z" />
          <path d="M150 628 L232 618 L246 675 L162 690Z" />
          {/* Medio Oeste */}
          <path d="M1040 300 L1232 300 L1242 470 L1160 535 L1050 522Z" fill="#E4D6AC" />
          <path d="M1242 345 L1372 332 L1402 492 L1302 562 L1242 470Z" fill="#E4D6AC" />
          <path d="M1382 282 L1560 258 L1602 302 L1392 340Z" fill="#E4D6AC" />
          <ellipse cx="1290" cy="300" rx="96" ry="26" fill="#9DB7BE" stroke="#6A8A94" />
        </g>
        {/* rutas */}
        {origins.map((o, i) => {
          const p = PIN[o.id]; const at = (o.at ?? i * 0.6) * fps;
          const mx = (p.x + DEST.x) / 2, my = Math.min(p.y, DEST.y) - 190 - i * 18;
          const d = `M${p.x} ${p.y} Q${mx} ${my} ${DEST.x} ${DEST.y}`;
          const prog = interpolate(f, [at, at + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
          const dim = focus && focus !== o.id ? 0.25 : 1;
          return (
            <g key={o.id} opacity={dim}>
              <path d={d} fill="none" stroke={p.c} strokeWidth={6} strokeDasharray="14 10" pathLength={1} style={{ strokeDasharray: `${prog} 1`, strokeDashoffset: 0 }} strokeLinecap="round" opacity={0.9} />
              <g transform={`translate(${p.x} ${p.y})`}>
                <circle r={interpolate(f, [at - 6, at + 6], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} fill={p.c} stroke="#fff" strokeWidth="4" />
                {o.label ? <text y={-30} x={-10} textAnchor="end" fontFamily={LABEL} fontSize="28" letterSpacing="4" fill={OLE.iron} opacity={interpolate(f, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>{o.label}</text> : null}
                {(o.dishes ?? []).map((dish, k) => (
                  <text key={k} x={30} y={8 + k * 32} textAnchor="start" fontFamily={SERIF_ITALIC} fontSize="28" fill={OLE.pencil}
                    opacity={interpolate(f, [at + 14 + k * 5, at + 24 + k * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>{dish}</text>
                ))}
              </g>
            </g>
          );
        })}
        <g transform={`translate(${DEST.x} ${DEST.y})`}>
          <circle r={26 + Math.sin(t * 5) * 3} fill={OLE.fire} stroke="#fff" strokeWidth="5" />
          <text y={-46} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize="40" fill={OLE.forest}>{dest}</text>
        </g>
      </svg>
      {kicker ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: SERIF_ITALIC, fontSize: 46, color: OLE.forest }}>{kicker}</div> : null}
    </AbsoluteFill>
  );
};

// ── WhyTheyStopped ──────────────────────────────────────────────────────────────────────────────────────────────
const Iron: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%"><circle cx="100" cy="100" r="70" fill="#2A2825" stroke="#0F0E0D" strokeWidth="6" />
    {Array.from({ length: 12 }).map((_, i) => <line key={i} x1="100" y1="100" x2={100 + 62 * Math.cos(i * 0.5236)} y2={100 + 62 * Math.sin(i * 0.5236)} stroke="#4A4641" strokeWidth="3" />)}
    <circle cx="100" cy="100" r="34" fill="none" stroke="#4A4641" strokeWidth="3" /><rect x="168" y="94" width="30" height="12" fill="#1B1A18" /></svg>
);
const Kettle: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%"><path d="M30 80 H170 V150 Q170 176 100 176 Q30 176 30 150Z" fill="#2A2825" stroke="#0F0E0D" strokeWidth="6" />
    <ellipse cx="100" cy="80" rx="70" ry="14" fill="#3A3733" /><path d="M20 90 Q100 10 180 90" fill="none" stroke="#1B1A18" strokeWidth="6" /></svg>
);
const LongTable: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%"><rect x="10" y="90" width="180" height="14" fill="#8A6539" />{[26, 100, 174].map(x => <rect key={x} x={x - 4} y="104" width="8" height="60" fill="#6B4A2C" />)}
    {[40, 75, 110, 145].map(x => <circle key={x} cx={x} cy="72" r="14" fill="#B58D5E" />)}<rect x="10" y="150" width="180" height="8" fill="#7A5A38" /></svg>
);
export const WhyTheyStopped: React.FC<{ items?: { kind: "iron" | "kettle" | "table"; caption: string; offAt: number }[]; title?: string }> = ({
  items = [{ kind: "iron", caption: "", offAt: 1.5 }, { kind: "kettle", caption: "", offAt: 3 }, { kind: "table", caption: "", offAt: 4.5 }], title,
}) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps;
  return (
    <AbsoluteFill style={{ ...kraftBg("#D9C79B") }}>
      {title ? <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center", fontFamily: SERIF_ITALIC, fontSize: 60, color: OLE.forest }}>{title}</div> : null}
      <div style={{ position: "absolute", left: 120, right: 120, top: 250, display: "flex", gap: 70, justifyContent: "center" }}>
        {items.map((it, i) => {
          const inn = interpolate(f, [4 + i * 6, 18 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          const off = interpolate(t, [it.offAt, it.offAt + 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
          return (
            <div key={i} style={{ width: 470, textAlign: "center", opacity: inn, transform: `translateY(${(1 - inn) * 60}px)` }}>
              <div style={{ background: "#F3EAD0", borderRadius: 14, padding: 34, boxShadow: `0 24px 46px ${OLE.shadow}`, filter: `grayscale(${off}) brightness(${1 - off * 0.32})`, position: "relative" }}>
                {it.kind === "iron" ? <Iron /> : it.kind === "kettle" ? <Kettle /> : <LongTable />}
                <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: `radial-gradient(circle, rgba(120,110,95,${off * 0.45}), rgba(90,80,70,${off * 0.6}))`, mixBlendMode: "multiply" }} />
              </div>
              <div style={{ marginTop: 26, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: OLE.pencil, opacity: 0.55 + 0.45 * (1 - off) }}>{it.caption}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
