// t30domen — The Rust Whisperer: restauración ASMR sin voz sobre metraje CC BY (The Rusty Hand).
// La EDL sale de D:/rtmp_t30domen/tools/plan.mjs → edl.json. Video mudo: el sonido (Mixkit/Freesound por acción)
// se mezcla fuera de Remotion (public/t30domen_mix.wav) y lo pega encfin.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import edl from "./edl.json";

const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });
const SRC = staticFile("t30domen/srcv.mp4");
const FPS = edl.fps;
export const TOTAL_FRAMES_T30DOMEN = edl.total;
type Seg = { tipo: string; from: number; dur: number; s0?: number; s1?: number; v?: number; paso: number; zoom?: number };
const SEGS = edl.segs as Seg[];
const ACCENT = "#e0793a"; // óxido

const Plano: React.FC<{ s: Seg }> = ({ s }) => {
  const f = useCurrentFrame();
  const z0 = s.zoom ?? 1;
  const z = z0 + interpolate(f, [0, s.dur], [0, 0.025], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={SRC} muted startFrom={Math.round((s.s0 as number) * FPS)} playbackRate={s.v}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

// Cortina antes/después: el primer cuadro podrido contra el último brillante (mismo encuadre).
const Cortina: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0.9 * FPS, dur - 1.6 * FPS], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const lab = interpolate(f, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tag = (t: string, side: "l" | "r", op: number) => (
    <div style={{ position: "absolute", top: 54, [side === "l" ? "left" : "right"]: 60, opacity: op * lab, fontFamily: inter, fontWeight: 800,
      fontSize: 34, letterSpacing: 6, color: "#fff", background: "rgba(0,0,0,.55)", padding: "8px 20px", borderRadius: 4 }}>{t}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile("t30domen/despues.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${x}%)` }}>
        <Img src={staticFile("t30domen/antes.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: 4, marginLeft: -2, background: "#fff", boxShadow: "0 0 14px rgba(0,0,0,.6)", opacity: x > 0.2 && x < 99.8 ? 1 : 0 }} />
      {tag("AFTER", "l", interpolate(x, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
      {tag("BEFORE", "r", interpolate(x, [86, 96], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
    </AbsoluteFill>
  );
};

// Rótulo de etapa + barra de progreso 0→100 %.
const pasoEn = (fr: number) => {
  let p = 0;
  for (const s of SEGS) { if (s.from > fr) break; if (s.paso >= 1 && s.paso <= 16) p = s.paso; }
  return p;
};
const Rotulo: React.FC = () => {
  const fr = useCurrentFrame();
  const p = pasoEn(fr);
  const ini = (edl.pasoIni as Record<string, number>)[String(p)];
  if (!p || ini === undefined) return null;
  const t = fr - ini, D = 4.2 * FPS;
  const a = interpolate(t, [0, 12, D - 14, D], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (a <= 0) return null;
  const n = p === 16 ? "" : `Step ${p}`;
  return (
    <div style={{ position: "absolute", left: 56, bottom: 64, opacity: a, transform: `translateX(${((1 - a) * -18).toFixed(1)}px)`,
      display: "flex", alignItems: "center", fontFamily: inter, color: "#fff", background: "rgba(10,10,10,.62)", borderLeft: `4px solid ${ACCENT}`, padding: "10px 20px 10px 16px", borderRadius: 3 }}>
      {n ? <span style={{ fontWeight: 800, fontSize: 26, letterSpacing: 2, color: ACCENT, textTransform: "uppercase" }}>{n}</span> : null}
      {n ? <span style={{ fontWeight: 400, fontSize: 26, margin: "0 12px", opacity: 0.6 }}>·</span> : null}
      <span style={{ fontWeight: 600, fontSize: 28 }}>{edl.pasos[p]}</span>
    </div>
  );
};
const Barra: React.FC = () => {
  const fr = useCurrentFrame();
  const a = interpolate(fr, [edl.progIni, edl.progIni + 15, edl.progFin + 3 * FPS, edl.progFin + 4 * FPS], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (a <= 0) return null;
  const pr = interpolate(fr, [edl.progIni, edl.progFin], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 56, right: 56, bottom: 36, height: 5, opacity: a * 0.9, background: "rgba(255,255,255,.22)", borderRadius: 3 }}>
      <div style={{ width: `${(pr * 100).toFixed(2)}%`, height: "100%", background: ACCENT, borderRadius: 3 }} />
    </div>
  );
};

const Credito: React.FC = () => {
  const fr = useCurrentFrame(), T = edl.total;
  const a = Math.max(interpolate(fr, [0, 8, 6 * FPS - 10, 6 * FPS], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(fr, [T - 10 * FPS, T - 10 * FPS + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", right: 46, bottom: 58, opacity: a * 0.92, fontFamily: inter, fontWeight: 600, fontSize: 21, color: "#fff",
      background: "rgba(0,0,0,.5)", padding: "5px 12px", borderRadius: 3, textShadow: "0 1px 4px rgba(0,0,0,.9)" }}>Original footage: The Rusty Hand · CC BY</div>
  );
};

const Campana: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" /></svg>
);
const Cierre: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const q = interpolate(f, [30, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(f, [dur - 14, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,0) 30%, rgba(0,0,0,${(0.78 * a).toFixed(2)}) 62%)` }} />
      <div style={{ position: "absolute", right: 110, top: 300, width: 700, fontFamily: inter, color: "#fff", opacity: a, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "#cc1f1f", padding: "16px 34px", borderRadius: 8, fontWeight: 800, fontSize: 40, letterSpacing: 2 }}>SUBSCRIBE</div>
          <div style={{ background: "rgba(255,255,255,.14)", borderRadius: 50, width: 78, height: 78, display: "flex", alignItems: "center", justifyContent: "center" }}><Campana s={46} /></div>
        </div>
        <div style={{ marginTop: 18, fontSize: 28, fontWeight: 400, opacity: 0.85 }}>A new restoration every week.</div>
        <div style={{ marginTop: 56, opacity: q, fontSize: 40, fontWeight: 600, lineHeight: 1.25, borderLeft: `5px solid ${ACCENT}`, paddingLeft: 22 }}>
          What's the rustiest thing you've ever brought back?
          <div style={{ fontSize: 26, fontWeight: 400, opacity: 0.8, marginTop: 12 }}>Tell me in the comments.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MainT30domen: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SEGS.map((s, i) => (
      <Sequence key={i} from={s.from} durationInFrames={s.dur} premountFor={45}>
        {s.tipo === "cortina" ? <Cortina dur={s.dur} /> : <Plano s={s} />}
        {s.paso === 18 ? <Cierre dur={s.dur} /> : null}
      </Sequence>
    ))}
    <Rotulo />
    <Barra />
    <Credito />
  </AbsoluteFill>
);
