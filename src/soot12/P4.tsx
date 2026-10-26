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
  [393.39, 5300, 640, 0.6], [395.86, 4700, 760, 1.15], [401.0, 5000, 780, 1.4], [405.54, 5330, 760, 1.7], [408.89, 5320, 700, 1.9],
  [435.8, 6450, 700, 0.8], [438.13, 7100, 740, 1.4], [441.98, 7200, 700, 1.6], [444.68, 7230, 680, 1.9], [445.9, 7150, 760, 1.6], [447.45, 6900, 740, 1.15],
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
          {t > 395.8 && <Persona x={xyo} y={gy(xyo) + 4} h={320} t={t} seed={3} ropa={SAJON} expr={t > 406.3 ? "sorpresa" : "miedo"} inclina={22 + prog(t, 405.4, 406.2) * 6} miraY={prog(t, 405.4, 406.2) * 0.8} mira={t > 405.4 ? 0.4 : 0} camina={t < 405.4 ? 0.5 : 0} bD={30} cD={20} bI={t > 405.6 ? 70 : 8} cI={t > 405.6 ? 110 : 10} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />}
          {t > 406.3 && <Emote t={t} t0={406.3} tipo="preg" x={5250} y={600} s={0.6} />}
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
        <G t={t} t0={401.2} t1={405.4} text="BETWEEN THE TENTS" y={810} size={110} color={C.crema} />
        <Ch t={t} t0={403.2} t1={405.4} text="EVERYONE SNORING" color={C.violeta} x={960} y={965} centro size={52} />
        <Ch t={t} t0={405.6} text="WHAT DOES A VIKING SLEEP WITH?" color={C.rojo} x={960} y={975} centro size={62} />
      </Escena>
      {/* 1 · el Hávamál, «los dichos del Altísimo»: un manual de vida vikinga */}
      <Escena t={t} t0={408.89} t1={418.48} entra="iris" ix={960} iy={800} golpes={[409.4, 412.8]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #4a3a8a, #0e0a2a 80%)" }} />
        <Rayos t={t} x={960} y={420} color="#ffe2a0" op={0.14} />
        {/* Odín de cuerpo entero: sombrero ancho, parche, cuervo; habla, señala el libro y lo abre: la regla sale volando */}
        <Persona x={480} y={1010} h={700} t={t} seed={610} ropa={{ tunica: "#3a3a7a", tunica2: "#24245a", cinto: "#5a3418", piel: "#e8b894", piel2: "#c98f6c", pelo: "#d8d4e8" }} viejo barba="#e8e4f0" expr={t > 416.6 ? "orgullo" : "neutro"} habla={t > 409.6 && t < 416.4} mira={0.7}
          bD={t < 410.2 ? 10 + prog(t, 409.4, 410.2) * 70 : t < 416.2 ? 80 : 80 + prog(t, 416.2, 416.7) * 60} cD={t < 416.2 ? 40 : 10} bI={20} cI={30} aparece={409.0}
          manoI={<g transform="rotate(10)"><rect x={-8} y={-300} width={16} height={420} rx={6} fill="#6b4022" stroke="#2a1530" strokeWidth={5} /><circle cx={0} cy={-300} r={22} fill="#9ad8ff" stroke="#2a1530" strokeWidth={5} /></g>} />
        {t > 409.0 && (() => { const S = 700 / 560; return (
          <svg style={{ position: "absolute", left: 480, top: 1010, overflow: "visible" }} width={1} height={1}>
            <g transform={`scale(${S * Math.min(1, (t - 409.0) / 0.12)})`}>
              {/* parche y cinta */}
              <path d="M -104 -480 L 100 -420" stroke="#1a1030" strokeWidth={9} />
              <ellipse cx={-40} cy={-450} rx={30} ry={26} fill="#1a1030" />
              {/* sombrero ancho */}
              <ellipse cx={0} cy={-536} rx={190} ry={34} fill="#1d1540" stroke="#0e0a2a" strokeWidth={6} />
              <path d="M -96 -540 Q -90 -700 0 -712 Q 90 -700 96 -540 Z" fill="#2a1e5a" stroke="#0e0a2a" strokeWidth={6} />
              <rect x={-96} y={-578} width={192} height={22} fill="#5a4a9a" />
            </g>
          </svg>); })()}
        {/* cuervo que llega y se posa en el hombro */}
        {(() => { const u = prog(t, 410.4, 411.6); const x = 1500 - u * 930, y = 120 + u * 450 - Math.sin(u * Math.PI) * 120; const ala = u < 1 ? Math.sin(t * 30) * 30 : Math.sin(t * 3) * 4; return t > 410.4 && (
          <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
            <g transform="scale(1.1)"><path d="M -40 0 Q 0 -30 40 0 Q 20 20 -30 16 Z" fill="#0e0a2a" /><circle cx={34} cy={-8} r={14} fill="#0e0a2a" /><path d="M 46 -8 L 64 -2 L 46 0 Z" fill="#ffd27a" /><circle cx={38} cy={-11} r={3} fill="#fff" />
              <path d={`M -10 -6 Q -30 ${-40 - ala} -60 ${-30 - ala}`} stroke="#0e0a2a" strokeWidth={14} strokeLinecap="round" fill="none" /></g>
          </svg>); })()}
        {/* el libro en un atril: la tapa gira y se abre, brilla y sale la regla */}
        {t > 409.4 && (() => { const ab = prog(t, 412.6, 413.4); return (
          <div style={{ position: "absolute", left: 1260, top: 760, transform: `translate(-50%,-50%) scale(${ent(t, 409.4)})` }}>
            <svg width={760} height={460} viewBox="-380 -230 760 460" style={{ overflow: "visible" }}>
              <path d="M -60 120 L 60 120 L 90 230 L -90 230 Z" fill="#6b4022" stroke="#2a1530" strokeWidth={6} />
              {ab > 0 && <circle cx={0} cy={-40} r={260 * ab} fill="#ffe2a0" opacity={0.18 + Math.sin(t * 8) * 0.04} />}
              <rect x={0} y={-130} width={330} height={250} rx={12} fill="#efe2c4" stroke="#2a1530" strokeWidth={8} />
              {ab > 0.6 && <text x={165} y={10} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={40} fill={C.rojo}>SAYINGS OF</text>}
              {ab > 0.6 && <text x={165} y={60} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={40} fill={C.rojo}>THE HIGH ONE</text>}
              {/* tapa: gira sobre el lomo */}
              <g transform={`scale(${Math.cos(ab * Math.PI)} 1)`}>
                <rect x={0} y={-136} width={336} height={262} rx={14} fill={ab < 0.5 ? "#7a2a3a" : "#efe2c4"} stroke="#2a1530" strokeWidth={8} />
                {ab < 0.5 && <text x={168} y={14} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={58} fill="#ffd27a">HÁVAMÁL</text>}
              </g>
              {ab > 0.6 && [0, 1, 2, 3, 4].map((i) => <line key={i} x1={-290} y1={-70 + i * 36} x2={-40} y2={-70 + i * 36} stroke="#8a7a5a" strokeWidth={8} strokeLinecap="round" />)}
              {ab > 0.6 && <text x={-168} y={-90} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={30} fill={C.noche}>HÁVAMÁL</text>}
            </svg>
          </div>); })()}
        {/* RULE #1 sale volando del libro hacia cámara */}
        {t > 416.6 && (() => { const u = prog(t, 416.6, 417.3); return (
          <div style={{ position: "absolute", left: 1260 + u * 60, top: 720 - u * 360, transform: `translate(-50%,-50%) scale(${0.2 + u * 0.8}) rotate(${(1 - u) * 30}deg)`, fontFamily: "Fredoka", fontWeight: 700, fontSize: 150, color: C.rojo, WebkitTextStroke: `14px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>RULE #1</div>); })()}
        <Ch t={t} t0={412.8} t1={416.5} text="AN INSTRUCTION MANUAL FOR VIKING LIFE" color={C.ambar} tinta={C.noche} x={1260} y={150} centro size={52} />
      </Escena>
      {/* 2 · la regla */}
      <Escena t={t} t0={418.48} t1={424.19} entra="sube" zoom={0.02} golpes={[421.6]}>
        <AbsoluteFill style={{ background: "#1a1236" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 960 40 L 1820 900 L 100 900 Z" fill="#8a4a3a" stroke="#2a1530" strokeWidth={12} />
          <path d="M 960 40 L 1500 900 L 420 900 Z" fill="#a85a42" />
          <rect x={0} y={880} width={1920} height={200} fill="#3a2a22" />
          <circle cx={960} cy={600} r={320} fill="#ffb24a" opacity={0.12} />
        </svg>
        <Durmiente x={940} y={720} s={1.6} t={t} manta="#5a3a7a" hacha={false} />
        {/* dormido, estira la mano, agarra la lanza y la arrastra pegada al cuerpo */}
        {(() => { const off = 300 * (1 - prog(t, 420.7, 421.5)); const reach = prog(t, 419.6, 420.6); const hx = 1000 + (off + 120) * reach, hy = 748 - 10 * reach; return (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <g transform={`translate(${off} ${-off * 0.076})`}>
              <line x1={560} y1={790} x2={1480} y2={720} stroke="#8a5a32" strokeWidth={16} strokeLinecap="round" />
              <path d="M 1480 720 L 1560 700 L 1486 740 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} />
            </g>
            {reach > 0 && <><path d={`M 990 740 Q ${(990 + hx) / 2} ${hy - 30} ${hx} ${hy}`} stroke="#5a3a7a" strokeWidth={34} fill="none" strokeLinecap="round" /><circle cx={hx} cy={hy} r={22} fill="#f2c4a0" stroke="#2a1530" strokeWidth={5} /></>}
          </svg>); })()}
        <Ch t={t} t0={422.4} text="SPEAR: 0 STEPS AWAY" color={C.teal} tinta={C.noche} x={960} y={960} centro size={48} />
        <Zzz x={1240} y={640} t={t} />
        <G t={t} t0={421.6} text="NOT ONE STEP" y={490} size={110} color={C.ambar} />
        <Cita t={t} t0={418.6} texto="Never move one step away from your weapons… you never know when you will need your spear." autor="HÁVAMÁL" y={255} size={40} w={1500} />
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
        {/* dormido se da vuelta (rueda) y estira el brazo hasta el hacha */}
        {(() => { const r = prog(t, 430.4, 431.1); return (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "900px 800px", transform: `scaleX(${Math.abs(Math.cos(r * Math.PI))}) translateY(${-Math.sin(r * Math.PI) * 30}px)` }}>
            <Durmiente x={900} y={800} s={1.7} t={t} manta="#3f6a9a" hacha={false} flip={r > 0.5} />
          </div>); })()}
        {t > 431.1 && (() => { const k = prog(t, 431.1, 431.6), p = prog(t, 431.6, 432.6); const hx = t < 431.6 ? 1080 + 340 * k : 1420 - 200 * p, hy = t < 431.6 ? 790 + 40 * k : 830 - 60 * p; return (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M 1040 800 Q ${(1040 + hx) / 2} ${hy - 40} ${hx} ${hy}`} stroke="#3f6a9a" strokeWidth={36} fill="none" strokeLinecap="round" /></svg>); })()}
        {t > 427.4 && <div style={{ position: "absolute", left: 1420 - prog(t, 431.6, 432.6) * 200, top: 830 - prog(t, 431.6, 432.6) * 60, transform: `translate(-50%,-50%) rotate(${90 - prog(t, 431.6, 432.6) * 30}deg) scale(${1.1 * ent(t, 427.4)})` }}><svg width={300} height={300} viewBox="-150 -150 300 300" style={{ overflow: "visible" }}>{hacha(0)}{t > 431.55 && <circle cx={0} cy={-10} r={24} fill="#f2c4a0" stroke="#2a1530" strokeWidth={5} />}</svg></div>}
        {t > 429.4 && <div style={{ position: "absolute", left: 1050, top: 620, transform: `translate(-50%,-50%) scale(${ent(t, 429.4)}) rotate(-8deg)` }}><svg width={260} height={260} viewBox="-130 -130 260 260"><EscudoR r={120} k={1} /></svg></div>}
        <Ch t={t} t0={424.4} t1={427.3} text="AXES IN A RACK BY THE DOOR?" color={C.violeta} x={960} y={170} centro size={56} />
        <G t={t} t0={427.5} t1={429.3} text="THE AXE SLEPT NEXT TO THEM" y={180} size={90} color={C.crema} />
        <Ch t={t} t0={429.4} text="SHIELD → AGAINST THE TENT POLE" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={50} />
        <Ch t={t} t0={431.6} text="SLEEPING IN THEIR CLOTHES" color={C.teal} tinta={C.noche} x={960} y={260} centro size={50} />
        {t > 431.6 && <Emote t={t} t0={431.8} tipo="excl" x={1000} y={560} s={1.3} />}
        <Sello t={t} t0={433.6} text="NOT ALL AT ONCE" x={430} y={760} size={74} rot={-8} />
      </Escena>
      {/* 4 · la guardia: en los bordes, las puertas y los barcos, con un cuerno · no hace falta matarlo para perder: basta que sople una vez */}
      <Escena t={t} t0={435.8} t1={447.46} zoom={0} entra="barrido" golpes={[438.2, 445.0]}>
        <Mundo t={t} cam={cam} e={{ cuerno: 445.0, despierta: 445.7 }}>
          {/* rondas: guardias que caminan los bordes con la lanza */}
          {t < 442 && [[5450, 5950, 0], [6150, 6650, 1]].map(([a, b, i]) => { const k = (Math.sin(t * 0.55 + i * 2) + 1) / 2; const v = Math.cos(t * 0.55 + i * 2); return <Persona key={i} x={a + (b - a) * k} y={gy(a + (b - a) * k) + 4} h={280} t={t} seed={630 + i} ropa={VIK(i + 5)} casco="vikingo" barba={barbaDe(i + 5)} expr="neutro" mira={v > 0 ? 0.6 : -0.6} flip={v < 0} camina={Math.abs(v) > 0.15 ? 0.9 : 0} manoD={<LanzaMano a={50} inclina={-10} largo={360} />} />; })}
          {t > 446.0 && [6260, 6800].map((x, i) => <Emote key={x} t={t} t0={446.0 + i * 0.1} tipo="excl" x={x - 60} y={640} s={0.7} />)}
        </Mundo>
        <Flash t={t} t0={445.0} dur={0.2} color="#fff3c4" />
        <Ch t={t} t0={436.0} t1={441.9} text="A CAMP THIS SIZE KEPT A WATCH" color={C.violeta} x={120} y={160} size={56} />
        <Ch t={t} t0={438.2} t1={441.9} text="EDGES · GATES · SHIPS" color={C.ambar} tinta={C.noche} x={120} y={270} size={54} />
        <Ch t={t} t0={440.0} t1={441.9} text="+ A HORN" color={C.rojo} x={120} y={370} size={54} />
        <Ch t={t} t0={442.1} t1={444.9} text="YOU DON'T NEED TO KILL HIM TO LOSE" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={445.0} text="ONE BLOW" x={520} y={870} size={150} color={C.rojo} />
      </Escena>
      {/* 5 · pensá quién duerme en esas tiendas: no son granjeros como vos (rayos X a la tienda) */}
      <Escena t={t} t0={447.46} t1={451.74} zoom={0} entra="corte">
        <Mundo t={t} cam={cam} luna={[1730, 150, 70]}>
          {t > 448.6 && (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
                <circle cx={5500} cy={780} r={200 * ent(t, 448.6)} fill="#0c1a3a" stroke="#6af0ff" strokeWidth={10} opacity={0.9} />
              </svg>
              {[-110, 0, 110].map((dx, i) => <Persona key={i} x={5500 + dx * 0.8} y={880} h={200} t={t} seed={500 + i} ropa={VIK(i + 2)} casco="vikingo" barba={barbaDe(i + 2)} expr={t > 450.1 ? "enojado" : "dormido"} bD={t > 450.1 ? 20 + prog(t, 450.1 + i * 0.1, 450.4 + i * 0.1) * 150 : 20} cD={t > 450.1 ? 20 : 10} bI={t > 450.1 ? 40 : 20} cI={t > 450.1 ? 60 : 10} salta={450.1 + i * 0.1} mira={t > 450.1 ? 0 : 0.3} opacity={ent(t, 448.8 + i * 0.12)}
                manoD={t > 450.1 ? <g transform="rotate(180) scale(0.8)">{hacha(0)}</g> : undefined} />)}
            </>
          )}
        </Mundo>
        <Ch t={t} t0={447.7} text="WHO IS IN THOSE TENTS?" color={C.violeta} x={960} y={150} centro size={60} />
        <Sello t={t} t0={450.1} text="NOT FARMERS" x={1440} y={920} size={84} rot={-6} />
      </Escena>
      {/* 6 · llegaron en 865; lo primero: robar caballos · 8 años peleando, marchando, acampando · algunos, toda la vida */}
      <Escena t={t} t0={451.74} t1={464.43} entra="diag" zoom={0.02} golpes={[453.4, 457.8, 462.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #16123d)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <line x1={240} y1={640} x2={1680} y2={640} stroke="#4a4a7a" strokeWidth={22} strokeLinecap="round" />
          <line x1={240} y1={640} x2={240 + 1440 * prog(t, 457.8, 461.6)} y2={640} stroke={C.rojo} strokeWidth={22} strokeLinecap="round" />
          {Array.from({ length: 9 }, (_, i) => <g key={i}><line x1={240 + i * 180} y1={612} x2={240 + i * 180} y2={668} stroke="#fff" strokeWidth={8} /><text x={240 + i * 180} y={730} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={40} fill={i === 0 || i === 8 ? C.ambar : "#c8c0e8"}>{865 + i}</text></g>)}
        </svg>
        {/* paso 1: un vikingo entra, agarra un caballo y lo lleva por los 8 años, envejeciendo */}
        {(() => { const u = prog(t, 457.8, 461.6); const llega = prog(t, 453.6, 455.2); const vx = t < 457.8 ? -120 + 560 * llega : 440 + 1180 * u; const hx = t < 457.8 ? 250 : vx - 230;
          const gris = `rgb(${Math.round(168 + u * 70)},${Math.round(85 + u * 150)},${Math.round(42 + u * 190)})`;
          const anda = (t > 453.6 && t < 455.2) || (t > 457.8 && t < 461.6);
          return <>
            <Caballo x={hx} y={500} s={0.7} t={t} t0={453.4} />
            {t > 455.2 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M ${hx + 150} 430 Q ${(hx + vx) / 2 + 80} 520 ${vx - 40} 470`} stroke="#3a2418" strokeWidth={6} fill="none" /></svg>}
            {t > 453.6 && <Persona x={vx} y={620} h={300 - u * 20} t={t} seed={530} ropa={VIK(2)} casco="vikingo" barba={gris} inclina={u * 14} camina={anda ? 1.3 : 0} expr={u > 0.8 ? "triste" : t > 455.2 && t < 457.8 ? "orgullo" : "neutro"} flip={t > 455.2 && t < 457.8} bI={t > 455.2 ? 60 : 8} cI={20} manoD={<LanzaMano a={40} />} />}
          </>; })()}
        <Ch t={t} t0={452.0} text="865 · THE GREAT ARMY LANDS" color={C.violeta} x={120} y={150} size={56} />
        <Ch t={t} t0={453.6} text="STEP 1: TAKE HORSES" color={C.ambar} tinta={C.noche} x={120} y={260} size={52} />
        <Ch t={t} t0={458.0} text="FIGHTING · MARCHING · CAMPING" color={C.teal} tinta={C.noche} x={960} y={830} centro size={52} />
        <Cuenta t={t} t0={461.6} de={0} a={8} dur={0.6} x={1180} y={320} size={130} color={C.rojo} sufijo=" YEARS" />
        <Ch t={t} t0={462.2} text="SOME: THEIR WHOLE LIVES" color={C.rojo} x={960} y={930} centro size={52} />
      </Escena>
      {/* 7 · los berserkers: sin armadura, rabiosos como perros o lobos, mordiendo el borde del escudo */}
      <Escena t={t} t0={464.43} t1={476.13} entra="zoom" golpes={[466.4, 470.2, 472.4, 474.4]}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${t > 472.3 ? "#a8203a" : "#5a1a3a"}, #12061a 80%)` }} />
        <Rayos t={t} x={960} y={540} color="#ff6a4a" op={0.18} />
        {t > 472.3 && <Particulas t={t} tipo="brasas" n={50} seed={4} />}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${t > 472.3 ? Math.sin(t * 40) * 6 : 0}px, 0)` }}>
          <Persona x={interpolate(t, [464.6, 466.4], [1700, 960], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={1230} h={760} t={t} seed={520} ropa={{ tunica: "#8a6a4a", tunica2: "#5e4428", cinto: "#3a2418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a8552a" }} barba="#a8552a" pelera
            camina={t < 466.4 ? 1.1 : 0} flip={t < 466.4}
            expr={t > 472.4 && t < 474.4 ? "sorpresa" : t > 468.6 ? "enojado" : "neutro"} ladea={t > 472.4 && t < 474.4 ? -14 : 0} miraY={t > 472.4 && t < 474.4 ? -0.8 : 0}
            bI={t > 473.8 ? 120 : t > 470.2 && t < 472.3 ? 100 + Math.abs(Math.sin(t * 9)) * 60 : 30} cI={t > 473.8 ? 100 : t > 470.2 && t < 472.3 ? 30 : 20}
            bD={t > 473.8 ? 120 : t > 470.2 && t < 472.3 ? 100 + Math.abs(Math.cos(t * 9)) * 60 : 30} cD={t > 473.8 ? 100 : t > 470.2 && t < 472.3 ? 30 : 20} mira={0.1}
            />
          {t > 473.8 && <div style={{ position: "absolute", left: 975, top: 1120 - prog(t, 473.8, 474.4) * 400 + Math.sin(t * 30) * 6, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 30) * 4}deg)` }}><svg width={300} height={300} viewBox="-150 -150 300 300"><EscudoR r={130} k={3} /></svg></div>}
        </div>
        {t > 472.4 && t < 474.0 && <G t={t} t0={472.4} text="AWOOOO!" x={1460} y={400} size={90} color={C.crema} />}
        <Ch t={t} t0={464.7} t1={466.3} text="A FEW OF THEM MIGHT BE…" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={466.4} text="BERSERKERS" y={170} size={150} color={C.crema} />
        <Ch t={t} t0={470.2} text="NO ARMOR" color={C.ambar} tinta={C.noche} x={380} y={460} centro size={70} />
        <Ch t={t} t0={472.4} text="MAD AS DOGS OR WOLVES" color={C.rojo} x={380} y={580} centro size={56} />
        <Ch t={t} t0={474.4} text="BITING THEIR OWN SHIELDS" color={C.ambar} tinta={C.noche} x={1480} y={980} centro size={60} />
      </Escena>
      {/* 8 · vos: lanza de ayer · él, aun medio dormido, se despierta enojado, armado y ya de pie */}
      <Escena t={t} t0={476.13} t1={484.0} entra="corte" golpes={[478.4, 480.2]}>
        <Mundo t={t} cam={{ x: 5100, y: 620, z: 0.9 }} luna={[1790, 340, 55]} />
        <AbsoluteFill style={{ background: "rgba(8,5,26,.55)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={900} width={1920} height={180} fill="#1e3a3a" /></svg>
        {(() => { const kx = 360 + prog(t, 476.5, 479.0) * 260 - prog(t, 480.2, 480.7) * 180; return <>
          <Persona x={kx} y={1000} h={520} t={t} seed={3} ropa={SAJON} expr={t > 479.5 ? "miedo" : "triste"} inclina={t < 479.0 ? 10 : t > 480.2 ? -8 : 0} camina={(t > 476.5 && t < 479.0) || (t > 480.2 && t < 480.7) ? 0.7 : 0} salta={480.2} bD={30} cD={20} manoD={<LanzaMano a={50 + (t > 477.4 && t < 478.4 ? Math.sin(t * 20) * 6 : 0)} inclina={-14} largo={600} />} />
          <Emote t={t} t0={479.5} t1={480.2} tipo="excl" x={kx} y={560} s={0.9} />
          {t > 480.2 && <Emote t={t} t0={480.2} tipo="susto" x={kx} y={640} s={0.9} />}
        </>; })()}
        <Ch t={t} t0={476.3} text="YOUR SPEAR: 1 DAY OLD" color={C.lima} tinta={C.noche} x={460} y={300} centro size={50} />
        {t < 480.2 ? <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1320px 900px", transform: t > 479.3 ? `translateY(${-Math.abs(Math.sin(t * 18)) * 10}px) rotate(${Math.sin(t * 14) * 1.5}deg)` : "none" }}><Durmiente x={1320} y={850} s={1.35} t={t} /></div> : (
          <Persona x={1350} y={1000} h={620} t={t} seed={521} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} pelera expr="enojado" flip bD={60 + prog(t, 480.3, 480.9) * 100} cD={30} manoD={hacha(130)} salta={480.2} />
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
