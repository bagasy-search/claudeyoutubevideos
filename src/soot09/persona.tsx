import React from "react";
import { rnd } from "../soot/lib";
import { invK } from "./invierno";

// Personaje vector riggeado de Soot v3 (todo en código): cabezón con ojos grandes, ropa con degradé,
// brazos con hombro + codo, piernas que caminan, parpadeo, boca que habla y 8 expresiones.
// Origen = entre los pies; mide ~560 u de alto (escala con `h`).
export type Expr = "neutro" | "feliz" | "miedo" | "triste" | "enojado" | "sorpresa" | "dormido" | "orgullo";
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
  sombra?: string; gorro?: "sombrero" | "morion" | "gorra" | "pluma" | "copa"; gola?: boolean; barba?: string; flaco?: number; plumaPelo?: boolean; capa?: string; manoD?: React.ReactNode; manoI?: React.ReactNode; inclina?: number; opacity?: number; aparece?: number; ladea?: number; salta?: number;
};

const BOCA: Record<Expr, string> = {
  neutro: "M -15 -390 Q 0 -391 15 -389",
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

export const Persona: React.FC<Props> = (p) => {
  const { x, y, h = 560, t, seed = 1, ropa = LUCIUS, expr: expr0 = "neutro", habla = false, camina = 0, mira = 0, miraY = 0, flip = false, casco = "no", sombra, inclina = 0, opacity = 1 } = p;
  // en el invierno del hambre nadie sonríe
  const expr: Expr = expr0 === "feliz" && invK(t) > 0.5 ? "triste" : expr0;
  const id = `p${seed}`;
  const S = h / 560;
  const r = React.useMemo(() => rnd(seed * 31 + 5), [seed]);
  const desfase = React.useMemo(() => r() * 10, [r]);
  // parpadeo: cada ~3,1 s con un desfase propio
  const ciclo = (t + desfase) % 3.1;
  const parp = expr === "dormido" ? 0.08 : ciclo < 0.12 ? 0.12 : 1;
  const respira = Math.sin((t + desfase) * 2.2) * 3;
  // entrada con anticipación: crece desde los pies, se estira y se aplasta (squash & stretch)
  const ap = p.aparece === undefined ? 1 : t < p.aparece ? 0 : 1;
  const la = p.aparece === undefined ? 9 : t - p.aparece;
  const sy = la < 0.6 ? 1 + Math.sin(la * 16) * Math.exp(-la * 6) * 0.22 : 1;
  const sx = la < 0.6 ? 1 - Math.sin(la * 16) * Math.exp(-la * 6) * 0.14 : 1;
  const crece = p.aparece === undefined ? 1 : Math.min(1, la / 0.12);
  // salto: rebote vertical que decae (sorpresa, alegría)
  const sl = p.salta === undefined || t < p.salta ? 0 : t - p.salta;
  const salto = sl > 0 && sl < 0.7 ? -Math.abs(Math.sin(sl * 9)) * Math.exp(-sl * 4) * 80 : 0;
  // los ojos se mueven solos (micro sacadas) y la cabeza acompaña la respiración
  const sac = Math.round(Math.sin((t + desfase) * 0.9) * 2) * 0.12;
  const ladea = (p.ladea ?? 0) + Math.sin((t + desfase) * 1.1) * 2;
  const fase = camina * t * Math.PI * 2;
  const pierna = camina ? Math.sin(fase) * 24 : 0;
  const bote = camina ? Math.abs(Math.sin(fase)) * -10 : 0;
  const balanceo = camina ? Math.sin(fase) * 22 : 0;
  const bI = (p.bI ?? 8) + (camina ? -balanceo : Math.sin((t + desfase) * 1.7) * 2);
  const bD = (p.bD ?? 8) + (camina ? balanceo : Math.sin((t + desfase) * 1.5 + 1) * 2);
  const cI = p.cI ?? 10, cD = p.cD ?? 10;
  const bocaAbre = habla ? 0.5 + 0.5 * Math.sin(t * 17 + desfase) * Math.sin(t * 7.3) : 0;
  const c = (v: string) => sombra ?? v;
  const fl = p.flaco ?? 0;
  const tw = 1 - fl * 0.28;
  const piel = sombra ?? `url(#${id}piel)`;
  const tun = sombra ?? `url(#${id}tun)`;
  const ojos = ropa.ojos ?? "#3b2416";
  const [ce, ci] = CEJA[expr];

  const Brazo = ({ s, a, codo, mano }: { s: 1 | -1; a: number; codo: number; mano?: React.ReactNode }) => (
    <g transform={`translate(${s * 66} -322) rotate(${-s * a})`}>
      <line x1={0} y1={0} x2={0} y2={92} stroke={c(ropa.tunica2)} strokeWidth={40} strokeLinecap="round" />
      <g transform={`translate(0 92) rotate(${-s * codo})`}>
        <line x1={0} y1={0} x2={0} y2={78} stroke={piel === sombra ? sombra : c(ropa.piel)} strokeWidth={30} strokeLinecap="round" />
        <circle cx={0} cy={86} r={19} fill={c(ropa.piel)} />
        {mano && <g transform="translate(0 86)">{mano}</g>}
      </g>
    </g>
  );

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
          <stop offset="0" stopColor="#ffd77a" /><stop offset="0.5" stopColor="#d9962e" /><stop offset="1" stopColor="#8a5414" />
        </linearGradient>
      </defs>
      <g transform={`scale(${(flip ? -1 : 1) * sx * crece * ap} ${sy * crece * ap}) rotate(${inclina} 0 -200) translate(0 ${bote + salto})`}>
        {!sombra && <ellipse cx={0} cy={4} rx={110} ry={16} fill="rgba(20,10,40,.28)" />}
        {/* piernas */}
        {[-1, 1].map((s) => (
          <g key={s} transform={`rotate(${s * pierna} ${s * 28} -190)`}>
            <line x1={s * 28} y1={-190} x2={s * 30} y2={-12} stroke={c(ropa.piel2)} strokeWidth={30} strokeLinecap="round" />
            <path d={`M ${s * 30 - 22} -2 Q ${s * 30} -26 ${s * 30 + 24} -2 Z`} fill={c("#6b3a1f")} />
            {!sombra && <line x1={s * 30 - 14} y1={-40} x2={s * 30 + 14} y2={-30} stroke="#6b3a1f" strokeWidth={5} />}
          </g>
        ))}
        {/* brazo de atrás */}
        <Brazo s={-1} a={bI} codo={cI} mano={p.manoI} />
        {/* túnica */}
        <g transform={`scale(${tw} 1)`}><path d={`M -64 ${-338 + respira} Q 0 ${-352 + respira} 64 ${-338 + respira} L 88 -172 Q 0 -150 -88 -172 Z`} fill={tun} />
        {!sombra && p.capa && <path d={`M -70 ${-336 + respira} L -96 -150 L -60 -160 Z M 70 ${-336 + respira} L 96 -150 L 60 -160 Z`} fill={p.capa} />}
        {!sombra && !p.gorro?.includes("pluma") && p.gorro !== undefined && [0, 1, 2, 3].map((i) => <circle key={i} cx={0} cy={-320 + i * 30 + respira * 0.4} r={6} fill="#f0d27a" />)}</g>
        {casco !== "no" && !sombra && (
          <g>
            <path d={`M -62 ${-330 + respira} L 62 ${-330 + respira} L 66 -240 L -66 -240 Z`} fill="#b9c2cf" opacity={0.92} />
            {[0, 1, 2, 3].map((i) => <line key={i} x1={-64} y1={-310 + i * 22 + respira * 0.5} x2={64} y2={-310 + i * 22 + respira * 0.5} stroke="#7d8796" strokeWidth={4} />)}
          </g>
        )}
        <rect x={-74} y={-238} width={148} height={20} rx={6} fill={c(ropa.cinto)} />
        {!sombra && <circle cx={0} cy={-228} r={9} fill="#e8b84a" />}
        {/* cuello y cabeza */}
        <rect x={-20} y={-372} width={40} height={40} fill={c(ropa.piel2)} />
        <g transform={`translate(0 ${respira * 0.6}) rotate(${ladea} 0 -360)`}>
          <circle cx={-96} cy={-440} r={18} fill={c(ropa.piel2)} />
          <circle cx={96} cy={-440} r={18} fill={c(ropa.piel2)} />
          <ellipse cx={0} cy={-450} rx={100} ry={104} fill={piel} />
          {/* pelo (rulos) */}
          {casco === "no" && p.plumaPelo && (
            <g fill={c(ropa.pelo)}>
              <path d="M -100 -452 Q -104 -540 -30 -556 L 30 -556 Q 104 -540 100 -452 Q 86 -500 40 -506 Q 0 -500 -44 -506 Q -88 -500 -100 -452 Z" />
              <path d="M -24 -556 Q 0 -600 24 -556 Z" />
              {!sombra && <path d="M 30 -560 Q 70 -640 52 -690 Q 30 -630 18 -566 Z" fill="#c8402c" />}
              <path d="M -100 -450 Q -116 -380 -96 -300 L -80 -300 Q -92 -380 -86 -450 Z" />
            </g>
          )}
          {casco === "no" && !p.plumaPelo && (
            <g fill={c(p.viejo ? "#c9c4c0" : ropa.pelo)}>
              <path d="M -100 -452 Q -104 -560 0 -560 Q 104 -560 100 -452 Q 86 -500 40 -506 Q 0 -488 -44 -506 Q -88 -500 -100 -452 Z" />
              {[-78, -46, -14, 18, 50, 80].map((cx, i) => <circle key={i} cx={cx} cy={-540 + Math.abs(cx) * 0.25} r={26} />)}
            </g>
          )}
          {!sombra && (
            <g>
              {/* mejillas */}
              <ellipse cx={-56} cy={-412} rx={18} ry={11} fill="#ff6f6f" opacity={0.3} />
              <ellipse cx={56} cy={-412} rx={18} ry={11} fill="#ff6f6f" opacity={0.3} />
              {/* ojos */}
              {[-1, 1].map((s) => {
                const ex = s * 38, ey = -452;
                const esc = expr === "sorpresa" || expr === "miedo" ? 1.18 : expr === "enojado" ? 0.85 : 1;
                if (parp < 0.2)
                  return <path key={s} d={`M ${ex - 20} ${ey} Q ${ex} ${ey + 10} ${ex + 20} ${ey}`} stroke={ojos} strokeWidth={6} fill="none" strokeLinecap="round" />;
                return (
                  <g key={s} transform={`translate(${ex} ${ey}) scale(${esc} ${esc * parp})`}>
                    <ellipse cx={0} cy={0} rx={23} ry={28} fill="#fff" />
                    <circle cx={(mira + sac) * 8} cy={4 + miraY * 8} r={expr === "miedo" ? 11 : 15} fill={ojos} />
                    <circle cx={(mira + sac) * 8 + 5} cy={-3 + miraY * 8} r={5.5} fill="#fff" />
                  </g>
                );
              })}
              {/* cejas */}
              {[-1, 1].map((s) => (
                <line key={s} x1={s * 60} y1={-494 + ce} x2={s * 18} y2={-494 + ci} stroke={p.viejo ? "#9c958f" : ropa.pelo} strokeWidth={9} strokeLinecap="round" />
              ))}
              {/* nariz */}
              <path d="M -6 -428 Q 0 -414 8 -424" stroke={ropa.piel2} strokeWidth={5} fill="none" strokeLinecap="round" />
              {/* boca */}
              {expr === "sorpresa" || bocaAbre > 0.15 ? (
                <ellipse cx={0} cy={-388} rx={expr === "sorpresa" ? 13 : 15} ry={expr === "sorpresa" ? 17 : 4 + bocaAbre * 13} fill="#5a1a22" />
              ) : (
                <path d={BOCA[expr]} stroke="#5a1a22" strokeWidth={6} fill={expr === "feliz" || expr === "miedo" ? "#5a1a22" : "none"} strokeLinecap="round" strokeLinejoin="round" />
              )}
              {fl > 0 && <g opacity={fl * 0.55}><ellipse cx={-38} cy={-424} rx={26} ry={9} fill="#6a3a4a" /><ellipse cx={38} cy={-424} rx={26} ry={9} fill="#6a3a4a" /><path d="M -84 -420 Q -70 -380 -50 -366 M 84 -420 Q 70 -380 50 -366" stroke="#9a5a50" strokeWidth={5} fill="none" /></g>}
              {p.barba && <path d="M -78 -420 Q -80 -330 0 -318 Q 80 -330 78 -420 Q 60 -372 0 -372 Q -60 -372 -78 -420 Z" fill={p.barba} />}
              {p.viejo && <path d="M -60 -470 Q -40 -476 -20 -470 M 20 -470 Q 40 -476 60 -470" stroke={ropa.piel2} strokeWidth={4} fill="none" />}
              {casco === "centurion" && <path d="M -70 -392 Q 0 -340 70 -392 Q 60 -360 0 -350 Q -60 -360 -70 -392 Z" fill="#2a1a10" opacity={0.55} />}
            </g>
          )}
          {/* casco */}
          {casco !== "no" && (
            <g transform="translate(0 -46)">
              {casco === "centurion" && (
                <g>
                  <ellipse cx={0} cy={-566} rx={150} ry={34} fill={c("#c81d2e")} />
                  {[...Array(13)].map((_, i) => <line key={i} x1={-140 + i * 23} y1={-588} x2={-136 + i * 23} y2={-546} stroke={c("#8e0f1f")} strokeWidth={5} />)}
                  <rect x={-10} y={-560} width={20} height={20} fill={c(`url(#${id}bronce)`)} />
                </g>
              )}
              {casco === "legion" && <rect x={-8} y={-576} width={16} height={26} rx={6} fill={c("#8a5414")} />}
              <path d="M -104 -450 Q -106 -556 0 -556 Q 106 -556 104 -450 L 112 -446 L -112 -446 Z" fill={c(`url(#${id}bronce)`)} />
              <path d="M -104 -450 L -92 -380 L -66 -392 L -72 -446 Z" fill={c("#b87a22")} />
              <path d="M 104 -450 L 92 -380 L 66 -392 L 72 -446 Z" fill={c("#b87a22")} />
              <path d="M -112 -446 L 112 -446 L 118 -436 L -118 -436 Z" fill={c("#8a5414")} />
              {!sombra && <path d="M -60 -530 Q -20 -548 20 -540" stroke="#fff3c4" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />}
            </g>
          )}
          {p.gorro === "sombrero" && <g fill={c("#3a2a22")}><ellipse cx={0} cy={-532} rx={150} ry={26} /><path d="M -84 -536 Q -80 -640 0 -646 Q 80 -640 84 -536 Z" />{!sombra && <rect x={-84} y={-560} width={168} height={18} fill="#8a5a2a" />}</g>}
          {p.gorro === "copa" && <g fill={c("#26201e")}><ellipse cx={0} cy={-532} rx={136} ry={22} /><path d="M -78 -536 L -70 -680 Q 0 -694 70 -680 L 78 -536 Z" />{!sombra && <rect x={-78} y={-566} width={156} height={20} fill="#c9a24a" />}</g>}
          {p.gorro === "gorra" && <g fill={c("#5a3a5a")}><path d="M -104 -470 Q -110 -580 0 -582 Q 120 -580 112 -500 Q 60 -540 -104 -470 Z" /></g>}
          {p.gorro === "pluma" && <g><path d="M -104 -470 Q -110 -580 0 -582 Q 120 -580 112 -500 Q 60 -540 -104 -470 Z" fill={c("#1e1a2e")} />{!sombra && <path d="M 60 -560 Q 170 -660 200 -600 Q 140 -600 76 -546 Z" fill="#f2ead8" />}</g>}
          {p.gorro === "morion" && <g><path d="M -150 -500 Q 0 -470 150 -500 Q 120 -520 96 -530 Q 90 -640 0 -650 Q -90 -640 -96 -530 Q -120 -520 -150 -500 Z" fill={c("#b9c2cf")} /><path d="M -10 -650 Q 0 -700 10 -650 Z" fill={c("#9aa4b2")} />{!sombra && <path d="M -60 -600 Q -20 -630 30 -626" stroke="#fff" strokeWidth={8} fill="none" opacity={0.7} strokeLinecap="round" />}</g>}
        </g>
        {p.gola && !sombra && <g transform={`translate(0 ${respira * 0.6})`}><ellipse cx={0} cy={-344} rx={82} ry={24} fill="#fbf6ea" />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-72 + i * 13} -360 Q ${-66 + i * 13} -330 ${-60 + i * 13} -360`} stroke="#d8cfbd" strokeWidth={3} fill="none" />)}</g>}
        {/* brazo de adelante */}
        <Brazo s={1} a={bD} codo={cD} mano={p.manoD} />
      </g>
    </svg>
  );
};
