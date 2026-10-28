// Accesorios de cabeza (mismo material/estilo arcilla). Van dentro del grupo de la cabeza (siguen su rotación).
import React, { useMemo } from "react";
import * as THREE from "three";
import { PROPORCIONES as P } from "./proporciones";

export type NombreAccesorio = "gorra" | "anteojos" | "casco" | "monio";

const R = P.cabeza.radio;

const mat = (color: string, rug = 0.55) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color), roughness: rug, metalness: 0, sheen: 0.2, clearcoat: 0.08, clearcoatRoughness: 0.6 });

export const Accesorios: React.FC<{ lista: NombreAccesorio[]; piel: THREE.Material }> = ({ lista, piel }) => {
  const m = useMemo(() => ({
    gorra: mat("#d9433b"), visera: mat("#c23a33"), casco: mat("#f2b632", 0.4), negro: mat("#2f2f31", 0.35), vidrio: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transmission: 0.0, transparent: true, opacity: 0.18 }),
  }), []);
  const geo = useMemo(() => ({
    cupula: new THREE.SphereGeometry(R * 1.03, 96, 48, 0, Math.PI * 2, 0, Math.PI * 0.42),
    visera: new THREE.CylinderGeometry(R * 0.62, R * 0.62, 0.035, 64, 1, false, -Math.PI * 0.42, Math.PI * 0.84),
    aro: new THREE.TorusGeometry(0.085, 0.014, 16, 64),
    puente: new THREE.CylinderGeometry(0.012, 0.012, 0.09, 12),
    lente: new THREE.CircleGeometry(0.08, 48),
    ala: new THREE.TorusGeometry(R * 1.05, 0.028, 16, 96),
    moño: new THREE.SphereGeometry(0.17, 48, 32),
  }), []);
  const tiene = (n: NombreAccesorio) => lista.includes(n);
  return (
    <group>
      <group visible={tiene("gorra")} rotation={[-0.18, 0, 0]}>
        <mesh geometry={geo.cupula} material={m.gorra} castShadow receiveShadow />
        <mesh geometry={geo.visera} material={m.visera} position={[0, R * 0.42, R * 0.55]} rotation={[0.18, Math.PI / 2, 0]} scale={[1, 1, 1]} castShadow receiveShadow />
      </group>
      <group visible={tiene("casco")} rotation={[-0.12, 0, 0]}>
        <mesh geometry={geo.cupula} material={m.casco} scale={1.05} castShadow receiveShadow />
        <mesh geometry={geo.ala} material={m.casco} position={[0, R * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.05, 1]} castShadow receiveShadow />
      </group>
      <group visible={tiene("anteojos")} position={[0, P.cara.ojoY, 0]}>
        {[1, -1].map((s) => {
          const x = s * P.cara.ojoSep / 2, z = Math.sqrt(R * R - x * x - P.cara.ojoY ** 2) + 0.03;
          return (
            <group key={s} position={[x, 0, z]} rotation={[0, s * Math.asin(x / R) * 0.9, 0]}>
              <mesh geometry={geo.aro} material={m.negro} castShadow />
              <mesh geometry={geo.lente} material={m.vidrio} />
            </group>
          );
        })}
        <mesh geometry={geo.puente} material={m.negro} position={[0, 0.02, R - 0.0]} rotation={[0, 0, Math.PI / 2]} />
      </group>
      <mesh visible={tiene("monio")} geometry={geo.moño} material={piel} position={[-0.05, R * 0.95, -R * 0.35]} castShadow receiveShadow />
    </group>
  );
};
