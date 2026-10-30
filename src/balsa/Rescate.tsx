// Escena 2+3 (storyboard frames 13–36): la balsa llena sobre el mar negro, aparece la aleta, el tiburón muerde
// la balsa (se desinfla esa cámara, la balsa se clava y saltan figuritas al agua), plano cerrado de una figurita
// que lucha en el agua y el tiburón que la acecha y se lanza, y el rescate: helicóptero con reflector, soga,
// el tiburón salta y erra por poco, la suben y se van. 100 % código, determinista por cuadro.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { mulberry32, ruido1 } from "../stickman3d/prng";
import { crearTubo, actualizarTubo } from "../stickman3d/geometria";
import { usarGeosBalsa, usarGeosFig, Figura, repartir, mezclaP, Pose, P_PARADO, RA, RB, RTUBO, curvaBorde, resorte, GeosFig } from "./Balsa";
import { usarAgua, actualizarAgua, Onda, Salpicon, gotasDe, Gotas, Espuma, EspumaMallas } from "./agua";
import { Tiburon, EstadoTiburon } from "./tiburon";
import { Helicoptero, EstadoHeli, geoReflector, ANCLA_SOGA } from "./helicoptero";
import { Post } from "./post";

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lin = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const io = (k: number) => Easing.bezier(0.45, 0, 0.25, 1)(cl(k));
const sale = (k: number) => Easing.out(Easing.cubic)(cl(k));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpV = (a: THREE.Vector3, b: THREE.Vector3, k: number) => a.clone().lerp(b, k);
const bez = (p: THREE.Vector3[], s: number) => { const u = 1 - s; return p[0].clone().multiplyScalar(u * u * u).addScaledVector(p[1], 3 * u * u * s).addScaledVector(p[2], 3 * u * s * s).addScaledVector(p[3], s * s * s); };
const G = 9.8 * 0.55;
const AGUA_Y = -0.62; // altura de la raíz de una figurita que flota (el agua le llega al pecho)

// ───────────────────────── lugares ─────────────────────────
const BALSA_Y = -0.085;
const MORDIDA = V(-2.74, 0, 0.32);
const HERO = V(-5.2, 0, 3.6);
const F2 = V(5.2, 0, -3.6).normalize(); // del héroe hacia la balsa (la cámara del plano 2 mira para allá)
const R2 = new THREE.Vector3().crossVectors(F2, V(0, 1, 0)).normalize(); // derecha de pantalla en el plano 2
const loc = (r: number, f: number, y = 0) => HERO.clone().addScaledVector(R2, r).addScaledVector(F2, f).setY(y);
const rumboHacia = (d: THREE.Vector3) => Math.atan2(-d.z, d.x); // rotY que lleva el +x local a d

// ───────────────────────── poses extra ─────────────────────────
const P_LUCHA = (t: number, s: number): Pose => {
  const a = Math.sin(t * 7.5 + s), b = Math.sin(t * 7.5 + s + 2.1);
  return { tronco: -0.05 + 0.06 * Math.sin(t * 3), cabeza: -0.25, cabezaY: 0.3 * Math.sin(t * 2.2 + s), muslo: [-0.5 + 0.4 * a, -0.5 - 0.4 * a], rodilla: [0.9, 0.9], abre: [0.2, 0.2],
    hombro: [-2.3 + 0.75 * a, -2.3 + 0.75 * b], hombroL: [0.75 + 0.3 * b, 0.75 + 0.3 * a], codo: [-0.5 - 0.3 * b, -0.5 - 0.3 * a], altura: 0.49 };
};
const P_ESPALDA = (t: number): Pose => ({ tronco: 0.1, cabeza: 0.35, cabezaY: 0.2 * Math.sin(t * 1.4), muslo: [-0.6, -0.45 + 0.15 * Math.sin(t * 4)], rodilla: [0.5, 0.7], abre: [0.3, 0.3],
  hombro: [-2.6 + 0.5 * Math.sin(t * 6), -2.4 + 0.5 * Math.sin(t * 6 + 2)], hombroL: [0.9, 0.9], codo: [-0.6, -0.6], altura: 0.49 });
const P_MANOS_ARRIBA = (t: number): Pose => ({ ...P_PARADO, tronco: -0.12, cabeza: -0.1, muslo: [-0.3, -0.1], rodilla: [0.6, 0.4], hombro: [-2.9 + 0.08 * Math.sin(t * 19), -2.85 + 0.08 * Math.sin(t * 17 + 1)], hombroL: [0.55, 0.55], codo: [-0.2, -0.2] });
const P_NADA = (t: number): Pose => {
  const c = t * 5.2;
  return { tronco: 0.25, cabeza: -0.35, cabezaY: 0.25 * Math.sin(c), muslo: [-0.2 + 0.5 * Math.sin(c * 1.6), -0.2 - 0.5 * Math.sin(c * 1.6)], rodilla: [0.4, 0.4], abre: [0.12, 0.12],
    hombro: [-(c % (Math.PI * 2)) - 0.3, -((c + Math.PI) % (Math.PI * 2)) - 0.3], hombroL: [0.25, 0.25], codo: [-0.3, -0.3], altura: 0.49 };
};
const P_COLGADO = (t: number, k: number): Pose => ({ tronco: 0.0, cabeza: -0.3, cabezaY: 0.1 * Math.sin(t), muslo: [-0.35 + 0.5 * Math.sin(t * 9) * k, -0.35 - 0.5 * Math.sin(t * 9) * k], rodilla: [0.6 + 0.4 * Math.sin(t * 9 + 1) * k, 0.6], abre: [0.15, 0.15],
  hombro: [-3.05, -2.95], hombroL: [0.1, 0.12], codo: [-0.12, -0.25], altura: 0.49 });
const P_SALUDA = (t: number): Pose => ({ ...P_LUCHA(t, 0), hombro: [-2.95, -1.4 + 0.3 * Math.sin(t * 6)], hombroL: [0.35 + 0.35 * Math.sin(t * 9), 0.8], codo: [-0.2, -0.6] });
const P_RESCATISTA: Pose = { tronco: 0.45, cabeza: 0.3, cabezaY: 0, muslo: [-1.4, -1.4], rodilla: [2.2, 2.2], abre: [0.25, 0.25], hombro: [-1.5, -1.3], hombroL: [0.1, 0.1], codo: [-0.4, -0.5], altura: 0.12 };

// ───────────────────────── tiburón ─────────────────────────
const AC1 = [V(-7.4, 0, 3.9), V(-5.4, 0, 4.7), V(-4.9, 0, 1.0), V(-3.95, 0, 0.42)];
const rumboBez = (s: number) => rumboHacia(bez(AC1, Math.min(1, s + 0.01)).sub(bez(AC1, Math.max(0, s - 0.01))));
const HEAD1 = MORDIDA.clone().sub(AC1[3]).setY(0).normalize();

export const tiburonEn = (T: number): EstadoTiburon & { visible: boolean } => {
  const base = { rolido: 0, escala: 1 };
  const fin = -0.4; // altura del centro con sólo la aleta afuera
  if (T < 3.6) {
    const s = io(T / 3.6 * 0.92 + 0.08 * (T / 3.6));
    const p = bez(AC1, s);
    return { ...base, pos: [p.x, fin + 0.012 * Math.sin(T * 3), p.z], rumbo: rumboBez(s), cabeceo: 0, boca: 0, fase: T * 6.5, amp: 0.09, visible: true };
  }
  if (T < 4.32) {
    const k = lin(T, 3.6, 4.32), e = Easing.in(Easing.quad)(k);
    const nariz = MORDIDA.clone().addScaledVector(HEAD1, 0.15);
    const c = lerpV(AC1[3], nariz.clone().addScaledVector(HEAD1, -1.22), e);
    const boca = T < 4.18 ? sale(lin(T, 3.75, 4.12)) : 1 - lin(T, 4.18, 4.32);
    return { ...base, pos: [c.x, lerp(fin, -0.07, sale(k)), c.z], rumbo: rumboHacia(HEAD1), cabeceo: 0.24 * Math.sin(k * Math.PI * 0.9), boca, fase: T * 11, amp: 0.13, visible: true };
  }
  if (T < 5.4) {
    const d = T - 4.32, dec = Math.exp(-1.6 * d);
    const c = MORDIDA.clone().addScaledVector(HEAD1, 0.15 - 1.22);
    return { ...base, pos: [c.x, -0.07 - 0.06 * lin(T, 4.32, 5.4), c.z], rumbo: rumboHacia(HEAD1) + 0.32 * dec * Math.sin(d * 13), rolido: 0.3 * dec * Math.sin(d * 11 + 1), cabeceo: 0.12 * dec, boca: 0.08, fase: T * 14, amp: 0.16 * dec + 0.05, visible: true };
  }
  if (T < 7.2) {
    const k = io(lin(T, 5.4, 7.2));
    const c = MORDIDA.clone().addScaledVector(HEAD1, 0.15 - 1.22 - 2.4 * k);
    return { ...base, pos: [c.x, lerp(-0.08, -2.0, k), c.z], rumbo: rumboHacia(HEAD1) + 0.4 * k, cabeceo: -0.38 * Math.sin(k * Math.PI), boca: 0, fase: T * 8, amp: 0.1, visible: true };
  }
  if (T < 8.5) return { ...base, pos: [0, -5, 0], rumbo: 0, cabeceo: 0, boca: 0, fase: 0, amp: 0, visible: false };
  // plano 2: acecha al héroe
  const hx = heroiR(T);
  if (T < 11.0) return { ...base, pos: [0, -5, 0], rumbo: 0, cabeceo: 0, boca: 0, fase: 0, amp: 0, visible: false };
  if (T < 14.2) {
    const k = io(lin(T, 11.0, 14.2));
    const r = lerp(5.2, 1.9, k), f = lerp(2.6, 0.3, k);
    const prev = loc(lerp(5.2, 1.9, io(lin(T - 0.05, 11.0, 14.2))), lerp(2.6, 0.3, io(lin(T - 0.05, 11.0, 14.2))));
    const p = loc(r, f);
    const dir = p.clone().sub(prev); const rb = dir.lengthSq() > 1e-8 ? rumboHacia(dir) : rumboHacia(R2.clone().negate());
    return { ...base, pos: [p.x, fin + 0.01 * Math.sin(T * 3), p.z], rumbo: rb, cabeceo: 0, boca: 0, fase: T * 6.5, amp: 0.09, visible: true };
  }
  if (T < 17.1) {
    const k = io(lin(T, 14.2, 15.4)), g = io(lin(T, 15.0, 17.1));
    const p = loc(lerp(1.9, 1.75, g), lerp(0.3, 0.2, g));
    return { ...base, pos: [p.x, lerp(fin, -0.13, k) + 0.02 * Math.sin(T * 2.2), p.z], rumbo: rumboHacia(loc(hx, 0).sub(p)), cabeceo: 0.05 * k, rolido: 0.04 * Math.sin(T * 1.7), boca: 0.12 + 0.05 * Math.sin(T * 2), fase: T * 3.5, amp: 0.06, visible: true };
  }
  if (T < 18.85) {
    const k = lin(T, 17.1, 18.85), e = Easing.in(Easing.quad)(k);
    const p = loc(lerp(1.75, hx + 1.35, e), lerp(0.2, 0.05, e));
    return { ...base, pos: [p.x, lerp(-0.13, 0.04, sale(k)), p.z], rumbo: rumboHacia(R2.clone().negate()), cabeceo: 0.26 * sale(k), boca: sale(lin(T, 17.2, 17.9)), fase: T * 12, amp: 0.13, visible: true };
  }
  // plano 3: da vueltas, salta y erra, sigue dando vueltas
  if (T < 25.4) {
    const a = (T - 18.85) * 0.42 + 0.3;
    const p = loc(heroiR(T) + 2.7 + 0.9 * Math.cos(a), 0.9 + 0.9 * Math.sin(a));
    const tg = loc(heroiR(T) + 2.7 - 0.9 * Math.sin(a), 0.9 + 0.9 * Math.cos(a)).sub(loc(heroiR(T) + 2.7, 0.9));
    return { ...base, pos: [p.x, fin + 0.01 * Math.sin(T * 3), p.z], rumbo: rumboHacia(tg), cabeceo: 0, boca: 0, fase: T * 6.5, amp: 0.09, visible: true };
  }
  if (T < 26.0) {
    const k = io(lin(T, 25.4, 26.0));
    const p = loc(lerp(heroiR(T) + 2.7, heroiR(T) + 0.35, k), lerp(0.9, 0.25, k));
    return { ...base, pos: [p.x, lerp(fin, -2.0, k), p.z], rumbo: rumboHacia(R2.clone().negate()), cabeceo: lerp(0, 1.2, k), boca: 0, fase: T * 9, amp: 0.1, visible: true };
  }
  if (T < 27.6) {
    // salto balístico: sale a 26,0, cumbre a 26,6, vuelve a entrar a 27,25
    const d = T - 26.0;
    const y = -2.0 + 7.6 * d - 0.5 * 12.8 * d * d; // cumbre ≈ +0,25 a los 0,59 s
    const p = loc(heroiR(T) + 0.35 - 0.55 * d, 0.25);
    const cab = lerp(1.25, 1.9, cl(d / 1.3)) - (d > 0.75 ? 0.8 * (d - 0.75) : 0);
    const boca = d < 0.45 ? sale(d / 0.35) : 1 - cl((d - 0.55) / 0.12);
    return { ...base, pos: [p.x, y, p.z], rumbo: rumboHacia(R2.clone().negate()), cabeceo: cab, rolido: 0.25 * d, boca, fase: T * 10, amp: 0.11, visible: true };
  }
  if (T < 28.6) return { ...base, pos: [0, -5, 0], rumbo: 0, cabeceo: 0, boca: 0, fase: 0, amp: 0, visible: false };
  const a = (T - 28.6) * 0.55;
  const p = loc(heroiR(23) + 1.5 * Math.cos(a), 0.3 + 1.5 * Math.sin(a));
  const tg = V(-Math.sin(a), 0, Math.cos(a)); const tgW = R2.clone().multiplyScalar(tg.x).addScaledVector(F2, tg.z);
  return { ...base, pos: [p.x, fin + 0.01 * Math.sin(T * 3), p.z], rumbo: rumboHacia(tgW), cabeceo: 0, boca: 0, fase: T * 6.5, amp: 0.09, visible: true };
};

// ───────────────────────── héroe ─────────────────────────
function heroiR(T: number) { return T < 16.0 ? 0 : lerp(0, -0.9, io(lin(T, 16.0, 18.85))); }

// ───────────────────────── helicóptero ─────────────────────────
const RUMBO_HELI = Math.atan2(-F2.x, -F2.z); // la puerta (+z local) mira a la cámara y la nariz a la derecha de pantalla
const ESPEJO = 1;
const anclaMundo = (pos: THREE.Vector3, rumbo: number, cab: number, rol: number) =>
  ANCLA_SOGA.clone().multiply(V(1, 1, ESPEJO)).applyEuler(new THREE.Euler(rol, rumbo, cab, "YXZ")).add(pos);
const HOVER = (() => { const sobre = loc(-0.9 + 0.32, 0.0, 4.55); const a = anclaMundo(V(), RUMBO_HELI, 0, 0); return sobre.sub(a.setY(0)); })();

export const heliEn = (T: number): EstadoHeli & { visible: boolean } => {
  const b = heliBase(T);
  if (!b.visible) return b;
  // el reflector barre el agua y encuentra al héroe
  const busca = loc(-4.2 + 3.3 * io(lin(T, 18.85, 20.8)), 1.6 - 1.6 * io(lin(T, 18.85, 20.8)), 0);
  let mira = T < 20.8 ? busca : heroPos(T).setY(Math.max(0, heroPos(T).y - 0.2));
  if (T > 31.0) mira = loc(-1.5 - 3 * lin(T, 31, 34), 1.0 + 3 * lin(T, 31, 34), 0);
  return { ...b, mira };
};
const heliBase = (T: number): EstadoHeli & { visible: boolean } => {
  const rotor = T * 2 * Math.PI * 0.62;
  if (T < 18.85) return { pos: [0, -20, 0], rumbo: 0, cabeceo: 0, rolido: 0, rotor, mira: V(), haz: 0, visible: false };
  let p: THREE.Vector3, cab = 0, rol = 0;
  const bob = V(0, 0.05 * Math.sin(T * 1.4) + 0.02 * Math.sin(T * 2.9), 0);
  if (T < 21.4) {
    const k = sale(lin(T, 18.85, 21.4));
    p = HOVER.clone().addScaledVector(R2, -7.5 * (1 - k)).addScaledVector(F2, 2.5 * (1 - k)).add(V(0, 1.6 * (1 - k), 0));
    cab = -0.2 * (1 - k) + 0.12 * Math.sin(k * Math.PI) * (k > 0.6 ? 1 : 0); // morro abajo al avanzar, «flare» al llegar
    rol = 0.06 * (1 - k);
  } else if (T < 31.0) {
    p = HOVER.clone().add(bob);
    rol = 0.02 * Math.sin(T * 1.1);
  } else {
    const k = Easing.in(Easing.cubic)(lin(T, 31.0, 34.2));
    p = HOVER.clone().add(bob).addScaledVector(R2, 9 * k).addScaledVector(F2, 9 * k).add(V(0, 3.2 * k, 0));
    cab = -0.24 * sale(lin(T, 31.0, 32.2));
    rol = -0.1 * sale(lin(T, 31.2, 32.5));
  }
  return { pos: [p.x, p.y, p.z], rumbo: RUMBO_HELI, cabeceo: cab, rolido: rol, rotor, mira: V(), haz: sale(lin(T, 18.9, 19.5)), visible: true };
};

// soga: punto de anclaje, punta y si el héroe está colgado
const sogaEn = (T: number) => {
  const h = heliBase(T);
  const A = anclaMundo(V(...h.pos), h.rumbo, h.cabeceo, h.rolido);
  let largo = 0.15;
  if (T > 21.0) largo = lerp(0.15, A.y - 0.35, io(lin(T, 21.0, 23.1)));
  if (T > 24.3) largo = lerp(A.y - 0.35, A.y - 2.25, io(lin(T, 24.3, 26.5)));
  if (T > 27.4) largo = lerp(A.y - 2.25, 1.22, io(lin(T, 27.4, 30.2)));
  const balanceo = V(0.1 * Math.sin(T * 1.7) * cl(largo / 3), 0, 0.07 * Math.sin(T * 1.3 + 1) * cl(largo / 3));
  const E = A.clone().add(V(0, -largo, 0)).add(balanceo);
  return { A, E, largo, colgado: T >= 23.5 };
};

const MANOS = 1.1; // de la raíz a las manos con los brazos arriba
function heroPos(T: number) {
  const esp = io(lin(T, 10.6, 11.2)) * (1 - io(lin(T, 13.0, 13.6)));
  if (T < 23.5) return loc(heroiR(T), 0, AGUA_Y + 0.03 * Math.sin(T * 2.3) + 0.5 * esp);
  const s = sogaEn(T);
  const k = sale(lin(T, 23.5, 23.85));
  const colg = s.E.clone().add(V(0, -MANOS, 0));
  const enAgua = loc(heroiR(T), 0, AGUA_Y);
  return lerpV(enAgua, colg.y < enAgua.y ? enAgua.clone().setX(colg.x).setZ(colg.z) : colg, k);
}

// ───────────────────────── figuritas de la balsa ─────────────────────────
type Volador = { i: number; t0: number; p0: THREE.Vector3; v: THREE.Vector3; giro: [number, number]; tAgua: number; semilla: number };
const usarVoladores = () => useMemo(() => {
  const pl = repartir();
  const rnd = mulberry32(77);
  const vol: Volador[] = [];
  pl.forEach((p, i) => {
    const w = V(p.x, p.y + BALSA_Y, p.z);
    const d = Math.hypot(p.x - MORDIDA.x, p.z - MORDIDA.z);
    if (d > 1.75 || vol.length >= 11) return;
    const fuera = V(p.x - MORDIDA.x, 0, p.z - MORDIDA.z).normalize();
    const lat = V(-fuera.z, 0, fuera.x).multiplyScalar((rnd() - 0.5) * 1.4);
    const v = fuera.add(lat).normalize().multiplyScalar(1.1 + rnd() * 1.5).add(V(0, 2.6 + rnd() * 1.4, 0));
    const t0 = 4.34 + d * 0.06 + rnd() * 0.05;
    // tiempo hasta que la raíz llega a -0,2
    const a = 0.5 * G, b = -v.y, c = -0.2 - w.y; const tA = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    vol.push({ i, t0, p0: w, v, giro: [(rnd() - 0.5) * 9, (rnd() - 0.5) * 9], tAgua: t0 + tA, semilla: i * 13 + 5 });
  });
  return { pl, vol };
}, []);

// ───────────────────────── cámaras por plano ─────────────────────────
type Toma = { pos: THREE.Vector3; mira: THREE.Vector3; fov: number; rol?: number };
const esf = (mira: THREE.Vector3, dist: number, el: number, az: number) => mira.clone().add(V(dist * Math.cos(el) * Math.sin(az), dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az)));
const D = THREE.MathUtils.degToRad;
export const tomaEn = (T: number): Toma & { plano: number } => {
  if (T < 8.5) {
    const k = io(T / 8.5);
    const mira = V(lerp(-1.25, -1.15, k), 0.1, lerp(0.75, 0.55, k));
    return { plano: 1, pos: esf(mira, lerp(10.8, 9.0, k), D(lerp(31, 27, k)), D(lerp(-36, -27, k))), mira, fov: 30, rol: D(-9) };
  }
  if (T < 18.85) {
    const k = io(lin(T, 8.5, 18.85)), emp = io(lin(T, 17.0, 18.85));
    const h = loc(heroiR(T) * 0.6, 0, 0.2);
    const pos = h.clone().addScaledVector(F2, -lerp(3.3, 2.7, k) + 0.4 * emp).addScaledVector(R2, lerp(-0.7, 0.2, k)).setY(lerp(1.0, 0.8, k));
    return { plano: 2, pos, mira: h.clone().addScaledVector(F2, 0.4).addScaledVector(R2, 0.75 * io(lin(T, 13.0, 15.0)) - 0.3 * io(lin(T, 16.5, 18.5))), fov: 32 };
  }
  if (T < 24.4) {
    const k = io(lin(T, 18.85, 24.4));
    const h = loc(-0.9, 0, 0);
    return { plano: 3, pos: h.clone().addScaledVector(F2, -lerp(9.0, 8.2, k)).addScaledVector(R2, lerp(1.6, 1.1, k)).setY(1.35), mira: h.clone().addScaledVector(R2, 0.2).setY(lerp(2.4, 2.1, k)), fov: 36 };
  }
  if (T < 28.4) {
    const k = io(lin(T, 24.4, 28.4));
    const hp = heroPos(T);
    const m = loc(-0.6, 0, lerp(0.9, 1.5, k)).lerp(hp.clone().setY(hp.y + 0.6), 0.25);
    return { plano: 4, pos: m.clone().addScaledVector(F2, -lerp(4.6, 4.2, k)).addScaledVector(R2, 0.9).setY(lerp(0.75, 1.1, k)), mira: m, fov: 34 };
  }
  const k = io(lin(T, 28.4, 34));
  const h = loc(-0.9, 0, 0);
  return { plano: 5, pos: h.clone().addScaledVector(F2, -lerp(9.5, 10.5, k)).addScaledVector(R2, 0.6).setY(lerp(1.6, 2.0, k)), mira: h.clone().addScaledVector(F2, 1.5 * k).setY(lerp(2.6, 3.4, k)), fov: 36 };
};

// ───────────────────────── eventos de agua ─────────────────────────
const usarEventos = (vol: Volador[]) => useMemo(() => {
  const ondas: Onda[] = [], sal: Salpicon[] = [], esp: (Espuma & { sigue?: (t: number) => [number, number] })[] = [];
  // estela de la aleta (cada 0,1 s mientras corta la superficie)
  for (let T = 0; T < 34; T += 0.1) {
    const e = tiburonEn(T);
    if (!e.visible || e.pos[1] < -0.55 || e.pos[1] > -0.2) continue;
    const adelante = V(Math.cos(e.rumbo), 0, -Math.sin(e.rumbo));
    const fin = V(e.pos[0], 0, e.pos[2]).addScaledVector(adelante, 0.12);
    ondas.push({ x: fin.x, z: fin.z, t0: T, amp: 0.006, vel: 0.55, ancho: 0.12 });
  }
  // mordida
  sal.push({ x: MORDIDA.x - 0.15, z: MORDIDA.z, t0: 4.25, n: 320, fuerza: 1.15, semilla: 11 });
  sal.push({ x: MORDIDA.x - 0.4, z: MORDIDA.z + 0.2, t0: 4.4, n: 140, fuerza: 0.8, semilla: 12 });
  ondas.push({ x: MORDIDA.x, z: MORDIDA.z, t0: 4.3, amp: 0.05, vel: 1.4, ancho: 0.3 });
  ondas.push({ x: MORDIDA.x, z: MORDIDA.z, t0: 4.9, amp: 0.025, vel: 1.2, ancho: 0.25 });
  esp.push({ x: MORDIDA.x - 0.2, z: MORDIDA.z, t0: 4.3, t1: 7.5, radio: 0.7, n: 60, semilla: 3 });
  // caídas de los que saltan
  vol.forEach((v, k) => {
    const a = v.tAgua - v.t0; const p = v.p0.clone().addScaledVector(v.v, a);
    sal.push({ x: p.x, z: p.z, t0: v.tAgua, n: 70, fuerza: 0.6, semilla: 100 + k });
    ondas.push({ x: p.x, z: p.z, t0: v.tAgua, amp: 0.03, vel: 1.1, ancho: 0.2 });
    esp.push({ x: p.x, z: p.z, t0: v.tAgua, t1: 34, radio: 0.22, n: 14, semilla: 200 + k });
  });
  // héroe pataleando (plano 2 y 3)
  const rnd = mulberry32(5);
  for (let T = 8.4; T < 23.6; T += 0.22 + rnd() * 0.12) {
    if (T > 10.6 && T < 13.6) { if (rnd() < 0.6) continue; }
    const h = loc(heroiR(T), 0); const lado = rnd() < 0.5 ? -1 : 1;
    const p = h.clone().addScaledVector(R2, lado * 0.22).addScaledVector(F2, (rnd() - 0.5) * 0.2);
    sal.push({ x: p.x, z: p.z, t0: T, n: 16 + Math.floor(rnd() * 14), fuerza: 0.34 + rnd() * 0.12, semilla: Math.floor(T * 100), corona: true });
    ondas.push({ x: p.x, z: p.z, t0: T, amp: 0.012, vel: 0.9, ancho: 0.12 });
  }
  esp.push({ x: 0, z: 0, t0: 8.4, t1: 23.8, radio: 0.3, n: 26, semilla: 9, sigue: (t) => { const h = loc(heroiR(t), 0); return [h.x, h.z]; } });
  // tiburón asoma, se lanza, salta y vuelve a caer
  { const p = tiburonEn(14.5).pos; sal.push({ x: p[0], z: p[2], t0: 14.4, n: 60, fuerza: 0.5, semilla: 31 }); ondas.push({ x: p[0], z: p[2], t0: 14.4, amp: 0.02, vel: 0.9, ancho: 0.3 }); }
  { const p = loc(1.2, 0.1); sal.push({ x: p.x, z: p.z, t0: 17.6, n: 160, fuerza: 0.85, dir: [-R2.x, -R2.z], semilla: 32 }); }
  { const p = loc(heroiR(26) + 0.35, 0.25); sal.push({ x: p.x, z: p.z, t0: 26.12, n: 260, fuerza: 1.05, semilla: 33 }); ondas.push({ x: p.x, z: p.z, t0: 26.1, amp: 0.05, vel: 1.2, ancho: 0.3 }); }
  { const p = loc(heroiR(27) + 0.35 - 0.7, 0.25); sal.push({ x: p.x, z: p.z, t0: 27.3, n: 320, fuerza: 1.2, semilla: 34 });
    [27.3, 27.9, 28.6].forEach((t, i) => ondas.push({ x: p.x, z: p.z, t0: t, amp: 0.06 - i * 0.015, vel: 1.0, ancho: 0.3 }));
    esp.push({ x: p.x, z: p.z, t0: 27.3, t1: 31, radio: 0.8, n: 70, semilla: 35 }); }
  // el héroe sale del agua
  { const p = loc(heroiR(23.6), 0); sal.push({ x: p.x, z: p.z, t0: 23.7, n: 50, fuerza: 0.45, semilla: 36 }); }
  // estela del rotor en el agua bajo el helicóptero
  for (let T = 21.0; T < 31; T += 0.6) { const p = loc(-0.9 + 0.32, 0); ondas.push({ x: p.x, z: p.z, t0: T, amp: 0.006, vel: 0.8, ancho: 0.25 }); }
  return { ondas, gotas: gotasDe(sal), esp };
}, [vol]);

// ───────────────────────── escena ─────────────────────────
const Escena: React.FC<{ T: number }> = ({ T }) => {
  const { camera, scene } = useThree();
  const toma = tomaEn(T);
  const c = camera as THREE.PerspectiveCamera;
  c.position.copy(toma.pos); c.up.set(0, 1, 0); c.lookAt(toma.mira);
  if (toma.rol) c.rotateZ(toma.rol);
  c.fov = toma.fov; c.near = 0.3; c.far = 90; c.updateProjectionMatrix(); c.updateMatrixWorld();

  const gb = usarGeosBalsa();
  const gf = usarGeosFig();
  const { pl, vol } = usarVoladores();
  const ev = usarEventos(vol);
  const agua = usarAgua();
  const mats = useMemo(() => ({
    pvc: new THREE.MeshPhysicalMaterial({ color: "#e9e9e7", roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.35, sheen: 0.2, sheenColor: new THREE.Color("#ffffff") }),
    pisoB: new THREE.MeshPhysicalMaterial({ color: "#d9d9d6", roughness: 0.55, clearcoat: 0.1 }),
    casco: new THREE.MeshPhysicalMaterial({ color: "#8d9195", roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
    costura: new THREE.MeshPhysicalMaterial({ color: "#c9cacb", roughness: 0.5 }),
    cabo: new THREE.MeshStandardMaterial({ color: "#3a3d40", roughness: 0.6 }),
    arcilla: new THREE.MeshPhysicalMaterial({ color: "#c63b31", roughness: 0.6, sheen: 0.45, sheenColor: new THREE.Color("#ff8a78"), sheenRoughness: 0.5, clearcoat: 0.08, clearcoatRoughness: 0.7 }),
    oscura: new THREE.MeshPhysicalMaterial({ color: "#1c1e21", roughness: 0.6, sheen: 0.3, sheenColor: new THREE.Color("#8090a0") }),
    gota: new THREE.MeshPhysicalMaterial({ color: "#d7e2ea", roughness: 0.04, metalness: 0.0, clearcoat: 1, envMapIntensity: 2.2, emissive: new THREE.Color("#1a2026") }),
    espuma: new THREE.MeshStandardMaterial({ color: "#eef3f6", roughness: 0.55, emissive: new THREE.Color("#141a1f") }),
    soga: new THREE.MeshStandardMaterial({ color: "#b9b4a8", roughness: 0.85 }),
  }), []);
  const sogaTubo = useMemo(() => crearTubo(40, 10, 4), []);

  // niebla y entorno
  const env = useMemo(() => {
    const sc = new THREE.Scene();
    sc.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.018, 0.02, 0.024), side: THREE.BackSide })));
    const sb = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.9, 1.9, 1.95), side: THREE.DoubleSide }));
    sb.position.set(-8, 30, 10); sb.lookAt(0, 0, 0); sc.add(sb);
    const tira = new THREE.Mesh(new THREE.PlaneGeometry(30, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6, 0.66, 0.72), side: THREE.DoubleSide }));
    tira.position.set(20, 8, -20); tira.lookAt(0, 0, 0); sc.add(tira);
    return sc;
  }, []);
  const { gl } = useThree();
  const envTex = useMemo(() => { const pm = new THREE.PMREMGenerator(gl); const rt = pm.fromScene(env, 0.04); pm.dispose(); return rt.texture; }, [gl, env]);
  scene.environment = envTex;
  const p3 = toma.plano >= 3;
  scene.environmentIntensity = p3 ? 0.3 : 0.38;
  const NIEBLA = new THREE.Color(0.012, 0.014, 0.016);
  if (!(scene.fog instanceof THREE.FogExp2)) scene.fog = new THREE.FogExp2(NIEBLA, 0.03);
  (scene.fog as THREE.FogExp2).density = toma.plano === 1 ? 0.028 : toma.plano === 2 ? 0.05 : 0.034;

  // balsa: tirón, cabeceo y la cámara mordida que se desinfla
  const dM = T - 4.32;
  const golpe = dM > 0 ? Math.exp(-2.2 * dM) : 0;
  const balsaRz = dM > 0 ? 0.13 * golpe * Math.cos(dM * 7) + 0.035 * cl(dM / 1.2) : 0;
  const balsaRx = dM > 0 ? -0.05 * golpe * Math.sin(dM * 6) : 0;
  const balsaX = dM > 0 ? -0.22 * golpe * Math.cos(dM * 5) : 0;
  const desinfla = sale(lin(T, 4.32, 5.6));
  const tubo = useMemo(() => {
    const curva = curvaBorde(RA, RB, RTUBO + 0.02);
    const g = gb.tubo; const base = (g.attributes.position.array as Float32Array).slice();
    const tubular = 520, radial = 56;
    const cent: number[] = [], us: number[] = [];
    for (let i = 0; i <= tubular; i++) { const p = curva.getPointAt(i / tubular); for (let j = 0; j <= radial; j++) { cent.push(p.x, p.y, p.z); us.push(i / tubular); } }
    // parámetro de la mordida
    let uB = 0, best = 1e9; for (let i = 0; i <= 400; i++) { const p = curva.getPointAt(i / 400); const d = Math.hypot(p.x - MORDIDA.x, p.z - MORDIDA.z); if (d < best) { best = d; uB = i / 400; } }
    return { g, base, cent, us, uB };
  }, [gb]);
  {
    const pos = tubo.g.attributes.position.array as Float32Array;
    for (let k = 0; k < tubo.us.length; k++) {
      let du = Math.abs(tubo.us[k] - tubo.uB); du = Math.min(du, 1 - du);
      const d = desinfla * Math.exp(-((du / 0.075) ** 2));
      const cx = tubo.cent[k * 3], cy = tubo.cent[k * 3 + 1], cz = tubo.cent[k * 3 + 2];
      const bx = tubo.base[k * 3] - cx, by = tubo.base[k * 3 + 1] - cy, bz = tubo.base[k * 3 + 2] - cz;
      const arr = 1 - 0.55 * d + 0.07 * d * Math.sin(k * 0.37) * Math.sin(tubo.us[k] * 900);
      pos[k * 3] = cx + bx * arr; pos[k * 3 + 1] = cy + by * arr * (1 - 0.25 * d) - 0.12 * d; pos[k * 3 + 2] = cz + bz * arr;
    }
    tubo.g.attributes.position.needsUpdate = true;
    if (desinfla > 0 && desinfla < 1) tubo.g.computeVertexNormals();
    else if (desinfla >= 1 && !tubo.g.userData.listo) { tubo.g.computeVertexNormals(); tubo.g.userData.listo = true; }
  }

  // tiburón, helicóptero, soga
  const tb = tiburonEn(T);
  const he = heliEn(T);
  const sg = sogaEn(T);
  const ref = he.visible ? geoReflector(he) : null;
  const ANG = 0.21;

  // agua
  actualizarAgua(agua, {
    t: T, cam: c.position, ondas: ev.ondas, niebla: (scene.fog as THREE.FogExp2).density, luzInt: p3 ? 0.35 : 1,
    spot: ref ? { pos: ref.lente, dir: ref.dir, cosExt: Math.cos(ANG * 1.05), cosInt: Math.cos(ANG * 0.55), int: he.haz } : undefined,
  });

  // luces: luna (con sombra que sigue al plano), contraluz frío relativo a la cámara
  const foco = toma.mira.clone().setY(0);
  const luna = useMemo(() => { const l = new THREE.DirectionalLight("#fff4ea", 1); l.castShadow = true; l.shadow.mapSize.set(4096, 4096); l.shadow.bias = -0.0002; l.shadow.normalBias = 0.012; const cs = l.shadow.camera as THREE.OrthographicCamera; cs.left = -5.5; cs.right = 5.5; cs.top = 5.5; cs.bottom = -5.5; cs.near = 1; cs.far = 40; return l; }, []);
  luna.position.copy(foco).add(V(-5.5, 13, 5)); luna.target.position.copy(foco); luna.target.updateMatrixWorld();
  luna.intensity = toma.plano === 1 ? 2.7 : toma.plano === 2 ? 2.2 : 0.55;
  const fw = toma.mira.clone().sub(toma.pos).setY(0).normalize();
  const rim = foco.clone().addScaledVector(fw, 9).add(V(0, 4.5, 0));
  const spot = useMemo(() => { const s = new THREE.SpotLight("#fff6ec", 0, 0, ANG, 0.55, 0); s.castShadow = true; s.shadow.mapSize.set(2048, 2048); s.shadow.bias = -0.0003; s.shadow.camera.near = 0.5; s.shadow.camera.far = 30; return s; }, []);
  if (ref) { spot.position.copy(ref.lente); spot.target.position.copy(he.mira); spot.target.updateMatrixWorld(); }
  spot.intensity = ref ? 8 * he.haz : 0;

  // figuritas de la balsa (pánico desde que ven la aleta)
  const panico = sale(lin(T, 2.0, 2.7));
  const volando = new Set(vol.map((v) => v.i));

  const heroVisible = T >= 8.5 && T < 30.9;
  const hp = heroPos(T);
  let heroPose: Pose, heroRot: [number, number, number] = [0, rumboHacia(R2.clone().negate()) - Math.PI / 2, 0];
  const caraA = (d: THREE.Vector3) => rumboHacia(d) - Math.PI / 2; // la figurita mira hacia +z local
  if (T < 10.6) { heroPose = P_LUCHA(T, 0); heroRot = [0, caraA(F2.clone().negate()) + 0.4 * Math.sin(T * 0.8), 0]; }
  else if (T < 13.6) {
    const k = io(lin(T, 10.6, 11.2)) * (1 - io(lin(T, 13.0, 13.6)));
    heroPose = mezclaP(P_LUCHA(T, 0), P_ESPALDA(T), k);
    heroRot = [-1.2 * k, caraA(F2.clone().negate()), 0];
  } else if (T < 16.0) {
    const k = io(lin(T, 13.6, 14.6));
    heroPose = mezclaP(P_LUCHA(T, 0), P_MANOS_ARRIBA(T), k);
    heroRot = [0, lerp(caraA(F2.clone().negate()), caraA(R2), k), 0];
  } else if (T < 18.85) {
    const k = io(lin(T, 16.0, 16.5));
    heroPose = mezclaP(P_MANOS_ARRIBA(T), P_NADA(T), k);
    heroRot = [0.5 * k, lerp(caraA(R2), caraA(R2.clone().negate()), k), 0];
  } else if (T < 23.2) {
    heroPose = T > 21.0 ? mezclaP(P_LUCHA(T, 1), P_SALUDA(T), io(lin(T, 21.0, 21.5))) : P_LUCHA(T, 1);
    heroRot = [0, caraA(F2.clone().negate()) - 0.5, 0];
  } else {
    const k = io(lin(T, 23.2, 23.6));
    heroPose = mezclaP(P_SALUDA(T), P_COLGADO(T, T < 27.5 ? 1 : 0.35), k);
    heroRot = [0.05 * Math.sin(T * 1.7), caraA(F2.clone().negate()) - 0.5 * (1 - k) + 0.25 * Math.sin(T * 0.9), 0.06 * Math.sin(T * 1.3)];
  }
  // al llegar arriba, entra por la puerta
  let heroEnHeli = false;
  if (T >= 30.2) heroEnHeli = true;

  // soga
  if (he.visible) {
    const n = 40, pts: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) { const s = i / (n - 1); const p = lerpV(sg.A, sg.E, s); p.x += 0.04 * Math.sin(s * Math.PI) * Math.sin(T * 2.1); pts.push(p); }
    actualizarTubo(sogaTubo, pts, 0.014);
    sogaTubo.geo.attributes.position.needsUpdate = true; sogaTubo.geo.attributes.normal.needsUpdate = true; sogaTubo.geo.computeBoundingSphere();
  }

  return (
    <>
      <primitive object={luna} />
      <primitive object={luna.target} />
      <primitive object={spot} />
      <primitive object={spot.target} />
      <directionalLight position={rim} intensity={p3 ? 0.55 : 1.0} color="#cfe0ff" />
      <hemisphereLight args={["#ffffff", "#0e1012", p3 ? 0.05 : 0.14]} />
      <directionalLight position={toma.pos.clone().add(V(0, 6, 0)).addScaledVector(R2, -4)} intensity={p3 ? 1.1 : 0} color="#dfe8f4" />
      <primitive object={agua} />

      {/* balsa */}
      <group position={[balsaX, BALSA_Y + 0.01 * Math.sin(T * 1.3), 0]} rotation={[balsaRx + 0.006 * Math.sin(T * 0.9), 0, balsaRz]}>
        <mesh geometry={tubo.g} material={mats.pvc} castShadow receiveShadow />
        <mesh geometry={gb.casco} material={mats.casco} receiveShadow />
        <mesh geometry={gb.piso} material={mats.pisoB} receiveShadow />
        {gb.costuras.map((g, i) => <mesh key={`c${i}`} geometry={g} material={mats.costura} receiveShadow />)}
        {gb.listones.map((g, i) => <mesh key={`s${i}`} geometry={g} material={mats.pisoB} castShadow receiveShadow />)}
        <mesh geometry={gb.caboGeo} material={mats.cabo} />
        {gb.presillas.map((p, i) => <mesh key={`q${i}`} geometry={gb.presillaGeo} material={mats.costura} position={p} scale={[1, 0.7, 1]} />)}
        {pl.map((p, i) => {
          if (volando.has(i) && T >= vol.find((v) => v.i === i)!.t0) return null;
          const sacudon = dM > 0 ? 0.08 * golpe * Math.sin(dM * 14 + i) : 0;
          const brazos: Pose = { ...p.pose, tronco: p.pose.tronco - 0.08, cabeza: -0.2,
            hombro: [-2.6 + 0.35 * Math.sin(T * 8 + i), -2.5 + 0.35 * Math.sin(T * 8 + i + 2)], hombroL: [0.5 + 0.2 * Math.sin(T * 6 + i), 0.5 + 0.2 * Math.cos(T * 6 + i)], codo: [-0.35, -0.35] };
          const pose = mezclaP(p.pose, brazos, panico * (0.75 + 0.25 * Math.sin(i * 1.7)));
          const vida = { ...pose, cabezaY: pose.cabezaY + 0.25 * ruido1(T * 0.8 + i * 3.1, i) * (0.3 + panico), tronco: pose.tronco + sacudon };
          return <group key={i} position={[p.x, p.y + Math.abs(sacudon) * 0.6, p.z]} rotation={[0, p.rot, 0]} scale={p.alto}><Figura g={gf} mat={mats.arcilla} pose={vida} sq={0} /></group>;
        })}
      </group>

      {/* los que saltan al agua */}
      {vol.map((v) => {
        const a = T - v.t0;
        if (a < 0) return null;
        const pl0 = pl[v.i];
        const tA = v.tAgua - v.t0;
        let pos: THREE.Vector3, rot: [number, number, number], pose: Pose;
        if (a < tA) {
          pos = v.p0.clone().addScaledVector(v.v, a).add(V(0, -0.5 * G * a * a, 0));
          rot = [v.giro[0] * a, pl0.rot + 0.5 * a, v.giro[1] * a];
          pose = mezclaP(pl0.pose, P_LUCHA(T, v.i), sale(a / 0.3));
        } else {
          const b = a - tA;
          const xz = v.p0.clone().addScaledVector(v.v, tA + 0.22 * (1 - Math.exp(-3 * b)));
          const hund = -0.2 + (AGUA_Y + 0.2) * resorte(b, 9, 0.35) + 0.03 * Math.sin(T * 2.3 + v.i);
          pos = V(xz.x, hund, xz.z);
          const enderezar = 1 - sale(b / 0.6);
          rot = [v.giro[0] * tA * enderezar, pl0.rot + 0.5 * tA + 0.3 * Math.sin(T * 0.7 + v.i), v.giro[1] * tA * enderezar];
          pose = P_LUCHA(T, v.i);
        }
        return <group key={`v${v.i}`} position={pos} rotation={rot} scale={pl0.alto}><Figura g={gf} mat={mats.arcilla} pose={pose} sq={0} /></group>;
      })}

      {/* héroe */}
      {heroVisible && !heroEnHeli && (
        <group position={hp} rotation={heroRot}><Figura g={gf} mat={mats.arcilla} pose={heroPose} sq={0} /></group>
      )}

      <Tiburon e={tb} visible={tb.visible} />

      {he.visible && (
        <>
          <group scale={[1, 1, 1]}>
            <HelicopteroEspejado e={he} t={T} gf={gf} mats={mats} heroAdentro={heroEnHeli} />
          </group>
          <mesh geometry={sogaTubo.geo} material={mats.soga} castShadow />
          {!heroEnHeli && (
            <mesh position={sg.E} rotation={[Math.PI / 2, 0, 0]} material={mats.soga} castShadow>
              <torusGeometry args={[0.1, 0.016, 10, 32]} />
            </mesh>
          )}
        </>
      )}

      <Gotas gotas={ev.gotas} t={T} mat={mats.gota} />
      <EspumaMallas focos={ev.esp} t={T} mat={mats.espuma} sigue={(i, t) => ev.esp[i].sigue?.(t) ?? null} />

      <Post foco={toma.pos.distanceTo(toma.plano === 1 ? V(-1.2, 0.3, 0.6) : toma.plano === 2 ? hp.clone().setY(0.2) : toma.plano === 4 ? heroPos(T) : toma.mira)}
        apertura={toma.plano === 2 || toma.plano === 4 ? 0.0006 : 0.00025} maxDesenfoque={0.007} bloom={p3 ? 0.45 : 0.28} umbral={p3 ? 0.75 : 0.85} radioAO={0.3} />
    </>
  );
};

// el helicóptero con la puerta del lado de la cámara (espejado en z) y el rescatista asomado
const HelicopteroEspejado: React.FC<{ e: EstadoHeli; t: number; gf: GeosFig; mats: Record<string, THREE.Material>; heroAdentro: boolean }> = ({ e, t, gf, mats, heroAdentro }) => {
  const resc = (
    <group>
      <group position={[-0.32, -0.38, 0.25]} rotation={[0, 0, 0]} scale={0.82}>
        <Figura g={gf} mat={mats.oscura as THREE.Material} pose={{ ...P_RESCATISTA, hombro: [-1.5 + 0.15 * Math.sin(t * 3), -1.3 + 0.15 * Math.sin(t * 3 + 1)] }} sq={0} />
      </group>
      {heroAdentro && (
        <group position={[0.05, -0.38, 0.12]} rotation={[0, 0.6, 0]} scale={1}>
          <Figura g={gf} mat={mats.arcilla as THREE.Material} pose={{ ...P_RESCATISTA, tronco: 0.1, hombro: [-0.9, -2.6 + 0.3 * Math.sin(t * 7)], hombroL: [0.2, 0.6], codo: [-0.8, -0.3], cabeza: -0.1 }} sq={0} />
        </group>
      )}
    </group>
  );
  return (
    <group>
      <group scale={[1, 1, 1]}>
        <HeliEsp e={e} t={t} rescatista={resc} />
      </group>
    </group>
  );
};
const HeliEsp: React.FC<{ e: EstadoHeli; t: number; rescatista: React.ReactNode }> = ({ e, t, rescatista }) => (
  <Helicoptero e={e} angulo={0.21} t={t} rescatista={rescatista} />
);

const Fondo: React.FC = () => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false, toneMapped: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy*0.5+0.5; gl_Position = vec4(position.xy, 0.9999, 1.0);} `,
    fragmentShader: `varying vec2 vUv;
      void main(){
        vec2 p = (vUv - vec2(0.5, 0.62)) * vec2(1.5, 1.0);
        vec3 c = mix(vec3(0.03, 0.034, 0.038), vec3(0.008, 0.009, 0.011), smoothstep(0.0, 0.9, length(p)));
        float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
        gl_FragColor = vec4(c + (n - 0.5) / 255.0, 1.0);
      }`,
  }), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={-1000} userData={{ sinPost: true }} />;
};

export const RescateEscena: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const T = frame / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: "#040506" }}>
      <ThreeCanvas width={width} height={height} dpr={1.5} shadows="soft"
        gl={{ antialias: false, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08, outputColorSpace: THREE.SRGBColorSpace }}
        camera={{ fov: 30, position: [0, 9, 9], near: 0.3, far: 90 }}>
        <Fondo />
        <Escena T={T} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
