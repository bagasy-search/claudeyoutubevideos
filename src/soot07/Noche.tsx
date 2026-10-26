import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Mano2D as CamaraMano } from "./Mano2D";
import { Inserto } from "./insertos";
import { Ambiente, lucesVinetas } from "./ambiente";
import { C, ent, fontFamily, Chip, Grande, Emote } from "./kit";
import { Persona, LUCIUS, CIVIL, Ropa, Expr } from "./persona";
import { ICO } from "./iconos";
import { B, M, DUR, Beat } from "./guion07";
import { FPS, X, V, cam, temaEn, oscuridad, fuego, CALLE, edifEn, X_CASA } from "./motor07";
import { CieloNoche, Horizonte, Siluetas, Suelo, Fachada, Frente, Oscuridad, Capa, SvgMundo, paleta, pantalla, altoEdif, Luz, tabernas } from "./mundo";
import { Carro, Carga, Caidas, Caida, tCaida, Asomado, Inundacion, Chorro, Derrumbe, Escalera, subidaPos, Puntales, Ratones, Lampara, Gente, Peligros, MuroSombras, ventana, cl, en, lerp } from "./piezas";
import { Portada } from "./Portada";
import { MapaCielo, RelojNoche, Balanza, ReglaAltura, Estrellitas } from "./mapas";

export const NOCHE_DUR = DUR;
const H = 270; // alto del protagonista
const S = H / 560;
const K = "#1a0d24";

// ═════ datos precalculados (una vez) ═════
const X0 = X(0);
const W_OLLA = ventana(X0 + 80, 3);
const Y_FREEZE = -430;
const CAIDAS: Caida[] = [];
const caeEn = (impacto: number, x: number, y: number, k: Caida["k"], yFin = 0) => { const c: Caida = { t0: 0, x, y, k, yFin }; c.t0 = impacto - tCaida(c); CAIDAS.push(c); };
caeEn(M.cae, X0 + 95, Y_FREEZE, "olla");
{
  const xm = X(M.martes);
  [0.2, 0.9, 1.5, 2.1].forEach((d, i) => { const w = ventana(xm + [-520, 640, -260, 980][i], 2 + (i % 3)); caeEn(M.ventanas0 + d, w.x, w.y, d > 1 ? "tiesto" : "agua"); });
  const xt = X(M.tira);
  [0, 0.5, 1.1, 1.6, 2.2].forEach((d, i) => { const w = ventana(xt + [-420, 320, 760, -120, 540][i], 1 + (i % 4)); caeEn(M.tira + d + 0.9, w.x, w.y, d % 1 ? (i % 2 ? "orinal" : "agua") : i % 2 ? "verdura" : "tiesto"); });
  const xa = X(M.altura);
  [0.6, 1.5, 2.4, 3.3].forEach((d, i) => { const w = ventana(xa + [-320, 420, 120, 820][i], 4); caeEn(M.altura + d + 1.0, w.x, w.y, i % 2 ? "olla" : "tiesto"); });
  const xc = X(M.cuenco);
  const wc = ventana(xc + 10, 1);
  caeEn(M.sopa, xc + 10, wc.y + 60, "agua", -200);
}
const XS = X(M.cayo); // el protagonista está quieto en la escena de la maceta
const W_MACETA = ventana(XS + 460, 2);
caeEn(M.cayo, W_MACETA.x, W_MACETA.y + 110, "maceta", -235);

type CarroD = { ta: number; tb: number; xa: number; xb: number; carga: Carga; bal?: number; y?: number; s?: number; delante?: boolean; frena?: number };
const CARROS: CarroD[] = [];
{
  let x = X(M.carro1); CARROS.push({ ta: M.carro1 - 0.5, tb: M.carro1 + 7, xa: x + 1500, xb: x - 1800, carga: "sacos", y: 40 });
  x = X(M.pesados); CARROS.push({ ta: M.pesados - 0.8, tb: M.pesados + 6.5, xa: x + 1600, xb: x - 1600, carga: "anforas", y: 40 });
  x = X(M.abeto); CARROS.push({ ta: M.abeto - 1.5, tb: M.balancea + 6, xa: x + 1800, xb: x - 1500, carga: "tronco", bal: 7, y: 40 });
  x = X(M.eje); CARROS.push({ ta: M.marmolC - 2.5, tb: M.eje, xa: x + 1700, xb: x + 260, carga: "marmol", y: 40, frena: M.dormir });
  x = X(M.pared); CARROS.push({ ta: M.pared - 0.4, tb: M.dedos + 4, xa: x + 520 * (M.dedos - M.pared + 0.4) + 120, xb: x - 520 * 4 + 120, carga: "sacos", y: 90, s: 1.05, delante: true });
  x = X(M.carroFin); CARROS.push({ ta: M.carroFin - 0.6, tb: M.carroFin + 9, xa: x + 1800, xb: x - 1700, carga: "anforas", y: 40 });
}
const carroX = (c: CarroD, t: number) => c.xa + (c.xb - c.xa) * cl((t - c.ta) / (c.tb - c.ta));

// el edificio que derriban los vigiles
const ED = edifEn(X(M.derriba) + 800) ?? CALLE[0];
const SIN_ED = CALLE.filter((e) => e !== ED);

// Juvenal (y otros vecinos) asomados
type As = { t0: number; t1: number; x: number; y: number; ropa?: Ropa; expr?: Expr; rollo?: boolean; laurel?: boolean; habla?: boolean; seed: number };
const JUV = CIVIL(2);
const ASOM: As[] = [
  { t0: 0, t1: 2.4, x: W_OLLA.x - 220, y: W_OLLA.y, ropa: CIVIL(4), expr: "sorpresa", laurel: false, habla: false, seed: 61 },
  { t0: M.juv1 - 0.2, t1: M.testa + 3.2, x: X(M.juv1) + 380, y: -820, ropa: JUV, rollo: true, seed: 40 },
  { t0: M.juv2, t1: M.juv2 + 4.5, x: X(M.juv2) + 540, y: -580, ropa: JUV, rollo: true, seed: 40 },
  { t0: M.juv3, t1: M.juv3 + 4.2, x: X(M.juv3) + 460, y: -720, ropa: JUV, rollo: true, seed: 40 },
  { t0: M.juv4, t1: M.matón - 0.4, x: X(M.juv4) + 560, y: -580, ropa: JUV, rollo: true, seed: 40 },
  { t0: M.juv5 - 0.6, t1: M.tercero + 1, x: X(M.juv5) + 520, y: -860, ropa: JUV, rollo: true, seed: 40 },
  { t0: M.juv6, t1: M.parche + 2, x: X(M.juv6) + 660, y: -780, ropa: JUV, rollo: true, seed: 40 },
  { t0: M.cuenco - 1.4, t1: M.cuenco + 2.2, x: ventana(X(M.cuenco) + 10, 1).x, y: ventana(X(M.cuenco) + 10, 1).y, ropa: CIVIL(3), expr: "feliz", laurel: false, habla: false, seed: 62 },
  { t0: M.ultimo - 0.3, t1: M.nosabes + 2, x: X(M.ultimo) + 520, y: -1174, ropa: CIVIL(1), expr: "dormido", laurel: false, habla: false, seed: 63 },
  { t0: M.ciceron, t1: M.cayeron + 2, x: X(M.ciceron) + 160, y: -780, ropa: { ...CIVIL(0), tunica: "#f2ead8", tunica2: "#c9bfa8" }, rollo: true, laurel: false, seed: 64 },
];

// gente de relleno
const FIESTA = [{ x: X(M.t1) - 200, v: 0, seed: 11, t0: M.t1 + 0.6, t1: M.puerta + 1.5, h: 240, expr: "feliz" as Expr }, { x: X(M.t1) + 420, v: 0, seed: 12, t0: M.t1 + 0.9, t1: M.puerta + 1.5, h: 250, expr: "feliz" as Expr }];
const xMul = X(M.multitud);
const MULTITUD = Array.from({ length: 11 }, (_, i) => ({ x: xMul + (i % 2 ? 1900 : -1500) + i * 90, v: i % 2 ? -(120 + i * 9) : 110 + i * 8, seed: 20 + i, t0: M.multitud - 0.4 + (i % 4) * 0.4, t1: M.casaPeligro - 0.5, h: 220 + (i % 3) * 25, expr: (i % 3 ? "neutro" : "feliz") as Expr }));
// OJO v3: trampa VII: los vecinos huyen del fuego (corren hacia la izquierda, con miedo)
const xHuye = X(M.huye);
const HUIDA = Array.from({ length: 9 }, (_, i) => ({ x: xHuye + 700 + (i % 3) * 260 + i * 70, v: -(360 + (i % 4) * 40), seed: 140 + i, t0: M.huye - 0.6 + i * 0.35, t1: M.huye + 5.5 + i * 0.35, h: 225 + (i % 3) * 20, expr: "miedo" as Expr }));
const TRANSEUNTE = [{ x: XS + 1100, v: -130, seed: 31, t0: M.cayo - (640 / 130), t1: M.cayo + 0.02, h: 250 }, { x: XS + 460, v: -40, seed: 31, t0: M.cayo, t1: M.limpia + 3, h: 250, expr: "sorpresa" as Expr }];

// ═════ estado del protagonista ═════
const EXPR: [number, Expr][] = [
  [0, "neutro"], [M.cae, "sorpresa"], [M.cae + 1, "miedo"], [M.martes + 1, "neutro"], [M.testa, "sorpresa"], [M.testa + 2, "neutro"],
  [M.t1, "feliz"], [M.puerta, "neutro"], [M.ojos, "miedo"], [M.rico, "neutro"], [M.notienes, "triste"], [M.lampara, "feliz"], [M.viento, "sorpresa"], [M.viento + 1.4, "neutro"],
  [M.mal, "triste"], [M.hora, "neutro"], [M.t2, "neutro"], [M.rumor, "sorpresa"], [M.carro1, "miedo"], [M.lista, "neutro"], [M.ciego, "miedo"], [M.eje, "sorpresa"], [M.queda, "triste"],
  [M.foca, "feliz"], [M.pared, "miedo"], [M.sigue2, "neutro"], [M.mira, "sorpresa"], [M.rapido, "miedo"], [M.insulae, "neutro"], [M.sopa, "triste"], [M.increible, "neutro"], [M.sopaYo, "triste"], [M.cayo, "sorpresa"], [M.limpia, "neutro"],
  [M.t4, "neutro"], [M.ojosOsc, "miedo"], [M.policia, "triste"], [M.matón, "miedo"], [M.golpe, "triste"], [M.sombras, "neutro"], [M.emperador, "sorpresa"], [M.eleccion, "neutro"], [M.matar, "sorpresa"], [M.peor, "neutro"],
  [M.t5, "neutro"], [M.agujero + 1.2, "sorpresa"], [M.agujero + 2.6, "triste"], [M.inunda, "miedo"], [M.sandal, "neutro"], [M.apaga, "miedo"], [M.naranja, "sorpresa"],
  [M.t6, "miedo"], [M.madera, "neutro"], [M.craso, "sorpresa"], [M.barato, "enojado"], [M.grande, "neutro"], [M.huye, "miedo"],
  [M.t7, "neutro"], [M.vienen, "feliz"], [M.cubos, "neutro"], [M.tuya, "sorpresa"], [M.noayuda, "neutro"], [M.sospechoso, "miedo"], [M.sonrie, "feliz"], [M.huir, "miedo"],
  [M.pregunta, "neutro"], [M.lohacian, "sorpresa"], [M.multitud, "feliz"], [M.casaPeligro, "triste"], [M.balanza, "sorpresa"], [M.eleccion2, "neutro"], [M.puertaCasa, "feliz"], [M.colchon, "dormido"],
];
const exprEn = (t: number) => { let r: Expr = "neutro"; for (const [a, e] of EXPR) if (a <= t) r = e; else break; return r; };
const lampara = (t: number) => {
  if (t < M.lampara + 0.2 || t > M.apaga + 0.2) return 0;
  if (t > M.viento + 0.2 && t < M.viento + 1.3) return 0;
  return 0.8 + 0.2 * Math.sin(t * 13) * Math.sin(t * 5.1);
};
const conLampara = (t: number) => t >= M.lampara && t < M.t7; // la lleva (prendida o no) desde que la saca hasta el fuego
const hundido = (t: number) => (t > M.agujero + 1.2 && t < M.agujero + 2.7 ? 80 * Math.sin(cl((t - M.agujero - 1.2) / 1.5) * Math.PI) : 0);

// ═════ piezas de pantalla ═════
const SLOT: Record<string, { x: number; y: number; a: "l" | "r" | "c" }> = {
  tl: { x: 64, y: 78, a: "l" }, tl2: { x: 64, y: 182, a: "l" }, tr: { x: 1856, y: 78, a: "r" }, tr2: { x: 1856, y: 182, a: "r" }, tc: { x: 960, y: 78, a: "c" }, bc: { x: 960, y: 972, a: "c" },
};
type Pz = Beat & { fin: number };
const PIEZAS: Pz[] = (() => {
  const out: Pz[] = [];
  B.forEach((b, i) => {
    let fin = b.t + 3;
    if (b.k === "chip") {
      const sig = B.slice(i + 1).find((o) => o.k === "chip" && o.slot === b.slot);
      fin = Math.min(b.t1 ?? b.t + 3.6, sig ? sig.t - 0.08 : 1e9);
    } else if (b.k === "big") fin = b.t1 ?? b.t + 2.6;
    else if (b.k === "ico") fin = b.t1 ?? b.t + 3.2;
    else if (b.k === "cuenta") fin = b.fin ?? b.t1 + 1.8;
    else if (b.k === "trap") fin = b.t + 2.9;
    const baja = (y: number | undefined, min: number) => (y !== undefined && y < min ? min : y);
    if (b.k === "big") out.push({ ...b, y: baja(b.y ?? 200, 300), fin });
    else if (b.k === "cuenta") out.push({ ...b, y: baja(b.y, 300) as number, fin });
    else if (b.k === "ico") out.push({ ...b, y: baja(b.y, 340) as number, fin });
    else out.push({ ...b, fin });
  });
  return out;
})();
const CHIP_SIZE = 54;
const anchoChip = (txt: string) => txt.length * CHIP_SIZE * 0.74 + CHIP_SIZE * 0.9;

const PiezaIco: React.FC<{ t: number; b: Extract<Beat, { k: "ico" }>; fin: number }> = ({ t, b, fin }) => {
  const e = ent(t, b.t, 0, { damping: 10, stiffness: 190 });
  const out = 1 - cl((t - fin) / 0.25);
  const s = (b.s ?? 1) * 210;
  const tach = b.tacha !== undefined ? cl((t - b.tacha) / 0.3) : 0;
  const flota = Math.sin((t - b.t) * 2.4) * 6;
  return (
    <div style={{ position: "absolute", left: b.x, top: b.y + flota, transform: `translate(-50%,-50%) scale(${e * out}) rotate(${(1 - e) * -12}deg)` }}>
      <svg width={s} height={s} viewBox="-110 -110 220 220" style={{ overflow: "visible", display: "block", filter: "drop-shadow(0 10px 0 rgba(10,4,30,.45))" }}>
        <circle r={104} fill="#fff3d6" stroke={K} strokeWidth={8} />
        {ICO[b.ico]}
        {tach > 0 && <g stroke={C.rojo} strokeWidth={20} strokeLinecap="round"><line x1={-80} y1={-80} x2={-80 + 160 * Math.min(1, tach * 2)} y2={-80 + 160 * Math.min(1, tach * 2)} />{tach > 0.5 && <line x1={80} y1={-80} x2={80 - 160 * (tach - 0.5) * 2} y2={-80 + 160 * (tach - 0.5) * 2} />}</g>}
      </svg>
      {b.label && <div style={{ position: "absolute", left: "50%", top: s + 6, transform: "translateX(-50%)", fontFamily, fontWeight: 700, fontSize: 36 * Math.max(0.85, b.s ?? 1), color: C.crema, whiteSpace: "nowrap", WebkitTextStroke: `7px ${K}`, paintOrder: "stroke fill", letterSpacing: 1 }}>{b.label}</div>}
    </div>
  );
};
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const PiezaCuenta: React.FC<{ t: number; b: Extract<Beat, { k: "cuenta" }>; fin: number }> = ({ t, b, fin }) => {
  const u = interpolate(t, [b.t, b.t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const v = b.de + (b.a - b.de) * u;
  const e = ent(t, b.t, 0, { damping: 10, stiffness: 200 });
  const pulso = t > b.t1 ? 1 + 0.12 * Math.exp(-(t - b.t1) * 6) : 1;
  const out = 1 - cl((t - fin) / 0.25);
  const size = b.size ?? 140;
  return (
    <div style={{ position: "absolute", left: b.x, top: b.y, transform: `translate(-50%,-50%) scale(${e * pulso * out})`, fontFamily, fontWeight: 700, fontSize: size, color: b.col ?? C.crema, WebkitTextStroke: `${size * 0.09}px ${K}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.07}px 0 ${K}` }}>
      {(b.pre ?? "") + fmt(v) + (b.suf ?? "")}
    </div>
  );
};
const TRAP_ICO = ["farol", "rueda", "orinal", "daga", "olas", "llama", "cubo"];
const PiezaTrampa: React.FC<{ t: number; b: Extract<Beat, { k: "trap" }>; fin: number }> = ({ t, b, fin }) => {
  const lt = t - b.t;
  const e = ent(t, b.t, 0, { damping: 11, stiffness: 160 });
  const out = 1 - cl((t - fin + 0.35) / 0.35);
  const barrido = interpolate(lt, [0, 0.35], [-2200, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: -200, right: -200, top: 380, height: 320, background: C.rojo, transform: `translateX(${barrido}px) rotate(-4deg)`, boxShadow: `0 16px 0 ${K}` }} />
      <div style={{ position: "absolute", left: -200, right: -200, top: 690, height: 26, background: C.ambar, transform: `translateX(${-barrido}px) rotate(-4deg)` }} />
      <div style={{ position: "absolute", left: 960, top: 545, transform: `translate(-50%,-50%) rotate(-4deg) scale(${e})`, display: "flex", alignItems: "center", gap: 40 }}>
        <svg width={250} height={250} viewBox="-110 -110 220 220" style={{ overflow: "visible", transform: `rotate(${Math.sin(lt * 3) * 6}deg)` }}><circle r={104} fill="#fff3d6" stroke={K} strokeWidth={8} />{ICO[TRAP_ICO[b.n - 1]]}</svg>
        <div style={{ fontFamily, fontWeight: 700, lineHeight: 0.95, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 70, color: C.crema, WebkitTextStroke: `8px ${K}`, paintOrder: "stroke fill" }}>TRAP #{b.n}</div>
          <div style={{ fontSize: 170, color: "#fff", WebkitTextStroke: `14px ${K}`, paintOrder: "stroke fill", textShadow: `0 12px 0 ${K}` }}>{b.name}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Hud: React.FC<{ t: number }> = ({ t }) => {
  if (t < M.t1 + 2.9 || t > M.pregunta) return null;
  const ts = PIEZAS.filter((p) => p.k === "trap").map((p) => p.t);
  return (
    <div style={{ position: "absolute", right: 40, bottom: 34, display: "flex", gap: 10, opacity: 0.92 }}>
      {TRAP_ICO.map((k, i) => {
        const on = t > ts[i] + 2.6;
        const e = on ? ent(t, ts[i] + 2.6) : 1;
        return (
          <svg key={k} width={58} height={58} viewBox="-110 -110 220 220" style={{ transform: `scale(${on ? e : 0.8})` }}>
            <circle r={100} fill={on ? C.rojo : "#2d1b69"} stroke="#fff3d6" strokeWidth={10} opacity={on ? 1 : 0.6} />
            <g opacity={on ? 1 : 0.35} transform="scale(0.8)">{ICO[k]}</g>
          </svg>
        );
      })}
    </div>
  );
};
const Piezas: React.FC<{ t: number }> = ({ t }) => (
  <>
    {PIEZAS.map((p, i) => {
      if (t < p.t - 0.05 || t > p.fin + 0.4) return null;
      if (p.k === "chip") {
        const sl = SLOT[p.slot];
        const x = sl.a === "l" ? sl.x : sl.a === "r" ? sl.x - anchoChip(p.txt) : sl.x;
        return <Chip key={i} t={t} t0={p.t} t1={p.fin} text={p.txt} color={p.col} tinta={p.tinta ?? "#fff"} x={x} y={sl.y} size={CHIP_SIZE} centro={sl.a === "c"} />;
      }
      if (p.k === "big") {
        const out = 1 - cl((t - p.fin) / 0.3);
        if (out <= 0) return null;
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: out }}><Grande t={t} t0={p.t} text={p.txt} x={p.x ?? 960} y={p.y ?? 200} size={p.size ?? 120} color={p.col ?? C.crema} borde={K} /></div>;
      }
      if (p.k === "ico") return <PiezaIco key={i} t={t} b={p} fin={p.fin} />;
      if (p.k === "cuenta") return <PiezaCuenta key={i} t={t} b={p} fin={p.fin} />;
      if (p.k === "trap") return <PiezaTrampa key={i} t={t} b={p} fin={p.fin} />;
      return null;
    })}
  </>
);

// llamas en la planta baja de un edificio
const Llamas: React.FC<{ t: number; x: number; w: number; alto: number }> = ({ t, x, w, alto }) => (
  <g>
    {Array.from({ length: Math.max(3, Math.floor(w / 70)) }, (_, k) => {
      const fx = x + k * 70 + 20, h = alto * (0.6 + 0.4 * Math.sin(t * 7 + k * 1.7));
      return <path key={k} d={`M ${fx - 40} 0 Q ${fx - 30} ${-h * 0.6} ${fx} ${-h} Q ${fx + 30} ${-h * 0.6} ${fx + 40} 0 Z`} fill={k % 2 ? "#ff8a2a" : "#ffd23a"} opacity={0.92} />;
    })}
  </g>
);
const Palomas: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <g>{[0, 1, 2, 3].map((k) => { const vuela = t > M.palomas + 1 + k * 0.3; const lt = t - M.palomas - 1 - k * 0.3; return <g key={k} transform={`translate(${x + k * 90 + (vuela ? lt * 300 : 0)} ${y - (vuela ? lt * 260 : Math.abs(Math.sin(t * 3 + k)) * 6)})`}><ellipse rx={30} ry={18} fill="#e8e4ee" stroke={K} strokeWidth={4} /><circle cx={24} cy={-14} r={12} fill="#e8e4ee" stroke={K} strokeWidth={4} /><path d={`M -6 -6 Q -20 ${vuela ? -40 * Math.abs(Math.sin(lt * 14)) : -14} -36 -4`} stroke={K} strokeWidth={4} fill="#d0cad8" /></g>; })}</g>
);
const Cubo = <g transform="translate(10 10)"><path d="M -24 -20 L 24 -20 L 18 26 L -18 26 Z" fill="#a8743c" stroke={K} strokeWidth={5} /><path d="M -24 -20 Q 0 -50 24 -20" fill="none" stroke={K} strokeWidth={4} /></g>;
const Antorcha = (t: number) => <g><rect x={-6} y={-70} width={12} height={90} fill="#6b3a1f" stroke={K} strokeWidth={4} /><path d={`M -18 -66 Q -14 ${-110 - Math.sin(t * 13) * 10} 0 -130 Q 14 ${-104 + Math.sin(t * 9) * 8} 18 -66 Z`} fill="#ffd23a" stroke="#ff8a2a" strokeWidth={4} /></g>;
const Moneda = <g><circle r={26} fill={C.oro} stroke={K} strokeWidth={5} /><circle r={14} fill="none" stroke="#c99a2a" strokeWidth={4} /></g>;
const VIGIL: Ropa = { tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#c98b62", piel2: "#a2643f", pelo: "#2a1a10" };

// gatos en los balcones: silueta en el mundo + ojos que brillan encima de la oscuridad
const GATOS = (() => { const out: { x: number; y: number; k: number }[] = []; for (let k = 0; k < 400; k++) { const x = -2000 + k * 1130 + ((k * 7919) % 400); const e = edifEn(x); if (!e || e.tipo !== "insula" || e.pisos < 3) continue; const w = ventana(x, 1 + (k % 3)); out.push({ x: w.x + 40, y: w.y + 50, k }); } return out; })();
const Gatos: React.FC<{ t: number; cv: { x: number; y: number; z: number } }> = ({ t, cv }) => {
  if (cv.y < -2000) return null;
  const vis = GATOS.filter((g) => Math.abs(g.x - cv.x) < 1300 / cv.z);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {vis.map((g) => {
        const q = pantalla(cv, g.x, g.y - 34);
        const b = (t * 0.7 + g.k * 0.37) % 3.1 < 0.14 ? 0.1 : 1;
        const mira = Math.sin(t * 0.5 + g.k) * 4 * cv.z;
        return <g key={g.k}>{[-1, 1].map((d) => <ellipse key={d} cx={q.x + d * 9 * cv.z + mira} cy={q.y} rx={6 * cv.z} ry={7 * cv.z * b} fill="#c8ff5a" />)}</g>;
      })}
    </svg>
  );
};
const GatoCuerpo: React.FC<{ t: number; x: number }> = ({ t, x }) => (
  <g>
    {GATOS.filter((g) => Math.abs(g.x - x) < 2200).map((g) => (
      <g key={g.k} transform={`translate(${g.x} ${g.y})`}>
        <ellipse cx={0} cy={-14} rx={30} ry={22} fill="#120a18" />
        <circle cx={0} cy={-40} r={17} fill="#120a18" />
        <path d="M -14 -50 L -10 -66 L -2 -54 Z M 14 -50 L 10 -66 L 2 -54 Z" fill="#120a18" />
        <path d={`M 26 -6 Q 52 ${-10 + Math.sin(t * 2 + g.k) * 12} 44 -40`} stroke="#120a18" strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
    ))}
  </g>
);

export const Noche: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c = cam(t);
  // temblor del carro final y de los derrumbes
  const temb = (en(t, M.carroFin, M.carroFin + 3.5) ? Math.sin(t * 50) * 4 : 0) + (en(t, M.tuya - 0.5, M.tuya + 0.6) ? Math.sin(t * 70) * 10 * (1 - (t - M.tuya + 0.5) / 1.1) : 0) + (en(t, M.eje + 0.25, M.eje + 0.8) ? Math.sin(t * 80) * 9 : 0);
  const cv = { x: c.x, y: c.y + temb, z: c.z };
  const tema = temaEn(cv.x);
  const pal = paleta(tema);
  const fu = fuego(t);
  const osc = Math.min(0.75, oscuridad(t) * 0.72); // OJO v2: menos negro (se perdía todo)
  const px = X(t), vel = V(t);
  const lam = lampara(t);
  const expr = exprEn(t);
  const corre = vel > 330;
  const contra = en(t, M.pared, M.sigue2);
  const subiendo = en(t, M.sube + 0.3, M.colchon);
  const adentro = t >= M.colchon;
  const pyProt = hundido(t) + (contra ? -14 : 0);
  const golpeado = en(t, M.golpe, M.golpe + 0.6) ? -24 * Math.sin(((t - M.golpe) / 0.6) * Math.PI) : 0;
  const sopa = t > M.sopa;

  // ── luces que agujerean la oscuridad
  const luces: Luz[] = [];
  const pz = (wx: number, wy: number) => pantalla(cv, wx, wy);
  if (lam > 0 && !adentro) { const q = pz(px + 60, -150 + pyProt); luces.push({ x: q.x, y: q.y, r: (300 + lam * 40) * cv.z }); }
  else if (!adentro) { const q = pz(px, -130); luces.push({ x: q.x, y: q.y, r: 90 * cv.z }); }
  // tabernas abiertas y antorchas privadas: las únicas luces de la calle
  (t > M.tuya - 0.45 ? SIN_ED : CALLE).forEach((e) => {
    if (e.tipo !== "insula") return;
    tabernas(e).forEach(({ x0, aw, lit, antorcha }) => {
      if (!lit) return;
      const q = pz(e.x + x0 + (aw - 44) / 2, -110);
      if (q.x < -500 || q.x > 2420) return;
      luces.push({ x: q.x, y: q.y, r: (antorcha ? 330 : 260) * cv.z });
    });
  });
  lucesVinetas(cv.x - 1600, cv.x + 1600).forEach((l) => { const q = pz(l.x, l.y); luces.push({ x: q.x, y: q.y, r: 300 * cv.z }); });
  ASOM.forEach((a) => { if (en(t, a.t0, a.t1 + 0.4)) { const q = pz(a.x, a.y); luces.push({ x: q.x, y: q.y, r: 300 * cv.z }); } });
  CARROS.forEach((k) => { if (en(t, k.ta, k.frena ?? k.tb)) { const q = pz(carroX(k, t) - 100, -200 + (k.y ?? 0)); luces.push({ x: q.x, y: q.y, r: 380 * cv.z }); } });
  const xRico = X(M.rico) - 1100 + 150 * (t - M.rico);
  if (en(t, M.rico, M.notienes + 2)) [0, 1].forEach((k) => { const q = pz(xRico + 400 + k * 160, -230); luces.push({ x: q.x, y: q.y, r: 420 * cv.z }); });
  const xVig0 = X(M.botas) - 1800, xVigF = X(M.vienen) - 380;
  const vigX = (k: number) => lerp(t, M.botas, M.vienen + 0.4, xVig0 - k * 170, xVigF - k * 170, Easing.out(Easing.quad));
  if (en(t, M.botas, M.huir + 4)) { const q = pz(vigX(0) + 40, -260); luces.push({ x: q.x, y: q.y, r: 460 * cv.z }); }
  if (en(t, M.sombras - 0.5, M.eleccion)) { const q = pz(X(M.sombras) + 420, -520); luces.push({ x: q.x, y: q.y, r: 900 * cv.z }); }

  // ── protagonista
  const prot = (() => {
    if (adentro) return null;
    if (subiendo) {
      const u = cl((t - M.sube - 0.3) / 2.6);
      const sp = subidaPos(X_CASA + 170, u, 5);
      return <Persona x={sp.x} y={sp.y} h={H} t={t} seed={1} ropa={LUCIUS} expr="neutro" camina={1.8} flip={sp.dir < 0} manoD={undefined} />;
    }
    const manoD = conLampara(t) ? <Lampara t={t} on={lam} /> : undefined;
    // OJO v3: las trampas se VIVEN: resbalón en la bosta y baldazo de sopa (se cubre la cabeza)
    const uR = cl((t - M.bosta - 0.3) / 1.3), resb = uR > 0 && uR < 1 ? Math.sin(uR * Math.PI) : 0;
    const balde = en(t, M.sopa - 0.35, M.sopa + 1.3);
    const agita = Math.sin(t * 22) * 25;
    const carroCerca = !contra && CARROS.some((k) => en(t, k.ta, k.tb) && Math.abs(carroX(k, t) - px) < 350);
    return (
      <Persona x={px + golpeado} y={pyProt + (carroCerca ? -26 : 0)} h={H} t={t} seed={1} ropa={LUCIUS} expr={resb > 0.1 ? "sorpresa" : balde || carroCerca ? "miedo" : expr} camina={vel > 4 ? vel / 150 : 0} mira={vel > 4 ? 0.6 : 0}
        manoD={balde ? undefined : manoD} bD={balde ? 165 : carroCerca ? 120 : resb > 0.1 ? 130 + agita : contra ? 40 : manoD ? 55 : undefined} cD={balde ? 70 : manoD ? 55 : undefined} bI={balde ? 165 : carroCerca ? 130 : resb > 0.1 ? 120 - agita : contra ? 40 : corre ? 60 : undefined} cI={balde ? 70 : undefined}
        ladea={golpeado ? -18 : 0} inclina={resb > 0 ? -28 * resb : carroCerca ? -14 : contra ? -6 : corre ? 10 : 0} salta={t > M.sopa - 1 && t < M.sopa + 3 ? M.sopa : M.cae} />
    );
  })();
  const salpica = en(t, M.sopa, M.sopa + 0.9) && (() => {
    const u = (t - M.sopa) / 0.9;
    return (
      <svg style={{ position: "absolute", left: px - 100, top: pyProt - 300, overflow: "visible" }} width={200} height={300} viewBox="-100 -300 200 300">
        {Array.from({ length: 18 }, (_, k) => { const a = -Math.PI * (0.05 + 0.9 * ((k * 0.381) % 1)); const v = 160 + ((k * 53) % 120); return <ellipse key={k} cx={Math.cos(a) * v * u} cy={-250 + Math.sin(a) * v * u + 400 * u * u} rx={12 - 6 * u} ry={16 - 8 * u} fill={k % 5 === 0 ? "#4fa85a" : "#e0b040"} stroke="#8a5a18" strokeWidth={2} opacity={1 - u * 0.6} />; })}
        <ellipse cx={0} cy={-250} rx={90 * (0.4 + u)} ry={34 * (0.4 + u)} fill="#f0c860" opacity={0.7 * (1 - u)} />
      </svg>
    );
  })();
  const xBosta = X(M.bosta + 0.3) + 40;
  const bosta = en(t, M.bosta - 3, M.bosta + 6) && (
    <svg style={{ position: "absolute", left: xBosta - 60, top: -60, overflow: "visible" }} width={120} height={60} viewBox="-60 -60 120 60">
      <path d="M -50 0 Q -46 -22 -20 -24 Q -14 -44 6 -40 Q 22 -52 30 -30 Q 52 -24 50 0 Z" fill="#6a4a1e" stroke="#2a1a08" strokeWidth={4} />
      {[-20, 8, 30].map((x, k) => <path key={k} d={`M ${x} -50 q 8 -12 0 -24 q -8 -12 0 -24`} stroke="#9ab04a" strokeWidth={4} fill="none" opacity={0.5 + 0.4 * Math.sin(t * 4 + k)} />)}
    </svg>
  );
  const sopaMancha = sopa && !adentro && !subiendo && (
    <svg style={{ position: "absolute", left: px + golpeado - 100, top: pyProt - 300, overflow: "visible" }} width={200} height={300} viewBox="-100 -300 200 300">
      {/* chorreones de sopa (no lunares): mancha grande en la cabeza que baja por la túnica + trocitos de verdura */}
      {t < M.limpia && <g>
        <path d="M -40 -262 Q -30 -282 0 -284 Q 30 -282 40 -262 Q 30 -256 22 -262 Q 10 -254 0 -262 Q -12 -254 -24 -262 Q -32 -256 -40 -262 Z" fill="#d9a83a" stroke="#8a5a18" strokeWidth={3} />
        <path d={`M -44 -258 Q -50 -230 -46 ${-206 + ((t * 20) % 10)}`} stroke="#d9a83a" strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d={`M 44 -256 Q 50 -232 46 ${-212 + ((t * 24) % 10)}`} stroke="#d9a83a" strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d="M 12 -282 l 14 -8 l 6 10 l -14 6 Z" fill="#4fa85a" /><path d="M -22 -280 l 10 -10 l 8 8 l -12 8 Z" fill="#3f8f4a" />
      </g>}
      <path d="M -30 -150 Q -10 -158 6 -146 L 4 -96 Q 0 -86 -4 -96 L -6 -130 Q -20 -124 -24 -132 Z" fill="#d9a83a" stroke="#8a5a18" strokeWidth={3} opacity={0.85} />
      <circle cx={-4} cy={-140} r={6} fill="#c0392b" />
    </svg>
  );

  // ── la olla del gancho: sale de la ventana, cae en cámara lenta, se congela, revienta al lado
  const ollaY = t < M.congela ? W_OLLA.y + 40 + (Y_FREEZE - W_OLLA.y - 40) * Math.pow(cl((t - 0.25) / (M.congela - 0.25)), 1.5) : Y_FREEZE + Math.sin(t * 2) * 6;
  const ollaVuela = t >= 0.25 && t < M.cae - tCaida({ t0: 0, x: 0, y: Y_FREEZE, k: "olla" });
  const nivel = t < M.inunda ? 0 : t < M.nopudo + 1.5 ? lerp(t, M.inunda, M.inunda + 2.5, 0, 110) : lerp(t, M.nopudo + 1.5, M.sandal - 0.5, 110, 0);
  const xNero = X(M.sombras) + 520;
  const xAguj = X(M.agujero + 1.2);
  const xVal = X(M.bajada);
  const xCra = X(M.craso);
  const xFin = X_CASA + 170;
  const sombra = "#1e0e22";
  const vienen = t > M.vienen + 0.4;

  return (
    <AbsoluteFill style={{ background: "#0b0822", overflow: "hidden" }}>
      <CamaraMano intensidad={0.55} seed={7}>
        <AbsoluteFill>
          <CieloNoche t={t} fuego={fu} luna={en(t, M.nube, M.rico + 2) ? 0 : 1} camY={cv.y} />
          <Horizonte cam={cv} t={t} fuego={fu} />
          <Siluetas cam={cv} t={t} fuego={fu} temaEn={temaEn} />
          <Suelo cam={cv} temaEn={temaEn} pal={pal} />
          <Fachada cam={cv} t={t} calle={t > M.tuya - 0.45 ? SIN_ED : CALLE} arde={(e) => ((e.tema === "fuego" || e.tema === "vigiles") && t > M.naranja - 1 ? fu * (0.5 + ((e.seed * 37) % 10) / 20) : 0)} />

          {/* ── mundo: piezas detrás de la gente */}
          <Capa cam={cv}>
            <SvgMundo>
              <Escalera x={xFin} pisos={5} />
              <GatoCuerpo t={t} x={cv.x} />
              <Peligros t={t} t0={M.obst} t1={M.cielo + 0.5} x0={X(M.obst)} />
              {en(t, M.bajada - 1, M.t6) && [300, 760, 1240, 1700].map((d) => <g key={d}><rect x={xVal + d - 50} y={-8} width={100} height={14} fill="#2a1a20" />{[0, 1, 2, 3].map((k) => <line key={k} x1={xVal + d - 36 + k * 24} y1={-8} x2={xVal + d - 36 + k * 24} y2={6} stroke="#555" strokeWidth={5} />)}</g>)}
              {en(t, M.agujero - 2, M.t6) && <ellipse cx={xAguj} cy={4} rx={110} ry={22} fill="#120a14" />}
              {[250, -350, 650].map((d, k) => <Chorro key={d} t={t} t0={M.reversa + k * 0.5} x={X(M.reversa) + d} />)}
              {CARROS.filter((k) => !k.delante && k.frena !== undefined).map((k, i) => en(t, k.ta, k.frena ?? k.tb + 0.1) && <Carro key={i} x={carroX(k, t)} t={t} carga={k.carga} vx={t < k.tb ? (k.xb - k.xa) / (k.tb - k.ta) : 0} balanceo={k.bal} y={k.y} s={k.s} vuelco={k.frena ? cl((t - M.eje) / 0.3) : 0} />)}
              {/* el bloque de mármol cae del carro roto */}
              {en(t, M.eje, M.dormir) && (() => { const u = cl((t - M.eje - 0.05) / 0.3); const bx = X(M.eje) + 260 + 40 + u * 260; return <g transform={`translate(${bx} ${-310 * (1 - u * u) + 40}) rotate(${u * 28})`}><rect x={-170} y={-160} width={340} height={160} fill="#e9e4da" stroke={K} strokeWidth={6} /><path d="M -130 -130 q 60 30 120 -10 t 140 20" stroke="#b9b0a4" strokeWidth={5} fill="none" /></g>; })()}
              {en(t, M.eje + 0.3, M.eje + 4) && Array.from({ length: 10 }, (_, k) => { const s = t - M.eje - 0.3; return <circle key={k} cx={X(M.eje) + 560 + Math.cos(k * 1.3) * (100 + s * 200)} cy={-60 - Math.abs(Math.sin(k)) * (60 + s * 90)} r={80 + s * 50} fill="#d8d0c4" opacity={cl(0.7 - s / 4)} />; })}
              <Derrumbe t={t} t0={M.tuya - 0.5} x={ED.x} w={ED.w} h={altoEdif(ED)} col="#8c4a38" />
              <Derrumbe t={t} t0={M.cayeron} x={X(M.cayeron) + 640} w={320} h={270} col="#7c5060" />
              <Puntales t={t} t0={M.puntales} x={X(M.puntales) + 420} h={900} />
              <Ratones t={t} t0={M.ratones} x={X(M.ratones) + 700} />
              {en(t, M.planta - 0.3, M.grande) && <Llamas t={t} x={X(M.planta) + 360} w={420} alto={170 * cl((t - M.planta) / 1.2)} />}
              {en(t, M.palomas - 1, M.comunes + 1) && <Palomas t={t} x={X(M.palomas) + 120} y={-1290} />}
              {/* chorros de agua de los vigiles hacia el fuego */}
              {en(t, M.bomba, M.cubos + 2) && [0, 1].map((k) => { const x0 = vigX(k) + 60, x1 = px + 500 + k * 300; const pul = Math.sin(t * 20 + k) * 10; return <path key={k} d={`M ${x0} -200 Q ${(x0 + x1) / 2} ${-900 + pul} ${x1} -620`} stroke="#7fd6ff" strokeWidth={22} fill="none" opacity={0.85} strokeLinecap="round" strokeDasharray="60 20" strokeDashoffset={-t * 600} />; })}
              {/* la olla */}
              {ollaVuela && <g transform={`translate(${X0 + 95} ${ollaY}) rotate(${t * 40})`}><path d="M -46 -30 Q -56 40 0 46 Q 56 40 46 -30 Z" fill="#c9673f" stroke={K} strokeWidth={6} /><ellipse cx={0} cy={-30} rx={48} ry={14} fill="#8a3a1f" stroke={K} strokeWidth={6} /></g>}
              {en(t, M.congela, M.cae - 0.6) && <path d={`M ${X0 + 95} ${Y_FREEZE + 50} Q ${X0 + 60} -300 ${X0 + 10} -230`} stroke={C.rojo} strokeWidth={8} strokeDasharray="20 16" fill="none" opacity={0.9} />}
              <Caidas t={t} lista={CAIDAS} />
              {/* la maceta que baila en el balcón antes de caer */}
              {en(t, M.maceta - 1, M.cayo - tCaida({ t0: 0, x: 0, y: W_MACETA.y + 110, k: "maceta", yFin: -235 })) && <g transform={`translate(${W_MACETA.x} ${W_MACETA.y + 110}) rotate(${Math.sin(t * 9) * 10 * cl((t - M.maceta) / 1)})`}><path d="M -40 -20 L 40 -20 L 30 40 L -30 40 Z" fill="#c9673f" stroke={K} strokeWidth={6} /><circle cx={-16} cy={-48} r={22} fill="#e8344a" stroke={K} strokeWidth={4} /><circle cx={18} cy={-56} r={20} fill="#ffb020" stroke={K} strokeWidth={4} /></g>}
            </SvgMundo>
            {!adentro && <Ambiente t={t} camX={cv.x} ancho={1920 / cv.z + 400} />}
            {/* sombras chinescas de Nerón sobre el muro */}
            <MuroSombras t={t} t0={M.sombras} t1={M.eleccion - 0.8} x={xNero} luz={0.6 + lam * 0.5} />
            {en(t, M.sombras, M.eleccion) && (
              <>
                {t > M.emperador - 0.2 && <Persona x={xNero - 140 + (en(t, M.ataca, M.apuñala + 0.6) ? 120 : 0)} y={-120} h={520} t={t} seed={70} sombra={sombra} aparece={M.emperador - 0.2} inclina={en(t, M.ataca, M.apuñala + 0.6) ? 16 : 0} ladea={en(t, M.pega, M.pega + 0.8) ? 22 : 0} bD={en(t, M.ataca, M.tiendas) ? 95 : en(t, M.palacio, M.montano) ? 60 : undefined} manoD={t > M.palacio ? <g><ellipse cx={0} cy={30} rx={50} ry={44} fill={sombra} /></g> : undefined} />}
                {t > M.disfraz && <svg style={{ position: "absolute", left: xNero - 140 - 120, top: -120 - 520 * (500 / 560) - 30, overflow: "visible" }} width={240} height={90} viewBox="-120 -45 240 90"><path d={`M -100 30 Q -110 -40 0 -46 Q 110 -40 100 30 Q 60 ${0 + Math.sin(t * 4) * 6} 0 10 Q -60 0 -100 30 Z`} fill={sombra} /></svg>}
                {[0, 1].map((k) => t > M.amigos + k * 0.3 && <Persona key={k} x={xNero - 460 - k * 200} y={-120} h={480} t={t} seed={71 + k} sombra={sombra} aparece={M.amigos + k * 0.3} bD={en(t, M.ataca, M.cloacaN) ? 70 : undefined} />)}
                {en(t, M.ataca - 0.8, M.cloacaN + 1) && <Persona x={xNero + 200} y={-120 + (t > M.cloacaN ? (t - M.cloacaN) * 500 : 0)} h={480} t={t} seed={73} sombra={sombra} aparece={M.ataca - 0.8} inclina={t > M.apuñala ? Math.min(70, (t - M.apuñala) * 200) : 0} opacity={t > M.cloacaN ? cl(1 - (t - M.cloacaN) / 0.8) : 1} />}
                {en(t, M.montano - 0.5, M.vida + 1.5) && <Persona x={xNero + 260} y={-120} h={540} t={t} seed={74} sombra={sombra} aparece={M.montano - 0.5} bD={en(t, M.pega, M.pega + 0.7) ? 100 : undefined} cD={en(t, M.pega, M.pega + 0.7) ? 0 : undefined} inclina={en(t, M.perdon, M.vida) ? 28 : 0} opacity={t > M.vida ? cl(1 - (t - M.vida) / 1.2) : 1} />}
              </>
            )}
            {/* gente */}
            {ASOM.map((a, i) => <Asomado key={i} t={t} t0={a.t0} t1={a.t1} x={a.x} y={a.y} ropa={a.ropa} expr={a.expr} rollo={a.rollo} laurel={a.laurel ?? true} habla={a.habla ?? true} seed={a.seed + i} />)}
            <Gente t={t} lista={FIESTA} />
            <Gente t={t} lista={MULTITUD} />
            <Gente t={t} lista={TRANSEUNTE} />
            <Gente t={t} lista={HUIDA} />
            {/* el abogado que le pone precio a tu cráneo */}
            {en(t, M.abogado - 0.2, M.martes) && <Persona x={X0 - 290} y={0} h={H * 1.02} t={t} seed={5} ropa={{ ...CIVIL(2), tunica: "#f2ead8", tunica2: "#c9bfa8" }} expr={t > M.cae ? "sorpresa" : "orgullo"} habla={en(t, M.abogado, M.cae)} aparece={M.abogado} bD={70} cD={60} salta={M.cae} />}
            {/* anfitrión de la cena en la villa */}
            {en(t, M.t1 + 0.4, M.puerta + 2) && <Persona x={X(M.adios) - 160} y={0} h={H} t={t} seed={13} ropa={CIVIL(1)} expr="feliz" habla={en(t, M.adios, M.puerta)} bI={en(t, M.adios, M.puerta + 1.5) ? 150 + Math.sin(t * 10) * 20 : undefined} />}
            {/* el rico con sus esclavos-farol */}
            {en(t, M.rico, M.notienes + 2) && (
              <>
                <Persona x={xRico} y={0} h={H * 1.05} t={t} seed={14} ropa={{ ...CIVIL(1), tunica: "#f2ead8", tunica2: "#c9bfa8" }} expr="orgullo" camina={150 / 150} />
                {[0, 1].map((k) => <Persona key={k} x={xRico + 400 + k * 160} y={0} h={H * 0.95} t={t} seed={15 + k} ropa={CIVIL(3 + k)} expr={k ? "neutro" : "miedo"} camina={1} manoD={Antorcha(t)} bD={70} cD={40} salta={k === 0 ? M.hoyo : undefined} />)}
              </>
            )}
            {/* el que te sigue en la oscuridad */}
            {en(t, M.pasos - 1.6, M.policia + 0.5) && <Persona x={px - 420} y={0} h={H * 1.05} t={t} seed={17} sombra="#0e0716" camina={vel > 4 ? vel / 150 : 0} opacity={cl((t - M.pasos + 1.6) / 0.5) * cl((M.policia + 0.5 - t) / 0.5)} />}
            {/* el matón borracho */}
            {en(t, M.matón - 1.2, M.dientes + 1.4) && <Persona x={lerp(t, M.matón - 1.2, M.matón, px + 700, px + 200)} y={0} h={340} t={t} seed={18} ropa={CIVIL(4)} expr="enojado" habla={en(t, M.bloquea, M.golpe)} flip camina={t < M.matón ? 1.2 : 0} bD={en(t, M.golpe - 0.15, M.golpe + 0.25) ? 100 : 20} cD={en(t, M.golpe - 0.15, M.golpe + 0.25) ? 0 : 60} manoI={<g transform="translate(0 20)"><path d="M -14 -40 L 14 -40 L 20 30 L -20 30 Z" fill="#7aa83a" stroke={K} strokeWidth={4} /></g>} bI={30} />}
            {/* Craso compra barato lo que se quema */}
            {en(t, M.craso - 0.3, M.grande) && (
              <>
                <Persona x={xCra + 420} y={0} h={H * 1.08} t={t} seed={19} ropa={{ tunica: "#f7c548", tunica2: "#c99a2a", cinto: "#6b3a1f", piel: "#f2b48a", piel2: "#d98d66", pelo: "#7a7068" }} expr={t > M.barato ? "feliz" : "orgullo"} habla={en(t, M.oferta, M.vendieron)} aparece={M.craso} flip bD={70} cD={50} manoD={Moneda} />
                {t > M.oferta && <Persona x={xCra + 780} y={0} h={H} t={t} seed={21} ropa={CIVIL(0)} expr={t > M.vendieron ? "triste" : "miedo"} aparece={M.oferta} bD={t > M.vendieron ? 70 : 30} />}
                {t > M.quinientos && Array.from({ length: 10 }, (_, k) => <Persona key={k} x={lerp(t, M.quinientos + k * 0.12, M.quinientos + 1.6, xCra + 2200 + k * 80, xCra + 1000 + k * 110)} y={10} h={170} t={t} seed={80 + k} ropa={CIVIL(k)} camina={t < M.quinientos + 1.6 ? 1.6 : 0} flip bD={t > M.reconstruye ? 100 + Math.sin(t * 12 + k) * 30 : 20} />)}
              </>
            )}
            {/* los vigiles (vienen de atrás, con baldes y una antorcha) */}
            {en(t, M.botas, M.huir + 4) && [0, 1, 2, 3, 4].map((k) => {
              const apunta = k === 0 && en(t, M.sospechoso, M.huir + 4);
              return <Persona key={k} x={vigX(k)} y={6} h={H * 1.05} t={t} seed={90 + k} ropa={VIGIL} casco="legion" expr={apunta ? "enojado" : vienen ? "neutro" : "orgullo"} camina={vienen ? 0 : 1.5} manoD={k === 0 ? Antorcha(t) : Cubo} bD={apunta ? 95 : 40} cD={apunta ? 0 : 60} habla={apunta && t < M.sonrie} />;
            })}
            {/* la vida en la calle de noche (giro): un panadero con su pan */}
            {/* el protagonista */}
            {prot}
            {bosta}{sopaMancha}{salpica}
            {en(t, M.cae, M.cae + 1.2) && <Emote t={t} t0={M.cae} t1={M.cae + 1.2} tipo="susto" x={px} y={-217} s={0.5} />}
            {en(t, M.mal, M.mal + 2) && <Emote t={t} t0={M.mal} t1={M.mal + 2} tipo="preg" x={px} y={-217} s={0.5} />}
            {en(t, M.cayo, M.cayo + 1.6) && <Emote t={t} t0={M.cayo} t1={M.cayo + 1.6} tipo="excl" x={W_MACETA.x} y={-230} s={0.5} />}
            {en(t, M.ciego, M.ciego + 1.8) && <Emote t={t} t0={M.ciego} t1={M.ciego + 1.8} tipo="sudor" x={px} y={-217} s={0.5} />}
            {en(t, M.matón, M.golpe) && <Emote t={t} t0={M.matón} t1={M.golpe} tipo="sudor" x={px} y={-217} s={0.5} />}
            {en(t, M.barato, M.vendieron + 1) && <Emote t={t} t0={M.barato} t1={M.vendieron + 1} tipo="enojo" x={px} y={-217} s={0.5} />}
            {en(t, M.sonrie, M.huir) && <Emote t={t} t0={M.sonrie} t1={M.huir} tipo="sudor" x={px} y={-217} s={0.5} />}
            {/* carro que pasa a dos centímetros (delante) y el agua de la inundación */}
            <SvgMundo>
              {/* OJO v3: los carros pasan POR DELANTE del nene (pegado al muro), no a través */}
              {CARROS.filter((k) => k.delante || k.frena === undefined).map((k, i) => en(t, k.ta, k.tb) && <Carro key={i} x={carroX(k, t)} t={t} carga={k.carga} vx={(k.xb - k.xa) / (k.tb - k.ta)} balanceo={k.bal} y={Math.max(k.y ?? 0, 90)} s={k.s} />)}
              {en(t, M.agujero + 1.1, M.agujero + 2.8) && <ellipse cx={xAguj} cy={14} rx={120} ry={16} fill="none" stroke="#9be7f0" strokeWidth={8} opacity={0.8} />}
              <Inundacion t={t} x0={px - 2600} x1={px + 2600} nivel={nivel} />
              {/* ventana de la casa: se prende cuando entra */}
              {t > M.colchon - 0.6 && (() => { const wy = -1100 - 140; return <g><rect x={xFin - 70} y={wy} width={140} height={120} fill="#2a1626" /><rect x={xFin - 58} y={wy + 10} width={116} height={100} fill="#ffcf6a" opacity={cl((t - M.colchon + 0.6) / 0.4)} /></g>; })()}
            </SvgMundo>
          </Capa>

          <Frente cam={cv} t={t} temaEn={temaEn} op={cv.y < -1500 ? 0 : 0.95} />
          <MapaCielo t={t} camY={cv.y} />
          <Oscuridad a={osc} luces={luces} />
          <Gatos t={t} cv={cv} />
          {/* ojos en la negrura (encima de la oscuridad) */}
          {en(t, M.ojos, M.lampara + 0.3) && osc > 0.7 && (() => { const q = pz(px, -225 + pyProt); const b = (t * 1.3) % 2.4 < 0.12 ? 0.15 : 1; return <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[-1, 1].map((d) => <ellipse key={d} cx={q.x + d * 20 * cv.z} cy={q.y} rx={13 * cv.z} ry={16 * cv.z * b} fill="#fff" />)}{[-1, 1].map((d) => <circle key={`p${d}`} cx={q.x + d * 20 * cv.z + 3} cy={q.y + 2} r={6 * cv.z * b} fill="#1a0d24" />)}</svg>; })()}
          {en(t, M.ojosOsc, M.policia) && (() => { const pares = [[-640, -170], [520, -260], [980, -150], [-1000, -300]]; return <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{pares.map(([dx, dy], i) => { if (t < M.ojosOsc + i * 0.5) return null; const q = pz(px + dx, dy); const b = (t * 0.9 + i) % 2.2 < 0.14 ? 0.1 : 1; return <g key={i}>{[-1, 1].map((d) => <ellipse key={d} cx={q.x + d * 16 * cv.z} cy={q.y} rx={11 * cv.z} ry={7 * cv.z * b} fill="#ffe14a" />)}</g>; })}</svg>; })()}
          {en(t, M.pasos - 1.6, M.policia + 0.5) && (() => { const q = pz(px - 420, -235); return <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[-1, 1].map((d) => <ellipse key={d} cx={q.x + d * 18 * cv.z} cy={q.y} rx={10 * cv.z} ry={6 * cv.z} fill="#ff4a4a" />)}</svg>; })()}
          {en(t, M.golpe, M.golpe + 2.4) && (() => { const q = pz(px, -240); return <Estrellitas t={t} t0={M.golpe} x={q.x} y={q.y} />; })()}
          {adentro && en(t, M.colchon + 1, M.cta) && (() => { const q = pz(xFin + 90, -1300); return <div style={{ position: "absolute", left: q.x, top: q.y - (t * 30) % 60, fontFamily, fontWeight: 700, fontSize: 60, color: C.crema, WebkitTextStroke: `6px ${K}`, paintOrder: "stroke fill", opacity: 0.9 }}>Zz</div>; })()}

          {/* la etiqueta de precio que el abogado le cuelga a tu cráneo */}
          {en(t, M.precio - 0.1, M.cae) && (() => { const q = pz(px, -300); const e = ent(t, M.precio); return <div style={{ position: "absolute", left: q.x, top: q.y, transform: `translate(-50%,-100%) scale(${e}) rotate(${Math.sin(t * 3) * 5}deg)`, transformOrigin: "50% 100%" }}><div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: K, background: C.oro, padding: "8px 22px", borderRadius: 14, border: `5px solid ${K}`, whiteSpace: "nowrap" }}>YOUR SKULL: ??? DENARII</div><div style={{ width: 4, height: 40, background: K, margin: "0 auto" }} /></div>; })()}
          {/* congelado del gancho: esquinas de "pausa" */}
          {en(t, M.congela, M.cae - 0.5) && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[[60, 60, 1, 1], [1860, 60, -1, 1], [60, 1020, 1, -1], [1860, 1020, -1, -1]].map(([x, y, sx, sy], i) => <path key={i} d={`M ${x} ${y + sy * 90} L ${x} ${y} L ${x + sx * 90} ${y}`} stroke="#fff3d6" strokeWidth={12} fill="none" />)}<g transform="translate(140 960)"><rect x={0} y={-40} width={22} height={80} fill={C.rojo} /><rect x={36} y={-40} width={22} height={80} fill={C.rojo} /></g></svg>}
          {/* la antorcha que baja del cielo a la villa */}
          {en(t, M.antorcha, M.baja + 0.6) && (() => { const u = cl((t - M.antorcha) / (M.baja + 0.6 - M.antorcha)); return <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><g transform={`translate(${960 + Math.sin(u * 6) * 140} ${-80 + u * 860}) scale(${1.6 - u * 0.6}) rotate(${Math.sin(u * 9) * 14})`}>{Antorcha(t)}</g></svg>; })()}

          <RelojNoche t={t} />
          <Balanza t={t} />
          <ReglaAltura t={t} />
        </AbsoluteFill>
      </CamaraMano>
      {/* OJO v3: carteles e inserts fuera de la cámara en mano (el balanceo los sacaba del cuadro por arriba) */}
      <Piezas t={t} />
      <Hud t={t} />
      {(() => { const q = pz(px, pyProt - H * 0.82); return <Inserto t={t} px={cl(q.x, 0, 1920)} py={cl(q.y, 0, 1080)} sopa={sopa && t < M.limpia} />; })()}
      <Portada t={t} />
    </AbsoluteFill>
  );
};
