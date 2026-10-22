import React from "react";
import { Composition, registerRoot } from "remotion";
import { Rest, END_T } from "./chayotort/Rest";
const Root = () => <Composition id="Full" component={Rest} durationInFrames={Math.round(END_T * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
