import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Emote, fontFamily } from "./kit";
import { Persona, CIVIL, Ropa } from "./persona";
import { SUELO, Llave, G, interp, TextoMundo } from "./mundo";
import { Franz, Gente, CartelTrampa, Sello, Titulo, HUD, BurbujaM, vig } from "./actores";

// P2 · Trampa 2 "Nobody touches you" (162-270 s). Franz sale del puente con su aura de "contagio" → el taller de
// carpinteros: lo que le pasa a un artesano que lo toca → la calle (se apartan, el carro trabado, el hielo) → el
// código de vestimenta → la ceremonia de la horca (todos golpean a la vez) → el entierro entre verdugos.
const HANS: Ropa = { tunica: "#3a7bd5", tunica2: "#22508f", cinto: "#e8d2a8", piel: "#f0b88e", piel2: "#d3966c", pelo: "#a8642a" };
const CARP = (i: number): Ropa => ({ ...CIVIL(i + 3), cinto: "#e8d2a8" });
const GRIS: Ropa = { tunica: "#8d8a94", tunica2: "#64616c", cinto: "#a9a5ae", piel: "#c9c2bc", piel2: "#aaa39d", pelo: "#6a6670" };
const HORCA = 11960, ENTIERRO = 10460, CARRO = 9290, HIELO = 9330;

export const P2K: Llave[] = [
  [162.6, 7480, 610, 1.3, 0.8],
  [166.2, 7760, 600, 1.55, 3.4],
  [168.85, 7900, 560, 2.4, 0.6],
  [171.6, 8850, 600, 1.35, 0.9],
  [174.0, 8800, 620, 1.9, 0.5],
  [179.35, 8950, 600, 1.35, 0.6],
  [183.3, 8660, 610, 1.6, 0.7],
  [186.0, 8690, 560, 2.5, 0.4],
  [188.3, 8900, 600, 1.3, 0.6],
  [193.1, 9220, 610, 1.4, 4.2],
  [196.5, HIELO + 40, 640, 1.8, 0.6],
  [198.7, HIELO, 650, 2.1, 0.7],
  [203.7, HIELO - 10, 590, 3.4, 0.5],
  [205.6, HIELO + 10, 660, 3.2, 0.5],
  [208.4, HIELO, 560, 1.6, 0.7],
  [213.1, HIELO, 560, 1.35, 2],
  [215.95, HORCA, 600, 1.1, 1.0, 0.25],
  [218.3, HORCA, 590, 1.55, 0.6],
  [221.0, HORCA - 120, 650, 2.0, 0.5],
  [226.9, HORCA - 150, 560, 0.85, 1.0],
  [233.3, 11560, 610, 1.4, 0.7],
  [237.0, HORCA, 580, 1.0, 0.6],
  [239.45, HORCA, 600, 1.2, 0.15],
  [243.0, HORCA, 480, 0.62, 2.0],
  [249.3, ENTIERRO, 600, 1.25, 1.4, 0.2],
  [253.5, ENTIERRO + 60, 620, 1.7, 0.6],
  [256.8, ENTIERRO + 150, 600, 1.25, 0.6],
  [259.6, ENTIERRO - 40, 600, 1.4, 1.6],
  [262.6, 9000, 570, 1.2, 1.0, 0.25],
  [265.6, 9000, 600, 0.9, 1.6],
  [269.6, 1450, 620, 1.35, 1.0, 0.35],
];
export const P2H: [number, number][] = [[162, 0], [249.5, 0], [251.5, 1], [260.5, 1], [262.5, 0], [270, 0]];

const fx = (t: number) => {
  if (t < 171) return interp(t, [162, 171], [7300, 7900]);
  if (t < 183.2) return interp(t, [171, 172.2], [7900, 8380]);
  if (t < 188.2) return interp(t, [183.2, 185.4], [8380, 8640]);
  if (t < 193.2) return interp(t, [188.2, 192.6], [8640, 9180]);
  if (t < 196.4) return 9180;
  return interp(t, [196.4, 197.3], [9180, HIELO]);
};
const caminaF = (t: number) => vig(t, 162, 171) || vig(t, 171, 172.2) || vig(t, 183.2, 185.4) || vig(t, 188.2, 192.6) || vig(t, 196.4, 197.3);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;
const Martillo: React.FC = () => <g><rect x={-6} y={-120} width={12} height={120} fill="#8a5a2a" /><rect x={-26} y={-140} width={52} height={28} rx={5} fill="#5a6070" /></g>;

// aura de "contagio" alrededor de Franz: anillo punteado verde + bichitos que flotan
const Aura: React.FC<{ t: number; x: number; t0: number; t1: number }> = ({ t, x, t0, t1 }) => {
  if (t < t0 || t > t1) return null;
  const e = clamp((t - t0) / 0.5, 0, 1) * clamp((t1 - t) / 0.5, 0, 1);
  return (
    <Svg>
      <g transform={`translate(${x} ${SUELO - 160}) scale(${e})`}>
        <ellipse cx={0} cy={0} rx={190 + Math.sin(t * 4) * 8} ry={200} fill="none" stroke="#7ad83a" strokeWidth={10} strokeDasharray="26 18" strokeDashoffset={-t * 60} />
        {Array.from({ length: 9 }, (_, i) => {
          const a = i * 0.7 + t * (0.6 + (i % 3) * 0.2);
          const rx = 150 + (i % 3) * 30;
          return (
            <g key={i} transform={`translate(${Math.cos(a) * rx} ${Math.sin(a) * rx * 1.1})`}>
              <circle r={14 + (i % 2) * 6} fill="#8ae04a" stroke="#3a7a1a" strokeWidth={4} />
              <circle cx={-5} cy={-3} r={3.5} fill="#1d2a10" /><circle cx={5} cy={-3} r={3.5} fill="#1d2a10" />
              <path d="M -6 6 Q 0 2 6 6" stroke="#1d2a10" strokeWidth={3} fill="none" />
            </g>
          );
        })}
      </g>
    </Svg>
  );
};

export const P2Mundo: React.FC<{ t: number }> = ({ t }) => {
  const x = fx(t);
  // el resbalón: cae hacia atrás y se levanta solo
  const cae = vig(t, 197.3, 199.6) ? (t < 197.8 ? interp(t, [197.3, 197.8], [0, -78]) : interp(t, [198.9, 199.6], [-78, 0])) : 0;
  const empuja = vig(t, 193.2, 196.4);
  const ofrece = vig(t, 185.0, 188.0);
  const capa = t > 201.7 && t < 213.5 ? "#e8641a" : undefined;
  const golpe = t > 239.4;
  return (
    <>
      {/* los fieles ya sentados en la iglesia (empalma con el arranque de P3) */}
      {t > 267.3 && [620, 840, 1060, 1280].map((bx, b) => <Gente key={bx} t={t} x0={bx - 95} x1={bx + 95} n={3} y={SUELO - 70} h={250} seed={60 + b} flipDe={-9} mira={-1} />)}
      {/* ── el viaje de Franz por el pueblo (hasta el código de vestimenta) */}
      {t < 214 && (
        <>
          <Aura t={t} x={x} t0={169.4} t1={172.0} />
          <Aura t={t} x={x} t0={207.8} t1={213.6} />
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${x - 40}px ${SUELO - 10}px`, transform: `rotate(${cae}deg)` }}>
            <Franz x={x} y={SUELO - 10} t={t} camina={caminaF(t) ? 1.5 : 0} capa={capa}
              expr={cae < -10 ? "miedo" : empuja ? "enojado" : ofrece ? "feliz" : vig(t, 186.3, 188.2) ? "triste" : vig(t, 199.6, 213) ? "triste" : "neutro"}
              bD={empuja ? 85 : ofrece ? 90 : cae < -10 ? 140 : 8} cD={empuja ? 30 : 6} bI={cae < -10 ? 140 : empuja ? 75 : 6} cI={empuja ? 30 : 6} inclina={empuja ? 14 : 0} />
          </div>
          {/* la cinta en la manga y el cartel de advertencia */}
          {t > 205.0 && t < 213.6 && <G x={x - 62} y={SUELO - 170} s={clamp((t - 205) / 0.3, 0, 1)}><rect x={-34} y={-12} width={68} height={24} rx={6} fill={C.ambar} stroke="#7a4a10" strokeWidth={4} /><path d="M 20 10 L 34 50 L 10 40 Z" fill={C.ambar} /></G>}
          {t > 208.3 && t < 213.6 && (
            <G x={x + 270} y={SUELO - 470 + Math.sin(t * 3) * 6} s={0.85 * clamp((t - 208.3) / 0.3, 0, 1)}>
              <rect x={-4} y={0} width={8} height={70} fill="#5a3418" />
              <path d="M 0 -150 L 120 50 L -120 50 Z" fill={C.ambar} stroke="#2b1c14" strokeWidth={10} strokeLinejoin="round" />
              <text x={0} y={30} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={130} fill="#2b1c14">!</text>
              <rect x={-150} y={64} width={300} height={56} rx={12} fill="#2b1c14" />
              <text x={0} y={104} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={36} fill={C.ambar}>DO NOT TOUCH</text>
            </G>
          )}
        </>
      )}
      {/* ── la calle del este: los que se apartan al paso */}
      {t > 162 && t < 172 && <Gente t={t} x0={7700} x1={7960} n={2} seed={31} mira={-1} expr={t > 164.6 ? "miedo" : "neutro"} aleja={{ desde: 7400, dx: 260, t0: 165.2 }} />}
      {/* ── el taller: Hans el carpintero, el gremio y los clientes */}
      {t < 193.5 && (
        <>
          {t < 188.4 && (() => {
            const echado = t > 179.3;
            const hx = echado ? interp(t, [179.6, 181.0], [8800, 8920]) : 8800;
            const martilla = !echado && t < 183;
            return <Persona x={hx} y={SUELO - 10} h={290} t={t} seed={301} ropa={t > 177.7 && t < 183 ? GRIS : HANS} gorro="campesino"
              expr={t > 186 ? "miedo" : t > 179.3 && t < 183 ? "triste" : t > 177.7 ? "miedo" : "feliz"} flip={t > 183}
              bD={martilla ? 110 + Math.abs(Math.sin(t * 5)) * 50 : t > 186 ? 150 : 10} cD={martilla ? 40 : 10} bI={t > 186 ? 150 : 10} salta={186.0}
              manoD={martilla ? <Martillo /> : undefined} />;
          })()}
          {t > 179.2 && t < 183.4 && (
            <Persona x={interp(t, [179.2, 179.8], [9300, 9020])} y={SUELO - 10} h={310} t={t} seed={311} ropa={{ tunica: "#2b2140", tunica2: "#1b1530", cinto: C.oro, piel: "#e9b08a", piel2: "#c98f6a", pelo: "#d8d2cc" }} gorro="noble" flip expr="enojado"
              bD={95} cD={0} manoD={<g><rect x={-6} y={-80} width={12} height={110} fill="#5a3418" /><rect x={-70} y={-150} width={140} height={74} rx={8} fill={C.oro} stroke="#7a4a10" strokeWidth={5} /><text x={0} y={-100} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#3b2614">GUILD</text></g>} />
          )}
          {[9060, 9190].map((cx, i) => {
            const vaS = t > 180.9 + i * 0.25;
            const xx = vaS ? interp(t, [180.9 + i * 0.25, 183.0], [cx, cx + 520]) : cx;
            return t < 183.2 ? <Persona key={cx} x={xx} y={SUELO - 10} h={270} t={t} seed={320 + i} ropa={CIVIL(20 + i)} gorro={i ? "toca" : undefined} flip={!vaS} camina={vaS ? 1.6 : 0} expr={vaS ? "enojado" : "feliz"} /> : null;
          })}
        </>
      )}
      {/* ── el carro trabado en el barro */}
      {t > 188 && t < 197.5 && (
        <>
          <Svg><ellipse cx={CARRO + 30} cy={SUELO + 4} rx={170} ry={22} fill="#5a3a1a" /></Svg>
          <G x={CARRO + 40} y={SUELO + 12} rot={-6}>
            <rect x={-130} y={-150} width={260} height={90} rx={8} fill="#a8722e" stroke="#5a3418" strokeWidth={6} />
            {[-1, 1].map((d) => <g key={d} transform={`translate(${d * 80} -50) rotate(${empuja ? Math.sin(t * 20) * 6 : 0})`}><circle r={52} fill="none" stroke="#4a2810" strokeWidth={12} /><line x1={-50} y1={0} x2={50} y2={0} stroke="#4a2810" strokeWidth={8} /><line x1={0} y1={-50} x2={0} y2={50} stroke="#4a2810" strokeWidth={8} /></g>)}
            {[-70, 0, 70].map((d) => <rect key={d} x={d - 30} y={-200} width={60} height={50} rx={8} fill="#d9b77a" />)}
          </G>
          {empuja && <Emote t={t} t0={194.0} tipo="sudor" x={9180} y={SUELO - 320} s={0.8} />}
          {[0, 1].map((i) => {
            const t0 = 193.4 + i * 1.2;
            return t > t0 && t < t0 + 3 ? <Persona key={i} x={interp(t, [t0, t0 + 3], [8800, 9800])} y={SUELO - 6} h={275} t={t} seed={330 + i} ropa={CIVIL(30 + i)} gorro={i ? "noble" : "campesino"} camina={1.7} mira={-1} expr="orgullo" /> : null;
          })}
        </>
      )}
      {/* ── el hielo: nadie lo agarra */}
      {t > 195 && t < 214 && (
        <>
          <Svg><ellipse cx={HIELO + 20} cy={SUELO + 2} rx={150} ry={16} fill="#bfe6ff" opacity={0.9} /><path d={`M ${HIELO - 60} ${SUELO} l 30 -4 M ${HIELO + 40} ${SUELO + 4} l 40 -6`} stroke="#fff" strokeWidth={5} /></Svg>
          <Gente t={t} x0={HIELO + 130} x1={HIELO + 330} n={2} seed={41} mira={-1} flipDe={-1} expr={t > 197.3 ? "sorpresa" : "neutro"} salta={197.5} aleja={{ desde: HIELO, dx: 120, t0: 197.4 }} />
          <Gente t={t} x0={HIELO - 330} x1={HIELO - 160} n={2} seed={43} mira={1} expr={t > 197.3 ? "sorpresa" : "neutro"} aleja={{ desde: HIELO, dx: 120, t0: 197.5 }} />
        </>
      )}
      {/* ── la horca: el tablón roto, el que toca y queda deshonrado, y el gremio entero */}
      {t > 214 && t < 249.5 && (
        <>
          {t < 239.5 && <G x={HORCA + 60} y={SUELO - 470} rot={22}><rect x={-160} y={-16} width={320} height={32} rx={6} fill="#a8722e" stroke="#5a3418" strokeWidth={5} /></G>}
          {[0, 1, 2].map((i) => <G key={i} x={HORCA - 300 + i * 30} y={SUELO - 205 - i * 22}><rect x={-120} y={-22} width={240} height={22} rx={5} fill={i % 2 ? "#c98a4a" : "#b5763a"} /></G>)}
          {/* la vergüenza: nube morada sobre la horca que, al golpear todos juntos, se reparte en pedacitos y desaparece */}
          {t > 219 && t < 242 && (() => {
            const parte = clamp((t - 239.45) / 1.8, 0, 1);
            const e = clamp((t - 219) / 0.6, 0, 1);
            return (
              <Svg>
                {parte === 0 ? (
                  <g transform={`translate(${HORCA + 460} ${SUELO - 400 + Math.sin(t * 2) * 10}) scale(${e})`}>
                    {[[-90, 0, 80], [0, -30, 100], [90, 0, 80], [-40, 30, 70], [50, 34, 70]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#5b2b80" />)}
                    <text x={0} y={20} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill="#f2e6ff">SHAME</text>
                  </g>
                ) : (
                  Array.from({ length: 10 }, (_, i) => {
                    // pedazos que salen disparados en abanico y caen con gravedad
                    const a = (i / 10) * Math.PI * 2 + 0.3, v = 520 + (i % 4) * 140, k = Math.min(parte * 1.4, 1);
                    const px = HORCA + 460 + Math.cos(a) * v * k, py = SUELO - 400 + Math.sin(a) * v * 0.6 * k + 520 * k * k;
                    const r = 26 * (1 - parte) + 3;
                    return <path key={i} transform={`translate(${px} ${py}) rotate(${i * 47 + parte * 400})`} d={`M ${-r} 0 Q 0 ${-r * 1.3} ${r} 0 Q 0 ${r * 0.7} ${-r} 0 Z`} fill={i % 3 ? "#5b2b80" : "#8a4ab8"} stroke="#2b1240" strokeWidth={4} />;
                  })
                )}
              </Svg>
            );
          })()}
          {/* los carpinteros se niegan: brazos cruzados, señalan la horca y se van */}
          {t > 214.2 && t < 226.6 && [0, 1, 2].map((i) => {
            const sx = HORCA + 330 + i * 150;
            const vete = clamp((t - 223.5 - i * 0.3) / 2.5, 0, 1);
            return <Persona key={i} x={sx + vete * 1200} y={SUELO - 10} h={280} t={t} seed={330 + i} ropa={CARP(i + 3)} gorro="campesino" flip={vete === 0} camina={vete > 0 && vete < 1 ? 1.7 : 0}
              expr={i === 1 ? "enojado" : "sorpresa"} bD={i === 0 && vete === 0 ? 150 + Math.sin(t * 6) * 12 : 30} bI={i === 2 ? 110 : 30} cD={20} manoD={i === 1 ? <Martillo /> : undefined} habla={i === 0} />;
          })}
          {/* el primero que toca: queda gris */}
          {t > 220.5 && t < 226.8 && <Persona x={HORCA - 230} y={SUELO - 205} h={260} t={t} seed={340} ropa={t > 221.6 ? GRIS : CARP(1)} gorro="campesino" expr={t > 221.6 ? "triste" : "neutro"} bD={t < 221.6 ? 80 : 10} salta={221.7} />}
          {/* el gremio entero llega con música */}
          {t > 226.6 && Array.from({ length: 14 }, (_, i) => {
            const fin = HORCA - 650 + i * 100;
            const llega = 226.8 + i * 0.12;
            const xx = interp(t, [llega, llega + 2.6], [fin - 1400, fin]);
            const ap = i % 3 === 2;
            const sube = vig(t, 237.0, 239.4);
            const yy = Math.abs(fin - HORCA) < 260 ? SUELO - 205 : SUELO - 10 - Math.max(0, 200 - Math.abs(fin - HORCA) * 0.5);
            return (
              <Persona key={i} x={xx} y={yy} h={ap ? 210 : 280} t={t} seed={350 + i} ropa={CARP(i)} gorro={ap ? undefined : "campesino"} flip={fin > HORCA} camina={t < llega + 2.6 ? 1.7 : 0}
                expr={golpe && t < 241.5 ? "sorpresa" : t > 241.5 ? "feliz" : "neutro"} bD={sube ? interp(t, [237, 237.8], [40, 165]) : golpe ? interp(t, [239.4, 239.6], [165, 70]) : 40} cD={20}
                manoD={<Martillo />} />
            );
          })}
          {/* banda: gaitero y tambor */}
          {t > 233 && t < 243.5 && [11180, 11290].map((bx, i) => (
            <React.Fragment key={bx}>
              <Persona x={bx} y={SUELO - 10} h={270} t={t} seed={380 + i} ropa={CIVIL(40 + i)} gorro="noble" bD={i ? 60 + Math.abs(Math.sin(t * 8)) * 30 : 70} cD={60} habla={false} />
              {i === 1 && <G x={bx + 60} y={SUELO - 150}><ellipse cx={0} cy={0} rx={50} ry={34} fill="#c8402a" stroke="#f7c548" strokeWidth={6} /></G>}
            </React.Fragment>
          ))}
          {t > 233 && t < 243.5 && Array.from({ length: 6 }, (_, i) => {
            const k = ((t - 233) * 0.7 + i / 6) % 1;
            return <TextoMundo key={i} x={11200 + i * 30 + k * 160} y={SUELO - 340 - k * 260} text={i % 2 ? "♪" : "♫"} size={64} color={C.ambar} borde="#2b1c14" op={1 - k} />;
          })}
          {/* el concejo mira */}
          {t > 233 && t < 243.5 && [11420, 11520, 11620].map((cx, i) => <Persona key={cx} x={cx} y={SUELO - 10} h={300} t={t} seed={390 + i} ropa={{ tunica: "#2b2140", tunica2: "#1b1530", cinto: C.oro, piel: "#e9b08a", piel2: "#c98f6a", pelo: "#d8d2cc" }} gorro="noble" barba="#d8d2cc" expr={golpe ? "orgullo" : "neutro"} bD={20} bI={20} />)}
          {/* el golpe */}
          {vig(t, 239.4, 240.3) && <Svg><g transform={`translate(${HORCA} ${SUELO - 420}) scale(${1 + (t - 239.4) * 3})`} opacity={1 - (t - 239.4) / 0.9}><path d="M 0 -160 L 40 -50 L 160 -60 L 70 20 L 120 140 L 0 70 L -120 140 L -70 20 L -160 -60 L -40 -50 Z" fill="#fff6c8" stroke={C.ambar} strokeWidth={10} /></g></Svg>}
        </>
      )}
      {/* ── el entierro: nadie carga el cajón… salvo los verdugos de los pueblos vecinos */}
      {t > 248 && t < 262.5 && (() => {
        const alza = clamp((t - 259.3) / 0.6, 0, 1);
        const lleva = t > 260 ? interp(t, [260, 262.4], [0, -520]) : 0;
        const VERD = ["#2a5a9a", "#2a7a4a", "#6a3a9a", "#9a5a1a"];
        const ciudades = ["BAMBERG", "ANSBACH", "BAYREUTH", "REGENSBURG"];
        return (
          <>
            <Gente t={t} x0={10700} x1={10980} n={3} seed={51} mira={-1} flipDe={-1} expr={t > 253.4 ? "enojado" : "triste"} brazos={20} />
            <BurbujaM t={t} t0={253.6} t1={256.6} x={10720} y={SUELO - 360} text="NOPE." size={44} />
            <BurbujaM t={t} t0={254.1} t1={256.6} x={10910} y={SUELO - 380} text="NOT ME." size={40} />
            {VERD.map((col, i) => {
              const fin = ENTIERRO - 150 + i * 100;
              const xx = interp(t, [256.8 + i * 0.2, 258.9 + i * 0.2], [fin + 900, fin]) + lleva;
              return (
                <React.Fragment key={i}>
                  <Persona x={xx} y={SUELO - 10} h={290} t={t} seed={400 + i} ropa={{ tunica: col, tunica2: "#1b1530", cinto: "#1d1410", piel: "#e9b08a", piel2: "#c98f6a", pelo: "#3a2414" }} gorro="verdugo" capa="#2b0a14"
                    flip={t < 259} camina={t < 259 + i * 0.2 || t > 260 ? 1.4 : 0} expr={alza > 0 ? "triste" : "neutro"} bD={alza > 0 ? 160 : 10} bI={alza > 0 ? 160 : 10} />
                  {vig(t, 257.4, 258.7) && <TextoMundo x={xx} y={SUELO - 370} text={ciudades[i]} size={30} color="#fff3d6" borde="#2b1c14" />}
                </React.Fragment>
              );
            })}
            {/* caballetes: el cajón espera apoyado en el suelo hasta que lo levantan */}
            {alza < 1 && [-110, 110].map((dx) => <G key={dx} x={ENTIERRO + dx} y={SUELO - 10}><path d="M -40 0 L -10 -120 L 10 -120 L 40 0" stroke="#6a3c1a" strokeWidth={14} fill="none" strokeLinejoin="round" /><rect x={-50} y={-130} width={100} height={16} rx={4} fill="#7d4a24" /></G>)}
            <G x={ENTIERRO + lleva} y={SUELO - 130 - alza * 200}>
              <path d="M -170 0 L -190 -50 L -150 -90 L 150 -90 L 190 -50 L 170 0 Z" fill="#4a2810" stroke="#2b1408" strokeWidth={6} />
              <rect x={-14} y={-80} width={28} height={70} fill="#c9a36a" /><rect x={-40} y={-60} width={80} height={22} fill="#c9a36a" />
              <path d="M 70 -90 Q 100 -140 140 -96 Z" fill="#7a1f3d" />
            </G>
          </>
        );
      })()}
      {/* ── el anillo: rodeado de gente, nadie lo toca */}
      {t > 261 && (
        <>
          <Franz x={9000} y={SUELO - 10} t={t} expr="triste" />
          <Gente t={t} x0={8350} x1={8840} n={5} seed={61} mira={1} habla expr="feliz" />
          <Gente t={t} x0={9160} x1={9650} n={5} seed={63} mira={-1} flipDe={-1} habla expr="feliz" />
          {t > 263.2 && <Svg><circle cx={9000} cy={SUELO - 160} r={150 * clamp((t - 263.2) / 0.5, 0, 1)} fill="none" stroke={C.rojo} strokeWidth={8} strokeDasharray="20 16" /></Svg>}
        </>
      )}
    </>
  );
};

// iconos de "lo que no se puede hacer": apretón, compartir la jarra, ayudar a cargar
const Prohibido: React.FC<{ t: number }> = ({ t }) => {
  if (t < 173.8 || t > 179.6) return null;
  const items = [
    { t0: 174.0, label: "SHAKE HANDS", d: "M -40 6 L -10 -18 L 14 -10 L 40 -26 M -40 6 L -12 28 L 8 14 M 0 20 L 18 6 M 8 30 L 24 16" },
    { t0: 174.9, label: "SHARE A CUP", d: "M -26 -30 L 26 -30 L 22 34 L -22 34 Z M 26 -14 Q 48 -10 44 10 Q 40 22 24 20" },
    { t0: 175.8, label: "HELP CARRY", d: "M -40 -10 L 40 -10 L 40 34 L -40 34 Z M -40 -10 L -20 -34 L 60 -34 L 40 -10 M 40 34 L 60 10 L 60 -34" },
  ];
  const sale = clamp((t - 179.1) / 0.4, 0, 1);
  return (
    <div style={{ position: "absolute", left: 0, top: 730, width: 1920, display: "flex", justifyContent: "center", gap: 60, opacity: 1 - sale }}>
      {items.map((it) => {
        const e = clamp((t - it.t0) / 0.25, 0, 1);
        const x = t > 177.7;
        return (
          <div key={it.label} style={{ transform: `scale(${e})`, width: 280, height: 190, marginBottom: 60, background: "#fff6e0", borderRadius: 28, border: `8px solid ${x ? C.rojo : "#2b2140"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 10px 0 rgba(20,10,50,.35)" }}>
            <svg width={140} height={120} viewBox="-70 -60 140 120"><path d={it.d} stroke="#2b2140" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ position: "absolute", top: 200, left: -40, right: -40, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 38, color: "#fff3d6", WebkitTextStroke: "7px #2b2140", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{it.label}</div>
            {x && <svg style={{ position: "absolute", inset: 0 }} width={280} height={190} viewBox="0 0 280 230" preserveAspectRatio="none"><path d="M 50 40 L 230 190 M 230 40 L 50 190" stroke={C.rojo} strokeWidth={22} strokeLinecap="round" strokeDasharray={240} strokeDashoffset={240 * (1 - clamp((t - 177.7) / 0.2, 0, 1))} /></svg>}
          </div>
        );
      })}
    </div>
  );
};
// flecha + etiqueta que señala algo del personaje (código de vestimenta)
const Senal: React.FC<{ t: number; t0: number; t1: number; text: string; x: number; y: number; ax: number; ay: number; color?: string }> = ({ t, t0, t1, text, x, y, ax, ay, color = C.ambar }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = clamp((t - t0) / 0.3, 0, 1) * clamp((t1 + 0.3 - t) / 0.3, 0, 1);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, opacity: e }} width={1920} height={1080}><line x1={x} y1={y} x2={x + (ax - x) * e} y2={y + (ay - y) * e} stroke="#fff" strokeWidth={10} strokeLinecap="round" /><circle cx={ax} cy={ay} r={14 * e} fill={color} stroke="#fff" strokeWidth={5} /></svg>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${e})`, background: color, color: C.noche, fontFamily, fontWeight: 700, fontSize: 54, padding: "10px 28px", borderRadius: 20, boxShadow: "0 8px 0 rgba(20,10,50,.35)", whiteSpace: "nowrap" }}>{text}</div>
    </>
  );
};

export const P2Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <CartelTrampa t={t} t0={162.05} t1={164.6} n={2} titulo="NOBODY TOUCHES YOU" />
    <Chip t={t} t0={165.0} t1={168.7} text="NOT JUST A DIRTY JOB..." color={C.violeta} x={960} y={150} centro size={58} />
    <Chip t={t} t0={168.85} t1={169.9} text="HE WAS DIRTY" color={C.noche} x={960} y={150} centro size={66} />
    <Chip t={t} t0={169.95} t1={171.4} text="...AND IT WAS CONTAGIOUS" color={C.lima} tinta={C.noche} x={960} y={150} centro size={66} />
    <Chip t={t} t0={171.6} t1={173.9} text="AN ORDINARY CARPENTER" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Prohibido t={t} />
    <Sello t={t} t0={177.75} t1={179.2} text="= HONOR LOST" x={960} y={330} size={100} rot={-8} />
    <Sello t={t} t0={179.4} t1={180.9} text="KICKED OUT" x={1350} y={300} size={90} rot={8} />
    <Chip t={t} t0={180.95} t1={183.1} text="CUSTOMERS: GONE" color={C.rojo} x={960} y={150} centro size={62} />
    <Titulo t={t} t0={183.3} t1={185.9} text="ONE HANDSHAKE..." y={180} size={110} color={C.crema} />
    <Titulo t={t} t0={186.0} t1={188.1} text="...AND NOBODY KNOWS YOU" y={180} size={90} color={C.rojo} borde="#2b0a14" />
    <Chip t={t} t0={188.3} t1={189.5} text="SO PEOPLE WERE CAREFUL" color={C.violeta} x={960} y={150} centro size={58} />
    <Chip t={t} t0={189.55} t1={193.0} text="VERY. CAREFUL." color={C.rojo} x={960} y={150} centro size={70} />
    <Chip t={t} t0={193.2} t1={196.3} text="STUCK IN THE MUD? NO HELP" color={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={196.5} t1={198.6} text="SLIPPED ON ICE? NO CATCH" color={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={198.75} t1={201.7} text="THE RULES EVEN TOLD YOU HOW TO DRESS" color={C.violeta} x={960} y={150} centro size={52} />
    <Senal t={t} t0={201.8} t1={203.6} text="CLOAK · SPECIAL COLOR" x={520} y={420} ax={900} ay={640} />
    <Senal t={t} t0={203.7} t1={205.5} text="A PARTICULAR HAT" x={520} y={300} ax={900} ay={470} color={C.teal} />
    <Senal t={t} t0={205.6} t1={208.3} text="A RIBBON ON YOUR SLEEVE" x={480} y={300} ax={800} ay={640} color={C.lima} />
    <Titulo t={t} t0={210.25} t1={213.0} text="A WALKING WARNING SIGN" y={200} size={100} color={C.ambar} />
    <Chip t={t} t0={213.1} t1={215.8} text="...SOME TRULY STRANGE PROBLEMS" color={C.violeta} x={960} y={150} centro size={56} />
    <Titulo t={t} t0={216.0} t1={218.2} text="WHO BUILDS THE GALLOWS?" y={180} size={96} color={C.crema} />
    <Chip t={t} t0={218.35} t1={220.9} text="IT'S THE EXECUTIONER'S TOOL" color={C.rojo} x={960} y={150} centro size={58} />
    <Sello t={t} t0={221.1} t1={224.4} text="TOUCH IT = DISHONORED" x={1180} y={620} size={80} rot={-6} />
    <Chip t={t} t0={224.55} t1={226.7} text="THE SOLUTION..." color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={226.9} t1={230.7} text="EVERY CARPENTER · SAME TIME" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={230.8} t1={233.2} text="MASTERS + APPRENTICES" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={233.3} t1={236.9} text="WITH MUSIC · COUNCIL WATCHING" color={C.violeta} x={960} y={150} centro size={56} />
    <Chip t={t} t0={237.0} t1={239.35} text="EVERYONE STRIKES TOGETHER..." color={C.rojo} x={960} y={150} centro size={58} />
    <Titulo t={t} t0={240.2} t1={242.9} text="SHAME ÷ 14 = 0" y={200} size={130} color={C.lima} borde="#1b2a10" />
    <Chip t={t} t0={243.1} t1={246.0} text="A WHOLE CEREMONY..." color={C.violeta} x={960} y={150} centro size={60} />
    <Chip t={t} t0={246.1} t1={249.1} text="...TO AVOID TOUCHING YOUR STUFF" color={C.rojo} x={960} y={150} centro size={58} />
    <Chip t={t} t0={249.3} t1={253.3} text="IT DOESN'T END WHEN YOU DIE" color={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={256.85} t1={259.4} text="EXECUTIONERS FROM NEIGHBORING TOWNS" color={C.violeta} x={960} y={150} centro size={52} />
    <Titulo t={t} t0={259.5} t1={261.6} text="THEY CARRY EACH OTHER" y={200} size={100} color={C.crema} />
    <Chip t={t} t0={263.25} t1={265.5} text="SURROUNDED BY PEOPLE" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={265.6} t1={267.4} text="TOUCHED BY NONE" color={C.rojo} x={960} y={150} centro size={66} />
    <Chip t={t} t0={267.5} t1={270.2} text="NOW... TRY TO SIT DOWN" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={60} />
  </>
);
