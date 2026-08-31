import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { FedOilCarousel } from "../../FedererKit";
import { AvatarLayerLoopFcs } from "./scenes/AvatarLayerLoopFcs";
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
import { PriceWar } from "./scenes/PriceWar";
import { BenefitLockReveal } from "./scenes/BenefitLockReveal";
import { HighlightData, CitationCard } from "./scenes/RecalRich";
import { DocNameCard } from "./scenes/DocNameCard";
import {
  P60_BROLL, P60_PHOTOS, P60_BEATS, AVATAR_WINDOWS,
  VIDEO_END, AVATAR_FRAMES, TOTAL_FRAMES_P60,
} from "./parpados60_beats";
import { renderFederer2Comp } from "./FedererComponents2";

// ── CANAL "Federer - Más Salud, Más Vida" · EL CANDADO DE LA CEJA (párpados caídos) ──
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR = "parpados60_opt.mp4";
const CTA_AT = Math.max(0, VIDEO_END - 22);

const OVERLAY = new Set(["lowerthird", "frasecinetica", "errorstinger", "headline"]);

// ⛔ props pisadas a mano donde el kit trae texto QUEMADO de otro video/idioma
const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={AVATAR} avatarFrom={Math.round(b.start * 30) % AVATAR_FRAMES} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={AVATAR} avatarFrom={Math.round(b.start * 30) % AVATAR_FRAMES} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} mythLabel="EL MITO" truthLabel="LA VERDAD" />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} prompt={b.prompt} />
  : b.kind === "guidecta" ? <FedGuideCTA durationInFrames={d} cover={b.cover} qr={b.qr} title={b.title} kicker={b.kicker} desc={b.desc} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "pricewar" ? <PriceWar durationInFrames={d} leftImage={b.leftImage} rightImage={b.rightImage} leftPrice={b.leftPrice} rightPrice={b.rightPrice} leftLabel={b.leftLabel} rightLabel={b.rightLabel} subtitle={b.subtitle} verdict={b.verdict} strike={b.strike} />
  : b.kind === "benefitlock" ? <BenefitLockReveal durationInFrames={d} index={b.index} cards={b.cards} />
  : b.kind === "highlightdata" ? <HighlightData durationInFrames={d} pre={b.pre} highlight={b.highlight} post={b.post} source={b.source} />
  : b.kind === "citationcard" ? <CitationCard durationInFrames={d} journal={b.journal} finding={b.finding} stat={b.stat} statPrefix={b.statPrefix} statSuffix={b.statSuffix} statLabel={b.statLabel} />
  : b.kind === "nametag" ? <DocNameCard durationInFrames={d} name={b.name} role={b.role} image={b.image} />
  : b.kind === "carousel" ? <FedOilCarousel cards={(b.cards || []).map((c: any) => ({ ...c, image: staticFile(c.image) }))} focus={typeof b.focus === "number" ? b.focus : -1} intro={b.intro === true} accent={TEAL} kicker={b.kicker} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainParpados60: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — CLIPS (agnes, 30 fps nativo) */}
      {P60_BROLL.map((b: any) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={d} premountFor={30}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS del mismo momento (2ª lectura del mismo sujeto) + camas */}
      {P60_PHOTOS.map((p: any) => {
        const d = Math.max(1, sec(p.dur));
        return (
          <Sequence key={p.name} from={sec(p.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={p.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR: base FULL, en BUCLE después de AVATAR_END. OffthreadVideo. */}
      <AvatarLayerLoopFcs
        src={AVATAR}
        windows={AVATAR_WINDOWS}
        accent={TEAL}
        avatarFocus={{ x: 0.5, splitZoom: 1.12 }}
        avatarFrames={AVATAR_FRAMES}
      />

      {/* CAPA 4 — COMPONENTES */}
      {P60_BEATS.map((b: any) => {
        const d = Math.max(1, sec(b.dur));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* ENDCARD — props explícitas (los defaults del kit son de otro video) */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard
          durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))}
          kicker="Dr. Federer"
          title="Suscríbete"
          subtitle="Más Salud, Más Vida — remedios caseros, naturales y baratos para después de los 60"
          cta="SUSCRÍBETE"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export { TOTAL_FRAMES_P60, VIDEO_END };
