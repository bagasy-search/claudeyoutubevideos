// Porcelain.tsx — la MATERIA compartida del video `mdtoilet` (canal Mike Dalton, EN).
//
// El video entero se apoya en un solo objeto: la PORCELANA en corte. La taza, la curva en S,
// el canal del borde y sus agujeros son SIEMPRE el mismo dibujo, visto desde distintas
// distancias, para que los cinco movimientos se lean como un solo aparato desarmado despacio.
//
// ⛔ NADIE edita este archivo desde un movimiento. Si un movimiento necesita algo propio, lo
// define en SU archivo. El escenario (aire, cámara, luz, vidrio, costuras) viene de
// `../mdmold/Stage` — es el mismo baño del canal, no se re-inventa.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, rnd, F_SANS } from "../mdmold/Stage";

// paleta propia de este video: la porcelana y el agua. El acento sigue siendo el rojo del canal.
export const PT = {
  china: "#E8E6E1",      // porcelana iluminada
  chinaDim: "#8E8C88",   // porcelana en sombra
  chinaDark: "#3A3B3E",  // el hueco de la porcelana
  water: "#7FB2C9",      // el agua limpia del tanque
  waterDim: "#3C5C6B",
  film: "#6B5A3E",       // el biofilm: marrón-ocre sucio, NO verde (esto no es moho)
  filmLit: "#A08658",
  scale: "#CFC6B2",      // el sarro, blanco tiza
};

// ── EL CORTE DE LA TAZA ─────────────────────────────────────────────────────────────────────
// viewBox 0 0 640 560. Todo el video usa ESTAS coordenadas: cuando un movimiento hace zoom a
// un agujero del borde, hace zoom a un punto que existe de verdad en este dibujo.
export const BOWL_CAVITY =
  "M118,132 C118,262 190,352 300,352 C410,352 494,262 494,132";
export const TRAP_PIPE =
  "M300,356 C346,392 382,392 408,360 C430,332 434,296 431,266 C428,228 450,208 474,228 C500,250 506,306 506,372 L506,500";
// el canal del borde: el anillo hueco que corre por debajo de la pestaña
export const RIM_CHANNEL_L = "M104,118 L150,118 L150,146 L104,146 Z";
export const RIM_CHANNEL_R = "M462,118 L508,118 L508,146 L462,146 Z";
// los agujeros del borde, en coordenadas del mismo dibujo
export const JET_XS = [128, 168, 214, 262, 312, 360, 406, 450, 486];

/**
 * La taza en corte. `water` 0→1 es el nivel dentro de la taza; `trap` 0→1 es cuánto avanzó el
 * agua por la curva en S (cuando llega a 1, arranca el sifón). `film` 0→1 pinta el aro vivo.
 */
export const BowlCutaway: React.FC<{
  water?: number;
  trap?: number;
  film?: number;
  jetGlow?: number;
  lit?: number;
  scaleRing?: number;
}> = ({ water = 0.34, trap = 0, film = 0, jetGlow = 0, lit = 1, scaleRing = 0 }) => {
  const frame = useCurrentFrame();
  const yTop = 132, yBot = 352;
  const wy = lerp(yBot, yTop + 26, clamp01(water));
  const ripple = Math.sin(frame / 9) * 1.6 + Math.sin(frame / 5.5) * 0.8;
  const LEN = 470; // largo aproximado del caño para el dash
  return (
    <svg viewBox="0 0 640 560" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="pt_china" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PT.china} stopOpacity={0.95 * lit} />
          <stop offset="58%" stopColor={PT.chinaDim} stopOpacity={0.8 * lit} />
          <stop offset="100%" stopColor="#54565A" stopOpacity={0.9 * lit} />
        </linearGradient>
        <linearGradient id="pt_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PT.water} stopOpacity={0.85} />
          <stop offset="100%" stopColor={PT.waterDim} stopOpacity={0.7} />
        </linearGradient>
        <clipPath id="pt_bowlclip">
          <path d={`${BOWL_CAVITY} L494,560 L118,560 Z`} />
        </clipPath>
        <filter id="pt_soft"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* cuerpo de la porcelana: dos paredes gruesas con el hueco en el medio */}
      <path d={BOWL_CAVITY} fill="none" stroke="url(#pt_china)" strokeWidth={26} strokeLinecap="round" />
      <path d={TRAP_PIPE} fill="none" stroke="url(#pt_china)" strokeWidth={40} strokeLinecap="round" />
      {/* el hueco del caño, oscuro, para que se lea como conducto y no como barra */}
      <path d={TRAP_PIPE} fill="none" stroke={PT.chinaDark} strokeWidth={22} strokeLinecap="round" />

      {/* agua dentro de la taza */}
      <g clipPath="url(#pt_bowlclip)">
        <rect x={100} y={wy + ripple} width={440} height={300} fill="url(#pt_water)" />
        <rect x={100} y={wy + ripple} width={440} height={3} fill={rgba(MD.white, 0.5)} />
      </g>

      {/* agua subiendo por la curva en S — el dash es el frente de agua */}
      {trap > 0 && (
        <path
          d={TRAP_PIPE}
          fill="none"
          stroke={PT.water}
          strokeWidth={20}
          strokeLinecap="round"
          strokeDasharray={`${LEN * clamp01(trap)} ${LEN}`}
          opacity={0.92}
        />
      )}

      {/* el aro vivo al nivel del agua */}
      {film > 0 && (
        <g clipPath="url(#pt_bowlclip)" opacity={clamp01(film)}>
          <rect x={100} y={wy - 16} width={440} height={22} fill={PT.film} opacity={0.85} />
          <rect x={100} y={wy - 16} width={440} height={5} fill={PT.filmLit} opacity={0.7} />
        </g>
      )}

      {/* el sarro: una repisa dura, más clara, que sobresale */}
      {scaleRing > 0 && (
        <g clipPath="url(#pt_bowlclip)" opacity={clamp01(scaleRing)}>
          <rect x={100} y={wy - 24} width={440} height={12} fill={PT.scale} opacity={0.8} />
        </g>
      )}

      {/* el canal del borde, a los dos lados */}
      <path d={RIM_CHANNEL_L} fill={PT.chinaDark} stroke={rgba(PT.china, 0.5 * lit)} strokeWidth={3} />
      <path d={RIM_CHANNEL_R} fill={PT.chinaDark} stroke={rgba(PT.china, 0.5 * lit)} strokeWidth={3} />

      {/* los agujeros bajo la pestaña + su chorro cuando el canal está cargado */}
      {JET_XS.map((x, i) => {
        const g = clamp01(jetGlow - i * 0.03);
        return (
          <g key={i}>
            <ellipse cx={x} cy={148} rx={6} ry={3.4} fill={PT.chinaDark} />
            {g > 0 && (
              <>
                <ellipse cx={x} cy={148} rx={7} ry={4} fill={PT.water} opacity={0.8 * g} />
                <path
                  d={`M${x},150 C${x + (x < 306 ? 6 : -6)},${180 + g * 40} ${x + (x < 306 ? 12 : -12)},${210 + g * 60} ${x + (x < 306 ? 16 : -16)},${236 + g * 70}`}
                  stroke={PT.water}
                  strokeWidth={3.2}
                  fill="none"
                  opacity={0.55 * g}
                  strokeLinecap="round"
                />
              </>
            )}
          </g>
        );
      })}

      {/* rebote de luz sobre la porcelana: la hace cerámica y no plástico */}
      <path d={BOWL_CAVITY} fill="none" stroke={rgba(MD.white, 0.22 * lit)} strokeWidth={4} filter="url(#pt_soft)" />
    </svg>
  );
};

// ── EL CANAL DEL BORDE, POR DENTRO ──────────────────────────────────────────────────────────
// Un túnel: paredes húmedas, techo bajo, y los agujeros como bocas de luz en el piso.
export const RimTunnel: React.FC<{ depth?: number; wet?: number; film?: number; lightAt?: number }> = ({
  depth = 0, wet = 1, film = 0, lightAt = 0.5,
}) => {
  const frame = useCurrentFrame();
  const z = lerp(0, 240, clamp01(depth));
  return (
    <AbsoluteFill style={{ perspective: 1200, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${z}px)` }}>
        {/* anillos del túnel: 9 arcos a distinta profundidad = el canal que se pierde en la curva */}
        {Array.from({ length: 9 }, (_, i) => {
          const k = i / 8;
          const s = 1 - k * 0.62;
          const o = (1 - k) * 0.9;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%", top: "50%",
                width: `${86 * s}%`, height: `${58 * s}%`,
                transform: `translate(-50%,-50%) translateY(${k * -40}px) rotateX(${6 + k * 10}deg)`,
                borderRadius: "46% 46% 22% 22% / 60% 60% 30% 30%",
                border: `2px solid ${rgba(PT.china, 0.10 + o * 0.16)}`,
                background: `linear-gradient(180deg, ${rgba(PT.chinaDark, 0.0)} 0%, ${rgba("#101114", 0.5 + k * 0.4)} 100%)`,
                boxShadow: `inset 0 ${8 + k * 20}px ${30 + k * 40}px rgba(0,0,0,${0.4 + k * 0.4})`,
              }}
            />
          );
        })}
        {/* humedad: brillos que respiran sobre la pared del canal */}
        {wet > 0 &&
          Array.from({ length: 16 }, (_, i) => {
            const s = rnd(i * 5.3);
            const b = 0.5 + Math.sin(frame / (22 + s * 30) + i) * 0.5;
            return (
              <div
                key={"w" + i}
                style={{
                  position: "absolute",
                  left: `${12 + s * 76}%`,
                  top: `${26 + rnd(i * 2.1) * 44}%`,
                  width: 3 + s * 6,
                  height: 2 + s * 4,
                  borderRadius: "50%",
                  background: rgba(MD.white, (0.10 + b * 0.22) * wet),
                  filter: "blur(0.4px)",
                }}
              />
            );
          })}
        {/* el biofilm: manchones ocres pegados al techo del canal */}
        {film > 0 &&
          Array.from({ length: 12 }, (_, i) => {
            const s = rnd(i * 9.1);
            return (
              <div
                key={"f" + i}
                style={{
                  position: "absolute",
                  left: `${8 + s * 80}%`,
                  top: `${18 + rnd(i * 3.3) * 40}%`,
                  width: 26 + s * 70,
                  height: 14 + s * 30,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${rgba(PT.film, 0.6 * film)} 0%, rgba(0,0,0,0) 72%)`,
                  filter: "blur(2px)",
                }}
              />
            );
          })}
        {/* las bocas de luz: los agujeros vistos desde adentro */}
        {Array.from({ length: 5 }, (_, i) => {
          const k = i / 4;
          const on = clamp01((lightAt - k) * 3);
          return (
            <div
              key={"h" + i}
              style={{
                position: "absolute",
                left: `${16 + k * 68}%`,
                top: `${62 - k * 12}%`,
                width: 46 - k * 22,
                height: 22 - k * 10,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${rgba(PT.water, 0.75 * on)} 0%, ${rgba(PT.water, 0.12 * on)} 60%, rgba(0,0,0,0) 74%)`,
                boxShadow: `0 0 ${40 * on}px ${14 * on}px ${rgba(PT.water, 0.22 * on)}`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── TEXTO EN BLOQUES SEMÁNTICOS ─────────────────────────────────────────────────────────────
// El texto sigue a la voz por BLOQUES, nunca letra por letra ni todo junto.
export const Blocks: React.FC<{
  at: number;
  items: { t: string; em?: boolean; size?: number; gap?: number }[];
  color?: string;
  align?: "left" | "center";
  stepEvery?: number;
}> = ({ at, items, color = MD.white, align = "left", stepEvery = 22 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: 6 }}>
      {items.map((it, i) => {
        const a = at + i * stepEvery;
        const p = clamp01((frame - a) / 16);
        if (p <= 0) return null;
        const y = interpolate(p, [0, 1], [16, 0], { easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
        const blur = interpolate(p, [0, 1], [7, 0]);
        return (
          <div
            key={i}
            style={{
              opacity: p,
              transform: `translateY(${y.toFixed(2)}px)`,
              filter: `blur(${blur.toFixed(2)}px)`,
              marginTop: it.gap || 0,
              fontFamily: it.em ? "'Playfair Display', Georgia, serif" : F_SANS,
              fontStyle: it.em ? "italic" : "normal",
              fontWeight: it.em ? 500 : 800,
              fontSize: it.size || (it.em ? 78 : 62),
              lineHeight: 1.06,
              letterSpacing: it.em ? 0 : -0.6,
              color: it.em ? MD.redHot : color,
              textShadow: "0 8px 34px rgba(0,0,0,0.92), 0 2px 8px rgba(0,0,0,0.85)",
              textAlign: align,
            }}
          >
            {it.t}
          </div>
        );
      })}
    </div>
  );
};
