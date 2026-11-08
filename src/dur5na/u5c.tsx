// dur5na — componentes únicos 21-30 (telares, albayalde, guano, tablero, cierre, Gran Hedor).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, sf, at } from "./ukit";
import { SV, Tu, Shovel, Barrow, Sting, Meter } from "./pkit";

type UP = { d: number; p: any };

// 21 · DEBAJO DE LA MÁQUINA: el carro de la hiladora va y viene; tú acostado recoges pelusa; cuando vuelve, la distancia a tu cabeza baja a centímetros
export const MuleCarro: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const pos = (Math.sin(f / 26 - Math.PI / 2) + 1) / 2, cx = 360 + pos * 980;
  const gap = Math.max(4, Math.round(Math.abs(cx + 300 - 1100) / 6));
  const fluff = Array.from({ length: 14 }).map((_, i) => ({ x: 820 + rnd(i, 1) * 600, y: 920 + rnd(i, 2) * 40, t: 20 + i * 14 }));
  return (
    <Scene d={d} bg={p.bg} floor="255,240,220" tint="#16120e">
      <SV>
        <rect x={0} y={950} width={1920} height={130} fill="#4a3f33" />
        <rect x={80} y={300} width={260} height={520} fill="#3a3129" stroke="#1d1712" strokeWidth={6} />
        {Array.from({ length: 26 }).map((_, i) => <line key={i} x1={340} y1={360 + i * 4} x2={cx} y2={360 + i * 4} stroke="rgba(245,240,230,.55)" strokeWidth={1.5} />)}
        <g transform={`translate(${cx},0)`}>
          <rect x={0} y={330} width={600} height={140} fill="#5a4b3b" stroke="#221a12" strokeWidth={6} />
          {Array.from({ length: 22 }).map((_, i) => <g key={i}><line x1={20 + i * 26} y1={300} x2={20 + i * 26} y2={470} stroke="#c9c2b6" strokeWidth={4} /><ellipse cx={20 + i * 26} cy={320} rx={8} ry={14} fill="#efe9dc" /></g>)}
          <rect x={0} y={470} width={600} height={40} fill="#3a3129" />
          {[60, 300, 540].map((x) => <g key={x}><line x1={x} y1={510} x2={x} y2={900} stroke="#2c241c" strokeWidth={18} /><circle cx={x} cy={920} r={30} fill="#222" stroke="#777" strokeWidth={6} /></g>)}
        </g>
        {fluff.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={14} fill="#f4f0e6" opacity={f < q.t ? 0.95 : Math.max(0, 1 - (f - q.t) / 6)} />)}
        <path d={`M${cx + 560},620 L1110,800`} stroke={gap < 30 ? RED : "rgba(240,235,229,.4)"} strokeWidth={4} strokeDasharray="10 8" />
      </SV>
      <Tu x={1020} y={940} s={0.62} rot={-80} />
      <div style={{ position: "absolute", left: 1460, top: 560, fontFamily: F, fontWeight: 900, fontSize: 90, color: gap < 30 ? RED : INK, fontVariantNumeric: "tabular-nums" }}>{gap} cm</div>
      <Tag a={at(p, "debajo", 10)} t="DEBAJO, CON LA MÁQUINA ANDANDO" x={960} y={110} size={60} color={INK} />
      <Motes n={40} c="250,248,240" />
    </Scene>
  );
};

// 22 · APRENDER A CONTAR: cuatro tiempos como una canción; la ventana verde es cuando el carro llegó al final; el pelo atado
export const Ritmo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const beat = Math.floor(f / 18) % 4, ph = (f % 18) / 18;
  const cycle = (f % 72) / 72, carr = (Math.sin(cycle * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  const win = carr > 0.88;
  return (
    <Scene d={d} bg={p.bg} floor="126,224,122" tint="#0d0c0a">
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 300, top: 250, width: 200, height: 200, borderRadius: 100, border: `8px solid ${i === beat ? (i === 3 ? "#7ee07a" : ORA) : "rgba(240,235,229,.25)"}`, background: i === beat ? (i === 3 ? "rgba(126,224,122,.25)" : "rgba(237,178,105,.18)") : "transparent", transform: `scale(${i === beat ? 1.12 - ph * 0.12 : 1})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 110, color: i === beat ? INK : "rgba(240,235,229,.35)" }}>{i + 1}</div>)}
      <div style={{ position: "absolute", left: 420, top: 560, width: 1100, height: 40, borderRadius: 20, background: "rgba(240,235,229,.14)" }}>
        <div style={{ position: "absolute", left: 1100 * 0.88, width: 1100 * 0.12, height: 40, borderRadius: 20, background: "rgba(126,224,122,.45)" }} />
        <div style={{ position: "absolute", left: carr * 1060, top: -14, width: 40, height: 68, borderRadius: 10, background: win ? "#7ee07a" : INK }} />
      </div>
      <div style={{ position: "absolute", left: 420, top: 620, fontFamily: F, fontWeight: 800, fontSize: 30, color: "rgba(240,235,229,.7)" }}>dónde está el carro</div>
      <Tu x={win ? 1240 : 1500} y={960} s={1} rot={win ? -70 : 0} />
      <Tag a={win ? 0 : 99999} t="¡AHORA!" x={1120} y={700} size={70} color="#7ee07a" w={500} />
      <Tag a={at(p, "pelo", d * 0.6)} t="pelo atado · nada colgando" x={500} y={820} size={46} color={ORA} w={800} />
      <Tag a={at(p, "contar", 8)} t="TU VIDA DEPENDE DE CONTAR" x={960} y={100} size={66} color={INK} />
    </Scene>
  );
};

// 23 · LA PILA QUE COCINA EL PLOMO: corte de la pila de estiércol; vasijas con tiras de plomo y vinagre; el calor sube; en semanas el plomo se vuelve blanco
export const PilaEstiercol: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const wk = lin(f, 30, d - 20), white = ez(f, d * 0.35, d - 20);
  const lead = `rgb(${Math.round(110 + 135 * white)},${Math.round(116 + 132 * white)},${Math.round(124 + 124 * white)})`;
  return (
    <Scene d={d} bg={p.bg} floor="255,150,80" tint="#120c07">
      <SV>
        <path d="M200,960 L420,300 L1500,300 L1720,960 Z" fill="#4a3320" />
        {[0, 1, 2].map((r) => <g key={r}>
          <rect x={300 + r * 30} y={380 + r * 190} width={1320 - r * 60} height={26} fill="#6b4c2c" />
          {Array.from({ length: 8 - r }).map((_, i) => { const x = 380 + r * 60 + i * 160; const y = 410 + r * 190;
            return <g key={i}><path d={`M${x},${y} L${x + 110},${y} L${x + 100},${y + 120} Q${x + 55},${y + 140} ${x + 10},${y + 120} Z`} fill="#a0603a" stroke="#5a3218" strokeWidth={4} />
              <path d={`M${x + 25},${y + 30} q30,-10 60,0 q-30,14 -60,0 m0,22 q30,-10 60,0 q-30,14 -60,0`} stroke={lead} strokeWidth={9} fill="none" />
              <ellipse cx={x + 55} cy={y + 110} rx={36} ry={10} fill="rgba(200,180,120,.5)" /></g>; })}
        </g>)}
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${420 + i * 110},300 q16,-40 0,-80 q-16,-40 0,-80`} stroke="rgba(255,170,90,.45)" strokeWidth={6} fill="none" transform={`translate(0,${-((f * 1.5 + i * 30) % 80)})`} opacity={0.6} />)}
      </SV>
      <Meter x={90} y={90} w={420} h={18} k={wk} col={ORA} label="SEMANAS DENTRO DE LA PILA" val={`${Math.round(wk * 6)}`} size={110} />
      <Tag a={at(p, "vinagre", 20)} t="plomo + vinagre + calor" x={1440} y={120} size={44} color={INK} w={760} />
      <Tag a={d * 0.6} t="= BLANCO DE PLOMO" x={1440} y={200} size={62} color="#f2f2f0" w={760} />
      <Tu x={1700} y={960} s={1} op={ez(f, d * 0.65, d * 0.75)} />
    </Scene>
  );
};

// 24 · EL PLOMO SE QUEDA: cargas la bandeja en la cabeza, el polvo blanco cae sobre ti; el medidor de plomo del cuerpo sube y prende sus etapas
const STAGES = [["DOLOR DE ESTÓMAGO", "estomago"], ["LÍNEA AZUL EN LAS ENCÍAS", "encias"], ["MUÑECAS QUE NO SE LEVANTAN", "munecas"]] as const;
export const PlomoCuerpo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const ks = STAGES.map((s, i) => at(p, s[1], 40 + i * 60));
  const lvl = ez(f, 10, Math.max(ks[2] + 20, 60));
  return (
    <Scene d={d} bg={p.bg} floor="230,230,230" tint="#0d0d0e">
      <SV>
        <rect x={380} y={210} width={340} height={40} rx={8} fill="#7a5a34" /><path d="M400,210 Q550,150 700,210 Z" fill="#f2f2f0" />
        {Array.from({ length: 40 }).map((_, i) => { const ph = ((f / 60) + rnd(i, 1)) % 1; return <circle key={i} cx={390 + rnd(i, 2) * 320} cy={250 + ph * 700} r={3 + rnd(i, 3) * 3} fill="#f6f6f4" opacity={0.8 * (1 - ph)} />; })}
      </SV>
      <Tu x={550} y={940} s={2.6} arms="up" />
      <div style={{ position: "absolute", left: 900, top: 220, width: 70, height: 640, borderRadius: 35, background: "rgba(240,235,229,.14)", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, width: 70, height: 640 * lvl, background: "linear-gradient(#c7ccd2,#6f7a83)" }} />
      </div>
      <div style={{ position: "absolute", left: 880, top: 880, fontFamily: F, fontWeight: 900, fontSize: 40, color: INK }}>Pb</div>
      {STAGES.map((s, i) => { const o = ez(f, ks[i], ks[i] + 8); return <div key={i} style={{ position: "absolute", left: 1000, top: 680 - i * 200, display: "flex", alignItems: "center", gap: 20, opacity: 0.25 + 0.75 * o, fontFamily: F }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: o > 0.5 ? RED : "rgba(240,235,229,.25)", boxShadow: o > 0.5 ? `0 0 20px ${RED}` : "none" }} />
        <div style={{ fontSize: 40, fontWeight: 900, color: o > 0.5 ? INK : "rgba(240,235,229,.5)", whiteSpace: "nowrap" }}>{s[0]}</div></div>; })}
      <Tag a={at(p, "acumula", 10)} t="EL PLOMO SE ACUMULA" x={1340} y={90} size={58} color={INK} w={900} />
    </Scene>
  );
};

// 25 · LA RUTA DEL GUANO: del Perú salen barcos a Europa y Estados Unidos; el contador de la riqueza del Perú sube con cada barco
const MAP = { L: -130, R: 180, T: 72, B: -58, W: 1920, H: 805 };
const geo = (lon: number, lat: number): [number, number] => [(lon - MAP.L) / (MAP.R - MAP.L) * MAP.W, (MAP.T - lat) / (MAP.T - MAP.B) * MAP.H + (1080 - MAP.H) / 2];
export const RutaGuano: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const ch = geo(-76.4, -13.6), dest = [geo(-3, 53.4), geo(-74, 40.7), geo(2.3, 48.9)];
  const mid = (a: number[], b: number[], k: number) => { const cx = (a[0] + b[0]) / 2 - 220, cy = (a[1] + b[1]) / 2 + 120; const x = (1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * cx + k * k * b[0], y = (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * cy + k * k * b[1]; return [x, y, cx, cy]; };
  const money = ez(f, 20, d - 10);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #13304a 0%, #06111c 78%)" }}>
      <AbsoluteFill style={{ transform: `scale(${1.25 + 0.1 * lin(f, 0, d)})`, transformOrigin: "35% 50%" }}>
        <Img src={sf("img/dur5na/map_mundo.png")} style={{ position: "absolute", left: 0, top: (1080 - MAP.H) / 2, width: MAP.W, height: MAP.H, opacity: 0.9 }} />
        <SV>
          {dest.map((b, i) => { const [, , cx, cy] = mid(ch, b, 0); return <path key={i} d={`M${ch[0]},${ch[1]} Q${cx},${cy} ${b[0]},${b[1]}`} stroke={GOLD} strokeWidth={3} fill="none" strokeDasharray="8 8" opacity={ez(f, 10 + i * 12, 30 + i * 12)} />; })}
          {dest.map((b, i) => Array.from({ length: 3 }).map((_, j) => { const k = (((f - 20 - i * 12 - j * 30) / 110) % 1 + 1) % 1; if (f < 20 + i * 12 + j * 30) return null; const [x, y] = mid(ch, b, k);
            return <g key={i + "-" + j} transform={`translate(${x},${y})`}><path d="M-12,0 L12,0 L8,6 L-8,6 Z" fill="#f0ebe5" /><line x1={0} y1={0} x2={0} y2={-14} stroke="#f0ebe5" strokeWidth={2} /><path d="M1,-14 L10,-4 L1,-4 Z" fill="#f0ebe5" /></g>; }))}
          <circle cx={ch[0]} cy={ch[1]} r={10} fill={RED} stroke="#fff" strokeWidth={3} />
        </SV>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 120, fontFamily: F }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: "rgba(240,235,229,.7)" }}>EL MEJOR FERTILIZANTE DEL MUNDO</div>
        <div style={{ fontSize: 96, fontWeight: 900, color: GOLD }}>{`PERÚ ${"$".repeat(1 + Math.floor(money * 5))}`}</div>
      </div>
      <Tag a={at(p, "europa", 30)} t="Europa y Estados Unidos lo querían todo" x={1200} y={900} size={42} color={INK} w={1100} />
    </AbsoluteFill>
  );
};

// 26 · AL BORDE DEL ACANTILADO: empujas la carretilla hasta el borde; el guano baja por la manga de lona al barco; la cuota diaria apenas se mueve
export const MangaAcantilado: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const cyc = (f % 150) / 150, push = Math.min(1, cyc / 0.6), dump = cyc > 0.6 ? Math.sin(((cyc - 0.6) / 0.4) * Math.PI) : 0;
  const px = 360 + push * 760, trips = Math.floor(f / 150);
  return (
    <Scene d={d} bg={p.bg} floor="255,220,170" tint="#1a140e">
      <AbsoluteFill style={{ background: "linear-gradient(#f1c28a 0%, #d99a62 40%, #2d4a64 60%, #142638 100%)", opacity: 0.85 }} />
      <SV>
        <path d="M0,640 L1240,640 L1300,700 L1280,1080 L0,1080 Z" fill="#d9cba5" />
        <path d="M1240,640 L1300,700 L1280,1080 L1340,1080 L1330,700 Z" fill="#a3916b" />
        <path d={`M1240,650 Q1400,${760 + Math.sin(f / 12) * 10} 1520,880`} stroke="#c9b98a" strokeWidth={50} fill="none" />
        {dump > 0 && Array.from({ length: 12 }).map((_, i) => { const k = ((f / 8 + i / 12) % 1); return <circle key={i} cx={1240 + k * 280} cy={650 + k * 230 + Math.sin(k * 3) * 20} r={10} fill="#efe6cf" opacity={dump} />; })}
        <rect x={1380} y={900} width={480} height={90} rx={20} fill="#3a2614" /><rect x={1580} y={560} width={12} height={340} fill="#2a1a10" /><path d="M1596,580 L1760,860 L1596,860 Z" fill="#e8dfc8" />
        <rect x={0} y={990} width={1920} height={90} fill="#1d3a55" opacity={0.85} />
        <Barrow x={px + 130} y={640} s={1.1} load={1 - dump} tilt={dump * -25} />
      </SV>
      <Tu x={px} y={640} s={1} rot={22} walk={cyc < 0.6} />
      <Meter x={90} y={70} w={520} h={22} k={Math.min(1, (trips + push) / 40)} col={RED} label="CUOTA: VARIAS TONELADAS AL DÍA" val={`viaje ${trips + 1}`} size={60} />
      <Tag a={at(p, "lona", 20)} t="mangas de lona → al barco" x={1500} y={430} size={40} color={INK} w={700} />
    </Scene>
  );
};

// 27 · LO TENÍA TODO: la isla en el centro, el mar alrededor; siete palabras caen sobre ella; una puerta tachada
const ALL = [["ASCO", "asco"], ["PESO", "peso"], ["AIRE QUE QUEMA", "quema"], ["SOL SIN SOMBRA", "sombra"], ["SED", "sed"], ["CASTIGO", "castigo"], ["LA ISLA", "isla"]] as const;
export const TodoJunto: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const ks = ALL.map((x, i) => at(p, x[1], 20 + i * 18));
  const door = ez(f, at(p, "adonde", d * 0.7), at(p, "adonde", d * 0.7) + 10);
  return (
    <Scene d={d} bg={p.bg} floor="241,69,54" tint="#061019" push={0.03}>
      <SV>
        {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={960} cy={560} r={240 + i * 90 + ((f * 0.8) % 90)} fill="none" stroke="rgba(120,170,210,.18)" strokeWidth={3} />)}
        <ellipse cx={960} cy={600} rx={230} ry={70} fill="#a3916b" /><path d="M780,600 L900,440 L1020,470 L1140,600 Z" fill="#efe6cf" />
      </SV>
      <Tu x={980} y={610} s={0.45} />
      {ALL.map((x, i) => { const a = (i / ALL.length) * Math.PI * 2 - Math.PI / 2; const R = 400; const k = sp(f, ks[i], 0.9, 10);
        const tx = 960 + Math.cos(a) * R * 1.45, ty = 560 + Math.sin(a) * R * 0.95;
        return <div key={i} style={{ position: "absolute", left: tx - 220, top: ty - 30 - (1 - k) * 80, width: 440, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 52, color: i === 6 ? RED : INK, opacity: Math.min(1, k), textShadow: "0 4px 16px rgba(0,0,0,.8)" }}>{x[0]}</div>; })}
      <div style={{ position: "absolute", left: 1600, top: 760, width: 180, height: 260, border: `8px solid ${INK}`, borderBottom: "none", opacity: door }}>
        <svg width={180} height={260} style={{ position: "absolute", left: -8, top: -8 }}><path d="M10,10 L170,250 M170,10 L10,250" stroke={RED} strokeWidth={14} /></svg>
      </div>
      <Tag a={at(p, "adonde", d * 0.7) + 6} t="no había adónde ir" x={1460} y={680} size={44} color={RED} w={700} />
    </Scene>
  );
};

// 28 · LA SUMA DEL DÍA: una barra de 24 horas; se apilan tus tiempos; no llegas ni a un día completo
const SEG = [["Támesis", 180, "#7fa6bf"], ["Pure", 248, "#a88a5a"], ["Fez", 120, "#c46a2a"], ["Salitre", 360, "#e9e3d2"], ["Mina", 192, "#6b5a40"], ["Telares", 11, "#f4f0e6"], ["Albayalde", 15, "#c7ccd2"], ["Guano", 40, "#efe6cf"]] as const;
export const SumaDia: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const Wb = 1600, tot = 24 * 60;
  let acc = 0;
  const sum = SEG.reduce((a, s) => a + s[1], 0);
  const shown = SEG.map((s, i) => ez(f, 12 + i * 16, 24 + i * 16));
  const cur = SEG.reduce((a, s, i) => a + s[1] * shown[i], 0);
  const fin = ez(f, 12 + SEG.length * 16 + 10, 12 + SEG.length * 16 + 22);
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98" tint="#0d0a08">
      <div style={{ position: "absolute", left: 160, top: 500, width: Wb, height: 120, borderRadius: 18, background: "rgba(240,235,229,.1)", border: "3px solid rgba(240,235,229,.4)", overflow: "hidden" }}>
        {SEG.map((s, i) => { const x = acc / tot * Wb; acc += s[1]; return <div key={i} style={{ position: "absolute", left: x, top: 0, width: (s[1] / tot) * Wb * shown[i], height: 120, background: s[2], borderRight: "3px solid #0d0a08" }} />; })}
      </div>
      {(() => { let a2 = 0; return SEG.map((s, i) => { const x = 160 + (a2 + s[1] / 2) / tot * Wb; a2 += s[1]; return s[1] > 60 ? <div key={i} style={{ position: "absolute", left: x - 120, top: 640, width: 240, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 28, color: INK, opacity: shown[i] }}>{s[0]}</div> : null; }); })()}
      <div style={{ position: "absolute", left: 160 + Wb - 6, top: 470, width: 6, height: 180, background: RED }} />
      <div style={{ position: "absolute", left: 160 + Wb - 160, top: 400, fontFamily: F, fontWeight: 900, fontSize: 50, color: RED }}>24 h</div>
      <div style={{ position: "absolute", left: 160, top: 260, fontFamily: F, fontWeight: 900, fontSize: 130, color: INK, fontVariantNumeric: "tabular-nums" }}>{`${Math.floor(cur / 60)} h ${String(Math.round(cur % 60)).padStart(2, "0")}`}</div>
      <Tu x={160 + (cur / tot) * Wb} y={500} s={0.6} walk={fin < 0.5} />
      <Tag a={12 + SEG.length * 16 + 12} t="NI UN DÍA COMPLETO" x={960} y={730} w={1700} size={96} color={RED} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontFamily: F, fontWeight: 700, fontSize: 32, color: "rgba(240,235,229,.7)", opacity: fin }}>{`sin París ni el sombrerero · ellos lo hicieron durante años`}</div>
      {sum < 0 && <div />}
    </Scene>
  );
};

// 29 · LA PUERTA: el estante con lo que todos usaban, cada cosa con alguien detrás en lo oscuro; al final se abre una puerta con luz: tú puedes irte
const ITEMC = ["#e9e3d2", "#9c7444", "#7a4a26", "#3a3a3a", "#5a4632", "#1f1f1f", "#f4f0e6", "#c7ccd2", "#b5853f"];
const GOODS = ["PAPEL", "GUANTES", "CUERO", "PÓLVORA", "SOMBREROS", "CARBÓN", "ALGODÓN", "PINTURA", "COMIDA"];
export const PuertaFinal: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const D0 = at(p, "puerta", d * 0.6), open = ez(f, D0, D0 + 30);
  return (
    <Scene d={d} bg={p.bg} floor="255,220,160" tint="#0a0806" push={0.02}>
      {GOODS.map((g, i) => { const o = ez(f, 8 + i * 9, 18 + i * 9); const x = 90 + (i % 5) * 250 + 110, y = 180 + Math.floor(i / 5) * 360 + 236;
        return <div key={i} style={{ position: "absolute", inset: 0, filter: "brightness(.62) saturate(.55)" }}><Tu x={x} y={y} s={0.78} op={o * 0.95 * (1 - open * 0.55)} /></div>; })}
      {GOODS.map((g, i) => { const o = ez(f, 8 + i * 9, 18 + i * 9); const x = 90 + (i % 5) * 250, y = 180 + Math.floor(i / 5) * 360;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 220, height: 300, opacity: o * (1 - open * 0.55), fontFamily: F }}>
          <div style={{ position: "absolute", left: -20, top: -30, width: 260, height: 300, background: "radial-gradient(ellipse at 50% 70%, rgba(255,200,120,.28), transparent 70%)" }} />
          <div style={{ position: "absolute", left: 30, top: 150, width: 160, height: 90, borderRadius: 8, background: ITEMC[i], boxShadow: "inset 0 -14px 0 rgba(0,0,0,.25), 0 6px 14px rgba(0,0,0,.5)" }} />
          <div style={{ position: "absolute", left: 0, top: 240, width: 220, height: 16, background: "#8a6438" }} />
          <div style={{ position: "absolute", left: 0, top: 262, width: 220, textAlign: "center", fontSize: 28, fontWeight: 900, color: INK }}>{g}</div>
        </div>; })}
      <div style={{ position: "absolute", left: 1420, top: 180, width: 380, height: 760, background: "#1a120c", border: "10px solid #4a3a28", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, #fff6dc, #f3c48a 50%, #a86a3a)", opacity: open }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#5a3e24,#3a2614)", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-80 * open}deg)` }} />
      </div>
      <div style={{ position: "absolute", left: 1200, top: 180, width: 820, height: 900, background: "linear-gradient(90deg, transparent, rgba(255,230,180,.25))", opacity: open, clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }} />
      <Tu x={1610} y={940} s={1.3} op={ez(f, D0 + 16, D0 + 30)} />
      <Tag a={D0 + 24} t="PUEDES RENUNCIAR" x={700} y={900} size={96} color={GOLD} w={1200} />
    </Scene>
  );
};

// 30 · EL GRAN HEDOR: el Parlamento sobre el río verde; cortinas empapadas en cal bajan sobre las ventanas; el olor sube igual
export const HedorCortinas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const C = at(p, "cortinas", d * 0.45), cur = ez(f, C, C + 24);
  return (
    <Scene d={d} bg={p.bg} floor="180,210,120" tint="#0c0f0a">
      <SV>
        <rect x={0} y={760} width={1920} height={320} fill="#3f4a26" />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M0,${790 + i * 34} Q480,${780 + i * 34 + Math.sin(f / 15 + i) * 8} 960,${790 + i * 34} T1920,${790 + i * 34}`} stroke="rgba(170,190,90,.25)" strokeWidth={3} fill="none" />)}
        <rect x={260} y={300} width={1400} height={460} fill="#7d6f55" />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${300 + i * 150},300 L${300 + i * 150},180 L${340 + i * 150},140 L${380 + i * 150},180 L${380 + i * 150},300`} fill="#6e624b" />)}
        {Array.from({ length: 9 }).map((_, i) => <g key={i}><rect x={300 + i * 150} y={380} width={80} height={220} rx={40} fill="#1c1a14" />
          <rect x={296 + i * 150} y={376} width={88} height={228 * cur} fill="#e9e6d6" opacity={0.95} />
          {cur > 0.9 && <path d={`M${300 + i * 150},${600} q10,20 0,40`} stroke="rgba(233,230,214,.7)" strokeWidth={4} fill="none" />}</g>)}
        {Array.from({ length: 24 }).map((_, i) => { const ph = ((f / 90) + rnd(i, 1)) % 1; return <path key={i} d={`M${200 + rnd(i, 2) * 1500},${780 - ph * 500} q20,-30 0,-60 q-20,-30 0,-60`} stroke="rgba(170,200,90,.4)" strokeWidth={6} fill="none" opacity={Math.sin(ph * Math.PI)} />; })}
      </SV>
      <Tag a={at(p, "hedor", 10)} t="EL GRAN HEDOR · 1858" x={960} y={80} size={78} color="#cfe68a" />
      <Tag a={C + 10} t="cortinas empapadas en cal" x={960} y={660} size={44} color={INK} />
    </Scene>
  );
};
