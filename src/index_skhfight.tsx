import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, END } from "./skhfight/Main";
// el video entero (29:36): un solo hilo avatar ⇄ casa de Osaka, reloj = segundos de la locución
const Root = () => <Composition id="Skhfight" component={Main} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
