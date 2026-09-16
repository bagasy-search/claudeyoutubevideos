// RowePresenter.tsx — LA PRESENTACIÓN del Dr. Emmett Rowe (adaptación del PresenterIntro del canal
// renal a esta marca). Bloque de vidrio navy con filo ámbar + nombre en ORO con un brillo que barre +
// el doctor recortado (PNG sin fondo, derivado de la ref del avatar) que SUBE superpuesto al bloque +
// punto verde "en línea". Detrás: su propio consultorio desenfocado (profundidad), bokeh, polvo y luz.
//
// mode "intro"   → "I'm Doctor Emmett Rowe…"
// mode "signoff" → el cierre: mismo bloque (callback) + botón SUBSCRIBE que se pulsa + campana.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, ramp, spr, GOLD, src, Atmosphere, Finish, Plane, useCam } from "./RoweDepth";

export const RowePresenter: React.FC<{
  name?: string;
  role?: string;
  kicker?: string;
  img?: string;
  bg?: string;
  mode?: "intro" | "signoff";
  cta?: string;
  durationInFrames?: number;
}> = ({
  name = "Dr. Emmett Rowe",
  role = "",
  kicker = "",
  img = "",
  bg = "",
  mode = "intro",
  cta = "SUBSCRIBE",
  durationInFrames = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, [], 0.045, dur);

  const bgIn = ramp(frame, 0, 12);
  const cardIn = spr(frame, fps, 3, 150, 0.8);
  const docIn = spr(frame, fps, 10, 150, 0.95);
  const nameWipe = ramp(frame, 18, 42);
  const roleIn = ramp(frame, 38, 56);
  const dot = 0.6 + 0.4 * Math.sin((frame / fps) * Math.PI * 2.6);
  const shine = ((frame % 84) / 84) * 150 - 25;
  const GOLD_SHINE = `linear-gradient(100deg, transparent ${shine - 14}%, rgba(255,250,228,0.95) ${shine}%, transparent ${shine + 14}%)`;
  // salida: todo el bloque retrocede con blur (sin fundido a negro: debajo vuelve el avatar)
  const out = ramp(frame, dur - 10, dur);

  // botón del cierre
  const press = mode === "signoff" ? ramp(frame, 50, 56) : 0;
  const pressed = mode === "signoff" && frame >= 56;
  const bellK = mode === "signoff" ? ramp(frame, 60, 90) : 0;
  const bellRot = mode === "signoff" && frame > 60 && frame < 96 ? Math.sin((frame - 60) * 0.9) * 18 * (1 - bellK) : 0;

  const nameStyle: React.CSSProperties = { fontFamily: F_DISPLAY, fontSize: 92, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", lineHeight: 1.05 };

  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 12).toFixed(1)}px)` : undefined, transform: `scale(${(1 + out * 0.05).toFixed(4)})` }}>
      <AbsoluteFill style={{ opacity: bgIn }}>
        <Atmosphere frame={frame} img={bg || undefined} blur={18} dim={0.62} bokeh={10} seed={7} camX={cam.camX} />
        {/* halo dorado detrás del bloque */}
        <AbsoluteFill style={{ background: `radial-gradient(46% 50% at 52% 54%, ${rgba("#E9C46E", 0.13)} 0%, transparent 70%)` }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        {/* bloque de vidrio navy (plano medio) */}
        <Plane depth={0.6} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{
            position: "absolute", left: 420, top: 350, width: 1340, height: 400, borderRadius: 30, overflow: "hidden",
            background: `linear-gradient(145deg, ${rgba("#17243A", 0.97)} 0%, ${rgba("#0A1220", 0.98)} 100%)`,
            border: `1px solid ${rgba("#E9C46E", 0.3)}`,
            boxShadow: `0 60px 120px rgba(0,0,0,0.65), 0 14px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)`,
            transform: `translateX(${interpolate(cardIn, [0, 1], [110, 0]).toFixed(1)}px) perspective(1800px) rotateY(${interpolate(cardIn, [0, 1], [-9, -1.5]).toFixed(2)}deg)`,
            opacity: cardIn,
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GOLD, opacity: 0.85 }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${shine - 20}%, ${rgba("#ffffff", 0.05)} ${shine}%, transparent ${shine + 20}%)` }} />
            <div style={{ position: "absolute", left: 560, top: "50%", transform: "translateY(-50%)", right: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: ramp(frame, 16, 30) }}>
                <div style={{ width: 46, height: 3, background: V.brass, boxShadow: `0 0 12px ${rgba(V.brass, 0.8)}` }} />
                <div style={{ fontFamily: F_DISPLAY, fontSize: 28, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase", color: V.brass }}>{kicker}</div>
              </div>
              <div style={{ position: "relative", marginTop: 6, height: 104, clipPath: `inset(-10px ${((1 - nameWipe) * 100).toFixed(2)}% -10px 0)` }}>
                <div style={{ ...nameStyle, backgroundImage: GOLD }}>{name}</div>
                <div style={{ ...nameStyle, position: "absolute", inset: 0, backgroundImage: GOLD_SHINE }}>{name}</div>
              </div>
              <div style={{ fontFamily: F_BODY, fontSize: 34, fontWeight: 500, color: V.bone, marginTop: 8, opacity: roleIn, transform: `translateY(${((1 - roleIn) * 12).toFixed(1)}px)` }}>{role}</div>
              {mode === "signoff" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26, opacity: ramp(frame, 40, 50), transform: `translateY(${((1 - ramp(frame, 40, 50)) * 14).toFixed(1)}px)` }}>
                  <div style={{
                    padding: "14px 34px", borderRadius: 999, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 3,
                    background: pressed ? rgba("#FFFFFF", 0.14) : V.danger, color: V.white,
                    boxShadow: pressed ? "none" : `0 12px 28px ${rgba(V.danger, 0.45)}`,
                    transform: `scale(${(1 - Math.sin(press * Math.PI) * 0.08).toFixed(3)})`,
                    border: `1px solid ${rgba("#ffffff", pressed ? 0.3 : 0)}`,
                  }}>{pressed ? "SUBSCRIBED" : cta}</div>
                  <svg width={54} height={54} viewBox="0 0 24 24" style={{ transform: `rotate(${bellRot.toFixed(1)}deg)`, transformOrigin: "50% 10%", opacity: ramp(frame, 56, 62) }}>
                    <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm0 19a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22z" fill={V.amber} />
                  </svg>
                </div>
              ) : null}
            </div>
          </div>
        </Plane>

        {/* el doctor (hero) sube superpuesto, cabeza por encima del bloque */}
        <Plane depth={0.95} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{
            position: "absolute", left: 70, top: 240, width: 820, height: 513,
            transform: `translateY(${interpolate(docIn, [0, 1], [260, 0]).toFixed(1)}px)`,
            opacity: docIn,
            filter: "drop-shadow(0 34px 50px rgba(0,0,0,0.65))",
            WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          }}>
            {img ? <Img src={src(img)} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} /> : null}
          </div>
          {/* punto "en línea" */}
          <div style={{
            position: "absolute", left: 880, top: 680, width: 34, height: 34, borderRadius: "50%", background: "#35D07F",
            border: `5px solid ${V.ink0}`, boxShadow: `0 0 ${(10 + dot * 16).toFixed(1)}px rgba(53,208,127,${(0.5 + dot * 0.4).toFixed(2)})`,
            opacity: ramp(frame, 26, 34), transform: `translateY(${interpolate(docIn, [0, 1], [260, 0]).toFixed(1)}px) scale(${interpolate(ramp(frame, 26, 34), [0, 1], [0.4, 1], CL).toFixed(3)})`,
          }} />
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={11} />
    </AbsoluteFill>
  );
};
