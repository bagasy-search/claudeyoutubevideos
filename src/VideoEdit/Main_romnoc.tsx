import { AbsoluteFill, Sequence, Audio, staticFile, interpolate } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { EmphasisMoment } from "./scenes/EmphasisMoment";
import { Endcard } from "./scenes/Endcard";
import { RawShot } from "./scenes/RawShot";
import { F_INTER } from "./kit/premium/theme";
import { renderRecalComp, OVERLAY_KINDS } from "./FedererComponents";
import { ROMNOC_BROLL } from "./romnoc_broll";
import { ROMNOC_COMPS } from "./romnoc_beats";
import { ROMNOC_SCRIMS, ROMNOC_EMPH, ROMNOC_ENDCARD, ROMNOC_END } from "./romnoc_hooks";

// ── DR. FEDERER · "Arándano / Ojos" ─────────────────────────────────────────
// Plan visual segundo-a-segundo (6 agentes Haiku + densificado). 3 capas:
// b-roll denso real → avatar (PiP/oculto) → componentes premium MEDICO.
// Overlays: scrims (oscurece+palabra), emphasis (avatar full+frase), endcard.
const TEAL = "#12B3AE";
const CORAL = "#E0523E";
const BG = "#0E1D23";

export const TOTAL_FRAMES_ROMNOC = Math.round(ROMNOC_END * 30);

function buildWindows(): AvatarWindow[] {
  const CORNER: AvatarWindow["mode"] = "cornerTR";
  const HOOK = 6; // apertura con el avatar en PANTALLA COMPLETA
  // ── modo del avatar por COBERTURA de pantalla (fix: FULL cuando no hay imagen/clip) ──
  //   hidden = takeover/emphasis tapan todo · corner = hay b-roll detrás · full = nada más → él es el contenido
  // b-roll con `av` (imagen-con-doctor) también oculta el avatar (evita doble).
  const brollIv: [number, number][] = [];
  for (const b of ROMNOC_BROLL) { if ((b as any).av) continue; brollIv.push([b.start, b.start + b.dur]); }
  brollIv.sort((a, b) => a[0] - b[0]);
  // fusionar b-roll con huecos < 1.5s (para que el avatar NO parpadee full↔corner)
  const mergedBroll: [number, number][] = [];
  for (const iv of brollIv) {
    const last = mergedBroll[mergedBroll.length - 1];
    if (last && iv[0] - last[1] < 1.5) last[1] = Math.max(last[1], iv[1]);
    else mergedBroll.push([iv[0], iv[1]]);
  }
  const hideIv: [number, number][] = [
    ...ROMNOC_COMPS.filter((c: any) => !OVERLAY_KINDS.has(c.kind) || (c as any).av).map((c: any) => [c.start, c.start + c.dur] as [number, number]),
    ...ROMNOC_BROLL.filter((b: any) => b.av).map((b: any) => [b.start, b.start + b.dur] as [number, number]),
    ...ROMNOC_EMPH.map((e) => [e.from, e.to] as [number, number]),
  ];
  const inAny = (ivs: [number, number][], t: number) => ivs.some(([a, b]) => t >= a && t < b);
  const modeAt = (t: number): AvatarWindow["mode"] => {
    if (t < HOOK) return "full";
    if (inAny(hideIv, t)) return "hidden";
    if (inAny(mergedBroll, t)) return CORNER;
    return "full"; // ← hueco sin b-roll: avatar a PANTALLA COMPLETA (no PiP sobre fondo azul)
  };
  const pts = new Set<number>([0, HOOK]);
  for (const [a, b] of [...mergedBroll, ...hideIv]) { pts.add(a); pts.add(b); }
  const sorted = [...pts].filter((t) => t >= 0 && t < ROMNOC_END).sort((a, b) => a - b);
  const w: AvatarWindow[] = [];
  let last = "";
  for (const t of sorted) { const m = modeAt(t + 0.02); if (m !== last) { w.push({ start: +t.toFixed(2), mode: m }); last = m; } }
  if (!w.length || w[0].start > 0) w.unshift({ start: 0, mode: "full" });
  return w;
}
const AVATAR_WINDOWS = buildWindows();

// ordinal POR TIPO de cada componente → rotación uniforme de los componentes ricos.
const KIND_ORD: number[] = (() => {
  const seen: Record<string, number> = {};
  return ROMNOC_COMPS.map((c: any) => (seen[c.kind] = (seen[c.kind] ?? -1) + 1));
})();

export const MainRomnoc: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — b-roll denso */}
      {ROMNOC_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" kbBoost={1.9} />
        </Sequence>
      ))}

      {/* CAPA 2 — avatar (PiP quieto sobre b-roll, oculto en componentes) */}
      <AvatarLayer src="romnoc_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 3 — componentes premium (stat/headline/diagram/scrolldoc/…) */}
      {ROMNOC_COMPS.map((c: any, i: number) => (
        <Sequence key={`c_${c.id || i}`} from={sec(c.start)} durationInFrames={Math.max(1, sec(c.dur))}>
          {renderRecalComp(c, Math.max(1, sec(c.dur)), KIND_ORD[i])}
        </Sequence>
      ))}

      {/* OVERLAY — scrims (oscurece + palabra de shock/revelación) */}
      {ROMNOC_SCRIMS.map((s, i) => (
        <Sequence key={`s_${i}`} from={sec(s.start)} durationInFrames={sec(Math.max(1.4, s.dur))} layout="none">
          <AvatarScrimText durationInFrames={sec(Math.max(1.4, s.dur))} impact={s.word} accentColor={s.accent === "coral" ? CORAL : TEAL} font={F_INTER} fontSize={150} />
        </Sequence>
      ))}

      {/* OVERLAY — emphasis (avatar full + frase grande) */}
      {ROMNOC_EMPH.map((e, i) => (
        <Sequence key={`e_${i}`} from={sec(e.from)} durationInFrames={sec(Math.max(1.4, e.to - e.from))} layout="none">
          <EmphasisMoment durationInFrames={sec(Math.max(1.4, e.to - e.from))} avatarFromSec={e.from} text={e.text} avatarSrc="romnoc_opt.mp4" />
        </Sequence>
      ))}

      {/* ENDCARD */}
      <Sequence from={sec(ROMNOC_ENDCARD)} durationInFrames={sec(Math.max(2, ROMNOC_END - ROMNOC_ENDCARD))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, ROMNOC_END - ROMNOC_ENDCARD))} />
      </Sequence>

      {/* ── DISEÑO DE SONIDO (firma Federer) ───────────────────────────────── */}
      {/* Música "New Horizon": fuerte en la apertura, DUCKEADA bien baja bajo la voz, sale ~66s */}
      <Audio src={staticFile("sfx/music_federer.mp3")} volume={(f) => interpolate(f / 30, [0, 2, 4, 56, 66], [0, 0.24, 0.085, 0.085, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {/* Rumble grave constante en el intro (0-15s) */}
      <Sequence from={0} durationInFrames={sec(15)} layout="none">
        <Audio src={staticFile("sfx/rumble_const.mp3")} loop volume={(f) => interpolate(f / 30, [0, 1, 12, 15], [0, 0.09, 0.09, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
      {/* Golpe cuando aparece "DR. FEDERER" (~6s) — la cola resuena libre */}
      <Sequence from={Math.max(0, sec(6) - 9)} layout="none"><Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.55} /></Sequence>
      {/* Whoosh en cada cambio de sección fuerte */}
      {[56, 88, 360, 420, 548, 950].map((t, i) => (
        <Sequence key={"wh" + i} from={Math.max(0, sec(t) - 5)} layout="none"><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} /></Sequence>
      ))}
      {/* Música vuelve suave en el cierre / CTA */}
      <Sequence from={sec(ROMNOC_ENDCARD)} layout="none"><Audio src={staticFile("sfx/music_federer.mp3")} startFrom={sec(20)} volume={(f) => interpolate(f / 30, [0, 2, 34, 42], [0, 0.13, 0.13, 0.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></Sequence>
    </AbsoluteFill>
  );
};
