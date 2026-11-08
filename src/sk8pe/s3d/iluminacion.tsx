// Luz y estudio calcados de la ref: entorno PMREM armado por código (cielo neutro, rebote azul del piso,
// softbox arriba-izquierda), principal cálida arriba-izquierda-frente con sombra suave, relleno frío desde la
// derecha, contraluz para despegar el borde, atrapa-sombras en el piso y fondo de estudio a pantalla completa.
// ⛔ Luces SIEMPRE montadas (se apagan con intensidad), shadow map de tamaño fijo, nada condicional entre cuadros.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { crearMatFondoEstudio } from "./material";
import type { V3 } from "./geometria";

export type Camara = { pos: V3; mira: V3; fov: number };

export const Camara3D: React.FC<Camara> = ({ pos, mira, fov }) => {
  const { camera } = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...pos); c.up.set(0, 1, 0); c.lookAt(...mira);
  c.fov = fov; c.near = 0.5; c.far = 120; c.updateProjectionMatrix();
  return null;
};

// entorno armado por código: esfera con degradé + softbox + rebote del piso
const crearEntorno = (gl: THREE.WebGLRenderer, tinte: THREE.Color, piso: THREE.Color) => {
  const sc = new THREE.Scene();
  const cielo = new THREE.Mesh(new THREE.SphereGeometry(50, 64, 32), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uTinte: { value: tinte }, uPiso: { value: piso } },
    vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `varying vec3 vD; uniform vec3 uTinte; uniform vec3 uPiso;
      void main(){
        float y = vD.y;
        vec3 arriba = vec3(0.92, 0.94, 0.98) * uTinte;
        vec3 horiz = mix(mix(uPiso, vec3(0.5), 0.5) * 1.4, vec3(0.55, 0.62, 0.72) * uTinte, 0.55);
        vec3 suelo = mix(uPiso, vec3(0.5, 0.52, 0.55), 0.55); // rebote del piso apagado: la ref apenas azulea la base de la cabeza
        vec3 c = y > 0.0 ? mix(horiz, arriba, pow(y, 0.6)) : mix(horiz, suelo, pow(-y, 0.5));
        gl_FragColor = vec4(c, 1.0);
      }`,
  }));
  sc.add(cielo);
  // softbox grande arriba-izquierda-frente (el brillo de la cabeza de la ref)
  const sb = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 3.0, 2.8), side: THREE.DoubleSide }));
  sb.position.set(-18, 22, 20); sb.lookAt(0, 0, 0); sc.add(sb);
  // tira fría a la derecha-atrás (filo del borde)
  const tira = new THREE.Mesh(new THREE.PlaneGeometry(6, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.9, 2.3), side: THREE.DoubleSide }));
  tira.position.set(26, 10, -18); tira.lookAt(0, 2, 0); sc.add(tira);
  const pm = new THREE.PMREMGenerator(gl);
  const rt = pm.fromScene(sc, 0.03);
  pm.dispose();
  return rt.texture;
};

export type LuzEscena = {
  dir?: V3; // de dónde viene la luz principal (vector hacia la luz)
  intensidad?: number;
  color?: string;
  relleno?: number;
  contraluz?: number;
  entorno?: number;
  tinte?: string; // color del lugar (afecta entorno y relleno)
  piso?: string; // color del rebote del piso
  sombra?: number; // opacidad de la sombra proyectada en el piso
  centro?: V3; // a dónde apunta la luz (centro de la escena)
  extension?: number; // medio ancho de la cámara de sombras
};

export const Luces: React.FC<LuzEscena> = ({
  dir = [-0.45, 1.5, 0.8], intensidad = 2.6, color = "#fff3e6", relleno = 0.7, contraluz = 1.25, entorno = 0.8,
  tinte = "#dfe9f5", piso = "#1f5f80", sombra = 0.035, centro = [0, 1.6, 0], extension = 4,
}) => {
  const { gl, scene } = useThree();
  const tinteC = useMemo(() => new THREE.Color(tinte), [tinte]);
  const pisoC = useMemo(() => new THREE.Color(piso), [piso]);
  const env = useMemo(() => crearEntorno(gl, tinteC, pisoC), [gl, tinteC, pisoC]);
  scene.environment = env;
  scene.environmentIntensity = entorno;
  const objetivo = useMemo(() => new THREE.Object3D(), []);
  objetivo.position.set(...centro);
  const d = new THREE.Vector3(...dir).normalize();
  const pos = d.clone().multiplyScalar(14).add(new THREE.Vector3(...centro));
  const rel = new THREE.Vector3(0.85, 0.35, 0.6).normalize().multiplyScalar(14).add(new THREE.Vector3(...centro));
  const con = new THREE.Vector3(0.45, 0.55, -0.85).normalize().multiplyScalar(14).add(new THREE.Vector3(...centro));
  // relleno/contraluz se espejan si la luz principal viene de la derecha
  if (d.x > 0) { rel.x = -rel.x + 2 * centro[0]; con.x = -con.x + 2 * centro[0]; }
  return (
    <>
      <primitive object={objetivo} />
      <directionalLight position={pos} target={objetivo} intensity={intensidad} color={color} castShadow
        shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-bias={-0.0003} shadow-normalBias={0.025}
        shadow-camera-left={-extension} shadow-camera-right={extension} shadow-camera-top={extension} shadow-camera-bottom={-extension}
        shadow-camera-near={1} shadow-camera-far={40} shadow-radius={6} />
      <directionalLight position={rel} target={objetivo} intensity={relleno} color={tinteC} />
      <directionalLight position={con} target={objetivo} intensity={contraluz} color="#d7ebff" />
      <hemisphereLight args={[tinteC, pisoC, 0.25]} />
      {/* atrapa-sombras: el piso sólo oscurece (sirve igual sobre el estudio o sobre una foto) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centro[0], 0.0005, centro[2]]} receiveShadow renderOrder={-1}>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={sombra} color="#04112a" depthWrite={false} />
      </mesh>
    </>
  );
};

// fondo de estudio a pantalla completa (degradé de la ref)
export const FondoEstudio: React.FC<{ tinte?: V3 }> = ({ tinte = [1, 1, 1] }) => {
  const { gl } = useThree();
  const res = useMemo(() => new THREE.Vector2(), []);
  gl.getDrawingBufferSize(res);
  const mat = useMemo(() => crearMatFondoEstudio(res), [res]);
  (mat.uniforms.uTinte.value as THREE.Vector3).set(...tinte);
  const geo = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={-1000} />;
};
