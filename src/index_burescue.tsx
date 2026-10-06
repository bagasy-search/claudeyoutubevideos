// Entry de burescue — Before Us #3: "Did Humans Save Each Other from Predators?"
import { registerRoot, Composition } from "remotion";
import React from "react";
import { AhMain, AhCard } from "./ah/AhMain";
import { PLAN } from "./ah/plans/burescue";

const Root: React.FC = () => (
  <>
    <Composition id="BuRescue" component={AhMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
    <Composition id="AhCard" component={AhCard} durationInFrames={300} fps={30} width={1920} height={1080}
      defaultProps={{ comp: "Words", props: { text: "test" }, lens: {} as Record<string, number> }}
      calculateMetadata={({ props }) => ({ durationInFrames: (props as any).dur ?? 300 })} />
  </>
);

registerRoot(Root);
