import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  RimLight,
  PaperGrain,
  SvgFilters,
  GodRays,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxSoilBreath — PIEZA ÚNICA para TRUCO 1: "las raíces respiran".
// Corte transversal de tierra en ESTRATOS con parallax (superficie, subsuelo,
// roca) — a la IZQUIERDA una maceta ENCHARCADA quieta (agua estancada, sin O₂),
// a la DERECHA la misma tierra AIREADA que burbujea O₂ y cuyas raíces blancas
// INHALAN (pulso de resorte) las burbujas. Comparación viva lado a lado.
//
// RENDER-SAFE: cero Date.now / Math.random / new Date. Todo deriva de
// useCurrentFrame(); el "azar" es determinístico por índice.
// 1920x1080. Esquina inferior-derecha razonablemente libre para el PiP.
// ═══════════════════════════════════════════════════════════════════════════

const SOIL_TOP = "#5A3F26"; // capa superior húmeda
const SOIL_MID = "#3F2C18"; // subsuelo
const SOIL_DEEP = "#2A1D10"; // profundo
const ROOT = "#EDE4CE"; // raíz blanca-crema
const O2 = COLORS.cold; // burbuja O₂
const STAGNANT = "#4A5647"; // agua estancada verdosa-turbia
const GREEN = COLORS.good;

export const PxSoilBreath: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "Las raíces respiran" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  // Pulso de "inhalación" de las raíces (resorte que late): 0→1→0 rítmico.
  const breathSpan = 66;
  const bp = (frame % breathSpan) / breathSpan; // 0→1 en loop
  const inhale = Math.sin(bp * Math.PI); // 0 en extremos, 1 al centro
  // resorte de entrada para que el primer pulso "arranque" con vida
  const rootIn = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 0.8, stiffness: 130 } });

  const titleIn = spring({ frame: frame - 8, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const labIn = (d: number) => spring({ frame: frame - d, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });

  const groundY = 300; // línea de superficie
  const divX = 960; // divisoria izquierda(encharcada) / derecha(aireada)

  // maceta derecha: raíces que se ensanchan al inhalar
  const rootThrob = 1 + inhale * 0.06 * rootIn;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="pxs" />
      <GodRays x={72} y={-14} angle={20} intensity={0.9} rays={6} color="rgba(169,121,74,0.18)" />

      <AbsoluteFill style={{ opacity: enter }}>
        {/* ── ESTRATOS con PARALLAX (fondo lejano → frente) ── */}
        {/* Estrato profundo (lento) */}
        <ParallaxLayer depth={0.2} driftY={10}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ display: "block" }}>
            <rect x={0} y={groundY + 340} width={1920} height={1080 - groundY - 340} fill={SOIL_DEEP} />
            {/* vetas de roca */}
            {Array.from({ length: 7 }, (_, i) => (
              <path key={"rk" + i} d={`M ${rand(i) * 1920} ${groundY + 380 + rand(i, 1) * 300} q 180 ${-30 + rand(i, 2) * 60} 360 0`} stroke="#1C1109" strokeWidth={6} fill="none" opacity={0.5} />
            ))}
          </svg>
        </ParallaxLayer>

        {/* Subsuelo (medio) */}
        <ParallaxLayer depth={0.45} driftY={14}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ display: "block" }}>
            <rect x={0} y={groundY + 120} width={1920} height={280} fill={SOIL_MID} />
          </svg>
        </ParallaxLayer>

        {/* Capa superior + superficie (frente) */}
        <ParallaxLayer depth={0.7} driftY={18}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ display: "block" }}>
            <rect x={0} y={groundY} width={1920} height={120} fill={SOIL_TOP} />
            <line x1={0} y1={groundY} x2={1920} y2={groundY} stroke="#1d160d" strokeWidth={5} />
            {/* granos de tierra determinísticos */}
            {Array.from({ length: 60 }, (_, i) => {
              const gx = (i * 137) % 1920;
              const gy = groundY + 30 + ((i * 53) % 640);
              const gr = 2 + (i % 3);
              return <circle key={"g" + i} cx={gx} cy={gy} r={gr} fill="#1F1408" opacity={0.5} />;
            })}
          </svg>
        </ParallaxLayer>

        {/* ── CONTENIDO principal (moléculas/raíces/burbujas) ── */}
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="pxsStag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={STAGNANT} stopOpacity={0.85} />
              <stop offset="100%" stopColor="#2E3A2C" stopOpacity={0.95} />
            </linearGradient>
            <radialGradient id="pxsSun" cx="50%" cy="30%">
              <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.9} />
              <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* divisoria punteada entre los dos lados */}
          <line x1={divX} y1={groundY - 40} x2={divX} y2={1030} stroke={COLORS.textDim} strokeWidth={3} strokeDasharray="6 14" opacity={0.5 * enter} />

          {/* ══════════ IZQUIERDA — ENCHARCADA / QUIETA (sin O₂) ══════════ */}
          <g opacity={labIn(24)}>
            {/* charco de agua estancada en superficie */}
            <rect x={90} y={groundY - 26} width={720} height={30} rx={8} fill="url(#pxsStag)" filter="url(#pxs-ripple)" />
            <ellipse cx={450} cy={groundY - 16} rx={330} ry={10} fill="#6A7A63" opacity={0.4} />
            {/* raíz asfixiada: gris-parda, quieta, caída */}
            <g fill="none" stroke="#9E8F6E" strokeLinecap="round" opacity={0.9}>
              <path d={`M 450 ${groundY} C 450 ${groundY + 90}, 420 ${groundY + 160}, 400 ${groundY + 250} C 390 ${groundY + 320}, 396 ${groundY + 380}, 412 ${groundY + 440}`} strokeWidth={9} />
              <path d={`M 450 ${groundY + 30} C 456 ${groundY + 120}, 480 ${groundY + 190}, 512 ${groundY + 280} C 534 ${groundY + 340}, 540 ${groundY + 390}, 532 ${groundY + 448}`} strokeWidth={8} />
              <path d={`M 470 ${groundY + 200} C 500 ${groundY + 226}, 516 ${groundY + 258}, 518 ${groundY + 300}`} strokeWidth={4} opacity={0.8} />
            </g>
            {/* burbujas de gas nocivo atrapadas SIN subir (quietas, temblando) */}
            {Array.from({ length: 6 }, (_, i) => {
              const jx = 260 + i * 90 + Math.sin((frame + i * 40) / 22) * 3;
              const jy = groundY + 180 + ((i * 61) % 260) + Math.cos((frame + i * 30) / 26) * 2;
              return <circle key={"st" + i} cx={jx} cy={jy} r={7 + (i % 2) * 3} fill="#3A462F" opacity={0.55} />;
            })}
            <text x={450} y={groundY - 60} fontSize={34} fontWeight={900} fill={COLORS.danger} textAnchor="middle" style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>
              Encharcada · sin aire
            </text>
          </g>

          {/* ══════════ DERECHA — AIREADA / BURBUJEANTE (con O₂) ══════════ */}
          <g opacity={labIn(30)}>
            {/* plantita sana arriba */}
            <g>
              <line x1={1340} y1={groundY} x2={1340} y2={groundY - 150} stroke="#2f5a23" strokeWidth={9} />
              <path d={`M 1340 ${groundY - 150} C 1292 ${groundY - 186}, 1274 ${groundY - 240}, 1316 ${groundY - 264} C 1334 ${groundY - 216}, 1338 ${groundY - 186}, 1340 ${groundY - 150}`} fill={GREEN} />
              <path d={`M 1340 ${groundY - 150} C 1388 ${groundY - 186}, 1406 ${groundY - 240}, 1364 ${groundY - 264} C 1346 ${groundY - 216}, 1342 ${groundY - 186}, 1340 ${groundY - 150}`} fill={GREEN} opacity={0.92} />
            </g>

            {/* RAÍCES vivas que INHALAN (throb por resorte) */}
            <g
              transform={`translate(1340 ${groundY}) scale(1 ${rootThrob}) translate(-1340 ${-groundY})`}
              fill="none"
              stroke={ROOT}
              strokeLinecap="round"
            >
              <path d={`M 1340 ${groundY} C 1340 ${groundY + 90}, 1300 ${groundY + 150}, 1250 ${groundY + 250} C 1220 ${groundY + 320}, 1210 ${groundY + 380}, 1220 ${groundY + 440}`} strokeWidth={10} />
              <path d={`M 1340 ${groundY} C 1350 ${groundY + 100}, 1400 ${groundY + 160}, 1470 ${groundY + 250} C 1520 ${groundY + 315}, 1540 ${groundY + 380}, 1540 ${groundY + 450}`} strokeWidth={10} />
              <path d={`M 1340 ${groundY + 30} C 1340 ${groundY + 120}, 1340 ${groundY + 200}, 1350 ${groundY + 300} C 1356 ${groundY + 360}, 1358 ${groundY + 410}, 1354 ${groundY + 470}`} strokeWidth={9} />
              <path d={`M 1280 ${groundY + 200} C 1250 ${groundY + 230}, 1232 ${groundY + 258}, 1228 ${groundY + 300}`} strokeWidth={4} opacity={0.85} />
              <path d={`M 1420 ${groundY + 210} C 1452 ${groundY + 236}, 1470 ${groundY + 268}, 1474 ${groundY + 312}`} strokeWidth={4} opacity={0.85} />
            </g>

            {/* halo de "inhalación" alrededor de la raíz que pulsa hacia dentro */}
            <circle cx={1360} cy={groundY + 300} r={200 + inhale * 20} fill="none" stroke={O2} strokeWidth={3} opacity={0.25 * inhale * rootIn} />
            <circle cx={1360} cy={groundY + 300} r={130 + (1 - inhale) * 30} fill="none" stroke={O2} strokeWidth={2} opacity={0.3 * (1 - inhale) * rootIn} />

            {/* BURBUJAS O₂ que suben y son "inhaladas" hacia la raíz */}
            {Array.from({ length: 18 }, (_, i) => {
              const span = 120 + rand(i, 4) * 60;
              const p = ((frame * 1.7 + rand(i, 5) * span + i * 13) % span) / span;
              // convergen hacia el eje de la raíz al subir (inhalación)
              const baseX = 1090 + rand(i) * 520;
              const bx = baseX + (1360 - baseX) * p * (0.3 + inhale * 0.5) + wobble(i, frame, 1.6) * 8;
              const baseY = groundY + 200 + ((i * 41) % 300);
              const by = baseY - p * 120;
              const r = 6 + (i % 3) * 5;
              const op = Math.sin(p * Math.PI) * 0.8 * rootIn;
              return (
                <g key={"o2" + i} opacity={op}>
                  <circle cx={bx} cy={by} r={r} fill={O2} opacity={0.5} />
                  <circle cx={bx} cy={by} r={r} fill="none" stroke={O2} strokeWidth={2.5} />
                  <ellipse cx={bx - r * 0.3} cy={by - r * 0.3} rx={r * 0.35} ry={r * 0.25} fill="#fff" opacity={0.55} />
                </g>
              );
            })}

            <text x={1340} y={groundY - 60} fontSize={34} fontWeight={900} fill={COLORS.accent} textAnchor="middle" style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>
              Aireada · respira O₂
            </text>
          </g>
        </svg>
      </AbsoluteFill>

      {/* burbujas ambientales al frente (muy sutiles, dan profundidad) */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}>
        <ParticleField count={10} kind="bubbles" rise drift={30} width={1920} height={1080} opacity={0.4} />
      </div>

      {/* ── TÍTULO (prop) arriba a la izquierda ── */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 70,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 16}px)`,
        }}
      >
        <RimLight color={COLORS.accentSoft} spread={20} x={0.4} y={0.3}>
          <div style={{ display: "inline-block", background: "rgba(239,231,211,0.92)", border: "1px solid rgba(42,38,32,0.16)", borderRadius: 18, padding: "16px 32px", boxShadow: "0 18px 44px rgba(42,38,32,0.18)" }}>
            <span style={{ fontSize: 58, fontWeight: 800, color: COLORS.text }}>{title}</span>
          </div>
        </RimLight>
      </div>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default PxSoilBreath;
