import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { Persona, Ropa } from "./persona";
import { Arbol } from "./kit2";
import { V, Drakkar, Tienda, Fogata, Perro, Iglesia, Empalizada, Caballo, Antorcha, EscudoR, Durmiente } from "./vik";

// El MUNDO único de soot12: la noche del Trent en Repton, de izquierda a derecha — la loma donde estás tirado,
// el llano, la zanja en D, el terraplén con empalizada, la iglesia-portón, el campamento (tiendas, fogatas, perros,
// caballos, durmientes, guardia) y la orilla con los drakkars varados sobre el río. La cámara VIAJA por este mundo
// (paneo, dolly, zoom a un detalle); nunca se cambia de fondo. Coordenadas de mundo en px a zoom 1.
export type Cam = { x: number; y: number; z: number };
export type Key = [number, number, number, number]; // [t, x, y, zoom]
// cámara por cuadros clave: entre dos claves interpola con aceleración suave (una clave repetida = quieta)
export const camEn = (t: number, keys: Key[]): Cam => {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], z: keys[0][3] };
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1, z1] = keys[i];
    if (t <= t1) {
      const [t0, x0, y0, z0] = keys[i - 1];
      const u = interpolate(t, [t0, t1], [0, 1], { easing: Easing.inOut(Easing.cubic) });
      // el zoom interpola en escala logarítmica (dolly parejo) y la posición sigue al zoom
      const z = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * u);
      return { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u, z };
    }
  }
  const k = keys[keys.length - 1];
  return { x: k[1], y: k[2], z: k[3] };
};

// perfil del suelo
export const gy = (x: number) => {
  if (x < 1700) return 640 + Math.sin(x * 0.004) * 18;
  if (x < 2700) return interpolate(x, [1700, 2700], [640 + Math.sin(1700 * 0.004) * 18, 860], { easing: Easing.inOut(Easing.sin) });
  if (x < 3350) return 860;
  if (x < 3650) { const u = (x - 3350) / 300; return 860 + Math.sin(u * Math.PI) ** 0.6 * 170; }
  if (x < 3720) return interpolate(x, [3650, 3720], [860, 770]);
  if (x < 3840) return 770;
  if (x < 3920) return interpolate(x, [3840, 3920], [770, 860]);
  if (x < 7250) return 860;
  if (x < 7550) return interpolate(x, [7250, 7550], [860, 930], { easing: Easing.inOut(Easing.sin) });
  if (x < 8300) return interpolate(x, [7550, 8300], [930, 1500], { easing: Easing.in(Easing.sin) });
  if (x < 10300) return 1500;
  if (x < 10900) return interpolate(x, [10300, 10900], [1500, 880], { easing: Easing.out(Easing.sin) });
  return 880;
};
export const RIO = 7480; // donde empieza el agua
export const AGUA_Y = 905;
export const ANCHO = 11000;
// pasto alto en primer plano (coordenadas de mundo): tapa el cuerpo de quien está tirado
export const PastoAlto: React.FC<{ x0: number; x1: number; t: number; dy?: number; alto?: number; color?: string; seed?: number }> = ({ x0, x1, t, dy = 0, alto = 150, color = "#183544", seed = 4 }) => {
  const r = rnd(seed);
  const n = Math.round((x1 - x0) / 11);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 11 + r() * 8, y = gy(x) + dy + 30, h = alto * (0.6 + r() * 0.6), sw = Math.sin(t * 1.4 + x * 0.02) * 12;
        return <path key={i} d={`M ${x - 7} ${y} Q ${x + sw * 0.4} ${y - h * 0.55} ${x + sw} ${y - h} Q ${x + 4} ${y - h * 0.5} ${x + 7} ${y} Z`} fill={i % 3 ? color : "#21465a"} />;
      })}
    </svg>
  );
};

// puntos del recorrido (las 7 trampas sobre el mundo)
export const PARADAS: { n: number; x: number; y: number; txt: string }[] = [
  { n: 1, x: 1250, y: 520, txt: "THE PLACE" }, { n: 2, x: 3500, y: 860, txt: "THE DITCH" }, { n: 3, x: 4700, y: 760, txt: "THE DOGS" },
  { n: 4, x: 5500, y: 740, txt: "THE SLEEPERS" }, { n: 5, x: 7700, y: 760, txt: "THE SHIPS" }, { n: 6, x: 8800, y: 760, txt: "THE EXPERTS" },
  { n: 7, x: 9900, y: 760, txt: "THE MORNING AFTER" },
];

export const VIK = (i: number): Ropa => {
  const t = [["#3f6a9a", "#26446a"], ["#8a3a2a", "#5e2418"], ["#5a7a3a", "#3a5224"], ["#6a4a8a", "#44306a"], ["#9a7a3a", "#6a5224"]][i % 5];
  const p = [["#f2c4a0", "#d99a7a"], ["#eab58e", "#c98c66"], ["#f5d0b0", "#dca888"]][i % 3];
  const pe = ["#d9a441", "#a8552a", "#e8c97a", "#6b3a1f", "#c9773a"][(i * 2) % 5];
  return { tunica: t[0], tunica2: t[1], cinto: "#3b230f", piel: p[0], piel2: p[1], pelo: pe };
};
export const barbaDe = (i: number) => ["#d9a441", "#a8552a", "#e8c97a", "#6b3a1f", "#c9773a"][(i * 2) % 5];
export const SAJON: Ropa = { tunica: "#4f8a5a", tunica2: "#2f5e3a", cinto: "#5a3418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#6b3a1f" };
export const SENOR: Ropa = { tunica: "#3a5aa8", tunica2: "#22386e", cinto: "#3b230f", piel: "#e8a880", piel2: "#c98864", pelo: "#3a2418" };

// estado del campamento en el segundo t (lo arma cada parte del video)
export type Estado = {
  despierta?: number; // t en que el campamento se despierta (antorchas, gente de pie)
  perros?: "duerme" | "alerta" | "ladra";
  cuerno?: number; // t en que suena el cuerno del guardia
  barcosAlAgua?: number; // t en que los barcos empiezan a irse
  amanece?: number; // 0 noche → 1 alba
  flota?: number; // t en que llega una flota por el río
  ocultaYo?: boolean;
};

const Pasto: React.FC<{ x0: number; x1: number; t: number; seed?: number; alto?: number; color?: string }> = ({ x0, x1, t, seed = 1, alto = 60, color = "#2c5a5a" }) => {
  const r = rnd(seed);
  const n = Math.round((x1 - x0) / 14);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 14 + r() * 10, y = gy(x) + 4, h = alto * (0.5 + r() * 0.8), sw = Math.sin(t * 1.6 + x * 0.01) * 8;
        return <path key={i} d={`M ${x - 5} ${y} Q ${x + sw * 0.5} ${y - h * 0.5} ${x + sw} ${y - h} Q ${x + 3} ${y - h * 0.5} ${x + 5} ${y} Z`} fill={color} />;
      })}
    </svg>
  );
};

// capa con paralaje: f = 1 mundo, f < 1 fondo, f > 1 primer plano
const Capa: React.FC<{ cam: Cam; f: number; children: React.ReactNode }> = ({ cam, f, children }) => {
  const z = 1 + (cam.z - 1) * Math.min(1, f);
  const zz = f > 1 ? cam.z * f : z;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: ANCHO, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cam.x * f * zz}px, ${540 - (540 + (cam.y - 540) * Math.min(1, f)) * zz}px) scale(${zz})` }}>
      {children}
    </div>
  );
};

export const Mundo: React.FC<{ t: number; cam: Cam; e?: Estado; children?: React.ReactNode; frente?: React.ReactNode; yo?: React.ReactNode; luna?: [number, number, number] }> = ({ t, cam, e = {}, children, frente, yo, luna }) => {
  const am = e.amanece ?? 0;
  const desp = e.despierta !== undefined && t >= e.despierta;
  const ud = e.despierta !== undefined ? Math.max(0, Math.min(1, (t - e.despierta) / 1.2)) : 0;
  const cielo = [
    ["#0a0826", "#17124a", "#33227a", "#5a3a9a"],
    ["#1a1a4a", "#4a3a8a", "#d97a8a", "#ffc28a"],
  ];
  const mix = (a: string, b: string, k: number) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k));
    return `rgb(${c.join(",")})`;
  };
  const sky = cielo[0].map((c, i) => mix(c, cielo[1][i], am));
  const r = rnd(5);
  const estrellas = Array.from({ length: 140 }, () => [r() * 2600 - 800, r() * 1100 - 500, 1 + r() * 2.4, r() * 6]);
  const s = { t };
  // durmientes alrededor de las fogatas: [x, semilla, perfil]
  const DUERMEN: [number, number][] = [[4560, 1], [4840, 2], [5380, 3], [5480, 4], [5720, 5], [6140, 6], [6260, 7], [6800, 8]];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} 40%, ${sky[2]} 75%, ${sky[3]} 100%)`, overflow: "hidden" }}>
      {luna && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><circle cx={luna[0]} cy={luna[1]} r={luna[2] * 1.6} fill="#fff4d6" opacity={0.1} /><circle cx={luna[0]} cy={luna[1]} r={luna[2] * 1.25} fill="#fff4d6" opacity={0.15} /><circle cx={luna[0]} cy={luna[1]} r={luna[2]} fill="#fff4d6" /><circle cx={luna[0] - luna[2] * 0.3} cy={luna[1] - luna[2] * 0.2} r={luna[2] * 0.16} fill="#ece0bc" /><circle cx={luna[0] + luna[2] * 0.35} cy={luna[1] + luna[2] * 0.3} r={luna[2] * 0.11} fill="#ece0bc" /><circle cx={luna[0] + luna[2] * 0.1} cy={luna[1] + luna[2] * 0.55} r={luna[2] * 0.08} fill="#ece0bc" /></svg>}
      {/* estrellas y luna (casi fijas) */}
      <Capa cam={cam} f={0.08}>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {estrellas.map(([x, y, rr, f], i) => <circle key={i} cx={x} cy={y} r={rr} fill="#fff" opacity={(0.4 + 0.5 * Math.sin(t * 2 + f)) * (1 - am * 0.8)} />)}
          {!luna && <g><circle cx={600} cy={150} r={190} fill="#fff4d6" opacity={0.12 * (1 - am)} />
          <circle cx={600} cy={150} r={110} fill="#fff4d6" opacity={1 - am * 0.6} />
          <circle cx={570} cy={130} r={20} fill="#e8dcb4" opacity={1 - am * 0.6} /><circle cx={640} cy={180} r={13} fill="#e8dcb4" opacity={1 - am * 0.6} /></g>}
          {am > 0 && <circle cx={2600} cy={700 - am * 260} r={140} fill="#ffd27a" opacity={am} />}
        </svg>
      </Capa>
      {/* colinas lejanas */}
      <Capa cam={cam} f={0.35}>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <path d={`M -2000 2000 L -2000 700 ${Array.from({ length: 50 }, (_, i) => `L ${-2000 + i * 200} ${700 - (Math.sin(i * 0.9) * 0.5 + 0.5) * 120 - (i % 3) * 20}`).join(" ")} L 8000 700 L 8000 2000 Z`} fill={mix("#1c1848", "#5a4a8a", am)} />
          <path d={`M -2000 2000 L -2000 760 ${Array.from({ length: 50 }, (_, i) => `L ${-2000 + i * 200} ${770 - (Math.sin(i * 1.7 + 2) * 0.5 + 0.5) * 80}`).join(" ")} L 8000 760 L 8000 2000 Z`} fill={mix("#15123a", "#463a72", am)} />
        </svg>
      </Capa>
      {/* el mundo */}
      <Capa cam={cam} f={1}>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <defs>
            <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix("#2a6a6a", "#4a8a5a", am)} /><stop offset="0.05" stopColor={mix("#1f4f5a", "#36704a", am)} /><stop offset="0.4" stopColor="#163a48" /><stop offset="1" stopColor="#0e2432" /></linearGradient>
            <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix(V.rio2, "#e89a7a", am * 0.7)} /><stop offset="0.2" stopColor={V.rio} /><stop offset="1" stopColor="#0c2240" /></linearGradient>
          </defs>
          {/* río (detrás de la orilla) */}

          {Array.from({ length: 40 }, (_, i) => {
            const x = RIO + ((i * 260 + t * 40) % 3600), y = AGUA_Y + 30 + (i % 6) * 40;
            return <rect key={i} x={x} y={y} width={90 + (i % 3) * 40} height={6} rx={3} fill="#bfe3ff" opacity={0.25} />;
          })}
          {/* reflejo de la luna */}
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x={8600 - 60 + Math.sin(t * 2 + i) * 30} y={AGUA_Y + 20 + i * 30} width={120 - i * 8} height={8} rx={4} fill="#fff4d6" opacity={0.35} />)}
          {/* suelo (sigue bajo el agua y sube en la otra orilla) */}
          <path d={`M -3000 4000 L -3000 ${gy(0)} ${Array.from({ length: Math.ceil(12000 / 20) }, (_, i) => `L ${i * 20} ${gy(i * 20)}`).join(" ")} L 13000 880 L 13000 4000 Z`} fill="url(#suelo)" />
          <rect x={RIO - 100} y={AGUA_Y} width={10900 - RIO + 100} height={3200} fill="url(#agua)" opacity={0.92} />
          <rect x={RIO - 100} y={AGUA_Y - 4} width={10900 - RIO + 100} height={10} fill="#bfe3ff" opacity={0.5} />
          {/* zanja: barro al fondo */}
          <path d={`M 3360 ${gy(3360)} ${Array.from({ length: 15 }, (_, i) => `L ${3360 + i * 20} ${gy(3360 + i * 20)}`).join(" ")} Z`} fill={V.barro} opacity={0.9} />
          <ellipse cx={3500} cy={1012} rx={110} ry={14} fill="#2a1d18" />
          {/* terraplén con borde */}
          <path d={`M 3650 ${gy(3650)} L 3720 770 L 3840 770 L 3920 860`} stroke="#3a6a5a" strokeWidth={8} fill="none" />
        </svg>
        {[[180, 0.9], [620, 1.1], [2150, 0.8], [2480, 1.0], [2900, 0.7]].map(([ax, as], i) => <Arbol key={i} x={ax} y={gy(ax) - 330 * as} s={as} color={i % 2 ? "#13263a" : "#0f1f30"} />)}
        <Pasto x0={-400} x1={3340} t={t} seed={1} />
        <Pasto x0={3660} x1={7300} t={t} seed={2} alto={36} color="#2a4f52" />
        {/* empalizada sobre el terraplén y portón = iglesia */}
        <Empalizada x={3700} y={772} n={4} h={170} />
        <Iglesia x={4080} y={575} s={0.82} t={t} />
        {/* campamento */}
        <Tienda x={4520} y={740} s={0.75} k={0} t={t} luz={desp} />
        <Tienda x={5000} y={740} s={0.8} k={1} t={t} luz={desp} />
        <Tienda x={5900} y={735} s={0.85} k={2} t={t} luz={desp} />
        <Tienda x={6550} y={700} s={1.15} k={0} t={t} luz />
        <Tienda x={7050} y={742} s={0.72} k={1} t={t} luz={desp} />
        <Caballo x={5240} y={790} s={0.55} t={t} come />
        <Caballo x={5400} y={792} s={0.5} t={t} color="#5a4a42" />
        {[4700, 5560, 6300].map((fx, i) => <Fogata key={fx} x={fx} y={790} s={0.62 + (desp ? 0.12 * ud : 0)} t={t} brasa={!desp && i === 1} />)}
        {/* durmientes (o despiertos con el hacha) */}
        {DUERMEN.map(([x, sd], i) => desp ? (
          <Persona key={i} x={x} y={862} h={260} t={t} seed={200 + sd} ropa={VIK(sd)} casco="vikingo" barba={barbaDe(sd)} expr="enojado" aparece={e.despierta! + i * 0.08} bD={120} cD={40} flip={i % 2 === 1} pelera={i % 3 === 0} />
        ) : (
          <Durmiente key={i} x={x} y={826} s={0.62} t={t} manta={VIK(sd).tunica} barba={barbaDe(sd)} pelo={VIK(sd).pelo} piel={VIK(sd).piel} flip={i % 2 === 1} />
        ))}
        {/* escudos apoyados y hachas al lado de cada durmiente */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          {!desp && DUERMEN.map(([x], i) => <EscudoR key={i} cx={x + (i % 2 ? 170 : -170)} cy={820} r={30} k={i} />)}
        </svg>
        <Perro x={4420} y={826} s={0.42} t={t} modo={e.perros ?? "duerme"} />
        <Perro x={5120} y={826} s={0.4} t={t} modo={e.perros ?? "duerme"} flip color="#5a4a42" />
        <Perro x={6020} y={826} s={0.4} t={t} modo={e.perros ?? "duerme"} color="#8a7a6a" />
        {/* guardia en la orilla con el cuerno */}
        <Persona x={7230} y={866} h={300} t={t} seed={77} ropa={VIK(3)} casco="vikingo" barba={barbaDe(3)} expr={e.cuerno !== undefined && t > e.cuerno ? "enojado" : "dormido"} bD={e.cuerno !== undefined && t > e.cuerno ? 150 : 20} cD={e.cuerno !== undefined && t > e.cuerno ? 70 : 10} pelera flip
          manoD={e.cuerno !== undefined && t > e.cuerno ? <path d="M 0 0 Q 60 -20 120 -90 L 140 -70 Q 80 10 0 20 Z" fill="#e8d7a8" stroke="#2a1530" strokeWidth={6} /> : undefined} />
        {e.cuerno !== undefined && t > e.cuerno && t < e.cuerno + 2.4 && [0, 1, 2].map((i) => {
          const k = ((t - e.cuerno! - i * 0.25) % 0.9) / 0.9;
          return <div key={i} style={{ position: "absolute", left: 7040 - k * 160, top: 560 - k * 80, width: 60 + k * 240, height: 60 + k * 240, borderRadius: "50%", border: "8px solid #ffe28a", opacity: 1 - k, transform: "translate(-50%,-50%)" }} />;
        })}
        {/* antorchas que se encienden */}
        {desp && [4300, 4950, 5650, 6450, 7150].map((ax, i) => <Antorcha key={ax} x={ax} y={760} s={0.5} t={t} t0={e.despierta! + 0.2 + i * 0.12} />)}
        {/* barcos varados en la orilla y en el agua */}
        {[[7600, 868, 0.62, 0], [8250, 900, 0.66, 1], [8950, 912, 0.6, 2]].map(([bx, by, bs, i]) => {
          const va = e.barcosAlAgua !== undefined && t > e.barcosAlAgua ? Math.min(1, (t - e.barcosAlAgua) / 3) : 0;
          return <Drakkar key={i} x={bx + va * 900 * (i + 1) * 0.6} y={by + (i === 0 ? va * 30 : 0)} s={bs} t={t} varado={i === 0 && va < 0.3} remos={va > 0 ? 1.4 : 0} />;
        })}
        {e.flota !== undefined && t > e.flota && [0, 1, 2, 3, 4].map((i) => (
          <Drakkar key={"f" + i} x={10600 - (t - e.flota!) * 220 - i * 520} y={890 + (i % 2) * 40} s={0.5 - i * 0.03} t={t} vela={1} remos={1.2} />
        ))}
        {children}
        {yo}
      </Capa>
      {/* primer plano: pasto alto que tapa (estás tirado entre el pasto) */}
      <Capa cam={cam} f={1.0}>
        {frente}
      </Capa>
      {/* tinte de noche que se va al amanecer */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(5,4,20,.45) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
