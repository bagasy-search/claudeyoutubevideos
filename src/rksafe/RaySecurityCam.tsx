// RaySecurityCam.tsx — TRATAMIENTO de cámara de seguridad para el canal Ray Kessler.
//
// Por qué existe: el b-roll de robos reales de YouTube no se puede usar (licencia estándar +
// Content ID). Este componente hace que un clip o una foto GENERADOS por nosotros se lean como
// material de una cámara de vigilancia: viñeta de gran angular, desaturado y frío, líneas de
// barrido, ruido, timestamp de esquina y el parpadeo de REC. Es reusable en TODO el canal
// (botella, garage, puerta corrediza, llave de repuesto, "the knock that isn't a neighbor").
//
// ⛔ REGLAS DURAS QUE RESPETA:
//  · OffthreadVideo, NUNCA <Video> (en el render <Video> busca por tiempo y no acierta el cuadro
//    exacto → tirón irregular). El clip va MUTEADO: el audio sale del <Audio> del master.
//  · rnd() determinista, NUNCA Math.random() — el farm rinde en 60 chunks paralelos y cada uno
//    sortearía distinto: el ruido "bailaría" en cada costura.
//  · Todo el movimiento por transform de Remotion (subpíxel), nada horneado con ffmpeg.
//  · `image` es OBLIGATORIA aunque pases `clip`: es la cama de foto de abajo. Si el clip tarda
//    en montar o es más corto que el slot, abajo NO queda el fondo plano a la vista.
//  · Sin defaults de texto en español ni de otro video: el label se pasa siempre.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_BODY, rgba, rnd, clamp01 } from "./RayStage";

export const RaySecurityCam: React.FC<{
  /** foto de cama — SIEMPRE, aunque haya clip (evita el fondo plano en los bordes) */
  image: string;
  /** clip opcional; si viene, va encima de la foto */
  clip?: string;
  /** etiqueta de la cámara, arriba a la izquierda. Ej: "CAM 02 · FRONT ENTRY" */
  label?: string;
  /** fecha del sello. Ej: "10 / 14 / 2019" */
  date?: string;
  /** hora de arranque del contador, en segundos desde medianoche (14:07:31 = 50851) */
  clockStart?: number;
  /** 0 = sin tratamiento, 1 = tratamiento completo. Bajalo si el plano ya es oscuro */
  intensity?: number;
  /** empuje lento tipo Ken-Burns (la cámara fija igual respira un poco) */
  push?: boolean;
}> = ({
  image,
  clip,
  label = "CAM 01",
  date = "",
  clockStart = 50851,
  intensity = 1,
  push = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const k = clamp01(intensity);

  // reloj que avanza de verdad, en tiempo real
  const t = Math.floor(clockStart + frame / fps);
  const hh = String(Math.floor(t / 3600) % 24).padStart(2, "0");
  const mm = String(Math.floor(t / 60) % 60).padStart(2, "0");
  const ss = String(t % 60).padStart(2, "0");

  // el REC parpadea ~1 vez por segundo
  const rec = Math.floor(frame / Math.max(1, Math.round(fps / 2))) % 2 === 0;

  // empuje lento y subpíxel
  const z = push ? interpolate(frame, [0, 300], [1.04, 1.10], { extrapolateRight: "clamp" }) : 1.04;

  // barrido horizontal que baja despacio (el "roll" de las cámaras baratas)
  const roll = ((frame * 2.3) % (height + 200)) - 100;

  // micro-saltos de cuadro: cada ~40 frames la imagen se corre 1px. Es lo que más vende el efecto
  const jitterSeed = Math.floor(frame / 40);
  const jx = (rnd(jitterSeed * 1.7) - 0.5) * 2.2 * k;
  const jy = (rnd(jitterSeed * 3.1) - 0.5) * 2.2 * k;

  const MEDIA: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${z.toFixed(4)}) translate(${jx.toFixed(2)}px, ${jy.toFixed(2)}px)`,
    // desaturado + frío + contraste alto: el look del sensor barato de noche
    filter: `saturate(${(1 - 0.62 * k).toFixed(2)}) contrast(${(1 + 0.20 * k).toFixed(2)}) brightness(${(1 - 0.08 * k).toFixed(2)})`,
  };

  const stamp: React.CSSProperties = {
    position: "absolute",
    fontFamily: F_BODY,
    fontWeight: 700,
    fontSize: 30,
    letterSpacing: 2,
    color: rgba("#FFFFFF", 0.86),
    textShadow: "0 2px 6px rgba(0,0,0,0.95)",
  };

  return (
    <AbsoluteFill style={{ background: V.ink0, overflow: "hidden" }}>
      {/* cama de foto — SIEMPRE debajo */}
      <Img src={staticFile(image)} style={MEDIA} />
      {clip ? <OffthreadVideo src={staticFile(clip)} muted style={MEDIA} /> : null}

      {/* tinte frío del sensor */}
      <AbsoluteFill style={{ background: `rgba(24,38,58,${0.16 * k})`, mixBlendMode: "multiply" }} />

      {/* viñeta de gran angular: la esquina alta siempre cae oscura */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 78% 72% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.62 * k).toFixed(2)}) 100%)`,
        }}
      />

      {/* líneas de barrido finas */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,${(0.20 * k).toFixed(2)}) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)`,
        }}
      />

      {/* banda de roll que baja */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: roll,
          height: 130,
          background: `linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,${(0.045 * k).toFixed(3)}), rgba(255,255,255,0))`,
          pointerEvents: "none",
        }}
      />

      {/* ruido determinista: 90 motas, sembradas por bloque de 3 frames */}
      {k > 0.15
        ? Array.from({ length: 90 }).map((_, i) => {
            const s = i * 7.3 + Math.floor(frame / 3) * 0.37;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(rnd(s) * 100).toFixed(2)}%`,
                  top: `${(rnd(s + 1.9) * 100).toFixed(2)}%`,
                  width: 2,
                  height: 2,
                  background: rgba("#FFFFFF", 0.05 + rnd(s + 4.4) * 0.09 * k),
                }}
              />
            );
          })
        : null}

      {/* sellos de cámara */}
      <div style={{ ...stamp, left: 54, top: 44, display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 17,
            height: 17,
            borderRadius: "50%",
            background: rec ? V.danger : rgba(V.danger, 0.22),
            boxShadow: rec ? `0 0 14px ${rgba(V.danger, 0.8)}` : "none",
          }}
        />
        <span>REC</span>
        <span style={{ opacity: 0.72, letterSpacing: 3 }}>{label}</span>
      </div>

      <div style={{ ...stamp, right: 54, top: 44, letterSpacing: 3 }}>{date}</div>
      <div style={{ ...stamp, right: 54, bottom: 44, fontSize: 40, letterSpacing: 4 }}>
        {hh}:{mm}:{ss}
      </div>
    </AbsoluteFill>
  );
};
