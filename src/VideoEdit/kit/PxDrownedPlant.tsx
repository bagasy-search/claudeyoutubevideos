import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParticleField,
  GodRays,
  DepthShadow,
  PaperGrain,
  SvgFilters,
  wobble,
} from "./depth";

// ─────────────────────────────────────────────────────────────────────────────
// PxDrownedPlant — PIEZA ÚNICA para el truco 1: "no tiene sed: se AHOGA".
// Corte transversal de tierra ENCHARCADA: la planta está mustia, las hojas caídas,
// las raíces sumergidas bajo una lámina de agua que ondula (feDisplacement). NO le
// falta agua — le falta AIRE. Al airear con oxígeno (H₂O₂ → O₂), suben burbujas de
// O₂ a la raíz, el agua BAJA y las hojas se LEVANTAN por resorte (spring), pasando
// de terracota-mustio a verde vivo. Dos actos en loop: ahogada → aireada.
//
// Marca terrosa-vintage: parchment, tierra oscura, verde huerta, eucalipto (O₂).
// PROFUNDIDAD: capas de tierra con parallax de granos, DepthShadow, agua con ripple
// SVG, hojas con física de resorte, ParticleField de O₂, GodRays. Esquina inf-der libre.
// RENDER-SAFE: cero Date.now/Math.random/new Date. Azar determinístico por índice.
// ─────────────────────────────────────────────────────────────────────────────

const O2 = COLORS.cold; // burbuja de O₂ = eucalipto
const ROOT = "#EDE4CE"; // raíz crema
const SOIL = "#3a2b1c";
const SOIL2 = "#4a3826";
const WATER = "#6f8478"; // agua estancada (eucalipto turbio)
const GREEN = COLORS.good;
const WILT = COLORS.amber; // hoja mustia = sepia/óxido

export const PxDrownedPlant: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "No tiene sed: se ahoga" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const lab = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // ── dos actos en loop: [0..AERATE) ahogada · [AERATE..CYCLE) aireada ─────────
  const CYCLE = 260;
  const AERATE = 130; // frame dentro del ciclo en que empieza la aireación
  const cf = ((frame % CYCLE) + CYCLE) % CYCLE;
  const aerating = cf >= AERATE;
  const sinceAerate = cf - AERATE;

  // recuperación por resorte: 0 = ahogada/mustia, 1 = aireada/erguida
  const recover = aerating
    ? spring({ frame: sinceAerate, fps, config: { damping: 16, mass: 0.9, stiffness: 90 } })
    : 0;

  const groundY = 300; // línea aire/suelo
  // nivel del agua encharcada: alto (ahoga) → baja al airear
  const waterTop = interpolate(recover, [0, 1], [groundY + 40, 620]);

  // brisa idle sutil de las hojas
  const breeze = Math.sin(frame / 26) * 3;

  // color de las hojas interpola de mustio→verde
  const leafFill = lerpColor(WILT, GREEN, recover);
  // caída de las hojas: mustias cuelgan (rot+), aireadas se yerguen
  const droop = interpolate(recover, [0, 1], [26, 0]);

  // SFX: whoosh de aireación en cada inicio de acto 2
  const nAerate = Math.floor(durationInFrames / CYCLE) + 1;
  const aerateFrames = Array.from({ length: nAerate }, (_, i) => i * CYCLE + AERATE);

  const stemX = 560;
  const stemTopY = groundY - 168;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="drown" />
      <TechBackground glowX={46} glowY={22} hue={aerating ? "amber" : "cold"} drift={0.3} />
      <GodRays x={30} y={-16} angle={-18} color="rgba(169,121,74,0.14)" intensity={aerating ? 1.1 : 0.7} rays={6} />
      <ParticleField count={12} kind="dust" rise drift={18} opacity={0.28} />
      <SfxCue at={2} src={SFX.whoosh} volume={0.3} />
      {aerateFrames.map((af, i) => (
        <React.Fragment key={"sfx" + i}>
          <SfxCue at={af} src={SFX.whoosh} volume={0.4} />
          <SfxCue at={af + 8} src={SFX.popUp} volume={0.3} />
        </React.Fragment>
      ))}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 22}px)` }}>
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <div style={{ letterSpacing: 5, fontSize: 20, fontWeight: 700, textTransform: "uppercase", color: aerating ? GREEN : COLORS.amber }}>
              el truco del aire
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: COLORS.text }}>{title}</div>
          </div>

          <DepthShadow layers={5} distance={30} radius={26} color="rgba(42,38,32,0.16)" style={{ overflow: "hidden", border: "2px solid rgba(42,38,32,0.16)" }}>
            <svg viewBox="0 0 1600 760" width="100%" style={{ display: "block" }}>
              {/* cielo/aire = parchment (transparente sobre bg) con sol suave arriba-izq */}
              <circle cx={190} cy={110} r={52} fill={COLORS.amber} opacity={0.85 * lab(6)} />

              {/* ── capas de TIERRA (parallax de granos) ── */}
              <rect x={0} y={groundY} width={1600} height={120} fill={SOIL} />
              <rect x={0} y={groundY + 120} width={1600} height={760 - groundY - 120} fill={SOIL2} />
              <line x1={0} y1={groundY} x2={1600} y2={groundY} stroke="#1d160d" strokeWidth={4} />
              {Array.from({ length: 44 }, (_, i) => {
                const gx = 30 + ((i * 137) % 1540);
                const gy = groundY + 36 + ((i * 53) % 400);
                const gr = 2 + (i % 3);
                const px = wobble(i, frame, 0.5) * 2; // parallax leve de granos
                return <circle key={"g" + i} cx={gx + px} cy={gy} r={gr} fill="#2a1e12" opacity={0.5} />;
              })}

              {/* ── AGUA ENCHARCADA que ondula y BAJA al airear ── */}
              <g opacity={interpolate(recover, [0, 1], [0.92, 0.35])}>
                <rect x={0} y={waterTop} width={1600} height={760 - waterTop} fill={WATER} opacity={0.55} filter="url(#drown-ripple)" />
                {/* lámina superior brillante del agua */}
                <rect x={0} y={waterTop - 6} width={1600} height={12} fill="#a9bab0" opacity={0.5} filter="url(#drown-ripple)" />
                {/* reflejos determinísticos en la superficie */}
                {Array.from({ length: 10 }, (_, i) => {
                  const rx = 80 + ((i * 151) % 1440);
                  const w = 60 + (i % 4) * 30;
                  return <rect key={"r" + i} x={rx + wobble(i, frame, 1.3) * 10} y={waterTop + 4} width={w} height={3} rx={2} fill="#d5e0da" opacity={0.4} />;
                })}
              </g>

              {/* ── PLANTA: tallo + 3 hojas con resorte (mustia→erguida) ── */}
              <g opacity={lab(12)}>
                {/* tallo: se endereza al recuperar */}
                <path
                  d={`M ${stemX} ${groundY} Q ${stemX + droop * 0.6 + breeze} ${(groundY + stemTopY) / 2} ${stemX + droop * (1 - recover) + breeze} ${stemTopY}`}
                  fill="none"
                  stroke={lerpColor("#5a4a2a", "#2f5a23", recover)}
                  strokeWidth={11}
                  strokeLinecap="round"
                />
                {/* hoja izquierda */}
                <Leaf x={stemX + droop * (1 - recover) + breeze} y={stemTopY} rot={-40 + droop * (1 - recover) * 1.4 + breeze} fill={leafFill} scale={1} />
                {/* hoja derecha */}
                <Leaf x={stemX + droop * (1 - recover) + breeze} y={stemTopY + 4} rot={44 + droop * (1 - recover) * 1.3 - breeze} fill={leafFill} scale={1} mirror />
                {/* hoja baja pequeña */}
                <Leaf x={stemX + breeze * 0.6} y={groundY - 84} rot={-58 + droop * (1 - recover)} fill={leafFill} scale={0.72} />
              </g>

              {/* ── RAÍCES sumergidas ── */}
              <g opacity={lab(16)} fill="none" stroke={ROOT} strokeLinecap="round">
                <path d={`M ${stemX} ${groundY} C ${stemX} ${groundY + 90}, ${stemX - 40} ${groundY + 150}, ${stemX - 90} ${groundY + 250} C ${stemX - 120} ${groundY + 320}, ${stemX - 130} ${groundY + 380}, ${stemX - 120} ${groundY + 420}`} strokeWidth={9} />
                <path d={`M ${stemX} ${groundY} C ${stemX + 10} ${groundY + 100}, ${stemX + 60} ${groundY + 160}, ${stemX + 130} ${groundY + 250} C ${stemX + 180} ${groundY + 315}, ${stemX + 200} ${groundY + 380}, ${stemX + 200} ${groundY + 430}`} strokeWidth={9} />
                <path d={`M ${stemX} ${groundY + 30} C ${stemX} ${groundY + 120}, ${stemX} ${groundY + 200}, ${stemX + 10} ${groundY + 300} C ${stemX + 16} ${groundY + 360}, ${stemX + 18} ${groundY + 400}, ${stemX + 14} ${groundY + 440}`} strokeWidth={8} />
                <path d={`M ${stemX - 60} ${groundY + 200} C ${stemX - 90} ${groundY + 230}, ${stemX - 108} ${groundY + 258}, ${stemX - 112} ${groundY + 300}`} strokeWidth={4} opacity={0.85} />
                <path d={`M ${stemX + 80} ${groundY + 210} C ${stemX + 112} ${groundY + 236}, ${stemX + 130} ${groundY + 268}, ${stemX + 134} ${groundY + 312}`} strokeWidth={4} opacity={0.85} />
              </g>

              {/* ── BURBUJAS de O₂ que llegan a la raíz SOLO al airear ── */}
              {aerating && Array.from({ length: 16 }, (_, i) => {
                const bspan = 130;
                const p = ((frame * 1.9 + i * 37) % bspan) / bspan;
                const bx = 380 + ((i * 89) % 460) + Math.sin((frame + i * 24) / 15) * 8;
                const baseY = groundY + 190 + ((i * 41) % 220);
                const by = baseY - p * 110;
                const br = 8 + (i % 3) * 4;
                const op = Math.sin(p * Math.PI) * 0.8 * interpolate(recover, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
                return (
                  <g key={"ob" + i} opacity={op}>
                    <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.5} />
                    <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={2.5} />
                    <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.35} ry={br * 0.25} fill="#fff" opacity={0.6} />
                  </g>
                );
              })}

              {/* estado: cartelito que cambia de "ahogada" a "respira" (arriba-izq, PiP libre) */}
              <g opacity={lab(20)} transform="translate(150 250)">
                <rect x={-10} y={-40} width={aerating ? 330 : 360} height={62} rx={16} fill={aerating ? GREEN : COLORS.danger} opacity={0.16} />
                <text x={8} y={2} fontSize={38} fontWeight={800} fill={aerating ? GREEN : COLORS.danger} fontFamily={FONT_STACK}>
                  {aerating ? "Las raíces respiran" : "Ahogada, no con sed"}
                </text>
              </g>
            </svg>
          </DepthShadow>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

// hoja lanceolada con curva (rot en grados, escala, espejo opcional)
const Leaf: React.FC<{ x: number; y: number; rot: number; fill: string; scale?: number; mirror?: boolean }> = ({ x, y, rot, fill, scale = 1, mirror = false }) => {
  const s = scale * (mirror ? -1 : 1);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${scale})`}>
      <path d="M 0 0 C 40 -14, 92 -30, 116 -78 C 74 -66, 30 -40, 0 0 Z" fill={fill} />
      <path d="M 0 0 C 40 -22, 78 -44, 108 -72" fill="none" stroke="#000" strokeWidth={2} opacity={0.14} />
      <path d="M 0 0 C 40 -14, 92 -30, 116 -78" fill="none" stroke="#fff" strokeWidth={2} opacity={0.16} />
    </g>
  );
};

// interpolación lineal entre dos colores hex #RRGGBB (determinística, sin azar)
function lerpColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(h: string): [number, number, number] {
  const s = h.replace("#", "");
  const n = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

export default PxDrownedPlant;
