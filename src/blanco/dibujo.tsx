// <Dibujo>: pasa los personajes 3D al estilo de los fondos pintados. Va dentro del ThreeCanvas de Capa3D.
// 1) sombreado cel: la luz que calcula three (con su AO de cápsulas) se cuantiza en 3 tonos (luz / medio / sombra cálida)
//    y sale sin tone mapping, para que el blanco quede blanco como en la ilustración.
// 2) contorno marrón oscuro por casco invertido: una copia de cada malla marcada (userData.contorno: piel, ropa) con la
//    cara de atrás, inflada en el espacio de vista un ancho fijo en PÍXELES de pantalla (igual en plano general y primer plano).
// Determinista: se arma una vez por malla y en cada cuadro sólo se actualiza el ancho (useFrame corre dentro de advance).
import React, { useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const CEL = /* glsl */ `
{
  vec3 base = max(diffuseColor.rgb, vec3(0.002));
  float lb = dot(base, vec3(0.2126, 0.7152, 0.0722));
  float lo = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
  float s = lo / lb; // cuánta luz le llega (1 ≈ de frente a la principal)
  vec3 medio = base * vec3(0.86, 0.80, 0.77);
  vec3 sombra = base * vec3(0.50, 0.40, 0.37);
  vec3 c = mix(sombra, medio, smoothstep(uCelA - 0.03, uCelA + 0.03, s));
  c = mix(c, base, smoothstep(uCelB - 0.03, uCelB + 0.03, s));
  float lc = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = max(vec3(0.0), mix(vec3(lc), c, uSat)); // los de adelante más saturados que el fondo pintado (énfasis sin hacer nada)
  outgoingLight = c;
}
`;

const toonificar = (m: THREE.MeshPhysicalMaterial, u: { uCelA: { value: number }; uCelB: { value: number }; uSat: { value: number } }) => {
  if (m.userData.cel) return;
  m.userData.cel = true;
  const prev = m.onBeforeCompile;
  const clave = m.customProgramCacheKey();
  m.onBeforeCompile = (sh: any, r: any) => {
    prev.call(m, sh, r);
    Object.assign(sh.uniforms, u);
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uCelA;\nuniform float uCelB;\nuniform float uSat;")
      .replace("#include <opaque_fragment>", CEL + "#include <opaque_fragment>");
  };
  m.customProgramCacheKey = () => clave + "|cel";
  m.toneMapped = false;
  m.needsUpdate = true;
};

const crearMatContorno = (u: { uAncho: { value: number } }, color: string) => new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: { ...u, uColor: { value: new THREE.Color(color) } },
  vertexShader: /* glsl */ `
    uniform float uAncho;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vec3 n = normalize(normalMatrix * normal);
      mv.xyz += n * uAncho;
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    void main() { gl_FragColor = vec4(uColor, 1.0);
      #include <colorspace_fragment>
    }`,
  toneMapped: false,
});

export type OpcionesDibujo = { px?: number; color?: string; celA?: number; celB?: number; sat?: number };

export const Dibujo: React.FC<OpcionesDibujo> = ({ px = 3, color = "#3a2414", celA = 0.9, celB = 1.6, sat = 1.4 }) => {
  const { scene } = useThree();
  const u = useMemo(() => ({ uAncho: { value: 0.03 }, uCelA: { value: celA }, uCelB: { value: celB }, uSat: { value: sat } }), [celA, celB, sat]);
  const mat = useMemo(() => crearMatContorno(u, color), [u, color]);
  useFrame(({ camera }) => {
    const cam = camera as THREE.OrthographicCamera;
    // unidades del mundo por píxel de pantalla; el trazo engorda apenas en los primeros planos (como un dibujante)
    const upx = (cam.right - cam.left) / 1920;
    const zoom = 960 / 93 / Math.max(1e-3, cam.right);
    u.uAncho.value = upx * px * (0.85 + 0.15 * Math.min(4, zoom));
    const mallas: THREE.Mesh[] = [];
    scene.traverse((o: THREE.Object3D) => { if ((o as THREE.Mesh).isMesh && !o.userData.esContorno) mallas.push(o as THREE.Mesh); });
    for (const m of mallas) {
      const ma = m.material as THREE.MeshPhysicalMaterial;
      if (Array.isArray(ma) || !ma) continue;
      if ((ma as THREE.MeshPhysicalMaterial).isMeshStandardMaterial && !ma.transparent) toonificar(ma, u);
      if (!ma.userData?.contorno) continue;
      let c = m.userData.contorno as THREE.Mesh | undefined;
      if (!c) {
        c = new THREE.Mesh(m.geometry, mat);
        c.userData.esContorno = true;
        c.raycast = () => {};
        m.add(c);
        m.userData.contorno = c;
      }
      c.geometry = m.geometry;
      c.visible = ma.visible !== false;
    }
  });
  return null;
};
