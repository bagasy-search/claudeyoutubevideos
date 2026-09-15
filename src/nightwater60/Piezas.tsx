import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Piezas de nightwater60 (canal Dr. Federer — The Nightly Remedy).
// ⛔ NUNCA <Video>: en el render busca por tiempo y repite/saltea cuadros → tirón.
// ⛔ Ken-Burns por plano AL AZAR (regla 1.ter): sentido, amplitud, foco y deriva sorteados con un
//    hash ENTERO del seed (no Math.sin: pierde precisión con seeds grandes y se correlaciona).

const hash = (n: number): number => {
  let x = (n | 0) ^ 0x9e3779b9;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};
const rnd = (seed: number, salt: number) => hash(Math.imul(seed + 1, 2654435761) ^ Math.imul(salt + 7, 40503));

// %/s de zoom: fotos 1,8-4,0 · clips 0,6-1,4 · techo total 20 %
export const kenBurns = (seed: number, frame: number, n: number, fps: number, kind: "foto" | "clip") => {
  const dur = Math.max(0.5, n / fps);
  const [lo, hi] = kind === "foto" ? [1.8, 4.0] : [0.6, 1.4];
  const rate = lo + (hi - lo) * rnd(seed, 1);
  const amp = Math.min(0.2, (rate / 100) * dur);
  const zBase = 1.06;
  const acerca = rnd(seed, 2) < 0.5;
  const k = interpolate(frame, [0, Math.max(1, n - 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kk = acerca ? k : 1 - k;
  const z = zBase + amp * kk;
  const ox = 35 + 30 * rnd(seed, 3);
  const oy = 35 + 30 * rnd(seed, 4);
  const ang = rnd(seed, 5) * Math.PI * 2;
  // paneo atado a la ESCALA (kk), así el traslado máximo coincide con el zoom máximo
  const tx = Math.cos(ang) * 2.0 * kk;
  const ty = Math.sin(ang) * 1.2 * kk;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
    acerca,
  };
};

const cover: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const kb = kenBurns(seed, frame, durationInFrames, fps, "foto");
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0E1D23" }}>
      <Img src={staticFile(src)} style={{ ...cover, transform: kb.transform, transformOrigin: kb.transformOrigin }} />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; frames: number }> = ({ src, seed, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const kb = kenBurns(seed, frame, durationInFrames, fps, "clip");
  const video = <OffthreadVideo src={staticFile(src)} muted style={cover} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0E1D23" }}>
      <AbsoluteFill style={{ transform: kb.transform, transformOrigin: kb.transformOrigin }}>
        {frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// CTA sobre la LÁMINA: la página sigue visible (atenuada apenas) y entran la portada real de la guía,
// el QR (placa blanca, cuadrado, objectFit contain → decodifica) y el rótulo de la descripción.
// ⛔ sin precio. El QR va ≥ 300 px en pantalla.
export const LaminaCTA: React.FC<{ image: string; cover: string; qr: string; domain: string }> = ({ image, cover, qr, domain }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const ease = (f0: number, f1: number) => interpolate(frame, [f0, f1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inCover = ease(Math.round(fps * 1.2), Math.round(fps * 2.0));
  const inQr = ease(Math.round(fps * 2.6), Math.round(fps * 3.4));
  const out = 1 - ease(durationInFrames - 8, durationInFrames);
  const z = 1.02 + 0.03 * (frame / Math.max(1, durationInFrames));
  const sans = "Inter, 'Helvetica Neue', Arial, sans-serif";
  return (
    <AbsoluteFill style={{ backgroundColor: "#FBF8F2", opacity: out }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "contain", transform: `scale(${z.toFixed(4)})` }} />
      <AbsoluteFill style={{ background: `rgba(14,29,35,${(0.42 * inCover).toFixed(3)})` }} />
      <div style={{ position: "absolute", left: 150, top: 150, width: 460, transform: `translateY(${(1 - inCover) * 80}px) rotate(${(-4 + 2 * inCover).toFixed(2)}deg)`, opacity: inCover, filter: "drop-shadow(0 28px 50px rgba(0,0,0,0.55))" }}>
        <Img src={staticFile(cover)} style={{ width: "100%", borderRadius: 10, display: "block" }} />
      </div>
      <div style={{ position: "absolute", right: 150, top: 170, width: 520, padding: "34px 34px 30px", borderRadius: 26, background: "#FFFFFF", boxShadow: "0 30px 70px rgba(0,0,0,0.45)", transform: `translateY(${(1 - inQr) * 70}px)`, opacity: inQr, fontFamily: sans, textAlign: "center" }}>
        <div style={{ fontSize: 26, letterSpacing: 4, fontWeight: 800, color: "#0F4A42", textTransform: "uppercase" }}>The complete guide</div>
        <div style={{ margin: "18px auto", width: 360, height: 360, background: "#FFFFFF" }}>
          <Img src={staticFile(qr)} style={{ width: 360, height: 360, objectFit: "contain", imageRendering: "pixelated" }} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, color: "#0E1D23" }}>Scan the code</div>
        <div style={{ fontSize: 30, fontWeight: 600, color: "#12867F", marginTop: 8 }}>or open the link in the description</div>
        <div style={{ fontSize: 26, fontWeight: 600, color: "#4A5A60", marginTop: 12 }}>{domain}</div>
      </div>
    </AbsoluteFill>
  );
};

// Ventana del avatar: un tramo del reel de RunPod (832x464) recortado con trimBefore, muteado
// (el audio sale del <Audio> máster). Push lento obligatorio (nunca estático), sin fade.
export const AvatarWin: React.FC<{ src: string; trimFrames: number; seed: number }> = ({ src, trimFrames, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const acerca = rnd(seed, 9) < 0.65;
  const k = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = 1.02 + 0.05 * (acerca ? k : 1 - k);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0E1D23" }}>
      <OffthreadVideo src={staticFile(src)} trimBefore={trimFrames} muted
        style={{ ...cover, transform: `scale(${z.toFixed(4)})`, transformOrigin: "46% 32%" }} />
    </AbsoluteFill>
  );
};
