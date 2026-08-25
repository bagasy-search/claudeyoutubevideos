/**
 * COMPONENTES FIRMA (bespoke) — replican las refs del usuario, adaptados al canal.
 * PALETA: ROJO / NEGRO / BLANCO (premium editorial, pega con las miniaturas).
 *   blanco = vidrio/estela · negro = fondo cine · rojo = acento (#N, énfasis, ON).
 *
 *   • LightTrailCards — baraja de vidrio en ABANICO 3D REAL (perspectiva + rotateY,
 *     nace de a una desde el centro con motion-blur, cámara que orbita/push) sobre
 *     una ESTELA de luz en S con chevrons + "#N" + caption serif-itálica. (ref V1)
 *   • NodeRingToggle  — nodos que BROTAN → ANILLO orbital + TOGGLE off→on. (ref V2)
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
} from 'remotion';
import {F_PLAYFAIR, F_INTER} from '../VideoEdit/kit/premium/theme';
import {SfxCue, SFX} from '../VideoEdit/components/Sfx';
import {PeroxideBottle} from './PeroxideKit';

const RED = '#E4322A';
const REDLITE = '#FF5A4E';
const WHITE = '#FFFFFF';
const GOLD = '#F2C24E';
const GOLDLITE = '#FFE39A';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* Caption cinético: eyebrow sans + frase serif con *palabra* en itálica (multi-palabra), palabra x palabra. */
const KineticCaption: React.FC<{
  eyebrow?: string;
  phrase: string;
  frame: number;
  at?: number;
  x?: number;
  y?: number;
  align?: 'left' | 'center';
  accent?: string;
}> = ({eyebrow, phrase, frame, at = 0, x = 130, y = 96, align = 'left', accent = RED}) => {
  const words: {w: string; ital: boolean}[] = [];
  phrase.split('*').forEach((part, pi) => {
    const ital = pi % 2 === 1;
    part.split(/\s+/).filter(Boolean).forEach((w) => words.push({w, ital}));
  });
  const MAXW = 1500;
  const left = align === 'center' ? (1920 - MAXW) / 2 : x;
  const ebOp = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  return (
    <div style={{position: 'absolute', left, top: y, width: MAXW, textAlign: align}}>
      {eyebrow && (
        <div style={{fontFamily: F_INTER, fontWeight: 700, letterSpacing: 4, fontSize: 22, textTransform: 'uppercase', color: accent, opacity: ebOp, marginBottom: 12}}>
          {eyebrow}
        </div>
      )}
      <div style={{fontFamily: F_INTER, fontSize: 48, fontWeight: 600, lineHeight: 1.14, color: WHITE}}>
        {words.map(({w: word, ital}, i) => {
          const wa = at + 6 + i * 4;
          const op = interpolate(frame, [wa, wa + 7], [0, 1], CLAMP);
          const dy = interpolate(frame, [wa, wa + 7], [10, 0], CLAMP);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: 13,
                opacity: op,
                transform: `translateY(${dy}px)`,
                fontFamily: ital ? F_PLAYFAIR : F_INTER,
                fontStyle: ital ? 'italic' : 'normal',
                fontWeight: ital ? 500 : 600,
                color: ital ? WHITE : 'rgba(255,255,255,0.86)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* Una carta de vidrio blanca frosted. Con `image` (opcional) muestra la foto del truco
   tratada al palette (B&N desaturado, tinte rojo sutil) viéndose a través del vidrio.
   `gold` (0..1) la convierte en una carta DORADA que irradia luz (para "y el número 5"). */
const GlassFace: React.FC<{w: number; h: number; front?: boolean; number?: string; image?: string; gold?: number; goldGlow?: number}> = ({w, h, front, number, image, gold = 0, goldGlow = 0}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 20,
      background: gold > 0
        ? `linear-gradient(135deg, rgba(255,227,154,${0.30 + 0.22 * gold}), rgba(242,194,78,${0.10 + 0.12 * gold}) 55%, rgba(255,227,154,${0.18 + 0.12 * gold}))`
        : 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.12))',
      border: gold > 0.5 ? `2px solid ${GOLDLITE}` : '1.5px solid rgba(255,255,255,0.7)',
      boxShadow: gold > 0
        ? `0 0 ${50 + goldGlow * 90}px ${GOLD}${gold > 0.5 ? 'AA' : '66'}, 0 0 ${120 + goldGlow * 120}px ${GOLD}66, inset 0 1px 0 ${GOLDLITE}`
        : front
        ? `0 0 46px rgba(255,255,255,0.35), 0 0 90px ${RED}55, inset 0 1px 0 rgba(255,255,255,0.7)`
        : `0 0 26px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.5)`,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* foto del truco, tratada al palette rojo/negro/blanco */}
    {image && (
      <>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${staticFile(image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(1) contrast(1.08) brightness(0.9)',
            opacity: front ? 0.6 : 0.42,
          }}
        />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(228,50,42,0.10), rgba(0,0,0,0.5))`, mixBlendMode: 'multiply'}} />
      </>
    )}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.08))'}} />
    <div style={{position: 'absolute', left: '10%', right: '10%', top: '42%', height: 1.5, background: 'rgba(255,255,255,0.5)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.22) 50%, transparent 58%)'}} />
    {/* baño dorado que sube con `gold` */}
    {gold > 0 && (
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(255,227,154,${0.28 * gold}), rgba(242,194,78,${0.14 * gold}) 60%, rgba(242,194,78,${0.22 * gold}))`, mixBlendMode: 'screen'}} />
    )}
    {number && (
      <div style={{position: 'absolute', left: 24, bottom: 18, fontFamily: F_INTER, fontWeight: 800, fontSize: 46, color: gold > 0.5 ? GOLDLITE : WHITE, textShadow: gold > 0.5 ? `0 0 24px ${GOLD}, 0 2px 8px #000` : `0 0 20px ${RED}, 0 2px 8px #000`}}>
        {number}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   1) LIGHT TRAIL CARDS — baraja de vidrio en ABANICO 3D sobre estela de luz. (ref V1)
   ══════════════════════════════════════════════════════════════════════ */
export const LightTrailCards: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  phrase?: string; // bloques semánticos separados por "|"; *palabra* = serif itálica
  number?: string;
  cards?: number;
  images?: string[]; // 1 foto por carta (opcional), tratada B&N — la del truco correspondiente
  goldCard?: number; // índice de la carta que SOBRESALE y se vuelve DORADA
  goldAt?: number; // frame en que empieza el reveal dorado
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = '9 trucos con agua oxigenada', phrase = 'que los profesionales|*no* te cuentan', number = '#1', cards = 9, images, goldCard, goldAt = 40, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const D = durationInFrames;
  const eio = (a: number, b: number, t: number) => lerp(a, b, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // FASES (gramática): arranca parcial → separa → dolly-in reencuadra → hold → salida.
  const sep = interpolate(frame, [0, D * 0.36], [0.28, 1], CLAMP); // arranca PARCIALMENTE formado (28%)
  const dolly = interpolate(frame, [0, D * 0.8], [0, 1], CLAMP); // dolly-in continuo (crece por perspectiva)
  const truck = interpolate(frame, [D * 0.46, D * 0.82], [0, 1], CLAMP); // reencuadre: trucca a la izq, el frente se recorta
  const exit = interpolate(frame, [D - 9, D], [0, 1], CLAMP); // salida óptica ANTES del corte
  const micro = Math.sin(frame / 11) * (frame > D * 0.78 ? 3 : 0); // microdrift en el hold

  // CÁMARA como grupo: dolly real (translateZ = crece por perspectiva, NO por escala) + baja + truck-izq
  const gZ = eio(-140, 300, dolly); // hacia la cámara
  const gY = eio(-30, 60, dolly) + micro; // baja apenas
  const gX = eio(40, -360, truck) + micro; // trucca a la derecha → contenido a la IZQ, el frente se recorta
  const gRotY = eio(-7, 6, frame / D);
  const estelaDraw = interpolate(frame, [8, 50], [1, 0], CLAMP);
  const trailPath = 'M 120 780 C 480 740, 720 540, 1040 580 S 1560 620, 1880 300';

  const W = 300;
  const H = 210;
  const mid = (cards - 1) / 2;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(130% 130% at 50% 34%, #16171A 0%, #070708 55%, #000 100%)'}}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
        <div style={{fontFamily: F_INTER, fontWeight: 900, fontSize: 620, color: 'rgba(255,255,255,0.035)', marginTop: 40, letterSpacing: -10, transform: `translateX(${gX * 0.3}px)`}}>{number}</div>
      </div>

      <svg style={{position: 'absolute', inset: 0, transform: `translate(${gX * 0.5}px, ${gY * 0.4}px)`}} width="1920" height="1080" viewBox="0 0 1920 1080">
        <path d={trailPath} fill="none" stroke={WHITE} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={estelaDraw} style={{filter: 'blur(15px)', opacity: 0.55}} />
        <path d={trailPath} fill="none" stroke={REDLITE} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={estelaDraw} style={{filter: 'blur(24px)', opacity: 0.28}} />
        <path d={trailPath} fill="none" stroke={WHITE} strokeWidth={3.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={estelaDraw} style={{filter: `drop-shadow(0 0 7px ${WHITE})`}} />
        {['M 1770 350 l 44 -32 l -28 48', 'M 300 712 l -44 24 l 46 28'].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={WHITE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(frame, [34, 48], [0, 0.9], CLAMP)} />
        ))}
      </svg>

      {/* BARAJA 3D — grupo con cámara-dolly */}
      <div style={{position: 'absolute', inset: 0, perspective: 1400, perspectiveOrigin: '46% 46%'}}>
        <div style={{position: 'absolute', left: '50%', top: '52%', transformStyle: 'preserve-3d', transform: `translate(-50%,-50%) translate3d(${gX}px, ${gY}px, ${gZ}px) rotateX(8deg) rotateY(${gRotY}deg)`}}>
          {Array.from({length: cards}).map((_, i) => {
            const off = i - mid;
            // DESFASE POR CARTA: la delantera (más cerca del frente, |off| grande hacia la izquierda) se separa MÁS y ANTES
            const stagger = spring({frame: frame - (6 + i * 3.2), fps, config: {damping: 16, mass: 0.85, stiffness: 150}});
            const openF = Math.min(1, sep * (0.7 + 0.3 * (i / (cards - 1)))); // las de adelante abren un toque más
            const fanX = off * 120 * openF;
            const fanY = Math.abs(off) * 8 - 8;
            const fanZ = -Math.abs(off) * 34;
            const fanRot = off * 12;
            const x = fanX * stagger;
            const yBase = fanY * stagger;
            const zBase = lerp(90, fanZ, stagger);
            const rotBase = fanRot * stagger;
            const mb = (1 - stagger) * 30;

            const isGold = goldCard != null && i === goldCard;
            const goldT = isGold ? interpolate(frame, [goldAt, goldAt + 16], [0, 1], CLAMP) : 0;
            const breath = 0.55 + 0.45 * Math.sin(frame / 9);
            const y = yBase - goldT * 150;
            const z = zBase + goldT * 240;
            const rot = lerp(rotBase, 0, goldT);
            const gscale = 1 + goldT * 0.14;

            return (
              <div key={i} style={{position: 'absolute', left: -W / 2, top: -H / 2, width: W, height: H, transformStyle: 'preserve-3d', transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rot}deg) scale(${gscale})`, opacity: stagger, filter: mb > 0.6 ? `blur(${mb * 0.32}px)` : undefined, zIndex: isGold ? 999 : 100 - Math.abs(off)}}>
                <GlassFace w={W} h={H} front={i === 0} number={i === 0 ? number : undefined} image={images?.[i]} gold={goldT} goldGlow={goldT * breath} />
              </div>
            );
          })}
        </div>
      </div>

      {/* TEXTO en el ESPACIO NEGATIVO — se corre a la derecha cuando el abanico trucca a la izq, en BLOQUES semánticos */}
      <BlockCaption eyebrow={eyebrow} phrase={phrase} frame={frame} D={D} x={interpolate(truck, [0, 1], [150, 900], CLAMP)} y={150} />

      {/* SALIDA ÓPTICA antes del corte: solariza + flash negativo */}
      {exit > 0 && (
        <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'difference', background: `rgba(255,255,255,${exit * 0.9})`, opacity: exit}} />
      )}
      {exit > 0.4 && <AbsoluteFill style={{pointerEvents: 'none', background: '#000', opacity: interpolate(exit, [0.4, 0.7, 1], [0, 0.85, 0], CLAMP)}} />}

      {sfx && <SfxCue at={8} src={SFX.whoosh} volume={0.4} />}
      {sfx && Array.from({length: cards}).map((_, i) => <SfxCue key={i} at={10 + i * 3.2} src={SFX.pop1} volume={0.2} />)}
      {sfx && goldCard != null && <SfxCue at={goldAt} src={SFX.sparkleClean} volume={0.5} />}
      {sfx && <SfxCue at={Math.round(D - 9)} src={SFX.swish} volume={0.4} />}
    </AbsoluteFill>
  );
};

/* Caption por BLOQUES semánticos (no palabra x palabra): frase con "|" separa bloques;
   cada bloque entra en su fase, *palabra* = serif itálica (la emocional). */
const BlockCaption: React.FC<{eyebrow?: string; phrase: string; frame: number; D: number; x: number; y: number}> = ({eyebrow, phrase, frame, D, x, y}) => {
  const blocks = phrase.split('|').map((b) => b.trim()).filter(Boolean);
  const ebOp = interpolate(frame, [4, 14], [0, 1], CLAMP);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 900, textAlign: 'left'}}>
      {eyebrow && <div style={{fontFamily: F_INTER, fontWeight: 700, letterSpacing: 4, fontSize: 22, textTransform: 'uppercase', color: RED, opacity: ebOp, marginBottom: 12}}>{eyebrow}</div>}
      <div style={{fontFamily: F_INTER, fontSize: 52, fontWeight: 600, lineHeight: 1.12, color: WHITE}}>
        {blocks.map((blk, bi) => {
          const at = D * 0.12 + bi * (D * 0.16);
          const op = interpolate(frame, [at, at + 10], [0, 1], CLAMP);
          const dy = interpolate(frame, [at, at + 10], [16, 0], CLAMP);
          const ital = blk.startsWith('*') && blk.endsWith('*');
          const txt = ital ? blk.slice(1, -1) : blk;
          return (
            <div key={bi} style={{opacity: op, transform: `translateY(${dy}px)`, fontFamily: ital ? F_PLAYFAIR : F_INTER, fontStyle: ital ? 'italic' : 'normal', fontWeight: ital ? 500 : 600, color: ital ? WHITE : 'rgba(255,255,255,0.9)', fontSize: ital ? 64 : 52, marginTop: bi ? 4 : 0}}>
              {txt}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   2) NODE RING + TOGGLE — nodos que brotan y arman anillo + toggle off→on. (ref V2)
   Rojo/negro/blanco: nodos blancos, toggle OFF=rojo (sucio) → ON=blanco brillante (limpio).
   ══════════════════════════════════════════════════════════════════════ */
export const NodeRingToggle: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  phrase?: string;
  nodes?: number;
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = 'Antes y después', phrase = 'cómo lo sucio | *se limpia*', nodes = 8, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const D = durationInFrames;
  const eio = (a: number, b: number, t: number) => lerp(a, b, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const c01 = (x: number) => Math.max(0, Math.min(1, x));

  const cx = 960;
  const cy = 470;
  const R = 250;

  // FASES: pulso concéntrico → satélites 1×1 → dolly/PORTAL → switch nace al centro → flip → hold → flash
  const portalStart = D * 0.4;
  const portalDur = D * 0.24;
  const portal = c01((frame - portalStart) / portalDur); // atravesamos el anillo
  const camScale = 1 + eio(0, 1, portal) * 0.55; // push-in que nos mete por el anillo
  const pulseGate = 1 - c01(frame / (D * 0.32)); // el pulso central cede cuando el anillo se arma

  const switchIn = c01((frame - D * 0.52) / (D * 0.12)); // el switch aparece al "salir" del anillo
  const flipStart = Math.round(D * 0.62);
  const flip = spring({frame: frame - flipStart, fps, config: {damping: 15, mass: 0.9, stiffness: 120}}); // 0=rojo/off → 1=blanco/on
  const breath = 0.72 + 0.28 * Math.sin(frame / 12);
  const switchFloat = frame > D * 0.66 ? Math.sin((frame - D * 0.66) / 14) * 3 : 0;

  const exit = c01((frame - (D - 9)) / 9); // salida óptica: inversión breve + flash (NO lavado)

  return (
    <AbsoluteFill style={{background: 'radial-gradient(130% 130% at 50% 40%, #161719 0%, #070708 55%, #000 100%)'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${camScale})`, transformOrigin: `${cx}px ${cy}px`}}>
        {/* PULSO concéntrico central (sonar de cuadrados) — arranca la escena */}
        {[0, 1, 2].map((k) => {
          const t = c01(((frame + k * 9) % 42) / 42);
          const sc = lerp(0.35, 2.6, t);
          const op = (1 - t) * 0.5 * pulseGate;
          return (
            <div key={k} style={{position: 'absolute', left: cx, top: cy, width: 120, height: 120, transform: `translate(-50%,-50%) scale(${sc})`, borderRadius: 26, border: `2px solid ${WHITE}`, opacity: op, boxShadow: `0 0 24px ${WHITE}`}} />
          );
        })}
        {/* núcleo brillante que pulsa (será el lugar del switch) */}
        <div style={{position: 'absolute', left: cx, top: cy, width: 300, height: 300, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${WHITE} 0%, transparent 60%)`, opacity: (0.5 + 0.4 * Math.sin(frame / 6)) * pulseGate * (1 - switchIn), filter: 'blur(10px)'}} />

        {/* NODOS → ANILLO → PORTAL (aparecen 1×1 a distinta profundidad; en el portal crecen y salen por los bordes) */}
        {Array.from({length: nodes}).map((_, i) => {
          const ang0 = (i / nodes) * Math.PI * 2 - Math.PI / 2;
          const ang = ang0 + (frame / D) * 0.5 * (1 - portal * 0.6); // leve órbita
          const spawn = spring({frame: frame - (6 + i * 3), fps, config: {damping: 17, mass: 0.9, stiffness: 130}});
          const depth = 0.72 + (((i * 53) % 100) / 100) * 0.5; // profundidad/escala variada (anillo incompleto→completo)
          const rad = R * depth * spawn * (1 + portal * (3.6 + depth)); // en el portal el radio explota
          const x = cx + Math.cos(ang) * rad;
          const y = cy + Math.sin(ang) * rad;
          const pulse = 0.6 + 0.4 * Math.sin(frame / 7 + i);
          const sz = 46 * depth * (1 + portal * 2.6);
          const edgeFade = 1 - c01((portal - 0.5) / 0.5); // se disuelven al pasar por los bordes
          const db = (1 - depth) * 2.4; // blur de profundidad
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: sz,
                height: sz,
                transform: `translate(-50%,-50%) scale(${spawn})`,
                opacity: spawn * edgeFade * (0.7 + 0.3 * depth),
                borderRadius: 12 * depth,
                border: `2px solid ${WHITE}`,
                background: 'rgba(255,255,255,0.06)',
                boxShadow: `0 0 ${14 + pulse * 16}px ${WHITE}, inset 0 0 12px rgba(255,255,255,0.7)`,
                filter: db > 0.3 ? `blur(${db}px)` : undefined,
              }}
            />
          );
        })}

        {/* SWITCH — nace en el centro (parece haber estado siempre ahí) con piso reflejante */}
        {switchIn > 0 && <Toggle cx={cx} cy={cy + switchFloat} flip={flip} appear={switchIn} breath={breath} />}
      </div>

      {/* TEXTO en bloques semánticos (premisa | palabra emocional en serif itálica) */}
      <div style={{opacity: 1 - c01((exit - 0.1) / 0.5)}}>
        <BlockCaption eyebrow={eyebrow} phrase={phrase} frame={frame} D={D} x={510} y={132} />
      </div>

      {/* SALIDA óptica: inversión de color BREVE + flash puntual (calibrado, NO lavado blanco) */}
      {exit > 0 && <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'difference', background: WHITE, opacity: interpolate(exit, [0, 0.4, 0.7], [0, 0.34, 0], CLAMP)}} />}
      {exit > 0.35 && <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(circle at 50% ${cy / 10.8}%, ${WHITE} 0%, transparent 55%)`, opacity: interpolate(exit, [0.35, 0.55, 0.85], [0, 0.28, 0], CLAMP)}} />}

      {sfx && <SfxCue at={6} src={SFX.whoosh} volume={0.3} />}
      {sfx && Array.from({length: nodes}).map((_, i) => <SfxCue key={i} at={8 + i * 3} src={SFX.pop1} volume={0.16} />)}
      {sfx && <SfxCue at={Math.round(portalStart)} src={SFX.swish} volume={0.4} />}
      {sfx && <SfxCue at={flipStart} src={SFX.capPop} volume={0.5} />}
      {sfx && <SfxCue at={flipStart + 5} src={SFX.sparkleClean} volume={0.45} />}
    </AbsoluteFill>
  );
};

const Toggle: React.FC<{cx: number; cy: number; flip: number; appear?: number; breath?: number}> = ({cx, cy, flip, appear = 1, breath = 1}) => {
  const W = 320;
  const H = 140;
  const pad = 13;
  const knob = H - pad * 2;
  const f = Math.max(0, Math.min(1, flip));
  const track = interpolateColors(f, [0, 0.5, 1], [RED, '#8A8F96', WHITE]); // rojo → neutro → blanco
  const glow = interpolateColors(f, [0, 0.5, 1], [RED, '#8A8F96', WHITE]);
  const knobX = interpolate(f, [0, 1], [pad, W - knob - pad], CLAMP); // la perilla CRUZA el centro
  const bloom = Math.max(0, 1 - Math.abs(f - 0.5) / 0.26); // pico de bloom al cruzar el centro
  const on = f > 0.5;
  const sc = interpolate(appear, [0, 1], [0.62, 1], CLAMP);
  return (
    <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${sc})`, opacity: appear}}>
      {/* bloom de cruce */}
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 420, height: 420, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${WHITE} 0%, transparent 60%)`, opacity: bloom * 0.5, filter: 'blur(14px)', pointerEvents: 'none'}} />
      <div
        style={{
          position: 'relative',
          width: W,
          height: H,
          borderRadius: H / 2,
          background: on ? 'rgba(255,255,255,0.14)' : 'rgba(228,50,42,0.16)',
          border: `3px solid ${track}`,
          boxShadow: `0 0 ${40 + bloom * 40}px ${glow}, 0 0 ${90 * breath}px ${glow}55, inset 0 0 30px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: pad,
            left: knobX,
            width: knob,
            height: knob,
            borderRadius: '50%',
            background: on ? 'radial-gradient(circle at 35% 30%, #FFFFFF, #C9C9C9)' : 'radial-gradient(circle at 35% 30%, #2A2E33, #0C0E10)',
            boxShadow: `0 6px 14px rgba(0,0,0,0.5), 0 0 ${22 + bloom * 26}px ${glow}`,
            border: `2px solid ${track}`,
          }}
        />
      </div>
      {/* piso reflejante */}
      <div style={{position: 'absolute', left: '50%', top: H + 30, width: W * 0.92, height: 60, transform: 'translateX(-50%) scaleY(-1)', borderRadius: '50%', background: `radial-gradient(ellipse at 50% 0%, ${glow}66 0%, transparent 68%)`, opacity: 0.4 * appear, filter: 'blur(7px)'}} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   3) BOTTLE HERO — la botella (SVG) en escena cine rojo/negro/blanco:
      rim-light + reflejo + flote + destape con pop. El objeto firma del nicho.
   ══════════════════════════════════════════════════════════════════════ */
export const BottleHero: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  phrase?: string;
  uncap?: boolean; // destapa con pop
  sfx?: boolean;
}> = ({durationInFrames, eyebrow = 'La pieza clave', phrase = 'agua oxigenada al *3%*', uncap = true, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const prog = frame / durationInFrames;

  const enter = spring({frame, fps, config: {damping: 18, mass: 0.9, stiffness: 120}});
  const bob = Math.sin(frame / 22) * 10;
  const tilt = Math.sin(frame / 34) * 2.2;
  const push = interpolate(prog, [0, 1], [0.98, 1.05], CLAMP);

  // destape
  const POP = Math.round(fps * 1.1);
  const lift = uncap ? spring({frame: frame - POP, fps, config: {damping: 9, mass: 0.6, stiffness: 170}}) : 0;
  const capLift = interpolate(lift, [0, 1], [0, 1.1], CLAMP);
  const capSpin = lift * 30;
  const capOp = uncap ? interpolate(frame, [POP + 10, POP + 26], [1, 0], CLAMP) : 1;
  const vapor = uncap ? interpolate(frame, [POP, POP + 32], [0, 1], CLAMP) : 0;

  const BW = 360;
  const bx = 640;
  const by = 560;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 120% at 42% 44%, #1A1012 0%, #0A0708 46%, #000 100%)'}}>
      {/* key glow rojo detrás de la botella */}
      <div style={{position: 'absolute', left: bx, top: by - 30, width: 620, height: 620, transform: `translate(-50%,-50%) scale(${enter})`, borderRadius: '50%', background: `radial-gradient(circle, ${RED}44 0%, ${RED}18 34%, transparent 66%)`, filter: 'blur(6px)'}} />
      <div style={{position: 'absolute', left: bx, top: by - 60, width: 260, height: 520, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 62%)', filter: 'blur(10px)'}} />

      {/* contact shadow */}
      <div style={{position: 'absolute', left: bx, top: by + 210, width: 300, height: 40, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)', opacity: enter}} />

      {/* reflejo (botella espejada, se desvanece) */}
      <div
        style={{
          position: 'absolute',
          left: bx,
          top: by + 220,
          transform: `translate(-50%,0) scaleY(-1)`,
          opacity: enter * 0.22,
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 55%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 55%)',
          filter: 'blur(1.5px)',
        }}
      >
        <PeroxideBottle width={BW} />
      </div>

      {/* BOTELLA */}
      <div
        style={{
          position: 'absolute',
          left: bx,
          top: by,
          transform: `translate(-50%,-50%) translateY(${bob + (1 - enter) * 40}px) rotate(${tilt}deg) scale(${push * (0.9 + enter * 0.1)})`,
          opacity: enter,
          filter: `drop-shadow(0 0 26px ${RED}55) drop-shadow(0 18px 30px rgba(0,0,0,0.55))`,
        }}
      >
        {/* vapor al destapar */}
        <div style={{position: 'absolute', left: '50%', top: -30, transform: 'translateX(-50%)', pointerEvents: 'none'}}>
          {Array.from({length: 5}).map((_, i) => {
            const pp = Math.max(0, vapor - i * 0.12);
            return (
              <div key={i} style={{position: 'absolute', left: (i - 2) * 22, top: -pp * 100, width: 38 + i * 7, height: 38 + i * 7, borderRadius: '50%', background: `rgba(255,255,255,${0.4 * (1 - pp)})`, filter: 'blur(7px)'}} />
            );
          })}
        </div>
        <PeroxideBottle width={BW} capLift={capLift} capSpin={capSpin} capOpacity={capOp} />
      </div>

      <KineticCaption eyebrow={eyebrow} phrase={phrase} frame={frame} at={6} x={1120} y={430} />

      {sfx && uncap && <SfxCue at={POP} src={SFX.capPop} volume={0.8} />}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   4) CHAPTER TRAIL CARD — tarjeta "#N Título" que se dibuja sobre una estela
      de luz neón (ref V3, la del "#10"). Para los 9 capítulos/trucos.
   ══════════════════════════════════════════════════════════════════════ */
// ⛔ `bed` (opcional, ago 2026): la choreografía de esta tarjeta ARRANCA de una cápsula fina
// sobre negro, así que su primer segundo es una pantalla casi muerta. Medido en `mddrain`: los 4
// capítulos dispararon `blackdetect` ~1 s cada uno. Pasándole la foto `_blur.jpg` de la sección,
// ese segundo tiene MATERIA debajo (regla 2.quater de video-pipeline: cama de foto bajo todo
// componente). Sin `bed` se comporta EXACTAMENTE como antes — los videos ya entregados no cambian.
export const ChapterTrailCard: React.FC<{
  durationInFrames: number;
  number: string; // "#1"
  title: string;
  sub?: string;
  bed?: string; // "img/mddrain_h07_wettowel_blur.jpg"
  sfx?: boolean;
}> = ({durationInFrames, number, title, sub, bed, sfx = true}) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;
  const prog = frame / D;
  const eio = (a: number, b: number, t: number) => lerp(a, b, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const c01 = (x: number) => Math.max(0, Math.min(1, x));

  const CW = 1040;
  const CH = 300;
  const cx = 960;
  const cy = 540;

  // FASES: cápsula vertical → ensancha → tarjeta → borde verde se enfría a blanco → capas → # contador → título tipeo + línea → barrido → hold → blur out
  const morph = c01((frame - D * 0.03) / (D * 0.17)); // cápsula → tarjeta
  const cardW = eio(30, CW, morph);
  const cardH = eio(360, CH, c01(morph * 1.3)); // alto de cápsula alta baja a tarjeta
  const radius = lerp(15, 30, morph);
  const cool = c01((frame - D * 0.14) / (D * 0.13)); // borde/acento verde → blanco-azulado
  const edgeCol = interpolateColors(cool, [0, 1], ['#35E39A', '#D5E4FF']);
  const layO = c01((frame - D * 0.19) / (D * 0.11)); // capas: bisel/reflejo/sombra/contenido
  const dolly = eio(1.015, 1.055, prog); // la cámara empuja apenas (revela)

  // "#" + contador #1 → #N
  const nTarget = parseInt((number.match(/\d+/) || ['1'])[0], 10) || 1;
  const hashT = c01((frame - D * 0.24) / (D * 0.05));
  const countT = c01((frame - D * 0.29) / (D * 0.1));
  const nShown = Math.max(1, Math.round(lerp(1, nTarget, eio(0, 1, countT))));
  const numStr = '#' + nShown;

  // título tipeo + línea luminosa inferior que se dibuja
  const typeStart = D * 0.34;
  const perChar = Math.max(1.2, (D * 0.22) / Math.max(1, title.length));
  const shownChars = Math.max(0, Math.min(title.length, Math.floor((frame - typeStart) / perChar)));
  const titleTxt = title.slice(0, shownChars);
  const caret = frame >= typeStart && shownChars < title.length && Math.floor(frame / 6) % 2 === 0;
  const lineDraw = c01((frame - D * 0.36) / (D * 0.2));

  // barrido especular diagonal + 2ª curva
  const sweep = c01((frame - D * 0.44) / (D * 0.16));
  const sweepX = lerp(-cardW * 0.8, cardW * 1.0, sweep);
  const curve2 = interpolate(frame, [D * 0.42, D * 0.62], [1, 0], CLAMP);
  const curveBack = interpolate(frame, [8, D * 0.34], [1, 0], CLAMP);

  const stabT = c01((frame - D * 0.58) / (D * 0.06));
  const holdFloat = frame > D * 0.6 ? Math.sin((frame - D * 0.6) / 13) * 3 : 0;
  const blurExit = c01((frame - D * 0.86) / (D * 0.14)); // blur progresivo de salida
  const groupBlur = blurExit * 15;

  const trailPath = 'M 60 720 C 520 680, 700 470, 1000 480 S 1560 510, 1880 250';
  const curve2Path = 'M 1200 340 C 1420 300, 1620 300, 1860 210';

  return (
    <AbsoluteFill style={{background: bed ? '#0A0A0C' : 'radial-gradient(130% 130% at 50% 40%, #101318 0%, #060708 55%, #000 100%)'}}>
      {/* cama de foto: sólo si el beat la pasó. El `_blur.jpg` ya viene horneado (blur 0 acá). */}
      {bed ? (
        <>
          <AbsoluteFill style={{overflow: 'hidden'}}>
            <img
              src={staticFile(bed)}
              style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.34) saturate(0.62)', transform: 'scale(1.14)'}}
            />
          </AbsoluteFill>
          <AbsoluteFill style={{background: 'radial-gradient(130% 130% at 50% 40%, rgba(16,19,24,0.70) 0%, rgba(6,7,8,0.86) 55%, rgba(0,0,0,0.93) 100%)'}} />
        </>
      ) : null}

      {/* "#N" gigante fantasma */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: layO}}>
        <div style={{fontFamily: F_INTER, fontWeight: 900, fontSize: 640, color: 'rgba(210,225,255,0.035)', letterSpacing: -12}}>{'#' + nTarget}</div>
      </div>

      {/* curva luminosa ATRÁS (se dibuja al abrir el capítulo) */}
      <svg style={{position: 'absolute', inset: 0}} width="1920" height="1080" viewBox="0 0 1920 1080">
        <path d={trailPath} fill="none" stroke={'#8FB6FF'} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={curveBack} style={{filter: 'blur(20px)', opacity: 0.28}} />
        <path d={trailPath} fill="none" stroke={WHITE} strokeWidth={2.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={curveBack} style={{filter: `drop-shadow(0 0 6px ${WHITE})`, opacity: 0.5}} />
      </svg>

      <div style={{position: 'absolute', left: cx, top: cy + holdFloat, transform: `translate(-50%,-50%) scale(${dolly})`, filter: groupBlur > 0.3 ? `blur(${groupBlur}px)` : undefined, opacity: 1 - blurExit * 0.25}}>
        {/* sombra ambiental */}
        <div style={{position: 'absolute', left: '50%', top: '54%', width: cardW * 0.9, height: cardH * 0.7, transform: 'translate(-50%,-50%)', borderRadius: radius, boxShadow: `0 40px 90px rgba(0,0,0,0.7)`, opacity: layO}} />

        {/* CUERPO de la tarjeta (cápsula → tarjeta), muchas capas, clip para barrido/reflejo/ruido */}
        <div
          style={{
            position: 'absolute',
            left: -cardW / 2,
            top: -cardH / 2,
            width: cardW,
            height: cardH,
            borderRadius: radius,
            overflow: 'hidden',
            background: 'linear-gradient(160deg, rgba(20,26,38,0.96), rgba(8,11,17,0.98) 60%, rgba(14,18,28,0.96))', // vidrio tinte azul-negro
            border: `2.5px solid ${edgeCol}`,
            boxShadow: `0 0 ${18 + (1 - cool) * 26}px ${edgeCol}${cool > 0.5 ? '66' : 'AA'}, 0 30px 70px rgba(0,0,0,0.6)`,
          }}
        >
          {/* bisel interior */}
          <div style={{position: 'absolute', inset: 3, borderRadius: radius - 3, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 24px rgba(0,0,0,0.5)`, pointerEvents: 'none'}} />
          {/* reflejo superior */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '46%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12), transparent)', opacity: layO, pointerEvents: 'none'}} />
          {/* ruido fino */}
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)', opacity: 0.5 * layO, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
          {/* barrido especular diagonal */}
          <div style={{position: 'absolute', top: -40, bottom: -40, width: 220, left: cardW / 2 + sweepX, transform: 'skewX(-18deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)', opacity: sweep > 0 && sweep < 1 ? 0.9 : 0, pointerEvents: 'none'}} />

          {/* CONTENIDO */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: layO}}>
            <div style={{fontFamily: F_INTER, fontWeight: 800, fontSize: 42, color: edgeCol, letterSpacing: 2, opacity: hashT, textShadow: `0 0 20px ${edgeCol}99`}}>{numStr}</div>
            <div style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 62, color: WHITE, textAlign: 'center', padding: '0 44px', minHeight: 74}}>
              {titleTxt}
              {caret && <span style={{display: 'inline-block', width: 4, height: 44, background: edgeCol, marginLeft: 4, transform: 'translateY(6px)'}} />}
            </div>
            {sub && <div style={{fontFamily: F_PLAYFAIR, fontStyle: 'italic', fontSize: 34, color: 'rgba(210,225,255,0.72)', opacity: interpolate(frame, [D * 0.5, D * 0.6], [0, 1], CLAMP)}}>{sub}</div>}
          </div>

          {/* reflejo del contenido (sutil, abajo) */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%', background: 'linear-gradient(0deg, rgba(255,255,255,0.05), transparent)', opacity: layO * 0.7, pointerEvents: 'none'}} />

          {/* línea luminosa inferior que se dibuja */}
          <div style={{position: 'absolute', left: '50%', bottom: 34, width: cardW * 0.62, height: 3, transform: `translateX(-50%) scaleX(${lineDraw})`, transformOrigin: 'center', background: `linear-gradient(90deg, transparent, ${edgeCol}, transparent)`, boxShadow: `0 0 14px ${edgeCol}`, borderRadius: 2}} />
        </div>

        {/* sparkle al estabilizar */}
        {stabT > 0 && <div style={{position: 'absolute', left: -cardW / 2, top: -cardH / 2, width: cardW, height: cardH, borderRadius: radius, boxShadow: `0 0 40px ${WHITE}`, opacity: interpolate(stabT, [0, 0.5, 1], [0, 0.4, 0], CLAMP), pointerEvents: 'none'}} />}
      </div>

      {/* 2ª curva luminosa ADELANTE, arriba-derecha */}
      <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} width="1920" height="1080" viewBox="0 0 1920 1080">
        <path d={curve2Path} fill="none" stroke={WHITE} strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={curve2} style={{filter: `drop-shadow(0 0 6px ${'#9FC0FF'})`, opacity: 0.7}} />
      </svg>

      {sfx && <SfxCue at={Math.round(D * 0.03)} src={SFX.whoosh} volume={0.4} />}
      {sfx && <SfxCue at={Math.round(D * 0.29)} src={SFX.pop1} volume={0.35} />}
      {sfx && Array.from({length: Math.min(title.length, 24)}).map((_, i) => (
        <SfxCue key={i} at={Math.round(typeStart + i * perChar)} src={SFX.click} volume={0.24} durationInFrames={8} />
      ))}
      {sfx && <SfxCue at={Math.round(D * 0.44)} src={SFX.swish} volume={0.38} />}
      {sfx && <SfxCue at={Math.round(D * 0.58)} src={SFX.sparkleClean} volume={0.4} />}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   5) TYPE CARD BESIDE — tarjeta compacta que hace ZOOM-IN en una ZONA
      (izquierda o derecha) SOBRE el video, SIN oscurecer el fondo (fondo
      transparente, solo la tarjeta con su glow). Va al lado del avatar.
      El texto se revela con TIPEO (carácter por carácter) + SFX de tecla
      por golpe + un sparkleClean al terminar. Rojo/negro/blanco.
   ══════════════════════════════════════════════════════════════════════ */
export const TypeCardBeside: React.FC<{
  durationInFrames: number;
  side?: 'left' | 'right';
  title?: string;
  lines?: string[];
  typeStart?: number; // frame en que arranca el tipeo (tras el zoom-in)
  width?: number;
  sfx?: boolean;
}> = ({durationInFrames, side = 'right', title = 'AGUA OXIGENADA', lines = ['3% · la de farmacia', 'Barata y sin cloro', 'Limpia sin manchar'], typeStart = 12, width = 660, sfx = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ZOOM-IN de la tarjeta (con leve overshoot), sin tocar el fondo
  const pop = spring({frame, fps, config: {damping: 13, mass: 0.7, stiffness: 180}});
  const scale = interpolate(pop, [0, 1], [0.72, 1], CLAMP);
  const outFade = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], CLAMP);

  // TIPEO carácter por carácter, línea por línea
  const perChar = 1.6;
  const flat = lines.join('\n');
  const total = flat.length;
  const revealed = Math.max(0, Math.min(total, Math.floor((frame - typeStart) / perChar)));
  const typing = frame >= typeStart && revealed < total;
  const caret = typing && Math.floor(frame / 8) % 2 === 0;

  // reparte `revealed` sobre las líneas
  let acc = 0;
  const shown = lines.map((ln) => {
    const start = acc;
    acc += ln.length + 1; // +1 por el salto
    const take = Math.max(0, Math.min(ln.length, revealed - start));
    return {text: ln.slice(0, take), done: revealed - start >= ln.length};
  });

  // clicks de tecla (con stride para no crear demasiados nodos de audio)
  const stride = Math.max(1, Math.ceil(total / 40));
  const clickIdx: number[] = [];
  for (let i = 0; i < total; i += stride) if (flat[i] !== ' ') clickIdx.push(i);
  const doneAt = typeStart + total * perChar;

  const zoneStyle: React.CSSProperties = side === 'left' ? {left: 96} : {right: 96};

  return (
    <AbsoluteFill style={{background: 'transparent'}}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          ...zoneStyle,
          width,
          transform: `translateY(-50%) scale(${scale})`,
          transformOrigin: side === 'left' ? 'left center' : 'right center',
          opacity: pop * outFade,
        }}
      >
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(160deg, rgba(20,20,22,0.94), rgba(10,10,11,0.96))',
            border: `2px solid ${RED}`,
            borderRadius: 26,
            padding: '34px 40px',
            boxShadow: `0 30px 70px rgba(0,0,0,0.6), 0 0 60px ${RED}44, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* barra de acento roja arriba */}
          <div style={{position: 'absolute', left: 40, top: 22, width: 64, height: 5, borderRadius: 3, background: RED, boxShadow: `0 0 16px ${RED}`}} />
          <div style={{fontFamily: F_INTER, fontWeight: 800, letterSpacing: 3, fontSize: 30, textTransform: 'uppercase', color: WHITE, marginTop: 20, marginBottom: 18, textShadow: `0 0 18px ${RED}66`}}>
            {title}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {shown.map((s, i) => {
              const active = typing && !s.done && (i === 0 || shown[i - 1].done) && s.text.length >= 0 && frame >= typeStart;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, minHeight: 40}}>
                  <div style={{width: 12, height: 12, borderRadius: 3, background: REDLITE, flexShrink: 0, boxShadow: `0 0 12px ${RED}`, opacity: s.text.length > 0 ? 1 : 0.25}} />
                  <div style={{fontFamily: F_INTER, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,0.92)', lineHeight: 1.1}}>
                    {s.text}
                    {active && caret && <span style={{display: 'inline-block', width: 3, height: 30, background: RED, marginLeft: 3, transform: 'translateY(4px)'}} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {sfx && clickIdx.map((i) => <SfxCue key={i} at={typeStart + i * perChar} src={SFX.click} volume={0.3} durationInFrames={8} />)}
      {sfx && <SfxCue at={Math.round(doneAt)} src={SFX.sparkleClean} volume={0.4} />}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   6) GLITCH CUT — overlay corto (~0.4s) de glitch SUAVE y elegante para
      cortar entre planos: RGB-split + desplazamiento de scanlines + un
      flash tenue. NO agresivo. Prop `durationInFrames`.
   ══════════════════════════════════════════════════════════════════════ */
export const GlitchCut: React.FC<{
  durationInFrames?: number;
  sfx?: boolean;
}> = ({durationInFrames = 12, sfx = true}) => {
  const frame = useCurrentFrame();
  const prog = Math.max(0, Math.min(1, frame / durationInFrames));
  const env = Math.sin(prog * Math.PI); // sube y baja suave (0→1→0)

  // slices horizontales que se desplazan (pseudo-aleatorio determinista)
  const SLICES = 9;
  const rnd = (k: number) => {
    const s = Math.sin(k * 12.9898 + Math.floor(frame / 2) * 4.1) * 43758.5453;
    return s - Math.floor(s);
  };

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {/* RGB-split: dos velos finos de color desplazados a los lados */}
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${RED}22, transparent 18%, transparent 82%, rgba(80,200,255,0.13))`, transform: `translateX(${env * 10}px)`, opacity: env}} />
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(80,200,255,0.12), transparent 20%, transparent 80%, ${RED}1F)`, transform: `translateX(${-env * 10}px)`, opacity: env}} />

      {/* slices que patinan lateralmente con leve tinte RGB */}
      {Array.from({length: SLICES}).map((_, k) => {
        const y = (k / SLICES) * 100;
        const h = 100 / SLICES;
        const dx = (rnd(k) - 0.5) * 90 * env;
        const on = rnd(k + 7) > 0.45;
        if (!on) return null;
        const tint = k % 2 === 0 ? `${RED}` : 'rgba(80,200,255,1)';
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${y}%`,
              height: `${h}%`,
              transform: `translateX(${dx}px)`,
              background: `linear-gradient(90deg, transparent, ${tint === RED ? 'rgba(228,50,42,0.10)' : 'rgba(80,200,255,0.08)'} 40%, transparent)`,
              opacity: env * 0.9,
              boxShadow: `inset 0 0 0 0.5px ${tint === RED ? 'rgba(228,50,42,0.18)' : 'rgba(80,200,255,0.14)'}`,
            }}
          />
        );
      })}

      {/* scanlines que se desplazan */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 4px)',
          transform: `translateY(${(frame % 4) - 2}px)`,
          opacity: env * 0.6,
          mixBlendMode: 'screen',
        }}
      />

      {/* flash tenue en el pico */}
      <div style={{position: 'absolute', inset: 0, background: WHITE, opacity: Math.max(0, env - 0.55) * 0.4}} />

      {sfx && <SfxCue at={0} src={SFX.swish} volume={0.3} durationInFrames={durationInFrames + 6} />}
    </AbsoluteFill>
  );
};
