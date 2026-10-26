// INSERTO: primer plano de un objeto CON la mano del personaje + la cara del personaje reaccionando en una esquina.
// Nunca el objeto solo: la mano (del color del look, con la manga de su camisa) lo sostiene, lo toca o lo muestra,
// y en el círculo de la esquina se ve QUIÉN lo mira y qué siente. Es un plano entero: va como `el` de un PlanoM.
//   <Inserto objeto="celular" look={LEO} pal={PALETAS.awaken} accion="tocar" caras={[{ f: 0, v: "neutral" }, { f: 40, v: "sorpresa" }]} />
//   objeto: nombre de la utilería ("needle", "abrigo"…) o un dibujo propio centrado en (0,0) con `objetoAlto` px de alto
//   encima: dibujo extra en coordenadas del objeto (lo que muestra la pantalla del celular, un mensaje…)
// sfxInserto(desde, accion) → foley (whoosh de entrada, pop de la cara, clics de los toques).
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { useF } from "./camara";
import { cue, Cue } from "./explica/comun";
import { Paleta, PALETAS } from "./paletas";
import { articulaciones, ClaveT, enTiempo, Expr, EXPRESIONES, huesosDe, Look, mezclaExpr, parpadear, Personaje, pose, labios } from "./personaje";
import { acl, mezclar, osc, uid } from "./sets/comun";
import { nombreProp, UTILERIA } from "./utileria";

export type AccionInserto = "sostener" | "tocar" | "girar" | "mostrar";
export type InsertoProps = {
  objeto: string | React.ReactNode; objetoAlto?: number; objetoAncho?: number; color?: string;
  look: Look; pal?: Paleta;
  desde?: number; hasta?: number;
  accion?: AccionInserto; toques?: number[]; // cuadros de cada toque (accion "tocar")
  caras?: ClaveT<string>[]; habla?: [number, number][];
  esquina?: "izq" | "der";
  fondo?: string; mesa?: string | false; acento?: string;
  agarre?: "puño" | "pinza"; // puño = la mano lo envuelve (celular, frasco); pinza = índice + pulgar (aguja, moneda). Sale solo.
  altoAgarre?: number; // puño: 0..1 altura del agarre medida desde abajo del objeto (0,3 = tercio inferior)
  encima?: React.ReactNode;
};

const PINZA: Record<string, { x: number; y: number }> = {
  aguja: { x: 22, y: -36 }, clavo: { x: 0, y: -56 }, lapiz: { x: -24, y: -11 }, llave: { x: -40, y: -24 }, moneda: { x: 0, y: -12 },
  entrada: { x: -54, y: -12 }, billete: { x: -58, y: -14 }, huevo: { x: 0, y: -14 }, nariz: { x: 0, y: -8 }, anteojos: { x: -60, y: -30 },
  pastillas: { x: 0, y: -10 }, destornillador: { x: 0, y: -100 }, tenedor: { x: 0, y: -30 }, cuchara: { x: 0, y: -30 }, sobre: { x: -50, y: -10 },
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pulso = (f: number, f0: number, d = 10) => (f >= f0 && f < f0 + d ? Math.sin((Math.PI * (f - f0)) / d) : 0);

export const Inserto: React.FC<InsertoProps> = (p) => {
  const f = useF();
  const id = uid();
  const { look, pal = PALETAS.awaken, desde = 0, hasta, accion = "sostener", esquina = "izq", altoAgarre = 0.3 } = p;
  const t = f - desde;
  const acento = p.acento ?? pal.acento;
  const fondo = p.fondo ?? mezclar(pal.fachada[1], pal.cielo[1], 0.35);
  const mesa = p.mesa === false ? undefined : p.mesa ?? osc(pal.piso, 0.85);
  // ---- el objeto: tamaño en pantalla ----
  const k = typeof p.objeto === "string" ? nombreProp(p.objeto) : undefined;
  const def = k ? UTILERIA[k] : undefined;
  const oh = def?.h ?? p.objetoAlto ?? 160, ow = def?.w ?? p.objetoAncho ?? 120;
  const s = Math.min(560 / oh, 700 / ow);
  const H = oh * s, Wd = Math.max(ow * s, 150);
  const cx = esquina === "izq" ? 1080 : 840, cy = 520;
  const L = cx - Wd / 2, R = cx + Wd / 2, bajo = cy + H / 2;
  const gy = bajo - H * altoAgarre;
  // pinza: los objetos chicos o finos se toman con dos dedos en un punto del dibujo (coordenadas del objeto)
  const pp = k ? PINZA[k] : undefined;
  const pinza = p.agarre ? p.agarre === "pinza" : !!pp;
  const G = pinza ? { x: cx + s * (pp?.x ?? 0), y: bajo + s * (pp?.y ?? -oh * 0.35) } : { x: cx, y: gy };
  // ---- mano: piel y manga del look ----
  const est = look.estilo;
  const frijol = est === "frijol", demonio = est === "demonio", zombi = est === "zombi";
  const piel = look.piel ?? (frijol ? "#ece5d3" : zombi ? "#7d8f74" : demonio ? "#0b0709" : "#17100d");
  const contorno = look.contorno ?? (frijol ? "#2a2622" : demonio ? look.neon ?? "#ff3fa4" : undefined);
  const manga = look.manga === "ninguna" ? piel : look.camisa ?? (frijol ? piel : "#f1ece2");
  const brillo = acl(pal.luz, 0.2);
  // ---- movimiento: entra desde abajo con resorte, respira, y la acción ----
  const q = spring({ frame: t, fps: 30, config: { damping: 15, stiffness: 110, mass: 0.9 } });
  const sale = hasta !== undefined ? interpolate(f, [hasta - 10, hasta], [0, 1], clamp) : 0;
  const dy = 760 * (1 - q) + 760 * sale * sale;
  const vivo = { x: Math.sin(f / 37) * 6, y: Math.sin(f / 29 + 1) * 5, r: Math.sin(f / 43) * 1.2 };
  let rot = (1 - q) * -10 + vivo.r, esc = 1;
  if (accion === "girar") rot += Math.sin(Math.max(0, t - 20) / 26) * 8;
  if (accion === "mostrar") esc = 1 + 0.12 * spring({ frame: t - 24, fps: 30, config: { damping: 12, stiffness: 120 } });
  const toques = accion === "tocar" ? p.toques ?? [desde + 30, desde + 48, desde + 66] : [];
  const tap = toques.reduce((m, ft) => Math.max(m, pulso(f, ft)), 0);
  const empuje = interpolate(f, [desde, desde + 240], [1, 1.045], clamp); // cámara que se acerca sola, despacio
  // dedos (por delante, sobre el borde izquierdo) y pulgar (por delante, borde derecho)
  const dedos = [-0.62, -0.28, 0.06, 0.38].map((u, i) => ({ y: gy + u * 120, largo: 70 + (i === 1 ? 10 : i === 3 ? -14 : 0) }));
  const pulgarBase = { x: R + 26, y: gy + 104 }, pulgarAng = -124 + tap * 16;
  const pulgarLargo = 150;
  // manga: dirección del antebrazo y puño perpendicular
  const m0 = { x: G.x + 150, y: G.y + 300 }, m1 = { x: G.x + 420, y: 1300 };
  const ml = Math.hypot(m1.x - m0.x, m1.y - m0.y), nx = -(m1.y - m0.y) / ml, ny = (m1.x - m0.x) / ml, ux = (m1.x - m0.x) / ml, uy = (m1.y - m0.y) / ml;
  const punta = { x: pulgarBase.x + Math.cos((pulgarAng * Math.PI) / 180) * pulgarLargo, y: pulgarBase.y + Math.sin((pulgarAng * Math.PI) / 180) * pulgarLargo };
  const Trazo: React.FC<{ d: string; w: number; c?: string }> = ({ d, w, c = piel }) => (
    <g>
      {contorno && <path d={d} stroke={contorno} strokeWidth={w + 9} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  const ondas = toques.map((ft) => {
    const u = f - ft;
    if (u < 0 || u > 16) return null;
    return <circle key={ft} cx={punta.x - 18} cy={punta.y - 10} r={14 + u * 4} fill="none" stroke="#fff" strokeWidth={4} opacity={0.6 * (1 - u / 16)} />;
  });
  const dibujo = def ? def.d(p.color ?? def.c, f) : p.objeto;
  return (
    <AbsoluteFill style={{ background: fondo }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <g transform={`translate(960,540) scale(${empuje}) translate(-960,-540)`}>
          {/* fondo fuera de foco: manchas planas grandes (nada de filtros) */}
          {[[170, 900, 230, pal.luz, 0.1], [1760, 900, 250, pal.luzFria, 0.1], [1560, 600, 150, pal.ventana, 0.1], [380, 640, 120, pal.luz, 0.07]].map(([x, y, r, c, o], i) => (
            <circle key={i} cx={(x as number) + Math.sin(f / 90 + i) * 8} cy={y as number} r={r as number} fill={c as string} opacity={(o as number) * 0.75} />
          ))}
          <circle cx={cx} cy={cy} r={460} fill={pal.luz} opacity={0.12} />
          {mesa && <rect x={-100} y={890} width={2200} height={300} fill={mesa} />}
          {mesa && <rect x={-100} y={890} width={2200} height={10} fill={acl(mesa, 0.15)} />}
          <g transform={`translate(${vivo.x},${dy + vivo.y}) rotate(${rot} ${G.x} ${G.y}) translate(${G.x} ${G.y}) scale(${esc}) translate(${-G.x} ${-G.y})`}>
            {/* manga + muñeca + palma (detrás del objeto) */}
            <Trazo d={`M${G.x + (pinza ? 90 : 70)},${G.y + 150} L${G.x + 330},${1240}`} w={124} />
            <Trazo d={`M${m0.x},${m0.y} L${m1.x},${m1.y}`} w={200} c={manga} />
            <path d={`M${m0.x - nx * 100 + ux * 6},${m0.y - ny * 100 + uy * 6} L${m0.x + nx * 100 + ux * 6},${m0.y + ny * 100 + uy * 6}`} stroke={osc(manga === piel ? "#888888" : manga, 0.78)} strokeWidth={26} strokeLinecap="round" />
            {pinza ? (
              <>
                <circle cx={G.x + 84} cy={G.y + 124} r={92} fill={piel} stroke={contorno} strokeWidth={contorno ? 9 : 0} />
                {[0, 1, 2].map((i) => <Trazo key={i} d={`M${G.x + 70},${G.y + 96 + i * 40} L${G.x + 6 + i * 6},${G.y + 104 + i * 42}`} w={42} />)}
              </>
            ) : (
              <ellipse cx={cx + 44} cy={gy + 74} rx={Wd * 0.5 + 56} ry={120} fill={piel} stroke={contorno} strokeWidth={contorno ? 9 : 0} />
            )}
            {/* el objeto */}
            <g transform={`translate(${cx},${bajo}) scale(${s})`}>{dibujo}{p.encima}</g>
            {ondas}
            {pinza ? (
              <>
                {/* índice y pulgar que pellizcan el objeto en G */}
                <Trazo d={`M${G.x + 40},${G.y + 84} Q${G.x - 52},${G.y + 26} ${G.x - 8},${G.y - 14}`} w={40} />
                <Trazo d={`M${G.x + 120},${G.y + 70} Q${G.x + 70},${G.y + 6 - tap * 10} ${G.x + 14},${G.y + 4 - tap * 8}`} w={46} />
                {!contorno && <path d={`M${G.x + 104},${G.y + 50} Q${G.x + 66},${G.y - 6} ${G.x + 22},${G.y - 10}`} stroke={brillo} strokeWidth={4} fill="none" opacity={0.3} strokeLinecap="round" />}
              </>
            ) : (
              <>
                {/* dedos por delante sobre el borde izquierdo */}
                {dedos.map((d, i) => <Trazo key={i} d={`M${L - 52},${d.y + 8} Q${L - 20},${d.y - 8} ${L - 52 + d.largo},${d.y + 2}`} w={44} />)}
                {dedos.map((d, i) => !contorno && <path key={`b${i}`} d={`M${L - 40},${d.y - 14} Q${L - 16},${d.y - 24} ${L - 52 + d.largo - 6},${d.y - 16}`} stroke={brillo} strokeWidth={4} fill="none" opacity={0.35} strokeLinecap="round" />)}
                {/* pulgar */}
                <Trazo d={`M${pulgarBase.x},${pulgarBase.y} L${punta.x},${punta.y}`} w={50} />
                {!contorno && <path d={`M${pulgarBase.x - 10},${pulgarBase.y - 22} L${punta.x + 4},${punta.y - 20}`} stroke={brillo} strokeWidth={4} opacity={0.3} strokeLinecap="round" />}
              </>
            )}
          </g>
        </g>
        <CaraEsquina look={look} pal={pal} acento={acento} esquina={esquina} desde={desde} hasta={hasta} caras={p.caras} habla={p.habla} id={id} />
      </svg>
    </AbsoluteFill>
  );
};

// la cara del personaje en un círculo de la esquina, mirando al objeto; cada cambio de cara da un golpecito
const CaraEsquina: React.FC<{ look: Look; pal: Paleta; acento: string; esquina: "izq" | "der"; desde: number; hasta?: number; caras?: ClaveT<string>[]; habla?: [number, number][]; id: string }> = ({ look, pal, acento, esquina, desde, hasta, caras, habla, id }) => {
  const f = useF();
  const cx = esquina === "izq" ? 290 : 1630, cy = 300, r = 200;
  const dir = esquina === "izq" ? 1 : -1;
  const cl = (caras && caras.length ? caras : [{ f: 0, v: "neutral" }]).map((c) => ({ f: c.f, v: EXPRESIONES[c.v] ?? EXPRESIONES.neutral, d: c.d }));
  const e: Expr = enTiempo(cl, f, 30, mezclaExpr);
  const ultimo = cl.filter((c) => c.f <= f).slice(-1)[0]?.f ?? -99;
  const golpe = cl.length > 1 && ultimo > cl[0].f ? pulso(f, ultimo, 12) : 0;
  const q = spring({ frame: f - desde - 8, fps: 30, config: { damping: 12, stiffness: 150 } });
  const sale = hasta !== undefined ? interpolate(f, [hasta - 10, hasta], [1, 0], clamp) : 1;
  const sc = q * sale * (1 + 0.07 * golpe);
  if (sc <= 0.01) return null;
  const P = pose({});
  const Hs = huesosDe(look.estilo, look.alto);
  const fr = look.estilo === "frijol" || look.estilo === "demonio";
  const j = articulaciones(P, undefined, Hs, (look.frontal ?? fr) ? { h: 29, c: 15 } : { h: 6, c: 5 });
  const hy = j.cabeza.y + (fr ? 14 : 4);
  const S = (r * 0.5) / Hs.cabezaR;
  const hab = habla?.some(([a, b]) => f >= a && f <= b) ? labios(f, 3) : 0;
  return (
    <g transform={`translate(${cx},${cy}) scale(${sc})`}>
      <circle cx={6} cy={10} r={r + 8} fill="#000" opacity={0.22} />
      <circle r={r} fill={acl(mezclar(pal.cielo[1], pal.fachada[0], 0.5), 0.18)} />
      <clipPath id={`ce${id}`}><circle r={r} /></clipPath>
      <g clipPath={`url(#ce${id})`}>
        <circle cx={dir * 60} cy={-40} r={r * 0.8} fill={pal.luz} opacity={0.18} />
        <g transform={`translate(${-dir * 10},${-4}) scale(${S}) translate(${-j.cabeza.x * dir},${-hy})`}>
          <Personaje x={0} y={0} dir={dir as 1 | -1} p={P} e={e} look={look} mirar={{ x: 0.75 * dir, y: 0.45 }} cara={0.3} parpadeo={parpadear(f, 5)} habla={hab} sombra={0} luz={{ lado: dir as 1 | -1, color: pal.luz, fuerza: 0.7 }} />
        </g>
      </g>
      <circle r={r} fill="none" stroke={acento} strokeWidth={10} />
    </g>
  );
};

export const sfxInserto = (desde: number, accion: AccionInserto = "sostener", toques?: number[]): Cue[] => [
  cue(desde, "whoosh", -10),
  cue(desde + 10, "pop", -10),
  ...(accion === "tocar" ? (toques ?? [desde + 30, desde + 48, desde + 66]).map((ft) => cue(ft + 3, "click", -8)) : []),
  ...(accion === "mostrar" ? [cue(desde + 24, "whoosh", -12)] : []),
];
