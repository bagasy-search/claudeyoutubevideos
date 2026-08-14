import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
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
import { FED17_BEATS } from "./federer17_beats";
import { FED17_BROLL } from "./federer17_broll";
import { TALKS17 } from "./federer17_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Building" · Dr. Federer · 7 EJERCICIOS TESTOSTERONA +40 ──────
// Avatar en 3 modos, CERO recuadro: FULL (habla fuerte / arranca sección) · HIDDEN
// (imagen/paso/página/clip a pantalla completa — DOMINA) · SPLIT halfR (avatar mitad
// derecha + imagen mitad izquierda). Páginas de libro y Federer-cocina = SIEMPRE hidden.
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 16 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = FED17_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FED17_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...FED17_BEATS.map((b: any) => b.start + b.dur), FED17_BROLL.length ? FED17_BROLL[FED17_BROLL.length - 1].start + FED17_BROLL[FED17_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_FED17 = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// FULL breve del avatar: arranque de cada sección grande (se presenta y se esconde)
const FULL_AT: number[] = [];
FED17_BEATS.filter((b: any) => /^(medicina|tamano|antiox|honesto|receta|dos_formas|sol|error|detalle|injerto1|injerto2|elena_vuelve|clara|s1|s2|s3|primera_noche|cierre)$/.test(b.key) && (b.id.endsWith("_0")))
  .forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  let flip = false;
  const content = [...FED17_BROLL.map((b: any) => ({ start: b.start, src: b.src })), ...rawTop.map((b: any) => ({ start: b.start, src: b.src }))].sort((a, b) => a.start - b.start);
  for (const b of content) {
    const forceHidden = /libro|cocina|pagina|guia|federer_cocina/.test(b.src || "");
    const mode: AvatarWindow["mode"] = forceHidden ? "hidden" : (flip ? "halfR" : "hidden");
    if (!forceHidden) flip = !flip;
    pts.push({ start: b.start, mode, pr: 0 });
  }
  // GAP FILL: cuando el próximo contenido (b-roll/foto) tarda >7.5s, el b-roll se
  // congelaría → en su lugar, avatar FULL desde start+6.8s hasta que llegue el próximo.
  for (let i = 0; i < content.length; i++) {
    const nextStart = i + 1 < content.length ? content[i + 1].start : VIDEO_END;
    if (nextStart - content[i].start > 7.5) pts.push({ start: +(content[i].start + 6.8).toFixed(2), mode: "full", pr: 2 });
  }
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue; // overlays (lowerthird/frasecinetica) NO esconden al avatar
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 3 });
    pts.push({ start: b.start + d, mode: "hidden", pr: 1 });
  }
  for (const s of FULL_AT) { pts.push({ start: s, mode: "full", pr: 4 }); pts.push({ start: +(s + 2.6).toFixed(2), mode: "hidden", pr: 2 }); }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s: number) => TALKS17.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = p.pr < 3 && talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  for (const t of TALKS17) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "hidden" }); }
  w.sort((a, b) => a.start - b.start);
  const coll: AvatarWindow[] = [];
  for (const x of w) { if (!coll.length || coll[coll.length - 1].mode !== x.mode) coll.push(x); }

  // Minuto 1 = plan del DIRECTOR (sin hook hardcodeado): el avatar sigue los beats.
  return coll;
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
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "federer17_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || "federer17_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainFederer17: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo */}
      {FED17_BROLL.map((b) => {
        const dd = Math.max(1, Math.min(sec(b.dur) + 3, sec(7.5)));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS fe7_*.png TOPEADAS (~3.6s) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP)));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden / split halfR, cero recuadro) */}
      <AvatarLayer src="federer17_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} avatarFocus={{ x: 0.48, splitZoom: 1.12 }} />

      {/* CAPA 4 — COMPONENTES / diagramas, TOPEADOS */}
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
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} subtitle="Cada semana, salud y vitalidad real para después de los 60" />
      </Sequence>
    </AbsoluteFill>
  );
};
