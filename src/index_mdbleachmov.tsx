// index_mdbleachmov.tsx — entry MÍNIMO para la prueba de costura de los 6 movimientos.
// ⛔ Entry propio por slug: el `src/index.tsx` por defecto es COMPARTIDO entre sesiones y otra
// sesión lo deja apuntando a OTRO video → los chunks mueren con "Could not find composition".
import { registerRoot } from "remotion";
import React from "react";
import { Composition } from "remotion";
import { MainMdBleachMov, TOTAL_FRAMES_MDBLEACHMOV } from "./mdbleach/MovReel";

const Root: React.FC = () => (
  <>
    <Composition
      id="MdBleachMov"
      component={MainMdBleachMov}
      durationInFrames={TOTAL_FRAMES_MDBLEACHMOV}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
