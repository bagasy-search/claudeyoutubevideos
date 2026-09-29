// Entry de ahnight — Ancient Humans (piloto): "What Did Ancient Humans Actually Do All Night?"
import { registerRoot, Composition } from "remotion";
import React from "react";
import { AhMain, AhCard } from "./ah/AhMain";
import { PLAN } from "./ah/plans/ahnight";

const Root: React.FC = () => (
  <>
    <Composition id="AhNight" component={AhMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
    <Composition id="AhCard" component={AhCard} durationInFrames={300} fps={30} width={1920} height={1080}
      defaultProps={{ comp: "Words", props: { text: "test" }, lens: {} as Record<string, number> }}
      calculateMetadata={({ props }) => ({ durationInFrames: (props as any).dur ?? 300 })} />
  </>
);

registerRoot(Root);
