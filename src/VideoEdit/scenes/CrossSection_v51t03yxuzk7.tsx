import { Fragment } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";

// Variante de CrossSection para el video del sótano (v51t03yxuzk7).
// Por qué existe: el CrossSection del kit mueve el corte con una follow-cam que hace zoom
// capa por capa. En un corte de 3 bandas el encuadre sube y las bandas terminan pisando el
// título, que queda ilegible (visto en la cuadrícula de auditoría, frame 61030). Acá el corte
// se queda QUIETO y centrado: el título respira arriba y las etiquetas caen a la derecha.
// El resto de la coreografía (bandas que bajan una por una, líneas guía, marcador vertical)
// es la misma, porque es lo que hace que se entienda el muro enterrado.
export type LayerV51 = {
  label: string;
  depth?: string;
  color: string;
  weight?: number;
};

const BOX_W = 1500;
const BOX_H = 820;

export const CrossSectionV51: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  layers: LayerV51[];
  marker?: { label?: string; atDepth?: number; color?: keyof typeof TONES } | null;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number;
  stagger?: number;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  layers,
  marker = null,
  hue = "amber",
  startAt = sec(0.35),
  stagger = sec(0.55),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });

  // headroom real para el título (antes 200 con la cámara encima)
  const plotTop = title || eyebrow ? 285 : 110;
  const plotBottom = BOX_H - 60;
  const plotH = plotBottom - plotTop;
  // corte más ancho y corrido al centro-izquierda, con sitio para las etiquetas a la derecha
  const colX = 300;
  const colW = 560;

  const totalW = layers.reduce((s, l) => s + (l.weight ?? 1), 0);
  let acc = 0;
  const bands = layers.map((l, i) => {
    const w = l.weight ?? 1;
    const y = plotTop + (acc / totalW) * plotH;
    const h = (w / totalW) * plotH;
    acc += w;
    return { ...l, y, h, i };
  });

  const markerStart = startAt + layers.length * stagger + sec(0.2);
  const markerDraw = marker
    ? spring({ frame: frame - markerStart, fps, config: { damping: 200, mass: 1, stiffness: 55 } })
    : 0;
  const markerColor = marker ? TONES[marker.color ?? "accent"] : COLORS.accent;
  const markerX = colX + colW * Math.min(0.85, Math.max(0.15, (marker?.atDepth ?? 1.5) / Math.max(2, layers.length)));

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} glowY={44} drift={0.4}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <SfxCue at={Math.max(0, startAt - sec(0.3))} src={SFX.transition} volume={0.4} />

        {(eyebrow || title) && (
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 60,
              right: 60,
              textAlign: "center",
              zIndex: 5,
              opacity: head,
              transform: `translateY(${(1 - head) * -12}px)`,
            }}
          >
            {eyebrow && (
              <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: COLORS.textDim }}>
                {eyebrow}
              </div>
            )}
            {title && <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.text, marginTop: 10, lineHeight: 1.18 }}>{title}</div>}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <clipPath id="csClipV51">
              <rect x={colX} y={plotTop} width={colW} height={plotH} rx={20} />
            </clipPath>
          </defs>

          <rect
            x={colX}
            y={plotTop}
            width={colW}
            height={plotH}
            rx={20}
            fill="rgba(42,38,32,0.05)"
            stroke="rgba(42,38,32,0.14)"
            strokeWidth={1.5}
            opacity={head}
          />

          <g clipPath="url(#csClipV51)">
            {bands.map((b) => {
              const t0 = startAt + b.i * stagger;
              const s = spring({ frame: frame - t0, fps, config: SPRING_SNAPPY });
              const reveal = interpolate(s, [0, 1], [0, b.h], { extrapolateRight: "clamp" });
              return (
                <g key={b.i} opacity={s}>
                  <rect x={colX} y={b.y} width={colW} height={reveal} fill={b.color} />
                  <line x1={colX} x2={colX + colW} y1={b.y + b.h} y2={b.y + b.h} stroke="rgba(0,0,0,0.25)" strokeWidth={2} opacity={s} />
                </g>
              );
            })}
          </g>

          {marker && (
            <g>
              <line
                x1={markerX}
                y1={plotTop}
                x2={markerX}
                y2={plotTop + plotH * markerDraw}
                stroke={markerColor}
                strokeWidth={12}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 10px ${markerColor}aa)` }}
              />
              <circle cx={markerX} cy={plotTop + plotH * markerDraw} r={10 * markerDraw} fill={markerColor} />
            </g>
          )}

          {bands.map((b) => {
            const t0 = startAt + b.i * stagger + sec(0.15);
            const s = spring({ frame: frame - t0, fps, config: SPRING_SOFT });
            const cy = b.y + b.h / 2;
            const lx = colX + colW + 34;
            return (
              <g key={"lbl" + b.i} opacity={s} transform={`translate(${(1 - s) * 20} 0)`}>
                <line x1={colX + colW} x2={lx} y1={cy} y2={cy} stroke={COLORS.textDim} strokeWidth={2} />
                <circle cx={colX + colW} cy={cy} r={5} fill={b.color} />
                <text x={lx + 12} y={cy - 4} fontSize={30} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>
                  {b.label}
                </text>
                {b.depth && (
                  <text x={lx + 12} y={cy + 28} fontSize={21} fontWeight={600} fill={COLORS.textDim} fontFamily={FONT_STACK}>
                    {b.depth}
                  </text>
                )}
              </g>
            );
          })}

          {marker?.label && (
            <text
              x={markerX}
              y={plotTop - 16}
              textAnchor="middle"
              fontSize={24}
              fontWeight={800}
              fill={markerColor}
              fontFamily={FONT_STACK}
              opacity={markerDraw}
            >
              {marker.label}
            </text>
          )}
        </svg>

        {bands.map((b) => (
          <Fragment key={"sfx" + b.i}>
            <SfxCue at={startAt + b.i * stagger} src={SFX.layerDrop} volume={0.48} />
          </Fragment>
        ))}
        {marker && <SfxCue at={markerStart} src={SFX.markerDrive} volume={0.5} durationInFrames={sec(1.0)} />}
      </div>
    </SceneFrame>
  );
};

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;
