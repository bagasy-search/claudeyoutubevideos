// tz02 · vuelta 3 del OJO (planos 43-83): helpers nuevos. No toca anikit/tenzo ni extras.tsx (se importa de ahí).
import React, { useContext } from "react";
import { interpolate } from "remotion";
import { OffsetCtx, useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { ACENTO } from "../tenzo/elenco";
import { BiciDib, cl, lerp, Lienzo, ManoGrande, MiniPalacio, Retrato, suave, usePop } from "./extras";

// corre el reloj local: dentro, useF() arranca en 0 en el cuadro `d` del plano
export const Desde: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const o = useContext(OffsetCtx);
  return <OffsetCtx.Provider value={o + d}>{children}</OffsetCtx.Provider>;
};
// sub-planos dentro de una escena: [cuadro de inicio, elemento]; cada uno ve su propio cuadro 0
export const Tramos: React.FC<{ t: [number, React.ReactNode][] }> = ({ t }) => {
  const f = useF();
  let i = 0;
  for (let k = 0; k < t.length; k++) if (f >= t[k][0]) i = k;
  return <Desde d={t[i][0]}>{t[i][1]}</Desde>;
};
// texto de pantalla SOBRE PLACA oscura (contraste garantizado sobre cualquier fondo)
export const Placa: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string; fondo?: string }> = ({ texto, x, y, desde, hasta = 1e9, tam = 44, color = "#f4efe6", fondo = "rgba(18,16,20,0.82)" }) => {
  const f = useF();
  const s = usePop(desde);
  if (f < desde) return null;
  const o = Math.min(s, interpolate(f, [hasta - 8, hasta], [1, 0], cl));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, opacity: o, background: fondo, borderRadius: 16, padding: `${tam * 0.18}px ${tam * 0.55}px`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color, whiteSpace: "nowrap", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>{texto}</div>
  );
};

// ---------- Q50 · la cara de Siddhartha envejece en 3 pasos (29 → 50 → 80), con un reloj que barre alrededor ----------
export const Envejece: React.FC<{ s1: number; s2: number; desde?: number }> = ({ s1, s2, desde = 0 }) => {
  const f = useF();
  const pop = usePop(desde, 14, 160);
  const e1 = lerp(f, s1, s1 + 6, 0, 0.5), e2 = lerp(f, s2, s2 + 6, 0, 0.5);
  const edad = e1 + e2;
  const anios = f < s1 ? 29 : f < s2 ? 50 : 80;
  const flash = Math.max(interpolate(f - s1, [0, 3, 12], [0, 1, 0], cl), interpolate(f - s2, [0, 3, 12], [0, 1, 0], cl));
  const ang = (f - desde) * 9 + (f > s1 ? 360 : 0) + (f > s2 ? 360 : 0);
  return (
    <Lienzo>
      <defs><radialGradient id="envFondo"><stop offset="0" stopColor="#6a3a24" /><stop offset="1" stopColor="#1e120c" /></radialGradient></defs>
      <rect width={1920} height={1080} fill="url(#envFondo)" />
      <g transform={`translate(960,520) scale(${pop})`}>
        <circle r={330} fill="none" stroke="#f2c14a" strokeWidth={6} opacity={0.6} />
        {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={-4} y={-326} width={8} height={k % 3 ? 18 : 34} fill="#f2c14a" transform={`rotate(${k * 30})`} />)}
        <g transform={`rotate(${ang})`}><rect x={-5} y={-300} width={10} height={300} rx={5} fill="#ffd38a" /></g>
        <circle r={300} fill="none" stroke="#fff6dc" strokeWidth={30} opacity={flash * 0.7} />
        <Retrato x={0} y={0} r={250} tipo="sidd" edad={edad} cara={f < s1 ? "neutral" : "triste"} />
      </g>
      {[0, 1, 2].map((k) => {
        const on = k === 0 || (k === 1 && f >= s1) || (k === 2 && f >= s2);
        return <g key={k} transform={`translate(${1500 + k * 120},860)`} opacity={on ? 1 : 0.25}><circle r={44} fill={on ? "#f2c14a" : "#5a4030"} /><text y={14} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={38} fill="#2a1a10">{[29, 50, 80][k]}</text></g>;
      })}
      <text x={960} y={960} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={84} fill="#fff2c8" letterSpacing={6}>AGE {anios}</text>
    </Lienzo>
  );
};

// ---------- Q69 · inserto: las manos de Tenzo doblan la toalla punta con punta (dos dobleces) ----------
type P2 = [number, number];
const mix = (a: P2, b: P2, t: number): P2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const poly = (...p: P2[]) => p.map((q) => q.join(",")).join(" ");
export const DoblaToalla: React.FC<{ p1: [number, number]; p2: [number, number] }> = ({ p1, p2 }) => {
  const f = useF();
  const a = suave(lerp(f, p1[0], p1[1], 0, 1)), b = suave(lerp(f, p2[0], p2[1], 0, 1));
  const S = 250, C: P2 = [960, 640];
  const TL: P2 = [C[0] - S, C[1] - S], TR: P2 = [C[0] + S, C[1] - S], BR: P2 = [C[0] + S, C[1] + S], BL: P2 = [C[0] - S, C[1] + S];
  const P = mix(TR, BL, a); // la punta que viaja
  const Q = mix(TL, BR, b); // segundo doblez
  const cara = "#efe4cf", dorso = "#d8c8ac", raya = "#c8603a";
  const Tri: React.FC<{ pts: P2[]; fill: string }> = ({ pts, fill }) => <polygon points={poly(...pts)} fill={fill} stroke="#9a8a70" strokeWidth={4} strokeLinejoin="round" />;
  // manos: derecha toma la punta móvil, izquierda sostiene la punta de llegada
  const mD = b > 0 ? Q : P;
  const angD = b > 0 ? interpolate(b, [0, 1], [-30, -150]) : interpolate(a, [0, 1], [-40, -10]);
  const sube = Math.sin(Math.PI * (b > 0 ? b : a)) * 40; // levanta la punta en el medio del gesto
  return (
    <Lienzo>
      <rect width={1920} height={1080} fill="#2a2d33" />
      {[0, 1, 2, 3, 4].map((k) => <g key={k} opacity={0.35}><rect x={60 + k * 380} y={40} width={330} height={300} rx={20} fill="#d8dce2" /><circle cx={225 + k * 380} cy={200} r={95} fill="#1d2026" /></g>)}
      <circle cx={1500} cy={300} r={520} fill="#ffc46a" opacity={0.12} />
      <rect x={0} y={380} width={1920} height={700} fill="#cfc8bc" />
      <rect x={0} y={380} width={1920} height={18} fill="#a8a094" />
      <g transform={`translate(0,${-sube * 0.15})`}>
        {b === 0 ? <>
          <Tri pts={[TL, BL, BR]} fill={cara} />
          <polyline points={poly([TL[0] + 30, TL[1] + 60], [BL[0] + 30, BL[1]])} stroke={raya} strokeWidth={10} fill="none" />
          <Tri pts={[TL, BR, [P[0], P[1] - sube]]} fill={a < 0.5 ? cara : dorso} />
        </> : <>
          <Tri pts={[BL, C, BR]} fill={dorso} />
          <Tri pts={[BL, C, [Q[0], Q[1] - sube]]} fill={b < 0.5 ? dorso : cara} />
        </>}
      </g>
      <ManoGrande x={BL[0] - 40} y={BL[1] + 30} ang={50} piel="#f2bf8f" manga="#8e8a82" s={0.9} />
      <ManoGrande x={mD[0] + 30} y={mD[1] - sube + 20} ang={angD} piel="#f2bf8f" manga="#8e8a82" s={0.9} />
    </Lienzo>
  );
};

// ---------- Q76 · gráfico: todos los días, salir del portón UNA vez, mirar el camino, volver si querés ----------
export const CicloPorton: React.FC<{ t: { cada: number; sale: number; una: number; mira: number; vuelve: number } }> = ({ t }) => {
  const f = useF();
  const PAL_X = 330, GATE = 860, ROAD = 1480, Y = 640;
  // el caminante: palacio → portón → camino (mira) → vuelve
  const x = f < t.sale ? PAL_X + 60 : f < t.mira ? interpolate(f, [t.sale, t.mira - 6], [PAL_X + 60, ROAD], { ...cl, easing: suave }) : f < t.vuelve ? ROAD : interpolate(f, [t.vuelve, t.vuelve + 50], [ROAD, PAL_X + 60], { ...cl, easing: suave });
  const vuelta = f >= t.vuelve;
  const paso = f > t.sale && (f < t.mira || vuelta) ? Math.sin(f * 0.9) * 10 : 0;
  const mira = f >= t.mira && f < t.vuelve ? Math.sin((f - t.mira) * 0.18) : 0;
  const ida = lerp(f, t.sale, t.mira - 6, 0, 1), vue = lerp(f, t.vuelve, t.vuelve + 50, 0, 1);
  const dia = Math.min(7, Math.floor(lerp(f, t.cada, t.cada + 40, 0, 7.99)));
  return (
    <Lienzo>
      <defs><linearGradient id="cpCielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f6c98a" /><stop offset="1" stopColor="#fbe6c2" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#cpCielo)" />
      <rect y={Y + 60} width={1920} height={420} fill="#e2b47e" />
      <path d={`M${GATE + 80},${Y + 60} L1920,${Y + 10} L1920,${Y + 120} L${GATE + 80},${Y + 100} Z`} fill="#c8925a" />
      {[1150, 1380, 1650].map((xx, k) => <g key={k} transform={`translate(${xx},${Y + 10 - k * 4})`}><rect x={-6} y={-60} width={12} height={60} fill="#6a4020" /><circle cy={-80} r={40 - k * 6} fill="#8aa04a" /></g>)}
      <g transform={`translate(${PAL_X},${Y - 40})`}><MiniPalacio s={1.7} /></g>
      <g transform={`translate(${GATE},${Y + 60})`}>
        <rect x={-120} y={-300} width={240} height={300} fill="#d9a86e" stroke="#8a5a2a" strokeWidth={5} />
        <path d="M-70,0 L-70,-170 Q0,-250 70,-170 L70,0 Z" fill="#fff2c8" />
        {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 70},0 L${sd * 70},-170 Q${sd * 35},-215 0,-220 L0,0 Z`} fill="#8a5a2a" stroke="#5a3418" strokeWidth={4} transform={`translate(${sd * 70},0) scale(${1 - lerp(f, t.sale - 10, t.sale, 0, 0.85)},1) translate(${-sd * 70},0)`} />)}
      </g>
      <path d={`M${PAL_X + 60},${Y + 150} C${GATE - 100},${Y + 230} ${GATE + 200},${Y + 230} ${ROAD},${Y + 150}`} stroke="#5a3418" strokeWidth={8} fill="none" strokeDasharray="22 18" strokeDashoffset={0} opacity={ida > 0 ? 1 : 0} pathLength={1000} style={{ strokeDasharray: `${ida * 1000} 1000` }} />
      {vuelta && <path d={`M${ROAD},${Y + 180} C${GATE + 200},${Y + 280} ${GATE - 100},${Y + 280} ${PAL_X + 60},${Y + 180}`} stroke={ACENTO} strokeWidth={8} fill="none" pathLength={1000} style={{ strokeDasharray: `${vue * 1000} 1000` }} />}
      <g transform={`translate(${x},${Y + 60 + Math.abs(paso) * -0.4})`}>
        <ellipse cy={4} rx={40} ry={10} fill="#000" opacity={0.18} />
        <path d={`M-12,-70 L${-14 + paso},0 M12,-70 L${14 - paso},0`} stroke="#3a2a22" strokeWidth={14} strokeLinecap="round" />
        <rect x={-30} y={-170} width={60} height={110} rx={26} fill="#8e8a82" />
        <g transform={`translate(0,-205) rotate(${mira * 14})`}><circle r={36} fill="#f2bf8f" stroke="#3a2618" strokeWidth={4} /><circle cx={vuelta ? -12 : 12} cy={-4} r={4.5} fill="#2a1a10" /><circle cx={vuelta ? 6 : 26} cy={-4} r={4.5} fill="#2a1a10" /></g>
      </g>
      {f >= t.mira && f < t.vuelve && <g opacity={lerp(f, t.mira, t.mira + 8, 0, 1)}>{[0, 1, 2].map((k) => <path key={k} d={`M${ROAD + 50},${Y - 140} q${60 + k * 30},${-20 - k * 10} ${130 + k * 60},${10 - k * 20}`} stroke="#5a3418" strokeWidth={4} fill="none" strokeDasharray="8 10" />)}</g>}
      <g transform="translate(960,120)">
        {Array.from({ length: 7 }).map((_, k) => <g key={k} transform={`translate(${(k - 3) * 92},0)`}><rect x={-38} y={-38} width={76} height={76} rx={14} fill={k < dia ? ACENTO : "#fff6e6"} stroke="#8a5a2a" strokeWidth={4} />{k < dia && <path d="M-16,0 L-4,14 L18,-14" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />}</g>)}
      </g>
      {f >= t.cada && <text x={960} y={235} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={52} fill="#5a3418" letterSpacing={6}>EVERY DAY</text>}
      {f >= t.una && <g transform={`translate(${GATE},${Y - 330}) scale(${Math.min(1, (f - t.una) / 6)})`}><circle r={58} fill={ACENTO} /><text y={20} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={58} fill="#fff">1×</text></g>}
      {f >= t.mira && <text x={ROAD} y={Y - 300} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={46} fill="#5a3418">LOOK AT THE ROAD</text>}
      {vuelta && <text x={(PAL_X + ROAD) / 2 + 80} y={Y + 360} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={46} fill={ACENTO} opacity={vue > 0.05 ? 1 : 0}>THEN COME BACK · IF YOU WANT</text>}
    </Lienzo>
  );
};

// ---------- Q60 · la ficha del ciclista: repartidor, 23 años, atropellado de noche ----------
export const Memorial: React.FC<{ edad: number; auto: number; noche: number }> = ({ edad, auto, noche }) => {
  const f = useF();
  const pop = usePop(0, 14, 150);
  const ax = interpolate(f, [auto, auto + 14], [-500, 2400], cl);
  const golpe = interpolate(f - auto - 6, [0, 2, 10], [0, 1, 0], cl);
  const tiembla = golpe * Math.sin(f * 3) * 10;
  return (
    <Lienzo>
      <rect width={1920} height={1080} fill="#3a3e46" />
      <rect y={820} width={1920} height={260} fill="#2a2d33" />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => <rect key={k} x={k * 300 + 40} y={940} width={160} height={14} fill="#c8c8b0" opacity={0.6} />)}
      <g transform={`translate(${520 + tiembla},640) scale(2.6)`}><BiciDib color="#f4f4f4" /></g>
      {[[-70, -10], [-40, -30], [-10, -16], [20, -34]].map(([dx, dy], k) => <circle key={k} cx={560 + dx * 2} cy={560 + dy * 2} r={18} fill={["#f4a8a0", "#fff2dc", "#ffd06a", "#f4a8a0"][k]} />)}
      <g transform={`translate(1240,${470 - (1 - pop) * 60}) rotate(${-5 + tiembla * 0.2}) scale(${0.8 + 0.2 * pop})`} opacity={pop}>
        <rect x={-210} y={-250} width={420} height={500} rx={10} fill="#f6f2ea" stroke="#cfc8bc" strokeWidth={4} />
        <rect x={-180} y={-220} width={360} height={340} fill="#8aa0b8" />
        <Retrato x={0} y={-50} r={120} tipo="nino" cara="feliz" />
        <text x={0} y={190} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={40} fill="#2a2622">DELIVERY RIDER</text>
      </g>
      {f >= edad && <g transform={`translate(1580,240) scale(${Math.min(1, (f - edad) / 6)})`}><circle r={90} fill={ACENTO} /><text y={22} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={78} fill="#fff">23</text><text y={66} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#fff" letterSpacing={2}>YEARS OLD</text></g>}
      <g transform={`translate(${ax},860)`}>
        <path d="M-200,-40 L-190,-90 L-90,-100 L-40,-150 L90,-150 L140,-100 L200,-90 L205,-40 Z" fill="#c8403a" stroke="#14161a" strokeWidth={4} />
        {[-120, 120].map((d) => <circle key={d} cx={d} cy={-34} r={34} fill="#14161a" />)}
        {[0, 1, 2].map((k) => <rect key={k} x={-420 - k * 80} y={-120 + k * 30} width={180} height={8} rx={4} fill="#f4efe6" opacity={0.5} />)}
      </g>
      <rect width={1920} height={1080} fill="#ff3a2a" opacity={golpe * 0.35} />
      {f >= auto && <text x={1240} y={860} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={62} fill="#ffb060" letterSpacing={4} opacity={lerp(f, auto + 6, auto + 12, 0, 1)}>HIT BY A CAR</text>}
      {f >= noche && <g opacity={lerp(f, noche, noche + 8, 0, 1)}><circle cx={300} cy={180} r={60} fill="#fff1d0" /><circle cx={330} cy={160} r={56} fill="#3a3e46" /><text x={420} y={200} fontFamily={F_HUD} fontWeight={700} fontSize={54} fill="#fff1d0" letterSpacing={4}>NIGHT SHIFT</text></g>}
    </Lienzo>
  );
};

// ---------- Q83 · amanecer que sube detrás (pantalla, se suma a la luz de la escena) ----------
export const Amanecer: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 78% ${110 - p * 40}%, rgba(255,190,110,${0.75 * p}) 0%, rgba(255,150,90,${0.35 * p}) 35%, rgba(255,140,90,0) 70%)`, mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(255,170,100,${0.18 * p}), rgba(255,170,100,0) 60%)`, mixBlendMode: "screen" }} />
  </div>
);

// ---------- Q62 · la sombra de Leo gira en la vereda (time-lapse): mundo ----------
export const SombraGira: React.FC<{ x: number; piso: number; ang: number; largo?: number }> = ({ x, piso, ang, largo = 260 }) => (
  <g transform={`translate(${x},${piso}) scale(1,0.32) rotate(${ang})`} opacity={0.35}>
    <path d={`M-38,0 L-30,${-largo} Q0,${-largo - 50} 30,${-largo} L38,0 Z`} fill="#14161a" />
  </g>
);
