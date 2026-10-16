// Kit del video clmampara: set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClSprayCling  el 1er secreto: dos vidrios rociados. Vinagre solo → se escurre al piso ✗ · + 1 cucharada de detergente → se queda ✓.
//                 hi 0 = sólo el de vinagre solo · 1 = los dos con el veredicto. Sin hi: los dos.
//   ClWetTest     el 2º secreto: la misma mampara MOJADA (transparente) y SECA (opaca). hi 1 → sello "Vidrio marcado".
//   ClSqueegee    el 3er secreto: el secador de goma barre las gotitas de arriba hacia abajo, con el reloj de 20 segundos.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd } from "./ClTheme";
import { Bed, RoomLight, Stamp, lin, pop, useOut } from "./ClParts";

const tick = (ok: boolean, s = 70): React.ReactNode => (
  <svg width={s} height={s} viewBox="0 0 70 70">{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
);
const cl = (v: number) => Math.max(0, Math.min(1, v));

// un vidrio de mampara: marco cromado, azulejos detrás, una capa blanca "fog" (0..1) y gotas
const Glass: React.FC<{ w: number; h: number; fog: number; seed: number; children?: React.ReactNode }> = ({ w, h, fog, seed, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 10, overflow: "hidden", border: "12px solid #C9CED3", boxShadow: "inset 0 0 0 3px #8E959C" }}>
    {/* los azulejos y la ducha del otro lado */}
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect width={w} height={h} fill="#EDE6D8" />
      {Array.from({ length: Math.ceil(w / 90) + 1 }, (_, i) => <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={h} stroke="#D6CCBA" strokeWidth={3} />)}
      {Array.from({ length: Math.ceil(h / 90) + 1 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 90} x2={w} y2={i * 90} stroke="#D6CCBA" strokeWidth={3} />)}
      <rect x={w * 0.62} y={h * 0.08} width={14} height={h * 0.3} fill="#A7AEB5" />
      <ellipse cx={w * 0.62 + 7} cy={h * 0.08} rx={46} ry={18} fill="#B9C0C7" stroke="#8E959C" strokeWidth={4} />
    </svg>
    {/* la nube blanca de piedra */}
    <div style={{ position: "absolute", inset: 0, background: `rgba(246,246,242,${0.86 * fog})`, backdropFilter: `blur(${10 * fog}px)` }} />
    {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(seed + i) * w, top: rnd(seed + i + 50) * h, width: 26 + 30 * rnd(seed + i + 9), height: 26 + 30 * rnd(seed + i + 9), borderRadius: "50%", border: `3px solid rgba(255,255,255,${0.9 * fog})`, background: `rgba(255,255,255,${0.35 * fog})` }} />)}
    {children}
  </div>
);

// ── 1er secreto: el detergente hace que el vinagre se quede pegado
export const ClSprayCling: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const card = (i: number) => {
    const on = hi < 0 || hi >= i, k = pop(f, fps, 4 + i * 10, 15), alone = i === 0;
    if (hi === 0 && i === 1) return null;
    const t = lin(f, 14 + i * 10, 70 + i * 10);
    return (
      <div key={i} style={{ position: "absolute", left: hi === 0 ? 590 : 190 + i * 800, top: 110, width: 740, height: 840, borderRadius: 34, background: "#FFFDF6", boxShadow: `14px 18px 34px ${CL.shadow}`, opacity: out * k * (on ? 1 : 0.42), translate: `0 ${(1 - k) * 80}px`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 36 }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: CL.navy }}>{alone ? "VINAGRE SOLO" : "VINAGRE + DETERGENTE"}</div>
        <div style={{ marginTop: 22 }}>
          <Glass w={520} h={500} fog={0.55} seed={300 + i * 40}>
            {/* la película de vinagre: sola se escurre al piso; con detergente queda pareja */}
            {alone
              ? Array.from({ length: 14 }, (_, j) => { const y = interpolate(t, [0, 1], [40 + rnd(j) * 120, 520 + rnd(j + 3) * 60]); return <div key={j} style={{ position: "absolute", left: 20 + j * 36, top: 0, width: 14, height: y, background: "linear-gradient(rgba(150,200,230,0) 0%, rgba(150,200,230,0.55) 80%, rgba(120,180,220,0.9) 100%)", borderRadius: 7 }} />; })
              : <div style={{ position: "absolute", inset: 0, background: `rgba(150,200,230,${0.38 * t})`, boxShadow: `inset 0 0 40px rgba(255,255,255,${0.6 * t})` }} />}
          </Glass>
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16 }}>
          {tick(!alone, 60)}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: CL.ink }}>{alone ? "Se escurre" : "Se queda"}</div>
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.ink, marginTop: 6 }}>{alone ? "al piso en un minuto" : "1 cucharada · sin sacudir"}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={211} dim={0.22} />
      {card(0)}
      {card(1)}
      {hi !== 0 ? <Stamp text="El detergente lo pega" at={60} color={CL.navy} x="50%" y="93%" rot={-3} size={58} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── 2º secreto: la prueba del vidrio mojado
export const ClWetTest: React.FC<{ hi?: number; bed?: string }> = ({ hi = 0, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const dry = hi === 1 ? interpolate(f, [16, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }) : 0;
  const k = pop(f, fps, 2, 15);
  const panel = (i: number) => {
    const wet = i === 0, fog = wet ? 0.05 : 0.15 + 0.75 * dry, kk = pop(f, fps, 4 + i * 12, 15);
    return (
      <div key={i} style={{ position: "absolute", left: 230 + i * 780, top: 120, display: "flex", flexDirection: "column", alignItems: "center", opacity: out * kk, translate: `0 ${(1 - kk) * 70}px` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, letterSpacing: 4, color: CL.navy, marginBottom: 18 }}>{wet ? "MOJADA" : "SECA"}</div>
        <Glass w={640} h={620} fog={fog} seed={400 + i * 40}>
          {wet ? Array.from({ length: 22 }, (_, j) => <div key={j} style={{ position: "absolute", left: rnd(j + 70) * 620, top: ((rnd(j + 90) * 620) + f * (2 + 3 * rnd(j))) % 640, width: 10, height: 18, borderRadius: 6, background: "rgba(140,190,220,0.7)" }} />) : null}
        </Glass>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, marginTop: 18 }}>{wet ? "Transparente" : hi === 1 ? "Opaca otra vez" : "¿?"}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: k }}>
      <Bed src={bed} seed={213} dim={0.22} />
      {panel(0)}
      {panel(1)}
      {hi === 1 ? <Stamp text="Vidrio marcado" at={58} color={CL.red} x="72%" y="88%" rot={-5} size={64} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── 3er secreto: 20 segundos de secador de goma
export const ClSqueegee: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = pop(f, fps, 2, 15);
  const W = 720, H = 760, passes = 4;
  const prog = interpolate(f, [12, T - 14], [0, passes], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lane = Math.min(passes - 1, Math.floor(prog)), y = (prog - lane) * H, laneW = W / passes;
  const secs = Math.round(interpolate(f, [12, T - 14], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={215} dim={0.22} />
      <div style={{ position: "absolute", left: 300, top: 110, opacity: out * k, translate: `0 ${(1 - k) * 70}px` }}>
        <Glass w={W} h={H} fog={0} seed={500}>
          {/* gotitas: desaparecen donde ya pasó el secador */}
          {Array.from({ length: 90 }, (_, j) => {
            const x = rnd(j + 600) * W, yy = rnd(j + 700) * H, l = Math.floor(x / laneW);
            const gone = l < lane || (l === lane && yy < y);
            return gone ? null : <div key={j} style={{ position: "absolute", left: x, top: yy, width: 14, height: 18, borderRadius: 8, background: "rgba(140,190,220,0.75)", boxShadow: "inset -2px -3px 0 rgba(255,255,255,0.8)" }} />;
          })}
          {/* el secador */}
          <div style={{ position: "absolute", left: lane * laneW - 10, top: y - 34, width: laneW + 20, height: 30, borderRadius: 8, background: "#2E3338", boxShadow: "0 6px 0 #111" }} />
          <div style={{ position: "absolute", left: lane * laneW + laneW / 2 - 14, top: y - 150, width: 28, height: 120, borderRadius: 10, background: CL.navy }} />
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 300, opacity: out * pop(f, fps, 10, 15), textAlign: "center", width: 560 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 210, color: CL.ink, lineHeight: 1 }}>{secs}</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 4, color: CL.navy }}>SEGUNDOS</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CL.ink, marginTop: 24 }}>después de cada ducha</div>
      </div>
      <Stamp text="Sin gotitas, no hay piedra" at={Math.max(30, T - 40)} color={CL.navy} x="70%" y="85%" rot={-3} size={54} />
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
