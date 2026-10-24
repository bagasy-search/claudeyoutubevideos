import { Composition, registerRoot } from "remotion";
import { Main, END } from "./sgardensquirrel/Main";
// sgardensquirrel · el video entero en un solo reloj (los segundos son los de la locución)
const Root = () => (
  <>
    <Composition id="Full" component={Main} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
