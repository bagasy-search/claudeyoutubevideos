import React from "react";
import { Composition, registerRoot } from "remotion";
import { M1, M1_END } from "./apex02/M1";
import { M2, M2_FRAMES } from "./apex02/M2";
import { M3, M3_FRAMES } from "./apex02/M3";
import { M4, M4_FRAMES } from "./apex02/M4";
import { M5, M5_FRAMES } from "./apex02/M5";
import { M6, M6_FRAMES } from "./apex02/M6";
import { M7, M7_FRAMES } from "./apex02/M7";
import { M8, M8_FRAMES } from "./apex02/M8";
import { M9, M9_FRAMES } from "./apex02/M9";
import { M10, M10_FRAMES } from "./apex02/M10";
import { M11, M11_FRAMES } from "./apex02/M11";
import { M12, M12_FRAMES } from "./apex02/M12";
import { M13, M13_FRAMES } from "./apex02/M13";
import { M14, M14_FRAMES } from "./apex02/M14";
import { M15, M15_FRAMES } from "./apex02/M15";
import { Full, FULL_FRAMES } from "./apex02/Full";
const C = { fps: 30, width: 1920, height: 1080, defaultProps: { farm: true } };
const Root = () => (
  <>
    <Composition id="AP2M1" component={M1} durationInFrames={Math.round(M1_END * 30)} {...C} />
    <Composition id="AP2M2" component={M2} durationInFrames={M2_FRAMES} {...C} />
    <Composition id="AP2M3" component={M3} durationInFrames={M3_FRAMES} {...C} />
    <Composition id="AP2M4" component={M4} durationInFrames={M4_FRAMES} {...C} />
    <Composition id="AP2M5" component={M5} durationInFrames={M5_FRAMES} {...C} />
    <Composition id="AP2M6" component={M6} durationInFrames={M6_FRAMES} {...C} />
    <Composition id="AP2M7" component={M7} durationInFrames={M7_FRAMES} {...C} />
    <Composition id="AP2M8" component={M8} durationInFrames={M8_FRAMES} {...C} />
    <Composition id="AP2M9" component={M9} durationInFrames={M9_FRAMES} {...C} />
    <Composition id="AP2M10" component={M10} durationInFrames={M10_FRAMES} {...C} />
    <Composition id="AP2M11" component={M11} durationInFrames={M11_FRAMES} {...C} />
    <Composition id="AP2M12" component={M12} durationInFrames={M12_FRAMES} {...C} />
    <Composition id="AP2M13" component={M13} durationInFrames={M13_FRAMES} {...C} />
    <Composition id="AP2M14" component={M14} durationInFrames={M14_FRAMES} {...C} />
    <Composition id="AP2M15" component={M15} durationInFrames={M15_FRAMES} {...C} />
    <Composition id="AP2FULL" component={Full} durationInFrames={FULL_FRAMES} {...C} />
  </>
);
registerRoot(Root);
