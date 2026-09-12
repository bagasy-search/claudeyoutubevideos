import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { EmphasisMoment } from "./scenes/EmphasisMoment";
import { Endcard } from "./scenes/Endcard";
import { RawShot } from "./scenes/RawShot";
import { F_INTER } from "./kit/premium/theme";
import { renderRecalComp } from "./FedererComponents";
import { ARAND_BROLL } from "./arandano_broll";
import { ARAND_COMPS } from "./arandano_beats";
import { ARAND_SCRIMS, ARAND_EMPH, ARAND_ENDCARD, ARAND_END } from "./arandano_hooks";

// ── DR. FEDERER · "Arándano / Ojos" ─────────────────────────────────────────
// Plan visual segundo-a-segundo (6 agentes Haiku + densificado). 3 capas:
// b-roll denso real → avatar (PiP/oculto) → componentes premium MEDICO.
// Overlays: scrims (oscurece+palabra), emphasis (avatar full+frase), endcard.
const TEAL = "#12B3AE";
const CORAL = "#E0523E";
const BG = "#0E1D23";

export const TOTAL_FRAMES_ARAND = Math.round(ARAND_END * 30);

function buildWindows(): AvatarWindow[] {
  const CORNER: AvatarWindow["mode"] = "cornerTR";
  const pts: { start: number; mode: AvatarWindow["mode"]; pr: number }[] = [{ start: 0, mode: "full", pr: 3 }];
  // b-roll normal → avatar en PiP; imagen-con-doctor (av) → avatar OCULTO (evita doble).
  for (const b of ARAND_BROLL) pts.push({ start: b.start, mode: (b as any).av ? "hidden" : CORNER, pr: 0 });
  for (const c of ARAND_COMPS) pts.push({ start: c.start, mode: "hidden", pr: 1 });
  pts.push({ start: 2.0, mode: CORNER, pr: 2 });
  // avatar vuelve a PANTALLA COMPLETA cada ~57s por ~4s (donde no hay componente ni
  // emphasis) — para que no quede siempre en la esquina.
  const compRanges = ARAND_COMPS.map((c: any) => [c.start - 0.5, c.start + c.dur + 0.5]);
  const emphRanges = ARAND_EMPH.map((e) => [e.from - 0.5, e.to + 0.5]);
  const busy = (a: number, b: number) => [...compRanges, ...emphRanges].some(([x, y]) => a < y && b > x);
  for (let t = 55; t < ARAND_END - 8; t += 57) {
    let s = t;
    for (let k = 0; k < 20 && busy(s, s + 4.2); k++) s += 2;
    if (!busy(s, s + 4.2)) { pts.push({ start: +s.toFixed(2), mode: "full", pr: 2 }); pts.push({ start: +(s + 4).toFixed(2), mode: CORNER, pr: 1.5 }); }
  }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);
  const w: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { w.push({ start: p.start, mode: p.mode }); last = p.mode; } }
  return w;
}
const AVATAR_WINDOWS = buildWindows();

// ordinal POR TIPO de cada componente → rotación uniforme de los componentes ricos.
const KIND_ORD: number[] = (() => {
  const seen: Record<string, number> = {};
  return ARAND_COMPS.map((c: any) => (seen[c.kind] = (seen[c.kind] ?? -1) + 1));
})();

export const MainArandano: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — b-roll denso */}
      {ARAND_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" />
        </Sequence>
      ))}

      {/* CAPA 2 — avatar (PiP quieto sobre b-roll, oculto en componentes) */}
      <AvatarLayer src="arandano_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 3 — componentes premium (stat/headline/diagram/scrolldoc/…) */}
      {ARAND_COMPS.map((c: any, i: number) => (
        <Sequence key={`c_${c.id || i}`} from={sec(c.start)} durationInFrames={Math.max(1, sec(c.dur))}>
          {renderRecalComp(c, Math.max(1, sec(c.dur)), KIND_ORD[i])}
        </Sequence>
      ))}

      {/* OVERLAY — scrims (oscurece + palabra de shock/revelación) */}
      {ARAND_SCRIMS.map((s, i) => (
        <Sequence key={`s_${i}`} from={sec(s.start)} durationInFrames={sec(Math.max(1.4, s.dur))} layout="none">
          <AvatarScrimText durationInFrames={sec(Math.max(1.4, s.dur))} impact={s.word} accentColor={s.accent === "coral" ? CORAL : TEAL} font={F_INTER} fontSize={150} />
        </Sequence>
      ))}

      {/* OVERLAY — emphasis (avatar full + frase grande) */}
      {ARAND_EMPH.map((e, i) => (
        <Sequence key={`e_${i}`} from={sec(e.from)} durationInFrames={sec(Math.max(1.4, e.to - e.from))} layout="none">
          <EmphasisMoment durationInFrames={sec(Math.max(1.4, e.to - e.from))} avatarFromSec={e.from} text={e.text} avatarSrc="arandano_opt.mp4" />
        </Sequence>
      ))}

      {/* ENDCARD */}
      <Sequence from={sec(ARAND_ENDCARD)} durationInFrames={sec(Math.max(2, ARAND_END - ARAND_ENDCARD))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, ARAND_END - ARAND_ENDCARD))} />
      </Sequence>
    </AbsoluteFill>
  );
};
