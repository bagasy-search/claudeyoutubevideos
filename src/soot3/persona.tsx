import React from "react";
import { rnd } from "../soot/lib";
import { luzActual, mezcla } from "./kit";

// Personaje vector riggeado de Soot v3 (todo en código): cabezón con ojos grandes, ropa con degradé,
// brazos con hombro + codo, piernas que caminan, parpadeo, boca que habla y 8 expresiones.
// Origen = entre los pies; mide ~560 u de alto (escala con `h`).
// v5 (arte base, 26-oct): LUZ automática (sombra proyectada plana, luz de borde del lado del sol, volumen y tinte del set,
// leídos de `luzActual()` que fija cada lugar), GIRO (frente/34/perfil/espalda), POSTURA (sentado/agachado), CORRER con
// línea de acción, AGARRE real (objeto hijo de la mano, con dedos encima) y REACCIONES de remate (ojos/mandíbula/derrite/susto).
export type Expr = "neutro" | "feliz" | "miedo" | "triste" | "enojado" | "sorpresa" | "dormido" | "orgullo";
export type Giro = "frente" | "34" | "perfil" | "espalda";
export type Postura = "parado" | "sentado" | "agachado";
export type Reaccion = "ojos" | "mandibula" | "derrite" | "susto";
export type Ropa = { tunica: string; tunica2: string; cinto: string; piel: string; piel2: string; pelo: string; ojos?: string };
export const LUCIUS: Ropa = { tunica: "#d8443a", tunica2: "#9e2531", cinto: "#6b3a1f", piel: "#f2b48a", piel2: "#d98d66", pelo: "#4a2a17" };
export const CENTURION: Ropa = { tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#2a1a10" };
export const CIVIL = (i: number): Ropa => {
  const t = [["#3fa7a0", "#226f6c"], ["#e0a63a", "#a8711d"], ["#7a5bd1", "#4c349a"], ["#5c8f3e", "#3a6224"], ["#c9673f", "#8c4021"]][i % 5];
  const p = [["#f2b48a", "#d98d66"], ["#c98b62", "#a2643f"], ["#8d5a3b", "#6a3f26"], ["#f5c7a0", "#dc9d78"]][i % 4];
  const pe = ["#4a2a17", "#1d1410", "#7a4a22", "#2b1c14", "#a0602c"][(i * 3) % 5];
  return { tunica: t[0], tunica2: t[1], cinto: "#5a3418", piel: p[0], piel2: p[1], pelo: pe };
};

type Props = {
  x: number; y: number; h?: number; t: number; seed?: number;
  ropa?: Ropa; expr?: Expr; habla?: boolean; camina?: number; // camina = fase en ciclos/s (0 = quieto)
  bI?: number; bD?: number; cI?: number; cD?: number; // hombro y codo, grados (0 = colgando)
  mira?: number; miraY?: number; flip?: boolean; casco?: "no" | "legion" | "centurion"; viejo?: boolean;
  sombra?: string; manoD?: React.ReactNode; manoI?: React.ReactNode; inclina?: number; opacity?: number; aparece?: number; ladea?: number; salta?: number;
  // ── v5 (todas opcionales)
  giro?: Giro; // hacia dónde mira el cuerpo; "34"/"perfil" miran a la DERECHA (flip para la izquierda)
  postura?: Postura; // sentado (sobre banco/litera a ~125 u del piso) o agachado
  corre?: number; // ciclos/s: zancada larga, brazos que bombean, inclinado hacia adelante + líneas de velocidad
  agarra?: React.ReactNode; agarraI?: React.ReactNode; // objeto EN la mano derecha/izquierda: hijo del antebrazo, con los dedos encima
  agarraRot?: number; agarraRotI?: number; // giro del objeto RELATIVO al antebrazo (grados); el objeto se dibuja con el mango en (0,0) apuntando a +x
  agarraAng?: number; agarraAngI?: number; // MÁS FÁCIL: ángulo del objeto EN PANTALLA, fijo aunque el brazo se mueva (0 = hacia donde mira, -90 = arriba, 90 = abajo, 180 = atrás). Pisa agarraRot.
  reaccion?: Reaccion; reaccionT0?: number; // remate exagerado; sin T0 queda puesto todo el tiempo
  plano?: boolean; // true = sin luz/sombra (look viejo)
  bruma?: number; // 0-1: perspectiva atmosférica (lejos = más claro y desaturado hacia la bruma del set). Multitud lo pone solo.
};

const BOCA: Record<Expr, string> = {
  neutro: "M -16 -392 Q 0 -386 16 -392",
  feliz: "M -26 -398 Q 0 -366 26 -398 Z",
  orgullo: "M -22 -394 Q 0 -378 22 -394",
  miedo: "M -18 -384 Q 0 -404 18 -384 Q 0 -372 -18 -384 Z",
  triste: "M -20 -380 Q 0 -398 20 -380",
  enojado: "M -22 -384 Q 0 -394 22 -384",
  sorpresa: "",
  dormido: "M -12 -390 Q 0 -384 12 -390",
};
// cejas: [dy exterior, dy interior] respecto de la línea base
const CEJA: Record<Expr, [number, number]> = {
  neutro: [0, 0], feliz: [-4, -6], orgullo: [-2, 2], miedo: [4, -14], triste: [6, -12], enojado: [-6, 12], sorpresa: [-14, -16], dormido: [2, 2],
};
// geometría por giro: corrimiento de la cara, ojos [x, escala x], orejas, hombros, caderas, ancho del torso
const GIRO: Record<Giro, { fx: number; ojos: [number, number][]; orejas: number[]; hom: number; cad: number; tor: number; pie: number }> = {
  frente: { fx: 0, ojos: [[-38, 1], [38, 1]], orejas: [-96, 96], hom: 66, cad: 28, tor: 1, pie: 0 },
  "34": { fx: 24, ojos: [[-14, 0.78], [56, 1]], orejas: [-92], hom: 58, cad: 24, tor: 0.9, pie: 8 },
  perfil: { fx: 46, ojos: [[60, 0.72]], orejas: [-10], hom: 22, cad: 10, tor: 0.66, pie: 16 },
  espalda: { fx: 0, ojos: [], orejas: [-96, 96], hom: 66, cad: 28, tor: 1, pie: 0 },
};
const sat = (v: number) => Math.max(0, Math.min(1, v));
// espejo del objeto en la mano (flip del personaje XOR mano izquierda): los textos lo leen para no salir al revés
// {e: espejado, ang: ángulo en pantalla del objeto}: TextoMano deshace ambos → el texto queda DERECHO y legible
export const EspejoCtx = React.createContext<{ e: boolean; ang: number }>({ e: false, ang: 0 });
export const TextoMano: React.FC<React.SVGProps<SVGTextElement> & { x: number; y: number; padre?: number }> = ({ x, y, padre = 0, children, ...r }) => {
  const { e, ang } = React.useContext(EspejoCtx);
  return <g transform={`translate(${x} ${y}) rotate(${-padre}) scale(${e ? -1 : 1} 1) rotate(${-ang}) translate(${-x} ${-y})`}><text x={x} y={y} {...r}>{children}</text></g>;
};

export const Persona: React.FC<Props> = (p) => {
  const { x, y, h = 560, t, seed = 1, habla = false, camina = 0, mira = 0, miraY = 0, flip = false, casco = "no", sombra, opacity = 1 } = p;
  const id = `p${seed}`;
  const S = h / 560;
  const r = React.useMemo(() => rnd(seed * 31 + 5), [seed]);
  const desfase = React.useMemo(() => r() * 10, [r]);
  // luz del set (la fija el lugar); siluetas (`sombra`) y `plano` no llevan luz
  const conLuz = !sombra && !p.plano;
  const L = luzActual();
  const br = conLuz ? p.bruma ?? 0 : 0;
  const T = (v: string) => (conLuz && (L.tinteK || br) ? mezcla(mezcla(v, L.tinte, L.tinteK), L.bruma, br) : v);
  const r0 = p.ropa ?? LUCIUS;
  const ropa: Ropa = conLuz && (L.tinteK || br) ? { tunica: T(r0.tunica), tunica2: T(r0.tunica2), cinto: T(r0.cinto), piel: T(r0.piel), piel2: T(r0.piel2), pelo: T(r0.pelo), ojos: r0.ojos } : r0;
  const ls = (L.lado * (flip ? -1 : 1)) as number; // lado del sol en coordenadas del cuerpo
  const corre = p.corre ?? 0;
  const giro: Giro = p.giro ?? (corre ? "34" : "frente");
  const G = GIRO[giro];
  const postura = p.postura ?? "parado";
  // reacción de remate
  const rx = p.reaccion && (p.reaccionT0 === undefined || t >= p.reaccionT0) ? p.reaccion : undefined;
  const rt = rx ? (p.reaccionT0 === undefined ? 6 : t - p.reaccionT0) : 0;
  const expr: Expr = rx === "ojos" || rx === "mandibula" ? "sorpresa" : rx === "susto" ? "miedo" : rx === "derrite" ? "triste" : p.expr ?? "neutro";
  // parpadeo: cada ~3,1 s con un desfase propio
  const ciclo = (t + desfase) % 3.1;
  const parp = expr === "dormido" ? 0.08 : rx ? 1 : ciclo < 0.12 ? 0.12 : 1;
  const respira = Math.sin((t + desfase) * 2.2) * 3;
  // entrada con anticipación: crece desde los pies, se estira y se aplasta (squash & stretch)
  const ap = p.aparece === undefined ? 1 : t < p.aparece ? 0 : 1;
  const la = p.aparece === undefined ? 9 : t - p.aparece;
  let sy = la < 0.6 ? 1 + Math.sin(la * 16) * Math.exp(-la * 6) * 0.22 : 1;
  let sx = la < 0.6 ? 1 - Math.sin(la * 16) * Math.exp(-la * 6) * 0.14 : 1;
  const crece = p.aparece === undefined ? 1 : Math.min(1, la / 0.12);
  // salto: rebote vertical que decae (sorpresa, alegría)
  const sl = p.salta === undefined || t < p.salta ? 0 : t - p.salta;
  let salto = sl > 0 && sl < 0.7 ? -Math.abs(Math.sin(sl * 9)) * Math.exp(-sl * 4) * 80 : 0;
  if ((rx === "susto" || rx === "ojos") && rt < 0.8) salto += -Math.abs(Math.sin(rt * 8)) * Math.exp(-rt * 4) * (rx === "susto" ? 110 : 50);
  const tiembla = rx === "susto" ? Math.sin(t * 57) * 5 : 0;
  // derretirse: se aplasta hacia el charco
  const dm = rx === "derrite" ? sat(rt / 1.4) : 0;
  const dme = dm * dm * (3 - 2 * dm);
  if (dme) { sx *= 1 + 0.6 * dme; sy *= 1 - 0.62 * dme; }
  // los ojos se mueven solos (micro sacadas) y la cabeza acompaña la respiración
  const sac = Math.round(Math.sin((t + desfase) * 0.9) * 2) * 0.12;
  const ladea = (p.ladea ?? 0) + Math.sin((t + desfase) * 1.1) * 2 + (corre ? 6 : 0);
  const fase = (corre || camina) * t * Math.PI * 2;
  const pierna = camina && !corre ? Math.sin(fase) * 24 : 0;
  const bote = corre ? Math.abs(Math.sin(fase)) * -22 : camina ? Math.abs(Math.sin(fase)) * -10 : 0;
  const balanceo = camina && !corre ? Math.sin(fase) * 22 : 0;
  const bomba = corre ? Math.sin(fase) * 50 : 0;
  let bI = (p.bI ?? (corre ? 30 : 8)) + (corre ? -bomba : camina ? -balanceo : Math.sin((t + desfase) * 1.7) * 2);
  let bD = (p.bD ?? (corre ? 30 : 8)) + (corre ? bomba : camina ? balanceo : Math.sin((t + desfase) * 1.5 + 1) * 2);
  let cI = p.cI ?? (corre ? 95 : 10), cD = p.cD ?? (corre ? 95 : 10);
  if (rx === "susto") { const k = sat(rt / 0.25); bI = 8 + (155 - 8) * k + Math.sin(t * 40) * 4; bD = 8 + (155 - 8) * k + Math.cos(t * 43) * 4; cI = cD = 30; }
  if (rx === "derrite") { bI = 8 + 20 * dme; bD = 8 + 20 * dme; cI = cD = 10; }
  const inclina = (p.inclina ?? 0) + (corre ? 13 : 0) + (postura === "agachado" ? 8 : 0);
  const bocaAbre = habla && !rx ? 0.5 + 0.5 * Math.sin(t * 17 + desfase) * Math.sin(t * 7.3) : 0;
  const c = (v: string) => sombra ?? T(v);
  const piel = sombra ?? `url(#${id}piel)`;
  const tun = sombra ?? `url(#${id}tun)`;
  const ojos = ropa.ojos ?? "#3b2416";
  const [ce, ci] = CEJA[expr];
  const fx = G.fx;
  const espalda = giro === "espalda";
  // postura: cuánto baja el torso y dónde quedan rodillas y pies
  const baja = postura === "sentado" ? 66 : postura === "agachado" ? 92 : 0;
  const caderaY = -190 + baja;
  const pierna2 = (s: 1 | -1): [number, number, number, number, number, number] => {
    const hx = s * G.cad;
    const lateral = giro === "perfil" || giro === "34";
    if (corre) {
      const ph = fase + (s > 0 ? 0 : Math.PI);
      const th = (Math.sin(ph) * 42 * Math.PI) / 180;
      const kb = (Math.max(0, -Math.cos(ph)) * 75 * Math.PI) / 180;
      const kx = hx + Math.sin(th) * 92, ky = caderaY + Math.cos(th) * 92;
      return [hx, caderaY, kx, ky, kx + Math.sin(th - kb) * 90, ky + Math.cos(th - kb) * 90];
    }
    if (postura === "sentado") return lateral ? [hx, caderaY, hx + 112, caderaY + 4, hx + 116 + s * 6, -12] : [hx, caderaY, s * (G.cad + 44), caderaY + 14, s * (G.cad + 38), -12];
    if (postura === "agachado") return lateral ? [hx, caderaY, hx + 96 - s * 10, caderaY - 56, hx + 44 - s * 18, -12] : [hx, caderaY, s * (G.cad + 70), caderaY - 52, s * (G.cad + 34), -12];
    const th = (-s * pierna * Math.PI) / 180;
    return [hx, caderaY, hx + Math.sin(th) * 89, caderaY + Math.cos(th) * 89, hx + Math.sin(th) * 178, caderaY + Math.cos(th) * 178];
  };

  const Brazo = ({ s, a, codo, mano, agarra, rot: rot0 = 0, ang }: { s: 1 | -1; a: number; codo: number; mano?: React.ReactNode; agarra?: React.ReactNode; rot?: number; ang?: number }) => {
    // ángulo en pantalla → giro local: brazo der. gira -(a+codo), el izq. +(a+codo) y además espeja el objeto
    const rot = ang === undefined ? rot0 : s > 0 ? ang + a + codo - inclina : 180 + a + codo + inclina - ang;
    return (
    <g transform={`translate(${s * G.hom} -322) rotate(${-s * a})`}>
      <line x1={0} y1={0} x2={0} y2={92} stroke={c(r0.tunica2)} strokeWidth={40} strokeLinecap="round" />
      {conLuz && s === ls && <line x1={s * 14} y1={4} x2={s * 14} y2={88} stroke={L.borde} strokeWidth={8} strokeLinecap="round" opacity={L.bordeOp * 0.8} />}
      <g transform={`translate(0 92) rotate(${-s * codo})`}>
        <line x1={0} y1={0} x2={0} y2={78} stroke={piel === sombra ? sombra : c(r0.piel)} strokeWidth={30} strokeLinecap="round" />
        {conLuz && s === ls && <line x1={s * 9} y1={4} x2={s * 9} y2={74} stroke={L.borde} strokeWidth={7} strokeLinecap="round" opacity={L.bordeOp * 0.8} />}
        <circle cx={0} cy={86} r={19} fill={c(r0.piel)} />
        {mano && <g transform="translate(0 86)">{mano}</g>}
        {agarra && (
          <g transform="translate(0 86)">
            <EspejoCtx.Provider value={{ e: flip !== (s < 0), ang: (() => { const A = inclina - s * (a + codo), B = s < 0 ? A - rot : A + rot; return flip ? -B : B; })() }}><g transform={`scale(${s} 1) rotate(${rot})`}>{agarra}</g></EspejoCtx.Provider>
            {/* dedos ENCIMA del mango: así se lee que lo agarra */}
            <circle cx={0} cy={0} r={20} fill={c(r0.piel)} />
            {!sombra && <path d="M -15 -7 Q 0 -14 15 -7 M -16 3 Q 0 -4 16 3 M -14 12 Q 0 6 14 12" stroke={T(r0.piel2)} strokeWidth={4} fill="none" strokeLinecap="round" />}
          </g>
        )}
      </g>
    </g>
    );
  };

  // sombra proyectada plana: queda en el piso aunque salte, del lado opuesto al sol, sin blur
  const alto = -(bote + salto);
  const ks = Math.max(0.45, 1 - alto / 260);
  const anchoBase = postura === "sentado" ? 150 : postura === "agachado" ? 130 : 105;
  const proy = L.largo * 70 * ks;

  // cabeza: elipse (0,-450) rx100 ry104
  const cabezaD = (dx: number, dy = 0) => `M ${dx - 100} ${-450 + dy} a 100 104 0 1 0 200 0 a 100 104 0 1 0 -200 0 Z`;

  return (
    <svg style={{ position: "absolute", left: x - 300 * S, top: y - 640 * S, overflow: "visible", opacity }} width={600 * S} height={680 * S} viewBox="-300 -640 600 680">
      <defs>
        <linearGradient id={`${id}tun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ropa.tunica} /><stop offset="1" stopColor={ropa.tunica2} />
        </linearGradient>
        <radialGradient id={`${id}piel`} cx="0.42" cy="0.38" r="0.7">
          <stop offset="0.55" stopColor={ropa.piel} /><stop offset="1" stopColor={ropa.piel2} />
        </radialGradient>
        <linearGradient id={`${id}bronce`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T("#ffd77a")} /><stop offset="0.5" stopColor={T("#d9962e")} /><stop offset="1" stopColor={T("#8a5414")} />
        </linearGradient>
        {conLuz && <clipPath id={`${id}cab`}><path d={cabezaD(0)} /></clipPath>}
      </defs>
      <g transform={`scale(${crece * ap})`}>
        {conLuz ? (
          <g fill="#1d0f33">
            <ellipse cx={-L.lado * proy} cy={4} rx={(anchoBase + proy) * ks * (1 + 0.5 * dme)} ry={17 * ks} opacity={L.sombraOp} />
            <ellipse cx={0} cy={3} rx={70 * ks * (1 + 0.5 * dme)} ry={10 * ks} opacity={L.sombraOp * 0.7} />
          </g>
        ) : !sombra && <ellipse cx={0} cy={4} rx={110} ry={16} fill="rgba(20,10,40,.28)" />}
        {dme > 0 && (
          <g>
            <ellipse cx={0} cy={0} rx={60 + 190 * dme} ry={10 + 22 * dme} fill={c(r0.tunica2)} />
            <ellipse cx={-30 * dme} cy={-2} rx={30 + 110 * dme} ry={6 + 12 * dme} fill={c(r0.piel)} />
          </g>
        )}
        <g transform={`translate(${tiembla} 0) scale(${(flip ? -1 : 1) * sx} ${sy}) rotate(${inclina} 0 -200) translate(0 ${bote + salto})`}>
          {/* líneas de velocidad (correr) */}
          {corre > 0 && !sombra && [0, 1, 2].map((i) => {
            const k = (t * corre * 2 + i / 3) % 1;
            return <line key={i} x1={-150 - k * 60} y1={-330 + i * 70} x2={-150 - k * 60 - 110 * (1 - k)} y2={-330 + i * 70} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.55 * (1 - k)} />;
          })}
          {/* piernas */}
          {([-1, 1] as const).map((s) => {
            const [hx, hy, kx, ky, px, py] = pierna2(s);
            const pie = G.pie + (corre ? 10 : 0);
            return (
              <g key={s}>
                <path d={`M ${hx} ${hy} L ${kx} ${ky} L ${px} ${py}`} stroke={c(r0.piel2)} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {conLuz && <path d={`M ${hx + ls * 9} ${hy + 20} L ${kx + ls * 9} ${ky} L ${px + ls * 9} ${py - 14}`} stroke={L.borde} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={L.bordeOp * 0.8} />}
                <path d={`M ${px - 22 + pie * 0.4} ${py + 10} Q ${px + pie * 0.5} ${py - 14} ${px + 24 + pie} ${py + 10} Z`} fill={c("#6b3a1f")} />
                {!sombra && postura === "parado" && !corre && <line x1={px - 14} y1={py - 28} x2={px + 14} y2={py - 18} stroke={T("#6b3a1f")} strokeWidth={5} />}
              </g>
            );
          })}
          {postura === "sentado" && giro !== "perfil" && <ellipse cx={giro === "34" ? 14 : 0} cy={caderaY + 6} rx={96 * G.tor} ry={30} fill={tun} />}
          {postura !== "parado" && !corre && ([-1, 1] as const).map((s) => { const q = pierna2(s); return <circle key={s} cx={q[2]} cy={q[3]} r={17} fill={c(r0.piel2)} />; })}
          <g transform={`translate(0 ${baja})`}>
            {/* brazo de atrás */}
            <Brazo s={-1} a={bI} codo={cI} mano={p.manoI} agarra={p.agarraI} rot={p.agarraRotI} ang={p.agarraAngI} />
            {/* torso (más angosto de perfil) */}
            <g transform={`scale(${G.tor} 1)`}>
              <path d={`M -64 ${-338 + respira} Q 0 ${-352 + respira} 64 ${-338 + respira} L 88 -172 Q 0 -150 -88 -172 Z`} fill={tun} />
              {casco !== "no" && !sombra && !espalda && (
                <g>
                  <path d={`M -62 ${-330 + respira} L 62 ${-330 + respira} L 66 -240 L -66 -240 Z`} fill={T("#b9c2cf")} opacity={0.92} />
                  {[0, 1, 2, 3].map((i) => <line key={i} x1={-64} y1={-310 + i * 22 + respira * 0.5} x2={64} y2={-310 + i * 22 + respira * 0.5} stroke={T("#7d8796")} strokeWidth={4} />)}
                </g>
              )}
              {casco !== "no" && !sombra && espalda && [0, 1, 2, 3].map((i) => <rect key={i} x={-64} y={-326 + i * 22 + respira * 0.5} width={128} height={16} rx={4} fill={T(i % 2 ? "#9aa4b2" : "#b9c2cf")} />)}
              {conLuz && (
                <g>
                  {/* volumen: franja oscura del lado de la sombra + luz de borde del lado del sol */}
                  <path d={`M ${-ls * 64} ${-338 + respira} L ${-ls * 20} ${-346 + respira} L ${-ls * 34} -162 L ${-ls * 88} -172 Z`} fill="#1d0f33" opacity={L.forma} />
                  <line x1={ls * 60} y1={-332 + respira} x2={ls * 84} y2={-178} stroke={L.borde} strokeWidth={11} strokeLinecap="round" opacity={L.bordeOp} />
                </g>
              )}
              <rect x={-74} y={-238} width={148} height={20} rx={6} fill={c(r0.cinto)} />
              {!sombra && !espalda && <circle cx={giro === "perfil" ? 40 : 0} cy={-228} r={9} fill={T("#e8b84a")} />}
            </g>
            {/* cuello y cabeza */}
            <rect x={-20} y={-372} width={40} height={40} fill={c(r0.piel2)} />
            <g transform={`translate(0 ${respira * 0.6}) rotate(${ladea} 0 -360)`}>
              {G.orejas.map((ox) => <circle key={ox} cx={ox} cy={-440} r={18} fill={c(r0.piel2)} />)}
              <ellipse cx={0} cy={-450} rx={100} ry={104} fill={piel} />
              {conLuz && (
                <g clipPath={`url(#${id}cab)`}>
                  {/* lado oscuro de la cabeza (media luna) y luz de borde del lado del sol */}
                  <path d={cabezaD(0) + " " + cabezaD(ls * 44, -10)} fillRule="evenodd" fill="#1d0f33" opacity={L.forma} />
                  <path d={cabezaD(0) + " " + cabezaD(-ls * 16, 6)} fillRule="evenodd" fill={L.borde} opacity={L.bordeOp} />
                </g>
              )}
              {/* pelo (rulos); de espaldas tapa toda la nuca */}
              {casco === "no" && rx !== "susto" && (
                <g fill={c(p.viejo ? "#c9c4c0" : r0.pelo)} transform={`translate(${-fx * 0.35} 0)`}>
                  <path d="M -100 -452 Q -104 -560 0 -560 Q 104 -560 100 -452 Q 86 -500 40 -506 Q 0 -488 -44 -506 Q -88 -500 -100 -452 Z" />
                  {[-78, -46, -14, 18, 50, 80].map((cx, i) => <circle key={i} cx={cx} cy={-540 + Math.abs(cx) * 0.25} r={26} />)}
                </g>
              )}
              {espalda && !sombra && (
                <g fill={p.viejo ? T("#c9c4c0") : ropa.pelo}>
                  <path d="M -102 -452 Q -100 -360 0 -350 Q 100 -360 102 -452 Q 104 -520 0 -540 Q -104 -520 -102 -452 Z" />
                  {[-70, -35, 0, 35, 70].map((cx) => <circle key={cx} cx={cx} cy={-362 + Math.abs(cx) * 0.12} r={22} />)}
                </g>
              )}
              {/* susto: pelo de punta */}
              {rx === "susto" && !sombra && (
                <g fill={p.viejo ? "#c9c4c0" : ropa.pelo}>
                  <path d="M -100 -452 Q -104 -560 0 -560 Q 104 -560 100 -452 Q 60 -520 0 -524 Q -60 -520 -100 -452 Z" />
                  {Array.from({ length: 9 }, (_, i) => {
                    const a = ((-155 + i * 16.25) * Math.PI) / 180;
                    const k = sat(rt / 0.18);
                    const lg = (60 + (i % 2) * 40) * k + Math.sin(t * 50 + i) * 6;
                    const bx = Math.cos(a) * 96, by = -450 + Math.sin(a) * 100;
                    const px = -Math.sin(a) * 14, py = Math.cos(a) * 14;
                    return <path key={i} d={`M ${bx - px} ${by - py} L ${bx + Math.cos(a) * lg} ${by + Math.sin(a) * lg} L ${bx + px} ${by + py} Z`} />;
                  })}
                </g>
              )}
              {!sombra && !espalda && (
                <g>
                  {/* mejillas */}
                  {G.ojos.map(([ex, k]) => <ellipse key={ex} cx={ex + (ex < fx ? -18 : 18) * k} cy={-412} rx={18 * k} ry={11} fill="#ff6f6f" opacity={0.3} />)}
                  {/* ojos */}
                  {G.ojos.map(([ex, k]) => {
                    const ey = -452;
                    let esc = expr === "sorpresa" || expr === "miedo" ? 1.18 : expr === "enojado" ? 0.85 : 1;
                    let pr = expr === "miedo" ? 11 : 15, dy = 0;
                    if (rx === "ojos") {
                      const e = 1 - Math.exp(-rt * 7) * Math.cos(rt * 22);
                      esc = 1 + 1.35 * Math.max(0, e); pr = 7; dy = -18 * Math.max(0, e);
                    }
                    if (parp < 0.2)
                      return <path key={ex} d={`M ${ex - 20 * k} ${ey} Q ${ex} ${ey + 10} ${ex + 20 * k} ${ey}`} stroke={ojos} strokeWidth={6} fill="none" strokeLinecap="round" />;
                    return (
                      <g key={ex} transform={`translate(${ex} ${ey + dy}) scale(${esc * k} ${esc * parp})`}>
                        {rx === "ojos" && <ellipse cx={0} cy={0} rx={27} ry={32} fill="#2a1530" />}
                        <ellipse cx={0} cy={0} rx={23} ry={28} fill="#fff" />
                        {rx === "ojos" && <path d="M -20 -6 l 8 3 M 20 -8 l -8 4 M -16 14 l 7 -4 M 18 12 l -7 -3" stroke="#e8344a" strokeWidth={2.5} />}
                        <circle cx={(mira + sac) * 8 + (fx ? 4 : 0)} cy={4 + miraY * 8} r={pr} fill={ojos} />
                        <circle cx={(mira + sac) * 8 + 5 + (fx ? 4 : 0)} cy={-3 + miraY * 8} r={pr * 0.37} fill="#fff" />
                      </g>
                    );
                  })}
                  {/* cejas */}
                  {G.ojos.map(([ex, k]) => {
                    const s = ex < fx || G.ojos.length === 1 ? (G.ojos.length === 1 ? 1 : -1) : 1;
                    const sube = rx === "ojos" ? -30 : 0;
                    return <line key={ex} x1={ex + s * 22 * k} y1={-494 + ce + sube} x2={ex - s * 20 * k} y2={-494 + ci + sube} stroke={p.viejo ? "#9c958f" : ropa.pelo} strokeWidth={9} strokeLinecap="round" />;
                  })}
                  {/* nariz */}
                  {giro === "perfil"
                    ? <path d="M 92 -448 Q 126 -428 96 -414" fill={ropa.piel} stroke={ropa.piel2} strokeWidth={5} strokeLinecap="round" />
                    : <path transform={`translate(${fx * 1.25} 0)`} d="M -6 -428 Q 0 -414 8 -424" stroke={ropa.piel2} strokeWidth={5} fill="none" strokeLinecap="round" />}
                  {/* boca */}
                  <g transform={`translate(${giro === "perfil" ? 58 : fx * 0.95} 0)${giro === "perfil" ? " scale(0.62 1)" : ""}`}>
                    {rx === "mandibula" ? null : expr === "sorpresa" || bocaAbre > 0.15 ? (
                      <ellipse cx={0} cy={-388} rx={expr === "sorpresa" ? 13 : 15} ry={expr === "sorpresa" ? 17 : 4 + bocaAbre * 13} fill="#5a1a22" />
                    ) : (
                      <path d={BOCA[expr]} stroke="#5a1a22" strokeWidth={6} fill={expr === "feliz" || expr === "miedo" ? "#5a1a22" : "none"} strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </g>
                  {p.viejo && <path transform={`translate(${fx} 0)`} d="M -60 -470 Q -40 -476 -20 -470 M 20 -470 Q 40 -476 60 -470" stroke={ropa.piel2} strokeWidth={4} fill="none" />}
                  {casco === "centurion" && <path transform={`translate(${fx * 0.6} 0)`} d="M -70 -392 Q 0 -340 70 -392 Q 60 -360 0 -350 Q -60 -360 -70 -392 Z" fill="#2a1a10" opacity={0.55} />}
                </g>
              )}
              {/* casco (se vuela con el susto) */}
              {casco !== "no" && (
                <g transform={`translate(${-fx * 0.25} ${-46 + (rx === "susto" ? -110 * sat(rt / 0.2) + Math.sin(t * 30) * 6 : 0)})`}>
                  {casco === "centurion" && (
                    <g transform={giro === "perfil" ? "scale(0.35 1)" : giro === "34" ? "scale(0.75 1)" : undefined}>
                      <ellipse cx={0} cy={-566} rx={150} ry={34} fill={c("#c81d2e")} />
                      {[...Array(13)].map((_, i) => <line key={i} x1={-140 + i * 23} y1={-588} x2={-136 + i * 23} y2={-546} stroke={c("#8e0f1f")} strokeWidth={5} />)}
                      <rect x={-10} y={-560} width={20} height={20} fill={c(`url(#${id}bronce)`)} />
                    </g>
                  )}
                  {casco === "legion" && <rect x={-8} y={-576} width={16} height={26} rx={6} fill={c("#8a5414")} />}
                  <path d="M -104 -450 Q -106 -556 0 -556 Q 106 -556 104 -450 L 112 -446 L -112 -446 Z" fill={c(`url(#${id}bronce)`)} />
                  {giro !== "perfil" && <path d="M -104 -450 L -92 -380 L -66 -392 L -72 -446 Z" fill={c("#b87a22")} />}
                  {(giro === "frente" || giro === "espalda") && <path d="M 104 -450 L 92 -380 L 66 -392 L 72 -446 Z" fill={c("#b87a22")} />}
                  {giro === "perfil" && <path d="M -10 -450 L 2 -380 L 28 -392 L 22 -446 Z" fill={c("#b87a22")} />}
                  {(giro === "perfil" || giro === "espalda") && <path d="M -104 -450 L -116 -404 L -60 -420 L -50 -446 Z" fill={c("#8a5414")} />}
                  <path d="M -112 -446 L 112 -446 L 118 -436 L -118 -436 Z" fill={c("#8a5414")} />
                  {!sombra && <path d="M -60 -530 Q -20 -548 20 -540" stroke="#fff3c4" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />}
                  {conLuz && <path d={`M ${ls * 58} -538 Q ${ls * 100} -516 ${ls * 106} -452`} stroke={L.borde} strokeWidth={9} fill="none" strokeLinecap="round" opacity={L.bordeOp} />}
                </g>
              )}
              {/* mandíbula al piso */}
              {rx === "mandibula" && !sombra && (() => {
                const j = Math.min(1.12, Math.max(0, 1 - Math.exp(-rt * 6) * Math.cos(rt * 13)));
                const largo = 26 + j * 150, x0 = giro === "perfil" ? 40 : fx * 0.95;
                return (
                  <g transform={`translate(${x0} 0)`}>
                    <rect x={-44} y={-404} width={88} height={largo} rx={40} fill="#5a1a22" />
                    <rect x={-30} y={-402} width={60} height={12} rx={4} fill="#fff" />
                    <ellipse cx={0} cy={-404 + largo - 22} rx={26} ry={16} fill="#e8586a" />
                    <rect x={-30} y={-404 + largo - 12} width={60} height={10} rx={4} fill="#fff" />
                    <ellipse cx={0} cy={-404 + largo + 8} rx={52} ry={24} fill={piel} />
                  </g>
                );
              })()}
            </g>
            {/* brazo de adelante */}
            <Brazo s={1} a={bD} codo={cD} mano={p.manoD} agarra={p.agarra} rot={p.agarraRot} ang={p.agarraAng} />
          </g>
          {/* gotas al derretirse */}
          {dme > 0.05 && !sombra && [-60, 10, 70].map((gx, i) => {
            const k = ((rt * 0.8 + i * 0.33) % 1);
            return <path key={i} transform={`translate(${gx} ${-170 + baja + k * 140 * dme})`} d="M 0 -16 Q 12 4 0 12 Q -12 4 0 -16 Z" fill={ropa.tunica2} opacity={1 - k} />;
          })}
        </g>
      </g>
    </svg>
  );
};
