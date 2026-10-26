import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd, clamp } from "../soot/lib";
import { C, ent, prog, fontFamily, Estrellas, Particulas } from "./kit";
import { Persona, Ropa, Expr } from "./persona";
import { Mesa } from "./kit";
import {
  V, T, Pie, DefsLadrillo, Humo, CasaObrera, Farol, Adoquines, FachadaFabrica, Chimenea, MaquinaVapor, EjeTecho, Engranaje, Mula,
  Cardadora, Pelusa, Cisterna, tramos,
} from "./kit3";

// Mundo único de soot08: un solo pueblo fabril de Lancashire en coordenadas de mundo (piso de la calle = y 0).
// La cámara (x, y = punto del mundo en el centro de la pantalla, z = zoom) viaja por él: calle → fábrica en corte
// (la fachada se desvanece y queda la casa de muñecas de 3 pisos) → casa → comité → ruta del algodón → plaza.
export type Cam = { x: number; y: number; z: number };
export type K = [number, number, number, number]; // [t, x, y, z]
// cámara por tramos: x/y con ease in-out; el zoom en escala logarítmica (los acercamientos se sienten parejos)
export const camara = (t: number, ks: K[], ease = Easing.inOut(Easing.cubic)): Cam => ({
  x: tramos(t, ks.map((k) => [k[0], k[1]] as [number, number]), ease),
  y: tramos(t, ks.map((k) => [k[0], k[2]] as [number, number]), ease),
  z: Math.exp(tramos(t, ks.map((k) => [k[0], Math.log(k[3])] as [number, number]), ease)),
});
// pone el mundo bajo la cámara; `para` = paralaje (capas lejanas < 1)
export const Espacio: React.FC<{ cam: Cam; para?: number; children: React.ReactNode }> = ({ cam, para = 1, children }) => {
  const z = 1 + (cam.z - 1) * para;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: `translate(${960 - cam.x * para * z}px, ${540 - cam.y * para * z}px) scale(${z})` }}>{children}</div>
    </AbsoluteFill>
  );
};
// a qué punto de pantalla cae un punto del mundo (para colgar chapitas de objetos del mundo)
export const aPantalla = (cam: Cam, x: number, y: number) => ({ x: 960 + (x - cam.x) * cam.z, y: 540 + (y - cam.y) * cam.z });

// ── vestuario victoriano
export const NINO: Ropa = { tunica: "#5b7bb5", tunica2: "#36507f", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d9997a", pelo: "#7a4a22" };
export const NINA: Ropa = { tunica: "#c9673f", tunica2: "#8c4021", cinto: "#5a3418", piel: "#f5c7a0", piel2: "#dc9d78", pelo: "#a0602c" };
export const CAPATAZ: Ropa = { tunica: "#3f5a3a", tunica2: "#24361f", cinto: "#1d1410", piel: "#e0a07a", piel2: "#b8785a", pelo: "#2b1c14" };
export const DUENO: Ropa = { tunica: "#2a2238", tunica2: "#140f1d", cinto: "#7a2f3a", piel: "#f2c8a8", piel2: "#d9a080", pelo: "#5a4a3a" };
export const HILANDERO: Ropa = { tunica: "#e8dcc0", tunica2: "#b9a682", cinto: "#5a3418", piel: "#d99872", piel2: "#b06f4e", pelo: "#3b2416" };
export const OBRERO = (i: number): Ropa => {
  const t = [["#6b7a99", "#46526b"], ["#8a6a4a", "#5e4630"], ["#7a5bd1", "#4c349a"], ["#5c8f3e", "#3a6224"], ["#b05a5a", "#7a3434"], ["#4f8a8b", "#2f5f60"]][i % 6];
  const p = [["#f2b48a", "#d98d66"], ["#c98b62", "#a2643f"], ["#f5c7a0", "#dc9d78"], ["#e8a882", "#c47e5c"]][i % 4];
  return { tunica: t[0], tunica2: t[1], cinto: "#3a2414", piel: p[0], piel2: p[1], pelo: ["#4a2a17", "#1d1410", "#7a4a22", "#a0602c", "#2b1c14"][(i * 3) % 5] };
};

// ── cielo de pantalla que va de noche a amanecer a día (0 noche, 1 amanecer, 2 día gris de humo)
const mezcla = (a: string, b: string, u: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * u)).join(",")})`;
};
const CIE = [
  ["#0e0a2a", "#1b1240", "#2d1b69", "#4a2f8f"],
  ["#2d1b69", "#7a2f8f", "#e2557a", "#ff9a4d"],
  ["#6b6a8a", "#8a86a3", "#b3aec0", "#d8cfc8"],
];
export const CieloHora: React.FC<{ t: number; luz: number }> = ({ t, luz }) => {
  const i = clamp(Math.floor(luz), 0, 1), u = clamp(luz - i, 0, 1);
  const c = CIE[i].map((col, k) => mezcla(col, CIE[i + 1][k], u));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c[0]} 0%, ${c[1]} 40%, ${c[2]} 75%, ${c[3]} 100%)` }}>
      {luz < 0.9 && <div style={{ position: "absolute", inset: 0, opacity: 1 - luz }}><Estrellas t={t} n={80} seed={8} alto={700} /></div>}
    </AbsoluteFill>
  );
};

// ── horizonte lejano: chimeneas y galpones del resto del pueblo (va en un Espacio con paralaje 0,35)
export const Horizonte: React.FC<{ t: number; humo?: number; color?: string }> = ({ t, humo = 1, color = "#2a1f45" }) => {
  const r = rnd(77);
  const xs = Array.from({ length: 26 }, (_, i) => ({ x: -6000 + i * 560 + r() * 200, h: 700 + r() * 900, w: 500 + r() * 400, ch: r() < 0.75 }));
  return (
    <>
      {xs.map((b, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: b.x, top: -b.h * 0.55, width: b.w, height: b.h, background: color }} />
          {b.ch && <div style={{ position: "absolute", left: b.x + b.w * 0.7, top: -b.h * 0.55 - 900, width: 70, height: 900, background: color }} />}
          {b.ch && humo > 0 && <div style={{ opacity: humo }}><Humo t={t + i} x={b.x + b.w * 0.7 + 35} y={-b.h * 0.55 - 900} n={6} s={0.7} color="#3e3358" /></div>}
          {Array.from({ length: 3 }, (_, k) => <div key={k} style={{ position: "absolute", left: b.x + 60 + k * (b.w / 3.2), top: -b.h * 0.55 + 120, width: 60, height: 90, borderRadius: 30, background: V.luz, opacity: 0.25 * (i % 3 ? 1 : 0.4) }} />)}
        </React.Fragment>
      ))}
    </>
  );
};

// ── LA FÁBRICA por dentro (casa de muñecas): x 600..6600, pisos de 1000 (y 0, -1000, -2000), techo en -3000
export const FX0 = 600, FX1 = 6600, FCX = 3600;
export type GenteFab = { x: number; y: number; h?: number; ropa?: Ropa; expr?: Expr; camina?: number; flip?: boolean; seed: number; gorro?: "gorra" | "copa" | "cofia"; largo?: boolean; bI?: number; bD?: number; cI?: number; cD?: number; manoD?: React.ReactNode; manoI?: React.ReactNode; habla?: boolean; inclina?: number; delantal?: string; descalzo?: boolean; mira?: number; miraY?: number; aparece?: number; salta?: number; opacity?: number; viejo?: boolean; barba?: boolean; ladea?: number };
export const Gente: React.FC<{ t: number; g: GenteFab[] }> = ({ t, g }) => <>{g.map((p) => <Persona key={p.seed} t={t} h={p.h ?? 300} {...p} />)}</>;

const Piso: React.FC<{ y: number; x0?: number; x1?: number }> = ({ y, x0 = FX0, x1 = FX1 }) => (
  <svg style={{ position: "absolute", left: x0, top: y - 10, overflow: "visible" }} width={x1 - x0} height={70}>
    <rect width={x1 - x0} height={70} fill={V.piso2} />
    <rect width={x1 - x0} height={22} fill={V.piso} />
    {Array.from({ length: Math.floor((x1 - x0) / 160) }, (_, i) => <line key={i} x1={i * 160} y1={0} x2={i * 160} y2={22} stroke={V.piso2} strokeWidth={4} />)}
  </svg>
);
const ParedFab: React.FC<{ y0: number; y1: number; tono?: string; t: number }> = ({ y0, y1, tono = V.pared, t }) => (
  <>
    <div style={{ position: "absolute", left: FX0, top: y0, width: FX1 - FX0, height: y1 - y0, background: `linear-gradient(180deg, ${tono}, ${V.pared2})` }} />
    {Array.from({ length: 14 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: FX0 + 200 + i * 430, top: y0 + 130, width: 150, height: 420, borderRadius: 75, background: "#bfe0f2", opacity: 0.55, boxShadow: "inset 0 0 0 12px #c9a274" }} />
    ))}
    {/* rayos de luz por las ventanas */}
    {Array.from({ length: 14 }, (_, i) => <div key={`r${i}`} style={{ position: "absolute", left: FX0 + 200 + i * 430, top: y0 + 300, width: 300, height: y1 - y0 - 300, background: "linear-gradient(170deg, rgba(255,240,200,.18), transparent)", transform: "skewX(18deg)", opacity: 0.6 + 0.2 * Math.sin(t + i) }} />)}
  </>
);
export type EstadoFab = {
  mulaU?: (t: number) => number; corta?: number[]; calor?: number; polvo?: number; vaporVel?: number; luces?: number; muro?: boolean;
  gente?: GenteFab[]; gente1?: GenteFab[]; gente2?: GenteFab[]; vallas?: number; detenida?: boolean; cartel?: string;
};
export const mulaVaiven = (t: number, per = 4.4) => { const k = (t % per) / per; return k < 0.55 ? Easing.inOut(Easing.sin)(k / 0.55) : 1 - Easing.inOut(Easing.cubic)((k - 0.55) / 0.45); };
export const FabricaAdentro: React.FC<{ t: number; e?: EstadoFab }> = ({ t, e = {} }) => {
  const u = e.detenida ? 0 : (e.mulaU ?? mulaVaiven)(t);
  const vel = e.detenida ? 0 : e.vaporVel ?? 1;
  const tm = e.detenida ? 0 : t;
  return (
    <>
      {/* piso 0: sala de máquinas + hilandería */}
      <ParedFab y0={-1000} y1={0} t={t} />
      <ParedFab y0={-2000} y1={-1000} t={t} tono="#e3c49c" />
      <ParedFab y0={-3000} y1={-2000} t={t} tono="#dcc0a0" />
      <div style={{ position: "absolute", left: FX0, top: -1000, width: 1300, height: 1000, background: "linear-gradient(180deg, #8a7a9a, #5d506e)" }} />
      <MaquinaVapor t={tm} x={1250} y={0} s={0.95} vel={vel} />
      {/* correa vertical que sube del volante a los ejes de cada piso */}
      <svg style={{ position: "absolute", left: 1460, top: -2960, overflow: "visible" }} width={120} height={2560}>
        {[0, 70].map((dx, i) => <line key={i} x1={dx + 20} y1={0} x2={dx + 20} y2={2560} stroke="#6b3a1f" strokeWidth={22} strokeDasharray="34 20" strokeDashoffset={(i ? 1 : -1) * tm * 320} />)}
      </svg>
      <EjeTecho t={tm} x={FX0 + 900} y={-960} w={FX1 - FX0 - 950} poleas={[1200, 2400, 3600, 4700]} bajan={330} />
      <Mula t={tm} u={u} x={3300} y={0} s={1} corta={e.corta} />
      <Mula t={tm + 1.3} u={e.detenida ? 0 : (e.mulaU ?? mulaVaiven)(t + 1.3)} x={5550} y={0} s={0.82} />
      {/* piso 1: cardas, termómetro, oficina, tienda */}
      <EjeTecho t={tm} x={FX0 + 900} y={-1960} w={FX1 - FX0 - 950} poleas={[500, 1600, 3100]} bajan={300} />
      <Cardadora t={tm} x={1300} y={-1000} s={0.75} />
      <Cardadora t={tm + 0.4} x={2450} y={-1000} s={0.75} />
      {/* oficina del capataz: escritorio + cartel colgado */}
      <div style={{ position: "absolute", left: 3500, top: -2000, width: 1700, height: 1000, background: "linear-gradient(180deg, #c9a87e, #a8865c)" }} />
      <div style={{ position: "absolute", left: 3500, top: -2000, width: 30, height: 1000, background: V.madera2 }} />
      <div style={{ position: "absolute", left: 3900, top: -1820, width: 760, height: 520, background: "#fbf3dc", border: `10px double ${T}`, boxShadow: "10px 12px 0 rgba(20,8,40,.3)" }}>
        <div style={{ textAlign: "center", fontFamily, fontWeight: 700, fontSize: 56, color: T, marginTop: 14, letterSpacing: 4 }}>{e.cartel ?? "FINES"}</div>
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ margin: "18px 40px 0", height: 16, borderRadius: 8, background: "#c9b48a", width: `${60 + ((i * 37) % 30)}%` }} />)}
      </div>
      <Mesa x={4400} y={-1250} w={560} />
      {/* tienda de la empresa */}
      <div style={{ position: "absolute", left: 5200, top: -2000, width: 1400, height: 1000, background: "linear-gradient(180deg, #a8c48a, #7a9a62)" }} />
      <div style={{ position: "absolute", left: 5300, top: -1880, width: 1200, height: 120, background: C.rojo, borderRadius: 12, fontFamily, fontWeight: 700, fontSize: 80, color: "#fff", textAlign: "center", lineHeight: "120px", letterSpacing: 6 }}>COMPANY SHOP</div>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 5340, top: -1700 + k * 150, width: 1120, height: 20, background: V.madera2 }} />)}
      {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 5370 + (i % 6) * 185, top: -1790 + Math.floor(i / 6) * 150, width: 120, height: 90, borderRadius: 14, background: ["#e9a92a", "#d9643a", "#f2e6c8", "#8a5a2c", "#c9673f", "#fff6dc"][i % 6] }} />)}
      <div style={{ position: "absolute", left: 5300, top: -1260, width: 1200, height: 260, background: V.madera, borderTop: `24px solid ${V.madera2}` }} />
      {/* piso 2: ejes, engranajes, hileras de husos (throstles) y la cisterna */}
      <EjeTecho t={tm} x={FX0 + 900} y={-2960} w={FX1 - FX0 - 950} poleas={[700, 1900, 3300, 4600]} bajan={420} vel={1.2} />
      <Engranaje t={tm} x={2200} y={-2300} r={260} dientes={18} vel={0.8} />
      <Engranaje t={tm} x={2635} y={-2420} r={170} dientes={12} vel={-1.25} fase={8} color="#5d5670" />
      <Engranaje t={tm} x={3000} y={-2200} r={120} dientes={9} vel={1.8} />
      {[3600, 4700].map((hx, i) => (
        <Pie key={hx} x={hx} y={-2000} w={900} h={560}>
          <rect x={-430} y={-420} width={860} height={420} rx={14} fill={V.madera} />
          {Array.from({ length: 12 }, (_, k) => <g key={k}><rect x={-400 + k * 70} y={-520} width={14} height={110} fill={V.acero} /><ellipse cx={-393 + k * 70} cy={-470} rx={22} ry={40} fill={V.algodon} transform={`rotate(${Math.sin(tm * 30 + k) * 4} ${-393 + k * 70} -470)`} /></g>)}
          <rect x={-430} y={-300} width={860} height={30} fill={V.madera2} />
        </Pie>
      ))}
      <Cisterna t={t} x={5900} y={-2000} s={1} />
      {e.vallas !== undefined && e.vallas > 0 && (
        <svg style={{ position: "absolute", left: 1850, top: -2700 - (1 - e.vallas) * 900, overflow: "visible" }} width={1400} height={700}>
          <rect x={0} y={60} width={1400} height={24} rx={12} fill={C.oro} />
          <rect x={0} y={360} width={1400} height={24} rx={12} fill={C.oro} />
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 196} y={40} width={22} height={660} fill="#d99a1e" />)}
          {Array.from({ length: 36 }, (_, i) => <line key={`m${i}`} x1={i * 40} y1={84} x2={i * 40 + 40} y2={360} stroke="#c8ccd4" strokeWidth={5} opacity={0.6} />)}
        </svg>
      )}
      <Piso y={0} /><Piso y={-1000} /><Piso y={-2000} />
      {/* techo */}
      <div style={{ position: "absolute", left: FX0 - 60, top: -3060, width: FX1 - FX0 + 120, height: 70, background: "#3b2a4a" }} />
      {/* muros laterales del corte (ladrillo) */}
      {[FX0 - 60, FX1].map((x) => <div key={x} style={{ position: "absolute", left: x, top: -3000, width: 60, height: 3000, background: V.ladrillo2 }} />)}
      {/* aire: calor y pelusa */}
      {(e.calor ?? 0) > 0 && (
        <svg style={{ position: "absolute", left: FX0, top: -1000, pointerEvents: "none" }} width={FX1 - FX0} height={1000}>
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={Array.from({ length: 40 }, (_, k) => `${k ? "L" : "M"} ${k * 160} ${110 + i * 100 + Math.sin(k * 0.9 + t * 4 + i) * 16}`).join(" ")} stroke="#fff3c4" strokeWidth={8} fill="none" opacity={(e.calor ?? 0) * 0.35 * (1 - i / 10)} />)}
          <rect width={FX1 - FX0} height={1000} fill="#ff7a3d" opacity={(e.calor ?? 0) * 0.12} />
        </svg>
      )}
      <Pelusa t={t} x={FX0} y={-1000} w={FX1 - FX0} h={1000} n={70} seed={3} dens={0.6} />
      <Pelusa t={t} x={FX0} y={-2000} w={3000} h={1000} n={110} seed={4} dens={e.polvo ?? 0.7} />
      {e.gente && <Gente t={t} g={e.gente} />}
      {e.gente1 && <Gente t={t} g={e.gente1} />}
      {e.gente2 && <Gente t={t} g={e.gente2} />}
      {(e.luces ?? 1) < 1 && <div style={{ position: "absolute", left: FX0 - 60, top: -3060, width: FX1 - FX0 + 120, height: 3060, background: "#0e0a2a", opacity: 1 - (e.luces ?? 1) }} />}
    </>
  );
};

// ── EL PUEBLO (exterior): hilera de casas obreras x -3200..-200, faroles, adoquines, la fábrica y su chimenea
export const CASA_NINO = -1110; // centro de la casa del protagonista (la 6ª)
export type EstadoPueblo = {
  abre?: number; hora: number; tCampana?: number; porton?: number; luz?: number; gente?: GenteFab[]; humo?: number; luzCasa?: number; nieve?: number; sinFabrica?: boolean;
};
export const Pueblo: React.FC<{ t: number; e: EstadoPueblo; adentro?: EstadoFab }> = ({ t, e, adentro }) => {
  const abre = e.abre ?? 0;
  return (
    <>
      {/* vereda y calle */}
      <Adoquines x={-4600} y={0} w={13000} h={900} />
      <div style={{ position: "absolute", left: -4600, top: -20, width: 13000, height: 40, background: "#8a8494" }} />
      {Array.from({ length: 8 }, (_, i) => <CasaObrera key={i} t={t} x={-3010 + i * 380} y={0} seed={i + 1} luzArriba={i === 5 ? e.luzCasa ?? 0 : (i * 7) % 3 === 0 ? 1 : 0} luzAbajo={(i * 5) % 4 === 1 ? 1 : 0} />)}
      <div style={{ position: "absolute", left: -3600, top: -620, width: 400, height: 620, background: "#3b2a4a" }} />
      {[-2400, -1300, -150, 7000].map((x) => <Farol key={x} t={t} x={x} y={0} on={1 - clamp((e.luz ?? 0) - 1, 0, 1)} />)}
      {/* interior de la fábrica detrás de la fachada (sólo cuando se abre) */}
      {abre > 0 && !e.sinFabrica && <FabricaAdentro t={t} e={adentro} />}
      {!e.sinFabrica && <FachadaFabrica t={t} x={FCX} y={0} w={FX1 - FX0 + 120} pisos={3} abre={abre} hora={e.hora} tCampana={e.tCampana} portonAbre={e.porton ?? 0} />}
      {!e.sinFabrica && <Chimenea t={t} x={7300} y={0} alto={4600} />}
      {e.gente && <Gente t={t} g={e.gente} />}
      {(e.nieve ?? 0) > 0 && <div style={{ position: "absolute", left: -4600, top: -40, width: 13000, height: 60, background: "#f4f6ff", opacity: e.nieve, borderRadius: 30 }} />}
    </>
  );
};
// copos de nieve en pantalla
export const Nieve: React.FC<{ t: number; n?: number; op?: number }> = ({ t, n = 120, op = 0.9 }) => {
  const r = React.useMemo(() => { const q = rnd(31); return Array.from({ length: n }, () => [q() * 1920, q() * 1080, 0.5 + q(), q() * 6]); }, [n]);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {r.map(([x, y, v, f], i) => <circle key={i} cx={(x + Math.sin(t * 0.8 + f) * 60 + t * 40 * v) % 1960} cy={(y + t * 90 * v) % 1100} r={3 + v * 4} fill="#fff" opacity={op * (0.5 + 0.5 * (v - 0.5))} />)}
    </svg>
  );
};

// ── CASA por dentro (cuarto del protagonista): cama compartida, mesa, vela, ventana con la pértiga del despertador
export const CasaAdentro: React.FC<{ t: number; gente?: GenteFab[]; vela?: number; golpe?: number }> = ({ t, gente = [], vela = 1, golpe = -9 }) => {
  const g = t - golpe;
  const tap = g > 0 && g < 2.4 ? Math.abs(Math.sin(g * 9)) * 26 : 0;
  return (
    <>
      <div style={{ position: "absolute", left: -1400, top: -1100, width: 2800, height: 1100, background: "linear-gradient(180deg, #5a3a4a, #3b2434)" }} />
      {/* empapelado gastado */}
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: -1400 + i * 200, top: -1100, width: 8, height: 1100, background: "#4a2f3e" }} />)}
      {/* ventana con cielo nocturno y la pértiga que golpea */}
      <div style={{ position: "absolute", left: 400, top: -900, width: 420, height: 480, background: "#1b1240", border: "26px solid #8a6a4a", overflow: "hidden" }}>
        <Estrellas t={t} n={14} seed={3} alto={480} />
        <div style={{ position: "absolute", left: 180 + tap * 0.4, top: -60 + tap, width: 20, height: 400, background: "#7a4a22", transform: "rotate(18deg)", borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 197, top: 0, width: 26, height: 480, background: "#8a6a4a" }} />
        <div style={{ position: "absolute", left: 0, top: 227, width: 420, height: 26, background: "#8a6a4a" }} />
      </div>
      {/* cama */}
      <svg style={{ position: "absolute", left: -1250, top: -460, overflow: "visible" }} width={1300} height={460}>
        <rect x={0} y={120} width={1300} height={260} rx={24} fill="#7a4a22" />
        <rect x={20} y={110} width={1260} height={120} rx={40} fill="#e8dcc0" />
        <rect x={0} y={0} width={60} height={460} rx={20} fill="#5e3a1a" />
        <rect x={1240} y={60} width={60} height={400} rx={20} fill="#5e3a1a" />
      </svg>
      {/* vela */}
      {vela > 0 && (
        <>
          <div style={{ position: "absolute", left: 620, top: -560, width: 360, height: 360, borderRadius: 180, background: "radial-gradient(circle, rgba(255,214,120,.55), transparent 70%)", opacity: vela * (0.85 + 0.15 * Math.sin(t * 13)) }} />
          <div style={{ position: "absolute", left: 785, top: -420, width: 30, height: 90, background: "#fff6e0", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 788, top: -460, width: 24, height: 40, background: "#ffb020", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", transform: `scaleY(${1 + Math.sin(t * 17) * 0.12})` }} />
        </>
      )}
      <Mesa x={700} y={-330} w={460} />
      <div style={{ position: "absolute", left: -1400, top: 0, width: 2800, height: 400, background: "#4e3420" }} />
      {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: -1400 + i * 160, top: 0, width: 6, height: 400, background: "#3b2616" }} />)}
      <Gente t={t} g={gente} />
    </>
  );
};

// ── SALA del comité (Westminster, 1832): ventanales góticos, mesa larga verde, caballeros de galera, testigo de pie
export const Sala: React.FC<{ t: number; gente?: GenteFab[]; hablan?: number[] }> = ({ t, gente = [] }) => (
  <>
    <div style={{ position: "absolute", left: -1600, top: -1300, width: 3200, height: 1300, background: "linear-gradient(180deg, #4a2f6a, #2d1b4a)" }} />
    {[-1200, -600, 0, 600, 1200].map((x) => (
      <div key={x} style={{ position: "absolute", left: x - 140, top: -1200, width: 280, height: 700, borderRadius: "140px 140px 0 0", background: "linear-gradient(180deg, #ffe39a, #e2a24a)", opacity: 0.8, boxShadow: "inset 0 0 0 18px #6a4a8a" }}>
        <div style={{ position: "absolute", left: 131, top: 0, width: 18, height: 700, background: "#6a4a8a" }} />
        <div style={{ position: "absolute", left: 0, top: 300, width: 280, height: 18, background: "#6a4a8a" }} />
      </div>
    ))}
    {/* rayos de luz */}
    {[-1200, -600, 0, 600, 1200].map((x) => <div key={`r${x}`} style={{ position: "absolute", left: x - 100, top: -600, width: 260, height: 600, background: "linear-gradient(180deg, rgba(255,230,160,.22), transparent)", transform: "skewX(-14deg)" }} />)}
    <div style={{ position: "absolute", left: -1600, top: -420, width: 3200, height: 60, background: "#3b2434" }} />
    <Gente t={t} g={gente} />
    {/* mesa larga del comité (va adelante de los caballeros sentados) */}
    <div style={{ position: "absolute", left: -1300, top: -330, width: 1500, height: 130, background: "#2f6a4a", borderRadius: 16, borderTop: "20px solid #3f8a62" }} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: -1200 + i * 240, top: -360, width: 120, height: 30, background: "#fbf3dc", transform: `rotate(${(i % 3) - 1}deg)` }} />)}
    <div style={{ position: "absolute", left: -1600, top: -200, width: 3200, height: 600, background: "#5e3a1a" }} />
    {Array.from({ length: 16 }, (_, i) => <div key={`t${i}`} style={{ position: "absolute", left: -1600 + i * 200, top: -200, width: 6, height: 600, background: "#4a2a12" }} />)}
  </>
);

// ── RUTA DEL ALGODÓN (horizontal): campo del sur x -6000..-2600 → mar → puerto y fábrica de Lancashire x 2600..
export const RutaAlgodon: React.FC<{ t: number; children?: React.ReactNode; atardecer?: number }> = ({ t, children }) => (
  <>
    {/* campo */}
    <div style={{ position: "absolute", left: -7000, top: 0, width: 4600, height: 900, background: "linear-gradient(180deg, #8a5a2c, #5e3a1a)" }} />
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: -7000, top: 40 + i * 80, width: 4600, height: 16, background: "#6b4a2e", opacity: 0.7 }} />)}
    {/* mar */}
    <svg style={{ position: "absolute", left: -2400, top: -10, overflow: "visible" }} width={4800} height={900}>
      <rect width={4800} height={900} fill="#1d3f7a" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={Array.from({ length: 44 }, (_, k) => `${k ? "Q" : "M"} ${k * 120 - 60 - ((t * (40 + i * 12)) % 120)} ${30 + i * 110 + (k % 2 ? -18 : 18)} ${k * 120 - ((t * (40 + i * 12)) % 120)} ${30 + i * 110}`).join(" ")} stroke={i % 2 ? "#3a64a8" : "#6f9be0"} strokeWidth={12} fill="none" opacity={0.85} />)}
    </svg>
    {/* muelle inglés */}
    <div style={{ position: "absolute", left: 2400, top: 0, width: 5200, height: 900, background: "#4a3d5e" }} />
    <div style={{ position: "absolute", left: 2400, top: -30, width: 5200, height: 40, background: "#8a8494" }} />
    {children}
  </>
);

// ── PLAZA de Manchester (hoy): adoquines claros, árboles redondos, gente que pasa
export const Arbolito: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <Pie x={x} y={y} s={s} w={500} h={900}>
    <rect x={-24} y={-420} width={48} height={420} fill="#6b3a1f" />
    {[[-120, -520, 170], [110, -560, 180], [0, -700, 210], [-40, -440, 150]].map(([cx, cy, r], i) => <circle key={i} cx={cx + Math.sin(t * 0.8 + i) * 6} cy={cy} r={r} fill={["#3f8a52", "#57a862", "#2f6f42", "#4f9a5a"][i]} />)}
  </Pie>
);
