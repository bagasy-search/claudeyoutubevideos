// Foco: lo que el narrador nombra se ILUMINA en la escena, sin corte (28-oct, vara del creador: «si dice dos casas,
// esas dos casas se iluminan, se saturan un poco… todo fluido»). Va en `detras` de EscenaB (capa del set, coordenadas
// del mundo, debajo de los personajes): luz cálida en soft-light (sube brillo y saturación de lo que hay abajo) + un
// halo suave en screen, y el resto del set se apaga apenas (multiply con máscara) para que lo nombrado se despegue.
import React, { useId } from "react";
import { Easing, interpolate } from "remotion";

export type Luz = { desde: number; hasta: number; x: number; y: number; rx: number; ry: number; fuerza?: number };
const ent = Easing.out(Easing.cubic), sal = Easing.inOut(Easing.cubic);
const nivel = (f: number, l: Luz) =>
  f < l.desde || f > l.hasta + 20 ? 0 : Math.min(interpolate(f, [l.desde, l.desde + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ent }),
    interpolate(f, [l.hasta, l.hasta + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: sal }));

// en `sobre` (otra capa, sin el set debajo para mezclar): sólo el halo y la sombra alrededor, como un seguidor de teatro
export const Foco: React.FC<{ f: number; luces: Luz[]; apaga?: number; sobre?: boolean }> = ({ f, luces, apaga = 0.3, sobre }) => {
  const id = "foco" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const ks = luces.map((l) => nivel(f, l) * (l.fuerza ?? 1));
  const kmax = Math.max(0, ...ks);
  if (kmax <= 0.001) return null;
  return (
    <g>
      <defs>
        <radialGradient id={id + "c"}><stop offset="0" stopColor="#ffd88a" stopOpacity={1} /><stop offset="0.55" stopColor="#ffc060" stopOpacity={0.75} /><stop offset="1" stopColor="#ffb040" stopOpacity={0} /></radialGradient>
        <radialGradient id={id + "h"}><stop offset="0" stopColor="#000" stopOpacity={1} /><stop offset="0.6" stopColor="#000" stopOpacity={0.8} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
        <mask id={id + "m"} maskUnits="userSpaceOnUse" x={-20000} y={-20000} width={40000} height={40000}>
          <rect x={-20000} y={-20000} width={40000} height={40000} fill="#fff" />
          {luces.map((l, i) => ks[i] > 0.001 && <ellipse key={i} cx={l.x} cy={l.y} rx={l.rx * 1.25} ry={l.ry * 1.25} fill={`url(#${id}h)`} opacity={ks[i]} />)}
        </mask>
      </defs>
      <rect x={-20000} y={-20000} width={40000} height={40000} fill="#3a2a40" opacity={(sobre ? 0.7 : 1) * apaga * kmax} mask={`url(#${id}m)`} style={{ mixBlendMode: sobre ? undefined : "multiply" }} />
      {luces.map((l, i) => ks[i] > 0.001 && (
        <g key={i}>
          {!sobre && <ellipse cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} fill={`url(#${id}c)`} opacity={ks[i] * 0.95} style={{ mixBlendMode: "soft-light" }} />}
          <ellipse cx={l.x} cy={l.y} rx={l.rx * 0.9} ry={l.ry * 0.9} fill={`url(#${id}c)`} opacity={ks[i] * (sobre ? 0.16 : 0.22)} style={{ mixBlendMode: sobre ? undefined : "screen" }} />
        </g>
      ))}
    </g>
  );
};
