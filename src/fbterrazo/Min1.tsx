// fbterrazo · MINUTO 1 + LA COLECCIÓN. Un solo hilo, sin cortes secos:
// avatar "Mirá este piso" → toma real (la pulidora destapa el vidrio) → el mundo: la baldosa pulida en los caballetes ("piso de
// banco, una fortuna") → avatar "es cemento" → la baldosa se vuelve de vidrio y las piedras flotan → latigazo al cajón: una botella
// estalla → "vidrio molido" → avatar "pensá en tu casa" → el quincho: el alisado gris envejece en dos años (aceite, sillas, polvillo,
// fisuras) → "no está terminado": la baldosa con su piel gris → "hoy te muestro": la ola de pulido la barre, US$ 4 → toma real de la
// gota de aceite → ERROR Nº 1 en el cajón → dron (Claudio) → la radio, el mate, la botella al sol → LA COLECCIÓN pág. 53 →
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
  { t: 0, k: "c", id: "g_pulir_s1" },
  { t: EV.mundo1, k: "w" },
  { t: EV.gotaClip, k: "c", id: "p_gota_s1", from: PT.tile },
  { t: EV.errWorld, k: "w" },
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
        <div style={{ marginTop: 14, padding: "10px 20px", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 32, background: `rgba(143,214,255,${0.14 * h2})`, boxShadow: h2 > 0.05 ? `0 0 0 3px rgba(143,214,255,${0.8 * h2})` : undefined }}>📏 Las medidas exactas de la mezcla, escritas</div>
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
  // (las etiquetas clavadas al mundo no se dibujan mientras está el avatar)

  // el piso del banco: mármol granítico, una fortuna
  if (t > EV.mundo1 && t < EV.peroNo && !av) {
    const p = sc(PT.tile);
    L.push(<Tag key="mg" t={t} at={EV.banco + 1.2} x={p.x} y={p.y} dx={-300} dy={-220} text="MÁRMOL GRANÍTICO" sub="PISO DE BANCO VIEJO" col="#e8e4dc" out={EV.peroNo - 0.3} size={52} />);
    L.push(<Chips key="fo" t={t} items={[{ at: EV.fortuna + 0.2, tx: "HOY: UNA FORTUNA", col: COL.amber }]} out={EV.peroNo - 0.3} y={880} />);
  }
  // pero no: es cemento blanco del corralón (sobre el avatar)
  L.push(<Stamp key="ec" t={t} at={EV.peroNo + 0.5} text="ES CEMENTO" x={960} y={200} out={EV.piedras - 0.2} rot={-5} size={100} col="#e8e4dc" />);
  L.push(<Chips key="cb" t={t} items={[{ at: EV.blanco + 0.3, tx: "BLANCO · DEL CORRALÓN", col: COL.ink }]} out={EV.piedras - 0.2} y={880} />);
  // la baldosa se vuelve de vidrio: las piedras flotan → son botellas
  if (t > EV.piedras - 0.5 && t < EV.casa && !av) {
    const p = sc([PT.tile[0] + 0.12, PT.tile[1] + 0.08, PT.tile[2]]);
    L.push(<Tag key="nm" t={t} at={EV.piedras + 0.5} x={p.x} y={p.y} dx={260} dy={-220} text="NO SON MÁRMOL" col={COL.amber} out={EV.botellas + 0.2} size={56} />);
    const b = sc(PT.bottle);
    L.push(<Tag key="bt" t={t} at={EV.botellas + 1.3} x={b.x} y={b.y} dx={-320} dy={-200} text="BOTELLAS" sub="DE CERVEZA Y DE VINO" col={COL.leaf} out={EV.vidrio - 0.4} size={60} />);
  }
  L.push(<Stamp key="vm" t={t} at={EV.vidrio + 0.3} text="VIDRIO MOLIDO" x={960} y={880} out={EV.casa - 0.2} rot={-4} size={96} col={COL.leaf} />);
  // tu quincho: el alisado gris que envejece en dos años
  if (t > EV.quinchoIn - 0.2 && t < EV.cuanto + 0.5 && !av) {
    const o = sc(PT.oil), c = sc(PT.crack), q = sc([PT.oil[0] - 0.3, 0.05, PT.oil[2] - 0.1]);
    L.push(<Tag key="tq" t={t} at={EV.quinchoIn + 0.3} x={o.x} y={o.y} dx={-260} dy={-230} text="TU QUINCHO" sub="ALISADO DE CEMENTO" col={COL.ink} out={EV.anos - 0.2} size={56} />);
    L.push(<Chips key="qg" t={t} items={[{ at: EV.gris + 0.1, tx: "QUEDÓ GRIS", col: "#c9c5bc" }]} out={EV.anos - 0.3} y={880} />);
    L.push(<Calendar key="cal" t={t} x={140} y={130} label="AÑO" inAt={EV.anos} out={EV.cuanto + 0.3} days={[{ at: EV.anos, d: 1 }, { at: EV.anos + 0.9, d: 2 }]} />);
    L.push(<Tag key="ac" t={t} at={EV.aceite + 0.4} x={o.x} y={o.y} dx={240} dy={-200} text="ACEITE" col={COL.amber} out={EV.cuanto} size={46} />);
    L.push(<Tag key="si" t={t} at={EV.sillas + 0.4} x={q.x} y={q.y} dx={-240} dy={160} text="SILLAS" col={COL.ink} out={EV.cuanto} size={46} />);
    L.push(<Tag key="po" t={t} at={EV.polvillo + 0.4} x={c.x} y={c.y} dx={260} dy={150} text="POLVILLO BLANCO" col="#f4efe6" out={EV.cuanto} size={46} />);
    L.push(<Tag key="fi" t={t} at={EV.fisuras + 0.6} x={c.x} y={c.y} dx={220} dy={-210} text="FISURAS" sub="COMO UN MAPA" col={COL.red} out={EV.cuanto} size={50} />);
  }
  // te dijeron un número
  L.push(<BigNum key="pr" t={t} at={EV.numero + 0.5} text="US$ 100+" x={1400} y={300} size={170} out={EV.culpa - 0.2} sub="EL m² DE TERRAZO COLADO" col={COL.red} edge="#3a1210" />);
  if (t > EV.culpa && t < EV.piedra) L.push(<Chips key="cu" t={t} items={[{ at: EV.culpa + 0.2, tx: "NO FUE CULPA TUYA", col: COL.ink }, { at: EV.barato + 0.2, tx: "EL PISO MÁS BARATO", col: "#c9c5bc" }]} out={EV.terminado - 0.3} y={880} />);
  L.push(<Stamp key="nt" t={t} at={EV.terminado + 0.3} text="NO ESTÁ TERMINADO" x={960} y={220} out={EV.piedra - 0.3} rot={-4} size={88} />);
  if (t > EV.piedra - 0.3 && t < EV.baldosas) L.push(<Chips key="pp" t={t} items={[{ at: EV.piedra + 0.1, tx: "PIEDRA ADENTRO", col: COL.leaf }, { at: EV.piedra + 1.0, tx: "PULIDO", col: COL.amber }]} out={EV.baldosas - 0.4} y={880} />);
  // hoy: la ola de pulido, $4 la baldosa
  if (t > EV.polish && t < EV.paso && !av) {
    const p = sc(PT.tile);
    L.push(<Tag key="bt2" t={t} at={EV.baldosas + 0.3} x={p.x} y={p.y} dx={-300} dy={-230} text="TERRAZO" sub="CON VIDRIO DE BOTELLAS" col={COL.leaf} out={EV.dolares - 0.2} size={58} />);
    L.push(<Chips key="40" t={t} items={[{ at: EV.edificio + 0.3, tx: "COMO EN LOS AÑOS 40", col: "#e8d8b4" }]} out={EV.dolares - 0.2} y={880} />);
  }
  L.push(<BigNum key="d4" t={t} at={EV.dolares + 0.4} text="US$ 4" x={1450} y={280} size={200} out={EV.paso - 0.2} sub="POR BALDOSA" col={COL.leaf} edge="#1d3a12" />);
  if (t > EV.paso - 0.3 && t < EV.claudio) L.push(<Chips key="pr2" t={t} items={[{ at: EV.paso + 0.1, tx: "PASO A PASO", col: COL.ink }, { at: EV.errores + 0.2, tx: "5 ERRORES", col: COL.red }, { at: EV.gota + 0.3, tx: "LA GOTA DE ACEITE", col: COL.amber }]} out={EV.primer - 0.4} y={860} />);
  L.push(<Stamp key="e1" t={t} at={EV.conBotellas + 0.2} text="ERROR Nº 1 · LAS BOTELLAS" x={960} y={860} out={EV.claudio - 0.3} rot={-3} size={70} col={COL.amber} />);
  // Claudio
  if (t > EV.claudio - 0.2 && t < EV.todo) L.push(<LowerThird key="lt" t={t} at={EV.claudio + 0.1} out={EV.radio - 0.4} name="CLAUDIO" l2="EL CONSTRUCTOR LIBRE" l2at={EV.claudio + 0.7} />);
  if (t > EV.radio - 0.2 && t < EV.todo && !av) {
    const r = sc(PT.radio), m = sc(PT.mate);
    L.push(<Tag key="ra" t={t} at={EV.radio + 0.2} x={r.x} y={r.y} dx={180} dy={-170} text="LA RADIO" col={COL.amber} out={EV.basura - 0.2} size={46} />);
    L.push(<Tag key="ma" t={t} at={EV.radio + 1.0} x={m.x} y={m.y} dx={-220} dy={-160} text="EL MATE FRÍO" col={COL.leaf} out={EV.basura - 0.2} size={46} />);
    L.push(<Chips key="bb" t={t} items={[{ at: EV.basura + 0.2, tx: "UNA BOTELLA VACÍA NO ES BASURA", col: COL.leaf }]} out={EV.rapido - 0.2} y={870} />);
  }
  // LA COLECCIÓN
  if (t > EV.coleccion - 0.3 && t < EV.link && !av) { const bk = sc(pageAt(0.5, 0.25)); L.push(<Tag key="co" t={t} at={EV.coleccion} x={bk.x} y={bk.y} dx={320} dy={-170} text="LA COLECCIÓN" sub="DEL CONSTRUCTOR LIBRE" col={COL.amber} out={EV.link - 0.3} size={58} />); }
  L.push(<Desc key="desc" t={t} at={EV.link} l2at={EV.medidas + 0.3} out={EV.volvemos - 0.2} />);

  return <AbsoluteFill style={{ background: "#0b0d08" }}>{L}</AbsoluteFill>;
};
