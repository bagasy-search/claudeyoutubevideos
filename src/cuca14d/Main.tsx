// Montaje cuca14d — capas: avatar · material (clips reales, fotos con Ken Burns, Veo enteros) · escenas Cuca · audio premezclado
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, TOTAL } from "./cues.gen";
import * as P from "../cucakit/Piezas";
import * as Q from "../cucakit/Piezas2";
import * as Z from "../cucakit/Cuca";

const SLUG = "cuca14d";
export const TOTAL_FRAMES = TOTAL;
const T = 8;

const ShotBody: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  if (s.veo) return <P.Clip src={s.veo} seed={s.id + 1} dur={dur} clipDur={s.veoDur} minRate={0.8} />;
  if (s.k === "Y") return <P.Clip src={s.src} seed={s.id + 1} dur={dur} clipDur={s.clipDur} />;
  if (s.k === "G" || s.k === "W") return <P.Photo src={s.src} seed={s.id + 1} dur={dur} />;
  return null;
};

const Enter: React.FC<{ trans: string; children: React.ReactNode; seed: number }> = ({ trans, children, seed }) => {
  const f = useCurrentFrame();
  if (trans === "fade") return <AbsoluteFill style={{ opacity: interpolate(f, [0, T], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
  if (trans === "push") {
    const dir = P.hash(seed) % 2 ? 1 : -1;
    const x = interpolate(f, [0, T + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)` }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const Overlay: React.FC<{ o: any }> = ({ o }) => {
  const d = o.dur;
  switch (o.type) {
    case "paso": return <Z.PasoTalavera n={o.n} total={o.total} word={o.word} title={o.title} src={o.src} dur={d} />;
    case "premio": return <Z.PremioOlla title={o.title} src={o.src} dur={d} />;
    case "recado": return <Z.RecadoPregunta text={o.text} dur={d} />;
    case "suscribe": return <Z.SuscribeChile dur={d} />;
    case "cuaderno": return <Z.CuadernoRecap titulo={o.titulo} items={o.items} marks={o.marks} cruz={o.cruz} dur={d} />;
    case "raiz": return <Z.PalabraRaiz partes={o.partes} resultado={o.resultado} at2={o.at2} dur={d} />;
    default: return null;
  }
};

// 19-nov: las piezas superpuestas (cuaderno, raíz, recado…) quedaban quietas 4-6 s (el QC las marcó congeladas):
// cámara lenta y curva sobre toda la pieza (acercamiento suave + vaivén lateral), nunca lineal.
const OvDrift: React.FC<{ seed: number; dur: number; children: React.ReactNode }> = ({ seed, dur, children }) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / Math.max(1, dur));
  const e = 0.5 - 0.5 * Math.cos(Math.PI * t);
  const dir = P.hash(seed) % 2 ? 1 : -1;
  const sc = 1.03 + 0.05 * e;   // base 1.03: el vaivén (±1 %) nunca deja ver el borde
  const x = dir * (1.2 * e - 0.6) + 0.35 * Math.sin(f / 37 + seed);
  const y = -0.5 * e + 0.25 * Math.sin(f / 53 + seed * 2);
  return <AbsoluteFill style={{ transform: `translate(${x}%, ${y}%) scale(${sc})` }}>{children}</AbsoluteFill>;
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: "#2B1A10" }}>
    {AVATAR.map((a, i) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <Q.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} />
      </Sequence>
    ))}
    {SHOTS.map((s, i) => {
      if (s.k === "A") return null;
      const nx = SHOTS[i + 1];
      const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? T + 2 : 0;
      return (
        <Sequence key={"s" + s.id} from={s.from} durationInFrames={Math.min(s.dur + tail, TOTAL - s.from)} premountFor={45}>
          <Enter trans={s.trans || "cut"} seed={s.id}><ShotBody s={s} dur={s.dur} /></Enter>
        </Sequence>
      );
    })}
    {OVERLAYS.map((o, i) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}>
        <OvDrift seed={i + 7} dur={Math.min(o.dur, TOTAL - o.from)}><Overlay o={o} /></OvDrift>
      </Sequence>
    ))}
    <Audio src={staticFile(SLUG + "_mix.m4a")} />
  </AbsoluteFill>
);
