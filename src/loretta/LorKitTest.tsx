// Banco de prueba del kit Lor* (render de control en el farm antes del video: mide el costo de los 3D y la legibilidad).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LorPie3D } from "./LorPie3D";
import { LorCookbook3D } from "./LorCookbook3D";
import { LorRecipeCard, LorRecipeSheet } from "./LorRecipeCard";
import { LorPotluckTable } from "./LorPotluckTable";
import { LorSignUpSheet } from "./LorSignUpSheet";
import { LorOvenDial } from "./LorOvenDial";
import { LorPieCount } from "./LorPieCount";
import { LorTrick, LorTwoCards, LorMeasure, LorPieCut, LorPieLayers, LorYear } from "./LorCards";
import { LorSnapshot, LorEraTimeline } from "./LorSnapshot";
import { LorNameTag, LorComments, LorArrow, LorAsk, LorSubscribe, LorNote } from "./LorOverlays";
import { SHEET_LORPIES, SHEET_KEYS } from "./sheet_lorpies";

const IMG = "ref_lorpies.jpg";
const PIES = [{ name: "Chess", type: "chess" as const }, { name: "Sugar Cream", type: "sugarcream" as const }, { name: "Shoofly", type: "shoofly" as const }, { name: "Butterscotch", type: "butterscotch" as const }, { name: "Lemon Meringue", type: "meringue" as const }, { name: "Sour Cream Raisin", type: "raisin" as const }, { name: "Mock Apple", type: "mockapple" as const }];
const items: [number, React.ReactNode][] = [
  [180, <LorPie3D type="chess" liftAt={40} title="Chess Pie" sub="since 1963" />],
  [150, <LorPie3D type="meringue" liftAt={30} />],
  [120, <LorPie3D type="cherry" lift={false} />],
  [240, <LorCookbook3D pages={[{ title: "Ham Loaf", lines: ["2 lb ground ham", "2 eggs"] }, { title: "Chess Pie", lines: ["1 stick butter, melted", "1 1/2 cups sugar", "4 eggs"], note: "350° · 45-50 min" }]} />],
  [180, <LorRecipeCard title="Chess Pie" kicker="Pie #1" lines={["1 stick butter", "1 ½ cups sugar", "4 eggs"]} note="350°F" bed={IMG} />],
  [300, <LorRecipeSheet pies={SHEET_LORPIES} keys={SHEET_KEYS.map(([t, x, y, s]) => [t / 2.5, x, y, s] as [number, number, number, number])} />],
  [240, <LorPotluckTable pies={PIES} fadeAt={4} />],
  [200, <LorSignUpSheet rows={[{ name: "Arlene Petty", dish: "PIE — chess", replace: "store bought" }, { name: "Esther Yoder", dish: "PIE — shoofly" }]} replaceAt={2.5} stamp="1978" bed={IMG} />],
  [150, <LorOvenDial stages={[{ temp: 400, minutes: "10 min" }, { temp: 350, minutes: "45 min" }]} bed={IMG} />],
  [90, <LorPieCount n={3} name="Shoofly Pie" sub="shoo the flies off it!" />],
  [90, <LorTrick title="The secret" text="1 Tbsp vinegar cuts the sweetness" bed={IMG} />],
  [90, <LorTwoCards a={{ title: "Light molasses", lines: ["mild"], mark: "✓" }} b={{ title: "Blackstrap", lines: ["bitter as sin"], mark: "✗" }} bed={IMG} />],
  [120, <LorMeasure title="One crust" items={[{ amt: "1 ¼ cups", what: "flour" }, { amt: "½ tsp", what: "salt" }, { amt: "½ cup", what: "cold shortening" }]} />],
  [120, <LorPieCut cuts={8} extra={10} label="one 9-inch pie" note="10 if Dottie cuts" />],
  [90, <LorPieLayers a={{ label: "Wet bottom", sub: "gooey" }} b={{ label: "Dry bottom", sub: "cakey" }} />],
  [90, <LorYear year="1876" text="the Centennial" bed={IMG} />],
  [90, <LorSnapshot src={IMG} seed={3} />],
  [180, <LorEraTimeline from={1955} to={1978} photos={[IMG, IMG, IMG]} intruders={[IMG]} caption="the tubs came" />],
  [150, <AbsoluteFill><LorSnapshot src={IMG} /><LorNameTag name="Arlene Petty" sub="came from Tennessee · 1963" /><LorArrow text="pea-size = flaky" x={0.4} y={0.5} /></AbsoluteFill>],
  [150, <AbsoluteFill><LorSnapshot src={IMG} /><LorComments items={[{ at: 0.3, text: "The pictures never match the recipe!" }, { at: 1.5, text: "Just show us from scratch." }]} /><LorAsk text="Which pie did YOUR church have?" sub="tell me in the comments" /></AbsoluteFill>],
  [120, <AbsoluteFill><LorSnapshot src={IMG} /><LorSubscribe sub="so you don't miss the next one" /><LorNote text="Do NOT touch! — A." /></AbsoluteFill>],
];
export const KIT_TEST_FRAMES = items.reduce((a, [d]) => a + d, 0);
export const LorKitTest: React.FC = () => {
  let t = 0;
  return <AbsoluteFill style={{ backgroundColor: "#E9DCC0" }}>{items.map(([d, el], i) => { const from = t; t += d; return <Sequence key={i} from={from} durationInFrames={d}>{el}</Sequence>; })}</AbsoluteFill>;
};
