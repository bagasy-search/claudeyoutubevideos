import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
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
import { HourDial } from "./scenes/HourDial";
import { PriceWar } from "./scenes/PriceWar";
import { IngredientDuo } from "./scenes/IngredientDuo";
import { BenefitLockReveal } from "./scenes/BenefitLockReveal";
import { F_INTER } from "./kit/premium/theme";
import { GRVASELINE_BEATS, GRVASELINE_BROLL, GRVASELINE_COVER } from "./grvaseline_beats";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Golden Remedies" (EN) · WHY DOCTORS NEVER TELL YOU TO RUB VASELINE HERE AT NIGHT ───────
// Clon de Main_estoalos70 (= Main_fcscanela + FIX ANTI-HUECO + FIX OVERLAY). Diferencias de ESTE video:
//  · el avatar es un BUCLE: la creadora grabo 10:30.6 de los 37:41, asi que grvaseline_opt.mp4 es el
//    lean repetido con el master de Fish muxeado. El lipsync SOLO calza hasta la 1a costura (630.6s).
//  · POR ESO se prohibe el split halfR pasada la costura: media pantalla con una cara hablando
//    fuera de sincro se nota muchisimo mas que b-roll a pantalla completa. Antes de la costura si.
//  · avatarFocus medido en ESTE clip: la cara cae a la IZQUIERDA del centro (x 0.45), no a la derecha.
const AVATAR_CYCLE = 630.60;  // largo del tramo real de avatar; despues es bucle
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom",
  "hourdial", "pricewar", "ingredientduo", "benefitlock"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 4.2;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2.4 : k === "guardaesto" ? 9 : k === "mitoverdad" ? 6.5 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5 : k === "process" || k === "checklist" ? 9
  : k === "hourdial" ? 5 : k === "pricewar" ? 8 : k === "ingredientduo" ? 7 : k === "benefitlock" ? 7.5
  : k === "callout" ? 6.5 : k === "blurexplainer" ? 7 : k === "splitlist" ? 8.5 : 6;

const compBeats = GRVASELINE_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = GRVASELINE_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...GRVASELINE_BEATS.map((b: any) => b.start + b.dur),
  GRVASELINE_BROLL.length ? GRVASELINE_BROLL[GRVASELINE_BROLL.length - 1].start + GRVASELINE_BROLL[GRVASELINE_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_GRVASELINE = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ FIX ANTI-HUECO: el avatar es el FONDO garantizado. Cada contenido cubre SOLO su cobertura
// real (`cov`); apenas termina y hasta el próximo contenido, el avatar vuelve a FULL.
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  for (const c of GRVASELINE_COVER) {
    const forceHidden = c.kind === "photo";     // las fotos HERO van SIEMPRE a pantalla completa
    // ⛔ BUCLE: pasada la 1a costura el lipsync ya no calza -> nada de media pantalla con su cara.
    const preSeam = c.start < AVATAR_CYCLE - 0.5;
    const mode: AvatarWindow["mode"] = (forceHidden || !preSeam) ? "hidden" : (flip ? "halfR" : "hidden");
    if (c.kind === "video" && !forceHidden && preSeam) flip = !flip;
    pts.push({ start: c.start, mode, pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  // ⛔ FIX (auditor, 1ra corrida): los OVERLAY (lowerthird / frasecinetica) están diseñados para ir
  // ENCIMA del avatar — no deben ocultarlo. Ocultándolos, si además no había b-roll debajo quedaba
  // PANTALLA NEGRA: pasó 1.3s en 300.5s ("no te matan, te avisan"). El avatar es el fondo garantizado.
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue;
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
  }
  // pr ASCENDENTE: a igual ms gana el de MAYOR pr (colapso "last wins"). Con DESC el "full" del
  // fin de un clip pisa el "hidden" del próximo y el avatar tapa el 80% del b-roll.
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);
  const coll: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { coll.push({ start: p.start, mode: p.mode }); last = p.mode; } }

  const HOOK_END = 7.0;
  const post = coll.filter((wnd) => wnd.start < 1.4 || wnd.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  // ⛔ FIX (AUDITOR, 1ra corrida): al terminar el HOOK NO se puede "retomar" el hidden que puso el
  // propio hook — hay que preguntar si en ese instante HAY contenido. Acá el 1er clip recién
  // arranca en 10.38s, así que el avatar quedaba oculto sobre nada: 3.57s de PANTALLA NEGRA
  // medidos con blackdetect entre 6.8s y 10.38s, y en el peor lugar posible (arranque del video).
  const hayContenido = (t: number) =>
    GRVASELINE_COVER.some((c: any) => t >= c.start - 0.05 && t < c.start + c.cov - 0.05) ||
    compBeats.some((b: any) => !OVERLAY.has(b.kind) && t >= b.start && t < b.start + compDur(b));
  post.push({ start: HOOK_END, mode: hayContenido(HOOK_END) ? "hidden" : "full" });
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
    const e = i + 1 < AVATAR_WINDOWS.length ? AVATAR_WINDOWS[i + 1].start : VIDEO_END;
    HALFR.push([s, e]);
  }
}
const inHalfR = (t: number) => HALFR.some(([s, e]) => t >= s - 0.05 && t < e - 0.1);
const HalfLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden", background: BG }}>{children}</div>
);

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "grvaseline_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} objectPos="50% 26%" />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || "grvaseline_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} mythLabel={b.mythLabel} truthLabel={b.truthLabel} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} prompt={b.prompt} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  // ── los 4 componentes-ESCENA que el Main viejo no mapeaba ──
  : b.kind === "hourdial" ? <HourDial durationInFrames={d} hour={b.hour} big={b.big} unit={b.unit} label={b.label} tone={b.tone} />
  : b.kind === "pricewar" ? <PriceWar durationInFrames={d} leftImage={b.leftImage} rightImage={b.rightImage} leftPrice={b.leftPrice} rightPrice={b.rightPrice} leftLabel={b.leftLabel} rightLabel={b.rightLabel} strike={b.strike} subtitle={b.subtitle} verdict={b.verdict} />
  : b.kind === "ingredientduo" ? <IngredientDuo durationInFrames={d} leftImg={b.leftImg} rightImg={b.rightImg} />
  : b.kind === "benefitlock" ? <BenefitLockReveal durationInFrames={d} index={b.index} cards={b.cards} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainGrvaseline: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (clips agnes) */}
      {GRVASELINE_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS HERO del Dr. (gpt-image-2 con su cara), a pantalla completa */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP) + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden / split halfR, cero recuadro).
          avatarFocus medido en ESTE clip: la cara está apenas a la derecha del centro. */}
      <AvatarLayer src="grvaseline_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} avatarFocus={{ x: 0.45, y: 0.30, splitZoom: 1.12 }} />

      {/* CAPA 4 — COMPONENTES */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — ⚠ GOTCHA de clon: este texto va A MANO al tema nuevo (si se clona con sed queda el del otro video) */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="The grounds you tip into the bin every morning hold more of it than the $80 jar on your shelf." impact="COFFEE ON MY FACE" accentColor={TEAL} font={F_INTER} fontSize={104} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
