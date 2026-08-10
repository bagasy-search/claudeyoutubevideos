// e7hdoc_kit.tsx — kit de componentes del documental "7 Construcciones Antiguas" (25 min).
// Hereda la identidad del hook (Main_e7h.tsx) y agrega la munición que 25 minutos necesitan.
// Paleta oro/crema/rojo sobre casi negro · Anton (números) · Oswald (labels) · Inter (datos).
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img, OffthreadVideo, staticFile, Easing} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

export const ANTON = loadAnton().fontFamily;
export const OSWALD = loadOswald().fontFamily;
export const INTER = loadInter().fontFamily;

export const FPS = 30;
export const F = (s: number) => Math.round(s * FPS);

export const GOLD = '#F2C23E';
export const CREAM = '#F4F1E9';
export const SUB = '#C9C2B2';
export const RED = '#E24A2C';
export const INK = '#0b0b0c';
export const PANEL = 'rgba(9,10,12,0.80)';

export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const clampI = (f: number, a: number, b: number, out: [number, number], easing?: any) =>
  interpolate(f, [a, b], out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
export const miles = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------- secuencias ----------
export const Seq: React.FC<{s: number; e: number; name?: string; children: React.ReactNode}> = ({s, e, name, children}) => (
  <Sequence from={F(s)} durationInFrames={Math.max(1, F(e - s))} name={name} layout="none">{children}</Sequence>
);
const SeqDurCtx = React.createContext(1);
export const Scene: React.FC<{s: number; e: number; name?: string; children: React.ReactNode}> = ({s, e, name, children}) => (
  <Sequence from={F(s)} durationInFrames={Math.max(1, F(e - s))} name={name} layout="none">
    <SeqDurCtx.Provider value={Math.max(1, F(e - s))}>{children}</SeqDurCtx.Provider>
  </Sequence>
);

// ---------- fondo ----------
export const Bg: React.FC<{
  src: string; kind?: 'img' | 'clip'; focus?: string; z?: [number, number];
  from?: number; darken?: number; vig?: number;
}> = ({src, kind = 'clip', focus = '50% 50%', z = [1.06, 1.14], from = 0, darken = 0.30, vig = 0.18}) => {
  const f = useCurrentFrame();
  const dur = React.useContext(SeqDurCtx);
  const p = dur > 1 ? f / dur : 0;
  const scale = interpolate(p, [0, 1], z, {easing: Easing.linear});
  const style: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', transform: `scale(${scale})`, transformOrigin: focus};
  return (
    <AbsoluteFill>
      {kind === 'img' ? <Img src={staticFile(src)} style={style} />
        : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * FPS)} muted style={style} />}
      {vig > 0 && <AbsoluteFill style={{background: `radial-gradient(120% 100% at 50% 42%, transparent 40%, rgba(0,0,0,${vig}) 100%)`}} />}
      {darken > 0 && <AbsoluteFill style={{background: `rgba(6,7,9,${darken})`}} />}
    </AbsoluteFill>
  );
};

// ============ COMPONENTE FIRMA: FICHA DE TEORÍA ============
// Sello TEORÍA + autor + año, y el contrapunto: qué la sostiene / qué la hunde.
export const TheoryCard: React.FC<{
  n: number; titulo: string; autor: string; anio: string;
  sostiene: string; hunde: string; side?: 'left' | 'right';
}> = ({n, titulo, autor, anio, sostiene, hunde, side = 'right'}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 12, [0, 1], EXPO);
  const slide = clampI(f, 0, 16, [side === 'right' ? 60 : -60, 0], EXPO);
  const barra = clampI(f, 4, 22, [0, 1], EXPO);
  const so = clampI(f, 26, 40, [0, 1], EXPO);   // "lo que la sostiene"
  const ho = clampI(f, 46, 62, [0, 1], EXPO);   // "lo que la hunde"
  const X = side === 'right' ? 980 : 130;
  return (
    <div style={{position: 'absolute', left: X, top: 200, width: 810, opacity: app,
      transform: `translateX(${slide}px)`, background: PANEL, borderLeft: `8px solid ${RED}`, padding: '26px 32px 30px'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6}}>
        <span style={{font: `400 34px ${ANTON}`, color: RED, letterSpacing: 3}}>TEORÍA {n}</span>
        <span style={{flex: 1, height: 3, background: RED, transform: `scaleX(${barra})`, transformOrigin: 'left'}} />
      </div>
      <div style={{font: `500 46px ${OSWALD}`, color: CREAM, textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 8}}>{titulo}</div>
      <div style={{font: `500 26px ${INTER}`, color: GOLD, letterSpacing: 1, marginBottom: 22}}>{autor} · {anio}</div>
      <Fila color={GOLD} label="Lo que la sostiene" texto={sostiene} o={so} />
      <Fila color={RED} label="Lo que la hunde" texto={hunde} o={ho} />
    </div>
  );
};
const Fila: React.FC<{color: string; label: string; texto: string; o: number}> = ({color, label, texto, o}) => (
  <div style={{opacity: o, marginTop: 14, display: 'flex', gap: 14}}>
    <div style={{width: 5, background: color, flexShrink: 0}} />
    <div>
      <div style={{font: `600 20px ${OSWALD}`, letterSpacing: 4, color, textTransform: 'uppercase'}}>{label}</div>
      <div style={{font: `400 28px ${INTER}`, color: CREAM, lineHeight: 1.35, marginTop: 4}}>{texto}</div>
    </div>
  </div>
);

// ============ CORTINILLA DE BLOQUE (1/7) ============
export const BlockCard: React.FC<{n: number; sitio: string; pais: string; coords: string}> =
({n, sitio, pais, coords}) => {
  const f = useCurrentFrame();
  const num = interpolate(f, [0, 10, 20], [2.2, 0.96, 1], {extrapolateRight: 'clamp', easing: EXPO});
  const no = clampI(f, 0, 10, [0, 1], EXPO);
  const lo = clampI(f, 12, 24, [0, 1], EXPO);
  const linea = clampI(f, 14, 34, [0, 1], EXPO);
  const co = clampI(f, 26, 38, [0, 1], EXPO);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 20, opacity: no}}>
        <span style={{font: `400 300px ${ANTON}`, color: GOLD, lineHeight: 0.8, transform: `scale(${num})`, textShadow: '0 12px 60px rgba(0,0,0,.85)'}}>{n}</span>
        <span style={{font: `400 90px ${ANTON}`, color: SUB, opacity: 0.65}}>/7</span>
      </div>
      <div style={{width: 620, height: 4, background: GOLD, marginTop: 22, transform: `scaleX(${linea})`}} />
      <div style={{font: `500 76px ${OSWALD}`, color: CREAM, letterSpacing: 4, textTransform: 'uppercase', opacity: lo, marginTop: 20}}>{sitio}</div>
      <div style={{font: `500 34px ${OSWALD}`, color: GOLD, letterSpacing: 8, textTransform: 'uppercase', opacity: lo}}>{pais}</div>
      <div style={{font: `400 26px ${INTER}`, color: SUB, letterSpacing: 3, opacity: co, marginTop: 14}}>{coords}</div>
    </AbsoluteFill>
  );
};

// ============ RELOJ DE TIEMPO PROFUNDO (clímax bloque 7) ============
export const DeepTime: React.FC<{hitos: {label: string; años: number}[]; maxAnios: number}> =
({hitos, maxAnios}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const W = 1560;
  return (
    <div style={{position: 'absolute', left: 180, top: 300, width: W, opacity: app}}>
      <div style={{font: `600 26px ${OSWALD}`, letterSpacing: 6, color: GOLD, textTransform: 'uppercase', marginBottom: 26}}>Antigüedad</div>
      {hitos.map((h, i) => {
        const st = 8 + i * 18;
        const g = clampI(f, st, st + 26, [0, h.años / maxAnios], EXPO);
        const o = clampI(f, st, st + 10, [0, 1], EXPO);
        const ultimo = i === hitos.length - 1;
        return (
          <div key={h.label} style={{marginBottom: 26, opacity: o}}>
            <div style={{font: `500 28px ${OSWALD}`, color: ultimo ? GOLD : CREAM, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6}}>{h.label}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <div style={{height: ultimo ? 44 : 30, width: Math.max(6, W * 0.72 * g), background: ultimo ? GOLD : '#6e6c66'}} />
              <div style={{font: `400 ${ultimo ? 44 : 32}px ${ANTON}`, color: ultimo ? GOLD : SUB}}>{miles(h.años)} años</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============ ESCALA HUMANA ============
export const HumanScale: React.FC<{alturaObjM: number; label: string; x?: number; y?: number}> =
({alturaObjM, label, x = 1180, y = 240}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const g = clampI(f, 6, 34, [0, 1], EXPO);
  const H = 460;                                  // alto del objeto en px
  const hp = H * (1.75 / alturaObjM);             // persona de 1,75 m a la misma escala
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: app}}>
      <svg width={560} height={H + 70}>
        <rect x={0} y={(H - H * g) + 10} width={330} height={H * g} fill="rgba(242,194,62,.22)" stroke={GOLD} strokeWidth={3} />
        <g fill={CREAM} transform={`translate(${372},${H + 10 - hp})`}>
          <circle cx={22} cy={hp * 0.09} r={hp * 0.085} />
          <rect x={13} y={hp * 0.19} width={18} height={hp * 0.45} rx={7} />
          <rect x={14} y={hp * 0.62} width={7} height={hp * 0.38} />
          <rect x={24} y={hp * 0.62} width={7} height={hp * 0.38} />
        </g>
        <line x1={0} y1={H + 12} x2={560} y2={H + 12} stroke={SUB} strokeWidth={2} />
      </svg>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 4}}>
        <div style={{width: 44, height: 4, background: GOLD}} />
        <div style={{font: `600 30px ${OSWALD}`, letterSpacing: 3, color: GOLD, textTransform: 'uppercase'}}>{label}</div>
      </div>
    </div>
  );
};

// ============ SPLIT DE TEORÍAS (A vs B) ============
export const TheorySplit: React.FC<{a: {t: string; sub: string}; b: {t: string; sub: string}}> = ({a, b}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 12, [0, 1], EXPO);
  const la = clampI(f, 4, 20, [-70, 0], EXPO);
  const lb = clampI(f, 12, 28, [70, 0], EXPO);
  const linea = clampI(f, 8, 26, [0, 1], EXPO);
  const cel = (d: {t: string; sub: string}, dx: number, color: string) => (
    <div style={{flex: 1, transform: `translateX(${dx}px)`, padding: '0 46px', textAlign: 'center'}}>
      <div style={{font: `400 64px ${ANTON}`, color, letterSpacing: 1, lineHeight: 1.05, textShadow: '0 6px 30px rgba(0,0,0,.85)'}}>{d.t}</div>
      <div style={{font: `400 28px ${INTER}`, color: CREAM, marginTop: 16, lineHeight: 1.35}}>{d.sub}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: app}}>
      <div style={{display: 'flex', width: 1660, alignItems: 'center'}}>
        {cel(a, la, GOLD)}
        <div style={{width: 3, height: 320 * linea, background: 'rgba(244,241,233,.35)'}} />
        {cel(b, lb, CREAM)}
      </div>
    </AbsoluteFill>
  );
};

// ============ ZOOM FORENSE (reticle + cota sobre un detalle) ============
export const Forensic: React.FC<{label: string; valor: string; cx?: number; cy?: number; r?: number}> =
({label, valor, cx = 960, cy = 500, r = 190}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 12, [0, 1], EXPO);
  const ring = clampI(f, 0, 26, [0.3, 1], EXPO);
  const vo = clampI(f, 20, 34, [0, 1], EXPO);
  const R = r * ring;
  return (
    <AbsoluteFill style={{opacity: app}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <g stroke={GOLD} fill="none" strokeWidth={2.5}>
          <rect x={cx - R} y={cy - R * 0.62} width={R * 2} height={R * 1.24} />
          <line x1={cx - R} y1={cy - R * 0.62} x2={cx - R + 30} y2={cy - R * 0.62 - 30} />
          <line x1={cx + R} y1={cy + R * 0.62} x2={cx + R - 30} y2={cy + R * 0.62 + 30} />
        </g>
        {[[cx - R, cy - R * 0.62], [cx + R, cy - R * 0.62], [cx - R, cy + R * 0.62], [cx + R, cy + R * 0.62]].map((p, i) => (
          <rect key={i} x={p[0] - 5} y={p[1] - 5} width={10} height={10} fill={GOLD} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: cx - R, top: cy + R * 0.62 + 40, opacity: vo}}>
        <div style={{font: `600 22px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase'}}>{label}</div>
        <div style={{font: `400 78px ${ANTON}`, color: CREAM, lineHeight: 1, textShadow: '0 6px 30px rgba(0,0,0,.85)'}}>{valor}</div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SABEMOS / NO SABEMOS (se llena a lo largo del video) ============
export const KnownUnknown: React.FC<{sabemos: string[]; noSabemos: string[]}> = ({sabemos, noSabemos}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 12, [0, 1], EXPO);
  const col = (titulo: string, items: string[], color: string, off: number) => (
    <div style={{flex: 1, padding: '0 40px'}}>
      <div style={{font: `600 26px ${OSWALD}`, letterSpacing: 5, color, textTransform: 'uppercase', marginBottom: 22}}>{titulo}</div>
      {items.map((it, i) => {
        const st = off + i * 12;
        const o = clampI(f, st, st + 12, [0, 1], EXPO);
        const dx = clampI(f, st, st + 14, [24, 0], EXPO);
        return (
          <div key={it} style={{opacity: o, transform: `translateX(${dx}px)`, display: 'flex', gap: 14, marginBottom: 16}}>
            <div style={{width: 4, background: color, flexShrink: 0}} />
            <div style={{font: `400 30px ${INTER}`, color: CREAM, lineHeight: 1.3}}>{it}</div>
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: app}}>
      <div style={{display: 'flex', width: 1680, alignItems: 'flex-start'}}>
        {col('Lo que sabemos', sabemos, GOLD, 6)}
        <div style={{width: 3, alignSelf: 'stretch', background: 'rgba(244,241,233,.28)'}} />
        {col('Lo que no', noSabemos, RED, 30)}
      </div>
    </AbsoluteFill>
  );
};

// ============ reexports del hook que se reusan tal cual ============
export const BigNumber: React.FC<{target: number; unit: string; kicker: string; decimals?: number; thousands?: boolean}> =
({target, unit, kicker, decimals = 0, thousands = true}) => {
  const f = useCurrentFrame();
  const appear = clampI(f, 0, 8, [0, 1], EXPO);
  const scale = interpolate(f, [0, 6, 12], [1.35, 0.97, 1], {extrapolateRight: 'clamp', easing: EXPO});
  const count = clampI(f, 0, 26, [0, target], EXPO);
  let num = decimals ? count.toFixed(decimals) : Math.round(count).toString();
  if (thousands) num = miles(Number(num));
  return (
    <div style={{position: 'absolute', left: 130, bottom: 140, opacity: appear, transform: `translateY(${(1 - appear) * 30}px)`}}>
      <div style={{font: `600 28px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase', marginBottom: -4}}>{kicker}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
        <div style={{font: `400 200px ${ANTON}`, lineHeight: 0.9, color: CREAM, transform: `scale(${scale})`, transformOrigin: 'left bottom', textShadow: '0 8px 40px rgba(0,0,0,.75)'}}>{num}</div>
        <div style={{font: `400 64px ${ANTON}`, color: GOLD, letterSpacing: 2}}>{unit}</div>
      </div>
    </div>
  );
};

export const LowerLabel: React.FC<{kicker?: string; main: string; y?: number}> = ({kicker, main, y = 110}) => {
  const f = useCurrentFrame();
  const w = clampI(f, 0, 12, [0, 1], EXPO);
  const out = clampI(f, 0, 6, [0, 1], EXPO);
  return (
    <div style={{position: 'absolute', left: 130, top: y, opacity: out, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 6, height: 58, background: GOLD, transform: `scaleY(${w})`, transformOrigin: 'top'}} />
      <div style={{overflow: 'hidden'}}>
        {kicker && <div style={{font: `600 20px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase'}}>{kicker}</div>}
        <div style={{font: `500 40px ${OSWALD}`, color: CREAM, textTransform: 'uppercase', letterSpacing: 1,
          transform: `translateY(${(1 - w) * 46}px)`, textShadow: '0 4px 22px rgba(0,0,0,.8)'}}>{main}</div>
      </div>
    </div>
  );
};

export const Stamp: React.FC<{text: string; color?: string; x: number; y: number; rot?: number; big?: boolean}> =
({text, color = CREAM, x, y, rot = -4, big = false}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 5, 10], [1.6, 0.94, 1], {extrapolateRight: 'clamp', easing: EXPO});
  const o = clampI(f, 0, 6, [0, 1], EXPO);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${s})`, opacity: o,
      border: `4px solid ${color}`, padding: big ? '10px 26px' : '6px 18px', background: 'rgba(0,0,0,.34)'}}>
      <span style={{font: `400 ${big ? 70 : 40}px ${ANTON}`, color, letterSpacing: 3, textTransform: 'uppercase'}}>{text}</span>
    </div>
  );
};

export type KLine = {at: number; size?: number; color?: string; words: {t: string; hl?: boolean}[]; strikeAt?: number};
export const Kinetic: React.FC<{lines: KLine[]}> = ({lines}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch'}}>
      {lines.map((ln, li) => {
        const base = F(ln.at);
        const size = ln.size ?? 80;
        return (
          <div key={li} style={{width: '100%', textAlign: 'center', lineHeight: 1.06, padding: '4px 0'}}>
            {ln.words.map((w, wi) => {
              const start = base + wi * 3;
              const o = clampI(f, start, start + 9, [0, 1], EXPO);
              const y = clampI(f, start, start + 12, [24, 0], EXPO);
              const sp = ln.strikeAt != null ? clampI(f, F(ln.strikeAt), F(ln.strikeAt) + 10, [0, 1], EXPO) : 0;
              return (
                <span key={wi} style={{display: 'inline-block', position: 'relative', opacity: o,
                  transform: `translateY(${y}px)`, margin: '0 8px',
                  font: `400 ${size}px ${ANTON}`, color: w.hl ? INK : (ln.color ?? CREAM),
                  background: w.hl ? GOLD : 'transparent', padding: w.hl ? '2px 16px' : 0,
                  letterSpacing: 1, textShadow: w.hl ? 'none' : '0 6px 30px rgba(0,0,0,.85)'}}>
                  {w.t}
                  {ln.strikeAt != null && <span style={{position: 'absolute', left: 0, top: '52%', height: 8, width: `${sp * 100}%`, background: RED}} />}
                </span>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const FilmOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const seed = f % 12;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px 40px rgba(0,0,0,0.6)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.055, mixBlendMode: 'overlay'}}>
        <filter id={`gd${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" /></filter>
        <rect width="1920" height="1080" filter={`url(#gd${seed})`} />
      </svg>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 34, background: INK}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 34, background: INK}} />
    </AbsoluteFill>
  );
};

// ============ BARRA DE NIVELACIÓN (Guiza) ============
export const LevelBarD: React.FC<{kicker: string; span: string; dev: string; y?: number}> =
({kicker, span, dev, y = 230}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const grow = clampI(f, 2, 30, [0, 1], EXPO);
  const devO = clampI(f, 26, 40, [0, 1], EXPO);
  const W = 1500;
  return (
    <div style={{position: 'absolute', left: 180, top: y, width: W + 60, opacity: app, background: PANEL,
      borderLeft: `6px solid ${GOLD}`, padding: '20px 30px 12px'}}>
      <div style={{font: `600 24px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase', marginBottom: 12}}>{kicker}</div>
      <svg width={W} height={132}>
        <line x1={0} y1={70} x2={W * grow} y2={70} stroke={CREAM} strokeWidth={5} />
        {Array.from({length: 16}).map((_, i) => (
          <line key={i} x1={i * (W / 15)} y1={62} x2={i * (W / 15)} y2={78} stroke={SUB} strokeWidth={1.5} opacity={grow} />
        ))}
        <line x1={0} y1={70} x2={0} y2={30} stroke={GOLD} strokeWidth={2} opacity={grow} />
        <line x1={W} y1={70} x2={W} y2={30} stroke={GOLD} strokeWidth={2} opacity={grow} />
        <line x1={0} y1={36} x2={W * grow} y2={36} stroke={GOLD} strokeWidth={3} opacity={grow} />
        <text x={W / 2} y={26} textAnchor="middle" style={{font: `600 28px ${OSWALD}`, letterSpacing: 3}} fill={GOLD}>{span}</text>
        <g opacity={devO}>
          <line x1={W * 0.5} y1={62} x2={W * 0.5} y2={116} stroke={RED} strokeWidth={5} />
          <text x={W * 0.5 + 20} y={114} style={{font: `600 40px ${OSWALD}`, letterSpacing: 2}} fill={RED}>{dev}</text>
        </g>
      </svg>
    </div>
  );
};
