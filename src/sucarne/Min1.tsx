// sucarne · minuto 1 (0-60 s) para R4. Tiempos absolutos del video (words.json).
// Orden WOW aprobado en R3: sierra (gancho) · envasado · quesos · montacargas · cámara fría.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "./Base";
import { AvatarWins } from "./Avatar";
import { SealDoor, ClockDeal } from "../repkit/Kit";

const CLIP = (name: string) => staticFile(`broll/sucarne/${name}_6s.mp4`);
const STILL = (name: string) => staticFile(`img/sucarne/${name}.png`);

// empuje de cámara lento sobre un plano fijo (escala 1.00 -> 1.06)
export const Push: React.FC<{ dur: number; src: string; vid?: boolean }> = ({ dur, src, vid }) => {
  const f = useCurrentFrame(); // local al Sequence
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  const inner = vid
    ? <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{inner}</div></AbsoluteFill>;
};

// clip de stock: se corta por tiempo (from/dur del video)
const Clip: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}>
    <Push dur={dur} src={CLIP(name)} vid />
  </Sequence>
);
const Still: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}>
    <Push dur={dur} src={STILL(name)} />
  </Sequence>
);

export const Min1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* 0-0.6 miniatura exacta (sin texto), luego WOW sierra = gancho "Once ofertas" */}
    <Sequence from={0} durationInFrames={fr(0.6)}><Img src={staticFile("img/sucarne/thumb.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    <Clip from={0.6} dur={3.2} name="wow_sierra_carne" />
    {/* 3.8-26 avatar (reel RunPod): ventana av00 de avwin.json, montada abajo */}
    {/* 26-31 promesa "Vamos a contar hacia atrás": envasado (WOW) */}
    <Clip from={26} dur={5} name="wow_cinta_envasado" />
    {/* 31-36 "Te voy a hablar de cuándo baja de precio": quesos (WOW) */}
    <Clip from={31} dur={5} name="wow_quesos" />
    {/* 36-41 "Cada truco...": vitrina sin marcas (foto N) */}
    <Still from={36} dur={5} name="n_vitrina_rojo_19" />
    {/* 41-47 cámara fría (WOW; montacargas descartado: marca legible) */}
    <Clip from={41} dur={6} name="wow_camara_fria" />
    {/* 47-51 trastienda: sello DETRÁS DE LA GÓNDOLA sobre la puerta */}
    <SealDoor from={47} dur={4} bg="img/sucarne/n_puerta_deposito.png" tStamp={48.2} tPush={47.6} />
    {/* 51-60 HERO1 "La vitrina a las 19:30": reloj gira 17:30 -> 19:30 sobre la vitrina */}
    <ClockDeal from={51} dur={9} bg="img/sucarne/n_vitrina_rojo_19.png" hourFrom={17.5} hourTo={19.5} tSpin={52} tArrive={53.5} label="19:30 · REBAJAS" />
    <AvatarWins from={0} to={60} />
    <Grade />
    <Grain />
  </AbsoluteFill>
);
