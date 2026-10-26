import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL } from "./persona";
import { C, ent, prog, Escena, Rayos, Particulas, Emote, cabeza, Zzz } from "./kit";
import { Lapida, Ciudad } from "./kit2";
import { Mundo, camEn, Key, PastoAlto, SAJON, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Globo, Cuenta, Sello, Flash, LanzaMano, MapaN, Nieve, lugarN, Tendido } from "./comun";
import { Isla, PlanoRepton, Reloj24, CrecePueblo } from "./escenas";
import { Corona, Drakkar, Tienda, Fogata, Plata, Ficha, Hacha, Iglesia } from "./vik";

// 51,6-186,8 s · TRAMPA 1: EL LUGAR. Del mundo al mapa (las estrellas se vuelven puntos), Thanet, Sheppey, Torksey
// (los hallazgos saltan del suelo), el plano en D de Repton, el reloj de 16 h de noche, el rey Burgred que se va a Roma,
// Dublín que crece desde el longphort, y vuelta al mundo: «ya eligieron el campo de batalla».
export const CAM1: Key[] = [
  [51.56, 1300, 450, 0.9], [53.76, 1330, 430, 1.15],
  [53.77, 2900, 380, 0.55], [56.24, 3700, 360, 0.62],
  [72.62, 1580, 470, 1.6], [74.5, 1900, 520, 1.0], [77.38, 3400, 560, 0.8],
  [127.16, 7300, 640, 0.75], [130.32, 7420, 700, 1.45],
  [130.33, 4200, 600, 0.55], [135.2, 2500, 560, 0.95],
  [147.16, 1420, 420, 1.45], [150.3, 1380, 420, 1.5], [154.5, 1250, 440, 1.35],
  [161.14, 1480, 424, 2.6], [162.96, 1480, 424, 2.8],
  [179.46, 1480, 480, 2.2], [182.0, 1700, 500, 1.2], [185.6, 3600, 520, 0.6], [186.78, 3600, 520, 0.6],
];
// luna fija en pantalla, arriba a la derecha (lejos de los títulos)
const LUNA: [number, number, number] = [1660, 170, 80];
const ROPA_REY = { tunica: "#7a2a8a", tunica2: "#4a1a5a", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#6b3a1f" };
const ROPA_MONJE = { tunica: "#7a5a3a", tunica2: "#4e3620", cinto: "#d8c49a", piel: "#e8b08a", piel2: "#c98d66", pelo: "#3a2418" };

const Yo: React.FC<{ t: number; expr?: "miedo" | "feliz" | "sorpresa" | "enojado" | "neutro" | "triste"; senala?: boolean; tendido?: boolean; asiente?: number; dx?: number; camina?: number; lanzaA?: number }> = ({ t, expr = "miedo", senala, tendido, asiente, dx = 0, camina = 0, lanzaA = 50 }) => (
  <>
    {tendido
      ? <Tendido x={1500} y={gy(1500) + 18} h={330} t={t} seed={3} ropa={SAJON} expr={expr} mira={0.5} lanza={1} resp={2.8} />
      : <Persona x={1480 + dx} y={gy(1480 + dx) + 40} h={330} t={t} seed={3} ropa={SAJON} expr={expr} camina={camina} bD={senala ? 100 : 30} cD={senala ? 0 : 20} bI={senala ? 20 : undefined} mira={senala ? 0.9 : -0.3} ladea={asiente !== undefined && t > asiente && t < asiente + 0.9 ? 0 : undefined} miraY={asiente !== undefined && t > asiente && t < asiente + 0.9 ? Math.max(0, Math.sin((t - asiente) * 14)) * 0.8 : 0}
          manoD={senala ? undefined : <LanzaMano a={lanzaA} inclina={-14} />} manoI={senala ? <LanzaMano a={-20} /> : undefined} />}
    <PastoAlto x0={600} x1={2000} t={t} dy={14} alto={170} />
  </>
);

// pasto de primer plano en pantalla (para que el chico asome)
const PastoFrente: React.FC<{ t: number; y?: number }> = ({ t, y = 800 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    <path d={`M 0 ${y + 20} Q 480 ${y - 30} 960 ${y + 10} Q 1440 ${y + 40} 1920 ${y} L 1920 1080 L 0 1080 Z`} fill="#173040" />
    {Array.from({ length: 150 }, (_, i) => {
      const x = i * 13 + ((i * 37) % 9), h = 90 + ((i * 53) % 70), sw = Math.sin(t * 1.4 + x * 0.02) * 10, b = y + 40 + ((i * 17) % 30);
      return <path key={i} d={`M ${x - 8} ${b} Q ${x + sw * 0.4} ${b - h * 0.55} ${x + sw} ${b - h} Q ${x + 4} ${b - h * 0.5} ${x + 8} ${b} Z`} fill={i % 3 ? "#183544" : "#21465a"} />;
    })}
  </svg>
);

// aliento: nubecitas que salen de la boca cada ~0,9 s
const Aliento: React.FC<{ t: number; x: number; y: number; s?: number; dir?: number }> = ({ t, x, y, s = 1, dir = 1 }) => {
  const q = (t % 0.9) / 0.9;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {[0, 1, 2].map((k) => <circle key={k} cx={x + dir * (q * 110 + k * 22) * s} cy={y - q * 30 * s - k * 6} r={(14 + q * 34 + k * 6) * s} fill="#eef4ff" opacity={(1 - q) * 0.55} />)}
    </svg>
  );
};

// punto de una curva cuadrática A→B con control desplazado «curva» hacia arriba
const bez = (A: { x: number; y: number }, B: { x: number; y: number }, curva: number, u: number) => {
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - curva;
  return { x: (1 - u) * (1 - u) * A.x + 2 * (1 - u) * u * mx + u * u * B.x, y: (1 - u) * (1 - u) * A.y + 2 * (1 - u) * u * my + u * u * B.y };
};
// punto sobre una polilínea (u 0→1 por largo)
const sobre = (pts: [number, number][], u: number) => {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = Math.max(0, Math.min(1, u)) * L.reduce((a, b) => a + b, 0);
  for (let i = 0; i < L.length; i++) {
    if (d <= L[i] || i === L.length - 1) { const k = L[i] ? Math.min(1, d / L[i]) : 0; return { x: pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, y: pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k, ang: Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) }; }
    d -= L[i];
  }
  return { x: pts[0][0], y: pts[0][1], ang: 0 };
};

// arado tirado a mano
const Arado: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <svg style={{ position: "absolute", left: x - 200, top: y - 260, overflow: "visible" }} width={400} height={300} viewBox="-200 -260 400 300">
    <path d="M -150 -170 L 40 -10" stroke="#8a5a32" strokeWidth={16} strokeLinecap="round" />
    <path d="M -150 -150 L 30 0" stroke="#5e3a1e" strokeWidth={8} strokeLinecap="round" />
    <path d="M 20 -20 L 110 10 L 30 30 Z" fill="#9aa6b8" stroke="#2a1530" strokeWidth={6} strokeLinejoin="round" />
    {[0, 1, 2].map((k) => { const q = ((t * 2 + k / 3) % 1); return <circle key={k} cx={110 - q * 160} cy={20 - Math.sin(q * Math.PI) * 50} r={9 - q * 5} fill="#5e4428" />; })}
  </svg>
);

// vitrina de museo con estantes
const Vitrina: React.FC<{ x: number; y: number; t: number; t0: number }> = ({ x, y, t, t0 }) => {
  const e = ent(t, t0);
  return (
    <svg style={{ position: "absolute", left: x - 260, top: y - 160, transform: `scale(${e})`, transformOrigin: "50% 100%", overflow: "visible" }} width={520} height={320} viewBox="-260 -160 520 320">
      <rect x={-250} y={-150} width={500} height={300} rx={18} fill="#4a3326" stroke="#2a1530" strokeWidth={10} />
      <rect x={-226} y={-128} width={452} height={256} rx={8} fill="#cfe8f2" opacity={0.55} />
      <line x1={-226} y1={0} x2={226} y2={0} stroke="#8a5a32" strokeWidth={10} />
      <path d="M -200 -110 L -120 -110 L -210 0 Z" fill="#fff" opacity={0.35} />
      <rect x={-120} y={-196} width={240} height={50} rx={12} fill={C.ambar} stroke="#2a1530" strokeWidth={6} />
      <text x={0} y={-160} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={32} fill={C.noche}>TORKSEY</text>
    </svg>
  );
};

// iglesita para el mapa
const IglesiaMini: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg style={{ position: "absolute", left: -40 * s, top: -60 * s, overflow: "visible" }} width={80 * s} height={80 * s} viewBox="-40 -60 80 80">
    <rect x={-26} y={-20} width={40} height={36} fill="#d8d0e8" stroke="#2a1530" strokeWidth={4} />
    <path d="M -30 -20 L -6 -40 L 18 -20 Z" fill="#7a5a8a" stroke="#2a1530" strokeWidth={4} />
    <rect x={14} y={-46} width={16} height={62} fill="#d8d0e8" stroke="#2a1530" strokeWidth={4} />
    <path d="M 22 -60 V -48 M 17 -55 H 27" stroke="#2a1530" strokeWidth={4} />
  </svg>
);

export const P1: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM1);
  void cabeza;
  // ── E015 · cámara del mapa del Gran Ejército
  const mapa15: Key[] = [[62.6, 900, 560, 1.25], [68.3, 930, 540, 1.35], [70.0, 740, 620, 2.6], [72.62, 715, 625, 2.9]];
  const c15 = camEn(t, mapa15);
  const RUTA15: [number, number][] = [[1193, 406], [1060, 440], [900, 540], [770, 600], [711, 617], [690, 640], [673, 654]];
  // ── E019 · cámara y tramos del barco
  const cam19: Key[] = [[85.72, 980, 430, 1.0], [89.0, 805, 740, 3.4], [92.3, 800, 745, 3.6], [94.4, 780, 730, 2.8], [96.2, 750, 640, 2.6], [100.46, 748, 636, 2.75]];
  const N19 = lugarN("NORWAY"), T19 = lugarN("THANET"), S19 = lugarN("SHEPPEY"), K19 = lugarN("TORKSEY");
  const tramos19: { A: { x: number; y: number }; B: { x: number; y: number }; t0: number; dur: number; curva: number; color: string; fuera?: [number, number] }[] = [
    { A: { x: 1130, y: 200 }, B: T19, t0: 86.4, dur: 2.6, curva: 60, color: C.ambar, fuera: [89.2, 90.0] },
    { A: T19, B: S19, t0: 92.4, dur: 0.8, curva: 12, color: C.teal },
    { A: S19, B: K19, t0: 94.4, dur: 1.8, curva: -40, color: C.rojo },
  ];
  let b19 = { x: 1130, y: 200 }, dir19 = -1;
  for (const r of tramos19) if (t >= r.t0) { b19 = bez(r.A, r.B, r.curva, prog(t, r.t0, r.t0 + r.dur)); dir19 = r.B.x < r.A.x ? -1 : 1; }
  // al principio la cámara sigue al barco desde Noruega y se acerca
  const sigue = prog(t, 85.9, 88.4);
  const cam19v: Key[] = t < 89.0 ? [[0, 980 + (b19.x - 5 - 980) * sigue, 330 + (b19.y - 35 - 330) * sigue, interpolate(t, [85.72, 86.6, 89.0], [1.0, 1.15, 3.4], { extrapolateRight: "clamp" })]] : cam19;
  const c19 = camEn(t, cam19v);
  // ── E021 · el detectorista y lo que salta a la vitrina
  const detX = (tt: number) => interpolate(tt, [107, 117.8], [300, 1240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hallazgos21: { t0: number; slot: [number, number]; dib: React.ReactNode }[] = [
    { t0: 113.5, slot: [285, 375], dib: <svg width={110} height={110} viewBox="-90 -90 180 180"><circle r={70} fill="#dfe6f2" stroke="#5e6a80" strokeWidth={10} /><circle r={40} fill="none" stroke="#5e6a80" strokeWidth={6} /></svg> },
    { t0: 114.6, slot: [510, 375], dib: <svg width={150} height={100} viewBox="-90 -60 180 120">{[[-50, -10, 20], [0, 10, -30], [50, -6, 50], [-20, 30, 70]].map(([x, y, r], i) => <rect key={i} x={x - 26} y={y - 12} width={52} height={24} rx={6} fill="#dfe6f2" stroke="#5e6a80" strokeWidth={6} transform={`rotate(${r} ${x} ${y})`} />)}</svg> },
    { t0: 115.8, slot: [285, 495], dib: <svg width={100} height={100} viewBox="-80 -80 160 160"><path d="M -50 40 L -40 -30 L 40 -30 L 50 40 Z" fill="#8a8aa0" stroke="#2a1530" strokeWidth={8} /><circle cx={0} cy={-44} r={16} fill="none" stroke="#8a8aa0" strokeWidth={8} /></svg> },
    { t0: 116.9, slot: [510, 495], dib: <svg width={90} height={100} viewBox="-60 -70 120 140"><path d="M -36 60 Q -40 10 -14 -6 Q -30 -30 0 -50 Q 30 -30 14 -6 Q 40 10 36 60 Z" fill="#f4ead2" stroke="#2a1530" strokeWidth={7} /></svg> },
  ];
  // ── E031 · Dublín
  const D31 = lugarN("DUBLIN");

  return (
    <AbsoluteFill>
      {/* E013 · TRAMPA 1: EL LUGAR — el chico asoma del pasto */}
      <Escena t={t} t0={51.56} t1={53.77} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} luna={LUNA} />
        {(() => {
          const y = 1720 - ent(t, 51.85, 0, { damping: 13, stiffness: 120 }) * 450;
          const asusta = t > 52.95;
          return (
            <>
              <Persona x={1100 + (asusta ? Math.sin(t * 40) * 3 : 0)} y={y} h={760} t={t} seed={3} ropa={SAJON} expr={asusta ? "miedo" : "sorpresa"} mira={t < 52.5 ? -0.8 : t < 52.95 ? 0.8 : 0} miraY={-0.1} bD={30} cD={20} manoD={<LanzaMano a={40} />} />
              <PastoFrente t={t} y={790} />
              {asusta && <Emote t={t} t0={52.95} tipo="susto" x={1100} y={y - 600} s={1.2} />}
            </>
          );
        })()}
        <Cartel t={t} t0={51.6} t1={53.77} n={1} nombre="THE PLACE" />
      </Escena>
      {/* E014 · invierno del 873: el chico mira el campamento y se agacha */}
      <Escena t={t} t0={53.77} t1={56.24} zoom={0} entra="barrido" banda={C.teal}>
        <Mundo t={t} cam={cam} luna={LUNA} />
        <Nieve t={t} n={110} />
        {(() => {
          // chico ENTERO (pies en 1020): mira el campamento; con WINTER se abraza y tirita (±4 px a 12 Hz)
          const fr = t > 55.0;
          const ag = prog(t, 55.0, 55.35) * 18;
          const tirita = fr ? Math.sin(t * Math.PI * 2 * 12) * 4 : 0;
          return (
            <>
              <Persona x={380 + tirita} y={1020} h={560 - ag} t={t} seed={3} ropa={SAJON} expr={fr ? "miedo" : "neutro"} mira={fr ? 0.3 : 0.9} miraY={fr ? 0 : -0.3}
                bD={fr ? -30 : 20} cD={fr ? -120 : 20} bI={fr ? -30 : undefined} cI={fr ? -120 : undefined} inclina={fr ? 5 : 0} manoD={fr ? undefined : <LanzaMano a={40} />} />
              {fr && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><g transform={`translate(${470 + tirita} 1020) rotate(14)`}><rect x={-7} y={-470} width={14} height={500} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} /><path d="M 0 -540 L 20 -466 L 0 -440 L -20 -466 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} /></g></svg>}
              <Aliento t={t} x={432 + tirita} y={628 + ag} s={0.9} />
            </>
          );
        })()}
        <G t={t} t0={54.4} text="873 AD" x={960} y={250} size={170} color={C.crema} />
        <Ch t={t} t0={55.0} text="WINTER" color={C.teal} tinta={C.noche} x={960} y={410} centro size={66} />
      </Escena>
      {/* E015 · (a) el granjero ara en el medio de Inglaterra · (b) el Gran Ejército sube por el Trent hasta Repton */}
      <Escena t={t} t0={56.24} t1={72.62} zoom={0} entra="zoom">
        <MapaN t={t} cam={mapa15} desde="NORWAY" pulsa={[{ n: "REPTON", t0: 70.2, color: C.rojo, label: "REPTON", lado: "izq" }]}>
          {(() => {
            const z = c15.z;
            const marV = prog(t, 63.3, 65.6), rioV = prog(t, 66.2, 68.6);
            const fueraMar = 1 - prog(t, 68.4, 69.2);
            const mar = RUTA15.slice(0, 4).map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
            const rio = RUTA15.slice(3).map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
            return (
              <>
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                  {t > 63.3 && <path d={mar} stroke={C.rojo} strokeWidth={12 / z} fill="none" pathLength={1000} strokeDasharray={`${marV * 1000} 1000`} strokeLinecap="round" strokeLinejoin="round" opacity={fueraMar} />}
                  {t > 66.2 && <path d={rio} stroke={C.rojo} strokeWidth={14 / z} fill="none" pathLength={1000} strokeDasharray={`${rioV * 1000} 1000`} strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
                {/* diez barquitos que cruzan y suben por el río */}
                {Array.from({ length: 10 }, (_, i) => {
                  const u = prog(t, 63.3 + i * 0.3, 69.4 + i * 0.25) * (1 - i * 0.03);
                  if (t < 63.3 + i * 0.3) return null;
                  const p = sobre(RUTA15, u);
                  const s = (78 + 10 * z) / (1100 * z);
                  return <div key={i} style={{ position: "absolute", left: p.x + (i % 3 - 1) * 4 / z, top: p.y - 6 / z + ((i % 2) * 2 - 1) * 3 / z, transform: `translate(-50%,-50%) scale(${s * (Math.cos(p.ang) < 0 ? -1 : 1)}, ${s})` }}><Drakkar x={0} y={0} s={1} t={t + i} vela={1} /></div>;
                })}
                {t > 70.9 && <div style={{ position: "absolute", left: 673 + 14, top: 654 - 6, transform: `scale(${ent(t, 70.9) / z})`, transformOrigin: "0 0" }}><IglesiaMini s={1.2} /></div>}
              </>
            );
          })()}
        </MapaN>
        {/* el campo del granjero tapa el mapa hasta que «aparecen» los vikingos */}
        {t < 63.4 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${prog(t, 62.6, 63.4) * 1100}px)` }}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a 0%, #6a5aa8 40%, #f2a65a 75%)" }} />
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              <path d="M 0 700 Q 600 660 1200 690 Q 1600 700 1920 680 L 1920 1080 L 0 1080 Z" fill="#4a6a3a" />
              <rect x={0} y={760} width={1920} height={320} fill="#6e5032" />
              {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M -40 ${790 + k * 44} Q 960 ${770 + k * 46} 1960 ${790 + k * 44}`} stroke="#4e3620" strokeWidth={10} fill="none" />)}
              {/* surco fresco detrás del arado */}
              <path d={`M 0 935 L ${interpolate(t, [56.3, 62.6], [520, 1060], { extrapolateRight: "clamp" }) - 40} 935`} stroke="#3a2614" strokeWidth={22} strokeLinecap="round" />
              {/* barquitos lejanos en la costa (el «cuento») */}
              {t > 60.2 && [0, 1, 2].map((k) => <g key={k} transform={`translate(${1450 + k * 140 + Math.sin(t + k) * 10} ${684 - k * 4}) scale(${0.5 * ent(t, 60.3 + k * 0.2)})`}><path d="M -50 0 Q 0 26 50 0 Z" fill="#5e3a1e" /><rect x={-3} y={-56} width={6} height={56} fill="#5e3a1e" /><path d="M -28 -50 L 28 -50 L 24 -8 L -24 -8 Z" fill="#d6283e" /></g>)}
            </svg>
            {(() => {
              const fx = interpolate(t, [56.3, 62.6], [560, 1100], { extrapolateRight: "clamp" });
              const rie = t > 60.4 && t < 62.6;
              return (
                <>
                  <Persona x={fx} y={940} h={460} t={t} seed={62} ropa={CIVIL(3)} barba="#6b3a1f" expr={rie ? "feliz" : "neutro"} habla={rie} camina={rie ? 0 : 0.9} inclina={rie ? -6 : 8} bD={rie ? 120 : 55} cD={rie ? 60 : 25} bI={rie ? 20 : -40} cI={rie ? 10 : -15} mira={rie ? 0.6 : 0.4} />
                  <Arado x={fx + 170} y={950} t={rie ? 0 : t} />
                  {rie && <Emote t={t} t0={60.5} tipo="preg" x={fx} y={940 - 380} s={1.1} />}
                </>
              );
            })()}
            {/* mapita: Mercia en el medio de Inglaterra */}
            {t > 58.0 && (
              <div style={{ position: "absolute", left: 1330, top: 110, width: 470, height: 300, borderRadius: 26, overflow: "hidden", border: "8px solid #fff3d6", boxShadow: "0 10px 0 rgba(10,5,30,.45)", transform: `scale(${ent(t, 58.0)})`, transformOrigin: "50% 0" }}>
                <div style={{ position: "absolute", left: -12, top: -10, width: 1920, height: 1080, transform: "scale(0.25)", transformOrigin: "0 0" }}>
                  <MapaN t={t} cam={[[0, 690, 640, 2.4]]} desde="NORWAY" zona={[{ n: "MERCIA", t0: 58.3, r: 70, color: C.lima }]} pulsa={[{ n: "MERCIA", t0: 58.5, color: C.lima }]} />
                </div>
              </div>
            )}
          </div>
        )}
        <Ch t={t} t0={56.6} t1={63.0} text="A FARMER" color={C.lima} tinta={C.noche} x={120} y={170} size={60} />
        <Ch t={t} t0={58.2} t1={63.0} text="THE MIDDLE OF ENGLAND" color={C.violeta} x={1565} y={470} centro size={44} />
        <Ch t={t} t0={60.2} t1={62.8} text="VIKINGS? JUST A STORY FROM THE COAST" color={C.teal} tinta={C.noche} x={960} y={1000} centro size={46} />
        <Ch t={t} t0={64.6} text="THE BIGGEST VIKING FORCE EVER SEEN" color={C.rojo} x={960} y={150} centro size={56} />
        {/* jefe vikingo que entra y señala el mapa */}
        {t > 63.4 && (() => {
          const x = interpolate(t, [63.4, 64.6], [2150, 1500], { extrapolateRight: "clamp" });
          return <Persona x={x} y={1020} h={400} t={t} seed={205} ropa={VIK(0)} casco="vikingo" barba={barbaDe(0)} expr={t > 70.2 ? "feliz" : "orgullo"} flip camina={t < 64.6 ? 1.6 : 0} bD={t > 64.8 ? 100 : 20} cD={t > 64.8 ? 0 : 10} bI={t > 70.2 ? 150 : 10} cI={t > 70.2 ? 20 : 10} habla={t > 66 && t < 68} />;
        })()}
        <G t={t} t0={67.0} t1={72.0} text="THE GREAT ARMY" x={860} y={960} size={110} color={C.ambar} />
        <Ch t={t} t0={70.9} text="RIGHT NEXT TO THE CHURCH" color={C.violeta} x={960} y={260} centro size={50} />
      </Escena>
      {/* E016 · desde la loma: no eligieron ese lugar por casualidad (el chico queda entero, señalando) */}
      <Escena t={t} t0={72.62} t1={77.38} zoom={0} entra="iris" ix={960} iy={540}>
        {(() => {
          // señala desde la loma, baja corriendo hacia el campamento siguiendo la cámara y se frena a señalar otra vez
          const dx = interpolate(t, [74.6, 76.8], [0, 1120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (u) => u * u * (3 - 2 * u) });
          const corre = t > 74.6 && t < 76.8;
          return <Mundo t={t} cam={cam} luna={LUNA} yo={<Yo t={t} expr={t > 75.8 ? "miedo" : "sorpresa"} senala={(t > 73.0 && t < 74.6) || t > 76.85} dx={dx} camina={corre ? 2.2 : 0} />} />;
        })()}
        <Ch t={t} t0={73.2} text="FROM THE HILL…" color={C.violeta} x={120} y={150} size={56} />
        <Sello t={t} t0={76.0} text="NOT BY ACCIDENT" x={1180} y={360} size={84} rot={-8} />
      </Escena>
      {/* E017 · no acampaban como vos: el vikingo salta del barco a la orilla */}
      <Escena t={t} t0={77.38} t1={81.1} entra="diag" golpes={[79.1, 79.6]}>
        <AbsoluteFill style={{ background: "#16123d" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, bottom: 0, background: "linear-gradient(180deg, #2a3a7a, #2f6450 70%)", overflow: "hidden" }}>
          <Tienda x={430} y={620} s={0.9} k={2} t={t} />
          <Persona x={700} y={900} h={420} t={t} seed={3} ropa={SAJON} expr="feliz" bD={80 + Math.max(0, Math.sin(t * 8)) * 70} cD={40} flip
            manoD={<g transform="rotate(180)"><rect x={-7} y={-20} width={14} height={120} fill="#8a5a32" /><rect x={-26} y={90} width={52} height={36} rx={6} fill="#6e6a80" stroke="#2a1530" strokeWidth={4} /></g>} />
          <rect x={520} y={820} width={18} height={80} fill="#a8794a" stroke="#2a1530" strokeWidth={4} />
          <Ch t={t} t0={77.6} text="YOU" color={C.lima} tinta={C.noche} x={480} y={150} centro size={64} />
          <Ch t={t} t0={78.3} text="ANY FIELD" color={C.violeta} x={480} y={990} centro size={46} />
        </div>
        <div style={{ position: "absolute", left: 960, top: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, #2a3a7a, #1d4f7a 62%)", overflow: "hidden" }}>
          <svg style={{ position: "absolute", inset: 0 }} width={960} height={1080}>
            <path d="M 0 840 Q 220 800 400 860 Q 440 900 420 1080 L 0 1080 Z" fill="#2f6450" stroke="#1a3a30" strokeWidth={8} />
            {Array.from({ length: 8 }, (_, i) => <rect key={i} x={(i * 130 + t * 40) % 1000 - 40} y={930 + (i % 3) * 40} width={80} height={6} rx={3} fill="#bfe3ff" opacity={0.3} />)}
          </svg>
          <Tienda x={170} y={720} s={0.5} k={0} t={t} luz />
          {(() => {
            const u = prog(t, 78.5, 79.1);
            const x = interpolate(u, [0, 1], [810, 330]);
            const y = interpolate(u, [0, 1], [850, 880]) - Math.sin(u * Math.PI) * 260;
            const enBarco = t < 78.5;
            const vik = <Persona x={x} y={y} h={300} t={t} seed={201} ropa={VIK(1)} casco="vikingo" barba={barbaDe(1)} expr={t > 79.1 ? "feliz" : "orgullo"} flip={!enBarco}
              bD={t < 78.5 ? 20 : t < 79.1 ? 150 : t < 79.9 ? 160 : 95} cD={t < 79.9 ? 20 : 0} bI={t < 78.5 ? 40 : t < 79.9 ? 150 : 20} cI={20} inclina={t > 78.3 && t < 78.5 ? 10 : 0} />;
            return (
              <>
                {enBarco && vik}
                <Drakkar x={680} y={820} s={0.6} t={t} vela={1} flip />
                {!enBarco && vik}
                {t > 79.05 && t < 79.6 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{[-1, 1].map((d) => [0, 1, 2].map((k) => { const q = prog(t, 79.05, 79.6); return <circle key={`${d}${k}`} cx={330 + d * (40 + q * 90 + k * 20)} cy={880 - q * 40 - k * 10} r={10 - q * 6} fill="#c9b48a" opacity={1 - q} />; }))}</svg>}
              </>
            );
          })()}
          <Ch t={t} t0={79.6} text="VIKINGS" color={C.rojo} x={480} y={150} centro size={64} />
          <Ch t={t} t0={80.0} text="LIKE SAILORS" color={C.teal} tinta={C.noche} x={600} y={990} centro size={46} />
        </div>
        <div style={{ position: "absolute", left: 952, top: 0, width: 16, bottom: 0, background: "#fff" }} />
      </Escena>
      {/* E018 · casi siempre en un río, muy seguido en una isla (los vikingos de cuerpo entero en la orilla) */}
      <Escena t={t} t0={81.1} t1={85.72} entra="sube" golpes={[82.6, 84.4]}>
        <Isla t={t} t0={83.6} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 0 1000 Q 700 950 1920 990 L 1920 1080 L 0 1080 Z" fill="#5e4428" stroke="#2a1530" strokeWidth={6} />
        </svg>
        {[0, 1, 2].map((i) => { const x = interpolate(t, [81.2 + i * 0.3, 84.2 + i * 0.3], [-120, 560 + i * 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); const llega = t > 84.2 + i * 0.3; return <Persona key={i} x={x} y={1010} h={300} t={t} seed={230 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={llega ? "feliz" : "orgullo"} camina={llega ? 0 : 1.4} mira={llega ? 0.4 : 0.8} bD={llega && i === 1 ? 140 : 100} cD={60} manoD={<g transform="rotate(200)"><path d="M -60 -30 L 0 -110 L 60 -30 Z" fill="#c9a66b" stroke="#2a1530" strokeWidth={6} /></g>} />; })}
        <Ch t={t} t0={82.6} text="ON A RIVER" color={C.teal} tinta={C.noche} x={960} y={150} centro size={66} />
        <G t={t} t0={84.4} text="ON AN ISLAND" y={260} size={110} color={C.ambar} />
      </Escena>
      {/* E019 · Thanet (851), Sheppey, Torksey: el barco con su vikingo en la proa */}
      <Escena t={t} t0={85.72} t1={100.46} zoom={0} entra="zoom">
        <MapaN t={t} cam={cam19v} desde="NORWAY"
          pulsa={[{ n: "THANET", t0: 89.0, color: C.ambar }, { n: "SHEPPEY", t0: 93.2, color: C.teal }, { n: "TORKSEY", t0: 96.2, color: C.rojo }]}>
          {(() => {
            const z = c19.z;
            const b = b19, dir = dir19;
            const s = 0.32 / z;
            const ola = Math.sin(t * 7) * 20;
            return (
              <>
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                  {tramos19.map((r, i) => {
                    if (t < r.t0) return null;
                    const v = interpolate(t, [r.t0, r.t0 + r.dur], [0, 1], { extrapolateRight: "clamp" });
                    const mx = (r.A.x + r.B.x) / 2, my = (r.A.y + r.B.y) / 2 - r.curva;
                    const op = r.fuera ? 1 - prog(t, r.fuera[0], r.fuera[1]) : 1;
                    return <path key={i} d={`M ${r.A.x} ${r.A.y} Q ${mx} ${my} ${r.B.x} ${r.B.y}`} stroke={r.color} strokeWidth={7 / z} fill="none" pathLength={1000} strokeDasharray={`${v * 1000} 1000`} strokeLinecap="round" opacity={op} />;
                  })}
                </svg>
                <div style={{ position: "absolute", left: b.x, top: b.y - 55 / z, transform: `translate(-50%,-50%) scale(${s * (dir < 0 ? -1 : 1)}, ${s})` }}>
                  <Persona x={330} y={40} h={700} t={t} seed={207} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} expr={t > 96.2 ? "orgullo" : "feliz"} habla={t > 86.6 && t < 88} bD={t > 96.2 ? 95 : 160} cD={t > 96.2 ? 0 : 25 + ola * 1.6} bI={30} cI={20} mira={0.8} />
                  <Drakkar x={0} y={0} s={1} t={t} vela={1} />
                </div>
              </>
            );
          })()}
        </MapaN>
        <G t={t} t0={86.4} t1={92.3} text="851" x={1480} y={800} size={190} color={C.ambar} />
        <Ch t={t} t0={87.6} t1={92.3} text="FIRST WINTER IN ENGLAND" color={C.violeta} x={1440} y={950} centro size={50} />
        <Ch t={t} t0={89.0} t1={93.1} text="📍 THANET" color={C.ambar} tinta={C.noche} x={120} y={880} size={52} />
        <Ch t={t} t0={93.2} t1={96.1} text="📍 SHEPPEY" color={C.teal} tinta={C.noche} x={120} y={880} size={52} />
        <Ch t={t} t0={96.2} text="📍 TORKSEY" color={C.rojo} x={120} y={880} size={52} />
        <Cuenta t={t} t0={92.5} de={851} a={872} dur={3.4} x={1640} y={170} size={120} color={C.ambar} />
        <Ch t={t} t0={92.6} t1={94.4} text="A FEW YEARS LATER" color={C.teal} tinta={C.noche} x={900} y={160} centro size={56} />
        <Ch t={t} t0={94.8} text="THE WINTER BEFORE REPTON" color={C.rojo} x={900} y={150} centro size={56} />
        <Ch t={t} t0={97.6} text="HIGH GROUND · MARSH · WATER" color={C.teal} tinta={C.noche} x={1150} y={990} centro size={48} />
      </Escena>
      {/* E020 · lo midieron: más de 50 hectáreas · un pueblo inglés a la misma escala que se achica */}
      <Escena t={t} t0={100.46} t1={106.72} entra="iris" ix={960} iy={600} golpes={[104.3, 105.0]}>
        <Isla t={t} t0={100.5} juncos />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {/* soga de medir: de x=200 a x=1000 */}
          <path d={`M 260 610 Q ${260 + 400 * prog(t, 101.0, 102.2)} ${640 - 20 * Math.sin(t * 4)} ${260 + 800 * prog(t, 101.0, 102.2)} 610`} stroke="#c9a66b" strokeWidth={14} fill="none" strokeDasharray="40 14" />
          <line x1={260} y1={590} x2={260} y2={630} stroke={C.ambar} strokeWidth={10} />
          {t > 102.2 && <line x1={1060} y1={590} x2={1060} y2={630} stroke={C.ambar} strokeWidth={10} />}
        </svg>
        <Persona x={250} y={700} h={300} t={t} seed={240} ropa={VIK(0)} casco="vikingo" barba={barbaDe(0)} expr={t > 102.2 ? "feliz" : "orgullo"} inclina={t < 102.2 ? -10 : 0} bD={70} cD={10} />
        {(() => {
          // el que tira de la soga: camina de espaldas tirando y al llegar levanta el puño
          const u = prog(t, 101.0, 102.2);
          const tira = t < 102.2;
          return <Persona x={260 + 800 * u + 40} y={700} h={300} t={t} seed={241} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr="feliz" flip camina={tira ? 1.8 : 0} inclina={tira ? 14 : 0} bD={t > 102.4 && t < 103.2 ? 160 : tira ? 120 : 70} cD={tira ? 40 : 10} bI={tira ? 110 : 30} cI={tira ? 40 : 10} />;
        })()}
        <Cuenta t={t} t0={102.4} de={0} a={50} dur={1.2} y={175} size={200} prefijo="" sufijo="+" />
        <Ch t={t} t0={103.0} text="HECTARES" color={C.rojo} x={960} y={330} centro size={58} />
        {/* comparación: un pueblo inglés a la MISMA escala que el campamento, que se achica con BIGGER */}
        {t > 104.3 && (() => {
          const k = interpolate(t, [104.3, 104.6, 105.0, 105.7], [0.85, 1.0, 1.0, 0.35], { extrapolateRight: "clamp", easing: (u) => 1 - (1 - u) * (1 - u) });
          const op = prog(t, 104.3, 104.5);
          return (
            <div style={{ position: "absolute", left: 1450, top: 960, opacity: op, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: "50% 100%" }}>
              <svg width={700} height={320} viewBox="0 0 700 320">
                <rect x={6} y={26} width={688} height={288} rx={30} fill="#3a6a4a" stroke="#fff3d6" strokeWidth={10} strokeDasharray="30 16" />
                {[[40, 0], [150, 1], [260, 2], [370, 0], [480, 1], [590, 2]].map(([x, i]) => <g key={x}><rect x={x} y={160 - i * 12} width={80} height={110 + i * 12} fill={["#e8b98a", "#f0c79a", "#d8a878"][i]} stroke="#2a1530" strokeWidth={6} /><path d={`M ${x - 12} ${160 - i * 12} L ${x + 40} ${110 - i * 12} L ${x + 92} ${160 - i * 12} Z`} fill="#b5452c" stroke="#2a1530" strokeWidth={6} /><rect x={x + 28} y={225} width={24} height={45} fill="#5e3a1e" /></g>)}
                <rect x={250} y={60} width={46} height={110} fill="#d8d0e8" stroke="#2a1530" strokeWidth={6} /><path d="M 244 60 L 273 20 L 302 60 Z" fill="#7a5a8a" stroke="#2a1530" strokeWidth={6} />
              </svg>
            </div>
          );
        })()}
        <Ch t={t} t0={104.4} t1={105.0} text="AN ENGLISH TOWN" color={C.violeta} x={1450} y={598} centro size={44} />
        <Ch t={t} t0={105.7} text="AN ENGLISH TOWN" color={C.violeta} x={1450} y={1005} centro size={40} />
        <Sello t={t} t0={105.0} text="BIGGER" x={760} y={880} size={90} color={C.ambar} rot={-6} />
      </Escena>
      {/* E021 · no era sólo un campamento: el detector, banderitas por todos lados y los hallazgos a la vitrina */}
      <Escena t={t} t0={106.72} t1={117.84} zoom={0.05} entra="corte" golpes={[113.5, 114.6, 115.8, 116.9]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #7ec8e8, #c8e8f2 55%)" }} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <rect x={0} y={700} width={1920} height={380} fill="#6a8a3a" />
          <rect x={0} y={740} width={1920} height={340} fill="#7a5a3a" />
          {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={(i * 137) % 1920} cy={800 + (i * 53) % 260} rx={18} ry={9} fill="#5e4428" />)}
          {/* «cientos de hallazgos»: banderitas que brotan por todo el campo */}
          {Array.from({ length: 46 }, (_, i) => {
            const t0 = 109.7 + (i % 23) * 0.13 + Math.floor(i / 23) * 0.05;
            if (t < t0) return null;
            const e = Math.min(1, (t - t0) / 0.25);
            const x = 80 + ((i * 397) % 1760), y = 760 + ((i * 131) % 150);
            return <g key={i} transform={`translate(${x} ${y}) scale(${e})`}><line x1={0} y1={0} x2={0} y2={-50} stroke="#2a1530" strokeWidth={4} /><path d="M 0 -50 L 30 -40 L 0 -30 Z" fill={[C.rojo, C.ambar, C.teal][i % 3]} stroke="#2a1530" strokeWidth={3} /></g>;
          })}
          {/* ondas del detector */}
          {t > 108.4 && [0, 1, 2].map((i) => { const q = ((t * 1.6 + i / 3) % 1); return <ellipse key={i} cx={detX(t) + 230} cy={760} rx={40 + q * 160} ry={12 + q * 40} fill="none" stroke="#fff3c4" strokeWidth={6} opacity={1 - q} />; })}
        </svg>
        <Vitrina x={400} y={440} t={t} t0={113.0} />
        <Persona x={detX(t)} y={740} h={420} t={t} seed={61} ropa={CIVIL(1)} expr={t > 113.4 ? "sorpresa" : "feliz"} camina={0.6} bD={70} cD={10} bI={t > 113.4 ? 140 : undefined} cI={t > 113.4 ? 30 : undefined}
          manoD={<g transform="rotate(-70)"><rect x={-6} y={0} width={12} height={260} fill="#3b3048" /><ellipse cx={0} cy={270} rx={60} ry={18} fill="#2a2a40" stroke={C.ambar} strokeWidth={6} /></g>} />
        {hallazgos21.map((h, i) => {
          if (t < h.t0) return null;
          const sx = detX(h.t0) + 230, sy = 740;
          const u = prog(t, h.t0 + 0.15, h.t0 + 0.85);
          const x = sx + (h.slot[0] - sx) * u, y = sy + (h.slot[1] - sy) * u - Math.sin(u * Math.PI) * 260 - (1 - u) * Math.sin(prog(t, h.t0, h.t0 + 0.15) * Math.PI) * 60;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${(1 - u) * 360}deg) scale(${0.6 + 0.4 * u})` }}>
              {h.dib}
              {t - h.t0 < 0.5 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 200, height: 200, marginLeft: -100, marginTop: -100, borderRadius: "50%", border: "8px solid #fff3c4", transform: `scale(${(t - h.t0) * 2})`, opacity: 1 - (t - h.t0) / 0.5 }} />}
            </div>
          );
        })}
        <Ch t={t} t0={107.0} t1={109.5} text="NOT JUST A CAMP" color={C.violeta} x={120} y={150} size={60} />
        <Ch t={t} t0={109.6} t1={112.9} text="HUNDREDS OF FINDS" color={C.rojo} x={960} y={150} centro size={64} />
        <Ch t={t} t0={113.6} text="COINS" color={C.teal} tinta={C.noche} x={260} y={985} centro size={44} />
        <Ch t={t} t0={114.7} text="CHOPPED-UP SILVER" color={C.teal} tinta={C.noche} x={690} y={985} centro size={44} />
        <Ch t={t} t0={115.9} text="LEAD WEIGHTS" color={C.teal} tinta={C.noche} x={1170} y={985} centro size={44} />
        <Ch t={t} t0={117.0} text="GAMING PIECES" color={C.teal} tinta={C.noche} x={1610} y={985} centro size={44} />
      </Escena>
      {/* E022 · comerciaba, apostaba y contaba el botín */}
      <Escena t={t} t0={117.84} t1={123.26} entra="iris" ix={960} iy={700} golpes={[120.2, 121.2, 122.2]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #6a3a2a, #1d1020 80%)" }} />
        <AbsoluteFill style={{ transformOrigin: "960px 900px", transform: `scale(${1 + 0.18 * prog(t, 121.0, 121.6)})` }}>
          <Fogata x={960} y={760} s={1.1} t={t} />
          <Persona x={520} y={1030} h={520} t={t} seed={202} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr={t > 121.2 ? "enojado" : "feliz"} habla bD={60} cD={60} />
          <Persona x={1400} y={1030} h={540} t={t} seed={203} ropa={VIK(3)} barba={barbaDe(3)} expr={t > 121.2 ? "feliz" : "neutro"} flip salta={121.2} bD={t > 121.2 ? 160 : 50 + Math.sin(t * 6) * 20} cD={t > 121.2 ? 10 : 70} bI={t > 121.2 ? 160 : 8} cI={t > 121.2 ? 10 : 10} />
          <svg style={{ position: "absolute", left: 760, top: 880 }} width={400} height={160}><rect x={0} y={20} width={400} height={120} rx={14} fill="#a8794a" stroke="#2a1530" strokeWidth={8} />{Array.from({ length: 9 }, (_, i) => <line key={i} x1={20 + i * 45} y1={30} x2={20 + i * 45} y2={130} stroke="#5e3a1e" strokeWidth={4} />)}</svg>
          {t > 118.6 && <Ficha x={interpolate(t, [118.6, 119.4, 120.4], [600, 860, 880], { extrapolateRight: "clamp" })} y={900 - Math.sin(prog(t, 118.6, 119.4) * Math.PI) * 120} s={0.8} t={t} t0={118.6} />}
          {t > 119.4 && <Ficha x={interpolate(t, [119.4, 120.2, 120.6], [1300, 1060, 1020], { extrapolateRight: "clamp" })} y={900 - Math.sin(prog(t, 119.4, 120.2) * Math.PI) * 120} s={0.8} t={t} t0={119.4} color="#d6283e" />}
        </AbsoluteFill>
        {t > 121.4 && <Particulas t={t} tipo="lluviaoro" n={40} seed={3} />}
        <Ch t={t} t0={118.0} text="NOT JUST SLEEPING" color={C.violeta} x={960} y={150} centro size={58} />
        <Ch t={t} t0={120.2} text="TRADED" color={C.teal} tinta={C.noche} x={300} y={340} size={70} />
        <Ch t={t} t0={121.2} text="GAMBLED" color={C.ambar} tinta={C.noche} x={760} y={340} size={70} />
        <Ch t={t} t0={122.2} text="COUNTED LOOT" color={C.rojo} x={1260} y={340} size={70} />
      </Escena>
      {/* E023 · Repton desde arriba: el chico se acerca al río y lo salpica */}
      <Escena t={t} t0={123.26} t1={127.16} entra="zoom" golpes={[125.6]}>
        <PlanoRepton t={t} zanja={123.6} agua={125.4} />
        <Ch t={t} t0={123.5} text="THE RIVER TRENT" color={C.teal} tinta={C.noche} x={1150} y={150} size={56} />
        {(() => {
          // camina hasta la orilla; con WATER = WALL da un paso al río (+80 en 0,3 s) y el agua lo echa para atrás con 6 gotas
          const avanza = prog(t, 123.9, 124.9), paso = prog(t, 125.4, 125.7), vuelve = prog(t, 125.75, 126.25);
          const x = 300 + avanza * 170 + paso * 80 - vuelve * 240;
          const moja = t > 125.72;
          return (
            <>
              <Persona x={x} y={1030} h={460} t={t} seed={3} ropa={SAJON} expr={moja ? "miedo" : t > 124.9 ? "sorpresa" : "neutro"} mira={moja ? -0.4 : 0.8}
                camina={(t > 123.9 && t < 124.9) || (t > 125.4 && t < 125.7) ? 1.4 : (t > 125.75 && t < 126.25) ? -1.6 : 0}
                inclina={t > 125.4 && t < 125.72 ? 12 : moja && t < 126.4 ? -14 : 0} bI={moja ? 140 : t > 125.4 ? 70 : undefined} cI={moja ? 40 : t > 125.4 ? 0 : undefined} manoD={<LanzaMano a={40} largo={420} />} />
              {moja && <Emote t={t} t0={125.75} tipo="susto" x={x} y={1030 - 370} s={0.9} />}
              {t > 125.7 && t < 126.3 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                {Array.from({ length: 6 }, (_, k) => {
                  // 6 gotas que saltan del agua en arco (0,5 s) hacia el chico
                  const q = prog(t, 125.7 + k * 0.02, 126.2 + k * 0.02);
                  const x0 = 720 + k * 18, x1 = 470 + k * 40;
                  const gx = x0 + (x1 - x0) * q, gyy = 980 - Math.sin(q * Math.PI) * (220 + k * 30) - q * 120;
                  return <path key={k} transform={`translate(${gx} ${gyy}) rotate(${-30 - q * 60})`} d="M 0 -36 Q 24 0 0 20 Q -24 0 0 -36 Z" fill="#7fd6ff" stroke="#fff" strokeWidth={3} opacity={1 - q * 0.5} />;
                })}
                <ellipse cx={740} cy={985} rx={40 + prog(t, 125.7, 126.1) * 90} ry={10 + prog(t, 125.7, 126.1) * 20} fill="none" stroke="#bfe9ff" strokeWidth={6} opacity={1 - prog(t, 125.7, 126.2)} />
              </svg>}
            </>
          );
        })()}
        <G t={t} t0={125.6} text="WATER = WALL" x={1300} y={940} size={104} color={C.crema} />
      </Escena>
      {/* E024 · el río les cuida la espalda; el guardia se rasca y mira los barcos (mundo) */}
      <Escena t={t} t0={127.16} t1={130.32} zoom={0} entra="corte">
        {(() => {
          const rasca = t < 128.8;
          const g = <Persona x={7420} y={gy(7420) + 30} h={360} t={t} seed={250} ropa={VIK(3)} casco="vikingo" barba={barbaDe(3)} expr={rasca ? "dormido" : t < 129.6 ? "sorpresa" : "orgullo"}
            bI={rasca ? 160 : 20} cI={rasca ? 100 + Math.sin(t * 18) * 25 : 10} bD={rasca ? 20 : 95} cD={rasca ? 20 : 0} mira={rasca ? -0.2 : 0.9} miraY={rasca ? -0.2 : 0}
            manoD={rasca ? <LanzaMano a={-10} /> : undefined} manoI={rasca ? undefined : <LanzaMano a={-10} />} />;
          return <Mundo t={t} cam={cam} luna={LUNA} yo={g} />;
        })()}
        <Ch t={t} t0={127.4} text="BACK: COVERED ✓" color={C.lima} tinta={C.noche} x={120} y={150} size={60} />
        <Ch t={t} t0={128.9} text="SHIPS ON THE BANK" color={C.ambar} tinta={C.noche} x={120} y={260} size={56} />
      </Escena>
      {/* E025 · la única entrada: campo abierto, cuesta arriba, a oscuras (el chico sube jadeando) */}
      <Escena t={t} t0={130.32} t1={135.2} zoom={0} entra="barrido" golpes={[132.6, 133.6, 134.4]}>
        <Mundo t={t} cam={cam} luna={LUNA} yo={(() => {
          const bx = interpolate(t, [130.4, 135.2], [3300, 2350]);
          const jadea = Math.sin(t * 13) * 6;
          return (
            <>
              <Persona x={bx} y={gy(bx) + 30 + jadea} h={360} t={t} seed={3} ropa={SAJON} expr="miedo" flip camina={1.3} inclina={-14} habla manoD={<LanzaMano a={60} />} />
              <Aliento t={t} x={bx - 70} y={gy(bx) + 30 - 300} s={0.8} dir={-1} />
              <Emote t={t} t0={131.2} tipo="sudor" x={bx} y={gy(bx) + 30 - 290} s={0.8} />
            </>
          );
        })()}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            <path d={`M 1700 ${gy(1700) - 40} Q 2600 560 3400 ${gy(3400) - 60}`} stroke={C.rojo} strokeWidth={26} fill="none" strokeDasharray="60 40" pathLength={1000} style={{ strokeDasharray: `${prog(t, 130.6, 132.4) * 1000} 1000` }} strokeLinecap="round" />
          </svg>
        </Mundo>
        <AbsoluteFill style={{ background: `rgba(4,3,16,${prog(t, 134.2, 135.0) * 0.5})` }} />
        <Ch t={t} t0={130.5} text="THE ONLY WAY IN" color={C.rojo} x={120} y={140} size={64} />
        <Ch t={t} t0={132.6} text="OPEN GROUND" color={C.teal} tinta={C.noche} x={120} y={250} size={54} />
        <Ch t={t} t0={133.6} text="UPHILL" color={C.ambar} tinta={C.noche} x={650} y={250} size={54} />
        <Ch t={t} t0={134.4} text="IN THE DARK" color={C.violeta} x={940} y={250} size={54} />
      </Escena>
      {/* E026 · es invierno: el sol se va antes de las 4 · 16 horas de oscuridad (la noche crece desde el reloj) */}
      <Escena t={t} t0={135.2} t1={143.72} entra="iris" ix={960} iy={540} golpes={[140.9]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a2a7a, #120e36 80%)" }} />
        <Nieve t={t} n={60} op={0.5} />
        <AbsoluteFill style={{ opacity: prog(t, 136.8, 137.6), background: `radial-gradient(circle at 560px 560px, rgba(4,2,18,.82) 0px, rgba(4,2,18,.82) ${300 + prog(t, 137, 143.5) * 1200}px, rgba(4,2,18,0) ${300 + prog(t, 137, 143.5) * 1200 + 280}px)` }} />
        <Reloj24 t={t} t0={135.4} horas={16} x={560} y={560} r={300} />
        {(() => {
          const frio = t > 137.5;
          const tir = frio ? Math.sin(t * 40) * 4 : 0;
          return (
            <>
              <Persona x={1580 + tir} y={1040} h={540} t={t} seed={3} ropa={SAJON} expr={t > 139 ? "miedo" : "triste"} mira={-0.8} bD={frio ? -18 : 20} cD={frio ? -115 : 20} bI={frio ? -18 : 20} cI={frio ? -115 : 20} />
              {frio && <Aliento t={t} x={1530 + tir} y={1040 - 390} s={0.9} dir={-1} />}
            </>
          );
        })()}
        <Ch t={t} t0={136.8} text="DECEMBER" color={C.teal} tinta={C.noche} x={1000} y={160} size={60} />
        <Ch t={t} t0={138.4} text="SUNSET: BEFORE 4 PM" color={C.ambar} tinta={C.noche} x={1000} y={270} size={50} />
        <Cuenta t={t} t0={140.9} de={0} a={16} dur={0.9} x={1130} y={560} size={220} color={C.crema} />
        <Ch t={t} t0={141.4} text="HOURS OF DARKNESS" color={C.violeta} x={1130} y={720} centro size={48} />
      </Escena>
      {/* E027 · muchas noches largas para prepararse: afilan hachas y uno prueba el filo en una rama */}
      <Escena t={t} t0={143.72} t1={147.16} entra="barrido" golpes={[145.2, 146.45]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 70%, #6a3a2a, #1d1020 80%)" }} />
        <Fogata x={960} y={720} s={1.2} t={t} />
        <Persona x={420} y={1040} h={560} t={t} seed={211} ropa={VIK(1)} casco="vikingo" barba={barbaDe(1)} expr="enojado" bD={70 + Math.sin(t * 9 + 1) * 25} cD={60}
          manoD={<g transform="rotate(130)"><rect x={-7} y={-140} width={14} height={240} fill="#8a5a32" /><path d="M 6 -140 Q 60 -170 72 -110 Q 76 -70 64 -40 Q 40 -80 6 -84 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} /></g>} />
        {(() => {
          // el de la derecha afila y al final levanta el hacha y corta la rama
          const alza = t > 145.8 && t < 146.4, golpe = t >= 146.4;
          const bD = alza ? interpolate(t, [145.8, 146.3], [70, 175], { extrapolateRight: "clamp" }) : golpe ? interpolate(t, [146.4, 146.55], [175, 60], { extrapolateRight: "clamp" }) : 70 + Math.sin(t * 9 + 2) * 25;
          return <Persona x={1500} y={1040} h={560} t={t} seed={212} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr={golpe ? "orgullo" : "enojado"} flip bD={bD} cD={alza ? 20 : 60}
            manoD={<g transform="rotate(130)"><rect x={-7} y={-140} width={14} height={240} fill="#8a5a32" /><path d="M 6 -140 Q 60 -170 72 -110 Q 76 -70 64 -40 Q 40 -80 6 -84 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} /></g>} />;
        })()}
        <svg style={{ position: "absolute", left: 540, top: 820 }} width={160} height={120}><ellipse cx={80} cy={70} rx={70} ry={34} fill="#8a8aa0" stroke="#2a1530" strokeWidth={6} /><ellipse cx={80} cy={58} rx={60} ry={22} fill="#a8a8be" />{Math.sin(t * 9 + 1) > 0.3 && [0, 1, 2, 3, 4].map((k) => <line key={k} x1={80} y1={50} x2={80 + Math.cos(k * 0.8 + t * 20) * 60} y2={20 - Math.abs(Math.sin(k + t * 30)) * 50} stroke="#ffd36a" strokeWidth={5} strokeLinecap="round" />)}</svg>
        {/* tronco con la rama: se parte en dos al golpe */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <rect x={1190} y={900} width={150} height={110} rx={14} fill="#8a5a32" stroke="#2a1530" strokeWidth={6} />
          <ellipse cx={1265} cy={900} rx={75} ry={18} fill="#c9a66b" stroke="#2a1530" strokeWidth={5} />
          {(() => {
            const c = prog(t, 146.45, 146.9);
            const caida = t >= 146.45;
            return [-1, 1].map((d) => (
              <g key={d} transform={`translate(${1265 + (caida ? d * (10 + c * 70) : 0)} ${880 + (caida ? c * 30 : 0)}) rotate(${caida ? d * c * 35 : 0})`}>
                <rect x={d < 0 ? -130 : 0} y={-12} width={130} height={24} rx={10} fill="#6e4a2a" stroke="#2a1530" strokeWidth={5} />
                <path d={d < 0 ? "M -110 -10 l -14 -26 l 22 10 Z" : "M 100 -10 l 12 -24 l 8 22 Z"} fill="#5a8a3a" />
              </g>
            ));
          })()}
          {t > 146.45 && t < 146.9 && [0, 1, 2, 3, 4, 5].map((k) => { const q = prog(t, 146.45, 146.9); return <line key={k} x1={1265} y1={880} x2={1265 + Math.cos(-0.4 - k * 0.45) * (40 + q * 120)} y2={880 + Math.sin(-0.4 - k * 0.45) * (40 + q * 120)} stroke="#ffd36a" strokeWidth={6} strokeLinecap="round" opacity={1 - q} />; })}
        </svg>
        {Math.sin(t * 9) > 0.6 && <Particulas t={t} tipo="brasas" n={20} seed={6} />}
        <Ch t={t} t0={144.0} text="LONG EVENINGS" color={C.violeta} x={960} y={140} centro size={60} />
        <G t={t} t0={145.2} text="GETTING READY FOR YOU" y={280} size={92} color={C.ambar} />
      </Escena>
      {/* E028 · tu rey ya decidió: Burgred mira el campamento… y se va caminando a la izquierda */}
      <Escena t={t} t0={147.16} t1={155.64} zoom={0} entra="corte" golpes={[152.6]}>
        <Mundo t={t} cam={cam} luna={LUNA} yo={<>
          <Yo t={t} expr={t > 152 ? "sorpresa" : "neutro"} />
          {(() => {
            const sale = Math.max(0, t - 152.4);
            const x = 1330 - sale * 430;
            return (
              <>
                <Persona x={x} y={gy(x) + 30} h={360} t={t} seed={70} ropa={ROPA_REY} barba="#6b3a1f" expr={t < 151 ? "neutro" : t < 152.4 ? "miedo" : "sorpresa"} flip={t > 152.4} camina={t > 152.4 ? 2.0 : 0} aparece={148.2} mira={t > 150.6 && t < 152.4 ? 0.9 : 0.3} bD={t > 150.6 && t < 152.4 ? 30 : 8} bI={t > 150.6 && t < 152.4 ? 150 : 8} cI={t > 150.6 && t < 152.4 ? 60 : 10} />
                {t > 148.2 && <Corona x={x} y={gy(x) + 30 - 360 * 1.02} s={0.55} t={t} t0={148.4} />}
                {t > 150.8 && t < 152.4 && <Emote t={t} t0={150.8} tipo="sudor" x={x} y={gy(x) + 30 - 290} s={0.8} />}
              </>
            );
          })()}
        </>} />
        <Ch t={t} t0={147.6} text="YOUR OWN KING" color={C.violeta} x={120} y={150} size={60} />
        <Ch t={t} t0={150.4} text="BURGRED · KING OF MERCIA" color={C.ambar} tinta={C.noche} x={120} y={260} size={52} />
        <Sello t={t} t0={152.6} text="…AND LEFT" x={1210} y={200} size={80} rot={-6} />
        <Ch t={t} t0={154.5} text="← TO ROME" color={C.rojo} x={360} y={930} centro size={60} />
      </Escena>
      {/* E029 · nunca volvió: murió allá; un monje le deja flores en el barrio inglés de Roma */}
      <Escena t={t} t0={155.64} t1={161.14} entra="iris" ix={960} iy={560} golpes={[157.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2a65a, #ffd98a)" }} />
        <Rayos t={t} x={960} y={300} color="#fff8d8" op={0.2} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 0 760 L 1920 760 L 1920 1080 L 0 1080 Z" fill="#d98a4a" />
          {[200, 520, 1400, 1720].map((x, i) => <g key={i}><rect x={x - 90} y={520 - (i % 2) * 60} width={180} height={240 + (i % 2) * 60} fill="#f2c48a" stroke="#8a4a20" strokeWidth={6} /><path d={`M ${x - 90} ${520 - (i % 2) * 60} Q ${x} ${420 - (i % 2) * 60} ${x + 90} ${520 - (i % 2) * 60}`} fill="#e8a86a" stroke="#8a4a20" strokeWidth={6} />{[0, 1, 2].map((k) => <path key={k} d={`M ${x - 70 + k * 50} 760 L ${x - 70 + k * 50} 680 Q ${x - 50 + k * 50} 650 ${x - 30 + k * 50} 680 L ${x - 30 + k * 50} 760 Z`} fill="#8a4a20" />)}</g>)}
        </svg>
        {t < 157.6 && (() => { const x = interpolate(t, [155.64, 156.6], [-100, 700], { extrapolateRight: "clamp" }); return <Persona x={x} y={1000} h={480} t={t} seed={70} ropa={ROPA_REY} barba={t > 156.7 ? "#d8d4d0" : "#6b3a1f"} viejo={t > 156.7} expr="triste" camina={t < 156.6 ? 1.5 : 0} opacity={interpolate(t, [157.0, 157.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} manoD={<LanzaMano a={10} largo={360} />} />; })()}
        <Lapida x={960} y={650} s={1.15} t={t} t0={157.1} lineas={["BURGRED", "KING OF", "MERCIA", "DIED IN ROME"]} />
        <Corona x={700} y={925} s={0.6} t={t} t0={157.2} rot={-20} />
        {/* monje que entra y deja flores */}
        {t > 157.8 && (() => {
          const x = interpolate(t, [157.8, 159.2], [2060, 1320], { extrapolateRight: "clamp" });
          const deja = t > 159.3;
          return <Persona x={x} y={1010} h={420} t={t} seed={81} ropa={ROPA_MONJE} viejo expr={deja ? "triste" : "neutro"} flip camina={t < 159.2 ? 1.4 : 0} inclina={deja ? interpolate(t, [159.3, 159.8], [0, 14], { extrapolateRight: "clamp" }) : 0} bD={deja ? 45 : 30} cD={deja ? 20 : 70}
            manoD={deja ? undefined : <g><line x1={0} y1={0} x2={0} y2={-60} stroke="#3a6a2a" strokeWidth={6} />{[[-14, -66], [0, -76], [14, -66]].map(([fx, fy], k) => <circle key={k} cx={fx} cy={fy} r={13} fill={[C.rojo, "#fff3d6", C.ambar][k]} stroke="#2a1530" strokeWidth={3} />)}</g>} />;
        })()}
        {t > 159.5 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><g transform={`translate(1150 ${900 + (1 - prog(t, 159.5, 159.8)) * -40})`}><line x1={-30} y1={0} x2={30} y2={-10} stroke="#3a6a2a" strokeWidth={6} />{[[-34, -6], [-20, -14], [-6, -6]].map(([fx, fy], k) => <circle key={k} cx={fx} cy={fy} r={13} fill={[C.rojo, "#fff3d6", C.ambar][k]} stroke="#2a1530" strokeWidth={3} />)}</g></svg>}
        <Ch t={t} t0={155.8} text="NEVER CAME BACK" color={C.rojo} x={960} y={140} centro size={64} />
        <Ch t={t} t0={158.4} text="THE ENGLISH QUARTER OF ROME" color={C.violeta} x={960} y={250} centro size={46} />
      </Escena>
      {/* E030 · así que esta noche, depende de vos: aprieta la lanza y frunce */}
      <Escena t={t} t0={161.14} t1={162.96} zoom={0} entra="corte">
        {(() => {
          // chico ENTERO: duda, y con la decisión aprieta la lanza (la mano sube 30 px, la lanza tiembla ±3° 0,4 s); push-in 1,0→1,08
          const c30 = camEn(t, [[161.14, 1480, 400, 1.45], [162.96, 1480, 400, 1.45]]);
          const ap = prog(t, 162.0, 162.25);
          const tiembla = t > 162.0 && t < 162.4 ? Math.sin((t - 162.0) * 90) * 3 : 0;
          const push = interpolate(t, [161.14, 162.96], [1.0, 1.08], { easing: (u) => u * u * (3 - 2 * u) });
          const enoj = t > 162.0;
          const chico = <>
            <Persona x={1480} y={gy(1480) + 40} h={330} t={t} seed={3} ropa={SAJON} expr={enoj ? "enojado" : "triste"} mira={enoj ? 0.1 : -0.4} miraY={enoj ? 0 : 0.5}
              bD={30 + ap * 10} cD={20 + ap * 16} inclina={enoj ? 3 : -2}
              manoD={<LanzaMano a={50 - ap * 26 + tiembla} inclina={-14} />} />
            <PastoAlto x0={600} x1={2000} t={t} dy={14} alto={170} />
          </>;
          return (
            <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "960px 560px" }}>
              <Mundo t={t} cam={c30} luna={LUNA} yo={chico} />
            </AbsoluteFill>
          );
        })()}
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, transparent 26%, rgba(5,3,18,.7) 58%)" }} />
        {t > 162.1 && <Emote t={t} t0={162.1} tipo="enojo" x={900} y={560} s={0.9} />}
        <G t={t} t0={161.4} text="IT'S UP TO YOU" y={120} size={110} color={C.ambar} />
      </Escena>
      {/* E031 · Irlanda, en grande: barcos que entran a la bahía y vikingos clavando estacas (el longphort) */}
      <Escena t={t} t0={162.96} t1={170.86} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[162.96, 560, 640, 2.0], [165.5, 452, 616, 3.6], [167.2, 452, 616, 3.8], [168.1, D31.x - 14 + 200 / 6.4, D31.y + 6 - 220 / 6.4, 6.4], [170.86, D31.x - 14 + 200 / 6.7, D31.y + 6 - 220 / 6.7, 6.7]]} desde="NORWAY"
          zona={[{ n: "IRELAND", t0: 163.2, r: 150, color: C.lima }]}
          pulsa={[{ n: "DUBLIN", t0: 166.4, color: C.ambar }]}>
          {(() => {
            const vs = 0.22 / 3.8; // escala de los muñecos en el mapa (~150 px en pantalla)
            return (
              <>
                {/* empalizada: estacas que se clavan una a una en semicírculo */}
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                  {Array.from({ length: 11 }, (_, k) => {
                    const t0 = 166.6 + k * 0.32;
                    if (t < t0) return null;
                    const a = Math.PI * 0.55 + k * (Math.PI * 0.9 / 10);
                    const x = D31.x + 4 + Math.cos(a) * 30, y = D31.y + Math.sin(a) * 22;
                    const h = 14 * Math.min(1, (t - t0) / 0.2);
                    return <path key={k} d={`M ${x - 2.2} ${y} L ${x - 2.2} ${y - h} L ${x} ${y - h - 3.4} L ${x + 2.2} ${y - h} L ${x + 2.2} ${y} Z`} fill="#c9a66b" stroke="#2a1530" strokeWidth={0.7} />;
                  })}
                </svg>
                {/* tres barcos que entran a la bahía */}
                {[0, 1, 2].map((i) => { const u = prog(t, 163.6 + i * 0.5, 166.6 + i * 0.4); return <div key={i} style={{ position: "absolute", left: D31.x + 18 + i * 9 + (1 - u) * 140, top: D31.y + 2 + i * 8 + (1 - u) * 30, transform: `translate(-50%,-50%) scale(${-0.03}, ${0.03})` }}><Drakkar x={0} y={0} s={1} t={t + i} vela={1} /></div>; })}
                {/* dos vikingos que clavan estacas con mazo */}
                {t > 166.2 && [0, 1].map((i) => {
                  const golpe = Math.abs(Math.sin((t + i * 0.3) * 6));
                  return <div key={i} style={{ position: "absolute", left: D31.x - 24 + i * 18, top: D31.y + 2 + i * 4, transform: `scale(${vs * ent(t, 166.2 + i * 0.2)})`, transformOrigin: "0 0" }}>
                    {golpe < 0.25 && t > 167.2 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><g transform={`translate(${i === 1 ? -150 : 150} -40)`}>{[[-40, -20], [40, -20], [0, -50], [-30, 20], [30, 20]].map(([dx, dy], k) => <line key={k} x1={dx * 0.4} y1={dy * 0.4} x2={dx} y2={dy} stroke="#ffd36a" strokeWidth={10} strokeLinecap="round" />)}</g></svg>}
                    <Persona x={0} y={0} h={560} t={t} seed={260 + i} ropa={VIK(i + 1)} casco="vikingo" barba={barbaDe(i + 1)} expr="enojado" flip={i === 1} bD={60 + golpe * 100} cD={20} bI={30}
                      manoD={<g transform="rotate(180)"><rect x={-8} y={-10} width={16} height={140} fill="#8a5a32" /><rect x={-34} y={120} width={68} height={44} rx={8} fill="#6e4a2a" stroke="#2a1530" strokeWidth={5} /></g>} />
                  </div>;
                })}
              </>
            );
          })()}
        </MapaN>
        <Ch t={t} t0={162.9} text="IRELAND" color={C.lima} tinta={C.noche} x={120} y={150} size={70} />
        <Ch t={t} t0={164.4} text="BIGGER SCALE" color={C.violeta} x={120} y={265} size={52} />
        <G t={t} t0={167.2} text="LONGPHORT" x={1380} y={250} size={130} color={C.crema} />
        <Ch t={t} t0={168.8} text="= SHIP FORTRESS" color={C.ambar} tinta={C.noche} x={1380} y={390} centro size={60} />
      </Escena>
      {/* E032 · 841, la laguna negra: vikingos remando y la primera estaca… el pueblo crece… hoy se llama Dublín */}
      <Escena t={t} t0={170.86} t1={179.46} entra="iris" ix={960} iy={700} golpes={[172.9, 174.6, 177.6]}>
        {(() => {
          // barrido de 0,4 s (174,6→175,0): a la izquierda de la franja ya es el pueblo de día; a la derecha, la noche del 841
          const w = prog(t, 174.6, 175.0);
          const laguna = (
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              <rect x={0} y={780} width={1920} height={300} fill="#3a5a4a" />
              <ellipse cx={900} cy={890} rx={560} ry={90} fill="#0c1430" />
              {Array.from({ length: 10 }, (_, i) => <rect key={i} x={500 + i * 80 + Math.sin(t + i) * 10} y={880 + (i % 3) * 18} width={50} height={5} fill="#6a8ad8" opacity={0.5} />)}
            </svg>
          );
          const golpe = t > 172.6 ? Math.abs(Math.sin(t * 7)) : 0;
          const hund = prog(t, 172.6, 174.4);
          return (
            <>
              {w < 1 && (
                <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${w * 100}%)` }}>
                  <AbsoluteFill style={{ background: "linear-gradient(180deg, #16123d, #3a2a7a 70%)" }} />
                  {laguna}
                  {[[620, 880, 0], [1060, 900, 1]].map(([x, y, i]) => {
                    const ax = x + (1 - prog(t, 170.9, 172.6)) * (i ? 300 : -300);
                    return (
                      <div key={i} style={{ position: "absolute", left: 0, top: 0 }}>
                        {[-1, 0, 1].map((k) => <Persona key={k} x={ax + k * 110} y={y - 20} h={190} t={t} seed={270 + i * 3 + k} ropa={VIK(k + 2 + i)} casco="vikingo" barba={barbaDe(k + 2)} expr="enojado" flip={i === 1} bD={50 + Math.sin(t * 5 + k) * 40} cD={30} bI={50 + Math.sin(t * 5 + k) * 40} cI={30} />)}
                        <Drakkar x={ax} y={y} s={0.36} t={t} remos={1} flip={i === 1} />
                      </div>
                    );
                  })}
                  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                    <path d={`M 1480 ${900 - 150 + hund * 60} L 1480 ${900} L 1510 ${900} L 1510 ${900 - 150 + hund * 60} L 1495 ${900 - 175 + hund * 60} Z`} fill="#a8794a" stroke="#2a1530" strokeWidth={6} />
                    {t > 172.6 && golpe > 0.9 && <path d={`M 1495 ${730 + hund * 60} m -40 -10 l -20 -10 m 60 0 l 20 -10 m -40 -10 l 0 -20`} stroke="#ffd36a" strokeWidth={6} strokeLinecap="round" />}
                  </svg>
                  <Persona x={1640} y={930} h={340} t={t} seed={275} ropa={VIK(0)} casco="vikingo" barba={barbaDe(0)} expr="enojado" flip bD={60 + golpe * 110} cD={20} bI={40}
                    manoD={<g transform="rotate(180)"><rect x={-8} y={-10} width={16} height={150} fill="#8a5a32" /><rect x={-36} y={130} width={72} height={48} rx={8} fill="#6e4a2a" stroke="#2a1530" strokeWidth={5} /></g>} />
                </AbsoluteFill>
              )}
              {w > 0 && (
                <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
                  <AbsoluteFill style={{ background: "linear-gradient(180deg, #e88a5a, #ffd08a 70%)" }} />
                  {laguna}
                  <CrecePueblo t={t} t0={174.7} t1={177.4} x={960} y={790} />
                  {t > 175.0 && [[0, 1.2, 300, 860], [1, -1.0, 1640, 1180]].map(([i, v, a, b]) => {
                    const x = interpolate(t, [175.0, 179.46], [a, b]);
                    return <Persona key={i} x={x} y={1010} h={300} t={t} seed={290 + i} ropa={CIVIL(i + 2)} mujer={i === 1} expr="feliz" flip={v < 0} camina={1.3} bD={i === 0 ? 40 : 8} manoD={i === 0 ? <rect x={-30} y={0} width={60} height={46} rx={6} fill="#c9a66b" stroke="#2a1530" strokeWidth={5} /> : undefined} />;
                  })}
                </AbsoluteFill>
              )}
              {w > 0 && w < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${w * 100}% - 12px)`, width: 24, background: "#fff3d6", boxShadow: "0 0 30px #fff3d6" }} />}
            </>
          );
        })()}
        <G t={t} t0={171.2} t1={174.4} text="841" x={960} y={160} size={120} color={C.ambar} />
        <Ch t={t} t0={172.4} t1={174.55} text="DUBH LINN · “BLACK POOL”" color={C.violeta} x={760} y={300} centro size={48} />
        {t > 172.4 && t < 174.55 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><path d={`M 760 340 Q 780 ${560} 820 ${560 + 220 * prog(t, 172.6, 173.1)}`} stroke="#fff3d6" strokeWidth={8} fill="none" strokeDasharray="18 12" strokeLinecap="round" opacity={0.85} /></svg>}
        <Ch t={t} t0={174.6} t1={177.4} text="A TRADING TOWN" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
        <G t={t} t0={177.6} text="DUBLIN" y={230} size={200} color={C.crema} />
      </Escena>
      {/* E033 · antes de dar un paso, ya eligieron el campo de batalla: vos tenés que ir hacia ellos */}
      <Escena t={t} t0={179.46} t1={186.78} zoom={0} entra="corte" golpes={[183.4]}>
        {(() => {
          const ida = prog(t, 180.4, 181.0), vuelta = prog(t, 181.3, 182.0);
          const dx = ida * 70 - vuelta * 70;
          return (
            <Mundo t={t} cam={cam} luna={[1770, 170, 72]} yo={t < 183.0
              ? <><Yo t={t} expr={t > 181.2 ? "miedo" : "neutro"} dx={dx} camina={(t > 180.4 && t < 182.0) ? 1.3 : 0} />{t > 181.25 && t < 182.6 && <Emote t={t} t0={181.25} tipo="sudor" x={1480 + dx} y={gy(1480 + dx) + 40 - 270} s={0.6} />}</>
              : (() => {
                // el chico sigue la flecha: queda en x≈300 de pantalla (h≥300) mientras la cámara avanza, y se frena en seco a los 185,6
                const wx = Math.max(1480, cam.x + (380 - 960) / cam.z);
                const anda = wx > 1481 && t < 185.6;
                const frena = t > 185.6;
                const hh = 330 * Math.max(1, 310 / (330 * cam.z));
                return (
                  <>
                    <Persona x={wx} y={gy(wx) + 40} h={hh} t={t} seed={3} ropa={SAJON} expr={frena ? "miedo" : "enojado"} camina={anda ? 1.5 : 0}
                      inclina={frena ? (t < 185.75 ? -18 : -10) : anda ? 8 : 0} mira={frena ? 0.2 : 0.9}
                      bD={frena ? 150 : 100} cD={frena ? 30 : 0} bI={frena ? 150 : 20} cI={frena ? 30 : 10} manoI={frena ? undefined : <LanzaMano a={-20} />} />
                    <PastoAlto x0={600} x1={2000} t={t} dy={14} alto={170} />
                    {frena && t < 186.2 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{[-1, 1].map((d) => [0, 1, 2].map((k) => { const q = prog(t, 185.6, 186.2); return <circle key={`${d}${k}`} cx={wx + d * (30 + q * 90 + k * 20) / cam.z} cy={gy(wx) + 40 - (q * 40 + k * 10) / cam.z} r={(14 - q * 8) / cam.z} fill="#9ab0c0" opacity={1 - q} />; }))}</svg>}
                    {frena && <Emote t={t} t0={185.62} tipo="susto" x={wx} y={gy(wx) + 40 - hh * 0.85} s={0.6 / cam.z} />}
                  </>
                );
              })()}>
              {t > 184.6 && (
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                  <path d={`M 2780 ${gy(2780) - 220} Q 3350 560 4000 680`} stroke={C.ambar} strokeWidth={30} fill="none" pathLength={1000} style={{ strokeDasharray: `${prog(t, 184.6, 186.4) * 1000} 1000` }} strokeLinecap="round" />
                </svg>
              )}
            </Mundo>
          );
        })()}
        <Ch t={t} t0={179.0} t1={183.2} text="0 STEPS TAKEN" color={C.violeta} x={120} y={150} size={76} />
        <G t={t} t0={183.4} text="THEY CHOSE THE BATTLEFIELD" x={900} y={120} size={76} color={C.crema} />
        <Ch t={t} t0={184.8} text="YOU COME TO THEM" color={C.rojo} x={960} y={250} centro size={64} />
        <Ch t={t} t0={185.6} text="STEPS: 0" color={C.violeta} x={300} y={990} centro size={52} />
      </Escena>
    </AbsoluteFill>
  );
};

void Ciudad; void Hacha; void Iglesia; void Zzz; void Flash; void Globo; void rangoNoUsado;
function rangoNoUsado() { return interpolate(0, [0, 1], [0, 1]); }
