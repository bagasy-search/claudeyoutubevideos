// ap6na — componentes únicos 8-13 (la noticia a paso de hombre, la puerta trancada, el conteo de la mañana, la cifra difusa,
// los dos territorios, las tres condiciones de Corbett).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, Fig, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";
import { Leo, Eyes, KHouse, Ridges } from "./lkit";

type UP = { d: number; p: any };

// 8 · NEWS AT WALKING PACE: mapa de aldeas unidas por senderos; el punto rojo del leopardo cruza una cresta en una noche,
//     el punto blanco de la noticia (un hombre a pie) va tres veces más lento y llega tarde: la aldea se entera cuando ya está ahí
export const NewsAtWalkingPace: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const V = [[260, 760], [520, 520], [820, 700], [1100, 420], [1380, 640], [1660, 380]];
  const path = (k: number) => { const s = Math.min(V.length - 1.001, k * (V.length - 1)), i = Math.floor(s), u = s - i; return [V[i][0] + (V[i + 1][0] - V[i][0]) * u, V[i][1] + (V[i + 1][1] - V[i][1]) * u]; };
  const t0 = at(p, "go", 30), kl = lin(f, t0, t0 + (d - t0) * 0.55), kn = lin(f, t0, t0 + (d - t0) * 1.6);
  const [lx, ly] = path(kl), [nx, ny] = path(kn);
  const arr = kl >= 1 ? ez(f, t0 + (d - t0) * 0.55, t0 + (d - t0) * 0.55 + 10) : 0;
  return (
    <Scene d={d} bg={p.bg} floor="140,170,220" tint="#081018">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #17263a 0%, #060a10 80%)" }} />
      <SV>
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M0,${200 + i * 110} Q480,${150 + i * 110 + Math.sin(i) * 60} 960,${210 + i * 110} T1920,${190 + i * 110}`} stroke="rgba(150,180,220,.08)" strokeWidth={3} fill="none" />)}
        <path d={`M${V.map(([x, y]) => `${x},${y}`).join(" L")}`} stroke="rgba(244,239,230,.35)" strokeWidth={4} strokeDasharray="8 14" fill="none" />
        {V.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={20} fill="#2a3a50" stroke={i === V.length - 1 && arr ? RED : INK} strokeWidth={4} /><rect x={x - 9} y={y - 8} width={18} height={12} fill={INK} opacity={0.8} /></g>)}
        <circle cx={lx} cy={ly} r={16} fill={RED} /><circle cx={lx} cy={ly} r={40} fill={RED} opacity={0.2 + 0.1 * Math.sin(f / 4)} />
        <circle cx={nx} cy={ny} r={13} fill={INK} />
        <circle cx={1660} cy={380} r={70 * arr} fill="none" stroke={RED} strokeWidth={6} opacity={arr} />
      </SV>
      <Tag a={t0} t="LEOPARD · ONE NIGHT" x={Math.min(lx, 1640)} y={ly - 110} size={36} color={RED} w={500} />
      <Tag a={t0 + 30} t="THE NEWS · ON FOOT" x={nx} y={ny + 40} size={34} w={500} />
      <Tag a={at(p, "miles", 10)} t="10-15 MILES BETWEEN VILLAGES" x={960} y={80} size={52} />
      <Tag a={Math.round(t0 + (d - t0) * 0.55) + 6} t="ALREADY AMONG THEM" x={960} y={1000} size={46} color={RED} w={700} />
    </Scene>
  );
};

// 9 · BARRED DOOR: de cerca, por dentro de la casa: la puerta de tablas, una mano (silueta) baja el tronco pesado en los soportes,
//     el fuego dibuja sombras en la pared; afuera, por la rendija, el sendero a la luz de la luna
export const BarredDoor: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const b = sp(f, at(p, "bar", 40), 1.4, 9), fire = 0.75 + 0.25 * Math.sin(f / 3) * Math.sin(f / 7.3);
  const glow = `rgba(255,${130 + 40 * fire},60,${0.35 * fire})`;
  return (
    <Scene d={d} bg={p.bg} floor="255,140,60" tint="#0d0805" drift={0.6}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 20% 90%, ${glow} 0%, rgba(0,0,0,0) 60%), #140c07` }} />
      <SV>
        <rect x={560} y={120} width={800} height={900} fill="#3a2414" />
        {Array.from({ length: 6 }).map((_, i) => <g key={i}><rect x={560 + i * 133} y={120} width={128} height={900} fill={i % 2 ? "#40291a" : "#3a2414"} /><line x1={560 + i * 133} y1={120} x2={560 + i * 133} y2={1020} stroke="#1a0e06" strokeWidth={6} /></g>)}
        <rect x={958} y={120} width={6} height={900} fill={`rgba(190,210,255,${0.35 + 0.1 * Math.sin(f / 30)})`} />
        {[0, 1].map((i) => <rect key={i} x={i ? 1370 : 470} y={480} width={80} height={60} rx={6} fill="#2a1a0e" stroke="#120a04" strokeWidth={4} />)}
        <g transform={`translate(0,${(1 - b) * -260}) rotate(${(1 - b) * -8},960,500)`}>
          <rect x={430} y={470} width={1060} height={70} rx={20} fill="#6b4a2a" stroke="#2a1a0e" strokeWidth={5} />
          {Array.from({ length: 5 }).map((_, i) => <ellipse key={i} cx={560 + i * 200} cy={505} rx={30} ry={10} fill="#5a3c22" />)}
        </g>
        <rect x={530} y={1010} width={860} height={14} fill="#0a0604" />
        {Array.from({ length: 20 }).map((_, i) => { const ph = (f / (40 + rnd(i, 2) * 30) + rnd(i, 3)) % 1; return <circle key={i} cx={160 + rnd(i, 4) * 220 + Math.sin(f / 9 + i) * 10} cy={1060 - ph * 300} r={2 + rnd(i, 5) * 3} fill="#ffb060" opacity={Math.sin(ph * Math.PI) * 0.8} />; })}
      </SV>
      <Tag a={at(p, "bar", 40) + 10} t="HEAVY LOGS ACROSS THE DOOR" x={960} y={80} size={56} />
      <Tag a={at(p, "months", 200)} t="SUNSET TO SUNRISE · FOR MONTHS" x={960} y={900} size={48} color={ORA} />
    </Scene>
  );
};

// 10 · MORNING COUNT: al amanecer, una fila de siluetas sale de las casas y una mano invisible las cuenta con palotes de tiza;
//     una casilla queda vacía
export const MorningCount: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const dawn = ez(f, 0, d * 0.5), n = 9, gap = 5, t0 = Math.min(at(p, "count", 30), Math.round(d * 0.2));
  const shown = Math.floor(lin(f, t0, t0 + 150) * (n + 0.99));
  return (
    <Scene d={d} bg={p.bg} floor="255,200,150" tint="#151a24">
      <AbsoluteFill style={{ background: `linear-gradient(rgb(${40 + 120 * dawn},${50 + 90 * dawn},${80 + 60 * dawn}) 0%, rgb(${80 + 150 * dawn},${60 + 110 * dawn},${60 + 60 * dawn}) 70%, #1b1612 100%)` }} />
      <SV>
        <Ridges n={3} base={760} col={[40, 46, 60]} fog={0.25 * (1 - dawn)} />
        <path d="M0,780 L1920,780 L1920,1080 L0,1080 Z" fill="#1d1712" />
        <KHouse x={220} y={780} s={0.8} /><KHouse x={1720} y={780} s={0.8} />
        {Array.from({ length: n }).map((_, i) => { const x = 460 + i * 125, on = i < shown, miss = i === gap;
          return <g key={i}>
            {!miss && <g opacity={on ? 1 : 0.4}><Fig x={x} y={780} s={1.3} c="#0f0b08" /></g>}
            {miss && <rect x={x - 40} y={540} width={80} height={240} rx={10} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="12 10" opacity={on ? 1 : 0} />}
            {on && !miss && <line x1={x - 10} y1={830} x2={x + 10} y2={890} stroke={INK} strokeWidth={8} strokeLinecap="round" />}
            <text x={x} y={960} fill={miss && on ? RED : "rgba(244,239,230,.8)"} fontFamily={F} fontWeight={900} fontSize={40} textAnchor="middle" opacity={on ? 1 : 0}>{miss ? "—" : i + 1 - (i > gap ? 1 : 0)}</text>
          </g>; })}
      </SV>
      <Tag a={t0} t="EVERY MORNING" x={960} y={90} size={66} />
      <Tag a={t0 + Math.round(120 * (gap + 1) / n)} t="?" x={460 + gap * 125} y={430} size={120} color={RED} w={200} />
    </Scene>
  );
};

// 11 · FUZZY NUMBER: «~400» enorme que se deshace en una banda: los informes de aldea suman, algunas muertes de otros animales restan,
//     las aldeas sin registro agregan; queda el rango con la barra de error y «even cut in half» = 200 sigue siendo de récord
export const FuzzyNumber: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a1 = at(p, "lower", 120), a2 = at(p, "higher", 220), a3 = at(p, "half", 360);
  const lo = 400 - 120 * ez(f, a1, a1 + 30), hi = 400 + 120 * ez(f, a2, a2 + 30), half = ez(f, a3, a3 + 30);
  const X = (v: number) => 260 + (v / 600) * 1400;
  return (
    <Scene d={d} bg={p.bg} floor="255,120,90" tint="#0b0b0e">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2a1414 0%, #07070a 75%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 280, color: RED, letterSpacing: -8,
        filter: `blur(${6 * ez(f, a1, a2 + 30)}px)`, opacity: 1 - 0.55 * ez(f, a1, a2 + 30) }}>~400</div>
      <SV>
        <line x1={X(0)} y1={720} x2={X(600)} y2={720} stroke="rgba(255,255,255,.35)" strokeWidth={4} />
        {[0, 100, 200, 300, 400, 500, 600].map((v) => <g key={v}><line x1={X(v)} y1={705} x2={X(v)} y2={735} stroke="rgba(255,255,255,.35)" strokeWidth={3} /><text x={X(v)} y={790} fill="rgba(244,239,230,.65)" fontFamily={F} fontWeight={800} fontSize={32} textAnchor="middle">{v}</text></g>)}
        <rect x={X(lo)} y={690} width={X(hi) - X(lo)} height={60} rx={30} fill="rgba(241,69,54,.35)" stroke={RED} strokeWidth={4} />
        <circle cx={X(400)} cy={720} r={14} fill={INK} />
        <g opacity={half}><line x1={X(200)} y1={620} x2={X(200)} y2={820} stroke={GOLD} strokeWidth={6} strokeDasharray="10 10" /><circle cx={X(200)} cy={720} r={12} fill={GOLD} /></g>
      </SV>
      <Tag a={a1} t="− blamed on other animals" x={X(280) - 40} y={840} size={34} color={INK} w={520} />
      <Tag a={a2} t="+ never reported" x={X(520)} y={840} size={34} color={INK} w={420} />
      <Tag a={a3} t="EVEN HALF IS A RECORD" x={X(200)} y={560} size={44} color={GOLD} w={700} />
      <Tag a={6} t="AN ESTIMATE" x={960} y={60} size={50} />
    </Scene>
  );
};

// 12 · TWIN TERRITORIES: dos áreas vecinas de Kumaon iluminándose: Champawat (tigresa, 436, abatida 1907) y Panar (leopardo, ~400, 1910);
//     una línea de tiempo abajo que une las dos fechas: «a decade of dread»
export const TwinTerritories: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a1 = at(p, "tiger", 20), a2 = at(p, "both", 200), a3 = at(p, "decade", 320);
  const k1 = ez(f, a1, a1 + 20), k2 = ez(f, a2, a2 + 20), k3 = ez(f, a3, a3 + 40);
  const blob = (cx: number, cy: number, r: number, s: number) => Array.from({ length: 24 }).map((_, i) => { const a = (i / 24) * Math.PI * 2, rr = r * (0.82 + 0.25 * rnd(i, s)); return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr * 0.7}`; }).join(" L");
  return (
    <Scene d={d} bg={p.bg} floor="255,160,90" tint="#0a1018">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1c2a3d 0%, #070b11 80%)" }} />
      <SV>
        <path d={`M${blob(1220, 430, 300, 2)} Z`} fill={`rgba(237,178,105,${0.15 + 0.3 * k1})`} stroke={ORA} strokeWidth={4} opacity={k1} />
        <path d={`M${blob(700, 470, 300, 5)} Z`} fill={`rgba(241,69,54,${0.15 + 0.3 * k2})`} stroke={RED} strokeWidth={4} opacity={k2} />
        <line x1={300} y1={900} x2={1620} y2={900} stroke="rgba(255,255,255,.3)" strokeWidth={4} />
        {[1900, 1905, 1910].map((y) => <text key={y} x={300 + (y - 1900) * 132} y={960} fill="rgba(244,239,230,.6)" fontFamily={F} fontWeight={800} fontSize={30} textAnchor="middle">{y}</text>)}
        <rect x={300} y={884} width={1320 * k3} height={32} rx={16} fill="rgba(241,69,54,.4)" />
        <circle cx={300 + 7 * 132} cy={900} r={16 * k1} fill={ORA} /><circle cx={1620} cy={900} r={16 * k2} fill={RED} />
      </SV>
      <div style={{ position: "absolute", left: 1040, top: 330, width: 360, textAlign: "center", fontFamily: F, opacity: k1 }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: INK }}>CHAMPAWAT TIGRESS</div><div style={{ fontSize: 110, fontWeight: 900, color: ORA }}>436</div><div style={{ fontSize: 32, fontWeight: 700, color: INK }}>shot 1907</div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 370, width: 360, textAlign: "center", fontFamily: F, opacity: k2 }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: INK }}>PANAR LEOPARD</div><div style={{ fontSize: 110, fontWeight: 900, color: RED }}>~400</div><div style={{ fontSize: 32, fontWeight: 700, color: INK }}>1910</div>
      </div>
      <Tag a={a3} t="A DECADE OF DREAD" x={960} y={790} size={58} color={RED} />
      <Tag a={4} t="SAME HILLS · SAME YEARS" x={960} y={80} size={52} />
    </Scene>
  );
};

// 13 · THREE TERMS: un telegrama/carta del gobierno sobre el escritorio; Corbett tacha y agrega sus 3 condiciones, cada una con su sello
export const ThreeTerms: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const R = [["NO REWARD", "so it is never about money", at(p, "r1", 40)], ["OTHER HUNTERS CALLED OFF", "no shots in the dark, no wounded cat", at(p, "r2", 160)], ["ON FOOT · OFTEN ALONE", "one quiet man moves where a party can't", at(p, "r3", 320)]] as const;
  const s = ez(f, 0, 24);
  return (
    <Scene d={d} bg={p.bg} floor="255,200,140" tint="#1a120c">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #4a3020 0%, #120c08 80%)" }} />
      <div style={{ position: "absolute", left: 360, top: 90 + (1 - s) * 80, width: 1200, height: 900, background: "#efe3c8", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotate(${-1.5 + (1 - s) * 4}deg)`, padding: "60px 80px", boxSizing: "border-box", fontFamily: "'Courier New', monospace", color: "#3a2c20" }}>
        <div style={{ fontSize: 30, letterSpacing: 4, fontWeight: 700, opacity: 0.75 }}>KUMAON · ALMORA DISTRICT · 1910</div>
        <div style={{ fontSize: 54, fontWeight: 900, fontFamily: F, marginTop: 12 }}>MY TERMS</div>
        {R.map(([t, sub, a], i) => { const k = ez(f, a, a + 14), st = sp(f, a + 10, 0.7, 9);
          return <div key={t} style={{ marginTop: 40, opacity: k, transform: `translateX(${(1 - k) * -30}px)`, position: "relative" }}>
            <div style={{ fontSize: 52, fontWeight: 900, fontFamily: F, color: "#2a1a10" }}>{i + 1}. {t}</div>
            <div style={{ fontSize: 34, marginTop: 6 }}>{sub}</div>
            <div style={{ position: "absolute", right: -10, top: -6, width: 110, height: 110, borderRadius: 60, border: `6px solid ${RED}`, color: RED, fontFamily: F, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${2 - st}) rotate(-14deg)`, opacity: st }}>✓</div>
          </div>; })}
      </div>
    </Scene>
  );
};

// 23 · ONE YEAR, TWO CATS: la cinta del año 1910 que se desenrolla sobre las crestas; caen dos sellos: el leopardo de Panar y la tigresa de Mukteshwar
export const OneYearTwoCats: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const roll = ez(f, 0, 30), a1 = 10, a2 = at(p, "tiger", 150), s1 = sp(f, a1 + 10, 0.8, 9), s2 = sp(f, a2, 0.8, 9);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,100" tint="#0b1622">
      <AbsoluteFill style={{ background: "linear-gradient(#101c2c 0%, #2c3550 55%, #3a2a1f 100%)" }} />
      <SV>
        <Ridges n={4} base={1000} col={[24, 34, 50]} pan={-f * 0.2} fog={0.2} />
        <rect x={960 - 760 * roll} y={160} width={1520 * roll} height={150} rx={20} fill="#efe3c8" />
        <g opacity={s1}><g transform={`translate(560,${700 - (1 - s1) * 120}) scale(${0.8 + 0.2 * s1})`}><circle r={170} fill="rgba(241,69,54,.18)" stroke={RED} strokeWidth={8} /><Leo x={-150} y={60} s={0.62} c="#120b08" /></g></g>
        <g opacity={s2}><g transform={`translate(1360,${700 - (1 - s2) * 120}) scale(${0.8 + 0.2 * s2})`}><circle r={170} fill="rgba(237,178,105,.18)" stroke={ORA} strokeWidth={8} /><Leo x={-170} y={64} s={0.74} c="#1a0f08" />{Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M${-150 + k * 24},${-22} q6,18 0,${34}`} stroke="#c8782a" strokeWidth={7} fill="none" strokeLinecap="round" />)}</g></g>
      </SV>
      <div style={{ position: "absolute", left: 0, right: 0, top: 172, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 110, color: "#3a2614", opacity: roll }}>1910</div>
      <Tag a={a1 + 14} t="PANAR LEOPARD" x={560} y={920} size={44} color={RED} w={600} />
      <Tag a={a2 + 6} t="MUKTESHWAR TIGRESS" x={1360} y={920} size={44} color={ORA} w={600} />
      <Tag a={at(p, "year", 300)} t="ONE MAN · ONE YEAR · TWO MAN-EATERS" x={960} y={360} size={44} w={1400} />
    </Scene>
  );
};
