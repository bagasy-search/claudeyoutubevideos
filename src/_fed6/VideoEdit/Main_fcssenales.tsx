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
import { PizarraExplica } from "./scenes/PizarraExplica";
import { FedGuideCTA } from "./scenes/FedGuideCTA";
import { DocNameCard } from "./scenes/DocNameCard";
// ── ESCENAS PREMIUM propias de este video (capas, profundidad, anillo 3D) ──
import { ManchaRing3D } from "./scenes/ManchaRing3D";
import { PhotoTriptych } from "./scenes/PhotoTriptych";
import { DepthPhotoScene } from "./scenes/DepthPhotoScene";
import { GlassTestScene } from "./scenes/GlassTestScene";
import { SkinLayerBuild } from "./scenes/SkinLayerBuild";
import { BodyMapScene } from "./scenes/BodyMapScene";
import { PlateOrderScene } from "./scenes/PlateOrderScene";
import { BeforeAfterPush } from "./scenes/BeforeAfterPush";
import { F_INTER } from "./kit/premium/theme";
import { FCSSENALES_BEATS, FCSSENALES_BROLL, FCSSENALES_COVER, AVATAR_END, VIDEO_END as VEND } from "./fcssenales_beats";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Consejos Salud" · MANCHAS SIN RAZÓN ──────────────────────
// ⛔ AVATAR PARCIAL: el mp4 del creador dura 900.245s sobre un master de 3152.1s.
//    · va EN BUCLE y MUTEADO (AvatarLayerLoopFcs) + <Audio> del master aparte;
//    · después de AVATAR_END los labios NO sincronizan → el avatar NUNCA queda a la vista
//      (cero split, cero full): el contenido cubre el 100% de esa zona.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR_FRAMES = Math.round(900.245 * 30); // largo REAL del mp4 → el <Loop> lo repite

const NEWFULL = new Set(["avatarpizarra", "mitoverdad", "errorstinger", "guardaesto", "freezezoom",
  "pizarraexplica", "guidecta",
  "ring3d", "triptych", "depthphoto", "glasstest", "skinlayers", "bodymap", "plateorder", "beforeafter"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
// ⚠ TIENE QUE SER IDÉNTICO a `capOfDur` de gen_fcssenales.mjs o la compuerta anti-hueco miente.
const CAPS: Record<string, number> = { avatarpizarra: 9, mitoverdad: 6, bars: 6.5, splitlist: 9, checklist: 9,
  lowerthird: 6, frasecinetica: 5.5, nametag: 6, process: 9, callout: 6, diagram: 10, errorstinger: 2.4,
  guardaesto: 8, freezezoom: 4.5, pizarraexplica: 8.5, relojnoche: 11, whynight: 10, pricewar: 8,
  ingredientduo: 6.5, hourdial: 6, guidecta: 9, headline: 5, quote: 8, rule: 5, chips: 7, ingredients: 9,
  annotated: 7, stat: 6,
  ring3d: 7, triptych: 10, depthphoto: 7, glasstest: 9, skinlayers: 11, bodymap: 12, plateorder: 11, beforeafter: 8 };
const capOf = (k: string): number => CAPS[k] ?? 6;

const compBeats = FCSSENALES_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FCSSENALES_BEATS.filter((b: any) => b.kind === "raw" && /^img\//.test(b.src || ""));
export const TOTAL_FRAMES_FCSSENALES = Math.round(VEND * 30);

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
  // ⛔⛔ POR UNIÓN, no por puntos con prioridad. El esquema viejo (un punto "hidden" al
  // empezar cada contenido y uno "full" al terminar) devolvía el avatar a FULL apenas
  // terminaba UN contenido, aunque OTRO siguiera en pantalla debajo: en el primer render
  // eso tapó fotos enteras con el avatar y, del otro lado, dejó colas de fondo pelado.
  // La regla correcta: el avatar está oculto mientras HAYA cualquier contenido activo.
  type Iv = { a: number; b: number; solo: boolean };
  const ivs: Iv[] = [];
  for (const c of FCSSENALES_COVER) ivs.push({ a: c.start, b: +(c.start + c.cov).toFixed(2), solo: c.kind === "video" && c.start + c.cov < AVATAR_END });
  for (const b of compBeats) { if (OVERLAY.has(b.kind)) continue; ivs.push({ a: b.start, b: +(b.start + compDur(b)).toFixed(2), solo: false }); }
  ivs.sort((x, y) => x.a - y.a);
  const merged: Iv[] = [];
  for (const iv of ivs) {
    const last = merged[merged.length - 1];
    if (last && iv.a <= last.b + 0.02) { last.b = Math.max(last.b, iv.b); last.solo = last.solo && iv.solo && iv.a >= last.a - 0.02; }
    else merged.push({ ...iv });
  }
  const coll: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let flip = false;
  for (const m of merged) {
    const puedeSplit = m.solo && m.b < AVATAR_END;
    const mode: AvatarWindow["mode"] = puedeSplit && flip ? "halfR" : "hidden";
    if (puedeSplit) flip = !flip;
    coll.push({ start: m.a, mode });
    coll.push({ start: m.b, mode: "full" });
  }

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
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "fcssenales_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round((b.start % 900.2) * 30)} objectPos="50% 22%" />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} prompt={b.prompt} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "pizarraexplica" ? <PizarraExplica durationInFrames={d} eyebrow={b.eyebrow} title={b.title} items={b.items} />
  // ⛔ nametag: renderFederer2Comp NO reenvía `image` y el default de DocNameCard es
  // "img/federer_casual.png", un archivo que NO EXISTE → staticFile 404 → chunk muerto.
  : b.kind === "nametag" ? <DocNameCard durationInFrames={d} name={b.name} role={b.role} image={b.image} focus="50% 30%" />
  : b.kind === "ring3d" ? <ManchaRing3D durationInFrames={d} cards={b.cards} focus={b.focus} intro={b.intro} eyebrow={b.eyebrow} bed={b.bed} />
  : b.kind === "triptych" ? <PhotoTriptych durationInFrames={d} items={b.items} title={b.title} eyebrow={b.eyebrow} bed={b.bed} />
  : b.kind === "depthphoto" ? <DepthPhotoScene durationInFrames={d} image={b.image} bed={b.bed} eyebrow={b.eyebrow} title={b.title} lines={b.lines} focus={b.focus} tone={b.tone} />
  : b.kind === "glasstest" ? <GlassTestScene durationInFrames={d} image={b.image} leftLabel={b.leftLabel} rightLabel={b.rightLabel} leftVerdict={b.leftVerdict} rightVerdict={b.rightVerdict} bed={b.bed} />
  : b.kind === "skinlayers" ? <SkinLayerBuild durationInFrames={d} eyebrow={b.eyebrow} title={b.title} stages={b.stages} bed={b.bed} />
  : b.kind === "bodymap" ? <BodyMapScene durationInFrames={d} title={b.title} stops={b.stops} bed={b.bed} />
  : b.kind === "plateorder" ? <PlateOrderScene durationInFrames={d} eyebrow={b.eyebrow} title={b.title} plates={b.plates} curveLabelHigh={b.curveLabelHigh} curveLabelLow={b.curveLabelLow} bed={b.bed} />
  : b.kind === "beforeafter" ? <BeforeAfterPush durationInFrames={d} before={b.before} after={b.after} beforeLabel={b.beforeLabel} afterLabel={b.afterLabel} caption={b.caption} focus={b.focus} bed={b.bed} />
  : b.kind === "guidecta" ? <FedGuideCTA durationInFrames={d} cover={b.cover} qr={b.qr} domain={b.domain} scanTitle={b.scanTitle} scanSub={b.scanSub} title={b.title} kicker={b.kicker} desc={b.desc} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainFcssenales: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — avatar real (0..15:00) + Fish desde la costura. El avatar va MUTEADO. */}
      <Audio src={staticFile("fcssenales.wav")} />

      {/* CAPA 1 — CLIPS (agnes) */}
      {FCSSENALES_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (agnes + respaldos + hero gpt-image) */}
      {rawTop.map((b: any) => {
        // ⛔ la duración TIENE que ser el `cov` que usó la ventana del avatar. Recalcularlo
        // acá (con otro tope) dejaba colas de 0,3-0,9 s con el fondo #0E1D23 a la vista:
        // `blackdetect` las marcó como PANTALLA NEGRA en el primer render.
        const cap = b.start >= AVATAR_END ? 11 : HERO_CAP;
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
      <AvatarLayerLoopFcs src="fcssenales_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL}
        avatarFocus={{ x: 0.52, y: 0.25, splitZoom: 1.05 }} avatarFrames={AVATAR_FRAMES} />

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
          setup="¿Te salió una mancha oscura en el cuello y crees que es mugre? Un médico lo explica…"
          impact="MANCHAS SIN RAZÓN: TU CUERPO TE GRITA ALGO GRAVE"
          accentColor={TEAL} font={F_INTER} fontSize={86} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VEND - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
