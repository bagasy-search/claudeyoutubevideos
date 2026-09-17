// RoutineSwap.tsx — la rutina de Walter como micro-escena 2.5D (adaptación de BenefitScene).
// mode "old": cuatro tarjetas de vidrio con FOTO entran en cascada cuando el doctor nombra cada hábito;
//             el TACHADO rojo cruza cada una con oclusión (pasa por DEBAJO de la tarjeta vecina de la
//             izquierda y por ENCIMA de la suya), con golpe de cámara en cada tachado.
// mode "new": las mismas cuatro vuelven tachadas y apagadas (callback) y en cada cue GIRAN sobre su eje
//             para mostrar el hábito nuevo con tilde teal. Presentación → tensión → resolución.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rgba, CL, ramp, spr, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule, SlashLine } from "./RoweDepth";

type Item = { label: string; img?: string; at?: number; hitAt?: number; newLabel?: string; newImg?: string; flipAt?: number };

export const RoutineSwap: React.FC<{
  mode?: "old" | "new";
  kicker?: string;
  title?: string;
  items?: Item[];
  chip?: string;
  chipAt?: number;
  bed?: string;
  durationInFrames?: number;
}> = ({ mode = "old", kicker = "", title = "", items = [], chip = "", chipAt = 0, bed, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(1, items.length);
  const hits = items.map((it) => (mode === "old" ? it.hitAt ?? -99 : it.flipAt ?? -99));
  const cam = useCam(frame, fps, hits, 0.06, durationInFrames);
  const W = 380, H = 500, GAP = 36;
  const total = n * W + (n - 1) * GAP;
  const x0 = (1920 - total) / 2;
  const headA = ramp(frame, 2, 16);
  const out = ramp(frame, durationInFrames - 9, durationInFrames);

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={16} dim={0.6} bokeh={10} seed={mode === "old" ? 31 : 37} camX={cam.camX} tint={mode === "old" ? V.danger : V.brass} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 58%" }}>
        <Plane depth={0.3} camX={cam.camX} camY={cam.camY} z={1}>
          <div style={{ position: "absolute", left: 130, top: 92, opacity: headA, transform: `translateY(${((1 - headA) * 16).toFixed(1)}px)` }}>
            <KickerRule text={kicker} a={headA} color={mode === "old" ? V.dangerSoft : V.brass} />
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, color: V.white, marginTop: 8, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
          </div>
        </Plane>
        {items.map((it, i) => {
          const depthK = 0.55 + i * 0.1;
          const baseX = x0 + i * (W + GAP);
          const tilt = (i - (n - 1) / 2) * 3.2;
          const yOff = Math.abs(i - (n - 1) / 2) * 16;
          let appear = 1, blur = 0, dim = 0, desat = 0, slashU = 0, rotY = 0, showNew = false, check = 0, lift = 0;
          if (mode === "old") {
            const at = it.at ?? 0;
            appear = spr(frame, fps, at, 120, 0.9);
            const hit = it.hitAt ?? 99999;
            slashU = ramp(frame, hit, hit + 8);
            dim = ramp(frame, hit + 3, hit + 16) * 0.8;
            desat = dim;
            // ítem recién nombrado adelante y nítido; los anteriores, un paso atrás
            const later = items.slice(i + 1).map((o) => o.at ?? 0).filter((a) => frame >= a).length;
            blur = later ? 1.6 : 0;
            lift = later ? 0 : interpolate(appear, [0, 1], [0, -14]);
          } else {
            slashU = 1;
            appear = spr(frame, fps, i * 3, 120, 0.9);
            const fl = it.flipAt ?? 99999;
            const p = interpolate(frame, [fl, fl + 12], [0, 1], CL);
            rotY = p < 0.5 ? p * 180 : (p - 1) * 180;
            showNew = p >= 0.5;
            dim = showNew ? 0 : 0.8; desat = dim;
            check = spr(frame, fps, fl + 10, 110, 0.7);
            const flippedLater = items.slice(i + 1).some((o) => frame >= (o.flipAt ?? 99999) + 12);
            blur = showNew && flippedLater ? 1.2 : 0;
            lift = showNew && !flippedLater ? -16 : 0;
          }
          const z = 10 + (n - i) * 2;
          const y = 290 + yOff + lift + interpolate(appear, [0, 1], [90, 0]);
          return (
            <React.Fragment key={i}>
              <Plane depth={depthK} camX={cam.camX} camY={cam.camY} z={z}>
                <div style={{
                  position: "absolute", left: baseX, top: y, opacity: appear,
                  transform: `perspective(1600px) rotateZ(${tilt}deg) rotateY(${rotY.toFixed(2)}deg) scale(${interpolate(appear, [0, 1], [0.9, 1]).toFixed(3)})`,
                }}>
                  <GlassPhoto img={showNew ? it.newImg : it.img} w={W} h={H} blur={blur} dim={dim} desat={desat}
                    label={showNew ? it.newLabel : it.label} labelSize={40}
                    glow={showNew ? V.brass : undefined} glowK={showNew ? check * (blur ? 0.35 : 1) : 0} push={frame * 0.0002} />
                  {showNew ? (
                    <div style={{ position: "absolute", top: -24, right: -24, width: 70, height: 70, borderRadius: "50%", background: V.brass, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${check.toFixed(3)})`, boxShadow: `0 10px 26px ${rgba(V.brass, 0.6)}` }}>
                      <svg width={40} height={40} viewBox="0 0 40 40"><path d="M9 21 L17 29 L31 12" fill="none" stroke={V.ink0} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  ) : null}
                </div>
              </Plane>
              {/* tachado: entre esta tarjeta (debajo) y la vecina izquierda (encima) */}
              {!showNew ? (
                <Plane depth={depthK} camX={cam.camX} camY={cam.camY} z={z + 1}>
                  <div style={{ opacity: appear * (mode === "new" ? 1 - interpolate(frame, [(it.flipAt ?? 99999) - 2, (it.flipAt ?? 99999) + 4], [0, 1], CL) : 1) }}>
                    <SlashLine d={`M${baseX - 40} ${y + H * 0.8} L${baseX + W + 30} ${y + H * 0.2}`} u={slashU} width={18} />
                  </div>
                </Plane>
              ) : null}
            </React.Fragment>
          );
        })}
        {chip ? (
          <Plane depth={1} camX={cam.camX} camY={cam.camY} z={60}>
            <div style={{ position: "absolute", left: "50%", top: 872, transform: `translate(-50%,0) scale(${spr(frame, fps, chipAt, 120, 0.7).toFixed(3)})`, opacity: spr(frame, fps, chipAt, 120, 0.7) }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 36px", borderRadius: 999, background: mode === "old" ? V.danger : V.brass, boxShadow: `0 20px 44px ${rgba("#000", 0.5)}` }}>
                <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 44, letterSpacing: 3, color: mode === "old" ? V.white : V.ink0, textTransform: "uppercase" }}>{chip}</span>
              </div>
            </div>
          </Plane>
        ) : null}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={mode === "old" ? 41 : 43} />
    </AbsoluteFill>
  );
};
