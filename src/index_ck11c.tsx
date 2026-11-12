import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCk11c, TOTAL_CK11C } from "./ck11c/Main";

const Root: React.FC = () => (
  <Composition id="Ck11c" component={MainCk11c} durationInFrames={TOTAL_CK11C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
