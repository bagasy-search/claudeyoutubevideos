// gb01 v2 · MINUTO 6 (ventanas 20-23, 336-402 s): la acción ocurre sin vos (títere) · engranaje 3 = el carrete sin fin ·
// el diario que se termina · la tele que termina y el silencio · el libro con capítulos y las puertitas de la vida ·
// el scroll infinito · autoplay · el ingeniero arrepentido · el reloj de arena tragado · el guardián sabio de la frente.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { EscenaMundo, Obj, Texto, circ } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const tela = (x: number, y: number, w: number, h: number, r = 12) => `M${x - w / 2 + r},${y - h / 2} L${x + w / 2 - r},${y - h / 2} Q${x + w / 2},${y - h / 2} ${x + w / 2},${y - h / 2 + r} L${x + w / 2},${y + h / 2 - r} Q${x + w / 2},${y + h / 2} ${x + w / 2 - r},${y + h / 2} L${x - w / 2 + r},${y + h / 2} Q${x - w / 2},${y + h / 2} ${x - w / 2},${y + h / 2 - r} L${x - w / 2},${y - h / 2 + r} Q${x - w / 2},${y - h / 2} ${x - w / 2 + r},${y - h / 2} Z`;

// ═════════ HUB 20 · "The action is so small and so easy that it happens without you." ═════════
const ToqueChico: D = ({ t, t0, on, tam }) => {
  const g = Math.max(0, Math.sin(t * 5));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-14,60 L-14,-10 Q-14,-30 0,-30 Q14,-30 14,-10 L14,60", a: 2.6 }]}>
      <circle cx={0} cy={-50 + 8 * g} r={4 + 14 * g} fill="none" stroke={N.oro} strokeWidth={2} opacity={g} />
      <TextoNeon y={90} texto="so small" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.2, 0.3)} />
    </Glifo>
  );
};
const CelularTitere: D = ({ t, t0, on, tam }) => {
  const b = 10 * Math.sin(t * 2.2), r = 8 * Math.sin(t * 1.7);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-60,-90 L60,-90 M-40,-90 L-60,-110 M40,-90 L60,-110", c: N.oro, a: 2.4 }]}>
      <path d={`M-40,-90 L-20,${-30 + b} M40,-90 L20,${-30 - b} M0,-90 L0,${-34}`} stroke={N.gris} strokeWidth={1.6} />
      <g transform={`translate(0,${10 + b * 0.4}) rotate(${r})`}><path d={tela(0, 20, 60, 100, 10)} fill="rgba(39,227,255,.06)" stroke={N.cianClaro} strokeWidth={3} style={glow(N.cian)} /></g>
    </Glifo>
  );
};
const Engr3Mini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: circ(0, 0, 86), c: N.oroHondo, a: 1.4 }]}>
    <g transform={`rotate(${t * 50}) scale(0.9)`}><EngranajeSvg r={70} color={N.oro} n={3} /></g>
  </Glifo>
);

// ═════════ ESCENA 20 · engranaje 3 = el carrete sin fin · el diario que se termina y se deja ═════════
const E20 = { third: T("third gear is", 342), reel: T("the endless reel", 343), old: T("In the old", 344.5), news: T("a newspaper", 345.5), last: T("the last page", 348), down: T("put it down", 349.5) };
const tomas20: Toma[] = [[341.8, 0, 0, 1.1], [344.6, 220, 0, 0.92], [345.4, 1040, 0, 1.0], [348.2, 1040, -20, 1.08], [350.8, 1040, 40, 1.0]];
const Carrete: React.FC = () => {
  const t = useT();
  const sale = ramp(t, E20.reel, 0.8, easeOut);
  const off = (t * 220) % 80;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: ramp(t, E20.third - 0.3, 0.3), transform: `rotate(${t * 30}deg) scale(${0.7 + 0.3 * pop(t, E20.third - 0.3, 10)})` }}>
        <EngranajeSvg r={170} color={N.oro} dientes={14} />
      </div>
      {/* carrete de película dentro del engranaje */}
      <svg width={1} height={1} style={abs(0, 0)} opacity={sale * (1 - ramp(t, E20.news - 0.4, 0.5))}>
        <g transform={`rotate(${t * 120})`}>{[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 62} cy={Math.sin(a) * 62} r={20} fill="none" stroke={N.oroClaro} strokeWidth={3} />; })}<circle r={14} fill={N.oro} /></g>
        {/* tira que sale sin fin hacia la derecha */}
        <g style={glow(N.oro, 6)}>
          <path d={`M90,-110 L${90 + 1400 * sale},-110 M90,-30 L${90 + 1400 * sale},-30`} stroke={N.oro} strokeWidth={3} />
          {Array.from({ length: 22 }, (_, i) => { const x = 90 + i * 80 - off; return x < 90 + 1400 * sale && x > 80 ? <g key={i}><rect x={x} y={-104} width={60} height={68} fill="rgba(244,194,74,.06)" stroke={N.oroClaro} strokeWidth={1.6} /><rect x={x + 6} y={-120} width={10} height={6} fill={N.oro} /><rect x={x + 6} y={-26} width={10} height={6} fill={N.oro} /></g> : null; })}
        </g>
        <text x={1500} y={-60} fontFamily="sans-serif" fontWeight={900} fontSize={60} fill={N.oroClaro} opacity={sale}>→ ∞</text>
      </svg>
      <Texto x={0} y={-260} t0={E20.third} texto="the *third gear*" size={60} color={N.oroClaro} t1={E20.news} />
      <Texto x={0} y={250} t0={E20.reel} texto="the endless *reel*" size={50} color={N.oro} t1={E20.news} />
    </>
  );
};
const Diario: React.FC = () => {
  const t = useT();
  if (t < E20.news - 0.5) return null;
  const hojas = 5;
  const pasa = (i: number) => ramp(t, E20.news + 0.5 + i * 0.45, 0.4);
  const fin = ramp(t, E20.last, 0.3);
  const baja = ramp(t, E20.down, 0.8, easeOut);
  return (
    <>
      <div style={{ position: "absolute", left: 1040, top: lerp(0, 190, baja), transform: `perspective(900px) rotateX(${68 * baja}deg)`, opacity: ramp(t, E20.news - 0.5, 0.3) }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          <rect x={-240} y={-160} width={480} height={320} fill="rgba(255,255,255,.03)" stroke="#e6eeff" strokeWidth={3} style={glow("#fff", 6)} />
          <path d="M0,-160 L0,160" stroke={N.gris} strokeWidth={2} />
          {Array.from({ length: hojas }, (_, i) => {
            const k = pasa(i);
            if (k <= 0 || k >= 1) return null;
            return <path key={i} d={`M0,-160 L${240 * Math.cos(k * Math.PI)},-150 L${240 * Math.cos(k * Math.PI)},150 L0,160 Z`} fill="rgba(5,5,6,.9)" stroke="#e6eeff" strokeWidth={2} />;
          })}
          {/* columnas de texto */}
          {[-1, 1].map((sd) => [0, 1, 2, 3, 4, 5, 6].map((r) => <path key={sd + "_" + r} d={`M${sd * 30},${-110 + r * 34} L${sd * 210},${-110 + r * 34}`} stroke={N.gris} strokeWidth={4} opacity={fin ? 0.4 : 1} />))}
          <text x={120} y={-122} textAnchor="middle" fontFamily="serif" fontWeight={700} fontSize={30} fill="#e6eeff">THE DAILY</text>
          <g opacity={fin}><rect x={30} y={30} width={190} height={70} fill="rgba(5,5,6,.9)" stroke={N.oro} strokeWidth={3} /><text x={125} y={76} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={38} fill={N.oroClaro} style={glow(N.oro, 6)}>the end</text></g>
        </svg>
      </div>
      {/* mesa */}
      <svg width={1} height={1} style={abs(1040, 300)} opacity={ramp(t, E20.down - 0.3, 0.4)}><path d="M-380,0 L380,0 M-320,0 L-320,160 M320,0 L320,160" stroke={N.gris} strokeWidth={3} /></svg>
      <Texto x={1040} y={-270} t0={E20.news} texto="a newspaper *ended*" size={50} t1={E20.down + 1.2} />
      <Texto x={1040} y={-200} t0={E20.down} texto="you put it *down*" size={42} color={N.oroClaro} />
    </>
  );
};
const Escena20: React.FC = () => <EscenaMundo tomas={tomas20}><Carrete /><Diario /></EscenaMundo>;

// ═════════ HUB 21 · "A television show ended, and there was a moment of silence before the next thing." ═════════
const TeleFin: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-90,-60 L90,-60 L90,60 L-90,60 Z", a: 2.6, f: "rgba(255,255,255,.03)" }, { d: "M-30,-60 L-60,-100 M30,-60 L60,-100 M-50,60 L-60,80 M50,60 L60,80", a: 2.2 },
  ]}>
    <TextoNeon y={2} texto="THE END" size={30} serif color={N.oroClaro} on={neonOn(t, t0 + 0.4)} />
  </Glifo>
);
const Silencio: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.3, 1.2);
  const d = Array.from({ length: 40 }, (_, i) => `${i ? "L" : "M"}${-90 + i * 4.6},${30 * (1 - k) * Math.sin(i * 0.9 + t * 8)}`).join(" ");
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[]}>
      <path d={d} fill="none" stroke={N.violeta} strokeWidth={3} style={glow(N.violeta)} />
      <TextoNeon y={60} texto="silence" size={24} serif color={N.violeta} on={k} />
    </Glifo>
  );
};
const Puntos: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[]}>
    {[0, 1, 2].map((i) => <circle key={i} cx={-40 + i * 40} cy={0} r={10} fill={N.cianClaro} opacity={ramp(t, t0 + 0.3 + i * 0.35, 0.2)} style={glow(N.cian)} />)}
  </Glifo>
);

// ═════════ ESCENA 21 · el libro con capítulos · las puertitas de la vida · "enough" · el scroll que nunca termina ═════════
const E21 = { book: T("A book had", 356), life: T("Life was full", 358), stop: T("little stopping", 358), doors: T("small doors", 361), mind: T("where the mind", 362), enough: T("enough", 363), look: T("Now look at", 364), scroll: T("You scroll", 366), more: T("there is more", 367) };
const tomas21: Toma[] = [[356.1, 0, 0, 1.1], [358.4, 0, 0, 1.0], [359.2, 900, 0, 0.82], [362.0, 1250, 20, 1.15], [364.8, 1250, 20, 1.15], [365.6, 2100, 0, 1.02], [368.8, 2100, 0, 1.1]];
const Libro: React.FC = () => {
  const t = useT();
  const ab = ramp(t, E21.book, 0.7, easeOut);
  const caps = ["I", "II", "III", "IV", "V"];
  return (
    <>
      <svg width={1} height={1} style={abs(0, 20)} opacity={ramp(t, E21.book - 0.4, 0.3)}>
        <g style={glow(N.violeta, 6)}>
          <path d={`M0,-150 Q${-120 * ab},-170 ${-260 * ab},-150 L${-260 * ab},150 Q${-120 * ab},130 0,150 Z`} fill="rgba(183,123,255,.06)" stroke={N.violeta} strokeWidth={3.5} />
          <path d={`M0,-150 Q${120 * ab},-170 ${260 * ab},-150 L${260 * ab},150 Q${120 * ab},130 0,150 Z`} fill="rgba(183,123,255,.06)" stroke={N.violeta} strokeWidth={3.5} />
        </g>
        {[0, 1, 2, 3].map((r) => <path key={r} d={`M${-230 * ab},${-90 + r * 34} L${-30 * ab},${-90 + r * 34}`} stroke={N.gris} strokeWidth={3} />)}
        <text x={130 * ab} y={-30} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={46} fill={N.violeta} opacity={ab}>Chapter III</text>
        {/* pestañas de capítulos */}
        {caps.map((c, i) => <g key={c} transform={`translate(${270 * ab},${-120 + i * 58})`} opacity={ramp(t, E21.book + 0.3 + i * 0.1, 0.2)}><rect x={0} y={-20} width={56} height={40} rx={6} fill="rgba(5,5,6,.9)" stroke={[N.oro, N.cian, N.violeta, N.rojo, N.verde][i]} strokeWidth={3} /><text x={28} y={8} textAnchor="middle" fontFamily="serif" fontSize={22} fill="#e6eeff">{c}</text></g>)}
      </svg>
      <Texto x={0} y={-270} t0={E21.book} texto="a book had *chapters*" size={52} color={N.violeta} t1={E21.life + 0.6} />
    </>
  );
};
const CaminoPuertas: React.FC = () => {
  const t = useT();
  if (t < E21.life - 0.3) return null;
  const k = ramp(t, E21.life, 1.4, easeOut);
  const pts = Array.from({ length: 60 }, (_, i) => { const u = i / 59; return [400 + u * 1300, 200 - 160 * Math.sin(u * Math.PI * 2.2) - u * 120] as const; });
  const d = pts.slice(0, Math.max(2, Math.floor(60 * k))).map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const PU = [10, 22, 34, 46, 56];
  const cierra = ramp(t, E21.enough, 0.4, easeOut);
  return (
    <svg width={1} height={1} style={abs(0, 0)}>
      <path d={d} fill="none" stroke="#e6eeff" strokeWidth={4} strokeLinecap="round" style={glow("#fff", 6)} />
      {PU.map((pi, j) => {
        const [x, y] = pts[pi]; const on = ramp(t, E21.stop + j * 0.25, 0.3);
        const ultima = j === 2;
        const ang = ultima ? -80 * (1 - cierra) : -50;
        return (
          <g key={j} transform={`translate(${x},${y - 6})`} opacity={on} style={glow(ultima ? N.oro : N.cian, 8)}>
            <path d="M-26,0 L-26,-90 L26,-90 L26,0" fill="none" stroke={ultima ? N.oro : N.cian} strokeWidth={4} />
            <g transform={`translate(-26,0) skewY(0) scale(${Math.cos((ang * Math.PI) / 180)},1)`}><rect x={0} y={-90} width={52} height={90} fill={ultima ? "rgba(244,194,74,.25)" : "rgba(39,227,255,.12)"} stroke={ultima ? N.oroClaro : N.cianClaro} strokeWidth={2.5} /></g>
          </g>
        );
      })}
      {/* "enough" en la puerta del medio */}
      <text x={pts[34][0]} y={pts[34][1] - 130} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={50} fill={N.oroClaro} opacity={ramp(t, E21.enough, 0.3)} style={glow(N.oro, 10)}>enough.</text>
    </svg>
  );
};
const ScrollSinFin: React.FC = () => {
  const t = useT();
  if (t < E21.look - 0.4) return null;
  const v = t < E21.scroll ? 0 : (t - E21.scroll) * 900 + Math.max(0, t - E21.more) * 600;
  return (
    <>
      <Obj x={2100} y={20} t0={E21.look - 0.4} tam={200} color={N.cianClaro} trazos={[{ d: tela(0, 0, 300, 560, 30), a: 3 }]} />
      <svg width={1} height={1} style={abs(2100, 20)}>
        <defs><clipPath id="cl21"><rect x={-140} y={-266} width={280} height={532} rx={24} /></clipPath></defs>
        <g clipPath="url(#cl21)">
          {Array.from({ length: 9 }, (_, i) => { const y = ((i * 130 - v) % 1170 + 1170) % 1170 - 330; const c = [N.oro, N.cian, N.violeta, N.rojo][i % 4]; return <g key={i} transform={`translate(0,${y})`}><rect x={-120} y={0} width={240} height={110} rx={12} fill="none" stroke={c} strokeWidth={2.6} opacity={0.8} /><circle cx={-84} cy={34} r={18} fill="none" stroke={c} strokeWidth={2} /><path d="M-54,28 L90,28 M-54,50 L50,50" stroke={c} strokeWidth={2} opacity={0.7} /></g>; })}
        </g>
      </svg>
      <Texto x={2100} y={-340} t0={E21.scroll} texto="you scroll…" size={46} t1={E21.more} />
      <Texto x={2100} y={-340} t0={E21.more} texto="and there is *more*" size={52} color={N.cianClaro} />
    </>
  );
};
const Escena21: React.FC = () => <EscenaMundo tomas={tomas21}><Libro /><CaminoPuertas /><ScrollSinFin /></EscenaMundo>;

// ═════════ HUB 22 · "You scroll again, and there is more. The video ends," (la cinta del feed gira alrededor del monje) ═════════
const Post = (i: number): D => ({ t, t0, on, tam }) => {
  const c = [N.oro, N.cian, N.violeta, N.rojo, N.verde][i % 5];
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={c} trazos={[{ d: tela(0, 0, 170, 110, 12), a: 2.4, f: "rgba(5,5,6,.6)" }, { d: circ(-54, -18, 14) + " M-30,-24 L60,-24 M-30,-6 L30,-6 M-66,26 L66,26", a: 1.8, dt: 0.15 }]} />
  );
};
const VideoFin: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, T("The video ends", 370), 0.8);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tela(0, 0, 180, 110, 10), a: 2.6, f: "rgba(39,227,255,.05)" }, { d: "M-14,-22 L22,0 L-14,22 Z", a: 2.6 }]}>
      <rect x={-80} y={42} width={160} height={6} fill={N.gris} /><rect x={-80} y={42} width={160 * k} height={6} fill={N.rojo} style={glow(N.rojo, 4)} />
    </Glifo>
  );
};

// ═════════ ESCENA 22 · autoplay · el libro sin última página · el ingeniero arrepentido · el tiempo tragado ═════════
const E22 = { next: T("the next one", 373), playing: T("already playing", 373), nolast: T("no last page", 375.5), engineer: T("The engineer who", 377), endless: T("create the endless", 378), regret: T("he regretted it", 381), saw: T("he saw how", 382.5), time: T("human time", 383.5), swallow: T("swallowing", 384.5) };
const tomas22: Toma[] = [[372.9, 0, 0, 1.15], [375.4, 0, 0, 1.05], [375.9, 820, 0, 1.12], [377.5, 820, 0, 1.12], [378.1, 1640, 0, 1.08], [382.4, 1640, 0, 1.12], [382.9, 2460, 0, 1.06], [385.7, 2460, 0, 1.14]];
const Autoplay: React.FC = () => {
  const t = useT();
  const k = ramp(t, E22.next - 0.3, 1.3, (u) => u);
  const salta = ramp(t, E22.playing + 0.2, 0.5, easeOut);
  return (
    <>
      <Obj x={0} y={0} t0={E22.next - 0.7} tam={200} color={N.cianClaro} trazos={[{ d: tela(0, 0, 640, 380, 20), a: 3 }]} />
      <svg width={1} height={1} style={abs(0, 0)}>
        <g opacity={1 - salta}>
          <circle r={70} fill="none" stroke={N.gris} strokeWidth={6} />
          <circle r={70} fill="none" stroke={N.rojo} strokeWidth={6} strokeDasharray={`${440 * k} 440`} transform="rotate(-90)" style={glow(N.rojo)} />
          <path d="M-20,-30 L32,0 L-20,30 Z" fill={N.cianClaro} />
          <text y={120} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={30} fill="#e6eeff">Next in {Math.max(0, 3 - Math.floor(k * 3))}</text>
        </g>
        <g opacity={salta} transform={`translate(${lerp(500, 0, salta)},0)`}>
          <rect x={-300} y={-170} width={600} height={340} rx={14} fill="rgba(39,227,255,.06)" />
          {[0, 1, 2].map((i) => <circle key={i} cx={-60 + i * 60} cy={Math.sin(t * 6 + i) * 20} r={22} fill="none" stroke={[N.oro, N.rojo, N.verde][i]} strokeWidth={4} />)}
          <rect x={-280} y={150} width={560 * ramp(t, E22.playing + 0.4, 3, (u) => u)} height={6} fill={N.rojo} />
        </g>
      </svg>
      <Texto x={0} y={-280} t0={E22.next} texto="the next one is *already playing*" size={46} color={N.cianClaro} />
    </>
  );
};
const LibroSinFin: React.FC = () => {
  const t = useT();
  if (t < E22.nolast - 0.5) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(820, 40)} opacity={ramp(t, E22.nolast - 0.5, 0.3)}>
        <path d="M0,-150 L-260,-140 L-260,150 L0,160 L260,150 L260,-140 Z M0,-150 L0,160" fill="rgba(183,123,255,.05)" stroke={N.violeta} strokeWidth={3.5} style={glow(N.violeta, 6)} />
        {Array.from({ length: 4 }, (_, i) => { const k = ((t - E22.nolast) * 2.2 + i / 4) % 1; return <path key={i} d={`M0,-150 L${260 * Math.cos(k * Math.PI)},${-140 - 30 * Math.sin(k * Math.PI)} L${260 * Math.cos(k * Math.PI)},${150 - 30 * Math.sin(k * Math.PI)} L0,160 Z`} fill="rgba(5,5,6,.85)" stroke={N.violeta} strokeWidth={2} opacity={0.8} />; })}
        <text x={0} y={240} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={34} fill={N.violeta}>page {Math.floor(Math.max(0, t - E22.nolast) * 2.2 * 37 + 211)}</text>
      </svg>
      <Texto x={820} y={-250} t0={E22.nolast} texto="no *last page*" size={56} color={N.violeta} />
    </>
  );
};
const Ingeniero: React.FC = () => {
  const t = useT();
  const baja = ramp(t, E22.regret, 0.8, easeOut);
  return (
    <>
      <Obj x={1640} y={60} t0={E22.engineer - 0.3} tam={200} color="#e6eeff" trazos={[{ d: "M-140,190 Q-140,10 0,0 Q140,10 140,190", a: 2.6 }]} />
      <svg width={1} height={1} style={abs(1640, 60)} opacity={ramp(t, E22.engineer - 0.3, 0.3)}>
        <g transform={`translate(${16 * baja},${-80 + 30 * baja}) rotate(${22 * baja})`}><circle cx={0} cy={-50} r={58} fill="rgba(255,255,255,.03)" stroke="#e6eeff" strokeWidth={4} style={glow("#fff", 6)} /></g>
        {/* el scroll que inventó: flechas infinitas en su pantalla */}
        <g transform="translate(260,-40)" opacity={ramp(t, E22.endless, 0.3)}>
          <path d={tela(0, 0, 120, 200, 14)} fill="none" stroke={N.cianClaro} strokeWidth={3} />
          {[0, 1, 2].map((i) => { const y = ((t * 80 + i * 60) % 180) - 90; return <path key={i} d={`M-16,${y - 8} L0,${y + 8} L16,${y - 8}`} fill="none" stroke={N.cian} strokeWidth={3} />; })}
        </g>
        <text x={0} y={250} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={40} fill={N.rojoBorde} opacity={ramp(t, E22.regret, 0.4)} style={glow(N.rojo, 6)}>“I regret it.”</text>
      </svg>
      <Texto x={1640} y={-270} t0={E22.engineer} texto="the engineer of the *endless scroll*" size={42} />
    </>
  );
};
const TiempoTragado: React.FC = () => {
  const t = useT();
  if (t < E22.saw - 0.4) return null;
  const s = ramp(t, E22.swallow, 1.0);
  return (
    <>
      <svg width={1} height={1} style={abs(2460, 0)} opacity={ramp(t, E22.saw - 0.4, 0.3)}>
        {/* remolino del feed */}
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={0} cy={180} rx={220 - i * 50} ry={50 - i * 11} fill="none" stroke={N.cian} strokeWidth={2.5} opacity={0.3 + 0.2 * i} strokeDasharray="26 14" strokeDashoffset={-t * (80 + i * 40)} />)}
        {/* reloj de arena: la arena cae al remolino */}
        <g style={glow(N.oro, 8)}>
          <path d="M-80,-240 L80,-240 M-80,40 L80,40 M-66,-240 Q-66,-140 0,-100 Q66,-140 66,-240 M-66,40 Q-66,-60 0,-100 Q66,-60 66,40" fill="none" stroke={N.oroClaro} strokeWidth={4} />
          <path d={`M${-50 * (1 - s)},${-200 + 70 * s} L${50 * (1 - s)},${-200 + 70 * s} L0,-108 Z`} fill={N.oro} opacity={0.7} />
        </g>
        {Array.from({ length: 16 }, (_, i) => { const u = ((t * 1.4 + i / 16) % 1); const a = u * Math.PI * 4 + i; return <circle key={i} cx={Math.cos(a) * 200 * (1 - u)} cy={40 + u * 140 + Math.sin(a) * 30 * (1 - u)} r={5} fill={N.oro} opacity={1 - u} />; })}
        {/* relojitos que se van tragando */}
        {[0, 1, 2].map((i) => { const u = ramp(t, E22.time + i * 0.35, 1.2); return <g key={"c" + i} transform={`translate(${lerp([-300, 300, -240][i], 0, u)},${lerp([-100, -60, 60][i], 180, u)}) scale(${1 - u * 0.9}) rotate(${u * 360})`} opacity={1 - u * 0.8}><circle r={34} fill="rgba(5,5,6,.9)" stroke="#e6eeff" strokeWidth={3} /><path d="M0,0 L0,-22 M0,0 L16,8" stroke="#e6eeff" strokeWidth={3} /></g>; })}
      </svg>
      <Texto x={2460} y={-330} t0={E22.time} texto="how much *human time*" size={46} color={N.oroClaro} />
      <Texto x={2460} y={330} t0={E22.swallow} texto="it was *swallowing*" size={44} color={N.cianClaro} />
    </>
  );
};
const Escena22: React.FC = () => <EscenaMundo tomas={tomas22}><Autoplay /><LibroSinFin /><Ingeniero /><TiempoTragado /></EscenaMundo>;

// ═════════ HUB 23 · "Inside the glass brain, there is a part right behind your forehead that acts like a" ═════════
const CerebroFrente: D = ({ t, t0, on, tam }) => {
  const f = neonOn(t, T("behind your forehead", 388.5));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
      { d: "M-90,20 Q-110,-60 -40,-80 Q0,-110 50,-84 Q110,-70 100,0 Q110,50 50,60 Q30,90 -10,70 Q-70,80 -90,20 Z", a: 2.4, f: "rgba(203,251,255,.04)" },
      { d: "M-60,-20 Q-30,-50 0,-30 Q30,-60 60,-24", c: N.gris, a: 1.4 },
    ]}>
      <path d="M50,-84 Q110,-70 100,0 Q70,-10 56,-40 Q40,-70 50,-84 Z" fill={N.oro} opacity={0.35 * f} style={glow(N.oro, 12)} />
    </Glifo>
  );
};
const Frente: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-20,-80 Q40,-80 50,-30 L56,-10 L70,10 L54,16 L56,40 Q50,60 30,60 L20,80", a: 2.6 }, { d: "M60,-40 L90,-50 M62,-56 L84,-80", c: N.oro, a: 2.4, dt: 0.3 }]} />
);
const Farol: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-30,-40 L30,-40 L40,40 L-40,40 Z M-20,-40 Q0,-80 20,-40 M0,-80 L0,-96", a: 2.6 }]}>
    <circle cx={0} cy={4} r={14 + 3 * Math.sin(t * 7)} fill={N.oroClaro} opacity={0.8} style={glow(N.oro, 14)} />
  </Glifo>
);

// ═════════ ESCENA 23 · el guardián sabio con el farol: planea, decide, "that's enough, go to sleep" · necesita una puerta ═════════
const E23 = { guard: T("wise old guard", 390.5), plans: T("It plans", 392.5), decides: T("it decides", 393.5), says: T("it says", 394), enough: T("that's enough", 395.5), sleep: T("go to sleep", 396.5), but: T("But this guard", 398), door: T("a door to", 398), stop: T("a stopping point", 400.5) };
const tomas23: Toma[] = [[390.9, -60, 0, 1.2], [392.4, -60, 0, 1.05], [395.6, 140, -40, 1.08], [398.2, 140, 0, 0.92], [402.7, 260, 0, 1.0]];
const Guardian: React.FC = () => {
  const t = useT();
  const farol = 0.7 + 0.3 * Math.sin(t * 6);
  return (
    <>
      {/* halo del farol */}
      <div style={{ position: "absolute", left: 110 - 260, top: -40 - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(244,194,74,${0.18 * farol}), transparent 65%)`, opacity: ramp(t, E23.guard, 0.6) }} />
      <Obj x={-60} y={60} t0={E23.guard - 0.4} tam={200} color="#e6eeff" trazos={[
        { d: circ(0, -170, 46), a: 2.8 },
        { d: "M-30,-140 Q-40,-100 -20,-80 L20,-80 Q40,-100 30,-140", c: N.gris, a: 2 },
        { d: "M-70,220 Q-90,20 -40,-90 L40,-90 Q90,20 70,220 Z", a: 2.8, f: "rgba(255,255,255,.03)" },
        { d: "M40,-60 Q100,-40 130,-80", a: 2.6 },
        { d: "M-50,-60 L-120,200", c: N.oroHondo, a: 4 },
      ]} />
      {/* farol */}
      <svg width={1} height={1} style={abs(110, -40)} opacity={ramp(t, E23.guard, 0.4)}>
        <path d="M0,-70 L0,-40 M-26,-40 L26,-40 L34,40 L-34,40 Z M-14,-40 Q0,-66 14,-40" fill="none" stroke={N.oro} strokeWidth={3.5} style={glow(N.oro)} />
        <circle cx={0} cy={2} r={14 * farol} fill={N.oroClaro} style={glow(N.oro, 16)} />
      </svg>
      <Texto x={-60} y={-300} t0={E23.guard} texto="a wise old *guard*" size={56} color={N.oroClaro} t1={E23.says} />
    </>
  );
};
const PlanDecide: React.FC = () => {
  const t = useT();
  return (
    <>
      <Obj x={-420} y={-120} t0={E23.plans} t1={E23.but} tam={200} color={N.cianClaro} trazos={[
        { d: "M-80,-60 L-20,-80 L30,-60 L80,-80 L80,60 L30,80 L-20,60 L-80,80 Z M-20,-80 L-20,60 M30,-60 L30,80", a: 2.4 },
        { d: "M-60,40 Q-20,-20 10,10 Q40,40 60,-40", c: N.oro, a: 2.8, dt: 0.3 },
      ]} />
      <Texto x={-420} y={0} t0={E23.plans} texto="it *plans*" size={40} color={N.cianClaro} t1={E23.but} />
      <Obj x={-420} y={180} t0={E23.decides} t1={E23.but} tam={200} color={N.verde} trazos={[{ d: circ(0, 0, 56), a: 2.6 }, { d: "M-24,0 L-6,20 L28,-22", a: 4, dt: 0.25 }]} />
      <Texto x={-420} y={270} t0={E23.decides} texto="it *decides*" size={40} color={N.verde} t1={E23.but} />
    </>
  );
};
const Globo: React.FC = () => {
  const t = useT();
  if (t < E23.says - 0.2) return null;
  const s = pop(t, E23.says - 0.1, 11);
  return (
    <>
      <div style={{ position: "absolute", left: 300, top: -250, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 2) * (1 - ramp(t, E23.door, 0.4)) }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          <path d="M-230,-80 L230,-80 Q260,-80 260,-50 L260,50 Q260,80 230,80 L-120,80 L-190,140 L-170,80 L-230,80 Q-260,80 -260,50 L-260,-50 Q-260,-80 -230,-80 Z" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3.5} style={glow(N.oro, 8)} />
          <text x={0} y={-12} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={46} fill={N.oroClaro} opacity={ramp(t, E23.enough, 0.3)}>“that's enough,</text>
          <text x={0} y={46} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={46} fill={N.oroClaro} opacity={ramp(t, E23.sleep, 0.3)}>go to sleep.”</text>
        </svg>
      </div>
      {/* luna y zzz */}
      <svg width={1} height={1} style={abs(620, -330)} opacity={ramp(t, E23.sleep, 0.4) * (1 - ramp(t, E23.door, 0.4))}>
        <path d="M30,-40 A50,50 0 1,0 30,40 A36,36 0 1,1 30,-40 Z" fill="rgba(203,251,255,.15)" stroke={N.cianClaro} strokeWidth={3} style={glow(N.cian)} />
        {[0, 1, 2].map((i) => <text key={i} x={70 + i * 24} y={-30 - i * 26 - ((t * 20) % 10)} fontFamily="sans-serif" fontWeight={900} fontSize={22 + i * 6} fill={N.cianClaro} opacity={0.8}>z</text>)}
      </svg>
    </>
  );
};
const PuertaGuardia: React.FC = () => {
  const t = useT();
  if (t < E23.but - 0.2) return null;
  const k = ramp(t, E23.door, 0.8, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(380, 0)} opacity={ramp(t, E23.but - 0.2, 0.3)}>
        <path d={`M-110,280 L-110,${280 - 520 * k} L110,${280 - 520 * k} L110,280`} fill="none" stroke={N.cian} strokeWidth={5} style={glow(N.cian, 10)} />
        <rect x={-96} y={280 - 506 * k} width={192} height={506 * k} fill="rgba(39,227,255,.06)" />
        <path d="M-300,280 L420,280" stroke={N.gris} strokeWidth={3} />
        {/* línea de stop en el piso */}
        <path d="M-200,300 L200,300" stroke={N.rojo} strokeWidth={8} strokeDasharray="30 16" opacity={ramp(t, E23.stop, 0.3)} style={glow(N.rojo)} />
      </svg>
      <Texto x={260} y={-330} t0={E23.door} texto="it needs a *door*" size={52} color={N.cianClaro} />
      <Texto x={380} y={360} t0={E23.stop} texto="a *stopping point*" size={44} color={N.rojoBorde} />
    </>
  );
};
const Escena23: React.FC = () => <EscenaMundo tomas={tomas23}><Guardian /><PlanDecide /><Globo /><PuertaGuardia /></EscenaMundo>;

export const SEGS_M06: Seg[] = [
  {
    hub: { portal: "engr3", orbs: [
      { id: "toque", t: T("so small", 337), ang: 198, anillo: 1, tam: 150, D: ToqueChico },
      { id: "titere", t: T("happens without you", 340), ang: 128, anillo: 2, tam: 200, D: CelularTitere },
      { id: "engr3", t: T("without you", 340.5), ang: -14, anillo: 0, tam: 230, D: Engr3Mini },
    ] },
    Escena: Escena20,
    sonidos: (s) => { s.add("engranaje", E20.third); s.add("maquinaGira", E20.reel, 0.5); s.add("vuelo", 344.6, 0.5); s.add("vuelo", 345.4, 0.5); s.add("aparece", E20.news); [0, 1, 2, 3, 4].forEach((i) => s.add("tiron", E20.news + 0.5 + i * 0.45, 0.35)); s.add("cierre", E20.last + 0.1, 0.6); s.add("golpe", E20.down + 0.7, 0.5); },
  },
  {
    hub: { portal: "tele", orbs: [
      { id: "tele", t: T("television show", 351), ang: -14, anillo: 0, tam: 240, D: TeleFin },
      { id: "sil", t: T("moment of silence", 353.5), ang: 198, anillo: 1, tam: 180, D: Silencio },
      { id: "puntos", t: T("the next thing", 354.5), ang: 128, anillo: 2, tam: 160, D: Puntos },
    ] },
    Escena: Escena21,
    sonidos: (s) => { s.add("aparece", E21.book); s.add("tiron", E21.book + 0.1, 0.5); s.add("vuelo", 359.2, 0.6); s.add("traza", E21.life); [0, 1, 2, 3, 4].forEach((j) => s.add("tic", E21.stop + j * 0.25, 0.5)); s.add("cierre", E21.enough); s.add("vuelo", 365.6, 0.6); s.add("tiron", E21.scroll, 0.6); s.add("tiron", E21.more, 0.6); },
  },
  {
    hub: { portal: "vid", orbs: [
      ...[0, 1, 2, 3].map((i) => ({ id: "p" + i, t: T("You scroll again", 368.5) + i * 0.35, ang: 200 + i * 52, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 150, D: Post(i) })),
      { id: "vid", t: T("The video ends", 370) - 0.3, ang: -14, anillo: 0, tam: 240, D: VideoFin },
    ] },
    Escena: Escena22,
    sonidos: (s) => { s.add("tic", E22.next, 0.6); s.add("tic", E22.next + 0.45, 0.6); s.add("tic", E22.next + 0.9, 0.6); s.add("vuelo", E22.playing + 0.2, 0.6); s.add("vuelo", 375.9, 0.5); s.add("tiron", E22.nolast, 0.5); s.add("vuelo", 378.1, 0.5); s.add("aparece", E22.engineer); s.add("ola", E22.regret, 0.4); s.add("vuelo", 382.9, 0.5); s.add("vueloLargo", E22.swallow, 0.6); },
  },
  {
    hub: { portal: "cer", orbs: [
      { id: "cer", t: T("the glass brain", 385), ang: -14, anillo: 0, tam: 250, D: CerebroFrente },
      { id: "frente", t: T("behind your forehead", 388.5), ang: 198, anillo: 1, tam: 160, D: Frente },
      { id: "farol", t: T("acts like a", 389.5), ang: 128, anillo: 2, tam: 160, D: Farol },
    ] },
    Escena: Escena23,
    sonidos: (s) => { s.add("luz", E23.guard); s.add("aparece", E23.plans); s.add("traza", E23.plans + 0.3, 0.5); s.add("aparece", E23.decides, 0.6); s.add("aviso", E23.says, 0.4); s.add("ola", E23.sleep, 0.4); s.add("vuelo", 398.2, 0.5); s.add("traza", E23.door); s.add("golpe", E23.stop, 0.5); },
  },
];
