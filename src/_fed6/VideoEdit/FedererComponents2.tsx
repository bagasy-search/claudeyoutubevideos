import React from "react";
import { renderFedererComp, COMP_KINDS } from "./FedererComponents";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { BarCompare } from "./scenes/BarCompare";
import { CalloutMark } from "./scenes/CalloutMark";
import { PizarraExplica } from "./scenes/PizarraExplica";
import { DocNameCard } from "./scenes/DocNameCard";

// Video 2 (CAFÉ) suma kinds que el mapeador del Video 1 no tenía: bars, callout,
// diagram con IMAGEN gpt-image real (DiagramBoard), y "board" = avatar a la derecha
// + pizarra explicativa a la izquierda (PizarraExplica). Resto → renderFedererComp.
export const COMP2_KINDS = new Set<string>([...COMP_KINDS, "bars", "callout", "board"]);
// board mantiene el avatar VISIBLE a un lado (no lo oculta) → el Main lo pone en "right"/"left"
export const BOARD_KINDS = new Set<string>(["board"]);

// `opts.medico` → los kinds compartidos con los canales EARTHY (bars/callout/diagram)
// se renderizan con la paleta clínica teal (THEME_MEDICO) en vez de la terrosa. Por
// DEFECTO es earthy (undefined) → NO cambia nada para los canales earthy que llaman a
// estos componentes directo desde cues_*.gen.tsx. Solo los Main MÉDICO (federer2/
// federer3/vet1) pasan {medico:true}.
export function renderFederer2Comp(beat: any, d: number, opts: { medico?: boolean } = {}): React.ReactNode {
  const medico = !!opts.medico;
  switch (beat.kind) {
    case "diagram": {
      // láminas gpt-image reales (DiagramBoard corta seco entre pages). Rutas CRUDAS
      // (Media resuelve staticFile internamente, como RawShot).
      const rawPages = (beat.slides && beat.slides.length)
        ? beat.slides
        : (beat.image ? [{ image: beat.image, eyebrow: beat.eyebrow }] : []);
      const pages = rawPages
        .filter((s: any) => s && s.image)
        .map((s: any) => ({ image: s.image, eyebrow: s.eyebrow || beat.eyebrow }));
      if (!pages.length) return null;
      return <DiagramBoard durationInFrames={d} pages={pages} medico={medico} tag={beat.tag} />;
    }
    case "bars":
      return (
        <BarCompare
          durationInFrames={d}
          title={beat.title}
          eyebrow={beat.eyebrow}
          unit={beat.unit}
          accent="accent"
          medico={medico}
          bars={(beat.bars || []).map((b: any) => ({ label: b.label, value: b.value, tone: b.tone, winner: b.winner, note: b.note }))}
        />
      );
    case "callout":
      return (
        <CalloutMark
          durationInFrames={d}
          figure={beat.figure}
          caption={beat.caption}
          image={beat.image}
          eyebrow={beat.eyebrow}
          accent="accent"
          medico={medico}
        />
      );
    case "board":
      return (
        <PizarraExplica
          durationInFrames={d}
          eyebrow={beat.eyebrow}
          title={beat.title}
          items={beat.items || []}
          side={beat.side || "left"}
        />
      );
    case "nametag":
      // el default de DocNameCard es img/federer_casual.png (video 1, no existe acá).
      // Cada video pasa su propia foto del doctor por beat.image (fe2/fe3); fallback fe2.
      return <DocNameCard durationInFrames={d} name={beat.name} role={beat.role} image={beat.image || "img/fe2_federer_cafe.png"} />;
    default:
      return renderFedererComp(beat, d);
  }
}
