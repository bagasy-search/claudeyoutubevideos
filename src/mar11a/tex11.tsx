// mar11 · texturas de FOTO real para el 3D (vuelta 1 del EVALUADOR: «el pasto parece ruido, el ladrillo de dibujito, las hojas de cartón»).
// Cada mapa se carga una vez por (nombre, repetición) y el cuadro espera a que llegue: nunca un recuadro negro.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { V3, env } from "../kits/r3k/r3k";
import { P } from "./lib";

const TX = new Map<string, THREE.Texture>();
// 03-nov: una sola carga por textura y UN solo advance por tanda (antes cada hoja hacía su advance → 240 renders
// completos en el GL por software del farm = timeout de 183 s en leafstorm/rakegust)
const LOADING = new Map<string, Promise<THREE.Texture | null>>();
const PEND = new Map<(t: number) => void, number[]>();
const loadTex = (name: string, key: string, rep: [number, number]) => {
  if (!LOADING.has(key)) LOADING.set(key, new Promise((res) => new THREE.TextureLoader().load(staticFile(P + "tex/" + name), (tx: THREE.Texture) => {
    tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(rep[0], rep[1]);
    TX.set(key, tx); res(tx);
  }, undefined, () => res(null))));
  return LOADING.get(key)!;
};
export const useTex = (name: string, rep: [number, number] = [1, 1]) => {
  const key = `${name}|${rep[0]}|${rep[1]}`;
  const [t, setT] = useState<THREE.Texture | null>(TX.get(key) ?? null);
  const [hd] = useState(() => (TX.has(key) ? null : delayRender("tex " + key)));
  const { advance } = useThree();
  useEffect(() => {
    if (TX.has(key)) { setT(TX.get(key)!); return; }
    loadTex(name, key, rep).then((tx) => { if (tx) setT(tx); else if (hd !== null) continueRender(hd); });
  }, [key]);
  useEffect(() => {
    if (!t || hd === null) return;
    const q = PEND.get(advance);
    if (q) { q.push(hd); return; }
    PEND.set(advance, [hd]);
    requestAnimationFrame(() => { advance(performance.now()); requestAnimationFrame(() => { const hs = PEND.get(advance) ?? []; PEND.delete(advance); hs.forEach((h) => continueRender(h)); }); });
  }, [t]);
  return t;
};

// pasto con helada de foto, con el borde lejano que se funde (no se ve el canto de la losa)
export const PhotoGround: React.FC<{ w?: number; d?: number; name?: string; rep?: number; tint?: string }> = ({ w = 7, d = 5, name = "t_pasto.jpg", rep = 0.9, tint = "#ffffff" }) => {
  const t = useTex(name, [rep * w / 4, rep * d / 4]);
  if (!t) return null;
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeGeometry args={[w, d]} /><meshStandardMaterial map={t} color={tint} roughness={0.95} />
  </mesh>;
};
env(PhotoGround);
// pared de foto (ladrillo, pared pintada, chapa): caja fina de frente a +z
export const PhotoWall: React.FC<{ w?: number; h?: number; z?: number; x?: number; y?: number; name?: string; rep?: number; tint?: string }> = ({ w = 6, h = 3, z = -0.6, x = 0, y, name = "t_ladrillo.jpg", rep = 1, tint = "#ffffff" }) => {
  const t = useTex(name, [rep * w / 2.5, rep * h / 2.5]);
  if (!t) return null;
  return <mesh position={[x, y ?? h / 2, z]} receiveShadow><boxGeometry args={[w, h, 0.1]} /><meshStandardMaterial map={t} color={tint} roughness={0.9} /></mesh>;
};
env(PhotoWall);
// plano con foto (aletas, chapa, tierra, madera): de frente a +z
export const PhotoPl: React.FC<{ w: number; h: number; name: string; p?: V3; r?: V3; rep?: [number, number]; tint?: string; ro?: number; m?: number; e?: number }> = ({ w, h, name, p = [0, 0, 0], r = [0, 0, 0], rep = [1, 1], tint = "#ffffff", ro = 0.6, m = 0, e = 0 }) => {
  const t = useTex(name, rep);
  if (!t) return null;
  return <mesh position={p} rotation={r} receiveShadow castShadow><planeGeometry args={[w, h]} />
    <meshStandardMaterial map={t} color={tint} roughness={ro} metalness={m} emissive={e ? tint : "#000"} emissiveIntensity={e} side={THREE.DoubleSide} /></mesh>;
};
// hoja seca de verdad (foto recortada con alfa), arce o roble; tilt = cuánto se curva al caer
export const PhotoLeaf: React.FC<{ p: V3; r?: V3; s?: number; kind?: number }> = ({ p, r = [0, 0, 0], s = 1, kind = 0 }) => {
  const t = useTex(kind % 2 ? "t_hoja_arce.png" : "t_hoja_roble.png");
  if (!t) return null;
  return <mesh position={p} rotation={r} scale={s} castShadow>
    <planeGeometry args={[0.13, 0.16]} />
    <meshStandardMaterial map={t} transparent alphaTest={0.4} roughness={0.85} side={THREE.DoubleSide} />
  </mesh>;
};
