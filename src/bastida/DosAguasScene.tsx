/**
 * DosAguasScene — microescena 2.5D dirigida: la regla de oro de "LAS DOS AGUAS".
 * FIRMA nueva del video. Coreografía por ACTOS:
 *   (1) OLLA con trozos de papa HIRVIENDO en agua turbia (burbujas + vapor).
 *   (2) se TIRA el agua turbia/gris por el DESAGÜE (el gesto clave: baja el nivel y chorrea al drenaje).
 *   (3) AGUA NUEVA, limpia: la olla se rellena de agua clara aqua.
 *   (4) MEDIDOR acrílico que cuenta de 0 a ~50%: "≈ la mitad del potasio se fue con el agua".
 * Profundidad real (perspective + translateZ), luz de producto, cámara dolly-in que revela.
 * TODO determinista (useCurrentFrame/interpolate) — nada de Date/random → seguro en el farm por chunks.
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, FONT_NUM, rgba, shade, moodBg, GrainOverlay, CoolVignette} from './theme';

const easeOut = Easing.out(Easing.cubic);
const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type DosAguasSceneProps = {
  meterPct?: number; // objetivo del count-up (por defecto ~50 = la mitad)
  meterCaption?: string;
  meterSub?: string;
  step1?: string;
  step2?: string;
  step3?: string;
};

export const DosAguasScene: React.FC<DosAguasSceneProps> = ({
  meterPct = 50,
  meterCaption = 'del potasio',
  meterSub = 'se fue con el agua',
  step1 = 'HIERVA',
  step2 = 'TIRE EL AGUA',
  step3 = 'AGUA NUEVA',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // cámara
  const camP = interpolate(frame, [0, 54], [0, 1], {...clamp, easing: easeIO});
  const ry = interpolate(camP, [0, 1], [-7.5, -1.5]) + Math.sin(frame / fps * 0.5) * 0.35;
  const rx = interpolate(camP, [0, 1], [-5, -1.5]);
  const dolly = interpolate(camP, [0, 1], [0.95, 1.02]) + interpolate(frame, [54, 130], [0, 0.005], clamp);
  const panX = interpolate(camP, [0, 1], [22, 0]) + Math.sin(frame / fps * 0.4) * 2.4;

  // ACTOS
  const stageIn = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: easeOut});
  const potIn = interpolate(frame, [4, 22], [0, 1], {...clamp, easing: easeIO});
  // nivel de agua dentro de la olla: llena → drena → rellena limpia
  const level = interpolate(frame, [0, 44, 74, 88, 116], [150, 150, 16, 16, 150], {...clamp, easing: easeIO});
  // turbidez: 1 (gris/hervido) hasta que se drena; 0 (limpia) al rellenar
  const turb = interpolate(frame, [78, 92], [1, 0], clamp);
  // burbujas de hervor: fuertes en acto1, se apagan al drenar
  const boil = interpolate(frame, [8, 20, 60, 72], [0, 1, 1, 0], clamp);
  // chorro al desagüe (gesto clave)
  const drain = interpolate(frame, [46, 58, 78, 88], [0, 1, 1, 0], clamp);
  // vapor: acto1 (turbio caliente) y acto3 (agua nueva caliente)
  const steamA = interpolate(frame, [10, 24, 52, 62], [0, 1, 1, 0], clamp);
  const steamB = interpolate(frame, [96, 112], [0, 1], clamp) * interpolate(frame, [140, 150], [1, 0.4], clamp);
  const steam = Math.max(steamA, steamB);
  // medidor (acto 4): count-up determinista
  const meterIn = interpolate(frame, [98, 116], [0, 1], {...clamp, easing: easeIO});
  const countP = interpolate(frame, [102, 142], [0, 1], {...clamp, easing: easeOut});
  const meterVal = Math.round(interpolate(countP, [0, 1], [0, meterPct]));

  // color del agua según turbidez
  const waterTop = turb > 0.5 ? '#9A9686' : shade(BAS.aqua, -0.1);
  const waterBot = turb > 0.5 ? '#6A6656' : shade(BAS.aquaDark, -0.1);
  const waterTint = interpolate(turb, [0, 1], [0, 1]);

  const cx = width / 2, cy = height * 0.52;
  const Layer: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
    <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</div>
  );

  // geometría de la olla (a la izquierda; medidor a la derecha)
  const potL = -430, potT = -70, POTW = 360, POTH = 210;
  const innerX = potL + 24, innerW = POTW - 48, innerBottom = potT + POTH - 12;

  return (
    <AbsoluteFill style={{background: moodBg(turb > 0.5 ? 'alert' : 'water'), perspective: 1500, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(42% 46% at 40% 40%, ${rgba(turb > 0.5 ? BAS.amber : BAS.aqua, 0.12)} 0%, transparent 70%)`, opacity: stageIn}} />

      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateX(${panX}px) scale(${dolly})`, transformOrigin: '46% 52%'}}>

        {/* VAPOR detrás (sube de la olla) */}
        <Layer z={-18} style={{opacity: steam * 0.9}}>
          {Array.from({length: 6}).map((_, i) => {
            const s = (i * 61) % 100;
            const x = potL + 70 + (s / 100) * 200;
            const rise = 40 - ((frame * (1.4 + (s % 4) * 0.3) + s * 6) % 150);
            const sway = Math.sin(frame / fps * 1.1 + i) * 22;
            return <div key={i} style={{position: 'absolute', left: x + sway, top: rise, width: 60 + (s % 40), height: 150, borderRadius: '50%', background: `radial-gradient(closest-side, ${rgba('#DCEBF0', 0.16)}, transparent 70%)`, filter: 'blur(16px)'}} />;
          })}
        </Layer>

        {/* DESAGÜE (plato de drenaje bajo la olla) + chorro turbio que cae (acto 2) */}
        <Layer z={20}>
          {/* plato/rejilla del drenaje */}
          <div style={{position: 'absolute', left: potL + 66, top: potT + POTH + 120, width: 220, height: 46, borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 30%, #3A454E, #10171C 80%)',
            boxShadow: `inset 0 4px 10px ${rgba('#000000', 0.7)}, 0 10px 20px ${rgba('#000000', 0.5)}`, opacity: potIn}}>
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} style={{position: 'absolute', left: 20 + i * 38, top: 8, width: 8, height: 30, borderRadius: 4, background: rgba('#000000', 0.6), boxShadow: `1px 0 0 ${rgba('#ffffff', 0.08)}`}} />
            ))}
            {/* charco gris que se acumula */}
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${rgba('#8A8676', 0.5)}, transparent 70%)`, opacity: drain, mixBlendMode: 'screen'}} />
          </div>
          {/* CHORRO turbio de la olla al desagüe */}
          <div style={{position: 'absolute', left: potL + 150 + Math.sin(frame / fps * 4) * 3, top: potT + POTH - 20, width: 30, height: 150,
            background: `linear-gradient(180deg, ${rgba('#9A9686', 0.85)} 0%, ${rgba('#7A7666', 0.75)} 100%)`,
            borderRadius: '30% 30% 20% 20% / 6% 6% 100% 100%', filter: 'blur(0.5px)', opacity: drain,
            boxShadow: `0 0 14px ${rgba('#000000', 0.4)}`}}>
            {Array.from({length: 3}).map((_, i) => (
              <div key={i} style={{position: 'absolute', left: 6 + i * 8, top: `${(frame * 8 + i * 40) % 100}%`, width: 3, height: 30, borderRadius: 3, background: rgba('#C9C4B0', 0.5)}} />
            ))}
          </div>
        </Layer>

        {/* OLLA — cuerpo metálico */}
        <Layer z={0} style={{opacity: potIn, transform: `translate(-50%,-50%) translateZ(0px) translateY(${interpolate(potIn, [0, 1], [30, 0])}px)`}}>
          {/* asas */}
          <div style={{position: 'absolute', left: potL - 34, top: potT + 40, width: 44, height: 26, borderRadius: 14, background: 'linear-gradient(180deg,#5A666E,#232C33)', border: `1px solid ${rgba('#ffffff', 0.12)}`, boxShadow: `inset 0 2px 0 ${rgba('#ffffff', 0.25)}, 0 6px 12px ${rgba('#000000', 0.5)}`}} />
          <div style={{position: 'absolute', left: potL + POTW - 10, top: potT + 40, width: 44, height: 26, borderRadius: 14, background: 'linear-gradient(180deg,#5A666E,#232C33)', border: `1px solid ${rgba('#ffffff', 0.12)}`, boxShadow: `inset 0 2px 0 ${rgba('#ffffff', 0.25)}, 0 6px 12px ${rgba('#000000', 0.5)}`}} />

          {/* cuerpo */}
          <div style={{position: 'absolute', left: potL, top: potT, width: POTW, height: POTH,
            borderRadius: '16px 16px 90px 90px / 16px 16px 50px 50px',
            background: 'linear-gradient(180deg, #7C8891 0%, #4A555D 40%, #2A333A 100%)',
            border: `1px solid ${rgba('#ffffff', 0.14)}`,
            boxShadow: `inset 0 3px 0 ${rgba('#ffffff', 0.3)}, inset 0 -18px 30px ${rgba('#000000', 0.6)}, inset 22px 0 40px ${rgba('#000000', 0.4)}, 0 34px 60px ${rgba('#000000', 0.55)}`,
            overflow: 'hidden'}}>
            {/* AGUA dentro (nivel + color animados), anclada al fondo */}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: level, overflow: 'hidden'}}>
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${waterTop}, ${waterBot})`}} />
              {/* turbidez: velo grisáceo por encima del tinte limpio */}
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, #A6A290, #6E6A58)`, opacity: waterTint * 0.8, mixBlendMode: 'multiply'}} />
              {/* brillo de superficie */}
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: `linear-gradient(180deg, ${rgba('#ffffff', 0.4)}, transparent)`}} />
              {/* BURBUJAS de hervor (deterministas) */}
              {Array.from({length: 14}).map((_, i) => {
                const s = (i * 43.7) % 100;
                const bx = 12 + (s / 100) * (innerW - 24);
                const cycle = (frame * (2.2 + (i % 4) * 0.5) + s * 4) % 100;
                const by = level - 8 - (cycle / 100) * (level - 16);
                const rr = 3 + (i % 4);
                const fade = interpolate(cycle, [0, 15, 80, 100], [0, 1, 1, 0], clamp) * boil;
                return <div key={i} style={{position: 'absolute', left: bx, top: by, width: rr * 2, height: rr * 2, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, ${rgba('#ffffff', 0.6)}, ${rgba('#ffffff', 0.05)} 70%)`, opacity: fade}} />;
              })}
            </div>

            {/* TROZOS DE PAPA flotando (cremosos, con sombra) — solo mientras hay agua turbia/hervor */}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: POTH, opacity: interpolate(frame, [12, 24, 66, 78], [0, 1, 1, 0], clamp)}}>
              {[[70, 40, 30], [150, 26, 24], [210, 52, 27], [110, 60, 22]].map(([px, phase, rr], i) => {
                const bob = Math.sin(frame / fps * 1.6 + phase) * 4;
                const py = innerBottom - Math.min(level, 120) + 8 + (i % 2) * 16 + bob - potT;
                return (
                  <div key={i} style={{position: 'absolute', left: innerX - potL + (px as number), top: py, width: (rr as number) * 2, height: (rr as number) * 1.7, borderRadius: '46% 54% 50% 50% / 58% 58% 42% 42%',
                    background: `radial-gradient(58% 55% at 40% 34%, #F0E4C4, #D8C79A 55%, #B49F6E 100%)`,
                    boxShadow: `inset 0 -3px 6px ${rgba('#6E5A2E', 0.5)}, 0 4px 8px ${rgba('#000000', 0.4)}`,
                    border: `1px solid ${rgba('#8A7440', 0.4)}`}} />
                );
              })}
            </div>

            {/* reflejo interior del metal */}
            <div style={{position: 'absolute', left: 0, top: 0, width: '38%', height: '100%', background: `linear-gradient(90deg, ${rgba('#ffffff', 0.14)}, transparent 70%)`, pointerEvents: 'none'}} />
          </div>

          {/* borde/rim elíptico de la boca de la olla */}
          <div style={{position: 'absolute', left: potL - 6, top: potT - 14, width: POTW + 12, height: 42, borderRadius: '50%',
            background: 'linear-gradient(180deg, #909CA4 0%, #545F67 55%, #2C353C 100%)',
            border: `1px solid ${rgba('#ffffff', 0.2)}`,
            boxShadow: `inset 0 3px 0 ${rgba('#ffffff', 0.4)}, inset 0 -6px 14px ${rgba('#000000', 0.6)}, 0 8px 16px ${rgba('#000000', 0.5)}`}}>
            {/* interior oscuro visible de la boca */}
            <div style={{position: 'absolute', left: 16, top: 8, right: 16, bottom: 6, borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%, #1A2228, #070B0E)'}} />
          </div>
        </Layer>

        {/* PASOS 1·2·3 — mini-índice que se ilumina según el acto */}
        <Layer z={40} style={{opacity: potIn}}>
          <div style={{position: 'absolute', left: potL + 30, top: potT + POTH + 60, display: 'flex', gap: 14}}>
            {[step1, step2, step3].map((st, i) => {
              const active = (i === 0 && frame < 46) || (i === 1 && frame >= 46 && frame < 88) || (i === 2 && frame >= 88);
              const col = i === 1 ? BAS.amber : BAS.aqua;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999,
                  background: active ? `linear-gradient(150deg, ${shade(col, 0.25)}, ${col} 60%, ${shade(col, -0.25)})` : rgba('#12222E', 0.7),
                  border: `1px solid ${active ? rgba('#ffffff', 0.28) : BAS.line}`,
                  boxShadow: active ? `0 0 18px ${rgba(col, 0.5)}, inset 0 1px 0 ${rgba('#ffffff', 0.3)}` : 'none',
                  opacity: active ? 1 : 0.5}}>
                  <span style={{fontFamily: FONT_NUM, fontSize: 20, fontWeight: 800, color: active ? '#06303B' : BAS.inkSoft}}>{i + 1}</span>
                  <span style={{fontFamily: FONT_SANS, fontSize: 20, fontWeight: 700, letterSpacing: 2, color: active ? '#06303B' : BAS.onDark}}>{st}</span>
                </div>
              );
            })}
          </div>
        </Layer>

        {/* MEDIDOR acrílico (acto 4) — count-up 0 → ~50% */}
        <Layer z={64} style={{opacity: meterIn}}>
          <div style={{position: 'absolute', left: 90, top: -180, width: 470,
            transform: `translateY(${interpolate(meterIn, [0, 1], [24, 0])}px)`}}>
            {/* panel de vidrio ahumado */}
            <div style={{position: 'absolute', left: -30, top: -30, right: -30, bottom: -30, borderRadius: 28,
              background: 'linear-gradient(150deg, rgba(16,22,28,0.7) 0%, rgba(6,12,16,0.82) 100%)',
              border: `1px solid ${rgba('#ffffff', 0.08)}`,
              boxShadow: `inset 0 2px 0 ${rgba('#ffffff', 0.12)}, 0 40px 80px ${rgba('#000000', 0.55)}`}} />

            {/* aro de progreso + número */}
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 26}}>
              <svg width={220} height={220} viewBox="0 0 220 220" style={{filter: `drop-shadow(0 0 22px ${rgba(BAS.aqua, 0.4)})`}}>
                <circle cx={110} cy={110} r={92} fill="none" stroke={rgba('#ffffff', 0.08)} strokeWidth={20} />
                <circle cx={110} cy={110} r={92} fill="none" stroke="url(#mg)" strokeWidth={20} strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 92}
                  strokeDashoffset={2 * Math.PI * 92 * (1 - (meterVal / 100))}
                  transform="rotate(-90 110 110)" />
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={BAS.aquaLite} />
                    <stop offset="1" stopColor={BAS.aquaDark} />
                  </linearGradient>
                </defs>
              </svg>
              {/* número grande dentro del aro */}
              <div style={{position: 'absolute', left: 0, top: 0, width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{fontFamily: FONT_NUM, fontSize: 78, fontWeight: 800, lineHeight: 1,
                  backgroundImage: `linear-gradient(150deg, ${BAS.aquaLite}, ${BAS.aqua} 55%, ${BAS.aquaDark})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  filter: `drop-shadow(0 0 18px ${rgba(BAS.aqua, 0.4)})`}}>≈{meterVal}%</span>
              </div>
              {/* etiqueta */}
              <div style={{position: 'relative'}}>
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 700, color: '#EEF3F6', lineHeight: 1.05, textShadow: `0 2px 18px ${rgba('#000000', 0.6)}`}}>{meterCaption}</div>
                <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 500, letterSpacing: 2, color: 'rgba(220,235,240,0.6)', marginTop: 6}}>{meterSub.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </Layer>
      </AbsoluteFill>

      <GrainOverlay opacity={0.05} />
      <CoolVignette strength={0.46} />
    </AbsoluteFill>
  );
};
