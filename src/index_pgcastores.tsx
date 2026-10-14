import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainPgcastores, TOTAL_FRAMES_PGCASTORES } from "./VideoEdit/Main_pgcastores";

const RootPgcastores: React.FC = () => (
  <Composition id="Pgcastores" component={MainPgcastores} durationInFrames={TOTAL_FRAMES_PGCASTORES} fps={30} width={1920} height={1080} />
);
registerRoot(RootPgcastores);
