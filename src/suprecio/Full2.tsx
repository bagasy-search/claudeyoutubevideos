// suprecio · 60 → 962 s en un solo render: Rest (60-400) debajo, Rest2 (400-962) encima (fondo transparente).
// bg=true (por defecto) pone fondo negro; FinalPrecio lo apaga para superponer el minuto 1.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Rest } from "./Rest";
import { Rest2 } from "./Rest2";

export const Full2: React.FC<{ bg?: boolean }> = ({ bg = true }) => (
  <AbsoluteFill style={{ backgroundColor: bg ? "#000" : "transparent" }}>
    <Rest />
    <Rest2 />
  </AbsoluteFill>
);
