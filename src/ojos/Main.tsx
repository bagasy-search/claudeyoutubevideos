// ojos · EL VIDEO ENTERO desde el EDL de cada idioma (armar_edl.py): planos (clip LTX · foto · mundo 3D · mapa del ojo),
// transiciones, ventanas del avatar y piezas. Los tiempos ya vienen clavados a la voz; acá sólo se dibuja.
// Audio FUERA de Remotion (voz + clips bajos + sfx se mezclan aparte). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { World, WorldProps, PielS, setKeys, screenOf, PT, V } from "./ojos3d";
import { EyeMap } from "./EyeMap";
import { P, e, handReady } from "./lib";
import * as K from "./kit";

export type Shot = { a: number; b: number; k: string; par: number; sub?: number; from?: number; tr: string };
export type Fx = { kind: string; a: number; b: number; par: number; [k: string]: any };
export type EDL = { lang: string; dur: number; par: number[]; win: { ms: number; me: number; off: number }[]; shots: Shot[]; fx: Fx[] };
export type AvWin = { ms: number; me: number; off: number; reel?: number; pieces?: [number, number][] };
const FPS = 30, fr = (t: number) => Math.round(t * FPS);
const cl = (x: number) => Math.max(0, Math.min(1, x));
const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);

// ---------------- vistas del mundo: cámara (inicio → deriva) y estado ----------------
type Pose = { p: V; l: V; p1?: V; l1?: V; fov: number };
const PF: V = [19.64, 1.045, 0];   // superficie de la porción fina
const POSE: Record<string, Pose> = {
  mesa: { p: [0.32, 1.1, 0.6], l: [0.05, 0.93, -0.2], p1: [0.24, 1.06, 0.46], fov: 32 },
  lamp: { p: [0.09, 1.176, 0.72], l: [-0.42, 1.04, -0.3], p1: [-0.046, 1.142, 0.55], fov: 30 },
  lampOff: { p: [0.18, 1.16, 0.66], l: [-0.18, 0.98, -0.3], p1: [0.12, 1.14, 0.58], fov: 32 },
  frasco: { p: [0.26, 1.084, 0.41], l: [0.07, 0.97, -0.16], p1: [0.184, 1.046, 0.296], fov: 30 },
  lvl: { p: [0.15, 0.938, 0.254], l: [0.06, 0.92, -0.16], p1: [0.114, 0.929, 0.182], fov: 28 },
  gota: { p: [0.26, 1.06, 0.34], l: [0.06, 0.98, -0.16], p1: [0.22, 1.05, 0.26], fov: 28 },
  toalla: { p: [0.52, 1.06, 0.26], l: [0.34, 0.89, -0.2], p1: [0.46, 1.03, 0.18], fov: 30 },
  pielBoth: { p: [19.72, 1.6, 1.9], l: [20, 0.85, 0], p1: [19.8, 1.5, 1.6], fov: 32 },
  pielLoss: { p: [19.288, 1.512, 1.68], l: [19.64, 1.0, 0], p1: [19.416, 1.448, 1.44], fov: 30 },
  pielFilm: { p: [19.992, 1.64, 1.6], l: [19.64, 1.0, 0], p1: [19.864, 1.544, 1.376], fov: 30 },
  pielRub: { p: [19.416, 1.34, 1.36], l: [19.64, 1.02, 0], p1: [19.512, 1.308, 1.216], fov: 30 },
  pielSlide: { p: [20.28, 1.412, 1.52], l: [19.8, 0.98, 0], p1: [20.152, 1.364, 1.36], fov: 30 },
  pielShine: { p: [19.256, 1.782, 1.44], l: [19.64, 1.03, 0], p1: [19.384, 1.686, 1.28], fov: 28 },
  pielPress: { p: [19.64, 1.942, 1.2], l: [19.64, 1.03, 0], p1: [19.64, 1.782, 1.056], fov: 30 },
  pielDirt: { p: [20.056, 1.862, 1.44], l: [19.64, 1.03, 0], p1: [19.928, 1.75, 1.28], fov: 30 },
};
const P0: PielS = { on: 0, film: 0, loss: 0, press: 0, rub: 0, thick: 0 };
const estado = (v: string, u: number, d: number, first: boolean): Omit<WorldProps, "t"> => {
  const w: Omit<WorldProps, "t"> = { lamp: 1, lift: 0, dropForm: 0, dropFall: 0, lvl: 0.8, glow: 0.15, steam: 0.25, piel: { ...P0 } };
  const pv = (o: Partial<PielS>) => { w.piel = { ...P0, on: 1, ...o }; };
  switch (v) {
    case "lamp": w.lamp = first ? 0.12 + 0.88 * e(u, 0.25, 1.2) : 1; break;
    case "lampOff": w.lamp = 1 - 0.85 * e(u, d - 1.8, d - 0.5); break;
    case "frasco": w.glow = 0.5; w.lift = e(u, 0.5, 1.6); break;
    case "lvl": w.glow = 0.4; w.lvl = 0.86 - 0.3 * e(u, 0.2, d); break;
    case "gota": w.glow = 0.5; w.lift = 1; w.dropForm = e(u, 0.2, 1.6); w.dropFall = cl((u - 1.8) / 1.0); break;
    case "toalla": w.steam = 1; break;
    case "pielBoth": pv({ loss: 1 }); break;
    case "pielLoss": pv({ loss: 1 }); break;
    case "pielFilm": pv({ loss: 1, film: e(u, 0.3, 2.6) }); break;
    case "pielRub": pv({ loss: 0.6, film: 0.7, rub: 0.5 + 0.5 * Math.sin(u * 5.5) }); break;
    case "pielSlide": pv({ loss: 0.3, film: 1, slide: e(u, 0.4, d - 0.3) }); break;
    case "pielShine": pv({ loss: 0.3, film: 1, shine: e(u, 0.3, 1.8) }); break;
    case "pielPress": pv({ loss: 0.4, film: 0.8, press: Math.pow(Math.max(0, Math.sin(u * 3.4)), 2) }); break;
    case "pielDirt": pv({ loss: 0.5, dirt: 1, film: e(u, 0.6, 2.6) }); break;
  }
  return w;
};

// ---------------- transiciones de ENTRADA (el plano nuevo entra sobre el anterior, que sigue T s más) ----------------
const TT: Record<string, number> = { portal: 0.6, whip: 0.3, push: 0.4, flip: 0.45, zoom: 0.5 };
const entrada = (tr: string, u: number): { style: React.CSSProperties; clip?: number } => {
  const T = TT[tr]; if (!T || u >= T) return { style: {} };
  const k = eo(u / T);
  switch (tr) {
    case "whip": return { style: { transform: `translateX(${(1 - k) * 1920}px)`, filter: `blur(${26 * (1 - k)}px)` } };
    case "push": return { style: { transform: `translateY(${(1 - k) * 1080}px)` } };
    case "flip": return { style: { transform: `perspective(2200px) rotateY(${(1 - k) * 80}deg)`, transformOrigin: "0% 50%", opacity: cl(u / 0.12) } };
    case "zoom": return { style: { transform: `scale(${1 + 0.6 * (1 - k)})`, filter: `blur(${16 * (1 - k)}px)`, opacity: cl(u / 0.2) } };
    case "portal": return { style: {}, clip: k };
  }
  return { style: {} };
};
// salida del plano viejo mientras entra el nuevo
const salida = (tr: string, u: number): React.CSSProperties => {
  const T = TT[tr]; if (!T) return {};
  const k = eo(u / T);
  switch (tr) {
    case "whip": return { transform: `translateX(${-k * 1700}px)`, filter: `blur(${26 * k}px)` };
    case "push": return { transform: `translateY(${-k * 500}px) scale(${1 - 0.1 * k})`, filter: `brightness(${1 - 0.5 * k})` };
    case "flip": return { filter: `brightness(${1 - 0.6 * k})` };
    case "zoom": return { transform: `scale(${1 + 2.2 * k})`, filter: `blur(${14 * k}px)`, opacity: 1 - k };
    case "portal": return { transform: `scale(${1 + 0.12 * k})`, filter: `brightness(${1 - 0.3 * k})` };
  }
  return {};
};

export const makeMain = (o: { slug: string; edl: EDL; av?: { win: AvWin[] }; avail: { clips: string[]; reel?: boolean } }) => {
  const { edl, slug } = o, lang = edl.lang;
  const shots = edl.shots.filter((s) => s.k !== "av");
  const WIN: AvWin[] = (o.av?.win?.length ? o.av.win : edl.win).map((w) => ({ ...w, pieces: w.pieces ?? [[w.ms, w.me]] }));
  const clips = new Set(o.avail.clips);
  // tramos de mundo: planos w consecutivos comparten UN canvas; la cámara viaja por keyframes
  const seg: number[] = []; let sid = -1;
  shots.forEach((s, i) => { const w = s.k.startsWith("w:"); seg.push(w ? (i > 0 && shots[i - 1].k.startsWith("w:") && Math.abs(shots[i - 1].b - s.a) < 0.05 ? sid : ++sid) : -1); });
  const firstLamp = shots.findIndex((s) => s.k === "w:lamp");
  const keys: { t: number; p: V; l: V; fov: number }[] = [];
  let prevEnd: { p: V; l: V; fov: number } | null = null, prevB = -9;
  shots.forEach((s) => {
    if (!s.k.startsWith("w:")) return;
    const q = POSE[s.k.slice(2)] ?? POSE.mesa, d = s.b - s.a;
    const end = { p: q.p1 ?? q.p, l: q.l1 ?? q.l, fov: q.fov };
    if (s.tr === "move" && prevEnd && Math.abs(prevB - s.a) < 0.05) {
      keys.push({ t: s.a, ...prevEnd }, { t: s.a + Math.min(1.4, d * 0.45), p: q.p, l: q.l, fov: q.fov });
    } else {
      if (prevEnd && s.a - prevB > 0.8) keys.push({ t: prevB + 0.7, ...prevEnd });   // el plano viejo queda quieto mientras sale
      keys.push({ t: s.a, p: q.p, l: q.l, fov: q.fov });
    }
    keys.push({ t: s.b - 0.003, ...end });
    prevEnd = end; prevB = s.b;
  });
  // limpia empates (setKeys pisa tiempos iguales) y deja el orden
  const K2 = keys.sort((x, y) => x.t - y.t).filter((k, i, A) => i === 0 || k.t - A[i - 1].t > 1e-4);

  const startOf = (i: number) => shots[i].a;
  const find = (t: number) => { let lo = 0, hi = shots.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (shots[m].a <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r; };
  const winAt = (t: number) => WIN.find((w) => t >= w.ms && t < w.me);
  const media = (id: string) => (clips.has(id) ? "c" : "i");

  // ---- un plano ----
  const Plano: React.FC<{ i: number; t: number }> = ({ i, t }) => {
    const s = shots[i], [ty, id] = [s.k.slice(0, 1), s.k.slice(2)], u = t - s.a, d = s.b - s.a;
    if (ty === "w") {
      const st = estado(id, u, d, i === firstLamp);
      return <AbsoluteFill style={{ background: "#0b0907" }}><World t={t} {...st} /></AbsoluteFill>;
    }
    if (ty === "e") return <CamaraMano seed={i}><EyeMap t={t} a={s.a} b={s.b} stage={id} lang={lang} idx={i} /></CamaraMano>;
    // punch: el mismo clip sigue pero el cuadro salta más cerca/lejos
    const punch = s.sub ? (s.sub % 2 ? 1.14 : 1.0) : 1.0;
    const kb = punch * (1.03 + 0.06 * cl(u / Math.max(1, d)));
    const org = ["50% 45%", "35% 50%", "62% 42%", "48% 60%"][i % 4];
    const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
    const vid = ty === "c" && media(id) === "c";
    return <CamaraMano seed={i}><AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${kb})`, transformOrigin: org }}>
        {vid ? <Sequence from={fr(s.a) - 12} layout="none"><OffthreadVideo src={staticFile(`${P}${id}.mp4`)} startFrom={Math.max(0, fr(s.from ?? 0) - 12)} muted style={st} /></Sequence>
          : <Img src={staticFile(`${P}img_${id}.jpg`)} style={st} />}
      </AbsoluteFill>
    </AbsoluteFill></CamaraMano>;
  };

  // ---- avatar (ventanas pagadas, preroll de 10 cuadros; sin desenfoque) ----
  const Avatar: React.FC<{ t: number }> = ({ t }) => {
    const w = winAt(t); if (!w) return null;
    const src = o.avail.reel ? staticFile(`av/${slug}/reel${w.reel ?? 0}.mp4`) : null;
    return <CamaraMano seed={77}><AbsoluteFill style={{ background: "#000" }}>
      {src ? <Sequence from={fr(w.ms) - 10} layout="none"><OffthreadVideo src={src} startFrom={Math.max(0, fr(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
        : <Img src={staticFile(`${P}av_still.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />}
    </AbsoluteFill></CamaraMano>;
  };

  // ---- piezas ----
  const Pieza: React.FC<{ f: Fx; t: number }> = ({ f, t }) => {
    const c = { t, a: f.a, b: f.b };
    const its = (f.items ?? []).map((x: any) => (typeof x === "string" ? { txt: x, at: f.a } : x));
    switch (f.kind) {
      case "tag": return <K.Tag {...c} txt={f.txt} x={f.x} y={f.y} dx={f.dx} dy={f.dy} />;
      case "tag3": { const q = screenOf(t, (PT as any)[f.pt] ?? PT.frasco); return <K.Tag {...c} txt={f.txt} x={q.x} y={q.y} dx={q.x > 1100 ? -200 : 200} dy={-140} />; }
      case "note": return <K.Note {...c} txt={f.txt} pos={f.pos} />;
      case "stamp": return <K.Stamp {...c} txt={f.txt} col={f.col} />;
      case "big": return <K.Big {...c} txt={f.txt} sub={f.sub} soft={f.soft} />;
      case "ring": return <K.Ring {...c} big={f.big} sub={f.sub} x={f.x ?? 1520} y={f.y ?? 300} spin={f.spin} />;
      case "chips": return <K.Chips {...c} items={its.map((x: any) => x.txt)} />;
      case "rule": return <K.RuleCard {...c} n={f.n} title={f.title} lang={lang} />;
      case "pair": return <K.Pair {...c} a1={f.a1} b1={f.b1} />;
      case "err": return <K.Err {...c} n={f.n} txt={f.txt} lang={lang} />;
      case "nosi": return <K.NoSi {...c} no={f.no} si={f.si} />;
      case "lower": return <K.Lower {...c} name={f.name} l2={f.l2} />;
      case "myth": return <K.Myth {...c} myth={f.myth} truth={f.truth} lang={lang} />;
      case "check": return <K.Check {...c} title={f.title} items={its} cross={f.cross} x={f.x} y={f.y} />;
      case "steps": return <K.Steps {...c} items={its} />;
      case "recap": return <K.Recap {...c} items={its} lang={lang} />;
      case "mantra": return <K.Mantra {...c} lines={f.lines} />;
      case "quote": return <K.Quote {...c} txt={f.txt} />;
      case "ask": return <K.Ask {...c} q={f.q} items={its.map((x: any) => x.txt)} lang={lang} />;
      case "sub": return <K.Sub {...c} bell={f.bell} lang={lang} press={f.a + 1.4} ring={f.a + 2.3} />;
    }
    return null;
  };

  const Main: React.FC = () => {
    const [h] = React.useState(() => delayRender("fuentes"));
    React.useEffect(() => { handReady().then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]);
    setKeys(K2);
    const f = useCurrentFrame(), t = f / FPS;
    const i = find(t), w = winAt(t);
    const capas: React.ReactNode[] = [];
    if (!w && i >= 0) {
      const s = shots[i], u = t - s.a, T = TT[s.tr] ?? 0;
      const prevVisible = i > 0 && T > 0 && u < T && Math.abs(shots[i - 1].b - s.a) < 0.05 && !(seg[i] >= 0 && seg[i] === seg[i - 1]);
      if (prevVisible) capas.push(<AbsoluteFill key={`p${i - 1}`} style={salida(s.tr, u)}><Plano i={i - 1} t={t} /></AbsoluteFill>);
      const en = entrada(s.tr, u), key = seg[i] >= 0 ? `w${seg[i]}` : `s${i}`;
      const nodo = <Plano i={i} t={t} />;
      if (en.clip !== undefined && en.clip < 1) {
        const R = en.clip * Math.hypot(960, 540) * 1.02;
        capas.push(<AbsoluteFill key={key} style={{ clipPath: `circle(${R}px at 960px 540px)` }}>{nodo}</AbsoluteFill>);
        capas.push(<div key="ring" style={{ position: "absolute", left: 960 - R, top: 540 - R, width: 2 * R, height: 2 * R, borderRadius: "50%", boxShadow: `0 0 0 ${4 + 4 * (1 - en.clip)}px rgba(255,214,150,${0.8 * (1 - en.clip)}), 0 0 70px 14px rgba(240,168,58,${0.4 * (1 - en.clip)})` }} />);
      } else capas.push(<AbsoluteFill key={key} style={en.style}>{nodo}</AbsoluteFill>);
    }
    // destello cálido: transición "light" y cambio de escena dentro del mundo
    let fl = 0;
    if (i >= 0 && !w) { const s = shots[i], u = t - s.a; if (s.tr === "light") fl = Math.max(0, 1 - u / 0.28) * 0.8; }
    if (i + 1 < shots.length && shots[i + 1].tr === "light") { const v = shots[i + 1].a - t; if (v < 0.08 && v >= 0) fl = Math.max(fl, (1 - v / 0.08) * 0.8); }
    const fx = edl.fx.filter((x) => t >= x.a - 0.05 && t <= x.b + 0.05);
    return <AbsoluteFill style={{ background: "#000" }}>
      {capas}
      {w && <Avatar t={t} />}
      {fl > 0.01 && <AbsoluteFill style={{ background: "#ffe3b8", opacity: fl, mixBlendMode: "screen" }} />}
      {fx.map((x, k) => <Pieza key={`${x.kind}${x.a}${k}`} f={x} t={t} />)}
    </AbsoluteFill>;
  };
  return { Main, frames: Math.ceil((edl.dur + 1) * FPS) };
};
