import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, TOTAL_S } from "./emptymap01/Main";
const Root = () => <Composition id="EmptyMap01" component={Main} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} defaultProps={{}} />;
registerRoot(Root);
