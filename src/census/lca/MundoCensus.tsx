// Comp de revisión del mundo Duluth (lc-a): set + encuadre + props del set por defaultProps; `elenco` pone al reparto.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Actor } from "../../anikit/actor";
import { mira } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { GUS, JUNE, PAL, THEO, THEO_MOCHI, JUNE_MOCHI } from "../elenco";
import { HudCenso } from "../hud";
import { Barrio, BARRIO_PISO, Living, LIV_PISO } from "../mundo/casa";
import { Lobby, StMarys } from "../mundo/hospital";
import { Panorama } from "../mundo/panorama";
import { CanalPark, Puente } from "../mundo/puente";
import { Superior } from "../mundo/superior";

const SETS: Record<string, React.FC<any>> = { panorama: Panorama, superior: Superior, puente: Puente, canal: CanalPark, stmarys: StMarys, lobby: Lobby, barrio: Barrio, living: Living };

export const MundoCensus: React.FC<{ set: string; x: number; y: number; zoom: number; sp?: Record<string, unknown>; elenco?: number; hud?: boolean }> = ({ set, x, y, zoom, sp = {}, elenco, hud }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Escena
      Set={SETS[set]} pal={PAL} setProps={sp} claves={[mira(0, x, y, zoom)]} mano={0}
      medio={elenco !== undefined ? <>
        <Actor look={THEO} ruta={[{ f: 0, x: elenco - 300, y: 900 }]} />
        <Actor look={JUNE_MOCHI} ruta={[{ f: 0, x: elenco, y: 900 }]} dir={[{ f: 0, v: -1 }]} />
        <Actor look={GUS} ruta={[{ f: 0, x: elenco + 300, y: 900 }]} dir={[{ f: 0, v: -1 }]} />
        <Actor look={THEO_MOCHI} ruta={[{ f: 0, x: elenco + 600, y: 900 }]} dir={[{ f: 0, v: -1 }]} />
      </> : undefined}
      hud={hud ? <HudCenso pob={2} seg={{ claves: 41, prefijo: "DAY ", icono: "dia" }} tachado="8,000,000,000" /> : undefined}
    />
  </AbsoluteFill>
);
