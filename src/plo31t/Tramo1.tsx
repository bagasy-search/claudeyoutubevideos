import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar, WIN } from "./base";
import { FONT, e, ei, spr, extrude, Tag, DrawX, BigNum, Receipt } from "./lib";

const W = 1920, H = 1080;

const Photo: React.FC<{ src: string; t: number; a: number; b: number; z?: number; seed?: number; x?: number; y?: number }> = ({ src, t, a, b, z = 1.12, seed = 0, x = 0, y = 0 }) => {
  const k = e(t, a, b);
  const sc = interpolate(k, [0, 1], [1, z]);
  const dx = Math.sin((t + seed) * 0.35) * 12 + x;
  const dy = Math.cos((t + seed) * 0.28) * 9 + y;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "radial-gradient(ellipse at 50% 42%, #3a2a1a 0%, #1a1208 60%, #0b1424 100%)" }}>
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translate(${dx}px,${dy}px)` }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.28))" }} />
    </AbsoluteFill>
  );
};

const Grain: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.09 }}>
    <svg width="100%" height="100%"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(t * 30) % 7} /></filter><rect width="100%" height="100%" filter="url(#gr)" /></svg>
  </AbsoluteFill>
);
const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,.38) 100%)" }} />
);

const Note: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; rot?: number; size?: number; col?: string }> = ({ t, at: a, out, text, x, y, rot = -3, size = 54, col = "#d7261e" }) => {
  if (t < a - 0.05 || t > out + 0.4) return null;
  const p = spr(t, a, 0.9);
  const o = 1 - e(t, out, out + 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.7 + 0.3 * p})`, opacity: o, background: "#f4ecd8", padding: "18px 30px", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.45)", fontFamily: "'Caveat',cursive", fontWeight: 700, color: col, fontSize: size, lineHeight: 1, whiteSpace: "nowrap", borderBottom: "3px solid rgba(0,0,0,.08)" }}>{text}</div>
  );
};

const Chip: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; col?: string; size?: number }> = ({ t, at: a, out, text, x, y, col = "#ffd84a", size = 46 }) => {
  if (t < a - 0.05 || t > out + 0.35) return null;
  const p = spr(t, a, 0.85);
  const o = 1 - e(t, out, out + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p})`, opacity: o, background: "rgba(11,20,36,.82)", border: `2px solid ${col}`, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "10px 26px", borderRadius: 14, letterSpacing: "0.02em", boxShadow: `0 0 26px ${col}55, 0 12px 30px rgba(0,0,0,.4)`, whiteSpace: "nowrap" }}>{text}</div>
  );
};

const RedCircle: React.FC<{ t: number; at: number; out: number; x: number; y: number; r: number; rot?: number }> = ({ t, at: a, out, x, y, r, rot = -8 }) => {
  if (t < a) return null;
  const p = ei(t, a, a + 0.55);
  const o = 1 - e(t, out, out + 0.3);
  const C = 2 * Math.PI * r;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px` }}>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.82} fill="none" stroke="#d7261e" strokeWidth={7} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} opacity={0.92} />
    </svg>
  );
};

const Marker: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number; h?: number }> = ({ t, at: a, out, x, y, w, h = 26 }) => {
  if (t < a) return null;
  const p = ei(t, a, a + 0.6);
  const o = 1 - e(t, out, out + 0.3);
  return <div style={{ position: "absolute", left: x, top: y, width: w * p, height: h, background: "rgba(255,216,74,.62)", borderRadius: 4, opacity: o, transform: "rotate(-1deg)", mixBlendMode: "multiply" }} />;
};

type Plan = { a: number; b: number; kind: "av" | "ph"; src?: string; z?: number; seed?: number };

const PL: Plan[] = [
  { a: 178.99, b: 183.22, kind: "av" },
  { a: 183.22, b: 185.94, kind: "ph", src: "plo31t/img/plo31t_t1_01.jpg", z: 1.14, seed: 1 },
  { a: 185.94, b: 187.92, kind: "ph", src: "plo31t/img/plo31t_t1_02.jpg", z: 1.13, seed: 2 },
  { a: 187.92, b: 191.18, kind: "ph", src: "plo31t/img/plo31t_t1_02.jpg", z: 1.09, seed: 3 },
  { a: 191.18, b: 195.92, kind: "ph", src: "plo31t/img/plo31t_t1_03.jpg", z: 1.15, seed: 4 },
  { a: 195.92, b: 200.62, kind: "av" },
  { a: 200.62, b: 205.28, kind: "ph", src: "plo31t/img/plo31t_t1_05.jpg", z: 1.16, seed: 5 },
  { a: 205.28, b: 213.11, kind: "ph", src: "plo31t/img/plo31t_t1_06.jpg", z: 1.12, seed: 6 },
  { a: 213.11, b: 219.37, kind: "av" },
  { a: 219.37, b: 223.18, kind: "ph", src: "plo31t/img/plo31t_t1_08.jpg", z: 1.15, seed: 7 },
  { a: 223.18, b: 229.98, kind: "ph", src: "plo31t/img/plo31t_t1_09.jpg", z: 1.13, seed: 8 },
  { a: 229.98, b: 238.25, kind: "ph", src: "plo31t/img/plo31t_t1_10.jpg", z: 1.14, seed: 9 },
  { a: 238.25, b: 240.6, kind: "ph", src: "plo31t/img/plo31t_t1_10.jpg", z: 1.08, seed: 10 },
  { a: 240.6, b: 249.3, kind: "ph", src: "plo31t/img/plo31t_t1_12.jpg", z: 1.14, seed: 11 },
  { a: 249.3, b: 257.6, kind: "ph", src: "plo31t/img/plo31t_t1_13.jpg", z: 1.12, seed: 12 },
  { a: 257.6, b: 266.61, kind: "ph", src: "plo31t/img/plo31t_t1_14.jpg", z: 1.15, seed: 13 },
  { a: 266.61, b: 270.51, kind: "av" },
  { a: 270.51, b: 275.36, kind: "ph", src: "plo31t/img/plo31t_t1_16.jpg", z: 1.16, seed: 14 },
  { a: 275.36, b: 283.18, kind: "ph", src: "plo31t/img/plo31t_t1_17.jpg", z: 1.14, seed: 15 },
  { a: 283.18, b: 287.72, kind: "av" },
  { a: 287.72, b: 296.74, kind: "ph", src: "plo31t/img/plo31t_t1_19.jpg", z: 1.15, seed: 16 },
  { a: 296.74, b: 305.06, kind: "ph", src: "plo31t/img/plo31t_t1_20.jpg", z: 1.13, seed: 17 },
  { a: 305.06, b: 314.52, kind: "ph", src: "plo31t/img/plo31t_t1_21.jpg", z: 1.14, seed: 18 },
  { a: 314.52, b: 320.07, kind: "av" },
  { a: 320.07, b: 327.06, kind: "ph", src: "plo31t/img/plo31t_t1_23.jpg", z: 1.14, seed: 19 },
  { a: 327.06, b: 332.89, kind: "ph", src: "plo31t/img/plo31t_t1_24.jpg", z: 1.16, seed: 20 },
  { a: 332.89, b: 337.56, kind: "av" },
  { a: 337.56, b: 345.38, kind: "ph", src: "plo31t/img/plo31t_t1_26.jpg", z: 1.16, seed: 21 },
  { a: 345.38, b: 349.54, kind: "ph", src: "plo31t/img/plo31t_t1_27.jpg", z: 1.15, seed: 22 },
  { a: 349.54, b: 353.59, kind: "av" },
  { a: 353.59, b: 361.2, kind: "ph", src: "plo31t/img/plo31t_t1_29.jpg", z: 1.13, seed: 23 },
  { a: 361.2, b: 365.85, kind: "ph", src: "plo31t/img/plo31t_t1_30.jpg", z: 1.15, seed: 24 },
];

const AVW: [number, number][] = [
  [178.99, 183.22], [195.92, 200.62], [213.11, 219.37], [231.87, 238.25],
  [251.63, 257.60], [266.61, 270.51], [283.18, 287.72], [299.48, 305.06],
  [314.52, 320.07], [332.89, 337.56], [349.54, 353.59],
];

export const Tramo1: React.FC<{ t: number }> = ({ t }) => {
  let i = PL.findIndex((p) => t >= p.a && t < p.b);
  if (i < 0) i = PL.length - 1;
  const cur = PL[i];
  const prev = i > 0 ? PL[i - 1] : null;
  const tr = 0.42;
  const inTr = prev && t < cur.a + tr && cur.kind !== "av" && prev.kind !== "av";
  const fade = inTr ? ei(t, cur.a, cur.a + tr) : 1;

  const renderPlan = (p: Plan) => {
    if (p.kind === "av") {
      const inWin = AVW.some((w) => t >= w[0] && t < w[1]);
      if (!inWin) return <Photo src="plo31t/img/plo31t_t1_01.jpg" t={t} a={p.a} b={p.b} z={1.06} seed={0} />;
      return <Avatar t={t} />;
    }
    return <Photo src={p.src!} t={t} a={p.a} b={p.b} z={p.z} seed={p.seed} />;
  };

  return (
    <AbsoluteFill style={{ background: "#0b1424" }}>
      {inTr && prev && <AbsoluteFill style={{ opacity: 1 - fade }}>{renderPlan(prev)}</AbsoluteFill>}
      <AbsoluteFill style={{ opacity: inTr ? fade : 1, transform: inTr ? `scale(${1 + 0.02 * (1 - fade)})` : undefined }}>
        {renderPlan(cur)}
      </AbsoluteFill>

      {t >= 185.94 && t < 187.92 && (
        <>
          <Chip t={t} at={186.06} out={187.6} text={'2 PULGADAS'} x={640} y={300} col="#8fd6ff" size={52} />
          <Chip t={t} at={187.2} out={187.9} text={'3 PULGADAS'} x={1280} y={300} col="#ffb257" size={52} />
          <RedCircle t={t} at={186.9} out={187.9} x={960} y={640} r={230} />
        </>
      )}
      {t >= 187.92 && t < 191.18 && (
        <>
          <Marker t={t} at={189.0} out={191.0} x={560} y={700} w={800} />
          <Note t={t} at={189.3} out={191.0} text="el viejo en la mano" x={960} y={860} size={62} />
        </>
      )}
      {t >= 191.18 && t < 195.92 && (
        <>
          <RedCircle t={t} at={192.5} out={195.6} x={960} y={520} r={210} />
          <Tag t={t} at={192.7} x={960} y={520} dx={210} dy={-160} text="LA CADENA" out={195.6} />
          <Chip t={t} at={193.9} out={195.6} text="UN POQUITO DE JUEGO" x={960} y={880} col="#ffd84a" size={44} />
        </>
      )}
      {t >= 200.62 && t < 205.28 && (
        <>
          <div style={{ position: "absolute", left: 960, top: 420, width: 26, height: 26, borderRadius: "50%", background: "#1e6fd8", boxShadow: "0 0 24px #1e6fd8", transform: `translate(-50%,-50%) translateY(${interpolate(e(t, 201.2, 202.4), [0, 1], [-120, 0])}px)`, opacity: 1 - e(t, 202.6, 203.2) }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 46%, rgba(30,111,216,.28), rgba(30,111,216,0) 55%)", opacity: e(t, 202.4, 204.2) * (1 - e(t, 205.0, 205.28)) }} />
          <Chip t={t} at={203.8} out={205.2} text="SIN PINTAR = LISTO" x={960} y={880} col="#7fe08a" size={50} />
        </>
      )}
      {t >= 205.28 && t < 213.11 && (
        <>
          <BigNum t={t} at={207.2} text="2" x={420} y={300} size={190} col="#ffd84a" out={210.4} sub="VECES AL AÑO" />
          <Chip t={t} at={208.9} out={210.6} text="1 MINUTO" x={1420} y={300} col="#8fd6ff" size={52} />
        </>
      )}
      {t >= 219.37 && t < 223.18 && (
        <>
          <RedCircle t={t} at={220.3} out={223.0} x={1080} y={700} r={260} />
          <Note t={t} at={220.6} out={223.0} text="NO SE VE" x={560} y={300} size={64} />
        </>
      )}
      {t >= 223.18 && t < 229.98 && (
        <>
          <Chip t={t} at={223.4} out={229.6} text="ADENTRO DE LA PARED" x={560} y={300} col="#ffb257" size={48} />
          <Chip t={t} at={224.9} out={229.6} text="ABAJO DEL PISO" x={1360} y={420} col="#ffb257" size={48} />
          <Chip t={t} at={228.1} out={229.6} text="EL CAÑO ENTERRADO" x={960} y={820} col="#ff4a3d" size={50} />
        </>
      )}
      {t >= 229.98 && t < 238.25 && (
        <>
          <Note t={t} at={231.6} out={238.0} text="LAS MÁS CARAS" x={560} y={280} size={66} />
          <Chip t={t} at={232.9} out={238.0} text="AÑOS SIN QUE NADIE LAS VEA" x={960} y={880} col="#ff4a3d" size={44} />
        </>
      )}
      {t >= 238.25 && t < 240.6 && (
        <Receipt t={t} rows={[{ at: 238.5, item: "AGUA", $: 480 }, { at: 238.9, item: "FUGA OCULTA", $: 1240 }]} totalAt={239.4} x={1330} y={300} out={240.5} sc={1} />
      )}
      {t >= 240.6 && t < 249.3 && (
        <>
          <Chip t={t} at={242.0} out={249.0} text="✓ LAVADORA" x={520} y={300} col="#7fe08a" size={48} />
          <Chip t={t} at={246.5} out={249.0} text="✓ INODORO" x={520} y={450} col="#7fe08a" size={48} />
          <Chip t={t} at={247.7} out={249.0} text="✓ REGADERA" x={520} y={600} col="#7fe08a" size={48} />
        </>
      )}
      {t >= 249.3 && t < 257.6 && (
        <Chip t={t} at={250.3} out={257.2} text="TINACO · NO LLENANDO" x={960} y={880} col="#8fd6ff" size={50} />
      )}
      {t >= 257.6 && t < 266.61 && (
        <>
          <RedCircle t={t} at={261.6} out={266.2} x={960} y={560} r={230} />
          <Tag t={t} at={261.9} x={960} y={560} dx={240} dy={-180} text="LA RUEDITA" out={266.2} />
        </>
      )}
      {t >= 270.51 && t < 275.36 && (
        <>
          <RedCircle t={t} at={272.5} out={275.1} x={1020} y={560} r={200} />
          <Note t={t} at={273.6} out={275.1} text="TODO CERRADO + GIRA = FUGA" x={960} y={860} size={56} />
        </>
      )}
      {t >= 275.36 && t < 283.18 && (
        <>
          <Chip t={t} at={279.5} out={283.0} text="FOTO AL MEDIDOR" x={960} y={300} col="#ffd84a" size={52} />
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(t, [279.5, 279.62, 279.9], [0, 0.5, 0], { extrapolateRight: "clamp" }) }} />
        </>
      )}
      {t >= 287.72 && t < 296.74 && (
        <>
          <RedCircle t={t} at={291.7} out={296.3} x={960} y={560} r={210} />
          <Tag t={t} at={292.0} x={960} y={560} dx={-230} dy={-170} text="LLAVECITA" out={296.3} />
        </>
      )}
      {t >= 296.74 && t < 305.06 && (
        <>
          <Tag t={t} at={297.6} x={960} y={520} dx={230} dy={-180} text="LLAVE GENERAL" out={305.0} />
          <Chip t={t} at={300.9} out={305.0} text="LA RUEDITA SIGUE GIRANDO" x={960} y={880} col="#ff4a3d" size={46} />
        </>
      )}
      {t >= 305.06 && t < 314.52 && (
        <>
          <Chip t={t} at={305.3} out={314.2} text="MEDIDOR" x={420} y={300} col="#8fd6ff" size={50} />
          <Chip t={t} at={306.6} out={314.2} text="CAÑO ENTERRADO" x={960} y={300} col="#ff4a3d" size={50} />
          <Chip t={t} at={307.6} out={314.2} text="CASA" x={1500} y={300} col="#ffb257" size={50} />
          <Note t={t} at={308.0} out={314.2} text="FUGA ACÁ" x={960} y={820} size={64} />
        </>
      )}
      {t >= 320.07 && t < 327.06 && (
        <>
          <Tag t={t} at={321.7} x={960} y={520} dx={240} dy={-180} text="LA MÁS IMPORTANTE" out={326.9} />
          <Chip t={t} at={323.3} out={326.9} text="CASI NUNCA LA TOCAS" x={960} y={880} col="#ffd84a" size={46} />
        </>
      )}
      {t >= 327.06 && t < 332.89 && (
        <>
          <RedCircle t={t} at={328.4} out={332.6} x={960} y={560} r={230} />
          <Note t={t} at={328.7} out={332.6} text="SE REVIENTA UN CAÑO" x={960} y={860} size={56} />
        </>
      )}
      {t >= 337.56 && t < 345.38 && (
        <>
          <Chip t={t} at={334.1} out={345.2} text="SARRO" x={500} y={300} col="#ffd84a" size={52} />
          <Chip t={t} at={335.1} out={345.2} text="ÓXIDO" x={960} y={300} col="#ffb257" size={52} />
          <Chip t={t} at={336.0} out={345.2} text="GOMA QUE SE PEGA" x={1360} y={300} col="#ff4a3d" size={48} />
          <Note t={t} at={337.9} out={345.2} text="10 AÑOS QUIETA = TRABADA" x={960} y={860} size={54} />
        </>
      )}
      {t >= 345.38 && t < 349.54 && (
        <>
          <DrawX t={t} at={346.6} x={760} y={440} w={400} h={260} />
          <Note t={t} at={346.9} out={349.4} text="SE ROMPE EN LA MANO" x={960} y={860} size={58} />
        </>
      )}
      {t >= 353.59 && t < 361.2 && (
        <>
          <Note t={t} at={356.1} out={361.0} text="del todo … y de vuelta" x={960} y={280} size={56} />
          <Chip t={t} at={359.1} out={361.0} text="DESPACIO, SIN FORZAR" x={960} y={860} col="#7fe08a" size={48} />
        </>
      )}
      {t >= 361.2 && t < 365.85 && (
        <>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <circle cx={960} cy={540} r={200} fill="none" stroke="#d7261e" strokeWidth={7} strokeDasharray={2 * Math.PI * 200} strokeDashoffset={2 * Math.PI * 200 * (1 - ei(t, 362.2, 363.4))} opacity={0.9} />
            <path d="M 960 340 A 200 200 0 0 1 1120 640" fill="none" stroke="#d7261e" strokeWidth={7} strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - ei(t, 363.0, 364.2))} />
          </svg>
          <Note t={t} at={363.6} out={365.8} text="ABIERTA, NO AL TOPE" x={960} y={860} size={56} />
        </>
      )}

      <Vignette />
      <Grain t={t} />
    </AbsoluteFill>
  );
};

export const SFX1: [number, string, number?][] = [
  [183.22, "whoosh"], [185.94, "whoosh"], [186.06, "pop", -2], [187.20, "pop", -2],
  [187.92, "swish"], [189.00, "write", -3], [189.30, "paper", -4], [191.18, "whoosh"],
  [192.50, "write", -3], [192.70, "pop", -2], [193.90, "pop", -3], [195.92, "whoosh"],
  [200.62, "whoosh"], [201.20, "k_gota", -6], [203.80, "ding", -2], [205.28, "whoosh"],
  [207.20, "roll", -3], [208.90, "pop", -2], [213.11, "whoosh"], [219.37, "whoosh"],
  [220.30, "write", -3], [220.60, "paper", -4], [223.18, "whoosh"], [223.40, "pop", -2],
  [224.90, "pop", -2], [228.10, "pop", -3], [229.98, "whoosh"], [231.60, "paper", -4],
  [232.90, "pop", -2], [238.25, "paper"], [238.50, "tick", -4], [238.90, "tick", -4],
  [239.40, "coin", -3], [240.60, "whoosh"], [242.00, "click", -3], [246.50, "click", -3],
  [247.70, "click", -3], [249.30, "whoosh"], [250.30, "pop", -2], [257.60, "whoosh"],
  [261.60, "write", -3], [261.90, "pop", -2], [266.61, "whoosh"], [270.51, "whoosh"],
  [272.50, "write", -3], [273.60, "paper", -4], [275.36, "whoosh"], [279.50, "flash", -2],
  [283.18, "whoosh"], [287.72, "whoosh"], [291.70, "write", -3], [292.00, "pop", -2],
  [296.74, "whoosh"], [297.60, "pop", -2], [300.90, "pop", -3], [305.06, "whoosh"],
  [305.30, "pop", -2], [306.60, "pop", -2], [307.60, "pop", -2], [308.00, "paper", -4],
  [314.52, "whoosh"], [320.07, "whoosh"], [321.70, "pop", -2], [323.30, "pop", -3],
  [327.06, "whoosh"], [328.40, "write", -3], [328.70, "paper", -4], [332.89, "whoosh"],
  [334.10, "pop", -2], [335.10, "pop", -2], [336.00, "pop", -2], [337.90, "paper", -4],
  [345.38, "whoosh"], [346.60, "fail", -2], [346.90, "paper", -4], [349.54, "whoosh"],
  [353.59, "whoosh"], [356.10, "paper", -4], [359.10, "ding", -3], [361.20, "whoosh"],
  [362.20, "write", -3], [363.60, "paper", -4],
];
