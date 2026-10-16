// Kit del video cljuntas: set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClGroutPores  la junta en corte: arena y cemento con agujeritos; phase "dirt" = la mugre entra y la junta se pone gris ·
//                 "foam" = la pasta hace espuma adentro y empuja la mugre para afuera (la junta vuelve a blanca).
//   ClMopFilm     el 2º secreto: dos pisos. Agua con jabón → película en la junta → la tierra se pega ✗ · agua sola → limpia ✓. hi 0/1.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd } from "./ClTheme";
import { Bed, RoomLight, Stamp, lin, pop, useOut } from "./ClParts";

const tick = (ok: boolean, s = 70): React.ReactNode => (
  <svg width={s} height={s} viewBox="0 0 70 70">{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
);
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

// ── la junta en corte
export const ClGroutPores: React.FC<{ phase?: "dirt" | "foam"; bed?: string }> = ({ phase = "foam", bed }) => {
  const f = useCurrentFrame(); const { fps, width, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const t = interpolate(f, [12, T - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dirt = phase === "dirt" ? t : 1 - t; // 1 = gris
  const GX = 700, GY = 300, GW = 520, GH = 560;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={221} dim={0.22} />
      <div style={{ position: "absolute", inset: 0, opacity: out * p, translate: `0 ${(1 - p) * 80}px` }}>
        <svg width={width} height={1080} viewBox={`0 0 ${width} 1080`} style={{ position: "absolute", left: 0, top: 0 }}>
          {/* los dos azulejos */}
          <rect x={GX - 520} y={GY - 40} width={520} height={GH + 80} rx={10} fill="#F4F1EA" stroke="#C9C2B4" strokeWidth={6} />
          <rect x={GX + GW} y={GY - 40} width={520} height={GH + 80} rx={10} fill="#F4F1EA" stroke="#C9C2B4" strokeWidth={6} />
          {/* la junta: cemento con agujeritos */}
          <rect x={GX} y={GY} width={GW} height={GH} fill={mix([238, 236, 230], [128, 124, 116], dirt)} />
          {Array.from({ length: 70 }, (_, i) => {
            const cx = GX + 20 + rnd(i + 3) * (GW - 40), cy = GY + 20 + rnd(i + 40) * (GH - 40), r = 8 + 14 * rnd(i + 90);
            const filled = phase === "dirt" ? rnd(i + 7) < t : rnd(i + 7) > t;
            return <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="#FBFAF6" stroke="#CFCAC0" strokeWidth={2} />
              {filled ? <circle cx={cx} cy={cy} r={r * 0.82} fill={rnd(i + 5) > 0.7 ? "#3D3A35" : "#6E5B43"} /> : null}
            </g>;
          })}
          {/* la espuma que sube y saca la mugre */}
          {phase === "foam" ? Array.from({ length: 40 }, (_, i) => { const k = Math.min(1, Math.max(0, t * 1.3 - rnd(i) * 0.3)); return <circle key={`f${i}`} cx={GX + 30 + rnd(i + 200) * (GW - 60)} cy={GY + GH - k * (GH + 60) + 20} r={10 + 10 * rnd(i + 210)} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.9 * (k > 0 && k < 1 ? 1 : 0)} />; }) : null}
          {phase === "dirt" ? Array.from({ length: 18 }, (_, i) => { const k = Math.min(1, Math.max(0, t * 1.4 - rnd(i) * 0.4)); return <circle key={`d${i}`} cx={GX + 40 + rnd(i + 300) * (GW - 80)} cy={GY - 120 + k * 260} r={7 + 6 * rnd(i)} fill="#5A4A36" opacity={k < 1 ? 0.9 : 0} />; }) : null}
        </svg>
        <div style={{ position: "absolute", left: GX - 470, top: 150, fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: CL.navy }}>LA JUNTA, DE CERCA</div>
        <div style={{ position: "absolute", left: GX + GW + 60, top: 420, width: 420, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.ink }}>{phase === "dirt" ? "arena y cemento: la mugre entra" : "la espuma la empuja afuera"}</div>
      </div>
      <Stamp text={phase === "dirt" ? "Sucia, no gastada" : "Blanca por dentro"} at={Math.max(30, T - 40)} color={phase === "dirt" ? CL.red : CL.navy} x="74%" y="86%" rot={-4} size={60} />
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── 2º secreto: el trapeado
export const ClMopFilm: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const t = lin(f, 16, 80);
  const card = (i: number) => {
    const on = hi < 0 || hi === i, k = pop(f, fps, 4 + i * 10, 15), soap = i === 0;
    return (
      <div key={i} style={{ position: "absolute", left: 190 + i * 800, top: 120, width: 740, height: 820, borderRadius: 34, background: "#FFFDF6", boxShadow: hi === i ? `0 0 0 10px ${soap ? CL.red : "#2F8F48"}, 24px 30px 60px ${CL.shadow}` : `14px 18px 34px ${CL.shadow}`, opacity: out * k * (on ? 1 : 0.42), translate: `0 ${(1 - k) * 80}px`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 36 }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: CL.navy }}>{soap ? "AGUA CON JABÓN" : "AGUA SOLA"}</div>
        <svg width={560} height={420} viewBox="0 0 560 420" style={{ marginTop: 24 }}>
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={6 + c * 138} y={6 + r * 138} width={128} height={128} rx={6} fill="#F1EDE4" stroke="#D8D1C3" strokeWidth={3} />))}
          {/* las juntas */}
          {[1, 2, 3].map((c) => <rect key={`v${c}`} x={c * 138 - 6} y={0} width={10} height={420} fill={soap ? mix([236, 234, 228], [110, 104, 94], t) : "#ECEAE4"} />)}
          {[1, 2].map((r) => <rect key={`h${r}`} x={0} y={r * 138 - 6} width={560} height={10} fill={soap ? mix([236, 234, 228], [110, 104, 94], t) : "#ECEAE4"} />)}
          {/* la película de jabón que brilla */}
          {soap ? <rect x={0} y={0} width={560} height={420} fill={`rgba(220,230,255,${0.25 * t})`} /> : null}
          {soap ? Array.from({ length: 30 }, (_, j) => <circle key={j} cx={[138, 276, 414][j % 3] - 1 + (rnd(j) - 0.5) * 6} cy={rnd(j + 20) * 420} r={4 + 4 * rnd(j + 5)} fill="#5A4A36" opacity={t} />) : null}
        </svg>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16 }}>
          {tick(!soap, 60)}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink }}>{soap ? "Gris otra vez" : "Sigue blanca"}</div>
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.ink, marginTop: 6 }}>{soap ? "la película pega la tierra" : "sin película, sin tierra"}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={223} dim={0.22} />
      {card(0)}
      {card(1)}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
