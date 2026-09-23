// Piezas.tsx — piezas de escena del video `nrperoxide` (clon de nrgrayoil + LaminaZoom con zoom a regiones + CTA con portada y QR).
// ⛔ OffthreadVideo SIEMPRE (nunca <Video>). ⛔ Ken-Burns AL AZAR por plano (sentido, amplitud, foco,
//    deriva) con hash ENTERO — regla 1.ter del pipeline. ⛔ `loop` no es prop de OffthreadVideo: <Loop>.
// Este video NO tiene avatar de fondo: el presentador aparece por VENTANAS renderizadas con
// AvatarForever (AvatarClip), así que cada frame lo tiene que cubrir un plano.
import React from "react";
import { AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V } from "../fcsclv/RayStage";

// hash entero (mulberry-ish): seeds grandes y correlativas no degeneran en patrón
const hash01 = (seed: number, salt: number) => {
  let t = (Math.floor(seed) * 2654435761 + Math.floor(salt * 1000003)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const useKenBurns = (seed: number, base: number, ampMin: number, ampMax: number, driftMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const acerca = hash01(seed, 1) < 0.5;
  const amp = ampMin + hash01(seed, 2) * (ampMax - ampMin);
  const lo = base, hi = base + amp;
  const desde = acerca ? lo : hi, hasta = acerca ? hi : lo;
  const ox = 32 + hash01(seed, 3) * 36, oy = 32 + hash01(seed, 4) * 36;
  // la deriva nunca puede destapar un borde: |d| <= min(o,100-o) * (escalaMIN - 1)
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(driftMax, Math.max(0, techo));
  const ang = hash01(seed, 5) * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

// punch = 2º corte de la MISMA foto: arranca más cerrado (otro encuadre), como un corte de cámara
export const PhotoScene: React.FC<{ src: string; seed: number; punch?: boolean }> = ({ src, seed, punch }) => {
  const kb = useKenBurns(punch ? seed * 31 + 7 : seed, punch ? 1.2 : 1.06, 0.06, punch ? 0.1 : 0.16, 1.2);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </AbsoluteFill>
  );
};

// frames = cuadros REALES del archivo (lo mide el build): si el plano dura más, <Loop> en vez de congelar
// startFrom = segundos del archivo donde arranca este corte (2º corte de un plano largo partido)
export const ReframedVideo: React.FC<{ src: string; seed: number; frames?: number; startFrom?: number }> = ({ src, seed, frames, startFrom = 0 }) => {
  const kb = useKenBurns(seed, 1.03, 0.025, 0.06, 0.6);
  const video = <OffthreadVideo src={staticFile(src)} muted playbackRate={1} startFrom={Math.round(startFrom * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

// ventana de AVATAR (AvatarForever): lipsync del propio audio de esa ventana, a pantalla completa,
// muteado (el audio es el master). Push lento, nunca estático; sin fade (corte duro).
// startFrom = segundos del clip donde arranca (la ventana se recortó para esquivar un corte de audio de RunPod
// que congela la boca: el lipsync va atado al clip, así que se entra al clip en ese mismo segundo)
export const AvatarWindow: React.FC<{ src: string; seed: number; startFrom?: number }> = ({ src, seed, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const dir = hash01(seed, 9) < 0.5 ? 1 : -1;
  const s = 1.02 + frame * 0.00012;
  const dx = dir * Math.min(0.8, frame * 0.004);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(startFrom * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${Math.min(1.06, s).toFixed(4)}) translateX(${dx.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};

// ── LÁMINA con cámara que recorre REGIONES (coords en px del lienzo 1920x1080 de la imagen).
// keys[i].at = segundo (relativo al inicio del cue) en que la cámara LLEGA a esa región.
// Un marco cobre resalta la región activa. `cta` = segundo en que la página se achica a la
// izquierda y entran la PORTADA real + el QR (estático: sin Ken-Burns, zona segura).
type Rect = { x: number; y: number; w: number; h: number };
export type LamKey = { at: number; x: number; y: number; w: number; h: number; mark?: boolean };
const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const camFor = (r: Rect) => {
  const s = Math.max(1, Math.min(2.4, Math.min(1920 / r.w, 1080 / r.h) * 0.9));
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  // traslación para centrar, clampeada para no destapar bordes
  let tx = 960 - cx * s, ty = 540 - cy * s;
  tx = Math.min(0, Math.max(1920 - 1920 * s, tx));
  ty = Math.min(0, Math.max(1080 - 1080 * s, ty));
  return { s, tx, ty };
};
export const LaminaZoom: React.FC<{ src: string; keys: LamKey[]; cta?: number; cover?: string; qr?: string; site?: string }> = ({ src, keys, cta, cover, qr, site }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const K = keys.length ? keys : [{ at: 0, x: 0, y: 0, w: 1920, h: 1080 }];
  // región activa + transición de 1,0 s hacia la siguiente
  let i = 0; for (let k = 0; k < K.length; k++) if (t >= K[k].at - 1.0) i = k;
  const prev = K[Math.max(0, i - 1)], cur = K[i];
  const p = i === 0 ? 1 : ease((t - (cur.at - 1.0)) / 1.0);
  const a = camFor(prev), b = camFor(cur);
  let s = a.s + (b.s - a.s) * p, tx = a.tx + (b.tx - a.tx) * p, ty = a.ty + (b.ty - a.ty) * p;
  // micro-push permanente (nunca quieto)
  const push = 1 + 0.012 * Math.sin(t * 0.35);
  // CTA: la página se achica a la izquierda
  const c = cta !== undefined ? ease((t - cta) / 0.9) : 0;
  if (c > 0) { const full = camFor({ x: 0, y: 0, w: 1920, h: 1080 }); s = s + (full.s - s) * c; tx = tx + (full.tx - tx) * c; ty = ty + (full.ty - ty) * c; }
  const pageScale = 1 - 0.36 * c, pageX = -300 * c;
  const markOp = cur.mark === false ? 0 : Math.min(1, Math.max(0, (t - cur.at + 0.2) / 0.5)) * (1 - c);
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE8DA", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${pageX}px) scale(${pageScale})`, transformOrigin: "50% 50%", boxShadow: c > 0 ? "0 30px 80px rgba(0,0,0,.25)" : undefined }}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${(s * push).toFixed(4)})` }}>
            <Img src={staticFile(src)} style={{ width: 1920, height: 1080 }} />
            {markOp > 0 ? <div style={{ position: "absolute", left: cur.x - 10, top: cur.y - 10, width: cur.w + 20, height: cur.h + 20, border: "5px solid #B8733A", borderRadius: 18, opacity: markOp, boxShadow: "0 0 0 9999px rgba(20,30,28,0.10)" }} /> : null}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {c > 0 && cover ? (
        <div style={{ position: "absolute", right: 70 - (1 - c) * 700, top: 90, width: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: c }}>
          <Img src={staticFile(cover)} style={{ width: 330, height: 440, objectFit: "cover", borderRadius: 10, boxShadow: "0 24px 60px rgba(0,0,0,.35)" }} />
          {qr ? (
            <div style={{ background: "#FFFFFF", padding: 22, borderRadius: 16, boxShadow: "0 16px 40px rgba(0,0,0,.22)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Img src={staticFile(qr)} style={{ width: 300, height: 300, imageRendering: "pixelated" }} />
              <div style={{ fontFamily: "Inter, Arial, sans-serif", fontWeight: 800, fontSize: 26, color: "#0E3B3C", letterSpacing: 0.5 }}>{site || ""}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── Lamina3D (traída de nrtinnitus-render/src/nrtinnitus/Premium.tsx): la lámina como objeto físico en
//    perspectiva; al hacer dolly a una región se aplana para leerse. `intro=false` en los regresos a la página.
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const Lamina3D: React.FC<{ src: string; keys: LamKey[]; cta?: number; cover?: string; qr?: string; site?: string; table?: string; intro?: boolean }> = ({ src, keys, cta, cover, qr, site, table, intro = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const K = keys.length ? keys : [{ at: 0, x: 0, y: 0, w: 1920, h: 1080 }];
  let i = 0; for (let q = 0; q < K.length; q++) if (t >= K[q].at - 1.1) i = q;
  const prev = K[Math.max(0, i - 1)], cur = K[i];
  const p = i === 0 ? 1 : Easing.inOut(Easing.cubic)(clamp01((t - (cur.at - 1.1)) / 1.1));
  const a = camFor(prev), b = camFor(cur);
  let s = a.s + (b.s - a.s) * p, tx = a.tx + (b.tx - a.tx) * p, ty = a.ty + (b.ty - a.ty) * p;
  const c = cta !== undefined ? ease((t - cta) / 1.0) : 0;
  if (c > 0) { const f = camFor({ x: 0, y: 0, w: 1920, h: 1080 }); s += (f.s - s) * c; tx += (f.tx - tx) * c; ty += (f.ty - ty) * c; }
  // entrada: la página llega desde abajo, girada, y se asienta (1,4 s)
  const inn = intro ? Easing.out(Easing.cubic)(clamp01(t / 1.4)) : 1;
  // inclinación 3D: fuerte con la página entera, casi plana cuando la cámara está cerca (legible)
  const zoomK = clamp01((s - 1) / 1.1);
  const tilt = (1 - zoomK) * 9 * (1 - c) + (1 - inn) * 18;
  const yaw = (1 - zoomK) * -5 * (1 - c) + (1 - inn) * -8;
  const breathe = 1 + 0.01 * Math.sin(t * 0.4);
  const pageK = 0.9 - 0.3 * c;                           // la página no ocupa todo: se ve el objeto
  const pageX = -300 * c;
  const markOp = cur.mark === false ? 0 : clamp01((t - cur.at + 0.25) / 0.5) * (1 - c);
  return (
    <AbsoluteFill style={{ backgroundColor: "#14100C", overflow: "hidden", perspective: 2200 }}>
      {table ? <Img src={staticFile(table)} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", transform: `scale(${(1.05 + 0.03 * zoomK).toFixed(3)})`, opacity: 0.85 }} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{
        transform: `translateX(${pageX}px) translateY(${((1 - inn) * 260).toFixed(1)}px) scale(${(pageK * breathe).toFixed(4)}) rotateX(${tilt.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg)`,
        transformOrigin: "50% 60%", transformStyle: "preserve-3d", opacity: inn,
      }}>
        <AbsoluteFill style={{ overflow: "hidden", borderRadius: 14, boxShadow: "0 50px 110px rgba(0,0,0,0.55), 0 12px 30px rgba(0,0,0,0.35)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(4)})` }}>
            <Img src={staticFile(src)} style={{ width: 1920, height: 1080 }} />
            {markOp > 0 ? <div style={{ position: "absolute", left: cur.x - 10, top: cur.y - 10, width: cur.w + 20, height: cur.h + 20, border: "5px solid #B8733A", borderRadius: 18, opacity: markOp, boxShadow: "0 0 0 9999px rgba(20,30,28,0.12)" }} /> : null}
          </div>
          {/* brillo de papel: luz rasante que sigue la inclinación */}
          <AbsoluteFill style={{ background: `linear-gradient(${(115 + yaw * 3).toFixed(1)}deg, rgba(255,255,255,${(0.10 * (1 - zoomK)).toFixed(3)}) 0%, rgba(255,255,255,0) 45%)`, pointerEvents: "none" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      {c > 0 && cover ? (
        <div style={{ position: "absolute", right: 70 - (1 - c) * 700, top: 90, width: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: c }}>
          <Img src={staticFile(cover)} style={{ width: 330, height: 440, objectFit: "cover", borderRadius: 10, boxShadow: "0 24px 60px rgba(0,0,0,.45)" }} />
          {qr ? (
            <div style={{ background: "#FFFFFF", padding: 22, borderRadius: 16, boxShadow: "0 16px 40px rgba(0,0,0,.35)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Img src={staticFile(qr)} style={{ width: 300, height: 300, imageRendering: "pixelated" }} />
              <div style={{ fontFamily: "Inter, Arial, sans-serif", fontWeight: 800, fontSize: 26, color: "#0E3B3C", letterSpacing: 0.5 }}>{site || ""}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

