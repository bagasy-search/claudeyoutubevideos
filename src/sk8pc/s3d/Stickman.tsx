// <Stickman>: Blanquito completo. Cuerpo = tubos de goma con tapas (torso, brazos, piernas) + cabeza esfera + mitones
// + pantuflas. Pose y expresión salen del guion (acciones encadenadas) o se pasan fijas. Determinista por cuadro.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { actualizarTubo, crearTubo, remuestrear, v3, V3 } from "./geometria";
import { capsulasDe, Esqueleto, ManoResuelta, Pose, resolver } from "./rig";
import { cargarCapsulas, crearMatContacto, crearPiel, crearPintura, crearRellenoMat, crearUniformsAO } from "./material";
import { Rostro, MatsCara } from "./Rostro";
import { PROPORCIONES as P } from "./proporciones";
import { EXPRESIONES, Expresion, NombreExpresion } from "./expresiones";
import { evaluarGuion, PasoGuion } from "./acciones";
import { Accesorios, NombreAccesorio } from "./accesorios";

export type StickmanProps = {
  x?: number; z?: number; rotY?: number; escala?: number;
  guion?: PasoGuion[];
  pose?: Pose; // pose fija (ignora el guion)
  expr?: NombreExpresion | Expresion; // expresión fija
  mirada?: "camara" | [number, number];
  boca?: number[]; // amplitudes de la voz por cuadro (0–1) para lip-sync
  color?: string;
  accesorios?: NombreAccesorio[];
  semilla?: number;
  sombras?: boolean;
  contacto?: number; // fuerza de la sombra de contacto
  colorContacto?: string; // color de la mancha de contacto (default: azul noche del estudio; sobre una foto, el piso oscurecido)
  cuadro?: number; // forzar el cuadro (para láminas)
};

const N = 40;

const base = (o: THREE.Matrix4, X: THREE.Vector3, Y: THREE.Vector3, Z: THREE.Vector3, c: THREE.Vector3, s: V3) =>
  o.makeBasis(X.clone().multiplyScalar(s[0]), Y.clone().multiplyScalar(s[1]), Z.clone().multiplyScalar(s[2])).setPosition(c);

// datos de un mitón según los pesos de forma [miton, puno, abierta, pulgar, senala]
const FORMAS = {
  // dims palma (ancho en dirección del pulgar, largo, grosor) · pulgar: [desde(pulgar, eje), hasta(pulgar, eje), radio] · dedo
  miton: { d: [0.104, 0.122, 0.088], pa: [0.078, 0.0], pb: [0.088, 0.018], pr: 0.044, dedo: 0 },
  puno: { d: [0.108, 0.104, 0.098], pa: [0.07, 0.01], pb: [0.074, 0.03], pr: 0.04, dedo: 0 },
  abierta: { d: [0.124, 0.148, 0.066], pa: [0.07, -0.02], pb: [0.14, 0.05], pr: 0.04, dedo: 0 },
  pulgar: { d: [0.106, 0.1, 0.098], pa: [0.06, 0.0], pb: [0.17, -0.005], pr: 0.04, dedo: 0 },
  senala: { d: [0.104, 0.1, 0.096], pa: [0.07, 0.01], pb: [0.074, 0.03], pr: 0.04, dedo: 1 },
};
const ORD = ["miton", "puno", "abierta", "pulgar", "senala"] as const;

type PiezasCuerpo = {
  torso: ReturnType<typeof crearTubo>; brazos: ReturnType<typeof crearTubo>[]; piernas: ReturnType<typeof crearTubo>[];
  pulgares: ReturnType<typeof crearTubo>[]; dedos: ReturnType<typeof crearTubo>[];
  esfera: THREE.SphereGeometry; cabeza: THREE.SphereGeometry; capsulaPie: THREE.CapsuleGeometry;
  temblor: ReturnType<typeof crearTubo>[];
};

export const StickmanCuerpo: React.FC<{
  pose: Pose; e: Expresion; t: number; x?: number; z?: number; rotY?: number; escala?: number; color?: string;
  accesorios?: NombreAccesorio[]; sombras?: boolean; contacto?: number; colorContacto?: string;
}> = ({ pose, e, t, x = 0, z = 0, rotY = 0, escala = 1, color = "#EEEEEC", accesorios = [], sombras = true, contacto = 0.85, colorContacto = "#06142a" }) => {
  const u = useMemo(() => crearUniformsAO(), []);
  const piel = useMemo(() => crearPiel(u, { color }), [u, color]);
  const mats = useMemo<MatsCara>(() => ({
    pintura: crearPintura(u),
    bocaInt: crearRellenoMat(u, "#2e2a2b", { rugosidad: 0.6 }),
    lengua: crearRellenoMat(u, "#8f5a5e", { rugosidad: 0.55, capa: 1 }),
    dientes: crearRellenoMat(u, "#f2f2ef", { rugosidad: 0.4, capa: 1 }),
    corazon: crearRellenoMat(u, "#e2475c", { rugosidad: 0.35, capa: 1 }),
    rubor: crearRellenoMat(u, "#ff8f9e", { transparente: true, opacidad: 0.55, rugosidad: 0.7, capa: 1 }),
    agua: crearRellenoMat(u, "#86d0f5", { transparente: true, opacidad: 0.85, rugosidad: 0.1, capa: 2 }),
    vena: crearPintura(u, "#e04a3c", 0.4),
    pupila: crearPintura(u, "#262626", 0.35),
    aguaTrazo: (() => { const a = crearPintura(u, "#7cc8f0", 0.1); a.transparent = true; a.opacity = 0.8; return a; })(),
  }), [u]);
  const matContacto = useMemo(() => crearMatContacto(u), [u]);
  const pz = useMemo<PiezasCuerpo>(() => ({
    torso: crearTubo(N, 40, 12), brazos: [crearTubo(N, 32, 10), crearTubo(N, 32, 10)], piernas: [crearTubo(N, 32, 10), crearTubo(N, 32, 10)],
    pulgares: [crearTubo(8, 24, 8), crearTubo(8, 24, 8)], dedos: [crearTubo(8, 24, 8), crearTubo(8, 24, 8)],
    esfera: new THREE.SphereGeometry(1, 48, 32), cabeza: new THREE.SphereGeometry(P.cabeza.radio, 128, 96),
    capsulaPie: new THREE.CapsuleGeometry(P.pie.radio, P.pie.largo - 2 * P.pie.radio, 16, 40),
    temblor: [0, 1, 2, 3, 4, 5].map(() => crearTubo(24, 12, 5)),
  }), []);

  const esq: Esqueleto = resolver(pose);
  // mundo
  const Mw = new THREE.Matrix4().compose(v3(x, 0, z), new THREE.Quaternion().setFromAxisAngle(v3(0, 1, 0), THREE.MathUtils.degToRad(rotY)), v3(escala, escala, escala));
  const caps = capsulasDe(esq).map((c) => ({ a: c.a.clone().applyMatrix4(Mw), b: c.b.clone().applyMatrix4(Mw), r: c.r * escala }));
  cargarCapsulas(u, caps);
  (matContacto.uniforms.uCentro.value as THREE.Vector2).set(x, z);
  matContacto.uniforms.uRadio.value = 2.4 * escala;
  matContacto.uniforms.uOpacidad.value = contacto;
  (matContacto.uniforms.uColor.value as THREE.Color).set(colorContacto);

  actualizarTubo(pz.torso, esq.torsoCurva, P.torso.radio);
  [esq.manoI, esq.manoD].forEach((m, i) => actualizarTubo(pz.brazos[i], m.brazo, (q) => P.brazo.radio * (1 - P.brazo.afina * q)));
  [esq.pieI, esq.pieD].forEach((p, i) => actualizarTubo(pz.piernas[i], p.pierna, (q) => P.pierna.radio * (1 - P.pierna.afina * q)));

  // manos
  const manos = [esq.manoI, esq.manoD].map((m: ManoResuelta, i) => {
    const w = m.forma;
    const mix = (f: (k: (typeof ORD)[number]) => number) => ORD.reduce((s, k, j) => s + f(k) * w[j], 0);
    const d: V3 = [mix((k) => FORMAS[k].d[0]), mix((k) => FORMAS[k].d[1]), mix((k) => FORMAS[k].d[2])];
    let eje = m.eje.clone();
    const pul = m.pulgar.clone();
    if (m.dobla) eje = eje.applyAxisAngle(pul, THREE.MathUtils.degToRad(m.dobla) * (i === 0 ? 1 : -1));
    const Z = pul.clone().cross(eje).normalize();
    const Xp = eje.clone().cross(Z).normalize(); // pulgar re-ortogonalizado
    const centro = m.muneca.clone().addScaledVector(eje, d[1] * 0.72);
    const mat = base(new THREE.Matrix4(), Xp, eje, Z, centro, d);
    const pos = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    mat.decompose(pos, q, s);
    const pa = [mix((k) => FORMAS[k].pa[0]), mix((k) => FORMAS[k].pa[1])], pb = [mix((k) => FORMAS[k].pb[0]), mix((k) => FORMAS[k].pb[1])];
    const pr = mix((k) => FORMAS[k].pr);
    const A = centro.clone().addScaledVector(Xp, pa[0]).addScaledVector(eje, pa[1]).addScaledVector(Z, 0.012);
    const B = centro.clone().addScaledVector(Xp, pb[0]).addScaledVector(eje, pb[1]).addScaledVector(Z, 0.012);
    actualizarTubo(pz.pulgares[i], remuestrear([A, B.distanceTo(A) < 1e-4 ? B.clone().addScaledVector(Xp, 1e-3) : B], 8), pr);
    const dedo = mix((k) => FORMAS[k].dedo);
    const D0 = centro.clone().addScaledVector(eje, 0.03).addScaledVector(Xp, 0.02).addScaledVector(Z, 0.03);
    const D1 = D0.clone().addScaledVector(eje, 0.04 + 0.17 * dedo);
    actualizarTubo(pz.dedos[i], remuestrear([D0, D1], 8), 0.038);
    return { pos, q, s, dedo };
  });

  // pies
  const pies = [esq.pieI, esq.pieD].map((p) => {
    const Y = p.dir.clone();
    const X = v3(0, 1, 0).cross(Y).normalize();
    const Z = X.clone().cross(Y).normalize();
    const m = base(new THREE.Matrix4(), X, Y, Z, p.centro, [1.06, 1, P.pie.aplaste]);
    const pos = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    m.decompose(pos, q, s);
    return { pos, q, s };
  });

  // cabeza
  const qc = new THREE.Quaternion().setFromRotationMatrix(esq.cabeza.rot);
  const sc = P.cabeza.achatadoY * esq.cabeza.aplaste;

  // líneas de temblor (asustado): trazos sueltos a los costados, mirando a cámara
  const temb = pose.temblor;
  pz.temblor.forEach((tb, k) => {
    const lado = k < 3 ? -1 : 1, j = k % 3;
    const cx = lado * (0.55 + 0.08 * j), cy = esq.hombro.y - 0.35 - j * 0.28 + (j === 1 ? 0.1 : 0), zz = 0.1;
    const pts: THREE.Vector3[] = [];
    for (let q = 0; q <= 10; q++) {
      const s = q / 10;
      pts.push(v3(cx + lado * 0.045 * Math.sin(s * Math.PI * 3 + t * 30 + k), cy + (s - 0.5) * 0.2 * Math.max(0.05, temb), zz));
    }
    actualizarTubo(tb, remuestrear(pts, 24), 0.011 * Math.max(0.05, temb));
  });

  const cs = sombras;
  return (
    <group>
      <group position={[x, 0, z]} rotation={[0, THREE.MathUtils.degToRad(rotY), 0]} scale={escala}>
        <mesh geometry={pz.torso.geo} material={piel} castShadow={cs} receiveShadow={false} />
        {pz.brazos.map((tb, i) => <mesh key={`b${i}`} geometry={tb.geo} material={piel} castShadow={cs} receiveShadow={false} />)}
        {pz.piernas.map((tb, i) => <mesh key={`p${i}`} geometry={tb.geo} material={piel} castShadow={cs} receiveShadow={false} />)}
        {manos.map((m, i) => (
          <group key={`m${i}`}>
            <mesh geometry={pz.esfera} material={piel} position={m.pos} quaternion={m.q} scale={m.s} castShadow={cs} receiveShadow={false} />
            <mesh geometry={pz.pulgares[i].geo} material={piel} castShadow={cs} receiveShadow={false} />
            <mesh geometry={pz.dedos[i].geo} material={piel} castShadow={cs} receiveShadow={false} visible={m.dedo > 0.05} />
          </group>
        ))}
        {pies.map((p, i) => <mesh key={`f${i}`} geometry={pz.capsulaPie} material={piel} position={p.pos} quaternion={p.q} scale={p.s} castShadow={cs} receiveShadow={false} />)}
        <group position={esq.cabeza.centro} quaternion={qc}>
          <group scale={[1, sc, 1]}>
            <mesh geometry={pz.cabeza} material={piel} castShadow={cs} receiveShadow={false} />
            <Rostro e={e} t={t} mats={mats} sombras={cs} />
          </group>
          <Accesorios lista={accesorios} piel={piel} />
        </group>
        {pz.temblor.map((tb, k) => <mesh key={`t${k}`} geometry={tb.geo} material={mats.pintura} visible={temb > 0.05} />)}
      </group>
      {/* sombra de contacto (AO de las cápsulas sobre el piso) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, z]} material={matContacto} renderOrder={-1}>
        <planeGeometry args={[5 * escala, 5 * escala]} />
      </mesh>
    </group>
  );
};

// componente principal: resuelve guion → pose + expresión del cuadro
export const Stickman: React.FC<StickmanProps> = (props) => {
  const frame0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = props.cuadro ?? frame0;
  const semilla = props.semilla ?? 1;
  const ev = evaluarGuion({
    guion: props.guion ?? [{ t: 0, accion: "idle", expr: "neutral" }],
    frame, fps, semilla, poseFija: props.pose,
    exprFija: typeof props.expr === "string" ? EXPRESIONES[props.expr] : props.expr,
    mirada: props.mirada, boca: props.boca,
  });
  return (
    <StickmanCuerpo pose={ev.pose} e={ev.expr} t={frame / fps} x={(props.x ?? 0) + ev.dx} z={(props.z ?? 0) + ev.dz}
      rotY={(props.rotY ?? 0) + ev.rotY} escala={props.escala} color={props.color} accesorios={props.accesorios}
      sombras={props.sombras} contacto={props.contacto} colorContacto={props.colorContacto} />
  );
};
