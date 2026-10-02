// HzMagnetTest — el imán de herradura baja sobre dos cadenas (sobre la foto de la mesa de trabajo): la que es oro
// no se mueve, la que no lo es salta y se pega. Props: bed, left/right {label, sticks}, verdictL/R, title.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE } from "./HzTheme";
import { HzBed, Stamp, ease } from "./HzParts";

type Side = { label: string; sticks: boolean; verdict: string };

const Chain: React.FC<{ color: string; lift: number }> = ({ color, lift }) => (
  <svg width="300" height="420" viewBox="0 0 300 420" style={{ overflow: "visible" }}>
    {Array.from({ length: 12 }).map((_, i) => {
      const t = i / 11; const y = 400 - t * 300 - lift * (1 - t) * 0 - lift * Math.sin(t * Math.PI) * 0.2 - lift * t;
      const x = 150 + Math.sin(i * 1.3) * 10 * (1 - lift / 300);
      return <ellipse key={i} cx={x} cy={Math.max(40, y)} rx={i % 2 ? 9 : 16} ry={i % 2 ? 16 : 9} fill="none" stroke={color} strokeWidth="7" />;
    })}
  </svg>
);

export const HzMagnetTest: React.FC<{ bed?: string; title?: string; left: Side; right: Side; seed?: number }> = ({ bed, title = "the magnet test", left, right, seed = 41 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const down = interpolate(f, [6, 30], [-420, 0], ease);
  const pull = spring({ frame: f - 34, fps, config: { damping: 8, stiffness: 160 } });
  const side = (s: Side, x: number) => {
    const lift = s.sticks ? pull * 230 : 0;
    return (
      <div style={{ position: "absolute", left: x, top: 330 }}>
        <Chain color={s.sticks ? "#9aa0a6" : HZ.gold} lift={lift} />
        <div style={{ textAlign: "center", width: 300, marginTop: 10, fontFamily: TYPE, fontSize: 34, color: HZ.white, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>{s.label}</div>
        <div style={{ position: "absolute", left: 20, top: 200, opacity: interpolate(f, [52, 58], [0, 1], ease) }}>
          <Stamp text={s.verdict} at={52} size={48} color={s.sticks ? HZ.red : HZ.green} rot={s.sticks ? -8 : 6} />
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.35} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: HZ.goldSoft, textTransform: "uppercase" }}>{title}</div>
      </div>
      <svg style={{ position: "absolute", left: 1060, top: 130 + down }} width="300" height="260" viewBox="0 0 300 260">
        <path d="M 40 0 L 40 150 A 110 110 0 0 0 260 150 L 260 0 L 190 0 L 190 150 A 40 40 0 0 1 110 150 L 110 0 Z" fill={HZ.red} stroke={HZ.redDeep} strokeWidth="6" />
        <rect x="40" y="0" width="70" height="44" fill="#d8dde2" /><rect x="190" y="0" width="70" height="44" fill="#d8dde2" />
      </svg>
      {side(left, 520)}
      {side(right, 1060)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: SERIF, fontSize: 52, color: HZ.white, textShadow: "0 3px 10px rgba(0,0,0,0.7)", opacity: interpolate(f, [60, 70], [0, 1], ease) }}>gold never jumps to a magnet</div>
    </AbsoluteFill>
  );
};
