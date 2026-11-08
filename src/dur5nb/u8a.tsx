// dur5nb — componentes únicos 1-13 (gancho, tramos 10, 9 y 8). Cada uno = «tú» dentro del oficio, todo dibujado por código.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV, Tu, Sting, Meter } from "./pkit";

type UP = { d: number; p: any };
const Num: React.FC<{ x: number; y: number; v: string; c?: string; size?: number; o?: number; label?: string }> = ({ x, y, v, c = INK, size = 120, o = 1, label }) => (
  <div style={{ position: "absolute", left: x - 400, top: y, width: 800, textAlign: "center", fontFamily: F, fontWeight: 900, opacity: o, color: c, fontVariantNumeric: "tabular-nums" }}>
    <div style={{ fontSize: size, lineHeight: 1, textShadow: "0 6px 26px rgba(0,0,0,.7)" }}>{v}</div>
    {label && <div style={{ fontSize: 30, letterSpacing: 4, color: "rgba(240,235,229,.8)", marginTop: 8 }}>{label}</div>}
  </div>
);
const cnt = (f: number, a: number, n: number, len = 30) => Math.round(n * ez(f, a, a + len));

// 1 · EL PLATO DEL EMPERADOR: mesa romana a la luz de lámparas, el plato de hongos llega hasta ti, comes primero y la sala entera te mira
export const PlatoHongos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const slide = ez(f, at(p, "plato", 30), at(p, "plato", 30) + 40), bite = at(p, "primero", 200);
  const chew = f > bite ? Math.abs(Math.sin((f - bite) / 5)) : 0, look = ez(f, at(p, "miran", 330) - 10, at(p, "miran", 330) + 12);
  const beat = 1 + 0.06 * Math.max(0, Math.sin(f / 7)) * look;
  return (
    <Scene d={d} bg={p.bg} floor="255,160,80" tint="#140b06">
      <SV>
        {[300, 960, 1620].map((x, i) => <g key={i}><rect x={x - 40} y={120} width={80} height={560} fill="#2b1a10" /><rect x={x - 60} y={110} width={120} height={26} fill="#3a2414" /></g>)}
        {[520, 1400].map((x, i) => { const fl = 0.8 + 0.2 * Math.sin(f / 4 + i); return <g key={i}><ellipse cx={x} cy={300} rx={90 * fl} ry={120 * fl} fill="rgba(255,170,80,.18)" /><path d={`M${x},${262 - 18 * fl} q14,22 0,34 q-14,-12 0,-34`} fill="#ffcf73" /><rect x={x - 18} y={300} width={36} height={14} rx={6} fill="#6b4a2a" /></g>; })}
        {[-1, 1].flatMap((sd) => [0, 1, 2].map((i) => ({ sd, i }))).map(({ sd, i }) => {
          const x = 960 + sd * (330 + i * 190), y = 640 - i * 20, turn = look * sd * -1;
          return <g key={`${sd}${i}`} transform={`translate(${x},${y})`} opacity={0.92}><rect x={-46} y={-30} width={92} height={150} rx={30} fill="#0f0905" /><g transform={`translate(${turn * 10},0)`}><circle cx={0} cy={-62} r={34} fill="#0f0905" /></g></g>;
        })}
        <path d="M240,760 L1680,760 L1780,1080 L140,1080 Z" fill="#5a3218" /><path d="M240,760 L1680,760 L1690,790 L230,790 Z" fill="#7a4a24" />
        <g transform={`translate(${960 + (1 - slide) * 700},${840}) scale(${beat})`}>
          <ellipse cx={0} cy={20} rx={230} ry={58} fill="rgba(0,0,0,.45)" /><ellipse cx={0} cy={0} rx={220} ry={60} fill="#c9b48e" /><ellipse cx={0} cy={-4} rx={170} ry={42} fill="#a8916a" />
          {Array.from({ length: 9 }).map((_, i) => { const x = -120 + (i % 5) * 60 + (i > 4 ? 30 : 0), y = i > 4 ? 6 : -20; const gone = i === 4 && f > bite ? 1 : 0;
            return <g key={i} transform={`translate(${x},${y})`} opacity={1 - gone}><ellipse cx={0} cy={0} rx={30} ry={17} fill="#d9873a" /><ellipse cx={0} cy={-3} rx={24} ry={11} fill="#efa24c" /><rect x={-6} y={6} width={12} height={16} rx={5} fill="#f3e6c8" /></g>; })}
        </g>
      </SV>
      <Tu x={960} y={1080 + 60} s={1.5} bob={-chew * 6} />
      <Tag a={at(p, "roma", 10)} t="ROMA · AÑO 54" x={960} y={110} size={50} color={GOLD} />
      <Tag a={at(p, "emperador", 120)} t="NO SON PARA TI" x={500} y={420} size={46} />
      <Tag a={bite} t="TÚ COMES PRIMERO" x={1420} y={420} size={54} color={ORA} />
      <Tag a={at(p, "miran", 330)} t="todos te miran la cara" x={960} y={180} size={44} color={RED} />
      <Motes c="255,200,140" />
    </Scene>
  );
};

// 2 · CIEN TARJETAS: una cuadrícula de 100 oficios entra en ola del 100 al 1; el 1 queda tapado en rojo; un sello aclara que los tiempos son un juego
export const CienTrabajos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a0 = at(p, "cien", 10), juego = at(p, "juego", 240);
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98" tint="#0f0b08" push={0.03}>
      {Array.from({ length: 100 }).map((_, k) => {
        const n = 100 - k, r = Math.floor(k / 10), c = k % 10, s = sp(f, a0 + k * 1.2, 0.7, 12);
        const x = 470 + c * 100, y = 150 + r * 76, last = n === 1, glow = last ? 0.5 + 0.5 * Math.sin(f / 6) : 0;
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, width: 88, height: 64, borderRadius: 8, fontFamily: F, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center",
            background: last ? `rgba(241,69,54,${0.6 + 0.4 * glow})` : `hsl(${30 - r * 2},${30 + r * 3}%,${26 - r}%)`, color: last ? "#fff" : INK, opacity: s,
            transform: `perspective(600px) rotateX(${(1 - s) * 90}deg)`, boxShadow: last ? `0 0 ${30 * glow}px rgba(241,69,54,.8)` : "0 4px 10px rgba(0,0,0,.4)" }}>{last ? "?" : n}</div>
        );
      })}
      <Tag a={at(p, "menos", 120)} t="del menos terrible…" x={240} y={180} size={36} w={380} />
      <Tag a={at(p, "peor", 150)} t="…al peor" x={1700} y={860} size={44} color={RED} w={380} />
      <div style={{ position: "absolute", left: 1500, top: 300, width: 330, padding: "14px 18px", border: `4px solid ${GOLD}`, borderRadius: 10, fontFamily: F, fontWeight: 900, fontSize: 28, color: GOLD, textAlign: "center",
        transform: `rotate(-8deg) scale(${0.6 + 0.4 * sp(f, juego, 0.8, 10)})`, opacity: ez(f, juego, juego + 6) }}>ORDEN Y TIEMPOS: NUESTROS<br />LOS OFICIOS: REALES</div>
      <Tag a={a0} t="100 TRABAJOS" x={960} y={40} size={64} color={GOLD} />
    </Scene>
  );
};

// 3 · TRES CENAS: tres platos en fila; cada uno se vacía; en la tercera la cuchara tiembla y los guardias se acercan
export const CatadorTres: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const c3 = at(p, "tercera", d * 0.6), shake = ez(f, c3, c3 + 20) * Math.sin(f * 1.7) * 9, guard = ez(f, at(p, "guardias", 60), at(p, "guardias", 60) + 40);
  const wait = at(p, "veneno", 120);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,90" tint="#120a06">
      <SV>
        <path d="M120,700 L1800,700 L1920,1080 L0,1080 Z" fill="#4a2a15" />
        {[0, 1, 2].map((i) => { const x = 520 + i * 440, on = at(p, i === 0 ? "pruebas" : i === 1 ? "veneno" : "tercera", 40 + i * 120), eat = ez(f, on, on + 50);
          return <g key={i} transform={`translate(${x},780)`} opacity={ez(f, on - 20, on)}><ellipse cx={0} cy={14} rx={170} ry={46} fill="rgba(0,0,0,.4)" /><ellipse cx={0} cy={0} rx={160} ry={44} fill="#cdb995" />
            {Array.from({ length: 6 }).map((_, j) => <ellipse key={j} cx={-90 + j * 36} cy={-6 + (j % 2) * 10} rx={24} ry={12} fill="#d9873a" opacity={j < 6 - eat * 6 ? 1 : 0} />)}
            <text x={0} y={110} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={i === 2 ? RED : INK}>{`CENA ${i + 1}`}</text></g>; })}
        <g transform={`translate(${1400 + shake},560) rotate(${-30 + shake})`}><rect x={-8} y={0} width={16} height={180} rx={8} fill="#d8d0c0" /><ellipse cx={0} cy={0} rx={30} ry={20} fill="#e8e0d0" /></g>
      </SV>
      <Tu x={180 + (1 - guard) * -160} y={700} s={1.2} arms="spear" dark />
      <Tu x={1740 + (1 - guard) * 160} y={700} s={1.2} arms="spear" dark flip />
      <div style={{ position: "absolute", left: 760, top: 120, width: 400, height: 140, fontFamily: F, fontWeight: 900, fontSize: 30, textAlign: "center", color: INK, opacity: ez(f, wait, wait + 8) }}>
        <div>¿YA PASÓ EL PELIGRO?</div>
        <div style={{ fontSize: 80, color: ORA, fontVariantNumeric: "tabular-nums" }}>{`${Math.floor(lin(f, wait, d) * 59)}:${String(Math.floor(f / 30) % 60).padStart(2, "0")}`}</div>
      </div>
      <Tag a={c3} t="te tiembla la cuchara" x={1400} y={420} size={42} color={RED} w={600} />
    </Scene>
  );
};

// 4 · LA TORRE DEL CAMPANERO: tormenta sobre un pueblo, los rayos buscan el campanario; tres contadores del estudio de 1784
export const RayosTorre: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const strike = (f % 46) < 4, a1 = at(p, "torres", 60), a2 = at(p, "anos", 110), a3 = at(p, "muertos", 160);
  const bell = Math.sin(f / 5) * 18;
  return (
    <Scene d={d} bg={p.bg} floor="160,180,255" tint="#0a0d14">
      <AbsoluteFill style={{ background: strike ? "rgba(220,230,255,.35)" : "transparent" }} />
      <SV>
        {Array.from({ length: 5 }).map((_, i) => <ellipse key={i} cx={(i * 480 + f * 1.2) % 2400 - 240} cy={120 + i * 20} rx={420} ry={90} fill="#1d2433" opacity={0.85} />)}
        <path d="M0,900 L300,860 L520,880 L760,850 L1200,870 L1500,840 L1920,880 L1920,1080 L0,1080 Z" fill="#0d1018" />
        {[200, 360, 1300, 1500, 1680].map((x, i) => <path key={i} d={`M${x},880 l0,-90 l60,-50 l60,50 l0,90 Z`} fill="#141924" />)}
        <path d="M900,880 L900,420 L960,330 L1020,420 L1020,880 Z" fill="#1a2030" /><path d="M960,330 L960,250" stroke="#2a3348" strokeWidth={6} />
        <g transform={`rotate(${bell} 960 470)`}><path d="M925,470 Q925,520 915,540 L1005,540 Q995,520 995,470 Q960,440 925,470 Z" fill={GOLD} /></g>
        {strike && <path d={`M${940 + rnd(Math.floor(f / 46)) * 40},0 L930,90 L975,120 L945,250`} stroke="#eaf0ff" strokeWidth={7} fill="none" />}
      </SV>
      <Tu x={960} y={640} s={0.42} arms="up" />
      <Num x={330} y={240} v={String(cnt(f, a1, 386))} label="TORRES ALCANZADAS" size={110} o={ez(f, a1, a1 + 6)} />
      <Num x={1590} y={240} v={String(cnt(f, a2, 33))} label="AÑOS" size={110} o={ez(f, a2, a2 + 6)} />
      <Num x={1590} y={560} v={String(cnt(f, a3, 103))} label="CAMPANEROS MUERTOS" size={120} c={RED} o={ez(f, a3, a3 + 6)} />
      <Tag a={at(p, "estudio", 10)} t="ALEMANIA · ESTUDIO DE 1784" x={330} y={110} size={34} color={GOLD} w={600} />
    </Scene>
  );
};

// 5 · LA LENTE SOBRE MERCURIO: la lente de faro gira flotando en una bandeja plateada; el vapor sube y viaja hasta tu catre
export const LenteMercurio: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const rot = f * 0.9, vap = ez(f, at(p, "dormias", 80) - 30, at(p, "dormias", 80));
  return (
    <Scene d={d} bg={p.bg} floor="200,210,230" tint="#0b0f16">
      <SV>
        <path d="M0,820 L1920,820 L1920,1080 L0,1080 Z" fill="#141a24" />
        <ellipse cx={760} cy={700} rx={380} ry={60} fill="#9aa4b4" /><ellipse cx={760} cy={694} rx={360} ry={50} fill="#d7dde6" />
        {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={760} cy={694} rx={120 + i * 40 + Math.sin(f / 9 + i) * 6} ry={(120 + i * 40) * 0.13} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={2} />)}
        <g transform={`translate(760,${430 + Math.sin(f / 30) * 4})`}>
          <ellipse cx={0} cy={230} rx={260} ry={34} fill="#3b4250" />
          {Array.from({ length: 8 }).map((_, i) => { const a = ((rot + i * 45) % 360) * Math.PI / 180, x = Math.sin(a) * 230, front = Math.cos(a) > 0;
            return <g key={i} opacity={front ? 1 : 0.35}><rect x={x - 50 * Math.abs(Math.cos(a)) - 4} y={-200} width={100 * Math.abs(Math.cos(a)) + 8} height={420} rx={8} fill="rgba(190,225,255,.25)" stroke="rgba(220,240,255,.8)" strokeWidth={3} />
              {[0, 1, 2, 3, 4].map((j) => <line key={j} x1={x - 46 * Math.abs(Math.cos(a))} x2={x + 46 * Math.abs(Math.cos(a))} y1={-160 + j * 80} y2={-160 + j * 80} stroke="rgba(220,240,255,.6)" strokeWidth={2} />)}</g>; })}
          <circle cx={0} cy={0} r={40} fill="#fff3c4" opacity={0.85} />
        </g>
        {Array.from({ length: 14 }).map((_, i) => { const ph = ((f / 120) + rnd(i)) % 1; const x = 760 + ph * 820 + Math.sin(f / 20 + i) * 30, y = 680 - Math.sin(ph * Math.PI) * 260;
          return <circle key={i} cx={x} cy={y} r={30 + ph * 30} fill="rgba(200,215,235,.14)" opacity={vap} />; })}
        <rect x={1460} y={760} width={360} height={50} rx={10} fill="#5a4a3a" /><rect x={1470} y={730} width={320} height={40} rx={14} fill="#b8a888" />
      </SV>
      <Tu x={1640} y={760} s={0.9} rot={-84} />
      <Tag a={at(p, "lentes", 10)} t="Hg · BAÑO DE MERCURIO" x={760} y={860} size={46} color="#cfd8e6" />
      <Tag a={at(p, "dormias", 80)} t="y tú dormías al lado" x={1640} y={560} size={40} w={560} />
    </Scene>
  );
};

// 6 · LA ESCALERA DE CUERDA: acantilado de 100 m, tú colgado de una escalera que se balancea, el panal y el enjambre alrededor
export const EscaleraMiel: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 22) * 6, climb = lin(f, 10, d - 10), sw2 = ez(f, at(p, "enjambre", 60), at(p, "enjambre", 60) + 30);
  const m = Math.round(100 * (1 - climb * 0.35));
  return (
    <Scene d={d} bg={p.bg} floor="230,190,120" tint="#120d08">
      <SV>
        <path d="M1100,0 L1920,0 L1920,1080 L1180,1080 Q1060,700 1140,420 Q1080,200 1100,0 Z" fill="#3a2c1e" />
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${1120 + rnd(i) * 60},${i * 110} q${200 + rnd(i, 2) * 300},20 ${800},${10}`} stroke="#2a1f14" strokeWidth={4} fill="none" />)}
        <path d="M1150,120 Q1060,170 1150,260 Q1240,170 1150,120 Z" fill="#b07a2a" /><path d="M1150,140 Q1090,180 1150,240" stroke="#7a5218" strokeWidth={6} fill="none" />
        <g transform={`rotate(${sw} 980 0)`}>
          <line x1={950} y1={0} x2={950} y2={1080} stroke="#c9a46a" strokeWidth={6} /><line x1={1010} y1={0} x2={1010} y2={1080} stroke="#c9a46a" strokeWidth={6} />
          {Array.from({ length: 22 }).map((_, i) => <line key={i} x1={950} x2={1010} y1={i * 50 + 20} y2={i * 50 + 20} stroke="#c9a46a" strokeWidth={5} />)}
        </g>
        {Array.from({ length: 70 }).map((_, i) => { const a = f / (10 + rnd(i) * 14) + i, r = 60 + rnd(i, 3) * 260 * sw2;
          return <circle key={i} cx={1150 + Math.cos(a) * r} cy={200 + Math.sin(a * 1.3) * r * 0.6} r={4} fill="#ffd23a" opacity={0.3 + 0.7 * sw2} />; })}
      </SV>
      <Tu x={980 + sw * 8} y={760 - climb * 380} s={0.9} arms="up" />
      <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F, fontWeight: 900, color: INK }}>
        <div style={{ fontSize: 26, letterSpacing: 4, opacity: 0.8 }}>HASTA EL SUELO</div>
        <div style={{ fontSize: 120, fontVariantNumeric: "tabular-nums" }}>{m} m</div>
      </div>
      <Tag a={at(p, "enjambre", 60)} t="las abejas más grandes del mundo" x={500} y={820} size={40} color={GOLD} w={760} />
      <Tag a={at(p, "nepal", 10)} t="NEPAL" x={300} y={110} size={38} color={GOLD} w={400} />
    </Scene>
  );
};

// 7 · EL CLUB DE LA RED: bajo la torre, 19 hombres caen y la red los atrapa; el 17 de febrero de 1937 la red se rompe
export const ClubRed: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const c19 = at(p, "diecinueve", 60), rip = at(p, "andamio", d * 0.7), torn = ez(f, rip, rip + 14);
  const caught = Math.min(19, Math.max(0, Math.floor((f - c19) / 4) + 1));
  return (
    <Scene d={d} bg={p.bg} floor="241,120,60" tint="#0e0b0b">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#1a1414" opacity={0.3} />
        <rect x={420} y={0} width={80} height={1080} fill="#b23a22" /><rect x={560} y={0} width={80} height={1080} fill="#b23a22" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={420} y={60 + i * 110} width={220} height={18} fill="#8c2c18" />)}
        <path d="M640,300 Q1300,620 1920,340" stroke="#b23a22" strokeWidth={10} fill="none" />
        {Array.from({ length: 18 }).map((_, i) => <line key={i} x1={700 + i * 68} y1={300 + Math.sin((i / 17) * Math.PI) * 300 * 0.95} x2={700 + i * 68} y2={600} stroke="#b23a22" strokeWidth={3} />)}
        <rect x={640} y={590} width={1280} height={22} fill="#8c2c18" />
        {(() => { const sag = 30 + 10 * Math.sin(f / 10); const mid = 1280;
          return <g>
            <path d={`M660,720 Q${mid - 300 * torn},${720 + sag + torn * 160} ${mid - 10 - torn * 80},${720 + torn * 300}`} stroke="#d9cdb0" strokeWidth={4} fill="none" />
            <path d={`M${mid + 10 + torn * 80},${720 + torn * 300} Q${mid + 300 * torn},${720 + sag + torn * 160} 1900,720`} stroke="#d9cdb0" strokeWidth={4} fill="none" />
            {Array.from({ length: 24 }).map((_, i) => { const x = 680 + i * 52, sideL = x < mid; const dy = sag * Math.sin(((x - 660) / 1240) * Math.PI) + torn * (sideL ? (x - 660) / 620 : (1900 - x) / 620) * 300;
              return <line key={i} x1={x} y1={720 + dy - 30} x2={x + 26} y2={720 + dy + 20} stroke="#d9cdb0" strokeWidth={2} opacity={0.7} />; })}
          </g>; })()}
        {Array.from({ length: caught }).map((_, i) => { const t0 = c19 + i * 4, k = ez(f, t0, t0 + 10), x = 760 + (i % 10) * 110, y = 610 + k * 120 + (i > 9 ? 20 : 0);
          return <g key={i} opacity={1 - torn * 0.6}><circle cx={x} cy={y - 26} r={10} fill="#e8d8c0" /><rect x={x - 9} y={y - 16} width={18} height={30} rx={6} fill="#e8d8c0" /></g>; })}
      </SV>
      <Num x={1640} y={110} v={String(caught)} label="ATRAPADOS POR LA RED" size={130} o={ez(f, c19, c19 + 6) * (1 - torn)} />
      <Num x={1640} y={110} v="10" label="17-FEB-1937 · LA RED SE ROMPE" size={130} c={RED} o={torn} />
      <Tag a={at(p, "club", c19 + 60)} t="CLUB DE MEDIO CAMINO AL INFIERNO" x={1060} y={900} size={44} color={GOLD} w={1100} />
    </Scene>
  );
};

// 8 · LA VIGA EN LA NIEBLA: tú caminas sobre 40 cm de acero a 67 m del agua; abajo la red se mueve con el viento
export const VigaNiebla: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const walk = lin(f, 20, d), look = ez(f, at(p, "abajo", d * 0.55), at(p, "abajo", d * 0.55) + 30), wind = Math.sin(f / 16) * (20 + 30 * look);
  return (
    <Scene d={d} bg={p.bg} floor="200,210,220" tint="#0d1218" push={0.02}>
      <AbsoluteFill style={{ background: "linear-gradient(#55626e, #1d2a36 60%, #0a1420)" }} />
      <SV>
        <g transform={`translate(0,${look * -380})`}>
          <rect x={0} y={560} width={1920} height={50} fill="#b23a22" /><rect x={0} y={606} width={1920} height={14} fill="#7a2614" />
          {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={80 + i * 160} cy={585} r={6} fill="#5a1a0c" />)}
          <path d={`M0,1380 Q960,${1420 + wind} 1920,1380`} stroke="#d9cdb0" strokeWidth={5} fill="none" />
          {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${i * 66},1380 Q${i * 66 + 33},${1420 + wind * Math.sin((i / 29) * Math.PI)} ${i * 66 + 66},1380`} stroke="#d9cdb0" strokeWidth={2} fill="none" opacity={0.6} />)}
          <rect x={0} y={1700} width={1920} height={200} fill="#0d2a3a" />
        </g>
        {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={((f * (1 + i * 0.3)) % 2600) - 700} y={180 + i * 140} width={900} height={90} rx={45} fill="rgba(220,228,236,.13)" />)}
      </SV>
      <Tu x={240 + walk * 1400} y={560 - look * 380} s={0.95} walk rot={Math.sin(f / 9) * 2} />
      <Tag a={at(p, "viga", 10)} t="40 CM DE ANCHO" x={960} y={640 - 0} size={40} color={GOLD} w={500} />
      <div style={{ position: "absolute", left: 1560, top: 140, fontFamily: F, fontWeight: 900, color: INK, opacity: ez(f, at(p, "metros", 40), at(p, "metros", 40) + 8) }}>
        <div style={{ fontSize: 26, letterSpacing: 4 }}>HASTA EL AGUA</div><div style={{ fontSize: 120 }}>67 m</div>
      </div>
      <Tag a={at(p, "cuanto", d * 0.75)} t="¿cuánto peso aguanta?" x={960} y={860} size={52} color={RED} w={900} />
    </Scene>
  );
};

// 9 · LA NASA SOBRE TU CABEZA: la cubierta sube y baja con olas de 10 m; la jaula de 300 kg pasa colgada de la grúa; hielo en la baranda
export const NasaCangrejo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const roll = Math.sin(f / 20) * 9, heave = Math.sin(f / 20 + 1) * 60, sw = Math.sin(f / 14) * 0.9;
  const px = 960 + Math.sin(sw) * 520, py = 300 + Math.cos(sw) * 260 - 260 + 260;
  return (
    <Scene d={d} bg={p.bg} floor="150,190,220" tint="#081018">
      <SV>
        <path d={`M0,${520 + heave * 0.6} Q480,${420 + heave} 960,${520 + heave * 0.5} T1920,${480 + heave}`} fill="none" stroke="#2a4a62" strokeWidth={200} opacity={0.6} />
        <g transform={`rotate(${roll} 960 900) translate(0,${heave * 0.3})`}>
          <path d="M100,760 L1820,760 L1700,1080 L220,1080 Z" fill="#5a6470" /><rect x={100} y={720} width={1720} height={40} fill="#c8d4e0" />
          {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${120 + i * 57},720 l6,22 l6,-22`} fill="#eaf4ff" />)}
          <line x1={240} y1={760} x2={240} y2={160} stroke="#d2a23a" strokeWidth={22} /><line x1={240} y1={170} x2={960} y2={40} stroke="#d2a23a" strokeWidth={16} />
          <line x1={960} y1={40} x2={px} y2={py + 40} stroke="#222" strokeWidth={4} />
          <g transform={`translate(${px - 110},${py + 40})`}><rect x={0} y={0} width={220} height={150} fill="none" stroke="#c9cfd6" strokeWidth={8} />
            {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={i * 44} y1={0} x2={i * 44} y2={150} stroke="#9aa3ad" strokeWidth={3} />)}{Array.from({ length: 4 }).map((_, i) => <line key={i} x1={0} y1={i * 50} x2={220} y2={i * 50} stroke="#9aa3ad" strokeWidth={3} />)}</g>
        </g>
        {Array.from({ length: 40 }).map((_, i) => { const ph = ((f / 40) + rnd(i)) % 1; return <line key={i} x1={rnd(i, 2) * 1920 - ph * 300} y1={ph * 1080} x2={rnd(i, 2) * 1920 - ph * 300 - 20} y2={ph * 1080 + 30} stroke="rgba(230,240,250,.5)" strokeWidth={2} />; })}
      </SV>
      <Tu x={980} y={790} s={1.0} rot={roll * 0.6} arms="up" />
      <Tag a={at(p, "nasas", 30)} t="300 KG" x={px} y={py + 220} size={52} color={RED} w={300} />
      <Tag a={at(p, "olas", 10)} t="OLAS DE 10 M" x={1560} y={120} size={50} w={600} />
      <Tag a={at(p, "hielo", 20)} t="hielo en la cubierta" x={420} y={860} size={36} color="#cfe6ff" w={600} />
    </Scene>
  );
};

// 10 · 132 SOBRE EL HIELO: una placa de hielo en la ventisca, 132 puntos; dos días después se apagan 78
export const FocasHielo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const m = at(p, "murieron", d * 0.6), gone = ez(f, m, m + 40), day = ez(f, 10, m) * 2;
  return (
    <Scene d={d} bg={p.bg} floor="210,225,240" tint="#0c1218">
      <SV>
        <path d="M200,620 L700,520 L1300,540 L1760,640 L1500,820 L700,860 Z" fill="#dfe8ef" /><path d="M200,620 L700,860 L700,880 L190,640 Z" fill="#a8b8c6" />
        {Array.from({ length: 132 }).map((_, i) => { const x = 420 + (i % 22) * 50 + rnd(i) * 18, y = 600 + Math.floor(i / 22) * 40 + rnd(i, 2) * 10; const dead = i < 78;
          return <g key={i}><circle cx={x} cy={y} r={9} fill={dead ? `rgba(${200 - 80 * gone},${60},${50},${1 - 0.6 * gone})` : "#1c2630"} opacity={ez(f, 4 + i * 0.3, 10 + i * 0.3)} /></g>; })}
        {Array.from({ length: 90 }).map((_, i) => { const ph = ((f / (18 + rnd(i) * 10)) + rnd(i, 4)) % 1; return <line key={i} x1={2000 - ph * 2200} y1={rnd(i, 5) * 1080} x2={2000 - ph * 2200 + 40} y2={rnd(i, 5) * 1080 - 6} stroke="rgba(255,255,255,.55)" strokeWidth={3} />; })}
      </SV>
      <Num x={480} y={120} v="132" label="HOMBRES SOBRE EL HIELO" size={110} />
      <Num x={1440} y={120} v={`${day.toFixed(1).replace(".", ",")} días`} label="EN LA VENTISCA" size={100} />
      <Num x={960} y={880} v={String(Math.round(78 * gone))} label="MURIERON" size={90} c={RED} o={gone} />
      <Tag a={at(p, "catorce", 5)} t="TERRANOVA · 1914" x={960} y={40} size={40} color={GOLD} w={700} />
    </Scene>
  );
};

// 11 · LA CARA AMARILLA: el espejo del cuarto; semana a semana tu cara, tus manos y tus sábanas se vuelven amarillas
export const PielCanaria: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const y0 = at(p, "semanas", d * 0.3), k = ez(f, y0, y0 + 220), wk = Math.min(3, Math.floor(k * 3.2) + (f > y0 ? 1 : 0));
  const skin = `rgb(${242 - 10 * k},${196 + 20 * k},${155 - 120 * k})`, sheet = `rgb(${240},${236 - 30 * k},${226 - 150 * k})`;
  const shells = Math.min(14, Math.floor(f / 18));
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98" tint="#100c06">
      <SV>
        <rect x={1180} y={180} width={520} height={640} rx={260} fill="#2a2118" stroke="#a8874a" strokeWidth={18} />
        <ellipse cx={1440} cy={500} rx={250} ry={310} fill="#3a3a44" opacity={0.6} />
        <circle cx={1440} cy={430} r={110} fill={skin} /><path d="M1300,760 Q1300,580 1440,560 Q1580,580 1580,760 Z" fill="#4a4a3a" />
        <path d="M1340,380 Q1440,300 1540,380 L1540,350 Q1440,270 1340,350 Z" fill={`rgb(${120 + 100 * k},${80 + 90 * k},30)`} />
        <path d="M160,880 L900,880 L940,1000 L120,1000 Z" fill={sheet} /><path d="M160,880 Q520,840 900,880" stroke="#c9c0a8" strokeWidth={4} fill="none" />
        {Array.from({ length: shells }).map((_, i) => <g key={i} transform={`translate(${200 + (i % 7) * 90},${700 - Math.floor(i / 7) * 120})`}><rect x={-22} y={-60} width={44} height={110} rx={10} fill="#8a8f96" /><path d="M-22,-60 Q0,-110 22,-60 Z" fill="#6a6f76" /><rect x={-22} y={-10} width={44} height={12} fill="#e9c762" /></g>)}
        {Array.from({ length: 30 }).map((_, i) => { const ph = ((f / 90) + rnd(i)) % 1; return <circle key={i} cx={200 + rnd(i, 2) * 700} cy={760 - ph * 500} r={4} fill="#ffd84a" opacity={0.6 * Math.sin(ph * Math.PI)} />; })}
      </SV>
      <div style={{ position: "absolute", left: 1290, top: 860, width: 300, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 64, color: GOLD, opacity: ez(f, y0, y0 + 6) }}>SEMANA {Math.max(1, wk)}</div>
      <Tag a={at(p, "diecinueve", 6)} t="19 AÑOS · EL MEJOR SUELDO" x={540} y={120} size={44} w={800} />
      <Tag a={at(p, "canaria", d * 0.75)} t="«CANARIA»" x={540} y={260} size={90} color="#ffd84a" w={800} />
      <Tag a={at(p, "tnt", 60)} t="TNT" x={540} y={420} size={60} color={ORA} w={400} />
    </Scene>
  );
};

// 12 · LA CARRETA DE NITRO: el camino de tierra en perfil, la carreta avanza; el frasco se agita en cada bache y el medidor de peligro salta
export const CarretaNitro: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const x = lin(f, 0, d) * 1500 + 200, road = (xx: number) => 820 + Math.sin(xx / 90) * 14 + (Math.abs(((xx - 900) % 520)) < 40 ? -26 : 0);
  const y = road(x), tilt = (road(x + 30) - road(x - 30)) * 0.8, jolt = Math.abs(road(x + 10) - road(x - 10)) > 12 ? 1 : 0;
  const danger = Math.min(1, 0.2 + Math.abs(tilt) / 18 + jolt * 0.5);
  return (
    <Scene d={d} bg={p.bg} floor="220,170,110" tint="#120c07">
      <SV>
        <path d={`M0,${road(0)} ${Array.from({ length: 97 }).map((_, i) => `L${i * 20},${road(i * 20)}`).join(" ")} L1920,1080 L0,1080 Z`} fill="#5a3e22" />
        {[300, 800, 1400].map((dx, i) => <g key={i}><rect x={dx} y={500} width={20} height={300} fill="#3a2a1a" /><path d={`M${dx - 80},520 l100,-160 l100,160 Z`} fill="#24321e" /></g>)}
        <g transform={`translate(${x},${y}) rotate(${tilt})`}>
          <rect x={-150} y={-120} width={300} height={80} rx={8} fill="#7a5230" />
          <circle cx={-100} cy={-30} r={34} fill="none" stroke="#3a2614" strokeWidth={10} /><circle cx={100} cy={-30} r={34} fill="none" stroke="#3a2614" strokeWidth={10} />
          {[-80, -20, 40, 100].map((cx, i) => <g key={i}><rect x={cx - 20} y={-200} width={40} height={84} rx={8} fill="rgba(230,240,200,.35)" stroke="#d8e0c0" strokeWidth={3} />
            <path d={`M${cx - 18},${-150 + Math.sin(f / 3 + i) * 6 * danger} Q${cx},${-158 - Math.sin(f / 3 + i) * 10 * danger} ${cx + 18},${-150 - Math.sin(f / 3 + i) * 6 * danger} L${cx + 18},-118 L${cx - 18},-118 Z`} fill="#e9e3a0" /></g>)}
        </g>
      </SV>
      <Tu x={x - 230} y={y} s={0.9} walk />
      <Meter x={120} y={90} w={520} h={22} k={danger} col={danger > 0.7 ? RED : ORA} label="PELIGRO" val={danger > 0.7 ? "BACHE" : "camino de tierra"} size={58} />
      <Tag a={at(p, "nitroglicerina", 20)} t="NITROGLICERINA" x={1440} y={120} size={56} color={GOLD} w={700} />
      <Tag a={at(p, "pensilvania", 5)} t="PENSILVANIA · SIGLO XIX" x={1440} y={220} size={34} w={700} />
    </Scene>
  );
};

// 13 · LA MÁSCARA DE PICO: el pico relleno de hierbas, y una línea de tiempo que la saca de la peste negra y la manda 300 años después
export const MascaraPico: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const tl = ez(f, at(p, "siglos", 60), at(p, "siglos", 60) + 40), no = at(p, "nada", d * 0.7);
  return (
    <Scene d={d} bg={p.bg} floor="200,180,140" tint="#0f0c0a">
      <SV>
        <g transform={`translate(700,460) scale(1.25)`}>
          <circle cx={0} cy={0} r={150} fill="#1d1712" /><path d="M120,-40 Q420,10 520,150 Q380,90 120,70 Z" fill="#2a2018" stroke="#5a4632" strokeWidth={4} />
          <circle cx={40} cy={-40} r={46} fill="#5a6a6a" stroke="#a8874a" strokeWidth={8} /><circle cx={40} cy={-40} r={30} fill="#9fb0b0" opacity={0.5} />
          {Array.from({ length: 16 }).map((_, i) => { const t = ez(f, 10 + i * 4, 30 + i * 4); const x = 160 + (i % 8) * 38, y = 10 + Math.floor(i / 8) * 34 + (i % 8) * 4;
            return <ellipse key={i} cx={x} cy={y} rx={16 * t} ry={7 * t} transform={`rotate(${rnd(i) * 80 - 40} ${x} ${y})`} fill={i % 3 ? "#7a9a48" : "#a8b860"} />; })}
        </g>
        <line x1={260} y1={900} x2={1660} y2={900} stroke={INK} strokeWidth={5} />
        <circle cx={360} cy={900} r={14} fill={RED} /><text x={360} y={960} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill={INK}>1348</text>
        <circle cx={360 + tl * 1180} cy={900} r={14} fill={GOLD} /><text x={360 + tl * 1180} y={960} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill={GOLD} opacity={tl}>1600s</text>
        <path d={`M380,870 Q${360 + tl * 590},${800} ${340 + tl * 1180},870`} stroke={GOLD} strokeWidth={5} fill="none" opacity={tl} />
      </SV>
      <Tag a={at(p, "relleno", 40)} t="hierbas adentro" x={1260} y={360} size={44} color="#a8c870" w={500} />
      <Tag a={at(p, "siglos", 60)} t="SIGLOS DESPUÉS" x={1000} y={780} size={42} color={GOLD} w={600} />
      <div style={{ position: "absolute", left: 1230, top: 470, padding: "10px 26px", border: `6px solid ${RED}`, borderRadius: 10, fontFamily: F, fontWeight: 900, fontSize: 54, color: RED,
        transform: `rotate(-10deg) scale(${0.5 + 0.5 * sp(f, no, 0.8, 9)})`, opacity: ez(f, no, no + 5) }}>NO PROTEGÍA</div>
    </Scene>
  );
};
