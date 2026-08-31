import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainAguacatenoche, TOTAL_FRAMES_AGUACATENOCHE } from "./_fed6/VideoEdit/Main_aguacatenoche";

// Entry PROPIO del video "Come ESTO Cada Noche…" (Federer - Más Salud, Más Vida).
// ⛔ Obligatorio: sin ENTRY propio el farm cae al src/index.tsx COMPARTIDO (otra sesión) y el chunk
// muere con "Could not find composition with ID Aguacatenoche".
const RootAguacatenoche: React.FC = () => (
  <>
    <Composition
      id="Aguacatenoche"
      component={MainAguacatenoche}
      durationInFrames={TOTAL_FRAMES_AGUACATENOCHE}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RootAguacatenoche);
