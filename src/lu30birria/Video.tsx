// lu30 · plantilla de los 3 videos de +30 min de Don Lupe (charros, birria, asada). Un solo mundo: el patio del rancho (rancho3d) con
// el plato del video en la mesa, los siete jarritos (uno se enciende en cada truco/secreto), el fogón con la olla negra y la vaporera.
// TODA la línea de tiempo y las piezas salen de plan.json (plan30.py, que alinea el guion con words.json): ventanas del avatar, en cada
// hueco las fotos/clips de ESE párrafo y el mundo con su par de cámaras. Entre mundo y toma: portal desde el plato; entre tomas: vapor.
// En los párrafos de la guía: la tapa del libro se abre y se va a la PÁGINA REAL, con los precios marcados, y el QR a la URL corta.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, JARS, screenOf, camSpeed, setKeys, Key } from "./rancho3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import PLAN from "./plan.json";
import CARAS from "./caras.json";
import { BigNum, CH, Flash, HAND, P, Portal, SERIF, Tag, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill, Lista } from "./comp";
import * as X from "./piezas";
import { CamaraMano } from "../kits/camara/CamaraMano";

type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
const CDUR = (AVAIL as { clipDur?: Record<string, number> }).clipDur ?? {};
const WIN: Win[] = (AVW as { win: Win[] }).win;
const REEL_DUR = (AVAIL as { reelDur?: number }).reelDur ?? 1e9; // si el reel volvió corto, las ventanas sin cara caen al mundo
// el reel puede venir unos décimos más corto que el audio: la última ventana se recorta, no se tira
const wme = (w: Win) => Math.min(w.me, w.ms + REEL_DUR - 0.1 - w.off);
const sinCara = (w: Win) => !REEL || wme(w) - w.ms < 1;
const caraX = (t: number): number | null => {   // x en px de la cara de Lupe en la foto/toma de ese segundo (caras.py)
  const p = (PL.parts as { a: number; b: number; c?: string }[]).find((q) => !!q.c && t >= q.a && t < q.b);
  const v = p?.c ? (CARAS as Record<string, number>)[p.c] : undefined;
  return v == null ? null : v * 1920;
};
const conCara = (t: number) => (PL.parts as { a: number; b: number; c?: string }[]).some((p) => !!p.c && p.c.startsWith("f_") && t >= p.a && t < p.b);   // foto con Lupe
const inAv = (t: number) => WIN.some((w) => !sinCara(w) && t >= w.ms && t < wme(w));
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string };
type Pop = { k: string; at: number | null; d: number; [x: string]: unknown };
type UI = { pre: string; tr: string[]; guia: string; pag: string; hl: [number, number, number, number, string][]; tapaLabel: string };
const PL = PLAN as unknown as { end: number; parts: Part[]; cta: { a: number; b: number }[]; sec: number[]; pops: Pop[]; night: [number, number][]; dish: WorldProps["dish"]; ui: UI };
export const END_T = PL.end;
const PARTS = PL.parts, CTA = PL.cta, SEC = PL.sec, UIX = PL.ui;
const ctaAt = (t: number) => CTA.find((c) => t >= c.a && t < c.b);

// ---------------- cámaras con nombre (las del patio de donlupe01) ----------------
type Cam = { p: V; l: V; fov?: number };
const CA = PT.carne;
const C: Record<string, Cam> = {
  aereo: { p: [2.5, 8.5, 10.5], l: [2.5, 0, -1], fov: 44 }, aereo2: { p: [3.5, 6.2, 8.0], l: [2.5, 0.4, -1], fov: 40 },
  mesa: { p: [-0.95, 1.34, 0.95], l: [0.3, 0.86, -0.45], fov: 38 }, mesa2: { p: [-0.72, 1.28, 0.78], l: [0.3, 0.86, -0.45], fov: 36 },
  carne: { p: [0.55, 1.14, 0.52], l: CA, fov: 30 }, carne2: { p: [0.32, 1.06, 0.38], l: CA, fov: 27 }, carneL: { p: [-0.35, 1.18, 0.62], l: CA, fov: 30 },
  plato: { p: [0.12, 1.55, 0.42], l: CA, fov: 30 }, plato2: { p: [0.02, 1.7, 0.3], l: CA, fov: 28 },
  fogon: { p: [0.3, 1.55, -0.85], l: [1.35, 1.08, -2.1], fov: 40 }, fogon2: { p: [0.6, 1.45, -0.95], l: [1.35, 1.05, -2.1], fov: 38 },
  lumbre: { p: [0.35, 1.25, -0.35], l: [1.35, 0.75, -1.9], fov: 40 },
  vapor: { p: [-0.55, 1.62, -0.55], l: [0.45, 1.22, -2.1], fov: 40 }, vapor2: { p: [-0.2, 1.55, -0.9], l: [0.45, 1.25, -2.1], fov: 38 },
  pared: { p: [-0.55, 1.5, -0.2], l: [-1.65, 1.6, -2.6], fov: 46 }, pared2: { p: [-0.8, 1.55, -0.6], l: [-1.65, 1.6, -2.6], fov: 44 },
  pencas: { p: [-1.5, 1.45, -0.55], l: [-2.55, 1.0, -2.0], fov: 40 }, pencas2: { p: [-1.85, 1.3, -1.0], l: [-2.55, 0.95, -2.0], fov: 36 },
  hoyo: { p: [4.7, 1.7, 0.4], l: [6.4, 0.0, -1.6], fov: 42 }, hoyo2: { p: [5.6, 1.55, -0.6], l: [6.4, -0.5, -1.6], fov: 40 },
  patio: { p: [2.3, 1.0, 2.45], l: [3.5, 0.35, 1.1], fov: 38 }, patio2: { p: [4.1, 0.95, 2.45], l: [3.5, 0.35, 1.1], fov: 32 },
  jarros: { p: [-1.45, 1.25, 1.55], l: [-0.95, 0.88, 0.3], fov: 34 }, jarros2: { p: [0.9, 1.2, 1.5], l: [-0.2, 0.86, 0.3], fov: 34 },
  consome: { p: [1.25, 1.28, 0.95], l: PT.consome, fov: 34 }, consome2: { p: [1.1, 1.2, 0.78], l: PT.consome, fov: 30 },
};
// llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen dentro de una toma, del avatar o de la guía)
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!] ?? C.mesa, k1 = C[p.k1!] ?? C.mesa2;
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partIdx = (t: number) => { let lo = 0, hi = PARTS.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (t < PARTS[m].a) hi = m - 1; else if (t >= PARTS[m].b) lo = m + 1; else return m; } return -1; };

const worldAt = (t: number): WorldProps => {
  const i = partIdx(t), k0 = (i >= 0 ? PARTS[i].k0 : undefined) ?? "mesa";
  const jarOn = JARS.map((_, k) => (Number.isFinite(SEC[k]) ? e(t, SEC[k] + 0.4, SEC[k] + 1.2) : 0));
  const jarSteam = JARS.map((_, k) => (Number.isFinite(SEC[k]) ? 0.25 + 0.75 * e(t, SEC[k] + 0.4, SEC[k] + 1.4) * (1 - e(t, SEC[k] + 6, SEC[k] + 9)) : 0.25));
  const night = PL.night.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 2) * (1 - e(t, b - 2, b))), 0);
  return { t, night, fire: 1, meatSteam: /^(carne|plato)/.test(k0) ? 1 : 0.6, vapor: 0.6, jarOn, jarSteam, dish: PL.dish, dof: 0, top: 0 };
};

const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <CamaraMano intensidad={0.8} seed={3}><AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill></CamaraMano>
    </AbsoluteFill>
  );
};
const Avatar: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {WIN.map((wn, i) => !sinCara(wn) && (Math.abs(t - wn.ms) < 30 || (t >= wn.ms && t < wme(wn))) ? (
      <Sequence key={i} from={s(wn.ms) - 10} durationInFrames={s(wme(wn) - wn.ms) + 10} layout="none">
        <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wme(wn) ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence>) : null)}
  </AbsoluteFill>
);
const Clip: React.FC<{ k: string; t: number; a: number; i: number; d?: number }> = ({ k, t, a, i, d = 6 }) => {
  const pr = Math.max(0.4, Math.min(1, ((CDUR[k] ?? 3) - 0.1) / Math.max(0.1, d)));  // cámara lenta sólo si el clip no cubre el plano
  const z = i % 3 === 0 ? [1.03, 1.11] : i % 3 === 1 ? [1.1, 1.03] : [1.06, 1.06];
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7), dx = i % 3 === 2 ? (i % 2 ? -1 : 1) * 30 * (e(t, a, a + 7) - 0.5) : 0;
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} playbackRate={pr} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano intensidad={0.6} seed={i}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${dx}px)` }}>{inner}</AbsoluteFill></CamaraMano></AbsoluteFill>;
};

// QR a la landing (URL corta), nunca la URL escrita
const QR: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * e(t, at, at + 0.4)}) rotate(2deg)`, background: "#fbf6ee", borderRadius: 22, padding: "22px 22px 16px", boxShadow: "0 30px 60px rgba(0,0,0,.6)", textAlign: "center", width: 380 }}>
    <Img src={staticFile(P + "qr.png")} style={{ width: 336, height: 336, imageRendering: "pixelated" }} />
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta, lineHeight: 1 }}>escanea con la cámara</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 28, color: CH.guinda, marginTop: 6 }}>{UIX.guia.toUpperCase()}</div>
  </div>;
};

// ---------------- la GUÍA: la tapa se abre y la cámara se mete a la página real ----------------
const BW = 600, BH = BW * 1210 / 935; // tapa a escala de la imagen real
const Guia: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const inn = e(t, a, a + 0.6), out = 1 - e(t, b - 0.5, b);
  const open = ei(t, a + 1.4, a + 2.8);                   // la tapa gira sobre el lomo
  const zoom = ei(t, a + 2.8, a + 4.2);                   // de libro en la mesa a página que llena la pantalla
  const pan = e(t, a + 4.2, Math.max(a + 6, b - 2));      // baja despacito por la página
  const pw = BW + (980 - BW) * zoom, ph = pw * 1870 / 1445;
  const cx = 960 - 120 * zoom, top = ph / 2 + 30, bot = 1080 - ph / 2 - 30;  // con zoom la página es más alta que el cuadro: baja de arriba a abajo
  const cy = 540 + (top + (bot - top) * pan - 540) * zoom;
  const rx = 22 * (1 - zoom), rz = -6 * (1 - zoom);
  return (
    <AbsoluteFill style={{ opacity: inn * out }}>
      <AbsoluteFill style={{ background: "rgba(14,7,3,.72)" }} />
      <div style={{ position: "absolute", left: cx - pw / 2, top: cy - ph / 2, width: pw, height: ph, perspective: 2400 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${rx}deg) rotateZ(${rz}deg) scale(${0.9 + 0.1 * inn})`, transformStyle: "preserve-3d" }}>
          {/* la página real (debajo de la tapa) */}
          <div style={{ position: "absolute", inset: 0, background: "#fbf6ee", boxShadow: "0 40px 90px rgba(0,0,0,.7)", overflow: "hidden" }}>
            <Img src={staticFile(P + "guia_pag.jpg")} style={{ width: "100%", height: "100%" }} />
            {UIX.hl.map(([fx, fy, fw, fh], k) => {
              const ha = a + 4.6 + k * 1.6, h = e(t, ha, ha + 0.5);
              // sólo el recuadro más nuevo oscurece el resto (y suelta al llegar el siguiente o al irse las etiquetas)
              const nx = k + 1 < UIX.hl.length ? a + 4.6 + (k + 1) * 1.6 : a + 4.6 + UIX.hl.length * 1.6 + 7;
              const sh = 0.32 * h * (1 - e(t, nx, nx + 0.5));
              return h > 0.01 ? <div key={k} style={{ position: "absolute", left: `${fx * 100}%`, top: `${fy * 100}%`, width: `${fw * 100}%`, height: `${fh * 100}%`, border: `6px solid ${CH.guinda}`, borderRadius: 14, opacity: h, transform: `scale(${1.25 - 0.25 * h})`, boxShadow: `0 0 0 9999px rgba(0,0,0,${sh})` }} /> : null;
            })}
          </div>
          {/* la tapa, abre sobre el lomo izquierdo */}
          {open < 0.995 && <div style={{ position: "absolute", left: 0, top: 0, width: BW * pw / BW, height: ph, transformOrigin: "0 50%", transform: `rotateY(${-170 * open}deg)`, backfaceVisibility: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
            <Img src={staticFile(P + "guia_tapa.jpg")} style={{ width: "100%", height: "100%" }} />
          </div>}
        </div>
      </div>
      {/* rótulo con fondo propio: con el zoom la página pasa por debajo y no se pisan los textos */}
      <div style={{ position: "absolute", left: 60, top: 56, opacity: e(t, a + 0.4, a + 1), background: `rgba(20,10,4,${0.88 * zoom})`, borderRadius: 16, padding: "10px 26px 14px", boxShadow: `0 18px 40px rgba(0,0,0,${0.5 * zoom})` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 54, color: CH.maiz, textShadow: "0 6px 18px rgba(0,0,0,.8)" }}>{UIX.guia.toUpperCase()}</div>
        <div style={{ opacity: e(t, a + 3.2, a + 3.8), fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CH.crema, textShadow: "0 6px 18px rgba(0,0,0,.8)", maxHeight: 80 * e(t, a + 3.2, a + 3.8) + 0.01, overflow: "hidden" }}>{UIX.pag}</div>
      </div>
      {UIX.hl.map(([, , , , lab], k) => { const ha = a + 4.6 + k * 1.6, hEnd = a + 4.6 + UIX.hl.length * 1.6 + 7, h = e(t, ha + 0.2, ha + 0.7) * (1 - e(t, hEnd, hEnd + 0.5)); return h > 0.01 ? <div key={"l" + k} style={{ position: "absolute", right: 90, top: 300 + k * 120, opacity: h, transform: `translateX(${40 * (1 - h)}px)`, background: CH.guinda, color: CH.crema, fontFamily: SERIF, fontWeight: 900, fontSize: 46, padding: "12px 28px", borderRadius: 12, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>{lab}</div> : null; })}
    </AbsoluteFill>
  );
};
// el avatar, si habla durante la guía: recuadro nítido abajo a la izquierda (sin halo ni borde borroso)
const AvatarPip: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 60, bottom: 60, width: 520, height: 292, border: `6px solid ${CH.crema}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 50px rgba(0,0,0,.6)" }}><Avatar t={t} /></div>
);

// ---------------- las piezas (todas resueltas a segundos por plan30.py) ----------------
const num = (x: unknown, d: number) => (typeof x === "number" && Number.isFinite(x) ? x : d);
const H = X.H;
const POP = (p: Pop, t: number, a: number, o: number): React.ReactNode => {
  const g = p as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const x = num(g.x, 1420), y = num(g.y, 280), col = (g.col as string) ?? CH.maiz;
  const fx = caraX(a + 0.5);
  const sx = (d: number) => { const v = num(g.x, d); return fx != null && Math.abs(fx - v) < 400 ? 1920 - v : v; };   // pop lateral sobre la cara -> al otro lado
  const yc = (d: number) => (inAv(a + 0.5) || conCara(a + 0.5) ? 860 : num(g.y, d));   // con Lupe en cámara, lo centrado baja al pecho (nunca sobre la cara)
  const rows = (r: any[], step = 1.6) => r.map((q, i) => (Array.isArray(q) ? [q[0], num(q[1], a + i * step)] : { ...q, at: num(q.at, a + i * step) })); // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (p.k) {
    case "Stamp": return <Stamp t={t} at={a} out={o} text={g.text} x={sx(1380)} y={num(g.y, 290)} size={num(g.size, 80)} col={g.col ?? "#d8402c"} />;
    case "Pill": return <Pill t={t} at={a} out={o} x={sx(1400)} y={num(g.y, 260)} text={g.text} col={g.col} />;
    case "Palomita": return <Palomita t={t} at={a} out={o} y={num(g.y, 240)} text={g.text} />;
    case "Pensado": return <Pensado t={t} at={a} out={o} x={sx(1250)} y={num(g.y, 300)} text={g.text} size={num(g.size, 86)} />;
    case "Nota": return <Nota t={t} at={a} out={o} x={sx(1480)} y={num(g.y, 300)} lines={g.lines} rot={num(g.rot, -3)} w={num(g.w, 520)} />;
    case "Precio": return <Precio t={t} at={a} out={o} x={sx(1440)} y={num(g.y, 150)} top={g.top} sub={g.sub} />;
    case "BigNum": return <BigNum t={t} at={a} text={g.text} size={num(g.size, 150)} y={num(g.y, 860)} col={g.col ?? CH.maiz} edge="#5a2a10" out={o} sub={g.sub} />;
    case "Card": return <X.Card t={t} at={a} out={o} x={x} y={y} from={g.from ?? "right"} col={col}><H s={50} c={col}>{g.top}</H>{g.sub && <H s={44} f={HAND}>{g.sub}</H>}</X.Card>;
    case "Tag": { const q = g.anchor ? screenOf(t, (PT as any)[g.anchor] ?? CA) : { x: num(g.x, 980), y: num(g.y, 560) }; return <Tag t={t} at={a} x={q.x} y={q.y} dx={num(g.dx, 300)} dy={num(g.dy, -240)} text={g.text} sub={g.sub} col={col} out={o} size={num(g.size, 54)} />; } // eslint-disable-line @typescript-eslint/no-explicit-any
    case "Cita": return <><X.Fondo o={0.42 * e(t, a, a + 0.5) * (1 - e(t, o - 0.4, o))} /><X.Cita t={t} at={a} out={o} x={960} y={yc(500)} text={g.text} who={g.who} size={num(g.size, 84)} w={1300} /></>;
    case "Versus": return <X.Versus t={t} at={a} out={o} x={960} y={yc(560)} a={g.a} b={g.b} rows={g.rows} w={num(g.w, 960)} />;
    case "Senales": return <X.Senales t={t} out={o} x={sx(1420)} y={num(g.y, 420)} title={g.title} rows={rows(g.rows, 2) as { at: number; text: string }[]} />;
    case "Lista": return <Lista t={t} at={a} out={o} x={sx(1400)} y={num(g.y, 300)} rows={rows(g.rows) as [string, number][]} />;
    case "Cronometro": return <X.Cronometro t={t} at={a} out={o} x={sx(1450)} y={num(g.y, 430)} mins={g.mins} label={g.label} />;
    case "Bascula": return <X.Bascula t={t} at={a} out={o} x={sx(1450)} y={num(g.y, 460)} kg={g.kg} label={g.label} sub={g.sub} />;
    case "Onoma": return <X.Onoma t={t} at={a} out={o} x={sx(1350)} y={num(g.y, 300)} text={g.text} col={g.col ?? "#ffcf6a"} />;
    case "FixCard": return <X.FixCard t={t} at={a} out={o} x={sx(1400)} y={num(g.y, 460)} prob={g.prob} fix={g.fix} fixAt={a + num(g.fixDt, 3)} />;
    case "Cifra": return <X.Cifra t={t} at={a} out={o} x={960} y={yc(520)} to={g.to} pre={g.pre ?? "$"} post={g.post ?? ""} sub={g.sub} col={col} />;
    case "Receipt": return <Receipt t={t} sc={num(g.sc, 0.8)} rows={rows(g.rows, 2) as { at: number; item: string; $: number }[]} totalAt={num(g.totalAt, 1e9)} x={num(g.x, 1300)} y={num(g.y, 140)} out={o} title={g.title} cur="$" />;
    case "LowerThird": return <LowerThird t={t} at={a} out={o} name={g.name} l2={g.l2} l2at={a + 2} />;
    case "Calendario": return <X.Calendario t={t} at={a} out={o} x={sx(1450)} y={430} flipAt={a + num(g.flipDt, 1e9)} a={g.a} b={g.b} la={g.la} lb={g.lb} />;
    case "FuegoNivel": return <X.FuegoNivel t={t} at={a} out={o} x={sx(1450)} y={430} lvl={g.lvl} label={g.label} />;
    case "Aroma": return <Aroma t={t} at={a} out={o} x={num(g.x, 1180)} y={num(g.y, 640)} />;
    case "Desc": return <X.DescCard t={t} at={a} out={o} x={num(g.x, 1440)} y={num(g.y, 780)} hl={a + 1.2} />;
    case "QR": return <QR t={t} at={a + 0.4} out={o} x={num(g.x, 1560)} y={num(g.y, 640)} />;
    default: return null;
  }
};
const OVT = PL.pops.filter((p) => typeof p.at === "number").map((p) => ({ a: p.at as number, b: (p.at as number) + p.d, p }));
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  OVT.forEach((o, k) => { if (t >= o.a - 0.4 && t < o.b + 0.6) L.push(<React.Fragment key={"o" + k}>{POP(o.p, t, o.a, o.b - 0.2)}</React.Fragment>); });
  // la banda de cada truco/secreto
  SEC.forEach((a, k) => { if (t >= a - 0.2 && t < a + 5.5) L.push(<X.Banda key={"bd" + k} t={t} at={a + 0.2} out={a + 5} n={k + 1} pre={UIX.pre} text={UIX.tr[k] ?? ""} />); });
  return L;
};

// ---------------- EL VIDEO ----------------
export const Video: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const idx = partIdx(t), cta = ctaAt(t);
  if (cta) {
    L.push(<World key="w" t={t} />);
    L.push(<Guia key="g" t={t} a={cta.a} b={cta.b} />);
    if (inAv(t)) L.push(<AvatarPip key="pip" t={t} />);
  } else if (inAv(t)) L.push(<CamaraMano key="av" intensidad={0.5} seed={7}><Avatar t={t} /></CamaraMano>);
  else if (idx >= 0) {
    const p = PARTS[idx], pv = PARTS[idx - 1], nx = PARTS[idx + 1];
    if (p.c) {
      const portaled = pv && !pv.c && Math.abs(pv.b - p.a) < 1e-6;
      L.push(<Clip key={"c" + idx} k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} i={idx} d={p.b - p.a + (portaled ? 0.7 : 0)} />);
    } else {
      L.push(<World key="w" t={t} />);
      // portal desde el plato hacia la toma que sigue
      if (nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = screenOf(t, CA); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} i={idx + 1} d={nx.b - nx.a + 0.7} /></Portal>); }
      }
    }
  } else L.push(<World key="w0" t={t} />);
  L.push(...Ov(t));
  // vapor en cada costura entre dos partes seguidas que no son portal (toma→toma, toma→mundo)
  if (idx >= 0 && !cta) [idx - 1, idx].forEach((k) => { const p = PARTS[k], nx = PARTS[k + 1]; if (p && nx && Math.abs(nx.a - p.b) < 1e-6 && !(!p.c && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + k} t={t} mid={p.b} w={0.38} />); });
  SEC.forEach((a, i) => { if (Number.isFinite(a) && Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
