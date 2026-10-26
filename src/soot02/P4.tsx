import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { Persona, APION } from "./persona";
import { Franja, C, fontFamily, ent, prog, Escena, Cam, Chip, Grande, Emote, cabeza } from "./kit";
import { Apion, Sala } from "./actor";
import { Galera, Corte, Remero, Espolon, MapaMar, Pancarta, CuentaN, Flecha, Salpica, Submarino, Burbujas } from "./mar";

// soot02 · trampa 4, EL ESPOLÓN (442,08-537,95 s). La proa → el rostrum → los espolones de las Égadas en el fondo del mar
// → el de Athlit (465 kg) → la embestida vista desde arriba → vos de espaldas, nunca lo ves venir → el agua entra por tu fila
// → el barco no se hunde (lo remolcan), vos sí → Roma tuvo que aprender de cero.
const pp = (h: number, cy: number) => cy + 450 * (h / 560);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// galera vista desde arriba (para la táctica)
const GaleraArriba: React.FC<{ x: number; y: number; rot: number; s?: number; t: number; boga: number; color?: string; roto?: number }> = ({ x, y, rot, s = 1, t, boga, color = "#9a5a2a", roto = 0 }) => {
  const f = t * boga * Math.PI * 2;
  return (
    <svg style={{ position: "absolute", left: x - 400 * s, top: y - 400 * s, overflow: "visible" }} width={800 * s} height={800 * s} viewBox="-400 -400 800 800">
      <g transform={`rotate(${rot})`}>
        {Array.from({ length: 14 }, (_, i) => [-1, 1].map((d) => { const a = boga ? Math.sin(f + i * 0.02) * 14 : 0; return <line key={i + "" + d} x1={-200 + i * 30} y1={d * 44} x2={-200 + i * 30 + a * 2} y2={d * (150 - Math.abs(a))} stroke="#d8a868" strokeWidth={6} />; }))}
        <path d="M -260 -50 Q -280 0 -260 50 L 200 52 Q 270 40 300 0 Q 270 -40 200 -52 Z" fill={color} stroke="#5a3418" strokeWidth={8} />
        <path d="M -230 -26 L 200 -26 M -230 26 L 200 26" stroke="#5a3418" strokeWidth={5} opacity={0.6} />
        <path d="M 296 -16 L 380 0 L 296 16 Z" fill="#d9962e" stroke="#6a3a0a" strokeWidth={5} />
        {roto > 0 && <path d="M -30 50 L -10 20 L 10 46 L 30 14 L 50 50 Z" fill="#1a0a0a" transform={`scale(${roto})`} />}
      </g>
    </svg>
  );
};
// un piedra que cae (para «no se hundían como piedras»)
const Piedra: React.FC<{ t: number; t0: number; x: number }> = ({ t, t0, x }) => {
  if (t < t0) return null;
  const u = prog(t, t0, t0 + 1.0);
  return <svg style={{ position: "absolute", left: x - 70, top: 300 + u * u * 760 }} width={140} height={110}><path d="M 10 60 Q 0 20 40 10 Q 90 0 120 30 Q 140 70 110 95 Q 60 110 20 95 Z" fill="#8a8f9f" stroke="#4a4f5f" strokeWidth={6} /></svg>;
};

export const P4: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 442,08 · TRAP #4 · THE RAM */}
    <Escena t={t} t0={442.08} t1={444.1} entra="atraviesa" ix={1500} iy={640} sale="nada" fondo="none" golpes={[442.4, 443.2]}>
      <Galera x={interpolate(t, [442, 444.2], [900, 1000])} y={700} s={0.5} t={t} boga={1.4} vela={false} />
      <Pancarta t={t} t0={442.1} n={4} titulo="THE RAM" y={400} />
      <Apion t={t} t0={442.2} x={1620} y={1050} h={420} borda={1020} acts={[[442.2, "asombro"], [443.2, "miedo"]]} />
    </Escena>

    {/* 444,1 · "On the front of every Roman warship, right at the waterline, sits a huge bronze beak, the rostrum, the ram" */}
    <Escena t={t} t0={444.1} t1={451.3} entra="nada" sale="baja" fondo="none" quieta golpes={[446.1, 447.1, 449.3]}>
      <Cam t={t} k={[[444.1, 960, 560, 1.0], [446.0, 1500, 600, 2.2], [449.0, 1500, 600, 2.2], [451.3, 1500, 640, 2.6]]}>
        <Galera x={960} y={600} s={0.8} t={t} boga={0.4} vela={false} />
        {t > 446.0 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><line x1={1200} y1={600} x2={1900} y2={600} stroke="#fff" strokeWidth={4} strokeDasharray="12 10" opacity={prog(t, 446.1, 446.5)} /></svg>}
        {t > 447.0 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><circle cx={1640} cy={612} r={30 + 60 * prog(t, 447.0, 447.6)} fill="none" stroke={C.oro} strokeWidth={6} opacity={1 - prog(t, 448, 449)} /></svg>}
      </Cam>
      <Chip t={t} t0={444.1} t1={445.9} text="THE FRONT OF EVERY WARSHIP" color={C.violeta} x={960} y={150} centro size={56} />
      <Chip t={t} t0={446.1} text="AT THE WATERLINE" color="#1d6f8a" x={1300} y={640} centro size={56} />
      <Chip t={t} t0={447.06} text="A HUGE BRONZE BEAK" color={C.oro} tinta={C.noche} x={960} y={260} centro size={58} />
      <Apion t={t} t0={444.2} x={250} y={1050} h={420} borda={1020} flip={false} acts={[[444.3, "habla"], [446.1, "senala"], [449.3, "asombro"]]} />
      <Grande t={t} t0={449.26} text="ROSTRUM" x={1250} y={820} size={150} color={C.crema} />
    </Escena>

    {/* 451,3 · "In the sea off western Sicily..." mapa → 453,2 abajo del agua: "divers found 20+ rams on the seabed... 241 BC... inscriptions with names of officials who paid" */}
    <Escena t={t} t0={451.3} t1={465.2} entra="baja" sale="fundido" fondo="#143e70" golpes={[451.3, 454.4, 458.4, 461.8]}>
      {t < 453.35 && <MapaMar t={t} puntos={[{ n: "AEGATES", t0: 451.4, label: true }]} zoom={{ n: "AEGATES", z: 3.2, t: [451.4, 453.2] }} />}
      {t >= 452.95 && (
        <AbsoluteFill style={{ opacity: prog(t, 452.95, 453.3) }}>
          <Submarino t={t} />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d="M 0 900 Q 400 860 900 890 Q 1400 920 1920 870 L 1920 1080 L 0 1080 Z" fill="#c9b07a" />
            <path d="M 0 960 Q 600 930 1200 960 Q 1600 980 1920 950 L 1920 1080 L 0 1080 Z" fill="#b39860" />
            {[[200, 120], [560, 220], [1700, 160]].map(([x, h], i) => <path key={i} d={`M ${x} 900 q ${Math.sin(t * 1.5 + i) * 20} ${-h / 2} 0 ${-h}`} stroke="#3f8f3e" strokeWidth={14} fill="none" strokeLinecap="round" />)}
          </svg>
          {[[300, 880, 0.26, -8], [700, 900, 0.3, 6], [1100, 905, 0.24, -4], [1450, 885, 0.28, 10], [1750, 900, 0.22, -12], [520, 950, 0.2, 14], [1280, 960, 0.22, -10]].map(([x, y, s, r], i) => <Espolon key={i} x={x} y={y} s={s * (0.55 + 0.45 * ent(t, 453.1 + i * 0.1))} rot={r} />)}
          {/* buzo */}
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <g transform={`translate(${interpolate(t, [453.2, 465], [1500, 760])} ${560 + Math.sin(t * 1.2) * 20}) rotate(-12)`}>
              <rect x={-120} y={-30} width={200} height={60} rx={30} fill="#2a2a3a" />
              <rect x={-100} y={-62} width={120} height={34} rx={14} fill="#e8b42a" />
              <circle cx={110} cy={0} r={38} fill="#c98b62" /><rect x={92} y={-24} width={50} height={30} rx={10} fill="#bfe8ff" stroke="#2a2a3a" strokeWidth={6} />
              <path d={`M -120 -10 L -200 ${-30 + Math.sin(t * 6) * 20} L -230 ${-10 + Math.sin(t * 6) * 30} M -120 10 L -200 ${30 - Math.sin(t * 6) * 20} L -230 ${10 - Math.sin(t * 6) * 30}`} stroke="#2a2a3a" strokeWidth={22} strokeLinecap="round" fill="none" />
              <path d={`M 60 20 L 150 ${70 + Math.sin(t * 2) * 10}`} stroke="#2a2a3a" strokeWidth={18} strokeLinecap="round" />
              <circle cx={170} cy={-60} r={60} fill="#fff8c4" opacity={0.18} />
            </g>
          </svg>
          <Burbujas t={t} n={18} seed={3} x={1100} ancho={600} />
          {t > 461.6 && (
            <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${ent(t, 461.6)})`, background: "#d9962e", border: "10px solid #6a3a0a", borderRadius: 24, padding: "28px 50px", fontFamily: "serif", fontWeight: 700, fontSize: 64, color: "#5a3008", letterSpacing: 8, textAlign: "center", boxShadow: "0 16px 0 rgba(10,5,30,.5)" }}>
              <div>· · · · · · · ·</div><div>PROBAVIT</div><div style={{ fontFamily, fontSize: 30, letterSpacing: 2, color: "#3a1a00" }}>"APPROVED BY…" (THE OFFICIAL WHO PAID)</div>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Chip t={t} t0={451.3} t1={453.2} text="OFF WESTERN SICILY" color={C.violeta} x={960} y={150} centro size={56} />
      <Chip t={t} t0={453.3} t1={461.4} text="DIVERS FOUND" color="#1d6f8a" x={120} y={140} size={56} />
      <CuentaN t={t} t0={454.4} t1={455.2} a={20} suf="+ RAMS" x={500} y={300} size={110} color={C.oro} />
      <Chip t={t} t0={458.4} t1={461.4} text="REAL BATTLE · 241 BC" color={C.rojo} x={1400} y={140} centro size={56} />
      <Chip t={t} t0={461.8} text="INSCRIPTIONS" color={C.oro} tinta={C.noche} x={960} y={250} centro size={60} />
    </Escena>

    {/* 465,2 · "one ram found off the coast of Israel weighs 465 kilos of solid bronze" */}
    <Escena t={t} t0={465.2} t1={471.8} entra="fundido" sale="fundido" fondo="#2d1b69" golpes={[465.9, 467.4, 468.5, 471.3]}>
      <Sala t={t} />
      {/* báscula */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <rect x={560} y={820} width={800} height={60} rx={14} fill="#c8ccd4" stroke="#4a4f5f" strokeWidth={8} />
        <rect x={900} y={880} width={120} height={140} fill="#8a8f9f" />
        <rect x={700} y={1010} width={520} height={50} rx={12} fill="#6a6f82" />
      </svg>
      <Espolon x={960} y={interpolate(t, [465.2, 465.9], [-300, 690], cl) + (t > 465.9 ? Math.sin((t - 465.9) * 30) * Math.max(0, 14 - (t - 465.9) * 30) : 0)} s={0.95} />
      <Persona x={1560} y={1010} h={460} t={t} seed={2} ropa={APION} expr={t < 465.9 ? "miedo" : "sorpresa"} salta={465.95} mira={-0.8} bI={t > 466 ? 150 + Math.sin(t * 6) * 15 : 30} bD={t > 466 ? 150 + Math.sin(t * 6 + 1) * 15 : 30} />
      <Emote t={t} t0={468.6} tipo="excl" x={1560} y={1010 - 360} s={1.2} />
      <CuentaN t={t} t0={468.5} t1={469.8} a={465} suf=" KG" x={960} y={300} size={170} color={C.crema} />
      <Chip t={t} t0={467.4} text="ATHLIT RAM · ISRAEL" color="#1d6f8a" x={960} y={130} centro size={56} />
      <Chip t={t} t0={471.0} text="SOLID BRONZE" color={C.oro} tinta={C.noche} x={960} y={1030} centro size={52} />
    </Escena>

    {/* 471,8 · "The tactic is simple and brutal. 300 men sprint the ship forward and the ram punches a hole into the side of the enemy. Then everybody rows backwards..." (vista de arriba) */}
    <Escena t={t} t0={471.8} t1={485.2} entra="fundido" sale="fundido" fondo="#1f5c9c" golpes={[472.4, 474.1, 477.1, 479.4]}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3a8fd0, #1f5c9c 70%, #143e70)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${((i * 173 + t * 20) % 2000) - 100} ${80 + i * 72} q 30 -12 60 0 t 60 0`} stroke="#fff" strokeOpacity={0.2} strokeWidth={4} fill="none" />)}</svg>
      {(() => {
        const ida = interpolate(t, [474.1, 477.6], [-80, 1000], cl);
        const vuelta = interpolate(t, [479.4, 484], [0, -620], cl);
        const x = ida + vuelta;
        const roto = prog(t, 477.6, 477.9);
        return (
          <>
            <GaleraArriba x={1340} y={540 + (t > 477.6 ? Math.sin(t * 2) * 12 : 0)} rot={90 + (t > 477.6 ? roto * 8 : 0)} s={1.1} t={t} boga={t > 477.6 ? 0 : 0.4} color="#3a2a3a" roto={roto} />
            <GaleraArriba x={x} y={560} rot={0} s={1.1} t={t} boga={t < 474.1 ? 0.3 : t < 477.6 ? 1.6 : t < 479.4 ? 0 : -1.4} />
            {t > 474.3 && t < 477.6 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{Array.from({ length: 6 }, (_, i) => <line key={i} x1={x - 520 - i * 60} y1={480 + i * 30} x2={x - 360 - i * 60} y2={480 + i * 30} stroke="#fff" strokeWidth={8} opacity={0.6} strokeLinecap="round" />)}</svg>}
            <Salpica t={t} t0={477.6} x={1260} y={560} s={1.8} />
            {t > 477.6 && t < 478.0 && <AbsoluteFill style={{ background: "#fff", opacity: 0.3 * (1 - prog(t, 477.6, 478.0)) }} />}
            {t > 479.4 && <Flecha t={t} t0={479.6} x1={x - 200} y1={760} x2={x - 520} y2={760} color={C.ambar} />}
          </>
        );
      })()}
      <Apion t={t} t0={472.0} x={1700} y={1050} h={400} borda={1020} acts={[[472.4, "habla"], [474.1, "rema"], [477.2, "festeja"], [479.4, "rema"], [482.0, "miedo"]]} />
      <Chip t={t} t0={472.4} t1={477.4} text="SIMPLE + BRUTAL" color={C.rojo} x={120} y={130} size={60} />
      {t < 479.3 && <CuentaN t={t} t0={474.1} t1={474.9} a={300} suf=" MEN SPRINT" x={600} y={830} size={90} color={C.crema} />}
      <Grande t={t} t0={477.2} text="PUNCH!" x={1340} y={220} size={170} color={C.rojo} />
      <Chip t={t} t0={479.4} text="NOW ROW BACKWARDS!" color={C.ambar} tinta={C.noche} x={960} y={830} centro size={62} />
      <Chip t={t} t0={482.0} text="BEFORE YOU GET STUCK" color={C.violeta} x={960} y={720} centro size={50} />
    </Escena>

    {/* 485,2 · "the part that should worry you. Rowers sit facing the back of the ship. You never see where you are going... the enemy... their ram. The only warning is the crash." */}
    <Escena t={t} t0={485.2} t1={498.7} entra="fundido" sale="fundido" fondo="none" quieta golpes={[487.2, 488.6, 490.5, 492.6, 494.1, 496.6]}>
      <div style={{ position: "absolute", inset: 0, transform: t > 496.5 && t < 497.1 ? `translate(${Math.sin(t * 90) * 22 * (497.1 - t)}px, ${Math.cos(t * 77) * 16 * (497.1 - t)}px)` : undefined }}>
      <Cam t={t} k={[[485.2, 960, 540, 1.0], [487.0, 960, 540, 1.0], [488.4, 620, 560, 1.7], [493.9, 620, 560, 1.7], [495.6, 960, 540, 1.0], [498.7, 960, 540, 1.0]]}>
        <Galera x={760} y={650} s={0.75} t={t} boga={0.6} vela={false} marines={false} rompe={prog(t, 496.5, 496.8)} />
        {/* el remero de espaldas, con globo de visión hacia atrás */}
        {/* el enemigo que viene por detrás de tu espalda (desde la derecha) */}
        {t > 492.6 && <Galera x={interpolate(t, [492.6, 496.5], [2700, 1720], cl)} y={660} s={0.75} t={t} boga={1.6} vela={false} flip color="#3a2a3a" franja="#1a1a1a" marines={false} />}
      </Cam>
      </div>
      {t > 488.4 && t < 496.6 && <div style={{ position: "absolute", left: 120, top: 560, width: 440, height: 440, borderRadius: 220, overflow: "hidden", background: "radial-gradient(circle, #6a3a1e, #2a1408)", border: "10px solid #2fb5d8", transform: `scale(${ent(t, 488.4) * (1 - prog(t, 496.2, 496.6))})` }}>
        <svg style={{ position: "absolute", inset: 0 }} width={440} height={440}><g transform="translate(250 330) scale(0.95)"><Remero fase={t * 3.6} ropa="#2fb5d8" piel="#c98b62" pelo="#1d1410" expr={t > 494 ? "miedo" : "cansado"} seed={2} t={t} /></g></svg>
      </div>}
      {t > 488.4 && t < 496.6 && <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}><path d={`M 560 780 L 1000 ${640} L 1000 760 Z`} fill="#fff8c4" opacity={0.18 * ent(t, 488.6)} /></svg>}
      {t > 496.5 && t < 497.0 && <AbsoluteFill style={{ background: "#fff", opacity: 0.3 * (1 - prog(t, 496.5, 497.0)) }} />}
      <Chip t={t} t0={485.2} t1={488.2} text="THE PART THAT SHOULD WORRY YOU" color={C.rojo} x={960} y={150} centro size={56} />
      <Chip t={t} t0={488.6} text="YOU FACE BACKWARDS" color={C.violeta} x={120} y={130} size={54} />
      <Chip t={t} t0={488.6} t1={495.4} text="SHIP GOES →" color="#1d6f8a" x={1400} y={130} size={54} />
      <Chip t={t} t0={490.5} text="✕ WHERE YOU'RE GOING" color={C.noche} x={120} y={240} size={46} />
      <Chip t={t} t0={492.6} text="✕ THE ENEMY" color={C.noche} x={120} y={330} size={46} />
      <Chip t={t} t0={494.1} text="✕ THEIR RAM" color={C.rojo} x={120} y={420} size={46} />
      {t > 496.45 && <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Salpica t={t} t0={496.5} x={1090} y={640} s={2.0} n={30} />
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{Array.from({ length: 16 }, (_, i) => { const u = t - 496.5; const a = -2.6 + (i / 15) * 2.2; const v = 500 + (i % 4) * 160; return <rect key={i} x={1090 + Math.cos(a) * v * u} y={640 + Math.sin(a) * v * u + 900 * u * u} width={34} height={10} rx={3} fill={i % 2 ? "#9a5a2a" : "#c9874a"} transform={`rotate(${u * 720 * (i % 2 ? 1 : -1)} ${1090 + Math.cos(a) * v * u} ${640 + Math.sin(a) * v * u + 900 * u * u})`} opacity={Math.max(0, 1 - u * 0.8)} />; })}</svg>
      </div>}
      <Grande t={t} t0={496.6} text="CRASH." y={860} size={200} color={C.crema} />
    </Escena>

    {/* 498,7 · "when your ship gets hit, the hole is down low at the waterline, exactly where the bottom row sits... wedged between benches, oars, other men, in the dark... same few openings" */}
    <Escena t={t} t0={498.7} t1={515.1} entra="fundido" sale="fundido" fondo="#3a1c0e" quieta golpes={[500.2, 502.7, 505.3, 509.8, 510.3, 511.1, 512.1]}>
      <Cam t={t} k={[[498.7, 960, 540, 1.0], [504.8, 960, 540, 1.0], [505.6, 860, 700, 1.4], [511.0, 860, 700, 1.4], [512.2, 960, 540, 1.0], [515.1, 960, 520, 1.05]]}>
        <Corte t={t} boga={interpolate(t, [498.7, 503], [0.6, 0], cl)} caos={1} agua={interpolate(t, [502.7, 514.5], [0.06, 0.55], cl)} heroeExpr="miedo" luz={0.5} oscuro={interpolate(t, [508, 511.1], [0, 0.6], cl)} inclina={interpolate(t, [498.7, 500, 515], [0, 4, 7], cl)} hortator={false} />
        {/* el agujero en la fila de abajo */}
        {t > 500.1 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <path d="M 1400 760 L 1450 720 L 1490 770 L 1550 730 L 1560 800 L 1600 840 L 1520 860 L 1480 820 L 1420 850 Z" fill="#0a1a3a" transform={`translate(${1500 * (1 - ent(t, 500.2))} 0) scale(${ent(t, 500.2)})`} style={{ transformOrigin: "1500px 790px" }} />
          {Array.from({ length: 12 }, (_, i) => { const u = ((t * 1.8 + i / 12) % 1); return <path key={i} d={`M 1460 ${780 + (i % 4) * 18} q ${-80 - u * 200} ${-30 + u * 160} ${-180 - u * 320} ${u * 260}`} stroke="#7fd6ff" strokeWidth={10} fill="none" opacity={0.9 * (1 - u)} />; })}
        </svg>}
        {/* las salidas: pocas escotillas arriba */}
        {t > 512.0 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{[480, 1440].map((x) => <g key={x}><rect x={x - 60} y={0} width={120} height={70} fill="#ffe8a8" opacity={0.9} /></g>)}</svg>}
        {t > 512.0 && <Flecha t={t} t0={512.1} x1={800} y1={600} x2={520} y2={110} color={C.lima} />}
        {t > 512.0 && <Flecha t={t} t0={512.3} x1={1200} y1={600} x2={1420} y2={110} color={C.lima} />}
      </Cam>
      <Franja t={t} />
      <Franja t={t} abajo />
      <Chip t={t} t0={500.15} t1={504.8} text="THE HOLE: DOWN LOW" color={C.rojo} x={120} y={140} size={58} />
      <Chip t={t} t0={502.7} t1={504.8} text="= THE BOTTOM ROW" color={C.noche} x={120} y={250} size={58} />
      <Chip t={t} t0={505.3} t1={511.8} text="WATER: YOUR LEVEL FIRST" color="#1d6f8a" x={960} y={850} centro size={56} />
      <Chip t={t} t0={507.2} t1={511.8} text="WEDGED IN" color={C.violeta} x={960} y={960} centro size={56} />
      <Chip t={t} t0={509.83} t1={511.8} text="OARS" color={C.oro} tinta={C.noche} x={1760} y={380} centro size={46} />
      <Chip t={t} t0={510.27} t1={511.8} text="MEN" color={C.ambar} tinta={C.noche} x={1760} y={470} centro size={46} />
      <Chip t={t} t0={511.13} t1={511.8} text="DARK" color={C.noche} x={1760} y={560} centro size={46} />
      <Chip t={t} t0={512.05} text="ALL FOR THE SAME FEW OPENINGS" color={C.rojo} x={960} y={960} centro size={58} />
    </Escena>

    {/* 515,1 · "The strangest part? Ancient warships often did not sink like stones... wood, no heavy ballast, so they flooded and stayed afloat, half underwater" */}
    <Escena t={t} t0={515.1} t1={525.3} entra="fundido" sale="paneo" fondo="none" golpes={[515.1, 516.4, 519.3, 522.2]}>
      <Galera x={900} y={interpolate(t, [520, 524.2], [640, 720], cl)} s={0.7} t={t} boga={0} vela={false} marines={false} rompe={1} balanceo={0.4} color="#3a2a3a" franja="#1a1a1a" agua="#1f5c9c" aguaY={interpolate(t, [520, 524.2], [70, -20], cl)} />
      <Piedra t={t} t0={516.4} x={1600} />
      <Apion t={t} t0={515.2} x={260} y={1050} h={420} borda={1020} flip={false} acts={[[515.3, "piensa"], [519.3, "asombro"], [522.2, "senala"]]} />
      <Chip t={t} t0={515.1} text="THE STRANGEST PART?" color={C.violeta} x={960} y={140} centro size={62} />
      <Chip t={t} t0={516.4} t1={518.6} text="DIDN'T SINK LIKE STONES" color={C.rojo} x={1500} y={250} centro size={52} />
      <Chip t={t} t0={519.3} text="WOOD + NO BALLAST" color={C.oro} tinta={C.noche} x={120} y={250} size={56} />
      <Chip t={t} t0={522.2} text="FLOODED... BUT AFLOAT" color="#1d6f8a" x={960} y={830} centro size={60} />
      <Chip t={t} t0={524.2} text="HALF UNDERWATER" color={C.noche} x={960} y={730} centro size={52} />
    </Escena>

    {/* 525,3 · "After the battle, the winners simply towed them away. The ship survived. The bottom row usually did not." */}
    <Escena t={t} t0={525.3} t1={531.4} entra="paneo" sale="fundido" fondo="none" golpes={[526.4, 528.3, 529.6]}>
      {(() => { const dx = interpolate(t, [526.3, 531.4], [0, 400], cl); return (
        <>
          <Galera x={1300 + dx} y={640} s={0.45} t={t} boga={0.6} vela />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d={`M ${1300 + dx - 0.45 * 700} 640 Q ${960 + dx} 700 ${560 + dx + 0.5 * 600} 700`} stroke="#c9a46a" strokeWidth={8} fill="none" /></svg>
          <Galera x={560 + dx} y={700} s={0.5} t={t} boga={0} vela={false} marines={false} rompe={1} color="#3a2a3a" franja="#1a1a1a" aguaY={-20} balanceo={0.3} />
        </>
      ); })()}
      <Apion t={t} t0={525.4} x={1700} y={1050} h={420} borda={1020} acts={[[525.6, "habla"], [528.3, "festeja"], [529.6, "triste"]]} />
      <Chip t={t} t0={526.35} text="TOWED AWAY" color={C.violeta} x={120} y={140} size={60} />
      <Chip t={t} t0={528.27} text="THE SHIP SURVIVED ✓" color={C.lima} tinta={C.noche} x={760} y={240} centro size={60} />
      <Chip t={t} t0={529.55} text="THE BOTTOM ROW... ✕" color={C.rojo} x={760} y={350} centro size={60} />
    </Escena>

    {/* 531,4 · "this is the kind of war Rome had to learn from scratch. Which brings us to the most famous trick in Roman naval history" */}
    <Escena t={t} t0={531.4} t1={538.0} entra="fundido" sale="atraviesa" sx={1300} sy={420} fondo="#2d1b69" golpes={[532.4, 534.6, 536.4]}>
      <Sala t={t} />
      <Persona x={560} y={pp(760, 470)} h={760} t={t} seed={140} ropa={{ tunica: "#f2ead8", tunica2: "#c9b8a0", cinto: "#a3202f", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2214" }} expr={t < 534.5 ? "triste" : "sorpresa"} bD={t > 534.5 ? 150 + Math.sin(t * 5) * 12 : 80 + Math.sin(t * 4) * 25} cD={t > 534.5 ? 10 : 40 + Math.sin(t * 4) * 20} salta={534.6} habla={t < 534.4} manoD={<rect x={-5} y={-10} width={10} height={220} rx={4} fill="#8a5a2a" transform="rotate(-80)" />} />
      {t > 532.0 && <svg style={{ position: "absolute", left: 760, top: 420, transform: `scale(${ent(t, 532.0)})` }} width={420} height={300}><rect x={10} y={20} width={400} height={260} rx={14} fill="#3a2a1a" stroke="#8a5a2a" strokeWidth={14} /><text x={210} y={110} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#f2ead8">NAVAL WAR</text><text x={210} y={180} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={60} fill={C.oro}>101</text><path d="M 60 230 L 160 230" stroke="#f2ead8" strokeWidth={6} /></svg>}
      {t > 535.0 && (
        <svg style={{ position: "absolute", left: 1300 - 300, top: 420 - 260, transform: `scale(${ent(t, 535.0)})`, overflow: "visible" }} width={600} height={520} viewBox="-300 -260 600 520">
          <rect x={-300} y={-260} width={600} height={520} rx={40} fill="#120c30" />
          <g fill="#2a1f5a"><rect x={-20} y={-180} width={40} height={360} /><g transform="rotate(-35 0 -140)"><rect x={0} y={-160} width={260} height={50} /><path d="M 240 -110 L 270 -110 L 255 -30 Z" /></g></g>
          <text x={0} y={60} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={220} fill={C.oro}>?</text>
        </svg>
      )}
      <Chip t={t} t0={532.4} text="LEARN FROM SCRATCH" color={C.rojo} x={560} y={130} centro size={60} />
      <Chip t={t} t0={534.6} text="THE MOST FAMOUS TRICK..." color={C.oro} tinta={C.noche} x={1300} y={800} centro size={56} />
    </Escena>
  </>
);
