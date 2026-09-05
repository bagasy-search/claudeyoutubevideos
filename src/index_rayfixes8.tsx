import {AbsoluteFill,Composition,Sequence,registerRoot} from 'remotion';
import {MainRayvault} from './VideoEdit/Main_rayvault';
const intervals=[{"start": 534, "end": 542, "stripStart": 0.0, "frames": 240}, {"start": 558, "end": 564, "stripStart": 8.0, "frames": 180}, {"start": 694, "end": 704, "stripStart": 14.0, "frames": 300}, {"start": 834, "end": 842, "stripStart": 24.0, "frames": 240}, {"start": 1128, "end": 1136, "stripStart": 32.0, "frames": 240}, {"start": 1164, "end": 1174, "stripStart": 40.0, "frames": 300}, {"start": 1206, "end": 1216, "stripStart": 50.0, "frames": 300}, {"start": 1438, "end": 1448, "stripStart": 60.0, "frames": 300}];
const PatchStrip=()=> <AbsoluteFill>{intervals.map(p=><Sequence key={p.start} from={p.stripStart*30} durationInFrames={p.frames}><Sequence from={-p.start*30}><MainRayvault audioEnabled={false}/></Sequence></Sequence>)}</AbsoluteFill>;
const Root=()=> <Composition id="Rayfixes8" component={PatchStrip} durationInFrames={2100} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
