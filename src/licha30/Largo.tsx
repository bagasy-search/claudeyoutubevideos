// licha30 · LARGO (30+ min) de la Tía Licha, el mismo mundo de tialicha01 (la casa de adobe en corte, una cámara que vuela de
// rincón en rincón) pero manejado por un plan.json por video (src/<slug>/plan.json, lo arma D:/rtmp/licha30/plan.py desde la voz):
//   parts: huecos entre ventanas del avatar → foto/toma de lo que se dice EN ESE SEGUNDO (c) o mundo con cámara con nombre (w)
//   ov:    piezas clavadas a su frase (número de cada té/hierba/caldo, receta, el error, lo que cuesta, avisos, CTA)
//   items: segundo en que entra cada té/hierba/caldo → enciende su jarrito
// Avatar: sólo la ventana viva se monta; entradas y salidas con iris desde la cara; costuras con vaho; fundido final.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, JARS, screenOf, camSpeed, setKeys, dropKeys, Key } from "../tialicha01/casa3d";
import { Flash, LowerThird, Portal, Tag, Chips, e, ei, s, FONT, SERIF, HAND } from "../tialicha01/lib";
import { Escrito, Cinta, Tachada, Sello, Hora } from "../tialicha01/Min1";
import * as Q from "../tialicha01/piezas";

const LI = Q.LI;
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string; z?: [number, number] };
type Ov = { a: number; b: number; k: string; [x: string]: unknown };
export type Plan = { slug: string; end: number; face: { x: number; y: number }; parts: Part[]; ov: Ov[]; items: number[]; noche?: number };
type Avail = { reel: boolean; clips: string[] };

// ---------------- cámaras con nombre (las de tialicha01) ----------------
type Cam = { p: V; l: V; fov?: number };
const C: Record<string, Cam> = {
  cama: { p: [2.0, 1.7, 1.9], l: [2.6, 0.8, -1.6], fov: 44 }, cama2: { p: [1.9, 1.62, 1.6], l: [2.6, 0.78, -1.6], fov: 42 },
  buro: { p: [3.6, 1.2, -1.15], l: [3.75, 0.8, -2.55], fov: 44 }, buro2: { p: [3.5, 1.28, -0.9], l: [3.75, 0.82, -2.55], fov: 46 },
  mesa: { p: [-0.95, 1.35, 0.75], l: [-1.35, 0.8, -0.5], fov: 40 }, mesa2: { p: [-1.0, 1.3, 0.6], l: [-1.35, 0.8, -0.5], fov: 37 },
  mesaT: { p: [-1.2, 1.95, 0.35], l: [-1.35, 0.78, -0.55], fov: 40 },
  fogon: { p: [-2.55, 1.45, -1.25], l: [-2.75, 0.95, -2.55], fov: 40 }, fogon2: { p: [-2.45, 1.52, -1.05], l: [-2.75, 0.95, -2.55], fov: 38 },
  fogonW: { p: [-1.4, 1.7, 0.6], l: [-2.75, 0.9, -2.3], fov: 44 },
  hierbas: { p: [-1.4, 1.85, -0.7], l: [-2.4, 2.2, -2.45], fov: 42 }, hierbas2: { p: [-1.65, 1.8, -0.95], l: [-2.4, 2.2, -2.45], fov: 40 },
  jarros: { p: [-1.93, 2.1, 1.25], l: [-1.93, 2.1, -2.86], fov: 46 }, jarros2: { p: [-1.93, 2.05, 0.95], l: [-1.93, 2.08, -2.86], fov: 46 },
  frente: { p: [0.6, 2.0, 3.7], l: [0.7, 0.7, -1.0], fov: 48 }, frente2: { p: [0.7, 1.95, 3.45], l: [1.2, 0.7, -1.0], fov: 46 },
  patio: { p: [0.3, 3.0, 10.8], l: [0.3, 1.4, -1.0], fov: 40 }, patio2: { p: [0.3, 2.8, 9.4], l: [0.3, 1.3, -1.0], fov: 40 },
  puerta: { p: [-0.9, 1.45, 1.3], l: [0.4, 1.0, -0.15], fov: 42 }, puerta2: { p: [-0.7, 1.4, 1.0], l: [0.4, 1.0, -0.15], fov: 40 },
};
JARS.forEach((q, i) => { C["j" + i] = { p: [q[0], 2.0, -1.75], l: [q[0], 2.05, q[2]], fov: 34 }; });

export const makeLargo = (PL: Plan, AVW: { win: Win[] }, AV: Avail) => {
  const P = PL.slug + "/";
  const END_T = PL.end, FACE = PL.face, PARTS = PL.parts, ITEMS = PL.items;
  const REEL = AV.reel, CLIPS = new Set(AV.clips);
  const WIN: Win[] = AVW.win;
  const avAt = (t: number) => WIN.find((w) => t >= w.ms && t < w.me);
  // llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen siempre detrás del avatar, de una foto o del vaho)
  dropKeys(-1, 1e9);
  setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
    const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
    const k0 = C[p.k0!] ?? C.mesa, k1 = C[p.k1!] ?? C.mesa2;
    return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b - 0.001, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
  }));
  const partIdx = (t: number) => { let lo = 0, hi = PARTS.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (PARTS[m].a <= t) { k = m; lo = m + 1; } else hi = m - 1; } return k; };
  const partAt = (t: number) => PARTS[partIdx(t)];

  const worldAt = (t: number): WorldProps => {
    const k0 = partAt(t)?.k0 ?? "";
    const cur = ITEMS.reduce((acc, a, i) => (t >= a - 0.1 ? i : acc), -1);
    return {
      t, hora: /^(cama|buro)/.test(k0) ? 1 : /^(patio|frente)/.test(k0) ? 0.75 : PL.noche ?? 0.45,
      fire: 0.55 + 0.35 * (/^fogon/.test(k0) ? 1 : 0), vela: 1, velaLuz: /^mesa/.test(k0) ? 0.3 : 0.65,
      lamp: /^(cama|buro)/.test(k0) ? 0.85 : 0.35, steam: 0.85,
      jarOn: JARS.map((_, j) => { const i = cur >= 0 ? cur % 10 : -1; return j === i ? e(t, ITEMS[cur] - 0.1, ITEMS[cur] + 0.4) : ITEMS.some((a, n) => n < cur && n % 10 === j) ? 0.45 : 0; }),
      path: 0, cena: { pan: /^mesa/.test(k0) ? 1 : 0 }, ring: 0, relojGlow: 0, hundida: /^cama/.test(k0) ? 1 : 0, roof: 1, cortina: 0.8,
    };
  };
  const World: React.FC<{ t: number }> = ({ t }) => {
    const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
    const id = "mbr" + Math.round(t * 30);
    return <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill>
    </AbsoluteFill>;
  };
  // avatar: sólo la ventana viva se monta (preroll de 10 cuadros)
  const Avatar: React.FC<{ t: number }> = ({ t }) => {
    if (!REEL) return <AbsoluteFill style={{ background: "#000" }}><Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
    const wn = WIN.find((x) => t >= x.ms - 0.4 && t < x.me + 0.1);
    return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{wn && (
      <Sequence key={wn.ms} from={s(wn.ms) - 10} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>)}</AbsoluteFill>;
  };
  // toma: el clip si ya llegó (arranca medio segundo antes, para los iris), si no la foto con empuje lento (CamaraMano suave)
  const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number] }> = ({ k, t, a, z = [1.03, 1.1] }) => {
    const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
    const sway = Math.sin((t - a) * 0.9) * 6, swy = Math.cos((t - a) * 0.7) * 4;
    const inner = CLIPS.has(k)
      ? <Sequence from={s(a) - 15} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
      : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
    return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: `translate(${sway}px,${swy}px) scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
  };
  const PartView: React.FC<{ i: number; t: number }> = ({ i, t }) => {
    const p = PARTS[i];
    if (!p) return null;
    if (p.c) return <Clip k={p.c} t={t} a={p.a - 0.5} z={p.z} />;
    return <World t={Math.min(Math.max(t, p.a + 0.002), p.b - 0.002)} />;
  };

  // ---------------- las piezas del plan ----------------
  const N = (x: unknown, d = 0) => (typeof x === "number" ? x : d);
  const S_ = (x: unknown, d = "") => (typeof x === "string" ? x : d);
  const piece = (o: Ov, t: number): React.ReactNode => {
    const a = o.a, out = o.b, x = N(o.x, 960), y = N(o.y, 860), ats = (o.ats as number[]) ?? [];
    switch (o.k) {
      case "num": return <Q.CenaCard t={t} at={a} out={out} n={N(o.n)} title={S_(o.title)} sub={S_(o.sub)} x={N(o.x, 560)} y={N(o.y, 840)} />;
      case "lbl": return <NumLbl t={t} at={a} out={out} n={N(o.n)} word={S_(o.word, "TÉ")} title={S_(o.title)} sub={S_(o.sub)} />;
      case "receta": return <Q.Receta t={t} at={a} out={out} x={N(o.x, 1400)} y={N(o.y, 480)} title={S_(o.title)} rows={(o.rows as { at: number; text: string }[]) ?? []} />;
      case "pizarra": return <Q.Pizarra t={t} at={a} out={out} x={N(o.x, 1360)} y={N(o.y, 460)} title={S_(o.title, "LO QUE SE SABE HOY")} rows={(o.rows as { at: number; text: string }[]) ?? []} />;
      case "dicho": return <Q.Dicho t={t} at={a} out={out} x={N(o.x, 640)} y={N(o.y, 300)} text={S_(o.text)} />;
      case "aviso": return <Q.Aviso t={t} at={a} out={out} x={N(o.x, 1200)} y={N(o.y, 300)} title={S_(o.title)} text={S_(o.text)} />;
      case "error": return <Cinta t={t} at={a} out={out} x={N(o.x, 960)} y={N(o.y, 250)} text={S_(o.text, "EL ERROR")} col={LI.rojo} size={N(o.size, 92)} />;
      case "cinta": return <Cinta t={t} at={a} out={out} x={N(o.x, 960)} y={N(o.y, 250)} text={S_(o.text)} col={S_(o.col, LI.maiz)} size={N(o.size, 92)} />;
      case "tachada": return <Tachada t={t} at={a} cut={N(o.cut, a + 1)} out={out} x={N(o.x, 960)} y={N(o.y, 280)} text={S_(o.text)} size={N(o.size, 100)} col={LI.crema} pre={S_(o.pre) || undefined} />;
      case "escrito": return <Escrito t={t} at={a} out={out} x={x} y={y} text={S_(o.text)} size={N(o.size, 88)} col={S_(o.col, LI.crema)} />;
      case "sello": return <Sello t={t} at={a} text={S_(o.text)} x={N(o.x, 960)} y={N(o.y, 280)} out={out} size={N(o.size, 96)} />;
      case "hora": return <Hora t={t} at={a} out={out} x={N(o.x, 400)} y={N(o.y, 240)} label={S_(o.label)} h={N(o.h, 9)} />;
      case "check": return <Q.Check3 t={t} ats={ats} labels={(o.labels as string[]) ?? []} out={out} x={N(o.x, 1340)} y={N(o.y, 480)} title={S_(o.title) || undefined} />;
      case "nunca": return <Q.Nunca3 t={t} at={a} ats={ats} labels={(o.labels as string[]) ?? []} out={out} y={N(o.y, 640)} title={S_(o.title) || undefined} />;
      case "chips": return <Chips t={t} at={a} items={(o.items as string[]) ?? []} out={out} y={N(o.y, 820)} />;
      case "lower": return <LowerThird t={t} at={a} out={out} name={S_(o.name)} l2={S_(o.l2)} l2at={N(o.l2at, a + 1)} />;
      case "tag": return <Tag t={t} at={a} x={x} y={N(o.y, 500)} dx={N(o.dx, -240)} dy={N(o.dy, -160)} text={S_(o.text)} sub={S_(o.sub) || undefined} col={LI.maiz} out={out} size={56} />;
      case "precio": return <Precio t={t} at={a} out={out} casa={S_(o.casa)} fuera={S_(o.fuera)} label={S_(o.label, "UN PLATO")} x={N(o.x, 1380)} y={N(o.y, 470)} />;
      case "comentario": return <Q.Comentario t={t} at={a} out={out} x={960} y={N(o.y, 830)} text={S_(o.text)} send={N(o.send, a + 2.5)} />;
      case "cta": return <CTA t={t} at={a} out={out} P={P} libro={S_(o.libro)} pag={S_(o.pag)} casa={S_(o.casa)} fuera={S_(o.fuera)} qr={N(o.qr, a + 1)} />;
      default: return null;
    }
  };
  const Ovs = (t: number): React.ReactNode[] => PL.ov.filter((o) => t >= o.a - 0.4 && t < o.b + 0.6).map((o, i) => <React.Fragment key={"o" + o.a.toFixed(2) + "_" + i}>{piece(o, t)}</React.Fragment>);

  const Largo: React.FC = () => {
    const f = useCurrentFrame(), t = f / 30;
    const L: React.ReactNode[] = [];
    const av = avAt(t);
    if (av) {
      L.push(<Avatar key="av" t={t} />);
      if (t < av.ms + 0.45) { const pi = partIdx(av.ms - 0.01); const r = 1 - ei(t, av.ms, av.ms + 0.45); if (pi >= 0 && PARTS[pi].b <= av.ms + 0.05 && r > 0) L.push(<Portal key="pin" x={FACE.x} y={FACE.y} r={r} ring={0.6}><PartView i={pi} t={t} /></Portal>); }
      if (t > av.me - 0.5) { const ni = partIdx(av.me + 0.3); const r = ei(t, av.me - 0.5, av.me); if (ni >= 0 && PARTS[ni].a >= av.me - 0.05 && r > 0) L.push(<Portal key="pout" x={FACE.x} y={FACE.y} r={r} ring={0.6}><PartView i={ni} t={t} /></Portal>); }
    } else {
      const idx = partIdx(t);
      if (idx >= 0) L.push(<PartView key={"p" + idx} i={idx} t={t} />);
    }
    L.push(...Ovs(t));
    const idx = partIdx(t), p = PARTS[idx], nx = PARTS[idx + 1];
    if (p && nx && Math.abs(nx.a - p.b) < 1e-6 && Math.abs(t - p.b) < 0.4) L.push(<Q.Vaho key={"vh" + idx} t={t} mid={p.b} w={0.36} />);
    if (p && idx > 0 && Math.abs(PARTS[idx - 1].b - p.a) < 1e-6 && Math.abs(t - p.a) < 0.4) L.push(<Q.Vaho key={"vh" + (idx - 1)} t={t} mid={p.a} w={0.36} />);
    ITEMS.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#efe4ff" peak={0.3} w={0.3} />); });
    const fin = e(t, END_T - 0.9, END_T - 0.1);
    if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
    return <AbsoluteFill style={{ background: "#07060d" }}>{L}</AbsoluteFill>;
  };
  return { Largo, frames: Math.round(END_T * 30) };
};

// ---------------- piezas nuevas de los largos ----------------
const SH = "0 30px 60px rgba(0,0,0,.55)";
const Txt: React.FC<{ s?: number; c?: string; f?: string; w?: number; ls?: number; children: React.ReactNode }> = ({ s: z = 40, c = LI.crema, f = FONT, w = 800, ls = 0, children }) =>
  <div style={{ fontFamily: f, fontWeight: w, fontSize: z, color: c, letterSpacing: ls, lineHeight: 1.08, whiteSpace: "nowrap" }}>{children}</div>;
// rótulo del número (EL TÉ Nº 3 · flor de tila): medallón de barro + tira de papel, abajo a la izquierda
const NumLbl: React.FC<{ t: number; at: number; out: number; n: number; word: string; title: string; sub?: string }> = ({ t, at, out, n, word, title, sub }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)), kr = ei(t, at + 0.2, at + 0.7), k = Math.min(1.08, 0.6 + 0.4 * e(t, at, at + 0.35) + 0.08 * Math.sin(Math.min(1, (t - at) / 0.35) * Math.PI));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 120, top: 760, opacity: o, display: "flex", alignItems: "center" }}>
    <div style={{ width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#d0683a,#8a3a18 72%)", border: `7px solid ${LI.maiz}`, boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${k})`, zIndex: 2 }}>
      <Txt s={26} c={LI.crema} ls={4}>{word}</Txt><Txt f={SERIF} s={96} w={900} c={LI.maiz}>{n}</Txt>
    </div>
    <div style={{ marginLeft: -40, padding: "20px 46px 20px 70px", background: LI.papel, borderRadius: "0 16px 16px 0", boxShadow: SH, clipPath: `inset(0 ${(1 - kr) * 100}% 0 0)` }}>
      <Txt f={HAND} s={70} w={700} c={LI.tinta}>{title}</Txt>{sub && <Txt s={28} c="#7a5a3a" ls={3}>{sub}</Txt>}
    </div>
  </div>;
};
// lo que cuesta: en tu cocina vs. afuera (dos etiquetas de precio de papel)
const Precio: React.FC<{ t: number; at: number; out: number; casa: string; fuera: string; label: string; x: number; y: number }> = ({ t, at, out, casa, fuera, label, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), b = e(t, at + 0.9, at + 1.2);
  if (o <= 0.01) return null;
  const tag = (top: string, val: string, col: string, k: number, rot: number) => <div style={{ opacity: k, transform: `translateY(${(1 - k) * 40}px) rotate(${rot}deg)`, padding: "18px 34px", background: LI.papel, borderRadius: 12, borderLeft: `14px solid ${col}`, boxShadow: SH, marginBottom: 22 }}>
    <Txt s={28} c="#7a5a3a" ls={4}>{top}</Txt><Txt f={SERIF} s={84} w={900} c={col}>{val}</Txt></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <Txt s={30} c={LI.crema} ls={6}>{label}</Txt><div style={{ height: 14 }} />
    {tag("EN TU COCINA", casa, LI.verde.replace("7fbf5a", "3f7f2a"), e(t, at, at + 0.3), -2)}
    {fuera && tag("AFUERA", fuera, LI.rojo, b, 2)}
  </div>;
};
// CTA: la portada del libro de la guía + la página + el QR («escanea con la cámara»); el link sólo se nombra (1ª línea de la descripción)
const CTA: React.FC<{ t: number; at: number; out: number; P: string; libro: string; pag: string; casa: string; fuera: string; qr: number }> = ({ t, at, out, P, libro, pag, casa, fuera, qr }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.35)), k = ei(t, at, at + 0.8), q = e(t, qr, qr + 0.4);
  if (o <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 50%, rgba(43,29,58,.55), rgba(7,6,13,.88))" }} />
    <div style={{ position: "absolute", left: 250, top: 150, perspective: 1600 }}>
      <div style={{ transform: `rotateY(${-28 + 10 * k}deg) rotateX(4deg) translateY(${(1 - k) * 80}px)`, transformStyle: "preserve-3d", width: 520, height: 780, boxShadow: "0 50px 90px rgba(0,0,0,.7)", borderRadius: 8, overflow: "hidden", border: `3px solid ${LI.maiz}` }}>
        <Img src={staticFile(P + "cov.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 900, top: 190, opacity: e(t, at + 0.5, at + 0.9) }}>
      <Txt s={34} c={LI.lila} ls={6}>{libro}</Txt>
      <Txt f={HAND} s={86} w={700} c={LI.crema}>{pag}</Txt>
      <div style={{ height: 18 }} />
      <div style={{ display: "flex", gap: 26 }}>
        <div style={{ padding: "14px 28px", background: LI.papel, borderRadius: 12, borderLeft: "12px solid #3f7f2a" }}><Txt s={24} c="#7a5a3a" ls={3}>EN TU COCINA</Txt><Txt f={SERIF} s={64} w={900} c="#3f7f2a">{casa}</Txt></div>
        <div style={{ padding: "14px 28px", background: LI.papel, borderRadius: 12, borderLeft: `12px solid ${LI.rojo}` }}><Txt s={24} c="#7a5a3a" ls={3}>AFUERA</Txt><Txt f={SERIF} s={64} w={900} c={LI.rojo}>{fuera}</Txt></div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 900, top: 600, display: "flex", alignItems: "center", gap: 34, opacity: q, transform: `scale(${0.85 + 0.15 * q})`, transformOrigin: "0 50%" }}>
      <div style={{ padding: 14, background: "#fff", borderRadius: 14, boxShadow: SH }}><Img src={staticFile(P + "qr.png")} style={{ width: 250, height: 250, display: "block" }} /></div>
      <div><Txt s={44} w={900} c={LI.maiz}>ESCANEA CON LA CÁMARA</Txt><div style={{ height: 10 }} /><Txt s={32} c={LI.crema}>o el link en la 1ª línea</Txt><Txt s={32} c={LI.crema}>de la descripción</Txt></div>
    </div>
  </AbsoluteFill>;
};
