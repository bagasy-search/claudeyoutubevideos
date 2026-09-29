// Timeline3D — línea de tiempo como ESCENA de documental: una galería en profundidad donde cada hito es
// una copia fotográfica (foto o clip real) suspendida sobre un piso pulido que la refleja, con su año
// EXTRUIDO en 3D al costado y un riel dorado que une los hitos. La cámara viaja (dolly + paneo hacia cada
// hito), con profundidad de campo y niebla; el fondo respira con el propio metraje del hito activo.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "./Media";
import { SERIF, TYPE, SANS, YC, clamp, ease, easeInOut, rnd } from "./theme";

export type TLEvent = { year: string; label: string; src: string; start?: number; now?: boolean };

const SP = 1400;      // separación entre hitos (Z)
const CAM_OFF = 540;  // distancia cámara-hito al enfocar
const FW = 1400, FH = 820; // copia fotográfica
const FLOOR = 470;
const BW = FW + 900, BH = FH * 2 + 900; // caja real del grupo (el filter recorta lo que queda fuera)    // altura del piso (y) respecto del centro

const Year3D: React.FC<{ text: string; color: string; dim: number }> = ({ text, color, dim }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d" }}>
    {Array.from({ length: 10 }, (_, i) => {
      const k = 9 - i; const front = k === 0;
      return <div key={i} style={{ position: "absolute", transform: `translate(-50%, -100%) translateZ(${-k * 3}px)`, fontFamily: SERIF, fontSize: 230, lineHeight: 1,
        whiteSpace: "nowrap", color: front ? color : `rgba(${80 - k * 4}, ${55 - k * 3}, ${12}, ${dim})`, opacity: front ? dim : 1,
        textShadow: front ? `0 0 40px ${color}55` : undefined }}>{text}</div>;
    })}
  </div>
);

export const Timeline3D: React.FC<{ events: TLEvent[]; focus?: number; kicker?: string }> = ({ events, focus, kicker }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const last = focus ?? events.length - 1;
  const n = last + 1;
  const tt = clamp((f - 6) / (D * 0.92));
  const seg = tt * n - 0.001;
  const k = Math.max(0, Math.min(n - 1, Math.floor(seg)));
  const local = seg - k;
  const settle = Math.max(0, k - 1 + easeInOut(clamp(local / 0.55)) * 1) ; // llega al hito k y se queda
  const pos = Math.min(last, Math.max(0, seg < 0 ? 0 : k - 1 + easeInOut(clamp(local / 0.55)))) ;
  const camIdx = Math.max(0, pos);
  const intro = 1 - ease(clamp(f / 26));
  const camZ = -(camIdx * SP) + CAM_OFF + intro * 900;
  const sideOf = (i: number) => (i % 2 === 0 ? -1 : 1);
  // paneo: interpola la x de los dos hitos vecinos
  const i0 = Math.floor(camIdx), i1 = Math.min(n - 1, i0 + 1), fr = camIdx - i0;
  const camX = (sideOf(i0) * 330) * (1 - fr) + (sideOf(i1) * 330) * fr;
  const sway = Math.sin(f / 45) * 14;
  const active = Math.round(camIdx);
  const fade = clamp(f / 8) * (1 - clamp((f - (D - 8)) / 8));
  void settle;

  const motes = Array.from({ length: 28 }, (_, i) => {
    const z = -rnd(i) * SP * (events.length + 1) + 800;
    const x = (rnd(i + 1) - 0.5) * 3600, y = (rnd(i + 2) - 0.5) * 1300 - 150;
    return <div key={i} style={{ position: "absolute", left: 960, top: 540, width: 5, height: 5, borderRadius: 5, background: "rgba(255,226,170,0.55)",
      transform: `translate3d(${x}px, ${y - f * 0.5}px, ${z}px)` }} />;
  });
  const act = events[active];

  return (
    <AbsoluteFill style={{ background: "#0A0806", opacity: fade, overflow: "hidden" }}>
      {/* ambiente: el metraje del hito activo, gigante y desenfocado */}
      {/* ambiente a 1/4 de resolución (el blur grande a pantalla completa es carísimo en swangle) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 480, height: 270, transformOrigin: "0 0", transform: "scale(4.4)", filter: "blur(8px) brightness(0.5) saturate(0.85)", opacity: 0.9 }}>
        <Media src={act.src} start={act.start ?? 0} kb="none" />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(10,8,6,0.2), rgba(10,8,6,0.85) 75%)" }} />
      <AbsoluteFill style={{ perspective: 950, perspectiveOrigin: "50% 38%" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translate3d(${-camX + sway}px, 0, ${-camZ}px)` }}>
          {/* piso pulido */}
          <div style={{ position: "absolute", left: 960 - 1500, top: 540 + FLOOR, width: 3000, height: SP * (events.length + 1), transformOrigin: "50% 0%",
            transform: "rotateX(90deg) translateY(-700px)",
            background: "linear-gradient(180deg, rgba(40,30,20,0.0) 0%, rgba(30,22,14,0.5) 10%, rgba(18,13,9,0.75) 100%)" }} />
          {/* riel dorado */}
          <div style={{ position: "absolute", left: 960 - 5, top: 540 + FLOOR, width: 10, height: SP * (events.length + 1), transformOrigin: "50% 0%",
            transform: "rotateX(90deg) translateY(-700px)", background: `linear-gradient(180deg, ${YC.bus}, rgba(242,183,5,0.2))`, boxShadow: `0 0 36px ${YC.bus}` }} />
          {events.map((e, i) => {
            const z = -i * SP;
            const rel = z - camZ;
            if (rel > -80) return null;
            const dist = Math.abs(rel + CAM_OFF);
            const blur = Math.min(6, dist / 260);
            const dim = clamp(1 - Math.max(0, -rel - CAM_OFF) / (SP * 2.6), 0.08, 1);
            const side = sideOf(i);
            const x = side * 330;
            const isAct = i === active;
            const col = e.now ? YC.apple : YC.bus;
            const live = dist < SP * 2.2;
            return (
              <React.Fragment key={i}>
                {/* nodo del riel */}
                <div style={{ position: "absolute", left: 960 - 34, top: 540 + FLOOR - 34, width: 68, height: 68, borderRadius: 68, transform: `translate3d(0, 0, ${z}px) rotateX(90deg)`,
                  background: col, boxShadow: `0 0 50px ${col}`, opacity: dim }} />
                <div style={{ position: "absolute", left: 960 - BW / 2, top: 540 - BH / 2, width: BW, height: BH, transformStyle: "preserve-3d",
                  transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-side * 16}deg)`, filter: blur > 0.6 ? `blur(${blur}px) brightness(${0.3 + dim * 0.7})` : `brightness(${0.3 + dim * 0.7})` }}>
                  <div style={{ position: "absolute", left: BW / 2, top: BH / 2, transformStyle: "preserve-3d" }}>
                  {/* copia fotográfica con espesor */}
                  <div style={{ position: "absolute", left: -FW / 2, top: -FH / 2 - 60, width: FW, height: FH, background: YC.paper, padding: 22, boxSizing: "border-box",
                    boxShadow: isAct ? "0 50px 120px rgba(0,0,0,0.85), 0 0 0 2px rgba(255,240,200,0.25)" : "0 40px 90px rgba(0,0,0,0.8)" }}>
                    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#000" }}>
                      {live ? <Media src={e.src} start={e.start ?? 0} kb="in" zoom={1.1} filter={e.now ? "saturate(1.05)" : "sepia(0.2) contrast(1.06)"} /> : null}
                    </div>
                  </div>
                  {/* reflejo en el piso */}
                  {live && dist < SP * 0.9 ? (
                    <div style={{ position: "absolute", left: -FW / 2, top: FH / 2 - 60 + 2 * (FLOOR - (FH / 2 - 60)), width: FW, height: FH, transform: "scaleY(-1)", transformOrigin: "50% 50%",
                      opacity: 0.2, background: YC.paper, padding: 22, boxSizing: "border-box" }}>
                      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}><Media src={e.src} start={e.start ?? 0} kb="none" /></div>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,8,6,0) 0%, rgba(10,8,6,1) 55%)" }} />
                    </div>
                  ) : null}
                  {/* año extruido, del lado de adentro */}
                  <div style={{ position: "absolute", left: -side * (FW / 2 - 40), top: -FH / 2 - 70, transformStyle: "preserve-3d", transform: `translateZ(60px) rotateY(${side * 8}deg)` }}>
                    <Year3D text={e.year} color={col} dim={dim} />
                  </div>
                  {/* rótulo */}
                  <div style={{ position: "absolute", left: -FW / 2, top: FH / 2 - 30, width: FW, fontFamily: TYPE, fontSize: 52, lineHeight: 1.2, color: YC.paper,
                    textShadow: "0 3px 16px rgba(0,0,0,0.95)", opacity: dim }}>{e.label}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          {motes}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,6,0.75) 0%, rgba(10,8,6,0) 18%, rgba(10,8,6,0) 82%, rgba(10,8,6,0.6) 100%)" }} />
      {kicker ? <div style={{ position: "absolute", left: 90, bottom: 60, fontFamily: SANS, fontSize: 34, letterSpacing: 12, color: YC.bus, opacity: ease((f - 8) / 14) }}>{kicker}</div> : null}
    </AbsoluteFill>
  );
};
