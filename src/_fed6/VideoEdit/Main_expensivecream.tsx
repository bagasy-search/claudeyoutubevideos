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
import { HourDial } from "./scenes/HourDial";
import { LineaTiempoPiel } from "./scenes/LineaTiempoPiel";
import { DatoImpacto } from "./scenes/DatoImpacto";
import { ListaFlotante } from "./scenes/ListaFlotante";
import { MitoRevelado } from "./scenes/MitoRevelado";
import { GuiaCTA3D } from "./scenes/GuiaCTA3D";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { F_INTER } from "./kit/premium/theme";
import { EXPENSIVECREAM_BEATS, EXPENSIVECREAM_BROLL, EXPENSIVECREAM_COVER, AVATAR_END, VIDEO_END as VEND } from "./expensivecream_beats";

// ── CANAL "Dr. Federer — The Nightly Remedy" (EN) · WHY YOUR EXPENSIVE CREAM ───
// ⛔ AVATAR PARCIAL: el creador grabó 0..435.605s de un master de 1023.26s.
//    · avatar EN BUCLE y MUTEADO (AvatarLayerLoopFcs) + <Audio> del master (m4a) aparte;
//    · en la ZONA FISH (>=AVATAR_END) los labios NO sincronizan → el avatar NUNCA se ve full:
//      buildWindows lo fuerza a hidden y el generador dejó esa zona 100% cubierta (clip+foto+comp).
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR = "expensivecream_opt.mp4";
const AVATAR_FRAMES = Math.round(435.605 * 30); // largo REAL del mp4 → el <Loop> lo repite

const NEWFULL = new Set(["mitoverdad", "errorstinger", "hourdial", "guidecta", "freezezoom", "datoimpacto", "checklist", "lineatiempo"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const isComp = (k: string) => NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 4.5;
const capOf = (k: string): number =>
  k === "errorstinger" ? 2.6 : k === "mitoverdad" ? 7.5 : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5
  : k === "hourdial" ? 6.5 : k === "datoimpacto" ? 6.5 : k === "checklist" ? 9.5 : k === "lineatiempo" ? 11.5
  : k === "freezezoom" ? 6 : k === "guidecta" ? 11.5 : 6;

const compBeats = EXPENSIVECREAM_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = EXPENSIVECREAM_BEATS.filter((b: any) => b.kind === "raw" && /^img\//.test(b.src || ""));
export const TOTAL_FRAMES_EXPENSIVECREAM = Math.round(VEND * 30);

const compDur = (b: any): number => {
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ ANTI-HUECO: en la ZONA AVATAR el avatar es el FONDO garantizado en los huecos; en la ZONA
// FISH nunca vuelve a full (labios desfasados) — se queda hidden y lo cubre el b-roll/componentes.
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  for (const c of EXPENSIVECREAM_COVER) {
    pts.push({ start: c.start, mode: "hidden", pr: 3 });
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

  // HOOK: avatar full 1,4 s (abre él) + scrim; después retoma
  const HOOK_END = 6.8;
  const post = coll.filter((w) => w.start < 1.4 || w.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  const resume = coll.filter((w) => w.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= 1.4 ? "hidden" : (resume?.mode ?? "full") });
  // ⛔ ZONA FISH: forzar hidden — el avatar en bucle jamás a la vista (labios desfasados)
  const noFull = post.filter((w) => !(w.start >= AVATAR_END && w.mode === "full"));
  noFull.push({ start: AVATAR_END, mode: "hidden" });
  noFull.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of noFull) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

const CTA_AT = VEND - 11;

const renderComp = (b: any, d: number) =>
  b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "hourdial" ? <HourDial durationInFrames={d} hour={b.hour} big={b.big} unit={b.unit} label={b.label} tone={b.tone} />
  : b.kind === "datoimpacto" ? <DatoImpacto durationInFrames={d} figure={b.figure} unit={b.unit} eyebrow={b.eyebrow} caption={b.label} image={b.image} tone={b.tone} />
  : b.kind === "checklist" ? <ListaFlotante durationInFrames={d} title={b.title} image={b.image} eyebrow={b.eyebrow} items={b.items} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoRevelado durationInFrames={d} myth={b.myth} truth={b.truth} image={b.image} flipAt={b.flipAt} />
  : b.kind === "lineatiempo" ? <LineaTiempoPiel durationInFrames={d} title={b.title} marks={b.marks} tone={b.tone} />
  : b.kind === "guidecta" ? <GuiaCTA3D durationInFrames={d} cover={b.cover} qr={b.qr} domain={b.domain} kicker={b.kicker} title={b.title} desc={b.desc} scanTitle={b.scanTitle} scanSub={b.scanSub} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : null;

export const MainExpensivecream: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — avatar real (0..7:16) + cola de Fish. El avatar va MUTEADO. */}
      <Audio src={staticFile("expensivecream.m4a")} />

      {/* CAPA 1 — CLIPS (agnes i2v, animación leve de su propia foto) */}
      {EXPENSIVECREAM_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (gpt-image low: presentador, ingredientes, Eleanor, LÁMINA cama) */}
      {rawTop.map((b: any) => {
        const cap = b.start >= AVATAR_END ? 9 : HERO_CAP;
        const cov = b.cov ?? Math.min(b.dur, cap);
        const d = Math.max(1, sec(cov + 0.6));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR en BUCLE y MUTEADO (full en zona avatar / hidden en zona fish) */}
      <AvatarLayerLoopFcs src={AVATAR} windows={AVATAR_WINDOWS} accent={TEAL}
        avatarFocus={{ x: 0.5, y: 0.3, splitZoom: 1 }} avatarFrames={AVATAR_FRAMES} />

      {/* CAPA 4 — COMPONENTES premium */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — escrito PARA ESTE video */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)}
          setup="That $89 jar of face cream? Most of it is water — and it evaporates off your face while you sleep."
          impact="THE $2 FIX THAT ACTUALLY WORKS"
          accentColor={TEAL} font={F_INTER} fontSize={92} />
      </Sequence>

      {/* ENDCARD — props propias (canal EN) */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VEND - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - CTA_AT))}
          kicker="Dr. Federer · The Nightly Remedy" title="Subscribe"
          subtitle="Simple, natural skincare you can do tonight — while you sleep" cta="SUBSCRIBE" />
      </Sequence>
    </AbsoluteFill>
  );
};
