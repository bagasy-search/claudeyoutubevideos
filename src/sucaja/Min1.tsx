// sucaja · minuto 1 (0-65 s) para R4. Tiempos absolutos (plan2.json). El avatar (AV) NO va aquí: lo compone el montaje final.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SealDoor } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";
import { Grade, Grain } from "../repkit/Rk";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
const CLIP = (name: string) => staticFile(`broll/sucaja/${name}`);
const STILL = (name: string) => staticFile(`img/sucaja/${name}`);

// empuje de cámara lento sobre un plano (escala 1.00 -> 1.06)
export const Push: React.FC<{ dur: number; src: string; vid?: boolean }> = ({ dur, src, vid }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  const inner = vid
    ? <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{inner}</div></AbsoluteFill>;
};

const Clip: React.FC<{ from: number; dur: number; file: string }> = ({ from, dur, file }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}>
    <Push dur={dur} src={CLIP(file)} vid />
  </Sequence>
);
const Still: React.FC<{ from: number; dur: number; file: string }> = ({ from, dur, file }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}>
    <Push dur={dur} src={STILL(file)} />
  </Sequence>
);


// 5 momentos anclados a la palabra exacta de la voz (_v3/sucaja_wordms.json), tiempos absolutos
const MOM: { t: number; txt: string }[] = [
  { t: 44.70, txt: "1 · ANTES DE LA FILA" },   // "El primero es antes de entrar a la fila" (44,70)
  { t: 46.98, txt: "2 · ELEGIR LA FILA" },     // "El segundo, cuando eliges la fila" (46,98)
  { t: 49.62, txt: "3 · LA CINTA" },           // "El tercero, en la cinta" (49,62)
  { t: 51.70, txt: "4 · TE COBRAN" },          // "El cuarto, mientras te cobran" (51,70)
  { t: 54.32, txt: "5 · EL TICKET" },          // "Y el quinto, el ticket" (54,32)
];
export const Moments: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < from || t > from + 16) return null;
  const shown = MOM.filter((m) => t >= m.t);
  const last = shown[shown.length - 1];
  if (!last) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: 80 }}>
      <div style={{ background: "#FFFDF4", color: "#1B1B1B", fontFamily: "sans-serif", fontWeight: 900, fontSize: 64, padding: "14px 30px", borderRadius: 6, boxShadow: "0 12px 26px rgba(0,0,0,0.35)" }}>{last.txt}</div>
    </AbsoluteFill>
  );
};

export const Min1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* 0-0.6 miniatura exacta de la tarjeta (thumb_orig), sin movimiento */}
    <Sequence from={0} durationInFrames={fr(0.6)}><Img src={staticFile("img/sucaja/thumb_orig.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    {/* 0.6-3.69 slot de la apertura: llega hecha de rep/apertura/sucaja (clip.mp4), aquí vacío */}
    {/* 3.7-9.9 AV gancho: avatar, fuera de este render */}
    {/* 9.9-25.5 WOW de caja (wow_lib). Navidad afuera; cordero x1, lector x1 */}
    <Clip from={9.89} dur={4.31} file="st003.mp4" />
    <Clip from={14.2} dur={4.27} file="st004.mp4" />
    <Clip from={18.47} dur={4.0} file="st005.mp4" />
    <Clip from={22.47} dur={3.04} file="st005b.mp4" />
    {/* P2 fotos (fotos2) sobre su frase */}
    <Still from={14.68} dur={2.64} file="F01468.png" />
    <Still from={18.68} dur={4.00} file="F01868.png" />
    {/* 25.5-32.5 sello DETRÁS DE LA GÓNDOLA sobre la puerta */}
    <SealDoor from={25.51} dur={7.02} bg="img/sucaja/door.png" tPush={31.0} tStamp={27.0} />
    {/* 41.6-57.5 HERO Cinco cajas: fondo real + 5 momentos en palabras, con 2 WOW de caja en el medio */}
    <Still from={41.63} dur={3.97} file="cinco_cajas.png" />
    <Clip from={45.6} dur={3.0} file="cinco_scan.mp4" />
    <Still from={48.6} dur={8.9} file="cinco_cajas.png" />
    <Clip from={53.5} dur={3.0} file="cinco_wow2.mp4" />
    <Moments from={41.63} />
    {/* 57.5-65 sin plano aún (avatar + pendiente) */}
    <AvatarWins from={0} to={65} />
    <Grade />
    <Grain />
  </AbsoluteFill>
);
