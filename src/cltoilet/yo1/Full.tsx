// cltoilet · el video ENTERO editado por Claude: minuto 1 a mano (Min1) + el resto desde edl.json (componentes a mano, b-roll con ritmo humano).
// v2 "dopamina": punch-ins en palabra, cámara por golpes en componentes, contador de los 5 lugares, adelanto, palabras clave.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Min1, END, Plate, CompWrap, Grain, OV, fr, type Shot } from "./Min1";
import { KIT, Kicker, BeatCam, Pop, Hud } from "./Kit2";
import EDL from "./edl.json";

export const TOTAL_S = 1048.0;
type S2 = Shot & { c?: string; props?: any; beats?: number[] };
const SH = (EDL as any).shots as S2[];
SH.forEach((s, i) => { const n = SH[i + 1]; if (n && n.tin && n.tin !== "cut" && !s.tout) s.tout = n.tin; });
const HUD = (EDL as any).hud as { a: number; b: number; chs: number[]; hide: [number, number][] };

export const Full: React.FC<{ gain?: Record<string, number> }> = ({ gain = {} }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={fr(END)}><Min1 gain={gain} noVoice /></Sequence>
    {SH.map((s, i) => {
      const lead = s.tin && s.tin !== "cut" ? OV : 0;
      const tail = s.tout && s.tout !== "cut" ? OV : 0;
      const from = fr(s.a) - lead, d = fr(s.b) - fr(s.a);
      const K = s.c ? KIT[s.c] : null;
      const comp = K ? <K {...s.props} a={s.a} d={d} /> : null;
      return (
        <Sequence key={i} from={from} durationInFrames={d + lead + tail}>
          {K ? <CompWrap lead={lead} d={d} tout={s.tout}>{s.beats?.length ? <BeatCam a={s.a} beats={s.beats}>{comp}</BeatCam> : comp}</CompWrap> : <Plate s={s} d={d} lead={lead} />}
        </Sequence>
      );
    })}
    {((EDL as any).kick as any[]).map((k, i) => (
      <Sequence key={"k" + i} from={fr(k.a)} durationInFrames={fr(k.b) - fr(k.a)}><Kicker txt={k.txt} d={fr(k.b) - fr(k.a)} side={k.side} red={k.red} hand={k.hand} /></Sequence>
    ))}
    {((EDL as any).pop as any[]).map((p, i) => (
      <Sequence key={"p" + i} from={fr(p.t)} durationInFrames={fr(p.d)}><Pop txt={p.txt} d={fr(p.d)} /></Sequence>
    ))}
    <Sequence from={fr(HUD.a)} durationInFrames={fr(HUD.b) - fr(HUD.a)}><Hud a={HUD.a} chs={HUD.chs} hide={HUD.hide} /></Sequence>
    <Grain />
    <Audio src={staticFile("voz.wav")} />
    {((EDL as any).sfx as [number, string, number][]).map(([t, k, v], i) => (
      <Sequence key={"x" + i} from={fr(t)} durationInFrames={Math.min(fr(TOTAL_S) - fr(t), fr(4))}>
        <Audio src={staticFile(`sfx/${k}.flac`)} volume={(f) => v * (gain[k] ?? 1) * (f > fr(3.4) ? Math.max(0, 1 - (f - fr(3.4)) / 18) : 1)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
