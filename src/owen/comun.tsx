// Piezas que reusan todos los videos de Owen: etiqueta en coordenadas de mundo, HUD fijo, notas musicales, espejo.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Clave, enPantalla, useF } from "../anikit/camara";
import { Contador, EtiquetaFlotante, MarcaCorto, RelojDia, TextoMano, F_HUD } from "../anikit/pantalla";
import { VERDE } from "./elenco";

// el número flotante sobre una cabeza (X,Y en el MUNDO; sigue a la cámara). edad = años de calendario (rótulo).
export const Etq: React.FC<{ cl: Clave[]; x: number | ((f: number) => number); y: number | ((f: number) => number); n: number | { f: number; v: number; d?: number }[]; edad?: number | string; desde?: number; hasta?: number; color?: string; tam?: number; sufijo?: string }> = ({ cl, x, y, n, edad, desde = 0, hasta, color = VERDE, tam = 84, sufijo }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const X = typeof x === "function" ? x(f) : x, Y = typeof y === "function" ? y(f) : y;
  const p = enPantalla(cl, f, fps, X, Y);
  const z = cl.length ? cl[0].zoom : 1;
  const rot = edad === undefined ? "" : typeof edad === "number" ? `${edad} YRS OLD` : edad;
  return <EtiquetaFlotante x={p.x} y={p.y} rotulo={rot} claves={n} desde={desde} hasta={hasta} color={color} tam={tam * Math.min(1.25, Math.max(0.8, z))} sufijo={sufijo} />;
};

// HUD fijo del día de Owen: reloj (min desde medianoche, o claves), contador de participantes, marca
export const HudOwen: React.FC<{ min?: number | ((f: number) => number); part?: string | null; sinReloj?: boolean }> = ({ min, part = "47/47", sinReloj }) => {
  const f = useF();
  const m = typeof min === "function" ? min(f) : min;
  return (
    <>
      {!sinReloj && m !== undefined && <RelojDia min={m} />}
      {part && <div style={{ position: "absolute", left: 70, top: 60, width: 440, height: 62, borderRadius: 31, background: "rgba(20,18,16,0.62)" }} />}
      {part && <Contador lineas={[{ etiqueta: "PARTICIPANTS", claves: part, color: VERDE }]} tam={38} />}
      <MarcaCorto />
    </>
  );
};

// texto a mano de los videos de Owen: centrado en x, con sombra oscura (se lee sobre fondo claro) y nunca chico
// siempre sobre panel oscuro (se lee sobre carteles, ventanas y camas) y dentro de la zona segura (nunca cortado ni pegado al borde)
export const Mano: React.FC<React.ComponentProps<typeof TextoMano>> = ({ tam = 64, brillo = false, centro = true, rot = -2, x, y, texto, ...r }) => {
  const T = Math.max(64, tam);
  const lin = texto.split(String.fromCharCode(10));
  const ancho = Math.max(...lin.map((l) => l.length)) * T * 0.5 + T * 0.9;
  const alto = lin.length * T * 1.05 + T * 0.5;
  const X = centro ? Math.min(1920 - 70 - ancho / 2, Math.max(70 + ancho / 2, x)) : Math.min(1920 - 70 - ancho, Math.max(70, x));
  const Y = Math.min(1080 - 150 - alto, Math.max(140, y));
  return <TextoMano {...r} texto={texto} x={X} y={Y} tam={T} brillo={brillo} centro={centro} rot={rot} panel />;
};

// notas musicales que salen de alguien que tararea (en el MUNDO, dentro de medio)
export const Notas: React.FC<{ x: number; y: number; desde?: number; hasta?: number; color?: string }> = ({ x, y, desde = 0, hasta = 1e9, color = "#ffd27a" }) => {
  const f = useF();
  if (f < desde || f > hasta) return null;
  return (
    <g>
      {[0, 1, 2, 3].map((k) => {
        const t = ((f - desde + k * 18) % 72) / 72;
        return <text key={k} x={x + 20 + t * 90 + Math.sin(t * 6 + k) * 14} y={y - t * 160} fontSize={44} fill={color} opacity={Math.sin(t * Math.PI)} fontFamily={F_HUD}>{k % 2 ? "♪" : "♫"}</text>;
      })}
    </g>
  );
};

// texto a mano anclado al mundo (sigue a la cámara)
export const ManoMundo: React.FC<{ cl: Clave[]; x: number; y: number; texto: string; desde: number; hasta?: number; color?: string; tam?: number; rot?: number }> = ({ cl, x, y, ...r }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const p = enPantalla(cl, f, fps, x, y);
  return <Mano x={p.x} y={p.y} {...r} />;
};

// un plano metido en un marco (espejo retrovisor, pantalla): el hijo es una escena 1920x1080 que se ve achicada
export const Marco: React.FC<{ x: number; y: number; w: number; h: number; radio?: number; borde?: string; espejar?: boolean; children: React.ReactNode }> = ({ x, y, w, h, radio = 30, borde = "#2a2e34", espejar, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: radio, overflow: "hidden", border: `16px solid ${borde}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", background: "#000" }}>
    <div style={{ position: "absolute", inset: 0, transform: espejar ? "scaleX(-1)" : undefined }}>
      <div style={{ position: "absolute", width: 1920, height: 1080, left: (w - 32 - 1920 * Math.max((w - 32) / 1920, (h - 32) / 1080)) / 2, top: (h - 32 - 1080 * Math.max((w - 32) / 1920, (h - 32) / 1080)) / 2, transform: `scale(${Math.max((w - 32) / 1920, (h - 32) / 1080)})`, transformOrigin: "0 0" }}>
        <AbsoluteFill>{children}</AbsoluteFill>
      </div>
    </div>
  </div>
);
