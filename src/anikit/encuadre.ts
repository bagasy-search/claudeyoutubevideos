// ENCUADRE SEGURO: el protagonista SIEMPRE ocupa ≥35 % del alto del cuadro (regla del creador: los generales con el
// personaje chiquito más de 2 s matan la escena). Herramientas para las claves de cámara de `Escena`:
//   planoSeguro(f, prota, { frac: 0.5, lado: 0.5 })   → una clave que deja al prota a ese tamaño (lado: -1..1 = tercio)
//   generalCorto(f0, { x, y, zoom }, prota)           → general ≤2 s que entra SOLO a plano medio (3 claves)
//   seguirSeguro(f0, f1, prota)                        → claves que acompañan al prota mientras camina, sin achicarlo
//   asegurarEncuadre(claves, prota)                    → corrige claves viejas: todo general que dura >2 s se corta a medio
//   revisarEncuadre(claves, prota, dur)                → avisa en consola los tramos <35 % de más de 2 s (para el QC)
// `prota` = { look, escala, ruta } (la misma ruta del Actor) o { look, escala, x, piso } si está quieto.
import { Clave, mira, poseEn } from "./camara";
import { Paso, posRuta } from "./actor";
import { huesosDe, Look } from "./personaje";

export const ENCUADRE_MIN = 0.35;
export type Prota = { look: Look; escala?: number; ruta?: Paso[]; x?: number; piso?: number };

// alto del personaje parado, de los pies a la coronilla, en px del mundo (con sombrero/pelo en punta suma un poco)
export const altoPersonaje = (look: Look, escala = 1) => {
  const H = huesosDe(look.estilo, look.alto);
  const tocado = (look.accesorios ?? []).some((a) => a.t === "sombrero" || a.t === "gorroPapel" || (a.t === "pelo" && a.forma === "punta")) ? 0.4 : 0;
  return (H.muslo + H.pierna + H.torso + H.cuello + (2 + tocado) * H.cabezaR) * escala;
};
const posProta = (p: Prota, f: number) => (p.ruta ? posRuta(p.ruta, f) : { x: p.x ?? 960, y: p.piso ?? 900 });

export type OpcEncuadre = { frac?: number; lado?: number; extra?: Partial<Clave> };
// clave con el prota a `frac` del alto (mín 0,35; 0,5 = plano medio-largo, 0,8 = medio), pies con aire abajo
export const planoSeguro = (f: number, prota: Prota, o: OpcEncuadre = {}): Clave => {
  const alto = altoPersonaje(prota.look, prota.escala);
  const fr = Math.max(ENCUADRE_MIN, o.frac ?? 0.5);
  const zoom = (fr * 1080) / alto;
  const pos = posProta(prota, f);
  // centro del personaje un poco por debajo del centro del cuadro (aire arriba de la cabeza para globos/HUD)
  const Y = pos.y - alto / 2 - 30 / zoom;
  const X = pos.x - ((o.lado ?? 0) * 320) / zoom;
  return mira(f, X, Y, zoom, o.extra);
};

// general CORTO: se sostiene `sostener` cuadros (≤1,3 s) y entra a plano seguro antes de los 2 s
export const generalCorto = (f0: number, general: { x: number; y: number; zoom: number }, prota: Prota, o: OpcEncuadre & { sostener?: number; llegar?: number } = {}): Clave[] => {
  // el empuje dura ~1,5 s: más corto, el desenfoque de movimiento de la cámara (Plano) se nota en cada cuadro del medio
  const llegar = Math.min(60, o.llegar ?? 60);
  const sost = Math.min(o.sostener ?? 14, llegar - 30);
  return [
    mira(f0, general.x, general.y, general.zoom),
    mira(f0 + sost, general.x, general.y, general.zoom * 1.03, { curva: "inout" }),
    planoSeguro(f0 + llegar, prota, { ...o, extra: { curva: "inout", ...o.extra } }),
  ];
};

// acompaña al prota que camina: una clave cada `paso` cuadros, encadenadas con spline fluida (sin frenar en cada una)
export const seguirSeguro = (f0: number, f1: number, prota: Prota, o: OpcEncuadre & { paso?: number } = {}): Clave[] => {
  const paso = o.paso ?? 30;
  const out: Clave[] = [];
  for (let f = f0; f < f1; f += paso) out.push(planoSeguro(f, prota, { ...o, extra: { curva: "fluida", ...o.extra } }));
  out.push(planoSeguro(f1, prota, { ...o, extra: { curva: "fluida", ...o.extra } }));
  return out;
};

export const fraccionEn = (claves: Clave[], f: number, prota: Prota) => (poseEn(claves, f, 30).zoom * altoPersonaje(prota.look, prota.escala)) / 1080;

// claves existentes → toda clave que deja al prota <35 % y dura más de 2 s se convierte en general corto
export const asegurarEncuadre = (claves: Clave[], prota: Prota, min = ENCUADRE_MIN): Clave[] => {
  const alto = altoPersonaje(prota.look, prota.escala);
  return claves.flatMap((c, i) => {
    const sig = claves[i + 1]?.f ?? Infinity;
    if ((c.zoom * alto) / 1080 >= min || sig - c.f <= 60) return [c];
    return [c, planoSeguro(c.f + 56, prota, { frac: Math.max(min + 0.1, 0.5), extra: { curva: "inout" } })];
  });
};

// QC: tramos (en cuadros) de más de 2 s con el prota por debajo del mínimo; también los escribe en la consola
export const revisarEncuadre = (claves: Clave[], prota: Prota, dur: number, nombre = "escena", min = ENCUADRE_MIN) => {
  const tramos: [number, number][] = [];
  let ini = -1;
  for (let f = 0; f <= dur; f += 2) {
    const bajo = fraccionEn(claves, f, prota) < min;
    if (bajo && ini < 0) ini = f;
    if ((!bajo || f + 2 > dur) && ini >= 0) { if (f - ini > 60) tramos.push([ini, f]); ini = -1; }
  }
  if (tramos.length) console.warn(`[encuadre] ${nombre}: protagonista <${Math.round(min * 100)} % del alto en ${tramos.map(([a, b]) => `${a}-${b}`).join(", ")}`);
  return tramos;
};
