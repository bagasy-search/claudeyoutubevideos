// Entry de tz-b (Tenzo Films tz03 + tz04). La prueba de sets y, después, las comps de los dos videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { TzbPrueba, TZB_PRUEBA_DUR } from "./tenzo/tzb_prueba";

const Root = () => (
  <>
    <Composition id="TzbPrueba" component={TzbPrueba} durationInFrames={TZB_PRUEBA_DUR} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
