// suprecio · minuto 1 (0-60 s) para R4. Tiempos absolutos (segundos del corte de voz, 962 s).
// Orden R2 aprobado + veredicto: 0-0,6 miniatura exacta · 0,6-6,4 WOW sólo (la apertura hablada llega del clip) ·
// 6,4-27,5 AV (la capa de avatar la pone el montaje final: aquí queda fondo) · 27,9-47 WOW (sierra, envasado, producto) ·
// 47-55 AV · 55-60,8 ST descarga.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "../ckeggs/Base";
import { SealDoor } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";

const WOW = (name: string) => staticFile(`broll/suprecio/wow/${name}.mp4`);
const IMG = (name: string) => staticFile(`img/suprecio/${name}.png`);

// empuje de cámara lento (1.00 -> 1.06) sobre un plano o clip
export const Push: React.FC<{ dur: number; src: string; vid?: boolean }> = ({ dur, src, vid }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  const inner = vid
    ? <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{inner}</div></AbsoluteFill>;
};
const Clip: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}><Push dur={dur} src={WOW(name)} vid /></Sequence>
);
const Still: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}><Push dur={dur} src={IMG(name)} /></Sequence>
);

export const Min1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* avatar en las ventanas AV del minuto 1 */}
    <AvatarWins from={0} to={60} />
    {/* 0-0,6 miniatura exacta (con texto) */}
    <Sequence from={0} durationInFrames={fr(0.6)}><Img src={staticFile("img/suprecio/thumb.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    {/* 0,6-6,4 WOW (provisional hasta que llegue el clip de apertura: 0,6-3,6 se reemplaza) */}
    <Clip from={0.6} dur={5.8} name="w_distcenter" />
    {/* 6,4-10 AV (avatar, montaje final) */}
    {/* 10-17 SealDoor sobre la puerta del depósito */}
    <SealDoor from={10} dur={7} bg="img/suprecio/n_puerta_deposito.png" tStamp={11.6} tPush={14.2} label="DETRÁS DE LA GÓNDOLA" size={84} />
    {/* 17-27,5 AV */}
    {/* 27,9-35,7 WOW sierra de carne (detrás de la góndola) */}
    <Clip from={27.9} dur={4.1} name="w3_sierra" />
    {/* 32-35,7 cierre de la sierra sin cara (carne en la tabla) */}
    <Clip from={32.0} dur={3.7} name="w2_bandsaw" />
    {/* 35,7-42,3 WOW envasado (una sola línea de la etiqueta) */}
    <Clip from={35.7} dur={6.6} name="w3_cinta" />
    {/* 42,3-47 WOW producto en selección (promesa: ocho pruebas) */}
    <Clip from={42.3} dur={4.7} name="w2_produce" />
    {/* 47-55 AV */}
    {/* 55-60,8 descarga (regla de tres segundos) */}
    <Clip from={55} dur={5.8} name="w2_unload" />
    <Grade />
    <Grain />
  </AbsoluteFill>
);
