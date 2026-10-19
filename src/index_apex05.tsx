import React from "react";
import { Composition, registerRoot } from "remotion";
import { M1, M1_FRAMES } from "./apex05/M1";
import { M2, M2_FRAMES } from "./apex05/M2";
import { M3, M3_FRAMES } from "./apex05/M3";
import { M4, M4_FRAMES } from "./apex05/M4";
import { M5, M5_FRAMES } from "./apex05/M5";
import { M6, M6_FRAMES } from "./apex05/M6";
import { M7, M7_FRAMES } from "./apex05/M7";
import { M8, M8_FRAMES } from "./apex05/M8";
import { M9, M9_FRAMES } from "./apex05/M9";
import { M10, M10_FRAMES } from "./apex05/M10";
import { M11, M11_FRAMES } from "./apex05/M11";
import { M12, M12_FRAMES } from "./apex05/M12";
import { M13, M13_FRAMES } from "./apex05/M13";
import { M14, M14_FRAMES } from "./apex05/M14";
import { M15, M15_FRAMES } from "./apex05/M15";
import { Full, FULL_FRAMES } from "./apex05/Full";
const Root = () => (
  <>
    <Composition id="AP5M1" component={M1} durationInFrames={M1_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M2" component={M2} durationInFrames={M2_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M3" component={M3} durationInFrames={M3_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M4" component={M4} durationInFrames={M4_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M5" component={M5} durationInFrames={M5_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M6" component={M6} durationInFrames={M6_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M7" component={M7} durationInFrames={M7_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M8" component={M8} durationInFrames={M8_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M9" component={M9} durationInFrames={M9_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M10" component={M10} durationInFrames={M10_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M11" component={M11} durationInFrames={M11_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M12" component={M12} durationInFrames={M12_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M13" component={M13} durationInFrames={M13_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M14" component={M14} durationInFrames={M14_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5M15" component={M15} durationInFrames={M15_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="AP5FULL" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
  </>
);
registerRoot(Root);
