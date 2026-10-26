import { camara, Llave, Act, Ev } from "./motor";
import { CARTELES, cartelPantalla, SUELO } from "./mundo";

// Acomodador de rótulos (OJO director vuelta 1): ningún rótulo debajo de la factura, del camino de trampas,
// de otro rótulo vivo ni encima de una cara. Corre una vez al cargar: mueve x/y (y achica si no entra).
type Caja = { x0: number; y0: number; x1: number; y1: number };
const largo = (s: string) => [...s].length;
// caja en pantalla según el tipo (mismas medidas que dibujan Chip / Grande / Sello / Cuenta / Globo / IcoEv)
const caja = (e: Ev, x: number, y: number, s: number): Caja | null => {
  const n = largo(e.txt ?? "");
  switch (e.k) {
    case "chip": {
      const w = n * (0.66 * s + 1) + 0.84 * s, h = 1.47 * s;
      const cen = e.x === undefined || e.hx === 1;
      return { x0: cen ? x - w / 2 : x, x1: cen ? x + w / 2 : x + w, y0: y - h / 2, y1: y + h / 2 };
    }
    case "grande": { const w = n * (0.72 * s + 2) + 0.2 * s, h = 1.3 * s; return { x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 }; }
    case "sello": { const w = n * (0.7 * s + 4) + 60 + 0.18 * s, h = 1.33 * s; return { x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 }; }
    case "cuenta": {
      const m = largo((e.pre ?? "") + Math.round(e.a ?? 0).toLocaleString("en-US") + (e.suf ?? ""));
      const w = m * 0.6 * s + 0.16 * s, h = 1.15 * s;
      return { x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 };
    }
    case "globo": {
      const ic = e.icos?.length ?? 0;
      const w = n * 0.6 * s + 68 + ic * (2.2 * s + 18), h = Math.max(1.2 * s, ic ? 2.2 * s : 0) + 36;
      return { x0: x - w / 2, x1: x + w / 2, y0: y - h - 34, y1: y };
    }
    case "ico": {
      // s = escala de pantalla del ícono; la etiqueta (tag) mide su letra en pantalla en e.ts (o 40·max(.8,s))
      const S = 200 * s, f = (e.ts ?? 40 * Math.max(0.8, e.s ?? 1)) * (s / (e.s ?? 1));
      const tw = e.tag ? largo(e.tag) * 0.62 * f + 36 : 0, w = Math.max(S, tw);
      return { x0: x - w / 2, x1: x + w / 2, y0: y - S / 2, y1: y + S / 2 + (e.tag ? 0.42 * S + f * 1.3 : 0) };
    }
    default: return null;
  }
};
const choca = (a: Caja, b: Caja, m = 14) => Math.max(0, Math.min(a.x1, b.x1) + m - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) + m - Math.max(a.y0, b.y0));
const DUR: Partial<Record<Ev["k"], number>> = { chip: 2.6, grande: 2.4, ico: 2.6, sello: 2.2, cuenta: 2.8, globo: 2.6 };

export const acomodar = (O: Ev[], W: Ev[], K: Llave[], A: Act[], factura: [number, number][], camino: number) => {
  const vivos: { a: number; b: number; c: Caja }[] = [];
  // caras (cabeza + hombros) de los actores parados, en pantalla, en el instante tt
  const caras = (tt: number): Caja[] => {
    const c = camara(K, tt);
    const r: Caja[] = [];
    for (const p of A) {
      if (tt < p.a || tt >= p.b) continue;
      const echado = p.rot !== undefined && p.rot !== 0;
      const x = typeof p.x === "number" ? p.x : p.tw && tt >= p.tw[1] ? p.x[1] : p.tw && tt > p.tw[0] ? p.x[0] + (p.x[1] - p.x[0]) * (tt - p.tw[0]) / (p.tw[1] - p.tw[0]) : p.x[0];
      const y = typeof p.y === "number" ? p.y : p.y[0];
      const S = (p.h ?? 420) / 560;
      const q = echado
        ? { x0: 960 + (x - 620 * S - c.x) * c.z, x1: 960 + (x + 620 * S - c.x) * c.z, y0: 540 + (y - 260 * S - c.y) * c.z, y1: 540 + (y + 180 * S - c.y) * c.z }
        : { x0: 960 + (x - 160 * S - c.x) * c.z, x1: 960 + (x + 160 * S - c.x) * c.z, y0: 540 + (y - 780 * S - c.y) * c.z, y1: 540 + (y - c.y) * c.z }; // cuerpo entero + sombrero/mitra/corona (OJO v2)
      if (q.y1 - q.y0 < 70 || q.x1 < 0 || q.x0 > 1920 || q.y1 < 0 || q.y0 > 1080) continue;
      r.push(q);
    }
    return r;
  };
  const fijos = (a: number, b: number): Caja[] => {
    const r: Caja[] = [];
    if (factura.some(([fa, fb]) => a < fb && b > fa)) r.push({ x0: 1500, y0: 0, x1: 1920, y1: 250 });
    if (b > camino) r.push({ x0: 0, y0: 980, x1: 900, y1: 1080 });
    // tablero de precios de la oficina (mundo)
    for (const tt of [a + 0.3, (a + b) / 2, b]) { const c = camara(K, tt); r.push({ x0: 960 + (2090 - c.x) * c.z, x1: 960 + (2420 - c.x) * c.z, y0: 540 + (SUELO - 700 - c.y) * c.z, y1: 540 + (SUELO - 180 - c.y) * c.z }); }
    // carteles de los edificios (capa de arriba de los actores)
    for (const tt of [a + 0.3, (a + b) / 2, b]) for (const k of CARTELES) { const p = cartelPantalla(k, camara(K, tt)); if (p) r.push(p); }
    return r;
  };
  const cands: [number, number][] = [];
  for (let dx = -1300; dx <= 1300; dx += 65) for (let dy = -900; dy <= 900; dy += 45) cands.push([dx, dy]);
  cands.sort((p, q) => Math.hypot(p[0] * 1.25, p[1]) - Math.hypot(q[0] * 1.25, q[1]));
  const todos = [...O.map((e) => ({ e, mundo: false })), ...W.filter((e) => e.k === "chip" || (e.k === "ico" && e.tag && e.anim !== "vuela")).map((e) => ({ e, mundo: true }))].sort((p, q) => p.e.t - q.e.t);
  for (const { e, mundo } of todos) {
    if (!(e.k in DUR) || e.fijo) continue; // fijo = posición elegida a mano mirando el still
    const a = e.t, b = e.t1 ?? e.t + (DUR[e.k] ?? 2.5);
    const def = e.k === "chip" ? 62 : e.k === "grande" ? 150 : e.k === "sello" ? 110 : e.k === "cuenta" ? 200 : e.k === "globo" ? 54 : 1;
    let s = e.s ?? def;
    // en mundo se trabaja en pantalla con la cámara del medio del rótulo
    const cm = camara(K, Math.min(b, a + 0.8));
    // el zoom más chico mientras está vivo: con ése se asegura la letra mínima
    const zmin = mundo ? Math.min(...[a + 0.3, (a + b) / 2, b - 0.1].map((tt) => camara(K, tt).z), cm.z) : 1;
    if (mundo && e.k === "ico" && e.tag) e.ts = Math.max(40 * Math.max(0.8, e.s ?? 1), 44 / zmin);
    const cen0 = e.k === "chip" && e.x === undefined;
    let x = mundo ? 960 + ((e.x ?? 0) - cm.x) * cm.z : e.x ?? 960;
    let y = mundo ? 540 + ((e.y ?? 0) - cm.y) * cm.z : e.y ?? (e.k === "chip" ? 140 : e.k === "globo" ? 300 : 540);
    const sm = mundo ? s * cm.z : s; // tamaño en pantalla
    // letra mínima legible en pantalla (OJO: «microtexto ilegible»)
    let ss = e.k === "chip" ? Math.max(sm, mundo ? 44 * cm.z / zmin : 44) : sm;
    let q = caja({ ...e, hx: cen0 ? 1 : e.hx }, x, y, ss)!;
    if (!q) continue;
    // más ancho que la pantalla útil → se achica
    const ancho = q.x1 - q.x0;
    if (ancho > 1700) { ss *= 1700 / ancho; q = caja({ ...e, hx: cen0 ? 1 : e.hx }, x, y, ss)!; }
    const obst = [...fijos(a, b), ...vivos.filter((v) => v.a < b + 0.3 && v.b + 0.3 > a).map((v) => v.c)];
    // las caras sólo cuentan para rótulos de pantalla y chips (los globos y emotes apuntan a la cara a propósito)
    if (e.k !== "globo") for (const tt of [a + 0.3, (a + b) / 2, b]) obst.push(...caras(tt));
    let mejor: [number, number] = [0, 0], peor = Infinity;
    // en mundo la cámara se mueve mientras el rótulo vive: también tiene que quedar dentro del cuadro en esos instantes
    const otras = mundo ? [a + 0.3, (a + b) / 2, b - 0.1].map((tt) => camara(K, tt)) : [];
    const area = (c: Caja) => (c.x1 - c.x0) * (c.y1 - c.y0) - choca(c, { x0: 96, y0: 54, x1: 1824, y1: 1026 }, 0);
    for (const [dx, dy] of cands) {
      const c = { x0: q.x0 + dx, x1: q.x1 + dx, y0: q.y0 + dy, y1: q.y1 + dy };
      if (c.x0 < 96 || c.x1 > 1824 || c.y0 < 54 || c.y1 > 1026) continue; // margen seguro 5 %
      let col = 0;
      for (const k of otras) {
        const m = (v: number, o: number, kc: number, cc: number) => o + ((v - o) / cm.z + cc - kc) * k.z;
        col += 3 * area({ x0: m(c.x0, 960, k.x, cm.x), x1: m(c.x1, 960, k.x, cm.x), y0: m(c.y0, 540, k.y, cm.y), y1: m(c.y1, 540, k.y, cm.y) });
      }
      for (const o of obst) col += choca(c, o);
      if (col < peor) { peor = col; mejor = [dx, dy]; if (col === 0) break; }
    }
    if (peor === Infinity) mejor = [Math.max(96 - q.x0, Math.min(0, 1824 - q.x1)), Math.max(54 - q.y0, Math.min(0, 1026 - q.y1))];
    x += mejor[0]; y += mejor[1];
    vivos.push({ a, b, c: { x0: q.x0 + mejor[0], x1: q.x1 + mejor[0], y0: q.y0 + mejor[1], y1: q.y1 + mejor[1] } });
    if (mundo) { e.x = cm.x + (x - 960) / cm.z; e.y = cm.y + (y - 540) / cm.z; if (e.k === "chip") e.s = ss / cm.z; }
    else { e.x = x; e.y = y; e.s = ss; if (cen0) e.hx = 1; }
  }
};
