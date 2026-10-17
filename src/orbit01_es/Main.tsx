// orbit01 — "Europa Hides Twice as Much Water as Earth". Montaje plano por plano desde shots.json (escrito a mano en shots.py).
import React from "react";
import { staticFile, AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, useCurrentFrame } from "remotion";
import { interpolate } from "./lib";
import data from "./shots.json";
import { C, sf, clamp } from "./lib";
import { Shot, FullImg, Card, Vid, Cam } from "./media";
import { Overlays, Hud } from "./overlays";
import { GFX } from "./gfx";

export const TOTAL: number = (data as any).total;
const SHOTS = (data as any).shots as (Shot & { clip?: string; clipF?: number })[];

// foto de agnes con su clip: el clip abre el plano y la misma foto sigue con Ken Burns
const ImgWithClip: React.FC<{ s: Shot & { clip?: string; clipF?: number } }> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = s.f1 - s.f0;
  const cf = Math.min(s.clipF || 0, dur);
  if (f < cf)
    return (
      <AbsoluteFill style={{ background: C.bg }}>
        <OffthreadVideo src={sf(s.clip!)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Sequence from={cf}>
        <Cam dur={dur - cf} mv={s.mv}>
          <Img src={sf(s.file!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Cam>
      </Sequence>
    </AbsoluteFill>
  );
};

const Base: React.FC<{ s: Shot & { clip?: string; clipF?: number } }> = ({ s }) => {
  const dur = s.f1 - s.f0;
  if (s.kind === "g") {
    const G = GFX[s.g.name];
    if (!G) throw new Error("gráfico desconocido: " + s.g.name);
    return <G dur={dur} m={s.g.m || [0]} g={s.g} />;
  }
  if (s.kind === "vid") return <Vid s={s} />;
  if (s.kind === "card") return <Card s={s} />;
  if (s.clip) return <ImgWithClip s={s} />;
  return <FullImg s={s} />;
};

// golpe de entrada: 5 cuadros de micro-zoom y un velo que se va (sin negro entre planos)
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 6], [1.025, 1], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const Main: React.FC<{ farm?: boolean }> = ({ farm }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SHOTS.map((s, i) => (
      <Sequence key={i} from={s.f0} durationInFrames={s.f1 - s.f0}>
        <Punch>
          <Base s={s} />
        </Punch>
        <Overlays s={s} />
      </Sequence>
    ))}
    <Hud />
    {!farm && <Audio src={staticFile("orbit01_es.wav")} />}
  </AbsoluteFill>
);
