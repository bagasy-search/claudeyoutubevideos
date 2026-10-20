// apex07 · VIDEO ENTERO: gancho LTX (found footage: la leona sale del maizal de noche) + 15 min de narración sobre data.tsx.
// Planos reales/LTX por ShotLayer (cámara al azar por plano); escenas ilustradas y gráficos cortados en sub-planos de encuadre.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { C, DotMap, FONT, KeyLine, Real, Roster, Slot, Stamp, ease } from "./kit";
import { CUT, Scene } from "./Escenas";
import { MAPS } from "./maps";
import { ASIDE, END, SHOTS, TXT, S7 } from "./data";

export const GANCHO = 15;
export const GANCHO_SRC = "apex07/ltx/ap7_gancho.mp4";
export const FULL_FRAMES = Math.round((GANCHO + END + 1) * FPS);

// top 5, del más chico (#5) al número uno
const RANK: [keyof typeof CUT, string][] = [["bat", "vampire bat"], ["hyena", "spotted hyena"], ["wolf", "indian wolf"], ["leopard", "leopard"], ["lion", "lion"]];
const SLOTS: Slot[] = RANK.map(([k, name], i) => ({ img: CUT[k].img, ar: CUT[k].ar, name, rank: `#${5 - i}` }));
const rosterProps = (arg: string): { active?: number; lit?: number[]; seen: number } => {
  if (arg === "-1") return { seen: -1 };
  if (arg === "final") return { lit: [0, 1, 2, 3, 4], seen: 4 };
  const n = Number(arg); return { active: n, seen: n };
};
// dónde cae cada caso en su mapa (fracción del png)
const PIN: Record<string, [number, number, string]> = {
  "samerica:21": [0.683, 0.395, "Portel · Viseu"], "africa:36": [0.767, 0.708, "Mulanje"], "africa:3": [0.756, 0.68, "Dowa"],
  "india:10": [0.536, 0.27, "Bahraich"], "india:0": [0.225, 0.556, "Mumbai"], "africa:563": [0.806, 0.633, "Tanzania"],
};
const MapPin: React.FC<{ map: string; n: number; sub: string }> = ({ map, n, sub }) => {
  const f = useCurrentFrame(), m = MAPS[map], p = PIN[`${map}:${n}`];
  const mapW = Math.min(n ? 1000 : 1600, (n ? 860 : 780) * m.ar), mapH = mapW / m.ar, X = n ? 200 : (1920 - mapW) / 2, Y = n ? (1080 - mapH) / 2 : (960 - mapH) / 2;
  const z = 1 + ease(f, 0, 240) * 0.05, cx = X + mapW / 2, cy = Y + mapH / 2;
  const px = p ? cx + (X + p[0] * mapW - cx) * z : 0, py = p ? cy + (Y + p[1] * mapH - cy) * z : 0, k = ease(f, 8, 20), pulse = (f % 40) / 40;
  return <AbsoluteFill>
    <DotMap a={0} land={`apex07/map/${map}.png`} pts={m.pts} ar={m.ar} n={n} stat="#" sub={sub} dots={0.05} />
    {p && <>
      <div style={{ position: "absolute", left: px - 60 * pulse, top: py - 60 * pulse, width: 120 * pulse, height: 120 * pulse, borderRadius: "50%", border: `4px solid ${C.red}`, opacity: k * (1 - pulse) }} />
      <div style={{ position: "absolute", left: px - 14, top: py - 14, width: 28, height: 28, borderRadius: 14, background: C.red, boxShadow: `0 0 24px 6px ${C.red}`, transform: `scale(${k})` }} />
      <div style={{ position: "absolute", left: px + 26, top: py - 26, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink, opacity: k, textShadow: "0 3px 10px rgba(0,0,0,.8)" }}>{p[2]}</div>
    </>}
  </AbsoluteFill>;
};

// cifra gigante que cuenta, con la silueta del cazador detrás
const Big: React.FC<{ n: number; cut: keyof typeof CUT; sub: string }> = ({ n, cut, sub }) => {
  const f = useCurrentFrame(), v = Math.round(n * ease(f, 4, 34)), c = CUT[cut];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3a140c 0%, #0b0505 72%)" }}>
      <Img src={staticFile(c.img)} style={{ position: "absolute", right: 80, bottom: 40, width: 1000, height: 1000 / c.ar, objectFit: "contain", filter: "brightness(0)", opacity: 0.6, transform: `scale(${1 + ease(f, 0, 200) * 0.06})`, transformOrigin: "bottom right" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 320, lineHeight: 1, color: C.orange, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{v.toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.ink, opacity: ease(f, 26, 38), textTransform: "uppercase", letterSpacing: 2 }}>{sub}</div>
    </AbsoluteFill>
  );
};
// palabra gigante roja (revelación) que entra de golpe y respira
const Word: React.FC<{ w: string }> = ({ w }) => {
  const f = useCurrentFrame(), k = ease(f, 0, 7);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #200606 0%, #050202 75%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: w.length > 5 ? 230 : 260, color: C.red, letterSpacing: 6, opacity: k, transform: `scale(${1.35 - 0.35 * k + ease(f, 7, 90) * 0.06})`, textShadow: "0 0 60px rgba(255,59,48,.35)" }}>{w}</div>
  </AbsoluteFill>;
};
// globo blanco del chiste (no corta el plano)
const Aside: React.FC<{ t: string; du: number }> = ({ t, du }) => {
  const f = useCurrentFrame(), k = ease(f, 0, 8) * (1 - ease(f, du - 8, du));
  return <div style={{ position: "absolute", right: 110, bottom: 130, maxWidth: 760, padding: "18px 30px", borderRadius: 22, background: "#f7f3ec", color: "#141414", fontFamily: FONT, fontWeight: 800, fontSize: 44, boxShadow: "0 14px 40px rgba(0,0,0,.45)", opacity: k, transform: `rotate(-2deg) scale(${0.85 + 0.15 * k})`, transformOrigin: "right bottom" }}>
    {t}<div style={{ position: "absolute", right: 60, bottom: -18, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "20px solid #f7f3ec" }} />
  </div>;
};

const Comp: React.FC<{ s: S7 }> = ({ s }) => {
  const arg = s.arg!, p = arg.split(":"), d = Math.round(((s.sb ?? s.b) - (s.sa ?? s.a)) * FPS);
  switch (s.comp) {
    case "scene": return <Scene name={arg} d={d} />;
    case "roster": return <Roster a={0} slots={SLOTS} {...rosterProps(p[1])} caption={s.txt ?? undefined} />;
    case "map": return <MapPin map={p[1]} n={Number(p[2])} sub={p.slice(3).join(":")} />;
    case "stamp": return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 50%, #1a2433 0%, #05080f 75%)" }}><Stamp a={4} lines={p[1].split("/")} hot={Number(p[2])} /></AbsoluteFill>;
    case "big": return <Big n={Number(p[1])} cut={p[2] as keyof typeof CUT} sub={p.slice(3).join(":")} />;
    case "word": return <Word w={p[1]} />;
  }
  return <AbsoluteFill style={{ background: "#300" }} />;
};

const S: (Shot & { src7: S7 })[] = SHOTS.map((s) => {
  const base = { a: s.a, b: s.b, src7: s };
  if (s.k === "comp") { const [z, fx, fy] = s.cam!; return { ...base, comp: s.comp, cam: [z, fx, fy, z * 1.03, fx, fy] }; }
  if (s.d === "foto") return { ...base, img: `apex07/foto/${s.n}` };
  return { ...base, v: `apex07/${s.d}/${s.n}`, from: s.frm };
});
const renderComp = (s: Shot) => { const x = (s as Shot & { src7: S7 }).src7; return <Sequence from={Math.round(x.sa! * FPS)} layout="none"><Comp s={x} /></Sequence>; };

const Narr: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
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
      {ASIDE.map((x, i) => {
        const a = Math.round(x.a * FPS), du = Math.round((x.b - x.a) * FPS);
        return <Sequence key={"as" + i} from={a} durationInFrames={du} layout="none"><AbsoluteFill style={{ zIndex: 950 }}><Aside t={x.t} du={du} /></AbsoluteFill></Sequence>;
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
export { Real };
