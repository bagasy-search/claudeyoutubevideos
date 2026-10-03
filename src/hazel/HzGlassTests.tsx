// Componentes de las pruebas del cristal (Hazel): onda del sonido (campana vs golpe seco), perfil del borde (tallado
// filoso vs prensado redondeado con costura), y la franja de la época (Brilliant Period 1876-1917 vs prensado barato).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HZ, LABEL, SERIF, TYPE, paperBg } from "./HzTheme";
import { HzBed, Stamp, Tag, ease, useIn } from "./HzParts";

// dos ondas dibujándose: una larga que decae lento ("rings like a bell") y una corta que muere ("clunk")
export const HzRingWave: React.FC<{ bed?: string; good?: string; bad?: string; title?: string; seed?: number }> = ({ bed, good = "lead crystal · rings like a bell", bad = "plain glass · clunk", title = "the flick test", seed = 31 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 13, 110);
  const wave = (decay: number, freq: number, at: number) => {
    const p = interpolate(f, [at, at + 50], [0, 1], ease); const pts: string[] = [];
    for (let i = 0; i <= 600 * p; i += 3) { const t = i / 600; pts.push(`${(i * 2.4).toFixed(1)},${(70 + Math.sin(t * freq) * 60 * Math.exp(-t * decay)).toFixed(1)}`); }
    return pts.join(" ");
  };
  const Row: React.FC<{ y: number; label: string; color: string; decay: number; at: number }> = ({ y, label, color, decay, at }) => (
    <div style={{ position: "absolute", left: 200, top: y, width: 1520, opacity: interpolate(f, [at - 4, at], [0, 1], ease) }}>
      <div style={{ fontFamily: TYPE, fontSize: 44, color }}>{label}</div>
      <svg width={1460} height={140}><polyline points={wave(decay, 260, at)} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" /></svg>
    </div>
  );
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.15} />
      <div style={{ position: "absolute", left: 140, top: 140, right: 140, bottom: 140, ...paperBg(), boxShadow: "0 30px 60px rgba(31,27,22,0.35)", transform: `translateY(${(1 - k) * 900}px)` }} />
      <div style={{ position: "absolute", top: 180, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 42, letterSpacing: 9, color: HZ.red, textTransform: "uppercase", opacity: k }}>{title}</div>
      <Row y={290} label={good} color={HZ.green} decay={1.2} at={14} />
      <Row y={600} label={bad} color={HZ.red} decay={14} at={60} />
    </AbsoluteFill>
  );
};

// perfil del borde en corte: tallado a mano (picos filosos) vs prensado (redondeado + costura del molde)
export const HzEdgeCompare: React.FC<{ bed?: string; left?: string; right?: string; title?: string; seed?: number }> = ({ bed, left = "hand cut · sharp", right = "pressed · rounded, a seam", title = "run your thumb along it", seed = 33 }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [10, 40], [0, 1], ease);
  const sharp = "M0 200 L60 60 L120 200 L180 60 L240 200 L300 60 L360 200 L420 60 L480 200 L540 60 L600 200";
  const round = "M0 200 C30 200 30 90 60 90 C90 90 90 200 120 200 C150 200 150 90 180 90 C210 90 210 200 240 200 C270 200 270 90 300 90 C330 90 330 200 360 200 C390 200 390 90 420 90 C450 90 450 200 480 200 C510 200 510 90 540 90 C570 90 570 200 600 200";
  const Panel: React.FC<{ x: number; d: string; label: string; good: boolean; seam?: boolean }> = ({ x, d, label, good, seam }) => (
    <div style={{ position: "absolute", left: x, top: 260, width: 760 }}>
      <Tag w={760} h={520} hole="top" color={HZ.paper}>
        <svg width={640} height={240} viewBox="0 0 600 230" style={{ marginLeft: 20 }}>
          <path d={d + " L600 230 L0 230 Z"} fill="rgba(170,200,220,0.35)" />
          <path d={d} fill="none" stroke={HZ.ink} strokeWidth={6} strokeDasharray={2200} strokeDashoffset={2200 * (1 - draw)} />
          {seam ? <line x1={300} y1={70} x2={300} y2={230} stroke={HZ.red} strokeWidth={5} strokeDasharray="10 8" opacity={interpolate(f, [44, 52], [0, 1], ease)} /> : null}
        </svg>
        <div style={{ textAlign: "center", fontFamily: TYPE, fontSize: 44, color: good ? HZ.green : HZ.red, marginTop: 10 }}>{label}</div>
      </Tag>
    </div>
  );
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.25} />
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 9, color: HZ.white, textTransform: "uppercase", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{title}</div>
      <Panel x={150} d={sharp} label={left} good />
      <Panel x={1010} d={round} label={right} good={false} seam />
    </AbsoluteFill>
  );
};

// la franja de época: los años del tallado a mano y después el prensado barato
export const HzEraStrip: React.FC<{ bed?: string; from?: number; to?: number; title?: string; label?: string; after?: string; seed?: number }> = ({ bed, from = 1876, to = 1917, title = "American Brilliant Period", label = "cut by hand, one piece at a time", after = "pressed glass: pennies at the five and dime", seed = 35 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [10, 40], [0, 1], ease);
  const X0 = 180, X1 = 1740, Y0 = 1850, Y1 = 1960; const x = (y: number) => X0 + ((y - Y0) / (Y1 - Y0)) * (X1 - X0);
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.35} />
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 92, color: HZ.white, textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{title}</div>
      <div style={{ position: "absolute", left: X0, width: X1 - X0, top: 560, height: 8, background: "rgba(255,253,246,0.8)" }} />
      {[1850, 1876, 1900, 1917, 1930, 1960].map((y) => <div key={y} style={{ position: "absolute", left: x(y) - 60, width: 120, top: 590, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: HZ.white }}>{y}</div>)}
      <div style={{ position: "absolute", left: x(from), top: 430, width: (x(to) - x(from)) * k, height: 100, background: HZ.gold, borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: x(from), top: 700, width: 900, fontFamily: TYPE, fontSize: 46, color: HZ.white, opacity: interpolate(f, [36, 44], [0, 1], ease), textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{label}</div>
      <div style={{ position: "absolute", left: 700, top: 820, opacity: interpolate(f, [60, 70], [0, 1], ease) }}><Stamp text={after} at={60} size={44} rot={-3} color={HZ.red} style={{ background: "rgba(255,253,246,0.88)", whiteSpace: "nowrap" }} /></div>
    </AbsoluteFill>
  );
};
