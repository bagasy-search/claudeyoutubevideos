import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarLayerLoopFcs } from "./scenes/AvatarLayerLoopFcs";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { RelojNoche } from "./scenes/RelojNoche";
import { WhyNightScene } from "./scenes/WhyNightScene";
import { PriceWar } from "./scenes/PriceWar";
import { IngredientDuo } from "./scenes/IngredientDuo";
import { HourDial } from "./scenes/HourDial";
import { PizarraExplica } from "./scenes/PizarraExplica";
import { FedGuideCTA } from "./scenes/FedGuideCTA";
import { DocNameCard } from "./scenes/DocNameCard";
import { F_INTER } from "./kit/premium/theme";
import { FCSMUSCULO_BEATS, FCSMUSCULO_BROLL, FCSMUSCULO_COVER, AVATAR_END, VIDEO_END as VEND } from "./fcsmusculo_beats";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Consejos Salud" · 7 ALIMENTOS QUE GANAN MÚSCULO MIENTRAS DUERMES ──
// ⛔ AVATAR PARCIAL: el mp4 del creador dura 1036.565s sobre un master de 3163.58s.
//    · va EN BUCLE y MUTEADO (AvatarLayerLoopFcs) + <Audio> del master aparte;
//    · después de AVATAR_END los labios NO sincronizan → el avatar NUNCA queda a la vista
//      (cero split, cero full): el contenido cubre el 100% de esa zona.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR_FRAMES = Math.round(1036.565 * 30); // largo REAL del mp4 → el <Loop> lo repite

const NEWFULL = new Set(["avatarpizarra", "mitoverdad", "errorstinger", "guardaesto", "freezezoom",
  "relojnoche", "whynight", "pricewar", "ingredientduo", "hourdial", "pizarraexplica", "guidecta"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "relojnoche" ? 11 : k === "whynight" ? 10 : k === "guidecta" ? 9
  : k === "quote" ? 8 : k === "rule" ? 5 : k === "errorstinger" ? 2.4 : k === "guardaesto" ? 8
  : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5 : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5
  : k === "pricewar" ? 8 : k === "ingredientduo" ? 6.5 : k === "hourdial" ? 6 : k === "pizarraexplica" ? 8.5
  : k === "process" || k === "checklist" || k === "splitlist" ? 9 : 6;

const compBeats = FCSMUSCULO_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FCSMUSCULO_BEATS.filter((b: any) => b.kind === "raw" && /^img\//.test(b.src || ""));
export const TOTAL_FRAMES_FCSMUSCULO = Math.round(VEND * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ ANTI-HUECO: el avatar es el FONDO garantizado en la ZONA AVATAR. Cada contenido cubre SÓLO
// su cobertura real; en el hueco el avatar vuelve a full. En la ZONA FISH nunca vuelve a full
// visible porque el generador dejó el 100% cubierto (colas con foto de respaldo).
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  for (const c of FCSMUSCULO_COVER) {
    // el SPLIT sólo existe mientras el avatar sincroniza labios; en la zona Fish, siempre hidden
    const puedeSplit = c.kind === "video" && c.start + c.cov < AVATAR_END;
    const mode: AvatarWindow["mode"] = puedeSplit && flip ? "halfR" : "hidden";
    if (puedeSplit) flip = !flip;
    pts.push({ start: c.start, mode, pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of compBeats) {
    // ⛔ los OVERLAY (lowerthird / frasecinetica) van ENCIMA: NO deben ocultar al avatar,
    // si no quedan segundos de NEGRO cuando debajo tampoco hay b-roll.
    if (OVERLAY.has(b.kind)) continue;
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);   // pr ASCENDENTE: a igual ms gana el mayor
  const coll: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { coll.push({ start: p.start, mode: p.mode }); last = p.mode; } }

  const HOOK_END = 7.0;
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

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VEND - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "fcsmusculo_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round((b.start % 1036.5) * 30)} objectPos="50% 25%" />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} prompt={b.prompt} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "relojnoche" ? <RelojNoche durationInFrames={d} subtitle={b.subtitle} marks={b.marks} hits={b.hits} />
  : b.kind === "whynight" ? <WhyNightScene durationInFrames={d} dayTitle={b.dayTitle} nightTitle={b.nightTitle} cardText={b.cardText} dayWord={b.dayWord} nightWord={b.nightWord} daySub={b.daySub} nightSub={b.nightSub} />
  : b.kind === "pricewar" ? <PriceWar durationInFrames={d} leftImage={b.leftImage} rightImage={b.rightImage} leftPrice={b.leftPrice} rightPrice={b.rightPrice} leftLabel={b.leftLabel} rightLabel={b.rightLabel} strike={b.strike} subtitle={b.subtitle} verdict={b.verdict} />
  : b.kind === "ingredientduo" ? <IngredientDuo durationInFrames={d} leftImg={b.leftImg} rightImg={b.rightImg} />
  : b.kind === "hourdial" ? <HourDial durationInFrames={d} hour={b.hour} big={b.big} unit={b.unit} label={b.label} tone={b.tone} />
  : b.kind === "pizarraexplica" ? <PizarraExplica durationInFrames={d} eyebrow={b.eyebrow} title={b.title} items={b.items} />
  // ⛔ nametag: renderFederer2Comp NO reenvía `image` y el default de DocNameCard es
  // "img/federer_casual.png", un archivo que NO EXISTE → staticFile 404 → chunk muerto.
  : b.kind === "nametag" ? <DocNameCard durationInFrames={d} name={b.name} role={b.role} image={b.image} focus="50% 30%" />
  : b.kind === "guidecta" ? <FedGuideCTA durationInFrames={d} cover={b.cover} qr={b.qr} domain={b.domain} scanTitle={b.scanTitle} scanSub={b.scanSub} title={b.title} kicker={b.kicker} desc={b.desc} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainFcsmusculo: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — avatar real (0..17:16) + Fish desde la costura. El avatar va MUTEADO.
          El wav es obligatorio: farm.mjs lo mete en el tar por contrato (`public/<slug>.wav`). */}
      <Audio src={staticFile("fcsmusculo.wav")} />

      {/* CAPA 1 — CLIPS (agnes) */}
      {FCSMUSCULO_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (Modal + respaldos + hero gpt-image) */}
      {rawTop.map((b: any) => {
        // ⛔ la duración la manda el `cov` que calculó el generador. Si acá se dibuja MENOS que lo
        // que COVER promete, el avatar está oculto y no hay nada debajo -> NEGRO en pantalla.
        const cap = b.start >= AVATAR_END ? 9 : HERO_CAP;
        const d = Math.max(1, sec((b.cov ?? Math.min(b.dur, cap)) + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR en BUCLE y MUTEADO (full / hidden / split, cero recuadro) */}
      <AvatarLayerLoopFcs src="fcsmusculo_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL}
        avatarFocus={{ x: 0.5, y: 0.3, splitZoom: 1.0 }} avatarFrames={AVATAR_FRAMES} />

      {/* CAPA 4 — COMPONENTES */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre el avatar oscurecido (⚠ EDITADO A MANO al tema de ESTE video) */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)}
          setup="¿Pesas lo mismo de siempre y aun así te cuesta cargar el garrafón? Un médico lo explica…"
          impact="7 ALIMENTOS QUE GANAN MÚSCULO MIENTRAS DUERMES"
          accentColor={TEAL} font={F_INTER} fontSize={92} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VEND - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - CTA_AT))}
          subtitle="Cada semana, salud real y sencilla para después de los 60" />
      </Sequence>
    </AbsoluteFill>
  );
};
