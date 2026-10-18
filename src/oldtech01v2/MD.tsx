// oldtech01v2 · BLOQUE D (938,36–1061,30 s, línea de 20 min) — el horno más grande de Roma: Caracalla (AD 216), el caldarium
// de 35 m, Diocleciano y la iglesia de Miguel Ángel, los túneles de servicio y el mitreo, la leña, el ramal del acueducto,
// la cadena de abastecimiento y cómo se quiebra en el imperio tardío. Desemboca en M9 ("why did castles freeze?").
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Place, ThermalDefs, Embers, BigWord, Letterbox } from "./comps";
import { Term } from "./comps2";
import { EmberForm } from "./comps3";
import { SupplyChain, SpanMark } from "./comps4";

export const OFFD = 938.359;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/", F = "oldtech01v2/foto/";
type SD = Shot & { k?: string };
const ABS: SD[] = [
  { a: 938.359, b: 941.6, img: F + "64cd8995.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 941.6, b: 944.3, v: R + "r4840529", from: 2, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 944.3, b: 946.6, comp: "romemap", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.45 } },
  { a: 946.6, b: 948.9, img: F + "ec055b05.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.5, 0.45], out: { type: "whip", vx: 1 } },
  { a: 948.9, b: 952.2, img: F + "b68daddc.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "dissolve", d: 0.35 } },
  { a: 952.2, b: 955.3, img: F + "df67a481.jpg", cam: [1.2, 0.5, 0.5, 1.04, 0.5, 0.5], out: { type: "dissolve", d: 0.35 } },
  { a: 955.3, b: 959.0, img: F + "0471ecf0.jpg", grade: "brightness(.45) saturate(.8)", k: "plan", out: { type: "white", d: 0.4 } },
  { a: 959.0, b: 962.4, img: F + "5c67109b.jpg", cam: [1.05, 0.5, 0.6, 1.22, 0.5, 0.4], out: { type: "dissolve", d: 0.35 } },
  { a: 962.4, b: 966.1, img: F + "ce0f756b.jpg", cam: [1.0, 0.5, 0.5, 1.08, 0.5, 0.5], grade: "brightness(.8) contrast(1.06)", k: "span", out: { type: "flash" } },
  { a: 966.1, b: 968.7, img: F + "47a27711.jpg", out: { type: "dissolve", d: 0.35 } },
  { a: 968.7, b: 971.5, img: F + "4862c8ee.jpg", cam: [1.05, 0.5, 0.4, 1.2, 0.5, 0.3], out: { type: "dissolve", d: 0.4 } },
  { a: 971.5, b: 976.24, img: F + "e51c90b1.jpg", out: { type: "white", d: 0.4 } },
  { a: 976.24, b: 979.0, img: F + "fcff48d1.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 979.0, b: 982.2, img: F + "b5de8fea.jpg", cam: [1.2, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "whip", vx: -1 } },
  { a: 982.2, b: 984.7, img: F + "5424ab22.jpg", cam: [1.0, 0.5, 0.6, 1.2, 0.5, 0.35], out: { type: "dissolve", d: 0.35 } },
  { a: 984.7, b: 986.74, img: F + "8f649ffb.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.3], out: { type: "zoom", fx: 0.5, fy: 0.8 } },
  { a: 986.74, b: 990.02, v: R + "r5416362", from: 1, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 990.02, b: 993.4, img: F + "e3b08b4a.jpg", cam: [1.05, 0.5, 0.5, 1.22, 0.5, 0.55], out: { type: "whip", vx: 1 } },
  { a: 993.4, b: 996.4, v: R + "r1121487", from: 2, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 996.4, b: 999.6, v: T + "xd03_tunnel", from: 9.3, rate: 0.625, out: { type: "sweep", d: 0.5 } },
  { a: 999.6, b: 1002.4, img: F + "6bf8e257.jpg", cam: [1.05, 0.5, 0.5, 1.22, 0.5, 0.6], out: { type: "zoom", fx: 0.5, fy: 0.85 } },
  { a: 1002.4, b: 1005.6, v: T + "xd03_tunnel", from: 0.2, out: { type: "dissolve", d: 0.4 } },
  { a: 1005.6, b: 1009.9, img: F + "05ae6471.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.45], out: { type: "flash" } },
  { a: 1009.9, b: 1012.6, v: R + "r3635867", from: 1, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 1012.6, b: 1015.6, v: R + "r5664875", from: 1, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 1015.6, b: 1018.2, v: R + "r5378907", from: 1, rate: 1, out: { type: "whip", vx: -1 } },
  { a: 1018.2, b: 1021.3, v: R + "r3700348", from: 2, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 1021.3, b: 1023.8, v: R + "r15421502", from: 0, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 1023.8, b: 1026.4, v: R + "r10718768", from: 1, rate: 1, out: { type: "sweep", d: 0.5 } },
  { a: 1026.4, b: 1028.02, v: R + "r5912469", from: 2, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 1028.02, b: 1033.2, img: F + "d8e6a93a.jpg", cam: [1.02, 0.5, 0.5, 1.2, 0.45, 0.45], out: { type: "dissolve", d: 0.4 } },
  { a: 1033.2, b: 1041.6, comp: "chain", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 1041.6, b: 1044.6, v: R + "r6520518", from: 1, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 1044.6, b: 1046.7, img: F + "3eebb0d5.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 1046.7, b: 1049.0, v: R + "r6577549", from: 2, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 1049.0, b: 1053.5, img: F + "a8bf234c.jpg", cam: [1.05, 0.5, 0.6, 1.25, 0.5, 0.7], out: { type: "dissolve", d: 0.4 } },
  { a: 1053.5, b: 1056.2, img: F + "9af53916.jpg", cam: [1.2, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "white", d: 0.4 } },
  { a: 1056.2, b: 1061.3, comp: "broken", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5] },
];
export const SHOTSD: SD[] = ABS.map((s) => ({ ...s, a: s.a - OFFD, b: s.b - OFFD }));
export const MD_FRAMES = Math.round((1061.3 - OFFD) * FPS);

const CHAIN = (L: (x: number) => number) => [
  { at: L(1033.4), text: "FORESTS" }, { at: L(1034.3), text: "CARTS" }, { at: L(1035.1), text: "BOATS" },
  { at: L(1035.9), text: "AQUEDUCTS" }, { at: L(1037.2), text: "KILNS" }, { at: L(1038.4), text: "WORKERS" },
];

export const MD: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFFD;
  const L = (x: number) => x - OFFD;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "romemap": return <ClayMap t0={L(944.1)} keys={[
        { at: 0, pos: [4.5, 12, 18], look: [3.98, 0, 9.24], fov: 34 }, { at: 2.6, pos: [4.2, 4.2, 12.8], look: [3.98, 0.6, 9.24], fov: 34 },
      ]} pins={[{ at: 0.3, out: 2.4, lon: 12.49, lat: 41.88, label: "ROME", sub: "the Baths of Caracalla · AD 216", ring: true }]} />;
      case "chain": return <SupplyChain t={t} a={L(1027.9)} b={L(1041.7)} title="A SUPPLY CHAIN" items={CHAIN(L)} />;
      case "broken": return <SupplyChain t={t} a={L(1056.0)} b={L(1061.4)} title="ONLY AS STRONG AS THE EMPIRE" items={CHAIN(L).map((x) => ({ ...x, at: L(1056.1) }))} breakAt={L(1057.4)} />;
    }
    return null;
  };
  const cur = SHOTSD.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTSD.map((s, i) => <ShotLayer key={i} S={SHOTSD} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        {cur?.v === T + "xd03_tunnel" && <Embers t={t} n={40} op={0.6} />}
        <Place t={ta} a={938.6} b={944.2} text="ITS LARGEST FORM" />
        <EmberForm t={ta} a={946.7} b={948.8} text="AD 216" kicker="THE BATHS OF CARACALLA" />
        <Place t={ta} a={949.1} b={955.2} text="MORE THAN TWO HECTARES" sub="gardens · libraries · running tracks" />
        {cur?.k === "plan" && <BigWord t={ta} a={955.4} b={958.9} text="20,000+ m²" sub="THE MAIN BUILDING ALONE" />}
        <Term t={ta} a={959.2} b={962.3} words={[{ la: "CALDARIUM", en: "THE HOT ROOM", at: 960.2 }]} y={150} />
        {cur?.k === "span" && <SpanMark t={ta} a={962.5} b={966.0} x1={300} x2={1620} y={300} label="≈ 35 m" sub="A ROUND HALL CROWNED BY A DOME" />}
        <Place t={ta} a={968.9} b={971.4} text="THE SUN ADDED ITS HEAT" sub="tall windows facing the afternoon" />
        <EmberForm t={ta} a={971.8} b={976.1} text="1,600" kicker="BATHERS AT ONCE" unit="it is often said" />
        <Place t={ta} a={976.5} b={982.1} text="THE BATHS OF DIOCLETIAN" sub="less than a century later · larger still" />
        <Place t={ta} a={982.4} b={986.6} text="NOW A CHURCH" sub="Santa Maria degli Angeli · designed by Michelangelo" />
        <BigWord t={ta} a={987.0} b={989.9} text="UNDERGROUND" />
        <Place t={ta} a={990.3} b={996.3} text="SERVICE TUNNELS" sub="wide enough for carts" />
        <Place t={ta} a={996.6} b={999.5} text="FIREWOOD IN · ASH OUT" />
        <Place t={ta} a={999.8} b={1002.3} text="THE BATHERS NEVER SAW IT" />
        <Term t={ta} a={1003.0} b={1009.8} words={[{ la: "MITHRAEUM", en: "THE LARGEST EVER FOUND IN ROME", at: 1005.8 }]} y={150} />
        <Place t={ta} a={1010.1} b={1012.5} text="BY THE CARTLOAD" sub="every day" />
        <Place t={ta} a={1012.8} b={1018.1} text="CUT · DRIED · SHIPPED · HAULED" />
        <Place t={ta} a={1018.4} b={1021.2} text="DAY AFTER DAY" sub="year after year" />
        <Place t={ta} a={1021.6} b={1026.3} text="AQUA ANTONINIANA" sub="a branch built just to fill the pools" />
        <Place t={ta} a={1041.9} b={1046.6} text="THE STRAIN IN THE RUINS" sub="the later empire" />
        <Place t={ta} a={1046.9} b={1049.0} text="MADE SMALLER · WALLED OFF" />
        <Place t={ta} a={1049.2} b={1053.4} text="FURNACES LEFT COLD" sub="floors filled with rubble" />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
