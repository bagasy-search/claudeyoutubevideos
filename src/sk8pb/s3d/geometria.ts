// Geometría por código: tubos de goma con tapas redondas (miembros, torso, trazos de la cara) y rellenos
// proyectados sobre la esfera de la cabeza. Todas las geometrías tienen CANTIDAD FIJA de vértices y se
// actualizan en el lugar cada cuadro (nada de crear/romper buffers ni cambiar shaders entre cuadros).
import * as THREE from "three";

export type V3 = [number, number, number];
export const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

// ---------- curvas ----------
// remuestrea una polilínea a n puntos equidistantes por largo de arco
export const remuestrear = (pts: THREE.Vector3[], n: number): THREE.Vector3[] => {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const L = acc[acc.length - 1] || 1e-6;
  const out: THREE.Vector3[] = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const s = (k / (n - 1)) * L;
    while (j < acc.length - 2 && acc[j + 1] < s) j++;
    const seg = acc[j + 1] - acc[j] || 1e-6;
    const t = Math.min(1, Math.max(0, (s - acc[j]) / seg));
    out.push(pts[j].clone().lerp(pts[j + 1], t));
  }
  return out;
};

// línea raíz → articulación → punta con la esquina redondeada como goma (sin bolita) y un arqueo opcional
export const curvaGoma = (
  a: THREE.Vector3, j: THREE.Vector3, b: THREE.Vector3,
  redondeo: number, // 0..0.5: fracción de cada hueso que se come la curva del codo/rodilla
  arqueo: number, // arqueo de todo el miembro (rubber hose), en unidades, hacia `lado`
  lado: THREE.Vector3,
  n = 40,
): THREE.Vector3[] => {
  const f = Math.max(0.02, Math.min(0.5, redondeo));
  const q1 = j.clone().lerp(a, f), q2 = j.clone().lerp(b, f);
  const pts: THREE.Vector3[] = [];
  const M = 24;
  pts.push(a.clone());
  for (let i = 0; i <= M; i++) {
    const t = i / M, u = 1 - t;
    pts.push(new THREE.Vector3(
      u * u * q1.x + 2 * u * t * j.x + t * t * q2.x,
      u * u * q1.y + 2 * u * t * j.y + t * t * q2.y,
      u * u * q1.z + 2 * u * t * j.z + t * t * q2.z,
    ));
  }
  pts.push(b.clone());
  const out = remuestrear(pts, n);
  if (Math.abs(arqueo) > 1e-5) {
    out.forEach((p, i) => { const s = i / (n - 1); p.addScaledVector(lado, arqueo * Math.sin(Math.PI * s)); });
  }
  return out;
};

// ---------- tubo con tapas ----------
export type Tubo = { geo: THREE.BufferGeometry; n: number; radial: number; tapa: number };

export const crearTubo = (n: number, radial = 32, tapa = 10): Tubo => {
  const anillos = n + 2 * tapa; // anillos del cuerpo + anillos de las dos tapas (sin polos)
  const nv = anillos * (radial + 1) + 2;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
  const idx: number[] = [];
  const R = radial + 1;
  for (let a = 0; a < anillos - 1; a++) for (let r = 0; r < radial; r++) {
    const i0 = a * R + r, i1 = i0 + 1, i2 = i0 + R, i3 = i2 + 1;
    idx.push(i0, i1, i2, i1, i3, i2);
  }
  const p0 = anillos * R, p1 = p0 + 1; // polos
  for (let r = 0; r < radial; r++) {
    idx.push(p0, r + 1, r);
    const b = (anillos - 1) * R;
    idx.push(p1, b + r, b + r + 1);
  }
  geo.setIndex(idx);
  return { geo, n, radial, tapa };
};

const _t = new THREE.Vector3(), _nrm = new THREE.Vector3(), _bin = new THREE.Vector3(), _tmp = new THREE.Vector3();

// rellena el tubo siguiendo `pts` (exactamente tubo.n puntos). radio puede variar por punto.
export const actualizarTubo = (tubo: Tubo, pts: THREE.Vector3[], radio: number | ((s: number) => number)) => {
  const { geo, n, radial, tapa } = tubo;
  const pos = geo.attributes.position.array as Float32Array, nor = geo.attributes.normal.array as Float32Array;
  const rad = (i: number) => (typeof radio === "number" ? radio : radio(i / (n - 1)));
  // tangentes
  const T: THREE.Vector3[] = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const t = b.clone().sub(a);
    return t.lengthSq() < 1e-12 ? new THREE.Vector3(0, 1, 0) : t.normalize();
  });
  // marco por transporte paralelo (sin torsiones raras)
  const N: THREE.Vector3[] = [], B: THREE.Vector3[] = [];
  const ref = Math.abs(T[0].y) < 0.9 ? v3(0, 1, 0) : v3(1, 0, 0);
  N[0] = ref.clone().sub(T[0].clone().multiplyScalar(ref.dot(T[0]))).normalize();
  B[0] = T[0].clone().cross(N[0]);
  for (let i = 1; i < n; i++) {
    const axis = _tmp.copy(T[i - 1]).cross(T[i]);
    const nn = N[i - 1].clone();
    const l = axis.length();
    if (l > 1e-8) nn.applyAxisAngle(axis.divideScalar(l), Math.atan2(l, T[i - 1].dot(T[i])));
    N[i] = nn.sub(T[i].clone().multiplyScalar(nn.dot(T[i]))).normalize();
    B[i] = T[i].clone().cross(N[i]);
  }
  const R = radial + 1;
  let vi = 0;
  const anillo = (c: THREE.Vector3, Ni: THREE.Vector3, Bi: THREE.Vector3, Ti: THREE.Vector3, r: number, cosf: number, sinf: number, signo: number) => {
    for (let k = 0; k <= radial; k++) {
      const th = (k / radial) * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th);
      _nrm.copy(Ni).multiplyScalar(cs).addScaledVector(Bi, sn);
      const px = c.x + _nrm.x * r * cosf + Ti.x * r * sinf * signo;
      const py = c.y + _nrm.y * r * cosf + Ti.y * r * sinf * signo;
      const pz = c.z + _nrm.z * r * cosf + Ti.z * r * sinf * signo;
      _bin.copy(_nrm).multiplyScalar(cosf).addScaledVector(Ti, sinf * signo);
      pos[vi * 3] = px; pos[vi * 3 + 1] = py; pos[vi * 3 + 2] = pz;
      nor[vi * 3] = _bin.x; nor[vi * 3 + 1] = _bin.y; nor[vi * 3 + 2] = _bin.z;
      vi++;
    }
  };
  // tapa inicial (de casi-polo hacia el ecuador)
  for (let a = tapa; a >= 1; a--) { const f = (a / (tapa + 1)) * Math.PI / 2; anillo(pts[0], N[0], B[0], T[0], rad(0), Math.cos(f), Math.sin(f), -1); }
  for (let i = 0; i < n; i++) anillo(pts[i], N[i], B[i], T[i], rad(i), 1, 0, 1);
  for (let a = 1; a <= tapa; a++) { const f = (a / (tapa + 1)) * Math.PI / 2; anillo(pts[n - 1], N[n - 1], B[n - 1], T[n - 1], rad(n - 1), Math.cos(f), Math.sin(f), 1); }
  // polos
  const p0 = pts[0].clone().addScaledVector(T[0], -rad(0)), p1 = pts[n - 1].clone().addScaledVector(T[n - 1], rad(n - 1));
  pos.set([p0.x, p0.y, p0.z, p1.x, p1.y, p1.z], vi * 3);
  nor.set([-T[0].x, -T[0].y, -T[0].z, T[n - 1].x, T[n - 1].y, T[n - 1].z], vi * 3);
  geo.attributes.position.needsUpdate = true;
  geo.attributes.normal.needsUpdate = true;
  geo.computeBoundingSphere();
  void R;
};

// ---------- cara: del plano de la cara (u,v) a la esfera de la cabeza ----------
// (u,v) en unidades de cabeza, origen en el centro de la cara mirando +z. Proyección ortográfica sobre la esfera.
export const aEsfera = (u: number, v: number, R: number, alto = 0) => {
  const r2 = u * u + v * v, lim = R * R * 0.985;
  let uu = u, vv = v;
  if (r2 > lim) { const k = Math.sqrt(lim / r2); uu *= k; vv *= k; }
  const z = Math.sqrt(Math.max(0, R * R - uu * uu - vv * vv));
  const p = new THREE.Vector3(uu, vv, z);
  if (alto) p.addScaledVector(p.clone().normalize(), alto);
  return p;
};

// relleno en abanico de un contorno 2D (estrella respecto a su centro) apoyado sobre la esfera
export type Relleno = { geo: THREE.BufferGeometry; m: number; anillos: number };
export const crearRelleno = (m = 64, anillos = 6): Relleno => {
  const nv = 1 + m * anillos;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(nv * 4), 4));
  const idx: number[] = [];
  for (let k = 0; k < m; k++) idx.push(0, 1 + k, 1 + ((k + 1) % m));
  for (let a = 0; a < anillos - 1; a++) for (let k = 0; k < m; k++) {
    const i0 = 1 + a * m + k, i1 = 1 + a * m + ((k + 1) % m), i2 = i0 + m, i3 = i1 + m;
    idx.push(i0, i2, i1, i1, i2, i3);
  }
  geo.setIndex(idx);
  return { geo, m, anillos };
};

// contorno: m puntos 2D en orden; centro: punto interior. borde: 0 = opaco parejo, >0 = se desvanece hacia afuera
export const actualizarRelleno = (rel: Relleno, contorno: [number, number][], centro: [number, number], R: number, alto: number, borde = 0) => {
  const { geo, m, anillos } = rel;
  const pos = geo.attributes.position.array as Float32Array, nor = geo.attributes.normal.array as Float32Array, col = geo.attributes.color.array as Float32Array;
  const put = (i: number, u: number, v: number, a: number) => {
    const p = aEsfera(u, v, R, alto), q = p.clone().normalize();
    pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
    nor[i * 3] = q.x; nor[i * 3 + 1] = q.y; nor[i * 3 + 2] = q.z;
    col[i * 4] = 1; col[i * 4 + 1] = 1; col[i * 4 + 2] = 1; col[i * 4 + 3] = a;
  };
  put(0, centro[0], centro[1], 1);
  for (let a = 0; a < anillos; a++) {
    const f = (a + 1) / anillos;
    const alpha = borde > 0 ? Math.max(0, Math.min(1, (1 - f) / borde + (f < 1 - borde ? 1 : 0))) : 1;
    const al = borde > 0 ? Math.pow(Math.max(0, 1 - Math.pow(f, 2.2)), 0.8) : alpha;
    for (let k = 0; k < m; k++) {
      const c = contorno[k % contorno.length];
      put(1 + a * m + k, centro[0] + (c[0] - centro[0]) * f, centro[1] + (c[1] - centro[1]) * f, al);
    }
  }
  geo.attributes.position.needsUpdate = true;
  geo.attributes.normal.needsUpdate = true;
  geo.attributes.color.needsUpdate = true;
  geo.computeBoundingSphere();
};

// polilínea 2D de la cara → puntos 3D sobre la esfera, remuestreados a n
export const trazoEnEsfera = (pts2: [number, number][], n: number, R: number, alto: number) => {
  const p3 = pts2.map(([u, v]) => aEsfera(u, v, R, alto));
  return remuestrear(p3, n);
};
