// Lc2Main — montaje del canal 2 de Loretta (lc2dump / lc2pan / lc2cass). Lee <slug>_tl.json (D:/rtmp/lc2/gen_tl.py).
// Base: avatar (reel único RunPod, jump-cut de zoom en cada línea) · clips LTX CON su sonido nativo bajo la voz · pantallas
// completas Lc2*. Encima: fichas Lc2* disparadas por el texto + chip "Supper N of 7". Corte seco con asentamiento de 6 cuadros.
// ⛔ Placeholder (clip LTX o reel que todavía no existen) sólo para montar y revisar: la entrega falla si tl.pendientes > 0.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd, hexA } from "../loretta/LorTheme";
import { LorNameTag } from "../loretta/LorOverlays";
import { PLUM, PLUM2, Lc2Oven, Lc2Timer, Lc2Temp, Lc2Price, Lc2Plates, Lc2Ingredients, Lc2Opener, Lc2Hook7, Lc2Book } from "./Lc2Kit";
import { Lc2Shop, Lc2Week, Lc2Homework, Lc2Pans } from "./Lc2Kit2";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FILL: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover" };
const CLIP_VOL = 0.32; // sonido nativo LTX bajo la voz (la voz va a -14 LUFS)

// Ken-Burns por plano (semilla = cuadro de inicio): fotos 3-8 %, clips 1,5-3,5 %; nunca destapa borde
const useKB = (seed: number, clip: boolean) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const r = (o: number) => rnd(seed + o * 7919);
  const piso = clip ? 1.03 : 1.06, amp = (clip ? 1.5 + 2 * r(1) : 3 + 5 * r(1)) / 100, acerca = r(2) > 0.5;
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], cl), kk = acerca ? k : 1 - k;
  const z = piso + amp * kk, dx = (r(3) - 0.5) * 2 * (clip ? 0.6 : 1.3), dy = (r(4) - 0.5) * 1.4 * (clip ? 0.6 : 1.3);
  return { transform: `scale(${z.toFixed(4)}) translate(${(dx * kk).toFixed(3)}%, ${(dy * kk).toFixed(3)}%)`, transformOrigin: `${(28 + 44 * r(5)).toFixed(1)}% ${(28 + 44 * r(6)).toFixed(1)}%` };
};

// asentamiento del corte: el plano entra 4 % grande y se acomoda en 6 cuadros (golpe de montaje, sin transición)
const Settle: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (!on) return <>{children}</>;
  const s = 1 + 0.04 * (1 - spring({ frame: f, fps, config: { damping: 18, stiffness: 260, mass: 0.6 } }));
  return <AbsoluteFill style={{ scale: String(s) }}>{children}</AbsoluteFill>;
};

const Pending: React.FC<{ c: any }> = ({ c }) => {
  const kb = useKB(c.seed, false);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#2a1a22" }}>
      {c.img ? <Img src={staticFile(c.img)} style={{ ...FILL, ...kb }} /> : (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${PLUM2}, #1d0f18)`, alignItems: "center", justifyContent: "center", padding: 160 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: hexA(LOR.paper, 0.6) }}>LTX CLIP · {c.id} · {c.seg}s</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: LOR.paper, textAlign: "center", lineHeight: 1.15, marginTop: 24 }}>{c.desc}</div>
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", right: 24, bottom: 20, fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "#fff", background: "rgba(200,50,58,.8)", padding: "4px 10px", borderRadius: 6 }}>PENDIENTE {c.id}</div>
    </AbsoluteFill>
  );
};
const Clip: React.FC<{ c: any }> = ({ c }) => {
  const kb = useKB(c.seed, true);
  if (!c.src) return <Pending c={c} />;
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}><OffthreadVideo src={staticFile(c.src)} volume={CLIP_VOL} style={{ ...FILL, ...kb }} /></AbsoluteFill>;
};

// avatar: reel único en el offset de su ventana; jump-cut de zoom en cada cambio de línea (1.00 ↔ 1.13) + push lento
const Avatar: React.FC<{ c: any }> = ({ c }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const cuts: number[] = c.cuts ?? [];
  const k = cuts.filter((x) => f >= x).length;
  const base = (k + (rnd(c.seed) > 0.5 ? 1 : 0)) % 2 ? 1.13 : 1.0;
  const z = base + interpolate(f, [0, durationInFrames], [0, 0.03], cl);
  const style: React.CSSProperties = { ...FILL, scale: String(z), transformOrigin: "50% 34%" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {c.src ? <OffthreadVideo src={staticFile(c.src)} startFrom={c.sf} muted style={style} /> : <Img src={staticFile("ref_lor.png")} style={style} />}
      {!c.src ? <div style={{ position: "absolute", right: 24, bottom: 20, fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "#fff", background: "rgba(200,50,58,.8)", padding: "4px 10px", borderRadius: 6 }}>AVATAR PENDIENTE · reel {c.sf}</div> : null}
    </AbsoluteFill>
  );
};

const COMP: Record<string, React.FC<any>> = { Lc2Hook7, Lc2Book, Lc2Shop, Lc2Week, Lc2Homework, Lc2Pans };
const OVC: Record<string, React.FC<any>> = { Lc2Oven, Lc2Timer, Lc2Temp, Lc2Price, Lc2Plates, Lc2Ingredients, Lc2Opener, LorNameTag };

const Shot: React.FC<{ c: any }> = ({ c }) => {
  let body: React.ReactNode = null;
  if (c.k === "av") body = <Avatar c={c} />;
  else if (c.k === "clip") body = <Clip c={c} />;
  else if (c.k === "comp") { const C = COMP[c.name]; body = C ? <AbsoluteFill style={{ backgroundColor: LOR.paper }}><C {...c.props} /></AbsoluteFill> : null; }
  return <Settle on={!c.cont && c.k !== "comp"}>{body}</Settle>;
};

// chip permanente "Supper N of 7" arriba a la izquierda mientras dura cada receta (se esconde bajo pantallas completas y fichas tl)
const Chip: React.FC<{ n: number; title: string }> = ({ n, title }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 16 } }), o = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], cl);
  return (
    <div style={{ position: "absolute", left: 48, top: 40, opacity: o, translate: `${(1 - p) * -40}px 0`, display: "flex", alignItems: "center", gap: 14, background: hexA(LOR.paper, 0.94), borderRadius: 40, padding: "8px 24px 8px 8px", boxShadow: "0 8px 24px rgba(0,0,0,.25)" }}>
      <div style={{ width: 54, height: 54, borderRadius: 27, background: PLUM, color: LOR.paper, fontFamily: SERIF, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 28, color: LOR.ink, whiteSpace: "nowrap" }}>{title}</div>
    </div>
  );
};

export type Lc2TL = { slug: string; frames: number; audio: string; TL: any[]; OV: any[]; R?: any[]; pendientes: number };
export const Lc2Main: React.FC<{ tl: Lc2TL }> = ({ tl }) => {
  // tramos donde el chip NO va: pantallas completas y fichas de la esquina tl (ingredientes) y la apertura
  const tapa: [number, number][] = [
    ...tl.TL.filter((c) => c.k === "comp").map((c) => [c.from, c.from + c.dur] as [number, number]),
    ...tl.OV.filter((o) => o.name === "Lc2Ingredients" || o.name === "Lc2Opener").map((o) => [o.from, o.from + o.dur] as [number, number]),
  ];
  const chips: { n: number; title: string; from: number; dur: number }[] = [];
  for (const r of tl.R ?? []) {
    let a = r.from; const b = r.to;
    const cortes = tapa.filter(([x, y]) => y > a && x < b).sort((p, q) => p[0] - q[0]);
    for (const [x, y] of cortes) { if (x - a > 60) chips.push({ n: r.n, title: r.title, from: a, dur: x - a }); a = Math.max(a, y); }
    if (b - a > 60) chips.push({ n: r.n, title: r.title, from: a, dur: b - a });
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {tl.TL.map((c, i) => (<Sequence key={"b" + i} from={c.from} durationInFrames={c.dur}><Shot c={c} /></Sequence>))}
      {chips.map((c, i) => (<Sequence key={"c" + i} from={c.from} durationInFrames={c.dur}><Chip n={c.n} title={c.title} /></Sequence>))}
      {tl.OV.map((o, i) => { const C = OVC[o.name]; return C ? <Sequence key={"o" + i} from={o.from} durationInFrames={o.dur}><C {...o.props} /></Sequence> : null; })}
      <Audio src={staticFile(tl.audio)} />
    </AbsoluteFill>
  );
};
