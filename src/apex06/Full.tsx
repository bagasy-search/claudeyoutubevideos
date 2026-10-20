// apex06 · VIDEO ENTERO: gancho LTX (found footage del tigre en los Sundarbans) + 15,8 min de narración sobre los planos de data.tsx.
// Planos reales/LTX/fotos van por ShotLayer (cámara al azar por plano); los bloques del kit btg se cortan en sub-planos
// de encuadre (cam) sobre UNA escena continua: el Sequence del comp arranca en el inicio del bloque (sa).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { C, DeclineChart, DotMap, FONT, KeyLine, Real, Roster, Slot, Stamp, ease } from "./kit";
import { CUT, Scene } from "./Escenas";
import { MAPS } from "./maps";
import { END, SHOTS, TXT, S6 } from "./data";

export const GANCHO = 16;
export const GANCHO_SRC = "apex06/ltx/ap6_gancho_tigre_a.mp4";
export const FULL_FRAMES = Math.round((GANCHO + END + 1) * FPS);
const STAMP_BG = "apex06/real/lion_12792762.mp4";

// top 8, de inofensivo (#8) a devorador de hombres (#1)
const RANK: [keyof typeof CUT, string][] = [["snowleo", "snow leopard"], ["cheetah", "cheetah"], ["lynx", "lynx"], ["jaguar", "jaguar"], ["cougar", "cougar"], ["leopard", "leopard"], ["lion", "lion"], ["tiger", "tiger"]];
const SLOTS: Slot[] = RANK.map(([k, name], i) => ({ img: CUT[k].img, ar: CUT[k].ar, name, rank: `#${8 - i}` }));
const rosterProps = (arg: string): { active?: number; lit?: number[]; seen: number } => {
  if (arg === "-1") return { seen: -1 };
  if (arg === "low") return { lit: [0, 1, 2], seen: 2 };
  if (arg === "mid") return { lit: [5, 6, 7], seen: 4 };
  if (arg === "final") return { lit: [5, 6, 7], seen: 7 };
  const n = Number(arg); return { active: n, seen: n };
};

// cifra gigante que cuenta, con la silueta del tigre detrás
const Big: React.FC<{ n: number; sub: string }> = ({ n, sub }) => {
  const f = useCurrentFrame(), v = Math.round(n * ease(f, 4, 40));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3a140c 0%, #0b0505 72%)" }}>
      <Img src={staticFile(CUT.tiger.img)} style={{ position: "absolute", right: 120, bottom: 0, height: 900, filter: "brightness(0)", opacity: 0.55, transform: `scale(${1 + ease(f, 0, 200) * 0.06})`, transformOrigin: "bottom right" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 300, lineHeight: 1, color: C.orange, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{v.toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.ink, opacity: ease(f, 30, 42), textTransform: "uppercase", letterSpacing: 2 }}>{sub}</div>
    </AbsoluteFill>
  );
};

const Comp: React.FC<{ s: S6 }> = ({ s }) => {
  const arg = s.arg!, p = arg.split(":"), d = Math.round(((s.sb ?? s.b) - (s.sa ?? s.a)) * FPS);
  switch (s.comp) {
    case "scene": return <Scene name={arg} d={d} />;
    case "roster": return <Roster a={0} slots={SLOTS} {...rosterProps(p[1])} caption={s.txt ?? undefined} />;
    case "map": { const m = MAPS[p[1]], n = Number(p[2]); return <DotMap a={0} land={`apex06/map/${p[1]}.png`} pts={m.pts} ar={m.ar} n={n} stat="#" sub={p.slice(3).join(":")} dots={n > 0 ? 1 : p[1] === "samerica" ? 0.03 : 0.3} fade={p[1] !== "africa"} />; }
    case "stamp": return <AbsoluteFill><Real v={STAMP_BG} from={3} dur={d} dark={0.55} /><Stamp a={4} lines={p[1].split("/")} hot={Number(p[2])} /></AbsoluteFill>;
    case "big": return <Big n={Number(p[1])} sub={p.slice(2).join(":")} />;
    case "decline": return <DeclineChart a={0} pts={[1, 0.82, 0.55, 0.3, 0.12, 0.032, 0.055]} label="from *100,000* tigers to *3,200* (2010)" from="1900" to="today" />;
  }
  return <AbsoluteFill style={{ background: "#300" }} />;
};

const S: (Shot & { src6: S6 })[] = SHOTS.map((s) => {
  const base = { a: s.a, b: s.b, src6: s };
  if (s.k === "comp") { const [z, fx, fy] = s.cam!; return { ...base, comp: s.comp, cam: [z, fx, fy, z * 1.03, fx, fy] }; }
  if (s.d === "foto") return { ...base, img: `apex06/foto/${s.n}` };
  return { ...base, v: `apex06/${s.d}/${s.n}`, from: s.frm };
});
const renderComp = (s: Shot) => { const x = (s as Shot & { src6: S6 }).src6; return <Sequence from={Math.round(x.sa! * FPS)} layout="none"><Comp s={x} /></Sequence>; };

const Narr: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  // sólo se montan los planos cercanos (≈385 en total)
  let lo = 0, hi = S.length - 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (S[m].b < t - 2) lo = m + 1; else hi = m; }
  const idx: number[] = [];
  for (let i = Math.max(0, lo - 1); i < S.length && S[i].a < t + 2; i++) idx.push(i);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {idx.map((i) => <ShotLayer key={i} S={S} i={i} t={t} renderComp={renderComp} />)}
      {TXT.map((x, i) => {
        const a = Math.round(x.a * FPS), du = Math.round((x.b - x.a) * FPS);
        return <Sequence key={"k" + i} from={a} durationInFrames={du} layout="none"><AbsoluteFill style={{ zIndex: 900 }}><KeyLine a={0} text={x.text} prev={x.prev ?? undefined} out={du - 9} y={175} size={88} /></AbsoluteFill></Sequence>;
      })}
    </AbsoluteFill>
  );
};

export const Full: React.FC<{ farm?: boolean }> = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={0} durationInFrames={Math.round(GANCHO * FPS)}><AbsoluteFill><OffthreadVideo src={staticFile(GANCHO_SRC)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill></Sequence>
    <Sequence from={Math.round(GANCHO * FPS)}><Narr /></Sequence>
  </AbsoluteFill>
);
