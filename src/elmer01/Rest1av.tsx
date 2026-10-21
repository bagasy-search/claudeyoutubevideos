// elmer01 · piezas ENCIMA del avatar (tramo 1). Siempre a la izquierda (Elmer ocupa el centro-derecha del cuadro), nunca sobre la cara.
import React from "react";
import { at } from "./core";
import { COL, FONT, e, spr } from "./lib";
import { BigWord, PriceRip, Tally } from "./Rest1";

// tabla quemada colgada de dos piolines (cartel del taller) que se balancea al entrar
export const Plank: React.FC<{ t: number; at: number; out: number; big: string; sub?: string; col?: string; x?: number; y?: number; w?: number }> = ({ t, at, out, big, sub, col = COL.ink, x = 70, y = 120, w = 560 }) => {
  const k = spr(t, at, 1.0), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const sw = Math.sin((t - at) * 5) * 7 * Math.exp(-(t - at) * 2.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, transformOrigin: "50% -120px", transform: `translateY(${(1 - Math.min(1, k)) * -320}px) rotate(${sw}deg)` }}>
      <svg width={w} height={120} style={{ position: "absolute", top: -120, left: 0 }}><line x1={60} y1={0} x2={70} y2={120} stroke="#d8cdb6" strokeWidth={4} /><line x1={w - 60} y1={0} x2={w - 70} y2={120} stroke="#d8cdb6" strokeWidth={4} /></svg>
      <div style={{ padding: "22px 30px 26px", borderRadius: 12, backgroundImage: "repeating-linear-gradient(90deg, rgba(70,40,15,.18) 0 2px, transparent 2px 23px), linear-gradient(180deg,#c99a63,#9c6f3f)", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 0 4px rgba(60,35,12,.4)", fontFamily: FONT, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 70, lineHeight: 1.02, color: "#24140a", textShadow: "0 2px 0 rgba(255,220,170,.35)" }}>{big}</div>
        {sub && <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4, color: col === COL.ink ? "#4a2a10" : col === COL.red ? "#8a1a10" : col, marginTop: 8 }}>{sub}</div>}
      </div>
    </div>
  );
};

const A = {
  tool: at("every tool", 62), fine: at("fine", 84), need: at("don't need them", 86), heat: at("heat treated", 100), bugs: at("kill the bugs", 101),
  sitting: at("sitting on it", 115), heavy: at("heavy ones", 117), deck: at("deck boards sit", 132), wantS: at("you want the stringers", 146),
  next: at("the next one splits", 163), junk: at("junk", 165), notJunk: at("it's not junk", 166), ring: at("ring shank", 168),
  slide: at("slide it", 178), cut: at("cut the nails", 181), b21: at("21", 197), nine: at("nine stringers", 198), nothing: at("cost me nothing", 201),
  second: at("second pile", 216), shelf: at("the shelf", 218), b40: at("$40", 232), magnet: at("run a magnet", 235), teeth: at("lose teeth", 246), eye: at("your eye", 248),
};
export const AV1: Record<number, (t: number) => React.ReactNode> = {
  62: (t) => <Plank t={t} at={A.tool - 0.1} out={65.3} big="EVERY TOOL" sub="NOTHING FANCY" />,
  84: (t) => <Plank t={t} at={A.need - 0.15} out={87.1} big="DON'T NEED THEM" sub="TABLE SAW · PLANER · ROUTER" col={COL.red} />,
  97: (t) => <Plank t={t} at={A.heat - 0.1} out={100.9} big="HT = HEAT TREATED" sub="BAKED · NO BUGS" col="#1a7a4c" />,
  115: (t) => <Plank t={t} at={A.heavy - 0.1} out={118.5} big="HEAVY = OAK" sub="THE ONE THAT FIGHTS YOU" />,
  130: (t) => <Plank t={t} at={A.deck - 0.2} out={133.4} big="LOOK UNDERNEATH" sub="COUNT THE STRINGERS" />,
  147: (t) => <Plank t={t} at={A.wantS} out={150.2} big="STRINGERS ✓" sub="FRAME · LEG · CLEAT" col="#1a7a4c" />,
  163: (t) => <BigWord t={t} at={A.junk} out={167.8} txt="JUNK?" x={330} y={330} col={COL.ink} size={170} strike={A.notJunk} />,
  179: (t) => <Plank t={t} at={A.slide} out={183.0} big="CUT THE NAILS" sub="DON'T PULL THEM" col={COL.red} />,
  196: (t) => <Tally t={t} at={A.b21 - 0.5} at2={A.nine - 0.2} out={201.1} x={70} y={80} />,
  214: (t) => <Plank t={t} at={A.shelf - 0.3} out={217.6} big="2 · SHELF" sub="NAIL HOLES · A LITTLE BOW" />,
  230: (t) => <PriceRip t={t} at={A.b40 - 0.1} out={233.7} x={330} y={330} txt="$40" />,
  245: (t) => <Plank t={t} at={A.teeth - 0.1} out={249.1} big="SAFETY GLASSES" sub="A CHIP IN YOUR EYE" col={COL.red} />,
};
