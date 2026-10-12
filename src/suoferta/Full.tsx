// suoferta · 0-400 s · generado desde edl_full.json (generador en el chat, 12-oct)
// Voz maestra = UNICA pista de audio (como sucarne/Avatar.tsx). AvClip va muteado; el lead mueve solo el video del reel.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { OfferPoster, CountCard, ShelfTag, PerKilo, Lupa, Cta, CommentQ } from "../repkit/Kit";
import edl from "./edl_full.json";

const FPS = 30;
const LEAD = 0.17; // adelanto constante de labios (s)
export const FULL_TOTAL_S = 993.5;

type E = { kind: string; from: number; dur: number; lead?: number; at?: [number, number]; product?: string; price?: number; unitLine?: string; tPrint?: number; tLupa?: number; tCircle?: number; bg2?: string; left?: any; right?: any; tA?: number; tB?: number; tCalc?: number; tWin?: number; path?: any; zoom?: number; label?: any; src?: string; startFrom?: number; reelStart?: number; n?: number; of?: number; word?: string; title?: string; bg?: string; q?: string; name?: string; initial?: string; when?: string; };

const Push: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur * FPS], [1, 1.07], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 50%", overflow: "hidden" }}>{children}</AbsoluteFill>;
};

const Scene: React.FC<{ e: E; children: React.ReactNode }> = ({ e, children }) => (
  <Sequence from={Math.round(e.from * FPS)} durationInFrames={Math.max(1, Math.round(e.dur * FPS))}>
    <Push dur={e.dur}>{children}</Push>
  </Sequence>
);

export const Full: React.FC = () => {
  const items = edl as E[];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {items.map((e, i) => {
        if (e.kind === "vid") {
          return (
            <Scene key={i} e={e}>
              <OffthreadVideo src={staticFile(e.src!)} muted startFrom={Math.round((e.startFrom || 0) * FPS)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Scene>
          );
        }
        if (e.kind === "img") {
          return (
            <Scene key={i} e={e}>
              <Img src={staticFile(e.src!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Scene>
          );
        }
        if (e.kind === "av") {
          const start = Math.max(0, (e.reelStart || 0) - (e.lead ?? LEAD));
          return (
            <Sequence key={i} from={Math.round(e.from * FPS)} durationInFrames={Math.round(e.dur * FPS)}>
              <AbsoluteFill style={{ background: "#000" }}>
                <OffthreadVideo src={staticFile("av/suoferta_reel0.mp4")} muted startFrom={Math.round(start * FPS)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </AbsoluteFill>
            </Sequence>
          );
        }
        if (e.kind === "poster") {
          return (
            <OfferPoster key={i} bg="img/suoferta/pila_carteles_sin_texto.png" from={e.from} dur={e.dur} big="2x1" small="OFERTA"
              tIn={e.from + 0.3} tPeel={e.from + 2.3} under={[{ txt: "¿Antes cuánto?", t: e.from + 3.3, hl: true }]} />
          );
        }
        if (e.kind === "shelf") {
          return (
            <ShelfTag key={i} from={e.from} dur={e.dur} bg={e.bg!} at={e.at!} product={e.product!} price={e.price!} unitLine={e.unitLine!}
              tPrint={e.tPrint!} tLupa={e.tLupa!} tCircle={e.tCircle!} />
          );
        }
        if (e.kind === "perkilo") {
          return (
            <PerKilo key={i} from={e.from} dur={e.dur} left={e.left} right={e.right} tA={e.tA!} tB={e.tB!} tCalc={e.tCalc!} tWin={e.tWin!} bg={"img/suoferta/gondola_precio_arroz.png"} />
          );
        }
        if (e.kind === "lupa") {
          return (
            <Lupa key={i} from={e.from} dur={e.dur} bg={e.bg!} path={e.path} zoom={e.zoom} label={e.label} />
          );
        }
        if (e.kind === "cta") {
          return <Cta key={i} from={e.from} dur={e.dur} t={e.t!} title={e.title} bg={e.bg!} />;
        }
        if (e.kind === "commentq") {
          return <CommentQ key={i} from={e.from} dur={e.dur} q={e.q!} t={e.t!} bg={e.bg!} name={e.name} initial={e.initial} when={e.when} />;
        }
        if (e.kind === "count") {
          return (
            <CountCard key={i} from={e.from} dur={e.dur} n={e.n!} of={e.of!} word={e.word!} title={e.title!} bg={e.bg!} t={e.from + 0.4} />
          );
        }
        return null;
      })}
    </AbsoluteFill>
  );
};
