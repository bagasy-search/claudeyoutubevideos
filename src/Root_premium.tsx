import "./index.css";
import { Composition } from "remotion";
import { PremiumGallery, GALLERY_FRAMES } from "./VideoEdit/kit/premium/Gallery";

// Root MÍNIMO — solo la galería del kit premium. Aislado del Root principal
// (que importa comps rotos pre-existentes). Patrón replicado de Root_ventilador.
export const RootPremium: React.FC = () => (
  <>
    <Composition
      id="PremiumGallery"
      component={PremiumGallery}
      durationInFrames={GALLERY_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
