import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";

// Short 2 de Bea con edición mega: todo sale del propio clip de Muse y de la máscara de Bea (m_<slug>.mp4, blanco = persona).
const { fontFamily: INTER } = loadInter("normal", { weights: ["600"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: ANTON } = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });

export const FPS = 30;
export const OFF = 0.125; // se salta el cuadro 0 (la foto de referencia)
const W = 720, H = 1280;
const F = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = (u: number) => { const x = Math.min(1, Math.max(0, u)); return x * x * (3 - 2 * x); };
const ramp = (t: number, a: number, b: number, c: number, d: number) => suave((t - a) / (b - a)) * (1 - suave((t - c) / (d - c)));

export type Plan = { src: string; words: [string, number, number, boolean][]; frases: [number, number][]; T: number };
type Props = { plan: Plan; slug: string };

// video a cuadro completo; dt = cuánto adelantado va respecto del tiempo de la composición
const V: React.FC<{ f: string; dt?: number; style?: React.CSSProperties }> = ({ f, dt = 0, style }) => (
  <OffthreadVideo muted src={staticFile(f)} startFrom={F(OFF + dt)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "fill", ...style }} />
);

// fondo × (1 − máscara) + persona × máscara: lo que va en children queda DETRÁS de Bea
const Detras: React.FC<{ slug: string; dt?: number; children: React.ReactNode; persona?: React.ReactNode }> = ({ slug, dt = 0, children, persona }) => (
  <AbsoluteFill style={{ background: "black", isolation: "isolate" }}>
    <AbsoluteFill style={{ isolation: "isolate" }}>
      {children}
      <AbsoluteFill style={{ mixBlendMode: "multiply", filter: "invert(1)" }}><V f={`m_${slug}.mp4`} dt={dt} /></AbsoluteFill>
    </AbsoluteFill>
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {persona ?? <V f={`${slug}.mp4`} dt={dt} />}
      <AbsoluteFill style={{ mixBlendMode: "multiply" }}><V f={`m_${slug}.mp4`} dt={dt} /></AbsoluteFill>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ───── escena 1: SNOW vive detrás de la cabeza y se derrite en "spoil"
const Snow: React.FC<{ t: number }> = ({ t }) => {
  const e = interpolate(t, [3.76, 3.98], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.6)) });
  const op = interpolate(t, [3.76, 3.86, 5.2, 5.7], [0, 1, 1, 0], cl);
  return (
    <div style={{ position: "absolute", left: 0, top: 70, width: W, textAlign: "center", fontFamily: ANTON, fontSize: 290, lineHeight: 1, color: "#F4F8FF", letterSpacing: 6, opacity: op, transform: `scale(${1.35 - 0.35 * e})`, textShadow: "0 6px 30px rgba(20,40,80,0.45)" }}>
      {"SNOW".split("").map((c, i) => {
        const m = Math.max(0, t - 4.34 - i * 0.09); // se derrite letra por letra
        const caida = 260 * m * m, estira = 1 + 1.4 * m;
        return <span key={i} style={{ display: "inline-block", transformOrigin: "50% 0%", transform: `translateY(${caida}px) scaleY(${estira})`, filter: `blur(${Math.min(10, m * 9)}px)`, color: m > 0 ? "#DCE6D2" : undefined }}>{c}</span>;
      })}
    </div>
  );
};

// ───── escena 2: espejismo de calor sobre la bolsa + el 40 que brota del dial
const Calor: React.FC<{ slug: string; t: number }> = ({ slug, t }) => {
  const k = ramp(t, 6.3, 6.7, 7.9, 8.3);
  if (k <= 0) return null;
  const N = 18, y0 = 860, h = (H - y0) / N;
  return (
    <>
      {Array.from({ length: N }, (_, i) => (
        <AbsoluteFill key={i} style={{ clipPath: `inset(${y0 + i * h}px 0 ${H - y0 - (i + 1) * h - 1}px 0)`, transform: `translateX(${7 * k * Math.sin(2 * Math.PI * (2.2 * t) + i * 0.8)}px) scaleX(1.03)` }}>
          <V f={`${slug}.mp4`} />
        </AbsoluteFill>
      ))}
      <AbsoluteFill style={{ background: `linear-gradient(to top, rgba(255,140,40,${0.32 * k}) 0px, rgba(255,170,60,${0.12 * k}) 420px, transparent 560px)`, mixBlendMode: "overlay" }} />
    </>
  );
};
const Cuarenta: React.FC<{ t: number }> = ({ t }) => {
  const u = interpolate(t, [7.8, 8.12], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const op = interpolate(t, [7.8, 7.86, 9.0, 9.35], [0, 1, 1, 0], cl);
  if (op <= 0) return null;
  const x = 140 + (175 - 140) * u, y = 670 + (470 - 670) * u; // del centro del dial hacia arriba
  return (
    <div style={{ position: "absolute", left: x - 160, top: y - 90, width: 320, textAlign: "center", fontFamily: ANTON, fontSize: 170, lineHeight: 1, color: "#FFB04A", opacity: op, transform: `scale(${0.15 + 0.85 * u})`, textShadow: "0 4px 22px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.7)" }}>40°</div>
  );
};

// ───── escena 4: sombra fría que barre el fondo + NORTH en las tablas
const Sombra: React.FC<{ t: number }> = ({ t }) => {
  const x = interpolate(t, [13.35, 13.95], [-250, W + 250], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const fuera = interpolate(t, [15.6, 16.2], [1, 0], cl);
  if (t < 13.35 || fuera <= 0) return null;
  return <AbsoluteFill style={{ background: "rgb(95,125,185)", mixBlendMode: "multiply", opacity: 0.55 * fuera, WebkitMaskImage: `linear-gradient(to right, black ${x - 200}px, transparent ${x + 200}px)`, maskImage: `linear-gradient(to right, black ${x - 200}px, transparent ${x + 200}px)` }} />;
};
const North: React.FC<{ t: number }> = ({ t }) => {
  const u = interpolate(t, [14.46, 14.8], [0, 100], cl);
  const op = interpolate(t, [14.46, 14.5, 15.6, 16.0], [0, 0.9, 0.9, 0], cl);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 20, top: 320, width: 420, fontFamily: ANTON, fontSize: 150, lineHeight: 1, color: "#2E3A55", opacity: op, mixBlendMode: "multiply", transform: "perspective(900px) rotateY(24deg)", transformOrigin: "0% 50%", clipPath: `inset(0 ${100 - u}% 0 0)` }}>NORTH</div>
  );
};

// ───── escena 6: tambor de 40 a 34 detrás de la cabeza
const Tambor: React.FC<{ t: number }> = ({ t }) => {
  const op = interpolate(t, [21.6, 21.75, 23.5, 23.9], [0, 1, 1, 0], cl);
  if (op <= 0) return null;
  const v = interpolate(t, [21.78, 22.72], [40, 34], { ...cl, easing: Easing.out(Easing.quad) });
  const n = Math.ceil(v - 1e-6), fr = n - v; // fr 0→1 mientras baja al siguiente
  const hh = 250;
  const rebote = 1 + 0.06 * Math.exp(-6 * Math.max(0, t - 23.18)) * (t >= 23.18 ? Math.sin(14 * (t - 23.18)) : 0);
  const color = interpolate(v, [34, 40], [0, 1], cl);
  const c = `rgb(${Math.round(207 + 48 * color)},${Math.round(235 - 59 * color)},${Math.round(255 - 181 * color)})`;
  return (
    <div style={{ position: "absolute", left: 0, top: 30, width: W, height: hh, overflow: "hidden", opacity: op, transform: `scale(${rebote})` }}>
      {[n, n - 1].map((x, i) => (
        <div key={i} style={{ position: "absolute", left: 0, width: W, top: (i - fr) * hh, textAlign: "center", fontFamily: ANTON, fontSize: 250, lineHeight: `${hh}px`, color: c, textShadow: "0 6px 26px rgba(0,0,0,0.35)" }}>{x}°</div>
      ))}
    </div>
  );
};

// ───── escena 7: escarcha desde los bordes
const Escarcha: React.FC<{ slug: string; t: number }> = ({ slug, t }) => {
  const k = ramp(t, 26.0, 26.6, 27.5, 28.0);
  if (k <= 0) return null;
  const r = 820 - 330 * k;
  const m = `radial-gradient(ellipse ${r * 0.62}px ${r}px at 50% 45%, transparent 55%, black 100%)`;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}>
      <V f={`${slug}.mp4`} style={{ filter: `blur(${9 * k}px) brightness(${1 + 0.35 * k}) saturate(${1 - 0.6 * k})` }} />
      <AbsoluteFill style={{ background: `rgba(185,220,255,${0.55 * k})`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// ───── cámara: una curva continua por toma + golpes en palabras fuertes; los cortes tienen su propio movimiento
const golpe = (t: number, a: number, amp: number) => (t >= a ? amp * Math.exp(-5 * (t - a)) * Math.min(1, (t - a) * 20) : 0);
const camara = (t: number) => {
  const toma = Math.min(3, Math.floor(t / 10)), u = (t - toma * 10) / 10;
  let s = 1.03 + 0.06 * suave(u) + golpe(t, 8.26, 0.07) + golpe(t, 23.18, 0.05) + golpe(t, 32.66, 0.09);
  let ox = 360, oy = 560, dx = 0, dy = 0;
  if (t >= 32.66 && t < 33.1) { const q = t - 32.66; dx = 7 * Math.sin(q * 70) * (1 - q / 0.44); dy = 5 * Math.cos(q * 55) * (1 - q / 0.44); }
  // escena 8: hundirse en el blanco de la tapa (360,1150) y salir de la nieve (120,1230)
  if (t >= 29.55 && t < 30) { const q = suave((t - 29.55) / 0.45); s = s * (1 + 4 * q * q); ox = 360; oy = 1150; }
  if (t >= 30 && t < 30.55) { const q = suave((t - 30) / 0.55); s = 1.03 + 4 * (1 - q) * (1 - q); ox = 120; oy = 1230; }
  return { s, ox, oy, dx, dy };
};
const blanco = (t: number) => (t < 29.7 ? 0 : t < 30 ? suave((t - 29.7) / 0.3) : 1 - suave((t - 30) / 0.4));

// ───── subtítulos estilo Simone: 1 a 3 palabras, palabra por palabra con fundido y desenfoque, clave en serif cursiva
const Subs: React.FC<{ plan: Plan; t: number }> = ({ plan, t }) => {
  const ws = plan.words, fr = plan.frases;
  for (let p = 0; p < fr.length; p++) {
    const [a, b] = fr[p];
    const ini = ws[a][1] - 1 / 30;
    const nxt = p + 1 < fr.length ? ws[fr[p + 1][0]][1] - 1 / 30 - 0.02 : 99;
    const fin = Math.min(nxt, Math.max(ws[b][2], ws[b][1] + 0.35) + 0.6);
    if (t < ini || t >= fin) continue;
    const sale = fin < nxt - 0.15 ? interpolate(t, [fin - 0.09, fin], [1, 0], cl) : 1;
    return (
      <div style={{ position: "absolute", left: 60, width: W - 120, top: 812, textAlign: "center", opacity: sale }}>
        {ws.slice(a, b + 1).map(([w, t0, , k], i) => {
          const q = interpolate(t, [t0 - 1 / 30, t0 - 1 / 30 + 0.2], [0, 1], cl);
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 9px", fontFamily: k ? SERIF : INTER, fontStyle: k ? "italic" : "normal", fontWeight: k ? 400 : 600, fontSize: k ? 75 : 47, letterSpacing: k ? 0 : -0.4, color: "white", opacity: q, filter: `blur(${(1 - q) * 3}px)`, textShadow: "0 2px 14px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.55)", verticalAlign: "baseline" }}>{w}</span>
          );
        })}
      </div>
    );
  }
  return null;
};

// ───── sonido: un golpe por acción visual
const SFX: [string, number, number][] = [["hit", 3.74, 0.4], ["air", 6.3, 0.25], ["zoom", 7.76, 0.35], ["sw", 9.45, 0.4], ["wh", 13.3, 0.3], ["tr", 14.44, 0.3], ["sw2", 19.68, 0.45], ["tick", 21.8, 0.4], ["ting", 23.18, 0.3], ["air", 26.0, 0.3], ["riser", 29.2, 0.25], ["whr", 30.0, 0.35], ["imp", 32.64, 0.4]];

export const Bea: React.FC<Props> = ({ plan, slug }) => {
  const f = useCurrentFrame(), t = f / FPS + OFF;
  const cam = camara(t);
  const mp4 = `${slug}.mp4`;
  let escena: React.ReactNode;
  if (t >= 3.7 && t < 5.8) escena = <Detras slug={slug}><V f={mp4} /><Snow t={t} /></Detras>;
  else if (t >= 9.45 && t < 10) {
    // escena 3: Bea se queda (máscara) y detrás se abre el patio de la toma 2 desde su nuca
    const r = interpolate(t, [9.45, 9.9], [0, 1500], { ...cl, easing: Easing.in(Easing.cubic) });
    const m = `radial-gradient(circle at 360px 380px, black ${Math.max(0, r - 90)}px, transparent ${r}px)`;
    escena = (
      <Detras slug={slug}>
        <V f={mp4} />
        <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}><Freeze frame={F(10.05 - OFF)}><V f={mp4} /></Freeze></AbsoluteFill>
      </Detras>
    );
  } else if (t >= 10 && t < 10.35) {
    // Bea del último cuadro de la toma 1 se disuelve sobre la toma 2 ya corriendo (máscara congelada atenuada)
    const op = 1 - suave((t - 10) / 0.35), fz = F(9.98 - OFF);
    const M = () => <Freeze frame={fz}><V f={`m_${slug}.mp4`} style={{ filter: `brightness(${op})` }} /></Freeze>;
    escena = (
      <AbsoluteFill style={{ background: "black", isolation: "isolate" }}>
        <AbsoluteFill style={{ isolation: "isolate" }}>
          <V f={mp4} />
          <AbsoluteFill style={{ mixBlendMode: "multiply", filter: "invert(1)" }}><M /></AbsoluteFill>
        </AbsoluteFill>
        <AbsoluteFill style={{ mixBlendMode: "screen" }}>
          <Freeze frame={fz}><V f={mp4} /></Freeze>
          <AbsoluteFill style={{ mixBlendMode: "multiply" }}><M /></AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  } else if (t >= 13.3 && t < 16.2) escena = <Detras slug={slug}><V f={mp4} /><Sombra t={t} /><North t={t} /></Detras>;
  else if (t >= 21.6 && t < 23.9) escena = <Detras slug={slug}><V f={mp4} /><Tambor t={t} /></Detras>;
  else escena = <V f={mp4} />;

  // escena 5: barrido; la toma 2 se va a la izquierda con estela y la 3 entra desde la derecha
  let barrido: React.CSSProperties = {}, estela: React.ReactNode = null;
  if (t >= 19.72 && t < 20.28) {
    const sale = t < 20, q = sale ? Math.pow((t - 19.72) / 0.28, 2.2) : 1 - Math.pow(1 - (t - 20) / 0.28, 2.2);
    const x = sale ? -W * q : W * (1 - q);
    barrido = { transform: `translateX(${x}px)` };
    estela = [1, 2, 3].map((i) => (
      <AbsoluteFill key={i} style={{ transform: `translateX(${x + (sale ? 1 : -1) * i * 38}px)`, opacity: 0.28 / i }}><V f={mp4} /></AbsoluteFill>
    ));
  }
  const fin = interpolate(t, [plan.T - 0.55, plan.T], [0, 1], cl); // loop: vuelve al primer cuadro
  return (
    <AbsoluteFill style={{ background: "black", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${cam.dx}px, ${cam.dy}px) scale(${cam.s})`, transformOrigin: `${cam.ox}px ${cam.oy}px` }}>
        <AbsoluteFill style={barrido}>{escena}</AbsoluteFill>
        {estela}
        <Calor slug={slug} t={t} />
        <Cuarenta t={t} />
        <Escarcha slug={slug} t={t} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: blanco(t) }} />
      {fin > 0 ? <AbsoluteFill style={{ opacity: fin }}><Freeze frame={0}><V f={mp4} /></Freeze></AbsoluteFill> : null}
      <Subs plan={plan} t={t} />
      <Audio src={staticFile(mp4)} startFrom={F(OFF)} />
      {SFX.map(([s, a, g], i) => (
        <Sequence key={i} from={Math.max(0, F(a - OFF))} durationInFrames={F(3)}><Audio src={staticFile(`sfx/${s}.mp3`)} volume={g} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
