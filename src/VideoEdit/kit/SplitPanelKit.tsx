import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  DepthShadow,
  Frame3D,
  InkDraw,
  SvgFilters,
  wobble,
} from "./depth";

// ══════════════════════════════════════════════════════════════════════════════
// SplitPanelKit — PANEL DIVIDIDO con profundidad real.
// Un lado: una IMAGEN/figura levantada del papel con marco 3D en perspectiva
// (Frame3D) sobre una tarjeta de pergamino con sombra multicapa. El otro lado:
// un encabezado serif grande + bullets con viñetas de tinta que se dibujan una a
// una (InkDraw) y flotan con sombra de profundidad.
//
// PROP-DRIVEN — el TEMA entra por props: sirve igual para
//   • huerta: image=hoja, heading="Por qué el acolchado funciona", points=[...]
//   • reparación: image=junta, heading="Anatomía de la fuga"
//   • amish: image=rueda, heading="El mecanismo de siempre"
// Renderiza SOLO sin props con defaults genéricos + una figura SVG de marca
// (un sol/planta de almanaque) cuando no hay `image`.
// ══════════════════════════════════════════════════════════════════════════════

export const SplitPanelKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  image?: string;
  heading?: string;
  points?: string[];
  imageSide?: "left" | "right";
}> = ({
  durationInFrames,
  title,
  subtitle,
  accent = COLORS.amber,
  image,
  heading = "El principio de siempre",
  points = [
    "Guarda la humedad en la tierra durante días.",
    "Alimenta la vida del suelo mientras se descompone.",
    "Frena la maleza sin una sola gota de químico.",
  ],
  imageSide = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  // salida suave al final para que el corte no sea plano
  const outStart = durationInFrames - sec(0.5);
  const exit = interpolate(frame, [outStart, durationInFrames], [1, 0.86], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imgOnLeft = imageSide === "left";

  // idle breathing sutil de toda la composición
  const bob = Math.sin(frame / 120) * 4;

  // ── FIGURA de marca por defecto (sin `image`): sol de almanaque + planta,
  //    dibujada a tinta, para que renderice sola con look de marca.
  const brandFigure = (
    <svg viewBox="0 0 520 620" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        <radialGradient id="spk-sun" cx="50%" cy="42%">
          <stop offset="0%" stopColor="#F4E7C6" />
          <stop offset="55%" stopColor={COLORS.bg1} />
          <stop offset="100%" stopColor={COLORS.bg2} />
        </radialGradient>
        <linearGradient id="spk-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4428" />
          <stop offset="100%" stopColor="#3a2b1c" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={520} height={620} fill="url(#spk-sun)" />
      {/* sol grabado con rayos */}
      <g transform="translate(260 190)">
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const r0 = 92 + (i % 2 === 0 ? 0 : 8);
          const r1 = r0 + 34 + wobble(i, frame, 0.5) * 4;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r0}
              y1={Math.sin(a) * r0}
              x2={Math.cos(a) * r1}
              y2={Math.sin(a) * r1}
              stroke={accent}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.75}
            />
          );
        })}
        <circle cx={0} cy={0} r={80} fill={accent} opacity={0.9} />
        <circle cx={0} cy={0} r={80} fill="none" stroke="#000" strokeOpacity={0.18} strokeWidth={3} />
        <circle cx={-22} cy={-24} r={26} fill="#fff" opacity={0.22} />
      </g>
      {/* suelo */}
      <rect x={0} y={470} width={520} height={150} fill="url(#spk-soil)" />
      <line x1={0} y1={470} x2={520} y2={470} stroke="#1d160d" strokeWidth={4} />
      {/* planta a tinta que se dibuja */}
      <g transform="translate(260 470)">
        <InkDraw d="M 0 0 C -4 -70 -6 -150 0 -230" at={sec(0.5)} duration={sec(1.1)} color={COLORS.good} width={9} length={260} />
        <InkDraw
          d="M 0 -120 C -60 -140 -96 -190 -70 -240 C -30 -206 -8 -170 0 -130"
          at={sec(1.1)}
          duration={sec(0.7)}
          color={COLORS.good}
          width={5}
          length={280}
          fill={COLORS.accentSoft}
        />
        <InkDraw
          d="M 0 -150 C 60 -170 96 -220 70 -270 C 30 -236 8 -200 0 -160"
          at={sec(1.4)}
          duration={sec(0.7)}
          color={COLORS.good}
          width={5}
          length={280}
          fill={COLORS.accent}
        />
        <InkDraw
          d="M 0 -200 C -40 -214 -66 -252 -46 -292 C -18 -264 -4 -234 0 -206"
          at={sec(1.7)}
          duration={sec(0.6)}
          color={COLORS.good}
          width={4}
          length={200}
          fill={COLORS.accentSoft}
        />
      </g>
    </svg>
  );

  // ── PANEL DE IMAGEN — marco de pergamino, foto/figura levantada con Frame3D
  const ImagePanel = (
    <div style={{ flex: "0 0 44%", display: "flex", alignItems: "center", justifyContent: "center", perspective: 1400 }}>
      <Frame3D at={sec(0.15)} rotateY={imgOnLeft ? 12 : -12} rotateX={5} depth={70} perspective={1400}>
        <DepthShadow layers={6} distance={54} radius={20} color="rgba(42,38,32,0.22)">
          <div
            style={{
              width: 560,
              height: 660,
              maxWidth: "42vw",
              borderRadius: 20,
              padding: 20,
              background: `linear-gradient(155deg, ${COLORS.bg0}, ${COLORS.bg2})`,
              border: "1px solid rgba(42,38,32,0.18)",
              boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -3px 12px rgba(42,38,32,0.14)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* esquinas de álbum (photo corners) */}
            {[
              { top: 6, left: 6, rot: 0 },
              { top: 6, right: 6, rot: 90 },
              { bottom: 6, right: 6, rot: 180 },
              { bottom: 6, left: 6, rot: 270 },
            ].map((c, i) => (
              <svg
                key={i}
                width={44}
                height={44}
                viewBox="0 0 44 44"
                style={{ position: "absolute", ...c, transform: `rotate(${c.rot}deg)`, zIndex: 3 }}
              >
                <path d="M0 0 L44 0 L0 44 Z" fill={COLORS.ink} opacity={0.32} />
              </svg>
            ))}
            <div
              style={{
                position: "absolute",
                inset: 20,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(42,38,32,0.22)",
                background: COLORS.bg1,
              }}
            >
              {image ? (
                <Img
                  src={image}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "sepia(0.12) saturate(1.02)",
                    transform: `scale(${1.04 + Math.sin(frame / 150) * 0.012})`,
                  }}
                />
              ) : (
                brandFigure
              )}
              {/* viñeteado cálido + luz de borde */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  boxShadow: "inset 0 0 90px rgba(42,38,32,0.34)",
                  background:
                    "radial-gradient(120% 90% at 30% 20%, rgba(244,231,198,0.28), rgba(0,0,0,0) 55%)",
                  pointerEvents: "none",
                }}
              />
              <PaperGrain opacity={0.1} scale={1.1} seed={3} />
            </div>
            {/* leyenda-cinta bajo el marco */}
            {title && (
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 20,
                  right: 20,
                  textAlign: "center",
                  fontFamily: FONT_STACK,
                  fontSize: 22,
                  fontStyle: "italic",
                  color: COLORS.textSoft,
                }}
              >
                {title}
              </div>
            )}
          </div>
        </DepthShadow>
      </Frame3D>
    </div>
  );

  // ── PANEL DE TEXTO — encabezado serif + bullets con viñeta de tinta
  const TextPanel = (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: imgOnLeft ? "0 60px 0 40px" : "0 40px 0 60px",
        // dejamos aire abajo-derecha para el avatar PiP
        paddingBottom: 90,
      }}
    >
      {subtitle && (
        <div
          style={{
            letterSpacing: 6,
            fontSize: 20,
            fontWeight: 700,
            textTransform: "uppercase",
            color: accent,
            marginBottom: 10,
            opacity: interpolate(enter, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" }),
          }}
        >
          {subtitle}
        </div>
      )}
      <div style={{ position: "relative", marginBottom: 34 }}>
        <div
          style={{
            fontSize: 66,
            lineHeight: 1.05,
            fontWeight: 800,
            color: COLORS.text,
            fontFamily: FONT_STACK,
            opacity: enter,
            transform: `translateX(${(1 - enter) * (imgOnLeft ? 30 : -30)}px)`,
          }}
        >
          {heading}
        </div>
        {/* subrayado de tinta que se escribe bajo el encabezado */}
        <svg viewBox="0 0 640 40" width={Math.min(640, heading.length * 26)} height={40} style={{ display: "block", marginTop: 4 }}>
          <InkDraw
            d="M 8 22 C 150 8 360 34 632 16"
            at={sec(0.5)}
            duration={sec(0.8)}
            color={accent}
            width={7}
            length={680}
            dropShadow
          />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {points.map((p, i) => {
          const at = sec(0.7 + i * 0.35);
          const s = spring({ frame: frame - at, fps, config: { damping: 20, mass: 0.8, stiffness: 130 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 22,
                opacity: s,
                transform: `translateX(${(1 - s) * (imgOnLeft ? 26 : -26)}px)`,
              }}
            >
              {/* viñeta: sello de tinta que se dibuja */}
              <DepthShadow layers={3} distance={14} radius={999} color="rgba(42,38,32,0.24)" style={{ flexShrink: 0, marginTop: 6 }}>
                <svg width={46} height={46} viewBox="0 0 46 46" style={{ display: "block" }}>
                  <circle cx={23} cy={23} r={21} fill={COLORS.bg0} stroke="rgba(42,38,32,0.18)" strokeWidth={1.5} />
                  <InkDraw
                    d="M 23 6 A 17 17 0 1 1 22.9 6"
                    at={at}
                    duration={sec(0.5)}
                    color={accent}
                    width={4}
                    length={118}
                  />
                  <InkDraw
                    d="M 14 24 L 21 31 L 33 15"
                    at={at + sec(0.2)}
                    duration={sec(0.35)}
                    color={COLORS.good}
                    width={5}
                    length={48}
                  />
                </svg>
              </DepthShadow>
              <div
                style={{
                  fontSize: 34,
                  lineHeight: 1.32,
                  color: COLORS.text,
                  fontFamily: FONT_STACK,
                  fontWeight: 500,
                  maxWidth: 720,
                }}
              >
                {p}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="spk" />
      <TechBackground glowX={imgOnLeft ? 34 : 66} glowY={40} hue="amber" drift={0.3} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.35} />

      {/* capa de profundidad lejana: polvo cálido flotando */}
      <ParallaxLayer depth={0.25} driftX={26} driftY={16}>
        <ParticleField count={20} kind="dust" rise={false} drift={26} opacity={0.5} />
      </ParallaxLayer>

      {/* luz volumétrica cálida desde el lado de la imagen */}
      <GodRays x={imgOnLeft ? 24 : 74} y={-12} angle={imgOnLeft ? 20 : -20} intensity={0.9} rays={7} />

      <AbsoluteFill style={{ opacity: enter * exit, transform: `translateY(${bob}px) scale(${0.985 + enter * 0.015})` }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: imgOnLeft ? "row" : "row-reverse",
            alignItems: "center",
          }}
        >
          {ImagePanel}
          {TextPanel}
        </div>
      </AbsoluteFill>

      {/* grano de papel global por encima de todo */}
      <PaperGrain opacity={0.09} scale={0.9} seed={7} />
    </AbsoluteFill>
  );
};

export default SplitPanelKit;
