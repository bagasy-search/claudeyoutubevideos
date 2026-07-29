import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS, sec } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { SfxCue, SFX } from "./components/Sfx";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { RawShot } from "./scenes/RawShot";
import { CrossSection } from "./scenes/CrossSection";
import { StatBig } from "./scenes/DataViz";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { Checklist, Checklist as PhotoChecklist } from "./scenes/Checklist";
import { BarCompare } from "./scenes/BarCompare";
import { ReframeList, ChipsCluster } from "./scenes/ReframeContent";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { OptionCompare } from "./scenes/OptionCompare";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { AgedDoc } from "./scenes/AgedDoc";
import { SplitList } from "./scenes/SplitList";
import { CalloutMark } from "./scenes/CalloutMark";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import {
  AVATAR_WINDOWS_V7IOR5J7VKW9,
  MOMENTS_V7IOR5J7VKW9,
  TOTAL_FRAMES_V7IOR5J7VKW9,
  V7Moment,
} from "./v7ior5j7vkw9_data.gen";

export { TOTAL_FRAMES_V7IOR5J7VKW9 };

const PAPER = "#E6D1A6";
const TERRACOTTA = "#B5653B";
const OLIVE = "#71835A";

const compact = (items: string[], fallback: string) => {
  const clean = items.map((x) => x.trim()).filter(Boolean).slice(0, 3);
  return clean.length ? clean : [fallback];
};

const takeWords = (text: string, max: number) =>
  text.split(/\s+/).filter(Boolean).slice(0, max).join(" ");

const ComponentMoment: React.FC<{ moment: V7Moment; frames: number }> = ({
  moment,
  frames,
}) => {
  const title = takeWords(moment.headline, 2);
  const items = compact(moment.items, title)
    .slice(0, 2)
    .map((item) => takeWords(item, 1));
  const complex = new Set([
    "CrossSection",
    "BarCompare",
    "OptionCompare",
    "PhotoChecklist",
  ]);

  if ((complex.has(moment.kind) && moment.dur < 5.35) || moment.dur < 3.65) {
    return (
      <TextCardReveal
        durationInFrames={frames}
        eyebrow="Riego"
        lines={[takeWords(moment.headline, Math.max(1, Math.floor((moment.dur - 0.8) * 2.5) - 1))]}
        accent={PAPER}
      />
    );
  }

  switch (moment.kind) {
    case "CrossSection":
      return (
        <CrossSection
          durationInFrames={frames}
          title={title}
          hue="amber"
          layers={[
            {
              label: "Seco",
              depth: "5 cm",
              color: "rgba(177,128,73,0.46)",
              weight: 0.58,
            },
            {
              label: "Raíz",
              depth: "20 cm",
              color: "rgba(102,126,76,0.72)",
              weight: 1.35,
            },
            {
              label: "Drenaje",
              depth: "libre",
              color: "rgba(75,62,43,0.74)",
              weight: 0.78,
            },
          ]}
          marker={{ label: "Reserva", atDepth: 0.55, color: "good" }}
          startAt={sec(0.25)}
          stagger={sec(0.48)}
        />
      );
    case "StatBig":
      return (
        <StatBig
          durationInFrames={frames}
          to={moment.number}
          suffix={/litro/i.test(moment.dice) ? " L" : /centímetr/i.test(moment.dice) ? " cm" : ""}
          label={title}
          caption="Agua semanal"
          accent="amber"
          hue="amber"
          size={176}
          bg="white"
        />
      );
    case "ProcessSteps":
      return (
        <ProcessSteps
          durationInFrames={frames}
          title={title}
          hue="amber"
          accent="good"
          startAt={sec(0.2)}
          stagger={sec(0.55)}
          steps={items.map((text, i) => ({
            title: `${i + 1}. ${text}`,
          }))}
        />
      );
    case "RuleNumberScene":
      return (
        <RuleNumberScene
          durationInFrames={frames}
          number={String(Math.max(1, Math.round(moment.number))).padStart(2, "0")}
          label="REGLA"
          title={title}
          hue="amber"
        />
      );
    case "Checklist":
      return (
        <Checklist
          durationInFrames={frames}
          eyebrow="Control"
          title={title}
          items={items.map((text, i) => ({
            text,
            state: i === 0 ? "done" : i === 1 ? "doing" : "todo",
          }))}
          accent="good"
          hue="amber"
          startAt={sec(0.2)}
          stagger={sec(0.52)}
        />
      );
    case "PhotoChecklist":
      return (
        <PhotoChecklist
          durationInFrames={frames}
          eyebrow="Prueba"
          title={title}
          items={items.map((text, i) => ({
            text,
            state: i === 0 ? "done" : "doing",
          }))}
          accent="good"
          hue="amber"
          image={moment.supportImage}
          imageDarken={0.48}
          pin="left"
          startAt={sec(0.18)}
          stagger={sec(0.5)}
        />
      );
    case "BarCompare":
      return (
        <BarCompare
          durationInFrames={frames}
          eyebrow="Profundidad"
          title={title}
          orientation="horizontal"
          hue="amber"
          accent="good"
          startAt={sec(0.2)}
          stagger={sec(0.72)}
          bars={[
            {
              label: "Superficial",
              value: 2,
              display: "2 cm",
              tone: "danger",
              sub: "débil",
            },
            {
              label: "Profundo",
              value: 20,
              display: "15–20 cm",
              tone: "good",
              winner: true,
              sub: "estable",
            },
          ]}
        />
      );
    case "ReframeList":
      return (
        <ReframeList
          durationInFrames={frames}
          eyebrow="Observa"
          title={title}
          accent={OLIVE}
          items={items.map((text, i) => ({
            text,
            cross: i === 0 && /mito|error|no/i.test(moment.dice),
          }))}
        />
      );
    case "TextCardReveal":
      return (
        <TextCardReveal
          durationInFrames={frames}
          eyebrow="Regla"
          lines={items}
          accent={PAPER}
        />
      );
    case "OptionCompare":
      return (
        <OptionCompare
          durationInFrames={frames}
          left={{
            tag: "Error",
            title: "Calendario",
            sub: "Sin medir",
            note: "Falla",
            icon: "warn",
            accent: COLORS.danger,
          }}
          right={{
            tag: "Método",
            title: "Suelo",
            sub: "Mide suelo",
            note: "Funciona",
            icon: "check",
            accent: COLORS.good,
          }}
        />
      );
    case "ImpactReveal":
      return (
        <ImpactReveal
          durationInFrames={frames}
          image={moment.supportImage}
          setup="Daño silencioso"
          impact={title}
          impactAccent="danger"
          hitAt={Math.min(0.8, Math.max(0.35, moment.dur * 0.2))}
          zoom={[1.03, 1.14]}
          darken={0.64}
          fontSize={104}
          boomVolume={0.22}
        />
      );
    case "KineticQuote":
      return (
        <KineticQuote
          durationInFrames={frames}
          eyebrow="Clave"
          words={parseQuote(title)}
          accent="good"
          hue="amber"
          startAt={sec(0.15)}
          perWord={sec(0.18)}
          fontSize={78}
        />
      );
    case "AgedDoc":
      return (
        <AgedDoc
          durationInFrames={frames}
          eyebrow="Cuaderno"
          heading={title}
          lines={items.map((text, i) => ({ text, mark: i === 0 }))}
          accent="good"
          hue="amber"
          startAt={sec(0.18)}
          perLine={sec(0.45)}
          markDelay={sec(0.65)}
        />
      );
    case "SplitList":
      return (
        <SplitList
          durationInFrames={frames}
          title={title}
          items={items}
          accent={TERRACOTTA}
          cross={/mito|error|no puede/i.test(moment.dice)}
        />
      );
    case "ChipsCluster":
      return (
        <ChipsCluster
          durationInFrames={frames}
          title={title}
          chips={items}
          hue="amber"
          bg="white"
        />
      );
    case "CalloutMark":
      return (
        <CalloutMark
          durationInFrames={frames}
          figure={/centímetr/i.test(moment.dice) ? `${moment.number} cm` : String(moment.number)}
          eyebrow="Cifra"
          caption={title}
          accent="good"
          hue="amber"
          startAt={sec(0.2)}
        />
      );
    default:
      return (
        <TextCardReveal
          durationInFrames={frames}
          eyebrow="Riego"
          lines={[title]}
          accent={PAPER}
        />
      );
  }
};

const VisualMoment: React.FC<{ moment: V7Moment; frames: number }> = ({
  moment,
  frames,
}) => {
  if (moment.tipo === "componente") {
    return <ComponentMoment moment={moment} frames={frames} />;
  }
  if (moment.kitOverlay === "annotated") {
    return (
      <AnnotatedImage
        durationInFrames={frames}
        image={moment.src}
        eyebrow="Prueba"
        caption={takeWords(moment.headline, 2)}
        hue="amber"
        startAt={sec(0.2)}
        stagger={sec(0.4)}
        annotations={[
          {
            kind: "circle",
            x: 0.52,
            y: 0.56,
            w: 0.22,
            label: "Zona clave",
            color: "good",
          },
        ]}
      />
    );
  }
  if (moment.kitOverlay === "callout") {
    return (
      <CalloutMark
        durationInFrames={frames}
        image={moment.src}
        eyebrow="Observa"
        figure="SUELO"
        caption={takeWords(moment.headline, 2)}
        accent="good"
        hue="amber"
        startAt={sec(0.2)}
      />
    );
  }
  if (moment.kitOverlay === "impact") {
    return (
      <ImpactReveal
        durationInFrames={frames}
        image={moment.src}
        setup="Mira el suelo"
        impact={takeWords(moment.headline, 2)}
        impactAccent="good"
        hitAt={0.42}
        zoom={[1.02, 1.1]}
        darken={0.5}
        fontSize={86}
        boomVolume={0.12}
      />
    );
  }
  return (
    <RawShot
      durationInFrames={frames}
      src={moment.src}
      hue="amber"
      darken={moment.tipo === "imagen" ? 0.04 : 0.02}
      zoom={moment.tipo === "imagen" ? [1.02, 1.09] : undefined}
      kicker={moment.tipo === "imagen" ? "Levi · Lancaster" : undefined}
      kbBoost={moment.tipo === "imagen" ? 0.72 : 0.36}
    />
  );
};

const SECTION_STARTS = MOMENTS_V7IOR5J7VKW9.filter(
  (moment, index, all) =>
    index === 0 || moment.section !== all[index - 1]?.section,
);

export const MainV7ior5j7vkw9: React.FC = () => {
  const windows = AVATAR_WINDOWS_V7IOR5J7VKW9 as unknown as AvatarWindow[];
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={46} glowY={42} hue="amber" drift={0.18} />

      {MOMENTS_V7IOR5J7VKW9.filter((moment) => !moment.avatarFull).map(
        (moment) => {
          const frames = Math.max(1, sec(moment.dur));
          return (
            <Sequence
              key={moment.key}
              from={sec(moment.start)}
              durationInFrames={frames}
              premountFor={30}
            >
              <VisualMoment moment={moment} frames={frames} />
            </Sequence>
          );
        },
      )}

      <AvatarLayer
        src="avatar_v7ior5j7vkw9.mp4"
        wav="v7ior5j7vkw9.wav"
        windows={windows}
        accent={OLIVE}
      />

      {SECTION_STARTS.slice(1).map((moment) => (
        <SfxCue
          key={`section-${moment.section}`}
          at={sec(moment.start)}
          src={SFX.sectionSwell}
          volume={0.12}
          durationInFrames={45}
        />
      ))}
    </AbsoluteFill>
  );
};
