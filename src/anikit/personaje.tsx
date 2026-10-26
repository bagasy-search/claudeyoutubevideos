// Personaje paramétrico con esqueleto (FK + IK de 2 huesos), al estilo Awaken / IFShift / Monk Mode.
// - Todo es SVG: se dibuja dentro del <svg> de una Capa, en coordenadas del mundo (pies en (x, y)).
// - Ángulos en grados: 0 = el hueso apunta hacia ABAJO; positivo = gira hacia ADELANTE (hacia donde mira).
//   rodilla positiva = la pantorrilla se dobla hacia atrás; codo positivo = el antebrazo se dobla hacia adelante.
// - La cadera se apoya sola: el punto más bajo (pie o rodilla) toca el piso → el rebote al caminar y el
//   arrodillarse salen gratis. Para sentarse se pasa `asiento` (altura de la cadera sobre el piso).
// - Estilos: "palo" (cabeza negra, miembros finos, camisa de color: Awaken/IFShift), "frijol" (cuerpo crema
//   con contorno: Monk Mode), "demonio" (negro con borde de neón), "zombi" (piel gris verdosa, ojos vacíos).
import React, { useId } from "react";
import { spring } from "remotion";

// ---------- pose ----------
export type Pose = {
  tronco: number; // inclinación del torso (+ adelante)
  cabeza: number; // inclinación de la cabeza respecto del torso
  hI: number; cI: number; // brazo de atrás: hombro, codo
  hD: number; cD: number; // brazo de adelante
  pI: number; rI: number; // pierna de atrás: cadera, rodilla
  pD: number; rD: number; // pierna de adelante
  bajar: number; // px extra que baja la cadera (agacharse sin doblar más)
};
export const POSE0: Pose = { tronco: 0, cabeza: 0, hI: -6, cI: 8, hD: 6, cD: 10, pI: -3, rI: 2, pD: 3, rD: 2, bajar: 0 };

export const POSES: Record<string, Partial<Pose>> = {
  parado: {},
  firme: { hI: -2, cI: 4, hD: 2, cD: 4, pI: -2, pD: 2, rI: 0, rD: 0 },
  manosCintura: { hI: -35, cI: -95, hD: 35, cD: 95 },
  brazosCruzados: { hI: 30, cI: 115, hD: 35, cD: 110, cabeza: -4 },
  pensar: { hD: 25, cD: 150, cabeza: 8, hI: -5, cI: 20 },
  señalar: { hD: 95, cD: 0, tronco: 3 },
  saludar: { hD: 160, cD: 30 },
  celebrar: { hI: 140, cI: 20, hD: 150, cD: 15, cabeza: -10, tronco: -6 },
  encogerse: { hI: 40, cI: 120, hD: 45, cD: 115, cabeza: 12, tronco: 10, rI: 10, rD: 10, bajar: 6 },
  manosCara: { hI: 40, cI: 140, hD: 45, cD: 140, cabeza: 6, tronco: 6 },
  agacharse: { tronco: 38, pI: 70, rI: 115, pD: 80, rD: 120, hD: 50, cD: 20, hI: 35, cI: 25, cabeza: -20 },
  arrodillado: { tronco: 4, pI: 0, rI: 90, pD: 90, rD: 90, hD: 20, cD: 40, hI: 10, cI: 30 },
  sentado: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 },
  sentadoSuelo: { tronco: -6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 30, hD: 40, cD: 70 },
  agarrarAlto: { hD: 135, cD: 15, tronco: -3, cabeza: -10 },
  empujar: { tronco: 22, hD: 85, cD: 10, hI: 80, cI: 15, pI: -28, rI: 4, pD: 22, rD: 25 },
  tirarCarga: { hD: -40, cD: 60, tronco: -8, hI: 30, cI: 30, pI: -14, pD: 18 }, // brazo atrás antes de lanzar
  tirarSuelta: { hD: 120, cD: 5, tronco: 14, hI: -30, cI: 20, pI: -24, pD: 24, rD: 12 },
  celular: { hD: 30, cD: 125, cabeza: 22, tronco: 6, hI: 8, cI: 30 },
  zombi: { hI: 85, cI: 8, hD: 90, cD: 4, tronco: 10, cabeza: 18 },
  hablar: { hD: 45, cD: 70, hI: -10, cI: 25 },
};

export const pose = (p: string | Partial<Pose> = {}): Pose => ({ ...POSE0, ...(typeof p === "string" ? POSES[p] : p) });
export const mezclaPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = { ...a };
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * t));
  return o;
};

// ciclo de caminar / correr: fase 0..1 por paso doble. La cadera rebota sola por el apoyo del pie más bajo.
export const caminar = (fase: number, correr = 0): Pose => {
  const w = 2 * Math.PI * fase;
  const s = Math.sin(w), sB = Math.sin(w + Math.PI);
  const A = 26 + 18 * correr;
  const K = 34 + 46 * correr;
  // la rodilla se dobla cuando la pierna viaja hacia adelante (fase de vuelo), con pico a mitad del vuelo
  const vuelo = (x: number) => Math.max(0, Math.cos(x));
  return {
    tronco: 4 + 12 * correr + 1.5 * Math.sin(2 * w),
    cabeza: -2 - 6 * correr,
    pD: A * s, rD: 4 + K * vuelo(w),
    pI: A * sB, rI: 4 + K * vuelo(w + Math.PI),
    hD: -(20 + 26 * correr) * s, cD: 14 + 70 * correr + 8 * Math.max(0, -s),
    hI: -(20 + 26 * correr) * sB, cI: 14 + 70 * correr + 8 * Math.max(0, -sB),
    bajar: 0,
  };
};
// largo de paso doble en px a escala 1 (para que el pie no patine: fase = distancia / ZANCADA)
export const ZANCADA = (correr = 0, h: Huesos = HUESOS) => 2 * 2 * (h.muslo + h.pierna) * Math.sin(((26 + 18 * correr) * Math.PI) / 180);

// ---------- esqueleto ----------
export type Huesos = { muslo: number; pierna: number; torso: number; cuello: number; cabezaR: number; brazo: number; antebrazo: number };
export const HUESOS: Huesos = { muslo: 62, pierna: 62, torso: 88, cuello: 3, cabezaR: 46, brazo: 48, antebrazo: 46 };
// proporciones por estilo: el frijol (Monk Mode) es petiso, cabezón y de miembros gruesos
export const huesosDe = (estilo: Estilo = "palo", alto = 1): Huesos => {
  const b = estilo === "frijol" || estilo === "demonio" ? { muslo: 42, pierna: 42, torso: 76, cuello: 0, cabezaR: 60, brazo: 42, antebrazo: 40 } : HUESOS;
  return { ...b, muslo: b.muslo * alto, pierna: b.pierna * alto, torso: b.torso * alto };
};
const rad = (g: number) => (g * Math.PI) / 180;
const dirV = (g: number, L: number) => ({ x: Math.sin(rad(g)) * L, y: Math.cos(rad(g)) * L });

export type Articulaciones = ReturnType<typeof articulaciones>;
// coordenadas LOCALES (pies en y=0, mirando a +x, escala 1)
// sep = separación de hombros y caderas respecto del eje (vista de perfil ≈ 6/5; vista frontal del frijol ≈ 30/15)
export const articulaciones = (p: Pose, asiento?: number, H: Huesos = HUESOS, sep = { h: 6, c: 5 }) => {
  const pierna = (a: number, r: number, dx: number) => {
    const rod = dirV(a, H.muslo);
    const pie = dirV(a - r, H.pierna);
    return { dx, rod, pie: { x: rod.x + pie.x, y: rod.y + pie.y } };
  };
  const LI = pierna(p.pI, p.rI, -sep.c), LD = pierna(p.pD, p.rD, sep.c);
  const bajo = Math.max(LI.rod.y, LI.pie.y, LD.rod.y, LD.pie.y);
  const caderaY = asiento !== undefined ? -asiento : -bajo + p.bajar;
  const cad = { x: 0, y: caderaY };
  const t = dirV(180 + p.tronco, H.torso); // torso hacia arriba
  const hombro = { x: cad.x + t.x, y: cad.y + t.y };
  const c = dirV(180 + p.tronco + p.cabeza, H.cuello + H.cabezaR);
  const cabeza = { x: hombro.x + c.x, y: hombro.y + c.y };
  const brazo = (h: number, k: number, dx: number) => {
    const o = { x: hombro.x + dx, y: hombro.y + 6 };
    const a = dirV(h + p.tronco, H.brazo);
    const codo = { x: o.x + a.x, y: o.y + a.y };
    const b = dirV(h + p.tronco + k, H.antebrazo);
    return { o, codo, mano: { x: codo.x + b.x, y: codo.y + b.y }, angAnte: h + p.tronco + k };
  };
  const pt = (L: typeof LI) => ({
    cad: { x: cad.x + L.dx, y: cad.y },
    rod: { x: cad.x + L.dx + L.rod.x, y: cad.y + L.rod.y },
    pie: { x: cad.x + L.dx + L.pie.x, y: cad.y + L.pie.y },
  });
  return { cad, hombro, cabeza, bI: brazo(p.hI, p.cI, -sep.h), bD: brazo(p.hD, p.cD, sep.h), lI: pt(LI), lD: pt(LD) };
};

// IK de 2 huesos: devuelve {h, c} para que la mano llegue a `obj` (local, relativo a los pies) con codo natural
export const alcanzar = (p: Pose, lado: "D" | "I", obj: { x: number; y: number }, asiento?: number, H: Huesos = HUESOS, sep?: { h: number; c: number }): Partial<Pose> => {
  const j = articulaciones(p, asiento, H, sep);
  const o = (lado === "D" ? j.bD : j.bI).o;
  const dx = obj.x - o.x, dy = obj.y - o.y;
  const a = H.brazo, b = H.antebrazo;
  const d = Math.min(a + b - 0.5, Math.max(4, Math.hypot(dx, dy)));
  const base = (Math.atan2(dx, dy) * 180) / Math.PI; // ángulo desde "abajo" hacia adelante
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const alfa = (Math.acos(Math.max(-1, Math.min(1, cosA))) * 180) / Math.PI;
  const cosK = (a * a + b * b - d * d) / (2 * a * b);
  const codo = 180 - (Math.acos(Math.max(-1, Math.min(1, cosK))) * 180) / Math.PI;
  // codo hacia abajo/atrás: el hombro gira menos que la recta y el antebrazo cierra hacia adelante
  const h = base - alfa - p.tronco;
  return lado === "D" ? { hD: h, cD: codo } : { hI: h, cI: codo };
};

// ---------- expresiones (todas numéricas → se mezclan con resorte) ----------
export type Expr = {
  abre: number; // apertura del ojo 0..1.3
  pupila: number; // radio
  ceja: number; // ángulo de ceja: + = enojo (punta interna abajo), - = triste/preocupado
  cejaY: number; // altura de ceja (- = arriba)
  parpado: number; // 0..1 párpado superior que tapa (cansado/enojo)
  bocaW: number; bocaC: number; bocaO: number; // ancho, curva (+ sonrisa), apertura
  bocaIz: number; bocaDe: number; // altura de cada comisura (asimetría)
  dientes: number; // 0..1
  rubor: number; // 0..1
  gota: number; // 0..1 gota de sudor
};
const E = (o: Partial<Expr>): Expr => ({ abre: 1, pupila: 4.6, ceja: 0, cejaY: 0, parpado: 0, bocaW: 7, bocaC: 2, bocaO: 0, bocaIz: 0, bocaDe: 0, dientes: 0, rubor: 0, gota: 0, ...o });
export const EXPRESIONES: Record<string, Expr> = {
  neutral: E({}),
  feliz: E({ bocaW: 9, bocaC: 6, bocaO: 1, cejaY: -2, ceja: -4 }),
  risa: E({ abre: 0.35, bocaW: 12, bocaC: 9, bocaO: 7, dientes: 1, cejaY: -4, rubor: 0.7, ceja: -6 }),
  triste: E({ ceja: -22, cejaY: -1, bocaW: 8, bocaC: -5, abre: 0.85, pupila: 5 }),
  miedo: E({ abre: 1.3, pupila: 3, ceja: -26, cejaY: -6, bocaW: 9, bocaC: -2, bocaO: 4, gota: 1 }),
  sorpresa: E({ abre: 1.3, pupila: 3.4, cejaY: -9, bocaW: 4.5, bocaC: 0, bocaO: 6 }),
  enojo: E({ ceja: 26, cejaY: 2, parpado: 0.3, bocaW: 9, bocaC: -4, bocaO: 1.5, dientes: 0.7 }),
  duda: E({ ceja: 10, cejaY: -2, bocaW: 7, bocaC: 0, bocaIz: 2, bocaDe: -3, parpado: 0.15 }),
  picaro: E({ ceja: 14, parpado: 0.35, bocaW: 9, bocaC: 4, bocaIz: 2, bocaDe: -4 }),
  cansado: E({ parpado: 0.55, ceja: -8, cejaY: 2, bocaW: 6, bocaC: -1.5, pupila: 4 }),
  asco: E({ ceja: 18, parpado: 0.25, bocaW: 9, bocaC: -4, bocaO: 2, bocaIz: -3, bocaDe: 3 }),
  determinado: E({ ceja: 18, cejaY: 1, parpado: 0.18, bocaW: 8, bocaC: 0.5, pupila: 4.2 }),
  zombi: E({ abre: 1, pupila: 0, parpado: 0.25, bocaW: 9, bocaC: -2, bocaO: 4, dientes: 0.6 }),
};
export const mezclaExpr = (a: Expr, b: Expr, t: number): Expr => {
  const o = { ...a };
  (Object.keys(a) as (keyof Expr)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * t));
  return o;
};

// claves en el tiempo: cada tramo llega con resorte (inercia leve, sin rebote exagerado)
export type ClaveT<T> = { f: number; v: T; d?: number };
export const enTiempo = <T,>(cl: ClaveT<T>[], f: number, fps: number, mezcla: (a: T, b: T, t: number) => T, rigidez = 120): T => {
  let v = cl[0].v;
  for (let i = 1; i < cl.length; i++) {
    const k = cl[i];
    if (f < k.f) return v;
    const t = spring({ frame: f - k.f, fps, config: { damping: 16, stiffness: rigidez, mass: 0.8 }, durationInFrames: k.d });
    v = mezcla(v, k.v, Math.min(1.08, t));
  }
  return v;
};

// ---------- ropa y accesorios ----------
export type Accesorio =
  | { t: "gorra"; color: string; atras?: boolean; placa?: string }
  | { t: "capucha"; color: string }
  | { t: "pelo"; forma: "corto" | "punta" | "bob" | "cola" | "calvo"; color: string }
  | { t: "barba"; color: string }
  | { t: "bufanda"; color: string }
  | { t: "mochila"; color: string }
  | { t: "lentes"; color?: string; forma?: "redondo" | "gato" }
  | { t: "sombrero"; color: string }
  | { t: "vincha"; color: string }
  | { t: "bata"; color: string }
  | { t: "corbata"; color: string; suelta?: boolean }
  | { t: "trenzas"; color: string; lazo?: string }
  | { t: "gorroPapel"; color: string }
  | { t: "auriculares"; color: string }
  | { t: "delantal"; color: string }
  | { t: "chaleco"; color: string }
  | { t: "parche"; color: string; lado?: 1 | -1 }
  | { t: "orejas"; color: string }
  | { t: "gorroLana"; color: string; vuelta?: string; pompon?: boolean }
  | { t: "bigote"; color: string };

export type Estilo = "palo" | "frijol" | "demonio" | "zombi";
export type Look = {
  estilo: Estilo;
  piel?: string; // cabeza y manos
  camisa?: string;
  manga?: "corta" | "larga" | "ninguna";
  pantalon?: string; // si falta, piernas del color de miembro
  zapatos?: string;
  miembro?: string; // color de brazos/piernas desnudos
  contorno?: string; // estilo frijol
  neon?: string; // demonio
  accesorios?: Accesorio[];
  alto?: number; // multiplica el largo de piernas/torso (niños 0,7)
  frontal?: boolean; // brazos a los costados del cuerpo (por defecto en frijol/demonio)
};

export const LOOKS = {
  awakenBlanco: { estilo: "palo", camisa: "#f1ece2", manga: "corta" } as Look,
  awakenNaranja: { estilo: "palo", camisa: "#f05a1f", manga: "larga", accesorios: [{ t: "capucha", color: "#e0521c" }] } as Look,
  awakenGorra: { estilo: "palo", camisa: "#2b2622", manga: "corta", accesorios: [{ t: "gorra", color: "#f2b417" }] } as Look,
  monk: { estilo: "frijol", piel: "#ece5d3", camisa: "#ece5d3", accesorios: [] } as Look,
  demonio: { estilo: "demonio", neon: "#ff3fa4" } as Look,
};

// ---------- luz sobre el personaje ----------
export type LuzP = { lado: 1 | -1; color: string; fuerza?: number; borde?: string };

export type PersonajeProps = {
  x: number; y: number; escala?: number; dir?: 1 | -1;
  p: Pose; e: Expr | string; look: Look;
  mirar?: { x: number; y: number }; // -1..1 hacia dónde miran las pupilas (en pantalla)
  cara?: number; // -1..1 giro de la cara (corre los rasgos)
  luz?: LuzP; sombra?: number; asiento?: number;
  parpadeo?: number; // 0..1 (1 = ojo cerrado) calculado afuera con `parpadear`
  habla?: number; // 0..1 apertura extra de boca (lip-flap)
  enManoD?: React.ReactNode; enManoI?: React.ReactNode;
  opacidad?: number;
};

export const parpadear = (f: number, seed = 0) => {
  const per = 96 + ((seed * 37) % 41);
  const k = (f + seed * 13) % per;
  return k < 2 ? k / 2 : k < 5 ? 1 - (k - 2) / 3 : 0;
};
// lip-flap orgánico para diálogo (sin audio): suma de senos con silencios
export const labios = (f: number, seed = 0) => {
  const t = f / 30 + seed;
  const v = Math.abs(Math.sin(t * 9.1) * 0.6 + Math.sin(t * 13.7 + 1) * 0.4);
  const pausa = Math.sin(t * 1.3 + seed) > -0.35 ? 1 : 0.1;
  return v * pausa;
};

const oscurecer = (hex: string, k: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
  return `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)})`;
};

export const Personaje: React.FC<PersonajeProps> = (props) => {
  const { x, y, escala = 1, dir = 1, p, look, mirar = { x: 0, y: 0 }, cara = 0, luz, sombra = 0.35, asiento, parpadeo = 0, habla = 0, opacidad = 1 } = props;
  const e = typeof props.e === "string" ? EXPRESIONES[props.e] : props.e;
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const est = look.estilo;
  const H = huesosDe(est, look.alto);
  const frontal = look.frontal ?? (est === "frijol" || est === "demonio");
  const j = articulaciones(p, asiento, H, frontal ? { h: 29, c: 15 } : { h: 6, c: 5 });
  const frijol = est === "frijol";
  const demonio = est === "demonio";
  const zombi = est === "zombi";
  const neon = look.neon ?? "#ff3fa4";
  const piel = look.piel ?? (frijol ? "#ece5d3" : zombi ? "#7d8f74" : demonio ? "#0b0709" : "#17100d");
  const miembro = look.miembro ?? (frijol ? piel : demonio ? "#0b0709" : zombi ? "#5f6e58" : "#17100d");
  const contorno = look.contorno ?? (frijol ? "#2a2622" : demonio ? neon : "none");
  const grosor = frijol ? 19 : demonio ? 21 : 8.5;
  const camisa = look.camisa ?? (frijol ? piel : demonio ? "#0b0709" : "#f1ece2");
  const acc = look.accesorios ?? [];
  const tiene = (t: Accesorio["t"]) => acc.find((a) => a.t === t) as any;
  // luz en coordenadas locales: si el personaje mira a la izquierda, el lado iluminado se invierte
  const lz = luz ? luz.lado * dir : 1;
  const fz = luz?.fuerza ?? 0.85;
  const bordeC = luz?.borde ?? luz?.color ?? "#ffd9a0";
  const gx1 = lz > 0 ? "0%" : "100%", gx2 = lz > 0 ? "100%" : "0%";

  const P = (a: { x: number; y: number }) => `${a.x.toFixed(1)},${a.y.toFixed(1)}`;
  // miembro: dos trazos (contorno + relleno) en frijol/demonio, uno en palo
  const Miembro: React.FC<{ pts: { x: number; y: number }[]; color: string; w?: number; atras?: boolean }> = ({ pts, color, w = grosor, atras }) => {
    const d = `M${pts.map(P).join(" L")}`;
    const c = atras && !demonio ? oscurecer(color.startsWith("#") ? color : "#777777", frijol ? 0.86 : 0.8) : color;
    return (
      <g>
        {contorno !== "none" && <path d={d} stroke={contorno} strokeWidth={w + (demonio ? 3 : 5)} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={demonio ? 0.9 : 1} />}
        <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };

  const Pierna: React.FC<{ L: typeof j.lD; atras?: boolean }> = ({ L, atras }) => {
    const pant = look.pantalon;
    const zap = look.zapatos ?? (frijol ? "#5aa8e6" : "#1d1714");
    // zapato: apoyado plano en el piso salvo que la pierna esté en el aire o arrodillada
    const angShin = (Math.atan2(L.pie.x - L.rod.x, L.pie.y - L.rod.y) * 180) / Math.PI;
    const plano = Math.max(-25, Math.min(40, -angShin * 0.35));
    return (
      <g>
        <Miembro pts={[L.cad, L.rod, L.pie]} color={miembro} atras={atras} />
        {pant && <Miembro pts={[L.cad, L.rod, L.pie]} color={pant} w={grosor + (frijol ? 0 : 7)} atras={atras} />}
        <g transform={`translate(${P(L.pie)}) rotate(${plano})`}>
          {frijol ? (
            <>
              <path d="M-9,-4 Q-10,8 2,8 L20,8 Q24,7 22,1 Q18,-6 6,-7 Z" fill={atras ? oscurecer(zap, 0.8) : zap} stroke={contorno} strokeWidth={3.5} />
              <path d="M-8,5 L22,5" stroke="#f4f1ea" strokeWidth={3} />
            </>
          ) : demonio ? null : (
            <path d="M-6,-3 Q-7,6 0,6 L15,6 Q18,5 16,0 Q12,-5 4,-5 Z" fill={atras ? oscurecer(zap.startsWith("#") ? zap : "#222222", 0.75) : zap} />
          )}
        </g>
      </g>
    );
  };

  const Brazo: React.FC<{ B: typeof j.bD; atras?: boolean; objeto?: React.ReactNode }> = ({ B, atras, objeto }) => {
    const manga = look.manga ?? (frijol ? "ninguna" : "corta");
    const mx = { x: B.o.x + (B.codo.x - B.o.x) * 0.62, y: B.o.y + (B.codo.y - B.o.y) * 0.62 };
    const finManga = manga === "larga" ? [B.o, B.codo, { x: B.codo.x + (B.mano.x - B.codo.x) * 0.8, y: B.codo.y + (B.mano.y - B.codo.y) * 0.8 }] : [B.o, mx];
    const manoR = frijol ? 10.5 : demonio ? 11 : 6.2;
    return (
      <g>
        <Miembro pts={[B.o, B.codo, B.mano]} color={miembro} atras={atras} />
        {manga !== "ninguna" && !frijol && !demonio && <Miembro pts={finManga} color={camisa} w={grosor + 9} atras={atras} />}
        {objeto && <g transform={`translate(${P(B.mano)}) rotate(${-B.angAnte})`}>{objeto}</g>}
        <circle cx={B.mano.x} cy={B.mano.y} r={manoR} fill={atras && frijol ? oscurecer(piel, 0.88) : frijol ? piel : miembro} stroke={contorno !== "none" ? contorno : undefined} strokeWidth={demonio ? 2.5 : 3.5} />
      </g>
    );
  };

  // torso: tubo redondeado de cadera a hombro (camisa). En frijol es un poroto ancho.
  const ang = p.tronco;
  const tl = Math.hypot(j.hombro.x - j.cad.x, j.hombro.y - j.cad.y);
  const ancho = frijol ? 70 : demonio ? 74 : 48;
  const Torso = () => {
    const bata = tiene("bata");
    return (
      <g transform={`translate(${P(j.cad)}) rotate(${ang})`}>
        <defs>
          <linearGradient id={`tr${uid}`} x1={gx1} x2={gx2} y1="0" y2="0">
            <stop offset="0" stopColor={oscurecer(camisa.startsWith("#") ? camisa : "#888888", frijol ? 0.84 : 0.62)} />
            <stop offset="0.55" stopColor={camisa} />
            <stop offset="1" stopColor={camisa} />
          </linearGradient>
          <linearGradient id={`rb${uid}`} x1={gx1} x2={gx2} y1="0" y2="0">
            <stop offset="0.6" stopColor={bordeC} stopOpacity={0} />
            <stop offset="1" stopColor={bordeC} stopOpacity={luz ? fz : 0} />
          </linearGradient>
        </defs>
        {demonio ? (
          <path d={`M${-ancho / 2},6 Q${-ancho / 2 - 4},${-tl * 0.6} ${-ancho / 2 + 6},${-tl - 8} L${ancho / 2 - 6},${-tl - 8} Q${ancho / 2 + 4},${-tl * 0.6} ${ancho / 2},6 Z`} fill="#0b0709" stroke={neon} strokeWidth={3} />
        ) : frijol ? (
          <path d={`M${-ancho / 2 + 2},4 Q${-ancho / 2 - 6},${-tl * 0.55} ${-ancho / 2 + 10},${-tl - 4} Q0,${-tl - 14} ${ancho / 2 - 10},${-tl - 4} Q${ancho / 2 + 6},${-tl * 0.55} ${ancho / 2 - 2},4 Q0,12 ${-ancho / 2 + 2},4 Z`} fill={`url(#tr${uid})`} stroke={contorno} strokeWidth={4} />
        ) : (
          <>
            <rect x={-ancho / 2} y={-tl - 6} width={ancho} height={tl + 14} rx={ancho * 0.42} fill={`url(#tr${uid})`} />
            {bata && <rect x={-ancho / 2 - 5} y={-tl - 6} width={ancho + 10} height={tl + 42} rx={16} fill={`url(#tr${uid})`} />}
            {luz && <rect x={-ancho / 2} y={-tl - 6} width={ancho} height={tl + 14} rx={ancho * 0.42} fill="none" stroke={`url(#rb${uid})`} strokeWidth={4} />}
          </>
        )}
        {tiene("chaleco") && !frijol && !demonio && <path d={`M${-ancho / 2},${-tl - 2} L${-ancho * 0.12},${-tl - 2} L${ancho * 0.04},${-tl * 0.3} L${-ancho * 0.12},4 L${-ancho / 2},4 Z M${ancho / 2},${-tl - 2} L${ancho * 0.2},${-tl - 2} L${ancho * 0.12},${-tl * 0.35} L${ancho * 0.22},4 L${ancho / 2},4 Z`} fill={tiene("chaleco").color} />}
        {tiene("delantal") && (
          <g fill={tiene("delantal").color}>
            <rect x={-ancho * 0.36} y={-tl * 0.78} width={ancho * 0.72} height={tl * 0.78 + 34} rx={6} />
            <path d={`M${-ancho * 0.3},${-tl * 0.78} L${-ancho * 0.2},${-tl - 4} M${ancho * 0.3},${-tl * 0.78} L${ancho * 0.2},${-tl - 4}`} stroke={tiene("delantal").color} strokeWidth={4} />
            <rect x={-ancho * 0.2} y={-tl * 0.3} width={ancho * 0.4} height={14} rx={3} fill={oscurecer(tiene("delantal").color, 0.82)} />
          </g>
        )}
        {tiene("parche") && <rect x={(tiene("parche").lado ?? 1) * ancho * 0.12 - 7} y={-tl * 0.8} width={14} height={10} rx={2} fill={tiene("parche").color} stroke="#f4efe4" strokeWidth={1.5} />}
        {tiene("corbata") && <path transform={tiene("corbata").suelta ? `rotate(9 0 ${-tl + 4})` : undefined} d={`M-4,${-tl + (tiene("corbata").suelta ? 12 : 4)} L4,${-tl + (tiene("corbata").suelta ? 12 : 4)} L6,${-tl * 0.35} L0,${-tl * 0.25} L-6,${-tl * 0.35} Z`} fill={tiene("corbata").color} />}
        {tiene("mochila") && <rect x={-ancho / 2 - 20} y={-tl + 6} width={24} height={tl * 0.7} rx={8} fill={tiene("mochila").color} />}
      </g>
    );
  };

  // ---------- cabeza ----------
  const R = H.cabezaR;
  const k = R / 40; // los rasgos se dibujan a radio 40 y se escalan
  const Rk = R / k;
  const hx = j.cabeza.x, hy = j.cabeza.y + (frijol || demonio ? 14 : 4);
  const cx = cara * 9 * dir; // los rasgos se corren hacia donde gira la cara (en local)
  const ab = Math.max(0.04, e.abre * (1 - parpadeo));
  const ojoS = frijol ? 12.5 : 13.5, ojoRx = frijol ? 8.2 : 9.8, ojoRy = (frijol ? 8.6 : 11) * ab;
  const colorCeja = frijol ? "#2a2622" : zombi ? "#2c3528" : "#efe7d6";
  const colorBoca = frijol ? "#3a2420" : zombi ? "#2c1e1a" : "#f1e9d8";
  const mx = mirar.x * dir * 3.6, my = mirar.y * 3.2;
  const by = 18 + (frijol ? 2 : 0);
  const bo = e.bocaO + habla * 6;
  const bocaD = `M${-e.bocaW},${e.bocaIz} Q0,${e.bocaC - bo * 0.25} ${e.bocaW},${e.bocaDe} Q0,${e.bocaC + bo} ${-e.bocaW},${e.bocaIz} Z`;
  const Ojo = ({ s }: { s: 1 | -1 }) => {
    const ox = s * ojoS + cx, oy = -4;
    const angP = e.ceja * s * -1; // párpado sigue a la ceja
    return (
      <g transform={`translate(${ox},${oy})`}>
        {demonio ? (
          <path d={`M-9,2 Q0,${-8 * ab} 9,2`} stroke={neon} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : (
          <>
            <ellipse rx={ojoRx} ry={ojoRy} fill={zombi ? "#d9dccb" : "#fbf8f0"} stroke={frijol ? contorno : undefined} strokeWidth={2.2} />
            {e.pupila > 0 && ab > 0.2 && (
              <>
                <circle cx={mx} cy={my + 1} r={e.pupila * (frijol ? 1.05 : 1)} fill="#1a1412" />
                <circle cx={mx + 1.6} cy={my - 0.8} r={1.4} fill="#fff" />
              </>
            )}
            {e.parpado > 0.01 && (
              <path d={`M-13,${-ojoRy - 6} L13,${-ojoRy - 6} L13,${-ojoRy + ojoRy * 2 * e.parpado} L-13,${-ojoRy + ojoRy * 2 * e.parpado} Z`} fill={piel} transform={`rotate(${angP * 0.6})`} />
            )}
          </>
        )}
      </g>
    );
  };
  const Ceja = ({ s }: { s: 1 | -1 }) => {
    if (demonio) return null;
    const ox = s * ojoS + cx, oy = -4 - ojoRy - 6 + e.cejaY - (1 - ab) * 2;
    return <path d="M-7,0 L7,0" transform={`translate(${ox},${oy}) rotate(${e.ceja * s * -1})`} stroke={colorCeja} strokeWidth={frijol ? 3.6 : 3} strokeLinecap="round" />;
  };

  const gorra = tiene("gorra"), capucha = tiene("capucha"), pelo = tiene("pelo"), barba = tiene("barba"), sombrero = tiene("sombrero"), vincha = tiene("vincha");
  const Cabeza = () => (
    <g transform={`translate(${hx},${hy}) rotate(${p.tronco * 0.4 + p.cabeza})`}>
      <defs>
        <linearGradient id={`hb${uid}`} x1={gx1} x2={gx2} y1="0" y2="0">
          <stop offset="0.55" stopColor={bordeC} stopOpacity={0} />
          <stop offset="1" stopColor={bordeC} stopOpacity={luz ? fz : 0} />
        </linearGradient>
        <radialGradient id={`hs${uid}`} cx={lz > 0 ? "70%" : "30%"} cy="30%" r="80%">
          <stop offset="0" stopColor="#ffffff" stopOpacity={frijol ? 0.18 : 0.07} />
          <stop offset="1" stopColor="#000000" stopOpacity={frijol ? 0.12 : 0} />
        </radialGradient>
        <clipPath id={`hc${uid}`}><circle r={Rk} /></clipPath>
      </defs>
      {capucha && <path d={`M${-R * 1.05},${R * 0.95} Q${-R * 1.25},${-R * 0.1} ${-R * 0.7},${-R * 0.78} Q${-R * 0.2},${-R * 1.12} ${R * 0.25},${-R * 1.02} Q${-R * 0.35},${-R * 0.55} ${-R * 0.55},${R * 0.2} Q${-R * 0.2},${R * 1.05} ${R * 0.75},${R * 0.92} Q${R * 0.2},${R * 1.3} ${-R * 1.05},${R * 0.95} Z`} fill={capucha.color} />}
      {pelo?.forma === "bob" && <path d={`M${-R - 8},${R * 0.75} Q${-R - 12},${-R - 10} 0,${-R - 9} Q${R + 12},${-R - 10} ${R + 8},${R * 0.75} Z`} fill={pelo.color} />}
      {pelo?.forma === "cola" && <path d={`M${-R + 2},${-R * 0.2} Q${-R - 30},${R * 0.2} ${-R - 22},${R * 1.2} Q${-R - 6},${R * 0.5} ${-R + 4},${R * 0.2} Z`} fill={pelo.color} />}
      {tiene("trenzas") && [-1, 1].map((sd) => (
        <g key={sd} fill={tiene("trenzas").color}>
          {[0, 1, 2, 3].map((q) => <ellipse key={q} cx={sd * (R * 0.82 + q * 2)} cy={R * 0.35 + q * 17} rx={9 - q * 0.8} ry={10} />)}
          <circle cx={sd * (R * 0.82 + 8)} cy={R * 0.35 + 70} r={5} fill={tiene("trenzas").lazo ?? "#e2483a"} />
        </g>
      ))}
      {tiene("orejas") && [-1, 1].map((sd) => <path key={sd} d={`M${sd * R * 0.55},${-R * 0.7} Q${sd * (R + 26)},${-R * 0.4} ${sd * (R + 14)},${R * 1.1} Q${sd * (R + 2)},${R * 1.25} ${sd * R * 0.8},${R * 0.1} Z`} fill={tiene("orejas").color} />)}
      {demonio && [16, 9, 4].map((w, i) => <circle key={i} r={R + w * 0.5} fill="none" stroke={neon} strokeWidth={w} opacity={0.12 + i * 0.12} />)}
      <circle r={R} fill={piel} stroke={contorno !== "none" ? contorno : undefined} strokeWidth={demonio ? 3 : 4} />
      <circle r={R} fill={`url(#hs${uid})`} />
      {zombi && <path d={`M${-R * 0.5},${-R * 0.7} l8,10 l-6,6`} stroke="#3c4a37" strokeWidth={3} fill="none" />}
      {/* rasgos (recortados a la cabeza), dibujados a radio 40 y escalados */}
      <g transform={`scale(${k})`}>
      <g clipPath={`url(#hc${uid})`}>
        <Ojo s={-1} /><Ojo s={1} />
        {e.rubor > 0.01 && [-1, 1].map((s) => <ellipse key={s} cx={s * 22 + cx} cy={12} rx={8} ry={4} fill="#ff7a7a" opacity={0.35 * e.rubor} />)}
        {barba && <path d={`M${-Rk},${4} Q${-Rk * 0.6},${Rk + 16} 0,${Rk + 12} Q${Rk * 0.6},${Rk + 16} ${Rk},${4} Q${Rk * 0.3},${Rk * 0.55} 0,${Rk * 0.5} Q${-Rk * 0.3},${Rk * 0.55} ${-Rk},${4} Z`} fill={barba.color} />}
        {tiene("bigote") && <path d={`M${cx * 0.9 - 17},${by - 2} Q${cx * 0.9 - 9},${by - 12} ${cx * 0.9},${by - 7} Q${cx * 0.9 + 9},${by - 12} ${cx * 0.9 + 17},${by - 2} Q${cx * 0.9 + 8},${by - 5} ${cx * 0.9},${by - 3} Q${cx * 0.9 - 8},${by - 5} ${cx * 0.9 - 17},${by - 2} Z`} fill={tiene("bigote").color} />}
        <g transform={`translate(${cx * 0.9},${by})`}>
          {demonio ? (
            <path d={`M${-14},-2 Q0,${12 + bo} 14,-2`} stroke={neon} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          ) : (
            <>
              <defs><clipPath id={`bc${uid}`}><path d={bocaD} /></clipPath></defs>
              <path d={bocaD} fill={bo > 0.8 ? (frijol ? "#5a2a26" : zombi ? "#2c1e1a" : "#f1e9d8") : "none"} stroke={colorBoca} strokeWidth={frijol ? 3 : 2.6} strokeLinejoin="round" strokeLinecap="round" />
              {e.dientes > 0.05 && bo > 2 && <rect x={-e.bocaW} y={e.bocaC - bo * 0.3 - 4} width={e.bocaW * 2} height={4 + bo * 0.35 * e.dientes} fill={frijol || zombi ? "#f6f1e6" : "#1a1210"} clipPath={`url(#bc${uid})`} />}
            </>
          )}
        </g>
      </g>
      <Ceja s={-1} /><Ceja s={1} />
      {e.gota > 0.05 && <path d={`M${Rk * 0.78},${-Rk * 0.35} q5,9 0,13 q-5,-4 0,-13 Z`} fill="#9fd6ff" opacity={e.gota} />}
      {tiene("lentes") && (
        <g stroke={tiene("lentes").color ?? (frijol ? "#2a2622" : "#efe7d6")} strokeWidth={2.4} fill="none">
          {tiene("lentes").forma === "gato"
            ? [-1, 1].map((sd) => <path key={sd} d={`M${sd * ojoS + cx - 14 * sd},-8 Q${sd * ojoS + cx},-14 ${sd * ojoS + cx + 14 * sd},-8 L${sd * ojoS + cx + sd * 20},-18 Q${sd * ojoS + cx + sd * 14},4 ${sd * ojoS + cx},7 Q${sd * ojoS + cx - sd * 14},4 ${sd * ojoS + cx - 14 * sd},-8 Z`} strokeWidth={3.4} />)
            : <><circle cx={-ojoS + cx} cy={-4} r={13} /><circle cx={ojoS + cx} cy={-4} r={13} /></>}
          <path d={`M${-0.5 + cx},-6 L${0.5 + cx},-6`} />
        </g>
      )}
      </g>
      {luz && !demonio && <circle r={R - 1.2} fill="none" stroke={`url(#hb${uid})`} strokeWidth={4.5} />}
      {/* encima de la cabeza */}
      {pelo?.forma === "corto" && <path d={`M${-R - 2},${-R * 0.25} Q${-R},${-R - 8} 0,${-R - 7} Q${R},${-R - 8} ${R + 2},${-R * 0.25} Q${R * 0.4},${-R * 0.75} ${-R + 4},${-R * 0.35} Z`} fill={pelo.color} />}
      {pelo?.forma === "punta" && <path d={`M${-R + 2},${-R * 0.55} L${-R * 0.55},${-R - 14} L${-R * 0.2},${-R * 0.85} L${R * 0.1},${-R - 18} L${R * 0.35},${-R * 0.85} L${R * 0.7},${-R - 12} L${R - 2},${-R * 0.5} Q0,${-R * 0.9} ${-R + 2},${-R * 0.55} Z`} fill={pelo.color} />}
      {(pelo?.forma === "bob" || pelo?.forma === "cola") && <path d={`M${-R - 3},${-R * 0.1} Q${-R},${-R - 9} 0,${-R - 8} Q${R},${-R - 9} ${R + 3},${-R * 0.1} Q${R * 0.2},${-R * 0.6} ${-R * 0.15},${-R * 0.25} Q${-R * 0.6},${-R * 0.55} ${-R - 3},${-R * 0.1} Z`} fill={pelo.color} />}
      {gorra && (
        <g>
          <path d={`M${-R - 1},${-R * 0.2} Q${-R},${-R - 8} 0,${-R - 8} Q${R},${-R - 8} ${R + 1},${-R * 0.2} Z`} fill={gorra.color} />
          <path d={gorra.atras ? `M${-R + 2},${-R * 0.25} L${-R - 22},${-R * 0.18} Q${-R - 22},${-R * 0.38} ${-R + 2},${-R * 0.42} Z` : `M${R - 2},${-R * 0.25} L${R + 24},${-R * 0.18} Q${R + 24},${-R * 0.38} ${R - 2},${-R * 0.42} Z`} fill={oscurecer(gorra.color, 0.82)} />
          <circle cx={0} cy={-R - 7} r={3} fill={oscurecer(gorra.color, 0.82)} />
          {gorra.placa && <path d={`M${R * 0.25},${-R * 0.72} l7,-5 l7,5 l-2,9 l-10,0 Z`} fill={gorra.placa} />}
        </g>
      )}
      {sombrero && (
        <g>
          <ellipse cx={0} cy={-R * 0.55} rx={R + 30} ry={9} fill={sombrero.color} />
          <path d={`M${-R * 0.75},${-R * 0.55} L${-R * 0.6},${-R - 22} Q0,${-R - 30} ${R * 0.6},${-R - 22} L${R * 0.75},${-R * 0.55} Z`} fill={oscurecer(sombrero.color, 0.85)} />
        </g>
      )}
      {tiene("gorroLana") && (
        <g>
          <path d={`M${-R - 3},${-R * 0.3} Q${-R * 0.95},${-R - 16} 0,${-R - 15} Q${R * 0.95},${-R - 16} ${R + 3},${-R * 0.3} Z`} fill={tiene("gorroLana").color} />
          {[-0.5, -0.17, 0.17, 0.5].map((q) => <path key={q} d={`M${q * R},${-R * 0.45} Q${q * R * 1.05},${-R * 0.9} ${q * R * 0.9},${-R - 10}`} stroke={oscurecer(tiene("gorroLana").color, 0.82)} strokeWidth={2.4} fill="none" />)}
          <rect x={-R - 6} y={-R * 0.48} width={2 * R + 12} height={R * 0.32} rx={R * 0.14} fill={tiene("gorroLana").vuelta ?? "#efe3c8"} />
          {tiene("gorroLana").pompon && <circle cx={0} cy={-R - 16} r={9} fill={tiene("gorroLana").vuelta ?? "#efe3c8"} />}
        </g>
      )}
      {tiene("gorroPapel") && (
        <g>
          <path d={`M${-R - 4},${-R * 0.35} L${-R * 0.8},${-R - 18} L${R * 0.8},${-R - 18} L${R + 4},${-R * 0.35} Z`} fill={tiene("gorroPapel").color} stroke={oscurecer(tiene("gorroPapel").color, 0.8)} strokeWidth={2} />
          <rect x={-R - 4} y={-R * 0.55} width={2 * R + 8} height={9} fill={oscurecer(tiene("gorroPapel").color, 0.85)} />
        </g>
      )}
      {tiene("auriculares") && (
        <g stroke={tiene("auriculares").color} fill="none" strokeLinecap="round">
          <path d={`M${-R - 3},${-R * 0.05} Q0,${-R - 22} ${R + 3},${-R * 0.05}`} strokeWidth={5} />
          <rect x={R - 4} y={-R * 0.15} width={12} height={22} rx={5} fill={tiene("auriculares").color} strokeWidth={0} />
          <path d={`M${R + 2},${R * 0.2} Q${R * 0.9},${R * 0.75} ${R * 0.35},${R * 0.62}`} strokeWidth={3} />
        </g>
      )}
      {vincha && <path d={`M${-R},${-R * 0.45} Q0,${-R * 0.85} ${R},${-R * 0.45}`} stroke={vincha.color} strokeWidth={7} fill="none" />}
    </g>
  );

  const bufanda = tiene("bufanda");
  const sombraW = 46 + Math.abs(j.lD.pie.x - j.lI.pie.x) * 0.6;
  return (
    <g transform={`translate(${x},${y}) scale(${escala * dir},${escala})`} opacity={opacidad}>
      {/* sombra de contacto: se achica cuando el cuerpo sube (salto) */}
      {sombra > 0 && <ellipse cx={(j.lD.pie.x + j.lI.pie.x) / 2} cy={2} rx={sombraW * (frijol ? 1.2 : 1)} ry={8} fill="#000" opacity={sombra} />}
      <Brazo B={j.bI} atras objeto={props.enManoI} />
      <Pierna L={j.lI} atras />
      <Torso />
      <Pierna L={j.lD} />
      {bufanda && (
        <g transform={`translate(${P(j.hombro)}) rotate(${ang})`}>
          <rect x={-ancho / 2 - 2} y={-6} width={ancho + 4} height={14} rx={7} fill={bufanda.color} />
          <rect x={ancho / 2 - 14} y={0} width={11} height={34} rx={5} fill={oscurecer(bufanda.color, 0.85)} />
        </g>
      )}
      {frontal ? <><Brazo B={j.bD} objeto={props.enManoD} /><Cabeza /></> : <><Cabeza /><Brazo B={j.bD} objeto={props.enManoD} /></>}
    </g>
  );
};
