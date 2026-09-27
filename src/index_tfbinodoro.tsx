// Entry MÍNIMO solo-tfbinodoro (farm). Uso: ENTRY=src/index_tfbinodoro.tsx
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { MainTfbinodoro, TOTAL_FRAMES_TFBINODORO } from "./tfbinodoro/Main_tfbinodoro";

const Root = () => (
  <Composition id="Tfbinodoro" component={MainTfbinodoro} durationInFrames={TOTAL_FRAMES_TFBINODORO} fps={30} width={1920} height={1080} />
);

registerRoot(Root);
