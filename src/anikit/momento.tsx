// MOMENTOS DEL DÍA para CUALQUIER set: noche, lluvia, amanecer. Sin tocar los sets: se corre la paleta y se suman capas.
//   <Escena Set={Cocina} pal={PALETAS.whatif} momento="noche" … />        ← lo más simple (Escena lo aplica sola)
//   const CocinaNoche = conMomento(Cocina, "noche")                          ← o un set nuevo para usar en otro lado
//   luzMomento("noche") → la `luz` que conviene darle a los Actores para que peguen con el set
// noche: cielo azul profundo con estrellas y luna, el set baja y se enfría, ventanas y lámparas siguen prendidas.
// lluvia: cielo gris, nubes pesadas, lluvia (por delante en exteriores; detrás de las ventanas en interiores) y charcos.
// amanecer: cielo violeta→rosa→durazno, sol bajo en el horizonte, todo apenas más cálido.
// El velo de tono va en la capa del set, DEBAJO de los actores: ellos quedan nítidos (nada de filtros sobre todo el cuadro).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Lluvia } from "./luz";
import { Paleta } from "./paletas";
import { LuzP } from "./personaje";
import { Aula } from "./sets/aula";
import { Cocina } from "./sets/cocina";
import { Cielo, mezclar, Nube, SetProps, acl } from "./sets/comun";
import { Lab } from "./sets/lab";
import { Supermercado } from "./sets/super";

export type Momento = "noche" | "lluvia" | "amanecer";
const INTERIORES = new Set<React.FC<any>>([Cocina, Aula, Lab, Supermercado]);

export const palMomento = (pal: Paleta, m: Momento): Paleta => {
  const mz = (c: string, a: string, t: number) => mezclar(c, a, t);
  if (m === "noche") return {
    ...pal, cielo: ["#060a1a", "#111a3a", "#22305a"], fachada: pal.fachada.map((c) => mz(c, "#18224a", 0.45)), ladrillo: mz(pal.ladrillo, "#18224a", 0.45),
    piso: mz(pal.piso, "#141a30", 0.4), vereda: mz(pal.vereda, "#141a30", 0.4), calle: mz(pal.calle, "#0e1224", 0.4), luzFria: "#a8c0ff", ventanaApagada: mz(pal.ventanaApagada, "#0e1224", 0.4),
  };
  if (m === "lluvia") return {
    ...pal, cielo: ["#29313c", "#414c59", "#636e7b"], fachada: pal.fachada.map((c) => mz(c, "#56606c", 0.35)), ladrillo: mz(pal.ladrillo, "#56606c", 0.35),
    piso: mz(pal.piso, "#3a434e", 0.3), vereda: mz(pal.vereda, "#3a434e", 0.3), calle: mz(pal.calle, "#22282f", 0.3), luzFria: "#b8c8d8",
  };
  return {
    ...pal, cielo: ["#4a5696", "#e08c98", "#ffd0a0"], fachada: pal.fachada.map((c) => mz(c, "#ffb08a", 0.15)), ladrillo: mz(pal.ladrillo, "#ffb08a", 0.15),
    luz: "#ffd2a8", luzFria: "#c0c8ff",
  };
};

// luz para los Actores en ese momento (borde de luz que pega con el set)
export const luzMomento = (m: Momento, lado: 1 | -1 = 1): LuzP =>
  m === "noche" ? { lado, color: "#a8c0ff", fuerza: 0.75 } : m === "lluvia" ? { lado, color: "#ffe2b8", fuerza: 0.95 } : { lado, color: "#ffc89a", fuerza: 0.9 };

// velo de distancia sobre lo lejano en exteriores (tapa el sol pintado en el set de tarde, baja las montañas)
const LEJOS: Record<Momento, [string, number]> = { noche: ["#0a1028", 0.55], lluvia: ["#4a5562", 0.68], amanecer: ["#f0a8a0", 0.18] };
// sets cuyo primer término es SÓLO luz de sol (haces, polvo): de noche o con lluvia no va
const FRENTE_DE_SOL = new Set<React.FC<any>>([Cocina]);
const VELO: Record<Momento, [string, number, number]> = { noche: ["#0a1430", 0.3, 0.26], lluvia: ["#26303c", 0.3, 0.1], amanecer: ["#ff9a7a", 0.08, 0.05] }; // color, exterior, interior

const Estrellas: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {Array.from({ length: 140 }).map((_, i) => {
      const x = -2400 + random(`es${i}`) * 9000, y = -760 + random(`ey${i}`) * 1180, r = 1.4 + random(`er${i}`) * 2.2;
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff6dc" opacity={0.35 + 0.35 * Math.sin(f / 26 + i * 1.7)} />;
    })}
  </g>
);

const cache = new WeakMap<React.FC<any>, Partial<Record<Momento, React.FC<any>>>>();
export const conMomento = (S: React.FC<any>, m: Momento, o: { interior?: boolean; piso?: number } = {}): React.FC<any> => {
  const ya = cache.get(S)?.[m];
  if (ya && o.interior === undefined && o.piso === undefined) return ya;
  const interior = o.interior ?? INTERIORES.has(S);
  const piso = o.piso ?? 900;
  const C: React.FC<SetProps & Record<string, unknown>> = (props) => {
    const { capa, f } = props;
    const pal = palMomento(props.pal, m);
    const base = <S {...props} pal={pal} />;
    if (capa === "lejos") {
      // interior: lo de lejos sólo se ve por las ventanas → se reemplaza por el cielo del momento (el sol de la tarde
      // pintado en el set no puede quedar de noche). Exterior: el set + un velo de distancia + lo propio del momento.
      const lx = interior ? 1420 : 300, ly = interior ? 300 : 150;
      return (
        <g>
          {interior ? <Cielo c={pal.cielo} x={-2500} w={9000} /> : base}
          {!interior && <rect x={-4000} y={-3000} width={14000} height={7000} fill={LEJOS[m][0]} opacity={LEJOS[m][1]} />}
          {m === "noche" && <><Estrellas f={f} /><Halo x={lx} y={ly} r={260} color="#c8d4ff" fuerza={0.3} /><circle cx={lx} cy={ly} r={52} fill="#f2f0e0" /></>}
          {m === "amanecer" && <><Halo x={interior ? 1420 : 1700} y={interior ? 560 : 760} r={900} color="#ffd8a0" fuerza={0.7} /><circle cx={interior ? 1420 : 1700} cy={interior ? 580 : 780} r={interior ? 90 : 120} fill="#fff1cf" /><rect x={-2500} y={interior ? 520 : 640} width={9000} height={260} fill="#ffc8a0" opacity={0.22} /></>}
          {m === "lluvia" && <>
            {[[-300, 60, 2.2], [600, 20, 2.6], [1500, 80, 2.4], [2500, 30, 2.8], [3400, 70, 2.2]].map(([x, y, s], i) => <Nube key={i} x={(x as number) + f * 0.2} y={y as number} s={s as number} color={acl(pal.cielo[1], 0.1)} o={0.85} />)}
            <g transform="translate(0,-500)"><Lluvia f={f} w={7000} h={1800} x0={-2000} n={500} seed={3} color={acl(pal.luzFria, 0.3)} largo={1.6} /></g>
          </>}
        </g>
      );
    }
    if (capa === "medio") {
      const [vc, vext, vint] = VELO[m];
      return (
        <g>
          {base}
          <rect x={-4000} y={-3000} width={14000} height={7000} fill={vc} opacity={interior ? vint : vext} />
          {m === "lluvia" && !interior && [[200, 260], [1300, 180], [2400, 300], [3500, 220]].map(([x, rx], i) => <Charco key={i} x={x} y={piso + 40 + (i % 2) * 30} rx={rx} color={pal.luz} fuerza={0.3} />)}
        </g>
      );
    }
    return (
      <g>
        {!(m !== "amanecer" && FRENTE_DE_SOL.has(S)) && base}
        {m === "lluvia" && !interior && <g transform="translate(0,-450)"><Lluvia f={f} w={6400} h={1700} x0={-1400} n={700} seed={11} color={acl(pal.luzFria, 0.45)} largo={2.2} /></g>}
      </g>
    );
  };
  C.displayName = `${S.displayName ?? S.name ?? "Set"}_${m}`;
  if (o.interior === undefined && o.piso === undefined) cache.set(S, { ...(cache.get(S) ?? {}), [m]: C });
  return C;
};
