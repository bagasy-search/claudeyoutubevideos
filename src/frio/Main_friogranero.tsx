// VIDEO COMPLETO `friogranero` — canal "Archivos del Frío", 52,4 min.
// Capas: clip animado / foto con movimiento / componente del kit / avatar.
// El audio es UN solo <Audio> con el máster (voz del avatar + cola de Fish clonada de él).
// ⛔ Todo video va con OffthreadVideo (en Piezas.tsx). Nunca <Video>.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Plate, Clip, Avatar, FichaDato, Grain, Mov } from "./Piezas";
import { MapaDistancia } from "./Mapa";
import { CorteSuelo, CuadernoCargas, TresTermometros, DosCanos } from "./Componentes";
import { CitaCuaderno, LineaTiempo, ListaExpediente, BarrasComparadas, CuentaQueNoCierra, PlantaMedidas } from "./Componentes2";
import BEATS from "./beats_full.json";
import DATOS from "./componentes_datos.json";

export const FPS = 30;
export const TOTAL_FRAMES: number = (BEATS as Beat[]).length
  ? Math.round(((BEATS as Beat[])[(BEATS as Beat[]).length - 1].ms + (BEATS as Beat[])[(BEATS as Beat[]).length - 1].dur) * FPS)
  : 30;
const AUDIO = "friogranero.m4a";

type Beat = {
  id: string; ms: number; dur: number; mov: Mov; archivo?: boolean;
  kind: "plate" | "clip" | "avatar" | "comp";
  src?: string; fadeIn?: number; desde?: number;
};
type Dato = Record<string, any>;

const sec = (s: number) => Math.round(s * FPS);

const Componente: React.FC<{ id: string; dur: number }> = ({ id, dur }) => {
  const d = (DATOS as Record<string, Dato>)[id];
  if (!d) return null;
  switch (d.kind) {
    case "mapa": return <MapaDistancia origen={d.origen} destino={d.destino} cifra={d.cifra} unidad={d.unidad} pie={d.pie} dur={dur} />;
    case "ficha": return <FichaDato cifra={d.cifra} unidad={d.unidad} pie={d.pie} bed={d.bed} dur={dur} />;
    case "corte": return <CorteSuelo dur={dur} titulo={d.titulo} capas={d.capas} />;
    case "cuaderno": return <CuadernoCargas dur={dur} filas={d.filas} total={d.total} pie={d.pie} />;
    case "termometros": return <TresTermometros dur={dur} medidas={d.medidas} />;
    case "canos": return <DosCanos dur={dur} />;
    case "cita": return <CitaCuaderno dur={dur} texto={d.texto} fecha={d.fecha} atribucion={d.atribucion} />;
    case "linea": return <LineaTiempo dur={dur} titulo={d.titulo} hitos={d.hitos} />;
    case "inventario": return <ListaExpediente dur={dur} titulo={d.titulo} items={d.items} pie={d.pie} />;
    case "barras": return <BarrasComparadas dur={dur} titulo={d.titulo} barras={d.barras} />;
    case "cuenta": return <CuentaQueNoCierra dur={dur} pierde={d.pierde} produce={d.produce} veredicto={d.veredicto} />;
    case "planta": return <PlantaMedidas dur={dur} titulo={d.titulo} ancho={d.ancho} alto={d.alto} nota={d.nota} interior={d.interior} />;
    default: return null;
  }
};

export const MainFrio: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const beats = BEATS as Beat[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090D" }}>
      <Audio src={staticFile(AUDIO)} />
      {beats.map((b, i) => {
        const f0 = sec(b.ms);
        // la duración sale del FRAME FINAL del siguiente, no del largo: redondear por separado
        // deja huecos de 1 frame en las fronteras y se leen como destellos del fondo.
        const nxt = beats[i + 1];
        const f1 = nxt ? sec(nxt.ms) : Math.min(durationInFrames, sec(b.ms + b.dur));
        const dur = Math.max(2, f1 - f0);
        return (
          <Sequence key={b.id + "_" + i} from={f0} durationInFrames={dur} name={b.id}>
            {b.kind === "comp" ? (
              <Componente id={b.id} dur={dur} />
            ) : b.kind === "avatar" ? (
              <Avatar src={b.src!} desde={b.desde ?? 0} dur={dur} />
            ) : b.kind === "clip" ? (
              <Clip src={b.src!} archivo={b.archivo} fadeIn={b.fadeIn ?? 0} />
            ) : (
              <Plate src={b.src!} mov={b.mov} archivo={b.archivo} dur={dur} fadeIn={b.fadeIn ?? 0} />
            )}
          </Sequence>
        );
      })}
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
