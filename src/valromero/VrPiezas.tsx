/**
 * VrPiezas.tsx — valromero · Doctora Valeria Alcázar · "El Romero: 3 Remedios en Uno"
 * SET-PIECES propios del look EDITORIAL VINTAGE CLARO (papel crema · tinta espresso · latón).
 * Todos: cama de FOTO REAL desenfocada con parallax + tarjeta de papel + serif cinética + acento latón/callout.
 * ⛔ Ningún texto por defecto: todo texto llega por props (el build valida que no falte).
 * Tiempos (`ats`, `flipAt`, `stampAt`, `focus[].at`) en SEGUNDOS relativos al inicio del componente.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {VAL, FONT_DISPLAY, FONT_SERIF, FONT_SERIF_FINE, FONT_HAND, FONT_SANS, CLAMP, rgba, shade, CARD_SHADOW, PaperGrain, WarmVignette} from '../valeria/theme';

const sf = (p?: string) => (p ? (/^https?:|^\//.test(p) ? p : staticFile(p)) : undefined);
const eOut = Easing.out(Easing.cubic);
const ramp = (f: number, a: number, b: number, ease = eOut) => interpolate(f, [a, b], [0, 1], {...CLAMP, easing: ease});

/* ───────────── primitivas ───────────── */

/** Envoltura: entra por zoom-through con desenfoque y sale igual (nada de fundido a negro). */
const Shell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const a = ramp(frame, 0, 10);
  const b = 1 - ramp(frame, d - 8, d, Easing.in(Easing.cubic));
  const k = Math.min(a, b);
  const s = frame < d / 2 ? 1.08 - 0.08 * a : 1 + 0.05 * (1 - b);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, k * 1.5), transform: `scale(${s.toFixed(4)})`, filter: k < 0.999 ? `blur(${((1 - k) * 12).toFixed(2)}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

/** Cámara viva: push lento + deriva de mano + golpe en los hits (frames). */
const useCam = (hits: number[] = []) => {
  const frame = useCurrentFrame();
  const {durationInFrames: d, fps} = useVideoConfig();
  const push = interpolate(frame, [0, d], [1, 1.045], CLAMP);
  let punch = 0;
  for (const h of hits) { const t = frame - h; if (t >= 0 && t < 10) punch += Math.sin((t / 10) * Math.PI) * 0.014; }
  return {scale: push + punch, x: Math.sin(frame / fps * 0.5) * 10, y: Math.cos(frame / fps * 0.37) * 6};
};

/** Cama: foto real desenfocada con parallax + lavado crema + motas + grano + viñeta. */
const Bed: React.FC<{img?: string; camX: number; camY: number; wash?: number; blur?: number}> = ({img, camX, camY, wash = 0.62, blur = 16}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: VAL.paper, overflow: 'hidden'}}>
      {img ? (
        <Img src={sf(img)!} style={{position: 'absolute', inset: -60, width: 'calc(100% + 120px)', height: 'calc(100% + 120px)', objectFit: 'cover', filter: `blur(${blur}px) saturate(0.85)`, transform: `translate(${(-camX * 0.5).toFixed(1)}px, ${(-camY * 0.5).toFixed(1)}px) scale(${(1.08 + frame * 0.0002).toFixed(4)})`}} />
      ) : null}
      <AbsoluteFill style={{background: `radial-gradient(110% 95% at 50% 45%, ${rgba(VAL.paper, wash * 0.75)} 0%, ${rgba(VAL.paperWarm, wash)} 60%, ${rgba(VAL.paperDeep, Math.min(1, wash + 0.2))} 100%)`}} />
      {Array.from({length: 10}).map((_, i) => {
        const x = (i * 37.3 + frame * (0.02 + (i % 3) * 0.01)) % 100;
        const y = (i * 23.7 + 100 - frame * (0.03 + (i % 4) * 0.012)) % 100;
        const s = 60 + (i * 47) % 140;
        return <div key={i} style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: '50%', background: `radial-gradient(circle, ${rgba(VAL.goldLite, 0.16)} 0%, transparent 70%)`, transform: `translate(${(camX * 0.8).toFixed(1)}px, 0)`}} />;
      })}
      <PaperGrain opacity={0.07} />
      <WarmVignette strength={0.2} />
    </AbsoluteFill>
  );
};

const Card: React.FC<{w: number | string; h?: number | string; pad?: number; tilt?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({w, h, pad = 48, tilt = 0, style, children}) => (
  <div style={{width: w, height: h, padding: pad, background: VAL.card, border: `1.5px solid ${VAL.cardEdge}`, borderRadius: 18, boxShadow: CARD_SHADOW, position: 'relative', transform: `rotate(${tilt}deg)`, boxSizing: 'border-box', ...style}}>
    <PaperGrain opacity={0.05} />
    <div style={{position: 'absolute', inset: 12, border: `1px solid ${rgba(VAL.gold, 0.35)}`, borderRadius: 12, pointerEvents: 'none'}} />
    {children}
  </div>
);

const KickerLine: React.FC<{text: string; a: number; color?: string; center?: boolean}> = ({text, a, color = VAL.goldDark, center}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, justifyContent: center ? 'center' : 'flex-start', opacity: a}}>
    <div style={{width: 70 * a, height: 3, background: VAL.gold}} />
    <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 26, letterSpacing: 6, textTransform: 'uppercase', color}}>{text}</div>
    {center ? <div style={{width: 70 * a, height: 3, background: VAL.gold}} /> : null}
  </div>
);

/** Foto enmarcada tipo polaroid con cinta. */
const Polaroid: React.FC<{img?: string; w: number; h: number; tilt?: number; push?: number; desat?: number; children?: React.ReactNode}> = ({img, w, h, tilt = -3, push = 0, desat = 0, children}) => (
  <div style={{width: w + 36, padding: '18px 18px 54px', background: '#FFFDF7', boxShadow: CARD_SHADOW, transform: `rotate(${tilt}deg)`, position: 'relative'}}>
    <div style={{width: w, height: h, overflow: 'hidden', position: 'relative', background: VAL.paperDeep}}>
      {img ? <Img src={sf(img)!} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${(1.03 + push).toFixed(4)})`, filter: `saturate(${1 - desat})`}} /> : null}
      {children}
    </div>
    <div style={{position: 'absolute', top: -16, left: '50%', width: 150, height: 38, marginLeft: -75, background: rgba(VAL.goldLite, 0.55), transform: 'rotate(-4deg)', boxShadow: `0 2px 6px ${rgba(VAL.ink, 0.12)}`}} />
  </div>
);

const Hand: React.FC<{text: string; a: number; size?: number; color?: string; rot?: number}> = ({text, a, size = 54, color = VAL.terracotta, rot = -4}) => (
  <div style={{fontFamily: FONT_HAND, fontSize: size, color, opacity: a, transform: `rotate(${rot}deg) translateY(${(1 - a) * 14}px)`, whiteSpace: 'nowrap'}}>{text}</div>
);

/** Subrayado dibujado a mano (SVG) que se traza con u∈[0,1]. */
const Scribble: React.FC<{u: number; w: number; color?: string}> = ({u, w, color = VAL.gold}) => (
  <svg width={w} height={24} viewBox={`0 0 ${w} 24`} style={{display: 'block', overflow: 'visible'}}>
    <path d={`M4 14 C ${w * 0.25} 4, ${w * 0.5} 22, ${w * 0.75} 10 S ${w - 10} 12, ${w - 4} 8`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
  </svg>
);

const useF = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return {frame, fps, d: durationInFrames, S: (s: number) => Math.round(s * fps)};
};

/* ───────────── 1 · RECETA (ficha con medidas) ───────────── */
export const VrRecipe: React.FC<{kicker: string; title: string; items: {amt: string; what: string}[]; ats: number[]; image: string; note?: string}> = ({kicker, title, items, ats, image, note}) => {
  const {frame, fps, S} = useF();
  const cam = useCam(ats.map(S));
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`}}>
        <div style={{position: 'absolute', left: 120, top: 190, transform: `translateY(${(1 - spring({frame: frame - 4, fps, config: {damping: 16}})) * 80}px)`}}>
          <Polaroid img={image} w={640} h={640} tilt={-4} push={frame * 0.0003} />
        </div>
        <div style={{position: 'absolute', right: 110, top: 120, opacity: ramp(frame, 6, 18)}}>
          <Card w={960} pad={56} tilt={1}>
            <KickerLine text={kicker} a={ramp(frame, 8, 22)} />
            <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 70, lineHeight: 1.05, color: VAL.ink, marginTop: 18}}>{title}</div>
            <Scribble u={ramp(frame, 18, 36)} w={420} />
            <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18}}>
              {items.map((it, i) => {
                const k = spring({frame: frame - S(ats[i] ?? 0.6 + i * 0.6), fps, config: {damping: 14, mass: 0.7}});
                return (
                  <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 26, opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * 60}px)`, borderBottom: `1px dashed ${rgba(VAL.gold, 0.5)}`, paddingBottom: 12}}>
                    <div style={{minWidth: 58, height: 58, borderRadius: 29, background: VAL.gold, color: VAL.onAccent, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>{i + 1}</div>
                    <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 50, color: VAL.goldDark, whiteSpace: 'nowrap'}}>{it.amt}</div>
                    <div style={{fontFamily: FONT_SERIF, fontSize: 42, color: VAL.ink, lineHeight: 1.1}}>{it.what}</div>
                  </div>
                );
              })}
            </div>
            {note ? <div style={{marginTop: 22}}><Hand text={note} a={ramp(frame, S((ats[ats.length - 1] ?? 2) + 0.6), S((ats[ats.length - 1] ?? 2) + 1.1))} size={50} /></div> : null}
          </Card>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 2 · RELOJ de cocina (minutos / días) ───────────── */
export const VrDial: React.FC<{kicker: string; value: number; max: number; unit: string; label: string; image: string; note?: string}> = ({kicker, value, max, unit, label, image, note}) => {
  const {frame, fps, S} = useF();
  const cam = useCam([S(1.6)]);
  const u = ramp(frame, S(0.4), S(1.6), Easing.inOut(Easing.cubic));
  const n = Math.round(value * u);
  const R = 230, C = 2 * Math.PI * R;
  const arc = (value / max) * u;
  const land = spring({frame: frame - S(1.6), fps, config: {damping: 10, mass: 0.6}});
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} wash={0.55} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 120}}>
        <div style={{position: 'relative', width: 600, height: 600, transform: `scale(${0.9 + 0.1 * spring({frame: frame - 2, fps, config: {damping: 15}})})`}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: VAL.card, boxShadow: CARD_SHADOW, border: `10px solid ${VAL.goldLite}`}} />
          <svg width={600} height={600} style={{position: 'absolute', inset: 0}}>
            {Array.from({length: 60}).map((_, i) => {
              const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
              const r1 = i % 5 === 0 ? 250 : 262;
              return <line key={i} x1={300 + Math.cos(a) * r1} y1={300 + Math.sin(a) * r1} x2={300 + Math.cos(a) * 272} y2={300 + Math.sin(a) * 272} stroke={rgba(VAL.ink, i % 5 === 0 ? 0.55 : 0.25)} strokeWidth={i % 5 === 0 ? 4 : 2} />;
            })}
            <circle cx={300} cy={300} r={R} fill="none" stroke={rgba(VAL.gold, 0.18)} strokeWidth={34} />
            <circle cx={300} cy={300} r={R} fill="none" stroke={VAL.gold} strokeWidth={34} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - arc)} transform="rotate(-90 300 300)" />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 210, lineHeight: 1, color: VAL.ink, transform: `scale(${1 + (1 - land) * 0.12})`}}>{n}</div>
            <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: VAL.goldDark, textTransform: 'uppercase'}}>{unit}</div>
          </div>
        </div>
        <div style={{width: 760}}>
          <KickerLine text={kicker} a={ramp(frame, 6, 20)} />
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 78, lineHeight: 1.05, color: VAL.ink, marginTop: 20, opacity: ramp(frame, 10, 24), transform: `translateY(${(1 - ramp(frame, 10, 24)) * 30}px)`}}>{label}</div>
          {note ? <div style={{marginTop: 30}}><Hand text={note} a={ramp(frame, S(1.9), S(2.4))} size={62} /></div> : null}
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 3 · GOTAS (dosis) ───────────── */
export const VrDrops: React.FC<{kicker: string; title: string; count: number; image: string; note?: string}> = ({kicker, title, count, image, note}) => {
  const {frame, fps, S} = useF();
  const cam = useCam(Array.from({length: count}, (_, i) => S(0.9 + i * 0.55) + 12));
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`}}>
        <div style={{position: 'absolute', left: 150, top: 150}}>
          <Polaroid img={image} w={760} h={700} tilt={-2} push={frame * 0.0003}>
            {Array.from({length: count}).map((_, i) => {
              const t0 = S(0.9 + i * 0.55);
              const fall = ramp(frame, t0, t0 + 12, Easing.in(Easing.quad));
              const splash = ramp(frame, t0 + 12, t0 + 26);
              const x = 300 + (i - (count - 1) / 2) * 120;
              return (
                <React.Fragment key={i}>
                  {frame >= t0 && frame < t0 + 13 ? <div style={{position: 'absolute', left: x - 18, top: -40 + fall * 380, width: 36, height: 50, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: `linear-gradient(160deg, ${shade(VAL.goldLite, 0.5)}, ${VAL.gold})`, boxShadow: `0 4px 10px ${rgba(VAL.ink, 0.3)}`}} /> : null}
                  {frame >= t0 + 12 ? <div style={{position: 'absolute', left: x - 60 * splash, top: 360 - 22 * splash, width: 120 * splash, height: 44 * splash, borderRadius: '50%', border: `3px solid ${rgba(VAL.goldLite, 1 - splash * 0.6)}`, background: rgba(VAL.goldLite, 0.35)}} /> : null}
                </React.Fragment>
              );
            })}
          </Polaroid>
        </div>
        <div style={{position: 'absolute', right: 130, top: 260, width: 820}}>
          <Card w={820} pad={60} tilt={1.5}>
            <KickerLine text={kicker} a={ramp(frame, 6, 20)} />
            <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 14}}>
              <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 180, lineHeight: 1, color: VAL.goldDark}}>{Math.min(count, Math.max(0, Math.floor((frame - S(0.9)) / S(0.55)) + 1))}</div>
              <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: VAL.ink2}}>GOTAS</div>
            </div>
            <div style={{fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1.08, color: VAL.ink, opacity: ramp(frame, 12, 26)}}>{title}</div>
            {note ? <div style={{marginTop: 22}}><Hand text={note} a={ramp(frame, S(0.9 + count * 0.55 + 0.3), S(0.9 + count * 0.55 + 0.8))} size={58} /></div> : null}
          </Card>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 4 · ERROR (sello + tachado) ───────────── */
export const VrError: React.FC<{index: string; kicker: string; title: string; image: string; hitAt?: number}> = ({index, kicker, title, image, hitAt = 0.9}) => {
  const {frame, fps, S} = useF();
  const cam = useCam([S(hitAt)]);
  const slash = ramp(frame, S(hitAt), S(hitAt) + 10);
  const stamp = spring({frame: frame - S(hitAt) - 6, fps, config: {damping: 9, mass: 0.5}});
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} wash={0.58} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`}}>
        <div style={{position: 'absolute', right: 150, top: 170}}>
          <Polaroid img={image} w={760} h={600} tilt={3} desat={0.35 * slash}>
            <svg width={760} height={600} style={{position: 'absolute', inset: 0}}>
              <path d="M70 70 L690 530" stroke={VAL.terracotta} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - slash} />
              <path d="M690 70 L70 530" stroke={VAL.terracotta} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(frame, S(hitAt) + 5, S(hitAt) + 15)} />
            </svg>
          </Polaroid>
        </div>
        <div style={{position: 'absolute', left: 140, top: 250, width: 820}}>
          <KickerLine text={kicker} a={ramp(frame, 4, 18)} color={VAL.terracotta} />
          <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 20, opacity: ramp(frame, 6, 18)}}>
            <div style={{fontFamily: FONT_SANS, fontWeight: 800, fontSize: 64, letterSpacing: 10, color: VAL.terracotta}}>ERROR</div>
            <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 170, lineHeight: 0.9, color: VAL.terracotta}}>{index}</div>
          </div>
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 80, lineHeight: 1.05, color: VAL.ink, marginTop: 20, opacity: ramp(frame, 12, 26), transform: `translateY(${(1 - ramp(frame, 12, 26)) * 30}px)`}}>{title}</div>
          <div style={{marginTop: 34, display: 'inline-block', padding: '10px 28px', border: `5px solid ${VAL.terracotta}`, borderRadius: 10, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: VAL.terracotta, transform: `rotate(-7deg) scale(${(2.2 - 1.2 * stamp).toFixed(3)})`, opacity: Math.min(1, stamp * 2)}}>EVÍTELO</div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 5 · MITO → VERDAD ───────────── */
export const VrMyth: React.FC<{kicker: string; myth: string; truth: string; image: string; flipAt: number}> = ({kicker, myth, truth, image, flipAt}) => {
  const {frame, fps, S} = useF();
  const cam = useCam([S(flipAt)]);
  const strike = ramp(frame, S(flipAt) - 8, S(flipAt));
  const flip = spring({frame: frame - S(flipAt), fps, config: {damping: 16, mass: 0.8}});
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`, perspective: 1800}}>
        <div style={{position: 'absolute', left: 160, top: 200, transform: `rotate(-3deg) translateY(${flip * 40}px) scale(${1 - flip * 0.1})`, opacity: 1 - flip * 0.35}}>
          <Card w={820} pad={60}>
            <div style={{fontFamily: FONT_SANS, fontWeight: 800, fontSize: 34, letterSpacing: 10, color: VAL.terracotta}}>LO QUE SE DICE</div>
            <div style={{position: 'relative', marginTop: 20}}>
              <div style={{fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 64, lineHeight: 1.12, color: VAL.ink2}}>«{myth}»</div>
              <div style={{position: 'absolute', left: -10, top: '48%', height: 10, width: `${strike * 104}%`, background: VAL.terracotta, borderRadius: 5, transform: 'rotate(-2deg)'}} />
            </div>
          </Card>
        </div>
        <div style={{position: 'absolute', right: 150, top: 430, transformOrigin: '0% 50%', transform: `rotateY(${(1 - flip) * -80}deg) rotate(2deg)`, opacity: Math.min(1, flip * 2)}}>
          <Card w={880} pad={62} style={{background: '#FFFDF6', borderColor: VAL.gold}}>
            <KickerLine text={kicker} a={flip} color={VAL.sage} />
            <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 72, lineHeight: 1.08, color: VAL.ink, marginTop: 18}}>{truth}</div>
          </Card>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 6 · SEÑALES DE ALARMA ───────────── */
export const VrRedFlags: React.FC<{kicker: string; title: string; flags: string[]; ats: number[]; stamp: string; stampAt: number; image: string}> = ({kicker, title, flags, ats, stamp, stampAt, image}) => {
  const {frame, fps, S} = useF();
  const cam = useCam([...ats.map(S), S(stampAt)]);
  const st = spring({frame: frame - S(stampAt), fps, config: {damping: 9, mass: 0.5}});
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} wash={0.66} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`, alignItems: 'center', justifyContent: 'center'}}>
        <Card w={1500} pad={70}>
          <KickerLine text={kicker} a={ramp(frame, 4, 18)} color={VAL.terracotta} />
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 76, color: VAL.ink, marginTop: 14}}>{title}</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 60px', marginTop: 36}}>
            {flags.map((f, i) => {
              const k = spring({frame: frame - S(ats[i] ?? 0.5 + i * 0.5), fps, config: {damping: 13, mass: 0.6}});
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 30}px)`}}>
                  <div style={{width: 54, height: 54, borderRadius: 27, background: VAL.terracotta, color: VAL.onAccent, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * k})`}}>!</div>
                  <div style={{fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 54, color: VAL.ink}}>{f}</div>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', right: 70, bottom: -40, padding: '14px 34px', background: VAL.card, border: `6px solid ${VAL.terracotta}`, borderRadius: 12, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 46, letterSpacing: 6, color: VAL.terracotta, transform: `rotate(-6deg) scale(${(2 - st).toFixed(3)})`, opacity: Math.min(1, st * 2), boxShadow: CARD_SHADOW}}>{stamp}</div>
        </Card>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 7 · SEMANA (calendario de uso) ───────────── */
export const VrWeek: React.FC<{kicker: string; title: string; rows: {label: string; days: number[]}[]; ats: number[]; image: string}> = ({kicker, title, rows, ats, image}) => {
  const {frame, fps, S} = useF();
  const cam = useCam(ats.map(S));
  const DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  const COL = [VAL.gold, VAL.goldDark, VAL.sage];
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} wash={0.68} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`, alignItems: 'center', justifyContent: 'center'}}>
        <Card w={1640} pad={64}>
          <KickerLine text={kicker} a={ramp(frame, 4, 18)} />
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 70, color: VAL.ink, marginTop: 10}}>{title}</div>
          <div style={{display: 'grid', gridTemplateColumns: `360px repeat(7, 1fr)`, gap: 14, marginTop: 34, alignItems: 'center'}}>
            <div />
            {DAYS.map((d) => <div key={d} style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: VAL.ink2, textAlign: 'center'}}>{d}</div>)}
            {rows.map((r, i) => {
              const t0 = S(ats[i] ?? 0.6 + i * 1.2);
              return (
                <React.Fragment key={i}>
                  <div style={{fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 46, color: VAL.ink, opacity: ramp(frame, t0 - 4, t0 + 6)}}>{r.label}</div>
                  {DAYS.map((_, j) => {
                    const on = r.days.includes(j);
                    const k = spring({frame: frame - t0 - j * 2, fps, config: {damping: 12, mass: 0.5}});
                    return (
                      <div key={j} style={{height: 96, borderRadius: 16, border: `2px solid ${rgba(VAL.gold, 0.4)}`, background: on ? rgba(COL[i % 3], 0.18 + 0.72 * Math.min(1, k)) : rgba(VAL.paperWarm, 0.5), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {on ? <div style={{fontFamily: FONT_HAND, fontSize: 64, color: VAL.onAccent, transform: `scale(${Math.min(1.2, k)})`}}>✓</div> : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 8 · QUÉ ESPERAR (línea de tiempo) ───────────── */
export const VrTimeline: React.FC<{kicker: string; title: string; marks: {when: string; what: string}[]; ats: number[]; image: string}> = ({kicker, title, marks, ats, image}) => {
  const {frame, fps, S} = useF();
  const cam = useCam(ats.map(S));
  const n = marks.length;
  const last = ats[n - 1] ?? n;
  const u = ramp(frame, S(ats[0] ?? 0.4) - 6, S(last) + 6, Easing.inOut(Easing.quad));
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} wash={0.64} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`, padding: '120px 140px'}}>
        <KickerLine text={kicker} a={ramp(frame, 4, 18)} />
        <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 82, color: VAL.ink, marginTop: 12}}>{title}</div>
        <div style={{position: 'relative', marginTop: 110, height: 540}}>
          {(() => { const cw = 1640 / n; const x0 = cw / 2, x1 = 1640 - cw / 2; return (<>
          <div style={{position: 'absolute', left: x0, width: x1 - x0, top: 40, height: 8, background: rgba(VAL.gold, 0.25), borderRadius: 4}} />
          <div style={{position: 'absolute', left: x0, width: (x1 - x0) * u, top: 40, height: 8, background: VAL.gold, borderRadius: 4}} />
          {marks.map((m, i) => {
            const k = spring({frame: frame - S(ats[i] ?? i), fps, config: {damping: 12, mass: 0.6}});
            return (
              <div key={i} style={{position: 'absolute', left: i * cw + 16, top: 0, width: cw - 32, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: Math.min(1, k * 1.5)}}>
                <div style={{width: 88, height: 88, borderRadius: 44, background: VAL.card, border: `8px solid ${VAL.gold}`, transform: `scale(${k})`, boxShadow: CARD_SHADOW}} />
                <Card w={cw - 32} pad={34} style={{marginTop: 30, transform: `translateY(${(1 - k) * 40}px)`, textAlign: 'center'}}>
                  <div style={{fontFamily: FONT_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: VAL.goldDark, textTransform: 'uppercase'}}>{m.when}</div>
                  <div style={{fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 46, lineHeight: 1.12, color: VAL.ink, marginTop: 10}}>{m.what}</div>
                </Card>
              </div>
            );
          })}
          </>); })()}
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 9 · INTRIGA (candado: se lo cuento en un ratito) ───────────── */
export const VrTeaser: React.FC<{kicker: string; title: string; note: string; image: string}> = ({kicker, title, note, image}) => {
  const {frame, fps, S} = useF();
  const cam = useCam([S(0.5)]);
  const wob = Math.sin(frame / 3.2) * Math.max(0, 1 - Math.abs(frame - S(1.2)) / 14) * 9;
  return (
    <Shell>
      <Bed img={image} camX={cam.x} camY={cam.y} blur={22} wash={0.5} />
      <AbsoluteFill style={{transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px)`, alignItems: 'center', justifyContent: 'center'}}>
        <Card w={1180} pad={70} style={{textAlign: 'center'}}>
          <KickerLine text={kicker} a={ramp(frame, 4, 18)} center />
          <svg width={170} height={200} viewBox="0 0 170 200" style={{margin: '26px auto 0', display: 'block', transform: `rotate(${wob}deg) scale(${spring({frame: frame - 6, fps, config: {damping: 11}})})`}}>
            <path d="M40 90 V60 a45 45 0 0 1 90 0 V90" fill="none" stroke={VAL.goldDark} strokeWidth={16} />
            <rect x={18} y={88} width={134} height={104} rx={18} fill={VAL.gold} />
            <circle cx={85} cy={132} r={14} fill={VAL.card} /><rect x={79} y={136} width={12} height={30} rx={5} fill={VAL.card} />
          </svg>
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 1.08, color: VAL.ink, marginTop: 24, opacity: ramp(frame, 10, 24)}}>{title}</div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}><Hand text={note} a={ramp(frame, S(1.1), S(1.6))} size={62} rot={-2} /></div>
        </Card>
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 10 · LÁMINA (pantalla completa, zoom punto por punto) ───────────── */
export const VrLamina: React.FC<{image: string; focus: {x: number; y: number; z: number; at: number}[]}> = ({image, focus}) => {
  const {frame, d, S} = useF();
  // keyframes: vista completa → cada foco (x,y en % del cuadro, z = zoom) → vista completa al final
  const keys = [{x: 50, y: 50, z: 1, f: 0}, ...focus.map((p) => ({x: p.x, y: p.y, z: p.z, f: S(p.at)})), {x: 50, y: 50, z: 1, f: Math.max(S((focus[focus.length - 1]?.at ?? 0) + 3), d - S(3))}];
  // en cada `at` la cámara ARRANCA hacia el punto y llega en 24 cuadros; después queda quieta sobre él
  const ins: number[] = [0], idx: number[] = [0];
  for (let i = 1; i < keys.length; i++) {
    const f0 = Math.max(keys[i].f, ins[ins.length - 1] + 1);
    ins.push(f0); idx.push(i - 1);
    ins.push(f0 + 24); idx.push(i);
  }
  const ease = Easing.inOut(Easing.cubic);
  const track = (arr: number[]) => interpolate(frame, ins, idx.map((i) => arr[i]), {...CLAMP, easing: ease});
  const z = track(keys.map((k) => k.z)), x = track(keys.map((k) => k.x)), y = track(keys.map((k) => k.y));
  const breathe = 1 + Math.sin(frame / 40) * 0.004;
  const tx = (50 - x) * (z - 1) / z, ty = (50 - y) * (z - 1) / z;
  return (
    <Shell>
      <AbsoluteFill style={{background: VAL.paperDeep, overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `scale(${(z * breathe).toFixed(4)}) translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%)`, transformOrigin: '50% 50%'}}>
          <Img src={sf(image)!} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
        <WarmVignette strength={0.14} />
      </AbsoluteFill>
    </Shell>
  );
};

/* ───────────── 11 · CTA con QR REAL (recetario) ───────────── */
export const VrQr: React.FC<{kicker: string; title: string; sub: string; url: string; qr: string; cover: string; pages: string[]; image: string; tvLabel: string; phoneLabel: string; hand?: string}> = ({kicker, title, sub, url, qr, cover, pages, image, tvLabel, phoneLabel, hand}) => {
  const {frame, fps, S} = useF();
  const cam = useCam([S(0.6)]);
  const inQ = spring({frame: frame - 8, fps, config: {damping: 15, mass: 0.8}});
  const inB = spring({frame: frame - 2, fps, config: {damping: 16}});
  return (
    <Shell>
      <Bed img={image} camX={cam.x * 0.3} camY={cam.y * 0.3} wash={0.72} />
      <AbsoluteFill>
        {/* libro + páginas en abanico (se mueven; el QR NO) */}
        <div style={{position: 'absolute', left: 110, top: 150, width: 720, height: 800, transform: `translate(${cam.x}px, ${cam.y}px) translateX(${(1 - inB) * -200}px)`}}>
          {pages.slice(0, 3).map((p, i) => (
            <div key={i} style={{position: 'absolute', left: 150 + i * 70, top: 40 + i * 18, width: 440, height: 620, transform: `rotate(${(4 + i * 5) * inB + Math.sin(frame / 50 + i) * 0.8}deg)`, boxShadow: CARD_SHADOW, background: '#fff', overflow: 'hidden'}}>
              <Img src={sf(p)!} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          ))}
          <div style={{position: 'absolute', left: 0, top: 70, width: 480, height: 680, transform: `rotate(${-5 + Math.sin(frame / 60) * 0.6}deg)`, boxShadow: `0 40px 80px ${rgba(VAL.ink, 0.35)}`, overflow: 'hidden', borderRadius: 6}}>
            <Img src={sf(cover)!} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        </div>
        {/* tarjeta QR: quieta, grande, fondo blanco */}
        <div style={{position: 'absolute', right: 110, top: 90, opacity: Math.min(1, inQ * 1.6), transform: `translateY(${(1 - inQ) * 60}px)`}}>
          <Card w={900} pad={54}>
            <KickerLine text={kicker} a={ramp(frame, 6, 20)} />
            <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 62, lineHeight: 1.05, color: VAL.ink, marginTop: 12}}>{title}</div>
            <div style={{fontFamily: FONT_SERIF_FINE, fontStyle: 'italic', fontWeight: 600, fontSize: 38, color: VAL.ink2, marginTop: 8}}>{sub}</div>
            <div style={{display: 'flex', gap: 40, alignItems: 'center', marginTop: 26}}>
              <div style={{background: '#FFFFFF', padding: 22, borderRadius: 14, border: `3px solid ${VAL.gold}`}}>
                <Img src={sf(qr)!} style={{width: 400, height: 400, display: 'block', imageRendering: 'pixelated'}} />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
                <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, color: VAL.ink, lineHeight: 1.2}}>{tvLabel}</div>
                <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, color: VAL.ink, lineHeight: 1.2}}>{phoneLabel}</div>
                {hand ? <Hand text={hand} a={ramp(frame, S(1.2), S(1.7))} size={48} /> : null}
              </div>
            </div>
            <div style={{marginTop: 22, padding: '14px 20px', background: VAL.gold, borderRadius: 10, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 40, color: VAL.onAccent, textAlign: 'center', letterSpacing: 1}}>{url}</div>
          </Card>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};
