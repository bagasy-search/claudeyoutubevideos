import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_STACK } from "../theme";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const Leaf: React.FC<{
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
}> = ({ x, y, rotate, scale, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 135, mass: 0.8 },
  });
  const floatY = Math.sin((frame + delay * 4) / 30) * 6;
  const floatX = Math.cos((frame + delay * 3) / 39) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 82,
        height: 34,
        borderRadius: "100% 0 100% 0",
        background:
          "linear-gradient(135deg, rgba(141,156,92,0.96), rgba(73,101,59,0.92))",
        border: "1px solid rgba(239,231,211,0.38)",
        boxShadow: "0 14px 30px rgba(34,49,25,0.24)",
        opacity: interpolate(reveal, [0, 1], [0, 1]),
        transform: `translate(${floatX}px, ${floatY}px) rotate(${rotate}deg) scale(${scale * interpolate(
          reveal,
          [0, 1],
          [0.55, 1],
        )})`,
        transformOrigin: "0% 50%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          top: 16,
          height: 1,
          background: "rgba(239,231,211,0.55)",
          transform: "rotate(-2deg)",
        }}
      />
    </div>
  );
};

const RootPath: React.FC<{
  d: string;
  length: number;
  delay: number;
  width: number;
}> = ({ d, length, delay, width }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [delay, delay + 64], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 0.72, 0.18, 1),
  });
  return (
    <path
      d={d}
      fill="none"
      stroke="#F2E7C7"
      strokeLinecap="round"
      strokeWidth={width}
      strokeDasharray={length}
      strokeDashoffset={length * (1 - draw)}
      opacity={0.9}
    />
  );
};

export const WillowBiologyReveal_v55lhde2f1a4: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camera = interpolate(
    frame,
    [0, durationInFrames],
    [1.02, 1.095],
    { ...clamp, easing: Easing.inOut(Easing.quad) },
  );
  const cameraX = interpolate(frame, [0, durationInFrames], [-18, 24], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const reveal = spring({
    frame: frame - 5,
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.9 },
  });
  const jarReveal = spring({
    frame: frame - 18,
    fps,
    config: { damping: 17, stiffness: 115, mass: 0.82 },
  });
  const myth = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 160, mass: 0.75 },
  });
  const truth = spring({
    frame: frame - 48,
    fps,
    config: { damping: 18, stiffness: 125, mass: 0.86 },
  });
  const line = interpolate(frame, [42, 112], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.7, 0.2, 1),
  });
  const water = Math.sin(frame / 17) * 4;
  const sweepX = interpolate(frame, [32, 132], [-480, 420], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 68% 42%, #F1E8D1 0%, #D8C8A7 42%, #9C805D 100%)",
        color: "#2A2620",
        fontFamily: FONT_STACK,
      }}
    >
      {/* 1 · Fondo editorial: luz, cuadrícula y fibra de papel. */}
      <AbsoluteFill
        style={{
          opacity: 0.3,
          backgroundImage:
            "linear-gradient(rgba(42,38,32,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(42,38,32,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          transform: `translateX(${cameraX * -0.18}px) scale(1.08)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 74% 44%, rgba(255,250,230,0.56), transparent 31%), linear-gradient(110deg, rgba(42,38,32,0.20), transparent 32%, transparent 73%, rgba(42,38,32,0.12))",
        }}
      />

      {/* 2 · Silueta botánica lejana, a distinta velocidad para el parallax. */}
      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: -50,
          width: 2020,
          height: 1180,
          opacity: 0.12,
          transform: `translate(${cameraX * -0.5}px, ${Math.sin(frame / 70) * 8}px) scale(1.08)`,
        }}
      >
        <path
          d="M140 1040 C440 800 470 485 785 245 C1000 80 1300 160 1690 -80"
          fill="none"
          stroke="#31402B"
          strokeWidth="34"
          strokeLinecap="round"
        />
        <path
          d="M600 620 C430 520 330 420 250 260 M900 300 C1040 270 1180 190 1260 70 M1110 230 C1280 360 1430 380 1580 330"
          fill="none"
          stroke="#31402B"
          strokeWidth="17"
          strokeLinecap="round"
        />
      </svg>

      <AbsoluteFill
        style={{
          transform: `translateX(${cameraX}px) scale(${camera})`,
          transformOrigin: "58% 52%",
          opacity: interpolate(reveal, [0, 1], [0, 1]),
        }}
      >
        {/* 3 · Bloque de mito, construido como sello editorial en dos planos. */}
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 204,
            width: 560,
            transform: `translateX(${interpolate(myth, [0, 1], [-100, 0])}px) rotate(-2.2deg)`,
            opacity: interpolate(myth, [0, 1], [0, 1]),
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 7,
              color: "#7F6047",
              marginBottom: 18,
            }}
          >
            PRIMERO, DESCARTEMOS EL MITO
          </div>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              padding: "24px 36px 19px",
              border: "4px solid #A5533D",
              color: "#8E412F",
              fontSize: 74,
              lineHeight: 0.92,
              fontWeight: 800,
              letterSpacing: 1,
              background: "rgba(239,231,211,0.76)",
              boxShadow: "12px 16px 0 rgba(98,69,46,0.12)",
            }}
          >
            NO ES
            <br />
            MAGIA
            <div
              style={{
                position: "absolute",
                left: -20,
                right: -20,
                top: "50%",
                height: 7,
                background: "#A5533D",
                transform: `scaleX(${interpolate(frame, [24, 48], [0, 1], clamp)}) rotate(-7deg)`,
                transformOrigin: "left center",
                boxShadow: "0 2px 0 rgba(239,231,211,0.8)",
              }}
            />
          </div>
        </div>

        {/* 4 · Sistema central: frasco, agua, rama y raíces animadas. */}
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 112,
            width: 630,
            height: 820,
            opacity: interpolate(jarReveal, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(jarReveal, [0, 1], [75, 0])}px) scale(${interpolate(
              jarReveal,
              [0, 1],
              [0.84, 1],
            )})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 106,
              top: 190,
              width: 402,
              height: 520,
              border: "5px solid rgba(73,73,59,0.55)",
              borderTop: "none",
              borderRadius: "0 0 82px 82px",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.54) 23%, rgba(255,255,255,0.13) 70%)",
              boxShadow:
                "0 48px 75px rgba(79,53,34,0.28), inset 22px 0 30px rgba(255,255,255,0.25), inset -22px 0 30px rgba(72,89,65,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -16,
                right: -16,
                bottom: -8,
                height: 320,
                background:
                  "linear-gradient(180deg, rgba(157,187,172,0.50), rgba(78,121,105,0.74))",
                borderRadius: "48% 52% 0 0",
                transform: `translateY(${water}px) rotate(${Math.sin(frame / 24) * 0.35}deg)`,
                boxShadow: "inset 0 12px 25px rgba(255,255,255,0.28)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 32,
                top: 40,
                width: 20,
                height: 385,
                borderRadius: 20,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.05))",
                opacity: 0.55,
              }}
            />
          </div>

          <svg
            viewBox="0 0 630 820"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            <path
              d="M314 38 C302 176 335 275 309 467"
              fill="none"
              stroke="#5A6D3B"
              strokeWidth="25"
              strokeLinecap="round"
            />
            <path
              d="M318 134 C384 102 420 69 449 24 M309 216 C248 184 215 150 187 105"
              fill="none"
              stroke="#637848"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <circle cx="312" cy="448" r="21" fill="#D7D0A8" stroke="#6E8B47" strokeWidth="7" />
            <circle
              cx="312"
              cy="448"
              r={34 + Math.sin(frame / 10) * 5}
              fill="none"
              stroke="rgba(242,231,199,0.55)"
              strokeWidth="3"
            />
            <RootPath d="M312 452 C292 505 245 548 232 632 C226 673 205 706 173 742" length={390} delay={40} width={9} />
            <RootPath d="M310 454 C329 514 366 551 359 626 C354 680 394 715 420 758" length={420} delay={50} width={8} />
            <RootPath d="M310 455 C313 536 293 584 308 671 C315 714 307 752 289 788" length={390} delay={60} width={7} />
            <RootPath d="M296 532 C255 558 246 595 213 621" length={170} delay={68} width={5} />
            <RootPath d="M354 604 C397 613 421 647 450 663" length={170} delay={78} width={5} />
          </svg>

          <Leaf x={390} y={100} rotate={-28} scale={1.12} delay={24} />
          <Leaf x={436} y={31} rotate={-42} scale={0.86} delay={31} />
          <Leaf x={176} y={119} rotate={198} scale={1.02} delay={38} />
          <Leaf x={210} y={193} rotate={170} scale={0.82} delay={45} />

          {/* 5 · Nodo técnico: pulso y línea de conexión. */}
          <div
            style={{
              position: "absolute",
              left: 376,
              top: 430,
              width: 225,
              height: 2,
              background: "#6E8B47",
              transform: `scaleX(${line})`,
              transformOrigin: "left center",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 512,
              top: 388,
              padding: "13px 19px",
              borderRadius: 40,
              background: "#2F3D2B",
              color: "#F4EBD5",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              opacity: line,
              transform: `translateX(${interpolate(line, [0, 1], [25, 0])}px)`,
              boxShadow: "0 14px 28px rgba(42,38,32,0.25)",
            }}
          >
            NODO ACTIVO
          </div>
        </div>

        {/* 6 · Payoff tipográfico, con jerarquía y subcapas. */}
        <div
          style={{
            position: "absolute",
            right: 92,
            top: 240,
            width: 515,
            opacity: interpolate(truth, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(truth, [0, 1], [95, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "9px 18px",
              borderRadius: 30,
              color: "#F3EAD5",
              background: "#6E8B47",
              boxShadow: "0 12px 28px rgba(72,93,48,0.25)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            LO QUE SÍ OCURRE
          </div>
          <div
            style={{
              marginTop: 25,
              fontSize: 76,
              lineHeight: 0.92,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#2E2B23",
              textShadow: "0 2px 0 rgba(255,255,255,0.45)",
            }}
          >
            BIOLOGÍA
            <br />
            DEL SAUCE
          </div>
          <div
            style={{
              width: interpolate(truth, [0, 1], [0, 430]),
              height: 7,
              marginTop: 24,
              background:
                "linear-gradient(90deg, #6E8B47, #A9794A 70%, transparent)",
            }}
          />
          <div
            style={{
              marginTop: 26,
              fontSize: 28,
              lineHeight: 1.22,
              fontWeight: 600,
              color: "rgba(42,38,32,0.68)",
              maxWidth: 420,
            }}
          >
            El tejido vivo activa la formación de raíces.
          </div>
        </div>

        {/* 7 · Pista de proceso: tres chips que se leen como una mini línea de tiempo. */}
        <div
          style={{
            position: "absolute",
            left: 150,
            right: 120,
            bottom: 72,
            height: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          {[
            ["01", "CORTE"],
            ["02", "NODO"],
            ["03", "RAÍZ"],
          ].map(([number, label], index) => {
            const chip = spring({
              frame: frame - 76 - index * 10,
              fps,
              config: { damping: 20, stiffness: 150, mass: 0.75 },
            });
            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 24px 10px 12px",
                  border: "1px solid rgba(42,38,32,0.18)",
                  borderRadius: 38,
                  background: "rgba(246,238,218,0.82)",
                  boxShadow: "0 13px 30px rgba(82,61,38,0.16)",
                  opacity: interpolate(chip, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(chip, [0, 1], [25, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: index === 2 ? "#6E8B47" : "#A9794A",
                    color: "#F4EBD5",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {number}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* 8 · Barrido de luz frontal y partículas: acabado de composición, no una tarjeta plana. */}
        <div
          style={{
            position: "absolute",
            left: sweepX,
            top: -190,
            width: 180,
            height: 1450,
            background:
              "linear-gradient(90deg, transparent, rgba(255,250,230,0.30), transparent)",
            transform: "rotate(16deg)",
            opacity: 0.75,
          }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 680 + i * 116 + Math.sin((frame + i * 19) / 26) * 16,
              top: 205 + i * 118 + Math.cos((frame + i * 23) / 33) * 12,
              width: 7 + (i % 2) * 5,
              height: 7 + (i % 2) * 5,
              borderRadius: "50%",
              background: i % 2 ? "#F2E7C7" : "#7C8A5A",
              opacity: 0.34,
              boxShadow: "0 0 18px rgba(242,231,199,0.6)",
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Borde óptico final: cierra la pieza como una composición editorial. */}
      <AbsoluteFill
        style={{
          border: "24px solid rgba(58,44,31,0.10)",
          boxShadow: "inset 0 0 130px rgba(57,40,25,0.24)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
