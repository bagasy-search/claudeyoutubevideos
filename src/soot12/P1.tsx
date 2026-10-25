import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CIVIL } from "./persona";
import { C, ent, prog, Escena, Rayos, Particulas, Emote, cabeza, Zzz } from "./kit";
import { Lapida, Ciudad } from "./kit2";
import { Mundo, camEn, Key, PastoAlto, SAJON, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Globo, Cuenta, Sello, Flash, LanzaMano, MapaN, Nieve, lugarN } from "./comun";
import { Isla, PlanoRepton, Reloj24, CrecePueblo, Hallazgo } from "./escenas";
import { Corona, Drakkar, Tienda, Fogata, Plata, Ficha, Hacha, Iglesia } from "./vik";

// 51,6-186,8 s · TRAMPA 1: EL LUGAR. Del mundo al mapa (las estrellas se vuelven puntos), Thanet, Sheppey, Torksey
// (los hallazgos saltan del suelo), el plano en D de Repton, el reloj de 16 h de noche, el rey Burgred que se va a Roma,
// Dublín que crece desde el longphort, y vuelta al mundo: «ya eligieron el campo de batalla».
export const CAM1: Key[] = [
  [51.56, 1300, 450, 0.9], [53.76, 1330, 430, 1.15],
  [53.77, 2900, 380, 0.55], [56.24, 3700, 360, 0.62],
  [72.62, 1650, 470, 1.6], [74.5, 2300, 520, 1.0], [77.38, 4300, 560, 0.55],
  [127.16, 7500, 640, 0.75], [130.32, 7900, 700, 0.9],
  [130.33, 6200, 560, 0.5], [135.2, 2400, 500, 0.62],
  [147.16, 1420, 470, 1.9], [150.3, 1380, 470, 2.0], [154.5, 1250, 470, 1.6],
  [161.14, 1480, 470, 2.6], [162.96, 1480, 470, 2.8],
  [179.46, 1480, 480, 2.2], [182.0, 1700, 500, 1.2], [186.78, 3600, 520, 0.6],
];

const Yo: React.FC<{ t: number; expr?: "miedo" | "feliz" | "sorpresa" | "enojado" | "neutro" | "triste"; pie?: boolean }> = ({ t, expr = "miedo", pie }) => (
  <>
    <Persona x={1480} y={gy(1480) + 40} h={330} t={t} seed={3} ropa={SAJON} expr={expr} bD={30} cD={20} mira={-0.3} manoD={<LanzaMano a={50} inclina={-14} />} />
    <PastoAlto x0={600} x1={2000} t={t} dy={14} alto={170} />
    {pie && <Persona x={1480} y={gy(1480) - 30} h={1} t={t} />}
  </>
);

export const P1: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM1);
  const L = (x: number, y: number, h: number) => cabeza(x, y, h);
  // cámara del mapa (coordenadas del mapa)
  const mapa: Key[] = [
    [56.24, 900, 560, 1.0], [59.8, 700, 680, 1.9], [63.1, 760, 620, 1.6], [64.4, 950, 540, 1.05], [68.6, 820, 600, 1.3], [72.62, 673, 654, 6.5],
  ];
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 1: EL LUGAR (la cámara llega a la loma) */}
      <Escena t={t} t0={51.56} t1={53.77} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} yo={<Yo t={t} />} />
        <Cartel t={t} t0={51.6} t1={53.77} n={1} nombre="THE PLACE" />
      </Escena>
      {/* 1 · invierno del 873: nieve sobre el campamento */}
      <Escena t={t} t0={53.77} t1={56.24} zoom={0} entra="barrido" banda={C.teal}>
        <Mundo t={t} cam={cam} />
        <Nieve t={t} n={110} />
        <G t={t} t0={54.4} text="873 AD" y={230} size={200} color={C.crema} />
        <Ch t={t} t0={55.0} text="WINTER" color={C.teal} tinta={C.noche} x={960} y={400} centro size={70} />
      </Escena>
      {/* 2 · las estrellas se vuelven mapa: Mercia, el centro de Inglaterra · los vikingos eran un cuento de la costa · el Gran Ejército */}
      <Escena t={t} t0={56.24} t1={72.62} zoom={0} entra="zoom">
        <MapaN t={t} cam={mapa} enciende={[56.3, 58.0]} desde="NORWAY"
          zona={[{ n: "MERCIA", t0: 57.6, r: 70, color: C.lima }]}
          pulsa={[{ n: "MERCIA", t0: 57.8, color: C.lima, label: "MERCIA", lado: "izq" }, { n: "REPTON", t0: 70.2, color: C.rojo, label: "REPTON", lado: "der" }]}
          rutas={[{ de: "DENMARK", a: "EASTANGLIA", t0: 64.6, color: C.rojo, curva: 80, dur: 1.2, ancho: 14 }, { de: "EASTANGLIA", a: "REPTON", t0: 67.6, color: C.rojo, curva: 40, dur: 1.2, ancho: 14 }]}>
          {/* barquitos alrededor de la costa: «un cuento de la costa» */}
          {t > 60 && t < 64.5 && [[620, 500, 0], [820, 620, 1], [860, 760, 2], [560, 800, 3]].map(([x, y, i]) => (
            <div key={i} style={{ position: "absolute", left: x + Math.sin(t * 2 + i) * 14, top: y, transform: `translate(-50%,-50%) scale(${0.08 * ent(t, 60.2 + i * 0.25)})` }}><Drakkar x={0} y={0} s={1} t={t} vela={1} /></div>
          ))}
        </MapaN>
        <Ch t={t} t0={56.6} t1={64.4} text="A FARMER" color={C.lima} tinta={C.noche} x={120} y={130} size={60} />
        <Ch t={t} t0={58.2} t1={64.4} text="THE MIDDLE OF ENGLAND" color={C.violeta} x={120} y={240} size={48} />
        <Ch t={t} t0={60.2} t1={63.0} text="VIKINGS? JUST A STORY FROM THE COAST" color={C.teal} tinta={C.noche} x={960} y={960} centro size={50} />
        <Ch t={t} t0={64.6} text="THE BIGGEST VIKING FORCE EVER SEEN" color={C.rojo} x={960} y={110} centro size={58} />
        <G t={t} t0={67.0} t1={72.0} text="THE GREAT ARMY" y={960} size={120} color={C.ambar} />
        <Ch t={t} t0={70.9} text="RIGHT NEXT TO THE CHURCH" color={C.violeta} x={960} y={230} centro size={50} />
      </Escena>
      {/* 3 · desde la loma: no eligieron ese lugar por casualidad */}
      <Escena t={t} t0={72.62} t1={77.38} zoom={0} entra="iris" ix={960} iy={540}>
        <Mundo t={t} cam={cam} yo={<Yo t={t} expr="sorpresa" />} />
        <Ch t={t} t0={73.2} text="FROM THE HILL…" color={C.violeta} x={120} y={140} size={56} />
        <Sello t={t} t0={76.0} text="NOT BY ACCIDENT" x={1250} y={300} size={84} rot={-8} />
      </Escena>
      {/* 4 · no acampaban como vos: acampaban como marineros */}
      <Escena t={t} t0={77.38} t1={81.1} entra="diag" golpes={[79.6]}>
        <AbsoluteFill style={{ background: "#16123d" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, bottom: 0, background: "linear-gradient(180deg, #2a3a7a, #2f6450 70%)", overflow: "hidden" }}>
          <Tienda x={430} y={620} s={0.9} k={2} t={t} />
          <Persona x={700} y={900} h={420} t={t} seed={3} ropa={SAJON} expr="feliz" />
          <Ch t={t} t0={77.6} text="YOU" color={C.lima} tinta={C.noche} x={480} y={110} centro size={64} />
          <Ch t={t} t0={78.3} text="ANY FIELD" color={C.violeta} x={480} y={990} centro size={46} />
        </div>
        <div style={{ position: "absolute", left: 960, top: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, #2a3a7a, #1d4f7a 62%)", overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - ent(t, 79.4)) * 100}%)` }}>
          <Drakkar x={480} y={770} s={0.62} t={t} vela={1} />
          <Tienda x={300} y={520} s={0.7} k={0} t={t} luz />
          <Persona x={700} y={600} h={360} t={t} seed={201} ropa={VIK(1)} casco="vikingo" barba={barbaDe(1)} expr="orgullo" />
          <Ch t={t} t0={79.6} text="VIKINGS" color={C.rojo} x={480} y={110} centro size={64} />
          <Ch t={t} t0={80.0} text="LIKE SAILORS" color={C.teal} tinta={C.noche} x={480} y={990} centro size={46} />
        </div>
        <div style={{ position: "absolute", left: 952, top: 0, width: 16, bottom: 0, background: "#fff" }} />
      </Escena>
      {/* 5 · casi siempre en un río, muy seguido en una isla */}
      <Escena t={t} t0={81.1} t1={85.72} entra="sube" golpes={[82.6, 84.4]}>
        <Isla t={t} t0={83.6} />
        <Ch t={t} t0={82.6} text="ON A RIVER" color={C.teal} tinta={C.noche} x={960} y={110} centro size={66} />
        <G t={t} t0={84.4} text="ON AN ISLAND" y={240} size={120} color={C.ambar} />
      </Escena>
      {/* 6 · Thanet (851), Sheppey, Torksey: el mapa con cámara */}
      <Escena t={t} t0={85.72} t1={100.46} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[85.72, 700, 700, 2.0], [88.5, 790, 760, 4.2], [92.4, 790, 760, 4.4], [94.4, 760, 700, 3.0], [96.0, 711, 617, 4.6], [100.4, 711, 617, 5.2]]} desde="NORWAY"
          pulsa={[{ n: "THANET", t0: 89.6, color: C.ambar, label: "THANET", lado: "der" }, { n: "SHEPPEY", t0: 92.6, color: C.teal, label: "SHEPPEY", lado: "aba" }, { n: "TORKSEY", t0: 96.2, color: C.rojo, label: "TORKSEY", lado: "der" }]} />
        <G t={t} t0={86.4} t1={92.3} text="851" y={200} size={210} color={C.ambar} />
        <Ch t={t} t0={87.6} t1={92.3} text="FIRST WINTER IN ENGLAND" color={C.violeta} x={960} y={360} centro size={56} />
        <Ch t={t} t0={92.6} t1={94.4} text="A FEW YEARS LATER" color={C.teal} tinta={C.noche} x={960} y={180} centro size={56} />
        <Ch t={t} t0={94.8} text="THE WINTER BEFORE REPTON" color={C.rojo} x={960} y={150} centro size={56} />
        <Ch t={t} t0={97.6} text="HIGH GROUND · MARSH · WATER" color={C.teal} tinta={C.noche} x={960} y={950} centro size={52} />
      </Escena>
      {/* 7 · lo midieron: más de 50 hectáreas, más grande que casi cualquier pueblo inglés */}
      <Escena t={t} t0={100.46} t1={106.72} entra="iris" ix={960} iy={600} golpes={[104.3]}>
        <Isla t={t} t0={100.5} juncos />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <line x1={420} y1={610} x2={420 + 1080 * prog(t, 101.0, 102.2)} y2={610} stroke={C.ambar} strokeWidth={14} strokeDasharray="40 14" />
          <line x1={420} y1={590} x2={420} y2={630} stroke={C.ambar} strokeWidth={10} />
          {t > 102.2 && <line x1={1500} y1={590} x2={1500} y2={630} stroke={C.ambar} strokeWidth={10} />}
        </svg>
        <Cuenta t={t} t0={102.4} de={0} a={50} dur={1.2} y={200} size={230} prefijo="" sufijo="+" />
        <Ch t={t} t0={103.0} text="HECTARES" color={C.rojo} x={960} y={350} centro size={64} />
        {/* comparación: un pueblo inglés chiquito */}
        {t > 104.3 && (
          <div style={{ position: "absolute", left: 1500, top: 880, transform: `translate(-50%,-50%) scale(${ent(t, 104.3)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <svg width={200} height={110}><rect x={30} y={50} width={60} height={50} fill="#e8b98a" stroke="#2a1530" strokeWidth={5} /><path d="M 20 50 L 60 14 L 100 50 Z" fill="#b5452c" stroke="#2a1530" strokeWidth={5} /><rect x={110} y={60} width={50} height={40} fill="#f0c79a" stroke="#2a1530" strokeWidth={5} /><path d="M 102 60 L 135 30 L 168 60 Z" fill="#9a3a2a" stroke="#2a1530" strokeWidth={5} /></svg>
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 40, color: "#fff", background: C.violeta, padding: "2px 16px", borderRadius: 10 }}>AN ENGLISH TOWN</div>
          </div>
        )}
        <Sello t={t} t0={105.0} text="BIGGER" x={560} y={880} size={80} color={C.ambar} rot={-6} />
      </Escena>
      {/* 8 · no era sólo un campamento: el detector y lo que salta del suelo */}
      <Escena t={t} t0={106.72} t1={117.84} zoom={0.05} entra="corte" golpes={[113.5, 114.6, 115.8, 116.9]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #7ec8e8, #c8e8f2 55%)" }} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <rect x={0} y={700} width={1920} height={380} fill="#6a8a3a" />
          <rect x={0} y={740} width={1920} height={340} fill="#7a5a3a" />
          {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={(i * 137) % 1920} cy={800 + (i * 53) % 260} rx={18} ry={9} fill="#5e4428" />)}
          {/* ondas del detector */}
          {t > 108.4 && [0, 1, 2].map((i) => { const q = ((t * 1.6 + i / 3) % 1); return <ellipse key={i} cx={interpolate(t, [108.4, 117.8], [520, 1500])} cy={760} rx={40 + q * 160} ry={12 + q * 40} fill="none" stroke="#fff3c4" strokeWidth={6} opacity={1 - q} />; })}
        </svg>
        <Persona x={interpolate(t, [107, 117.8], [300, 1300])} y={720} h={520} t={t} seed={61} ropa={CIVIL(1)} expr="feliz" camina={0.6} bD={70} cD={10}
          manoD={<g transform="rotate(-70)"><rect x={-6} y={0} width={12} height={260} fill="#3b3048" /><ellipse cx={0} cy={270} rx={60} ry={18} fill="#2a2a40" stroke={C.ambar} strokeWidth={6} /></g>} />
        <Ch t={t} t0={107.0} text="NOT JUST A CAMP" color={C.violeta} x={960} y={110} centro size={60} />
        <Ch t={t} t0={109.6} text="HUNDREDS OF FINDS" color={C.rojo} x={960} y={220} centro size={56} />
        <Hallazgo t={t} t0={113.5} x={620} y={760}><svg width={180} height={180} viewBox="-90 -90 180 180"><circle r={70} fill="#dfe6f2" stroke="#5e6a80" strokeWidth={10} /><circle r={40} fill="none" stroke="#5e6a80" strokeWidth={6} /></svg></Hallazgo>
        <Ch t={t} t0={113.6} text="COINS" color={C.teal} tinta={C.noche} x={620} y={380} centro size={38} />
        <Hallazgo t={t} t0={114.6} x={900} y={760}><div style={{ position: "relative", width: 360, height: 220 }}><Plata x={180} y={110} s={0.9} n={8} /></div></Hallazgo>
        <Ch t={t} t0={114.7} text="CHOPPED-UP SILVER" color={C.teal} tinta={C.noche} x={900} y={500} centro size={38} />
        <Hallazgo t={t} t0={115.8} x={1180} y={760}><svg width={160} height={160} viewBox="-80 -80 160 160"><path d="M -50 40 L -40 -30 L 40 -30 L 50 40 Z" fill="#8a8aa0" stroke="#2a1530" strokeWidth={8} /><circle cx={0} cy={-44} r={16} fill="none" stroke="#8a8aa0" strokeWidth={8} /></svg></Hallazgo>
        <Ch t={t} t0={115.9} text="LEAD WEIGHTS" color={C.teal} tinta={C.noche} x={1180} y={380} centro size={38} />
        <Hallazgo t={t} t0={116.9} x={1460} y={760}><div style={{ position: "relative", width: 140, height: 160 }}><Ficha x={70} y={80} s={1} /></div></Hallazgo>
        <Ch t={t} t0={117.0} text="GAMING PIECES" color={C.teal} tinta={C.noche} x={1460} y={500} centro size={38} />
      </Escena>
      {/* 9 · comerciaba, apostaba y contaba el botín */}
      <Escena t={t} t0={117.84} t1={123.26} entra="iris" ix={960} iy={700} golpes={[120.2, 121.2, 122.2]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #6a3a2a, #1d1020 80%)" }} />
        <Fogata x={960} y={760} s={1.1} t={t} />
        <Persona x={520} y={1030} h={520} t={t} seed={202} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr="feliz" habla bD={60} cD={60} />
        <Persona x={1400} y={1030} h={540} t={t} seed={203} ropa={VIK(3)} barba={barbaDe(3)} expr={t > 121.2 ? "orgullo" : "neutro"} flip bD={50} cD={70} />
        {/* tablero de juego + plata */}
        <svg style={{ position: "absolute", left: 760, top: 880 }} width={400} height={160}><rect x={0} y={20} width={400} height={120} rx={14} fill="#a8794a" stroke="#2a1530" strokeWidth={8} />{Array.from({ length: 9 }, (_, i) => <line key={i} x1={20 + i * 45} y1={30} x2={20 + i * 45} y2={130} stroke="#5e3a1e" strokeWidth={4} />)}</svg>
        {t > 120.4 && <Ficha x={880} y={900} s={0.5} t={t} t0={120.4} />}
        {t > 120.6 && <Ficha x={1020} y={900} s={0.5} t={t} t0={120.6} color="#d6283e" />}
        {t > 121.4 && <Particulas t={t} tipo="lluviaoro" n={40} seed={3} />}
        <Ch t={t} t0={118.0} text="NOT JUST SLEEPING" color={C.violeta} x={960} y={110} centro size={58} />
        <Ch t={t} t0={120.2} text="TRADED" color={C.teal} tinta={C.noche} x={300} y={300} size={70} />
        <Ch t={t} t0={121.2} text="GAMBLED" color={C.ambar} tinta={C.noche} x={760} y={300} size={70} />
        <Ch t={t} t0={122.2} text="COUNTED LOOT" color={C.rojo} x={1260} y={300} size={70} />
      </Escena>
      {/* 10 · Repton desde arriba: el río hecho muralla */}
      <Escena t={t} t0={123.26} t1={127.16} entra="zoom" golpes={[125.6]}>
        <PlanoRepton t={t} zanja={123.6} agua={125.4} />
        <Ch t={t} t0={123.5} text="THE RIVER TRENT" color={C.teal} tinta={C.noche} x={1150} y={140} size={56} />
        <G t={t} t0={125.6} text="WATER = WALL" x={1250} y={940} size={104} color={C.crema} />
      </Escena>
      {/* 11 · el río les cuida la espalda; los barcos en la orilla (mundo) */}
      <Escena t={t} t0={127.16} t1={130.32} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} />
        <Ch t={t} t0={127.4} text="BACK: COVERED ✓" color={C.lima} tinta={C.noche} x={120} y={140} size={60} />
        <Ch t={t} t0={128.9} text="SHIPS ON THE BANK" color={C.ambar} tinta={C.noche} x={120} y={250} size={56} />
      </Escena>
      {/* 12 · la única entrada: campo abierto, cuesta arriba, a oscuras (la cámara vuelve hacia la loma) */}
      <Escena t={t} t0={130.32} t1={135.2} zoom={0} entra="barrido" golpes={[132.6, 133.6, 134.4]}>
        <Mundo t={t} cam={cam} yo={<Yo t={t} />}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
            <path d={`M 1700 ${gy(1700) - 40} Q 2600 560 3400 ${gy(3400) - 60}`} stroke={C.rojo} strokeWidth={26} fill="none" strokeDasharray="60 40" pathLength={1000} style={{ strokeDasharray: `${prog(t, 130.6, 132.4) * 1000} 1000` }} strokeLinecap="round" />
          </svg>
        </Mundo>
        <AbsoluteFill style={{ background: `rgba(4,3,16,${prog(t, 134.2, 135.0) * 0.5})` }} />
        <Ch t={t} t0={130.5} text="THE ONLY WAY IN" color={C.rojo} x={960} y={110} centro size={64} />
        <Ch t={t} t0={132.6} text="OPEN GROUND" color={C.teal} tinta={C.noche} x={300} y={300} size={56} />
        <Ch t={t} t0={133.6} text="UPHILL" color={C.ambar} tinta={C.noche} x={800} y={300} size={56} />
        <Ch t={t} t0={134.4} text="IN THE DARK" color={C.violeta} x={1180} y={300} size={56} />
      </Escena>
      {/* 13 · es invierno: el sol se va antes de las 4 · 16 horas de oscuridad */}
      <Escena t={t} t0={135.2} t1={143.72} entra="iris" ix={960} iy={540} golpes={[140.9]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a2a7a, #120e36 80%)" }} />
        <Nieve t={t} n={60} op={0.5} />
        <Reloj24 t={t} t0={135.4} horas={16} x={700} y={560} r={330} />
        <Ch t={t} t0={136.8} text="DECEMBER" color={C.teal} tinta={C.noche} x={1150} y={300} size={60} />
        <Ch t={t} t0={138.4} text="SUNSET: BEFORE 4 PM" color={C.ambar} tinta={C.noche} x={1150} y={420} size={52} />
        <Cuenta t={t} t0={140.9} de={0} a={16} dur={0.9} x={1450} y={640} size={240} color={C.crema} />
        <Ch t={t} t0={141.4} text="HOURS OF DARKNESS" color={C.violeta} x={1450} y={800} centro size={50} />
      </Escena>
      {/* 14 · muchas noches largas para prepararse: afilan hachas junto al fuego */}
      <Escena t={t} t0={143.72} t1={147.16} entra="barrido" golpes={[145.2]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 70%, #6a3a2a, #1d1020 80%)" }} />
        <Fogata x={960} y={720} s={1.2} t={t} />
        {[[420, 1, 1], [1500, 2, -1]].map(([x, sd, f]) => (
          <Persona key={sd} x={x} y={1040} h={560} t={t} seed={210 + sd} ropa={VIK(sd)} casco="vikingo" barba={barbaDe(sd)} expr="enojado" flip={f < 0} bD={70 + Math.sin(t * 9 + sd) * 25} cD={60}
            manoD={<g transform="rotate(130)"><rect x={-7} y={-140} width={14} height={240} fill="#8a5a32" /><path d="M 6 -140 Q 60 -170 72 -110 Q 76 -70 64 -40 Q 40 -80 6 -84 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} /></g>} />
        ))}
        {t > 145.2 && Math.sin(t * 9) > 0.6 && <Particulas t={t} tipo="brasas" n={20} seed={6} />}
        <Ch t={t} t0={144.0} text="LONG EVENINGS" color={C.violeta} x={960} y={110} centro size={60} />
        <G t={t} t0={145.2} text="GETTING READY FOR YOU" y={240} size={96} color={C.ambar} />
      </Escena>
      {/* 15 · tu rey ya decidió: Burgred mira el campamento… y se va (en el mismo mundo) */}
      <Escena t={t} t0={147.16} t1={155.64} zoom={0} entra="corte" golpes={[152.6]}>
        <Mundo t={t} cam={cam} yo={<>
          <Yo t={t} expr={t > 152 ? "sorpresa" : "neutro"} />
          {(() => {
            const sale = Math.max(0, t - 152.4);
            const x = 1330 - sale * 140;
            return (
              <>
                <Persona x={x} y={gy(x) + 30} h={360} t={t} seed={70} ropa={{ tunica: "#7a2a8a", tunica2: "#4a1a5a", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#6b3a1f" }} barba="#6b3a1f" expr={t < 151 ? "neutro" : t < 152.4 ? "miedo" : "sorpresa"} flip={t > 152.4} camina={t > 152.4 ? 1.6 : 0} aparece={148.2} mira={0.8} />
                {t > 148.2 && <Corona x={x} y={gy(x) + 30 - 360 * 1.02} s={0.55} t={t} t0={148.4} />}
              </>
            );
          })()}
        </>} />
        <Ch t={t} t0={147.6} text="YOUR OWN KING" color={C.violeta} x={120} y={140} size={60} />
        <Ch t={t} t0={150.4} text="BURGRED · KING OF MERCIA" color={C.ambar} tinta={C.noche} x={120} y={250} size={52} />
        <Sello t={t} t0={152.6} text="…AND LEFT" x={1300} y={260} size={90} rot={-6} />
        <Ch t={t} t0={154.5} text="TO ROME →" color={C.rojo} x={1350} y={400} centro size={60} />
      </Escena>
      {/* 16 · nunca volvió: murió allá, enterrado en el barrio inglés de Roma */}
      <Escena t={t} t0={155.64} t1={161.14} entra="iris" ix={960} iy={560} golpes={[157.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2a65a, #ffd98a)" }} />
        <Rayos t={t} x={960} y={300} color="#fff8d8" op={0.2} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {/* Roma: arcos y cúpulas */}
          <path d="M 0 760 L 1920 760 L 1920 1080 L 0 1080 Z" fill="#d98a4a" />
          {[200, 520, 1400, 1720].map((x, i) => <g key={i}><rect x={x - 90} y={520 - (i % 2) * 60} width={180} height={240 + (i % 2) * 60} fill="#f2c48a" stroke="#8a4a20" strokeWidth={6} /><path d={`M ${x - 90} ${520 - (i % 2) * 60} Q ${x} ${420 - (i % 2) * 60} ${x + 90} ${520 - (i % 2) * 60}`} fill="#e8a86a" stroke="#8a4a20" strokeWidth={6} />{[0, 1, 2].map((k) => <path key={k} d={`M ${x - 70 + k * 50} 760 L ${x - 70 + k * 50} 680 Q ${x - 50 + k * 50} 650 ${x - 30 + k * 50} 680 L ${x - 30 + k * 50} 760 Z`} fill="#8a4a20" />)}</g>)}
        </svg>
        <Lapida x={960} y={640} s={1.25} t={t} t0={156.0} lineas={["BURGRED", "KING OF MERCIA", "DIED IN ROME"]} />
        <Corona x={1230} y={930} s={0.7} t={t} t0={157.2} rot={24} />
        <Ch t={t} t0={155.8} text="NEVER CAME BACK" color={C.rojo} x={960} y={110} centro size={64} />
        <Ch t={t} t0={158.4} text="THE ENGLISH QUARTER OF ROME" color={C.violeta} x={960} y={980} centro size={50} />
      </Escena>
      {/* 17 · así que esta noche, depende de vos */}
      <Escena t={t} t0={161.14} t1={162.96} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} yo={<Yo t={t} expr="triste" />} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 18%, rgba(5,3,18,.75) 45%)" }} />
        <G t={t} t0={161.4} text="IT'S UP TO YOU" y={900} size={120} color={C.ambar} />
      </Escena>
      {/* 18 · Irlanda, en grande: el longphort, «fortaleza de barcos» */}
      <Escena t={t} t0={162.96} t1={170.86} zoom={0} entra="zoom">
        <MapaN t={t} cam={[[162.96, 680, 690, 2.0], [165.5, 449, 613, 3.2], [170.8, 449, 613, 3.6]]} desde="NORWAY"
          zona={[{ n: "IRELAND", t0: 163.6, r: 150, color: C.lima }]}
          pulsa={[{ n: "DUBLIN", t0: 166.4, color: C.ambar }]} />
        <Ch t={t} t0={163.3} text="IRELAND" color={C.lima} tinta={C.noche} x={120} y={140} size={70} />
        <Ch t={t} t0={164.4} text="BIGGER SCALE" color={C.violeta} x={120} y={260} size={52} />
        <G t={t} t0={167.2} text="LONGPHORT" x={1300} y={420} size={140} color={C.crema} />
        <Ch t={t} t0={168.8} text="= SHIP FORTRESS" color={C.ambar} tinta={C.noche} x={1300} y={570} centro size={60} />
      </Escena>
      {/* 19 · 841, una laguna oscura en el Liffey… el pueblo crece… hoy se llama Dublín */}
      <Escena t={t} t0={170.86} t1={179.46} entra="iris" ix={960} iy={700} golpes={[177.6]}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${t > 175 ? "#5aa8e0" : "#16123d"}, ${t > 175 ? "#bfe3f2" : "#3a2a7a"} 70%)` }} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <rect x={0} y={780} width={1920} height={300} fill="#3a5a4a" />
          <ellipse cx={960} cy={890} rx={520} ry={80} fill="#0c1430" />
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={560 + i * 80 + Math.sin(t + i) * 10} y={880 + (i % 3) * 18} width={50} height={5} fill="#6a8ad8" opacity={0.5} />)}
        </svg>
        {t < 175.5 && <Drakkar x={760} y={860} s={0.38} t={t} />}
        {t < 175.5 && <Drakkar x={1160} y={870} s={0.36} t={t} flip />}
        <CrecePueblo t={t} t0={174.0} t1={177.4} x={960} y={790} />
        <G t={t} t0={171.2} t1={174.0} text="841" y={240} size={220} color={C.ambar} />
        <Ch t={t} t0={172.4} t1={175.0} text="DUBH LINN · “BLACK POOL”" color={C.violeta} x={960} y={400} centro size={52} />
        <Ch t={t} t0={174.6} t1={177.4} text="A TRADING TOWN" color={C.teal} tinta={C.noche} x={960} y={160} centro size={60} />
        <G t={t} t0={177.6} text="DUBLIN" y={240} size={220} color={C.crema} />
      </Escena>
      {/* 20 · antes de dar un paso, ya eligieron el campo de batalla: vos tenés que ir hacia ellos */}
      <Escena t={t} t0={179.46} t1={186.78} zoom={0} entra="corte" golpes={[183.4]}>
        <Mundo t={t} cam={cam} yo={<Yo t={t} expr={t > 183 ? "miedo" : "neutro"} />}>
          {t > 184.6 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <path d={`M 1600 ${gy(1600) - 80} Q 2700 520 4000 680`} stroke={C.ambar} strokeWidth={30} fill="none" pathLength={1000} style={{ strokeDasharray: `${prog(t, 184.6, 186.4) * 1000} 1000` }} strokeLinecap="round" />
            </svg>
          )}
        </Mundo>
        <Ch t={t} t0={179.8} text="0 STEPS TAKEN" color={C.violeta} x={120} y={140} size={60} />
        <G t={t} t0={183.4} text="THEY CHOSE THE BATTLEFIELD" y={260} size={92} color={C.crema} />
        <Ch t={t} t0={184.8} text="YOU COME TO THEM" color={C.rojo} x={960} y={400} centro size={64} />
      </Escena>
    </AbsoluteFill>
  );
};

void Ciudad; void Hacha; void Iglesia; void Zzz; void Emote; void Flash; void Globo; void lugarN; void rangoNoUsado;
function rangoNoUsado() { return interpolate(0, [0, 1], [0, 1]); }
