// VESTUARIO de Blanquito (28-oct, refs del creador): el cuerpo sigue siendo el MISMO stickman blanco; cada personaje
// se distingue por ropa + pelo/sombrero + calzado + un objeto en la mano (cocinero, campesina, monje, guardia…).
// Todo es geometría de arcilla/tela que sigue el esqueleto del cuadro (tubos sobre torso, brazos y piernas; falda
// cónica desde la pelvis; piezas de cabeza dentro del grupo de la cabeza). Determinista, sin físicas.
import React, { useMemo } from "react";
import * as THREE from "three";
import { actualizarTubo, crearTubo, remuestrear } from "./geometria";
import { PROPORCIONES as P } from "./proporciones";
import { Esqueleto } from "./rig";

export type Pelo = { color: string; estilo: "corto" | "rodete" | "cola" | "rulos" | "trenzas" | "largo" | "pelado" };
export type Sombrero = { tipo: "paja" | "capucha" | "cofia" | "chef" | "copa" | "punta" | "pico" | "boina" | "pañuelo"; color?: string };
export type ObjetoMano = "pan" | "jarra" | "canasta" | "balde" | "antorcha" | "baston" | "escoba" | "pez" | "libro" | "bolsa" | "campana" | "farol" | "lanza";
export type Ropa = {
  tunica?: { color: string; largo?: number; vuelo?: number; mangas?: "cortas" | "largas" | false; cinto?: string; cuello?: string };
  calzas?: string;
  delantal?: string;
  capa?: string;
  pelo?: Pelo;
  barba?: string;
  sombrero?: Sombrero;
  calzado?: { tipo: "zapatillas" | "botas" | "zuecos"; color?: string };
  manos?: { i?: ObjetoMano; d?: ObjetoMano };
};

const R = P.cabeza.radio;
const cache = new Map<string, THREE.MeshPhysicalMaterial>();
// tela: mate con brillo de terciopelo; arcilla: un poco más satinada (objetos)
export const tela = (color: string, rug = 0.82) => {
  const k = `${color}|${rug}`;
  if (!cache.has(k)) cache.set(k, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color), roughness: rug, metalness: 0, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new THREE.Color("#ffffff").lerp(new THREE.Color(color), 0.5), clearcoat: 0.04 }));
  return cache.get(k)!;
};
const arcilla = (color: string) => tela(color, 0.5);

// ── piezas de cabeza (van dentro del grupo de la cabeza: +y arriba, +z la cara) ──────────────────────────────────
export const CabezaRopa: React.FC<{ ropa: Ropa; t: number }> = ({ ropa, t }) => {
  const g = useMemo(() => ({
    casquete: new THREE.SphereGeometry(R * 1.045, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.42),
    bola: new THREE.SphereGeometry(1, 40, 24),
    cap: new THREE.CapsuleGeometry(1, 1, 8, 24),
    cil: new THREE.CylinderGeometry(1, 1, 1, 48),
    cilA: new THREE.CylinderGeometry(1, 1, 1, 48, 1, true),
    cono: new THREE.ConeGeometry(1, 1, 48),
    capucha: new THREE.SphereGeometry(R * 1.1, 64, 40, Math.PI / 2 + 0.7, Math.PI * 2 - 1.4, 0, Math.PI * 0.74),
    esclavina: new THREE.CylinderGeometry(R * 0.42, R * 1.0, R * 0.8, 48, 1, false),
    cortina: new THREE.CylinderGeometry(R * 0.98, R * 1.08, 1, 40, 1, true, Math.PI * 0.5, Math.PI),
    toro: new THREE.TorusGeometry(1, 0.2, 16, 64),
  }), []);
  const pe = ropa.pelo, so = ropa.sombrero;
  const mp = pe ? tela(pe.color, 0.62) : undefined;
  const hayCasquete = pe && pe.estilo !== "pelado" && !(so && (so.tipo === "capucha" || so.tipo === "chef" || so.tipo === "cofia" || so.tipo === "pañuelo"));
  return (
    <group>
      {/* pelo */}
      {hayCasquete && <mesh geometry={g.casquete} material={mp} rotation={[-0.38, 0, 0]} />}
      {pe?.estilo === "rodete" && <mesh geometry={g.bola} material={mp} position={[0, R * 1.0, -R * 0.42]} scale={0.2} />}
      {pe?.estilo === "cola" && <>
        <mesh geometry={g.bola} material={mp} position={[0, R * 0.62, -R * 0.92]} scale={0.12} />
        <mesh geometry={g.cap} material={mp} position={[0, R * 0.02 + Math.sin(t * 3) * 0.01, -R * 1.08]} rotation={[0.25 + Math.sin(t * 3) * 0.05, 0, 0]} scale={[0.1, 0.24, 0.1]} />
      </>}
      {pe?.estilo === "rulos" && Array.from({ length: 11 }).map((_, i) => {
        const a = Math.PI * 0.15 + (i / 10) * Math.PI * 1.7; // alrededor, sin la frente
        return <mesh key={i} geometry={g.bola} material={mp} position={[Math.cos(a + Math.PI / 2) * R * 0.92, R * (0.45 + 0.18 * Math.sin(i * 1.7)), -Math.sin(a + Math.PI / 2) * R * 0.92 * -1]} scale={0.14} />;
      })}
      {pe?.estilo === "trenzas" && [-1, 1].map((s) => (
        <group key={s}>{[0, 1, 2, 3].map((k) => <mesh key={k} geometry={g.bola} material={mp} position={[s * R * 0.86, -R * 0.1 - k * 0.12, -R * 0.15]} scale={0.085 - k * 0.006} />)}</group>
      ))}
      {pe?.estilo === "largo" && <mesh geometry={g.cortina} material={mp} position={[0, -R * 0.15, 0]} scale={[1, 0.95, 1]} />}
      {ropa.barba && <>
        <mesh geometry={g.bola} material={tela(ropa.barba, 0.7)} position={[0, -R * 0.6, R * 0.42]} scale={[R * 0.62, R * 0.62, R * 0.4]} />
        <mesh geometry={g.cap} material={tela(ropa.barba, 0.7)} position={[0, -R * 0.24, R * 0.9]} rotation={[0, 0, Math.PI / 2]} scale={[0.045, 0.1, 0.05]} />
      </>}
      {/* sombreros */}
      {so?.tipo === "paja" && <group position={[0, R * 0.55, 0]} rotation={[-0.12, 0, 0.06]}>
        <mesh geometry={g.cil} material={tela(so.color ?? "#e2c27a", 0.75)} scale={[R * 1.85, 0.035, R * 1.85]} />
        <mesh geometry={g.cil} material={tela(so.color ?? "#e2c27a", 0.75)} position={[0, R * 0.32, 0]} scale={[R * 0.82, R * 0.62, R * 0.82]} />
        <mesh geometry={g.cil} material={tela("#a8452e")} position={[0, R * 0.08, 0]} scale={[R * 0.84, 0.07, R * 0.84]} />
      </group>}
      {so?.tipo === "capucha" && <>
        <mesh geometry={g.capucha} material={tela(so.color ?? "#6a4a32")} rotation={[-0.1, 0, 0]}>
        </mesh>
        <mesh geometry={g.esclavina} material={tela(so.color ?? "#6a4a32")} position={[0, -R * 1.22, -0.03]} />
      </>}
      {(so?.tipo === "cofia" || so?.tipo === "pañuelo") && <group rotation={[-0.32, 0, 0]}>
        <mesh geometry={g.casquete} material={tela(so.color ?? "#f4efe4")} scale={1.07} />
        <mesh geometry={g.toro} material={tela(so.color ?? "#f4efe4")} position={[0, R * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[R * 0.98, R * 0.98, 0.25]} />
        {so.tipo === "pañuelo" && <mesh geometry={g.bola} material={tela(so.color ?? "#f4efe4")} position={[0, R * 0.2, -R * 1.02]} scale={0.1} />}
      </group>}
      {so?.tipo === "chef" && <group position={[0, R * 0.62, 0]} rotation={[-0.1, 0, 0]}>
        <mesh geometry={g.cil} material={tela("#fbfaf6")} position={[0, R * 0.3, 0]} scale={[R * 0.82, R * 0.6, R * 0.82]} />
        <mesh geometry={g.bola} material={tela("#fbfaf6")} position={[0, R * 0.78, 0]} scale={[R * 1.02, R * 0.55, R * 1.02]} />
      </group>}
      {(so?.tipo === "copa" || so?.tipo === "pico") && <group position={[0, R * 0.62, 0]} rotation={[-0.08, 0, 0]}>
        <mesh geometry={g.cil} material={tela(so.color ?? "#2a2428", 0.7)} scale={[R * 1.55, 0.04, R * 1.55]} />
        <mesh geometry={g.cil} material={tela(so.color ?? "#2a2428", 0.7)} position={[0, R * 0.42, 0]} scale={[R * 0.78, R * 0.84, R * 0.78]} />
      </group>}
      {so?.tipo === "pico" && <>
        <mesh geometry={g.cono} material={arcilla("#e8dcc0")} position={[0, -R * 0.12, R * 1.18]} rotation={[Math.PI / 2 + 0.25, 0, 0]} scale={[0.15, 0.85, 0.12]} />
        {[-1, 1].map((s) => <mesh key={s} geometry={g.cil} material={tela("#1e2a30", 0.15)} position={[s * R * 0.36, R * 0.16, R * 0.86]} rotation={[Math.PI / 2, 0, 0]} scale={[0.1, 0.05, 0.1]} />)}
      </>}
      {so?.tipo === "punta" && <mesh geometry={g.cono} material={tela(so.color ?? "#3a4a8a")} position={[0, R * 1.15, -0.04]} rotation={[-0.22, 0, 0.1]} scale={[R * 0.95, R * 1.7, R * 0.95]} />}
      {so?.tipo === "boina" && <mesh geometry={g.bola} material={tela(so.color ?? "#b8443a")} position={[0.06, R * 0.86, -0.02]} rotation={[0, 0, -0.25]} scale={[R * 1.05, R * 0.3, R * 1.0]} />}
    </group>
  );
};

// ── objetos en la mano ─────────────────────────────────────────────────────────────────────────────────────────────
const Objeto: React.FC<{ o: ObjetoMano; t: number }> = ({ o, t }) => {
  const g = useMemo(() => ({ bola: new THREE.SphereGeometry(1, 32, 20), cil: new THREE.CylinderGeometry(1, 1, 1, 32), cilA: new THREE.CylinderGeometry(1, 1, 1, 32, 1, true), cono: new THREE.ConeGeometry(1, 1, 32), cap: new THREE.CapsuleGeometry(1, 1, 8, 20), toro: new THREE.TorusGeometry(1, 0.08, 12, 40, Math.PI), box: new THREE.BoxGeometry(1, 1, 1) }), []);
  const madera = arcilla("#8a5a32");
  switch (o) {
    case "pan": return <mesh geometry={g.cap} material={arcilla("#d99a4e")} rotation={[0, 0, Math.PI / 2 - 0.3]} position={[0, 0, 0.12]} scale={[0.1, 0.32, 0.1]} />;
    case "jarra": return <group position={[0, 0.12, 0.1]}><mesh geometry={g.cil} material={madera} scale={[0.11, 0.24, 0.11]} /><mesh geometry={g.cil} material={arcilla("#fff4dc")} position={[0, 0.13, 0]} scale={[0.115, 0.04, 0.115]} /></group>;
    case "canasta": case "balde": case "bolsa": case "farol": {
      // cuelga del puño (siempre vertical, se hamaca apenas)
      const c = o === "canasta" ? "#c8964e" : o === "balde" ? "#8a6040" : o === "bolsa" ? "#b8a07a" : "#3a3a3a";
      return <group rotation={[Math.sin(t * 2.4) * 0.06, 0, 0]}>
        {o !== "bolsa" && <mesh geometry={g.toro} material={arcilla(o === "farol" ? "#3a3a3a" : "#6a4a2a")} position={[0, -0.06, 0]} rotation={[0, 0, Math.PI]} scale={0.15} />}
        {o === "bolsa" ? <mesh geometry={g.bola} material={tela(c)} position={[0, -0.22, 0]} scale={[0.2, 0.24, 0.18]} />
          : o === "farol" ? <><mesh geometry={g.box} material={arcilla("#ffd98a")} position={[0, -0.26, 0]} scale={[0.17, 0.24, 0.17]} /><mesh geometry={g.cono} material={arcilla("#3a3a3a")} position={[0, -0.1, 0]} scale={[0.14, 0.1, 0.14]} /></>
          : <mesh geometry={g.cil} material={tela(c, 0.7)} position={[0, -0.26, 0]} scale={[o === "canasta" ? 0.26 : 0.19, 0.24, o === "canasta" ? 0.2 : 0.19]} />}
        {o === "canasta" && [-1, 0, 1].map((k) => <mesh key={k} geometry={g.bola} material={arcilla(k ? "#7cc46a" : "#d9433b")} position={[k * 0.12, -0.12, 0]} scale={0.09} />)}
        {o === "balde" && <mesh geometry={g.cil} material={arcilla("#7fc0e0")} position={[0, -0.15, 0]} scale={[0.17, 0.02, 0.17]} />}
      </group>;
    }
    case "antorcha": {
      const fl = 1 + Math.sin(t * 2 * Math.PI * 1.6) * 0.08; // ≤2 Hz
      return <group><mesh geometry={g.cil} material={madera} position={[0, 0.15, 0]} scale={[0.04, 0.8, 0.04]} /><mesh geometry={g.cono} material={arcilla("#ff9a2e")} position={[0, 0.66, 0]} scale={[0.1, 0.3 * fl, 0.1]} /><mesh geometry={g.cono} material={arcilla("#ffe08a")} position={[0, 0.62, 0.02]} scale={[0.055, 0.18 * fl, 0.055]} /></group>;
    }
    case "baston": return <group><mesh geometry={g.cil} material={madera} position={[0, -0.45, 0]} scale={[0.035, 1.6, 0.035]} /><mesh geometry={g.bola} material={madera} position={[0, 0.36, 0]} scale={0.06} /></group>;
    case "lanza": return <group><mesh geometry={g.cil} material={madera} position={[0, 0.2, 0]} scale={[0.03, 2.9, 0.03]} /><mesh geometry={g.cono} material={arcilla("#c8c8cc")} position={[0, 1.78, 0]} scale={[0.07, 0.26, 0.04]} /></group>;
    case "escoba": return <group><mesh geometry={g.cil} material={madera} position={[0, -0.2, 0]} scale={[0.03, 1.5, 0.03]} /><mesh geometry={g.cono} material={tela("#d8b86a", 0.9)} position={[0, -1.05, 0]} rotation={[Math.PI, 0, 0]} scale={[0.16, 0.38, 0.1]} /></group>;
    case "pez": return <group position={[0, -0.05, 0.1]} rotation={[0, 0, -1.2 + Math.sin(t * 3) * 0.15]}><mesh geometry={g.bola} material={arcilla("#9ab0b8")} position={[0, -0.18, 0]} scale={[0.07, 0.2, 0.045]} /><mesh geometry={g.cono} material={arcilla("#9ab0b8")} position={[0, -0.42, 0]} rotation={[Math.PI, 0, 0]} scale={[0.08, 0.1, 0.03]} /></group>;
    case "libro": return <mesh geometry={g.box} material={arcilla("#7a2a2a")} position={[0, 0, 0.1]} rotation={[0.2, 0.3, 0]} scale={[0.22, 0.28, 0.06]} />;
    case "campana": return <group rotation={[0, 0, Math.sin(t * 2 * Math.PI * 1.5) * 0.4]}><mesh geometry={g.cil} material={madera} position={[0, 0.08, 0]} scale={[0.03, 0.16, 0.03]} /><mesh geometry={g.cono} material={arcilla("#d8a83a")} position={[0, -0.07, 0]} rotation={[Math.PI, 0, 0]} scale={[0.1, 0.14, 0.1]} /></group>;
  }
};

// ── ropa del cuerpo (en coordenadas locales del cuerpo, mismo grupo que el torso) ────────────────────────────────
export type PieRopa = { pos: THREE.Vector3; q: THREE.Quaternion; s: THREE.Vector3 };
export const CuerpoRopa: React.FC<{ ropa: Ropa; esq: Esqueleto; manos: { pos: THREE.Vector3 }[]; pies: PieRopa[]; t: number; piel: THREE.Material }> = ({ ropa, esq, manos, pies, t }) => {
  const tb = useMemo(() => ({ torso: crearTubo(24, 40, 10), mangas: [crearTubo(16, 28, 8), crearTubo(16, 28, 8)], calzas: [crearTubo(20, 28, 8), crearTubo(20, 28, 8)], cañas: [crearTubo(10, 28, 8), crearTubo(10, 28, 8)] }), []);
  const g = useMemo(() => ({ falda: new THREE.CylinderGeometry(1, 1, 1, 56, 1, true), paño: new THREE.CylinderGeometry(1, 1, 1, 24, 1, true, -0.85, 1.7), toro: new THREE.TorusGeometry(1, 0.06, 12, 56), cap: new THREE.CapsuleGeometry(P.pie.radio, P.pie.largo - 2 * P.pie.radio, 12, 32), caja: new THREE.BoxGeometry(1, 1, 1), capa: new THREE.CylinderGeometry(1, 1, 1, 40, 1, true, Math.PI * 0.62, Math.PI * 0.76) }), []);
  const tu = ropa.tunica;
  const pel = esq.pelvis, hom = esq.hombro;
  // torso de tela: la curva del torso hasta un poco arriba de los hombros
  const ptsT = esq.torsoCurva.filter((p) => p.y <= hom.y + 0.1);
  if (tu && ptsT.length > 2) actualizarTubo(tb.torso, remuestrear(ptsT, 24), (q) => 0.2 - 0.03 * q);
  const mang = tu?.mangas ?? "cortas";
  if (tu && mang) [esq.manoI, esq.manoD].forEach((m, i) => {
    const n = Math.max(3, Math.round(m.brazo.length * (mang === "largas" ? 0.86 : 0.42)));
    actualizarTubo(tb.mangas[i], remuestrear(m.brazo.slice(0, n), 16), (q) => (mang === "largas" ? 0.13 + 0.03 * q : 0.135));
  });
  if (ropa.calzas) [esq.pieI, esq.pieD].forEach((p, i) => actualizarTubo(tb.calzas[i], remuestrear(p.pierna.slice(0, Math.round(p.pierna.length * 0.94)), 20), 0.118));
  const botas = ropa.calzado?.tipo === "botas";
  if (botas) [esq.pieI, esq.pieD].forEach((p, i) => actualizarTubo(tb.cañas[i], remuestrear(p.pierna.slice(Math.round(p.pierna.length * 0.72)), 10), 0.128));
  // falda: cono abierto desde la cintura, vertical, hasta largo·(altura de la pelvis)
  const largo = tu?.largo ?? 0.55, vuelo = tu?.vuelo ?? 0.36;
  const top = pel.y + 0.16, bot = Math.max(0.06, pel.y * (1 - largo));
  const h = top - bot;
  // la falda se abre con el paso (distancia entre pies) para que las piernas no la atraviesen
  const abre = Math.min(0.25, Math.abs(esq.pieI.tobillo.x - esq.pieD.tobillo.x) * 0.25 + Math.abs(esq.pieI.tobillo.z - esq.pieD.tobillo.z) * 0.35);
  const rb = vuelo + abre;
  const mt = tu ? tela(tu.color) : undefined;
  const calzadoColor = ropa.calzado?.color ?? (botas ? "#5a3a24" : "#fbfbfb");
  return (
    <group>
      {tu && <>
        <mesh geometry={tb.torso.geo} material={mt} />
        {mang && tb.mangas.map((m, i) => <mesh key={i} geometry={m.geo} material={mt} />)}
        <mesh geometry={g.falda} material={mt} position={[pel.x, (top + bot) / 2, pel.z]} scale={[1, h, 1]}>
          {/* cono: radio arriba 0,2 → abajo rb (CylinderGeometry escalado no cambia radios: se arma acá) */}
        </mesh>
        {tu.cinto && <mesh geometry={g.toro} material={arcilla(tu.cinto)} position={[pel.x, pel.y + 0.2, pel.z]} rotation={[Math.PI / 2, 0, 0]} scale={[0.205, 0.205, 0.5]} />}
        {tu.cuello && <mesh geometry={g.toro} material={tela(tu.cuello)} position={[hom.x, hom.y + 0.06, hom.z]} rotation={[Math.PI / 2, 0, 0]} scale={[0.2, 0.2, 1.4]} />}
      </>}
      {ropa.delantal && <mesh geometry={g.paño} material={tela(ropa.delantal)} position={[pel.x, top - 0.02 - h * 0.42, pel.z]} scale={[1, h * 0.8, 1]} />}
      {ropa.capa && <mesh geometry={g.capa} material={tela(ropa.capa)} position={[hom.x, hom.y - 0.75, hom.z]} rotation={[Math.sin(t * 1.3) * 0.03, 0, 0]} scale={[0.36, 1.55, 0.34]} />}
      {ropa.calzas && tb.calzas.map((c, i) => <mesh key={i} geometry={c.geo} material={tela(ropa.calzas!)} />)}
      {botas && tb.cañas.map((c, i) => <mesh key={i} geometry={c.geo} material={arcilla(calzadoColor)} />)}
      {ropa.calzado && pies.map((p, i) => (
        <group key={i} position={p.pos} quaternion={p.q}>
          <mesh geometry={g.cap} material={arcilla(calzadoColor)} scale={[p.s.x * (ropa.calzado!.tipo === "zapatillas" ? 1.42 : 1.16), p.s.y * (ropa.calzado!.tipo === "zapatillas" ? 1.22 : 1.1), p.s.z * (ropa.calzado!.tipo === "zapatillas" ? 1.4 : 1.14)]} />
          {ropa.calzado!.tipo === "zapatillas" && <>
            {/* suela roja gruesa + cordones azules: se lee «zapatilla moderna» a cualquier tamaño (local +z = abajo) */}
            <mesh geometry={g.cap} material={arcilla("#e8473c")} position={[0, 0.02, P.pie.radio * 1.05]} scale={[p.s.x * 1.5, p.s.y * 1.28, p.s.z * 0.55]} />
            {[-0.04, 0.03].map((y, k) => <mesh key={k} geometry={g.caja} material={arcilla("#3a6ad8")} position={[0, y, -P.pie.radio * 1.36]} scale={[0.13, 0.026, 0.024]} />)}
          </>}
        </group>
      ))}
      {(["i", "d"] as const).map((k, i) => {
        const o = ropa.manos?.[k];
        return o ? <group key={k} position={manos[i].pos}><Objeto o={o} t={t} /></group> : null;
      })}
      <FaldaRadios geo={g.falda} rTop={0.2} rBot={rb} />
      <FaldaRadios geo={g.paño} rTop={0.215} rBot={0.2 + (rb - 0.2) * 0.82 + 0.02} />
    </group>
  );
};

// la falda es un cilindro abierto de radio 1 y alto 1: se deforman los vértices a cono (rTop arriba, rBot abajo)
const FaldaRadios: React.FC<{ geo: THREE.CylinderGeometry; rTop: number; rBot: number }> = ({ geo, rTop, rBot }) => {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const base = (geo.userData.base ??= Float32Array.from(pos.array as Float32Array)) as Float32Array;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
    const r = y > 0 ? rTop : rBot;
    pos.setXYZ(i, x * r, y, z * r);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return null;
};
