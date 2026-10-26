import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote, fontFamily } from "./kit";
import { Mundo, camEn, Key, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, Globo } from "./comun";
import { Drakkar, Antorcha, Llamas, Tienda } from "./vik";

// 483,7-565,4 s · TRAMPA 5: LOS BARCOS. El plan nuevo (quemar los dragones), por qué casi nunca funcionó: roble mojado con
// brea, el barco de Gokstad (23 m, 32 remeros, 64 escudos), los rodillos, se van antes de que prendas la antorcha, menos de un
// metro de calado, y la mitad del ejército que vuelve por el río detrás de vos.
export const CAM5: Key[] = [
  [483.71, 5300, 640, 0.6], [486.13, 6380, 720, 1.05], [488.09, 6400, 730, 1.35], [491.4, 6410, 735, 1.45], [494.35, 7300, 760, 1.0],
  [525.53, 7900, 700, 0.75], [528.8, 8000, 720, 0.85], [532.6, 7850, 720, 0.95], [533.6, 7540, 760, 1.6], [538.05, 7800, 780, 1.1], [542.51, 8400, 760, 0.7],
  [560.45, 7300, 690, 0.85], [562.35, 7260, 720, 0.95], [565.39, 7250, 740, 1.05],
];

export const P5: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM5);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 5 · tu señor cambia el plan: olvidate de las tiendas, a los barcos */}
      <Escena t={t} t0={483.71} t1={491.4} zoom={0} entra="corte" golpes={[488.2, 490.0]}>
        <Mundo t={t} cam={cam} luna={[1700, 150, 70]}>
          {t > 485.6 && (() => { const lit = t > 489.6; const tx = t < 488.9 ? 6400 : t < 489.6 ? 6400 - prog(t, 488.9, 489.4) * 90 : 6310 + prog(t, 489.6, 490.1) * 120; const ty = t < 488.9 ? 700 : t < 489.6 ? 700 + prog(t, 488.9, 489.4) * 60 : 760 - prog(t, 489.6, 490.1) * 110; return <>
            {/* tu señor llega, señala los barcos y da la orden */}
            <Persona x={6560 - (1 - prog(t, 485.6, 486.8)) * 300} y={gy(6560) + 6} h={260} t={t} seed={4} ropa={SENOR} expr="enojado" habla={t > 486.8 && t < 490.6} camina={t < 486.8 ? 1.2 : 0} flip bD={t > 489.9 ? 130 : 30} cD={10} bI={t > 487.4 && t < 489.9 ? 60 : 10} cI={60} />
            {/* el chico: escucha, va a la fogata y prende la antorcha */}
            <Persona x={6420 - prog(t, 488.6, 489.2) * 40} y={gy(6420) + 6} h={240} t={t} seed={3} ropa={SAJON} expr={lit ? "enojado" : t > 488.2 ? "miedo" : "sorpresa"} mira={t < 488.6 ? 0.7 : -0.5} camina={t > 488.6 && t < 489.2 ? 1 : 0} inclina={t > 488.9 && t < 489.6 ? -14 : 0} bD={lit ? 150 : 70} cD={20} />
            <Antorcha x={tx} y={ty} s={0.34} t={t} apagada={!lit} rot={t > 488.9 && t < 489.6 ? -30 : 0} />
          </>; })()}
        </Mundo>
        <Cartel t={t} t0={483.8} t1={486.0} n={5} nombre="THE SHIPS" />
        <Ch t={t} t0={486.3} t1={489.9} text="NEW PLAN" color={C.violeta} x={120} y={150} size={60} />
        <Ch t={t} t0={488.2} t1={489.9} text="FORGET THE TENTS ✗" color={C.teal} tinta={C.noche} x={120} y={260} size={54} />
        <G t={t} t0={490.0} text="BURN THE DRAGONS" y={900} size={120} color={C.ambar} />
      </Escena>
      {/* 1 · la fantasía: los barcos arden y los vikingos quedan atrapados de tu lado del mar · buena idea, todos la tuvieron, casi nunca funcionó */}
      <Escena t={t} t0={491.4} t1={498.49} entra="iris" ix={960} iy={700} zoom={0.02} golpes={[492.4, 494.4, 495.7, 497.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a0e2a, #8a2a2a 80%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={780} width={1920} height={300} fill="#1e2a5a" /></svg>
        {[[520, 760, 0.5], [1100, 790, 0.56], [1560, 760, 0.46]].map(([x, y, s], i) => <Drakkar key={i} x={x} y={y} s={s} t={t} quema={i === 1 ? 0 : prog(t, 491.6 + i * 0.25, 493.4 + i * 0.25)} />)}
        {[0, 2].map((i) => <Llamas key={i} t={t} x={520 + i * 520} y={620} s={1.4 * ent(t, 491.8 + i * 0.25)} ancho={220} seed={i + 3} />)}
        {/* el del medio no prende: humo gris que sube y se apaga */}
        {t > 492.2 && Array.from({ length: 7 }, (_, i) => { const k = ((t - 492.2) * 0.5 + i / 7) % 1; return <div key={i} style={{ position: "absolute", left: 1100 + Math.sin(k * 6 + i) * 30 - 40 - k * 60, top: 700 - k * 360, width: 80 + k * 90, height: 80 + k * 90, borderRadius: "50%", background: "#8a86a0", opacity: (1 - k) * 0.55 }} />; })}
        <Particulas t={t} tipo="brasas" n={60} seed={9} />
        {t > 492.4 && Array.from({ length: 5 }, (_, i) => { const w = Math.sin(t * 6 + i * 1.3); return <Persona key={i} x={300 + i * 330} y={880} h={250} t={t} seed={540 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="triste" sombra="#1a0a14" aparece={492.4 + i * 0.1} bD={120 + w * 40} cD={30} bI={120 - w * 40} cI={30} salta={493.0 + i * 0.7} flip={i % 2 === 0} />; })}
        <Ch t={t} t0={492.4} t1={494.3} text="TRAPPED ON YOUR SIDE OF THE SEA" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={56} />
        <Ch t={t} t0={494.4} text="A GOOD IDEA ✓" color={C.lima} tinta={C.noche} x={300} y={150} size={56} />
        <Ch t={t} t0={495.7} text="EVERYBODY HAD IT" color={C.teal} tinta={C.noche} x={1000} y={150} size={56} />
        <Sello t={t} t0={497.0} text="IT ALMOST NEVER WORKED" x={960} y={420} size={90} rot={-6} />
      </Escena>
      {/* 2 · lo que querés quemar: tablones de roble superpuestos, con brea, mojados del río · Gokstad: 23 m, 32 remos, 64 escudos */}
      <Escena t={t} t0={498.49} t1={518.17} entra="zoom" zoom={0} golpes={[501.5, 503.6, 505.4, 507.8, 510.6, 515.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #16123d, #2a3a7a)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={790} width={1920} height={290} fill="#1d4f7a" /></svg>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${interpolate(t, [498.5, 506.1, 507.0, 510.4, 511.4, 518.1], [1.02, 1.08, 0.92, 0.92, 1.36, 1.34], { extrapolateRight: "clamp" })})`, transformOrigin: "1230px 820px" }}>
          {/* barco más chico y corrido a la derecha: la popa enrulada nunca queda encima del chico */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "translate(100px, 0) scale(0.895)", transformOrigin: "960px 780px" }}>
          <Drakkar x={960} y={780} s={0.95} t={t} remos={t > 510.6 ? 1.2 : 0} escudos={t > 515} vela={0} />
          {/* 32 remeros: suben y se sientan uno cada 0,15 s (dos filas de 16) y reman con los brazos ±25° a 1,2 Hz */}
          {Array.from({ length: 32 }, (_, n) => { const t0 = 498.6 + n * 0.15; if (t < t0) return null; const atras = n % 2 === 1; const i = Math.floor(n / 2); const e = ent(t, t0); const bx = 600 + i * 48 + (atras ? 22 : 0); const caida = (1 - Math.min(1, (t - t0) / 0.25)) * -70;
            const rema = t > t0 + 0.3 ? Math.sin((t - n * 0.1) * Math.PI * 2 * 1.2) * 25 : 0;
            const tun = ["#b5452c", "#3f6a9a", "#5a8a3a", "#8a5a9a", "#c9773a"][(i + (atras ? 2 : 0)) % 5], bar = ["#d9a441", "#a8552a", "#e8e4f0", "#6b4022"][(i + (atras ? 1 : 0)) % 4];
            return <svg key={n} style={{ position: "absolute", left: bx, top: (atras ? 806 : 818) + caida, overflow: "visible", opacity: Math.min(1, e * 2) * (atras ? 0.85 : 1) }} width={1} height={1}>
              <g transform={`${atras ? "scale(0.9) " : ""}rotate(${rema * 0.28})`}>
                <path d="M -20 0 L -16 -42 Q 0 -50 16 -42 L 20 0 Z" fill={tun} stroke="#2a1530" strokeWidth={4} />
                <g transform={`rotate(${rema} 0 -36)`}><line x1={0} y1={-36} x2={34} y2={-12} stroke="#f2b48a" strokeWidth={9} strokeLinecap="round" /><line x1={30} y1={-14} x2={46} y2={22} stroke="#8a5a32" strokeWidth={6} strokeLinecap="round" /></g>
                <circle cx={0} cy={-62} r={21} fill="#f2b48a" stroke="#2a1530" strokeWidth={4} />
                <path d={`M -16 -58 Q 0 ${-28} 16 -58 Q 8 -46 0 -46 Q -8 -46 -16 -58 Z`} fill={bar} stroke="#2a1530" strokeWidth={3} />
                <circle cx={6} cy={-66} r={3.4} fill="#2a1530" /><circle cx={-6} cy={-66} r={3.4} fill="#2a1530" />
                <path d="M -22 -74 Q 0 -104 22 -74 Z" fill="#9aa4b8" stroke="#2a1530" strokeWidth={4} />
              </g>
            </svg>; })}
          {/* gotas: mojado */}
          {t > 505.4 && t < 507.2 && Array.from({ length: 16 }, (_, i) => { const k = ((t * 1.4 + i / 16) % 1); return <div key={i} style={{ position: "absolute", left: 540 + i * 55, top: 680 + k * 160, width: 12, height: 20, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#9ad8ff", opacity: 1 - k }} />; })}
          </div>
        </div>
        {/* regla de 23 m bajo el barco, rotulada */}
        {t > 507.8 && t < 510.6 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <line x1={610} y1={985} x2={610 + 1050 * prog(t, 507.8, 509.0)} y2={985} stroke={C.ambar} strokeWidth={12} strokeLinecap="round" />
            <line x1={610} y1={955} x2={610} y2={1015} stroke={C.ambar} strokeWidth={10} />
            {t > 509 && <line x1={1660} y1={955} x2={1660} y2={1015} stroke={C.ambar} strokeWidth={10} />}
          </svg>
        )}
        {t > 507.8 && t < 510.6 && <div style={{ position: "absolute", left: 610 + 525 * prog(t, 507.8, 509.0), top: 925, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * ent(t, 507.8)})`, fontFamily, fontWeight: 700, fontSize: 40, color: C.noche, background: C.ambar, padding: "4px 18px", borderRadius: 12, boxShadow: "0 6px 0 rgba(20,10,50,.35)", whiteSpace: "nowrap" }}>≈24 M</div>}
        {/* vos con la antorcha: entero desde el cuadro 0; golpeás el casco, olés la brea, te gotea el río; con el zoom das un paso atrás */}
        {(() => { const kx = 215 - prog(t, 510.4, 511.1) * 25; const golpe = t > 501.5 && t < 503.2 ? Math.abs(Math.sin((t - 501.5) * 9)) * 50 : 0; return <>
          <Persona x={kx} y={1040} h={420} t={t} seed={3} ropa={SAJON} camina={t > 510.4 && t < 511.1 ? 1.2 : 0} mira={0.7} expr={t > 510.6 ? "miedo" : t > 507.7 ? "sorpresa" : t > 505.4 ? "triste" : t > 503.6 ? "enojado" : "neutro"}
            bD={t > 501.5 && t < 503.2 ? 70 + golpe : t > 510.6 ? 40 : 140} cD={t > 501.5 && t < 503.2 ? 60 : t > 510.6 ? 15 : -25} inclina={t > 503.6 && t < 505.2 ? 10 : t > 510.4 && t < 511.1 ? -8 : 0}
            manoD={<g><rect x={-7} y={-40} width={14} height={180} rx={5} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} /><ellipse cx={0} cy={150} rx={22} ry={30} fill="#3a2418" stroke="#2a1530" strokeWidth={4} /><path d={`M -20 160 Q -24 ${200 + Math.sin(t * 13) * 8} 0 ${222 + Math.sin(t * 9) * 10} Q 24 ${200 + Math.cos(t * 11) * 8} 20 160 Z`} fill="#ff8a2a" /><path d="M -9 162 Q -10 186 0 198 Q 10 186 9 162 Z" fill="#ffe07a" />{[0, 1, 2].map((i) => <path key={i} d={`M ${-8 + i * 8} 180 Q ${-20 + i * 8} ${220 + ((t * 60 + i * 30) % 60)} ${-4 + i * 8} 260`} stroke="#8a8aa0" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.6} />)}</g>} bI={t > 510.6 ? 40 : 18} cI={t > 510.6 ? 60 : 15} />
          {t > 503.6 && t < 505.4 && <Emote t={t} t0={503.6} tipo="enojo" x={kx + 20} y={560} s={0.8} />}
          {t > 505.4 && t < 507.7 && <Emote t={t} t0={505.4} tipo="sudor" x={kx + 20} y={620} s={0.8} />}
          {t > 510.6 && <Emote t={t} t0={510.7} tipo="excl" x={kx + 30} y={560} s={0.8} />}
        </>; })()}
        <Ch t={t} t0={498.7} t1={507.6} text="LOOK AT WHAT YOU'RE BURNING" color={C.violeta} x={960} y={150} centro size={58} />
        <Ch t={t} t0={501.5} t1={507.6} text="OVERLAPPING OAK PLANKS" color={C.ambar} tinta={C.noche} x={120} y={280} size={42} />
        <Ch t={t} t0={503.6} t1={507.6} text="SOAKED IN TAR" color={C.rojo} x={790} y={280} size={42} />
        <Ch t={t} t0={505.4} t1={507.6} text="WET FROM THE RIVER" color={C.teal} tinta={C.noche} x={1220} y={280} size={42} />
        <Ch t={t} t0={507.7} text="THE GOKSTAD SHIP" color={C.violeta} x={960} y={150} centro size={58} />
        
        <Cuenta t={t} t0={510.6} de={0} a={32} dur={1.9} x={330} y={210} size={130} color={C.crema} />
        <Ch t={t} t0={511.0} text="MEN ON THE OARS" color={C.teal} tinta={C.noche} x={330} y={320} centro size={44} />
        <Cuenta t={t} t0={515.0} de={0} a={64} dur={0.7} x={1390} y={210} size={130} color={C.rojo} />
        <Ch t={t} t0={515.4} text="SHIELDS" color={C.rojo} x={1610} y={210} centro size={44} />
      </Escena>
      {/* 3 · prenderle fuego a roble mojado, a oscuras, a mano, con alguien gritando */}
      <Escena t={t} t0={518.17} t1={525.53} entra="barrido" zoom={0.02} golpes={[519.4, 520.6, 521.8, 523.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={880} width={1920} height={200} fill="#1d3a5a" /></svg>
        {t > 522.5 && <Persona x={1360} y={850} h={300} t={t} seed={590} ropa={VIK(2)} casco="vikingo" barba={barbaDe(2)} expr="enojado" habla aparece={522.6} flip bD={110 + Math.sin(t * 12) * 15} cD={40} mira={-0.8} />}
        <Drakkar x={1150} y={760} s={0.8} t={t} />
        <Persona x={560} y={1000} h={560} t={t} seed={3} ropa={SAJON} expr={t > 523 ? "miedo" : "enojado"} bD={100 + Math.sin(t * 14) * 10} cD={40} />
        <Antorcha x={800} y={560} s={0.75} t={t} apagada={Math.sin(t * 7) < 0.5} />
        {/* chispas que se apagan */}
        {Array.from({ length: 8 }, (_, i) => { const k = ((t * 2 + i / 8) % 1); return <div key={i} style={{ position: "absolute", left: 830 + k * 140 + i * 6, top: 560 + k * 120 - i * 4, width: 10, height: 10, borderRadius: 5, background: "#ffb24a", opacity: (1 - k) * 0.8 }} />; })}
        <Emote t={t} t0={521.0} tipo="sudor" x={420} y={470} s={1.2} />
        {t > 523 && <Globo t={t} t0={523.0} x={1490} y={480} text="WHO'S THERE?!" cola="izq" size={52} />}
        <Ch t={t} t0={519.4} text="WET OAK" color={C.teal} tinta={C.noche} x={130} y={150} size={52} />
        <Ch t={t} t0={520.6} text="IN THE DARK" color={C.violeta} x={130} y={250} size={52} />
        <Ch t={t} t0={521.8} text="BY HAND" color={C.ambar} tinta={C.noche} x={760} y={150} size={52} />
        <Ch t={t} t0={523.0} text="SOMEONE SHOUTING" color={C.rojo} x={760} y={250} size={52} />
      </Escena>
      {/* 4 · lo mejor custodiado del campamento: tesoro, arma y camino a casa · en rodillos, listos para volver al agua · la alarma: ya reman */}
      <Escena t={t} t0={525.53} t1={542.53} zoom={0} entra="corte" golpes={[528.9, 530.3, 531.7, 533.2, 538.6]}>
        <Mundo t={t} cam={cam} e={{ barcosAlAgua: 538.6, cuerno: 538.1 }} luna={[1760, 150, 70]}>
          {/* guardias junto a los barcos */}
          {/* ronda: un guardia camina la orilla junto a los barcos; con la alarma corre a empujar */}
          {(() => { const v = Math.cos(t * 0.7); const x = t < 538.1 ? 7470 + (Math.sin(t * 0.7) + 1) * 55 : 7580 - Math.min(1, (t - 538.1) / 0.6) * 20; return <Persona x={x} y={gy(x) + 4} h={300} t={t} seed={560} ropa={VIK(1)} casco="vikingo" barba={barbaDe(1)} expr={t > 538.1 ? "enojado" : "neutro"} flip={t < 538.1 ? v < 0 : false} camina={t < 538.1 ? (Math.abs(v) > 0.2 ? 0.9 : 0) : 0} inclina={t > 538.6 ? 18 : 0} bI={t > 538.6 ? 80 : 8} manoD={<LanzaMano a={50} inclina={-10} largo={380} />} />; })()}
          <Persona x={7330} y={gy(7330) + 4} h={280} t={t} seed={565} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} expr={t > 538.1 ? "sorpresa" : "neutro"} salta={538.2} mira={0.6} bD={t > 538.1 ? 140 : 20} cD={30} manoD={<LanzaMano a={40} inclina={-10} largo={360} />} />
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
        <Ch t={t} t0={533.3} t1={538.0} text="ON WOODEN ROLLERS" color={C.ambar} tinta={C.noche} x={120} y={880} size={56} />
        <Ch t={t} t0={535.0} t1={538.0} text="READY TO SLIDE BACK IN" color={C.teal} tinta={C.noche} x={120} y={980} size={52} />
        <Flash t={t} t0={538.1} dur={0.18} color="#fff3c4" />
        <G t={t} t0={538.6} text="ALARM!" y={210} size={150} color={C.rojo} />
        <Ch t={t} t0={539.6} text="ROWING AWAY BEFORE YOU LIGHT A TORCH" color={C.violeta} x={960} y={390} centro size={52} />
      </Escena>
      {/* 5 · la trampa dentro de la trampa: menos de un metro de agua */}
      <Escena t={t} t0={542.53} t1={550.21} entra="iris" ix={960} iy={760} zoom={0} golpes={[544.9, 547.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #5a8ac8)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={0} y={600} width={1920} height={480} fill="#2f6aa8" opacity={0.85} />
          <path d="M 0 860 Q 480 820 960 860 T 1920 860 L 1920 1080 L 0 1080 Z" fill="#8a6a3e" />
          <line x1={0} y1={600} x2={1920} y2={600} stroke="#cfe8ff" strokeWidth={8} />
          {/* estela del drakkar que avanza */}
          {Array.from({ length: 5 }, (_, i) => { const k = ((t * 0.8 + i / 5) % 1); const dx = 440 + (t - 542.53) * 22; return <path key={i} d={`M ${dx + 120 - k * 260} ${612 + i * 9} q 30 -8 60 0`} stroke="#cfe8ff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={(1 - k) * 0.8} />; })}
        </svg>
        {/* el drakkar SÍ se mueve: avanza todo el plano por el agua baja (remando fuerte desde 547,8) */}
        {(() => { const dx = 440 + (t - 542.53) * 14 + prog(t, 547.8, 550.2) * 60; return <>
          <Drakkar x={dx} y={580} s={0.6} t={t} remos={t > 545 ? 1 : 0} />
          {/* vikingo en su barco: pasa saludando */}
          <Persona x={dx - 60} y={590} h={170} t={t} seed={595} ropa={VIK(3)} casco="vikingo" barba={barbaDe(3)} expr={t > 548.2 ? "feliz" : "neutro"} bD={t > 548.2 ? 150 + Math.sin(t * 12) * 20 : 20} cD={30} mira={0.7} />
          {/* regla de calado pegada a la popa: < 1 m */}
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <line x1={dx - 250} y1={600} x2={dx - 250} y2={600 + 70 * prog(t, 544.9, 545.6)} stroke={C.ambar} strokeWidth={12} />
            <line x1={dx - 280} y1={600} x2={dx - 220} y2={600} stroke={C.ambar} strokeWidth={8} />
            {t > 545.6 && <line x1={dx - 280} y1={670} x2={dx - 220} y2={670} stroke={C.ambar} strokeWidth={8} />}
          </svg>
        </>; })()}
        {/* barco «normal» de quilla honda, encallado en x≈1080-1520: se sacude con cada empujón pero no avanza */}
        {t > 547.8 && (() => { const emp = Math.max(0, Math.sin(t * 7)) * 1.6; return (
          <svg style={{ position: "absolute", left: 1000, top: 300, overflow: "visible", transform: `scale(${0.85 * ent(t, 547.8)}) rotate(${-emp}deg)`, transformOrigin: "300px 520px" }} width={600} height={600} viewBox="0 0 600 600">
            <path d="M 40 300 L 560 300 L 460 560 L 140 560 Z" fill="#6a4a2e" stroke="#2a1530" strokeWidth={10} />
            <rect x={290} y={40} width={20} height={260} fill="#5e3a1e" />
            <path d="M 310 60 L 470 200 L 310 240 Z" fill="#e8dcc0" stroke="#2a1530" strokeWidth={6} />
            <path d="M 200 560 L 240 520 L 270 560 M 360 560 L 400 520 L 430 560" stroke={C.rojo} strokeWidth={10} fill="none" />
          </svg>
        ); })()}
        {/* marineros ingleses empujando el barco encallado, enteros dentro de cuadro (x≈1480-1720) */}
        {t > 548.0 && [0, 1].map((i) => { const emp = Math.sin(t * 7 + i) * 4; return <Persona key={i} x={1450 + i * 100} y={880} h={220} t={t} seed={596 + i} ropa={i ? SENOR : SAJON} expr="enojado" flip inclina={-16 + emp} bD={95} cD={20} bI={85} cI={20} aparece={548.0 + i * 0.15} />; })}
        {t > 548.4 && <Emote t={t} t0={548.4} tipo="sudor" x={1575} y={610} s={0.6} />}
        <Ch t={t} t0={542.8} t1={544.8} text="THE TRAP INSIDE THE TRAP" color={C.rojo} x={960} y={150} centro size={60} />
        <G t={t} t0={545.0} text="< 1 METER OF WATER" x={930} y={190} size={96} color={C.crema} />
        <Ch t={t} t0={547.9} text="PLACES NO OTHER SHIP COULD GO" color={C.violeta} x={560} y={965} centro size={46} />
        <Sello t={t} t0={548.6} text="STUCK" x={1250} y={420} size={70} rot={-8} />
      </Escena>
      {/* 6 · la mitad del ejército puede no estar: 10 millas río arriba, saqueando, y vuelven de noche por el agua, detrás de vos */}
      <Escena t={t} t0={550.21} t1={560.45} entra="zoom" zoom={0.03} golpes={[551.8, 554.0, 557.6]}>
        <AbsoluteFill style={{ background: "#2f5a40" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 137) % 1080} r={26} fill="#2a5038" />)}
          <path id="rioS" d="M 1700 1120 C 1500 860 1700 700 1300 560 C 900 420 1100 220 700 160 C 400 110 300 0 200 -40" stroke="#3a7ac8" strokeWidth={80} fill="none" />
          {/* el campamento y vos */}
          <circle cx={1360} cy={830} r={75} fill="#7a5a3a" stroke="#2a1530" strokeWidth={8} />
          {[-1, 0, 1].map((d) => <path key={d} d={`M ${1360 + d * 34 - 20} ${842 - Math.abs(d) * 6} L ${1360 + d * 34} ${806 - Math.abs(d) * 6} L ${1360 + d * 34 + 20} ${842 - Math.abs(d) * 6} Z`} fill="#e8dcc0" stroke="#2a1530" strokeWidth={4} />)}
          {/* el pueblo río arriba */}
          <g transform="translate(560 160)" opacity={ent(t, 554.0)}>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 60 - 60} ${i % 2 * 30})`}><rect x={-22} y={-20} width={44} height={36} fill="#e8b98a" stroke="#2a1530" strokeWidth={5} /><path d="M -30 -20 L 0 -46 L 30 -20 Z" fill="#b5452c" stroke="#2a1530" strokeWidth={5} /></g>)}</g>
          {t > 554.6 && t < 556.6 && <Llamasvg x={560} y={130} t={t} />}
          {/* línea punteada «10 millas» */}
          <path d="M 1360 757 C 1300 560 900 420 620 170" stroke={C.ambar} strokeWidth={10} strokeDasharray="20 16" fill="none" pathLength={1} style={{ strokeDasharray: `${prog(t, 553.9, 555.0)} 1` }} />
        </svg>
        {/* barcos: suben y vuelven */}
        {(() => {
          const ida = prog(t, 551.8, 553.8), vuelta = prog(t, 557.6, 560.2);
          // siguen el río; el muelle queda en x≈1510-1770, y≈925 (a la derecha del campamento y del chico)
          const pts: [number, number][] = [[1640, 930], [1590, 830], [1560, 745], [1505, 670], [1403, 608], [1300, 560], [999, 330], [790, 215]];
          const at = (u: number) => { const k = u * (pts.length - 1); const i = Math.min(pts.length - 2, Math.floor(k)); const f = k - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; };
          const vuelve = t >= 557.6;
          return [0, 1, 2].map((i) => { const uu = vuelve ? (1 - i * 0.12) * (1 - vuelta) + i * 0.22 * vuelta : ida - i * 0.12; if (i > 0 && uu <= 0) return null; const [x, y] = at(Math.max(0, Math.min(1, uu))); return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: y, transform: `scale(0.18) scaleX(${vuelve ? 1 : -1})` }}><Drakkar x={0} y={0} s={1} t={t} vela={0} remos={1.4} escudos /></div>
            {[-1, 1].map((d) => <Persona key={d} x={x + d * 30} y={y + 6} h={74} t={t} seed={600 + i * 2 + d} ropa={VIK(i + d + 2)} casco="vikingo" barba={barbaDe(i + 2)} expr={vuelve ? "enojado" : "feliz"} flip={!vuelve} bD={60 + Math.sin(t * 8 + i) * 30} cD={20} />)}
          </React.Fragment>; });
        })()}
        <div style={{ position: "absolute", left: 1150, top: 900 }}><Persona x={0} y={0} h={230} t={t} seed={3} ropa={SAJON} expr={t > 558 ? "miedo" : t > 554 ? "sorpresa" : "neutro"} mira={t > 558 ? 0.8 : -0.6} miraY={t > 554 && t < 558 ? -0.6 : 0} flip={t > 558} salta={558.2}
          bI={t > 554 && t < 557.8 ? 150 : 8} cI={t > 554 && t < 557.8 ? 120 : 10} bD={t > 558.2 ? 120 : 8} cD={t > 558.2 ? 30 : 10} /></div>
        {t > 558.2 && <Emote t={t} t0={558.2} tipo="susto" x={1150} y={760} s={0.6} />}
        <Ch t={t} t0={550.4} t1={553.8} text="HALF THE ARMY MIGHT NOT EVEN BE THERE" color={C.violeta} x={130} y={985} size={46} />
        <Ch t={t} t0={554.0} text="10 MILES UP THE RIVER" color={C.ambar} tinta={C.noche} x={130} y={470} size={50} />
        <Ch t={t} t0={555.0} text="RAIDING THE NEXT VILLAGE" color={C.rojo} x={130} y={570} size={46} />
        <Ch t={t} t0={557.6} text="BACK IN THE DARK · BY WATER" color={C.teal} tinta={C.noche} x={130} y={985} size={48} />
        <Sello t={t} t0={558.8} text="BEHIND YOU" x={640} y={760} size={76} rot={-8} />
        <Ch t={t} t0={550.5} text="YOUR CAMP" color={C.crema} tinta={C.noche} x={1360} y={950} centro size={40} />
      </Escena>
      {/* 7 · viniste a cortarles la retirada · terminás parado entre sus barcos y sus amigos */}
      <Escena t={t} t0={560.45} t1={565.6} zoom={0} entra="corte" golpes={[562.4]}>
        <Mundo t={t} cam={cam} e={{ flota: 560.6 }} luna={[1760, 330, 55]}>
          <Persona x={7280} y={gy(7280) + 4} h={300} t={t} seed={3} ropa={SAJON} expr="miedo" mira={Math.sin(t * 2.4) * 0.8} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />
          {/* los que vuelven del saqueo: caminan, se frenan y giran la cabeza hacia vos */}
          {Array.from({ length: 6 }, (_, i) => { const x = 6380 + i * 92 + Math.min(t - 560.45, 1.9 - i * 0.12) * 130; const para = t > 562.35 - i * 0.12; return <Persona key={i} x={x} y={862} h={260} t={t} seed={580 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={para ? "enojado" : "neutro"} camina={para ? 0 : 1.2} mira={para ? 1 : 0.3} bD={para && i % 2 === 0 ? 80 : 20} cD={30} manoD={i % 2 === 1 ? <LanzaMano a={40} inclina={-10} largo={340} /> : undefined} />; })}
          {t > 562.6 && [0, 2, 4].map((i) => <Emote key={i} t={t} t0={562.6 + i * 0.1} tipo="excl" x={6380 + i * 92 + (1.9 - i * 0.12) * 130} y={640} s={0.6} />)}
        </Mundo>
        <Ch t={t} t0={560.6} t1={562.3} text="YOU CAME TO CUT OFF THEIR ESCAPE" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={562.4} text="BETWEEN THEIR SHIPS AND THEIR FRIENDS" y={150} size={74} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};

// llamitas en coordenadas de SVG (para el pueblo que arde en el mapa)
const Llamasvg: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>{[0, 1, 2].map((i) => <path key={i} d={`M ${x - 40 + i * 40} ${y + 20} Q ${x - 50 + i * 40} ${y - 30 - Math.sin(t * 12 + i) * 14} ${x - 40 + i * 40} ${y - 60} Q ${x - 25 + i * 40} ${y - 20} ${x - 20 + i * 40} ${y + 20} Z`} fill={i % 2 ? "#ffb24a" : "#ff6a3a"} />)}</g>
);

void Antorcha; void Tienda; void interpolate;
