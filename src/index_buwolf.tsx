// Entry de buwolf — Before Us #4: "How the First Wolf Became a Dog"
import { registerRoot, Composition } from "remotion";
import React from "react";
import { AhMain, AhCard } from "./ah/AhMain";
import { PLAN } from "./ah/plans/buwolf";

const Root: React.FC = () => (
  <>
    <Composition id="BuWolf" component={AhMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
    <Composition id="AhCard" component={AhCard} durationInFrames={300} fps={30} width={1920} height={1080}
      defaultProps={{ comp: "Words", props: { text: "test" }, lens: {} as Record<string, number> }}
      calculateMetadata={({ props }) => ({ durationInFrames: (props as any).dur ?? 300 })} />
  </>
);

registerRoot(Root);
