// SET · THOMSON Y LAS LÍNEAS (lc-b, Ep.3). Piso REP_PISO. Mundo útil x −700 … 6400.
//   la represa de Thomson sobre el río St. Louis (0…900, el agua cae por el vertedero) · la usina con la turbina
//   (1000…1450, `corte` muestra la turbina) · la subestación (1650…2350: transformadores, seccionadores, aisladores)
//   · el corredor de la línea hacia Duluth (2500…6400, postes en H cada 420 px). `caida` 0..1 = árboles sobre los cables,
//   postes torcidos, hielo en los cables; `banderas` = cuadro desde el que aparecen banderitas rojas poste por poste;
//   `zumbido` 0..1 = chispa/brillo de la línea viva (para el travelling antes del apagón).
import React from "react";
import { interpolate, random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Arbol, Cielo, Colinas, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { Banco, NieveCae } from "../mundo/comun";
import { Hora, LUCES } from "../mundo/hora";

export const REP_PISO = 900;
export const REP_PUNTOS = { represa: 450, usina: 1220, turbina: 1220, subestacion: 2000, linea: 3200, caida: 3800, fin: 6200 };
export const POSTES = Array.from({ length: 10 }).map((_, i) => 2550 + i * 420);

type P = SetProps & { hora?: Hora; corte?: number; caida?: number; banderas?: number; zumbido?: number; nieve?: number; cae?: boolean };

export const Represa: React.FC<P> = ({ capa, f, hora = "invierno", corte = 0, caida = 0, banderas, zumbido = 0, nieve = 0.8, cae = false }) => {
  const L = LUCES[hora];
  const P = REP_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} x={-2000} w={9000} />
        <Halo x={1800} y={L.solY} r={420} color={L.sol} fuerza={0.55} />
        <Colinas y={640} alto={180} color={mezclar("#5a6680", L.tinte, 0.4)} seed={11} x0={-2000} w={9000} />
        {Array.from({ length: 46 }).map((_, i) => <Arbol key={i} x={-1800 + i * 190 + random(`rt${i}`) * 70} y={690 + random(`ry${i}`) * 20} s={0.45 + random(`rs${i}`) * 0.3} tipo="pino" copa={mezclar("#2f4250", L.tinte, 0.3)} tronco="#2a2420" />)}
        <rect x={-2000} y={690} width={9000} height={1600} fill={mezclar(L.nieve, L.tinte, 0.15)} />
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {Array.from({ length: 8 }).map((_, i) => <Arbol key={i} x={-600 + i * 980 + random(`rf${i}`) * 200} y={P + 260} s={1.4} tipo="pino" copa={osc("#2f4250", 0.6)} tronco="#1a1416" />)}
        {cae && <NieveCae f={f} n={140} x0={-700} w={7200} viento={1.6} />}
      </g>
    );
  }
  const piedra = mezclar("#8a8a92", L.tinte, 0.25);
  return (
    <g>
      {/* suelo nevado y el río */}
      <rect x={-700} y={P - 30} width={7200} height={2000} fill={mezclar(L.nieve, L.tinte, 0.08)} />
      <rect x={-700} y={P - 20} width={2300} height={120} fill={L.lago[1]} />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-600 + ((i * 190 + f * 7) % 2200)} y={P + 10 + (i % 4) * 20} width={80} height={5} rx={3} fill={acl(L.lago[0], 0.45)} opacity={0.7} />)}
      {/* represa + vertedero */}
      <path d={`M-200,${P - 20} L-200,${P - 380} L900,${P - 380} L900,${P - 20} Z`} fill={piedra} />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-160 + i * 135} y={P - 400} width={60} height={60} fill={osc(piedra, 0.8)} />)}
      <rect x={-200} y={P - 410} width={1100} height={22} fill={osc(piedra, 0.7)} />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = -150 + i * 48;
        return <path key={i} d={`M${x},${P - 380} q10,${180} ${18},${360}`} stroke={acl(L.lago[0], 0.6)} strokeWidth={14} fill="none" strokeDasharray="40 30" strokeDashoffset={-f * 9 - i * 7} opacity={0.75} />;
      })}
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={-150 + random(`es${i}`) * 1050} cy={P - 30 - ((f * 2 + i * 23) % 70)} r={14 + random(`er${i}`) * 16} fill="#f4f6ff" opacity={0.5} />)}
      {/* usina */}
      <rect x={1000} y={P - 470} width={460} height={440} fill={mezclar("#7a5a4a", L.tinte, 0.3)} />
      <path d={`M980,${P - 470} L1230,${P - 560} L1480,${P - 470} Z`} fill={osc("#7a5a4a", 0.7)} />
      {[0, 1, 2].map((k) => <rect key={k} x={1040 + k * 140} y={P - 420} width={90} height={200} rx={45} fill={mezclar("#2a3040", L.tinte, 0.3)} />)}
      {corte > 0 && (
        <g opacity={corte}>
          <rect x={1020} y={P - 450} width={420} height={420} fill="#22262e" />
          <circle cx={1230} cy={P - 220} r={150} fill="#3a6a8a" />
          {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={1222} y={P - 360} width={16} height={130} rx={6} fill="#8fd3ff" transform={`rotate(${f * 4 + i * 45} 1230 ${P - 220})`} />)}
          <circle cx={1230} cy={P - 220} r={40} fill="#1d3a50" />
        </g>
      )}
      {/* subestación */}
      <g>
        <rect x={1640} y={P - 40} width={720} height={14} fill="#8a8a90" />
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={i}>
            <rect x={1680 + i * 170} y={P - 210} width={110} height={170} fill="#6a7480" />
            {[0, 1, 2].map((k) => <g key={k}><rect x={1690 + i * 170 + k * 34} y={P - 270} width={14} height={60} fill="#c9c4b8" />{[0, 1, 2].map((d) => <ellipse key={d} cx={1697 + i * 170 + k * 34} cy={P - 262 + d * 18} rx={14} ry={5} fill="#a9a49a" />)}</g>)}
          </g>
        ))}
        {[1650, 2350].map((x) => <rect key={x} x={x} y={P - 420} width={12} height={380} fill="#5a6270" />)}
        <rect x={1650} y={P - 420} width={712} height={10} fill="#5a6270" />
        {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={1640 + i * 30} y={P - 140} width={3} height={110} fill="#9a9aa2" />)}
      </g>
      {/* corredor de la línea */}
      {POSTES.map((x, i) => {
        const roto = caida > 0 && random(`pc${i}`) < 0.6;
        const tilt = roto ? caida * (random(`pt${i}`) * 26 - 13) : 0;
        const flag = banderas !== undefined && f > banderas + i * 6;
        return (
          <g key={i}>
            <g transform={`rotate(${tilt} ${x} ${P - 30})`}>
              <rect x={x - 60} y={P - 520} width={14} height={490} fill="#5a4232" />
              <rect x={x + 46} y={P - 520} width={14} height={490} fill="#5a4232" />
              <rect x={x - 90} y={P - 490} width={180} height={14} fill="#4a3426" />
              {[-70, 0, 70].map((d) => <rect key={d} x={x + d - 5} y={P - 512} width={10} height={24} fill="#c9c4b8" />)}
            </g>
            {flag && (
              <g>
                <rect x={x - 4} y={P - 140} width={6} height={110} fill="#2a2020" />
                <path d={`M${x + 2},${P - 140} L${x + 62 + Math.sin(f / 6 + i) * 6},${P - 124} L${x + 2},${P - 106} Z`} fill="#e23a2e" />
                <Halo x={x + 30} y={P - 124} r={60} color="#e23a2e" fuerza={0.35} />
              </g>
            )}
            {roto && caida > 0.1 && <g transform={`rotate(${-30 + random(`ta${i}`) * 20} ${x + 120} ${P - 40})`} opacity={caida}><rect x={x + 120} y={P - 60} width={420} height={34} rx={14} fill="#4a3426" />{[0, 1, 2].map((k) => <path key={k} d={`M${x + 260 + k * 90},${P - 50} l40,-60 M${x + 280 + k * 90},${P - 50} l-30,-50`} stroke="#2f4250" strokeWidth={14} strokeLinecap="round" />)}</g>}
          </g>
        );
      })}
      {/* cables entre postes: comban; con `caida` los rotos llegan al piso */}
      {POSTES.slice(0, -1).map((x, i) => [-70, 0, 70].map((d) => {
        const x2 = POSTES[i + 1];
        const roto = caida > 0 && random(`pc${i + 1}`) < 0.6;
        const baja = roto ? caida * 420 : 0;
        const y = P - 505;
        return <g key={`${i}${d}`}><path d={`M${x + d},${y} Q${(x + x2) / 2 + d},${y + 70 + baja} ${x2 + d},${y + baja * 0.9}`} stroke="#1d1a20" strokeWidth={4} fill="none" />{caida > 0.3 && <path d={`M${x + d},${y + 3} Q${(x + x2) / 2 + d},${y + 73 + baja} ${x2 + d},${y + 3 + baja * 0.9}`} stroke="#e6f2ff" strokeWidth={3} fill="none" opacity={caida * 0.8} />}</g>;
      }))}
      {zumbido > 0 && POSTES.slice(0, -1).map((x, i) => <circle key={i} cx={x + ((f * 14 + i * 90) % 420)} cy={P - 470} r={6} fill="#fff2b0" opacity={zumbido} />)}
      {nieve > 0 && <Banco x={-700} w={7200} piso={P - 26} alto={36 * nieve} color={L.nieve} seed="rp" />}
    </g>
  );
};
