// fhoct · heroes (§5b): capas de fotos reales, notas de papel, marcas rojas, cámara lenta; cada beat en su palabra (words.json)
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, Print, Chip, Mark, Grade, Grain, sp, cl, ez, img, C, HAND, LABEL, shadowTxt, camAt, camStyle, P, useT, Cam } from "../lkit/core";

// Nota de papel crema que cae en su palabra
const Note: React.FC<{ f: number; at: number; x: number; y: number; rot: number; txt: string }> = ({ f, at, x, y, rot, txt }) => {
  const u = sp(f, at, 12, 140);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: cl(u * 1.6), transform: `translateY(${(1 - u) * -60}px) rotate(${rot}deg)` }}>
      <div style={{ background: "#F3E7CC", padding: "18px 34px 22px", boxShadow: "0 22px 44px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: 74, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  );
};

// 40.4-49.2 s: "take away the food" (40.89) y "make them want to leave" (42.41) caen en su palabra
export const ThreeIdeas: P<{ bed: string; t1: number; t2: number }> = ({ a, d, bed, t1, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.45} blur={3} />
      <Note f={f} at={at(t1)} x={170} y={300} rot={-2} txt="TAKE AWAY THE FOOD" />
      <Note f={f} at={at(t2)} x={560} y={560} rot={1.5} txt="MAKE THEM WANT TO LEAVE" />
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 57.1-68 s: la harina de la bolsa con el grumo de telaraña: círculo rojo y nota "THE EGGS RIDE IN"
export const FlourSack: P<{ bed: string; circ: number; note: number }> = ({ a, d, bed, circ, note }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.0)" }}>
        <Img src={img("h_flour_macro")} style={{ position: "absolute", left: 480, top: 170, width: 960, height: 540, objectFit: "cover", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
        <Mark kind="circle" x={700} y={330} w={260} h={170} f={f} at={at(circ)} dur={10} sw={10} />
      </AbsoluteFill>
      <Note f={f} at={at(note)} x={130} y={680} rot={-1.5} txt="THE EGGS RIDE IN" />
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 256-266 s: el edredón al tendedero: cada agujero se marca (círculos), luego la nota del cedro
export const WoolSun: P<{ bed: string; holes: number[]; note: number }> = ({ a, d, bed, holes, note }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <Img src={img("h_blanket_line")} style={{ position: "absolute", left: 300, top: 150, width: 1320, height: 742, objectFit: "cover", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
      {holes.map((h, i) => <Mark key={i} kind="circle" x={520 + i * 220} y={470} w={120} h={90} f={f} at={at(h)} dur={6} sw={8} />)}
      <Note f={f} at={at(note)} x={130} y={760} rot={-2} txt="AIR IT IN THE SUN" />
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 424.5-448.9 s: la pared de afuera a nivel del suelo; "foam" tachado, moneda al hueco, "steel wool" y "caulk"
export const DimeWalk: P<{ bed: string; foam: number; dime: number; wool: number; caulk: number }> = ({ a, d, bed, foam, dime, wool, caulk }) => {
  const { f, at } = useT(a);
  const K: Cam[] = [{ t: a, s: 1.25, x: 960, y: 620 }, { t: dime - 1, s: 1.6, x: 1000, y: 700 }];
  const c = camAt(f, at, K, 1.3);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={camStyle(c)}>
        <Bed k={bed} f={f} T={d} dim={0.2} z={[1, 1]} blur={0} />
      </AbsoluteFill>
      <Img src={img("h_dime_gap")} style={{ position: "absolute", left: 1240, top: 560, width: 420, height: 300, objectFit: "cover", boxShadow: "0 24px 50px rgba(0,0,0,0.5)" }} />
      <Mark kind="circle" x={1290} y={650} w={260} h={170} f={f} at={at(dime)} dur={10} sw={9} />
      <Mark kind="strike" x={120} y={560} w={600} h={140} f={f} at={at(foam)} dur={8} sw={12} />
      <Note f={f} at={at(foam)} x={120} y={300} rot={-2} txt="THEY CHEW RIGHT THROUGH" />
      <Note f={f} at={at(wool)} x={120} y={520} rot={1.5} txt="STEEL WOOL" />
      <Note f={f} at={at(caulk)} x={120} y={740} rot={-1} txt="CAULK ON TOP" />
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 506-520 s: escalera del sótano con las cajas; la nota de las bolsas tras la nevera con su tachado
export const BoxesPorch: P<{ bed: string; bags: number; strike: number; note: number }> = ({ a, d, bed, bags, strike, note }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <Img src={img("h_bags_fridge")} style={{ position: "absolute", left: 420, top: 140, width: 1080, height: 608, objectFit: "cover", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
      <Mark kind="strike" x={470} y={300} w={980} h={160} f={f} at={at(strike)} dur={8} sw={12} />
      <Note f={f} at={at(bags)} x={130} y={760} rot={-1.5} txt="A ROACH APARTMENT BUILDING" />
      <Chip txt="BOX BROKEN DOWN · STRAIGHT OUT" size={40} bg={C.red} color="#fff" rot={-1} />
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 742.6-751.3 s: la lista de la página 42 sobre la mesa de la cocina, marcas en "sinks" y "stove"; chip "PAGE 42"
export const OctoberWalk: P<{ bed: string; page: string; sinks: number; stove: number }> = ({ a, d, bed, page, sinks, stove }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <Img src={img(page)} style={{ position: "absolute", left: 560, top: 60, width: 760, height: 960, objectFit: "contain", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
      <Mark kind="circle" x={600} y={720} w={260} h={70} f={f} at={at(sinks)} dur={6} sw={8} />
      <Mark kind="circle" x={600} y={820} w={260} h={70} f={f} at={at(stove)} dur={6} sw={8} />
      <Chip txt="PAGE 42 · ONE OCTOBER AFTERNOON" size={44} bg="#FFFDF4" color={C.ink} rot={-1} />
      <Grade warm={1.1} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};
