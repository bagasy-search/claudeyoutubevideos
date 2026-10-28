// ELENCO medieval: todos son el MISMO stickman blanco; el oficio se lee por ropa + pelo/sombrero + objeto (refs del
// creador 28-oct). Tiza/Chalk = desnudo de ropa con ZAPATILLAS (el chiste: es el único con calzado moderno).
import React from "react";
import { AbsoluteFill } from "remotion";
import { mira, Plano } from "../anikit/camara";
import { Ropa } from "../stickman3d/vestuario";
import { Capa3D, Personaje } from "./capa3d";
import { PISO } from "./sets/londres";

export const ROPA: Record<string, Ropa> = {
  tiza: { calzado: { tipo: "zapatillas" } },
  panadero: { tunica: { color: "#d8c8a8", largo: 0.5, cinto: "#6a4a2a" }, delantal: "#fbfaf6", sombrero: { tipo: "chef" }, calzas: "#6a5a4a", calzado: { tipo: "zuecos", color: "#8a5a32" }, manos: { d: "pan" } },
  tabernera: { tunica: { color: "#b8443a", largo: 0.97, vuelo: 0.5, cinto: "#3a2414", cuello: "#f4efe4" }, delantal: "#f4efe4", pelo: { color: "#e8b84a", estilo: "rodete" }, calzado: { tipo: "zuecos", color: "#5a3a24" }, manos: { d: "jarra" } },
  monje: { tunica: { color: "#6a4a32", largo: 1, vuelo: 0.42, mangas: "largas", cinto: "#e2d2a8" }, sombrero: { tipo: "capucha", color: "#6a4a32" }, manos: { i: "libro" } },
  guardia: { tunica: { color: "#a8302a", largo: 0.45, cinto: "#2a2a2a", mangas: "largas" }, calzas: "#3a3a44", sombrero: { tipo: "copa", color: "#8a8a92" }, calzado: { tipo: "botas" }, manos: { d: "lanza" } },
  campesina: { tunica: { color: "#5a8a4a", largo: 0.97, vuelo: 0.48, cinto: "#7a5a32" }, sombrero: { tipo: "pañuelo", color: "#e8d8b0" }, calzado: { tipo: "zuecos", color: "#7a5030" }, manos: { i: "canasta" } },
  granjero: { tunica: { color: "#8a6a42", largo: 0.42, cinto: "#3a2414" }, calzas: "#4a5a6a", sombrero: { tipo: "paja" }, barba: "#7a4a2a", calzado: { tipo: "botas" }, manos: { d: "escoba" } },
  medico: { tunica: { color: "#26222a", largo: 1, vuelo: 0.46, mangas: "largas" }, capa: "#1a171c", sombrero: { tipo: "pico", color: "#1a171c" }, calzado: { tipo: "botas", color: "#1a171c" }, manos: { d: "baston" } },
  noble: { tunica: { color: "#6a3a8a", largo: 0.6, cinto: "#d8a83a", cuello: "#f4efe4", mangas: "largas" }, capa: "#a8302a", calzas: "#2a2a3a", sombrero: { tipo: "boina", color: "#2a1a3a" }, barba: "#3a2a20", calzado: { tipo: "botas", color: "#2a1a14" } },
  pescadero: { tunica: { color: "#5a7a9a", largo: 0.45, cinto: "#3a2a20" }, delantal: "#c8c0b0", calzas: "#5a4a3a", pelo: { color: "#a85a2a", estilo: "corto" }, calzado: { tipo: "botas", color: "#3a3a3a" }, manos: { d: "pez" } },
  anciana: { tunica: { color: "#7a6a8a", largo: 0.98, vuelo: 0.44, mangas: "largas" }, sombrero: { tipo: "cofia" }, manos: { d: "baston" } },
  pregonero: { tunica: { color: "#d8a83a", largo: 0.5, cinto: "#6a2a2a", cuello: "#a8302a" }, calzas: "#a8302a", sombrero: { tipo: "punta", color: "#a8302a" }, calzado: { tipo: "botas" }, manos: { d: "campana" } },
  aguatero: { tunica: { color: "#9a8a6a", largo: 0.45, cinto: "#4a3020" }, calzas: "#6a5a4a", pelo: { color: "#2a2020", estilo: "corto" }, barba: "#2a2020", calzado: { tipo: "zuecos", color: "#6a4a2a" }, manos: { i: "balde" } },
  niña: { tunica: { color: "#e8a0a8", largo: 0.95, vuelo: 0.38, cinto: "#fbfaf6" }, pelo: { color: "#c87a3a", estilo: "trenzas" }, calzado: { tipo: "zuecos", color: "#7a5030" }, manos: { i: "bolsa" } },
  sereno: { tunica: { color: "#3a4a6a", largo: 0.55, mangas: "largas", cinto: "#2a2a2a" }, calzas: "#2a2a2a", sombrero: { tipo: "capucha", color: "#2a3448" }, calzado: { tipo: "botas" }, manos: { d: "farol" } },
  lavandera: { tunica: { color: "#4a7a8a", largo: 0.96, vuelo: 0.46 }, delantal: "#f4efe4", pelo: { color: "#3a2418", estilo: "cola" }, calzado: { tipo: "zuecos", color: "#6a4a2a" }, manos: { i: "canasta" } },
};
export const OFICIOS = Object.keys(ROPA).filter((k) => k !== "tiza");

// lámina para revisar el vestuario: todos en fila sobre fondo liso
export const Elenco: React.FC = () => {
  const lista = Object.keys(ROPA);
  const per: Personaje[] = lista.map((k, i) => ({ x: 300 + (i % 6) * 300, alto: (2 - Math.floor(i / 6)) * 400, ropa: ROPA[k], semilla: 3 + i, guion: [{ t: 0, accion: "idle", expr: i % 3 ? "feliz" : "sonrisa_picara", rotY: 25 }] }));
  const cx = 300 + 2.5 * 300;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#1c3c6a,#2a6a8a)" }}>
      <Plano claves={[mira(0, cx, PISO - 560, 0.84)]} mano={0} fondo="transparent">
        <Capa3D personajes={per} luz={{ intensidad: 2.6 }} />
      </Plano>
    </AbsoluteFill>
  );
};
