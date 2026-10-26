import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Rayos, Emote, cabeza, Pergamino, Aguila, Casa } from "./kit";
import { Craneo } from "./kit2";
import { TOP, MC, K, Cam, Pal, pant, Plano, Relampago } from "./mundo";
import { Yo, Otro, Picto, Ojos, Rayitas, Pin, DiplomaBronce, Gr, Cu, Sale } from "./kit3";

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
        <div style={{ position: "absolute", left: 640, top: TOP - 250, transform: `scale(${ent(t, 4.08)})`, transformOrigin: "50% 100%" }}>
          <svg width={260} height={250} style={{ overflow: "visible" }}><rect x={120} y={60} width={18} height={190} fill="#6b3a1f" /><path d="M 10 30 L 60 0 L 250 0 L 250 70 L 60 70 Z" fill="#c98f4a" stroke="#6b3a1f" strokeWidth={6} /><text x={150} y={32} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#2a1530">ROME</text><text x={150} y={60} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill="#7a2a1a">1,000 MILES</text></svg>
        </div>
      )}
      {/* rayitas de conteo en la piedra: 25 años */}
      <Rayitas t={t} t0={20.4} t1={22.3} n={25} x={YX + 150} y={TOP + 60} s={0.9} />
      {vivo && (
        <Yo x={YX} y={TOP} t={t} frio
          expr={t < 1.3 ? "sorpresa" : t < 7 ? "miedo" : t < 15.3 ? "neutro" : t < 16.6 ? "miedo" : t < 18.6 ? "triste" : t < 23 ? "neutro" : t < 24.6 ? "miedo" : t < 27 ? "feliz" : "orgullo"}
          mira={t < 14 ? 0.3 : t < 16.6 ? 0.1 : 0.5} miraY={t > 14.3 && t < 16.6 ? -1 : 0} salta={t > 25.8 ? 25.86 : undefined}
          bD={t > 24.6 && t < 27.2 ? 150 : 14} cD={t > 24.6 && t < 27.2 ? 20 : 10} habla={t > 46} />
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
      {Array.from({ length: 9 }, (_, i) => <Picto key={i} x={(t > 30 ? 1700 : 560) + i * 130 + (i % 2) * 40} y={330 + (i % 3) * 18} s={0.6 + (i % 3) * 0.1} t={t} seed={i + 2} sube={t > 30 ? 30.2 : 15.38 + i * 0.07} grita={t < 17 || t > 30.4} />)}
      {Array.from({ length: 6 }, (_, i) => t < 17 ? <Ojos key={i} x={520 + i * 190} y={250 + (i % 2) * 40} t={t} t0={15.3 + i * 0.05} s={0.8} seed={i} /> : null)}
    </div>
  );
};

// ── pantalla
export const S0: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t > 49.5) return null;
  const ojo = pant(YX + 20, CAB.y + 0, c);
  const [mx0] = pant(-9000, 600, c);
  const [mx1] = pant(47000, 600, c);
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
      {/* 73 millas de mar a mar */}
      {t > 8.2 && t < 13.8 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <line x1={mx0} y1={430} x2={mx0 + (mx1 - mx0) * prog(t, 8.22, 9.3)} y2={430} stroke="#fff" strokeWidth={8} strokeDasharray="20 14" />
          <line x1={mx0} y1={400} x2={mx0} y2={460} stroke="#fff" strokeWidth={8} />
          {t > 9.3 && <line x1={mx1} y1={400} x2={mx1} y2={460} stroke="#fff" strokeWidth={8} />}
        </svg>
      )}
      <Cu t={t} w="73 miles" d={7} de={0} a={73} sube={1.0} dur={5.3} y={330} size={190} suf=" MILES" color={C.ambar} />
      <Sale t={t} t0={10.54} t1={13.8}><Chip t={t} t0={10.54} text="IRISH SEA" color={C.teal} tinta={C.noche} x={Math.max(170, mx0)} y={700} centro size={50} /></Sale>
      <Sale t={t} t0={10.9} t1={13.8}><Chip t={t} t0={10.9} text="NORTH SEA" color={C.teal} tinta={C.noche} x={Math.min(1750, mx1)} y={700} centro size={50} /></Sale>
      <Gr t={t} w="cold" d={11} txt="COLD." x={700} y={850} size={130} c="#bfe6ff" dur={1.4} />
      <Gr t={t} w="wet neck" d={11} txt="WET." x={1220} y={850} size={130} c="#7fd6ff" dur={0.9} />
      <Sale t={t} t0={13.22} t1={14.25}><Chip t={t} t0={13.22} text="NORTHERN BRITAIN" color={C.violeta} x={960} y={960} centro size={64} /></Sale>
      {/* el otro lado / tu lado */}
      <Sale t={t} t0={14.42} t1={16.6}><Chip t={t} t0={14.42} text="↑ THE OTHER SIDE" color="#2a2350" x={960} y={110} centro size={60} /></Sale>
      <Sale t={t} t0={15.6} t1={16.6}><Chip t={t} t0={15.6} text="PEOPLE WHO HATE YOU" color={C.rojo} x={960} y={960} centro size={80} /></Sale>
      <Sale t={t} t0={16.86} t1={17.7}><Chip t={t} t0={16.86} text="↓ YOUR SIDE" color={C.teal} tinta={C.noche} x={960} y={960} centro size={60} /></Sale>
      {/* la nube personal */}
      {t > 17.6 && t < 18.9 && (() => { const [nx, ny] = pant(YX, CAB.y - 260, c); const e = ent(t, 17.6); return (
        <svg style={{ position: "absolute", left: nx - 330, top: ny - 160, overflow: "visible", transform: `scale(${e})` }} width={660} height={700}>
          {Array.from({ length: 22 }, (_, i) => { const k = (t * 2.6 + i * 0.137) % 1; const x = 120 + ((i * 97) % 420); return <line key={i} x1={x} y1={170 + k * 520} x2={x - 10} y2={210 + k * 520} stroke="#9fd0ff" strokeWidth={10} strokeLinecap="round" />; })}
          <g fill="#4a4f6a"><ellipse cx={330} cy={150} rx={260} ry={80} /><ellipse cx={220} cy={110} rx={130} ry={90} /><ellipse cx={420} cy={90} rx={150} ry={110} /></g>
        </svg>
      ); })()}
      <Gr t={t} w="rain" d={17} txt="RAIN." y={180} size={170} c="#bfe6ff" dur={1.0} />
      {/* el trato */}
      {t > 18.72 && t < 20.4 && <Pergamino x={1450} y={520} w={520} abre={prog(t, 18.72, 19.3) * 0.75} titulo="THE DEAL" lineas={6} firma={prog(t, 19.5, 20.2)} />}
      {t > 18.9 && t < 20.4 && ["25 YEARS ✓", "LOW PAY ✓", "CITIZENSHIP ✓"].map((k, i) => <Chip key={k} t={t} t0={19.0 + i * 0.35} text={k} color={i === 2 ? C.oro : "#fff"} tinta={C.noche} x={1450} y={430 + i * 90} centro size={46} />)}
      <Cu t={t} w="25 years" d={19} de={0} a={25} sube={0.8} dur={2.6} x={1380} y={330} size={210} suf=" YEARS" color={C.ambar} />
      <Cu t={t} w="years on this wall" d={19} de={1} a={9131} sube={1.7} dur={2.0} x={1380} y={520} size={80} pre="DAY " color="#fff" dt={0.2} />
      {t > 20.4 && t < 22.4 && <AbsoluteFill style={{ background: "#0b0826", opacity: 0.35 * (0.5 + 0.5 * Math.sin(t * 40)) }} />}
      <Sale t={t} t0={23.08} t1={24.5}><Craneo x={1460} y={460} t={t} t0={23.08} s={1.5} rot={Math.sin(t * 10) * 6} /></Sale>
      {t > 23.1 && t < 24.5 && (
        <div style={{ position: "absolute", left: 1160, top: 640, width: 600, height: 54, borderRadius: 27, background: "#2a1530", border: "6px solid #fff", overflow: "hidden" }}>
          <div style={{ width: `${100 - 78 * prog(t, 23.2, 24.2)}%`, height: "100%", background: `linear-gradient(90deg, ${C.rojo}, #ff8a5a)` }} />
          <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 32, lineHeight: "42px", color: "#fff" }}>SURVIVAL ODDS</div>
        </div>
      )}
      <Sale t={t} t0={23.46} t1={24.5}><Chip t={t} t0={23.46} text="IF YOU'RE STILL ALIVE" color={C.rojo} x={960} y={950} centro size={70} /></Sale>
      {/* la ciudadanía */}
      {t > 24.64 && t < 27.1 && <Rayos t={t} x={1400} y={430} color="#ffe27a" op={0.2} />}
      <Sale t={t} t0={24.64} t1={27.0}><div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - prog(t, 24.64, 25.3)) * -500}px)` }}><DiplomaBronce x={1400} y={430} t={t} t0={24.64} abre={prog(t, 25.1, 25.8)} s={0.9} /></div></Sale>
      <Sale t={t} t0={25.86} t1={27.0}><Chip t={t} t0={25.86} text="★ ROMAN CITIZEN ★" color={C.oro} tinta={C.noche} x={1400} y={780} centro size={64} /></Sale>
      <Emote t={t} t0={25.9} t1={27} tipo="brillos" {...(() => { const [x, y] = pant(YX, CAB.y, c); return { x, y }; })()} s={c.z * 0.4} />
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
