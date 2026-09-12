import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const INK = "#071014";
const IVORY = "#F5F1E8";
const MINT = "#A8D5C6";
const GOLD = "#D8B56D";
const AMBER = "#E8A06A";
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const rgba = (hex: string, alpha: number) => {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

const fade = (frame: number, duration: number, edge = 16) =>
  interpolate(frame, [0, edge, Math.max(edge + 1, duration - edge), duration], [0, 1, 1, 0], CLAMP);

const Eyebrow: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = MINT}) => (
  <div style={{display: "flex", alignItems: "center", gap: 14}}>
    <span style={{width: 54, height: 3, borderRadius: 99, background: accent}} />
    <span
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 15,
        fontWeight: 850,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,.72)",
      }}
    >
      {children}
    </span>
  </div>
);

export const KickerChip: React.FC<{text: string; accent?: string}> = ({text, accent = MINT}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], {...CLAMP, easing: EASE});
  return (
    <div
      style={{
        position: "absolute",
        right: 110,
        top: 85,
        padding: "13px 18px",
        borderRadius: 999,
        border: `1px solid ${rgba(accent, 0.4)}`,
        background: "rgba(4,10,13,.42)",
        backdropFilter: "blur(12px)",
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: ".2em",
        color: "rgba(255,255,255,.78)",
        opacity: enter,
        transform: `translateY(${(1 - enter) * -10}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const StatCard: React.FC<{
  duration: number;
  kicker: string;
  big: string;
  sub?: string;
  accent?: string;
  side?: "left" | "right";
}> = ({duration, kicker, big, sub, accent = MINT, side = "left"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 95, mass: 0.95}, durationInFrames: 38});
  const align = side === "left" ? 112 : undefined;
  const alignR = side === "right" ? 112 : undefined;
  return (
    <AbsoluteFill
      style={{
        opacity: fade(frame, duration),
        background: `radial-gradient(circle at ${side === "left" ? 78 : 22}% 45%,${rgba(accent, 0.16)},${INK} 62%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: align,
          right: alignR,
          top: 0,
          bottom: 0,
          width: 980,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 55}px)`,
        }}
      >
        <Eyebrow accent={accent}>{kicker}</Eyebrow>
        <div
          style={{
            marginTop: 22,
            fontFamily: "Arial, sans-serif",
            fontSize: big.length > 9 ? 92 : 132,
            fontWeight: 950,
            lineHeight: 0.92,
            letterSpacing: -4,
            color: accent,
            textShadow: `0 10px 60px ${rgba(accent, 0.35)}`,
          }}
        >
          {big}
        </div>
        {sub ? (
          <div
            style={{
              marginTop: 26,
              width: 720,
              fontFamily: "Georgia, serif",
              fontSize: 27,
              fontStyle: "italic",
              lineHeight: 1.38,
              color: "rgba(255,255,255,.76)",
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const PhotoRevealCard: React.FC<{
  duration: number;
  image: string;
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
}> = ({duration, image, kicker, title, sub, accent = GOLD}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 92, mass: 0.9}, durationInFrames: 38});
  const p = interpolate(frame, [0, duration], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden"}}>
      <Img
        src={staticFile(image)}
        style={{
          position: "absolute",
          inset: -40,
          width: "calc(100% + 80px)",
          height: "calc(100% + 80px)",
          objectFit: "cover",
          transform: `scale(${1.03 + p * 0.05}) translateX(${(p - 0.5) * -26}px)`,
          filter: "saturate(.86) contrast(1.08) brightness(.82)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,rgba(3,8,10,.86) 0%,rgba(3,8,10,.2) 52%,rgba(3,8,10,.56) 100%),linear-gradient(180deg,rgba(3,7,10,.05),rgba(3,7,10,.42))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 112,
          bottom: 108,
          width: 860,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 65}px)`,
        }}
      >
        <Eyebrow accent={accent}>{kicker}</Eyebrow>
        <div
          style={{
            marginTop: 20,
            fontFamily: "Arial, sans-serif",
            fontSize: 62,
            fontWeight: 950,
            lineHeight: 0.98,
            letterSpacing: -2.6,
            color: "white",
          }}
        >
          {title}
        </div>
        {sub ? (
          <div style={{marginTop: 20, width: 700, fontFamily: "Georgia, serif", fontSize: 25, fontStyle: "italic", lineHeight: 1.38, color: "rgba(255,255,255,.72)"}}>
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const TZoneDiagram: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 92}, durationInFrames: 40});
  const glow = interpolate(frame, [30, Math.max(31, duration - 20)], [0, 1], CLAMP);
  const pulse = 1 + Math.sin(frame / 10) * 0.03;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "radial-gradient(circle at 68% 46%,#1d3e3a,#071014 66%)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 110, top: 175, width: 680, opacity: enter, transform: `translateX(${(1 - enter) * -55}px)`}}>
        <Eyebrow accent={MINT}>Dermatología</Eyebrow>
        <div style={{marginTop: 20, fontFamily: "Arial, sans-serif", fontSize: 70, fontWeight: 950, lineHeight: 0.98, letterSpacing: -3.2, color: IVORY}}>
          LA ZONA T
          <br />
          <span style={{color: MINT}}>CONCENTRA EL SEBO</span>
        </div>
        <div style={{marginTop: 26, width: 590, fontFamily: "Georgia, serif", fontSize: 25, fontStyle: "italic", lineHeight: 1.4, color: "rgba(255,255,255,.7)"}}>
          Frente, nariz y mentón: hasta el triple de glándulas sebáceas por centímetro cuadrado que las mejillas.
        </div>
      </div>
      <div style={{position: "absolute", right: 210, top: 120, width: 560, height: 760, opacity: enter, transform: `translateX(${(1 - enter) * 80}px)`}}>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 40,
            width: 440,
            height: 620,
            borderRadius: "48% 48% 44% 44% / 54% 54% 40% 40%",
            background: "linear-gradient(160deg,#e7c2a4,#c98b6f)",
            boxShadow: "0 40px 110px rgba(0,0,0,.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 60 + 440 * 0.5 - 95,
            top: 40,
            width: 190,
            height: 620,
            borderRadius: "50% 50% 40% 40% / 55% 55% 35% 35%",
            background: rgba(MINT, 0.28 * glow),
            boxShadow: `0 0 ${60 * glow}px ${rgba(MINT, 0.6 * glow)}`,
            transform: `scale(${pulse})`,
          }}
        />
        {Array.from({length: 14}).map((_, i) => {
          const yy = 90 + (i % 7) * 78 + Math.floor(i / 7) * 30;
          const xx = 60 + 440 * 0.5 + Math.sin(i * 2.4) * 70;
          const dotGlow = interpolate(frame, [20 + i * 4, 40 + i * 4], [0, 1], CLAMP);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: xx,
                top: yy,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: MINT,
                opacity: dotGlow * 0.85,
                boxShadow: `0 0 ${10 * dotGlow}px ${rgba(MINT, 0.8)}`,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 8,
            padding: "14px 20px",
            borderRadius: 16,
            background: "rgba(245,241,232,.95)",
            fontFamily: "Arial, sans-serif",
            fontSize: 40,
            fontWeight: 950,
            color: INK,
            opacity: glow,
          }}
        >
          3X <span style={{fontSize: 18, fontWeight: 800, color: "rgba(7,16,20,.6)"}}>GLÁNDULAS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FlowDiagram: React.FC<{
  duration: number;
  mode?: "linear" | "loop";
  nodes: {label: string; sub?: string}[];
  title: string;
  sub?: string;
  accent?: string;
}> = ({duration, mode = "linear", nodes, title, sub, accent = MINT}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headEnter = spring({frame, fps, config: {damping: 19, stiffness: 92}, durationInFrames: 38});
  const n = nodes.length;
  const gap = mode === "loop" ? 340 : 420;
  const totalW = (n - 1) * gap;
  const startX = 960 - totalW / 2;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", opacity: headEnter}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Eyebrow accent={accent}>
            <span style={{display: "inline-block", width: 560, textAlign: "center"}}>{mode === "loop" ? "El círculo que se repite" : "El mismo hilo"}</span>
          </Eyebrow>
        </div>
        <div style={{marginTop: 16, fontFamily: "Arial, sans-serif", fontSize: 54, fontWeight: 950, letterSpacing: -2.2, color: IVORY}}>{title}</div>
        {sub ? <div style={{marginTop: 12, fontFamily: "Georgia, serif", fontSize: 24, fontStyle: "italic", color: "rgba(255,255,255,.68)"}}>{sub}</div> : null}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 470, height: 260}}>
        {nodes.map((node, i) => {
          const revealAt = 30 + i * 24;
          const e = spring({frame: frame - revealAt, fps, config: {damping: 18, stiffness: 100}, durationInFrames: 34});
          const x = startX + i * gap;
          return (
            <React.Fragment key={i}>
              {i > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: x - gap + 130,
                    top: 118,
                    width: gap - 260,
                    height: 4,
                    borderRadius: 99,
                    background: `linear-gradient(90deg,${rgba(accent, 0.15)},${accent})`,
                    transformOrigin: "left center",
                    transform: `scaleX(${e})`,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  left: x - 130,
                  top: 0,
                  width: 260,
                  height: 240,
                  borderRadius: 26,
                  background: i === n - 1 && mode !== "loop" ? IVORY : "rgba(255,255,255,.055)",
                  border: `1px solid ${rgba(accent, 0.55)}`,
                  boxShadow: `0 24px 70px rgba(0,0,0,.4)`,
                  opacity: e,
                  transform: `translateY(${(1 - e) * 50}px) scale(${0.85 + e * 0.15})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 18px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: 30,
                    fontWeight: 950,
                    color: i === n - 1 && mode !== "loop" ? INK : accent,
                  }}
                >
                  {node.label}
                </div>
                {node.sub ? (
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: "Georgia, serif",
                      fontSize: 16,
                      fontStyle: "italic",
                      color: i === n - 1 && mode !== "loop" ? "rgba(7,16,20,.6)" : "rgba(255,255,255,.62)",
                    }}
                  >
                    {node.sub}
                  </div>
                ) : null}
              </div>
            </React.Fragment>
          );
        })}
        {mode === "loop" ? (
          <div
            style={{
              position: "absolute",
              left: startX + (n - 1) * gap + 130,
              top: 118,
              width: 4,
              height: 4,
            }}
          >
            <svg width="200" height="240" style={{position: "absolute", left: -20, top: -190, overflow: "visible"}}>
              <path
                d={`M 0 190 C 80 190, 100 0, 0 -${startX + (n - 1) * gap - 40}`}
                stroke={accent}
                strokeWidth={3}
                fill="none"
                opacity={0.55}
              />
            </svg>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const WarningCard: React.FC<{
  duration: number;
  title: string;
  bullets: string[];
  accent?: string;
}> = ({duration, title, bullets, accent = AMBER}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 100}, durationInFrames: 36});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: `radial-gradient(circle at 74% 40%,${rgba(accent, 0.16)},${INK} 64%)`, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 112, top: 150, width: 900, opacity: enter, transform: `translateY(${(1 - enter) * 65}px)`}}>
        <Eyebrow accent={accent}>Honestidad</Eyebrow>
        <div style={{marginTop: 20, fontFamily: "Arial, sans-serif", fontSize: 62, fontWeight: 950, lineHeight: 1.0, letterSpacing: -2.6, color: "white"}}>{title}</div>
        <div style={{marginTop: 34, display: "flex", flexDirection: "column", gap: 20}}>
          {bullets.map((b, i) => {
            const e = spring({frame: frame - 26 - i * 14, fps, config: {damping: 18, stiffness: 105}, durationInFrames: 30});
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                  opacity: e,
                  transform: `translateX(${(1 - e) * -40}px)`,
                  paddingLeft: 24,
                  borderLeft: `4px solid ${accent}`,
                }}
              >
                <div style={{fontFamily: "Georgia, serif", fontSize: 24, fontStyle: "italic", lineHeight: 1.36, color: "rgba(255,255,255,.82)", maxWidth: 780}}>{b}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CardRow: React.FC<{
  duration: number;
  kicker: string;
  title?: string;
  items: {n?: string; title: string; sub?: string}[];
  accent?: string;
}> = ({duration, kicker, title, items, accent = MINT}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headEnter = interpolate(frame, [0, 20], [0, 1], {...CLAMP, easing: EASE});
  const count = items.length;
  const w = count >= 3 ? 500 : 640;
  const gap = 46;
  const totalW = count * w + (count - 1) * gap;
  const left = (1920 - totalW) / 2;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 88, textAlign: "center", opacity: headEnter}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Eyebrow accent={accent}>
            <span style={{display: "inline-block", width: 500, textAlign: "center"}}>{kicker}</span>
          </Eyebrow>
        </div>
        {title ? <div style={{marginTop: 15, fontFamily: "Arial, sans-serif", fontSize: 52, fontWeight: 950, letterSpacing: -2, color: IVORY}}>{title}</div> : null}
      </div>
      <div style={{position: "absolute", left, top: 300, display: "flex", gap}}>
        {items.map((item, i) => {
          const e = spring({frame: frame - i * 10, fps, config: {damping: 18, stiffness: 100}, durationInFrames: 34});
          return (
            <div
              key={i}
              style={{
                width: w,
                height: 460,
                borderRadius: 26,
                padding: "40px 36px",
                background: "rgba(255,255,255,.055)",
                border: `1px solid ${rgba(accent, 0.5)}`,
                boxShadow: "0 22px 60px rgba(0,0,0,.3)",
                opacity: e,
                transform: `translateY(${(1 - e) * 60}px)`,
              }}
            >
              {item.n ? (
                <div style={{fontFamily: "Arial, sans-serif", fontSize: 90, fontWeight: 950, color: rgba(accent, 0.32)}}>{item.n}</div>
              ) : null}
              <div style={{marginTop: item.n ? 30 : 8, fontFamily: "Arial, sans-serif", fontSize: 36, fontWeight: 900, color: "white"}}>{item.title}</div>
              {item.sub ? (
                <div style={{marginTop: 16, fontFamily: "Georgia, serif", fontSize: 21, fontStyle: "italic", lineHeight: 1.36, color: "rgba(255,255,255,.66)"}}>{item.sub}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const RecapList: React.FC<{duration: number; items: string[]; accent?: string}> = ({duration, items, accent = GOLD}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headEnter = interpolate(frame, [0, 18], [0, 1], {...CLAMP, easing: EASE});
  const step = Math.max(6, (duration - 60) / items.length);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "linear-gradient(135deg,#071014,#142d2a)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 62, textAlign: "center", opacity: headEnter}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Eyebrow accent={accent}>
            <span style={{display: "inline-block", width: 400, textAlign: "center"}}>Recapitulemos</span>
          </Eyebrow>
        </div>
      </div>
      <div style={{position: "absolute", left: 260, right: 260, top: 150, display: "flex", flexDirection: "column", gap: 14}}>
        {items.map((text, i) => {
          const e = spring({frame: frame - 24 - i * step, fps, config: {damping: 19, stiffness: 110}, durationInFrames: 28});
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "16px 26px",
                borderRadius: 16,
                background: "rgba(255,255,255,.045)",
                border: `1px solid ${rgba(accent, 0.35)}`,
                opacity: e,
                transform: `translateX(${(1 - e) * -50}px)`,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  minWidth: 46,
                  borderRadius: "50%",
                  background: accent,
                  color: INK,
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 950,
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div style={{fontFamily: "Georgia, serif", fontSize: 22, fontStyle: "italic", lineHeight: 1.3, color: "rgba(255,255,255,.86)"}}>{text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
