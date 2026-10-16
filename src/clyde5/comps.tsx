// clyde5 · componentes PROPIOS del video del tocino frito (Bn*). PURO CSS (pedido del creador 16-oct): cero imágenes.
// Mundo visual DISTINTO al de los collards: desayuno de diner y sartén de hierro — tiras de tocino dibujadas con gradientes
// (vetas de grasa/carne, dorado, quemado), hierro negro con brillo cónico, cromo, azulejo de diner, letrero de letras
// enchufables, ticket de comanda en el riel, perilla del fuego, termómetro. 2 familias: Anton (cartel) + Kalam (mano).
import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { sp, useT, type P } from "../lkit/core";

const ANT = loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const KAL = loadKalam("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const K = { cream: "#F6ECDC", red: "#B23A2E", redD: "#7E2018", fat: "#F4DCC6", meat: "#B5473A", crisp: "#9A5426", burnt: "#2A160C", iron: "#1C1B1A",
  chrome: "#C9CDD1", mustard: "#E3A62F", teal: "#2D7470", tealD: "#1D4F4C", ink: "#231B16", paper: "#FBF7EE", green: "#3F7D44", blue: "#3B6FB6" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
const v = (f: number, at: number, dur = 14) => ez((f - at) / dur);
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 14px 28px rgba(0,0,0,0.32), 0 44px 90px rgba(0,0,0,0.28)";

// ═══ TEXTURAS ═══
const tileBg = `repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 3px, transparent 3px 60px), repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 3px, transparent 3px 60px), linear-gradient(45deg, #9C3427 25%, transparent 25%, transparent 75%, #9C3427 75%), linear-gradient(45deg, #9C3427 25%, transparent 25%, transparent 75%, #9C3427 75%), #F1E4CC`;
const tileSz = { backgroundSize: "120px 120px", backgroundPosition: "0 0, 60px 60px" } as React.CSSProperties;
const counterBg = `repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 9px), radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 50%), linear-gradient(180deg, ${K.teal}, ${K.tealD})`;
const paperBg = `repeating-linear-gradient(0deg, rgba(120,100,70,0.05) 0 1px, transparent 1px 4px), radial-gradient(circle at 25% 30%, #FFFFFF, transparent 60%), ${K.paper}`;
const butcherBg = `repeating-linear-gradient(12deg, rgba(150,120,90,0.07) 0 2px, transparent 2px 10px), repeating-linear-gradient(-70deg, rgba(150,120,90,0.05) 0 1px, transparent 1px 6px), radial-gradient(ellipse at 30% 20%, #FFFFFF, #EFE6D6)`;
const ironBg = `radial-gradient(circle at 50% 50%, #2A2826 0 40%, #141312 70%), conic-gradient(from 30deg, rgba(255,255,255,0.05), transparent 20%, rgba(255,255,255,0.06) 40%, transparent 60%)`;
const woodBg = `repeating-linear-gradient(0deg, rgba(60,30,10,0.12) 0 2px, transparent 2px 13px), repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 210px), linear-gradient(180deg, #9C6838, #6E4423)`;
const chromeBg = `linear-gradient(180deg, #F2F4F6, #AEB4BA 45%, #E4E7EA 55%, #9BA1A7)`;

const Bg: React.FC<{ bg: string; st?: React.CSSProperties; children?: React.ReactNode }> = ({ bg, st, children }) => <AbsoluteFill style={{ background: bg, overflow: "hidden", ...st }}>{children}</AbsoluteFill>;
const Glow: React.FC<{ x?: string; y?: string; op?: number }> = ({ x = "30%", y = "15%", op = 0.2 }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse 65% 55% at ${x} ${y}, rgba(255,240,215,${op}), transparent 70%)`, pointerEvents: "none" }} />;
const A: React.FC<{ s: number; c?: string; st?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = K.cream, st, children }) => (
  <div style={{ fontFamily: ANT, fontSize: s, color: c, lineHeight: 1.0, letterSpacing: 2, textTransform: "uppercase", ...st }}>{children}</div>
);
const Hd: React.FC<{ s: number; c?: string; st?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = K.ink, st, children }) => (
  <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: s, color: c, lineHeight: 1.1, ...st }}>{children}</div>
);
const Write: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; st?: React.CSSProperties }> = ({ f, at, dur = 16, children, st }) => {
  const p = v(f, at, dur);
  return <div style={{ clipPath: `inset(-30% ${100 - p * 102}% -30% -3%)`, opacity: p > 0 ? 1 : 0, ...st }}>{children}</div>;
};
const Pop: React.FC<{ f: number; at: number; children: React.ReactNode; st?: React.CSSProperties; dy?: number; dx?: number; sc?: number }> = ({ f, at, children, st, dy = 30, dx = 0, sc = 0 }) => {
  const s = sp(f, at, 14, 150);
  return <div style={{ opacity: cl(s * 1.5), transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) scale(${1 - sc * (1 - s)})`, ...st }}>{children}</div>;
};
const Badge: React.FC<{ f: number; at: number; ok: boolean; s?: number }> = ({ f, at, ok, s = 80 }) => {
  const k = sp(f, at, 10, 220);
  return <div style={{ width: s, height: s, borderRadius: "50%", background: ok ? K.green : K.red, color: "#fff", fontFamily: ANT, fontSize: s * 0.62, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})`, boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }}>{ok ? "✓" : "✕"}</div>;
};
// humo (manchas que suben)
const Smoke: React.FC<{ f: number; x: number; y: number; w?: number; n?: number; op?: number; dark?: boolean }> = ({ f, x, y, w = 300, n = 8, op = 0.45, dark }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const per = 60 + (i % 3) * 16, ph = ((f + i * 19) % per) / per, sz = 70 + ph * 160;
      return <div key={i} style={{ position: "absolute", left: x + ((i * 61) % w) - sz / 2 + 30 * Math.sin((f + i * 25) / 16), top: y - ph * 360 - sz / 2, width: sz, height: sz * 0.8, borderRadius: "50%",
        background: dark ? "radial-gradient(circle, rgba(70,65,60,0.6), rgba(70,65,60,0) 68%)" : "radial-gradient(circle, rgba(255,255,255,0.55), rgba(255,255,255,0) 68%)", opacity: op * Math.sin(Math.PI * ph) }} />;
    })}
  </>
);

// ═══ TIRA DE TOCINO dibujada: vetas de grasa/carne; cook 0..1 (crudo→dorado), burn 0..1, curl 0..1 (ondas por segmentos) ═══
const Strip: React.FC<{ w: number; h?: number; cook?: number; burn?: number; curl?: number; f?: number; notch?: number; st?: React.CSSProperties; shrink?: number }> = ({ w, h = 120, cook = 0, burn = 0, curl = 0, f = 0, notch = 0, st, shrink = 0 }) => {
  const N = 12, seg = (w * (1 - shrink * 0.45)) / N;
  const mix = (a: number[], b: number[], t: number) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
  const fat = mix(mix([244, 220, 198], [214, 150, 80], cook), [60, 30, 15], burn), meat = mix(mix([181, 71, 58], [140, 60, 30], cook), [35, 18, 10], burn);
  const rgb = (c: number[]) => `rgb(${c.join(",")})`;
  return (
    <div style={{ position: "absolute", width: seg * N, height: h, display: "flex", ...st }}>
      {Array.from({ length: N }).map((_, i) => {
        const wave = curl * Math.sin(i * 1.1 + f / 20) * 34, edgeBurn = burn * (i < 2 || i > N - 3 ? 1 : 0.35);
        const fatE = mix(fat, [40, 20, 10], edgeBurn * 0.8), meatE = mix(meat, [30, 15, 8], edgeBurn * 0.8);
        return <div key={i} style={{ width: seg + 1, height: h, transform: `translateY(${wave}px) rotate(${curl * Math.cos(i * 1.1) * 14}deg)`,
          background: `linear-gradient(180deg, ${rgb(fatE)} 0 14%, ${rgb(meatE)} 14% 30%, ${rgb(fatE)} 30% 44%, ${rgb(meatE)} 44% 66%, ${rgb(fatE)} 66% 78%, ${rgb(meatE)} 78% 90%, ${rgb(fatE)} 90% 100%)`,
          borderRadius: i === 0 ? "14px 0 0 14px" : i === N - 1 ? "0 14px 14px 0" : 0, boxShadow: "0 10px 16px rgba(0,0,0,0.35)",
          clipPath: notch > 0 && i > 0 && i < N - 1 ? `polygon(0 0, ${50 - 9 * notch}% 0, 50% ${18 * notch}%, ${50 + 9 * notch}% 0, 100% 0, 100% 100%, 0 100%)` : undefined }}>
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(180deg, rgba(255,255,255,${0.25 - 0.15 * cook}), transparent 40%, rgba(0,0,0,0.15))` }} />
        </div>;
      })}
    </div>
  );
};
// sartén de hierro vista desde arriba
const Skillet: React.FC<{ x: number; y: number; d: number; children?: React.ReactNode; glow?: number }> = ({ x, y, d, children, glow = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: d, height: d }}>
    <div style={{ position: "absolute", left: d - 30, top: d / 2 - 40, width: d * 0.55, height: 80, borderRadius: 40, background: "linear-gradient(180deg, #34312E, #121110)", boxShadow: SH }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, #3A3633, #1B1A19 72%, #0E0D0C)`, boxShadow: `${SH}, 0 0 ${80 * glow}px rgba(255,90,30,${0.5 * glow})` }} />
    <div style={{ position: "absolute", inset: 34, borderRadius: "50%", background: ironBg, boxShadow: "inset 0 10px 30px rgba(0,0,0,0.8)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "conic-gradient(from 210deg, transparent, rgba(255,255,255,0.07) 10%, transparent 20%, transparent 55%, rgba(255,255,255,0.05) 65%, transparent 75%)" }} />
      {children}
    </div>
  </div>
);
const Bubbles: React.FC<{ f: number; w: number; h: number; n: number; big: number }> = ({ f, w, h, n, big }) => (
  <>{Array.from({ length: n }).map((_, i) => {
    const per = 26 + (i % 5) * 7, ph = ((f + i * 13) % per) / per, sz = big * (0.4 + ((i * 7) % 10) / 14);
    return <div key={i} style={{ position: "absolute", left: (i * 97) % w, top: (i * 61) % h, width: sz, height: sz, borderRadius: "50%", border: "2px solid rgba(255,240,210,0.7)", transform: `scale(${0.3 + ph})`, opacity: 1 - ph }} />;
  })}</>
);

// ═══ 1 · Dos tiras: la de siempre vs la de hoy (HOOK) ═══
export const BnTwoStrips: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const L = sp(f, at(t) - 4, 13, 120), R = sp(f, at(t2) - 4, 13, 120);
  return (
    <Bg bg={butcherBg}>
      <Glow />
      <div style={{ position: "absolute", left: 958, top: 0, bottom: 0, width: 4, background: "rgba(120,90,60,0.25)" }} />
      <div style={{ opacity: cl(L * 1.5), transform: `translateY(${(1 - L) * 60}px)` }}>
        <A s={74} c={K.red} st={{ position: "absolute", left: 0, width: 960, top: 120, textAlign: "center" }}>THE WAY YOU'VE BEEN DOING IT</A>
        <Strip w={720} cook={0.9} burn={0.75} curl={1} f={f} st={{ left: 120, top: 460 }} shrink={0.3} />
        <Hd s={60} c="#6A4A36" st={{ position: "absolute", left: 0, width: 960, top: 760, textAlign: "center" }}>curled · burnt ends · flabby middle</Hd>
      </div>
      <div style={{ opacity: cl(R * 1.5), transform: `translateY(${(1 - R) * 60}px)` }}>
        <A s={74} c={K.green} st={{ position: "absolute", left: 960, width: 960, top: 120, textAlign: "center" }}>THE OLD BUTCHER WAY</A>
        <Strip w={760} cook={0.8} burn={0} curl={0} st={{ left: 1060, top: 460 }} />
        <Hd s={60} c="#3E5A3A" st={{ position: "absolute", left: 960, width: 960, top: 760, textAlign: "center" }}>flat · crisp · same color end to end</Hd>
      </div>
    </Bg>
  );
};

// ═══ 2 · Alarma de humo y perilla en ALTO (HOOK_2) ═══
export const BnAlarm: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const knob = sp(f, at(t) - 6, 12, 120), blink = Math.floor(f / 6) % 2 === 0 && f > at(t2) - 4;
  return (
    <Bg bg={`linear-gradient(180deg, #E9E3D8, #CFC6B6)`}>
      <Smoke f={f} x={500} y={1080} w={900} n={12} op={0.55} dark />
      {/* detector en el techo */}
      <div style={{ position: "absolute", left: 1180, top: 90, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E4E1DA 60%, #BDB8AE)", boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: "repeating-radial-gradient(circle, #D8D4CC 0 6px, #C4BFB5 6px 10px)" }} />
        <div style={{ position: "absolute", left: 190, top: 190, width: 40, height: 40, borderRadius: "50%", background: blink ? "#FF3B2E" : "#6B1A14", boxShadow: blink ? "0 0 40px 14px rgba(255,60,40,0.8)" : "none" }} />
      </div>
      {blink ? <A s={120} c={K.red} st={{ position: "absolute", left: 1170, top: 560, transform: `rotate(-6deg) scale(${1 + 0.04 * Math.sin(f)})` }}>BEEP! BEEP!</A> : null}
      {/* perilla de la hornalla */}
      <div style={{ position: "absolute", left: 220, top: 340, width: 520, height: 520, borderRadius: "50%", background: chromeBg, boxShadow: SH }}>
        {["OFF", "LOW", "MED", "HIGH"].map((s, i) => {
          const ang = -120 + i * 80, r = 300;
          return <A key={s} s={44} c={i === 3 ? K.red : K.ink} st={{ position: "absolute", left: 260 + r * Math.sin(ang * Math.PI / 180) - 40, top: 260 - r * Math.cos(ang * Math.PI / 180) - 22, width: 80, textAlign: "center" }}>{s}</A>;
        })}
        <div style={{ position: "absolute", inset: 90, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3A3A3A, #0F0F0F)", transform: `rotate(${-120 + 240 * knob}deg)`, boxShadow: "0 12px 20px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", left: 160, top: 10, width: 20, height: 150, borderRadius: 10, background: K.cream }} />
        </div>
      </div>
      <Pop f={f} at={at(t) + 10} st={{ position: "absolute", left: 160, top: 120 }}><A s={80} c={K.ink}>CRANKED UP HIGH</A></Pop>
    </Bg>
  );
};

// ═══ 3 · Letrero de letras enchufables: 9 trucos (PROMISE) ═══
export const BnNine: P<{ head: string; items: { txt: string; t: number; hot?: boolean }[] }> = ({ a, head, items }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 14, 100);
  const felt = `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 22px), radial-gradient(ellipse at 40% 30%, #2C2C2C, #121212)`;
  return (
    <Bg bg={tileBg} st={tileSz}>
      <div style={{ position: "absolute", left: 230, top: 90, width: 1460, height: 900, borderRadius: 18, background: `linear-gradient(180deg, #C9A06A, #8E6234)`, boxShadow: SH, transform: `perspective(1600px) rotateX(${(1 - k) * 18}deg)`, opacity: cl(k * 1.4) }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: 8, background: felt, boxShadow: "inset 0 8px 20px rgba(0,0,0,0.8)", padding: "40px 70px" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {head.split("").map((c, i) => <Pop key={i} f={f} at={4 + i * 2} dy={-20}><div style={{ fontFamily: ANT, fontSize: 96, color: "#F2F2EE", textShadow: "0 3px 0 rgba(0,0,0,0.6)", width: c === " " ? 30 : undefined }}>{c}</div></Pop>)}
          </div>
          <div style={{ marginTop: 40 }}>
            {items.map((it, i) => (
              <Pop key={i} f={f} at={at(it.t)} dx={-40} dy={0} st={{ display: "flex", gap: 30, alignItems: "baseline", marginBottom: 28 }}>
                <div style={{ fontFamily: ANT, fontSize: 80, color: it.hot ? K.mustard : "#F2F2EE", textShadow: "0 3px 0 rgba(0,0,0,0.6)" }}>#{i === items.length - 1 && it.hot ? 9 : i + 1}</div>
                <div style={{ fontFamily: ANT, fontSize: 80, color: it.hot ? K.mustard : "#F2F2EE", letterSpacing: 4, textShadow: "0 3px 0 rgba(0,0,0,0.6)" }}>{it.txt}</div>
              </Pop>
            ))}
          </div>
        </div>
      </div>
    </Bg>
  );
};

// ═══ 4 · Balanza de carnicero: 55 años (INTRO) ═══
export const BnScale: P<{ num: number; txt: string; t: number }> = ({ a, num, txt, t }) => {
  const { f, at } = useT(a);
  const sw = sp(f, at(t) - 4, 7, 60), n = Math.round(num * cl(sw));
  const ang = -130 + 260 * (num / 60) * sw;
  return (
    <Bg bg={woodBg}>
      <Glow x="40%" y="20%" />
      <div style={{ position: "absolute", left: 200, top: 120, width: 820, height: 820, borderRadius: "50%", background: chromeBg, boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #FFFDF5, #EDE6D4)", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ position: "absolute", inset: 20, borderRadius: "50%", background: "repeating-conic-gradient(from -130deg, #2A2A2A 0 0.7deg, transparent 0.7deg 4.33deg)", WebkitMaskImage: "radial-gradient(circle, transparent 0 84%, #000 85%)", maskImage: "radial-gradient(circle, transparent 0 84%, #000 85%)" }} />
          {[0, 10, 20, 30, 40, 50, 60].map((m) => {
            const an = (-130 + 260 * m / 60) * Math.PI / 180;
            return <A key={m} s={50} c={K.ink} st={{ position: "absolute", left: 370 + 270 * Math.sin(an) - 40, top: 370 - 270 * Math.cos(an) - 26, width: 80, textAlign: "center" }}>{m}</A>;
          })}
          <div style={{ position: "absolute", left: 365, top: 90, width: 10, height: 290, background: K.red, borderRadius: 5, transformOrigin: "50% 280px", transform: `rotate(${ang}deg)`, boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }} />
          <div style={{ position: "absolute", left: 330, top: 330, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #666, #111)" }} />
          <Hd s={44} c="#6A5A48" st={{ position: "absolute", top: 480, width: "100%", textAlign: "center" }}>years on the scale</Hd>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1110, top: 300 }}>
        <A s={300} c={K.cream} st={{ textShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>{n}</A>
        <Pop f={f} at={at(t) + 14}><A s={80} c={K.mustard}>{txt}</A></Pop>
        <Pop f={f} at={at(t) + 24}><Hd s={60} c={K.cream} st={{ marginTop: 10 }}>east tennessee · this smokehouse</Hd></Pop>
      </div>
    </Bg>
  );
};

// ═══ 5 · Almanaque de pared: sábado 1958 (STORY) ═══
export const BnCalendar: P<{ t: number }> = ({ a, t }) => {
  const { f, at } = useT(a);
  const flip = v(f, at(t) - 8, 16);
  return (
    <Bg bg={`repeating-linear-gradient(90deg, #D8CDB5 0 60px, #CFC2A6 60px 120px)`}>
      <Glow x="50%" y="30%" op={0.25} />
      <div style={{ position: "absolute", left: 560, top: 70, width: 800, height: 940, background: paperBg, boxShadow: SH, borderRadius: 8 }}>
        <div style={{ height: 120, background: K.red, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}><A s={84}>OCTOBER 1958</A></div>
        <A s={110} c={K.ink} st={{ textAlign: "center", marginTop: 40 }}>SATURDAY</A>
        <A s={380} c={K.red} st={{ textAlign: "center", lineHeight: 1 }}>18</A>
        <Write f={f} at={at(t) + 12} dur={18}><Hd s={64} c="#2B3550" st={{ textAlign: "center" }}>Granddaddy cuts the bacon</Hd></Write>
        <Write f={f} at={at(t) + 28} dur={18}><Hd s={64} c="#2B3550" st={{ textAlign: "center" }}>Grandmama · cold skillet</Hd></Write>
      </div>
      {/* hoja anterior que se arranca */}
      <div style={{ position: "absolute", left: 560, top: 190, width: 800, height: 820, background: paperBg, boxShadow: SH, transformOrigin: "50% 0", transform: `perspective(1400px) rotateX(${flip * 110}deg)`, opacity: 1 - v(f, at(t) + 4, 8) }}>
        <A s={380} c="#444" st={{ textAlign: "center", marginTop: 160 }}>17</A>
      </div>
      {[640, 1240].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 50, width: 40, height: 60, borderRadius: 10, background: chromeBg, boxShadow: SH }} />)}
    </Bg>
  );
};

// ═══ 6 · Truco numerado: comanda en el riel del diner (ONE…NINE) ═══
export const BnTrick: P<{ n: number; name: string; sub: string; t: number; hot?: boolean }> = ({ a, n, name, sub, t, hot }) => {
  const { f, at } = useT(a);
  const k = sp(f, at(t) - 6, 12, 110);
  return (
    <Bg bg={tileBg} st={tileSz}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25), transparent 40%)" }} />
      {/* riel de comandas */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 70, background: chromeBg, boxShadow: SH }} />
      <div style={{ position: "absolute", left: 560 - (1 - k) * 1400, top: 140, width: 800, transformOrigin: "50% 0", transform: `rotate(${(1 - k) * 8 + 1.5 * Math.sin(f / 18) * (1 - v(f, at(t) + 20, 30))}deg)` }}>
        <div style={{ height: 820, background: paperBg, boxShadow: SH, clipPath: "polygon(0 0, 100% 0, 100% 97%, 96% 100%, 92% 97%, 88% 100%, 84% 97%, 80% 100%, 76% 97%, 72% 100%, 68% 97%, 64% 100%, 60% 97%, 56% 100%, 52% 97%, 48% 100%, 44% 97%, 40% 100%, 36% 97%, 32% 100%, 28% 97%, 24% 100%, 20% 97%, 16% 100%, 12% 97%, 8% 100%, 4% 97%, 0 100%)", padding: "40px 60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "4px solid #222", paddingBottom: 16 }}>
            <A s={48} c={K.ink}>CLYDE'S · ORDER</A><A s={48} c={hot ? K.red : K.teal}>TABLE {n}</A>
          </div>
          <A s={60} c={hot ? K.red : K.teal} st={{ marginTop: 40 }}>TRICK</A>
          <A s={330} c={hot ? K.red : K.ink} st={{ lineHeight: 0.95 }}>#{n}</A>
          <A s={name.length > 16 ? 70 : 88} c={K.ink} st={{ marginTop: 10 }}>{name}</A>
          <Write f={f} at={at(t) + 10} dur={16}><Hd s={58} c="#2B3550" st={{ marginTop: 18 }}>{sub}</Hd></Write>
        </div>
      </div>
    </Bg>
  );
};

// ═══ 7 · Grosor: fino vs grueso con regla (ONE) ═══
export const BnThick: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const k1 = sp(f, at(t) - 4, 13, 120), k2 = sp(f, at(t2) - 2, 13, 120);
  const sl = (h: number, k: number, x: number, ok: boolean, lab: string, sub: string) => (
    <div style={{ position: "absolute", left: x, top: 230, width: 700, opacity: cl(k * 1.5), transform: `translateY(${(1 - k) * 60}px)` }}>
      <div style={{ height: 380, position: "relative" }}>
        <div style={{ position: "absolute", left: 40, top: 190 - h / 2, width: 620, height: h, borderRadius: 8, background: `linear-gradient(90deg, ${K.fat} 0 12%, ${K.meat} 12% 30%, ${K.fat} 30% 42%, ${K.meat} 42% 70%, ${K.fat} 70% 82%, ${K.meat} 82% 100%)`, boxShadow: "0 14px 24px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 670, top: 190 - h / 2, width: 6, height: h, background: K.ink }} />
        <A s={44} c={K.ink} st={{ position: "absolute", left: 684, top: 190 - 22 }}>{lab}</A>
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}><Badge f={f} at={(ok ? at(t2) : at(t)) + 10} ok={ok} /><Hd s={60} c={ok ? K.green : K.red}>{sub}</Hd></div>
    </div>
  );
  return (
    <Bg bg={butcherBg}>
      {/* regla */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 110, background: `repeating-linear-gradient(90deg, #333 0 3px, transparent 3px 30px), repeating-linear-gradient(90deg, #333 0 4px, transparent 4px 120px), linear-gradient(180deg, #F3D46B, #D9B444)`, backgroundSize: "auto 40px, auto 70px, auto", backgroundRepeat: "repeat-x", boxShadow: SH }} />
      {sl(16, k1, 80, false, "1/16\"", "paper thin · burns first")}
      {sl(64, k2, 1060, true, "1/8\"", "thick cut · fries even")}
    </Bg>
  );
};

// ═══ 8 · Etiqueta "water added": la tira se encoge (ONE_3) ═══
export const BnWater: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const circ = v(f, at(t) + 4, 14), shr = v(f, at(t2), 30);
  return (
    <Bg bg={counterBg}>
      <Glow />
      <div style={{ position: "absolute", left: 160, top: 160, width: 780, height: 760, borderRadius: 20, background: "linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12))", border: "4px solid rgba(255,255,255,0.5)", boxShadow: SH, overflow: "hidden" }}>
        {[0, 1, 2, 3].map((i) => <Strip key={i} w={640} h={110} cook={0} st={{ left: 70, top: 300 + i * 100 }} />)}
        <div style={{ position: "absolute", left: 60, top: 50, width: 660, height: 200, background: K.cream, borderRadius: 10, padding: "20px 30px", boxShadow: "0 6px 12px rgba(0,0,0,0.25)" }}>
          <A s={56} c={K.red}>SLICED BACON</A>
          <div style={{ fontFamily: "Arial", fontSize: 30, color: "#555", marginTop: 8, position: "relative", display: "inline-block" }}>cured with WATER ADDED, salt, sugar…
            <div style={{ position: "absolute", left: 120, top: -16, width: 280, height: 70, borderRadius: "50%", border: `6px solid ${K.red}`, clipPath: `inset(0 ${100 - circ * 100}% 0 0)` }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 220, width: 760 }}>
        <A s={92} c={K.cream}>WATER ADDED</A>
        <Hd s={60} c="#D9EFEC" st={{ marginTop: 10 }}>steams instead of frying</Hd>
        <div style={{ position: "relative", height: 300, marginTop: 40 }}>
          <Strip w={700} cook={0.7} shrink={shr} st={{ left: 0, top: 60 }} />
          <div style={{ position: "absolute", left: 0, top: 220, width: 700, height: 6, background: "rgba(255,255,255,0.4)" }} />
        </div>
        <Pop f={f} at={at(t2) + 20}><A s={80} c={K.mustard}>SHRINKS TO HALF</A></Pop>
      </div>
    </Bg>
  );
};

// ═══ 9 · Sartén fría vs sartén ardiendo: curva de temperatura (THREE) ═══
export const BnColdPan: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const p1 = v(f, at(t), 40), p2 = v(f, at(t2), 30);
  const W = 1300, H = 520;
  const pts = (fn: (x: number) => number, p: number) => Array.from({ length: 40 }).map((_, i) => i / 39).filter((x) => x <= p).map((x) => `${(x * W).toFixed(0)},${(H - fn(x) * H).toFixed(0)}`).join(" ");
  return (
    <Bg bg={`linear-gradient(180deg, #1E2A2E, #111719)`}>
      <A s={84} c={K.cream} st={{ position: "absolute", left: 160, top: 80 }}>START IN A COLD PAN</A>
      <div style={{ position: "absolute", left: 300, top: 260, width: W, height: H, borderLeft: "4px solid #8A9A9E", borderBottom: "4px solid #8A9A9E",
        background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 104px)" }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <polyline points={pts((x) => 0.95 - 0.1 * Math.exp(-x * 6), 1)} fill="none" stroke={K.red} strokeWidth={10} strokeLinecap="round" opacity={0.3 + 0.7 * cl(p2 * 3)} strokeDasharray="22 16" />
          <polyline points={pts((x) => 0.1 + 0.72 * (1 - Math.exp(-x * 2.3)), p1)} fill="none" stroke={K.mustard} strokeWidth={12} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: -10, right: 0, top: H - 0.38 * H, borderTop: "3px dashed rgba(255,255,255,0.4)" }} />
        <Hd s={44} c="#CFE0E2" st={{ position: "absolute", left: 20, top: H - 0.38 * H - 60 }}>fat starts melting</Hd>
        <Pop f={f} at={at(t2) + 4} st={{ position: "absolute", left: 30, top: -40 }}><A s={50} c={K.red}>HOT PAN · MEAT SEIZES & CURLS</A></Pop>
        <Pop f={f} at={at(t) + 30} st={{ position: "absolute", left: 620, top: 250 }}><A s={50} c={K.mustard}>COLD PAN · FAT MELTS FIRST</A></Pop>
        <Hd s={40} c="#8A9A9E" st={{ position: "absolute", left: W - 140, top: H + 14 }}>minutes →</Hd>
        <Hd s={40} c="#8A9A9E" st={{ position: "absolute", left: -120, top: -10 }}>heat</Hd>
      </div>
    </Bg>
  );
};

// ═══ 10 · No amontonar: 6 tiras en 12 pulgadas (FOUR_2) ═══
export const BnCrowd: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Bg bg={woodBg}>
      <Glow />
      <Skillet x={120} y={230} d={640}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Strip key={i} w={480} h={70} cook={0.2} st={{ left: 40, top: 70 + i * 40, transform: `rotate(${(i % 2 ? 6 : -5)}deg)` }} />)}
      </Skillet>
      <Skillet x={1060} y={230} d={640}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Pop key={i} f={f} at={at(t2) + i * 3} dy={-60}><Strip w={460} h={52} cook={0.5} st={{ left: 70, top: 66 + i * 62 }} /></Pop>)}
      </Skillet>
      <div style={{ position: "absolute", left: 120, top: 90, width: 640, display: "flex", gap: 20, alignItems: "center" }}><Badge f={f} at={at(t)} ok={false} /><A s={64} c={K.cream}>CROWDED · STEAMS</A></div>
      <div style={{ position: "absolute", left: 1060, top: 90, width: 760, display: "flex", gap: 20, alignItems: "center" }}><Badge f={f} at={at(t2) + 14} ok /><A s={64} c={K.cream}>6 STRIPS · ROOM TO FRY</A></div>
    </Bg>
  );
};

// ═══ 11 · El fuego: medio-bajo; el azúcar se quema antes (FIVE) ═══
export const BnHeat: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const knob = sp(f, at(t) - 4, 12, 110), th = v(f, at(t2), 30);
  return (
    <Bg bg={`linear-gradient(180deg, #F1ECE2, #D7CDBB)`}>
      <div style={{ position: "absolute", left: 140, top: 230, width: 580, height: 580, borderRadius: "50%", background: chromeBg, boxShadow: SH }}>
        {["OFF", "LOW", "MED-LOW", "MED", "HIGH"].map((s, i) => {
          const an = (-120 + i * 60) * Math.PI / 180, r = 330;
          return <A key={s} s={40} c={i === 2 ? K.green : i === 4 ? K.red : K.ink} st={{ position: "absolute", left: 290 + r * Math.sin(an) - 70, top: 290 - r * Math.cos(an) - 20, width: 140, textAlign: "center" }}>{s}</A>;
        })}
        <div style={{ position: "absolute", inset: 100, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3A3A3A, #0F0F0F)", transform: `rotate(${-120 + 120 * knob}deg)` }}>
          <div style={{ position: "absolute", left: 180, top: 12, width: 20, height: 150, borderRadius: 10, background: K.cream }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 120, width: 900 }}>
        <A s={96} c={K.ink}>MEDIUM LOW. THAT'S IT.</A>
        <Pop f={f} at={at(t2)} st={{ marginTop: 50 }}>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-end", height: 520 }}>
            {[{ l: "SUGAR BURNS", h: 0.62, c: K.burnt }, { l: "FAT RENDERS ALL THE WAY", h: 0.86, c: K.mustard }].map((b, i) => (
              <div key={i} style={{ width: 380, textAlign: "center" }}>
                <div style={{ height: 420, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div style={{ width: 90, height: 420 * b.h * th, borderRadius: "45px 45px 0 0", background: `linear-gradient(180deg, ${b.c}, ${i ? "#B57A1C" : "#5A3420"})`, boxShadow: SH }} />
                </div>
                <A s={44} c={b.c === K.burnt ? K.red : "#8A5A12"} st={{ marginTop: 16 }}>{b.l}</A>
              </div>
            ))}
          </div>
          <Hd s={54} c="#5A4A3A">high heat: the sugar goes black before the fat is done</Hd>
        </Pop>
      </div>
    </Bg>
  );
};

// ═══ 12 · Dos cucharadas de agua: se evapora y empieza a freír (SIX) ═══
export const BnWaterPan: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const water = 1 - v(f, at(t2), 70), crack = v(f, at(t3), 10);
  return (
    <Bg bg={woodBg}>
      <Glow />
      <Skillet x={180} y={200} d={720}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, rgba(170,200,215,${0.55 * water}) 0 60%, transparent 70%)` }} />
        {[0, 1, 2, 3, 4].map((i) => <Strip key={i} w={520} h={60} cook={0.15 + 0.5 * (1 - water)} st={{ left: 60, top: 100 + i * 82 }} />)}
        {water > 0.05 ? <Bubbles f={f} w={600} h={600} n={Math.round(20 * water)} big={30} /> : null}
      </Skillet>
      <div style={{ position: "absolute", left: 1000, top: 140, width: 820 }}>
        <Pop f={f} at={at(t)}><A s={110} c={K.cream}>2 TBSP WATER</A></Pop>
        <Pop f={f} at={at(t) + 10}><Hd s={60} c={K.cream}>in the cold pan, with the bacon</Hd></Pop>
        <div style={{ marginTop: 60, background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: "24px 30px" }}>
          <A s={46} c={K.cream}>WATER IN THE PAN</A>
          <div style={{ marginTop: 14, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
            <div style={{ width: `${water * 100}%`, height: "100%", background: `linear-gradient(90deg, ${K.blue}, #8EC1E8)`, borderRadius: 20 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
            <Hd s={50} c={crack > 0.5 ? "#9AA" : "#BFE3F5"}>soft bubbling</Hd>
            <Hd s={50} c={crack > 0.5 ? K.mustard : "#9AA"}>→ sharp crackle</Hd>
          </div>
        </div>
        <Pop f={f} at={at(t3) + 4} st={{ marginTop: 40 }}><div style={{ display: "inline-block", background: K.red, padding: "14px 28px", borderRadius: 10, boxShadow: SH }}><A s={56}>NOW IT FRIES · DON'T WALK AWAY</A></div></Pop>
      </div>
    </Bg>
  );
};

// ═══ 13 · Pinza, no tenedor (SEVEN) ═══
export const BnTongs: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const drip = (f % 30) / 30;
  return (
    <Bg bg={butcherBg}>
      <Glow />
      <div style={{ position: "absolute", left: 140, top: 160, width: 780, height: 760, opacity: cl(sp(f, at(t) - 4, 13, 120) * 1.5) }}>
        <Strip w={640} cook={0.6} st={{ left: 60, top: 360 }} />
        {/* tenedor */}
        <div style={{ position: "absolute", left: 300, top: 40, width: 40, height: 330, background: chromeBg, borderRadius: 10, boxShadow: SH }} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 260 + i * 36, top: 300, width: 14, height: 120, background: chromeBg, borderRadius: 7 }} />)}
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 262 + i * 36, top: 480 + drip * 120, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%", background: K.mustard, opacity: 1 - drip }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", gap: 20, justifyContent: "center", alignItems: "center" }}><Badge f={f} at={at(t) + 8} ok={false} /><A s={60} c={K.red}>FORK · HOLES · FAT RUNS OUT</A></div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 160, width: 780, height: 760, opacity: cl(sp(f, at(t2) - 4, 13, 120) * 1.5) }}>
        <Strip w={640} cook={0.6} st={{ left: 60, top: 360, transform: `rotate(${-6 * Math.sin(f / 14)}deg)` }} />
        <div style={{ position: "absolute", left: 340, top: 40, width: 30, height: 360, background: chromeBg, borderRadius: 14, transform: "rotate(-8deg)", transformOrigin: "50% 100%", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 380, top: 40, width: 30, height: 360, background: chromeBg, borderRadius: 14, transform: "rotate(8deg)", transformOrigin: "50% 100%", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", gap: 20, justifyContent: "center", alignItems: "center" }}><Badge f={f} at={at(t2) + 8} ok /><A s={60} c={K.green}>TONGS · TURN IT OFTEN</A></div>
      </div>
    </Bg>
  );
};

// ═══ 14 · Sacarlo dorado: sigue cocinándose 1 minuto (EIGHT) ═══
export const BnPull: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const mark = v(f, at(t), 16), carry = v(f, at(t2), 40);
  const sw = ["#E8C9A8", "#DDA36A", "#C98236", "#A85F22", "#7A3E16", "#3A1D0C"];
  return (
    <Bg bg={`linear-gradient(180deg, #2A2320, #15110F)`}>
      <A s={88} c={K.cream} st={{ position: "absolute", left: 160, top: 90 }}>PULL IT GOLDEN</A>
      <div style={{ position: "absolute", left: 160, top: 330, width: 1600, height: 220, display: "flex", borderRadius: 18, overflow: "hidden", boxShadow: SH }}>
        {sw.map((c, i) => <div key={i} style={{ flex: 1, background: `linear-gradient(180deg, ${c}, ${c}cc)`, borderRight: "3px solid rgba(0,0,0,0.25)" }} />)}
      </div>
      {["raw", "pale", "golden", "deep brown", "dark", "burnt"].map((s, i) => <Hd key={s} s={44} c="#CFC4B6" st={{ position: "absolute", left: 160 + i * 267, width: 267, textAlign: "center", top: 570 }}>{s}</Hd>)}
      <div style={{ position: "absolute", left: 160 + 2.5 * 267 - 6, top: 290 - 20 + (1 - mark) * -80, opacity: mark }}>
        <div style={{ width: 12, height: 300, background: K.mustard, borderRadius: 6 }} />
        <A s={54} c={K.mustard} st={{ position: "absolute", left: -110, top: -70, width: 240, textAlign: "center" }}>PULL HERE</A>
      </div>
      <div style={{ position: "absolute", left: 160 + 2.5 * 267, top: 720, width: 267 * carry * 1.05, height: 14, background: K.cream, borderRadius: 7 }} />
      <div style={{ position: "absolute", left: 160 + 2.5 * 267 + 267 * carry * 1.05 - 14, top: 704, width: 0, height: 0, borderTop: "23px solid transparent", borderBottom: "23px solid transparent", borderLeft: `40px solid ${K.cream}`, opacity: carry > 0.05 ? 1 : 0 }} />
      <Pop f={f} at={at(t2) + 16} st={{ position: "absolute", left: 160 + 2.5 * 267, top: 780 }}><A s={60} c={K.cream}>+1 MINUTE ON THE PLATE = PERFECT</A></Pop>
    </Bg>
  );
};

// ═══ 15 · Las muescas del abuelo: cortar el "cordón" (NINE) ═══
export const BnNotch: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const notch = v(f, at(t), 30), curlBad = v(f, at(t2), 20);
  const knifeX = 140 + 1500 * v(f, at(t), 30);
  return (
    <Bg bg={butcherBg}>
      <Glow />
      <A s={80} c={K.ink} st={{ position: "absolute", left: 140, top: 70 }}>NOTCH THE FAT EDGE · EVERY INCH</A>
      <div style={{ position: "absolute", left: 140, top: 230, width: 1640, height: 260 }}>
        <Strip w={1600} h={150} cook={0} notch={notch} st={{ left: 0, top: 60 }} />
        <div style={{ position: "absolute", left: knifeX - 1640 * 0 - 140, top: -40, width: 34, height: 170, background: chromeBg, borderRadius: "4px 4px 17px 17px", boxShadow: SH, opacity: notch > 0 && notch < 1 ? 1 : 0, transform: "rotate(18deg)" }} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 560, width: 760, height: 420, opacity: cl(sp(f, at(t2) - 4, 13, 120) * 1.4) }}>
        <Hd s={56} c={K.red}>skin edge shrinks = drawstring</Hd>
        <Strip w={640} h={90} cook={0.6} curl={curlBad} f={f} st={{ left: 40, top: 200 }} />
      </div>
      <div style={{ position: "absolute", left: 1020, top: 560, width: 760, height: 420, opacity: cl(sp(f, at(t3) - 4, 13, 120) * 1.4) }}>
        <Hd s={56} c={K.green}>cut the drawstring = lies flat</Hd>
        <Strip w={640} h={90} cook={0.6} notch={1} st={{ left: 40, top: 200 }} />
        <div style={{ position: "absolute", left: 300, top: 320 }}><Badge f={f} at={at(t3) + 10} ok /></div>
      </div>
    </Bg>
  );
};

// ═══ 16 · La plata: por porción (MONEY) ═══
export const BnMoney: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const card = (x: number, k: number, top: string, price: string, per: string, c: string, shr: number, rot: number) => (
    <div style={{ position: "absolute", left: x, top: 170, width: 720, height: 760, opacity: cl(k * 1.5), transform: `translateY(${(1 - k) * 60}px) rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: paperBg, borderRadius: 16, boxShadow: SH, padding: "40px 50px" }}>
        <Hd s={56} c="#6A5A48">{top}</Hd>
        <A s={150} c={K.ink}>{price}</A>
        <div style={{ position: "relative", height: 200, marginTop: 20 }}>
          <Strip w={600} h={80} cook={0.7} shrink={shr} st={{ left: 0, top: 50 }} />
        </div>
        <div style={{ borderTop: "4px dashed #B5AA92", paddingTop: 24 }}><A s={92} c={c}>{per}</A><Hd s={46} c="#6A5A48">a serving</Hd></div>
      </div>
    </div>
  );
  return (
    <Bg bg={counterBg}>
      {card(160, sp(f, at(t) - 4, 13, 120), "12 oz package, thin, cooked hot", "$7.99", "$2.00", K.red, 0.8, -2)}
      {card(1040, sp(f, at(t2) - 4, 13, 120), "1 lb thick cut, off the slab", "$6.99", "$1.15", K.green, 0.05, 2)}
    </Bg>
  );
};

// ═══ 17 · El frasco de grasa: cada sábado un poco más (MONEY_3 / GREASE) ═══
export const BnGrease: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const lv = 0.15 + 0.7 * v(f, at(t), 60);
  return (
    <Bg bg={tileBg} st={tileSz}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,250,240,0.55), rgba(255,250,240,0.25))" }} />
      <div style={{ position: "absolute", left: 300, top: 140, width: 480, height: 780 }}>
        <div style={{ position: "absolute", left: 40, top: 0, width: 400, height: 90, borderRadius: 14, background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 4px, transparent 4px 14px), ${chromeBg}`, boxShadow: SH }} />
        <div style={{ position: "absolute", left: 0, top: 80, width: 480, height: 700, borderRadius: "50px 50px 70px 70px", border: "6px solid rgba(255,255,255,0.75)", background: "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.35))", boxShadow: "0 30px 60px rgba(0,0,0,0.25)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: `repeating-linear-gradient(0deg, rgba(220,200,170,0.5) 0 3px, transparent 3px 60px), linear-gradient(180deg, #FBF5E6, #EFE2C6)` }} />
          <div style={{ position: "absolute", left: 50, top: 30, width: 46, height: 600, borderRadius: 23, background: "linear-gradient(90deg, rgba(255,255,255,0.7), transparent)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 860, top: 150, width: 920, padding: "40px 50px", background: paperBg, borderRadius: 16, boxShadow: SH }}>
        <A s={110} c={K.ink}>BACON GREASE</A>
        <Hd s={64} c="#5A4A3A">strain it into a jar · keeps for months</Hd>
        <Pop f={f} at={at(t2)} st={{ marginTop: 50, display: "flex", gap: 40, alignItems: "center" }}>
          <div style={{ position: "relative" }}><A s={110} c="#777">$5–6</A><div style={{ position: "absolute", left: -10, right: -10, top: 52, height: 12, background: K.red, transform: "rotate(-8deg)" }} /></div>
          <A s={110} c={K.green}>FREE</A>
        </Pop>
        <Pop f={f} at={at(t2) + 16} st={{ marginTop: 40 }}><Hd s={58} c="#5A4A3A">eggs · beans · greens · cornbread</Hd></Pop>
      </div>
    </Bg>
  );
};

// ═══ 18 · Repaso en libreta de comandas (RECAP) ═══
export const BnRecap: P<{ items: string[]; ts: number[]; start?: number }> = ({ a, items, ts, start = 0 }) => {
  const { f, at } = useT(a);
  return (
    <Bg bg={counterBg}>
      <div style={{ position: "absolute", left: 420, top: 50, width: 1080, height: 980, background: `repeating-linear-gradient(180deg, transparent 0 77px, rgba(59,111,182,0.35) 77px 80px), ${K.paper}`, boxShadow: SH, borderRadius: 10, padding: "30px 70px" }}>
        <div style={{ height: 30, margin: "-30px -70px 20px", background: K.red, borderRadius: "10px 10px 0 0" }} />
        <A s={64} c={K.red}>ONE MORE TIME · 9 TRICKS</A>
        {items.map((it, i) => {
          const on = f >= at(ts[i]);
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, height: 88, opacity: on ? 1 : 0.2 }}>
            <A s={52} c={K.teal} st={{ width: 60 }}>{i + 1 + start}</A>
            <Hd s={58} c={K.ink}>{it}</Hd>
            {on ? <div style={{ marginLeft: "auto", fontFamily: ANT, fontSize: 60, color: K.green, transform: `scale(${sp(f, at(ts[i]), 10, 220)})` }}>✓</div> : null}
          </div>;
        })}
      </div>
    </Bg>
  );
};

// ═══ 19 · Comentario: ¿cómo te gusta el tocino? (COMMENT) ═══
export const BnComment: P<{ q: string; opts: string[]; t: number; t2: number }> = ({ a, q, opts, t, t2 }) => {
  const { f, at } = useT(a);
  const k = sp(f, at(t) - 6, 14, 120);
  return (
    <Bg bg={tileBg} st={tileSz}>
      <AbsoluteFill style={{ background: "rgba(246,236,220,0.55)" }} />
      <div style={{ position: "absolute", left: 360, top: 130, width: 1200, padding: "50px 60px", background: "#FFFFFF", borderRadius: 30, boxShadow: SH, transform: `translateY(${(1 - k) * 80}px)`, opacity: cl(k * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${K.red}, ${K.redD})`, color: K.cream, fontFamily: ANT, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>C</div>
          <div><A s={46} c={K.ink}>Clyde's Smokehouse</A><Hd s={40} c="#777">tell me in the comments</Hd></div>
        </div>
        <A s={84} c={K.ink} st={{ margin: "40px 0 30px" }}>{q}</A>
        <div style={{ display: "flex", gap: 30 }}>
          {opts.map((o, i) => (
            <Pop key={i} f={f} at={at(t) + 10 + i * 8} st={{ flex: 1 }}>
              <div style={{ height: 300, borderRadius: 20, background: "#F3EEE4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "30px 10px" }}>
                <div style={{ height: 150, width: "100%", position: "relative" }}><Strip w={260} h={56} cook={0.35 + i * 0.3} curl={0} st={{ left: 40, top: 46 }} /></div>
                <A s={46} c={K.ink}>{o}</A>
              </div>
            </Pop>
          ))}
        </div>
        <Pop f={f} at={at(t2)}><Hd s={56} c={K.red} st={{ marginTop: 24 }}>…and what were you doing wrong before today?</Hd></Pop>
      </div>
    </Bg>
  );
};
