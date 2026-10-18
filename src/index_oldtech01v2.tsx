import React from "react";
import { Composition, registerRoot } from "remotion";
import { M1 } from "./oldtech01v2/M1";
import { M2, M2_FRAMES } from "./oldtech01v2/M2";
import { M3, M3_FRAMES } from "./oldtech01v2/M3";
import { M4, M4_FRAMES } from "./oldtech01v2/M4";
import { M5, M5_FRAMES } from "./oldtech01v2/M5";
import { M6, M6_FRAMES } from "./oldtech01v2/M6";
import { M7, M7_FRAMES } from "./oldtech01v2/M7";
import { M8, M8_FRAMES } from "./oldtech01v2/M8";
import { M9, M9_FRAMES } from "./oldtech01v2/M9";
import { M10, M10_FRAMES } from "./oldtech01v2/M10";
import { MA, MA_FRAMES } from "./oldtech01v2/MA";
import { MB, MB_FRAMES } from "./oldtech01v2/MB";
import { MC, MC_FRAMES } from "./oldtech01v2/MC";
import { MD, MD_FRAMES } from "./oldtech01v2/MD";
import { Full, FULL_FRAMES } from "./oldtech01v2/Full";
import { S1 } from "./oldtech01v2/S1";
import { S2 } from "./oldtech01v2/S2";
const Root = () => (
  <>
    <Composition id="OT2M1" component={M1} durationInFrames={2181} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2S1" component={S1} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="OT2S2" component={S2} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="OT2M2" component={M2} durationInFrames={M2_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M3" component={M3} durationInFrames={M3_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M4" component={M4} durationInFrames={M4_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M5" component={M5} durationInFrames={M5_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M6" component={M6} durationInFrames={M6_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M7" component={M7} durationInFrames={M7_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M8" component={M8} durationInFrames={M8_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M9" component={M9} durationInFrames={M9_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2M10" component={M10} durationInFrames={M10_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2MA" component={MA} durationInFrames={MA_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2MB" component={MB} durationInFrames={MB_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2MC" component={MC} durationInFrames={MC_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2MD" component={MD} durationInFrames={MD_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2FULL" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
  </>
);
registerRoot(Root);
