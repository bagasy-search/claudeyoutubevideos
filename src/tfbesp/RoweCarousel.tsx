// RoweCarousel.tsx — anillo 3D de tarjetas con FOTO para "the five areas" (adaptación del carrusel
// hero del canal renal a la marca Dr. Emmett Rowe: navy + teal, sin fondo blanco).
//
// Es UN set-piece que vuelve varias veces con el MISMO reloj: cada aparición es un segmento del
// video (Number one / two / …) y recibe `offset` = cuadros desde que arrancó el carrusel, así el
// anillo retoma donde lo dejó. Todas las tarjetas nacen BORROSAS con CANDADO; al nombrar cada área
// el anillo gira hasta ella con zoom no constante, el candado se abre y la foto entra en foco.
// mode "recap": todas abiertas; el foco salta a cada área cuando el doctor la nombra (`reveals`).
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, eOut, eIO, src, Atmosphere, Finish, SegmentShell, KickerRule } from "./RoweDepth";

export type RoweCard = { name: string; img?: string };

const Padlock: React.FC<{ u: number; size?: number }> = ({ u, size = 96 }) => {
  const lift = interpolate(u, [0, 0.6], [0, -14], CL);
  const rot = interpolate(u, [0, 0.6], [0, -32], CL);
  const op = interpolate(u, [0.5, 1], [1, 0], CL);
  const pop = interpolate(u, [0, 0.6, 1], [1, 1.12, 1.35]);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity: op, transform: `scale(${pop})`, filter: `drop-shadow(0 8px 18px ${rgba("#000", 0.55)})` }}>
      <g style={{ transformOrigin: "62px 40px", transform: `translateY(${lift}px) rotate(${rot}deg)` }}>
        <path d="M32 46 V34 a18 18 0 0 1 36 0 V46" fill="none" stroke="#EAD9B5" strokeWidth={9} strokeLinecap="round" />
      </g>
      <rect x="24" y="44" width="52" height="42" rx="10" fill={V.brass} />
      <rect x="24" y="44" width="52" height="42" rx="10" fill="none" stroke={rgba("#ffffff", 0.55)} strokeWidth={1.5} />
      <circle cx="50" cy="62" r="6" fill={V.ink0} />
      <rect x="47.5" y="64" width="5" height="12" rx="2.5" fill={V.ink0} />
    </svg>
  );
};

export const RoweCarousel: React.FC<{
  cards?: RoweCard[];
  reveals?: number[];     // cuadros de CARRUSEL (no del segmento) en que se nombra cada área
  offset?: number;        // cuadros de carrusel ya transcurridos cuando arranca este segmento
  introDur?: number;
  kicker?: string;
  title?: string;
  bed?: string;
  mode?: "reveal" | "recap";
  durationInFrames?: number;
}> = ({ cards = [], reveals = [], offset = 0, introDur = 44, kicker = "", title = "", bed, mode = "reveal", durationInFrames = 120 }) => {
  const local = useCurrentFrame();
  const frame = local + offset;
  const { fps, width, height } = useVideoConfig();
  const N = Math.max(1, cards.length);
  const cx = width / 2, cy = height * 0.585, Rx = width * 0.27;
  const eg = mode === "recap" ? 1 : interpolate(frame, [0, introDur], [0, 1], CL);

  let focus = -1;
  for (let i = 0; i < reveals.length; i++) if (frame >= reveals[i]) focus = i;
  const TRANS = fps * 0.7;
  let displayIndex: number;
  if (focus < 0) displayIndex = -1 + Math.sin((frame / fps) * 0.5) * 0.06;
  else {
    const frac = interpolate(frame, [reveals[focus], reveals[focus] + TRANS], [0, 1], { ...CL, easing: eIO });
    displayIndex = focus - 1 + frac;
  }
  const breathe = Math.sin((frame / fps) * 0.7) * 0.016;
  let zoomPulse = 0;
  if (focus >= 0) zoomPulse = Math.sin(interpolate(frame, [reveals[focus], reveals[focus] + fps * 0.6], [0, 1], CL) * Math.PI) * 0.05;
  const introZoom = interpolate(eg, [0, 1], [1.14, 1], { easing: eOut });
  const stageZoom = introZoom + breathe + zoomPulse;
  const driftX = Math.sin((frame / fps) * 0.4) * 12;
  const followY = interpolate(eg, [0, 1], [70, 0], { easing: eOut });
  const anglePer = (Math.PI * 2) / N;
  const headA = mode === "recap" ? interpolate(local, [4, 16], [0, 1], CL) : interpolate(eg, [0.3, 1], [0, 1], CL);

  return (
    <SegmentShell frame={local} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed} blur={22} dim={0.66} bokeh={11} seed={21} camX={driftX} />
      <div style={{ position: "absolute", top: 66, left: 0, right: 0, textAlign: "center", opacity: headA, zIndex: 200 }}>
        <KickerRule text={kicker} a={headA} center />
        <div style={{ fontFamily: F_DISPLAY, fontSize: 66, fontWeight: 700, color: V.white, marginTop: 8, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
      </div>
      <AbsoluteFill style={{ transform: `translate(${driftX}px, ${followY}px) scale(${stageZoom})`, transformOrigin: "50% 58%", perspective: 1700 }}>
        {cards.map((card, i) => {
          const theta = (i - displayIndex) * anglePer;
          const sinT = Math.sin(theta), cosT = Math.cos(theta);
          const depth = (cosT + 1) / 2;
          const x = sinT * Rx;
          const yArc = (1 - cosT) * 30;
          const scale = 0.58 + depth * 0.62;
          const blurD = (1 - depth) * 8;
          const opacity = 0.3 + depth * 0.7;
          const z = Math.round(depth * 100);
          const tilt = -sinT * 26;
          const aStart = i === 0 ? 0 : Math.min(0.42 + i * 0.12, 0.94);
          const appear = interpolate(eg, [aStart, Math.min(aStart + 0.3, 1)], [0, 1], { ...CL, easing: eOut });
          const enterY = interpolate(appear, [0, 1], [760, 0]);
          const enterS = interpolate(appear, [0, 1], [0.82, 1]);
          const r = reveals[i];
          const u = mode === "recap" ? 1 : typeof r === "number" ? interpolate(frame, [r, r + fps * 0.55], [0, 1], { ...CL, easing: eOut }) : 0;
          const lockBlur = interpolate(u, [0, 1], [18, 0]);
          const isFocus = i === focus;
          const glowK = isFocus ? (mode === "recap" ? interpolate(frame, [r, r + 8], [0, 1], CL) : u) : 0;
          return (
            <div key={i} style={{
              position: "absolute", left: cx, top: cy, width: 450, height: 570, zIndex: z,
              opacity: opacity * appear,
              transform: `translate(-50%,-50%) translate(${x}px, ${yArc + enterY}px) scale(${scale * enterS}) rotateY(${tilt}deg)`,
              filter: blurD > 0.1 ? `blur(${blurD.toFixed(2)}px)` : undefined,
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", background: V.ink1,
                border: `1px solid ${rgba("#EAD9B5", 0.45)}`,
                boxShadow: `0 44px 90px ${rgba("#0A0604", 0.7)}, 0 10px 26px ${rgba("#0A0604", 0.5)}${glowK ? `, 0 0 0 3px ${rgba(V.brass, 0.95 * glowK)}, 0 0 70px ${rgba(V.brass, 0.55 * glowK)}` : ""}`,
              }}>
                {card.img ? <Img src={src(card.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `blur(${lockBlur.toFixed(2)}px) saturate(${(0.55 + u * 0.5).toFixed(2)})`, transform: `scale(${(1.08 - u * 0.06).toFixed(3)})` }} /> : null}
                <div style={{ position: "absolute", inset: 0, background: rgba("#1A120C", interpolate(u, [0, 1], [0.55, 0])) }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "42%", background: `linear-gradient(${rgba("#ffffff", 0.22)}, transparent)` }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "60px 24px 24px", background: `linear-gradient(transparent, ${rgba("#050B14", 0.9)})`, opacity: u, transform: `translateY(${interpolate(u, [0, 1], [18, 0])}px)` }}>
                  <div style={{ fontFamily: F_DISPLAY, fontSize: 46, fontWeight: 700, color: V.white, textTransform: "uppercase", lineHeight: 1 }}>{card.name}</div>
                </div>
              </div>
              <div style={{
                position: "absolute", top: -20, left: -20, width: 60, height: 60, borderRadius: "50%", background: isFocus ? V.amber : V.brass, color: V.ink0,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_BODY, fontSize: 32, fontWeight: 800,
                boxShadow: `0 8px 22px ${rgba(isFocus ? V.amber : V.brass, 0.55)}`, opacity: appear,
              }}>{i + 1}</div>
              {u < 1 ? (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Padlock u={u} />
                </div>
              ) : null}
            </div>
          );
        })}
      </AbsoluteFill>
      <Finish frame={frame} camX={driftX} seed={23} />
    </SegmentShell>
  );
};
