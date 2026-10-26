import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import { Moneda3, Ficha, Aviso, Termometro } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, NINO, NINA, OBRERO, DUENO, CAPATAZ, GenteFab, HILANDERO } from "./mundo";
import { Gran, Cuenta, Sello, Tachado, Flash, sacudon, Velo, Horror, Latigo } from "./capas";
import { Primer } from "./piezas";
import { Persona } from "./persona";

// PARTE E · HORROR #4, LAS MULTAS (392,9-473,5 s). Seguimos en la fábrica abierta: la oficina del dueño, el cartel de
// multas de Tyldesley que los obreros imprimieron → el aviso renglón por renglón (ventana, sucio, lavarse, silbar,
// 5 minutos, enfermo = pagar el vapor: 6 chelines) → el sueldo de un chico → fichas de la tienda de la empresa →
// prohibido en 1831 → la plata que sube por los pisos de vuelta al dueño.
export const E0 = 392.9, E1 = 473.5;

const KE: K[] = [
  [392.9, 4280, -1560, 1.15], [394.8, 4280, -1560, 1.2], [395.6, 4150, -1430, 0.82], [401.7, 4150, -1430, 0.78], [404.6, 4280, -1560, 1.0], [409.4, 4280, -1560, 1.05], [445.7, 4280, -1560, 1.1],
  [445.71, 2600, -330, 1.55], [453.6, 2600, -330, 1.65], [455.4, 2620, -340, 1.5], [459.39, 2620, -340, 1.55],
  [459.4, 5420, -1450, 0.75], [463.4, 5400, -1450, 0.8], [467.9, 5380, -1450, 0.82],
  [467.91, 3600, -1500, 0.32], [473.5, 3600, -1500, 0.34],
];

// renglones del cartel (tiempos de la locución)
const ITEMS = [
  { txt: "WINDOW OPEN", t0: 409.6, monto: "1s" },
  { txt: "FOUND DIRTY AT WORK", t0: 415.8, monto: "1s" },
  { txt: "FOUND WASHING HIMSELF", t0: 419.0, monto: "1s" },
  { txt: "HEARD WHISTLING", t0: 425.9, monto: "1s" },
  { txt: "5 MINUTES AFTER THE BELL", t0: 428.6, monto: "1s" },
  { txt: "SICK, NO REPLACEMENT: PAY FOR STEAM", t0: 432.8, monto: "6s" },
];
const focoEn = (t: number) => { let f = -1; ITEMS.forEach((it, i) => { if (t >= it.t0) f = i; }); return f; };

// vuelta 9 OJO: cada multa ACTUADA en una viñeta al costado de la lista (antes: 30 s de lista sola)
const VIN: { t0: number; t1: number; que: string }[] = [
  { t0: 415.8, t1: 419.0, que: "sucio" }, { t0: 419.0, t1: 425.9, que: "lava" }, { t0: 425.9, t1: 428.6, que: "silba" },
  { t0: 428.6, t1: 432.8, que: "tarde" }, { t0: 432.8, t1: 440.1, que: "enfermo" },
];
const Vineta: React.FC<{ t: number }> = ({ t }) => {
  const v = VIN.find((q) => t >= q.t0 && t < q.t1) ?? VIN[VIN.length - 1];
  const k = t - v.t0, e = ent(t, 415.85);
  const L = 1150, T = 170, W = 700, H = 740;
  const nino = { seed: 2, ropa: NINO, gorro: "gorra" as const };
  return (
    <div style={{ position: "absolute", left: L, top: T, width: W, height: H, borderRadius: 30, overflow: "hidden", border: "10px solid #fff3d6", boxShadow: "0 18px 0 rgba(0,0,0,.35)", transform: `scale(${e})`, transformOrigin: "50% 50%", background: v.que === "enfermo" ? "linear-gradient(180deg,#3a2f5a,#241c3e)" : "linear-gradient(180deg,#e9c99a,#c9a274)" }}>
      <div style={{ position: "absolute", left: 0, top: H - 150, width: W, height: 150, background: v.que === "enfermo" ? "#1a1430" : "#7a5230" }} />
      {/* la multa cae: moneda de 1s a la alcancía del patrón */}
      <div style={{ position: "absolute", left: W - 150, top: -60 + Math.min(1, k / 0.6) * 160, width: 96, height: 96, borderRadius: 48, background: "#d9dde3", border: "8px solid #8a8494", fontFamily, fontWeight: 700, fontSize: 40, color: "#4a4560", display: "flex", alignItems: "center", justifyContent: "center", opacity: k < 2.4 ? 1 : 0 }}>{v.que === "enfermo" ? "6s" : "1s"}</div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
        {v.que === "sucio" && <>
          <Persona t={t} {...nino} x={300} y={620} h={520} expr="triste" bD={30 + 20 * Math.sin(t * 5)} cD={90} ladea={-6} />
          {[[250, 330], [330, 400], [280, 470], [300, 250]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 34, height: 22, borderRadius: 12, background: "#5a4029", opacity: 0.8 }} />)}
          <Persona t={t} seed={61} ropa={CAPATAZ} gorro="gorra" x={560} y={620} h={540} flip expr="enojado" bD={95} cD={0} habla />
        </>}
        {v.que === "lava" && <>
          <div style={{ position: "absolute", left: 130, top: 420, width: 360, height: 30, background: "#6b4528", borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 160, top: 450, width: 26, height: 140, background: "#6b4528" }} />
          <div style={{ position: "absolute", left: 434, top: 450, width: 26, height: 140, background: "#6b4528" }} />
          {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + i * 40, top: 330 - ((k * 60 + i * 23) % 120), width: 22, height: 22, borderRadius: 11, border: "4px solid #fff", opacity: 0.8 }} />)}
          <Persona t={t} {...nino} x={310} y={620} h={520} expr={k > 3 ? "miedo" : "neutro"} bD={70 + 8 * Math.sin(t * 9)} bI={70 - 8 * Math.sin(t * 9)} cD={50} cI={50} />
          <div style={{ position: "absolute", left: 170, top: 340, width: 280, height: 80, background: "#a7a3b8", borderRadius: "0 0 70px 70px", border: "8px solid #2a1530" }} />
          <div style={{ position: "absolute", left: 186, top: 344, width: 248, height: 18, background: "#7fb6d9", borderRadius: 9 }} />
          {k > 3 && <Persona t={t} seed={61} ropa={CAPATAZ} gorro="gorra" x={590} y={620} h={540} flip expr="enojado" bD={95} cD={0} habla aparece={v.t0 + 3} />}
        </>}
        {v.que === "silba" && <>
          <Persona t={t} {...nino} x={300} y={620} h={520} expr={k < 1.4 ? "feliz" : "sorpresa"} bD={k < 1.4 ? 20 : 150} cD={20} />
          {k < 1.6 && ["♪", "♫", "♪"].map((n, i) => <div key={i} style={{ position: "absolute", left: 360 + i * 60 + Math.sin(t * 4 + i) * 14, top: 230 - ((k * 90 + i * 40) % 140), fontSize: 64, color: "#2a1530", fontWeight: 700 }}>{n}</div>)}
          <Persona t={t} seed={61} ropa={CAPATAZ} gorro="gorra" x={570} y={620} h={540} flip expr="enojado" bD={95} cD={0} habla={k > 1} />
        </>}
        {v.que === "tarde" && <>
          <div style={{ position: "absolute", left: 470, top: 90, width: 170, height: 170, borderRadius: 85, background: "#fff6dc", border: "10px solid #2a1530" }}>
            <div style={{ position: "absolute", left: 76, top: 22, width: 8, height: 64, background: "#2a1530", transformOrigin: "4px 60px", transform: `rotate(${30 + k * 20}deg)` }} />
          </div>
          <Persona t={t} {...nino} x={120 + Math.min(k, 2.2) * 110} y={620} h={520} expr="miedo" camina={k < 2.2 ? 2.4 : 0} inclina={k < 2.2 ? 10 : 0} />
          <div style={{ position: "absolute", left: 470, top: 280, fontFamily, fontWeight: 700, fontSize: 44, color: "#2a1530" }}>+5 MIN</div>
        </>}
        {v.que === "enfermo" && <>
          <Persona t={t} {...nino} x={300} y={600} h={460} expr="triste" bD={20} cD={20} ladea={-12 + 4 * Math.sin(t * 6)} inclina={6 * Math.max(0, Math.sin(t * 7))} />
          <div style={{ position: "absolute", left: 60, top: 420, width: 480, height: 90, background: "#c9c2dc", borderRadius: 30 }} />
          <div style={{ position: "absolute", left: 40, top: 480, width: 520, height: 120, background: "#8a5a3c", borderRadius: 18 }} />
          <Emote t={t} t0={v.t0 + 0.4} tipo="sudor" x={330} y={260} s={0.7} />
          {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 520 + (i % 2) * 40, top: 380 - ((k * 70 + i * 50) % 220), width: 60, height: 60, borderRadius: 30, background: "#fff", opacity: 0.35 }} />)}
          <div style={{ position: "absolute", left: 470, top: 520, fontFamily, fontWeight: 700, fontSize: 40, color: "#fff3d6" }}>STEAM</div>
        </>}
      </div>
    </div>
  );
};

export const PE: React.FC<{ t: number }> = ({ t }) => {
  const cam = camara(t, KE);
  const sh = sacudon(t, [440.1, 451.4, 463.6, 471.9]);
  const g1: GenteFab[] = [
    { seed: 60, x: t > 401.7 && t < 409.4 ? 3760 : t > 459.4 && t < 467.9 ? 4650 : 4300, y: -1000, h: 480, ropa: DUENO, gorro: "copa", barba: true, expr: t > 395 && t < 409 ? "orgullo" : t > 468 ? "feliz" : "neutro", bD: t > 395.2 && t < 401 ? 60 : t > 401.7 && t < 404.6 ? 150 + 30 * Math.sin(t * 16) : t > 401.7 && t < 409.4 ? 110 + 10 * Math.sin(t * 4) : 0, cD: t > 401.7 && t < 404.6 ? 20 : 60, manoD: t > 401.7 && t < 404.6 ? <div style={{ position: "absolute", left: -12, top: -70, width: 24, height: 90, background: "#8a5a2c", borderRadius: 6 }}><div style={{ position: "absolute", left: -26, top: -6, width: 76, height: 34, background: "#5d5670", borderRadius: 6 }} /></div> : undefined, flip: !(t > 401.7 && t < 409.4), mira: t > 401.7 && t < 409.4 ? 1 : 0 },
    { seed: 61, x: t > 459.4 && t < 467.9 ? 5050 : 4750, y: -1000, h: 470, ropa: CAPATAZ, gorro: "gorra", expr: "orgullo", mira: -1 },
  ];
  if (t > 399.4 && t < 405) for (let i = 0; i < 3; i++) g1.push({ seed: 62 + i, x: 3650 + i * 150, y: -1000, h: 440 + (i % 2) * 30, ropa: i === 1 ? HILANDERO : OBRERO(i + 2), expr: "enojado", habla: true, aparece: 399.5 + i * 0.15, bD: i === 0 ? 150 : 20 });
  const g0: GenteFab[] = [];
  if (t > 445.7 && t < 459.4) g0.push({ seed: 2, x: 2600, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: t > 451.4 ? "triste" : "neutro", bD: 70, cD: 50, mira: 1 });
  if (t > 459.4 && t < 467.9) for (let i = 0; i < 3; i++) g1.push({ seed: 70 + i, x: 5500 + i * 220, y: -1000, h: i === 1 ? 290 : 450, ropa: i === 1 ? NINA : OBRERO(i + 4), gorro: i === 1 ? "cofia" : undefined, largo: i === 1, expr: t > 461.4 ? "triste" : "neutro", bD: 60, cD: 40 });
  if (t > 467.9) g0.push({ seed: 2, x: 2500, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: "triste" });
  const aviso = t > 409.4 && t < 446;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <CieloHora t={t} luz={1.7} />
      <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} /></div></Espacio>
      <Espacio cam={cam}>
        <Pueblo t={t} e={{ abre: 1, hora: 15, luz: 1.8 }} adentro={{ gente: g0, gente1: g1, cartelLineas: ["WINDOW OPEN|1s", "DIRTY AT WORK|1s", "WHISTLING|1s", "LATE 5 MIN|1s"] }} />
        {/* etiquetas de precio de la tienda de la empresa: suben */}
        {t > 459.4 && t < 467.9 && Array.from({ length: 6 }, (_, i) => {
          const sube = t > 461.5 + i * 0.12;
          return (
            <div key={i} style={{ position: "absolute", left: 5360 + i * 185, top: -1640, width: 140, height: 70, borderRadius: 12, background: sube ? C.rojo : "#fff6dc", border: "6px solid #2a1530", fontFamily, fontWeight: 700, fontSize: 40, color: sube ? "#fff" : "#2a1530", textAlign: "center", lineHeight: "58px", transform: `scale(${sube ? 1 + 0.25 * Math.exp(-(t - 461.5 - i * 0.12) * 6) : 1})` }}>{sube ? `${3 + (i % 3)}d` : `${1 + (i % 2)}d`}</div>
          );
        })}
        {/* la plata que sube por los pisos hasta el dueño */}
        {t > 468.1 && Array.from({ length: 14 }, (_, i) => {
          const k = ((t - 468.1) * 0.55 + i / 14) % 1;
          return <Moneda3 key={i} t={t} t0={468.1 + i * 0.12} x={2500 + (4300 - 2500) * k} y={-300 - 900 * k - Math.sin(k * Math.PI) * 300} s={0.7} txt="s" oro={i % 2 === 0} />;
        })}
      </Espacio>

      {/* ── capas de pantalla ── */}
      <Latigo t={t} at={[392.95, 445.7, 459.4, 467.9]} />
      <Horror t={t} t0={392.95} n={4} nombre="THE FINES" t1={395.0} />
      <Chip t={t} t0={395.3} t1={397.3} text="THE FACTORY GETS CREATIVE" color={C.violeta} x={960} y={150} centro size={72} />
      <Chip t={t} t0={397.5} t1={401.6} text="THE SAME MILL IN TYLDESLEY" color={C.noche} x={960} y={950} centro size={64} />
      <Chip t={t} t0={399.6} t1={401.6} text="THE WORKERS WERE FURIOUS" color={C.rojo} x={960} y={150} centro size={70} />
      {/* volantes impresos que vuelan para que lo vea el público */}
      {t > 401.7 && t < 404.6 && (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 22 }, (_, i) => {
            const k = prog(t, 401.7 + (i % 7) * 0.1, 403.6 + (i % 7) * 0.1);
            const x = 960 + Math.cos(i * 1.7) * 1100 * k, y = 600 + Math.sin(i * 2.3) * 650 * k - 200 * k;
            return <g key={i} transform={`translate(${x} ${y}) rotate(${i * 37 + k * 300}) scale(${0.5 + k * 0.7})`}><rect x={-80} y={-100} width={160} height={200} fill="#fbf3dc" stroke="#2a1530" strokeWidth={6} /><rect x={-56} y={-76} width={112} height={18} fill="#2a1530" />{[0, 1, 2, 3].map((r) => <rect key={r} x={-56} y={-40 + r * 30} width={112 - r * 16} height={10} fill="#c9b48a" />)}<text x={0} y={-61} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={16} fill="#fff">FINES</text></g>;
          })}
        </svg>
      )}
      <Chip t={t} t0={401.8} t1={404.5} text="THEY PRINTED IT FOR THE PUBLIC" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={66} />
      <Chip t={t} t0={404.7} t1={409.3} text="REAL PENALTIES · IN SHILLINGS" color={C.noche} x={960} y={150} centro size={70} />
      {t > 406.4 && t < 409.4 && [0, 1, 2, 3].map((i) => <Moneda3 key={i} t={t} t0={406.5 + i * 0.25} t1={409.2} x={660 + i * 200} y={560 + Math.min(1, (t - 406.5 - i * 0.25)) * 260} s={0.6} txt="1s" />)}
      <Chip t={t} t0={406.5} t1={409.3} text="STRAIGHT OUT OF YOUR PAY" color={C.rojo} x={960} y={950} centro size={66} />
      {aviso && <Velo t={t} t0={409.4} t1={445.6} op={0.85} />}
      {aviso && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - prog(t, 445.3, 445.7) }}>
          {t < 440.1 && <Aviso t={t} t0={409.4} x={t < 415.8 ? 860 : 860 - 300 * prog(t, 415.8, 416.4)} y={500} w={t < 415.8 ? 1150 : 1150 - 230 * prog(t, 415.8, 416.4)} titulo="TYLDESLEY MILL · FINES" items={ITEMS} foco={focoEn(t)} />}
          {t > 415.8 && t < 440.1 && <Vineta t={t} />}
        </div>
      )}
      {/* anotaciones al costado del cartel */}
      {t > 412.9 && t < 415.6 && <div style={{ position: "absolute", left: 150, top: 160, transform: `scale(${ent(t, 412.9) * 0.55})`, transformOrigin: "0 0" }}><div style={{ position: "relative" }}><Termometro x={0} y={860} nivel={0.86} unidad="F" /></div></div>}
      <Chip t={t} t0={412.9} t1={415.6} text="REMEMBER: 80–84°F INSIDE" color={C.naranja} x={960} y={1010} centro size={52} />
      <Chip t={t} t0={422.7} t1={425.7} text="CAN'T BE DIRTY · CAN'T WASH" color={C.rojo} x={560} y={1000} centro size={56} />
      <Chip t={t} t0={428.6} t1={432.6} text="ONE SHILLING · EACH TIME" color={C.noche} x={560} y={1000} centro size={52} />
      <Chip t={t} t0={432.8} t1={437.8} text="AND THE BEST ONE…" color={C.violeta} x={560} y={1000} centro size={56} />
      <Flash t={t} at={[440.1]} />
      {t > 440.0 && t < 445.6 && (
        <>
          <AbsoluteFill style={{ background: "rgb(27,18,64)", opacity: prog(t, 440, 440.2) * (1 - prog(t, 445.3, 445.6)) }} />
          {Array.from({ length: 6 }, (_, i) => <Moneda3 key={i} t={t} t0={440.15 + i * 0.12} t1={445.3} x={300 + i * 190} y={640} s={0.85} txt="1s" />)}
          <Persona t={t} seed={79} x={1640} y={1040} h={640} ropa={NINO} gorro="gorra" flip mira={-1} expr="triste" bD={150} cD={130} bI={150} cI={130} aparece={440.4} />
          <Gran t={t} t0={440.1} t1={445.3} text="6 SHILLINGS" y={330} size={190} color={C.rojo} />
          <Chip t={t} t0={441.4} t1={445.3} text="YOU PAY FOR THE POWER IT DIDN'T USE ON YOU" color={C.ambar} tinta={C.noche} x={960} y={900} centro size={50} />
        </>
      )}
      <Chip t={t} t0={445.8} t1={447.4} text="THOSE WERE THE ADULTS" color={C.noche} x={960} y={150} centro size={70} />
      {t > 447.5 && t < 453.7 && (
        <>
          <Chip t={t} t0={447.6} t1={453.6} text="A PIECER'S WEEK" color={C.violeta} x={960} y={150} centro size={70} />
          {[0, 1, 2, 3].map((i) => <Moneda3 key={i} t={t} t0={448.4 + i * 0.2} t1={453.5} x={600 + i * 240} y={330} s={0.75} txt="1s" />)}
          <Tachado t={t} t0={451.4} t1={453.5} x={600} y={330} w={230} h={230} />
          <Chip t={t} t0={451.6} t1={453.6} text="ONE FINE = DAYS OF WORK GONE" color={C.rojo} x={960} y={950} centro size={64} />
        </>
      )}
      <Chip t={t} t0={453.8} t1={455.0} text="SOME MILLS WENT FURTHER" color={C.noche} x={960} y={150} centro size={70} />
      <Gran t={t} t0={455.4} t1={457.4} text="THE TRUCK SYSTEM" y={190} size={130} color={C.ambar} />
      {t > 454.9 && t < 459.4 && [0, 1, 2].map((i) => <Ficha key={i} t={t} t0={454.9 + i * 0.3} t1={459.2} x={interpolate(t, [454.9 + i * 0.3, 455.7 + i * 0.3], [1700, 1180 + i * 170], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={interpolate(t, [454.9 + i * 0.3, 455.7 + i * 0.3], [420, 640 - (i % 2) * 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} s={0.7} />)}
      {t > 454.9 && t < 459.4 && <Persona t={t} seed={78} x={1780} y={900} h={420} ropa={CAPATAZ} flip mira={-1} expr="orgullo" bD={t < 457 ? 120 : 30} cD={t < 457 ? 80 : 20} aparece={454.9} />}
      <Chip t={t} t0={457.6} t1={459.3} text="WAGES PAID IN TOKENS" color={C.noche} x={960} y={950} centro size={64} />
      <Chip t={t} t0={459.5} t1={461.4} text="ONLY GOOD AT THE BOSS'S SHOP" color={C.rojo} x={960} y={150} centro size={66} />
      <Chip t={t} t0={461.5} t1={463.5} text="PRICES SET BY THE BOSS" color={C.noche} x={960} y={950} centro size={66} />
      <Velo t={t} t0={463.5} t1={465.9} op={0.3} />
      <Sello t={t} t0={463.6} t1={465.6} text="WAGES IN GOODS: BANNED · TRUCK ACT 1831" x={960} y={900} size={70} color={C.lima} rot={-4} />
      <Chip t={t} t0={465.9} t1={467.8} text="…IT TOOK A LONG TIME TO DISAPPEAR" color={C.violeta} x={960} y={950} centro size={58} />
      <Chip t={t} t0={468.1} t1={471.7} text="14 HOURS · AND THE MONEY GOES BACK UP" color={C.noche} x={960} y={150} centro size={58} />
      <Gran t={t} t0={471.8} t1={473.4} text="HE ALREADY OWNS YOUR DAY" y={900} size={100} color={C.rojo} />
    </AbsoluteFill>
  );
};
