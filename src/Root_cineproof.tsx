import "./index.css";
import { Composition, AbsoluteFill } from "remotion";
import { CineShot } from "./VideoEdit/scenes/CineShot";
const S = (id: string, src: string, variant: any) => (
  <Composition id={id} durationInFrames={180} fps={30} width={1920} height={1080}
    component={() => (<AbsoluteFill><CineShot durationInFrames={180} src={src} variant={variant} /></AbsoluteFill>)} />
);
export const RootCineProof: React.FC = () => (<>
  {S("CineCard", "img/ox_s_097.png", "card")}
  {S("CineBleed", "img/ox_s_001.png", "bleed")}
  {S("CineCardOff", "img/ox_s_020.png", "cardOff")}
</>);
