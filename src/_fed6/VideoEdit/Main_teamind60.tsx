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
import { TEAMIND60_BEATS, TEAMIND60_BROLL, TEAMIND60_COVER, AVATAR_END, VIDEO_END as VEND } from "./teamind60_beats";

// ── CANAL "Dr. Federer — The Nightly Remedy" (EN) · THE TEA THAT WAKES YOUR MIND ─────
// AVATAR FULL: InfiniteTalk cubre TODO el master → lipsync real de piso, floor garantizado.
//   AVATAR_END=100000 (nunca) → nunca se fuerza hidden; los huecos muestran al avatar hablando.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR = "teamind60_opt.mp4";
const AVATAR_FRAMES = Math.round(1077.2 * 30); // largo del avatar full → Loop no repite dentro del video

const NEWFULL = new Set(["mitoverdad", "errorstinger", "hourdial", "guidecta", "freezezoom", "datoimpacto", "checklist", "lineatiempo"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const isComp = (k: string) => NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 4.2;
const capOf = (k: string): number =>
  k === "errorstinger" ? 2.6 : k === "mitoverdad" ? 7.5 : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5
  : k === "hourdial" ? 6.5 : k === "datoimpacto" ? 6.5 : k === "checklist" ? 9.5 : k === "lineatiempo" ? 11.5
  : k === "freezezoom" ? 6 : k === "guidecta" ? 11.5 : 6;

const compBeats = TEAMIND60_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = TEAMIND60_BEATS.filter((b: any) => b.kind === "raw" && /^img\//.test(b.src || ""));
export const TOTAL_FRAMES_TEAMIND60 = Math.round(VEND * 30);

const OPEN = 3.6; // avatar full hablando en la apertura (regla 1.bis)

const compDur = (b: any): number => {
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ ANTI-HUECO: avatar = FONDO garantizado; hidden sólo donde un cover/comp full lo tapa.
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  for (const c of TEAMIND60_COVER) {
    pts.push({ start: c.start, mode: "hidden", pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue; // overlays van ENCIMA del avatar, no lo ocultan
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
  }
  // apertura: avatar full garantizado hasta OPEN
  const kept = pts.filter((p) => p.start >= OPEN || p.start === 0);
  kept.push({ start: OPEN, mode: "full", pr: 0 });
  kept.sort((a, b) => a.start - b.start || a.pr - b.pr);
  const out: AvatarWindow[] = [];
  let last = "";
  for (const p of kept) { if (p.mode !== last) { out.push({ start: p.start, mode: p.mode }); last = p.mode; } }
  void AVATAR_END;
  return out;
}
const AVATAR_WINDOWS = buildWindows();

const CTA_AT = VEND - 10;

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

export const MainTeamind60: React.FC = () => {
  const hookDur = 5.0;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — voz federer_en (Fish). El avatar va MUTEADO. */}
      <Audio src={staticFile("teamind60.m4a")} />

      {/* CAPA 1 — CLIPS (stock literal: romero, jengibre, limón, té, mañana senior) */}
      {TEAMIND60_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (gpt-image low: Dr. preparando el té · LÁMINA · portada guía) */}
      {rawTop.map((b: any) => {
        const isLam = /lamina|guidecover/.test(b.src);
        const cov = b.cov ?? Math.min(b.dur, isLam ? 9 : HERO_CAP);
        const d = Math.max(1, sec(cov + 0.6));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR full (InfiniteTalk, lipsync real, floor todo el video) */}
      <AvatarLayerLoopFcs src={AVATAR} windows={AVATAR_WINDOWS} accent={TEAL}
        wav="teamind60_amp.wav" avatarFocus={{ x: 0.5, y: 0.28, splitZoom: 1 }} avatarFrames={AVATAR_FRAMES} />

      {/* CAPA 4 — COMPONENTES premium */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — escrito PARA ESTE video (avatar full detrás, scrim encima) */}
      <Sequence from={sec(1.2)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)}
          setup="That afternoon fog — the words on the tip of your tongue, the room you walk into and forget — for most people over 60, that is not your memory failing."
          impact="IT'S A FUEL PROBLEM — AND YOU CAN FIX IT BEFORE BREAKFAST"
          accentColor={TEAL} font={F_INTER} fontSize={84} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VEND - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - CTA_AT))}
          kicker="Dr. Federer · The Nightly Remedy" title="Subscribe"
          subtitle="Simple morning remedies you can start tomorrow — for a clearer mind after 60" cta="SUBSCRIBE" />
      </Sequence>
    </AbsoluteFill>
  );
};
