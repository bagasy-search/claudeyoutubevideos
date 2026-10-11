// INTRO de Claudio Cocina (primer minuto): dos componentes de calidad en lugar de avatar quieto, al mismo ritmo de cortes del video.
//   ClMenuBoard  la promesa del video escrita con tiza en el pizarrón de la fonda ("HOY EN LA FONDA" + el plato + 3 renglones que se
//                escriben al compás de la voz: `at` = [s] de cada renglón). Debajo, el propio vlog atenuado.
//   ClOldPhoto   "Soy Claudio": la foto vieja de él de chico/joven en la fonda con su amá (papel con borde blanco, cae y se asienta,
//                acercamiento lento), leyenda a mano, y al lado CLAUDIO + contadores "40 años en esta cocina" / "80 comidas por día"
//                que suben cuando los dice (`at` = [s] de cada contador).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, SERIF, LABEL, HAND, rnd } from "./ClTheme";
import { Bed, Tape, lin, pop, useOut } from "./ClParts";

// trazo de tiza: el texto se "escribe" de izquierda a derecha con un borde rugoso
const Chalk: React.FC<{ k: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ k, children, style }) => (
  <div style={{ position: "relative", whiteSpace: "nowrap", clipPath: `inset(-20px ${100 - k * 100}% -20px -20px)`, color: "#F4F1E6", textShadow: "0 0 2px rgba(255,255,255,0.55), 1px 1px 0 rgba(255,255,255,0.12)", ...style }}>{children}</div>
);

export const ClMenuBoard: React.FC<{ dish: string; lines: string[]; at?: number[]; bed?: string; kicker?: string }> = ({ dish, lines, at, bed, kicker = "HOY EN LA FONDA" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const ts = (at && at.length === lines.length ? at.map((s) => Math.round(s * fps)) : lines.map((_, i) => Math.round(T * (0.28 + i * 0.2))));
  const kd = lin(f, 8, 24), kk = lin(f, 3, 12);
  const sway = Math.sin(f / 40) * 0.25;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={61} dim={0.22} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(10,14,25,0) 40%, rgba(10,14,25,0.45) 100%)" }} />
      <div style={{ position: "absolute", left: 300, top: 95, width: 1320, height: 890, rotate: `${-1.1 + sway + (1 - p) * 3}deg`, translate: `0 ${(1 - p) * 140}px`, filter: "drop-shadow(0 40px 60px rgba(10,14,25,0.55))" }}>
        {/* marco de madera */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(135deg, #9A6B3F, #6E4524 60%, #835530)", boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.25)" }} />
        {/* pizarrón verde con polvo de tiza */}
        <div style={{ position: "absolute", left: 34, top: 34, right: 34, bottom: 34, borderRadius: 8, overflow: "hidden", background: "radial-gradient(ellipse at 35% 30%, #3C5A48, #2A4134 70%, #22362B)" }}>
          {Array.from({ length: 26 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: `${rnd(i * 3) * 100}%`, top: `${rnd(i * 7 + 1) * 100}%`, width: 160 + rnd(i) * 280, height: 40 + rnd(i + 2) * 70, borderRadius: "50%", background: "rgba(255,255,255,0.035)", rotate: `${rnd(i + 5) * 40 - 20}deg`, filter: "blur(10px)" }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 54, textAlign: "center" }}>
            <Chalk k={kk} style={{ display: "inline-block", fontFamily: LABEL, fontWeight: 600, fontSize: 44, letterSpacing: 12, color: CL.yellowSoft }}>{kicker}</Chalk>
          </div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 132, textAlign: "center" }}>
            <Chalk k={kd} style={{ display: "inline-block", fontFamily: HAND, fontWeight: 700, fontSize: dish.length > 26 ? 96 : 116, lineHeight: 1.05 }}>{dish}</Chalk>
          </div>
          {/* subrayado a tiza */}
          <svg width={1252} height={60} style={{ position: "absolute", left: 0, top: 272 }}>
            <path d="M 250 30 C 480 18, 780 40, 1000 24" fill="none" stroke="rgba(244,241,230,0.8)" strokeWidth={7} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={760 * (1 - lin(f, 22, 34))} />
          </svg>
          {lines.map((l, i) => {
            const k = lin(f, ts[i], ts[i] + Math.max(14, Math.min(26, l.length * 0.9)));
            const tick = lin(f, ts[i] + 10, ts[i] + 18);
            return (
              <div key={i} style={{ position: "absolute", left: 150, top: 380 + i * 135, display: "flex", alignItems: "center", gap: 34 }}>
                <svg width={70} height={70} style={{ opacity: tick > 0 ? 1 : 0 }}>
                  <path d="M 10 38 L 28 56 L 62 14" fill="none" stroke={CL.yellowSoft} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - tick)} />
                </svg>
                <Chalk k={k} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76 }}>{l}</Chalk>
              </div>
            );
          })}
          {/* el gis en el borde de abajo */}
          <div style={{ position: "absolute", right: 120, bottom: 22, width: 90, height: 18, borderRadius: 6, background: "#F3EFE2", rotate: "-8deg", boxShadow: "0 3px 4px rgba(0,0,0,0.35)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const count = (f: number, a: number, n: number) => Math.round(n * interpolate(f, [a, a + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));

export const ClOldPhoto: React.FC<{ photo: string; caption: string; stats?: { n: number; label: string }[]; at?: number[]; bed?: string; name?: string }> = ({ photo, caption, stats = [{ n: 40, label: "años en esta cocina" }, { n: 80, label: "comidas por día" }], at, bed, name = "CLAUDIO" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(9);
  const drop = pop(f, fps, 0, 12);
  const z = lin(f, 0, T, 1.0, 1.07);
  const cap = lin(f, 18, 40);
  const nm = pop(f, fps, 8, 15);
  const ts = (at && at.length === stats.length ? at.map((s) => Math.round(s * fps)) : stats.map((_, i) => 16 + i * 40));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={67} dim={0.0} warm={0.8} />
      <AbsoluteFill style={{ backdropFilter: "blur(14px)", backgroundColor: "rgba(32,22,14,0.42)" }} />
      {/* la foto: cae desde arriba girando y se asienta torcida, con cinta */}
      <div style={{ position: "absolute", left: 130, top: 120, width: 1060, rotate: `${-3.2 + (1 - drop) * -12}deg`, translate: `0 ${(1 - drop) * -900}px`, filter: "drop-shadow(0 34px 44px rgba(0,0,0,0.6))" }}>
        <div style={{ background: "#F6F0E1", padding: "34px 34px 120px", borderRadius: 4 }}>
          <div style={{ width: 992, height: 554, overflow: "hidden", position: "relative", background: "#000" }}>
            <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(z), transformOrigin: "45% 40%", filter: "sepia(0.32) saturate(0.82) contrast(0.94) brightness(1.03)" }} />
            {/* desgaste del papel: viñeta + raspones */}
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,240,200,0) 55%, rgba(90,60,20,0.35) 100%)", mixBlendMode: "multiply" }} />
            {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${rnd(i * 5 + 2) * 100}%`, top: `${rnd(i * 9 + 4) * 100}%`, width: 2, height: 60 + rnd(i) * 140, background: "rgba(255,250,235,0.35)", rotate: `${rnd(i + 3) * 60 - 30}deg` }} />)}
          </div>
          <div style={{ position: "absolute", left: 60, bottom: 30, fontFamily: HAND, fontWeight: 700, fontSize: 62, color: "#2B3A6B", rotate: "-1.5deg", clipPath: `inset(-20px ${100 - cap * 100}% -20px -20px)`, whiteSpace: "nowrap" }}>{caption}</div>
        </div>
        <Tape x={460} y={-26} rot={3} w={170} />
      </div>
      {/* CLAUDIO + contadores */}
      <div style={{ position: "absolute", left: 1290, top: 230, width: 560 }}>
        <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: CL.yellowSoft, opacity: nm }}>LA FONDA</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 122, color: "#fff", lineHeight: 1, scale: String(0.85 + 0.15 * nm), transformOrigin: "0 50%", opacity: nm, textShadow: "0 6px 24px rgba(0,0,0,0.5)" }}>{name}</div>
        <div style={{ height: 6, width: 300 * lin(f, 14, 30), background: CL.yellow, marginTop: 14, borderRadius: 3 }} />
        {stats.map((s, i) => {
          const k = lin(f, ts[i], ts[i] + 10);
          return (
            <div key={i} style={{ marginTop: i ? 34 : 50, opacity: k, translate: `${(1 - k) * 50}px 0`, display: "flex", alignItems: "baseline", gap: 22 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 118, color: CL.yellow, lineHeight: 1, minWidth: 170, textShadow: "0 6px 22px rgba(0,0,0,0.45)" }}>{count(f, ts[i], s.n)}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", lineHeight: 1.0, textShadow: "0 4px 14px rgba(0,0,0,0.5)" }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
