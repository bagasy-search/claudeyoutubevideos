// Kit de planos de CHICAGO para tz05 y tz07 (sesión tz-c), armado sobre el mundo de tz-a (elenco, hud, utilería, sets).
// Cada plano es una Escena con el elenco ya parado en su lugar; se pisa sólo lo que cambia. Los actores aceptan un
// objeto o una función del cuadro (para que Mara crezca o se vuelva humo dentro del mismo plano).
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { Clave, mira, useF } from "../../anikit/camara";
import { Actor, ActorProps, posRuta } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { F_GLOBO, F_HUD } from "../../anikit/pantalla";
import { ClaveT, Look, Pose } from "../../anikit/personaje";
import { CaraEsquina } from "../../anikit/inserto";
import { conMomento, Momento, palMomento } from "../../anikit/momento";
import { ACENTO, ESC, FRIO, LEO, LEO_CAPUCHA, MARA, ORO, PAL, PAL_DIA, TENZO } from "../elenco";
import { MAYA } from "../elenco_b";
import { FarolMano, TelMesa, Tel } from "../utileria";
import { Lavadero, LAV_PISO, LAV_PUNTOS as L } from "../sets/lavadero";
import { Cuarto, COLCHON_ALTO, CTO_PISO, CTO_PUNTOS as C } from "../sets/cuarto";
import { Broadway, BWY_PISO } from "../sets/broadway";
import { Colectivo36, COLECTIVO, COLECTIVO_PISO } from "../sets/wilson";

export { mira };
export type Act = Partial<ActorProps> | null;
type ActF = Act | ((f: number) => Act);
const res = (a: ActF | undefined, f: number): Act | undefined => (typeof a === "function" ? a(f) : a);

export const RIM_ORO = { lado: -1 as const, color: ORO, fuerza: 0.85 };
export const RIM_FRIO = { lado: 1 as const, color: FRIO, fuerza: 0.55 };
export const SENTADO = { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 };
export const SENTADO_TEL = { ...SENTADO, hD: 30, cD: 125, cabeza: 22, tronco: 6 };
// manos de Tenzo sobre la mesa de doblar (cose / dobla): alterna dos poses cada `paso` cuadros
export const cosiendo = (f0: number, f1: number, paso = 14) =>
  Array.from({ length: Math.max(1, Math.floor((f1 - f0) / paso)) }).map((_, i) => ({ f: f0 + i * paso, v: i % 2 ? { hD: 52, cD: 78, hI: 30, cI: 96 } : { hD: 38, cD: 98, hI: 32, cI: 92 } }));
export const TENZO_MESA = { hD: 38, cD: 98, hI: 32, cI: 92 };

const mk = (def: Partial<ActorProps>, over: Act | undefined): ActorProps | null => (over === null ? null : ({ ...def, ...(over ?? {}) } as ActorProps));

// ACTUACIÓN automática en las charlas: el que habla gesticula en cada frase (mano que explica, palma abierta, las dos
// manos, señala, se toca el pecho), se inclina y mira al otro; el que escucha lo mira, asiente y vuelve a lo suyo.
// Sólo toca a los actores con 1-2 poses fijas y mirada fija (los planos ya coreografiados quedan como están).
const GESTOS: Partial<Pose>[] = [
  { hD: 70, cD: 40, cabeza: -6, tronco: 3 }, { hD: 55, cD: 95, tronco: 7, cabeza: 4 }, { hI: 60, cI: 50, hD: 62, cD: 48, cabeza: -4 },
  { hD: 88, cD: 22, cabeza: 8 }, { hI: 48, cI: 100, cabeza: -10, tronco: -3 }, { hD: 42, cD: 118, cabeza: 6, tronco: 5 },
];
const GESTOS_IZQ: Partial<Pose>[] = [{ hI: 58, cI: 46, cabeza: -6 }, { hI: 44, cI: 96, tronco: 6, cabeza: 5 }, { cabeza: 9, tronco: -4 }];
// posturas de reposo entre frases (con algo en la mano derecha sólo se mueve la izquierda)
const VIVO: ((manoOcupada: boolean) => Partial<Pose>)[] = [
  (o) => ({ cabeza: 9, tronco: 4, ...(o ? { hI: 40, cI: 70 } : { hD: 48, cD: 80 }) }),
  () => ({ cabeza: -8, tronco: -3 }),
  (o) => ({ cabeza: 4, tronco: 7, ...(o ? { hI: 62, cI: 110 } : { hI: 58, cI: 104, hD: 44, cD: 92 }) }),
  (o) => ({ cabeza: -12, tronco: 2, ...(o ? {} : { hD: 72, cD: 30 }) }),
  () => ({ cabeza: 12, tronco: -5 }),
];
type K<T> = { f: number; v: T; d?: number };
const baseEn = <T,>(ks: K<T>[], f: number) => { let v = ks[0].v; for (const k of ks) if (k.f <= f) v = k.v; return v; };
const mas = (b: Partial<Pose>, g: Partial<Pose>): Partial<Pose> => ({
  ...b, ...g, tronco: (b.tronco ?? 0) + (g.tronco ?? 0), cabeza: (b.cabeza ?? 0) + (g.cabeza ?? 0),
});
const actuar = (a: ActorProps | null, otro: ActorProps | null, hacia: { x: number; y: number }, semilla: number): ActorProps | null => {
  if (!a) return a;
  const ps = (a.poses ?? []) as K<string | Partial<Pose>>[];
  const libre = ps.length > 0 && ps.length <= 2 && ps.every((k) => typeof k.v === "object");
  const ms = (a.miradas ?? []) as K<{ x: number; y: number }>[];
  const mirarLibre = ms.length <= 1;
  const m0 = ms[0]?.v ?? { x: 0, y: 0 };
  const yo = (a.habla ?? []).filter(([d, h]) => h - d >= 12);
  const el = (otro?.habla ?? []).filter(([d, h]) => h - d >= 12);
  const nP: K<string | Partial<Pose>>[] = [], nM: K<{ x: number; y: number }>[] = [];
  const set = a.enManoD ? GESTOS_IZQ : GESTOS;
  yo.forEach(([d, h], i) => {
    if (libre) {
      const g1 = set[(i * 2 + semilla) % set.length], g2 = set[(i * 2 + semilla + 1) % set.length];
      nP.push({ f: d + 2, v: mas(baseEn(ps, d) as Partial<Pose>, g1) });
      if (h - d > 70) nP.push({ f: d + Math.round((h - d) * 0.5), v: mas(baseEn(ps, d + (h - d) / 2) as Partial<Pose>, g2) });
      nP.push({ f: h + 6, v: baseEn(ps, h + 6) });
    }
    if (mirarLibre) { nM.push({ f: d, v: hacia }); nM.push({ f: h + 20, v: m0 }); }
  });
  el.forEach(([d, h]) => {
    if (libre && !yo.some(([x, y]) => x < h && y > d)) {
      nP.push({ f: d + 14, v: mas(baseEn(ps, d) as Partial<Pose>, { cabeza: 7, tronco: 2 }) });
      nP.push({ f: d + 32, v: baseEn(ps, d + 32) });
      if (h - d > 90) { nP.push({ f: d + Math.round((h - d) * 0.6), v: mas(baseEn(ps, d) as Partial<Pose>, { cabeza: 6 }) }); nP.push({ f: d + Math.round((h - d) * 0.6) + 18, v: baseEn(ps, d) }); }
    }
    if (mirarLibre) { nM.push({ f: d + 4, v: hacia }); nM.push({ f: h + 24, v: m0 }); }
  });
  // VIVO (v9, Ojo 26-oct: «misma pose en los 3 cuadros»): fuera de las frases, cada ~1,6 s cambia de postura y de
  // mirada (cabeza, tronco y una mano), con el ritmo corrido por la semilla: ningún still de la escena repite pose
  const ocupado = (fr: number) => [...yo, ...el].some(([d, h]) => fr > d - 10 && fr < h + 30);
  if (libre) for (let k = 0; k < 24; k++) {
    const fk = 16 + k * 48 + ((semilla * 7) % 13);
    if (ocupado(fk)) continue;
    nP.push({ f: fk, v: mas(baseEn(ps, fk) as Partial<Pose>, VIVO[(k + semilla) % VIVO.length](!!a.enManoD)) });
  }
  if (mirarLibre) for (let k = 0; k < 24; k++) {
    const fk = 30 + k * 48 + ((semilla * 11) % 17);
    if (ocupado(fk)) continue;
    nM.push({ f: fk, v: k % 3 === 1 ? hacia : { x: m0.x + (k % 2 ? 0.35 : -0.3), y: m0.y + (k % 4 === 0 ? 0.25 : -0.1) } });
  }
  if (!nP.length && !nM.length) return a;
  const orden = <T,>(xs: K<T>[]) => xs.sort((x, y) => x.f - y.f).filter((k, i, arr) => i === 0 || k.f > arr[i - 1].f);
  return {
    ...a,
    poses: nP.length ? orden([...ps, ...nP]) : a.poses,
    miradas: nM.length ? orden([{ f: 0, v: m0 }, ...nM]) : a.miradas,
  } as ActorProps;
};

// ENCUADRE SEGURO (v9, Ojo 26-oct: «Leo al 15-25 % en los generales»): todo general (zoom < zmin) que dura más de
// 1,7 s se cambia por un plano medio sobre el protagonista y se queda ahí hasta la próxima clave cerrada. El lado del
// medio (izquierda/centro/derecha del cuadro) cambia según el plano, para que dos medios seguidos no sean idénticos.
type Blanco = (f: number) => { x: number; y: number; z: number };
const seguro = (cam: Clave[], blanco: Blanco | null, zmin = 1.7): Clave[] => {
  if (!blanco || !cam.length) return cam;
  const lado = ((Math.round(Math.abs(cam[0].x) + Math.abs(cam[0].y) + cam.length * 7) % 3) - 1) * 95;
  const out: Clave[] = [];
  let dentro = false;
  cam.forEach((c, i) => {
    if (c.zoom >= zmin) { out.push(c); dentro = false; return; }
    const b = blanco(c.f + 40);
    if (dentro) { out.push(mira(c.f, b.x + lado / b.z, b.y, b.z * 1.04, { curva: "inout" })); return; }
    const dur = (cam[i + 1]?.f ?? Infinity) - c.f;
    // el general se REEMPLAZA por el medio (no se empuja: el empuje a mitad de camino salía movido en el still)
    if (dur > 52) { out.push(mira(c.f, b.x + lado / b.z, b.y, b.z, { ...(c.rot !== undefined ? { rot: c.rot } : {}) })); dentro = true; }
    else out.push(c);
  });
  return out;
};
const xEn = (a: ActorProps | null | undefined, f: number) => (a?.ruta?.length ? posRuta(a.ruta, f).x : undefined);

// Actor con VIVO automático (parábolas, Diógenes, Alejandro, el entrenador): mismo uso que <Actor>, pero entre frases
// cambia de postura y mirada; los que ya traen una coreografía (3+ poses) quedan como están
export const ActorVivo: React.FC<ActorProps> = (p) => {
  const base = p.poses?.length ? p : ({ ...p, poses: [{ f: 0, v: {} }] } as ActorProps);
  const m0 = (base.miradas?.[0]?.v as { x: number; y: number } | undefined) ?? { x: 0, y: 0 };
  const v = actuar(base, null, { x: -m0.x * 0.6 + 0.3, y: m0.y }, (p.seed ?? 0) + 2);
  return <Actor {...(v ?? base)} />;
};

// abrigo gris sobre la mesa: `doblez` 0 (abierto) → 1 (doblado), `boton` muestra el botón nuevo
export const Abrigo: React.FC<{ x: number; y: number; doblez?: number; boton?: boolean }> = ({ x, y, doblez = 0, boton = true }) => {
  const w = 300 - 170 * doblez, h = 16 + 26 * doblez;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} rx={8} fill="#6b6e75" />
      <path d={`M${-w / 2 + 10},${-h + 6} H${w / 2 - 10}`} stroke="#5a5d64" strokeWidth={3} />
      {doblez < 0.5 && <path d={`M${-w / 2},${-h + 4} l-60,10 l8,${h - 4} l52,-4 Z`} fill="#62656c" />}
      {boton && <circle cx={w * 0.18} cy={-h / 2} r={5} fill="#d8cdb4" stroke="#8a7e66" strokeWidth={1.5} />}
    </g>
  );
};

// ---------- el lavadero Spin City ----------
export type LavP = {
  cam: Clave[]; leo?: ActF; tenzo?: ActF; mara?: ActF; extra?: ActF[]; tren?: number; luzFarol?: number; hud?: React.ReactNode;
  medio?: React.ReactNode; frente?: React.ReactNode; seed?: number; mano?: number; abrigo?: number | null; tel?: { bocaAbajo?: boolean; vibra?: number } | null;
};
export const EnLavadero: React.FC<LavP> = ({ cam, leo, tenzo, mara, extra = [], tren = -1, luzFarol = 1, hud, medio, frente, seed = 1, mano = 2.5, abrigo = 0, tel = null }) => {
  const f = useF();
  const P = LAV_PISO;
  const a0 = mk({ look: LEO, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: L.leo, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: 66 }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "neutral" }] }, res(leo, f));
  const t0 = mk({ look: TENZO, escala: ESC, seed: 2, luz: RIM_ORO, ruta: [{ f: 0, x: L.tenzo, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: TENZO_MESA }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.2, y: 0.5 } }] }, res(tenzo, f));
  const a = actuar(a0, t0, { x: 0.9, y: -0.05 }, 0), t = actuar(t0, a0, { x: -0.9, y: -0.08 }, 3);
  const m = res(mara, f);
  const mm = m ? mk({ look: MARA, escala: ESC * 1.1, seed: 5, ruta: [{ f: 0, x: L.leo - 170, y: P - 40 }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], opacidad: () => 0.92, poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 } }] }, m) : null;
  const sentado = (x: ActorProps | null) => !!(x?.asiento as K<number>[] | undefined)?.[0]?.v;
  const blanco: Blanco | null = a || t ? (fr) => {
    const xa = xEn(a, fr), xt = xEn(t, fr);
    if (xa !== undefined && xt !== undefined && Math.abs(xa - xt) < 700) return { x: (xa + xt) / 2 + 40, y: P - 275, z: 1.9 };
    if (xa !== undefined) return { x: xa - 70, y: P - (sentado(a) ? 285 : 330), z: 2.05 };
    return { x: (xt ?? L.tenzo) + 90, y: P - 230, z: 2.05 };
  } : null;
  return (
    <Escena Set={Lavadero} pal={PAL} seed={seed} mano={mano} claves={seguro(cam, blanco)} setProps={{ tren, luzFarol, girando: [3, 7, 12, 22, 31] }}
      medio={<>
        {mm && <Actor {...mm} />}
        {abrigo !== null && <Abrigo x={L.mesa + 90} y={P - 150} doblez={abrigo} />}
        {tel && <TelMesa x={L.mesa + 260} y={P - 150} bocaAbajo={tel.bocaAbajo} vibra={tel.vibra} />}
        {t && <Actor {...t} />}
        {a && <Actor {...a} />}
        {extra.map((e, i) => { const x = res(e, f); return x ? <Actor key={i} {...(x as ActorProps)} /> : null; })}
        {medio}
      </>}
      frente={frente} hud={hud} />
  );
};
export const LAV = { ...L, P: LAV_PISO };

// ---------- el cuarto de Leo (Wilson Avenue) ----------
// la pared detrás de la cama: guirnalda de lucecitas cálidas que titilan, póster, estante con libros y planta, corcho
// con dibujos chiquitos y fotos (que en el plano medio y en el primer plano el fondo cuente quién es Leo)
// ventana de la pared (v9): por ella se ve la hora del cierre — noche con ventanitas de edificios, lluvia que corre por
// el vidrio, o el amanecer que sube — sin ella el `momento` del cuarto no se notaba
const VentanaCuarto: React.FC<{ momento?: Momento }> = ({ momento }) => {
  const f = useF();
  const P = CTO_PISO, X = C.colchon - 400, Y = P - 610, W = 250, H = 250;
  const cielo = momento === "amanecer" ? ["#f3a36a", "#ffd2a0"] : momento === "lluvia" ? ["#2c3a4c", "#46566a"] : ["#0f1626", "#1d2a40"];
  const sol = momento === "amanecer" ? interpolate(f, [0, 240], [H + 30, H * 0.55], { extrapolateRight: "clamp" }) : 0;
  return (
    <g transform={`translate(${X},${Y})`}>
      <defs><clipPath id="vcto"><rect x={0} y={0} width={W} height={H} /></clipPath><linearGradient id={`vcg${momento ?? "n"}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={cielo[0]} /><stop offset="1" stopColor={cielo[1]} /></linearGradient></defs>
      <g clipPath="url(#vcto)">
        <rect x={0} y={0} width={W} height={H} fill={`url(#vcg${momento ?? "n"})`} />
        {momento === "amanecer" && <><circle cx={W * 0.62} cy={sol} r={46} fill="#fff1c9" /><circle cx={W * 0.62} cy={sol} r={80} fill="#ffe2a8" opacity={0.35} /></>}
        {[[0, 150, 70], [78, 110, 60], [146, 170, 54], [204, 130, 60]].map(([x, top, w], i) => (
          <g key={i}>
            <rect x={x} y={top} width={w} height={H - top} fill={momento === "amanecer" ? "#7a5a5e" : "#141a26"} />
            {Array.from({ length: 8 }).map((_, k) => <rect key={k} x={x + 8 + (k % 3) * 18} y={top + 12 + Math.floor(k / 3) * 24} width={9} height={12} fill={ACENTO} opacity={momento === "amanecer" ? 0.25 : ((k + i) % 3 ? 0.75 : 0.2)} />)}
          </g>
        ))}
        {momento === "lluvia" && Array.from({ length: 34 }).map((_, k) => {
          const x0 = (k * 61) % W, y0 = ((f * (9 + (k % 4)) + k * 97) % (H + 60)) - 40;
          return <line key={k} x1={x0} y1={y0} x2={x0 - 6} y2={y0 + 26} stroke="#c9d6e6" strokeWidth={2} opacity={0.55} />;
        })}
        {momento === "lluvia" && Array.from({ length: 6 }).map((_, k) => {
          const x0 = 20 + k * 40, y0 = (f * (0.8 + k * 0.17) + k * 50) % H;
          return <g key={k}><circle cx={x0} cy={y0} r={5} fill="#dbe6f2" opacity={0.7} /><line x1={x0} y1={y0 - 4} x2={x0} y2={Math.max(0, y0 - 40)} stroke="#dbe6f2" strokeWidth={2} opacity={0.35} /></g>;
        })}
      </g>
      <rect x={-10} y={-10} width={W + 20} height={H + 20} fill="none" stroke="#2a2d35" strokeWidth={16} />
      <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#2a2d35" strokeWidth={10} />
      <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#2a2d35" strokeWidth={10} />
      <rect x={-26} y={H + 8} width={W + 52} height={16} rx={4} fill="#3a3f48" />
      {momento === "amanecer" && <path d={`M0,${H + 24} L${-60},${H + 300} L${W + 160},${H + 300} L${W},${H + 24} Z`} fill="#ffc98a" opacity={0.12} />}
    </g>
  );
};
const DecoCuarto: React.FC<{ momento?: Momento }> = ({ momento }) => {
  const f = useF();
  const P = CTO_PISO, X = C.colchon;
  const luces = Array.from({ length: 15 }).map((_, i) => {
    const t = i / 14, x = X - 520 + t * 1040, y = P - 700 + 70 * Math.sin(Math.PI * t);
    return { x, y, o: 0.65 + 0.35 * Math.sin(f / 9 + i * 1.7) };
  });
  return (
    <g>
      <path d={`M${X - 520},${P - 700} Q${X},${P - 560} ${X + 520},${P - 700}`} stroke="#1a1c22" strokeWidth={3} fill="none" />
      {luces.map((l, i) => (
        <g key={i}>
          <circle cx={l.x} cy={l.y + 10} r={34} fill={ACENTO} opacity={0.16 * l.o} />
          <circle cx={l.x} cy={l.y + 10} r={9} fill="#ffc57a" opacity={l.o} />
        </g>
      ))}
      {/* póster: sol ámbar sobre un horizonte (el único color fuerte del cuarto) */}
      <VentanaCuarto momento={momento} />
      <g transform={`translate(${X - 660},${P - 440}) rotate(-2) scale(0.85)`}>
        <rect x={0} y={0} width={230} height={320} fill="#1b1d24" stroke="#3a3f48" strokeWidth={6} />
        <circle cx={115} cy={140} r={62} fill={ACENTO} />
        <rect x={14} y={170} width={202} height={136} fill="#14161b" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={30 + k * 48} y={190 - (k % 2) * 30} width={34} height={120 + (k % 2) * 30} fill="#22252d" />)}
      </g>
      {/* estante con libros y una planta */}
      <g transform={`translate(${X + 150},${P - 470})`}>
        <rect x={0} y={0} width={330} height={14} fill="#5a4634" />
        {[["#7a8a9a", 24, 92], ["#b8483a", 20, 80], ["#cdbfa2", 26, 100], ["#4a5a6a", 18, 76], ["#8a6a4a", 22, 88]].map(([c, w, h], k) => (
          <rect key={k} x={16 + k * 30} y={-(h as number)} width={w as number} height={h as number} fill={c as string} />
        ))}
        <rect x={220} y={-62} width={56} height={62} rx={6} fill="#a8583a" />
        <path d={`M248,-62 q-${30 + 4 * Math.sin(f / 30)},-40 -40,-90 M248,-62 q10,-60 4,-110 M248,-62 q${34 + 4 * Math.sin(f / 26)},-30 52,-80`} stroke="#4a8a5a" strokeWidth={12} strokeLinecap="round" fill="none" />
      </g>
      {/* corcho con dibujos y fotos */}
      <g transform={`translate(${X + 200},${P - 380})`}>
        <rect x={0} y={0} width={280} height={190} rx={6} fill="#8a6a48" />
        {[[18, 16, -4, "#e6e2d8"], [110, 22, 3, "#d8d0b8"], [196, 14, -2, "#e6e2d8"], [40, 104, 2, "#cfd6de"], [150, 100, -3, "#e6e2d8"]].map(([x, y, r, c], k) => (
          <g key={k} transform={`translate(${x},${y}) rotate(${r})`}>
            <rect x={0} y={0} width={70} height={60} fill={c as string} />
            <path d={k % 2 ? "M12,44 Q34,10 58,40" : "M14,40 L34,18 L56,42"} stroke="#3a3a40" strokeWidth={3} fill="none" />
            <circle cx={35} cy={-2} r={5} fill={ACENTO} />
          </g>
        ))}
      </g>
    </g>
  );
};
export type CtoP = { momento?: Momento; cam: Clave[]; leo?: ActF; mara?: ActF; dia?: boolean; luzPuerta?: number; lampara?: boolean; tren?: number; hud?: React.ReactNode; medio?: React.ReactNode; detras?: React.ReactNode; frente?: React.ReactNode; seed?: number; mano?: number };
// el cuarto a otra hora (el cierre no repite la misma luz); se arma UNA vez para que el set no se remonte cada cuadro
const CUARTO_M: Record<Momento, React.FC<any>> = {
  noche: conMomento(Cuarto, "noche", { interior: true, piso: CTO_PISO }),
  lluvia: conMomento(Cuarto, "lluvia", { interior: true, piso: CTO_PISO }),
  amanecer: conMomento(Cuarto, "amanecer", { interior: true, piso: CTO_PISO }),
};
// una pantalla (teléfono, feed, chat) con la CARA de quien la mira en un círculo de la esquina: nunca un teléfono solo
export const ConCara: React.FC<{ caras: ClaveT<string>[]; look?: Look; esquina?: "izq" | "der"; desde?: number; habla?: [number, number][]; children: React.ReactNode }> = ({ caras, look = LEO, esquina = "izq", desde = 0, habla, children }) => (
  <AbsoluteFill>
    {children}
    <AbsoluteFill><svg width={1920} height={1080} viewBox="0 0 1920 1080"><CaraEsquina look={look} pal={PAL} acento={ACENTO} esquina={esquina} desde={desde} caras={caras} habla={habla} id={`cc${esquina}${desde}`} /></svg></AbsoluteFill>
  </AbsoluteFill>
);
export const EnCuarto: React.FC<CtoP> = ({ momento, cam, leo, mara, dia, luzPuerta = 0, lampara = false, tren = -1, hud, medio, detras, frente, seed = 3, mano = 2.5 }) => {
  const f = useF();
  const P = CTO_PISO;
  const a1 = mk({ look: LEO, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: C.colchon, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: COLCHON_ALTO }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "neutral" }] }, res(leo, f));
  const a = a1 ? actuar(a1, null, ((a1.miradas?.[0]?.v as { x: number; y: number }) ?? { x: 0, y: 0 }), 1) : a1;
  const m = res(mara, f);
  const mm = m ? mk({ look: MARA, escala: ESC * 1.1, seed: 5, ruta: [{ f: 0, x: C.colchon - 200, y: P - 30 }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], opacidad: () => 0.9 }, m) : null;
  const sent = !!(a?.asiento as K<number>[] | undefined)?.[0]?.v;
  const blanco: Blanco | null = a ? (fr) => ({ x: (xEn(a, fr) ?? C.colchon) + 40, y: P - (sent ? 245 : 320), z: 1.95 }) : null;
  return (
    <Escena Set={momento ? CUARTO_M[momento] : Cuarto} pal={momento ? palMomento(dia ? PAL_DIA : PAL, momento) : dia ? PAL_DIA : PAL} seed={seed} mano={mano} claves={seguro(cam, blanco)} setProps={{ luzPuerta, lampara, tren }}
      detras={<><DecoCuarto momento={momento} />{detras}</>}
      medio={<>{mm && <Actor {...mm} />}{a && <Actor {...a} />}{medio}</>} frente={frente} hud={hud} />
  );
};
export const CTO = { ...C, P: CTO_PISO, COLCHON_ALTO };

// ---------- Broadway (calle) ----------
export const EnCalle: React.FC<{ cam: Clave[]; leo?: ActF; extra?: ActF[]; dia?: boolean; tren?: number; hud?: React.ReactNode; medio?: React.ReactNode; seed?: number }> = ({ cam, leo, extra = [], dia, tren = -1, hud, medio, seed = 4 }) => {
  const f = useF();
  const a = mk({ look: LEO_CAPUCHA, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: 600, y: BWY_PISO }], caras: [{ f: 0, v: "neutral" }] }, res(leo, f));
  const blanco: Blanco | null = a ? (fr) => ({ x: xEn(a, fr) ?? 600, y: BWY_PISO - 330, z: 1.9 }) : null;
  return (
    <Escena Set={Broadway} pal={dia ? PAL_DIA : PAL} seed={seed} mano={2} claves={seguro(cam, blanco, 1.55)} setProps={{ hora: dia ? "dia" : "noche", tren }}
      medio={<>{a && <Actor {...a} />}{extra.map((e, i) => { const x = res(e, f); return x ? <Actor key={i} {...(x as ActorProps)} /> : null; })}{medio}</>} hud={hud} />
  );
};
export const BWY_P = BWY_PISO;

// ---------- el colectivo 36 (Leo y Maya) ----------
export const EnColectivo: React.FC<{ cam: Clave[]; leo?: ActF; maya?: ActF; hud?: React.ReactNode; medio?: React.ReactNode }> = ({ cam, leo, maya, hud, medio }) => {
  const f = useF();
  const P = COLECTIVO_PISO;
  const a = mk({ look: LEO, escala: ESC, seed: 1, ruta: [{ f: 0, x: COLECTIVO.asientoLeo, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: COLECTIVO.asiento }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.8, y: 0 } }] }, res(leo, f));
  const b = mk({ look: MAYA, escala: ESC, seed: 8, ruta: [{ f: 0, x: COLECTIVO.asientoMaya, y: P }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: COLECTIVO.asiento }], poses: [{ f: 0, v: { ...SENTADO, hD: 60, cD: 100, hI: 55, cI: 105 } }], caras: [{ f: 0, v: "feliz" }] }, res(maya, f));
  return (
    <Escena Set={Colectivo36} pal={PAL_DIA} seed={9} mano={3} claves={cam} setProps={{ dia: true }}
      medio={<>{b && <Actor {...b} />}{a && <Actor {...a} />}{medio}</>} hud={hud} />
  );
};
export const COL = { ...COLECTIVO, P: COLECTIVO_PISO };

// ---------- INSERTO del celular a pantalla completa ----------
// el teléfono derecho al centro, la cámara respira y se acerca; `children` = contenido de la pantalla (div 440x900)
export const PantallaTel: React.FC<{ children?: React.ReactNode; zoom0?: number; zoom1?: number; dur?: number; fondo?: string; mano?: React.ReactNode; luz?: number }> = ({ children, zoom0 = 1, zoom1 = 1.08, dur = 150, fondo = "#0b0c10", mano, luz = 1 }) => {
  const f = useF();
  const z = interpolate(f, [0, dur], [zoom0, zoom1], { extrapolateRight: "clamp" }) * (1 + 0.004 * Math.sin(f / 23));
  const dx = 6 * Math.sin(f / 41), dy = 4 * Math.sin(f / 37 + 1);
  return (
    <AbsoluteFill style={{ background: fondo, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 220, top: 540 - 450, width: 440, height: 900, transform: `scale(${2.4 * z})`, transformOrigin: "50% 50%", filter: "blur(28px) brightness(0.45) saturate(1.2)", overflow: "hidden" }}>{children}</div>
      <div style={{ position: "absolute", left: 960 - 700, top: 540 - 700, width: 1400, height: 1400, borderRadius: "50%", background: `radial-gradient(circle, ${ACENTO}${Math.round(40 * luz).toString(16).padStart(2, "0")} 0%, transparent 60%)` }} />
      <div style={{ position: "absolute", left: 960 - 250, top: 540 - 500, width: 500, height: 1000, transform: `translate(${dx}px,${dy}px) scale(${z})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 56, background: "#121218", border: "6px solid #34343e" }} />
        <div style={{ position: "absolute", left: 24, top: 40, width: 440, height: 900, borderRadius: 30, overflow: "hidden", background: "#17171d" }}>{children}</div>
        <div style={{ position: "absolute", left: 200, top: 16, width: 100, height: 14, borderRadius: 7, background: "#060608" }} />
        {mano}
      </div>
    </AbsoluteFill>
  );
};

// burbuja de chat; `yo` = Leo (derecha, gris claro), si no = otra persona (izquierda, ámbar). Aparece con resorte en `desde`
export const Burbuja: React.FC<{ texto: string; desde: number; yo?: boolean; y: number; escribe?: number; visto?: boolean }> = ({ texto, desde, yo, y, escribe, visto }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 160 } });
  const n = escribe ? Math.min(texto.length, Math.floor((f - desde) / escribe)) : texto.length;
  return (
    <div style={{ position: "absolute", top: y, [yo ? "right" : "left"]: 22, maxWidth: 330, transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: yo ? "100% 100%" : "0% 100%", opacity: s }}>
      <div style={{ padding: "16px 22px", borderRadius: 26, background: yo ? "#e8e4dc" : ACENTO, color: yo ? "#1a1a20" : "#fff", fontFamily: F_HUD, fontWeight: 500, fontSize: 36, lineHeight: 1.22 }}>
        {texto.slice(0, n)}{escribe && n < texto.length ? <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0.2 }}>|</span> : null}
      </div>
      {visto && <div style={{ textAlign: yo ? "right" : "left", fontFamily: F_HUD, fontSize: 20, color: "#8a8a94", marginTop: 6 }}>Seen</div>}
    </div>
  );
};
// cabecera del chat
export const CabeceraChat: React.FC<{ nombre: string; color?: string }> = ({ nombre, color = "#3f9a6a" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "#202028", display: "flex", alignItems: "center", paddingLeft: 26, gap: 18 }}>
    <div style={{ width: 62, height: 62, borderRadius: 31, background: color, color: "#fff", fontFamily: F_HUD, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{nombre[0]}</div>
    <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 34, color: "#ece8df" }}>{nombre}</div>
  </div>
);
// el cuadro de escritura de abajo, con el cursor que parpadea
export const CajaEscribir: React.FC<{ texto?: string; desde?: number; vel?: number }> = ({ texto = "", desde = 0, vel = 3 }) => {
  const f = useF();
  const n = Math.max(0, Math.min(texto.length, Math.floor((f - desde) / vel)));
  return (
    <div style={{ position: "absolute", left: 18, right: 18, bottom: 22, minHeight: 74, borderRadius: 37, background: "#26262e", padding: "18px 26px", fontFamily: F_HUD, fontSize: 28, color: "#e8e4dc" }}>
      {texto.slice(0, n)}<span style={{ opacity: Math.floor(f / 15) % 2 ? 1 : 0, color: ACENTO }}>|</span>
    </div>
  );
};
// pulgar que entra desde abajo y toca la pantalla en `toca`
export const Pulgar: React.FC<{ toca: number; x?: number; y?: number; piel?: string }> = ({ toca, x = 300, y = 560, piel = "#ecc9a3" }) => {
  const f = useF();
  const u = interpolate(f, [toca - 40, toca - 4, toca, toca + 10, toca + 40], [1, 0.08, 0, 0.05, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x - 70, top: y + u * 600, width: 140, height: 640, transform: `rotate(-14deg)`, transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "70px 70px 40px 40px", background: piel, boxShadow: "inset -14px 0 0 rgba(0,0,0,0.10)" }} />
      <div style={{ position: "absolute", left: 26, top: 22, width: 88, height: 96, borderRadius: "44px 44px 30px 30px", background: "#f6ddc0", opacity: 0.85 }} />
      {f >= toca && f < toca + 14 && <div style={{ position: "absolute", left: 30, top: -30, width: 80, height: 80, borderRadius: 40, border: `4px solid ${ACENTO}`, opacity: 1 - (f - toca) / 14 }} />}
    </div>
  );
};

// un "rostro hecho de luz": óvalo ámbar sin rasgos explícitos, con dos brillos (el anzuelo)
export const RostroLuz: React.FC = () => {
  const f = useF();
  const p = 0.85 + 0.15 * Math.sin(f / 9);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#1b1016" }}>
      <div style={{ position: "absolute", left: 70, top: 160, width: 300, height: 400, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, #ffe0c6 0%, ${ACENTO} 45%, transparent 72%)`, opacity: p }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 4, background: "#3a2a30" }} />
      {["♥ 12.4K", "↻ 908", "✉"].map((t, i) => <div key={i} style={{ position: "absolute", right: 24, top: 420 + i * 70, fontFamily: F_HUD, fontSize: 26, color: "#ffd9c2", opacity: 0.8 }}>{t}</div>)}
    </div>
  );
};

// letrero chico recto a pie de inserto (hora, lugar)
export const Hora: React.FC<{ texto: string; desde?: number; x?: number; y?: number }> = ({ texto, desde = 0, x = 1640, y = 56 }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", right: 1920 - x - 200, top: y, opacity: o, fontFamily: F_HUD, fontWeight: 500, fontSize: 38, letterSpacing: 2, color: "#e9e3d6", textShadow: "0 2px 0 rgba(0,0,0,0.4), 0 0 18px rgba(0,0,0,0.55)" }}>{texto}</div>;
};

// fundido a negro dentro de un plano (para el farol que se apaga)
export const Negro: React.FC<{ desde: number; d?: number }> = ({ desde, d = 30 }) => {
  const f = useF();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [desde, desde + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />;
};

// tarjeta final: el próximo episodio (título y la frase de despedida de Tenzo), limpia y recta
export const TarjetaFinal: React.FC<{ proximo: string; frase: string }> = ({ proximo, frase }) => {
  const f = useF();
  const o = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  // movimiento continuo y suave en todo el cierre (empuje lento + chispas que suben): nunca un cuadro igual al anterior
  const z = 1 + 0.045 * (f / 240);
  return (
    <AbsoluteFill style={{ background: "#0b0c10", alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 30%" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <FarolSolo f={f} />
          {Array.from({ length: 26 }).map((_, i) => {
            const r = (i * 7919) % 1000 / 1000, v = 0.6 + ((i * 131) % 100) / 100;
            const y = 1100 - ((f * v * 1.6 + r * 1200) % 1200), x = 160 + r * 1600 + 30 * Math.sin(f / 40 + i);
            return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill={i % 4 ? ORO : ACENTO} opacity={0.25 + 0.3 * Math.sin(f / 17 + i * 2)} />;
          })}
        </svg>
      </AbsoluteFill>
      <div style={{ opacity: o, textAlign: "center", fontFamily: F_HUD, transform: `translateY(${-6 * (f / 240)}px)` }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#9a958c", marginBottom: 18 }}>TOMORROW NIGHT</div>
        <div style={{ fontSize: 74, fontWeight: 600, color: "#f4efe6", marginBottom: 34 }}>{proximo}</div>
        <div style={{ fontSize: 34, color: ORO }}>{frase}</div>
      </div>
      <div style={{ position: "absolute", right: 64, bottom: 44, fontFamily: F_HUD, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "#efe8da", opacity: 0.85 }}>Tenzo Films</div>
    </AbsoluteFill>
  );
};
const FarolSolo: React.FC<{ f: number }> = ({ f }) => (
  <g transform="translate(960,200)">
    <Halo x={0} y={0} r={260 + 14 * Math.sin(f / 23)} color={ORO} fuerza={0.36 + 0.08 * Math.sin(f / 7) + 0.05 * Math.sin(f / 3.1)} />
    <g transform={`translate(0,40) rotate(${2.2 * Math.sin(f / 34)}) scale(0.9)`}><FarolMano /></g>
  </g>
);

// ---------- recuerdo / inserto gris: torres de vidrio con miles de ventanitas ámbar (la soga fabricada) ----------
export const Torres: React.FC = () => {
  const f = useF();
  const z = 1 + f * 0.0007;
  const T = [[120, 260, 300], [460, 120, 340], [840, 60, 280], [1160, 180, 320], [1520, 100, 300]];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#151922, #2a303b)" }}>
      <svg width={1920} height={1080} style={{ transform: `scale(${z})`, transformOrigin: "50% 80%" }}>
        {T.map(([x, top, w], i) => (
          <g key={i}>
            <rect x={x} y={top} width={w} height={1080 - top} fill={["#2b313b", "#323946", "#272d36", "#353c49", "#2d333e"][i]} />
            {Array.from({ length: Math.floor((1080 - top) / 36) * Math.floor(w / 34) }).map((_, k) => {
              const cols = Math.floor(w / 34);
              const cx = x + 12 + (k % cols) * 34, cy = top + 18 + Math.floor(k / cols) * 36;
              const on = ((k * 7919 + i * 131) % 11) < 6;
              const tit = on && ((k + Math.floor(f / 20)) % 23 === 0);
              return <rect key={k} x={cx} y={cy} width={16} height={20} rx={2} fill={on ? ACENTO : "#1c2028"} opacity={on ? (tit ? 0.45 : 0.85) : 1} />;
            })}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// marco de RECUERDO (gris, con un borde de papel); el contenido es una Escena chica
export const Recuerdo: React.FC<{ children: React.ReactNode; desde?: number }> = ({ children, desde = 0 }) => {
  const f = useF();
  const s = interpolate(f, [desde, desde + 16], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(f, [desde, desde + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 960 - 520, top: 540 - 300, width: 1040, height: 600, opacity: o, transform: `scale(${s}) rotate(0deg)`, borderRadius: 18, overflow: "hidden", border: "10px solid #e8e2d4", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
      <div style={{ position: "absolute", left: -440, top: -240, width: 1920, height: 1080, transform: "scale(0.55)", transformOrigin: "50% 50%" }}>{children}</div>
    </div>
  );
};

export type { Look };

// ---------- texto en pantalla RECTO y LIMPIO (Ojo del Director 26-oct: la letra a mano no se leía) ----------
// Reemplaza a ManoLeo / ManoMara / TextoMano en tz05 y tz07: Fredoka recta sobre una pastilla oscura, palabra por palabra,
// siempre dentro del cuadro (se acomoda sola si x deja la frase afuera). Misma firma que los de hud.tsx para cambiar sólo el import.
type VozP = { texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; vel?: number; centro?: boolean; color?: string; rot?: number; brillo?: boolean };
const VozLimpia: React.FC<VozP & { tinta: string; borde: string }> = ({ texto, x, y, desde, hasta, tam = 64, vel = 1.5, centro, tinta, borde }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const pal = texto.split(" ");
  const n = (f - desde) * (vel / 5) + 1; // ~1 palabra cada 3 cuadros
  const o = (hasta !== undefined ? interpolate(f, [hasta - 8, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1) * interpolate(f, [desde, desde + 5], [0, 1], { extrapolateRight: "clamp" });
  const t = Math.max(48, Math.min(66, tam * 0.82));
  const ancho = texto.length * t * 0.5 + 64; // ancho aproximado de la pastilla
  // FRANJA SEGURA (v9, Ojo 26-oct: los subtítulos pisaban la planta, el tablero y los pies de Leo): siempre arriba y
  // centrados, debajo del HUD; dos frases a la vez se apilan (la que venía de la mitad de abajo va al 2º renglón)
  void x; void centro;
  const cx = Math.max(ancho / 2 + 40, Math.min(1880 - ancho / 2, 960));
  const top = y < 540 ? 112 : 112 + t * 1.15 + 34;
  return (
    <div style={{ position: "absolute", left: cx, top, transform: "translateX(-50%)", opacity: o, whiteSpace: "nowrap", background: "rgba(12,10,10,0.78)", border: `2px solid ${borde}`, borderRadius: 16, padding: "8px 30px 12px", fontFamily: F_HUD, fontWeight: 600, fontSize: t, lineHeight: 1.15, color: tinta, letterSpacing: 0.5, boxShadow: "0 6px 24px rgba(0,0,0,0.45)" }}>
      {pal.map((w, i) => <span key={i} style={{ opacity: Math.max(0, Math.min(1, n - i)) }}>{w}{i < pal.length - 1 ? " " : ""}</span>)}
    </div>
  );
};
export const ManoLeo: React.FC<VozP> = (p) => <VozLimpia {...p} tinta="#f4efe4" borde="rgba(244,239,228,0.25)" />;
export const ManoMara: React.FC<VozP> = (p) => <VozLimpia {...p} tinta={ACENTO} borde={`${ACENTO}88`} />;
export const TextoMano: React.FC<VozP> = (p) => <VozLimpia {...p} tinta={p.color ?? "#f4efe4"} borde="rgba(244,239,228,0.25)" />;

// ---------- cámaras tipo para cortar las charlas (campo / contracampo / dos / inserto), con empuje lento de 6 % ----------
const lento = (X: number, Y: number, z: number, s: number, extra: Partial<Clave> = {}): Clave[] => [mira(0, X, Y, z, extra), mira(Math.round(s * 30), X, Y, z * 1.06, { ...extra, curva: "inout" })];
export const CAM = {
  leo: (s: number, z = 2.2) => lento(L.leo - 70, LAV_PISO - 285, z, s),
  tenzo: (s: number, z = 2.2) => lento(L.tenzo + 90, LAV_PISO - 220, z, s),
  dos: (s: number, z = 1.8) => lento(1450, LAV_PISO - 275, z, s),
  mesa: (s: number) => lento(L.tenzo - 110, LAV_PISO - 150, 3.2, s),
  // por detrás del hombro de Leo: Leo grande y desenfocado a la izquierda, Tenzo al fondo
  hombroLeo: (s: number) => lento(L.leo + 380, LAV_PISO - 300, 1.9, s),
  mara: (s: number) => lento(L.leo - 160, LAV_PISO - 430, 1.5, s, { rot: -2 }),
  // cuarto: Leo en la cama, plano medio y primer plano
  cama: (s: number, z = 1.7) => lento(C.colchon + 40, CTO_PISO - 240, z, s),
  camaPP: (s: number) => lento(C.colchon + 30, CTO_PISO - 270, 2.4, s),
};

// aguja con hilo en la mano de Tenzo (para que se vea que COSE): el hilo ondea
export const Aguja: React.FC = () => {
  const f = useF();
  return (
    <g>
      <line x1={0} y1={0} x2={30} y2={-22} stroke="#e8ecf0" strokeWidth={3} strokeLinecap="round" />
      <path d={`M30,-22 q${20 + 6 * Math.sin(f / 5)},${30} ${-6},${70 + 8 * Math.sin(f / 7)}`} stroke="#f4efe4" strokeWidth={1.8} fill="none" opacity={0.85} />
    </g>
  );
};

// fachada de un edificio de vidrio para los reels de Tyler (en coordenadas del teléfono 440x900): torre con grilla de
// ventanas que reflejan el cielo, una palmera y la vereda — en vez de barras lisas
export const EdificioVidrio: React.FC = () => {
  const f = useF();
  return (
    <g>
      <rect x={40} y={40} width={360} height={520} fill="#6f8fb4" />
      {Array.from({ length: 13 }).map((_, r) => Array.from({ length: 6 }).map((__, c) => (
        <rect key={`${r}-${c}`} x={52 + c * 58} y={52 + r * 39} width={50} height={31} fill={(r * 3 + c) % 5 === 0 ? "#dfeaf4" : "#9ab6d4"} opacity={0.75 + 0.2 * Math.sin((f + r * 9 + c * 13) / 40)} />
      )))}
      <path d="M40,40 L400,40 L400,70 L40,70 Z" fill="#4e6a8a" />
      <path d="M40,560 L400,560 L400,600 L40,600 Z" fill="#3a4a5a" />
      <g transform="translate(380,610)">
        <path d="M0,0 Q8,-120 -6,-230" stroke="#6a4a2a" strokeWidth={10} fill="none" />
        <path d="M-6,-230 q-60,8 -84,56 M-6,-230 q60,0 84,46 M-6,-230 q-16,-46 -70,-60 M-6,-230 q24,-46 76,-54" stroke="#3a8a4a" strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
      <rect x={0} y={600} width={440} height={300} fill="#c9ccd2" />
    </g>
  );
};
