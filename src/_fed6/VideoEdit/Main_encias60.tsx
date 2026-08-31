import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarLayerLoopAgu } from "./scenes/AvatarLayerLoopAgu";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { PizarraExplica } from "./scenes/PizarraExplica";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { GuiaCTA3D } from "./scenes/GuiaCTA3D";
import { F_INTER } from "./kit/premium/theme";
import { ENCIAS60_BEATS, ENCIAS60_BROLL, ENCIAS60_PHOTOS, ENCIAS60_COVER, AVATAR_END, VIDEO_END as VEND, AVATAR_FRAMES, ENDCARD_AT } from "./encias60_beats";

// ── CANAL "Federer - Más Salud, Más Vida" · ENCÍAS RETRAÍDAS +60 ─────────────
// ⛔ AVATAR PARCIAL: el mp4 del creador dura 739.0 s sobre un máster de 1281.78 s.
//    · en la ZONA AVATAR (<739) el presentador es el fondo garantizado y respira en los huecos;
//    · en la ZONA FISH (>739) el lipsync ya no calza → el avatar va EN BUCLE, MUTEADO y NUNCA
//      queda a la vista: el contenido (clips + fotos + componentes full) cubre el 100 %.
//    · UN SOLO <Audio> con el máster; el avatar va muted (AvatarLayerLoopAgu, OffthreadVideo).
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const OVERLAY = new Set(["lowerthird", "frasecinetica"]);   // van ENCIMA: no ocultan al avatar
const NOCAP = new Set(["avatarpizarra"]);
const isComp = (k: string) => k !== "raw";

const capOf = (k: string): number =>
  k === "diagram" ? 9.5 : k === "guidecta" ? 11 : k === "guardaesto" ? 10 : k === "mitoverdad" ? 8.5
  : k === "pizarraexplica" ? 8.5 : k === "avatarpizarra" ? 9 : k === "errorstinger" ? 2.4
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5 : 6;

const compBeats = ENCIAS60_BEATS.filter((b: any) => isComp(b.kind));
export const TOTAL_FRAMES_ENCIAS60 = Math.round(VEND * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ ANTI-HUECO: el avatar (en bucle) es el fondo. Cada contenido cubre SÓLO su cobertura real;
// en el hueco el avatar vuelve a full en la ZONA AVATAR. En la ZONA FISH el gen dejó el 100 %
// cubierto, así que ahí nunca vuelve a full visible.
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  for (const c of ENCIAS60_COVER) {
    const puedeSplit = c.kind === "video" && c.start + c.cov < AVATAR_END;
    const mode: AvatarWindow["mode"] = puedeSplit && flip ? "halfR" : "hidden";
    if (puedeSplit) flip = !flip;
    pts.push({ start: c.start, mode, pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue;
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);
  const coll: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { coll.push({ start: p.start, mode: p.mode }); last = p.mode; } }

  const HOOK_END = 7.2;
  const post = coll.filter((w) => w.start < 1.4 || w.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  const resume = coll.filter((w) => w.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= 1.4 ? "hidden" : (resume?.mode ?? "full") });
  post.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of post) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

const HALFR: [number, number][] = [];
for (let i = 0; i < AVATAR_WINDOWS.length; i++) {
  if (AVATAR_WINDOWS[i].mode === "halfR") {
    const s = AVATAR_WINDOWS[i].start;
    const e = i + 1 < AVATAR_WINDOWS.length ? AVATAR_WINDOWS[i + 1].start : VEND;
    HALFR.push([s, e]);
  }
}
const inHalfR = (t: number) => HALFR.some(([s, e]) => t >= s - 0.05 && t < e - 0.1);
const HalfLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden", background: BG }}>{children}</div>
);

const renderComp = (b: any, d: number) =>
  b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} prompt={b.prompt} />
  : b.kind === "diagram" ? <DiagramBoard durationInFrames={d} pages={b.pages} medico tag={b.tag} fit="cover" />
  : b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar="encias60_opt.mp4" avatarFrom={Math.round(b.start * 30)} objectPos="52% 30%" />
  : b.kind === "pizarraexplica" ? <PizarraExplica durationInFrames={d} eyebrow={b.eyebrow} title={b.title} items={b.items} side={b.side} />
  : b.kind === "guidecta" ? <GuiaCTA3D durationInFrames={d} cover={b.cover} qr={b.qr} domain={b.domain} kicker={b.kicker} title={b.title} desc={b.desc} scanTitle={b.scanTitle} scanSub={b.scanSub} />
  : null;

export const MainEncias60: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — avatar real (0..12:19) + Fish desde la costura. El avatar va MUTEADO. */}
      <Audio src={staticFile("encias60.wav")} />

      {/* CAPA 1 — CLIPS (agnes) */}
      {ENCIAS60_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (agnes b-roll + hero gpt-image con la cara real del Dr. Federer + camas) */}
      {ENCIAS60_PHOTOS.map((b: any) => {
        const cov = (b as any).cov ?? Math.min(b.dur, 6);
        const d = Math.max(1, sec(cov + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR en BUCLE y MUTEADO (full / hidden / split, cero recuadro) */}
      <AvatarLayerLoopAgu src="encias60_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL}
        avatarFocus={{ x: 0.5, y: 0.30, splitZoom: 1.10 }} avatarFrames={AVATAR_FRAMES} />

      {/* CAPA 4 — COMPONENTES */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre el avatar oscurecido (EDITADO al tema de ESTE video) */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)}
          setup="Esa encía que se te corre para atrás tiene nombre, tiene causa, y tiene mucho para hacer en tu casa."
          impact="NO ES LA EDAD"
          accentColor={TEAL} font={F_INTER} fontSize={128} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(ENDCARD_AT)} durationInFrames={sec(Math.max(2, VEND - ENDCARD_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - ENDCARD_AT))}
          kicker="Dr. Federer" title="Suscribite"
          subtitle="Salud real para después de los 60. Volvamos a reírnos, fuerte y sin taparnos la boca."
          cta="SUSCRIBIRME" />
      </Sequence>
    </AbsoluteFill>
  );
};
