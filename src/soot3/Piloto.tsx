import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { rnd } from "../soot/lib";
import { Persona, LUCIUS, CENTURION, CIVIL } from "./persona";
import {
  C, FPS, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, lugar,
  Moneda, Pan, Bota, Tienda, Pergamino, Aguila, Casa, Mesa, Pluma, Palo, Garrote, Zzz, Grilla,
} from "./kit";

// Soot and Sandals v3 — piloto del gancho (0-63,5 s) 100 % motion graphics en código, cero imágenes.
// Cada escena = lo que dice la voz EN ESE SEGUNDO (tiempos por palabra de caps.json).
export const PILOTO_DUR = Math.ceil(63.6 * FPS);

// cara cercana: los pies quedan fuera de cuadro, la cabeza centrada en (cx, cy)
const primerPlano = (h: number, cy: number) => cy + 450 * (h / 560);

const SueloCalle: React.FC<{ y?: number; color?: string }> = ({ y = 860, color = "#8a4a2a" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${color}, #4a2418)` }} />
);

export const Piloto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.8}>
        {/* 000 · Roma conquistó el mundo conocido con voluntarios: el mapa se enciende desde Roma */}
        <Escena t={t} t0={0} t1={4.06} zoom={0.12}>
          <MapaPuntos t={t} enciende={[0.3, 3.2]} pulsa={["ROME"]} t0Pulsa={0} />
          <Chip t={t} t0={0.25} text="ROME" color={C.rojo} x={lugar("ROME").x + 34} y={lugar("ROME").y - 50} size={52} />
          <Chip t={t} t0={2.76} text="100% VOLUNTEERS" color={C.teal} tinta={C.noche} x={960} y={930} centro size={70} />
        </Escena>

        {/* 001 · nadie los arrastró encadenados a la mesa de reclutamiento */}
        <Escena t={t} t0={4.06} t1={7.2}>
          <Cielo tipo="atardecer" />
          <Astro x={1500} y={420} r={90} />
          <Colinas capas={["#7a3a6a", "#5a2a5a"]} base={600} seed={3} alto={70} />
          <Casa x={260} y={830} s={1.3} techo="#9a3a2a" />
          <Casa x={1700} y={820} s={1.1} tono="#f0c79a" />
          <SueloCalle y={820} />
          <Mesa x={1350} y={690} w={420} />
          <Persona x={1500} y={900} h={430} t={t} seed={41} ropa={CIVIL(2)} expr="feliz" bD={60} cD={70} flip />
          {[0, 1, 2, 3].map((i) => (
            <Persona key={i} x={interpolate(t, [4.06, 7.2], [-200 + i * 230, 260 + i * 230])} y={930 + (i % 2) * 14} h={420 + (i % 3) * 30} t={t} seed={50 + i} ropa={CIVIL(i)} expr={i % 2 ? "feliz" : "orgullo"} camina={1.4} />
          ))}
          <Chip t={t} t0={5.36} text="NO CHAINS" color={C.rojo} x={960} y={170} centro size={80} />
          <Chip t={t} t0={5.96} text="RECRUITING TABLE" color={C.violeta} x={1350} y={600} centro size={44} />
        </Escena>

        {/* 002a · se acercaron y firmaron */}
        <Escena t={t} t0={7.2} t1={9.02} zoom={0.1}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #7a3fd0, ${C.noche} 75%)` }} />
          <Pergamino x={960} y={560} w={760} abre={1} lineas={8} firma={prog(t, 8.2, 8.95)} titulo="SACRAMENTUM" />
          {(() => {
            const u = prog(t, 8.2, 8.95);
            return (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
                <g transform={`translate(${580 + 80 + u * 290} ${560 + 290 - 30 - Math.sin(u * 20) * 18})`}><Pluma /></g>
              </svg>
            );
          })()}
          <Chip t={t} t0={8.3} text="SIGNED" color={C.teal} tinta={C.noche} x={1420} y={300} size={70} />
        </Escena>

        {/* 002b · y juraron lealtad a Roma */}
        <Escena t={t} t0={9.02} t1={10.9}>
          <Cielo tipo="atardecer" />
          <Astro x={960} y={760} r={150} />
          <Aguila x={1420} y={260} s={1.25} />
          <Persona x={760} y={primerPlano(1150, 520)} h={1150} t={t} seed={1} expr="orgullo" bD={interpolate(ent(t, 9.15), [0, 1], [8, 160])} cD={20} bI={6} mira={0.4} />
          <Chip t={t} t0={9.74} text="THE OATH" color={C.rojo} x={140} y={150} size={72} />
        </Escena>

        {/* 003 · suena noble... hasta que leés el contrato */}
        <Escena t={t} t0={10.9} t1={13.94}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, #2d1b69, #5b2bb5)` }} />
          <Pergamino x={860} y={560} w={820} abre={prog(t, 10.95, 11.7)} lineas={10} titulo="THE CONTRACT" />
          <Persona x={1560} y={primerPlano(900, 640)} h={900} t={t} seed={1} expr={t < 11.8 ? "orgullo" : t < 12.5 ? "sorpresa" : "miedo"} mira={-0.9} />
          <Chip t={t} t0={11.38} t1={11.75} text="NOBLE!" color={C.oro} tinta={C.noche} x={1350} y={180} size={64} />
          <Chip t={t} t0={12.54} text="READ IT" color={C.rojo} x={1350} y={180} size={64} />
        </Escena>

        {/* 004 · 25 años de servicio, sin esposa */}
        <Escena t={t} t0={13.94} t1={16.78}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 35% 50%, #3fb6c8, #1d6f8a 80%)` }} />
          <Grande t={t} t0={13.94} text={`${Math.round(interpolate(t, [13.94, 14.6], [1, 25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}`} x={620} y={420} size={420} />
          <Grande t={t} t0={14.32} text="YEARS" x={620} y={700} size={130} color={C.oro} />
          <Persona x={1450} y={1060} h={560} t={t} seed={1} expr={t < 15.64 ? "sorpresa" : "triste"} mira={-0.6} />
          {t >= 15.64 && (
            <svg style={{ position: "absolute", left: 1290, top: 40, transform: `scale(${ent(t, 15.64)})`, transformOrigin: "160px 120px" }} width={320} height={260}>
              <path d="M 160 230 C 40 150 20 60 90 40 C 130 30 155 60 160 80 C 165 60 190 30 230 40 C 300 60 280 150 160 230 Z" fill={C.rosa} stroke="#fff" strokeWidth={10} />
              <line x1={60} y1={30} x2={270} y2={230} stroke={C.rojo} strokeWidth={26} strokeLinecap="round" />
            </svg>
          )}
          <Chip t={t} t0={15.7} text="NO WIFE" color={C.rojo} x={1450} y={360} centro size={66} />
        </Escena>

        {/* 005 · la paga viene con descuentos: comida, botas, tienda */}
        <Escena t={t} t0={16.78} t1={21.54} zoom={0.06}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #6b3fc0, ${C.noche} 80%)` }} />
          {(() => {
            const sale = [18.72, 19.76, 20.72];
            const dest = [[330, 380], [960, 260], [1590, 380]];
            const quedan = 12 - sale.filter((s) => t > s).length * 3;
            return (
              <>
                {Array.from({ length: 12 }, (_, i) => {
                  const g = Math.floor((11 - i) / 3);
                  const ts = g < 3 ? sale[g] : 1e9;
                  const u = prog(t, ts, ts + 0.45);
                  const x0 = 960, y0 = 860 - i * 30;
                  const [dx, dy] = g < 3 ? dest[g] : [x0, y0];
                  const e = ent(t, 16.78, i * 0.04);
                  return <Moneda key={i} x={x0 + (dx - x0) * u} y={(y0 + (dy - y0) * u - Math.sin(u * Math.PI) * 160) * 1} r={70 * e * (1 - u * 0.5)} />;
                })}
                <Chip t={t} t0={16.88} text={`PAY  ${quedan}/12`} color={C.oro} tinta={C.noche} x={960} y={980} centro size={64} />
              </>
            );
          })()}
          {t > 18.72 && <div style={{ transform: `scale(${ent(t, 18.72)})`, transformOrigin: "330px 520px", position: "absolute", inset: 0 }}><Pan x={330} y={520} s={1.4} /><Chip t={t} t0={18.8} text="FOOD -3" color={C.rojo} x={330} y={680} centro size={48} /></div>}
          {t > 19.76 && <div style={{ transform: `scale(${ent(t, 19.76)})`, transformOrigin: "960px 470px", position: "absolute", inset: 0 }}><Bota x={960} y={470} s={1.1} /></div>}
          {t > 19.76 && <Chip t={t} t0={19.84} text="BOOTS -3" color={C.rojo} x={1220} y={420} centro size={48} />}
          {t > 20.72 && <div style={{ transform: `scale(${ent(t, 20.72)})`, transformOrigin: "1590px 560px", position: "absolute", inset: 0 }}><Tienda x={1590} y={580} s={1.1} /><Chip t={t} t0={20.8} text="TENT -3" color={C.rojo} x={1590} y={680} centro size={48} /></div>}
        </Escena>

        {/* 006 · el centurión puede pegarte con un palo, todos los días */}
        <Escena t={t} t0={21.54} t1={25.44}>
          <Cielo tipo="sangre" />
          <Colinas capas={["#3a0f2a", "#260a1f"]} base={760} seed={7} alto={60} />
          <Persona x={1180} y={primerPlano(1250, 430)} h={1250} t={t} seed={7} ropa={CENTURION} casco="centurion" expr="enojado" mira={-0.8}
            bD={interpolate(Math.sin(t * 6), [-1, 1], [70, 120])} cD={40} manoD={<Palo largo={260} />} bI={14} flip />
          <Persona x={400} y={1000} h={420} t={t} seed={1} expr="miedo" mira={0.9} bI={130} bD={130} cI={110} cD={110} inclina={-8} />
          <Chip t={t} t0={23.88} text="VINE STICK" color={C.ambar} tinta={C.noche} x={1420} y={130} size={58} />
          <Chip t={t} t0={24.66} text="EVERY DAY" color={C.rojo} x={150} y={180} size={80} />
        </Escena>

        {/* 007a · si te dormís en la guardia */}
        <Escena t={t} t0={25.44} t1={27.48}>
          <Cielo tipo="noche" />
          <Estrellas t={t} />
          <Astro x={1500} y={230} r={80} luna />
          <Colinas capas={["#2a1d5c", "#1a1240"]} base={720} seed={12} alto={50} />
          <Persona x={900} y={960} h={600} t={t} seed={1} expr="dormido" casco="legion" inclina={7} bD={20} cD={30} />
          <Zzz x={1000} y={330} t={t} />
          <Chip t={t} t0={25.94} text="ASLEEP ON WATCH" color={C.violeta} x={960} y={150} centro size={60} />
        </Escena>

        {/* 007b · tus propios amigos tienen orden de matarte a palos */}
        <Escena t={t} t0={27.48} t1={29.84}>
          <Cielo tipo="sangre" />
          <Colinas capas={["#2a0818"]} base={820} seed={21} alto={40} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const lado = i < 3 ? -1 : 1, k = i % 3;
            const xf = 960 + lado * (300 + k * 220), x0 = 960 + lado * (900 + k * 200);
            return (
              <Persona key={i} x={interpolate(t, [27.48, 29.4], [x0, xf], { extrapolateRight: "clamp" })} y={980 + k * 10} h={560 + k * 40} t={t} seed={60 + i} sombra="#12061a" camina={1.2}
                flip={lado > 0} bD={150} cD={30} manoD={<g style={{ color: "#12061a" }}><Garrote /></g>} />
            );
          })}
          <Persona x={960} y={960} h={470} t={t} seed={1} expr="miedo" casco="legion" bI={120} bD={120} cI={120} cD={120} />
          <Chip t={t} t0={27.76} text="YOUR OWN FRIENDS" color={C.rojo} x={960} y={150} centro size={76} />
        </Escena>

        {/* 008 · y el retiro, de verdad */}
        <Escena t={t} t0={29.84} t1={32.18}>
          <Cielo tipo="dia" />
          <Astro x={300} y={220} r={80} />
          <Colinas capas={["#8fd16a", "#5fae4a", "#3f8a3a"]} base={620} seed={30} alto={80} />
          <Casa x={1450} y={760} s={1.5} tono="#fff0d0" techo="#d0613f" />
          <Persona x={800} y={960} h={620} t={t} seed={1} expr="feliz" viejo bD={110} cD={60} manoD={<Moneda x={-35} y={-35} r={35} />} />
          <Chip t={t} t0={30.0} text="RETIREMENT" color={C.teal} tinta={C.noche} x={960} y={150} centro size={84} />
          <Chip t={t} t0={31.28} text="REAL" color={C.oro} tinta={C.noche} x={1300} y={300} size={60} />
        </Escena>

        {/* 009a · generoso, incluso */}
        <Escena t={t} t0={32.18} t1={33.26}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, #ffcf5a, #c9771f 80%)` }} />
          {Array.from({ length: 26 }, (_, i) => {
            const r = rnd(i + 200);
            const x = 200 + r() * 1520, d = r() * 0.5;
            const y = interpolate(t, [32.18 + d, 32.18 + d + 0.6], [-120, 760 + r() * 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <Moneda key={i} x={x} y={y} r={60} rot={r() * 360} />;
          })}
          <Grande t={t} t0={32.2} text="GENEROUS" y={420} size={190} color="#fff" />
        </Escena>

        {/* 009b · pero la mitad nunca vivió para cobrarlo */}
        <Escena t={t} t0={33.26} t1={39.22} zoom={0.05}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.noche2}, ${C.noche} 80%)` }} />
          <Grilla t={t} t0={33.3} de={0} a={50} tA={[34.84, 38.3]} y={530} s={2.25} />
          <Chip t={t} t0={34.84} text="ROUGHLY HALF" color={C.rojo} x={960} y={110} centro size={70} />
          <Chip t={t} t0={37.22} text="NEVER COLLECTED" color="#5d5a7a" x={960} y={960} centro size={64} />
        </Escena>

        {/* 010 · así que hoy, VOS te alistás */}
        <Escena t={t} t0={39.22} t1={41.74}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #ff9a4d, #c2386a 55%, #2d1b69 100%)` }} />
          <Persona x={960} y={primerPlano(1300, 560)} h={1300} t={t} seed={1} expr={t < 40.6 ? "sorpresa" : "feliz"} bD={interpolate(ent(t, 40.08), [0, 1], [8, 70])} cD={95} />
          <Grande t={t} t0={40.08} text="YOU" x={1560} y={300} size={220} color={C.oro} />
          <Chip t={t} t0={40.9} text="JOIN THE LEGION" color={C.violeta} x={160} y={160} size={60} />
        </Escena>

        {/* 011 · tu carrera entera, paso a paso */}
        <Escena t={t} t0={41.74} t1={45.0} zoom={0.04}>
          <Cielo tipo="atardecer" />
          <Astro x={1400} y={380} r={110} />
          {(() => {
            const dx = (t - 41.74) * 420;
            return (
              <>
                <Colinas capas={["#8a3a7a", "#6a2a6a", "#4a1d5a"]} base={560} seed={40} alto={110} dx={dx} />
                <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "#c9773a" }} />
                {["I", "V", "X", "XV", "XX", "XXV"].map((n, i) => {
                  const x = 700 + i * 520 - dx;
                  return (
                    <div key={n} style={{ position: "absolute", left: x, top: 720, width: 120, height: 170, background: "#e8d8b8", borderRadius: "60px 60px 8px 8px", boxShadow: "inset -18px 0 0 #c9b48a", fontFamily, fontWeight: 700, fontSize: 52, color: "#7a3d14", textAlign: "center", paddingTop: 30 }}>{n}</div>
                  );
                })}
              </>
            );
          })()}
          <Persona x={760} y={940} h={480} t={t} seed={1} expr="orgullo" casco="legion" camina={1.6} />
          <Chip t={t} t0={42.92} text="YOUR WHOLE CAREER" color={C.violeta} x={960} y={150} centro size={72} />
          <Chip t={t} t0={44.24} text="STEP BY STEP" color={C.teal} tinta={C.noche} x={960} y={270} centro size={54} />
        </Escena>

        {/* 012 · y contamos cada forma en que la Legión intenta matarte */}
        <Escena t={t} t0={45.0} t1={48.36}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, #1b1240, #4a1d5a)` }} />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d="M -40 820 C 300 640 520 900 820 720 S 1360 560 1960 640" stroke="#c9773a" strokeWidth={70} fill="none" strokeLinecap="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - prog(t, 45.0, 45.8))} />
          </svg>
          {[[180, 740], [420, 760], [660, 800], [900, 700], [1160, 640], [1420, 610], [1700, 630]].map(([x, y], i) => {
            const t0 = 45.32 + i * 0.36;
            if (t < t0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: x - 55, top: y - 170, width: 110, height: 110, borderRadius: 55, background: C.rojo, border: "8px solid #fff", transform: `scale(${ent(t, t0)})`, fontFamily, fontWeight: 700, fontSize: 64, color: "#fff", textAlign: "center", lineHeight: "94px", boxShadow: "0 8px 0 rgba(10,5,30,.4)" }}>{i + 1}</div>
            );
          })}
          <Persona x={interpolate(t, [45, 48.36], [120, 420])} y={860} h={300} t={t} seed={1} expr="miedo" casco="legion" camina={1.6} />
          <Chip t={t} t0={47.24} text="WAYS TO DIE" color={C.rojo} x={960} y={150} centro size={76} />
        </Escena>

        {/* 013a · son siete */}
        <Escena t={t} t0={48.36} t1={49.84}>
          <AbsoluteFill style={{ background: C.rojo }} />
          <Grande t={t} t0={48.84} text="7" y={470} size={560} color="#fff" />
          <Grande t={t} t0={49.0} text="TRAPS" y={860} size={130} color={C.oro} />
        </Escena>

        {/* 013b · vamos a anotarte */}
        <Escena t={t} t0={49.84} t1={51.14}>
          <Cielo tipo="atardecer" />
          <SueloCalle y={820} />
          <Mesa x={1150} y={690} w={480} />
          <Pergamino x={1150} y={620} w={300} abre={0.25} lineas={0} />
          <Persona x={1440} y={900} h={430} t={t} seed={41} ropa={CIVIL(2)} expr="feliz" bD={100} cD={60} flip />
          <Persona x={interpolate(t, [49.84, 50.8], [300, 760], { extrapolateRight: "clamp" })} y={940} h={470} t={t} seed={1} expr="feliz" camina={t < 50.8 ? 1.6 : 0} />
          <Chip t={t} t0={50.08} text="SIGN HERE" color={C.teal} tinta={C.noche} x={1150} y={430} centro size={60} />
        </Escena>

        {/* 014 · trampa número uno: el contrato */}
        <Escena t={t} t0={51.14} t1={53.56} zoom={0.05}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${C.violeta}, ${C.noche} 80%)` }} />
          <div style={{ opacity: 0.35 }}><Pergamino x={960} y={560} w={700} abre={1} lineas={10} /></div>
          <Chip t={t} t0={51.14} text="TRAP 1 OF 7" color={C.rojo} x={960} y={330} centro size={64} />
          <Grande t={t} t0={52.5} text="THE CONTRACT" y={560} size={170} />
        </Escena>

        {/* 015 · es el año 110 */}
        <Escena t={t} t0={53.56} t1={55.7}>
          <Cielo tipo="noche" />
          <Estrellas t={t} n={110} seed={8} alto={1080} />
          <Grande t={t} t0={53.98} text={`AD ${Math.round(interpolate(t, [53.98, 54.7], [1, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}`} y={520} size={260} color={C.oro} />
          <Chip t={t} t0={54.3} text="TRAJAN RULES ROME" color={C.violeta} x={960} y={780} centro size={52} />
        </Escena>

        {/* 016a · tenés 18 años */}
        <Escena t={t} t0={55.7} t1={57.26}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 40% 40%, #ffb36b, #e2557a 70%)` }} />
          <Persona x={760} y={primerPlano(1200, 540)} h={1200} t={t} seed={1} expr="feliz" mira={0.5} />
          <Grande t={t} t0={55.94} text="18" x={1480} y={420} size={300} color="#fff" />
          <Chip t={t} t0={56.36} text="YEARS OLD" color={C.violeta} x={1480} y={640} centro size={64} />
        </Escena>

        {/* 016b · en un pueblo polvoriento */}
        <Escena t={t} t0={57.26} t1={58.46}>
          <Cielo tipo="polvo" />
          <Astro x={1650} y={260} r={70} />
          <Casa x={240} y={800} s={1.6} tono="#f0c08a" techo="#b5552c" />
          <Casa x={780} y={760} s={1.2} tono="#e8b07a" />
          <Casa x={1620} y={790} s={1.5} tono="#f2c89a" techo="#a8452c" />
          <SueloCalle y={780} color="#c98a4a" />
          <Persona x={interpolate(t, [57.26, 58.46], [900, 1120])} y={960} h={470} t={t} seed={1} expr="neutro" camina={1.3} />
          <Chip t={t} t0={57.78} text="DUSTY TOWN" color={C.tierra} x={960} y={140} centro size={66} />
        </Escena>

        {/* 016c · en algún lugar de Galia o Hispania */}
        <Escena t={t} t0={58.46} t1={60.34} zoom={0.1}>
          <MapaPuntos t={t} pulsa={["GAUL", "SPAIN"]} t0Pulsa={59.0} />
          <Chip t={t} t0={59.02} text="GAUL" color={C.rojo} x={lugar("GAUL").x + 30} y={lugar("GAUL").y - 60} size={56} />
          <Chip t={t} t0={59.56} text="SPAIN" color={C.rojo} x={lugar("SPAIN").x + 30} y={lugar("SPAIN").y - 60} size={56} />
        </Escena>

        {/* 016d · el campo de la familia no alcanza para dos hermanos */}
        <Escena t={t} t0={60.34} t1={63.6}>
          <Cielo tipo="polvo" />
          <Colinas capas={["#b9844a", "#9a6a34"]} base={600} seed={55} alto={60} />
          <svg style={{ position: "absolute", left: 0, top: 700 }} width={1920} height={380}>
            <rect x={0} y={0} width={1920} height={380} fill="#8a5a2a" />
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-200 + i * 300} y1={380} x2={700 + i * 80} y2={0} stroke="#6a421c" strokeWidth={14} />)}
          </svg>
          <Casa x={1600} y={720} s={0.9} tono="#e8c08a" />
          <Persona x={620} y={980} h={560} t={t} seed={1} expr="triste" mira={0.8} />
          <Persona x={1180} y={990} h={520} t={t} seed={77} ropa={CIVIL(4)} expr="triste" mira={-0.8} flip />
          <Pan x={900} y={860} s={0.8} />
          <Chip t={t} t0={60.88} text="FAMILY FARM" color={C.tierra} x={960} y={130} centro size={64} />
          <Chip t={t} t0={62.38} text="TOO SMALL FOR TWO" color={C.rojo} x={960} y={250} centro size={64} />
        </Escena>
      </CamaraMano>
    </AbsoluteFill>
  );
};
