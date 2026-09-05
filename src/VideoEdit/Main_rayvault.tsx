import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import {MainRayvaultBody} from './Main_rayvault_body';
import {MainRaytrailer78} from '../raymotion60/Trailer';
export const TOTAL_FRAMES_RAYVAULT=52404;
// One continuous approved master. The original body keeps its global timing.
export const MainRayvault=()=> <AbsoluteFill>
 <Sequence from={0} durationInFrames={2340}><MainRaytrailer78 audioEnabled={false}/></Sequence>
 <Sequence from={2340} durationInFrames={50064}><Sequence from={-2340}><MainRayvaultBody audioEnabled={false}/></Sequence></Sequence>
 <Audio src={staticFile('rayvault_trailer_v2.wav')}/>
</AbsoluteFill>;
