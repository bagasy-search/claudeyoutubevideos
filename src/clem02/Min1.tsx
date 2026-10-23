// clem02 · MINUTO 1 (0-76,8 s), a mano, misma vara que gary01/clem01. Un solo hilo visual, sin cortes secos:
// avatar → el pasillo de limpieza ($6, $7) → (latigazo) la casa en corte: sarro, hornallas, lavarropas-pantano → avatar con la cuenta del carrito
// → la cocina del abuelo en 1952: UN frasco al fondo de la mesada → avatar (casa/granero/camioneta) → Clem tira los rociadores y levanta el frasco (LTX)
// → avatar + CLEM 78 → la cámara sube: la casa entera en corte y el frasco vuela cuarto por cuarto → avatar → lavandina/vinagre: UNO PUEDE LASTIMARTE.
// Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HouseWorld, screenOf, camSpeed, PT, lapseDay } from "./house3d";
import { BigNum, COL, Chips, FONT, LowerThird, Receipt, Tag, e, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Price } from "../kits/yanqui3d/engine";
import { Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("clem02");
export const MIN1_END = 76.8;
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
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><HouseWorld t={t} /></AbsoluteFill>
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
        <div style={{ height: 14, background: "linear-gradient(90deg,#f0a040,#b4621c)", width: `${(n / 14) * 100}%` }} />
      </div>
    </div>
  );
};

const ORANGE = "#ffa94d";
const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: HAS, T0: 0, TEND: MIN1_END + 1.2, flashAtStart: false,
  beats: ({ at, AV, CL }) => [
    // A · avatar desde el segundo 0 → el pasillo de limpieza con el carrito
    AV(0, "cut"),
    CL(3.52, "m_aisle", "whip", undefined, [1.03, 1.14]),
    // B · la casa en corte: "hard water / stove / washing machine that smells like a swamp"
    { a: at("Something") - 0.05, tr: "whipL", r: (t) => <World t={t} /> },
    // C · avatar con la cuenta del carrito
    AV(15.85, "whip", { spans: [[16.1, 20.8]] }),
    // D · la cocina del abuelo, 1952: un frasco al fondo de la mesada
    { a: 20.98, tr: "light", r: (t) => <World t={t} /> },
    AV(32.79, "zoom", { spans: [[at("whole house") - 0.1, 38.6]], p: [960, 520] }),
    // E · Clem tira los rociadores y levanta el frasco (LTX)
    CL(38.8, "x_hook", "whip", undefined, [1.02, 1.08]),
    AV(48.44, "push", { edge: true }),
    // F · la cámara sube: la casa entera en corte, el frasco vuela cuarto por cuarto
    { a: 52.15, tr: "zoom", p: [960, 560], r: (t) => <World t={t} /> },
    AV(65.45, "whip", { spans: [[at("what it cleans") - 0.1, 70.3]] }),
    // G · lavandina y vinagre en puntas opuestas: uno puede lastimarte
    CL(70.41, "s34", "flip", undefined, [1.04, 1.15]),
  ],
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    // A · el pasillo: precios por palabra
    L.push(<Words key="ai" t={t} items={[{ at: at("cleaning aisle"), txt: "THE CLEANING AISLE" }]} out={3.4} y={900} size={84} />);
    L.push(<Price key="p6" t={t} at={at("Glass")} x={1450} y={180} item="GLASS CLEANER" $={6} out={9.5} />);
    L.push(<Price key="p7" t={t} at={at("Bathroom")} x={1450} y={470} item="BATHROOM SPRAY" $={7} out={9.5} />);
    // B · rótulos clavados a la casa 3D
    if (t >= 9.6 && t < 16.2) {
      const s = screenOf(t, PT.sinkBath), st = screenOf(t, PT.stove), w = screenOf(t, PT.washer);
      L.push(<Tag key="hw" t={t} at={at("hard water")} x={s.x} y={s.y} dx={-230} dy={-170} text="HARD WATER" col="#8fd6ff" out={at("something for the stove") - 0.2} />);
      L.push(<Tag key="sv" t={t} at={at("stove,")} x={st.x} y={st.y} dx={210} dy={-180} text="BACON GREASE" col={COL.amber} out={13.0} />);
      L.push(<Tag key="sw" t={t} at={at("swamp")} x={w.x} y={w.y} dx={220} dy={-190} text="SMELLS LIKE A SWAMP" col="#b8c95a" out={16.0} />);
    }
    // C · la cuenta del carrito
    L.push(<Receipt key="rc" t={t} title="THE CART" x={1260} y={140} out={20.7} totalAt={at("chemistry")}
      rows={[{ at: 16.15, item: "GLASS CLEANER", $: 6 }, { at: 16.4, item: "BATHROOM SPRAY", $: 7 }, { at: at("throw"), item: "HARD WATER", $: 8 }, { at: at("last bottle"), item: "STOVE DEGREASER", $: 6 }, { at: at("bottle,") + 0.35, item: "WASHER CLEANER", $: 9 }]} />);
    L.push(<Stamp key="lab" t={t} at={at("chemistry")} text="A CHEMISTRY LAB" x={620} y={860} rot={-5} size={80} out={20.7} />);
    // D · la cocina de 1952
    L.push(<BigNum key="52" t={t} at={at("1952")} text="1952" x={960} y={300} size={220} col={COL.amber} sub="GRANDPA'S KITCHEN" out={at("No aisle") - 0.2} />);
    L.push(<Words key="na" t={t} items={[{ at: at("No aisle"), txt: "NO AISLE" }, { at: at("no cart"), txt: "NO CART", col: COL.red }]} out={at("just one") + 0.3} y={880} size={100} />);
    if (t >= 26.5 && t < 33.1) {
      const j = screenOf(t, PT.jar);
      L.push(<Tag key="oj" t={t} at={at("one big")} x={j.x} y={j.y} dx={-260} dy={-170} text="ONE BIG GLASS JAR" out={32.7} />);
      L.push(<Tag key="wt" t={t} at={at("weak tea")} x={j.x} y={j.y + 40} dx={250} dy={-120} text="WEAK TEA" col={COL.amber} out={32.7} />);
      L.push(<Tag key="op" t={t} at={at("orange peels")} x={j.x} y={j.y + 60} dx={240} dy={150} text="ORANGE PEELS" col={ORANGE} out={32.7} />);
    }
    // avatar: casa, granero, camioneta · 40 años
    L.push(<Chips key="hb" t={t} at={at("whole house")} items={["HOUSE", "BARN", "TRUCK"]} out={38.6} y={720} />);
    L.push(<BigNum key="40" t={t} at={at("40 years")} text="40 YEARS" x={960} y={330} size={170} col={COL.ink} out={38.7} />);
    // E · sobre la toma LTX
    L.push(<Stamp key="nb" t={t} at={at("never once")} text="NEVER BOUGHT A CLEANER" x={960} y={860} rot={-5} size={82} out={42.5} />);
    L.push(<Words key="wh" t={t} items={[{ at: at("one old jar"), txt: "ONE OLD JAR" }, { at: at("whole shelf"), txt: "= A WHOLE SHELF?", col: COL.amber }]} out={46.0} y={190} size={92} />);
    L.push(<LowerThird key="lt" t={t} at={at("Clem.")} out={52.0} name="CLEM" l2="78 · 60 YEARS ON A KANSAS WHEAT FARM" l2at={at("78")} />);
    // F · el frasco recorre la casa: rótulo por cuarto
    if (t >= 52 && t < 66) {
      L.push(<Words key="rr" t={t} items={[{ at: at("room by room"), txt: "ROOM BY ROOM" }]} out={61.9} y={170} size={96} />);
      const R: [string, string, keyof typeof PT, string][] = [["Kitchen,", "KITCHEN", "kitchen", COL.amber], ["bathroom,", "BATHROOM", "bath", "#8fd6ff"], ["laundry,", "LAUNDRY", "laundry", "#d9f3ff"], ["porch", "PORCH", "porch", "#9df0b4"], ["barn.", "BARN", "barn", COL.red]];
      R.forEach(([w, txt, k, col], i) => { const p = screenOf(t, PT[k]); L.push(<Tag key={"r" + i} t={t} at={at(w, 62)} x={p.x} y={p.y} dx={k === "bath" ? -220 : i % 2 ? 120 : -120} dy={-160} text={txt} col={col} size={34} out={65.3} />); });
    }
    // avatar: qué limpia, qué tan fuerte, cuánto cuesta
    L.push(<Chips key="hw3" t={t} at={at("what it cleans")} items={["WHAT IT CLEANS", "HOW STRONG", "WHAT IT COSTS"]} out={70.3} y={760} />);
    // G · dónde NUNCA usarlo
    L.push(<Words key="nv" t={t} items={[{ at: at("must never"), txt: "WHERE YOU MUST NEVER USE IT" }]} out={at("one of them") - 0.1} y={170} size={80} />);
    L.push(<Stamp key="hy" t={t} at={at("one of them")} text="ONE CAN HURT YOU" x={960} y={840} rot={-6} size={96} out={76.6} />);
    return L;
  },
});

export const Min1: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const min1ClipPlan = M.clipPlan;
export const min1BeatTable = M.beatTable;
