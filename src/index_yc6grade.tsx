// Entry de yc6grade — Yesterday's Classroom #2 "25 Questions Every 1960s 6th Grader Had to Answer — Can You Pass?".
import { registerRoot, Composition } from "remotion";
import React from "react";
import { YcMain, YcCard } from "./yc/YcMain";
import { PLAN } from "./yc/plans/yc6grade";

const Root: React.FC = () => (
  <>
    <Composition id="Yc6Grade" component={YcMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
    <Composition id="YcCard" component={YcCard} durationInFrames={300} fps={30} width={1920} height={1080}
      defaultProps={{ comp: "Kinetic", props: { text: "test" }, lens: {} as Record<string, number> }}
      calculateMetadata={({ props }) => ({ durationInFrames: (props as any).dur ?? 300 })} />
  </>
);

registerRoot(Root);
