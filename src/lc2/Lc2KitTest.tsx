// Prueba del kit lc2: cada componente 100 cuadros sobre un cuadro clave real (stills de revisión, nunca render local).
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { Lc2Oven, Lc2Timer, Lc2Temp, Lc2Price, Lc2Plates, Lc2Ingredients, Lc2Opener, Lc2Hook7, Lc2Book } from "./Lc2Kit";
import { Lc2Shop, Lc2Week, Lc2Homework, Lc2Pans } from "./Lc2Kit2";

const K = (n: string) => `lc2/kf/${n}.png`;
const Bg: React.FC<{ src: string }> = ({ src }) => <AbsoluteFill><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
const DONE = ["done_lc2dump_1_lc2dump_c003", "done_lc2dump_2_lc2dump_c030", "done_lc2dump_3_lc2dump_c036", "done_lc2dump_4_lc2dump_c044", "done_lc2dump_5_lc2dump_c051", "done_lc2dump_6_lc2dump_c059", "done_lc2dump_7_lc2dump_c065"];
const NAMES = ["Chicken and Rice", "Salmon Packet", "Chicken Fajitas", "Hobo Packet", "Sausage and Potatoes", "Breakfast Casserole", "Parmesan Chicken"];

const S: [string | null, React.ReactNode][] = [
  [null, <Lc2Hook7 items={DONE.map((d, i) => ({ src: K(d), name: NAMES[i] }))} />],
  ["plate_counter_lc2dump_c007", <Lc2Opener n={1} title="Chicken and Rice, No Stirring" num={15} />],
  ["ing_lc2dump_1", <Lc2Ingredients title="Chicken and Rice" items={[{ t: "1/2 cup long-grain rice", at: 0.4 }, { t: "1 cup chicken broth", at: 0.9 }, { t: "1/4 cup cream of chicken", at: 1.4 }, { t: "2 chicken thighs", at: 1.9 }]} />],
  ["plate_oven_lc2dump_c006", <Lc2Oven temp={375} />],
  ["plate_oven_lc2dump_c006", <Lc2Timer min={55} max={60} note="foil off for the last 5" />],
  ["done_lc2dump_1_lc2dump_c020", <Lc2Temp temp={165} what="thickest part" />],
  ["done_lc2dump_1_lc2dump_c003", <Lc2Price price="$1.80" sub="a plate" vs="frozen dinner $3.50–$5" />],
  ["top_lc2dump_2_lc2dump_c025", <Lc2Plates n={2} />],
  [null, <Lc2Book cover="lc2/cover.png" qr="lc2/qr_lc2dump.png" site="lorettaschurch.com/one" />],
  [null, <Lc2Shop />],
  [null, <Lc2Week />],
  [null, <Lc2Homework names={NAMES} />],
  [null, <Lc2Pans items={[{ t: "A little loaf pan", sub: "about 8 x 4", shape: "loaf" }, { t: "Two 2-cup dishes", sub: "one to bake, one to freeze", shape: "dish" }]} title="All the pans you need" />],
];
export const LC2_KIT_FRAMES = S.length * 100;
export const Lc2KitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {S.map(([bg, c], i) => <Sequence key={i} from={i * 100} durationInFrames={100}>{bg ? <Bg src={K(bg)} /> : null}{c}</Sequence>)}
  </AbsoluteFill>
);
