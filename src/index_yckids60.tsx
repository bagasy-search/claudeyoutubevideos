// Entry de yckids60 — Yesterday's Classroom #1 "20 Things 1960s Kids Could Do That Students Can't Today".
import { registerRoot, Composition } from "remotion";
import React from "react";
import { YcMain, YcCard } from "./yc/YcMain";
import { PLAN_YCKIDS60 } from "./yc/plans/yckids60";

const Root: React.FC = () => (
  <>
    <Composition id="YcKids60" component={YcMain} durationInFrames={PLAN_YCKIDS60.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN_YCKIDS60 }} />
    {/* una tarjeta sola, para pre-renderizar local con GPU las escenas 3D pesadas */}
    <Composition id="YcCard" component={YcCard} durationInFrames={300} fps={30} width={1920} height={1080}
      defaultProps={{ comp: "Kinetic", props: { text: "test" }, lens: {} as Record<string, number> }}
      calculateMetadata={({ props }) => ({ durationInFrames: (props as any).dur ?? 300 })} />
  </>
);

registerRoot(Root);
