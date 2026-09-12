import { registerRoot, Composition } from "remotion";
import { PremiumKitDemo, TOTAL_FRAMES_PREMIUMKIT } from "./VideoEdit/PremiumKitDemo";

// Remotion APARTE y LIMPIO: solo los componentes premium/noticiero nuevos.
const KitRoot: React.FC = () => (
  <>
    <Composition
      id="PremiumKit"
      component={PremiumKitDemo}
      durationInFrames={TOTAL_FRAMES_PREMIUMKIT}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(KitRoot);
