import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote, Rayos } from "./kit";
import { Mundo, camEn, Key, SAJON, SENOR, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, MapaN, lugarN } from "./comun";
import { Cita } from "./escenas";
import { Corona, Iglesia, Esqueleto, Drakkar } from "./vik";
import { Craneo } from "./kit2";

// 667,7-779,8 s · TRAMPA 7: LA MAÑANA DESPUÉS. Lo imposible: ganaste. Pero siempre hay más: la red vikinga, el día de San
// Bricio (1002), Oxford, la fosa de 30+ jóvenes, Gunnhild, Sven Barba de Horquilla rey de Inglaterra (1013) y la fosa de Dorset.
export const CAM7: Key[] = [
  [667.71, 3700, 760, 1.6], [670.47, 4600, 700, 0.9], [673.83, 5200, 700, 0.75], [680.2, 5400, 700, 0.8],
  [681.51, 6800, 640, 0.42], [685.87, 7600, 640, 0.36],
  [758.64, 5200, 640, 0.5], [762.02, 5300, 680, 0.6],
];
const VERDE = { tunica: "#4f8a5a", tunica2: "#2f5e3a", cinto: "#5a3418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a8552a" };
const ETHELRED = { tunica: "#a8283a", tunica2: "#6a1a2a", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#c9a24a" };
const SVEN = { tunica: "#2a2a4a", tunica2: "#1a1a30", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2418" };

export const P7: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM7);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 7 · imaginá lo imposible: lo lograste · perro callado, guardia dormido, zanja seca, los agarraste en la cama */}
      <Escena t={t} t0={667.71} t1={685.87} zoom={0} entra="corte" golpes={[673.9, 675.4, 676.9, 678.4, 680.3, 681.6]}>
        <Mundo t={t} cam={cam} e={{ amanece: prog(t, 672, 684) * 0.7, flota: 682.2 }}>
          {t > 672.3 && Array.from({ length: 9 }, (_, i) => {
            const x = 4500 + i * 260;
            return <Persona key={i} x={x} y={862} h={250} t={t} seed={700 + i} ropa={i === 4 ? SENOR : VERDE} casco={i === 4 ? "no" : "saxon"} expr={t > 681.5 ? "miedo" : "feliz"} aparece={672.4 + i * 0.06} salta={t > 680.2 && t < 681.4 ? 1 : 0} bD={t > 680.2 && t < 681.4 ? 160 : 30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={400} />} />;
          })}
        </Mundo>
        {t > 680.2 && t < 681.5 && <Particulas t={t} tipo="destellos" n={60} seed={7} />}
        <Cartel t={t} t0={667.8} t1={670.4} n={7} nombre="THE MORNING AFTER" />
        <Ch t={t} t0={670.6} t1={673.8} text="NOW IMAGINE THE IMPOSSIBLE" color={C.violeta} x={960} y={150} centro size={58} />
        <G t={t} t0={672.4} t1={673.8} text="YOU DID IT" y={250} size={140} color={C.lima} />
        <Ch t={t} t0={673.9} t1={680.1} text="DOG: QUIET ✓" color={C.lima} tinta={C.noche} x={120} y={150} size={50} />
        <Ch t={t} t0={675.4} t1={680.1} text="GUARD: ASLEEP ✓" color={C.lima} tinta={C.noche} x={120} y={240} size={50} />
        <Ch t={t} t0={676.9} t1={680.1} text="DITCH: DRY ✓" color={C.lima} tinta={C.noche} x={120} y={330} size={50} />
        <Ch t={t} t0={678.4} t1={680.1} text="CAUGHT IN THEIR BEDS ✓" color={C.lima} tinta={C.noche} x={120} y={400} size={50} />
        <G t={t} t0={680.3} t1={681.5} text="CONGRATULATIONS" y={240} size={130} color={C.ambar} />
        <Ch t={t} t0={681.6} text="THE MOST DANGEROUS TRAP OF ALL" color={C.rojo} x={960} y={150} centro size={58} />
        <G t={t} t0={683.0} text="THERE'S ALWAYS MORE OF THEM" y={880} size={90} color={C.crema} />
      </Escena>
      {/* 1 · no vivían en un campamento: vivían en una red · hermanos, primos, juramentados, otras flotas, otros ejércitos · y memoria larga */}
      <Escena t={t} t0={685.87} t1={695.95} zoom={0} entra="zoom" golpes={[689.6, 690.6, 691.6, 692.6, 693.6, 694.6]}>
        <MapaN t={t} cam={[[685.87, 900, 600, 0.95], [695.9, 860, 600, 1.05]]} desde="NORWAY"
          pulsa={[{ n: "DENMARK", t0: 688.2, color: C.rojo }, { n: "NORWAY", t0: 688.4, color: C.rojo }, { n: "DUBLIN", t0: 688.6, color: C.rojo }, { n: "REPTON", t0: 688.8, color: C.rojo }, { n: "PARIS", t0: 689.0, color: C.rojo }, { n: "LEUVEN", t0: 689.2, color: C.rojo }]}
          rutas={[["DENMARK", "NORWAY"], ["NORWAY", "DUBLIN"], ["DUBLIN", "REPTON"], ["REPTON", "DENMARK"], ["DENMARK", "LEUVEN"], ["LEUVEN", "PARIS"], ["PARIS", "REPTON"]].map(([de, a], i) => ({ de, a, t0: 688.4 + i * 0.22, color: C.ambar, curva: 50, dur: 0.6, ancho: 8 }))}>
          {["DENMARK", "NORWAY", "DUBLIN", "REPTON", "PARIS", "LEUVEN"].map((n, i) => t > 688.2 + i * 0.2 && (
            <div key={n} style={{ position: "absolute", left: lugarN(n).x, top: lugarN(n).y - 30, transform: `translate(-50%,-50%) scale(${ent(t, 688.2 + i * 0.2)})` }}>
              <div style={{ position: "relative", width: 110, height: 110, borderRadius: 55, background: "#f4ead2", border: "6px solid #2a1530", overflow: "hidden" }}>
                <Persona x={55} y={175} h={150} t={t} seed={790 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={i % 2 ? "enojado" : "orgullo"} soloCabeza />
              </div>
            </div>
          ))}
        </MapaN>
        <Ch t={t} t0={686.0} t1={688.0} text="NOT ONE CAMP" color={C.violeta} x={960} y={150} centro size={60} />
        <G t={t} t0={688.1} text="A NETWORK" y={240} size={150} color={C.crema} />
        {["BROTHERS", "COUSINS", "SWORN FRIENDS", "OTHER FLEETS", "OTHER ARMIES", "A LONG MEMORY"].map((s, i) => (
          <Ch key={s} t={t} t0={689.6 + i * 1.0} text={s} color={i === 5 ? C.rojo : [C.teal, C.ambar][i % 2]} tinta={i === 5 ? "#fff" : C.noche} x={i < 3 ? 150 : 1330} y={i < 3 ? 380 + (i % 3) * 100 : 720 + (i % 3) * 100} size={48} />
        ))}
      </Escena>
      {/* 2 · 1002, 13 de noviembre, día de San Bricio: Etelredo ordena matar a todos los daneses de Inglaterra */}
      <Escena t={t} t0={695.95} t1={706.97} entra="iris" ix={960} iy={540} golpes={[696.2, 699.3, 702.6]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a1a4a, #5a2a4a 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={900} width={1920} height={180} fill="#3a3a3a" /></svg>
        <Iglesia x={1320} y={620} s={0.95} t={t} />
        <Persona x={560} y={1080} h={760} t={t} seed={720} ropa={ETHELRED} expr="enojado" bD={t > 702.4 ? 110 : 20} cD={10} mira={0.6} />
        <Corona x={560} y={1080 - 760 * 1.02} s={0.7} t={t} t0={696.4} />
        <G t={t} t0={696.2} t1={702.4} text="1002" x={1300} y={300} size={220} color={C.ambar} />
        <Ch t={t} t0={699.3} t1={702.4} text="13 NOVEMBER · ST BRICE'S DAY" color={C.violeta} x={1300} y={470} centro size={50} />
        <Ch t={t} t0={700.6} t1={702.4} text="KING ÆTHELRED OF ENGLAND" color={C.rojo} x={1300} y={570} centro size={50} />
        {t > 702.5 && (
          <div style={{ position: "absolute", left: 1300, top: 560, transform: `translate(-50%,-50%) scale(${0.8 * ent(t, 702.6)}) rotate(3deg)`, width: 760, padding: "40px 50px", background: "#f4ead2", border: "10px solid #2a1530", borderRadius: 16, fontFamily: "Fredoka", fontWeight: 700, textAlign: "center", color: C.noche }}>
            <div style={{ fontSize: 44, color: "#8a6a3a" }}>BY ORDER OF THE KING</div>
            <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 16 }}>EVERY DANE<br />IN ENGLAND</div>
            <div style={{ fontSize: 86, color: C.rojo, marginTop: 10 }}>→ KILLED</div>
            {[-330, 330].map((dx) => <div key={dx} style={{ position: "absolute", left: 380 + dx - 16, top: 14, width: 32, height: 32, borderRadius: 16, background: "#6a6a7a", border: "5px solid #2a1530" }} />)}
          </div>
        )}
      </Escena>
      {/* 3 · Oxford: un grupo de daneses se refugia en la iglesia de Santa Frideswida · el pueblo la incendia con ellos adentro */}
      <Escena t={t} t0={706.97} t1={714.54} entra="zoom" golpes={[708.6, 711.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a1236, #3a2a6a)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={860} width={1920} height={220} fill="#3a3a3a" /></svg>
        <Iglesia x={1150} y={600} s={0.85} t={t} arde={prog(t, 711.8, 713.6)} />
        {Array.from({ length: 5 }, (_, i) => { const x = interpolate(t, [707.4, 709.8], [330 + i * 90, 1080 + i * 30], { extrapolateRight: "clamp" }); return <Persona key={i} x={x} y={980} h={260} t={t} seed={730 + i} ropa={VIK(i)} barba={barbaDe(i)} expr="miedo" camina={t < 709.8 ? 2.2 : 0} opacity={t < 709.8 ? 1 : 1 - prog(t, 709.8, 710.2)} />; })}
        {t > 711.8 && Array.from({ length: 4 }, (_, i) => <Persona key={i} x={300 + i * 120} y={1000} h={300} t={t} seed={740 + i} sombra="#120a20" manoD={<g transform="rotate(-150)"><rect x={-6} y={0} width={12} height={110} fill="#6b4022" /><circle cx={0} cy={120} r={22 + Math.sin(t * 20 + i) * 6} fill="#ffb24a" /></g>} />)}
        {t > 711.8 && <Particulas t={t} tipo="brasas" n={50} seed={13} />}
        <Ch t={t} t0={707.2} text="OXFORD" color={C.ambar} tinta={C.noche} x={120} y={150} size={62} />
        <Ch t={t} t0={708.6} text="ST FRIDESWIDE'S CHURCH · “FOR SAFETY”" color={C.violeta} x={120} y={260} size={48} />
        <Sello t={t} t0={711.9} text="SET ON FIRE" x={1500} y={320} size={84} rot={-8} />
      </Escena>
      {/* 4 · hace unos años, en Oxford, desenterraron más de 30 jóvenes tirados en una zanja · ¿víctimas de ese día? */}
      <Escena t={t} t0={714.54} t1={727.35} entra="sube" golpes={[717.0, 719.6, 724.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #a8c8e0, #e0eef4 45%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={0} y={440} width={1920} height={640} fill="#8a6a44" />
          <rect x={0} y={420} width={1920} height={30} fill="#6a9a4a" />
          <path d="M 260 560 L 1660 560 L 1560 960 L 360 960 Z" fill="#5e4428" stroke="#3a2a18" strokeWidth={8} />
          {/* cuadrícula de excavación */}
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={260 + i * 200} y1={540} x2={260 + i * 200} y2={570} stroke="#fff" strokeWidth={4} />)}
          <line x1={240} y1={548} x2={1680} y2={548} stroke="#fff" strokeWidth={4} />
        </svg>
        {Array.from({ length: 12 }, (_, i) => <Esqueleto key={i} x={480 + (i % 4) * 320} y={640 + Math.floor(i / 4) * 110} s={0.62} t={t} t0={717.0 + i * 0.12} rot={(i * 37) % 30 - 15} />)}
        <Persona x={300} y={600} h={340} t={t} seed={750} mujer ropa={{ tunica: "#e8a82a", tunica2: "#c8881a", cinto: "#3a2418", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2418" }} expr="triste" mira={0.6} miraY={0.6} inclina={12} bD={70 + Math.sin(t * 8) * 14} cD={50} manoD={<g><rect x={-5} y={0} width={10} height={70} fill="#8a5a32" /><rect x={-9} y={66} width={18} height={26} rx={4} fill="#f2d27a" /></g>} />
        <Ch t={t} t0={714.8} text="A FEW YEARS AGO · OXFORD" color={C.violeta} x={960} y={150} centro size={56} />
        <Cuenta t={t} t0={719.6} de={0} a={30} dur={0.8} x={1500} y={240} size={170} color={C.crema} sufijo="+" />
        <Ch t={t} t0={720.2} text="YOUNG MEN · TERRIBLE WOUNDS" color={C.rojo} x={1400} y={380} centro size={44} />
        <Ch t={t} t0={724.2} text="VICTIMS OF THAT VERY DAY?" color={C.ambar} tinta={C.noche} x={960} y={960} centro size={56} />
      </Escena>
      {/* 5 · una crónica posterior: entre los muertos, Gunnhild, hermana del rey de Dinamarca · quizás no es cierto, pero el rey actuó como si lo fuera */}
      <Escena t={t} t0={727.35} t1={741.38} entra="barrido" banda={C.rojo} golpes={[730.8, 735.3, 739.0]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a2a6a, #0c0a24 80%)" }} />
        <Rayos t={t} x={760} y={540} color="#cfd8ff" op={0.1} />
        <Persona x={700} y={1080} h={700} t={t} seed={760} mujer corona ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#f2d27a" }} expr={t > 735.3 ? "triste" : "neutro"} mira={t > 735.3 ? -0.5 : 0.4} bD={t > 730.8 && t < 735 ? 40 : 15} cD={t > 730.8 && t < 735 ? 90 : 10} />
        {t > 739.0 && <AbsoluteFill style={{ background: `rgba(120,10,30,${prog(t, 739.0, 739.8) * 0.3})` }} />}
        <Ch t={t} t0={727.6} t1={735.2} text="A LATER CHRONICLE CLAIMS…" color={C.violeta} x={1350} y={260} centro size={52} />
        <G t={t} t0={730.8} text="GUNNHILD" x={1350} y={420} size={130} color={C.crema} />
        <Ch t={t} t0={732.0} text="SISTER OF THE KING OF DENMARK" color={C.ambar} tinta={C.noche} x={1350} y={560} centro size={40} />
        <Emote t={t} t0={735.3} tipo="preg" x={980} y={380} s={1.4} />
        <Ch t={t} t0={735.4} text="HISTORIANS AREN'T SURE" color={C.teal} tinta={C.noche} x={1350} y={680} centro size={48} />
        <Sello t={t} t0={739.0} text="HE ACTED AS IF IT WAS" x={1300} y={850} size={58} rot={-6} />
      </Escena>
      {/* 6 · Sven Barba de Horquilla: diez años saqueando Inglaterra · 1013: Etelredo huye, Sven es rey de Inglaterra */}
      <Escena t={t} t0={741.38} t1={754.59} zoom={0} entra="zoom" golpes={[741.6, 747.7, 751.4]}>
        <MapaN t={t} cam={[[741.38, 900, 560, 1.0], [754.5, 820, 620, 1.3]]} desde="NORWAY"
          zona={[{ n: "ENGLAND", t0: 751.4, r: 160, color: C.rojo }]}
          rutas={Array.from({ length: 10 }, (_, i) => ({ de: "DENMARK", a: ["ENGLAND", "EASTANGLIA", "WINCHESTER", "OXFORD", "THANET"][i % 5], t0: 742.4 + i * 0.5, color: C.rojo, curva: 40 + (i % 3) * 40, dur: 0.5, ancho: 8 }))}>
          {(() => { const a = lugarN("DENMARK"), b = lugarN("THANET"); const u = prog(t, 742.4, 747.4); return <div style={{ position: "absolute", left: a.x + (b.x - a.x) * u, top: a.y + (b.y - a.y) * u, transform: `translate(-50%,-50%) scale(0.09)` }}><Drakkar x={0} y={0} s={1} t={t} vela={1} remos={1} /></div>; })()}
          {t > 747.7 && (() => { const a = lugarN("WINCHESTER"), b = lugarN("PARIS"); const u = prog(t, 747.7, 750.6); return <div style={{ position: "absolute", left: a.x + (b.x - a.x) * u, top: a.y + (b.y - a.y) * u, transform: `translate(-50%,-50%) scale(0.08)` }}><Drakkar x={0} y={0} s={1} t={t} vela={1} remos={2} escudos={false} /></div>; })()}
        </MapaN>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Persona x={1500} y={1060} h={560} t={t} seed={770} ropa={SVEN} barba="#3a2418" casco={t < 751.4 ? "vikingo" : "no"} expr={t > 751.4 ? "feliz" : "orgullo"} bD={t > 751.4 ? 150 : 30} cD={t > 751.4 ? 50 : 10} bI={t > 751.4 ? 150 : 20} cI={t > 751.4 ? 50 : 10} />
          {t > 751.4 && <Corona x={1500} y={interpolate(t, [751.5, 752.2], [400, 1060 - 560 * 1.02], { extrapolateRight: "clamp" })} s={0.55} t={t} t0={751.5} />}
          {/* la barba en horquilla */}
          <svg style={{ position: "absolute", left: 1500 - 70, top: 1060 - 560 * 0.62, overflow: "visible" }} width={140} height={140}><path d="M 40 10 L 30 120 L 70 40 L 80 10 Z M 120 10 L 130 120 L 90 40 L 80 10 Z" fill="#3a2418" /></svg>
        </div>
        <Ch t={t} t0={741.6} text="SWEIN FORKBEARD · KING OF DENMARK" color={C.rojo} x={150} y={150} size={52} />
        <G t={t} t0={742.4} text={String(Math.round(interpolate(t, [742.4, 747.4], [1003, 1013], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))} x={600} y={320} size={180} color={C.ambar} />
        <Ch t={t} t0={743.2} t1={747.6} text="RAIDING ENGLAND · AGAIN AND AGAIN" color={C.violeta} x={600} y={460} centro size={46} />
        <Ch t={t} t0={747.7} text="ÆTHELRED FLEES THE COUNTRY" color={C.teal} tinta={C.noche} x={600} y={460} centro size={48} />
        <G t={t} t0={751.4} text="KING OF ENGLAND" x={700} y={900} size={110} color={C.crema} />
      </Escena>
      {/* 7 · eso compró un ataque sorpresa exitoso: no paz, un rey danés */}
      <Escena t={t} t0={754.59} t1={762.49} entra="diag" golpes={[758.7, 760.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #16123d)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={900} width={1920} height={180} fill="#2f5a40" /></svg>
        {[0, 1, 2, 3].map((i) => { const fest = t < 758.9; return <Persona key={i} x={700 + i * 170} y={980} h={300} t={t} seed={800 + i} ropa={VERDE} casco="saxon" expr={fest ? "feliz" : t > 760.2 ? "miedo" : "triste"} salta={fest && Math.sin(t * 6 + i) > 0.6 ? 1 : 0} bD={fest ? 150 : 20} cD={fest ? 50 : 10} bI={fest ? 150 : 20} cI={fest ? 50 : 10} />; })}
        <Ch t={t} t0={754.8} text="WHAT A SUCCESSFUL SURPRISE ATTACK BOUGHT THE ENGLISH:" color={C.violeta} x={960} y={160} centro size={46} />
        <div style={{ position: "absolute", left: 360, top: 480, transform: `translate(-50%,-50%) scale(${ent(t, 758.7)})` }}>
          <svg width={360} height={300} viewBox="-180 -150 360 300" style={{ overflow: "visible" }}>
            <path d="M -110 0 Q -60 -90 20 -60 Q 80 -110 120 -60 Q 60 -40 70 10 Q 20 80 -60 60 Q -120 60 -110 0 Z" fill="#fff" stroke="#2a1530" strokeWidth={8} />
            <path d="M -160 -130 L 160 130 M 160 -130 L -160 130" stroke={C.rojo} strokeWidth={30} strokeLinecap="round" opacity={prog(t, 759.0, 759.3)} />
          </svg>
          <div style={{ textAlign: "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: "#fff" }}>PEACE</div>
        </div>
        <div style={{ position: "absolute", left: 1600, top: 480, transform: `translate(-50%,-50%) scale(${ent(t, 760.2)})` }}>
          <div style={{ position: "relative", width: 360, height: 300 }}><Corona x={180} y={170} s={1.6} t={t} /></div>
          <div style={{ textAlign: "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: C.ambar }}>A DANISH KING</div>
        </div>
      </Escena>
      {/* 8 · y cuando salía al revés: Dorset, 2009, una fosa con ~50 jóvenes escandinavos, todos decapitados · perder no era volver a casa */}
      <Escena t={t} t0={762.49} t1={780.0} entra="iris" ix={960} iy={700} golpes={[764.9, 770.9, 774.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #c8b8a8, #e8dcc8 50%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 0 520 Q 600 300 1200 420 Q 1600 500 1920 460 L 1920 1080 L 0 1080 Z" fill="#7a9a5a" />
          <path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#8a6a44" />
          <ellipse cx={960} cy={860} rx={560} ry={150} fill="#4a3220" />
          {/* la ruta en obra */}
          <rect x={0} y={660} width={1920} height={40} fill="#3a3a44" />
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 200 + 40} y={676} width={100} height={8} fill="#f2c230" />)}
        </svg>
        {/* excavadora */}
        <svg style={{ position: "absolute", left: interpolate(t, [762.6, 764.8], [-500, 60], { extrapolateRight: "clamp" }), top: 420, overflow: "visible" }} width={420} height={260} viewBox="0 0 420 260">
          <rect x={40} y={110} width={220} height={100} rx={10} fill="#f2c230" stroke="#2a1530" strokeWidth={8} />
          <rect x={150} y={50} width={90} height={70} fill="#f2c230" stroke="#2a1530" strokeWidth={8} /><rect x={165} y={62} width={60} height={40} fill="#9ad8ff" />
          <rect x={30} y={200} width={250} height={50} rx={25} fill="#2a2a34" />
          <path d="M 260 140 L 360 80 L 400 170 L 350 190 Z" fill="#f2c230" stroke="#2a1530" strokeWidth={8} />
        </svg>
        {[0, 1].map((i) => <Persona key={i} x={1480 + i * 170} y={760} h={300} t={t} seed={810 + i} ropa={{ tunica: "#f28a2a", tunica2: "#c86a1a", cinto: "#3a3a44", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2418" }} casco="saxon" expr={t > 770.9 ? "sorpresa" : "neutro"} flip mira={-0.6} miraY={0.5} bD={t > 770.9 ? 130 : 20} cD={t > 770.9 ? 90 : 10} />)}
        {t > 770.8 && Array.from({ length: 10 }, (_, i) => <Craneo key={i} x={560 + (i % 5) * 200} y={820 + Math.floor(i / 5) * 80} s={0.32} t={t} t0={770.9 + i * 0.08} />)}
        <Ch t={t} t0={762.7} t1={764.8} text="WHEN IT WENT THE OTHER WAY…" color={C.violeta} x={960} y={150} centro size={56} />
        <Ch t={t} t0={764.9} t1={770.8} text="DORSET · 2009 · ROAD BUILDERS" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={52} />
        {t < 770.8 && <Cuenta t={t} t0={767.0} de={0} a={50} dur={0.8} x={960} y={300} size={150} color={C.crema} prefijo="~" />}
        <Ch t={t} t0={768.2} t1={770.8} text="YOUNG SCANDINAVIAN MEN" color={C.teal} tinta={C.noche} x={960} y={420} centro size={50} />
        <Sello t={t} t0={770.9} t1={774.0} text="ALL BEHEADED" x={960} y={260} size={90} rot={-6} />
        {t > 774 && <AbsoluteFill style={{ background: `rgba(8,6,24,${prog(t, 774, 775) * 0.7})` }} />}
        <G t={t} t0={775.4} text="LOSING ≠ GOING HOME" y={540} size={120} color={C.crema} />
      </Escena>
    </AbsoluteFill>
  );
};

void Flash; void SAJON; void gy; void Cita;
