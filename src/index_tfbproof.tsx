// Banco de prueba de los componentes Tfb* (sólo stills de revisión local).
import "./index.css";
import { registerRoot, Composition } from "remotion";
import { ProofTfbpiso, PROOF_N } from "./tfbpiso/Proof_tfbpiso";
const Root = () => <Composition id="TfbProof" component={ProofTfbpiso} durationInFrames={PROOF_N * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
