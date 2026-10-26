// Escena: un set + cámara + actores en 3 profundidades, en UNA línea. Es la unidad que va dentro de Montaje.
//   lejos  (z 0,25 · cocina 0,85) → cielo / vista: se mueve poco y apenas desenfocado (máx 3 px, NUNCA más)
//   medio  (z 1)                  → set + `medio` (actores y utilería en coordenadas del mundo): NÍTIDO
//   frente (z 1,4)                → lo del set que pasa por delante + `frente` (manos, barrotes, lluvia)
//   hud                           → recursos de pantalla FUERA de la cámara (contadores, globos, texto a mano)
import React from "react";
import { AbsoluteFill } from "remotion";
import { CapaSVG, Clave, Plano, useF } from "./camara";
import { Paleta } from "./paletas";
import { conMomento, Momento, palMomento } from "./momento";

export type EscenaProps = {
  Set: React.FC<any>; pal: Paleta; claves: Clave[]; setProps?: Record<string, unknown>;
  medio?: React.ReactNode; frente?: React.ReactNode; detras?: React.ReactNode; hud?: React.ReactNode;
  mano?: number; seed?: number; zLejos?: number; fondo?: string;
  tiempo?: (f: number) => number; // reloj del SET (cámara lenta / tiempo detenido: el mundo se frena, el héroe no)
  momento?: Momento; // "noche" | "lluvia" | "amanecer": el mismo set a otra hora (ver momento.tsx)
};

export const Escena: React.FC<EscenaProps> = ({ Set, pal, claves, setProps = {}, medio, frente, detras, hud, mano = 3, seed = 0, zLejos = 0.25, fondo, tiempo, momento }) => {
  const f = useF();
  const S = momento ? conMomento(Set, momento) : Set;
  const P = momento ? palMomento(pal, momento) : pal;
  const sp = { f: tiempo ? tiempo(f) : f, pal, ...setProps };
  return (
    <AbsoluteFill>
      <Plano claves={claves} mano={mano} seed={seed} fondo={fondo ?? P.cielo[0]}>
        <CapaSVG z={zLejos} desenfoqueMax={3}><S capa="lejos" {...sp} /></CapaSVG>
        <CapaSVG z={1}>
          <S capa="medio" {...sp} />
          {detras}
          {medio}
        </CapaSVG>
        <CapaSVG z={1.4} desenfoqueMax={5}>
          <S capa="frente" {...sp} />
          {frente}
        </CapaSVG>
      </Plano>
      {hud}
    </AbsoluteFill>
  );
};
