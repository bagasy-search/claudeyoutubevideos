// enrm03 (Ramón, motor de mececu) · EL VIDEO ENTERO como datos: plan.json (lo arma D:/rtmp_enrm03/plan.py resolviendo cada frase de la voz).
// segs = la base de cada momento (avatar / toma real / pizarrón / el mundo 3D) con su unión; pieces = lo que va encima.
// Toda capa 2D va a mano (CamaraMano) y la cámara 3D también (manoCam en motor3d). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { Avatar, Shot, Stamp, Taco, Reloj, Toggle, World } from "./Min1";
import { PT, screenOf } from "./motor3d";
import { BigNum, COL, Chips, DrawX, FONT, Flash, LowerThird, Portal, Receipt, Tag, Thermo, e, ei, extrude, spr } from "./lib";
import { Contador, MapaSA, Tanque } from "./ramon2d";
import { Comment, Desc, ErrorCard, Flow, KitTray, Libro, NextCard, Recap, Rows, StepPlate, Subscribe, VsCard } from "./kit2d";
import { Aguja, Bateria, Crono, Ecu, Fondo, Ventanilla } from "./ecu2d";
import { CamaraMano } from "../kits/camara/CamaraMano";

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type Seg = { a: number; k: "av" | "s" | "b" | "w"; tr?: Tr; key?: string; z?: [number, number]; ox?: number; oy?: number; tone?: string; re?: number };
type Piece = { c: string; a: number; b: number; p: Record<string, unknown> };
const PL = PLAN as unknown as { end: number; segs: Seg[]; pieces: Piece[] };
export const FULL_END = PL.end;
const SEGS = PL.segs, PIECES = PL.pieces;
const D = 0.36;

// el QR de la guía: tarjeta blanca + "escanea con la cámara" (nunca una URL en pantalla)
const Qr: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; sc?: number }> = ({ t, at, out, x = 1440, y = 540, sc = 1 }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${-10 + (1 - Math.min(1, k)) * 50}deg) scale(${sc * (0.6 + 0.4 * Math.min(1, k))})` }}>
      <div style={{ background: "#fbfaf6", borderRadius: 28, padding: 26, boxShadow: "0 40px 80px rgba(0,0,0,.6), 0 0 0 6px #ffd60a", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 470 }}>
        <Img src={staticFile("enrm03/qr.jpg")} style={{ width: 400, height: 400 }} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#0b0e13", letterSpacing: 2 }}>📷 SCAN IT WITH YOUR PHONE CAMERA</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 25, color: "#5a4500", textAlign: "center" }}>THE $2 MECHANIC · 200 FIXES</div>
      </div>
      <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: COL.ink, textAlign: "center", textShadow: extrude(4, "#1c2a3a") }}>LINK IN THE FIRST LINE OF THE DESCRIPTION</div>
    </div>
  );
};

// pizarrón del taller: el mundo 3D quieto, oscurecido, con la grilla
const Mundo: React.FC<{ t: number; tone: string }> = ({ t, tone }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ transform: `scale(${1.06 + 0.03 * Math.sin(t * 0.13)}) translate(${8 * Math.sin(t * 0.09)}px, ${5 * Math.cos(t * 0.11)}px)` }}><Img src={staticFile("enrm03/mundo_bg.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: tone, opacity: 0.78 }} />
    <AbsoluteFill style={{ opacity: 0.55 }}><Fondo t={t} /></AbsoluteFill>
  </AbsoluteFill>
);

const base = (s: Seg, i: number, t: number): React.ReactNode => {
  const dur = (SEGS[i + 1]?.a ?? FULL_END) - s.a;
  if (s.k === "av") return <CamaraMano intensidad={0.7} seed={11}><Avatar t={t} /></CamaraMano>;
  if (s.k === "w") return <World t={t} />;
  if (s.k === "b") return <CamaraMano intensidad={0.5} seed={7}><Mundo t={t} tone={s.tone ?? "#070c14"} /></CamaraMano>;
  return <CamaraMano seed={i % 9}><Shot k={s.key!} t={t} a={s.a} re={s.re} z={s.z} ox={s.ox} oy={s.oy} dur={Math.max(2, dur + D)} /></CamaraMano>;
};

const Trans: React.FC<{ t: number; s: Seg; from: React.ReactNode; to: React.ReactNode }> = ({ t, s, from, to }) => {
  const k = ei(t, s.a, s.a + D), tr = s.tr ?? "swipeL";
  if (tr === "swipeL" || tr === "swipeR" || tr === "up" || tr === "down") {
    const dir = tr === "swipeL" || tr === "up" ? 1 : -1, ax = tr === "up" || tr === "down" ? "Y" : "X", DD = ax === "Y" ? 1080 : 1920;
    return <AbsoluteFill><AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * DD}px)` }}>{from}</AbsoluteFill><AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * DD}px)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  }
  if (tr === "portal") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><Portal x={960} y={540} r={k}>{to}</Portal></AbsoluteFill>;
  if (tr === "iris") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `circle(${k * 1150}px at 960px 540px)` }}>{to}</AbsoluteFill><Flash t={t} at={s.a + 0.02} col="#eaf6ff" peak={0.3} w={0.3} /></AbsoluteFill>;
  if (tr === "wipe") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `inset(${(1 - k) * 100}% 0 0 0)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  if (tr === "zoom") return <AbsoluteFill><AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * k})` }}>{to}</AbsoluteFill><AbsoluteFill style={{ opacity: 1 - k, transform: `scale(${1 + k * 0.35})` }}>{from}</AbsoluteFill></AbsoluteFill>;
  return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ opacity: k }}>{to}</AbsoluteFill></AbsoluteFill>;
};

// nombre del plan → componente (props: at = a, out = b, más lo que traiga p)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const C: Record<string, React.FC<any>> = { Tag, BigNum, Stamp, Reloj, Chips, LowerThird, Receipt, DrawX, Qr, Desc, Libro, Rows, KitTray, StepPlate, ErrorCard, Flow, VsCard, Recap, Comment, NextCard, Ecu, Bateria, Crono, Ventanilla, Aguja, Thermo, Subscribe, Contador, MapaSA, Tanque };
const piece = (x: Piece, t: number): React.ReactNode => {
  const p = x.p as Record<string, unknown>;
  if (x.c === "Toggle") return <Toggle t={t} a={x.a} b={p.b2 as number} out={x.b} ta={p.ta as string} tb={p.tb as string} y={p.y as number | undefined} />;
  if (x.c === "Taco") return <Taco t={t} a={x.a} out={x.b} keys={p.keys as [number, number][]} x={p.x as number} y={p.y as number} />;
  const Comp = C[x.c];
  if (!Comp) throw new Error("componente desconocido en plan.json: " + x.c);
  let { pt, ...rest } = p;
  if (pt) { const q = screenOf(t, PT[pt as keyof typeof PT]); rest = { ...rest, x: q.x, y: q.y }; }
  return <Comp t={t} at={x.a} out={x.b} {...rest} />;
};

export const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0;
  for (let j = 0; j < SEGS.length; j++) if (SEGS[j].a <= t) i = j;
  const cur = SEGS[i], prev = SEGS[i - 1];
  const b = prev && t < cur.a + D && cur.tr !== "cut" ? <Trans t={t} s={cur} from={base(prev, i - 1, t)} to={base(cur, i, t)} /> : base(cur, i, t);
  const ovs = PIECES.filter((x) => t >= x.a - 0.25 && t < x.b + 0.45).map((x, k) => (
    <AbsoluteFill key={k + "_" + x.a} style={{ opacity: 1 - e(t, x.b + 0.05, x.b + 0.4) }}><CamaraMano intensidad={0.35} seed={3}>{piece(x, t)}</CamaraMano></AbsoluteFill>));
  const fade = 0.75 * e(t, FULL_END - 0.6, FULL_END - 0.05); // tope 75 %: a negro pleno el blackframe lo cuenta como cuadro negro
  return (
    <AbsoluteFill style={{ background: "#0b0e13" }}>
      {b}
      {ovs}
      {fade > 0 && <AbsoluteFill style={{ background: "#000", opacity: fade }} />}
    </AbsoluteFill>
  );
};
