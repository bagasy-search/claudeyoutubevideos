// MUESTRARIO DEL MUNDO DE OWEN: un plano de 2 s por set, para revisar con stills (no va a ningún video).
import React from "react";
import { mira } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Montaje } from "../anikit/montaje";
import { EtiquetaFlotante, MarcaCorto, RelojDia, Contador } from "../anikit/pantalla";
import { PAL, OWEN, OWEN_CASA, ROSA, TINY, HALE, ABERNATHY, TEEN, LENA, VERDE } from "./elenco";
import { BusInterior, Bus9, Volante, BUS_PISO, BUS_PUNTOS, ASIENTO_X, alVolante } from "./mundo/bus";
import { Ashland, ASH_PISO, ASH_CARRIL } from "./mundo/ashland";
import { TwoFlatCorte, TwoFlatFuera, TF_PISO, TF_ARRIBA, TF_PUNTOS } from "./mundo/twoflat";
import { Garaje, GAR_PISO, GAR_PUNTOS } from "./mundo/garaje";
import { Halden, HAL_PISO, HAL_PUNTOS, Formulario } from "./mundo/halden";
import { AdnCpG, DosRelojes, Dinamometro, Cigarrillos, ListaDia, Pizarra, MensajeCel } from "./ciencia";

const D = 60;
const ESC = 1.0;

const BusDentro: React.FC = () => (
  <Escena Set={BusInterior} pal={PAL} setProps={{ hora: "manana", avance: (f: number) => f * 16, paradas: [{ a: 600, num: 4 }] }}
    claves={[mira(0, 900, 600, 1.1)]}
    medio={<>
      <Actor look={OWEN} escala={ESC} seed={1} ruta={[{ f: 0, x: BUS_PUNTOS.chofer, y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} ajuste={alVolante(BUS_PUNTOS.chofer, ESC)} caras={[{ f: 0, v: "duda" }]} />
      <Volante />
      <Actor look={ABERNATHY} escala={ESC} seed={2} ruta={[{ f: 0, x: ASIENTO_X(4), y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} caras={[{ f: 0, v: "feliz" }]} />
      <Actor look={TEEN} escala={ESC} seed={3} ruta={[{ f: 0, x: ASIENTO_X(2), y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "cansado" }]} />
    </>}
    hud={<>
      <EtiquetaFlotante x={ASIENTO_X(4)} y={BUS_PISO - 330} rotulo="REAL AGE" claves={58} />
      <RelojDia min={7 * 60 + 40} />
      <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: "47/47", color: VERDE }]} />
      <MarcaCorto />
    </>}
  />
);

const Calle: React.FC = () => (
  <Escena Set={Ashland} pal={PAL} setProps={{ hora: "dia", centro: (f: number) => 1200 + f * 10, cafe: 1800, paradas: [{ x: 900, num: 18, refugio: true }] }}
    claves={[mira(0, 1200, 640, 0.6), mira(D, 1800, 640, 0.6)]}
    medio={<>
      <Bus9 x={1200} y={ASH_CARRIL} esc={0.5} hora="dia" />
      <Actor look={LENA} escala={ESC} seed={4} ruta={[{ f: 0, x: 2350, y: ASH_PISO - 150 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "saludar" }]} caras={[{ f: 0, v: "feliz" }]} />
    </>}
  />
);

const CasaCorte: React.FC = () => (
  <Escena Set={TwoFlatCorte} pal={PAL} setProps={{ hora: "alba" }} claves={[mira(0, 1000, 600, 0.55)]}
    medio={<>
      <Actor look={ROSA} escala={ESC} seed={5} ruta={[{ f: 0, x: TF_PUNTOS.cocina + 60, y: TF_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "feliz" }]} />
      <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: TF_PUNTOS.espejo - 40, y: TF_ARRIBA }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "cansado" }]} />
    </>}
  />
);

const CasaFuera: React.FC = () => <Escena Set={TwoFlatFuera} pal={PAL} setProps={{ hora: "alba" }} claves={[mira(0, 1000, 560, 0.6)]} />;

const Gar: React.FC = () => (
  <Escena Set={Garaje} pal={PAL} setProps={{ hora: "alba" }} claves={[mira(0, 900, 600, 0.7)]}
    medio={<>
      <Actor look={TINY} escala={ESC * 1.1} seed={7} ruta={[{ f: 0, x: GAR_PUNTOS.ventanilla, y: GAR_PISO - 60 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "señalar" }]} caras={[{ f: 0, v: "picaro" }]} />
      <Actor look={OWEN} escala={ESC} seed={1} ruta={[{ f: 0, x: GAR_PUNTOS.mostrador + 140, y: GAR_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "cansado" }]} />
    </>}
  />
);

const Clinica: React.FC = () => (
  <Escena Set={Halden} pal={PAL} setProps={{ hora: "manana" }} claves={[mira(0, 1000, 600, 0.6)]}
    medio={<>
      <Actor look={HALE} escala={ESC} seed={8} ruta={[{ f: 0, x: HAL_PUNTOS.recepcion, y: HAL_PISO - 40 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "hablar" }]} caras={[{ f: 0, v: "feliz" }]} />
      <Actor look={OWEN_CASA} escala={ESC} seed={6} ruta={[{ f: 0, x: HAL_PUNTOS.silla - 140, y: HAL_PISO }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 120 }]} caras={[{ f: 0, v: "duda" }]} />
    </>}
    hud={<svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Formulario x={1640} y={820} s={0.9} firma={0.6} rot={-6} /></svg>}
  />
);

const Cel: React.FC = () => <Pizarra><MensajeCel de="Dr. Imani Hale" texto={"Owen, one participant\nhas left the study."} extra="PARTICIPANTS 46/47" /></Pizarra>;

export const MundoOwen: React.FC = () => (
  <Montaje planos={[
    { dur: D, el: <BusDentro /> },
    { dur: D, el: <Calle /> },
    { dur: D, el: <CasaCorte /> },
    { dur: D, el: <CasaFuera /> },
    { dur: D, el: <Gar /> },
    { dur: D, el: <Clinica /> },
    { dur: 120, el: <AdnCpG /> },
    { dur: 90, el: <DosRelojes cal={29} bio={47} /> },
    { dur: 120, el: <Dinamometro /> },
    { dur: 90, el: <Cigarrillos /> },
    { dur: 120, el: <ListaDia items={["5 h sleep", "12 h sitting", "3 energy drinks", "microwave at 11 p.m."]} /> },
    { dur: 120, el: <Cel /> },
  ]} />
);
