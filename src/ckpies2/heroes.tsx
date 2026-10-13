import React from "react";
import { AbsoluteFill } from "remotion";
import { Bed, Print, Chip, Mark, FullPhoto, Grade, Grain, useT, cl, ez, HAND, LABEL, C, P } from "../lkit/core";

// 40,8-49,1 s · FrostNight: primer frío sobre el tomate verde. Círculo en el tomate al entrar la frase.
export const FrostNight: P<{ circ: number; bed: string; chip: string }> = ({ a, d, circ, bed, chip }) => {
  const { f, at } = useT(a);
  const push = 1 + 0.06 * ez(f / (d * 30));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0c0d10" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "40% 45%" }}>
        <FullPhoto k={bed} f={f} d={d} dim={0.18} />
      </AbsoluteFill>
      <Mark kind="circle" x={700} y={500} w={360} h={220} f={f} at={at(circ)} dur={10} sw={10} />
      <Chip txt={chip} size={64} />
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// 642,5-649,1 s · WarmDish: fuente tapada con paño y la mesa fría al lado.
export const WarmDish: P<{ bed: string; chip: string }> = ({ a, d, bed, chip }) => {
  const { f } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0c0d10" }}>
      <FullPhoto k={bed} f={f} d={d} dim={0.12} />
      <Chip txt={chip} size={60} />
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// 288,6-297,5 s · ReadBook: el cuaderno abierto de la cocina con la página 12 como impresión.
export const ReadBook: P<{ bed: string; page: string; chip: string; under: number }> = ({ a, d, bed, page, chip, under }) => {
  const { f, at } = useT(a);
  const pin = ez(f / 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0c0d10" }}>
      <FullPhoto k={bed} f={f} d={d} dim={0.35} />
      <div style={{ position: "absolute", left: 1040, top: 150, opacity: pin, transform: `rotate(-3deg) translateY(${(1 - pin) * 30}px)` }}>
        <Print k={page} w={520} h={680} f={f} />
      </div>
      <Mark kind="under" x={1120} y={690} w={360} h={34} f={f} at={at(under)} dur={6} sw={8} />
      <Chip txt={chip} size={54} />
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// 10,2-17,7 s · HeldBack: la cocina del sótano y una nota de Danny que cae encima.
export const HeldBack: P<{ bed: string; note: string; noteAt: number }> = ({ a, d, bed, note, noteAt }) => {
  const { f, at } = useT(a);
  const drop = ez((f - at(noteAt)) / 18);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0c0d10" }}>
      <FullPhoto k={bed} f={f} d={d} dim={0.2} />
      <div style={{ position: "absolute", left: 110, top: 96, opacity: drop, transform: `translateY(${(1 - drop) * -24}px) rotate(-2deg)` }}>
        <div style={{ background: C.paper, padding: "22px 40px 26px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: 78, color: C.ink, lineHeight: 1.05 }}>{note}</div>
      </div>
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};
