import React from "react";
import { Composition, registerRoot } from "remotion";
import { M1 } from "./oldtech01v2es/M1";
import { M2, M2_FRAMES } from "./oldtech01v2es/M2";
import { M3, M3_FRAMES } from "./oldtech01v2es/M3";
import { M4, M4_FRAMES } from "./oldtech01v2es/M4";
import { M5, M5_FRAMES } from "./oldtech01v2es/M5";
import { M6, M6_FRAMES } from "./oldtech01v2es/M6";
import { M7, M7_FRAMES } from "./oldtech01v2es/M7";
import { M8, M8_FRAMES } from "./oldtech01v2es/M8";
import { M9, M9_FRAMES } from "./oldtech01v2es/M9";
import { M10, M10_FRAMES } from "./oldtech01v2es/M10";
import { MA, MA_FRAMES } from "./oldtech01v2es/MA";
import { MB, MB_FRAMES } from "./oldtech01v2es/MB";
import { MC, MC_FRAMES } from "./oldtech01v2es/MC";
import { MD, MD_FRAMES } from "./oldtech01v2es/MD";
import { Full, FULL_FRAMES } from "./oldtech01v2es/Full";
import { FullES, ES_FRAMES } from "./oldtech01v2es/FullES";
import { S1 } from "./oldtech01v2es/S1";
import { S2 } from "./oldtech01v2es/S2";
const Root = () => (
  <>
    <Composition id="OT2ESM1" component={M1} durationInFrames={2181} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESS1" component={S1} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="OT2ESS2" component={S2} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="OT2ESM2" component={M2} durationInFrames={M2_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM3" component={M3} durationInFrames={M3_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM4" component={M4} durationInFrames={M4_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM5" component={M5} durationInFrames={M5_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM6" component={M6} durationInFrames={M6_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM7" component={M7} durationInFrames={M7_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM8" component={M8} durationInFrames={M8_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM9" component={M9} durationInFrames={M9_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESM10" component={M10} durationInFrames={M10_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESMA" component={MA} durationInFrames={MA_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESMB" component={MB} durationInFrames={MB_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESMC" component={MC} durationInFrames={MC_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESMD" component={MD} durationInFrames={MD_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESFULL" component={FullES} durationInFrames={ES_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="OT2ESEN" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
  </>
);
registerRoot(Root);
