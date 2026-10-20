// clem01 · MINUTO 1 (0-73,5 s), a mano, misma vara que gary01. Un solo hilo visual, sin cortes secos:
// avatar → (el avatar se ABRE como las dos puertas del mueble de la pileta) → 6 rociadores 3D con rótulos por palabra
// → (latigazo) avatar con la toma real del mueble en tarjeta 3D → (latigazo) los rociadores se van caminando por la puerta: $40
// → vuelo a la alacena: UN frasco, time-lapse de 2 semanas a miel oscura → (latigazo) avatar con la huerta mojada en tarjeta
// → Clem dejando el frasco → (zoom a través del frasco) la cámara sale de la casa y sube: la granja entre trigales → portal al trigal
// → avatar → ingredientes $2 → avatar con 10 USOS → granito arruinado + 3 ERRORES. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FarmWorld, screenOf, camSpeed, PT, BOTTLE, lapseDay } from "./farm3d";
import { BigNum, COL, Card3D, Chips, FONT, LowerThird, Tag, e, ei, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Price } from "../kits/yanqui3d/engine";
import { Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("clem01");
export const MIN1_END = 73.5;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
export const vid = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);

// mundo 3D con blur de movimiento real (velocidad de cámara proyectada)
export const World: React.FC<{ t: number; blur?: number }> = ({ t, blur = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5) + blur, by: Math.min(3.5, v0.by * 0.5) + blur };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><FarmWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// vaho químico que sube por los bordes del avatar ("it hits you")
const Fumes: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const o = e(t, a, a + 1.2) * (1 - e(t, b, b + 0.4));
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 45%, rgba(170,210,60,.38) 85%, rgba(120,160,30,.6) 100%)", mixBlendMode: "screen" }} />
      {Array.from({ length: 9 }, (_, i) => {
        const x = (i / 8) * 1920, up = ((t - a) * (40 + i * 7)) % 600;
        return <div key={i} style={{ position: "absolute", left: x - 220, top: 900 - up, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(190,230,90,.28), transparent 70%)", filter: "blur(30px)" }} />;
      })}
    </AbsoluteFill>
  );
};

// contador de días del time-lapse (calendario que pasa hojas)
export const DayCounter: React.FC<{ t: number; x?: number; y?: number; out: number; from: number }> = ({ t, x = 1480, y = 210, out, from }) => {
  const d = lapseDay(t), o = e(t, from, from + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01 || d <= 0) return null;
  const n = Math.min(14, Math.floor(d)), flip = d - Math.floor(d);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 900, transform: `scale(${Math.min(1.05, spr(t, from))})` }}>
      <div style={{ transform: "rotateY(-14deg) rotateX(6deg)", width: 300, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT, textAlign: "center" }}>
        <div style={{ background: "#b3261e", color: "#fff", fontWeight: 900, fontSize: 34, letterSpacing: 8, padding: "10px 0" }}>DAY</div>
        <div style={{ background: "linear-gradient(180deg,#fbfaf6,#e9e5da)", color: "#1c1c1c", fontWeight: 900, fontSize: 150, lineHeight: "190px", transform: n < 14 ? `rotateX(${flip > 0.75 ? (flip - 0.75) * 4 * -80 : 0}deg)` : undefined, transformOrigin: "50% 0" }}>{n}</div>
        <div style={{ height: 14, background: "linear-gradient(90deg,#e1c35a,#9b5a16)", width: `${(n / 14) * 100}%` }} />
      </div>
    </div>
  );
};

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: HAS, T0: 0, TEND: MIN1_END + 1.2, flashAtStart: false,
  beats: ({ at, Avatar, AV, CL }) => [
    // A · 0-4,7 · avatar con el vaho; el avatar se abre como las dos puertas del mueble → los 6 rociadores en 3D
    { a: 0, tr: "cut", r: (t) => <AbsoluteFill><Avatar t={t} /><Fumes t={t} a={at("hits")} b={4.5} /></AbsoluteFill> },
    { a: 4.35, tr: "cut", r: (t) => {
      const d = ei(t, 4.35, 4.85);
      const half = (side: 0 | 1) => (
        <AbsoluteFill style={{ clipPath: side ? "inset(0 0 0 50%)" : "inset(0 50% 0 0)", transformOrigin: side ? "100% 50%" : "0% 50%", transform: `rotateY(${(side ? 1 : -1) * d * 108}deg)`, boxShadow: d > 0 ? "0 0 80px rgba(0,0,0,.8)" : undefined }}>
          <Avatar t={t} /><Fumes t={t} a={at("hits")} b={4.5} />
          <div style={{ position: "absolute", top: 0, bottom: 0, [side ? "left" : "right"]: side ? 960 : 960, width: 22, background: "linear-gradient(90deg,#efe9dd,#cfc6b4)" } as React.CSSProperties} />
        </AbsoluteFill>
      );
      return <AbsoluteFill><World t={Math.max(t, 4.4)} />{d < 1 && <AbsoluteFill style={{ perspective: 1500 }}>{half(0)}{half(1)}</AbsoluteFill>}</AbsoluteFill>;
    } },
    // C · 13,7-17,2 · avatar con la toma real del mueble en tarjeta 3D
    AV(13.698, "whip", { spans: [[14.0, 17.0]] }),
    // D · los rociadores se van caminando por la puerta de atrás
    { a: 17.22, tr: "whipL", r: (t) => <World t={t} /> },
    // F · 30,7-37 · avatar con la huerta mojada y el frasco contra los 6 rociadores
    AV(30.713, "whip", { spans: [[at("smells") - 0.1, 36.9]] }),
    // G · Clem dejando el frasco en la mesa
    CL(37.034, "m_kitchen", "whipL", undefined, [1.02, 1.1]),
    // H · zoom a través del frasco → la cámara sale de la casa y sube: la granja entre trigales; portal al trigal
    { a: 41.8, tr: "zoom", p: [960, 560], r: (t) => <World t={t} /> },
    CL(46.25, "m_wheat", "portal", [1180, 620], [1.04, 1.12]),
    AV(48.451, "light", { spans: [[at("My mother") + 0.3, 54.3]] }),
    // J · ingredientes: $2
    CL(54.443, "m_ingred", "whip", undefined, [1.03, 1.13]),
    AV(62.787, "push", { spans: [[at("10 ways") - 0.1, 66.6]], edge: true }),
    // L · el granito arruinado: 3 ERRORES
    CL(66.792, "m_granite", "flip", undefined, [1.04, 1.16]),
  ],
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    // B · rótulos por palabra sobre los rociadores 3D
    if (t >= 4.4 && t < 14.3) {
      const B = (i: number) => screenOf(t, BOTTLE(i));
      L.push(<Words key="sm" t={t} items={[{ at: at("That sharp"), txt: "THAT SHARP" }, { at: at("chemical"), txt: "CHEMICAL SMELL", col: "#cfe86a" }]} out={6.9} y={150} size={96} />);
      const six = at("Six spray");
      for (let i = 0; i < 6; i++) {
        const p = B(i);
        L.push(<div key={"n" + i} style={{ position: "absolute", left: p.x, top: p.y - 150, transform: `translate(-50%,-50%) scale(${Math.min(1.12, spr(t, six + i * 0.1))})`, opacity: e(t, six + i * 0.1, six + i * 0.1 + 0.08) * (1 - e(t, 10.0, 10.25)),
          width: 92, height: 92, borderRadius: 46, background: "rgba(14,20,12,.88)", border: "4px solid #cfe86a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#cfe86a", boxShadow: "0 16px 30px rgba(0,0,0,.6)" }}>{i + 1}</div>);
      }
      const half = at("half empty");
      [0, 2, 4].forEach((i, j) => { const p = B(i); L.push(<Tag key={"h" + i} t={t} at={half + j * 0.12} x={p.x} y={p.y + 20} dx={-60 + j * 60} dy={170} text="HALF EMPTY" col={COL.amber} size={30} out={10.0} />); });
      const g = B(0), c = B(1), f = B(3);
      L.push(<Tag key="tg" t={t} at={at("glass")} x={g.x} y={g.y - 40} dx={-180} dy={-200} text="GLASS" col="#8fd6ff" out={13.5} />);
      L.push(<Tag key="tc" t={t} at={at("counters")} x={c.x} y={c.y - 40} dx={-40} dy={-280} text="COUNTERS" col="#9df0b4" out={13.5} />);
      L.push(<Tag key="tf" t={t} at={at("fridge")} x={f.x} y={f.y - 40} dx={170} dy={-220} text="FRIDGE" col="#ffe27a" out={13.5} />);
    }
    // C · tarjeta 3D con la toma real del mueble + "KILLS 99% OF… SOMETHING?"
    if (t >= 13.7 && t < 17.6) {
      const k = spr(t, 13.95, 0.8), zo = ei(t, 16.75, 17.2);
      L.push(<Card3D key="cs" id={vid("m_sink")} at={13.95} x={420} y={170} w={1080} h={608} ry={(1 - Math.min(1, k)) * 60 - 6 + 8 * e(t, 14, 16.8)} rx={4} z={(1 - Math.min(1, k)) * -1400 + zo * 900} o={e(t, 13.95, 14.1) * (1 - e(t, 16.95, 17.2))} />);
      L.push(<Stamp key="99" t={t} at={at("kills")} text="KILLS 99% OF… SOMETHING?" x={960} y={860} rot={-4} size={66} out={16.95} />);
    }
    // D · $40 al mes que sale por la puerta
    if (t >= 17.2 && t < 22) {
      const dr = screenOf(t, PT.backDoor);
      L.push(<BigNum key="40" t={t} at={at("$40")} text="$40" x={1350} y={300} size={230} col="#9df0b4" edge="#1f5a36" sub="A MONTH" out={21.3} />);
      L.push(<Tag key="od" t={t} at={at("out the door")} x={dr.x} y={dr.y} dx={160} dy={-170} text="OUT THE DOOR" col={COL.red} out={21.3} />);
    }
    // E · la alacena: UN frasco, time-lapse
    if (t >= 21.6 && t < 31) {
      const j = screenOf(t, PT.jarShelf);
      L.push(<Words key="dc" t={t} items={[{ at: at("different"), txt: "A DIFFERENT CABINET" }]} out={at("One old") - 0.2} y={150} size={92} />);
      L.push(<Tag key="oj" t={t} at={at("One old")} x={j.x} y={j.y} dx={-230} dy={-150} text="ONE OLD JAR" out={at("two weeks") - 0.2} />);
      L.push(<Tag key="cw" t={t} at={at("clear as")} x={j.x} y={j.y + 40} dx={220} dy={120} text="CLEAR AS WATER" col="#8fd6ff" out={at("two weeks") - 0.2} />);
      L.push(<DayCounter key="dy" t={t} from={at("two weeks")} out={30.55} />);
      L.push(<Tag key="dh" t={t} at={at("dark honey")} x={j.x} y={j.y + 40} dx={-240} dy={140} text="DARK HONEY" col={COL.amber} out={30.55} />);
    }
    // F · la huerta después de la lluvia en tarjeta + 1 frasco contra 6 rociadores
    if (t >= 30.7 && t < 37.3) {
      const a = at("smells"), k = spr(t, a, 0.8), zo = ei(t, 33.2, 33.6);
      L.push(<Card3D key="gd" id={vid("m_garden")} at={a} x={500} y={180} w={920} h={518} ry={(1 - Math.min(1, k)) * -60 + 6} rx={4} z={(1 - Math.min(1, k)) * -1400 - zo * 1200} o={e(t, a, a + 0.12) * (1 - e(t, 33.3, 33.6))} label="A GARDEN AFTER THE RAIN" labelCol="#c8e6b5" />);
      L.push(<Versus key="vs" t={t} at={at("That jar does") - 0.05} out={36.85} title="DOES EVERY JOB" L={{ label: "6 STORE BOTTLES", val: "$40/MO", h: 0.85, col: COL.red, mark: "x" }} R={{ label: "1 OLD JAR", val: "$2", h: 0.25, col: COL.amber, mark: "ok" }} />);
    }
    // G
    L.push(<Stamp key="nb" t={t} at={at("never bought")} text="NEVER BOUGHT A CLEANER" x={960} y={850} rot={-5} size={82} out={41.5} />);
    // H · Clem, 78, Kansas
    if (t >= 41.6 && t < 48.6) {
      const h = screenOf(t, PT.house);
      L.push(<Tag key="wf" t={t} at={45.4} x={h.x} y={h.y} dx={220} dy={-160} text="60 YEARS" sub="WHEAT FARM · KANSAS" col={COL.amber} out={46.2} />);
    }
    L.push(<LowerThird key="lt" t={t} at={at("Clem")} out={at("My mother") + 1.5} name="CLEM" l2="78 · 60 YEARS ON A KANSAS WHEAT FARM" l2at={at("78")} />);
    // I · la receta que pasa de madre en hija
    L.push(<Chips key="gen" t={t} at={at("her mother")} items={["GRANDMA", "MOTHER", "CLEM"]} out={54.2} y={720} />);
    // J · $2: vinagre, romero, paciencia
    L.push(<Price key="p2" t={t} at={at("$2")} x={1520} y={170} item="THE WHOLE JAR" $={2} out={60.3} />);
    L.push(<Words key="ig" t={t} items={[{ at: at("White vinegar"), txt: "WHITE VINEGAR" }, { at: at("rosemary", 56), txt: "+ ROSEMARY", col: "#9df0b4" }, { at: at("patience"), txt: "+ PATIENCE", col: COL.amber }]} out={62.6} y={900} size={78} />);
    // K · 10 usos
    L.push(<BigNum key="10" t={t} at={at("10 ways")} text="10 USES" x={960} y={430} size={190} col={COL.ink} sub="HOUSE + FARM" out={66.5} />);
    // L · 3 errores
    L.push(<Stamp key="3m" t={t} at={at("three mistakes")} text="3 MISTAKES" x={1350} y={300} rot={-7} size={120} out={73.2} />);
    L.push(<Tag key="rg" t={t} at={at("ruin")} x={820} y={640} dx={-200} dy={150} text="RUINED FOR GOOD" col={COL.red} out={73.2} />);
    return L;
  },
});

export const Min1: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const min1ClipPlan = M.clipPlan;
export const min1BeatTable = M.beatTable;
