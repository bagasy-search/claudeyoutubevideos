// Entry de hankurch — Hank Out Back #3 (la guerra de los erizos de California).
import { registerRoot, Composition } from "remotion";
import React from "react";
import { YcMain, YcCard } from "./yc/YcMain";
import { PLAN } from "./yc/plans/hankurch";

const Root: React.FC = () => (
  <>
    <Composition id="HankUrch" component={YcMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
    <Composition id="YcCard" component={YcCard} durationInFrames={300} fps={30} width={1920} height={1080}
      defaultProps={{ comp: "Kinetic", props: { text: "test" }, lens: {} as Record<string, number> }}
      calculateMetadata={({ props }) => ({ durationInFrames: (props as any).dur ?? 300 })} />
  </>
);

registerRoot(Root);
