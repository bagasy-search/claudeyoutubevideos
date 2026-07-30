import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
  AbsoluteFill,
  Audio,
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

const BG = "#07141c";
const BEAT_SECONDS = 5.2;
const TOTAL_SECONDS = 1148.46;

const sectionAt = (seconds: number) =>
  Math.max(0, SECTIONS.findIndex((s) => seconds >= s.start && seconds < s.end));

const Glow: React.FC<{color: string; x: string; y: string}> = ({color, x, y}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 520,
      height: 520,
      borderRadius: "50%",
      background: color,
      filter: "blur(150px)",
      opacity: 0.16,
      transform: "translate(-50%, -50%)",
    }}
  />
);

const Noise = () => (
  <AbsoluteFill
    style={{
      opacity: 0.055,
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E\")",
      mixBlendMode: "soft-light",
      pointerEvents: "none",
    }}
  />
);

const WaterMolecule: React.FC<{x: number; y: number; scale?: number; delay?: number}> = ({
  x,
  y,
  scale = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const float = Math.sin((frame + delay) / 19) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        transform: `scale(${scale})`,
        width: 160,
        height: 90,
      }}
    >
      <div style={{position: "absolute", left: 51, top: 17, width: 58, height: 58, borderRadius: 50, background: "#ff735c", boxShadow: "0 0 28px #ff735c77"}} />
      {[15, 112].map((left) => (
        <div key={left} style={{position: "absolute", left, top: 42, width: 38, height: 38, borderRadius: 50, background: "#e9fbff", boxShadow: "0 0 20px #69e7ff88"}} />
      ))}
      <div style={{position: "absolute", left: 41, top: 49, width: 32, height: 5, background: "#c9f8ff", transform: "rotate(-18deg)"}} />
      <div style={{position: "absolute", left: 89, top: 49, width: 32, height: 5, background: "#c9f8ff", transform: "rotate(18deg)"}} />
    </div>
  );
};

const AvatarHero: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = interpolate(frame, [0, 3 * fps], [1.02, 1.09], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: BG, overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("diy-hydrogen-oxygen-generators-avatar.mp4")}
        muted
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`}}
      />
      <div
        style={{
          position: "absolute",
          inset: "0 55% 0 0",
          background: "linear-gradient(90deg, #07141c 0%, #07141cf2 70%, #07141c00 100%)",
        }}
      />
      <div style={{position: "absolute", left: 86, top: 120, width: 760}}>
        <div style={{fontSize: 25, letterSpacing: 7, color: "#69e7ff", fontWeight: 800}}>GROCERY-STORE SCIENCE</div>
        <div style={{fontSize: 80, lineHeight: 0.92, fontWeight: 950, color: "white", marginTop: 24}}>
          SPLITTING<br />WATER
        </div>
        <div style={{fontSize: 28, color: "#d6eef5", marginTop: 30, maxWidth: 600}}>
          Hydrogen, oxygen—and the truth about “HHO fuel cells”
        </div>
      </div>
      <WaterMolecule x={610} y={735} scale={0.8} />
      <Noise />
    </AbsoluteFill>
  );
};

const CellGraphic: React.FC<{split: boolean; accent: string}> = ({split, accent}) => {
  const frame = useCurrentFrame();
  const bubble = (i: number, lane: number) => {
    const y = 240 - ((frame * (1.7 + (i % 3) * 0.35) + i * 48) % 270);
    return (
      <div
        key={`${lane}-${i}`}
        style={{
          position: "absolute",
          left: 58 + lane * 250 + (i % 4) * 26,
          bottom: 42 + y,
          width: 11 + (i % 3) * 4,
          height: 11 + (i % 3) * 4,
          border: `2px solid ${accent}`,
          borderRadius: 30,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
    );
  };
  return (
    <div style={{position: "absolute", right: 90, top: 220, width: 580, height: 520}}>
      {[0, ...(split ? [1] : [])].map((lane) => (
        <div
          key={lane}
          style={{
            position: "absolute",
            left: 20 + lane * 250,
            top: 65,
            width: 200,
            height: 360,
            border: "5px solid #dffbffcc",
            borderTop: "none",
            borderRadius: "0 0 36px 36px",
            background: "linear-gradient(180deg, #0c71806b, #10d7c43d)",
            boxShadow: `0 24px 80px #0008, inset 0 0 45px ${accent}22`,
          }}
        >
          <div style={{position: "absolute", left: lane ? 138 : 38, top: -30, width: 18, height: 305, background: "#d9edf0", borderRadius: 8, boxShadow: "0 0 15px #fff8"}} />
          {Array.from({length: 12}, (_, i) => bubble(i, lane))}
        </div>
      ))}
      {split && (
        <div style={{position: "absolute", left: 185, top: 10, width: 280, height: 95, border: `15px solid ${accent}`, borderBottom: "none", borderRadius: "120px 120px 0 0", opacity: 0.85}} />
      )}
      <div style={{position: "absolute", bottom: 8, width: "100%", textAlign: "center", fontSize: 24, letterSpacing: 5, color: "#dffbff"}}>
        {split ? "ION PATH — SEPARATE CHAMBERS" : "OPEN CELL — MIXED GAS"}
      </div>
    </div>
  );
};

const MetricPanel: React.FC<{accent: string; mode: string}> = ({accent, mode}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame % 156, [0, 140], [0.18, 0.88], {extrapolateRight: "clamp"});
  const labels = mode === "measure" ? ["CURRENT", "TEMPERATURE", "TIME"] : ["INPUT POWER", "CHEMICAL ENERGY", "HEAT + LOSSES"];
  return (
    <div style={{position: "absolute", right: 92, top: 235, width: 620}}>
      {labels.map((label, i) => (
        <div key={label} style={{marginBottom: 35}}>
          <div style={{display: "flex", justifyContent: "space-between", color: "#e8fbff", fontSize: 22, fontWeight: 800, letterSpacing: 3}}>
            <span>{label}</span><span>{Math.round((p - i * 0.08) * 100)}%</span>
          </div>
          <div style={{height: 20, marginTop: 11, borderRadius: 20, background: "#ffffff16", overflow: "hidden"}}>
            <div style={{height: "100%", width: `${Math.max(9, (p - i * 0.08) * 100)}%`, borderRadius: 20, background: `linear-gradient(90deg, ${accent}, #f5fbff)`, boxShadow: `0 0 24px ${accent}`}} />
          </div>
        </div>
      ))}
      <div style={{fontSize: 55, fontWeight: 950, color: "white", marginTop: 45}}>{mode === "measure" ? "DATA > DRAMA" : "V × A = WATTS"}</div>
    </div>
  );
};

const SafetyPanel: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const cards = ["NO FLAME", "NO PRESSURE", "NO TABLE SALT"];
  return (
    <div style={{position: "absolute", right: 80, top: 225, width: 650}}>
      {cards.map((text, i) => {
        const enter = spring({frame: frame - i * 7, fps: 30, config: {damping: 16, stiffness: 120}});
        return (
          <div key={text} style={{transform: `translateX(${(1 - enter) * 130}px)`, opacity: enter, background: "#07141ce8", border: `2px solid ${accent}66`, borderRadius: 28, padding: "25px 34px", marginBottom: 20, boxShadow: "0 24px 60px #0007", display: "flex", alignItems: "center", gap: 22}}>
            <div style={{width: 54, height: 54, borderRadius: 50, border: `5px solid ${accent}`, position: "relative"}}>
              <div style={{position: "absolute", left: -4, top: 21, width: 58, height: 5, background: accent, transform: "rotate(-40deg)"}} />
            </div>
            <div style={{fontSize: 35, fontWeight: 950, color: "white", letterSpacing: 2}}>{text}</div>
          </div>
        );
      })}
    </div>
  );
};

const MoleculePanel: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame % 156, [0, 156], [-80, 630]);
  return (
    <div style={{position: "absolute", right: 80, top: 210, width: 680, height: 500, borderRadius: 36, background: "#07141cd9", border: `2px solid ${accent}55`, overflow: "hidden", boxShadow: "0 30px 80px #0009"}}>
      <div style={{position: "absolute", left: 50, right: 50, top: 245, height: 3, background: `linear-gradient(90deg, #69e7ff, ${accent})`}} />
      <div style={{position: "absolute", left: travel, top: 225, width: 18, height: 18, borderRadius: 20, background: "#fff", boxShadow: `0 0 22px ${accent}`}} />
      <WaterMolecule x={78} y={85} scale={0.9} />
      <div style={{position: "absolute", left: 280, top: 112, color: "white", fontSize: 64, fontWeight: 950}}>→</div>
      <div style={{position: "absolute", right: 72, top: 80, display: "flex", gap: 24}}>
        <div style={{fontSize: 50, fontWeight: 950, color: "#69e7ff"}}>2H₂</div>
        <div style={{fontSize: 50, fontWeight: 950, color: "#ff735c"}}>O₂</div>
      </div>
      <div style={{position: "absolute", bottom: 58, width: "100%", textAlign: "center", fontSize: 26, color: "#dffbff", letterSpacing: 4}}>ELECTRONS IN WIRES · IONS IN WATER</div>
    </div>
  );
};

const GraphicOverlay: React.FC<{visual: string; accent: string}> = ({visual, accent}) => {
  if (visual === "safety") return <SafetyPanel accent={accent} />;
  if (visual === "molecules" || visual === "hook") return <MoleculePanel accent={accent} />;
  if (visual === "cell") return <CellGraphic split={false} accent={accent} />;
  if (visual === "split" || visual === "final") return <CellGraphic split accent={accent} />;
  return <MetricPanel accent={accent} mode={visual} />;
};

const StockBeat: React.FC<{beat: number; startFrame: number}> = ({beat, startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = startFrame / fps;
  const sectionIndex = sectionAt(seconds);
  const section = SECTIONS[sectionIndex];
  const clip = STOCK[(beat * 7 + sectionIndex * 3) % STOCK.length];
  const keywords = KEYWORDS[sectionIndex];
  const local = frame;
  const zoom = interpolate(local, [0, BEAT_SECONDS * fps], [1.03, 1.14], {extrapolateRight: "clamp"});
  const wipe = interpolate(local, [0, 10, BEAT_SECONDS * fps - 10, BEAT_SECONDS * fps], [1, 0, 0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const avatarInset = beat % 7 === 0 && seconds > 15;
  const generatedHero = beat % 23 === 10;
  return (
    <AbsoluteFill style={{background: BG, overflow: "hidden"}}>
      {generatedHero ? (
        <Img
          src={staticFile(beat % 46 === 10 ? "images/open-hho-cell-hero.png" : "images/split-cell-hero.png")}
          style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`}}
        />
      ) : (
        <OffthreadVideo
          src={staticFile(`stock-render/${clip}`)}
          muted
          delayRenderTimeoutInMilliseconds={120000}
          style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateX(${Math.sin(beat) * 1.5}%)`}}
        />
      )}
      <AbsoluteFill style={{background: "linear-gradient(90deg, #07141cdd 0%, #07141c66 48%, #07141c22 100%)"}} />
      <Glow color={section.accent} x="77%" y="31%" />
      <div style={{position: "absolute", left: 74, top: 64, display: "flex", alignItems: "center", gap: 16}}>
        <div style={{width: 10, height: 10, borderRadius: 20, background: section.accent, boxShadow: `0 0 18px ${section.accent}`}} />
        <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 4, color: "#e9fbff"}}>{section.label}</div>
      </div>
      <div style={{position: "absolute", left: 74, top: 250, width: 760}}>
        <div style={{fontSize: 75, lineHeight: 0.98, fontWeight: 950, color: "white", textShadow: "0 10px 45px #000"}}>
          {keywords[beat % keywords.length]}
        </div>
        <div style={{width: 160, height: 6, background: section.accent, marginTop: 28, boxShadow: `0 0 20px ${section.accent}`}} />
      </div>
      <GraphicOverlay visual={section.visual} accent={section.accent} />
      {avatarInset && (
        <div style={{position: "absolute", right: 58, top: 72, width: 380, height: 290, borderRadius: 32, overflow: "hidden", border: `3px solid ${section.accent}`, boxShadow: "0 25px 80px #000b"}}>
          <OffthreadVideo
            src={staticFile("diy-hydrogen-oxygen-generators-avatar.mp4")}
            startFrom={startFrame}
            muted
            style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "63% 38%", transform: "scale(1.45)"}}
          />
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 105, background: "linear-gradient(90deg,#07141cf8,#07141c00)"}} />
        </div>
      )}
      <AbsoluteFill style={{background: `linear-gradient(100deg, ${section.accent}${Math.round(wipe * 240).toString(16).padStart(2, "0")}, transparent 52%)`, pointerEvents: "none"}} />
      <Noise />
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
    <div style={{position: "absolute", left: 250, right: 250, bottom: 62, display: "flex", justifyContent: "center", zIndex: 50}}>
      <div style={{maxWidth: 1370, padding: "18px 30px 20px", borderRadius: 24, background: "#031016d9", boxShadow: "0 18px 60px #000a", textAlign: "center", fontSize: 42, lineHeight: 1.15, fontWeight: 900, color: "white", textShadow: "0 4px 14px #000"}}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} style={{color: i === active ? "#69e7ff" : "white"}}>{word}{i < words.length - 1 ? " " : ""}</span>
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
      <Audio src={staticFile("audio/background.wav")} volume={0.025} loop />
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
