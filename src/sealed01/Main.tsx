import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import plan from "./plan.json";

const { fontFamily: OSWALD } = loadOswald();
const { fontFamily: INTER } = loadInter();
const { fontFamily: SERIF } = loadSerif();

export const FPS = 30;
type Ov = { t: string; a?: string; b?: string; n?: string } | null;
type Beat = { vis: string; f0: number; f1: number; ov: Ov; clip: number };
const BEATS = plan.beats as Beat[];
export const TOTAL = plan.total as number;

const RED = "#d8322b";
const XF = 8; // fundido entre planos (se superpone al anterior: nunca hay negro)
const sf = (p: string) => staticFile("sealed01/" + p);

// Ken Burns: 4 recorridos que se alternan, lento y parejo
const Photo: React.FC<{ vis: string; dur: number; k: number }> = ({ vis, dur, k }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const m = k % 4;
  const s0 = m % 2 === 0 ? 1.04 : 1.14;
  const s1 = m % 2 === 0 ? 1.14 : 1.04;
  const s = s0 + (s1 - s0) * p;
  const dx = (m === 1 ? -1 : m === 2 ? 1 : 0) * 26 * (p - 0.5);
  const dy = (m === 3 ? -1 : 0) * 18 * (p - 0.5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b0b0c" }}>
      <Img
        src={sf(vis + ".jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${dx}px, ${dy}px) scale(${s})` }}
      />
    </AbsoluteFill>
  );
};

const Shot: React.FC<{ b: Beat; k: number }> = ({ b, k }) => {
  const f = useCurrentFrame();
  const dur = b.f1 - b.f0 + (k > 0 ? XF : 0);
  const a = k > 0 ? interpolate(f, [0, XF], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const clipLen = b.clip ? Math.min(b.clip, dur) : 0;
  const clipOut = clipLen ? interpolate(f, [clipLen - 8, clipLen], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <Photo vis={b.vis} dur={dur} k={k} />
      {clipLen > 0 && f < clipLen ? (
        <AbsoluteFill style={{ opacity: clipOut }}>
          <OffthreadVideo muted src={sf("clips/" + b.vis + ".mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const useIn = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 200 }, durationInFrames: 18 });
};
const useOut = (dur: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const Title: React.FC<{ o: Ov; dur: number }> = ({ o, dur }) => {
  const f = useCurrentFrame();
  const i = useIn(2);
  const out = useOut(dur);
  const line = interpolate(f, [6, 26], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 75%)" }} />
      <div style={{ position: "absolute", left: 120, top: 300, transform: `translateY(${(1 - i) * 30}px)`, opacity: i }}>
        <div style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 260, lineHeight: 0.9, color: "white", letterSpacing: -4 }}>
          <span style={{ color: RED }}>#</span>
          {o?.n}
        </div>
        <div style={{ width: 640 * line, height: 6, background: RED, margin: "22px 0 26px" }} />
        <div style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 76, color: "white", letterSpacing: 2, maxWidth: 1100, lineHeight: 1.05 }}>{o?.a}</div>
        <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,0.82)", marginTop: 18, letterSpacing: 1 }}>{o?.b}</div>
      </div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ o: Ov; dur: number }> = ({ o, dur }) => {
  const i = useIn(6);
  const out = useOut(dur);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 45%)" }} />
      <div style={{ position: "absolute", left: 110, bottom: 110, opacity: i, transform: `translateY(${(1 - i) * 40}px)` }}>
        <div style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 170, color: "white", lineHeight: 0.95, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{o?.a}</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <div style={{ width: 18, height: 18, background: RED, marginRight: 16 }} />
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 40, color: "rgba(255,255,255,0.92)", textTransform: "uppercase", letterSpacing: 3 }}>{o?.b}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Loc: React.FC<{ o: Ov; dur: number }> = ({ o, dur }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const w = interpolate(f, [4, 22], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: 100, bottom: 120, overflow: "hidden", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
        <div style={{ background: "rgba(10,10,12,0.82)", borderLeft: `8px solid ${RED}`, padding: "20px 34px 22px 28px" }}>
          <div style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 52, color: "white", letterSpacing: 3 }}>{o?.a}</div>
          <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 28, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{o?.b}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Big: React.FC<{ o: Ov; dur: number }> = ({ o, dur }) => {
  const f = useCurrentFrame();
  const i = useIn(0);
  const out = useOut(dur);
  const stamp = spring({ frame: f - 40, fps: FPS, config: { damping: 12, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} />
      <div style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 210, color: "white", letterSpacing: 10, opacity: i, transform: `scale(${0.9 + 0.1 * i})` }}>{o?.a}</div>
      <div
        style={{
          fontFamily: OSWALD, fontWeight: 700, fontSize: 120, color: RED, letterSpacing: 24, border: `8px solid ${RED}`, padding: "0 40px",
          marginTop: 10, opacity: stamp, transform: `rotate(-6deg) scale(${2 - stamp})`,
        }}
      >
        {o?.b}
      </div>
    </AbsoluteFill>
  );
};

const Quote: React.FC<{ o: Ov; dur: number }> = ({ o, dur }) => {
  const f = useCurrentFrame();
  const out = useOut(dur);
  const txt = o?.a || "";
  const n = Math.floor(interpolate(f, [4, 4 + txt.length * 1.2], [0, txt.length], { extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 92, color: "white", maxWidth: 1500, textAlign: "center", lineHeight: 1.2 }}>
        {txt.slice(0, n)}
        <span style={{ opacity: 0 }}>{txt.slice(n)}</span>
      </div>
    </AbsoluteFill>
  );
};

const Next: React.FC<{ o: Ov; dur: number }> = ({ o }) => {
  const i = useIn(10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%)" }} />
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 130, opacity: i, transform: `translateY(${(1 - i) * 40}px)` }}>
        <div style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 56, color: RED, letterSpacing: 10 }}>{o?.a}</div>
        <div style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 84, color: "white", lineHeight: 1.08, maxWidth: 1500 }}>{o?.b}</div>
      </div>
    </AbsoluteFill>
  );
};

const Sub: React.FC<{ o: Ov; dur: number }> = ({ o }) => {
  const f = useCurrentFrame();
  const i = spring({ frame: f - 4, fps: FPS, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)" }} />
      <div style={{ fontFamily: OSWALD, fontWeight: 700, fontSize: 86, color: "white", background: RED, padding: "18px 70px", borderRadius: 14, letterSpacing: 6, transform: `scale(${i})` }}>
        {o?.a}
      </div>
    </AbsoluteFill>
  );
};

const OVS: Record<string, React.FC<{ o: Ov; dur: number }>> = { title: Title, stat: Stat, loc: Loc, big: Big, quote: Quote, next: Next, sub: Sub };

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0b0b0c" }}>
      {BEATS.map((b, k) => {
        const from = Math.max(0, b.f0 - (k > 0 ? XF : 0));
        return (
          <Sequence key={"s" + k} from={from} durationInFrames={b.f1 - from} layout="none">
            <Shot b={b} k={k} />
          </Sequence>
        );
      })}
      {BEATS.map((b, k) => {
        if (!b.ov) return null;
        const C = OVS[b.ov.t];
        const dur = b.ov.t === "stat" ? Math.min(b.f1 - b.f0, 150) : b.f1 - b.f0;
        return (
          <Sequence key={"o" + k} from={b.f0} durationInFrames={dur} layout="none">
            <C o={b.ov} dur={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
