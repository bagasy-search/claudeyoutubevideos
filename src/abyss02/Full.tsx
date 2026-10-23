// abyss02 · VIDEO ENTERO: 15,7 min de narración sobre data.tsx (sin gancho previo: la narración en 2ª persona ES el gancho).
// Planos reales/agnes por ShotLayer (cámara al azar por plano); escenas ilustradas y gráficos cortados en sub-planos de encuadre.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { FPS } from "../abysskit/lib";
import { ShotLayer, Shot } from "../abysskit/Shots";
import { C, FONT, KeyLine, Real, Stamp, ease } from "../abysskit/kit";
import { Amphi, O, SV } from "../abysskit/ocean";
import { Scene } from "./Escenas";
import { PlateCtx } from "../abysskit/plate";
import { PLATES } from "./plates";
import { Descent } from "./piezas_m1";
import { Plunge } from "./piezas_m2";
import { Echo } from "./piezas_m3";
import { ASIDE, END, SHOTS, TXT, S7 } from "./data";

export const FULL_FRAMES = Math.round((END + 1) * FPS);

// las 5 reglas de la vida en el mar: íconos en fila; la activa crece, las rotas llevan una X roja
const RULES = ["PRESSURE", "FOOD", "SHELL", "SIZE", "CLEAN"];
const Icon: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const st = { stroke: O.ink, strokeWidth: 7, fill: "none", strokeLinecap: "round" as const };
  if (i === 0) return <>{[0, 1, 2].map((k) => <path key={k} d={`M${-50 + k * 50},-60 l0,${50 + Math.sin(f / 8 + k) * 6} m-14,-14 l14,14 l14,-14`} {...st} />)}<rect x={-60} y={20} width={120} height={36} rx={8} {...st} /></>;
  if (i === 1) return <>{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={-40 + k * 20} cy={-50 + ((f * 1.2 + k * 23) % 100)} r={6} fill={O.ink} />)}<path d="M-60,60 L60,60" {...st} /></>;
  if (i === 2) return <path d="M0,0 m-6,0 a6,6 0 1,1 12,0 a16,16 0 1,1 -32,0 a26,26 0 1,1 52,0 a38,38 0 1,1 -76,0" {...st} />;
  if (i === 3) return <><path d="M-60,40 l0,-30 M60,40 l0,-30 M-60,25 L60,25" {...st} /><g transform={`scale(${0.8 + 0.1 * Math.sin(f / 12)})`}><path d="M-30,0 q30,-40 60,0 q-30,25 -60,0" {...st} /></g></>;
  return <><path d="M-55,-40 q30,-30 55,0 q25,30 55,0" {...st} /><path d="M-55,0 q30,-30 55,0 q25,30 55,0" {...st} /><path d="M-55,40 q30,-30 55,0 q25,30 55,0" {...st} /></>;
};
const Rules: React.FC<{ arg: string }> = ({ arg }) => {
  const f = useCurrentFrame(), all = arg === "all", m = arg.match(/^(-?\d+)(x?)$/), n = m ? Number(m[1]) : 5, x = !!(m && m[2]);
  const broken = (i: number) => all || i < n || (x && i === n);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #0e2a42 0%, #020812 78%)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 6, color: O.dim }}>THE RULES OF LIFE IN THE SEA</div>
    {RULES.map((r, i) => {
      const act = i === n && !all, k = ease(f, 3 + i * 4, 12 + i * 4), cx = 960 + (i - 2) * 300, sc = act ? 1.25 + 0.03 * Math.sin(f / 9) : 1;
      const xk = broken(i) ? (x && i === n ? ease(f, 12, 22) : 1) : 0;
      return <div key={i} style={{ position: "absolute", left: cx - 130, top: 340, width: 260, height: 420, opacity: k * (n >= 0 && !act && !all && !broken(i) ? 0.45 : 1), transform: `scale(${sc * (0.85 + 0.15 * k)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, border: `4px solid ${act ? O.gold : "rgba(244,239,230,.35)"}`, background: act ? "rgba(233,199,98,.10)" : "rgba(255,255,255,.03)" }} />
        <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: "absolute", top: 20 }}><Icon i={i} f={f} /></svg>
        <div style={{ position: "absolute", top: 290, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: O.dim }}>RULE {i + 1}</div>
        <div style={{ position: "absolute", top: 336, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 42, color: act ? O.gold : O.ink }}>{r}</div>
        {xk > 0 && <SV style={{ width: 260, height: 420 }}><path d={`M30,40 L${30 + 200 * xk},${40 + 340 * xk}`} stroke={C.red} strokeWidth={18} strokeLinecap="round" /><path d={`M230,40 L${230 - 200 * xk},${40 + 340 * xk}`} stroke={C.red} strokeWidth={18} strokeLinecap="round" /></SV>}
      </div>;
    })}
    {all && <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, display: "flex", justifyContent: "center" }}><div style={{ position: "relative", width: 400, height: 150 }}><Amphi x={200} y={90} s={0.9} /></div></div>}
  </AbsoluteFill>;
};
// cifra gigante que cuenta, con el anfípodo detrás
const Big: React.FC<{ n: number; sub: string }> = ({ n, sub }) => {
  const f = useCurrentFrame(), v = Math.round(n * ease(f, 4, 34));
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #0f2b44 0%, #02070e 75%)" }}>
    <div style={{ position: "absolute", right: 120, bottom: 60, opacity: 0.35, width: 900, height: 400 }}><Amphi x={500} y={260} s={2.4} /></div>
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
    case "scene": return arg === "m1" ? <Descent t0={s.sa ?? s.a} /> : arg === "m2" ? <Plunge t0={s.sa ?? s.a} /> : arg === "m3" ? <Echo t0={s.sa ?? s.a} /> : <PlateCtx.Provider value={{ pool: PLATES, i: SCI.get(s.sa ?? s.a) ?? 0, slug: "abyss02" }}><Scene name={arg} d={d} /></PlateCtx.Provider>;
    case "rules": return <Rules arg={p[1]} />;
    case "stamp": return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 50%, #10263a 0%, #02060c 75%)" }}><Stamp a={4} lines={p[1].split("/")} hot={Number(p[2])} /></AbsoluteFill>;
    case "big": return <Big n={Number(p[1])} sub={p.slice(2).join(":")} />;
    case "word": return <Word w={p[1]} />;
  }
  return <AbsoluteFill style={{ background: "#300" }} />;
};

const S: (Shot & { src7: S7 })[] = SHOTS.map((s) => {
  const base = { a: s.a, b: s.b, src7: s };
  if (s.k === "comp") { const [z, fx, fy] = s.cam!; return { ...base, comp: s.comp, cam: [z, fx, fy, z * 1.03, fx, fy] }; }
  return { ...base, v: `abyss02/${s.d}/${s.n}`, from: s.frm };
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
