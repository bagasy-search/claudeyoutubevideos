// Demo «Día D» v2 (2,5 min): 17 tomas Veo en 5 tramos encadenados + archivo REAL de 1944 (fotos y noticiero de la OWI,
// dominio público) que cose los tramos, texto DETRÁS de la gente (recortes con alfa del farm) y narrador.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Montaje, Pieza, inicios, Recorte, Niebla, PieArchivo } from "./Montaje";
import { Particulas, HumoPaso, Cifra, Fecha, Franjas } from "./Capas";

const D = "dday2/";
const v = (id: string, primera: boolean, extra: Partial<Pieza> = {}): Pieza =>
  ({ id, src: D + id + ".mp4", desde: primera ? 0 : 1, dura: primera ? 190 : 189, ...extra });

export const PIEZAS_DD2: Pieza[] = [
  v("a1", true), v("a2", false), v("a3", false, { bn: "sale" }),
  { id: "eis", src: D + "eisenhower.jpg", tipo: "foto", dura: 132, cruce: 12, kb: [1.04, 1.16], pos: "50% 8%", foco: "36% 20%" },
  { id: "avi", src: D + "aviones.mp4", dura: 93, cruce: 10, bn: "todo" },
  v("b1", true, { cruce: 12, bn: "entra" }), v("b2", false), v("b3", false, { bn: "sale" }),
  { id: "rom", src: D + "rommel.jpg", tipo: "foto", dura: 132, cruce: 12, kb: [1.03, 1.14], foco: "42% 42%" },
  v("c1", true, { cruce: 12, bn: "entra" }), v("c2", false), v("c3", false),
  v("d1", true, { cruce: 18 }), v("d2", false), v("d3", false), v("d4", false, { bn: "sale" }),
  { id: "jaw", src: D + "jaws.jpg", tipo: "foto", dura: 132, cruce: 12, kb: [1.03, 1.2], foco: "50% 52%" },
  { id: "lst", src: D + "lst.mp4", dura: 63, cruce: 10, bn: "todo", pos: "50% 80%" },
  v("e1", true, { cruce: 12, bn: "entra" }), v("e2", false), v("e3", false), v("e4", false),
];
const { en: T, largo } = inicios(PIEZAS_DD2);
export const CIERRE = 72;                      // cuadros a negro con el título al final
export const LARGO_DD2 = largo + CIERRE;
export const INICIOS_DD2 = T;
const s = (id: string, dt = 0) => (T[id] + dt * 24) / 24; // segundos desde el arranque de una pieza

export const DiaD2 = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje piezas={PIEZAS_DD2} />

    {/* 1 · la radio y la BBC */}
    <Fecha desde={0.6} hasta={6.2} texto="5 DE JUNIO DE 1944" sub="Normandía · 21:15" y={0.74} />
    <Fecha desde={s("a2", 3.4)} hasta={s("a2", 9.6)} texto="« Blessent mon cœur d'une langueur monotone »" sub="Paul Verlaine · leído por la BBC" y={0.72} tam={44} />

    {/* 2 · archivo: Eisenhower y los aviones */}
    <PieArchivo desde={T["eis"]} hasta={T["eis"] + 132} texto="Eisenhower con la 101ª Aerotransportada · 5 de junio de 1944 · foto real" />
    <PieArchivo desde={T["avi"] + 6} hasta={T["avi"] + 93} texto="Noticiero de 1944 · imágenes reales" />

    {/* 3 · el salto: texto DETRÁS del centinela */}
    <Fecha desde={s("b1", 1.2)} hasta={s("b1", 6.8)} texto="6 DE JUNIO · 00:15" y={0.72} tam={58} />
    <Particulas desde={s("b2")} hasta={s("b3", 7.8)} n={60} color="#cfd8e6" viento={-10} caida={30} semilla={21} />
    <Fecha desde={s("b3", 0.8)} hasta={s("b3", 7.7)} texto="RUPERT" sub="muñecos de arpillera · Operación Titanic" y={0.4} tam={190} />
    <Recorte src={D + "b3_fg.webm"} desde={1} dura={189} t0={T["b3"]} />

    {/* 4 · Rommel y Hitler */}
    <PieArchivo desde={T["rom"]} hasta={T["rom"] + 132} texto="Rommel inspecciona el Muro del Atlántico · 1944 · foto real (Bundesarchiv)" />
    <Fecha desde={s("c1", 1.0)} hasta={s("c1", 7.2)} texto="HERRLINGEN, ALEMANIA" sub="6 de junio · cumpleaños de Lucie Rommel" y={0.74} tam={52} />
    <Niebla desde={T["c2"] + 36} hasta={T["c2"] + 150} src={D + "nube.png"} color="#7d8ea6" pico={0.97} />
    <Fecha desde={s("c3", 0.6)} hasta={s("c3", 5.6)} texto="BERGHOF · 03:00" sub="Obersalzberg, Alpes bávaros" y={0.76} tam={46} />

    {/* 5 · la flota y las lanchas: texto DETRÁS de los soldados */}
    <Cifra desde={s("d1", 2.6)} hasta={s("d1", 7.8)} valor={6939} sufijo="barcos" x={0.3} y={0.42} />
    <Cifra desde={s("d1", 4.3)} hasta={s("d1", 7.8)} valor={156000} sufijo="hombres" x={0.7} y={0.42} />
    <Fecha desde={s("d2", 2.2)} hasta={s("d2", 7.8)} texto="30 POR LANCHA" y={0.3} tam={150} />
    <Fecha desde={s("d4", 0.2)} hasta={s("d4", 5.2)} texto="06:30" sub="Normandía · 6 de junio" y={0.28} tam={96} />

    {/* 6 · la playa */}
    <PieArchivo desde={T["jaw"]} hasta={T["jaw"] + 132} texto="«Into the Jaws of Death» · Omaha, 6 de junio · Robert F. Sargent · foto real" />
    <PieArchivo desde={T["lst"] + 6} hasta={T["lst"] + 63} texto="Noticiero de 1944 · imágenes reales" />
    <HumoPaso desde={s("e1")} hasta={s("e2", 3)} src={D + "nube.png"} tinte={0.6} n={5} semilla={4} />
    <Fecha desde={s("e1", 1.4)} hasta={s("e1", 7.8)} texto="4.414" sub="aliados muertos ese día" y={0.25} tam={140} />
    <Recorte src={D + "e1_fg.webm"} dura={190} t0={T["e1"]} />
    <Fecha desde={s("e2", 1.5)} hasta={s("e2", 7.6)} texto="UTAH · OMAHA · GOLD · JUNO · SWORD" y={0.76} tam={40} />
    <Fecha desde={s("e3", 3.4)} hasta={s("e3", 7.8)} texto="LA ROCHE-GUYON · 22:00" sub="Rommel llega a su cuartel" y={0.76} tam={44} />

    {/* cierre */}
    <Particulas desde={s("e4", 2)} hasta={LARGO_DD2 / 24} n={50} color="#fff6dc" viento={6} caida={-14} semilla={33} />
    <Fecha desde={(largo - 30) / 24} hasta={LARGO_DD2 / 24 + 0.8} texto="EL PRINCIPIO DEL FIN" y={0.5} tam={64} />
    <Franjas />
  </AbsoluteFill>
);
