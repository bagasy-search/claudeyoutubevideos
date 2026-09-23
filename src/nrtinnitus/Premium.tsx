// Premium.tsx — piezas de la v2 "premium" de nrtinnitus.
//  · Depth25: foto 2.5D (fondo inpintado + sujeto con alfa de profundidad) con paralaje real, leve giro 3D
//    y asentamiento de cámara al entrar el corte. Sentido/amplitud/foco AL AZAR por plano (hash entero,
//    regla 1.ter). Nada de Math.random: el farm rinde en chunks.
//  · Lamina3D: la lámina como objeto físico en perspectiva; al hacer dolly a una región se aplana para
//    leerse. Mismo contrato de keys/cta que LaminaZoom (drop-in).
// ⛔ Sin <Video> (no hay video acá). Sin mixBlendMode sobre el avatar. Sin filtros de color.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const hash01 = (seed: number, salt: number) => {
  let t = (Math.floor(seed) * 2654435761 + Math.floor(salt * 1000003)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };

export const Depth25: React.FC<{ bg: string; fg: string; seed: number }> = ({ bg, fg, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const acerca = hash01(seed, 1) < 0.5;
  const amp = 0.035 + hash01(seed, 2) * 0.05;               // 3,5–8,5 % de recorrido del fondo
  const z = acerca ? k : 1 - k;
  const ang = hash01(seed, 5) * Math.PI * 2;
  const px = Math.cos(ang), py = Math.sin(ang) * 0.6;
  const rotY = (hash01(seed, 7) - 0.5) * 5 * (k - 0.5) * 2;  // ±2,5° de giro a lo largo del plano
  const ox = 35 + hash01(seed, 3) * 30, oy = 35 + hash01(seed, 4) * 30;
  // asentamiento de cámara en los primeros 10 cuadros (el corte "aterriza")
  const settle = 1 + 0.045 * (1 - Easing.out(Easing.cubic)(clamp01(frame / 10)));
  const sBg = (1.08 + amp * z) * settle;
  const sFg = (1.1 + amp * 1.9 * z) * settle;
  const dBg = 0.6 * (k - 0.5), dFg = -1.2 * (k - 0.5);     // opuestos; relativa ≤0,9 % (17 px) < dilatación del hueco (21 px)
  const layer = (s: number, d: number): React.CSSProperties => ({
    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
    transform: `scale(${s.toFixed(4)}) translate(${(px * d).toFixed(3)}%, ${(py * d).toFixed(3)}%)`,
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1413", overflow: "hidden", perspective: 1800 }}>
      <AbsoluteFill style={{ transform: `rotateY(${rotY.toFixed(3)}deg)`, transformStyle: "preserve-3d" }}>
        <Img src={staticFile(bg)} style={layer(sBg, dBg)} />
        <Img src={staticFile(fg)} style={{ ...layer(sFg, dFg), filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.28))" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Rect = { x: number; y: number; w: number; h: number };
export type LamKey = { at: number; x: number; y: number; w: number; h: number; mark?: boolean };
const camFor = (r: Rect) => {
  const s = Math.max(1, Math.min(2.4, Math.min(1920 / r.w, 1080 / r.h) * 0.9));
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  let tx = 960 - cx * s, ty = 540 - cy * s;
  tx = Math.min(0, Math.max(1920 - 1920 * s, tx));
  ty = Math.min(0, Math.max(1080 - 1080 * s, ty));
  return { s, tx, ty };
};

export const Lamina3D: React.FC<{ src: string; keys: LamKey[]; cta?: number; cover?: string; qr?: string; site?: string; table?: string }> = ({ src, keys, cta, cover, qr, site, table }) => {
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
  const inn = Easing.out(Easing.cubic)(clamp01(t / 1.4));
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

// Journey: UN plano continuo que "entra" en la imagen A y sale en la imagen B (zoom infinito).
// La cámara empuja hacia el foco (fx,fy) de A; pasado ~2,2× aparece B desde adentro (escala 0,45→1) y
// termina de asentarse. No es una transición entre planos: es un solo movimiento de cámara.
export const Journey: React.FC<{ a: string; b: string; fx?: number; fy?: number; at: number }> = ({ a, b, fx = 0.62, fy = 0.5, at }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, T = durationInFrames / fps;
  const k1 = Easing.in(Easing.cubic)(clamp01((t - Math.max(0, at - 1.6)) / 1.6));        // empuje hacia adentro
  const sA = 1.04 + 0.03 * clamp01(t / Math.max(1, at)) + 2.4 * k1;
  const k2 = Easing.out(Easing.cubic)(clamp01((t - (at - 0.35)) / 1.2));
  const sB = 0.45 + 0.6 * k2 + 0.04 * clamp01((t - at) / Math.max(1, T - at));
  const opB = clamp01((t - (at - 0.35)) / 0.35);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1413", overflow: "hidden" }}>
      <Img src={staticFile(a)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${sA.toFixed(4)})` }} />
      {opB > 0 ? <Img src={staticFile(b)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: opB, transform: `scale(${sB.toFixed(4)})` }} /> : null}
    </AbsoluteFill>
  );
};
