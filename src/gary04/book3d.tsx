// gary · CTA del MANUAL dentro del mundo (feedback_cta_guia_3d_dentro_del_mundo): el manual impreso descansa sobre el banco de Gary
// (madera, multímetro, taza), la cámara baja en curva, la tapa se abre por el lomo, una hoja pasa y queda la página REAL del PDF
// a la derecha; al lado, la tarjeta impresa con el QR grande (URL corta /g). En pantalla sólo el nombre del manual y
// «the link is in the first line of the description». Nunca una URL escrita. Render SÓLO en el farm (acá sólo stills).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { Txt3 } from "./gk";
import { M, RBox, Scene3D, cl, eio, lerp, phys, tex, tubeG, useImg } from "./h3d";
import { P } from "./lib";

const PAPER = "#f4efe3";
const BW = 0.3, BD = 0.388, TH = 0.028;   // el manual: carta (935×1210), 100 páginas

// hoja que gira sobre el lomo (x=0) de 0 a π; front = cara de arriba al empezar, back = la que queda a la izquierda
const Leaf: React.FC<{ ang: number; front?: THREE.Texture | null; back?: THREE.Texture | null }> = ({ ang, front, back }) => {
  const bend = Math.sin(ang) * 0.05;
  return <group rotation={[0, 0, ang]}>
    <group position={[BW / 2 - 0.004, bend * 0.4, 0]} rotation={[0, 0, -bend]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0004, 0]}><planeGeometry args={[BW - 0.01, BD - 0.008]} /><meshStandardMaterial key={front ? "t" : "n"} map={front ?? null} color={PAPER} roughness={0.9} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.0004, 0]}><planeGeometry args={[BW - 0.01, BD - 0.008]} /><meshStandardMaterial key={back ? "t" : "n"} map={back ?? null} color={PAPER} roughness={0.9} /></mesh>
    </group>
  </group>;
};

export const Manual: React.FC<{ open: number; flip: number; cover?: THREE.Texture | null; page?: THREE.Texture | null; under?: THREE.Texture | null }> = ({ open, flip, cover, page, under }) => {
  const ang = Math.PI * eio(open, 0, 1) * 0.985;
  return <group>
    {/* contratapa y bloque de hojas con canto rayado */}
    <RBox s={[BW + 0.01, 0.004, BD + 0.01]} p={[0, 0.002, 0]} r={0.002}>{M.matte({ col: "#13243f" })}</RBox>
    <mesh position={[0.003, 0.004 + TH / 2, 0]} castShadow receiveShadow><boxGeometry args={[BW - 0.006, TH, BD - 0.006]} /><meshStandardMaterial color="#e7e0cf" roughness={0.95} /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[BW / 2 + 0.0002, 0.006 + i * TH / 10, 0]}><boxGeometry args={[0.0008, 0.0009, BD - 0.012]} /><meshBasicMaterial color="#c9bea6" /></mesh>)}
    {/* espiral del lomo: anillos de alambre */}
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-BW / 2 + 0.002, 0.006 + TH / 2, -BD / 2 + 0.012 + i * (BD - 0.024) / 21]} rotation={[0, 0, 0]}><torusGeometry args={[TH * 0.62, 0.0012, 6, 20]} />{M.steel()}</mesh>)}
    {/* la página derecha (la REAL) */}
    <mesh position={[0.003, 0.0045 + TH, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BW - 0.012, BD - 0.012]} /><meshStandardMaterial key={page ? "t" : "n"} map={page ?? null} color={page ? "#ffffff" : PAPER} roughness={0.88} /></mesh>
    {/* la hoja que pasa encima de la real */}
    {flip > 0.002 && flip < 0.998 && <group position={[-BW / 2 + 0.004, 0.0052 + TH, 0]}><Leaf ang={Math.PI * eio(flip, 0, 1)} front={under} back={null} /></group>}
    {/* tapa con bisagra en el lomo */}
    <group position={[-BW / 2 + 0.002, 0.006 + TH + 0.002, 0]} rotation={[0, 0, ang]}>
      <group position={[BW / 2 + 0.003, 0, 0]}>
        <RBox s={[BW + 0.008, 0.007, BD + 0.008]} r={0.002}>{M.matte({ col: "#13243f" })}</RBox>
        <mesh position={[0, 0.0037, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW + 0.004, BD + 0.004]} /><meshPhysicalMaterial key={cover ? "t" : "n"} map={cover ?? null} roughness={0.32} clearcoat={0.5} clearcoatRoughness={0.25} /></mesh>
        <mesh position={[0, -0.0037, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW - 0.004, BD - 0.004]} /><meshStandardMaterial color="#1b2a44" roughness={0.6} /></mesh>
        <group position={[0, -0.0044, 0]} rotation={[0, Math.PI, 0]}><group rotation={[Math.PI / 2, 0, 0]}>
          <Txt3 txt="THE WINTER" w={0.24} h={0.05} col="#e8c46a" weight={900} p={[0, 0.07, 0]} />
          <Txt3 txt="BLACKOUT" w={0.24} h={0.06} col="#e8c46a" weight={900} p={[0, 0.0, 0]} />
          <Txt3 txt="MANUAL" w={0.24} h={0.05} col="#e8c46a" weight={900} p={[0, -0.07, 0]} />
          <mesh position={[0, -0.12, 0]}><planeGeometry args={[0.2, 0.004]} /><meshBasicMaterial color="#e8c46a" /></mesh>
        </group></group>
      </group>
    </group>
  </group>;
};

// la tarjeta impresa: QR arriba y la línea de la descripción escrita abajo (cara a cámara, apoyada en el banco)
const QRCard: React.FC<{ qr?: THREE.Texture | null; k: number }> = ({ qr, k }) => <group position={[lerp(0.06, 0.36, k), lerp(0.003, 0.008, cl(k * 3)), 0.04]} rotation={[-Math.PI / 2, 0, -0.05 * k]} scale={k > 0.001 ? 1.42 : 0.001}>
  {/* sombra de contacto corrida, para que la tarjeta se despegue del banco */}
  <mesh position={[0.008, -0.03, -0.0005]}><planeGeometry args={[0.24, 0.36]} /><meshBasicMaterial color="#000" transparent opacity={0.4} depthWrite={false} /></mesh>
  <mesh position={[0, -0.022, 0.0015]} castShadow><boxGeometry args={[0.22, 0.35, 0.002]} /><meshStandardMaterial color="#f6efdc" roughness={0.85} /></mesh>
  <mesh position={[0, 0.06, 0.0027]}><planeGeometry args={[0.175, 0.175]} /><meshBasicMaterial key={qr ? "t" : "n"} map={qr ?? null} toneMapped={false} /></mesh>
  <Txt3 txt="THE LINK IS IN THE" w={0.2} h={0.046} col="#0b1220" bg="#e9e2d0" glow weight={900} p={[0, -0.045, 0.003]} />
  <Txt3 txt="FIRST LINE OF THE" w={0.2} h={0.046} col="#0b1220" bg="#e9e2d0" glow weight={900} p={[0, -0.093, 0.003]} />
  <Txt3 txt="DESCRIPTION" w={0.2} h={0.046} col="#0b1220" bg="#e9e2d0" glow weight={900} p={[0, -0.141, 0.003]} />
  {/* flecha-gancho a mano, en tinta roja, que baja hacia la descripción */}
  <mesh position={[0, 0, 0.003]} visible={false} geometry={tubeG("ctaarr", [[0.092, -0.07, 0], [0.1, -0.12, 0], [0.085, -0.16, 0], [0.06, -0.185, 0]], 0.0035, 24, 6)}><meshBasicMaterial color="#c62a22" /></mesh>
  <mesh position={[0.052, -0.19, 0.003]} rotation={[0, 0, 2.2]} visible={false}><coneGeometry args={[0.011, 0.024, 3]} /><meshBasicMaterial color="#c62a22" /></mesh>
</group>;

// cinta de rotuladora con el nombre del manual, pegada al banco arriba del libro
const NameTape: React.FC<{ k: number }> = ({ k }) => <group position={[-0.06, 0.006, -0.272]} rotation={[-Math.PI / 2, 0, 0.012]} scale={[Math.max(0.001, k) * 1.25, 1.25, 1.25]}>
  <RBox s={[0.5, 0.05, 0.003]} r={0.004}>{M.plastic({ col: "#1b2a44" })}</RBox>
  <Txt3 txt="THE WINTER BLACKOUT MANUAL" w={0.47} h={0.04} col="#f6efe0" bg="#1b2a44" weight={900} p={[0, 0, 0.002]} op={cl(k * 1.4 - 0.4)} />
</group>;

// el banco de Gary: sólo la madera y un lápiz (nada que distraiga del manual)
const Bench: React.FC = () => <>
  <mesh position={[0, -0.03, 0]} receiveShadow><boxGeometry args={[2.4, 0.06, 1.2]} /><meshStandardMaterial map={tex.wood(3, 1, [138, 92, 52])} roughness={0.72} /></mesh>
</>;

// at/out del tramo; page = la página REAL donde queda abierto, under = la hoja que pasa (otra página real)
export const ManualCTA: React.FC<{ t: number; h: H; page: string; under?: string }> = ({ t, h, page, under }) => {
  const cover = useImg(P + "man/tapa.png"), pg = useImg(P + "man/" + page), un = useImg(under ? P + "man/" + under : undefined), qr = useImg(P + "man/qr.png");
  // cámara: de costado bajo sobre el manual cerrado a casi cenital, con la página real llenando el cuadro
  return <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#120e0b" key1={[-0.5, 1.9, 0.9]} warm={1.15} lamp={[0.1, 0.55, 0.2]}
    cam={{ at: [-0.02, 0.02, 0.03], at1: [0.04, 0.02, 0.0], az: [-0.5, 0.0], el: [0.62, 1.38], r: [0.62, 1.44], fov: 30 }}>{(k) => {
    // k = tiempo de acción (0..~5,6): cae el manual, aparece la cinta, se abre, pasa una hoja, se apoya la tarjeta
    const land = phys(k, 0.05, 7, 0.5), open = cl((k - 0.4) / 1.1), flip = un ? cl((k - 2.1) / 1.0) : 0, qk = cl(phys(k, 3.0, 6.5, 0.5)), nk = eio(k, 2.1, 2.7);
    return <>
      <Bench />
      <mesh position={[0.01, 0.001, 0.01]} rotation={[-Math.PI / 2, 0, 0]} scale={Math.max(0.001, cl(land))}><planeGeometry args={[BW + 0.06, BD + 0.06]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh>
      <group position={[0, 0.32 * Math.max(0, 1 - land), 0]} rotation={[0.25 * (1 - cl(land)), -0.02, 0]}><Manual open={open} flip={flip} cover={cover} page={pg} under={un} /></group>
      <QRCard qr={qr} k={qk} />
    </>;
  }}</Scene3D>;
};
// lerp queda exportado por si un video quiere mover el manual a otra parte del banco
export { lerp };
