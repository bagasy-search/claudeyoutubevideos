// enhr01 · muestrario de las piezas de Rosa con los textos más largos del plan (sólo stills de QC; no va al video)
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Libreta, Reloj, Tarjeta, Linea, Cinco, Numero } from "./rosa";
import { Mapa, Dicho, Lugar, Cuenta } from "./funerario";

export const MuestraRosa: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{ background: "#14110f" }}>
      <Img src={staticFile("enhr01/av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
      <Reloj t={t} at={0} out={5} h={2} m={0} label="2:00 A.M." sub="THE PHONE ALWAYS RINGS AT THIS HOUR" />
      <Numero t={t} at={6} out={10} n="7" title="They reach for people you can't see" sub="the corner of the room, the doorway, the ceiling" />
      <Tarjeta t={t} at={11} out={15} kicker="ON THE FRIDGE" title="Hospice nurse line · 24/7" dato="Call before 911" mano="even at 3 in the morning, mija" />
      <Libreta t={t} at={16} out={22} title="Rosa's notebook" rows={[{ at: 16.3, tx: "1 · Sleeping more", ok: 18 }, { at: 16.6, tx: "2 · Eating less, then nothing", ok: 18.4 }, { at: 16.9, tx: "3 · Talking about a trip", tacha: 19 }, { at: 17.2, tx: "4 · Reaching for people you can't see" }, { at: 17.5, tx: "5 · The surge of energy" }]} />
      <Linea t={t} at={23} out={29} title="NEARING DEATH" stages={[{ at: 23.4, tx: "Weeks", sub: "sleep, appetite" }, { at: 24.4, tx: "Days", sub: "visions, restlessness" }, { at: 25.4, tx: "Hours", sub: "breathing changes" }]} />
      <Cinco t={t} at={30} out={36} title="THE FIVE THINGS" items={[{ at: 30.3, tx: "I forgive you" }, { at: 30.8, tx: "Forgive me" }, { at: 31.3, tx: "Thank you" }, { at: 31.8, tx: "I love you" }, { at: 32.3, tx: "Goodbye" }]} />
      <Mapa t={t} at={37} out={42} city="sa" pins={[{ at: 37.5, l: "prospect" }, { at: 38, l: "medcenter" }]} route={{ at: 38.6, from: "prospect", to: "medcenter" }} />
      <Dicho t={t} at={43} out={47} text="Nobody should have to say goodbye in a hurry, honey. Not the one leaving, not the ones staying." who="Rosa's mother" />
      <Lugar t={t} at={48} out={52} tx="Our Lady of Guadalupe, El Paso Street" sub="SAN ANTONIO · WEST SIDE · 1994" />
      <Cuenta t={t} at={53} out={57} to={3000} pre="" suf="+" sub="BEDSIDES I'VE SAT AT" />
    </AbsoluteFill>
  );
};
