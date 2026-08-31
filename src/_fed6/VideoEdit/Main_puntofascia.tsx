import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarLayerLoopAgu } from "./scenes/AvatarLayerLoopAgu";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { FedGuideCTA } from "./scenes/FedGuideCTA";
import { BenefitLockReveal } from "./scenes/BenefitLockReveal";
import { DocNameCard } from "./scenes/DocNameCard";
import { FedOilCarousel } from "../../FedererKit";
import { F_INTER } from "./kit/premium/theme";
import { PF_BEATS, PF_COVER, AVATAR_END, VIDEO_END as VEND } from "./puntofascia_beats";
import { PF_BROLL } from "./puntofascia_broll";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer - Más Salud, Más Vida" · EL CANDADO DE TU ROSTRO (masetero/fascia) ──
// ⛔ AVATAR PARCIAL: el mp4 del creador dura 675.03s sobre un master de 1156.43s.
//    · va EN BUCLE y MUTEADO (AvatarLayerLoopAgu, OffthreadVideo) + <Audio> del master aparte;
//    · después de AVATAR_END los labios NO sincronizan → se prefiere visual-full/hidden;
//      el avatar-loop sólo aparece en los huecos (anti-hueco), nunca en split después de 675.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR = "puntofascia_opt.mp4";
const AVATAR_FRAMES = 20251; // 675.03s * 30 → el <Loop> lo repite

const NEWFULL = new Set([
  "avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "freezezoom",
  "guidecta", "carousel", "benefitlock", "diagram",
]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "guidecta" ? 12 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2.6 : k === "mitoverdad" ? 6.5 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5 : k === "carousel" ? 7 : k === "benefitlock" ? 6
  : k === "process" || k === "checklist" ? 9 : k === "callout" ? 6.5 : k === "bars" ? 7.5 : k === "stat" ? 6
  : k === "splitlist" ? 8 : 6;

const compBeats = PF_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = PF_BEATS.filter((b: any) => b.kind === "raw" && /^img\//.test(b.src || ""));
export const TOTAL_FRAMES_PF = Math.round(VEND * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ ANTI-HUECO (patrón fcscanela/aguacatenoche): el avatar es el FONDO garantizado. Cada contenido
// cubre SÓLO su cobertura real (PF_COVER); en el hueco el avatar vuelve a full. El split (halfR) sólo
// existe mientras el avatar sincroniza labios (start+cov < AVATAR_END).
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  for (const c of PF_COVER) {
    const puedeSplit = c.kind === "video" && c.start + c.cov < AVATAR_END;
    const mode: AvatarWindow["mode"] = puedeSplit && flip ? "halfR" : "hidden";
    if (puedeSplit) flip = !flip;
    pts.push({ start: c.start, mode, pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue; // los overlay NO ocultan al avatar
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr); // pr ASCENDENTE: a igual ms gana el mayor
  const coll: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { coll.push({ start: p.start, mode: p.mode }); last = p.mode; } }

  // HOOK: el avatar queda FULL 0..HOOK_END y el AvatarScrimText lo OSCURECE por encima
  // (el scrim va sobre el avatar VIVO — director: "avatar full oscurecido"). Nunca hidden acá.
  const HOOK_END = 6.8;
  const post = coll.filter((w) => w.start >= HOOK_END);
  post.push({ start: 0, mode: "full" });
  const resume = coll.filter((w) => w.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume ? resume.mode : "full" });
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

const CTA_AT = VEND - 4.4;

// avatar frame para pizarra/keyword: modulo el largo del mp4 (loop) para no salir de rango tras 675s
const avFrom = (start: number) => Math.round((start % AVATAR_END) * 30);

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={AVATAR} avatarFrom={avFrom(b.start)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={AVATAR} avatarFrom={avFrom(b.start)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} mythLabel="EL MITO" truthLabel="LA VERDAD" />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "benefitlock" ? <BenefitLockReveal durationInFrames={d} index={b.index} cards={b.cards} />
  : b.kind === "guidecta" ? <FedGuideCTA durationInFrames={d} cover={b.cover} qr={b.qr} title={b.title} kicker={b.kicker} desc={b.desc} />
  : b.kind === "nametag" ? <DocNameCard durationInFrames={d} name={b.name} role={b.role} image={b.image} focus="50% 32%" />
  : b.kind === "carousel" ? <FedOilCarousel cards={(b.cards || []).map((c: any) => ({ ...c, image: staticFile(c.image) }))} focus={typeof b.focus === "number" ? b.focus : -1} intro={b.intro === true} accent={TEAL} kicker={b.kicker} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainPuntofascia: React.FC = () => {
  const hookDur = 5.2;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — la narración SIEMPRE sale del wav; el avatar va MUTEADO y en bucle. */}
      <Audio src={staticFile("puntofascia.wav")} />

      {/* CAPA 1 — B-ROLL DENSO (clips agnes 30fps CFR + fotos) */}
      {PF_BROLL.map((b) => {
        const dd = Math.max(1, sec(b.dur + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS HERO (historia, refs con la cara real de Federer, grids) */}
      {rawTop.map((b: any) => {
        const cap = b.start >= AVATAR_END ? 9 : 6.2;
        const cov = Math.min(b.dur, cap);
        const d = Math.max(1, sec(cov + 0.6));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR en BUCLE y MUTEADO (full / hidden / split, cero recuadro) */}
      <AvatarLayerLoopAgu src={AVATAR} windows={AVATAR_WINDOWS} accent={TEAL}
        avatarFocus={{ x: 0.5, y: 0.30, splitZoom: 1.12 }} avatarFrames={AVATAR_FRAMES} />

      {/* CAPA 4 — COMPONENTES, topeados por beat */}
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
          setup="Un solo punto, del tamaño de la yema de tu dedo, escondido a un lado de tu cara, está jalando todo tu rostro hacia abajo."
          impact="NO ES LA EDAD"
          accentColor={TEAL} font={F_INTER} fontSize={92} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VEND - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - CTA_AT))}
          kicker="Dr. Federer" title="Suscríbete"
          subtitle="Más Salud, Más Vida — remedios naturales y sencillos para después de los 60" cta="SUSCRIBIRME" />
      </Sequence>
    </AbsoluteFill>
  );
};
