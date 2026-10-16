// Canada with Gordie · video 1 (Northern British Columbia) — composición única, mundo continuo + avatar por ventanas
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, useCurrentFrame, interpolate } from "remotion";
import { FPS, Key, makeCam, MapWorld, sf, clamp, ease, speaking, Chapter } from "./lib";
import avatarRaw from "./avatar.json";
import { ch01 } from "./ch01";
import { ch02 } from "./ch02";
import { ch03 } from "./ch03";
import { ch04 } from "./ch04";
import { ch05 } from "./ch05";
import { ch06 } from "./ch06";
import { ch07 } from "./ch07";
import { ch08 } from "./ch08";
import { ch09 } from "./ch09";
import { ch10 } from "./ch10";
import { ch11 } from "./ch11";
import { ch12 } from "./ch12";
import { ch13 } from "./ch13";
import { ch14 } from "./ch14";
import { ch15 } from "./ch15";
import { ch16 } from "./ch16";
import { ch17 } from "./ch17";
import { ch18 } from "./ch18";
import { ch19 } from "./ch19";
import { useTerrainTextures } from "./v3_fortune";

export const CHAPTERS: Chapter[] = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18, ch19];
export const TOTAL = 2296.5; // s (voz completa 38:16 + cola)
const KEYS: Key[] = CHAPTERS.flatMap((c) => c.keys).sort((a, b) => a[0] - b[0]);
const cam = makeCam(KEYS);
const AV = avatarRaw as { t0: number; t1: number; r0: number; text: string }[];
const FULL = new Set(CHAPTERS.flatMap((c) => c.full ?? []));
const isFull = (w: { t0: number }) => [...FULL].some((x) => Math.abs(x - w.t0) < 0.6);

// Avatar: entra como círculo desde abajo a la derecha; las ventanas "full" se abren a pantalla completa (iris), las otras quedan en círculo
const Avatar: React.FC<{ t: number; frame: number; on: boolean }> = ({ t, on }) => {
  const w = AV.find((x) => t >= x.t0 - 0.35 && t <= x.t1 + 0.35);
  if (!w || !on) return null;
  const full = isFull(w);
  const k = Math.min(interpolate(t, [w.t0 - 0.3, w.t0], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.t1, w.t1 + 0.3], [1, 0], { ...clamp, easing: ease }));
  const R = 215, sx = 1920 - 70 - R, sy = 1080 - 70 - R;
  const fk = full ? k : 0;
  const cx = sx + (960 - sx) * fk, cy = sy + (540 - sy) * fk;
  const rad = full ? R * 0.2 + (1200 - R * 0.2) * k : R * k;
  const sc = full ? 1 : 0.5;
  const from = Math.round(w.t0 * FPS), to = Math.round(w.t1 * FPS);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: `circle(${rad}px at ${cx}px ${cy}px)` }}>
        <Sequence from={from - 10} durationInFrames={to - from + 20} layout="none">
          <OffthreadVideo src={sf("avatar.mp4")} muted startFrom={Math.max(0, Math.round(w.r0 * FPS) - 10)}
            style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", transformOrigin: "50% 38%", transform: full ? "none" : `translate(${cx - 960}px,${cy - 540 + 40}px) scale(${sc})` }} />
        </Sequence>
      </AbsoluteFill>
      {(!full || k < 0.98) && <div style={{ position: "absolute", left: cx - rad, top: cy - rad, width: 2 * rad, height: 2 * rad, borderRadius: "50%", border: "7px solid #fff", boxShadow: "0 12px 34px rgba(0,0,0,.55)" }} />}
    </AbsoluteFill>
  );
};

const SFX = CHAPTERS.flatMap((c) => c.sfx ?? []);
const SfxTrack: React.FC = () => (
  <>
    {SFX.map(([t0, file, vol, dur], i) => {
      const n = Math.max(4, Math.round(dur * FPS)), from = Math.max(0, Math.round(t0 * FPS));
      return (
        <Sequence key={i} from={from} durationInFrames={n} layout="none">
          <Audio src={sf(`sfx/${file}.wav`)} volume={(fr) => vol * (speaking((from + fr) / FPS) ? 0.5 : 1) * interpolate(fr, [n - 6, n], [1, 0], clamp)} />
        </Sequence>
      );
    })}
  </>
);
export const sfxEvents = () => SFX;

export const Main: React.FC<{ farm?: boolean; avatar?: boolean }> = ({ farm, avatar = true }) => {
  const frame = useCurrentFrame();
  useTerrainTextures();
  const t = frame / FPS, f = frame;
  const c = cam(t), c0 = cam(Math.max(0, t - 1 / FPS));
  const vx = Math.abs(c.x - c0.x) * c.z, vy = Math.abs(c.y - c0.y) * c.z, vz = Math.abs(Math.log(c.z / c0.z)) * 900;
  const bz = Math.min(5, vz * 0.25);
  const bx = Math.min(16, vx * 0.3) + bz, by = Math.min(16, vy * 0.3) + bz;
  const blurOn = bx + by > 0.6;
  const live = CHAPTERS.filter((ch) => t >= ch.T0 - 1.5 && t <= ch.T1 + 1.5);
  return (
    <AbsoluteFill style={{ background: "#2970be", overflow: "hidden" }}>
      {!farm && <Audio src={sf("voz.wav")} />}
      {!farm && <SfxTrack />}
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 40%", filter: blurOn ? "url(#mb)" : undefined }}>
        <AbsoluteFill style={{ transform: `rotateX(${c.tilt}deg)`, transformOrigin: "50% 55%" }}>
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px,540px) scale(${c.z}) translate(${-c.x}px,${-c.y}px)` }}>
            <MapWorld />
            <svg width={4560} height={3588} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              {live.map((ch, i) => ch.World ? <ch.World key={i} t={t} z={c.z} f={f} /> : null)}
            </svg>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {live.map((ch, i) => <AbsoluteFill key={i} style={{ zIndex: 0 }}><ch.Screen c={c} f={f} t={t} /></AbsoluteFill>)}
      <Avatar t={t} frame={frame} on={avatar} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,.32) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
