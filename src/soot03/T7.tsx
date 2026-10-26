import React from "react";
import { Sala } from "./sets";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { Exterior } from "./escenas4";
import { C, fontFamily, fontMano, ent, prog, Chip, Grande, Emote, cabeza, Moneda, Bota, Pergamino } from "./kit";
import { Soldadito, Mula, Bolsa } from "./kit2";
import { Persona } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa } from "./mundo";
import { Laurel } from "./T1";
import { Gr, Ch, T, ck, Yo, Otro, Carro, Barril, Burbuja, DiplomaBronce, Pin, gesto, AUX } from "./kit3";

// TRAMPA 7 · EL FINAL (746,5-822 s). La línea de abastecimiento vuelve: hacia el 400 Roma saca ejércitos de Britania,
// dejan de llegar monedas nuevas y se cae la cadena (sin monedas no hay paga, ni cerveza, ni botas, ni convoy); la carta
// de Honorio en el 410; vos, ya viejo en el muro, con la ciudadanía que te prometieron; el imperio que deja de
// contestar; ni batalla final: una carta y silencio. Y el repaso: el muro entero con los 7 pines que se encienden.
const D = 746;
const M7 = MC(7);
const YO7 = M7 + 330;

export const keys7: K[] = [
  [746.7, 36000, 560, 0.5], ck("remember the supply line", D, M7 - 1200, 600, 0.75), ck("by around the year 400", D, M7 - 600, 640, 0.55),
  ck("armies are being pulled", D, M7 + 400, 700, 0.7), ck("and something very small", D, M7, 600, 0.9), ck("think about what that means", D, YO7, 520, 1.2),
  ck("you have spent your whole life", D, YO7, 500, 1.45), ck("and now", D, YO7, 500, 1.6, 0), ck("no great final battle", D, YO7, 520, 1.0),
  ck("just a letter and then silence", D, YO7 + 120, 470, 1.9), [801.9, YO7 - 300, 540, 0.45], ck("why did nobody want", D, 22000, 430, 0.04),
  [818.0, 22000, 430, 0.041], [821.9, 22000, 430, 0.042],
];
export const amb7: [number, Pal][] = [[746.6, "atardecer"], [783.7, "atardecer"], [797.3, "gris"], [802.2, "dia"]];
export const lluvia7: [number, number][] = [[746.6, 0.15], [783.7, 0.05], [797.3, 0.3], [802.2, 0.1], [821.9, 0.1]];
export const sol7: [number, number, number, boolean?][] = [[746.6, 1500, 500], [797.3, -999, 0], [802.2, 1400, 180]];

// ── helpers de esta parte
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rotP = (px: number, py: number, deg: number, cx = 0, cy = 0): [number, number] => {
  const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r), dx = px - cx, dy = py - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
};
// posición en pantalla de la mano de una Persona (lado 1 = derecho, -1 = izquierdo)
const manoPos = (x: number, y: number, h: number, lado: 1 | -1, a: number, codo: number, inclina = 0, flip = false): [number, number] => {
  const t1 = (-lado * a * Math.PI) / 180, t2 = (-lado * (a + codo) * Math.PI) / 180;
  let px = lado * 66 - 92 * Math.sin(t1), py = -322 + 92 * Math.cos(t1);
  px += -86 * Math.sin(t2); py += 86 * Math.cos(t2);
  [px, py] = rotP(px, py, inclina, 0, -200);
  const S = h / 560;
  return [x + (flip ? -1 : 1) * px * S, y + py * S];
};
const ARRIERO = { tunica: "#8a5a2a", tunica2: "#5a3a1a", cinto: "#3a2410", piel: "#e8b48a", piel2: "#c98d66", pelo: "#3a2418" };

// 1) la línea de abastecimiento vuelve: el convoy avanza… y la mula se planta; el arriero tira de la soga
const Linea: React.FC<{ t: number }> = ({ t }) => {
  const a = T("remember the supply line", D), b = T("here is where it comes back", D);
  const ox = interpolate(t, [a - 0.6, b], [-170, 0], { ...CL, easing: Easing.out(Easing.quad) });
  const anda = t < b;
  const pl = prog(t, b, b + 0.3);
  const tir = t > b ? Math.sin((t - b) * 15) * 7 * Math.min(1, (t - b) / 0.3) : 0;
  const tw = anda ? t : b;
  // mula: se inclina hacia atrás (se planta) y patalea
  const mx = 930 + ox - pl * 20, my = 832, ms = 0.9, mrot = -9 * pl + (t > b ? Math.sin((t - b) * 11) * 1.5 : 0);
  const [hx0, hy0] = rotP(268 * ms, -50 * ms, mrot);
  const hocico: [number, number] = [mx + hx0, my + hy0];
  // arriero: camina adelante con la soga; en el beat se echa atrás tirando con las dos manos
  const ah = 480, ax = 1440 + ox + (t > b ? 30 * pl + tir : 0), ay = 1012;
  const bI = anda ? 62 : 84, cI = anda ? 14 : 4, inc = anda ? 0 : 16 + tir * 0.6;
  const [rx, ry] = manoPos(ax, ay, ah, -1, bI, cI, inc);
  const tensa = t > b;
  const comba = tensa ? Math.sin((t - b) * 30) * 4 : 60;
  return (
    <Exterior t={t} tono="atardecer" horizonte={600}>
      {/* el camino del sur */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M -50 1080 L -50 930 Q 960 880 1970 930 L 1970 1080 Z" fill="#b08a5a" />
        <path d="M -50 940 Q 960 892 1970 940" stroke="#d8b886" strokeWidth={10} fill="none" opacity={0.6} />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140 - 20} y={600 - (i % 2) * 14} width={120} height={50 + (i % 2) * 14} fill="#c9b8a0" opacity={0.8} />)}
      </svg>
      <Carro x={400 + ox - pl * 20} y={872} s={0.8} t={tw} carga="barril" />
      <Mula x={mx} y={my} s={ms} t={t} camina={anda ? 1.3 : 0} rot={mrot} carga />
      {/* polvo de las patas que frenan */}
      {t > b && [0, 1, 2, 3].map((i) => { const k = prog(t, b + i * 0.15, b + 0.9 + i * 0.15); return k > 0 && k < 1 ? <div key={i} style={{ position: "absolute", left: mx - 160 + i * 60 - k * 50, top: 990 - k * 60, width: 60 + k * 80, height: 40 + k * 50, borderRadius: "50%", background: "#e8d2a8", opacity: 0.8 * (1 - k) }} /> : null; })}
      {/* la soga, del hocico a la mano */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
        <path d={`M ${hocico[0]} ${hocico[1]} Q ${(hocico[0] + rx) / 2} ${(hocico[1] + ry) / 2 + comba} ${rx} ${ry}`} stroke="#c9a46a" strokeWidth={9} fill="none" strokeLinecap="round" />
      </svg>
      <Persona x={ax} y={ay} h={ah} t={t} seed={97} ropa={ARRIERO} camina={anda ? 1.3 : 0} bI={bI} cI={cI} bD={anda ? 20 : 70} cD={anda ? 20 : 60} inclina={inc} expr={anda ? "neutro" : t < b + 0.6 ? "sorpresa" : "enojado"} habla={t > b + 0.6} mira={-0.8} salta={b} />
      {t > b && <Emote t={t} t0={b + 0.1} tipo="enojo" x={mx + 250} y={my - 170} s={0.6} />}
      {t > b + 0.5 && <Emote t={t} t0={b + 0.5} tipo="sudor" {...cabeza(ax, ay, ah)} s={0.55} />}
      <Chip t={t} t0={a} t1={b} text="THE SUPPLY LINE" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={60} />
      {t > b && <Chip t={t} t0={b} text="THE SUPPLY LINE… STOPS." color={C.rojo} x={960} y={140} centro size={60} />}
      {t > b + 0.3 && <Grande t={t} t0={b + 0.3} text="TRAP #3 IS BACK" y={270} size={84} color={C.crema} />}
    </Exterior>
  );
};

// 2) el cofre de las pagas: el ejército se va al sur y las monedas se van con él; los que quedan se asoman al cofre vacío
const Cofre: React.FC<{ t: number }> = ({ t }) => {
  const p = T("armies are being pulled", D), e = T("to fight for one", D), s = T("and something very small", D), dd = T("very deadly", D);
  const N = 28;
  const sale = (i: number) => p + 0.5 + i * 0.15;
  const quedan = Array.from({ length: N }, (_, i) => sale(i) > t).filter(Boolean).length;
  const cx = 600, cy = 830;
  const tiembla = t > dd ? Math.sin((t - dd) * 40) * 3 * Math.max(0, 1 - (t - dd) / 0.6) : 0;
  return (
    <Exterior t={t} tono="gris" horizonte={600}>
      {/* el ejército que se va al sur, en fila por el horizonte */}
      {Array.from({ length: 10 }, (_, i) => {
        const k = Math.max(0, t - p - i * 0.12);
        const x = 300 + i * 120 + k * 260;
        return x < 2050 ? <Soldadito key={i} x={x} y={650} s={0.8} t={t} seed={500 + i} avanza={1} /> : null;
      })}
      {/* el cofre (600 px), abierto */}
      <svg style={{ position: "absolute", left: cx - 360 + tiembla, top: cy - 420, overflow: "visible" }} width={720} height={720} viewBox="-360 -420 720 720">
        <ellipse cx={0} cy={262} rx={340} ry={30} fill="rgba(20,10,40,.3)" />
        <path d="M -300 -40 L -280 -330 Q 0 -390 280 -330 L 300 -40 Z" fill="#7a4a1e" stroke="#3a2410" strokeWidth={10} />
        <path d="M -250 -70 L -236 -300 Q 0 -350 236 -300 L 250 -70 Z" fill="#5a3414" />
        {[-150, 150].map((x) => <rect key={x} x={x - 18} y={-345} width={36} height={300} fill="#5d6577" />)}
        <rect x={-300} y={-60} width={600} height={70} fill="#2a1408" />
        {Array.from({ length: quedan }, (_, i) => { const col = i % 7, fila = Math.floor(i / 7); return <circle key={i} cx={-210 + col * 70 + (fila % 2) * 35} cy={-10 - fila * 30} r={34} fill={C.oro} stroke="#a8650f" strokeWidth={6} />; })}
        <rect x={-320} y={0} width={640} height={250} rx={18} fill="#a0622a" stroke="#3a2410" strokeWidth={10} />
        {[-210, 210].map((x) => <rect key={x} x={x - 22} y={0} width={44} height={250} fill="#5d6577" />)}
        <rect x={-320} y={110} width={640} height={30} fill="#5d6577" />
        <rect x={-120} y={40} width={240} height={150} rx={14} fill="#f2e2c0" stroke="#3a2410" strokeWidth={8} />
        <text x={0} y={95} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={36} fill="#5a3414">PAY</text>
        <text x={0} y={168} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill={quedan === 0 ? C.rojo : "#1b1240"}>{quedan}</text>
      </svg>
      {/* las monedas que se van volando detrás del ejército */}
      {Array.from({ length: N }, (_, i) => {
        const k = prog(t, sale(i), sale(i) + 0.9);
        if (k <= 0 || k >= 1) return null;
        const x = cx - 200 + (i % 7) * 60 + k * (1500 - (i % 7) * 60), y = cy - 60 - Math.sin(k * Math.PI) * 330 - k * 120;
        return <Moneda key={i} x={x} y={y} r={30} t={t} gira={3} />;
      })}
      {/* los que quedan: se asoman al cofre */}
      <Persona x={180} y={1040} h={470} t={t} seed={61} ropa={AUX(2)} casco="legion" malla {...gesto(t, [[p, "habla"], [e, "enojado"], [s, "lee"], [dd, "triste"]])} inclina={t > s ? 18 : 0} mira={0.7} miraY={t > s ? 0.6 : 0} />
      <Persona x={1110} y={1040} h={500} t={t} seed={62} ropa={AUX(1)} casco="legion" flip {...gesto(t, [[p, "sorpresa"], [e, "encoge"], [s, "lee"], [dd, "miedo"]])} inclina={t > s ? 22 : 0} mira={t > s ? 0.6 : -0.6} miraY={t > s ? 0.6 : 0} />
      <Persona x={1480} y={1040} h={480} t={t} seed={63} ropa={AUX(4)} casco="legion" flip={t > s} {...gesto(t, [[p + 0.3, "señala"], [e, "niega"], [s, "lee"], [dd, "tiembla"]])} inclina={t > s ? 16 : 4} mira={t > s ? 0.5 : 0.8} />
      {t > dd && <Emote t={t} t0={dd + 0.1} tipo="susto" {...cabeza(1110, 1040, 500)} s={0.6} />}
      {t > dd && <Emote t={t} t0={dd + 0.3} tipo="lagrimas" {...cabeza(180, 1040, 470)} s={0.5} />}
    </Exterior>
  );
};

// 3) la cadena: sin monedas no hay nada. Cinco cajas encadenadas al centro y el soldado que las tacha una por una, harto
const Cadena: React.FC<{ t: number }> = ({ t }) => {
  const m = T("new roman coins", D), para = m + 1.0, nc = T("no coins means", D);
  const W: [string, string][] = [["no coins means", "COINS"], ["no pay", "PAY"], ["no beer", "BEER"], ["no boots", "BOOTS"], ["no convoy", "CONVOY"]];
  const ti = W.map(([w]) => T(w, D));
  const ico = (i: number): React.ReactNode => [<Moneda x={0} y={0} r={62} t={t} />, <Bolsa x={0} y={0} s={0.5} txt="PAY" />, <Barril x={0} y={0} s={0.5} />, <Bota x={-20} y={0} s={1.05} />, <Carro x={0} y={0} s={0.3} t={0} />][i];
  const BX = (i: number) => 360 + i * 300, BY = 500;
  let sx = interpolate(t, [m - 0.1, m + 1.1], [-160, BX(0) - 80], { ...CL, easing: Easing.out(Easing.quad) });
  let anda = t < m + 1.1;
  for (let i = 1; i < 5; i++) if (t > ti[i] - 0.5) { sx = interpolate(t, [ti[i] - 0.5, ti[i] - 0.08], [BX(i - 1) - 80, BX(i) - 80], CL); anda = t < ti[i] - 0.08; }
  const fin = ti[4] + 0.55;
  const golpe = ti.findIndex((x) => t >= x && t < x + 0.45);
  const g = gesto(t, [[m - 0.1, "camina"], [para, "sorpresa"], [para + 0.8, "enojado"], [nc, "golpea"]]);
  const sh = 400;
  const brazoD = golpe >= 0 ? 150 - Math.abs(Math.sin((t - ti[golpe]) * 14)) * 35 : anda ? g.bD : t > fin ? 50 : 70;
  const brocha = (
    <g>
      <rect x={-9} y={-20} width={18} height={190} rx={6} fill="#7a4a1e" />
      <rect x={-20} y={160} width={40} height={64} rx={10} fill={C.rojo} />
    </g>
  );
  return (
    <Exterior t={t} tono="gris" horizonte={760}>
      {Array.from({ length: 22 }, (_, i) => {
        const ts = m - 2.4 + i * 0.16;
        if (ts > para) return null;
        const k = (t - ts) / 2.2;
        if (k <= 0 || k >= 1) return null;
        return <Moneda key={i} x={-60 + k * 2040} y={330 - Math.sin(k * Math.PI) * 170} r={40} t={t} gira={2} />;
      })}
      {t > m + 0.5 && t < nc - 0.1 && <Grande t={t} t0={m + 0.5} text="NEW COINS: STOPPED." y={470} size={100} color={C.rojo} borde="#fff" />}
      {t > nc - 0.25 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${ent(t, nc - 0.25)})`, transformOrigin: `960px ${BY}px` }}>
          {[0, 1, 2, 3].map((i) => {
            const rompe = prog(t, ti[i + 1] + 0.12, ti[i + 1] + 0.5);
            return [0, 1, 2].map((j) => {
              const lado = j === 0 ? -1 : 1;
              const x0 = BX(i) + 100 + j * 34, cae = j === 1 ? rompe * 60 : rompe * 25;
              return <div key={i + "-" + j} style={{ position: "absolute", left: x0 - 4, top: BY - 18 + cae, width: 40, height: 36, borderRadius: 18, border: "9px solid #5d6577", transform: `rotate(${lado * rompe * 50 + (j % 2 ? 90 : 0)}deg)`, opacity: j === 1 ? 1 - rompe : 1 }} />;
            });
          })}
          {W.map(([, tx], i) => {
            const tacha = prog(t, ti[i] + 0.05, ti[i] + 0.3);
            const sac = t > ti[i] && t < ti[i] + 0.3 ? Math.sin((t - ti[i]) * 60) * 6 : 0;
            return (
              <div key={i} style={{ position: "absolute", left: BX(i) + sac, top: BY, width: 0, height: 0 }}>
                <div style={{ position: "absolute", left: -100, top: -100, width: 200, height: 200, borderRadius: 32, background: tacha > 0 ? "#f3e6e6" : "#fff", border: "8px solid #1b1240", boxShadow: "0 10px 0 rgba(20,8,40,.25)" }} />
                <div style={{ position: "absolute", left: 0, top: 0, transform: "scale(0.8)" }}>{ico(i)}</div>
                <svg style={{ position: "absolute", left: -100, top: -100, overflow: "visible" }} width={200} height={200}>
                  <line x1={18} y1={18} x2={182} y2={182} stroke={C.rojo} strokeWidth={24} strokeLinecap="round" pathLength={1} strokeDasharray={`${tacha} 1`} />
                  <line x1={182} y1={18} x2={18} y2={182} stroke={C.rojo} strokeWidth={24} strokeLinecap="round" pathLength={1} strokeDasharray={`${prog(t, ti[i] + 0.15, ti[i] + 0.4)} 1`} />
                </svg>
                <div style={{ position: "absolute", left: -160, width: 320, top: -172, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 46, color: tacha > 0 ? C.rojo : "#1b1240" }}>{tacha > 0 ? "NO " : ""}{tx}</div>
              </div>
            );
          })}
        </div>
      )}
      <Yo x={sx} y={1040} h={sh} t={t} frio camina={anda ? 1.6 : 0} expr={t < para ? "neutro" : t < para + 0.8 ? "sorpresa" : t > fin ? "triste" : "enojado"} habla={t > para + 0.8 && !anda} bD={brazoD} cD={golpe >= 0 ? 10 : 30} bI={t > fin ? 50 : g.bI} cI={t > fin ? 120 : g.cI} inclina={golpe >= 0 ? -4 : 0} ladea={t > fin ? 8 : 0} salta={t > para && t < para + 0.8 ? para : undefined} mira={t < para + 0.8 ? 0.3 : 0.5} miraY={t < nc ? -0.8 : -0.5} manoD={t > nc - 0.3 ? brocha : undefined} />
      {t > para + 0.8 && t < fin && <Emote t={t} t0={para + 0.8} t1={fin} tipo="enojo" {...cabeza(sx, 1040, sh)} s={0.45} />}
      {t > fin && <Emote t={t} t0={fin} tipo="sudor" {...cabeza(sx, 1040, sh)} s={0.45} />}
    </Exterior>
  );
};

// 4) la carta de Honorio: el rescripto se escribe solo, letra por letra
const Tipea: React.FC<{ t: number; t0: number; t1: number; txt: string; y: number; size: number; color: string }> = ({ t, t0, t1, txt, y, size, color }) => {
  if (t < t0) return null;
  const n = Math.floor(txt.length * prog(t, t0, t1));
  const cur = n < txt.length && Math.floor(t * 8) % 2 === 0;
  return <div style={{ position: "absolute", left: 1120 - 470, width: 940, top: y - size * 0.6, textAlign: "center", fontFamily: fontMano, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap" }}>{txt.slice(0, n)}<span style={{ opacity: cur ? 0.8 : 0 }}>|</span><span style={{ opacity: 0 }}>{txt.slice(n)}</span></div>;
};
const Carta: React.FC<{ t: number }> = ({ t }) => {
  const a = T("the emperor honoros", D), s = T("it says", D), o = T("you are on your own now", D), l = T("look after your own", D);
  const sello = l + 1.0;
  const sk = prog(t, sello, sello + 0.2);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      <Persona x={250} y={1040} h={500} t={t} seed={93} ropa={{ tunica: C.oro, tunica2: "#8f7025", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d99a72", pelo: "#3a2418" }} capa="#7a2a9a" mira={0.7} {...gesto(t, [[a, "escribe"], [s, "habla"], [o, "señala"], [l, "encoge"], [sello, "golpea"], [sello + 0.5, "encoge"]])} />
      <Laurel x={250} y={1040 - 450 * (500 / 560) - 70 * (500 / 560)} s={0.85} />
      <Pergamino x={1120} y={570} w={1040} abre={prog(t, a + 0.2, a + 1.2)} lineas={0} firma={prog(t, l + 0.9, l + 1.6)} titulo="TO THE CITIES OF BRITAIN" />
      {t > a + 1.0 && (
        <>
          <Tipea t={t} t0={a + 1.1} t1={s - 0.2} txt="From Honorius, Emperor:" y={415} size={50} color="#7a3d14" />
          <Tipea t={t} t0={o} t1={o + 0.9} txt="YOU ARE ON YOUR OWN NOW." y={530} size={70} color="#1b1240" />
          <Tipea t={t} t0={l} t1={l + 0.85} txt="LOOK TO YOUR OWN DEFENCE." y={650} size={66} color={C.rojo} />
        </>
      )}
      {t > sello && (
        <div style={{ position: "absolute", left: 1500, top: 760, width: 0, height: 0, transform: `scale(${2.2 - 1.2 * sk}) rotate(-12deg)`, opacity: sk }}>
          <div style={{ position: "absolute", left: -70, top: -70, width: 140, height: 140, borderRadius: "50%", background: "#b0202e", border: "8px solid #7a1018", boxShadow: "0 6px 0 rgba(0,0,0,.3)" }} />
          <div style={{ position: "absolute", left: -70, width: 140, top: -24, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 36, color: "#ffd0d0" }}>SPQR</div>
        </div>
      )}
      <Chip t={t} t0={T("according to a later", D)} t1={a} text="A LATER HISTORIAN SAYS…" color={C.violeta} x={1120} y={130} centro size={56} />
      {t > a && <Chip t={t} t0={a} text="EMPEROR HONORIUS" color={C.oro} tinta={C.noche} x={1120} y={130} centro size={60} />}
      {t > T("more or less", D) && t < o + 0.4 && <Chip t={t} t0={T("more or less", D)} text="(MORE OR LESS)" color="#2a2350" x={1120} y={985} centro size={44} />}
    </AbsoluteFill>
  );
};

// 5) vos, ya viejo, en el muro: el diploma de ciudadanía que llega… y se cierra de golpe y se va
const Veterano: React.FC<{ t: number }> = ({ t }) => {
  const th = T("think about what that means", D), vida = T("you have spent your whole life", D), pc = T("you were promised citizenship", D);
  const got = T("and you got it", D), pa = T("your father got it", D), now = T("and now", 793), sw = T("has simply stopped writing", D);
  const nb = T("no great final battle", D), ls = T("no last stand", D), cal = T("just a letter and then silence", D);
  const cierra = prog(t, sw + 0.25, sw + 0.4);
  const abre = Math.min(prog(t, pc + 0.4, pc + 1.0), 1 - cierra);
  const vuela = prog(t, sw + 0.55, sw + 1.7);
  const dx = interpolate(vuela, [0, 1], [960, 2200]), dy = interpolate(vuela, [0, 1], [480, 420]);
  const baja = ent(t, pc);
  const golpeC = t > sw + 0.4 && t < sw + 0.6 ? Math.sin((t - sw) * 70) * 10 : 0;
  const alcanza = t > sw + 0.4 && t < nb;
  const oscuro = prog(t, cal + 0.3, cal + 1.5) * 0.35;
  const carta = prog(t, cal, cal + 1.0);
  return (
    <Exterior t={t} tono="atardecer" horizonte={640}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 230 - 20} y={800} width={150} height={120} rx={6} fill={["#c9b8a0", "#bfae94", "#d2c2a8"][i % 3]} stroke="#a89878" strokeWidth={5} />)}
        <rect x={-10} y={900} width={1940} height={190} fill="#b5a48a" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170 - 40 + (i % 2) * 60} y={940 + (i % 3) * 40} width={150} height={34} rx={6} fill="#a8977c" opacity={0.6} />)}
      </svg>
      {t > pc && vuela < 1 && <div style={{ position: "absolute", left: dx - 330, top: dy - 330, width: 660, height: 660, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,140,.75), rgba(255,200,110,0) 65%)", opacity: (1 - cierra * 0.7) * (1 - vuela) }} />}
      {t > pc && vuela < 1 && (
        <div style={{ position: "absolute", left: 0, top: (1 - baja) * -500, width: 1920, height: 1080, transform: `translateX(${golpeC}px)` }}>
          <DiplomaBronce x={dx} y={dy} s={0.7 * (1 - vuela * 0.6)} rot={vuela * 40} abre={Math.max(0.05, abre)} />
        </div>
      )}
      {t > got && t < sw + 0.3 && <div style={{ position: "absolute", left: 960 - 200, top: 640, width: 400, transform: `scale(${ent(t, got)}) rotate(-6deg)`, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44, color: C.noche, background: C.lima, border: "6px solid #1b1240", borderRadius: 14, padding: "6px 0" }}>✓ CIVIS ROMANUS</div>}
      {t > pa && t < sw + 0.3 && <div style={{ position: "absolute", left: 960 - 200, top: 730, width: 400, transform: `scale(${ent(t, pa)}) rotate(4deg)`, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 40, color: C.noche, background: C.oro, border: "6px solid #1b1240", borderRadius: 14, padding: "6px 0" }}>✓ FATHER TOO</div>}
      {sw + 0.4 < t && t < sw + 1.2 && <div style={{ position: "absolute", left: 960 - 200, top: 400, width: 400, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 84, color: "#fff", WebkitTextStroke: "10px #1b1240", paintOrder: "stroke fill", transform: `scale(${ent(t, sw + 0.4)})` }}>SLAM!</div>}
      {t > cal && <div style={{ position: "absolute", left: 960 + Math.sin(carta * 9) * 60 - 70, top: interpolate(carta, [0, 1], [-120, 930]), width: 140, height: 90, background: "#f6e3b4", border: "5px solid #c98f4a", borderRadius: 8, transform: `rotate(${Math.sin(carta * 9) * 25 * (1 - carta)}deg)` }} />}
      <Yo x={560} y={1040} h={520} t={t} frio viejo casco={false} mira={t > sw && t < nb ? 0.6 : t > cal ? 0.3 : 0.4} miraY={t > pc && t < nb ? -0.5 : t > cal ? 0.6 : 0}
        {...gesto(t, [[th, "habla"], [vida, "señala"], [pc, "sorpresa"], [got, "festeja"], [pa, "lee"], [now, "habla"], [sw + 0.4, "señala"], [nb, "triste"], [ls, "encoge"], [cal, "triste"]])}
        {...(alcanza ? { bD: 140, cD: 0, expr: "miedo" as const, inclina: 10 } : t > pa && t < now ? { bD: 40, cD: 120, expr: "orgullo" as const } : {})} />
      <Otro i={3} x={1380} y={1040} h={500} t={t} viejo casco={false} flip mira={t > sw && t < nb ? 0.8 : -0.4} miraY={t > pc && t < nb ? -0.5 : t > cal ? 0.6 : 0}
        {...gesto(t, [[th, "lee"], [vida, "habla"], [pc, "sorpresa"], [got, "festeja"], [pa, "habla"], [now, "lee"], [sw + 0.4, "sorpresa"], [nb, "niega"], [ls, "encoge"], [cal, "triste"]])}
        {...(alcanza ? { bI: 150, cI: 0, bD: 30, expr: "miedo" as const, inclina: -10 } : {})} />
      {t > sw + 0.5 && t < nb && <Emote t={t} t0={sw + 0.5} t1={nb} tipo="excl" {...cabeza(1380, 1040, 500)} s={0.5} />}
      {t > cal + 0.5 && <Emote t={t} t0={cal + 0.5} tipo="lagrimas" {...cabeza(560, 1040, 520)} s={0.5} />}
      <AbsoluteFill style={{ background: "#1b1240", opacity: oscuro }} />
    </Exterior>
  );
};

export const W7: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 746 || t > 822.95) return null;
  const sacan = T("armies are being pulled", D);
  const viejo = T("think about what that means", D);
  const calla = T("just a letter and then silence", D);
  return (
    <>
      {/* los ejércitos se van del muro, hacia el sur (a la derecha) */}
      {t > sacan - 0.4 && t < viejo && Array.from({ length: 12 }, (_, i) => {
        const k = Math.max(0, t - sacan - i * 0.15);
        return <Soldadito key={i} x={M7 - 1000 + (i % 6) * 230 + (i < 6 ? 0 : 110) + k * 240} y={BASE - (i < 6 ? 0 : 70)} s={i < 6 ? 1.25 : 1.05} t={t} seed={300 + i} avanza={1} />;
      })}
      {/* el puñado que queda en el muro */}
      {t > sacan && t < viejo && [0, 1].map((i) => <Otro key={i} i={i + 2} x={M7 - 300 + i * 260} y={TOP} t={t} expr="triste" mira={0.7} />)}
      {/* vos, ya viejo, en el muro */}
      {t > viejo - 0.4 && t < 802.2 && (
        <>
          <Yo x={YO7} y={TOP} h={250} t={t} frio viejo casco={false} mira={t > calla ? 0.6 : 0} {...gesto(t, [[viejo, "habla"], [T("you were promised citizenship", D), "lee"], [T("and you got it", D), "festeja"], [T("and now", 793), "triste"], [T("has simply stopped writing", D), "encoge"], [calla, "triste"]])} />
          <Otro i={3} x={YO7 + 300} y={TOP} h={235} t={t} viejo casco={false} flip {...gesto(t, [[viejo, "lee"], [T("and you got it", D), "festeja"], [T("and now", 793), "triste"], [T("has simply stopped writing", D), "niega"]])} />
          <Burbuja t={t} t0={T("you were promised citizenship", D)} t1={T("your father got it", D) - 0.1} x={YO7 - 330} y={TOP - 160} r={140}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffe0a0,#ffb347)" }} /><DiplomaBronce x={128} y={128} t={t} t0={T("you were promised citizenship", D)} abre={1} s={0.4} />
          </Burbuja>
          <Burbuja t={t} t0={T("your father got it", D)} t1={T("and now", 793) - 0.1} x={YO7 - 330} y={TOP - 160} r={140}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg,#bfe0f5,#7fa05a)" }} /><Persona x={128} y={250} h={210} t={t} seed={4} ropa={{ tunica: "#2e9b8f", tunica2: "#1c6a62", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d99a72", pelo: "#a0602c" }} casco="legion" malla viejo expr="orgullo" />
          </Burbuja>
          {t > T("has simply stopped writing", D) && <Emote t={t} t0={T("has simply stopped writing", D) + 0.4} t1={T("no great final battle", D)} tipo="preg" {...cabeza(YO7, TOP, 250)} s={0.5} />}
        </>
      )}
      {/* los 7 pines sobre los milecastles (igual que en el gancho), que se encienden con la lista */}
      {t > 802.4 && ["POSTING", "WEATHER", "SUPPLY", "BOREDOM", "NEIGHBORS", "THE NORTH", "THE END"].map((ic, i) => {
        const L = ["a posting at the edge", "rain that never stops", "beer that might not come", "boredom that lasts", "neighbors who might stab", "enemies who might be paid", "and an empire that might"];
        const t0 = T(L[i], D);
        const act = t > t0 && (i === 6 || t < T(L[i + 1], D));
        return <Pin key={i} t={t} t0={802.6 + i * 0.12} n={i + 1} x={MC(i + 1)} y={TOP - 520} s={act ? 26 : 19} icono={ic} act={act} />;
      })}
    </>
  );
};

export const S7: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 746 || t > 823) return null;
  const L: [string, string, string][] = [
    ["a posting at the edge", "THE EDGE OF THE WORLD", C.violeta], ["rain that never stops", "RAIN. FOREVER.", "#3d7fc9"],
    ["beer that might not come", "MAYBE-BEER", C.ambar], ["boredom that lasts", "YEARS OF BOREDOM", "#4a4a5a"],
    ["neighbors who might stab", "STABBY NEIGHBORS", C.rojo], ["enemies who might be paid", "PAID-OFF SCOUTS", "#2a2350"],
    ["and an empire that might", "AN EMPIRE THAT FORGETS YOU", C.rojo],
  ];
  return (
    <>
      <CartelTrampa t={t} t0={746.49} n={7} titulo="THE ENDING" color={C.rojo} />
      <Plano t={t} t0={T("remember the supply line", D) - 0.1} t1={T("by around the year 400", D) - 0.15} desde={[960, 700]} fondo="#f2b880"><Linea t={t} /></Plano>
      <Plano t={t} t0={T("armies are being pulled", D) - 0.1} t1={T("new roman coins", D) - 0.12} desde={[960, 600]} fondo="#c8d2dc"><Cofre t={t} /></Plano>
      <Gr t={t} w="by around the year 400" d={D} txt="AD 400" y={220} size={170} c={C.ambar} dur={1.6} />
      <Ch t={t} w="rome is in deep trouble" d={D} txt="ROME: IN DEEP TROUBLE EVERYWHERE" y={150} c={C.rojo} size={58} dur={1.9} />
      <Ch t={t} w="armies are being pulled" d={D} txt="ARMIES PULLED OUT OF BRITAIN →" y={150} c={C.violeta} size={56} dur={2.3} />
      {["EMPEROR?", "EMPEROR?", "EMPEROR?"].map((x, i) => <Ch key={i} t={t} w="to fight for one" d={D} txt={"👑 " + x} x={560 + i * 400} y={290} c={C.oro} tinta={C.noche} size={46} dur={2.6 - i * 0.35} dt={i * 0.35} />)}
      <Ch t={t} w="and something very small" d={D} txt="SOMETHING VERY SMALL…" y={150} c="#2a2350" size={60} dur={1.8} />
      <Gr t={t} w="very deadly" d={D} txt="…AND VERY DEADLY" y={280} size={90} c={C.rojo} borde="#fff" dur={1.6} />
      <Plano t={t} t0={T("new roman coins", D) - 0.1} t1={T("around the year 410", D) - 0.15} desde={[960, 540]} fondo="#d8c8ae"><Cadena t={t} /></Plano>
      <Gr t={t} w="around the year 410" d={D} txt="AD 410" y={540} size={220} c={C.crema} dur={1.6} />
      <Plano t={t} t0={T("according to a later", D) - 0.1} t1={T("think about what that means", D) - 0.15} desde={[960, 540]} fondo="#1b1240"><Carta t={t} /></Plano>
      <Plano t={t} t0={T("think about what that means", D) - 0.1} t1={801.95} desde={[960, 600]} fondo="#ffb070"><Veterano t={t} /></Plano>
      <Ch t={t} w="think about what that means" d={D} txt="WHAT THAT MEANS FOR YOU" y={150} c={C.violeta} size={56} dur={2.0} />
      <Gr t={t} w="you have spent your whole life" d={D} txt="YOUR WHOLE LIFE · ON THIS WALL" y={160} size={70} c={C.crema} dur={2.8} />
      <Ch t={t} w="you were promised citizenship" d={D} txt="CITIZENSHIP: PROMISED" y={150} c={C.oro} tinta={C.noche} size={56} dur={1.7} />
      <Ch t={t} w="and you got it" d={D} txt="✓ AND YOU GOT IT" y={250} c={C.lima} tinta={C.noche} size={56} dur={0.95} />
      <Ch t={t} w="your father got it" d={D} txt="✓ SO DID YOUR FATHER" y={150} c={C.lima} tinta={C.noche} size={56} dur={2.2} />
      <Gr t={t} w="has simply stopped writing" d={D} txt="ROME STOPPED WRITING BACK." y={160} size={84} c="#fff" dur={2.8} />
      <Ch t={t} w="no great final battle" d={D} txt="✗ NO GREAT FINAL BATTLE" y={150} c="#4a4a5a" size={56} dur={2.5} />
      <Ch t={t} w="no last stand" d={D} txt="✗ NO LAST STAND" y={250} c="#4a4a5a" size={56} dur={1.15} />
      <Gr t={t} w="just a letter and then silence" d={D} txt="JUST A LETTER. THEN SILENCE." y={200} size={80} c="#fff" dur={2.0} />
      <Gr t={t} w="why did nobody want" d={D} txt="WHY DID NOBODY WANT TO GUARD IT?" y={880} size={86} c={C.crema} dur={2.9} />
      <Ch t={t} w="look at the list" d={D} txt="LOOK AT THE LIST." y={150} c={C.rojo} size={60} dur={1.1} />
      {L.map(([w, tx, col], i) => <Ch key={i} t={t} w={w} d={D} txt={`#${i + 1} · ${tx}`} y={880} c={col} tinta={col === C.ambar ? C.noche : "#fff"} size={64} dur={(i < 6 ? T(L[i + 1][0], D) : 822.0) - T(w, D) - 0.1} />)}
    </>
  );
};
