import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Rayos } from "./kit";
import { Mundo, camEn, Key, SAJON, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Ruta, Cuenta, Sello, Flash, LanzaMano, MapaN } from "./comun";
import { CrecePueblo } from "./escenas";
import { Corona, Esqueleto, Drakkar, Empalizada, Iglesia } from "./vik";
import { Craneo } from "./kit2";

// 779,8-922,3 s · EL GIRO Y EL CIERRE. ¿Trampa mortal? Los que les ganaron casi nunca lo hicieron de noche: Edington a la luz del
// día, el sitio de 14 días, Guthrum bautizado; o la plata (París 845). Dublín, Repton, el repaso por las 7 paradas del mundo y el CTA.
export const CAM8: Key[] = [
  [779.75, 5300, 640, 0.55], [783.33, 5000, 600, 0.7],
  [871.42, 3600, 640, 0.6], [875.47, 4080, 600, 1.2],
  [896.4, 1250, 440, 0.55], [898.26, 1250, 440, 0.6], [899.62, 3500, 600, 0.6], [900.49, 4700, 560, 0.6], [901.4, 5500, 560, 0.6],
  [903.23, 7700, 560, 0.6], [904.09, 8800, 560, 0.6], [905.12, 9900, 560, 0.6], [906.54, 5575, -260, 0.19], [910.7, 5575, -260, 0.2],
  [910.78, 5400, 560, 0.45], [922.3, 5600, 540, 0.5],
];
const ALFRED = { tunica: "#c8a23a", tunica2: "#8a6a1a", cinto: "#3b230f", piel: "#e8a880", piel2: "#c98864", pelo: "#3a2418" };
const GUTHRUM = { tunica: "#4a2a2a", tunica2: "#2a1a1a", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a8552a" };
const CARLOS = { tunica: "#3a4aa8", tunica2: "#22306e", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#f2c4a0" };

const Monedas: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 12 }) => (
  <svg style={{ position: "absolute", left: x - 260 * s, top: y - 240 * s, overflow: "visible" }} width={520 * s} height={280 * s} viewBox="-260 -240 520 280">
    {Array.from({ length: n }, (_, i) => { const col = i % 4, fila = Math.floor(i / 4); const cx = -180 + col * 120 + (fila % 2) * 60, cy = 20 - fila * 60; return (
      <g key={i}><ellipse cx={cx} cy={cy + 10} rx={56} ry={20} fill="#a8801a" stroke="#2a1530" strokeWidth={5} /><ellipse cx={cx} cy={cy} rx={56} ry={20} fill="#ffd23a" stroke="#2a1530" strokeWidth={5} /><ellipse cx={cx} cy={cy} rx={30} ry={10} fill="none" stroke="#e8a81a" strokeWidth={4} /></g>
    ); })}
  </svg>
);

const Martillo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 60 * s, top: y - 70 * s, overflow: "visible" }} width={120 * s} height={140 * s} viewBox="-60 -70 120 140">
    <path d="M 0 -70 L 0 -40" stroke="#c9a24a" strokeWidth={6} />
    <rect x={-10} y={-44} width={20} height={60} fill="#dcc070" stroke="#2a1530" strokeWidth={5} />
    <path d="M -50 10 L 50 10 L 40 60 L -40 60 Z" fill="#dcc070" stroke="#2a1530" strokeWidth={6} />
  </svg>
);

export const P8: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM8);
  return (
    <AbsoluteFill>
      {/* 0 · entonces: ¿atacar un campamento vikingo dormido era una trampa mortal? · el giro */}
      <Escena t={t} t0={779.75} t1={784.73} zoom={0} entra="corte" golpes={[783.4]}>
        <Mundo t={t} cam={cam} e={{ amanece: 0.35 }} />
        <G t={t} t0={780.0} t1={783.3} text="SO… A DEATH TRAP?" y={240} size={130} color={C.crema} />
        <Flash t={t} t0={783.35} dur={0.2} />
        <G t={t} t0={783.4} text="HERE IS THE TWIST" y={240} size={130} color={C.ambar} />
      </Escena>
      {/* 1 · los que les ganaron casi nunca lo hicieron de noche · Alfredo en el pantano → mayo de 878, Edington, a plena luz */}
      <Escena t={t} t0={784.73} t1={791.5} entra="diag" golpes={[786.4, 788.5]}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${t < 788.4 ? "#0a0826" : "#8aa0a8"}, ${t < 788.4 ? "#33227a" : "#c8d4c0"})` }} />
        {t < 788.4 ? (
          <>
            <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${ent(t, 785.0)})` }}>
              <svg width={520} height={520} viewBox="-260 -260 520 520"><circle r={170} fill="#f6efc9" /><circle cx={60} cy={-30} r={30} fill="#d8cfa0" /><path d="M -230 -230 L 230 230 M 230 -230 L -230 230" stroke={C.rojo} strokeWidth={36} strokeLinecap="round" opacity={prog(t, 786.4, 786.7)} /></svg>
            </div>
            <Ch t={t} t0={785.0} text="THE MEN WHO BEAT THE VIKINGS…" color={C.violeta} x={960} y={130} centro size={58} />
            <Ch t={t} t0={786.4} text="ALMOST NEVER AT NIGHT" color={C.rojo} x={960} y={960} centro size={62} />
          </>
        ) : (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={760} width={1920} height={320} fill="#5a7a5a" />{Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${i * 50} 790 q 6 -90 ${10 + (i % 3) * 6} -140`} stroke="#4a6a3a" strokeWidth={8} fill="none" />)}</svg>
            <Persona x={700} y={990} h={480} t={t} seed={371} ropa={ALFRED} expr="triste" />
            <Corona x={700} y={990 - 480 * 1.02} s={0.48} t={t} t0={788.5} />
            <Ch t={t} t0={788.6} text="REMEMBER ALFRED IN THE SWAMP?" color={C.violeta} x={960} y={130} centro size={58} />
          </>
        )}
      </Escena>
      <Escena t={t} t0={791.5} t1={800.02} entra="barrido" banda={C.ambar} golpes={[793.6, 796.6, 798.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #6ab8e8, #d8f0f8 60%)" }} />
        <Rayos t={t} x={1700} y={120} color="#fff8d0" op={0.25} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={1700} cy={120} r={90} fill="#ffe28a" /><path d="M 0 760 Q 960 700 1920 760 L 1920 1080 L 0 1080 Z" fill="#6aaa4a" /></svg>
        {Array.from({ length: 9 }, (_, i) => {
          const x = interpolate(t, [796.6, 799.6], [200 + i * 80, 700 + i * 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <Persona key={i} x={x} y={920 + (i % 2) * 40} h={i === 4 ? 340 : 260} t={t} seed={800 + i} ropa={i === 4 ? ALFRED : SAJON} casco={i === 4 ? "no" : "saxon"} expr="enojado" camina={t > 796.6 ? 1.8 : 0} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={360} />} />;
        })}
        <Corona x={interpolate(t, [796.6, 799.6], [520, 1020], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={920 - 340 * 1.02} s={0.36} t={t} t0={791.6} />
        {Array.from({ length: 6 }, (_, i) => { const x = 1300 + i * 100 + Math.max(0, t - 798) * 260; return <Persona key={i} x={x} y={920 + (i % 2) * 30} h={250} t={t} seed={820 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr={t > 798 ? "miedo" : "enojado"} flip={t < 798} camina={t > 798 ? 2.2 : 0} />; })}
        <Ch t={t} t0={791.7} text="A FEW MONTHS LATER · A NEW ARMY" color={C.violeta} x={120} y={130} size={52} />
        <G t={t} t0={793.6} text="MAY 878 · EDINGTON" y={300} size={110} color={C.crema} />
        <Ch t={t} t0={796.6} text="OPEN BATTLE" color={C.rojo} x={960} y={440} centro size={56} />
        <Sello t={t} t0={798.2} text="IN DAYLIGHT" x={1500} y={600} size={84} color={C.ambar} rot={-8} />
      </Escena>
      {/* 2 · se meten en su campamento fortificado · Alfredo no lo asalta, no espera la noche: se sienta frente a la puerta 14 días */}
      <Escena t={t} t0={800.02} t1={815.49} entra="iris" ix={960} iy={640} golpes={[805.5, 806.8, 808.5, 812.6, 813.9]}>
        {(() => {
          const dia = Math.min(14, Math.max(1, Math.floor(interpolate(t, [808.6, 815.3], [1, 14.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))));
          const fase = t > 808.6 ? (((t - 808.6) / 6.7) * 14) % 1 : 0.3;
          const noche = Math.sin(fase * Math.PI * 2) < -0.2;
          return (
            <>
              <AbsoluteFill style={{ background: noche ? "linear-gradient(180deg, #0a0826, #33227a)" : "linear-gradient(180deg, #6ab8e8, #d8f0f8 60%)" }} />
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                <circle cx={960 + Math.cos(fase * Math.PI * 2) * 820} cy={520 - Math.sin(fase * Math.PI * 2) * 420} r={70} fill={noche ? "#f6efc9" : "#ffe28a"} />
                <rect x={0} y={700} width={1920} height={380} fill={noche ? "#1e3a3a" : "#6aaa4a"} />
              </svg>
              <div style={{ position: "absolute", left: 0, top: 0 }}><Empalizada x={760} y={700} n={26} h={230} /></div>
              <div style={{ position: "absolute", left: 1280, top: 520, width: 130, height: 180, background: "#2a1530" }} />
              {Array.from({ length: 5 }, (_, i) => { const x = interpolate(t, [800.2, 802.6], [200 + i * 120, 1345], { extrapolateRight: "clamp" }); return t < 802.8 ? <Persona key={i} x={x} y={900} h={240} t={t} seed={830 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="miedo" camina={2.4} /> : null; })}
              {t > 802.4 && t < 808.4 && Array.from({ length: 7 }, (_, i) => <Persona key={i} x={interpolate(t, [802.4, 804.4], [-200 + i * 90, 160 + i * 90], { extrapolateRight: "clamp" })} y={900 + (i % 2) * 40} h={i === 3 ? 320 : 250} t={t} seed={870 + i} ropa={i === 3 ? ALFRED : SAJON} casco={i === 3 ? "no" : "saxon"} expr="enojado" camina={t < 804.4 ? 1.6 : 0} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={340} />} />)}
              {t > 802.4 && t < 808.4 && <Corona x={interpolate(t, [802.4, 804.4], [70, 430], { extrapolateRight: "clamp" })} y={900 - 320 * 1.02} s={0.34} t={t} />}
              {/* Alfredo sentado en un tronco frente a la puerta */}
              {t > 808.4 && (
                <>
                  <div style={{ position: "absolute", left: 420, top: 900, width: 220, height: 60, borderRadius: 30, background: "#8a5a32", border: "6px solid #2a1530" }} />
                  <Persona x={530} y={930} h={380} t={t} seed={371} ropa={ALFRED} expr="orgullo" mira={0.6} />
                  <Corona x={530} y={930 - 380 * 1.02} s={0.4} t={t} />
                </>
              )}
              <Ch t={t} t0={800.2} t1={805.4} text="THEY RAN INTO THEIR FORTIFIED CAMP" color={C.violeta} x={960} y={130} centro size={54} />
              <Ch t={t} t0={803.0} t1={805.4} text="THE SMARTEST THING OF ALFRED'S LIFE:" color={C.ambar} tinta={C.noche} x={960} y={240} centro size={50} />
              <Ch t={t} t0={805.5} t1={808.4} text="STORM IT? ✗" color={C.rojo} x={500} y={200} centro size={58} />
              <Ch t={t} t0={806.8} t1={808.4} text="WAIT FOR NIGHT? ✗" color={C.rojo} x={1400} y={200} centro size={58} />
              {t > 808.5 && <G t={t} t0={808.5} text={`DAY ${dia}`} x={960} y={200} size={150} color={dia === 14 ? C.ambar : C.crema} />}
              <Ch t={t} t0={812.6} text="NO FOOD IN ✗" color={C.rojo} x={1500} y={360} centro size={50} />
              <Ch t={t} t0={813.9} text="NO SHIPS TO HELP ✗" color={C.rojo} x={1500} y={460} centro size={50} />
            </>
          );
        })()}
      </Escena>
      {/* 3 · rehenes y paz · Guthrum, el del ataque de Navidad, bautizado con Alfredo de padrino */}
      <Escena t={t} t0={815.49} t1={826.66} entra="barrido" golpes={[816.4, 820.4, 823.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2d08a, #fff0c8 60%)" }} />
        <Rayos t={t} x={960} y={200} color="#ffffff" op={0.25} />
        {t < 820.3 ? (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={760} width={1920} height={320} fill="#7aa04a" /><rect x={1300} y={300} width={12} height={460} fill="#6b4022" /><path d={`M 1312 310 Q 1420 ${290 + Math.sin(t * 5) * 20} 1520 330 L 1520 450 Q 1420 ${430 + Math.sin(t * 5 + 1) * 20} 1312 450 Z`} fill="#fff" stroke="#2a1530" strokeWidth={6} /></svg>
            {Array.from({ length: 3 }, (_, i) => <Persona key={i} x={interpolate(t, [816.4, 819.4], [1700 + i * 120, 900 + i * 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={960} h={300} t={t} seed={840 + i} ropa={VIK(i)} barba={barbaDe(i)} expr="triste" flip camina={t < 819.4 ? 1.2 : 0} />)}
            <Persona x={420} y={980} h={420} t={t} seed={371} ropa={ALFRED} expr="orgullo" />
            <Corona x={420} y={980 - 420 * 1.02} s={0.44} t={t} />
            <Ch t={t} t0={815.7} text="AFTER TWO WEEKS…" color={C.violeta} x={960} y={130} centro size={58} />
            <Ch t={t} t0={816.4} text="HOSTAGES" color={C.ambar} tinta={C.noche} x={960} y={240} centro size={56} />
            <Ch t={t} t0={818.0} text="+ A REQUEST FOR PEACE" color={C.teal} tinta={C.noche} x={960} y={340} centro size={52} />
          </>
        ) : (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={860} width={1920} height={220} fill="#c8a87a" /><ellipse cx={960} cy={900} rx={260} ry={60} fill="#7ab8e0" stroke="#2a1530" strokeWidth={8} /><rect x={760} y={900} width={400} height={160} fill="#a8a8b8" stroke="#2a1530" strokeWidth={8} /></svg>
            <Persona x={960} y={930} h={460} t={t} seed={850} ropa={GUTHRUM} barba="#a8552a" expr="sorpresa" />
            {Array.from({ length: 10 }, (_, i) => { const k = ((t * 1.5 + i / 10) % 1); return <div key={i} style={{ position: "absolute", left: 900 + (i % 5) * 26, top: 380 + k * 160, width: 12, height: 18, borderRadius: 8, background: "#7ab8e0", opacity: (1 - k) * (t > 820.6 ? 1 : 0) }} />; })}
            <Persona x={1450} y={980} h={480} t={t} seed={371} ropa={ALFRED} expr="feliz" flip bD={80} cD={60} />
            <Corona x={1450} y={980 - 480 * 1.02} s={0.48} t={t} />
            <Ch t={t} t0={820.4} text="GUTHRUM · THE CHRISTMAS ATTACKER" color={C.rojo} x={960} y={130} centro size={54} />
            <G t={t} t0={821.6} text="BAPTIZED" y={260} size={140} color={C.crema} />
            <Ch t={t} t0={823.2} text="GODFATHER: ALFRED" color={C.ambar} tinta={C.noche} x={1450} y={380} centro size={50} />
          </>
        )}
      </Escena>
      {/* 4 · el rey más listo nunca atacó un campamento dormido: lo dejó pasar hambre */}
      <Escena t={t} t0={826.66} t1={832.49} entra="sube" golpes={[831.3]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a2a6a, #0c0a24 80%)" }} />
        <div style={{ position: "absolute", left: 960, top: 640, transform: `translate(-50%,-50%) scale(${ent(t, 830.9)})` }}>
          <svg width={520} height={300} viewBox="-260 -150 520 300"><path d="M -220 -40 Q 0 230 220 -40 Z" fill="#a8794a" stroke="#2a1530" strokeWidth={10} /><ellipse cx={0} cy={-40} rx={220} ry={34} fill="#5e3a1e" stroke="#2a1530" strokeWidth={10} />{t > 831.3 && <path d="M -60 -120 q 10 -30 0 -60 M 0 -120 q 10 -30 0 -60 M 60 -120 q 10 -30 0 -60" stroke="#c8c0e8" strokeWidth={8} fill="none" opacity={0.5} />}</svg>
        </div>
        <Ch t={t} t0={826.9} t1={831.2} text="THE SMARTEST KING IN VIKING-AGE ENGLAND" color={C.violeta} x={960} y={160} centro size={52} />
        <Ch t={t} t0={828.4} t1={831.2} text="NEVER ATTACKED A SLEEPING CAMP" color={C.rojo} x={960} y={270} centro size={56} />
        <G t={t} t0={831.3} text="HE LET IT GET HUNGRY" y={240} size={120} color={C.ambar} />
      </Escena>
      {/* 5 · el otro método, más rápido: les pagaban · 845, la flota sube el Sena hasta París, Carlos el Calvo paga 7.000 libras de plata */}
      <Escena t={t} t0={832.49} t1={841.5} zoom={0} entra="zoom" golpes={[836.5, 838.6]}>
        <MapaN t={t} cam={[[832.49, 900, 700, 1.1], [838.0, 820, 950, 2.6], [841.5, 858, 978, 3.6]]} desde="NORWAY"
          pulsa={[{ n: "PARIS", t0: 839.6, color: C.ambar, label: "PARIS", lado: "der" }]}
          rutas={[{ de: "DENMARK", a: "SEINE", t0: 837.6, color: C.rojo, curva: 60, dur: 1.0, ancho: 12 }, { de: "SEINE", a: "PARIS", t0: 838.6, color: C.rojo, curva: 20, dur: 0.9, ancho: 12 }]} />
        <Ch t={t} t0={832.7} t1={836.4} text="THE OTHER METHOD · EVEN FASTER" color={C.violeta} x={960} y={130} centro size={56} />
        <Ch t={t} t0={834.4} t1={836.4} text="THE FRANKS USED IT ALL THE TIME" color={C.teal} tinta={C.noche} x={960} y={240} centro size={50} />
        <G t={t} t0={836.5} t1={838.5} text="HE PAID THEM" y={260} size={140} color={C.ambar} />
        <G t={t} t0={838.6} text="845 · UP THE SEINE" y={200} size={110} color={C.crema} />
      </Escena>
      <Escena t={t} t0={841.5} t1={851.61} entra="iris" ix={960} iy={600} golpes={[842.4, 844.2, 846.7, 848.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2c08a, #ffe8c0 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={800} width={1920} height={280} fill="#3a7ac8" /><path d="M 0 800 L 1920 800" stroke="#cfe8ff" strokeWidth={8} /></svg>
        <Persona x={480} y={1000} h={600} t={t} seed={860} ropa={CARLOS} expr={t > 846.7 ? "sorpresa" : "miedo"} bD={t > 844 && t < 846.6 ? 90 : 20} cD={20} />
        <Corona x={480} y={1000 - 600 * 1.02} s={0.6} t={t} />
        {t > 844.2 && t < 846.7 && <Particulas t={t} tipo="lluviaoro" n={60} seed={5} />}
        {t > 844.2 && <div style={{ position: "absolute", left: 0, top: 0 }}><Monedas x={900} y={780} s={0.9 * ent(t, 844.3)} n={12} /></div>}
        {[0, 1, 2].map((i) => { const ida = t < 846.7 ? 0 : prog(t, 846.7, 848.4); const vuelve = prog(t, 848.8, 850.6); const x = 1250 + i * 230 + ida * 1100 - vuelve * 1100; return <Drakkar key={i} x={x} y={820 + i * 16} s={0.4} t={t} vela={1} flip={t > 848.8} />; })}
        <Ch t={t} t0={841.7} text="CHARLES THE BALD · KING OF THE FRANKS" color={C.violeta} x={960} y={110} centro size={52} />
        <Cuenta t={t} t0={844.2} t1={846.6} de={0} a={7000} dur={1.2} x={1300} y={300} size={170} color={C.ambar} />
        <Ch t={t} t0={844.8} t1={846.6} text="POUNDS OF SILVER · TO LEAVE" color={C.ambar} tinta={C.noche} x={1300} y={430} centro size={48} />
        <Ch t={t} t0={846.8} text="THEY LEFT…" color={C.teal} tinta={C.noche} x={1300} y={260} centro size={60} />
        <Sello t={t} t0={848.8} text="…AND CAME BACK" x={1300} y={400} size={86} rot={-6} />
        <Ch t={t} t0={849.8} text="EVERYBODY KNEW: PARIS PAYS" color={C.rojo} x={1300} y={560} centro size={50} />
      </Escena>
      {/* 6 · paciencia o plata · la lanza en la oscuridad: lo único para lo que estaban listos */}
      <Escena t={t} t0={851.61} t1={858.7} entra="diag" golpes={[851.75, 853.8, 856.2]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3a3290 0%, #241d63 45%, #16123d 100%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 25% 45%, rgba(232,192,112,0.35) 0%, rgba(232,192,112,0) 30%), radial-gradient(circle at 75% 50%, rgba(255,200,80,0.3) 0%, rgba(255,200,80,0) 30%)" }} />
        <div style={{ position: "absolute", left: 480, top: 470, transform: `translate(-50%,-50%) scale(${ent(t, 851.75)})`, textAlign: "center" }}>
          <svg width={260} height={340} viewBox="-130 -170 260 340"><path d="M -100 -160 L 100 -160 L 10 0 L 100 160 L -100 160 L -10 0 Z" fill="#cfe8ff" stroke="#c9a24a" strokeWidth={14} /><path d={`M -60 ${-130 + prog(t, 852.6, 858) * 100} L 60 ${-130 + prog(t, 852.6, 858) * 100} L 0 -10 Z`} fill="#e8c070" /><path d={`M -80 150 L 80 150 L 0 ${150 - prog(t, 852.6, 858) * 100} Z`} fill="#e8c070" /></svg>
          <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: C.teal }}>PATIENCE</div>
        </div>
        <div style={{ position: "absolute", left: 960, top: 470, transform: `translate(-50%,-50%) scale(${ent(t, 853.4)})`, fontFamily: "Fredoka", fontWeight: 700, fontSize: 90, color: "#fff" }}>OR</div>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Monedas x={1440} y={520} s={0.8 * ent(t, 853.8)} n={12} /></div>
        <div style={{ position: "absolute", left: 1440, top: 640, transform: `translate(-50%,-50%) scale(${ent(t, 853.8)})`, fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: C.ambar }}>MONEY</div>
        <Ch t={t} t0={856.2} text="A SPEAR IN THE DARK? THE ONE THING THEY WERE READY FOR" color={C.rojo} x={960} y={920} centro size={46} />
      </Escena>
      {/* 7 · algunos campamentos nunca se fueron: el vado del charco negro hoy es la capital de un país */}
      <Escena t={t} t0={858.7} t1={871.42} entra="iris" ix={960} iy={760} golpes={[862.6, 866.0, 867.5]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #5aa8e0, #bfe3f2 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={780} width={1920} height={300} fill="#3a5a4a" /><ellipse cx={960} cy={890} rx={520} ry={80} fill="#2a4a7a" /></svg>
        <CrecePueblo t={t} t0={860.4} t1={865.6} x={960} y={790} />
        <Ch t={t} t0={858.9} t1={862.5} text="SOME CAMPS NEVER LEFT" color={C.violeta} x={960} y={130} centro size={58} />
        <G t={t} t0={862.6} text="DUBLIN" y={220} size={200} color={C.crema} />
        <Ch t={t} t0={866.0} text="CAPITAL OF A WHOLE COUNTRY" color={C.lima} tinta={C.noche} x={960} y={380} centro size={54} />
        <Ch t={t} t0={867.5} text="NOT BAD FOR A PLACE YOU WERE SUPPOSED TO BURN BEFORE BREAKFAST" color={C.ambar} tinta={C.noche} x={960} y={950} centro size={40} />
      </Escena>
      {/* 8 · ¿y Repton? El gran ejército se fue en primavera… no todo */}
      <Escena t={t} t0={871.42} t1={875.47} zoom={0} entra="corte" golpes={[872.3]}>
        <Mundo t={t} cam={cam} e={{ amanece: 0.85 }} />
        <G t={t} t0={871.5} text="AND REPTON?" y={220} size={130} color={C.crema} />
        <Ch t={t} t0={872.4} text="THE GREAT ARMY LEFT IN THE SPRING…" color={C.violeta} x={960} y={370} centro size={52} />
        <Sello t={t} t0={874.2} text="NOT ALL OF IT" x={1400} y={520} size={80} rot={-6} />
      </Escena>
      {/* 9 · junto a la iglesia: un guerrero con su espada, un martillo de Thor y un colmillo de jabalí · y 264+ huesos apilados */}
      <Escena t={t} t0={875.47} t1={896.4} entra="iris" ix={960} iy={700} golpes={[877.8, 880.6, 882.4, 884.2, 885.8, 889.2, 892.7]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #a8c8e0, #e0eef4 40%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={380} width={1920} height={700} fill="#8a6a44" /><rect x={0} y={360} width={1920} height={30} fill="#6a9a4a" /></svg>
        {t < 885.7 ? (
          <>
            <div style={{ position: "absolute", left: 1500, top: 120 }}><Iglesia x={0} y={0} s={0.42} t={t} /></div>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={420} y={520} width={1080} height={340} rx={30} fill="#5e4428" stroke="#3a2a18" strokeWidth={8} /></svg>
            <Esqueleto x={960} y={690} s={2.0} t={t} t0={876.0} />
            {t > 880.6 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><g opacity={ent(t, 880.6)}><rect x={620} y={790} width={760} height={18} fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} /><rect x={1370} y={770} width={20} height={58} fill="#c9a24a" /><rect x={1390} y={788} width={70} height={22} fill="#6b4022" /></g></svg>}
            {t > 882.4 && <Martillo x={680} y={680} s={0.8 * ent(t, 882.4)} />}
            {t > 884.2 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 1140 720 Q 1220 640 1290 700 Q 1220 690 1150 740 Z" fill="#f4ead2" stroke="#2a1530" strokeWidth={6} opacity={ent(t, 884.2)} /></svg>}
            <Ch t={t} t0={875.7} text="RIGHT NEXT TO THE CHURCH" color={C.violeta} x={960} y={110} centro size={56} />
            <Ch t={t} t0={877.8} text="A VIKING WARRIOR" color={C.rojo} x={960} y={220} centro size={56} />
            <Ch t={t} t0={880.6} text="HIS SWORD" color={C.teal} tinta={C.noche} x={1000} y={960} centro size={48} />
            <Ch t={t} t0={882.4} text="THOR'S HAMMER" color={C.ambar} tinta={C.noche} x={500} y={460} centro size={48} />
            <Ch t={t} t0={884.2} text="A WILD BOAR'S TUSK" color={C.teal} tinta={C.noche} x={1450} y={460} centro size={48} />
          </>
        ) : (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={460} y={420} width={1000} height={520} fill="#a8a8b8" stroke="#2a1530" strokeWidth={10} /><rect x={500} y={460} width={920} height={440} fill="#3a2a2a" /></svg>
            {Array.from({ length: 24 }, (_, i) => <Craneo key={i} x={560 + (i % 8) * 115} y={850 - Math.floor(i / 8) * 95} s={0.42} t={t} t0={886.0 + i * 0.05} />)}
            <Ch t={t} t0={885.9} text="NEARBY · AN OLD STONE BUILDING" color={C.violeta} x={960} y={110} centro size={54} />
            <Cuenta t={t} t0={889.2} de={0} a={260} dur={1.2} x={960} y={260} size={190} color={C.crema} sufijo="+" />
            <Ch t={t} t0={890.0} text="PEOPLE · STACKED TOGETHER" color={C.rojo} x={960} y={380} centro size={50} />
            {t > 892.6 && <AbsoluteFill style={{ background: `rgba(8,6,24,${prog(t, 892.6, 893.2) * 0.7})` }} />}
            <G t={t} t0={892.7} text="NOT EVEN THE GREAT ARMY" y={500} size={100} color={C.ambar} />
            <Ch t={t} t0={893.6} text="GOT OUT OF REPTON ALIVE" color={C.rojo} x={960} y={640} centro size={60} />
          </>
        )}
      </Escena>
      {/* 10 · contémoslas otra vez: la cámara recorre las 7 paradas del mundo · 7 trampas antes de que salga el sol */}
      <Escena t={t} t0={896.4} t1={910.78} zoom={0} entra="corte" golpes={[898.3, 899.6, 900.5, 901.4, 903.2, 904.1, 905.1, 906.6]}>
        <Mundo t={t} cam={cam} e={{ amanece: prog(t, 896.4, 910.7) * 0.9 }} yo={<Ruta t={t} t0={897.6} dur={7.52} escala={t > 906 ? 3.7 : 2.4} activa={[898.2, 899.6, 900.5, 901.4, 903.2, 904.1, 905.1].filter((x) => t >= x).length || undefined} />} />
        <Ch t={t} t0={896.6} t1={898.1} text="LET'S COUNT THEM ONE MORE TIME" color={C.violeta} x={960} y={130} centro size={58} />
        <G t={t} t0={906.6} text="7 TRAPS" y={260} size={170} color={C.crema} />
        <Ch t={t} t0={907.8} text="ALL BEFORE THE SUN CAME UP" color={C.ambar} tinta={C.noche} x={960} y={420} centro size={56} />
      </Escena>
      {/* 11 · CTA: si sobreviviste a esta noche, suscribite y la campanita: vienen más trampas · ¿cuál te agarraba primero? */}
      <Escena t={t} t0={910.78} t1={922.4} zoom={0} entra="zoom" golpes={[911.6, 913.4, 916.8]}>
        <Mundo t={t} cam={cam} e={{ amanece: 0.95 }}>
          <Persona x={5500} y={862} h={300} t={t} seed={3} ropa={SAJON} expr="feliz" bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={460} />} />
        </Mundo>
        <Ch t={t} t0={910.9} t1={916.6} text="SURVIVED THE NIGHT WITH THE VIKINGS?" color={C.violeta} x={960} y={110} centro size={54} />
        {t < 916.7 && (
          <div style={{ position: "absolute", left: 960, top: 360, transform: `translate(-50%,-50%) scale(${ent(t, 911.6)})`, display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ background: "#e02020", color: "#fff", fontFamily: "Fredoka", fontWeight: 700, fontSize: 90, padding: "18px 60px", borderRadius: 26, boxShadow: "0 14px 0 #8a1010", transform: `scale(${t > 912.6 && t < 912.9 ? 0.92 : 1})` }}>SUBSCRIBE</div>
            <svg width={150} height={150} viewBox="-75 -75 150 150" style={{ transform: `rotate(${Math.sin(t * 14) * (t > 913.2 ? 18 : 0)}deg)` }}><path d="M -46 30 L -46 -10 Q -46 -52 0 -56 Q 46 -52 46 -10 L 46 30 L 58 44 L -58 44 Z" fill="#ffd23a" stroke="#2a1530" strokeWidth={8} /><circle cx={0} cy={54} r={12} fill="#ffd23a" stroke="#2a1530" strokeWidth={6} /></svg>
          </div>
        )}
        <Ch t={t} t0={913.4} t1={916.6} text="MORE TRAPS ARE COMING" color={C.ambar} tinta={C.noche} x={960} y={560} centro size={62} />
        {t > 916.75 && (
          <>
            <G t={t} t0={916.8} text="WHICH TRAP GETS YOU FIRST?" y={170} size={100} color={C.crema} />
            <div style={{ position: "absolute", left: 110, top: 300, width: 1700, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "26px 30px" }}>
            {["THE PLACE", "THE DITCH", "THE DOGS", "THE SLEEPERS", "THE SHIPS", "THE EXPERTS", "THE MORNING AFTER"].map((n, i) => (
              <div key={n} style={{ transform: `scale(${ent(t, 917.6 + i * 0.25)})`, display: "flex", alignItems: "center", gap: 14, fontFamily: "Fredoka", fontWeight: 700, fontSize: 44, color: "#fff", background: "rgba(27,18,64,.88)", padding: "8px 22px 8px 8px", borderRadius: 40 }}>
                <div style={{ width: 70, height: 70, borderRadius: 35, background: C.ambar, color: C.noche, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>{i + 1}</div>{n}
              </div>
            ))}
            </div>
            <Ch t={t} t0={919.6} text="TELL ME IN THE COMMENTS" color={C.rojo} x={960} y={600} centro size={56} />
          </>
        )}
      </Escena>
    </AbsoluteFill>
  );
};

void gy;
