// Vitrina del kit (sólo para cuadros fijos de prueba): una composición por componente con props de ejemplo.
//   npx remotion still src/fab/demo.tsx <Comp> out.png --frame=150
import React from "react";
import { registerRoot, Composition } from "remotion";
import { FAB } from "./Kit";
import DEMO from "./demo.json";
registerRoot(() => (
  <>
    {Object.entries(DEMO as Record<string, any>).map(([id, d]) => (
      <Composition key={id} id={id} component={(FAB as any)[d.c]} defaultProps={d.props} durationInFrames={d.dur || 300} fps={30} width={1920} height={1080} />
    ))}
  </>
));
