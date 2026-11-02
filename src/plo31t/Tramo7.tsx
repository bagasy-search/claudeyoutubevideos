import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, COL, e, ei, spr, extrude, Tag, DrawX, Flash } from "./lib";

const W = 1920, H = 1080;

type Plan = { a: number; b: number; kind: "av" | "foto" | "t13" | "t14"; src?: string; push?: number; dx?: number; dy?: number };

const PL: Plan[] = [
  { a: 1260.56, b: 1264.08, kind: "av" },
  { a: 1264.08, b: 1268.20, kind: "foto", src: "plo31t/img/plo31t_t7_01.jpg", push: 1.10, dx: -18, dy: 10 },
  { a: 1268.20, b: 1272.90, kind: "foto", src: "plo31t/img/plo31t_t7_02.jpg", push: 1.08, dx: 14, dy: -8 },
  { a: 1272.90, b: 1277.61, kind: "foto", src: "plo31t/img/plo31t_t7_03.jpg", push: 1.12, dx: -22, dy: 6 },
  { a: 1277.61, b: 1281.71, kind: "av" },
  { a: 1281.71, b: 1286.00, kind: "foto", src: "plo31t/img/plo31t_t7_04.jpg", push: 1.11, dx: 10, dy: 14 },
  { a: 1286.00, b: 1293.97, kind: "foto", src: "plo31t/img/plo31t_t7_05.jpg", push: 1.09, dx: -12, dy: -10 },
  { a: 1293.97, b: 1299.58, kind: "av" },
  { a: 1299.58, b: 1308.78, kind: "foto", src: "plo31t/img/plo31t_t7_06.jpg", push: 1.10, dx: 16, dy: 8 },
  { a: 1308.78, b: 1315.64, kind: "t13", src: "plo31t/img/plo31t_t7_06.jpg" },
  { a: 1315.64, b: 1320.60, kind: "foto", src: "plo31t/img/plo31t_t7_07.jpg", push: 1.12, dx: -16, dy: 12 },
  { a: 1320.60, b: 1329.32, kind: "foto", src: "plo31t/img/plo31t_t7_08.jpg", push: 1.08, dx: 20, dy: -6 },
  { a: 1329.32, b: 1334.04, kind: "av" },
  { a: 1334.04, b: 1338.90, kind: "foto", src: "plo31t/img/plo31t_t7_09.jpg", push: 1.13, dx: -10, dy: 16 },
  { a: 1338.90, b: 1345.48, kind: "foto", src: "plo31t/img/plo31t_t7_10.jpg", push: 1.09, dx: 18, dy: -12 },
  { a: 1345.48, b: 1348.92, kind: "av" },
  { a: 1348.92, b: 1359.56, kind: "foto", src: "plo31t/img/plo31t_t7_11.jpg", push: 1.12, dx: -14, dy: 10 },
  { a: 1359.56, b: 1364.89, kind: "av" },
  { a: 1364.89, b: 1377.49, kind: "foto", src: "plo31t/img/plo31t_t7_12.jpg", push: 1.09, dx: 12, dy: 14 },
  { a: 1377.49, b: 1381.01, kind: "av" },
  { a: 1381.01, b: 1392.70, kind: "foto", src: "plo31t/img/plo31t_t7_13.jpg", push: 1.11, dx: -18, dy: -8 },
  { a: 1392.70, b: 1396.33, kind: "av" },
  { a: 1396.33, b: 1402.83, kind: "foto", src: "plo31t/img/plo31t_t7_10.jpg", push: 1.07, dx: 22, dy: 10 },
  { a: 1402.83, b: 1409.55, kind: "t14", src: "plo31t/img/plo31t_t7_14.jpg" },
  { a: 1409.55, b: 1414.37, kind: "av" },
  { a: 1414.37, b: 1426.38, kind: "foto", src: "plo31t/img/plo31t_t7_15.jpg", push: 1.12, dx: -12, dy: 12 },
  { a: 1426.38, b: 1430.35, kind: "av" },
  { a: 1430.35, b: 1440.91, kind: "foto", src: "plo31t/img/plo31t_t7_16.jpg", push: 1.10, dx: 14, dy: -10 },
];

const Photo: React.FC<{ t: number; p: Plan }> = ({ t, p }) => {
  const k = interpolate(t, [p.a, p.b], [1, p.push ?? 1.09], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dx = interpolate(t, [p.a, p.b], [0, p.dx ?? 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dy = interpolate(t, [p.a, p.b], [0, p.dy ?? 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(p.src!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k}) translate(${dx}px,${dy}px)` }} />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 240px 40px rgba(0,0,0,.55)", background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%)" }} />
);

const Chip: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; col?: string }> = ({ t, at, out, text, x, y, col }) => {
  const sc = spr(t, at);
  const o = 1 - e(t, out - 0.3, out);
  if (t < at || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: 54, letterSpacing: 2, color: "#fff", padding: "16px 34px", borderRadius: 16, background: col ?? "rgba(215,38,30,.92)", boxShadow: "0 18px 50px rgba(0,0,0,.5)", textShadow: extrude(4, "rgba(0,0,0,.5)") }}>{text}</div>
  );
};

const Truco: React.FC<{ t: number; p: Plan; num: string; titulo: string }> = ({ t, p, num, titulo }) => {
  const k = interpolate(t, [p.a, p.b], [1.02, 1.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spr(t, p.a + 0.05, 0.9);
  const o = 1 - e(t, p.b - 0.35, p.b);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(p.src!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k})`, filter: "brightness(.72) saturate(1.05)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.05) 40%, rgba(0,0,0,.65) 100%)" }} />
      <div style={{ position: "absolute", left: 130, top: 200, opacity: o, transform: `scale(${sc})`, transformOrigin: "left center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 300, lineHeight: 0.85, color: "#fff", textShadow: extrude(10, "rgba(0,0,0,.65)") }}>{num}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 78, color: COL.amber, marginTop: 10, textShadow: extrude(6, "rgba(0,0,0,.6)") }}>{titulo}</div>
      </div>
    </AbsoluteFill>
  );
};

const pick = (t: number): number => {
  let i = 0;
  for (let j = 0; j < PL.length; j++) if (t >= PL[j].a - 0.001) i = j;
  return i;
};

export const Tramo7: React.FC<{ t: number }> = ({ t }) => {
  const idx = pick(t);
  const cur = PL[idx];
  const prev = idx > 0 ? PL[idx - 1] : null;
  const tr = 0.42;
  const inTr = idx > 0 && t < cur.a + tr;
  const trP = inTr ? ei(t, cur.a, cur.a + tr) : 1;

  const render = (p: Plan) => {
    if (p.kind === "av") return <Avatar t={t} />;
    if (p.kind === "t13") return <Truco t={t} p={p} num="13" titulo="LA VENTOSA CORRECTA" />;
    if (p.kind === "t14") return <Truco t={t} p={p} num="14" titulo="AISLAR LOS CAÑOS" />;
    return <Photo t={t} p={p} />;
  };

  const showPrev = inTr && prev && prev.kind !== "av" && cur.kind !== "av";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {showPrev && <AbsoluteFill style={{ opacity: 1 - trP, filter: `blur(${(1 - trP) * 10}px)` }}>{render(prev!)}</AbsoluteFill>}
      <AbsoluteFill style={{ opacity: showPrev ? trP : 1, transform: showPrev ? `scale(${1.04 - 0.04 * trP})` : undefined }}>
        {render(cur)}
      </AbsoluteFill>

      {t >= 1268.20 && t < 1272.90 && <Chip t={t} at={1270.34} out={1272.90} text="AL FRASCO" x={W / 2} y={170} />}
      {t >= 1286.00 && t < 1293.97 && (
        <>
          <Chip t={t} at={1291.24} out={1293.60} text="AGUA CALIENTE" x={W / 2} y={160} col="rgba(30,120,200,.92)" />
          <div style={{ position: "absolute", left: W / 2, top: H - 200, transform: `translate(-50%,-50%) scale(${spr(t, 1287.2)})`, opacity: 1 - e(t, 1293.4, 1293.9), fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#fff", textShadow: extrude(8, "rgba(0,0,0,.6)") }}>1 MINUTO</div>
        </>
      )}
      {t >= 1299.58 && t < 1308.78 && <Chip t={t} at={1302.04} out={1308.40} text="EMPIEZA HOY" x={W / 2} y={170} col="rgba(215,38,30,.92)" />}
      {t >= 1308.78 && t < 1315.64 && <Flash t={t} at={1309.24} peak={0.5} col="#ffd84a" w={1400} />}
      {t >= 1315.64 && t < 1320.60 && (
        <>
          <DrawX t={t} at={1318.70} x={W / 2 - 220} y={H / 2 - 120} w={440} h={300} />
          <Chip t={t} at={1318.70} out={1320.40} text="MAL" x={W / 2} y={H - 190} col="rgba(215,38,30,.95)" />
        </>
      )}
      {t >= 1320.60 && t < 1329.32 && <Tag t={t} at={1323.86} x={W * 0.32} y={H * 0.62} dx={-40} dy={-120} text="PLANA" sub="LAVAMANOS" col="#ffd84a" out={1329.0} />}
      {t >= 1334.04 && t < 1338.90 && <Tag t={t} at={1335.98} x={W * 0.55} y={H * 0.55} dx={60} dy={-140} text="FALDA" sub="INODORO" col="#ffd84a" out={1338.6} />}
      {t >= 1338.90 && t < 1345.48 && (
        <>
          <DrawX t={t} at={1343.26} x={W * 0.7} y={H * 0.3} w={320} h={220} />
          <Chip t={t} at={1343.86} out={1345.20} text="MENOS AL CAÑO" x={W / 2} y={H - 180} col="rgba(215,38,30,.95)" />
        </>
      )}
      {t >= 1348.92 && t < 1359.56 && (
        <>
          <Tag t={t} at={1349.20} x={W * 0.5} y={H * 0.42} dx={0} dy={-150} text="REBOZADERO" sub="POR AQUÍ SE ESCAPA" col="#ffd84a" out={1359.2} />
          <Chip t={t} at={1358.26} out={1359.4} text="FUERZA PERDIDA" x={W / 2} y={H - 170} col="rgba(215,38,30,.95)" />
        </>
      )}
      {t >= 1364.89 && t < 1377.49 && <Chip t={t} at={1362.46} out={1377.2} text="TRAPO MOJADO" x={W / 2} y={165} col="rgba(30,120,200,.92)" />}
      {t >= 1381.01 && t < 1392.70 && (
        <>
          <div style={{ position: "absolute", left: W / 2, top: 160, transform: `translate(-50%,-50%) scale(${spr(t, 1381.31)})`, opacity: 1 - e(t, 1392.3, 1392.7), fontFamily: FONT, fontWeight: 900, fontSize: 100, color: "#fff", textShadow: extrude(8, "rgba(0,0,0,.65)") }}>EMPUJAR · TIRAR</div>
          <div style={{ position: "absolute", left: W - 260, top: H / 2, transform: `translate(-50%,-50%) scale(${spr(t, 1388.67)})`, opacity: 1 - e(t, 1392.3, 1392.7), fontFamily: FONT, fontWeight: 900, fontSize: 150, color: COL.amber, textShadow: extrude(8, "rgba(0,0,0,.65)"), whiteSpace: "nowrap" }}>15-20</div>
        </>
      )}
      {t >= 1396.33 && t < 1402.83 && <Chip t={t} at={1400.25} out={1402.6} text="SIN QUÍMICOS" x={W / 2} y={170} col="rgba(40,150,80,.92)" />}
      {t >= 1402.83 && t < 1409.55 && <Flash t={t} at={1403.39} peak={0.5} col="#ffd84a" w={1400} />}
      {t >= 1414.37 && t < 1426.38 && (
        <>
          <DrawX t={t} at={1421.31} x={W * 0.45} y={H * 0.45} w={380} h={260} />
          <Chip t={t} at={1416.71} out={1421.0} text="QUEBRADIZO" x={W / 2} y={165} col="rgba(215,38,30,.95)" />
        </>
      )}
      {t >= 1430.35 && t < 1440.91 && (
        <>
          <Chip t={t} at={1433.53} out={1440.6} text="ESPUMA" x={W / 2} y={165} col="rgba(60,60,70,.92)" />
          <Chip t={t} at={1440.05} out={1440.95} text="CINTA" x={W / 2} y={H - 170} col="rgba(215,38,30,.92)" />
        </>
      )}

      <Grain />
    </AbsoluteFill>
  );
};

export const SFX7: [number, string, number?][] = [
  [1264.08, "whoosh"],
  [1268.20, "whoosh", -2],
  [1270.34, "pop", -3],
  [1272.90, "swish"],
  [1277.61, "whoosh"],
  [1281.71, "whoosh", -2],
  [1286.00, "whoosh"],
  [1287.20, "pop", -4],
  [1291.24, "pop", -3],
  [1293.97, "whoosh"],
  [1299.58, "whoosh", -2],
  [1302.04, "pop", -3],
  [1308.78, "riser", -2],
  [1309.24, "slam", 0],
  [1315.64, "whoosh"],
  [1318.70, "fail", -2],
  [1320.60, "whoosh", -2],
  [1323.86, "pop", -3],
  [1329.32, "whoosh"],
  [1334.04, "whoosh", -2],
  [1335.98, "pop", -3],
  [1338.90, "whoosh"],
  [1343.26, "fail", -3],
  [1345.48, "whoosh"],
  [1348.92, "whoosh", -2],
  [1349.20, "pop", -3],
  [1358.26, "fail", -4],
  [1359.56, "whoosh"],
  [1364.89, "whoosh", -2],
  [1362.46, "pop", -3],
  [1377.49, "whoosh"],
  [1381.01, "whoosh", -2],
  [1381.31, "slam", -3],
  [1388.67, "tick", -3],
  [1392.70, "whoosh"],
  [1396.33, "whoosh", -2],
  [1400.25, "ding", -3],
  [1402.83, "riser", -2],
  [1403.39, "slam", 0],
  [1409.55, "whoosh"],
  [1414.37, "whoosh", -2],
  [1416.71, "pop", -3],
  [1421.31, "fail", -3],
  [1426.38, "whoosh"],
  [1430.35, "whoosh", -2],
  [1433.53, "pop", -3],
  [1440.05, "click", -4],
];
