import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { rnd } from "../soot/lib";
import { Persona, CENTURION, CIVIL } from "./persona";
import { Papiro, Denario } from "./kit2";
import {
  C, FPS, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, lugar,
  Pan, Bota, Tienda, Pergamino, Aguila, Casa, Mesa, Garrote, Zzz,
  Particulas, Rayos, Emote, cabeza,
} from "./kit";
import { CapaMiniatura } from "./Miniatura";
import { Cuenta, Banco, LupaMano, Vara, PanMano, Cartel, Flecha } from "./P1";
import { FilaLejana, Campamento, Pueblo, Interior, Campo, Tablero, pose, CarpaInterior, PlazaArmas, PuertaPretoria, Multitud, EnMano } from "./kit3";

// Soot and Sandals v3 — piloto del gancho (0-63,5 s) 100 % motion graphics en código, cero imágenes.
// Pasada 2 (inmersiva): transición propia en cada corte, golpes de zoom en las palabras fuertes, partículas,
// luz, primer plano con paralaje, emociones y algo nuevo cada 1-1,5 s.
export const PILOTO_DUR = Math.ceil(63.6 * FPS);

const primerPlano = (h: number, cy: number) => cy + 450 * (h / 560);
const TableroC: React.FC<React.ComponentProps<typeof Tablero>> = (p) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #f6e3b4, #d9b878 70%, #b88a4a)" }}>
    <AbsoluteFill style={{ transform: "scale(0.85)", transformOrigin: "50% 52%" }}><Tablero {...p} /></AbsoluteFill>
  </AbsoluteFill>
);
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
        {/* 000 · cuadro 0 = la miniatura viva (firma, fuego, cepo); a los 1,9 s se encoge a postal y cae sobre Roma en el mapa */}
        <Escena t={t} t0={0} t1={4.06} zoom={0.06} entra="corte" golpes={[2.76]}>
          <MapaPuntos t={t} enciende={[2.2, 3.4]} pulsa={["ROME"]} t0Pulsa={2.4}
            rutas={[{ a: "BRITAIN", t0: 2.6 }, { a: "SPAIN", t0: 2.75 }, { a: "EGYPT", t0: 2.9 }, { a: "SYRIA", t0: 3.05 }, { a: "DANUBE", t0: 3.2 }]} />
          <Chip t={t} t0={2.5} text="ROME" color={C.rojo} x={lugar("ROME").x + 34} y={lugar("ROME").y - 50} size={52} />
          <FilaLejana y={1050} x0={-400} n={30} paso={70} s={1.5} t={t} marcha={1.2} />
          <Chip t={t} t0={2.76} text="100% VOLUNTEERS" color={C.teal} tinta={C.noche} x={960} y={150} centro size={76} />
        </Escena>
        <CapaMiniatura t={t} rx={lugar("ROME").x} ry={lugar("ROME").y} />

        {/* 001 · nadie los arrastró encadenados: la fila llega sola, contenta, a la mesa del reclutador en la plaza del pueblo */}
        <Escena t={t} t0={4.06} t1={7.2} entra="barrido" golpes={[5.36]}>
          <Pueblo t={t} hora="tarde" dx={(t - 4) * 25} />
          <Cartel t={t} x={1660} y={600} text="RECRUITING" size={42} poste={440} />
          <Persona x={1440} y={1050} h={500} t={t} seed={41} ropa={CENTURION} casco="centurion" postura="sentado" giro="34" flip expr="feliz" habla bD={interpolate(Math.sin(t * 5), [-1, 1], [60, 100])} cD={40} />
          <Mesa x={1360} y={850} w={460} />
          <Pergamino x={1300} y={835} w={170} abre={0.06} lineas={0} />
          {[0, 1, 2, 3].map((i) => (
            <Persona key={i} x={interpolate(t, [4.06, 7.2], [-160 + i * 230, 300 + i * 230])} y={1030 + (i % 2) * 18} h={440 + (i % 3) * 34} t={t} seed={50 + i} ropa={CIVIL(i)} giro="perfil" expr={i % 2 ? "feliz" : "orgullo"} camina={1.3 + i * 0.1}
              agarraI={i === 1 ? <EnMano.bolsa /> : undefined} agarraAngI={80} />
          ))}
          <Particulas t={t} tipo="polvo" n={24} seed={2} />
          {/* cadena que cae rota */}
          {t > 5.36 && (
            <svg style={{ position: "absolute", left: 860, top: 300, transform: `translateY(${Math.min(1, (t - 5.36) * 2.2) ** 2 * 560}px) rotate(${(t - 5.36) * 90}deg)`, opacity: Math.max(0, 1 - Math.max(0, t - 6.4)) }} width={200} height={120}>
              {[0, 1, 2].map((k) => <ellipse key={k} cx={40 + k * 55} cy={60} rx={34} ry={20} fill="none" stroke="#c8ccd4" strokeWidth={12} transform={k === 1 ? "rotate(90 95 60)" : undefined} />)}
            </svg>
          )}
          <Chip t={t} t0={5.36} text="NO CHAINS" color={C.rojo} x={760} y={220} centro size={84} />
        </Escena>

        {/* 002a · se acercaron y firmaron: el recluta se inclina sobre la mesa, pluma EN la mano, y firma */}
        <Escena t={t} t0={7.2} t1={9.02} zoom={0.08} entra="corte">
          <Interior tono="#dcc29a" />
          <Persona x={1250} y={1060} h={720} t={t} seed={1} casco="legion" giro="34" flip expr={t < 8.2 ? "orgullo" : "feliz"} mira={0.3} miraY={0.5} inclina={-10}
            bD={interpolate(prog(t, 7.2, 7.7), [0, 1], [20, 62])} cD={30 + Math.sin(t * 22) * (t > 8.2 && t < 8.95 ? 10 : 0)} agarra={<EnMano.pluma />} agarraAng={130} />
          <Persona x={420} y={1060} h={640} t={t} seed={7} ropa={CENTURION} casco="centurion" giro="34" expr="feliz" habla bD={70} cD={10} />
          <Mesa x={880} y={820} w={900} />
          {/* hoja sobre la mesa con renglón de firma */}
          <div style={{ position: "absolute", left: 620, top: 772, width: 420, height: 56, background: "#fbeec8", border: "5px solid #b98a4a", borderRadius: 6, transform: "skewX(-18deg)" }}>
            <div style={{ position: "absolute", left: 40, right: 40, bottom: 12, height: 5, background: "#8a5a2a" }} />
            <div style={{ position: "absolute", left: 50, bottom: 12, height: 9, width: `${prog(t, 8.2, 8.95) * 68}%`, borderRadius: 4, background: "#2b3a8f" }} />
          </div>
          <Emote t={t} t0={8.95} tipo="brillos" {...L(1250, 1060, 720)} />
          <Chip t={t} t0={7.0} text="WALKED UP" color={C.violeta} x={420} y={210} centro size={60} />
          <Chip t={t} t0={8.3} text="SIGNED" color={C.teal} tinta={C.noche} x={860} y={380} centro size={72} />
        </Escena>

        {/* 002b · y juraron lealtad a Roma: en la plaza de armas, la tropa variada saluda al águila; el centurión lee el juramento del pergamino */}
        <Escena t={t} t0={9.02} t1={10.9} entra="corte" golpes={[9.74]}>
          <PlazaArmas t={t} dx={(t - 9) * 40} />
          <Multitud t={t} n={11} filas={2} x0={120} x1={1000} y={980} h={340} seed={14} accion="saludar" vel={0.35} rompe={2} expr="orgullo" mira={0.5} />
          <div style={{ position: "absolute", left: 1214, top: 330, width: 14, height: 700, background: "#6b3a1f" }} />
          <Aguila x={1220} y={290} s={1.1} />
          <Particulas t={t} tipo="destellos" n={12} seed={6} />
          <Persona x={640} y={1070} h={600} t={t} seed={1} casco="legion" giro="34" expr="orgullo" bD={interpolate(ent(t, 9.05), [0, 1], [8, 150])} cD={14} bI={8} mira={0.6} miraY={-0.4} />
          <Persona x={1580} y={1050} h={620} t={t} seed={7} ropa={CENTURION} casco="centurion" giro="34" flip expr="orgullo" habla bD={70} cD={75} agarra={<EnMano.pergamino />} agarraAng={-10} />
          <Emote t={t} t0={9.8} tipo="brillos" {...L(640, 1070, 600)} s={1.2} />
          <Chip t={t} t0={9.74} text="THE OATH" color={C.rojo} x={560} y={200} centro size={72} />
          <Chip t={t} t0={10.12} text="TO ROME" color={C.oro} tinta={C.noche} x={560} y={320} centro size={56} />
        </Escena>

        {/* 003 · suena noble... hasta que leés el contrato: el pergamino ya está abierto y su cola rueda hasta el piso; el recluta lo lee con la lupa en la mano */}
        <Escena t={t} t0={10.9} t1={13.94} entra="corte" golpes={[12.86]}>
          <Interior tono="#dcc29a" />
          <Mesa x={700} y={700} w={700} />
          <Pergamino x={700} y={420} w={640} abre={interpolate(t, [10.9, 11.5], [0.62, 1], { extrapolateRight: "clamp" })} lineas={10} titulo="THE CONTRACT" />
          {/* la cola del pergamino cae de la mesa y rueda por el piso */}
          <div style={{ position: "absolute", left: 420, top: 735, width: 560, height: 60 + prog(t, 10.9, 13.9) * 220, background: "#f2dcaa", borderLeft: "6px solid #c9a66a", borderRight: "6px solid #c9a66a", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 22px, rgba(58,42,26,.5) 22px 28px)" }} />
          <div style={{ position: "absolute", left: 404, top: 780 + prog(t, 10.9, 13.9) * 220, width: 592, height: 44, borderRadius: 22, background: "#c98f4a" }} />
          <Persona x={1360} y={1050} h={700} t={t} seed={1} casco="legion" giro="34" flip expr={t < 11.8 ? "orgullo" : t < 12.5 ? "sorpresa" : "miedo"} mira={0.4} miraY={0.3} inclina={-6}
            bD={78} cD={16} agarra={<LupaMano />} agarraAng={8} reaccion="ojos" reaccionT0={12.86} />
          <Emote t={t} t0={13.0} tipo="sudor" {...L(1360, 1050, 700)} s={1.4} />
          <Chip t={t} t0={10.95} t1={12.4} text="SOUNDS NOBLE" color={C.oro} tinta={C.noche} x={1360} y={210} centro size={64} />
          <Chip t={t} t0={12.54} text="THE FINE PRINT" color={C.rojo} x={1360} y={210} centro size={64} />
        </Escena>

        {/* 004 · 25 años de servicio, sin esposa: sentado en su litera, las hojas del calendario vuelan; corazón tachado */}
        <Escena t={t} t0={13.94} t1={16.78} entra="corte" golpes={[14.6, 15.78]}>
          <CarpaInterior t={t} />
          <Cuenta t={t} t0={13.6} t1={14.6} de={1} a={25} x={520} y={420} size={380} color="#fff" />
          <Grande t={t} t0={13.7} text="YEARS" x={500} y={690} size={120} color={C.oro} />
          {Array.from({ length: 8 }, (_, i) => {
            const t0 = 14.0 + i * 0.09, u = Math.max(0, t - t0);
            if (t < t0) return null;
            const r = rnd(i + 40);
            const dir = r() < 0.5 ? -1 : 1, vx = 300 + r() * 500, rr = r() - 0.5;
            return <div key={i} style={{ position: "absolute", left: 520 + u * vx * dir, top: 380 - u * 400 + u * u * 520, width: 90, height: 100, background: "#fff", borderTop: `22px solid ${C.rojo}`, borderRadius: 8, transform: `rotate(${u * 400 * rr}deg)`, opacity: Math.max(0, 1 - u * 0.8) }} />;
          })}
          <Persona x={1360} y={1040} h={560} t={t} seed={1} casco="legion" postura="sentado" giro="34" flip expr={t < 15.64 ? "sorpresa" : "triste"} mira={0.5} bD={t < 15.64 ? 40 : 10} cD={t < 15.64 ? 120 : 10}
            reaccion="mandibula" reaccionT0={15.7} />
          {t >= 15.64 && (
            <svg style={{ position: "absolute", left: 1210, top: 120, transform: `scale(${ent(t, 15.64)})`, transformOrigin: "160px 120px" }} width={320} height={260}>
              <path d="M 160 230 C 40 150 20 60 90 40 C 130 30 155 60 160 80 C 165 60 190 30 230 40 C 300 60 280 150 160 230 Z" fill={C.rosa} stroke="#fff" strokeWidth={10} />
              <line x1={60} y1={30} x2={60 + 210 * prog(t, 15.8, 16.05)} y2={30 + 200 * prog(t, 15.8, 16.05)} stroke={C.rojo} strokeWidth={26} strokeLinecap="round" />
            </svg>
          )}
          <Chip t={t} t0={15.7} text="NO WIFE" color={C.rojo} x={1080} y={250} centro size={66} />
        </Escena>

        {/* 005 · la paga viene con descuentos: el intendente, sentado del otro lado de la mesa, se cobra la comida, las botas y la carpa de la pila del soldado */}
        <Escena t={t} t0={16.78} t1={21.54} zoom={0.04} entra="corte" golpes={[18.72, 19.76, 20.72]}>
          <PuertaPretoria t={t} hora="tarde" guardia={false} />
          {(() => {
            const sale = [18.72, 19.76, 20.72];
            const quedan = 12 - sale.filter((s) => t > s + 0.3).length * 3;
            const triste = quedan <= 6;
            return (
              <>
                <div style={{ position: "absolute", left: 1150, top: 120, width: 560, height: 360, background: "linear-gradient(180deg,#f2dfae,#e2c588)", borderRadius: 16, border: "6px solid #b98a4a", boxShadow: "14px 16px 0 rgba(20,8,40,.35)", fontFamily, fontWeight: 700, transform: "rotate(1.5deg)" }}>
                  <div style={{ textAlign: "center", fontSize: 48, color: "#7a3d14", marginTop: 16, letterSpacing: 3 }}>DEDUCTIONS</div>
                  {([["YOUR FOOD", 18.72], ["YOUR BOOTS", 19.76], ["YOUR TENT", 20.72]] as const).map(([txt, t0], i) => {
                    const on = t >= t0;
                    return <div key={txt} style={{ position: "absolute", left: 36, right: 36, top: 96 + i * 84, height: 70, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 44, borderBottom: "4px dashed rgba(122,61,20,.3)", color: on ? "#4a2a10" : "rgba(122,61,20,.3)", background: on && t < t0 + 0.8 ? "rgba(232,52,74,.2)" : "transparent", borderRadius: 10, padding: "0 10px" }}>
                      <span>{txt}</span>{on && <span style={{ color: C.rojo, display: "inline-block", transform: `scale(${ent(t, t0)})` }}>-3</span>}
                    </div>;
                  })}
                </div>
                <Persona x={1260} y={1050} h={540} t={t} seed={44} ropa={CIVIL(1)} postura="sentado" giro="34" flip expr="feliz" habla mira={0.2} {...pose("contar", t, 1.3)} />
                <Mesa x={1000} y={830} w={760} />
                {/* cofre del intendente */}
                <div style={{ position: "absolute", left: 1100, top: 742, width: 140, height: 92, background: "#7a4520", border: "7px solid #4a2810", borderRadius: 12 }}>
                  <div style={{ position: "absolute", left: -10, right: -10, top: -26, height: 30, background: "#9a5a2a", border: "7px solid #4a2810", borderRadius: "14px 14px 4px 4px" }} />
                </div>
                {t > 18.72 && <div style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, 18.72)})`, transformOrigin: "960px 800px" }}><Pan x={960} y={796} s={0.55} /></div>}
                {t > 19.76 && <div style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, 19.76)})`, transformOrigin: "1020px 790px" }}><Bota x={1040} y={762} s={0.48} /></div>}
                {t > 20.72 && <div style={{ position: "absolute", inset: 0, transform: `scale(${ent(t, 20.72)})`, transformOrigin: "900px 800px" }}><Tienda x={890} y={808} s={0.36} /></div>}
                {Array.from({ length: 12 }, (_, i) => {
                  const g = Math.floor((11 - i) / 3);
                  const ts = g < 3 ? sale[g] + ((11 - i) % 3) * 0.08 : 1e9;
                  const u = prog(t, ts, ts + 0.5);
                  if (u >= 1) return null;
                  const x0 = 740, y0 = 800 - i * 22, x1 = 1170, y1 = 740;
                  return <Denario key={i} r={40} x={x0 + (x1 - x0) * u} y={y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 240} t={t} gira={u > 0 ? 3 : 0} />;
                })}
                <Persona x={420} y={1060} h={640} t={t} seed={1} casco="legion" giro="34" mira={0.6} expr={quedan === 12 ? "feliz" : triste ? "triste" : "sorpresa"}
                  bD={triste ? 120 : 75} cD={triste ? 110 : 20} bI={triste ? 120 : 20} cI={triste ? 110 : 20} reaccion={triste ? "derrite" : undefined} reaccionT0={20.9} />
                <Chip t={t} t0={16.5} text={`PAY  ${quedan}/12`} color={quedan > 6 ? C.oro : C.rojo} tinta={quedan > 6 ? C.noche : "#fff"} x={420} y={220} centro size={62} />
              </>
            );
          })()}
        </Escena>
        {/* 006 · el centurión puede pegarte con un palo, todos los días: contrapicado en la plaza de armas */}
        <Escena t={t} t0={21.54} t1={25.44} entra="corte" golpes={[23.34, 24.66]}>
          <PlazaArmas t={t} hora="tarde" angulo="bajo" dx={(t - 21.5) * 25} />
          <Particulas t={t} tipo="brasas" n={24} seed={8} />
          <Persona x={1180} y={1080} h={800} t={t} seed={7} ropa={CENTURION} casco="centurion" giro="34" flip expr="enojado"
            bD={t < 23.2 ? interpolate(Math.sin(t * 6), [-1, 1], [80, 120]) : interpolate(((t - 23.2) * 2.6) % 1, [0, 0.55, 1], [165, 50, 165])} cD={30} agarra={<Vara largo={300} />} agarraAng={t < 23.2 ? -40 : -60} bI={20} cI={40} />
          <Emote t={t} t0={22.86} tipo="enojo" {...L(1180, 1080, 800)} s={1.4} />
          <Persona x={520} y={1060} h={540} t={t} seed={1} casco="legion" postura="agachado" giro="34" expr="miedo" mira={0.6} miraY={-0.5} bI={130} bD={130} cI={110} cD={110} reaccion="susto" reaccionT0={23.34} />
          <Chip t={t} t0={23.88} text="VINE STICK" color={C.ambar} tinta={C.noche} x={1500} y={220} centro size={58} />
          <Chip t={t} t0={24.66} text="EVERY DAY" color={C.rojo} x={140} y={210} size={80} />
          {Array.from({ length: 7 }, (_, i) => t > 24.7 + i * 0.09 && <div key={i} style={{ position: "absolute", left: 160 + i * 46, top: 300, width: 14, height: 70, borderRadius: 7, background: "#fff", transform: `rotate(${i === 4 ? 0 : 12}deg) scaleY(${ent(t, 24.7 + i * 0.09)})` }} />)}
        </Escena>

        {/* 007a · si te dormís en la guardia: sentado junto a la puerta pretoria, lanza en la mano, roncando */}
        <Escena t={t} t0={25.44} t1={27.48} entra="corte">
          <PuertaPretoria t={t} hora="noche" guardia={false} />
          <Astro x={1640} y={170} r={70} luna />
          <Particulas t={t} tipo="luciernagas" n={20} seed={9} />
          <svg style={{ position: "absolute", left: 1380, top: 880 }} width={200} height={160}>
            {[0, 1, 2].map((k) => <path key={k} d={`M ${60 + k * 30} 140 Q ${40 + k * 30 + Math.sin(t * 9 + k) * 10} ${80 - k * 10} ${70 + k * 30} ${40 + Math.sin(t * 7 + k) * 12} Q ${100 + k * 30} 90 ${80 + k * 30} 140 Z`} fill={k === 1 ? "#ffd27a" : "#ff7a3d"} opacity={interpolate(t, [25.44, 27.4], [1, 0.25], { extrapolateRight: "clamp" })} />)}
            <rect x={30} y={136} width={140} height={16} rx={8} fill="#5a3418" />
          </svg>
          <Banco x={700} y={1040} w={280} />
          <Persona x={700} y={1040} h={600} t={t} seed={1} expr="dormido" casco="legion" postura="sentado" giro="34" ladea={interpolate(t, [25.44, 27.4], [4, 16], { extrapolateRight: "clamp" })}
            bD={60} cD={60} agarra={<EnMano.lanza />} agarraAng={-75} bI={20} cI={60} />
          <Zzz x={820} y={330} t={t} />
          <Chip t={t} t0={25.2} text="ASLEEP ON WATCH" color={C.violeta} x={1380} y={250} centro size={60} />
          <Chip t={t} t0={26.6} text="WRONG MOMENT" color={C.rojo} x={1380} y={370} centro size={50} />
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
              <Persona key={i} x={interpolate(t, [27.48, 29.4], [x0, xf], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={980 + k * 12} h={540 + k * 50 + (i % 2) * 20} t={t} seed={60 + i} sombra="#12061a" camina={t < 29.4 ? 1.1 + i * 0.07 : 0} giro={k === 1 ? "34" : "frente"} inclina={k === 2 ? 6 : 0}
                flip={lado > 0} bD={t > 29.18 ? 60 : 150 - k * 15} cD={30} manoD={<g style={{ color: "#12061a" }}><Garrote /></g>} />
            );
          })}
          <Persona x={960} y={960} h={470} t={t} seed={1} expr="miedo" casco="legion" bI={120} bD={120} cI={120} cD={120} reaccion="susto" reaccionT0={27.9} />
          <Emote t={t} t0={28.4} tipo="sudor" {...L(960, 960, 470)} />
          <Chip t={t} t0={27.6} text="YOUR OWN FRIENDS" color={C.rojo} x={960} y={200} centro size={76} />
        </Escena>

        {/* 008 · y el retiro, de verdad: plano cerrado del veterano sopesando su bolsa de 3.000 frente a su parcela */}
        <Escena t={t} t0={29.84} t1={32.18} entra="corte" golpes={[31.28]}>
          <Campo t={t} dx={(t - 29.8) * 15} />
          <Casa x={1500} y={850} s={1.0} tono="#fff0d0" techo="#d0613f" luz />
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            {Array.from({ length: 9 }, (_, i) => <rect key={i} x={1000 + i * 100} y={900} width={14} height={90} fill="#8a5a2a" />)}
            <rect x={990} y={920} width={900} height={12} fill="#a8723a" /><rect x={990} y={955} width={900} height={12} fill="#a8723a" />
          </svg>
          <Cartel t={t} x={1150} y={800} text="YOUR LAND" size={40} poste={200} />
          <Persona x={560} y={1090} h={880} t={t} seed={1} casco="legion" viejo giro="34" expr="feliz" mira={0.4} miraY={0.5} inclina={4 + 3 * Math.sin(t * 3)} salta={31.3}
            bD={interpolate(Math.sin(t * 4), [-1, 1], [36, 52])} cD={60} agarra={<EnMano.bolsa txt="3,000" />} agarraAng={90} bI={20} cI={10} />
          <Emote t={t} t0={31.3} tipo="brillos" {...L(560, 1090, 880)} s={1.3} />
          <Chip t={t} t0={29.5} text="RETIREMENT" color={C.teal} tinta={C.noche} x={1340} y={190} centro size={72} />
          <Cuenta t={t} t0={29.5} t1={29.95} de={2000} a={3000} x={1340} y={350} size={150} color={C.oro} />
          <Chip t={t} t0={29.5} text="DENARII + LAND" color={C.violeta} x={1340} y={500} centro size={52} />
          <Chip t={t} t0={31.28} text="REAL" color={C.oro} tinta={C.noche} x={1340} y={620} centro size={60} />
        </Escena>
        {/* 009a · generoso, incluso */}
        <Escena t={t} t0={32.18} t1={33.26} entra="zoom" golpes={[32.2]}>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, #ffcf5a, #c9771f 80%)` }} />
          <Rayos t={t} x={960} y={420} op={0.22} />
          {Array.from({ length: 22 }, (_, i) => {
            const r = rnd(i + 200);
            const x = 200 + r() * 1520, d = r() * 0.5, yf = 780 + r() * 200, gi = 2 + r() * 2, ph = r();
            const y = interpolate(t, [32.18 + d, 32.18 + d + 0.6], [-120, yf], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <Denario key={i} r={56} x={x} y={y} gira={gi} t={t + ph} />;
          })}
          <Particulas t={t} tipo="lluviaoro" n={40} seed={12} />
          <Persona x={960} y={1050} h={600} t={t} seed={1} casco="legion" viejo expr="feliz" {...pose("festejar", t, 1.4)} salta={32.3} reaccion="ojos" reaccionT0={32.25} />
          <Grande t={t} t0={32.2} text="GENEROUS" y={240} size={170} color="#fff" />
        </Escena>

        {/* 009b · pero la mitad nunca vivió para cobrarlo: 20 reclutas distintos; uno de cada dos se apaga a fantasma */}
        <Escena t={t} t0={33.26} t1={39.22} zoom={0.04} entra="corte" golpes={[34.84, 37.22]}>
          <Campamento t={t} hora="tarde" tropa={false} />
          <AbsoluteFill style={{ background: "rgba(27,18,64,.45)" }} />
          {Array.from({ length: 20 }, (_, i) => {
            const fila = Math.floor(i / 10), k = i % 10;
            const orden = [3, 11, 6, 17, 0, 14, 8, 19, 5, 12];
            const j = orden.indexOf(i);
            const tg = j < 0 ? 1e9 : 34.9 + j * 0.32;
            const gris = t > tg;
            const r = rnd(i * 7 + 3);
            const giro = (["frente", "34", "34", "frente"] as const)[Math.floor(r() * 4)];
            const pz = Math.floor(r() * 4);
            const brazos = pz === 0 ? { bI: 55, cI: 125, bD: 55, cD: 125 } : pz === 1 ? { bI: 35, cI: 120, bD: 35, cD: 120 } : pz === 2 ? { bI: 8, bD: 150, cD: 20 } : {};
            return <Persona key={i} x={170 + k * 176 + fila * 88 + (r() - 0.5) * 30} y={fila === 0 ? 760 : 1050} h={(fila === 0 ? 270 : 360) * (0.92 + r() * 0.16)} t={t} seed={i === 6 ? 1 : 90 + i}
              casco={i === 6 || r() < 0.7 ? "legion" : "no"} ropa={i === 6 ? undefined : CIVIL(i)} giro={i === 6 ? "frente" : giro} flip={r() < 0.5} bruma={fila === 0 ? 0.25 : 0}
              expr={gris ? "triste" : i === 6 ? "orgullo" : (["neutro", "feliz", "orgullo"] as const)[pz % 3]} sombra={gris ? "#4a4668" : undefined} opacity={gris ? 0.55 : 1} aparece={33.0 + k * 0.03} {...brazos} />;
          })}
          <Chip t={t} t0={33.5} text="BY SOME ESTIMATES" color={C.violeta} x={960} y={200} centro size={52} t1={34.7} />
          <Chip t={t} t0={34.84} text="ROUGHLY HALF" color={C.rojo} x={760} y={200} centro size={70} />
          <Grande t={t} t0={37.22} text="½" x={1640} y={250} size={230} color={C.oro} />
          <Chip t={t} t0={37.22} text="NEVER COLLECTED" color="#5d5a7a" x={760} y={330} centro size={56} />
        </Escena>

        {/* 010 · así que hoy, VOS te alistás: llega al portón, pluma en la mano, y la ficha se llena con «YOU» */}
        <Escena t={t} t0={39.22} t1={41.74} entra="corte" golpes={[40.08]}>
          <PuertaPretoria t={t} abre={1} guardia={false} dx={(t - 39.2) * 20} />
          {(() => {
            const x = interpolate(t, [39.22, 39.85], [300, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const llega = t > 39.85;
            return <>
              <Persona x={x} y={1060} h={720} t={t} seed={1} casco="legion" giro={llega ? "34" : "perfil"} camina={llega ? 0 : 1.6} expr={t < 40.08 ? "orgullo" : "feliz"}
                bD={llega ? interpolate(ent(t, 39.85), [0, 1], [30, 150]) : 30} cD={llega ? 20 : 30} agarra={<EnMano.pluma />} agarraAng={llega ? -100 : 40} mira={0.6} salta={40.7} />
              <Emote t={t} t0={40.7} tipo="brillos" {...L(x, 1060, 720)} s={1.3} />
            </>;
          })()}
          {/* ficha de alistamiento colgada en el portón */}
          <div style={{ position: "absolute", left: 1340, top: 600, width: 640, height: 520, transform: `translate(-50%,-50%) rotate(2deg) scale(${interpolate(t, [39.22, 39.5], [0.85, 1], { extrapolateRight: "clamp" })})`, background: "linear-gradient(180deg,#fbeec8,#f0d9a0)", border: "9px solid #8a5a2a", borderRadius: 22, boxShadow: "16px 18px 0 rgba(20,8,40,.35)", fontFamily, fontWeight: 700, color: "#4a2a10" }}>
            <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center", fontSize: 50, color: C.rojo, letterSpacing: 3 }}>LEGION ENLISTMENT</div>
            {([["NAME", "YOU", 39.6], ["AGE", "18", 40.5], ["TERM", "25 YEARS", 40.9]] as const).map(([k, v, tv], i) => (
              <div key={k} style={{ position: "absolute", left: 50, right: 50, top: 110 + i * 125, height: 104, borderBottom: "6px dashed #b98a4a", display: "flex", alignItems: "flex-end", gap: 24 }}>
                <span style={{ fontSize: 40, color: "#8a5a2a", paddingBottom: 10 }}>{k}:</span>
                {t >= tv && <span style={{ fontSize: i === 0 ? 96 : 64, color: i === 0 ? C.rojo : "#2b3a8f", transform: `scale(${ent(t, tv)})`, transformOrigin: "left bottom", lineHeight: 1 }}>{v}</span>}
              </div>
            ))}
          </div>
          <Chip t={t} t0={40.9} text="JOIN THE LEGION" color={C.violeta} x={1340} y={210} centro size={56} />
        </Escena>
        {/* 011 · tu carrera entera, paso a paso: de perfil por la ruta, los mojones son los años */}
        <Escena t={t} t0={41.74} t1={45.0} zoom={0.04} entra="corte">
          <Cielo tipo="atardecer" />
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
              </>
            );
          })()}
          <Persona x={760} y={950} h={500} t={t} seed={1} expr="orgullo" casco="legion" giro="perfil" camina={1.6} agarraI={<EnMano.escudo />} agarraAngI={0} bI={40} cI={60} />
          <Persona x={430} y={940} h={470} t={t} seed={57} expr="feliz" casco="legion" giro="perfil" camina={1.6} agarra={<EnMano.lanza />} agarraAng={-60} />
          <Chip t={t} t0={42.92} text="YOUR WHOLE CAREER" color={C.violeta} x={960} y={200} centro size={72} />
          <Chip t={t} t0={44.24} text="STEP BY STEP" color={C.teal} tinta={C.noche} x={960} y={320} centro size={54} />
        </Escena>

        {/* 012 · cada forma en que la Legión intenta matarte: el tablero del viaje de 25 años */}
        <Escena t={t} t0={45.0} t1={48.36} entra="corte" golpes={[47.76]}>
          <TableroC t={t} t0={45.2} en={0} de={0} />
          <Chip t={t} t0={45.1} text="EVERY SINGLE WAY" color={C.violeta} x={760} y={200} centro size={60} t1={47.2} />
          <Chip t={t} t0={47.24} text="TO KILL YOU" color={C.rojo} x={760} y={200} centro size={76} />
        </Escena>

        {/* 013a · son siete: las 7 casillas laten una por una */}
        <Escena t={t} t0={48.36} t1={49.84} entra="corte" golpes={[48.84]}>
          <TableroC t={t} t0={44.0} en={Math.max(0, Math.min(6, Math.floor((t - 48.4) / 0.18)))} de={Math.max(0, Math.min(6, Math.floor((t - 48.4) / 0.18)))} />
          <Grande t={t} t0={48.4} text="7 TRAPS" x={760} y={220} size={150} color={C.rojo} />
        </Escena>

        {/* 013b · vamos a anotarte: frente a la puerta, el reclutador sentado le acerca la hoja; él firma con la pluma en la mano */}
        <Escena t={t} t0={49.84} t1={51.14} entra="corte">
          <PuertaPretoria t={t} dx={(t - 49.8) * 20} />
          <Persona x={1330} y={1050} h={560} t={t} seed={7} ropa={CENTURION} casco="centurion" postura="sentado" giro="34" flip expr="feliz" habla bD={72} cD={8} />
          <Persona x={640} y={1060} h={660} t={t} seed={1} casco="legion" giro="34" expr="feliz" mira={0.5} miraY={0.5} inclina={8}
            bD={62 + (t > 50.4 ? Math.sin(t * 20) * 4 : 0)} cD={28} agarra={<EnMano.pluma />} agarraAng={120} />
          <Mesa x={1000} y={830} w={680} />
          <div style={{ position: "absolute", left: 840, top: 784, width: 320, height: 48, background: "#fbeec8", border: "5px solid #b98a4a", borderRadius: 6, transform: "skewX(-18deg)" }}>
            <div style={{ position: "absolute", left: 30, right: 30, bottom: 10, height: 5, background: "#8a5a2a" }} />
            <div style={{ position: "absolute", left: 40, bottom: 10, height: 8, width: `${prog(t, 50.4, 51.1) * 70}%`, borderRadius: 4, background: "#2b3a8f" }} />
          </div>
          <Chip t={t} t0={49.5} text="SIGN HERE" color={C.teal} tinta={C.noche} x={1010} y={400} centro size={60} />
          <Flecha t={t} t0={49.5} x1={1010} y1={460} x2={1000} y2={770} color={C.teal} curva={-40} />
        </Escena>
        {/* 014 · trampa número uno: el contrato. La ficha cae en la casilla 1 */}
        <Escena t={t} t0={51.14} t1={53.56} zoom={0.05} entra="corte" golpes={[51.68, 52.56]}>
          <TableroC t={t} t0={50.0} en={0} de={0} marca={51.68} />
          <Chip t={t} t0={51.0} text="TRAP 1 OF 7" color={C.rojo} x={760} y={200} centro size={64} />
          <Grande t={t} t0={52.5} text="THE CONTRACT" x={900} y={420} size={130} />
        </Escena>

        {/* 015 · es el año 110: noche en el pueblo, mira el cielo */}
        <Escena t={t} t0={53.56} t1={55.7} entra="corte">
          <Pueblo t={t} hora="tarde" dx={(t - 53.5) * 20} />
          <AbsoluteFill style={{ background: "rgba(30,20,80,.35)" }} />
          <Estrellas t={t} n={60} seed={8} alto={420} />
          <Persona x={1500} y={1050} h={560} t={t} seed={1} casco="legion" giro="34" flip expr="sorpresa" miraY={-0.7} mira={0.3} bD={30} cD={130} agarraI={<EnMano.bolsa />} agarraAngI={90} />
          <Grande t={t} t0={53.7} text={`AD ${Math.round(interpolate(t, [53.98, 54.7], [1, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}`} x={760} y={380} size={240} color={C.oro} />
          <Chip t={t} t0={54.5} text="TRAJAN RULES ROME" color={C.violeta} x={760} y={590} centro size={54} />
        </Escena>

        {/* 016a · tenés 18 años: en la calle del pueblo, vecinos que pasan */}
        <Escena t={t} t0={55.7} t1={57.26} entra="corte" golpes={[55.94]}>
          <Pueblo t={t} dx={(t - 55.7) * 30} />
          <Persona x={interpolate(t, [55.7, 57.3], [1300, 1560])} y={900} h={300} t={t} seed={78} ropa={CIVIL(3)} giro="perfil" camina={1.2} bruma={0.2} agarra={<EnMano.copa />} agarraAng={-60} />
          <Persona x={interpolate(t, [55.7, 57.3], [1800, 1650])} y={910} h={280} t={t} seed={79} ropa={CIVIL(0)} giro="perfil" flip camina={1.1} bruma={0.2} />
          <Persona x={700} y={1070} h={760} t={t} seed={1} casco="legion" giro="34" expr="feliz" mira={0.5} {...pose("saludar", t, 0.7)} />
          <Grande t={t} t0={55.8} text="18" x={1340} y={400} size={300} color="#fff" />
          <Chip t={t} t0={56.2} text="YEARS OLD" color={C.violeta} x={1340} y={620} centro size={64} />
        </Escena>

        {/* 016b · en un pueblo polvoriento: con el atado al hombro, entre el polvo y una gallina */}
        <Escena t={t} t0={57.26} t1={58.46} entra="corte">
          <Pueblo t={t} dx={(t - 57.26) * 60} />
          <Particulas t={t} tipo="polvo" n={50} seed={16} />
          <Persona x={interpolate(t, [57.26, 58.46], [700, 980], { extrapolateRight: "clamp" })} y={1050} h={560} t={t} seed={1} casco="legion" giro="perfil" expr="neutro" camina={1.3} agarra={<EnMano.bolsa />} agarraAng={90} bD={14} cD={10} />
          <svg style={{ position: "absolute", left: interpolate(t, [57.26, 58.46], [1500, 1380]), top: 880 - Math.abs(Math.sin(t * 9)) * 14, overflow: "visible", transform: "scale(1.7)", transformOrigin: "60px 100px" }} width={120} height={100}>
            <ellipse cx={60} cy={60} rx={42} ry={32} fill="#fff6e8" /><circle cx={24} cy={30} r={18} fill="#fff6e8" /><path d="M 8 30 L -6 34 L 8 38 Z" fill="#e9a92a" /><path d="M 20 12 Q 24 0 30 12" fill={C.rojo} />
            <circle cx={20} cy={27} r={3} fill="#2a1530" /><line x1={50} y1={90} x2={46} y2={104} stroke="#e9a92a" strokeWidth={5} /><line x1={70} y1={90} x2={74} y2={104} stroke="#e9a92a" strokeWidth={5} />
          </svg>
          <Chip t={t} t0={57.4} text="DUSTY TOWN" color={C.tierra} x={960} y={200} centro size={66} />
        </Escena>

        {/* 016c · en algún lugar de Galia o Hispania: la cámara vuela al oeste y el chico sale de su pueblo por un camino punteado hasta el pin */}
        <Escena t={t} t0={58.46} t1={60.34} zoom={0.02} entra="corte">
          <MapaPuntos t={t} pulsa={["GAUL", "SPAIN"]} t0Pulsa={59.0} vuela={{ n: "GAUL", z: 1.7, t: [58.46, 59.6] }} />
          <Chip t={t} t0={59.02} text="GAUL" color={C.rojo} x={1050} y={610} size={64} />
          <Chip t={t} t0={59.56} text="OR SPAIN" color={C.rojo} x={420} y={830} size={64} />
          {(() => {
            const k = prog(t, 59.1, 60.3);
            const p0 = [1330, 680], pc = [1150, 460], p1 = [990, 535];
            const q = (u: number) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * pc[0] + u * u * p1[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * pc[1] + u * u * p1[1]];
            const [hx, hy] = q(k);
            return <>
              <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
                <path d={`M ${p0[0]} ${p0[1]} Q ${pc[0]} ${pc[1]} ${p1[0]} ${p1[1]}`} stroke="#fff3c4" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="4 22" pathLength={1000} style={{ strokeDashoffset: 0 }} opacity={0.35} />
                <path d={`M ${p0[0]} ${p0[1]} Q ${pc[0]} ${pc[1]} ${p1[0]} ${p1[1]}`} stroke="#fff3c4" strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={`${k * 1000} 2000`} pathLength={1000} />
              </svg>
              {k > 0 && <Persona x={hx} y={hy} h={110} t={t} seed={1} casco="legion" giro="perfil" flip camina={2} plano />}
            </>;
          })()}
          {/* postal del pueblo de donde sale */}
          <div style={{ position: "absolute", left: 1320, top: 600, width: 440, height: 340, overflow: "hidden", borderRadius: 18, border: "10px solid #fff8ec", boxShadow: "14px 16px 0 rgba(10,5,30,.45)", transform: `rotate(3deg) scale(${ent(t, 58.46)})`, background: "linear-gradient(180deg,#f2ae62,#fde3b4)" }}>
            <Casa x={110} y={230} s={0.7} tono="#f0c08a" techo="#b5552c" />
            <Casa x={340} y={220} s={0.6} tono="#e8b07a" />
            <div style={{ position: "absolute", left: 0, right: 0, top: 220, bottom: 0, background: "linear-gradient(180deg,#d39a5a,#a8692e)" }} />
            <Persona x={interpolate(t, [58.46, 59.3], [220, 40], { extrapolateRight: "clamp" })} y={320} h={210} t={t} seed={1} casco="legion" giro="perfil" flip expr="neutro" camina={1.4} plano />
          </div>
        </Escena>

        {/* 016d · el campo de la familia no alcanza para dos hermanos: sentados en el banco, un solo pan */}
        <Escena t={t} t0={60.34} t1={63.6} entra="corte" golpes={[62.38]}>
          <Campo t={t} seco dx={(t - 60.3) * 10} />
          <Casa x={1620} y={820} s={0.9} tono="#e8c08a" />
          <Banco x={960} y={1040} w={720} alto={140} tono="#9a5a2a" />
          <Persona x={760} y={1040} h={600} t={t} seed={1} casco="legion" postura="sentado" giro="34" expr="triste" mira={0.6}
            agarra={<PanMano />} agarraAng={-10} bD={50} cD={70} />
          <Persona x={1170} y={1040} h={560} t={t} seed={77} ropa={CIVIL(4)} postura="sentado" giro="34" flip expr="sorpresa" mira={0.6} aparece={62.38} bD={60} cD={60} miraY={0.4} />
          <Emote t={t} t0={62.6} tipo="sudor" {...L(760, 1040, 600)} />
          <Particulas t={t} tipo="polvo" n={24} seed={18} />
          <Chip t={t} t0={60.6} text="FAMILY FARM" color={C.tierra} x={960} y={200} centro size={64} />
          <Chip t={t} t0={62.38} text="TOO SMALL FOR TWO" color={C.rojo} x={960} y={320} centro size={64} />
        </Escena>
      </CamaraMano>
    </AbsoluteFill>
  );
};
