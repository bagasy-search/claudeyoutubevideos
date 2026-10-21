// lcf01 · MINUTO 1 (0-87,3 s), a mano, vara gary01. Un solo hilo visual, sin cortes secos:
// Loretta → el reloj a las 4:50 → la heladera se abre: la fuente del funeral en papel aluminio, para 12 → Loretta (12 vs 1)
// → galletitas sobre la pileta → la cocina de noche, 365 noches → "a different kitchen": se prende la luz del horno
// → Loretta → (portal por la puerta del horno) el calor en la cara, sale UNA fuentecita → Loretta la saca → al plato de la
// mesa para uno → Loretta (10 MIN, más barato que la sopa) → la mesa entera con la silla vacía → las señoras de la iglesia
// → la fuente de 9x13 se achica a un plato → Loretta (10 cenas, <$2,50) → las 10 fuentecitas: la 9 con el aro rojo
// → Loretta: "It was never you". Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { KitchenWorld, screenOf, camSpeed, PT } from "./kitchen3d";
import { BigNum, COL, Card3D, Chips, FONT, LowerThird, Tag, e, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp } from "../kits/yanqui3d/engine";
import { Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("lcf01");
export const MIN1_END = 87.31;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
export const vid = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);

// mundo 3D con blur de movimiento real (velocidad de cámara proyectada) — sólo el mundo, nunca el avatar
export const World: React.FC<{ t: number; blur?: number }> = ({ t, blur = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5) + blur, by: Math.min(3.5, v0.by * 0.5) + blur };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><KitchenWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: HAS, T0: 0, TEND: MIN1_END + 1.2, flashAtStart: false,
  beats: ({ at, AV, CL }) => [
    // A · 0-3,5 · Loretta: "ten minutes to five, the house is so quiet"
    AV(0, "cut"),
    // B · el reloj del pasillo → la heladera: la fuente del funeral
    { a: 3.52, tr: "whipL", r: (t) => <World t={t} /> },
    // C · Loretta: para 12 personas… y vos sos una
    AV(13.177, "whip", { spans: [[at("twelve") - 0.1, 16.95]] }),
    // D · cuatro galletitas paradas sobre la pileta
    CL(17.077, "m_crackers", "whipL", undefined, [1.03, 1.12]),
    // E · la cocina de noche (un año entero) → "a different kitchen": la luz del horno se prende
    { a: 23.9, tr: "light", r: (t) => <World t={t} /> },
    // F · Loretta: "the oven light is on… bubbling at the edges"
    AV(30.647, "push", { spans: [[at("bubbling") - 0.1, 36.85]] }),
    // G · PORTAL por la puerta del horno: el calor en la cara, sale UNA fuentecita
    { a: 36.96, tr: "portal", p: [960, 560], r: (t) => <World t={t} /> },
    CL(40.0, "m_dish", "whip", undefined, [1.02, 1.1]),
    // la fuentecita en el plato de la mesa para uno
    { a: 43.85, tr: "whipL", r: (t) => <World t={t} /> },
    // H · Loretta: más barato que una lata de sopa
    AV(47.563, "whip", { spans: [[at("less") - 0.1, 53.1]] }),
    // I · la mesa entera, la silla vacía de Harold
    { a: 53.22, tr: "light", r: (t) => <World t={t} /> },
    CL(at("church") - 0.05, "m_church", "whip", undefined, [1.03, 1.12]),
    // la fuente de 9x13 se achica a UN plato
    { a: at("full,") + 0.15, tr: "whipL", r: (t) => <World t={t} /> },
    // J · Loretta: 10 cenas, ~10 min, < $2,50
    AV(65.668, "push", { spans: [[at("about", 63) + 2.0, 71.4]] }),
    // K · las 10 fuentecitas en fila: la 9 con el aro rojo
    { a: 71.53, tr: "whipL", r: (t) => <World t={t} /> },
    // L · Loretta: "It was never you. It was the mistake. I'm Loretta."
    AV(83.669, "light", { spans: [[83.8, 85.5]] }),
  ],
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    // A · 4:50
    L.push(<BigNum key="450" t={t} at={at("ten")} text="4:50" x={360} y={300} size={150} col={COL.ink} sub="PM · SO QUIET" out={3.35} />);
    // B · el reloj y la heladera
    if (t >= 3.5 && t < 13.3) {
      const c = screenOf(t, PT.clock), f = screenOf(t, PT.fridgePan);
      L.push(<Tag key="tk" t={t} at={3.9} x={c.x} y={c.y} dx={230} dy={120} text="TICK… TICK…" col={COL.ink} out={5.6} size={40} />);
      L.push(<Tag key="fu" t={t} at={at("funeral,")} x={f.x} y={f.y} dx={-260} dy={-170} text="AFTER THE FUNERAL" col={COL.ink} out={13.1} />);
      L.push(<Tag key="fo" t={t} at={at("foil,")} x={f.x} y={f.y + 20} dx={250} dy={150} text="STILL IN FOIL" col="#cfd6de" out={13.1} />);
    }
    // C · 12 → 1
    if (t >= 13.1 && t < 17.3) {
      L.push(<BigNum key="12" t={t} at={at("twelve")} text="FOR 12" x={620} y={430} size={170} col={COL.ink} sub="PEOPLE" out={16.9} />);
      L.push(<BigNum key="1" t={t} at={at("one", 15)} text="YOU: 1" x={1330} y={430} size={170} col={COL.amber} sub="PERSON" out={16.9} />);
    }
    // D · ¿eso es la cena?
    L.push(<Stamp key="sup" t={t} at={at("that's", 22)} text="…THAT'S SUPPER?" x={1300} y={300} rot={-6} size={86} out={23.8} />);
    // E · un año entero · la otra cocina
    if (t >= 23.9 && t < 30.7) {
      L.push(<BigNum key="365" t={t} at={at("every", 24)} text="365" x={1420} y={330} size={200} col={COL.ink} sub="NIGHTS · ONE WHOLE YEAR" out={27.2} />);
      L.push(<Words key="dk" t={t} items={[{ at: at("different"), txt: "A DIFFERENT KITCHEN", col: COL.amber }]} out={30.5} y={150} size={92} />);
    }
    // F · la luz del horno, burbujeando
    L.push(<Words key="ov" t={t} items={[{ at: at("oven", 30), txt: "THE OVEN LIGHT IS ON", col: COL.amber }, { at: at("bubbling"), txt: "BUBBLING AT THE EDGES" }]} out={36.8} y={900} size={78} />);
    // G · el calor en la cara · una fuentecita
    if (t >= 36.9 && t < 40.1) {
      const o = screenOf(t, PT.ovenOut);
      L.push(<Tag key="wa" t={t} at={at("warm")} x={o.x} y={Math.max(280, o.y - 120)} dx={-260} dy={-100} text="WARM AIR" col={COL.amber} out={40.0} />);
      L.push(<Tag key="od" t={t} at={at("one", 39)} x={o.x} y={o.y} dx={230} dy={-140} text="ONE LITTLE DISH" col={COL.ink} out={40.0} />);
    }
    L.push(<Tag key="go" t={t} at={at("golden")} x={960} y={560} dx={300} dy={-200} text="GOLDEN ON TOP" col={COL.amber} out={43.8} />);
    // la mesa para uno: + almuerzo de mañana · 10 minutos
    if (t >= 43.85 && t < 47.7) {
      const p = screenOf(t, PT.plate);
      L.push(<Tag key="ex" t={t} at={43.95} x={p.x} y={p.y} dx={-280} dy={-180} text="ENOUGH FOR YOU" col={COL.ink} out={47.5} />);
      L.push(<Tag key="lt" t={t} at={at("lunch")} x={p.x} y={p.y} dx={260} dy={-150} text="+ LUNCH TOMORROW" col="#9df0b4" out={47.5} />);
    }
    L.push(<BigNum key="10m" t={t} at={at("10", 46)} text="10 MIN" x={1440} y={300} size={170} col={COL.ink} sub="OF YOUR WORK" out={at("oven", 47.5) + 0.4} />);
    L.push(<Words key="rest" t={t} items={[{ at: at("oven", 47.5), txt: "THE OVEN DOES THE REST", col: COL.amber }]} out={49.9} y={900} size={78} />);
    // H · más barato que una lata de sopa y galletitas (sin precio inventado: la comparación es la de ella)
    if (t >= 49.9 && t < 53.3) {
      const a = at("less"), k = spr(t, a, 0.8);
      L.push(<Card3D key="sp" id={vid("m_soup")} at={a} x={500} y={170} w={920} h={518} ry={(1 - Math.min(1, k)) * 60 - 5} rx={4} z={(1 - Math.min(1, k)) * -1400} o={e(t, a, a + 0.12) * (1 - e(t, 52.95, 53.2))} label="LESS THAN SOUP + CRACKERS" labelCol={COL.amber} />);
    }
    // I · esta noche
    L.push(<Words key="tn" t={t} items={[{ at: at("tonight", 53), txt: "TONIGHT" }]} out={at("Ten", 55) - 0.1} y={150} size={110} />);
    if (t >= 53.22 && t < 55.4) {
      const c = screenOf(t, PT.chair);
      L.push(<Tag key="hc" t={t} at={53.7} x={c.x} y={c.y} dx={-330} dy={-150} text="HAROLD'S CHAIR" col={COL.ink} out={55.3} size={40} />);
    }
    L.push(<Chips key="ch" t={t} at={at("Ten", 55)} items={["10 CHURCH SUPPER CASSEROLES"]} out={at("full,") + 0.1} y={880} />);
    if (t >= at("full,") + 0.15 && t < 65.7) {
      const b = screenOf(t, PT.bigPan);
      L.push(<Tag key="913" t={t} at={at("full,") + 0.4} x={b.x} y={b.y} dx={-280} dy={-170} text="9×13 · FOR 100" col={COL.ink} out={at("cut") + 0.2} />);
      L.push(<BigNum key="op" t={t} at={at("plate,", 62)} text="ONE PLATE" x={1380} y={300} size={150} col={COL.amber} out={65.5} />);
    }
    // J · 10 min, < $2,50, el horno hace todo
    L.push(<Chips key="nums" t={t} at={at("about", 63)} items={["~10 MIN OF WORK", "UNDER $2.50 A PLATE", "THE OVEN DOES THE REST"]} out={71.35} y={860} />);
    // K · número 9
    if (t >= 71.53 && t < 83.8) {
      for (let i = 0; i < 10; i++) {
        const p = screenOf(t, PT.dish(i)), a = 71.75 + i * 0.09;
        const big = i === 8;
        L.push(<div key={"n" + i} style={{ position: "absolute", left: p.x, top: p.y - 95 - (big ? 20 : 0), transform: `translate(-50%,-50%) scale(${Math.min(1.12, spr(t, a)) * (big ? 1 + 0.25 * e(t, 73.0, 73.4) : 1)})`, opacity: e(t, a, a + 0.08) * (big ? 1 : 1 - 0.6 * e(t, 74.9, 75.5)),
          width: 76, height: 76, borderRadius: 38, background: big && t > 73 ? "#b3261e" : "rgba(20,14,10,.85)", border: `4px solid ${big && t > 73 ? "#fff" : COL.amber}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", boxShadow: "0 14px 26px rgba(0,0,0,.55)" }}>{i + 1}</div>);
      }
      const n = screenOf(t, PT.dish(8));
      L.push(<Tag key="mk" t={t} at={at("mistake", 74)} x={n.x} y={n.y} dx={-300} dy={120} text="ONE LITTLE MISTAKE" col={COL.red} out={83.6} />);
      L.push(<Stamp key="cc" t={t} at={at("can't", 80)} text="“I CAN'T COOK FOR ONE”" x={1220} y={250} rot={-5} size={74} out={83.6} />);
      L.push(<Words key="nv" t={t} items={[{ at: at("never", 82), txt: "IT WAS NEVER YOU." }]} out={83.65} y={900} size={84} />);
    }
    // L · era el error · Loretta
    L.push(<Words key="ms" t={t} items={[{ at: at("mistake.", 84), txt: "IT WAS THE MISTAKE.", col: COL.amber }]} out={85.5} y={900} size={84} />);
    L.push(<LowerThird key="lt3" t={t} at={at("Loretta.")} out={MIN1_END + 2} name="LORETTA" l2="81 · 60 YEARS IN THE CHURCH KITCHEN · IOWA" l2at={at("Loretta.") + 0.3} />);
    return L;
  },
});

export const Min1: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const min1ClipPlan = M.clipPlan;
export const min1BeatTable = M.beatTable;
