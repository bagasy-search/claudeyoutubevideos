// Escalones_v8v252t7cjxe.tsx — componente PROPIO del slug (aislado, no toca archivos compartidos).
// TRES ESCALONES en diagonal ascendente (abajo-izquierda → arriba-derecha). Cada escalón trae su
// número enorme, su título, su duración y un pictograma SVG (acostado / sentado al borde / de pie).
// Se ENCIENDEN uno por uno anclados al ms del caption (item.at en FRAMES relativos al inicio del
// beat): el activo va en teal con borde y escala mayor, los que no llegaron quedan apagados y los
// ya pasados quedan marcados en teal tenue. Sobre el activo corre un contador de segundos.
// Look CLÍNICO del canal (teal #12B3AE sobre tinta #0E1B22, Inter). Cero assets externos.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { F_INTER, THEME_MEDICO } from "./kit/premium/theme";

const TEAL = "#12B3AE";
const INK = "#0E1B22";
const CREAM = "#F5F9FA";
const MED = THEME_MEDICO;

export type EscalonItem = {
  n: string;
  title: string;
  secs?: string;
  /** frame (relativo al inicio del componente) en el que este escalón se enciende */
  at: number;
};

// ── Geometría de la escalera (1920×1080) ─────────────────────────────────────
const CARD_W = 860;
const CARD_H = 265;
const POS: { x: number; y: number }[] = [
  { x: 40, y: 755 },
  { x: 530, y: 475 },
  { x: 1020, y: 195 },
];
// Perfil de escalera dibujado por detrás de las tarjetas (se revela a medida que encienden).
const STAIR = "22,1050 22,737 512,737 512,457 1002,457 1002,177 1860,177";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// ── Pictogramas ──────────────────────────────────────────────────────────────
// 0 = persona acostada en una cama · 1 = persona sentada al borde con los pies colgando
// 2 = persona de pie apoyando la mano en un mueble. Línea gruesa, sin texto.
const Picto: React.FC<{ kind: number; color: string; w: number }> = ({
  kind,
  color,
  w,
}) => {
  const common = {
    stroke: color,
    strokeWidth: 6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg
      width={w}
      height={Math.round(w * 0.82)}
      viewBox="0 0 120 100"
      style={{ display: "block", overflow: "visible" }}
    >
      {kind === 0 ? (
        <g {...common}>
          {/* cama */}
          <path d="M10 44 L10 74" />
          <path d="M10 62 L110 62" />
          <path d="M110 62 L110 74" />
          <path d="M18 74 L18 88" />
          <path d="M102 74 L102 88" />
          <path d="M10 74 L110 74" />
          {/* persona acostada */}
          <circle cx="32" cy="46" r="9" />
          <path d="M42 50 L86 50" />
          <path d="M86 50 L100 56" />
        </g>
      ) : null}
      {kind === 1 ? (
        <g {...common}>
          {/* cama, la persona en el borde derecho */}
          <path d="M8 58 L8 72" />
          <path d="M8 58 L74 58" />
          <path d="M8 72 L74 72" />
          <path d="M16 72 L16 88" />
          <path d="M66 72 L66 88" />
          {/* persona sentada, pies colgando */}
          <circle cx="72" cy="22" r="9" />
          <path d="M72 31 L72 55" />
          <path d="M72 55 L96 55" />
          <path d="M96 55 L96 84" />
          <path d="M96 84 L108 84" />
          <path d="M72 38 L88 50" />
        </g>
      ) : null}
      {kind === 2 ? (
        <g {...common}>
          {/* mueble */}
          <path d="M74 52 L116 52" />
          <path d="M80 52 L80 90" />
          <path d="M110 52 L110 90" />
          <path d="M80 70 L110 70" />
          {/* persona de pie, mano apoyada */}
          <circle cx="30" cy="18" r="9" />
          <path d="M30 27 L30 60" />
          <path d="M30 60 L20 90" />
          <path d="M30 60 L42 90" />
          <path d="M30 36 L72 48" />
          <path d="M30 36 L18 58" />
        </g>
      ) : null}
    </svg>
  );
};

export const EscalonesV8: React.FC<{
  durationInFrames: number;
  title?: string;
  items: EscalonItem[];
}> = ({ durationInFrames, title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const list = items.slice(0, 3);
  const n = Math.max(1, list.length);

  // índice ACTIVO = el último escalón cuyo `at` ya pasó
  let active = -1;
  for (let i = 0; i < list.length; i++) if (frame >= list[i].at) active = i;

  // progreso del perfil de escalera (0→1) — avanza un tramo por escalón encendido
  let stair = 0;
  for (let i = 0; i < list.length; i++) {
    stair += (1 / n) * clamp01((frame - list[i].at) / 16);
  }
  stair = clamp01(stair);

  const headIn = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 130 },
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: F_INTER }}>
      {/* degradé clínico sutil + halo teal hacia la esquina que sube */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 100% at 72% 18%, rgba(18,179,174,0.16), rgba(10,20,26,0) 62%), linear-gradient(160deg, #12222A 0%, #0E1B22 52%, #0A151B 100%)",
        }}
      />

      {/* perfil de la escalera por detrás */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <polyline
          points={STAIR}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={STAIR}
          fill="none"
          stroke={TEAL}
          strokeOpacity={0.55}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={`${stair} ${Math.max(0.0001, 1 - stair)}`}
        />
      </svg>

      {/* título arriba a la izquierda */}
      {title ? (
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 74,
            width: 900,
            opacity: headIn,
            transform: `translateY(${(1 - headIn) * 18}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 12,
            }}
          >
            <div
              style={{ width: 44, height: 5, background: TEAL, borderRadius: 3 }}
            />
            <div
              style={{
                color: TEAL,
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: MED.labelSpacing,
                textTransform: "uppercase",
              }}
            >
              Paso a paso
            </div>
          </div>
          <div
            style={{
              color: CREAM,
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -0.8,
            }}
          >
            {title}
          </div>
        </div>
      ) : null}

      {/* los tres escalones */}
      {list.map((it, i) => {
        const pos = POS[i];
        const isActive = i === active;
        const isDone = i < active;
        const isPending = i > active;

        // entrada: todas las tarjetas existen desde el principio (apagadas), entran escalonadas
        const appear = spring({
          frame: frame - i * 5,
          fps,
          config: { damping: 200 },
          durationInFrames: 16,
        });
        // encendido: pop corto y seco cuando le toca (cero fade largo)
        const ignite = spring({
          frame: frame - it.at,
          fps,
          config: { damping: 13, mass: 0.6, stiffness: 210 },
          durationInFrames: 20,
        });

        const scale =
          (0.94 + 0.06 * appear) * (isActive ? 1 + 0.055 * ignite : 1);
        const opacity = appear * (isPending ? 0.3 : isDone ? 0.72 : 1);

        const border = isActive
          ? `4px solid ${TEAL}`
          : isDone
            ? "2px solid rgba(18,179,174,0.42)"
            : "2px solid rgba(255,255,255,0.10)";
        const shadow = isActive
          ? `0 0 0 6px rgba(18,179,174,0.18), 0 28px 70px rgba(0,0,0,0.55)`
          : "0 14px 40px rgba(0,0,0,0.40)";

        const numColor = isActive ? TEAL : isDone ? "rgba(18,179,174,0.72)" : "rgba(255,255,255,0.22)";
        const strokeColor = isActive
          ? TEAL
          : isDone
            ? "rgba(18,179,174,0.60)"
            : "rgba(255,255,255,0.26)";
        const titleColor = isActive
          ? CREAM
          : isDone
            ? "rgba(245,249,250,0.80)"
            : "rgba(245,249,250,0.46)";

        // ── contador de segundos sobre el escalón activo ──────────────────────
        const end = i + 1 < list.length ? list[i + 1].at : durationInFrames;
        const raw = it.secs ?? "";
        const m = raw.match(/(\d+)/);
        const target = m ? parseInt(m[1], 10) : 0;
        const unit = m ? raw.replace(m[1], "").trim() : "";
        const runTo = Math.max(it.at + 10, end - 6);
        const run = clamp01(
          interpolate(frame, [it.at + 3, runTo], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        );
        let chip = raw;
        if (m) {
          const shown = isPending ? 0 : isDone ? target : Math.round(target * run);
          chip = unit ? `${shown} ${unit}` : `${shown}`;
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: CARD_W,
              height: CARD_H,
              opacity,
              transform: `translateY(${(1 - appear) * 26}px) scale(${scale})`,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                borderRadius: MED.radius,
                border,
                boxShadow: shadow,
                background: isActive
                  ? "linear-gradient(135deg, rgba(18,179,174,0.16), rgba(255,255,255,0.04))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 40px",
                overflow: "hidden",
              }}
            >
              {/* número enorme */}
              <div
                style={{
                  flex: "0 0 auto",
                  width: 140,
                  textAlign: "center",
                  fontSize: 158,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: numColor,
                  letterSpacing: -6,
                  textShadow: isActive ? `0 0 42px ${MED.color.glow}` : "none",
                }}
              >
                {it.n}
              </div>

              {/* título + duración */}
              <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    lineHeight: 1.14,
                    color: titleColor,
                    letterSpacing: -0.4,
                  }}
                >
                  {it.title}
                </div>
                {chip ? (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginTop: 16,
                      padding: "8px 20px",
                      borderRadius: 999,
                      background: isActive
                        ? TEAL
                        : isDone
                          ? "rgba(18,179,174,0.18)"
                          : "rgba(255,255,255,0.07)",
                      color: isActive
                        ? "#04211F"
                        : isDone
                          ? "rgba(18,179,174,0.95)"
                          : "rgba(245,249,250,0.42)",
                      fontSize: 34,
                      fontWeight: 900,
                      letterSpacing: 0.4,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {chip}
                  </div>
                ) : null}
              </div>

              {/* pictograma */}
              <div style={{ flex: "0 0 auto", width: 140, opacity: isPending ? 0.75 : 1 }}>
                <Picto kind={i} color={strokeColor} w={140} />
              </div>

              {/* barra de progreso del escalón activo */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 6,
                  width: `${(isDone ? 1 : isActive ? run : 0) * 100}%`,
                  background: TEAL,
                  opacity: isDone ? 0.4 : 1,
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default EscalonesV8;
