// Diseño de sonido de "La taza número 9": cada acción visible suena en su cuadro.
// Los wav de public/vext01/sfx vienen recortados (el golpe arranca en 0) y normalizados a pico -1 dBFS,
// así que `db` es el pico buscado. Variación: tono ±6 % al azar para que nada suene repetido.
import React from "react";
import { Audio, Sequence, interpolate, random, staticFile } from "remotion";

const BPM_F = (30 * 60) / 110; // misma grilla que los anillos y las ondas de Taza.tsx
type Cue = { f: number; s: string; db: number; d?: number; tono?: number; fade?: number; fadeIn?: number; loop?: boolean };
const vol = (db: number) => Math.pow(10, (db + 1) / 20);

const CUES: Cue[] = [
  // P1 (0-60) la mano agarra la cafetera
  { f: 0, s: "heladera", db: -30, d: 302, loop: true, fadeIn: 6, fade: 4 },
  { f: 8, s: "roce", db: -28, d: 30 },
  { f: 21, s: "agarre", db: -22, d: 20 },
  { f: 30, s: "clic_base", db: -18, d: 20 },
  { f: 33, s: "chapoteo", db: -27, d: 26, fade: 10 },
  // P2 (60-165) el chorro; el segundo chorro más agudo encima da la sensación de taza que se llena
  { f: 62, s: "pour_a", db: -14, d: 90, fadeIn: 2, fade: 5 },
  { f: 118, s: "pour_c", db: -22, d: 34, tono: 1.18, fadeIn: 10, fade: 5 },
  { f: 156, s: "gota", db: -20, d: 10, tono: 1.05 },
  { f: 163, s: "gota", db: -25, d: 10, tono: 0.94 },
  // P3 (165-225) la taza se apoya en 180
  { f: 168, s: "roce", db: -32, d: 20, tono: 1.1 },
  { f: 180, s: "taza_madera", db: -8, d: 30 },
  { f: 182, s: "cuchara", db: -22, d: 24, fade: 8 },
  { f: 191, s: "cuchara3", db: -32, d: 14 },
  { f: 200, s: "exhala", db: -24, d: 30 },
  // P4 (225-330) travelling atrás; la heladera se corta en 300 y queda el silencio
  { f: 219, s: "swoosh_aire", db: -27, d: 40, fade: 12 },
  { f: 262, s: "roce", db: -29, d: 26, tono: 0.92 },
  { f: 300, s: "clic_heladera", db: -22, d: 20 },
  { f: 324, s: "swoosh_lento", db: -28, d: 30, fade: 10 },
  // P5-P7 el cuerpo: rumble grave, pitido de oído que crece, tics del párpado
  { f: 330, s: "rumble", db: -32, d: 213, fadeIn: 30, fade: 2 },
  { f: 350, s: "agarre", db: -32, d: 4, tono: 1.6 },
  { f: 362, s: "agarre", db: -32, d: 4, tono: 1.5 },
  { f: 371, s: "agarre", db: -31, d: 4, tono: 1.7 },
  { f: 380, s: "pitido", db: -34, d: 163, fade: 1 },
  // P7 (510-570) el sorbo; negro absoluto en 543
  { f: 513, s: "agarre", db: -27, d: 16, tono: 0.9 },
  { f: 530, s: "sorbo", db: -19, d: 13, fade: 3 },
  { f: 541, s: "trago", db: -17, d: 18 },
];

// reloj: un tic por segundo hasta que la heladera se corta (más presente en el plano general)
for (let f = 12; f < 330; f += 30) CUES.push({ f, s: "tic", db: f >= 225 ? -30 : -37, d: 12 });
// latido sobre la grilla de 110 lpm: más cerca en el cenital, con una gotita en cada onda del café
for (let k = 0; ; k++) {
  const f = Math.round(330 + k * BPM_F);
  if (f > 540) break;
  CUES.push({ f, s: "latido_grave", db: f < 420 ? -20 : f < 510 ? -15 : -18, d: 14, tono: 1 });
  if (f >= 420 && f < 510) CUES.push({ f: f + 1, s: "gota", db: -33, d: 8, tono: 1.3 });
}

export const Sonidos: React.FC = () => (
  <>
    {CUES.map((c, i) => {
      const d = c.d ?? 30;
      const tono = c.tono ?? 1 + (random("t" + i) - 0.5) * 0.12;
      const v = vol(c.db + (random("v" + i) - 0.5) * 2);
      const fi = c.fadeIn ?? 0, fo = c.fade ?? 0;
      return (
        <Sequence key={i} from={c.f} durationInFrames={d} layout="none">
          <Audio
            src={staticFile(`vext01/sfx/${c.s}.wav`)}
            loop={c.loop}
            toneFrequency={tono}
            volume={(t) => {
              const a = fi > 0 ? interpolate(t, [0, fi], [0, 1], { extrapolateRight: "clamp" }) : 1;
              const b = fo > 0 ? interpolate(t, [d - fo, d], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
              return v * a * b;
            }}
          />
        </Sequence>
      );
    })}
  </>
);
