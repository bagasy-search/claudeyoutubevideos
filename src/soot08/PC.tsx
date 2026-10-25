import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, Pan, Bota } from "./kit";
import { Moneda3, tramos, V } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, NINO, NINA, HILANDERO, DUENO, GenteFab, mulaVaiven } from "./mundo";
import { Gran, Cuenta, Sello, Flash, sacudon, Velo, Horror, Latigo } from "./capas";
import { Girado, Retrato, Huellas } from "./piezas";
import { MulaPerfil, carroX } from "./perfil";
import { Persona } from "./persona";

// PARTE C · HORROR #2, LA MÁQUINA (189,7-295,7 s). Adentro de la fábrica abierta: el chico «calificado» por chico →
// la mula (larga como un colectivo) → la mula DE COSTADO: sale y vuelve → el hilandero que paga a sus ayudantes →
// piecer (hilo cortado, 20 millas descalzo sobre aceite) → scavenger, otra vez de costado: el hueco que se cierra →
// doffers contra el reloj → la comida de pie con pelusa en el pan.
export const C0 = 189.7, C1 = 295.7;

const KM: K[] = [
  [189.7, 3300, -1500, 0.32], [192.0, 3300, -1500, 0.33], [193.4, 2250, -430, 1.1], [196.8, 2250, -430, 1.15], [198.0, 3300, -450, 0.62], [200.2, 3300, -460, 0.6], [202.4, 3300, -500, 0.55], [204.8, 3500, -420, 0.9],
  [214.3, 4350, -450, 1.0], [218.5, 4100, -450, 0.9], [220.8, 3500, -430, 0.8], [222.4, 3300, -430, 0.95], [224.4, 3220, -330, 1.3], [229.0, 3220, -320, 1.45],
  [232.6, 3300, -450, 0.7], [243.0, 3300, -450, 0.62], [245.5, 3200, -200, 1.0], [248.6, 3150, -150, 1.6], [251.7, 3150, -170, 1.5],
  [271.0, 3300, -450, 0.7], [277.0, 3400, -500, 0.75], [284.9, 3300, -500, 0.7], [287.0, 2600, -330, 1.2], [293.0, 2560, -280, 1.5], [295.7, 2560, -280, 1.6],
];
const KL: K[] = [
  [204.8, 0, -560, 0.75], [210.3, 0, -560, 0.7], [214.3, 0, -560, 0.72],
  [251.7, -150, -420, 0.8], [253.3, -150, -420, 0.8], [257.9, 400, -250, 1.35], [262.5, -330, -230, 1.6], [263.9, -420, -230, 1.7], [267.5, -480, -240, 1.9], [271.0, -400, -300, 1.4],
];
const lado = (t: number) => (t >= 204.8 && t < 214.3) || (t >= 251.7 && t < 271.0);

// vaivén de la mula de costado, sincronizado con «out, and back, out, and back»
const uLado = (t: number) => (t < 240 ? tramos(t, [[204.8, 0], [207.4, 1], [208.4, 1], [210.0, 0], [210.8, 1], [211.5, 0], [212.1, 1], [212.8, 0], [213.6, 1], [214.3, 0.6]]) : t < 263.9 ? interpolate(t, [251.7, 253.4], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : tramos(t, [[263.9, 1], [266.4, 0.04]]));

export const PC: React.FC<{ t: number }> = ({ t }) => {
  const enLado = lado(t);
  const cam = enLado ? camara(t, KL) : camara(t, KM);
  const sh = sacudon(t, [195.5, 224.4, 266.3, 267.6]);
  const parada = t > 274 && t < 283.2; // los doffers cambian bobinas con la máquina detenida

  // ── adentro de la fábrica
  const chico: GenteFab = t < 214
    ? { seed: 2, x: 2150, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: t < 195.5 ? "neutro" : "orgullo", salta: 195.5, aparece: 192.3, mira: 1 }
    : t < 224 ? { seed: 2, x: 3050, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: t > 220.8 ? "sorpresa" : "neutro", mira: 1 }
    : t < 232.6 ? { seed: 2, x: 3150, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: "miedo", bD: t > 225 && t < 231 ? 160 : 20, cD: 20, mira: 1, inclina: t > 225 && t < 231 ? 6 : 0 }
    : t < 252 ? { seed: 2, x: 3300 + Math.sin((t - 232.6) * 0.9) * 900, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: "triste", camina: 1.6, flip: Math.cos((t - 232.6) * 0.9) < 0, descalzo: t > 246 } as GenteFab
    : { seed: 2, x: 2520, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: t < 292 ? "triste" : "triste", bD: 120, cD: 70, flip: true };
  const gente: GenteFab[] = [chico];
  if (t > 214 && t < 252) {
    gente.push({ seed: 3, x: 4650, y: 0, h: 480, ropa: HILANDERO, flip: true, barba: true, expr: t > 218 && t < 221 ? "orgullo" : "neutro", habla: t > 214.3 && t < 220.8, bI: t > 217.5 && t < 220.5 ? 70 : 10 });
    gente.push({ seed: 4, x: 3450, y: 0, h: 280, ropa: NINA, gorro: "cofia", largo: true, expr: t > 220.8 && t < 223 ? "sorpresa" : "triste", aparece: 219.0 });
    gente.push({ seed: 5, x: 3800, y: 0, h: 250, ropa: { ...NINO, tunica: "#5e6b3a", tunica2: "#3b4424" }, expr: t > 220.8 && t < 223 ? "sorpresa" : "triste", aparece: 219.25, descalzo: true });
  }
  // los doffers: cuatro chicos que corren a lo largo de la mula
  if (t > 271 && t < 285.5) for (let i = 0; i < 4; i++) {
    const ph = (t * 0.55 + i * 0.25) % 1;
    gente.push({ seed: 10 + i, x: 2250 + ph * 2100, y: 0, h: 260 + (i % 2) * 30, ropa: i % 2 ? NINA : NINO, gorro: i % 2 ? "cofia" : "gorra", largo: i % 2 === 1, camina: 3.2, inclina: 10, bD: 150, bI: 140, cD: 10, expr: "miedo", descalzo: true, aparece: 271.4 + i * 0.15 });
  }
  if (t > 284.9) gente.push({ seed: 20, x: 2950, y: 0, h: 290, ropa: NINA, gorro: "cofia", largo: true, flip: false, bD: 120, cD: 70, expr: "triste" });

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {!enLado ? (
        <>
          <CieloHora t={t} luz={1.6} />
          <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} /></div></Espacio>
          <Espacio cam={cam}>
            <Pueblo t={t} e={{ abre: 1, hora: 9 + (t - 190) / 60, luz: 1.6 }} adentro={{ detenida: parada, corta: t > 224.4 && t < 229.6 ? [9, 10] : [], gente, mulaU: (x) => mulaVaiven(x, t > 232 && t < 252 ? 3.2 : 4.4) }} />
            {/* «larga como un colectivo»: la silueta de un bus moderno punteada sobre la mula */}
            {t > 200.3 && t < 204.8 && (
              <svg style={{ position: "absolute", left: 2050, top: -900, overflow: "visible", opacity: prog(t, 200.3, 200.7) * (1 - prog(t, 204.3, 204.8)) }} width={2500} height={900}>
                <rect x={0} y={140} width={2500} height={680} rx={90} fill="rgba(255,214,90,.12)" stroke={C.oro} strokeWidth={22} strokeDasharray="70 40" />
                {Array.from({ length: 8 }, (_, i) => <rect key={i} x={160 + i * 290} y={230} width={220} height={210} rx={24} fill="none" stroke={C.oro} strokeWidth={14} strokeDasharray="40 24" />)}
                {[420, 2080].map((x) => <circle key={x} cx={x} cy={820} r={110} fill="none" stroke={C.oro} strokeWidth={22} strokeDasharray="50 30" />)}
              </svg>
            )}
            {/* el padre-hilandero paga: monedas de su bolsillo a los chicos */}
            {t > 217.6 && t < 221 && [0, 1, 2].map((i) => {
              const k = prog(t, 217.7 + i * 0.3, 218.8 + i * 0.3);
              return <Moneda3 key={i} t={t} t0={217.7 + i * 0.3} t1={220.6} x={4600 - k * (1150 - i * 350)} y={-420 - Math.sin(k * Math.PI) * 220} s={0.3} txt="d" oro />;
            })}
            {/* el hilo cortado: chispa roja donde se rompe */}
            {t > 224.4 && t < 226 && <div style={{ position: "absolute", left: 3150, top: -560, width: 80, height: 80, borderRadius: 40, background: C.rojo, transform: `scale(${1 + Math.sin(t * 30) * 0.3})`, opacity: 0.8 }} />}
            {/* aceite en el piso + zapato que patina */}
            {t > 246.5 && t < 251.7 && (
              <>
                <svg style={{ position: "absolute", left: 2900, top: -18, overflow: "visible" }} width={600} height={40}><ellipse cx={300} cy={20} rx={300 * prog(t, 246.6, 247.4)} ry={20} fill="#2a2238" opacity={0.85} /><ellipse cx={240} cy={14} rx={120 * prog(t, 246.6, 247.4)} ry={6} fill="#8a7ac0" opacity={0.6} /></svg>
                {t > 248.6 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${interpolate(t, [248.6, 249.6], [3100, 3420], { extrapolateRight: "clamp" })}px, ${-40}px) rotate(${interpolate(t, [248.6, 249.6], [0, 40], { extrapolateRight: "clamp" })}deg)` }}><Bota x={0} y={0} s={0.9} /></div>}
              </>
            )}
            {/* doffers: bobinas llenas que vuelan al canasto */}
            {parada && (
              <>
                <svg style={{ position: "absolute", left: 4680, top: -170, overflow: "visible" }} width={300} height={170}><rect x={0} y={20} width={300} height={150} rx={20} fill={V.madera} /><rect x={0} y={20} width={300} height={26} rx={12} fill="#c48a4c" />{Array.from({ length: Math.floor(prog(t, 274, 283) * 9) }, (_, i) => <ellipse key={i} cx={40 + (i % 5) * 52} cy={10 - Math.floor(i / 5) * 30} rx={24} ry={40} fill={V.algodon} />)}</svg>
                {Array.from({ length: 6 }, (_, i) => {
                  const k = ((t - 274) * 1.3 + i / 6) % 1;
                  const x0 = 2300 + ((i * 397) % 1900);
                  return <ellipse key={i} cx={x0 + (4830 - x0) * k} cy={-400 - Math.sin(k * Math.PI) * 380 + k * 250} rx={22} ry={40} fill={V.algodon} stroke="#c9b48a" strokeWidth={4} transform={`rotate(${k * 360} ${x0 + (4830 - x0) * k} ${-400 - Math.sin(k * Math.PI) * 380 + k * 250})`} />;
                })}
              </>
            )}
            {/* el pan en la mano, con la pelusa que cae encima */}
            {t > 288.6 && (
              <>
                <div style={{ position: "absolute", left: 2600, top: -180 }}><Pan x={0} y={0} s={0.42 * ent(t, 288.7)} /></div>
                {Array.from({ length: 14 }, (_, i) => {
                  const k = ((t - 288.6) * 0.35 + i / 14) % 1;
                  const land = t > 292 && i % 3 === 0;
                  return <circle key={i} cx={2560 + ((i * 53) % 110) + Math.sin(t * 2 + i) * 18} cy={land ? -196 + (i % 4) * 4 : -700 + k * 520} r={7 + (i % 3) * 3} fill="#fffaf0" opacity={0.9} />;
                })}
              </>
            )}
          </Espacio>
        </>
      ) : (
        <>
          <AbsoluteFill style={{ background: "#c9a27a" }} />
          <Espacio cam={cam}>
            <MulaPerfil t={t} u={uLado(t)} peligro={t > 263.6 && t < 271 ? prog(t, 263.6, 264.2) : 0}>
              {/* el scavenger: se arrastra panza abajo hasta debajo de los hilos (dibujado DETRÁS del carro) */}
              {t > 255 && <Girado t={t} rot={-90} g={{ seed: 30, x: interpolate(t, [257.9, 262.4], [760, -330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), y: -6, h: 250, ropa: NINO, gorro: "gorra", expr: t < 263.9 ? "neutro" : t < 267.5 ? "miedo" : "sorpresa", bD: 170 + Math.sin(t * 8) * 10, bI: 160, descalzo: true }} />}
              {t > 263.9 && t < 271 && <Emote t={t} t0={263.95} tipo="susto" x={-600} y={-120} s={0.6} />}
              {/* el hilandero, del otro lado del carro */}
              {t < 214.3 && <Persona t={t} seed={41} x={carroX(uLado(t)) + 420} y={0} h={480} ropa={HILANDERO} barba flip expr="neutro" bI={50} cI={40} camina={Math.abs(uLado(t + 0.05) - uLado(t)) > 0.002 ? 1.4 : 0} />}
            </MulaPerfil>
          </Espacio>
        </>
      )}

      {/* ── capas de pantalla ── */}
      <Latigo t={t} at={[189.75, 204.8, 214.3, 251.7, 271.0]} />
      <Horror t={t} t0={189.75} n={2} nombre="THE MACHINE" t1={192.0} />
      <Chip t={t} t0={192.2} t1={193.9} text="LET'S GIVE YOU A JOB" color={C.violeta} x={960} y={150} centro size={74} />
      <Chip t={t} t0={194.0} t1={195.3} text="YOU ARE SMALL" color={C.noche} x={960} y={150} centro size={74} />
      <Sello t={t} t0={195.5} t1={197.1} text="QUALIFIED" x={960} y={300} size={170} color={C.lima} rot={-8} />
      <Gran t={t} t0={198.3} t1={200.2} text="THE SPINNING MULE" y={170} size={130} color={C.ambar} />
      <Chip t={t} t0={200.6} t1={204.6} text="AS LONG AS A BUS" color={C.oro} tinta={C.noche} x={960} y={150} centro size={80} />
      <Chip t={t} t0={202.6} t1={204.6} text="HUNDREDS OF SPINDLES" color={C.noche} x={960} y={950} centro size={66} />
      <Chip t={t} t0={205.2} t1={207.6} text="ROLLS OUT →" color={C.teal} tinta={C.noche} x={1300} y={150} centro size={74} />
      <Chip t={t} t0={206.0} t1={208.2} text="STRETCH + TWIST" color={C.violeta} x={760} y={950} centro size={62} />
      <Chip t={t} t0={208.5} t1={210.3} text="← ROLLS BACK" color={C.naranja} x={620} y={150} centro size={74} />
      {[[210.8, "OUT"], [211.5, "BACK"], [212.1, "OUT"], [212.8, "BACK"]].map(([t0, s], i) => <Gran key={i} t={t} t0={t0 as number} t1={(t0 as number) + 0.6} text={s as string} y={260} x={i % 2 ? 640 : 1280} size={150} color={i % 2 ? C.naranja : C.teal} />)}
      <Gran t={t} t0={213.4} t1={214.3} text="ALL DAY." y={260} size={170} color={C.crema} />
      <Chip t={t} t0={214.5} t1={217.5} text="THE ADULT SPINNER" color={C.noche} x={960} y={150} centro size={72} />
      <Chip t={t} t0={217.6} t1={220.7} text="PAYS HIS OWN HELPERS" color={C.oro} tinta={C.noche} x={960} y={950} centro size={68} />
      <Gran t={t} t0={220.9} t1={222.3} text="GUESS WHO?" y={190} size={150} color={C.ambar} />
      <Chip t={t} t0={222.5} t1={224.3} text="JOB 1 · THE PIECER" color={C.rojo} x={960} y={150} centro size={86} />
      <Flash t={t} at={[224.4, 266.3]} color="#ffdcdc" />
      <Chip t={t} t0={224.5} t1={226.3} text="SNAP!" color={C.rojo} x={1250} y={300} centro size={90} />
      <Chip t={t} t0={226.4} t1={232.4} text="A FEW SECONDS TO FIX IT" color={C.violeta} x={960} y={150} centro size={70} />
      <Chip t={t} t0={229.1} t1={232.4} text="THE CARRIAGE KEEPS MOVING" color={C.noche} x={960} y={950} centro size={64} />
      <Chip t={t} t0={232.7} t1={236.6} text="BACK AND FORTH · ALL SHIFT" color={C.violeta} x={960} y={150} centro size={70} />
      <Retrato t={t} t0={236.9} t1={242.9} x={1560} y={420} g={{ seed: 50, ropa: DUENO, gorro: "copa", barba: true, expr: "neutro" }} nombre="JOHN FIELDEN" sub="MILL OWNER · MP" s={0.95} />
      <Chip t={t} t0={238.4} t1={242.9} text="HOW FAR DOES A PIECER WALK?" color={C.noche} x={760} y={150} centro size={60} />
      <Huellas t={t} t0={243.1} t1={246.0} y={920} fuera={248.4} />
      <Cuenta t={t} t0={243.2} t1={244.6} de={0} a={20} x={960} y={300} size={220} color={C.ambar} pre="UP TO " suf=" MILES" fuera={246.4} />
      <Chip t={t} t0={245.0} t1={246.5} text="ON A WOODEN FLOOR" color={C.noche} x={960} y={520} centro size={64} />
      <Chip t={t} t0={246.6} t1={250.2} text="BAREFOOT" color={C.rojo} x={960} y={150} centro size={90} />
      <Chip t={t} t0={248.7} t1={250.2} text="SHOES SLIP ON THE OIL" color={C.violeta} x={960} y={950} centro size={66} />
      <Chip t={t} t0={250.4} t1={251.6} text="JOB 2 IS WORSE" color={C.noche} x={960} y={150} centro size={80} />
      <Chip t={t} t0={251.8} t1={255.0} text="JOB 2 · THE SCAVENGER" color={C.rojo} x={960} y={150} centro size={86} />
      <Chip t={t} t0={253.4} t1={257.6} text="FLUFF PILES UP UNDERNEATH" color={C.violeta} x={960} y={950} centro size={64} />
      <Chip t={t} t0={258.0} t1={263.6} text="THE SMALLEST CHILD CRAWLS UNDER" color={C.noche} x={960} y={150} centro size={62} />
      <Chip t={t} t0={260.4} t1={263.6} text="WHILE IT IS RUNNING" color={C.rojo} x={960} y={950} centro size={70} />
      <Chip t={t} t0={264.0} t1={267.4} text="THE GAP CLOSES OVER YOUR HEAD" color={C.rojo} x={960} y={150} centro size={66} />
      {t > 267.5 && t < 271 && <Velo t={t} t0={267.5} t1={270.7} op={0.5} />}
      <Gran t={t} t0={267.6} t1={270.8} text="NO SECOND TRY" y={300} size={160} color={C.rojo} />
      <Chip t={t} t0={271.1} t1={273.0} text="JOB 3 · THE DOFFER" color={C.rojo} x={960} y={150} centro size={86} />
      <Chip t={t} t0={273.2} t1={277.0} text="FULL BOBBINS OFF · EMPTY ONES ON" color={C.violeta} x={960} y={950} centro size={60} />
      <Chip t={t} t0={277.2} t1={282.3} text="AS FAST AS HUMANLY POSSIBLE" color={C.noche} x={960} y={150} centro size={66} />
      {t > 277.4 && t < 284.9 && (
        <>
          <Cuenta t={t} t0={277.4} t1={283.4} de={0} a={6} x={480} y={460} size={120} color={C.crema} pre="0:0" fuera={284.6} />
          <Chip t={t} t0={277.5} t1={284.6} text="MACHINE STOPPED" color={C.rojo} x={480} y={330} centro size={48} />
          <Cuenta t={t} t0={280.0} t1={284.6} de={0} a={3} x={1440} y={460} size={120} color={C.rojo} pre="−" suf="s" fuera={284.6} />
          {Array.from({ length: 6 }, (_, i) => <Moneda3 key={i} t={t} t0={280.2 + i * 0.6} t1={284.6} x={1440 + (i % 3 - 1) * 80} y={600 + Math.min(1, (t - 280.2 - i * 0.6) * 1.5) * 300} s={0.32} txt="s" />)}
          <Chip t={t} t0={282.5} t1={284.6} text="= OWNER'S MONEY" color={C.oro} tinta={C.noche} x={1440} y={330} centro size={48} />
        </>
      )}
      <Chip t={t} t0={285.0} t1={288.4} text="THE BREAKS WILL SAVE YOU?" color={C.violeta} x={960} y={150} centro size={70} />
      <Chip t={t} t0={287.0} t1={289.3} text="MACHINES KEEP RUNNING" color={C.rojo} x={960} y={950} centro size={66} />
      <Chip t={t} t0={289.4} t1={292.0} text="EAT STANDING · AT YOUR POST" color={C.noche} x={960} y={150} centro size={66} />
      <Chip t={t} t0={292.2} t1={295.6} text="COTTON FLUFF ON YOUR BREAD" color={C.naranja} x={960} y={950} centro size={66} />
      <Emote t={t} t0={293} t1={295.6} tipo="sudor" x={960 + (2520 - cam.x) * cam.z} y={540 + (-250 - cam.y) * cam.z} s={0.5 * cam.z} />
    </AbsoluteFill>
  );
};
