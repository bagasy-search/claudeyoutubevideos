// Prueba de sets de tz-b (sólo stills): cada plano = 60 cuadros con un set nuevo y sus personajes.
import React from "react";
import { AbsoluteFill } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Montaje } from "../anikit/montaje";
import { LEO, MARA, PAL, PAL_ANT, TENZO } from "./elenco";
import { CHICA_KIMONO, EKIDO, GRANJERO, JINETE, MAYA, TANZAN } from "./elenco_b";
import { Caballo, CABALLO_LOMO } from "./sets/caballo";
import { CaminoChina, CHINA_PISO, CHINA_PUNTOS } from "./sets/caminoChina";
import { CaminoMontana, JAPON_PISO, PortonMonasterio, PORTON, RIO, RioCrecido, RioFrente } from "./sets/rioJapon";
import { Colectivo36, COLECTIVO, COLECTIVO_PISO, FachadaWilson, PasilloWilson, WILSON, WILSON_PISO } from "./sets/wilson";

const luzC = { lado: 1 as const, color: "#ffd890", fuerza: 0.8 };

const China: React.FC = () => {
  const f = useF();
  const P = CHINA_PISO;
  const hx = 900 + f * 12;
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 1400, 640, 0.85)]}
      medio={<>
        <Actor look={GRANJERO} escala={1.1} seed={1} luz={luzC} ruta={[{ f: 0, x: CHINA_PUNTOS.granjero, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "pensar" }]} caras={[{ f: 0, v: "sorpresa" }]} />
        <Caballo x={hx} piso={P + 20} fase={(f % 14) / 14} />
        <Actor look={JINETE} escala={1.0} seed={2} luz={luzC} ruta={[{ f: 0, x: 900, y: P + 20 - 234 }, { f: 60, x: 900 + 720, y: P + 20 - 234, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 0 }]}
          poses={[{ f: 0, v: { tronco: 18, pI: 80, rI: 70, pD: 80, rD: 70, hD: 70, cD: 30, hI: 70, cI: 30 } }]} caras={[{ f: 0, v: "miedo" }]} />
      </>} />
  );
};

const Rio: React.FC = () => {
  const f = useF();
  const P = JAPON_PISO;
  return (
    <Escena Set={RioCrecido} pal={PAL_ANT} claves={[mira(0, 1600, 640, 0.8)]}
      medio={<>
        <Actor look={EKIDO} escala={1.1} seed={3} luz={luzC} ruta={[{ f: 0, x: 700, y: P - 40 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "enojo" }]} />
        <Actor look={TANZAN} escala={1.1} seed={4} luz={luzC} ruta={[{ f: 0, x: 1500, y: P + RIO.hundir }]} poses={[{ f: 0, v: { hD: 80, cD: 60, hI: 80, cI: 60 } }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={CHICA_KIMONO} escala={1.0} seed={5} luz={luzC} ruta={[{ f: 0, x: 950, y: P - 40 }]} caras={[{ f: 0, v: "triste" }]} />
        <RioFrente f={f} />
      </>} />
  );
};

const Montana: React.FC = () => {
  const P = JAPON_PISO;
  return (
    <Escena Set={CaminoMontana} pal={PAL_ANT} claves={[mira(0, 1400, 620, 0.85)]}
      medio={<>
        <Actor look={TANZAN} escala={1.1} seed={4} luz={luzC} ruta={[{ f: 0, x: 1200, y: P }, { f: 60, x: 1500, y: P }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={EKIDO} escala={1.1} seed={3} luz={luzC} ruta={[{ f: 0, x: 900, y: P }, { f: 60, x: 1200, y: P }]} caras={[{ f: 0, v: "enojo" }]} />
      </>} />
  );
};

const Porton: React.FC = () => {
  const P = JAPON_PISO;
  return (
    <Escena Set={PortonMonasterio} pal={PAL_ANT} setProps={{ hora: 1 }} claves={[mira(0, PORTON.x, 600, 0.85)]}
      medio={<>
        <Actor look={EKIDO} escala={1.1} seed={3} luz={luzC} ruta={[{ f: 0, x: 1350, y: P + 60 }]} poses={[{ f: 0, v: "señalar" }]} caras={[{ f: 0, v: "enojo" }]} />
        <Actor look={TANZAN} escala={1.1} seed={4} luz={luzC} ruta={[{ f: 0, x: 1800, y: P + 60 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "sorpresa" }]} />
      </>} />
  );
};

const Pasillo: React.FC = () => {
  const f = useF();
  const P = WILSON_PISO;
  return (
    <Escena Set={PasilloWilson} pal={PAL} setProps={{ apertura: Math.min(1, f / 40) }} claves={[mira(0, WILSON.puerta + 100, 640, 0.95)]}
      medio={<>
        <Actor look={LEO} escala={1.15} seed={6} luz={{ lado: -1, color: "#4f8ae8", fuerza: 0.9 }} ruta={[{ f: 0, x: WILSON.leo, y: P }]} caras={[{ f: 0, v: "sorpresa" }]} />
        <Actor look={TENZO} escala={1.15} seed={7} luz={{ lado: -1, color: "#ffc46a", fuerza: 1 }} ruta={[{ f: 0, x: WILSON.tenzo, y: P }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} />
      </>} />
  );
};

const Fachada: React.FC = () => <Escena Set={FachadaWilson} pal={PAL} claves={[mira(0, 1650, 560, 0.85)]} />;

const Bus: React.FC = () => {
  const P = COLECTIVO_PISO;
  return (
    <Escena Set={Colectivo36} pal={PAL} claves={[mira(0, 1450, 620, 1.0)]}
      medio={<>
        <Actor look={LEO} escala={1.15} seed={6} luz={{ lado: 1, color: "#eef2f6", fuerza: 0.6 }} ruta={[{ f: 0, x: COLECTIVO.asientoLeo, y: P }]} asiento={[{ f: 0, v: COLECTIVO.asiento }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "feliz" }]} />
        <Actor look={MAYA} escala={1.1} seed={8} luz={{ lado: -1, color: "#eef2f6", fuerza: 0.6 }} ruta={[{ f: 0, x: COLECTIVO.asientoMaya, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: COLECTIVO.asiento }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "risa" }]} />
      </>} />
  );
};

const Mara1: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={CaminoChina} pal={PAL_ANT} claves={[mira(0, 1400, 640, 0.85)]}
      medio={<Caballo x={700 + f * 12} piso={CHINA_PISO + 20} fase={(f % 14) / 14} variante="mara" s={1.2} />} />
  );
};

export const TzbPrueba: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={[
      { dur: 60, el: <China /> }, { dur: 60, el: <Rio /> }, { dur: 60, el: <Montana /> }, { dur: 60, el: <Porton /> },
      { dur: 60, el: <Pasillo /> }, { dur: 60, el: <Fachada /> }, { dur: 60, el: <Bus /> }, { dur: 60, el: <Mara1 /> },
    ]} />
  </AbsoluteFill>
);
export const TZB_PRUEBA_DUR = 480;
// silencia imports no usados en algunos planos
void MARA; void CABALLO_LOMO;
