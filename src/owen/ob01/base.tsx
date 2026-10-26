// Bloques de escena reusables de ob01 (y de los siguientes): el bus por dentro con pasajeros, tiempos de la voz.
import React from "react";
import { useVideoConfig } from "remotion";
import { Clave, useF } from "../../anikit/camara";
import { Actor, posRuta, Paso } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Look, Pose } from "../../anikit/personaje";
import { PAL, OWEN } from "../elenco";
import { BusInterior, BUS_PISO, BUS_PUNTOS, alVolante, Volante } from "../mundo/bus";
import { Hora } from "../mundo/hora";
import { Etq, HudOwen } from "../comun";

export const ESC = 1;
// cuadro local de un instante de la voz, dentro de un plano que empieza en t0 (s)
export const kDe = (t0: number) => (t: number) => Math.round((t - t0) * 30);

export type Clv<T> = { f: number; v: T }[];
export type Pas = {
  look: Look; ruta: Paso[]; poses?: Clv<string | Partial<Pose>>; caras?: Clv<string>; dir?: Clv<1 | -1>; sentado?: number; // f desde que se sienta
  n?: number | { f: number; v: number; d?: number }[]; edad?: number | string; desde?: number; hasta?: number; color?: string; seed?: number;
  enManoD?: React.ReactNode; enManoI?: React.ReactNode; habla?: [number, number][]; miradas?: Clv<{ x: number; y: number }>;
  aparece?: number; seVa?: number; levanta?: number; // cuadros en que entra / sale de cuadro (opacidad)
};

export const Pasajero: React.FC<{ p: Pas }> = ({ p }) => (
  <Actor look={p.look} escala={ESC} seed={p.seed ?? 3} ruta={p.ruta} dir={p.dir} poses={p.poses ?? [{ f: 0, v: "parado" }]} caras={p.caras ?? [{ f: 0, v: "neutral" }]}
    asiento={p.sentado !== undefined ? [...(p.sentado > 0 ? [{ f: 0, v: undefined }] : []), { f: p.sentado, v: BUS_PUNTOS.asiento }, ...(p.levanta !== undefined ? [{ f: p.levanta, v: undefined }] : [])] : undefined}
    enManoD={p.enManoD} enManoI={p.enManoI} habla={p.habla} miradas={p.miradas}
    opacidad={p.aparece !== undefined || p.seVa !== undefined ? (ff: number) => (ff < (p.aparece ?? -1e9) || ff > (p.seVa ?? 1e9) ? 0 : 1) : undefined} />
);

// etiqueta de un pasajero: sigue su ruta; sentado baja
export const EtqPas: React.FC<{ p: Pas; cl: Clave[]; piso?: number }> = ({ p, cl, piso = BUS_PISO }) => {
  const f = useF();
  if (p.n === undefined) return null;
  const sent = p.sentado !== undefined && f >= p.sentado && (p.levanta === undefined || f < p.levanta);
  return <Etq cl={cl} x={(ff) => posRuta(p.ruta, ff).x} y={sent ? piso - 250 : (posRuta(p.ruta, f).y || piso) - 330} n={p.n} edad={p.edad} desde={p.desde ?? 0} hasta={p.hasta} color={p.color} />;
};

export type OwenVol = { caras?: Clv<string>; giro?: (f: number) => number; poses?: Clv<string | Partial<Pose>>; manos?: "ambas" | "D" | "I"; enManoD?: React.ReactNode; habla?: [number, number][]; miradas?: Clv<{ x: number; y: number }>; giros?: Clv<number> };

export const OwenAlVolante: React.FC<{ o?: OwenVol }> = ({ o = {} }) => {
  const f = useF();
  const g = o.giro ?? (() => 0);
  return (
    <>
      <Actor look={OWEN} escala={ESC} seed={1} ruta={[{ f: 0, x: BUS_PUNTOS.chofer, y: BUS_PISO }]} dir={[{ f: 0, v: -1 }]}
        poses={o.poses ?? [{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: BUS_PUNTOS.asiento }]} caras={o.caras ?? [{ f: 0, v: "neutral" }]}
        ajuste={alVolante(BUS_PUNTOS.chofer, ESC, g, o.manos ?? "ambas")} enManoD={o.enManoD} habla={o.habla} miradas={o.miradas} giros={o.giros} />
      <Volante giro={g(f)} />
    </>
  );
};

// el bus por dentro con Owen y pasajeros + HUD
export const EnBus: React.FC<{
  cl: Clave[]; hora?: Hora; min?: number | ((f: number) => number); part?: string | null; avance?: (f: number) => number; puertaF?: (f: number) => number; puertaT?: (f: number) => number;
  timbre?: (f: number) => boolean; paradas?: { a: number; num?: number }[]; pas?: Pas[]; owen?: OwenVol | null; medio?: React.ReactNode; detras?: React.ReactNode; hud?: React.ReactNode; seed?: number; mano?: number;
}> = ({ cl: cl0, hora = "manana", min, part = "47/47", avance, puertaF, puertaT, timbre, paradas, pas = [], owen = {}, medio, detras, hud, seed = 1, mano = 2.5 }) => {
  // nunca un plano general del bus con la gente chiquita: zoom mínimo 1,35 alrededor del mismo centro (OJO DEL DIRECTOR v1)
  const cl = cl0.map((c) => (c.zoom >= 1.35 ? c : { ...c, x: (c.x / c.zoom) * 1.35, y: (c.y / c.zoom) * 1.35, zoom: 1.35 }));
  return (
  <Escena Set={BusInterior} pal={PAL} claves={cl} seed={seed} mano={mano} setProps={{ hora, avance, puertaF, puertaT, timbre, paradas }}
    detras={detras}
    medio={<>
      {owen && <OwenAlVolante o={owen} />}
      {pas.map((p, i) => <Pasajero key={i} p={p} />)}
      {medio}
    </>}
    hud={<>
      {pas.map((p, i) => <EtqPas key={i} p={p} cl={cl} />)}
      {hud}
      <HudOwen min={min} part={part} />
    </>}
  />
  );
};

export const useFps = () => useVideoConfig().fps;

// vaso de café de estación de servicio (en la mano)
export const VasoCafe: React.FC = () => (
  <g transform="translate(0,-10)">
    <path d="M-16,-40 h32 l-5,48 h-22 Z" fill="#f4efe4" />
    <rect x={-18} y={-46} width={36} height={8} rx={3} fill="#2a2a2a" />
    <rect x={-15} y={-24} width={30} height={14} fill="#c23a2e" />
  </g>
);

