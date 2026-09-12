// MovReel.tsx — composición SOLO PARA LA PRUEBA DE COSTURA (no es el video final).
//
// Por qué existe: los 6 movimientos son 7.193 líneas escritas por 6 subagentes en paralelo. Antes
// de comprometer el render final de 60 chunks (con avatar, audio y beatsheet), conviene verificar
// en el farm que los 6 COMPILAN, RENDERIZAN y que sus 30 fronteras internas no muestran un reset.
// Sale mucho más barato que descubrir un chunk muerto en el final.
//
// ⛔ NO se entrega esto. El video real lo arma `build_mdbleach.mjs` anclado al ms del .wav.
//
// Los movimientos están diseñados para ir ENCIMA del avatar; acá no hay avatar, así que debajo va
// un fondo neutro del canal. Los tramos donde un acto deja ver "el avatar" se verán oscuros: es
// esperado y no es un defecto de costura.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { MD } from "./Stage";
import { MovMatch } from "./MovMatch";
import { MovLoop } from "./MovLoop";
import { MovLetter } from "./MovLetter";
import { MovTruck } from "./MovTruck";
import { MovRefill } from "./MovRefill";
import { MovClose } from "./MovClose";

// Duraciones NOMINALES (las que recibieron los agentes). El build final las reemplaza por las
// reales, ancladas al ms de Whisper.
export const REEL = [
  { name: "MovMatch", Comp: MovMatch, dur: 1350 },
  { name: "MovLoop", Comp: MovLoop, dur: 1200 },
  { name: "MovLetter", Comp: MovLetter, dur: 1500 },
  { name: "MovTruck", Comp: MovTruck, dur: 1260 },
  { name: "MovRefill", Comp: MovRefill, dur: 1500 },
  { name: "MovClose", Comp: MovClose, dur: 1350 },
] as const;

export const REEL_STARTS = REEL.reduce<number[]>((acc, m, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + REEL[i - 1].dur);
  return acc;
}, []);

export const TOTAL_FRAMES_MDBLEACHMOV = REEL.reduce((a, m) => a + m.dur, 0); // 8160 = 4:32

export const MainMdBleachMov: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: MD.ink1 }}>
    {REEL.map((m, i) => (
      <Sequence key={m.name} from={REEL_STARTS[i]} durationInFrames={m.dur} layout="none">
        <m.Comp durationInFrames={m.dur} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
