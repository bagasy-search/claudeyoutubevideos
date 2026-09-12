import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  DepthShadow,
  Frame3D,
  InkDraw,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// AnnotatedPhotoKit — foto/figura enmarcada con ANOTACIONES a mano (círculos de
// tinta, flechas y notas) que se van dibujando sobre puntos de interés, como si
// un maestro marcara una lámina de almanaque con su pluma.
//
// PROP-DRIVEN + DEFAULTS: sin props renderiza una lámina genérica con 2 marcas.
// GENÉRICO: sirve para huerta ("hoja enferma"), reparación ("junta gastada") o
// amish ("pieza del mecanismo") — el tema entra por image/annotations/title.
// RENDER-SAFE: nada de Date.now()/Math.random(); azar = rand(i), drift = wobble.
// ═══════════════════════════════════════════════════════════════════════════

type Anno = { x: number; y: number; text: string; kind?: "circle" | "arrow" };

// Resuelve una fuente de imagen: rutas relativas de public/ → staticFile;
// URLs absolutas (http/data) se dejan tal cual. undefined → placeholder dibujado.
const resolveSrc = (src?: string): string | null => {
  if (!src) return null;
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  try {
    return staticFile(src);
  } catch {
    return src;
  }
};

export const AnnotatedPhotoKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  image?: string;
  annotations?: Anno[];
}> = ({
  durationInFrames,
  title = "La marca reveladora",
  subtitle = "Mirá con atención",
  accent = COLORS.amber,
  image,
  annotations = [
    { x: 34, y: 40, text: "Acá empieza el daño", kind: "circle" },
    { x: 68, y: 62, text: "Seguí esta línea", kind: "arrow" },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.9, stiffness: 110 } });

  // Lienzo de la foto dentro del viewBox 1600x900 del SVG de anotaciones.
  const VB_W = 1600;
  const VB_H = 900;
  // Marco de la foto (en px del contenedor de layout, luego el SVG va encima al 100%).
  const photoW = 1040;
  const photoH = 660;

  const src = resolveSrc(image);

  // convierte coord % (0..100) de una anotación → px del viewBox del SVG.
  const px = (x: number) => (x / 100) * VB_W;
  const py = (y: number) => (y / 100) * VB_H;

  // círculo "a mano": path elíptico ligeramente irregular alrededor del punto.
  const handCircle = (cx: number, cy: number, i: number) => {
    const rx = 82 + rand(i, 1) * 26;
    const ry = 64 + rand(i, 2) * 22;
    const tilt = (rand(i, 3) - 0.5) * 0.5;
    // dos "vueltas" abiertas (empieza y termina desfasado) para look de lapicera.
    const p: string[] = [];
    const turns = 1.15;
    const steps = 40;
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * turns * Math.PI * 2 - Math.PI * 0.35;
      const wob = 1 + Math.sin(t * 3 + i) * 0.04 + (rand(i, s) - 0.5) * 0.05;
      const ex = cx + Math.cos(t + tilt) * rx * wob;
      const ey = cy + Math.sin(t + tilt) * ry * wob;
      p.push(`${s === 0 ? "M" : "L"} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
    }
    return p.join(" ");
  };

  // flecha "a mano": tallo curvo hacia el punto + dos barbas.
  const handArrow = (cx: number, cy: number, i: number) => {
    const sgn = cx > VB_W / 2 ? 1 : -1;
    const sx = cx + sgn * 210;
    const sy = cy - 150;
    const stem = `M ${sx} ${sy} C ${sx - sgn * 60} ${sy + 60}, ${cx + sgn * 90} ${cy - 90}, ${cx + sgn * 26} ${cy - 20}`;
    const head1 = `M ${cx + sgn * 26} ${cy - 20} l ${sgn * 34} ${-8}`;
    const head2 = `M ${cx + sgn * 26} ${cy - 20} l ${sgn * 12} ${28}`;
    return { stem, head1, head2, sx, sy };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="anno" />

      {/* Fondos parallax: pergamino + viñeta cálida + rayos de taller */}
      <ParallaxLayer depth={0.15} driftY={10}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(120% 90% at 50% 18%, ${COLORS.bg1} 0%, ${COLORS.bg0} 45%, ${COLORS.bg2} 100%)`,
          }}
        />
      </ParallaxLayer>
      <GodRays x={62} y={-12} angle={20} color="rgba(169,121,74,0.18)" rays={6} />
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 100% at 50% 46%, rgba(0,0,0,0) 52%, rgba(42,38,32,0.30) 100%)",
        }}
      />

      {/* Título superior */}
      <div
        style={{
          position: "absolute",
          top: 66,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * -18}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: accent,
            fontWeight: 700,
          }}
        >
          {subtitle}
        </div>
        <div style={{ fontSize: 62, fontWeight: 800, color: COLORS.text, marginTop: 4 }}>{title}</div>
      </div>

      {/* La foto enmarcada, centrada, con perspectiva y sombra 3D */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 40 }}>
        <div style={{ position: "relative", width: photoW, height: photoH }}>
          <Frame3D at={0} rotateY={-7} rotateX={3} depth={40} perspective={1500}>
            <DepthShadow layers={6} distance={54} radius={10} color="rgba(42,38,32,0.30)">
              <div
                style={{
                  width: photoW,
                  height: photoH,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "14px solid #efe7d3",
                  boxShadow: "inset 0 0 0 2px rgba(42,38,32,0.22), inset 0 0 60px rgba(42,38,32,0.22)",
                  background: COLORS.bg2,
                  position: "relative",
                }}
              >
                {src ? (
                  <Img
                    src={src}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "saturate(0.9) sepia(0.12) contrast(1.02)",
                    }}
                  />
                ) : (
                  // Placeholder OPACO: panel de pergamino con grano de papel + marco
                  // tenue + una "lámina" grabada, para que las anotaciones se apoyen
                  // sobre algo (nunca sobre blanco/vacío) cuando no se pasa `image`.
                  <AbsoluteFill>
                    <svg viewBox="0 0 1040 660" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
                      <defs>
                        <radialGradient id="annoPh" cx="46%" cy="40%">
                          <stop offset="0%" stopColor={COLORS.bg0} />
                          <stop offset="100%" stopColor={COLORS.bg2} />
                        </radialGradient>
                      </defs>
                      {/* fondo sólido de pergamino (opaco) */}
                      <rect width="1040" height="660" fill="url(#annoPh)" />
                      {/* renglones tenues de cuaderno */}
                      <g stroke={COLORS.amber} strokeWidth={2.5} opacity={0.28} fill="none">
                        {Array.from({ length: 9 }, (_, i) => (
                          <line key={i} x1={40} y1={70 + i * 70} x2={1000} y2={70 + i * 70} />
                        ))}
                      </g>
                      {/* marco interior tenue */}
                      <rect x={26} y={26} width={988} height={608} rx={10} fill="none" stroke={COLORS.textDim} strokeWidth={2.5} strokeDasharray="8 10" />
                      {/* lámina grabada (hoja de referencia) */}
                      <g transform="translate(520 330)">
                        <path d="M0 150 C 60 60, 120 20, 130 -140 C 150 40, 60 90, 0 150 Z" fill={COLORS.good} opacity={0.85} />
                        <path d="M0 150 C -60 60, -120 20, -130 -140 C -150 40, -60 90, 0 150 Z" fill={COLORS.accent} opacity={0.9} />
                        <line x1={0} y1={150} x2={0} y2={-150} stroke={COLORS.amber} strokeWidth={9} />
                      </g>
                      <text x={520} y={624} textAnchor="middle" fontFamily={FONT_STACK} fontSize={30} fill={COLORS.textDim} fontStyle="italic">
                        Fig. — lámina de referencia
                      </text>
                    </svg>
                    {/* grano de papel sobre el placeholder */}
                    <PaperGrain opacity={0.14} scale={1.0} seed={13} blend="multiply" />
                  </AbsoluteFill>
                )}
                {/* grano y luz sobre la foto para integrarla al papel */}
                <PaperGrain opacity={0.1} scale={1.1} blend="multiply" />
                <AbsoluteFill
                  style={{
                    background: "linear-gradient(120deg, rgba(255,244,214,0.16) 0%, rgba(0,0,0,0) 40%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </DepthShadow>
          </Frame3D>

          {/* Chinche de latón arriba (detalle de "clavada al panel") */}
          <div
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%)",
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #d8b56a, #8a6a2e 70%, #5a4520)",
              boxShadow: "0 6px 12px rgba(42,38,32,0.4)",
              opacity: enter,
            }}
          />

          {/* CAPA DE ANOTACIONES — SVG absoluto encima de la foto, mismo box */}
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            {annotations.map((a, i) => {
              const cx = px(a.x);
              const cy = py(a.y);
              const at = 0.55 + i * 0.85; // aparecen escalonadas
              const kind = a.kind ?? "circle";
              // pulso idle sutil de la nota
              const idle = 1 + wobble(i, frame, 0.6) * 0.02;
              const noteOpacity = spring({
                frame: frame - sec(at + 0.35),
                fps,
                config: { damping: 18, stiffness: 120 },
              });
              const noteSide = cx > VB_W / 2 ? 1 : -1;
              const labelX = cx + (kind === "arrow" ? noteSide * 214 : noteSide * 122);
              const labelY = kind === "arrow" ? cy - 168 : cy - 96;

              return (
                <g key={i} filter="url(#anno-rough)">
                  {kind === "circle" ? (
                    <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${idle})` }}>
                      <InkDraw
                        d={handCircle(cx, cy, i)}
                        at={sec(at)}
                        duration={sec(0.7)}
                        color={accent}
                        width={7}
                        length={720}
                        dropShadow
                      />
                    </g>
                  ) : (
                    (() => {
                      const arw = handArrow(cx, cy, i);
                      return (
                        <g>
                          <InkDraw d={arw.stem} at={sec(at)} duration={sec(0.6)} color={accent} width={7} length={520} dropShadow />
                          <InkDraw d={arw.head1} at={sec(at + 0.45)} duration={sec(0.18)} color={accent} width={7} length={60} />
                          <InkDraw d={arw.head2} at={sec(at + 0.45)} duration={sec(0.18)} color={accent} width={7} length={60} />
                        </g>
                      );
                    })()
                  )}

                  {/* nota de texto con "cinta" de papel */}
                  <g
                    opacity={noteOpacity}
                    transform={`translate(${labelX} ${labelY}) scale(${interpolate(noteOpacity, [0, 1], [0.8, 1])})`}
                  >
                    <g transform={`translate(${noteSide < 0 ? -1 : 0} 0)`}>
                      <rect
                        x={noteSide < 0 ? -Math.max(220, a.text.length * 17) : 0}
                        y={-34}
                        width={Math.max(220, a.text.length * 17)}
                        height={62}
                        rx={8}
                        fill="#f3ecd6"
                        stroke="rgba(42,38,32,0.2)"
                        strokeWidth={2}
                        style={{ filter: "drop-shadow(0 6px 10px rgba(42,38,32,0.28))" }}
                      />
                      <text
                        x={noteSide < 0 ? -Math.max(220, a.text.length * 17) + 18 : 18}
                        y={6}
                        fontFamily={FONT_STACK}
                        fontSize={30}
                        fontWeight={700}
                        fill={COLORS.text}
                      >
                        {a.text}
                      </text>
                    </g>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </AbsoluteFill>

      {/* Motas de polvo en el aire del taller (frente, deja libre la esq. inf. der.) */}
      <ParticleField count={16} kind="dust" rise drift={26} opacity={0.5} />
      <PaperGrain opacity={0.08} scale={0.85} blend="multiply" />
    </AbsoluteFill>
  );
};

export default AnnotatedPhotoKit;
