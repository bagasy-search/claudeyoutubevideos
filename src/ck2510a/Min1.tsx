// ck2510a · MINUTO 1 (0-86,3 s), a mano, vara gary01. Un solo hilo visual, sin cortes secos:
// Loretta (10:45, la fuente tapada entra en una tarjeta a los 0 s) → el salón: las 7 fuentes llegan a la mesa larga → la puerta de
// arriba se abre → Loretta → ella baja con la fuente en el repasador y la deja junto a las otras → la fila de 7 → la tarjetita con
// el apellido → Loretta → la señora que ya sabía qué llevar → 30 años la misma fuente → la familia baja del cementerio → Loretta
// → la mesa de la familia → 60 años detrás de la mesa → Loretta (las 7) → las 7 destapadas → la bandeja del súper → Loretta.
// Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HallWorld, sceneOf, screenOfScene, PT } from "./hall3d";
import { BigNum, COL, Card3D, Chips, Tag, e, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp } from "../kits/yanqui3d/engine";
import { Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("ck2510a");
export const MIN1_END = 86.304;
export const MIN1_FRAMES = Math.round(MIN1_END * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
export const vid = (k: string) => (HAS.clips.includes(k) ? "ltx_" + k : "img_" + k);

// el salón 3D en una escena con nombre; u = segundos desde que entra la toma
export const World: React.FC<{ t: number; scene: string; a: number }> = ({ t, scene, a }) => <HallWorld t={t} sc={sceneOf(scene, t - a)} />;
const W = (a: number, scene: string, tr: "portal" | "whipL" | "whip" | "light" | "push" = "whipL", p?: [number, number]) => ({ a, tr, p, r: (t: number) => <World t={t} scene={scene} a={a} /> });

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: HAS, T0: 0, TEND: MIN1_END + 1.2, flashAtStart: false,
  beats: ({ at, AV, CL }) => [
    // A · 0-3,5 · Loretta: "a quarter to eleven… the service starts at one" (la fuente tapada ya en pantalla a los 0 s)
    AV(0, "cut"),
    // B · el salón: las 7 fuentes van llegando a la mesa larga
    W(3.52, "hook", "portal", [1280, 560]),
    // C · "one by one the doors at the top of the stairs open"
    W(at("one", 10.5) - 0.1, "stairs", "light"),
    // D · Loretta: "a woman comes down holding a pan wrapped in a dish towel"
    AV(14.28, "whip"),
    // E · ella la deja junto a las otras y mete la tarjetita
    CL(20.39, "k001", "push", undefined, [1.02, 1.08]),
    // F · siete en fila · la tarjetita con el apellido
    W(at("under", 23.5) - 0.15, "row", "whipL"),
    W(at("folded", 26) - 0.3, "card:3", "portal", [960, 640]),
    // G · Loretta: "Nobody planned it. Nobody made a list."
    AV(32.708, "push"),
    // H · la señora que ya sabía qué llevar → 30 años la misma fuente
    CL(36.248, "k002", "flip", undefined, [1.03, 1.1]),
    W(at("same", 41) - 0.2, "card:0", "whipL"),
    // I · la familia baja del cementerio
    CL(at("when", 45) - 0.1, "m_cem", "whip", undefined, [1.02, 1.09]),
    // J · Loretta: "cold and tired and not hungry at all… one spoonful of each"
    AV(48.86, "light"),
    // K · se sientan · 60 años detrás de esa mesa
    W(54.514, "head", "portal", [960, 600]),
    W(at("stood", 57) - 0.25, "table", "whipL"),
    // L · Loretta: las siete
    AV(64.811, "whipL"),
    // M · las 7 destapadas · "nobody makes them anymore"
    W(70.203, "row:open", "portal", [960, 560]),
    // N · la bandeja del súper
    CL(at("order", 80) - 0.3, "m_tray", "whip", undefined, [1.03, 1.1]),
    // O · Loretta: "it isn't a pan with your name under the lid"
    AV(82.963, "push"),
  ],
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    // A · la fuente tapada a los 0 s (hook de la tarjeta) en una tarjeta 3D junto a Loretta · 10:45
    {
      const a = 0.12, k = spr(t, a, 0.9);
      if (t < 3.6) L.push(<Card3D key="hk" id={vid("m_hook")} at={a} x={1080} y={150} w={760} h={428} ry={(1 - Math.min(1, k)) * -55 - 8} rx={3} z={(1 - Math.min(1, k)) * -1200} o={e(t, a, a + 0.12) * (1 - e(t, 3.3, 3.5))} label="SEVEN PANS · ONE LONG TABLE" labelCol={COL.amber} />);
    }
    L.push(<BigNum key="1045" t={t} at={at("quarter")} text="10:45" x={360} y={300} size={140} col={COL.ink} sub="SERVICE AT ONE" out={3.4} />);
    // B · el salón y las fuentes llegando
    if (t >= 3.52 && t < 14.3) {
      const u = t - 3.52;
      if (t < at("one", 10.5)) {
        const c = screenOfScene("hook", u, PT.pan(1));
        L.push(<Tag key="lt" t={t} at={at("long", 6.8)} x={c.x} y={c.y} dx={-240} dy={-170} text="THE LONG TABLE" col={COL.ink} out={at("one", 10.5) - 0.2} />);
        L.push(<Words key="wc" t={t} items={[{ at: at("white", 9.5), txt: "A WHITE CLOTH" }]} out={at("one", 10.5) - 0.15} y={900} size={74} />);
      }
      L.push(<Words key="obo" t={t} items={[{ at: at("one", 10.5), txt: "ONE BY ONE…", col: COL.amber }]} out={14.2} y={150} size={96} />);
    }
    // D · el repasador
    L.push(<Words key="dt" t={t} items={[{ at: at("wrapped", 16.5), txt: "WRAPPED IN A DISH TOWEL" }]} out={20.3} y={900} size={72} />);
    // E · junto a las otras
    L.push(<Words key="nx" t={t} items={[{ at: at("next", 20), txt: "NEXT TO THE OTHERS", col: COL.amber }]} out={at("under", 23.5) - 0.2} y={150} size={84} />);
    // F · 7 · la tarjetita
    L.push(<BigNum key="7" t={t} at={at("under", 23.5) - 0.1} text="7" x={1500} y={300} size={220} col={COL.amber} sub="PANS IN A ROW" out={at("folded", 26) - 0.35} />);
    if (t >= at("folded", 26) - 0.3 && t < 32.7) {
      const u = t - (at("folded", 26) - 0.3), c = screenOfScene("card:3", u, PT.card(3));
      L.push(<Tag key="fn" t={t} at={at("family", 29)} x={c.x} y={c.y - 40} dx={-300} dy={-200} text="A FAMILY NAME" col={COL.ink} out={32.6} />);
      L.push(<Words key="home" t={t} items={[{ at: at("finds", 31), txt: "SO THE PAN FINDS ITS WAY HOME", col: COL.amber }]} out={32.65} y={900} size={70} />);
    }
    // G · nadie lo planeó
    L.push(<Words key="np" t={t} items={[{ at: at("Nobody", 33), txt: "NOBODY PLANNED IT." }, { at: at("Nobody", 34.5), txt: "NOBODY MADE A LIST.", col: COL.amber }]} out={36.2} y={880} size={84} />);
    // H · ella sabía · 30 años
    L.push(<Words key="kn" t={t} items={[{ at: at("knew", 37.5), txt: "SHE KNEW EXACTLY WHAT TO BRING" }]} out={at("same", 41) - 0.25} y={150} size={70} />);
    L.push(<BigNum key="30" t={t} at={at("30", 43.5)} text="30 YEARS" x={1380} y={300} size={150} col={COL.amber} sub="THE SAME PAN · EVERY FUNERAL" out={at("when", 45) - 0.15} />);
    // I · la familia
    L.push(<Words key="cem" t={t} items={[{ at: at("after", 47.4), txt: "AFTER THE CEMETERY" }]} out={48.8} y={150} size={92} />);
    // J · frío, cansados, sin hambre
    L.push(<Chips key="cold" t={t} at={at("cold", 49)} items={["COLD", "TIRED", "NOT HUNGRY AT ALL"]} out={at("take", 52.3) - 0.1} y={860} />);
    L.push(<Words key="sp" t={t} items={[{ at: at("spoonful", 52.8), txt: "ONE SPOONFUL OF EACH", col: COL.amber }]} out={54.45} y={880} size={80} />);
    // K · se sientan · 60 años
    L.push(<Words key="sd" t={t} items={[{ at: at("first", 54.8), txt: "FOR THE FIRST TIME THAT DAY…" }, { at: at("sit", 56.5), txt: "THEY SAT DOWN.", col: COL.amber }]} out={at("stood", 57) - 0.3} y={150} size={80} />);
    if (t >= 54.514 && t < 57.6) {
      const c = screenOfScene("head", t - 54.514, PT.head);
      L.push(<Tag key="ht" t={t} at={55.0} x={c.x} y={c.y} dx={260} dy={-160} text="THE FAMILY'S TABLE" col={COL.ink} out={57.4} size={40} />);
    }
    L.push(<BigNum key="60" t={t} at={at("60", 59.3)} text="60 YEARS" x={1400} y={300} size={150} col={COL.amber} sub="BEHIND THAT TABLE" out={64.7} />);
    // L · las siete
    L.push(<Words key="t7" t={t} items={[{ at: at("seven", 65.2), txt: "7 FUNERAL CASSEROLES", col: COL.amber }]} out={at("Who", 68.4) - 0.1} y={880} size={92} />);
    L.push(<Chips key="who" t={t} at={at("Who", 68.4)} items={["WHO BROUGHT IT", "WHY THAT ONE", "THE WHOLE RECIPE"]} out={at("because", 75.3)} y={860} />);
    // M · la parte triste
    L.push(<Stamp key="nm" t={t} at={at("Nobody", 77.6)} text="NOBODY MAKES THEM ANYMORE" x={960} y={330} rot={-5} size={86} out={at("order", 80) - 0.35} />);
    // N · la bandeja
    L.push(<Words key="ff" t={t} items={[{ at: at("tray", 81), txt: "A STORE-BOUGHT TRAY" }]} out={82.95} y={150} size={80} />);
    // O · tu nombre bajo la tapa
    L.push(<Words key="fd" t={t} items={[{ at: at("fine,", 84), txt: "IT'S FINE. IT'S FOOD." }]} out={at("but", 86) - 0.05} y={880} size={80} />);
    L.push(<Words key="nm2" t={t} items={[{ at: at("but", 86), txt: "BUT IT ISN'T YOUR PAN", col: COL.amber }]} out={MIN1_END + 1} y={880} size={84} />);
    return L;
  },
});

export const Min1: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const min1ClipPlan = M.clipPlan;
export const min1BeatTable = M.beatTable;
