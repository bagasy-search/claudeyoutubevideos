import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import * as B from "./Base";

export type Cues = { TOTAL: number; LOOK: B.Look; SHOTS: any[]; AVATAR: any[]; OVERLAYS: any[]; SFX: any[]; MIX: string; CARDS: Record<string, B.Card> };
const T = 8;

const Body: React.FC<{ s: any; cu: Cues; esc: Record<string, React.FC<any>> }> = ({ s, cu, esc }) => {
  const d = s.dur, L = cu.LOOK;
  if (s.k === "Y") return <B.Clip src={s.src} from={s.at} seed={s.id} dur={d} src2={s.src2} from2={s.at2} cut={s.cut} />;
  if (s.k === "V") return <B.Clip src={s.src} from={0} seed={s.id} dur={d} />;
  if (s.k === "G" && s.vint) return <B.Vintage src={s.src} table={L.table} seed={s.id} dur={d} />;
  if (s.k === "G") return <B.Photo src={s.src} seed={s.id} dur={d} />;
  if (s.k === "E") { const K = esc[s.name]; return K ? <K dur={d} {...(s.props || {})} /> : null; }
  if (s.k === "C") switch (s.comp) {
    case "card": return <B.RecipeCard card={cu.CARDS[s.key]} look={L} dur={d} />;
    case "trick": return <B.TrickTitle n={s.n} N={s.N} name={s.name} look={L} dur={d} label={s.label} />;
    case "carousel": return <B.Carousel items={s.items} look={L} head={s.head} dur={d} />;
    case "map": return <B.MapIowa look={L} pins={s.pins} title={s.title} dur={d} />;
    case "book": return <B.BookCTA page={s.page} qr={s.qr} look={L} head={s.head} sub={s.sub} qrAt={s.qrAt} dur={d} />;
    case "letters": return <B.Letters bg={s.bg} notes={s.notes} head={s.head} dur={d} />;
    case "close": return <B.Close cover={s.cover} qr={s.qr} look={L} head={s.head} question={s.question} qAt={s.qAt} dur={d} />;
    case "photo": return <B.Photo src={s.src} seed={s.id} dur={d} />;
  }
  return null;
};

const Enter: React.FC<{ trans: string; children: React.ReactNode }> = ({ trans, children }) => {
  const f = useCurrentFrame();
  if (trans === "fade") return <AbsoluteFill style={{ opacity: interpolate(f, [0, T], [0, 1], B.CL) }}>{children}</AbsoluteFill>;
  if (trans === "push") return <AbsoluteFill style={{ transform: `translateX(${interpolate(f, [0, T + 2], [100, 0], { ...B.CL, easing: (t) => 1 - Math.pow(1 - t, 3) })}%)` }}>{children}</AbsoluteFill>;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const Over: React.FC<{ o: any; cu: Cues }> = ({ o, cu }) => {
  if (o.type === "data") return <B.Data big={o.big} line={o.line} src={o.src} dur={o.dur} />;
  if (o.type === "ask") return <B.Ask text={o.text} dur={o.dur} />;
  if (o.type === "prog") return <B.Prog n={o.n} N={o.N} label={o.label} look={cu.LOOK} dur={o.dur} />;
  if (o.type === "recap") return <B.RecapLine n={o.n} N={o.N} name={o.name} text={o.text} look={cu.LOOK} dur={o.dur} />;
  return null;
};

export const LorMain: React.FC<{ cu: Cues; esc: Record<string, React.FC<any>> }> = ({ cu, esc }) => (
  <AbsoluteFill style={{ background: B.C.dark }}>
    {cu.AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <B.AvatarFramed src={a.src} frame={a.frame} seed={i} dur={a.dur} />
      </Sequence>
    ))}
    {cu.SHOTS.map((s, i) => {
      if (s.k === "A") return null;
      const nx = cu.SHOTS[i + 1];
      const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? T + 2 : 0;
      return (
        <Sequence key={"s" + s.id} from={s.from} durationInFrames={Math.min(s.dur + tail, cu.TOTAL - s.from)} premountFor={45}>
          <Enter trans={s.trans || "cut"}><Body s={s} cu={cu} esc={esc} /></Enter>
        </Sequence>
      );
    })}
    {cu.OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, cu.TOTAL - o.from)}><Over o={o} cu={cu} /></Sequence>
    ))}
    <Audio src={staticFile(cu.MIX)} />
    {cu.SFX.map((x, i) => (
      <Sequence key={"x" + i} from={x.from} durationInFrames={90}><Audio src={staticFile(x.src)} volume={x.vol} /></Sequence>
    ))}
  </AbsoluteFill>
);
