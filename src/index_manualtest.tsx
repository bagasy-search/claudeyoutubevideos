// Test del overlay ManualCard. npx remotion still src/index_manualtest.tsx ManualTest out.png --frame=N
import "./index.css";
import { registerRoot, Composition, AbsoluteFill } from "remotion";
import { ManualCard } from "./VideoEdit/overlays/ManualCard";

const ManualTest: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 70% 40%, #2a2118, #0e0a06)" }}>
    {/* placeholder de dónde estaría el avatar (esquina derecha) */}
    <div style={{ position: "absolute", right: 90, top: 90, width: 360, height: 480, borderRadius: 24, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.4)", fontSize: 22 }}>avatar</div>
    <ManualCard
      durationInFrames={180}
      image="real/manual_cover.png"
      title="Manual de Reparaciones Caseras"
      desc="Los 40 arreglos de $1 a $5 del hogar, con los planos y las medidas exactas."
      chip="Accedé en la descripción"
    />
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <Composition id="ManualTest" component={ManualTest} durationInFrames={180} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
