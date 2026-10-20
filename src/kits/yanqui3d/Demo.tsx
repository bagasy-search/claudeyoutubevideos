// ykit · demo mínimo (con la voz/avatar/tomas de gary01): molde para arrancar el video de cada yanqui.
// Copiar a src/<slug>/Video.tsx, cambiar setSlug, los json y escribir beats/pieces frase por frase con at().
import React from "react";
import { AbsoluteFill } from "remotion";
import { setSlug, COL } from "./lib";
import { makeVideo, Stamp } from "./engine";
import { StepTitle, Words } from "./pieces";
import CAPS from "../../gary01/caps.json";
import AVW from "../../gary01/avwin.json";
import AVAIL from "../../gary01/rest_avail.json";

setSlug("gary01");

export const demo = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL, T0: 70.2, TEND: 100,
  beats: ({ AV, CL }) => [
    AV(82.79, "cut", { spans: [[82.79, 86.6]], edge: true }),
    CL(86.93, "s01", "portal", [960, 300], [1.04, 1.14]),
    AV(98.33, "whip"),
  ],
  pieces: (t, { at }) => [
    <StepTitle key="st" t={t} at={84} n={1} name="THE DEMO" out={86.5} col={COL.ice} />,
    <Words key="w" t={t} items={[{ at: at("warm", 86), txt: "WARM AIR", col: COL.amber }]} out={92} />,
    <Stamp key="sp" t={t} at={95} text="KIT OK" x={960} y={540} out={97.5} />,
  ],
});
export const Demo: React.FC = () => <AbsoluteFill><demo.Body /></AbsoluteFill>;
