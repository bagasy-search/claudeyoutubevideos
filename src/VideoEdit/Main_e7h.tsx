// Main_e7h.tsx — HOOK documental "7 Construcciones Antiguas Que Hoy Serían Imposibles de Hacer"
// Estilo Vox editorial premium · faceless · b-roll real + motion graphics · 30fps 1920x1080
// Audio: mezcla única pre-renderizada e7h_mix.wav (narración Qwen3-TTS + música + SFX + ducking).
import React from 'react';
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate,
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

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const clampI = (f: number, a: number, b: number, out: [number, number], easing?: any) =>
  interpolate(f, [a, b], out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

// ---------- helpers de secuencia ----------
const Seq: React.FC<{s: number; e: number; name?: string; children: React.ReactNode}> = ({s, e, name, children}) => (
  <Sequence from={F(s)} durationInFrames={Math.max(1, F(e - s))} name={name} layout="none">
    {children}
  </Sequence>
);

// ---------- fondo (clip o imagen) con Ken-Burns y corte limpio ----------
const Bg: React.FC<{
  src: string; kind?: 'img' | 'clip'; focus?: string; z?: [number, number]; from?: number; darken?: number;
}> = ({src, kind = 'clip', focus = '50% 50%', z = [1.06, 1.14], from = 0, darken = 0.28}) => {
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
      <AbsoluteFill style={{background: `radial-gradient(120% 100% at 50% 42%, transparent 40%, rgba(0,0,0,${darken + 0.18}) 100%)`}} />
      <AbsoluteFill style={{background: `rgba(6,7,9,${darken})`}} />
    </AbsoluteFill>
  );
};
// pequeño hook para leer la duración de la Sequence actual
const SeqDurCtx = React.createContext(1);
const useCurrentSeqDur = () => ({durationInFrames: React.useContext(SeqDurCtx)});

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
    <div style={{position: 'absolute', left: 130, bottom: 150, opacity: appear, transform: `translateY(${(1 - appear) * 30}px)`}}>
      <div style={{font: `600 30px ${OSWALD}`, letterSpacing: 6, color: GOLD, textTransform: 'uppercase', marginBottom: -6}}>{kicker}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
        <div style={{font: `400 200px ${ANTON}`, lineHeight: 0.9, color: CREAM, transform: `scale(${scale})`, transformOrigin: 'left bottom', textShadow: '0 8px 40px rgba(0,0,0,.6)'}}>{num}</div>
        <div style={{font: `400 64px ${ANTON}`, color: GOLD, letterSpacing: 2}}>{unit}</div>
      </div>
    </div>
  );
};

// lower-third label (tab dorado + texto)
const LowerLabel: React.FC<{kicker?: string; main: string; y?: number}> = ({kicker, main, y = 900}) => {
  const f = useCurrentFrame();
  const w = clampI(f, 0, 12, [0, 1], EXPO);
  const out = clampI(f, 0, 6, [0, 1], EXPO);
  return (
    <div style={{position: 'absolute', left: 130, top: y, opacity: out, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 6, height: 54, background: GOLD, transform: `scaleY(${w})`, transformOrigin: 'top'}} />
      <div style={{overflow: 'hidden'}}>
        {kicker && <div style={{font: `600 20px ${OSWALD}`, letterSpacing: 5, color: GOLD, textTransform: 'uppercase'}}>{kicker}</div>}
        <div style={{font: `500 40px ${OSWALD}`, color: CREAM, textTransform: 'uppercase', letterSpacing: 1, transform: `translateY(${(1 - w) * 46}px)`}}>{main}</div>
      </div>
    </div>
  );
};

// reticle localizador (coordenadas + país) — estilo inteligencia/Vox
const Reticle: React.FC<{place: string; coords: string; cx?: number; cy?: number}> = ({place, coords, cx = 960, cy = 470}) => {
  const f = useCurrentFrame();
  const ring = clampI(f, 0, 18, [0, 1], EXPO);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const R = 70 * ring;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: app}}>
      <g stroke={GOLD} fill="none" strokeWidth={2}>
        <circle cx={cx} cy={cy} r={R} opacity={0.9} />
        <circle cx={cx} cy={cy} r={R + 22 + pulse * 20} opacity={0.25 * (1 - ring * 0.2)} />
        <line x1={cx - R - 18} y1={cy} x2={cx - R + 8} y2={cy} />
        <line x1={cx + R - 8} y1={cy} x2={cx + R + 18} y2={cy} />
        <line x1={cx} y1={cy - R - 18} x2={cx} y2={cy - R + 8} />
        <line x1={cx} y1={cy + R - 8} x2={cx} y2={cy + R + 18} />
      </g>
      <circle cx={cx} cy={cy} r={4} fill={GOLD} />
      <g transform={`translate(${cx + R + 34},${cy - 18})`} opacity={clampI(f, 8, 18, [0, 1])}>
        <text style={{font: `600 30px ${OSWALD}`, letterSpacing: 3}} fill={CREAM}>{place}</text>
        <text y={30} style={{font: `500 22px ${INTER}`, letterSpacing: 2}} fill={GOLD}>{coords}</text>
      </g>
    </svg>
  );
};

// estampa que golpea (SIN CEMENTO / IMPOSIBLE)
const Stamp: React.FC<{text: string; color?: string; x: number; y: number; rot?: number; big?: boolean}> =
({text, color = CREAM, x, y, rot = -4, big = false}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 5, 10], [1.6, 0.94, 1], {extrapolateRight: 'clamp', easing: EXPO});
  const o = clampI(f, 0, 6, [0, 1], EXPO);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${s})`, opacity: o,
      border: `4px solid ${color}`, padding: big ? '10px 26px' : '6px 18px', background: 'rgba(0,0,0,.28)'}}>
      <span style={{font: `400 ${big ? 70 : 40}px ${ANTON}`, color, letterSpacing: 3, textTransform: 'uppercase'}}>{text}</span>
    </div>
  );
};

// callout con flecha dibujada apuntando a un detalle
const Callout: React.FC<{text: string; sub?: string; px: number; py: number; lx: number; ly: number; color?: string}> =
({text, sub, px, py, lx, ly, color = GOLD}) => {
  const f = useCurrentFrame();
  const draw = clampI(f, 0, 14, [0, 1], EXPO);
  const app = clampI(f, 6, 16, [0, 1], EXPO);
  const mx = (px + lx) / 2 + (py < ly ? -40 : 40);
  const my = (py + ly) / 2 - 40;
  const path = `M ${lx} ${ly} Q ${mx} ${my} ${px} ${py}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <marker id="ah" markerWidth="12" markerHeight="12" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={color} />
        </marker>
      </defs>
      <path d={path} stroke={color} strokeWidth={3} fill="none" markerEnd="url(#ah)"
        strokeDasharray={600} strokeDashoffset={600 * (1 - draw)} />
      <g transform={`translate(${lx},${ly - 8})`} opacity={app} textAnchor={lx > 960 ? 'end' : 'start'}>
        <text style={{font: `600 34px ${OSWALD}`, letterSpacing: 1}} fill={CREAM}>{text}</text>
        {sub && <text y={30} style={{font: `500 22px ${INTER}`}} fill={color}>{sub}</text>}
      </g>
    </svg>
  );
};

// línea de tiempo que retrocede en el tiempo
const TimeStrip: React.FC<{label: string}> = ({label}) => {
  const f = useCurrentFrame();
  const grow = clampI(f, 0, 18, [0, 1], EXPO);
  const marker = clampI(f, 6, 28, [1740, 300], EXPO);
  const app = clampI(f, 0, 8, [0, 1]);
  return (
    <div style={{position: 'absolute', left: 130, bottom: 150, width: 1660, opacity: app}}>
      <div style={{font: `600 26px ${OSWALD}`, letterSpacing: 4, color: GOLD, marginBottom: 14}}>{label}</div>
      <svg width={1660} height={40}>
        <line x1={0} y1={20} x2={1660 * grow} y2={20} stroke={CREAM} strokeWidth={2} />
        {Array.from({length: 12}).map((_, i) => (
          <line key={i} x1={i * 150} y1={12} x2={i * 150} y2={28} stroke={SUB} strokeWidth={1} opacity={grow} />
        ))}
        <circle cx={marker} cy={20} r={8} fill={GOLD} />
      </svg>
    </div>
  );
};

// headline cinético palabra por palabra con resaltado
const Kinetic: React.FC<{lines: {t: string; hl?: boolean; strike?: boolean}[][]; center?: boolean}> = ({lines, center = true}) => {
  const f = useCurrentFrame();
  let idx = 0;
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: center ? 'center' : 'flex-start', paddingLeft: center ? 0 : 130, gap: 6}}>
      {lines.map((words, li) => (
        <div key={li} style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start'}}>
          {words.map((w, wi) => {
            const start = idx * 3.2; idx++;
            const o = clampI(f, start, start + 8, [0, 1], EXPO);
            const y = clampI(f, start, start + 10, [26, 0], EXPO);
            const strikeP = w.strike ? clampI(f, start + 10, start + 22, [0, 1], EXPO) : 0;
            return (
              <span key={wi} style={{position: 'relative', opacity: o, transform: `translateY(${y}px)`,
                font: `400 ${w.hl ? 84 : 78}px ${ANTON}`, color: w.hl ? INK : CREAM,
                background: w.hl ? GOLD : 'transparent', padding: w.hl ? '2px 16px' : 0,
                letterSpacing: 1, textShadow: w.hl ? 'none' : '0 6px 30px rgba(0,0,0,.6)'}}>
                {w.t}
                {w.strike && <span style={{position: 'absolute', left: 0, top: '54%', height: 7, width: `${strikeP * 100}%`, background: RED}} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// comparación de dos barras (grúa vs piedra)
const CompareBars: React.FC<{a: {label: string; val: number; color: string}; b: {label: string; val: number; color: string}; unit: string}> =
({a, b, unit}) => {
  const f = useCurrentFrame();
  const max = Math.max(a.val, b.val);
  const app = clampI(f, 0, 10, [0, 1], EXPO);
  const row = (d: {label: string; val: number; color: string}, i: number) => {
    const g = clampI(f, 4 + i * 5, 24 + i * 5, [0, d.val / max], EXPO);
    return (
      <div key={i} style={{marginBottom: 26}}>
        <div style={{font: `500 26px ${OSWALD}`, color: CREAM, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase'}}>{d.label}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{height: 34, width: 900 * g, background: d.color}} />
          <div style={{font: `400 34px ${ANTON}`, color: d.color}}>{Math.round(d.val).toLocaleString('es-ES')} {unit}</div>
        </div>
      </div>
    );
  };
  return <div style={{position: 'absolute', left: 130, bottom: 150, opacity: app}}>{row(a, 0)}{row(b, 1)}</div>;
};

// flash montage — cortes rápidos
const Flash: React.FC<{items: {src: string; kind?: 'img' | 'clip'}[]; each: number}> = ({items, each}) => {
  const f = useCurrentFrame();
  const i = Math.min(items.length - 1, Math.floor(f / F(each)));
  const it = items[i];
  const local = f - i * F(each);
  const s = interpolate(local, [0, F(each)], [1.14, 1.02]);
  const style: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`};
  return (
    <AbsoluteFill>
      {it.kind === 'img'
        ? <Img src={staticFile(it.src)} style={style} />
        : <Video src={staticFile(it.src)} startFrom={10} muted style={style} />}
      <AbsoluteFill style={{background: 'rgba(6,7,9,.34)'}} />
    </AbsoluteFill>
  );
};

// título final
const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  const seven = interpolate(f, [0, 8, 16], [2.4, 0.95, 1], {extrapolateRight: 'clamp', easing: EXPO});
  const so = clampI(f, 0, 8, [0, 1], EXPO);
  const l1 = clampI(f, 6, 16, [0, 1], EXPO);
  const l2o = clampI(f, 22, 32, [0, 1], EXPO);
  const l2s = interpolate(f, [22, 30], [1.15, 1], {extrapolateRight: 'clamp', easing: EXPO});
  return (
    <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{font: `400 240px ${ANTON}`, color: GOLD, lineHeight: 0.8, opacity: so, transform: `scale(${seven})`, textShadow: '0 10px 50px rgba(0,0,0,.7)'}}>7</div>
        <div style={{font: `500 78px ${OSWALD}`, color: CREAM, letterSpacing: 3, opacity: l1, transform: `translateX(${(1 - l1) * -30}px)`, textTransform: 'uppercase', maxWidth: 780, lineHeight: 1.0}}>Construcciones<br />Antiguas</div>
      </div>
      <div style={{marginTop: 22, opacity: l2o, transform: `scale(${l2s})`, background: GOLD, padding: '8px 26px'}}>
        <span style={{font: `400 56px ${ANTON}`, color: INK, letterSpacing: 2, textTransform: 'uppercase'}}>Que hoy serían imposibles</span>
      </div>
    </AbsoluteFill>
  );
};

// grano + viñeta + barras (siempre arriba)
const FilmOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const seed = f % 12;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{boxShadow: 'inset 0 0 320px 60px rgba(0,0,0,0.75)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'overlay'}}>
        <filter id={`g${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" /></filter>
        <rect width="1920" height="1080" filter={`url(#g${seed})`} />
      </svg>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 34, background: INK}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 34, background: INK}} />
    </AbsoluteFill>
  );
};

// wrapper que provee la duración de la Sequence al contexto (para Ken-Burns)
const Scene: React.FC<{s: number; e: number; children: React.ReactNode; name?: string}> = ({s, e, children, name}) => (
  <Sequence from={F(s)} durationInFrames={Math.max(1, F(e - s))} name={name} layout="none">
    <SeqDurCtx.Provider value={Math.max(1, F(e - s))}>{children}</SeqDurCtx.Provider>
  </Sequence>
);

// apertura desde negro
const OpenBlack: React.FC = () => {
  const f = useCurrentFrame();
  const o = clampI(f, 0, 16, [1, 0]);
  return <AbsoluteFill style={{background: INK, opacity: o, pointerEvents: 'none'}} />;
};

// ============================ COMPOSICIÓN ============================
export const MainE7h: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: INK}}>
      <Audio src={staticFile('e7h_mix.wav')} />

      {/* ---- A · 0.0–9.1 · la piedra de mil toneladas ---- */}
      <Scene s={0} e={4.1} name="A-baalbek"><Bg src="img/e7h_baalbek_largest.jpg" kind="img" focus="52% 58%" z={[1.05, 1.2]} darken={0.24} /></Scene>
      <Scene s={4.1} e={9.1} name="A-mega"><Bg src="broll/e7h_stone_texture.mp4" from={0} focus="50% 50%" z={[1.08, 1.18]} /></Scene>
      <Seq s={1.6} e={9.0}><BigNumber target={1000} unit="TON" kicker="Peso de un solo bloque" /></Seq>
      <Seq s={2.2} e={4.1}><LowerLabel kicker="Baalbek · Líbano" main="La Piedra de la Embarazada" y={780} /></Seq>
      <Seq s={4.15} e={8.9}><Stamp text="≈ 3 aviones de pasajeros" color={GOLD} x={1120} y={250} rot={-3} /></Seq>

      {/* ---- B · 9.1–18.36 · cortada con precisión ---- */}
      <Scene s={9.1} e={11.7} name="B-chisel"><Bg src="broll/e7h_chisel_tool.mp4" from={1} focus="50% 50%" z={[1.05, 1.15]} /></Scene>
      <Scene s={11.7} e={14.0} name="B-block"><Bg src="broll/e7h_quarry_block.mp4" from={0} focus="50% 55%" z={[1.06, 1.16]} /></Scene>
      <Scene s={14.0} e={16.1} name="B-joint"><Bg src="img/e7h_photo_incajoint.jpg" kind="img" focus="50% 50%" z={[1.06, 1.22]} /></Scene>
      <Scene s={16.1} e={18.36} name="B-time"><Bg src="broll/e7h_stone_texture.mp4" from={3} focus="40% 50%" z={[1.1, 1.2]} /></Scene>
      <Seq s={9.2} e={11.6}><LowerLabel kicker="Proceso" main="Cortada a mano" y={820} /></Seq>
      <Seq s={14.0} e={16.05}><Callout text="Juntas sin argamasa" sub="menos de 1 mm" px={1080} py={560} lx={430} ly={300} /></Seq>
      <Seq s={16.15} e={18.3}><TimeStrip label="Hace más de 2.000 años" /></Seq>

      {/* ---- C · 18.36–25.98 · hoy no podríamos ---- */}
      <Scene s={18.36} e={21.6} name="C-crane"><Bg src="broll/e7h_crane_modern.mp4" from={0} focus="50% 45%" z={[1.05, 1.14]} /></Scene>
      <Scene s={21.6} e={25.98} name="C-stone"><Bg src="img/e7h_baalbek_largest.jpg" kind="img" focus="50% 55%" z={[1.12, 1.2]} darken={0.34} /></Scene>
      <Seq s={18.5} e={21.5}><LowerLabel kicker="Tecnología actual" main="Las grúas más potentes" y={820} /></Seq>
      <Seq s={21.7} e={25.9}><CompareBars a={{label: 'La piedra', val: 1000, color: GOLD}} b={{label: 'Grúa móvil más grande', val: 1200, color: '#6b6f76'}} unit="t" /></Seq>
      <Seq s={23.2} e={25.95}><Stamp text="No se puede mover" color={RED} x={1080} y={230} rot={-5} big /></Seq>

      {/* ---- D · 25.98–35.92 · Perú, ni un cuchillo ---- */}
      <Scene s={25.98} e={28.1} name="D-machu"><Bg src="broll/e7h_machu_aerial.mp4" from={0} focus="50% 45%" z={[1.05, 1.14]} /></Scene>
      <Scene s={28.1} e={31.6} name="D-wall"><Bg src="broll/e7h_inca_wall.mp4" from={1} focus="50% 50%" z={[1.06, 1.16]} /></Scene>
      <Scene s={31.6} e={35.92} name="D-joint"><Bg src="img/e7h_photo_incajoint.jpg" kind="img" focus="52% 48%" z={[1.08, 1.24]} /></Scene>
      <Seq s={26.0} e={28.05}><Reticle place="PERÚ · CUSCO" coords="13°31′S  71°58′O" cx={880} cy={450} /></Seq>
      <Seq s={28.6} e={31.5}><Callout text="Ni la hoja de un cuchillo" sub="0 mm de holgura" px={980} py={520} lx={1500} ly={300} /></Seq>
      <Seq s={31.9} e={33.7}><Stamp text="Sin cemento" color={CREAM} x={200} y={300} rot={-4} big /></Seq>
      <Seq s={33.7} e={35.85}><Stamp text="Sin argamasa" color={GOLD} x={1050} y={640} rot={3} big /></Seq>

      {/* ---- E · 35.92–44.6 · Egipto, 2 cm ---- */}
      <Scene s={35.92} e={39.0} name="E-giza"><Bg src="broll/e7h_pyramids_giza.mp4" from={0} focus="50% 45%" z={[1.05, 1.14]} /></Scene>
      <Scene s={39.0} e={44.6} name="E-close"><Bg src="broll/e7h_pyramid_close.mp4" from={0} focus="50% 55%" z={[1.06, 1.16]} /></Scene>
      <Seq s={35.94} e={39.0}><Reticle place="EGIPTO · GUIZA" coords="29°58′N  31°08′O" cx={980} cy={470} /></Seq>
      <Seq s={39.1} e={41.3}><LowerLabel kicker="Gran Pirámide de Guiza" main="Base de 13 hectáreas" y={820} /></Seq>
      <Seq s={41.3} e={44.55}><BigNumber target={2} unit="CM" kicker="Error de nivelación en toda la base" thousands={false} /></Seq>

      {/* ---- F · 44.6–57.76 · el giro ---- */}
      <Scene s={44.6} e={49.6} name="F-people"><Bg src="broll/e7h_workers_silhou.mp4" from={0} focus="50% 55%" z={[1.05, 1.14]} darken={0.34} /></Scene>
      <Scene s={49.6} e={53.6} name="F-stars"><Bg src="broll/e7h_stars_time.mp4" from={0} focus="50% 40%" z={[1.04, 1.12]} darken={0.2} /></Scene>
      <Scene s={53.6} e={57.76} name="F-desert"><Bg src="broll/e7h_desert_ruins.mp4" from={0} focus="50% 50%" z={[1.06, 1.16]} darken={0.4} /></Scene>
      <Seq s={45.0} e={49.5}><Kinetic lines={[[{t: 'La', }, {t: 'pregunta'}], [{t: 'ya', }, {t: 'no', }, {t: 'es', }, {t: '¿QUIÉN?', hl: false, strike: true}]]} /></Seq>
      <Seq s={50.2} e={57.7}><Kinetic lines={[[{t: '¿POR'}, {t: 'QUÉ'}, {t: 'NO'}, {t: 'PODEMOS', hl: true}], [{t: 'REPETIRLAS?'}]]} /></Seq>

      {/* ---- G · 57.76–64.3 · título ---- */}
      <Scene s={57.76} e={59.5} name="G-flash">
        <Flash each={0.28} items={[
          {src: 'img/e7h_baalbek_largest.jpg', kind: 'img'},
          {src: 'broll/e7h_inca_wall.mp4'},
          {src: 'broll/e7h_pyramids_giza.mp4'},
          {src: 'broll/e7h_temple_columns.mp4'},
          {src: 'broll/e7h_machu_aerial.mp4'},
          {src: 'broll/e7h_stone_texture.mp4'},
        ]} />
      </Scene>
      <Scene s={59.5} e={65.3} name="G-title"><Bg src="broll/e7h_temple_columns.mp4" from={2} focus="50% 50%" z={[1.1, 1.02]} darken={0.55} /></Scene>
      <Seq s={59.5} e={65.3}><TitleCard /></Seq>

      <OpenBlack />
      <FilmOverlay />
    </AbsoluteFill>
  );
};
