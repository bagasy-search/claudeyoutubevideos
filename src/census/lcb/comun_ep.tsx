// Ayudas compartidas por las escenas de lc03 / lc04.
import React from "react";
import { interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { Actor, ActorProps } from "../../anikit/actor";
import { BORDE_CALIDO } from "../elenco";

export const FPS = 30;
export const T = (s: number) => Math.round(s * FPS);
// cuadro LOCAL de un plano que empieza en el segundo global s0
export const loc = (s0: number) => (g: number) => Math.round((g - s0) * FPS);

// Actor con luz de borde cálida por defecto
export const A: React.FC<ActorProps> = (p) => <Actor luz={BORDE_CALIDO} {...p} />;

// claves de mirada / dirección cortas
export const quieto = (x: number, y: number) => [{ f: 0, x, y }];
export const der = [{ f: 0, v: 1 as const }];
export const izq = [{ f: 0, v: -1 as const }];

// Rótulo RECTO y limpio (reemplaza a TextoMano: nada de letras torcidas ni caligrafía ilegible).
// Misma firma que TextoMano; `rot` y `vel` se aceptan pero el texto entra derecho, palabra por palabra.
export const Rotulo: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; vel?: number; rot?: number; brillo?: boolean; centro?: boolean }> = ({ texto, x, y, desde, hasta, color = "#ffcf6e", tam = 64, brillo = true, centro }) => {
  const f = useF();
  if (f < desde) return null;
  const o = hasta ? interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  let i = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: centro ? "translateX(-50%)" : undefined, textAlign: centro ? "center" : undefined, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, lineHeight: 1.08, letterSpacing: tam * 0.02, color, opacity: o, whiteSpace: "pre",
      WebkitTextStroke: `${Math.max(3, tam * 0.07)}px rgba(14,10,18,0.92)`, paintOrder: "stroke fill",
      textShadow: `0 5px 0 rgba(10,8,14,0.85), 0 0 22px rgba(0,0,0,0.55)${brillo ? `, 0 0 28px ${color}55` : ""}` }}>
      {texto.split("\n").map((lin, r) => (
        <div key={r}>{lin.split(" ").map((w, j) => {
          const a = interpolate(f, [desde + i * 4, desde + i * 4 + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          i++;
          return <span key={j} style={{ display: "inline-block", opacity: a, transform: `translateY(${(1 - a) * 14}px) scale(${0.9 + 0.1 * a})` }}>{w}{j < lin.split(" ").length - 1 ? " " : ""}</span>;
        })}</div>
      ))}
    </div>
  );
};
