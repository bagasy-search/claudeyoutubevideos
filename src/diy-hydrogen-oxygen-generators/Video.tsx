import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import {KEYWORDS, SECTIONS, STOCK} from "./data";

type Caption = {text: string; startMs: number; endMs: number};

const BG = "#061017";
const INK = "#f2f7f8";
const MUTED = "#a8bbc1";
const BEAT_SECONDS = 5.2;
const TOTAL_SECONDS = 1290.4;
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const sectionAt = (seconds: number) => {
  const found = SECTIONS.findIndex((s) => seconds >= s.start && seconds < s.end);
  return found < 0 ? SECTIONS.length - 1 : found;
};

const Grain = () => (
  <>
    <AbsoluteFill
      style={{
        opacity: 0.035,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.86' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.75'/%3E%3C/svg%3E\")",
        mixBlendMode: "soft-light",
      }}
    />
    <AbsoluteFill
      style={{
        boxShadow: "inset 0 0 210px rgba(0,0,0,.62)",
        borderTop: "12px solid rgba(2,8,12,.7)",
        borderBottom: "12px solid rgba(2,8,12,.7)",
      }}
    />
  </>
);

const ChapterMarker: React.FC<{label: string; accent: string; localSeconds: number}> = ({
  label,
  accent,
  localSeconds,
}) => {
  const frame = useCurrentFrame();
  if (localSeconds >= 7) return null;
  const enter = interpolate(frame, [2, 18], [0, 1], {...clamp, easing: easeOut});
  return (
    <div
      style={{
        position: "absolute",
        left: 68,
        top: 56,
        display: "flex",
        alignItems: "center",
        gap: 17,
        opacity: enter,
        transform: `translateX(${(1 - enter) * -24}px)`,
      }}
    >
      <div style={{width: 52, height: 2, background: accent}} />
      <div style={{fontSize: 18, letterSpacing: 4.4, fontWeight: 800, color: "#e8f4f6"}}>
        {label}
      </div>
    </div>
  );
};

const Headline: React.FC<{text: string; accent: string; quiet?: boolean}> = ({
  text,
  accent,
  quiet = false,
}) => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: 30, config: {damping: 18, stiffness: 115, mass: 0.85}});
  const exit = interpolate(frame, [132, 154], [1, 0], {...clamp, easing: Easing.in(easeOut)});
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: quiet ? 164 : 210,
        width: quiet ? 650 : 790,
        opacity: enter * exit * (quiet ? 0.78 : 1),
        transform: `translateY(${(1 - enter) * 32}px)`,
      }}
    >
      <div
        style={{
          fontSize: quiet ? 48 : 72,
          lineHeight: 0.98,
          letterSpacing: -2.2,
          fontWeight: 860,
          color: INK,
          textShadow: "0 14px 44px rgba(0,0,0,.72)",
        }}
      >
        {text}
      </div>
      <div style={{width: quiet ? 76 : 118, height: 3, background: accent, marginTop: 24}} />
    </div>
  );
};

const PrecisionCallout: React.FC<{text: string; accent: string}> = ({text, accent}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [8, 24], [0, 1], {...clamp, easing: easeOut});
  return (
    <div
      style={{
        position: "absolute",
        right: 68,
        top: 118,
        width: 430,
        paddingLeft: 24,
        borderLeft: `2px solid ${accent}`,
        opacity: reveal,
        transform: `translateX(${(1 - reveal) * 24}px)`,
      }}
    >
      <div style={{fontSize: 13, letterSpacing: 3.5, color: accent, fontWeight: 800}}>
        ENGINEERING NOTE
      </div>
      <div style={{fontSize: 26, lineHeight: 1.18, color: "#eef7f8", marginTop: 10, fontWeight: 650}}>
        {text}
      </div>
    </div>
  );
};

const Bubble: React.FC<{x: number; delay: number; accent: string}> = ({x, delay, accent}) => {
  const frame = useCurrentFrame();
  const y = 270 - ((frame * (1.4 + delay * 0.08) + delay * 41) % 300);
  const size = 9 + (delay % 3) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 68 + y,
        width: size,
        height: size,
        border: `1.5px solid ${accent}`,
        borderRadius: "50%",
        opacity: 0.72,
        boxShadow: `0 0 12px ${accent}77`,
      }}
    />
  );
};

const Vessel: React.FC<{x: number; accent: string; electrodeSide: "left" | "right"}> = ({
  x,
  accent,
  electrodeSide,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 252,
      width: 230,
      height: 360,
      border: "2px solid rgba(225,244,247,.78)",
      borderTop: 0,
      borderRadius: "0 0 28px 28px",
      background: "linear-gradient(180deg, rgba(18,126,139,.18), rgba(12,195,178,.26))",
      boxShadow: "inset 0 -60px 80px rgba(16,215,196,.08)",
    }}
  >
    <div
      style={{
        position: "absolute",
        [electrodeSide]: 54,
        top: -34,
        width: 15,
        height: 285,
        borderRadius: 7,
        background: "linear-gradient(90deg,#82959a,#eef7f8,#73858a)",
      }}
    />
    {Array.from({length: 11}, (_, i) => (
      <Bubble key={i} x={40 + (i % 4) * 35} delay={i} accent={accent} />
    ))}
  </div>
);

const ReactionDiagram: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [8, 144], [0, 1], {...clamp, easing: Easing.inOut(Easing.ease)});
  const Atom = ({x, y, size, color}: {x: number; y: number; size: number; color: string}) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 42px ${color}55`,
      }}
    />
  );
  return (
    <>
      <div style={{position: "absolute", left: 150, top: 370, width: 360, height: 2, background: "#b9d5da55"}} />
      <Atom x={180} y={310} size={74} color="#ff735c" />
      <Atom x={145} y={378} size={51} color="#eaf7f9" />
      <Atom x={245} y={378} size={51} color="#eaf7f9" />
      <div style={{position: "absolute", left: 570, top: 350, width: 570, height: 2, background: "#b9d5da55"}} />
      <div
        style={{
          position: "absolute",
          left: 570 + travel * 570,
          top: 342,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 24px ${accent}`,
        }}
      />
      <div style={{position: "absolute", right: 180, top: 300, display: "flex", gap: 58, alignItems: "center"}}>
        <div style={{fontSize: 86, fontWeight: 850, color: "#69e7ff"}}>2H₂</div>
        <div style={{fontSize: 32, color: MUTED}}>+</div>
        <div style={{fontSize: 86, fontWeight: 850, color: "#ff735c"}}>O₂</div>
      </div>
    </>
  );
};

const EnergyDiagram: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [10, 125], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{position: "absolute", left: 175, right: 175, top: 310}}>
      <div style={{fontSize: 20, letterSpacing: 4, color: MUTED}}>ELECTRICAL INPUT</div>
      <div style={{height: 7, background: "#dceef0", marginTop: 18, width: `${p * 100}%`}} />
      <div style={{display: "grid", gridTemplateColumns: "1.55fr .75fr .42fr", gap: 18, marginTop: 72}}>
        {[
          ["CHEMICAL ENERGY", "#69e7ff"],
          ["HEAT", "#ffb54a"],
          ["LOSSES", "#ff735c"],
        ].map(([label, color], i) => (
          <div key={label}>
            <div style={{height: 72, background: color, opacity: 0.82, transform: `scaleX(${p})`, transformOrigin: "left"}} />
            <div style={{fontSize: 18, letterSpacing: 2.6, color: "#eef7f8", marginTop: 16}}>{label}</div>
            {i === 0 && <div style={{fontSize: 14, color: accent, marginTop: 7}}>useful, never free</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const SafetyDiagram: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 180, right: 180, top: 300, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 42}}>
      {[
        ["01", "VENTILATE", "Keep both vessels open"],
        ["02", "LIMIT CURRENT", "Stop before heat builds"],
        ["03", "NEVER IGNITE", "Measure bubbles, not flame"],
      ].map(([number, title, note], i) => {
        const enter = spring({frame: frame - i * 8, fps: 30, config: {damping: 18, stiffness: 120}});
        return (
          <div key={number} style={{opacity: enter, transform: `translateY(${(1 - enter) * 34}px)`, borderTop: `2px solid ${accent}`, paddingTop: 24}}>
            <div style={{fontSize: 17, color: accent, letterSpacing: 3}}>{number}</div>
            <div style={{fontSize: 37, color: INK, fontWeight: 820, marginTop: 45}}>{title}</div>
            <div style={{fontSize: 20, color: MUTED, lineHeight: 1.35, marginTop: 16}}>{note}</div>
          </div>
        );
      })}
    </div>
  );
};

const CellDiagram: React.FC<{accent: string; split: boolean}> = ({accent, split}) => (
  <>
    <Vessel x={split ? 440 : 760} accent={accent} electrodeSide="left" />
    {split && <Vessel x={1240} accent={accent} electrodeSide="right" />}
    {split && (
      <>
        <div style={{position: "absolute", left: 675, top: 472, width: 560, borderTop: `3px dashed ${accent}88`}} />
        <div style={{position: "absolute", left: 850, top: 494, fontSize: 17, letterSpacing: 3, color: accent}}>
          IONIC BRIDGE · GAS SPACES APART
        </div>
      </>
    )}
    {!split && (
      <div style={{position: "absolute", left: 1040, top: 415, width: 480}}>
        <div style={{fontSize: 54, fontWeight: 850, color: INK}}>ONE GAS SPACE</div>
        <div style={{fontSize: 22, color: MUTED, lineHeight: 1.4, marginTop: 18}}>
          Hydrogen and oxygen leave the electrodes into the same open atmosphere.
        </div>
      </div>
    )}
  </>
);

const TechnicalPlate: React.FC<{visual: string; accent: string; title: string}> = ({
  visual,
  accent,
  title,
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  const leave = interpolate(frame, [138, 156], [1, 0], {...clamp, easing: Easing.in(easeOut)});
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 75% 35%, ${accent}18, transparent 42%), ${BG}`,
        opacity: reveal * leave,
      }}
    >
      <div style={{position: "absolute", left: 70, right: 70, top: 62, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{fontSize: 19, letterSpacing: 4.5, color: accent, fontWeight: 800}}>FIELD NOTE / {title}</div>
        <div style={{fontSize: 14, color: "#7d959c", letterSpacing: 3}}>CLAUDIO YODER · LAB SERIES</div>
      </div>
      <div style={{position: "absolute", left: 70, right: 70, top: 105, height: 1, background: "#d9eef01e"}} />
      {visual === "safety" && <SafetyDiagram accent={accent} />}
      {(visual === "molecules" || visual === "hook") && <ReactionDiagram accent={accent} />}
      {(visual === "energy" || visual === "measure") && <EnergyDiagram accent={accent} />}
      {visual === "cell" && <CellDiagram accent={accent} split={false} />}
      {(visual === "split" || visual === "final") && <CellDiagram accent={accent} split />}
      <Grain />
    </AbsoluteFill>
  );
};

const AvatarHero: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const push = interpolate(frame, [0, 5.2 * fps], [1.015, 1.075], {...clamp, easing: Easing.inOut(Easing.ease)});
  const titleIn = interpolate(frame, [8, 28], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill style={{background: BG, overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("diy-hydrogen-oxygen-generators-avatar.mp4")}
        muted
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})`}}
      />
      <AbsoluteFill style={{background: "linear-gradient(90deg,rgba(3,10,14,.92) 0%,rgba(3,10,14,.58) 38%,transparent 70%)"}} />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 170,
          width: 760,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 42}px)`,
        }}
      >
        <div style={{fontSize: 19, letterSpacing: 5.5, color: "#69e7ff", fontWeight: 800}}>GROCERY-STORE ELECTROCHEMISTRY</div>
        <div style={{fontSize: 78, lineHeight: 0.94, letterSpacing: -3.5, color: INK, fontWeight: 880, marginTop: 28}}>
          SPLITTING<br />WATER
        </div>
        <div style={{fontSize: 25, lineHeight: 1.35, color: "#c7d7db", width: 590, marginTop: 28}}>
          What the bubbles prove—and what “HHO” claims leave out.
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

const AvatarBlend: React.FC<{startFrame: number; accent: string}> = ({startFrame, accent}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [8, 24], [0, 1], {...clamp, easing: easeOut});
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 680,
        height: "100%",
        opacity: enter,
        WebkitMaskImage: "linear-gradient(90deg,transparent 0%,black 34%,black 100%)",
        maskImage: "linear-gradient(90deg,transparent 0%,black 34%,black 100%)",
      }}
    >
      <OffthreadVideo
        src={staticFile("diy-hydrogen-oxygen-generators-avatar.mp4")}
        startFrom={startFrame}
        muted
        style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "63% center", transform: "scale(1.08)"}}
      />
      <div style={{position: "absolute", left: "58%", top: 70, width: 86, height: 2, background: accent}} />
    </div>
  );
};

const StockBeat: React.FC<{beat: number; startFrame: number}> = ({beat, startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = startFrame / fps;
  const sectionIndex = sectionAt(seconds);
  const section = SECTIONS[sectionIndex];
  const localSeconds = seconds - section.start;
  const clip = STOCK[(beat * 7 + sectionIndex * 3) % STOCK.length];
  const keywords = KEYWORDS[sectionIndex];
  const zoom = interpolate(frame, [0, BEAT_SECONDS * fps], [1.035, 1.105], {...clamp, easing: Easing.inOut(Easing.ease)});
  const generatedHero = beat % 29 === 13;
  const technical = beat % 9 === 4;
  const avatar = !technical && beat % 13 === 6 && seconds > 20;
  const showHeadline = !technical && !avatar && beat % 3 === 0;
  const showCallout = !technical && !avatar && beat % 4 === 1;
  return (
    <AbsoluteFill style={{background: BG, overflow: "hidden"}}>
      {generatedHero ? (
        <Img
          src={staticFile(beat % 58 === 13 ? "images/open-hho-cell-hero.png" : "images/split-cell-hero.png")}
          style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`}}
        />
      ) : (
        <OffthreadVideo
          src={staticFile(`stock-render/${clip}`)}
          muted
          delayRenderTimeoutInMilliseconds={120000}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom}) translate3d(${Math.sin(beat * 1.7) * 1.1}%,${Math.cos(beat) * .5}%,0)`,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background:
            showHeadline || avatar
              ? "linear-gradient(90deg,rgba(3,10,14,.84) 0%,rgba(3,10,14,.28) 52%,rgba(3,10,14,.08) 100%)"
              : "linear-gradient(180deg,rgba(3,10,14,.25),rgba(3,10,14,.06) 45%,rgba(3,10,14,.38))",
        }}
      />
      <ChapterMarker label={section.label} accent={section.accent} localSeconds={localSeconds} />
      {showHeadline && <Headline text={keywords[beat % keywords.length]} accent={section.accent} quiet={beat % 6 === 0} />}
      {showCallout && <PrecisionCallout text={keywords[(beat + 1) % keywords.length]} accent={section.accent} />}
      {avatar && <AvatarBlend startFrame={startFrame} accent={section.accent} />}
      {technical && <TechnicalPlate visual={section.visual} accent={section.accent} title={section.label} />}
      <Grain />
    </AbsoluteFill>
  );
};

const Captions: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const caption = captions.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!caption) return null;
  const words = caption.text.trim().split(/\s+/);
  const progress = (ms - caption.startMs) / Math.max(1, caption.endMs - caption.startMs);
  const active = Math.min(words.length - 1, Math.floor(progress * words.length));
  return (
    <div style={{position: "absolute", left: 220, right: 220, bottom: 52, display: "flex", justifyContent: "center", zIndex: 50}}>
      <div
        style={{
          maxWidth: 1380,
          padding: "14px 24px 16px",
          borderRadius: 12,
          background: "rgba(2,10,14,.78)",
          borderBottom: "2px solid rgba(105,231,255,.68)",
          boxShadow: "0 12px 44px rgba(0,0,0,.42)",
          textAlign: "center",
          fontSize: 36,
          lineHeight: 1.14,
          fontWeight: 760,
          color: "white",
          textShadow: "0 3px 12px #000",
        }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} style={{color: i === active ? "#69e7ff" : "white"}}>
            {word}{i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export const DIYHydrogenOxygen: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender("Loading captions"));
  const [captions, setCaptions] = useState<Caption[]>([]);

  const load = useCallback(async () => {
    try {
      const response = await fetch(staticFile("captions.json"));
      setCaptions(await response.json());
      continueRender(handle);
    } catch (error) {
      cancelRender(error);
    }
  }, [cancelRender, continueRender, handle]);

  useEffect(() => void load(), [load]);

  const beats = useMemo(
    () => Array.from({length: Math.ceil(TOTAL_SECONDS / BEAT_SECONDS)}, (_, i) => Math.round(i * BEAT_SECONDS * fps)),
    [fps],
  );

  return (
    <AbsoluteFill style={{background: BG, fontFamily: "Arial, Helvetica, sans-serif"}}>
      <Audio src={staticFile("diy-hydrogen-oxygen-generators-audio.mp3")} volume={1} />
      <Audio src={staticFile("audio/background.wav")} volume={0.02} loop />
      {beats.map((from, beat) => {
        const duration = Math.min(Math.ceil(BEAT_SECONDS * fps), durationInFrames - from);
        if (duration <= 0) return null;
        return (
          <Sequence key={from} from={from} durationInFrames={duration} premountFor={fps}>
            {beat === 0 ? <AvatarHero /> : <StockBeat beat={beat} startFrame={from} />}
          </Sequence>
        );
      })}
      <Captions captions={captions} />
    </AbsoluteFill>
  );
};
