// Kit de componentes para el video "Agua de Jamaica / piel" (Dr. Valler).
// Reusa las primitivas de VallerAceitesKit (mismo lenguaje visual dark-cinematic:
// Eyebrow, MediaMotion, VallerFilmLayers, paleta INK/IVORY/MINT/GOLD) + agrega CARMIN
// (acento propio del hibisco) y componentes NUEVOS, parametrizados (no hardcodeados
// como los de aceites), para poder anclarlos a cualquier frase del guion.
import React from "react";
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {CLAMP, EASE, Eyebrow, GOLD, IVORY, INK, MediaMotion, VallerFilmLayers, fade, rgba} from "./VallerAceitesKit";

export const CARMIN = "#B23A48";

const LightSweep: React.FC<{opacity?: number}> = ({opacity = 0.5}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: ((frame * 3.1) % 2400) - 400,
        top: -260,
        width: 190,
        height: 1500,
        transform: "rotate(21deg)",
        background: "linear-gradient(90deg,transparent,rgba(255,214,150,.5),transparent)",
        filter: "blur(22px)",
        mixBlendMode: "screen",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// ── DepthImageScene: escena full-bleed con foto (Ken-Burns) + texto, avatar oculto ──
export const DepthImageScene: React.FC<{
  duration: number;
  src: string;
  kicker: string;
  title: string;
  titleAccentWord?: string;
  sub?: string;
  accent?: string;
  position?: string;
  sweep?: boolean;
}> = ({duration, src, kicker, title, titleAccentWord, sub, accent = CARMIN, position = "center", sweep = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 95, mass: 0.95}, durationInFrames: 36});
  const parts = titleAccentWord ? title.split(titleAccentWord) : [title, ""];
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), overflow: "hidden", background: INK}}>
      <MediaMotion src={src} type="image" duration={duration} position={position} dim={0.22} />
      {sweep ? <LightSweep opacity={0.4} /> : null}
      <div style={{position: "absolute", left: 110, bottom: 118, width: 900, opacity: enter, transform: `translateY(${(1 - enter) * 65}px)`}}>
        <Eyebrow accent={accent}>{kicker}</Eyebrow>
        <div style={{marginTop: 20, fontFamily: "Arial, sans-serif", fontSize: 68, fontWeight: 900, lineHeight: 0.98, letterSpacing: -3, color: "white"}}>
          {parts[0]}
          {titleAccentWord ? <span style={{color: accent}}>{titleAccentWord}</span> : null}
          {parts[1]}
        </div>
        {sub ? <div style={{marginTop: 22, width: 720, fontFamily: "Georgia, serif", fontSize: 24, fontStyle: "italic", lineHeight: 1.36, color: "rgba(255,255,255,.72)"}}>{sub}</div> : null}
      </div>
      <VallerFilmLayers accent={accent} />
    </AbsoluteFill>
  );
};

// ── QuoteCard: cita grande, genérica (reemplaza a TruthCard, parametrizada) ──
export const QuoteCard: React.FC<{
  duration: number;
  kicker: string;
  big: string;
  bigAccent?: string;
  sub?: string;
  accent?: string;
  bgImage?: string;
}> = ({duration, kicker, big, bigAccent, sub, accent = CARMIN, bgImage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 4, fps, config: {damping: 18, stiffness: 105}, durationInFrames: 38});
  const line = interpolate(frame, [20, 65], [0, 1], {...CLAMP, easing: EASE});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: `radial-gradient(circle at 72% 28%,${rgba(accent, 0.22)} 0%,#0a1013 43%,#03080a 100%)`, overflow: "hidden"}}>
      {bgImage ? (
        <Img src={staticFile(bgImage)} style={{position: "absolute", right: -80, top: -30, width: 980, height: 1140, objectFit: "cover", opacity: 0.42, filter: "saturate(.7) contrast(1.1) blur(1px)", transform: `scale(${1.04 + frame / duration * 0.05})`}} />
      ) : null}
      <AbsoluteFill style={{background: "linear-gradient(90deg,#070c0e 0%,rgba(7,12,14,.88) 42%,rgba(7,12,14,.2) 100%)"}} />
      <div style={{position: "absolute", left: 118, top: 220, width: 900, opacity: enter, transform: `translateY(${(1 - enter) * 70}px)`}}>
        <Eyebrow accent={accent}>{kicker}</Eyebrow>
        <div style={{marginTop: 22, fontFamily: "Arial, sans-serif", fontSize: 72, fontWeight: 900, lineHeight: 1.02, letterSpacing: -3.2, color: bigAccent ? "white" : accent}}>
          {big}
        </div>
        {sub ? <div style={{marginTop: 30, width: 700, fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic", lineHeight: 1.35, color: "rgba(255,255,255,.74)"}}>{sub}</div> : null}
        <div style={{marginTop: 30, width: `${520 * line}px`, height: 5, borderRadius: 99, background: `linear-gradient(90deg,${accent},transparent)`}} />
      </div>
      <VallerFilmLayers accent={accent} />
    </AbsoluteFill>
  );
};

// ── SplitCompare: comparación en dos mitades (costo, cifras) ──
export const SplitCompare: React.FC<{
  duration: number;
  kicker: string;
  heading: string;
  left: {label: string; big: string; sub?: string; accent?: string};
  right: {label: string; big: string; sub?: string; accent?: string};
}> = ({duration, kicker, heading, left, right}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enterL = spring({frame, fps, config: {damping: 18, stiffness: 95}, durationInFrames: 36});
  const enterR = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 95}, durationInFrames: 36});
  const la = left.accent ?? "#C98B6E";
  const ra = right.accent ?? CARMIN;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 78, textAlign: "center"}}>
        <Eyebrow accent={GOLD}><span style={{display: "inline-block", width: 540, textAlign: "center"}}>{kicker}</span></Eyebrow>
        <div style={{marginTop: 15, fontFamily: "Arial, sans-serif", fontSize: 52, fontWeight: 900, letterSpacing: -2, color: IVORY}}>{heading}</div>
      </div>
      <div style={{position: "absolute", left: 130, top: 270, width: 780, height: 640, borderRadius: 26, background: "rgba(255,255,255,.045)", border: `1px solid ${rgba(la, 0.4)}`, opacity: enterL, transform: `translateY(${(1 - enterL) * 60}px)`, padding: "46px 44px"}}>
        <div style={{fontFamily: "Arial, sans-serif", fontSize: 16, fontWeight: 850, letterSpacing: ".18em", textTransform: "uppercase", color: la}}>{left.label}</div>
        <div style={{marginTop: 26, fontFamily: "Arial, sans-serif", fontSize: 66, fontWeight: 950, lineHeight: 1.02, color: "white"}}>{left.big}</div>
        {left.sub ? <div style={{marginTop: 22, fontFamily: "Georgia, serif", fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,.62)"}}>{left.sub}</div> : null}
      </div>
      <div style={{position: "absolute", right: 130, top: 270, width: 780, height: 640, borderRadius: 26, background: rgba(ra, 0.1), border: `1px solid ${rgba(ra, 0.55)}`, opacity: enterR, transform: `translateY(${(1 - enterR) * 60}px)`, padding: "46px 44px", boxShadow: `0 0 60px ${rgba(ra, 0.16)}`}}>
        <div style={{fontFamily: "Arial, sans-serif", fontSize: 16, fontWeight: 850, letterSpacing: ".18em", textTransform: "uppercase", color: ra}}>{right.label}</div>
        <div style={{marginTop: 26, fontFamily: "Arial, sans-serif", fontSize: 66, fontWeight: 950, lineHeight: 1.02, color: "white"}}>{right.big}</div>
        {right.sub ? <div style={{marginTop: 22, fontFamily: "Georgia, serif", fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,.68)"}}>{right.sub}</div> : null}
      </div>
      <div style={{position: "absolute", left: "50%", top: 300, bottom: 130, width: 2, background: "linear-gradient(transparent,rgba(255,255,255,.22),transparent)"}} />
      <VallerFilmLayers accent={ra} />
    </AbsoluteFill>
  );
};

// ── SixMechanismsOrbit: índice de los 6 mecanismos (clon simplificado de SevenOilOrbit) ──
const MECHS = [
  {n: "01", name: "ANTIOXIDANTES", tag: "Antocianinas vs. radicales libres", accent: "#B23A48"},
  {n: "02", name: "COLÁGENO", tag: "Vitamina C, cofactor real", accent: "#D8B56D"},
  {n: "03", name: "ÁCIDOS SUAVES", tag: "Tipo AHA, exfoliación gradual", accent: "#C98B6E"},
  {n: "04", name: "ASTRINGENTE", tag: "Taninos, poros más finos", accent: "#A8D5C6"},
  {n: "05", name: "ANTIINFLAMATORIO", tag: "Flavonoides, menos rojez", accent: "#9FCFE4"},
  {n: "06", name: "TONO PAREJO", tag: "Menos manchas, más luminosidad", accent: "#E8A06A"},
] as const;

export const SixMechanismsOrbit: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame, fps, config: {damping: 19, stiffness: 92}, durationInFrames: 40});
  const revealStart = 16;
  const revealEnd = Math.max(revealStart + 6, duration - 40);
  const revealStep = (revealEnd - revealStart) / 6;
  const active = Math.max(0, Math.min(5, Math.floor((frame - revealStart + revealStep * 0.2) / revealStep)));
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: INK, overflow: "hidden", perspective: 1200}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%,${rgba(CARMIN, 0.28)},rgba(4,10,13,.94) 68%)`}} />
      <div style={{position: "absolute", top: 68, left: 0, right: 0, textAlign: "center", opacity: appear}}>
        <Eyebrow accent={GOLD}><span style={{display: "inline-block", width: 540, textAlign: "center"}}>Los seis mecanismos</span></Eyebrow>
        <div style={{marginTop: 14, fontFamily: "Arial, sans-serif", fontSize: 52, fontWeight: 900, letterSpacing: -2.2, color: IVORY}}>POR QUÉ ESTA FLOR SÍ FUNCIONA</div>
      </div>
      <div style={{position: "absolute", left: 95, right: 95, top: 245, height: 660, transformStyle: "preserve-3d"}}>
        {MECHS.map((m, index) => {
          const row = index < 3 ? 0 : 1;
          const col = index < 3 ? index : index - 3;
          const w = 480;
          const gap = 66;
          const totalW = 3 * w + 2 * gap;
          const left = (1730 - totalW) / 2 + col * (w + gap);
          const revealAt = revealStart + index * revealStep;
          const reveal = interpolate(frame, [revealAt - 8, revealAt + 16], [0, 1], {...CLAMP, easing: EASE});
          const isActive = index === active && reveal > 0.05;
          const isPast = index < active;
          const isFuture = !isActive && !isPast;
          const floatY = Math.sin((frame + index * 21) / (isActive ? 24 : 31)) * (isActive ? 4 : 9);
          return (
            <div
              key={m.n}
              style={{
                position: "absolute",
                left,
                top: row * 320 + floatY,
                width: w,
                height: 280,
                borderRadius: 22,
                overflow: "hidden",
                opacity: appear * (isActive ? 1 : isPast ? 0.72 : 0.4),
                transform: `scale(${isActive ? 1.03 : 0.97})`,
                background: isActive ? IVORY : "rgba(12,22,25,.82)",
                border: `1px solid ${isActive ? rgba(m.accent, 0.82) : "rgba(255,255,255,.1)"}`,
                boxShadow: isActive ? `0 34px 90px rgba(0,0,0,.6),0 0 50px ${rgba(m.accent, 0.28)}` : "0 22px 55px rgba(0,0,0,.35)",
                padding: "30px 30px",
              }}
            >
              <div style={{fontFamily: "Arial, sans-serif", fontSize: 56, fontWeight: 950, color: isActive ? rgba(m.accent, 0.85) : "rgba(255,255,255,.28)"}}>{m.n}</div>
              <div style={{position: "absolute", left: 0, right: 0, top: 96, height: 4, background: isActive ? m.accent : isPast ? rgba(m.accent, 0.42) : "rgba(255,255,255,.08)", transformOrigin: "left center", transform: `scaleX(${isActive ? reveal : isPast ? 1 : 0.18})`}} />
              <div style={{position: "absolute", left: 30, right: 26, bottom: 26, filter: `blur(${isFuture ? (1 - reveal) * 12 : 0}px)`}}>
                <div style={{fontFamily: "Arial, sans-serif", fontSize: 30, fontWeight: 900, lineHeight: 1.02, color: isActive ? INK : "white"}}>{m.name}</div>
                <div style={{marginTop: 10, fontFamily: "Georgia, serif", fontSize: 17, fontStyle: "italic", color: isActive ? "rgba(7,16,20,.62)" : "rgba(255,255,255,.56)"}}>{m.tag}</div>
              </div>
            </div>
          );
        })}
      </div>
      <VallerFilmLayers accent={MECHS[active].accent} />
    </AbsoluteFill>
  );
};

// ── RecipeSteps: receta en N pasos (genérico, reemplaza ApplicationSteps) ──
export const RecipeSteps: React.FC<{
  duration: number;
  kicker: string;
  heading: string;
  steps: {n: string; title: string; sub: string}[];
  accent?: string;
}> = ({duration, kicker, heading, steps, accent = GOLD}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = Math.min(steps.length - 1, Math.floor(interpolate(frame, [18, Math.max(19, duration - 14)], [0, steps.length], CLAMP)));
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "linear-gradient(135deg,#0a0e10,#2a1a1c)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 82, textAlign: "center"}}>
        <Eyebrow accent={accent}><span style={{display: "inline-block", width: 520, textAlign: "center"}}>{kicker}</span></Eyebrow>
        <div style={{marginTop: 16, fontFamily: "Arial, sans-serif", fontSize: 54, fontWeight: 900, color: IVORY}}>{heading}</div>
      </div>
      <div style={{position: "absolute", left: 120, right: 120, top: 295, display: "flex", gap: 40, justifyContent: "center"}}>
        {steps.map((s, i) => {
          const e = spring({frame: frame - i * 8, fps, config: {damping: 18, stiffness: 100}, durationInFrames: 34});
          const is = i === active;
          return (
            <div key={s.n} style={{position: "relative", width: 500, height: 460, borderRadius: 28, padding: "42px 38px", background: is ? IVORY : "rgba(255,255,255,.055)", border: `1px solid ${is ? rgba(accent, 0.75) : "rgba(255,255,255,.12)"}`, boxShadow: is ? "0 38px 100px rgba(0,0,0,.48)" : "0 20px 55px rgba(0,0,0,.25)", opacity: e * (is ? 1 : 0.62), transform: `translateY(${(1 - e) * 70}px) scale(${is ? 1.03 : 0.96})`}}>
              <div style={{fontFamily: "Arial, sans-serif", fontSize: 92, fontWeight: 950, color: is ? rgba(accent, 0.3) : "rgba(255,255,255,.1)"}}>{s.n}</div>
              <div style={{marginTop: 40, fontFamily: "Arial, sans-serif", fontSize: 34, fontWeight: 900, color: is ? INK : "white"}}>{s.title}</div>
              <div style={{marginTop: 16, fontFamily: "Georgia, serif", fontSize: 21, fontStyle: "italic", color: is ? "rgba(7,16,20,.62)" : "rgba(255,255,255,.6)"}}>{s.sub}</div>
              <div style={{position: "absolute", left: 38, right: 38, bottom: 36, height: 5, borderRadius: 99, background: is ? accent : "rgba(255,255,255,.1)"}} />
            </div>
          );
        })}
      </div>
      <VallerFilmLayers accent={accent} />
    </AbsoluteFill>
  );
};

// ── LimitsGrid: grid de límites/advertencias honestas (genérico, reemplaza RoutineSystem) ──
export const LimitsGrid: React.FC<{
  duration: number;
  kicker: string;
  heading: string;
  items: {n: string; title: string}[];
  footer?: string;
  accent?: string;
}> = ({duration, kicker, heading, items, footer, accent = "#E8A06A"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: `radial-gradient(circle at 50% 36%,${rgba(accent, 0.22)},#071014 67%)`, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 88, textAlign: "center"}}>
        <Eyebrow accent={accent}><span style={{display: "inline-block", width: 560, textAlign: "center"}}>{kicker}</span></Eyebrow>
        <div style={{marginTop: 16, fontFamily: "Arial, sans-serif", fontSize: 56, fontWeight: 950, color: IVORY}}>{heading}</div>
      </div>
      <div style={{position: "absolute", left: 110, right: 110, top: 345, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        {items.map((item, i) => {
          const e = spring({frame: frame - i * 11, fps, config: {damping: 18, stiffness: 95}, durationInFrames: 36});
          return (
            <React.Fragment key={item.n}>
              <div style={{width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,.055)", border: `2px solid ${rgba(accent, 0.66)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${rgba(accent, 0.13)}`, opacity: e, transform: `scale(${0.72 + e * 0.28}) translateY(${Math.sin((frame + i * 22) / 32) * 7}px)`}}>
                <div style={{fontFamily: "Arial, sans-serif", fontSize: 54, fontWeight: 950, color: accent}}>{item.n}</div>
                <div style={{marginTop: 16, width: 220, textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: 19, lineHeight: 1.18, fontWeight: 900, color: "white"}}>{item.title}</div>
              </div>
              {i < items.length - 1 ? <div style={{width: 60, height: 3, borderRadius: 99, background: rgba(accent, 0.5)}} /> : null}
            </React.Fragment>
          );
        })}
      </div>
      {footer ? <div style={{position: "absolute", left: 0, right: 0, bottom: 95, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 25, fontStyle: "italic", color: "rgba(255,255,255,.66)"}}>{footer}</div> : null}
      <VallerFilmLayers accent={accent} />
    </AbsoluteFill>
  );
};

// ── TresFrentesDiagram: 3 nodos (oxidación/colágeno/inflamación) convergiendo a la flor ──
export const TresFrentesDiagram: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 95}, durationInFrames: 42});
  const items = [
    {label: "OXIDACIÓN", accent: CARMIN, x: 22, y: 26},
    {label: "PÉRDIDA DE COLÁGENO", accent: GOLD, x: 78, y: 26},
    {label: "INFLAMACIÓN SILENCIOSA", accent: "#9FCFE4", x: 50, y: 74},
  ];
  const litStep = duration / 3.4;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "radial-gradient(circle at 50% 50%,#1c2a2c,#071014 70%)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", opacity: enter}}>
        <Eyebrow accent={CARMIN}><span style={{display: "inline-block", width: 560, textAlign: "center"}}>Tres procesos, un mismo momento</span></Eyebrow>
        <div style={{marginTop: 15, fontFamily: "Arial, sans-serif", fontSize: 46, fontWeight: 900, letterSpacing: -1.6, color: IVORY}}>LO QUE PASA A LA VEZ EN SU PIEL</div>
      </div>
      <div style={{position: "absolute", left: "50%", top: "52%", width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: "50%", background: `radial-gradient(circle,${rgba(CARMIN, 0.9)},${rgba(CARMIN, 0.25)})`, boxShadow: `0 0 70px ${rgba(CARMIN, 0.5)}`, opacity: enter}} />
      {items.map((it, i) => {
        const lit = frame > litStep * i;
        const e = spring({frame: frame - i * 10, fps, config: {damping: 18, stiffness: 95}, durationInFrames: 36});
        return (
          <React.Fragment key={it.label}>
            <svg style={{position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none"}}>
              <line x1={`${it.x}%`} y1={`${it.y}%`} x2="50%" y2="52%" stroke={lit ? it.accent : "rgba(255,255,255,.12)"} strokeWidth={lit ? 3 : 1.5} strokeDasharray="6 8" opacity={lit ? 0.85 : 0.4} />
            </svg>
            <div style={{position: "absolute", left: `${it.x}%`, top: `${it.y}%`, transform: "translate(-50%,-50%)", opacity: e, width: 260, textAlign: "center"}}>
              <div style={{width: 96, height: 96, margin: "0 auto", borderRadius: "50%", background: lit ? rgba(it.accent, 0.22) : "rgba(255,255,255,.05)", border: `2px solid ${lit ? it.accent : "rgba(255,255,255,.18)"}`, boxShadow: lit ? `0 0 34px ${rgba(it.accent, 0.4)}` : "none"}} />
              <div style={{marginTop: 14, fontFamily: "Arial, sans-serif", fontSize: 21, fontWeight: 900, color: lit ? "white" : "rgba(255,255,255,.5)"}}>{it.label}</div>
            </div>
          </React.Fragment>
        );
      })}
      <VallerFilmLayers accent={CARMIN} />
    </AbsoluteFill>
  );
};

// ── TirosinasaDiagram: mancha que se aclara en capas, dos flechas convergiendo ──
export const TirosinasaDiagram: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 95}, durationInFrames: 42});
  const clear = interpolate(frame, [30, Math.max(60, duration - 20)], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration), background: "radial-gradient(circle at 60% 45%,#241a17,#071014 68%)", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 110, top: 190, width: 620, opacity: enter, transform: `translateX(${(1 - enter) * -55}px)`}}>
        <Eyebrow accent={GOLD}>Mecanismo del tono parejo</Eyebrow>
        <div style={{marginTop: 20, fontFamily: "Arial, sans-serif", fontSize: 60, fontWeight: 900, lineHeight: 1, letterSpacing: -2.6, color: IVORY}}>LA VITAMINA C<br /><span style={{color: GOLD}}>FRENA EL EXCESO DE PIGMENTO</span></div>
        <div style={{marginTop: 26, width: 560, fontFamily: "Georgia, serif", fontSize: 24, fontStyle: "italic", lineHeight: 1.4, color: "rgba(255,255,255,.68)"}}>Inhibe la tirosinasa, mientras la exfoliación suave retira las células ya pigmentadas.</div>
      </div>
      <div style={{position: "absolute", right: 190, top: 200, width: 420, height: 420}}>
        <div style={{position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle,rgba(154,94,58,${0.85 - clear * 0.55}) 0%,rgba(198,150,110,${0.5 - clear * 0.3}) 55%,transparent 78%)`, filter: `blur(${2 + clear * 6}px)`}} />
        <div style={{position: "absolute", inset: 40, borderRadius: "50%", border: `2px dashed ${rgba(GOLD, 0.5)}`, opacity: clear}} />
        {[0, 1].map((i) => (
          <div key={i} style={{position: "absolute", left: i === 0 ? -60 : "auto", right: i === 1 ? -60 : "auto", top: 190, width: 90, height: 3, background: GOLD, opacity: 0.8, transform: `scaleX(${clear})`, transformOrigin: i === 0 ? "left" : "right", boxShadow: `0 0 14px ${rgba(GOLD, 0.6)}`}} />
        ))}
      </div>
      <VallerFilmLayers accent={GOLD} />
    </AbsoluteFill>
  );
};
