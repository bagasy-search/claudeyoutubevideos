import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { FedOilCarousel } from "../../FedererKit";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { FedGuideCTA } from "./scenes/FedGuideCTA";
import { GB_BEATS } from "./greenglove_beats";
import { GB_BROLL } from "./greenglove_broll";
import { TALKS_GB } from "./greenglove_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Dr. Federer | Holistic Health" · THE GREEN GLOVE (rosemary · manchas en las manos) ──
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom", "guidecta", "carousel"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (b: any): number => {
  if (b.kind === "freezezoom") return /lamina/.test(b.image || "") ? Math.max(2, b.dur) : /dg_|cmp_|handmap|facemap/.test(b.image || "") ? 7 : 4.5;
  const k = b.kind;
  return k === "guidecta" ? 12 : k === "diagram" ? 10 : k === "board" ? 16 : k === "quote" ? 8 : k === "rule" ? 5
    : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6
    : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;
};

const compBeats = GB_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = GB_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...GB_BEATS.map((b: any) => b.start + b.dur), GB_BROLL.length ? GB_BROLL[GB_BROLL.length - 1].start + GB_BROLL[GB_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_GG = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b), room));
};

// FULL breve del avatar: arranque de cada sección grande
const FULL_AT: number[] = [];
GB_BEATS.filter((b: any) => /^(hook1|aged_first|creams|reveal|glove_intro|lamina_intro|warn_intro|close_do)$/.test(b.key) && (b.id.endsWith("_0")))
  .forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Iv = { s: number; e: number; mode: AvatarWindow["mode"] };
  const compIv: Iv[] = [];
  for (const b of compBeats) { if (OVERLAY.has(b.kind)) continue; compIv.push({ s: b.start, e: b.start + compDur(b), mode: "hidden" }); }
  const contentRaw = [
    ...GB_BROLL.map((b: any) => ({ s: b.start, e: b.start + Math.min(b.dur + 3, 7.5), src: b.src })),
    ...rawTop.map((b: any) => ({ s: b.start, e: b.start + (b.hold ? Math.min(b.dur, 6.5) : Math.min(b.dur, HERO_CAP)), src: b.src })),
  ].sort((a, b) => a.s - b.s);
  const contentIv: Iv[] = [];
  let flip = false;
  for (const c of contentRaw) {
    // Presenter photos + láminas → FULL-screen (hidden). Stock clips (greenglove_bNN) → split halfR/hidden.
    const forceHidden = /lamina|handmap|rosemary|wrap|crush|mix|apply|kitchen|desk|libro|guia/.test(c.src || "");
    const mode: AvatarWindow["mode"] = forceHidden ? "hidden" : (flip ? "halfR" : "hidden");
    if (!forceHidden) flip = !flip;
    contentIv.push({ s: c.s, e: c.e, mode });
  }
  const inIv = (ivs: Iv[], s: number) => ivs.find((x) => s >= x.s - 0.02 && s < x.e - 0.02);

  const w: AvatarWindow[] = [];
  let last: AvatarWindow["mode"] | null = null;
  for (let s = 0; s <= VIDEO_END + 0.001; s += 0.1) {
    // PRIORIDAD: componente(hidden) > CONTENIDO b-roll/foto(hidden/halfR) > avatar full.
    const comp = inIv(compIv, s);
    const cont = inIv(contentIv, s);
    let mode: AvatarWindow["mode"];
    if (comp) mode = "hidden";
    else if (cont) mode = cont.mode;
    else mode = "full";
    if (mode !== last) { w.push({ start: +s.toFixed(2), mode }); last = mode; }
  }
  if (!w.length || w[0].start > 0) w.unshift({ start: 0, mode: "full" });
  return w;
}
const AVATAR_WINDOWS = buildWindows();

const HALFR: [number, number][] = [];
for (let i = 0; i < AVATAR_WINDOWS.length; i++) {
  if (AVATAR_WINDOWS[i].mode === "halfR") {
    const s = AVATAR_WINDOWS[i].start;
    const e = i + 1 < AVATAR_WINDOWS.length ? AVATAR_WINDOWS[i + 1].start : VIDEO_END;
    HALFR.push([s, e]);
  }
}
const inHalfR = (t: number) => HALFR.some(([s, e]) => t >= s - 0.05 && t < e - 0.1);
const HalfLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden", background: "#0E1D23" }}>{children}</div>
);

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "greenglove_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || "greenglove_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} mythLabel="MYTH" truthLabel="THE TRUTH" />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : b.kind === "guidecta" ? <FedGuideCTA durationInFrames={d} cover={b.cover} qr={b.qr} title={b.title} kicker={b.kicker} desc={b.desc} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "carousel" ? <FedOilCarousel cards={(b.cards || []).map((c: any) => ({ ...c, image: staticFile(c.image) }))} focus={typeof b.focus === "number" ? b.focus : -1} intro={b.intro === true} accent={TEAL} kicker={b.kicker} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainGreenglove: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo */}
      {GB_BROLL.map((b) => {
        const dd = Math.max(1, Math.min(sec(b.dur) + 3, sec(7.5)));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS del presentador TOPEADAS o sostenidas (hold) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(b.hold ? Math.min(b.dur, 6.5) : Math.min(b.dur, HERO_CAP)));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden / split halfR, cero recuadro) */}
      <AvatarLayer src="greenglove_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} avatarFocus={{ x: 0.5, splitZoom: 1.12 }} />

      {/* CAPA 4 — COMPONENTES / lámina / CTA, TOPEADOS por beat */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} kicker="Dr. Federer" title="Subscribe" subtitle="Simple, natural skincare for firmer, younger-looking skin after 50" cta="SUBSCRIBE" />
      </Sequence>
    </AbsoluteFill>
  );
};
