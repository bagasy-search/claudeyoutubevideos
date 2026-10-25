import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { rnd } from "../soot/lib";
import { Persona, CENTURION, CIVIL } from "./persona";
import {
  C, FPS, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, lugar,
  Moneda, Pan, Bota, Tienda, Pergamino, Aguila, Casa, Mesa, Pluma, Palo, Garrote, Zzz, Grilla,
  Particulas, Rayos, Frente, Emote, cabeza,
} from "./kit";

// Soot and Sandals v3 — piloto del gancho (0-63,5 s) 100 % motion graphics en código, cero imágenes.
// Pasada 2 (inmersiva): transición propia en cada corte, golpes de zoom en las palabras fuertes, partículas,
// luz, primer plano con paralaje, emociones y algo nuevo cada 1-1,5 s.
export const PILOTO_DUR = Math.ceil(63.6 * FPS);

const primerPlano = (h: number, cy: number) => cy + 450 * (h / 560);
const SueloCalle: React.FC<{ y?: number; color?: string }> = ({ y = 860, color = "#8a4a2a" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${color}, #4a2418)` }} />
);

export const Piloto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const L = (x: number, y: number, h: number) => cabeza(x, y, h);
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.8}>
        {/* 000 · Roma conquistó el mundo conocido con voluntarios: el mapa se enciende desde Roma y salen las legiones */}
        <Escena t={t} t0={0} t1={4.06} zoom={0.1} entra="corte" golpes={[2.76]}>
          <MapaPuntos t={t} enciende={[0.3, 2.4]} pulsa={["ROME"]} t0Pulsa={0}
            rutas={[{ a: "BRITAIN", t0: 1.4 }, { a: "SPAIN", t0: 1.6 }, { a: "EGYPT", t0: 1.8 }, { a: "SYRIA", t0: 2.0 }, { a: "DANUBE", t0: 2.2 }]} />
          <Chip t={t} t0={0.25} text="ROME" color={C.rojo} x={lugar("ROME").x + 34} y={lugar("ROME").y - 50} size={52} />
          <Chip t={t} t0={1.36} text="THE KNOWN WORLD" color={C.violeta} x={960} y={120} centro size={58} />
          <Chip t={t} t0={2.76} text="100% VOLUNTEERS" color={C.teal} tinta={C.noche} x={960} y={930} centro size={76} />
        </Escena>

        {/* 001 · nadie los arrastró encadenados: la fila llega sola, contenta, a la mesa */}
        <Escena t={t} t0={4.06} t1={7.2} entra="barrido" golpes={[5.36]}>
          <Cielo tipo="atardecer" />
          <Rayos t={t} x={1500} y={420} />
          <Astro x={1500} y={420} r={90} />
          <Colinas capas={["#7a3a6a", "#5a2a5a"]} base={600} seed={3} alto={70} dx={(t - 4) * 20} />
          <Casa x={260} y={830} s={1.3} techo="#9a3a2a" luz />
          <Casa x={1700} y={820} s={1.1} tono="#f0c79a" />
          <SueloCalle y={820} />
          <Mesa x={1350} y={690} w={420} />
          <Persona x={1500} y={900} h={430} t={t} seed={41} ropa={CIVIL(2)} expr="feliz" bD={interpolate(Math.sin(t * 5), [-1, 1], [60, 110])} cD={70} flip habla />
          {[0, 1, 2, 3].map((i) => (
            <Persona key={i} x={interpolate(t, [4.06, 7.2], [-200 + i * 230, 260 + i * 230])} y={930 + (i % 2) * 14} h={420 + (i % 3) * 30} t={t} seed={50 + i} ropa={CIVIL(i)} expr={i % 2 ? "feliz" : "orgullo"} camina={1.4} />
          ))}
          <Particulas t={t} tipo="polvo" n={30} seed={2} />
          <Frente t={t} color="#2a1020" vel={90} seed={4} />
          {/* cadena que cae rota */}
          {t > 5.36 && (
            <svg style={{ position: "absolute", left: 860, top: 260, transform: `translateY(${Math.min(1, (t - 5.36) * 2.2) ** 2 * 520}px) rotate(${(t - 5.36) * 90}deg)`, opacity: Math.max(0, 1 - Math.max(0, t - 6.2)) }} width={200} height={120}>
              {[0, 1, 2].map((k) => <ellipse key={k} cx={40 + k * 55} cy={60} rx={34} ry={20} fill="none" stroke="#c8ccd4" strokeWidth={12} transform={k === 1 ? "rotate(90 95 60)" : undefined} />)}
            </svg>
          )}
          <Chip t={t} t0={5.36} text="NO CHAINS" color={C.rojo} x={960} y={170} centro size={84} />
          <Chip t={t} t0={5.96} text="RECRUITING TABLE" color={C.violeta} x={1350} y={600} centro size={44} />
        </Escena>

        {/* 002a · se acercaron y firmaron */}
        <Escena t={t} t0={7.2} t1={9.02} zoom={0.1} entra="iris" ix={960} iy={560}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #7a3fd0, ${C.noche} 75%)` }} />
          <Rayos t={t} x={960} y={540} color="#c9a8ff" op={0.08} />
          <Pergamino x={960} y={560} w={760} abre={prog(t, 7.25, 7.7)} lineas={8} firma={prog(t, 8.2, 8.95)} titulo="SACRAMENTUM" />
          {t > 7.6 && (() => {
            const u = prog(t, 8.2, 8.95);
            return (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
                <g transform={`translate(${660 + u * 290} ${820 - Math.sin(u * 20) * 18 - (1 - ent(t, 7.6)) * 300})`}><Pluma /></g>
              </svg>
            );
          })()}
          <Chip t={t} t0={7.3} text="WALKED UP" color={C.violeta} x={260} y={300} size={56} />
          <Chip t={t} t0={8.3} text="SIGNED" color={C.teal} tinta={C.noche} x={1420} y={300} size={72} />
        </Escena>

        {/* 002b · y juraron lealtad a Roma */}
        <Escena t={t} t0={9.02} t1={10.9} entra="zoom" golpes={[9.74]}>
          <Cielo tipo="atardecer" />
          <Rayos t={t} x={960} y={760} op={0.16} />
          <Astro x={960} y={760} r={150} />
          <Aguila x={1420} y={260} s={1.25} />
          <Particulas t={t} tipo="destellos" n={14} seed={6} />
          <Persona x={760} y={primerPlano(1150, 520)} h={1150} t={t} seed={1} expr="orgullo" bD={interpolate(ent(t, 9.15), [0, 1], [8, 160])} cD={20} bI={6} mira={0.4} ladea={-4} />
          <Emote t={t} t0={9.8} tipo="brillos" {...L(760, primerPlano(1150, 520), 1150)} s={2} />
          <Chip t={t} t0={9.74} text="THE OATH" color={C.rojo} x={140} y={150} size={72} />
          <Chip t={t} t0={10.12} text="TO ROME" color={C.oro} tinta={C.noche} x={140} y={270} size={56} />
        </Escena>

        {/* 003 · suena noble... hasta que leés el contrato */}
        <Escena t={t} t0={10.9} t1={13.94} entra="diag" golpes={[12.86]}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, #2d1b69, #5b2bb5)` }} />
          <Pergamino x={860} y={560} w={820} abre={prog(t, 10.95, 11.7)} lineas={10} titulo="THE CONTRACT" />
          {/* lupa que recorre la letra chica */}
          {t > 12.3 && (
            <svg style={{ position: "absolute", left: interpolate(t, [12.3, 13.9], [520, 980], { extrapolateRight: "clamp" }), top: interpolate(t, [12.3, 13.9], [380, 640], { extrapolateRight: "clamp" }), transform: `scale(${ent(t, 12.3)})` }} width={260} height={260}>
              <circle cx={110} cy={110} r={86} fill="rgba(255,255,255,.18)" stroke="#3b2416" strokeWidth={18} />
              <line x1={176} y1={176} x2={246} y2={246} stroke="#3b2416" strokeWidth={30} strokeLinecap="round" />
            </svg>
          )}
          <Persona x={1560} y={primerPlano(900, 640)} h={900} t={t} seed={1} expr={t < 11.8 ? "orgullo" : t < 12.5 ? "sorpresa" : "miedo"} mira={-0.9} salta={12.5} />
          <Emote t={t} t0={12.86} tipo="sudor" {...L(1560, primerPlano(900, 640), 900)} s={1.6} />
          <Chip t={t} t0={11.38} t1={11.75} text="NOBLE!" color={C.oro} tinta={C.noche} x={1350} y={180} size={64} />
          <Chip t={t} t0={12.54} text="READ IT" color={C.rojo} x={1350} y={180} size={64} />
        </Escena>

        {/* 004 · 25 años de servicio, sin esposa */}
        <Escena t={t} t0={13.94} t1={16.78} entra="sube" golpes={[14.6, 15.78]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 35% 50%, #3fb6c8, #1d6f8a 80%)` }} />
          <Rayos t={t} x={620} y={460} op={0.08} />
          <Grande t={t} t0={13.94} text={`${Math.round(interpolate(t, [13.94, 14.6], [1, 25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}`} x={620} y={420} size={420} />
          <Grande t={t} t0={14.32} text="YEARS" x={620} y={700} size={130} color={C.oro} />
          {/* hojas de calendario que vuelan */}
          {Array.from({ length: 8 }, (_, i) => {
            const t0 = 14.0 + i * 0.08, u = Math.max(0, t - t0);
            if (t < t0) return null;
            const r = rnd(i + 40);
            const dir = r() < 0.5 ? -1 : 1, vx = 300 + r() * 500, rr = r() - 0.5;
            return <div key={i} style={{ position: "absolute", left: 560 + u * vx * dir, top: 380 - u * 400 + u * u * 500, width: 90, height: 100, background: "#fff", borderTop: `22px solid ${C.rojo}`, borderRadius: 8, transform: `rotate(${u * 400 * rr}deg)`, opacity: Math.max(0, 1 - u * 0.8) }} />;
          })}
          <Persona x={1450} y={1060} h={560} t={t} seed={1} expr={t < 15.64 ? "sorpresa" : "triste"} mira={-0.6} aparece={14.0} />
          {t >= 15.64 && (
            <svg style={{ position: "absolute", left: 1290, top: 40, transform: `scale(${ent(t, 15.64)})`, transformOrigin: "160px 120px" }} width={320} height={260}>
              <path d="M 160 230 C 40 150 20 60 90 40 C 130 30 155 60 160 80 C 165 60 190 30 230 40 C 300 60 280 150 160 230 Z" fill={C.rosa} stroke="#fff" strokeWidth={10} />
              <line x1={60} y1={30} x2={60 + 210 * prog(t, 15.8, 16.05)} y2={30 + 200 * prog(t, 15.8, 16.05)} stroke={C.rojo} strokeWidth={26} strokeLinecap="round" />
            </svg>
          )}
          <Emote t={t} t0={16.0} tipo="lagrimas" {...L(1450, 1060, 560)} />
          <Chip t={t} t0={15.7} text="NO WIFE" color={C.rojo} x={1450} y={360} centro size={66} />
        </Escena>

        {/* 005 · la paga viene con descuentos: comida, botas, tienda */}
        <Escena t={t} t0={16.78} t1={21.54} zoom={0.06} entra="iris" golpes={[18.72, 19.76, 20.72]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #6b3fc0, ${C.noche} 80%)` }} />
          <Rayos t={t} x={960} y={700} color="#ffd77a" op={0.07} />
          {(() => {
            const sale = [18.72, 19.76, 20.72];
            const dest = [[330, 380], [960, 260], [1590, 380]];
            const quedan = 12 - sale.filter((s) => t > s).length * 3;
            return (
              <>
                {Array.from({ length: 12 }, (_, i) => {
                  const g = Math.floor((11 - i) / 3);
                  const ts = g < 3 ? sale[g] + (i % 3) * 0.07 : 1e9;
                  const u = prog(t, ts, ts + 0.45);
                  const x0 = 960, y0 = 860 - i * 30;
                  const [dx, dy] = g < 3 ? dest[g] : [x0, y0];
                  const e = ent(t, 16.78, i * 0.05);
                  if (u >= 1) return null;
                  return <Moneda key={i} x={x0 + (dx - x0) * u} y={y0 + (dy - y0) * u - Math.sin(u * Math.PI) * 160 - (1 - e) * 300} r={70 * (1 - u * 0.5)} gira={u > 0 ? 3 : 0} t={t} />;
                })}
                <Chip t={t} t0={16.88} text={`PAY  ${quedan}/12`} color={quedan > 6 ? C.oro : C.rojo} tinta={quedan > 6 ? C.noche : "#fff"} x={960} y={980} centro size={64} />
              </>
            );
          })()}
          {t > 18.72 && <div style={{ transform: `scale(${ent(t, 18.72)})`, transformOrigin: "330px 520px", position: "absolute", inset: 0 }}><Pan x={330} y={520} s={1.4} /><Chip t={t} t0={18.8} text="FOOD -3" color={C.rojo} x={330} y={680} centro size={48} /></div>}
          {t > 19.76 && <div style={{ transform: `scale(${ent(t, 19.76)})`, transformOrigin: "960px 470px", position: "absolute", inset: 0 }}><Bota x={960} y={470} s={1.1} /></div>}
          {t > 19.76 && <Chip t={t} t0={19.84} text="BOOTS -3" color={C.rojo} x={1220} y={420} centro size={48} />}
          {t > 20.72 && <div style={{ transform: `scale(${ent(t, 20.72)})`, transformOrigin: "1590px 560px", position: "absolute", inset: 0 }}><Tienda x={1590} y={580} s={1.1} /><Chip t={t} t0={20.8} text="TENT -3" color={C.rojo} x={1590} y={680} centro size={48} /></div>}
          <Chip t={t} t0={17.64} text="DEDUCTIONS" color={C.violeta} x={960} y={110} centro size={60} />
        </Escena>

        {/* 006 · el centurión puede pegarte con un palo, todos los días */}
        <Escena t={t} t0={21.54} t1={25.44} entra="corte" golpes={[23.34, 24.66]}>
          <Cielo tipo="sangre" />
          <Rayos t={t} x={1180} y={300} color="#ff8a4d" op={0.1} />
          <Colinas capas={["#3a0f2a", "#260a1f"]} base={760} seed={7} alto={60} />
          <Particulas t={t} tipo="brasas" n={36} seed={8} />
          {/* cámara contrapicada: el centurión enorme */}
          <Persona x={1180} y={primerPlano(1250, 540)} h={1250} t={t} seed={7} ropa={CENTURION} casco="centurion" expr="enojado" mira={-0.8}
            bD={t < 23.2 ? interpolate(Math.sin(t * 6), [-1, 1], [70, 120]) : interpolate(((t - 23.2) * 2.6) % 1, [0, 0.55, 1], [160, 40, 160])} cD={40} manoD={<Palo largo={260} />} bI={14} flip />
          <Emote t={t} t0={22.86} tipo="enojo" {...L(1180, primerPlano(1250, 540), 1250)} s={2} />
          <Persona x={400} y={1000} h={420} t={t} seed={1} expr="miedo" mira={0.9} bI={130} bD={130} cI={110} cD={110} inclina={-8 + Math.sin(t * 30) * (t > 23.34 ? 2 : 0)} />
          <Emote t={t} t0={23.4} tipo="susto" {...L(400, 1000, 420)} />
          <Chip t={t} t0={23.88} text="VINE STICK" color={C.ambar} tinta={C.noche} x={1420} y={130} size={58} />
          <Chip t={t} t0={24.66} text="EVERY DAY" color={C.rojo} x={150} y={180} size={80} />
          {/* rayitas del calendario: 7 días, 7 golpes */}
          {Array.from({ length: 7 }, (_, i) => t > 24.7 + i * 0.09 && <div key={i} style={{ position: "absolute", left: 160 + i * 46, top: 280, width: 14, height: 70, borderRadius: 7, background: "#fff", transform: `rotate(${i === 4 ? 0 : 12}deg) scaleY(${ent(t, 24.7 + i * 0.09)})` }} />)}
        </Escena>

        {/* 007a · si te dormís en la guardia */}
        <Escena t={t} t0={25.44} t1={27.48} entra="sube">
          <Cielo tipo="noche" />
          <Estrellas t={t} />
          <Astro x={1500} y={230} r={80} luna />
          <Colinas capas={["#2a1d5c", "#1a1240"]} base={720} seed={12} alto={50} />
          <Particulas t={t} tipo="luciernagas" n={24} seed={9} />
          {/* fogata que se apaga */}
          <svg style={{ position: "absolute", left: 1180, top: 820 }} width={200} height={160}>
            {[0, 1, 2].map((k) => <path key={k} d={`M ${60 + k * 30} 140 Q ${40 + k * 30 + Math.sin(t * 9 + k) * 10} ${80 - k * 10} ${70 + k * 30} ${40 + Math.sin(t * 7 + k) * 12} Q ${100 + k * 30} 90 ${80 + k * 30} 140 Z`} fill={k === 1 ? "#ffd27a" : "#ff7a3d"} opacity={interpolate(t, [25.44, 27.4], [1, 0.25], { extrapolateRight: "clamp" })} />)}
            <rect x={30} y={136} width={140} height={16} rx={8} fill="#5a3418" />
          </svg>
          <Persona x={900} y={960} h={600} t={t} seed={1} expr="dormido" casco="legion" inclina={interpolate(t, [25.44, 27.4], [2, 12], { extrapolateRight: "clamp" })} bD={20} cD={30} />
          <Zzz x={1000} y={330} t={t} />
          <Chip t={t} t0={25.94} text="ASLEEP ON WATCH" color={C.violeta} x={960} y={150} centro size={60} />
          <Chip t={t} t0={26.6} text="WRONG MOMENT" color={C.rojo} x={960} y={260} centro size={46} />
        </Escena>

        {/* 007b · tus propios amigos tienen orden de matarte a palos */}
        <Escena t={t} t0={27.48} t1={29.84} entra="corte" golpes={[27.76, 29.18]}>
          <Cielo tipo="sangre" />
          <Colinas capas={["#2a0818"]} base={820} seed={21} alto={40} />
          <Particulas t={t} tipo="brasas" n={30} seed={11} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const lado = i < 3 ? -1 : 1, k = i % 3;
            const xf = 960 + lado * (300 + k * 220), x0 = 960 + lado * (900 + k * 200);
            return (
              <Persona key={i} x={interpolate(t, [27.48, 29.4], [x0, xf], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={980 + k * 10} h={560 + k * 40} t={t} seed={60 + i} sombra="#12061a" camina={t < 29.4 ? 1.2 : 0}
                flip={lado > 0} bD={t > 29.18 ? 60 : 150} cD={30} manoD={<g style={{ color: "#12061a" }}><Garrote /></g>} />
            );
          })}
          <Persona x={960} y={960} h={470} t={t} seed={1} expr="miedo" casco="legion" bI={120} bD={120} cI={120} cD={120} />
          <Emote t={t} t0={27.9} tipo="excl" {...L(960, 960, 470)} />
          <Emote t={t} t0={28.4} tipo="sudor" {...L(960, 960, 470)} />
          <Chip t={t} t0={27.76} text="YOUR OWN FRIENDS" color={C.rojo} x={960} y={150} centro size={76} />
          {t > 29.18 && <AbsoluteFill style={{ background: "#fff", opacity: Math.max(0, 0.7 - (t - 29.18) * 3) }} />}
        </Escena>

        {/* 008 · y el retiro, de verdad */}
        <Escena t={t} t0={29.84} t1={32.18} entra="iris" banda={C.teal} ix={800} iy={600}>
          <Cielo tipo="dia" />
          <Rayos t={t} x={300} y={220} op={0.2} />
          <Astro x={300} y={220} r={80} />
          <Colinas capas={["#8fd16a", "#5fae4a", "#3f8a3a"]} base={620} seed={30} alto={80} dx={(t - 29.8) * 15} />
          <Casa x={1450} y={760} s={1.5} tono="#fff0d0" techo="#d0613f" luz />
          <Persona x={800} y={960} h={620} t={t} seed={1} expr="feliz" viejo bD={110} cD={60} manoD={<Moneda x={-35} y={-35} r={35} gira={1} t={t} />} salta={30.5} />
          <Emote t={t} t0={30.6} tipo="brillos" {...L(800, 960, 620)} s={1.4} />
          <Frente t={t} color="#2f6a2a" vel={30} seed={8} />
          <Chip t={t} t0={30.0} text="RETIREMENT" color={C.teal} tinta={C.noche} x={960} y={150} centro size={84} />
          <Chip t={t} t0={30.42} text="+ LAND + CASH" color={C.violeta} x={1150} y={300} size={52} />
          <Chip t={t} t0={31.28} text="REAL" color={C.oro} tinta={C.noche} x={1150} y={410} size={60} />
        </Escena>

        {/* 009a · generoso, incluso */}
        <Escena t={t} t0={32.18} t1={33.26} entra="zoom" golpes={[32.2]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, #ffcf5a, #c9771f 80%)` }} />
          <Rayos t={t} x={960} y={420} op={0.22} />
          {Array.from({ length: 26 }, (_, i) => {
            const r = rnd(i + 200);
            const x = 200 + r() * 1520, d = r() * 0.5, yf = 760 + r() * 220, rot = r() * 360, gi = 2 + r() * 2, ph = r();
            const y = interpolate(t, [32.18 + d, 32.18 + d + 0.6], [-120, yf], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <Moneda key={i} x={x} y={y} r={60} rot={rot} gira={gi} t={t + ph} />;
          })}
          <Particulas t={t} tipo="lluviaoro" n={50} seed={12} />
          <Grande t={t} t0={32.2} text="GENEROUS" y={420} size={190} color="#fff" />
        </Escena>

        {/* 009b · pero la mitad nunca vivió para cobrarlo */}
        <Escena t={t} t0={33.26} t1={39.22} zoom={0.05} entra="corte" golpes={[34.84, 37.22]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.noche2}, ${C.noche} 80%)` }} />
          <Grilla t={t} t0={33.3} de={0} a={50} tA={[34.84, 38.3]} y={530} s={2.25} />
          <Chip t={t} t0={33.78} text="BY SOME ESTIMATES" color={C.violeta} x={960} y={110} centro size={50} t1={34.7} />
          <Chip t={t} t0={34.84} text="ROUGHLY HALF" color={C.rojo} x={960} y={110} centro size={70} />
          <Chip t={t} t0={37.22} text="NEVER COLLECTED" color="#5d5a7a" x={960} y={960} centro size={64} />
        </Escena>

        {/* 010 · así que hoy, VOS te alistás */}
        <Escena t={t} t0={39.22} t1={41.74} entra="barrido" golpes={[40.08]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #ff9a4d, #c2386a 55%, #2d1b69 100%)` }} />
          <Rayos t={t} x={960} y={420} op={0.12} />
          <Persona x={960} y={primerPlano(1300, 560)} h={1300} t={t} seed={1} expr={t < 40.6 ? "sorpresa" : "feliz"} bD={interpolate(ent(t, 40.08), [0, 1], [8, 70])} cD={95} mira={t < 40.08 ? -0.5 : 0} ladea={t > 40.6 ? 5 : 0} />
          <Emote t={t} t0={39.4} t1={40.5} tipo="preg" {...L(960, primerPlano(1300, 560), 1300)} s={1.6} />
          <Grande t={t} t0={40.08} text="YOU" x={1560} y={300} size={220} color={C.oro} />
          <Chip t={t} t0={40.9} text="JOIN THE LEGION" color={C.violeta} x={160} y={160} size={60} />
        </Escena>

        {/* 011 · tu carrera entera, paso a paso */}
        <Escena t={t} t0={41.74} t1={45.0} zoom={0.04} entra="diag">
          <Cielo tipo="atardecer" />
          <Rayos t={t} x={1400} y={380} op={0.12} />
          <Astro x={1400} y={380} r={110} />
          {(() => {
            const dx = (t - 41.74) * 420;
            return (
              <>
                <Colinas capas={["#8a3a7a", "#6a2a6a", "#4a1d5a"]} base={560} seed={40} alto={110} dx={dx * 0.5} />
                <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "#c9773a" }} />
                {["I", "V", "X", "XV", "XX", "XXV"].map((n, i) => {
                  const x = 700 + i * 520 - dx;
                  return <div key={n} style={{ position: "absolute", left: x, top: 720, width: 120, height: 170, background: "#e8d8b8", borderRadius: "60px 60px 8px 8px", boxShadow: "inset -18px 0 0 #c9b48a", fontFamily, fontWeight: 700, fontSize: 52, color: "#7a3d14", textAlign: "center", paddingTop: 30 }}>{n}</div>;
                })}
                <Frente t={t} color="#2a1030" vel={520} seed={13} />
              </>
            );
          })()}
          <Persona x={760} y={940} h={480} t={t} seed={1} expr="orgullo" casco="legion" camina={1.6} />
          <Chip t={t} t0={42.92} text="YOUR WHOLE CAREER" color={C.violeta} x={960} y={150} centro size={72} />
          <Chip t={t} t0={44.24} text="STEP BY STEP" color={C.teal} tinta={C.noche} x={960} y={270} centro size={54} />
        </Escena>

        {/* 012 · y contamos cada forma en que la Legión intenta matarte */}
        <Escena t={t} t0={45.0} t1={48.36} entra="sube" golpes={[47.76]}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, #1b1240, #4a1d5a)` }} />
          <Estrellas t={t} n={40} seed={14} alto={500} />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d="M -40 820 C 300 640 520 900 820 720 S 1360 560 1960 640" stroke="#c9773a" strokeWidth={70} fill="none" strokeLinecap="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - prog(t, 45.0, 45.8))} />
          </svg>
          {[[180, 740], [420, 760], [660, 800], [900, 700], [1160, 640], [1420, 610], [1700, 630]].map(([x, y], i) => {
            const t0 = 45.32 + i * 0.36;
            if (t < t0) return null;
            return <div key={i} style={{ position: "absolute", left: x - 55, top: y - 170, width: 110, height: 110, borderRadius: 55, background: C.rojo, border: "8px solid #fff", transform: `scale(${ent(t, t0)}) rotate(${(1 - ent(t, t0)) * 90}deg)`, fontFamily, fontWeight: 700, fontSize: 64, color: "#fff", textAlign: "center", lineHeight: "94px", boxShadow: "0 8px 0 rgba(10,5,30,.4)" }}>{i + 1}</div>;
          })}
          <Persona x={interpolate(t, [45, 48.36], [120, 420], { extrapolateRight: "clamp" })} y={860} h={300} t={t} seed={1} expr="miedo" casco="legion" camina={1.6} />
          <Emote t={t} t0={47.76} tipo="excl" {...L(interpolate(t, [45, 48.36], [120, 420], { extrapolateRight: "clamp" }), 860, 300)} s={0.8} />
          <Chip t={t} t0={45.32} text="EVERY SINGLE WAY" color={C.violeta} x={960} y={150} centro size={60} t1={47.2} />
          <Chip t={t} t0={47.24} text="TO KILL YOU" color={C.rojo} x={960} y={150} centro size={76} />
        </Escena>

        {/* 013a · son siete */}
        <Escena t={t} t0={48.36} t1={49.84} entra="corte" golpes={[48.84]}>
          <AbsoluteFill style={{ background: C.rojo }} />
          <Rayos t={t} x={960} y={470} color="#fff" op={0.1} />
          <Grande t={t} t0={48.84} text="7" y={470} size={560} color="#fff" />
          <Grande t={t} t0={49.14} text="TRAPS" y={860} size={130} color={C.oro} />
        </Escena>

        {/* 013b · vamos a anotarte */}
        <Escena t={t} t0={49.84} t1={51.14} entra="barrido">
          <Cielo tipo="atardecer" />
          <Rayos t={t} x={1150} y={420} op={0.1} />
          <SueloCalle y={820} />
          <Mesa x={1150} y={690} w={480} />
          <Pergamino x={1150} y={620} w={300} abre={0.25} lineas={0} />
          <Persona x={1440} y={900} h={430} t={t} seed={41} ropa={CIVIL(2)} expr="feliz" bD={100} cD={60} flip habla />
          <Persona x={interpolate(t, [49.84, 50.8], [300, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={940} h={470} t={t} seed={1} expr="feliz" camina={t < 50.8 ? 1.6 : 0} />
          <Frente t={t} color="#2a1020" vel={40} seed={15} />
          <Chip t={t} t0={50.08} text="SIGN HERE" color={C.teal} tinta={C.noche} x={1150} y={430} centro size={60} />
        </Escena>

        {/* 014 · trampa número uno: el contrato */}
        <Escena t={t} t0={51.14} t1={53.56} zoom={0.05} entra="zoom" golpes={[51.68, 52.56]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${C.violeta}, ${C.noche} 80%)` }} />
          <Rayos t={t} x={960} y={560} color="#c9a8ff" op={0.1} />
          <div style={{ opacity: 0.35 }}><Pergamino x={960} y={560} w={700} abre={1} lineas={10} /></div>
          <Chip t={t} t0={51.14} text="TRAP 1 OF 7" color={C.rojo} x={960} y={330} centro size={64} />
          <Grande t={t} t0={52.5} text="THE CONTRACT" y={560} size={170} />
          {/* las 7 trampas: la primera se enciende */}
          {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 960 - 3 * 70 + i * 70 - 22, top: 780, width: 44, height: 44, borderRadius: 22, background: i === 0 ? C.rojo : "rgba(255,255,255,.18)", border: "5px solid #fff", transform: `scale(${ent(t, 51.3, i * 0.05) * (i === 0 ? 1 + 0.15 * Math.sin(t * 8) : 1)})` }} />)}
        </Escena>

        {/* 015 · es el año 110 */}
        <Escena t={t} t0={53.56} t1={55.7} entra="iris" banda={C.violeta}>
          <Cielo tipo="noche" />
          <Estrellas t={t} n={110} seed={8} alto={1080} />
          <Rayos t={t} x={960} y={520} color="#ffd77a" op={0.06} />
          <Grande t={t} t0={53.98} text={`AD ${Math.round(interpolate(t, [53.98, 54.7], [1, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}`} y={520} size={260} color={C.oro} />
          <Chip t={t} t0={54.5} text="TRAJAN RULES ROME" color={C.violeta} x={960} y={780} centro size={52} />
        </Escena>

        {/* 016a · tenés 18 años */}
        <Escena t={t} t0={55.7} t1={57.26} entra="barrido" golpes={[55.94]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 40% 40%, #ffb36b, #e2557a 70%)` }} />
          <Rayos t={t} x={760} y={400} op={0.12} />
          <Persona x={760} y={primerPlano(1200, 540)} h={1200} t={t} seed={1} expr="feliz" mira={0.5} aparece={55.72} />
          <Grande t={t} t0={55.94} text="18" x={1480} y={420} size={300} color="#fff" />
          <Chip t={t} t0={56.36} text="YEARS OLD" color={C.violeta} x={1480} y={640} centro size={64} />
        </Escena>

        {/* 016b · en un pueblo polvoriento */}
        <Escena t={t} t0={57.26} t1={58.46} entra="sube">
          <Cielo tipo="polvo" />
          <Rayos t={t} x={1650} y={260} op={0.12} />
          <Astro x={1650} y={260} r={70} />
          <Casa x={240} y={800} s={1.6} tono="#f0c08a" techo="#b5552c" />
          <Casa x={780} y={760} s={1.2} tono="#e8b07a" />
          <Casa x={1620} y={790} s={1.5} tono="#f2c89a" techo="#a8452c" />
          <SueloCalle y={780} color="#c98a4a" />
          <Particulas t={t} tipo="polvo" n={60} seed={16} />
          <Persona x={interpolate(t, [57.26, 58.46], [900, 1120], { extrapolateRight: "clamp" })} y={960} h={470} t={t} seed={1} expr="neutro" camina={1.3} />
          <Frente t={t} color="#6a3a1a" vel={70} seed={17} />
          <Chip t={t} t0={57.78} text="DUSTY TOWN" color={C.tierra} x={960} y={140} centro size={66} />
        </Escena>

        {/* 016c · en algún lugar de Galia o Hispania: la cámara vuela al oeste */}
        <Escena t={t} t0={58.46} t1={60.34} zoom={0.02} entra="iris" banda={C.rojo}>
          <MapaPuntos t={t} pulsa={["GAUL", "SPAIN"]} t0Pulsa={59.0} vuela={{ n: "GAUL", z: 1.7, t: [58.46, 59.6] }} />
          <Chip t={t} t0={59.02} text="GAUL" color={C.rojo} x={1000} y={470} size={64} />
          <Chip t={t} t0={59.56} text="OR SPAIN" color={C.rojo} x={420} y={900} size={64} />
        </Escena>

        {/* 016d · el campo de la familia no alcanza para dos hermanos */}
        <Escena t={t} t0={60.34} t1={63.6} entra="diag" golpes={[62.38]}>
          <Cielo tipo="polvo" />
          <Colinas capas={["#b9844a", "#9a6a34"]} base={600} seed={55} alto={60} />
          <svg style={{ position: "absolute", left: 0, top: 700 }} width={1920} height={380}>
            <rect x={0} y={0} width={1920} height={380} fill="#8a5a2a" />
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-200 + i * 300} y1={380} x2={700 + i * 80} y2={0} stroke="#6a421c" strokeWidth={14} />)}
          </svg>
          <Casa x={1600} y={720} s={0.9} tono="#e8c08a" />
          <Persona x={620} y={980} h={560} t={t} seed={1} expr="triste" mira={0.8} aparece={60.4} />
          <Persona x={1180} y={990} h={520} t={t} seed={77} ropa={CIVIL(4)} expr="triste" mira={-0.8} flip aparece={62.38} />
          {/* un solo pan para dos */}
          <div style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, 61.6)})`, transformOrigin: "900px 860px" }}><Pan x={900} y={860} s={0.8} /></div>
          <Emote t={t} t0={62.6} tipo="sudor" {...L(620, 980, 560)} />
          <Particulas t={t} tipo="polvo" n={30} seed={18} />
          <Chip t={t} t0={60.88} text="FAMILY FARM" color={C.tierra} x={960} y={130} centro size={64} />
          <Chip t={t} t0={62.38} text="TOO SMALL FOR TWO" color={C.rojo} x={960} y={250} centro size={64} />
        </Escena>
      </CamaraMano>
    </AbsoluteFill>
  );
};
