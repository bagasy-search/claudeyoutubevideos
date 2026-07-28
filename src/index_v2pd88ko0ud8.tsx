// Entry AISLADO de este video. No toca src/Root.tsx (lo comparten los otros agentes).
// Uso: ENTRY=src/index_v2pd88ko0ud8.tsx node scripts/farm.mjs v2pd88ko0ud8 Fed6Romero <frames> <chunks>
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainV2pd88ko0ud8, TOTAL_FRAMES_V2PD } from "./_fed6/VideoEdit/Main_v2pd88ko0ud8";

const Root: React.FC = () => (
  <Composition
    id="Fed6Romero"
    component={MainV2pd88ko0ud8}
    durationInFrames={TOTAL_FRAMES_V2PD}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
