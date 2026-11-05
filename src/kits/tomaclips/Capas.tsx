// Capas que van ENCIMA de una toma de video para darle profundidad y relato, sin taparla:
// <Particulas> (nieve/ceniza/polvo en 3 profundidades: cerca grande y desenfocada, lejos chica y nítida),
// <HumoPaso> (humo que cruza delante de la cámara con parallax), <Cifra> (número que cuenta, con entrada
// por foco y deriva de cámara), <Fecha> (letras que aparecen de a una) y <Franjas> (formato cine 2.39).
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const R = (s: number) => { let x = Math.imul(s ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const suave = Easing.bezier(0.42, 0, 0.58, 1);

// ventana de tiempo con fundido de entrada/salida (s)
const ventana = (t: number, a: number, b: number, f = 0.8) => interpolate(t, [a, a + f, b - f, b], [0, 1, 1, 0], { ...cl, easing: suave });

export const Particulas: React.FC<{ desde: number; hasta: number; n?: number; color?: string; viento?: number; caida?: number; semilla?: number }> =
  ({ desde, hasta, n = 90, color = "#ffffff", viento = 30, caida = 60, semilla = 1 }) => {
  const f = useCurrentFrame(); const { fps, width: W, height: H } = useVideoConfig(); const t = f / fps;
  const op = ventana(t, desde, hasta, 1.2); if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {Array.from({ length: n }, (_, i) => {
        const z = R(semilla * 1000 + i);                 // 0 lejos … 1 cerca
        const tam = 2 + z * z * 26, blur = z > 0.75 ? (z - 0.75) * 30 : 0, vel = 0.4 + z * 1.6;
        const x = ((R(i * 7 + semilla) * (W + 200) + t * viento * vel + Math.sin(t * (0.6 + R(i)) + i) * 18 * z) % (W + 200)) - 100;
        const y = ((R(i * 13 + semilla) * (H + 200) + t * caida * vel) % (H + 200)) - 100;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: tam, height: tam, borderRadius: "50%", background: color,
          opacity: 0.25 + z * 0.55, filter: blur ? `blur(${blur}px)` : undefined }} />;
      })}
    </AbsoluteFill>
  );
};

// humo que cruza: varias manchas a distintas distancias, las cercanas más rápidas y grandes
export const HumoPaso: React.FC<{ desde: number; hasta: number; src: string; tinte?: number; n?: number; semilla?: number; dir?: 1 | -1 }> =
  ({ desde, hasta, src, tinte = 0.55, n = 6, semilla = 3, dir = 1 }) => {
  const f = useCurrentFrame(); const { fps, width: W, height: H } = useVideoConfig(); const t = f / fps;
  const op = ventana(t, desde, hasta, 1.5); if (op <= 0) return null;
  const u = (t - desde) / (hasta - desde);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {Array.from({ length: n }, (_, i) => {
        const z = 0.3 + R(semilla * 50 + i) * 0.7, w = W * (0.5 + z * 1.1);
        const x = dir * (-w + (W + w * 1.4) * ((u * (0.5 + z) + R(i * 3 + semilla)) % 1.4)) + (dir < 0 ? W : 0);
        const y = H * (0.25 + R(i * 5 + semilla) * 0.6) - w * 0.25;
        return <Img key={i} src={staticFile(src)} style={{ position: "absolute", left: x, top: y, width: w, opacity: 0.18 + z * 0.3,
          filter: `brightness(${tinte}) blur(${z * 6}px)`, transform: `rotate(${(R(i) - 0.5) * 20}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};

const deriva = (t: number, s: number) => `translate(${Math.sin(t * 0.5 + s) * 10}px, ${Math.cos(t * 0.4 + s) * 6}px)`;

// cifra que cuenta (6.939) con entrada por foco: llega desenfocada y grande, se asienta
export const Cifra: React.FC<{ desde: number; hasta: number; valor: number; sufijo: string; y?: number; x?: number; tam?: number; cuenta?: number }> =
  ({ desde, hasta, valor, sufijo, y = 0.5, x = 0.5, tam = 150, cuenta = 1.6 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const op = ventana(t, desde, hasta, 0.6); if (op <= 0) return null;
  const k = interpolate(t, [desde, desde + 0.9], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const v = Math.round(valor * interpolate(t, [desde, desde + cuenta], [0, 1], { ...cl, easing: Easing.out(Easing.quad) }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, transform: `translate(-50%,-50%) ${deriva(t, valor)} scale(${1.25 - 0.25 * k})`,
        filter: `blur(${(1 - k) * 14}px)`, textAlign: "center", color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,.65)" }}>
        <div style={{ fontFamily: "'Bebas Neue','Oswald',Impact,sans-serif", fontSize: tam, lineHeight: 0.95, letterSpacing: 4 }}>{v.toLocaleString("es-AR")}</div>
        <div style={{ fontFamily: "Georgia,serif", fontSize: tam * 0.24, letterSpacing: tam * 0.06, textTransform: "uppercase", opacity: 0.9 }}>{sufijo}</div>
      </div>
    </AbsoluteFill>
  );
};

// texto que aparece letra por letra (fecha, hora, lugar)
export const Fecha: React.FC<{ desde: number; hasta: number; texto: string; sub?: string; y?: number; tam?: number }> =
  ({ desde, hasta, texto, sub, y = 0.72, tam = 64 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const op = ventana(t, desde, hasta, 0.7); if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <div style={{ position: "absolute", left: "50%", top: `${y * 100}%`, transform: `translate(-50%,-50%) ${deriva(t, 2)}`, textAlign: "center",
        color: "#f3efe6", textShadow: "0 3px 24px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: tam, letterSpacing: tam * 0.18 }}>
          {texto.split("").map((c, i) => {
            const a = interpolate(t, [desde + i * 0.045, desde + i * 0.045 + 0.35], [0, 1], cl);
            return <span key={i} style={{ opacity: a, filter: `blur(${(1 - a) * 6}px)` }}>{c}</span>;
          })}
        </div>
        {sub && <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: tam * 0.4, marginTop: 10, letterSpacing: 3,
          opacity: interpolate(t, [desde + 0.9, desde + 1.5], [0, 0.85], cl) }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const Franjas: React.FC<{ ratio?: number }> = ({ ratio = 2.39 }) => {
  const { width: W, height: H } = useVideoConfig(); const h = Math.max(0, (H - W / ratio) / 2);
  return (<AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "#000" }} />
  </AbsoluteFill>);
};
