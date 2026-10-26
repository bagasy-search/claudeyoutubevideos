import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Rayos, Zzz, Emote } from "./kit";
import { Mundo, camEn, Key, SAJON, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano } from "./comun";
import { Cita } from "./escenas";
import { Durmiente, EscudoR, Caballo, Tienda } from "./vik";

// 393,4-483,7 s · TRAMPA 4: LOS DURMIENTES. Entrás entre las tiendas con el viento en la cara; el Hávamál (nunca un paso
// lejos de tus armas); adentro de una tienda: el hacha al lado, el escudo en el poste; la guardia con el cuerno; 8 años de
// guerra; los berserkers; y el que se despierta ya parado.
export const CAM4: Key[] = [
  [393.39, 5300, 640, 0.6], [395.86, 4700, 760, 1.15], [401.0, 5000, 780, 1.4], [405.54, 5360, 800, 1.8], [408.89, 5390, 820, 3.0],
  [435.8, 6200, 700, 0.8], [438.13, 7100, 740, 1.4], [441.98, 7200, 760, 1.9], [444.68, 7230, 740, 2.4], [447.45, 7150, 760, 1.6],
  [447.46, 5400, 760, 1.3], [451.74, 5480, 780, 1.9],
];

const hacha = (rot = 130) => (
  <g transform={`rotate(${rot})`}><rect x={-7} y={-140} width={14} height={240} fill="#8a5a32" /><path d="M 6 -140 Q 60 -170 72 -110 Q 76 -70 64 -40 Q 40 -80 6 -84 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} /></g>
);

export const P4: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM4);
  const xyo = interpolate(t, [395.9, 405.4], [4560, 5250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 4 · tuviste suerte: perros lejos, viento en la cara, entre las tiendas, todos roncan */}
      <Escena t={t} t0={393.39} t1={408.89} zoom={0} entra="corte" golpes={[401.2]}>
        <Mundo t={t} cam={cam}>
          {t > 395.8 && <Persona x={xyo} y={gy(xyo) + 4} h={320} t={t} seed={3} ropa={SAJON} expr="miedo" inclina={22} camina={t < 405.4 ? 0.5 : 0} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />}
          {/* el viento en la cara */}
          {t > 398.4 && t < 405.4 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {Array.from({ length: 7 }, (_, i) => { const k = ((t * 0.9 + i / 7) % 1); return <path key={i} d={`M ${xyo + 700 - k * 900} ${640 + i * 26} q 60 -18 120 0 t 120 0`} stroke="#cfe0ff" strokeWidth={6} fill="none" opacity={Math.sin(k * Math.PI) * 0.7} strokeLinecap="round" />; })}
            </svg>
          )}
          {/* ronquidos */}
          {[4840, 5380, 5480, 5720].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 720 }}><Zzz x={0} y={0} t={t} /></div>)}
        </Mundo>
        <Cartel t={t} t0={393.4} t1={395.8} n={4} nombre="THE SLEEPERS" />
        <Ch t={t} t0={396.0} t1={401.0} text="LET'S SAY YOU'RE LUCKY" color={C.lima} tinta={C.noche} x={120} y={150} size={58} />
        <Ch t={t} t0={397.8} t1={401.0} text="DOGS: FAR SIDE ✓" color={C.teal} tinta={C.noche} x={120} y={260} size={50} />
        <Ch t={t} t0={399.0} t1={401.0} text="WIND: IN YOUR FACE ✓" color={C.teal} tinta={C.noche} x={120} y={350} size={50} />
        <G t={t} t0={401.2} t1={405.4} text="BETWEEN THE TENTS" y={220} size={110} color={C.crema} />
        <Ch t={t} t0={403.2} t1={405.4} text="EVERYONE SNORING" color={C.violeta} x={960} y={360} centro size={52} />
        <Ch t={t} t0={405.6} text="WHAT DOES A VIKING SLEEP WITH?" color={C.rojo} x={960} y={150} centro size={62} />
      </Escena>
      {/* 1 · el Hávamál, «los dichos del Altísimo»: un manual de vida vikinga */}
      <Escena t={t} t0={408.89} t1={418.48} entra="iris" ix={960} iy={800} golpes={[409.4, 412.8]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #4a3a8a, #0e0a2a 80%)" }} />
        <Rayos t={t} x={960} y={420} color="#ffe2a0" op={0.14} />
        {/* Odín: silueta con un solo ojo, sombrero ancho, cuervo */}
        <svg style={{ position: "absolute", left: 960 - 260, top: 140, overflow: "visible", transform: `scale(${ent(t, 409.0)})`, transformOrigin: "260px 300px" }} width={520} height={520} viewBox="-260 -260 520 520">
          <path d="M -200 -60 Q 0 -120 200 -60 Q 120 -50 90 -50 L 60 -220 Q 0 -250 -60 -220 L -90 -50 Q -120 -50 -200 -60 Z" fill="#1d1540" />
          <circle cx={0} cy={10} r={90} fill="#2a1e5a" />
          <path d="M -90 40 Q 0 260 90 40 Q 60 120 0 140 Q -60 120 -90 40 Z" fill="#d8d0e8" />
          <circle cx={-32} cy={0} r={12} fill="#ffe28a" />
          <path d="M 18 -6 L 46 6" stroke="#0e0a2a" strokeWidth={10} strokeLinecap="round" />
          <path d="M 170 -150 q 40 -30 80 -10 q -30 0 -40 30 q -20 -10 -40 -20 Z" fill="#0e0a2a" />
        </svg>
        {/* el libro */}
        <div style={{ position: "absolute", left: 960, top: 820, transform: `translate(-50%,-50%) scale(${ent(t, 409.4)})`, display: "flex" }}>
          <div style={{ width: 430, height: 230, background: "#f4ead2", border: "8px solid #2a1530", borderRadius: "16px 0 0 16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: C.noche }}>HÁVAMÁL</div>
          <div style={{ transform: `scaleX(${ent(t, 410.6)})`, transformOrigin: "0 50%", width: 430, height: 230, background: "#efe2c4", border: "8px solid #2a1530", borderLeft: "none", borderRadius: "0 16px 16px 0", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 40, color: C.rojo, padding: 20 }}>SAYINGS OF THE HIGH ONE</div>
        </div>
        <Ch t={t} t0={412.8} t1={416.5} text="AN INSTRUCTION MANUAL FOR VIKING LIFE" color={C.ambar} tinta={C.noche} x={960} y={110} centro size={52} />
        <G t={t} t0={416.6} text="RULE #1" x={1520} y={440} size={120} color={C.rojo} />
      </Escena>
      {/* 2 · la regla */}
      <Escena t={t} t0={418.48} t1={424.19} entra="sube" golpes={[421.6]}>
        <AbsoluteFill style={{ background: "#1a1236" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 960 40 L 1820 900 L 100 900 Z" fill="#8a4a3a" stroke="#2a1530" strokeWidth={12} />
          <path d="M 960 40 L 1500 900 L 420 900 Z" fill="#a85a42" />
          <rect x={0} y={880} width={1920} height={200} fill="#3a2a22" />
          <circle cx={960} cy={600} r={320} fill="#ffb24a" opacity={0.12} />
        </svg>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <line x1={560} y1={790} x2={1480} y2={720} stroke="#8a5a32" strokeWidth={16} strokeLinecap="round" />
          <path d="M 1480 720 L 1560 700 L 1486 740 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} />
        </svg>
        <Durmiente x={940} y={720} s={1.6} t={t} manta="#5a3a7a" hacha={false} />
        <Zzz x={1180} y={480} t={t} />
        <G t={t} t0={421.6} text="NOT ONE STEP" y={190} size={120} color={C.ambar} />
        <Cita t={t} t0={418.6} texto="Never move one step away from your weapons… you never know when you will need your spear." autor="HÁVAMÁL" y={940} size={42} w={1560} />
      </Escena>
      {/* 3 · adentro de la tienda: nada de hachas en un estante; el hacha duerme al lado, el escudo en el poste, la ropa puesta */}
      <Escena t={t} t0={424.19} t1={435.8} entra="iris" ix={960} iy={640} golpes={[425.4, 427.5, 429.4, 431.6, 433.6]}>
        <AbsoluteFill style={{ background: "#1a1236" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 960 60 L 1820 1000 L 100 1000 Z" fill="#8a4a3a" stroke="#2a1530" strokeWidth={12} />
          <path d="M 960 60 L 1500 1000 L 420 1000 Z" fill="#a85a42" />
          <path d="M 960 60 L 1200 1000 L 720 1000 Z" fill="#5a2a2a" opacity={0.5} />
          <rect x={948} y={60} width={24} height={940} fill="#6b4022" stroke="#2a1530" strokeWidth={5} />
          <rect x={0} y={980} width={1920} height={100} fill="#3a2a22" />
          <circle cx={960} cy={560} r={300} fill="#ffb24a" opacity={0.12} />
        </svg>
        {/* estante de la puerta, tachado */}
        {t < 427.4 && (
          <div style={{ position: "absolute", left: 250, top: 600, transform: `scale(${ent(t, 424.4)})` }}>
            <svg width={260} height={300} viewBox="0 0 260 300" style={{ overflow: "visible" }}>
              <rect x={10} y={80} width={240} height={20} fill="#6b4022" />
              <g transform="translate(70 180)">{hacha(-10)}</g><g transform="translate(170 180)">{hacha(10)}</g>
              {t > 425.4 && <path d="M -10 20 L 270 300 M 270 20 L -10 300" stroke={C.rojo} strokeWidth={26} strokeLinecap="round" />}
            </svg>
          </div>
        )}
        <Durmiente x={900} y={800} s={1.7} t={t} manta="#3f6a9a" />
        {t > 427.4 && <div style={{ position: "absolute", left: 1420 - prog(t, 431.6, 432.6) * 200, top: 830 - prog(t, 431.6, 432.6) * 60, transform: `translate(-50%,-50%) rotate(${90 - prog(t, 431.6, 432.6) * 30}deg) scale(${1.1 * ent(t, 427.4)})` }}><svg width={300} height={300} viewBox="-150 -150 300 300" style={{ overflow: "visible" }}>{hacha(0)}</svg></div>}
        {t > 429.4 && <div style={{ position: "absolute", left: 1050, top: 620, transform: `translate(-50%,-50%) scale(${ent(t, 429.4)}) rotate(-8deg)` }}><svg width={260} height={260} viewBox="-130 -130 260 260"><EscudoR r={120} k={1} /></svg></div>}
        <Ch t={t} t0={424.4} t1={427.3} text="AXES IN A RACK BY THE DOOR?" color={C.violeta} x={960} y={170} centro size={56} />
        <G t={t} t0={427.5} t1={429.3} text="THE AXE SLEPT NEXT TO THEM" y={180} size={90} color={C.crema} />
        <Ch t={t} t0={429.4} text="SHIELD → AGAINST THE TENT POLE" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={50} />
        <Ch t={t} t0={431.6} text="SLEEPING IN THEIR CLOTHES" color={C.teal} tinta={C.noche} x={960} y={260} centro size={50} />
        {t > 431.6 && <Emote t={t} t0={431.8} tipo="excl" x={1000} y={560} s={1.3} />}
        <Sello t={t} t0={433.6} text="NOT ALL AT ONCE" x={620} y={420} size={80} rot={-8} />
      </Escena>
      {/* 4 · la guardia: en los bordes, las puertas y los barcos, con un cuerno · no hace falta matarlo para perder: basta que sople una vez */}
      <Escena t={t} t0={435.8} t1={447.46} zoom={0} entra="barrido" golpes={[438.2, 445.0]}>
        <Mundo t={t} cam={cam} e={{ cuerno: 445.0 }} />
        <Flash t={t} t0={445.0} dur={0.2} color="#fff3c4" />
        <Ch t={t} t0={436.0} t1={441.9} text="A CAMP THIS SIZE KEPT A WATCH" color={C.violeta} x={120} y={160} size={56} />
        <Ch t={t} t0={438.2} t1={441.9} text="EDGES · GATES · SHIPS" color={C.ambar} tinta={C.noche} x={120} y={270} size={54} />
        <Ch t={t} t0={440.0} t1={441.9} text="+ A HORN" color={C.rojo} x={120} y={370} size={54} />
        <Ch t={t} t0={442.1} t1={444.9} text="YOU DON'T NEED TO KILL HIM TO LOSE" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={445.0} text="ONE BLOW" x={520} y={870} size={150} color={C.rojo} />
      </Escena>
      {/* 5 · pensá quién duerme en esas tiendas: no son granjeros como vos (rayos X a la tienda) */}
      <Escena t={t} t0={447.46} t1={451.74} zoom={0} entra="corte">
        <Mundo t={t} cam={cam}>
          {t > 448.6 && (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <circle cx={5500} cy={780} r={200 * ent(t, 448.6)} fill="#0c1a3a" stroke="#6af0ff" strokeWidth={10} opacity={0.9} />
              </svg>
              {[-110, 0, 110].map((dx, i) => <Persona key={i} x={5500 + dx * 0.8} y={880} h={200} t={t} seed={500 + i} ropa={VIK(i + 2)} casco="vikingo" barba={barbaDe(i + 2)} expr={t > 450.1 ? "enojado" : "dormido"} bD={t > 450.1 ? 150 : 20} cD={t > 450.1 ? 90 : 10} bI={t > 450.1 ? 150 : 20} cI={t > 450.1 ? 90 : 10} opacity={ent(t, 448.8 + i * 0.12)} />)}
            </>
          )}
        </Mundo>
        <Ch t={t} t0={447.7} text="WHO IS IN THOSE TENTS?" color={C.violeta} x={960} y={150} centro size={60} />
        <Sello t={t} t0={450.1} text="NOT FARMERS" x={1440} y={920} size={84} rot={-6} />
      </Escena>
      {/* 6 · llegaron en 865; lo primero: robar caballos · 8 años peleando, marchando, acampando · algunos, toda la vida */}
      <Escena t={t} t0={451.74} t1={464.43} entra="diag" golpes={[453.4, 457.8, 462.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #16123d)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <line x1={200} y1={640} x2={1720} y2={640} stroke="#4a4a7a" strokeWidth={22} strokeLinecap="round" />
          <line x1={200} y1={640} x2={200 + 1520 * prog(t, 457.8, 461.6)} y2={640} stroke={C.rojo} strokeWidth={22} strokeLinecap="round" />
          {Array.from({ length: 9 }, (_, i) => <g key={i}><line x1={200 + i * 190} y1={612} x2={200 + i * 190} y2={668} stroke="#fff" strokeWidth={8} /><text x={200 + i * 190} y={730} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={40} fill={i === 0 || i === 8 ? C.ambar : "#c8c0e8"}>{865 + i}</text></g>)}
        </svg>
        <Caballo x={330} y={500} s={0.7} t={t} t0={453.4} />
        <Ch t={t} t0={452.0} text="865 · THE GREAT ARMY LANDS" color={C.violeta} x={120} y={150} size={56} />
        <Ch t={t} t0={453.6} text="STEP 1: TAKE HORSES" color={C.ambar} tinta={C.noche} x={120} y={260} size={52} />
        {t > 457.8 && (() => { const u = prog(t, 457.8, 461.6); const gris = `rgb(${Math.round(168 + u * 70)},${Math.round(85 + u * 150)},${Math.round(42 + u * 190)})`; return <Persona x={200 + 1380 * u} y={620} h={300 - u * 20} t={t} seed={530} ropa={VIK(2)} casco="vikingo" barba={gris} inclina={u * 14} camina={u < 1 ? 1.4 : 0} expr={u > 0.8 ? "triste" : "neutro"} manoD={<LanzaMano a={40} />} />; })()}
        <Ch t={t} t0={458.0} text="FIGHTING · MARCHING · CAMPING" color={C.teal} tinta={C.noche} x={960} y={830} centro size={52} />
        <Cuenta t={t} t0={461.6} de={0} a={8} dur={0.6} x={1350} y={300} size={130} color={C.rojo} sufijo=" YEARS" />
        <Ch t={t} t0={462.2} text="SOME: THEIR WHOLE LIVES" color={C.rojo} x={960} y={930} centro size={52} />
      </Escena>
      {/* 7 · los berserkers: sin armadura, rabiosos como perros o lobos, mordiendo el borde del escudo */}
      <Escena t={t} t0={464.43} t1={476.13} entra="zoom" golpes={[466.4, 470.2, 472.4, 474.4]}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${t > 472.3 ? "#a8203a" : "#5a1a3a"}, #12061a 80%)` }} />
        <Rayos t={t} x={960} y={540} color="#ff6a4a" op={0.18} />
        {t > 472.3 && <Particulas t={t} tipo="brasas" n={50} seed={4} />}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${t > 472.3 ? Math.sin(t * 40) * 6 : 0}px, 0)` }}>
          <Persona x={960} y={1120} h={900} t={t} seed={520} ropa={{ tunica: "#8a6a4a", tunica2: "#5e4428", cinto: "#3a2418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a8552a" }} barba="#a8552a" pelera expr={t > 470 ? "enojado" : "neutro"} bI={t > 472.3 ? 120 : 30} cI={t > 472.3 ? 100 : 20} mira={0.1}
            />
          {t > 474.4 && <div style={{ position: "absolute", left: 975, top: 590, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 30) * 4}deg) scale(${ent(t, 474.4)})` }}><svg width={300} height={300} viewBox="-150 -150 300 300"><EscudoR r={130} k={3} /></svg></div>}
        </div>
        {t > 472.4 && t < 474.4 && <G t={t} t0={472.4} text="AWOOOO!" x={1450} y={700} size={90} color={C.crema} />}
        <Ch t={t} t0={464.7} t1={466.3} text="A FEW OF THEM MIGHT BE…" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={466.4} text="BERSERKERS" y={230} size={170} color={C.crema} />
        <Ch t={t} t0={470.2} text="NO ARMOR" color={C.ambar} tinta={C.noche} x={380} y={460} centro size={70} />
        <Ch t={t} t0={472.4} text="MAD AS DOGS OR WOLVES" color={C.rojo} x={380} y={580} centro size={56} />
        <Ch t={t} t0={474.4} text="BITING THEIR OWN SHIELDS" color={C.ambar} tinta={C.noche} x={960} y={960} centro size={60} />
      </Escena>
      {/* 8 · vos: lanza de ayer · él, aun medio dormido, se despierta enojado, armado y ya de pie */}
      <Escena t={t} t0={476.13} t1={484.0} entra="corte" golpes={[478.4, 480.2]}>
        <Mundo t={t} cam={{ x: 5100, y: 620, z: 0.9 }} />
        <AbsoluteFill style={{ background: "rgba(8,5,26,.55)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={900} width={1920} height={180} fill="#1e3a3a" /></svg>
        <Persona x={420} y={1000} h={520} t={t} seed={3} ropa={SAJON} expr={t > 480.2 ? "miedo" : "triste"} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={600} />} />
        <Ch t={t} t0={476.3} text="YOUR SPEAR: 1 DAY OLD" color={C.lima} tinta={C.noche} x={420} y={300} centro size={50} />
        {t < 480.2 ? <Durmiente x={1320} y={850} s={1.35} t={t} /> : (
          <Persona x={1350} y={1000} h={620} t={t} seed={521} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} pelera expr="enojado" flip bD={100} cD={30} manoD={hacha(130)} salta={prog(t, 480.2, 480.6) < 1 ? 1 : 0} />
        )}
        <Flash t={t} t0={480.2} dur={0.18} />
        <Ch t={t} t0={478.4} t1={480.1} text="EVEN HALF ASLEEP…" color={C.violeta} x={1350} y={200} centro size={56} />
        <Ch t={t} t0={480.3} text="ANGRY" color={C.rojo} x={900} y={160} centro size={58} />
        <Ch t={t} t0={480.9} text="ARMED" color={C.ambar} tinta={C.noche} x={1200} y={160} centro size={58} />
        <Ch t={t} t0={481.5} text="STANDING" color={C.teal} tinta={C.noche} x={1540} y={160} centro size={58} />
      </Escena>
    </AbsoluteFill>
  );
};
