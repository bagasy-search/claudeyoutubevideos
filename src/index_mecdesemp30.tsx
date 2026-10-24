import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES, MIN1_END, World, Avatar, WIN } from "./mecdesemp30/Min1";
import { Rest, FULL_END } from "./mecdesemp30/Rest";
import { CamaraMano } from "./kits/camara/CamaraMano";
import { ei } from "./mecdesemp30/lib";

// el avatar va ARRIBA de todo, por las ventanas del reel: entra deslizando y sale deslizando (borde nítido, sin halo)
const SL = 0.32;
const AvTop: React.FC<{ t: number }> = ({ t }) => {
  const i = WIN.findIndex((w) => t >= w.ms - SL && t < w.me + SL);
  if (i < 0) return null;
  const w = WIN[i], k = Math.min(ei(t, w.ms - SL, w.ms), 1 - ei(t, w.me, w.me + SL)), dir = i % 2 ? 1 : -1;
  if (k <= 0) return null;
  return <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)` }}><CamaraMano seed={i} intensidad={0.6}><Avatar t={t} /></CamaraMano></AbsoluteFill>;
};

// el video entero = minuto 1 (mundo 3D) + el resto, un solo hilo; el avatar arriba
const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: "#0b0e13" }}>{t < MIN1_END ? <Min1 /> : <Rest />}<AvTop t={t} /></AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="Mecdesemp30Mundo" component={() => <World t={MIN1_END - 0.6} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Mecdesemp30Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Mecdesemp30" component={Full} durationInFrames={Math.round(FULL_END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
