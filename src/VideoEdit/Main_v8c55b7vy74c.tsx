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
  FedCta,
  FedChapter,
  FedChecklist,
  FedBeforeAfter,
  FedMolecule,
  FedQuote,
  FedStat,
  FedStep,
  type FedMood,
} from "../FedererKit";

export const TOTAL_FRAMES_V8C55B7VY74C = 27617;

const ACCENT = "#E9B44C";
const TEAL = "#8FD0C8";
const COOL = "#8FB4E8";

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const img = (name: string) => staticFile(`img_v8c55b7vy74c/v8c55b7vy74c_${name}.png`);

type KitKind =
  | "chapter"
  | "stat"
  | "quote"
  | "molecule"
  | "step"
  | "checklist"
  | "cta"
  | "beforeAfter";

type BeatKind = "kit" | "image" | "avatarStatement";

type BeatPayload = {
  kit?: KitKind;
  src?: string;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  index?: string;
  mood?: FedMood;
  accent?: string;
  side?: "left" | "right";
  value?: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  step?: number;
  total?: number;
  centerLabel?: string;
  nodes?: string[];
  items?: string[];
  quote?: string;
  author?: string;
  role?: string;
  buttonLabel?: string;
  imageA?: string;
  imageB?: string;
  labelA?: string;
  labelB?: string;
};

type FedBeat = {
  id: string;
  startSec: number;
  endSec: number;
  kind: BeatKind;
  payload: BeatPayload;
};

export const BEATS_V8C55B7VY74C: FedBeat[] = [
  {
    id: "open",
    startSec: 0,
    endSec: 2.7,
    kind: "avatarStatement",
    payload: {
      kicker: "Dr. Federer",
      title: "EL ALIMENTO ANTES DE DORMIR",
      accent: ACCENT,
      side: "left",
    },
  },
  {
    id: "kiwi-tease",
    startSec: 3.3,
    endSec: 7.7,
    kind: "image",
    payload: {
      src: img("kiwi_whole"),
      kicker: "Hoy te cuento de",
      title: "UNA FRUTA PEQUEÑA Y PELUDA",
      side: "right",
      accent: ACCENT,
    },
  },
  {
    id: "taiwan-study",
    startSec: 70.94,
    endSec: 75.94,
    kind: "kit",
    payload: {
      kit: "chapter",
      kicker: "El estudio",
      index: "2011",
      title: "Universidad Fu Jen, Taiwán",
      sub: "24 adultos. 4 semanas. Resultados reales.",
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "protocol-intro",
    startSec: 120.36,
    endSec: 124.96,
    kind: "image",
    payload: {
      src: img("kiwi_cut"),
      kicker: "El protocolo",
      title: "DOS KIWIS, UNA HORA ANTES",
      side: "left",
      accent: ACCENT,
    },
  },
  {
    id: "stat-35",
    startSec: 136.46,
    endSec: 141.46,
    kind: "kit",
    payload: {
      kit: "stat",
      kicker: "Los números no mienten",
      value: 35,
      suffix: "%",
      label: "menos tiempo para quedarte dormido",
      sub: "Asia Pacific Journal of Clinical Nutrition, 2011.",
      src: img("kiwi_cut"),
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "mechanism",
    startSec: 202.76,
    endSec: 207.76,
    kind: "kit",
    payload: {
      kit: "molecule",
      kicker: "Por qué funciona",
      title: "Cuatro cosas trabajando juntas",
      hot: ["juntas"],
      sub: "Ninguna sola hace el milagro.",
      centerLabel: "SUEÑO",
      nodes: ["Serotonina", "Antioxidantes", "Minerales", "Actinidina"],
      src: img("cerebro_melatonina"),
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "repair-quote",
    startSec: 249.24,
    endSec: 254.24,
    kind: "kit",
    payload: {
      kit: "quote",
      kicker: "Mientras duermes",
      quote: "Dormir no es apagar el cuerpo. Es el turno más activo de reparación que tienes.",
      author: "Dr. Federer",
      role: "Federer Consejos",
      src: img("persona_durmiendo_profundo"),
      mood: "warmdark",
      accent: ACCENT,
    },
  },
  {
    id: "industry-money",
    startSec: 264.92,
    endSec: 269.52,
    kind: "image",
    payload: {
      src: img("pastillero"),
      kicker: "La industria",
      title: "DOS MIL MILLONES AL AÑO",
      side: "right",
      accent: COOL,
    },
  },
  {
    id: "tianguis",
    startSec: 284.82,
    endSec: 289.42,
    kind: "image",
    payload: {
      src: img("mercado_tianguis"),
      kicker: "Lo barato no vende",
      title: "5 O 6 PESOS EN EL TIANGUIS",
      side: "left",
      accent: ACCENT,
    },
  },
  {
    id: "benefit1",
    startSec: 332.38,
    endSec: 337.68,
    kind: "image",
    payload: {
      src: img("persona_desvelada"),
      kicker: "Beneficio 1",
      title: "TE QUEDAS DORMIDO MÁS RÁPIDO",
      side: "right",
      accent: ACCENT,
    },
  },
  {
    id: "benefit3-energy",
    startSec: 382.04,
    endSec: 387.04,
    kind: "image",
    payload: {
      src: img("persona_energica_manana"),
      kicker: "Beneficio 3",
      title: "ENERGÍA DESDE LA MAÑANA",
      side: "left",
      accent: ACCENT,
    },
  },
  {
    id: "benefit4-5",
    startSec: 424.86,
    endSec: 429.46,
    kind: "image",
    payload: {
      src: img("kiwi_cut"),
      kicker: "Beneficios 4 y 5",
      title: "ACTINIDINA Y EFECTO ACUMULADO",
      side: "right",
      accent: TEAL,
    },
  },
  {
    id: "no-miracle",
    startSec: 486.54,
    endSec: 491.54,
    kind: "kit",
    payload: {
      kit: "quote",
      kicker: "Sin promesas vacías",
      quote: "No vas a dormir en una nube la primera noche. Esto se construye.",
      author: "Dr. Federer",
      role: "Federer Consejos",
      src: img("persona_durmiendo_profundo"),
      mood: "warmdark",
      accent: ACCENT,
    },
  },
  {
    id: "limits",
    startSec: 503.66,
    endSec: 508.66,
    kind: "kit",
    payload: {
      kit: "checklist",
      kicker: "Límites honestos",
      title: "Antes de empezar",
      hot: ["empezar"],
      items: [
        "Insomnio severo o apnea: no reemplaza tu tratamiento",
        "Anticoagulantes: consulta a tu médico antes",
        "Resultados reales: entre 2 y 4 semanas, no la primera noche",
      ],
      mood: "cool",
      accent: COOL,
    },
  },
  {
    id: "kiwi-ripe",
    startSec: 578.2,
    endSec: 582.7,
    kind: "image",
    payload: {
      src: img("kiwi_maduro"),
      kicker: "El error #2",
      title: "QUE CEDA AL TACTO, DULCE Y AROMÁTICO",
      side: "left",
      accent: ACCENT,
    },
  },
  {
    id: "step1",
    startSec: 627.1,
    endSec: 632.1,
    kind: "kit",
    payload: {
      kit: "step",
      step: 1,
      total: 5,
      title: "Dos kiwis, una hora antes",
      hot: ["Dos"],
      sub: "Con cuchara, directo de la cáscara.",
      src: img("kiwi_cut"),
      mood: "gold",
      accent: ACCENT,
    },
  },
  {
    id: "step2",
    startSec: 646.96,
    endSec: 651.96,
    kind: "kit",
    payload: {
      kit: "step",
      step: 2,
      total: 5,
      title: "Machacado con medio plátano",
      hot: ["plátano"],
      sub: "Potasio y triptófano extra, trabajando en equipo.",
      src: img("platano_kiwi"),
      mood: "gold",
      accent: ACCENT,
    },
  },
  {
    id: "step3",
    startSec: 667.8,
    endSec: 672.8,
    kind: "kit",
    payload: {
      kit: "step",
      step: 3,
      total: 5,
      title: "Agua tibia con nuez moscada",
      hot: ["nuez", "moscada"],
      sub: "Nunca fría: evita el choque digestivo.",
      src: img("agua_tibia_nuez"),
      mood: "warmdark",
      accent: ACCENT,
    },
  },
  {
    id: "step4",
    startSec: 690.52,
    endSec: 695.52,
    kind: "kit",
    payload: {
      kit: "step",
      step: 4,
      total: 5,
      title: "Apaga la pantalla",
      hot: ["Apaga"],
      sub: "Dale la hora completa a la oscuridad.",
      src: img("telefono_apagado"),
      mood: "cool",
      accent: COOL,
    },
  },
  {
    id: "step5",
    startSec: 712.24,
    endSec: 717.24,
    kind: "kit",
    payload: {
      kit: "step",
      step: 5,
      total: 5,
      title: "Sin faltar una sola noche",
      hot: ["faltar"],
      sub: "21 días. Constancia, no magia.",
      src: img("calendario_21dias"),
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "cost-compare",
    startSec: 737.42,
    endSec: 742.42,
    kind: "kit",
    payload: {
      kit: "beforeAfter",
      kicker: "El costo real",
      title: "20 pesos contra 300 o 400",
      hot: ["20"],
      imageA: img("pastillero"),
      imageB: img("kiwi_cut"),
      labelA: "Pastillas: $300-400/mes",
      labelB: "Kiwi: ~$20/día",
      mood: "cool",
      accent: COOL,
    },
  },
  {
    id: "family",
    startSec: 799.04,
    endSec: 803.64,
    kind: "image",
    payload: {
      src: img("persona_mayor_familia"),
      kicker: "Lo que de verdad importa",
      title: "PACIENCIA PARA TUS NIETOS",
      side: "left",
      accent: ACCENT,
    },
  },
  {
    id: "recap-chapter",
    startSec: 816.88,
    endSec: 821.88,
    kind: "kit",
    payload: {
      kit: "chapter",
      kicker: "Recapitulemos",
      index: "01-05",
      title: "Dos kiwis, una hora antes",
      sub: "Cinco pasos, un hábito.",
      mood: "gold",
      accent: ACCENT,
    },
  },
  {
    id: "comments",
    startSec: 858.06,
    endSec: 863.06,
    kind: "kit",
    payload: {
      kit: "cta",
      kicker: "Tu turno",
      title: "¿De qué parte nos ves?",
      hot: ["parte"],
      sub: "México, Latinoamérica: cuéntame y te leo.",
      buttonLabel: "Coméntame ahora",
      src: img("mapa_latam"),
      mood: "science",
      accent: TEAL,
    },
  },
  {
    id: "share",
    startSec: 874.9,
    endSec: 879.3,
    kind: "image",
    payload: {
      src: img("persona_mayor_familia"),
      kicker: "Compártelo",
      title: "CON ALGUIEN QUE AMAS",
      side: "right",
      accent: ACCENT,
    },
  },
  {
    id: "teaser",
    startSec: 900.28,
    endSec: 908.0,
    kind: "image",
    payload: {
      src: img("especias_alacena"),
      kicker: "La próxima vez",
      title: "UN FRASCO DE TU ALACENA",
      side: "left",
      accent: ACCENT,
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
  beat: FedBeat;
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
        <Img src={beat.payload.src ?? ""} style={mediaStyle} />
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

const AvatarStatement: React.FC<{beat: FedBeat; durationInFrames: number}> = ({
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
          width: width * 0.4,
          padding: "22px 28px 24px",
          borderLeft: side === "left" ? `5px solid ${accent}` : undefined,
          borderRight: side === "right" ? `5px solid ${accent}` : undefined,
          borderRadius: 20,
          background: "linear-gradient(145deg, rgba(2,6,13,0.72), rgba(2,6,13,0.4))",
          opacity: enter,
          transform: `translateX(${(side === "right" ? 1 : -1) * (1 - enter) * 54}px)`,
          boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 16,
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
            fontSize: 40,
            fontWeight: 850,
            lineHeight: 1.04,
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

const KitScene: React.FC<{beat: FedBeat}> = ({beat}) => {
  const p = beat.payload;

  switch (p.kit) {
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
          image={p.src}
          mood={p.mood}
          accent={p.accent ?? TEAL}
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
          image={p.src}
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
          prefix={p.prefix}
          label={p.label}
          sub={p.sub}
          image={p.src}
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
          image={p.src}
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
    case "beforeAfter":
      return (
        <FedBeforeAfter
          kicker={p.kicker}
          title={p.title}
          hot={p.hot}
          imageA={p.imageA}
          imageB={p.imageB}
          labelA={p.labelA}
          labelB={p.labelB}
          mood={p.mood}
          accent={p.accent ?? COOL}
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
          image={p.src}
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
        src={staticFile("v8c55b7vy74c_opt.mp4")}
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

export const MainV8c55b7vy74c: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: "#020409", overflow: "hidden"}}>
      <AvatarBase />

      {BEATS_V8C55B7VY74C.map((beat) => {
        const from = Math.max(0, Math.round(beat.startSec * fps));
        const requested = Math.max(1, Math.round((beat.endSec - beat.startSec) * fps));
        const durationInFrames = beat.kind === "kit" ? FED_SCENE_F : requested;
        const remaining = TOTAL_FRAMES_V8C55B7VY74C - from;
        const duration = Math.max(1, Math.min(durationInFrames, remaining));

        return (
          <Sequence
            key={beat.id}
            from={from}
            durationInFrames={duration}
            premountFor={Math.min(30, Math.max(0, duration - 1))}
            name={`V8c55b7vy74c · ${beat.id}`}
          >
            {beat.kind === "kit" ? <KitScene beat={beat} /> : null}
            {beat.kind === "image" ? <DepthMedia beat={beat} durationInFrames={duration} /> : null}
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
