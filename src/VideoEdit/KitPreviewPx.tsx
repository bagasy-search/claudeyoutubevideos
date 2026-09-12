import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";

import { PxBottleReveal } from "./kit/PxBottleReveal";
import { PxSoilBreath } from "./kit/PxSoilBreath";
import { PxSeedAwaken } from "./kit/PxSeedAwaken";
import { PxRootRescue } from "./kit/PxRootRescue";
import { PxMildewRetreat } from "./kit/PxMildewRetreat";
import { PxSunLupa } from "./kit/PxSunLupa";
import { PxDoseScale } from "./kit/PxDoseScale";
import { PxFizzTest } from "./kit/PxFizzTest";
import { PxAmberDecay } from "./kit/PxAmberDecay";
import { PxGnatsLift } from "./kit/PxGnatsLift";
import { PxWaterRevive } from "./kit/PxWaterRevive";
import { PxCostCart } from "./kit/PxCostCart";
import { PxMoleculeForge } from "./kit/PxMoleculeForge";
import { PxDrownedPlant } from "./kit/PxDrownedPlant";
import { PxMythStamp } from "./kit/PxMythStamp";
import { PxSevenSeal } from "./kit/PxSevenSeal";

// ═══════════════════════════════════════════════════════════════════════════
// KitPreviewPx — hoja de contactos SOLO de los 16 componentes bespoke del video
// de peróxido (agua oxigenada en la huerta). Cada pieza corre EACH_FRAMES frames
// en secuencia, con props de ejemplo del propio video. Fondo COLORS.bg0.
// Render-safe: sin Date.now / Math.random / new Date.
// ═══════════════════════════════════════════════════════════════════════════

export const EACH_FRAMES = 90;

// Orden de la hoja de contactos (name -> componente -> props de ejemplo).
const CLIPS: { name: string; el: React.ReactNode }[] = [
  { name: "PxBottleReveal", el: <PxBottleReveal durationInFrames={EACH_FRAMES} label="El oxígeno de más se libera" /> },
  { name: "PxSoilBreath", el: <PxSoilBreath durationInFrames={EACH_FRAMES} title="Las raíces respiran" /> },
  { name: "PxSeedAwaken", el: <PxSeedAwaken durationInFrames={EACH_FRAMES} title="Despertar la semilla" /> },
  { name: "PxRootRescue", el: <PxRootRescue durationInFrames={EACH_FRAMES} title="Rescatar la raíz" subtitle="El peróxido mata la pudrición y la raíz revive" /> },
  { name: "PxMildewRetreat", el: <PxMildewRetreat durationInFrames={EACH_FRAMES} title="El hongo retrocede" subtitle="La pulverización disuelve el oídio" /> },
  { name: "PxSunLupa", el: <PxSunLupa durationInFrames={EACH_FRAMES} title="Al sol = veneno" subtitle="La lupa del sol quema la hoja mojada" /> },
  { name: "PxDoseScale", el: <PxDoseScale durationInFrames={EACH_FRAMES} title="La dosis justa" /> },
  { name: "PxFizzTest", el: <PxFizzTest durationInFrames={EACH_FRAMES} alive={true} title="¿Todavía sirve?" /> },
  { name: "PxAmberDecay", el: <PxAmberDecay durationInFrames={EACH_FRAMES} title="Por qué botella oscura" /> },
  { name: "PxGnatsLift", el: <PxGnatsLift durationInFrames={EACH_FRAMES} title="El problema está abajo" /> },
  { name: "PxWaterRevive", el: <PxWaterRevive durationInFrames={EACH_FRAMES} title="Agua muerta → viva" /> },
  { name: "PxCostCart", el: <PxCostCart durationInFrames={EACH_FRAMES} title="El vecino vs el abuelo" peroxidoPrice={900} /> },
  { name: "PxMoleculeForge", el: <PxMoleculeForge durationInFrames={EACH_FRAMES} title="Un oxígeno de más" /> },
  { name: "PxDrownedPlant", el: <PxDrownedPlant durationInFrames={EACH_FRAMES} title="No tiene sed: se ahoga" /> },
  { name: "PxMythStamp", el: <PxMythStamp durationInFrames={EACH_FRAMES} title="3 mitos del peróxido" myths={["Reemplaza el riego", "Sirve como fertilizante", "Cuanto más, mejor"]} /> },
  { name: "PxSevenSeal", el: <PxSevenSeal durationInFrames={EACH_FRAMES} title="Los 7 secretos" kicker="Agua oxigenada en la huerta" items={["Rescata raíces podridas", "Despierta semillas", "Frena el oídio", "Ahuyenta mosquitas", "Airea la tierra", "Revive el agua estancada", "Cuesta centavos"]} /> },
];

export const TOTAL_FRAMES_KITPX = CLIPS.length * EACH_FRAMES;

export const MainKitPreviewPx: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {CLIPS.map((c, i) => (
        <Sequence key={c.name} from={i * EACH_FRAMES} durationInFrames={EACH_FRAMES} name={c.name}>
          {c.el}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default MainKitPreviewPx;
