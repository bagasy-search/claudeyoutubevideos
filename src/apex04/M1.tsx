// apex04 · MINUTO 1 (0–63,46 s) — tráiler que no termina: Ruzizi → el cocodrilo → la trampa → la tormenta → el expediente.
// Planos a mano sobre la voz (frases.txt). Real: Pexels + Wikimedia Commons (Ruzizi y Tanganica de verdad).
import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H, RED } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { BigWord, Place, Counter, Stamp, CaseCard, SpanMark, IRCam, Crowd, CageBlueprint, Letterbox, Flash, Rain } from "./comps";

const R = "apex04/real/", F = "apex04/foto/";
type S2 = Shot & { k?: string };
export const SHOTS: S2[] = [
  { a: 0, b: 1.1, v: R + "croc_39018603", from: 3.0, cam: [1.25, 0.42, 0.42, 1.4, 0.4, 0.4], out: { type: "zoom", fx: 0.42, fy: 0.38 } },
  { a: 1.1, b: 2.6, img: F + "ruzizi_648d8526.jpg", cam: [1.05, 0.5, 0.5, 1.28, 0.55, 0.45], out: { type: "whip", vx: 1 } },
  { a: 2.6, b: 4.3, v: R + "river_2328748", from: 1.5, out: { type: "zoom", fx: 0.5, fy: 0.55 } },
  { a: 4.3, b: 5.7, v: R + "river_3846608", from: 4.5, out: { type: "flash" } },
  { a: 5.7, b: 7.6, v: R + "croc_35232256", from: 3.5, cam: [1.1, 0.4, 0.55, 1.2, 0.45, 0.55], out: { type: "whip", vx: -1 } },
  { a: 7.6, b: 9.2, img: F + "lake_d94c36da.jpg", cam: [1.06, 0.55, 0.55, 1.2, 0.45, 0.5], out: { type: "whip", vx: 1 } },
  { a: 9.2, b: 10.8, img: F + "gente_0f697248.jpg", cam: [1.15, 0.5, 0.6, 1.05, 0.5, 0.5], out: { type: "flash" } },
  { a: 10.8, b: 12.4, v: R + "lake_15304310", from: 1.0, out: { type: "whip", vx: -1 } },
  { a: 12.4, b: 14.2, img: F + "gente_d9c19f35.jpg", cam: [1.05, 0.4, 0.5, 1.18, 0.6, 0.45], out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 14.2, b: 16.4, img: F + "lake_cea2b723.jpg", cam: [1.2, 0.5, 0.6, 1.04, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 16.4, b: 18.0, v: R + "croc_20173092", from: 5.5, out: { type: "cut" } },
  { a: 18.0, b: 19.3, v: R + "croc_18197395", from: 2.0, cam: [1.1, 0.6, 0.5, 1.2, 0.62, 0.5], out: { type: "zoom", fx: 0.6, fy: 0.5 } },
  { a: 19.3, b: 21.0, v: R + "river_4169216", from: 1.0, out: { type: "flash" } },
  { a: 21.0, b: 23.2, v: R + "croc_10041468", from: 5.0, cam: [1.05, 0.5, 0.55, 1.2, 0.55, 0.6], out: { type: "whip", vx: -1 } },
  { a: 23.2, b: 26.2, v: R + "croc_24964228", from: 0, cam: [1.0, 0.5, 0.5, 1.06, 0.5, 0.5], k: "len", out: { type: "flash" } },
  { a: 26.2, b: 28.2, v: R + "croc_17095869", from: 2.0, cam: [1.1, 0.3, 0.6, 1.25, 0.25, 0.6], out: { type: "zoom", fx: 0.35, fy: 0.6 } },
  { a: 28.2, b: 30.4, v: R + "croc_39018582", from: 1.0, cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.45], out: { type: "flash" } },
  { a: 30.4, b: 32.1, v: R + "croc_37457917", from: 1.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.5], out: { type: "cut" } },
  { a: 32.1, b: 33.9, v: R + "croc_31998380", from: 2.0, cam: [1.15, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 33.9, b: 36.1, img: F + "ruzizi_4dcd7616.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.6, 0.5], out: { type: "whip", vx: -1 } },
  { a: 36.1, b: 38.4, img: F + "ruzizi_d0dce263.jpg", cam: [1.2, 0.4, 0.5, 1.05, 0.5, 0.5], out: { type: "flash" } },
  { a: 38.4, b: 39.9, v: R + "otros_20507417", from: 3.4, out: { type: "white", d: 0.35 } },
  { a: 39.9, b: 41.9, comp: "cage", out: { type: "flash" } },
  { a: 41.9, b: 43.7, v: R + "anim_7723925", from: 2.0, cam: [1.1, 0.5, 0.5, 1.25, 0.5, 0.45], out: { type: "flash" } },
  { a: 43.7, b: 45.0, v: R + "storm_855936", from: 2.0, out: { type: "cut" } },
  { a: 45.0, b: 46.3, v: R + "river_5909588", from: 2.0, k: "ir", grade: "grayscale(1) contrast(1.5) brightness(1.15)", out: { type: "cut" } },
  { a: 46.3, b: 48.3, v: R + "lake_5113290", from: 0.5, cam: [1.1, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "dissolve", d: 0.6 } },
  { a: 48.3, b: 49.6, v: R + "river_3978641", from: 2.0, cam: [1.0, 0.5, 0.5, 1.12, 0.5, 0.6], out: { type: "cut" } },
  { a: 49.6, b: 51.1, v: R + "river_6853277", from: 1.0, cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "flash" } },
  { a: 51.1, b: 53.8, v: R + "croc_6039604", from: 3.0, cam: [1.25, 0.55, 0.45, 1.4, 0.6, 0.4], out: { type: "whip", vx: 1 } },
  { a: 53.8, b: 56.1, v: R + "croc_14983439", from: 1.5, cam: [1.1, 0.5, 0.5, 1.25, 0.45, 0.5], out: { type: "zoom", fx: 0.45, fy: 0.5 } },
  { a: 56.1, b: 57.8, v: R + "croc_35528897", from: 2.0, out: { type: "cut" } },
  { a: 57.8, b: 59.6, v: R + "croc_16515988", from: 2.0, cam: [1.05, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "whip", vx: -1 } },
  { a: 59.6, b: 63.46, v: R + "croc_6423036", from: 0.5, rate: 0.8, cam: [1.0, 0.35, 0.5, 1.1, 0.3, 0.5] },
];

export const M1: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const f = useCurrentFrame(), t = f / FPS;
  const renderComp = (s: Shot) => {
    if (s.comp === "cage") return <>
      <Img src={staticFile(F + "ruzizi_d819603d.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover", transform: `scale(${1.05 + 0.05 * (t - 39.9)})` }} />
      <CageBlueprint t={t} a={39.9} b={41.95} drawAt={39.95} dimAt={40.75} />
    </>;
    return null;
  };
  const cur = SHOTS.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {!farm && <Audio src={staticFile("apex04_mix.wav")} />}
      {SHOTS.map((s, i) => <ShotLayer key={i} S={SHOTS} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={t} a={1.25} b={4.2} text="Ruzizi River" sub="where it meets Lake Tanganyika · Burundi" />
        {cur?.k === "len" && <SpanMark t={t} a={23.6} b={26.15} x1={330} y1={760} x2={1640} y2={600} label="20 FT?" sub="the trackers' guess" ticks={20} />}
        <BigWord t={t} a={26.5} b={28.15} text="1 TON" sub="some say" />
        <BigWord t={t} a={28.45} b={30.35} text="GUSTAVE" red />
        <Counter t={t} a={30.7} b={33.85} to={300} dur={1.6} kicker="BLAMED FOR UP TO" unit="DEATHS" red center y={330} size={260} />
        <Place t={t} a={34.1} b={38.3} text="2004 · Ruzizi delta" sub="a capture team arrives" />
        <BigWord t={t} a={42.2} b={43.6} text="LIVE BAIT" size={190} />
        <Flash t={t} at={[43.75, 44.35, 44.7]} />
        {t >= 43.7 && t < 46.3 && <Rain t={t} n={200} op={0.6} />}
        {cur?.k === "ir" && <IRCam t={t} a={45.0} b={46.3} cam="CAM 01 · IR" date="2004" lostAt={45.75} />}
        <BigWord t={t} a={49.6} b={51.05} text="GONE" red />
        <Stamp t={t} a={52.2} b={53.75} text="Never caught" x={W / 2} y={H / 2 + 40} size={130} />
        <BigWord t={t} a={54.2} b={56.05} text="DEAD?" size={240} />
        {t >= 56.1 && t < 59.6 && <Crowd t={t} a={56.25} b={59.6} n={300} cols={30} label="BLAMED · HOW MANY ARE REAL?" />}
        <CaseCard t={t} a={59.7} b={63.46} title="GUSTAVE" x={1080} y={120}
          rows={[{ at: 60.1, k: "SPECIES", v: "Nile crocodile" }, { at: 60.6, k: "LOCATION", v: "Ruzizi River, Burundi" },
            { at: 61.1, k: "EST. LENGTH", v: "20 ft (6 m)" }, { at: 61.6, k: "BLAMED FOR", v: "up to 300 deaths", red: true }]}
          stamp={{ at: 62.3, text: "OPEN CASE" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
export const M1_FRAMES = Math.round(63.46 * FPS);
