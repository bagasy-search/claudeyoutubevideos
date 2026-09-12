import { AbsoluteFill, Sequence, Audio, staticFile, interpolate } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { EmphasisMoment } from "./scenes/EmphasisMoment";
import { Endcard } from "./scenes/Endcard";
import { RawShot } from "./scenes/RawShot";
import { F_INTER } from "./kit/premium/theme";
import { renderRecalComp, OVERLAY_KINDS } from "./FedererComponents";
import { GUANTE_BROLL } from "./guante_broll";
import { GUANTE_COMPS } from "./guante_beats";
import { GUANTE_SCRIMS, GUANTE_EMPH, GUANTE_ENDCARD, GUANTE_END } from "./guante_hooks";

// ── DR. FEDERER · #2 "Guante / firmeza de la piel" ────────────────────────────
// Template mejorado (= Main_romnoc): b-roll con cámara viva → avatar (full en
// huecos / PiP sobre b-roll / oculto en takeovers) → componentes → sonido firma.
const TEAL = "#12B3AE";
const CORAL = "#E0523E";
const BG = "#0E1D23";

export const TOTAL_FRAMES_GUANTE = Math.round(GUANTE_END * 30);

function buildWindows(): AvatarWindow[] {
  const CORNER: AvatarWindow["mode"] = "cornerTR";
  const HOOK = 6;
  const brollIv: [number, number][] = [];
  for (const b of GUANTE_BROLL) { if ((b as any).av) continue; brollIv.push([b.start, b.start + b.dur]); }
  brollIv.sort((a, b) => a[0] - b[0]);
  const mergedBroll: [number, number][] = [];
  for (const iv of brollIv) {
    const last = mergedBroll[mergedBroll.length - 1];
    if (last && iv[0] - last[1] < 1.5) last[1] = Math.max(last[1], iv[1]);
    else mergedBroll.push([iv[0], iv[1]]);
  }
  const hideIv: [number, number][] = [
    ...GUANTE_COMPS.filter((c: any) => !OVERLAY_KINDS.has(c.kind) || (c as any).av).map((c: any) => [c.start, c.start + c.dur] as [number, number]),
    ...GUANTE_BROLL.filter((b: any) => b.av).map((b: any) => [b.start, b.start + b.dur] as [number, number]),
    ...GUANTE_EMPH.map((e) => [e.from, e.to] as [number, number]),
  ];
  const inAny = (ivs: [number, number][], t: number) => ivs.some(([a, b]) => t >= a && t < b);
  // VARIACIÓN del avatar = variar la CÁMARA/plano (NO mover el recuadro de esquina):
  //   full (pantalla completa de él) · right/left (50/50: él una mitad + imagen la otra)
  //   · cornerTR (PiP SIEMPRE arriba-derecha, un solo lugar) · hidden (solo se escucha).
  // Pesado en 50/50 y full, como pidió el usuario.
  const POOL: AvatarWindow["mode"][] = ["right", "cornerTR", "left", "full", "right", "hidden", "left", "cornerTR"];
  const segMode = (t: number): AvatarWindow["mode"] => {
    const i = mergedBroll.findIndex(([a, b]) => t >= a && t < b);
    return i < 0 ? "full" : POOL[i % POOL.length];
  };
  // IDENTIDAD: ventanas FULL periódicas (~10s cada ~50s) → ≥10s de avatar full por minuto.
  const idFull: [number, number][] = [];
  for (let t = HOOK + 28; t < GUANTE_END - 12; t += 50) idFull.push([t, t + 10]);
  const modeAt = (t: number): AvatarWindow["mode"] => {
    if (t < HOOK) return "full";
    if (inAny(hideIv, t)) return "hidden";
    if (inAny(idFull, t)) return "full"; // identidad de canal
    if (inAny(mergedBroll, t)) return segMode(t);
    return "full"; // hueco sin b-roll → avatar a PANTALLA COMPLETA
  };
  const pts = new Set<number>([0, HOOK]);
  for (const [a, b] of [...mergedBroll, ...hideIv, ...idFull]) { pts.add(a); pts.add(b); }
  const sorted = [...pts].filter((t) => t >= 0 && t < GUANTE_END).sort((a, b) => a - b);
  const w: AvatarWindow[] = [];
  let last = "";
  for (const t of sorted) { const m = modeAt(t + 0.02); if (m !== last) { w.push({ start: +t.toFixed(2), mode: m }); last = m; } }
  if (!w.length || w[0].start > 0) w.unshift({ start: 0, mode: "full" });
  return w;
}
const AVATAR_WINDOWS = buildWindows();

const KIND_ORD: number[] = (() => {
  const seen: Record<string, number> = {};
  return GUANTE_COMPS.map((c: any) => (seen[c.kind] = (seen[c.kind] ?? -1) + 1));
})();

// sonido: whoosh en cambios de sección/explicación, golpe en la 1ª presentación
const SECTION_KINDS = new Set(["pchapter", "avexplain", "avblur", "avsplit", "mito", "pprotocol"]);
const WHOOSH_TS = GUANTE_COMPS.filter((c: any) => SECTION_KINDS.has(c.kind)).map((c: any) => c.start);
const BOOM_TS = (GUANTE_COMPS.find((c: any) => c.kind === "plt") || GUANTE_COMPS.find((c: any) => c.kind === "avexplain") || { start: 6 }).start;

export const MainGuante: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — b-roll con cámara viva */}
      {GUANTE_BROLL.map((b) => (
        <Sequence key={b.name} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))}>
          <RawShot durationInFrames={Math.max(1, sec(b.dur))} src={b.src} hue="cold" kbBoost={1.9} />
        </Sequence>
      ))}

      {/* CAPA 2 — avatar */}
      <AvatarLayer src="guante_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 3 — componentes */}
      {GUANTE_COMPS.map((c: any, i: number) => (
        <Sequence key={`c_${c.id || i}`} from={sec(c.start)} durationInFrames={Math.max(1, sec(c.dur))}>
          {renderRecalComp(c, Math.max(1, sec(c.dur)), KIND_ORD[i])}
        </Sequence>
      ))}

      {/* OVERLAY — scrims */}
      {GUANTE_SCRIMS.map((s, i) => (
        <Sequence key={`s_${i}`} from={sec(s.start)} durationInFrames={sec(Math.max(1.4, s.dur))} layout="none">
          <AvatarScrimText durationInFrames={sec(Math.max(1.4, s.dur))} impact={s.word} accentColor={s.accent === "coral" ? CORAL : TEAL} font={F_INTER} fontSize={150} />
        </Sequence>
      ))}

      {/* OVERLAY — emphasis */}
      {GUANTE_EMPH.map((e, i) => (
        <Sequence key={`e_${i}`} from={sec(e.from)} durationInFrames={sec(Math.max(1.4, e.to - e.from))} layout="none">
          <EmphasisMoment durationInFrames={sec(Math.max(1.4, e.to - e.from))} avatarFromSec={e.from} text={e.text} avatarSrc="guante_opt.mp4" />
        </Sequence>
      ))}

      {/* ENDCARD */}
      <Sequence from={sec(GUANTE_ENDCARD)} durationInFrames={sec(Math.max(2, GUANTE_END - GUANTE_ENDCARD))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, GUANTE_END - GUANTE_ENDCARD))} />
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
      <Sequence from={sec(GUANTE_ENDCARD)} layout="none"><Audio src={staticFile("sfx/music_federer.mp3")} startFrom={sec(20)} volume={(f) => interpolate(f / 30, [0, 2, 34, 42], [0, 0.13, 0.13, 0.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></Sequence>
    </AbsoluteFill>
  );
};
