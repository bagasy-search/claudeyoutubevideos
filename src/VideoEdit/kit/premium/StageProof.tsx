import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { THEME_EARTH } from "./theme";
import { PremiumOverlay } from "../../scenes/PremiumOverlay";
import { CtaCard, MythTruth, StampBadge } from "./frame";
import { HighlightSweep, PullQuote } from "./text";
import { FlowSteps } from "./diagrams";
import { BeforeAfter, VsDuel } from "./compare";
import { ChecklistReveal, NumberedSteps } from "./lists";
import { BigStatReveal } from "./stats";

// ═══════════════════════════════════════════════════════════════════════════
// StageProof — BANCO DE PRUEBAS de los componentes EN USO REAL.
// La Gallery los muestra sobre fondo liso a 0.49 → miente. Acá cada página es
// UN componente a 1920x1080 con un plate de b-roll detrás y el mismo wrapper
// que usa el video (PremiumOverlay), que es como el espectador los ve.
// Stills de verificación: frame = página*PAGE + 62.
// ═══════════════════════════════════════════════════════════════════════════

export const PAGE = 180;

const PLATE = "img/shou_s_010.png";
const P1 = "img/ace_s_001.png";
const P2 = "img/ace_s_002.png";
const P3 = "img/ace_s_003.png";

type Case = { name: string; zone: "topLeft" | "left" | "top" | "full"; el: (d: number) => React.ReactNode };

export const CASES: Case[] = [
  {
    name: "StampBadge",
    zone: "topLeft",
    el: (d) => <StampBadge durationInFrames={d} theme={THEME_EARTH} text="OMS 2009" sub="Guía de aire interior" />,
  },
  {
    name: "PullQuote",
    zone: "top",
    el: (d) => (
      <PullQuote
        durationInFrames={d}
        theme={THEME_EARTH}
        quote="No se recomienda el uso rutinario de biocidas contra el moho"
        author="EPA"
        role="Agencia ambiental de Estados Unidos"
        image={P1}
      />
    ),
  },
  {
    name: "FlowSteps",
    zone: "top",
    el: (d) => (
      <FlowSteps
        durationInFrames={d}
        theme={THEME_EARTH}
        title="Por qué hace espuma"
        nodes={[
          { label: "Catalasa", sub: "Enzima de la célula viva", image: P1 },
          { label: "Parte el peróxido", image: P2 },
          { label: "Libera oxígeno", sub: "Eso es la espuma", image: P3 },
        ]}
      />
    ),
  },
  {
    name: "BeforeAfter",
    zone: "top",
    el: (d) => (
      <BeforeAfter
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Diluirla la mata"
        beforeLabel="3% de fábrica"
        afterLabel="1,5% aguado"
        beforeImage={P1}
        afterImage={P2}
        caption="Ya viene diluida: no la cortes"
      />
    ),
  },
  {
    name: "ChecklistReveal",
    zone: "topLeft",
    el: (d) => (
      <ChecklistReveal
        durationInFrames={d}
        theme={THEME_EARTH}
        title="Encima o adentro: así lo sabés"
        items={[
          "Comprobá el tiempo completo",
          "Aclaró y se siente firme: era de encima",
          "No cambió o volvió en tres semanas: está adentro",
        ]}
        stamp="Sin adivinar"
      />
    ),
  },
  // ── el resto del set que USA este canal (cues_shou/aceite): no se
  //    reescribieron uno por uno, pero heredan el motor de capas vía Panel.
  //    Están acá para que el banco confirme que ninguno quedó roto.
  {
    name: "BigStatReveal",
    zone: "topLeft",
    el: (d) => (
      <BigStatReveal
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Lo que casi nadie mide"
        value={3}
        suffix="%"
        support="La concentración que viene de fábrica — y la única que sirve"
        source=""
      />
    ),
  },
  {
    name: "VsDuel",
    zone: "left",
    el: (d) => (
      <VsDuel
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Frente a frente"
        title="Lavandina vs. agua oxigenada"
        left={{ label: "Lavandina", sub: "mata en la superficie, vuelve en semanas", image: P1, good: false }}
        right={{ label: "Agua oxigenada", sub: "penetra el poro y no deja residuo", image: P2, good: true }}
      />
    ),
  },
  {
    name: "MythTruth",
    zone: "topLeft",
    el: (d) => (
      <MythTruth
        durationInFrames={d}
        theme={THEME_EARTH}
        myth="Si hace espuma, está matando el moho"
        truth="La espuma es oxígeno de la célula viva: avisa, no cura"
      />
    ),
  },
  {
    name: "HighlightSweep",
    zone: "top",
    el: (d) => (
      <HighlightSweep
        durationInFrames={d}
        theme={THEME_EARTH}
        pre="El frasco marrón no es estética:"
        highlight="la luz la descompone"
        post=" en agua común."
        note="por eso nunca viene en botella transparente"
      />
    ),
  },
  {
    name: "NumberedSteps",
    zone: "left",
    el: (d) => (
      <NumberedSteps
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Paso a paso"
        title="Cómo se aplica, sin vueltas"
        steps={[
          { title: "Ventilá el ambiente", sub: "y ponete guantes" },
          { title: "Rociá sin diluir", sub: "directo del frasco" },
          { title: "Esperá diez minutos", sub: "sin frotar" },
          { title: "Pasá un trapo seco", sub: "y dejá secar al aire" },
        ]}
      />
    ),
  },
  {
    name: "CtaCard",
    zone: "full",
    el: (d) => (
      <CtaCard
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="El manual completo"
        title="Manual de Reparaciones Caseras"
        bullet="84 arreglos probados, con medidas exactas"
        price={0}
        cta="Link en la descripción"
        image={P3}
      />
    ),
  },
];

export const PROOF_FRAMES = CASES.length * PAGE;

/** plate de b-roll con un push lento, como el beat real de video */
const Plate: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame % PAGE, [0, PAGE], [1, 1.06]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#151310" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k})` }}
      />
    </AbsoluteFill>
  );
};

export const StageProof: React.FC = () => {
  const frame = useCurrentFrame();
  const page = Math.min(CASES.length - 1, Math.floor(frame / PAGE));
  const c = CASES[page];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence key={page} from={page * PAGE} durationInFrames={PAGE}>
        <Plate src={PLATE} />
        <PremiumOverlay durationInFrames={PAGE} zone={c.zone} theme={THEME_EARTH}>
          {c.el(PAGE)}
        </PremiumOverlay>
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            padding: "6px 16px",
            borderRadius: 7,
          }}
        >
          {c.name} · zone={c.zone}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
