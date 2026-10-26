// Persona = Actor del kit + su CARTEL verde clavado sobre la cabeza (se calcula de la pose de cada cuadro).
import React from "react";
import { useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { Actor, ActorProps, estadoActor } from "../../anikit/actor";
import { CartelM, coronilla } from "../cartel";

export type CartelP = Omit<React.ComponentProps<typeof CartelM>, "x" | "y" | "f" | "fps"> & { dx?: number; dy?: number };
export type PersonaP = ActorProps & { cartel?: CartelP; carteles?: CartelP[] };

export const Persona: React.FC<PersonaP> = ({ cartel, carteles, ...a }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const lista = carteles ?? (cartel ? [cartel] : []);
  if (!lista.length) return <Actor {...a} />;
  const s = estadoActor(a, f, fps);
  const top = s.y - coronilla(s.esc, a.look.alto ?? 1, s.asiento) - 14;
  return (
    <>
      <Actor {...a} />
      {lista.map(({ dx = 0, dy = 0, ...c }, i) => <CartelM key={i} {...c} x={s.x + dx} y={top + dy} f={f} fps={fps} />)}
    </>
  );
};
