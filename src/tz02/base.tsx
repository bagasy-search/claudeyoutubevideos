// tz02 · bloques de escena propios: Kapilavastu (el palacio de Siddhartha) y Broadway (la caminata sin tel).
// El lavadero y el cuarto vienen de tz01/base (Lav, Cto); el HUD de tz01/planos1.
import React from "react";
import { Clave } from "../anikit/camara";
import { Actor, ActorProps } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Look } from "../anikit/personaje";
import { AMRAPALI, ESC, PAL, PAL_ANT, PAL_DIA } from "../tenzo/elenco";
import { HudTenzo } from "../tenzo/hud";
import { Kapilavastu, KAP_PISO, KAP_PUNTOS } from "../tenzo/sets/kapilavastu";
import { Broadway, BWY_PISO, BWY_PUNTOS } from "../tenzo/sets/broadway";

export const KP = KAP_PISO, K = KAP_PUNTOS, BP = BWY_PISO, BW = BWY_PUNTOS;
export const A: React.FC<ActorProps> = (p) => <Actor escala={ESC} {...p} />;
export const PRINCESA: Look = { ...AMRAPALI, camisa: "#d9708a", pantalon: "#d9708a", accesorios: [{ t: "pelo", forma: "cola", color: "#1e1410" }, { t: "tunica", color: "#d9708a", largo: 1 }, { t: "bufanda", color: "#f2c14a" }] };
// HUD de tz02: día 2 arranca con 6 h de hoy; tras entregar el tel queda en 0 congelado; día 4 = 2h 06m
// v7 (28-oct): d = -60 → el resorte de entrada ya terminó en el cuadro 0 de cada plano. Antes cada corte REARRANCABA el resorte
// (HUD ausente en el cuadro del corte y a media opacidad 3-4 cuadros = «HUD fantasma» de Q13 1:00 y Q75 6:20).
export const Hud2 = ({ m = 360, dia = 2, est = "normal", d = -60 }: { m?: number; dia?: number; est?: "sube" | "normal" | "congelado"; d?: number }) => <HudTenzo min={m} dia={dia} estado={est} desde={d} />;

export const Kap: React.FC<{ cl: Clave[]; sp?: Record<string, unknown>; medio?: React.ReactNode; hud?: React.ReactNode; frente?: React.ReactNode }> = ({ cl, sp = {}, medio, hud, frente }) => (
  <Escena Set={Kapilavastu} pal={PAL_ANT} claves={cl} seed={4} setProps={sp} medio={medio} hud={hud} frente={frente} />
);
export const Bwy: React.FC<{ cl: Clave[]; dia?: boolean; sp?: Record<string, unknown>; medio?: React.ReactNode; hud?: React.ReactNode }> = ({ cl, dia = false, sp = {}, medio, hud }) => (
  <Escena Set={Broadway} pal={dia ? PAL_DIA : PAL} claves={cl} seed={6} setProps={{ hora: dia ? "dia" : "noche", nieve: !dia, ...sp }} medio={medio} hud={hud} />
);
// el bebé envuelto en la cuna dorada
export const Bebe: React.FC<{ x?: number; llora?: boolean }> = ({ x = K.cuna }) => (
  <g transform={`translate(${x},${KP - 128})`}>
    <ellipse rx={58} ry={26} fill="#fff2dc" stroke="#d9c4a0" strokeWidth={3} />
    <circle cx={-34} cy={-14} r={24} fill="#e2ad78" />
    <path d="M-44,-16 q5,4 10,0 M-30,-16 q5,4 10,0" stroke="#3a2618" strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);
// la camilla del funeral (dos cargadores la llevan): x = centro
export const Camilla: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 170} y={y} width={340} height={10} rx={4} fill="#7a5028" />
    <rect x={x - 130} y={y - 34} width={260} height={36} rx={18} fill="#f1ead8" />
    {[-90, -30, 30, 90].map((d) => <circle key={d} cx={x + d} cy={y - 34} r={6} fill="#f2c14a" />)}
  </g>
);
