// Kit del CAMBIO DE ACEITE (Claudio Old Mechanic ep. 6 "omoil"), dentro del mundo (cama real + luz):
//   ClDipLevel   la punta de la varilla, gigante: las dos marcas (ADD / FULL) con la zona rayada entre ellas (≈ 1 cuarto de galón) y el
//                aceite dorado que sube hasta `level` (0 = marca baja, 1 = marca llena, >1 = de más) · verdict abajo · gota que cae si >1
//   ClCrankFoam  corte del cárter: el cigüeñal girando sobre el aceite; mode "ok" (gira por encima, la bomba chupa aceite limpio) o
//                "over" (el nivel sube, el cigüeñal lo golpea y aparecen burbujas/espuma; la presión baja) · label
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA, rnd } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

export const ClDipLevel: React.FC<{ level?: number; verdict?: string; bed?: string }> = ({ level = 1.9, verdict, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const rise = ease(clamp01((f - 10) / (T * 0.45)));
  const LOW = 700, FULL = 470, step = LOW - FULL;               // px de la marca baja a la llena = 1 cuarto
  const yTop = LOW - step * level * rise;
  const over = level > 1.05, under = level < 0.95;
  const col = over ? CL.red : under ? CL.nitrile : "#2E7D32";
  const v = verdict || (over ? `≈ ${Math.max(1, Math.round((level - 1) * 2) / 2)} QUART OVER` : under ? "ADD OIL" : "JUST RIGHT");
  const vk = clamp01((f - 10 - T * 0.45) / 8);
  const drip = over ? ((f - 10 - T * 0.45) % 26) / 26 : -1;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={961} dim={0.6} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        {/* la varilla: tira metálica vertical, punta abajo */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="steel" x1="0" x2="1"><stop offset="0" stopColor="#8D939C" /><stop offset="0.45" stopColor="#E3E6EA" /><stop offset="1" stopColor="#7A8089" /></linearGradient>
            <linearGradient id="oil" x1="0" x2="1"><stop offset="0" stopColor="#B8860B" stopOpacity="0.85" /><stop offset="0.5" stopColor="#F2C230" stopOpacity="0.9" /><stop offset="1" stopColor="#B8860B" stopOpacity="0.85" /></linearGradient>
            <pattern id="hatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="18" fill="rgba(40,40,40,0.35)" /></pattern>
          </defs>
          <rect x={900} y={-20} width={120} height={830} rx={18} fill="url(#steel)" />
          <path d="M900 790 L1020 790 L1010 850 Q960 880 910 850 Z" fill="url(#steel)" />
          <rect x={900} y={FULL} width={120} height={step} fill="url(#hatch)" />
          {[LOW, FULL].map((y) => <rect key={y} x={892} y={y - 5} width={136} height={10} fill="#3A3F48" />)}
          <rect x={902} y={yTop} width={116} height={Math.max(0, 860 - yTop)} fill="url(#oil)" />
          {drip >= 0 ? <ellipse cx={960} cy={880 + drip * 160} rx={12} ry={18} fill="#E0B42A" opacity={1 - drip} /> : null}
        </svg>
        <div style={{ position: "absolute", left: 1060, top: FULL - 34, fontFamily: LABEL, fontWeight: 800, fontSize: 52, color: "#fff", textShadow: "0 4px 12px rgba(0,0,0,0.7)" }}>FULL</div>
        <div style={{ position: "absolute", left: 1060, top: LOW - 34, fontFamily: LABEL, fontWeight: 800, fontSize: 52, color: "#fff", textShadow: "0 4px 12px rgba(0,0,0,0.7)" }}>ADD</div>
        <div style={{ position: "absolute", left: 1060, top: (FULL + LOW) / 2 - 30, fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CL.yellow, textShadow: "0 3px 10px rgba(0,0,0,0.7)", opacity: lin(f, 8, 18) }}>≈ 1 quart</div>
        <div style={{ position: "absolute", right: 1060, top: yTop - 30, textAlign: "right", fontFamily: LABEL, fontWeight: 800, fontSize: 46, color: col, background: "rgba(255,255,255,0.92)", padding: "4px 18px", borderRadius: 10, opacity: rise > 0.1 ? 1 : 0 }}>OIL ▸</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `rotate(-3deg) scale(${1.5 - 0.5 * vk})`, opacity: vk, border: `9px solid ${col}`, color: col, background: "rgba(255,255,255,0.93)", fontFamily: LABEL, fontWeight: 800, fontSize: 66, letterSpacing: 5, padding: "6px 34px", borderRadius: 14 }}>{v}</div>
        </div>
      </div>
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

export const ClCrankFoam: React.FC<{ mode?: "ok" | "over"; label?: string; bed?: string }> = ({ mode = "over", label, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const ang = f * 24;                                            // el cigüeñal gira rápido
  const rise = mode === "over" ? ease(clamp01((f - 8) / (T * 0.35))) : 0;
  const lvl = 760 - 90 * rise;                                   // nivel del aceite en el cárter
  const foam = mode === "over" ? clamp01((f - 8 - T * 0.25) / (T * 0.3)) : 0;
  const cx = 960, cy = 600, r = 150;
  const lab = label || (mode === "over" ? "TOO MUCH OIL = FOAM" : "THE RIGHT LEVEL");
  const lk = clamp01((f - T * 0.55) / 8);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={977} dim={0.62} />
      <div style={{ position: "absolute", left: 360, top: 150, width: 1200, height: 800, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ position: "absolute", inset: 0, padding: 0, overflow: "hidden", background: "#1B1F27" }}>
          <svg width={1200} height={800} style={{ position: "absolute", inset: 0 }} viewBox="360 150 1200 800">
            {/* cárter */}
            <path d="M420 520 L420 880 Q420 930 470 930 L1450 930 Q1500 930 1500 880 L1500 520" fill="#2A303A" stroke="#5B6372" strokeWidth={8} />
            <rect x={428} y={lvl} width={1064} height={930 - lvl - 8} fill="#C9971F" opacity={0.85} />
            {/* espuma */}
            {Array.from({ length: 70 }, (_, i) => {
              const x = 440 + rnd(i * 7 + 1) * 1040, y = lvl - 10 + rnd(i * 13 + 2) * 150 - 40 * foam;
              const rr = 6 + rnd(i * 5 + 3) * 16;
              return <circle key={i} cx={x} cy={y + Math.sin((f + i * 9) / 6) * 6} r={rr * foam} fill="rgba(255,240,200,0.75)" stroke="rgba(255,255,255,0.6)" strokeWidth={2} />;
            })}
            {/* cigüeñal: disco con contrapesos y muñón */}
            <g transform={`rotate(${ang} ${cx} ${cy})`}>
              <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} L${cx + 50} ${cy} A50 50 0 0 0 ${cx - 50} ${cy} Z`} fill="#8E96A4" stroke="#C7CDD6" strokeWidth={6} />
              <circle cx={cx} cy={cy - 95} r={38} fill="#C7CDD6" />
              <rect x={cx - 22} y={cy - 360} width={44} height={270} rx={18} fill="#9AA2AF" />
            </g>
            <circle cx={cx} cy={cy} r={34} fill="#5B6372" stroke="#C7CDD6" strokeWidth={6} />
            {/* chapoteo cuando el contrapeso pega en el aceite */}
            {mode === "over" && Math.cos((ang * Math.PI) / 180) < -0.6 ? Array.from({ length: 10 }, (_, i) => <circle key={"s" + i} cx={cx - 140 + i * 30} cy={lvl - 20 - rnd(i + f) * 60} r={7} fill="#F2C230" opacity={0.9} />) : null}
            {/* bomba y pescador */}
            <rect x={1280} y={800} width={120} height={70} rx={10} fill="#3E4553" stroke="#7D8696" strokeWidth={4} />
            <path d="M1300 870 L1300 905 L1240 905" fill="none" stroke="#7D8696" strokeWidth={14} />
            <text x={1340} y={780} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={30} fill="#C7CDD6">PUMP</text>
          </svg>
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#C7CDD6" }}>OIL PAN · CRANKSHAFT</div>
          {mode === "over" ? <div style={{ position: "absolute", right: 40, top: 30, fontFamily: LABEL, fontWeight: 800, fontSize: 40, color: CL.red, opacity: foam }}>{`OIL PRESSURE ▼`}</div> : null}
        </Card>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `rotate(-2deg) scale(${1.4 - 0.4 * lk})`, opacity: lk, border: `8px solid ${mode === "over" ? CL.red : "#2E7D32"}`, color: mode === "over" ? CL.red : "#2E7D32", background: "rgba(255,255,255,0.93)", fontFamily: LABEL, fontWeight: 800, fontSize: 58, letterSpacing: 5, padding: "6px 30px", borderRadius: 14 }}>{lab}</div>
      </div>
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};
