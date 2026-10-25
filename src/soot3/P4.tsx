import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona, CENTURION, CIVIL } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Estrellas, Astro, Colinas, Chip, Grande, MapaPuntos, Particulas, Rayos, Emote, cabeza, Palo, Garrote, Zzz, Moneda } from "./kit";
import { Denario, Tarjeta, Papiro, Tablilla, Ropa, Comida, Soldadito, Urna, Craneo, Lluvia, Trampas, Fuerte, Letrina } from "./kit2";
import { Cuenta } from "./P1";
import { Pala } from "./P3";

// Parte 4 (361,98-547,17 s): trampa 4, el centurión, sobornos, fustuarium, diezmado, el aburrimiento, los inmunes y Vindolanda.
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#c9773a", b = "#7a4a20" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
// palo de vid que se parte en dos
const PaloRoto: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const k = Math.max(0, t - t0);
  const a = Math.min(1, k * 3);
  return (
    <svg style={{ position: "absolute", left: x - 300, top: y - 300, overflow: "visible" }} width={600} height={600}>
      <g transform={`translate(${300 - a * 160} ${300 - a * 120 + k * k * 300}) rotate(${-30 - a * 200})`}><rect x={-160} y={-12} width={160} height={24} rx={10} fill="#7a5a2a" /><path d="M 0 -12 L 10 -4 L 0 4 L 12 12" stroke="#c9a46a" strokeWidth={4} fill="none" /></g>
      <g transform={`translate(${300 + a * 160} ${300 - a * 80 + k * k * 300}) rotate(${-30 + a * 160})`}><rect x={0} y={-12} width={160} height={24} rx={10} fill="#7a5a2a" /></g>
      {k < 0.4 && Array.from({ length: 10 }, (_, i) => { const an = (i / 10) * Math.PI * 2; return <line key={i} x1={300 + Math.cos(an) * 30 * (1 + k * 8)} y1={300 + Math.sin(an) * 30 * (1 + k * 8)} x2={300 + Math.cos(an) * 60 * (1 + k * 8)} y2={300 + Math.sin(an) * 60 * (1 + k * 8)} stroke="#ffe08a" strokeWidth={10} strokeLinecap="round" opacity={1 - k * 2.5} />; })}
    </svg>
  );
};
// tarjeta de trato: paga / no paga
const Trato: React.FC<{ t: number; t0: number; x: number; paga: boolean; txt: string; bien: boolean }> = ({ t, t0, x, paga, txt, bien }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x - 270, top: 230, width: 540, height: 620, borderRadius: 34, background: bien ? "#effbe8" : "#ffe6ea", border: `10px solid ${bien ? "#3fa34d" : C.rojo}`, transform: `translateY(${(1 - e) * 500}px) rotate(${(1 - e) * 12}deg)`, boxShadow: "16px 18px 0 rgba(20,8,40,.35)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 64, color: paga ? "#3a2a00" : C.rojo }}>{paga ? "PAY UP" : "DON'T PAY"}</div>
      <div style={{ position: "absolute", left: 270 - 90, top: 140 }}>
        {paga ? <div style={{ position: "relative", width: 180, height: 180 }}>{[0, 1, 2].map((i) => <Denario key={i} x={90 + (i - 1) * 40} y={90 - i * 14} r={60} gira={t * 2 + i} />)}</div>
          : <svg width={180} height={180} viewBox="-90 -90 180 180"><circle r={80} fill="none" stroke={C.rojo} strokeWidth={16} /><path d="M -56 56 L 56 -56" stroke={C.rojo} strokeWidth={16} /></svg>}
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: "#2a1530" }}>{txt}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontSize: 90, transform: `scale(${ent(t, t0 + 0.5)})`, fontFamily, fontWeight: 700, color: bien ? "#3fa34d" : C.rojo }}>{bien ? "✓" : "✗"}</div>
    </div>
  );
};
// ícono grande de oficio para los inmunes
const Inmune: React.FC<{ t: number; t0: number; i: number; of: Parameters<typeof Tarjeta>[0]["of"]; label: string }> = ({ t, t0, i, of, label }) => {
  if (t < t0 - 0.2) return null;
  const x = 330 + (i % 3) * 630, y = 380 + Math.floor(i / 3) * 400;
  return <Tarjeta x={x} y={y} s={1.25} t={t} t0={t0} of={of} label={label} />;
};

export const P4: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 098 · trampa cuatro: el centurión */}
    <Escena t={t} t0={361.98} t1={364.1} entra="corte" golpes={[362.2, 363.28]}>
      <AbsoluteFill style={{ background: C.violeta }} />
      <Rayos t={t} x={960} y={430} color="#fff" op={0.14} />
      <Grande t={t} t0={362.2} text="TRAP #4" y={400} size={260} color="#fff" borde="#2a1530" />
      <Grande t={t} t0={363.28} text="THE CENTURION" y={650} size={130} color={C.oro} borde="#2a1530" />
      <Trampas t={t} t0={362.0} n={4} y={850} on={C.oro} />
    </Escena>

    {/* 099 · tu vida la maneja un solo hombre */}
    <Escena t={t} t0={364.1} t1={367.1} zoom={0.06} entra="zoom" golpes={[365.2, 366.22]}>
      <Cielo tipo="sangre" />
      <Rayos t={t} x={1200} y={300} color="#ffb0a0" op={0.12} />
      <Colinas capas={["#4a1030", "#2a0a1e"]} base={820} seed={101} alto={40} />
      <Persona x={1200} y={1250} h={980} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="enojado" flip mira={-0.5} />
      <Persona x={420} y={1010} h={300} t={t} seed={1} casco="legion" expr="miedo" mira={0.6} />
      <Emote t={t} t0={365.4} tipo="susto" {...L(420, 1010, 300)} s={0.8} />
      <Chip t={t} t0={365.2} text="ONE MAN" color={C.rojo} x={160} y={140} size={70} />
    </Escena>

    {/* 100 · manda a 80 soldados */}
    <Escena t={t} t0={367.1} t1={368.4} entra="corte" golpes={[367.66]}>
      <AbsoluteFill style={{ background: "#1b1240" }} />
      {Array.from({ length: 80 }, (_, i) => {
        const x = 170 + (i % 16) * 106, y = 420 + Math.floor(i / 16) * 120;
        return t > 367.2 + i * 0.008 && <Soldadito key={i} x={x} y={y} s={0.9} t={t} seed={i} />;
      })}
      <Cuenta t={t} t0={367.66} t1={368.1} de={0} a={80} x={960} y={200} size={200} color={C.oro} suf=" MEN" />
    </Escena>

    {/* 101 · veterano de 20 años de cicatrices, con un palo de vid */}
    <Escena t={t} t0={368.4} t1={373.8} zoom={0.05} entra="barrido" golpes={[369.7, 370.28, 372.36]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 40% 45%, #8c1d34, #2a0a1e 75%)" }} />
      <Rayos t={t} x={700} y={420} color="#ffb0a0" op={0.08} />
      <Persona x={700} y={1240} h={880} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="enojado" habla={t < 372} bD={t > 372.2 ? 15 : 30} cD={t > 372.2 ? 0 : 20} manoD={t > 372.2 ? <Palo largo={300} /> : undefined} />
      {t > 370.6 && [[-40, -30, 30], [30, 10, -20], [-10, 40, 15]].map(([dx, dy, r], i) => {
        const c = L(700, 1240, 880);
        return <div key={i} style={{ position: "absolute", left: c.x + dx * 2.4 - 40, top: c.y + dy * 2.4 - 6, width: 80 * prog(t, 370.6 + i * 0.25, 370.9 + i * 0.25), height: 10, borderRadius: 5, background: "#8c1d34", transform: `rotate(${r}deg)` }} />;
      })}
      <Chip t={t} t0={369.7} text="VETERAN" color={C.ambar} tinta={C.noche} x={1200} y={200} size={60} />
      <Cuenta t={t} t0={370.28} t1={370.8} de={0} a={20} x={1480} y={420} size={140} color="#fff" suf=" YEARS" />
      <Chip t={t} t0={371.0} text="OF SCARS" color={C.rojo} x={1300} y={540} size={60} />
      <Chip t={t} t0={372.36} text="A VINE STICK" color={C.lima} tinta={C.noche} x={1260} y={760} size={64} />
    </Escena>

    {/* 102 · ese palo no es decoración: es como te habla */}
    <Escena t={t} t0={373.8} t1={377.4} entra="corte" golpes={[374.64, 376.46]}>
      <AbsoluteFill style={{ background: C.ambar }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.14} />
      {(() => {
        const sw = t > 375.9 ? interpolate(((t - 375.9) * 2.2) % 1, [0, 0.4, 1], [150, 20, 150]) : 60;
        return <>
          <Persona x={760} y={1080} h={700} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="enojado" flip bD={sw} cD={30} manoD={<Palo largo={300} />} />
          <Persona x={1360} y={1080} h={560} t={t} seed={1} casco="legion" expr="miedo" inclina={t > 376.1 ? -10 : 0} bD={150} bI={150} cD={90} cI={90} />
          <Emote t={t} t0={376.2} tipo="susto" {...L(1360, 1080, 560)} />
        </>;
      })()}
      <Chip t={t} t0={374.64} text="NOT DECORATION" color={C.rojo} x={160} y={140} size={60} />
      <div style={{ position: "absolute", left: 300, top: 260, padding: "26px 40px", borderRadius: 40, background: "#fff", border: "8px solid #2a1530", fontFamily, fontWeight: 700, fontSize: 56, color: "#2a1530", transform: `scale(${ent(t, 376.2)})`, transformOrigin: "80% 100%" }}>IT'S HOW HE TALKS TO YOU</div>
    </Escena>

    {/* 103 · Tácito nos cuenta de un centurión llamado Lucilius */}
    <Escena t={t} t0={377.4} t1={381.2} zoom={0.04} entra="iris" ix={600} iy={540} golpes={[378.12, 380.34]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2d1b69, #4a2f8f)" }} />
      <Tablilla x={560} y={540} s={1.3} t={t} t0={377.6} texto={["TACITUS", "ANNALS I.23"]} />
      <Persona x={1420} y={1160} h={820} t={t} seed={61} ropa={CENTURION} casco="centurion" expr="enojado" flip aparece={379.6} manoD={<Palo largo={260} />} bD={40} cD={20} />
      <Chip t={t} t0={378.12} text="THE HISTORIAN TACITUS" color={C.violeta} x={160} y={140} size={54} t1={380.2} />
      <Grande t={t} t0={380.34} text="LUCILIUS" y={160} size={120} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 104 · pegaba tanto que el palo se le partía en la espalda... y pedía otro */}
    <Escena t={t} t0={381.2} t1={388.4} zoom={0.05} entra="corte" golpes={[381.36, 383.12, 385.12, 387.84]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#7a3a6a", "#5a2a5a"]} base={720} seed={102} alto={50} />
      <Suelo y={880} />
      {(() => {
        const ciclo = t < 385.1 ? interpolate(((t - 381.3) * 2.6) % 1, [0, 0.35, 1], [160, 10, 160]) : 30;
        return <>
          <Persona x={760} y={1020} h={600} t={t} seed={61} ropa={CENTURION} casco="centurion" expr="enojado" bD={ciclo} cD={20} manoD={t < 385.12 ? <Palo largo={280} /> : undefined} />
          {[0, 1, 2].map((i) => <Persona key={i} x={1250 + i * 210} y={1020} h={460} t={t} seed={150 + i} casco="legion" expr={i === 0 ? "triste" : "miedo"} inclina={i === 0 ? 22 : 8} bD={20} />)}
          <Emote t={t} t0={381.6} tipo="susto" {...L(1250, 1020, 460)} />
          <Emote t={t} t0={383.2} tipo="lagrimas" {...L(1460, 1020, 460)} />
        </>;
      })()}
      {t > 385.12 && <PaloRoto t={t} t0={385.12} x={1100} y={560} />}
      <Chip t={t} t0={381.96} text="SO OFTEN" color={C.ambar} tinta={C.noche} x={160} y={140} size={58} />
      <Chip t={t} t0={383.12} text="SO HARD" color={C.rojo} x={160} y={260} size={58} />
      <Grande t={t} t0={385.12} text="SNAP!" y={250} size={170} color={C.oro} borde="#2a1530" />
      <Chip t={t} t0={387.22} text="&quot;A NEW ONE!&quot;" color={C.rojo} x={420} y={460} size={60} />
    </Escena>

    {/* 105 · «Cedo alteram»: traeme otro. Así lo apodaron */}
    <Escena t={t} t0={388.4} t1={393.0} entra="sube" banda={C.rojo} golpes={[388.56, 389.74, 392.18]}>
      <AbsoluteFill style={{ background: "#fff3e0" }} />
      <Rayos t={t} x={960} y={420} color={C.ambar} op={0.18} />
      {Array.from({ length: 7 }, (_, i) => {
        const t0 = 388.6 + i * 0.32;
        if (t < t0) return null;
        const k = Math.min(1, (t - t0) * 2.5);
        return <div key={i} style={{ position: "absolute", left: 200 + i * 230, top: 760 - k * 70, width: 22, height: 260, borderRadius: 10, background: "#7a5a2a", transform: `rotate(${-20 + i * 7}deg) scale(${k})`, boxShadow: "6px 6px 0 rgba(0,0,0,.2)" }} />;
      })}
      <Grande t={t} t0={388.56} text="CEDO ALTERAM" y={280} size={150} color={C.rojo} borde="#fff" />
      <Chip t={t} t0={389.74} text="&quot;BRING ME ANOTHER&quot;" color="#2a1530" x={960} y={480} centro size={64} />
      <Chip t={t} t0={392.18} text="HIS NICKNAME" color={C.violeta} x={960} y={1000} centro size={56} />
    </Escena>

    {/* 106 · en el Danubio se amotinaron: Lucilius fue de los primeros en caer */}
    <Escena t={t} t0={393.0} t1={398.4} zoom={0.05} entra="corte" golpes={[394.12, 394.94, 397.72]}>
      {t < 395.0
        ? <MapaPuntos t={t} pulsa={["DANUBE"]} t0Pulsa={394.12} vuela={{ n: "DANUBE", z: 2.2, t: [393.1, 394.6] }} />
        : <>
          <Cielo tipo="sangre" />
          <Rayos t={t} x={960} y={300} color="#ffb0a0" op={0.1} />
          <Colinas capas={["#4a1030", "#2a0a1e"]} base={760} seed={103} alto={50} />
          {Array.from({ length: 9 }, (_, i) => (
            <Persona key={i} x={140 + i * 205} y={1080 + (i % 2) * 30} h={460} t={t} seed={160 + i} casco="legion" expr="enojado" bD={150 + Math.sin(t * 9 + i) * 20} cD={20} flip={i > 4} />
          ))}
          {t > 397.0 && <Craneo x={960} y={560} s={0.7} t={t} t0={397.3} />}
        </>}
      <Chip t={t} t0={394.12} text="THE DANUBE" color={C.violeta} x={160} y={140} size={58} />
      <Grande t={t} t0={394.94} text="MUTINY!" y={250} size={170} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={396.86} text="LUCILIUS: ONE OF THE FIRST KILLED" color={C.rojo} x={960} y={420} centro size={52} />
    </Escena>

    {/* 107 · cómo funcionaba el sistema: sobornos al centurión */}
    <Escena t={t} t0={398.4} t1={407.2} zoom={0.04} entra="diag" golpes={[400.14, 404.2, 406.24]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #ffd27a, #c97a2a 70%)" }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.1} />
      <Persona x={1360} y={1080} h={700} t={t} seed={60} ropa={CENTURION} casco="centurion" expr={t > 404.2 ? "feliz" : "neutro"} flip bD={t > 404.2 ? 70 : 20} cD={40} />
      <Persona x={560} y={1080} h={600} t={t} seed={1} casco="legion" expr="triste" bD={t > 403.4 ? 80 : 10} cD={20} />
      {t > 403.4 && [0, 1, 2].map((i) => {
        const k = prog(t, 403.6 + i * 0.25, 404.2 + i * 0.25);
        return <Denario key={i} x={interpolate(k, [0, 1], [760, 1180])} y={interpolate(k, [0, 1], [640, 600]) - Math.sin(k * Math.PI) * 160} r={46} gira={t * 3} />;
      })}
      <Chip t={t} t0={400.14} text="HOW THE SYSTEM REALLY WORKED" color={C.violeta} x={160} y={140} size={50} t1={404.1} />
      <Grande t={t} t0={404.2} text="BRIBES" y={190} size={160} color="#fff" borde={C.rojo} />
      <Chip t={t} t0={405.3} text="TO SKIP THE WORST JOBS" color={C.rojo} x={960} y={1000} centro size={56} />
    </Escena>

    {/* 108 · pagás: no limpiás letrinas; pagás: día libre; no pagás: siempre a la zanja */}
    <Escena t={t} t0={407.2} t1={415.3} zoom={0.03} entra="corte" golpes={[407.3, 409.34, 411.28, 415.08]}>
      <AbsoluteFill style={{ background: "#1b1240" }} />
      <Trato t={t} t0={407.3} x={400} paga txt="SKIP LATRINE DUTY" bien />
      <Trato t={t} t0={409.34} x={960} paga txt="A DAY OF LEAVE" bien />
      <Trato t={t} t0={411.28} x={1520} paga={false} txt="ALWAYS CLEANING THE DITCH" bien={false} />
    </Escena>

    {/* 109 · dormido en la guardia nocturna: el fustuarium */}
    <Escena t={t} t0={415.3} t1={420.1} zoom={0.05} entra="iris" ix={960} iy={600} golpes={[416.7, 417.26, 419.6]}>
      <Cielo tipo="noche" />
      <Estrellas t={t} n={90} seed={104} alto={700} />
      <Astro x={1600} y={180} r={70} luna />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#2a1d14" }} />
      <Persona x={760} y={1040} h={560} t={t} seed={1} casco="legion" expr={t > 419.3 ? "miedo" : "dormido"} ladea={t > 419.3 ? 0 : 18} bD={10} />
      {t < 419.3 && <Zzz x={900} y={460} t={t} />}
      <Emote t={t} t0={419.4} tipo="excl" {...L(760, 1040, 560)} />
      <Chip t={t} t0={416.7} text="ASLEEP" color={C.violeta} x={160} y={140} size={60} t1={419.5} />
      <Chip t={t} t0={417.26} text="ON NIGHT WATCH" color={C.violeta} x={160} y={260} size={60} t1={419.5} />
      <Grande t={t} t0={419.6} text="FUSTUARIUM" y={300} size={150} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 110-111 · el tribuno te toca con un garrote... y te pegan tus compañeros de carpa */}
    <Escena t={t} t0={420.1} t1={427.8} zoom={0.05} entra="corte" golpes={[422.22, 424.78, 425.46, 426.14]}>
      <Cielo tipo="sangre" />
      <Rayos t={t} x={960} y={360} color="#ffb0a0" op={0.08} />
      <Colinas capas={["#4a1030", "#2a0a1e"]} base={800} seed={105} alto={40} />
      <Persona x={960} y={1060} h={460} t={t} seed={1} casco="legion" expr="miedo" bD={150} bI={150} cD={100} cI={100} />
      <Persona x={560} y={1060} h={620} t={t} seed={62} ropa={CENTURION} casco="centurion" expr="enojado" bD={t > 422 && t < 423 ? 60 : 110} cD={20} manoD={<g style={{ color: "#3a2010" }}><Garrote /></g>} />
      {t > 423.4 && Array.from({ length: 6 }, (_, i) => {
        const lado = i % 2 ? 1 : -1, x = 960 + lado * (300 + Math.floor(i / 2) * 210);
        return <Persona key={i} x={x} y={1060 + Math.floor(i / 2) * 20} h={480} t={t} seed={140 + i} casco="no" expr="triste" flip={lado > 0} aparece={423.6 + i * 0.15} bD={t > 426.1 ? 130 + Math.sin(t * 8 + i) * 30 : 30} cD={30} manoD={t > 426.1 ? <Palo largo={200} /> : undefined} />;
      })}
      <Chip t={t} t0={420.94} text="THE TRIBUNE" color={C.violeta} x={160} y={140} size={56} t1={425.4} />
      <Chip t={t} t0={423.42} text="YOUR OWN UNIT" color={C.ambar} tinta={C.noche} x={160} y={260} size={56} t1={425.4} />
      <Chip t={t} t0={424.48} text="TENT MATES" color={C.ambar} tinta={C.noche} x={160} y={380} size={56} t1={425.4} />
      <Grande t={t} t0={425.46} text="YOUR FRIENDS" y={240} size={130} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 112 · casi ninguno sobrevivía, y el que sí, nunca podía volver a casa */}
    <Escena t={t} t0={427.8} t1={432.5} entra="barrido" golpes={[429.22, 431.32]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #1b1240, #3a1a4a)" }} />
      <Craneo x={520} y={500} s={1.2} t={t} t0={428.3} />
      <Chip t={t} t0={428.5} text="MOST DID NOT SURVIVE" color={C.rojo} x={160} y={140} size={56} />
      {t > 430.2 && <div style={{ position: "absolute", left: 1100, top: 300, width: 560, height: 480, transform: `scale(${ent(t, 430.3)})` }}>
        <svg width={560} height={480} viewBox="0 0 560 480">
          <path d="M 80 220 L 280 60 L 480 220 Z" fill="#b5452c" /><rect x={120} y={210} width={320} height={230} fill="#e8b98a" /><rect x={240} y={310} width={80} height={130} fill="#6b3a1f" />
          <path d="M 40 40 L 520 440 M 520 40 L 40 440" stroke={C.rojo} strokeWidth={40} strokeLinecap="round" strokeDasharray={630} strokeDashoffset={630 * (1 - prog(t, 431.32, 431.6))} />
        </svg>
      </div>}
      <Chip t={t} t0={431.32} text="NEVER GO HOME" color={C.violeta} x={1140} y={860} size={56} />
    </Escena>

    {/* 113-114 · diezmado: uno de cada diez, por sorteo, muerto a manos de los otros nueve */}
    <Escena t={t} t0={432.5} t1={441.3} zoom={0.04} entra="corte" golpes={[435.6, 437.12, 438.56, 439.9]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #4a1030, #12061a 75%)" }} />
      <Grande t={t} t0={435.6} text="DECIMATION" y={170} size={150} color="#fff" borde={C.rojo} />
      {Array.from({ length: 10 }, (_, i) => {
        const marcado = i === 6 && t > 438.6;
        return <Persona key={i} x={150 + i * 180} y={1000} h={380} t={t} seed={170 + i} casco="legion" expr={marcado ? "miedo" : i === 6 || t < 438.6 ? "neutro" : "triste"} aparece={436.6 + i * 0.05} sombra={marcado ? C.rojo : undefined} />;
      })}
      {t > 437.6 && t < 439.3 && <Urna x={960} y={420} s={0.8} t={t} t0={437.7} tSaca={438.3} />}
      {t > 438.56 && <svg style={{ position: "absolute", left: 1230 - 100, top: 560 }} width={200} height={140}><path d="M 100 130 L 40 20 L 160 20 Z" fill={C.rojo} transform={`translate(0 ${Math.sin(t * 8) * 10})`} /></svg>}
      <Chip t={t} t0={437.12} text="EVERY TENTH MAN" color={C.ambar} tinta={C.noche} x={160} y={340} size={56} />
      <Chip t={t} t0={438.56} text="CHOSEN BY LOT" color={C.violeta} x={160} y={460} size={56} />
      <Chip t={t} t0={439.9} text="KILLED BY THE OTHER NINE" color={C.rojo} x={960} y={360} size={52} />
    </Escena>

    {/* 115-116 · raro, pero en el 71 a. C. Craso lo revivió contra Espartaco */}
    <Escena t={t} t0={441.3} t1={448.5} zoom={0.04} entra="sube" banda={C.oro} golpes={[442.02, 444.02, 447.36]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2d1b69, #8c1d34)" }} />
      <Rayos t={t} x={960} y={420} op={0.08} />
      <Chip t={t} t0={440.56} text="RARE..." color={C.violeta} x={160} y={140} size={56} t1={441.9} />
      <Cuenta t={t} t0={442.02} t1={442.6} de={1} a={71} x={960} y={250} size={200} color={C.oro} suf=" BC" />
      <Persona x={560} y={1120} h={680} t={t} seed={63} ropa={{ ...CENTURION, tunica: "#7a1fa3", tunica2: "#4a0f6a" }} casco="centurion" viejo expr="enojado" aparece={443.6} bD={120} cD={30} />
      <Chip t={t} t0={444.02} text="CRASSUS" color={C.rojo} x={760} y={560} size={64} />
      <Chip t={t} t0={445.36} text="VS HIS OWN LEGIONS" color={C.ambar} tinta={C.noche} x={960} y={1000} centro size={54} />
      <Persona x={1400} y={1120} h={620} t={t} seed={64} ropa={CIVIL(3)} expr="enojado" flip aparece={447.2} bD={140} cD={10} manoD={<Palo largo={240} />} />
      <Chip t={t} t0={447.36} text="SPARTACUS" color={C.teal} tinta={C.noche} x={1420} y={380} size={64} />
    </Escena>

    {/* 117 · así que sí pasó, y todos conocían la historia */}
    <Escena t={t} t0={448.5} t1={451.9} entra="corte" golpes={[449.3, 450.46]}>
      <AbsoluteFill style={{ background: C.rojo }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.12} />
      <Grande t={t} t0={448.56} text="IT HAPPENED" y={380} size={170} color="#fff" />
      <Chip t={t} t0={450.14} text="AND EVERYONE KNEW THE STORY" color="#2a1530" x={960} y={640} centro size={60} />
    </Escena>

    {/* 118 · siendo justos, la mayoría de los días eran simplemente aburridos */}
    <Escena t={t} t0={451.9} t1={456.2} entra="barrido" golpes={[455.42]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#b7c99a", "#a3b884"]} base={700} seed={106} alto={40} />
      <Suelo y={880} a="#c8b88a" b="#a89868" />
      <Fuerte x={1400} y={680} s={0.6} w={900} />
      <Persona x={660} y={1020} h={600} t={t} seed={1} casco="legion" expr={t > 455.2 ? "dormido" : "neutro"} ladea={t > 455.2 ? 12 : 0} bD={10} manoD={<Palo largo={300} />} />
      <Chip t={t} t0={452.0} text="TO BE FAIR..." color={C.violeta} x={160} y={140} size={56} />
      <Grande t={t} t0={455.42} text="BORING" y={300} size={190} color="#b7b0c8" borde="#5a5470" />
      {t > 455.4 && <Zzz x={820} y={420} t={t} />}
    </Escena>

    {/* 119-120 · la planilla de guardias de un campamento en Egipto */}
    <Escena t={t} t0={456.2} t1={472.0} zoom={0.04} entra="iris" ix={960} iy={540} golpes={[458.22, 461.92, 463.0, 463.92, 465.26, 469.12]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #ffd27a, #c97a2a 75%)" }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.08} />
      <Papiro t={t} x={720} y={520} w={760} t0={456.5} titulo="DUTY ROSTER · EGYPT" tacha={false} items={[
        { txt: "GUARD DUTY", t0: 461.92 }, { txt: "GATE DUTY", t0: 463.0 }, { txt: "BATH DUTY", t0: 463.92 }, { txt: "CENTURION'S BOOTS", t0: 465.26 }, { txt: "TO THE DUNG", t0: 469.12 },
      ]} />
      <Persona x={1520} y={1100} h={560} t={t} seed={1} casco="legion" expr={t > 469.12 ? "miedo" : "triste"} flip bD={t > 469.2 ? 150 : 20} bI={t > 469.2 ? 150 : 20} cD={60} cI={60} />
      <Emote t={t} t0={469.3} tipo="susto" {...L(1520, 1100, 560)} />
      <Chip t={t} t0={458.5} text="IT SURVIVES" color={C.violeta} x={160} y={140} size={56} t1={461.6} />
      <Chip t={t} t0={470.16} text="HALF THE WORLD" color={C.violeta} x={1200} y={140} size={52} />
      <Chip t={t} t0={470.86} text="...NOT FOR GLORY" color={C.rojo} x={1200} y={260} size={52} />
    </Escena>

    {/* 121 · la cruzaste para palear */}
    <Escena t={t} t0={472.0} t1={473.7} entra="corte" golpes={[472.95]}>
      <AbsoluteFill style={{ background: "#6b3a1f" }} />
      <Rayos t={t} x={960} y={540} color="#ffb070" op={0.1} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - ent(t, 472.4)) * 700}px)` }}><Pala x={960} y={680} s={1.0} rot={-15} /></div>
      <Grande t={t} t0={472.95} text="TO SHOVEL" y={200} size={170} color="#fff" borde="#2a1530" />
    </Escena>

    {/* 122 · salvo que tuvieras un oficio */}
    <Escena t={t} t0={473.7} t1={476.3} entra="zoom" golpes={[475.54]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2ec4d6, #1b1240 75%)" }} />
      <Rayos t={t} x={960} y={460} color="#fff" op={0.14} />
      <Particulas t={t} tipo="destellos" n={40} seed={107} />
      <Persona x={960} y={1120} h={760} t={t} seed={1} casco="legion" expr={t > 475.4 ? "feliz" : "neutro"} salta={475.5} bD={t > 475.4 ? 150 : 10} cD={40} />
      <Emote t={t} t0={475.5} tipo="brillos" {...L(960, 1120, 760)} s={1.4} />
      <Chip t={t} t0={473.75} text="UNLESS..." color={C.violeta} x={160} y={140} size={60} t1={475.4} />
      <Grande t={t} t0={475.54} text="YOU HAD A SKILL" y={200} size={120} color="#fff" borde={C.teal} />
    </Escena>

    {/* 123-124 · la lista de especialistas: los inmunes */}
    <Escena t={t} t0={476.3} t1={490.6} zoom={0.03} entra="sube" banda={C.teal} golpes={[479.18, 482.13, 483.25, 484.07, 485.07, 486.06, 488.86]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #1b4060, #2d1b69)" }} />
      <Rayos t={t} x={960} y={540} op={0.06} />
      {t < 481.9 && <>
        <Grande t={t} t0={479.18} text="IMMUNES" y={420} size={220} color="#fff" borde={C.teal} />
        <Chip t={t} t0={477.56} text="SPECIALISTS" color={C.teal} tinta={C.noche} x={960} y={160} centro size={60} />
        <Chip t={t} t0={480.31} text="EXCUSED FROM THE WORST CHORES" color={C.lima} tinta={C.noche} x={960} y={700} centro size={56} />
      </>}
      {t >= 481.9 && <>
        <Inmune t={t} t0={482.13} i={0} of="agrimensor" label="SURVEYORS" />
        <Inmune t={t} t0={483.25} i={1} of="escriba" label="CLERKS" />
        <Inmune t={t} t0={484.07} i={2} of="herrero" label="BLACKSMITHS" />
        <Inmune t={t} t0={485.07} i={3} of="arquero" label="BOW MAKERS" />
        <Inmune t={t} t0={486.06} i={4} of="medico" label="ORDERLIES" />
        <Inmune t={t} t0={488.86} i={5} of="animales" label="SACRED ANIMALS" />
      </>}
    </Escena>

    {/* 125 · ¿te acordás de las preguntas en la mesa de reclutamiento? por esto */}
    <Escena t={t} t0={490.6} t1={495.6} zoom={0.05} entra="barrido" golpes={[491.94, 495.06]}>
      <Cielo tipo="dia" />
      <Colinas capas={["#7fb06a", "#5a9050"]} base={700} seed={108} alto={60} />
      <Suelo y={880} a="#c8b88a" b="#a89868" />
      <Persona x={1400} y={1040} h={560} t={t} seed={60} ropa={CENTURION} casco="centurion" expr="neutro" flip habla={t < 494} bD={40} cD={60} />
      <Persona x={560} y={1040} h={520} t={t} seed={1} expr="sorpresa" />
      <Emote t={t} t0={491.2} tipo="preg" {...L(560, 1040, 520)} />
      <div style={{ position: "absolute", left: 760, top: 300, padding: "24px 36px", borderRadius: 40, background: "#fff", border: "8px solid #2a1530", fontFamily, fontWeight: 700, fontSize: 52, color: "#2a1530", transform: `scale(${ent(t, 492.4)})`, transformOrigin: "100% 100%" }}>WHAT DO YOU DO FOR A LIVING?</div>
      <Chip t={t} t0={491.6} text="REMEMBER?" color={C.violeta} x={160} y={140} size={60} />
      <Grande t={t} t0={495.06} text="THIS IS WHY" y={560} size={140} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 126 · leer, escribir o arreglar una espada valía más vivo */}
    <Escena t={t} t0={495.6} t1={502.4} zoom={0.04} entra="corte" golpes={[496.38, 497.19, 497.98, 499.24, 501.65]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffd27a, #e2557a 60%, #2d1b69)" }} />
      <Rayos t={t} x={960} y={420} color="#fff" op={0.1} />
      <Persona x={960} y={1120} h={760} t={t} seed={1} casco="legion" expr="orgullo" bD={t > 499.2 ? 130 : 20} cD={30} />
      {([[496.38, "READ", C.teal, 380, 300], [497.19, "WRITE", C.violeta, 380, 470], [497.98, "FIX A SWORD", C.ambar, 1540, 380]] as const).map(([t0, txt, col, x, y]) => <Chip key={txt} t={t} t0={t0} text={txt} color={col} tinta={col === C.ambar ? C.noche : undefined} x={x} y={y} centro size={64} />)}
      {t > 499.24 && Array.from({ length: 14 }, (_, i) => <Moneda key={i} x={300 + ((i * 137) % 1320)} y={((t - 499.24) * 700 + i * 90) % 1200 - 120} r={40} t={t} />)}
      <Grande t={t} t0={499.24} text="WORTH MORE ALIVE" y={160} size={110} color="#fff" borde="#3fa34d" />
      <Chip t={t} t0={501.3} text="AWAY FROM THE DUNG" color="#3fa34d" x={960} y={1000} centro size={56} />
    </Escena>

    {/* 127 · y después, la soledad */}
    <Escena t={t} t0={502.4} t1={504.3} entra="iris" ix={960} iy={700} golpes={[503.15]}>
      <AbsoluteFill style={{ background: "#0a0818" }} />
      <div style={{ position: "absolute", left: 960 - 420, top: 300, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,160,255,.3), transparent 70%)" }} />
      <Persona x={960} y={1000} h={420} t={t} seed={1} casco="legion" expr="triste" ladea={-6} />
      <Emote t={t} t0={503.4} tipo="lagrimas" {...L(960, 1000, 420)} />
      <Grande t={t} t0={503.15} text="LONELINESS" y={240} size={150} color="#8a9ad8" borde="#1b1240" />
    </Escena>

    {/* 128-129 · Vindolanda: cientos de tablillas de madera, cartas de hace casi 2000 años */}
    <Escena t={t} t0={504.3} t1={515.3} zoom={0.04} entra="corte" golpes={[504.44, 507.3, 509.06, 510.75, 513.86]}>
      {t < 508.0
        ? <MapaPuntos t={t} pulsa={["VINDOLANDA"]} t0Pulsa={504.44} vuela={{ n: "VINDOLANDA", z: 2.6, t: [504.4, 506.4] }} />
        : <>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #6b4a2a, #3a2410)" }} />
          <Rayos t={t} x={960} y={300} color="#ffd27a" op={0.1} />
          {Array.from({ length: 24 }, (_, i) => {
            const t0 = 509.06 + i * 0.07;
            return t > t0 && <Tablilla key={i} x={160 + (i % 8) * 230} y={420 + Math.floor(i / 8) * 220} s={0.42} rot={((i * 37) % 20) - 10} t={t} t0={t0} texto={["~~~ ~~", "~ ~~~~"]} />;
          })}
        </>}
      <Chip t={t} t0={504.44} text="VINDOLANDA" color={C.violeta} x={160} y={140} size={60} t1={508.0} />
      <Chip t={t} t0={505.88} text="NEAR HADRIAN'S WALL" color={C.teal} tinta={C.noche} x={160} y={260} size={52} t1={508.0} />
      <Chip t={t} t0={510.39} text="WOODEN WRITING TABLETS" color={C.ambar} tinta={C.noche} x={960} y={160} centro size={56} />
      <Cuenta t={t} t0={513.86} t1={514.4} de={0} a={2000} x={960} y={980} size={110} color="#fff" suf=" YEARS AGO" />
    </Escena>

    {/* 130 · tampoco hablan de gloria */}
    <Escena t={t} t0={515.3} t1={517.4} entra="corte" golpes={[516.2]}>
      <AbsoluteFill style={{ background: "#2d1b69" }} />
      <Tablilla x={960} y={600} s={1.3} t={t} t0={515.3} texto={["GLORY"]} />
      <svg style={{ position: "absolute", left: 660, top: 440 }} width={600} height={320}><path d="M 20 160 L 580 160" stroke={C.rojo} strokeWidth={40} strokeLinecap="round" strokeDasharray={560} strokeDashoffset={560 * (1 - prog(t, 516.2, 516.5))} /></svg>
      <Chip t={t} t0={515.6} text="NOT ABOUT GLORY EITHER" color={C.rojo} x={960} y={180} centro size={60} />
    </Escena>

    {/* 131 · «te mandé medias, dos pares de sandalias y dos calzones» */}
    <Escena t={t} t0={517.4} t1={524.2} zoom={0.04} entra="sube" banda={C.ambar} golpes={[520.29, 521.74, 523.29]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #fff3c4, #ffb070 75%)" }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.2} />
      <Tablilla x={560} y={520} s={1.0} t={t} t0={517.6} texto={["LETTER", "FROM HOME"]} />
      <Ropa k="medias" x={1000} y={420} s={1.0} t={t} t0={520.29} rot={-8} />
      {[0, 1].map((i) => <Ropa key={i} k="sandalia" x={1360 + i * 160} y={420 + i * 30} s={0.8} t={t} t0={521.74 + i * 0.12} rot={i * 14} />)}
      {[0, 1].map((i) => <Ropa key={i} k="calzon" x={1120 + i * 260} y={760} s={0.85} t={t} t0={523.29 + i * 0.12} rot={i * -10} />)}
      <Chip t={t} t0={520.29} text="SOCKS" color={C.violeta} x={1000} y={600} centro size={52} />
      <Chip t={t} t0={521.74} text="2 PAIRS OF SANDALS" color={C.teal} tinta={C.noche} x={1430} y={600} centro size={46} />
      <Chip t={t} t0={523.29} text="2 PAIRS OF UNDERPANTS" color={C.rojo} x={1250} y={960} centro size={50} />
    </Escena>

    {/* 132 · otro pide más cerveza porque sus hombres se quedaron sin */}
    <Escena t={t} t0={524.2} t1={528.3} zoom={0.05} entra="barrido" golpes={[525.86, 527.51]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #e9a92a, #b5662a)" }} />
      <Rayos t={t} x={1260} y={520} color="#fff" op={0.14} />
      <Persona x={600} y={1100} h={700} t={t} seed={65} ropa={CENTURION} casco="centurion" expr="triste" habla bD={110} cD={70} />
      {[0, 1, 2].map((i) => <Comida key={i} k="jarra" x={1120 + i * 230} y={560 + (i % 2) * 40} s={1.1} t={t} t0={525.86 + i * 0.15} rot={t > 527.5 ? 90 : 0} />)}
      <Grande t={t} t0={525.86} text="MORE BEER!" y={200} size={150} color="#fff" borde="#7a3d14" />
      <Chip t={t} t0={527.34} text="HIS MEN RAN OUT" color={C.rojo} x={1300} y={900} size={56} />
    </Escena>

    {/* 133 · un informe llama a los locales «Brittunculi»: britanitos miserables */}
    <Escena t={t} t0={528.3} t1={537.3} zoom={0.04} entra="corte" golpes={[532.46, 535.58, 536.27]}>
      <Cielo tipo="dia" />
      <Lluvia t={t} n={60} op={0.25} />
      <Colinas capas={["#6a8a5a", "#4a6a40"]} base={700} seed={109} alto={60} />
      <Tablilla x={560} y={520} s={1.2} t={t} t0={528.5} texto={["REPORT", "OFFICER"]} />
      {Array.from({ length: 4 }, (_, i) => <Persona key={i} x={1180 + i * 170} y={1060} h={300 + (i % 2) * 40} t={t} seed={180 + i} ropa={CIVIL(i + 2)} expr={t > 535.6 ? "enojado" : "neutro"} aparece={531.0 + i * 0.1} />)}
      <Grande t={t} t0={532.46} text="BRITTUNCULI" y={200} size={140} color="#fff" borde={C.violeta} />
      <Chip t={t} t0={534.32} text="ROUGHLY TRANSLATES AS..." color={C.violeta} x={960} y={340} centro size={48} t1={535.5} />
      <Chip t={t} t0={535.58} text="&quot;WRETCHED LITTLE BRITONS&quot;" color={C.rojo} x={960} y={340} centro size={56} />
    </Escena>

    {/* 134-135 · imaginalo: tenés 26, llueve de costado, a 2000 km de casa... la única buena noticia: medias */}
    <Escena t={t} t0={537.3} t1={547.17} zoom={0.05} entra="iris" ix={960} iy={600} golpes={[538.22, 539.79, 541.08, 544.6, 546.39]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #3a4a5a, #1b2a3a)" }} />
      <Lluvia t={t} n={160} angulo={45} op={0.6} />
      <Colinas capas={["#2a3a3a", "#1a2a2a"]} base={760} seed={110} alto={50} />
      <Fuerte x={1500} y={700} s={0.5} w={900} piedra />
      <Persona x={760} y={1060} h={620} t={t} seed={1} casco="legion" expr={t > 545.4 ? "feliz" : "triste"} inclina={-10} bD={t > 545.6 ? 140 : 20} cD={40} />
      {t > 545.6 && <Ropa k="medias" x={L(760, 1060, 620).x + 260} y={L(760, 1060, 620).y - 40} s={0.8} t={t} t0={545.7} rot={-12} />}
      <Emote t={t} t0={539.9} t1={545.3} tipo="lagrimas" {...L(760, 1060, 620)} />
      <Emote t={t} t0={545.8} tipo="brillos" {...L(760, 1060, 620)} s={1.3} />
      <Chip t={t} t0={537.41} text="PICTURE IT" color={C.violeta} x={160} y={140} size={56} t1={538.1} />
      <Cuenta t={t} t0={538.22} t1={538.6} de={18} a={26} x={420} y={260} size={120} color="#fff" pre="AGE " />
      <Chip t={t} t0={539.79} text="RAINING SIDEWAYS" color={C.teal} tinta={C.noche} x={1100} y={200} size={56} />
      <Cuenta t={t} t0={541.08} t1={541.7} de={0} a={2000} x={1180} y={380} size={84} color={C.oro} suf=" KM FROM HOME" />
      <Chip t={t} t0={544.36} text="THE ONLY GOOD NEWS:" color={C.ambar} tinta={C.noche} x={1100} y={860} size={52} />
      <Chip t={t} t0={546.0} text="FRESH SOCKS" color={C.lima} tinta={C.noche} x={1240} y={980} size={60} />
    </Escena>
  </>
);
