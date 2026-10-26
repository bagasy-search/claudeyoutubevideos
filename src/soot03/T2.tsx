import React from "react";
import { Sala } from "./sets";
import { Pantalones } from "./escenas4";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Pergamino } from "./kit";
import { Fuerte, Ropa, Mula } from "./kit2";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant, FUERTE_V } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Carro, Banio, TablillaGrande, Burbuja, gesto, Termometro } from "./kit3";

// TRAMPA 2 · EL CLIMA (182,6-331,2 s). Viajamos por el muro a la cresta del Whin Sill: viento del Atlántico, lluvia,
// llovizna, lluvia de costado, nieve; el barro que traba el carro; los pantalones; la capa británica; Vindolanda y sus
// tablillas (medias de mamá); el parte de 752 hombres; los ojos irritados; y el baño caliente que te salva.
const D = 182;
const M2 = MC(2);
const YO2 = M2 + 330;
const VX = FUERTE_V; // Vindolanda
const BX = VX + 2300; // baño, afuera del fuerte
const CX = M2 + 2600; // el carro en el barro
const tVin = T("we know about the socks", D);
const YOV = VX + 1050; // vos, ya en Vindolanda

export const keys2: K[] = [
  [183.0, 7000, 520, 0.32], [184.4, YO2, 470, 1.5], ck("the central part", D, M2 + 200, 540, 0.9), ck("it is beautiful", D, M2 + 200, 520, 0.42),
  ck("it is also exactly", D, YO2, 470, 1.55), ck("with nothing to stop", D, YO2 + 40, 470, 1.8), ck("it rains", D, YO2, 480, 1.2),
  ck("then it drizzles", D, YO2, 470, 1.35), ck("then it rains sideways", D, YO2 - 100, 490, 0.95), ck("it snows", D, YO2, 470, 1.5),
  ck("the roads turn into mud", D, CX, 780, 1.05), ck("one merchant", D, CX, 760, 1.2), ck("because the roads are so bad", D, CX + 60, 780, 1.4),
  ck("so you adapt", D, YO2, 470, 1.6), ck("you wear trousers", D, YO2, 520, 1.25), ck("on the wall", D, YO2 - 300, 500, 0.9),
  ck("you want wool", D, YO2, 470, 1.7), ck("a heavy hooded cloak", D, YO2, 480, 1.4), ck("britain became so famous", D, YO2, 480, 1.4),
  ck("we know about the socks", D, VX + 300, 640, 0.42), ck("just behind the line", D, VX, 660, 0.55), ck("in the 1970s", D, VX, 700, 0.7),
  ck("and one of them", D, YOV, 700, 1.15), ck("somewhere", D, YOV, 690, 1.3), ck("the cold does not only", D, YOV, 700, 1.6),
  ck("it makes you sick", D, YOV, 690, 1.9), ck("at vindolanda", D, VX, 640, 0.5, 1.2), ck("ten men", D, VX, 700, 0.6),
  ck("that was a real enemy", D, VX + 200, 700, 0.8), ck("the one thing that kept", D, BX, 640, 0.75), ck("every fort had one", D, BX - 300, 640, 0.5),
  ck("fires burning under", D, BX, 660, 0.8), ck("if you want to know", D, BX, 680, 1.0), ck("it was that hot room", D, BX, 660, 1.25), [331.0, BX, 650, 1.1],
];
export const amb2: [number, Pal][] = [[184.4, "gris"], [194.1, "dia"], [195.3, "gris"], [200.2, "tormenta"], [204.6, "nieve"], [206.3, "gris"], [244.4, "gris"], [312.7, "atardecer"]];
export const lluvia2: [number, number][] = [[184.4, 0.45], [193.9, 0.3], [194.2, 0], [195.4, 0.05], [200.2, 0.75], [201.2, 0.25], [202.4, 1], [204.2, 1], [205.0, 0], [206.4, 0.55], [217.2, 0.4], [244.4, 0.15], [312.5, 0], [331, 0]];
export const nieve2: [number, number][] = [[204.3, 0], [205.2, 1], [206.2, 0.9], [206.8, 0], [331, 0]];
export const sol2: [number, number, number][] = [[194.1, 1300, 220], [195.4, -999, 0], [312.7, 1500, 420]];

const BARRO = "#6b4a2f";
// el muro sobre su cresta de roca negra, viento que llega del Atlántico (corte)
const Cresta: React.FC<{ t: number }> = ({ t }) => {
  const a = T("the wind sill", D), b = T("with cliffs facing north", D), c = T("it is also exactly", D);
  const p0 = T("the central part", D) + 0.6, up = prog(t, p0, p0 + 0.9);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#4f6488,#9fb2cc 60%,#d8dfe8)" }}>
      <div style={{ position: "absolute", left: 1380, top: 60, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,190,.55), rgba(255,236,190,0) 65%)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <defs>
          <linearGradient id="roca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a5866" /><stop offset="1" stopColor="#24222e" /></linearGradient>
          <clipPath id="risco"><path d={`M 0 1080 L 0 ${980 - 60 * up} L 420 ${960 - 120 * up} L 700 ${880 - 320 * up} L 760 ${880 - 420 * up} L 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1920 ${940 - 200 * up} L 1920 1080 Z`} /></clipPath>
        </defs>
        {/* colinas lejanas (Escocia al norte, Britania al sur) */}
        <path d={`M 0 ${700 + 40 * Math.sin(t * 0.05)} Q 300 600 640 690 T 1300 650 T 1920 700 L 1920 1080 L 0 1080 Z`} fill="#7d8fae" opacity={0.7} />
        <path d="M 0 800 Q 360 720 760 790 T 1500 760 T 1920 790 L 1920 1080 L 0 1080 Z" fill="#6b7f98" opacity={0.8} />
        {/* el risco: roca con estratos, grietas y luz en la cara sur */}
        <path d={`M 0 1080 L 0 ${980 - 60 * up} L 420 ${960 - 120 * up} L 700 ${880 - 320 * up} L 760 ${880 - 420 * up} L 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1920 ${940 - 200 * up} L 1920 1080 Z`} fill="url(#roca)" />
        <g clipPath="url(#risco)">
          {Array.from({ length: 12 }, (_, k) => <path key={k} d={`M 0 ${470 + k * 52} Q 480 ${450 + k * 52 + (k % 3) * 14} 960 ${480 + k * 52} T 1920 ${470 + k * 52}`} stroke="#000" strokeOpacity={0.22} strokeWidth={6} fill="none" />)}
          {[[560, 640], [680, 560], [820, 520], [610, 760], [740, 700]].map(([x, y], k) => <path key={"g" + k} d={`M ${x} ${y} l 18 50 l -14 40 l 22 60`} stroke="#15141c" strokeWidth={6} fill="none" strokeLinecap="round" />)}
          <path d={`M 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1920 ${940 - 200 * up} L 1920 1080 L 940 1080 Z`} fill="#fff" opacity={0.07} />
        </g>
        {/* pasto que cubre la ladera sur */}
        <path d={`M 940 ${1080} L 1920 1080 L 1920 ${940 - 200 * up} L 1300 ${900 - 360 * up} L 900 ${880 - 440 * up} L 960 ${900 - 400 * up} Z`} fill="#7fb34a" opacity={0.85} />
        {Array.from({ length: 22 }, (_, i) => { const x = 980 + i * 42, y0 = 900 - 440 * up + (x - 900) * (up * 80 / 400) + 30; return <path key={"h" + i} d={`M ${x} ${y0 + 40} l 6 -26 l 6 26`} stroke="#5f8f34" strokeWidth={5} fill="none" opacity={up} transform={`rotate(${Math.sin(t * 2 + i) * 6} ${x} ${y0 + 40})`} />; })}
        {/* la muralla sobre la cresta, con almenas */}
        <g opacity={up}>
          <path d={`M 700 ${880 - 320 * up} L 760 ${880 - 420 * up} L 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1300 ${900 - 360 * up - 70} L 900 ${880 - 440 * up - 70} L 760 ${880 - 420 * up - 70} L 700 ${880 - 320 * up - 70} Z`} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={5} />
          {Array.from({ length: 14 }, (_, i) => { const x = 770 + i * 38, y = x < 900 ? 880 - 420 * up - 70 - (x - 760) * (20 * up / 140) : 880 - 440 * up - 70 + (x - 900) * (80 * up / 400); return <rect key={"a" + i} x={x} y={y - 26} width={22} height={28} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={4} />; })}
        </g>
        {/* niebla que corre por el valle norte */}
        {[0, 1, 2].map((k) => <ellipse key={"n" + k} cx={((t * (30 + k * 12) + k * 700) % 2600) - 300} cy={760 + k * 70} rx={420} ry={60} fill="#e8eef6" opacity={0.35} />)}
        {t > c && Array.from({ length: 16 }, (_, i) => {
          const k = ((t - c) * 1.3 + i * 0.13) % 1;
          const y = 220 + (i % 8) * 50;
          return <path key={i} d={`M ${-300 + k * 2300} ${y} q 60 -18 120 0 t 120 0`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.75 * Math.sin(k * Math.PI)} />;
        })}
      </svg>
      {up > 0.5 && <Persona {...gesto(t, [[a, "señala"], [T("it is beautiful", D) - 0.6, "festeja"], [b, "señala"], [c, "miedo"], [T("with nothing to stop", D), "tiembla"]])} x={905} y={880 - 440 * up - 66} h={330} t={t} seed={3} ropa={TUNGRO} casco="legion" malla capa="#3f6b2a" inclina={t > c ? -14 : 0} />}
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily, fontWeight: 700, fontSize: 54, color: "#fff" }}>← NORTH</div>
      <div style={{ position: "absolute", right: 60, top: 60, fontFamily, fontWeight: 700, fontSize: 54, color: "#fff" }}>SOUTH →</div>
      {t > Math.min(a, p0 + 0.5) && <Chip t={t} t0={Math.min(a, p0 + 0.5)} text="THE WHIN SILL" color="#2a2a36" x={1380} y={430} centro size={64} />}
      {t > b && <Chip t={t} t0={b} t1={T("with nothing to stop", D) - 0.2} text="CLIFFS FACING NORTH" color={C.violeta} x={520} y={820} centro size={50} />}
      {t > c && <Chip t={t} t0={c} text="ATLANTIC WIND →" color={C.teal} tinta={C.noche} x={460} y={200} centro size={62} />}
      {t > T("with nothing to stop", D) && <Grande t={t} t0={T("with nothing to stop", D)} text="NOTHING TO STOP IT" y={880} size={84} color={C.ambar} />}
    </AbsoluteFill>
  );
};
// Siria al sol vs. el muro
const Siria: React.FC<{ t: number }> = ({ t }) => {
  const a = T("if you come from syria", D), b = T("this is going to hurt", D);
  const k = prog(t, b - 0.1, b + 0.3);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${k > 0.5 ? "#55607a" : "#ffb347"}, ${k > 0.5 ? "#8b95aa" : "#ffe0a0"})` }}>
      <div style={{ position: "absolute", left: 1300, top: 140, width: 300, height: 300, borderRadius: "50%", background: "#fff2b0", transform: `scale(${1 - k})` }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 0 820 Q 480 740 960 800 T 1920 790 L 1920 1080 L 0 1080 Z" fill={k > 0.5 ? "#6d8a4a" : "#e8c27a"} />
        {[360, 1560].map((x) => <g key={x} opacity={1 - k}><rect x={x - 12} y={560} width={24} height={260} fill="#8a5a2a" />{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={x + Math.cos(i * 1.3) * 90} cy={560 + Math.sin(i * 1.3) * 30} rx={110} ry={26} fill="#3f8a3a" transform={`rotate(${i * 40 - 80} ${x} 560)`} />)}</g>)}
        {k > 0 && Array.from({ length: 70 }, (_, i) => { const kk = (t * 2.2 + i * 0.137) % 1; const x = (i * 97) % 1920; return <line key={i} x1={x} y1={kk * 1080} x2={x + 20} y2={kk * 1080 + 50} stroke="#d6e6ff" strokeWidth={5} opacity={k} />; })}
      </svg>
      {(() => { const g = gesto(t, [[a, "festeja"], [b, "tiembla"]]); return <Persona {...g} x={900 + g.dx} y={880} h={460} t={t} seed={24} ropa={AUX(1)} casco="legion" malla />; })()}
      <Termometro t={t} t0={a} de={35} a={6} dur={0.4} x={1560} y={560} s={1.1} />
      <Chip t={t} t0={a} text={k > 0.5 ? "BRITAIN · 6°C · RAIN" : "SYRIA · 35°C"} color={k > 0.5 ? "#2a2350" : C.naranja} x={960} y={150} centro size={76} />
    </AbsoluteFill>
  );
};
// romanos de toga que se burlan de los pantalones
const Burla: React.FC<{ t: number }> = ({ t }) => {
  const a = T("for centuries", D);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {[300, 520, 1400, 1620].map((x) => <rect key={x} x={x - 40} y={260} width={80} height={620} fill="#f6efe2" stroke="#c9b8a0" strokeWidth={6} />)}
        <rect x={0} y={880} width={1920} height={200} fill="#c9b8a0" />
      </svg>
      {[0, 1, 2].map((i) => <Persona key={i} x={420 + i * 230} y={880} h={360} t={t} seed={70 + i} ropa={{ ...CIVIL(i), tunica: "#f6efe2", tunica2: "#d8cfbf" }} expr="feliz" habla bD={i === 1 ? 110 : 20} cD={10} mira={0.8} viejo={i === 0} />)}
      <Persona x={1360} y={880} h={360} t={t} seed={31} ropa={AUX(3)} pantalon="#6b4a2f" expr="triste" mira={-0.6} />
      <Chip t={t} t0={a + 0.3} text="“BARBARIAN CLOTHES!”" color={C.rojo} x={660} y={220} centro size={64} />
      <Emote t={t} t0={a + 0.6} tipo="sudor" x={1400} y={420} s={0.8} />
      {t > T("romans had mocked", D) + 0.6 && <div style={{ position: "absolute", left: 1240, top: 690, width: 240, height: 240, border: `14px solid ${C.rojo}`, borderRadius: "50%", transform: `scale(${ent(t, T("romans had mocked", D) + 0.6)})` }} />}
    </AbsoluteFill>
  );
};
// edicto de precios con la capa británica resaltada
const Edicto: React.FC<{ t: number }> = ({ t }) => {
  const a = T("much later", D) - 0.1, b = T("british hooded cloak", D);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 860, background: "#f6e3b4", borderRadius: 20, border: "10px solid #8a5a2a", transform: `scale(${ent(t, a)}) rotate(-1.5deg)` }}>
        <div style={{ textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, color: "#7a3d14", marginTop: 30 }}>EDICT ON MAXIMUM PRICES · AD 301</div>
        {["WHEAT · 1 MODIUS ........ 100", "BEER · 1 SEXTARIUS ........ 4", "SOLDIER'S BOOTS ........ 100", "BIRRUS BRITANNICUS ........ 6,000", "SALT · 1 MODIUS ........ 100"].map((l, i) => {
          const hl = i === 3 && t > b;
          return <div key={i} style={{ marginLeft: 70, marginTop: 34, fontFamily, fontWeight: 700, fontSize: 50, color: hl ? "#fff" : "#4a2a17", background: hl ? C.rojo : "transparent", width: 1060, padding: "6px 14px", borderRadius: 12, opacity: t > a + 0.3 + i * 0.2 ? 1 : 0 }}>{l}</div>;
        })}
      </div>
      <Persona x={210} y={1030} h={370} t={t} seed={3} ropa={TUNGRO} casco="legion" malla capa="#3f6b2a" pantalon="#6b4a2f" {...gesto(t, [[a + 0.2, "lee"], [b, "señala"], [b + 1.4, "festeja"]])} />
      {t > b && <Chip t={t} t0={b + 0.2} text="THE BRITISH HOODED CLOAK" color={C.ambar} tinta={C.noche} x={960} y={1010} centro size={58} />}
    </AbsoluteFill>
  );
};
// excavación: estratos y tablillas que salen del barro
const Excava: React.FC<{ t: number }> = ({ t }) => {
  const a = T("in the 1970s", D), b = T("hundreds of them", D), c = T("preserved in wet", D);
  const n = t > b ? Math.min(60, Math.floor((t - b) * 40)) : Math.min(6, Math.floor(Math.max(0, t - a - 1.2) * 2.4));
  return (
    <AbsoluteFill style={{ background: "#9fc6e0" }}>
      {["#7fb34a", "#8a6a3a", "#6b4a2f", "#4a3420", "#2f2418"].map((col, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 300 + i * 160, height: 160, background: col }} />)}
      <div style={{ position: "absolute", left: 640, top: 300, width: 640, height: 640 * prog(t, a, a + 1.2), background: "rgba(20,12,8,.55)", borderRadius: "0 0 40px 40px" }} />
      <Persona x={1340} y={330} h={320} t={t} seed={77} ropa={CIVIL(2)} flip {...gesto(t, [[a, "cava"], [a + 1.6, "sorpresa"], [b, "festeja"], [c, "señala"]])} />
      {Array.from({ length: n }, (_, i) => {
        const x = 700 + ((i * 137) % 520), y = 820 - ((i * 53) % 160) - (i < 6 ? 0 : 0);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 110, height: 50, background: "#c9a46a", border: "4px solid #8a6a3a", borderRadius: 6, transform: `rotate(${(i * 23) % 30 - 15}deg)` }}><div style={{ margin: "12px 10px", height: 4, background: "#1d120a", opacity: 0.7 }} /><div style={{ margin: "0 10px", height: 4, width: 60, background: "#1d120a", opacity: 0.7 }} /></div>;
      })}
      <Chip t={t} t0={a} text="VINDOLANDA · 1973" color={C.violeta} x={960} y={140} centro size={64} />
      {[["LETTERS", "letters"], ["LISTS", "lists"], ["REPORTS", "reports"]].map(([tx, w], i) => t > T(w, D) && t < b + 0.4 ? <Chip key={i} t={t} t0={T(w, D)} text={tx} color={[C.rojo, C.teal, C.ambar][i]} tinta={i ? C.noche : "#fff"} x={400 + i * 560} y={240} centro size={56} /> : null)}
      {t > b && <Grande t={t} t0={b} text="HUNDREDS" y={240} size={120} color={C.ambar} />}
      {t > c && <Chip t={t} t0={c} t1={T("most of them were written", D)} text="WET MUD = 2,000 YEARS SAFE" color="#2f2418" x={960} y={1000} centro size={56} />}
    </AbsoluteFill>
  );
};
// el parte de fuerza: 752 → 296 → 31
const Parte: React.FC<{ t: number }> = ({ t }) => {
  const a = T("752 men", D), b = T("only 296", D), c = T("31 were unfit", D), d1 = T("15 sick", D), d2 = T("6 wounded", D), d3 = T("and 10 suffering", D);
  const col = (i: number) => {
    if (t > b && i >= 296) return "rgba(255,255,255,.12)";
    if (t > c && i < 31) return t > d3 && i >= 21 ? C.ambar : t > d2 && i >= 15 && i < 21 ? C.rojo : t > d1 && i < 15 ? C.lima : "#ff8aa0";
    return "#fff";
  };
  return (
    <AbsoluteFill>
      <Sala t={t} tono="noche" />
      {Array.from({ length: 752 }, (_, i) => {
        const cx = 110 + (i % 47) * 31, cy = 280 + Math.floor(i / 47) * 36;
        return t > T("the first cohort", D) + i * 0.002 ? <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 22, height: 30, borderRadius: "11px 11px 4px 4px", background: col(i) }} /> : null;
      })}
      <Cu t={t} w="752 men" d={D} de={0} a={752} sube={1} dur={Math.min(3.2, T("only 296", D) - T("752 men", D) - 0.3)} y={170} size={130} suf=" ON THE BOOKS" color="#fff" />
      <Cu t={t} w="only 296" d={D} de={752} a={296} sube={0.8} dur={Math.min(3.2, T("31 were unfit", D) - T("only 296", D) - 0.3)} y={170} size={130} suf=" AT THE FORT" color={C.teal} />
      <Cu t={t} w="31 were unfit" d={D} de={0} a={31} sube={0.6} dur={2.0} y={170} size={130} suf=" UNFIT" color="#ff8aa0" />
      {t > d1 && <Chip t={t} t0={d1} text="15 SICK" color={C.lima} tinta={C.noche} x={300} y={180} centro size={52} />}
      {t > d2 && <Chip t={t} t0={d2} text="6 WOUNDED" color={C.rojo} x={760} y={180} centro size={52} />}
      {t > d3 && <Chip t={t} t0={d3} text="10 · INFLAMED EYES" color={C.ambar} tinta={C.noche} x={1350} y={180} centro size={52} />}
      <Persona x={1760} y={1000} h={400} t={t} seed={91} ropa={{ ...AUX(0), tunica: "#a3202f", tunica2: "#5e0f1d" }} casco="centurion" {...gesto(t, [[T("the first cohort", D), "lee"], [b, "sorpresa"], [c, "enojado"], [d3, "niega"]])} />
      <Chip t={t} t0={T("the first cohort", D)} t1={b} text="1st COHORT OF TUNGRIANS" color={C.violeta} x={960} y={1000} centro size={56} />
      {t > T("men from belgium", D) && t < b && <Chip t={t} t0={T("men from belgium", D)} text="FROM BELGIUM · LIKE YOU" color={C.teal} tinta={C.noche} x={960} y={920} centro size={46} />}
    </AbsoluteFill>
  );
};
// cuartel con humo: ojos rojos
const Cuartel: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#5a3a26,#3a2418)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#2a1a10" }} />
    {Array.from({ length: 5 }, (_, i) => {
      const x = 260 + i * 350, cb = cabeza(x, 860, 330);
      return <React.Fragment key={i}><Persona x={x} y={860} h={330} t={t} seed={40 + i} ropa={AUX(i)} expr="triste" bD={150} cD={150} />
        <div style={{ position: "absolute", left: cb.x - 60 * cb.s * 1.7, top: cb.y - 30 * cb.s * 2, width: 120 * cb.s * 1.7, height: 60 * cb.s * 2, borderRadius: "50%", background: "rgba(232,52,74,.55)" }} /></React.Fragment>;
    })}
    {Array.from({ length: 12 }, (_, i) => { const k = (t * 0.3 + i / 12) % 1; return <div key={i} style={{ position: "absolute", left: (i * 173) % 1920 - 100, top: 900 - k * 900, width: 300 + k * 200, height: 300 + k * 200, borderRadius: "50%", background: "#9a8a7a", opacity: 0.35 * Math.sin(k * Math.PI) }} />; })}
    <Chip t={t} t0={T("ten men", D)} text="DAMP + SMOKE = SWOLLEN EYES" color={C.rojo} x={960} y={150} centro size={62} />
  </AbsoluteFill>
);
// corte del baño: caliente, tibio, frío, y el fuego debajo del piso
const Termas: React.FC<{ t: number }> = ({ t }) => {
  const r = [["HOT ROOM", "#e8344a", "with a hot room"], ["WARM ROOM", "#ff9a3d", "a warm room"], ["COLD PLUNGE", "#2ec4d6", "and a cold plunge"]] as const;
  const f = T("fires burning under", D);
  const feliz = T("if you want to know", D);
  return (
    <AbsoluteFill style={{ background: "#2d1b69" }}>
      {r.map(([n, col, w], i) => (
        <div key={i} style={{ position: "absolute", left: 120 + i * 580, top: 260, width: 520, height: 520, background: t > T(w, D) ? col : "#4a3a7a", borderRadius: 24, transition: "none", opacity: t > T(w, D) ? 1 : 0.4 }}>
          <div style={{ position: "absolute", top: 20, width: "100%", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill" }}>{n}</div>
          {i === 2 && t > T(w, D) && (
            <>
              <Persona x={260} y={470 + 18 * Math.sin(t * 1.4)} h={250} t={t} seed={44} ropa={TUNGRO} {...gesto(t, [[T(w, D), "sorpresa"], [T(w, D) + 0.8, "tiembla"]])} />
              <svg style={{ position: "absolute", left: 0, top: 250 }} width={520} height={270}>
                <path d={`M 0 ${40 + Math.sin(t * 3) * 8} ${Array.from({ length: 11 }, (_, k) => `L ${k * 52} ${40 + Math.sin(t * 3 + k * 0.9) * 10}`).join(" ")} L 520 270 L 0 270 Z`} fill="#bff3ff" opacity={0.6} />
                {[0, 1, 2].map((k) => <rect key={k} x={90 + k * 140} y={20 + Math.sin(t * 2 + k) * 8} width={60} height={60} rx={10} fill="#fff" stroke="#8fdcea" strokeWidth={5} transform={`rotate(${15 + k * 20} ${120 + k * 140} ${50})`} />)}
              </svg>
            </>
          )}
          {i === 1 && t > T(w, D) && <Persona x={260} y={500} h={300} t={t} seed={45} ropa={AUX(5)} {...gesto(t, [[T(w, D), "festeja"], [T(w, D) + 1.2, "duerme"]])} />}
          {i < 2 && t > T(w, D) && Array.from({ length: 6 }, (_, k) => { const kk = (t * 0.6 + k / 6) % 1; return <div key={k} style={{ position: "absolute", left: 60 + k * 70, top: 440 - kk * 360, width: 70, height: 70, borderRadius: "50%", background: "#fff", opacity: 0.45 * (1 - kk) }} />; })}
        </div>
      ))}
      <div style={{ position: "absolute", left: 120, top: 790, width: 1100, height: 150, background: "#3a2418" }}>
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 108, top: 0, width: 40, height: 150, background: "#8a5a3a" }} />)}
        {t > f && Array.from({ length: 9 }, (_, i) => <div key={"f" + i} style={{ position: "absolute", left: 76 + i * 108, top: 70 - Math.abs(Math.sin(t * 9 + i)) * 30, width: 40, height: 80, borderRadius: "50% 50% 30% 30%", background: i % 2 ? "#ff7a3d" : "#ffb020" }} />)}
      </div>
      {t > f && <Chip t={t} t0={f} text="FIRES UNDER THE FLOOR" color={C.naranja} x={960} y={1000} centro size={50} />}
      {(() => { const t0 = T("with a hot room", D); const x = t < f ? 1540 - 1160 * prog(t, t0 + 0.4, t0 + 2.4) : 380; return <Persona x={x} y={760} h={380} t={t} seed={3} ropa={TUNGRO} {...gesto(t, [[t0, "tiembla"], [T("a warm room", D), "encoge"], [f, "habla"], [feliz, "festeja"]])} camina={t > t0 + 0.4 && t < t0 + 2.4 ? 1.4 : 0} flip={t < t0 + 2.4} />; })()}
      <Chip t={t} t0={T("every fort had one", D)} t1={f} text="EVERY FORT HAD ONE" color={C.violeta} x={960} y={150} centro size={60} />
      {t > T("it was not rome", D) && <Chip t={t} t0={T("it was not rome", D)} text="ROME ✗" color="#2a2350" x={700} y={170} centro size={70} />}
      {t > T("it was that hot room", D) && <Chip t={t} t0={T("it was that hot room", D)} text="THE HOT ROOM ✓" color={C.rojo} x={1260} y={170} centro size={70} />}
    </AbsoluteFill>
  );
};

export const W2: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 182.5 || t > 332) return null;
  const pant_ = t > T("you wear trousers", D) ? "#6b4a2f" : undefined;
  const capa = t > T("a heavy hooded cloak", D) ? "#3f6b2a" : undefined;
  const sideways = t > T("then it rains sideways", D) && t < T("it snows", D);
  const viento = (t > T("it is also exactly", D) && t < 206) ? 1 : 0;
  const enV = t > tVin;
  return (
    <>
      {/* compañeros en la cresta */}
      {t < tVin && [-900, 700].map((dx, i) => <Persona key={i} x={YO2 + dx} y={TOP} h={220} t={t} seed={44 + i} ropa={AUX(i + 2)} casco="legion" malla={i === 0} pantalon={pant_ && t > 229 ? "#5a4a3a" : undefined} {...gesto(t, [[183, "tiembla"], [T("then it rains sideways", D), "miedo"], [206.3, "tiembla"], [T("nobody cares", D) - 0.3, "festeja"], [T("you want wool", D), "encoge"]])} inclina={viento * -8} />)}
      {/* vos */}
      {!enV && <Persona x={YO2} y={TOP} h={230} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon={pant_} capa={capa}
        {...gesto(t, [[183, "tiembla"], [194.1, "festeja"], [195.3, "miedo"], [T("it rains", D), "encoge"], [T("then it drizzles", D), "tiembla"], [T("then it rains sideways", D), "miedo"], [T("it snows", D), "sorpresa"], [206.3, "tiembla"],
          [T("so you adapt", D), "habla"], [T("no proper roman", D), "niega"], [T("you wear trousers", D), "festeja"], [T("on the wall", D), "habla"], [T("nobody cares", D), "festeja"], [T("you want wool", D), "habla"], [T("thick socks", D), "señala"], [T("a heavy hooded cloak", D), "festeja"], [T("britain became so famous", D), "habla"]])}
        inclina={viento * -10 + (sideways ? -6 : 0)} />}
      {/* el carro empantanado */}
      {t > 205 && t < 218 && (
        <>
          <ellipse cx={CX} cy={BASE + 40} rx={700} ry={70} fill={BARRO} />
          <Carro x={CX} y={BASE - 120 + Math.sin(t * 20) * 3} t={t * (t > 207 ? 1 : 0)} s={0.9} carga="barril" />
          <Mula x={CX + 470} y={BASE - 150} t={t} camina={t > 207 ? 1.5 : 0} s={0.75} carga={false} />
          <Persona x={CX - 380} y={BASE} h={230} t={t} seed={81} ropa={CIVIL(3)} expr={t > 213 ? "triste" : "enojado"} bD={140} cD={30} inclina={14} />
          {Array.from({ length: 10 }, (_, i) => { const k = (t * 1.7 + i / 10) % 1; return <circle key={i} cx={CX - 120 + (i % 2 ? 1 : -1) * k * 260 + i * 20} cy={BASE - 20 - Math.sin(k * Math.PI) * 160} r={14 + (i % 3) * 6} fill={BARRO} opacity={1 - k} />; })}
        </>
      )}
      {/* Vindolanda */}
      <Fuerte x={VX} y={BASE - 190} s={0.9} w={1700} piedra />
      {t > tVin - 1 && t < tVin + 7 && <div style={{ position: "absolute", left: VX - 420, top: BASE - 640, width: 840, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 120, color: "#fff", WebkitTextStroke: "14px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, tVin + 0.3)})` }}>VINDOLANDA</div>}
      {enV && <Persona x={YOV} y={BASE} h={240} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" aparece={tVin + 2}
        {...gesto(t, [[tVin + 2, "habla"], [T("a letter from home", D), "sorpresa"], [T("it says", D), "lee"], [T("two pairs of underpants", D), "festeja"], [T("somewhere", D), "triste"], [T("the cold does not only", D), "tiembla"], [T("it makes you sick", D), "miedo"], [T("at vindolanda", D), "triste"]])} />}
      {/* el baño humeante */}
      <Banio x={BX} y={BASE - 310} t={t} s={1} />
    </>
  );
};

export const S2: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 182.5 || t > 332) return null;
  const yo = pant(YO2, cabeza(YO2, TOP, 230).y, c);
  const yv = pant(YOV, cabeza(YOV, BASE, 240).y, c);
  const iconos: [string, string, string][] = [["it rains", "RAIN", "#3d7fc9"], ["then it drizzles", "DRIZZLE", "#5b8fc9"], ["then it rains sideways", "SIDEWAYS RAIN", "#2a2350"], ["it snows", "SNOW", "#9aa4b4"]];
  return (
    <>
      <CartelTrampa t={t} t0={182.64} n={2} titulo="THE WEATHER" color="#3d7fc9" />
      <Plano t={t} t0={T("if you come from syria", D)} t1={T("the central part", D) - 0.1} desde={[yo[0], yo[1]]} fondo="#ffb347"><Siria t={t} /></Plano>
      <Plano t={t} t0={T("the central part", D) + 0.6} t1={T("it is beautiful", D) - 0.15} desde={[960, 600]} fondo="#5c6f8f"><Cresta t={t} /></Plano>
      <Ch t={t} w="the central part" d={D} txt="THE CENTRAL SECTION" y={150} c={C.violeta} size={60} dur={0.7} dt={0.35} />
      <Gr t={t} w="it is beautiful" d={D} txt="BEAUTIFUL." y={200} size={150} c={C.lima} dur={1.0} />
      <Plano t={t} t0={T("it is also exactly", D) + 0.2} t1={T("it rains", D) - 0.2} desde={[960, 400]} fondo="#5c6f8f"><Cresta t={t} /></Plano>
      {iconos.map(([w, tx, col], i) => t > T(w, D) && t < T("the roads turn into mud", D) ? <Chip key={i} t={t} t0={T(w, D)} text={tx} color={col} x={330 + i * 420} y={150} centro size={i === 2 ? 50 : 58} /> : null)}
      {t > T("then it rains sideways", D) && t < T("it snows", D) && Array.from({ length: 40 }, (_, i) => { const k = (t * 3 + i * 0.173) % 1; return <div key={i} style={{ position: "absolute", left: -200 + k * 2400, top: (i * 61) % 1080, width: 180, height: 6, borderRadius: 3, background: "#d6e6ff", opacity: 0.7 }} />; })}
      <Gr t={t} w="for a change" d={D} txt="FOR A CHANGE…" y={880} size={90} c={C.crema} dur={1.0} />
      <Gr t={t} w="the roads turn into mud" d={D} txt="MUD." y={200} size={170} c="#c9a36a" dur={1.3} />
      {t > T("one merchant", D) && t < T("so you adapt", D) && <TablillaGrande t={t} t0={T("one merchant", D) + 0.4} x={1380} y={250} w={900} vel={26} titulo="A MERCHANT · VINDOLANDA TABLET"
        lineas={["“I would have collected the goods already…", "…but I did not want to injure the animals", "while the roads are bad.”"]} />}
      <Plano t={t} t0={T("so you adapt", D) - 0.1} t1={T("for centuries", D) - 0.15} desde={[960, 600]} fondo="#b9a98e"><Pantalones t={t} t0={T("so you adapt", D)} tPant={T("you wear trousers", D)} /></Plano>
      <Ch t={t} w="so you adapt" d={D} txt="SO YOU ADAPT" y={150} c={C.teal} tinta={C.noche} size={66} dur={1.0} />
      <Ch t={t} w="no proper roman" d={D} txt="NO PROPER ROMAN WOULD…" y={150} c={C.rojo} size={60} dur={3.4} />
      <Gr t={t} w="you wear trousers" d={D} txt="TROUSERS." y={200} size={180} c={C.ambar} dur={1.4} />
      <Plano t={t} t0={T("for centuries", D) - 0.1} t1={T("on the wall", D) - 0.15} desde={[yo[0], yo[1] + 200]} fondo="#e8b98a"><Burla t={t} /></Plano>
      <Gr t={t} w="nobody cares" d={D} txt="NOBODY CARES." y={200} size={130} c={C.lima} dur={1.5} />
      <Ch t={t} w="you want wool" d={D} txt="WOOL. LOTS OF IT." y={150} c={C.violeta} size={66} dur={1.9} />
      {t > T("thick socks", D) && t < T("britain became so famous", D) && (
        <>
          <Ropa k="medias" x={yo[0] - 330} y={yo[1] + 40} t={t} t0={T("thick socks", D)} s={1} rot={-12} />
          <Ropa k="calzon" x={yo[0] + 330} y={yo[1] + 40} t={t} t0={T("underpants", D)} s={1} rot={8} />
          <Chip t={t} t0={T("thick socks", D)} text="THICK SOCKS" color={C.lila} x={yo[0] - 330} y={yo[1] + 190} centro size={40} />
          <Chip t={t} t0={T("underpants", D)} text="UNDERPANTS" color={C.crema} tinta={C.noche} x={yo[0] + 330} y={yo[1] + 190} centro size={40} />
        </>
      )}
      <Ch t={t} w="a heavy hooded cloak" d={D} txt="+ HEAVY HOODED CLOAK" y={950} c="#3f6b2a" size={60} dur={1.4} />
      <Plano t={t} t0={T("much later", D) - 0.2} t1={T("we know about the socks", D) - 0.2} desde={[yo[0], yo[1]]} fondo="#1b1240"><Edicto t={t} /></Plano>
      <Ch t={t} w="just behind the line" d={D} txt="JUST BEHIND THE WALL" y={150} c={C.violeta} size={60} dur={1.8} />
      <Plano t={t} t0={T("in the 1970s", D) - 0.1} t1={T("most of them were written", D) + 2.2} desde={[960, 760]} fondo="#9fc6e0"><Excava t={t} /></Plano>
      <Ch t={t} w="most of them were written" d={D} txt="WRITTEN ~AD 85-130" y={1000} c={C.ambar} tinta={C.noche} size={56} dur={4.2} dt={0.2} />
      <Ch t={t} w="the wall went up" d={D} txt="← AS THE WALL WENT UP" y={900} c={C.teal} tinta={C.noche} size={50} dur={1.4} />
      
      {t > T("a letter from home", D) && t < T("somewhere", D) + 0.2 && (
        <>
          <TablillaGrande t={t} t0={T("a letter from home", D) + 0.3} x={1000} y={250} w={1300} vel={16} titulo="A LETTER FROM HOME · VINDOLANDA" lineas={["“I have sent you… socks,", "two pairs of sandals,", "and two pairs of underpants.”"]} />
          <Ropa k="medias" x={520} y={800} t={t} t0={T("i have sent you socks", D) + 0.6} s={1.2} rot={-10} />
          <Ropa k="sandalia" x={860} y={810} t={t} t0={T("two pairs of sandals", D)} s={1.1} rot={6} />
          <Ropa k="sandalia" x={1000} y={830} t={t} t0={T("two pairs of sandals", D) + 0.25} s={1.1} rot={18} />
          <Ropa k="calzon" x={1320} y={800} t={t} t0={T("two pairs of underpants", D)} s={1.1} rot={-6} />
          <Ropa k="calzon" x={1500} y={830} t={t} t0={T("two pairs of underpants", D) + 0.25} s={1.1} rot={10} />
        </>
      )}
      <Burbuja t={t} t0={T("a mother in a warmer", D)} t1={T("the cold does not only", D) - 0.1} x={yv[0] + 380} y={yv[1] - 160} r={260}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffb347,#ffe0a0)" }}>
          <div style={{ position: "absolute", left: 300, top: 40, width: 120, height: 120, borderRadius: "50%", background: "#fff2b0" }} />
          <Persona x={250} y={500} h={360} t={t} seed={72} ropa={CIVIL(1)} expr="feliz" bD={130} cD={40} manoD={<path d="M -40 -60 L 40 -60 L 40 30 Q 80 40 70 70 L -20 70 Z" fill="#c9a0e8" />} />
        </AbsoluteFill>
      </Burbuja>
      {t > T("the cold does not only", D) && t < T("a strength report", D) && <Termometro t={t} t0={T("the cold does not only", D)} de={9} a={-3} dur={1.6} x={1680} y={520} />}
      {t > T("the cold does not only", D) && t < T("a strength report", D) && Array.from({ length: 4 }, (_, i) => { const k = ((t - T("the cold does not only", D)) * 0.8 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: yv[0] + 40 + k * 160, top: yv[1] + 40 * c.z - k * 120, width: 60 + k * 120, height: 40 + k * 80, borderRadius: "50%", background: "#eef6ff", opacity: 0.6 * (1 - k) }} />; })}
      <Ch t={t} w="the cold does not only" d={D} txt="COLD = MISERABLE" y={150} c="#3d7fc9" size={60} dur={2.0} />
      <Gr t={t} w="it makes you sick" d={D} txt="…AND SICK." y={200} size={140} c={C.lima} dur={1.2} />
      <Emote t={t} t0={T("it makes you sick", D)} t1={T("at vindolanda", D)} tipo="sudor" x={yv[0]} y={yv[1]} s={c.z * 0.5} />
      <Ch t={t} w="a strength report" d={D} txt="A STRENGTH REPORT" y={150} c={C.violeta} size={64} dur={2.6} />
      <Plano t={t} t0={T("the first cohort", D) - 0.2} t1={T("ten men", D) - 0.15} desde={[960, 640]} fondo="#120a2c"><Parte t={t} /></Plano>
      <Plano t={t} t0={T("ten men", D)} t1={T("that was a real enemy", D) - 0.1} desde={[960, 640]} fondo="#3a2418"><Cuartel t={t} /></Plano>
      <Gr t={t} w="that was a real enemy" d={D} txt="A REAL ENEMY." y={200} size={140} c={C.rojo} borde="#fff" dur={1.3} />
      <Ch t={t} w="the one thing that kept" d={D} txt="THE ONE THING THAT KEPT YOU HUMAN" y={150} c={C.naranja} size={54} dur={2.8} />
      <Ch t={t} w="outside the walls" d={D} txt="OUTSIDE THE WALLS" y={260} c={C.violeta} size={48} dur={1.2} />
      <Plano t={t} t0={T("with a hot room", D) - 0.2} t1={331.0} desde={[960, 600]} fondo="#2d1b69"><Termas t={t} /></Plano>
    </>
  );
};
