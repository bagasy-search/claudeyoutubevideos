// Helicóptero de arcilla gris, por código: cabina por secciones (superelipse cuadrada), botalón de cola,
// deriva, estabilizadores, rotor principal de 4 palas + disco de giro, rotor de cola, patines, ventanas de vidrio
// oscuro (parches de la misma superficie), puerta abierta con interior negro, motor, reflector con haz
// volumétrico y halo. El haz y el halo llevan userData.sinPost (no entran al AO ni a la profundidad).
import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const CX0 = -1.0, CL = 2.25, NE = 3.4;
const CU = [0, 0.12, 0.3, 0.55, 0.75, 0.86];
const CH = [0.2, 0.44, 0.5, 0.5, 0.46, 0.4];
const CW = [0.2, 0.4, 0.45, 0.45, 0.42, 0.37];
const CC = [0.2, 0.06, 0.02, 0.0, -0.03, -0.05];
const tab = (T: number[], u: number) => {
  if (u >= 0.86) return T[T.length - 1];
  let i = 0; while (i < CU.length - 2 && CU[i + 1] < u) i++;
  const k = (u - CU[i]) / (CU[i + 1] - CU[i]), s = k * k * (3 - 2 * k);
  return T[i] + (T[i + 1] - T[i]) * s;
};
const sp = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);
const punta = (u: number) => (u <= 0.86 ? 1 : Math.sqrt(Math.max(0, 1 - ((u - 0.86) / 0.14) ** 2)));
const pCabina = (u: number, th: number, o = new THREE.Vector3()) => {
  const f = punta(u), h = tab(CH, u) * (0.35 + 0.65 * f), w = tab(CW, u) * f, c = tab(CC, u) - (u > 0.86 ? 0.12 * (u - 0.86) / 0.14 : 0);
  const s = Math.sin(th), co = Math.cos(th);
  return o.set(CX0 + CL * u, c + h * sp(s, 2 / NE) * (s < 0 ? 0.9 : 1), w * sp(co, 2 / NE));
};
const sup = (u0: number, u1: number, nu: number, t0: number, t1: number, nt: number, off = 0) => {
  const pos: number[] = [], nor: number[] = [], idx: number[] = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), du = new THREE.Vector3(), dt = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i <= nu; i++) for (let k = 0; k <= nt; k++) {
    const u = u0 + (u1 - u0) * (i / nu), th = t0 + (t1 - t0) * (k / nt);
    pCabina(u, th, a);
    pCabina(Math.min(1, u + 1e-3), th, b); pCabina(Math.max(0, u - 1e-3), th, c); du.subVectors(b, c);
    pCabina(u, th + 1e-3, b); pCabina(u, th - 1e-3, c); dt.subVectors(b, c);
    n.crossVectors(du, dt); if (n.lengthSq() < 1e-14) n.set(u > 0.5 ? 1 : -1, 0, 0); else n.normalize();
    a.addScaledVector(n, off);
    pos.push(a.x, a.y, a.z); nor.push(n.x, n.y, n.z);
  }
  const R = nt + 1;
  for (let i = 0; i < nu; i++) for (let k = 0; k < nt; k++) { const i0 = i * R + k; idx.push(i0, i0 + R, i0 + 1, i0 + 1, i0 + R, i0 + R + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
  return g;
};
const extr = (pts: [number, number][], prof: number, bisel: number) => {
  const s = new THREE.Shape(); s.moveTo(...pts[0]);
  for (let i = 1; i + 1 < pts.length; i += 2) s.quadraticCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  const g = new THREE.ExtrudeGeometry(s, { depth: prof, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 3, curveSegments: 20 });
  g.translate(0, 0, -prof / 2); return g;
};
const tuboEntre = (pts: THREE.Vector3[], r: number | ((s: number) => number), seg = 48) => {
  const c = new THREE.CatmullRomCurve3(pts);
  const g = new THREE.TubeGeometry(c, seg, typeof r === "number" ? r : 1, 20, false);
  if (typeof r !== "number") {
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= seg; i++) {
      const cc = c.getPointAt(i / seg), rr = r(i / seg);
      for (let j = 0; j <= 20; j++) { const k = i * 21 + j; p.setXYZ(k, cc.x + (p.getX(k) - cc.x) * rr, cc.y + (p.getY(k) - cc.y) * rr, cc.z + (p.getZ(k) - cc.z) * rr); }
    }
    g.computeVertexNormals();
  }
  return g;
};

const construir = () => {
  const cabina = sup(0, 1, 90, 0, Math.PI * 2, 72);
  const parabrisas = sup(0.7, 0.965, 24, 0.12 * Math.PI, 0.88 * Math.PI, 30, 0.004);
  const ventD = sup(0.47, 0.68, 14, -0.02 * Math.PI, 0.3 * Math.PI, 14, 0.004);
  const ventI = sup(0.47, 0.68, 14, 0.7 * Math.PI, 1.02 * Math.PI, 14, 0.004);
  const puerta = sup(0.22, 0.45, 18, -0.16 * Math.PI, 0.22 * Math.PI, 18, 0.004); // abierta: interior oscuro (lado +z)
  const ventPuertaI = sup(0.24, 0.44, 12, 0.72 * Math.PI, 1.0 * Math.PI, 10, 0.004);
  const botalon = tuboEntre([new THREE.Vector3(-0.85, 0.2, 0), new THREE.Vector3(-2.2, 0.3, 0), new THREE.Vector3(-3.55, 0.42, 0)], (s) => 0.17 * (1 - s) + 0.07 * s);
  const deriva = extr([[0.18, -0.08], [0.05, 0.25], [-0.18, 0.62], [-0.32, 0.6], [-0.3, 0.3], [-0.26, -0.06], [-0.2, -0.25], [0.0, -0.2], [0.18, -0.08]], 0.035, 0.015);
  deriva.translate(-3.42, 0.48, 0);
  const estab = new RoundedBoxGeometry(0.28, 0.035, 0.9, 3, 0.015); estab.translate(-2.95, 0.36, 0);
  const motor = new RoundedBoxGeometry(1.25, 0.32, 0.58, 5, 0.13); motor.translate(-0.25, 0.56, 0);
  const toma = new RoundedBoxGeometry(0.4, 0.2, 0.42, 4, 0.09); toma.translate(0.3, 0.6, 0);
  const mastil = new THREE.CylinderGeometry(0.045, 0.06, 0.26, 16); mastil.translate(0.0, 0.83, 0);
  const cubo = new THREE.SphereGeometry(0.09, 20, 12); cubo.scale(1, 0.6, 1); cubo.translate(0, 0.97, 0);
  const pala = new RoundedBoxGeometry(2.75, 0.022, 0.15, 2, 0.01); pala.translate(1.375 + 0.05, 0, 0);
  // patines + puntales
  const patines: THREE.BufferGeometry[] = [];
  for (const z of [0.46, -0.46]) {
    patines.push(tuboEntre([new THREE.Vector3(-0.95, -0.74, z), new THREE.Vector3(0.6, -0.74, z), new THREE.Vector3(0.95, -0.66, z), new THREE.Vector3(1.05, -0.56, z)], 0.032, 40));
    for (const x of [-0.45, 0.45]) patines.push(tuboEntre([new THREE.Vector3(x, -0.42, z * 0.6), new THREE.Vector3(x + 0.02, -0.6, z * 0.92), new THREE.Vector3(x, -0.74, z)], 0.026, 12));
  }
  const rotorCola = new RoundedBoxGeometry(0.6, 0.06, 0.012, 2, 0.005);
  // reflector bajo la nariz
  const caja = new THREE.CylinderGeometry(0.075, 0.085, 0.14, 24); caja.rotateZ(Math.PI / 2);
  const lente = new THREE.CircleGeometry(0.068, 32); lente.rotateY(Math.PI / 2);
  // pescante para la soga, arriba de la puerta
  const pescante = tuboEntre([new THREE.Vector3(-0.18, 0.36, 0.42), new THREE.Vector3(-0.15, 0.4, 0.62), new THREE.Vector3(-0.12, 0.34, 0.74)], 0.022, 12);
  return { cabina, parabrisas, ventD, ventI, puerta, ventPuertaI, botalon, deriva, estab, motor, toma, mastil, cubo, pala, patines, rotorCola, caja, lente, pescante };
};

// punto de la soga en coordenadas locales del helicóptero
export const ANCLA_SOGA = new THREE.Vector3(-0.12, 0.3, 0.74);
// el reflector: posición local y hacia dónde mira por defecto
export const POS_REFLECTOR = new THREE.Vector3(0.98, -0.42, 0);

const matHaz = () => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide, toneMapped: true,
  uniforms: { uInt: { value: 1 }, uColor: { value: new THREE.Color(1.0, 0.97, 0.92) }, uT: { value: 0 } },
  vertexShader: /* glsl */ `
    varying float vS; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main() {
      vS = -position.y; // 0 en la lente, 1 al final
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
      vW = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */ `
    varying float vS; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    uniform float uInt; uniform vec3 uColor; uniform float uT;
    void main() {
      float borde = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);       // centro denso, bordes suaves
      float largo = pow(1.0 - clamp(vS, 0.0, 1.0), 1.15) * smoothstep(0.0, 0.04, vS);
      float polvo = 0.88 + 0.12 * sin(vS * 23.0 - uT * 0.7 + vW.x * 3.0) * sin(vS * 9.0 + uT * 0.4);
      float agua = smoothstep(-0.02, 0.5, vW.y);                          // se funde al tocar el agua
      float a = borde * largo * polvo * agua * uInt * 0.16;
      gl_FragColor = vec4(uColor * a, 1.0);
    }`,
});
const matHalo = () => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: true,
  uniforms: { uInt: { value: 1 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
  fragmentShader: `varying vec2 vUv; uniform float uInt; void main(){ float d = length(vUv - 0.5) * 2.0; float a = (exp(-d * d * 18.0) * 2.4 + exp(-d * 4.0) * 0.25) * uInt * (1.0 - smoothstep(0.85, 1.0, d)); gl_FragColor = vec4(vec3(1.0, 0.97, 0.92) * a, 1.0);} `,
});
const matDisco = () => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, side: THREE.DoubleSide,
  uniforms: { uA: { value: 0.028 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
  fragmentShader: `varying vec2 vUv; uniform float uA; void main(){ float d = length(vUv - 0.5) * 2.0; float a = uA * smoothstep(1.0, 0.92, d) * smoothstep(0.05, 0.2, d) * (0.7 + 0.3 * d); gl_FragColor = vec4(vec3(0.55, 0.57, 0.6), a);} `,
});

export type EstadoHeli = {
  pos: [number, number, number]; rumbo: number; cabeceo: number; rolido: number; rotor: number; // rotor = ángulo (rad)
  mira: THREE.Vector3; // punto del mundo al que apunta el reflector
  haz: number; // intensidad del haz
};

const _q = new THREE.Quaternion(), _m = new THREE.Matrix4(), _y = new THREE.Vector3(0, -1, 0);

// devuelve dónde quedó la lente y la dirección (mundo) para el agua y la SpotLight
export const geoReflector = (e: EstadoHeli) => {
  const M = new THREE.Matrix4().compose(new THREE.Vector3(...e.pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(e.rolido, e.rumbo, e.cabeceo, "YXZ")), new THREE.Vector3(1, 1, 1));
  const lente = POS_REFLECTOR.clone().applyMatrix4(M);
  const dir = e.mira.clone().sub(lente).normalize();
  return { lente, dir, M };
};

export const Helicoptero: React.FC<{ e: EstadoHeli; angulo: number; t: number; rescatista?: React.ReactNode }> = ({ e, angulo, t, rescatista }) => {
  const g = useMemo(() => construir(), []);
  const mats = useMemo(() => ({
    casco: new THREE.MeshPhysicalMaterial({ color: "#8e9399", roughness: 0.42, metalness: 0.05, sheen: 0.25, sheenColor: new THREE.Color("#dfe6ee"), clearcoat: 0.35, clearcoatRoughness: 0.3 }),
    oscuro: new THREE.MeshPhysicalMaterial({ color: "#5c6167", roughness: 0.5, metalness: 0.1, clearcoat: 0.2 }),
    vidrio: new THREE.MeshPhysicalMaterial({ color: "#07090b", roughness: 0.06, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.03 }),
    interior: new THREE.MeshStandardMaterial({ color: "#050506", roughness: 0.95 }),
    lente: new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 5.8, 5.4), toneMapped: true }),
    haz: matHaz(), halo: matHalo(), disco: matDisco(),
  }), []);
  const { lente, dir, M } = geoReflector(e);
  mats.haz.uniforms.uInt.value = e.haz; mats.haz.uniforms.uT.value = t; mats.halo.uniforms.uInt.value = e.haz;
  // haz: cono abierto con la punta en la lente, eje -y local alineado a dir; largo hasta el agua
  const largo = dir.y < -0.05 ? Math.min(14, (-lente.y / dir.y) + 0.6) : 10;
  const radio = largo * Math.tan(angulo);
  const hazGeo = useMemo(() => { const c = new THREE.CylinderGeometry(0.06, 1, 1, 64, 32, true); c.translate(0, -0.5, 0); return c; }, []);
  _q.setFromUnitVectors(_y, dir);
  // el reflector local gira hacia la mira (en coords del heli)
  const inv = M.clone().invert();
  const dirLocal = e.mira.clone().applyMatrix4(inv).sub(POS_REFLECTOR).normalize();
  const qCaja = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dirLocal);
  void _m;
  return (
    <>
      <group position={e.pos} rotation={new THREE.Euler(e.rolido, e.rumbo, e.cabeceo, "YXZ")}>
        <mesh geometry={g.cabina} material={mats.casco} castShadow receiveShadow />
        <mesh geometry={g.parabrisas} material={mats.vidrio} />
        <mesh geometry={g.ventD} material={mats.vidrio} />
        <mesh geometry={g.ventI} material={mats.vidrio} />
        <mesh geometry={g.puerta} material={mats.interior} />
        <mesh geometry={g.ventPuertaI} material={mats.vidrio} />
        <mesh geometry={g.botalon} material={mats.casco} castShadow receiveShadow />
        <mesh geometry={g.deriva} material={mats.casco} castShadow receiveShadow />
        <mesh geometry={g.estab} material={mats.casco} castShadow receiveShadow />
        <mesh geometry={g.motor} material={mats.casco} castShadow receiveShadow />
        <mesh geometry={g.toma} material={mats.oscuro} castShadow />
        <mesh geometry={g.mastil} material={mats.oscuro} castShadow />
        <mesh geometry={g.cubo} material={mats.oscuro} castShadow />
        <mesh geometry={g.pescante} material={mats.oscuro} castShadow />
        {g.patines.map((p, i) => <mesh key={i} geometry={p} material={mats.oscuro} castShadow receiveShadow />)}
        <group position={[0, 0.99, 0]} rotation={[0, e.rotor, 0]}>
          {[0, 1, 2, 3].map((k) => <mesh key={k} geometry={g.pala} material={mats.oscuro} rotation={[0.05 * (k % 2 ? 1 : -1), (k * Math.PI) / 2, -0.03]} castShadow />)}
        </group>
        <mesh position={[0, 0.985, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.disco} userData={{ sinPost: true }}><circleGeometry args={[2.85, 96]} /></mesh>
        <group position={[-3.62, 0.62, 0.08]} rotation={[0, 0, e.rotor * 2.7]}>
          <mesh geometry={g.rotorCola} material={mats.oscuro} />
          <mesh geometry={g.rotorCola} material={mats.oscuro} rotation={[0, 0, Math.PI / 2]} />
        </group>
        <group position={POS_REFLECTOR} quaternion={qCaja}>
          <mesh geometry={g.caja} material={mats.oscuro} castShadow />
          <mesh geometry={g.lente} material={mats.lente} position={[0.071, 0, 0]} />
        </group>
        {rescatista}
      </group>
      {/* haz volumétrico y halo en coordenadas del mundo */}
      <mesh geometry={hazGeo} material={mats.haz} position={lente} quaternion={_q.clone()} scale={[radio, largo, radio]} userData={{ sinPost: true }} frustumCulled={false} renderOrder={5} />
      <mesh material={mats.halo} position={lente} userData={{ sinPost: true }} renderOrder={6}
        onBeforeRender={function (this: THREE.Mesh, _r: THREE.WebGLRenderer, _s: THREE.Scene, cam: THREE.Camera) { this.quaternion.copy(cam.quaternion); this.updateMatrixWorld(); }}>
        <planeGeometry args={[0.9, 0.9]} />
      </mesh>
    </>
  );
};
