// Gancho "VOS ESTÁS AHÍ" (regla 20-oct): aldea de Kumaon a las 2 AM, en 2ª persona, con voz propia (gancho2/fish).
// Un solo plano: las tomas se encadenan con empuje continuo (nunca un corte seco), la linterna es una máscara de luz que
// recorre lo que dice la voz, "You turn" es un barrido, y al "decided" el leopardo se cierra como portal sobre Champawat.
import React from "react";
import { AbsoluteFill, Img, interpolate } from "remotion";
import { Chapter, G, sf, clamp, ease, pj, Sticker, SANS, RED } from "./lib";
import wordsRaw from "./words_gancho.json";

type Wd = { text: string; startMs: number; endMs: number };
const GW = (wordsRaw as Wd[]).map((w) => ({ n: w.text.toLowerCase().replace(/[^a-z0-9]/g, ""), s: w.startMs / 1000 }));
// segundos del VIDEO en que arranca la frase (el gancho empieza en 0)
const ga = (frase: string) => {
  const q = frase.toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9]/g, ""));
  for (let i = 0; i + q.length <= GW.length; i++) if (q.every((x, j) => GW[i + j].n === x)) return GW[i].s;
  throw new Error("gancho: frase no encontrada: " + frase);
};
export const CHAMP: [number, number] = [80.07, 29.33];

const H = {
  step: ga("you step outside"), goats: ga("even the goats"), click: ga("click on your torch") , beam: ga("the beam finds"),
  path: ga("the path"), well: ga("the well"), forest: ga("the edge of the forest"), hear: ga("and then you hear"),
  close: ga("very close"), turn: ga("you turn"), two: ga("two eyes"), eyes: ga("eyes at the height"), watching: ga("it has been watching"),
  ten: ga("ten minutes"), decided: ga("decided"),
};
export const H_END = H.decided + 0.75; // golpe grave y el portal se cierra sobre el mapa
const CLOSE0 = H_END - 0.1, CLOSE1 = H_END + 0.85;

// tomas: [archivo, t0, t1, empuje (escala ini→fin), foco x/y del empuje en % de la imagen]
type Shot = { src: string; t0: number; t1: number; z: [number, number]; o: [number, number]; dark?: number };
const SHOTS: Shot[] = [
  { src: "g2_01_aldea", t0: 0, t1: H.step, z: [1.0, 1.12], o: [45, 55], dark: 0.25 },
  { src: "g2_02_puerta", t0: H.step, t1: H.goats, z: [1.04, 1.2], o: [50, 40], dark: 0.15 },
  { src: "g2_03_cabras", t0: H.goats, t1: H.click - 0.45, z: [1.06, 1.16], o: [62, 45], dark: 0.2 },
  { src: "g2_04_linterna", t0: H.click - 0.45, t1: H.beam, z: [1.0, 1.1], o: [25, 55] },
  { src: "g2_05_haz", t0: H.beam, t1: H.hear, z: [1.02, 1.14], o: [50, 50] },
  { src: "g2_06_arbustos", t0: H.hear, t1: H.turn + 0.2, z: [1.04, 1.18], o: [50, 45] },
  { src: "g2_07_giro", t0: H.turn + 0.2, t1: H.two - 0.05, z: [1.05, 1.1], o: [65, 50] },
  { src: "g2_08_ojos", t0: H.two - 0.05, t1: H.watching, z: [1.0, 1.3], o: [50, 46] },
  { src: "g2_09_leopardo", t0: H.watching, t1: CLOSE1, z: [1.02, 1.16], o: [42, 40] },
];
const XF = 0.45; // fundido con empuje entre tomas

// la linterna: un círculo de luz en coordenadas de pantalla; lo demás queda casi negro
const beam = (t: number): [number, number, number, number] | null => {
  if (t >= H.beam - 0.2 && t < H.hear) {
    const x = interpolate(t, [H.beam, H.path, H.well, H.forest, H.forest + 0.6], [960, 960, 940, 1250, 1600], { ...clamp, easing: ease });
    const y = interpolate(t, [H.beam, H.path, H.well, H.forest, H.forest + 0.6], [980, 840, 590, 360, 260], { ...clamp, easing: ease });
    const r = interpolate(t, [H.beam - 0.2, H.beam + 0.3], [40, 330], clamp);
    return [x, y, r, 0.9];
  }
  if (t >= H.hear && t < H.turn + 0.2) {
    // el haz se queda en los arbustos y se achica mientras se oye la respiración
    const r = interpolate(t, [H.hear, H.close + 0.6], [420, 260], { ...clamp, easing: ease });
    return [960, 500, r, interpolate(t, [H.hear, H.close], [0.75, 0.9], clamp)];
  }
  if (t >= H.two - 0.05 && t < H.watching) {
    // todo negro, salvo los ojos que se "encienden" en "eyes"
    const r = interpolate(t, [H.two, H.eyes + 0.2], [60, 240], { ...clamp, easing: ease });
    return [960, 495, r, 0.94];
  }
  return null;
};

const Hook: React.FC<{ t: number; f: number; c: any }> = ({ t, f, c }) => {
  if (t > CLOSE1 + 0.1) return null;
  // cierre en portal: el leopardo se achica en círculo sobre Champawat
  const k = interpolate(t, [CLOSE0, CLOSE1], [1, 0], { ...clamp, easing: ease });
  const [px, py] = pj(c, CHAMP[0], CHAMP[1]);
  const cx = interpolate(k, [0, 1], [px, 960]), cy = interpolate(k, [0, 1], [py, 540]);
  const r = Math.max(0.01, 2300 * k * k + 6);
  const ring = t > CLOSE0 ? interpolate(k, [0, 0.12, 0.5], [1, 1, 0], clamp) : 0;
  const b = beam(t);
  const flash = interpolate(t, [H.click, H.click + 0.06, H.click + 0.35], [0, 0.22, 0], clamp);
  const hit = interpolate(t, [H.decided + 0.6, H.decided + 0.67, H.decided + 1.05], [0, 0.85, 0], clamp);
  // "You turn": barrido horizontal entre arbustos y el giro
  const whip = interpolate(t, [H.turn - 0.05, H.turn + 0.2, H.turn + 0.45], [0, 1, 2], clamp);
  return (
    <AbsoluteFill style={{ zIndex: 20, pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)`, background: "#000" }}>
        {SHOTS.map((s, i) => {
          if (t < s.t0 - XF || t > s.t1 + XF) return null;
          const inn = i === 0 ? 1 : interpolate(t, [s.t0 - XF / 2, s.t0 + XF / 2], [0, 1], clamp);
          const prog = (t - s.t0) / (s.t1 - s.t0);
          let sc = s.z[0] + (s.z[1] - s.z[0]) * Math.max(-0.2, Math.min(1.2, prog));
          sc += 0.06 * (1 - inn); // la toma que entra viene un poco más cerca y se asienta
          let tx = 0, blur = 0, op = inn;
          if (s.src === "g2_06_arbustos") { tx = -1500 * Math.min(1, whip); blur = 26 * Math.min(1, whip); op = whip >= 1 ? 0 : 1; }
          if (s.src === "g2_07_giro") { tx = 1500 * (1 - Math.max(0, whip - 1)); blur = 26 * (1 - Math.max(0, whip - 1)); op = whip <= 1 ? 0 : 1; if (whip <= 1 && t < H.turn + 0.2) return null; }
          return (
            <AbsoluteFill key={i} style={{ opacity: op }}>
              <Img src={sf("gancho2/" + s.src + ".jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${s.o[0]}% ${s.o[1]}%`, transform: `translateX(${tx}px) scale(${sc})`, filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined }} />
              {s.dark ? <AbsoluteFill style={{ background: `rgba(0,0,0,${s.dark})` }} /> : null}
            </AbsoluteFill>
          );
        })}
        {b && <AbsoluteFill style={{ background: `radial-gradient(circle ${b[2] * 1.7}px at ${b[0]}px ${b[1]}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,${b[3]}) 100%)` }} />}
        <AbsoluteFill style={{ background: `rgba(255,248,225,${flash})` }} />
        {/* lugar y hora, como una nota de campo */}
        <div style={{ position: "absolute", left: 70, bottom: 70, fontFamily: SANS, color: "#fff", textShadow: "0 2px 8px #000", opacity: interpolate(t, [0.4, 0.9, H.step - 0.2, H.step + 0.3], [0, 1, 1, 0], clamp) }}>
          <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: 2 }}>2:00 AM</div>
          <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: 4, opacity: interpolate(t, [1.5, 2.0], [0, 1], clamp) }}>KUMAON · NORTHERN INDIA</div>
        </div>
        <Sticker f={f} t={t} t0={H.ten - 0.05} t1={H.decided - 0.1} x={1420} y={860} rot={-5} bg={RED} size={76}>10 MINUTES</Sticker>
        <AbsoluteFill style={{ background: `rgba(0,0,0,${hit})` }} />
      </AbsoluteFill>
      {ring > 0 && <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "7px solid #fff", opacity: ring, boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />}
    </AbsoluteFill>
  );
};

export const gancho: Chapter = {
  T0: 0, T1: CLOSE1 + 0.1,
  keys: [],
  Screen: ({ c, f, t }) => <Hook c={c} f={f} t={t} />,
  sfx: [
    [H.click + 0.02, "tiny_soft_tickclick__#3-1780923823227.mp3", 0.6, 0.5],
    [H.turn - 0.05, "freesound_community-whoosh-blow-flutter-shortwav-14678.mp3", 0.35, 0.8],
    [H.decided + 0.6, "deep-cinematic-impact-1.mp3", 0.7, 2.2],
  ],
};
// el mapa empieza sobre Champawat (G de la narración debe quedar después del cierre)
if (G < CLOSE1 + 0.3) console.warn("gancho: G debería ser ≥", (CLOSE1 + 0.3).toFixed(2));
