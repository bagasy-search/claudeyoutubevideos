// suoferta · minuto 1 (0-65 s) · EDL de D:/rtmp/claudio_new/rep/suoferta/edl_min1.json
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { OfferPoster, CountCard } from "../repkit/Kit";

const FPS = 30;
export const MIN1_TOTAL_S = 65;

// Empuje lento de cámara dentro de un plano (scale 1 → 1.07), sin salto.
const Push: React.FC<{ children: React.ReactNode; dur: number; from?: number }> = ({ children, dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur * FPS], [1, 1.07], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 50%", overflow: "hidden" }}>{children}</AbsoluteFill>;
};

const Wow: React.FC<{ src: string; from: number; dur: number }> = ({ src, from, dur }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round(dur * FPS)}>
    <Push dur={dur}>
      <OffthreadVideo src={staticFile("broll/suoferta/" + src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Push>
  </Sequence>
);

const Still: React.FC<{ src: string; from: number; dur: number }> = ({ src, from, dur }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round(dur * FPS)}>
    <Push dur={dur}>
      <Img src={staticFile("img/suoferta/" + src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Push>
  </Sequence>
);

// Avatar real: tramo del reel RunPod (public/av/suoferta_reel0.mp4). reelStart = off de la ventana + 0,12 s (padding).
const AvClip: React.FC<{ from: number; dur: number; reelStart: number; lead: number }> = ({ from, dur, reelStart, lead }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round(dur * FPS)}>
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("av/suoferta_reel0.mp4")} startFrom={Math.round(Math.max(0, reelStart - lead) * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </Sequence>
);

export const Min1: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* 0-0,6 s: miniatura exacta (tramo reservado para la apertura de otro agente) */}
      <Sequence from={0} durationInFrames={Math.round(0.6 * FPS)}>
        <Img src={staticFile("img/suoferta/thumb_orig.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
      <Wow src="wow_a_linea_envasado.mp4" from={0.6} dur={5.24} />
      <AvClip from={5.84} dur={12.81} reelStart={0.12} lead={0.17} />
      <Wow src="wow_b_conveyor.mp4" from={18.65} dur={5.55} />
      <Still src="L2/L1_deposito.png" from={24.2} dur={6.8} />
      <Wow src="wow_c_cheese.mp4" from={31.0} dur={4.0} />
      <Still src="L2/L2_gondola.png" from={35.0} dur={4.84} />
      <AvClip from={39.84} dur={11.1} reelStart={13.17} lead={0.17} />
      <OfferPoster bg="img/suoferta/pila_carteles_sin_texto.png" from={50.94} dur={5.06} big="2x1" small="OFERTA" tIn={51.2} tPeel={53.2}
        under={[{ txt: "¿Antes cuánto?", t: 54.2, hl: true }]} />
      <Wow src="wow_d_dc_aerial.mp4" from={56.0} dur={8.0} />
      <CountCard from={60.0} dur={4.0} n={15} of={15} word="TRAMPA" title="La cuenta de los cinco segundos" bg="img/suoferta/wow_d_still.jpg" t={60.4} />
    </AbsoluteFill>
  );
};
