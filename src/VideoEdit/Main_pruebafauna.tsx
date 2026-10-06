import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { DocClip } from "./doc/DocClip";
import { DocGrade } from "./doc/DocGrade";
import { SUBS, WAV, TOTAL_FRAMES } from "./cues_pruebafauna.gen";

export const TOTAL_FRAMES_PF = TOTAL_FRAMES;

// ── TEST fauna "Yaguareté vuelve al Iberá" (Planeta Reconstruido) ──────────────
// 100% clips REALES (match CLIP por visión) anclados al ms de la narración. Corte
// duro (sin disolvencias), narración clonada completa, look unificado por DocGrade.
const B = (n: string) => `broll/${n}.mp4`;

export const MainPruebafauna: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* CLIPS a corte duro (grade de contraste/saturación en el wrapper) */}
      <AbsoluteFill style={{ filter: "contrast(1.08) saturate(1.14) brightness(1.02)" }}>
        {SUBS.map((s, i) => (
          <Sequence key={"c" + i} from={s.from} durationInFrames={s.dur}>
            <DocClip durationInFrames={s.dur} src={B(s.src)} fade={0} kenburns={s.kb} />
          </Sequence>
        ))}
      </AbsoluteFill>

      {/* GRADE unificado (puro metraje, sin barras para 16:9 lleno) */}
      <DocGrade bars={false} />

      {/* NARRACIÓN clonada completa */}
      <Audio src={staticFile(WAV)} />
    </AbsoluteFill>
  );
};
