// tz01 · bloques de escena: el lavadero (Leo, Tenzo, Mara por defecto), el cuarto (Leo acostado), Vaishali.
// Cada bloque es una Escena con actores por defecto; cada plano pisa sólo lo que cambia.
import React from "react";
import { Clave, useF } from "../anikit/camara";
import { Actor, ActorProps } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { ESC, LEO, MARA, ORO, PAL, PAL_ANT, TENZO } from "../tenzo/elenco";
import { Tel, Toalla, TelMesa, FarolMano } from "../tenzo/utileria";
import { Lavadero, LAV_PISO, LAV_PUNTOS } from "../tenzo/sets/lavadero";
import { Cuarto, CTO_PISO, CTO_PUNTOS, COLCHON_ALTO } from "../tenzo/sets/cuarto";
import { Vaishali } from "../tenzo/sets/vaishali";

export const kDe = (t0: number) => (t: number) => Math.round((t - t0) * 30); // cuadro local de un instante de la voz
export type Act = Partial<ActorProps> & { no?: boolean };
export const rimOro = { lado: -1 as const, color: ORO, fuerza: 0.8 };
export const rimFrio = { lado: 1 as const, color: "#8fb4e8", fuerza: 0.55 };
export const rimTel = { lado: 1 as const, color: "#ff8a4a", fuerza: 0.7 };
const P = LAV_PISO;

export const SENTADO = { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92 };
export const CEL_SENT = { ...SENTADO, hD: 30, cD: 125, cabeza: 22, hI: 8, cI: 30 }; // sentado mirando el tel
export const DOBLA_A = { ...SENTADO, hD: 62, cD: 28, hI: 55, cI: 40, tronco: 4, cabeza: 14 }; // sentado, manos en la mesa
export const DOBLA_B = { ...SENTADO, hD: 80, cD: 60, hI: 72, cI: 70, tronco: 0, cabeza: 10 }; // levanta la punta
// dobla la toalla: alterna A/B cada `p` cuadros desde `d`
export const doblando = (d: number, hasta: number, p = 26) => {
  const out: { f: number; v: Partial<typeof DOBLA_A> }[] = [{ f: 0, v: DOBLA_A }];
  for (let f = d; f < hasta; f += p) out.push({ f, v: DOBLA_B }, { f: f + p / 2, v: DOBLA_A });
  return out;
};

// ---------- personajes por defecto en el lavadero ----------
export const leoLav = (o: Act = {}): ActorProps => ({
  look: LEO, escala: ESC, seed: 1, luz: rimFrio, ruta: [{ f: 0, x: LAV_PUNTOS.leo, y: P }], dir: [{ f: 0, v: 1 }],
  asiento: [{ f: 0, v: 66 }], poses: [{ f: 0, v: CEL_SENT }], caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }],
  enManoD: <Tel />, ...o,
});
export const tenzoLav = (o: Act = {}): ActorProps => ({
  look: TENZO, escala: ESC, seed: 2, luz: rimOro, ruta: [{ f: 0, x: LAV_PUNTOS.tenzo, y: P }], dir: [{ f: 0, v: -1 }],
  asiento: [{ f: 0, v: 66 }], poses: [{ f: 0, v: DOBLA_A }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }], ...o,
});
export const maraLav = (o: Act = {}): ActorProps => ({
  look: MARA, escala: ESC * 1.05, seed: 5, ruta: [{ f: 0, x: LAV_PUNTOS.leo - 170, y: P - 10 }], dir: [{ f: 0, v: 1 }],
  poses: [{ f: 0, v: { hD: 70, cD: 80, hI: 30, cI: 60, tronco: 16, cabeza: 18 } }], caras: [{ f: 0, v: "picaro" }], opacidad: () => 0.95, ...o,
});

// silla de plástico gris (mira a la izquierda), asiento a P-76
export const Silla: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 50} y={P - 82} width={100} height={12} rx={5} fill="#5a606b" />
    <rect x={x + 36} y={P - 200} width={12} height={130} rx={5} fill="#5a606b" />
    <rect x={x - 46} y={P - 70} width={8} height={70} fill="#474c56" /><rect x={x + 38} y={P - 70} width={8} height={70} fill="#474c56" />
  </g>
);

export const Lav: React.FC<{
  cl: Clave[]; leo?: Act; tenzo?: Act; mara?: Act; toalla?: number | ((f: number) => number); telMesa?: { bocaAbajo?: boolean; vibra?: number };
  sp?: Record<string, unknown>; hud?: React.ReactNode; detras?: React.ReactNode; extra?: React.ReactNode; frente?: React.ReactNode; mano?: number;
}> = ({ cl, leo = {}, tenzo = {}, mara = { no: true }, toalla = 0.3, telMesa, sp = {}, hud, detras, extra, frente, mano }) => {
  const f = useF();
  const d = typeof toalla === "function" ? toalla(f) : toalla;
  return (
    <Escena Set={Lavadero} pal={PAL} claves={cl} seed={1} mano={mano} setProps={{ girando: [3, 7, 12, 22, 31], nieve: true, ...sp }} detras={detras} frente={frente} hud={hud}
      medio={<>
        {toalla !== -1 && <Toalla x={LAV_PUNTOS.tenzo - 130} y={P - 150} doblez={d} />}
        {telMesa && <TelMesa x={LAV_PUNTOS.leo + 230} y={P - 150} {...telMesa} />}
        {!mara.no && <Actor {...maraLav(mara)} />}
        {!leo.no && <Actor {...leoLav(leo)} />}
        {!tenzo.no && tenzo.asiento === undefined && <Silla x={(tenzo.ruta?.[0]?.x ?? LAV_PUNTOS.tenzo) + 6} />}
        {!tenzo.no && <Actor {...tenzoLav(tenzo)} />}
        {extra}
      </>} />
  );
};

// ---------- el cuarto: Leo sentado en el colchón contra la pared, piernas estiradas, encorvado sobre el tel ----------
export const CP = CTO_PISO;
export const CAMA = { tronco: -18, pI: 88, rI: 4, pD: 84, rD: 10, hD: 32, cD: 128, hI: 26, cI: 118, cabeza: 18 }; // tel con las dos manos
export const LeoCama: React.FC<{ x?: number; o?: Act }> = ({ x = CTO_PUNTOS.colchon - 120, o = {} }) => (
  <Actor look={LEO} escala={ESC} seed={1} luz={rimTel} sombra={0} ruta={[{ f: 0, x, y: CP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: COLCHON_ALTO }]}
    poses={[{ f: 0, v: CAMA }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.8 } }]} enManoD={<Tel s={1.3} />} {...o} />
);
export const Cto: React.FC<{ cl: Clave[]; pal?: typeof PAL; sp?: Record<string, unknown>; medio?: React.ReactNode; detras?: React.ReactNode; hud?: React.ReactNode; frente?: React.ReactNode; leo?: Act | false }> = ({ cl, pal = PAL, sp = {}, medio, detras, hud, frente, leo = {} }) => (
  <Escena Set={Cuarto} pal={pal} claves={cl} seed={2} setProps={{ nieve: true, ...sp }} hud={hud} frente={frente}
    medio={<>{detras}{leo && <LeoCama o={leo} />}{medio}</>} />
);

// ---------- Vaishali (todo cálido) ----------
export const Vai: React.FC<{ cl: Clave[]; sp?: Record<string, unknown>; medio?: React.ReactNode; hud?: React.ReactNode; frente?: React.ReactNode }> = ({ cl, sp = {}, medio, hud, frente }) => (
  <Escena Set={Vaishali} pal={PAL_ANT} claves={cl} seed={3} setProps={sp} medio={medio} hud={hud} frente={frente} />
);
export const A: React.FC<ActorProps> = (p) => <Actor escala={ESC} {...p} />;
export { FarolMano, LAV_PUNTOS, CTO_PUNTOS, P as LP };
