// Sets.tsx — set-pieces HERO de facafecanas (Federer Archivos, ES). Portados del kit premium Rowe
// (MythTruth 2.5D, RedFlags, RoutineSwap, carrusel con reloj compartido, FallTease) y REBRANDEADOS
// a papel clínico claro + teal/ámbar, en español. Todas las props de texto vienen del plan (sin defaults
// de otro video: los defaults son cadenas vacías).
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, eOut, eIO, ramp, spr, src, Atmosphere, Finish, Plane, PaperPhoto, useCam, SlashLine, Headline, Chip, SegmentShell, SHADOW } from "./Depth";

const outOf = (frame: number, dur: number) => ramp(frame, dur - 9, dur);
const Shell: React.FC<{ frame: number; dur: number; children: React.ReactNode }> = ({ frame, dur, children }) => {
  const out = outOf(frame, dur);
  return <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>{children}</AbsoluteFill>;
};

// ── MITO vs VERDAD 2.5D ─────────────────────────────────────────────────────────────────────
export const MythTruth: React.FC<{ myth?: string; truth?: string; kicker?: string; bed?: string; mythImg?: string; truthImg?: string; hitAt?: number; truthAt?: number; durationInFrames?: number }> = ({ kicker = "", myth = "", truth = "", bed, mythImg, truthImg, hitAt = 22, truthAt = 46, durationInFrames = 210 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [hitAt], 0.05, durationInFrames);
  const mIn = spr(frame, fps, 2, 120, 0.9);
  const slash = ramp(frame, hitAt, hitAt + 9);
  const back = ramp(frame, truthAt, truthAt + 18);
  const tIn = spr(frame, fps, truthAt, 115, 0.9);
  const MW = 800, MH = 620;
  return (
    <Shell frame={frame} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed ?? truthImg ?? mythImg} seed={71} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        <Plane depth={0.3} camX={cam.camX} camY={cam.camY} z={6}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 40 }}><Headline kicker={kicker} a={ramp(frame, 0, 12)} center /></div>
        </Plane>
        <Plane depth={interpolate(back, [0, 1], [0.8, 0.45])} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: interpolate(back, [0, 1], [560, 110]), top: interpolate(back, [0, 1], [200, 260]), opacity: mIn * interpolate(back, [0, 1], [1, 0.8]), transform: `perspective(1600px) rotateY(${interpolate(back, [0, 1], [0, 12]).toFixed(2)}deg) scale(${(interpolate(mIn, [0, 1], [0.9, 1]) * interpolate(back, [0, 1], [1, 0.82])).toFixed(4)})` }}>
            <PaperPhoto img={mythImg} w={MW} h={MH} blur={back * 2.2} desat={ramp(frame, hitAt + 4, hitAt + 16) * 0.9} dim={back * 0.5}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 30px 26px", background: rgba(V.card, 0.97), borderTop: `5px solid ${V.danger}` }}>
                <Chip text="MITO" color={V.danger} />
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 50, lineHeight: 1.06, color: V.ink, marginTop: 10 }}>{myth}</div>
              </div>
            </PaperPhoto>
            <div style={{ position: "absolute", inset: -40 }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox={`0 0 ${MW + 80} ${MH + 80}`} preserveAspectRatio="none">
                <path d={`M10 ${Math.round(MH * 0.7)} L${MW + 70} 60`} fill="none" stroke={V.danger} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - slash} />
              </svg>
            </div>
          </div>
        </Plane>
        <Plane depth={0.95} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 900, top: 200, opacity: tIn, transform: `translateX(${((1 - tIn) * 260).toFixed(1)}px) perspective(1600px) rotateY(${((1 - tIn) * -22 - 4).toFixed(2)}deg) scale(${interpolate(tIn, [0, 1], [0.86, 1]).toFixed(4)})` }}>
            <PaperPhoto img={truthImg} w={MW + 40} h={MH + 40} glow={V.teal} glowK={ramp(frame, truthAt + 8, truthAt + 24)} push={Math.max(0, frame - truthAt) * 0.0003}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 32px 28px", background: rgba(V.card, 0.97), borderTop: `5px solid ${V.teal}` }}>
                <Chip text="LA VERDAD" color={V.tealDeep} />
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 56, lineHeight: 1.05, color: V.ink, marginTop: 10 }}>{truth}</div>
              </div>
            </PaperPhoto>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={73} />
    </Shell>
  );
};

// ── SEÑALES (cuándo ir al médico) ─────────────────────────────────────────────────────────
export const RedFlags: React.FC<{ kicker?: string; img?: string; bed?: string; flags?: { text: string; at: number }[]; stamp?: string; stampAt?: number; durationInFrames?: number }> = ({ kicker = "", img, bed, flags = [], stamp = "", stampAt = 99999, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [stampAt, ...flags.map((f) => f.at)], 0.05, durationInFrames);
  const heroIn = spr(frame, fps, 0, 120, 0.9);
  const pulse = (frame % 45) / 45;
  const stampK = spr(frame, fps, stampAt, 90, 0.6);
  const after = ramp(frame, stampAt, stampAt + 10);
  return (
    <Shell frame={frame} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed ?? img} seed={51} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "40% 50%" }}>
        <Plane depth={0.45} camX={cam.camX} camY={cam.camY} z={1}>
          {[0, 0.5].map((o, k) => { const p = (pulse + o) % 1; return <div key={k} style={{ position: "absolute", left: 520, top: 560, width: 560, height: 560, borderRadius: "50%", border: `5px solid ${rgba(V.amber, (1 - p) * 0.6)}`, transform: `translate(-50%,-50%) scale(${(0.8 + p * 0.7).toFixed(3)})`, opacity: heroIn }} />; })}
        </Plane>
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: 150, top: 250, opacity: heroIn, transform: `translateY(${interpolate(heroIn, [0, 1], [80, 0]).toFixed(1)}px) perspective(1600px) rotateY(9deg) rotateZ(-2deg)` }}>
            <PaperPhoto img={img} w={740} h={600} push={frame * 0.0003} dim={after * 0.3} />
          </div>
        </Plane>
        <Plane depth={0.85} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 980, top: 110, width: 840 }}>
            <Headline kicker={kicker} a={ramp(frame, 4, 18)} color={V.amberDeep} size={1} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 26 }}>
              {flags.map((f, i) => {
                const k = spr(frame, fps, f.at, 120, 0.8);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 28px", borderRadius: 20, background: rgba(V.card, 0.97), borderLeft: `8px solid ${V.amber}`, boxShadow: SHADOW(110), opacity: k * (1 - after * 0.3), transform: `translateX(${((1 - k) * 90).toFixed(1)}px)` }}>
                    <div style={{ width: 60, height: 60, flex: "0 0 60px", borderRadius: "50%", background: V.amber, color: V.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_BODY, fontWeight: 800, fontSize: 32 }}>{i + 1}</div>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 42, lineHeight: 1.08, color: V.ink }}>{f.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Plane>
        {stamp ? (
          <Plane depth={1} camX={cam.camX} camY={cam.camY} z={5}>
            <div style={{ position: "absolute", left: 1400, top: 940, transform: `translate(-50%,-50%) rotate(-4deg) scale(${interpolate(stampK, [0, 1], [2.2, 1]).toFixed(3)})`, opacity: Math.min(1, stampK * 1.5) }}>
              <div style={{ padding: "16px 44px", borderRadius: 16, background: V.danger, border: `4px solid ${V.white}`, boxShadow: SHADOW(120) }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 900, fontSize: 56, letterSpacing: 3, color: V.white, textTransform: "uppercase", whiteSpace: "nowrap" }}>{stamp}</div>
              </div>
            </div>
          </Plane>
        ) : null}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={53} />
    </Shell>
  );
};

// ── ANTES → AHORA (los errores que se corrigen: cada tarjeta gira al nombrarla) ────────────
type SwapItem = { label: string; img?: string; newLabel?: string; newImg?: string; flipAt?: number };
export const RoutineSwap: React.FC<{ kicker?: string; title?: string; items?: SwapItem[]; bed?: string; durationInFrames?: number }> = ({ kicker = "", title = "", items = [], bed, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(1, items.length);
  const cam = useCam(frame, fps, items.map((it) => it.flipAt ?? -99), 0.06, durationInFrames);
  const W = n >= 4 ? 390 : 480, H = n >= 4 ? 500 : 560, GAP = 40;
  const total = n * W + (n - 1) * GAP;
  const x0 = (1920 - total) / 2;
  return (
    <Shell frame={frame} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed} seed={37} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 58%" }}>
        <Plane depth={0.3} camX={cam.camX} camY={cam.camY} z={40}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 50 }}><Headline kicker={kicker} title={title} a={ramp(frame, 2, 16)} center size={60} /></div>
        </Plane>
        {items.map((it, i) => {
          const baseX = x0 + i * (W + GAP);
          const tilt = (i - (n - 1) / 2) * 2.6;
          const appear = spr(frame, fps, i * 3, 120, 0.9);
          const fl = it.flipAt ?? 99999;
          const p = interpolate(frame, [fl, fl + 12], [0, 1], CL);
          const rotY = p < 0.5 ? p * 180 : (p - 1) * 180;
          const showNew = p >= 0.5;
          const check = spr(frame, fps, fl + 10, 110, 0.7);
          const y = 300 + Math.abs(i - (n - 1) / 2) * 14 + interpolate(appear, [0, 1], [90, 0]) + (showNew ? -14 : 0);
          return (
            <React.Fragment key={i}>
              <Plane depth={0.55 + i * 0.1} camX={cam.camX} camY={cam.camY} z={10 + i}>
                <div style={{ position: "absolute", left: baseX, top: y, opacity: appear, transform: `perspective(1600px) rotateZ(${tilt}deg) rotateY(${rotY.toFixed(2)}deg)` }}>
                  <PaperPhoto img={showNew ? it.newImg : it.img} w={W} h={H} dim={showNew ? 0 : 0.55} desat={showNew ? 0 : 0.7} label={showNew ? it.newLabel : it.label} labelSize={36} tone={showNew ? V.teal : V.danger} glow={showNew ? V.teal : undefined} glowK={showNew ? check : 0} push={frame * 0.0002} />
                  {showNew ? (
                    <div style={{ position: "absolute", top: -24, right: -24, width: 72, height: 72, borderRadius: "50%", background: V.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${check.toFixed(3)})`, boxShadow: SHADOW(80) }}>
                      <svg width={40} height={40} viewBox="0 0 40 40"><path d="M9 21 L17 29 L31 12" fill="none" stroke={V.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  ) : null}
                </div>
              </Plane>
              {!showNew ? (
                <Plane depth={0.55 + i * 0.1} camX={cam.camX} camY={cam.camY} z={11 + i}>
                  <div style={{ opacity: appear * (1 - interpolate(frame, [fl - 2, fl + 4], [0, 1], CL)) }}>
                    <SlashLine d={`M${baseX - 30} ${y + H * 0.72} L${baseX + W + 20} ${y + H * 0.22}`} u={ramp(frame, 6 + i * 4, 16 + i * 4)} width={16} />
                  </div>
                </Plane>
              ) : null}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={43} />
    </Shell>
  );
};

// ── CANDADO del bucle abierto ("el error que hace que el café no pinte") ─────────────────────
const Lock: React.FC<{ size: number; wobble: number; open?: number }> = ({ size, wobble, open = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${wobble.toFixed(2)}deg)`, filter: `drop-shadow(0 10px 20px ${rgba("#27343A", 0.4)})` }}>
    <g style={{ transformOrigin: "62px 40px", transform: `translateY(${(-14 * open).toFixed(1)}px) rotate(${(-32 * open).toFixed(1)}deg)` }}>
      <path d="M32 46 V34 a18 18 0 0 1 36 0 V46" fill="none" stroke={V.ink2} strokeWidth={9} strokeLinecap="round" />
    </g>
    <rect x="24" y="44" width="52" height="42" rx="10" fill={V.amber} />
    <circle cx="50" cy="62" r="6" fill={V.ink} />
    <rect x="47.5" y="64" width="5" height="12" rx="2.5" fill={V.ink} />
  </svg>
);
export const LockTease: React.FC<{ kicker?: string; title?: string; img?: string; sideL?: string; sideR?: string; bed?: string; hitAt?: number; openAt?: number; durationInFrames?: number }> = ({ kicker = "", title = "", img, sideL, sideR, bed, hitAt = 40, openAt = 99999, durationInFrames = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [hitAt, openAt], 0.06, durationInFrames);
  const heroIn = spr(frame, fps, 4, 120, 0.9);
  const sideIn = spr(frame, fps, 0, 140, 0.9);
  const lockIn = spr(frame, fps, 14, 90, 0.7);
  const t = frame - hitAt;
  const wobble = t >= 0 && t < 18 ? Math.sin(t * 1.3) * 16 * (1 - t / 18) : 0;
  const open = ramp(frame, openAt, openAt + 14);
  const pulse = (frame % 50) / 50;
  return (
    <Shell frame={frame} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed ?? img} seed={91} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        <Plane depth={0.25} camX={cam.camX} camY={cam.camY} z={1}>
          {sideL ? <div style={{ position: "absolute", left: 80, top: 360, opacity: sideIn * 0.85, transform: `translateX(${((1 - sideIn) * -80).toFixed(1)}px) perspective(1400px) rotateY(20deg)` }}><PaperPhoto img={sideL} w={460} h={340} blur={3} desat={0.3} /></div> : null}
          {sideR ? <div style={{ position: "absolute", right: 80, top: 400, opacity: sideIn * 0.85, transform: `translateX(${((1 - sideIn) * 80).toFixed(1)}px) perspective(1400px) rotateY(-20deg)` }}><PaperPhoto img={sideR} w={460} h={340} blur={3} desat={0.3} /></div> : null}
        </Plane>
        <Plane depth={0.45} camX={cam.camX} camY={cam.camY} z={2}>
          {[0, 0.5].map((o, k) => { const p = (pulse + o) % 1; return <div key={k} style={{ position: "absolute", left: 960, top: 630, width: 640, height: 640, borderRadius: "50%", border: `5px solid ${rgba(V.amber, (1 - p) * 0.55)}`, transform: `translate(-50%,-50%) scale(${(0.8 + p * 0.7).toFixed(3)})`, opacity: heroIn }} />; })}
        </Plane>
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 960, top: 640, transform: `translate(-50%,-50%) translateY(${interpolate(heroIn, [0, 1], [90, 0]).toFixed(1)}px)`, opacity: heroIn }}>
            <PaperPhoto img={img} w={820} h={520} blur={interpolate(open, [0, 1], [10, 0])} glow={V.amber} glowK={0.6 + 0.4 * Math.sin(frame / 9)} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: lockIn * (1 - ramp(frame, openAt + 8, openAt + 18)), transform: `scale(${interpolate(lockIn, [0, 1], [1.6, 1], CL).toFixed(3)})` }}>
              <Lock size={170} wobble={wobble} open={open} />
            </div>
          </div>
        </Plane>
        <Plane depth={0.95} camX={cam.camX} camY={cam.camY} z={5}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70 }}><Headline kicker={kicker} title={title} a={ramp(frame, 6, 20)} color={V.amberDeep} center size={62} /></div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={93} />
    </Shell>
  );
};

// ── CARRUSEL 3D con candados (pasos/tipos) — reloj compartido entre apariciones ────────────
export type Card = { name: string; img?: string; sub?: string };
const Padlock: React.FC<{ u: number; size?: number }> = ({ u, size = 96 }) => (
  <div style={{ opacity: interpolate(u, [0.5, 1], [1, 0], CL), transform: `scale(${interpolate(u, [0, 0.6, 1], [1, 1.12, 1.35])})` }}><Lock size={size} wobble={0} open={interpolate(u, [0, 0.6], [0, 1], CL)} /></div>
);
export const Carousel: React.FC<{ cards?: Card[]; reveals?: number[]; offset?: number; introDur?: number; kicker?: string; title?: string; bed?: string; mode?: "reveal" | "recap"; durationInFrames?: number }> = ({ cards = [], reveals = [], offset = 0, introDur = 44, kicker = "", title = "", bed, mode = "reveal", durationInFrames = 120 }) => {
  const local = useCurrentFrame();
  const frame = local + offset;
  const { fps, width, height } = useVideoConfig();
  const N = Math.max(1, cards.length);
  const cx = width / 2, cy = height * 0.6, Rx = width * 0.27;
  const eg = mode === "recap" ? 1 : interpolate(frame, [0, introDur], [0, 1], CL);
  let focus = -1;
  for (let i = 0; i < reveals.length; i++) if (frame >= reveals[i]) focus = i;
  const TRANS = fps * 0.7;
  const displayIndex = focus < 0 ? -1 + Math.sin((frame / fps) * 0.5) * 0.06 : focus - 1 + interpolate(frame, [reveals[focus], reveals[focus] + TRANS], [0, 1], { ...CL, easing: eIO });
  const zoomPulse = focus >= 0 ? Math.sin(interpolate(frame, [reveals[focus], reveals[focus] + fps * 0.6], [0, 1], CL) * Math.PI) * 0.05 : 0;
  const stageZoom = interpolate(eg, [0, 1], [1.14, 1], { easing: eOut }) + Math.sin((frame / fps) * 0.7) * 0.016 + zoomPulse;
  const driftX = Math.sin((frame / fps) * 0.4) * 12;
  const anglePer = (Math.PI * 2) / N;
  const headA = mode === "recap" ? interpolate(local, [4, 16], [0, 1], CL) : interpolate(eg, [0.3, 1], [0, 1], CL);
  return (
    <SegmentShell frame={local} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed} seed={21} camX={driftX} />
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 200 }}><Headline kicker={kicker} title={title} a={headA} center size={58} /></div>
      <AbsoluteFill style={{ transform: `translate(${driftX}px, 20px) scale(${stageZoom})`, transformOrigin: "50% 60%" }}>
        {cards.map((card, i) => {
          const theta = (i - displayIndex) * anglePer;
          const depth = (Math.cos(theta) + 1) / 2;
          const x = Math.sin(theta) * Rx;
          const scale = 0.58 + depth * 0.62;
          const aStart = i === 0 ? 0 : Math.min(0.42 + i * 0.12, 0.94);
          const appear = interpolate(eg, [aStart, Math.min(aStart + 0.3, 1)], [0, 1], { ...CL, easing: eOut });
          const r = reveals[i];
          const u = mode === "recap" ? 1 : typeof r === "number" ? interpolate(frame, [r, r + fps * 0.55], [0, 1], { ...CL, easing: eOut }) : 0;
          const isFocus = i === focus;
          return (
            <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 440, height: 560, zIndex: Math.round(depth * 100), opacity: (0.35 + depth * 0.65) * appear, transform: `translate(-50%,-50%) translate(${x}px, ${(1 - Math.cos(theta)) * 30 + interpolate(appear, [0, 1], [760, 0])}px) scale(${scale}) rotateY(${-Math.sin(theta) * 26}deg)`, filter: (1 - depth) * 7 > 0.1 ? `blur(${((1 - depth) * 7).toFixed(2)}px)` : undefined }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 26, overflow: "hidden", background: V.card, border: `10px solid ${V.card}`, boxShadow: `${SHADOW(560)}${isFocus ? `, 0 0 0 4px ${rgba(V.teal, 0.95 * u)}, 0 0 60px ${rgba(V.teal, 0.4 * u)}` : ""}` }}>
                {card.img ? <Img src={src(card.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 16, filter: `blur(${interpolate(u, [0, 1], [16, 0]).toFixed(2)}px) saturate(${(0.6 + u * 0.4).toFixed(2)})` }} /> : null}
                <div style={{ position: "absolute", inset: 0, background: rgba(V.paper, interpolate(u, [0, 1], [0.45, 0])) }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 20px 18px", background: rgba(V.card, 0.97), borderTop: `5px solid ${V.teal}`, opacity: u }}>
                  <div style={{ fontFamily: F_DISPLAY, fontSize: 40, fontWeight: 800, color: V.ink, lineHeight: 1.02 }}>{card.name}</div>
                  {card.sub ? <div style={{ fontFamily: F_BODY, fontSize: 26, fontWeight: 600, color: V.ink2, marginTop: 4 }}>{card.sub}</div> : null}
                </div>
              </div>
              <div style={{ position: "absolute", top: -22, left: -22, width: 64, height: 64, borderRadius: "50%", background: isFocus ? V.amber : V.teal, color: V.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_BODY, fontSize: 34, fontWeight: 800, boxShadow: SHADOW(64), opacity: appear }}>{i + 1}</div>
              {u < 1 ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Padlock u={u} /></div> : null}
            </div>
          );
        })}
      </AbsoluteFill>
      <Finish frame={frame} camX={driftX} seed={23} />
    </SegmentShell>
  );
};
