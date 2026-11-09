// blt02 · Lights Out With Dale, video 1 rehecho (9-nov): avatar a cuadro completo con empuje lento, 160 fotos con Ken Burns al azar
// y componentes premium encima de la foto o del avatar, anclados a la palabra (ov.json). Cuadro 0 = avatar hablando. Audio en encfin.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import AVW from "./avwin.json";
import OVJ from "./ov.json";
import { LowerThird, P, e, s } from "./lib";
import { AskCard, BigNum, CheckList, Chip, Desc, GuidePage, Headline, Mistake, StepTitle, TimeBars, Words } from "./premium";
import { CamaraMano } from "../kits/camara/CamaraMano";

type Seg = [number, number, string, string];
type W = { ms: number; me: number; off: number };
type Ov = { k: string } & Record<string, unknown>;
const SEGS = (PLAN as unknown as { segs: Seg[]; end: number }).segs;
export const END = (PLAN as unknown as { end: number }).end;
const WIN = (AVW as unknown as { win: W[] }).win;
const OV = OVJ as unknown as Ov[];

// hash entero (con seno y semillas grandes se correlaciona: medido en pinluz)
const h = (n: number, k: number) => {
  let x = Math.imul(n + 1, 2654435761 | 0) ^ Math.imul(k + 7, 40503);
  x = Math.imul(x ^ (x >>> 15), 2246822519 | 0);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
};

// Ken Burns por plano: sentido, velocidad (1,8-4 %/s, techo 20 %), foco y paneo atado a la escala, todo sorteado
const ZB = 1.06;
const Foto: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const [a, b, , id] = SEGS[i];
  const d = b - a, amp = Math.min(0.2, (0.018 + 0.022 * h(i, 1)) * d), sale = h(i, 2) < 0.5;
  const p = Math.min(1.08, Math.max(0, (t - a) / d));
  const z = ZB + amp * (sale ? 1 - p : p), k = (z - ZB) / amp, ang = h(i, 5) * Math.PI * 2;
  const ox = 35 + 30 * h(i, 3), oy = 35 + 30 * h(i, 4);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Img src={staticFile("img/" + P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox}% ${oy}%`,
      transform: `translate(${Math.cos(ang) * 38.4 * k}px, ${Math.sin(ang) * 13 * k}px) scale(${z})` }} />
  </AbsoluteFill>;
};

const Fotos: React.FC<{ t: number }> = ({ t }) => {
  let i = SEGS.findIndex(([a, b]) => t >= a && t < b);
  if (i < 0) { i = 0; SEGS.forEach(([a], j) => { if (a <= t) i = j; }); }
  const [a] = SEGS[i];
  const funde = i > 0 && h(i, 7) < 0.28 && Math.abs(SEGS[i - 1][1] - a) < 0.05 && t < a + 0.3;
  return <AbsoluteFill>
    {funde && <Foto i={i - 1} t={t} />}
    <AbsoluteFill style={{ opacity: funde ? e(t, a, a + 0.3) : 1 }}><Foto i={i} t={t} /></AbsoluteFill>
  </AbsoluteFill>;
};

const Avatar: React.FC<{ t: number; cur: number }> = ({ t, cur }) => {
  const w = WIN[cur], d = w.me - w.ms, amp = Math.min(0.06, 0.02 + 0.0015 * d), z = 1.005 + amp * e(t, w.ms, w.me);
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "51% 30%" }}>
      <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {WIN.map((v, i) => {
        // el arranque se adelanta lo que se pueda sin correr el labio: mismo adelanto a la secuencia y al video
        const pre = Math.min(10, s(v.ms), s(v.off));
        return <Sequence key={i} from={s(v.ms) - pre} durationInFrames={s(v.me - v.ms) + pre + 24} layout="none">
          <AbsoluteFill style={{ opacity: i === cur ? 1 : 0 }}>
            <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={s(v.off) - pre} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

const KIT: Record<string, React.FC<any>> = { AskCard, BigNum, CheckList, Chip, Desc, GuidePage, Headline, LowerThird, Mistake, StepTitle, TimeBars, Words };

export const Body: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const ult = WIN.length - 1;
  const cur = t >= WIN[ult].ms ? ult : WIN.findIndex((w) => t >= w.ms && t < w.me);
  return <AbsoluteFill style={{ background: "#000" }}>
    <CamaraMano intensidad={0.7}>{cur >= 0 ? <Avatar t={t} cur={cur} /> : <Fotos t={t} />}</CamaraMano>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 78% at 50% 48%, transparent 62%, rgba(0,0,0,.26) 100%)", pointerEvents: "none" }} />
    {OV.map(({ k, ...p }, i) => { const X = KIT[k]; return <X key={i} t={t} {...p} />; })}
    <AbsoluteFill style={{ background: "#000", opacity: e(t, END - 1.4, END - 0.1) }} />
  </AbsoluteFill>;
};
