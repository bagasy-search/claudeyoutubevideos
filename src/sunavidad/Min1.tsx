// sunavidad · minuto 1 (0-65 s) para R4. Tiempos absolutos del video (plan R2 aprobado + R3c).
// Orden WOW: montacargas-DC (gancho) · muelle · envasado · cámara fría; HERO1 pan dulce; SealDoor.
// AV = avatar: Sequence vacía hasta el reel (src/sunavidad/Avatar.tsx).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "./Base";
import { SealDoor } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";

const VID = (n: string) => staticFile(`broll/sunavidad/${n}.mp4`);
const IMG = (n: string) => staticFile(`img/sunavidad/${n}.png`);

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
  <Sequence from={fr(from)} durationInFrames={fr(dur)}><Push dur={dur} src={VID(name)} vid /><Grade /><Grain /></Sequence>
);
const Still: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}><Push dur={dur} src={IMG(name)} /><Grade /><Grain /></Sequence>
);

export const Min1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* base: foto del depósito bajo todo, evita cuadros negros entre ventanas */}
    <Sequence from={0} durationInFrames={fr(65)}><Still from={0} dur={65} name="s_6_sidra_frio" /></Sequence>
    {/* 0-0.6 miniatura exacta de la tarjeta; 0.6-3.5 empuje lento sin texto */}
    <Sequence from={0} durationInFrames={fr(3.5)}><Push dur={3.5} src={staticFile("img/sunavidad/thumb.jpg")} /></Sequence>
    {/* 3.5-6.5 AV */}
    {/* 6.5-12.5 WOW-1 almacén: "Diez secretos que pasan en diciembre" */}
    <Clip from={6.5} dur={6} name="wow_dc" />
    {/* 12.5-18.5 AV */}
    {/* 18.5-27.5 SealDoor: puerta del depósito + sello DETRÁS DE LA GÓNDOLA */}
    <SealDoor from={18.5} dur={4.5} bg="img/sunavidad/n_puerta_deposito.png" tStamp={19.8} tPush={21.2} />
    {/* 27.5-33 WOW-2 muelle de camiones */}
    <Clip from={23} dur={5} name="wow_muelle" />
    {/* 28-32 navidad (agnes 2.5-flash, pallet de cajas con luces) */}
    <Still from={28} dur={4} name="s_9_canasta" />
    <Still from={32} dur={1} name="n_pan_300_900" />
    {/* 33-38 AV */}
    {/* 38-44 WOW-3 cinta de envasado */}
    <Clip from={38} dur={6} name="wow_cinta" />
    {/* 44-50 AV */}
    {/* 50-55 WOW-4 cámara fría */}
    <Clip from={50} dur={5} name="wow_camara" />
    {/* 55-60 HERO1 depósito: cajas de pan dulce (foto real sin cara) */}
    <Clip from={55} dur={4} name="xmas_cookies" />
    {/* 59-63 navidad (agnes 2.5-flash, góndola con guirnaldas y luces cálidas) */}
    <Still from={59} dur={4} name="s_10_gondola_navidad" />
    <Still from={63} dur={2} name="n_granel_nueces" />
    <AvatarWins />
    <Grade /><Grain />
  </AbsoluteFill>
);
