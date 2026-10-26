// Prueba de sets y del cartel (stills de revisión de la sesión B).
import React from "react";
import { AbsoluteFill } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { PAL, OWEN, OWEN_CASA, ROSA, DEE, RIM, ABRIGO } from "../elenco";
import { DELPHINE } from "../extras_b";
import { Persona } from "./gente";
import { HudSerie } from "../cartel";
import { Plasma, PLA_PISO, PLA_PUNTOS, Aferesis } from "../mundo/plasma";
import { Living, LIV_PISO, LIV_PUNTOS, Descanso, DES_PISO, DES_PUNTOS, CajaDonas } from "../mundo/sala";
import { BusInterior, BUS_PISO, BUS_PUNTOS, ASIENTO_X, alVolante, Volante } from "../mundo/bus";
import { TwoFlatCorte, TF_PISO, TF_ARRIBA, TF_PUNTOS } from "../mundo/twoflat";

const SETS = ["bus", "plasma", "living", "descanso", "corte"];
export const PruebaB: React.FC = () => {
  const f0 = useF();
  const set = SETS[Math.min(4, Math.floor(f0 / 60))];
  const f = f0 % 60 + 40;
  if (set === "plasma") return (
    <Escena Set={Plasma} pal={PAL} claves={[mira(0, 1100, 640, 0.75)]} setProps={{ hora: "ocaso" }}
      medio={<>
        <Persona look={OWEN_CASA} ruta={[{ f: 0, x: PLA_PUNTOS.sillon[0] - 10, y: PLA_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: PLA_PUNTOS.asiento }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "cansado" }]} luz={RIM.clinica}
          cartel={{ claves: 4700, rotulo: "OWEN" }} />
        <Aferesis x={PLA_PUNTOS.sillon[0]} piso={PLA_PISO} brazo={{ x: PLA_PUNTOS.sillon[0] - 40, y: PLA_PISO - 170 }} lleno={0.6} f={f} />
      </>} hud={<HudSerie part={[{ f: 0, v: 44 }]} hora={17 * 60 + 40} />} />
  );
  if (set === "living") return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1000, 600, 0.85)]} setProps={{ hora: "noche" }}
      medio={<>
        <Persona look={DEE} ruta={[{ f: 0, x: LIV_PUNTOS.sofa - 120, y: LIV_PISO }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]} poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "cansado" }]} luz={RIM.noche} cartel={{ claves: 666, icono: "reloj", texto: "11h 06m" }} />
        <Persona look={OWEN_CASA} ruta={[{ f: 0, x: LIV_PUNTOS.sofa + 140, y: LIV_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: LIV_PUNTOS.asiento }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "miedo" }]} luz={RIM.noche} />
      </>} />
  );
  if (set === "descanso") return (
    <Escena Set={Descanso} pal={PAL} claves={[mira(0, 1000, 600, 0.85)]} setProps={{ hora: "alba" }}
      medio={<><CajaDonas x={DES_PUNTOS.mesa} y={DES_PISO - 220} n={4} caja={0.7} />
        <Persona look={OWEN} ruta={[{ f: 0, x: DES_PUNTOS.mesa - 330, y: DES_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "picaro" }]} luz={RIM.tubo} cartel={{ claves: 0, icono: "panza", texto: "ANYTHING" }} /></>} />
  );
  if (set === "bus") return (
    <Escena Set={BusInterior} pal={PAL} claves={[mira(0, 1100, 640, 0.75)]} setProps={{ hora: "manana", avance: (ff: number) => ff * 14 }}
      medio={<>
        <Persona look={OWEN} ruta={[{ f: 0, x: BUS_PUNTOS.chofer, y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} poses={[{ f: 0, v: "sentado" }]} ajuste={alVolante(BUS_PUNTOS.chofer, 1)} luz={RIM.tubo} cartel={{ claves: 4700, rotulo: "OWEN" }} />
        <Volante />
        <Persona look={DELPHINE} ruta={[{ f: 0, x: ASIENTO_X(2), y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} poses={[{ f: 0, v: "sentado" }]} luz={RIM.tubo} cartel={{ claves: 2900000, rotulo: "MRS. WARD" }} />
        <Persona look={ABRIGO} ruta={[{ f: 0, x: ASIENTO_X(4), y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} poses={[{ f: 0, v: "sentado" }]} luz={RIM.tubo} cartel={{ claves: 0, parpadeo: 0.8 }} />
      </>} hud={<HudSerie part={[{ f: 0, v: 44 }]} hora={6 * 60 + 10} />} />
  );
  return (
    <Escena Set={TwoFlatCorte} pal={PAL} claves={[mira(0, 900, 560, 0.7)]} setProps={{ hora: "alba" }}
      medio={<>
        <Persona look={ROSA} ruta={[{ f: 0, x: TF_PUNTOS.cocina + 80, y: TF_PISO }]} luz={RIM.cocina} cartel={{ claves: 1960000, rotulo: "ROSA" }} />
        <Persona look={OWEN_CASA} ruta={[{ f: 0, x: TF_PUNTOS.espejo - 120, y: TF_ARRIBA }]} dir={[{ f: 0, v: 1 }]} luz={RIM.alba} cartel={{ claves: 4700 }} />
      </>} />
  );
};
