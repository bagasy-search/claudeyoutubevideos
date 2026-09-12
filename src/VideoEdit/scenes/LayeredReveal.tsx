// LayeredReveal.tsx — REVELADO POR CAPAS CON ZOOM (cinematográfico, marca terrosa).
// Patrón canónico pedido por el usuario (la receta del bórax):
//   1) Entra una IMAGEN PRINCIPAL + su texto → Ken Burns ZOOM IN lento.
//   2) Cuando se menciona el primer sub-elemento → la principal hace ZOOM OUT, se
//      DESENFOCA (blur) y se OSCURECE (rack focus: baja al fondo) → profundidad real.
//   3) Entran DEBAJO sub-imágenes, UNA POR UNA, cada una a su frame (anclado a la
//      palabra exacta en captions). Cada sub-reveal recibe el FOCO: escala arriba,
//      nítida y clara; las anteriores bajan un punto de escala y se apagan un poco.
//   4) Todo determinista por frame (useCurrentFrame + interpolate/spring), sin estado
//      externo, con imágenes (no video) → seguro para el render por chunks del farm.
//
// Props:
//   main:  { image, caption }         — la imagen que ancla el momento (bórax, etc.)
//   subs:  [{ image, caption, atFrame }]  — sub-revelados escalonados. atFrame = frame
//          LOCAL (relativo al inicio del componente) en que ese sub aparece; lo calcula
//          build_madera desde el ms exacto de la palabra en captions.
//   accent: color de acento (blue/amber/green/red — misma convención que MaderaCards).
import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, acc } from "../overlays/ui";

const PAPER = "#efe7d3"; // pergamino de marca
const INK = "#2a2620"; // tinta marrón oscura
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Sub = { image: string; caption: string; atFrame: number };

// ── marco de foto de pergamino (borde crema + sombra profunda) ──
const PhotoFrame: React.FC<{
  image: string;
  w: number;
  h: number;
  zoom: number; // ken-burns scale interno de la imagen
  panX?: number; // -1..1, desplazamiento interno
  blur: number; // px
  dim: number; // 0..1 oscurecimiento
  accent: string;
  focused: boolean;
}> = ({ image, w, h, zoom, panX = 0, blur, dim, accent, focused }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: 16,
      overflow: "hidden",
      border: `2px solid ${focused ? accent : "rgba(239,231,211,0.35)"}`,
      boxShadow: focused
        ? `0 30px 70px rgba(0,0,0,0.6), 0 0 0 4px ${accent}44`
        : "0 16px 40px rgba(0,0,0,0.45)",
      transition: "none",
    }}
  >
    <Img
      src={staticFile(image)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${zoom}) translateX(${panX * 4}%)`,
        filter: `blur(${blur}px)`,
        willChange: "transform, filter",
      }}
    />
    {/* rack-focus dim: la capa de atrás baja al fondo con un velo oscuro */}
    {dim > 0.001 && (
      <div style={{ position: "absolute", inset: 0, background: `rgba(18,12,7,${0.62 * dim})` }} />
    )}
    {/* viñeta interna suave */}
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 -60px 90px rgba(0,0,0,0.35)" }} />
  </div>
);

// ── etiqueta de texto sobre pergamino (entra desde abajo) ──
const Caption: React.FC<{ text: string; accent: string; p: number; big?: boolean }> = ({ text, accent, p, big }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: SANS,
      color: INK,
      background: PAPER,
      fontSize: big ? 40 : 30,
      fontWeight: 800,
      lineHeight: 1.1,
      padding: big ? "12px 26px" : "8px 18px",
      borderRadius: 10,
      borderLeft: `5px solid ${accent}`,
      boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
      opacity: p,
      transform: `translateY(${(1 - p) * 22}px)`,
      willChange: "transform, opacity",
      maxWidth: big ? 720 : 360,
      textAlign: "center",
    }}
  >
    {text}
  </div>
);

export const LayeredReveal: React.FC<{
  durationInFrames: number;
  main: { image: string; caption: string };
  subs?: Sub[];
  accent?: string;
  eyebrow?: string;
}> = ({ durationInFrames, main, subs = [], accent, eyebrow }) => {
  const a = acc(accent);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // entrada/salida global del conjunto (fade corto)
  const inOp = interpolate(f, [0, Math.round(fps * 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(f, [durationInFrames - Math.round(fps * 0.5), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inOp, outOp);

  // ── cuántos subs ya "entraron" a esta altura del frame ──
  const revealedCount = subs.filter((s) => f >= s.atFrame).length;
  const anySubs = subs.length > 0;
  // progreso 0..1 del sub más reciente que entró (para el rack-focus de la principal)
  const firstSubAt = anySubs ? subs[0].atFrame : durationInFrames + 1;
  const subsPhase = interpolate(f, [firstSubAt, firstSubAt + Math.round(fps * 0.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── PRINCIPAL: ken-burns zoom IN lento hasta que llega el 1er sub, ahí ZOOM OUT + blur + dim ──
  const kenIn = interpolate(f, [0, firstSubAt > 0 ? firstSubAt : durationInFrames], [1.02, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mainZoom = anySubs ? interpolate(easeInOut(subsPhase), [0, 1], [kenIn, 1.0]) : kenIn;
  const mainBlur = anySubs ? interpolate(easeInOut(subsPhase), [0, 1], [0, 7]) : 0;
  const mainDim = anySubs ? interpolate(easeInOut(subsPhase), [0, 1], [0, 0.55]) : 0;
  // la principal encoge y sube a "banner" arriba cuando entran los subs
  const mainScaleOuter = anySubs ? interpolate(easeInOut(subsPhase), [0, 1], [1, 0.7]) : 1;
  const mainShiftY = anySubs ? interpolate(easeInOut(subsPhase), [0, 1], [0, -140]) : 0;

  // layout de la principal
  const MW = 1180, MH = 620;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* fondo pergamino oscuro con viñeta (profundidad) */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 120% at 50% 40%, #241a10 0%, #16100a 100%)",
        }}
      />
      {eyebrow && (
        <div
          style={{
            position: "absolute",
            top: 46,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: SANS,
            color: a,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(f, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}
        >
          {eyebrow}
        </div>
      )}

      {/* ── CAPA DE ATRÁS: la imagen principal ── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: anySubs ? "flex-start" : "center", flexDirection: "column", paddingTop: anySubs ? 120 : 0 }}>
        <div
          style={{
            transform: `translateY(${mainShiftY}px) scale(${mainScaleOuter})`,
            willChange: "transform",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <PhotoFrame image={main.image} w={MW} h={MH} zoom={mainZoom} blur={mainBlur} dim={mainDim} accent={a} focused={revealedCount === 0} />
          {/* caption de la principal — grande al inicio, se apaga cuando entran subs */}
          <div style={{ opacity: 1 - 0.65 * subsPhase }}>
            <Caption text={main.caption} accent={a} p={interpolate(f, [8, Math.round(fps * 0.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} big />
          </div>
        </div>
      </AbsoluteFill>

      {/* ── CAPA DE ADELANTE: los sub-revelados, uno por uno, con FOCO ── */}
      {anySubs && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90 }}>
          <div style={{ display: "flex", gap: 44, alignItems: "flex-end", justifyContent: "center" }}>
            {subs.map((s, i) => {
              if (f < s.atFrame - Math.round(fps * 0.15)) return null; // aún no aparece
              const local = f - s.atFrame;
              const inP = spring({ frame: local, fps, config: { damping: 16, stiffness: 120 } });
              // ¿es el sub que tiene el FOCO ahora? (el último que entró)
              const isLatest = i === revealedCount - 1;
              // foco: el último entra grande y nítido; los previos bajan de escala y se apagan un poco
              const focusScale = isLatest ? 1.0 : 0.82;
              const focusDim = isLatest ? 0 : 0.4;
              const focusBlur = isLatest ? 0 : 2.5;
              const SW = 460, SH = 360;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    opacity: inP,
                    transform: `translateY(${(1 - inP) * 60}px) scale(${(0.9 + 0.1 * inP) * focusScale})`,
                    willChange: "transform, opacity",
                  }}
                >
                  <PhotoFrame image={s.image} w={SW} h={SH} zoom={1.04 + 0.04 * easeOut(Math.min(1, local / (fps * 2)))} blur={focusBlur} dim={focusDim} accent={a} focused={isLatest} />
                  <Caption text={s.caption} accent={a} p={inP} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
