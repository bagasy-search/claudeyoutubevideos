/**
 * EsponjaScene — microescena 2.5D dirigida: "la verdura = esponja de minerales".
 * Coreografía por ACTOS:
 *   (1) ESPONJA seca, liviana, apoyada en el borde del fregadero (flota un poco = liviana).
 *   (2) entra AGUA por arriba → la esponja se EMPAPA: se oscurece, se hunde pesada y CHORREA
 *       gotas reales (refracción, no dibujadas planas).
 *   (3) cross-fade a una VERDURA oscura (hoja/raíz) rotulada "CONCENTRADA", con el MISMO peso visual.
 * Idea: color oscuro = concentración = esponja empapada que al riñón cansado le toca escurrir.
 * Profundidad real (perspective + translateZ por capa), cámara dolly-in que revela, luz de producto.
 * DETERMINISTA: todo sale de useCurrentFrame/interpolate (nada de Date/random) → seguro en el farm.
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_SANS, FONT_SERIF, rgba, shade, moodBg, GrainOverlay, CoolVignette} from './theme';

const easeOut = Easing.out(Easing.cubic);
const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type EsponjaSceneProps = {
  dryLabel?: string;
  wetLabel?: string;
  vegLabel?: string;
  caption?: string;
};

/** Gota real con refracción + specular + oclusión (no un círculo plano). */
const Drop: React.FC<{x: number; y: number; r: number; long?: number; tint: string; op?: number}> = ({x, y, r, long = 1.35, tint, op = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2 * long, opacity: op, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', boxShadow: `0 ${r * 0.5}px ${r}px ${rgba('#000000', 0.5)}`}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: `radial-gradient(58% 52% at 42% 36%, ${rgba('#ffffff', 0.16)}, ${rgba(tint, 0.5)} 55%, ${rgba('#000000', 0.34)} 100%)`, border: `1px solid ${rgba('#ffffff', 0.14)}`}} />
    <div style={{position: 'absolute', left: r * 0.55, top: r * 0.45, width: r * 0.5, height: r * 0.42, borderRadius: '50%', background: `radial-gradient(circle, ${rgba('#EAF7FF', 0.95)}, transparent 70%)`}} />
  </div>
);

export const EsponjaScene: React.FC<EsponjaSceneProps> = ({
  dryLabel = 'LIVIANA · SECA',
  wetLabel = 'EMPAPADA · PESADA',
  vegLabel = 'CONCENTRADA',
  caption = 'El color oscuro es agua concentrada que su riñón cansado debe escurrir',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // cámara: arranca a un costado y arriba, dolly-in a casi frontal + micro-drift en el hold
  const camP = interpolate(frame, [0, 52], [0, 1], {...clamp, easing: easeIO});
  const ry = interpolate(camP, [0, 1], [-8, -1.5]) + Math.sin(frame / fps * 0.5) * 0.35;
  const rx = interpolate(camP, [0, 1], [-5, -1.5]);
  const dolly = interpolate(camP, [0, 1], [0.95, 1.02]) + interpolate(frame, [52, 120], [0, 0.005], clamp);
  const panX = interpolate(camP, [0, 1], [20, 0]) + Math.sin(frame / fps * 0.4) * 2.4;

  // ACTOS
  const stageIn = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: easeOut});
  const spongeIn = interpolate(frame, [6, 24], [0, 1], {...clamp, easing: easeIO});
  const dryFloat = Math.sin(frame / fps * 1.5) * 6; // liviana: flota
  const soak = interpolate(frame, [36, 82], [0, 1], {...clamp, easing: easeIO}); // 0 seca → 1 empapada
  const streamIn = interpolate(frame, [32, 50], [0, 1], {...clamp, easing: easeOut});
  const streamOut = interpolate(frame, [76, 92], [0, 1], {...clamp, easing: easeOut});
  const stream = streamIn * (1 - streamOut);
  const vegP = interpolate(frame, [90, 122], [0, 1], {...clamp, easing: easeIO});
  const spongeFade = 1 - interpolate(frame, [92, 118], [0, 1], {...clamp, easing: easeOut}) * 0.86;

  // peso: seca sube (liviana), empapada baja y se aplasta un poco (pesada)
  const spongeY = interpolate(soak, [0, 1], [-18, 34]) + dryFloat * (1 - soak);
  const spongeSquash = interpolate(soak, [0, 1], [1, 1.06]);
  const wetTint = interpolate(soak, [0, 1], [0, 1]);

  const cx = width / 2, cy = height * 0.52;
  const Layer: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
    <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</div>
  );

  // color de la esponja: seca = amarillo pálido apagado; empapada = verde-aqua oscuro saturado
  const dryTop = '#D8CE9A', dryBot = '#9C8E52';
  const wetTop = shade(BAS.aqua, -0.35), wetBot = shade(BAS.aquaDark, -0.35);

  // pos del borde del fregadero (una lip metálica bajo la esponja)
  const SW = 900, SH = 60;

  return (
    <AbsoluteFill style={{background: moodBg('water'), perspective: 1500, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(42% 46% at 50% 40%, ${rgba(BAS.aqua, 0.12)} 0%, transparent 70%)`, opacity: stageIn}} />

      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateX(${panX}px) scale(${dolly})`, transformOrigin: '50% 52%'}}>

        {/* BORDE DEL FREGADERO — lip metálica cepillada, con highlight y sombra bajo la esponja */}
        <Layer z={-16} style={{opacity: stageIn}}>
          <div style={{position: 'absolute', left: -SW / 2, top: 90, width: SW, height: SH, borderRadius: 14,
            background: 'linear-gradient(180deg, #6E7C86 0%, #3A454E 46%, #1B242B 100%)',
            boxShadow: `inset 0 2px 0 ${rgba('#ffffff', 0.4)}, inset 0 -6px 14px ${rgba('#000000', 0.6)}, 0 26px 44px ${rgba('#000000', 0.5)}`,
            border: `1px solid ${rgba('#ffffff', 0.1)}`}}>
            {/* brillo cepillado que barre la lip */}
            <div style={{position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: 0, left: `${interpolate(frame % 140, [0, 140], [-30, 130])}%`, width: '30%', height: '100%', background: `linear-gradient(90deg, transparent, ${rgba('#EAF7FF', 0.28)}, transparent)`}} />
            </div>
          </div>
          {/* sombra de contacto de la esponja sobre la lip (se agranda cuando pesa) */}
          <div style={{position: 'absolute', left: -150, top: 96, width: 300 + soak * 60, height: 26, borderRadius: '50%', background: rgba('#000000', 0.5 + soak * 0.2), filter: 'blur(10px)'}} />
        </Layer>

        {/* CHORRO DE AGUA — cae desde arriba hacia la esponja (acto 2) */}
        <Layer z={40} style={{opacity: stream}}>
          <div style={{position: 'absolute', left: -26 + Math.sin(frame / fps * 3) * 4, top: -300, width: 52, height: 300 + spongeY,
            background: `linear-gradient(180deg, ${rgba(BAS.aquaLite, 0.05)} 0%, ${rgba(BAS.aqua, 0.5)} 40%, ${rgba(BAS.aquaLite, 0.7)} 100%)`,
            borderRadius: '40% 40% 30% 30% / 8% 8% 100% 100%', filter: 'blur(0.6px)',
            boxShadow: `0 0 26px ${rgba(BAS.aqua, 0.5)}`, mixBlendMode: 'screen'}}>
            {/* hebras internas que fluyen (deterministas) */}
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} style={{position: 'absolute', left: 10 + i * 10, top: `${(frame * (6 + i) + i * 40) % 100}%`, width: 3, height: 60, borderRadius: 3, background: rgba('#EAF7FF', 0.5)}} />
            ))}
          </div>
          {/* salpicón donde el chorro golpea la esponja */}
          <div style={{position: 'absolute', left: -70, top: spongeY - 8, width: 140, height: 44, borderRadius: '50%', background: `radial-gradient(closest-side, ${rgba(BAS.aquaLite, 0.55)}, transparent 72%)`, filter: 'blur(4px)', mixBlendMode: 'screen', opacity: streamIn * (1 - streamOut)}} />
        </Layer>

        {/* ESPONJA — cuerpo poroso; seca (arriba, pálida, liviana) → empapada (abajo, oscura, pesada) */}
        <Layer z={30} style={{opacity: spongeIn * spongeFade}}>
          <div style={{position: 'absolute', left: -160, top: -70,
            transform: `translateY(${spongeY}px) scale(1, ${spongeSquash})`,
            transformOrigin: '50% 100%'}}>
            <div style={{position: 'relative', width: 320, height: 168, borderRadius: 20,
              boxShadow: `inset 0 6px 14px ${rgba('#ffffff', 0.3 - wetTint * 0.2)}, inset 0 -14px 26px ${rgba('#000000', 0.45 + wetTint * 0.25)}, 0 24px 40px ${rgba('#000000', 0.5)}`,
              border: `1px solid ${rgba('#000000', 0.2)}`, overflow: 'hidden'}}>
              {/* base de color que vira de seca a empapada */}
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${dryTop}, ${dryBot})`, opacity: 1 - wetTint}} />
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${wetTop}, ${wetBot})`, opacity: wetTint}} />
              {/* POROS celulares (patrón determinista) — más oscuros y húmedos al empaparse */}
              {Array.from({length: 42}).map((_, i) => {
                const col = i % 7, row = Math.floor(i / 7);
                const px = 26 + col * 42 + (row % 2) * 12;
                const py = 20 + row * 26;
                const rr = 6 + ((i * 13) % 5);
                return <div key={i} style={{position: 'absolute', left: px, top: py, width: rr * 2, height: rr * 2, borderRadius: '50%',
                  background: `radial-gradient(circle at 40% 35%, ${rgba('#000000', 0.18 + wetTint * 0.24)}, transparent 72%)`,
                  boxShadow: `inset 0 1px 2px ${rgba('#000000', 0.3)}, 0 -1px 0 ${rgba('#ffffff', 0.14 - wetTint * 0.1)}`}} />;
              })}
              {/* film de agua brillante arriba cuando está empapada */}
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(BAS.aquaLite, 0.35)}, transparent 40%)`, opacity: wetTint, mixBlendMode: 'screen'}} />
            </div>
          </div>
        </Layer>

        {/* CHORREO — gotas reales que se desprenden del borde inferior (acto 2 y 3) */}
        <Layer z={48} style={{opacity: interpolate(frame, [58, 74], [0, 1], clamp)}}>
          {Array.from({length: 6}).map((_, i) => {
            const s = (i * 37.3) % 100;
            const dx = -120 + (s / 100) * 240;
            const cycle = ((frame * (2.4 + (i % 3) * 0.6) + s * 4) % 130);
            const dy = 60 + spongeY + cycle * 1.5;
            const fade = interpolate(cycle, [0, 12, 110, 130], [0, 1, 1, 0], clamp);
            const r = 7 + (i % 3) * 2;
            const tint = vegP > 0.5 ? shade(BAS.si, -0.35) : BAS.aqua;
            return <Drop key={i} x={dx} y={dy} r={r} tint={tint} op={fade} />;
          })}
        </Layer>

        {/* VERDURA CONCENTRADA — hoja/raíz oscura que reemplaza a la esponja (mismo peso visual) */}
        <Layer z={34} style={{opacity: vegP}}>
          <div style={{position: 'absolute', left: -150, top: -80,
            transform: `translateY(${34 + Math.sin(frame / fps * 1.2) * 4}px) scale(${interpolate(vegP, [0, 1], [0.9, 1])})`,
            filter: `drop-shadow(0 26px 40px ${rgba('#000000', 0.55)})`}}>
            <svg width={300} height={230} viewBox="0 0 300 230">
              <defs>
                <radialGradient id="leaf" cx="42%" cy="30%" r="80%">
                  <stop offset="0" stopColor={shade(BAS.si, -0.1)} />
                  <stop offset="0.55" stopColor={shade(BAS.si, -0.4)} />
                  <stop offset="1" stopColor={shade(BAS.siDark, -0.45)} />
                </radialGradient>
                <linearGradient id="leafHi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={rgba('#EAFBF0', 0.5)} />
                  <stop offset="0.4" stopColor="transparent" />
                </linearGradient>
              </defs>
              {/* hoja carnosa (acelga/remolacha oscura) */}
              <path d="M150 18 C 66 40 30 128 84 196 C 120 226 180 226 216 196 C 270 128 234 40 150 18 Z" fill="url(#leaf)" stroke={rgba('#000000', 0.35)} strokeWidth={2} />
              <path d="M150 18 C 66 40 30 128 84 196 C 120 226 180 226 216 196 C 270 128 234 40 150 18 Z" fill="url(#leafHi)" opacity={0.8} />
              {/* nervadura central + laterales */}
              <path d="M150 30 L150 206" stroke={rgba('#0B2A18', 0.7)} strokeWidth={5} fill="none" strokeLinecap="round" />
              {Array.from({length: 5}).map((_, i) => {
                const yy = 60 + i * 30;
                return <g key={i}>
                  <path d={`M150 ${yy} C 118 ${yy + 6} 96 ${yy + 20} 80 ${yy + 40}`} stroke={rgba('#0B2A18', 0.5)} strokeWidth={3} fill="none" strokeLinecap="round" />
                  <path d={`M150 ${yy} C 182 ${yy + 6} 204 ${yy + 20} 220 ${yy + 40}`} stroke={rgba('#0B2A18', 0.5)} strokeWidth={3} fill="none" strokeLinecap="round" />
                </g>;
              })}
              {/* gotas concentradas sobre la hoja */}
              <circle cx={116} cy={96} r={9} fill={rgba('#EAFBF0', 0.28)} stroke={rgba('#ffffff', 0.3)} />
              <circle cx={186} cy={140} r={7} fill={rgba('#EAFBF0', 0.24)} stroke={rgba('#ffffff', 0.28)} />
            </svg>
          </div>
        </Layer>

        {/* ROTULO de estado — chip acrílico que cambia SECA → EMPAPADA → CONCENTRADA */}
        <Layer z={62} style={{opacity: spongeIn}}>
          <div style={{position: 'absolute', left: 210, top: -30, whiteSpace: 'nowrap'}}>
            {(() => {
              const isVeg = vegP > 0.55;
              const isWet = soak > 0.5 && !isVeg;
              const label = isVeg ? vegLabel : isWet ? wetLabel : dryLabel;
              const col = isVeg ? BAS.amber : isWet ? BAS.aqua : BAS.inkSoft;
              const colDeep = isVeg ? BAS.amberDark : isWet ? BAS.aquaDark : shade(BAS.inkSoft, -0.3);
              const onCol = isVeg ? BAS.onAmber : '#06303B';
              return (
                <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 26px', borderRadius: 999,
                  background: `linear-gradient(150deg, ${shade(col, 0.28)}, ${col} 55%, ${shade(colDeep, -0.1)})`,
                  border: `1px solid ${rgba('#ffffff', 0.26)}`,
                  boxShadow: `inset 0 2px 0 ${rgba('#ffffff', 0.35)}, inset 0 -3px 8px ${rgba('#000000', 0.4)}, 0 16px 30px ${rgba('#000000', 0.45)}, 0 0 24px ${rgba(col, 0.4)}`,
                  transform: `translateY(${interpolate(isVeg ? vegP : 1, [0, 1], [8, 0])}px)`}}>
                  <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 800, letterSpacing: 3, color: onCol, textShadow: `0 1px 0 ${rgba('#ffffff', 0.2)}`}}>{label}</span>
                </div>
              );
            })()}
          </div>
        </Layer>

        {/* CAPTION grabado (una línea, debajo) */}
        <Layer z={12} style={{opacity: interpolate(frame, [70, 92], [0, 1], clamp)}}>
          <div style={{position: 'absolute', left: -420, top: 150, width: 840, textAlign: 'center'}}>
            <span style={{fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 500, letterSpacing: 1.5, color: 'rgba(220,235,240,0.72)', textShadow: `0 1px 0 ${rgba('#ffffff', 0.08)}, 0 -1px 0 ${rgba('#000000', 0.6)}`, lineHeight: 1.35}}>{caption}</span>
          </div>
        </Layer>
      </AbsoluteFill>

      <GrainOverlay opacity={0.05} />
      <CoolVignette strength={0.46} />
    </AbsoluteFill>
  );
};
