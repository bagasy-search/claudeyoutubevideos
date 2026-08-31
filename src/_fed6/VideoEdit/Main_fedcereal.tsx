import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarLayerLoopFcs } from "./scenes/AvatarLayerLoopFcs";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { LowerThird } from "./scenes/LowerThird";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { IngredientDuo } from "./scenes/IngredientDuo";
import { PizarraExplica } from "./scenes/PizarraExplica";
import { RecetaEscena } from "./scenes/RecetaEscena";
import { LineaTiempoPiel } from "./scenes/LineaTiempoPiel";
import { DatoImpacto } from "./scenes/DatoImpacto";
import { ComparaProfundidad } from "./scenes/ComparaProfundidad";
import { ListaFlotante } from "./scenes/ListaFlotante";
import { MitoRevelado } from "./scenes/MitoRevelado";
import { GuiaCTA3D } from "./scenes/GuiaCTA3D";
import { DocNameCard } from "./scenes/DocNameCard";
import { F_INTER } from "./kit/premium/theme";
import { FEDCEREAL_BEATS, FEDCEREAL_BROLL, FEDCEREAL_COVER, AVATAR_END, VIDEO_END as VEND } from "./fedcereal_beats";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Archivos" · ¿MÁS DE 60? ESTE CEREAL OLVIDADO RECONSTRUYE TU MÚSCULO ──
// ⛔ AVATAR PARCIAL: el mp4 del creador dura 673.62s sobre un máster de 2759.43s.
//    · va EN BUCLE y MUTEADO (AvatarLayerLoopFcs) + <Audio> del máster aparte;
//    · después de AVATAR_END los labios NO sincronizan → el avatar NUNCA queda a la vista.
// ⛔ Los clips de agnes TRAEN SONIDO NATIVO y se dejan sonar BAJO (pedido del creador):
//    el frote del trapo, el crepitar del amaranto inflándose. Volumen 0.09 debajo de la voz.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR_FRAMES = Math.round(673.62 * 30);
const CLIP_VOL = 0.09;

const NEWFULL = new Set(["mitoverdad", "errorstinger", "guardaesto", "ingredientduo", "pizarraexplica",
  "guidecta", "lineatiempo", "recetaescena", "stat", "bars", "checklist", "callout"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 4.2;
const capOf = (k: string): number =>
  k === "guidecta" ? 11 : k === "quote" ? 8 : k === "errorstinger" ? 2.4 : k === "guardaesto" ? 10
  : k === "mitoverdad" ? 8.5 : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5
  : k === "ingredientduo" ? 6.5 : k === "pizarraexplica" ? 8.5 : k === "stat" ? 7
  : k === "lineatiempo" ? 11 : k === "recetaescena" ? 14
  : k === "checklist" ? 10 : k === "callout" ? 7 : k === "bars" ? 8
  : k === "process" || k === "splitlist" ? 9 : 6;

const compBeats = FEDCEREAL_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FEDCEREAL_BEATS.filter((b: any) => b.kind === "raw" && /^img\//.test(b.src || ""));
export const TOTAL_FRAMES_FEDCEREAL = Math.round(VEND * 30);

const compDur = (b: any): number => {
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ ANTI-HUECO: el avatar es el FONDO garantizado en la ZONA AVATAR. En la ZONA FISH nunca
// vuelve a full visible porque el generador dejó el 100% cubierto (colas con foto).
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  for (const c of FEDCEREAL_COVER) {
    const puedeSplit = c.kind === "video" && c.start + c.cov < AVATAR_END;
    const mode: AvatarWindow["mode"] = puedeSplit && flip ? "halfR" : "hidden";
    if (puedeSplit) flip = !flip;
    pts.push({ start: c.start, mode, pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue;   // los overlay NO ocultan al avatar
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);
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

const CTA_AT = VEND - 11;

const asItems = (items: any[]) => (items || []).map((x: any) => (typeof x === "string" ? { text: x } : x));

const renderComp = (b: any, d: number) =>
  b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} prompt={b.prompt} />
  : b.kind === "ingredientduo" ? <IngredientDuo durationInFrames={d} leftImg={b.leftImg} rightImg={b.rightImg} />
  : b.kind === "pizarraexplica" ? <PizarraExplica durationInFrames={d} eyebrow={b.eyebrow} title={b.title} items={b.items} />
  : b.kind === "recetaescena" ? <RecetaEscena durationInFrames={d} title={b.title} steps={b.steps} tone={b.tone} />
  : b.kind === "lineatiempo" ? <LineaTiempoPiel durationInFrames={d} title={b.title} marks={b.marks} tone={b.tone} />
  : b.kind === "stat" ? <DatoImpacto durationInFrames={d} figure={String(b.value)} unit={b.unit} eyebrow={b.eyebrow} caption={b.label} image={b.image} tone={b.tone} />
  : b.kind === "bars" ? <ComparaProfundidad durationInFrames={d} title={b.title} unit={b.unit} image={b.image} bars={b.bars} />
  : b.kind === "checklist" ? <ListaFlotante durationInFrames={d} title={b.title} image={b.image} items={asItems(b.items)} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoRevelado durationInFrames={d} myth={b.myth} truth={b.truth} image={b.image} flipAt={b.flipAt} />
  : b.kind === "guidecta" ? <GuiaCTA3D durationInFrames={d} cover={b.cover} qr={b.qr} domain={b.domain} kicker={b.kicker} title={b.title} desc={b.desc} scanTitle={b.scanTitle} scanSub={b.scanSub} />
  // ⛔ nametag: sin `image` el default de DocNameCard es un archivo que NO EXISTE → 404 → chunk muerto
  : b.kind === "nametag" ? <DocNameCard durationInFrames={d} name={b.name} role={b.role} image={b.image} focus="50% 26%" />
  : renderFederer2Comp(b, d, { medico: true });

export const MainFedcereal: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MÁSTER — avatar real (0..11:13) + cola Fish. El avatar va MUTEADO. */}
      <Audio src={staticFile("fedcereal.wav")} />

      {/* CAPA 1 — CLIPS (agnes i2v: el encuadre queda clavado en la foto del momento) */}
      {FEDCEREAL_BROLL.map((b: any) => {
        const dd = Math.max(1, sec((b.cov ?? Math.min(b.dur, 10)) + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" clipDur={b.cov} />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
            {/* sonido nativo del clip, bajo, debajo de la narración */}
            {b.snd ? <Audio src={staticFile(b.src)} volume={CLIP_VOL} /> : null}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (agnes + las de la cara real del Dr. Federer con gpt-image-2) */}
      {rawTop.map((b: any) => {
        const cap = b.start >= AVATAR_END ? 6.0 : HERO_CAP;
        const cov = b.cov ?? Math.min(b.dur, cap);
        const d = Math.max(1, sec(cov + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR en BUCLE y MUTEADO (full / hidden / split, cero recuadro) */}
      <AvatarLayerLoopFcs src="fedcereal_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL}
        avatarFocus={{ x: 0.5, y: 0.28, splitZoom: 1.12 }} avatarFrames={AVATAR_FRAMES} />

      {/* CAPA 4 — COMPONENTES */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre el avatar oscurecido */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)}
          setup="Si te empujás con las manos para salir del sillón, eso no es la edad. Tiene nombre."
          impact="EL CEREAL OLVIDADO QUE RECONSTRUYE TU MÚSCULO"
          accentColor={TEAL} font={F_INTER} fontSize={92} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VEND - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - CTA_AT))}
          kicker="Dr. Federer" title="Suscribite"
          subtitle="Cada semana, salud explicada de verdad para después de los 60" cta="SUSCRIBIRME" />
      </Sequence>
    </AbsoluteFill>
  );
};
