// Tiburón de arcilla gris, 100 % por código: cuerpo por secciones (superelipse) con boca partida en hocico +
// mandíbula articulada (paladar, lengua y dientes), aletas extruidas con bisel, ojos, branquias.
// La deformación (mandíbula + ondulación de nado) se hace en CPU por cuadro: así la sombra y el AO del post
// ven la misma forma que el render (en shader no la verían).
import React, { useMemo } from "react";
import * as THREE from "three";

const L = 2.6, X0 = -L / 2;
const UH = 0.8; // bisagra de la boca (fracción del largo)
const TH = 0.36; // la comisura queda 0,36 rad por debajo del ecuador
const NE = 2.3; // exponente de la sección

const TU = [0, 0.04, 0.12, 0.25, 0.4, 0.55, 0.68, 0.78, 0.86, 0.9];
const TH_ = [0.05, 0.055, 0.09, 0.17, 0.26, 0.31, 0.31, 0.28, 0.23, 0.195];
const TW = [0.035, 0.04, 0.07, 0.14, 0.22, 0.27, 0.27, 0.25, 0.2, 0.17];
const TC = [0, 0, 0, 0, 0, 0, 0.01, 0.02, 0.035, 0.045];
const tabla = (T: number[], u: number) => {
  if (u >= 0.9) return T[T.length - 1];
  let i = 0; while (i < TU.length - 2 && TU[i + 1] < u) i++;
  const k = (u - TU[i]) / (TU[i + 1] - TU[i]); const s = k * k * (3 - 2 * k);
  return T[i] + (T[i + 1] - T[i]) * (0.35 * k + 0.65 * s);
};
const nariz = (u: number) => (u <= 0.9 ? 1 : Math.sqrt(Math.max(0, 1 - ((u - 0.9) / 0.1) ** 2)));
const sp = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);

export const puntoCuerpo = (u: number, th: number, out = new THREE.Vector3()) => {
  const f = nariz(u);
  const h = tabla(TH_, u) * f, w = tabla(TW, u) * f, c = tabla(TC, u) + (u > 0.9 ? 0.02 * (u - 0.9) / 0.1 : 0);
  const s = Math.sin(th), co = Math.cos(th);
  const y = c + h * sp(s, 2 / NE) * (s < 0 ? 0.82 : 1);
  return out.set(X0 + L * u, y, w * sp(co, 2 / NE));
};

type Parche = { geo: THREE.BufferGeometry; base: Float32Array; nbase: Float32Array; jaw: Float32Array };
const cerrar = (geo: THREE.BufferGeometry, jaw: (i: number) => number): Parche => {
  const p = geo.attributes.position.array as Float32Array, n = geo.attributes.normal.array as Float32Array;
  const j = new Float32Array(p.length / 3);
  for (let i = 0; i < j.length; i++) j[i] = jaw(i);
  return { geo, base: p.slice(), nbase: n.slice(), jaw: j };
};

// superficie paramétrica (u, θ) con normales analíticas
const parche = (u0: number, u1: number, nu: number, t0: number, t1: number, nt: number, jawW: (u: number) => number, invertir = false): Parche => {
  const pos: number[] = [], nor: number[] = [], jw: number[] = [], idx: number[] = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), du = new THREE.Vector3(), dt = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i <= nu; i++) {
    const s = i / nu, u = u0 + (u1 - u0) * (1 - Math.cos(s * Math.PI * 0.5) ** 1 * 0 - 0) * 1;
    const uu = u0 + (u1 - u0) * s;
    void u;
    for (let k = 0; k <= nt; k++) {
      const th = t0 + (t1 - t0) * (k / nt);
      puntoCuerpo(uu, th, a);
      puntoCuerpo(Math.min(1, uu + 1e-3), th, b); puntoCuerpo(Math.max(0, uu - 1e-3), th, c); du.subVectors(b, c);
      puntoCuerpo(uu, th + 1e-3, b); puntoCuerpo(uu, th - 1e-3, c); dt.subVectors(b, c);
      n.crossVectors(du, dt);
      if (n.lengthSq() < 1e-14) n.set(uu > 0.5 ? 1 : -1, 0, 0); else n.normalize();
      pos.push(a.x, a.y, a.z); nor.push(n.x, n.y, n.z); jw.push(jawW(uu));
    }
  }
  const R = nt + 1;
  for (let i = 0; i < nu; i++) for (let k = 0; k < nt; k++) {
    const i0 = i * R + k, i1 = i0 + 1, i2 = i0 + R, i3 = i2 + 1;
    if (invertir) idx.push(i0, i1, i2, i1, i3, i2); else idx.push(i0, i2, i1, i1, i2, i3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return cerrar(g, (i) => jw[i]);
};

// tira interior (paladar o lengua) entre los dos bordes de la boca, arqueada hacia adentro
const tiraBoca = (thA: number, thB: number, arco: number, jawW: (u: number) => number, haciaAbajo: boolean): Parche => {
  const nu = 40, nk = 10, pos: number[] = [], nor: number[] = [], jw: number[] = [], idx: number[] = [];
  const A = new THREE.Vector3(), B = new THREE.Vector3();
  for (let i = 0; i <= nu; i++) {
    const u = UH + (0.995 - UH) * (i / nu);
    puntoCuerpo(u, thA, A); puntoCuerpo(u, thB, B);
    const h = tabla(TH_, u) * nariz(u);
    for (let k = 0; k <= nk; k++) {
      const s = k / nk;
      const y = A.y + (B.y - A.y) * s + arco * h * Math.sin(Math.PI * s);
      pos.push(A.x, y, A.z + (B.z - A.z) * s);
      nor.push(0, haciaAbajo ? -1 : 1, 0); jw.push(jawW(u));
    }
  }
  const R = nk + 1;
  for (let i = 0; i < nu; i++) for (let k = 0; k < nk; k++) {
    const i0 = i * R + k, i1 = i0 + 1, i2 = i0 + R, i3 = i2 + 1;
    if (haciaAbajo) idx.push(i0, i1, i2, i1, i3, i2); else idx.push(i0, i2, i1, i1, i2, i3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return cerrar(g, (i) => jw[i]);
};

const aleta = (pts: [number, number][], grosor: number, bisel: number) => {
  const s = new THREE.Shape();
  s.moveTo(...pts[0]);
  for (let i = 1; i + 1 < pts.length; i += 2) s.quadraticCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  const g = new THREE.ExtrudeGeometry(s, { depth: grosor, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 4, curveSegments: 24 });
  g.translate(0, 0, -grosor / 2);
  g.deleteAttribute("uv");
  return g.toNonIndexed();
};
const espejarZ = (g: THREE.BufferGeometry) => {
  const c = g.clone(); c.scale(1, 1, -1);
  const p = c.attributes.position.array as Float32Array, n = c.attributes.normal.array as Float32Array;
  for (let i = 0; i < p.length; i += 9) for (let k = 0; k < 3; k++) { const a = p[i + 3 + k]; p[i + 3 + k] = p[i + 6 + k]; p[i + 6 + k] = a; const b = n[i + 3 + k]; n[i + 3 + k] = n[i + 6 + k]; n[i + 6 + k] = b; }
  return c;
};
const unir = (gs: THREE.BufferGeometry[]) => {
  let total = 0; gs.forEach((g) => (total += g.attributes.position.count));
  const p = new Float32Array(total * 3), n = new Float32Array(total * 3);
  let o = 0;
  gs.forEach((g) => { p.set(g.attributes.position.array as Float32Array, o * 3); n.set(g.attributes.normal.array as Float32Array, o * 3); o += g.attributes.position.count; });
  const r = new THREE.BufferGeometry();
  r.setAttribute("position", new THREE.BufferAttribute(p, 3)); r.setAttribute("normal", new THREE.BufferAttribute(n, 3));
  return r;
};

const jawDe = (u: number) => THREE.MathUtils.smoothstep(u, UH, UH + 0.07);

const construir = () => {
  const cuerpo = parche(0, UH, 110, 0, Math.PI * 2, 72, () => 0);
  const hocico = parche(UH, 1, 40, -TH, Math.PI + TH, 52, () => 0);
  const mandibula = parche(UH, 1, 40, Math.PI + TH, Math.PI * 2 - TH, 24, jawDe);
  const paladar = tiraBoca(-TH, Math.PI + TH, 0.55, () => 0, true);
  const lengua = tiraBoca(Math.PI * 2 - TH, Math.PI + TH, -0.4, jawDe, false);
  // dientes
  const dU: THREE.BufferGeometry[] = [], dL: THREE.BufferGeometry[] = [];
  const P = new THREE.Vector3();
  for (const lado of [1, -1]) {
    for (let u = UH + 0.035; u < 0.99; u += 0.0155) {
      const tam = 0.6 + 0.4 * Math.sin(((u - UH) / (1 - UH)) * Math.PI);
      puntoCuerpo(u, lado > 0 ? -TH : Math.PI + TH, P);
      const c = new THREE.ConeGeometry(0.019 * tam, 0.055 * tam, 10); c.deleteAttribute("uv");
      c.rotateX(Math.PI); c.rotateX(lado * 0.25); c.translate(P.x, P.y - 0.02 * tam, P.z * 0.93);
      dU.push(c.toNonIndexed());
      puntoCuerpo(u, lado > 0 ? Math.PI * 2 - TH : Math.PI + TH, P);
      const d = new THREE.ConeGeometry(0.017 * tam, 0.045 * tam, 10); d.deleteAttribute("uv");
      d.rotateX(-lado * 0.25); d.translate(P.x, P.y + 0.018 * tam, P.z * 0.93);
      dL.push(d.toNonIndexed());
    }
  }
  const dientesU = cerrar(unir(dU), () => 0);
  const dLg = unir(dL);
  const pL = dLg.attributes.position.array as Float32Array;
  const dientesL = cerrar(dLg, (i) => jawDe((pL[i * 3] - X0) / L));
  // aletas
  const dorsal = aleta([[0.3, -0.06], [0.05, 0.36], [-0.2, 0.64], [-0.15, 0.26], [-0.34, -0.06]], 0.045, 0.022);
  dorsal.translate(0.12, tabla(TH_, 0.56) * 0.86, 0);
  const dorsal2 = aleta([[0.07, -0.03], [0.0, 0.08], [-0.07, 0.13], [-0.06, 0.05], [-0.1, -0.03]], 0.025, 0.01);
  dorsal2.translate(X0 + L * 0.2, tabla(TH_, 0.2) * 0.85, 0);
  const anal = aleta([[0.07, 0.03], [0.0, -0.08], [-0.07, -0.12], [-0.06, -0.05], [-0.1, 0.03]], 0.025, 0.01);
  anal.translate(X0 + L * 0.17, -tabla(TH_, 0.17) * 0.75, 0);
  const cola = aleta([[0.14, 0.0], [-0.12, 0.24], [-0.44, 0.66], [-0.32, 0.26], [-0.24, 0.0], [-0.33, -0.18], [-0.38, -0.4], [-0.12, -0.2], [0.14, -0.04]], 0.04, 0.018);
  cola.translate(X0 + 0.08, 0.0, 0);
  const pect = aleta([[0.13, 0], [-0.04, 0.26], [-0.34, 0.58], [-0.2, 0.2], [-0.19, 0]], 0.035, 0.016);
  pect.rotateX(Math.PI / 2); pect.rotateX(0.55); pect.rotateY(-0.25);
  const pu = 0.63; puntoCuerpo(pu, -0.55, P);
  const pectD = pect.clone(); pectD.translate(P.x, P.y, P.z * 0.8);
  const pectI = espejarZ(pectD);
  const aletas = unir([dorsal, dorsal2, anal, cola, pectD, pectI]);
  // branquias: 4 surcos por lado
  const br: THREE.BufferGeometry[] = [];
  for (const lado of [1, -1]) for (let k = 0; k < 4; k++) {
    const u = 0.665 + k * 0.022, pts: THREE.Vector3[] = [];
    for (let j = 0; j <= 8; j++) { const th = -0.35 + 0.75 * (j / 8); const q = puntoCuerpo(u, lado > 0 ? th : Math.PI - th, new THREE.Vector3()); q.z *= 1.004; pts.push(q); }
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.0075, 6, false); g.deleteAttribute("uv");
    br.push(g.toNonIndexed());
  }
  const branquias = cerrar(unir(br), () => 0);
  // ojos
  const ojos: THREE.Vector3[] = [1, -1].map((lado) => { const q = puntoCuerpo(0.885, lado > 0 ? 0.28 : Math.PI - 0.28, new THREE.Vector3()); q.z *= 0.985; return q; });
  return { cuerpo, hocico, mandibula, paladar, lengua, dientesU, dientesL, aletas: cerrar(aletas, () => 0), branquias, ojos };
};

const HINGE = (() => { const p = puntoCuerpo(UH, -TH, new THREE.Vector3()); return new THREE.Vector2(p.x - 0.03, p.y + 0.02); })();

// aplica mandíbula + ondulación de nado a un parche
const deformar = (P: Parche, jaw: number, fase: number, amp: number) => {
  const p = P.geo.attributes.position.array as Float32Array, n = P.geo.attributes.normal.array as Float32Array;
  const b = P.base, nb = P.nbase;
  for (let i = 0; i < P.jaw.length; i++) {
    let x = b[i * 3], y = b[i * 3 + 1], z = b[i * 3 + 2];
    let nx = nb[i * 3], ny = nb[i * 3 + 1], nz = nb[i * 3 + 2];
    const w = P.jaw[i] * jaw;
    if (w > 1e-4) {
      const ca = Math.cos(-w), sa = Math.sin(-w), dx = x - HINGE.x, dy = y - HINGE.y;
      x = HINGE.x + ca * dx - sa * dy; y = HINGE.y + sa * dx + ca * dy;
      const mx = ca * nx - sa * ny; ny = sa * nx + ca * ny; nx = mx;
    }
    // ondulación: crece hacia la cola, la cabeza casi quieta
    const s = Math.min(1, Math.max(0, (0.9 - (x - X0) / L) / 0.9));
    const k = amp * Math.pow(s, 1.7);
    const f = k * Math.sin(x * 2.3 + fase);
    const df = k * 2.3 * Math.cos(x * 2.3 + fase);
    z += f; nx -= df * nz;
    const l = Math.hypot(nx, ny, nz) || 1;
    p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = z;
    n[i * 3] = nx / l; n[i * 3 + 1] = ny / l; n[i * 3 + 2] = nz / l;
  }
  P.geo.attributes.position.needsUpdate = true; P.geo.attributes.normal.needsUpdate = true;
  P.geo.computeBoundingSphere();
};

export type EstadoTiburon = { pos: [number, number, number]; rumbo: number; cabeceo: number; rolido: number; boca: number; fase: number; amp: number; escala?: number };

export const Tiburon: React.FC<{ e: EstadoTiburon; visible?: boolean }> = ({ e, visible = true }) => {
  const g = useMemo(() => construir(), []);
  const mats = useMemo(() => ({
    piel: new THREE.MeshPhysicalMaterial({ color: "#9aa0a6", roughness: 0.5, metalness: 0, sheen: 0.35, sheenColor: new THREE.Color("#dfe7ef"), sheenRoughness: 0.5, clearcoat: 0.18, clearcoatRoughness: 0.45 }),
    boca: new THREE.MeshPhysicalMaterial({ color: "#5b2a30", roughness: 0.55, side: THREE.DoubleSide }),
    diente: new THREE.MeshPhysicalMaterial({ color: "#f4f2ec", roughness: 0.3, clearcoat: 0.4 }),
    ojo: new THREE.MeshPhysicalMaterial({ color: "#0b0c0d", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
    surco: new THREE.MeshPhysicalMaterial({ color: "#5d6267", roughness: 0.6 }),
  }), []);
  const jaw = e.boca * 0.62;
  [g.cuerpo, g.hocico, g.mandibula, g.paladar, g.lengua, g.dientesU, g.dientesL, g.aletas, g.branquias].forEach((P) => deformar(P, jaw, e.fase, e.amp));
  const ojoPos = g.ojos.map((o) => {
    const s = Math.min(1, Math.max(0, (0.9 - (o.x - X0) / L) / 0.9));
    return [o.x, o.y, o.z + e.amp * Math.pow(s, 1.7) * Math.sin(o.x * 2.3 + e.fase)] as [number, number, number];
  });
  return (
    <group position={e.pos} rotation={[0, e.rumbo, 0]} visible={visible}>
      <group rotation={[e.rolido, 0, e.cabeceo]} scale={e.escala ?? 1}>
        <mesh geometry={g.cuerpo.geo} material={mats.piel} castShadow receiveShadow />
        <mesh geometry={g.hocico.geo} material={mats.piel} castShadow receiveShadow />
        <mesh geometry={g.mandibula.geo} material={mats.piel} castShadow receiveShadow />
        <mesh geometry={g.aletas.geo} material={mats.piel} castShadow receiveShadow />
        <mesh geometry={g.paladar.geo} material={mats.boca} receiveShadow />
        <mesh geometry={g.lengua.geo} material={mats.boca} receiveShadow />
        <mesh geometry={g.dientesU.geo} material={mats.diente} castShadow />
        <mesh geometry={g.dientesL.geo} material={mats.diente} castShadow />
        <mesh geometry={g.branquias.geo} material={mats.surco} />
        {ojoPos.map((p, i) => <mesh key={i} position={p} material={mats.ojo} scale={[0.034, 0.03, 0.03]}><sphereGeometry args={[1, 24, 16]} /></mesh>)}
      </group>
    </group>
  );
};

export const LARGO_TIBURON = L;
