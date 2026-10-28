// La cara: trazos (tubos finos medio hundidos en la esfera, como pintura en relieve) y rellenos proyectados
// sobre la esfera. Todo geometría: nítida a cualquier resolución. Cantidad fija de piezas (se ocultan, no se crean).
import React, { useMemo } from "react";
import * as THREE from "three";
import { actualizarRelleno, actualizarTubo, crearRelleno, crearTubo, Relleno, remuestrear, trazoEnEsfera, Tubo, v3 } from "./geometria";
import type { Expresion, ParamOjo } from "./expresiones";
import { PROPORCIONES as P } from "./proporciones";

export type MatsCara = {
  pintura: THREE.Material; bocaInt: THREE.Material; lengua: THREE.Material; dientes: THREE.Material;
  corazon: THREE.Material; rubor: THREE.Material; agua: THREE.Material; vena: THREE.Material; aguaTrazo: THREE.Material; pupila: THREE.Material;
};

const R = P.cabeza.radio;
const NT = 64; // puntos por trazo
const ancho = P.cara.trazo;
type Pt = [number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cl01 = (x: number) => Math.max(0, Math.min(1, x));

// ---------- dibujo 2D de cada parte ----------
const geomOjo = (lado: number, o: ParamOjo, mx: number, my: number) => {
  const cx = lado * (P.cara.ojoSep / 2), cy = P.cara.ojoY;
  const ab = cl01(o.abierto);
  const hw = lerp(P.cara.ojoAncho / 2, 0.086 * o.tam, Math.pow(ab, 0.6));
  const ry = 0.092 * o.tam * ab;
  // cerrado = arco redondo (media elipse, como la ref); abierto = apenas curvado
  const base = (s: number) => cy - o.curva * lerp(0.08 * Math.sqrt(Math.max(0, 1 - s * s)), 0.052 * (1 - s * s), Math.min(1, ab * 3)) * (1 - 0.6 * ab);
  const tan = Math.tan(THREE.MathUtils.degToRad(o.parpadoAng));
  const yLid = (x: number) => cy + ry - o.parpado * 2 * ry + tan * (-(x - cx) * lado) * 0.9;
  const M = 48;
  const arriba: Pt[] = [], abajo: Pt[] = [];
  for (let k = 0; k <= M; k++) {
    const th = (k / M) * Math.PI, s = -Math.cos(th), x = cx + hw * s, sn = Math.sin(th);
    const b = base(s), top = b + ry * sn, bot = b - ry * sn;
    arriba.push([x, o.parpado > 0 ? Math.min(top, Math.max(yLid(x), bot)) : top]);
    abajo.push([x, bot]);
  }
  const cerrado = ab < 0.035;
  const lazo: Pt[] = cerrado ? arriba : [...arriba, ...abajo.slice(0, -1).reverse()];
  // pupila: círculo recortado por el párpado
  const pr = 0.036 * o.pupila * o.tam * cl01(ab * 2.2);
  let px = cx + mx * 0.032 * o.tam, py = cy + my * 0.03 * o.tam - 0.004;
  const topEn = (x: number) => { const s = Math.max(-1, Math.min(1, (x - cx) / hw)); const b = base(s), t2 = b + ry * Math.sqrt(1 - s * s); return o.parpado > 0 ? Math.min(t2, yLid(x)) : t2; };
  const botEn = (x: number) => { const s = Math.max(-1, Math.min(1, (x - cx) / hw)); return base(s) - ry * Math.sqrt(1 - s * s); };
  py = Math.min(py, topEn(px) - pr * 0.35);
  py = Math.max(py, botEn(px) + pr * 0.9);
  const pupila: Pt[] = [];
  for (let k = 0; k < 64; k++) {
    const a = (k / 64) * Math.PI * 2;
    const x = px + Math.cos(a) * pr;
    pupila.push([x, Math.min(py + Math.sin(a) * pr, topEn(x) - 0.006)]);
  }
  // anillo interior (ojos de círculos)
  const anillo: Pt[] = [];
  for (let k = 0; k <= 64; k++) { const a = (k / 64) * Math.PI * 2; anillo.push([cx + Math.cos(a) * hw * 0.58, cy + Math.sin(a) * ry * 0.58]); }
  // corazón
  const cor: Pt[] = [];
  const hs = 0.0068 * o.corazon * o.tam;
  for (let k = 0; k < 64; k++) {
    const t = (k / 64) * Math.PI * 2, s = Math.sin(t);
    cor.push([cx + 16 * s * s * s * hs, cy + 0.01 + (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * hs]);
  }
  cor.reverse(); // antihorario, como los demás rellenos
  // ceja
  const by = cy + Math.max(0.05, ry) + 0.058 + o.cejaAlt * 0.038;
  const ta = Math.tan(THREE.MathUtils.degToRad(o.cejaAng));
  const ceja: Pt[] = [];
  for (let k = 0; k <= 16; k++) {
    const q = k / 16 * 2 - 1, x = cx + lado * 0.004 + q * 0.062;
    ceja.push([x, by - ta * ((cx - x) * lado) + o.cejaCurva * 0.018 * (1 - q * q)]);
  }
  return { lazo, cerrado, pupila, pc: [px, py] as Pt, verPupila: pr > 0.004 && o.corazon < 0.5, anillo, cor, ceja, cx, cy, ry };
};

const geomBoca = (e: Expresion) => {
  const bx = e.bocaX, by = P.cara.bocaY + e.bocaY;
  const hw = (P.cara.bocaAncho / 2) * e.bocaAncho;
  const h = 0.16 * e.bocaAbierta;
  const linea = (s: number) => by + e.bocaCurva * 0.07 * (0.55 * s * s + 0.45 * s * s * s * s - 0.35) + e.bocaAsim * 0.03 * s + e.bocaOnda * 0.012 * Math.sin((s + 1) * Math.PI * 2.5);
  const M = 56;
  const arriba: Pt[] = [], abajo: Pt[] = [];
  for (let k = 0; k <= M; k++) {
    const th = (k / M) * Math.PI, s = -Math.cos(th), sn = Math.sin(th), x = bx + hw * s, l = linea(s);
    // la «D» de la carcajada: el labio de abajo cae redondo, el de arriba casi recto
    arriba.push([x, l + h * e.bocaArriba * Math.pow(sn, 0.85)]);
    abajo.push([x, l - h * (1 - e.bocaArriba) * Math.pow(sn, 0.75)]);
  }
  const cerrada = e.bocaAbierta < 0.03;
  const lazo: Pt[] = cerrada ? arriba : [...arriba, ...abajo.slice(0, -1).reverse()];
  const topEn = (x: number) => { const s = Math.max(-1, Math.min(1, (x - bx) / hw)); const th = Math.acos(-s); return linea(s) + h * e.bocaArriba * Math.pow(Math.sin(th), 0.85); };
  const botEn = (x: number) => { const s = Math.max(-1, Math.min(1, (x - bx) / hw)); const th = Math.acos(-s); return linea(s) - h * (1 - e.bocaArriba) * Math.pow(Math.sin(th), 0.75); };
  // lengua: óvalo apoyado en el labio de abajo, recortado adentro de la boca
  const lw = hw * 0.55 * Math.min(1, 0.6 + e.bocaAbierta), lh = h * 0.42 * e.lengua;
  const lcx = bx + hw * 0.08, lbase = botEn(lcx);
  const lengua: Pt[] = [];
  for (let k = 0; k < 64; k++) {
    const a = (k / 64) * Math.PI * 2, x = lcx + Math.cos(a) * lw;
    let y = lbase + lh * 0.75 + Math.sin(a) * lh;
    y = Math.max(y, botEn(x) + 0.006); y = Math.min(y, topEn(x) - 0.006);
    lengua.push([x, y]);
  }
  const dientes: Pt[] = [];
  for (let k = 0; k <= 31; k++) { const x = bx + hw * 0.82 * (k / 31 * 2 - 1); dientes.push([x, topEn(x) - 0.004]); }
  for (let k = 31; k >= 0; k--) { const x = bx + hw * 0.82 * (k / 31 * 2 - 1); dientes.push([x, Math.max(botEn(x) + 0.006, topEn(x) - h * 0.38)]); }
  const centro: Pt = [bx, (topEn(bx) + botEn(bx)) / 2];
  return { lazo, cerrada, centro, lengua, lc: [lcx, lbase + lh * 0.6] as Pt, dientes, dc: [bx, topEn(bx) - h * 0.2] as Pt };
};

const elipse = (cx: number, cy: number, rx: number, ry: number, n = 64): Pt[] => Array.from({ length: n }, (_, k) => { const a = (k / n) * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
const gota = (cx: number, cy: number, s: number, n = 64): Pt[] => Array.from({ length: n }, (_, k) => {
  // gota con la punta arriba: x = sen(a)·sen(a/2)^m, y = cos(a)
  const a = (k / n) * Math.PI * 2;
  return [cx + s * 0.8 * Math.sin(a) * Math.pow(Math.abs(Math.sin(a / 2)), 1.3), cy + s * 1.15 * Math.cos(a) - s * 0.15];
});

// ---------- componente ----------
type Piezas = {
  ojo: [Tubo, Tubo]; anillo: [Tubo, Tubo]; ceja: [Tubo, Tubo]; boca: Tubo; vena: Tubo[]; zzz: Tubo[]; chorro: [Tubo, Tubo];
  pupila: [Relleno, Relleno]; cor: [Relleno, Relleno]; bocaInt: Relleno; lengua: Relleno; dientes: Relleno;
  rubor: [Relleno, Relleno]; lagrima: [Relleno, Relleno]; sudor: Relleno;
};

export const Rostro: React.FC<{ e: Expresion; t: number; mats: MatsCara; sombras?: boolean }> = ({ e, t, mats, sombras = true }) => {
  const pz = useMemo<Piezas>(() => ({
    ojo: [crearTubo(NT * 2, 16, 6), crearTubo(NT * 2, 16, 6)], anillo: [crearTubo(NT, 16, 6), crearTubo(NT, 16, 6)],
    ceja: [crearTubo(24, 16, 6), crearTubo(24, 16, 6)], boca: crearTubo(NT * 2, 16, 6),
    vena: [0, 1, 2, 3].map(() => crearTubo(16, 12, 5)), zzz: [0, 1, 2].map(() => crearTubo(32, 12, 5)), chorro: [crearTubo(24, 16, 6), crearTubo(24, 16, 6)],
    pupila: [crearRelleno(64, 4), crearRelleno(64, 4)], cor: [crearRelleno(64, 5), crearRelleno(64, 5)],
    bocaInt: crearRelleno(Math.max(64, 112), 6), lengua: crearRelleno(64, 4), dientes: crearRelleno(64, 4),
    rubor: [crearRelleno(64, 8), crearRelleno(64, 8)], lagrima: [crearRelleno(64, 4), crearRelleno(64, 4)], sudor: crearRelleno(64, 4),
  }), []);

  const vis: Record<string, boolean> = {};
  const rTrazo = ancho / 2;
  const hundido = R - rTrazo * 0.35; // el centro del trazo queda apenas adentro: relieve de pintura

  // ojos
  ([1, -1] as const).forEach((lado, i) => {
    const o = lado === 1 ? e.I : e.D;
    const g = geomOjo(lado, o, e.miradaX, e.miradaY);
    const k = `ojo${i}`;
    vis[k] = o.corazon < 0.5;
    actualizarTubo(pz.ojo[i], trazoEnEsfera(g.lazo, NT * 2, R, hundido - R), rTrazo);
    vis[`pup${i}`] = g.verPupila && !g.cerrado;
    if (vis[`pup${i}`]) actualizarRelleno(pz.pupila[i], g.pupila, g.pc, R, 0.004);
    vis[`ani${i}`] = o.anillos > 0.5 && !g.cerrado;
    if (vis[`ani${i}`]) actualizarTubo(pz.anillo[i], trazoEnEsfera(g.anillo, NT, R, hundido - R), rTrazo * 0.85);
    vis[`cor${i}`] = o.corazon > 0.02;
    if (vis[`cor${i}`]) actualizarRelleno(pz.cor[i], g.cor, [g.cx, g.cy + 0.005], R, 0.006);
    vis[`ceja${i}`] = o.cejaVis > 0.05;
    if (vis[`ceja${i}`]) actualizarTubo(pz.ceja[i], trazoEnEsfera(g.ceja, 24, R, hundido - R), rTrazo * Math.min(1.35, 0.6 + 0.45 * o.cejaVis));
    // lágrimas que caen
    vis[`lag${i}`] = e.lagrimas > 0.02;
    if (vis[`lag${i}`]) {
      const fase = ((t * 0.55 + i * 0.47) % 1);
      const s = 0.03 * e.lagrimas * (fase < 0.12 ? fase / 0.12 : 1);
      actualizarRelleno(pz.lagrima[i], gota(g.cx + lado * 0.035, g.cy - 0.1 - fase * 0.22, s), [g.cx + lado * 0.035, g.cy - 0.1 - fase * 0.22 - s * 0.4], R, 0.01);
    }
    vis[`cho${i}`] = e.llanto > 0.02;
    if (vis[`cho${i}`]) {
      const pts: Pt[] = [];
      for (let k2 = 0; k2 <= 12; k2++) { const q = k2 / 12; pts.push([g.cx + lado * (0.01 + 0.02 * q) + 0.006 * Math.sin(q * 6 + t * 3), g.cy - 0.035 - q * 0.3 * e.llanto]); }
      actualizarTubo(pz.chorro[i], trazoEnEsfera(pts, 24, R, 0.002), (s) => rTrazo * (0.9 + 0.5 * s) * e.llanto);
    }
    vis[`rub${i}`] = e.rubor > 0.02;
    if (vis[`rub${i}`]) actualizarRelleno(pz.rubor[i], elipse(lado * 0.255, -0.035, 0.075, 0.042), [lado * 0.255, -0.035], R, 0.003, 1);
  });

  // boca
  const b = geomBoca(e);
  actualizarTubo(pz.boca, trazoEnEsfera(b.lazo, NT * 2, R, hundido - R), rTrazo);
  vis.bocaInt = !b.cerrada;
  if (!b.cerrada) {
    actualizarRelleno(pz.bocaInt, remuestrear(b.lazo.map(([x, y]) => v3(x, y, 0)), 112).map((p) => [p.x, p.y] as Pt).reverse(), b.centro, R, 0.002);
  }
  vis.lengua = !b.cerrada && e.lengua > 0.05;
  if (vis.lengua) actualizarRelleno(pz.lengua, b.lengua, b.lc, R, 0.0045);
  vis.dientes = !b.cerrada && e.dientes > 0.05;
  if (vis.dientes) actualizarRelleno(pz.dientes, remuestrear(b.dientes.map(([x, y]) => v3(x, y, 0)), 64).map((p) => [p.x, p.y] as Pt).reverse(), b.dc, R, 0.0045);

  // sudor en la sien (su derecha = pantalla izquierda)
  vis.sudor = e.sudor > 0.02;
  if (vis.sudor) { const s = 0.042 * e.sudor, yy = 0.19 - ((t * 0.12) % 0.08); actualizarRelleno(pz.sudor, gota(-0.335, yy, s), [-0.335, yy - s * 0.3], R, 0.012); }

  // vena de enojo 💢 (cuatro corchetes rojos en la frente, a su izquierda)
  vis.vena = e.vena > 0.02;
  if (vis.vena) {
    const cx = 0.2, cy = 0.31, s = 0.05 * e.vena * (1 + 0.08 * Math.sin(t * 9));
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], k) => {
      // corchete curvo con la panza hacia el centro
      const ccx = cx + sx * s, ccy = cy + sy * s, r = s * 0.72;
      const a0 = Math.atan2(0, -sx), a1 = Math.atan2(-sy, 0);
      let d = a1 - a0; if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2;
      const pts: Pt[] = [];
      for (let q = 0; q <= 8; q++) { const an = a0 + d * (q / 8); pts.push([ccx + r * Math.cos(an), ccy + r * Math.sin(an)]); }
      actualizarTubo(pz.vena[k], trazoEnEsfera(pts, 16, R, 0.004), rTrazo * 0.95);
    });
  }

  // zzz flotando (en el espacio de la cabeza, no pegados a la esfera)
  vis.zzz = e.zzz > 0.02;
  if (vis.zzz) [0, 1, 2].forEach((k) => {
    const f = ((t * 0.35 + k / 3) % 1), s = (0.11 + 0.06 * k) * e.zzz * Math.sin(Math.PI * Math.min(1, f * 1.4));
    const cx = 0.45 + f * 0.45, cy = 0.35 + f * 0.6;
    const pts = [v3(cx - s, cy + s, 0.15), v3(cx + s, cy + s, 0.15), v3(cx - s, cy - s, 0.15), v3(cx + s, cy - s, 0.15)];
    actualizarTubo(pz.zzz[k], remuestrear(pts, 32), Math.max(0.0005, rTrazo * 0.9 * Math.min(1, s / 0.05)));
  });

  const cs = sombras;
  return (
    <group>
      {pz.ojo.map((tb, i) => <mesh key={`o${i}`} geometry={tb.geo} material={mats.pintura} visible={vis[`ojo${i}`]} receiveShadow={false} />)}
      {pz.anillo.map((tb, i) => <mesh key={`a${i}`} geometry={tb.geo} material={mats.pintura} visible={vis[`ani${i}`]} receiveShadow={false} />)}
      {pz.ceja.map((tb, i) => <mesh key={`c${i}`} geometry={tb.geo} material={mats.pintura} visible={vis[`ceja${i}`]} receiveShadow={false} />)}
      {pz.pupila.map((r, i) => <mesh key={`p${i}`} geometry={r.geo} material={mats.pupila} visible={vis[`pup${i}`]} receiveShadow={false} />)}
      {pz.cor.map((r, i) => <mesh key={`h${i}`} geometry={r.geo} material={mats.corazon} visible={vis[`cor${i}`]} receiveShadow={false} />)}
      {pz.rubor.map((r, i) => <mesh key={`r${i}`} geometry={r.geo} material={mats.rubor} visible={vis[`rub${i}`]} renderOrder={2} />)}
      {pz.lagrima.map((r, i) => <mesh key={`l${i}`} geometry={r.geo} material={mats.agua} visible={vis[`lag${i}`]} renderOrder={3} />)}
      {pz.chorro.map((tb, i) => <mesh key={`ch${i}`} geometry={tb.geo} material={mats.aguaTrazo} visible={vis[`cho${i}`]} renderOrder={3} />)}
      <mesh geometry={pz.boca.geo} material={mats.pintura} receiveShadow={false} />
      <mesh geometry={pz.bocaInt.geo} material={mats.bocaInt} visible={vis.bocaInt} receiveShadow={false} />
      <mesh geometry={pz.lengua.geo} material={mats.lengua} visible={vis.lengua} receiveShadow={false} />
      <mesh geometry={pz.dientes.geo} material={mats.dientes} visible={vis.dientes} receiveShadow={false} />
      <mesh geometry={pz.sudor.geo} material={mats.agua} visible={vis.sudor} renderOrder={3} />
      {pz.vena.map((tb, i) => <mesh key={`v${i}`} geometry={tb.geo} material={mats.vena} visible={vis.vena} />)}
      {pz.zzz.map((tb, i) => <mesh key={`z${i}`} geometry={tb.geo} material={mats.pintura} visible={vis.zzz} />)}
    </group>
  );
};
