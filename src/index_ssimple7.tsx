import React from "react";
import { Composition, registerRoot } from "remotion";
import { Rest, END } from "./ssimple7/Rest";
// el video entero en un solo componente (mismo reloj que la locución)
const Root = () => <Composition id="Ssimple7" component={Rest} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
