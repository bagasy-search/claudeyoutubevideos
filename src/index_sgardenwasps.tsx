import { Composition, registerRoot } from "remotion";
import { Main, END } from "./sgardenwasps/Main";
// sgardenwasps · el video entero (mismo reloj que la locución cortada sgardenwaspscut.wav)
const Root = () => <Composition id="Sgardenwasps" component={Main} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />;
registerRoot(Root);
