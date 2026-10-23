// fbcafe · MINUTO 1 + LA COLECCIÓN. Un solo hilo, sin cortes secos:
// avatar "Golpeá esta tabla" → portal a la toma real (nudillos: TOC, la levanta: pesa) → el mundo: la tabla en los caballetes,
// "no es madera": la piel de madera se barre y queda el cemento → la punta en corte → latigazo a la bolsa tirada →
// baja a la superficie: la veta es un paisaje → el frasco de CAFÉ en el banco → "pensá en tu patio": el deck junto a la pileta
// se pudre en dos inviernos (gris, puntas, hongo, astillas) → toma real del deck → "se moja": el agua sube por la punta →
// avatar ($2 la tabla, 5 errores, la manguera) → dron sobre el taller (Claudio) → la radio y el mate → LA COLECCIÓN se abre →
// la descripción con la 1ª línea → "volvemos al patio".
// Las ventanas del avatar las manda el reel pagado (avwin.json): fuera de ellas va el "contenido" (mundo o toma real).
// Audio fuera de Remotion (voz + sonido nativo de las tomas se mezclan aparte). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed, pageAt } from "./taller3d";
import { EV } from "./cam";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import CLIPS from "./clips.json";
import { BigNum, COL, FONT, LowerThird, P, Portal, Tag, e, ei, extrude, s, spr } from "./lib";

export const MIN1_FRAMES = s(EV.fin1);
const REEL = (AVAIL as { reel: boolean }).reel;
type Win = { ms: number; me: number; off: number };
export const WIN: Win[] = (AVW as { win: Win[] }).win;
const CL = CLIPS as Record<string, boolean | number>;
const TR = 0.4;

// toma real: el mp4 LTX si ya llegó, si no la foto de la que sale (para los stills)
export const Clip: React.FC<{ k: string; at: number; t: number; z?: [number, number]; dur?: number }> = ({ k, at, t, z = [1.03, 1.1], dur = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, at, at + 8);
  // si la base dura más que la toma, cámara lenta pareja (nunca se congela ni se queda en negro)
  const len = typeof CL[k] === "number" ? (CL[k] as unknown as number) : 0, rate = len && dur > len - 0.15 ? Math.max(0.35, (len - 0.15) / dur) : 1;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return <AbsoluteFill style={{ transform: `scale(${sc})`, background: "#000" }}>
    {CL[k] ? <Sequence from={s(at)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted playbackRate={rate} style={st} /></Sequence> : <Img src={staticFile(P + k + ".jpg")} style={st} />}
  </AbsoluteFill>;
};

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  // +14 cuadros: la Sequence sigue viva durante la transición de salida → nunca cuadro negro
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.5 && t < w.me + 0.8);
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 15)} durationInFrames={s(w.me - w.ms) + 15 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 15)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  // SIN desenfoque ni halo en el avatar (orden del creador 21-oct): borde nítido
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- el hilo: qué se ve fuera del avatar ----------------
// w = el mundo (cámara continua); c = toma real (entra por portal desde el punto `from` del mundo, sale con latigazo)
type Beat = { t: number; k: "w" } | { t: number; k: "c"; id: string; from?: [number, number, number] };
export const BEATS1: Beat[] = [
  { t: 0, k: "c", id: "g_toc" },
  { t: EV.wipe - 0.25, k: "w" },
  { t: EV.deckClip, k: "c", id: "c_deck", from: PT.deck },
  { t: EV.culpa - 3.0, k: "w" },
  { t: EV.desmolde, k: "c", id: "p_desmolde_s1" },
  { t: EV.dolares - 1.0, k: "w" },
  { t: EV.manguera, k: "c", id: "p_manguera_s1" },
  { t: EV.primer - 0.3, k: "w" },
];
const beatAt = (B: Beat[], t: number) => { let i = 0; while (i < B.length - 1 && B[i + 1].t <= t) i++; return i; };

const Content: React.FC<{ B: Beat[]; t: number }> = ({ B, t }) => {
  const i = beatAt(B, t), b = B[i], nx = B[i + 1];
  const view = (bb: Beat, tt: number) => bb.k === "w" ? <World t={tt} /> : <Clip k={bb.id} at={bb.t} t={tt} />;
  let node = view(b, t);
  // transición hacia el beat siguiente (termina justo en nx.t)
  if (nx && t > nx.t - TR) {
    const k = ei(t, nx.t - TR, nx.t);
    if (nx.k === "c" && b.k === "w") {
      const p = nx.from ? screenOf(t, nx.from) : { x: 1240, y: 460 };
      node = <>{node}<Portal x={p.x} y={p.y} r={k}>{view(nx, t)}</Portal></>;
    } else if (!(nx.k === "w" && b.k === "w")) {
      const mb = Math.sin(k * Math.PI) * 40;
      node = <>
        <AbsoluteFill style={{ transform: `translateX(${-k * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{node}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateX(${(1 - k) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{view(nx, Math.max(t, nx.t))}</AbsoluteFill>
      </>;
    }
  }
  return node;
};

// avatar encima del contenido según el reel: entra con latigazo (termina en ms), sale abriendo un portal al contenido (termina en me)
export const Hilo: React.FC<{ B: Beat[]; t: number }> = ({ B, t }) => {
  const w = WIN.find((x) => t >= x.ms - TR && t < x.me + 0.02);
  if (!w) return <Content B={B} t={t} />;
  if (t < w.ms && w.ms > 0.05) {
    const k = ei(t, w.ms - TR, w.ms), mb = Math.sin(k * Math.PI) * 40;
    return <>
      <AbsoluteFill style={{ transform: `translateX(${-k * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}><Content B={B} t={t} /></AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(1 - k) * 1920}px)` }}><Avatar t={t} /></AbsoluteFill>
    </>;
  }
  const r = ei(t, w.me - TR, w.me);
  return <>
    <Avatar t={t} />
    {r > 0 && <Portal x={1250} y={470} r={r}><Content B={B} t={t} /></Portal>}
  </>;
};
export const inAvatar = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

// sello que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,10,0,.3)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// almanaque que pasa hojas (INVIERNO 1 → 2)
export const Calendar: React.FC<{ t: number; x: number; y: number; label: string; days: { at: number; d: number }[]; out: number; inAt: number }> = ({ t, x, y, label, days, out, inAt }) => {
  const o = e(t, inAt, inAt + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  let cur = days[0].d, prev = -1, k = 1;
  for (const d of days) if (t >= d.at) { prev = cur === d.d ? prev : cur; cur = d.d; k = e(t, d.at, d.at + 0.35); }
  const page = (n: number, extra: React.CSSProperties = {}) => (
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "linear-gradient(180deg,#fffaf0,#efe6d4)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", overflow: "hidden", fontFamily: FONT, textAlign: "center", ...extra }}>
      <div style={{ background: "#3a6ea8", color: "#fff", fontWeight: 900, fontSize: 28, letterSpacing: 5, padding: "10px 0" }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 150, color: "#2b2620", lineHeight: "190px" }}>{n}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 260, height: 260, opacity: o, perspective: 1200, transform: `scale(${Math.min(1.08, spr(t, inAt))}) rotate(-3deg)` }}>
      {page(cur)}
      {prev > 0 && k < 1 && page(prev, { transformOrigin: "50% 0", transform: `rotateX(${k * 110}deg) translateY(${k * 40}px)`, opacity: 1 - k * 0.6 })}
    </div>
  );
};

// fichas que suben girando
export const Chips: React.FC<{ t: number; items: { at: number; tx: string; col: string }[]; out: number; y?: number }> = ({ t, items, out, y = 820 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 28, perspective: 1200, flexWrap: "wrap", padding: "0 60px" }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.05, out + i * 0.05 + 0.25));
      return <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, padding: "14px 30px", borderRadius: 18,
        background: "linear-gradient(180deg, rgba(40,30,22,.95), rgba(20,15,10,.95))", boxShadow: `0 26px 50px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18), 0 0 0 3px ${it.col}88`, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: it.col, letterSpacing: 2, textShadow: extrude(5, "#000") }}>{it.tx}</div>;
    })}
  </div>
);

// el agua que sube por la punta de la tabla apoyada (capilaridad): flechas azules que trepan
const Wick: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, filter: "drop-shadow(0 0 10px rgba(80,170,255,.8))" }}>
      {[-90, 0, 90].map((dx, i) => {
        const ph = ((t - at) * 0.9 + i * 0.33) % 1;
        return <g key={i} transform={`translate(${x + dx},${y + 60 - ph * 180})`} opacity={Math.sin(ph * Math.PI)}>
          <path d="M0,40 L0,-10 M-18,8 L0,-14 L18,8" stroke={COL.ice} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>;
      })}
    </svg>
  );
};

// tarjeta "descripción del video": el renglón 1 se ilumina y la flecha lo señala (sin URL en pantalla: sólo "link")
export const Desc: React.FC<{ t: number; at: number; out: number; l2at?: number }> = ({ t, at, out, l2at = 1e9 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.9, at + 1.4), sweep = e(t, at + 0.9, at + 1.9), h2 = e(t, l2at, l2at + 0.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 960, top: 640, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-8 + 4 * Math.sin(t * 0.8)}deg)`, width: 1240, padding: "30px 44px 36px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,178,87,${0.16 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,178,87,${0.9 * hl}), 0 0 40px rgba(255,178,87,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 38, lineHeight: 1.25 }}>🧱 La Colección del Constructor Libre, todos mis arreglos con medidas</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        <div style={{ marginTop: 14, padding: "10px 20px", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 32, background: `rgba(143,214,255,${0.14 * h2})`, boxShadow: h2 > 0.05 ? `0 0 0 3px rgba(143,214,255,${0.8 * h2})` : undefined }}>📏 Las medidas de la mezcla, escritas</div>
        {L(980)}{L(760, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -900, top: -170, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.amber, textShadow: extrude(6, "#3a2410"), whiteSpace: "nowrap" }}>1ª LÍNEA ➜</div>
    </div>
  );
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [<Hilo key="hilo" B={BEATS1} t={t} />];
  const av = inAvatar(t);
  const sc = (q: [number, number, number]) => screenOf(t, q);

  // TOC · SECO · DURO; la levanta: pesa
  L.push(<Stamp key="toc" t={t} at={EV.toc + 0.7} text="TOC" x={1350} y={300} out={EV.levanta - 0.2} rot={-8} col={COL.amber} />);
  L.push(<BigNum key="kg" t={t} at={EV.levanta + 0.6} text="≈ 5 KG" x={1450} y={250} size={150} out={EV.noMadera - 0.4} sub="PESA COMO UN LADRILLO" col={COL.ink} edge="#4a3a2a" />);
  // (las etiquetas clavadas al mundo no se dibujan mientras está el avatar)
  // no es madera / es cemento (sobre el avatar) → la piel de madera se barre en el mundo
  L.push(<Stamp key="nm" t={t} at={EV.noMadera + 0.15} text="NO ES MADERA" x={960} y={200} out={EV.cemento - 0.1} rot={-5} size={90} />);
  L.push(<Stamp key="ec" t={t} at={EV.cemento + 0.05} text="ES CEMENTO" x={960} y={200} out={EV.wipe + 1.1} rot={4} size={100} col="#d8d4cc" />);
  if (t > EV.wipe && t < EV.veta && !av) {
    const c = sc(PT.cut), b = sc(PT.bag);
    L.push(<Tag key="cg" t={t} at={EV.wipe + 1.0} x={c.x} y={c.y} dx={-320} dy={170} text="CEMENTO GRIS" sub="POR DENTRO" col="#e8e4dc" out={EV.wipe + 1.9} size={50} />);
    L.push(<Tag key="bo" t={t} at={EV.wipe + 2.3} x={b.x} y={b.y} dx={220} dy={-200} text="LA BOLSA" sub="DEL FONDO DEL PATIO" col="#e8d8b4" out={EV.veta - 0.1} size={52} />);
  }
  if (t > EV.veta && t < EV.alacena && !av) {
    const k = sc(PT.knot);
    L.push(<Tag key="ve" t={t} at={EV.veta + 1.0} x={k.x - 260} y={k.y + 40} dx={-120} dy={-200} text="VETA" col={COL.amber} out={EV.alacena - 0.5} size={56} />);
    L.push(<Tag key="nu" t={t} at={EV.veta + 1.6} x={k.x} y={k.y} dx={200} dy={-180} text="NUDOS" col={COL.amber} out={EV.alacena - 0.5} size={56} />);
    L.push(<Chips key="pv" t={t} items={[{ at: EV.muelle, tx: "PINO DE MUELLE · 40 VERANOS", col: "#e8d8b4" }]} out={EV.alacena - 0.5} y={880} />);
  }
  if (t > EV.alacena && t < EV.cafe && !av) { const c = sc(PT.cafe); L.push(<Tag key="ca" t={t} at={EV.alacena + 0.6} x={c.x} y={c.y} dx={-330} dy={-170} text="DE LA ALACENA" col={COL.amber} out={EV.cafe - 0.2} size={60} />); }
  L.push(<Stamp key="cf" t={t} at={EV.cafe + 0.05} text="CAFÉ" x={1400} y={260} out={EV.patio - 0.2} rot={-6} size={130} col={COL.amber} />);
  // tu patio: el deck que se pudre
  if (t > EV.pusiste - 0.5 && t < EV.culpa && !av) {
    const d = sc(PT.deck), de = sc(PT.deckEnd);
    L.push(<Tag key="td" t={t} at={EV.pusiste + 0.3} x={d.x} y={d.y} dx={-260} dy={-200} text="TU DECK" sub="AL LADO DE LA PILETA" col={COL.ink} out={EV.inviernos - 0.2} size={56} />);
    L.push(<Calendar key="cal" t={t} x={140} y={130} label="INVIERNO" inAt={EV.inviernos} out={EV.hongo - 2.4} days={[{ at: EV.inviernos, d: 1 }, { at: EV.inviernos + 1.2, d: 2 }]} />);
    L.push(<Tag key="gr" t={t} at={EV.inviernos + 1.6} x={d.x} y={d.y} dx={240} dy={-210} text="GRISES" col="#c9c5bc" out={EV.hongo - 2.2} size={48} />);
    L.push(<Tag key="pu" t={t} at={EV.inviernos + 2.1} x={de.x} y={de.y} dx={-200} dy={-150} text="PUNTAS LEVANTADAS" col={COL.amber} out={EV.hongo - 2.2} size={44} />);
  }
  L.push(<Stamp key="hn" t={t} at={EV.hongo + 0.3} text="HONGO NEGRO" x={560} y={860} out={EV.astillas + 2.0} rot={-5} size={76} />);
  L.push(<Stamp key="as" t={t} at={EV.astillas + 0.7} text="ASTILLAS" x={1380} y={860} out={EV.lijar - 0.1} rot={5} size={76} col={COL.amber} />);
  if (t > EV.lijar && t < EV.culpa) L.push(<Chips key="lj" t={t} items={[{ at: EV.lijar + 0.1, tx: "LIJAR", col: COL.ink }, { at: EV.lijar + 0.5, tx: "BARNIZAR", col: COL.ink }, { at: EV.lijar + 1.1, tx: "TODOS LOS AÑOS", col: COL.red }]} out={EV.culpa - 0.4} />);
  if (t > EV.culpa && t < EV.desmolde && !av) {
    const de = sc(PT.deckEnd);
    L.push(<Wick key="wk" t={t} at={EV.culpa + 0.4} out={EV.pudre + 0.4} x={de.x} y={de.y} />);
    L.push(<Tag key="ag" t={t} at={EV.culpa + 0.7} x={de.x} y={de.y - 120} dx={-280} dy={-120} text="EL AGUA SUBE" sub="Y NO SE SECA NUNCA" col={COL.ice} out={EV.pudre - 1.6} size={48} />);
  }
  L.push(<Stamp key="sp" t={t} at={EV.pudre + 0.3} text="SE PUDRE" x={1300} y={240} out={EV.desmolde - 0.2} rot={-7} />);
  // promesa: madera de verdad, $2 la tabla, paso a paso, 5 errores, la manguera
  if (t > EV.desmolde) L.push(<Tag key="mv" t={t} at={EV.parecen + 0.3} x={1000} y={620} dx={260} dy={-220} text="PARECE MADERA" sub="Y ES CEMENTO" col={COL.amber} out={EV.dolares - 1.2} size={56} />);
  L.push(<BigNum key="d2" t={t} at={EV.dolares + 0.5} text="$2" x={1500} y={260} size={210} out={EV.manguera - 4.8} sub="POR TABLA" col={COL.leaf} edge="#1d3a12" />);
  if (t > EV.errores - 3 && t < EV.claudio) L.push(<Chips key="pr" t={t} items={[{ at: EV.errores - 2.4, tx: "PASO A PASO", col: COL.ink }, { at: EV.errores + 0.2, tx: "5 ERRORES", col: COL.red }, { at: EV.prueba + 0.3, tx: "PRUEBA DE LA MANGUERA", col: COL.ice }]} out={EV.primer - 0.4} y={860} />);
  L.push(<Stamp key="e1" t={t} at={EV.primer + 0.5} text="ERROR Nº 1 · EL CAFÉ" x={960} y={860} out={EV.claudio - 1.8} rot={-3} size={70} col={COL.amber} />);
  // Claudio
  if (t > EV.claudio - 0.2 && t < EV.c1) L.push(<LowerThird key="lt" t={t} at={EV.claudio + 0.1} out={EV.radio - 0.4} name="CLAUDIO" l2="EL CONSTRUCTOR LIBRE" l2at={EV.claudio + 0.7} />);
  if (t > EV.radio - 0.2 && t < EV.c1 && !av) {
    const r = sc(PT.radio), m = sc(PT.mate);
    L.push(<Tag key="ra" t={t} at={EV.radio + 0.2} x={r.x} y={r.y} dx={180} dy={-170} text="LA RADIO" col={COL.amber} out={EV.pan - 0.2} size={46} />);
    L.push(<Tag key="ma" t={t} at={EV.radio + 1.0} x={m.x} y={m.y} dx={-220} dy={-160} text="EL MATE FRÍO" col={COL.leaf} out={EV.pan - 0.2} size={46} />);
    L.push(<Chips key="pn" t={t} items={[{ at: EV.pan, tx: "EL CEMENTO ES COMO LA MASA DEL PAN", col: "#e8d8b4" }]} out={EV.c1 - 0.3} y={870} />);
  }
  // LA COLECCIÓN
  if (t > EV.coleccion - 0.3 && t < EV.link && !av) { const bk = sc(pageAt(0.5, 0.25)); L.push(<Tag key="co" t={t} at={EV.coleccion} x={bk.x} y={bk.y} dx={320} dy={-170} text="LA COLECCIÓN" sub="DEL CONSTRUCTOR LIBRE" col={COL.amber} out={EV.link - 0.3} size={58} />); }
  L.push(<Desc key="desc" t={t} at={EV.link} l2at={EV.medidas + 0.3} out={EV.volvemos - 0.2} />);

  return <AbsoluteFill style={{ background: "#0b0d08" }}>{L}</AbsoluteFill>;
};
