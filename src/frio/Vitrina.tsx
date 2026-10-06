// VITRINA de componentes de "Archivos del Frío" — para juzgar el KIT, separado del montaje.
// 11 familias. Cada momento de componente del guion (30 en total) entra en una de éstas.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { MapaDistancia } from "./Mapa";
import { CorteSuelo, CuadernoCargas, TresTermometros, DosCanos } from "./Componentes";
import { CitaCuaderno, LineaTiempo, ListaExpediente, BarrasComparadas, CuentaQueNoCierra, PlantaMedidas } from "./Componentes2";
import { Grain } from "./Piezas";

export const FPS = 30;
const D = 5 * FPS;
const PIEZAS = 11;
export const TOTAL_VITRINA = D * PIEZAS;

const P: React.FC<{ i: number; children: React.ReactNode; nombre: string }> = ({ i, children, nombre }) => (
  <Sequence from={D * i} durationInFrames={D} name={nombre}>{children}</Sequence>
);

export const Vitrina: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#07090D" }}>
    <P i={0} nombre="1-mapa">
      <MapaDistancia origen="Cañadón Seco de las Lajas" destino="Colonia Sarmiento" cifra="41" unidad=" km" pie="dos días de carro" dur={D} />
    </P>

    <P i={1} nombre="2-corte">
      <CorteSuelo dur={D} titulo="LO QUE PASA ABAJO" capas={[
        { prof: "20 cm", temp: "−15°", nota: "siente el día y la noche", color: "#D8C8A2" },
        { prof: "50 cm", temp: "−4°", nota: "ya no existe la noche", color: "#BFA87C" },
        { prof: "1 m", temp: "+2°", nota: "el invierno llega tarde", color: "#8E7649" },
        { prof: "1,80 m", temp: "+8°", nota: "el promedio anual", color: "#4A3E28" },
      ]} />
    </P>

    <P i={2} nombre="3-cuaderno">
      <CuadernoCargas dur={D} total={174} pie="CARGAS DE CARRETILLA" filas={[
        { dia: "28 de abril", n: 7 }, { dia: "29", n: 9 }, { dia: "30", n: 12 },
        { dia: "1 de mayo", n: 4, nota: "piedra" }, { dia: "2", n: 2, nota: "piedra grande, todo el día" },
        { dia: "3", n: 11 }, { dia: "4", n: 14 }, { dia: "5", n: 0, nota: "lluvia" },
        { dia: "6", n: 0, nota: "lluvia. Milena tos" },
      ]} />
    </P>

    <P i={3} nombre="4-termometros">
      <TresTermometros dur={D} medidas={[
        { donde: "afuera", valor: -11 }, { donde: "el granero", valor: -6 }, { donde: "la cámara", valor: 14 },
      ]} />
    </P>

    <P i={4} nombre="5-canos"><DosCanos dur={D} /></P>

    <P i={5} nombre="6-cita">
      <CitaCuaderno dur={D} fecha="28 de abril de 1899"
        texto="Abajo, la tierra no sabe qué mes es."
        atribucion="Elías Bordagaray, 1894" />
    </P>

    <P i={6} nombre="7-linea">
      <LineaTiempo dur={D} titulo="el invierno del 99" hitos={[
        { cuando: "28 jun", que: "primera nevada" },
        { cuando: "9 jul", que: "el tapón de hielo" },
        { cuando: "9 ago", que: "la tormenta" },
        { cuando: "3 sep", que: "aparece Ceferino" },
        { cuando: "21 sep", que: "sale el sol" },
      ]} />
    </P>

    <P i={7} nombre="8-inventario">
      <ListaExpediente dur={D} titulo="lo que le quedaba" pie="25 de abril de 1899" items={[
        { que: "harina", cuanto: "11 kg" },
        { que: "azúcar", cuanto: "4,5 kg" },
        { que: "yerba", cuanto: "2 kg" },
        { que: "querosén", cuanto: "un cuarto" },
        { que: "velas de sebo", cuanto: "7" },
        { que: "papas", cuanto: "30 kg" },
      ]} />
    </P>

    <P i={8} nombre="9-barras">
      <BarrasComparadas dur={D} titulo="la majada de Ceferino" barras={[
        { rotulo: "a su cargo", valor: 420 },
        { rotulo: "vivas en septiembre", valor: 41, acento: true },
      ]} />
    </P>

    <P i={9} nombre="10-cuenta">
      <CuentaQueNoCierra dur={D}
        pierde={{ valor: 1200, unidad: " W", rotulo: "lo que el cuerpo pierde" }}
        produce={{ valor: 80, unidad: " W", rotulo: "lo que el cuerpo produce" }}
        veredicto="La cuenta no cierra. La reserva son dos horas." />
    </P>

    <P i={10} nombre="11-planta">
      <PlantaMedidas dur={D} titulo="el granero" ancho="10 metros" alto="6 metros"
        nota="piso de tablones sobre durmientes"
        interior={{ ancho: "2,40 m", alto: "1,80 m", rotulo: "la cámara" }} />
    </P>

    <Grain opacity={0.10} />
  </AbsoluteFill>
);
