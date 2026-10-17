import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, TOTAL } from "./deeptime01/Main";
const Root: React.FC = () => <Composition id="DeepTime01" component={Main} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />;
registerRoot(Root);
