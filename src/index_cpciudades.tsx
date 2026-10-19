import React from "react";
import { Composition, registerRoot } from "remotion";
import { Doc, DOC_FRAMES } from "./cpciudades/Doc";
import { Test } from "./cpciudades/Test";
const Root = () => (
  <>
    <Composition id="CPCFULL" component={Doc} durationInFrames={DOC_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="CPCPREV" component={Doc} durationInFrames={DOC_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: false }} />
    <Composition id="CPCTEST" component={Test as any} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ n: "Clock", p: { h: 11, m: 43 } }} />
  </>
);
registerRoot(Root);
