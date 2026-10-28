// Perfil (800×800) y banner (2560×1440, todo lo importante en la zona segura 1546×423) de los canales gemelos.
// Mismo mundo del video 1: calle de Londres 2D + Tiza/Chalk 3D + símbolos. idioma elige el nombre y la frase.
import React from "react";
import { AbsoluteFill } from "remotion";
import { CapaSVG, mira, Plano } from "../anikit/camara";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { Capa3D } from "./capa3d";
import { Idioma } from "./escena";
import { CalleMedieval, PAL_LONDRES as PAL, PISO } from "./sets/londres";
import { Simbolo } from "./simbolos";

const X = 2650; // frente a la fuente de Cheapside

export const Perfil: React.FC = () => (
  <AbsoluteFill style={{ background: "#ffb347" }}>
    <svg width={800} height={800} style={{ position: "absolute" }}>
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M400 470 L${400 + Math.cos((i / 16) * 2 * Math.PI) * 900} ${470 + Math.sin((i / 16) * 2 * Math.PI) * 900} L${400 + Math.cos(((i + 0.5) / 16) * 2 * Math.PI) * 900} ${470 + Math.sin(((i + 0.5) / 16) * 2 * Math.PI) * 900} Z`} fill="#ff9a2e" />)}
    </svg>
    <AbsoluteFill style={{ transform: "translate(-560px,-140px)" }}>
      <div style={{ position: "absolute", width: 1920, height: 1080 }}>
        <Plano claves={[mira(0, X, PISO - 250, 2.6)]} mano={0} fondo="transparent">
          <Capa3D personajes={[{ x: X, guion: [{ t: 0, accion: "asustarse", expr: "espantado", mirada: "camara" }], semilla: 7 }]} luz={{ intensidad: 2.8 }} />
          <CapaSVG z={1}><Simbolo tipo="!" x={X + 120} y={PISO - 400} desde={-30} hasta={999} s={1.1} /><Simbolo tipo="sudor" x={X - 95} y={PISO - 330} desde={-30} hasta={999} s={0.7} /></CapaSVG>
        </Plano>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Banner: React.FC<{ idioma: Idioma }> = ({ idioma }) => {
  const T = idioma === "es" ? { nombre: "¿CUÁNTO DURAS?", frase: "Despiertas en la peor época de la historia" } : { nombre: "STICKMAN SENT BACK", frase: "One stickman. The worst places in history." };
  return (
    <AbsoluteFill style={{ background: PAL.cielo[1] }}>
      {/* el mundo a 2560×1440: la calle llena el banner entero; lo importante va en la franja central 1546×423 */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Plano claves={[mira(0, X + 80, PISO - 200, 1.05)]} mano={0} fondo={PAL.cielo[0]}>
          <CapaSVG z={0.25}><CalleMedieval capa="lejos" f={0} pal={PAL} /></CapaSVG>
          <CapaSVG z={1}><CalleMedieval capa="medio" f={0} pal={PAL} /></CapaSVG>
          <Capa3D personajes={[
            { x: X + 480, guion: [{ t: 0, accion: "saludar", expr: "feliz", mirada: "camara" }], semilla: 7 },
            { x: X + 760, color: "#b8443a", accesorios: ["casco"], guion: [{ t: 0, accion: "senalar", expr: "enojado", rotY: -60, objetivo: [-1, 0] }], semilla: 21, prof: -1 },
            { x: X - 520, color: "#c46a7a", accesorios: ["monio"], guion: [{ t: 0, accion: "reir", expr: "carcajada", rotY: 40 }], semilla: 41, prof: -1.5 },
          ]} />
          <CapaSVG z={1}>
            <Simbolo tipo="!?" x={X + 760} y={PISO - 420} desde={-30} hasta={999} />
            <Simbolo tipo="calavera" x={X - 520} y={PISO - 430} desde={-30} hasta={999} s={0.8} />
          </CapaSVG>
          <CapaSVG z={1.4}><CalleMedieval capa="frente" f={0} pal={PAL} /></CapaSVG>
        </Plano>
      </div>
      {/* se renderiza a 1920×1080 y se agranda a 2560×1440 (el canvas 3D no tolera scale CSS); zona segura acá: x 380…1540, y 381…698 */}
      <div style={{ position: "absolute", left: 400, top: 420, width: 760, textAlign: "center" }}>
        <div style={{ fontFamily: F_MANO, fontWeight: 700, fontSize: idioma === "es" ? 112 : 96, lineHeight: 1, color: "#ffd23c", WebkitTextStroke: "5px #1d1410", textShadow: "0 10px 0 #1d1410" }}>{T.nombre}</div>
        <div style={{ marginTop: 20, display: "inline-block", fontFamily: F_HUD, fontWeight: 800, fontSize: 33, color: "#fff6e6", background: "rgba(20,12,8,0.8)", border: "4px solid #f4e6c8", borderRadius: 16, padding: "8px 20px" }}>{T.frase}</div>
      </div>
    </AbsoluteFill>
  );
};
