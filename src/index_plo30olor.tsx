import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, END } from "./plo30olor/Main";
// el video entero: un solo reloj global
const Root = () => <Composition id="Full" component={Main} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
