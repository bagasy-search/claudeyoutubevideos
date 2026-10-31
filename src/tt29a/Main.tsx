// tt29a — Tell Tape: cinta real + narración en off con un componente por idea (ttkit). Mudo: la mezcla entra en encfin.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import edl from "./edl.json";
import { F, K, LIB, RoomBg, Hud, sp, lin } from "./ttkit";

const S = "tt29a";
export const FULL_FRAMES = Math.round((edl as any).end * 30);
const img = (n: string) => staticFile(`img/${S}/${n}`);
const BG = ["f_1730.jpg", "f_1900.jpg", "f_2300.jpg", "f_6640.jpg"];

type Wd = { w: string; s: number; e: number };

// subtítulos de la cinta: frases de ~7 palabras, la palabra dicha en amarillo
const Subs: React.FC<{ words: Wd[]; t0: number }> = ({ words, t0 }) => {
  const f = useCurrentFrame(); const t = t0 + f / 30;
  const groups: Wd[][] = []; let g: Wd[] = [];
  words.forEach((w, i) => { g.push(w); const gapNext = words[i + 1] ? words[i + 1].s - w.e : 9; if (g.length >= 7 || /[.?!]$/.test(w.w) || gapNext > 0.7) { groups.push(g); g = []; } });
  if (g.length) groups.push(g);
  const cur = groups.find((gr) => t >= gr[0].s - 0.05 && t <= gr[gr.length - 1].e + 0.4);
  if (!cur) return null;
  return (
    <div style={{ position: "absolute", left: 420, right: 300, bottom: 70, textAlign: "center" }}>
      <span style={{ display: "inline", padding: "8px 18px", background: "rgba(8,9,11,.82)", lineHeight: 1.55, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", fontFamily: F.sans, fontWeight: 600, fontSize: 46 } as any}>
        {cur.map((w, i) => <span key={i} style={{ color: t >= w.s ? (t <= w.e + 0.15 ? K.y : K.text) : "rgba(236,233,226,.55)" }}>{w.w} </span>)}
      </span>
    </div>
  );
};

const Tape: React.FC<{ b: any }> = ({ b }) => {
  const f = useCurrentFrame(); const dur = Math.round((b.e - b.s) * 30);
  const k = sp(f, 0, { damping: 20, mass: 0.9, stiffness: 140 }); const out = lin(f, dur - 8, dur);
  const flash = lin(f, 0, 3) - lin(f, 3, 10);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: 1 - out }}>
      <AbsoluteFill style={{ transform: `scale(${1.06 - k * 0.06 + Math.sin(f / 200) * 0.006})`, filter: `brightness(${1 + flash * 0.6}) contrast(1.04)` }}>
        <OffthreadVideo src={staticFile(b.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.35) 100%)" }} />
      <Hud f={f + Math.round(b.src[0] * 30)} label="ORANGE CO. SHERIFF" />
      <Subs words={b.words} t0={b.s} />
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const tl = (edl as any).tl as any[];
  let nb = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: K.bg }}>
      {tl.map((b, i) => {
        const from = Math.round(b.s * 30); const nxt = tl[i + 1]; const to = Math.round((nxt ? nxt.s : (edl as any).end) * 30);
        if (b.kind === "tape") return <Sequence key={i} from={from} durationInFrames={Math.round((b.e - b.s) * 30) + 6}><Tape b={b} /></Sequence>;
        const bg = BG[nb++ % BG.length];
        return (
          <Sequence key={i} from={from - 6} durationInFrames={to - from + 12}>
            <RoomBg src={img(bg)} />
            {b.comps.map((c: any, j: number) => {
              const C = LIB[c.type]; if (!C) return null;
              const cf = Math.round(c.s * 30) - from + 6; const cd = Math.max(15, Math.round((c.e - c.s) * 30) + 8);
              return <Sequence key={j} from={cf} durationInFrames={cd}><C {...c} s={c.s} e={c.s + cd / 30} words={b.words} img={img} /></Sequence>;
            })}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
