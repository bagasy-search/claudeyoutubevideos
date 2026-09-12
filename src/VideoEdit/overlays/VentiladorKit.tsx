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
import { COLORS, FONT_STACK } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  RimLight,
  DepthShadow,
  Odometer,
  InkDraw,
  WaxSeal,
  Frame3D,
  SvgFilters,
  rand,
} from "../kit/depth";

// ═══════════════════════════════════════════════════════════════════════════
// VentiladorKit — overlays ORIGINALES para "ventilador viejo → aire acondicionado
// con 2 botellas congeladas" (El Constructor Libre, narrador Tomás).
//
// CONTRATO DE POSICIÓN — el avatar (video real) habla a pantalla completa (cara en
// el tercio superior-central) o como PiP abajo-derecha (~32% ancho). TODOS los
// componentes de este kit son overlays PARCIALES (fondo transparente, no
// AbsoluteFill opaco) anclados a la ZONA SEGURA:
//   • tercio superior (y < ~30% del alto) libre de uso,
//   • franja IZQUIERDA (x < ~60% del ancho),
//   • lower-third IZQUIERDA (y > 68%, x < 60%).
// NINGÚN elemento pinta el centro-cara (35–75% x, 8–58% y) ni la esquina
// abajo-derecha (x > 62%, y > 55%). Cada componente define su propio `dock`
// ("top" | "left" | "lower-left") y clampea su caja a esa región.
//
// RENDER-SAFE: nada de Date.now()/Math.random()/new Date(). Todo determinístico
// desde useCurrentFrame(); "azar" = rand(i)/wobble(i,frame) de kit/depth.tsx.
// ═══════════════════════════════════════════════════════════════════════════

const vt = (name: string) => staticFile(`real/${name}`);

// safe-zone helper: ancla el contenedor a una región y limita su tamaño máximo
// para que nunca invada centro-cara ni el PiP del avatar.
// NOTA de seguridad (AGRANDADO jul-2026): la cara del avatar a pantalla completa
// ocupa aprox. x 35–75% / y 8–58% del canvas 1920x1080 (672–1440px / 86–626px).
// El PiP de esquina abajo-derecha (cornerBR, el modo dominante mientras hay
// overlay en pantalla) ocupa el RECTÁNGULO PROHIBIDO x≥1190 && y≥380 — ningún
// contenido puede caer ahí. Por eso los docks ahora usan hasta ~1000px de ancho
// (≈52% del canvas) pero ANCLADOS arriba/izquierda: su borde derecho llega como
// mucho a ~1180px y quedan por ENCIMA de y=380 cuando además se extienden en
// alto, dejando siempre libre la banda inferior-derecha del PiP.
const DOCKS = {
  top: { position: "absolute" as const, top: 60, left: 76, maxWidth: 980 },
  // "top-wide" usa todo el ancho superior disponible pero se detiene bien antes
  // del PiP (borde derecho ≈1160px, PiP arranca en 1190px).
  "top-wide": { position: "absolute" as const, top: 60, left: 76, maxWidth: 1080 },
  left: { position: "absolute" as const, top: 260, left: 70, maxWidth: 960 },
  "lower-left": { position: "absolute" as const, bottom: 84, left: 70, maxWidth: 1000 },
  // "full-left" es el dock hero (diagramas grandes): ancho generoso pero el
  // `bottom: 150` lo mantiene arriba de y≈380 en su tramo final, y su ancho de
  // 1000px con left:64 cierra en x≈1064, lejos del arranque del PiP (x=1190).
  "full-left": { position: "absolute" as const, top: 130, left: 64, bottom: 150, maxWidth: 1000 },
};

// ─────────────────────────────────────────────────────────────────────────────
// 1) EyebrowKicker — placa mínima esquina superior-izquierda: ojo/kicker corto que
//    ancla la idea que se acaba de decir, sin ocupar espacio (abre y cierra videos).
// ─────────────────────────────────────────────────────────────────────────────
export const EyebrowKicker: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  text?: string;
  accent?: string;
}> = ({ durationInFrames, eyebrow = "EL CONSTRUCTOR LIBRE", text = "Ventilador viejo → aire frío", accent = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, mass: 0.8, stiffness: 150 } });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = s * out;
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS.top, opacity: op, transform: `translateX(${(1 - s) * -40}px)` }}>
        <DepthShadow distance={34} radius={20} color="rgba(42,38,32,0.18)" style={{ display: "inline-block" }}>
          <div
            style={{
              background: "linear-gradient(160deg, rgba(245,238,220,0.95), rgba(222,210,182,0.92))",
              border: `3px solid ${accent}`,
              borderRadius: 22,
              padding: "20px 40px",
              display: "inline-flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ width: 15, height: 15, borderRadius: 8, background: accent, boxShadow: `0 0 0 7px ${accent}33` }} />
            <div>
              <div style={{ fontSize: 23, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", color: COLORS.amber }}>{eyebrow}</div>
              <div style={{ fontSize: 39, fontWeight: 800, color: COLORS.text }}>{text}</div>
            </div>
          </div>
        </DepthShadow>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2) FrictionCard — problema doble (hook): tarjeta superior-izquierda con dos
//    íconos recortados (ventilador soplando caliente / factura de luz) tachados.
// ─────────────────────────────────────────────────────────────────────────────
export const FrictionCard: React.FC<{
  durationInFrames: number;
  title?: string;
  leftImage?: string;
  rightImage?: string;
  leftLabel?: string;
  rightLabel?: string;
  accent?: string;
}> = ({
  durationInFrames,
  title = "Atrapado entre los dos",
  leftImage = "vt_fan_blowing_warm_air.png",
  rightImage = "vt_electricity_meter_running.png",
  leftLabel = "Aire caliente",
  rightLabel = "Factura que funde",
  accent = COLORS.danger,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = enter * out;

  const Chip: React.FC<{ img: string; label: string; at: number }> = ({ img, label, at }) => {
    const s = spring({ frame: frame - at, fps, config: { damping: 14, mass: 0.7, stiffness: 170 } });
    return (
      <div style={{ opacity: s, transform: `translateY(${(1 - s) * 16}px) scale(${0.9 + s * 0.1})`, textAlign: "center" }}>
        <DepthShadow distance={40} radius={24} color="rgba(42,38,32,0.22)" style={{ position: "relative", overflow: "hidden", width: 350, height: 238 }}>
          <div style={{ position: "relative", width: 350, height: 238, border: `4px solid ${COLORS.bg2}`, borderRadius: 24, overflow: "hidden" }}>
            <Img src={vt(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(30,20,15,0.55) 100%)" }} />
            <svg viewBox="0 0 350 238" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
              <InkDraw d="M 32 32 L 318 206" at={at + 8} duration={14} color={COLORS.danger} width={10} length={410} dropShadow />
              <InkDraw d="M 318 32 L 32 206" at={at + 14} duration={14} color={COLORS.danger} width={10} length={410} />
            </svg>
          </div>
        </DepthShadow>
        <div style={{ marginTop: 14, fontSize: 33, fontWeight: 800, color: COLORS.text }}>{label}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS.top, opacity: op }}>
        <div style={{ fontSize: 25, letterSpacing: 5, textTransform: "uppercase", fontWeight: 700, color: accent, marginBottom: 10 }}>El problema real</div>
        <div style={{ fontSize: 55, fontWeight: 800, color: COLORS.text, marginBottom: 24, maxWidth: 920 }}>{title}</div>
        <div style={{ display: "flex", gap: 32 }}>
          <Chip img={leftImage} label={leftLabel} at={8} />
          <Chip img={rightImage} label={rightLabel} at={16} />
        </div>
      </div>
      <PaperGrain opacity={0.06} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3) SecretSealCard — sello de lacre "EL SECRETO DE LA SAL" (u otro claim corto)
//    estampado en la izquierda, para anclar el giro/promesa del video.
// ─────────────────────────────────────────────────────────────────────────────
export const SecretSealCard: React.FC<{
  durationInFrames: number;
  label?: string;
  sub?: string;
  accent?: string;
}> = ({ durationInFrames, label = "EL SECRETO", sub = "de la sal", accent = COLORS.danger }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const STAMP_AT = 10;
  const seal = spring({ frame: frame - STAMP_AT, fps, config: { damping: 9, mass: 0.8, stiffness: 190 } });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burst = interpolate(frame - STAMP_AT, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <SvgFilters prefix="secretseal" />
      <div style={{ ...DOCKS.left, opacity: Math.max(seal, 0.001) * out, display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative" }}>
          <RimLight color={accent} spread={34} x={0.6} y={0.2}>
            <WaxSeal at={STAMP_AT} size={264} color={accent} initials="★" />
          </RimLight>
          <svg viewBox="0 0 300 300" width={300} height={300} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {Array.from({ length: 16 }, (_, i) => {
              const a = rand(i) * Math.PI * 2;
              const dist = burst * (44 + rand(i, 1) * 132);
              const ox = 150 + Math.cos(a) * dist;
              const oy = 150 + Math.sin(a) * dist;
              const op = interpolate(burst, [0, 0.15, 1], [0, 0.8, 0]);
              return <circle key={i} cx={ox} cy={oy} r={3 + rand(i, 2) * 6} fill={COLORS.amber} opacity={op} />;
            })}
          </svg>
        </div>
        <div style={{ opacity: spring({ frame: frame - STAMP_AT - 4, fps, config: { damping: 18, mass: 0.8, stiffness: 140 } }) }}>
          <div style={{ fontSize: 46, letterSpacing: 4, fontWeight: 900, color: accent, textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontSize: 68, fontWeight: 800, color: COLORS.text }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4) PromiseChecklist — lista de lo que se va a aprender (izquierda), tildes que
//    se dibujan una a una en stagger.
// ─────────────────────────────────────────────────────────────────────────────
export const PromiseChecklist: React.FC<{
  durationInFrames: number;
  heading?: string;
  items?: string[];
  accent?: string;
}> = ({
  durationInFrames,
  heading = "Hoy te paso el truco completo",
  items = [
    "Por qué el ventilador común no enfría",
    "La forma correcta de armarlo",
    "El secreto de la sal",
    "El error de 30 segundos",
  ],
  accent = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS.left, opacity: enter * out, transform: `translateY(${(1 - enter) * 20}px)` }}>
        <DepthShadow distance={54} radius={30} color="rgba(42,38,32,0.18)">
          <div
            style={{
              background: "linear-gradient(160deg, rgba(245,238,220,0.95), rgba(222,210,182,0.92))",
              border: "3px solid rgba(42,38,32,0.16)",
              borderRadius: 30,
              padding: "40px 46px",
              width: 940,
            }}
          >
            <div style={{ fontSize: 35, fontWeight: 800, color: COLORS.text, marginBottom: 22 }}>{heading}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {items.map((it, i) => {
                const at = 14 + i * 8;
                const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.7, stiffness: 150 } });
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateX(${(1 - s) * -20}px)` }}>
                    <svg viewBox="0 0 34 34" width={50} height={50} style={{ flexShrink: 0 }}>
                      <circle cx={17} cy={17} r={15} fill="none" stroke={accent} strokeWidth={2.4} opacity={0.6} />
                      <InkDraw d="M 9 18 L 15 24 L 26 10" at={at + 6} duration={14} length={40} color={accent} width={4} />
                    </svg>
                    <div style={{ fontSize: 39, fontWeight: 700, color: COLORS.text }}>{it}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </DepthShadow>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5) FanFailProof — "prueba" del ventilador en cuarto vacío: termómetro que NO
//    baja, para anclar "el ventilador no enfría el aire".
// ─────────────────────────────────────────────────────────────────────────────
export const FanFailProof: React.FC<{
  durationInFrames: number;
  title?: string;
  image?: string;
  tempLabel?: string;
  accent?: string;
}> = ({ durationInFrames, title = "La pieza no baja ni un grado", image = "vt_old_fan_running_full.png", tempLabel = "35°C → 35°C", accent = COLORS.cold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = Math.sin(frame / 3) * (frame < 20 ? 0.6 : 0); // sacudida sutil al entrar (no handheld continuo)
  const statAt = 18;
  const statS = spring({ frame: frame - statAt, fps, config: { damping: 15, mass: 0.8, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS.left, opacity: enter * out }}>
        <Frame3D rotateY={-10} rotateX={3} depth={50}>
          <div style={{ position: "relative", width: 720, height: 500, transform: `rotate(${shake}deg)` }}>
            <DepthShadow distance={58} radius={26} color="rgba(42,38,32,0.24)" style={{ width: 720, height: 500, overflow: "hidden" }}>
              <div style={{ position: "relative", width: 720, height: 500, border: `6px solid ${COLORS.bg2}`, borderRadius: 26, overflow: "hidden" }}>
                <Img src={vt(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(30,24,18,0.55) 0%, rgba(0,0,0,0) 45%)" }} />
              </div>
            </DepthShadow>
            <div
              style={{
                position: "absolute",
                bottom: -40,
                left: 30,
                background: accent,
                color: "#F7F1DF",
                padding: "14px 30px",
                borderRadius: 18,
                boxShadow: "0 18px 36px rgba(42,38,32,0.32)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {/* DATO dominante: el delta real (0 grados) en Odometer, mucho más grande que el "35 -> 35" secundario */}
              <div style={{ display: "flex", alignItems: "baseline", opacity: statS }}>
                <Odometer value={0} digits={1} size={52} color="#F7F1DF" durationInFrames={30} />
                <span style={{ fontSize: 30, fontWeight: 900, marginLeft: 4 }}>° de cambio</span>
              </div>
              <div style={{ width: 2, height: 34, background: "rgba(247,241,223,0.4)" }} />
              <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.85 }}>{tempLabel}</div>
            </div>
          </div>
        </Frame3D>
        <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.text, marginTop: 50, maxWidth: 690 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6) EvaporationPhysics — LA FÍSICA: 3 capas (fondo textura + piel/gota midground
//    recortada con borde + flechas foreground) mostrando cómo el aire en
//    movimiento evapora el sudor y saca calor del cuerpo.
// ─────────────────────────────────────────────────────────────────────────────
export const EvaporationPhysics: React.FC<{
  durationInFrames: number;
  title?: string;
  accent?: string;
}> = ({ durationInFrames, title = "El aire te evapora el sudor. Eso te saca calor.", accent = COLORS.cold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const arrowAt = 16;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <SvgFilters prefix="evap" />
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.text, marginBottom: 22, maxWidth: 980 }}>{title}</div>
        <div style={{ position: "relative", width: 940, height: 640 }}>
          {/* (a) FONDO: textura de papel/vintage continua */}
          <ParallaxLayer depth={0.15} driftY={8}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 34,
                background: `radial-gradient(70% 60% at 40% 30%, ${COLORS.bg1} 0%, ${COLORS.bg0} 60%, ${COLORS.bg2} 120%)`,
                border: `3px dashed ${COLORS.bg2}`,
              }}
            />
          </ParallaxLayer>
          <GodRays x={45} y={-8} angle={18} color="rgba(111,132,120,0.18)" rays={5} />

          {/* (b) MIDGROUND: piel recortada con trazo marcador, despegada del fondo */}
          <div style={{ position: "absolute", left: 60, top: 90, width: 456, height: 456, filter: "drop-shadow(0 30px 40px rgba(42,38,32,0.28))" }}>
            <div style={{ position: "relative", width: 456, height: 456, borderRadius: 32, overflow: "hidden", border: `7px solid ${COLORS.ink}` }}>
              <Img src={vt("vt_person_feeling_cold_air.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* gotas de sudor evaporándose (partículas deterministas subiendo) */}
          <div style={{ position: "absolute", left: 60, top: 90, width: 456, height: 456 }}>
            <ParticleField count={10} kind="bubbles" rise drift={10} color={accent} opacity={0.6} width={456} height={456} />
          </div>

          {/* (c) FOREGROUND: flechas de aire/frío que ocluyen y anclan la toma */}
          <svg viewBox="0 0 940 640" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            {[0, 1, 2].map((i) => {
              const y = 190 + i * 100;
              return (
                <InkDraw
                  key={i}
                  d={`M 570 ${y} C 660 ${y - 14}, 720 ${y + 14}, 850 ${y}`}
                  at={arrowAt + i * 6}
                  duration={20}
                  color={accent}
                  width={10}
                  length={330}
                  dropShadow
                />
              );
            })}
            {/* punta de flecha */}
            <InkDraw d="M 830 176 L 856 196 L 830 216" at={arrowAt + 8} duration={12} color={accent} width={10} length={100} />
          </svg>

          {/* (d) DATO dominante: la evaporación baja la temp de la piel, número grande + label chico */}
          <div
            style={{
              position: "absolute",
              left: 600,
              top: 380,
              opacity: spring({ frame: frame - (arrowAt + 10), fps, config: { damping: 15, mass: 0.8, stiffness: 140 } }),
              display: "flex",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <Odometer value={4} digits={1} prefix="-" suffix="°" size={78} color={accent} durationInFrames={40} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 604,
              top: 470,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 1,
              color: COLORS.textSoft,
              opacity: spring({ frame: frame - (arrowAt + 16), fps, config: { damping: 15, mass: 0.8, stiffness: 140 } }),
              maxWidth: 300,
            }}
          >
            en la piel, solo por el aire moviéndose
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7) FanBottleAssembly — EL DIAGRAMA CLAVE: ventilador + 2 botellas detrás +
//    flechas de aire frío entrando. 3 capas de profundidad reales.
// ─────────────────────────────────────────────────────────────────────────────
export const FanBottleAssembly: React.FC<{
  durationInFrames: number;
  title?: string;
  accent?: string;
}> = ({ durationInFrames, title = "El aire pasa por el hielo antes de tirártelo", accent = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bottleS = spring({ frame: frame - 8, fps, config: { damping: 16, mass: 0.9, stiffness: 120 } });
  const fanS = spring({ frame: frame - 2, fps, config: { damping: 18, mass: 1, stiffness: 100 } });
  const tagInS = spring({ frame: frame - 26, fps, config: { damping: 14, mass: 0.7, stiffness: 150 } });
  const tagOutS = spring({ frame: frame - 32, fps, config: { damping: 14, mass: 0.7, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <SvgFilters prefix="assembly" />
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ fontSize: 37, fontWeight: 800, color: COLORS.text, marginBottom: 18, maxWidth: 980 }}>{title}</div>
        <div style={{ position: "relative", width: 980, height: 620 }}>
          {/* (a) FONDO: card con textura + borde interno, profundidad de estudio */}
          <ParallaxLayer depth={0.12} driftX={6}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 34,
                background: `linear-gradient(150deg, ${COLORS.bg1} 0%, ${COLORS.bg0} 55%, ${COLORS.bg2} 120%)`,
                border: `2px solid rgba(42,38,32,0.14)`,
                boxShadow: "inset 0 0 90px rgba(42,38,32,0.14)",
              }}
            />
          </ParallaxLayer>
          <GodRays x={30} y={-14} angle={20} color="rgba(169,121,74,0.16)" rays={6} />

          {/* (b) MIDGROUND: botellas heladas DETRÁS del ventilador, con halo frío (RimLight) */}
          <RimLight color={COLORS.cold} spread={30} x={0.2} y={0.4}>
            <div
              style={{
                position: "absolute",
                left: 38,
                top: 112,
                display: "flex",
                gap: 18,
                opacity: bottleS,
                transform: `translateX(${(1 - bottleS) * -30}px)`,
                filter: "drop-shadow(0 24px 32px rgba(42,38,32,0.26))",
              }}
            >
              {["vt_bottles_fully_frozen.png", "vt_bottles_sweating_frost.png"].map((img, i) => (
                <div key={i} style={{ width: 164, height: 328, borderRadius: 20, overflow: "hidden", border: `6px solid ${COLORS.cold}` }}>
                  <Img src={vt(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </RimLight>
          {/* niebla fría alrededor de las botellas */}
          <div style={{ position: "absolute", left: 26, top: 100, width: 374, height: 348 }}>
            <ParticleField count={12} kind="bubbles" rise drift={14} color={COLORS.cold} opacity={0.4} width={374} height={348} />
          </div>

          {/* (c) FOREGROUND: ventilador (recortado, borde marcador) OCLUYE parte de las botellas */}
          <div
            style={{
              position: "absolute",
              left: 276,
              top: 48,
              width: 500,
              height: 500,
              opacity: fanS,
              transform: `translateX(${(1 - fanS) * 30}px)`,
              filter: "drop-shadow(0 34px 42px rgba(42,38,32,0.32))",
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 28, overflow: "hidden", border: `7px solid ${COLORS.ink}` }}>
              <Img src={vt("vt_fan_back_showing_grille.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* flechas de aire frío entrando por detrás y saliendo fresco */}
          <svg viewBox="0 0 980 620" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <InkDraw d="M 112 288 C 190 264, 238 314, 302 288" at={20} duration={18} color={COLORS.cold} width={10} length={290} dropShadow />
            <InkDraw d="M 295 268 L 320 288 L 295 308" at={26} duration={12} color={COLORS.cold} width={10} length={100} />
            <InkDraw d="M 802 264 C 866 251, 916 277, 964 264" at={30} duration={18} color={accent} width={11} length={290} dropShadow />
            <InkDraw d="M 950 245 L 976 264 L 950 284" at={36} duration={12} color={accent} width={11} length={100} />
          </svg>

          {/* (d) TARJETAS de dato con jerarquía real: número grande dominante + label chico soporte */}
          <div
            style={{
              position: "absolute",
              left: 12,
              top: 356,
              opacity: tagInS,
              transform: `translateY(${(1 - tagInS) * 14}px)`,
              background: "rgba(239,231,211,0.95)",
              border: `3px solid ${COLORS.cold}`,
              borderRadius: 18,
              padding: "10px 20px",
              boxShadow: "0 14px 22px rgba(42,38,32,0.22)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: COLORS.textSoft }}>entra</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: COLORS.cold, lineHeight: 1 }}>aire caliente</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 700,
              top: 316,
              opacity: tagOutS,
              transform: `translateY(${(1 - tagOutS) * 14}px)`,
              background: "rgba(239,231,211,0.95)",
              border: `3px solid ${accent}`,
              borderRadius: 18,
              padding: "10px 24px",
              boxShadow: "0 14px 22px rgba(42,38,32,0.22)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: COLORS.textSoft }}>sale</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: accent, lineHeight: 1 }}>aire fresco</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8) WrongVsRightPlacement — comparación vertical (izquierda): botellas ADELANTE
//    (mal, tachado) vs DETRÁS (bien, check).
// ─────────────────────────────────────────────────────────────────────────────
export const WrongVsRightPlacement: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "Nunca adelante. Siempre detrás." }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Row: React.FC<{ img: string; label: string; good: boolean; at: number }> = ({ img, label, good, at }) => {
    const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.8, stiffness: 140 } });
    const color = good ? COLORS.good : COLORS.danger;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: s, transform: `translateX(${(1 - s) * -26}px)` }}>
        <DepthShadow distance={44} radius={22} color="rgba(42,38,32,0.2)" style={{ width: 320, height: 208, overflow: "hidden" }}>
          <div style={{ position: "relative", width: 320, height: 208, border: `6px solid ${color}`, borderRadius: 22, overflow: "hidden" }}>
            <Img src={vt(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </DepthShadow>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg viewBox="0 0 40 40" width={60} height={60}>
            {good ? (
              <InkDraw d="M 8 20 L 17 29 L 32 10" at={at + 8} duration={14} length={44} color={color} width={5} />
            ) : (
              <>
                <InkDraw d="M 10 10 L 30 30" at={at + 8} duration={12} length={30} color={color} width={5} />
                <InkDraw d="M 30 10 L 10 30" at={at + 10} duration={12} length={30} color={color} width={5} />
              </>
            )}
          </svg>
          <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.text, maxWidth: 400 }}>{label}</div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.text, marginBottom: 28, maxWidth: 980 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <Row img="vt_bottles_wrong_position.png" label="Adelante: tapa el chorro" good={false} at={10} />
          <Row img="vt_bottles_behind_fan.png" label="Detrás: aire entra frío" good={true} at={26} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9) BottleSizeGauge — chico vs grande, con Odómetro de minutos/horas de frío.
// ─────────────────────────────────────────────────────────────────────────────
export const BottleSizeGauge: React.FC<{
  durationInFrames: number;
  title?: string;
  smallMinutes?: number;
  bigHours?: number;
}> = ({ durationInFrames, title = "El tamaño importa", smallMinutes = 20, bigHours = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // el mismo "hs" convertido a minutos, para poder mostrar una barra de progreso
  // real que compara ambos tiempos de frío en la MISMA escala (no solo cifras sueltas).
  const bigMinutes = bigHours * 60;
  const maxMin = Math.max(smallMinutes, bigMinutes);

  const Card: React.FC<{ img: string; label: string; value: number; unit: string; accent: string; barMin: number; at: number }> = ({ img, label, value, unit, accent, barMin, at }) => {
    const s = spring({ frame: frame - at, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
    const barS = spring({ frame: frame - (at + 14), fps, config: { damping: 20, mass: 1, stiffness: 90 }, durationInFrames: 46 });
    const barW = (barMin / maxMin) * 340 * barS;
    return (
      <div style={{ opacity: s, transform: `translateY(${(1 - s) * 20}px)`, textAlign: "center" }}>
        <DepthShadow distance={46} radius={26} color="rgba(42,38,32,0.2)" style={{ width: 340, height: 262, overflow: "hidden" }}>
          <div style={{ position: "relative", width: 340, height: 262, border: `6px solid ${accent}`, borderRadius: 26, overflow: "hidden" }}>
            <Img src={vt(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0) 60%, ${accent}33 100%)` }} />
          </div>
        </DepthShadow>
        <div style={{ marginTop: 14, fontSize: 26, fontWeight: 700, color: COLORS.textSoft, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 9, marginBottom: 8 }}>
          <Odometer value={value} digits={1} size={76} color={accent} durationInFrames={40} />
          <span style={{ fontSize: 36, fontWeight: 800, color: accent }}>{unit}</span>
        </div>
        {/* barra comparativa: cuánto frío te da, en la misma escala que la otra card */}
        <div style={{ height: 16, width: 340, background: "rgba(42,38,32,0.08)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ height: 16, width: barW, background: accent, borderRadius: 8, boxShadow: `0 4px 10px ${accent}44` }} />
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.text, marginBottom: 28, maxWidth: 980 }}>{title}</div>
        <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
          <Card img="vt_small_bottle_bad.png" label="Media, chiquita" value={smallMinutes} unit="min" barMin={smallMinutes} accent={COLORS.danger} at={10} />
          <div
            style={{
              width: 100,
              display: "flex",
              justifyContent: "center",
              opacity: spring({ frame: frame - 16, fps, config: { damping: 14, mass: 0.6, stiffness: 160 } }),
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.amber, background: "rgba(245,238,220,0.9)", border: `2px solid ${COLORS.amber}`, borderRadius: 22, padding: "8px 16px" }}>VS</div>
          </div>
          <Card img="vt_large_bidons_ideal.png" label="Bidón grande" value={bigHours} unit="hs" barMin={bigMinutes} accent={COLORS.good} at={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 10) SaltPhysicsDiagram — capas: agua pura vs agua+sal, comparando temperatura
//     y duración del hielo (el secreto de la sal, con la referencia heladera).
// ─────────────────────────────────────────────────────────────────────────────
export const SaltPhysicsDiagram: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "El agua con sal se pone más fría y dura más" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <SvgFilters prefix="salt" />
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ fontSize: 39, fontWeight: 800, color: COLORS.text, marginBottom: 20, maxWidth: 980 }}>{title}</div>
        <div style={{ position: "relative", width: 980, height: 590 }}>
          <ParallaxLayer depth={0.12} driftY={6}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: `radial-gradient(70% 60% at 45% 30%, ${COLORS.bg1}, ${COLORS.bg0} 60%, ${COLORS.bg2} 120%)` }} />
          </ParallaxLayer>
          <GodRays x={100} y={-14} angle={20} color="rgba(169,121,74,0.16)" rays={5} />

          <div style={{ display: "flex", gap: 0, position: "relative", alignItems: "center" }}>
            {[
              { img: "vt_pure_water_not_salty.png", label: "Agua sola", temp: -0, dur: "20 min", accent: COLORS.textDim },
              { img: "vt_frozen_pure_vs_salty.png", label: "Agua + sal", temp: -6, dur: "2 hs", accent: COLORS.good },
            ].map((c, i) => {
              const s = spring({ frame: frame - (10 + i * 10), fps, config: { damping: 16, mass: 0.8, stiffness: 130 } });
              return (
                <React.Fragment key={i}>
                  {i === 1 && (
                    <div
                      style={{
                        width: 76,
                        display: "flex",
                        justifyContent: "center",
                        opacity: spring({ frame: frame - 16, fps, config: { damping: 14, mass: 0.6, stiffness: 160 } }),
                      }}
                    >
                      <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.amber, background: "rgba(245,238,220,0.9)", border: `2px solid ${COLORS.amber}`, borderRadius: 20, padding: "6px 14px" }}>VS</div>
                    </div>
                  )}
                  <div style={{ opacity: s, transform: `translateY(${(1 - s) * 18}px)` }}>
                    <div style={{ position: "relative", width: 372, height: 400, borderRadius: 30, overflow: "hidden", border: `7px solid ${c.accent}`, filter: "drop-shadow(0 26px 34px rgba(42,38,32,0.26))" }}>
                      <Img src={vt(c.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {i === 1 && (
                        <div style={{ position: "absolute", left: 9, top: 9, right: 9 }}>
                          <ParticleField count={8} kind="flakes" rise={false} drift={8} color="#EDE4CE" width={354} height={120} opacity={0.6} />
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: 14, fontSize: 26, fontWeight: 700, color: COLORS.textSoft, letterSpacing: 1, textTransform: "uppercase" }}>{c.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <Odometer value={Math.abs(c.temp)} digits={1} prefix={c.temp < 0 ? "-" : ""} suffix="°C" size={54} color={c.accent} durationInFrames={40} />
                      <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.textDim }}>· dura {c.dur}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div style={{ position: "absolute", bottom: -8, left: 0, fontSize: 27, fontWeight: 700, color: COLORS.amber }}>
            Como los heladeros de antes
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 11) StepByStepBuild — pasos numerados de armado (izquierda, columna), conector
//     de tinta vertical, imagen chica por paso.
// ─────────────────────────────────────────────────────────────────────────────
export type BuildStep = { title: string; image?: string };
export const StepByStepBuild: React.FC<{
  durationInFrames: number;
  heading?: string;
  steps?: BuildStep[];
  accent?: string;
}> = ({
  durationInFrames,
  heading = "Se hace en 2 minutos",
  steps = [
    { title: "Llená las botellas dejando un dedo de aire", image: "vt_expansion_space_top.png" },
    { title: "Tirá sal gruesa y sacudí", image: "vt_shaking_salty_water.png" },
    { title: "Al freezer, toda la noche", image: "vt_bottles_in_freezer.png" },
    { title: "Atalas detrás del ventilador", image: "vt_rope_tying_bottles_fan.png" },
    { title: "Bandeja abajo para el goteo", image: "vt_drip_tray_metal.png" },
  ],
  accent = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 26 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.text }}>{heading}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: accent, letterSpacing: 2, textTransform: "uppercase" }}>· {steps.length} pasos</div>
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 22 }}>
          <svg viewBox="0 0 20 960" width={30} height={steps.length * 128} style={{ position: "absolute", left: 40, top: 8 }}>
            <InkDraw d={`M 10 0 L 10 ${steps.length * 128 - 96}`} at={8} duration={40} color={accent} width={6} length={steps.length * 128} />
          </svg>
          {steps.map((st, i) => {
            const at = 10 + i * 9;
            const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.7, stiffness: 150 } });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  opacity: s,
                  transform: `translateX(${(1 - s) * -24}px)`,
                  background: "rgba(245,238,220,0.55)",
                  border: "1.5px solid rgba(42,38,32,0.1)",
                  borderRadius: 22,
                  padding: "12px 22px 12px 12px",
                  backdropFilter: "blur(2px)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 82,
                    height: 82,
                    borderRadius: 41,
                    background: accent,
                    color: "#F7F1DF",
                    fontWeight: 900,
                    fontSize: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 14px 28px rgba(42,38,32,0.28)",
                    zIndex: 1,
                  }}
                >
                  <div style={{ position: "absolute", inset: -6, borderRadius: 47, border: `2px solid ${accent}`, opacity: 0.4 }} />
                  {i + 1}
                </div>
                {st.image && (
                  <DepthShadow distance={26} radius={16} color="rgba(42,38,32,0.22)" style={{ width: 148, height: 108, overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ width: 148, height: 108, borderRadius: 16, overflow: "hidden", border: `4px solid ${COLORS.bg2}` }}>
                      <Img src={vt(st.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </DepthShadow>
                )}
                <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.text, maxWidth: 560 }}>{st.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 12) DripTrayCallout — advertencia corta con línea de tinta apuntando (goteo).
// ─────────────────────────────────────────────────────────────────────────────
export const DripTrayCallout: React.FC<{
  durationInFrames: number;
  text?: string;
  accent?: string;
}> = ({ durationInFrames, text = "Las botellas transpiran y gotean: poné una bandeja", accent = COLORS.amber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.7, stiffness: 160 } });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["lower-left"], opacity: s * out, transform: `translateY(${(1 - s) * 20}px)`, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 200, height: 154, borderRadius: 20, overflow: "hidden", border: `4px solid ${accent}`, flexShrink: 0, filter: "drop-shadow(0 18px 26px rgba(42,38,32,0.24))" }}>
          <Img src={vt("vt_water_dripping_tray.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <DepthShadow distance={38} radius={20} color="rgba(42,38,32,0.18)">
          <div style={{ background: "rgba(239,231,211,0.94)", border: `3px solid ${accent}`, borderRadius: 20, padding: "20px 32px", maxWidth: 640 }}>
            <div style={{ fontSize: 22, letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", color: accent, marginBottom: 6 }}>Ojo con esto</div>
            <div style={{ fontSize: 35, fontWeight: 700, color: COLORS.text }}>{text}</div>
          </div>
        </DepthShadow>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 13) RotationCycleDiagram — ciclo de rotación de 2 pares de botellas (freezer ↔
//     ventilador) para "toda la noche sin que se desperdicie ninguna".
// ─────────────────────────────────────────────────────────────────────────────
export const RotationCycleDiagram: React.FC<{
  durationInFrames: number;
  title?: string;
  accent?: string;
}> = ({ durationInFrames, title = "Rotando dos pares, frío toda la noche", accent = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rot = interpolate(frame, [10, durationInFrames - 10], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const R = 220;
  const CX = 490;
  const CY = 300;
  const nodes = [
    { label: "En el ventilador", img: "vt_bottles_behind_fan.png" },
    { label: "Se descongela", img: "vt_first_bottles_defrosting.png" },
    { label: "Vuelve al freezer", img: "vt_next_day_new_bottles.png" },
    { label: "Nuevo par listo", img: "vt_second_pair_freezing.png" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <SvgFilters prefix="rotcycle" />
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.text, marginBottom: 18, maxWidth: 980 }}>{title}</div>
        <div style={{ position: "relative", width: 980, height: 600 }}>
          <svg viewBox="0 0 980 600" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={COLORS.bg2} strokeWidth={4} strokeDasharray="10 14" />
            {/* flecha giratoria determinística que recorre el ciclo */}
            <g transform={`rotate(${rot} ${CX} ${CY})`}>
              <circle cx={CX} cy={CY - R} r={15} fill={accent} />
            </g>
          </svg>
          {nodes.map((n, i) => {
            const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const nx = CX + Math.cos(a) * R;
            const ny = CY + Math.sin(a) * R;
            const at = 12 + i * 8;
            const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.8, stiffness: 130 } });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: nx - 118,
                  top: ny - 102,
                  width: 236,
                  textAlign: "center",
                  opacity: s,
                  transform: `scale(${0.85 + s * 0.15})`,
                }}
              >
                <div style={{ width: 162, height: 120, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: `4px solid ${COLORS.bg2}`, filter: "drop-shadow(0 15px 22px rgba(42,38,32,0.22))" }}>
                  <Img src={vt(n.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: 25, fontWeight: 700, color: COLORS.text, marginTop: 10 }}>{n.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 14) OldTimersStamp — "LOS VIEJOS YA LO HACÍAN" con 3 referencias históricas en
//     polaroid-fan (oficinas con hielo, beduinos, abuelos con baldosa mojada).
// ─────────────────────────────────────────────────────────────────────────────
export const OldTimersStamp: React.FC<{
  durationInFrames: number;
  heading?: string;
  accent?: string;
}> = ({ durationInFrames, heading = "Esto no lo inventó nadie ayer", accent = COLORS.amber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const photos = [
    { img: "vt_old_ice_block_1900.png", label: "Oficinas, hace 100 años", year: "~1900", rot: -8 },
    { img: "vt_bedouin_wet_sheet_memory.png", label: "Sábana mojada del desierto", year: "Siglos", rot: 4 },
    { img: "vt_wet_sheet_window.png", label: "Los abuelos y la baldosa", year: "1970s", rot: -3 },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 30 }}>
          <WaxSeal at={6} size={140} color={accent} initials="LV" />
          <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.text, maxWidth: 640 }}>{heading}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {photos.map((p, i) => {
            const at = 10 + i * 8;
            const s = spring({ frame: frame - at, fps, config: { damping: 14, mass: 0.8, stiffness: 130 } });
            return (
              <Frame3D key={i} at={at} rotateY={p.rot} rotateX={2} depth={40}>
                <div style={{ transform: `rotate(${p.rot}deg)`, opacity: s, position: "relative" }}>
                  <DepthShadow distance={44} radius={12} color="rgba(42,38,32,0.24)" style={{ background: "#F4ECD6", padding: 15, width: 292 }}>
                    <div style={{ position: "relative", width: 262, height: 232, borderRadius: 6, overflow: "hidden" }}>
                      <Img src={vt(p.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, filter: "sepia(0.3) contrast(1.05)" }} />
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.ink, marginTop: 12, textAlign: "center" }}>{p.label}</div>
                  </DepthShadow>
                  {/* sello de año, chico, aporta jerarquía secundaria */}
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      background: accent,
                      color: "#F7F1DF",
                      fontSize: 16,
                      fontWeight: 900,
                      letterSpacing: 1,
                      borderRadius: 10,
                      padding: "5px 10px",
                      boxShadow: "0 8px 14px rgba(42,38,32,0.3)",
                      transform: "rotate(6deg)",
                    }}
                  >
                    {p.year}
                  </div>
                </div>
              </Frame3D>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 15) MythBusterCard — mito tachado vs verdad, para "no baja la pieza a 17°, sí
//     enfría tu espacio cercano".
// ─────────────────────────────────────────────────────────────────────────────
export const MythBusterCard: React.FC<{
  durationInFrames: number;
  myth?: string;
  truth?: string;
}> = ({ durationInFrames, myth = "“Baja la pieza de 38 a 17 grados”", truth = "Enfría el aire que te da a vos, cerca" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const truthAt = 22;
  const truthS = spring({ frame: frame - truthAt, fps, config: { damping: 14, mass: 0.8, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <SvgFilters prefix="myth" />
      <div style={{ ...DOCKS["full-left"], opacity: enter * out, width: 1000 }}>
        <DepthShadow distance={50} radius={28} color="rgba(42,38,32,0.2)">
          <div style={{ background: "linear-gradient(160deg, rgba(245,238,220,0.96), rgba(222,210,182,0.93))", border: "3px solid rgba(42,38,32,0.16)", borderRadius: 28, padding: "42px 48px", width: 1000 }}>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: COLORS.danger, textTransform: "uppercase", marginBottom: 6 }}>El mito</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
              <div style={{ fontSize: 58 }}>✕</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.danger, textDecoration: "line-through", textDecorationThickness: 4, textDecorationColor: COLORS.danger }}>{myth}</div>
            </div>
            <div style={{ height: 3, background: "rgba(42,38,32,0.16)", margin: "22px 0" }} />
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: COLORS.good, textTransform: "uppercase", marginBottom: 6, opacity: truthS }}>La realidad</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: truthS, transform: `translateY(${(1 - truthS) * 12}px)` }}>
              <svg viewBox="0 0 40 40" width={58} height={58}>
                <InkDraw d="M 8 20 L 17 29 L 32 10" at={truthAt} duration={14} length={44} color={COLORS.good} width={5} />
              </svg>
              <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.good }}>{truth}</div>
            </div>
          </div>
        </DepthShadow>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 16) DistanceLimitWarning — el error de 30 segundos: lejos-rincón (mal) vs
//     cerca-apuntando (bien), con un ícono de "burbuja personal".
// ─────────────────────────────────────────────────────────────────────────────
export const DistanceLimitWarning: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "El error de 30 segundos" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Row: React.FC<{ img: string; label: string; good: boolean; at: number }> = ({ img, label, good, at }) => {
    const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.8, stiffness: 140 } });
    const color = good ? COLORS.good : COLORS.danger;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateX(${(1 - s) * -24}px)` }}>
        <div style={{ width: 304, height: 192, borderRadius: 22, overflow: "hidden", border: `6px solid ${color}`, filter: "drop-shadow(0 20px 26px rgba(42,38,32,0.24))" }}>
          <Img src={vt(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ fontSize: 39, fontWeight: 800, color: COLORS.text, maxWidth: 440 }}>{label}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ fontSize: 45, fontWeight: 900, color: COLORS.danger, marginBottom: 28 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Row img="vt_fan_far_room_useless.png" label="Lejos, en el rincón: no sentís nada" good={false} at={10} />
          <Row img="vt_fan_near_bed_pointing.png" label="Cerca, apuntándote: tu burbuja de frío" good={true} at={26} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 17) ThreeLegsDiagram — las 3 patas del verano (3 columnas con profundidad):
//     toalla mojada · noche y día · botella a los pies.
// ─────────────────────────────────────────────────────────────────────────────
export type Leg = { label: string; image: string };
export const ThreeLegsDiagram: React.FC<{
  durationInFrames: number;
  title?: string;
  legs?: Leg[];
  accent?: string;
}> = ({
  durationInFrames,
  title = "Las tres patas del verano",
  legs = [
    { label: "Toalla mojada", image: "vt_wet_towel_front_fan.png" },
    { label: "Noche y día", image: "vt_nighttime_window_open.png" },
    { label: "Botella a los pies", image: "vt_bottle_feet_bed.png" },
  ],
  accent = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // acento por pata: cada pata tiene una intención de color propia (frío=cyan-sage,
  // ciclo día/noche=ámbar, botella a los pies=frío) para leerse de un vistazo.
  const legAccents = [COLORS.cold, COLORS.amber, COLORS.cold];

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <SvgFilters prefix="legs" />
      <div style={{ ...DOCKS["top-wide"], opacity: enter * out }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.text, marginBottom: 10, textAlign: "center" }}>{title}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: accent, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", marginBottom: 20 }}>
          3 trucos, un mismo secreto
        </div>
        {/* ancho fijo = maxWidth del dock (1080), así 3 columnas NUNCA desbordan hacia la
            esquina del PiP aunque su suma natural sea mayor: se centran DENTRO de este ancho. */}
        <div style={{ width: 1000, display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-start" }}>
          {legs.map((l, i) => {
            const at = 10 + i * 10;
            const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.8, stiffness: 130 } });
            const legAccent = legAccents[i % legAccents.length];
            return (
              <div key={i} style={{ opacity: s, transform: `translateY(${(1 - s) * 22}px)`, textAlign: "center" }}>
                {/* (a) fondo textura por columna, con halo de color propio */}
                <RimLight color={legAccent} spread={22} x={0.5} y={0.15}>
                  <div style={{ position: "relative", width: 320, height: 234, borderRadius: 28, overflow: "hidden" }}>
                    <ParallaxLayer depth={0.1 + i * 0.05} driftY={6}>
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${COLORS.bg1}, ${COLORS.bg2})` }} />
                    </ParallaxLayer>
                    {/* (b) midground foto recortada con borde marcador coloreado por concepto */}
                    <div style={{ position: "absolute", inset: 14, borderRadius: 20, overflow: "hidden", border: `6px solid ${legAccent}`, filter: "drop-shadow(0 18px 22px rgba(42,38,32,0.24))" }}>
                      <Img src={vt(l.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0) 65%, ${legAccent}22 100%)` }} />
                    </div>
                    {/* (c) foreground: número de pata */}
                    <div
                      style={{
                        position: "absolute",
                        left: -6,
                        top: -6,
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        background: legAccent,
                        color: "#F7F1DF",
                        fontWeight: 900,
                        fontSize: 35,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 14px 24px rgba(42,38,32,0.3)",
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                </RimLight>
                <div style={{ marginTop: 16, fontSize: 32, fontWeight: 800, color: COLORS.text }}>{l.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 18) NightDayCycle — ciclo día/noche: ventilador empujando aire afuera de noche
//     vs persianas cerradas de día (rotación de 2 fases con flecha de reloj).
// ─────────────────────────────────────────────────────────────────────────────
export const NightDayCycle: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "De noche afuera, de día todo cerrado" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Panel: React.FC<{ img: string; label: string; icon: string; at: number }> = ({ img, label, icon, at }) => {
    const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.8, stiffness: 130 } });
    return (
      <div style={{ opacity: s, transform: `translateY(${(1 - s) * 18}px)`, textAlign: "center" }}>
        <div style={{ position: "relative", width: 380, height: 292, borderRadius: 26, overflow: "hidden", border: `6px solid ${COLORS.bg2}`, filter: "drop-shadow(0 24px 28px rgba(42,38,32,0.26))" }}>
          <Img src={vt(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: 12, left: 12, fontSize: 44 }}>{icon}</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 32, fontWeight: 800, color: COLORS.text }}>{label}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["top-wide"], opacity: enter * out }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.text, marginBottom: 26, textAlign: "center" }}>{title}</div>
        <div style={{ display: "flex", gap: 58, justifyContent: "center", alignItems: "center" }}>
          <Panel img="vt_fan_window_pushing_heat_out.png" label="Noche: aire cruzado" icon="\u{1F319}" at={10} />
          <svg width={100} height={58} viewBox="0 0 70 40">
            <InkDraw d="M 4 20 L 60 20" at={24} duration={14} length={70} color={COLORS.amber} width={5} />
            <InkDraw d="M 48 8 L 62 20 L 48 32" at={30} duration={12} length={40} color={COLORS.amber} width={5} />
          </svg>
          <Panel img="vt_closed_blinds_afternoon.png" label="Día: persiana y cortina" icon="☀️" at={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 19) CostVsCard — costo centavos (congelar botellas) vs factura de AC. Barra
//     comparativa horizontal simple, en la franja izquierda.
// ─────────────────────────────────────────────────────────────────────────────
export const CostVsCard: React.FC<{
  durationInFrames: number;
  title?: string;
  cheapLabel?: string;
  expensiveLabel?: string;
  cheapValue?: number;
  expensiveValue?: number;
}> = ({
  durationInFrames,
  title = "Centavos contra una fortuna",
  cheapLabel = "Congelar 2 botellas",
  expensiveLabel = "Aire acondicionado",
  cheapValue = 2,
  expensiveValue = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maxV = Math.max(cheapValue, expensiveValue);

  const Bar: React.FC<{ label: string; value: number; color: string; at: number }> = ({ label, value, color, at }) => {
    const s = spring({ frame: frame - at, fps, config: { damping: 18, mass: 1, stiffness: 90 }, durationInFrames: 40 });
    const w = (value / maxV) * 460 * s;
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.textSoft }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color }}>${value}</div>
        </div>
        <div style={{ position: "relative", height: 44, width: 460, background: "rgba(42,38,32,0.08)", borderRadius: 12 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 44, width: w, background: color, borderRadius: 12, boxShadow: `0 9px 20px ${color}44` }} />
        </div>
      </div>
    );
  };

  const multiplier = Math.round(expensiveValue / Math.max(cheapValue, 1));

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS.left, opacity: enter * out }}>
        <DepthShadow distance={48} radius={28} color="rgba(42,38,32,0.2)">
          <div style={{ background: "linear-gradient(160deg, rgba(245,238,220,0.95), rgba(222,210,182,0.92))", border: "3px solid rgba(42,38,32,0.16)", borderRadius: 28, padding: "40px 46px", width: 940, display: "flex", gap: 40, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.text, marginBottom: 24 }}>{title}</div>
              <Bar label={cheapLabel} value={cheapValue} color={COLORS.good} at={8} />
              <Bar label={expensiveLabel} value={expensiveValue} color={COLORS.danger} at={16} />
            </div>
            {/* DATO dominante: el múltiplo de diferencia, jerarquía #1 de la card */}
            <div style={{ textAlign: "center", opacity: spring({ frame: frame - 20, fps, config: { damping: 15, mass: 0.8, stiffness: 130 } }) }}>
              <Odometer value={multiplier} digits={2} prefix="x" size={68} color={COLORS.danger} durationInFrames={45} />
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textSoft, marginTop: 4, maxWidth: 160 }}>más barato</div>
            </div>
          </div>
        </DepthShadow>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 20) RecapNumberedList — recap final de 6 puntos, scroll compacto lower-left.
// ─────────────────────────────────────────────────────────────────────────────
export const RecapNumberedList: React.FC<{
  durationInFrames: number;
  heading?: string;
  items?: string[];
  accent?: string;
}> = ({
  durationInFrames,
  heading = "Repaso rápido",
  items = [
    "El ventilador solo mueve el aire",
    "El aire pasa por hielo antes de tirártelo",
    "Botellas grandes, cuanto más hielo mejor",
    "El secreto de la sal",
    "No enfría la pieza, enfría tu burbuja",
    "Cerca y apuntándote, nunca lejos",
  ],
  accent = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["full-left"], opacity: enter * out }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 39, fontWeight: 800, color: COLORS.text }}>{heading}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: accent, letterSpacing: 2, textTransform: "uppercase" }}>{items.length} puntos clave</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {items.map((it, i) => {
            const at = 8 + i * 6;
            const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.6, stiffness: 160 } });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  opacity: s,
                  transform: `translateX(${(1 - s) * -18}px)`,
                  background: "rgba(245,238,220,0.5)",
                  borderRadius: 16,
                  padding: "8px 16px 8px 8px",
                }}
              >
                <div style={{ position: "relative", width: 46, height: 46, borderRadius: 23, background: accent, flexShrink: 0 }}>
                  <svg viewBox="0 0 46 46" width={46} height={46} style={{ position: "absolute", inset: 0 }}>
                    <InkDraw d="M 13 24 L 20 32 L 34 15" at={at + 6} duration={12} length={40} color="#F7F1DF" width={5} />
                  </svg>
                </div>
                <div style={{ fontSize: 31, fontWeight: 700, color: COLORS.text }}>{it}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 21) ManualCTACard — cierre: manual + garantía + precio, tarjeta izquierda con
//     sello de garantía.
// ─────────────────────────────────────────────────────────────────────────────
export const ManualCTACard: React.FC<{
  durationInFrames: number;
  heading?: string;
  bullets?: string[];
  guarantee?: string;
  accent?: string;
}> = ({
  durationInFrames,
  heading = "El manual del constructor libre",
  bullets = ["40 arreglos de los viejos", "De 1 a 5 dólares", "Frío, calor, humedad, óxido"],
  guarantee = "Garantía 7 días",
  accent = COLORS.amber,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS["full-left"], opacity: enter * out, display: "flex", gap: 34, alignItems: "flex-start" }}>
        <Frame3D rotateY={-12} rotateX={4} depth={50}>
          <DepthShadow distance={56} radius={22} color="rgba(42,38,32,0.26)" style={{ width: 330, height: 450, overflow: "hidden" }}>
            <div style={{ width: 330, height: 450, border: `6px solid ${COLORS.bg2}`, borderRadius: 22, overflow: "hidden" }}>
              <Img src={vt("vt_manual_constructor_libre.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </DepthShadow>
        </Frame3D>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.text, marginBottom: 20 }}>{heading}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 15, marginBottom: 22 }}>
            {bullets.map((b, i) => {
              const at = 10 + i * 8;
              const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.7, stiffness: 150 } });
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 15, opacity: s, transform: `translateX(${(1 - s) * -16}px)` }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: accent }} />
                  <div style={{ fontSize: 35, fontWeight: 700, color: COLORS.text }}>{b}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <WaxSeal at={30} size={108} color={COLORS.good} initials="7d" />
            <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.good }}>{guarantee}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 22) NextVideoTeaser — teaser del próximo video (invierno / olla de barro),
//     placa esquina superior-izquierda con ícono.
// ─────────────────────────────────────────────────────────────────────────────
export const NextVideoTeaser: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
}> = ({ durationInFrames, title = "El próximo: calentar sin gas", subtitle = "Una olla de barro y unas velas", accent = COLORS.danger }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, mass: 0.8, stiffness: 140 } });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <div style={{ ...DOCKS.top, opacity: s * out, transform: `translateY(${(1 - s) * -16}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 156, height: 156, borderRadius: 26, overflow: "hidden", border: `6px solid ${accent}`, flexShrink: 0, filter: "drop-shadow(0 20px 26px rgba(42,38,32,0.26))" }}>
            <Img src={vt("vt_next_video_heating_teaser.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 23, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", color: accent }}>Próximo video</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.text }}>{title}</div>
            <div style={{ fontSize: 29, fontWeight: 600, color: COLORS.textSoft }}>{subtitle}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default {
  EyebrowKicker,
  FrictionCard,
  SecretSealCard,
  PromiseChecklist,
  FanFailProof,
  EvaporationPhysics,
  FanBottleAssembly,
  WrongVsRightPlacement,
  BottleSizeGauge,
  SaltPhysicsDiagram,
  StepByStepBuild,
  DripTrayCallout,
  RotationCycleDiagram,
  OldTimersStamp,
  MythBusterCard,
  DistanceLimitWarning,
  ThreeLegsDiagram,
  NightDayCycle,
  CostVsCard,
  RecapNumberedList,
  ManualCTACard,
  NextVideoTeaser,
};
