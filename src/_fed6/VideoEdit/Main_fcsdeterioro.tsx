import { AbsoluteFill, Sequence } from "remotion";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FedGuideCTA } from "./scenes/FedGuideCTA";
import { FdRazonCarousel } from "./scenes/FdRazonCarousel";
import { FdDepthScene } from "./scenes/FdDepthScene";
import { FdSplitCompare } from "./scenes/FdSplitCompare";
import { FdEscalera } from "./scenes/FdEscalera";
import { F_INTER } from "./kit/premium/theme";
import { renderFederer2Comp } from "./FedererComponents2";
import {
  FCSDETERIORO_BROLL, FCSDETERIORO_PHOTOS, FCSDETERIORO_BEATS,
  AVATAR_WINDOWS, VIDEO_END, AVATAR_END,
} from "./fcsdeterioro_beats";

// ── CANAL "Federer Consejos Salud" · POR QUÉ UNA PERSONA SANA DE 70 SE DETERIORA DE GOLPE ──
// El avatar existe SOLO hasta AVATAR_END (12:29) y su audio ES el master de ese tramo (el
// creador lo grabó con sus propios tiempos: no se re-sincroniza nada). Desde la costura entra
// la cola de la locución como pista aparte. Después de AVATAR_END la cobertura visual la
// garantizan clips + fotos (el gen simula el timeline y deja 0 huecos).
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const SEAM = AVATAR_END + 0.30;

export const TOTAL_FRAMES_FCSDETERIORO = Math.round(VIDEO_END * 30);

const renderComp = (b: any, d: number) =>
  b.kind === "razoncarousel" ? <FdRazonCarousel durationInFrames={d} cards={b.cards} focus={b.focus} intro={b.intro === true} eyebrow={b.eyebrow} kicker={b.kicker} />
  : b.kind === "depthscene" ? <FdDepthScene durationInFrames={d} image={b.image} back={b.back} eyebrow={b.eyebrow} title={b.title} sub={b.sub} side={b.side} tone={b.tone} />
  : b.kind === "splitcompare" ? <FdSplitCompare durationInFrames={d} left={b.left} right={b.right} eyebrow={b.eyebrow} title={b.title} winner={b.winner} unit={b.unit} />
  : b.kind === "escalera" ? <FdEscalera durationInFrames={d} steps={b.steps} eyebrow={b.eyebrow} title={b.title} rampLabel={b.rampLabel} tone={b.tone} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainFcsdeterioro: React.FC = () => {
  const hookDur = 5.4;
  const ctaAt = VIDEO_END - 34;
  const endAt = VIDEO_END - 11;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — CLIPS (agnes, 4s) */}
      {FCSDETERIORO_BROLL.map((b: any) => {
        const d = Math.max(1, sec(b.cov + 0.5));   // +0.5 de cola: la tapa el próximo contenido
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={d} premountFor={30}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (agnes / hero gpt-image / láminas). En el tramo sin avatar son las
          que garantizan que no se vea el fondo. */}
      {FCSDETERIORO_PHOTOS.map((p: any) => {
        const d = Math.max(1, sec(p.cov + 0.5));
        return (
          <Sequence key={p.name} from={sec(p.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={p.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full ↔ hidden, cero recuadro). Su audio ES el master del tramo 1.
          avatarFocus: en ESTE avatar el doctor está en el tercio IZQUIERDO del frame. */}
      <AvatarLayer src="fcsdeterioro_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} avatarFocus={{ x: 0.29, y: 0.3, splitZoom: 1.12 }} />

      {/* AUDIO DEL TRAMO 2 — la cola de la locución, desde la costura */}
      <Sequence from={sec(SEAM)} durationInFrames={Math.max(1, sec(VIDEO_END - SEAM))}>
        <Audio src={staticFile("fcsdeterioro_tail.mp3")} />
      </Sequence>

      {/* CAPA 4 — COMPONENTES */}
      {FCSDETERIORO_BEATS.map((b: any) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — sobre el avatar, primeros segundos (texto PROPIO de este video) */}
      <Sequence from={sec(1.2)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText
          durationInFrames={sec(hookDur)}
          setup="Diez días en una cama de hospital, sin fractura y sin cirugía…"
          impact="TE QUITAN DIEZ AÑOS DE PIERNA"
          accentColor={TEAL}
          font={F_INTER}
          fontSize={92}
        />
      </Sequence>

      {/* CTA — la guía, con QR real a drfederer.com */}
      <Sequence from={sec(ctaAt)} durationInFrames={sec(endAt - ctaAt)} layout="none">
        <FedGuideCTA
          durationInFrames={sec(endAt - ctaAt)}
          cover="img/fcsvarices_libro.png"
          qr="qr_drfederer.png"
          domain="drfederer.com"
          scanTitle="Apunta la cámara"
          scanSub="o el link en la descripción"
          kicker="La guía completa"
          title="Salud después de los 60"
          desc="Las preguntas para el médico, las cantidades de proteína y la revisión de la casa cuarto por cuarto"
        />
      </Sequence>

      {/* ENDCARD — props explícitas (sus defaults son de OTRO canal) */}
      <Sequence from={sec(endAt)} durationInFrames={Math.max(2, sec(VIDEO_END - endAt))} layout="none">
        <Endcard
          durationInFrames={Math.max(2, sec(VIDEO_END - endAt))}
          kicker="Dr. Federer"
          title="Suscríbete"
          subtitle="Cada semana, salud real para después de los 60"
          cta="SUSCRIBIRME"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
