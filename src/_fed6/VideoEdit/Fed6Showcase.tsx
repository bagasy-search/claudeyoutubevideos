// SHOWCASE del kit federer-video (src/_fed6) — SIN assets externos. Encadena los componentes de texto
// del kit con contenido placeholder, para VER el estilo visual sin generar imágenes ni avatar.
import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";

const SEG = 150; // 5s por componente a 30fps
export const FED6_SHOWCASE_FRAMES = SEG * 6;

export const Fed6Showcase: React.FC = () => (
  <AbsoluteFill style={{ background: "#071014" }}>
    <Series>
      <Series.Sequence durationInFrames={SEG}>
        <ErrorStinger durationInFrames={SEG} number="01" title="El error que arruina el 90% de los tratamientos" tone="warn" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <LowerThird durationInFrames={SEG} kicker="DATO" title="El romero mejora la circulación cerebral" desc="Estudios lo asocian a mejor memoria en adultos mayores" tone="teal" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <MitoVerdad durationInFrames={SEG} myth="El colágeno en cápsulas rejuvenece la piel" truth="Lo que importa es cómo tu cuerpo lo produce" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <FraseCinetica
          durationInFrames={SEG}
          tone="teal"
          words={[{ t: "Tu" }, { t: "piel" }, { t: "envejece" }, { t: "más", hl: true }, { t: "rápido", hl: true }, { t: "de" }, { t: "noche" }]}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <LowerThird durationInFrames={SEG} kicker="ADVERTENCIA" title="No lo trates en casa si hay fiebre" desc="Una articulación caliente puede necesitar diagnóstico" tone="warn" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEG}>
        <GuardaEsto
          durationInFrames={SEG}
          title="Guardá estos 3 pasos"
          items={["Agua tibia, nunca hirviendo", "En ayunas, apenas te levantás", "Esperá antes de desayunar"]}
        />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
