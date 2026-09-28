// Tarjetas de pantalla completa del canal, todas con foto de cama detrás (nunca fondo vacío):
//   LorTrick (el truco: sello + frase manuscrita) · LorTwoCards (dos tarjetas enfrentadas ✓/✗) ·
//   LorMeasure (tazas y cucharas que se llenan con la medida exacta) · LorPieCut (el pie que se corta en 8, 10 si Dottie)
//   LorPieLayers (corte lateral: wet bottom vs dry bottom) · LorYear (el año que cae como sello sobre la foto)
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, hexA, gingham } from "./LorTheme";
import { Bed } from "./LorRecipeCard";
import { PieTop } from "./LorPotluckTable";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const LorTrick: React.FC<{ title: string; text: string; bed?: string; stamp?: string }> = ({ title, text, bed, stamp }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - 4, fps, config: { damping: 11, stiffness: 180, mass: 0.8 } });
  const w = interpolate(f, [16, 16 + Math.max(24, text.length * 1.4)], [0, 100], cl);
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.2} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1300, padding: "60px 80px", background: LOR.white, borderRadius: 16, boxShadow: `0 30px 70px ${LOR.shadow}`, rotate: "-1.5deg", translate: `0 ${(1 - interpolate(f, [0, 14], [0, 1], { ...cl, easing: ease })) * 80}px` }}>
          <div style={{ position: "absolute", left: -40, top: -48, rotate: "-10deg", scale: String(2.2 - 1.2 * s), opacity: Math.min(1, s * 1.5), fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: LOR.gingham, border: `6px solid ${LOR.gingham}`, borderRadius: 14, padding: "4px 26px", background: "rgba(255,253,247,0.95)", letterSpacing: 2 }}>{(stamp || title).toUpperCase()}</div>
          {stamp ? <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 44, color: LOR.inkSoft, marginTop: 30 }}>{title}</div> : null}
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 96, color: "#1F2F5C", lineHeight: "104px", marginTop: 34, clipPath: `inset(0 ${100 - w}% 0 0)` }}>{text}</div>
          <div style={{ height: 8, width: `${w}%`, background: hexA(LOR.butter, 0.8), marginTop: 6, borderRadius: 4 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Side = { title: string; lines: string[]; mark?: string };
export const LorTwoCards: React.FC<{ a: Side; b: Side; bed?: string }> = ({ a, b, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const card = (sd: Side, i: number) => {
    const s = spring({ frame: f - 4 - i * 10, fps, config: { damping: 14, stiffness: 120 } });
    const col = sd.mark === "✗" ? LOR.gingham : sd.mark === "✓" ? LOR.greenDeep : LOR.inkSoft;
    return (
      <div key={i} style={{ position: "relative", width: 700, minHeight: 470, padding: "54px 56px", background: i ? LOR.white : LOR.paper, borderRadius: 16, boxShadow: `0 26px 60px ${LOR.shadow}`, rotate: `${i ? 2.5 : -2.5}deg`, translate: `${(1 - s) * (i ? 500 : -500)}px 0`, opacity: Math.min(1, s * 1.6) }}>
        {sd.mark ? <div style={{ position: "absolute", right: 36, top: 22, fontSize: 110, fontFamily: SERIF, fontWeight: 900, color: col, scale: String(interpolate(f, [22 + i * 10, 32 + i * 10], [2, 1], cl)), opacity: interpolate(f, [22 + i * 10, 28 + i * 10], [0, 1], cl) }}>{sd.mark}</div> : null}
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LOR.ink, lineHeight: 1.05, marginRight: 90 }}>{sd.title}</div>
        <div style={{ height: 5, width: 120, background: col, margin: "18px 0 22px", borderRadius: 3 }} />
        {sd.lines.map((l, k) => <div key={k} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#1F2F5C", lineHeight: "64px" }}>{l}</div>)}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.25} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70 }}>{card(a, 0)}{card(b, 1)}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// taza medidora de vidrio que se llena (SVG) + etiqueta manuscrita
const Cup: React.FC<{ fill: number; color: string; kind: "cup" | "spoon" }> = ({ fill, color, kind }) => kind === "spoon" ? (
  <svg width={260} height={200} viewBox="0 0 260 200">
    <rect x={130} y={92} width={120} height={16} rx={8} fill="#C9C3B6" />
    <ellipse cx={80} cy={100} rx={72} ry={52} fill="#E6E2DA" stroke="#9E9A92" strokeWidth={4} />
    <clipPath id="sp"><ellipse cx={80} cy={100} rx={64} ry={44} /></clipPath>
    <rect clipPath="url(#sp)" x={0} y={144 - 88 * fill} width={160} height={200} fill={color} />
    <ellipse cx={60} cy={82} rx={20} ry={9} fill="rgba(255,255,255,0.6)" />
  </svg>
) : (
  <svg width={240} height={260} viewBox="0 0 240 260">
    <path d="M40 30 L200 30 L184 240 L56 240 Z" fill="rgba(220,235,240,0.55)" stroke="#8FA7AE" strokeWidth={5} />
    <clipPath id="cp"><path d="M44 34 L196 34 L181 236 L59 236 Z" /></clipPath>
    <rect clipPath="url(#cp)" x={0} y={236 - 202 * fill} width={240} height={260} fill={color} />
    {[0.25, 0.5, 0.75].map((m) => <line key={m} x1={150} x2={182} y1={236 - 202 * m} y2={236 - 202 * m} stroke={LOR.gingham} strokeWidth={3} />)}
    <path d="M200 70 Q236 90 204 150" fill="none" stroke="#8FA7AE" strokeWidth={10} />
  </svg>
);

export const LorMeasure: React.FC<{ title?: string; items: { amt: string; what: string }[] }> = ({ title, items }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const colors = ["#E3CFA3", "#CFC7B8", "#EFD27E", "#B98A55", "#E6C27A"];
  const per = Math.min(1.1 * fps, 60);
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 60, 0.2) }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(246,238,220,0.95) 0%, rgba(246,238,220,0.8) 70%, rgba(246,238,220,0.5) 100%)" }} />
      {title ? <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LOR.ink }}>{title}</div> : null}
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 90, paddingBottom: 170 }}>
        {items.map((it, i) => {
          const t0 = 8 + i * per; const s = spring({ frame: f - t0, fps, config: { damping: 13, stiffness: 150 } });
          const fill = interpolate(f, [t0 + 8, t0 + per * 0.9], [0, /cup/.test(it.amt) ? 0.82 : 0.95], { ...cl, easing: Easing.out(Easing.quad) });
          const kind = /tsp|Tbsp|pinch/i.test(it.amt) ? "spoon" : "cup";
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.5), translate: `0 ${(1 - s) * 120}px` }}>
              <div style={{ scale: "1.35", marginBottom: 40 }}><Cup fill={fill} color={colors[i % colors.length]} kind={kind as "cup" | "spoon"} /></div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: LOR.gingham, marginTop: 20 }}>{it.amt}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: LOR.ink, maxWidth: 420, textAlign: "center", lineHeight: "54px" }}>{it.what}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LorPieCut: React.FC<{ cuts?: number; extra?: number; label?: string; note?: string }> = ({ cuts = 8, extra, label, note }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const n1 = interpolate(f, [10, 10 + 1.6 * fps], [0, cuts], cl);
  const tExtra = Math.max(10 + 2.2 * fps, durationInFrames * 0.55);
  const n2 = extra ? interpolate(f, [tExtra, tExtra + 0.9 * fps], [0, extra], cl) : 0;
  const line = (k: number, n: number, col: string, w: number) => { const a = (k / n) * Math.PI * 2 - Math.PI / 2; return <line key={col + k} x1={300} y1={300} x2={300 + Math.cos(a) * 250} y2={300 + Math.sin(a) * 250} stroke={col} strokeWidth={w} strokeLinecap="round" />; };
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 64, 0.3) }}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 100 }}>
        <div style={{ position: "relative", width: 600, height: 600 }}>
          <div style={{ position: "absolute", inset: 0 }}><PieTop type="chess" size={600} seed={4} /></div>
          <svg width={600} height={600} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: Math.floor(n1) }).map((_, k) => line(k, cuts, "rgba(90,50,20,0.85)", 7))}
            {n2 > 0 ? Array.from({ length: Math.floor(n2) }).map((_, k) => line(k + 0.5, extra!, LOR.gingham, 5)) : null}
          </svg>
        </div>
        <div style={{ background: "rgba(255,253,247,0.95)", padding: "40px 50px", borderRadius: 16, boxShadow: `0 20px 50px ${LOR.shadow}` }}>
          {label ? <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: LOR.inkSoft }}>{label}</div> : null}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 190, color: LOR.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n2 > cuts ? Math.round(n2) : Math.round(n1)}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 60, color: LOR.ink }}>pieces</div>
          {note ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: LOR.gingham, marginTop: 10, opacity: interpolate(f, [tExtra, tExtra + 10], [0, 1], cl) }}>{note}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LorPieLayers: React.FC<{ a: { label: string; sub?: string }; b: { label: string; sub?: string } }> = ({ a, b }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const slice = (wet: boolean, i: number) => {
    const s = spring({ frame: f - 6 - i * 12, fps, config: { damping: 14, stiffness: 110 } });
    const goo = interpolate(f, [20 + i * 12, 50 + i * 12], [0, 1], cl);
    return (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", translate: `0 ${(1 - s) * 200}px`, opacity: Math.min(1, s * 1.5) }}>
        <svg width={640} height={360} viewBox="0 0 640 360">
          <path d="M40 300 L600 300 L600 320 Q320 345 40 320 Z" fill="#C98A45" />
          {wet ? (
            <>
              <rect x={40} y={210} width={560} height={90 * goo} fill="#3E1F0C" transform={`translate(0 ${90 - 90 * goo})`} />
              <path d={`M40 ${210} Q180 ${196} 320 ${214} T600 ${206} L600 ${300 - 90 * goo} L40 ${300 - 90 * goo} Z`} fill="#8A5427" opacity={0.95} />
            </>
          ) : <rect x={40} y={170} width={560} height={130} fill="#9A6433" />}
          <path d="M40 180 Q120 120 200 150 T360 140 T520 150 T600 160 L600 215 L40 215 Z" fill="#C58F55" />
          {Array.from({ length: 34 }).map((_, k) => <circle key={k} cx={50 + (k * 97) % 550} cy={140 + ((k * 37) % 40)} r={8 + (k % 4) * 3} fill={k % 3 ? "#B77A3F" : "#D9A96A"} />)}
          <path d="M20 170 Q10 250 40 320 L60 320 Q40 250 50 180 Z" fill="#D99A4E" /><path d="M620 170 Q630 250 600 320 L580 320 Q600 250 590 180 Z" fill="#D99A4E" />
        </svg>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: LOR.ink }}>{(wet ? a : b).label}</div>
        {(wet ? a : b).sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: LOR.gingham }}>{(wet ? a : b).sub}</div> : null}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ ...gingham(LOR.green, 64, 0.18) }}>
      <AbsoluteFill style={{ background: "rgba(246,238,220,0.78)" }} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 60 }}>{slice(true, 0)}{slice(false, 1)}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LorYear: React.FC<{ year: string; text?: string; bed?: string }> = ({ year, text, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - 6, fps, config: { damping: 10, stiffness: 200, mass: 0.9 } });
  const shake = f > 6 && f < 14 ? Math.sin(f * 3) * (14 - f) * 1.2 : 0;
  const w = interpolate(f, [18, 44], [0, 100], cl);
  return (
    <AbsoluteFill style={{ translate: `${shake}px ${shake * 0.6}px` }}>
      <Bed src={bed} dim={0.12} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 300, color: LOR.white, lineHeight: 1, scale: String(2.4 - 1.4 * s), opacity: Math.min(1, s * 2), textShadow: "0 10px 40px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.4)", letterSpacing: -4 }}>{year}</div>
        {text ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: LOR.white, textShadow: "0 4px 18px rgba(0,0,0,0.7)", clipPath: `inset(0 ${100 - w}% 0 0)`, marginTop: 10 }}>{text}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
