// Hero.tsx — piezas propias de facafecanas (papel clínico claro, español):
//  HookSplit  · antes/después del pelo sobre el avatar (overlay, la cara queda visible a la izquierda)
//  Lamina     · EL MOMENTO: la página de la guía a pantalla completa con zoom punto por punto
//  GuiaCTA    · la guía + QR REAL (archivo verificado) + dominio + las dos vías (TV / teléfono)
//  Compare2   · entrecano vs blanco (qué color da el café en cada pelo)
//  DatoCard   · cifra grande sobre tarjeta de papel con la foto del momento (overlay lateral)
//  Hitos      · línea de tiempo en tarjetas (día 1 · semana 1 · semana 3)
//  Presenter  · tarjeta de presentación del Dr. Federer (overlay bajo, no tapa la cara)
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, eOut, eIO, ramp, spr, src, Atmosphere, Finish, Plane, PaperPhoto, useCam, Headline, Chip, SHADOW } from "./Depth";

const outK = (frame: number, dur: number, n = 9) => ramp(frame, dur - n, dur);

export const HookSplit: React.FC<{ before?: string; after?: string; beforeLabel?: string; afterLabel?: string; badge?: string; durationInFrames?: number }> = ({ before, after, beforeLabel = "", afterLabel = "", badge = "", durationInFrames = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inK = spr(frame, fps, 0, 110, 0.8);
  const wipe = interpolate(frame, [18, 42], [0, 1], { ...CL, easing: eIO });
  const badgeK = spr(frame, fps, 30, 90, 0.6);
  const out = outK(frame, durationInFrames);
  const W = 420, H = 560;
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `translateX(${((1 - inK) * 260 + out * 120).toFixed(1)}px)` }}>
      <div style={{ position: "absolute", right: 70, top: 150, width: W * 2 + 30, height: H + 90 }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-3deg)" }}>
          <PaperPhoto img={before} w={W} h={H} label={beforeLabel} labelSize={40} tone={V.mute} push={frame * 0.0004} />
        </div>
        <div style={{ position: "absolute", left: W + 30, top: 20, transform: `rotate(2.5deg) translateY(${((1 - wipe) * 40).toFixed(1)}px)`, opacity: wipe }}>
          <PaperPhoto img={after} w={W} h={H} label={afterLabel} labelSize={40} tone={V.teal} glow={V.teal} glowK={wipe} push={frame * 0.0004} />
        </div>
        <svg width={120} height={80} viewBox="0 0 120 80" style={{ position: "absolute", left: W - 50, top: H / 2 - 40, opacity: wipe, filter: `drop-shadow(0 6px 12px ${rgba("#27343A", 0.35)})` }}>
          <path d="M8 40 H86 M66 16 L96 40 L66 64" fill="none" stroke={V.green} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {badge ? (
          <div style={{ position: "absolute", left: "50%", top: H + 20, transform: `translateX(-50%) rotate(-2deg) scale(${badgeK.toFixed(3)})` }}>
            <div style={{ padding: "12px 40px", borderRadius: 14, background: V.danger, color: V.white, fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 52, letterSpacing: 2, whiteSpace: "nowrap", boxShadow: SHADOW(90) }}>{badge}</div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// La lámina: se ve ENTERA sobre papel, y la cámara va a cada punto cuando el doctor lo nombra.
export type LaminaPoint = { x: number; y: number; zoom: number; at: number };
export const Lamina: React.FC<{ image?: string; points?: LaminaPoint[]; durationInFrames?: number }> = ({ image, points = [], durationInFrames = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inK = spr(frame, fps, 0, 120, 0.9);
  // keyframes: entera (1,0.5,0.5) → cada punto → entera al final
  const keys: { f: number; z: number; x: number; y: number }[] = [{ f: 0, z: 1, x: 0.5, y: 0.5 }];
  for (const p of points) {
    const prev = keys[keys.length - 1];
    keys.push({ f: Math.max(prev.f + 1, p.at - 12), z: prev.z, x: prev.x, y: prev.y });
    keys.push({ f: Math.max(prev.f + 2, p.at + 12), z: p.zoom, x: p.x, y: p.y });
  }
  const endF = Math.max(keys[keys.length - 1].f + 2, durationInFrames - 70);
  keys.push({ f: endF, z: keys[keys.length - 1].z, x: keys[keys.length - 1].x, y: keys[keys.length - 1].y });
  keys.push({ f: endF + 30, z: 1, x: 0.5, y: 0.5 });
  const fs = keys.map((k) => k.f);
  const op = { ...CL, easing: eIO };
  const z = interpolate(frame, fs, keys.map((k) => k.z), op);
  const x = interpolate(frame, fs, keys.map((k) => k.x), op);
  const y = interpolate(frame, fs, keys.map((k) => k.y), op);
  // traslado para centrar el punto (x,y) de una página de 1680x945
  const PW = 1680, PH = 945;
  const tx = (0.5 - x) * PW * z;
  const ty = (0.5 - y) * PH * z;
  const out = outK(frame, durationInFrames, 8);
  return (
    <AbsoluteFill style={{ backgroundColor: V.paper2, opacity: 1 - out }}>
      <AbsoluteFill style={{ background: `radial-gradient(80% 80% at 50% 50%, ${V.paper} 0%, ${V.paper2} 100%)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: PW, height: PH, transform: `translate(-50%,-50%) translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${(z * interpolate(inK, [0, 1], [0.92, 1])).toFixed(4)})`, opacity: inK, borderRadius: 10, overflow: "hidden", boxShadow: SHADOW(945), background: V.card }}>
        {image ? <Img src={src(image)} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

export const GuiaCTA: React.FC<{ cover?: string; qr?: string; domain?: string; kicker?: string; title?: string; tvLine?: string; phoneLine?: string; bed?: string; durationInFrames?: number }> = ({ cover, qr, domain = "", kicker = "", title = "", tvLine = "", phoneLine = "", bed, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [], 0.03, durationInFrames);
  const bookIn = spr(frame, fps, 2, 120, 0.9);
  const qrIn = spr(frame, fps, 8, 110, 0.8);
  const txt = ramp(frame, 14, 30);
  const out = outK(frame, durationInFrames);
  const float = Math.sin(frame / 22) * 8;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Atmosphere frame={frame} img={bed} blur={14} veil={0.55} seed={61} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 60 }}><Headline kicker={kicker} title={title} a={txt} size={58} /></div>
        {/* portada con volumen */}
        <div style={{ position: "absolute", left: 180, top: 230, width: 520, height: 780, transform: `translateY(${((1 - bookIn) * 120 + float).toFixed(1)}px) perspective(1800px) rotateY(18deg) rotateZ(-2deg)`, opacity: bookIn }}>
          <div style={{ position: "absolute", left: -26, top: 10, width: 30, height: 760, background: `linear-gradient(90deg, #cfc6b3, #efe8d8)`, transform: "skewY(-40deg)", transformOrigin: "right" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden", boxShadow: SHADOW(700), background: V.card }}>
            {cover ? <Img src={src(cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, ${rgba("#FFFFFF", 0.28)} 0%, transparent 35%)` }} />
          </div>
        </div>
        {/* QR REAL: tarjeta blanca, grande, nada encima */}
        <div style={{ position: "absolute", left: 830, top: 250, width: 960, opacity: qrIn, transform: `translateY(${((1 - qrIn) * 60).toFixed(1)}px)` }}>
          <div style={{ display: "flex", gap: 44, alignItems: "center", background: V.card, borderRadius: 30, padding: 36, boxShadow: SHADOW(560), borderTop: `8px solid ${V.teal}` }}>
            <div style={{ width: 460, height: 460, flex: "0 0 460px", background: "#FFFFFF", padding: 20, borderRadius: 12 }}>
              {qr ? <Img src={src(qr)} style={{ width: 420, height: 420, display: "block", imageRendering: "pixelated" }} /> : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              <div style={{ opacity: ramp(frame, 22, 34) }}>
                <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 30, color: V.tealDeep, letterSpacing: 2 }}>EN EL TELEVISOR</div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 44, lineHeight: 1.08, color: V.ink }}>{tvLine}</div>
              </div>
              <div style={{ height: 3, background: V.paper2 }} />
              <div style={{ opacity: ramp(frame, 34, 46) }}>
                <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 30, color: V.amberDeep, letterSpacing: 2 }}>EN EL TELÉFONO</div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 44, lineHeight: 1.08, color: V.ink }}>{phoneLine}</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 26, textAlign: "center", opacity: ramp(frame, 26, 40) }}>
            <span style={{ display: "inline-block", padding: "14px 44px", borderRadius: 999, background: V.tealDeep, color: V.white, fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 60, letterSpacing: 1, boxShadow: SHADOW(90) }}>{domain}</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Compare2: React.FC<{ kicker?: string; left?: { img?: string; label: string; sub?: string }; right?: { img?: string; label: string; sub?: string }; rightAt?: number; bed?: string; durationInFrames?: number }> = ({ kicker = "", left, right, rightAt = 60, bed, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [rightAt], 0.05, durationInFrames);
  const lIn = spr(frame, fps, 2, 120, 0.9);
  const rIn = spr(frame, fps, rightAt, 120, 0.9);
  const out = outK(frame, durationInFrames);
  const focusR = ramp(frame, rightAt, rightAt + 14);
  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9 }}>
      <Atmosphere frame={frame} img={bed ?? left?.img} seed={81} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})` }}>
        <Plane depth={0.3} camX={cam.camX} camY={cam.camY} z={5}><div style={{ position: "absolute", left: 0, right: 0, top: 44 }}><Headline kicker={kicker} a={ramp(frame, 0, 12)} center /></div></Plane>
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: 130, top: 190, opacity: lIn, transform: `translateY(${((1 - lIn) * 80).toFixed(1)}px) perspective(1600px) rotateY(8deg) scale(${interpolate(focusR, [0, 1], [1, 0.92]).toFixed(3)})` }}>
            <PaperPhoto img={left?.img} w={780} h={700} label={left?.label} sub={left?.sub} labelSize={46} tone={V.teal} dim={focusR * 0.2} />
          </div>
        </Plane>
        <Plane depth={0.9} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 1010, top: 200, opacity: rIn, transform: `translateX(${((1 - rIn) * 200).toFixed(1)}px) perspective(1600px) rotateY(-8deg)` }}>
            <PaperPhoto img={right?.img} w={780} h={700} label={right?.label} sub={right?.sub} labelSize={46} tone={V.amber} glow={V.amber} glowK={focusR} />
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={83} />
    </AbsoluteFill>
  );
};

export const DatoCard: React.FC<{ figure?: string; unit?: string; caption?: string; image?: string; side?: "left" | "right"; tone?: "teal" | "amber"; durationInFrames?: number }> = ({ figure = "", unit = "", caption = "", image, side = "right", tone = "teal", durationInFrames = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inK = spr(frame, fps, 0, 110, 0.8);
  const numK = spr(frame, fps, 8, 90, 0.6);
  const out = outK(frame, durationInFrames);
  const col = tone === "amber" ? V.amberDeep : V.tealDeep;
  const pos: React.CSSProperties = side === "right" ? { right: 80 } : { left: 80 };
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", top: 180, ...pos, width: 700, transform: `translateX(${((side === "right" ? 1 : -1) * (1 - inK) * 180).toFixed(1)}px) rotate(${side === "right" ? 1.5 : -1.5}deg)` }}>
        <div style={{ background: V.card, borderRadius: 28, overflow: "hidden", boxShadow: SHADOW(700), borderTop: `10px solid ${col}` }}>
          {image ? <div style={{ height: 360, overflow: "hidden", margin: 14, borderRadius: 16 }}><Img src={src(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.05 + frame * 0.0005).toFixed(4)})` }} /></div> : null}
          <div style={{ padding: "8px 36px 30px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, transform: `scale(${interpolate(numK, [0, 1], [0.6, 1]).toFixed(3)})`, transformOrigin: "left center" }}>
              <span style={{ fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 150, color: col, lineHeight: 1 }}>{figure}</span>
              <span style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 52, color: V.ink }}>{unit}</span>
            </div>
            <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 38, color: V.ink2, marginTop: 8, lineHeight: 1.15, opacity: ramp(frame, 14, 26) }}>{caption}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Hitos: React.FC<{ kicker?: string; title?: string; items?: { label: string; sub: string; img?: string; at: number }[]; bed?: string; durationInFrames?: number }> = ({ kicker = "", title = "", items = [], bed, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, items.map((i) => i.at), 0.05, durationInFrames);
  const n = Math.max(1, items.length);
  const W = 500, GAP = 60, x0 = (1920 - (n * W + (n - 1) * GAP)) / 2;
  const out = outK(frame, durationInFrames);
  let active = -1; items.forEach((it, i) => { if (frame >= it.at) active = i; });
  const rail = interpolate(frame, [0, 20], [0, 1], { ...CL, easing: eOut });
  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9 }}>
      <Atmosphere frame={frame} img={bed} seed={33} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 50 }}><Headline kicker={kicker} title={title} a={ramp(frame, 0, 14)} center size={58} /></div>
        <div style={{ position: "absolute", left: x0, top: 330, width: (n * W + (n - 1) * GAP) * rail, height: 8, borderRadius: 4, background: V.teal, boxShadow: SHADOW(20) }} />
        {items.map((it, i) => {
          const k = spr(frame, fps, it.at, 120, 0.85);
          const isA = i === active;
          return (
            <div key={i} style={{ position: "absolute", left: x0 + i * (W + GAP), top: 300, opacity: k, transform: `translateY(${((1 - k) * 80 + (isA ? -16 : 0)).toFixed(1)}px) scale(${isA ? 1.03 : 0.96})` }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: isA ? V.amber : V.teal, border: `6px solid ${V.card}`, marginLeft: W / 2 - 35, boxShadow: SHADOW(70) }} />
              <div style={{ marginTop: 18 }}>
                <PaperPhoto img={it.img} w={W} h={560} label={it.label} sub={it.sub} labelSize={48} tone={isA ? V.amber : V.teal} glow={isA ? V.amber : undefined} glowK={isA ? 1 : 0} push={frame * 0.0003} dim={isA ? 0 : 0.15} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={35} />
    </AbsoluteFill>
  );
};

export const Presenter: React.FC<{ name?: string; role?: string; img?: string; durationInFrames?: number }> = ({ name = "", role = "", img, durationInFrames = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inK = spr(frame, fps, 0, 120, 0.85);
  const wipe = ramp(frame, 8, 26);
  const out = outK(frame, durationInFrames);
  const dot = 0.6 + 0.4 * Math.sin((frame / fps) * Math.PI * 2.4);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 90, bottom: 110, display: "flex", alignItems: "center", gap: 0, transform: `translateX(${((1 - inK) * -260).toFixed(1)}px)` }}>
        <div style={{ width: 190, height: 190, borderRadius: "50%", overflow: "hidden", border: `8px solid ${V.card}`, boxShadow: `${SHADOW(190)}, 0 0 0 4px ${V.teal}`, position: "relative", zIndex: 2 }}>
          {img ? <Img src={src(img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} /> : null}
        </div>
        <div style={{ marginLeft: -40, padding: "26px 44px 26px 76px", background: V.card, borderRadius: 26, boxShadow: SHADOW(160), borderLeft: `8px solid ${V.teal}`, clipPath: `inset(-40px ${((1 - wipe) * 100).toFixed(1)}% -40px 0)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#35C07F", boxShadow: `0 0 ${(8 + dot * 10).toFixed(1)}px rgba(53,192,127,0.7)` }} />
            <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: V.tealDeep }}>MÉDICO</div>
          </div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 72, color: V.ink, lineHeight: 1.02, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 32, color: V.ink2, marginTop: 4, whiteSpace: "nowrap" }}>{role}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
