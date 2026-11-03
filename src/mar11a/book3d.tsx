// mar11 (Marcus) · CTA del MANUAL dentro del mundo (feedback_cta_guia_3d_dentro_del_mundo): el manual impreso descansa sobre el banco de Marcus
// (madera, multímetro, taza), la cámara baja en curva, la tapa se abre por el lomo, una hoja pasa y queda la página REAL del PDF
// a la derecha; al lado, la tarjeta impresa con el QR grande (URL corta /g). En pantalla sólo el nombre del manual y
// «the link is in the first line of the description». Nunca una URL escrita. Render SÓLO en el farm (acá sólo stills).
import React from "react";
import * as THREE from "three";
import { FONT, H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, tex, useImg } from "./h3d";
import { P } from "./lib";

const PAPER = "#f4efe3";
const BW = 0.3, BD = 0.388, TH = 0.028;   // el manual: carta (935×1210), 100 páginas

// hoja que gira sobre el lomo (x=0) de 0 a π; front = cara de arriba al empezar, back = la que queda a la izquierda
const Leaf: React.FC<{ ang: number; front?: THREE.Texture | null; back?: THREE.Texture | null }> = ({ ang, front, back }) => {
  const bend = Math.sin(ang) * 0.05;
  return <group rotation={[0, 0, ang]}>
    <group position={[BW / 2 - 0.004, bend * 0.4, 0]} rotation={[0, 0, -bend]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0004, 0]}><planeGeometry args={[BW - 0.01, BD - 0.008]} /><meshStandardMaterial map={front ?? null} color={PAPER} roughness={0.9} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.0004, 0]}><planeGeometry args={[BW - 0.01, BD - 0.008]} /><meshStandardMaterial map={back ?? null} color={PAPER} roughness={0.9} /></mesh>
    </group>
  </group>;
};

export const Manual: React.FC<{ open: number; flip: number; cover?: THREE.Texture | null; page?: THREE.Texture | null; under?: THREE.Texture | null; hl?: number }> = ({ open, flip, cover, page, under, hl = 0 }) => {
  const ang = Math.PI * eio(open, 0, 1) * 0.985;
  return <group>
    {/* contratapa y bloque de hojas con canto rayado */}
    <RBox s={[BW + 0.01, 0.004, BD + 0.01]} p={[0, 0.002, 0]} r={0.002}>{M.matte({ col: "#13243f" })}</RBox>
    <mesh position={[0.003, 0.004 + TH / 2, 0]} castShadow receiveShadow><boxGeometry args={[BW - 0.006, TH, BD - 0.006]} /><meshStandardMaterial color="#e7e0cf" roughness={0.95} /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[BW / 2 + 0.0002, 0.006 + i * TH / 10, 0]}><boxGeometry args={[0.0008, 0.0009, BD - 0.012]} /><meshBasicMaterial color="#c9bea6" /></mesh>)}
    {/* espiral del lomo: anillos de alambre */}
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-BW / 2 + 0.002, 0.006 + TH / 2, -BD / 2 + 0.012 + i * (BD - 0.024) / 21]} rotation={[0, 0, 0]}><torusGeometry args={[TH * 0.62, 0.0012, 6, 20]} />{M.steel()}</mesh>)}
    {/* la página derecha (la REAL) */}
    <mesh position={[0.003, 0.0045 + TH, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[BW - 0.012, BD - 0.012]} /><meshStandardMaterial map={page ?? null} color={page ? "#ffffff" : PAPER} roughness={0.88} /></mesh>
    {/* marcador amarillo que se pinta sobre el título de la página real */}
    {hl > 0 && <mesh position={[0.003 - (BW - 0.05) / 2 * (1 - hl) , 0.0049 + TH, -BD / 2 + 0.052]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[(BW - 0.05) * hl, 0.034]} /><meshBasicMaterial color="#ffe14a" transparent opacity={0.5} depthWrite={false} /></mesh>}
    {/* la hoja que pasa encima de la real */}
    {flip > 0.002 && flip < 0.998 && <group position={[-BW / 2 + 0.004, 0.0052 + TH, 0]}><Leaf ang={Math.PI * eio(flip, 0, 1)} front={under} back={null} /></group>}
    {/* tapa con bisagra en el lomo */}
    <group position={[-BW / 2 + 0.002, 0.006 + TH + 0.002, 0]} rotation={[0, 0, ang]}>
      <group position={[BW / 2 + 0.003, 0, 0]}>
        <RBox s={[BW + 0.008, 0.003, BD + 0.008]} r={0.0012}>{M.matte({ col: "#13243f" })}</RBox>
        <mesh position={[0, 0.0017, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW + 0.004, BD + 0.004]} /><meshPhysicalMaterial map={cover ?? null} roughness={0.32} clearcoat={0.5} clearcoatRoughness={0.25} /></mesh>
        <mesh position={[0, -0.0017, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[BW - 0.004, BD - 0.004]} /><meshStandardMaterial color={PAPER} roughness={0.92} /></mesh>
      </group>
    </group>
  </group>;
};

// la tarjeta impresa con el QR, al lado del manual (nunca encima de la página), con su sombra de contacto
const QRCard: React.FC<{ qr?: THREE.Texture | null; k: number }> = ({ qr, k }) => <group position={[0.29, 0.003 + 0.45 * (1 - k) + 0.02 * Math.max(0, Math.sin(cl((k - 0.82) / 0.18) * Math.PI)), 0.0]} rotation={[-Math.PI / 2, 0, -0.05 + (1 - k) * 0.6]}>
  <mesh position={[0, 0, -0.002]}><planeGeometry args={[0.24, 0.24]} /><meshBasicMaterial color="#000" transparent opacity={0.35 * k} depthWrite={false} /></mesh>
  <mesh position={[0, 0, 0.0015]} castShadow><boxGeometry args={[0.2, 0.2, 0.002]} /><meshStandardMaterial color="#f4ecd8" roughness={0.85} /></mesh>
  <mesh position={[0, 0, 0.0027]}><planeGeometry args={[0.185, 0.185]} /><meshBasicMaterial map={qr ?? null} toneMapped={false} /></mesh>
</group>;

// vuelta 2 (EVALUADOR: «taza y teléfono de relleno, título repetido sobre la tapa, QR tapando la página»): sólo la mesa de madera
const Bench: React.FC = () => <mesh position={[0, -0.03, 0]} receiveShadow><boxGeometry args={[2.4, 0.06, 1.2]} /><meshStandardMaterial map={tex.wood(3, 1, [138, 92, 52])} roughness={0.72} /></mesh>;

// at/out del tramo; page = archivo de la página real (p55.png), under = la hoja que pasa (otra página real)
export const ManualCTA: React.FC<{ t: number; h: H; page: string; under?: string }> = ({ t, h, page, under }) => {
  const cover = useImg(P + "man/tapa.png"), pg = useImg(P + "man/" + page), un = useImg(under ? P + "man/" + under : undefined), qr = useImg(P + "man/qr.png");
  const dur = h.out - h.at, tt = t - h.at;
  // un solo letrero, grande y abajo, cuando ya está el QR: la línea de la descripción (el nombre lo dice la tapa)
  const a2 = cl((tt - dur * 0.55) / 0.6) * (1 - cl((tt - dur + 0.4) / 0.5));
  return <Scene3D t={t} h={h} mode="cut" floor="none" wall="none" bg="#120e0b" key1={[-0.5, 1.9, 0.9]} warm={0.9} lamp={[0.1, 0.55, 0.2]}
    cam={{ at: [-0.05, 0.02, 0.02], at1: [0.05, 0.02, 0.02], az: [-0.45, 0.0], el: [0.75, 1.36], r: [1.08, 1.0], fov: 30 }}
    over={() => <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,8,6,.86)", opacity: a2 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: 1.05, whiteSpace: "nowrap", textAlign: "center", color: "#ffd27a", transform: `translateY(${(1 - a2) * 20}px)`, textShadow: "0 6px 26px rgba(0,0,0,.9)" }}>The link is in the first line of the description</div>
    </div>}>{(k) => {
    // k = tiempo de acción (0..~5,6): cae el manual, se abre, pasa una hoja hasta la página del capítulo, cae la tarjeta del QR al lado
    const land = phys(k, 0.0, 6, 0.45), open = cl((k - 0.8) / 1.1), flip = un ? cl((k - 1.8) / 0.9) : 0, qk = cl(phys(k, 2.7, 6.5, 0.5));
    return <>
      <Bench />
      <group position={[0, 0.3 * (1 - land), 0]} rotation={[0, -0.04 + 0.5 * (1 - land), 0]}><Manual open={open} flip={flip} cover={cover} page={pg} under={un} hl={cl((k - 2.9) / 0.7)} /></group>
      <QRCard qr={qr} k={qk} />
    </>;
  }}</Scene3D>;
};
// lerp queda exportado por si un video quiere mover el manual a otra parte del banco
export { lerp };
