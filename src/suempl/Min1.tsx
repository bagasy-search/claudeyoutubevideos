// suempl · minuto 1 (0-65 s) · R4b. Tiempos absolutos del video (words.json).
// Miniatura exacta 0-0,6 s; 0,6-3,8 s = slot de la apertura (llega hecha, va con offset; aquí placeholder).
// Bloques de AVATAR quedan negros (el reel los pone el montaje): 3,8-10 · 18,8-32,9 · 41,6-58.
// Cutaways dentro de las ventanas AV: cash_register 21,92-25,56 (sobre SELLO) y SealDoor 47,08-53,26 (sobre "noche").
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "../repkit/Rk";
import { SealDoor } from "../repkit/Kit";

// HERO1: "AÑO 1 → AÑO 30" sobre los WOW de 32,9-41,6 s. El número cambia en palabras: steps = [{t, txt}] (segundos absolutos).
const HeroYears: React.FC<{ from: number; steps: { t: number; txt: string }[] }> = ({ from, steps }) => {
  const f = useCurrentFrame();
  const now = from + f / 30;
  const cur = [...steps].reverse().find((s) => s.t <= now) ?? steps[0];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.38)" }}>
      <div style={{ color: "#fff", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 150, letterSpacing: 2, textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>{cur.txt}</div>
    </AbsoluteFill>
  );
};

const CLIP = (name: string) => staticFile(`broll/suempl/cfr/${name}.mp4`);
const ARC = (name: string) => staticFile(`broll/suempl/cfr/${name}.mp4`);

// empuje de cámara lento (escala 1.00 -> 1.06) sobre el plano
export const Push: React.FC<{ dur: number; src: string; vid?: boolean }> = ({ dur, src, vid }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  const inner = vid
    ? <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{inner}</div></AbsoluteFill>;
};

const Clip: React.FC<{ from: number; dur: number; src: string }> = ({ from, dur, src }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}>
    <Push dur={dur} src={src} vid />
  </Sequence>
);

export const Min1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* 0-0,6 miniatura exacta con texto */}
    <Sequence from={0} durationInFrames={fr(0.6)}>
      <Img src={staticFile("img/suempl/thumb.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    {/* 0,6-3,8 slot de la apertura (placeholder; la apertura llega hecha con offset) */}
    <Clip from={0.6} dur={3.2} src={CLIP("pallet_boxes")} />
    {/* 3,8-10 AVATAR (gancho): negro aquí */}
    {/* 10-14,6 WOW1 "lo armé yo a las tres de la mañana": racks del almacén */}
    <Clip from={10} dur={4.6} src={CLIP("wow_dc2")} />
    {/* 14,6-18,8 WOW2 "treinta años en supermercados": quesos */}
    <Clip from={14.6} dur={4.2} src={CLIP("wow2_cheese")} />
    {/* 18,8-32,9 AVATAR (SELLO): cutaway de caja 21,92-25,56 */}
    <Sequence from={fr(21.92)} durationInFrames={fr(3.64)}>
      <Push dur={3.64} src={CLIP("cash_register")} vid />
    </Sequence>
    {/* 32,9-37,5 WOW3 memoria "entré como repositor": registro de caja 1972 (archivo sin claqueta) */}
    <Clip from={32.9} dur={4.6} src={ARC("arc_register1972")} />
    {/* 37,5-41,6 WOW4 promesa "tres etapas": línea de producto */}
    <Clip from={37.5} dur={4.1} src={CLIP("wow_conveyor")} />
    {/* HERO1 32,9-41,6 s: AÑO 1 → AÑO 30 sobre los WOW (cambia en "llave", "Hoy", "mesa", "tres") */}
    <Sequence from={fr(32.9)} durationInFrames={fr(8.7)}>
      <HeroYears from={32.9} steps={[{ t: 32.9, txt: "AÑO 1" }, { t: 35.78, txt: "AÑO 15" }, { t: 37.5, txt: "AÑO 25" }, { t: 41.74, txt: "AÑO 30" }]} />
    </Sequence>
    {/* 41,6-58 AVATAR (PROMESA): cutaway SealDoor 47,08-53,26 sobre "Una noche de trabajo" */}
    <Sequence from={fr(47.08)} durationInFrames={fr(6.18)}>
      <SealDoor from={47.08} dur={6.18} bg="img/suempl/door.png" tPush={47.5} tStamp={48.9} />
    </Sequence>
    {/* 58-60 WOW5 cierra la carne */}
    <Clip from={58} dur={2} src={CLIP("wow_coldroom")} />
    {/* 60-65 mostrador de quesos real */}
    <Clip from={60} dur={5} src={CLIP("deli_counter")} />
    <Grade />
    <Grain />
  </AbsoluteFill>
);
