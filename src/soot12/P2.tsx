import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote } from "./kit";
import { Lapida } from "./kit2";
import { Mundo, camEn, Key, PastoAlto, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, MapaN } from "./comun";
import { PlanoRepton, Cita } from "./escenas";
import { Corona, Tienda, Empalizada, Iglesia, Cruz } from "./vik";

// 186,8-295,1 s · TRAMPA 2: LA ZANJA. Bajás gateando la loma con 200 hombres, el suelo se hunde, el D de Repton desde
// arriba, la iglesia convertida en portón, el corte de la zanja con el barro y el vikingo a la altura justa, y Reading 870.
export const CAM2: Key[] = [
  [186.78, 3600, 520, 0.6], [189.02, 1900, 520, 1.0], [194.12, 2350, 600, 1.35], [196.16, 3100, 760, 1.45], [199.22, 3300, 880, 1.55],
  [208.64, 3700, 720, 1.25], [212.9, 3820, 660, 1.1], [215.22, 4080, 515, 1.6], [219.4, 4060, 530, 1.45], [222.48, 3950, 600, 1.0],
  [231.09, 3480, 880, 1.9], [237.4, 3500, 900, 2.0], [239.4, 3600, 760, 1.3], [242.0, 3640, 740, 1.3], [247.68, 3620, 740, 1.25],
  [289.19, 3050, 760, 0.95], [291.0, 3300, 820, 1.2], [292.4, 3470, 860, 1.5], [295.06, 3520, 870, 1.65],
];

// golpe de maza: hombro arriba en la carga y abajo en cada golpe (hits en segundos)
const golpe = (t: number, hits: number[], base = 40, amp = 130) => {
  for (const h of hits) {
    if (t >= h - 0.42 && t < h - 0.1) return base + ((t - (h - 0.42)) / 0.32) * amp;
    if (t >= h - 0.1 && t < h) return base + amp - ((t - (h - 0.1)) / 0.1) * amp;
  }
  return base;
};
const Maza: React.FC<{ a?: number }> = ({ a = 0 }) => (
  <g transform={`rotate(${a})`}>
    <rect x={-7} y={-12} width={14} height={120} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} />
    <rect x={-38} y={96} width={76} height={50} rx={10} fill="#6a4426" stroke="#2a1530" strokeWidth={5} />
  </g>
);
// salpicón (barro / polvo) que sale de (x,y) en t0
const Salpica: React.FC<{ t: number; t0: number; x: number; y: number; color?: string; n?: number; r?: number }> = ({ t, t0, x, y, color = "#6a4a2e", n = 9, r = 1 }) => {
  const u = t - t0;
  if (u < 0 || u > 0.9) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.1 + (0.8 * i) / (n - 1)); const v = (220 + (i % 3) * 90) * r; return <circle key={i} cx={x - Math.cos(a) * v * u} cy={y - Math.sin(a) * v * u + 420 * u * u * r} r={Math.max(2, (14 - u * 10) * r)} fill={color} />; })}
    </svg>
  );
};
// estacas sobre la D del plano de Repton: [x, y, t del golpe]
const ESTACAS: [number, number, number][] = [[580, 366, 205.3], [480, 540, 206.1], [580, 714, 206.9]];
// puerta de la iglesia-portón (Iglesia x=4080 y=575 s=0,82 → arco de la torre), en coords de mundo: [x centro, y base]
const PORTON: [number, number] = [4248, 837];
// la lanza que se le escapa al resbalar
const LanzaVuela: React.FC<{ t: number; x: number }> = ({ t, x }) => {
  const u = prog(t, 196.3, 197.0);
  return <svg style={{ position: "absolute", left: x + 40 + u * 160, top: gy(x) - 260 - Math.sin(u * Math.PI) * 140, overflow: "visible", transform: `rotate(${u * 300}deg)` }} width={10} height={10}><rect x={-6} y={-200} width={12} height={400} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} /><path d="M 0 -260 L 16 -200 L -16 -200 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={4} /></svg>;
};

// los que bajan gateando con vos (coordenadas de mundo)
const Gatean: React.FC<{ t: number }> = ({ t }) => {
  const u = prog(t, 189.4, 199.0);
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        // al final la columna se aprieta hacia el frente (nadie queda cortado por el borde izquierdo)
        const xf = 1670 + u * 1650;
        const x0 = 1250 + (i % 7) * 70 - Math.floor(i / 7) * 160 + u * 1650 - (i % 3) * 30;
        const x = xf - (xf - x0) * (1 - 0.5 * prog(t, 195.2, 198.6));
        return <Persona key={i} x={x} y={gy(x) + 26} h={180} t={t} seed={300 + i} ropa={i % 4 === 0 ? SENOR : SAJON} expr="miedo" inclina={38} camina={0.5} opacity={0.88} />;
      })}
      {(() => {
        // el primero: gatea y, cuando el suelo se hunde, RESBALA de espaldas pendiente abajo
        const cae = t > 196.3;
        const res = prog(t, 196.3, 197.6);
        const x = interpolate(t, [189.4, 196.3, 197.6], [1700, 1700 + prog(196.3, 189.4, 199.0) * 1720, 3330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <>
            <Persona x={x} y={gy(x) + 30 - (cae && res < 1 ? Math.abs(Math.sin(res * 9)) * 14 : 0)} h={250} t={t} seed={3} ropa={SAJON} expr={cae ? "sorpresa" : "miedo"} inclina={cae ? -28 + res * 18 : 36} camina={cae ? 0 : 0.6}
              bD={cae ? 150 + Math.sin(t * 16) * 25 : 30} cD={20} bI={cae ? 140 + Math.sin(t * 16 + 2) * 25 : 8} cI={20} manoD={cae ? undefined : <LanzaMano a={60} inclina={-30} largo={420} />} />
            {cae && res < 1 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{[0, 1, 2, 3, 4].map((k) => { const kk = (t * 3 + k * 0.2) % 1; return <circle key={k} cx={x - 40 - kk * 120} cy={gy(x - 40 - kk * 120) + 10 - kk * 60} r={18 + kk * 26} fill="#8a7a6a" opacity={(1 - kk) * 0.7} />; })}</svg>}
            {cae && t < 197.0 && <LanzaVuela t={t} x={x} />}
          </>
        );
      })()}
    </>
  );
};

const Yo: React.FC<{ t: number; x: number; y: number; expr?: "miedo" | "sorpresa" | "triste" | "enojado" | "neutro" }> = ({ t, x, y, expr = "miedo" }) => (
  <Persona x={x} y={y} h={260} t={t} seed={3} ropa={SAJON} expr={expr} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />
);

// el barro a un nivel dado: llena el fondo de la zanja por debajo de y=nivel, siguiendo las paredes
const barroEn = (nivel: number, t: number) => {
  let a = 3350, b = 3650;
  for (let x = 3350; x < 3650; x++) if (gy(x) >= nivel) { a = x; break; }
  for (let x = 3650; x > 3350; x--) if (gy(x) >= nivel) { b = x; break; }
  const fondo = Array.from({ length: 31 }, (_, i) => { const x = b - (i / 30) * (b - a); return `L ${x.toFixed(0)} ${(gy(x) + 4).toFixed(0)} `; }).join("");
  return `M ${a} ${nivel} Q ${(a + b) / 2} ${nivel - 8 + Math.sin(t * 2) * 5} ${b} ${nivel} ${fondo}Z`;
};

export const P2: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM2);
  // en la zanja: te deslizás hasta el fondo y el barro te llega a las rodillas
  const xz = interpolate(t, [233.4, 235.6], [3370, 3480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yz = gy(xz) + 10;
  const sube = prog(t, 238.4, 240.4);
  // el barro sube por las piernas hasta las rodillas (≈80 px sobre los pies)
  const lvl = interpolate(t, [233.4, 236.8], [yz + 6, yz - 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 2 · la señal: bajás gateando con 200 hombres */}
      <Escena t={t} t0={186.78} t1={199.22} zoom={0} entra="corte" golpes={[196.3]}>
        <Mundo t={t} cam={cam} luna={[1700, 110, 78]}>
          <Gatean t={t} />
          {/* el señor da la señal desde la loma */}
          <Persona x={1290} y={gy(1290) + 30} h={300} t={t} seed={4} ropa={SENOR} expr="enojado" bD={t > 189 && t < 191 ? 150 : 20} cD={20} />
        </Mundo>
        <Cartel t={t} t0={186.8} t1={189.0} n={2} nombre="THE DITCH" />
        <Ch t={t} t0={189.4} t1={194.0} text="THE SIGNAL" color={C.violeta} x={120} y={150} size={60} />
        <Ch t={t} t0={190.6} t1={194.0} text="SLOWLY · QUIETLY" color={C.teal} tinta={C.noche} x={120} y={260} size={52} />
        <Cuenta t={t} t0={194.2} t1={196.1} de={0} a={200} dur={0.9} x={960} y={210} size={180} sufijo=" MEN" />
        <Ch t={t} t0={194.9} t1={196.1} text="TRYING NOT TO COUGH 🤫" color={C.ambar} tinta={C.noche} x={960} y={350} centro size={50} />
        {t > 196.3 && t < 198.4 && <Particulas t={t} tipo="polvo" n={30} seed={12} />}
        <G t={t} t0={196.3} text="THE GROUND DROPS AWAY" y={930} size={96} color={C.crema} />
        <Flash t={t} t0={196.3} dur={0.18} />
      </Escena>
      {/* 1 · lo que encontraron los arqueólogos: un D gigante con las puntas en el río */}
      <Escena t={t} t0={199.22} t1={208.64} entra="iris" ix={960} iy={760} golpes={[203.6, 206.2]}>
        <PlanoRepton t={t} zanja={203.6} iglesia={206.4} />
        {/* estacas que la arqueóloga clava siguiendo la D (cada una con su golpe) */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {ESTACAS.map(([sx, sy, h], i) => {
            if (t < h - 0.5) return null;
            const baja = interpolate(t, [h - 0.5, h - 0.25, h], [0, 0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const dy = (1 - baja) * -160;
            return (
              <g key={i} transform={`translate(${sx} ${sy + dy})`} opacity={Math.min(1, (t - h + 0.5) * 6)}>
                <ellipse cx={0} cy={18} rx={34} ry={10} fill="#1a0e14" opacity={0.4 * baja} />
                <path d="M -14 -70 L 14 -70 L 14 10 L 0 26 L -14 10 Z" fill="#c9a24a" stroke="#2a1530" strokeWidth={6} />
                <path d="M -18 -86 L 18 -86 L 18 -64 L -18 -64 Z" fill={C.rojo} stroke="#2a1530" strokeWidth={5} />
                {t > h && t < h + 0.35 && [0, 1, 2, 3].map((k) => <line key={k} x1={Math.cos(k * 1.57 + 0.78) * 30} y1={10 + Math.sin(k * 1.57 + 0.78) * 16} x2={Math.cos(k * 1.57 + 0.78) * (50 + (t - h) * 120)} y2={10 + Math.sin(k * 1.57 + 0.78) * (26 + (t - h) * 60)} stroke="#fff3c4" strokeWidth={6} strokeLinecap="round" />)}
              </g>
            );
          })}
        </svg>
        {(() => {
          // camina hasta el borde de la D y clava con la maza al ritmo de cada estaca
          const xa = interpolate(t, [203.4, 204.6], [220, 290], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const clava = t > 204.6;
          return <Persona x={xa} y={1120} h={560} t={t} seed={64} ropa={{ tunica: "#d8a23a", tunica2: "#9a6a1a", cinto: "#5a3418", piel: "#e8b08a", piel2: "#c98864", pelo: "#3a2418" }} mujer expr={clava ? (t % 1.4 < 0.7 ? "orgullo" : "feliz") : t > 203.6 ? "sorpresa" : "feliz"} mira={0.9}
            camina={t > 203.4 && t < 204.6 ? 1.2 : 0} inclina={clava ? 8 : 0}
            bD={clava ? golpe(t, ESTACAS.map((e) => e[2]), 45, 75) : t > 203.4 ? 105 : 40 + Math.max(0, Math.sin(t * 7)) * 50} cD={clava ? 30 : t > 203.4 ? 0 : 60}
            manoD={clava ? <Maza a={-90} /> : t > 203.4 ? undefined : <g transform="rotate(180)"><rect x={-8} y={-20} width={16} height={130} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} /><path d="M -8 110 L 0 140 L 8 110 Z" fill="#8a5a32" /></g>} />;
        })()}
        <Ch t={t} t0={199.5} text="REPTON · ARCHAEOLOGISTS FOUND IT" color={C.violeta} x={120} y={150} size={52} />
        <G t={t} t0={203.6} text="A GIANT “D”" x={1380} y={300} size={110} color={C.ambar} />
        <Ch t={t} t0={205.4} text="BOTH ENDS → INTO THE RIVER" color={C.teal} tinta={C.noche} x={1420} y={450} centro size={50} />
      </Escena>
      {/* 2 · detrás, el terraplén con la empalizada · y la iglesia, que no tiraron: la hicieron portón */}
      <Escena t={t} t0={208.64} t1={222.48} zoom={0} entra="zoom" golpes={[217.7, 219.5]}>
        <Mundo t={t} cam={cam} luna={[1700, 110, 70]}>
          {t < 213.2 && [3690, 3790, 3880].map((x, i) => (
            <Persona key={i} x={x} y={gy(x) + 20} h={170} t={t} seed={400 + i} ropa={VIK(i + 1)} casco="vikingo" barba={barbaDe(i + 1)} expr="enojado" flip={i === 1} bD={60 + Math.max(0, Math.sin(t * 6 + i * 2)) * 80} cD={40} bI={50} cI={60}
              manoD={<g transform="rotate(170)"><rect x={-5} y={-30} width={10} height={150} fill="#8a5a32" /><path d="M -22 118 L 22 118 L 16 160 L -16 160 Z" fill="#9aa6b8" stroke="#2a1530" strokeWidth={4} /></g>} />
          ))}
          {t < 213.2 && [3690, 3790, 3880].map((x, i) => Math.sin(t * 6 + i * 2) > 0.5 && <div key={"d" + i} style={{ position: "absolute", left: x - 40, top: gy(x) - 120 - Math.sin(t * 6 + i * 2) * 50, width: 26, height: 18, borderRadius: 9, background: "#6a4a2e" }} />)}
          {t > 208.8 && t < 213 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <path d={`M 3650 860 L 3720 770 L 3840 770 L 3920 860`} fill="none" stroke={C.ambar} strokeWidth={14} strokeDasharray="30 14" opacity={ent(t, 208.9)} />
            </svg>
          )}
          {/* «+ A WOODEN FENCE»: los postes suben uno por uno sobre el terraplén, cada uno con su mazazo */}
          {t > 210.4 && [3726, 3760, 3794, 3828].map((px, i) => {
            const h = 210.7 + i * 0.5;
            const sube = interpolate(t, [h - 0.3, h], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return t > h - 0.3 && (
              <svg key={"p" + i} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <path d={`M ${px - 15} 772 L ${px - 15} ${772 - 190 * sube} L ${px} ${752 - 190 * sube} L ${px + 15} ${772 - 190 * sube} L ${px + 15} 772 Z`} fill={i % 2 ? "#a8794a" : "#946a3e"} stroke="#2a1530" strokeWidth={5} />
                {t > h && t < h + 0.3 && <circle cx={px} cy={772 - 190} r={20 + (t - h) * 160} fill="none" stroke="#fff3c4" strokeWidth={6} opacity={1 - (t - h) / 0.3} />}
              </svg>
            );
          })}
          {t > 210.4 && t < 213.2 && <Persona x={3700} y={gy(3700) + 14} h={170} t={t} seed={407} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} expr="enojado" bD={golpe(t, [210.7, 211.2, 211.7, 212.2], 60)} cD={30} manoD={<Maza a={-90} />} />}
          {/* el que pasa delante de la iglesia, la señala y la marca */}
          {t > 213.0 && (() => {
            const xv = interpolate(t, [213.0, 215.3], [4500, 4130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const se = t > 215.3;
            return <Persona x={xv} y={gy(xv) + 12} h={230} t={t} seed={409} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr={t > 219.5 ? "orgullo" : se ? "sorpresa" : "neutro"} flip={!se} camina={t < 215.3 ? 1.1 : 0}
              bD={t > 219.5 ? golpe(t, [219.6, 220.2, 220.8], 70) : se ? 110 : 20} cD={se ? 0 : 20} manoD={t > 219.5 ? <Maza a={-90} /> : undefined} />;
          })()}
          {t > 217.6 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <rect x={3700} y={540} width={560} height={240} rx={30} fill="none" stroke={C.rojo} strokeWidth={14} opacity={ent(t, 217.7)} />
            </svg>
          )}
          {/* el portón de tablas que tapa la puerta de la iglesia */}
          {t > 219.3 && (() => {
            const b = interpolate(t, [219.3, 219.55], [-260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <g transform={`translate(0 ${b})`}>
                  {[0, 1, 2, 3].map((k) => <rect key={k} x={PORTON[0] - 38 + k * 19} y={PORTON[1] - 112} width={19} height={112} fill={k % 2 ? "#8a5a32" : "#7a4a26"} stroke="#2a1530" strokeWidth={4} />)}
                  <rect x={PORTON[0] - 42} y={PORTON[1] - 86} width={84} height={14} fill="#5e3a1e" stroke="#2a1530" strokeWidth={4} />
                  <rect x={PORTON[0] - 42} y={PORTON[1] - 36} width={84} height={14} fill="#5e3a1e" stroke="#2a1530" strokeWidth={4} />
                </g>
              </svg>
            );
          })()}
          <Salpica t={t} t0={219.55} x={PORTON[0]} y={PORTON[1]} color="#9a8a7a" n={7} r={0.6} />
        </Mundo>
        <Ch t={t} t0={208.9} t1={212.9} text="A BANK OF EARTH" color={C.ambar} tinta={C.noche} x={120} y={160} size={58} />
        <Ch t={t} t0={210.6} t1={212.9} text="+ A WOODEN FENCE" color={C.violeta} x={120} y={270} size={54} />
        <Ch t={t} t0={213.0} t1={215.2} text="NOW THE WORRYING PART…" color={C.rojo} x={120} y={160} size={58} />
        <Ch t={t} t0={215.3} t1={217.6} text="THE OLD STONE CHURCH?" color={C.teal} tinta={C.noche} x={120} y={160} size={56} />
        <Ch t={t} t0={216.2} t1={217.6} text="NOT KNOCKED DOWN" color={C.rojo} x={120} y={270} size={52} />
        <Emote t={t} t0={215.4} t1={217.6} tipo="preg" x={1180} y={560} s={1.2} />
        <G t={t} t0={217.7} t1={219.4} text="PART OF THE WALL" x={700} y={200} size={110} color={C.crema} />
        <Sello t={t} t0={219.5} text="VIKING GATEHOUSE" x={650} y={330} size={78} rot={-5} />
        <Ch t={t} t0={220.2} text="A MERCIAN SAINT'S CHURCH ✝" color={C.violeta} x={120} y={160} size={46} />
      </Escena>
      {/* 3 · no atacás un montón de carpas: atacás un fuerte, hecho en semanas, por gente que ya lo hizo */}
      <Escena t={t} t0={222.48} t1={231.09} entra="diag" golpes={[223.6, 225.6, 228.0]}>
        <Mundo t={t} cam={{ x: 5000, y: 560, z: 0.7 }} luna={[-400, -400, 1]} />
        <AbsoluteFill style={{ background: "rgba(10,6,34,.55)" }} />
        {t < 225.5 && [600, 960, 1320].map((x, i) => <Tienda key={i} x={x} y={640} s={0.62} k={i} t={t} t0={222.6 + i * 0.15} />)}
        {t > 223.6 && t < 225.5 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <path d="M 420 360 L 1500 860 M 1500 360 L 420 860" stroke={C.rojo} strokeWidth={34} strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${prog(t, 223.6, 224.0)} 1` }} />
          </svg>
        )}
        {t < 225.5 && <Ch t={t} t0={222.6} text="A PILE OF TENTS?" color={C.violeta} x={960} y={150} centro size={64} />}
        {t < 225.5 && <Persona x={200} y={1040} h={360} t={t} seed={3} ropa={SAJON} expr={t > 223.7 ? "sorpresa" : "neutro"} mira={0.8} bD={t > 222.8 ? 100 : 20} cD={0} aparece={222.6} />}
        {/* «built in a few weeks»: timelapse — el sol y la luna cruzan el cielo y la empalizada crece poste a poste */}
        {t > 226.4 && (() => {
          const fase = ((t - 226.4) / 0.9) % 1;
          const dia = fase < 0.5;
          const a = Math.PI * (dia ? fase * 2 : (fase - 0.5) * 2);
          // el sol/luna giran en un arco chico en la esquina derecha (a la derecha del fuerte): nunca detrás de cabezas ni títulos
          const cx = 1740 - Math.cos(a) * 125, cy = 600 - Math.sin(a) * 170;
          return (
            <>
              <AbsoluteFill style={{ background: dia ? `rgba(120,170,230,${0.5 * Math.sin(a)})` : "transparent" }} />
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                {dia ? <><circle cx={cx} cy={cy} r={70} fill="#ffd36a" opacity={0.35} /><circle cx={cx} cy={cy} r={48} fill="#ffd36a" /></> : <circle cx={cx} cy={cy} r={42} fill="#fff4d6" />}
              </svg>
            </>
          );
        })()}
        {t > 225.5 && (
          <div style={{ position: "absolute", left: 960, top: 640, transform: `translate(-50%,-50%) scale(${ent(t, 225.5)})` }}>
            <svg width={1300} height={460} viewBox="-650 -300 1300 460" style={{ overflow: "visible" }}>
              <path d="M -650 140 L -560 -40 L 560 -40 L 650 140 Z" fill="#5e4a36" stroke="#2a1530" strokeWidth={8} />
              <rect x={-90} y={-260} width={180} height={220} fill="#9a9aa8" stroke="#2a1530" strokeWidth={8} />
              <path d="M -110 -260 L 0 -330 L 110 -260 Z" fill="#6a6a7a" stroke="#2a1530" strokeWidth={8} />
              <path d="M -40 -40 L -40 -130 Q 0 -170 40 -130 L 40 -40 Z" fill="#2a1530" />
              {Array.from({ length: 26 }, (_, i) => {
                const k = i < 13 ? i * 2 : (25 - i) * 2 + 1;
                const h = interpolate(t, [226.4 + k * 0.13, 226.6 + k * 0.13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                if (i === 12 || i === 13 || h <= 0) return null;
                return <path key={i} d={`M ${-540 + i * 42} -40 L ${-540 + i * 42} ${-40 - 150 * h} L ${-524 + i * 42} ${-64 - 150 * h} L ${-508 + i * 42} ${-40 - 150 * h} L ${-508 + i * 42} -40 Z`} fill={i % 2 ? "#a8794a" : "#946a3e"} stroke="#2a1530" strokeWidth={5} />;
              })}
            </svg>
          </div>
        )}
        {/* los constructores: tres clavan con maza, uno va y viene cargando troncos */}
        {t > 225.6 && [[480, 0], [760, 1], [1160, 2], [1400, 3]].map(([px, k]) => {
          const hits = Array.from({ length: 14 }, (_, j) => 226.2 + j * 0.36 + k * 0.09);
          const carga = k === 3;
          const ida = ((t - 225.6) * 0.5) % 1;
          const xc = carga ? 1540 - Math.sin(ida * Math.PI) * 170 : px; // no pasa por delante del que clava en 1160 (la maza le cruzaba la cara)
          return <Persona key={k} x={xc} y={606} h={190} t={t} seed={440 + k} ropa={VIK(k + 2)} casco="vikingo" barba={barbaDe(k + 2)} expr={k % 2 ? "enojado" : "orgullo"} flip={carga ? ida < 0.5 : k >= 2} aparece={225.7 + k * 0.1}
            camina={carga ? 1.6 : 0} bD={carga ? 165 : golpe(t, hits, 50)} cD={30} bI={carga ? 165 : 20} cI={carga ? 30 : 20}
            manoD={carga ? <rect x={-70} y={-14} width={160} height={26} rx={12} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} /> : <Maza a={-90} />} />;
        })}
        <G t={t} t0={225.6} text="A FORT" y={128} size={140} color={C.crema} />
        <Ch t={t} t0={227.0} t1={229.3} text="BUILT IN A FEW WEEKS" color={C.ambar} tinta={C.noche} x={960} y={335} centro size={54} />
        <Cuenta t={t} t0={226.4} de={1} a={21} dur={4.2} x={1640} y={250} size={100} color={C.ambar} prefijo="DAY " />
        {["THANET", "SHEPPEY", "READING", "TORKSEY"].map((n, i) => (
          <Ch key={n} t={t} t0={228.0 + i * 0.5} text={`${n} ✓`} color={C.teal} tinta={C.noche} x={330 + i * 420} y={985} centro size={42} />
        ))}
        <Ch t={t} t0={229.4} text="BY MEN WHO'D DONE IT MANY TIMES" color={C.rojo} x={960} y={335} centro size={52} />
      </Escena>
      {/* 4 · cruzar la zanja de noche: barro a las rodillas, la pared resbala, el que sale queda recortado contra el cielo */}
      <Escena t={t} t0={231.09} t1={247.68} zoom={0} entra="corte" golpes={[233.5, 238.5, 242.0]}>
        <Mundo t={t} cam={cam}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            {/* estacas en el fondo que no ves */}
            {t > 245.5 && [3420, 3500, 3580].map((x, i) => <path key={i} d={`M ${x - 14} 1032 L ${x} ${980 - (i % 2) * 14} L ${x + 14} 1032 Z`} fill="#5e3a1e" stroke="#2a1530" strokeWidth={4} opacity={ent(t, 245.5 + i * 0.12) * 0.85} />)}
          </svg>
          <Persona x={xz + (t > 233.6 && t < 238.3 ? Math.sin(t * 13) * 8 : 0)} y={yz} h={260} t={t} seed={3} ropa={SAJON} expr={t > 238 ? "sorpresa" : t > 235.9 ? "enojado" : "miedo"}
            inclina={t > 233.6 && t < 238.3 ? Math.sin(t * 6.5) * 14 : 0}
            bD={t > 233.6 && t < 238.3 ? 120 + Math.sin(t * 9) * 30 : 30} cD={20} bI={t > 233.6 && t < 238.3 ? 120 + Math.sin(t * 9 + 2) * 30 : 8} cI={20} manoD={t > 233.6 && t < 238.3 ? undefined : <LanzaMano a={50} inclina={-14} largo={420} />} />
          {t > 233.6 && t < 238.3 && <Emote t={t} t0={234.2} t1={238.2} tipo="sudor" x={xz - 120} y={yz - 140} s={0.8} />}
          {t > 233.6 && t < 238.3 && Math.sin(t * 13) > 0.4 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{[0, 1, 2, 3].map((k) => <circle key={k} cx={xz - 50 + k * 34} cy={960 - Math.abs(Math.sin(t * 20 + k)) * 40} r={8} fill="#6a4a2e" />)}</svg>}
          {/* el barro, encima de las piernas */}
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            <path d={barroEn(lvl, t)} fill="#4a3220" opacity={0.97} />
            {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={xz - 100 + i * 40} cy={lvl + 8 + (i % 2) * 8} rx={12} ry={4} fill="#6a4a2e" />)}
            {t > 233.6 && t < 238.3 && [0, 1].map((i) => { const k = ((t - 233.6) * 1.6 + i * 0.5) % 1; return <ellipse key={"o" + i} cx={xz} cy={lvl} rx={40 + k * 90} ry={8 + k * 14} fill="none" stroke="#7a5a3a" strokeWidth={5} opacity={1 - k} />; })}
          </svg>
          {/* el que sale, recortado contra el cielo */}
          {t > 238.4 && (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <ellipse cx={3680} cy={700} rx={180} ry={140} fill="#6a5ac8" opacity={0.35 * ent(t, 238.6)} />
              </svg>
              <Persona x={3600 + sube * 70} y={940 - sube * 150} h={240} t={t} seed={312} ropa={SAJON} sombra="#06051a" casco="saxon" inclina={30 - sube * 20} bI={140} bD={60} cD={20} manoD={<LanzaMano a={40} largo={380} />} />
            </>
          )}
          {/* el vikingo en el terraplén, lanza a la altura justa */}
          <Persona x={3800} y={772} h={300} t={t} seed={205} ropa={VIK(5)} casco="vikingo" barba={barbaDe(5)} expr="enojado" flip aparece={238.9} manoD={<LanzaMano a={90} inclina={-82} largo={520} />} />
        </Mundo>
        <Ch t={t} t0={231.3} t1={233.4} text="NOW CROSS IT. AT NIGHT." color={C.violeta} x={960} y={150} centro size={60} />
        <Ch t={t} t0={233.6} t1={238.3} text="MUD UP TO YOUR KNEES" color={C.ambar} tinta={C.noche} x={120} y={160} size={56} />
        <Ch t={t} t0={235.9} t1={238.3} text="STEEP · SLIPPERY" color={C.teal} tinta={C.noche} x={120} y={270} size={52} />
        <Ch t={t} t0={238.6} t1={247.6} text="LIT UP AGAINST THE SKY" color={C.rojo} x={120} y={160} size={56} />
        <Ch t={t} t0={242.2} t1={247.6} text="EXACTLY SPEAR HEIGHT" color={C.ambar} tinta={C.noche} x={120} y={270} size={52} />
        <Emote t={t} t0={245.4} tipo="preg" x={760} y={760} s={1.4} />
        <Ch t={t} t0={245.6} text="AND THE BOTTOM? YOU CAN'T SEE IT" color={C.violeta} x={960} y={940} centro size={46} />
      </Escena>
      {/* 5 · preguntale a los de Wessex: Reading, invierno del 870, entre dos ríos */}
      <Escena t={t} t0={247.68} t1={254.6} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[247.68, 690, 720, 1.8], [250.6, 700, 767, 3.2], [254.6, 700, 767, 3.8]]} desde="NORWAY"
          pulsa={[{ n: "READING", t0: 251.0, color: C.rojo, label: "READING", lado: "der" }]} />
        {/* los hombres de Wessex marchan en columna hacia el punto de Reading (dos filas, el primero con el estandarte del dragón) */}
        {Array.from({ length: 10 }, (_, i) => {
          const fila = i % 2, col = Math.floor(i / 2);
          const x = interpolate(t, [247.7, 254.6], [-40 - col * 150 + fila * 60, 760 - col * 150 + fila * 60]);
          const y = 960 + fila * 50;
          const lider = i === 0;
          return <Persona key={i} x={x} y={y} h={fila ? 250 : 230} t={t} seed={420 + i} ropa={lider ? SENOR : SAJON} casco="saxon" expr={lider ? "orgullo" : "enojado"} camina={1.6} bD={lider ? 150 : 30} cD={lider ? 10 : 20}
            manoD={lider ? <g><rect x={-7} y={-300} width={14} height={330} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} transform="rotate(180)" /><path d={`M 0 250 L ${-110 - Math.sin(t * 6) * 10} ${262 + Math.sin(t * 6) * 6} L ${-100 - Math.sin(t * 6 + 1) * 12} 310 L 0 300 Z`} fill={C.rojo} stroke="#2a1530" strokeWidth={4} transform="rotate(180)" /></g> : <LanzaMano a={50} inclina={-14} largo={300} />} />;
        })}
        {t > 251.0 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M 860 820 Q 900 680 ${955} 570`} stroke={C.rojo} strokeWidth={12} fill="none" strokeDasharray="26 16" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${prog(t, 251.0, 252.0)} 1` }} /></svg>}
        <Ch t={t} t0={247.9} text="ASK THE MEN OF WESSEX" color={C.ambar} tinta={C.noche} x={120} y={150} size={60} />
        <G t={t} t0={251.5} text="WINTER 870" y={260} size={150} color={C.crema} />
        <Ch t={t} t0={253.0} text="THE SAME KIND OF CAMP" color={C.violeta} x={960} y={400} centro size={52} />
      </Escena>
      <Escena t={t} t0={254.6} t1={259.69} entra="iris" ix={960} iy={540} golpes={[256.0, 257.2]}>
        <AbsoluteFill style={{ background: "#3a6a3e" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 137) % 1080} r={30} fill="#336036" />)}
          <path d="M -50 300 Q 600 360 1050 620 Q 1400 820 1980 840" stroke="#3a7ac8" strokeWidth={90} fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 254.8, 255.8)} 1` }} />
          <path d="M 300 1130 Q 700 900 1050 620" stroke="#4a8ad8" strokeWidth={70} fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 255.6, 256.6)} 1` }} />
          {t > 257.2 && <path d="M 470 410 Q 560 760 760 900" stroke="#7a5a3a" strokeWidth={34} fill="none" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${prog(t, 257.2, 258.0)} 1` }} />}
        </svg>
        {t > 257.6 && [[840, 600], [960, 660], [900, 780]].map(([x, y], i) => <Tienda key={i} x={x} y={y} s={0.3} k={i} t={t} t0={257.7 + i * 0.12} />)}
        {/* los vikingos levantan el banco con palas (adentro, a la derecha del banco) */}
        {[[690, 720], [800, 880], [870, 740]].map(([x, y], i) => {
          const pal = Math.max(0, Math.sin(t * 6 + i * 2));
          const agacha = t > 258.2 && t < 258.9;
          return (
            <React.Fragment key={i}>
              <Persona x={x} y={y} h={270} t={t} seed={430 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={agacha ? "sorpresa" : "enojado"} flip inclina={agacha ? 20 : pal * 18} bD={agacha ? 150 : 60 + pal * 80} cD={40}
                manoD={agacha ? undefined : <g transform="rotate(170)"><rect x={-5} y={-30} width={10} height={150} fill="#8a5a32" /><path d="M -22 118 L 22 118 L 16 160 L -16 160 Z" fill="#9aa6b8" stroke="#2a1530" strokeWidth={4} /></g>} />
              {pal > 0.6 && !agacha && <div style={{ position: "absolute", left: x - 120 - pal * 30, top: y - 200 - pal * 60, width: 30, height: 20, borderRadius: 10, background: "#7a5a3a" }} />}
            </React.Fragment>
          );
        })}
        {/* arqueros ingleses desde afuera (izquierda): las flechas pegan en el banco y rebotan */}
        {[[150, 640], [230, 820]].map(([x, y], i) => <Persona key={"a" + i} x={x} y={y} h={240} t={t} seed={436 + i} ropa={SAJON} casco="saxon" expr="enojado" bI={90} cI={0} manoI={<g transform="rotate(-90)"><path d="M 0 -80 Q 40 0 0 80" fill="none" stroke="#7a4a22" strokeWidth={8} /><line x1={0} y1={-80} x2={0} y2={80} stroke="#f4ead2" strokeWidth={3} /></g>} aparece={257.2 + i * 0.15} />)}
        {t > 257.6 && [0, 1, 2, 3].map((i) => {
          const t0 = 257.7 + i * 0.4;
          const u = prog(t, t0, t0 + 0.45), reb = prog(t, t0 + 0.45, t0 + 1.0);
          const y0 = 560 + i * 90;
          const xb = 470 + (y0 - 410) * 0.55; // x del banco a esa altura
          const x = 260 + u * (xb - 300) - reb * 140, y = y0 - Math.sin(reb * Math.PI) * 90 + reb * 60;
          return u > 0 && reb < 1 && (
            <React.Fragment key={"f" + i}>
              <svg style={{ position: "absolute", left: x - 60, top: y - 10, transform: `rotate(${reb > 0 ? 180 + reb * 200 : 0}deg)`, overflow: "visible" }} width={120} height={20}><line x1={0} y1={10} x2={100} y2={10} stroke="#3a2418" strokeWidth={6} /><path d="M 120 10 L 100 2 L 100 18 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={2} /><path d="M 0 10 L -14 2 M 0 10 L -14 18" stroke={C.rojo} strokeWidth={5} /></svg>
              {reb > 0 && reb < 0.4 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={xb - 10} cy={y0} r={20 + reb * 80} fill="none" stroke="#fff3c4" strokeWidth={6} opacity={1 - reb * 2.5} /></svg>}
            </React.Fragment>
          );
        })}
        <Ch t={t} t0={256.0} text="THAMES" color={C.teal} tinta={C.noche} x={1500} y={700} centro size={52} />
        <Ch t={t} t0={256.8} text="KENNET" color={C.teal} tinta={C.noche} x={400} y={980} centro size={52} />
        <Ch t={t} t0={257.4} text="A BANK OF EARTH BETWEEN TWO RIVERS" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={54} />
      </Escena>
      {/* 6 · Æthelwulf caza un grupo vikingo en campo abierto y gana · todos festejan */}
      <Escena t={t} t0={259.69} t1={268.44} entra="barrido" banda={C.lima} golpes={[263.4, 267.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #8ad0f0, #d8f0f8 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 760 Q 960 700 1920 760 L 1920 1080 L 0 1080 Z" fill="#6aaa4a" /><path d="M 0 840 Q 960 790 1920 840 L 1920 1080 L 0 1080 Z" fill="#5a9a3e" /></svg>
        {/* CARGA: los ingleses corren (x +700) con la lanza adelante; en «celebrated» saltan con los brazos arriba */}
        {Array.from({ length: 8 }, (_, i) => {
          const fiesta = t > 266.95;
          const x = interpolate(t, [260.2, 263.4], [100 + i * 88, 620 + i * 115], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const corre = t > 260.2 && t < 263.4;
          // «celebrated»: saltos de 60 px (0,35 s en el aire cada 0,5 s), desfasados 0,08 s
          const ph = fiesta ? (t - 266.95 - i * 0.08) : -1;
          const hop = ph > 0 && ph % 0.5 < 0.35 ? Math.sin(((ph % 0.5) / 0.35) * Math.PI) * 60 : 0;
          const tira = fiesta && (i === 2 || i === 5); // estos dos tiran el casco al aire
          return <Persona key={i} x={x} y={900 + (i % 2) * 40 - hop} h={i === 0 ? 300 : 240} t={t} seed={330 + i} ropa={i === 0 ? SENOR : SAJON} casco={tira ? "no" : "saxon"} expr={fiesta ? "feliz" : "enojado"} camina={corre ? 2.6 : 0} inclina={corre ? 16 : 0} habla={fiesta}
            bD={fiesta ? 168 + Math.sin(t * 9 + i) * 10 : corre ? 90 : t > 263.4 ? 70 + Math.max(0, Math.sin(t * 7 + i)) * 60 : 30} cD={fiesta ? -10 : 20} bI={fiesta ? 168 + Math.sin(t * 9 + i + 1) * 10 : 8} cI={fiesta ? 10 : 0}
            manoD={fiesta ? undefined : <LanzaMano a={corre ? 0 : 50} inclina={corre ? 90 : -14} largo={360} />} />;
        })}
        {/* los dos cascos que vuelan por el aire */}
        {t > 266.95 && [2, 5].map((i) => {
          const u = t - 267.05 - i * 0.04;
          if (u < 0) return null;
          const x0 = 620 + i * 115, y0 = 900 + (i % 2) * 40 - 240;
          const T = u % 1.4; // sube, cae, lo vuelven a tirar
          const cx = x0 + (i === 2 ? -1 : 1) * T * 40, cy = y0 - 560 * T + 800 * T * T;
          return <svg key={"k" + i} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            <g transform={`translate(${cx} ${cy}) rotate(${T * 540 * (i === 2 ? -1 : 1)})`}>
              <path d="M -34 10 Q -36 -34 0 -38 Q 36 -34 34 10 Z" fill="#8c7a5c" stroke="#2a1530" strokeWidth={5} />
              <rect x={-38} y={6} width={76} height={10} rx={4} fill="#6e5e44" stroke="#2a1530" strokeWidth={4} />
            </g>
          </svg>;
        })}
        {/* confeti: 20 papelitos que caen girando */}
        {t > 266.95 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {Array.from({ length: 20 }, (_, k) => {
              const u = t - 266.95 - (k % 5) * 0.07;
              if (u < 0) return null;
              const x = 200 + ((k * 337) % 1500) + Math.sin(u * 4 + k) * 40;
              const y = 420 - 260 * Math.exp(-u * 6) + u * (170 + (k % 4) * 40) - 120 + (k % 3) * 40;
              return <rect key={k} x={x - 10} y={y - 6} width={20} height={12} rx={3} fill={[C.rojo, C.ambar, C.teal, C.lima, C.violeta][k % 5]} transform={`rotate(${u * 400 + k * 40} ${x} ${y})`} />;
            })}
          </svg>
        )}
        {/* los vikingos los esperan de frente y, al choque, se dan vuelta y huyen por la derecha */}
        {Array.from({ length: 5 }, (_, i) => {
          const huye = t > 263.3;
          const x = 1320 + i * 110 + (huye ? Math.pow(t - 263.3, 1.3) * 380 : 0);
          return <Persona key={i} x={x} y={900 + (i % 2) * 30} h={230} t={t} seed={340 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={huye ? "miedo" : "enojado"} flip={!huye} camina={huye ? 2.6 : 0} inclina={huye ? 14 : 0}
            bD={huye ? 160 : 60} cD={huye ? 0 : 40} bI={huye ? 150 : 20} />;
        })}
        {t > 263.4 && t < 265 && <Emote t={t} t0={263.5} t1={265} tipo="susto" x={1500} y={700} s={1} />}
        {t > 263.3 && t < 264.2 && <Particulas t={t} tipo="polvo" n={30} seed={14} />}
        <Flash t={t} t0={263.4} dur={0.15} />
        {t > 266.95 && <Particulas t={t} tipo="destellos" n={50} seed={8} />}
        <Ch t={t} t0={259.9} t1={266.9} text="A FEW DAYS LATER" color={C.violeta} x={120} y={150} size={56} />
        <Ch t={t} t0={260.6} t1={266.9} text="ÆTHELWULF · ENGLISH NOBLEMAN" color={C.ambar} tinta={C.noche} x={120} y={260} size={50} />
        <Ch t={t} t0={262.0} t1={266.9} text="VIKING RAIDERS · OPEN FIELDS" color={C.rojo} x={120} y={370} size={48} />
        <Sello t={t} t0={263.4} t1={266.9} text="BEATEN!" x={1500} y={420} size={110} color={C.lima} rot={-8} />
        <G t={t} t0={267.0} text="EVERYONE CELEBRATED" y={300} size={110} color={C.crema} />
      </Escena>
      {/* 7 · el rey de Wessex y su hermano Alfredo marchan con todo el ejército a Reading */}
      <Escena t={t} t0={268.44} t1={275.81} entra="zoom" golpes={[271.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2b07a, #ffe0a8 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 800 Q 960 720 1920 800 L 1920 1080 L 0 1080 Z" fill="#7aa04a" /></svg>
        {/* el ejército: quieto en formación, levanta las lanzas cuando el rey alza la espada y arranca a marchar a la derecha */}
        {Array.from({ length: 22 }, (_, i) => {
          const marcha = Math.max(0, t - 273.4);
          const x = -280 + i * 110 + (i % 3) * 30 + marcha * 130;
          const alza = t > 271.1 + (i % 7) * 0.05;
          return <Persona key={i} x={x} y={860 + (i % 3) * 22} h={170} t={t} seed={360 + i} ropa={SAJON} casco="saxon" camina={marcha > 0 ? 1.8 : 0} sombra="#5a4a3a" opacity={0.8}
            bD={alza ? 160 + Math.sin(t * 6 + i) * 12 : 30} cD={alza ? 0 : 20} manoD={<LanzaMano a={alza ? 0 : 50} inclina={alza ? 0 : -14} largo={320} />} />;
        })}
        {[[700, 0], [1180, 1]].map(([x0, k]) => {
          const marcha = Math.max(0, t - 273.4);
          const x = x0 + marcha * 150; // Alfredo termina en x≈1540, entero
          const alza = !k && t > 270.8 && t < 273.4;
          return (
            <React.Fragment key={k}>
              <Persona x={x} y={980} h={k ? 400 : 440} t={t} seed={370 + k} ropa={k ? { ...SENOR, tunica: "#c8a23a", tunica2: "#8a6a1a" } : { ...SENOR, tunica: "#a8283a", tunica2: "#6a1a2a" }} barba={k ? undefined : "#6b3a1f"} expr={k && t > 271.2 ? "orgullo" : "enojado"} camina={marcha > 0 ? 1.5 : 0}
                habla={!k && t > 271.0 && t < 273.4} mira={k ? -0.6 : 0.3}
                bD={alza ? 170 : !k && marcha > 0 ? 110 : k && t > 271.3 ? 140 : undefined} cD={alza ? 0 : !k && marcha > 0 ? 0 : k && t > 271.3 ? 10 : undefined} manoD={!k ? <g transform={`rotate(${alza ? 180 : marcha > 0 ? 200 : 140})`}><rect x={-6} y={-200} width={12} height={200} fill="#dfe6f2" stroke="#2a1530" strokeWidth={4} /><rect x={-30} y={-6} width={60} height={12} fill="#c9a24a" /></g> : undefined} />
              <Corona x={x} y={980 - (k ? 400 : 440) * 1.02} s={k ? 0.42 : 0.5} t={t} t0={268.6 + k * 0.3} />
            </React.Fragment>
          );
        })}
        <Ch t={t} t0={268.7} t1={273.3} text="THE KING OF WESSEX" color={C.rojo} x={560} y={180} centro size={56} />
        <Ch t={t} t0={269.6} t1={273.3} text="+ HIS BROTHER ALFRED" color={C.ambar} tinta={C.noche} x={1360} y={180} centro size={56} />
        <G t={t} t0={271.0} t1={273.3} text="THE WHOLE ARMY" y={330} size={110} color={C.crema} />
        <Ch t={t} t0={273.4} text="→ READING · FINISH THE JOB" color={C.violeta} x={300} y={200} size={60} />
      </Escena>
      {/* 8 · los vikingos salen por todas las puertas a la vez */}
      <Escena t={t} t0={275.81} t1={281.89} entra="corte" golpes={[275.9, 278.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #5a4a8a, #c87a6a 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#4a6a3a" /><path d="M 0 700 L 1920 700 L 1920 560 L 0 560 Z" fill="#6a5038" /></svg>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Empalizada x={0} y={560} n={42} h={190} /></div>
        {[380, 960, 1540].map((gx) => <div key={gx} style={{ position: "absolute", left: gx - 70, top: 400, width: 140, height: 170, background: "#1a0e14" }} />)}
        {[380, 960, 1540].map((gx, g) => (
          <React.Fragment key={g}>
            {t < 278.3 && Array.from({ length: 4 }, (_, i) => {
              // corren HACIA cámara: salen chicos de la puerta, crecen (0,6→1,2) y se abren a los costados
              const u = Math.max(0, t - 275.85 - i * 0.22);
              const k = Math.min(1, u / 1.9);
              const x = gx + (i % 2 ? 1 : -1) * (40 + k * k * 520 * (1 + i * 0.15));
              const y = 590 + k * 330;
              return u > 0 && <Persona key={i} x={x} y={y} h={170 + k * 230} t={t} seed={380 + g * 4 + i} ropa={VIK(g + i)} casco="vikingo" barba={barbaDe(g + i)} expr="enojado" camina={2.4} flip={i % 2 === 0}
                bD={120 + Math.sin(t * 10 + i) * 30} cD={20} manoD={<LanzaMano a={30} inclina={0} largo={300} />} />;
            })}
          </React.Fragment>
        ))}
        <Flash t={t} t0={275.9} dur={0.2} />
        <G t={t} t0={276.0} t1={278.1} text="EVERY GATE AT ONCE" y={200} size={110} color={C.crema} />
        {t > 278.13 && <AbsoluteFill style={{ background: "rgba(20,10,30,.45)" }} />}
        {/* el choque: dos filas que se encuentran en el medio, golpes y polvo */}
        {t > 278.13 && Array.from({ length: 8 }, (_, i) => {
          const lado = i < 4 ? -1 : 1, j = i % 4;
          const u = prog(t, 278.15, 278.9);
          const x = 960 + lado * (900 - u * 560 + j * 120) ;
          const pega = Math.sin(t * 9 + i * 1.7);
          const cae = t > 279.6 + j * 0.45 + (lado > 0 ? 0.2 : 0) && j % 2 === 1;
          return <Persona key={"c" + i} x={x} y={760 + (j % 2) * 30} h={300} t={t} seed={500 + i} ropa={lado < 0 ? SAJON : VIK(j)} casco={lado < 0 ? "saxon" : "vikingo"} barba={lado < 0 ? undefined : barbaDe(j)} expr={cae ? "sorpresa" : "enojado"} flip={lado > 0}
            camina={u < 1 ? 2.2 : 0} inclina={cae ? -lado * 60 : u >= 1 ? lado * -10 : 0} bD={u >= 1 && !cae ? 110 + pega * 60 : 60} cD={20} manoD={<LanzaMano a={60} inclina={0} largo={280} />} />;
        })}
        {t > 278.9 && <Particulas t={t} tipo="polvo" n={36} seed={21} />}
        {t > 278.9 && [0, 1, 2].map((i) => { const k = ((t - 278.9) * 2.2 + i * 0.33) % 1; return <svg key={"x" + i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><g transform={`translate(${880 + i * 80} ${520 + (i % 2) * 60}) scale(${0.4 + k})`} opacity={1 - k}><path d="M -40 0 L 40 0 M 0 -40 L 0 40 M -28 -28 L 28 28 M 28 -28 L -28 28" stroke="#fff3c4" strokeWidth={10} strokeLinecap="round" /></g></svg>; })}
        {t > 278.13 && <Cita t={t} t0={278.2} texto="There was great slaughter on both sides." autor="ANGLO-SAXON CHRONICLE" x={960} y={915} w={1500} size={44} />}
      </Escena>
      {/* 9 · Æthelwulf, el héroe de cuatro días antes, muerto · los vikingos «dueños del lugar de la matanza» */}
      <Escena t={t} t0={281.89} t1={289.19} entra="iris" ix={960} iy={600} golpes={[282.2, 285.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #3a2a5a, #a85a5a 70%, #d88a5a)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 780 Q 960 730 1920 780 L 1920 1080 L 0 1080 Z" fill="#3a4a2e" />
          {[[200, 820, 30], [1050, 900, -20], [1700, 840, 60], [380, 950, 80]].map(([x, y, r], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><rect x={-4} y={-110} width={8} height={130} fill="#5e3a1e" /><path d="M 0 -150 L 10 -110 L -10 -110 Z" fill="#9aa6b8" /></g>)}
          {[[300, 860], [1500, 900]].map(([x, y], i) => <ellipse key={"e" + i} cx={x} cy={y} rx={50} ry={34} fill={["#2f78a8", "#d6283e"][i]} stroke="#2a1530" strokeWidth={5} />)}</svg>
        <Lapida x={620} y={640} s={1.15} t={t} t0={282.0} lineas={["ÆTHELWULF", "THE HERO", "OF THE WEEK"]} />
        {(() => { const u = prog(t, 283.0, 283.8); const x = 1200 - u * 560, y = 200 + u * 230 - Math.sin(u * Math.PI) * 60; const ala = u < 1 ? Math.sin(t * 24) * 30 : 0;
          return <svg style={{ position: "absolute", left: x - 70, top: y - 50, overflow: "visible" }} width={140} height={100}><path d={`M 70 50 L 20 ${30 - ala} L 50 50 Z M 70 50 L 120 ${30 - ala} L 90 50 Z`} fill="#1a1428" /><ellipse cx={70} cy={56} rx={34} ry={18} fill="#1a1428" /><circle cx={100} cy={44} r={13} fill="#1a1428" /><path d="M 110 42 L 128 46 L 110 50 Z" fill="#3a3448" /><circle cx={103} cy={41} r={3} fill="#ffd36a" /></svg>; })()}
        <Cruz x={620} y={300} s={0.7} t={t} t0={282.4} />
        <Ch t={t} t0={282.2} text="KILLED" color={C.rojo} x={300} y={300} centro size={70} />
        {/* «los vikingos quedaron dueños del lugar»: uno entra caminando y clava su estandarte del cuervo en el campo */}
        {t > 285.4 && (() => {
          const xv = interpolate(t, [285.4, 286.9], [2080, 1480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const clava = t > 286.9;
          const baja = prog(t, 286.9, 287.3);
          return (
            <>
              {clava && (
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
                  <g transform={`translate(1600 ${960 - (1 - baja) * 120})`}>
                    <rect x={-7} y={-380} width={14} height={400} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} />
                    <path d={`M 7 -376 L ${170 + Math.sin(t * 5) * 10} ${-350 + Math.sin(t * 5) * 6} L ${140 + Math.sin(t * 5 + 1) * 12} -300 L ${170 + Math.sin(t * 5 + 2) * 10} -250 L 7 -260 Z`} fill="#f4ead2" stroke="#2a1530" strokeWidth={5} />
                    <path d="M 50 -330 Q 80 -350 110 -320 L 130 -300 L 100 -306 Q 80 -280 60 -296 Z" fill="#1a1428" />
                  </g>
                  {baja >= 1 && t < 287.8 && <circle cx={1600} cy={960} r={20 + (t - 287.3) * 200} fill="none" stroke="#fff3c4" strokeWidth={6} opacity={1 - (t - 287.3) / 0.5} />}
                </svg>
              )}
              <Persona x={xv} y={980} h={330} t={t} seed={520} ropa={VIK(3)} casco="vikingo" barba={barbaDe(3)} expr={clava ? "orgullo" : "enojado"} flip camina={clava ? 0 : 1.4}
                bD={clava ? 120 - baja * 40 : 150} cD={clava ? 20 : 10} bI={clava && baja >= 1 ? 160 : 20} cI={0}
                manoD={clava ? undefined : <g><rect x={-7} y={-20} width={14} height={400} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} transform="rotate(180)" /></g>} />
            </>
          );
        })()}
        <Cita t={t} t0={285.0} texto="…and the Vikings held the place of slaughter." autor="THE CHRONICLE" x={1320} y={200} w={700} size={40} />
      </Escena>
      {/* 10 · la zanja no está para frenarte: está para demorarte justo donde ellos quieren */}
      <Escena t={t} t0={289.19} t1={295.4} zoom={0} entra="barrido" golpes={[291.3, 293.0]}>
        <Mundo t={t} cam={cam}>
          {(() => {
            // el chico corre por el llano, pisa el borde y CAE a la zanja (≈+200 px en 0,4 s); el barro salpica y queda atascado
            const xr = interpolate(t, [289.3, 290.9, 291.3, 291.7], [2850, 3330, 3420, 3470], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const cae = prog(t, 290.9, 291.3);
            const yb = t < 290.9 ? gy(xr) + 10 : interpolate(t, [290.9, 291.3], [gy(3330) + 10, gy(3470) + 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) - Math.sin(cae * Math.PI) * 40;
            const dentro = t > 291.3;
            const forc = dentro ? Math.sin(t * 9) : 0;
            const nivel = gy(3470) + 10 - 80;
            return (
              <>
                <Persona x={xr + forc * 6} y={yb} h={240} t={t} seed={3} ropa={SAJON} expr={dentro ? (t > 293 ? "enojado" : "sorpresa") : cae > 0 ? "sorpresa" : "miedo"} camina={t < 290.9 ? 2.4 : 0} inclina={t < 290.9 ? 18 : cae > 0 && cae < 1 ? -30 : forc * 12}
                  bD={cae > 0 ? 150 + forc * 25 : 60} cD={20} bI={cae > 0 ? 150 - forc * 25 : 30} cI={20} manoD={cae > 0 ? undefined : <LanzaMano a={60} inclina={-20} largo={380} />} />
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                  <path d={barroEn(nivel, t)} fill="#4a3220" opacity={0.97} />
                  {dentro && [0, 1].map((i) => { const k = ((t - 291.3) * 1.5 + i * 0.5) % 1; return <ellipse key={i} cx={3470} cy={nivel} rx={40 + k * 90} ry={8 + k * 14} fill="none" stroke="#7a5a3a" strokeWidth={5} opacity={1 - k} />; })}
                </svg>
                <Salpica t={t} t0={291.3} x={3470} y={nivel} n={11} r={1.2} />
                {t > 293.0 && (
                  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                    <circle cx={3470} cy={nivel - 120} r={170 * ent(t, 293.0)} fill="none" stroke={C.rojo} strokeWidth={10} opacity={0.85} />
                  </svg>
                )}
              </>
            );
          })()}
        </Mundo>
        <Ch t={t} t0={289.4} text="NOT THERE TO STOP YOU" color={C.violeta} x={120} y={130} size={56} />
        <G t={t} t0={291.3} text="TO SLOW YOU DOWN" x={560} y={250} size={100} color={C.crema} />
        <Sello t={t} t0={293.0} text="RIGHT HERE" x={1350} y={560} size={80} rot={-8} />
      </Escena>
    </AbsoluteFill>
  );
};

void PastoAlto; void Iglesia; void Sello;
