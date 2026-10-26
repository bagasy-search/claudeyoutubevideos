import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote } from "./kit";
import { Mundo, camEn, Key, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, Globo } from "./comun";
import { Drakkar, Antorcha, Llamas, Tienda } from "./vik";

// 483,7-565,4 s · TRAMPA 5: LOS BARCOS. El plan nuevo (quemar los dragones), por qué casi nunca funcionó: roble mojado con
// brea, el barco de Gokstad (23 m, 32 remeros, 64 escudos), los rodillos, se van antes de que prendas la antorcha, menos de un
// metro de calado, y la mitad del ejército que vuelve por el río detrás de vos.
export const CAM5: Key[] = [
  [483.71, 5300, 640, 0.6], [486.13, 6900, 700, 0.9], [488.09, 7050, 740, 1.3], [494.35, 7300, 760, 1.0],
  [525.53, 7900, 700, 0.75], [528.8, 8000, 720, 0.85], [533.13, 7650, 820, 2.0], [538.05, 7800, 780, 1.1], [542.51, 8400, 760, 0.7],
  [560.45, 7300, 690, 0.85], [562.35, 7260, 720, 0.95], [565.39, 7250, 740, 1.05],
];

export const P5: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM5);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 5 · tu señor cambia el plan: olvidate de las tiendas, a los barcos */}
      <Escena t={t} t0={483.71} t1={491.4} zoom={0} entra="corte" golpes={[488.2, 490.0]}>
        <Mundo t={t} cam={cam}>
          {t > 486 && (
            <>
              <Persona x={6980} y={gy(6980) + 6} h={260} t={t} seed={4} ropa={SENOR} expr="enojado" habla={t < 494} bD={t > 489.9 ? 120 : 30} cD={10} />
              <Persona x={7120} y={gy(7120) + 6} h={250} t={t} seed={3} ropa={SAJON} expr={t > 490 ? "enojado" : "sorpresa"} flip bD={t > 490 ? 90 : 30} cD={20} />
              {t > 490 && <Antorcha x={7060} y={gy(7120) - 190} s={0.38} t={t} />}
            </>
          )}
        </Mundo>
        <Cartel t={t} t0={483.8} t1={486.0} n={5} nombre="THE SHIPS" />
        <Ch t={t} t0={486.3} t1={489.9} text="NEW PLAN" color={C.violeta} x={120} y={150} size={60} />
        <Ch t={t} t0={488.2} t1={489.9} text="FORGET THE TENTS ✗" color={C.teal} tinta={C.noche} x={120} y={260} size={54} />
        <G t={t} t0={490.0} text="BURN THE DRAGONS" y={900} size={120} color={C.ambar} />
      </Escena>
      {/* 1 · la fantasía: los barcos arden y los vikingos quedan atrapados de tu lado del mar · buena idea, todos la tuvieron, casi nunca funcionó */}
      <Escena t={t} t0={491.4} t1={498.49} entra="iris" ix={960} iy={700} golpes={[492.4, 494.4, 495.7, 497.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a0e2a, #8a2a2a 80%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={780} width={1920} height={300} fill="#1e2a5a" /></svg>
        {[[520, 760, 0.5], [1100, 790, 0.56], [1620, 760, 0.46]].map(([x, y, s], i) => <Drakkar key={i} x={x} y={y} s={s} t={t} quema={prog(t, 491.6 + i * 0.25, 493.4 + i * 0.25)} />)}
        {[0, 1, 2].map((i) => <Llamas key={i} t={t} x={520 + i * 560} y={620} s={1.4 * ent(t, 491.8 + i * 0.25)} ancho={220} seed={i + 3} />)}
        <Particulas t={t} tipo="brasas" n={60} seed={9} />
        {t > 492.4 && Array.from({ length: 5 }, (_, i) => <Persona key={i} x={300 + i * 340} y={1010} h={280} t={t} seed={540 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="triste" sombra="#1a0a14" />)}
        <Ch t={t} t0={492.4} t1={494.3} text="TRAPPED ON YOUR SIDE OF THE SEA" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={56} />
        <Ch t={t} t0={494.4} text="A GOOD IDEA ✓" color={C.lima} tinta={C.noche} x={300} y={150} size={56} />
        <Ch t={t} t0={495.7} text="EVERYBODY HAD IT" color={C.teal} tinta={C.noche} x={1000} y={150} size={56} />
        <Sello t={t} t0={497.0} text="IT ALMOST NEVER WORKED" x={960} y={420} size={90} rot={-6} />
      </Escena>
      {/* 2 · lo que querés quemar: tablones de roble superpuestos, con brea, mojados del río · Gokstad: 23 m, 32 remos, 64 escudos */}
      <Escena t={t} t0={498.49} t1={518.17} entra="zoom" golpes={[501.5, 503.6, 505.4, 507.8, 510.6, 515.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #16123d, #2a3a7a)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={790} width={1920} height={290} fill="#1d4f7a" /></svg>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${interpolate(t, [498.5, 506.1, 507.0, 518.1], [1.02, 1.1, 0.92, 0.95], { extrapolateRight: "clamp" })})`, transformOrigin: "960px 700px" }}>
          <Drakkar x={960} y={740} s={1.05} t={t} remos={t > 510.6 ? 1.2 : 0} escudos={t > 515} vela={0} />
          {t > 510.6 && Array.from({ length: 16 }, (_, i) => t > 510.6 + i * 0.12 && <div key={i} style={{ position: "absolute", left: 580 + i * 48, top: 680 + Math.sin(t * 3.6 + i * 0.2) * 4, transform: `scale(${ent(t, 510.6 + i * 0.12)})` }}><svg width={40} height={50} viewBox="-20 -25 40 50" style={{ overflow: "visible" }}><circle cx={0} cy={4} r={16} fill="#f2b48a" stroke="#2a1530" strokeWidth={4} /><path d="M -18 0 Q 0 -30 18 0 Z" fill="#9aa4b8" stroke="#2a1530" strokeWidth={4} /></svg></div>)}
          {/* gotas: mojado */}
          {t > 505.4 && t < 507.2 && Array.from({ length: 16 }, (_, i) => { const k = ((t * 1.4 + i / 16) % 1); return <div key={i} style={{ position: "absolute", left: 500 + i * 60, top: 620 + k * 160, width: 12, height: 20, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#9ad8ff", opacity: 1 - k }} />; })}
        </div>
        {/* regla de 23 m */}
        {t > 507.8 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <line x1={330} y1={930} x2={330 + 1260 * prog(t, 507.8, 509.0)} y2={930} stroke={C.ambar} strokeWidth={12} />
            <line x1={330} y1={900} x2={330} y2={960} stroke={C.ambar} strokeWidth={10} />
            {t > 509 && <line x1={1590} y1={900} x2={1590} y2={960} stroke={C.ambar} strokeWidth={10} />}
          </svg>
        )}
        <Ch t={t} t0={498.7} t1={507.6} text="LOOK AT WHAT YOU'RE BURNING" color={C.violeta} x={960} y={150} centro size={58} />
        <Ch t={t} t0={501.5} t1={507.6} text="OVERLAPPING OAK PLANKS" color={C.ambar} tinta={C.noche} x={300} y={280} centro size={48} />
        <Ch t={t} t0={503.6} t1={507.6} text="SOAKED IN TAR" color={C.rojo} x={960} y={280} centro size={48} />
        <Ch t={t} t0={505.4} t1={507.6} text="WET FROM THE RIVER" color={C.teal} tinta={C.noche} x={1600} y={280} centro size={48} />
        <Ch t={t} t0={507.7} text="THE GOKSTAD SHIP" color={C.violeta} x={960} y={150} centro size={58} />
        <Cuenta t={t} t0={508.6} de={0} a={23} dur={0.6} x={960} y={970} size={80} color={C.ambar} sufijo=" M+" />
        <Cuenta t={t} t0={510.6} de={0} a={32} dur={1.9} x={420} y={280} size={150} color={C.crema} />
        <Ch t={t} t0={511.0} text="MEN ON THE OARS" color={C.teal} tinta={C.noche} x={420} y={400} centro size={44} />
        <Cuenta t={t} t0={515.0} de={0} a={64} dur={0.7} x={1500} y={280} size={150} color={C.rojo} />
        <Ch t={t} t0={515.4} text="SHIELDS" color={C.rojo} x={1500} y={400} centro size={44} />
      </Escena>
      {/* 3 · prenderle fuego a roble mojado, a oscuras, a mano, con alguien gritando */}
      <Escena t={t} t0={518.17} t1={525.53} entra="barrido" golpes={[519.4, 520.6, 521.8, 523.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={880} width={1920} height={200} fill="#1d3a5a" /></svg>
        <Drakkar x={1250} y={760} s={0.95} t={t} />
        <Persona x={560} y={1000} h={560} t={t} seed={3} ropa={SAJON} expr={t > 523 ? "miedo" : "enojado"} bD={100 + Math.sin(t * 14) * 10} cD={40} />
        <Antorcha x={800} y={560} s={0.75} t={t} apagada={Math.sin(t * 7) < 0.5} />
        {/* chispas que se apagan */}
        {Array.from({ length: 8 }, (_, i) => { const k = ((t * 2 + i / 8) % 1); return <div key={i} style={{ position: "absolute", left: 830 + k * 140 + i * 6, top: 560 + k * 120 - i * 4, width: 10, height: 10, borderRadius: 5, background: "#ffb24a", opacity: (1 - k) * 0.8 }} />; })}
        <Emote t={t} t0={521.0} tipo="sudor" x={420} y={470} s={1.2} />
        {t > 523 && <Globo t={t} t0={523.0} x={1480} y={560} text="WHO'S THERE?!" cola="izq" size={58} />}
        <Ch t={t} t0={519.4} text="WET OAK" color={C.teal} tinta={C.noche} x={1000} y={130} size={52} />
        <Ch t={t} t0={520.6} text="IN THE DARK" color={C.violeta} x={1000} y={220} size={52} />
        <Ch t={t} t0={521.8} text="BY HAND" color={C.ambar} tinta={C.noche} x={1000} y={310} size={52} />
        <Ch t={t} t0={523.0} text="SOMEONE SHOUTING" color={C.rojo} x={1000} y={400} size={52} />
      </Escena>
      {/* 4 · lo mejor custodiado del campamento: tesoro, arma y camino a casa · en rodillos, listos para volver al agua · la alarma: ya reman */}
      <Escena t={t} t0={525.53} t1={542.53} zoom={0} entra="corte" golpes={[528.9, 530.3, 531.7, 533.2, 538.6]}>
        <Mundo t={t} cam={cam} e={{ barcosAlAgua: 538.6, cuerno: 538.1 }}>
          {/* guardias junto a los barcos */}
          {[7560, 7720, 8150, 8380, 8860].map((x, i) => <Persona key={i} x={x} y={gy(Math.min(x, 7600)) + 4} h={300} t={t} seed={560 + i} ropa={VIK(i + 1)} casco="vikingo" barba={barbaDe(i + 1)} expr={t > 538.1 ? "enojado" : "neutro"} flip={i % 2 === 0} opacity={x > 7600 ? 0 : 1} manoD={<LanzaMano a={50} inclina={-10} largo={380} />} />)}
          {/* rodillos de madera bajo el primer barco */}
          {t > 533.1 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {Array.from({ length: 4 }, (_, i) => { const x = 7390 + i * 55; const y = gy(x) + 4; const g = t > 538.6 ? (t - 538.6) * 400 : Math.sin(t * 2) * 6; return <g key={i} transform={`translate(${x} ${y}) rotate(${g})`} opacity={ent(t, 533.2 + i * 0.08)}><circle r={20} fill="#a8794a" stroke="#2a1530" strokeWidth={5} /><line x1={-16} y1={0} x2={16} y2={0} stroke="#5e3a1e" strokeWidth={4} /></g>; })}
            </svg>
          )}
        </Mundo>
        <Ch t={t} t0={525.8} t1={533.0} text="THE BEST GUARDED THING IN THE CAMP" color={C.rojo} x={960} y={150} centro size={56} />
        <Ch t={t} t0={528.9} t1={533.0} text="TREASURE" color={C.ambar} tinta={C.noche} x={420} y={270} centro size={56} />
        <Ch t={t} t0={530.3} t1={533.0} text="WEAPON" color={C.violeta} x={960} y={270} centro size={56} />
        <Ch t={t} t0={531.7} t1={533.0} text="WAY HOME" color={C.teal} tinta={C.noche} x={1500} y={270} centro size={56} />
        <Ch t={t} t0={533.3} t1={538.0} text="ON WOODEN ROLLERS" color={C.ambar} tinta={C.noche} x={120} y={170} size={56} />
        <Ch t={t} t0={535.0} t1={538.0} text="READY TO SLIDE BACK IN" color={C.teal} tinta={C.noche} x={120} y={280} size={52} />
        <Flash t={t} t0={538.1} dur={0.18} color="#fff3c4" />
        <G t={t} t0={538.6} text="ALARM!" y={210} size={150} color={C.rojo} />
        <Ch t={t} t0={539.6} text="ROWING AWAY BEFORE YOU LIGHT A TORCH" color={C.violeta} x={960} y={390} centro size={52} />
      </Escena>
      {/* 5 · la trampa dentro de la trampa: menos de un metro de agua */}
      <Escena t={t} t0={542.53} t1={550.21} entra="iris" ix={960} iy={760} golpes={[544.9, 547.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #5a8ac8)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={0} y={600} width={1920} height={480} fill="#2f6aa8" opacity={0.85} />
          <path d="M 0 860 Q 480 820 960 860 T 1920 860 L 1920 1080 L 0 1080 Z" fill="#8a6a3e" />
          <line x1={0} y1={600} x2={1920} y2={600} stroke="#cfe8ff" strokeWidth={8} />
        </svg>
        <Drakkar x={620 + prog(t, 547.8, 550.2) * 220} y={580} s={0.6} t={t} remos={t > 547.8 ? 1 : 0} />
        {/* barco «normal» de quilla honda, encallado */}
        {t > 547.8 && (
          <svg style={{ position: "absolute", left: 1100, top: 300, overflow: "visible", transform: `scale(${ent(t, 547.8)})`, transformOrigin: "300px 300px" }} width={600} height={600} viewBox="0 0 600 600">
            <path d="M 40 300 L 560 300 L 460 560 L 140 560 Z" fill="#6a4a2e" stroke="#2a1530" strokeWidth={10} />
            <rect x={290} y={40} width={20} height={260} fill="#5e3a1e" />
            <path d="M 310 60 L 470 200 L 310 240 Z" fill="#e8dcc0" stroke="#2a1530" strokeWidth={6} />
            <path d="M 200 560 L 240 520 L 270 560 M 360 560 L 400 520 L 430 560" stroke={C.rojo} strokeWidth={10} fill="none" />
          </svg>
        )}
        {/* regla de calado */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <line x1={260} y1={600} x2={260} y2={600 + 120 * prog(t, 544.9, 545.6)} stroke={C.ambar} strokeWidth={12} />
          <line x1={230} y1={600} x2={290} y2={600} stroke={C.ambar} strokeWidth={8} />
          {t > 545.6 && <line x1={230} y1={720} x2={290} y2={720} stroke={C.ambar} strokeWidth={8} />}
        </svg>
        <Ch t={t} t0={542.8} t1={544.8} text="THE TRAP INSIDE THE TRAP" color={C.rojo} x={960} y={150} centro size={60} />
        <G t={t} t0={545.0} text="< 1 METER OF WATER" y={200} size={110} color={C.crema} />
        <Ch t={t} t0={547.9} text="PLACES NO OTHER SHIP COULD GO" color={C.violeta} x={620} y={960} centro size={46} />
        <Sello t={t} t0={548.6} text="STUCK" x={1400} y={720} size={76} rot={8} />
      </Escena>
      {/* 6 · la mitad del ejército puede no estar: 10 millas río arriba, saqueando, y vuelven de noche por el agua, detrás de vos */}
      <Escena t={t} t0={550.21} t1={560.45} entra="zoom" golpes={[551.8, 554.0, 557.6]}>
        <AbsoluteFill style={{ background: "#2f5a40" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 137) % 1080} r={26} fill="#2a5038" />)}
          <path id="rioS" d="M 1700 1120 C 1500 860 1700 700 1300 560 C 900 420 1100 220 700 160 C 400 110 300 0 200 -40" stroke="#3a7ac8" strokeWidth={80} fill="none" />
          {/* el campamento y vos */}
          <circle cx={1450} cy={800} r={90} fill="#7a5a3a" stroke="#2a1530" strokeWidth={8} />
          {/* el pueblo río arriba */}
          <g transform="translate(560 160)" opacity={ent(t, 554.0)}>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 60 - 60} ${i % 2 * 30})`}><rect x={-22} y={-20} width={44} height={36} fill="#e8b98a" stroke="#2a1530" strokeWidth={5} /><path d="M -30 -20 L 0 -46 L 30 -20 Z" fill="#b5452c" stroke="#2a1530" strokeWidth={5} /></g>)}</g>
          {t > 554.6 && t < 556.6 && <Llamasvg x={560} y={130} t={t} />}
          {/* línea punteada «10 millas» */}
          <path d="M 1450 800 C 1300 560 900 420 620 170" stroke={C.ambar} strokeWidth={10} strokeDasharray="20 16" fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 553.9, 555.0)} 1` }} />
        </svg>
        {/* barcos: suben y vuelven */}
        {(() => {
          const ida = prog(t, 551.8, 553.8), vuelta = prog(t, 557.6, 560.2);
          const pts: [number, number][] = [[1500, 900], [1300, 560], [900, 380], [620, 180]];
          const at = (u: number) => { const k = u * (pts.length - 1); const i = Math.min(pts.length - 2, Math.floor(k)); const f = k - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; };
          const u = t < 557.6 ? ida : 1 - vuelta;
          return [0, 1, 2].map((i) => { const [x, y] = at(Math.max(0, Math.min(1, u - i * 0.06))); return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(0.16) scaleX(${t < 557.6 ? -1 : 1})` }}><Drakkar x={0} y={0} s={1} t={t} vela={1} remos={1} /></div>; });
        })()}
        <div style={{ position: "absolute", left: 1330, top: 900 }}><Persona x={0} y={0} h={230} t={t} seed={3} ropa={SAJON} expr={t > 558 ? "miedo" : "neutro"} mira={0.6} /></div>
        <Ch t={t} t0={550.4} text="HALF THE ARMY MIGHT NOT EVEN BE THERE" color={C.violeta} x={640} y={1010} centro size={46} />
        <Ch t={t} t0={554.0} text="10 MILES UP THE RIVER" color={C.ambar} tinta={C.noche} x={420} y={330} centro size={50} />
        <Ch t={t} t0={555.0} text="RAIDING THE NEXT VILLAGE" color={C.rojo} x={420} y={430} centro size={46} />
        <Ch t={t} t0={557.6} text="BACK IN THE DARK · BY WATER" color={C.teal} tinta={C.noche} x={1450} y={930} centro size={48} />
        <Sello t={t} t0={558.8} text="BEHIND YOU" x={880} y={640} size={76} rot={-8} />
      </Escena>
      {/* 7 · viniste a cortarles la retirada · terminás parado entre sus barcos y sus amigos */}
      <Escena t={t} t0={560.45} t1={565.6} zoom={0} entra="corte" golpes={[562.4]}>
        <Mundo t={t} cam={cam} e={{ flota: 559.0 }}>
          <Persona x={7280} y={gy(7280) + 4} h={300} t={t} seed={3} ropa={SAJON} expr="miedo" mira={Math.sin(t * 2.4) * 0.8} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />
          {Array.from({ length: 6 }, (_, i) => <Persona key={i} x={6500 + i * 110 + (t - 560.45) * 60} y={862} h={260} t={t} seed={580 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="enojado" flip={false} camina={1.2} />)}
        </Mundo>
        <Ch t={t} t0={560.6} t1={562.3} text="YOU CAME TO CUT OFF THEIR ESCAPE" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={562.4} text="BETWEEN THEIR SHIPS AND THEIR FRIENDS" y={220} size={80} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};

// llamitas en coordenadas de SVG (para el pueblo que arde en el mapa)
const Llamasvg: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>{[0, 1, 2].map((i) => <path key={i} d={`M ${x - 40 + i * 40} ${y + 20} Q ${x - 50 + i * 40} ${y - 30 - Math.sin(t * 12 + i) * 14} ${x - 40 + i * 40} ${y - 60} Q ${x - 25 + i * 40} ${y - 20} ${x - 20 + i * 40} ${y + 20} Z`} fill={i % 2 ? "#ffb24a" : "#ff6a3a"} />)}</g>
);

void Antorcha; void Tienda; void interpolate;
