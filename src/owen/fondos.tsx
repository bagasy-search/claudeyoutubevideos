// 26-oct (evaluador independiente): la «placa azul + Owen parado al costado» queda prohibida.
// El dato de ciencia pasa DENTRO del mundo: un set vivo (bus andando, cocina de Rosa, garaje, clínica Halden)
// con Owen actuando en el tercio derecho y la gente del set haciendo lo suyo detrás del dato.
import React from "react";
import { mira } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { EXPRESIONES } from "../anikit/personaje";
import { PAL, OWEN, ROSA, TINY, HALE, OWEN_CASA, SENORA, ESTUDIANTE, OBRERO } from "./elenco";
import { BusInterior, BUS_PISO, ASIENTO_X } from "./mundo/bus";
import { TwoFlatCorte, TF_PISO, TF_PUNTOS } from "./mundo/twoflat";
import { Garaje, GAR_PISO, GAR_PUNTOS } from "./mundo/garaje";
import { Halden, HAL_PISO, HAL_PUNTOS } from "./mundo/halden";
import { Pasajero } from "./ob01/base";

export type SetPz = "bus" | "cocina" | "garaje" | "halden";
export const SETS_PZ: SetPz[] = ["bus", "cocina", "garaje"]; // la clínica queda fuera: su tablet de decorado se cortaba en el borde
export const setDe = (clave: string): SetPz => {
  let h = 7;
  for (const c of clave) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return SETS_PZ[h % SETS_PZ.length];
};

const Z = 2.6;
const SIT = { pI: 88, rI: 88, pD: 92, rD: 92 };
const BOSTEZO = { ...SIT, tronco: -8, hD: 150, cD: 30, hI: 150, cI: 30, cabeza: -12 };
const COME = { hD: 60, cD: 150, cabeza: 6 };
const ESCRIBE = { hD: 80, cD: 60, hI: 70, cI: 70, tronco: 8, cabeza: 10 };
const REVUELVE = (a: number) => ({ hD: 70 + a, cD: 90, hI: 60, cI: 60, tronco: 10, cabeza: 12 });
const POSES = ["señalar", "hablar", "pensar", "señalar", "manosCintura", "hablar", "encogerse", "señalar"];
const CARAS = ["neutral", "feliz", "pensar", "sorpresa", "neutral", "feliz"];

// Owen explicando DENTRO del set: camina dos pasos, señala el dato (a su izquierda), cambia cara y pose en cada beat
const OwenExplica: React.FC<{ x: number; piso: number; look?: typeof OWEN }> = ({ x, piso, look = OWEN }) => {
  const per = 22;
  const poses = Array.from({ length: 90 }).map((_, i) => ({ f: i * per, v: POSES[(i * 3) % POSES.length] }));
  const caras = Array.from({ length: 90 }).map((_, i) => ({ f: i * per + 6, v: CARAS[i % CARAS.length] in EXPRESIONES ? CARAS[i % CARAS.length] : "neutral" }));
  const ruta = Array.from({ length: 24 }).flatMap((_, i) => [{ f: i * 120 + 40, x: i % 2 ? x + 30 : x - 30, y: piso }, { f: i * 120 + 100, x: i % 2 ? x - 30 : x + 30, y: piso }]);
  const dir = Array.from({ length: 24 }).map((_, i) => ({ f: i * 120 + 40, v: (i % 2 ? -1 : 1) as 1 | -1 }));
  return (
    <Actor look={look} escala={1} seed={9} ruta={[{ f: 0, x: x + 30, y: piso }, ...ruta]} dir={[{ f: 0, v: -1 }, ...dir]} poses={poses} caras={caras}
      habla={Array.from({ length: 60 }).map((_, i) => [i * 45 + 4, i * 45 + 34] as [number, number])}
      miradas={[{ f: 0, v: { x: -0.7, y: -0.3 } }, { f: 150, v: { x: 0.4, y: 0.2 } }, { f: 200, v: { x: -0.7, y: -0.3 } }, { f: 400, v: { x: 0.3, y: 0 } }, { f: 440, v: { x: -0.7, y: -0.3 } }]} />
  );
};

// alguien del set con su propia rutina (revuelve la olla, come, escribe en la tablet): cambia de pose cada ~1 s
const Rutina: React.FC<{ look: typeof OWEN; x: number; piso: number; poses: (string | Record<string, number>)[]; dir?: 1 | -1; seed?: number; asiento?: number }> = ({ look, x, piso, poses, dir = 1, seed = 4, asiento }) => (
  <Actor look={look} escala={1} seed={seed} ruta={[{ f: 0, x, y: piso }]} dir={[{ f: 0, v: dir }]}
    poses={Array.from({ length: 120 }).map((_, i) => ({ f: i * 28, v: poses[i % poses.length] }))}
    caras={Array.from({ length: 60 }).map((_, i) => ({ f: i * 56 + 10, v: ["neutral", "feliz", "pensar", "neutral"][i % 4] }))}
    asiento={asiento !== undefined ? [{ f: 0, v: asiento }] : undefined} />
);

// cámara: Owen queda en x≈1650 de pantalla y el piso cerca del borde de abajo; empuje lento (cámara con motivo, no flotado)
const cam = (ox: number, piso: number) => {
  // plano medio: los pies salen por abajo (piso en y≈1120 de pantalla) y el techo con sus carteles queda fuera de cuadro
  const cx = ox - 600 / Z, cy = piso - 580 / Z; // Owen en x≈1560: entero aunque camine
  return [mira(0, cx, cy, Z), mira(900, cx - 20, cy + 6, Z * 1.04, { curva: "inout" })];
};

export const FondoMundo: React.FC<{ set: SetPz; conOwen: boolean }> = ({ set, conOwen }) => {
  if (set === "bus") {
    const ox = 1500;
    return (
      <Escena Set={BusInterior} pal={PAL} claves={cam(ox, BUS_PISO)} seed={3} setProps={{ hora: "manana", avance: (f: number) => 9000 + f * 12 }}
        medio={<>
                              {conOwen && <OwenExplica x={ox} piso={BUS_PISO} />}
        </>} />
    );
  }
  if (set === "cocina") {
    const ox = TF_PUNTOS.heladera - 40;
    return (
      <Escena Set={TwoFlatCorte} pal={PAL} claves={cam(ox, TF_PISO)} seed={4} setProps={{ hora: "manana", luzCocina: true }}
        medio={<>
                    {conOwen && <OwenExplica x={ox} piso={TF_PISO} look={OWEN_CASA} />}
        </>} />
    );
  }
  if (set === "garaje") {
    const ox = GAR_PUNTOS.mostrador + 260;
    return (
      <Escena Set={Garaje} pal={PAL} claves={cam(ox, GAR_PISO)} seed={6} setProps={{ hora: "alba" }}
        medio={<>
                    {conOwen && <OwenExplica x={ox} piso={GAR_PISO} />}
        </>} />
    );
  }
  const ox = HAL_PUNTOS.camilla + 120;
  return (
    <Escena Set={Halden} pal={PAL} claves={cam(ox, HAL_PISO)} seed={8} setProps={{ hora: "manana" }}
      medio={<>
                {conOwen && <OwenExplica x={ox} piso={HAL_PISO} />}
      </>} />
  );
};
