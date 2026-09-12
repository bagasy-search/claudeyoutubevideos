// cues_leones.gen.tsx — DOCUMENTAL DE PRUEBA (~1 min) "Serengeti / leones".
// Hand-authored: demuestra cómo clips DISTINTOS, ordenados a una curva (teaser de
// acción → establishing → caza → resolución), se leen como UN documental con orden.
// Clips reales cortados del documental analizado (public/broll/le_*.mp4).
// Cada toma ANCLADA al ms exacto de su frase (public/leones_timing.json).
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { NameTag } from "./scenes/NameTag";
import { StatTag } from "./scenes/StatTag";
import { PhraseTag } from "./scenes/PhraseTag";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };
const R = (src: string, hue: "blue" | "cold" | "amber" | "red") => (d: number) =>
  <RawShot durationInFrames={d} src={src} hue={hue} />;
const V = (n: string) => `broll/le_${n}.mp4`;
const S = (start: number, dur: number, n: string, hue: "blue" | "cold" | "amber" | "red", key: string): Cue =>
  ({ key, start, dur, kind: "raw", el: R(V(n), hue) });

// ── CUES (fondo continuo). start/dur en segundos. INTRO=4 → narración en 4.0 ──
export const CUES: Cue[] = [
  // COLD-OPEN TEASER (0–4s, sin narración): los 3 planos más intensos cross-disolviendo
  S(0.0, 1.5, "snarl", "red", "t0"),    // leona gruñendo a cámara
  S(1.5, 1.2, "eyes", "amber", "t1"),   // macro de ojos
  S(2.7, 1.3, "buffalo", "amber", "t2"),// búfalo cargando

  // [4.00] "En la sabana de Tanzania, el sol no perdona."
  S(4.0, 4.85, "crater", "amber", "c0"),      // vista del cráter — ubica el lugar

  // [8.85] "Cada amanecer, una leona despierta con una sola misión: mantener con vida a sus crías.
  //         Pero el Serengeti no regala nada. La estación seca vació los ríos, y las manadas se marcharon..."
  S(8.85, 2.75, "giraffes", "amber", "c1"),   // sabana al amanecer
  S(11.6, 3.4, "stalk", "blue", "c2"),        // la leona con su misión  [NameTag]
  S(15.0, 2.6, "hyena", "red", "c3"),         // el Serengeti no regala nada  [PhraseTag]
  S(17.6, 1.8, "flamingos", "cold", "c4"),    // los ríos / el agua
  S(19.4, 2.4, "crater", "cold", "c5"),       // la estación seca, la inmensidad
  S(21.8, 2.3, "giraffes", "amber", "c6"),    // las manadas se marcharon

  // [24.10] "Sin presas, el hambre acecha más rápido que cualquier depredador.
  //          Durante días, camina kilómetros bajo cuarenta grados, siguiendo el rastro..."
  S(24.1, 2.1, "snarl", "red", "c7"),         // el hambre acecha
  S(26.2, 1.6, "eyes", "amber", "c8"),        // el depredador
  S(27.8, 3.7, "stalk", "amber", "c9"),       // camina kilómetros  [StatTag 40°C]
  S(31.5, 3.0, "crater", "cold", "c10"),      // la inmensidad seca
  S(34.5, 3.2, "stalk", "blue", "c11"),       // siguiendo el rastro

  // [37.70] "Y entonces, al fin, una oportunidad. Un búfalo rezagado. En la caza no existen
  //          los segundos intentos: un error, y esta noche nadie come."
  S(37.7, 3.8, "buffalo", "amber", "c12"),    // el búfalo rezagado
  S(41.5, 3.0, "chase", "red", "c13"),        // la persecución
  S(44.5, 2.5, "snarl", "red", "c14"),        // un error...
  S(47.0, 2.65, "eyes", "red", "c15"),        // ...y esta noche nadie come (tensión)

  // [49.65] "El primer salto falla. El segundo, no."  ← CLÍMAX
  S(49.65, 2.15, "cheetah", "red", "c16"),    // el salto
  S(51.8, 2.38, "chase", "red", "c17"),       // el impacto

  // [54.18] "Esa noche, sus crías sobreviven. Porque en el Serengeti, sobrevivir no es
  //          cuestión de fuerza. Es no rendirse jamás."
  S(54.18, 3.32, "giraffes", "amber", "c18"), // la vida sigue
  S(57.5, 3.5, "crater", "amber", "c19"),     // majestuoso
  S(61.0, 3.36, "flamingos", "cold", "c20"),  // beauty shot final  [PhraseTag]
];

// ── OVERLAYS (encima del footage, no lo tapan) ──
export const OVERLAYS: Cue[] = [
  // Lower-third de especie (NatGeo) sobre la leona acechando
  { key: "name", start: 11.9, dur: 4.6, kind: "nametag",
    el: (d) => <NameTag durationInFrames={d} name="León africano" sub="Panthera leo" accent="amber" /> },
  // Frase clave sobre la dureza del Serengeti
  { key: "ph1", start: 15.0, dur: 3.0, kind: "phrasetag",
    el: (d) => <PhraseTag durationInFrames={d} text="El *Serengeti* no regala nada" accent="cold" /> },
  // Cifra: 40°C durante "cuarenta grados"
  { key: "stat", start: 28.0, dur: 4.2, kind: "stattag",
    el: (d) => <StatTag durationInFrames={d} text="40°C" eyebrow="Estación seca" label="bajo el sol de la sabana" accent="danger" corner="tr" /> },
  // Frase de cierre
  { key: "ph2", start: 61.2, dur: 3.16, kind: "phrasetag",
    el: (d) => <PhraseTag durationInFrames={d} text="No rendirse *jamás*" accent="accent" pos="center" /> },
];
