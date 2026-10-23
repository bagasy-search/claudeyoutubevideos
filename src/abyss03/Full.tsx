// abyss03 · VIDEO ENTERO: 15,4 min de narración sobre data.tsx (sin gancho previo: la narración en 2ª persona ES el gancho).
// Planos reales/agnes por ShotLayer (cámara al azar por plano); escenas ilustradas y gráficos cortados en sub-planos de encuadre.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { FPS } from "../abysskit/lib";
import { ShotLayer, Shot } from "../abysskit/Shots";
import { C, FONT, KeyLine, Real, Stamp, ease } from "../abysskit/kit";
import { O } from "../abysskit/ocean";
import { Scene } from "./Escenas";
import { PlateCtx } from "../abysskit/plate";
import { PLATES } from "./plates";
import { Adrift } from "./piezas_m1";
import { Body } from "./piezas_m2";
import { ASIDE, END, SHOTS, TXT, S7 } from "./data";

export const FULL_FRAMES = Math.round((END + 1) * FPS);

// el ranking: #5 arriba → #1 abajo; arg N = la fila que se revela ahora (las de número mayor ya están), "all" = todas
const RK: [number, string, string][] = [[5, "INDIAN", "days"], [4, "PACIFIC", "a day or two"], [3, "ATLANTIC", "a few hours"], [2, "ARCTIC", "under an hour"], [1, "SOUTHERN", "minutes"]];
const RC = [O.gold, "#f0b04a", C.orange, "#ff6a3a", C.red];
const Rank: React.FC<{ arg: string }> = ({ arg }) => {
  const f = useCurrentFrame(), all = arg === "all", n = all ? 0 : Number(arg);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #0e2a42 0%, #020812 78%)" }}>
    {RK.map(([r, name, t], i) => {
      const shown = all || r >= n, act = r === n, k = all ? ease(f, 3 + i * 5, 12 + i * 5) : act ? ease(f, 4, 14) : 1;
      return <div key={r} style={{ position: "absolute", left: 360, top: 290 + i * 150, width: 1200, height: 124, borderRadius: 24, border: `4px solid ${act ? RC[i] : "rgba(244,239,230,.25)"}`, background: act ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.025)", opacity: shown ? k : 0.35, transform: `scale(${act ? 1.04 + 0.01 * Math.sin(f / 9) : 1})` }}>
        <div style={{ position: "absolute", left: 30, top: 12, fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1, color: RC[i] }}>#{r}</div>
        <div style={{ position: "absolute", left: 230, top: 30, fontFamily: FONT, fontWeight: 900, fontSize: 60, color: shown ? O.ink : O.dim, letterSpacing: 3 }}>{shown ? name : "?"}</div>
        {shown && <div style={{ position: "absolute", right: 40, top: 38, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: RC[i] }}>{t}</div>}
      </div>;
    })}
  </AbsoluteFill>;
};
// tarjeta de número: "NUMBER 5" gigante + el nombre del océano
const Num: React.FC<{ n: number; name: string }> = ({ n, name }) => {
  const f = useCurrentFrame(), k = ease(f, 0, 8), k2 = ease(f, 10, 22), c = RC[5 - n] ?? O.gold;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #0b2236 0%, #010409 78%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, letterSpacing: 18, color: O.dim, opacity: k }}>NUMBER</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 360, lineHeight: 0.95, color: c, opacity: k, transform: `scale(${1.3 - 0.3 * k + ease(f, 8, 120) * 0.05})`, textShadow: "0 0 60px rgba(0,0,0,.6)" }}>{n}</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, letterSpacing: 6, color: O.ink, opacity: k2, transform: `translateY(${(1 - k2) * 30}px)` }}>{name}</div>
  </AbsoluteFill>;
};
// cierre de cada océano: "TIME UNTIL IT KILLS YOU" + el tiempo
const Time: React.FC<{ t: string }> = ({ t }) => {
  const f = useCurrentFrame(), k = ease(f, 0, 8), k2 = ease(f, 8, 16);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a0e12 0%, #010409 78%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 10, color: O.dim, opacity: k }}>TIME UNTIL IT KILLS YOU</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: t.length > 10 ? 170 : 230, color: C.red, opacity: k2, transform: `scale(${1.25 - 0.25 * k2})`, textShadow: "0 0 60px rgba(255,59,48,.35)" }}>{t}</div>
  </AbsoluteFill>;
};
// cifra gigante que cuenta
const Big: React.FC<{ n: number; sub: string }> = ({ n, sub }) => {
  const f = useCurrentFrame(), v = Math.round(n * ease(f, 4, 34));
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #0f2b44 0%, #02070e 75%)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 320, lineHeight: 1, color: C.orange, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{v.toLocaleString("en-US")}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.ink, opacity: ease(f, 26, 38), letterSpacing: 2 }}>{sub}</div>
  </AbsoluteFill>;
};
// palabra gigante roja (revelación) que entra de golpe y respira
const Word: React.FC<{ w: string }> = ({ w }) => {
  const f = useCurrentFrame(), k = ease(f, 0, 7);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #061a2a 0%, #010409 75%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: w.length > 6 ? 200 : 250, color: C.red, letterSpacing: 6, opacity: k, transform: `scale(${1.35 - 0.35 * k + ease(f, 7, 90) * 0.06})`, textShadow: "0 0 60px rgba(255,59,48,.35)" }}>{w}</div>
  </AbsoluteFill>;
};
const Aside: React.FC<{ t: string; du: number }> = ({ t, du }) => {
  const f = useCurrentFrame(), k = ease(f, 0, 8) * (1 - ease(f, du - 8, du));
  return <div style={{ position: "absolute", right: 110, bottom: 130, maxWidth: 760, padding: "18px 30px", borderRadius: 22, background: "#f7f3ec", color: "#141414", fontFamily: FONT, fontWeight: 800, fontSize: 44, boxShadow: "0 14px 40px rgba(0,0,0,.45)", opacity: k, transform: `rotate(-2deg) scale(${0.85 + 0.15 * k})`, transformOrigin: "right bottom" }}>
    {t}<div style={{ position: "absolute", right: 60, bottom: -18, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "20px solid #f7f3ec" }} />
  </div>;
};

// orden de cada escena ilustrada (por su inicio): elige su fondo real del pool
const SCI = new Map([...new Set(SHOTS.filter((x) => x.comp === "scene").map((x) => x.sa ?? x.a))].map((a, i) => [a, i]));

const Comp: React.FC<{ s: S7 }> = ({ s }) => {
  const arg = s.arg!, p = arg.split(":"), d = Math.round(((s.sb ?? s.b) - (s.sa ?? s.a)) * FPS);
  switch (s.comp) {
    case "scene": return arg === "m1" ? <Adrift t0={s.sa ?? s.a} /> : arg === "m2" ? <Body t0={s.sa ?? s.a} /> : <PlateCtx.Provider value={{ pool: PLATES, i: SCI.get(s.sa ?? s.a) ?? 0, slug: "abyss03" }}><Scene name={arg} d={d} /></PlateCtx.Provider>;
    case "rank": return <Rank arg={p[1]} />;
    case "num": return <Num n={Number(p[1])} name={p.slice(2).join(":")} />;
    case "time": return <Time t={p.slice(1).join(":")} />;
    case "stamp": return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 50%, #10263a 0%, #02060c 75%)" }}><Stamp a={4} lines={p[1].split("/")} hot={Number(p[2])} /></AbsoluteFill>;
    case "big": return <Big n={Number(p[1])} sub={p.slice(2).join(":")} />;
    case "word": return <Word w={p[1]} />;
  }
  return <AbsoluteFill style={{ background: "#300" }} />;
};

const S: (Shot & { src7: S7 })[] = SHOTS.map((s) => {
  const base = { a: s.a, b: s.b, src7: s };
  if (s.k === "comp") { const [z, fx, fy] = s.cam!; return { ...base, comp: s.comp, cam: [z, fx, fy, z * 1.03, fx, fy] }; }
  return { ...base, v: `abyss03/${s.d}/${s.n}`, from: s.frm };
});
const renderComp = (s: Shot) => { const x = (s as Shot & { src7: S7 }).src7; return <Sequence from={Math.round(x.sa! * FPS)} layout="none"><Comp s={x} /></Sequence>; };

export const Full: React.FC<{ farm?: boolean }> = () => {
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
export { Real };
