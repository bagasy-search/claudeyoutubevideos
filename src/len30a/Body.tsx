// len30a · EL VIDEO ENTERO. Base = clips H3 (MiniMax, ultra-reales, upscale lanczos en el farm) anclados a su frase, cada uno con
// su velocidad (los huecos chicos se tapan en cámara lenta, nunca congelado); el avatar entra y sale con CORTE SECO en sus ventanas;
// un componente único por hueco (heroes.json · comps30). Cuadro 0 = la miniatura sin texto, que se acerca y funde al gancho.
// Audio fuera de Remotion (tandaB_sfx + encfin): voz + audio propio de los clips, bajo. Sin música.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import HEROES from "./heroes.json";
import AVW from "./avwin.json";
import REELJ from "./reel.json";
import LTXOK from "./ltx_ok.json";
import { LowerThird, P, Vid, e, s } from "./lib";
import { HC, H, Thumb0, Tiles } from "./comps30";

type Seg = [number, number, string, string, number];
const PL = PLAN as unknown as { segs: Seg[]; end: number; txt: { lower: [number, number] } };
export const END = PL.end;
const OK = new Set(LTXOK as string[]);
const REEL = (REELJ as { reel: boolean }).reel;
type W = { ms: number; me: number; off: number };
const WIN: W[] = (AVW as unknown as { win: W[] }).win;

// ===== avatar: un solo reel; cada ventana es una Sequence que arranca 10 cuadros antes (sin negros al entrar/salir) =====
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const still = <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{still}
    {REEL && WIN.map((w, i) => <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>)}
  </AbsoluteFill>;
};

// ===== base: el clip del tramo (zoom lento de 2-6 %), o el azulejo si el clip no pasó la revisión =====
const Base: React.FC<{ t: number }> = ({ t }) => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g || !OK.has(g[3])) return <Tiles t={t} />;
  const [a, b, , id] = g;  // la cámara lenta ya viene horneada del farm (h3up: minterpolate + lanczos)
  return <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, b)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill>;
};
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

const HS = HEROES as H[];
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = HC[h.k]; return C && t > h.at - 0.1 && t < h.out + 0.1 ? <C key={i} t={t} h={h} /> : null; })}</>;

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {nowAv(t) ? <Avatar t={t} /> : <Base t={t} />}
    <Heroes t={t} />
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="LENNY" l2="CHICAGO PLUMBER · 45 YEARS" l2at={PL.txt.lower[0] + 1} />
    <Thumb0 t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
