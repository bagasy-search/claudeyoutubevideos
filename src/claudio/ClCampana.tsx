// Kit del video clcampana: set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClFilterTest  ¿acero o aluminio? los dos filtros lado a lado: ACERO (pesado, láminas, brilla) · ALUMINIO (liviano, malla que se dobla).
//                 hi 0 = acero → "olla hirviendo" · 1 = aluminio → "agua caliente, sin hervir". Sin hi: los dos.
//   ClPotBoil     la olla en corte: phase "soda" = cae el bicarbonato de a cucharada y sube la espuma · "melt" = el filtro adentro y la
//                 grasa que se suelta y sube a flotar marrón, con el reloj de 10 min.
//   ClGrainWipe   la carcasa de acero con su veta: el trapo a favor de la veta ✓ (queda limpio) · en círculos ✗ (quedan las nubes). hi 0/1.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd } from "./ClTheme";
import { Bed, RoomLight, Stamp, lin, pop, useOut } from "./ClParts";

const tick = (ok: boolean, s = 70): React.ReactNode => (
  <svg width={s} height={s} viewBox="0 0 70 70">{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
);

// ── los dos filtros dibujados
const baffleSvg = (w: number, h: number): React.ReactNode => (
  <svg width={w} height={h} viewBox="0 0 420 300">
    <defs><linearGradient id="ftSteel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7F9FB" /><stop offset="0.5" stopColor="#B9C0C8" /><stop offset="1" stopColor="#7C848D" /></linearGradient></defs>
    <rect x={6} y={6} width={408} height={288} rx={14} fill="url(#ftSteel)" stroke="#5E666F" strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => <g key={i}><rect x={34 + i * 41} y={30} width={22} height={240} rx={4} fill="#8D959E" /><rect x={34 + i * 41} y={30} width={8} height={240} fill="#E8ECEF" /></g>)}
  </svg>
);
const meshSvg = (w: number, h: number, bend: number): React.ReactNode => (
  <svg width={w} height={h} viewBox="0 0 420 300">
    <rect x={6} y={6} width={408} height={288} rx={10} fill="#C9CDD1" stroke="#9AA0A6" strokeWidth={6} />
    {Array.from({ length: 26 }, (_, i) => <line key={`a${i}`} x1={20 + i * 15} y1={20} x2={20 + i * 15 + 30 * Math.sin(i * 0.4)} y2={280} stroke="#A9AEB4" strokeWidth={3} />)}
    {Array.from({ length: 18 }, (_, i) => <line key={`b${i}`} x1={20} y1={22 + i * 15} x2={400} y2={22 + i * 15 + bend * 18 * Math.sin((i / 18) * Math.PI)} stroke="#B6BBC0" strokeWidth={3} />)}
    <ellipse cx={260} cy={150} rx={60 * bend} ry={44 * bend} fill="rgba(90,96,104,0.28)" />
  </svg>
);
export const ClFilterTest: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const bend = interpolate(f, [24, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const card = (i: number) => {
    const on = hi < 0 || hi === i, k = pop(f, fps, 4 + i * 8, 15), steel = i === 0;
    return (
      <div style={{ position: "absolute", left: 190 + i * 800, top: 130, width: 740, height: 800, borderRadius: 34, background: "#FFFDF6", boxShadow: hi === i ? `0 0 0 10px ${steel ? CL.navy : "#8C939A"}, 24px 30px 60px ${CL.shadow}` : `14px 18px 34px ${CL.shadow}`, opacity: out * k * (on ? 1 : 0.42), translate: `0 ${(1 - k) * 80}px`, scale: String(on ? 1 : 0.94), display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 44 }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 4, color: CL.navy }}>{steel ? "ACERO" : "ALUMINIO"}</div>
        <div style={{ marginTop: 20 }}>{steel ? baffleSvg(560, 400) : meshSvg(560, 400, hi === 1 ? bend : 0.3)}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.ink, marginTop: 14 }}>{steel ? "pesado · láminas · brilla" : "liviano · malla · se dobla"}</div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16 }}>
          {tick(true, 60)}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: CL.ink }}>{steel ? "Olla hirviendo" : "Agua caliente"}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={191} dim={0.22} />
      {card(0)}
      {card(1)}
      {hi === 1 ? <Stamp text="Sin hervir" at={30} color={CL.red} x="72%" y="91%" rot={-4} size={62} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── la olla en corte
export const ClPotBoil: React.FC<{ phase?: "soda" | "melt"; bed?: string }> = ({ phase = "melt", bed }) => {
  const f = useCurrentFrame(); const { fps, width, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const PX = 520, PY = 260, PW = 640, PH = 560;
  const melt = phase === "melt" ? interpolate(f, [10, T - 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const foam = phase === "soda" ? lin(f, 18, 60) : 0.15;
  const spoons = phase === "soda" ? Math.min(4, Math.floor(interpolate(f, [8, 80], [0, 4.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))) : 0;
  const water = (x: number) => PY + 140 + Math.sin(x * 0.03 + f * 0.25) * 6;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={193} dim={0.22} />
      <div style={{ position: "absolute", inset: 0, opacity: out * p, translate: `0 ${(1 - p) * 80}px` }}>
        <svg width={width} height={1080} viewBox={`0 0 ${width} 1080`} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="pbPot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7E868F" /><stop offset="0.3" stopColor="#E9EDF0" /><stop offset="0.7" stopColor="#C3C9CF" /><stop offset="1" stopColor="#6F777F" /></linearGradient>
            <clipPath id="pbIn"><rect x={PX + 18} y={PY} width={PW - 36} height={PH - 18} /></clipPath>
          </defs>
          {/* llama */}
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${PX + 90 + i * 58} ${PY + PH + 60} q-14 -40 0 -${50 + 14 * Math.sin(f * 0.4 + i)} q14 40 0 ${50 + 14 * Math.sin(f * 0.4 + i)}`} fill="#3D7BEA" opacity={0.85} />)}
          {/* olla */}
          <rect x={PX} y={PY - 10} width={PW} height={PH} rx={20} fill="url(#pbPot)" stroke="#59616A" strokeWidth={8} />
          <g clipPath="url(#pbIn)">
            <path d={`M${PX} ${water(PX)} ${Array.from({ length: 33 }, (_, i) => `L${PX + i * 20} ${water(PX + i * 20)}`).join(" ")} L${PX + PW} ${PY + PH} L${PX} ${PY + PH} Z`} fill="rgba(196,214,224,0.92)" />
            {/* el filtro adentro */}
            {phase === "melt" ? <g transform={`translate(${PX + 150} ${PY + 210})`}>{Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 44} y={0} width={24} height={260} rx={4} fill={`rgb(${Math.round(120 + 70 * melt)},${Math.round(84 + 100 * melt)},${Math.round(48 + 140 * melt)})`} />)}</g> : null}
            {/* burbujas */}
            {Array.from({ length: 22 }, (_, i) => { const t = (f * 0.03 + rnd(i)) % 1; return <circle key={i} cx={PX + 40 + rnd(i + 7) * (PW - 80)} cy={PY + PH - 30 - t * (PH - 200)} r={5 + 6 * rnd(i + 3)} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />; })}
            {/* la grasa que sube y flota */}
            {phase === "melt" ? Array.from({ length: 16 }, (_, i) => { const t = Math.min(1, Math.max(0, melt * 1.4 - rnd(i) * 0.4)); return <ellipse key={i} cx={PX + 160 + rnd(i + 11) * 340} cy={PY + 420 - t * 270} rx={18 + 10 * rnd(i)} ry={8} fill="#7A4A1C" opacity={0.85 * t} />; }) : null}
            {/* espuma */}
            <rect x={PX} y={PY + 128 - 70 * foam} width={PW} height={20 + 70 * foam} fill={phase === "melt" ? `rgba(122,74,28,${0.25 + 0.5 * melt})` : "rgba(255,255,255,0.9)"} />
          </g>
          {/* cucharadas de bicarbonato */}
          {phase === "soda" ? Array.from({ length: spoons }, (_, i) => <circle key={i} cx={PX + 200 + i * 70} cy={PY + 60 - ((f * 6 + i * 20) % 40)} r={10} fill="#FFFFFF" />) : null}
        </svg>
        <div style={{ position: "absolute", left: 1290, top: 300, width: 520, textAlign: "center" }}>
          {phase === "soda" ? (
            <>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: CL.ink, lineHeight: 1 }}>½ taza</div>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, color: CL.navy, letterSpacing: 2 }}>DE BICARBONATO</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.navy, rotate: "-3deg", marginTop: 24 }}>de a una cucharada</div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CL.ink, lineHeight: 1 }}>10 min</div>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, color: CL.navy, letterSpacing: 2 }}>SIN TOCAR</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#7A4A1C", rotate: "-3deg", marginTop: 24, opacity: lin(f, 30, 44) }}>la grasa sube sola</div>
            </>
          )}
        </div>
      </div>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── la veta del acero: a favor ✓ · en círculos ✗
export const ClGrainWipe: React.FC<{ hi?: number; bed?: string }> = ({ hi = 0, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const t = interpolate(f, [12, Math.max(30, T - 16)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const panel = (i: number) => {
    const ok = i === 0, on = hi === i, k = pop(f, fps, 4 + i * 8, 15);
    const cx = ok ? 60 + t * 560 : 330 + Math.cos(t * Math.PI * 6) * 170, cy = ok ? 250 : 250 + Math.sin(t * Math.PI * 6) * 120;
    return (
      <div style={{ position: "absolute", left: 190 + i * 800, top: 150, width: 740, opacity: out * k * (on ? 1 : 0.45), translate: `0 ${(1 - k) * 80}px` }}>
        <div style={{ position: "relative", height: 520, borderRadius: 26, overflow: "hidden", background: "repeating-linear-gradient(90deg, #C9CFD5 0 3px, #DDE2E6 3px 7px, #BFC6CC 7px 9px)", boxShadow: `22px 28px 50px ${CL.shadow}` }}>
          {/* la grasa que queda / las nubes */}
          {ok ? <div style={{ position: "absolute", left: cx, right: 0, top: 0, bottom: 0, background: "rgba(150,110,50,0.35)" }} /> : (
            <svg width={740} height={520} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: Math.floor(t * 14) }, (_, j) => <ellipse key={j} cx={330 + Math.cos(j * 1.3) * 140} cy={250 + Math.sin(j * 1.3) * 100} rx={150} ry={95} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={22} />)}</svg>
          )}
          {/* el trapo */}
          <div style={{ position: "absolute", left: cx - 90, top: cy - 70, width: 180, height: 140, borderRadius: 26, background: "linear-gradient(135deg, #5C8FD6, #3E6EB8)", boxShadow: "10px 14px 24px rgba(0,0,0,0.25)" }} />
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 18, justifyContent: "center" }}>
          {tick(ok)}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: CL.ink }}>{ok ? "A favor de la veta" : "En círculos"}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={197} dim={0.2} />
      {panel(0)}
      {panel(1)}
      {hi === 1 ? <Stamp text="Quedan las nubes" at={36} color={CL.red} x="72%" y="10%" rot={-4} size={60} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
