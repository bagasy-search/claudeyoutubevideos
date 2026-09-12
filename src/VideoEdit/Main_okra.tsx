import { AbsoluteFill, Sequence, Audio, staticFile, interpolate } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { EmphasisMoment } from "./scenes/EmphasisMoment";
import { Endcard } from "./scenes/Endcard";
import { RawShot } from "./scenes/RawShot";
import { F_INTER } from "./kit/premium/theme";
import { renderRecalComp, OVERLAY_KINDS } from "./FedererComponents";
import { OKRA_BROLL } from "./okra_broll";
import { OKRA_COMPS } from "./okra_beats";
import { OKRA_SCRIMS, OKRA_EMPH, OKRA_ENDCARD, OKRA_END } from "./okra_hooks";

// ── DR. FEDERER · #2 "Okra / firmeza de la piel" ────────────────────────────
// Template mejorado (= Main_romnoc): b-roll con cámara viva → avatar (full en
// huecos / PiP sobre b-roll / oculto en takeovers) → componentes → sonido firma.
const TEAL = "#12B3AE";
const CORAL = "#E0523E";
const BG = "#0E1D23";

export const TOTAL_FRAMES_OKRA = Math.round(OKRA_END * 30);

function buildWindows(): AvatarWindow[] {
  const CORNER: AvatarWindow["mode"] = "cornerTR";
  const HOOK = 6;
  const brollIv: [number, number][] = [];
  for (const b of OKRA_BROLL) { if ((b as any).av) continue; brollIv.push([b.start, b.start + b.dur]); }
  brollIv.sort((a, b) => a[0] - b[0]);
  const mergedBroll: [number, number][] = [];
  for (const iv of brollIv) {
    const last = mergedBroll[mergedBroll.length - 1];
    if (last && iv[0] - last[1] < 1.5) last[1] = Math.max(last[1], iv[1]);
    else mergedBroll.push([iv[0], iv[1]]);
  }
  const hideIv: [number, number][] = [
    ...OKRA_COMPS.filter((c: any) => !OVERLAY_KINDS.has(c.kind) || (c as any).av).map((c: any) => [c.start, c.start + c.dur] as [number, number]),
    ...OKRA_BROLL.filter((b: any) => b.av).map((b: any) => [b.start, b.start + b.dur] as [number, number]),
    ...OKRA_EMPH.map((e) => [e.from, e.to] as [number, number]),
  ];
  const inAny = (ivs: [number, number][], t: number) => ivs.some(([a, b]) => t >= a && t < b);
  const modeAt = (t: number): AvatarWindow["mode"] => {
    if (t < HOOK) return "full";
    if (inAny(hideIv, t)) return "hidden";
    if (inAny(mergedBroll, t)) return CORNER;
    return "full"; // hueco sin b-roll → avatar a PANTALLA COMPLETA
  };
  const pts = new Set<number>([0, HOOK]);
  for (const [a, b] of [...mergedBroll, ...hideIv]) { pts.add(a); pts.add(b); }
  const sorted = [...pts].filter((t) => t >= 0 && t < OKRA_END).sort((a, b) => a - b);
  const w: AvatarWindow[] = [];
  let last = "";
  for (const t of sorted) { const m = modeAt(t + 0.02); if (m !== last) { w.push({ start: +t.toFixed(2), mode: m }); last = m; } }
  if (!w.length || w[0].start > 0) w.unshift({ start: 0, mode: "full" });
  return w;
}
const AVATAR_WINDOWS = buildWindows();

const KIND_ORD: number[] = (() => {
  const seen: Record<string, number> = {};
  return OKRA_COMPS.map((c: any) => (seen[c.kind] = (seen[c.kind] ?? -1) + 1));
})();

// sonido: whoosh en cambios de sección/explicación, golpe en la 1ª presentación
const SECTION_KINDS = new Set(["pchapter", "avexplain", "avblur", "avsplit", "mito", "pprotocol"]);
const WHOOSH_TS = OKRA_COMPS.filter((c: any) => SECTION_KINDS.has(c.kind)).map((c: any) => c.start);
const BOOM_TS = (OKRA_COMPS.find((c: any) => c.kind === "plt") || OKRA_COMPS.find((c: any) => c.kind === "avexplain") || { start: 6 }).start;

export const MainOkra: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — b-roll con cámara viva */}
      {OKRA_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" kbBoost={1.9} />
        </Sequence>
      ))}

      {/* CAPA 2 — avatar */}
      <AvatarLayer src="okra_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 3 — componentes */}
      {OKRA_COMPS.map((c: any, i: number) => (
        <Sequence key={`c_${c.id || i}`} from={sec(c.start)} durationInFrames={Math.max(1, sec(c.dur))}>
          {renderRecalComp(c, Math.max(1, sec(c.dur)), KIND_ORD[i])}
        </Sequence>
      ))}

      {/* OVERLAY — scrims */}
      {OKRA_SCRIMS.map((s, i) => (
        <Sequence key={`s_${i}`} from={sec(s.start)} durationInFrames={sec(Math.max(1.4, s.dur))} layout="none">
          <AvatarScrimText durationInFrames={sec(Math.max(1.4, s.dur))} impact={s.word} accentColor={s.accent === "coral" ? CORAL : TEAL} font={F_INTER} fontSize={150} />
        </Sequence>
      ))}

      {/* OVERLAY — emphasis */}
      {OKRA_EMPH.map((e, i) => (
        <Sequence key={`e_${i}`} from={sec(e.from)} durationInFrames={sec(Math.max(1.4, e.to - e.from))} layout="none">
          <EmphasisMoment durationInFrames={sec(Math.max(1.4, e.to - e.from))} avatarFromSec={e.from} text={e.text} avatarSrc="okra_opt.mp4" />
        </Sequence>
      ))}

      {/* ENDCARD */}
      <Sequence from={sec(OKRA_ENDCARD)} durationInFrames={sec(Math.max(2, OKRA_END - OKRA_ENDCARD))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, OKRA_END - OKRA_ENDCARD))} />
      </Sequence>

      {/* ── DISEÑO DE SONIDO (firma Federer) ── */}
      <Audio src={staticFile("sfx/music_federer.mp3")} volume={(f) => interpolate(f / 30, [0, 2, 4, 56, 66], [0, 0.24, 0.085, 0.085, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Sequence from={0} durationInFrames={sec(15)} layout="none">
        <Audio src={staticFile("sfx/rumble_const.mp3")} loop volume={(f) => interpolate(f / 30, [0, 1, 12, 15], [0, 0.09, 0.09, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
      <Sequence from={Math.max(0, sec(BOOM_TS) - 9)} layout="none"><Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.55} /></Sequence>
      {WHOOSH_TS.map((t, i) => (
        <Sequence key={"wh" + i} from={Math.max(0, sec(t) - 5)} layout="none"><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} /></Sequence>
      ))}
      <Sequence from={sec(OKRA_ENDCARD)} layout="none"><Audio src={staticFile("sfx/music_federer.mp3")} startFrom={sec(20)} volume={(f) => interpolate(f / 30, [0, 2, 34, 42], [0, 0.13, 0.13, 0.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></Sequence>
    </AbsoluteFill>
  );
};
