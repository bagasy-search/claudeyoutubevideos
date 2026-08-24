// Sonda de rendimiento. NO es un video: mide cuanto cuesta cada pieza por separado,
// con el mismo motor y el mismo --gl que usa el farm.
import "./index.css";
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { VAL, PaperGrain, WarmVignette } from "./valeria/theme";
import { ValChecklist, ValFullShot } from "./valeria/ValeriaKit";
import { staticFile } from "remotion";

const Vacio: React.FC = () => <AbsoluteFill style={{ background: VAL.paper }} />;

const SoloGrano: React.FC = () => (
  <AbsoluteFill style={{ background: VAL.paper }}>
    <PaperGrain />
  </AbsoluteFill>
);

// UN solo componente del kit, sin nada mas alrededor
const UnChecklist: React.FC = () => (
  <AbsoluteFill style={{ background: VAL.paper }}>
    <ValChecklist
      variant="whip"
      totalF={195}
      title="Lo que le falsea la medición"
      items={["La vejiga llena", "El brazo colgando", "Las piernas cruzadas", "Sin la espalda apoyada", "Hablando mientras mide", "El manguito sobre el jersey"]}
      accent={VAL.gold}
      mood="terracotta"
    />
  </AbsoluteFill>
);

// 604 <Sequence> fuera de rango + una escena visible: mide el costo de tener el arbol entero
const MuchasSequences: React.FC = () => (
  <AbsoluteFill style={{ background: VAL.paper }}>
    {Array.from({ length: 604 }, (_, i) => (
      <Sequence key={i} from={5000 + i * 10} durationInFrames={60} premountFor={20}>
        <AbsoluteFill style={{ background: VAL.paper }} />
      </Sequence>
    ))}
    <PaperGrain />
  </AbsoluteFill>
);

// un clip de b-roll a pantalla completa, tal como lo monta el kit
const UnClip: React.FC = () => (
  <AbsoluteFill style={{ background: VAL.paper }}>
    <ValFullShot variant="none" totalF={150} src={staticFile("broll/vp_b200.mp4")} video accent={VAL.gold} mood="gold" ken="in" />
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <>
    <Composition id="PVacio" component={Vacio} durationInFrames={200} fps={30} width={1920} height={1080} />
    <Composition id="PGrano" component={SoloGrano} durationInFrames={200} fps={30} width={1920} height={1080} />
    <Composition id="PChecklist" component={UnChecklist} durationInFrames={200} fps={30} width={1920} height={1080} />
    <Composition id="PSequences" component={MuchasSequences} durationInFrames={200} fps={30} width={1920} height={1080} />
    <Composition id="PClip" component={UnClip} durationInFrames={200} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
