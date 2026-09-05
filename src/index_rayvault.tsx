import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MainRayvault,TOTAL_FRAMES_RAYVAULT} from './VideoEdit/Main_rayvault';
const Root=()=> <Composition id="Rayvault" component={MainRayvault} durationInFrames={TOTAL_FRAMES_RAYVAULT} fps={30} width={1920} height={1080} />;
registerRoot(Root);
