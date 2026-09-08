// VITRINA de componentes de "Archivos del Frío" — sólo para que el creador juzgue el KIT,
// separado del montaje. No va al video final.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { MapaDistancia } from "./Mapa";
import { CorteSuelo, CuadernoCargas, TresTermometros, DosCanos } from "./Componentes";
import { Grain } from "./Piezas";

export const FPS = 30;
const D = 5 * FPS; // 5 s por pieza
export const TOTAL_VITRINA = D * 5;

export const Vitrina: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#07090D" }}>
    <Sequence from={0} durationInFrames={D} name="mapa">
      <MapaDistancia
        origen="Cañadón Seco de las Lajas"
        destino="Colonia Sarmiento"
        cifra="41"
        unidad=" km"
        pie="dos días de carro"
        dur={D}
      />
    </Sequence>

    <Sequence from={D} durationInFrames={D} name="corte">
      <CorteSuelo
        dur={D}
        titulo="LO QUE PASA ABAJO"
        capas={[
          { prof: "20 cm", temp: "−15°", nota: "siente el día y la noche", color: "#D8C8A2" },
          { prof: "50 cm", temp: "−4°", nota: "ya no existe la noche", color: "#BFA87C" },
          { prof: "1 m", temp: "+2°", nota: "el invierno llega tarde", color: "#8E7649" },
          { prof: "1,80 m", temp: "+8°", nota: "el promedio anual, todo el año", color: "#4A3E28" },
        ]}
      />
    </Sequence>

    <Sequence from={D * 2} durationInFrames={D} name="cuaderno">
      <CuadernoCargas
        dur={D}
        total={174}
        pie="CARGAS DE CARRETILLA"
        filas={[
          { dia: "28 de abril", n: 7 },
          { dia: "29", n: 9 },
          { dia: "30", n: 12 },
          { dia: "1 de mayo", n: 4, nota: "piedra" },
          { dia: "2", n: 2, nota: "piedra grande, todo el día" },
          { dia: "3", n: 11 },
          { dia: "4", n: 14 },
          { dia: "5", n: 0, nota: "lluvia" },
          { dia: "6", n: 0, nota: "lluvia. Milena tos" },
        ]}
      />
    </Sequence>

    <Sequence from={D * 3} durationInFrames={D} name="termometros">
      <TresTermometros
        dur={D}
        medidas={[
          { donde: "afuera", valor: -11 },
          { donde: "el granero", valor: -6 },
          { donde: "la cámara", valor: 14 },
        ]}
      />
    </Sequence>

    <Sequence from={D * 4} durationInFrames={D} name="canos">
      <DosCanos dur={D} />
    </Sequence>

    <Grain opacity={0.10} />
  </AbsoluteFill>
);
