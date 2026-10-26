// ck2510a · MINUTO 1 (0-86,3 s), a mano, vara gary01. Un solo hilo visual, sin cortes secos:
// Loretta (10:45, la fuente tapada entra en una tarjeta a los 0 s) → el salón: las 7 fuentes llegan a la mesa larga → la puerta de
// arriba se abre → Loretta → ella baja con la fuente en el repasador y la deja junto a las otras → la fila de 7 → la tarjetita con
// el apellido → Loretta → la señora que ya sabía qué llevar → 30 años la misma fuente → la familia baja del cementerio → Loretta
// → la mesa de la familia → 60 años detrás de la mesa → Loretta (las 7) → las 7 destapadas → la bandeja del súper → Loretta.
// Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HallWorld, sceneOf, screenOfScene, PT } from "./hall3d";
import { COL, Card3D, Tag, e, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo } from "../kits/yanqui3d/engine";
import { Stat, ZItem, ZocaloStack } from "./ui";
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
    // piezas nivel nuevo (molde ck2510d/ui.tsx): el texto va al zócalo abajo-izq, los números en dorado a la izquierda
    const ZS: ZItem[] = [];
    const Z = (key: string, a: number, out: number, tone: ZItem["tone"], label: string, txt: string, x: Partial<ZItem> = {}) => ZS.push({ key, a, out, tone, label, txt, ...x });
    // A · la fuente tapada a los 0 s (hook de la tarjeta) en una tarjeta 3D junto a Loretta · 10:45
    {
      const a = 0.12, k = spr(t, a, 0.9);
      if (t < 3.6) L.push(<Card3D key="hk" id={vid("m_hook")} at={a} x={1080} y={150} w={760} h={428} ry={(1 - Math.min(1, k)) * -55 - 8} rx={3} z={(1 - Math.min(1, k)) * -1200} o={e(t, a, a + 0.12) * (1 - e(t, 3.3, 3.5))} label="SEVEN PANS · ONE LONG TABLE" labelCol={COL.amber} />);
    }
    L.push(<Stat key="1045" t={t} at={at("quarter")} out={3.4} text="10:45" sub="SERVICE AT ONE" size={160} x={360} y={330} />);
    // B · el salón y las fuentes llegando
    if (t >= 3.52 && t < 14.3) {
      const u = t - 3.52;
      if (t < at("one", 10.5)) {
        const c = screenOfScene("hook", u, PT.pan(1));
        L.push(<Tag key="lt" t={t} at={at("long", 6.8)} x={c.x} y={c.y} dx={-240} dy={-170} text="THE LONG TABLE" col={COL.ink} out={at("one", 10.5) - 0.2} />);
        Z("wc", at("white", 9.5), at("one", 10.5) - 0.15, "note", "THE FUNERAL LUNCH", "A WHITE CLOTH");
      }
      Z("obo", at("one", 10.5), 14.2, "tip", "THE FUNERAL LUNCH", "ONE BY ONE…");
    }
    // D · el repasador
    Z("dt", at("wrapped", 16.5), 20.3, "note", "THE FUNERAL LUNCH", "WRAPPED IN A DISH TOWEL");
    // E · junto a las otras
    Z("nx", at("next", 20), at("under", 23.5) - 0.2, "tip", "THE FUNERAL LUNCH", "NEXT TO THE OTHERS");
    // F · 7 · la tarjetita
    L.push(<Stat key="7" t={t} at={at("under", 23.5) - 0.1} out={at("folded", 26) - 0.35} text="7" sub="PANS IN A ROW" />);
    if (t >= at("folded", 26) - 0.3 && t < 32.7) {
      const u = t - (at("folded", 26) - 0.3), c = screenOfScene("card:3", u, PT.card(3));
      L.push(<Tag key="fn" t={t} at={at("family", 29)} x={c.x} y={c.y - 40} dx={-300} dy={-200} text="A FAMILY NAME" col={COL.ink} out={32.6} />);
      Z("home", at("finds", 31), 32.65, "tip", "THE LITTLE CARD", "SO THE PAN FINDS ITS WAY HOME");
    }
    // G · nadie lo planeó
    Z("np", at("Nobody", 33), 36.2, "list", "NOBODY CALLED ANYBODY", "", { items: [{ at: at("Nobody", 33), txt: "NOBODY PLANNED IT." }, { at: at("Nobody", 34.5), txt: "NOBODY MADE A LIST." }] });
    // H · ella sabía · 30 años
    Z("kn", at("knew", 37.5), at("same", 41) - 0.25, "note", "NOBODY CALLED ANYBODY", "SHE KNEW EXACTLY WHAT TO BRING");
    L.push(<Stat key="30" t={t} at={at("30", 43.5)} out={at("when", 45) - 0.15} text="30" sub="YEARS · THE SAME PAN" />);
    // I · la familia
    Z("cem", at("after", 47.4), 48.8, "note", "THE FAMILY", "AFTER THE CEMETERY");
    // J · frío, cansados, sin hambre
    Z("cold", at("cold", 49), at("take", 52.3) - 0.1, "list", "THE FAMILY", "", { items: ["COLD", "TIRED", "NOT HUNGRY AT ALL"].map((txt, i) => ({ at: at("cold", 49) + i * 0.45, txt })) });
    Z("sp", at("spoonful", 52.8), 54.45, "tip", "THE FAMILY", "ONE SPOONFUL OF EACH");
    // K · se sientan · 60 años
    Z("sd", at("first", 54.8), at("stood", 57) - 0.3, "list", "THE FAMILY", "", { items: [{ at: at("first", 54.8), txt: "FIRST TIME THAT DAY…" }, { at: at("sit", 56.5), txt: "THEY SAT DOWN." }] });
    if (t >= 54.514 && t < 57.6) {
      const c = screenOfScene("head", t - 54.514, PT.head);
      L.push(<Tag key="ht" t={t} at={55.0} x={c.x} y={c.y} dx={260} dy={-160} text="THE FAMILY'S TABLE" col={COL.ink} out={57.4} size={40} />);
    }
    L.push(<Stat key="60" t={t} at={at("60", 59.3)} out={64.7} text="60" sub="YEARS BEHIND THAT TABLE" />);
    // L · las siete
    Z("t7", at("seven", 65.2), at("Who", 68.4) - 0.1, "tip", "TODAY", "7 FUNERAL CASSEROLES");
    Z("who", at("Who", 68.4), at("because", 75.3), "list", "TODAY", "", { items: ["WHO BROUGHT IT", "WHY THAT ONE", "THE WHOLE RECIPE"].map((txt, i) => ({ at: at("Who", 68.4) + i * 0.45, txt })) });
    // M · la parte triste
    Z("nm", at("Nobody", 77.6), at("order", 80) - 0.35, "warn", "THE SAD PART", "NOBODY MAKES THEM ANYMORE");
    // N · la bandeja
    Z("ff", at("tray", 81), 82.95, "note", "THE SAD PART", "A STORE-BOUGHT TRAY");
    // O · tu nombre bajo la tapa
    Z("fd", at("fine,", 84), at("but", 86) - 0.05, "note", "THE SAD PART", "IT'S FINE. IT'S FOOD.");
    Z("nm2", at("but", 86), MIN1_END + 1, "tip", "THE SAD PART", "BUT IT ISN'T YOUR PAN");
    L.push(<ZocaloStack key="zs" t={t} items={ZS} />);
    return L;
  },
});

export const Min1: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const min1ClipPlan = M.clipPlan;
export const min1BeatTable = M.beatTable;
