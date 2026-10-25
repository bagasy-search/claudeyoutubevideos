import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, F, at, clamp, lerp, rnd, seco, suave } from "./lib";
import { CANTO, LETRA, Lam, Linterna, PISOS, PisoCapas, suelo, CIVIL, RECLUTA, LEGIO_ESC, VETERANO } from "./kit";
import { Act, camara, TRISTE, QUIETO } from "./actor";
import { Look } from "./rig";

// ---------- mesa de madera (fondo de los insertos: contrato, listas, mapas) ----------
export const MesaMadera: React.FC<{ cam: Cam; seed?: number; tono?: string }> = ({ cam, seed = 7, tono = "#5a3a22" }) => {
  const r = rnd(seed);
  const vetas = Array.from({ length: 46 }, (_, i) => ({ y: -1500 + i * 68 + r() * 30, a: 0.05 + r() * 0.1, w: 2 + r() * 5, o: r() * 400 }));
  return (
    <Lam D={1300} cam={cam}>
      <rect x={-4000} y={-3000} width={8000} height={6000} fill={tono} />
      {vetas.map((v, i) => (
        <path key={i} d={`M-4000,${v.y} C-1500,${v.y + 30} ${v.o},${v.y - 26} 4000,${v.y + 12}`} stroke="#2a170b" strokeOpacity={v.a} strokeWidth={v.w} fill="none" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={"t" + i} x1={-4000} x2={4000} y1={-1520 + i * 560} y2={-1520 + i * 560} stroke="#1e1007" strokeWidth={6} opacity={0.5} />
      ))}
    </Lam>
  );
};

// ---------- colinas de cartulina hechas por código (para el CAMINO de la carrera) ----------
const Colina: React.FC<{ y: number; amp: number; color: string; canto: string; seed: number; ancho?: number }> = ({ y, amp, color, canto, seed, ancho = 9000 }) => {
  const r = rnd(seed);
  const pts: string[] = [];
  const f1 = 0.0012 + r() * 0.001;
  const f2 = 0.003 + r() * 0.002;
  const ph = r() * 10;
  for (let x = -ancho / 2; x <= ancho / 2; x += 60) pts.push(`${x},${(y - amp * (0.6 * Math.sin(x * f1 + ph) + 0.4 * Math.sin(x * f2 + ph * 2))).toFixed(1)}`);
  return (
    <g>
      <polygon points={`${-ancho / 2},3000 ${pts.join(" ")} ${ancho / 2},3000`} fill={color} />
      <polyline points={pts.join(" ")} stroke={canto} strokeWidth={4} fill="none" />
    </g>
  );
};

// ---------- EL CAMINO DE TU CARRERA: siete mojones, uno por trampa ----------
export const TRAMPAS = ["THE CONTRACT", "THE TRAINING", "THE MARCH", "THE CENTURION", "THE CAMP", "THE BATTLE", "THE RETIREMENT"];
const ROMANO = ["I", "II", "III", "IV", "V", "VI", "VII"];
export const MOJON_X = (n: number) => -300 + n * 820; // n = 1..7
const LOOK_ETAPA: Look[] = [CIVIL, RECLUTA, LEGIO_ESC, LEGIO_ESC, LEGIO_ESC, LEGIO_ESC, VETERANO];

const Mojon: React.FC<{ x: number; n: number; t: number; aparece: number; abre: number; pasado: boolean }> = ({ x, n, t, aparece, abre, pasado }) => {
  const u = seco(t, aparece, aparece + 0.35);
  if (u <= 0) return null;
  const y0 = suelo(F);
  const h = 210 * u;
  const flip = suave(t, abre, abre + 0.5);
  const sx = Math.abs(Math.cos(flip * Math.PI));
  const lado = flip > 0.5;
  return (
    <g>
      <ellipse cx={x + 14} cy={y0 + 2} rx={70} ry={8} fill="#2a1206" opacity={0.45} />
      <path d={`M${x - 58},${y0} L${x - 54},${y0 - h + 40} Q${x},${y0 - h - 22} ${x + 54},${y0 - h + 40} L${x + 58},${y0} Z`} fill="#b9ad98" />
      <path d={`M${x - 54},${y0 - h + 40} Q${x},${y0 - h - 22} ${x + 54},${y0 - h + 40}`} stroke="#e6dcc8" strokeWidth={5} fill="none" />
      <text x={x} y={y0 - h + 96} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={64} fill="#4a3a2a">
        {ROMANO[n - 1]}
      </text>
      {/* el cartel de la trampa: gira como una tarjeta y muestra su nombre */}
      {flip > 0 && (
        <g transform={`translate(${x},${y0 - h - 120}) scale(${sx * (lado ? 1 : 0.9)},1)`}>
          <line x1={0} y1={40} x2={0} y2={120} stroke="#5a4024" strokeWidth={6} />
          <rect x={-170} y={-50} width={340} height={96} fill={lado ? "#a3241c" : "#c99a5e"} />
          <rect x={-170} y={-50} width={340} height={8} fill={lado ? "#c8463a" : "#ecc58a"} />
          {lado && (
            <text x={0} y={16} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={40} fill="#f3e6cf" letterSpacing={2}>
              {TRAMPAS[n - 1]}
            </text>
          )}
        </g>
      )}
      {pasado && (
        <g opacity={0.9}>
          <path d={`M${x - 40},${y0 - 130} L${x + 40},${y0 - 50} M${x + 40},${y0 - 130} L${x - 40},${y0 - 50}`} stroke="#efe6d2" strokeWidth={9} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

export const CaminoMontes: React.FC<{ cam: Cam; noche?: number }> = ({ cam }) => (
  <>
    <Lam D={2600} cam={cam}>
      <rect x={-9000} y={-4000} width={18000} height={8000} fill="#e9c98f" />
      <circle cx={-500} cy={-420} r={150} fill="#f6e2b0" />
      <circle cx={-500} cy={-420} r={110} fill="#fbeccb" />
    </Lam>
    <Lam D={2300} cam={cam}>
      <Colina y={60} amp={160} color="#c99a6a" canto="#dcb487" seed={2} />
    </Lam>
    <Lam D={1900} cam={cam}>
      <Colina y={120} amp={130} color="#b5774c" canto="#cf9466" seed={5} />
    </Lam>
    <Lam D={1600} cam={cam}>
      <Colina y={170} amp={90} color="#8f5a39" canto="#b07450" seed={8} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = -2600 + i * 430 + (i % 3) * 60;
        return (
          <g key={i}>
            <rect x={x - 5} y={40 - (i % 4) * 14} width={10} height={130} fill="#3d2a1a" />
            <path d={`M${x},${-150 - (i % 4) * 14} C${x + 36},${-70} ${x + 30},${60} ${x},${70} C${x - 30},${60} ${x - 36},${-70} ${x},${-150 - (i % 4) * 14} Z`} fill="#3f5a3a" />
          </g>
        );
      })}
    </Lam>
    <PisoCapas cam={cam} piso={PISOS.tierra} />
  </>
);

// escena del camino: muestra el mojón n (n=0: el gancho, los siete aparecen uno por uno)
export const Camino: React.FC<{ t: number; n: number; t0: number }> = ({ t, n, t0 }) => {
  if (n === 0) {
    // gancho 39,2 → 53,5: "vas a enlistarte" → caminás → "son siete" → "anotémonos" → mojón I gira
    const tJoin = at("going to join");
    const tWalk = at("walk through your entire career");
    const tSiete = at("seven of them");
    const tSign = at("sign you up");
    const tTrap = at("Trap number one");
    const cam = camara(t, [
      [t0, -900, -60, 160],
      [tWalk, -800, -60, 200],
      [tSiete - 0.3, 600, -80, -900],
      [tSiete + 1.4, 1500, -80, -1500],
      [tSign + 0.2, 1300, -80, -900],
      [tTrap, MOJON_X(1) - 80, -70, 260],
      [tTrap + 2.4, MOJON_X(1) - 40, -80, 380],
    ], 6);
    const tu = { look: CIVIL, ruta: [[t0, -1050], [tWalk + 0.2, -1050], [tWalk + 3.2, -560], [tTrap - 0.8, -560], [tTrap + 0.6, MOJON_X(1) - 210]] as [number, number][], seed: 2, poses: [[t0, TRISTE], [tJoin + 0.3, QUIETO, 0.5]] as any };
    return (
      <AbsoluteFill style={{ backgroundColor: "#e9c98f" }}>
        <CaminoMontes cam={cam} />
        <Lam D={F} cam={cam} sombra>
          {[1, 2, 3, 4, 5, 6, 7].map((k) => (
            <Mojon key={k} x={MOJON_X(k)} n={k} t={t} aparece={tSiete + (k - 1) * 0.16} abre={k === 1 ? tTrap - 0.1 : 1e9} pasado={false} />
          ))}
          <Act t={t} a={tu} />
        </Lam>
        <Linterna x={0} y={60} r={900} osc={0.3} />
      </AbsoluteFill>
    );
  }
  const cam = camara(t, [
    [t0 - 0.1, MOJON_X(n) - 520, -60, 120],
    [t0 + 1.2, MOJON_X(n) - 120, -70, 300],
    [t0 + 3, MOJON_X(n) - 60, -80, 380],
  ], 6);
  const tu = { look: LOOK_ETAPA[n - 1], ruta: [[t0 - 0.2, MOJON_X(n) - 760], [t0 + 1.3, MOJON_X(n) - 200]] as [number, number][], seed: n, lenta: n === 7 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#e9c98f" }}>
      <CaminoMontes cam={cam} />
      <Lam D={F} cam={cam} sombra>
        {[1, 2, 3, 4, 5, 6, 7].map((k) => (
          <Mojon key={k} x={MOJON_X(k)} n={k} t={t} aparece={-1} abre={k < n ? -1 : k === n ? t0 + 0.2 : 1e9} pasado={k < n} />
        ))}
        <Act t={t} a={tu} />
      </Lam>
      <Linterna x={0} y={0} r={780} osc={0.35 + 0.1 * clamp(n / 7, 0, 1)} />
    </AbsoluteFill>
  );
};

export const unoDe = (t: number, a: number) => clamp(t - a, 0, 1);
export { lerp, CANTO };
