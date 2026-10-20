// apex06 v2 · "Every Big Cat Ranked…" en UN SOLO PLANO: un mundo vector + una cámara que viaja todo el video,
// capítulos a mano anclados a la palabra, portales para el material real, ranking que vive en pantalla. Audio fuera (encfin).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, Key, makeCam, Chapter, WorldBase, visTiles, Portal } from "./lib";
import { RankBar } from "./rank";
import { ch01 } from "./ch01";
import { gancho } from "./gancho";
import { ch02 } from "./ch02";
import { ch03 } from "./ch03";
import { ch04 } from "./ch04";
import { ch05 } from "./ch05";
import { ch06 } from "./ch06";
import { ch07 } from "./ch07";
import { ch08 } from "./ch08";

export const CHAPTERS: Chapter[] = [gancho, ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08];
const KEYS: Key[] = CHAPTERS.flatMap((c) => c.keys).sort((a, b) => a[0] - b[0]);
export const cam = makeCam(KEYS);
export const M1_FRAMES = Math.ceil((ch01.T1 + 0.5) * FPS); // gancho + minuto 1 de narración, hasta "lots of animals"
export const FULL_FRAMES = Math.ceil(ch08.T1 * FPS); // el video entero

export const Main: React.FC<{ farm?: boolean }> = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS, f = frame;
  const c = cam(t), c0 = cam(Math.max(0, t - 1 / FPS));
  // desenfoque de movimiento real: velocidad de la cámara en px de pantalla por cuadro
  const vx = Math.abs(c.x - c0.x) * c.z, vy = Math.abs(c.y - c0.y) * c.z, vz = Math.abs(Math.log(c.z / c0.z)) * 900;
  const bz = Math.min(3, vz * 0.12);
  const bx = Math.min(12, vx * 0.25) + bz, by = Math.min(12, vy * 0.25) + bz;
  const blurOn = bx + by > 0.6;
  const live = CHAPTERS.filter((ch) => t >= ch.T0 - 1.5 && t <= ch.T1 + 1.5);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #13344a 0%, #081622 80%)", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: blurOn ? "url(#mb)" : undefined }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><clipPath id="landclip">{visTiles(c).map((tl, i) => tl.l ? <path key={i} d={tl.l} /> : null)}</clipPath></defs>
          <g transform={`translate(960 540) scale(${c.z}) translate(${-c.x} ${-c.y})`}>
            <WorldBase c={c} />
            {live.map((ch, i) => ch.World ? <ch.World key={i} t={t} z={c.z} f={f} /> : null)}
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill><RankBar c={c} f={f} t={t} /></AbsoluteFill>
      {live.map((ch, i) => <AbsoluteFill key={i}>{(ch.portals ?? []).map((p, j) => <Portal key={"p" + j} c={c} t={t} f={f} p={p} />)}<ch.Screen c={c} f={f} t={t} /></AbsoluteFill>)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,.32) 100%)", pointerEvents: "none", zIndex: 40 }} />
    </AbsoluteFill>
  );
};
export const sfxEvents = () => CHAPTERS.flatMap((c) => c.sfx ?? []);
export const ambEvents = () => CHAPTERS.flatMap((c) => [...(c.amb ?? []), ...(c.portals ?? []).filter((p) => p.video).map((p) => [p.t0, p.t1, p.src, p.startFrom ?? 0] as [number, number, string, number])]);
