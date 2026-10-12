// lkit · entry de PRUEBAS del kit permanente Loretta v2 (no es un video): "Gallery" + una composición "G-<Nombre>" por componente.
// Stills: node scripts/lkit_stills.mjs  (o npx remotion still src/index_lkit.tsx G-ItemCard out/x.png --frame=120)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit/core";
import { DEMOS, Gallery, GalleryOne, GALLERY_FRAMES } from "./lkit/Gallery";

setKit({ imgDir: "img/lkit_demo", grain: "img/lkit_demo/grain.png", qr: "qr.jpg", cover: "book_cover.png" });

const Root: React.FC = () => (
  <>
    <Composition id="Gallery" component={Gallery} durationInFrames={GALLERY_FRAMES} fps={30} width={1920} height={1080} />
    {DEMOS.map((D) => (
      <Composition key={D.name} id={`G-${D.name}`} component={GalleryOne} defaultProps={{ name: D.name }} durationInFrames={Math.round(D.dur * 30)} fps={30} width={1920} height={1080} />
    ))}
  </>
);
registerRoot(Root);
