// Main_e7h.tsx — HOOK documental "7 Construcciones Antiguas Que Hoy Serían Imposibles de Hacer"
// Estilo Vox editorial premium · faceless · b-roll real + motion graphics · 30fps 1920x1080
// Audio: mezcla única pre-renderizada e7h_mix.wav (narración Qwen3-TTS + música + SFX + ducking).
// v2 — clips conformados a 30fps CFR (encode_e7h.mjs), overlays sin solapamientos, kit ampliado.
import React from 'react';
import {
  AbsoluteFill, Sequence, useCurrentFrame, interpolate,
  Img, Video, Audio, staticFile, Easing,
} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

const ANTON = loadAnton().fontFamily;
const OSWALD = loadOswald().fontFamily;
const INTER = loadInter().fontFamily;

const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
export const TOTAL_FRAMES_E7H = F(65.3);

// paleta
const GOLD = '#F2C23E';
const CREAM = '#F4F1E9';
const SUB = '#C9C2B2';
const RED = '#E24A2C';
const INK = '#0b0b0c';
const PANEL = 'rgba(9,10,12,0.72)';

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const clampI = (f: number, a: number, b: number, out: [number, number], easing?: any) =>
  interpolate(f, [a, b], out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

// ---------- helpers de secuencia ----------
const Seq: React.FC<{s: number; e: number; name?: string; children: React.ReactNode}> = ({s, e, name, children}) => (
  <Sequence from={F(s)} durationInFrames={Math.max(1, F(e - s))} name={name} layout="none">
    {children}
  </Sequence>
);

// contexto con la duración de la Sequence actual (para el Ken-Burns del fondo)
const SeqDurCtx = React.createContext(1);
const useCurrentSeqDur = () => ({durationInFrames: React.useContext(SeqDurCtx)});

// wrapper que provee la duración de la Sequence al contexto
const Scene: React.FC<{s: number; e: number; children: React.ReactNode; name?: string}> = ({s, e, children, name}) => (
  <Sequence from={F(s)} durationInFrames={Math.max(1, F(e - s))} name={name} layout="none">
    <SeqDurCtx.Provider value={Math.max(1, F(e - s))}>{children}</SeqDurCtx.Provider>
  </Sequence>
);

// ---------- fondo (clip o imagen) con Ken-Burns y corte limpio ----------
const Bg: React.FC<{
  src: string; kind?: 'img' | 'clip'; focus?: string; z?: [number, number];
  from?: number; darken?: number; vig?: number;
}> = ({src, kind = 'clip', focus = '50% 50%', z = [1.06, 1.14], from = 0, darken = 0.28, vig = 0.18}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useCurrentSeqDur();
  const p = durationInFrames > 1 ? f / durationInFrames : 0;
  const scale = interpolate(p, [0, 1], z, {easing: Easing.linear});
  const style: React.CSSProperties = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', transform: `scale(${scale})`, transformOrigin: focus,
  };
  return (
    <AbsoluteFill>
      {kind === 'img'
        ? <Img src={staticFile(src)} style={style} />
        : <Video src={staticFile(src)} startFrom={Math.round(from * FPS)} muted style={style} />}
      {vig > 0 && (
        <AbsoluteFill style={{background: `radial-gradient(120% 100% at 50% 42%, transparent 40%, rgba(0,0,0,${vig}) 100%)`}} />
      )}
      {darken > 0 && <AbsoluteFill style={{background: `rgba(6,7,9,${darken})`}} />}
    </AbsoluteFill>
  );
};

// ---------- overlays de motion graphics ----------

// número gigante que sube (slam-in) — estilo dato Vox
const BigNumber: React.FC<{target: number; unit: string; kicker: string; decimals?: number; thousands?: boolean}> =
({target, unit, kicker, decimals = 0, thousands = true}) => {
  const f = useCurrentFrame();
  const appear = clampI(f, 0, 8, [0, 1], EXPO);
  const scale = interpolate(f, [0, 6, 12], [1.35, 0.97, 1], {extrapolateRight: 'clamp', easing: EXPO});
  const count = clampI(f, 0, 26, [0, target], EXPO);
  let num = decimals ? count.toFixed(decimals) : Math.round(count).toString();
  if (thousands) num = Number(num).toLocaleString('es-ES');
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

// lower-third label (tab dorado + texto). y = borde superior del bloque.
const LowerLabel: React.FC<{kicker?: string; main: string; y?: number}> = ({kicker, main, y = 110}) => {
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

// reticle localizador (coordenadas + país) — grande y sostenido
const Reticle: React.FC<{place: string; coords: string; cx?: number; cy?: number; r?: number}> =
({place, coords, cx = 960, cy = 470, r = 150}) => {
  const f = useCurrentFrame();
  const ring = clampI(f, 0, 30, [0.25, 1], EXPO);       // se abre más lento
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  const app = clampI(f, 0, 12, [0, 1], EXPO);
  const R = r * ring;
  const T = 24;                                          // largo de las marcas de cruz
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: app}}>
      <g stroke={GOLD} fill="none" strokeWidth={2.5}>
        <circle cx={cx} cy={cy} r={R} opacity={0.95} />
        <circle cx={cx} cy={cy} r={R * 0.62} opacity={0.35} strokeDasharray="6 10" />
        <circle cx={cx} cy={cy} r={R + 26 + pulse * 26} opacity={0.22} />
        <line x1={cx - R - T} y1={cy} x2={cx - R + 12} y2={cy} />
        <line x1={cx + R - 12} y1={cy} x2={cx + R + T} y2={cy} />
        <line x1={cx} y1={cy - R - T} x2={cx} y2={cy - R + 12} />
        <line x1={cx} y1={cy + R - 12} x2={cx} y2={cy + R + T} />
      </g>
      <circle cx={cx} cy={cy} r={5} fill={GOLD} />
      <g transform={`translate(${cx + R + 40},${cy - 22})`} opacity={clampI(f, 10, 24, [0, 1])}>
        <rect x={-14} y={-40} width={8} height={92} fill={GOLD} />
        <text x={8} style={{font: `600 38px ${OSWALD}`, letterSpacing: 3}} fill={CREAM}>{place}</text>
        <text x={8} y={38} style={{font: `500 26px ${INTER}`, letterSpacing: 2}} fill={GOLD}>{coords}</text>
      </g>
    </svg>
  );
};

// estampa que golpea (SIN CEMENTO / NO SE PUEDE MOVER)
const Stamp: React.FC<{text: string; color?: string; x: number; y: number; rot?: number; big?: boolean}> =
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

// chips de proceso que se encienden en secuencia (cortada · transportada · encajada)
const ProcessChips: React.FC<{items: string[]; at: number[]; y?: number}> = ({items, at, y = 830}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 130, top: y, display: 'flex', gap: 18, alignItems: 'center'}}>
      {items.map((it, i) => {
        const st = F(at[i]);
        const on = clampI(f, st, st + 9, [0, 1], EXPO);
        const pop = interpolate(f, [st, st + 5, st + 11], [1.18, 0.98, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO});
        return (
          <React.Fragment key={it}>
            {i > 0 && <div style={{width: 34, height: 3, background: GOLD, opacity: on * 0.7}} />}
            <div style={{opacity: 0.28 + on * 0.72, transform: `scale(${pop})`, background: on > 0.5 ? GOLD : 'rgba(0,0,0,.5)',
              border: `2px solid ${GOLD}`, padding: '10px 22px'}}>
              <span style={{font: `600 30px ${OSWALD}`, letterSpacing: 3, textTransform: 'uppercase', color: on > 0.5 ? INK : SUB}}>{it}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// tarjeta de medición: dos bloques con una junta y una cota
const GapDim: React.FC<{kicker: string; value: string; x?: number; y?: number}> =
({kicker, value, x = 1120, y = 330}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const close = clampI(f, 6, 30, [26, 4], EXPO);   // los bloques se juntan
  const num = clampI(f, 24, 34, [0, 1], EXPO);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 620, opacity: app, background: PANEL,
      border: `2px solid rgba(242,194,62,.45)`, padding: '26px 28px'}}>
      <div style={{font: `600 22px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase', marginBottom: 18}}>{kicker}</div>
      <svg width={564} height={150}>
        <rect x={0} y={62 - close} width={564} height={56} fill="#8a8378" />
        <rect x={0} y={62 + close} width={564} height={56} fill="#6f6a61" />
        <line x1={470} y1={62 - close + 56} x2={470} y2={62 + close} stroke={GOLD} strokeWidth={3} />
        <line x1={458} y1={62 - close + 56} x2={482} y2={62 - close + 56} stroke={GOLD} strokeWidth={3} />
        <line x1={458} y1={62 + close} x2={482} y2={62 + close} stroke={GOLD} strokeWidth={3} />
      </svg>
      <div style={{font: `400 76px ${ANTON}`, color: CREAM, opacity: num, marginTop: -8, letterSpacing: 1}}>{value}</div>
    </div>
  );
};

// prueba del cuchillo: la hoja entra y choca contra la junta
const BladeGauge: React.FC<{kicker: string; verdict: string; x?: number; y?: number}> =
({kicker, verdict, x = 1080, y = 320}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const push = clampI(f, 14, 38, [300, 118], EXPO);
  const hit = f > 38 ? Math.max(0, 8 - (f - 38) * 0.5) * Math.sin(f * 1.6) : 0; // rebote corto
  const vo = clampI(f, 42, 52, [0, 1], EXPO);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 660, opacity: app, background: PANEL,
      border: `2px solid rgba(242,194,62,.45)`, padding: '26px 28px'}}>
      <div style={{font: `600 22px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase', marginBottom: 16}}>{kicker}</div>
      <svg width={604} height={172}>
        <rect x={0} y={8} width={112} height={156} fill="#8a8378" />
        <rect x={114} y={8} width={126} height={156} fill="#77716a" />
        <line x1={113} y1={8} x2={113} y2={164} stroke="#2a2724" strokeWidth={2} />
        <g transform={`translate(${push + hit},0)`}>
          <polygon points="0,74 250,60 250,98 0,100" fill="#cfd4da" />
          <rect x={250} y={54} width={120} height={50} rx={6} fill="#2f2b27" />
        </g>
        <g stroke={RED} strokeWidth={4} opacity={vo}>
          <line x1={126} y1={44} x2={166} y2={84} />
          <line x1={166} y1={44} x2={126} y2={84} />
        </g>
      </svg>
      <div style={{font: `400 54px ${ANTON}`, color: RED, opacity: vo, letterSpacing: 2, textTransform: 'uppercase'}}>{verdict}</div>
    </div>
  );
};

// barra de nivelación: base larguísima, desvío mínimo
const LevelBar: React.FC<{kicker: string; span: string; dev: string; y?: number}> = ({kicker, span, dev, y = 250}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const grow = clampI(f, 2, 30, [0, 1], EXPO);
  const devO = clampI(f, 26, 40, [0, 1], EXPO);
  const W = 1500;
  return (
    <div style={{position: 'absolute', left: 210, top: y, width: W, opacity: app}}>
      <div style={{font: `600 24px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase', marginBottom: 12}}>{kicker}</div>
      <svg width={W} height={132}>
        <line x1={0} y1={70} x2={W * grow} y2={70} stroke={CREAM} strokeWidth={3} />
        {Array.from({length: 16}).map((_, i) => (
          <line key={i} x1={i * (W / 15)} y1={62} x2={i * (W / 15)} y2={78} stroke={SUB} strokeWidth={1.5} opacity={grow} />
        ))}
        <line x1={0} y1={70} x2={0} y2={30} stroke={GOLD} strokeWidth={2} opacity={grow} />
        <line x1={W} y1={70} x2={W} y2={30} stroke={GOLD} strokeWidth={2} opacity={grow} />
        <line x1={0} y1={36} x2={W * grow} y2={36} stroke={GOLD} strokeWidth={2} opacity={grow} />
        <text x={W / 2} y={26} textAnchor="middle" style={{font: `600 28px ${OSWALD}`, letterSpacing: 3}} fill={GOLD}>{span}</text>
        <g opacity={devO}>
          <line x1={W * 0.5} y1={70} x2={W * 0.5} y2={112} stroke={RED} strokeWidth={3} />
          <text x={W * 0.5 + 16} y={112} style={{font: `600 30px ${OSWALD}`, letterSpacing: 2}} fill={RED}>{dev}</text>
        </g>
      </svg>
    </div>
  );
};

// tres aviones apilados — escala de la piedra
const PlaneStack: React.FC<{label: string; x?: number; y?: number}> = ({label, x = 1180, y = 180}) => {
  const f = useCurrentFrame();
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const plane = (i: number) => {
    const st = 4 + i * 11;
    const o = clampI(f, st, st + 10, [0, 1], EXPO);
    const dx = clampI(f, st, st + 14, [70, 0], EXPO);
    return (
      <g key={i} transform={`translate(${dx},${i * 128})`} opacity={o}>
        <path d="M20,60 L300,44 L340,52 L300,68 L20,68 Z" fill={CREAM} opacity={0.92} />
        <path d="M150,52 L196,0 L216,0 L186,52 Z" fill={CREAM} opacity={0.75} />
        <path d="M150,62 L196,112 L216,112 L186,62 Z" fill={CREAM} opacity={0.75} />
        <path d="M40,48 L64,20 L78,20 L62,48 Z" fill={CREAM} opacity={0.6} />
        <path d="M40,66 L64,94 L78,94 L62,66 Z" fill={CREAM} opacity={0.6} />
      </g>
    );
  };
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: app}}>
      <svg width={420} height={400}>{[0, 1, 2].map(plane)}</svg>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 6}}>
        <div style={{width: 46, height: 4, background: GOLD}} />
        <div style={{font: `600 30px ${OSWALD}`, letterSpacing: 3, color: GOLD, textTransform: 'uppercase'}}>{label}</div>
      </div>
    </div>
  );
};

// comparación de dos barras
const CompareBars: React.FC<{
  a: {label: string; val: number; color: string}; b: {label: string; val: number; color: string};
  unit: string; note?: string;
}> = ({a, b, unit, note}) => {
  const f = useCurrentFrame();
  const max = Math.max(a.val, b.val);
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const noteO = clampI(f, 34, 46, [0, 1], EXPO);
  const row = (d: {label: string; val: number; color: string}, i: number) => {
    const g = clampI(f, 4 + i * 6, 26 + i * 6, [0, d.val / max], EXPO);
    return (
      <div key={i} style={{marginBottom: 22}}>
        <div style={{font: `500 26px ${OSWALD}`, color: CREAM, letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase'}}>{d.label}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{height: 34, width: Math.max(4, 880 * g), background: d.color}} />
          <div style={{font: `400 34px ${ANTON}`, color: d.color}}>{Math.round(d.val).toLocaleString('es-ES')} {unit}</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: 130, bottom: 130, opacity: app}}>
      {row(a, 0)}{row(b, 1)}
      {note && (
        <div style={{opacity: noteO, display: 'inline-block', background: RED, padding: '6px 18px'}}>
          <span style={{font: `400 34px ${ANTON}`, color: CREAM, letterSpacing: 2, textTransform: 'uppercase'}}>{note}</span>
        </div>
      )}
    </div>
  );
};

// línea de tiempo que retrocede en el tiempo
const TimeStrip: React.FC<{label: string}> = ({label}) => {
  const f = useCurrentFrame();
  const grow = clampI(f, 0, 18, [0, 1], EXPO);
  const marker = clampI(f, 6, 30, [1640, 40], EXPO);
  const app = clampI(f, 0, 8, [0, 1]);
  return (
    <div style={{position: 'absolute', left: 130, bottom: 150, width: 1660, opacity: app}}>
      <div style={{font: `600 26px ${OSWALD}`, letterSpacing: 4, color: GOLD, marginBottom: 14, textTransform: 'uppercase'}}>{label}</div>
      <svg width={1660} height={40}>
        <line x1={0} y1={20} x2={1660 * grow} y2={20} stroke={CREAM} strokeWidth={2} />
        {Array.from({length: 12}).map((_, i) => (
          <line key={i} x1={i * 150} y1={12} x2={i * 150} y2={28} stroke={SUB} strokeWidth={1} opacity={grow} />
        ))}
        <circle cx={marker} cy={20} r={9} fill={GOLD} />
      </svg>
    </div>
  );
};

// headline cinético — cada LÍNEA entra en su propio segundo (anclado al ms)
type KLine = {at: number; size?: number; color?: string; words: {t: string; hl?: boolean}[]; strikeAt?: number};
const Kinetic: React.FC<{lines: KLine[]}> = ({lines}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 160, right: 160, top: 0, bottom: 0, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10}}>
      {lines.map((ln, li) => {
        const base = F(ln.at);
        const size = ln.size ?? 80;
        return (
          <div key={li} style={{display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'baseline', flexWrap: 'nowrap', whiteSpace: 'nowrap'}}>
            {ln.words.map((w, wi) => {
              const start = base + wi * 3;
              const o = clampI(f, start, start + 9, [0, 1], EXPO);
              const y = clampI(f, start, start + 12, [24, 0], EXPO);
              const strikeP = ln.strikeAt != null ? clampI(f, F(ln.strikeAt), F(ln.strikeAt) + 10, [0, 1], EXPO) : 0;
              return (
                <span key={wi} style={{position: 'relative', opacity: o, transform: `translateY(${y}px)`,
                  font: `400 ${size}px ${ANTON}`, color: w.hl ? INK : (ln.color ?? CREAM),
                  background: w.hl ? GOLD : 'transparent', padding: w.hl ? '2px 16px' : 0,
                  letterSpacing: 1, textShadow: w.hl ? 'none' : '0 6px 30px rgba(0,0,0,.75)'}}>
                  {w.t}
                  {ln.strikeAt != null && (
                    <span style={{position: 'absolute', left: 0, top: '52%', height: 8, width: `${strikeP * 100}%`, background: RED}} />
                  )}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// flash montage sobre STILLS (cero judder) + ordinal 1..7
const FlashCards: React.FC<{items: {src: string; label: string}[]; each: number}> = ({items, each}) => {
  const f = useCurrentFrame();
  const per = F(each);
  const i = Math.min(items.length - 1, Math.floor(f / per));
  const it = items[i];
  const local = f - i * per;
  const s = interpolate(local, [0, per], [1.16, 1.03], {extrapolateRight: 'clamp'});
  const hit = local < 2 ? 0.28 : 0;
  return (
    <AbsoluteFill>
      <Img src={staticFile(it.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`}} />
      <AbsoluteFill style={{background: 'rgba(6,7,9,.40)'}} />
      <AbsoluteFill style={{background: `rgba(244,241,233,${hit})`}} />
      <div style={{position: 'absolute', left: 130, bottom: 130, display: 'flex', alignItems: 'flex-end', gap: 22}}>
        <div style={{font: `400 170px ${ANTON}`, color: GOLD, lineHeight: 0.82, textShadow: '0 8px 40px rgba(0,0,0,.8)'}}>{i + 1}</div>
        <div style={{paddingBottom: 16}}>
          <div style={{width: 60, height: 4, background: GOLD, marginBottom: 10}} />
          <div style={{font: `500 34px ${OSWALD}`, color: CREAM, letterSpacing: 3, textTransform: 'uppercase', textShadow: '0 4px 22px rgba(0,0,0,.9)'}}>{it.label}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// título final — la banda dorada golpea en "imposibles" (62.71s)
const TitleCard: React.FC<{bandAt: number}> = ({bandAt}) => {
  const f = useCurrentFrame();
  const seven = interpolate(f, [0, 8, 16], [2.4, 0.95, 1], {extrapolateRight: 'clamp', easing: EXPO});
  const so = clampI(f, 0, 8, [0, 1], EXPO);
  const l1 = clampI(f, 6, 16, [0, 1], EXPO);
  const B = F(bandAt);
  const l2o = clampI(f, B, B + 8, [0, 1], EXPO);
  const l2s = interpolate(f, [B, B + 8], [1.18, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO});
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
        <div style={{font: `400 250px ${ANTON}`, color: GOLD, lineHeight: 0.8, opacity: so, transform: `scale(${seven})`, textShadow: '0 10px 50px rgba(0,0,0,.8)'}}>7</div>
        <div style={{font: `500 80px ${OSWALD}`, color: CREAM, letterSpacing: 3, opacity: l1, transform: `translateX(${(1 - l1) * -30}px)`, textTransform: 'uppercase', maxWidth: 820, lineHeight: 1.0}}>Construcciones<br />Antiguas</div>
      </div>
      <div style={{marginTop: 26, opacity: l2o, transform: `scale(${l2s})`, background: GOLD, padding: '10px 30px'}}>
        <span style={{font: `400 58px ${ANTON}`, color: INK, letterSpacing: 2, textTransform: 'uppercase'}}>Que hoy serían imposibles</span>
      </div>
    </AbsoluteFill>
  );
};

// grano + viñeta + barras (siempre arriba). CERO filtros de color.
const FilmOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const seed = f % 12;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px 40px rgba(0,0,0,0.6)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.055, mixBlendMode: 'overlay'}}>
        <filter id={`g${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" /></filter>
        <rect width="1920" height="1080" filter={`url(#g${seed})`} />
      </svg>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 34, background: INK}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 34, background: INK}} />
    </AbsoluteFill>
  );
};

// apertura desde negro
const OpenBlack: React.FC = () => {
  const f = useCurrentFrame();
  const o = clampI(f, 0, 16, [1, 0]);
  return <AbsoluteFill style={{background: INK, opacity: o, pointerEvents: 'none'}} />;
};

// ============================ COMPOSICIÓN ============================
// ANCLAS (s): Esta 0.42 · mil 1.60 · aviones 4.12 · cortada 9.10 · precisión 12.26 · milímetro 14.00
// años 17.68 · Hoy 18.36 · grúas 19.79 · levantarla 23.34 · Perú 25.98 · cuchillo 30.20 · cemento 32.02
// argamasa 33.93 · Egipto 35.92 · Pirámide 37.34 · centímetros 41.48 · pregunta 45.35 · construyó 48.45
// tecnología 52.06 · repetirlas 55.37 · siete 57.76 · construcciones 58.37 · imposibles 62.71 · hacer 64.91
export const MainE7h: React.FC = () => {
  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile('e7h_mix.wav')} />

      {/* ---- A · 0.0–9.1 · la piedra de mil toneladas ---- */}
      <Scene s={0} e={4.12} name="A-baalbek"><Bg src="img/e7h_baalbek_largest.jpg" kind="img" focus="52% 58%" z={[1.05, 1.2]} darken={0.20} vig={0.22} /></Scene>
      <Scene s={4.12} e={9.1} name="A-mega"><Bg src="broll/e7h_stone_texture.mp4" from={0} focus="50% 50%" z={[1.08, 1.18]} darken={0.30} /></Scene>
      <Seq s={0.55} e={4.05} name="A-label"><LowerLabel kicker="Baalbek · Líbano" main="La Piedra de la Embarazada" y={110} /></Seq>
      <Seq s={1.60} e={9.0} name="A-num"><BigNumber target={1000} unit="TON" kicker="Peso de un solo bloque" /></Seq>
      <Seq s={4.12} e={8.95} name="A-planes"><PlaneStack label="3 aviones de pasajeros" x={1200} y={170} /></Seq>

      {/* ---- B · 9.1–18.36 · cortada con precisión de menos de 1 mm ---- */}
      <Scene s={9.1} e={11.8} name="B-chisel"><Bg src="broll/e7h_chisel_tool.mp4" from={1} focus="50% 50%" z={[1.05, 1.15]} /></Scene>
      <Scene s={11.8} e={14.0} name="B-quarry"><Bg src="broll/e7h_quarry_block.mp4" from={0} focus="50% 55%" z={[1.06, 1.16]} /></Scene>
      <Scene s={14.0} e={16.2} name="B-joint"><Bg src="img/e7h_photo_incajoint.jpg" kind="img" focus="42% 50%" z={[1.06, 1.22]} darken={0.34} /></Scene>
      <Scene s={16.2} e={18.36} name="B-time"><Bg src="broll/e7h_stone_texture.mp4" from={3} focus="40% 50%" z={[1.1, 1.2]} darken={0.34} /></Scene>
      <Seq s={9.10} e={13.9} name="B-chips"><ProcessChips items={['Cortada', 'Transportada', 'Encajada']} at={[0, 1.25, 2.5]} y={830} /></Seq>
      <Seq s={14.0} e={16.15} name="B-gap"><GapDim kicker="Precisión de la junta" value="< 1 mm" x={1120} y={320} /></Seq>
      <Seq s={16.30} e={18.30} name="B-time-strip"><TimeStrip label="Hace más de 2.000 años" /></Seq>

      {/* ---- C · 18.36–25.98 · hoy no podríamos ---- */}
      <Scene s={18.36} e={21.8} name="C-crane"><Bg src="broll/e7h_crane_modern.mp4" from={0} focus="50% 45%" z={[1.05, 1.14]} /></Scene>
      <Scene s={21.8} e={25.98} name="C-stone"><Bg src="img/e7h_baalbek_largest.jpg" kind="img" focus="50% 55%" z={[1.12, 1.2]} darken={0.40} /></Scene>
      <Seq s={19.79} e={21.70} name="C-label"><LowerLabel kicker="Tecnología actual" main="Grúa torre de obra" y={110} /></Seq>
      <Seq s={21.90} e={25.90} name="C-bars">
        <CompareBars
          a={{label: 'Grúa torre de obra (carga típica)', val: 16, color: '#7c828b'}}
          b={{label: 'La Piedra de la Embarazada', val: 1000, color: GOLD}}
          unit="t" note="× 62" />
      </Seq>
      <Seq s={23.34} e={25.90} name="C-stamp"><Stamp text="No se puede mover" color={RED} x={1030} y={190} rot={-5} big /></Seq>

      {/* ---- D · 25.98–35.92 · Perú, ni un cuchillo ---- */}
      <Scene s={25.98} e={28.30} name="D-machu"><Bg src="broll/e7h_machu_aerial.mp4" from={0} focus="50% 45%" z={[1.05, 1.14]} darken={0.30} /></Scene>
      <Scene s={28.30} e={31.90} name="D-wall"><Bg src="broll/e7h_inca_wall.mp4" from={1} focus="50% 50%" z={[1.06, 1.16]} /></Scene>
      <Scene s={31.90} e={35.92} name="D-joint"><Bg src="img/e7h_photo_incajoint.jpg" kind="img" focus="58% 48%" z={[1.08, 1.24]} /></Scene>
      <Seq s={25.98} e={28.25} name="D-reticle"><Reticle place="PERÚ · CUSCO" coords="13°31′S  71°58′O" cx={790} cy={470} r={150} /></Seq>
      <Seq s={28.90} e={31.80} name="D-blade"><BladeGauge kicker="La prueba del cuchillo" verdict="No entra" x={1060} y={300} /></Seq>
      <Seq s={32.02} e={33.85} name="D-s1"><Stamp text="Sin cemento" color={CREAM} x={190} y={250} rot={-4} big /></Seq>
      <Seq s={33.93} e={35.85} name="D-s2"><Stamp text="Sin argamasa" color={GOLD} x={980} y={620} rot={3} big /></Seq>

      {/* ---- E · 35.92–44.6 · Egipto, 2 cm ---- */}
      <Scene s={35.92} e={39.20} name="E-giza"><Bg src="broll/e7h_pyramids_giza.mp4" from={0} focus="50% 45%" z={[1.05, 1.14]} /></Scene>
      <Scene s={39.20} e={44.60} name="E-close"><Bg src="broll/e7h_pyramid_close.mp4" from={0} focus="50% 55%" z={[1.06, 1.16]} darken={0.34} /></Scene>
      <Seq s={35.92} e={39.15} name="E-reticle"><Reticle place="EGIPTO · GUIZA" coords="29°58′N  31°08′E" cx={880} cy={480} r={150} /></Seq>
      <Seq s={39.30} e={41.40} name="E-label"><LowerLabel kicker="Gran Pirámide de Guiza" main="230 m de lado" y={110} /></Seq>
      <Seq s={41.60} e={44.50} name="E-level"><LevelBar kicker="Nivelación de toda la base" span="230 m" dev="2,1 cm" y={230} /></Seq>
      <Seq s={41.48} e={44.50} name="E-num"><BigNumber target={2} unit="CM" kicker="Desnivel en toda la base" thousands={false} /></Seq>

      {/* ---- F · 44.6–57.76 · el giro ---- */}
      <Scene s={44.60} e={49.70} name="F-people"><Bg src="broll/e7h_workers_silhou.mp4" from={0} focus="50% 55%" z={[1.05, 1.14]} darken={0.30} /></Scene>
      <Scene s={49.70} e={53.70} name="F-stars"><Bg src="broll/e7h_stars_time.mp4" from={0} focus="50% 40%" z={[1.04, 1.12]} darken={0} vig={0.06} /></Scene>
      <Scene s={53.70} e={57.76} name="F-desert"><Bg src="broll/e7h_desert_ruins.mp4" from={0} focus="50% 50%" z={[1.06, 1.16]} darken={0.36} /></Scene>
      <Seq s={45.35} e={49.60} name="F-k1">
        <Kinetic lines={[
          {at: 0, size: 56, color: SUB, words: [{t: 'LA PREGUNTA YA NO ES'}]},
          {at: 0.5, size: 150, words: [{t: '¿QUIÉN?'}], strikeAt: 3.10},
        ]} />
      </Seq>
      <Seq s={50.20} e={57.70} name="F-k2">
        <Kinetic lines={[
          {at: 0.10, size: 88, words: [{t: '¿POR'}, {t: 'QUÉ'}]},
          {at: 1.86, size: 54, color: SUB, words: [{t: 'CON TODA NUESTRA TECNOLOGÍA'}]},
          {at: 5.17, size: 88, words: [{t: 'NO'}, {t: 'PODEMOS'}, {t: 'REPETIRLAS?', hl: true}]},
        ]} />
      </Seq>

      {/* ---- G · 57.76–65.3 · los 7 + tarjeta de título ---- */}
      <Scene s={57.76} e={59.55} name="G-flash">
        <FlashCards each={0.255} items={[
          {src: 'img/e7h_f1.jpg', label: 'Baalbek · Líbano'},
          {src: 'img/e7h_f2.jpg', label: 'Machu Picchu · Perú'},
          {src: 'img/e7h_f3.jpg', label: 'Guiza · Egipto'},
          {src: 'img/e7h_f4.jpg', label: 'Jerash · Jordania'},
          {src: 'img/e7h_f5.jpg', label: 'Muro inca · Perú'},
          {src: 'img/e7h_f6.jpg', label: 'Bloques de una pirámide'},
          {src: 'img/e7h_f7.jpg', label: 'Ruinas del desierto'},
        ]} />
      </Scene>
      <Scene s={59.55} e={65.3} name="G-title"><Bg src="broll/e7h_temple_columns.mp4" from={2} focus="50% 50%" z={[1.1, 1.02]} darken={0.58} /></Scene>
      <Seq s={59.55} e={65.3} name="G-card"><TitleCard bandAt={3.16} /></Seq>

      <OpenBlack />
      <FilmOverlay />
    </AbsoluteFill>
  );
};
