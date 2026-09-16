// FileKit.tsx — piezas "EXPEDIENTE" del canal THE ROWE FILES (rfbluebottle).
// Carpeta manila + clip + ficha mecanografiada + sello + objeto héroe en 2.5D + CTA con QR REAL.
// ⛔ Sin Math.random (farm en paralelo) · sin backdrop-filter · imágenes SIEMPRE por props.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, ramp, spr, src, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./RoweDepth";

const PAPER = "#EFE6D2";
const PAPER2 = "#E3D6BA";
const MANILA = "#D9B878";
const MANILA2 = "#B8924E";
const INK = "#23262B";
const STAMP = "#B8322A";
const F_TYPE = "'Courier New', 'Liberation Mono', 'DejaVu Sans Mono', monospace";

const typed = (text: string, frame: number, at: number, cps = 38, fps = 30) => {
  const n = Math.floor(Math.max(0, frame - at) * (cps / fps));
  return text.slice(0, Math.min(text.length, n));
};

/** Sello de goma que cae y golpea. */
export const Stamp: React.FC<{ text: string; k: number; color?: string; rot?: number; size?: number }> = ({ text, k, color = STAMP, rot = -9, size = 64 }) => {
  if (k <= 0.001) return null;
  const s = interpolate(k, [0, 1], [2.4, 1], CL);
  return (
    <div style={{
      display: "inline-block", padding: "10px 28px", border: `6px solid ${rgba(color, 0.85)}`, borderRadius: 12,
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 6, color: rgba(color, 0.88), textTransform: "uppercase",
      transform: `rotate(${rot}deg) scale(${s.toFixed(3)})`, opacity: Math.min(1, k * 1.4), mixBlendMode: "multiply",
      boxShadow: `inset 0 0 0 2px ${rgba(color, 0.25)}`, whiteSpace: "nowrap",
    }}>{text}</div>
  );
};

const PaperClip: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 8 }) => (
  <svg width={70} height={170} viewBox="0 0 70 170" style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.45))", zIndex: 5 }}>
    <path d="M22 150 V40 a14 14 0 0 1 28 0 V130 a22 22 0 0 1 -44 0 V30 a30 30 0 0 1 60 0 V120" fill="none" stroke="#C9CED6" strokeWidth={7} strokeLinecap="round" />
    <path d="M22 150 V40 a14 14 0 0 1 28 0 V130 a22 22 0 0 1 -44 0 V30 a30 30 0 0 1 60 0 V120" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" opacity={0.55} />
  </svg>
);

/** 1 · LA FICHA SE ABRE — carpeta manila que se abre, foto clipeada y campos mecanografiados. */
export const FileOpen: React.FC<{
  tab?: string; photo?: string; bed?: string; title?: string;
  fields?: { k: string; v: string; at: number }[]; stamp?: string; stampAt?: number; durationInFrames?: number;
}> = ({ tab = "", photo, bed, title = "", fields = [], stamp = "", stampAt = 99999, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [stampAt], 0.05, durationInFrames);
  const inK = spr(frame, fps, 0, 120, 0.9);
  const open = ramp(frame, 10, 34, Easing.bezier(0.5, 0, 0.2, 1));
  const out = ramp(frame, durationInFrames - 10, durationInFrames);
  const stampK = spr(frame, fps, stampAt, 90, 0.6);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={16} dim={0.6} bokeh={8} seed={21} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, perspective: 2200 }}>
        <Plane depth={0.8} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: 250, top: 150, width: 1420, height: 800, transform: `translateY(${((1 - inK) * 220).toFixed(1)}px) rotateX(${((1 - inK) * 18).toFixed(2)}deg) rotateZ(-1.2deg)`, opacity: inK }}>
            {/* lomo/carpeta de atrás */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `linear-gradient(160deg, ${MANILA} 0%, ${MANILA2} 100%)`, boxShadow: "0 70px 120px rgba(0,0,0,0.7)" }} />
            <div style={{ position: "absolute", left: 60, top: -46, width: 420, height: 60, borderRadius: "14px 14px 0 0", background: MANILA, fontFamily: F_TYPE, fontWeight: 700, fontSize: 26, color: INK, display: "flex", alignItems: "center", paddingLeft: 24, letterSpacing: 2 }}>{tab}</div>
            {/* hoja */}
            <div style={{ position: "absolute", left: 40, top: 34, right: 40, bottom: 30, borderRadius: 6, background: `linear-gradient(175deg, ${PAPER} 0%, ${PAPER2} 100%)`, boxShadow: "0 6px 18px rgba(0,0,0,0.35)", overflow: "hidden" }}>
              {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 120 + i * 44, height: 1, background: rgba("#7A8FA8", 0.22) }} />)}
              <div style={{ position: "absolute", left: 70, top: 40, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: rgba(INK, 0.75) }}>THE ROWE FILES</div>
              <div style={{ position: "absolute", left: 70, top: 82, width: 760, height: 3, background: rgba(INK, 0.6) }} />
              {title ? <div style={{ position: "absolute", left: 70, top: 110, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 62, color: INK }}>{title}</div> : null}
              <div style={{ position: "absolute", left: 70, top: 220, width: 800 }}>
                {fields.map((f, i) => {
                  const a = ramp(frame, f.at - 4, f.at + 4);
                  return (
                    <div key={i} style={{ display: "flex", gap: 18, alignItems: "baseline", marginBottom: 26, opacity: a }}>
                      <div style={{ fontFamily: F_TYPE, fontWeight: 700, fontSize: 28, color: rgba(INK, 0.6), width: 230, textTransform: "uppercase" }}>{f.k}</div>
                      <div style={{ fontFamily: F_TYPE, fontWeight: 700, fontSize: 40, color: INK }}>{typed(f.v, frame, f.at)}</div>
                    </div>
                  );
                })}
              </div>
              {photo ? (
                <div style={{ position: "absolute", right: 90, top: 90, width: 440, height: 520, background: "#fbfaf6", padding: "18px 18px 70px", boxShadow: "0 18px 34px rgba(0,0,0,0.4)", transform: `rotate(${(3.5 - open * 1).toFixed(2)}deg) translateY(${((1 - ramp(frame, 16, 36)) * 60).toFixed(1)}px)`, opacity: ramp(frame, 16, 30) }}>
                  <Img src={src(photo)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : null}
              {photo ? <PaperClip x={1160} y={40} /> : null}
              <div style={{ position: "absolute", right: 140, bottom: 70 }}><Stamp text={stamp} k={stampK} /></div>
            </div>
            {/* tapa de la carpeta que se abre */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, transformOrigin: "0% 50%", transform: `rotateY(${(-open * 118).toFixed(2)}deg)`, background: `linear-gradient(160deg, ${MANILA} 0%, ${MANILA2} 120%)`, backfaceVisibility: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", display: open > 0.55 ? "none" : "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: F_TYPE, fontWeight: 700, fontSize: 64, color: rgba(INK, 0.75), letterSpacing: 6 }}>CONFIDENTIAL</div>
            </div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={23} />
    </AbsoluteFill>
  );
};

/** 2 · EL OBJETO HÉROE en 2.5D — la botella en una tarjeta de vidrio que flota, con etiquetas que se clavan. */
export const BottleDossier: React.FC<{
  img?: string; bed?: string; kicker?: string; title?: string;
  tags?: { text: string; at: number; side?: "l" | "r"; y?: number; warn?: boolean }[]; durationInFrames?: number;
}> = ({ img, bed, kicker = "", title = "", tags = [], durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, tags.map((t) => t.at), 0.06, durationInFrames);
  const heroK = spr(frame, fps, 2, 110, 0.9);
  const out = ramp(frame, durationInFrames - 10, durationInFrames);
  const floatY = Math.sin(frame / fps * 0.9) * 10;
  const rotY = interpolate(frame, [0, durationInFrames], [-14, 10], CL);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={20} dim={0.62} bokeh={11} seed={31} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, perspective: 2000 }}>
        <Plane depth={0.3} camX={cam.camX} camY={cam.camY} z={1}>
          <div style={{ position: "absolute", left: 120, top: 70, opacity: ramp(frame, 6, 20) }}>
            <KickerRule text={kicker} a={ramp(frame, 6, 20)} />
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, color: V.white, marginTop: 8, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
          </div>
        </Plane>
        <Plane depth={0.95} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 960 - 330, top: 250 + floatY, transform: `translateY(${((1 - heroK) * 300).toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(4deg)`, opacity: heroK }}>
            <GlassPhoto img={img} w={660} h={700} push={interpolate(frame, [0, durationInFrames], [0, 0.08], CL)} />
          </div>
        </Plane>
        <Plane depth={1.1} camX={cam.camX} camY={cam.camY} z={4}>
          {tags.map((t, i) => {
            const k = spr(frame, fps, t.at, 120, 0.7);
            const left = (t.side ?? (i % 2 ? "r" : "l")) === "l";
            const y = t.y ?? 330 + i * 150;
            const col = t.warn ? V.danger : V.amber;
            if (k < 0.01) return null;
            return (
              <div key={i} style={{ position: "absolute", top: y, ...(left ? { right: 1920 - 610 } : { left: 1310 }), opacity: Math.min(1, k * 1.3), transform: `translateX(${((1 - k) * (left ? -60 : 60)).toFixed(1)}px)` }}>
                <div style={{ position: "absolute", top: 34, [left ? "right" : "left"]: -90, width: 90 * k, height: 3, background: col, boxShadow: `0 0 10px ${rgba(col, 0.7)}` } as React.CSSProperties} />
                <div style={{ position: "absolute", top: 26, [left ? "right" : "left"]: -104, width: 18, height: 18, borderRadius: "50%", background: col } as React.CSSProperties} />
                <div style={{ padding: "14px 26px", borderRadius: 14, background: `linear-gradient(150deg, ${rgba("#17243A", 0.96)}, ${rgba("#0A1220", 0.97)})`, border: `2px solid ${rgba(col, 0.8)}`, boxShadow: "0 20px 40px rgba(0,0,0,0.55)", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, color: V.white, whiteSpace: "nowrap" }}>{t.text}</div>
              </div>
            );
          })}
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={33} />
    </AbsoluteFill>
  );
};

/** 3 · FICHA DE CAPÍTULO — tarjeta índice "EXHIBIT" que entra girando, se tipea y se sella. */
export const CaseChapter: React.FC<{ exhibit?: string; title?: string; bed?: string; stamp?: string; durationInFrames?: number }> = ({ exhibit = "", title = "", bed, stamp = "", durationInFrames = 105 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spr(frame, fps, 0, 110, 0.8);
  const stampAt = Math.min(38, durationInFrames - 30);
  const cam = useCam(frame, fps, [stampAt], 0.05, durationInFrames);
  const out = ramp(frame, durationInFrames - 9, durationInFrames);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={14} dim={0.58} bokeh={7} seed={41} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, perspective: 1800, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1180, height: 560, background: `linear-gradient(175deg, ${PAPER} 0%, ${PAPER2} 100%)`, borderRadius: 8, boxShadow: "0 60px 110px rgba(0,0,0,0.7)", position: "relative", overflow: "hidden", transform: `rotateZ(${((1 - k) * -14 + 1.5).toFixed(2)}deg) rotateX(${((1 - k) * 30).toFixed(2)}deg) translateY(${((1 - k) * 260).toFixed(1)}px)`, opacity: Math.min(1, k * 1.5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 118, height: 3, background: rgba(STAMP, 0.55) }} />
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 170 + i * 46, height: 1, background: rgba("#7A8FA8", 0.3) }} />)}
          <div style={{ position: "absolute", left: 70, top: 40, fontFamily: F_TYPE, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: rgba(INK, 0.7) }}>{typed(exhibit, frame, 8, 30)}</div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 190, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 96, lineHeight: 1.02, color: INK }}>{typed(title, frame, 14, 40)}</div>
          <div style={{ position: "absolute", right: 70, bottom: 50 }}><Stamp text={stamp} k={spr(frame, fps, stampAt, 90, 0.6)} size={52} /></div>
        </div>
        <PaperClip x={1340} y={230} rot={-6} />
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={43} />
    </AbsoluteFill>
  );
};

/** 4 · EL EXPEDIENTE EN UNA PÁGINA — renglones que se tildan con sello, uno por frase. */
export const FileRecap: React.FC<{ title?: string; kicker?: string; photo?: string; bed?: string; items?: { text: string; at: number }[]; durationInFrames?: number }> = ({ title = "", kicker = "", photo, bed, items = [], durationInFrames = 400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, items.map((i) => i.at), 0.04, durationInFrames);
  const k = spr(frame, fps, 0, 120, 0.9);
  const out = ramp(frame, durationInFrames - 10, durationInFrames);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={16} dim={0.6} bokeh={8} seed={51} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})` }}>
        <Plane depth={0.85} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: 330, top: 60, width: 1260, height: 960, transform: `translateY(${((1 - k) * 300).toFixed(1)}px) rotate(-0.8deg)`, opacity: k, background: `linear-gradient(175deg, ${PAPER} 0%, ${PAPER2} 100%)`, borderRadius: 6, boxShadow: "0 60px 120px rgba(0,0,0,0.72)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 80, top: 50, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: rgba(STAMP, 0.85) }}>{kicker}</div>
            <div style={{ position: "absolute", left: 80, top: 92, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, color: INK }}>{title}</div>
            <div style={{ position: "absolute", left: 80, top: 186, width: 1100, height: 3, background: rgba(INK, 0.55) }} />
            {items.map((it, i) => {
              const a = ramp(frame, it.at - 6, it.at + 6);
              const tick = spr(frame, fps, it.at + 8, 90, 0.6);
              const active = frame >= it.at && (i === items.length - 1 || frame < items[i + 1].at);
              return (
                <div key={i} style={{ position: "absolute", left: 80, top: 230 + i * 118, width: 1100, height: 100, display: "flex", alignItems: "center", gap: 30, opacity: 0.18 + 0.82 * a }}>
                  <div style={{ width: 70, height: 70, borderRadius: 10, border: `4px solid ${rgba(INK, 0.7)}`, position: "relative", flex: "0 0 auto" }}>
                    {tick > 0.01 ? <svg width={90} height={90} viewBox="0 0 90 90" style={{ position: "absolute", left: -6, top: -18, transform: `scale(${interpolate(tick, [0, 1], [1.8, 1], CL).toFixed(3)})`, opacity: Math.min(1, tick * 1.5) }}><path d="M14 50 L36 72 L80 16" fill="none" stroke={STAMP} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                  </div>
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, color: INK, lineHeight: 1.05, textDecoration: "none", background: active ? rgba("#F2B544", 0.35) : "transparent", padding: "2px 12px", borderRadius: 6 }}>{it.text}</div>
                </div>
              );
            })}
          </div>
        </Plane>
        {photo ? (
          <Plane depth={1.05} camX={cam.camX} camY={cam.camY} z={3}>
            <div style={{ position: "absolute", left: 1400, top: 90, width: 400, height: 470, background: "#fbfaf6", padding: "16px 16px 60px", boxShadow: "0 24px 44px rgba(0,0,0,0.5)", transform: `rotate(5deg) translateY(${((1 - ramp(frame, 8, 28)) * 120).toFixed(1)}px)`, opacity: ramp(frame, 8, 22) }}>
              <Img src={src(photo)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <PaperClip x={1640} y={40} />
          </Plane>
        ) : null}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={53} />
    </AbsoluteFill>
  );
};

/** 5 · CTA DE LA GUÍA — tres portadas en abanico + QR REAL grande sobre blanco + dominio legible.
 *  El QR está a tamaño completo desde el cuadro 12 y NO se mueve (escaneable). */
export const FileCta: React.FC<{
  covers?: string[]; qr?: string; domain?: string; bed?: string; kicker?: string; title?: string; lines?: string[]; durationInFrames?: number;
}> = ({ covers = [], qr, domain = "", bed, kicker = "", title = "", lines = [], durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inK = ramp(frame, 0, 12);
  const out = ramp(frame, durationInFrames - 8, durationInFrames);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Atmosphere frame={frame} img={bed} blur={18} dim={0.66} bokeh={9} seed={61} camX={0} />
      {/* portadas en abanico */}
      <div style={{ position: "absolute", left: 90, top: 330, width: 900, height: 640 }}>
        {covers.map((c, i) => {
          const k = spr(frame, fps, 4 + i * 5, 120, 0.8);
          const rot = [-12, 0, 12][i % 3];
          const x = [30, 290, 550][i % 3];
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 40 + Math.abs(rot) * 2 + Math.sin(frame / fps * 0.8 + i) * 6, width: 300, height: 450, transform: `translateY(${((1 - k) * 260).toFixed(1)}px) rotate(${(rot * k).toFixed(2)}deg)`, opacity: Math.min(1, k * 1.4), boxShadow: "0 30px 60px rgba(0,0,0,0.65)", borderRadius: 6, overflow: "hidden", zIndex: i === 1 ? 3 : 2 }}>
              <Img src={src(c)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 110, top: 70, width: 960, opacity: inK }}>
        <KickerRule text={kicker} a={inK} color={V.amber} />
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 84, lineHeight: 1.0, color: V.white, marginTop: 10, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 32, color: V.bone, marginTop: i ? 4 : 14, opacity: ramp(frame, 10 + i * 6, 20 + i * 6), textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>{l}</div>
        ))}
      </div>
      <Finish frame={frame} camX={0} seed={63} motes={10} />
      {/* QR sobre blanco, grande, quieto (encima del acabado: sin viñeta ni polvo encima) */}
      <div style={{ position: "absolute", right: 110, top: 150, width: 600, height: 780, borderRadius: 26, background: "#FFFFFF", boxShadow: "0 40px 90px rgba(0,0,0,0.7)", opacity: inK, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34 }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: INK }}>SCAN THE CODE</div>
        {qr ? <Img src={src(qr)} style={{ width: 500, height: 500, marginTop: 22, imageRendering: "pixelated" }} /> : null}
        <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 31, color: INK, marginTop: 26, letterSpacing: 0.2 }}>{domain}</div>
        <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 26, color: rgba(INK, 0.65), marginTop: 10 }}>or tap the link in the description</div>
      </div>
    </AbsoluteFill>
  );
};
