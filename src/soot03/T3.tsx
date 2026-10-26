import React from "react";
import { Sala } from "./sets";
import { Exterior } from "./escenas4";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Bota, Moneda } from "./kit";
import { Papiro, Item, Mula } from "./kit2";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Carro, Barril, Jarro, TablillaGrande, Picto, gesto } from "./kit3";

// TRAMPA 3 · LA LÍNEA DE SUMINISTRO (331,2-431,6 s). Un campo donde no crece nada; el convoy que sube por el camino
// (grano, vino, sal, clavos, cuero… cerveza); la tablilla de Masclus; la lista de compras; la lluvia de zapatos;
// las familias; y la trampa: el convoy que llega tarde, que no llega, que un día deja de venir.
const D = 331;
const M3 = MC(3);
const CV0 = M3 + 2600; // el convoy entra desde acá y avanza hacia la izquierda
const YO3 = M3 - 600; // vos, al pie del muro, esperando
const conv = (t: number) => {
  // posición del carro de cabeza: llega, se para, se va (al final ya no vuelve)
  const a = T("so everything has to come", D), b = T("but here is the trap", D);
  if (t < a) return CV0 + 2400;
  if (t < b) return CV0 + 2400 - 2400 * prog(t, a, a + 4.5) - 300 * prog(t, a + 5, b);
  return CV0 - 300 - 2600 * prog(t, b + 1, b + 7);
};

export const keys3: K[] = [
  [331.4, M3 - 2000, 560, 0.4], ck("here is the thing", D, M3 + 200, 720, 0.9), ck("nothing grows there", D, M3 + 200, 740, 1.3),
  ck("so everything has to come", D, CV0 + 900, 720, 0.95), ck("grain", D, CV0 + 300, 740, 1.1), ck("and above all", D, CV0 - 100, 740, 1.2),
  ck("yes", D, CV0, 700, 1.4), ck("the soldiers on the northern", D, YO3, 720, 1.1), ck("they took it extremely", D, YO3, 700, 1.4),
  ck("one of the most famous", D, YO3, 700, 1.0), ck("that is it", D, YO3, 720, 1.5), ck("other tablets read", D, YO3 + 300, 700, 0.9),
  ck("and shoes", D, YO3, 720, 1.0), ck("because the wall", D, M3 - 1000, 680, 0.55), ck("was never just a place", D, M3 - 1200, 700, 0.7),
  ck("but here is the trap", D, CV0 - 400, 680, 0.55), ck("past people who would", D, CV0 - 1800, 600, 0.38), ck("if the convoy is late", D, YO3, 720, 1.3),
  ck("if the beer does not come", D, YO3, 720, 1.5), ck("and if a whole province", D, M3, 600, 0.4), ck("the convoy simply stops", D, M3 + 1200, 680, 0.5),
  ck("remember that", D, YO3, 700, 1.2), [431.3, YO3, 640, 0.9],
];
export const amb3: [number, Pal][] = [[331.4, "gris"], [345.6, "dia"], [404.2, "dia"], [407.9, "gris"], [421.7, "tormenta"]];
export const lluvia3: [number, number][] = [[331.4, 0], [345.4, 0], [407.9, 0], [409.6, 0.7], [414.5, 0.4], [421.7, 0.6], [431.5, 0.4]];
export const sol3: [number, number, number][] = [[331.3, -999, 0], [345.6, 1400, 240], [407.9, -999, 0]];

// la tablilla de Masclus (la frase de la cerveza aparece al final, subrayada)
const Masclus: React.FC<{ t: number }> = ({ t }) => {
  const a = T("one of the most famous", D), b = T("my fellow soldiers have", D), c = T("please order some", D);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      <Persona x={230} y={1040} h={430} t={t} seed={95} ropa={{ ...AUX(4), tunica: "#c9a23d", tunica2: "#8f7025" }} casco="centurion" malla {...gesto(t, [[a, "escribe"], [b - 0.3, "triste"], [c, "habla"]])} />
      <div style={{ position: "absolute", inset: 0 }}><TablillaGrande t={t} t0={a + 0.3} x={1090} y={420} w={1380} vel={30} titulo="MASCLUS, CAVALRY OFFICER → CERIALIS, COMMANDER"
        lineas={["“Masclus to Cerialis, his king, greetings.", "Please, my lord, give instructions", "for what you want done tomorrow…”"]} /></div>
      {t > b && <div style={{ position: "absolute", left: 420, right: 60, top: 760, height: 130, background: C.ambar, borderRadius: 20, transform: `scale(${ent(t, b)}) rotate(-2deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 64, color: C.noche }}>“MY FELLOW SOLDIERS HAVE NO BEER.”</div>}
      {t > c && <div style={{ position: "absolute", left: 560, right: 180, top: 910, height: 100, background: "#fff", borderRadius: 20, transform: `scale(${ent(t, c)}) rotate(1.5deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 54, color: C.noche }}>“PLEASE ORDER SOME TO BE SENT.”</div>}
      <Chip t={t} t0={T("it is a work request", D)} t1={T("he adds the real reason", D)} text="A WORK REQUEST…" color={C.teal} tinta={C.noche} x={1090} y={130} centro size={56} />
      <Chip t={t} t0={T("he adds the real reason", D)} text="…AND THE REAL REASON:" color={C.rojo} x={1090} y={130} centro size={56} />
    </AbsoluteFill>
  );
};
// la lista de compras de un pueblo chico
const LISTA: [string, string][] = [["barley", "BARLEY"], ["pork fat", "PORK FAT"], ["salt", "SALT"], ["fish sauce", "FISH SAUCE"], ["spices", "SPICES"], ["chickens", "CHICKENS"], ["vintage wine", "VINTAGE WINE · OFFICERS"], ["celtic beer", "CELTIC BEER · EVERYONE ELSE"], ["and grain in", "GRAIN… STAGGERING AMOUNTS"]];
const Lista: React.FC<{ t: number }> = ({ t }) => {
  const m = T("one merchant mentions", D);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" />
      <Chip t={t} t0={T("other tablets read", D) + 0.3} t1={T("barley", 374)} text="A SHOPPING LIST FOR A SMALL TOWN" color={C.violeta} x={960} y={120} centro size={56} />
      {t < m + 0.2 && <Persona x={1700} y={1040} h={420} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" {...gesto(t, [[T("other tablets read", D), "lee"], [T("barley", 374), "señala"], [T("vintage wine", 374), "festeja"], [T("celtic beer", 374), "festeja"], [T("and grain in", 374), "sorpresa"]])} />}
      {t < m + 0.2 && <Papiro t={t} x={820} y={560} w={1000} t0={T("other tablets read", D) + 0.2} tacha={false} titulo="VINDOLANDA · SHOPPING LIST" items={LISTA.map(([w, tx]) => ({ txt: tx, t0: T(w, 374), monto: "✓" }))} />}
      {t > m && (
        <>
          {Array.from({ length: 27 }, (_, i) => <Item key={i} k="grano" x={140 + (i % 9) * 170} y={1000 - Math.floor(i / 9) * 150 - (1 - ent(t, m + i * 0.04)) * 900} s={0.7} />)}
          <Cu t={t} w="one merchant mentions" d={D} de={0} a={5000} sube={1.2} dur={5} y={190} size={150} suf=" MEASURES" color="#fff" dt={0.3} />
          {t > T("worrying about how", D) && <Persona x={1640} y={660} h={360} t={t} seed={81} ropa={CIVIL(3)} expr="miedo" bD={150} cD={150} bI={150} cI={150} aparece={T("worrying about how", D)} />}
          <Emote t={t} t0={T("worrying about how", D) + 0.2} tipo="sudor" x={1650} y={420} s={0.9} />
        </>
      )}
    </AbsoluteFill>
  );
};
// lluvia de zapatos: botas, sandalias, zapatitos
const Zapatos: React.FC<{ t: number }> = ({ t }) => {
  const a = T("and shoes", D), b = T("archaeologists have pulled", D);
  const n = Math.min(160, Math.floor(Math.max(0, t - a) * (t > b ? 60 : 12)));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#9fc6e0,#e0eef6)" }}>
      {Array.from({ length: n }, (_, i) => {
        const t0 = a + i / (i < 16 ? 12 : 60) + (i < 16 ? 0 : (b - a) - 16 / 60);
        const k = Math.min(1, Math.max(0, (t - t0) / 0.5));
        const x = 60 + ((i * 211) % 1800), yF = 1000 - Math.floor(i / 12) * 34 - ((i * 37) % 40);
        const s = i % 5 === 4 ? 0.45 : i % 3 === 0 ? 0.7 : 0.9;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(0px, ${(k - 1) * 1100}px) rotate(${(i * 47) % 60 - 30}deg)`, transformOrigin: `${x}px ${yF}px` }}><Bota x={x} y={yF} s={s} /></div>;
      })}
      <Persona x={960} y={1060 + 260 * prog(t, b, b + 3.5)} h={360} t={t} seed={3} ropa={TUNGRO} casco="legion" malla {...gesto(t, [[a, "sorpresa"], [a + 0.9, "señala"], [b, "miedo"]])} />
      {t > b && <Cu t={t} w="archaeologists have pulled" d={D} de={0} a={5000} sube={2.4} dur={4.2} y={200} size={140} pre="" suf="+ SHOES" color="#fff" dt={0.2} />}
      {[["mens boots", "MEN'S BOOTS", 400], ["womens sandals", "WOMEN'S SANDALS", 960], ["tiny shoes for children", "TINY SHOES FOR CHILDREN", 1500]].map(([w, tx, x], i) => t > T(w as string, D) ? <Chip key={i} t={t} t0={T(w as string, D)} text={tx as string} color={[C.violeta, C.rosa, C.ambar][i]} tinta={i === 2 ? C.noche : "#fff"} x={x as number} y={360 + i * 90} centro size={50} /> : null)}
    </AbsoluteFill>
  );
};

// ═══════════ VUELTA 7 (t3t4): escenas re-animadas en plano medio ═══════════
const TINTA3 = "#2a1530";
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// 5:38 · «acá no crece nada que quieras comer: todo tiene que subir por los caminos» (copia de Camino, todo 60+ px más arriba)
const Camino3: React.FC<{ t: number; t0: number; tTodo: number }> = ({ t, t0, tTodo }) => {
  const lej = [430, 600], cer = [1240, 990];
  const carros = [0, 1, 2, 3].map((i) => {
    const k = prog(t, t0 + i * 0.75, t0 + 3.4 + i * 0.75);
    const u = Math.pow(k, 1.6);
    return { i, k, x: lej[0] + (cer[0] - lej[0]) * u, y: lej[1] + (cer[1] - lej[1]) * u, s: 0.12 + 0.62 * u };
  });
  const sen = t > tTodo;
  return (
    <Exterior t={t} tono="gris" viento={1.3} horizonte={600}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <path d={`M ${lej[0] - 10} ${lej[1]} L ${lej[0] + 30} ${lej[1]} L ${cer[0] + 520} 1080 L ${cer[0] - 520} 1080 Z`} fill="#9a7a52" />
        <path d={`M ${lej[0] + 10} ${lej[1]} L ${cer[0]} 1080`} stroke="#c9a36a" strokeWidth={14} strokeDasharray="60 50" opacity={0.6} />
        {[[820, 760, 90], [1150, 920, 150], [640, 680, 50]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.28} fill="#5a4a3a" opacity={0.7} />)}
        {Array.from({ length: 14 }, (_, i) => { const x = 60 + i * 140 + ((i * 71) % 60), y = 680 + ((i * 53) % 160); return x > 1250 || x < 380 ? <path key={i} d={`M ${x} ${y} l -14 -40 M ${x} ${y} l 2 -50 M ${x} ${y} l 16 -36`} stroke="#8a7a52" strokeWidth={6} strokeLinecap="round" /> : null; })}
      </svg>
      {carros.filter((c) => c.k > 0).sort((a, b) => a.s - b.s).map((c) => (
        <React.Fragment key={c.i}>
          <Carro x={c.x} y={c.y - 70 * c.s} s={c.s} t={t} carga={c.i % 2 ? "barril" : "grano"} />
          <Mula x={c.x + 400 * c.s} y={c.y - 110 * c.s} s={c.s * 0.8} t={t} camina={1.4} />
        </React.Fragment>
      ))}
      {/* él, con el cuenco vacío: lo da vuelta (no cae nada) y después señala los carros */}
      <Persona x={250 + 120 * prog(t, t0, t0 + 1)} y={960} h={460} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" camina={t < t0 + 1 ? 1.3 : 0}
        expr={sen ? "sorpresa" : t > t0 + 1 ? "triste" : "neutro"} habla={sen} mira={sen ? 0.9 : 0}
        bD={sen ? 118 + Math.sin(t * 5) * 6 : 15} cD={sen ? 5 : 15}
        bI={sen ? 20 : t > t0 + 1 ? 95 : 30} cI={sen ? 15 : t > t0 + 1 ? 70 + Math.sin(t * 7) * 10 : 30}
        manoI={!sen && t > t0 + 1 ? <g transform={`rotate(${180 + Math.sin(t * 7) * 15}) scale(0.55)`}><path d="M -70 -10 L 70 -10 Q 66 60 0 64 Q -66 60 -70 -10 Z" fill="#a8622c" stroke="#6b3a1f" strokeWidth={6} /></g> : undefined} />
      {t > t0 + 1.3 && !sen && <svg style={{ position: "absolute", left: 300, top: 640, overflow: "visible" }} width={1} height={1}>{[0, 1, 2].map((i) => { const k = ((t * 1.3 + i / 3) % 1); return <circle key={i} cx={Math.sin(i * 3) * 10} cy={k * 90} r={5} fill="#c9a36a" opacity={1 - k} />; })}</svg>}
      {t > t0 + 0.4 && <Chip t={t} t0={t0 + 0.4} text="NOTHING TO EAT HERE" color="#7a6a4a" x={330} y={330} centro size={44} />}
    </Exterior>
  );
};

// 6:00 · Masclus escribe con el estilete; en «no beer» se desespera con el jarro vacío; en «please» suplica
const Estilete = <line x1={0} y1={-6} x2={10} y2={74} stroke="#4a2a14" strokeWidth={9} strokeLinecap="round" />;
const JarroVacio: React.FC<{ rot: number }> = ({ rot }) => (
  <g transform={`rotate(${rot}) scale(0.62)`}>
    <path d="M -50 -70 L 50 -70 L 42 80 L -42 80 Z" fill="#e8d8b0" stroke="#a8946a" strokeWidth={8} />
    <path d="M 48 -36 Q 96 -26 84 30 L 44 38" stroke="#a8946a" strokeWidth={14} fill="none" />
  </g>
);
const Masclus2: React.FC<{ t: number }> = ({ t }) => {
  const a = T("one of the most famous", D), w = T("it is a work request", D), r = T("he adds the real reason", D), b = T("my fellow soldiers have", D), c = T("please order some", D);
  const f = t < w ? 0 : t < r ? 1 : t < b ? 2 : t < c ? 3 : 4;
  const sh = f === 3 ? Math.sin(t * 40) * 3 : 0;
  const P = [
    { bD: 50 + Math.sin(t * 4) * 20, cD: 60, bI: 30, cI: 20, expr: "neutro", mira: 0.5, habla: true },
    { bD: 42 + Math.sin(t * 15) * 5, cD: 62 + Math.sin(t * 11) * 9, bI: 40, cI: 40, expr: "neutro", mira: 0.8, habla: false },
    { bD: 42, cD: 62, bI: 115, cI: 70, expr: "sorpresa", mira: -0.9, habla: false },
    { bD: 158, cD: 150, bI: 158, cI: 150, expr: "miedo", mira: 0, habla: true },
    { bD: 105 + Math.sin(t * 6) * 8, cD: 75, bI: 105 + Math.sin(t * 6) * 8, cI: 75, expr: "triste", mira: 0, habla: true },
  ][f] as { bD: number; cD: number; bI: number; cI: number; expr: "neutro" | "sorpresa" | "miedo" | "triste"; mira: number; habla: boolean };
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" ventana="der" />
      <Persona x={330 + sh} y={1060} h={560} t={t} seed={95} ropa={{ ...AUX(4), tunica: "#c9a23d", tunica2: "#8f7025" }} casco="centurion" malla
        expr={P.expr} habla={P.habla} mira={P.mira} bD={P.bD} cD={P.cD} bI={P.bI} cI={P.cI} inclina={f === 1 ? 8 : f === 3 ? -4 : 0} salta={f === 2 ? r : undefined}
        manoD={f < 3 ? Estilete : undefined} manoI={f === 2 ? <JarroVacio rot={170 + Math.sin(t * 10) * 18} /> : undefined} />
      {f === 2 && <svg style={{ position: "absolute", left: 150, top: 560, overflow: "visible" }} width={1} height={1}><path d={`M 0 ${(t * 120) % 60} q 8 14 0 22 q -8 -8 0 -22`} fill="#7fd6ff" /></svg>}
      {/* mesa con la tablilla chica donde escribe */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <rect x={40} y={880} width={640} height={220} rx={10} fill="#7a4a22" />
        <rect x={40} y={872} width={640} height={26} rx={8} fill="#a8703a" />
        <g transform="translate(470 858) rotate(-4)"><rect x={-90} y={-24} width={180} height={44} rx={6} fill="#d9b878" stroke="#8a6a3a" strokeWidth={5} />
          {[0, 1].map((j) => <rect key={j} x={-74} y={-14 + j * 16} width={f >= 1 ? 40 + 100 * clamp01((t - w) / 4) : 0} height={6} rx={3} fill="#4a2a14" />)}</g>
        {f === 3 && [0, 1, 2].map((i) => <line key={i} x1={150 + i * 120} y1={420 - i * 20} x2={140 + i * 120} y2={380 - i * 20} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 20 + i)} />)}
      </svg>
      <Emote t={t} t0={b} t1={c} tipo="lagrimas" x={330} y={1060 - 450} s={1} />
      <Emote t={t} t0={c} tipo="sudor" x={330} y={1060 - 450} s={1} />
      <div style={{ position: "absolute", left: 0, top: 0 }}><TablillaGrande t={t} t0={w - 0.2} x={1200} y={400} w={1240} vel={30} titulo="MASCLUS → CERIALIS, COMMANDER"
        lineas={["“Masclus to Cerialis, his king, greetings.", "Please, my lord, give instructions", "for what you want done tomorrow…”"]} /></div>
      {t > b && <div style={{ position: "absolute", left: 640, right: 50, top: 720, height: 130, background: C.ambar, borderRadius: 20, transform: `scale(${ent(t, b)}) rotate(-2deg) translateX(${Math.sin(t * 30) * (t < b + 0.6 ? 6 : 0)}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 60, color: C.noche, boxShadow: "10px 12px 0 rgba(20,8,40,.35)" }}>“MY FELLOW SOLDIERS HAVE NO BEER.”</div>}
      {t > c && <div style={{ position: "absolute", left: 760, right: 110, top: 900, height: 100, background: "#fff", borderRadius: 20, transform: `scale(${ent(t, c)}) rotate(1.5deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 52, color: C.noche, boxShadow: "10px 12px 0 rgba(20,8,40,.35)" }}>“PLEASE ORDER SOME TO BE SENT.”</div>}
      <Chip t={t} t0={a + 0.2} t1={w} text="A CAVALRY OFFICER WRITES…" color={C.violeta} x={1200} y={130} centro size={54} />
      <Chip t={t} t0={w} t1={r} text="A WORK REQUEST…" color={C.teal} tinta={C.noche} x={1200} y={110} centro size={54} />
      <Chip t={t} t0={r} text="…AND THE REAL REASON:" color={C.rojo} x={1200} y={110} centro size={54} />
    </AbsoluteFill>
  );
};

// 6:18 · la lista de compras: el rollo crece con cada ítem (ícono con pop) y él lo tacha con el dedo
const Ic: React.FC<{ k: number }> = ({ k }) => {
  const g: React.ReactNode[] = [
    <g>{[-18, 0, 18].map((x, i) => <g key={i} transform={`rotate(${(i - 1) * 14} ${x} 40)`}><line x1={x} y1={40} x2={x} y2={-30} stroke="#a8a06a" strokeWidth={6} />{[0, 1, 2, 3].map((j) => <ellipse key={j} cx={x} cy={-30 + j * 12} rx={7} ry={10} fill="#d9c27a" />)}</g>)}</g>,
    <g><path d="M -40 -10 Q -10 -40 40 -20 L 44 20 Q 0 40 -44 24 Z" fill="#f2b6a8" stroke="#c8463a" strokeWidth={6} /><path d="M -30 0 Q 0 -16 34 -4" stroke="#fff" strokeWidth={8} fill="none" /></g>,
    <g><path d="M -44 34 Q 0 -50 44 34 Z" fill="#fff" stroke="#b9c4d4" strokeWidth={6} />{[[-10, 10], [8, -4], [18, 20]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={4} fill="#b9c4d4" />)}</g>,
    <g><path d="M -16 -40 L 16 -40 L 14 -26 Q 40 -6 30 26 L 0 46 L -30 26 Q -40 -6 -14 -26 Z" fill="#c9773a" stroke="#7a3a14" strokeWidth={5} /><path d="M -14 -30 Q -34 -26 -30 -10 M 14 -30 Q 34 -26 30 -10" stroke="#7a3a14" strokeWidth={6} fill="none" /></g>,
    <g>{([[-26, "#d9502a"], [0, "#e8b03a"], [26, "#7a9a3a"]] as [number, string][]).map(([x, col], i) => <path key={i} d={`M ${x - 20} 30 Q ${x} ${-20 - i * 6} ${x + 20} 30 Z`} fill={col} stroke={TINTA3} strokeWidth={4} />)}</g>,
    <g><ellipse cx={0} cy={10} rx={36} ry={28} fill="#fff" stroke="#c9bca0" strokeWidth={5} /><circle cx={28} cy={-18} r={16} fill="#fff" stroke="#c9bca0" strokeWidth={5} /><path d="M 22 -36 l 6 -10 l 6 10 l 6 -8 l 2 10 Z" fill={C.rojo} /><path d="M 42 -18 l 14 4 l -14 4 Z" fill="#f2a83a" /><circle cx={30} cy={-20} r={3} fill={TINTA3} /><path d="M -10 38 l -4 12 M 10 38 l 4 12" stroke="#f2a83a" strokeWidth={5} /></g>,
    <g><path d="M -26 -30 L 26 -30 Q 26 10 0 14 Q -26 10 -26 -30 Z" fill="#7a2a5a" stroke="#4a1030" strokeWidth={5} /><line x1={0} y1={14} x2={0} y2={38} stroke="#c9bca0" strokeWidth={7} /><rect x={-20} y={36} width={40} height={8} rx={4} fill="#c9bca0" /></g>,
    <g><path d="M -30 -30 L 26 -30 L 22 40 L -26 40 Z" fill="#e8a83a" stroke="#a8622c" strokeWidth={5} /><ellipse cx={-2} cy={-32} rx={32} ry={12} fill="#fff8e8" /><path d="M 26 -14 Q 50 -10 46 16 L 24 20" stroke="#a8622c" strokeWidth={8} fill="none" /></g>,
    <g><path d="M -36 -24 Q -50 40 0 44 Q 50 40 36 -24 Z" fill="#e8d8a8" stroke="#a8783a" strokeWidth={5} /><path d="M -24 -24 L -12 -40 L 12 -40 L 24 -24 Z" fill="#a8783a" />{[0, 1, 2].map((i) => <circle key={i} cx={-14 + i * 14} cy={-46 - i * 4} r={5} fill="#d9b878" />)}</g>,
  ];
  return <svg width={76} height={76} viewBox="-50 -50 100 100" style={{ overflow: "visible" }}>{g[k]}</svg>;
};
const LISTA2: [string, string][] = [["barley", "BARLEY"], ["pork fat", "PORK FAT"], ["salt", "SALT"], ["fish sauce", "FISH SAUCE"], ["spices", "SPICES"], ["chickens", "CHICKENS"], ["vintage wine", "VINTAGE WINE · OFFICERS"], ["celtic beer", "CELTIC BEER · EVERYONE ELSE"], ["and grain in", "GRAIN… STAGGERING AMOUNTS"]];
const Lista2: React.FC<{ t: number }> = ({ t }) => {
  const a = T("other tablets read", D), m = T("one merchant mentions", D);
  const ts = LISTA2.map(([w]) => T(w, 374));
  const TOP0 = 190, FIL = 76;
  const nv = ts.reduce((s, t0) => s + clamp01((t - t0 + 0.15) / 0.3), 0);
  const H = 150 + FIL * Math.max(1.2, nv);
  let k = -1;
  ts.forEach((t0, i) => { if (t >= t0 - 0.1) k = i; });
  // brazo: apunta a la fila nueva (transición suave)
  const fy = (i: number) => TOP0 + 120 + i * FIL + 34;
  const PX = 1580, HH = 540, S = HH / 560, SX = PX - 66 * S, SY = 1040 - 322 * S;
  const ang = (i: number) => 90 + (Math.atan2(SY - fy(i), SX - 1250) * 180) / Math.PI;
  const kp = k < 0 ? 0 : k;
  const tr = k > 0 ? clamp01((t - ts[k] + 0.1) / 0.25) : 1;
  const apunta = k < 0 ? 40 : ang(Math.max(0, kp - 1)) + (ang(kp) - ang(Math.max(0, kp - 1))) * tr;
  const G = gesto(t, [[a, "camina"], [a + 1.4, "lee"], [ts[0], "señala"], [ts[6], "festeja"], [ts[6] + 0.9, "señala"], [ts[7], "festeja"], [ts[7] + 1.0, "señala"], [ts[8], "sorpresa"]]);
  const libre = t > ts[0] - 0.1 && !(t > ts[6] && t < ts[6] + 0.9) && !(t > ts[7] && t < ts[7] + 1.0) && t < ts[8];
  if (t > m) return <Sacos t={t} />;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" ventana="der" />
      <Chip t={t} t0={a + 0.3} t1={ts[0]} text="A SHOPPING LIST FOR A SMALL TOWN" color={C.violeta} x={760} y={110} centro size={54} />
      <div style={{ position: "absolute", left: 240, top: TOP0, width: 1020, height: H, transform: `scale(${ent(t, a + 0.2)}) rotate(-1deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #f2dfae, #e2c588)", borderRadius: 16, boxShadow: "14px 16px 0 rgba(20,8,40,.35)", border: "6px solid #b98a4a" }} />
        <div style={{ position: "absolute", left: -14, right: -14, bottom: -18, height: 36, borderRadius: 18, background: "#d2b07a", border: "6px solid #b98a4a" }} />
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 46, color: "#7a3d14", letterSpacing: 3 }}>VINDOLANDA · SHOPPING LIST</div>
        {LISTA2.map(([, tx], i) => {
          if (t < ts[i] - 0.1) return null;
          const e = ent(t, ts[i] - 0.1, 0, { damping: 9, stiffness: 220 });
          const ck = prog(t, ts[i] + 0.25, ts[i] + 0.45);
          return (
            <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 120 + i * FIL, height: 70, display: "flex", alignItems: "center", fontFamily, fontWeight: 700, fontSize: 42, color: "#4a2a10", opacity: clamp01(e * 2) }}>
              <div style={{ width: 90, transform: `scale(${e})` }}><Ic k={i} /></div>
              <span style={{ transform: `translateX(${(1 - clamp01(e)) * -40}px)` }}>{tx}</span>
              {ck > 0 && <span style={{ position: "absolute", right: 10, fontSize: 56, color: C.rojo, transform: `scale(${ck * (1 + 0.4 * Math.sin(ck * Math.PI))})` }}>✓</span>}
            </div>
          );
        })}
      </div>
      <Persona x={PX + 220 * (1 - prog(t, a, a + 1.4))} y={1040} h={HH} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" flip camina={t < a + 1.4 ? 1.3 : 0}
        {...G} bD={libre ? apunta + Math.sin(t * 9) * 3 : G.bD} cD={libre ? 4 : G.cD} inclina={libre ? -4 : G.inclina} mira={libre ? 0.6 : 0} miraY={libre ? (fy(kp) - 600) / 600 : 0} />
    </AbsoluteFill>
  );
};

// 6:28 · «un comerciante compró 5.000 medidas… y no sabía cómo pagar»: los sacos le caen encima hasta el casco
const FILAS: [number, number[]][] = [
  [1010, [140, 310, 480, 650, 820, 990, 1160, 1330, 1500, 1670]], [910, [230, 400, 570, 740, 910, 1080, 1250, 1420, 1590]],
  [810, [320, 490, 660, 830, 1000, 1170, 1340, 1510]], [725, [430, 600, 770, 940, 1110, 1280, 1450]], [630, [560, 720, 1200, 1360]],
];
const Sacos: React.FC<{ t: number }> = ({ t }) => {
  const m = T("one merchant mentions", D), pay = T("worrying about how", D);
  const sacos: { x: number; y: number; tf: number; r: number }[] = [];
  let n = 0;
  FILAS.forEach(([y, xs]) => xs.forEach((x) => { sacos.push({ x, y, tf: m + 0.25 + n * 0.068, r: ((n * 37) % 30) - 15 }); n++; }));
  const ult = sacos[sacos.length - 1].tf;
  const golpe = sacos.reduce((g, s) => (t > s.tf && t < s.tf + 0.12 ? 1 : g), 0);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" ventana="der" />
      <Persona x={960} y={1040 + golpe * 6} h={540} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f"
        {...gesto(t, [[m, "sorpresa"], [m + 0.6, "miedo"], [ult, "triste"]])} mira={t > pay ? Math.sin(t * 5) * 0.9 : 0} miraY={t < m + 0.6 ? -0.8 : 0} />
      {sacos.map((s, i) => {
        if (t < s.tf - 0.45) return null;
        const u = clamp01((t - (s.tf - 0.45)) / 0.45);
        const caida = (1 - u * u) * -1100;
        const rebote = t > s.tf ? -Math.abs(Math.sin((t - s.tf) * 14)) * Math.exp(-(t - s.tf) * 8) * 26 : 0;
        return <Item key={i} k="grano" x={s.x} y={s.y + caida + rebote} s={0.95} rot={s.r * (u < 1 ? 3 * (1 - u) : 1) * 0.6} />;
      })}
      {sacos.map((s, i) => t > s.tf && t < s.tf + 0.5 ? <div key={"p" + i} style={{ position: "absolute", left: s.x - 90, top: s.y + 30, width: 180, height: 50, borderRadius: "50%", background: "#f2e4c0", opacity: 0.6 * (1 - (t - s.tf) / 0.5), transform: `scale(${1 + (t - s.tf) * 2})` }} /> : null)}
      <Cu t={t} w="one merchant mentions" d={D} de={0} a={5000} sube={1.2} dur={3} y={170} size={140} suf=" MEASURES" color="#fff" dt={0.3} />
      {t > pay && <Chip t={t} t0={pay} text="…AND HOW DO I PAY?" color={C.rojo} x={960} y={330} centro size={52} />}
      <Emote t={t} t0={pay - 0.3} tipo="sudor" x={960} y={1040 - 450 * 540 / 560} s={1} />
    </AbsoluteFill>
  );
};

// 6:48 · camino de barro en perspectiva bajo la lluvia: el carrero empuja el carro trabado; los ladrones miran desde los matorrales
const CaminoLluvia3: React.FC<{ t: number; t0: number; tLadron: number }> = ({ t, t0, tLadron }) => {
  const FX = 960, FY = 560;
  const traba = Math.sin(t * 7) * 2;
  const av = 60 * prog(t, t0 + 1.2, t0 + 4.5);
  const susto = t > tLadron + 0.3;
  return (
    <Exterior t={t} tono="gris" viento={1.8} horizonte={470}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <defs><linearGradient id="campo3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7d9a5a" /><stop offset="1" stopColor="#4f7a34" /></linearGradient><linearGradient id="barro3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a7a56" /><stop offset="1" stopColor="#6a4a2e" /></linearGradient></defs>
        <rect x={0} y={FY} width={1920} height={1080 - FY} fill="url(#campo3)" />
        {/* cinta de barro: punto de fuga (960,560) → 1400 px abajo */}
        <path d={`M ${FX - 22} ${FY} L ${FX + 22} ${FY} L 1660 1080 L 260 1080 Z`} fill="url(#barro3)" />
        {/* postes del borde que achican hacia el fondo (perspectiva) */}
        {[0.04, 0.12, 0.24, 0.42, 0.7].map((k, i) => [-1, 1].map((sd) => { const y = FY + (1080 - FY) * k, hw = 22 + 678 * k, x = FX + sd * (hw + 30 + 60 * k), hh = 14 + 150 * k; return <rect key={i + "" + sd} x={x - (3 + 10 * k)} y={y - hh} width={6 + 20 * k} height={hh} rx={3} fill="#5a3a22" />; }))}
        {[-1, 1].map((s) => <path key={s} d={`M ${FX + s * 6} ${FY} L ${960 + s * 330} 1080`} stroke="#5a4028" strokeWidth={12} fill="none" />)}
        {[[0.15, -0.3], [0.32, 0.4], [0.55, -0.2], [0.82, 0.25]].map(([k, o], i) => { const y = FY + (1080 - FY) * k, hw = 22 + (700 - 22) * k; return <ellipse key={i} cx={FX + o * hw} cy={y} rx={hw * 0.28} ry={hw * 0.05} fill="#4a3a2e" opacity={0.85} />; })}
        {[[170, 770, 1.2], [1720, 740, 1.15], [470, 640, 0.6], [1460, 630, 0.55]].map(([x, y, s], i) => <g key={i}>{[0, 1, 2].map((j) => <circle key={j} cx={x + (j - 1) * 70 * s} cy={y - (j % 2) * 30 * s} r={80 * s} fill={["#3f6a2a", "#4f7a34", "#355a24"][j]} />)}</g>)}
        <g transform={`translate(${FX + 20} ${FY + 40}) scale(0.16)`}><rect x={-220} y={-30} width={440} height={80} fill="#8a5a2a" /><circle cx={-130} cy={90} r={70} fill="#5a3418" /><circle cx={130} cy={90} r={70} fill="#5a3418" /></g>
      </svg>
      {t < tLadron && [[170, 750], [1720, 720]].map(([x, y], i) => { const p = Math.sin(t * 1.6 + i * 2) > -0.5 ? 1 : 0.1; return <div key={"oj" + i} style={{ position: "absolute", left: x - 40, top: y - 10, opacity: p }}>{[0, 1].map((j) => <div key={j} style={{ position: "absolute", left: j * 44, top: 0, width: 30, height: 18, borderRadius: "50%", background: "#fff36a", boxShadow: "0 0 18px #fff36a" }} />)}</div>; })}
      {t > tLadron - 0.2 && [[150, 760, 1.5], [1700, 730, 1.45], [470, 640, 0.75]].map(([x, y, s], i) => <Picto key={i} x={x + (i === 1 ? -140 * prog(t, tLadron + 0.6, tLadron + 2.2) : 0)} y={y} s={s} t={t} seed={70 + i} sube={tLadron + i * 0.18} grita={i === 0} />)}
      {/* el carro trabado en el barro y el carrero que empuja */}
      <div style={{ position: "absolute", left: av, top: 0, width: 1920, height: 1080, transform: `rotate(${-2 + traba}deg)`, transformOrigin: "1130px 940px" }}>
        <Carro x={1130} y={870} s={0.9} t={t * 0.25} carga="barril" />
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        {[0, 1, 2, 3, 4, 5].map((i) => { const k = ((t * 2.2 + i / 6) % 1), wx = (i % 2 ? 1247 : 1013) + av; return <circle key={i} cx={wx - 30 - k * 90} cy={950 - Math.sin(k * Math.PI) * 70} r={12 - k * 6} fill="#5a4028" opacity={1 - k} />; })}
      </svg>
      <Mula x={1540 + av} y={800} s={0.8} t={t} camina={0.8} />
      <Persona x={830 + av} y={1020} h={500} t={t} seed={44} ropa={{ ...CIVIL(1), tunica: "#8a6a3a", tunica2: "#5a4020" }}
        expr={susto ? "miedo" : "enojado"} habla={!susto} inclina={susto ? -6 : 16 + Math.sin(t * 6) * 3}
        bD={susto ? 130 : 84 + Math.sin(t * 6) * 6} cD={susto ? 100 : 10} bI={susto ? 130 : -62 + Math.sin(t * 6) * 6} cI={susto ? 100 : -24}
        mira={susto ? -0.9 : 0.6} camina={susto ? 0 : 0.7} />
      {susto && <Emote t={t} t0={tLadron + 0.3} tipo="susto" x={830 + av} y={1020 - 450 * 500 / 560} s={1} />}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
        {Array.from({ length: 90 }, (_, i) => { const k = (t * 1.9 * (0.7 + (i % 5) * 0.12) + i * 0.137) % 1, y = k * 1260 - 140, x = ((i * 157) % 2300) - 200 - 0.45 * y; return <line key={i} x1={x} y1={y} x2={x + 22} y2={y - 50} stroke="#e6eeff" strokeWidth={4} strokeLinecap="round" opacity={0.55} />; })}
      </svg>
    </Exterior>
  );
};

// 7:10 · «remember that»: los tres miran el camino vacío y giran a cámara a la vez; uno señala TRAP #7
const Recorda: React.FC<{ t: number; t0: number; tSen: number; tPara: number }> = ({ t, t0, tSen, tPara }) => {
  const gira = t > t0 + 0.15;
  const lejos = prog(t, tPara, t0 - 0.3);
  return (
    <Exterior t={t} tono="gris" viento={1.6} horizonte={560}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <path d="M 1500 600 L 1540 600 L 1920 800 L 1920 900 Z" fill="#7a5a3a" />
        {lejos < 1 && <g transform={`translate(${1800 - 280 * lejos} ${790 - 180 * lejos}) scale(${0.32 - 0.26 * lejos})`} opacity={1 - lejos}><rect x={-220} y={-30} width={440} height={80} fill="#8a5a2a" /><path d="M -120 -30 Q -130 -120 -70 -130 Q -10 -120 -20 -30 Z M 20 -30 Q 10 -120 70 -130 Q 130 -120 120 -30 Z" fill="#d9b878" /><circle cx={-130} cy={90} r={70} fill="#5a3418" /><circle cx={130} cy={90} r={70} fill="#5a3418" /></g>}
        <rect x={-20} y={540} width={1000} height={170} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 170} y={500} width={110} height={50} rx={5} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />)}
      </svg>
      {[0, 1, 2].map((i) => { const k = ((t * 0.4 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 1620 + k * 200, top: 680 - k * 30, width: 90 + k * 80, height: 30 + k * 20, borderRadius: "50%", background: "#d8ccb6", opacity: 0.5 * (1 - k) }} />; })}
      {[520, 900, 1280].map((x, i) => {
        const sen = i === 1 && t > tSen;
        return <Persona key={i} x={x} y={1050} h={520 - (i % 2) * 10} t={t} seed={[3, 50, 51][i]} ropa={i === 0 ? TUNGRO : AUX(i)} casco="legion" malla pantalon="#5a4a3a" capa={i === 0 ? "#3f6b2a" : undefined}
          flip={!gira} mira={gira ? (sen ? 0.5 : 0) : 0.9} expr={gira ? (sen ? "sorpresa" : "enojado") : t > tPara + 1.2 ? "triste" : "neutro"} habla={sen}
          salta={gira ? t0 + 0.15 + i * 0.04 : undefined} inclina={gira ? 0 : 6}
          bD={sen ? 140 + Math.sin(t * 6) * 4 : gira ? 20 : i === 0 ? 150 : i === 2 ? 60 : 12} cD={sen ? 5 : !gira && i === 0 ? 145 : !gira && i === 2 ? 120 : 20} bI={gira && i !== 1 ? 40 : 12} cI={gira && i !== 1 ? 110 : 20} />;
      })}
    </Exterior>
  );
};

export const W3: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 331 || t > 432) return null;
  const x0 = conv(t);
  const anda = t > T("so everything has to come", D) && t < T("so everything has to come", D) + 4.5 || (t > T("but here is the trap", D) + 1 && t < T("but here is the trap", D) + 7);
  const sinConv = t > T("the convoy simply stops", D);
  const feliz = t > T("yes", D) && t < T("one of the most famous", D);
  return (
    <>
      {/* el campo pelado donde no crece nada */}
      {t < 342 && [0, 1, 2, 3, 4, 5].map((i) => <g key={i}><svg style={{ position: "absolute", left: M3 - 300 + i * 180, top: BASE - 60, overflow: "visible" }} width={1} height={1}><path d="M 0 60 Q -4 20 6 0 M 0 60 Q 14 30 26 26" stroke="#6b8a3a" strokeWidth={6} fill="none" /><ellipse cx={0} cy={62} rx={50} ry={10} fill="#6b4a2f" /></svg></g>)}
      {/* el convoy */}
      {!sinConv && [0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Carro x={x0 + i * 900} y={BASE - 120} t={anda ? t : 0} s={0.9} carga={i === 1 ? "barril" : "grano"} />
          <div style={{ position: "absolute", left: 0, top: 0, transform: "scaleX(-1)", transformOrigin: `${x0 + i * 900 - 470}px 0px` }}><Mula x={x0 + i * 900 - 470} y={BASE - 150} t={t} camina={anda ? 1.5 : 0} s={0.75} carga={false} /></div>
        </React.Fragment>
      ))}
      {!sinConv && <Persona x={x0 - 800} y={BASE} h={220} t={t} seed={83} ropa={CIVIL(1)} camina={anda ? 1.4 : 0} flip expr={t > 409 ? "miedo" : "neutro"} />}
      {/* vos y tus compañeros al pie del muro */}
      {[-560, -300].map((dx, i) => <Persona key={i} x={YO3 + dx} y={BASE} h={220} t={t} seed={50 + i} ropa={AUX(i + 1)} casco="legion" malla={i === 1} pantalon="#5a4a3a"
        {...gesto(t, [[331, "triste"], [T("so everything has to come", D) + 4.6, "carga"], [T("yes", D), "festeja"], [T("one of the most famous", D), "habla"], [T("because the wall", D), "habla"], [T("but here is the trap", D), "encoge"], [T("if the convoy is late", D), "triste"], [418, "tiembla"]])}
        manoD={feliz ? <g transform="translate(0 -40) scale(0.5)"><path d="M -60 -90 L 60 -90 L 50 100 L -50 100 Z" fill="#e8a83a" /><ellipse cx={0} cy={-92} rx={66} ry={22} fill="#fff8e8" /></g> : undefined} />)}
      <Persona x={YO3} y={BASE} h={240} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a"
        expr={t < 342 ? "triste" : feliz ? "feliz" : t < 372 ? "neutro" : t < 374.7 ? "sorpresa" : t < 414 ? "neutro" : t < 418 ? "triste" : t < 421.7 ? "orgullo" : "miedo"}
        bD={t > T("you eat what you have", D) && t < T("if the beer does not come", D) ? 140 : t > T("you write a polite", D) && t < 421.7 ? 100 : feliz ? 160 : 12}
        cD={t > T("you eat what you have", D) && t < T("if the beer does not come", D) ? 130 : 20} salta={feliz ? Math.abs(Math.sin(t * 6)) * 24 : 0}
        manoD={t > T("you eat what you have", D) && t < T("if the beer does not come", D) ? <g transform="translate(0 -30) scale(0.6)"><ellipse rx={80} ry={40} fill="#a8621f" /><ellipse cy={-6} rx={74} ry={34} fill="#d98a35" /></g>
          : t > T("you write a polite", D) && t < 421.7 ? <rect x={-60} y={-80} width={120} height={80} rx={6} fill="#c9a46a" stroke="#8a6a3a" strokeWidth={5} /> : undefined} />
      {/* familias del muro */}
      {t > T("was never just a place", D) - 0.4 && t < 408.2 && [0, 1, 2, 3].map((i) => <Persona key={i} x={M3 - 1500 + i * 260} y={BASE} h={i % 2 ? 130 : 210} t={t} seed={90 + i} ropa={CIVIL(i + 2)} expr="feliz" aparece={T("was never just a place", D) - 0.4 + i * 0.15} mira={0.5} />)}
      {/* ladrones en la loma */}
      {t > T("past people who would", D) - 0.2 && t < 415 && [0, 1, 2].map((i) => <Picto key={i} x={CV0 - 2600 + i * 220} y={BASE - 10} s={1.1} t={t} seed={60 + i} sube={T("past people who would", D) + i * 0.15} />)}
    </>
  );
};

export const S3: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 331 || t > 432) return null;
  const yo = pant(YO3, cabeza(YO3, BASE, 240).y, c);
  const cargas: [string, string, React.ReactNode][] = [
    ["grain", "GRAIN", <Item k="grano" x={0} y={0} s={0.8} />], ["wine", "WINE", <Item k="olla" x={0} y={0} s={0.8} />], ["salt", "SALT", <Item k="saco" x={0} y={0} s={0.8} />],
    ["nails", "NAILS", <Item k="cadena" x={0} y={0} s={0.7} />], ["leather", "LEATHER", <Bota x={0} y={0} s={0.8} />],
  ];
  return (
    <>
      <CartelTrampa t={t} t0={331.18} n={3} titulo="THE SUPPLY LINE" color={C.naranja} />
      <Ch t={t} w="here is the thing" d={D} txt="THE END OF THE WORLD…" y={150} c="#2a2350" size={60} dur={2.3} />
      <Plano t={t} t0={T("nothing grows there", D) - 0.1} t1={T("grain", D) - 0.15} desde={[960, 600]} fondo="#6f82a0"><Camino3 t={t} t0={T("nothing grows there", D)} tTodo={T("so everything has to come", D)} /></Plano>
      <Ch t={t} w="nothing grows there" d={D} txt="NOTHING YOU WANT TO EAT GROWS HERE" y={150} c={C.rojo} size={54} dur={2.4} />
      <Ch t={t} w="so everything has to come" d={D} txt="EVERYTHING COMES UP THE ROADS" y={150} c={C.violeta} size={60} dur={2.2} />
      {cargas.map(([w, tx, ic], i) => t > T(w, D) && t < T("and above all", D) + 0.3 ? (
        <div key={i} style={{ position: "absolute", left: 230 + i * 365 - 110, top: 760, width: 220, height: 220, transform: `scale(${ent(t, T(w, D))})` }}>
          <div style={{ position: "absolute", left: 110, top: 90 }}>{ic}</div>
          <Chip t={t} t0={T(w, D)} text={tx} color={[C.ambar, C.rojo, "#fff", "#5d6577", C.tierra][i]} tinta={i === 0 || i === 2 ? C.noche : "#fff"} x={110} y={210} centro size={44} />
        </div>
      ) : null)}
      <Ch t={t} w="and above all" d={D} txt="AND ABOVE ALL…" y={150} c={C.teal} tinta={C.noche} size={60} dur={0.9} />
      {t > T("beer", 345) && t < T("one of the most famous", D) && <Barril x={960 + 560 * prog(t, T("the soldiers on the northern", D), T("the soldiers on the northern", D) + 0.6)} y={600 + 120 * prog(t, T("the soldiers on the northern", D), T("the soldiers on the northern", D) + 0.6)} s={1.6 - 0.5 * prog(t, T("the soldiers on the northern", D), T("the soldiers on the northern", D) + 0.6)} t={t} t0={T("beer", 345)} />}
      <Gr t={t} w="yes beer" d={D} txt="YES. BEER." y={200} size={170} c={C.ambar} dur={1.6} />
      <Ch t={t} w="a local beer called" d={D} txt="CERVESA" y={150} c={C.ambar} tinta={C.noche} size={90} dur={3.6} dt={0.6} />
      <Ch t={t} w="they took it extremely" d={D} txt="TAKEN EXTREMELY SERIOUSLY" y={150} c={C.rojo} size={60} dur={2.0} />
      <Plano t={t} t0={T("one of the most famous", D) - 0.1} t1={T("that is it", D) - 0.1} desde={[960, 600]} fondo="#1b1240"><Masclus2 t={t} /></Plano>
      <Ch t={t} w="that is it" d={D} txt="THAT'S IT." y={150} c="#2a2350" size={70} dur={1.0} />
      <Gr t={t} w="that is the emergency" d={D} txt="THE EMERGENCY." y={200} size={150} c={C.rojo} borde="#fff" dur={1.6} />
      {t > T("that is the emergency", D) && t < T("other tablets read", D) + 0.2 && <Barril x={yo[0] + 340} y={yo[1] + 120} s={0.9 * c.z} t={t} t0={T("that is the emergency", D)} vacio />}
      <Plano t={t} t0={T("other tablets read", D) - 0.1} t1={T("and shoes", D) - 0.15} desde={[960, 600]} fondo="#c9773a"><Lista2 t={t} /></Plano>
      <Plano t={t} t0={T("and shoes", D) - 0.05} t1={T("because the wall", D) - 0.1} desde={[960, 1000]} fondo="#9fc6e0"><Zapatos t={t} /></Plano>
      <Gr t={t} w="was never just a place" d={D} txt="NOT JUST SOLDIERS." y={200} size={120} c={C.lima} dur={2.2} />
      <Gr t={t} w="but here is the trap" d={D} txt="BUT HERE'S THE TRAP." y={200} size={120} c={C.rojo} borde="#fff" dur={1.3} />
      <Ch t={t} w="all of this travels" d={D} txt="LONG ROADS" x={560} y={150} c={C.violeta} size={60} dur={3.6} />
      <Ch t={t} w="in carts" d={D} txt="CARTS" x={1000} y={150} c={C.tierra} size={60} dur={2.9} />
      <Ch t={t} w="in the rain" d={D} txt="RAIN" x={1380} y={150} c="#3d7fc9" size={60} dur={2.1} />
      <Plano t={t} t0={T("all of this travels", D) - 0.1} t1={T("if the convoy is late", D) - 0.15} desde={[960, 600]} fondo="#6f82a0"><CaminoLluvia3 t={t} t0={T("all of this travels", D)} tLadron={T("past people who would", D)} /></Plano>
      <Ch t={t} w="past people who would" d={D} txt="THIEVES" y={260} c={C.rojo} size={70} dur={1.6} />
      <Ch t={t} w="if the convoy is late" d={D} txt="CONVOY LATE?" y={150} c={C.ambar} tinta={C.noche} size={66} dur={1.9} />
      <Ch t={t} w="you eat what you have" d={D} txt="EAT WHAT YOU HAVE" y={260} c="#2a2350" size={54} dur={1.6} />
      <Ch t={t} w="if the beer does not come" d={D} txt="NO BEER?" y={150} c={C.rojo} size={66} dur={1.5} />
      <Ch t={t} w="you write a polite" d={D} txt="WRITE A POLITE LETTER… AND WAIT" y={260} c={C.teal} tinta={C.noche} size={52} dur={2.2} />
      {t > T("and if a whole province", D) && t < T("remember that", D) && (
        <>
          {Array.from({ length: 8 }, (_, i) => { const k = (t * 0.9 + i / 8) % 1; const corta = t > T("the convoy simply stops", D) - 0.1; return corta ? null : <Moneda key={i} x={300 + k * 1320} y={380 + Math.sin(k * Math.PI) * -120} r={36} t={t} gira={2} />; })}
          <Ch t={t} w="and if a whole province" d={D} txt="A PROVINCE STOPS PAYING" y={150} c={C.rojo} size={60} dur={3.4} />
          {t > T("the convoy simply stops", D) && <Grande t={t} t0={T("the convoy simply stops", D)} text="…NO MORE CONVOYS" y={300} size={90} color="#fff" borde={C.noche} />}
        </>
      )}
      <Plano t={t} t0={T("the convoy simply stops", D) - 0.1} t1={431.3} desde={[960, 600]} fondo="#6f82a0"><Recorda t={t} t0={T("remember that", D)} tSen={T("we are going to come", D)} tPara={T("the convoy simply stops", D)} /></Plano>
      <Gr t={t} w="remember that" d={D} txt="REMEMBER THAT." y={200} size={140} c={C.ambar} dur={2.0} />
      <Ch t={t} w="we are going to come" d={D} txt="→ TRAP #7" x={1480} y={400} c={C.rojo} size={64} dur={1.5} />
      <Emote t={t} t0={T("if the beer does not come", D)} t1={T("and if a whole province", D)} tipo="lagrimas" x={yo[0]} y={yo[1]} s={c.z * 0.5} />
    </>
  );
};
