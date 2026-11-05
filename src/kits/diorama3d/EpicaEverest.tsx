// Demo del Diorama 3D: 30 s en UNA toma. Fondo marino de crinoideos -> la cámara sube y atraviesa nubes
// (transición) -> emerge sobre el mar de nubes frente al Everest al amanecer -> empuja hacia la cumbre.
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { Lienzo, Relieve, Recorte, Toma, Atmosfera, Clave, Aire } from "./Diorama3D";

const R = (s: number) => { let x = Math.imul(s ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
const E = "diorama/epica/";
const NUBE_ASP = 1228 / 596, LIRIO_ASP = 477 / 693;

export const TOMA: Clave[] = [
  { t: 0, pos: [0, -1.2, 2], mira: [0, -0.6, -30] },
  { t: 4.5, pos: [0.9, 0.2, -6], mira: [0.4, 0.4, -34] },
  { t: 8.5, pos: [1.3, 2.2, -12], mira: [0.6, 4.5, -36] },
  { t: 10, pos: [1.0, 12, -15], mira: [0.6, 30, -38] },            // sube: entra en las nubes
  { t: 11.5, pos: [0.8, 26, -17.5], mira: [0.4, 40, -45] },
  { t: 13, pos: [0.6, 37, -21], mira: [0, 41.5, -70] },            // emerge: el Everest de frente
  { t: 22, pos: [0.2, 41.5, -42], mira: [0, 47, -80] },
  { t: 30, pos: [0, 45.2, -60], mira: [0, 51, -82] },            // cerca de la cumbre
];
const AIRE: Aire[] = [
  { t: 0, color: "#06324a", cerca: 6, lejos: 70 },
  { t: 7.5, color: "#0b5770", cerca: 6, lejos: 70, fondo: "#5f9c98" },
  { t: 9.6, color: "#c9d3de", cerca: 8, lejos: 90, fondo: "#dfe5ec" },
  { t: 10.6, color: "#c9d3de", cerca: 10, lejos: 100, fondo: "#dfe5ec" },
  { t: 11.1, color: "#c9d3de", cerca: 12, lejos: 120, fondo: "#0e3350" },
  { t: 12.6, color: "#9db4cf", cerca: 30, lejos: 260, fondo: "#0e3350" },
  { t: 30, color: "#a9b9cf", cerca: 30, lejos: 260, fondo: "#0e3350" },
];

export const EpicaEverest: React.FC = () => {
  const nubesSubida = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    pos: [(R(i * 3) - 0.5) * 32, 10 + R(i * 3 + 1) * 16, -15 - R(i * 3 + 2) * 14] as [number, number, number],
    ancho: 10 + R(i * 7) * 12, rz: (R(i * 11) - 0.5) * 0.4, op: 0.75 + R(i * 13) * 0.25,
  })), []);
  // velos justo delante de la cámara en la subida: son los que hacen el "blanco" de la transición
  const velos = [{ y: 5.5, z: -14.5 }, { y: 8, z: -15.5 }, { y: 11, z: -17 }, { y: 15, z: -18.5 }, { y: 20, z: -20 }, { y: 25, z: -21.5 }];
  const marNubes = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    pos: [(i % 2 ? 1 : -1) * (8 + R(100 + i) * 22), 35 + R(200 + i) * 3, -48 - R(300 + i) * 28] as [number, number, number],
    ancho: 18 + R(400 + i) * 14, rz: (R(500 + i) - 0.5) * 0.3,
  })), []);
  const rafagas = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    pos: [(i % 2 ? 1 : -1) * (2.5 + R(600 + i) * 2), 44 + R(700 + i) * 2, -52 - i * 3.5] as [number, number, number],
    ancho: 5 + R(800 + i) * 5, rz: (R(900 + i) - 0.5) * 0.6,
  })), []);
  return (
    <AbsoluteFill style={{ background: "#06324a" }}>
      <Lienzo>
        <Atmosfera aire={AIRE} />
        <Toma claves={TOMA} fov={34} />
        {/* 1) fondo marino */}
        <Relieve foto={E + "mar.jpg"} prof={E + "mar_d.png"} ancho={44} relieve={14} pos={[0, 0, -40]} />
        {[[-4.2, -2.6, -9, 3.2], [4.6, -2.2, -14, 3.8], [-5.5, -1.8, -20, 4.2], [3.2, -1.5, -25, 3.4], [-1.6, -1.2, -29, 3]].map(([x, y, z, a], i) => (
          <Recorte key={"l" + i} tinte="#6f9c9c" src={E + "lirios.png"} ancho={a} aspecto={LIRIO_ASP} pos={[x, y + a / LIRIO_ASP / 2 - 2, z]} rot={[0, (R(i + 50) - 0.5) * 0.8, 0]} />
        ))}
        {/* 2) capa de nubes de la subida */}
        {nubesSubida.map((n, i) => <Recorte key={"n" + i} nube src={E + "nube.png"} ancho={n.ancho} aspecto={NUBE_ASP} pos={n.pos} rot={[0, 0, n.rz]} opacidad={n.op} />)}
        {velos.map((v, i) => <Recorte key={"v" + i} nube src={E + "nube.png"} ancho={18} aspecto={NUBE_ASP} pos={[0.6 + (i % 2 ? 1.5 : -1.5), v.y, v.z]} rot={[0, 0, i * 0.7]} />)}
        {/* 3) Everest al amanecer */}
        <Relieve foto={E + "everest_alto.jpg"} prof={E + "everest_alto_d.png"} ancho={120} aspecto={1312 / 1177} seg={300} relieve={15} piso={0.08} pos={[0, 62.45, -105]} niebla={false} />
        {/* 4) mar de nubes en primer plano (horizontal) y ráfagas de nieve cerca de la cumbre */}
        {marNubes.map((n, i) => <Recorte key={"m" + i} nube src={E + "nube.png"} ancho={n.ancho} aspecto={NUBE_ASP} pos={n.pos} rot={[0, 0, n.rz]} opacidad={0.85} />)}
        {rafagas.map((n, i) => <Recorte key={"r" + i} nube src={E + "nube.png"} ancho={n.ancho} aspecto={NUBE_ASP} pos={n.pos} rot={[0, 0, n.rz]} opacidad={0.35} />)}
      </Lienzo>
    </AbsoluteFill>
  );
};
