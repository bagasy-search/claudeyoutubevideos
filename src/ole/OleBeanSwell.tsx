// OleBeanSwell — corte ilustrado de UN poroto pinto (piel moteada + interior) que se HINCHA absorbiendo agua
// (flechas de agua entrando, crece ~2x, la piel se tensa). Dos lados: "counter overnight (cold) · 8 hrs" (bowl)
// vs "hot pot · about 1 hr" (olla de hierro al fuego); cada reloj corre a su ritmo. El agua del bowl se pone
// GRIS/turbia (partículas de color que salen del poroto) y se va "down the drain". Mito vs realidad.
// Tiempos en SEGUNDOS relativos al inicio: beats = [empieza, hot listo, cold listo, drenaje].
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, HAND, woodBg, hexA, rnd } from "./OleTheme";

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
      <AbsoluteFill style={{ backgroundColor: hexA(OLE.cream, 0.2) }} />
    </AbsoluteFill>
  );
};

export type SwellSide = {
  tag?: string;        // "MYTH" / "REALITY"
  title?: string;      // "Counter overnight"
  sub?: string;        // "cold water"
  time?: string;       // "8 hrs"
  hours?: number;      // horas que corre el reloj
  drain?: boolean;     // el agua se va por la pileta
  drainText?: string;  // "color & flavor down the drain"
  doneText?: string;   // "same swell"
};

const PW = 870, PH = 940;
const BEAN = "M-84,-4 C-84,-44 -40,-56 4,-52 C52,-48 86,-28 86,6 C86,40 52,56 18,54 C4,53 0,41 -14,41 C-32,41 -38,54 -58,49 C-78,44 -84,22 -84,-4 Z";

const Bean: React.FC<{ p: number; seed: number; id: string }> = ({ p, seed, id }) => {
  const s = 1.35 + 0.9 * p;
  const blot = Array.from({ length: 70 }).map((_, i) => {
    const x = -84 + rnd(seed + i) * 92, y = -54 + rnd(seed + i + 50) * 108;
    const rx = 2 + rnd(seed + i + 90) * 6, ry = 1.2 + rnd(seed + i + 130) * 3;
    return <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${rnd(seed + i + 170) * 180} ${x} ${y})`} fill={["#7E3F24", "#9A5634", "#6B3A2A"][i % 3]} opacity={0.62 + 0.3 * rnd(seed + i + 210)} />;
  });
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <clipPath id={`${id}-clip`}><path d={BEAN} /></clipPath>
        <clipPath id={`${id}-half`}><rect x={3} y={-80} width={100} height={160} /></clipPath>
        <radialGradient id={`${id}-gl`} cx="0.35" cy="0.25" r="0.5"><stop offset="0" stopColor="#fff" stopOpacity={0.9} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></radialGradient>
      </defs>
      <path d={BEAN} fill="rgba(0,0,0,0.18)" transform="translate(4,8)" />
      <g clipPath={`url(#${id}-clip)`}>
        {/* piel moteada (mitad izquierda) */}
        <rect x={-100} y={-70} width={104} height={140} fill="#E4CBAA" />
        {Array.from({ length: 7 }).map((_, i) => <path key={`st${i}`} d={`M${-80 + i * 12},${-50 + rnd(seed + i) * 20} q${6 + rnd(seed + i + 3) * 8},40 ${-4 + rnd(seed + i + 5) * 10},${80 + rnd(seed + i + 6) * 20}`} stroke="#A8683F" strokeWidth={3 + rnd(seed + i + 8) * 3} fill="none" opacity={0.35} strokeLinecap="round" />)}
        {blot}
        {/* arrugas del poroto seco */}
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-70 + i * 16},${-30 + i * 6} q10,${14 + i * 3} ${4 + i * 2},${34 + i * 4}`} stroke="#6E4630" strokeWidth={2.2} fill="none" opacity={0.55 * (1 - p)} />)}
        {/* interior (corte, mitad derecha) */}
        <rect x={2} y={-70} width={100} height={140} fill="#F4E7C9" />
        {/* el agua que entra: franja azul desde la piel hacia adentro */}
        <g clipPath={`url(#${id}-half)`}><path d={BEAN} fill="none" stroke={OLE.enamel} strokeWidth={8 + 46 * p} opacity={0.2 + 0.12 * p} /></g>
        {/* línea de los cotiledones */}
        <path d="M6,-40 C30,-30 56,-10 70,8" stroke="#D8C39A" strokeWidth={3} fill="none" strokeDasharray="6 5" />
        <ellipse cx={12} cy={34} rx={8} ry={5} fill="#E6D2A8" />
        {/* borde del corte */}
        <line x1={3} y1={-70} x2={3} y2={70} stroke="#FFF7E4" strokeWidth={3} />
        {/* brillo: la piel se tensa */}
        <ellipse cx={-40} cy={-30} rx={34} ry={14} fill={`url(#${id}-gl)`} opacity={0.2 + 0.6 * p} transform="rotate(-18 -40 -30)" />
      </g>
      <path d={BEAN} fill="none" stroke="#6E4630" strokeWidth={4 - 1.2 * p} />
    </g>
  );
};

const Clock: React.FC<{ cx: number; cy: number; r: number; hours: number; p: number; done: boolean; color: string }> = ({ cx, cy, r, hours, p, done, color }) => {
  const h = hours * p;
  const mA = h * 360, hA = h * 30;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r + 6} fill={done ? color : OLE.iron} />
      <circle r={r} fill={OLE.cream} />
      {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.sin(a) * (r - 6)} y1={-Math.cos(a) * (r - 6)} x2={Math.sin(a) * (r - (i % 3 ? 12 : 17))} y2={-Math.cos(a) * (r - (i % 3 ? 12 : 17))} stroke={OLE.iron} strokeWidth={i % 3 ? 2 : 4} />; })}
      {/* sector recorrido */}
      {p > 0.001 ? (() => { const e = Math.min(p, 0.9999) * Math.PI * 2; return <path d={`M0,0 L0,${-r + 4} A${r - 4},${r - 4} 0 ${e > Math.PI ? 1 : 0} 1 ${Math.sin(e) * (r - 4)},${-Math.cos(e) * (r - 4)} Z`} fill={hexA(color, 0.2)} />; })() : null}
      <line x1={0} y1={0} x2={Math.sin((hA * Math.PI) / 180) * r * 0.5} y2={-Math.cos((hA * Math.PI) / 180) * r * 0.5} stroke={OLE.iron} strokeWidth={6} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.sin((mA * Math.PI) / 180) * r * 0.78} y2={-Math.cos((mA * Math.PI) / 180) * r * 0.78} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <circle r={5} fill={OLE.iron} />
    </g>
  );
};

const Panel: React.FC<{ side: SwellSide; kind: "cold" | "hot"; prog: number; drainP: number; t: number; inP: number; swellLabel: string; seed: number }> = ({ side, kind, prog, drainP, t, inP, swellLabel, seed }) => {
  const cold = kind === "cold";
  const accent = cold ? OLE.plaid : OLE.forest;
  const id = `obs-${kind}-${seed}`;
  const hours = side.hours ?? (cold ? 8 : 1);
  const done = prog >= 1;
  const CX = PW / 2 - 10, BY = 540;
  const level = 392 + drainP * 330;
  // agua: clara → gris/turbia en el bowl frío; ámbar suave en la olla
  const murk = cold ? interpolate(prog, [0.15, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0.15 * prog;
  const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const wc = cold ? mix([150, 190, 214], [128, 116, 104], murk) : mix([168, 204, 222], [196, 178, 140], murk);
  const water = `rgba(${wc[0]},${wc[1]},${wc[2]},${cold ? 0.55 + 0.25 * murk : 0.92})`;
  const s = 1.35 + 0.9 * prog;
  const hh = Math.floor(hours * prog), mm = Math.floor((hours * prog - hh) * 60);
  const inner = cold
    ? "M134,372 L736,372 C726,552 600,700 435,700 C270,700 144,552 134,372 Z"
    : "M170,342 L700,342 L700,630 C700,685 662,700 612,700 L258,700 C208,700 170,685 170,630 Z";
  return (
    <div style={{ position: "relative", width: PW, height: PH, background: `radial-gradient(ellipse at 30% 15%, #FFFBF1, ${OLE.paper} 55%, #EFE4CB)`, borderRadius: 12, boxShadow: `0 24px 50px ${OLE.shadow}, 0 3px 8px rgba(0,0,0,0.18)`, overflow: "hidden", opacity: inP, translate: `0 ${(1 - inP) * 80}px` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 12, background: accent }} />
      <div style={{ position: "absolute", left: 50, top: 44, fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 7, color: OLE.paper, background: accent, padding: "2px 16px", borderRadius: 6 }}>{side.tag ?? (cold ? "MYTH" : "REALITY")}</div>
      <div style={{ position: "absolute", left: 50, top: 100, fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: OLE.iron, lineHeight: 1, letterSpacing: -1 }}>{side.title ?? (cold ? "Counter overnight" : "Hot pot")}</div>
      <div style={{ position: "absolute", left: 52, top: 178, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: OLE.mute }}>{side.sub ?? (cold ? "cold water, all night" : "on the fire, lid on")}</div>
      <svg width={PW} height={PH} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <clipPath id={`${id}-in`}><path d={inner} /></clipPath>
        </defs>
        {/* recipiente */}
        {cold ? (
          <>
            <path d="M110,360 L760,360 C750,566 614,722 435,722 C256,722 120,566 110,360 Z" fill={OLE.enamel} />
            {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={150 + rnd(seed + i) * 570} cy={380 + rnd(seed + i + 20) * 300} r={2 + rnd(seed + i + 40) * 3} fill={OLE.enamelFleck} opacity={0.6} />)}
            <path d={inner} fill="#F4F6F7" />
          </>
        ) : (
          <>
            {/* fuego */}
            {Array.from({ length: 7 }).map((_, i) => {
              const x = 230 + i * 68, fl = 1 + 0.18 * Math.sin(t * 9 + i * 1.7) + 0.1 * Math.sin(t * 13 + i);
              return <g key={i} transform={`translate(${x},792) scale(${0.9 + 0.2 * rnd(seed + i)},${fl})`}>
                <path d="M0,0 C-26,-10 -22,-44 0,-78 C22,-44 26,-10 0,0 Z" fill={OLE.fire} />
                <path d="M0,0 C-12,-6 -10,-28 0,-46 C10,-28 12,-6 0,0 Z" fill={OLE.ember} />
              </g>;
            })}
            <rect x={200} y={790} width={470} height={16} rx={8} fill={OLE.ironL} />
            <path d="M150,330 L720,330 L720,640 C720,700 680,722 620,722 L250,722 C190,722 150,700 150,640 Z" fill={OLE.iron} />
            <rect x={112} y={360} width={46} height={26} rx={8} fill={OLE.iron} />
            <rect x={712} y={360} width={46} height={26} rx={8} fill={OLE.iron} />
            <path d={inner} fill="#5A544C" />
          </>
        )}
        {/* agua + partículas + poroto dentro del recipiente */}
        <g clipPath={`url(#${id}-in)`}>
          <rect x={0} y={level} width={PW} height={PH} fill={water} />
          <path d={`M0,${level} Q${PW / 4},${level - 6 + Math.sin(t * 2) * 3} ${PW / 2},${level} T${PW},${level}`} stroke="rgba(255,255,255,0.55)" strokeWidth={4} fill="none" />
          {/* partículas de color que salen del poroto */}
          {prog > 0.08 ? Array.from({ length: cold ? 46 : 12 }).map((_, i) => {
            const a = rnd(seed + i * 3) * Math.PI * 2;
            const ph = ((prog * (cold ? 2.4 : 1.5) + rnd(seed + i * 7)) % 1);
            const d0 = 75 * s, dist = d0 + ph * 150;
            const x = CX + Math.cos(a) * dist * 1.25, y = BY + Math.sin(a) * dist * 0.7 + Math.sin(t * 1.5 + i) * 4;
            const col = ["#7B3F2E", "#9C5B45", "#6B4A5A"][i % 3];
            return <circle key={i} cx={x} cy={y} r={2.5 + rnd(seed + i * 11) * 4} fill={col} opacity={(1 - ph) * Math.min(1, (prog - 0.08) * 5) * (cold ? 0.8 : 0.4)} />;
          }) : null}
          {/* burbujas en la olla */}
          {!cold ? Array.from({ length: 16 }).map((_, i) => {
            const per = 1 + rnd(seed + i) * 0.8, ph = ((t + rnd(seed + i * 5) * per) % per) / per;
            return <circle key={i} cx={190 + rnd(seed + i * 9) * 490} cy={690 - ph * 290} r={3 + rnd(seed + i * 13) * 6} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2.5} opacity={1 - ph} />;
          }) : null}
          <g transform={`translate(${CX},${BY + drainP * 14}) rotate(${-6 + 4 * Math.sin(t * 0.8)})`}><Bean p={prog} seed={seed + 7} id={id} /></g>
        </g>
        {cold ? <rect x={100} y={350} width={670} height={18} rx={9} fill={OLE.enamelFleck} stroke={OLE.enamel} strokeWidth={4} /> : null}
        {/* flechas de agua entrando */}
        {prog > 0 && prog < 1 && drainP === 0 ? Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + 0.3;
          const ro = 110 * s, ri = 90 * s;
          const k = ((t * 0.9 + i * 0.17) % 1);
          const r0 = ro - k * (ro - ri) * 0.5;
          const x0 = CX + Math.cos(a) * r0 * 1.2, y0 = BY + Math.sin(a) * r0 * 0.62;
          const x1 = CX + Math.cos(a) * (r0 - 60) * 1.2, y1 = BY + Math.sin(a) * (r0 - 60) * 0.62;
          const ang = Math.atan2(y1 - y0, x1 - x0);
          const op = Math.sin(k * Math.PI) * Math.min(1, prog * 8) * Math.min(1, (1 - prog) * 8);
          return <g key={i} opacity={op}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={OLE.enamel} strokeWidth={6} strokeLinecap="round" />
            <path d={`M${x1 + Math.cos(ang) * 8},${y1 + Math.sin(ang) * 8} L${x1 + Math.cos(ang + 2.5) * 18},${y1 + Math.sin(ang + 2.5) * 18} L${x1 + Math.cos(ang - 2.5) * 18},${y1 + Math.sin(ang - 2.5) * 18} Z`} fill={OLE.enamel} />
          </g>;
        }) : null}
        {/* chorro de desagüe */}
        {cold && drainP > 0 && drainP < 1 ? <>
          <rect x={CX - 9} y={716} width={18} height={80 + 20 * Math.sin(t * 10)} rx={9} fill={water} />
          {Array.from({ length: 5 }).map((_, i) => { const ph = ((t * 2 + i * 0.2) % 1); return <circle key={i} cx={CX + Math.sin(i * 3) * 6} cy={730 + ph * 90} r={5} fill={`rgba(${wc[0]},${wc[1]},${wc[2]},0.9)`} opacity={1 - ph} />; })}
        </> : null}
        <Clock cx={110} cy={860} r={56} hours={hours} p={prog} done={done} color={accent} />
        <text x={186} y={878} fontFamily={HAND} fontWeight={700} fontSize={58} fill={OLE.iron}>{done ? (side.time ?? (cold ? "8 hrs" : "about 1 hr")) : `${hh}:${String(mm).padStart(2, "0")}`}</text>
      </svg>
      {/* 2x */}
      <div style={{ position: "absolute", right: 70, top: 250, opacity: interpolate(prog, [0.85, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), rotate: "-6deg", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: OLE.fire }}>{swellLabel}</div>
      {/* desagüe */}
      {cold && (side.drain ?? true) ? (
        <div style={{ position: "absolute", right: 36, top: 790, width: 380, textAlign: "right", opacity: interpolate(drainP, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }), fontFamily: HAND, fontWeight: 700, fontSize: 44, lineHeight: 1.05, color: OLE.plaid }}>{side.drainText ?? "color & flavor, down the drain"}</div>
      ) : null}
      {!cold && done ? (
        <div style={{ position: "absolute", right: 40, top: 800, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: OLE.forest, rotate: "-3deg" }}>{side.doneText ?? "done by lunch"}</div>
      ) : null}
    </div>
  );
};

export const OleBeanSwell: React.FC<{
  mode?: "split" | "cold" | "hot";
  cold?: SwellSide;
  hot?: SwellSide;
  swellLabel?: string;
  /** [s] = [empieza a hincharse, olla caliente lista, remojo frío listo, se va por la pileta] */
  beats?: number[];
  bed?: string;
  seed?: number;
}> = ({ mode = "split", cold = {}, hot = {}, swellLabel = "2x bigger", beats, bed, seed = 21 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dur = durationInFrames / fps;
  const t = f / fps;
  const b0 = beats?.[0] ?? 0.8;
  const bHot = Math.max(b0 + 1, beats?.[1] ?? b0 + dur * 0.3);
  const bCold = Math.max(b0 + 1.5, beats?.[2] ?? dur * 0.66);
  const bDrain = beats?.[3] ?? bCold + 0.5;
  const ez = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.sin) };
  const pCold = interpolate(t, [b0, bCold], [0, 1], ez);
  const pHot = interpolate(t, [b0, bHot], [0, 1], ez);
  const drainP = (cold.drain ?? true) ? interpolate(t, [bDrain, bDrain + 1.6], [0, 1], ez) : 0;
  const inL = interpolate(f, [0, 0.6 * fps], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const inR = interpolate(f, [0.15 * fps, 0.75 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const outP = interpolate(f, [durationInFrames - 0.4 * fps, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: outP }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 50 }}>
        {mode !== "hot" ? <div style={{ rotate: "-0.8deg", scale: mode === "split" ? "1" : "1.08" }}><Panel side={cold} kind="cold" prog={pCold} drainP={drainP} t={t} inP={inL} swellLabel={swellLabel} seed={seed} /></div> : null}
        {mode !== "cold" ? <div style={{ rotate: "0.8deg", scale: mode === "split" ? "1" : "1.08" }}><Panel side={hot} kind="hot" prog={pHot} drainP={0} t={t} inP={mode === "hot" ? inL : inR} swellLabel={swellLabel} seed={seed + 100} /></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
