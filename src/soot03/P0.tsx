import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Rayos, Emote, cabeza, Pergamino, Aguila, Casa } from "./kit";
import { Craneo } from "./kit2";
import { BRIT, IRL } from "./T6";
import { TOP, MC, K, Cam, Pal, pant, Plano, Relampago } from "./mundo";
import { Multitud } from "./escenas4";
import { Yo, Otro, Picto, Ojos, Rayitas, Pin, DiplomaBronce, Gr, Cu, Sale, Actua } from "./kit3";
import { Sala } from "./sets";

// GANCHO (0-48,3 s): tormenta de noche en el muro → recuerdo de Bélgica dentro del ojo → la cámara sale hasta ver
// el muro entero de mar a mar → el norte que odia → la lluvia → el trato (25 años = 9.131 días) → la ciudadanía →
// la fila de "no exactamente romanos" → el águila que cae → el mapa de las 7 trampas sobre los 7 milecastles.
export const YX = 380; // dónde está parado el protagonista al principio
const CAB = cabeza(YX, TOP, 230);
const FILA = [2500, 2740, 2980, 3220, 3460, 3700];

export const keys0: K[] = [
  [0, YX + 10, 412, 4.7], [1.2, YX + 10, 414, 4.3], [4.0, YX + 10, 420, 3.9], [5.6, YX + 40, 470, 1.9], [7.0, 700, 540, 0.7],
  [8.2, 3000, 600, 0.22], [9.9, 19000, 700, 0.03], [13.6, 19000, 700, 0.034], [14.4, 1700, 470, 0.6], [16.2, 1300, 470, 0.72],
  [16.9, 640, 520, 1.25], [17.9, YX + 30, 480, 2.0], [18.8, YX + 160, 470, 1.6], [20.4, YX + 140, 560, 1.05], [22.4, YX + 120, 560, 1.15],
  [23.1, YX + 10, 450, 2.3], [24.6, YX + 60, 440, 1.75], [26.6, YX + 80, 450, 1.55], [27.4, 1400, 500, 0.9], [28.7, 3100, 520, 0.85],
  [31.8, 3100, 500, 1.0], [33.6, 3100, 480, 0.9], [37.0, 3450, 470, 0.95], [38.5, 3500, 470, 1.0], [39.7, 3000, 455, 1.9], [41.4, 2980, 460, 2.1],
  [42.6, 9000, 520, 0.3], [44.2, 22000, 500, 0.042], [47.0, 22000, 480, 0.044], [48.4, MC(1), 520, 0.62],
];
export const amb0: [number, Pal][] = [[0, "tormenta"], [27, "noche"], [42, "tormenta"]];
export const lluvia0: [number, number][] = [[0, 0.95], [13.8, 0.95], [14.4, 0.35], [17.6, 0.35], [17.9, 0.8], [20, 0.45], [27, 0.2], [42, 0.5]];
export const rayos0 = [0.05, 6.08, 15.9, 23.6, 38.5];

const memoria = (t: number) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#4fb3e8,#bfe6f5 70%,#fff3d6)" }}>
    <Rayos t={t} x={1500} y={240} op={0.18} />
    <div style={{ position: "absolute", left: 1400, top: 140, width: 200, height: 200, borderRadius: "50%", background: "#fff2b0", boxShadow: "0 0 90px #ffe27a" }} />
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <path d="M -10 700 Q 400 600 900 690 T 1930 650 L 1930 1080 L -10 1080 Z" fill="#7fc24a" />
      <path d="M -10 800 Q 500 760 960 820 T 1930 790 L 1930 930 Q 1400 900 960 950 T -10 940 Z" fill="#3d8fd6" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${((i * 420 + t * 160) % 2200) - 200} 860 q 40 -16 80 0 t 80 0`} stroke="#bfe6ff" strokeWidth={8} fill="none" strokeLinecap="round" />)}
      <path d="M -10 940 Q 600 900 1930 960 L 1930 1080 L -10 1080 Z" fill="#5fa23a" />
    </svg>
    <Casa x={360} y={720} s={1.1} techo="#b5452c" />
    <Casa x={640} y={700} s={0.85} tono="#f0c79a" techo="#8a3a2a" />
    <Casa x={1660} y={700} s={0.9} techo="#9a4a2a" />
    <Yo x={1060} y={1030} h={420} t={t} casco={false} expr="feliz" bD={130 + Math.sin(t * 12) * 25} cD={30} />
  </AbsoluteFill>
);

// ── mundo (capa f=1)
export const W0: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t > 49.5) return null;
  const vivo = t < 27.4 || t > 46;
  return (
    <>
      {/* cartel ROMA ← 1.000 millas */}
      {t > 4.0 && t < 14 && (
        <div style={{ position: "absolute", left: 640, top: TOP - 250, transform: `scale(${ent(t, 4.08)}) rotate(${Math.sin((t - 4.08) * 13) * Math.exp(-(t - 4.08) * 2.2) * 9}deg)`, transformOrigin: "50% 100%" }}>
          <svg width={260} height={250} style={{ overflow: "visible" }}><rect x={120} y={60} width={18} height={190} fill="#6b3a1f" /><path d="M 10 30 L 60 0 L 250 0 L 250 70 L 60 70 Z" fill="#c98f4a" stroke="#6b3a1f" strokeWidth={6} /><text x={150} y={32} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#2a1530">ROME</text><text x={150} y={60} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill="#7a2a1a">1,000 MILES</text></svg>
        </div>
      )}
      {/* rayitas de conteo en la piedra: 25 años */}
      <Rayitas t={t} t0={20.4} t1={22.3} n={25} x={YX + 150} y={TOP + 60} s={0.9} />
      {vivo && (
        <Yo x={YX} y={TOP} t={t} frio
          expr={t < 1.3 ? "sorpresa" : t > 4.08 && t < 5.5 ? "sorpresa" : t < 7 ? "miedo" : t < 15.3 ? "neutro" : t < 16.6 ? "miedo" : t < 18.6 ? "triste" : t < 23 ? "neutro" : t < 24.6 ? "miedo" : t < 27 ? "feliz" : "orgullo"}
          mira={t > 4.08 && t < 5.5 ? 0.9 : t < 14 ? 0.3 : t < 16.6 ? 0.1 : 0.5} miraY={t > 14.3 && t < 16.6 ? -1 : 0} salta={t > 25.8 ? 25.86 : t > 4.08 && t < 5.2 ? 4.12 : t >= 5.5 && t < 6.4 ? 5.52 : undefined}
          bD={t > 4.08 && t < 5.5 ? 108 + Math.sin(t * 9) * 5 : t >= 5.5 && t < 7.0 ? 138 : t > 24.6 && t < 27.2 ? 150 : 14}
          cD={t > 4.08 && t < 5.5 ? 6 : t >= 5.5 && t < 7.0 ? 122 : t > 24.6 && t < 27.2 ? 20 : 10}
          bI={t >= 5.5 && t < 7.0 ? 138 : undefined} cI={t >= 5.5 && t < 7.0 ? 122 : undefined}
          inclina={t >= 5.5 && t < 7.0 ? -5 + Math.sin(t * 38) * 2 : 0}
          habla={t > 46 || (t > 4.08 && t < 5.5)} />
      )}
      {t > 33.5 && t < 37.8 && <div style={{ position: "absolute", left: 2100, top: TOP - 520, width: 2000, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,214,122,.9) 0%, rgba(255,160,80,.5) 40%, transparent 70%)", opacity: prog(t, 33.5, 34.0) * (1 - prog(t, 37.3, 37.8)) }} />}
      {/* la fila de los que no eran exactamente romanos */}
      {t > 27 && t < 47 && FILA.map((x, i) => (
        <Otro key={i} i={i} x={x} y={TOP} t={t} aparece={28.62 + i * 0.12}
          sombra={t > 33.64 && t < 37.6 ? "#1b1240" : undefined}
          expr={i === 2 && t > 39.78 ? "enojado" : t > 31.8 ? "sorpresa" : "neutro"} mira={(i - 2.5) * -0.15}
          bD={i === 2 && t > 39.78 ? 70 : 10} bI={i === 2 && t > 39.78 ? 70 : 8} cD={i === 2 && t > 39.78 ? 60 : 10} cI={i === 2 && t > 39.78 ? 60 : 10}
          inclina={i === 2 && t > 39.78 ? 8 : 0} />
      ))}
      {t > 31.8 && t < 33.6 && FILA.map((x, i) => <Emote key={i} t={t} t0={31.9 + i * 0.08} tipo="preg" {...cabeza(x, TOP, 230)} s={0.45} />)}
      {t > 35.26 && t < 37.6 && FILA.map((x, i) => <Emote key={i} t={t} t0={35.3 + i * 0.07} tipo="preg" {...cabeza(x, TOP, 230)} s={0.45} />)}
      {/* el águila de Roma clavada en el muro, que cae cuando Roma se rinde */}
      {t > 27 && t < 44 && (
        <div style={{ position: "absolute", left: 3880, top: TOP - 280, width: 1, height: 1, transformOrigin: "0 280px", transform: `rotate(${prog(t, 38.46, 39.3) * 96}deg) translateY(${prog(t, 39.0, 39.6) * 120}px)` }}>
          <Aguila x={0} y={0} s={0.45} />
        </div>
      )}
      {/* pines de las 7 trampas sobre los milecastles */}

    </>
  );
};
// ── capa norte (f=0.62): colinas de los que te odian
export const N0: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 14 || t > 32.5 || (t > 16.9 && t < 30.2)) return null;
  const baja = t > 30 ? prog(t, 30.5, 31.2) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${baja * 260}px)` }}>
      {Array.from({ length: 9 }, (_, i) => <Picto key={i} x={(t > 30 ? 1700 : 460) + i * 190 + (i % 2) * 40} y={360 + (i % 3) * 24} s={1.15 + (i % 3) * 0.15} t={t} seed={i + 2} sube={t > 30 ? 30.2 : 15.38 + i * 0.07} grita={t < 17 || t > 30.4} />)}
      {Array.from({ length: 6 }, (_, i) => t < 17 ? <Ojos key={i} x={520 + i * 190} y={250 + (i % 2) * 40} t={t} t0={15.3 + i * 0.05} s={0.8} seed={i} /> : null)}
    </div>
  );
};

// ── pantalla
export const S0: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t > 49.5) return null;
  const ojo = pant(YX + 20, CAB.y + 0, c);
  return (
    <>
      {/* pines de las 7 trampas sobre los milecastles: en PANTALLA (en el mundo eran de escala 26 = capas de ~4700 px que
          tiraban a Chrome en el farm); se van antes del zoom a MC(1) */}
      {t > 44 && t < 47.75 && <div style={{ position: "absolute", inset: 0, opacity: 1 - prog(t, 47.3, 47.7) }}>{["POSTING", "WEATHER", "SUPPLY", "BOREDOM", "NEIGHBORS", "THE NORTH", "THE END"].map((ic, i) => {
        const [px, py] = pant(MC(i + 1), TOP - 520, c);
        return <Pin key={i} t={t} t0={44.34 + i * 0.3} n={i + 1} x={px} y={py} s={26 * c.z} icono={ic} act={t > 46.98 && i === 0} />;
      })}</div>}
      <Relampago t={t} t0={0.05} x={1500} /><Relampago t={t} t0={6.08} x={420} /><Relampago t={t} t0={23.6} x={1650} />
      {/* 0-1,3: tenés 19 */}
      <Sale t={t} t0={0.22} t1={1.3}><Chip t={t} t0={0.22} text="YOU. AGE: 19" color={C.rojo} x={960} y={930} centro size={92} /></Sale>
      {/* el recuerdo de Bélgica, dentro del ojo */}
      <Plano t={t} t0={1.32} t1={3.95} desde={[ojo[0], ojo[1]]}>
        {memoria(t)}
        <Chip t={t} t0={2.18} text="A RIVER" color={C.teal} tinta={C.noche} x={960} y={760} centro size={56} />
        <Chip t={t} t0={3.1} text="BELGIUM" color={C.ambar} tinta={C.noche} x={960} y={230} centro size={96} />
      </Plano>
      <Gr t={t} w="end of the world" d={4} txt="THE END OF THE WORLD" y={170} size={120} c={C.crema} dur={1.2} />
      <Sale t={t} t0={7.0} t1={8.1}><Chip t={t} t0={7.0} text="IT'S A WALL." color={C.violeta} x={960} y={150} centro size={80} /></Sale>
      {/* 73 millas de mar a mar: el cuello de Britania (×3) con el muro que se dibuja de costa a costa */}
      <Plano t={t} t0={8.2} t1={13.75} fondo="#1b3a6a"><MapaCuello t={t} /></Plano>
      <Cu t={t} w="73 miles" d={7} de={0} a={73} sube={1.0} dur={5.3} y={330} size={190} suf=" MILES" color={C.ambar} />
      <Sale t={t} t0={10.54} t1={13.8}><Chip t={t} t0={10.54} text="IRISH SEA" color={C.teal} tinta={C.noche} x={420} y={700} centro size={58} /></Sale>
      <Sale t={t} t0={10.9} t1={13.8}><Chip t={t} t0={10.9} text="NORTH SEA" color={C.teal} tinta={C.noche} x={1330} y={470} centro size={58} /></Sale>
      <Gr t={t} w="cold" d={11} txt="COLD." x={700} y={850} size={130} c="#bfe6ff" dur={1.4} />
      <Gr t={t} w="wet neck" d={11} txt="WET." x={1220} y={850} size={130} c="#7fd6ff" dur={0.9} />
      <Sale t={t} t0={12.4} t1={13.75}><Chip t={t} t0={12.4} text="NORTHERN BRITAIN" color={C.violeta} x={760} y={960} centro size={64} /></Sale>
      {/* el otro lado / tu lado */}
      <Sale t={t} t0={14.42} t1={16.6}><Chip t={t} t0={14.42} text="↑ THE OTHER SIDE" color="#2a2350" x={960} y={110} centro size={60} /></Sale>
      <Plano t={t} t0={15.25} t1={16.72} fondo="#120c30"><Contraplano t={t} t0={15.25} /></Plano>
      <Sale t={t} t0={15.6} t1={16.6}><Chip t={t} t0={15.6} text="PEOPLE WHO HATE YOU" color={C.rojo} x={500} y={960} centro size={80} /></Sale>
      <Sale t={t} t0={16.86} t1={17.7}><Chip t={t} t0={16.86} text="↓ YOUR SIDE" color={C.teal} tinta={C.noche} x={960} y={960} centro size={60} /></Sale>
      {/* la nube personal */}
      {t > 17.6 && t < 18.9 && (() => { const [nx, ny] = pant(YX, CAB.y - 260, c); const e = ent(t, 17.6); return (
        <svg style={{ position: "absolute", left: nx - 330, top: ny - 160, overflow: "visible", transform: `scale(${e})` }} width={660} height={700}>
          {Array.from({ length: 22 }, (_, i) => { const k = (t * 2.6 + i * 0.137) % 1; const x = 120 + ((i * 97) % 420); return <line key={i} x1={x} y1={170 + k * 520} x2={x - 10} y2={210 + k * 520} stroke="#9fd0ff" strokeWidth={10} strokeLinecap="round" />; })}
          <g fill="#4a4f6a"><ellipse cx={330} cy={150} rx={260} ry={80} /><ellipse cx={220} cy={110} rx={130} ry={90} /><ellipse cx={420} cy={90} rx={150} ry={110} /></g>
        </svg>
      ); })()}
      <Gr t={t} w="rain" d={17} txt="RAIN." y={180} size={170} c="#bfe6ff" dur={1.0} />
      {/* el trato (0:20) + «si seguís vivo» (0:23): plano medio en el cuarto de guardia, tilda con el dedo */}
      <Plano t={t} t0={18.7} t1={24.5} fondo="#141030"><Trato t={t} /></Plano>
      {/* la ciudadanía */}
      {t > 24.64 && t < 27.1 && <Rayos t={t} x={1400} y={430} color="#ffe27a" op={0.2} />}
      <Sale t={t} t0={24.64} t1={27.0}><div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - prog(t, 24.64, 25.3)) * -500}px)` }}><DiplomaBronce x={1400} y={430} t={t} t0={24.64} abre={prog(t, 25.1, 25.8)} s={0.9} /></div></Sale>
      <Sale t={t} t0={25.86} t1={27.0}><Chip t={t} t0={25.86} text="★ ROMAN CITIZEN ★" color={C.oro} tinta={C.noche} x={1400} y={780} centro size={64} /></Sale>
      <Emote t={t} t0={25.9} t1={27} tipo="brillos" {...(() => { const [x, y] = pant(YX, CAB.y, c); return { x, y }; })()} s={c.z * 0.4} />
      {/* de dónde venían los de la fila */}
      <Plano t={t} t0={28.55} t1={33.5} fondo="#0e0a28"><Multitud t={t} t0={28.6} tSenal={30.34} tDuda={31.8} tLab={31.2} labels={["BELGIUM", "SYRIA", "SPAIN", "IRAQ", "HOLLAND", "MOROCCO"]} /></Plano>
      {t > 33.5 && t < 35.2 && ["BELGIUM", "SYRIA", "SPAIN", "IRAQ", "HOLLAND", "MOROCCO"].map((n, i) => { const [x, y] = pant(FILA[i], TOP - 330 - (i % 2) * 70, c); return <Chip key={n} t={t} t0={31.2 + i * 0.12} text={n} color={[C.ambar, C.rojo, C.teal, C.violeta, C.lima, C.naranja][i]} tinta={i === 0 || i === 2 || i === 4 ? C.noche : "#fff"} x={x} y={y} centro size={Math.max(26, 40 * c.z)} />; })}
      {/* la parte rara */}
      <Sale t={t} t0={27.04} t1={28.5}><Chip t={t} t0={27.2} text="THE STRANGE PART" color={C.violeta} x={960} y={150} centro size={76} /></Sale>
      <Sale t={t} t0={30.46} t1={31.7}><Chip t={t} t0={30.46} text="KEEPING THE BARBARIANS OUT" color="#2a2350" x={960} y={140} centro size={62} /></Sale>
      <Gr t={t} w="not exactly romans" d={30} txt="NOT EXACTLY ROMANS" y={170} size={110} c={C.ambar} dur={1.7} />
      <Sale t={t} t0={33.9} t1={35.1}><Chip t={t} t0={33.9} text="BY THE END OF THIS VIDEO" color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} /></Sale>
      <Gr t={t} w="who they really were" d={34} txt="WHO WERE THEY?" y={170} size={120} c={C.crema} dur={2.2} />
      <Sale t={t} t0={38.0} t1={39.6}><Chip t={t} t0={38.0} text="ROME GIVES UP" color={C.rojo} x={960} y={150} centro size={70} /></Sale>
      <Gr t={t} w="refused to leave" d={38} txt="THEY REFUSED TO LEAVE" y={180} size={110} c={C.crema} dur={1.1} />
      <Sale t={t} t0={41.94} t1={42.7}><Chip t={t} t0={41.94} text="BUT FIRST..." color={C.violeta} x={960} y={150} centro size={70} /></Sale>
      <Gr t={t} w="survive it" d={41} txt="SURVIVE IT." y={540} size={180} c={C.rojo} borde="#fff" dur={0.95} />
      <Gr t={t} w="seven traps" d={43} txt="7 TRAPS" y={840} size={150} c={C.ambar} dur={2.4} />
      <Sale t={t} t0={47.18} t1={48.2}><Chip t={t} t0={47.18} text="LET'S GET YOU POSTED" color={C.teal} tinta={C.noche} x={960} y={950} centro size={66} /></Sale>
    </>
  );
};
export { Grande, interpolate };

// 0:10 · el cuello de Britania con relieve: sombra exterior, sombra interior por clip, espuma en la costa;
// el muro se dibuja ESTE → OESTE con la paleta de albañil en la punta; el soldado entero señala, explica y tirita.
const MapaCuello: React.FC<{ t: number }> = ({ t }) => {
  const z = 3 - 0.25 * prog(t, 8.2, 13.7);
  const u = prog(t, 8.35, 9.9);
  const ex = 1098, ey = 518, wx = 872, wy = 524;
  const px = ex + (wx - ex) * u, py = ey + (wy - ey) * u;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #3d7fc9, #1b3a6a 85%)" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <defs>
          <clipPath id="p0brit"><path d={BRIT} /></clipPath>
          <clipPath id="p0irl"><path d={IRL} /></clipPath>
        </defs>
        <g transform={`translate(985 640) scale(${z}) translate(-985 -522)`}>
          {/* sombra exterior (relieve) */}
          <path d={IRL} fill="#0c2448" opacity={0.55} transform="translate(5 8)" />
          <path d={BRIT} fill="#0c2448" opacity={0.55} transform="translate(5 8)" />
          {/* espuma */}
          <path d={IRL} fill="none" stroke="#bfe6ff" strokeWidth={5 + Math.sin(t * 3) * 1.5} opacity={0.5} />
          <path d={BRIT} fill="none" stroke="#bfe6ff" strokeWidth={5 + Math.sin(t * 3) * 1.5} opacity={0.5} />
          <path d={IRL} fill="#5f8a4a" />
          <path d={BRIT} fill="#7fa05a" />
          {/* sombra interior y luz del borde */}
          <path d={BRIT} fill="none" stroke="#3f6a2a" strokeWidth={16} opacity={0.55} clipPath="url(#p0brit)" transform="translate(3 4)" />
          <path d={IRL} fill="none" stroke="#3a5a2a" strokeWidth={16} opacity={0.55} clipPath="url(#p0irl)" transform="translate(3 4)" />
          <path d={BRIT} fill="none" stroke="#c9e09a" strokeWidth={3} opacity={0.8} clipPath="url(#p0brit)" transform="translate(-2 -2)" />
          {/* colinas del norte (relieve suave) */}
          <g clipPath="url(#p0brit)">{[[930, 470], [1000, 455], [960, 440], [1040, 480]].map(([x, y], i) => <path key={i} d={`M ${x - 22} ${y} Q ${x} ${y - 16} ${x + 22} ${y} Z`} fill="#5f8a3e" />)}</g>
          {/* el muro: de ESTE a OESTE, con sombra y almenas */}
          <path d={`M ${ex} ${ey + 3} L ${px} ${py + 3}`} stroke="#2a1e10" strokeWidth={7} strokeLinecap="round" opacity={0.5} />
          <path d={`M ${ex} ${ey} L ${px} ${py}`} stroke="#f6efe2" strokeWidth={6} strokeLinecap="round" />
          {[0, 1, 2, 3, 4, 5, 6].map((k) => { const kx = ex - 12 - k * 34, on = prog(t, 8.4 + ((ex - kx) / (ex - wx)) * 1.55, 8.55 + ((ex - kx) / (ex - wx)) * 1.55); return <rect key={k} x={kx - 4} y={ey + (wy - ey) * ((ex - kx) / (ex - wx)) - 8 - on * 2} width={8} height={10} fill="#b89a6a" stroke="#6a4a2a" strokeWidth={1.2} opacity={on} />; })}
          {u > 0 && u < 1 && <g transform={`translate(${px} ${py})`}><circle r={7 + Math.sin(t * 30) * 1.5} fill="#ffe27a" opacity={0.85} /><circle r={3} fill="#fff" /></g>}
          {/* gotitas de lluvia que caen sobre el norte */}
          {t > 12.1 && Array.from({ length: 10 }, (_, k) => { const q = ((t - 12.1) * 1.6 + k * 0.1) % 1; const x = 880 + (k * 23) % 230; return <line key={k} x1={x} y1={430 + q * 120} x2={x - 3} y2={438 + q * 120} stroke="#cfe8ff" strokeWidth={2.2} opacity={0.9} />; })}
        </g>
        {Array.from({ length: 14 }, (_, k) => { const q = ((t - 8.2) * 0.35 + k / 14) % 1; return <path key={k} d={`M ${(k % 2 ? 200 : 1480) + (k * 37) % 200} ${300 + (k * 61) % 600 + Math.sin(t + k) * 8} q 20 -10 40 0 t 40 0`} stroke="#9fd0ff" strokeWidth={5} fill="none" opacity={0.6 * Math.sin(q * Math.PI)} />; })}
      </svg>
      <Actua t={t} x0={1711} x1={1710} y={990} h={430} frio
        beats={[[8.2, "sorpresa"], [8.7, "señala"], [10.0, "habla"], [11.0, "señala"], [12.1, "tiembla"], [13.2, "encoge"]]} />
      {/* vaho: respira frío al tiritar */}
      {t > 12.1 && [0, 1, 2].map((k) => { const q = ((t - 12.1) * 0.9 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 1560 - q * 110, top: 660 - q * 40, width: 40 + q * 60, height: 30 + q * 40, borderRadius: "50%", background: "#eaf6ff", opacity: 0.55 * (1 - q) }} />; })}
    </AbsoluteFill>
  );
};

// picto visto DE ESPALDAS (contraplano): pelo en punta, espalda pintada con espirales, lanza y puño que se agitan
const PictoEsp: React.FC<{ x: number; y: number; h: number; t: number; seed: number; pose: 0 | 1 | 2 }> = ({ x, y, h, t, seed, pose }) => {
  const S = h / 560, ph = seed * 1.7;
  const sac = Math.sin(t * 7 + ph);
  const brD = pose === 0 ? -150 + sac * 12 : pose === 1 ? -120 + Math.abs(sac) * -40 : -60 + sac * 10;
  const brI = pose === 2 ? -150 + sac * 20 : -30 + Math.sin(t * 5 + ph) * 10;
  const bob = Math.abs(Math.sin(t * 6 + ph)) * -8;
  return (
    <svg style={{ position: "absolute", left: x - 300 * S, top: y - 640 * S, overflow: "visible" }} width={600 * S} height={680 * S} viewBox="-300 -640 600 680">
      <ellipse cx={0} cy={0} rx={130} ry={22} fill="#000" opacity={0.3} />
      <g transform={`translate(0 ${bob}) rotate(${Math.sin(t * 3 + ph) * 3} 0 -200)`}>
        {[-1, 1].map((k) => <rect key={k} x={k * 30 - 22} y={-200} width={44} height={196} rx={18} fill="#1d1838" />)}
        <path d="M -95 -340 Q -110 -200 -80 -170 L 80 -170 Q 110 -200 95 -340 Q 60 -380 0 -382 Q -60 -380 -95 -340 Z" fill="#2a2350" />
        <path d="M -50 -320 q 30 20 0 50 q -30 30 10 60 M 40 -330 q -30 30 0 60 q 26 26 -6 56" stroke="#4fb0d8" strokeWidth={10} fill="none" strokeLinecap="round" />
        <rect x={-92} y={-196} width={184} height={26} rx={8} fill="#6b3a1f" />
        {/* brazo derecho (lanza o puño) */}
        <g transform={`translate(80 -350) rotate(${brD})`}>
          <line x1={0} y1={0} x2={0} y2={130} stroke="#2a2350" strokeWidth={42} strokeLinecap="round" />
          {pose === 0 && <g transform="translate(0 140)"><rect x={-7} y={-260} width={14} height={380} fill="#5a3418" /><path d="M -14 -260 L 0 -320 L 14 -260 Z" fill="#c8ccd4" /></g>}
          {pose === 1 && <circle cx={0} cy={140} r={30} fill="#2a2350" />}
          {pose === 2 && <circle cx={0} cy={140} r={28} fill="#2a2350" />}
        </g>
        <g transform={`translate(-80 -350) rotate(${-brI})`}>
          <line x1={0} y1={0} x2={0} y2={130} stroke="#2a2350" strokeWidth={42} strokeLinecap="round" />
          {pose === 2 ? <g transform="translate(0 140)"><rect x={-7} y={-240} width={14} height={340} fill="#5a3418" /><path d="M -14 -240 L 0 -300 L 14 -240 Z" fill="#c8ccd4" /></g> : <circle cx={0} cy={140} r={28} fill="#2a2350" />}
        </g>
        {/* cabeza de atrás: pelo en punta */}
        <circle cx={0} cy={-450} r={92} fill="#2a2350" />
        <path d="M -96 -440 Q -110 -540 -60 -520 Q -50 -580 -10 -546 Q 10 -600 36 -540 Q 80 -580 80 -510 Q 120 -520 96 -440 Q 60 -400 0 -398 Q -60 -400 -96 -440 Z" fill="#a0602c" />
        <path d="M -60 -430 L -70 -380 M 60 -430 L 70 -380" stroke="#7a4a22" strokeWidth={12} strokeLinecap="round" />
      </g>
    </svg>
  );
};
// 0:16 · contraplano: tres pictos enormes de espaldas, en primer término, miran al soldadito del muro al fondo
const Contraplano: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#120c30,#2a2160 60%,#3a2f6a)" }}>
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {/* el muro al fondo, del lado de ellos */}
      <rect x={-20} y={560} width={1960} height={120} fill="#7a7290" />
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 84} y={536} width={50} height={30} fill="#7a7290" />)}
      {Array.from({ length: 6 }, (_, r) => Array.from({ length: 24 }, (_, c) => <rect key={r + "-" + c} x={c * 84 - (r % 2) * 42} y={566 + r * 19} width={80} height={16} fill="none" stroke="#5e5778" strokeWidth={2} />))}
      <rect x={380} y={430} width={140} height={250} fill="#857d9c" />
      {[0, 1, 2].map((i) => <rect key={i} x={384 + i * 48} y={410} width={34} height={26} fill="#857d9c" />)}
      <path d="M 0 680 Q 500 650 960 690 T 1920 670 L 1920 1080 L 0 1080 Z" fill="#1d3a2a" />
      <path d="M 0 760 Q 700 720 1920 780 L 1920 1080 L 0 1080 Z" fill="#162c20" />
      {/* lluvia */}
      {Array.from({ length: 50 }, (_, i) => { const q = ((t * 1.4 + i * 0.137) % 1); const x = (i * 97) % 1960; return <line key={i} x1={x} y1={q * 1100 - 40} x2={x - 10} y2={q * 1100} stroke="#9fb6e8" strokeWidth={3} opacity={0.45} />; })}
    </svg>
    {/* el soldadito, chiquito, en el muro */}
    <Yo x={700} y={540} h={150} t={t} frio expr="miedo" bD={120} bI={120} cD={110} cI={110} mira={0.4} />
    {/* tus vecinos, en primer término */}
    <PictoEsp x={1180} y={1120} h={520} t={t} seed={1} pose={0} />
    <PictoEsp x={1470} y={1150} h={580} t={t} seed={2} pose={1} />
    <PictoEsp x={1770} y={1110} h={500} t={t} seed={3} pose={2} />
    {/* gritos */}
    {t > t0 + 0.3 && [1310, 1620].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 400 + Math.sin(t * 9 + i) * 6, fontFamily, fontWeight: 700, fontSize: 56, color: "#ffd1d1", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, t0 + 0.3 + i * 0.2)}) rotate(${i ? 8 : -8}deg)` }}>{i ? "OI!" : "GRR!"}</div>)}
  </AbsoluteFill>
);

// 0:20-0:24 · EL TRATO: el soldado (plano medio) lee el contrato colgado en la pared del cuarto de guardia y tilda cada
// renglón con el dedo cuando lo dice la voz; raya los días en la piedra; en «si seguís vivo» se le cae la cara,
// aparece la calavera y la barra de supervivencia se vacía.
const Trato: React.FC<{ t: number }> = ({ t }) => {
  const L = [
    { txt: "25 YEARS", t0: 20.42, ok: true },
    { txt: "ON THIS WALL", t0: 21.3, ok: true },
    { txt: "IF STILL ALIVE", t0: 23.3, ok: false },
    { txt: "THEN: ROMAN ★", t0: 99, ok: true },
  ];
  const caida = prog(t, 23.2, 23.6);
  const dias = Math.round(1 + 9130 * prog(t, 20.42, 22.3));
  return (
    <AbsoluteFill>
      <Sala t={t} tono="noche" ventana="izq" estante={false} />
      {/* tormenta en la ventana */}
      {Array.from({ length: 12 }, (_, i) => { const q = ((t * 1.5 + i * 0.21) % 1); return <div key={i} style={{ position: "absolute", left: 190 + (i * 23) % 260, top: 160 + q * 340, width: 3, height: 22, background: "#bcd0ff", opacity: 0.7, transform: "rotate(12deg)" }} />; })}
      {/* rayitas de los días, rayadas en la piedra */}
      <Rayitas t={t} t0={20.42} t1={22.3} n={25} x={170} y={600} s={0.62} />
      {t > 20.42 && t < 22.5 && <div style={{ position: "absolute", left: 120, top: 860, padding: "6px 18px", borderRadius: 14, background: "#2a1530", border: "5px solid #fff", fontFamily, fontWeight: 700, fontSize: 46, color: "#fff", transform: `scale(${ent(t, 20.42)})` }}>DAY <span style={{ color: C.ambar }}>{dias.toLocaleString("en-US")}</span></div>}
      {/* el contrato clavado en la pared */}
      <div style={{ position: "absolute", left: 1010, top: 150, width: 720, height: 660, transform: `scale(${ent(t, 18.85)}) rotate(${-1.5 + (t > 23.3 ? Math.sin((t - 23.3) * 30) * Math.exp(-(t - 23.3) * 5) * 3 : 0)}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(16px,16px)", background: "rgba(0,0,0,.35)", borderRadius: 16 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#fbeccb,#efd8a8)", border: "8px solid #8a5a2a", borderRadius: 16 }} />
        <div style={{ position: "absolute", left: 340, top: -18, width: 36, height: 36, borderRadius: "50%", background: "#c81d2e", border: "5px solid #6a1018" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 70, color: "#5a3418", letterSpacing: 2 }}>THE DEAL</div>
        {L.map((l, i) => {
          const on = t > l.t0;
          const e = on ? ent(t, l.t0, 0, { damping: 9, stiffness: 240 }) : 0;
          const gris = i === 3 ? 0.45 : 1;
          return (
            <div key={i} style={{ position: "absolute", left: 50, top: 160 + i * 112, height: 90, width: 620, display: "flex", alignItems: "center", gap: 26, opacity: gris }}>
              <div style={{ width: 76, height: 76, borderRadius: 14, border: "7px solid #5a3418", background: "#fff8e6", position: "relative", flexShrink: 0 }}>
                {on && <div style={{ position: "absolute", left: -8, top: -26, fontFamily, fontWeight: 700, fontSize: 96, lineHeight: "96px", color: l.ok ? "#2e9b5a" : C.rojo, transform: `scale(${e})` }}>{l.ok ? "✓" : "?"}</div>}
              </div>
              <div style={{ fontFamily, fontWeight: 700, fontSize: 52, color: !l.ok && on ? C.rojo : "#3a2418", whiteSpace: "nowrap" }}>{l.txt}</div>
            </div>
          );
        })}
        {/* firma */}
        <svg style={{ position: "absolute", left: 360, top: 590 }} width={300} height={50}><path d="M 10 30 q 30 -30 50 0 t 50 0 t 50 -10 t 60 10" stroke="#2a1530" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${prog(t, 19.3, 20.1)} 1`} /></svg>
      </div>
      {/* el soldado: entra, lee, tilda con el dedo, y se le cae la cara */}
      <Actua t={t} x0={-150} x1={720} y={1000} h={540} frio
        beats={[[18.7, "camina"], [19.5, "lee"], [20.36, "señala"], [21.22, "golpea"], [22.24, "habla"], [23.08, "señala"], [23.32, "miedo"], [23.95, "tiembla"]]} />
      {/* gota de sudor cuando se le cae la cara */}
      {t > 23.35 && <div style={{ position: "absolute", left: 800 + 0 * caida, top: 380 + ((t - 23.35) * 120) % 60, width: 26, height: 36, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#9fd0ff", border: "4px solid #2a1530" }} />}
      {/* calavera + barra de supervivencia que se vacía */}
      <Sale t={t} t0={23.3} t1={24.5}><Craneo x={1640} y={590} t={t} t0={23.3} s={1.05} rot={Math.sin(t * 10) * 6} /></Sale>
      {t > 23.3 && (
        <div style={{ position: "absolute", left: 1050, top: 850, width: 700, height: 104, borderRadius: 55, background: "#2a1530", border: "7px solid #fff", overflow: "hidden", transform: `scale(${ent(t, 23.3)})` }}>
          <div style={{ width: `${100 - 82 * prog(t, 23.5, 24.4)}%`, height: "100%", background: `linear-gradient(90deg, ${C.rojo}, #ff8a5a)` }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, fontFamily, fontWeight: 700, fontSize: 48, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill" }}>
            SURVIVAL ODDS <span style={{ color: C.ambar }}>{Math.round(100 - 82 * prog(t, 23.5, 24.4))}%</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
