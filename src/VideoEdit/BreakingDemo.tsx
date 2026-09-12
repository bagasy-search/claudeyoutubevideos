import { AbsoluteFill, Sequence } from "remotion";
import { BreakingReveal } from "./scenes/BreakingReveal";

// Demo del componente BreakingReveal (2 variantes). Solo para preview/still.
export const TOTAL_FRAMES_BREAKINGDEMO = 240;

export const BreakingDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#3a4a2a,#6b7a4a)" }}>
      {/* variante REVEAL (titular exagerado) */}
      <Sequence from={0} durationInFrames={120}>
        <BreakingReveal
          durationInFrames={120}
          accent="danger"
          label="AL DESCUBIERTO"
          badge="AHORA"
          headline="Estás matando tu planta con agua"
          ticker="El error que comete 9 de cada 10 personas — y cómo revertirlo hoy"
        />
      </Sequence>
      {/* variante SECRETO Nº */}
      <Sequence from={120} durationInFrames={120}>
        <BreakingReveal
          durationInFrames={120}
          accent="amber"
          number="4"
          badge="DATO"
          headline="Sembrar con la luna"
          ticker="El truco del abuelo que nadie te contó"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
