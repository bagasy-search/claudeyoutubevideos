import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Casa } from "./kit";
import { Fuerte, Barco, Campana, Soldadito } from "./kit2";
import { Persona, CIVIL, Expr } from "./persona";
import { Exterior } from "./escenas4";
import { TOP, BASE, K, Cam, Pal, Plano } from "./mundo";
import { Gr, Cu, Ch, T, ck, Yo, Otro, Lapida2, Salon, Pin, gesto, TUNGRO } from "./kit3";

// EL GIRO + CIERRE (822-919,6 s). Los que cuidaban el muro también eran "bárbaros": el muro de Roma contra los
// bárbaros estaba hecho de bárbaros, y funcionó casi 300 años. Se quedaron: la lápida de Regina en South Shields que
// le hizo Barates de Palmira, con la línea en arameo; las salas de madera de Birdoswald sobre el fuerte viejo; "para
// entonces era su casa". CTA: suscribirse + campana, el barco ballenero, y qué trampa te agarraba primero.
const D = 822;
const FILA = 22000;
const ESTE = 45300;

export const keys8: K[] = [
  [822.2, 22000, 430, 0.042], [822.9, 22000, 430, 0.043], ck("remember who stood", D, FILA, 450, 1.25), ck("at the beginning", D, FILA, 470, 1.1),
  ck("and those men did", D, FILA, 500, 0.9), ck("they stayed", D, FILA, 500, 1.0), ck("at south shields", D, 34000, 500, 0.09),
  ck("at the eastern end", D, ESTE + 300, 560, 0.5), ck("a syrian and a british", D, ESTE, 720, 1.15), ck("on the wall nobody wanted", D, ESTE, 700, 0.9),
  ck("and when rome finally left", D, ESTE + 300, 600, 0.42), ck("nobody wanted to guard", D, ESTE - 300, 600, 0.3), ck("some of them simply could not", D, ESTE - 300, 680, 1.1),
  ck("because by then it was home", D, ESTE - 350, 680, 1.5), ck("if you enjoyed surviving", D, ESTE + 200, 640, 0.5), [919.6, ESTE + 300, 620, 0.42],
];
export const amb8: [number, Pal][] = [[822.2, "dia"], [845.4, "dia"], [849.2, "gris"], [869.3, "calido"], [875.2, "atardecer"], [895.9, "calido"], [905.5, "atardecer"]];
export const lluvia8: [number, number][] = [[822.2, 0.1], [845.4, 0], [849.2, 0.2], [869.3, 0], [919.6, 0]];
export const sol8: [number, number, number, boolean?][] = [[822.2, 1400, 180], [869.3, 1500, 360], [895.9, 1500, 520], [919.6, 1450, 620]];

const ORIG = ["BELGIANS", "DUTCH", "SPANIARDS", "SYRIANS", "MOORS", "BOATMEN FROM IRAQ"];
const ORIGW = ["belgians", "dutch", "spaniards", "syrians", "moors", "boatmen from iraq"];

// ── poses distintas para la fila de orígenes: cada uno reacciona a SU nombre y después hace otra cosa
type PoseP = { expr?: Expr; habla?: boolean; bI?: number; bD?: number; cI?: number; cD?: number; inclina?: number; salta?: number; ladea?: number; mira?: number };
const poseFila = (i: number, t: number): PoseP => {
  const n = T(ORIGW[i], D), bb = T("all of these men were", D);
  const ola = (f = 12) => 150 + Math.sin(t * f) * 22;
  if (t < n) return { ...gesto(t, [[0, "lee"]]), expr: "neutro", mira: i % 2 ? -0.3 : 0.3, inclina: 0 };
  if (t < n + 1.4) {
    // el beat de su nombre
    return ([
      { bD: 150, cD: 20, expr: "feliz", habla: true, salta: n },
      { ...gesto(t, [[n, "sorpresa"]]) },
      { bD: 40, cD: 120, bI: 40, cI: 120, expr: "orgullo", habla: true, inclina: -4 },
      { ...gesto(t, [[n, "festeja"]]) },
      { ...gesto(t, [[n, "señala"]]), mira: 0.6 },
      { ...gesto(t, [[n, "cava"]]), expr: "feliz" },
    ] as PoseP[])[i];
  }
  if (t < bb) {
    // entre nombres: el belga saluda al holandés y el holandés le devuelve el saludo
    return ([
      { bD: ola(), cD: 30, expr: "feliz", mira: 0.8, habla: true },
      { bI: ola(11), cI: 30, expr: "feliz", mira: -0.8, habla: true },
      { ...gesto(t, [[n, "habla"]]), mira: 0.5 },
      { bD: 40, cD: 120, bI: 40, cI: 120, expr: "orgullo", inclina: -4 },
      { ...gesto(t, [[n, "encoge"]]), expr: "feliz" },
      { ...gesto(t, [[n, "festeja"]]) },
    ] as PoseP[])[i];
  }
  // "barbarians too": cada uno se lo toma distinto
  return [
    { ...gesto(t, [[bb, "sorpresa"]]) },
    { ...gesto(t, [[bb, "miedo"]]) },
    { ...gesto(t, [[bb, "niega"]]) },
    { ...gesto(t, [[bb, "encoge"]]) },
    { ...gesto(t, [[bb, "enojado"]]) },
    { ...gesto(t, [[bb, "tiembla"]]) },
  ][i];
};

const PAN = <g><ellipse cx={0} cy={10} rx={50} ry={30} fill="#d9a050" stroke="#8a5a20" strokeWidth={6} />{[-20, 0, 20].map((x) => <path key={x} d={`M ${x - 8} -6 L ${x + 8} 18`} stroke="#8a5a20" strokeWidth={5} strokeLinecap="round" />)}</g>;
const BARATES = { ...CIVIL(1), tunica: "#c9a23d", tunica2: "#8f7025" };
const REGINA = { ...CIVIL(4), tunica: "#3d7fc9", tunica2: "#25548f", pelo: "#6b3a1f" };

// 14:28 · la pareja frente a su casa al atardecer: él le alcanza pan, se dan la mano
const Pareja: React.FC<{ t: number }> = ({ t }) => {
  const sy = T("a syrian and a british", D), ed = T("on the edge of the world", D), bl = T("building a life", D), tg = T("together", 872), nw = T("on the wall nobody wanted", D);
  const pasa = prog(t, bl + 0.3, tg);
  const junta = t > tg;
  const ex = 760, ey = 1040, eh = 500, ax = 1180, ah = 470;
  const balanceo = junta ? Math.sin((t - tg) * 4) * 6 : 0;
  const panX = interpolate(pasa, [0, 1], [ex + 200, ax - 190]), panY = 790 - Math.sin(pasa * Math.PI) * 40;
  const ella = !junta;
  return (
    <Exterior t={t} tono="atardecer" horizonte={620}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 150 - 40} y={640 - (i % 2) * 18} width={130} height={70 + (i % 2) * 18} fill="#c9b8a0" opacity={0.85} />)}
        <path d="M -20 1080 L -20 990 Q 960 960 1940 990 L 1940 1080 Z" fill="#b08a5a" />
      </svg>
      <Casa x={1640} y={1000} s={1.7} tono="#e8b98a" techo="#8a5a2a" luz />
      {[0, 1, 2].map((i) => { const k = ((t - sy) * 0.35 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 1740 + k * 40, top: 520 - k * 280, width: 60 + k * 80, height: 60 + k * 80, borderRadius: "50%", background: "#e6e0d8", opacity: 0.7 * (1 - k) }} />; })}
      {/* luz cálida de atardecer que baña a los dos */}
      <div style={{ position: "absolute", left: 300, top: 120, width: 1300, height: 1000, background: "radial-gradient(ellipse at 60% 30%, rgba(255,190,110,.35), rgba(255,170,90,0) 60%)", mixBlendMode: "screen" }} />
      <Persona x={ex} y={ey} h={eh} t={t} seed={430} ropa={BARATES} mira={t > ed && t < bl ? -0.7 : 0.7}
        {...gesto(t, [[sy - 0.2, "habla"], [ed, "habla"], [bl, "habla"], [tg, "festeja"]])}
        {...(t > ed && t < bl ? { bI: 110, cI: 5, bD: 20, cD: 20, habla: true } : {})}
        {...(t > bl && !junta ? { bD: 72, cD: 8, expr: "feliz" as const } : {})}
        {...(junta ? { bD: 72 + balanceo, cD: 8, bI: 20, cI: 20, expr: "feliz" as const, salta: undefined, inclina: 4 } : {})} manoD={t > bl && pasa < 0.05 ? PAN : undefined} />
      <Persona x={ax} y={ey} h={ah} t={t} seed={431} ropa={REGINA} mujer flip mira={t > ed && t < bl ? -0.7 : 0.6}
        {...gesto(t, [[sy - 0.2, "habla"], [ed, "lee"], [bl, "sorpresa"], [tg, "festeja"]])}
        {...(t > bl + 0.4 && ella ? { bD: 70, cD: 10, expr: "feliz" as const, salta: undefined } : {})}
        {...(junta ? { bD: 72 - balanceo, cD: 8, bI: 35, cI: 115, expr: "feliz" as const, salta: undefined, inclina: 4 } : {})} manoI={junta ? PAN : undefined} />
      {pasa > 0.05 && pasa < 1 && <svg style={{ position: "absolute", left: panX - 60, top: panY - 40, overflow: "visible" }} width={120} height={80} viewBox="-60 -40 120 80">{PAN}</svg>}
      {junta && <Emote t={t} t0={tg} tipo="brillos" x={(ex + ax) / 2} y={600} s={0.9} />}
      {junta && <div style={{ position: "absolute", left: (ex + ax) / 2 - 40, top: 610 - prog(t, tg, tg + 1.5) * 90, fontSize: 80, transform: `scale(${ent(t, tg)})`, opacity: 1 - prog(t, tg + 1.2, tg + 1.8) }}>❤</div>}
      {t < nw && <Chip t={t} t0={sy} text="A SYRIAN + A BRITON" color={C.violeta} x={960} y={150} centro size={56} />}
    </Exterior>
  );
};

// 14:58 · plano medio: el veterano deja la lanza, se da vuelta y abraza a su familia; la cámara se aleja recién al final
const Familia: React.FC<{ t: number }> = ({ t }) => {
  const ng = T("nobody wanted to guard", 893), at = T("and then when nobody", 896), cl = T("some of them simply could not", D), hm = T("because by then it was home", D);
  const vuelve = t > at + 0.5;
  const vx = interpolate(t, [cl, cl + 1.0], [560, 790], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const llegan = (d: number) => prog(t, at + 0.6 + d, cl + 0.6 + d);
  const wx = interpolate(llegan(0), [0, 1], [1600, 1020]), k1 = interpolate(llegan(0.15), [0, 1], [1650, 920]), k2 = interpolate(llegan(0.3), [0, 1], [1700, 660]);
  const abraza = t > hm;
  const glow = prog(t, hm, hm + 1.0);
  const aleja = prog(t, hm + 1.0, hm + 2.2);
  const lanzaSuelta = t > at;
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + 0.1 * prog(t, ng, hm + 0.6) - 0.1 * aleja})`, transformOrigin: "45% 70%", background: "#ffb070" }}>
      <Exterior t={t} tono="atardecer" horizonte={640}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 200 - 60} y={760} width={140} height={160} rx={6} fill={["#c9b8a0", "#bfae94"][i % 2]} stroke="#a89878" strokeWidth={5} />)}
          <rect x={-60} y={880} width={1240} height={60} fill="#b5a48a" />
          <path d="M -20 1080 L -20 1000 Q 960 970 1940 1000 L 1940 1080 Z" fill="#b08a5a" />
        </svg>
        <Casa x={1660} y={1010} s={1.7} tono="#e8b98a" techo="#8a5a2a" luz />
        {[0, 1, 2].map((i) => { const k = ((t - ng) * 0.35 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 1760 + k * 40, top: 520 - k * 280, width: 60 + k * 80, height: 60 + k * 80, borderRadius: "50%", background: "#e6e0d8", opacity: 0.7 * (1 - k) }} />; })}
        {/* la lanza: en la mano mientras mira al norte; después queda apoyada en el muro */}
        {lanzaSuelta && <svg style={{ position: "absolute", left: 300, top: 560, overflow: "visible" }} width={60} height={420}><g transform={`rotate(${-12 * prog(t, at, at + 0.4)} 30 420)`}><rect x={26} y={30} width={10} height={390} fill="#7a4a1e" /><path d="M 31 0 L 44 40 L 18 40 Z" fill="#c8ccd4" stroke="#7d8796" strokeWidth={3} /></g></svg>}
        <Persona x={wx} y={1040} h={470} t={t} seed={431} ropa={REGINA} mujer flip camina={llegan(0) > 0 && llegan(0) < 1 ? 1.3 : 0}
          {...gesto(t, [[at + 0.6, "camina"], [cl + 0.6, "festeja"]])} {...(abraza ? { bD: 80, cD: 50, bI: 20, expr: "feliz" as const, salta: undefined, inclina: 8 } : {})} />
        <Persona x={vx} y={1040} h={520} t={t} seed={3} ropa={TUNGRO} viejo malla capa="#3f6b2a" pantalon="#6b4a2f" flip={!vuelve} camina={t > cl && t < cl + 1.0 ? 1.2 : 0}
          {...gesto(t, [[ng - 1, "lee"], [at, "encoge"], [at + 0.5, "sorpresa"], [cl, "festeja"]])}
          {...(t < at ? { bD: 12, cD: 0 } : {})} {...(t > cl && !abraza ? { bD: 120, cD: 20, bI: 120, cI: 20, expr: "feliz" as const, salta: undefined } : {})}
          {...(abraza ? { bD: 70, cD: 95, bI: 70, cI: 95, expr: "feliz" as const, salta: undefined, inclina: 0, ladea: 6 } : {})}
          manoD={!lanzaSuelta ? <g><rect x={-5} y={-260} width={10} height={420} fill="#7a4a1e" /><path d="M 0 -300 L 13 -260 L -13 -260 Z" fill="#c8ccd4" /></g> : undefined} />
        <Persona x={k1} y={1040} h={300} t={t} seed={442} ropa={CIVIL(5)} flip camina={llegan(0.15) > 0 && llegan(0.15) < 1 ? 1.8 : 0}
          {...gesto(t, [[at + 0.75, "camina"], [cl + 0.75, "festeja"]])} {...(abraza ? { bD: 100, cD: 40, bI: 100, cI: 40, expr: "feliz" as const, salta: undefined } : {})} />
        <Persona x={k2} y={1040} h={270} t={t} seed={441} ropa={CIVIL(3)} flip={t < cl + 0.9} camina={llegan(0.3) > 0 && llegan(0.3) < 1 ? 1.8 : 0}
          {...gesto(t, [[at + 0.9, "camina"], [cl + 0.9, "festeja"]])} {...(abraza ? { bD: 110, cD: 40, bI: 110, cI: 40, expr: "feliz" as const, salta: undefined } : {})} />
        {abraza && <Emote t={t} t0={hm + 0.1} tipo="brillos" x={vx + 80} y={560} s={1} />}
        <div style={{ position: "absolute", left: 200, top: 100, width: 1500, height: 1000, background: "radial-gradient(ellipse at 45% 55%, rgba(255,200,120,.45), rgba(255,170,90,0) 60%)", opacity: glow, mixBlendMode: "screen" }} />
      </Exterior>
    </AbsoluteFill>
  );
};

// 1) el muro hecho de bárbaros: ladrillos con los orígenes que caen uno por uno
const Ladrillos: React.FC<{ t: number }> = ({ t }) => {
  const a = T("romes last line", D), b = T("built out of barbarians", D);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#9fd0f0,#e8f4fb 70%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "#7fa05a" }} />
      {Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) => {
        const i = r * 6 + c;
        const t0 = a + 0.1 + i * 0.07;
        if (t < t0) return null;
        const k = prog(t, t0, t0 + 0.35);
        const x = 300 + c * 220 + (r % 2) * 110, y = 800 - r * 100;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y - (1 - k) * 600, width: 210, height: 92, borderRadius: 10, background: ["#c9b28a", "#d8c29a", "#bfa67c"][i % 3], border: "5px solid #8a7450", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 34, color: "#5a4020" }}>
            {ORIG[i % 6].replace("BOATMEN FROM ", "")}
          </div>
        );
      }))}
      <Persona x={170} y={1030} h={400} t={t} seed={95} ropa={{ ...CIVIL(0), tunica: "#c81d2e", tunica2: "#8a1420" }} casco="centurion" malla capa="#7a2a9a" {...gesto(t, [[a, "señala"], [b, "sorpresa"], [b + 1.6, "festeja"]])} />
      <Chip t={t} t0={a} t1={b} text="ROME'S LAST LINE OF DEFENSE…" color={C.violeta} x={960} y={140} centro size={56} />
      {t > b && <Grande t={t} t0={b} text="BUILT OUT OF BARBARIANS." y={150} size={96} color={C.rojo} borde="#fff" />}
      <Cu t={t} w="and it worked for almost" d={D} de={0} a={300} sube={1.0} dur={2.4} x={960} y={985} size={110} pre="~" suf=" YEARS" color={C.oro} />
    </AbsoluteFill>
  );
};
// 2) la lápida de Regina, el viaje desde Palmira y la línea en arameo
const Regina: React.FC<{ t: number }> = ({ t }) => {
  const pal = T("a man from palmyra", D), lat = T("underneath the latin", D), ar = T("in his own language", D), tr = T("regina", 865);
  const mapa = t > pal && t < lat;
  return (
    <AbsoluteFill style={{ background: mapa ? "radial-gradient(circle at 50% 50%, #3d7fc9, #1b3a6a 85%)" : "radial-gradient(circle at 40% 30%, #8a7466, #3a2a3a 90%)" }}>
      {!mapa && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${interpolate(t, [849, 869], [1, 1.08])})`, transformOrigin: "620px 560px" }}>
          {/* piso de pasto y luz cálida que cae desde arriba sobre la lápida */}
          <div style={{ position: "absolute", left: -100, right: -100, top: 960, bottom: -100, background: "#4a5a3a" }} />
          <svg style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }} width={1920} height={1080}>
            <defs><linearGradient id="rayoR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd08a" stopOpacity={0.75} /><stop offset="1" stopColor="#ffb060" stopOpacity={0.05} /></linearGradient></defs>
            <polygon points={`${520 + Math.sin(t * 0.6) * 10},-20 ${820 + Math.sin(t * 0.6) * 10},-20 1120,1000 260,1000`} fill="url(#rayoR)" />
            {Array.from({ length: 16 }, (_, i) => { const k = ((i * 0.37 + t * 0.05) % 1); return <circle key={i} cx={420 + ((i * 97) % 520) + Math.sin(t + i) * 12} cy={60 + k * 880} r={3 + (i % 3)} fill="#fff2c8" opacity={0.6 * Math.sin(Math.PI * k)} />; })}
          </svg>
          <Lapida2 x={620} y={560} s={1.1} lineas={["D · M · REGINA", "LIBERTA ET", "CONIUGE"]} pie="BARATES" />
          <Persona x={980 - 40 * (1 - prog(t, 849.4, 850.6))} y={1010} h={440} t={t} seed={432} ropa={REGINA} mujer flip camina={t < 850.6 ? 1.2 : 0} opacity={1 - 0.75 * prog(t, T("who died at 30", D), T("who died at 30", D) + 1.0)} mira={-0.6}
            {...gesto(t, [[849.4, "camina"], [T("it belongs to a woman", D), "lee"], [T("a former slave", D), "triste"]])}
            {...(t > T("it belongs to a woman", D) ? { bD: 95 + Math.sin(t * 1.3) * 2, cD: 8, inclina: -6 } : {})} />
          {t > T("who died at 30", D) && t < T("it was set up by her", D) + 1 && <Emote t={t} t0={T("who died at 30", D) + 0.2} t1={T("it was set up by her", D) + 1} tipo="lagrimas" {...cabeza(980, 1010, 440)} s={0.5} />}
          {t > T("it was set up by her", D) - 0.3 && <Persona x={190} y={1030} h={400} t={t} seed={430} ropa={{ ...CIVIL(1), tunica: "#c9a23d", tunica2: "#8f7025" }} {...gesto(t, [[T("it was set up by her", D) - 0.3, "golpea"], [lat, "escribe"], [tr, "triste"]])} />}
          {t > ar && (
            <svg style={{ position: "absolute", left: 400, top: 900, overflow: "visible" }} width={440} height={80}>
              {Array.from({ length: 11 }, (_, i) => (
                <path key={i} d={`M ${i * 40} 60 q 10 -40 20 -10 q 6 20 14 -30`} stroke="#6a5a40" strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${prog(t, ar + i * 0.08, ar + 0.3 + i * 0.08)} 1`} />
              ))}
            </svg>
          )}
        </div>
      )}
      {mapa && (
        <>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
            <path d="M 280 260 L 420 220 L 470 330 L 380 420 L 300 400 Z" fill="#7fa05a" stroke="#fff" strokeWidth={5} />
            <path d="M 560 520 L 1300 480 L 1700 620 L 1660 860 L 1100 900 L 700 800 Z" fill="#c9b28a" stroke="#fff" strokeWidth={5} opacity={0.85} />
            <path d="M 1560 760 Q 1000 120 380 330" stroke={C.ambar} strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${prog(t, pal + 0.2, pal + 2.4)} 1`} />
            {(() => { const k = prog(t, pal + 0.2, pal + 2.4), u = 1 - k; const px = u * u * 1560 + 2 * u * k * 1000 + k * k * 380, py = u * u * 760 + 2 * u * k * 120 + k * k * 330; return k > 0 && k < 1 ? <circle cx={px} cy={py} r={20} fill="#fff" stroke={C.noche} strokeWidth={6} /> : null; })()}
            <circle cx={1560} cy={760} r={22} fill={C.rojo} stroke="#fff" strokeWidth={5} />
            <circle cx={380} cy={330} r={22} fill={C.rojo} stroke="#fff" strokeWidth={5} />
          </svg>
          <Chip t={t} t0={pal} text="PALMYRA" color={C.rojo} x={1560} y={850} centro size={52} />
          {t > pal + 1.0 && <Chip t={t} t0={pal + 1.0} text="~4,000 KM" color="#2a2350" x={1000} y={300} centro size={54} />}
          <Chip t={t} t0={pal + 0.4} text="SOUTH SHIELDS · BRITAIN" color={C.rojo} x={560} y={440} centro size={50} />
          {t > T("in the syrian desert", D) && <Chip t={t} t0={T("in the syrian desert", D)} text="THE SYRIAN DESERT" color={C.ambar} tinta={C.noche} x={1560} y={650} centro size={46} />}
        </>
      )}
      {!mapa && (
        <>
          <Chip t={t} t0={T("there is a tombstone", D)} t1={T("it belongs to a woman", D)} text="SOUTH SHIELDS · A TOMBSTONE" color="#4a4a5a" x={1460} y={180} centro size={50} />
          {([["it belongs to a woman", "REGINA", C.violeta], ["a briton", "A BRITON", C.teal], ["a former slave", "A FORMER SLAVE", "#4a4a5a"], ["who died at 30", "DIED AT 30", C.rojo], ["it was set up by her", "SET UP BY HER HUSBAND…", C.oro], ["baratice", "…BARATES", C.oro]] as [string, string, string][]).map(([w, tx, col], i) => t > T(w, D) && t < pal ? <Chip key={i} t={t} t0={T(w, D)} text={tx} color={col} tinta={col === C.oro || col === C.teal ? C.noche : "#fff"} x={1480} y={180 + (i % 6) * 100} centro size={52} /> : null)}
          <Chip t={t} t0={lat} t1={ar - 0.1} text="UNDER THE LATIN…" color="#4a4a5a" x={1460} y={200} centro size={52} />
          {t > ar && t < tr && <Chip t={t} t0={ar} text="ONE MORE LINE · IN ARAMAIC" color={C.ambar} tinta={C.noche} x={1460} y={200} centro size={50} />}
          {t > tr && <Grande t={t} t0={tr} text="“REGINA," y={360} x={1440} size={80} color="#fff" />}
          {t > T("freed woman of baratice", D) && <Grande t={t} t0={T("freed woman of baratice", D)} text="FREEDWOMAN OF BARATES," y={480} x={1440} size={60} color="#fff" />}
          {t > T("alas", 868) && <Grande t={t} t0={T("alas", 868)} text="ALAS.”" y={620} x={1440} size={110} color={C.ambar} />}
        </>
      )}
    </AbsoluteFill>
  );
};
// 3) Birdoswald: el fuerte que deja de cobrar y las salas de madera encima
const Birdoswald: React.FC<{ t: number }> = ({ t }) => {
  const a = T("at the fort of bertuswald", D), p = T("archaeologists found", D), s = T("somebody built big timber", D);
  const ruina = prog(t, p + 1.6, p + 3.2);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#f2b880,#f7d9a8 60%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#7fa05a" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - ruina * 0.55 }}>
        <Fuerte x={960} y={860} w={1300} piedra />
      </div>
      {t > p && t < s + 0.5 && Array.from({ length: 6 }, (_, i) => <Soldadito key={"v" + i} x={760 + i * 90 + 900 * prog(t, p + 0.8 + i * 0.1, p + 3.4 + i * 0.1)} y={900} s={1.0} t={t} seed={450 + i} avanza={1} />)}
      {t > p && t < s + 0.5 && <div style={{ position: "absolute", left: 640, top: 420, fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "7px #1b1240", paintOrder: "stroke fill" }}>PAY: {Math.max(0, 100 - Math.round(100 * prog(t, p + 0.4, p + 1.8)))} %</div>}
      <Persona x={230} y={1030} h={380} t={t} seed={77} ropa={CIVIL(2)} {...gesto(t, [[a, "camina"], [p, "cava"], [s, "sorpresa"], [s + 1.5, "señala"]])} />
      {ruina > 0 && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 360 + i * 280, top: 640 + (i % 2) * 40, width: 170, height: 60, background: "#c9b28a", borderRadius: 8, transform: `rotate(${(i % 2 ? 1 : -1) * 18 * ruina}deg) translateY(${ruina * 120}px)` }} />)}
      {t > s && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${ent(t, s)})`, transformOrigin: "960px 860px" }}><Salon x={960} y={700} s={0.9} /></div>}
      {t > s + 1 && [0, 1, 2].map((i) => { const k = ((t - s) * 0.4 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 1160 + k * 40, top: 360 - k * 260, width: 60 + k * 70, height: 60 + k * 70, borderRadius: "50%", background: "#ddd", opacity: 0.8 * (1 - k) }} />; })}
      {t > T("maybe a local warlord", D) && <Persona x={700} y={900} h={300} t={t} seed={410} ropa={{ ...CIVIL(3), tunica: "#7a2a2a", tunica2: "#4a1a1a" }} {...gesto(t, [[T("maybe a local warlord", D), "festeja"], [T("maybe the grandsons", D), "señala"]])} />}
      {t > T("maybe the grandsons", D) && [0, 1].map((i) => <Persona key={i} x={1250 + i * 180} y={900} h={250} t={t} seed={420 + i} ropa={CIVIL(i + 4)} {...gesto(t, [[T("maybe the grandsons", D) + i * 0.2, "festeja"], [T("still guarding the wall", D), "señala"]])} />)}
      <Chip t={t} t0={a} t1={p} text="BIRDOSWALD FORT" color={C.violeta} x={960} y={160} centro size={60} />
      {t > p && t < s && <Chip t={t} t0={p} text="THE ARMY: NO LONGER PAID" color={C.rojo} x={960} y={160} centro size={56} />}
      {t > s && t < T("maybe a local warlord", D) && <Chip t={t} t0={s} text="BIG TIMBER HALLS · ON TOP OF THE OLD FORT" color="#8a5a2a" x={960} y={160} centro size={52} />}
      {t > T("maybe a local warlord", D) && t < T("still guarding the wall", D) && <Chip t={t} t0={T("maybe a local warlord", D)} text="A LOCAL WARLORD?" color="#7a2a2a" x={700} y={420} centro size={46} />}
      {t > T("maybe the grandsons", D) && t < T("still guarding the wall", D) && <Chip t={t} t0={T("maybe the grandsons", D)} text="THE GARRISON'S GRANDSONS?" color={C.teal} tinta={C.noche} x={1340} y={480} centro size={46} />}
      {t > T("still guarding the wall", D) && <Grande t={t} t0={T("still guarding the wall", D)} text="STILL GUARDING THE WALL." y={170} size={90} color={C.crema} />}
    </AbsoluteFill>
  );
};
// 4) el próximo video: el barco ballenero
const Ballenero: React.FC<{ t: number }> = ({ t }) => {
  const a = T("because next time we are", D);
  const cola = prog(t, a + 1.2, a + 2.2);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#5c6f8f,#9fb5cc 55%, #2a4a7a 56%, #1b3a6a)" }}>
      <Barco x={1150} y={560} s={1.1} t={t} />
      <svg style={{ position: "absolute", left: 360, top: 600, overflow: "visible" }} width={300} height={300}>
        <g transform={`translate(150 ${260 - cola * 200})`}>
          <path d="M 0 0 Q -20 -80 -120 -120 Q -60 -60 0 -70 Q 60 -60 120 -120 Q 20 -80 0 0 Z" fill="#2a3a5a" />
        </g>
        {cola > 0.5 && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={150 + (i - 2) * 50} cy={250 - Math.sin(i) * 30 - (cola - 0.5) * 80} r={12} fill="#fff" opacity={1 - cola * 0.5} />)}
      </svg>
      <Chip t={t} t0={a} text="NEXT TIME" color={C.rojo} x={960} y={150} centro size={56} />
      <Grande t={t} t0={a + 0.5} text="A WHALING SHIP." y={290} size={120} color="#fff" />
    </AbsoluteFill>
  );
};
// botón de suscribirse con cursor que lo aprieta
const Suscribir: React.FC<{ t: number; t0: number; tClick: number; x: number; y: number }> = ({ t, t0, tClick, x, y }) => {
  if (t < t0) return null;
  const hecho = t > tClick;
  const cx = interpolate(prog(t, t0 + 0.2, tClick), [0, 1], [x + 520, x + 120]), cy = interpolate(prog(t, t0 + 0.2, tClick), [0, 1], [y + 320, y + 40]);
  const pres = t > tClick && t < tClick + 0.15 ? 0.92 : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${ent(t, t0)})`, transformOrigin: `${x}px ${y}px` }}>
      <div style={{ position: "absolute", left: x - 330, top: y - 80, width: 660, height: 160, borderRadius: 80, background: hecho ? "#5a5a6a" : "#e62117", color: "#fff", fontFamily, fontWeight: 700, fontSize: 72, textAlign: "center", lineHeight: "160px", transform: `scale(${pres})` }}>{hecho ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
      <svg style={{ position: "absolute", left: cx, top: cy }} width={90} height={120} viewBox="0 0 90 120"><path d="M 6 4 L 6 92 L 28 72 L 44 112 L 60 104 L 44 66 L 76 66 Z" fill="#fff" stroke="#111" strokeWidth={6} strokeLinejoin="round" /></svg>
    </div>
  );
};
// la caja de comentarios: qué trampa te agarraba primero
const Comentarios: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  if (t < t0) return null;
  const tr = ["POSTING", "WEATHER", "SUPPLY", "BOREDOM", "NEIGHBORS", "THE NORTH", "THE END"];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${ent(t, t0)})`, transformOrigin: "960px 600px" }}>
      <div style={{ position: "absolute", left: 260, top: 330, width: 1400, height: 560, borderRadius: 40, background: "#fff", boxShadow: "0 16px 0 rgba(20,8,40,.3)" }} />
      <div style={{ position: "absolute", left: 320, top: 380, width: 90, height: 90, borderRadius: "50%", background: C.violeta }} />
      <div style={{ position: "absolute", left: 440, top: 395, fontFamily, fontWeight: 700, fontSize: 52, color: "#1b1240" }}>WHICH TRAP WOULD GET YOU FIRST?</div>
      <div style={{ position: "absolute", left: 440, top: 465, width: 1000, height: 6, background: "#ddd" }} />
      <div style={{ position: "absolute", left: 320, top: 520, width: 70, height: 70, borderRadius: "50%", background: C.teal }} />
      <div style={{ position: "absolute", left: 420, top: 530, width: 1180, fontFamily, fontWeight: 600, fontSize: 44, color: "#1b1240" }}>{(() => { const msg = "#2 THE RAIN. I'd be gone by week one."; const n = Math.floor(msg.length * prog(t, t0 + 0.8, t0 + 3.0)); return msg.slice(0, n) + (n < msg.length && Math.floor(t * 3) % 2 ? "|" : ""); })()}</div>
      <div style={{ position: "absolute", left: 420, top: 600, fontFamily, fontWeight: 700, fontSize: 34, color: C.rojo, opacity: prog(t, t0 + 3.1, t0 + 3.4) }}>♥ {Math.round(240 * prog(t, t0 + 3.1, t0 + 5))}</div>
      {tr.map((ic, i) => <Pin key={i} t={t} t0={t0 + 0.6 + i * 0.12} n={i + 1} x={420 + i * 180} y={820} s={0.7} icono={ic} act={Math.floor(t * 2.5) % 7 === i} />)}
      {t > T("which one of these seven", D) && tr.map((_, i) => <div key={"q" + i} style={{ position: "absolute", left: 420 + i * 180 + 52, top: 690 - Math.abs(Math.sin(t * 5 + i)) * 18, fontFamily, fontWeight: 700, fontSize: 66, color: C.noche, WebkitTextStroke: "6px #fff", paintOrder: "stroke fill", transform: `scale(${ent(t, T("which one of these seven", D) + i * 0.08)})` }}>?</div>)}
      <Yo x={1790} y={1060} h={330} t={t} frio {...gesto(t, [[t0, "señala"], [t0 + 2.5, "habla"], [t0 + 4.2, "festeja"]])} />
    </div>
  );
};

export const W8: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 822 || t > 920) return null;
  const quedan = T("they stayed", D);
  const hogar = T("nobody wanted to guard", D);
  return (
    <>
      {/* la fila de los que cuidaban el muro, con su origen */}
      {t > 823 && t < 847 && ORIG.map((o, i) => {
        const x = FILA - 575 + i * 230;
        const t0 = T(ORIGW[i], D);
        return (
          <React.Fragment key={i}>
            <Otro i={i} x={x} y={TOP} h={220} t={t} {...(t > quedan ? { expr: "feliz" as const, salta: quedan + i * 0.08, bD: 150, bI: 150, cD: 20, cI: 20 } : poseFila(i, t))} />
            {t > t0 && t < T("all of these men were", D) && <Chip t={t} t0={t0} text={o === "BOATMEN FROM IRAQ" ? "IRAQ" : o} color={[C.violeta, C.teal, C.ambar, C.rojo, "#3f8a3a", "#3d7fc9"][i]} tinta={i === 1 || i === 2 ? C.noche : "#fff"} x={x} y={TOP - 300 - (i % 2) * 60} centro size={44} />}
            {t > T("all of these men were", D) && t < T("romes last line", D) && (() => { const t0b = T("all of these men were", D) + i * 0.1, fl = T("all of these men were", D) + 1.5 + i * 0.1, g = t > fl; const sy = Math.abs(Math.cos(Math.PI * prog(t, fl - 0.15, fl + 0.15))); return <div style={{ position: "absolute", left: 0, top: 0, transform: `scaleY(${t > fl - 0.15 && t < fl + 0.15 ? sy : 1})`, transformOrigin: `${x}px ${TOP + 70 + (i % 2) * 70}px` }}><Chip t={t} t0={t0b} text={g ? "ROMAN DEFENDER" : "BARBARIAN"} color={g ? C.violeta : C.rojo} x={x} y={TOP + 70 + (i % 2) * 70} centro size={36} /></div>; })()}
            {t > quedan && <Emote t={t} t0={quedan + i * 0.1} t1={quedan + 1.6} tipo="brillos" {...cabeza(x, TOP, 220)} s={0.5} />}
          </React.Fragment>
        );
      })}
      {/* la punta este: la casa de Barates y Regina, que con los años se llena */}
      <Casa x={ESTE + 380} y={BASE} s={1.6} tono="#e8b98a" techo="#8a5a2a" luz={t > hogar} />
      {t > 868 && (
        <>
          <Persona x={ESTE - 120} y={BASE} h={300} t={t} seed={430} ropa={{ ...CIVIL(1), tunica: "#c9a23d", tunica2: "#8f7025" }} mira={0.6} {...gesto(t, [[868, "habla"], [T("building a life", D), "festeja"], [T("on the wall nobody wanted", D), "habla"]])} />
          <Persona x={ESTE + 80} y={BASE} h={280} t={t} seed={431} ropa={{ ...CIVIL(4), tunica: "#3d7fc9", tunica2: "#25548f", pelo: "#6b3a1f" }} mujer flip mira={-0.6} {...gesto(t, [[868, "lee"], [T("building a life", D), "festeja"], [T("on the wall nobody wanted", D), "señala"]])} />
          {t > T("building a life", D) && t < 876 && <Emote t={t} t0={T("building a life", D)} t1={875.5} tipo="brillos" x={ESTE - 20} y={BASE - 360} s={0.7} />}
          {t > T("a syrian and a british", D) && t < 875 && <Chip t={t} t0={T("a syrian and a british", D)} text="A SYRIAN + A BRITON" color={C.violeta} x={ESTE - 20} y={BASE - 470} centro size={42} />}
        </>
      )}
      {/* al final: la familia que siguió, y un viejo que sigue mirando el norte desde el muro */}
      {t > hogar - 0.3 && [0, 1, 2].map((i) => <Persona key={"n" + i} x={ESTE - 420 + i * 150} y={BASE} h={170 + (i % 2) * 30} t={t} seed={440 + i} ropa={CIVIL(i + 2)} expr="feliz" salta={hogar + 2 + i * 0.7} />)}
      {t > hogar - 0.3 && <Yo x={ESTE - 800} y={TOP} h={240} t={t} frio viejo casco={false} mira={-0.4} {...gesto(t, [[hogar, "lee"], [T("some of them simply could not", D), "niega"], [T("because by then it was home", D), "festeja"]])} />}
      {t > hogar && [0, 1, 2].map((i) => { const k = ((t - hogar) * 0.35 + i / 3) % 1; return <div key={"h" + i} style={{ position: "absolute", left: ESTE + 470 + k * 50, top: BASE - 380 - k * 300, width: 70 + k * 90, height: 70 + k * 90, borderRadius: "50%", background: "#e6e0d8", opacity: 0.75 * (1 - k) }} />; })}
    </>
  );
};

export const S8: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 822 || t > 920) return null;
  const sub = T("subscribe and hit the bell", D), com = T("and tell me in the comments", D);
  return (
    <>
      <Gr t={t} w="here is the twist" d={D} txt="THE TWIST." y={540} size={220} c={C.ambar} dur={1.25} />
      <Ch t={t} w="remember who stood" d={D} txt="WHO STOOD ON THE WALL?" y={150} c={C.violeta} size={60} dur={1.8} />
      <Ch t={t} w="at the beginning" d={D} txt="AT THE BEGINNING…" y={150} c="#4a4a5a" size={56} dur={0.9} />
      <Gr t={t} w="all of these men were" d={D} txt="BARBARIANS TOO." y={200} size={130} c={C.rojo} borde="#fff" dur={2.4} />
      <Plano t={t} t0={T("romes last line", D) - 0.1} t1={T("and those men did", D) - 0.15} desde={[960, 600]} fondo="#9fd0f0"><Ladrillos t={t} /></Plano>
      <Ch t={t} w="and those men did" d={D} txt="SOMETHING NOBODY PLANNED" y={150} c={C.violeta} size={60} dur={2.5} />
      <Gr t={t} w="they stayed" d={D} txt="THEY STAYED." y={200} size={150} c={C.crema} dur={1.0} />
      <Ch t={t} w="at the eastern end" d={D} txt="THE EASTERN END OF THE WALL →" y={150} c="#4a4a5a" size={56} dur={1.6} />
      <Plano t={t} t0={T("there is a tombstone", D) - 0.1} t1={T("a syrian and a british", D) - 0.15} desde={[960, 600]} fondo="#2a2a3a"><Regina t={t} /></Plano>
      <Plano t={t} t0={T("a syrian and a british", D) - 0.1} t1={T("and when rome finally left", D) - 0.12} desde={[960, 600]} fondo="#ffb070"><Pareja t={t} /></Plano>
      <Gr t={t} w="on the wall nobody wanted" d={D} txt="ON THE WALL NOBODY WANTED." y={200} size={84} c={C.crema} dur={1.5} />
      <Ch t={t} w="and when rome finally left" d={D} txt="WHEN ROME FINALLY LEFT…" y={150} c={C.rojo} size={58} dur={1.6} />
      <Ch t={t} w="some of them never went" d={D} txt="…SOME NEVER WENT HOME" y={260} c={C.violeta} size={58} dur={1.5} />
      <Plano t={t} t0={T("at the fort of bertuswald", D) - 0.1} t1={T("nobody wanted to guard", D) - 0.15} desde={[960, 600]} fondo="#f2b880"><Birdoswald t={t} /></Plano>
      <Plano t={t} t0={T("nobody wanted to guard", 893) - 0.1} t1={T("if you enjoyed surviving", D) - 0.12} desde={[960, 600]} fondo="#ffb070"><Familia t={t} /></Plano>
      <Ch t={t} w="nobody wanted to guard" d={D} txt="NOBODY WANTED TO GUARD IT…" y={150} c="#4a4a5a" size={58} dur={2.9} />
      <Ch t={t} w="when nobody asked them" d={D} txt="…THEN NOBODY ASKED THEM TO" y={150} c={C.violeta} size={58} dur={1.9} />
      <Ch t={t} w="some of them simply could not" d={D} txt="AND SOME COULD NOT LEAVE" y={150} c={C.rojo} size={58} dur={2.1} />
      <Gr t={t} w="because by then it was home" d={D} txt="BY THEN, IT WAS HOME." y={210} size={110} c={C.crema} dur={2.1} />
      <Ch t={t} w="if you enjoyed surviving" d={D} txt="SURVIVED A WINTER ON THE EDGE OF ROME?" y={150} c={C.violeta} size={56} dur={3.3} />
      {t > sub - 0.1 && t < T("because next time we are", D) && (
        <>
          <Suscribir t={t} t0={sub} tClick={sub + 0.7} x={520} y={250} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${ent(t, sub + 0.4)})`, transformOrigin: "990px 250px" }}><Campana x={990} y={250} s={0.8} t={t} t0b={sub + 1.0} /></div>
        </>
      )}
      <Plano t={t} t0={T("because next time we are", D) - 0.05} t1={com - 0.15} desde={[960, 540]} fondo="#2a4a7a"><Ballenero t={t} /></Plano>
      <Comentarios t={t} t0={com + 0.3} />
      <Ch t={t} w="and tell me in the comments" d={D} txt="TELL ME IN THE COMMENTS" y={200} c={C.rojo} size={60} dur={5.5} dt={0.35} />
    </>
  );
};
