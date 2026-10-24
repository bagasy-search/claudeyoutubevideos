import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, END } from "./skhpapers/Main";
// el video entero en un solo reloj: los segundos son los de la locución (public/skhpaperscut.wav)
const Root = () => <Composition id="Skhpapers" component={Main} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
