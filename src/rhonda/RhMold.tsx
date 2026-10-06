// Kit Rhonda · MOHO (rhmoldbleach y siguientes): gráficos DENTRO del mundo (pared de azulejo, luz de ventana, sombra, perspectiva).
//   RhMoldCalendar  mode split (2 polaroids día 1 / día 9 pegadas al azulejo) · days (almanaque de papel en la pared: se tachan los
//                   días y la polaroid se llena de puntitos) · months (las hojas pasan y sigue blanco) · weekly (un día por semana marcado)
//   RhSwabTest      dos hisopos sobre la mesada: tease (¿?) · top (sale negro + burbujas → "the fix") · under (sale limpio → "under the caulk")
//   RhWipeReveal    el ANTES real: un escurridor de goma barre la foto y deja el DESPUÉS (gotas en el borde de la goma)
//   RhFogMirror     espejo empañado: las palabras aparecen escritas con el dedo (se ve el baño nítido a través) y chorrean gotas
//   RhPatchMeter    pared con moho: cinta de pintor marca 3 × 3 ft y la cinta métrica la mide → "bigger = call a pro"
//   RhWetMap        la ducha: el agua baja por las paredes y la fila de abajo y los rincones quedan "mojados" (azul) toda la noche
//   RhStrengthMeter botella marrón pura vs rociador mitad agua: la fuerza del burbujeo de cada una
//   RhNextVideo     (overlay) tarjeta chica "el video de eso", sin link
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { RH, SERIF, LABEL, HAND, hexA, rnd, clamp01 } from "./RhTheme";
import { Bed, Card, Tape, lin, pop, tileBg, useOut } from "./RhParts";

const sf = (s: string) => staticFile(s);
// pared de azulejo con luz de ventana desde la izquierda y viñeta suave (el "mundo" de las tarjetas sin cama)
const Wall: React.FC<{ dark?: number }> = ({ dark = 0.1 }) => (
  <AbsoluteFill style={{ ...tileBg(200, 100) }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 18% 22%, rgba(255,248,230,0.9), rgba(255,255,255,0.1) 50%, rgba(30,42,54,${dark}) 100%)` }} />
  </AbsoluteFill>
);
// puntitos de moho dibujados sobre una foto (k = 0..1 cuánto creció)
const Dots: React.FC<{ k: number; seed?: number; n?: number; box?: [number, number, number, number] }> = ({ k, seed = 3, n = 70, box = [0.05, 0.55, 0.95, 0.98] }) => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    {Array.from({ length: n }, (_, i) => {
      const x = box[0] + rnd(seed * 97 + i) * (box[2] - box[0]), y = box[1] + Math.pow(rnd(seed * 31 + i), 0.6) * (box[3] - box[1]);
      const on = clamp01(k * 1.6 - rnd(seed * 13 + i) * 0.6); if (on <= 0) return null;
      return <ellipse key={i} cx={x * 100} cy={y * 100} rx={(0.25 + rnd(i * 7) * 0.55) * on} ry={(0.4 + rnd(i * 11) * 0.7) * on} fill={hexA(RH.slime, 0.85)} />;
    })}
  </svg>
);
const Polaroid: React.FC<{ src: string; label: string; w?: number; rot?: number; k?: number; dots?: number; children?: React.ReactNode; tone?: string }> = ({ src, label, w = 640, rot = 0, k = 1, dots = 0, children, tone = RH.ink }) => (
  <div style={{ width: w, background: "#FFFFFE", padding: `${w * 0.04}px ${w * 0.04}px ${w * 0.16}px`, rotate: `${rot}deg`, opacity: Math.min(1, k * 1.5), scale: String(0.85 + 0.15 * k), boxShadow: `0 ${30 * k}px ${60 * k}px rgba(30,42,54,0.32), 0 4px 10px rgba(0,0,0,0.15)`, position: "relative" }}>
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10.5", overflow: "hidden", background: "#ddd" }}>
      <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {dots > 0 ? <Dots k={dots} /> : null}
      {children}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: w * 0.025, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: w * 0.105, color: tone }}>{label}</div>
  </div>
);

export const RhMoldCalendar: React.FC<{ mode?: "split" | "days" | "months" | "weekly"; a?: string; b?: string; la?: string; lb?: string; img?: string; steps?: { d: number; t: string }[] }> = ({ mode = "split", a, b, la = "Day 1", lb = "Day 9", img, steps = [] }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(5);
  const push = interpolate(f, [0, T], [1, 1.05]);
  if (mode === "split") {
    const pa = pop(f, fps, 0, 15), pb = pop(f, fps, 6, 12), ring = lin(f, 14, 30);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Wall />
        <div style={{ position: "absolute", inset: 0, scale: String(push), display: "flex", alignItems: "center", justifyContent: "center", gap: 70, perspective: 1600 }}>
          <div style={{ translate: `0 ${(1 - pa) * 120}px`, rotate: "-4deg", transform: "rotateY(8deg)" }}><Tape x={240} y={-18} rot={-4} w={170} /><Polaroid src={a!} label={la} k={pa} /></div>
          <div style={{ translate: `0 ${(1 - pb) * -140}px`, rotate: "3deg", transform: "rotateY(-8deg)", position: "relative" }}>
            <Tape x={230} y={-18} rot={5} w={170} />
            <Polaroid src={b!} label={lb} k={pb} tone={RH.red}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <ellipse cx={50} cy={74} rx={40} ry={20} fill="none" stroke={RH.red} strokeWidth={1.6} strokeDasharray={260} strokeDashoffset={260 * (1 - ring)} transform="rotate(-4 50 74)" />
              </svg>
            </Polaroid>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (mode === "months") {
    const M = ["MARCH", "APRIL", "MAY", "JUNE"]; const per = Math.max(8, (T - 16) / M.length); const i = Math.min(M.length - 1, Math.floor(Math.max(0, f - 4) / per));
    const flip = clamp01(((f - 4) % per) / 7);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Wall />
        <div style={{ position: "absolute", left: 210, top: 120, scale: String(push), transformOrigin: "40% 50%", perspective: 1400 }}>
          <div style={{ width: 620, background: "#fff", boxShadow: `0 30px 60px ${RH.shadow}`, transform: "rotateY(10deg) rotate(-2deg)" }}>
            <div style={{ height: 34, background: RH.blueDeep }} />
            <div style={{ padding: "26px 40px", transformOrigin: "50% 0", transform: `rotateX(${(1 - flip) * -70}deg)`, opacity: 0.4 + 0.6 * flip }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 92, color: RH.ink, letterSpacing: 6 }}>{M[i]}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 14 }}>
                {Array.from({ length: 28 }, (_, d) => <div key={d} style={{ height: 52, border: `2px solid ${RH.grout}`, fontFamily: LABEL, fontSize: 22, color: RH.inkSoft, padding: 4 }}>{d + 1}</div>)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 170, top: 190 }}>
          <Polaroid src={img!} label="Still white" w={700} rot={3} k={pop(f, fps, 4)} tone={RH.blueDeep} />
        </div>
      </AbsoluteFill>
    );
  }
  if (mode === "weekly") {
    const p = pop(f, fps, 0, 15);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Wall />
        <div style={{ position: "absolute", left: "50%", top: 90, translate: `-50% ${(1 - p) * 100}px`, scale: String(push), perspective: 1500 }}>
          <div style={{ width: 1180, background: "#fff", boxShadow: `0 34px 70px ${RH.shadow}`, transform: "rotateX(6deg) rotate(-1deg)", padding: "28px 44px 40px", borderTop: `30px solid ${RH.blueDeep}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 70, color: RH.ink, letterSpacing: 5 }}>EVERY WEEK</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: RH.blueDeep }}>light spray, walk away</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginTop: 18 }}>
              {Array.from({ length: 28 }, (_, d) => {
                const mark = d % 7 === 4, k = mark ? lin(f, 10 + (d / 7) * 10, 22 + (d / 7) * 10) : 0;
                return (
                  <div key={d} style={{ height: 120, border: `2px solid ${RH.grout}`, position: "relative", fontFamily: LABEL, fontSize: 26, color: RH.inkSoft, padding: 6 }}>
                    {d + 1}
                    {mark ? <svg width={150} height={120} style={{ position: "absolute", left: 4, top: 0 }}><ellipse cx={74} cy={62} rx={60} ry={46} fill="none" stroke={RH.blue} strokeWidth={7} strokeDasharray={340} strokeDashoffset={340 * (1 - k)} /></svg> : null}
                    {mark && k > 0.8 ? <div style={{ position: "absolute", left: 52, top: 40, width: 30, height: 56, borderRadius: "10px 10px 6px 6px", background: RH.brown, boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }}><div style={{ margin: "14px 4px", height: 16, background: "#fff" }} /></div> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  // days: almanaque de papel + polaroid que se llena de puntitos día a día
  const per = Math.max(10, (T - 20) / Math.max(1, steps.length)), si = Math.min(steps.length - 1, Math.floor(Math.max(0, f - 8) / per));
  const cur = steps[si] || { d: 1, t: "" }, dk = cur.d <= 1 ? 0 : cur.d <= 3 ? 0 : cur.d <= 6 ? 0.28 : 1;
  const dkS = interpolate(f, [8 + si * per, 8 + si * per + 10], [si === 0 ? 0 : (steps[si - 1].d <= 3 ? 0 : steps[si - 1].d <= 6 ? 0.28 : 1), dk], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = pop(f, fps, 0, 15);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Wall />
      <div style={{ position: "absolute", left: 150, top: 110, translate: `0 ${(1 - p) * 90}px`, perspective: 1500, scale: String(push), transformOrigin: "30% 50%" }}>
        <div style={{ width: 760, background: "#fff", boxShadow: `0 30px 60px ${RH.shadow}`, transform: "rotateY(12deg) rotate(-1.5deg)", padding: "22px 34px 34px", borderTop: `28px solid ${RH.blueDeep}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 56, color: RH.ink, letterSpacing: 4 }}>AFTER THE BLEACH</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 14 }}>
            {Array.from({ length: 10 }, (_, d) => {
              const day = d + 1, done = day <= cur.d, k = done ? lin(f, 8 + steps.findIndex((s) => s.d >= day) * per, 16 + steps.findIndex((s) => s.d >= day) * per) : 0;
              const st = steps.find((s) => s.d === day);
              return (
                <div key={d} style={{ height: 118, border: `2px solid ${st ? RH.blue : RH.grout}`, position: "relative", fontFamily: LABEL, fontSize: 34, color: RH.ink, padding: 8, background: st && day === cur.d ? hexA(RH.yellow, 0.25) : "#fff" }}>
                  {day}
                  {done && !st ? <svg width={130} height={110} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 20 20 L 110 95 M 110 20 L 20 95" stroke={hexA(RH.ink, 0.55)} strokeWidth={6} strokeLinecap="round" strokeDasharray={240} strokeDashoffset={240 * (1 - k)} /></svg> : null}
                  {st && day <= cur.d ? <div style={{ position: "absolute", left: 6, right: 4, bottom: 4, fontFamily: HAND, fontWeight: 700, fontSize: 30, color: day === 9 ? RH.red : RH.blueDeep, lineHeight: 1 }}>{st.t}</div> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 140, top: 200 }}>
        <Polaroid src={img!} label={`Day ${cur.d}`} w={760} rot={2.5} k={pop(f, fps, 6)} dots={dkS} tone={cur.d >= 9 ? RH.red : RH.ink} />
      </div>
    </AbsoluteFill>
  );
};

// hisopo dibujado (palito + algodón); dirt = cuánto negro tomó la punta
const Swab: React.FC<{ dirt: number; x: number; y: number; rot: number; s?: number }> = ({ dirt, x, y, rot, s = 1 }) => (
  <svg width={620 * s} height={140 * s} viewBox="0 0 620 140" style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg`, filter: "drop-shadow(0 16px 14px rgba(30,42,54,0.28))" }}>
    <defs><radialGradient id={`cot${Math.round(dirt * 100)}${x}`} cx="0.35" cy="0.35"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E9E6E0" /></radialGradient></defs>
    <rect x={90} y={62} width={440} height={16} rx={8} fill="#F4F1EA" stroke="#DDD8CE" strokeWidth={2} />
    <ellipse cx={560} cy={70} rx={58} ry={40} fill="#F6F4EF" />
    <ellipse cx={70} cy={70} rx={64} ry={42} fill={`url(#cot${Math.round(dirt * 100)}${x})`} />
    {Array.from({ length: 26 }, (_, i) => { const on = clamp01(dirt * 1.5 - rnd(i * 5) * 0.5); return on > 0 ? <circle key={i} cx={30 + rnd(i * 3) * 70} cy={40 + rnd(i * 7) * 58} r={(3 + rnd(i) * 8) * on} fill={hexA(RH.slime, 0.85)} /> : null; })}
  </svg>
);
export const RhSwabTest: React.FC<{ mode?: "tease" | "top" | "under"; bed?: string }> = ({ mode = "tease", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 15), k = lin(f, 10, T * 0.55);
  const left = mode === "top" ? k : 0, note = lin(f, T * 0.45, T * 0.6);
  const focusL = mode === "top" ? 1 : mode === "under" ? 0.35 : 1, focusR = mode === "under" ? 1 : mode === "top" ? 0.35 : 1;
  const Note: React.FC<{ x: number; y: number; rot: number; head: string; body: string; c: string; k: number }> = ({ x, y, rot, head, body, c, k: kk }) => (
    <div style={{ position: "absolute", left: x, top: y, width: 560, rotate: `${rot}deg`, opacity: kk, scale: String(0.8 + 0.2 * kk), background: RH.yellowSoft, padding: "26px 34px", boxShadow: `0 20px 40px ${RH.shadow}`, borderTop: `14px solid ${c}` }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 46, color: c, letterSpacing: 2, textTransform: "uppercase" }}>{head}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: RH.ink, lineHeight: 1.05 }}>{body}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={91} dim={0.3} blur={0} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 40%, rgba(240,236,228,0.92) 58%, rgba(232,226,216,0.98) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, translate: `0 ${(1 - p) * 120}px` }}>
        <div style={{ opacity: focusL }}><Swab dirt={mode === "tease" ? 0.15 : left} x={170} y={560} rot={-8} s={1.2} /></div>
        <div style={{ opacity: focusR }}><Swab dirt={0} x={1020} y={600} rot={6} s={1.2} /></div>
        {mode === "top" && k > 0.3 ? Array.from({ length: 14 }, (_, i) => { const ph = ((f * 0.04 + rnd(i * 9)) % 1); return <div key={i} style={{ position: "absolute", left: 230 + rnd(i * 3) * 120, top: 600 - ph * 160, width: 14 + rnd(i) * 14, height: 14 + rnd(i) * 14, borderRadius: "50%", border: "3px solid #fff", background: "rgba(255,255,255,0.4)", opacity: 1 - ph }} />; }) : null}
      </div>
      {mode === "tease" ? (
        <>
          <Note x={190} y={150} rot={-4} head="Dirty swab?" body="It's on top" c={RH.blueDeep} k={lin(f, 8, 20)} />
          <Note x={1080} y={180} rot={4} head="Clean swab?" body="It's under it" c={RH.red} k={lin(f, 16, 28)} />
        </>
      ) : mode === "top" ? (
        <Note x={180} y={130} rot={-3} head="On the grout" body="The fix gets it out" c={RH.blueDeep} k={note} />
      ) : (
        <Note x={1040} y={150} rot={3} head="Under the caulk" body="Strips, overnight" c={RH.red} k={note} />
      )}
    </AbsoluteFill>
  );
};

export const RhWipeReveal: React.FC<{ before: string; after: string; lb?: string; la?: string; squeegee?: boolean }> = ({ before, after, lb = "Before", la = "After" }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(5);
  const x = interpolate(f, [4, Math.max(14, T * 0.62)], [-0.08, 1.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const X = x * 1920, tilt = -6;
  const z = interpolate(f, [0, T], [1.02, 1.08]);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Img src={sf(before)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z) }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(0 0, ${X + 60}px 0, ${X - 60}px 100%, 0 100%)` }}>
        <Img src={sf(after)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z) }} />
        {/* brillo húmedo que sigue a la goma */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: X - 220, width: 200, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.25))", transform: `skewX(${tilt}deg)` }} />
      </div>
      {/* gotas en el borde de la goma */}
      {Array.from({ length: 22 }, (_, i) => { const y = rnd(i * 5) * 1080, xx = X + 60 - (y / 1080) * 120 + 8; const r = 5 + rnd(i * 3) * 9;
        return x > -0.05 && x < 1.05 ? <div key={i} style={{ position: "absolute", left: xx, top: y + ((f * 3 + i * 17) % 40), width: r, height: r * 1.3, borderRadius: "50%", background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 2px 3px rgba(0,0,0,0.15)" }} /> : null; })}
      {/* el escurridor: goma negra + mango */}
      {x > -0.06 && x < 1.06 ? (
        <div style={{ position: "absolute", left: X - 30, top: -40, height: 1160, width: 60, transform: `skewX(${tilt}deg)`, filter: "drop-shadow(14px 0 18px rgba(0,0,0,0.35))" }}>
          <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 16, background: "#1C1C1C", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 26, background: "linear-gradient(90deg,#B9C0C6,#EEF1F3 45%,#9AA3AB)", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: -150, top: 500, width: 160, height: 46, background: RH.yellow, borderRadius: 20, boxShadow: "0 6px 12px rgba(0,0,0,0.25)" }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 70, top: 70, opacity: 1 - lin(f, T * 0.3, T * 0.45), background: RH.white, color: RH.red, fontFamily: LABEL, fontWeight: 700, fontSize: 52, padding: "6px 26px", rotate: "3deg", boxShadow: `0 10px 24px ${RH.shadow}`, letterSpacing: 3 }}>{lb.toUpperCase()}</div>
      <div style={{ position: "absolute", left: 70, top: 70, opacity: lin(f, T * 0.25, T * 0.4), background: RH.white, color: RH.blueDeep, fontFamily: LABEL, fontWeight: 700, fontSize: 52, padding: "6px 26px", rotate: "-3deg", boxShadow: `0 10px 24px ${RH.shadow}`, letterSpacing: 3 }}>{la.toUpperCase()}</div>
    </AbsoluteFill>
  );
};

export const RhFogMirror: React.FC<{ img: string; lines: string[] }> = ({ img, lines }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(10, (T * 0.7) / lines.length);
  const z = interpolate(f, [0, T], [1.03, 1.09]);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", background: "#cfd6da" }}>
      {/* el espejo empañado (foto + niebla) */}
      <Img src={sf(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z), filter: "blur(10px) brightness(1.08)" }} />
      <AbsoluteFill style={{ background: "rgba(236,240,242,0.62)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lines.map((t, i) => {
          const k = lin(f, 6 + i * per, 6 + i * per + per * 0.8);
          return (
            <div key={i} style={{ position: "relative", fontFamily: HAND, fontWeight: 700, fontSize: lines.length > 2 ? 150 : 180, lineHeight: 1.05, clipPath: `inset(-20% ${100 - k * 100}% -20% -5%)`, rotate: `${(rnd(i) - 0.5) * 6}deg` }}>
              {/* lo escrito con el dedo deja ver el baño nítido y más oscuro */}
              <span style={{ backgroundImage: `url(${sf(img)})`, backgroundSize: "1920px 1080px", backgroundPosition: "center", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "brightness(0.55) contrast(1.2)", WebkitTextStroke: "1px rgba(255,255,255,0.25)" }}>{t}</span>
              {/* gotas que chorrean de las letras */}
              {Array.from({ length: 4 }, (_, d) => { const dl = clamp01((f - (6 + i * per + per * 0.8) - d * 6) / 40); return dl > 0 ? <div key={d} style={{ position: "absolute", left: `${15 + rnd(i * 9 + d) * 70}%`, top: "82%", width: 9, height: 20 + dl * 120, borderRadius: 6, background: "linear-gradient(rgba(70,80,86,0.0), rgba(70,80,86,0.35))" }} /> : null; })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const RhPatchMeter: React.FC<{ img: string; label?: string }> = ({ img, label = "Bigger than this? Call a pro" }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const tape = lin(f, 6, T * 0.45), meas = lin(f, T * 0.2, T * 0.5), lab = lin(f, T * 0.5, T * 0.62);
  const z = interpolate(f, [0, T], [1.02, 1.07]);
  const x0 = 620, y0 = 260, S = 620; // el cuadrado de 3 × 3 ft en la pared
  const side = (i: number) => clamp01(tape * 4 - i);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden" }}>
      <Img src={sf(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z) }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))" }}>
        {[[x0, y0, x0 + S, y0], [x0 + S, y0, x0 + S, y0 + S], [x0 + S, y0 + S, x0, y0 + S], [x0, y0 + S, x0, y0]].map(([a, b, c, d], i) => (
          <line key={i} x1={a} y1={b} x2={a + (c - a) * side(i)} y2={b + (d - b) * side(i)} stroke="#4E8FD0" strokeWidth={30} strokeOpacity={0.92} />
        ))}
        {/* cinta métrica amarilla arriba */}
        <rect x={x0} y={y0 - 92} width={S * meas} height={50} fill={RH.yellow} stroke="#B98F00" strokeWidth={3} />
        {Array.from({ length: 37 }, (_, i) => (i / 36 <= meas ? <line key={i} x1={x0 + (S * i) / 36} x2={x0 + (S * i) / 36} y1={y0 - 92} y2={y0 - 92 + (i % 12 === 0 ? 34 : 16)} stroke={RH.ink} strokeWidth={i % 12 === 0 ? 4 : 2} /> : null))}
        <rect x={x0 + S * meas - 30} y={y0 - 120} width={110} height={100} rx={18} fill="#E8E5DF" stroke="#9A958C" strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: x0 + S / 2, top: y0 - 190, translate: "-50% 0", opacity: meas, fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: RH.ink, background: hexA(RH.white, 0.9), padding: "2px 22px", borderRadius: 10 }}>3 FT × 3 FT</div>
      <div style={{ position: "absolute", left: x0 + S / 2, top: y0 + S + 50, translate: `-50% ${(1 - lab) * 30}px`, opacity: lab, background: RH.red, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 70, padding: "12px 40px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: `0 14px 30px ${RH.shadow}` }}>{label}</div>
    </AbsoluteFill>
  );
};

export const RhWetMap: React.FC<{ img: string }> = ({ img }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const run = lin(f, 4, T * 0.5), pool = lin(f, T * 0.3, T * 0.7), lab = lin(f, T * 0.45, T * 0.6);
  const z = interpolate(f, [0, T], [1.03, 1.08]);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden" }}>
      <Img src={sf(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z) }} />
      {/* el agua que baja por las paredes */}
      {Array.from({ length: 16 }, (_, i) => { const x = 140 + rnd(i * 13) * 1640, len = 120 + rnd(i * 7) * 380, y = -80 + (run * 1.4 - rnd(i * 3) * 0.4) * 1000;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 7, height: len, borderRadius: 6, background: "linear-gradient(rgba(150,200,235,0), rgba(150,200,235,0.75))", filter: "blur(0.5px)" }} />; })}
      {/* lo que queda mojado: fila de abajo + rincones */}
      <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: pool, background: "linear-gradient(180deg, rgba(255,255,255,1) 55%, rgba(120,175,225,0.85) 80%, rgba(70,135,205,0.95) 100%)" }} />
      <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: pool * 0.9, background: "radial-gradient(circle at 0% 100%, rgba(70,135,205,0.9), rgba(255,255,255,0) 32%), radial-gradient(circle at 100% 100%, rgba(70,135,205,0.9), rgba(255,255,255,0) 32%)" }} />
      <div style={{ position: "absolute", right: 120, top: 110, opacity: lab, background: RH.white, padding: "14px 30px", rotate: "2deg", boxShadow: `0 12px 26px ${RH.shadow}`, fontFamily: HAND, fontWeight: 700, fontSize: 62, color: RH.blueDeep }}>Top: dry in 10 minutes</div>
      <div style={{ position: "absolute", left: 120, bottom: 300, opacity: lab, background: RH.blueDeep, padding: "14px 30px", rotate: "-2deg", boxShadow: `0 12px 26px ${RH.shadow}`, fontFamily: HAND, fontWeight: 700, fontSize: 66, color: "#fff" }}>Bottom: wet till morning</div>
    </AbsoluteFill>
  );
};

export const RhStrengthMeter: React.FC<{ full?: string; half?: string; bed?: string }> = ({ full = "Full strength", half = "Half and half", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 15), g = lin(f, 12, T * 0.6);
  const Bottle: React.FC<{ brown: boolean; x: number; power: number; title: string; c: string }> = ({ brown, x, power, title, c }) => (
    <div style={{ position: "absolute", left: x, top: 150, width: 640, height: 820 }}>
      <svg width={300} height={600} viewBox="0 0 300 600" style={{ position: "absolute", left: 20, top: 120, filter: "drop-shadow(0 24px 18px rgba(30,42,54,0.32))" }}>
        <rect x={110} y={20} width={70} height={60} rx={8} fill="#F2F2F2" stroke="#BDBDBD" strokeWidth={3} />
        <path d="M 180 40 L 250 40 L 250 62 L 180 62 Z" fill="#F2F2F2" stroke="#BDBDBD" strokeWidth={3} />
        <path d="M 95 80 L 195 80 L 215 140 L 215 560 Q 215 590 185 590 L 105 590 Q 75 590 75 560 L 75 140 Z" fill={brown ? RH.brown : "rgba(225,238,246,0.55)"} stroke={brown ? "#3A200C" : "#A9C3D4"} strokeWidth={4} />
        {!brown ? <path d="M 77 360 L 213 360 L 213 560 Q 213 588 185 588 L 105 588 Q 77 588 77 560 Z" fill="rgba(160,205,235,0.55)" /> : null}
        {!brown ? <path d="M 77 360 L 213 360" stroke="#7FB3D6" strokeWidth={4} strokeDasharray="10 8" /> : null}
        <rect x={95} y={250} width={100} height={130} rx={6} fill="#FFFFFF" opacity={brown ? 1 : 0.85} />
      </svg>
      {/* burbujeo que produce */}
      <div style={{ position: "absolute", left: 330, top: 260, width: 280, height: 420, borderRadius: 24, background: hexA(RH.white, 0.85), boxShadow: `0 16px 34px ${RH.shadow}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${power * g * 100}%`, background: `linear-gradient(${hexA(c, 0.25)}, ${hexA(c, 0.6)})` }} />
        {Array.from({ length: Math.round(28 * power) }, (_, i) => { const ph = ((f * 0.035 + rnd(i * 7 + x)) % 1); return <div key={i} style={{ position: "absolute", left: 20 + rnd(i * 3 + x) * 230, bottom: ph * 400 * g, width: 12 + rnd(i) * 22, height: 12 + rnd(i) * 22, borderRadius: "50%", border: "3px solid #fff", background: "rgba(255,255,255,0.35)", opacity: g * (1 - ph * 0.6) }} />; })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: RH.ink, letterSpacing: 2 }}>FIZZ</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 30, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: c, whiteSpace: "nowrap" }}>{title}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={97} dim={0.32} />
      <div style={{ position: "absolute", inset: 0, translate: `0 ${(1 - p) * 100}px` }}>
        <Bottle brown x={170} power={1} title={full} c={RH.blueDeep} />
        <Bottle brown={false} x={1060} power={0.3} title={half} c={RH.red} />
      </div>
    </AbsoluteFill>
  );
};

export const RhNextVideo: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8); const p = pop(f, fps, 6);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 80, bottom: 90, width: 600, opacity: out * Math.min(1, p * 1.4), translate: `${(1 - p) * 120}px 0`, rotate: "-1.5deg" }}>
        <Card style={{ padding: "22px 28px", borderTop: `12px solid ${RH.yellow}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: RH.inkSoft }}>THERE'S A WHOLE VIDEO ON IT</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: RH.ink, lineHeight: 1.08, marginTop: 6 }}>{title}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
