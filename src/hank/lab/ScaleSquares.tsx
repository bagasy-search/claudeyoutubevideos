// ScaleSquares — comparación HONESTA de superficies: dos cuadrados a escala exacta de área (lado ∝ √valor),
// anclados en la misma esquina sobre un fondo de grilla cartográfica oscura. Se dibuja A (contorno con
// stroke-dashoffset, relleno que entra, contador), luego B se superpone, y al final el porcentaje A/B.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

type Item = { label: string; value: number; sub?: string };
export type ScaleSquaresProps = { a: Item; b: Item; unit: string; note?: string };

const Grain: React.FC<{ o?: number }> = ({ o = 0.22 }) => {
  const f = useCurrentFrame();
  return (
    <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
  );
};

const fmt = (n: number) => {
  const s = Math.round(n).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const S_MAX = 610; // lado del cuadrado mayor
const OX = 300; // esquina inferior izquierda
const OY = 900;

const Square: React.FC<{ side: number; draw: number; fill: number; color: string; dash?: boolean; hatch: number; glow: number; id: string }> = ({ side, draw, fill, color, dash, hatch, glow, id }) => {
  const per = side * 4;
  // camino desde la esquina inferior izquierda, sentido horario hacia arriba
  const d = `M ${OX} ${OY} L ${OX} ${OY - side} L ${OX + side} ${OY - side} L ${OX + side} ${OY} Z`;
  return (
    <g>
      <defs>
        <pattern id={`h_${id}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform={`rotate(${hatch})`}>
          <line x1={0} y1={0} x2={0} y2={14} stroke={color} strokeWidth={2} strokeOpacity={0.35} />
        </pattern>
        <linearGradient id={`g_${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.34} />
          <stop offset="1" stopColor={color} stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={OX} y={OY - side} width={side} height={side} fill={`url(#g_${id})`} opacity={fill} />
      <rect x={OX} y={OY - side} width={side} height={side} fill={`url(#h_${id})`} opacity={fill * 0.8} />
      {/* halo */}
      <path d={d} fill="none" stroke={color} strokeWidth={10} strokeOpacity={0.18 * glow} strokeDasharray={per} strokeDashoffset={per * (1 - draw)} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={3.5} strokeDasharray={per} strokeDashoffset={per * (1 - draw)} strokeLinejoin="miter" />
      {/* lápiz: punto brillante en la punta del trazo */}
      {draw > 0 && draw < 1 && (() => {
        const L = draw * per;
        const seg = Math.floor(L / side);
        const r = (L - seg * side);
        const pts = [[OX, OY], [OX, OY - side], [OX + side, OY - side], [OX + side, OY], [OX, OY]];
        const p0 = pts[seg], p1 = pts[Math.min(4, seg + 1)];
        const x = p0[0] + (p1[0] - p0[0]) * (r / side), y = p0[1] + (p1[1] - p0[1]) * (r / side);
        return <g><circle cx={x} cy={y} r={14} fill={color} opacity={0.25} /><circle cx={x} cy={y} r={5} fill="#fff" /></g>;
      })()}
      {/* esquinas */}
      {fill > 0 && [[OX, OY - side, 1, 1], [OX + side, OY - side, -1, 1], [OX + side, OY, -1, -1]].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M ${x + sx * 22} ${y} L ${x} ${y} L ${x} ${y + sy * 22}`} stroke={color} strokeWidth={6} fill="none" opacity={fill} />
      ))}
    </g>
  );
};

export const ScaleSquares: React.FC<ScaleSquaresProps> = ({ a, b, unit, note }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const k = clamp((D - 30) / 180, 0.5, 1);
  const t = frame / k;

  const vmax = Math.max(a.value, b.value);
  const sa = S_MAX * Math.sqrt(a.value / vmax);
  const sb = S_MAX * Math.sqrt(b.value / vmax);
  const pct = Math.round((a.value / b.value) * 100);

  const aDraw = easeInOut((t - 10) / 32);
  const aFill = ease((t - 34) / 18);
  const aCount = easeInOut((t - 12) / 36);
  const bDraw = easeInOut((t - 62) / 32);
  const bFill = ease((t - 86) / 16);
  const bCount = easeInOut((t - 64) / 34);
  const pIn = ease((t - 108) / 14);
  const pPunch = clamp((t - 108) / 16);

  const tOut = clamp((frame - (D - 12)) / 12);
  const out = 1 - easeInOut(tOut);
  const drift = frame / Math.max(1, D);
  const camS = lerp(1.0, 1.04, easeInOut(drift));

  const Block: React.FC<{ it: Item; color: string; cnt: number; vis: number; y: number }> = ({ it, color, cnt, vis, y }) => (
    <div style={{ position: "absolute", left: 1060, top: y, width: 760, opacity: vis, transform: `translateX(${(1 - vis) * 30}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 22, height: 22, border: `3px solid ${color}`, background: `${color}44` }} />
        <div style={{ fontFamily: SANS, fontSize: 28, letterSpacing: 5, color: HK.bone, opacity: 0.85, whiteSpace: "nowrap" }}>{it.label}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
        <div style={{ fontFamily: SERIF, fontSize: 118, lineHeight: 1.05, color, textShadow: "0 8px 30px rgba(0,0,0,0.6)", fontVariantNumeric: "tabular-nums" }}>{fmt(it.value * cnt)}</div>
        <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: 4, color: HK.bone, opacity: 0.7 }}>{unit.toUpperCase()}</div>
      </div>
      {it.sub && <div style={{ fontFamily: MONO, fontSize: 26, color: HK.bone, opacity: 0.6 * clamp(cnt * 3 - 2), marginTop: 2 }}>{it.sub}</div>}
    </div>
  );

  // contornos de agua/pantano procedurales para la grilla
  const contours = Array.from({ length: 7 }).map((_, i) => {
    const y0 = 80 + i * 150 + rnd(i) * 40;
    let d = `M -50 ${y0}`;
    for (let x = 0; x <= 2000; x += 80) d += ` Q ${x + 40} ${y0 + Math.sin(x * 0.004 + i) * 60 + rnd(i * 13 + x) * 30} ${x + 80} ${y0 + Math.sin((x + 80) * 0.004 + i * 1.7) * 55}`;
    return d;
  });

  return (
    <AbsoluteFill style={{ background: "#07100f", overflow: "hidden", opacity: out }}>
      <AbsoluteFill style={{ transform: `scale(${camS}) translate(${lerp(-8, 8, drift)}px, ${lerp(5, -5, drift)}px)` }}>
        {/* base cartográfica */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 80% at 35% 45%, #16302d 0%, #0d1d1b 45%, #060c0b 100%)" }} />
        <AbsoluteFill style={{ transform: `translate(${lerp(0, -20, drift)}px, ${lerp(0, -10, drift)}px)` }}>
          <svg width={1960} height={1120} style={{ position: "absolute", left: -20, top: -20 }}>
            <defs>
              <pattern id="gmin" width={40} height={40} patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(120,200,190,0.07)" strokeWidth={1} /></pattern>
              <pattern id="gmaj" width={200} height={200} patternUnits="userSpaceOnUse"><path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(120,200,190,0.14)" strokeWidth={1.2} /></pattern>
            </defs>
            {contours.map((d, i) => <path key={i} d={d} stroke="rgba(120,200,190,0.07)" strokeWidth={1.5} fill="none" />)}
            <rect width="100%" height="100%" fill="url(#gmin)" />
            <rect width="100%" height="100%" fill="url(#gmaj)" />
          </svg>
          {/* marcas de coordenadas genéricas */}
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 20 + i * 200 + 6, top: 24, fontFamily: MONO, fontSize: 13, color: "rgba(150,210,200,0.35)" }}>{String(i * 10).padStart(3, "0")}</div>
          ))}
        </AbsoluteFill>
        {/* barrido de luz */}
        <AbsoluteFill style={{ background: `linear-gradient(100deg, rgba(0,0,0,0) ${lerp(-30, 110, drift)}%, rgba(160,230,220,0.05) ${lerp(-20, 120, drift)}%, rgba(0,0,0,0) ${lerp(-10, 130, drift)}%)` }} />

        {/* cuadrados */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {/* sombra del cuadrado mayor */}
          <rect x={OX + 14} y={OY - sb + 18} width={sb} height={sb} fill="rgba(0,0,0,0.35)" opacity={bFill} />
          <Square side={sa} draw={aDraw} fill={aFill} color={HK.orange} hatch={45} glow={1} id="a" />
          <Square side={sb} draw={bDraw} fill={bFill * 0.3} color={HK.bone} dash hatch={-45} glow={0.6} id="b" />
          {/* etiquetas de esquina */}
          <text x={OX} y={OY + 40} fill="rgba(241,235,221,0.55)" fontFamily={MONO} fontSize={20}>SIDE ∝ √AREA · DRAWN TO SCALE</text>
        </svg>

        {/* porcentaje en el centro del cuadrado A */}
        <div style={{ position: "absolute", left: OX, top: OY - (sa < 320 ? sb : sa), width: sa < 320 ? sb : sa, height: sa < 320 ? sb : sa, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: pIn }}>
          <div style={{ fontFamily: SERIF, fontSize: 220, lineHeight: 1, color: HK.bone, transform: `scale(${1 + 0.15 * (1 - ease(pPunch))})`,
            textShadow: `0 10px 40px rgba(0,0,0,0.7), 0 0 ${50 * (1 - pPunch)}px rgba(255,122,26,0.8)` }}>{pct}%</div>
          <div style={{ fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: HK.bone, opacity: 0.8, marginTop: 6, textAlign: "center", padding: "0 30px" }}>OF THE SAME AREA</div>
        </div>

        <Block it={a} color={HK.orange} cnt={aCount} vis={ease((t - 8) / 14)} y={250} />
        <Block it={b} color={HK.bone} cnt={bCount} vis={ease((t - 58) / 14)} y={520} />
        {note && (
          <div style={{ position: "absolute", left: 1060, top: 820, width: 740, fontFamily: MONO, fontSize: 24, lineHeight: 1.4, color: "rgba(241,235,221,0.6)", opacity: pIn }}>{note}</div>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      <Grain o={0.2} />
    </AbsoluteFill>
  );
};
