import {Composition,registerRoot} from 'remotion';
import {MainRaymotion60} from './raymotion60/Main';
const Root=()=> <Composition id="Raymotion60" component={MainRaymotion60} durationInFrames={1800} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
