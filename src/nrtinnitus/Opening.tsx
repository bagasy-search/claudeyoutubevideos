// Opening.tsx — el PRIMER MINUTO inmersivo de nrtinnitus (v3). Todo procedural (SVG/CSS), determinista
// por cuadro (el farm rinde en chunks: nada de Math.random). Sin <Video>, sin mixBlendMode sobre el avatar,
// sin filtros de color sobre footage. Los tiempos `at` son SEGUNDOS RELATIVOS al inicio de cada cue y salen
// del mapa palabra→ms (alineación difflib), así cada animación cae en la palabra.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, Easing, interpolate } from "remotion";
import { F_INTER, F_OSWALD, F_PLAYFAIR } from "../_fed6/VideoEdit/kit/premium/theme";
import ENV from "./env_open.json";

const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const eo = (x: number) => Easing.out(Easing.cubic)(cl(x));
const eio = (x: number) => Easing.inOut(Easing.cubic)(cl(x));
const hash01 = (seed: number, salt: number) => {
  let t = (Math.floor(seed) * 2654435761 + Math.floor(salt * 1000003)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, t: f / fps }; };
const TEAL = "#7FE3D6", GOLD = "#E3B25C", INK = "#0B1413", RED = "#E0503F";

// ── onda del zumbido: senoide aguda cuya amplitud sigue la voz (o un nivel dado) ──
const RingWave: React.FC<{ w: number; y: number; amp: number; freq?: number; t: number; color?: string; width?: number; op?: number }> = ({ w, y, amp, freq = 38, t, color = TEAL, width = 2.2, op = 1 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 480; i++) {
    const x = (i / 480) * w, u = i / 480;
    const taper = Math.sin(Math.PI * u) ** 0.8;
    const v = y + Math.sin(u * freq * Math.PI * 2 + t * 22) * amp * taper + Math.sin(u * 7 * Math.PI + t * 3) * amp * 0.25 * taper;
    pts.push(`${x.toFixed(1)},${v.toFixed(1)}`);
  }
  return (
    <svg width={w} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: op, overflow: "visible" }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={width * 4} strokeOpacity={0.12} strokeLinejoin="round" />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />
    </svg>
  );
};

// ── 1) la MINIATURA real como primer cuadro, rota en glitch hacia el avatar ──
export const ThumbOpen: React.FC<{ src: string }> = ({ src }) => {
  const { f } = useT();
  const G0 = 18, G1 = 27; // glitch entre los cuadros 18 y 27
  if (f >= G1) return null;
  const g = cl((f - G0) / (G1 - G0));
  const strips = 10;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {Array.from({ length: strips }).map((_, i) => {
        const dx = f < G0 ? 0 : (hash01(f * 31 + i, 3) - 0.5) * 260 * g;
        const vis = f < G0 || hash01(f * 17 + i, 5) > g * 0.9;
        return vis ? (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${(i / strips) * 100}%`, height: `${100 / strips + 0.2}%`, overflow: "hidden" }}>
            <Img src={staticFile(src)} style={{ position: "absolute", left: dx, top: `${-(i / strips) * 1080}px`, width: 1920, height: 1080 }} />
          </div>
        ) : null;
      })}
      {f >= G0 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${hash01(f, 9) * 100}%`, height: 6, background: "rgba(255,255,255,0.85)" }} /> : null}
    </AbsoluteFill>
  );
};

// ── 2) HUD del gancho sobre el avatar (no le tapa la cara): onda de la voz + textos + anillo de 60 s ──
export const OpeningHUD: React.FC<{ tNow: number; tSixty: number; tHands: number; tEnd: number }> = ({ tNow, tSixty, tHands, tEnd }) => {
  const { f, t } = useT();
  const env = (ENV as number[])[Math.min(f, (ENV as number[]).length - 1)] || 0;
  const out = 1 - cl((t - (tEnd - 0.35)) / 0.35);
  const inNow = eo((t - tNow) / 0.45);
  const ring = eo((t - tSixty) / 0.7);
  const hands = eo((t - tHands) / 0.4);
  const sweep = cl((t - tSixty) / 4.5);
  return (
    <AbsoluteFill style={{ opacity: out, pointerEvents: "none" }}>
      {/* base oscura sólo en el borde inferior para que el texto respire, sin tocar la cara */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(4,12,11,0.62) 100%)" }} />
      <RingWave w={1920} y={958} amp={6 + env * 34} t={t} op={0.9} />
      <div style={{ position: "absolute", left: 96, bottom: 150, opacity: inNow, transform: `translateY(${(1 - inNow) * 30}px)` }}>
        <div style={{ fontFamily: F_INTER, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>your ears are ringing</div>
        <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 118, lineHeight: 1, color: "#FFFFFF", letterSpacing: 2, textShadow: "0 6px 30px rgba(0,0,0,0.55)" }}>
          RIGHT <span style={{ color: TEAL }}>NOW.</span>
        </div>
      </div>
      {t >= tSixty ? (
        <div style={{ position: "absolute", right: 96, top: 96, width: 230, display: "flex", flexDirection: "column", alignItems: "center", opacity: ring, transform: `scale(${0.8 + 0.2 * ring})` }}>
          <svg width={200} height={200} viewBox="0 0 200 200">
            <circle cx={100} cy={100} r={86} fill="rgba(6,18,16,0.72)" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
            <circle cx={100} cy={100} r={86} fill="none" stroke={GOLD} strokeWidth={7} strokeLinecap="round"
              strokeDasharray={`${(2 * Math.PI * 86 * (1 - sweep * 0.12)).toFixed(1)} 999`} transform="rotate(-90 100 100)" />
            <text x={100} y={112} textAnchor="middle" fontFamily={F_OSWALD} fontWeight={700} fontSize={64} fill="#FFFFFF">60</text>
            <text x={100} y={146} textAnchor="middle" fontFamily={F_INTER} fontWeight={700} fontSize={18} fill={GOLD} letterSpacing={3}>SECONDS</text>
          </svg>
          <div style={{ marginTop: 10, fontFamily: F_INTER, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>TRY IT WITH ME</div>
        </div>
      ) : null}
      {t >= tHands ? (
        <div style={{ position: "absolute", left: 96, bottom: 84, opacity: hands, transform: `translateX(${(1 - hands) * -40}px)`, padding: "10px 22px", borderRadius: 999, background: "rgba(127,227,214,0.16)", border: `2px solid ${TEAL}`, fontFamily: F_INTER, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: "#FFFFFF" }}>
          NO PILLS · NO GADGETS · JUST YOUR TWO HANDS
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── 3) "NOT A CURE" + la PERILLA de volumen metálica que baja el zumbido ──
export const HonestKnob: React.FC<{ bed: string; tStamp: number; tKnob: number; tTurn0: number; tTurn1: number; tMin: number; tLonger: number }> = ({ bed, tStamp, tKnob, tTurn0, tTurn1, tMin, tLonger }) => {
  const { t } = useT();
  const stampIn = eo((t - tStamp) / 0.28);
  const stampOut = eio((t - (tKnob - 0.5)) / 0.6);
  const knobIn = eo((t - tKnob) / 0.8);
  // la perilla baja de 9 a 3 en pasos de "ratchet" (clic por número)
  const turn = cl((t - tTurn0) / Math.max(0.3, tTurn1 - tTurn0));
  const lvl = 9 - Math.floor(eio(turn) * 6.999);
  const smooth = 9 - eio(turn) * 6;
  const ang = -135 + (smooth / 10) * 270;
  const chip1 = eo((t - tMin) / 0.35), chip2 = eo((t - tLonger) / 0.35);
  const ticks = Array.from({ length: 11 });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(bed)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.32, transform: `scale(${1.1 + t * 0.004})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(11,20,19,0.35) 0%, rgba(11,20,19,0.92) 75%)" }} />
      {/* SELLO */}
      {stampIn > 0 && stampOut < 1 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - stampOut, transform: `translateY(${-stampOut * 120}px)` }}>
          <div style={{ transform: `scale(${2.3 - 1.3 * stampIn}) rotate(${-7 + 1 * stampIn}deg)`, opacity: stampIn, padding: "26px 64px", border: `10px solid ${RED}`, borderRadius: 18, color: RED, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 150, letterSpacing: 8, background: "rgba(255,255,255,0.04)", boxShadow: stampIn > 0.98 ? "0 0 0 2px rgba(224,80,63,0.25)" : "none" }}>
            NOT A CURE
          </div>
          <div style={{ marginTop: 40, opacity: eo((t - tStamp - 1.2) / 0.5), fontFamily: F_INTER, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.85)", letterSpacing: 2 }}>quiet minutes · not a repair</div>
        </AbsoluteFill>
      ) : null}
      {/* PERILLA */}
      {knobIn > 0 ? (
        <AbsoluteFill style={{ opacity: knobIn, transform: `translateY(${(1 - knobIn) * 80}px)` }}>
          <RingWave w={1920} y={250} amp={4 + (smooth / 9) * 70} freq={30 + smooth * 2} t={t} op={0.95} width={2.6} color={smooth > 5 ? "#F2A35E" : TEAL} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: F_INTER, fontWeight: 800, fontSize: 28, letterSpacing: 8, color: "rgba(255,255,255,0.7)" }}>RINGING VOLUME</div>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <radialGradient id="kb" cx="40%" cy="35%" r="75%"><stop offset="0%" stopColor="#F4F6F6" /><stop offset="45%" stopColor="#AEB6B6" /><stop offset="100%" stopColor="#4A5352" /></radialGradient>
              <radialGradient id="kt" cx="45%" cy="40%" r="70%"><stop offset="0%" stopColor="#E6EAEA" /><stop offset="100%" stopColor="#8D9797" /></radialGradient>
              <radialGradient id="sh" cx="50%" cy="50%" r="50%"><stop offset="60%" stopColor="rgba(0,0,0,0.55)" /><stop offset="100%" stopColor="rgba(0,0,0,0)" /></radialGradient>
            </defs>
            <g transform="translate(960,640)">
              {ticks.map((_, i) => {
                const a = ((-135 + i * 27) * Math.PI) / 180, on = i <= lvl;
                return (
                  <g key={i}>
                    <line x1={Math.sin(a) * 250} y1={-Math.cos(a) * 250} x2={Math.sin(a) * 282} y2={-Math.cos(a) * 282} stroke={on ? (i > 5 ? "#F2A35E" : TEAL) : "rgba(255,255,255,0.22)"} strokeWidth={i % 5 === 0 ? 8 : 5} strokeLinecap="round" />
                    <text x={Math.sin(a) * 322} y={-Math.cos(a) * 322 + 12} textAnchor="middle" fontFamily={F_OSWALD} fontSize={34} fill={on ? "#FFFFFF" : "rgba(255,255,255,0.35)"}>{i}</text>
                  </g>
                );
              })}
              <circle cx={10} cy={26} r={228} fill="url(#sh)" />
              <circle r={210} fill="url(#kb)" />
              {/* estrías del borde */}
              {Array.from({ length: 72 }).map((_, i) => {
                const a = (i * 5 + ang) * Math.PI / 180;
                return <line key={i} x1={Math.sin(a) * 196} y1={-Math.cos(a) * 196} x2={Math.sin(a) * 210} y2={-Math.cos(a) * 210} stroke={i % 2 ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.28)"} strokeWidth={4} />;
              })}
              <circle r={170} fill="url(#kt)" />
              {/* cepillado concéntrico */}
              {Array.from({ length: 14 }).map((_, i) => <circle key={i} r={20 + i * 11} fill="none" stroke={i % 2 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)"} strokeWidth={3} />)}
              <g transform={`rotate(${ang.toFixed(2)})`}>
                <rect x={-9} y={-160} width={18} height={70} rx={9} fill={smooth > 5 ? "#E07A3C" : "#1E8C80"} />
              </g>
            </g>
          </svg>
          <div style={{ position: "absolute", left: 1370, top: 540, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 190, color: smooth > 5 ? "#F2A35E" : TEAL, lineHeight: 1 }}>{lvl}</div>
          <div style={{ position: "absolute", left: 1376, top: 745, fontFamily: F_INTER, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "rgba(255,255,255,0.7)" }}>OF 10</div>
          {chip1 > 0 ? (
            <div style={{ position: "absolute", left: 150, top: 560, opacity: chip1, transform: `translateX(${(1 - chip1) * -50}px)`, fontFamily: F_INTER, fontWeight: 800, color: "#FFFFFF" }}>
              <div style={{ fontSize: 26, letterSpacing: 5, color: TEAL }}>SOMETIMES</div>
              <div style={{ fontSize: 64, fontFamily: F_OSWALD }}>FOR A MINUTE</div>
              {chip2 > 0 ? <div style={{ fontSize: 64, fontFamily: F_OSWALD, color: GOLD, opacity: chip2, transform: `translateY(${(1 - chip2) * 20}px)` }}>…OR MUCH LONGER</div> : null}
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ── 4) "¿en qué grupo estás?" — banda inferior sobre el avatar ──
export const WhichGroup: React.FC<{ tAsk: number }> = ({ tAsk }) => {
  const { t } = useT();
  const { durationInFrames, fps } = useVideoConfig();
  const out = 1 - cl((t - (durationInFrames / fps - 0.3)) / 0.3);
  const a = eo(t / 0.5), b = eo((t - 0.9) / 0.5), q = eo((t - tAsk) / 0.4);
  const card = (label: string, sub: string, on: boolean, k: number): React.ReactNode => (
    <div style={{ width: 520, padding: "22px 30px", borderRadius: 18, background: on ? "rgba(20,70,63,0.88)" : "rgba(14,20,20,0.82)", border: `2px solid ${on ? TEAL : "rgba(255,255,255,0.18)"}`, opacity: k, transform: `translateY(${(1 - k) * 40}px)`, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: 58, height: 58, borderRadius: 29, background: on ? TEAL : "rgba(255,255,255,0.12)", color: on ? INK : "rgba(255,255,255,0.6)", fontFamily: F_OSWALD, fontSize: 38, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : "–"}</div>
      <div><div style={{ fontFamily: F_OSWALD, fontSize: 40, color: "#FFFFFF", letterSpacing: 2 }}>{label}</div><div style={{ fontFamily: F_INTER, fontSize: 24, color: on ? "#CFF3EE" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>{sub}</div></div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(4,12,11,0.7) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", gap: 48 }}>
        {card("GROUP A", "the drum quiets it", true, a)}
        {card("GROUP B", "nothing changes", false, b)}
      </div>
      {q > 0 ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 210, textAlign: "center", opacity: q, transform: `scale(${0.9 + 0.1 * q})`, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 76, color: GOLD, letterSpacing: 3, textShadow: "0 6px 26px rgba(0,0,0,0.7)" }}>WHICH ONE ARE YOU?</div> : null}
    </AbsoluteFill>
  );
};

// ── 5) LA NOCHE en UN solo plano: tele off → lámpara off → el zumbido nace del oído → el día → vuelve la noche ──
type NightT = { tvOff: number; lampOff: number; loud: number; hiss: number; whistle: number; crickets: number; oldTv: number; day: number; night: number };
export const NightShot: React.FC<{ a: string; b: string; c: string; d: string; at: NightT }> = ({ a, b, c, d, at }) => {
  const { t, f } = useT();
  const { durationInFrames, fps } = useVideoConfig();
  const T = durationInFrames / fps;
  const EAR = { x: 322, y: 452 }, TV = { x: 1578, y: 138, w: 316, h: 214 };
  // capas de luz
  const opB = cl((t - at.tvOff) / 0.2);
  const opC = cl((t - at.lampOff) / 0.28);
  const opD = eio((t - at.day) / 0.8) * (1 - eio((t - at.night) / 0.8));
  // cámara: un solo dolly continuo hacia la cama (nunca frena)
  const s = 1.0 + 0.16 * eio(t / T);
  const tx = -2.2 * eio(t / T), ty = -1.2 * eio(t / T);
  // intensidad del zumbido: nace en "loud", se va de día, vuelve más fuerte de noche
  const zz = cl((t - at.loud) / 0.8) * (1 - opD) * (t > at.night ? 1.35 : 1);
  const hiss = cl((t - at.hiss) / 0.6) * (1 - opD) * (t > at.night ? 1.2 : 1);
  const whistle = cl((t - at.whistle) / 0.4) * (1 - opD);
  const crick = cl((t - at.crickets) / 0.8) * (1 - opD);
  const ghost = cl((t - at.oldTv) / 0.8) * (1 - opD);
  // CRT: al apagar la tele la imagen colapsa a una línea y a un punto
  const crt = cl((t - at.tvOff) / 0.25);
  const img = (src: string, op: number) => <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: op }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05080A", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s.toFixed(4)}) translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%)`, transformOrigin: "30% 48%" }}>
        {img(a, 1)}{img(b, opB)}{img(c, opC)}{img(d, opD)}
        {crt > 0 && crt < 1 ? (
          <div style={{ position: "absolute", left: TV.x, top: TV.y, width: TV.w, height: TV.h, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: `${(1 - Math.max(0, crt - 0.6) / 0.4) * 100}%`, height: `${Math.max(2, (1 - crt / 0.6) * TV.h)}px`, background: "rgba(220,240,255,0.95)", boxShadow: "0 0 30px rgba(200,230,255,0.9)" }} />
          </div>
        ) : null}
        {/* estática fantasma dentro de la pantalla apagada ("an old television left on") */}
        {ghost > 0 ? (
          <svg style={{ position: "absolute", left: TV.x, top: TV.y }} width={TV.w} height={TV.h}>
            <filter id="tvn"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 97} /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width={TV.w} height={TV.h} filter="url(#tvn)" opacity={0.28 * ghost} />
          </svg>
        ) : null}
        {/* ondas que nacen del oído */}
        {zz > 0 ? (
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const ph = ((t * 1.1 + i / 7) % 1);
              const r = 18 + ph * 520;
              return <circle key={i} cx={EAR.x} cy={EAR.y} r={r} fill="none" stroke={TEAL} strokeWidth={2.2 - ph * 1.6} strokeOpacity={(1 - ph) * 0.55 * zz} />;
            })}
            {/* el pitido: una línea finísima y aguda que sale del oído y cruza el cuarto */}
            {whistle > 0 ? (() => {
              const pts: string[] = [];
              for (let i = 0; i <= 300; i++) { const u = i / 300; const x = EAR.x + u * 1500 * whistle; const y = EAR.y - u * 120 + Math.sin(u * 140 + t * 30) * 5 * (1 - u * 0.6); pts.push(`${x.toFixed(1)},${y.toFixed(1)}`); }
              return <polyline points={pts.join(" ")} fill="none" stroke="#DFFBF6" strokeWidth={1.6} strokeOpacity={0.75 * (t > at.night ? 1 : 0.8)} />;
            })() : null}
          </svg>
        ) : null}
        {/* siseo: estática fina concentrada alrededor de la cabeza */}
        {hiss > 0 ? (
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <filter id="hs"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={f % 113} /><feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 1  0 0 0 0 0.95  0 0 0 1.4 -0.6" /></filter>
              <radialGradient id="hm" cx={EAR.x / 1920} cy={EAR.y / 1080} r="0.42"><stop offset="0%" stopColor="#fff" stopOpacity={1} /><stop offset="100%" stopColor="#fff" stopOpacity={0} /></radialGradient>
              <mask id="hmk"><rect width={1920} height={1080} fill="url(#hm)" /></mask>
            </defs>
            <rect width={1920} height={1080} filter="url(#hs)" mask="url(#hmk)" opacity={0.42 * hiss} />
          </svg>
        ) : null}
        {/* grillos: puntos que titilan en la oscuridad */}
        {crick > 0 ? Array.from({ length: 46 }).map((_, i) => {
          const x = 380 + hash01(i, 1) * 1450, y = 60 + hash01(i, 2) * 820;
          const tw = 0.5 + 0.5 * Math.sin(t * (6 + hash01(i, 3) * 9) + i);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3, height: 3, borderRadius: 2, background: "#CFFBF4", opacity: crick * tw * 0.7, boxShadow: "0 0 8px rgba(190,250,240,0.9)" }} />;
        }) : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ── 6) Los MIEDOS flotando en 3D sobre el cuarto oscuro + el sello que se agrieta ──
export const FearThoughts: React.FC<{ bg: string; lines: { text: string; at: number }[]; tDim: number; quote: string; tQuote: number; tCrack: number }> = ({ bg, lines, tDim, quote, tQuote, tCrack }) => {
  const { t } = useT();
  const { durationInFrames, fps } = useVideoConfig();
  const T = durationInFrames / fps;
  const dim = 1 - 0.7 * eo((t - tDim) / 0.8);
  const q = eo((t - tQuote) / 0.35), cr = eo((t - tCrack) / 0.3);
  const POS = [{ x: 330, y: 150, z: 120 }, { x: 700, y: 330, z: 40 }, { x: 420, y: 560, z: -60 }];
  return (
    <AbsoluteFill style={{ backgroundColor: "#05080A", overflow: "hidden", perspective: 1400 }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transformOrigin: "22% 44%", transform: `scale(${(1.12 + 0.2 * eio(t / T)).toFixed(4)})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 25% 45%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 90%)" }} />
      {lines.map((l, i) => {
        const k = eo((t - l.at) / 0.6);
        if (k <= 0) return null;
        const p = POS[i % POS.length];
        const drift = (t - l.at) * 14;
        const blur = i < lines.length - 1 && t > lines[i + 1].at ? 1.2 : 0;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate3d(0, ${-drift}px, ${p.z + (1 - k) * -300 + drift * 2}px) rotateY(${-5 + i * 3}deg)`, opacity: k * dim * (blur ? 0.55 : 1), filter: blur ? `blur(${blur}px)` : undefined, fontFamily: F_PLAYFAIR, fontStyle: "italic", fontSize: 76, color: "#EAF6F4", textShadow: "0 8px 40px rgba(0,0,0,0.9)", width: 1000, lineHeight: 1.1 }}>
            {l.text}
          </div>
        );
      })}
      {q > 0 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", transform: `scale(${1.6 - 0.6 * q}) rotate(${-2 + cr * 1.5}deg)`, opacity: q, padding: "44px 70px", background: "rgba(236,240,240,0.96)", borderRadius: 8, boxShadow: "0 40px 90px rgba(0,0,0,0.6)", maxWidth: 1300 }}>
            <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: "#6B7776", marginBottom: 12 }}>WHAT THEY TELL YOU</div>
            <div style={{ fontFamily: F_PLAYFAIR, fontWeight: 700, fontSize: 70, color: "#1B2322", lineHeight: 1.1 }}>“{quote}”</div>
            {cr > 0 ? (
              <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                {[[500, 0, 470, 90, 540, 150, 490, 230, 520, 300], [470, 90, 360, 120, 250, 100], [540, 150, 680, 170, 820, 140, 1000, 160], [490, 230, 380, 260, 300, 300]].map((pl, i) => {
                  const n = pl.length / 2, show = Math.max(2, Math.ceil(n * cr));
                  const pts = [] as string[]; for (let j = 0; j < show; j++) pts.push(`${pl[j * 2]},${pl[j * 2 + 1]}`);
                  return <polyline key={i} points={pts.join(" ")} fill="none" stroke="#1B2322" strokeWidth={3.2} strokeLinejoin="bevel" />;
                })}
              </svg>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
