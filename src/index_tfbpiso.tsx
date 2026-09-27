// Entry MÍNIMO solo-tfbpiso (farm). Uso: ENTRY=src/index_tfbpiso.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainTfbpiso, TOTAL_FRAMES_TFBPISO } from "./tfbpiso/Main_tfbpiso";

const Root = () => (
  <Composition id="Tfbpiso" component={MainTfbpiso} durationInFrames={TOTAL_FRAMES_TFBPISO} fps={30} width={1920} height={1080} />
);

registerRoot(Root);
