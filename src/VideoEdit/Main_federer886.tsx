import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FED_SCENE_F,
  FedChapter,
  FedChecklist,
  FedCta,
  FedLowerThird,
  FedMolecule,
  FedQuote,
  FedStat,
  FedStep,
  type FedMood,
} from "../FedererKit";

export const TOTAL_FRAMES_FED886 = 2568;

const ACCENT = "#E9B44C";
const TEAL = "#8FD0C8";
const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
type KitKind =
  | "lowerThird"
  | "chapter"
  | "molecule"
  | "step"
  | "stat"
  | "quote"
  | "checklist"
  | "cta";

type BeatKind = "kit" | "image" | "stock" | "avatarStatement";

type BeatPayload = {
  kit?: KitKind;
  src?: string;
  startFrom?: number;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  index?: string;
  mood?: FedMood;
  accent?: string;
  label?: string;
  value?: number;
  suffix?: string;
  step?: number;
  total?: number;
  centerLabel?: string;
  nodes?: string[];
  items?: string[];
  quote?: string;
  author?: string;
  role?: string;
  topic?: string;
  buttonLabel?: string;
  side?: "left" | "right";
};

export type FedererBeat = {
  id: string;
  startSec: number;
  endSec: number;
  kind: BeatKind;
  payload: BeatPayload;
};

export const BEATS_FED886: FedererBeat[] = [
  {
    id: "doctor-open",
    startSec: 0,
    endSec: 5,
    kind: "kit",
    payload: {
      kit: "lowerThird",
      topic: "Cansancio después de los 60",
      role: "Médico · Bienestar adulto",
    },
  },
  {
    id: "hook-chapter",
    startSec: 1.3,
    endSec: 6.3,
    kind: "kit",
    payload: {
      kit: "chapter",
      kicker: "Después de los 60",
      index: "01",
      title: "La señal que ignoramos",
      sub: "Despertar agotado no siempre es la edad",
      mood: "cool",
      accent: "#8FB4E8",
    },
  },
  {
    id: "wake-tired",
    startSec: 5.76,
    endSec: 9.16,
    kind: "image",
    payload: {
      src: "img/fed886_wake_tired.png",
      kicker: "Aunque durmió toda la noche",
      title: "DESPERTAR AGOTADO",
      side: "left",
    },
  },
  {
    id: "not-age",
    startSec: 9.16,
    endSec: 11.36,
    kind: "avatarStatement",
    payload: {
      kicker: "Atención",
      title: "NO SIEMPRE ES LA EDAD",
      accent: "#8FB4E8",
      side: "right",
    },
  },
  {
    id: "body-warning",
    startSec: 11.36,
    endSec: 16.12,
    kind: "stock",
    payload: {
      src: "broll/s_03.mp4",
      startFrom: 42,
      kicker: "El cuerpo avisa",
      title: "ALGO ESENCIAL PUEDE ESTAR FALTANDO",
      side: "right",
    },
  },
  {
    id: "slow-morning",
    startSec: 16.12,
    endSec: 19.88,
    kind: "image",
    payload: {
      src: "img/fed886_slow_morning_v2.png",
      kicker: "Sueño no reparador",
      title: "EL CUERPO SE SIENTE PESADO",
      side: "left",
    },
  },
  {
    id: "symptoms-first-hour",
    startSec: 19.88,
    endSec: 24.88,
    kind: "kit",
    payload: {
      kit: "checklist",
      kicker: "Desde primera hora",
      title: "Señales cotidianas",
      hot: ["Señales"],
      items: ["Músculos pesados", "Memoria más lenta", "Agotamiento al despertar"],
      mood: "cool",
      accent: "#8FB4E8",
    },
  },
  {
    id: "three-things",
    startSec: 24.84,
    endSec: 29.84,
    kind: "kit",
    payload: {
      kit: "molecule",
      kicker: "Observe tres cosas",
      title: "La calidad del descanso",
      hot: ["descanso"],
      sub: "Tres pistas simples antes de sacar conclusiones.",
      centerLabel: "DESCANSO",
      nodes: ["Hidratación", "Respiración", "Cena"],
      src: "img/fed886_wake_tired.png",
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "step-hydration",
    startSec: 30.36,
    endSec: 35.36,
    kind: "kit",
    payload: {
      kit: "step",
      step: 1,
      total: 3,
      title: "Llegue hidratado a la noche",
      hot: ["hidratado"],
      sub: "No alcanza con tomar agua solo a primera hora.",
      src: "img/fed886_bedside_water_v2.png",
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "step-breathing",
    startSec: 34.96,
    endSec: 39.96,
    kind: "kit",
    payload: {
      kit: "step",
      step: 2,
      total: 3,
      title: "Observe cómo respira",
      hot: ["respira"],
      sub: "Ronquidos, boca seca o dolor de cabeza al despertar.",
      src: "img/fed886_dry_mouth_v2.png",
      mood: "cool",
      accent: "#8FB4E8",
    },
  },
  {
    id: "sleep-interrupted",
    startSec: 40.76,
    endSec: 43.92,
    kind: "stock",
    payload: {
      src: "broll/s_08.mp4",
      startFrom: 120,
      kicker: "Sin que lo note",
      title: "EL DESCANSO PUEDE INTERRUMPIRSE",
      side: "left",
      accent: "#8FB4E8",
    },
  },
  {
    id: "step-dinner",
    startSec: 43.92,
    endSec: 48.92,
    kind: "kit",
    payload: {
      kit: "step",
      step: 3,
      total: 3,
      title: "Revise la cena",
      hot: ["cena"],
      sub: "Azúcar y harinas pueden mantener al cuerpo trabajando.",
      src: "img/fed886_heavy_dinner.png",
      mood: "warmdark",
      accent: ACCENT,
    },
  },
  {
    id: "heavy-dinner",
    startSec: 47.8,
    endSec: 51.72,
    kind: "image",
    payload: {
      src: "img/fed886_heavy_dinner.png",
      kicker: "En lugar de recuperarse",
      title: "EL CUERPO TRABAJA TODA LA NOCHE",
      side: "right",
    },
  },
  {
    id: "seven-days",
    startSec: 51.72,
    endSec: 56.72,
    kind: "kit",
    payload: {
      kit: "stat",
      kicker: "Prueba sencilla",
      value: 7,
      suffix: " DÍAS",
      label: "Observe cómo despierta",
      sub: "Cena liviana y al menos dos horas antes de acostarse.",
      src: "img/fed886_light_dinner.png",
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "light-dinner",
    startSec: 56.4,
    endSec: 57.92,
    kind: "image",
    payload: {
      src: "img/fed886_light_dinner.png",
      kicker: "Primer cambio",
      title: "CENA MÁS LIVIANA",
      side: "left",
      accent: TEAL,
    },
  },
  {
    id: "water-before-bed",
    startSec: 57.92,
    endSec: 61.84,
    kind: "image",
    payload: {
      src: "img/fed886_bedside_water_v2.png",
      kicker: "Una hora antes",
      title: "UN VASO DE AGUA",
      side: "right",
      accent: TEAL,
    },
  },
  {
    id: "do-not-normalize",
    startSec: 61.84,
    endSec: 64.56,
    kind: "avatarStatement",
    payload: {
      kicker: "Si continúa",
      title: "NO LO NORMALICE",
      side: "right",
    },
  },
  {
    id: "body-whispers",
    startSec: 64.56,
    endSec: 69.56,
    kind: "kit",
    payload: {
      kit: "quote",
      kicker: "Escuche las señales",
      quote: "El cuerpo rara vez grita de golpe. Primero susurra.",
      author: "Dr. Federer",
      role: "Prevención y bienestar",
      mood: "warmdark",
      accent: ACCENT,
    },
  },
  {
    id: "alarm-signs",
    startSec: 68.56,
    endSec: 73.56,
    kind: "kit",
    payload: {
      kit: "checklist",
      kicker: "Señales de consulta",
      title: "No las ignore",
      hot: ["ignore"],
      items: ["Palpitaciones", "Falta de aire", "Mareos", "Somnolencia intensa"],
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "no-coffee-supplements",
    startSec: 75.16,
    endSec: 78.6,
    kind: "stock",
    payload: {
      src: "broll/s_15.mp4",
      startFrom: 90,
      kicker: "No tape la señal",
      title: "CAFÉ Y SUPLEMENTOS NO REEMPLAZAN UNA CONSULTA",
      side: "left",
    },
  },
  {
    id: "medical-cta",
    startSec: 78.6,
    endSec: 83.6,
    kind: "kit",
    payload: {
      kit: "cta",
      kicker: "La decisión responsable",
      title: "Consulte a un profesional",
      hot: ["profesional"],
      sub: "El cansancio persistente después de los 60 merece atención.",
      buttonLabel: "No lo normalice",
      src: "img/fed886_wake_tired.png",
      mood: "gold",
      accent: ACCENT,
    },
  },
  {
    id: "doctor-close",
    startSec: 83.1,
    endSec: 85.61,
    kind: "kit",
    payload: {
      kit: "lowerThird",
      topic: "Sentirse agotado no es normal",
      role: "Consulte a un profesional",
    },
  },
];

const rgba = (hex: string, alpha: number) => {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const VisualShell: React.FC<{
  durationInFrames: number;
  accent: string;
  children: React.ReactNode;
}> = ({durationInFrames, accent, children}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const whip = Math.min(12, Math.max(4, Math.floor(durationInFrames / 4)));
  const enter = interpolate(frame, [0, whip], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(frame, [Math.max(whip, durationInFrames - whip), durationInFrames], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const opacity = Math.min(enter, 1 - exit);
  const blur = (1 - enter) * 16 + exit * 16;
  const x = (1 - enter) * width * 0.045 - exit * width * 0.045;
  const sweep = Math.sin(enter * Math.PI) + Math.sin(exit * Math.PI) * 0.7;
  const sweepX = interpolate(enter - exit, [-1, 1], [120, -70], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: `blur(${blur.toFixed(2)}px)`,
        transform: `translateX(${x.toFixed(1)}px) scale(${(1.06 - enter * 0.06 - exit * 0.03).toFixed(4)})`,
        willChange: "transform, filter, opacity",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          inset: "-12% auto -12% 0",
          width: "42%",
          transform: `translateX(${sweepX}%) skewX(-16deg)`,
          background: `linear-gradient(100deg, transparent 20%, ${rgba(accent, 0.32)} 50%, transparent 80%)`,
          mixBlendMode: "screen",
          opacity: sweep,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const DepthMedia: React.FC<{
  beat: FedererBeat;
  durationInFrames: number;
}> = ({beat, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], CLAMP);
  const accent = beat.payload.accent ?? ACCENT;
  const side = beat.payload.side ?? "left";
  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `translate3d(${(side === "left" ? -1 : 1) * (-18 + progress * 36)}px, ${-8 + progress * 16}px, 0) scale(${1.055 + progress * 0.055})`,
    willChange: "transform",
  };

  return (
    <VisualShell durationInFrames={durationInFrames} accent={accent}>
      <AbsoluteFill style={{background: "#020409", overflow: "hidden"}}>
        {beat.kind === "stock" ? (
          <OffthreadVideo
            src={staticFile(beat.payload.src ?? "")}
            muted
            startFrom={beat.payload.startFrom ?? 0}
            style={mediaStyle}
          />
        ) : (
          <Img src={staticFile(beat.payload.src ?? "")} style={mediaStyle} />
        )}

        <AbsoluteFill
          style={{
            background:
              side === "left"
                ? "linear-gradient(90deg, rgba(2,4,9,0.88) 0%, rgba(2,4,9,0.42) 44%, rgba(2,4,9,0.06) 75%)"
                : "linear-gradient(270deg, rgba(2,4,9,0.88) 0%, rgba(2,4,9,0.42) 44%, rgba(2,4,9,0.06) 75%)",
          }}
        />
        <AbsoluteFill
          style={{
            background: "radial-gradient(110% 92% at 50% 45%, transparent 52%, rgba(1,3,8,0.58) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: height * 0.2,
            [side]: width * 0.07,
            width: width * 0.43,
            transform: `translateY(${interpolate(progress, [0, 1], [18, -10])}px)`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              border: `1px solid ${rgba(accent, 0.42)}`,
              borderRadius: 999,
              background: "rgba(3,7,14,0.55)",
              fontFamily: "Arial, sans-serif",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#F0E2BA",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 16px ${rgba(accent, 0.8)}`,
              }}
            />
            {beat.payload.kicker}
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: "Arial, sans-serif",
              fontSize: Math.min(72, Math.max(48, width * 0.036)),
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              color: "#F5F2E9",
              textShadow: "0 8px 32px rgba(0,0,0,0.65)",
            }}
          >
            {beat.payload.title}
          </div>
          <div
            style={{
              marginTop: 24,
              width: interpolate(progress, [0, 1], [50, 140]),
              height: 3,
              borderRadius: 2,
              background: accent,
              boxShadow: `0 0 18px ${rgba(accent, 0.72)}`,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: side === "left" ? "auto" : "-8%",
            right: side === "left" ? "-8%" : "auto",
            bottom: "-22%",
            width: "42%",
            height: "42%",
            borderRadius: "50%",
            background: rgba(accent, 0.1),
            filter: "blur(34px)",
            transform: `translateX(${(progress - 0.5) * 80}px)`,
          }}
        />
      </AbsoluteFill>
    </VisualShell>
  );
};

const AvatarStatement: React.FC<{beat: FedererBeat; durationInFrames: number}> = ({
  beat,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const accent = beat.payload.accent ?? ACCENT;
  const side = beat.payload.side ?? "right";
  const enter = interpolate(frame, [0, Math.min(16, durationInFrames / 3)], [0, 1], {
    ...CLAMP,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          [side]: width * 0.055,
          bottom: height * 0.09,
          width: width * 0.36,
          padding: "24px 30px 26px",
          borderLeft: side === "left" ? `5px solid ${accent}` : undefined,
          borderRight: side === "right" ? `5px solid ${accent}` : undefined,
          borderRadius: 20,
          background: "linear-gradient(145deg, rgba(2,6,13,0.78), rgba(2,6,13,0.48))",
          opacity: enter,
          transform: `translateX(${(side === "right" ? 1 : -1) * (1 - enter) * 54}px)`,
          boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {beat.payload.kicker}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: "Arial, sans-serif",
            fontSize: 48,
            fontWeight: 850,
            lineHeight: 1.02,
            color: "#FFFFFF",
            textShadow: "0 5px 24px rgba(0,0,0,0.55)",
          }}
        >
          {beat.payload.title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const KitScene: React.FC<{beat: FedererBeat}> = ({beat}) => {
  const p = beat.payload;
  const image = p.src ? staticFile(p.src) : undefined;

  switch (p.kit) {
    case "lowerThird":
      return (
        <FedLowerThird
          avatarSrc={null}
          name="Dr. Federer"
          role={p.role}
          topic={p.topic}
          accent={p.accent ?? ACCENT}
        />
      );
    case "chapter":
      return (
        <FedChapter
          kicker={p.kicker}
          index={p.index}
          title={p.title}
          sub={p.sub}
          mood={p.mood}
          accent={p.accent ?? ACCENT}
        />
      );
    case "molecule":
      return (
        <FedMolecule
          kicker={p.kicker}
          title={p.title}
          hot={p.hot}
          sub={p.sub}
          centerLabel={p.centerLabel}
          nodes={p.nodes?.map((label) => ({label}))}
          image={image}
          mood={p.mood}
          accent={p.accent ?? ACCENT}
        />
      );
    case "step":
      return (
        <FedStep
          step={p.step}
          total={p.total}
          title={p.title}
          hot={p.hot}
          sub={p.sub}
          image={image}
          mood={p.mood}
          accent={p.accent ?? ACCENT}
        />
      );
    case "stat":
      return (
        <FedStat
          kicker={p.kicker}
          value={p.value}
          suffix={p.suffix}
          label={p.label}
          sub={p.sub}
          image={image}
          mood={p.mood}
          accent={p.accent ?? TEAL}
        />
      );
    case "quote":
      return (
        <FedQuote
          kicker={p.kicker}
          quote={p.quote}
          author={p.author}
          role={p.role}
          image={image}
          mood={p.mood}
          accent={p.accent ?? ACCENT}
        />
      );
    case "checklist":
      return (
        <FedChecklist
          kicker={p.kicker}
          title={p.title}
          hot={p.hot}
          items={p.items}
          mood={p.mood}
          accent={p.accent ?? ACCENT}
        />
      );
    case "cta":
      return (
        <FedCta
          kicker={p.kicker}
          title={p.title}
          hot={p.hot}
          sub={p.sub}
          buttonLabel={p.buttonLabel}
          image={image}
          mood={p.mood}
          accent={p.accent ?? ACCENT}
        />
      );
    default:
      return null;
  }
};

const AvatarBase: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{background: "#020409", overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("federer_886f3c51_opt.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1.005 + progress * 0.045})`,
          transformOrigin: "48% 35%",
          willChange: "transform",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 105% at 49% 42%, transparent 64%, rgba(1,3,8,0.32) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const MainFederer886: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: "#020409", overflow: "hidden"}}>
      <AvatarBase />

      {BEATS_FED886.map((beat) => {
        const from = Math.max(0, Math.round(beat.startSec * fps));
        const requested = Math.max(1, Math.round((beat.endSec - beat.startSec) * fps));
        const durationInFrames = beat.kind === "kit" ? FED_SCENE_F : requested;
        const remaining = TOTAL_FRAMES_FED886 - from;
        const duration = Math.max(1, Math.min(durationInFrames, remaining));

        return (
          <Sequence
            key={beat.id}
            from={from}
            durationInFrames={duration}
            premountFor={Math.min(30, Math.max(0, duration - 1))}
            name={`Fed886 · ${beat.id}`}
          >
            {beat.kind === "kit" ? <KitScene beat={beat} /> : null}
            {beat.kind === "image" || beat.kind === "stock" ? (
              <DepthMedia beat={beat} durationInFrames={duration} />
            ) : null}
            {beat.kind === "avatarStatement" ? (
              <AvatarStatement beat={beat} durationInFrames={duration} />
            ) : null}
          </Sequence>
        );
      })}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.22)",
        }}
      />
    </AbsoluteFill>
  );
};
