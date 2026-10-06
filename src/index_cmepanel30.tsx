// GENERADO por build_cmepanel30.mjs — entry propio.
// ⛔ Sin este entry el farm usa src/index.tsx COMPARTIDO, que otra sesion dejo apuntando a otro
// video, y los 60 chunks mueren con "Could not find composition with ID Cmepanel30".
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmepanel30, TOTAL_FRAMES_CMEPANEL30 } from "./cmepanel30/Main_cmepanel30";

export const Root: React.FC = () => (
  <Composition id="Cmepanel30" component={MainCmepanel30}
    durationInFrames={TOTAL_FRAMES_CMEPANEL30} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
