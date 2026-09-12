// Entry PROPIO de `fasenales17`.
// ⛔ Sin un entry propio el farm usa `src/index.tsx` COMPARTIDO, que otra sesión deja apuntando a
//    otro video, y los 60 chunks mueren con "Could not find composition with ID ...". Registrar la
//    comp en `Root.tsx` NO alcanza: `render.yml` con entry vacío usa el index por defecto.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFasenales17, TOTAL_FRAMES_FASENALES17 } from "./fasenales17/Main_fasenales17";

const Root: React.FC = () => (
  <>
    <Composition
      id="Fasenales17"
      component={MainFasenales17}
      durationInFrames={TOTAL_FRAMES_FASENALES17}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
