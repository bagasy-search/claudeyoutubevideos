// elmer01 · EL RESTO (61,6 s → final) + el video ENTERO (Min1 debajo hasta que entra el avatar).
// Avatar SIEMPRE montado (preroll de 10 cuadros real), cada ventana con su entrada/salida y sus piezas encima;
// entre ventanas, los tramos (Rest1..4) ponen mundo/fotos/piezas. Un solo mundo y una sola cámara (K = suma de los tramos).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GState, Key } from "./garage3d";
import { AvatarLayer, AvIn, WIN, WorldR, END } from "./core";
import { e, ei } from "./lib";
import { Min1, MIN1_FRAMES } from "./Min1";
import { K1, seg1 } from "./Rest1";
import { K2, seg2, AV2 } from "./Rest2";
import { K3, seg3, AV3, T3 } from "./Rest3";
import { K4, seg4, AV4, T4, foldAll } from "./Rest4";
import { AV1 } from "./Rest1av";

export const FULL_FRAMES = Math.ceil(END * 30);
const K: Key[] = [...K1, ...K2, ...K3, ...K4].sort((a, b) => a.t - b.t);
const T0 = MIN1_FRAMES / 30;

// estado del garaje en el resto (el banco ya está abierto; los tramos piden rayos X, aceite, bolsas, plegado)
const stAt = (t: number): GState => ({
  ...foldAll(t),
  bags: t > T4.bag1 - 0.3 && t < T4.sandOff ? Math.max(0, Math.min(6, (t - T4.bag1 + 0.3) / ((T4.bag6 - T4.bag1) / 5))) : 0,
  xray: t > T3.magW - 1 && t < T3.magW + 14 ? e(t, T3.magW - 0.5, T3.magW + 0.4) : 0,
  pallets: 1, oil: t > T4.oilOn ? 1 : 0, glow: 0, day: 0.75, bulb: 1,
});
// piezas encima del avatar: clave = segundo (redondeado) en que empieza a hablar en esa ventana
// entrada/salida de cada ventana del avatar (rotan; ninguna con halo ni desenfoque en el borde)
const KINDS: AvIn[] = ["split", "door", "iris", "slide", "card", "drop"];
const AVOV: Record<number, (t: number) => React.ReactNode> = { ...AV1, ...AV2, ...AV3, ...AV4 };
const avStyle = (t: number): { st: React.CSSProperties; on: boolean; i: number } => {
  const i = WIN.findIndex((w) => t >= w.ms && t < w.me);
  if (i < 0) return { st: { opacity: 0 }, on: false, i };
  const w = WIN[i];
  const a = ei(t, w.ms, w.ms + 0.4), b = 1 - ei(t, w.me - 0.4, w.me), k = Math.min(a, b);
  const kind = KINDS[(a < 1 ? i : i + 3) % KINDS.length];
  const R = k * 2300;
  const st: React.CSSProperties =
    kind === "iris" ? { clipPath: `circle(${R}px at 960px 420px)` }
    : kind === "door" ? { transformOrigin: a < 1 ? "100% 50%" : "0% 50%", transform: `perspective(1600px) rotateY(${(1 - k) * (a < 1 ? 95 : -95)}deg)` }
    : kind === "slide" ? { transform: `translateX(${(1 - k) * (a < 1 ? 1920 : -1920)}px)` }
    : kind === "drop" ? { transform: `translateY(${(1 - k) * (a < 1 ? -1080 : 1080)}px)` }
    : kind === "split" ? { clipPath: `inset(0 ${(1 - k) * 50}% 0 ${(1 - k) * 50}%)` }
    : { transform: `perspective(1800px) rotateX(${(1 - k) * 60}deg) scale(${0.55 + 0.45 * k})`, transformOrigin: "50% 100%", borderRadius: 30 * (1 - k), overflow: "hidden" };
  return { st, on: true, i };
};

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const World = (k: string) => <WorldR key={k} K={K} t={t} st={stAt(t)} />;
  seg1(t, L, World); seg2(t, L, World); seg3(t, L, World); seg4(t, L, World);
  const av = avStyle(t);
  const w = av.i >= 0 ? WIN[av.i] : undefined;
  return (
    <AbsoluteFill>
      {t >= T0 && L}
      {/* el avatar va SIEMPRE montado (preroll); se ve sólo dentro de su ventana */}
      <AbsoluteFill style={{ ...av.st, opacity: av.on && t >= T0 ? 1 : 0 }}>
        <AvatarLayer t={t} />
        {w && AVOV[Math.round(w.pieces[0][0])]?.(t)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// EL VIDEO ENTERO: minuto 1 hasta que el avatar del resto lo tapa; el resto encima
export const Elmer01: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {t < T0 + 0.5 && <Min1 />}
      {t >= T0 - 1.2 && <Rest />}
    </AbsoluteFill>
  );
};
