import { Composition, registerRoot, Sequence, AbsoluteFill } from "remotion";
import React from "react";
import {
  ThermalWipe_lamina15,
  CaliperReveal_lamina15,
  DustDecay_lamina15,
} from "./VideoEdit/kit/lamina15/HookKit_lamina15";
import { THEME_EARTH } from "./VideoEdit/kit/premium/theme";

// Banco de prueba de las 3 variantes propias del hook, sobre imágenes reales.
// 3 planos × 120 frames = 360 frames a 30fps. Se rinde en el farm, no en local.
const PAGE = 120;
const PLATE_A = "img/techo5_c1.png";
const PLATE_B = "img/eh_o_attichatch.jpg";
const PLATE_C = "img/p_vh7v3kdc5l9h_hombre_techo_resignado.png";

const ProofLamina15: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={0} durationInFrames={PAGE}>
      <ThermalWipe_lamina15
        durationInFrames={PAGE}
        theme={THEME_EARTH}
        image={PLATE_A}
        label="SUP. TECHO"
        from={24}
        to={67}
        sweepDur={36}
      />
    </Sequence>
    <Sequence from={PAGE} durationInFrames={PAGE}>
      <CaliperReveal_lamina15 durationInFrames={PAGE} theme={THEME_EARTH} image={PLATE_B} />
    </Sequence>
    <Sequence from={PAGE * 2} durationInFrames={PAGE}>
      <DustDecay_lamina15
        durationInFrames={PAGE}
        theme={THEME_EARTH}
        image={PLATE_C}
        from={0.05}
        to={0.3}
        at={14}
        decayDur={60}
      />
    </Sequence>
  </AbsoluteFill>
);

export const RootProofLamina15: React.FC = () => (
  <Composition
    id="ProofLamina15"
    component={ProofLamina15}
    durationInFrames={PAGE * 3}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootProofLamina15);
