// Diseño de sonido de "La taza número 9": cada acción visible suena en su cuadro.
// Los wav de public/vext01/sfx vienen recortados (el golpe arranca en 0) y normalizados a pico -1 dBFS,
// así que `db` es el pico buscado. Variación: tono ±6 % al azar para que nada suene repetido.
import React from "react";
import { Audio, Sequence, interpolate, random, staticFile } from "remotion";

const BPM_F = (30 * 60) / 110; // misma grilla que los anillos y las ondas de Taza.tsx
const LATIDO0 = 318; // el corazón arranca tras el silencio que deja la heladera (300-318)
type Cue = { f: number; s: string; db: number; d?: number; tono?: number; fade?: number; fadeIn?: number; loop?: boolean; desde?: number };
const vol = (db: number) => Math.pow(10, (db + 1) / 20);

const CUES: Cue[] = [
  // cama: tono de sala casi inaudible (ruido marrón) para que el silencio no sea "digital"; la heladera bien de fondo
  { f: 0, s: "room", db: -49, d: 480, loop: true, fadeIn: 6, fade: 30 },
  { f: 0, s: "heladera", db: -39, d: 300, loop: true, fadeIn: 6 },
  // P1 (0-60) la mano agarra la cafetera: contacto 23, la levanta en 31
  { f: 8, s: "roce", db: -28, d: 30 },
  { f: 23, s: "agarre", db: -22, d: 20 },
  { f: 31, s: "clic_base", db: -18, d: 20 },
  { f: 34, s: "chapoteo", db: -27, d: 26, fade: 10 },
  // P2 (60-165) el líquido se mueve al inclinar; el chorro arranca agudo y sigue sin repetir el ataque
  { f: 60, s: "chapoteo", db: -30, d: 18, tono: 0.9, fade: 8 },
  { f: 62, s: "pour_a", db: -14, d: 9, tono: 1.1, fadeIn: 2, fade: 2 },
  { f: 70, s: "pour_a", db: -14, d: 82, desde: 8, tono: 1, fadeIn: 2, fade: 5 },
  { f: 118, s: "pour_c", db: -22, d: 34, tono: 1.18, fadeIn: 10, fade: 5 },
  { f: 156, s: "gota", db: -20, d: 10, tono: 1.05 },
  { f: 160, s: "clic_base", db: -26, d: 16, tono: 0.95 }, // la cafetera vuelve a su base (fuera de cuadro)
  { f: 163, s: "gota", db: -25, d: 10, tono: 0.94 },
  // aire de las dos transiciones rápidas (paneo T1 y manga que pasa por la lente T2), bien abajo
  { f: 52, s: "swoosh_lento", db: -33, d: 18, fade: 6 },
  { f: 157, s: "swoosh_aire", db: -31, d: 16, fade: 6 },
  { f: 159, s: "roce", db: -30, d: 12, tono: 0.85 },
  // P3 (165-225) la taza se apoya en 180: roce del plato 2 cuadros antes, porcelana contra porcelana
  { f: 168, s: "roce", db: -32, d: 20, tono: 1.1 },
  { f: 178, s: "roce", db: -36, d: 6, tono: 1.4 },
  { f: 180, s: "taza_madera", db: -12, d: 30, tono: 1.25 },
  { f: 180, s: "cuchara3", db: -18, d: 14, tono: 1.05 },
  { f: 182, s: "cuchara", db: -22, d: 24, fade: 8 },
  { f: 191, s: "cuchara3", db: -32, d: 14 },
  { f: 200, s: "exhala", db: -24, d: 30 },
  // P4 (225-330) sin whooshes: el puente es el reloj; cambio de peso en 262; la heladera se corta en 300 y queda la sala sola
  { f: 262, s: "roce", db: -29, d: 26, tono: 0.92 },
  { f: 300, s: "clic_heladera", db: -22, d: 20 },
  { f: 300, s: "heladera_corte", db: -39, d: 30 },
  // P5-P7 el cuerpo: rumble grave, pitido de oído que entra despacio, tics del párpado ENTRE latidos
  { f: 330, s: "rumble", db: -32, d: 213, fadeIn: 30, fade: 2 },
  { f: 343, s: "agarre", db: -32, d: 4, tono: 1.6 },
  { f: 358, s: "agarre", db: -32, d: 4, tono: 1.5 },
  { f: 375, s: "agarre", db: -31, d: 4, tono: 1.7 },
  { f: 380, s: "pitido", db: -34, d: 163, fadeIn: 60, fade: 1 },
  // P7 (510-610) el sorbo: tic de porcelana al agarrar, roce de la manga, negro absoluto en 543 con el último latido
  { f: 511, s: "cuchara3", db: -27, d: 10, tono: 1.3 },
  { f: 511, s: "roce", db: -30, d: 14, tono: 1.05, fade: 4 },
  { f: 513, s: "agarre", db: -27, d: 16, tono: 0.9 },
  { f: 530, s: "sorbo", db: -19, d: 13, fade: 3 },
  { f: 541, s: "trago", db: -17, d: 18 },
  { f: 543, s: "latido_cola", db: -14, d: 67, tono: 1, fade: 10 },
];

// reloj: un tic por segundo hasta que la heladera se corta; desde 217 sube y hace de puente al plano general
for (let f = 12; f < 300; f += 30) CUES.push({ f, s: "tic", db: f >= 217 ? -28 : -37, d: 12 });
// latido sobre la grilla de 110 lpm desde 318; se calla en 514 para que el último (543, con cola) pegue solo
for (let k = 0; ; k++) {
  const f = Math.round(LATIDO0 + k * BPM_F);
  if (f > 520) break;
  CUES.push({ f, s: "latido_grave", db: f < 420 ? -20 : f < 510 ? -17 : -18, d: 14, tono: 1 });
  if (f >= 420 && f < 510) CUES.push({ f: f + 1, s: "gota", db: -27, d: 8, tono: 1.3 });
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
            startFrom={c.desde}
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
